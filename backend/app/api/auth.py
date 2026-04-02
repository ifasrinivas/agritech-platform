"""Authentication endpoints: signup, login, token refresh, me."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.farmer import Farmer
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse, RefreshRequest
from app.schemas.farmer import FarmerResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse, status_code=201)
async def signup(data: SignupRequest, db: AsyncSession = Depends(get_db)):
    """Register a new farmer with phone + password."""
    existing = await db.execute(select(Farmer).where(Farmer.phone == data.phone))
    if existing.scalar_one_or_none():
        raise HTTPException(409, "Phone number already registered")

    farmer = Farmer(
        name=data.name,
        phone=data.phone,
        password_hash=auth_service.hash_password(data.password),
        email=data.email,
        location=data.location,
    )
    db.add(farmer)
    await db.commit()
    await db.refresh(farmer)

    return TokenResponse(
        access_token=auth_service.create_access_token(str(farmer.id)),
        refresh_token=auth_service.create_refresh_token(str(farmer.id)),
        farmer_id=str(farmer.id),
        farmer_name=farmer.name,
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Login with phone + password."""
    farmer = await auth_service.authenticate_farmer(data.phone, data.password, db)
    if not farmer:
        raise HTTPException(401, "Invalid phone number or password")

    return TokenResponse(
        access_token=auth_service.create_access_token(str(farmer.id)),
        refresh_token=auth_service.create_refresh_token(str(farmer.id)),
        farmer_id=str(farmer.id),
        farmer_name=farmer.name,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    """Get new access token using refresh token."""
    payload = auth_service.decode_token(data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(401, "Invalid refresh token")

    farmer_id = payload.get("sub")
    if not farmer_id:
        raise HTTPException(401, "Invalid token payload")

    import uuid
    farmer = await db.get(Farmer, uuid.UUID(farmer_id))
    if not farmer:
        raise HTTPException(404, "Farmer not found")

    return TokenResponse(
        access_token=auth_service.create_access_token(str(farmer.id)),
        refresh_token=auth_service.create_refresh_token(str(farmer.id)),
        farmer_id=str(farmer.id),
        farmer_name=farmer.name,
    )
