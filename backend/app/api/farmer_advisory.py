"""
Farmer Advisory Endpoints.
Generates crop-specific, season-aware, location-based recommendations.
Combines satellite, weather, soil, and agronomic knowledge.
"""
import uuid
from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import httpx

from app.dependencies import get_db
from app.models.field import Field
from app.services.ndvi_pipeline import field_boundary_to_geojson, compute_days_after_sowing
from app.services import soil_analysis_service

router = APIRouter(tags=["Farmer Advisory"])


# ---- Crop-Specific Recommendations ----

CROP_DATABASE = {
    "Wheat": {
        "ideal_pH": (6.0, 7.5), "ideal_temp": (15, 25), "water_need": "moderate",
        "npk_ratio": "120:60:40 kg/ha", "sowing_window": "Oct 25 - Nov 20",
        "harvest_window": "Mar 15 - Apr 20", "duration": "120-150 days",
        "common_pests": ["Aphid", "Armyworm", "Termite"],
        "common_diseases": ["Rust (Yellow/Brown)", "Powdery Mildew", "Loose Smut"],
        "organic_options": ["Neem oil spray", "Trichoderma seed treatment", "Crop rotation with legumes"],
        "key_stages": [
            {"stage": "Sowing", "das": "0-5", "action": "Soil prep + seed treatment + basal fertilizer"},
            {"stage": "Crown Root", "das": "21-25", "action": "First irrigation (CRITICAL - do not skip)"},
            {"stage": "Tillering", "das": "30-35", "action": "First urea top-dress + weed control"},
            {"stage": "Jointing", "das": "45-50", "action": "Second irrigation + second urea dose"},
            {"stage": "Flowering", "das": "60-70", "action": "Third irrigation + monitor for rust"},
            {"stage": "Grain Filling", "das": "80-100", "action": "Light irrigation + no nitrogen"},
            {"stage": "Maturity", "das": "110-140", "action": "Stop irrigation + harvest at 14% moisture"},
        ],
    },
    "Tomato": {
        "ideal_pH": (6.0, 7.0), "ideal_temp": (20, 30), "water_need": "high",
        "npk_ratio": "150:80:80 kg/ha", "sowing_window": "Nov 1 - Jan 15 (Rabi)",
        "harvest_window": "Feb 15 - Jun 15", "duration": "120-150 days",
        "common_pests": ["Whitefly", "Fruit Borer", "Leaf Miner"],
        "common_diseases": ["Early Blight", "Late Blight", "Fusarium Wilt", "Bacterial Wilt"],
        "organic_options": ["Neem cake basal", "Pseudomonas fluorescens", "Trichoderma viride", "Pheromone traps"],
        "key_stages": [
            {"stage": "Nursery", "das": "0-25", "action": "Seed treatment + shade net + daily watering"},
            {"stage": "Transplant", "das": "25-30", "action": "Transplant at 4-leaf stage + basal NPK"},
            {"stage": "Vegetative", "das": "30-50", "action": "Staking + weeding + 19:19:19 fertigation"},
            {"stage": "Flowering", "das": "50-70", "action": "Calcium Boron spray + pollination support"},
            {"stage": "Fruiting", "das": "70-100", "action": "Potash dose + pest scouting weekly"},
            {"stage": "Harvest", "das": "100-150", "action": "Pick at pink stage for transport, red for local"},
        ],
    },
    "Rice": {
        "ideal_pH": (5.5, 7.0), "ideal_temp": (25, 35), "water_need": "very_high",
        "npk_ratio": "100:50:50 kg/ha", "sowing_window": "Jun 15 - Jul 15 (Kharif)",
        "harvest_window": "Oct - Nov", "duration": "120-150 days",
        "common_pests": ["Stem Borer", "Brown Plant Hopper", "Gall Midge"],
        "common_diseases": ["Blast", "Sheath Blight", "Brown Spot", "BLB"],
        "organic_options": ["Azolla dual cropping", "Bt spray for stem borer", "Silicon spray", "AWD water saving"],
        "key_stages": [
            {"stage": "Nursery", "das": "0-21", "action": "Seed treatment + raised bed nursery"},
            {"stage": "Transplant", "das": "21-25", "action": "2-3 seedlings/hill + 20x15cm spacing"},
            {"stage": "Tillering", "das": "25-50", "action": "First urea + maintain 3cm water"},
            {"stage": "Panicle Init", "das": "55-70", "action": "Second urea + zinc spray if needed"},
            {"stage": "Flowering", "das": "70-90", "action": "Keep flooded + no nitrogen"},
            {"stage": "Grain Fill", "das": "90-120", "action": "Drain gradually + watch for neck blast"},
        ],
    },
    "Onion": {
        "ideal_pH": (6.0, 7.0), "ideal_temp": (15, 25), "water_need": "moderate",
        "npk_ratio": "100:50:60 kg/ha", "sowing_window": "Oct 1-15 (nursery), Nov 15 (transplant)",
        "harvest_window": "Apr - May", "duration": "120-140 days",
        "common_pests": ["Thrips", "Onion Maggot"],
        "common_diseases": ["Purple Blotch", "Downy Mildew", "Basal Rot"],
        "organic_options": ["Blue sticky traps for thrips", "Spinosad bio-spray", "Trichoderma soil drench"],
        "key_stages": [
            {"stage": "Nursery", "das": "0-45", "action": "Raised beds + Trichoderma + regular watering"},
            {"stage": "Transplant", "das": "45-50", "action": "10x15cm spacing + DAP basal"},
            {"stage": "Vegetative", "das": "50-80", "action": "Urea top-dress + thrips monitoring (ETL: 5/plant)"},
            {"stage": "Bulbing", "das": "80-110", "action": "Potash dose + reduce nitrogen + moderate water"},
            {"stage": "Maturity", "das": "110-130", "action": "Neck fall 50% = stop irrigation + cure 10-14 days"},
        ],
    },
    "Grapes": {
        "ideal_pH": (6.5, 7.5), "ideal_temp": (15, 35), "water_need": "moderate",
        "npk_ratio": "200:100:200 kg/ha", "sowing_window": "Perennial (pruning: Oct)",
        "harvest_window": "Feb - Apr", "duration": "Perennial",
        "common_pests": ["Mealy Bug", "Flea Beetle", "Thrips"],
        "common_diseases": ["Powdery Mildew", "Downy Mildew", "Anthracnose"],
        "organic_options": ["Sulphur dust", "Bordeaux mixture", "Potassium bicarbonate", "Neem oil"],
        "key_stages": [
            {"stage": "Pruning", "das": "0", "action": "October pruning + Bordeaux paste on cuts"},
            {"stage": "Bud Break", "das": "10-15", "action": "Gibberellic acid if needed + first spray"},
            {"stage": "Flowering", "das": "25-35", "action": "No water stress + boron spray"},
            {"stage": "Berry Dev", "das": "40-60", "action": "Thinning + potash + weekly mildew spray"},
            {"stage": "Veraison", "das": "70-90", "action": "Reduce water + SO2 pad if export"},
            {"stage": "Harvest", "das": "100-120", "action": "Brix > 18 + early morning harvest + cold chain"},
        ],
    },
    "Capsicum": {
        "ideal_pH": (6.0, 7.0), "ideal_temp": (18, 30), "water_need": "moderate",
        "npk_ratio": "180:90:90 kg/ha", "sowing_window": "Year-round (greenhouse)",
        "harvest_window": "60-90 days after transplant", "duration": "150-180 days",
        "common_pests": ["Aphids", "Thrips", "Mites"],
        "common_diseases": ["Bacterial Wilt", "Powdery Mildew", "Blossom End Rot"],
        "organic_options": ["Neem oil", "Beauveria bassiana", "Calcium spray for BER"],
        "key_stages": [
            {"stage": "Nursery", "das": "0-30", "action": "Protrays + cocopeat + shade net"},
            {"stage": "Transplant", "das": "30-35", "action": "45x30cm + drip setup + mulch"},
            {"stage": "Vegetative", "das": "35-55", "action": "19:19:19 fertigation + training"},
            {"stage": "Flowering", "das": "55-75", "action": "CaNO3 + boron spray + bumble bees"},
            {"stage": "Fruiting", "das": "75-150", "action": "Potash + harvest at color break"},
        ],
    },
}


@router.get("/fields/{field_id}/full-advisory")
async def get_field_full_advisory(field_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Complete farmer advisory for a field combining:
    - Crop-specific schedule and recommendations
    - Current growth stage actions
    - Weather-based spray/irrigation advice
    - Soil-based fertilizer recommendations
    - Pest/disease risk assessment
    - Ideal values reference
    """
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")

    geojson = field_boundary_to_geojson(field.boundary)
    das = compute_days_after_sowing(field.sowing_date)
    crop_info = CROP_DATABASE.get(field.crop, CROP_DATABASE.get("Wheat"))

    # Get live data
    from shapely.geometry import shape
    centroid = shape(geojson).centroid

    soil = None
    weather = None
    try:
        soil = await soil_analysis_service.get_full_soil_report(geojson)
    except:
        pass

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(f"https://api.open-meteo.com/v1/forecast", params={
                "latitude": centroid.y, "longitude": centroid.x,
                "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation",
                "daily": "precipitation_sum,temperature_2m_max,temperature_2m_min",
                "forecast_days": 3, "timezone": "auto",
            })
            if resp.status_code == 200:
                weather = resp.json()
    except:
        pass

    # Current stage
    current_stage = None
    next_action = None
    if crop_info and das is not None:
        for stage in crop_info.get("key_stages", []):
            das_range = stage["das"].split("-")
            stage_start = int(das_range[0])
            stage_end = int(das_range[-1]) if len(das_range) > 1 else stage_start + 10
            if stage_start <= das <= stage_end:
                current_stage = stage
                break
        # Next upcoming stage
        for stage in crop_info.get("key_stages", []):
            stage_start = int(stage["das"].split("-")[0])
            if das < stage_start:
                next_action = stage
                break

    # Weather-based advice
    spray_advice = "Check weather before spraying"
    if weather:
        curr = weather.get("current", {})
        wind = curr.get("wind_speed_10m", 10)
        rain_3d = sum(weather.get("daily", {}).get("precipitation_sum", [0, 0, 0])[:3])
        if wind < 12 and rain_3d < 5 and curr.get("temperature_2m", 25) < 35:
            spray_advice = "Good conditions for spraying today (low wind, no rain expected)"
        elif wind >= 12:
            spray_advice = "Too windy for spraying. Wait for calm conditions."
        elif rain_3d > 10:
            spray_advice = f"Rain expected ({rain_3d:.0f}mm in 3 days). Delay spray. Prepare drainage."

    # Soil-based fertilizer advice
    fert_advice = []
    if soil and "chemical_properties" in soil:
        chem = soil["chemical_properties"]
        if chem.get("pH", 7) < 6:
            fert_advice.append("Soil acidic - apply lime 2-4 quintal/acre before sowing")
        if chem.get("pH", 7) > 8:
            fert_advice.append("Soil alkaline - apply gypsum + organic matter")
        if chem.get("organic_carbon_pct", 0.5) < 0.5:
            fert_advice.append("Low organic carbon - apply FYM 5 ton/acre or vermicompost 2 ton/acre")
        fert_advice.append(f"Recommended NPK: {crop_info.get('npk_ratio', 'Follow soil test report')}")

    return {
        "field_id": str(field_id),
        "field_name": field.name,
        "crop": field.crop,
        "area_acres": field.area,
        "days_after_sowing": das,
        "sowing_date": field.sowing_date.isoformat() if field.sowing_date else None,

        "crop_info": {
            "ideal_pH": crop_info.get("ideal_pH"),
            "ideal_temp": crop_info.get("ideal_temp"),
            "water_need": crop_info.get("water_need"),
            "npk_ratio": crop_info.get("npk_ratio"),
            "duration": crop_info.get("duration"),
            "sowing_window": crop_info.get("sowing_window"),
            "harvest_window": crop_info.get("harvest_window"),
        },

        "current_stage": current_stage,
        "next_action": next_action,

        "today_advisory": {
            "spray": spray_advice,
            "pests_to_watch": crop_info.get("common_pests", []),
            "diseases_to_watch": crop_info.get("common_diseases", []),
            "organic_options": crop_info.get("organic_options", []),
            "fertilizer": fert_advice,
        },

        "growth_schedule": crop_info.get("key_stages", []),

        "soil_summary": {
            "pH": soil.get("chemical_properties", {}).get("pH") if soil else None,
            "texture": soil.get("physical_properties", {}).get("texture_class") if soil else None,
            "moisture": soil.get("current_conditions", {}).get("soil_moisture", {}).get("surface_0_1cm") if soil else None,
            "temperature": soil.get("current_conditions", {}).get("soil_temperature", {}).get("surface_0cm") if soil else None,
        },

        "weather_summary": {
            "temperature": weather.get("current", {}).get("temperature_2m") if weather else None,
            "humidity": weather.get("current", {}).get("relative_humidity_2m") if weather else None,
            "wind": weather.get("current", {}).get("wind_speed_10m") if weather else None,
        },

        "ideal_values": {
            "pH": crop_info.get("ideal_pH"),
            "temperature_C": crop_info.get("ideal_temp"),
            "npk_kg_ha": crop_info.get("npk_ratio"),
            "water_need": crop_info.get("water_need"),
        },
    }


@router.get("/crop-guide/{crop_name}")
async def get_crop_guide(crop_name: str):
    """Get complete growing guide for a crop."""
    crop = CROP_DATABASE.get(crop_name)
    if not crop:
        available = list(CROP_DATABASE.keys())
        raise HTTPException(404, f"Crop '{crop_name}' not found. Available: {available}")
    return {"crop": crop_name, **crop}
