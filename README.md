# AgriTech Platform

Advanced precision agriculture platform using satellite intelligence, AI, and agronomic science. Helps farmers shift from intuition-based to data-driven farming.

## Architecture

```
┌─────────────────────────────────────────┐
│  React Native (Expo) - 59 screens       │
│  Premium UI + GPS mapping + offline     │
└──────────────┬──────────────────────────┘
               │ REST + WebSocket
┌──────────────▼──────────────────────────┐
│  FastAPI Backend - 50 modules           │
│  43+ endpoints | JWT | Rate limiting    │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
 Database   Open-Meteo   NASA MODIS
            SoilGrids    Sentinel-2
```

## Quick Start

```bash
# Backend
cd backend && pip install -r requirements.txt && python run.py
# http://localhost:8000/docs

# Frontend
npm install && npx expo start --web
# http://localhost:19006
```

## Live

- **API**: http://13.232.161.89:8000/docs
- **GitHub**: https://github.com/ifasrinivas/agritech-platform

## 43+ API Endpoints

| Category | Endpoints |
|----------|-----------|
| Auth | signup, login, refresh |
| Fields | CRUD, GPS boundary, quick-add-field |
| NDVI | trigger, history, ad-hoc analysis |
| Sentinel-2 | scenes, spectral indices, moisture |
| Soil | full report (3 sources), moisture |
| Weather | location forecast, city search |
| Advisory | crop-specific, growth schedule |
| Market | APMC prices, sell recommendation |
| Pest Risk | weather-based prediction |
| Tools | input cost, profit estimator |
| Calendar | auto-generated crop schedule |
| Compare | side-by-side field analysis |
| Languages | Hindi + Marathi (16 terms) |
| Irrigation | alerts, resolve |

## Features

- Satellite NDVI crop health monitoring
- Location-based weather with agricultural insights
- Soil analysis (pH, NPK, texture, live moisture)
- Weather-based pest/disease risk prediction
- Market prices with buy/sell recommendations
- Input cost calculator + profit estimator
- Auto-generated crop calendar
- GPS field boundary mapping
- Multilingual (English, Hindi, Marathi)
- Farmer-friendly UI (color-coded, icon-based)

## Stack

**Frontend**: React Native, Expo, NativeWind, Lucide Icons
**Backend**: Python, FastAPI, SQLAlchemy, Shapely
**Data**: Open-Meteo, NASA MODIS, Sentinel-2, ISRIC SoilGrids
**Deploy**: AWS EC2, Docker, GitHub Actions
