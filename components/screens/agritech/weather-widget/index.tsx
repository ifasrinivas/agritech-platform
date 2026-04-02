import React, { useContext } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LiveDataContext } from "@/contexts/live-data-context";
import { weatherCodeToCondition } from "@/services/weather-service";
import { weatherData as mockWeather } from "@/data/agritech";
import { COLORS, SHADOWS } from "@/components/screens/agritech/premium/theme";
import { Droplets, Wind, CloudRain, Thermometer, Eye } from "lucide-react-native";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeatherWidget() {
  const { weather, weatherLoading, weatherError, weatherLastUpdated } = useContext(LiveDataContext);

  const isLive = !!weather;
  const current = weather?.current;
  const daily = weather?.daily;

  const temp = current?.temperature ?? mockWeather.temperature;
  const humidity = current?.humidity ?? mockWeather.humidity;
  const windSpeed = current?.windSpeed ?? mockWeather.windSpeed;
  const precipitation = current?.precipitation ?? mockWeather.rainfall;
  const condInfo = current
    ? weatherCodeToCondition(current.weatherCode)
    : { condition: mockWeather.condition, icon: "\u26c5" };

  return (
    <View style={{ borderRadius: 20, overflow: "hidden", ...SHADOWS.md }}>
      <LinearGradient
        colors={["#0c4a6e", "#0369a1", "#0284c7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 18 }}
      >
        {/* Live indicator */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: isLive ? "#4ade80" : "#fbbf24", marginRight: 6 }} />
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "dm-sans-medium" }}>
              {weatherLoading ? "Updating..." : isLive ? "Live Weather" : "Offline Data"}
            </Text>
          </View>
          {weatherLastUpdated && (
            <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>
              {weatherLastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </Text>
          )}
        </View>

        {/* Main temp + condition */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Text style={{ color: "#fff", fontSize: 48, fontFamily: "dm-sans-bold", letterSpacing: -2 }}>
                {Math.round(temp)}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 20, fontFamily: "dm-sans-regular", marginTop: 6 }}>{"\u00b0"}C</Text>
            </View>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontFamily: "dm-sans-medium", marginTop: -2 }}>
              {condInfo.condition}
            </Text>
            {current?.feelsLike !== undefined && (
              <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 2 }}>
                Feels like {Math.round(current.feelsLike)}{"\u00b0"}
              </Text>
            )}
          </View>
          {weatherLoading ? (
            <ActivityIndicator size="large" color="rgba(255,255,255,0.6)" />
          ) : (
            <Text style={{ fontSize: 56 }}>{condInfo.icon}</Text>
          )}
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: "row", marginTop: 16, gap: 8 }}>
          {[
            { icon: <Droplets size={13} color="rgba(255,255,255,0.6)" />, label: "Humidity", value: `${Math.round(humidity)}%` },
            { icon: <Wind size={13} color="rgba(255,255,255,0.6)" />, label: "Wind", value: `${Math.round(windSpeed)} km/h` },
            { icon: <CloudRain size={13} color="rgba(255,255,255,0.6)" />, label: "Rain", value: `${precipitation.toFixed(1)} mm` },
          ].map((item, i) => (
            <View key={i} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 10, alignItems: "center" }}>
              {item.icon}
              <Text style={{ color: "#fff", fontSize: 13, fontFamily: "dm-sans-bold", marginTop: 4 }}>{item.value}</Text>
              <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, marginTop: 1 }}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Soil conditions */}
        {weather?.hourly?.soilTemperature && (
          <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
            {[
              { icon: <Thermometer size={12} color="rgba(255,255,255,0.5)" />, label: "Soil", value: `${weather.hourly.soilTemperature[0]?.toFixed(1) ?? "--"}\u00b0C` },
              { icon: <Droplets size={12} color="rgba(255,255,255,0.5)" />, label: "Moisture", value: weather.hourly.soilMoisture[0] !== undefined ? `${(weather.hourly.soilMoisture[0] * 100).toFixed(0)}%` : "--" },
              { icon: <Eye size={12} color="rgba(255,255,255,0.5)" />, label: "ET0", value: `${weather.hourly.evapotranspiration[0]?.toFixed(2) ?? "--"} mm` },
            ].map((item, i) => (
              <View key={i} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 8, alignItems: "center" }}>
                {item.icon}
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontFamily: "dm-sans-bold", marginTop: 3 }}>{item.value}</Text>
                <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 8 }}>{item.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 7-day forecast */}
        <View style={{ marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)" }}>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: "dm-sans-bold", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>
            7-Day Forecast {isLive ? "(Live)" : ""}
          </Text>
          <View style={{ flexDirection: "row" }}>
            {daily ? (
              daily.time.map((dateStr, i) => {
                const date = new Date(dateStr);
                const dayName = i === 0 ? "Today" : dayNames[date.getDay()];
                const cond = weatherCodeToCondition(daily.weatherCode[i]);
                return (
                  <View key={i} style={{ flex: 1, alignItems: "center" }}>
                    <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: "dm-sans-medium" }}>{dayName}</Text>
                    <Text style={{ fontSize: 16, marginVertical: 3 }}>{cond.icon}</Text>
                    <Text style={{ color: "#fff", fontSize: 12, fontFamily: "dm-sans-bold" }}>{Math.round(daily.temperatureMax[i])}{"\u00b0"}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{Math.round(daily.temperatureMin[i])}{"\u00b0"}</Text>
                    {daily.precipitationProbability[i] > 30 && (
                      <Text style={{ color: "#7dd3fc", fontSize: 9, marginTop: 1 }}>{daily.precipitationProbability[i]}%</Text>
                    )}
                  </View>
                );
              })
            ) : (
              mockWeather.forecast.map((day, i) => (
                <View key={i} style={{ flex: 1, alignItems: "center" }}>
                  <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>{day.day.substring(0, 3)}</Text>
                  <Text style={{ fontSize: 16, marginVertical: 3 }}>{"\u26c5"}</Text>
                  <Text style={{ color: "#fff", fontSize: 12, fontFamily: "dm-sans-bold" }}>{day.high}{"\u00b0"}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{day.low}{"\u00b0"}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </LinearGradient>

      {weatherError && (
        <View style={{ backgroundColor: "#fef3c7", padding: 10 }}>
          <Text style={{ color: "#92400e", fontSize: 11 }}>{"\u26a0\ufe0f"} {weatherError}</Text>
        </View>
      )}
    </View>
  );
}
