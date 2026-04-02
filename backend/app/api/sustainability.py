"""
Sustainability Tools: Water Footprint, Carbon Credits, Subsidy Eligibility, Yield History.
"""
import uuid
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.dependencies import get_db
from app.models.field import Field
from app.services.ndvi_pipeline import compute_days_after_sowing

router = APIRouter(tags=["Sustainability & Tools"])

# ========================================
# 1. WATER FOOTPRINT CALCULATOR
# ========================================

CROP_WATER = {
    "Wheat":    {"et_mm": 450, "duration": 140, "water_liters_per_kg": 1300, "avg_yield_kg_acre": 1850},
    "Rice":     {"et_mm": 1200, "duration": 150, "water_liters_per_kg": 2500, "avg_yield_kg_acre": 2200},
    "Tomato":   {"et_mm": 600, "duration": 140, "water_liters_per_kg": 180, "avg_yield_kg_acre": 12000},
    "Onion":    {"et_mm": 400, "duration": 130, "water_liters_per_kg": 345, "avg_yield_kg_acre": 8000},
    "Grapes":   {"et_mm": 700, "duration": 180, "water_liters_per_kg": 608, "avg_yield_kg_acre": 8500},
    "Capsicum": {"et_mm": 550, "duration": 160, "water_liters_per_kg": 240, "avg_yield_kg_acre": 15000},
    "Soybean":  {"et_mm": 500, "duration": 100, "water_liters_per_kg": 2000, "avg_yield_kg_acre": 1200},
    "Maize":    {"et_mm": 550, "duration": 95, "water_liters_per_kg": 900, "avg_yield_kg_acre": 2500},
}


@router.get("/water-footprint")
async def calculate_water_footprint(
    crop: str = Query(...),
    area_acres: float = Query(..., gt=0),
    irrigation_type: str = Query("flood"),
):
    """Calculate water footprint for a crop season."""
    cw = CROP_WATER.get(crop, CROP_WATER["Wheat"])

    # Irrigation efficiency
    efficiency = {"drip": 0.90, "sprinkler": 0.75, "flood": 0.45, "furrow": 0.55, "rainfed": 1.0}
    eff = efficiency.get(irrigation_type.lower().split()[0], 0.55)

    # Total water need (ET / efficiency)
    total_et_mm = cw["et_mm"]
    effective_mm = total_et_mm / eff
    area_sqm = area_acres * 4047
    total_liters = effective_mm * area_sqm / 1000 * 1000  # mm * m2 = liters

    # Water per kg of produce
    total_yield = cw["avg_yield_kg_acre"] * area_acres
    water_per_kg = round(total_liters / total_yield) if total_yield > 0 else 0

    # Savings if switched to drip
    drip_liters = (total_et_mm / 0.90) * area_sqm / 1000 * 1000
    savings = total_liters - drip_liters

    return {
        "crop": crop,
        "area_acres": area_acres,
        "irrigation_type": irrigation_type,
        "irrigation_efficiency": f"{eff * 100:.0f}%",
        "crop_et_mm": total_et_mm,
        "total_water_liters": round(total_liters),
        "total_water_cubic_meters": round(total_liters / 1000),
        "water_per_kg_produce": water_per_kg,
        "global_avg_per_kg": cw["water_liters_per_kg"],
        "expected_yield_kg": round(total_yield),
        "duration_days": cw["duration"],
        "daily_water_liters": round(total_liters / cw["duration"]),
        "savings_if_drip": {
            "liters_saved": round(max(0, savings)),
            "percent_saved": round(max(0, savings) / total_liters * 100) if total_liters > 0 else 0,
            "cost_saved_inr": round(max(0, savings) / 1000 * 8),  # ~Rs.8/kL electricity
        },
        "water_status": "efficient" if eff >= 0.85 else "moderate" if eff >= 0.6 else "wasteful",
        "recommendation": (
            "Already using efficient irrigation." if eff >= 0.85 else
            f"Switch to drip irrigation to save {round(max(0, savings)/1000)}K liters ({round(max(0, savings)/total_liters*100)}%)" if savings > 0 else
            "Consider drip irrigation for water savings."
        ),
    }


# ========================================
# 2. CARBON CREDIT ESTIMATOR
# ========================================

CARBON_PRACTICES = {
    "drip_irrigation": {"credits_per_acre": 0.12, "label": "Drip Irrigation"},
    "no_till": {"credits_per_acre": 0.15, "label": "No-Till Farming"},
    "cover_crop": {"credits_per_acre": 0.20, "label": "Cover Cropping"},
    "organic_composting": {"credits_per_acre": 0.08, "label": "Organic Composting"},
    "agroforestry": {"credits_per_acre": 0.30, "label": "Agroforestry"},
    "crop_rotation": {"credits_per_acre": 0.10, "label": "Crop Rotation"},
    "residue_mulching": {"credits_per_acre": 0.12, "label": "Residue Mulching"},
    "biogas_plant": {"credits_per_acre": 0.05, "label": "Biogas from Dung"},
    "solar_pump": {"credits_per_acre": 0.08, "label": "Solar Water Pump"},
    "water_harvesting": {"credits_per_acre": 0.10, "label": "Rainwater Harvesting"},
}

CARBON_PRICE_INR = 1500  # ~Rs.1500 per tCO2e in voluntary markets


@router.get("/carbon-credits")
async def estimate_carbon_credits(
    area_acres: float = Query(..., gt=0),
    practices: str = Query("drip_irrigation,cover_crop,organic_composting", description="Comma-separated practices"),
):
    """Estimate carbon credits from sustainable farming practices."""
    practice_list = [p.strip() for p in practices.split(",")]

    results = []
    total_credits = 0
    for p in practice_list:
        info = CARBON_PRACTICES.get(p)
        if info:
            credits = round(info["credits_per_acre"] * area_acres, 2)
            total_credits += credits
            results.append({
                "practice": info["label"],
                "credits_per_acre": info["credits_per_acre"],
                "total_credits": credits,
                "unit": "tCO2e/year",
            })

    revenue = round(total_credits * CARBON_PRICE_INR)

    return {
        "area_acres": area_acres,
        "practices": results,
        "total_credits_tco2e": round(total_credits, 2),
        "estimated_revenue_inr": revenue,
        "carbon_price_per_tco2e": CARBON_PRICE_INR,
        "available_practices": {k: v["label"] for k, v in CARBON_PRACTICES.items()},
        "recommendation": (
            f"You can earn Rs.{revenue}/year from carbon credits. "
            f"Adding agroforestry (+0.30/acre) and no-till (+0.15/acre) would increase earnings significantly."
        ),
    }


# ========================================
# 3. GOVERNMENT SUBSIDY CHECKER
# ========================================

SUBSIDIES = [
    {
        "name": "PM-KISAN",
        "benefit": "Rs.6,000/year direct income support (3 installments)",
        "eligibility": "All landholding farmer families",
        "how_to_apply": "Register at pmkisan.gov.in with Aadhaar + land records",
        "category": "income",
    },
    {
        "name": "PMFBY Crop Insurance",
        "benefit": "Crop loss coverage at 1.5% premium (Rabi)",
        "eligibility": "All farmers growing notified crops",
        "how_to_apply": "Apply at bank or CSC center before season deadline",
        "category": "insurance",
        "crop_filter": None,
    },
    {
        "name": "Micro Irrigation Subsidy (PMKSY)",
        "benefit": "55-70% subsidy on drip/sprinkler systems",
        "eligibility": "All farmers, priority to small & marginal",
        "how_to_apply": "Apply through state agriculture dept or MahaDBT",
        "category": "irrigation",
    },
    {
        "name": "Soil Health Card",
        "benefit": "Free soil testing with fertilizer recommendations",
        "eligibility": "All farmers",
        "how_to_apply": "Contact nearest KVK or agriculture office",
        "category": "soil",
    },
    {
        "name": "Kisan Credit Card (KCC)",
        "benefit": "Loan up to Rs.3L at 4% interest (with subvention)",
        "eligibility": "Landholding farmers with crop plan",
        "how_to_apply": "Apply at any bank with land records",
        "category": "credit",
    },
    {
        "name": "PM-KUSUM Solar Pump",
        "benefit": "60-90% subsidy on solar water pumps",
        "eligibility": "Farmers with bore well / open well",
        "how_to_apply": "Apply on state MNRE portal",
        "category": "energy",
    },
    {
        "name": "National Mission on Sustainable Agriculture",
        "benefit": "Rs.50,000/ha for organic farming conversion (3 years)",
        "eligibility": "Farmer groups (min 20 farmers, 50 acres)",
        "how_to_apply": "Form cluster, apply through district agriculture officer",
        "category": "organic",
    },
    {
        "name": "eNAM Registration",
        "benefit": "Online trading for better price discovery across 1000+ mandis",
        "eligibility": "Registered APMC traders and farmers",
        "how_to_apply": "Register at enam.gov.in",
        "category": "market",
    },
    {
        "name": "Agri Infrastructure Fund",
        "benefit": "3% interest subvention on loans up to Rs.2Cr (cold storage, pack house)",
        "eligibility": "Individual farmers, FPOs, agri-entrepreneurs",
        "how_to_apply": "Apply via AIF portal through participating banks",
        "category": "infrastructure",
    },
    {
        "name": "Dairy Entrepreneurship (NABARD)",
        "benefit": "25-33% subsidy on dairy unit setup (up to Rs.7L)",
        "eligibility": "Farmers with minimum 2 milch animals",
        "how_to_apply": "Apply through NABARD district office",
        "category": "dairy",
    },
]


@router.get("/subsidies")
async def check_subsidy_eligibility(
    area_acres: float = Query(None),
    crop: str = Query(None),
    has_livestock: bool = Query(False),
    has_borewell: bool = Query(False),
    category: str = Query(None),
):
    """Check eligible government subsidies based on farm profile."""
    eligible = []
    for s in SUBSIDIES:
        # Filter by category if specified
        if category and s["category"] != category:
            continue
        # Dairy requires livestock
        if s["category"] == "dairy" and not has_livestock:
            continue
        # Solar pump requires borewell
        if s["category"] == "energy" and not has_borewell:
            continue
        eligible.append(s)

    return {
        "eligible_count": len(eligible),
        "subsidies": eligible,
        "total_potential_benefit": "Rs.6,000/yr (PM-KISAN) + subsidized insurance + drip subsidy + more",
        "filters_applied": {
            "area": area_acres,
            "crop": crop,
            "has_livestock": has_livestock,
            "has_borewell": has_borewell,
            "category": category,
        },
    }


# ========================================
# 4. YIELD HISTORY + COMPARISON
# ========================================

@router.get("/yield-benchmark")
async def get_yield_benchmark(crop: str = Query(...), state: str = Query("Maharashtra")):
    """Get district/state average yield for comparison."""
    # National average yields (kg/hectare)
    benchmarks = {
        "Wheat":    {"national": 3507, "maharashtra": 1800, "punjab": 5200, "top": "Punjab 5200"},
        "Rice":     {"national": 2809, "maharashtra": 2100, "west_bengal": 3200, "top": "Punjab 4500"},
        "Tomato":   {"national": 25000, "maharashtra": 22000, "andhra": 35000, "top": "Andhra 35000"},
        "Onion":    {"national": 18000, "maharashtra": 20000, "karnataka": 16000, "top": "Maharashtra 20000"},
        "Grapes":   {"national": 25000, "maharashtra": 28000, "karnataka": 22000, "top": "Maharashtra 28000"},
        "Capsicum": {"national": 15000, "maharashtra": 18000, "karnataka": 14000, "top": "Greenhouse 40000"},
        "Soybean":  {"national": 1100, "maharashtra": 1200, "mp": 1000, "top": "Maharashtra 1200"},
    }

    data = benchmarks.get(crop, {"national": 2000, "maharashtra": 1800, "top": "N/A"})

    return {
        "crop": crop,
        "state": state,
        "yield_kg_per_hectare": data,
        "yield_kg_per_acre": {k: round(v / 2.47) for k, v in data.items() if isinstance(v, (int, float))},
        "tips_to_improve": [
            "Use certified/hybrid seeds for 15-20% higher yield",
            "Follow soil-test-based fertilizer (saves cost, improves yield)",
            "Adopt drip irrigation (30% water saving, 20% yield boost)",
            "Timely pest/disease management (prevents 20-40% loss)",
            "Use raised beds for better drainage in heavy soils",
        ],
    }
