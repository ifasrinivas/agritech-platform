// ============================================
// Backend API Client
// Connects React Native frontend to FastAPI backend
// Graceful offline fallback to mock data
// ============================================

import { BACKEND_URL, BACKEND_API } from "./api-config";

// ---------- Types (mirror backend Pydantic schemas) ----------

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

export interface FieldCreateRequest {
  farm_id: string;
  name: string;
  crop: string;
  area: number;
  soil_type?: string;
  sowing_date?: string;
  expected_harvest?: string;
  irrigation_type?: string;
  coordinates?: Coordinate[];
  boundary?: GeoJSONPolygon;
}

export interface FieldResponse {
  id: string;
  farm_id: string;
  name: string;
  crop: string;
  area: number;
  soil_type: string | null;
  sowing_date: string | null;
  expected_harvest: string | null;
  irrigation_type: string | null;
  boundary: GeoJSONPolygon | null;
  centroid: Coordinate | null;
  latest_ndvi: number | null;
  health_status: string | null;
  created_at: string;
  updated_at: string;
}

export interface CropHealthResponse {
  field_id: string | null;
  field_name: string;
  crop: string;
  ndvi_mean: number;
  ndvi_min: number | null;
  ndvi_max: number | null;
  health_score: number;
  health_status: string;
  source: string;
  satellite_date: string;
  growth_stage: string | null;
  days_after_sowing: number | null;
  expected_ndvi_range: string | null;
  deviation: string | null;
  recommendation: string | null;
  irrigation_alert: IrrigationAlertResponse | null;
}

export interface NDVIReadingResponse {
  id: string;
  field_id: string;
  ndvi_mean: number;
  ndvi_min: number | null;
  ndvi_max: number | null;
  ndvi_std: number | null;
  health_score: number;
  health_status: string;
  source: string;
  satellite_date: string;
  cloud_cover: number | null;
  created_at: string;
}

export interface IrrigationAlertResponse {
  id: string;
  field_id: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string;
  action_required: string;
  soil_moisture: number | null;
  optimal_moisture: number | null;
  water_required_liters: number | null;
  is_resolved: boolean;
  created_at: string;
}

export interface NDVIAnalyzeRequest {
  boundary: GeoJSONPolygon;
  crop: string;
  sowing_date?: string;
}

export interface FarmerCreateRequest {
  name: string;
  phone: string;
  email?: string;
  location?: string;
  plan?: string;
}

export interface FarmerResponse {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  location: string | null;
  plan: string;
  created_at: string;
  farm_count: number;
}

export interface FarmCreateRequest {
  farmer_id: string;
  name: string;
  total_area?: number;
  location_name?: string;
}

export interface FarmResponse {
  id: string;
  farmer_id: string;
  name: string;
  total_area: number | null;
  location_name: string | null;
  field_count: number;
  created_at: string;
}

export interface HealthCheckResponse {
  status: string;
  database: string;
  gee_configured: boolean;
  version: string;
}

// ---------- API Client ----------

class BackendClient {
  private baseUrl: string;
  private apiUrl: string;
  private timeout: number;

  constructor(baseUrl = BACKEND_URL, timeout = 15000) {
    this.baseUrl = baseUrl;
    this.apiUrl = `${baseUrl}/api/v1`;
    this.timeout = timeout;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      return response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // ---- Health ----

  async healthCheck(): Promise<HealthCheckResponse> {
    return this.request<HealthCheckResponse>("/health");
  }

  async isAvailable(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      return health.status === "ok" || health.status === "degraded";
    } catch {
      return false;
    }
  }

  // ---- Farmers ----

  async createFarmer(data: FarmerCreateRequest): Promise<FarmerResponse> {
    return this.request<FarmerResponse>("/api/v1/farmers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getFarmer(id: string): Promise<FarmerResponse> {
    return this.request<FarmerResponse>(`/api/v1/farmers/${id}`);
  }

  // ---- Farms ----

  async createFarm(data: FarmCreateRequest): Promise<FarmResponse> {
    return this.request<FarmResponse>("/api/v1/farms", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getFarm(id: string): Promise<FarmResponse> {
    return this.request<FarmResponse>(`/api/v1/farms/${id}`);
  }

  // ---- Fields ----

  async createField(data: FieldCreateRequest): Promise<FieldResponse> {
    return this.request<FieldResponse>("/api/v1/fields", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getField(id: string): Promise<FieldResponse> {
    return this.request<FieldResponse>(`/api/v1/fields/${id}`);
  }

  async listFields(farmId?: string): Promise<FieldResponse[]> {
    const params = farmId ? `?farm_id=${farmId}` : "";
    return this.request<FieldResponse[]>(`/api/v1/fields${params}`);
  }

  // ---- NDVI / Crop Health ----

  async triggerNDVI(fieldId: string): Promise<CropHealthResponse> {
    return this.request<CropHealthResponse>(`/api/v1/fields/${fieldId}/ndvi`, {
      method: "POST",
    });
  }

  async getNDVIHistory(
    fieldId: string,
    daysBack = 90
  ): Promise<NDVIReadingResponse[]> {
    return this.request<NDVIReadingResponse[]>(
      `/api/v1/fields/${fieldId}/ndvi/history?days_back=${daysBack}`
    );
  }

  async analyzePolygon(data: NDVIAnalyzeRequest): Promise<CropHealthResponse> {
    return this.request<CropHealthResponse>("/api/v1/ndvi/analyze", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ---- Irrigation Alerts ----

  async getFieldAlerts(
    fieldId: string,
    activeOnly = true
  ): Promise<IrrigationAlertResponse[]> {
    return this.request<IrrigationAlertResponse[]>(
      `/api/v1/fields/${fieldId}/irrigation-alerts?active_only=${activeOnly}`
    );
  }

  async getFarmAlerts(
    farmId: string,
    activeOnly = true
  ): Promise<IrrigationAlertResponse[]> {
    return this.request<IrrigationAlertResponse[]>(
      `/api/v1/farms/${farmId}/irrigation-alerts?active_only=${activeOnly}`
    );
  }

  async resolveAlert(alertId: string): Promise<IrrigationAlertResponse> {
    return this.request<IrrigationAlertResponse>(
      `/api/v1/irrigation-alerts/${alertId}/resolve`,
      { method: "PATCH" }
    );
  }

  // ---- Weather (location-based) ----

  async getWeatherForecast(lat: number, lon: number, days = 7): Promise<any> {
    return this.request<any>(`/api/v1/weather/forecast?lat=${lat}&lon=${lon}&days=${days}`);
  }

  async getFieldWeather(fieldId: string, days = 7): Promise<any> {
    return this.request<any>(`/api/v1/fields/${fieldId}/weather?days=${days}`);
  }

  async searchLocation(query: string): Promise<any> {
    return this.request<any>(`/api/v1/weather/search?q=${encodeURIComponent(query)}`);
  }

  // ---- Sentinel-2 ----

  async getFieldScenes(fieldId: string, daysBack = 60): Promise<any> {
    return this.request<any>(`/api/v1/fields/${fieldId}/sentinel/scenes?days_back=${daysBack}`);
  }

  async getFieldIndices(fieldId: string): Promise<any> {
    return this.request<any>(`/api/v1/fields/${fieldId}/sentinel/indices`);
  }

  // ---- Soil ----

  async getFieldSoilReport(fieldId: string): Promise<any> {
    return this.request<any>(`/api/v1/fields/${fieldId}/soil-report`);
  }

  async getSoilReport(boundary: GeoJSONPolygon, crop?: string): Promise<any> {
    return this.request<any>("/api/v1/soil-report", {
      method: "POST",
      body: JSON.stringify({ boundary, crop }),
    });
  }

  async getFieldSoilMoisture(fieldId: string): Promise<any> {
    return this.request<any>(`/api/v1/fields/${fieldId}/soil-moisture`);
  }

  async calculateArea(boundary: GeoJSONPolygon): Promise<any> {
    return this.request<any>("/api/v1/calculate-area", {
      method: "POST",
      body: JSON.stringify({ boundary }),
    });
  }
}

// Singleton instance
export const backendClient = new BackendClient();

// Helper: convert frontend coordinate array to GeoJSON polygon
export function coordinatesToGeoJSON(coords: Coordinate[]): GeoJSONPolygon {
  const ring = coords.map((c) => [c.longitude, c.latitude]);
  // Close the ring
  if (ring.length > 0 && (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])) {
    ring.push([...ring[0]]);
  }
  return { type: "Polygon", coordinates: [ring] };
}
