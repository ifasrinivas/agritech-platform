import uuid
from datetime import datetime

from pydantic import BaseModel


class IrrigationAlertResponse(BaseModel):
    id: uuid.UUID
    field_id: uuid.UUID
    alert_type: str
    severity: str
    title: str
    description: str
    action_required: str
    soil_moisture: float | None
    optimal_moisture: float | None
    water_required_liters: float | None
    is_resolved: bool
    created_at: datetime

    model_config = {"from_attributes": True}
