import uuid
from datetime import date, datetime, timezone
from typing import Any

from sqlalchemy import String, Float, Date, DateTime, ForeignKey, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

try:
    from geoalchemy2 import Geometry
    _BOUNDARY_TYPE = Geometry(geometry_type="POLYGON", srid=4326)
    _CENTROID_TYPE = Geometry(geometry_type="POINT", srid=4326)
    HAS_POSTGIS = True
except ImportError:
    _BOUNDARY_TYPE = Text()
    _CENTROID_TYPE = Text()
    HAS_POSTGIS = False


def _utcnow():
    return datetime.now(timezone.utc)


class Field(Base):
    __tablename__ = "fields"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    farm_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farms.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    crop: Mapped[str] = mapped_column(String(100))
    area: Mapped[float] = mapped_column(Float)
    soil_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    sowing_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    expected_harvest: Mapped[date | None] = mapped_column(Date, nullable=True)
    irrigation_type: Mapped[str | None] = mapped_column(String(100), nullable=True)

    boundary: Mapped[Any] = mapped_column(_BOUNDARY_TYPE, nullable=False)
    centroid: Mapped[Any] = mapped_column(_CENTROID_TYPE, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow, onupdate=_utcnow)

    farm: Mapped["Farm"] = relationship(back_populates="fields")  # noqa: F821
    ndvi_readings: Mapped[list["NDVIReading"]] = relationship(  # noqa: F821
        back_populates="field", cascade="all, delete-orphan"
    )
    irrigation_alerts: Mapped[list["IrrigationAlert"]] = relationship(  # noqa: F821
        back_populates="field", cascade="all, delete-orphan"
    )
