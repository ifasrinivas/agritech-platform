"""
AgriTech Platform - FastAPI Backend
Satellite NDVI analysis, crop health scoring, and irrigation alerts.
"""
import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.router import api_router, root_router
from app.api.websocket import router as ws_router
from app.services import gee_service
from app.services.scheduler import start_scheduler, stop_scheduler
from app.middleware import RateLimitMiddleware
from app.api.metrics import router as metrics_router, MetricsMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

IS_SERVERLESS = os.environ.get("SERVERLESS", "").lower() == "true"

_db_initialized = False


async def _ensure_db():
    """Create tables on first request (works in serverless)."""
    global _db_initialized
    if _db_initialized:
        return
    try:
        from app.database import engine, Base
        from app.models import Farmer, Farm, Field, NDVIReading, IrrigationAlert  # noqa: F401
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        _db_initialized = True
    except Exception as e:
        logger.warning(f"DB init: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables, init GEE, start scheduler."""
    await _ensure_db()

    gee_ok = gee_service.initialize_gee()
    logger.info("GEE available" if gee_ok else "Using free STAC/MODIS fallback")

    if not IS_SERVERLESS:
        start_scheduler(interval_hours=6.0)
        logger.info("Background scheduler started")

    yield

    if not IS_SERVERLESS:
        stop_scheduler()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AgriTech Platform API - Satellite NDVI, crop health, irrigation alerts.",
    lifespan=lifespan,
)

# Middleware
app.add_middleware(MetricsMiddleware)
app.add_middleware(RateLimitMiddleware, requests_per_minute=120)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def ensure_db_middleware(request, call_next):
    """Ensure DB tables exist on every request (serverless cold start)."""
    await _ensure_db()
    return await call_next(request)


# Routes
app.include_router(root_router)
app.include_router(api_router)
app.include_router(ws_router)
app.include_router(metrics_router)
