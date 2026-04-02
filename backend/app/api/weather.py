"""
Location-based weather forecast endpoints.
Uses Open-Meteo API (100% free, no key required).
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
import httpx
import uuid

from app.dependencies import get_db
from app.models.field import Field
from app.services.ndvi_pipeline import field_boundary_to_geojson

router = APIRouter(tags=["Weather"])

OPEN_METEO = "https://api.open-meteo.com/v1/forecast"
GEOCODING = "https://geocoding-api.open-meteo.com/v1/search"


@router.get("/weather/forecast")
async def get_weather_forecast(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    days: int = Query(7, ge=1, le=16),
):
    """
    Get weather forecast for any GPS location.
    Returns current conditions + hourly + daily + agricultural insights.
    All data from Open-Meteo (free, no API key).
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": ",".join([
            "temperature_2m", "relative_humidity_2m", "wind_speed_10m",
            "wind_direction_10m", "precipitation", "weather_code",
            "cloud_cover", "surface_pressure", "uv_index",
            "apparent_temperature", "is_day",
        ]),
        "hourly": ",".join([
            "temperature_2m", "relative_humidity_2m", "precipitation",
            "wind_speed_10m", "weather_code", "dew_point_2m",
            "soil_temperature_0cm", "soil_moisture_0_to_1cm",
            "et0_fao_evapotranspiration",
        ]),
        "daily": ",".join([
            "temperature_2m_max", "temperature_2m_min", "precipitation_sum",
            "precipitation_probability_max", "weather_code",
            "wind_speed_10m_max", "sunrise", "sunset",
            "uv_index_max", "et0_fao_evapotranspiration",
        ]),
        "timezone": "auto",
        "forecast_days": days,
    }

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(OPEN_METEO, params=params)
        if resp.status_code != 200:
            raise HTTPException(502, f"Weather API error: {resp.status_code}")
        data = resp.json()

    current = data.get("current", {})
    hourly = data.get("hourly", {})
    daily = data.get("daily", {})

    # Agricultural insights from current conditions
    insights = _compute_agri_insights(current, hourly, daily)

    return {
        "location": {"latitude": lat, "longitude": lon, "timezone": data.get("timezone")},
        "current": {
            "temperature": current.get("temperature_2m"),
            "humidity": current.get("relative_humidity_2m"),
            "wind_speed": current.get("wind_speed_10m"),
            "wind_direction": current.get("wind_direction_10m"),
            "precipitation": current.get("precipitation"),
            "weather_code": current.get("weather_code"),
            "cloud_cover": current.get("cloud_cover"),
            "pressure": current.get("surface_pressure"),
            "uv_index": current.get("uv_index"),
            "feels_like": current.get("apparent_temperature"),
            "is_day": current.get("is_day") == 1,
        },
        "hourly": {
            "time": hourly.get("time", [])[:48],
            "temperature": hourly.get("temperature_2m", [])[:48],
            "humidity": hourly.get("relative_humidity_2m", [])[:48],
            "precipitation": hourly.get("precipitation", [])[:48],
            "wind_speed": hourly.get("wind_speed_10m", [])[:48],
            "weather_code": hourly.get("weather_code", [])[:48],
            "soil_temperature": hourly.get("soil_temperature_0cm", [])[:48],
            "soil_moisture": hourly.get("soil_moisture_0_to_1cm", [])[:48],
            "evapotranspiration": hourly.get("et0_fao_evapotranspiration", [])[:48],
        },
        "daily": {
            "time": daily.get("time", []),
            "temperature_max": daily.get("temperature_2m_max", []),
            "temperature_min": daily.get("temperature_2m_min", []),
            "precipitation_sum": daily.get("precipitation_sum", []),
            "precipitation_probability": daily.get("precipitation_probability_max", []),
            "weather_code": daily.get("weather_code", []),
            "wind_speed_max": daily.get("wind_speed_10m_max", []),
            "sunrise": daily.get("sunrise", []),
            "sunset": daily.get("sunset", []),
            "uv_index_max": daily.get("uv_index_max", []),
            "et0": daily.get("et0_fao_evapotranspiration", []),
        },
        "agricultural_insights": insights,
    }


@router.get("/fields/{field_id}/weather")
async def get_field_weather(
    field_id: uuid.UUID,
    days: int = Query(7, ge=1, le=16),
    db: AsyncSession = Depends(get_db),
):
    """Get weather forecast for a specific field (uses field centroid)."""
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")

    geojson = field_boundary_to_geojson(field.boundary)
    from shapely.geometry import shape
    centroid = shape(geojson).centroid

    forecast = await get_weather_forecast(lat=centroid.y, lon=centroid.x, days=days)
    forecast["field_id"] = str(field_id)
    forecast["field_name"] = field.name
    forecast["crop"] = field.crop
    return forecast


@router.get("/weather/search")
async def search_location(q: str = Query(..., min_length=2, description="City or place name")):
    """Search for a location by name. Returns lat/lng for weather lookup."""
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(GEOCODING, params={"name": q, "count": 5, "language": "en"})
        if resp.status_code != 200:
            return {"results": []}
        data = resp.json()

    results = []
    for r in data.get("results", []):
        results.append({
            "name": r.get("name"),
            "country": r.get("country"),
            "admin1": r.get("admin1"),  # state/province
            "latitude": r.get("latitude"),
            "longitude": r.get("longitude"),
            "elevation": r.get("elevation"),
            "timezone": r.get("timezone"),
            "population": r.get("population"),
        })
    return {"query": q, "results": results}


def _compute_agri_insights(current: dict, hourly: dict, daily: dict) -> dict:
    """Compute agricultural insights from weather data."""
    temp = current.get("temperature_2m", 25)
    humidity = current.get("relative_humidity_2m", 50)
    wind = current.get("wind_speed_10m", 10)
    precip = current.get("precipitation", 0)

    # Spray window
    next12_wind = hourly.get("wind_speed_10m", [])[:12]
    next12_rain = hourly.get("precipitation", [])[:12]
    low_wind = any(w < 12 for w in next12_wind) if next12_wind else True
    no_rain = all(r < 0.5 for r in next12_rain) if next12_rain else True
    spray_ok = low_wind and no_rain and temp < 35

    # Disease risk
    high_humidity_hrs = sum(1 for h in hourly.get("relative_humidity_2m", [])[:24] if h and h > 85)
    diseases = []
    if high_humidity_hrs > 8 and 20 < temp < 28:
        diseases.append("Late Blight (Tomato/Potato)")
    if high_humidity_hrs > 6 and temp > 25:
        diseases.append("Downy Mildew")
    if 40 < humidity < 80 and 20 < temp < 30:
        diseases.append("Powdery Mildew")

    # Irrigation advice
    rain_3d = sum(daily.get("precipitation_sum", [])[:3])
    et0_today = daily.get("et0_fao_evapotranspiration", [0])[0] if daily.get("et0_fao_evapotranspiration") else 0

    irrigation = (
        "skip" if rain_3d > 20 else
        "increase" if et0_today > 5 else
        "normal"
    )

    # Frost/heat
    temp_mins = daily.get("temperature_2m_min", [])
    temp_maxs = daily.get("temperature_2m_max", [])
    frost_risk = any(t < 4 for t in temp_mins if t is not None)
    heat_stress = any(t > 42 for t in temp_maxs if t is not None)

    return {
        "spray_window": {
            "suitable": spray_ok,
            "reason": (
                "Wind too high" if not low_wind else
                "Rain expected" if not no_rain else
                "Too hot (>35°C)" if temp >= 35 else
                "Good conditions"
            ),
        },
        "disease_risk": {
            "level": "high" if len(diseases) >= 2 else "medium" if diseases else "low",
            "diseases": diseases,
        },
        "irrigation": {
            "advice": irrigation,
            "rain_next_3d_mm": round(rain_3d, 1),
            "et0_today_mm": round(et0_today, 2),
        },
        "frost_risk": frost_risk,
        "heat_stress": heat_stress,
    }
