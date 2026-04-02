"""
WebSocket endpoint for real-time NDVI analysis progress.
Client connects, sends field_id, receives progress updates as NDVI runs.
"""
import json
import uuid
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.field import Field
from app.services import gee_service, stac_fallback, health_score
from app.services.ndvi_pipeline import (
    field_boundary_to_geojson,
    compute_days_after_sowing,
    analyze_field,
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/ws/ndvi/{field_id}")
async def ndvi_realtime(websocket: WebSocket, field_id: str):
    """
    WebSocket for real-time NDVI analysis with step-by-step progress.

    Protocol:
    1. Client connects to /ws/ndvi/{field_id}
    2. Server sends progress messages: {"step": "...", "progress": 0-100, "detail": "..."}
    3. Final message: {"step": "complete", "progress": 100, "result": {...}}
    4. On error: {"step": "error", "detail": "..."}
    """
    await websocket.accept()

    try:
        # Validate field_id
        try:
            fid = uuid.UUID(field_id)
        except ValueError:
            await _send(websocket, "error", 0, "Invalid field ID")
            await websocket.close()
            return

        await _send(websocket, "connecting", 5, "Connecting to database...")

        # Get DB session manually (WebSocket doesn't support Depends easily)
        from app.database import async_session
        async with async_session() as db:
            field = await db.get(Field, fid)
            if not field:
                await _send(websocket, "error", 0, "Field not found")
                await websocket.close()
                return

            await _send(websocket, "field_loaded", 10, f"Field: {field.name} ({field.crop}, {field.area}ac)")

            # Step 1: Extract boundary
            geojson = field_boundary_to_geojson(field.boundary)
            await _send(websocket, "boundary_extracted", 15, "GPS boundary extracted from PostGIS")

            # Step 2: Try GEE
            await _send(websocket, "gee_attempt", 20, "Attempting Google Earth Engine (10m resolution)...")
            result = await gee_service.fetch_ndvi(geojson)

            if result:
                await _send(websocket, "gee_success", 50, f"GEE NDVI: {result['ndvi_mean']:.4f} (date: {result['satellite_date']})")
            else:
                await _send(websocket, "gee_unavailable", 30, "GEE not available, trying STAC fallback...")

                # Step 3: Try STAC
                await _send(websocket, "stac_attempt", 35, "Searching Sentinel-2 via Element84 STAC (free)...")
                result = await stac_fallback.fetch_ndvi(geojson)

                if result and result["source"] != "estimated":
                    await _send(websocket, "stac_success", 50, f"STAC NDVI: {result['ndvi_mean']:.4f}")
                else:
                    await _send(websocket, "fallback_estimate", 50, "Using seasonal growth estimate")
                    if result is None:
                        result = stac_fallback._seasonal_estimate()

            # Step 4: Compute health score
            await _send(websocket, "scoring", 60, "Computing health score...")
            das = compute_days_after_sowing(field.sowing_date)
            score, status = health_score.compute(result["ndvi_mean"], field.crop, das)
            await _send(websocket, "scored", 70, f"Health: {score}/100 ({status})")

            # Step 5: Full pipeline (persist + irrigation)
            await _send(websocket, "persisting", 80, "Saving to database + evaluating irrigation...")
            full_result = await analyze_field(field, db)
            await _send(websocket, "irrigation_check", 90,
                f"Irrigation: {'Alert generated' if full_result.irrigation_alert else 'No alert needed'}")

            # Step 6: Complete
            await _send(websocket, "complete", 100, "Analysis complete", extra={
                "result": {
                    "ndvi_mean": full_result.ndvi_mean,
                    "health_score": full_result.health_score,
                    "health_status": full_result.health_status,
                    "source": full_result.source,
                    "satellite_date": str(full_result.satellite_date),
                    "growth_stage": full_result.growth_stage,
                    "recommendation": full_result.recommendation,
                    "has_irrigation_alert": full_result.irrigation_alert is not None,
                }
            })

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: {field_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await _send(websocket, "error", 0, str(e))
        except Exception:
            pass
    finally:
        try:
            await websocket.close()
        except Exception:
            pass


async def _send(ws: WebSocket, step: str, progress: int, detail: str, extra: dict | None = None):
    msg = {"step": step, "progress": progress, "detail": detail}
    if extra:
        msg.update(extra)
    await ws.send_json(msg)
