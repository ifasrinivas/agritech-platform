import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type SprayTab = "schedule" | "weather-window" | "phi" | "log";

interface SprayEntry {
  id: string;
  field: string;
  crop: string;
  chemical: string;
  type: "fungicide" | "insecticide" | "herbicide" | "nutrient" | "bio-agent";
  dosage: string;
  purpose: string;
  scheduledDate: string;
  status: "scheduled" | "completed" | "skipped" | "overdue";
  phi: number;
  lastSprayDate?: string;
  safeHarvestDate?: string;
  weatherOk: boolean;
  notes?: string;
}

const sprays: SprayEntry[] = [
  { id: "sp1", field: "South Block", crop: "Tomato", chemical: "Mancozeb 75% WP", type: "fungicide", dosage: "2.5g/L, 500L/acre", purpose: "Late Blight prevention", scheduledDate: "2026-04-04", status: "scheduled", phi: 15, weatherOk: true, notes: "Apply before Saturday rain" },
  { id: "sp2", field: "Central Block", crop: "Onion", chemical: "Fipronil 5% SC", type: "insecticide", dosage: "1ml/L, 500L/acre", purpose: "Thrips control (ETL crossed: 8/plant)", scheduledDate: "2026-04-03", status: "scheduled", phi: 14, weatherOk: true },
  { id: "sp3", field: "Greenhouse", crop: "Capsicum", chemical: "Calcium Boron", type: "nutrient", dosage: "2ml/L, 200L/acre", purpose: "Fruit quality improvement, prevent BER", scheduledDate: "2026-04-08", status: "scheduled", phi: 0, weatherOk: true, notes: "Evening application preferred" },
  { id: "sp4", field: "North Block", crop: "Wheat", chemical: "Propiconazole 25% EC", type: "fungicide", dosage: "1ml/L, 400L/acre", purpose: "Rust prevention (preventive)", scheduledDate: "2026-04-06", status: "scheduled", phi: 21, weatherOk: false, notes: "Rain expected Sat-Sun, delay to Monday" },
  { id: "sp5", field: "East Block", crop: "Rice", chemical: "Bispyribac Sodium 10% SC", type: "herbicide", dosage: "120ml/acre", purpose: "Post-emergence weed control", scheduledDate: "2026-04-12", status: "scheduled", phi: 45, weatherOk: true, notes: "Maintain 2-3cm water level during application" },
  { id: "sp6", field: "South Block", crop: "Tomato", chemical: "Trichoderma viride", type: "bio-agent", dosage: "4g/L, 500L/acre", purpose: "Bio-fungicide, soil drench + foliar", scheduledDate: "2026-03-28", status: "completed", phi: 0, lastSprayDate: "2026-03-28", weatherOk: true },
  { id: "sp7", field: "All Fields", crop: "Multiple", chemical: "Neem Oil 1500ppm", type: "bio-agent", dosage: "3ml/L + sticker 0.5ml/L", purpose: "Broad spectrum preventive (fortnightly)", scheduledDate: "2026-03-25", status: "completed", phi: 0, lastSprayDate: "2026-03-25", weatherOk: true },
  { id: "sp8", field: "West Orchard", crop: "Grapes", chemical: "Sulphur 80% WP", type: "fungicide", dosage: "2g/L, 800L/acre", purpose: "Powdery Mildew prevention", scheduledDate: "2026-03-20", status: "completed", phi: 7, lastSprayDate: "2026-03-20", safeHarvestDate: "2026-03-27", weatherOk: true },
];

const typeColors: Record<string, string> = { fungicide: "#8b5cf6", insecticide: "#ef4444", herbicide: "#f59e0b", nutrient: "#3b82f6", "bio-agent": "#22c55e" };
const typeIcons: Record<string, string> = { fungicide: "\ud83e\uddec", insecticide: "\ud83d\udc1b", herbicide: "\ud83c\udf3f", nutrient: "\ud83e\udea4", "bio-agent": "\ud83c\udf3f" };

export default function SprayPlannerScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SprayTab>("schedule");

  const scheduled = sprays.filter((s) => s.status === "scheduled");
  const completed = sprays.filter((s) => s.status === "completed");
  const weatherBlocked = sprays.filter((s) => s.status === "scheduled" && !s.weatherOk);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\udca8"} Spray Planner</Text>
          <Text className="text-typography-400 text-xs">Schedule, PHI tracking & weather windows</Text>
        </View>
        <Pressable className="bg-green-500 rounded-lg px-3 py-1.5">
          <Text className="text-white text-xs font-dm-sans-bold">+ Spray</Text>
        </Pressable>
      </View>

      {/* Summary */}
      <View className="flex-row mx-5 mt-3 gap-2 mb-3">
        <View className="flex-1 bg-blue-50 rounded-xl p-2.5 items-center border border-blue-200">
          <Text className="text-blue-800 text-lg font-dm-sans-bold">{scheduled.length}</Text>
          <Text className="text-blue-600 text-xs">Scheduled</Text>
        </View>
        <View className="flex-1 bg-green-50 rounded-xl p-2.5 items-center border border-green-200">
          <Text className="text-green-800 text-lg font-dm-sans-bold">{completed.length}</Text>
          <Text className="text-green-600 text-xs">Completed</Text>
        </View>
        <View className="flex-1 bg-red-50 rounded-xl p-2.5 items-center border border-red-200">
          <Text className="text-red-800 text-lg font-dm-sans-bold">{weatherBlocked.length}</Text>
          <Text className="text-red-600 text-xs">Weather Hold</Text>
        </View>
      </View>

      <View className="flex-row mx-5 mb-3 bg-background-100 rounded-xl p-1">
        {(["schedule", "weather-window", "phi", "log"] as SprayTab[]).map((t) => (
          <Pressable key={t} className="flex-1 items-center py-2 rounded-lg" style={activeTab === t ? { backgroundColor: "#16a34a" } : {}} onPress={() => setActiveTab(t)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === t ? "text-white" : "text-typography-500"}`}>
              {t === "schedule" ? "\ud83d\udcc5 Schedule" : t === "weather-window" ? "\u26c5 Weather" : t === "phi" ? "\u23f0 PHI" : "\ud83d\udccb Log"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "schedule" && (
          <View className="px-5">
            <Text className="text-typography-700 font-dm-sans-bold text-sm mb-2">Upcoming Sprays</Text>
            {scheduled.map((spray) => {
              const color = typeColors[spray.type];
              return (
                <View key={spray.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center flex-1">
                      <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: color + "15" }}>
                        <Text style={{ fontSize: 18 }}>{typeIcons[spray.type]}</Text>
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-typography-900 font-dm-sans-bold text-sm" numberOfLines={1}>{spray.chemical}</Text>
                        <Text className="text-typography-400 text-xs">{spray.field} \u2022 {spray.crop}</Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-typography-700 text-xs font-dm-sans-bold">
                        {new Date(spray.scheduledDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </Text>
                      <View className="flex-row items-center mt-0.5">
                        <View className={`w-2 h-2 rounded-full mr-1 ${spray.weatherOk ? "bg-green-500" : "bg-red-500"}`} />
                        <Text className={`text-xs ${spray.weatherOk ? "text-green-600" : "text-red-600"}`}>
                          {spray.weatherOk ? "Weather OK" : "Weather Hold"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text className="text-typography-600 text-xs mb-1">{spray.purpose}</Text>
                  <Text className="text-typography-500 text-xs">Dosage: {spray.dosage}</Text>

                  <View className="flex-row gap-2 mt-2">
                    <View className="rounded-lg px-2 py-1" style={{ backgroundColor: color + "10" }}>
                      <Text className="text-xs font-dm-sans-medium capitalize" style={{ color }}>{spray.type}</Text>
                    </View>
                    {spray.phi > 0 && (
                      <View className="bg-yellow-50 rounded-lg px-2 py-1">
                        <Text className="text-yellow-700 text-xs font-dm-sans-medium">PHI: {spray.phi} days</Text>
                      </View>
                    )}
                  </View>

                  {spray.notes && (
                    <View className="bg-background-100 rounded-lg p-2 mt-2">
                      <Text className="text-typography-500 text-xs">{"\ud83d\udcdd"} {spray.notes}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {activeTab === "weather-window" && (
          <View className="px-5">
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
              <Text className="text-green-800 font-dm-sans-bold text-sm mb-1">{"\u2705"} Best Spray Windows (Next 7 Days)</Text>
              <Text className="text-green-600 text-xs">Based on wind, rain, temperature, and humidity forecast</Text>
            </View>

            {[
              { day: "Thu, Apr 3", time: "6:00-10:00 AM", wind: "8 km/h", rain: "0%", temp: "25-29\u00b0C", humidity: "65-72%", rating: "Excellent", color: "#22c55e" },
              { day: "Thu, Apr 3", time: "4:00-6:30 PM", wind: "10 km/h", rain: "0%", temp: "30-33\u00b0C", humidity: "55-62%", rating: "Good", color: "#84cc16" },
              { day: "Fri, Apr 4", time: "6:00-9:00 AM", wind: "6 km/h", rain: "5%", temp: "22-27\u00b0C", humidity: "68-75%", rating: "Excellent", color: "#22c55e" },
              { day: "Fri, Apr 4", time: "4:00-6:00 PM", wind: "12 km/h", rain: "15%", temp: "28-31\u00b0C", humidity: "58-65%", rating: "Good", color: "#84cc16" },
              { day: "Sat, Apr 5", time: "All Day", wind: "18+ km/h", rain: "85%", temp: "24-28\u00b0C", humidity: "85-95%", rating: "Not Suitable", color: "#ef4444" },
              { day: "Sun, Apr 6", time: "All Day", wind: "15+ km/h", rain: "90%", temp: "22-27\u00b0C", humidity: "90-98%", rating: "Not Suitable", color: "#ef4444" },
              { day: "Mon, Apr 7", time: "7:00-11:00 AM", wind: "10 km/h", rain: "20%", temp: "26-30\u00b0C", humidity: "70-78%", rating: "Fair", color: "#f59e0b" },
              { day: "Tue, Apr 8", time: "6:00-10:00 AM", wind: "5 km/h", rain: "5%", temp: "24-28\u00b0C", humidity: "62-70%", rating: "Excellent", color: "#22c55e" },
            ].map((window, i) => (
              <View key={i} className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100 flex-row items-center">
                <View className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: window.color }} />
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-typography-900 text-xs font-dm-sans-bold">{window.day}</Text>
                    <Text className="text-xs font-dm-sans-bold" style={{ color: window.color }}>{window.rating}</Text>
                  </View>
                  <Text className="text-typography-500 text-xs">{window.time}</Text>
                  <Text className="text-typography-400 text-xs">
                    {"\ud83d\udca8"}{window.wind} \u2022 {"\ud83c\udf27\ufe0f"}{window.rain} \u2022 {"\ud83c\udf21\ufe0f"}{window.temp} \u2022 {"\ud83d\udca7"}{window.humidity}
                  </Text>
                </View>
              </View>
            ))}

            <View className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 mt-2">
              <Text className="text-yellow-800 font-dm-sans-bold text-sm mb-1">{"\u26a0\ufe0f"} Spray Rules</Text>
              {[
                "Wind speed must be < 15 km/h for ground sprayer, < 12 km/h for drone",
                "No rain expected for at least 4 hours after application",
                "Avoid spraying when temperature > 35\u00b0C (evaporation loss)",
                "Best: Early morning (6-10 AM) or late evening (4-6:30 PM)",
                "Humidity 50-80% ideal for absorption; >90% causes dilution",
              ].map((rule, i) => (
                <Text key={i} className="text-yellow-700 text-xs leading-5">{"\u2022"} {rule}</Text>
              ))}
            </View>
          </View>
        )}

        {activeTab === "phi" && (
          <View className="px-5">
            <View className="bg-red-50 rounded-2xl p-4 border border-red-200 mb-4">
              <Text className="text-red-800 font-dm-sans-bold text-sm">{"\u23f0"} Pre-Harvest Interval (PHI) Tracker</Text>
              <Text className="text-red-600 text-xs mt-1">
                Minimum days between last spray and harvest for food safety compliance
              </Text>
            </View>

            {/* Fields approaching harvest */}
            {[
              {
                field: "West Orchard - Grapes", harvestDate: "Apr 5-15",
                lastSpray: "Sulphur 80% WP", sprayDate: "Mar 20", phi: 7, phiComplete: true,
                safeDate: "Mar 27", daysRemaining: 0, color: "#22c55e",
              },
              {
                field: "North Block - Wheat", harvestDate: "Apr 18-22",
                lastSpray: "Propiconazole 25% EC", sprayDate: "Scheduled Apr 6", phi: 21, phiComplete: false,
                safeDate: "Apr 27", daysRemaining: 21, color: "#ef4444",
                warning: "If applied Apr 6, safe harvest only after Apr 27. Conflicts with Apr 18-22 harvest!",
              },
              {
                field: "South Block - Tomato", harvestDate: "May 10-Jun 15",
                lastSpray: "Mancozeb 75% WP", sprayDate: "Scheduled Apr 4", phi: 15, phiComplete: false,
                safeDate: "Apr 19", daysRemaining: 15, color: "#22c55e",
                warning: null,
              },
              {
                field: "Central Block - Onion", harvestDate: "May 8-12",
                lastSpray: "Fipronil 5% SC", sprayDate: "Scheduled Apr 3", phi: 14, phiComplete: false,
                safeDate: "Apr 17", daysRemaining: 14, color: "#22c55e",
                warning: null,
              },
            ].map((item, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.field}</Text>
                  <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: item.color + "15" }}>
                    <Text className="text-xs font-dm-sans-bold" style={{ color: item.color }}>
                      {item.phiComplete ? "\u2705 PHI Clear" : `${item.daysRemaining}d remaining`}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2 mb-2">
                  {[
                    { label: "Last Spray", value: item.lastSpray },
                    { label: "Spray Date", value: item.sprayDate },
                    { label: "PHI", value: `${item.phi} days` },
                    { label: "Safe After", value: item.safeDate },
                  ].map((m, j) => (
                    <View key={j} className="flex-1 bg-background-100 rounded-lg p-1.5">
                      <Text className="text-typography-400" style={{ fontSize: 8 }}>{m.label}</Text>
                      <Text className="text-typography-800 text-xs font-dm-sans-medium" numberOfLines={1}>{m.value}</Text>
                    </View>
                  ))}
                </View>

                <Text className="text-typography-500 text-xs">Harvest window: {item.harvestDate}</Text>

                {item.warning && (
                  <View className="bg-red-50 rounded-lg p-2 mt-2">
                    <Text className="text-red-700 text-xs">{"\u26a0\ufe0f"} {item.warning}</Text>
                  </View>
                )}
              </View>
            ))}

            {/* PHI Reference */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mt-2">
              <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">Common PHI Reference</Text>
              {[
                { chemical: "Mancozeb 75% WP", phi: "15 days", crops: "Tomato, Potato, Grape" },
                { chemical: "Chlorothalonil 75% WP", phi: "7 days", crops: "Tomato, Onion" },
                { chemical: "Propiconazole 25% EC", phi: "21 days", crops: "Wheat, Rice" },
                { chemical: "Fipronil 5% SC", phi: "14 days", crops: "Onion, Chilli" },
                { chemical: "Emamectin Benzoate 5% SG", phi: "7 days", crops: "Vegetables, Cereals" },
                { chemical: "Neem Oil / Bio-agents", phi: "0 days", crops: "All crops (no PHI)" },
                { chemical: "Sulphur 80% WP", phi: "7 days", crops: "Grape, Mango, Vegetables" },
                { chemical: "Bispyribac Sodium 10% SC", phi: "45 days", crops: "Rice" },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center py-2" style={i < 7 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <Text className="text-typography-800 text-xs font-dm-sans-medium flex-1">{item.chemical}</Text>
                  <Text className="text-blue-600 text-xs font-dm-sans-bold w-16 text-center">{item.phi}</Text>
                  <Text className="text-typography-400 text-xs w-24 text-right" numberOfLines={1}>{item.crops}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "log" && (
          <View className="px-5">
            <Text className="text-typography-700 font-dm-sans-bold text-sm mb-2">Spray History</Text>
            {completed.map((spray) => {
              const color = typeColors[spray.type];
              return (
                <View key={spray.id} className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100 flex-row items-center">
                  <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: color + "15" }}>
                    <Text style={{ fontSize: 14 }}>{typeIcons[spray.type]}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-900 text-xs font-dm-sans-bold">{spray.chemical}</Text>
                    <Text className="text-typography-500 text-xs">{spray.field} \u2022 {spray.crop} \u2022 {spray.dosage}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-green-600 text-xs">{"\u2713"} Done</Text>
                    <Text className="text-typography-400 text-xs">
                      {new Date(spray.lastSprayDate!).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
