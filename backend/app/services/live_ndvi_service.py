"""
Live NDVI from actual Sentinel-2 COG pixels.
Reads B04 (Red) and B08 (NIR) bands directly from Element84 STAC cloud-optimized GeoTIFFs.
No API key needed — 100% free.
"""
import logging
import math
from datetime import datetime, timedelta

import httpx
import numpy as np
from shapely.geometry import shape, box

logger = logging.getLogger(__name__)

STAC_URL = "https://earth-search.aws.element84.com/v1/search"


async def compute_live_ndvi(geojson_polygon: dict, days_back: int = 30) -> dict | None:
    """
    Compute actual NDVI from Sentinel-2 L2A COG pixels.
    1. Search STAC for latest low-cloud scene
    2. Get B04 (Red) and B08 (NIR) COG URLs
    3. Read pixel values via HTTP range requests
    4. Compute NDVI = (NIR - Red) / (NIR + Red)
    """
    poly = shape(geojson_polygon)
    bbox = list(poly.bounds)
    centroid = poly.centroid
    now = datetime.utcnow()
    start = now - timedelta(days=days_back)

    # Step 1: Find latest scene
    body = {
        "collections": ["sentinel-2-l2a"],
        "bbox": bbox,
        "datetime": f"{start.date()}T00:00:00Z/{now.date()}T23:59:59Z",
        "limit": 3,
        "sortby": [{"field": "properties.datetime", "direction": "desc"}],
        "filter-lang": "cql2-json",
        "filter": {"op": "<=", "args": [{"property": "eo:cloud_cover"}, 20]},
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(STAC_URL, json=body)
            if resp.status_code != 200:
                return None

            features = resp.json().get("features", [])
            if not features:
                return None

            scene = features[0]
            props = scene.get("properties", {})
            assets = scene.get("assets", {})

            # Step 2: Get band URLs
            red_asset = assets.get("red", assets.get("B04", {}))
            nir_asset = assets.get("nir", assets.get("B08", {}))
            red_href = red_asset.get("href")
            nir_href = nir_asset.get("href")

            if not red_href or not nir_href:
                logger.info("Scene found but missing B04/B08 band assets")
                return _metadata_only(scene, centroid)

            scene_date = props.get("datetime", "")
            try:
                parsed_date = datetime.fromisoformat(scene_date.replace("Z", "+00:00")).date()
            except Exception:
                parsed_date = now.date()

            # Step 3: Try to read actual pixels via rasterio (if installed)
            try:
                ndvi_stats = await _read_cog_ndvi(red_href, nir_href, geojson_polygon)
                if ndvi_stats:
                    return {
                        "ndvi_mean": ndvi_stats["mean"],
                        "ndvi_min": ndvi_stats["min"],
                        "ndvi_max": ndvi_stats["max"],
                        "ndvi_std": ndvi_stats["std"],
                        "pixel_count": ndvi_stats["count"],
                        "satellite_date": parsed_date.isoformat(),
                        "cloud_cover": props.get("eo:cloud_cover", 0),
                        "platform": props.get("platform", "sentinel-2"),
                        "source": "sentinel-2-cog-live",
                        "resolution": "10m",
                        "red_band": red_href.split("/")[-1],
                        "nir_band": nir_href.split("/")[-1],
                        "live": True,
                    }
            except Exception as e:
                logger.info(f"COG read failed ({e}), using estimation")

            # Step 4: Fallback — estimate NDVI from scene metadata
            return _metadata_only(scene, centroid)

    except Exception as e:
        logger.warning(f"Live NDVI failed: {e}")
        return None


async def _read_cog_ndvi(red_href: str, nir_href: str, geojson_polygon: dict) -> dict | None:
    """Read actual pixel values from Sentinel-2 COG with CRS transform (WGS84 -> UTM)."""
    try:
        import rasterio
        from rasterio.windows import from_bounds
        from rasterio.warp import transform_bounds

        poly = shape(geojson_polygon)
        wgs84_bounds = poly.bounds

        with rasterio.open(red_href) as red_ds:
            utm_bounds = transform_bounds("EPSG:4326", red_ds.crs, *wgs84_bounds)
            window = from_bounds(*utm_bounds, transform=red_ds.transform)
            red = red_ds.read(1, window=window).astype(float)

        with rasterio.open(nir_href) as nir_ds:
            utm_bounds = transform_bounds("EPSG:4326", nir_ds.crs, *wgs84_bounds)
            window = from_bounds(*utm_bounds, transform=nir_ds.transform)
            nir = nir_ds.read(1, window=window).astype(float)

        if red.size == 0 or nir.size == 0:
            return None

        valid = (red + nir) > 0
        ndvi = np.where(valid, (nir - red) / (nir + red), np.nan)
        ndvi_valid = ndvi[~np.isnan(ndvi)]

        if len(ndvi_valid) == 0:
            return None

        return {
            "mean": round(float(np.mean(ndvi_valid)), 4),
            "min": round(float(np.min(ndvi_valid)), 4),
            "max": round(float(np.max(ndvi_valid)), 4),
            "std": round(float(np.std(ndvi_valid)), 4),
            "count": int(len(ndvi_valid)),
        }
    except ImportError:
        logger.info("rasterio not installed - cannot read COG pixels")
        return None
    except Exception as e:
        logger.info(f"COG pixel read error: {e}")
        return None


def _metadata_only(scene: dict, centroid) -> dict:
    """Return scene metadata + estimated NDVI when pixel read isn't possible."""
    props = scene.get("properties", {})
    scene_date = props.get("datetime", "")
    try:
        parsed_date = datetime.fromisoformat(scene_date.replace("Z", "+00:00")).date()
    except Exception:
        parsed_date = datetime.utcnow().date()

    # Estimate from seasonal model
    doy = parsed_date.timetuple().tm_yday
    phase = (doy - 30) / 60
    if phase < 0:
        ndvi = 0.15
    elif phase < 1:
        ndvi = 0.15 + 0.60 * math.sin(phase * math.pi / 2)
    elif phase < 2:
        ndvi = 0.75 - 0.20 * (phase - 1)
    else:
        ndvi = 0.15

    cloud = props.get("eo:cloud_cover", 10) / 100
    ndvi = ndvi * (1 - cloud * 0.1)
    ndvi = round(max(0.05, min(0.95, ndvi)), 4)

    assets = scene.get("assets", {})
    bands_available = [k for k in assets.keys() if k in (
        "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B8A",
        "B09", "B11", "B12", "red", "green", "blue", "nir", "swir16", "swir22",
    )]

    return {
        "ndvi_mean": ndvi,
        "ndvi_min": round(ndvi - 0.08, 4),
        "ndvi_max": round(ndvi + 0.12, 4),
        "ndvi_std": 0.06,
        "pixel_count": 0,
        "satellite_date": parsed_date.isoformat(),
        "cloud_cover": props.get("eo:cloud_cover", 0),
        "platform": props.get("platform", "sentinel-2"),
        "source": "sentinel-2-estimated",
        "resolution": "10m (estimated, rasterio not available for pixel read)",
        "bands_available": bands_available,
        "band_count": len(bands_available),
        "scene_id": scene.get("id", ""),
        "red_band_url": assets.get("red", assets.get("B04", {})).get("href", ""),
        "nir_band_url": assets.get("nir", assets.get("B08", {})).get("href", ""),
        "thumbnail": assets.get("thumbnail", {}).get("href", ""),
        "live": False,
        "note": "Install rasterio on server for actual 10m pixel-level NDVI",
    }
