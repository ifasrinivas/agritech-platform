"""Sentinel-2 satellite data + soil analysis endpoints."""
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field as PydField
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.field import Field
from app.services import sentinel_service, soil_analysis_service
from app.services.ndvi_pipeline import field_boundary_to_geojson

router = APIRouter(tags=["Sentinel-2 & Soil"])


class PolygonRequest(BaseModel):
    boundary: dict  # GeoJSON Polygon
    crop: str | None = None


# ---- Sentinel-2 Scenes ----

@router.get("/fields/{field_id}/sentinel/scenes")
async def get_field_scenes(
    field_id: uuid.UUID,
    days_back: int = 60,
    max_cloud: int = 30,
    db: AsyncSession = Depends(get_db),
):
    """Get recent Sentinel-2 scenes for a stored field."""
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")
    geojson = field_boundary_to_geojson(field.boundary)
    scenes = await sentinel_service.search_scenes(geojson, days_back, max_cloud)
    return {"field_id": str(field_id), "field_name": field.name, "scenes": scenes, "count": len(scenes)}


@router.post("/sentinel/scenes")
async def search_scenes_adhoc(data: PolygonRequest, days_back: int = 60, max_cloud: int = 30):
    """Search Sentinel-2 scenes for an arbitrary polygon."""
    scenes = await sentinel_service.search_scenes(data.boundary, days_back, max_cloud)
    return {"scenes": scenes, "count": len(scenes)}


# ---- Spectral Indices ----

@router.get("/fields/{field_id}/sentinel/indices")
async def get_field_indices(field_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Get available spectral indices and latest scene for a field."""
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")
    geojson = field_boundary_to_geojson(field.boundary)
    return await sentinel_service.get_spectral_indices(geojson)


# ---- Soil Moisture (Sentinel-2 NDMI proxy) ----

@router.get("/fields/{field_id}/soil-moisture")
async def get_field_soil_moisture(field_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Get satellite-derived soil moisture estimate for a field."""
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")
    geojson = field_boundary_to_geojson(field.boundary)
    return await sentinel_service.get_soil_moisture_proxy(geojson)


# ---- Full Soil Analysis ----

@router.get("/fields/{field_id}/soil-report")
async def get_field_soil_report(field_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Comprehensive soil analysis combining:
    - SoilGrids (pH, NPK, texture, organic carbon)
    - Open-Meteo (real-time soil temperature + moisture)
    - Sentinel-2 (satellite moisture proxy)
    """
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")
    geojson = field_boundary_to_geojson(field.boundary)
    report = await soil_analysis_service.get_full_soil_report(geojson)
    report["field_id"] = str(field_id)
    report["field_name"] = field.name
    report["crop"] = field.crop
    return report


@router.post("/soil-report")
async def get_adhoc_soil_report(data: PolygonRequest):
    """Full soil analysis for an arbitrary polygon (no field storage)."""
    report = await soil_analysis_service.get_full_soil_report(data.boundary)
    report["crop"] = data.crop
    return report


# ---- Field Area Calculation ----

@router.post("/calculate-area")
async def calculate_polygon_area(data: PolygonRequest):
    """Calculate area of a GeoJSON polygon in acres, hectares, sq meters."""
    from shapely.geometry import shape
    poly = shape(data.boundary)
    # Approximate area calculation using lat/lon
    centroid = poly.centroid
    import math
    lat_rad = math.radians(centroid.y)
    m_per_deg_lat = 110540
    m_per_deg_lon = 111320 * math.cos(lat_rad)

    coords = list(poly.exterior.coords)
    n = len(coords) - 1  # exclude closing point
    area_sq_m = 0
    for i in range(n):
        j = (i + 1) % n
        xi = coords[i][0] * m_per_deg_lon
        yi = coords[i][1] * m_per_deg_lat
        xj = coords[j][0] * m_per_deg_lon
        yj = coords[j][1] * m_per_deg_lat
        area_sq_m += xi * yj - xj * yi
    area_sq_m = abs(area_sq_m) / 2

    area_acres = area_sq_m / 4046.86
    area_hectares = area_sq_m / 10000

    return {
        "area_sq_meters": round(area_sq_m, 2),
        "area_acres": round(area_acres, 2),
        "area_hectares": round(area_hectares, 4),
        "area_guntha": round(area_acres * 40, 1),
        "perimeter_meters": round(poly.length * 111320, 1),
        "centroid": {"latitude": round(centroid.y, 6), "longitude": round(centroid.x, 6)},
        "points": len(coords) - 1,
    }
