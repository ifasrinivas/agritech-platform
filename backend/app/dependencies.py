from collections.abc import AsyncGenerator

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session

security = HTTPBearer(auto_error=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_current_farmer(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    """Extract and validate JWT from Authorization header. Returns Farmer or raises 401."""
    if not credentials:
        raise HTTPException(401, "Not authenticated")

    from app.services.auth_service import get_farmer_from_token

    farmer = await get_farmer_from_token(credentials.credentials, db)
    if not farmer:
        raise HTTPException(401, "Invalid or expired token")
    return farmer


async def get_optional_farmer(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    """Optional auth - returns Farmer or None (for public endpoints)."""
    if not credentials:
        return None

    from app.services.auth_service import get_farmer_from_token

    return await get_farmer_from_token(credentials.credentials, db)
