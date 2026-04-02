import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { fields, soilDataByField, getNDVIColor, getFieldHealthColor } from "@/data/agritech";
import FieldCard from "@/components/screens/agritech/field-card";
import SoilGauge from "@/components/screens/agritech/soil-gauge";
import { COLORS, GRADIENTS, RADIUS, SHADOWS } from "@/components/screens/agritech/premium/theme";
import { Map, Plus } from "lucide-react-native";

type ViewMode = "list" | "map" | "contour";

export default function FieldsScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const selectedField = fields.find((f) => f.id === selectedFieldId);
  const selectedSoil = selectedFieldId ? soilDataByField[selectedFieldId] : null;
  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface.raised }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10, backgroundColor: COLORS.surface.base, borderBottomWidth: 1, borderBottomColor: COLORS.surface.borderLight }}>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Map size={20} color={COLORS.primary.from} />
            <Text style={{ color: COLORS.text.primary, fontSize: 20, fontFamily: "dm-sans-bold", letterSpacing: -0.3 }}>My Fields</Text>
          </View>
          <Text style={{ color: COLORS.text.muted, fontSize: 12, marginTop: 2 }}>
            {fields.length} fields \u2022 {fields.reduce((s, f) => s + f.area, 0)} acres total
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/(tabs)/(dashboard)/add-field" as any)}
          style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: COLORS.primary.from, borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 8, ...SHADOWS.glow }}
        >
          <Plus size={14} color="#fff" strokeWidth={2.5} />
          <Text style={{ color: "#fff", fontSize: 12, fontFamily: "dm-sans-bold" }}>Add Field</Text>
        </Pressable>
      </View>

      {/* View Mode Tabs */}
      <View className="flex-row mx-5 mb-4 bg-background-100 rounded-xl p-1">
        {(["list", "map", "contour"] as ViewMode[]).map((mode) => (
          <Pressable
            key={mode}
            className="flex-1 items-center py-2 rounded-lg"
            style={viewMode === mode ? { backgroundColor: "#16a34a" } : {}}
            onPress={() => setViewMode(mode)}
          >
            <Text
              className={`text-xs font-dm-sans-medium capitalize ${
                viewMode === mode ? "text-white" : "text-typography-500"
              }`}
            >
              {mode === "list" ? "\ud83d\udccb List" : mode === "map" ? "\ud83d\uddfa\ufe0f Map" : "\ud83d\udcc0 Contour"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {viewMode === "list" && (
          <View className="px-5">
            {fields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                onPress={() =>
                  router.push({ pathname: "/(tabs)/(dashboard)/field-detail", params: { id: field.id } } as any)
                }
              />
            ))}
          </View>
        )}

        {viewMode === "map" && (
          <View className="px-5">
            {/* Farm Layout Map View */}
            <View className="bg-background-50 rounded-2xl border border-outline-100 overflow-hidden mb-4">
              <View className="p-4">
                <Text className="text-typography-900 font-dm-sans-bold text-base mb-1">
                  Farm Layout - Satellite View
                </Text>
                <Text className="text-typography-400 text-xs font-dm-sans-regular">
                  Tap a field to view details
                </Text>
              </View>

              {/* Simulated farm map */}
              <View className="h-80 bg-green-900 mx-4 mb-4 rounded-xl relative overflow-hidden">
                {/* Grid background */}
                <View className="absolute inset-0 opacity-10">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <View key={`h${i}`} className="h-px bg-white" style={{ marginTop: 40 }} />
                  ))}
                </View>

                {/* Field polygons */}
                {fields.map((field, idx) => {
                  const positions = [
                    { top: 10, left: 10, width: "55%", height: "35%" },
                    { top: 10, left: "60%", width: "35%", height: "35%" },
                    { top: "40%", left: 10, width: "40%", height: "30%" },
                    { top: "40%", left: "45%", width: "30%", height: "30%" },
                    { top: "72%", left: 10, width: "45%", height: "25%" },
                    { top: "72%", left: "50%", width: "45%", height: "25%" },
                  ];
                  const pos = positions[idx] || positions[0];
                  const ndviColor = getNDVIColor(field.ndviScore);

                  return (
                    <Pressable
                      key={field.id}
                      onPress={() => setSelectedFieldId(field.id)}
                      style={{
                        position: "absolute",
                        ...pos as any,
                        backgroundColor: ndviColor + "40",
                        borderWidth: selectedFieldId === field.id ? 3 : 1,
                        borderColor: selectedFieldId === field.id ? "#fff" : ndviColor,
                        borderRadius: 8,
                        padding: 8,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text className="text-white text-xs font-dm-sans-bold text-center" numberOfLines={1}>
                        {field.crop}
                      </Text>
                      <Text className="text-white text-xs opacity-80">{field.area}ac</Text>
                      <View
                        className="rounded-full px-2 py-0.5 mt-1"
                        style={{ backgroundColor: ndviColor }}
                      >
                        <Text className="text-white text-xs font-dm-sans-bold">
                          {field.ndviScore.toFixed(2)}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}

                {/* Compass */}
                <View className="absolute top-2 right-2 bg-black/40 rounded-full w-8 h-8 items-center justify-center">
                  <Text className="text-white text-xs font-dm-sans-bold">N</Text>
                </View>

                {/* Scale bar */}
                <View className="absolute bottom-2 left-2 flex-row items-center">
                  <View className="w-12 h-0.5 bg-white" />
                  <Text className="text-white text-xs ml-1">100m</Text>
                </View>
              </View>

              {/* Legend */}
              <View className="flex-row items-center justify-center pb-4 gap-3">
                {[
                  { label: "Excellent", color: "#15803d" },
                  { label: "Good", color: "#65a30d" },
                  { label: "Moderate", color: "#ca8a04" },
                  { label: "Poor", color: "#ea580c" },
                ].map((item) => (
                  <View key={item.label} className="flex-row items-center">
                    <View className="w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: item.color }} />
                    <Text className="text-typography-400 text-xs">{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Footfall / Activity Heatmap */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-1">
                {"\ud83d\udc63"} Footfall & Activity Heatmap
              </Text>
              <Text className="text-typography-400 text-xs font-dm-sans-regular mb-3">
                Worker activity density over past 7 days
              </Text>
              <View className="h-40 bg-background-200 rounded-xl relative overflow-hidden">
                {/* Heatmap grid */}
                {Array.from({ length: 6 }).map((_, row) =>
                  Array.from({ length: 8 }).map((_, col) => {
                    const intensity = Math.random();
                    return (
                      <View
                        key={`${row}-${col}`}
                        style={{
                          position: "absolute",
                          top: `${row * 16.6}%`,
                          left: `${col * 12.5}%`,
                          width: "12.5%",
                          height: "16.6%",
                          backgroundColor:
                            intensity > 0.7 ? "#ef444480" :
                            intensity > 0.4 ? "#f59e0b60" :
                            intensity > 0.2 ? "#22c55e40" : "#22c55e15",
                          borderWidth: 0.5,
                          borderColor: "#ffffff20",
                        }}
                      />
                    );
                  })
                )}
              </View>
              <View className="flex-row items-center justify-center mt-2 gap-2">
                <Text className="text-typography-400 text-xs">Low</Text>
                {["#22c55e15", "#22c55e40", "#f59e0b60", "#ef444480"].map((c, i) => (
                  <View key={i} className="w-6 h-3 rounded-sm" style={{ backgroundColor: c }} />
                ))}
                <Text className="text-typography-400 text-xs">High</Text>
              </View>
            </View>
          </View>
        )}

        {viewMode === "contour" && (
          <View className="px-5">
            {/* Land Contouring View */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-1">
                {"\ud83c\udf0e"} Land Contouring Analysis
              </Text>
              <Text className="text-typography-400 text-xs font-dm-sans-regular mb-3">
                Topographic elevation mapping for drainage & irrigation planning
              </Text>

              {/* Simulated contour map */}
              <View className="h-64 bg-background-200 rounded-xl relative overflow-hidden items-center justify-center">
                {/* Concentric contour lines */}
                {[100, 85, 70, 55, 40, 25].map((size, i) => (
                  <View
                    key={i}
                    style={{
                      position: "absolute",
                      width: `${size}%`,
                      height: `${size * 0.7}%`,
                      borderWidth: 1.5,
                      borderColor: [
                        "#15803d",
                        "#22c55e",
                        "#84cc16",
                        "#eab308",
                        "#f59e0b",
                        "#ef4444",
                      ][i],
                      borderRadius: 100,
                      opacity: 0.6,
                    }}
                  />
                ))}
                {/* Elevation labels */}
                <View className="absolute top-4 left-4">
                  <Text className="text-xs font-dm-sans-bold" style={{ color: "#15803d" }}>
                    620m
                  </Text>
                </View>
                <Text className="text-xs font-dm-sans-bold" style={{ color: "#ef4444" }}>
                  645m
                </Text>
                <View className="absolute bottom-4 right-4">
                  <Text className="text-xs font-dm-sans-bold" style={{ color: "#22c55e" }}>
                    625m
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between mt-3">
                <View className="flex-row items-center gap-2">
                  {[
                    { label: "620m", color: "#15803d" },
                    { label: "630m", color: "#84cc16" },
                    { label: "640m", color: "#f59e0b" },
                    { label: "645m", color: "#ef4444" },
                  ].map((item) => (
                    <View key={item.label} className="flex-row items-center">
                      <View className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }} />
                      <Text className="text-typography-400 text-xs">{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Elevation Profile */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-1">
                Elevation Profile
              </Text>
              <Text className="text-typography-400 text-xs font-dm-sans-regular mb-3">
                Cross-section analysis (North to South)
              </Text>
              <View className="h-32 flex-row items-end">
                {[620, 625, 632, 640, 645, 643, 638, 630, 622, 618].map((elev, i) => {
                  const minElev = 615;
                  const maxElev = 650;
                  const height = ((elev - minElev) / (maxElev - minElev)) * 100;
                  return (
                    <View key={i} className="flex-1 items-center">
                      <Text className="text-typography-400 text-xs mb-1" style={{ fontSize: 8 }}>
                        {elev}
                      </Text>
                      <View
                        className="w-full rounded-t-sm mx-0.5"
                        style={{
                          height: `${height}%`,
                          backgroundColor:
                            elev > 640 ? "#f59e0b" :
                            elev > 630 ? "#84cc16" : "#22c55e",
                        }}
                      />
                    </View>
                  );
                })}
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="text-typography-400 text-xs">North</Text>
                <Text className="text-typography-400 text-xs">South</Text>
              </View>
            </View>

            {/* Farm Design Section */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-1">
                {"\ud83d\udcd0"} Farm Design & Layout
              </Text>
              <Text className="text-typography-400 text-xs font-dm-sans-regular mb-3">
                Optimized plot allocation based on soil type & elevation
              </Text>

              {/* Design recommendations */}
              {[
                {
                  zone: "Zone A (Lowland 618-625m)",
                  rec: "Rice Paddy & Water-loving crops",
                  reason: "Natural water collection, alluvial soil",
                  color: "#3b82f6",
                },
                {
                  zone: "Zone B (Midland 625-635m)",
                  rec: "Vegetables, Onion, Tomato",
                  reason: "Well-drained, good soil depth",
                  color: "#22c55e",
                },
                {
                  zone: "Zone C (Highland 635-645m)",
                  rec: "Orchards, Grapes, Fruit trees",
                  reason: "Excellent drainage, wind exposure for disease prevention",
                  color: "#f59e0b",
                },
                {
                  zone: "Buffer Strips",
                  rec: "Vetiver grass, legume hedgerows",
                  reason: "Erosion control, nitrogen fixation, carbon sequestration",
                  color: "#8b5cf6",
                },
              ].map((item, i) => (
                <View
                  key={i}
                  className="rounded-xl p-3 mb-2"
                  style={{ backgroundColor: item.color + "10", borderLeftWidth: 3, borderLeftColor: item.color }}
                >
                  <Text className="font-dm-sans-bold text-sm" style={{ color: item.color }}>
                    {item.zone}
                  </Text>
                  <Text className="text-typography-800 text-xs font-dm-sans-medium mt-0.5">
                    {item.rec}
                  </Text>
                  <Text className="text-typography-500 text-xs font-dm-sans-regular mt-0.5">
                    {item.reason}
                  </Text>
                </View>
              ))}
            </View>

            {/* Drainage Pattern */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-1">
                {"\ud83d\udca7"} Drainage & Water Flow
              </Text>
              <Text className="text-typography-400 text-xs font-dm-sans-regular mb-3">
                Natural water flow patterns and recommended drain placement
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  { label: "Main Drain", value: "N\u2192S, 2% slope", icon: "\u2b07\ufe0f" },
                  { label: "Sub Drains", value: "Every 30m interval", icon: "\u21aa\ufe0f" },
                  { label: "Collection Point", value: "SW corner (618m)", icon: "\ud83d\udca7" },
                  { label: "Bund Height", value: "45cm recommended", icon: "\ud83e\uddf1" },
                ].map((item, i) => (
                  <View key={i} className="bg-blue-50 rounded-xl p-3" style={{ width: "48%" }}>
                    <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                    <Text className="text-typography-800 text-xs font-dm-sans-bold mt-1">
                      {item.label}
                    </Text>
                    <Text className="text-typography-500 text-xs">{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Selected Field Detail */}
        {selectedFieldId && selectedField && selectedSoil && viewMode !== "contour" && (
          <View className="px-5 mt-4">
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-typography-900 font-dm-sans-bold text-base">
                  {selectedField.name}
                </Text>
                <Pressable onPress={() => setSelectedFieldId(null)}>
                  <Text className="text-typography-400 text-lg">{"\u2715"}</Text>
                </Pressable>
              </View>

              <Text className="text-typography-700 font-dm-sans-medium text-sm mb-3">
                Soil Analysis
              </Text>

              <SoilGauge
                label="pH Level"
                value={selectedSoil.pH}
                unit=""
                min={4}
                max={10}
                optimalMin={6.0}
                optimalMax={7.5}
                color="#f59e0b"
              />
              <SoilGauge
                label="Nitrogen (N)"
                value={selectedSoil.nitrogen}
                unit="kg/ha"
                min={0}
                max={500}
                optimalMin={250}
                optimalMax={400}
                color="#3b82f6"
              />
              <SoilGauge
                label="Phosphorus (P)"
                value={selectedSoil.phosphorus}
                unit="kg/ha"
                min={0}
                max={60}
                optimalMin={20}
                optimalMax={45}
                color="#8b5cf6"
              />
              <SoilGauge
                label="Potassium (K)"
                value={selectedSoil.potassium}
                unit="kg/ha"
                min={0}
                max={400}
                optimalMin={150}
                optimalMax={300}
                color="#f97316"
              />
              <SoilGauge
                label="Soil Moisture"
                value={selectedSoil.moisture}
                unit="%"
                min={0}
                max={100}
                optimalMin={30}
                optimalMax={50}
                color="#06b6d4"
              />
              <SoilGauge
                label="Organic Carbon"
                value={selectedSoil.organicCarbon}
                unit="%"
                min={0}
                max={2}
                optimalMin={0.5}
                optimalMax={1.5}
                color="#22c55e"
              />

              {/* Recommendations */}
              <View className="mt-3 pt-3 border-t border-outline-100">
                <Text className="text-typography-700 font-dm-sans-bold text-sm mb-2">
                  {"\ud83d\udca1"} Recommendations
                </Text>
                {selectedSoil.recommendations.map((rec, i) => (
                  <View key={i} className="flex-row mb-1.5">
                    <Text className="text-typography-400 text-xs mr-2">{"\u2022"}</Text>
                    <Text className="text-typography-600 text-xs font-dm-sans-regular flex-1 leading-4">
                      {rec}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
