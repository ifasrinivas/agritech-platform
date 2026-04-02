"""Admin endpoints: trigger batch scans, view scheduler status, stats."""
from fastapi import APIRouter, Depends

from app.dependencies import get_current_farmer
from app.models.farmer import Farmer
from app.services.scheduler import run_all_field_ndvi

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/scan-all-fields")
async def trigger_batch_scan(farmer: Farmer = Depends(get_current_farmer)):
    """
    Trigger NDVI analysis for ALL fields in the database.
    Requires authentication (admin use).
    """
    result = await run_all_field_ndvi()
    return {
        "message": "Batch NDVI scan complete",
        "success": result["success"],
        "errors": result["errors"],
        "elapsed_seconds": round(result["elapsed"], 1),
        "triggered_by": farmer.name,
    }
