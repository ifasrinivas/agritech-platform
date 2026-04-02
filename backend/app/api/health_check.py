from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.dependencies import get_db
from app.schemas.health import HealthCheckResponse
from app.services import gee_service

router = APIRouter()


@router.get("/health", response_model=HealthCheckResponse)
async def health_check(db: AsyncSession = Depends(get_db)):
    """Check API, database, and GEE status."""
    db_status = "error"
    try:
        await db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        pass

    return HealthCheckResponse(
        status="ok" if db_status == "connected" else "degraded",
        database=db_status,
        gee_configured=gee_service.is_available(),
        version=settings.APP_VERSION,
    )
