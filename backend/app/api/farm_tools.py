"""
Farm Tools: Input Cost Calculator + Pest Risk Prediction + Profit Estimator.
Practical tools farmers use daily.
"""
import uuid
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
import httpx

from app.dependencies import get_db
from app.models.field import Field
from app.services.ndvi_pipeline import field_boundary_to_geojson, compute_days_after_sowing

router = APIRouter(tags=["Farm Tools"])

# ---- Input prices (INR) ----
INPUT_PRICES = {
    "Urea (45kg bag)": 266,
    "DAP (50kg bag)": 1350,
    "MOP (50kg bag)": 850,
    "SSP (50kg bag)": 450,
    "10:26:26 (50kg bag)": 1250,
    "19:19:19 (1kg)": 120,
    "Vermicompost (1 ton)": 6000,
    "FYM (1 ton)": 1500,
    "Neem Oil 1500ppm (1L)": 500,
    "Neem Cake (1 quintal)": 1500,
    "Mancozeb 75% WP (500g)": 350,
    "Chlorothalonil 75% WP (500g)": 400,
    "Emamectin Benzoate 5% SG (100g)": 280,
    "Fipronil 5% SC (500ml)": 350,
    "Lambda Cyhalothrin 5% EC (500ml)": 300,
    "Trichoderma viride (1kg)": 400,
    "Pseudomonas fluorescens (1kg)": 350,
    "Pheromone traps (pack 5)": 250,
    "Blue sticky traps (pack 25)": 300,
    "Mulching film 50μ (1 roll)": 4800,
    "Drip lateral 16mm (100m)": 640,
}


# ========================================
# 1. INPUT COST CALCULATOR
# ========================================

class InputCostRequest(BaseModel):
    crop: str
    area_acres: float
    include_organic: bool = True


@router.post("/calculate-input-cost")
async def calculate_input_cost(data: InputCostRequest):
    """Calculate total input cost for a crop season."""
    crop = data.crop
    area = data.area_acres

    # Crop-specific input requirements per acre
    crop_inputs: dict[str, list[dict]] = {
        "Wheat": [
            {"item": "Urea (45kg bag)", "qty_per_acre": 2.5, "timing": "Basal + 2 top-dress"},
            {"item": "DAP (50kg bag)", "qty_per_acre": 1.0, "timing": "Basal dose"},
            {"item": "MOP (50kg bag)", "qty_per_acre": 0.5, "timing": "Basal dose"},
            {"item": "Mancozeb 75% WP (500g)", "qty_per_acre": 2, "timing": "2 sprays for rust"},
            {"item": "Emamectin Benzoate 5% SG (100g)", "qty_per_acre": 1, "timing": "If armyworm seen"},
        ],
        "Tomato": [
            {"item": "DAP (50kg bag)", "qty_per_acre": 1.5, "timing": "Basal dose"},
            {"item": "19:19:19 (1kg)", "qty_per_acre": 10, "timing": "Fertigation weekly"},
            {"item": "MOP (50kg bag)", "qty_per_acre": 1.0, "timing": "Fruiting stage"},
            {"item": "Mancozeb 75% WP (500g)", "qty_per_acre": 4, "timing": "Biweekly sprays"},
            {"item": "Emamectin Benzoate 5% SG (100g)", "qty_per_acre": 2, "timing": "For fruit borer"},
            {"item": "Neem Oil 1500ppm (1L)", "qty_per_acre": 2, "timing": "Preventive sprays"},
        ],
        "Rice": [
            {"item": "Urea (45kg bag)", "qty_per_acre": 2.0, "timing": "Basal + tillering"},
            {"item": "DAP (50kg bag)", "qty_per_acre": 1.0, "timing": "Basal dose"},
            {"item": "MOP (50kg bag)", "qty_per_acre": 0.5, "timing": "Basal dose"},
            {"item": "Fipronil 5% SC (500ml)", "qty_per_acre": 1, "timing": "Stem borer control"},
        ],
        "Onion": [
            {"item": "DAP (50kg bag)", "qty_per_acre": 1.0, "timing": "Basal dose"},
            {"item": "Urea (45kg bag)", "qty_per_acre": 2.0, "timing": "Top-dress at 30, 50 DAS"},
            {"item": "MOP (50kg bag)", "qty_per_acre": 0.5, "timing": "Bulbing stage"},
            {"item": "Fipronil 5% SC (500ml)", "qty_per_acre": 2, "timing": "Thrips control"},
            {"item": "Mancozeb 75% WP (500g)", "qty_per_acre": 3, "timing": "Purple blotch prevention"},
        ],
        "Grapes": [
            {"item": "19:19:19 (1kg)", "qty_per_acre": 25, "timing": "Season-long fertigation"},
            {"item": "MOP (50kg bag)", "qty_per_acre": 2.0, "timing": "Berry development"},
            {"item": "Mancozeb 75% WP (500g)", "qty_per_acre": 6, "timing": "Mildew prevention"},
            {"item": "Neem Oil 1500ppm (1L)", "qty_per_acre": 3, "timing": "Mealy bug control"},
        ],
        "Capsicum": [
            {"item": "19:19:19 (1kg)", "qty_per_acre": 15, "timing": "Drip fertigation"},
            {"item": "DAP (50kg bag)", "qty_per_acre": 1.0, "timing": "Basal dose"},
            {"item": "Neem Oil 1500ppm (1L)", "qty_per_acre": 3, "timing": "Aphid/thrips prevention"},
        ],
    }

    organic_add = [
        {"item": "Vermicompost (1 ton)", "qty_per_acre": 1.0, "timing": "Basal application"},
        {"item": "Trichoderma viride (1kg)", "qty_per_acre": 0.5, "timing": "Seed/soil treatment"},
        {"item": "Neem Cake (1 quintal)", "qty_per_acre": 1.0, "timing": "Basal (nematode control)"},
    ]

    inputs = crop_inputs.get(crop, crop_inputs.get("Wheat", []))
    if data.include_organic:
        inputs = inputs + organic_add

    items = []
    total = 0
    for inp in inputs:
        price = INPUT_PRICES.get(inp["item"], 0)
        qty = inp["qty_per_acre"] * area
        cost = round(qty * price)
        total += cost
        items.append({
            "item": inp["item"],
            "qty_per_acre": inp["qty_per_acre"],
            "total_qty": round(qty, 1),
            "unit_price": price,
            "total_cost": cost,
            "timing": inp["timing"],
        })

    return {
        "crop": crop,
        "area_acres": area,
        "items": items,
        "total_input_cost": total,
        "cost_per_acre": round(total / area) if area > 0 else 0,
        "includes_organic": data.include_organic,
        "input_prices_date": "2026-04-02",
    }


# ========================================
# 2. PROFIT ESTIMATOR
# ========================================

@router.get("/estimate-profit")
async def estimate_profit(
    crop: str = Query(...),
    area_acres: float = Query(..., gt=0),
    expected_yield_per_acre: float | None = None,
    expected_price_per_unit: float | None = None,
):
    """Estimate profit for a crop season."""
    yield_db = {
        "Wheat": {"yield": 18, "unit": "quintal", "price": 2320},
        "Tomato": {"yield": 120, "unit": "quintal", "price": 1200},
        "Rice": {"yield": 22, "unit": "quintal", "price": 3650},
        "Onion": {"yield": 80, "unit": "quintal", "price": 2600},
        "Grapes": {"yield": 85, "unit": "quintal", "price": 5200},
        "Capsicum": {"yield": 150, "unit": "quintal", "price": 2900},
    }

    defaults = yield_db.get(crop, {"yield": 15, "unit": "quintal", "price": 2000})
    yld = expected_yield_per_acre or defaults["yield"]
    price = expected_price_per_unit or defaults["price"]

    # Input cost
    from app.api.farm_tools import calculate_input_cost
    cost_data = await calculate_input_cost(InputCostRequest(crop=crop, area_acres=area_acres))
    input_cost = cost_data["total_input_cost"]

    # Additional costs
    labor_cost = round(area_acres * 3000)  # ~3000/acre/season
    irrigation_cost = round(area_acres * 1500)
    misc_cost = round(area_acres * 500)
    total_cost = input_cost + labor_cost + irrigation_cost + misc_cost

    total_revenue = round(yld * area_acres * price)
    profit = total_revenue - total_cost
    roi = round((profit / total_cost) * 100) if total_cost > 0 else 0

    return {
        "crop": crop,
        "area_acres": area_acres,
        "yield_per_acre": yld,
        "total_yield": round(yld * area_acres),
        "price_per_unit": price,
        "unit": defaults.get("unit", "quintal"),
        "revenue": total_revenue,
        "costs": {
            "inputs": input_cost,
            "labor": labor_cost,
            "irrigation": irrigation_cost,
            "miscellaneous": misc_cost,
            "total": total_cost,
        },
        "profit": profit,
        "roi_percent": roi,
        "profitable": profit > 0,
        "breakeven_yield": round(total_cost / (price * area_acres), 1) if price > 0 and area_acres > 0 else 0,
    }


# ========================================
# 3. PEST RISK PREDICTION
# ========================================

@router.get("/pest-risk")
async def predict_pest_risk(
    crop: str = Query(...),
    lat: float = Query(...),
    lon: float = Query(...),
):
    """Predict pest/disease risk based on current weather + crop."""
    # Fetch current weather
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get("https://api.open-meteo.com/v1/forecast", params={
                "latitude": lat, "longitude": lon,
                "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
                "hourly": "relative_humidity_2m",
                "forecast_days": 1, "timezone": "auto",
            })
            wx = resp.json() if resp.status_code == 200 else {}
    except:
        wx = {}

    curr = wx.get("current", {})
    temp = curr.get("temperature_2m", 25)
    humidity = curr.get("relative_humidity_2m", 60)
    rain = curr.get("precipitation", 0)

    # Count high humidity hours
    hourly_hum = wx.get("hourly", {}).get("relative_humidity_2m", [])
    high_hum_hrs = sum(1 for h in hourly_hum if h and h > 85)

    # Pest/disease risk rules
    risks = []

    crop_risks = {
        "Tomato": [
            {"pest": "Late Blight", "type": "disease", "condition": high_hum_hrs > 6 and 15 < temp < 25, "severity": "high", "action": "Apply Mancozeb 2.5g/L immediately"},
            {"pest": "Early Blight", "type": "disease", "condition": humidity > 70 and temp > 20, "severity": "medium", "action": "Remove lower leaves + Chlorothalonil spray"},
            {"pest": "Whitefly", "type": "pest", "condition": temp > 25 and humidity < 60, "severity": "medium", "action": "Yellow sticky traps + Neem oil spray"},
            {"pest": "Fruit Borer", "type": "pest", "condition": True, "severity": "low", "action": "Pheromone traps for monitoring"},
        ],
        "Wheat": [
            {"pest": "Yellow Rust", "type": "disease", "condition": 10 < temp < 20 and humidity > 80, "severity": "high", "action": "Propiconazole 1ml/L spray urgently"},
            {"pest": "Brown Rust", "type": "disease", "condition": 15 < temp < 25 and humidity > 70, "severity": "medium", "action": "Monitor + Tebuconazole if spreading"},
            {"pest": "Aphid", "type": "pest", "condition": temp > 20 and humidity < 50, "severity": "medium", "action": "Dimethoate or Neem oil spray"},
            {"pest": "Armyworm", "type": "pest", "condition": rain > 5, "severity": "medium" if rain > 10 else "low", "action": "Scout whorl + Emamectin Benzoate if ETL crossed"},
        ],
        "Rice": [
            {"pest": "Blast", "type": "disease", "condition": high_hum_hrs > 8 and 25 < temp < 30, "severity": "high", "action": "Tricyclazole 0.6g/L preventive spray"},
            {"pest": "Sheath Blight", "type": "disease", "condition": humidity > 85 and temp > 28, "severity": "medium", "action": "Hexaconazole 1ml/L spray"},
            {"pest": "Stem Borer", "type": "pest", "condition": True, "severity": "medium", "action": "Light traps + Fipronil if deadhearts >5%"},
        ],
        "Onion": [
            {"pest": "Thrips", "type": "pest", "condition": temp > 25 and humidity < 50, "severity": "high", "action": "Fipronil 1ml/L spray (ETL: 5 thrips/plant)"},
            {"pest": "Purple Blotch", "type": "disease", "condition": humidity > 80 and rain > 2, "severity": "high", "action": "Mancozeb + improve drainage immediately"},
            {"pest": "Downy Mildew", "type": "disease", "condition": high_hum_hrs > 6 and temp < 20, "severity": "medium", "action": "Metalaxyl + Mancozeb preventive"},
        ],
        "Grapes": [
            {"pest": "Powdery Mildew", "type": "disease", "condition": 20 < temp < 30 and 40 < humidity < 80, "severity": "high", "action": "Sulphur 2g/L or Hexaconazole 1ml/L"},
            {"pest": "Downy Mildew", "type": "disease", "condition": humidity > 85 and rain > 2, "severity": "high", "action": "Bordeaux mixture + remove infected parts"},
            {"pest": "Mealy Bug", "type": "pest", "condition": temp > 28, "severity": "medium", "action": "Neem oil 3ml/L + remove ant trails"},
        ],
        "Capsicum": [
            {"pest": "Aphids", "type": "pest", "condition": temp > 20 and humidity < 60, "severity": "medium", "action": "Neem oil spray + yellow sticky traps"},
            {"pest": "Powdery Mildew", "type": "disease", "condition": 20 < temp < 28 and humidity > 60, "severity": "medium", "action": "Sulphur spray + improve ventilation"},
            {"pest": "Blossom End Rot", "type": "disease", "condition": temp > 30, "severity": "medium", "action": "Calcium spray + maintain even watering"},
        ],
    }

    for risk in crop_risks.get(crop, []):
        if risk["condition"]:
            risks.append({
                "pest": risk["pest"],
                "type": risk["type"],
                "severity": risk["severity"],
                "action": risk["action"],
            })

    overall = "high" if any(r["severity"] == "high" for r in risks) else "medium" if risks else "low"

    return {
        "crop": crop,
        "location": {"latitude": lat, "longitude": lon},
        "weather": {"temperature": temp, "humidity": humidity, "rain": rain, "high_humidity_hours": high_hum_hrs},
        "overall_risk": overall,
        "risks": risks,
        "risk_count": len(risks),
        "safe_to_spray": curr.get("wind_speed_10m", 10) < 12 and rain < 1 and temp < 35,
    }
