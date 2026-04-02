"""
Health Score Calculator.
Maps NDVI + crop growth stage to a 0-100 score + status string.
Growth stages match frontend satellite-service.ts:234-241 (interpretNDVI).
Status values match frontend data/agritech.ts:13 (healthStatus enum).
"""


# Same growth stages as frontend satellite-service.ts lines 234-241
GROWTH_STAGES = [
    {"name": "Germination",   "das": (0, 15),    "min": 0.10, "max": 0.25},
    {"name": "Vegetative",    "das": (15, 45),   "min": 0.25, "max": 0.55},
    {"name": "Active Growth", "das": (45, 75),   "min": 0.50, "max": 0.80},
    {"name": "Peak/Flowering","das": (75, 100),  "min": 0.65, "max": 0.90},
    {"name": "Maturity",      "das": (100, 130), "min": 0.50, "max": 0.75},
    {"name": "Senescence",    "das": (130, 160), "min": 0.20, "max": 0.50},
]


def compute(
    ndvi_mean: float,
    crop: str,
    days_after_sowing: int | None,
) -> tuple[float, str]:
    """
    Returns (score: 0-100, status: "excellent"|"good"|"moderate"|"poor"|"critical").
    """
    if days_after_sowing is not None and days_after_sowing >= 0:
        stage = next(
            (s for s in GROWTH_STAGES if s["das"][0] <= days_after_sowing < s["das"][1]),
            GROWTH_STAGES[-1],
        )
        expected_min = stage["min"]
        expected_max = stage["max"]
        expected_mid = (expected_min + expected_max) / 2

        if ndvi_mean >= expected_mid:
            score = 80 + 20 * min(1.0, (ndvi_mean - expected_mid) / max(0.01, expected_max - expected_mid))
        elif ndvi_mean >= expected_min:
            score = 60 + 20 * (ndvi_mean - expected_min) / max(0.01, expected_mid - expected_min)
        else:
            ratio = ndvi_mean / expected_min if expected_min > 0 else 0
            score = max(0, 60 * ratio)
    else:
        # Absolute scoring when sowing date unknown
        score = min(100, max(0, 110 * ndvi_mean - 5))

    score = round(max(0, min(100, score)), 1)

    # Status thresholds match frontend healthStatus enum
    if score >= 85:
        status = "excellent"
    elif score >= 70:
        status = "good"
    elif score >= 50:
        status = "moderate"
    elif score >= 30:
        status = "poor"
    else:
        status = "critical"

    return score, status


def get_growth_stage(days_after_sowing: int | None) -> str | None:
    if days_after_sowing is None or days_after_sowing < 0:
        return None
    stage = next(
        (s for s in GROWTH_STAGES if s["das"][0] <= days_after_sowing < s["das"][1]),
        GROWTH_STAGES[-1],
    )
    return stage["name"]


def get_expected_range(days_after_sowing: int | None) -> str | None:
    if days_after_sowing is None or days_after_sowing < 0:
        return None
    stage = next(
        (s for s in GROWTH_STAGES if s["das"][0] <= days_after_sowing < s["das"][1]),
        GROWTH_STAGES[-1],
    )
    return f"{stage['min']}-{stage['max']}"


def get_deviation(ndvi_mean: float, days_after_sowing: int | None) -> str:
    if days_after_sowing is None or days_after_sowing < 0:
        return "Sowing date not available for comparison"
    stage = next(
        (s for s in GROWTH_STAGES if s["das"][0] <= days_after_sowing < s["das"][1]),
        GROWTH_STAGES[-1],
    )
    if ndvi_mean < stage["min"]:
        pct = round((stage["min"] - ndvi_mean) * 100)
        return f"{pct}% below expected range"
    elif ndvi_mean > stage["max"]:
        pct = round((ndvi_mean - stage["max"]) * 100)
        return f"{pct}% above expected range"
    return "Within expected range"
