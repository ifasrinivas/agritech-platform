import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { weatherData } from "@/data/agritech";

const conditionIcons: Record<string, string> = {
  Sunny: "\u2600\ufe0f",
  "Partly Cloudy": "\u26c5",
  Cloudy: "\u2601\ufe0f",
  Rain: "\ud83c\udf27\ufe0f",
  Thunderstorm: "\u26c8\ufe0f",
};

export default function WeatherDetailScreen() {
  const router = useRouter();

  const hourlyData = [
    { time: "6 AM", temp: 22, humidity: 78, icon: "\ud83c\udf24\ufe0f", wind: 8, dew: 18 },
    { time: "8 AM", temp: 25, humidity: 72, icon: "\u26c5", wind: 10, dew: 19 },
    { time: "10 AM", temp: 29, humidity: 65, icon: "\u26c5", wind: 11, dew: 20 },
    { time: "12 PM", temp: 32, humidity: 58, icon: "\u2600\ufe0f", wind: 14, dew: 21 },
    { time: "2 PM", temp: 34, humidity: 52, icon: "\u2600\ufe0f", wind: 16, dew: 20 },
    { time: "4 PM", temp: 33, humidity: 55, icon: "\u26c5", wind: 13, dew: 21 },
    { time: "6 PM", temp: 30, humidity: 62, icon: "\u26c5", wind: 10, dew: 20 },
    { time: "8 PM", temp: 27, humidity: 70, icon: "\ud83c\udf19", wind: 7, dew: 19 },
    { time: "10 PM", temp: 24, humidity: 76, icon: "\ud83c\udf19", wind: 5, dew: 18 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\ud83c\udf24\ufe0f"} Weather Intelligence
          </Text>
          <Text className="text-typography-400 text-xs">Agricultural weather advisory</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Current Conditions */}
        <View className="mx-5 mt-4 bg-background-50 rounded-2xl p-5 border border-outline-100">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-typography-400 text-xs">Nashik, Maharashtra</Text>
              <Text className="text-typography-900 text-5xl font-dm-sans-bold mt-1">
                {weatherData.temperature}{"\u00b0"}
              </Text>
              <Text className="text-typography-600 text-base font-dm-sans-medium">
                {weatherData.condition}
              </Text>
              <Text className="text-typography-400 text-xs mt-1">
                Feels like 35\u00b0C \u2022 UV Index: 7 (High)
              </Text>
            </View>
            <Text style={{ fontSize: 64 }}>
              {conditionIcons[weatherData.condition] || "\u2600\ufe0f"}
            </Text>
          </View>

          <View className="flex-row mt-4 pt-4 border-t border-outline-100">
            {[
              { label: "Humidity", value: `${weatherData.humidity}%`, icon: "\ud83d\udca7" },
              { label: "Wind", value: `${weatherData.windSpeed} km/h`, icon: "\ud83d\udca8" },
              { label: "Pressure", value: "1013 hPa", icon: "\ud83c\udf21\ufe0f" },
              { label: "Visibility", value: "8 km", icon: "\ud83d\udc41\ufe0f" },
            ].map((item, i) => (
              <View key={i} className="flex-1 items-center">
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                <Text className="text-typography-400 text-xs mt-1">{item.label}</Text>
                <Text className="text-typography-800 text-xs font-dm-sans-bold">{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Hourly Forecast */}
        <View className="mt-4 px-5">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
            Hourly Forecast
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {hourlyData.map((hour, i) => (
                <View key={i} className="bg-background-50 rounded-xl p-3 items-center border border-outline-100" style={{ width: 72 }}>
                  <Text className="text-typography-500 text-xs">{hour.time}</Text>
                  <Text style={{ fontSize: 20, marginVertical: 4 }}>{hour.icon}</Text>
                  <Text className="text-typography-900 font-dm-sans-bold text-sm">{hour.temp}\u00b0</Text>
                  <Text className="text-blue-500 text-xs">{hour.humidity}%</Text>
                  <Text className="text-typography-400 text-xs">{hour.wind} km/h</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 7-Day Forecast Extended */}
        <View className="mt-4 px-5">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
            7-Day Extended Forecast
          </Text>
          {weatherData.forecast.map((day, i) => (
            <View
              key={i}
              className="flex-row items-center py-3 px-4 bg-background-50 rounded-xl mb-2 border border-outline-100"
            >
              <Text className="text-typography-700 font-dm-sans-medium text-sm w-12">{day.day}</Text>
              <Text style={{ fontSize: 20, width: 32 }}>{conditionIcons[day.condition] || "\u2600\ufe0f"}</Text>
              <View className="flex-1 mx-3">
                <View className="h-2 bg-background-200 rounded-full overflow-hidden flex-row">
                  <View style={{ flex: day.low - 15, backgroundColor: "transparent" }} />
                  <View
                    className="rounded-full"
                    style={{
                      flex: day.high - day.low,
                      backgroundColor: day.rainChance > 50 ? "#3b82f6" : day.high > 32 ? "#ef4444" : "#f59e0b",
                    }}
                  />
                  <View style={{ flex: 40 - day.high, backgroundColor: "transparent" }} />
                </View>
              </View>
              <Text className="text-typography-400 text-xs w-8">{day.low}\u00b0</Text>
              <Text className="text-typography-900 text-xs font-dm-sans-bold w-8">{day.high}\u00b0</Text>
              {day.rainChance > 20 && (
                <Text className="text-blue-500 text-xs w-10 text-right">{day.rainChance}%</Text>
              )}
            </View>
          ))}
        </View>

        {/* Agricultural Weather Impact */}
        <View className="mt-4 mx-5 bg-green-50 rounded-2xl p-4 border border-green-200">
          <Text className="text-green-800 font-dm-sans-bold text-base mb-3">
            {"\ud83c\udf3e"} Agricultural Impact Assessment
          </Text>

          {[
            {
              title: "Spraying Window",
              status: "Favorable",
              detail: "Low wind (< 15 km/h) expected Thu-Fri morning. Ideal for pesticide/foliar spray.",
              color: "#22c55e",
              icon: "\u2705",
            },
            {
              title: "Irrigation Advisory",
              status: "Delay Recommended",
              detail: "Heavy rain expected Sat-Sun. Postpone irrigation to avoid waterlogging.",
              color: "#f59e0b",
              icon: "\u26a0\ufe0f",
            },
            {
              title: "Disease Pressure",
              status: "High Risk",
              detail: "Humidity + warmth = high risk for Late Blight (Tomato) and Downy Mildew. Preventive spray recommended.",
              color: "#ef4444",
              icon: "\ud83d\udea8",
            },
            {
              title: "Harvest Window",
              status: "Thu-Fri Optimal",
              detail: "Dry conditions Thu-Fri ideal for Grape harvest. Avoid Sat-Sun due to rain.",
              color: "#22c55e",
              icon: "\ud83c\udf3e",
            },
            {
              title: "Fertilizer Application",
              status: "Apply Before Sat",
              detail: "Apply granular fertilizers by Friday. Rain will help dissolution. Avoid foliar application during rain.",
              color: "#3b82f6",
              icon: "\ud83d\udca1",
            },
          ].map((item, i) => (
            <View
              key={i}
              className="mb-3 rounded-xl p-3"
              style={{ backgroundColor: item.color + "10", borderLeftWidth: 3, borderLeftColor: item.color }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text style={{ fontSize: 14 }}>{item.icon}</Text>
                  <Text className="text-typography-900 font-dm-sans-bold text-sm ml-2">
                    {item.title}
                  </Text>
                </View>
                <Text className="text-xs font-dm-sans-bold" style={{ color: item.color }}>
                  {item.status}
                </Text>
              </View>
              <Text className="text-typography-600 text-xs font-dm-sans-regular mt-1 leading-4">
                {item.detail}
              </Text>
            </View>
          ))}
        </View>

        {/* Sun & Moon */}
        <View className="mt-4 mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100">
          <Text className="text-typography-900 font-dm-sans-bold text-sm mb-3">
            Sun & Moon
          </Text>
          <View className="flex-row">
            <View className="flex-1 items-center">
              <Text style={{ fontSize: 28 }}>{"\ud83c\udf05"}</Text>
              <Text className="text-typography-800 font-dm-sans-bold text-sm mt-1">6:12 AM</Text>
              <Text className="text-typography-400 text-xs">Sunrise</Text>
            </View>
            <View className="flex-1 items-center">
              <Text style={{ fontSize: 28 }}>{"\ud83c\udf07"}</Text>
              <Text className="text-typography-800 font-dm-sans-bold text-sm mt-1">6:48 PM</Text>
              <Text className="text-typography-400 text-xs">Sunset</Text>
            </View>
            <View className="flex-1 items-center">
              <Text style={{ fontSize: 28 }}>{"\ud83c\udf15"}</Text>
              <Text className="text-typography-800 font-dm-sans-bold text-sm mt-1">12h 36m</Text>
              <Text className="text-typography-400 text-xs">Daylight</Text>
            </View>
            <View className="flex-1 items-center">
              <Text style={{ fontSize: 28 }}>{"\ud83c\udf19"}</Text>
              <Text className="text-typography-800 font-dm-sans-bold text-sm mt-1">Waxing</Text>
              <Text className="text-typography-400 text-xs">Moon Phase</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
