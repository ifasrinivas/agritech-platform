import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fields } from "@/data/agritech";

type BoundaryTab = "measure" | "fields" | "survey" | "legal";

export default function BoundaryToolScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BoundaryTab>("measure");
  const [measuring, setMeasuring] = useState(false);
  const [points, setPoints] = useState(0);

  const totalArea = fields.reduce((s, f) => s + f.area, 0);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\udccf"} Boundary & Measurement</Text>
          <Text className="text-typography-400 text-xs">GPS measurement, area & survey tools</Text>
        </View>
      </View>

      <View className="flex-row mx-5 mt-3 mb-3 bg-background-100 rounded-xl p-1">
        {(["measure", "fields", "survey", "legal"] as BoundaryTab[]).map((t) => (
          <Pressable key={t} className="flex-1 items-center py-2 rounded-lg" style={activeTab === t ? { backgroundColor: "#16a34a" } : {}} onPress={() => setActiveTab(t)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === t ? "text-white" : "text-typography-500"}`}>
              {t === "measure" ? "\ud83d\udccd GPS" : t === "fields" ? "\ud83d\uddfa\ufe0f Fields" : t === "survey" ? "\ud83d\udccf Survey" : "\ud83d\udcdc Legal"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "measure" && (
          <View className="px-5">
            {/* GPS Measurement Tool */}
            <View className="bg-green-900 rounded-2xl h-72 mb-4 items-center justify-center relative overflow-hidden">
              {/* Grid */}
              <View className="absolute inset-0 opacity-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <View key={i} className="h-px bg-white" style={{ marginTop: 34 }} />
                ))}
              </View>

              {/* GPS marker points */}
              {measuring && points > 0 && (
                <>
                  {Array.from({ length: Math.min(points, 6) }).map((_, i) => {
                    const positions = [
                      { top: "20%", left: "15%" }, { top: "15%", left: "75%" },
                      { top: "50%", left: "85%" }, { top: "80%", left: "70%" },
                      { top: "85%", left: "25%" }, { top: "45%", left: "10%" },
                    ];
                    const pos = positions[i];
                    return (
                      <View key={i} className="absolute" style={{ top: pos.top as any, left: pos.left as any }}>
                        <View className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-white" />
                        <Text className="text-white text-xs font-dm-sans-bold mt-0.5 ml-5">P{i + 1}</Text>
                      </View>
                    );
                  })}
                  {/* Lines between points */}
                  <View className="absolute inset-0">
                    <View className="absolute border border-yellow-400 border-dashed" style={{ top: "20%", left: "15%", right: "20%", bottom: "15%", borderRadius: 8 } as any} />
                  </View>
                </>
              )}

              {!measuring ? (
                <View className="items-center">
                  <Text style={{ fontSize: 48 }}>{"\ud83d\udccd"}</Text>
                  <Text className="text-white font-dm-sans-bold text-base mt-3">GPS Area Measurement</Text>
                  <Text className="text-white/60 text-xs mt-1">Walk around your field boundary to measure area</Text>
                  <Pressable
                    onPress={() => { setMeasuring(true); setPoints(0); }}
                    className="bg-green-500 rounded-xl px-6 py-3 mt-4"
                  >
                    <Text className="text-white font-dm-sans-bold text-sm">{"\ud83d\udccd"} Start Measurement</Text>
                  </Pressable>
                </View>
              ) : (
                <View className="items-center">
                  <Text className="text-white font-dm-sans-bold text-lg">{points} Points Marked</Text>
                  {points >= 3 && (
                    <Text className="text-green-400 text-sm font-dm-sans-bold mt-1">
                      Area: {(3.2 + points * 0.8).toFixed(1)} acres
                    </Text>
                  )}
                  <Text className="text-white/60 text-xs mt-1">
                    {points < 3 ? `Need ${3 - points} more points (min 3)` : "Tap Drop Pin or close polygon"}
                  </Text>
                  <View className="flex-row gap-3 mt-4">
                    <Pressable
                      onPress={() => setPoints(points + 1)}
                      className="bg-yellow-400 rounded-xl px-5 py-2.5"
                    >
                      <Text className="text-black font-dm-sans-bold text-sm">{"\ud83d\udccd"} Drop Pin</Text>
                    </Pressable>
                    {points >= 3 && (
                      <Pressable
                        onPress={() => setMeasuring(false)}
                        className="bg-green-500 rounded-xl px-5 py-2.5"
                      >
                        <Text className="text-white font-dm-sans-bold text-sm">{"\u2713"} Close & Save</Text>
                      </Pressable>
                    )}
                    <Pressable
                      onPress={() => { setMeasuring(false); setPoints(0); }}
                      className="bg-red-500/30 rounded-xl px-5 py-2.5"
                    >
                      <Text className="text-red-200 font-dm-sans-bold text-sm">Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* GPS accuracy */}
              <View className="absolute bottom-3 left-3 bg-black/50 rounded-lg px-2 py-1 flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-green-400 mr-1" />
                <Text className="text-white text-xs">GPS: \u00b12.5m accuracy</Text>
              </View>
            </View>

            {/* Measurement Modes */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Measurement Tools</Text>
            <View className="flex-row flex-wrap gap-3">
              {[
                { label: "Walk & Measure\n(GPS Track)", icon: "\ud83d\udeb6", desc: "Walk the boundary with phone. Auto-records GPS path.", color: "#22c55e" },
                { label: "Drop Pins\n(Manual)", icon: "\ud83d\udccd", desc: "Stand at each corner and tap to drop a pin.", color: "#3b82f6" },
                { label: "Satellite Draw\n(On Image)", icon: "\ud83d\udef0\ufe0f", desc: "Draw boundary on satellite imagery.", color: "#8b5cf6" },
                { label: "Distance\nMeasure", icon: "\ud83d\udccf", desc: "Point-to-point distance between two locations.", color: "#f59e0b" },
                { label: "Perimeter\nCalculation", icon: "\u2b55", desc: "Auto-calculated from boundary measurement.", color: "#06b6d4" },
                { label: "Import\nKML/KMZ", icon: "\ud83d\udcc1", desc: "Import boundaries from Google Earth or survey files.", color: "#6b7280" },
              ].map((tool, i) => (
                <Pressable key={i} style={{ width: "31%" }}>
                  <View className="rounded-2xl p-3 items-center" style={{ backgroundColor: tool.color + "10", borderWidth: 1, borderColor: tool.color + "20", minHeight: 100 }}>
                    <Text style={{ fontSize: 24 }}>{tool.icon}</Text>
                    <Text className="text-xs font-dm-sans-medium text-center mt-1" style={{ color: tool.color }}>{tool.label}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {activeTab === "fields" && (
          <View className="px-5">
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-blue-800 font-dm-sans-bold text-sm">Total Farm Area</Text>
                <Text className="text-blue-800 text-xl font-dm-sans-bold">{totalArea} acres</Text>
              </View>
              <Text className="text-blue-600 text-xs mt-1">{(totalArea * 0.4047).toFixed(1)} hectares \u2022 {(totalArea * 4047).toFixed(0)} sq.m \u2022 {fields.length} fields</Text>
            </View>

            {fields.map((field) => (
              <View key={field.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-typography-900 font-dm-sans-bold text-sm">{field.name}</Text>
                  <Text className="text-green-600 font-dm-sans-bold text-sm">{field.area} acres</Text>
                </View>
                <View className="flex-row gap-2">
                  {[
                    { label: "Hectares", value: (field.area * 0.4047).toFixed(2) },
                    { label: "Sq. Meters", value: (field.area * 4047).toFixed(0) },
                    { label: "Guntha", value: (field.area * 40).toFixed(0) },
                    { label: "Coordinates", value: `${field.location.latitude.toFixed(3)}\u00b0N` },
                  ].map((m, i) => (
                    <View key={i} className="flex-1 bg-background-100 rounded-lg p-1.5 items-center">
                      <Text className="text-typography-800 text-xs font-dm-sans-bold">{m.value}</Text>
                      <Text className="text-typography-400" style={{ fontSize: 8 }}>{m.label}</Text>
                    </View>
                  ))}
                </View>
                <Text className="text-typography-400 text-xs mt-2">
                  Boundary: {field.coordinates.length} GPS points \u2022 Soil: {field.soilType}
                </Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "survey" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Land Survey Records</Text>
            {[
              { number: "121/1", area: "5.2 ha (12.8 ac)", owner: "Rajesh Kumar", type: "Irrigated Agri", location: "Gangapur Road", revenue: "\u20b92,400/yr", icon: "\ud83d\udcc4" },
              { number: "121/2", area: "3.8 ha (9.4 ac)", owner: "Rajesh Kumar", type: "Irrigated Agri", location: "Gangapur Road", revenue: "\u20b91,800/yr", icon: "\ud83d\udcc4" },
              { number: "122/3", area: "4.5 ha (11.1 ac)", owner: "Rajesh Kumar", type: "Irrigated Agri", location: "Adjacent to canal", revenue: "\u20b92,100/yr", icon: "\ud83d\udcc4" },
              { number: "123/1", area: "4.9 ha (12.1 ac)", owner: "Rajesh Kumar", type: "Irrigated + Greenhouse", location: "South side", revenue: "\u20b92,300/yr", icon: "\ud83d\udcc4" },
            ].map((survey, i) => (
              <View key={i} className="bg-background-50 rounded-xl p-4 mb-2 border border-outline-100">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-typography-900 font-dm-sans-bold text-sm">Survey No: {survey.number}</Text>
                  <Text className="text-green-600 text-xs font-dm-sans-bold">{survey.area}</Text>
                </View>
                {[
                  { label: "Owner", value: survey.owner },
                  { label: "Land Type", value: survey.type },
                  { label: "Location", value: survey.location },
                  { label: "Revenue Assessment", value: survey.revenue },
                ].map((item, j) => (
                  <View key={j} className="flex-row justify-between py-1" style={j < 3 ? { borderBottomWidth: 1, borderBottomColor: "#f9fafb" } : {}}>
                    <Text className="text-typography-500 text-xs">{item.label}</Text>
                    <Text className="text-typography-700 text-xs font-dm-sans-medium">{item.value}</Text>
                  </View>
                ))}
              </View>
            ))}

            <View className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 mt-2">
              <Text className="text-yellow-800 font-dm-sans-bold text-sm mb-1">{"\ud83d\udccc"} Digital Survey Integration</Text>
              <Text className="text-yellow-700 text-xs leading-5">
                {"\u2022"} GPS boundaries mapped with \u00b12.5m accuracy{"\n"}
                {"\u2022"} Satellite imagery cross-referenced with revenue records{"\n"}
                {"\u2022"} Digital 7/12 extract linked (Maharashtra specific){"\n"}
                {"\u2022"} Boundaries exportable as KML for govt portals
              </Text>
            </View>
          </View>
        )}

        {activeTab === "legal" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Land Documents</Text>
            {[
              { name: "7/12 Extract (Satbara Utara)", status: "Linked", date: "Updated Jan 2026", desc: "Revenue record showing ownership and crop details", icon: "\ud83d\udcc4" },
              { name: "8A Extract (Khata)", status: "Linked", date: "Updated Jan 2026", desc: "Mutation register showing land ownership", icon: "\ud83d\udcc4" },
              { name: "Property Card", status: "Available", date: "2023", desc: "Urban land record (if applicable)", icon: "\ud83d\udcc3" },
              { name: "Ferfar (Mutation)", status: "Complete", date: "2023", desc: "Last mutation: Inheritance from father", icon: "\ud83d\udcdc" },
              { name: "No Objection Certificate", status: "Available", date: "2022", desc: "NOC for borewell and greenhouse", icon: "\u2705" },
              { name: "Tax Receipt (Land Revenue)", status: "Paid", date: "2025-26", desc: "Annual land revenue tax paid", icon: "\ud83d\udcb0" },
            ].map((doc, i) => (
              <View key={i} className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100 flex-row items-center">
                <Text style={{ fontSize: 18 }}>{doc.icon}</Text>
                <View className="flex-1 ml-3">
                  <Text className="text-typography-900 text-xs font-dm-sans-bold">{doc.name}</Text>
                  <Text className="text-typography-500 text-xs">{doc.desc}</Text>
                  <Text className="text-typography-400 text-xs">{doc.date}</Text>
                </View>
                <View className="bg-green-50 rounded-full px-2 py-0.5">
                  <Text className="text-green-700 text-xs font-dm-sans-medium">{doc.status}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
