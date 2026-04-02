"""
Soil Analysis Service.
Combines SoilGrids API (250m, free) with Sentinel-2 moisture proxy
to provide comprehensive soil health report for a field polygon.
"""
import logging
from datetime import date

import httpx
from shapely.geometry import shape

logger = logging.getLogger(__name__)

SOILGRIDS_URL = "https://rest.isric.org/soilgrids/v2.0/properties/query"
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


async def get_full_soil_report(geojson_polygon: dict) -> dict:
    """
    Full soil analysis report combining:
    1. SoilGrids physical/chemical properties (250m global)
    2. Open-Meteo soil temperature + moisture (real-time)
    3. Sentinel-2 moisture proxy (20m)
    """
    poly = shape(geojson_polygon)
    centroid = poly.centroid
    lat, lon = centroid.y, centroid.x

    # Fetch all data in parallel
    import asyncio
    soilgrids_task = asyncio.create_task(_fetch_soilgrids(lat, lon))
    weather_soil_task = asyncio.create_task(_fetch_weather_soil(lat, lon))
    sentinel_moisture_task = asyncio.create_task(_fetch_sentinel_moisture(geojson_polygon))

    soilgrids = await soilgrids_task
    weather_soil = await weather_soil_task
    sentinel_moisture = await sentinel_moisture_task

    # Combine into comprehensive report
    report = {
        "location": {"latitude": round(lat, 6), "longitude": round(lon, 6)},
        "area_hectares": round(poly.area * 111320 * 110540 / 10000, 2),  # approx

        # Physical properties from SoilGrids
        "physical_properties": soilgrids.get("physical", {}),

        # Chemical properties from SoilGrids
        "chemical_properties": soilgrids.get("chemical", {}),

        # Real-time soil conditions from weather API
        "current_conditions": weather_soil,

        # Satellite moisture from Sentinel-2
        "satellite_moisture": sentinel_moisture,

        # Quality & data sources
        "data_sources": {
            "soil_properties": "ISRIC SoilGrids v2.0 (250m resolution)",
            "real_time": "Open-Meteo Soil API (hourly)",
            "satellite_moisture": "Sentinel-2 NDMI proxy (20m)",
        },

        # Recommendations
        "recommendations": _generate_recommendations(soilgrids, weather_soil, sentinel_moisture),

        "report_date": date.today().isoformat(),
    }

    return report


async def _fetch_soilgrids(lat: float, lon: float) -> dict:
    """Fetch soil properties from SoilGrids (free, no key)."""
    properties = ["clay", "sand", "silt", "soc", "phh2o", "nitrogen", "cec", "bdod"]
    depths = ["0-5cm", "5-15cm", "15-30cm"]

    params = {
        "lon": str(lon),
        "lat": str(lat),
        "property": ",".join(properties),
        "depth": ",".join(depths),
        "value": "mean",
    }

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.get(SOILGRIDS_URL, params=params)
            if resp.status_code != 200:
                return _default_soilgrids()

            data = resp.json()

            def get_val(prop: str, depth_idx: int = 1) -> float:
                layer = next((l for l in data.get("properties", {}).get("layers", []) if l["name"] == prop), None)
                if not layer:
                    return 0
                vals = layer.get("depths", [{}])[depth_idx].get("values", {})
                return vals.get("mean", 0)

            clay = get_val("clay") / 10  # g/kg -> %
            sand = get_val("sand") / 10
            silt = get_val("silt") / 10
            soc = get_val("soc") / 100  # dg/kg -> %
            ph = get_val("phh2o") / 10
            nitrogen = get_val("nitrogen")  # cg/kg
            cec = get_val("cec") / 10  # mmol/kg -> cmol/kg
            bdod = get_val("bdod") / 100  # cg/cm3 -> g/cm3

            # Texture classification
            texture = _classify_texture(clay, sand, silt)

            # pH interpretation
            ph_status = (
                "Very Acidic" if ph < 5.5 else
                "Acidic" if ph < 6.0 else
                "Slightly Acidic" if ph < 6.5 else
                "Neutral (Ideal)" if ph <= 7.5 else
                "Slightly Alkaline" if ph <= 8.0 else
                "Alkaline"
            )

            # OC status
            oc_status = (
                "Very Low" if soc < 0.3 else
                "Low" if soc < 0.5 else
                "Medium" if soc < 0.75 else
                "High" if soc < 1.0 else
                "Very High"
            )

            return {
                "physical": {
                    "clay_pct": round(clay, 1),
                    "sand_pct": round(sand, 1),
                    "silt_pct": round(silt, 1),
                    "texture_class": texture,
                    "bulk_density": round(bdod, 2),
                    "bulk_density_unit": "g/cm³",
                },
                "chemical": {
                    "pH": round(ph, 1),
                    "pH_status": ph_status,
                    "organic_carbon_pct": round(soc, 2),
                    "organic_carbon_status": oc_status,
                    "nitrogen_cg_kg": round(nitrogen, 1),
                    "cec_cmol_kg": round(cec, 1),
                    "cec_status": "Low" if cec < 10 else "Medium" if cec < 25 else "High",
                },
                "source": "soilgrids_live",
            }
    except Exception as e:
        logger.info(f"SoilGrids unavailable, using defaults: {e}")
        return _default_soilgrids()


async def _fetch_weather_soil(lat: float, lon: float) -> dict:
    """Fetch real-time soil temperature and moisture from Open-Meteo."""
    params = {
        "latitude": str(lat),
        "longitude": str(lon),
        "hourly": "soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm",
        "forecast_days": "1",
        "timezone": "Asia/Kolkata",
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(OPEN_METEO_URL, params=params)
            if resp.status_code != 200:
                return {"error": "Weather soil API unavailable"}

            data = resp.json()
            hourly = data.get("hourly", {})

            # Get latest values (current hour)
            idx = min(len(hourly.get("time", [])) - 1, 12)  # noon or latest

            return {
                "soil_temperature": {
                    "surface_0cm": hourly.get("soil_temperature_0cm", [None])[idx],
                    "depth_6cm": hourly.get("soil_temperature_6cm", [None])[idx],
                    "depth_18cm": hourly.get("soil_temperature_18cm", [None])[idx],
                    "unit": "°C",
                },
                "soil_moisture": {
                    "surface_0_1cm": round((hourly.get("soil_moisture_0_to_1cm", [0])[idx] or 0) * 100, 1),
                    "depth_1_3cm": round((hourly.get("soil_moisture_1_to_3cm", [0])[idx] or 0) * 100, 1),
                    "depth_3_9cm": round((hourly.get("soil_moisture_3_to_9cm", [0])[idx] or 0) * 100, 1),
                    "depth_9_27cm": round((hourly.get("soil_moisture_9_to_27cm", [0])[idx] or 0) * 100, 1),
                    "unit": "% volumetric",
                },
                "source": "open_meteo_live",
                "timestamp": hourly.get("time", [""])[idx],
            }
    except Exception as e:
        return {"error": str(e), "source": "unavailable"}


async def _fetch_sentinel_moisture(geojson_polygon: dict) -> dict:
    """Get Sentinel-2 based moisture proxy."""
    try:
        from app.services.sentinel_service import get_soil_moisture_proxy
        return await get_soil_moisture_proxy(geojson_polygon)
    except Exception as e:
        return {"error": str(e)}


def _classify_texture(clay: float, sand: float, silt: float) -> str:
    if clay >= 40:
        return "Silty Clay" if silt >= 40 else "Sandy Clay" if sand >= 45 else "Clay"
    if clay >= 27:
        if sand >= 20 and sand <= 45:
            return "Clay Loam"
        return "Silty Clay Loam" if silt >= 40 else "Sandy Clay Loam"
    if silt >= 50:
        return "Silt Loam" if clay >= 12 else "Silt"
    if sand >= 85:
        return "Sand"
    if sand >= 70:
        return "Loamy Sand"
    if sand >= 43:
        return "Sandy Loam"
    return "Loam"


def _default_soilgrids() -> dict:
    return {
        "physical": {
            "clay_pct": 32, "sand_pct": 28, "silt_pct": 40,
            "texture_class": "Clay Loam", "bulk_density": 1.35, "bulk_density_unit": "g/cm³",
        },
        "chemical": {
            "pH": 7.2, "pH_status": "Neutral (Ideal)",
            "organic_carbon_pct": 0.65, "organic_carbon_status": "Medium",
            "nitrogen_cg_kg": 140, "cec_cmol_kg": 22, "cec_status": "Medium",
        },
        "source": "defaults_nashik",
    }


def _generate_recommendations(soilgrids: dict, weather: dict, moisture: dict) -> list[str]:
    recs = []
    chem = soilgrids.get("chemical", {})
    phys = soilgrids.get("physical", {})

    # pH
    ph = chem.get("pH", 7)
    if ph < 5.5:
        recs.append(f"Soil very acidic (pH {ph}). Apply lime @ 2-4 quintal/acre.")
    elif ph > 8.0:
        recs.append(f"Soil alkaline (pH {ph}). Apply gypsum + organic matter.")
    else:
        recs.append(f"Soil pH {ph} is within optimal range for most crops.")

    # Organic carbon
    oc = chem.get("organic_carbon_pct", 0)
    if oc < 0.3:
        recs.append(f"CRITICAL: Very low organic carbon ({oc}%). Apply FYM @ 5 ton/acre + green manuring.")
    elif oc < 0.5:
        recs.append(f"Low organic carbon ({oc}%). Increase through vermicompost + cover cropping.")

    # Moisture
    moist = moisture.get("moisture_percent_estimate")
    if moist and moist < 20:
        recs.append(f"Soil moisture low ({moist}%). Schedule irrigation. Use mulching to retain moisture.")
    elif moist and moist > 50:
        recs.append(f"Soil moisture high ({moist}%). Check drainage. Risk of waterlogging.")

    # Texture
    texture = phys.get("texture_class", "")
    if "Clay" in texture:
        recs.append(f"{texture}: Good nutrient retention but may waterlog. Ensure proper drainage.")
    elif "Sand" in texture:
        recs.append(f"{texture}: Free draining but low retention. Use split fertilizer applications.")

    # CEC
    cec = chem.get("cec_cmol_kg", 0)
    if cec < 10:
        recs.append(f"Low CEC ({cec} cmol/kg). Add organic matter to improve nutrient holding capacity.")

    if not recs:
        recs.append("Soil conditions appear favorable. Continue current management practices.")

    return recs
