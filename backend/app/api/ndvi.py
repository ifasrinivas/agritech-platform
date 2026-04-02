import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.field import Field
from app.models.ndvi_reading import NDVIReading
from app.schemas.ndvi import NDVIReadingResponse, NDVIAnalyzeRequest, CropHealthResponse
from app.services import ndvi_pipeline

router = APIRouter(tags=["NDVI / Crop Health"])


@router.post(
    "/fields/{field_id}/ndvi",
    response_model=CropHealthResponse,
)
async def trigger_ndvi_analysis(
    field_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Trigger satellite NDVI analysis for a stored field.
    Pipeline: GEE (10m) -> STAC fallback (free) -> MODIS (free) -> estimate.
    Returns health score + irrigation alert.
    """
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")

    return await ndvi_pipeline.analyze_field(field, db)


@router.get(
    "/fields/{field_id}/ndvi/history",
    response_model=list[NDVIReadingResponse],
)
async def get_ndvi_history(
    field_id: uuid.UUID,
    days_back: int = 90,
    db: AsyncSession = Depends(get_db),
):
    """Get historical NDVI readings for a field."""
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")

    from datetime import datetime, timedelta

    cutoff = datetime.utcnow() - timedelta(days=days_back)
    stmt = (
        select(NDVIReading)
        .where(NDVIReading.field_id == field_id, NDVIReading.created_at >= cutoff)
        .order_by(NDVIReading.satellite_date.asc())
    )
    result = await db.execute(stmt)
    return [NDVIReadingResponse.model_validate(r) for r in result.scalars().all()]


@router.post(
    "/ndvi/analyze",
    response_model=CropHealthResponse,
)
async def analyze_polygon(data: NDVIAnalyzeRequest):
    """
    Ad-hoc NDVI analysis for an arbitrary GeoJSON polygon.
    Does NOT store results in the database.
    """
    return await ndvi_pipeline.analyze_polygon(
        geojson_polygon=data.boundary.model_dump(),
        crop=data.crop,
        sowing_date=data.sowing_date,
    )
