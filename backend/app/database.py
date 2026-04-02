import os
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

# Use aiosqlite for local dev when PostgreSQL is not available
db_url = settings.DATABASE_URL
if "postgresql" in db_url:
    try:
        import asyncpg  # noqa: F401
        engine = create_async_engine(db_url, echo=settings.DEBUG, pool_size=5, max_overflow=10)
    except ImportError:
        # Fallback to SQLite if asyncpg not installed
        db_url = "sqlite+aiosqlite:///./agritech_dev.db"
        engine = create_async_engine(db_url, echo=settings.DEBUG)
else:
    engine = create_async_engine(db_url, echo=settings.DEBUG)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass
