import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.irrigation_alert import IrrigationAlert
from app.models.field import Field
from app.schemas.irrigation import IrrigationAlertResponse

router = APIRouter(tags=["Irrigation Alerts"])


@router.get(
    "/fields/{field_id}/irrigation-alerts",
    response_model=list[IrrigationAlertResponse],
)
async def get_field_alerts(
    field_id: uuid.UUID,
    active_only: bool = True,
    db: AsyncSession = Depends(get_db),
):
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")

    stmt = select(IrrigationAlert).where(IrrigationAlert.field_id == field_id)
    if active_only:
        stmt = stmt.where(IrrigationAlert.is_resolved == False)  # noqa: E712
    stmt = stmt.order_by(IrrigationAlert.created_at.desc())

    result = await db.execute(stmt)
    return [IrrigationAlertResponse.model_validate(a) for a in result.scalars().all()]


@router.get(
    "/farms/{farm_id}/irrigation-alerts",
    response_model=list[IrrigationAlertResponse],
)
async def get_farm_alerts(
    farm_id: uuid.UUID,
    active_only: bool = True,
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(IrrigationAlert)
        .join(Field, IrrigationAlert.field_id == Field.id)
        .where(Field.farm_id == farm_id)
    )
    if active_only:
        stmt = stmt.where(IrrigationAlert.is_resolved == False)  # noqa: E712
    stmt = stmt.order_by(IrrigationAlert.created_at.desc())

    result = await db.execute(stmt)
    return [IrrigationAlertResponse.model_validate(a) for a in result.scalars().all()]


@router.patch(
    "/irrigation-alerts/{alert_id}/resolve",
    response_model=IrrigationAlertResponse,
)
async def resolve_alert(
    alert_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    alert = await db.get(IrrigationAlert, alert_id)
    if not alert:
        raise HTTPException(404, "Alert not found")

    alert.is_resolved = True
    alert.resolved_at = datetime.utcnow()
    await db.commit()
    await db.refresh(alert)
    return IrrigationAlertResponse.model_validate(alert)
