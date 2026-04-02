import uuid
from datetime import datetime, timezone

from sqlalchemy import String, DateTime, Float, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def _utcnow():
    return datetime.now(timezone.utc)


class Farm(Base):
    __tablename__ = "farms"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    farmer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farmers.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    total_area: Mapped[float | None] = mapped_column(Float, nullable=True)
    location_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow, onupdate=_utcnow)

    farmer: Mapped["Farmer"] = relationship(back_populates="farms")  # noqa: F821
    fields: Mapped[list["Field"]] = relationship(  # noqa: F821
        back_populates="farm", cascade="all, delete-orphan"
    )
