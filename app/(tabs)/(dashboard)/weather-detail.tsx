import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { backendClient } from "@/services/backend-client";
import { COLORS, RADIUS, SHADOWS } from "@/components/screens/agritech/premium/theme";
import { CloudSun, Search, MapPin, Droplets, Wind, Thermometer, ChevronLeft } from "lucide-react-native";
import { weatherCodeToCondition } from "@/services/weather-service";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeatherDetailScreen() {
  const router = useRouter();
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [locationName, setLocationName] = useState("Nashik, Maharashtra");
  const [coords, setCoords] = useState({ lat: 20.0063, lon: 73.7910 });

  useEffect(() => {
    fetchWeather(coords.lat, coords.lon);
  }, [coords]);

  async function fetchWeather(lat: number, lon: number) {
    setLoading(true);
    setError(null);
    try {
      const data = await backendClient.getWeatherForecast(lat, lon, 7);
      setWeather(data);
    } catch (e: any) {
      setError(e.message || "Failed to fetch weather");
    }
    setLoading(false);
  }

  async function handleSearch() {
    if (searchQuery.length < 2) return;
    setSearching(true);
    try {
      const data = await backendClient.searchLocation(searchQuery);
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  }

  function selectLocation(result: any) {
    setCoords({ lat: result.latitude, lon: result.longitude });
    setLocationName(`${result.name}, ${result.admin1 || result.country}`);
    setSearchResults([]);
    setSearchQuery("");
  }

  const current = weather?.current;
  const daily = weather?.daily;
  const hourly = weather?.hourly;
  const insights = weather?.agricultural_insights;
  const condInfo = current ? weatherCodeToCondition(current.weather_code) : { condition: "Loading", icon: "\u26c5" };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface.raised }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.surface.base, borderBottomWidth: 1, borderBottomColor: COLORS.surface.borderLight }}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <ChevronLeft size={22} color={COLORS.text.secondary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <CloudSun size={18} color={COLORS.accent.blue} />
            <Text style={{ color: COLORS.text.primary, fontSize: 17, fontFamily: "dm-sans-bold" }}>Weather Intelligence</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
            <MapPin size={11} color={COLORS.text.muted} />
            <Text style={{ color: COLORS.text.muted, fontSize: 11 }}>{locationName}</Text>
          </View>
        </View>
      </View>

      {/* Location Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: COLORS.surface.base }}>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface.overlay, borderRadius: RADIUS.md, paddingHorizontal: 12, borderWidth: 1, borderColor: COLORS.surface.border }}>
          <Search size={16} color={COLORS.text.muted} />
          <TextInput
            style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 8, fontSize: 13, color: COLORS.text.primary }}
            placeholder="Search city... (Nashik, Mumbai, Pune)"
            placeholderTextColor={COLORS.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searching && <ActivityIndicator size="small" color={COLORS.primary.from} />}
        </View>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View style={{ backgroundColor: COLORS.surface.base, borderRadius: RADIUS.md, marginTop: 4, borderWidth: 1, borderColor: COLORS.surface.border, ...SHADOWS.md }}>
            {searchResults.map((r, i) => (
              <Pressable key={i} onPress={() => selectLocation(r)}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: i < searchResults.length - 1 ? 1 : 0, borderBottomColor: COLORS.surface.borderLight }}>
                  <MapPin size={14} color={COLORS.primary.from} />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ color: COLORS.text.primary, fontSize: 13, fontFamily: "dm-sans-medium" }}>{r.name}</Text>
                    <Text style={{ color: COLORS.text.muted, fontSize: 11 }}>{r.admin1 || ""}, {r.country} ({r.latitude?.toFixed(2)}, {r.longitude?.toFixed(2)})</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary.from} />
          <Text style={{ color: COLORS.text.muted, marginTop: 10, fontSize: 13 }}>Loading weather data...</Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
          <Text style={{ color: COLORS.status.critical, fontSize: 14 }}>{error}</Text>
          <Pressable onPress={() => fetchWeather(coords.lat, coords.lon)} style={{ marginTop: 12, backgroundColor: COLORS.primary.from, borderRadius: RADIUS.md, paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ color: "#fff", fontFamily: "dm-sans-bold" }}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
          {/* Current */}
          <View style={{ margin: 16, backgroundColor: "#0c4a6e", borderRadius: RADIUS.xl, padding: 20, ...SHADOWS.lg }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <Text style={{ color: "#fff", fontSize: 52, fontFamily: "dm-sans-bold", letterSpacing: -2 }}>{Math.round(current?.temperature || 0)}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 22, marginTop: 8 }}>{"\u00b0"}C</Text>
                </View>
                <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, fontFamily: "dm-sans-medium" }}>{condInfo.condition}</Text>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>
                  Feels like {Math.round(current?.feels_like || 0)}{"\u00b0"} | UV: {current?.uv_index || 0}
                </Text>
              </View>
              <Text style={{ fontSize: 56 }}>{condInfo.icon}</Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 16, gap: 8 }}>
              {[
                { icon: <Droplets size={13} color="rgba(255,255,255,0.6)" />, label: "Humidity", value: `${current?.humidity || 0}%` },
                { icon: <Wind size={13} color="rgba(255,255,255,0.6)" />, label: "Wind", value: `${Math.round(current?.wind_speed || 0)} km/h` },
                { icon: <Thermometer size={13} color="rgba(255,255,255,0.6)" />, label: "Pressure", value: `${Math.round(current?.pressure || 0)} hPa` },
              ].map((item, i) => (
                <View key={i} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 10, alignItems: "center" }}>
                  {item.icon}
                  <Text style={{ color: "#fff", fontSize: 13, fontFamily: "dm-sans-bold", marginTop: 4 }}>{item.value}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Agricultural Insights */}
          {insights && (
            <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
              <Text style={{ color: COLORS.text.primary, fontSize: 15, fontFamily: "dm-sans-bold", marginBottom: 10 }}>Agricultural Insights</Text>
              {[
                { label: "Spray Window", value: insights.spray_window.suitable ? "Suitable" : "Hold", detail: insights.spray_window.reason, color: insights.spray_window.suitable ? COLORS.status.excellent : COLORS.status.critical },
                { label: "Disease Risk", value: insights.disease_risk.level.toUpperCase(), detail: insights.disease_risk.diseases.join(", ") || "No risk detected", color: insights.disease_risk.level === "high" ? COLORS.status.critical : insights.disease_risk.level === "medium" ? COLORS.status.moderate : COLORS.status.excellent },
                { label: "Irrigation", value: insights.irrigation.advice, detail: `Rain 3d: ${insights.irrigation.rain_next_3d_mm}mm | ET0: ${insights.irrigation.et0_today_mm}mm`, color: COLORS.accent.blue },
              ].map((item, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface.base, borderRadius: RADIUS.md, padding: 12, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: item.color, ...SHADOWS.sm }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: COLORS.text.primary, fontSize: 13, fontFamily: "dm-sans-bold" }}>{item.label}</Text>
                      <Text style={{ color: item.color, fontSize: 11, fontFamily: "dm-sans-bold" }}>{item.value}</Text>
                    </View>
                    <Text style={{ color: COLORS.text.muted, fontSize: 11, marginTop: 2 }}>{item.detail}</Text>
                  </View>
                </View>
              ))}
              {insights.frost_risk && (
                <View style={{ backgroundColor: "#eff6ff", borderRadius: RADIUS.md, padding: 10, marginBottom: 6 }}>
                  <Text style={{ color: "#1e40af", fontSize: 12, fontFamily: "dm-sans-bold" }}>{"\u2744\ufe0f"} Frost risk in forecast period</Text>
                </View>
              )}
              {insights.heat_stress && (
                <View style={{ backgroundColor: "#fef2f2", borderRadius: RADIUS.md, padding: 10, marginBottom: 6 }}>
                  <Text style={{ color: "#991b1b", fontSize: 12, fontFamily: "dm-sans-bold" }}>{"\ud83c\udf21\ufe0f"} Heat stress expected (&gt;42°C)</Text>
                </View>
              )}
            </View>
          )}

          {/* 7-Day Forecast */}
          {daily && (
            <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
              <Text style={{ color: COLORS.text.primary, fontSize: 15, fontFamily: "dm-sans-bold", marginBottom: 10 }}>7-Day Forecast</Text>
              {daily.time?.map((dateStr: string, i: number) => {
                const date = new Date(dateStr);
                const dayName = i === 0 ? "Today" : dayNames[date.getDay()];
                const cond = weatherCodeToCondition(daily.weather_code[i]);
                const hi = Math.round(daily.temperature_max[i]);
                const lo = Math.round(daily.temperature_min[i]);
                const rain = daily.precipitation_probability[i];

                return (
                  <View key={i} style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface.base, borderRadius: RADIUS.md, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 4, ...SHADOWS.sm }}>
                    <Text style={{ color: COLORS.text.primary, fontSize: 13, fontFamily: "dm-sans-medium", width: 50 }}>{dayName}</Text>
                    <Text style={{ fontSize: 20, width: 32, textAlign: "center" }}>{cond.icon}</Text>
                    <View style={{ flex: 1, marginHorizontal: 10 }}>
                      <View style={{ height: 4, backgroundColor: COLORS.surface.muted, borderRadius: 2, overflow: "hidden", flexDirection: "row" }}>
                        <View style={{ flex: lo - 10, backgroundColor: "transparent" }} />
                        <View style={{ flex: hi - lo, backgroundColor: rain > 50 ? COLORS.accent.blue : hi > 35 ? COLORS.status.critical : COLORS.status.moderate, borderRadius: 2 }} />
                        <View style={{ flex: 45 - hi, backgroundColor: "transparent" }} />
                      </View>
                    </View>
                    <Text style={{ color: COLORS.text.muted, fontSize: 12, width: 28, textAlign: "right" }}>{lo}{"\u00b0"}</Text>
                    <Text style={{ color: COLORS.text.primary, fontSize: 12, fontFamily: "dm-sans-bold", width: 28, textAlign: "right" }}>{hi}{"\u00b0"}</Text>
                    {rain > 20 && <Text style={{ color: COLORS.accent.blue, fontSize: 10, width: 30, textAlign: "right" }}>{rain}%</Text>}
                  </View>
                );
              })}
            </View>
          )}

          {/* Hourly Soil Conditions */}
          {hourly?.soil_temperature && (
            <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
              <Text style={{ color: COLORS.text.primary, fontSize: 15, fontFamily: "dm-sans-bold", marginBottom: 10 }}>Soil Conditions (Live)</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ flex: 1, backgroundColor: COLORS.surface.base, borderRadius: RADIUS.md, padding: 12, ...SHADOWS.sm }}>
                  <Text style={{ color: COLORS.text.muted, fontSize: 10 }}>Soil Temp</Text>
                  <Text style={{ color: COLORS.status.poor, fontSize: 20, fontFamily: "dm-sans-bold" }}>{hourly.soil_temperature[12]?.toFixed(1) || "--"}{"\u00b0"}C</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: COLORS.surface.base, borderRadius: RADIUS.md, padding: 12, ...SHADOWS.sm }}>
                  <Text style={{ color: COLORS.text.muted, fontSize: 10 }}>Soil Moisture</Text>
                  <Text style={{ color: COLORS.accent.blue, fontSize: 20, fontFamily: "dm-sans-bold" }}>{hourly.soil_moisture[12] !== undefined ? (hourly.soil_moisture[12] * 100).toFixed(0) : "--"}%</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: COLORS.surface.base, borderRadius: RADIUS.md, padding: 12, ...SHADOWS.sm }}>
                  <Text style={{ color: COLORS.text.muted, fontSize: 10 }}>ET0</Text>
                  <Text style={{ color: COLORS.status.excellent, fontSize: 20, fontFamily: "dm-sans-bold" }}>{hourly.evapotranspiration[12]?.toFixed(2) || "--"}</Text>
                  <Text style={{ color: COLORS.text.muted, fontSize: 9 }}>mm/hr</Text>
                </View>
              </View>
            </View>
          )}

          {/* Coordinates */}
          <View style={{ marginHorizontal: 16, backgroundColor: COLORS.surface.base, borderRadius: RADIUS.md, padding: 12, ...SHADOWS.sm }}>
            <Text style={{ color: COLORS.text.muted, fontSize: 10 }}>
              {"\ud83d\udccd"} {coords.lat.toFixed(4)}{"\u00b0"}N, {coords.lon.toFixed(4)}{"\u00b0"}E | Timezone: {weather?.location?.timezone || "auto"}
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
