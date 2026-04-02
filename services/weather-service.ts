// ============================================
// Weather Service - Open-Meteo API (100% FREE)
// No API key required. Rate limit: 10,000 req/day
// Docs: https://open-meteo.com/en/docs
// ============================================

import { API_ENDPOINTS, DEFAULT_LOCATION } from "./api-config";

export interface LiveWeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
    weatherCode: number;
    cloudCover: number;
    pressure: number;
    uvIndex: number;
    feelsLike: number;
    isDay: boolean;
    time: string;
  };
  hourly: {
    time: string[];
    temperature: number[];
    humidity: number[];
    precipitation: number[];
    windSpeed: number[];
    weatherCode: number[];
    dewPoint: number[];
    visibility: number[];
    uvIndex: number[];
    soilTemperature: number[];
    soilMoisture: number[];
    evapotranspiration: number[];
  };
  daily: {
    time: string[];
    temperatureMax: number[];
    temperatureMin: number[];
    precipitationSum: number[];
    precipitationProbability: number[];
    weatherCode: number[];
    windSpeedMax: number[];
    sunrise: string[];
    sunset: string[];
    uvIndexMax: number[];
    et0: number[]; // Reference evapotranspiration
  };
}

export interface AgriculturalWeatherInsight {
  sprayWindow: { suitable: boolean; reason: string; bestTime?: string };
  irrigationAdvice: { action: string; reason: string };
  diseaseRisk: { level: "low" | "medium" | "high"; diseases: string[]; reason: string };
  frostRisk: boolean;
  heatStress: boolean;
  harvestWindow: { suitable: boolean; nextGoodDay?: string };
}

// WMO Weather Code to readable condition
export const weatherCodeToCondition = (code: number): { condition: string; icon: string } => {
  if (code === 0) return { condition: "Clear Sky", icon: "\u2600\ufe0f" };
  if (code <= 3) return { condition: "Partly Cloudy", icon: "\u26c5" };
  if (code <= 48) return { condition: "Foggy", icon: "\ud83c\udf2b\ufe0f" };
  if (code <= 57) return { condition: "Drizzle", icon: "\ud83c\udf26\ufe0f" };
  if (code <= 67) return { condition: "Rain", icon: "\ud83c\udf27\ufe0f" };
  if (code <= 77) return { condition: "Snow", icon: "\u2744\ufe0f" };
  if (code <= 82) return { condition: "Rain Showers", icon: "\ud83c\udf26\ufe0f" };
  if (code <= 86) return { condition: "Snow Showers", icon: "\u2744\ufe0f" };
  if (code <= 99) return { condition: "Thunderstorm", icon: "\u26c8\ufe0f" };
  return { condition: "Unknown", icon: "\u2601\ufe0f" };
};

/**
 * Fetch real-time weather + 7-day forecast + hourly + soil data
 * from Open-Meteo API (completely free, no API key)
 */
export async function fetchLiveWeather(
  latitude = DEFAULT_LOCATION.latitude,
  longitude = DEFAULT_LOCATION.longitude
): Promise<LiveWeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    // Current weather parameters
    current: [
      "temperature_2m", "relative_humidity_2m", "wind_speed_10m",
      "wind_direction_10m", "precipitation", "weather_code",
      "cloud_cover", "surface_pressure", "uv_index",
      "apparent_temperature", "is_day",
    ].join(","),
    // Hourly forecast (48 hours)
    hourly: [
      "temperature_2m", "relative_humidity_2m", "precipitation",
      "wind_speed_10m", "weather_code", "dew_point_2m",
      "visibility", "uv_index", "soil_temperature_0cm",
      "soil_moisture_0_to_1cm", "et0_fao_evapotranspiration",
    ].join(","),
    // Daily forecast (7 days)
    daily: [
      "temperature_2m_max", "temperature_2m_min", "precipitation_sum",
      "precipitation_probability_max", "weather_code",
      "wind_speed_10m_max", "sunrise", "sunset",
      "uv_index_max", "et0_fao_evapotranspiration",
    ].join(","),
    timezone: "Asia/Kolkata",
    forecast_days: "7",
  });

  const response = await fetch(`${API_ENDPOINTS.OPEN_METEO_FORECAST}?${params}`);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    current: {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      cloudCover: data.current.cloud_cover,
      pressure: data.current.surface_pressure,
      uvIndex: data.current.uv_index,
      feelsLike: data.current.apparent_temperature,
      isDay: data.current.is_day === 1,
      time: data.current.time,
    },
    hourly: {
      time: data.hourly.time,
      temperature: data.hourly.temperature_2m,
      humidity: data.hourly.relative_humidity_2m,
      precipitation: data.hourly.precipitation,
      windSpeed: data.hourly.wind_speed_10m,
      weatherCode: data.hourly.weather_code,
      dewPoint: data.hourly.dew_point_2m,
      visibility: data.hourly.visibility,
      uvIndex: data.hourly.uv_index,
      soilTemperature: data.hourly.soil_temperature_0cm,
      soilMoisture: data.hourly.soil_moisture_0_to_1cm,
      evapotranspiration: data.hourly.et0_fao_evapotranspiration,
    },
    daily: {
      time: data.daily.time,
      temperatureMax: data.daily.temperature_2m_max,
      temperatureMin: data.daily.temperature_2m_min,
      precipitationSum: data.daily.precipitation_sum,
      precipitationProbability: data.daily.precipitation_probability_max,
      weatherCode: data.daily.weather_code,
      windSpeedMax: data.daily.wind_speed_10m_max,
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
      uvIndexMax: data.daily.uv_index_max,
      et0: data.daily.et0_fao_evapotranspiration,
    },
  };
}

/**
 * Fetch historical weather data for a date range
 */
export async function fetchHistoricalWeather(
  startDate: string,
  endDate: string,
  latitude = DEFAULT_LOCATION.latitude,
  longitude = DEFAULT_LOCATION.longitude
) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    start_date: startDate,
    end_date: endDate,
    daily: [
      "temperature_2m_max", "temperature_2m_min",
      "precipitation_sum", "et0_fao_evapotranspiration",
    ].join(","),
    timezone: "Asia/Kolkata",
  });

  const response = await fetch(`${API_ENDPOINTS.OPEN_METEO_HISTORICAL}?${params}`);
  if (!response.ok) throw new Error(`Historical weather error: ${response.status}`);
  return response.json();
}

/**
 * Generate agricultural insights from weather data
 */
export function analyzeWeatherForAgriculture(weather: LiveWeatherData): AgriculturalWeatherInsight {
  const { current, hourly, daily } = weather;

  // Spray window analysis
  const next12hrs = hourly.windSpeed.slice(0, 12);
  const next12rain = hourly.precipitation.slice(0, 12);
  const lowWind = next12hrs.some((w) => w < 12);
  const noRain = next12rain.every((r) => r < 0.5);
  const sprayWindow = {
    suitable: lowWind && noRain && current.temperature < 35,
    reason: !lowWind
      ? "Wind too high (>12 km/h) for safe spraying"
      : !noRain
      ? "Rain expected - chemical will wash off"
      : current.temperature >= 35
      ? "Too hot - evaporation loss"
      : "Good conditions for spraying",
    bestTime: lowWind && noRain ? "Early morning (6-10 AM)" : undefined,
  };

  // Disease risk (based on humidity, temperature, leaf wetness conditions)
  const highHumidityHours = hourly.humidity.slice(0, 24).filter((h) => h > 85).length;
  const diseases: string[] = [];
  if (highHumidityHours > 8 && current.temperature > 20 && current.temperature < 28) {
    diseases.push("Late Blight (Tomato/Potato)");
  }
  if (highHumidityHours > 6 && current.temperature > 25) {
    diseases.push("Downy Mildew");
  }
  if (current.humidity > 40 && current.humidity < 80 && current.temperature > 20 && current.temperature < 30) {
    diseases.push("Powdery Mildew (Grapes)");
  }
  const diseaseRisk = {
    level: (diseases.length >= 2 ? "high" : diseases.length === 1 ? "medium" : "low") as "low" | "medium" | "high",
    diseases,
    reason: diseases.length > 0
      ? `${highHumidityHours}hrs high humidity + ${current.temperature}\u00b0C favors fungal growth`
      : "Current conditions unfavorable for major diseases",
  };

  // Irrigation advice
  const totalRainNext3Days = daily.precipitationSum.slice(0, 3).reduce((s, p) => s + p, 0);
  const et0Today = daily.et0[0] || 0;
  const irrigationAdvice = {
    action: totalRainNext3Days > 20
      ? "Skip irrigation - rain expected"
      : et0Today > 5
      ? "Increase irrigation - high evapotranspiration"
      : "Normal schedule",
    reason: totalRainNext3Days > 20
      ? `${totalRainNext3Days.toFixed(1)}mm rain expected in 3 days`
      : `ET0: ${et0Today.toFixed(1)}mm/day - ${et0Today > 5 ? "high" : "normal"} water demand`,
  };

  // Frost & heat stress
  const frostRisk = daily.temperatureMin.some((t) => t < 4);
  const heatStress = daily.temperatureMax.some((t) => t > 42);

  // Harvest window
  const dryDays = daily.precipitationProbability.map((p, i) => ({
    day: daily.time[i],
    prob: p,
    wind: daily.windSpeedMax[i],
  }));
  const goodHarvestDay = dryDays.find((d) => d.prob < 20 && d.wind < 20);
  const harvestWindow = {
    suitable: daily.precipitationProbability[0] < 20,
    nextGoodDay: goodHarvestDay?.day,
  };

  return { sprayWindow, irrigationAdvice, diseaseRisk, frostRisk, heatStress, harvestWindow };
}
