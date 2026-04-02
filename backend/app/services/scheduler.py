"""
Background Task Scheduler.
Periodically runs NDVI analysis on all fields.
Uses asyncio tasks (no external dependency like Celery needed).
"""
import asyncio
import logging
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session
from app.models.field import Field
from app.services.ndvi_pipeline import analyze_field

logger = logging.getLogger(__name__)

_scheduler_task: asyncio.Task | None = None


async def run_all_field_ndvi():
    """Run NDVI analysis on every field in the database."""
    logger.info("Scheduler: Starting batch NDVI analysis for all fields...")
    start = datetime.utcnow()
    success = 0
    errors = 0

    async with async_session() as db:
        stmt = select(Field).order_by(Field.created_at)
        result = await db.execute(stmt)
        fields = result.scalars().all()

        for field in fields:
            try:
                health = await analyze_field(field, db)
                logger.info(
                    f"  [{field.name}] NDVI={health.ndvi_mean:.3f} "
                    f"Score={health.health_score} Status={health.health_status} "
                    f"Source={health.source}"
                )
                success += 1
            except Exception as e:
                logger.warning(f"  [{field.name}] FAILED: {e}")
                errors += 1

    elapsed = (datetime.utcnow() - start).total_seconds()
    logger.info(
        f"Scheduler: Batch complete. {success} success, {errors} errors in {elapsed:.1f}s"
    )
    return {"success": success, "errors": errors, "elapsed": elapsed}


async def _scheduler_loop(interval_hours: float):
    """Run NDVI analysis every N hours."""
    while True:
        try:
            await run_all_field_ndvi()
        except Exception as e:
            logger.error(f"Scheduler error: {e}")
        await asyncio.sleep(interval_hours * 3600)


def start_scheduler(interval_hours: float = 6.0):
    """Start background scheduler (call during app lifespan)."""
    global _scheduler_task
    if _scheduler_task is not None:
        return

    _scheduler_task = asyncio.create_task(_scheduler_loop(interval_hours))
    logger.info(f"Scheduler started: NDVI scan every {interval_hours}h")


def stop_scheduler():
    """Stop the scheduler."""
    global _scheduler_task
    if _scheduler_task:
        _scheduler_task.cancel()
        _scheduler_task = None
        logger.info("Scheduler stopped")
