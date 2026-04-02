from fastapi import APIRouter

from app.api import health_check, auth, farmers, farms, fields, ndvi, irrigation, admin, sentinel, weather, quick_setup, farmer_advisory, market_prices, farm_tools

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(farmers.router)
api_router.include_router(farms.router)
api_router.include_router(fields.router)
api_router.include_router(ndvi.router)
api_router.include_router(irrigation.router)
api_router.include_router(admin.router)
api_router.include_router(sentinel.router)
api_router.include_router(weather.router)
api_router.include_router(quick_setup.router)
api_router.include_router(farmer_advisory.router)
api_router.include_router(market_prices.router)
api_router.include_router(farm_tools.router)

# Health check at root level (no /api/v1 prefix)
root_router = APIRouter()
root_router.include_router(health_check.router)
