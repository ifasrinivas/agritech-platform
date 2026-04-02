import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.farm import Farm
from app.models.field import Field
from app.models.farmer import Farmer
from app.schemas.farm import FarmCreate, FarmResponse

router = APIRouter(prefix="/farms", tags=["Farms"])


@router.post("", response_model=FarmResponse, status_code=201)
async def create_farm(data: FarmCreate, db: AsyncSession = Depends(get_db)):
    farmer = await db.get(Farmer, data.farmer_id)
    if not farmer:
        raise HTTPException(404, "Farmer not found")

    farm = Farm(**data.model_dump())
    db.add(farm)
    await db.commit()
    await db.refresh(farm)
    return _to_response(farm, 0)


@router.get("/{farm_id}", response_model=FarmResponse)
async def get_farm(farm_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    farm = await db.get(Farm, farm_id)
    if not farm:
        raise HTTPException(404, "Farm not found")
    count = await _field_count(farm.id, db)
    return _to_response(farm, count)


@router.get("", response_model=list[FarmResponse])
async def list_farms(
    farmer_id: uuid.UUID | None = None,
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Farm).offset(skip).limit(limit).order_by(Farm.created_at.desc())
    if farmer_id:
        stmt = stmt.where(Farm.farmer_id == farmer_id)
    result = await db.execute(stmt)
    farms = result.scalars().all()
    responses = []
    for f in farms:
        count = await _field_count(f.id, db)
        responses.append(_to_response(f, count))
    return responses


async def _field_count(farm_id: uuid.UUID, db: AsyncSession) -> int:
    stmt = select(func.count()).where(Field.farm_id == farm_id)
    result = await db.execute(stmt)
    return result.scalar_one()


def _to_response(farm: Farm, field_count: int) -> FarmResponse:
    return FarmResponse(
        id=farm.id,
        farmer_id=farm.farmer_id,
        name=farm.name,
        total_area=farm.total_area,
        location_name=farm.location_name,
        field_count=field_count,
        created_at=farm.created_at,
        updated_at=farm.updated_at,
    )
