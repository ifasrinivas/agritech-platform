"""
Irrigation Alert Service.
Generates irrigation alerts based on NDVI readings and trends.
Crop thresholds derived from frontend data/agritech.ts irrigation schedules.
"""
import uuid
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ndvi_reading import NDVIReading
from app.models.irrigation_alert import IrrigationAlert
from app.models.field import Field

# Crop-specific optimal moisture thresholds
# Derived from frontend data/agritech.ts irrigationSchedules
CROP_THRESHOLDS: dict[str, dict[str, float]] = {
    "Rice":     {"optimal": 60, "critical_low": 40},
    "Wheat":    {"optimal": 35, "critical_low": 20},
    "Tomato":   {"optimal": 35, "critical_low": 22},
    "Onion":    {"optimal": 30, "critical_low": 18},
    "Grapes":   {"optimal": 28, "critical_low": 16},
    "Capsicum": {"optimal": 40, "critical_low": 25},
    "Soybean":  {"optimal": 35, "critical_low": 20},
    "Maize":    {"optimal": 35, "critical_low": 22},
}

DEFAULT_THRESHOLD = {"optimal": 35, "critical_low": 20}


async def evaluate_and_create_alert(
    field: Field,
    ndvi_reading: NDVIReading,
    db: AsyncSession,
) -> IrrigationAlert | None:
    """
    Generate irrigation alert based on:
    1. Current NDVI health score/status
    2. NDVI trend (delta from previous reading)
    3. Crop-specific moisture thresholds
    """
    prev = await _get_previous_reading(field.id, ndvi_reading.id, db)
    ndvi_trend = (ndvi_reading.ndvi_mean - prev.ndvi_mean) if prev else None

    t = CROP_THRESHOLDS.get(field.crop, DEFAULT_THRESHOLD)
    alert = None

    # Rule 1: Critical health or poor + declining
    if ndvi_reading.health_status == "critical" or (
        ndvi_reading.health_status == "poor"
        and ndvi_trend is not None
        and ndvi_trend < -0.05
    ):
        alert = IrrigationAlert(
            field_id=field.id,
            alert_type="irrigate_now",
            severity="critical" if ndvi_reading.health_status == "critical" else "high",
            title=f"Urgent: Possible Water Stress - {field.name}",
            description=(
                f"NDVI at {ndvi_reading.ndvi_mean:.2f} (health: {ndvi_reading.health_status}). "
                + (f"Declining by {abs(ndvi_trend):.2f} since last reading. " if ndvi_trend and ndvi_trend < 0 else "")
                + f"Immediate irrigation check recommended for {field.crop}."
            ),
            action_required=(
                f"Check soil moisture. Target {t['optimal']}% for {field.crop}. "
                f"If below {t['critical_low']}%, irrigate urgently."
            ),
            optimal_moisture=t["optimal"],
        )

    # Rule 2: Moderate + significant decline
    elif (
        ndvi_reading.health_status == "moderate"
        and ndvi_trend is not None
        and ndvi_trend < -0.08
    ):
        alert = IrrigationAlert(
            field_id=field.id,
            alert_type="deficit_warning",
            severity="medium",
            title=f"NDVI Decline Detected - {field.name}",
            description=(
                f"NDVI declined by {abs(ndvi_trend):.2f} to {ndvi_reading.ndvi_mean:.2f}. "
                f"May indicate developing water stress."
            ),
            action_required=f"Monitor soil moisture. Increase frequency if below {t['optimal']}%.",
            optimal_moisture=t["optimal"],
        )

    # Rule 3: Over-saturation warning
    elif (
        ndvi_reading.health_status == "excellent"
        and ndvi_reading.ndvi_mean > 0.85
        and field.crop in ("Rice", "Capsicum")
    ):
        alert = IrrigationAlert(
            field_id=field.id,
            alert_type="reduce_irrigation",
            severity="low",
            title=f"Consider Reducing Irrigation - {field.name}",
            description=(
                f"NDVI very high ({ndvi_reading.ndvi_mean:.2f}). "
                f"Risk of over-saturation, root rot, or fungal issues."
            ),
            action_required="Reduce irrigation by 10-15%. Monitor for waterlogging.",
            optimal_moisture=t["optimal"],
        )

    if alert:
        db.add(alert)

    return alert


async def _get_previous_reading(
    field_id: uuid.UUID,
    current_reading_id: uuid.UUID,
    db: AsyncSession,
) -> NDVIReading | None:
    """Get the most recent reading before the current one."""
    stmt = (
        select(NDVIReading)
        .where(
            NDVIReading.field_id == field_id,
            NDVIReading.id != current_reading_id,
        )
        .order_by(NDVIReading.created_at.desc())
        .limit(1)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()
