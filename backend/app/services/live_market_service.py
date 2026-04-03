"""
Live Market Price Service.
Fetches real commodity prices from multiple free sources.
"""
import logging
from datetime import datetime
import httpx

logger = logging.getLogger(__name__)

# Free commodity price APIs
COMMODITIES_API = "https://api.commodities-api.com/api/latest"  # Limited free
DATA_GOV_IN = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"


async def fetch_live_mandi_prices(commodity: str, state: str = "Maharashtra") -> dict | None:
    """
    Try to fetch live mandi prices from multiple sources.
    Falls back gracefully if APIs are unavailable.
    """
    # Source 1: Try data.gov.in (needs API key, but we try without)
    result = await _try_data_gov(commodity, state)
    if result:
        return result

    # Source 2: Try web scraping proxy for agmarknet
    result = await _try_agmarknet_proxy(commodity, state)
    if result:
        return result

    # Source 3: Return curated recent prices (updated manually)
    return _get_curated_prices(commodity)


async def _try_data_gov(commodity: str, state: str) -> dict | None:
    """Try data.gov.in open API for commodity prices."""
    try:
        params = {
            "api-key": "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b",  # default demo key
            "format": "json",
            "limit": 5,
            "filters[commodity]": commodity.title(),
            "filters[state]": state.title(),
        }
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(DATA_GOV_IN, params=params)
            if resp.status_code == 200:
                data = resp.json()
                records = data.get("records", [])
                if records:
                    prices = []
                    for r in records[:5]:
                        prices.append({
                            "market": r.get("market", ""),
                            "district": r.get("district", ""),
                            "variety": r.get("variety", ""),
                            "min_price": float(r.get("min_price", 0)),
                            "max_price": float(r.get("max_price", 0)),
                            "modal_price": float(r.get("modal_price", 0)),
                            "date": r.get("arrival_date", ""),
                        })
                    return {
                        "commodity": commodity,
                        "state": state,
                        "prices": prices,
                        "source": "data.gov.in (live)",
                        "live": True,
                        "fetched_at": datetime.utcnow().isoformat(),
                    }
    except Exception as e:
        logger.info(f"data.gov.in unavailable: {e}")
    return None


async def _try_agmarknet_proxy(commodity: str, state: str) -> dict | None:
    """Try alternative commodity price sources."""
    try:
        # Try a public JSON endpoint for Indian commodity prices
        url = f"https://market.todaypricerates.com/api/maharashtra-{commodity.lower()}-prices"
        async with httpx.AsyncClient(timeout=8) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                return {"source": "todaypricerates", "live": True, "data": resp.json()}
    except:
        pass
    return None


def _get_curated_prices(commodity: str) -> dict:
    """Return curated price data (updated periodically, NOT live API)."""
    prices_db = {
        "Wheat": {"modal": 2320, "min": 2150, "max": 2450, "msp": 2275, "market": "Nashik APMC", "trend": "up", "date": "2026-04-02"},
        "Tomato": {"modal": 1200, "min": 800, "max": 1600, "msp": None, "market": "Nashik APMC", "trend": "down", "date": "2026-04-02"},
        "Rice": {"modal": 3650, "min": 3200, "max": 4100, "msp": 2320, "market": "Nashik APMC", "trend": "up", "date": "2026-04-02"},
        "Onion": {"modal": 2600, "min": 1800, "max": 3200, "msp": None, "market": "Lasalgaon APMC", "trend": "up", "date": "2026-04-02"},
        "Grapes": {"modal": 5200, "min": 3500, "max": 6500, "msp": None, "market": "Nashik APMC", "trend": "stable", "date": "2026-04-02"},
        "Capsicum": {"modal": 2900, "min": 2000, "max": 3800, "msp": None, "market": "Nashik APMC", "trend": "down", "date": "2026-04-02"},
    }

    data = prices_db.get(commodity, prices_db.get("Wheat"))
    return {
        "commodity": commodity,
        "prices": [{
            "market": data["market"],
            "min_price": data["min"],
            "max_price": data["max"],
            "modal_price": data["modal"],
            "date": data["date"],
        }],
        "msp": data.get("msp"),
        "trend": data.get("trend"),
        "source": "curated (not live API)",
        "live": False,
        "note": "For live prices, register at data.gov.in for API key",
    }


async def fetch_historical_weather(lat: float, lon: float, days_back: int = 90) -> dict:
    """Fetch historical weather data from Open-Meteo archive API (free)."""
    from datetime import timedelta
    end = datetime.utcnow().date()
    start = end - timedelta(days=days_back)

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get("https://archive-api.open-meteo.com/v1/archive", params={
                "latitude": lat,
                "longitude": lon,
                "start_date": start.isoformat(),
                "end_date": end.isoformat(),
                "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration",
                "timezone": "auto",
            })
            if resp.status_code != 200:
                return {"error": f"Archive API returned {resp.status_code}"}

            data = resp.json()
            daily = data.get("daily", {})

            total_rain = sum(p for p in daily.get("precipitation_sum", []) if p is not None)
            avg_max = sum(t for t in daily.get("temperature_2m_max", []) if t is not None) / max(1, len([t for t in daily.get("temperature_2m_max", []) if t is not None]))
            total_et0 = sum(e for e in daily.get("et0_fao_evapotranspiration", []) if e is not None)

            return {
                "location": {"latitude": lat, "longitude": lon},
                "period": {"start": start.isoformat(), "end": end.isoformat(), "days": days_back},
                "summary": {
                    "total_rainfall_mm": round(total_rain, 1),
                    "avg_max_temp": round(avg_max, 1),
                    "total_et0_mm": round(total_et0, 1),
                    "rainy_days": sum(1 for p in daily.get("precipitation_sum", []) if p and p > 1),
                },
                "daily": {
                    "dates": daily.get("time", []),
                    "max_temp": daily.get("temperature_2m_max", []),
                    "min_temp": daily.get("temperature_2m_min", []),
                    "rainfall": daily.get("precipitation_sum", []),
                    "et0": daily.get("et0_fao_evapotranspiration", []),
                },
                "source": "open-meteo-archive (live historical)",
                "live": True,
            }
    except Exception as e:
        return {"error": str(e)}
