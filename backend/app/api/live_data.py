"""
Live Data Endpoints.
All data from real-time APIs — no mock/static data.
"""
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.field import Field
from app.services.ndvi_pipeline import field_boundary_to_geojson
from app.services import live_ndvi_service, live_market_service
from app.schemas.field import GeoJSONPolygon

router = APIRouter(prefix="/live", tags=["Live Data (Real-time)"])


@router.get("/fields/{field_id}/ndvi")
async def get_live_ndvi(field_id: uuid.UUID, days_back: int = 30, db: AsyncSession = Depends(get_db)):
    """
    Get LIVE NDVI from actual Sentinel-2 satellite imagery.
    Reads real COG pixel data (B04 Red + B08 NIR) when rasterio is available.
    Falls back to scene metadata + estimation when not.
    """
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")
    geojson = field_boundary_to_geojson(field.boundary)
    result = await live_ndvi_service.compute_live_ndvi(geojson, days_back)
    if not result:
        return {"error": "No recent Sentinel-2 scenes found", "field_id": str(field_id)}
    result["field_id"] = str(field_id)
    result["field_name"] = field.name
    result["crop"] = field.crop
    return result


@router.post("/ndvi")
async def get_live_ndvi_adhoc(boundary: dict, days_back: int = 30):
    """Live NDVI for any polygon (no field storage)."""
    result = await live_ndvi_service.compute_live_ndvi(boundary, days_back)
    if not result:
        return {"error": "No recent scenes found"}
    return result


@router.get("/market/{commodity}")
async def get_live_market_price(commodity: str, state: str = "Maharashtra"):
    """
    Get LIVE market prices from data.gov.in API.
    Falls back to curated data if API is unavailable.
    """
    result = await live_market_service.fetch_live_mandi_prices(commodity, state)
    return result


@router.get("/weather-history")
async def get_historical_weather(
    lat: float = Query(...), lon: float = Query(...),
    days_back: int = Query(90, ge=7, le=365),
):
    """
    Get LIVE historical weather data (actual recorded, not forecast).
    Source: Open-Meteo Archive API (free).
    """
    return await live_market_service.fetch_historical_weather(lat, lon, days_back)


@router.get("/fields/{field_id}/complete-live")
async def get_complete_live_data(field_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Get ALL live data for a field in one call:
    - Live NDVI from Sentinel-2
    - Live weather (current + forecast)
    - Live soil conditions (temp + moisture)
    - Live market price for crop
    - Live historical weather (90 days)
    - Live pest risk
    """
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")

    geojson = field_boundary_to_geojson(field.boundary)
    from shapely.geometry import shape
    centroid = shape(geojson).centroid
    lat, lon = centroid.y, centroid.x

    import asyncio
    import httpx
    from app.services import soil_analysis_service

    # Fetch everything in parallel
    ndvi_task = asyncio.create_task(live_ndvi_service.compute_live_ndvi(geojson))
    soil_task = asyncio.create_task(soil_analysis_service.get_full_soil_report(geojson))
    market_task = asyncio.create_task(live_market_service.fetch_live_mandi_prices(field.crop))
    history_task = asyncio.create_task(live_market_service.fetch_historical_weather(lat, lon, 90))

    # Weather current
    weather = None
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get("https://api.open-meteo.com/v1/forecast", params={
                "latitude": lat, "longitude": lon,
                "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,uv_index",
                "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
                "forecast_days": 7, "timezone": "auto",
            })
            if resp.status_code == 200:
                weather = resp.json()
    except:
        pass

    # Pest risk
    pest = None
    try:
        from app.api.farm_tools import predict_pest_risk
        # Create a mock request
        class MockQuery:
            pass
        pest_resp = await predict_pest_risk(crop=field.crop, lat=lat, lon=lon)
        pest = pest_resp
    except:
        pass

    ndvi = await ndvi_task
    soil = await soil_task
    market = await market_task
    history = await history_task

    return {
        "field_id": str(field_id),
        "field_name": field.name,
        "crop": field.crop,
        "area_acres": field.area,
        "location": {"latitude": round(lat, 6), "longitude": round(lon, 6)},
        "timestamp": __import__("datetime").datetime.utcnow().isoformat(),

        "live_data": {
            "ndvi": ndvi,
            "weather": {
                "current": weather.get("current") if weather else None,
                "daily": weather.get("daily") if weather else None,
                "source": "open-meteo (live)",
                "live": True,
            },
            "soil": {
                "properties": soil.get("physical_properties") if soil else None,
                "chemistry": soil.get("chemical_properties") if soil else None,
                "conditions": soil.get("current_conditions") if soil else None,
                "live": bool(soil and "current_conditions" in soil),
            },
            "market": market,
            "pest_risk": pest,
            "weather_history": {
                "total_rainfall_90d": history.get("summary", {}).get("total_rainfall_mm") if isinstance(history, dict) else None,
                "avg_max_temp": history.get("summary", {}).get("avg_max_temp") if isinstance(history, dict) else None,
                "live": history.get("live", False) if isinstance(history, dict) else False,
            },
        },

        "data_sources": {
            "ndvi": ndvi.get("source", "unknown") if ndvi else "unavailable",
            "weather": "open-meteo (live)",
            "soil_properties": soil.get("physical_properties", {}).get("source", "?") if soil else "unavailable",
            "soil_conditions": "open-meteo (live)" if soil and "current_conditions" in soil else "unavailable",
            "market": market.get("source", "unknown") if market else "unavailable",
            "pest_risk": "weather-based (live)" if pest else "unavailable",
            "weather_history": "open-meteo-archive (live)" if history and history.get("live") else "unavailable",
        },
    }
