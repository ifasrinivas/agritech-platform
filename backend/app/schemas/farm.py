import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class FarmCreate(BaseModel):
    farmer_id: uuid.UUID
    name: str = Field(max_length=255)
    total_area: float | None = None
    location_name: str | None = None


class FarmResponse(BaseModel):
    id: uuid.UUID
    farmer_id: uuid.UUID
    name: str
    total_area: float | None
    location_name: str | None
    field_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
