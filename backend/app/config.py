from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Default: SQLite for local dev. Set to postgresql+asyncpg://... for production.
    DATABASE_URL: str = "sqlite+aiosqlite:///./agritech_dev.db"

    # Google Earth Engine (optional)
    GEE_SERVICE_ACCOUNT_EMAIL: str | None = None
    GEE_SERVICE_ACCOUNT_KEY_PATH: str | None = None

    # JWT Authentication
    JWT_SECRET_KEY: str = "agritech-dev-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    CORS_ORIGINS: list[str] = ["*"]
    APP_NAME: str = "AgriTech Backend"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
