// ============================================
// Live Data Context - Real-time API Integration
// Provides live weather, satellite, and soil data
// to all screens via React Context
// ============================================

import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import {
  fetchLiveWeather,
  analyzeWeatherForAgriculture,
  LiveWeatherData,
  AgriculturalWeatherInsight,
  weatherCodeToCondition,
} from "@/services/weather-service";
import {
  searchSentinel2Scenes,
  fetchNDVITimeSeries,
  fetchElevation,
  SatelliteScene,
  NDVITimePoint,
} from "@/services/satellite-service";
import {
  fetchSoilData,
  SoilGridsData,
} from "@/services/soil-service";
import { DEFAULT_LOCATION, REFRESH_INTERVALS } from "@/services/api-config";

export interface LiveDataState {
  // Weather
  weather: LiveWeatherData | null;
  weatherInsights: AgriculturalWeatherInsight | null;
  weatherLoading: boolean;
  weatherError: string | null;
  weatherLastUpdated: Date | null;

  // Satellite
  satelliteScenes: SatelliteScene[];
  ndviTimeSeries: NDVITimePoint[];
  elevation: number | null;
  satelliteLoading: boolean;
  satelliteError: string | null;
  satelliteLastUpdated: Date | null;

  // Soil
  soilData: SoilGridsData | null;
  soilLoading: boolean;
  soilError: string | null;
  soilLastUpdated: Date | null;

  // Connection
  isOnline: boolean;
  apiStatus: {
    weather: "connected" | "error" | "loading";
    satellite: "connected" | "error" | "loading";
    soil: "connected" | "error" | "loading";
  };

  // Actions
  refreshWeather: () => Promise<void>;
  refreshSatellite: () => Promise<void>;
  refreshSoil: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const defaultState: LiveDataState = {
  weather: null,
  weatherInsights: null,
  weatherLoading: false,
  weatherError: null,
  weatherLastUpdated: null,
  satelliteScenes: [],
  ndviTimeSeries: [],
  elevation: null,
  satelliteLoading: false,
  satelliteError: null,
  satelliteLastUpdated: null,
  soilData: null,
  soilLoading: false,
  soilError: null,
  soilLastUpdated: null,
  isOnline: true,
  apiStatus: { weather: "loading", satellite: "loading", soil: "loading" },
  refreshWeather: async () => {},
  refreshSatellite: async () => {},
  refreshSoil: async () => {},
  refreshAll: async () => {},
};

export const LiveDataContext = createContext<LiveDataState>(defaultState);

export function LiveDataProvider({ children }: { children: React.ReactNode }) {
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [weatherInsights, setWeatherInsights] = useState<AgriculturalWeatherInsight | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [weatherLastUpdated, setWeatherLastUpdated] = useState<Date | null>(null);

  const [satelliteScenes, setSatelliteScenes] = useState<SatelliteScene[]>([]);
  const [ndviTimeSeries, setNdviTimeSeries] = useState<NDVITimePoint[]>([]);
  const [elevation, setElevation] = useState<number | null>(null);
  const [satelliteLoading, setSatelliteLoading] = useState(false);
  const [satelliteError, setSatelliteError] = useState<string | null>(null);
  const [satelliteLastUpdated, setSatelliteLastUpdated] = useState<Date | null>(null);

  const [soilData, setSoilData] = useState<SoilGridsData | null>(null);
  const [soilLoading, setSoilLoading] = useState(false);
  const [soilError, setSoilError] = useState<string | null>(null);
  const [soilLastUpdated, setSoilLastUpdated] = useState<Date | null>(null);

  const [isOnline, setIsOnline] = useState(true);

  const weatherInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshWeather = useCallback(async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await fetchLiveWeather();
      setWeather(data);
      setWeatherInsights(analyzeWeatherForAgriculture(data));
      setWeatherLastUpdated(new Date());
      setIsOnline(true);
    } catch (error: any) {
      setWeatherError(error.message || "Failed to fetch weather");
      console.warn("Weather fetch error:", error);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const refreshSatellite = useCallback(async () => {
    setSatelliteLoading(true);
    setSatelliteError(null);
    try {
      // Fetch independently so one failure doesn't block others
      const [scenes, ndvi, elev] = await Promise.allSettled([
        searchSentinel2Scenes(),
        fetchNDVITimeSeries(),
        fetchElevation(),
      ]);
      if (scenes.status === "fulfilled") setSatelliteScenes(scenes.value);
      if (ndvi.status === "fulfilled") setNdviTimeSeries(ndvi.value);
      if (elev.status === "fulfilled") setElevation(elev.value);
      setSatelliteLastUpdated(new Date());
    } catch {
      setSatelliteError("Satellite data partially unavailable");
    } finally {
      setSatelliteLoading(false);
    }
  }, []);

  const refreshSoil = useCallback(async () => {
    setSoilLoading(true);
    setSoilError(null);
    try {
      const data = await fetchSoilData();
      setSoilData(data);
      setSoilLastUpdated(new Date());
    } catch {
      // SoilGrids may be down (503) - use defaults silently
      setSoilError("Using local soil data");
    } finally {
      setSoilLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshWeather(), refreshSatellite(), refreshSoil()]);
  }, [refreshWeather, refreshSatellite, refreshSoil]);

  // Initial fetch on mount
  useEffect(() => {
    refreshAll();
  }, []);

  // Auto-refresh weather every 30 minutes
  useEffect(() => {
    weatherInterval.current = setInterval(refreshWeather, REFRESH_INTERVALS.WEATHER);
    return () => {
      if (weatherInterval.current) clearInterval(weatherInterval.current);
    };
  }, [refreshWeather]);

  const apiStatus = {
    weather: weatherLoading ? "loading" as const : weatherError ? "error" as const : weather ? "connected" as const : "loading" as const,
    satellite: satelliteLoading ? "loading" as const : satelliteError ? "error" as const : satelliteScenes.length > 0 || ndviTimeSeries.length > 0 ? "connected" as const : "loading" as const,
    soil: soilLoading ? "loading" as const : soilError ? "error" as const : soilData ? "connected" as const : "loading" as const,
  };

  return (
    <LiveDataContext.Provider
      value={{
        weather,
        weatherInsights,
        weatherLoading,
        weatherError,
        weatherLastUpdated,
        satelliteScenes,
        ndviTimeSeries,
        elevation,
        satelliteLoading,
        satelliteError,
        satelliteLastUpdated,
        soilData,
        soilLoading,
        soilError,
        soilLastUpdated,
        isOnline,
        apiStatus,
        refreshWeather,
        refreshSatellite,
        refreshSoil,
        refreshAll,
      }}
    >
      {children}
    </LiveDataContext.Provider>
  );
}
