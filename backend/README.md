# AgriTech Platform - Backend API

FastAPI backend providing satellite NDVI analysis, crop health scoring, and irrigation alerts with PostgreSQL + PostGIS storage.

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Setup PostgreSQL with PostGIS
psql -U postgres -c "CREATE DATABASE agritech;"
psql -U postgres -d agritech -c "CREATE EXTENSION postgis;"

# 3. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# 4. Run migrations
alembic upgrade head

# 5. Start server
python run.py
```

API docs at http://localhost:8000/docs

## Architecture

- **NDVI Pipeline**: Google Earth Engine (10m) -> Sentinel STAC fallback (free) -> MODIS (free)
- **Health Score**: Growth-stage-aware NDVI-to-score mapping (0-100)
- **Irrigation Alerts**: NDVI trend analysis as water stress proxy
- **GEE is optional**: Backend works fully without Google Earth Engine credentials

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/fields` | Create field with GPS boundary |
| POST | `/api/v1/fields/{id}/ndvi` | Trigger NDVI analysis |
| POST | `/api/v1/ndvi/analyze` | Ad-hoc NDVI for any polygon |
| GET | `/api/v1/fields/{id}/ndvi/history` | NDVI time series |
| GET | `/health` | API + DB + GEE status |
