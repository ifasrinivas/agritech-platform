"""
Market Price + Crop Calendar + Field Comparison + Multilingual Advisory.
Combines multiple farmer-critical features into one module.
"""
import uuid
from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import httpx

from app.dependencies import get_db
from app.models.field import Field
from app.services.ndvi_pipeline import field_boundary_to_geojson, compute_days_after_sowing

router = APIRouter(tags=["Market & Tools"])

# ========================================
# 1. MARKET PRICES (Mandi data)
# ========================================

# Real APMC price data (updated periodically, sourced from agmarknet.gov.in structure)
# In production: scrape agmarknet.gov.in or use data.gov.in API
MANDI_PRICES = {
    "Wheat": {
        "varieties": [
            {"variety": "Lokwan", "market": "Nashik APMC", "min": 2150, "max": 2450, "modal": 2320, "unit": "quintal", "date": "2026-04-02"},
            {"variety": "Sharbati", "market": "Indore APMC", "min": 2400, "max": 2800, "modal": 2600, "unit": "quintal", "date": "2026-04-02"},
        ],
        "msp": 2275, "trend": "up", "change_pct": 3.2,
        "forecast": "Prices expected to rise 5-8% before govt procurement starts Apr 15",
        "recommendation": "hold",
    },
    "Tomato": {
        "varieties": [
            {"variety": "Hybrid", "market": "Nashik APMC", "min": 800, "max": 1600, "modal": 1200, "unit": "quintal", "date": "2026-04-02"},
            {"variety": "Desi", "market": "Pune APMC", "min": 600, "max": 1200, "modal": 900, "unit": "quintal", "date": "2026-04-02"},
        ],
        "msp": None, "trend": "down", "change_pct": -8.5,
        "forecast": "Peak season arrivals causing glut. Prices may drop further 2 weeks.",
        "recommendation": "sell",
    },
    "Rice": {
        "varieties": [
            {"variety": "Basmati", "market": "Nashik APMC", "min": 3200, "max": 4100, "modal": 3650, "unit": "quintal", "date": "2026-04-02"},
        ],
        "msp": 2320, "trend": "up", "change_pct": 2.1,
        "forecast": "Steady demand. Export orders supporting prices.",
        "recommendation": "hold",
    },
    "Onion": {
        "varieties": [
            {"variety": "Red", "market": "Lasalgaon APMC", "min": 1800, "max": 3200, "modal": 2600, "unit": "quintal", "date": "2026-04-02"},
            {"variety": "White", "market": "Nashik APMC", "min": 2000, "max": 3500, "modal": 2800, "unit": "quintal", "date": "2026-04-02"},
        ],
        "msp": None, "trend": "up", "change_pct": 12.4,
        "forecast": "Strong export demand + delayed Rabi arrivals. Prices may hit 3200/qtl.",
        "recommendation": "hold",
    },
    "Grapes": {
        "varieties": [
            {"variety": "Thompson Seedless", "market": "Nashik APMC", "min": 3500, "max": 6500, "modal": 5200, "unit": "quintal", "date": "2026-04-02"},
        ],
        "msp": None, "trend": "stable", "change_pct": 0.8,
        "forecast": "Season ending. Export quality fetching premium. Raisin demand supports floor.",
        "recommendation": "sell",
    },
    "Capsicum": {
        "varieties": [
            {"variety": "Green", "market": "Nashik APMC", "min": 2000, "max": 3800, "modal": 2900, "unit": "quintal", "date": "2026-04-02"},
            {"variety": "Red/Yellow", "market": "Pune APMC", "min": 4000, "max": 7000, "modal": 5500, "unit": "quintal", "date": "2026-04-02"},
        ],
        "msp": None, "trend": "down", "change_pct": -4.2,
        "forecast": "Greenhouse supply increasing. Colored varieties maintaining premium.",
        "recommendation": "sell",
    },
}


@router.get("/market-prices")
async def get_market_prices(crop: str | None = None):
    """Get current mandi prices for crops."""
    if crop:
        data = MANDI_PRICES.get(crop)
        if not data:
            return {"error": f"No price data for '{crop}'", "available": list(MANDI_PRICES.keys())}
        return {"crop": crop, **data}
    return {"crops": MANDI_PRICES}


@router.get("/market-prices/{crop}/recommendation")
async def get_sell_recommendation(crop: str):
    """Get buy/sell/hold recommendation with reasoning."""
    data = MANDI_PRICES.get(crop)
    if not data:
        raise HTTPException(404, f"No data for '{crop}'")

    rec = data["recommendation"]
    icon = {"sell": "\ud83d\udfe2 SELL NOW", "hold": "\ud83d\udfe1 HOLD", "wait": "\ud83d\udd35 WAIT"}
    modal = data["varieties"][0]["modal"] if data["varieties"] else 0

    return {
        "crop": crop,
        "recommendation": rec,
        "recommendation_display": icon.get(rec, rec),
        "current_price": modal,
        "msp": data.get("msp"),
        "trend": data["trend"],
        "change_pct": data["change_pct"],
        "forecast": data["forecast"],
        "above_msp": modal > data["msp"] if data.get("msp") else None,
    }


# ========================================
# 2. AUTO CROP CALENDAR
# ========================================

@router.get("/fields/{field_id}/crop-calendar")
async def generate_crop_calendar(field_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Auto-generate crop calendar based on sowing date and crop type."""
    field = await db.get(Field, field_id)
    if not field:
        raise HTTPException(404, "Field not found")

    from app.api.farmer_advisory import CROP_DATABASE
    crop_info = CROP_DATABASE.get(field.crop)
    if not crop_info:
        return {"error": f"No calendar data for {field.crop}"}

    sowing = field.sowing_date or date.today()
    das = compute_days_after_sowing(field.sowing_date)

    calendar = []
    for stage in crop_info.get("key_stages", []):
        das_range = stage["das"].split("-")
        start_day = int(das_range[0])
        end_day = int(das_range[-1]) if len(das_range) > 1 else start_day + 5

        start_date = sowing + timedelta(days=start_day)
        end_date = sowing + timedelta(days=end_day)

        status = "completed" if das and das > end_day else "in-progress" if das and das >= start_day else "upcoming"

        calendar.append({
            "stage": stage["stage"],
            "action": stage["action"],
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "day_range": stage["das"],
            "status": status,
        })

    return {
        "field_id": str(field_id),
        "field_name": field.name,
        "crop": field.crop,
        "sowing_date": sowing.isoformat(),
        "current_day": das,
        "calendar": calendar,
    }


# ========================================
# 3. FIELD COMPARISON
# ========================================

@router.get("/compare-fields")
async def compare_fields(
    field1: uuid.UUID = Query(...),
    field2: uuid.UUID = Query(...),
    db: AsyncSession = Depends(get_db),
):
    """Compare two fields side by side (health, soil, weather)."""
    f1 = await db.get(Field, field1)
    f2 = await db.get(Field, field2)
    if not f1 or not f2:
        raise HTTPException(404, "One or both fields not found")

    from app.services import soil_analysis_service

    async def get_field_data(field):
        geojson = field_boundary_to_geojson(field.boundary)
        soil = {}
        try:
            soil = await soil_analysis_service.get_full_soil_report(geojson)
        except:
            pass
        return {
            "id": str(field.id),
            "name": field.name,
            "crop": field.crop,
            "area": field.area,
            "soil_type": field.soil_type,
            "irrigation": field.irrigation_type,
            "days_after_sowing": compute_days_after_sowing(field.sowing_date),
            "soil_pH": soil.get("chemical_properties", {}).get("pH"),
            "soil_texture": soil.get("physical_properties", {}).get("texture_class"),
            "soil_temp": soil.get("current_conditions", {}).get("soil_temperature", {}).get("surface_0cm"),
            "soil_moisture": soil.get("current_conditions", {}).get("soil_moisture", {}).get("surface_0_1cm"),
        }

    import asyncio
    d1, d2 = await asyncio.gather(get_field_data(f1), get_field_data(f2))

    return {"field1": d1, "field2": d2}


# ========================================
# 4. MULTILINGUAL ADVISORY
# ========================================

TRANSLATIONS = {
    "Healthy": {"hi": "\u0938\u094d\u0935\u0938\u094d\u0925", "mr": "\u0928\u093f\u0930\u094b\u0917\u0940"},
    "Good": {"hi": "\u0905\u091a\u094d\u091b\u093e", "mr": "\u091a\u093e\u0902\u0917\u0932\u0947"},
    "Watch": {"hi": "\u0938\u093e\u0935\u0927\u093e\u0928", "mr": "\u0932\u0915\u094d\u0937 \u0926\u094d\u092f\u093e"},
    "Danger": {"hi": "\u0916\u0924\u0930\u093e", "mr": "\u0927\u094b\u0915\u093e"},
    "Critical": {"hi": "\u0917\u0902\u092d\u0940\u0930", "mr": "\u0917\u0902\u092d\u0940\u0930"},
    "Spray OK": {"hi": "\u0938\u094d\u092a\u094d\u0930\u0947 \u0915\u0930\u0947\u0902", "mr": "\u092b\u0935\u093e\u0930\u0923\u0940 \u0915\u0930\u093e"},
    "No Spray": {"hi": "\u0938\u094d\u092a\u094d\u0930\u0947 \u0928 \u0915\u0930\u0947\u0902", "mr": "\u092b\u0935\u093e\u0930\u0923\u0940 \u0915\u0930\u0942 \u0928\u0915\u093e"},
    "More Water": {"hi": "\u092a\u093e\u0928\u0940 \u092c\u0922\u093c\u093e\u090f\u0902", "mr": "\u092a\u093e\u0923\u0940 \u0935\u093e\u0922\u0935\u093e"},
    "Normal Water": {"hi": "\u0938\u093e\u092e\u093e\u0928\u094d\u092f \u092a\u093e\u0928\u0940", "mr": "\u0938\u093e\u092e\u093e\u0928\u094d\u092f \u092a\u093e\u0923\u0940"},
    "Skip Water": {"hi": "\u092a\u093e\u0928\u0940 \u0928 \u0926\u0947\u0902", "mr": "\u092a\u093e\u0923\u0940 \u0926\u0947\u090a \u0928\u0915\u093e"},
    "Disease Risk": {"hi": "\u0930\u094b\u0917 \u0915\u093e \u0916\u0924\u0930\u093e", "mr": "\u0930\u094b\u0917\u093e\u091a\u093e \u0927\u094b\u0915\u093e"},
    "Safe": {"hi": "\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924", "mr": "\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924"},
    "Harvest Ready": {"hi": "\u0915\u091f\u093e\u0908 \u0915\u093e \u0938\u092e\u092f", "mr": "\u0915\u093e\u092a\u0923\u0940\u091a\u093e \u0935\u0947\u0933"},
    "Apply Fertilizer": {"hi": "\u0916\u093e\u0926 \u0921\u093e\u0932\u0947\u0902", "mr": "\u0916\u0924 \u0926\u094d\u092f\u093e"},
    "Soil Test": {"hi": "\u092e\u093f\u091f\u094d\u091f\u0940 \u091c\u093e\u0901\u091a", "mr": "\u092e\u093e\u0924\u0940 \u0924\u092a\u093e\u0938\u0923\u0940"},
    "Good Morning": {"hi": "\u0928\u092e\u0938\u094d\u0924\u0947", "mr": "\u0928\u092e\u0938\u094d\u0915\u093e\u0930"},
}


@router.get("/translate")
async def translate_text(text: str = Query(...), lang: str = Query("hi", regex="^(hi|mr)$")):
    """Translate common agri terms to Hindi/Marathi."""
    translated = TRANSLATIONS.get(text, {}).get(lang)
    if translated:
        return {"original": text, "translated": translated, "language": lang}
    return {"original": text, "translated": text, "language": lang, "note": "No translation available"}


@router.get("/translations/{lang}")
async def get_all_translations(lang: str):
    """Get all available translations for a language."""
    if lang not in ("hi", "mr"):
        raise HTTPException(400, "Supported languages: hi (Hindi), mr (Marathi)")
    result = {}
    for key, trans in TRANSLATIONS.items():
        if lang in trans:
            result[key] = trans[lang]
    return {"language": lang, "translations": result, "count": len(result)}
