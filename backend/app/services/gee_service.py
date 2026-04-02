"""
Google Earth Engine NDVI Service.
Fetches Sentinel-2 10m NDVI for a polygon via GEE Python SDK.
GEE is optional -- returns None if not configured.
"""
import asyncio
import logging
from datetime import datetime, timedelta

from app.config import settings

logger = logging.getLogger(__name__)
_initialized = False


def initialize_gee() -> bool:
    """Try to initialize GEE. Returns False gracefully if no credentials."""
    global _initialized
    if _initialized:
        return True

    if not settings.GEE_SERVICE_ACCOUNT_EMAIL or not settings.GEE_SERVICE_ACCOUNT_KEY_PATH:
        logger.info("GEE credentials not configured; will use STAC fallback")
        return False

    try:
        import ee

        credentials = ee.ServiceAccountCredentials(
            settings.GEE_SERVICE_ACCOUNT_EMAIL,
            settings.GEE_SERVICE_ACCOUNT_KEY_PATH,
        )
        ee.Initialize(credentials)
        _initialized = True
        logger.info("Google Earth Engine initialized successfully")
        return True
    except Exception as e:
        logger.warning(f"GEE initialization failed: {e}")
        return False


def is_available() -> bool:
    return _initialized


async def fetch_ndvi(geojson_polygon: dict, days_back: int = 30) -> dict | None:
    """
    Compute mean NDVI over a polygon from Sentinel-2 via GEE.
    Returns None if GEE is not available or query fails.
    GEE SDK is synchronous -- runs in thread pool.
    """
    if not _initialized:
        return None

    try:
        return await asyncio.to_thread(_fetch_ndvi_sync, geojson_polygon, days_back)
    except Exception as e:
        logger.warning(f"GEE NDVI fetch failed: {e}")
        return None


def _fetch_ndvi_sync(geojson_polygon: dict, days_back: int) -> dict | None:
    import ee

    region = ee.Geometry.Polygon(geojson_polygon["coordinates"])
    end_date = ee.Date(datetime.utcnow().isoformat())
    start_date = end_date.advance(-days_back, "day")

    s2 = (
        ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterBounds(region)
        .filterDate(start_date, end_date)
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 30))
        .sort("system:time_start", False)
    )

    count = s2.size().getInfo()
    if count == 0:
        return None

    latest = s2.first()

    # NDVI = (B8 - B4) / (B8 + B4)
    ndvi = latest.normalizedDifference(["B8", "B4"]).rename("NDVI")

    stats = ndvi.reduceRegion(
        reducer=ee.Reducer.mean()
        .combine(ee.Reducer.minMax(), sharedInputs=True)
        .combine(ee.Reducer.stdDev(), sharedInputs=True),
        geometry=region,
        scale=10,
        maxPixels=1e8,
    ).getInfo()

    image_date = datetime.utcfromtimestamp(
        latest.get("system:time_start").getInfo() / 1000
    ).date()

    return {
        "ndvi_mean": round(stats.get("NDVI_mean", 0), 4),
        "ndvi_min": _safe_round(stats.get("NDVI_min")),
        "ndvi_max": _safe_round(stats.get("NDVI_max")),
        "ndvi_std": _safe_round(stats.get("NDVI_stdDev")),
        "satellite_date": image_date,
        "cloud_cover": latest.get("CLOUDY_PIXEL_PERCENTAGE").getInfo(),
        "source": "gee",
    }


def _safe_round(val: float | None, decimals: int = 4) -> float | None:
    return round(val, decimals) if val is not None else None
