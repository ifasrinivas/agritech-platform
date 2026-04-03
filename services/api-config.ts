// ============================================
// API Configuration - Real-time Data Sources
// ============================================
// All APIs used are FREE and open-access.
// No API keys required for Open-Meteo & SoilGrids.
// NASA FIRMS requires free registration for higher limits.
// ============================================

export const API_ENDPOINTS = {
  // ---- Weather (Open-Meteo - 100% FREE, no API key) ----
  OPEN_METEO_FORECAST: "https://api.open-meteo.com/v1/forecast",
  OPEN_METEO_HISTORICAL: "https://archive-api.open-meteo.com/v1/archive",
  OPEN_METEO_AIR_QUALITY: "https://air-quality-api.open-meteo.com/v1/air-quality",

  // ---- Satellite / Earth Observation ----
  // NASA FIRMS - Active fire/hotspot data (free, key optional)
  NASA_FIRMS: "https://firms.modaps.eosdis.nasa.gov/api/area/csv",
  // STAC API - Sentinel-2 metadata search (free, no key)
  SENTINEL_STAC: "https://earth-search.aws.element84.com/v1/search",
  // NASA MODIS NDVI (free, via AppEEARS or MODIS web service)
  NASA_MODIS_NDVI: "https://modis.ornl.gov/rst/api/v1",

  // ---- Soil Data (SoilGrids - 100% FREE, no key) ----
  SOILGRIDS: "https://rest.isric.org/soilgrids/v2.0/properties/query",

  // ---- Elevation Data (Open-Meteo Elevation - FREE) ----
  ELEVATION: "https://api.open-meteo.com/v1/elevation",

  // ---- Geocoding (Open-Meteo - FREE) ----
  GEOCODING: "https://geocoding-api.open-meteo.com/v1/search",
};

// ---- AgriTech Backend (FastAPI + PostGIS) ----
// Auto-detect: use localhost for web dev, AWS for native/production
import { Platform } from "react-native";
const IS_WEB_DEV = Platform.OS === "web" && typeof window !== "undefined" && window.location?.hostname === "localhost";
export const BACKEND_URL = IS_WEB_DEV ? "http://localhost:8000" : "http://13.232.161.89:8000";
export const BACKEND_API = `${BACKEND_URL}/api/v1`;

// Default farm location (Nashik, Maharashtra)
export const DEFAULT_LOCATION = {
  latitude: 20.0063,
  longitude: 73.7910,
  name: "Nashik, Maharashtra",
};

// Refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  WEATHER: 30 * 60 * 1000,     // 30 minutes
  SATELLITE: 6 * 60 * 60 * 1000, // 6 hours
  SOIL: 24 * 60 * 60 * 1000,     // 24 hours
  FIRE_ALERTS: 60 * 60 * 1000,   // 1 hour
};
