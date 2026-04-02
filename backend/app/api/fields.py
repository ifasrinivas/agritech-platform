import json
import uuid

from fastapi import APIRouter, Depends, HTTPException
from shapely.geometry import shape, mapping
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.farm import Farm
from app.models.field import Field, HAS_POSTGIS
from app.schemas.field import FieldCreate, FieldUpdate, FieldResponse, GeoJSONPolygon, Coordinate

# PostGIS helpers (only import if available)
if HAS_POSTGIS:
    from geoalchemy2.shape import from_shape, to_shape

router = APIRouter(prefix="/fields", tags=["Fields"])


def _geom_to_db(geom):
    """Convert shapely geometry to DB-storable format."""
    if HAS_POSTGIS:
        return from_shape(geom, srid=4326)
    return geom.wkt  # Store as WKT text for SQLite


def _db_to_geom(db_val):
    """Convert DB-stored geometry back to shapely."""
    if db_val is None:
        return None
    if HAS_POSTGIS:
        return to_shape(db_val)
    # SQLite: stored as WKT text
    from shapely import wkt
    return wkt.loads(db_val)


@router.post("", response_model=FieldResponse, status_code=201)
async def create_field(data: FieldCreate, db: AsyncSession = Depends(get_db)):
    """Create a field with GPS boundary polygon."""
    farm = await db.get(Farm, data.farm_id)
    if not farm:
        raise HTTPException(404, "Farm not found")

    geojson = data.to_geojson_polygon()
    geom = shape(geojson)

    if not geom.is_valid:
        raise HTTPException(400, "Invalid polygon geometry")
    if geom.area == 0:
        raise HTTPException(400, "Polygon has zero area. Need at least 3 distinct points.")

    field = Field(
        farm_id=data.farm_id,
        name=data.name,
        crop=data.crop,
        area=data.area,
        soil_type=data.soil_type,
        sowing_date=data.sowing_date,
        expected_harvest=data.expected_harvest,
        irrigation_type=data.irrigation_type,
        boundary=_geom_to_db(geom),
        centroid=_geom_to_db(geom.centroid),
    )
    db.add(field)
    await db.commit()
    await db.refresh(field)
    return _to_response(field)


@router.get("/{field_id}", response_model=FieldResponse)
async def get_field(field_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")
    return _to_response(field)


@router.get("", response_model=list[FieldResponse])
async def list_fields(
    farm_id: uuid.UUID | None = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Field).offset(skip).limit(limit).order_by(Field.created_at.desc())
    if farm_id:
        stmt = stmt.where(Field.farm_id == farm_id)
    result = await db.execute(stmt)
    return [_to_response(f) for f in result.scalars().all()]


@router.put("/{field_id}", response_model=FieldResponse)
async def update_field(
    field_id: uuid.UUID,
    data: FieldUpdate,
    db: AsyncSession = Depends(get_db),
):
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")

    update_data = data.model_dump(exclude_unset=True, exclude={"coordinates", "boundary"})
    for key, value in update_data.items():
        setattr(field, key, value)

    if data.coordinates or data.boundary:
        if data.boundary:
            geojson = data.boundary.model_dump()
        else:
            ring = [[c.longitude, c.latitude] for c in data.coordinates]  # type: ignore
            if ring[0] != ring[-1]:
                ring.append(ring[0])
            geojson = {"type": "Polygon", "coordinates": [ring]}

        geom = shape(geojson)
        if not geom.is_valid:
            raise HTTPException(400, "Invalid polygon geometry")
        field.boundary = _geom_to_db(geom)
        field.centroid = _geom_to_db(geom.centroid)

    await db.commit()
    await db.refresh(field)
    return _to_response(field)


@router.delete("/{field_id}", status_code=204)
async def delete_field(field_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")
    await db.delete(field)
    await db.commit()


def _to_response(field: Field) -> FieldResponse:
    """Convert Field model to response."""
    boundary_geojson = None
    centroid_coord = None

    geom = _db_to_geom(field.boundary)
    if geom:
        coords = [list(geom.exterior.coords)]
        boundary_geojson = GeoJSONPolygon(type="Polygon", coordinates=coords)

    centroid_geom = _db_to_geom(field.centroid)
    if centroid_geom:
        centroid_coord = Coordinate(latitude=centroid_geom.y, longitude=centroid_geom.x)

    return FieldResponse(
        id=field.id,
        farm_id=field.farm_id,
        name=field.name,
        crop=field.crop,
        area=field.area,
        soil_type=field.soil_type,
        sowing_date=field.sowing_date,
        expected_harvest=field.expected_harvest,
        irrigation_type=field.irrigation_type,
        boundary=boundary_geojson,
        centroid=centroid_coord,
        created_at=field.created_at,
        updated_at=field.updated_at,
    )
