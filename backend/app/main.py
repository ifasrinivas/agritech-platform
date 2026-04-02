"""
AgriTech Platform - FastAPI Backend
Satellite NDVI analysis, crop health scoring, and irrigation alerts.
"""
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


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables, init GEE, start scheduler."""
    # Auto-create tables (for SQLite dev mode / first run)
    from app.database import engine, Base
    from app.models import Farmer, Farm, Field, NDVIReading, IrrigationAlert  # noqa: F811

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info(f"Database ready ({settings.DATABASE_URL.split('://')[0]})")

    gee_ok = gee_service.initialize_gee()
    if gee_ok:
        logger.info("GEE available - using Sentinel-2 10m NDVI")
    else:
        logger.info("GEE not configured - using free STAC/MODIS fallback")

    # Start background NDVI scheduler (every 6 hours)
    start_scheduler(interval_hours=6.0)
    logger.info("Background NDVI scheduler started (every 6h)")

    yield

    stop_scheduler()
    logger.info("Shutdown complete")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "AgriTech Platform API - Satellite intelligence, crop health scoring, "
        "and irrigation alerts for precision agriculture.\n\n"
        "## Features\n"
        "- JWT authentication (signup/login)\n"
        "- GPS field boundary storage (PostGIS)\n"
        "- Real-time NDVI via Google Earth Engine + free fallbacks\n"
        "- Growth-stage-aware health scoring (0-100)\n"
        "- Automatic irrigation alerts\n"
        "- WebSocket real-time NDVI progress\n"
        "- Background scheduler for periodic scans\n"
    ),
    lifespan=lifespan,
)

# Middleware (order matters: last added = first executed)
app.add_middleware(MetricsMiddleware)
app.add_middleware(RateLimitMiddleware, requests_per_minute=120)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HTTP Routes
app.include_router(root_router)
app.include_router(api_router)

# WebSocket Routes
app.include_router(ws_router)

# Monitoring
app.include_router(metrics_router)
