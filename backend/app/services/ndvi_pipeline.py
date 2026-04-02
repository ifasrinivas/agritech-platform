"""
NDVI Pipeline Orchestrator.
GEE (best) -> STAC fallback (free) -> seasonal estimate.
Computes health score, persists reading, evaluates irrigation alerts.
"""
import logging
import math
from datetime import date, datetime

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.field import Field
from app.models.ndvi_reading import NDVIReading
from app.models.irrigation_alert import IrrigationAlert
from app.services import gee_service, stac_fallback, health_score, irrigation_service
from app.schemas.ndvi import CropHealthResponse
from app.schemas.irrigation import IrrigationAlertResponse

logger = logging.getLogger(__name__)


def field_boundary_to_geojson(boundary_val) -> dict:
    """Convert DB-stored geometry (PostGIS WKB or WKT text) to GeoJSON dict."""
    from app.models.field import HAS_POSTGIS
    if HAS_POSTGIS:
        from geoalchemy2.shape import to_shape
        geom = to_shape(boundary_val)
    else:
        from shapely import wkt
        geom = wkt.loads(boundary_val)
    return {
        "type": "Polygon",
        "coordinates": [list(geom.exterior.coords)],
    }


def compute_days_after_sowing(sowing_date: date | None) -> int | None:
    if sowing_date is None:
        return None
    delta = date.today() - sowing_date
    return delta.days


async def analyze_field(field: Field, db: AsyncSession) -> CropHealthResponse:
    """
    Full pipeline for a stored field:
    1. Fetch NDVI (GEE -> STAC -> estimate)
    2. Compute health score
    3. Persist NDVIReading
    4. Evaluate irrigation alerts
    5. Return full CropHealthResponse
    """
    geojson = field_boundary_to_geojson(field.boundary)

    # Three-tier NDVI fetch
    result = await gee_service.fetch_ndvi(geojson)
    if result is None:
        result = await stac_fallback.fetch_ndvi(geojson)
    if result is None:
        result = stac_fallback._seasonal_estimate()

    das = compute_days_after_sowing(field.sowing_date)
    score, status = health_score.compute(result["ndvi_mean"], field.crop, das)

    # Persist reading
    reading = NDVIReading(
        field_id=field.id,
        ndvi_mean=result["ndvi_mean"],
        ndvi_min=result.get("ndvi_min"),
        ndvi_max=result.get("ndvi_max"),
        ndvi_std=result.get("ndvi_std"),
        health_score=score,
        health_status=status,
        source=result["source"],
        satellite_date=result["satellite_date"],
        cloud_cover=result.get("cloud_cover"),
    )
    db.add(reading)
    await db.flush()

    # Evaluate irrigation
    alert = await irrigation_service.evaluate_and_create_alert(field, reading, db)
    await db.commit()
    await db.refresh(reading)

    alert_resp = None
    if alert:
        await db.refresh(alert)
        alert_resp = IrrigationAlertResponse.model_validate(alert)

    return CropHealthResponse(
        field_id=field.id,
        field_name=field.name,
        crop=field.crop,
        ndvi_mean=reading.ndvi_mean,
        ndvi_min=reading.ndvi_min,
        ndvi_max=reading.ndvi_max,
        health_score=reading.health_score,
        health_status=reading.health_status,
        source=reading.source,
        satellite_date=reading.satellite_date,
        growth_stage=health_score.get_growth_stage(das),
        days_after_sowing=das,
        expected_ndvi_range=health_score.get_expected_range(das),
        deviation=health_score.get_deviation(reading.ndvi_mean, das),
        recommendation=_get_recommendation(status),
        irrigation_alert=alert_resp,
    )


async def analyze_polygon(
    geojson_polygon: dict,
    crop: str,
    sowing_date: date | None,
) -> CropHealthResponse:
    """Ad-hoc analysis for arbitrary polygon (no DB storage)."""
    result = await gee_service.fetch_ndvi(geojson_polygon)
    if result is None:
        result = await stac_fallback.fetch_ndvi(geojson_polygon)
    if result is None:
        result = stac_fallback._seasonal_estimate()

    das = compute_days_after_sowing(sowing_date)
    score, status = health_score.compute(result["ndvi_mean"], crop, das)

    return CropHealthResponse(
        field_id=None,
        field_name="Ad-hoc Analysis",
        crop=crop,
        ndvi_mean=result["ndvi_mean"],
        ndvi_min=result.get("ndvi_min"),
        ndvi_max=result.get("ndvi_max"),
        health_score=score,
        health_status=status,
        source=result["source"],
        satellite_date=result["satellite_date"],
        growth_stage=health_score.get_growth_stage(das),
        days_after_sowing=das,
        expected_ndvi_range=health_score.get_expected_range(das),
        deviation=health_score.get_deviation(result["ndvi_mean"], das),
        recommendation=_get_recommendation(status),
        irrigation_alert=None,
    )


def _get_recommendation(status: str) -> str:
    return {
        "excellent": "Excellent health. Maintain current management practices.",
        "good": "Good health. Continue monitoring. Minor adjustments may help.",
        "moderate": "Moderate health. Investigate possible nutrient deficiency or water stress.",
        "poor": "Poor health. Immediate investigation needed: check irrigation, pests, disease.",
        "critical": "Critical condition. Urgent field visit required. Check for water stress, pest damage, or disease.",
    }.get(status, "Continue monitoring.")
