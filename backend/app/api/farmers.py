import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.farmer import Farmer
from app.models.farm import Farm
from app.schemas.farmer import FarmerCreate, FarmerUpdate, FarmerResponse

router = APIRouter(prefix="/farmers", tags=["Farmers"])


@router.post("", response_model=FarmerResponse, status_code=201)
async def create_farmer(data: FarmerCreate, db: AsyncSession = Depends(get_db)):
    farmer = Farmer(**data.model_dump())
    db.add(farmer)
    await db.commit()
    await db.refresh(farmer)
    return _to_response(farmer, 0)


@router.get("", response_model=list[FarmerResponse])
async def list_farmers(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Farmer).offset(skip).limit(limit).order_by(Farmer.created_at.desc())
    result = await db.execute(stmt)
    farmers = result.scalars().all()
    responses = []
    for f in farmers:
        count = await _farm_count(f.id, db)
        responses.append(_to_response(f, count))
    return responses


@router.get("/{farmer_id}", response_model=FarmerResponse)
async def get_farmer(farmer_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    farmer = await db.get(Farmer, farmer_id)
    if not farmer:
        raise HTTPException(404, "Farmer not found")
    count = await _farm_count(farmer.id, db)
    return _to_response(farmer, count)


@router.put("/{farmer_id}", response_model=FarmerResponse)
async def update_farmer(
    farmer_id: uuid.UUID,
    data: FarmerUpdate,
    db: AsyncSession = Depends(get_db),
):
    farmer = await db.get(Farmer, farmer_id)
    if not farmer:
        raise HTTPException(404, "Farmer not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(farmer, key, value)
    await db.commit()
    await db.refresh(farmer)
    count = await _farm_count(farmer.id, db)
    return _to_response(farmer, count)


async def _farm_count(farmer_id: uuid.UUID, db: AsyncSession) -> int:
    stmt = select(func.count()).where(Farm.farmer_id == farmer_id)
    result = await db.execute(stmt)
    return result.scalar_one()


def _to_response(farmer: Farmer, farm_count: int) -> FarmerResponse:
    return FarmerResponse(
        id=farmer.id,
        name=farmer.name,
        phone=farmer.phone,
        email=farmer.email,
        location=farmer.location,
        plan=farmer.plan,
        created_at=farmer.created_at,
        updated_at=farmer.updated_at,
        farm_count=farm_count,
    )
