"""
Quick setup endpoint: creates farmer + farm + field in one call.
Returns all IDs + triggers NDVI + soil analysis automatically.
Designed for the mobile add-field flow.
"""
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field as PydField
from shapely.geometry import shape
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.dependencies import get_db
from app.models.farmer import Farmer
from app.models.farm import Farm
from app.models.field import Field
from app.api.fields import _geom_to_db, _to_response
from app.services import ndvi_pipeline, soil_analysis_service, sentinel_service
from app.services.ndvi_pipeline import field_boundary_to_geojson


class QuickFieldRequest(BaseModel):
    """One-shot field creation with auto farmer/farm."""
    field_name: str = PydField(max_length=255)
    crop: str = PydField(max_length=100)
    area: float = PydField(gt=0)
    soil_type: str | None = None
    sowing_date: str | None = None  # YYYY-MM-DD
    irrigation_type: str | None = None
    coordinates: list[dict]  # [{latitude, longitude}, ...]

    # Optional: reuse existing farmer/farm
    farmer_name: str = "App User"
    farm_name: str = "My Farm"
    location: str | None = None


router = APIRouter(tags=["Quick Setup"])


@router.post("/quick-add-field")
async def quick_add_field(data: QuickFieldRequest, db: AsyncSession = Depends(get_db)):
    """
    One-call field creation:
    1. Creates farmer (or reuses first existing)
    2. Creates farm (or reuses first existing)
    3. Creates field with GPS boundary
    4. Triggers NDVI satellite analysis
    5. Fetches soil report
    6. Searches Sentinel-2 scenes
    Returns everything in one response.
    """
    # Step 1: Get or create farmer
    stmt = select(Farmer).limit(1)
    result = await db.execute(stmt)
    farmer = result.scalar_one_or_none()
    if not farmer:
        farmer = Farmer(name=data.farmer_name, phone=f"+91{uuid.uuid4().hex[:10]}", location=data.location)
        db.add(farmer)
        await db.flush()

    # Step 2: Create new farm for this location (one farmer can have many farms)
    farm = Farm(
        farmer_id=farmer.id,
        name=data.farm_name,
        total_area=data.area,
        location_name=data.location,
    )
    db.add(farm)
    await db.flush()

    # Step 3: Create field with boundary
    ring = [[c["longitude"], c["latitude"]] for c in data.coordinates]
    if ring[0] != ring[-1]:
        ring.append(ring[0])
    geojson = {"type": "Polygon", "coordinates": [ring]}
    geom = shape(geojson)

    if not geom.is_valid or geom.area == 0:
        raise HTTPException(400, "Invalid polygon. Need at least 3 distinct points.")

    from datetime import date as date_type
    sowing = None
    if data.sowing_date:
        try:
            sowing = date_type.fromisoformat(data.sowing_date)
        except ValueError:
            pass

    field = Field(
        farm_id=farm.id,
        name=data.field_name,
        crop=data.crop,
        area=data.area,
        soil_type=data.soil_type,
        sowing_date=sowing,
        irrigation_type=data.irrigation_type,
        boundary=_geom_to_db(geom),
        centroid=_geom_to_db(geom.centroid),
    )
    db.add(field)
    await db.commit()
    await db.refresh(field)

    field_resp = _to_response(field)

    # Step 4: NDVI analysis
    ndvi_result = None
    try:
        ndvi_result = await ndvi_pipeline.analyze_field(field, db)
    except Exception as e:
        ndvi_result = {"error": str(e)}

    # Step 5: Soil report
    soil_result = None
    try:
        soil_result = await soil_analysis_service.get_full_soil_report(geojson)
    except Exception as e:
        soil_result = {"error": str(e)}

    # Step 6: Sentinel scenes
    sentinel_result = None
    try:
        sentinel_result = await sentinel_service.search_scenes(geojson, days_back=30, limit=5)
    except Exception as e:
        sentinel_result = {"error": str(e)}

    return {
        "status": "success",
        "farmer_id": str(farmer.id),
        "farm_id": str(farm.id),
        "field": field_resp.model_dump() if hasattr(field_resp, "model_dump") else field_resp,
        "ndvi_analysis": ndvi_result.model_dump() if hasattr(ndvi_result, "model_dump") else ndvi_result,
        "soil_report": soil_result,
        "sentinel_scenes": {
            "count": len(sentinel_result) if isinstance(sentinel_result, list) else 0,
            "scenes": sentinel_result[:3] if isinstance(sentinel_result, list) else [],
        },
    }
