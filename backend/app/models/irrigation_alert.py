import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Float, Boolean, DateTime, ForeignKey, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def _utcnow():
    return datetime.now(timezone.utc)


class IrrigationAlert(Base):
    __tablename__ = "irrigation_alerts"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    alert_type: Mapped[str] = mapped_column(String(50))
    severity: Mapped[str] = mapped_column(String(20))
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    action_required: Mapped[str] = mapped_column(Text)
    soil_moisture: Mapped[float | None] = mapped_column(Float, nullable=True)
    optimal_moisture: Mapped[float | None] = mapped_column(Float, nullable=True)
    water_required_liters: Mapped[float | None] = mapped_column(Float, nullable=True)
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)

    field: Mapped["Field"] = relationship(back_populates="irrigation_alerts")  # noqa: F821
