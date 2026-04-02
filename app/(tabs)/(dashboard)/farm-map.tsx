import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fields, getNDVIColor, getFieldHealthColor } from "@/data/agritech";

type MapLayer = "ndvi" | "health" | "irrigation" | "soil" | "weather" | "boundary";

const layers: { key: MapLayer; label: string; icon: string; color: string }[] = [
  { key: "ndvi", label: "NDVI", icon: "\ud83c\udf3f", color: "#22c55e" },
  { key: "health", label: "Health", icon: "\u2764\ufe0f", color: "#ef4444" },
  { key: "irrigation", label: "Irrigation", icon: "\ud83d\udca7", color: "#3b82f6" },
  { key: "soil", label: "Soil", icon: "\ud83e\udea8", color: "#8b5cf6" },
  { key: "weather", label: "Weather", icon: "\u26c5", color: "#f59e0b" },
  { key: "boundary", label: "Boundary", icon: "\ud83d\udccf", color: "#6b7280" },
];

export default function FarmMapScreen() {
  const router = useRouter();
  const [activeLayer, setActiveLayer] = useState<MapLayer>("ndvi");
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const screenWidth = Dimensions.get("window").width - 40;

  const getFieldOverlayColor = (field: typeof fields[0]) => {
    switch (activeLayer) {
      case "ndvi": return getNDVIColor(field.ndviScore);
      case "health": return getFieldHealthColor(field.healthStatus);
      case "irrigation":
        return field.irrigationType.includes("Drip") ? "#3b82f6" :
          field.irrigationType === "Sprinkler" ? "#06b6d4" :
          field.irrigationType === "Flood" ? "#8b5cf6" : "#f59e0b";
      case "soil":
        return field.soilType.includes("Black") ? "#374151" :
          field.soilType.includes("Red") ? "#dc2626" :
          field.soilType.includes("Alluvial") ? "#ca8a04" :
          field.soilType.includes("Sandy") ? "#f59e0b" : "#22c55e";
      case "weather": return "#3b82f6";
      case "boundary": return "#6b7280";
    }
  };

  const getFieldOverlayValue = (field: typeof fields[0]) => {
    switch (activeLayer) {
      case "ndvi": return field.ndviScore.toFixed(2);
      case "health": return field.healthStatus;
      case "irrigation": return field.irrigationType.split(" ")[0];
      case "soil": return field.soilType.split(" ")[0];
      case "weather": return "32\u00b0C";
      case "boundary": return `${field.area}ac`;
    }
  };

  const selected = fields.find((f) => f.id === selectedField);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\uddfa\ufe0f"} Farm Map</Text>
          <Text className="text-typography-400 text-xs">Interactive field map with overlays</Text>
        </View>
        <Pressable onPress={() => router.push("/(tabs)/(dashboard)/satellite" as any)} className="bg-purple-500 rounded-lg px-3 py-1.5">
          <Text className="text-white text-xs font-dm-sans-bold">{"\ud83d\udef0\ufe0f"} Satellite</Text>
        </Pressable>
      </View>

      {/* Layer Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-10 mx-5 mt-3 mb-2">
        {layers.map((layer) => (
          <Pressable
            key={layer.key}
            className="rounded-xl px-3 py-2 mr-2 flex-row items-center"
            style={activeLayer === layer.key ? { backgroundColor: layer.color } : { backgroundColor: "#f3f4f6" }}
            onPress={() => setActiveLayer(layer.key)}
          >
            <Text style={{ fontSize: 12 }}>{layer.icon}</Text>
            <Text className={`text-xs font-dm-sans-medium ml-1 ${activeLayer === layer.key ? "text-white" : "text-typography-500"}`}>
              {layer.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Main Map */}
        <View className="mx-5 bg-green-950 rounded-2xl overflow-hidden mb-4" style={{ height: 420 }}>
          {/* Map grid bg */}
          <View className="absolute inset-0 opacity-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <View key={i} className="h-px bg-white" style={{ marginTop: 35 }} />
            ))}
          </View>

          {/* Farm boundary */}
          <View className="absolute" style={{ top: "3%", left: "3%", right: "3%", bottom: "3%", borderWidth: 1.5, borderColor: "#ffffff30", borderRadius: 12, borderStyle: "dashed" }} />

          {/* Fields */}
          {fields.map((field, idx) => {
            const positions = [
              { top: "5%", left: "5%", width: "52%", height: "32%" },
              { top: "5%", left: "58%", width: "38%", height: "32%" },
              { top: "38%", left: "5%", width: "42%", height: "28%" },
              { top: "38%", left: "48%", width: "32%", height: "28%" },
              { top: "68%", left: "5%", width: "44%", height: "28%" },
              { top: "68%", left: "50%", width: "46%", height: "28%" },
            ];
            const pos = positions[idx];
            const overlayColor = getFieldOverlayColor(field);
            const isSelected = selectedField === field.id;

            return (
              <Pressable
                key={field.id}
                onPress={() => setSelectedField(isSelected ? null : field.id)}
                style={{
                  position: "absolute",
                  ...pos as any,
                  backgroundColor: overlayColor + "35",
                  borderWidth: isSelected ? 3 : 1.5,
                  borderColor: isSelected ? "#ffffff" : overlayColor + "80",
                  borderRadius: 12,
                  padding: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text className="text-white text-xs font-dm-sans-bold text-center" numberOfLines={1}>
                  {field.crop}
                </Text>
                <Text className="font-dm-sans-bold mt-0.5" style={{ color: overlayColor, fontSize: 16 }}>
                  {getFieldOverlayValue(field)}
                </Text>
                <Text className="text-white/60 text-xs">{field.area}ac</Text>

                {/* Irrigation icons for irrigation layer */}
                {activeLayer === "irrigation" && (
                  <View className="absolute top-1 right-1">
                    <Text style={{ fontSize: 12 }}>
                      {field.irrigationType.includes("Drip") ? "\ud83d\udca7" : field.irrigationType === "Sprinkler" ? "\ud83c\udf0a" : "\ud83c\udf0a"}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}

          {/* Map Controls */}
          <View className="absolute top-3 right-3 gap-1">
            <View className="bg-black/50 rounded-lg w-8 h-8 items-center justify-center">
              <Text className="text-white text-sm font-dm-sans-bold">N</Text>
            </View>
            <View className="bg-black/50 rounded-lg w-8 h-8 items-center justify-center">
              <Text className="text-white text-lg">+</Text>
            </View>
            <View className="bg-black/50 rounded-lg w-8 h-8 items-center justify-center">
              <Text className="text-white text-lg">-</Text>
            </View>
          </View>

          {/* Scale */}
          <View className="absolute bottom-3 left-3 flex-row items-center bg-black/50 rounded-lg px-2 py-1">
            <View className="w-10 h-0.5 bg-white" />
            <Text className="text-white text-xs ml-1">100m</Text>
          </View>

          {/* Coordinates */}
          <View className="absolute bottom-3 right-3 bg-black/50 rounded-lg px-2 py-1">
            <Text className="text-white/70" style={{ fontSize: 8 }}>
              20.006\u00b0N, 73.791\u00b0E
            </Text>
          </View>

          {/* Weather overlay for weather layer */}
          {activeLayer === "weather" && (
            <View className="absolute top-3 left-3 bg-black/60 rounded-xl p-2">
              <Text className="text-white text-xs font-dm-sans-bold">32\u00b0C \u26c5</Text>
              <Text className="text-white/60" style={{ fontSize: 8 }}>Humidity: 65%</Text>
              <Text className="text-white/60" style={{ fontSize: 8 }}>Wind: 12 km/h SE</Text>
            </View>
          )}
        </View>

        {/* Selected Field Info */}
        {selected && (
          <View className="mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-typography-900 font-dm-sans-bold text-base">{selected.name}</Text>
              <Pressable
                onPress={() => router.push({ pathname: "/(tabs)/(dashboard)/field-detail", params: { id: selected.id } } as any)}
                className="bg-green-500 rounded-lg px-3 py-1.5"
              >
                <Text className="text-white text-xs font-dm-sans-bold">Full Detail {"\u2192"}</Text>
              </Pressable>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {[
                { label: "Crop", value: selected.crop },
                { label: "Area", value: `${selected.area} acres` },
                { label: "NDVI", value: selected.ndviScore.toFixed(2) },
                { label: "Health", value: selected.healthStatus },
                { label: "Irrigation", value: selected.irrigationType },
                { label: "Soil", value: selected.soilType },
              ].map((item, i) => (
                <View key={i} className="bg-background-100 rounded-lg p-2" style={{ width: "31%" }}>
                  <Text className="text-typography-400" style={{ fontSize: 9 }}>{item.label}</Text>
                  <Text className="text-typography-800 text-xs font-dm-sans-bold" numberOfLines={1}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Map Tools */}
        <View className="mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
          <Text className="text-typography-900 font-dm-sans-bold text-sm mb-3">{"\ud83d\udee0\ufe0f"} Map Tools</Text>
          <View className="flex-row flex-wrap gap-2">
            {[
              { label: "Measure\nDistance", icon: "\ud83d\udccf", color: "#3b82f6" },
              { label: "Measure\nArea", icon: "\u25a0", color: "#22c55e" },
              { label: "Add\nMarker", icon: "\ud83d\udccd", color: "#ef4444" },
              { label: "Draw\nBoundary", icon: "\u270f\ufe0f", color: "#f59e0b" },
              { label: "Export\nKML/KMZ", icon: "\ud83d\udcc1", color: "#8b5cf6" },
              { label: "Satellite\nToggle", icon: "\ud83d\udef0\ufe0f", color: "#06b6d4" },
            ].map((tool, i) => (
              <Pressable key={i} style={{ width: "31%" }}>
                <View className="rounded-xl p-3 items-center" style={{ backgroundColor: tool.color + "10" }}>
                  <Text style={{ fontSize: 20 }}>{tool.icon}</Text>
                  <Text className="text-xs font-dm-sans-medium text-center mt-1" style={{ color: tool.color }}>
                    {tool.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Field Quick List */}
        <View className="mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100">
          <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">All Fields</Text>
          {fields.map((field) => {
            const color = getFieldOverlayColor(field);
            return (
              <Pressable key={field.id} onPress={() => setSelectedField(field.id)}>
                <View className="flex-row items-center py-2.5" style={{ borderBottomWidth: 1, borderBottomColor: "#f3f4f6" }}>
                  <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
                  <Text className="text-typography-800 text-xs font-dm-sans-medium flex-1">{field.name}</Text>
                  <Text className="text-xs font-dm-sans-bold" style={{ color }}>
                    {getFieldOverlayValue(field)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
