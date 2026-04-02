import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class FarmerCreate(BaseModel):
    name: str = Field(max_length=255)
    phone: str = Field(max_length=20)
    email: str | None = None
    location: str | None = None
    plan: str = "free"


class FarmerUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    email: str | None = None
    location: str | None = None
    plan: str | None = None


class FarmerResponse(BaseModel):
    id: uuid.UUID
    name: str
    phone: str
    email: str | None
    location: str | None
    plan: str
    created_at: datetime
    updated_at: datetime
    farm_count: int = 0

    model_config = {"from_attributes": True}
