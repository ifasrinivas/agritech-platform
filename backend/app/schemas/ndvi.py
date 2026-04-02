import uuid
from datetime import date, datetime

from pydantic import BaseModel, Field

from app.schemas.field import GeoJSONPolygon
from app.schemas.irrigation import IrrigationAlertResponse


class NDVIReadingResponse(BaseModel):
    id: uuid.UUID
    field_id: uuid.UUID
    ndvi_mean: float
    ndvi_min: float | None
    ndvi_max: float | None
    ndvi_std: float | None
    health_score: float
    health_status: str
    source: str
    satellite_date: date
    cloud_cover: float | None
    created_at: datetime

    model_config = {"from_attributes": True}


class NDVIAnalyzeRequest(BaseModel):
    """Ad-hoc NDVI analysis for an arbitrary polygon (no DB storage)."""
    boundary: GeoJSONPolygon
    crop: str = Field(max_length=100)
    sowing_date: date | None = None


class CropHealthResponse(BaseModel):
    """Full crop health report returned after NDVI analysis."""
    field_id: uuid.UUID | None = None
    field_name: str
    crop: str
    ndvi_mean: float
    ndvi_min: float | None = None
    ndvi_max: float | None = None
    health_score: float
    health_status: str
    source: str
    satellite_date: date
    growth_stage: str | None = None
    days_after_sowing: int | None = None
    expected_ndvi_range: str | None = None
    deviation: str | None = None
    recommendation: str | None = None
    irrigation_alert: IrrigationAlertResponse | None = None
