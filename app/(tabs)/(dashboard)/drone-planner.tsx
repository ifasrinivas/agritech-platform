import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fields } from "@/data/agritech";

type DroneTab = "missions" | "plan" | "history" | "providers";

interface DroneMission {
  id: string;
  type: "survey" | "spray" | "mapping" | "monitoring";
  field: string;
  date: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  altitude: number;
  coverage: number;
  duration: string;
  purpose: string;
  icon: string;
  color: string;
}

const missions: DroneMission[] = [
  { id: "d1", type: "spray", field: "South Block - Tomato", date: "2026-04-04", status: "scheduled", altitude: 3, coverage: 8, duration: "45 min", purpose: "Mancozeb spray for Late Blight prevention", icon: "\ud83d\udca8", color: "#ef4444" },
  { id: "d2", type: "survey", field: "All Fields", date: "2026-04-06", status: "scheduled", altitude: 80, coverage: 45.5, duration: "1.5 hrs", purpose: "Weekly NDVI survey & multispectral imaging", icon: "\ud83d\udef0\ufe0f", color: "#8b5cf6" },
  { id: "d3", type: "monitoring", field: "Central Block - Onion", date: "2026-04-03", status: "scheduled", altitude: 20, coverage: 5, duration: "20 min", purpose: "Nitrogen deficiency verification & thrips damage assessment", icon: "\ud83d\udd0d", color: "#f59e0b" },
  { id: "d4", type: "mapping", field: "All Fields", date: "2026-03-25", status: "completed", altitude: 100, coverage: 45.5, duration: "2 hrs", purpose: "3D terrain mapping for contour analysis", icon: "\ud83d\uddfa\ufe0f", color: "#22c55e" },
  { id: "d5", type: "spray", field: "North Block - Wheat", date: "2026-03-20", status: "completed", altitude: 3, coverage: 12.5, duration: "55 min", purpose: "Propiconazole spray for rust prevention", icon: "\ud83d\udca8", color: "#ef4444" },
  { id: "d6", type: "survey", field: "West Orchard - Grapes", date: "2026-03-22", status: "completed", altitude: 50, coverage: 6, duration: "30 min", purpose: "Pre-harvest canopy assessment & fruit load estimation", icon: "\ud83d\udef0\ufe0f", color: "#8b5cf6" },
];

export default function DronePlannerScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DroneTab>("missions");

  const scheduled = missions.filter((m) => m.status === "scheduled");
  const completed = missions.filter((m) => m.status === "completed");

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\ude81"} Drone Operations</Text>
          <Text className="text-typography-400 text-xs">Survey, spray & monitoring missions</Text>
        </View>
        <Pressable className="bg-green-500 rounded-lg px-3 py-1.5">
          <Text className="text-white text-xs font-dm-sans-bold">+ Mission</Text>
        </Pressable>
      </View>

      <View className="flex-row mx-5 mt-3 mb-3 bg-background-100 rounded-xl p-1">
        {(["missions", "plan", "history", "providers"] as DroneTab[]).map((t) => (
          <Pressable key={t} className="flex-1 items-center py-2 rounded-lg" style={activeTab === t ? { backgroundColor: "#16a34a" } : {}} onPress={() => setActiveTab(t)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === t ? "text-white" : "text-typography-500"}`}>
              {t === "missions" ? "\ud83d\ude80 Active" : t === "plan" ? "\ud83d\uddfa\ufe0f Plan" : t === "history" ? "\ud83d\udccb Log" : "\ud83d\udc65 Providers"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "missions" && (
          <View className="px-5">
            {/* Status Summary */}
            <View className="flex-row gap-2 mb-4">
              {[
                { label: "Scheduled", count: scheduled.length, color: "#3b82f6", icon: "\ud83d\udcc5" },
                { label: "Completed", count: completed.length, color: "#22c55e", icon: "\u2705" },
                { label: "Total Area", count: `${missions.reduce((s, m) => s + m.coverage, 0).toFixed(0)}ac`, color: "#8b5cf6", icon: "\ud83d\uddfa\ufe0f" },
              ].map((item, i) => (
                <View key={i} className="flex-1 rounded-xl p-3 items-center" style={{ backgroundColor: item.color + "10" }}>
                  <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                  <Text className="font-dm-sans-bold text-lg" style={{ color: item.color }}>{item.count}</Text>
                  <Text className="text-typography-400 text-xs">{item.label}</Text>
                </View>
              ))}
            </View>

            <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">Upcoming Missions</Text>
            {scheduled.map((mission) => (
              <View key={mission.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: mission.color + "15" }}>
                      <Text style={{ fontSize: 20 }}>{mission.icon}</Text>
                    </View>
                    <View className="ml-3">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm capitalize">{mission.type} Mission</Text>
                      <Text className="text-typography-400 text-xs">{mission.field}</Text>
                    </View>
                  </View>
                  <View className="bg-blue-50 rounded-full px-2 py-0.5">
                    <Text className="text-blue-700 text-xs font-dm-sans-bold">{new Date(mission.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</Text>
                  </View>
                </View>

                <Text className="text-typography-600 text-xs mb-2">{mission.purpose}</Text>

                <View className="flex-row gap-2">
                  {[
                    { label: "Altitude", value: `${mission.altitude}m` },
                    { label: "Coverage", value: `${mission.coverage}ac` },
                    { label: "Duration", value: mission.duration },
                  ].map((m, i) => (
                    <View key={i} className="flex-1 bg-background-100 rounded-lg p-2 items-center">
                      <Text className="text-typography-800 text-xs font-dm-sans-bold">{m.value}</Text>
                      <Text className="text-typography-400" style={{ fontSize: 9 }}>{m.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "plan" && (
          <View className="px-5">
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-4">
              <Text className="text-blue-800 font-dm-sans-bold text-sm">Flight Path Designer</Text>
              <Text className="text-blue-600 text-xs mt-1">Configure waypoints, altitude, and overlap for optimal coverage</Text>
            </View>

            {/* Map simulation */}
            <View className="bg-green-900 rounded-2xl h-64 mb-4 items-center justify-center relative overflow-hidden">
              {/* Grid */}
              <View className="absolute inset-0 opacity-10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <View key={i} className="h-px bg-white" style={{ marginTop: 42 }} />
                ))}
              </View>

              {/* Flight path lines */}
              {[20, 35, 50, 65, 80].map((top, i) => (
                <View key={i} className="absolute" style={{ top: `${top}%`, left: "10%", right: "10%", height: 2, backgroundColor: "#3b82f680" }}>
                  <View className="absolute right-0 top-[-3] w-2 h-2 rounded-full bg-blue-400" />
                </View>
              ))}

              {/* Waypoints */}
              {[
                { top: "15%", left: "10%" },
                { top: "15%", left: "85%" },
                { top: "85%", left: "85%" },
                { top: "85%", left: "10%" },
              ].map((pos, i) => (
                <View key={i} className="absolute w-4 h-4 rounded-full bg-yellow-400 border-2 border-white" style={{ top: pos.top as any, left: pos.left as any }} />
              ))}

              <View className="absolute bottom-3 left-3 bg-black/50 rounded-lg px-2 py-1">
                <Text className="text-white text-xs">Lawn-mower pattern \u2022 80% overlap</Text>
              </View>
              <View className="absolute top-3 right-3 bg-black/50 rounded-lg px-2 py-1">
                <Text className="text-white text-xs">{"\ud83d\ude81"} DJI Agras T30</Text>
              </View>
            </View>

            {/* Flight Parameters */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-sm mb-3">Flight Parameters</Text>
              {[
                { param: "Flight Pattern", value: "Lawn-mower (Boustrophedon)", icon: "\u2194\ufe0f" },
                { param: "Altitude (Survey)", value: "80m AGL", icon: "\u2195\ufe0f" },
                { param: "Altitude (Spray)", value: "2-3m AGL", icon: "\u2b07\ufe0f" },
                { param: "Forward Overlap", value: "80%", icon: "\ud83d\udcf7" },
                { param: "Side Overlap", value: "70%", icon: "\ud83d\udcf7" },
                { param: "Speed (Survey)", value: "5 m/s", icon: "\ud83d\udca8" },
                { param: "Speed (Spray)", value: "3 m/s", icon: "\ud83d\udca8" },
                { param: "Spray Rate", value: "10 L/acre", icon: "\ud83d\udca7" },
                { param: "GSD (at 80m)", value: "2.1 cm/pixel", icon: "\ud83d\udd0d" },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center justify-between py-2" style={i < 8 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 14 }}>{item.icon}</Text>
                    <Text className="text-typography-700 text-xs font-dm-sans-regular ml-2">{item.param}</Text>
                  </View>
                  <Text className="text-typography-900 text-xs font-dm-sans-bold">{item.value}</Text>
                </View>
              ))}
            </View>

            {/* Safety Checklist */}
            <View className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
              <Text className="text-yellow-800 font-dm-sans-bold text-sm mb-2">{"\u2611\ufe0f"} Pre-flight Checklist</Text>
              {[
                "Wind speed < 15 km/h (currently 12 km/h \u2705)",
                "No rain in next 4 hours \u2705",
                "Battery charged > 80%",
                "Propellers inspected, no cracks",
                "Spray tank filled & nozzles clean",
                "Notify nearby fields before spray mission",
                "RTK GPS base station calibrated",
                "Emergency landing zones identified",
              ].map((item, i) => (
                <Text key={i} className="text-yellow-700 text-xs leading-5">{"\u2022"} {item}</Text>
              ))}
            </View>
          </View>
        )}

        {activeTab === "history" && (
          <View className="px-5">
            {completed.map((mission) => (
              <View key={mission.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 20 }}>{mission.icon}</Text>
                    <View className="ml-3">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm capitalize">{mission.type}</Text>
                      <Text className="text-typography-400 text-xs">{mission.field}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-green-600 text-xs font-dm-sans-bold mr-1">{"\u2713"}</Text>
                    <Text className="text-typography-400 text-xs">{new Date(mission.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</Text>
                  </View>
                </View>
                <Text className="text-typography-600 text-xs">{mission.purpose}</Text>
                <View className="flex-row gap-2 mt-2">
                  <Text className="text-typography-400 text-xs">{mission.coverage}ac</Text>
                  <Text className="text-typography-300">\u2022</Text>
                  <Text className="text-typography-400 text-xs">{mission.duration}</Text>
                  <Text className="text-typography-300">\u2022</Text>
                  <Text className="text-typography-400 text-xs">{mission.altitude}m altitude</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "providers" && (
          <View className="px-5">
            {[
              { name: "AgroWing Drones", rating: 4.8, price: "\u20b9600/acre", drone: "DJI Agras T30", services: "Spray + Survey", distance: "5 km", avatar: "\ud83d\ude81" },
              { name: "SkyFarm Technologies", rating: 4.7, price: "\u20b9500/acre", drone: "DJI Phantom 4 RTK", services: "Survey + Mapping", distance: "12 km", avatar: "\ud83d\udef0\ufe0f" },
              { name: "DroneKrishi Services", rating: 4.5, price: "\u20b9550/acre", drone: "Custom Hexacopter", services: "Spray only", distance: "8 km", avatar: "\ud83d\udca8" },
              { name: "AgriAir Innovations", rating: 4.9, price: "\u20b9800/acre", drone: "DJI Matrice 300 + T30", services: "Full stack (Survey, Spray, 3D)", distance: "20 km", avatar: "\u2b50" },
            ].map((provider, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 rounded-xl bg-background-100 items-center justify-center">
                    <Text style={{ fontSize: 24 }}>{provider.avatar}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{provider.name}</Text>
                    <Text className="text-typography-500 text-xs">{provider.drone} \u2022 {provider.distance} away</Text>
                    <Text className="text-typography-600 text-xs mt-1">{provider.services}</Text>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-yellow-500 text-xs">{"\u2b50"} {provider.rating}</Text>
                      <Text className="text-typography-900 font-dm-sans-bold text-sm ml-auto">{provider.price}</Text>
                    </View>
                  </View>
                </View>
                <Pressable className="bg-purple-500 rounded-xl py-2.5 items-center mt-3">
                  <Text className="text-white text-xs font-dm-sans-bold">Book Service</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
