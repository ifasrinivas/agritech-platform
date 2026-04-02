import uuid
from datetime import date, datetime, timezone

from sqlalchemy import String, Float, Date, DateTime, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def _utcnow():
    return datetime.now(timezone.utc)


class NDVIReading(Base):
    __tablename__ = "ndvi_readings"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    ndvi_mean: Mapped[float] = mapped_column(Float)
    ndvi_min: Mapped[float | None] = mapped_column(Float, nullable=True)
    ndvi_max: Mapped[float | None] = mapped_column(Float, nullable=True)
    ndvi_std: Mapped[float | None] = mapped_column(Float, nullable=True)
    health_score: Mapped[float] = mapped_column(Float)
    health_status: Mapped[str] = mapped_column(String(20))
    source: Mapped[str] = mapped_column(String(20))
    satellite_date: Mapped[date] = mapped_column(Date)
    cloud_cover: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)

    field: Mapped["Field"] = relationship(back_populates="ndvi_readings")  # noqa: F821
