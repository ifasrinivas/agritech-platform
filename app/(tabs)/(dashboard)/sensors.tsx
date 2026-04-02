import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fields } from "@/data/agritech";

interface SensorReading {
  id: string;
  fieldName: string;
  fieldId: string;
  type: "soil_moisture" | "soil_temp" | "air_temp" | "humidity" | "rain_gauge" | "wind" | "leaf_wetness" | "ec";
  value: number;
  unit: string;
  status: "online" | "offline" | "warning";
  lastUpdated: string;
  battery: number;
  threshold: { min: number; max: number };
}

const sensorReadings: SensorReading[] = [
  { id: "s1", fieldName: "North Block", fieldId: "f1", type: "soil_moisture", value: 32, unit: "%", status: "online", lastUpdated: "2 min ago", battery: 85, threshold: { min: 25, max: 50 } },
  { id: "s2", fieldName: "North Block", fieldId: "f1", type: "soil_temp", value: 24.2, unit: "\u00b0C", status: "online", lastUpdated: "2 min ago", battery: 85, threshold: { min: 15, max: 35 } },
  { id: "s3", fieldName: "South Block", fieldId: "f2", type: "soil_moisture", value: 18, unit: "%", status: "warning", lastUpdated: "15 min ago", battery: 42, threshold: { min: 30, max: 50 } },
  { id: "s4", fieldName: "South Block", fieldId: "f2", type: "soil_temp", value: 26.8, unit: "\u00b0C", status: "offline", lastUpdated: "6 hrs ago", battery: 5, threshold: { min: 15, max: 35 } },
  { id: "s5", fieldName: "East Block", fieldId: "f3", type: "soil_moisture", value: 55, unit: "%", status: "online", lastUpdated: "5 min ago", battery: 92, threshold: { min: 50, max: 70 } },
  { id: "s6", fieldName: "West Orchard", fieldId: "f4", type: "soil_moisture", value: 28, unit: "%", status: "online", lastUpdated: "3 min ago", battery: 78, threshold: { min: 25, max: 45 } },
  { id: "s7", fieldName: "Central Block", fieldId: "f5", type: "soil_moisture", value: 22, unit: "%", status: "offline", lastUpdated: "4 hrs ago", battery: 0, threshold: { min: 25, max: 45 } },
  { id: "s8", fieldName: "Greenhouse", fieldId: "f6", type: "soil_moisture", value: 38, unit: "%", status: "online", lastUpdated: "1 min ago", battery: 100, threshold: { min: 35, max: 50 } },
  { id: "s9", fieldName: "Greenhouse", fieldId: "f6", type: "air_temp", value: 28.5, unit: "\u00b0C", status: "online", lastUpdated: "1 min ago", battery: 95, threshold: { min: 18, max: 35 } },
  { id: "s10", fieldName: "Greenhouse", fieldId: "f6", type: "humidity", value: 72, unit: "%", status: "online", lastUpdated: "1 min ago", battery: 95, threshold: { min: 60, max: 85 } },
  { id: "s11", fieldName: "Greenhouse", fieldId: "f6", type: "ec", value: 0.42, unit: "dS/m", status: "online", lastUpdated: "1 min ago", battery: 95, threshold: { min: 0.2, max: 0.6 } },
  { id: "s12", fieldName: "Weather Station", fieldId: "all", type: "rain_gauge", value: 0, unit: "mm", status: "online", lastUpdated: "5 min ago", battery: 88, threshold: { min: 0, max: 100 } },
  { id: "s13", fieldName: "Weather Station", fieldId: "all", type: "wind", value: 12.3, unit: "km/h", status: "online", lastUpdated: "5 min ago", battery: 88, threshold: { min: 0, max: 40 } },
  { id: "s14", fieldName: "Weather Station", fieldId: "all", type: "leaf_wetness", value: 15, unit: "min", status: "online", lastUpdated: "5 min ago", battery: 88, threshold: { min: 0, max: 120 } },
];

const typeLabels: Record<string, string> = {
  soil_moisture: "Soil Moisture", soil_temp: "Soil Temp", air_temp: "Air Temp",
  humidity: "Humidity", rain_gauge: "Rainfall", wind: "Wind Speed",
  leaf_wetness: "Leaf Wetness", ec: "EC",
};

const typeIcons: Record<string, string> = {
  soil_moisture: "\ud83d\udca7", soil_temp: "\ud83c\udf21\ufe0f", air_temp: "\ud83c\udf21\ufe0f",
  humidity: "\ud83d\udca7", rain_gauge: "\ud83c\udf27\ufe0f", wind: "\ud83d\udca8",
  leaf_wetness: "\ud83c\udf43", ec: "\u26a1",
};

export default function SensorsScreen() {
  const router = useRouter();
  const [selectedField, setSelectedField] = useState("all");
  const [, setTick] = useState(0);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const onlineSensors = sensorReadings.filter((s) => s.status === "online").length;
  const offlineSensors = sensorReadings.filter((s) => s.status === "offline").length;
  const warningSensors = sensorReadings.filter((s) => s.status === "warning" || (s.value < s.threshold.min || s.value > s.threshold.max)).length;

  const filtered = selectedField === "all"
    ? sensorReadings
    : sensorReadings.filter((s) => s.fieldId === selectedField || s.fieldId === "all");

  const fieldOptions = [{ id: "all", name: "All Fields" }, ...fields.map((f) => ({ id: f.id, name: f.crop }))];

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\ud83d\udce1"} IoT Sensor Dashboard
          </Text>
          <Text className="text-typography-400 text-xs">Real-time field monitoring</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-green-500 mr-1" />
          <Text className="text-green-600 text-xs font-dm-sans-medium">Live</Text>
        </View>
      </View>

      {/* Sensor Status Summary */}
      <View className="flex-row mx-5 mt-3 gap-2 mb-3">
        {[
          { label: "Online", count: onlineSensors, color: "#22c55e", icon: "\u2705" },
          { label: "Warning", count: warningSensors, color: "#f59e0b", icon: "\u26a0\ufe0f" },
          { label: "Offline", count: offlineSensors, color: "#ef4444", icon: "\ud83d\udd34" },
        ].map((item, i) => (
          <View key={i} className="flex-1 rounded-xl p-3 items-center" style={{ backgroundColor: item.color + "10" }}>
            <Text style={{ fontSize: 16 }}>{item.icon}</Text>
            <Text className="text-xl font-dm-sans-bold" style={{ color: item.color }}>{item.count}</Text>
            <Text className="text-typography-400 text-xs">{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Field Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-10 mx-5 mb-3">
        {fieldOptions.map((field) => (
          <Pressable
            key={field.id}
            className="rounded-xl px-3 py-2 mr-2"
            style={selectedField === field.id ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }}
            onPress={() => setSelectedField(field.id)}
          >
            <Text className={`text-xs font-dm-sans-medium ${selectedField === field.id ? "text-white" : "text-typography-500"}`}>
              {field.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="px-5">
          {/* Grouped by field */}
          {(() => {
            const groups: Record<string, SensorReading[]> = {};
            filtered.forEach((s) => {
              const key = s.fieldName;
              if (!groups[key]) groups[key] = [];
              groups[key].push(s);
            });
            return Object.entries(groups).map(([fieldName, sensors]) => (
              <View key={fieldName} className="mb-4">
                <Text className="text-typography-700 font-dm-sans-bold text-sm mb-2">
                  {fieldName}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {sensors.map((sensor) => {
                    const isOutOfRange = sensor.value < sensor.threshold.min || sensor.value > sensor.threshold.max;
                    const statusColor = sensor.status === "offline" ? "#ef4444" : isOutOfRange ? "#f59e0b" : "#22c55e";
                    const valueInRange = Math.min(Math.max(
                      (sensor.value - sensor.threshold.min) / (sensor.threshold.max - sensor.threshold.min),
                      0
                    ), 1);

                    return (
                      <View
                        key={sensor.id}
                        className="rounded-2xl p-3 border"
                        style={{
                          width: "48%",
                          backgroundColor: statusColor + "06",
                          borderColor: statusColor + "25",
                        }}
                      >
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-2">
                          <View className="flex-row items-center">
                            <Text style={{ fontSize: 16 }}>{typeIcons[sensor.type]}</Text>
                            <Text className="text-typography-700 text-xs font-dm-sans-medium ml-1">
                              {typeLabels[sensor.type]}
                            </Text>
                          </View>
                          <View className="flex-row items-center">
                            <View
                              className="w-1.5 h-1.5 rounded-full mr-1"
                              style={{ backgroundColor: statusColor }}
                            />
                          </View>
                        </View>

                        {/* Value */}
                        <Text
                          className="text-2xl font-dm-sans-bold"
                          style={{ color: statusColor }}
                        >
                          {sensor.status === "offline" ? "--" : sensor.value}{" "}
                          <Text className="text-xs text-typography-400 font-dm-sans-regular">
                            {sensor.unit}
                          </Text>
                        </Text>

                        {/* Range Bar */}
                        {sensor.status !== "offline" && (
                          <View className="mt-2">
                            <View className="h-1.5 bg-background-200 rounded-full overflow-hidden">
                              <View
                                className="h-full rounded-full"
                                style={{
                                  width: `${valueInRange * 100}%`,
                                  backgroundColor: statusColor,
                                }}
                              />
                            </View>
                            <View className="flex-row justify-between mt-0.5">
                              <Text className="text-typography-300" style={{ fontSize: 8 }}>{sensor.threshold.min}</Text>
                              <Text className="text-typography-300" style={{ fontSize: 8 }}>{sensor.threshold.max}</Text>
                            </View>
                          </View>
                        )}

                        {/* Footer */}
                        <View className="flex-row items-center justify-between mt-1.5">
                          <Text className="text-typography-400" style={{ fontSize: 9 }}>
                            {sensor.lastUpdated}
                          </Text>
                          <View className="flex-row items-center">
                            <Text style={{ fontSize: 9 }}>
                              {sensor.battery > 50 ? "\ud83d\udd0b" : sensor.battery > 20 ? "\ud83e\udead" : "\u26a0\ufe0f"}
                            </Text>
                            <Text
                              className="font-dm-sans-medium"
                              style={{
                                fontSize: 9,
                                color: sensor.battery > 50 ? "#22c55e" : sensor.battery > 20 ? "#f59e0b" : "#ef4444",
                              }}
                            >
                              {sensor.battery}%
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ));
          })()}

          {/* Automation Rules */}
          <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mt-2">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
              {"\u2699\ufe0f"} Automation Rules
            </Text>
            {[
              { rule: "If soil moisture < 25%", action: "Start drip irrigation", field: "All drip fields", active: true },
              { rule: "If leaf wetness > 60 min", action: "Send fungicide alert", field: "Tomato, Grapes", active: true },
              { rule: "If soil temp > 35\u00b0C", action: "Increase irrigation frequency", field: "All fields", active: false },
              { rule: "If wind > 25 km/h", action: "Cancel spray schedule", field: "All fields", active: true },
              { rule: "If rain > 20mm/day", action: "Open drainage valves", field: "Rice Paddy", active: true },
            ].map((item, i) => (
              <View key={i} className="flex-row items-center py-2.5" style={i < 4 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                <View className="flex-1">
                  <Text className="text-typography-800 text-xs font-dm-sans-medium">{item.rule}</Text>
                  <Text className="text-typography-500 text-xs">{"\u2192"} {item.action} ({item.field})</Text>
                </View>
                <View
                  className="rounded-full px-2 py-0.5"
                  style={{ backgroundColor: item.active ? "#22c55e15" : "#d4d4d420" }}
                >
                  <Text className="text-xs font-dm-sans-medium" style={{ color: item.active ? "#22c55e" : "#a1a1aa" }}>
                    {item.active ? "Active" : "Off"}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Sensor Health */}
          <View className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 mt-4">
            <Text className="text-yellow-800 font-dm-sans-bold text-sm mb-2">
              {"\ud83d\udd27"} Maintenance Needed
            </Text>
            {[
              { sensor: "South Block - Soil Temp", issue: "Battery critical (5%). Replace battery.", urgency: "high" },
              { sensor: "Central Block - Soil Moisture", issue: "Offline 4 hours. Check wiring.", urgency: "high" },
              { sensor: "South Block - Soil Moisture", issue: "Low battery (42%). Schedule replacement.", urgency: "medium" },
            ].map((item, i) => (
              <View key={i} className="bg-white rounded-xl p-3 mb-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-typography-900 text-xs font-dm-sans-bold">{item.sensor}</Text>
                  <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: item.urgency === "high" ? "#ef444415" : "#f59e0b15" }}>
                    <Text className="text-xs font-dm-sans-medium capitalize" style={{ color: item.urgency === "high" ? "#ef4444" : "#f59e0b" }}>
                      {item.urgency}
                    </Text>
                  </View>
                </View>
                <Text className="text-typography-500 text-xs mt-1">{item.issue}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
