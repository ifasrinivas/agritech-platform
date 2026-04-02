from fastapi import APIRouter

from app.api import health_check, auth, farmers, farms, fields, ndvi, irrigation, admin, sentinel

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(farmers.router)
api_router.include_router(farms.router)
api_router.include_router(fields.router)
api_router.include_router(ndvi.router)
api_router.include_router(irrigation.router)
api_router.include_router(admin.router)
api_router.include_router(sentinel.router)

# Health check at root level (no /api/v1 prefix)
root_router = APIRouter()
root_router.include_router(health_check.router)
