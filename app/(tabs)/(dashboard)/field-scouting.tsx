import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fields } from "@/data/agritech";

interface ScoutingReport {
  id: string;
  field: string;
  date: string;
  scout: string;
  observations: { category: string; finding: string; severity: "ok" | "watch" | "action"; icon: string }[];
  gpsPoints: number;
  photos: number;
  duration: string;
}

const scoutingReports: ScoutingReport[] = [
  {
    id: "sr1", field: "South Block - Tomato", date: "2026-04-02", scout: "Ramesh Jadhav",
    observations: [
      { category: "Pest", finding: "Whitefly count 3/leaf (below ETL of 10)", severity: "watch", icon: "\ud83d\udc1b" },
      { category: "Disease", finding: "Early Blight on 5% plants, lower leaves only", severity: "action", icon: "\ud83e\uddec" },
      { category: "Growth", finding: "60% plants flowering, good fruit set", severity: "ok", icon: "\ud83c\udf3c" },
      { category: "Soil", finding: "Soil cracking in rows 15-20, moisture low", severity: "action", icon: "\ud83d\udca7" },
      { category: "Weed", finding: "Minimal weeds, last weeding effective", severity: "ok", icon: "\ud83c\udf3f" },
    ],
    gpsPoints: 12, photos: 8, duration: "45 min",
  },
  {
    id: "sr2", field: "Central Block - Onion", date: "2026-04-01", scout: "Ramesh Jadhav",
    observations: [
      { category: "Pest", finding: "Thrips 8/plant - ABOVE ETL of 5. Immediate action needed.", severity: "action", icon: "\ud83d\udc1b" },
      { category: "Disease", finding: "Purple Blotch spots in NE corner, 10% plants affected", severity: "action", icon: "\ud83e\uddec" },
      { category: "Growth", finding: "Bulb initiation stage, neck thickening visible", severity: "ok", icon: "\ud83c\udf31" },
      { category: "Nutrition", finding: "Yellowing lower leaves - N deficiency confirmed", severity: "action", icon: "\ud83e\udea4" },
    ],
    gpsPoints: 8, photos: 6, duration: "30 min",
  },
  {
    id: "sr3", field: "North Block - Wheat", date: "2026-03-30", scout: "Rajesh Kumar",
    observations: [
      { category: "Pest", finding: "No pest observed. Pheromone traps clean.", severity: "ok", icon: "\ud83d\udc1b" },
      { category: "Disease", finding: "No rust/smut. Healthy canopy.", severity: "ok", icon: "\ud83e\uddec" },
      { category: "Growth", finding: "Grain filling stage, uniform ear development", severity: "ok", icon: "\ud83c\udf3e" },
      { category: "Lodging", finding: "No lodging risk. Stem strength good.", severity: "ok", icon: "\ud83d\udca8" },
    ],
    gpsPoints: 10, photos: 4, duration: "25 min",
  },
];

const severityColors = { ok: "#22c55e", watch: "#f59e0b", action: "#ef4444" };
const severityIcons = { ok: "\u2705", watch: "\ud83d\udc41\ufe0f", action: "\u26a0\ufe0f" };

export default function FieldScoutingScreen() {
  const router = useRouter();
  const [selectedField, setSelectedField] = useState("all");

  const filtered = selectedField === "all" ? scoutingReports : scoutingReports.filter((r) => r.field.includes(selectedField));
  const totalActions = scoutingReports.reduce((s, r) => s + r.observations.filter((o) => o.severity === "action").length, 0);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\udeb6"} Field Scouting</Text>
          <Text className="text-typography-400 text-xs">Crop walk reports & observations</Text>
        </View>
        <Pressable className="bg-green-500 rounded-lg px-3 py-1.5">
          <Text className="text-white text-xs font-dm-sans-bold">{"\ud83d\udeb6"} New Walk</Text>
        </Pressable>
      </View>

      {/* Summary */}
      <View className="flex-row mx-5 mt-3 gap-2 mb-3">
        <View className="flex-1 bg-blue-50 rounded-xl p-2.5 items-center border border-blue-200">
          <Text className="text-blue-800 text-lg font-dm-sans-bold">{scoutingReports.length}</Text>
          <Text className="text-blue-600 text-xs">Reports</Text>
        </View>
        <View className="flex-1 bg-red-50 rounded-xl p-2.5 items-center border border-red-200">
          <Text className="text-red-800 text-lg font-dm-sans-bold">{totalActions}</Text>
          <Text className="text-red-600 text-xs">Actions Needed</Text>
        </View>
        <View className="flex-1 bg-green-50 rounded-xl p-2.5 items-center border border-green-200">
          <Text className="text-green-800 text-lg font-dm-sans-bold">{scoutingReports.reduce((s, r) => s + r.gpsPoints, 0)}</Text>
          <Text className="text-green-600 text-xs">GPS Points</Text>
        </View>
        <View className="flex-1 bg-purple-50 rounded-xl p-2.5 items-center border border-purple-200">
          <Text className="text-purple-800 text-lg font-dm-sans-bold">{scoutingReports.reduce((s, r) => s + r.photos, 0)}</Text>
          <Text className="text-purple-600 text-xs">Photos</Text>
        </View>
      </View>

      {/* Field Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-10 mx-5 mb-3">
        {[{ id: "all", name: "All Fields" }, ...fields.map((f) => ({ id: f.crop, name: f.crop }))].map((f) => (
          <Pressable key={f.id} className="rounded-xl px-3 py-2 mr-2" style={selectedField === f.id ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }} onPress={() => setSelectedField(f.id)}>
            <Text className={`text-xs font-dm-sans-medium ${selectedField === f.id ? "text-white" : "text-typography-500"}`}>{f.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="px-5">
          {/* Scouting Protocol */}
          <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-4">
            <Text className="text-blue-800 font-dm-sans-bold text-sm mb-2">{"\ud83d\udccb"} Scouting Protocol (Recommended)</Text>
            <View className="flex-row flex-wrap gap-2">
              {[
                { label: "Frequency", value: "Weekly (active season)", icon: "\ud83d\udcc5" },
                { label: "Pattern", value: "W or zigzag, 20+ points", icon: "\ud83d\uddfa\ufe0f" },
                { label: "Check", value: "Pest, disease, growth, soil, weed", icon: "\ud83d\udd0d" },
                { label: "Document", value: "GPS + photo each observation", icon: "\ud83d\udcf7" },
              ].map((item, i) => (
                <View key={i} className="bg-white rounded-lg p-2" style={{ width: "48%" }}>
                  <Text style={{ fontSize: 12 }}>{item.icon}</Text>
                  <Text className="text-blue-800 text-xs font-dm-sans-bold">{item.label}</Text>
                  <Text className="text-blue-600 text-xs">{item.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Reports */}
          {filtered.map((report) => {
            const actionCount = report.observations.filter((o) => o.severity === "action").length;
            return (
              <View key={report.id} className="bg-background-50 rounded-2xl overflow-hidden mb-4 border border-outline-100">
                {/* Header */}
                <View className="p-4 pb-2">
                  <View className="flex-row items-center justify-between mb-2">
                    <View>
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{report.field}</Text>
                      <Text className="text-typography-400 text-xs">
                        {new Date(report.date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })} \u2022 {report.scout} \u2022 {report.duration}
                      </Text>
                    </View>
                    {actionCount > 0 && (
                      <View className="bg-red-50 rounded-full px-2 py-0.5 border border-red-200">
                        <Text className="text-red-700 text-xs font-dm-sans-bold">{actionCount} actions</Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row gap-2 mb-2">
                    <View className="bg-background-100 rounded-lg px-2 py-1 flex-row items-center">
                      <Text style={{ fontSize: 10 }}>{"\ud83d\udccd"}</Text>
                      <Text className="text-typography-500 text-xs ml-1">{report.gpsPoints} points</Text>
                    </View>
                    <View className="bg-background-100 rounded-lg px-2 py-1 flex-row items-center">
                      <Text style={{ fontSize: 10 }}>{"\ud83d\udcf7"}</Text>
                      <Text className="text-typography-500 text-xs ml-1">{report.photos} photos</Text>
                    </View>
                  </View>
                </View>

                {/* Observations */}
                <View className="px-4 pb-4">
                  {report.observations.map((obs, i) => {
                    const color = severityColors[obs.severity];
                    return (
                      <View
                        key={i}
                        className="flex-row items-start py-2.5"
                        style={i < report.observations.length - 1 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}
                      >
                        <Text style={{ fontSize: 14 }}>{obs.icon}</Text>
                        <View className="flex-1 ml-2">
                          <View className="flex-row items-center">
                            <Text className="text-typography-700 text-xs font-dm-sans-bold">{obs.category}</Text>
                            <Text className="ml-2" style={{ fontSize: 12 }}>{severityIcons[obs.severity]}</Text>
                          </View>
                          <Text className="text-typography-600 text-xs leading-4 mt-0.5">{obs.finding}</Text>
                        </View>
                        <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: color + "15" }}>
                          <Text className="text-xs font-dm-sans-medium capitalize" style={{ color }}>{obs.severity}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
