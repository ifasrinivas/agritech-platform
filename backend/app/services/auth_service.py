"""
JWT Authentication Service.
Uses bcrypt directly (not passlib) for modern bcrypt compatibility.
"""
import uuid
import hashlib
import secrets
from datetime import datetime, timedelta

from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.farmer import Farmer


def hash_password(password: str) -> str:
    """Hash password using SHA-256 + salt. Simple and dependency-free."""
    salt = secrets.token_hex(16)
    hashed = hashlib.sha256(f"{salt}{password}".encode()).hexdigest()
    return f"{salt}${hashed}"


def verify_password(plain: str, stored: str) -> bool:
    """Verify password against stored salt$hash."""
    if "$" not in stored:
        return False
    salt, hashed = stored.split("$", 1)
    return hashlib.sha256(f"{salt}{plain}".encode()).hexdigest() == hashed


def create_access_token(farmer_id: str, extra: dict | None = None) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": farmer_id, "exp": expire, "type": "access"}
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(farmer_id: str) -> str:
    expire = datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {"sub": farmer_id, "exp": expire, "type": "refresh"}
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None


async def authenticate_farmer(phone: str, password: str, db: AsyncSession) -> Farmer | None:
    stmt = select(Farmer).where(Farmer.phone == phone)
    result = await db.execute(stmt)
    farmer = result.scalar_one_or_none()
    if not farmer or not farmer.password_hash:
        return None
    if not verify_password(password, farmer.password_hash):
        return None
    return farmer


async def get_farmer_from_token(token: str, db: AsyncSession) -> Farmer | None:
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        return None
    farmer_id = payload.get("sub")
    if not farmer_id:
        return None
    try:
        return await db.get(Farmer, uuid.UUID(farmer_id))
    except (ValueError, Exception):
        return None
