from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

# Normalize DATABASE_URL for different providers
db_url = settings.DATABASE_URL

# Render.com uses postgres:// but SQLAlchemy needs postgresql+asyncpg://
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Use aiosqlite for local dev when PostgreSQL is not available
if "postgresql" in db_url:
    try:
        import asyncpg  # noqa: F401
        engine = create_async_engine(db_url, echo=settings.DEBUG, pool_size=5, max_overflow=10)
    except ImportError:
        db_url = "sqlite+aiosqlite:///./agritech_dev.db"
        engine = create_async_engine(db_url, echo=settings.DEBUG)
else:
    engine = create_async_engine(db_url, echo=settings.DEBUG)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass
