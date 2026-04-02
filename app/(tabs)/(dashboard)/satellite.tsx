import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fields, getNDVIColor } from "@/data/agritech";
import { fieldDetails } from "@/data/market";

type SatLayer = "ndvi" | "moisture" | "temperature" | "lai";

const layerInfo = {
  ndvi: { label: "NDVI (Vegetation)", icon: "\ud83c\udf3f", desc: "Normalized Difference Vegetation Index - measures plant health" },
  moisture: { label: "Soil Moisture", icon: "\ud83d\udca7", desc: "Surface soil moisture from microwave satellite sensors" },
  temperature: { label: "Land Surface Temp", icon: "\ud83c\udf21\ufe0f", desc: "Thermal infrared - detects crop stress from heat" },
  lai: { label: "Leaf Area Index", icon: "\ud83c\udf43", desc: "Canopy density indicator - correlates with biomass" },
};

export default function SatelliteScreen() {
  const router = useRouter();
  const [activeLayer, setActiveLayer] = useState<SatLayer>("ndvi");
  const [selectedField, setSelectedField] = useState(fields[0].id);
  const field = fields.find((f) => f.id === selectedField) || fields[0];
  const detail = fieldDetails[selectedField];

  // Generate mock satellite data for each layer
  const getFieldValue = (f: typeof fields[0], layer: SatLayer) => {
    switch (layer) {
      case "ndvi": return f.ndviScore;
      case "moisture": return (f.ndviScore * 0.5 + Math.random() * 0.3);
      case "temperature": return 28 + (1 - f.ndviScore) * 12;
      case "lai": return f.ndviScore * 4.5;
    }
  };

  const getLayerColor = (value: number, layer: SatLayer) => {
    switch (layer) {
      case "ndvi": return getNDVIColor(value);
      case "moisture":
        if (value > 0.6) return "#1d4ed8";
        if (value > 0.4) return "#3b82f6";
        if (value > 0.2) return "#93c5fd";
        return "#fca5a5";
      case "temperature":
        if (value > 38) return "#dc2626";
        if (value > 34) return "#f97316";
        if (value > 30) return "#eab308";
        return "#22c55e";
      case "lai":
        if (value > 3.5) return "#15803d";
        if (value > 2.5) return "#22c55e";
        if (value > 1.5) return "#84cc16";
        return "#eab308";
    }
  };

  const formatLayerValue = (value: number, layer: SatLayer) => {
    switch (layer) {
      case "ndvi": return value.toFixed(2);
      case "moisture": return `${(value * 100).toFixed(0)}%`;
      case "temperature": return `${value.toFixed(1)}\u00b0C`;
      case "lai": return value.toFixed(1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\ud83d\udef0\ufe0f"} Satellite Analysis
          </Text>
          <Text className="text-typography-400 text-xs">Multi-spectral remote sensing data</Text>
        </View>
      </View>

      {/* Layer Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-12 mx-5 mt-3 mb-2">
        {(Object.keys(layerInfo) as SatLayer[]).map((layer) => (
          <Pressable
            key={layer}
            className="rounded-xl px-4 py-2 mr-2"
            style={activeLayer === layer ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }}
            onPress={() => setActiveLayer(layer)}
          >
            <Text
              className={`text-xs font-dm-sans-medium ${
                activeLayer === layer ? "text-white" : "text-typography-500"
              }`}
            >
              {layerInfo[layer].icon} {layerInfo[layer].label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Layer Description */}
        <View className="mx-5 mb-3 bg-blue-50 rounded-xl p-3 border border-blue-100">
          <Text className="text-blue-700 text-xs font-dm-sans-medium">
            {layerInfo[activeLayer].icon} {layerInfo[activeLayer].desc}
          </Text>
        </View>

        {/* Satellite Map Grid */}
        <View className="mx-5 bg-background-900 rounded-2xl p-3 mb-4">
          <View className="flex-row flex-wrap">
            {fields.map((f) => {
              const val = getFieldValue(f, activeLayer);
              const color = getLayerColor(val, activeLayer);
              const isSelected = selectedField === f.id;

              return (
                <Pressable
                  key={f.id}
                  onPress={() => setSelectedField(f.id)}
                  style={{ width: "33.33%", padding: 4 }}
                >
                  <View
                    className="rounded-xl p-3 items-center justify-center"
                    style={{
                      backgroundColor: color + "35",
                      borderWidth: isSelected ? 2 : 1,
                      borderColor: isSelected ? "#fff" : color + "60",
                      minHeight: 90,
                    }}
                  >
                    <Text className="text-white text-xs font-dm-sans-bold text-center" numberOfLines={1}>
                      {f.crop}
                    </Text>
                    <Text className="text-lg font-dm-sans-bold mt-1" style={{ color }}>
                      {formatLayerValue(val, activeLayer)}
                    </Text>
                    <Text className="text-white text-xs opacity-60">{f.area}ac</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <Text className="text-white/40 text-xs text-center mt-2">
            Last updated: 2 hours ago \u2022 Sentinel-2 L2A
          </Text>
        </View>

        {/* Selected Field Analysis */}
        <View className="mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-1">
            {field.name}
          </Text>
          <Text className="text-typography-400 text-xs font-dm-sans-regular mb-3">
            Detailed spectral analysis
          </Text>

          {/* Multi-band Analysis */}
          <View className="flex-row flex-wrap gap-2 mb-3">
            {[
              { band: "Red Edge", value: (field.ndviScore * 0.85).toFixed(2), desc: "Chlorophyll activity", color: "#ef4444" },
              { band: "NIR", value: (field.ndviScore * 1.1).toFixed(2), desc: "Biomass density", color: "#8b5cf6" },
              { band: "SWIR", value: (0.3 + Math.random() * 0.4).toFixed(2), desc: "Water content", color: "#3b82f6" },
              { band: "Green", value: (field.ndviScore * 0.9).toFixed(2), desc: "Vigor indicator", color: "#22c55e" },
            ].map((band, i) => (
              <View
                key={i}
                className="rounded-xl p-3"
                style={{ width: "48%", backgroundColor: band.color + "10" }}
              >
                <Text className="font-dm-sans-bold text-sm" style={{ color: band.color }}>
                  {band.value}
                </Text>
                <Text className="text-typography-800 text-xs font-dm-sans-medium">{band.band}</Text>
                <Text className="text-typography-400 text-xs">{band.desc}</Text>
              </View>
            ))}
          </View>

          {/* NDVI Trend */}
          {detail && (
            <View>
              <Text className="text-typography-700 font-dm-sans-bold text-sm mb-2">
                NDVI Progression
              </Text>
              <View className="h-28 flex-row items-end">
                {detail.ndviHistory.map((point, i) => {
                  const height = point.value * 100;
                  const color = getNDVIColor(point.value);
                  return (
                    <View key={i} className="flex-1 items-center">
                      <Text className="text-xs font-dm-sans-bold mb-1" style={{ color, fontSize: 8 }}>
                        {point.value.toFixed(2)}
                      </Text>
                      <View
                        className="w-5 rounded-t-lg"
                        style={{ height: `${height}%`, backgroundColor: color }}
                      />
                      <Text className="text-typography-400 mt-1" style={{ fontSize: 7 }}>
                        {point.date}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* Anomaly Detection */}
        <View className="mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
            {"\ud83d\udd0d"} Anomaly Detection
          </Text>
          {[
            {
              field: "Central Block - Onion",
              anomaly: "NDVI drop of 0.15 in 14 days",
              cause: "Likely nitrogen deficiency + thrips damage",
              action: "Ground verification + foliar nitrogen spray",
              severity: "high",
            },
            {
              field: "South Block - Tomato",
              anomaly: "Moisture index 40% below optimal",
              cause: "Irrigation system underperformance",
              action: "Check sprinkler nozzles, increase frequency",
              severity: "medium",
            },
            {
              field: "West Orchard - Grapes",
              anomaly: "Temperature hotspot NE quadrant",
              cause: "Canopy thinning due to harvest pruning",
              action: "Normal - expected during harvest period",
              severity: "low",
            },
          ].map((item, i) => {
            const severityColors = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };
            const color = severityColors[item.severity as keyof typeof severityColors];
            return (
              <View
                key={i}
                className="rounded-xl p-3 mb-2"
                style={{ backgroundColor: color + "08", borderLeftWidth: 3, borderLeftColor: color }}
              >
                <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.field}</Text>
                <Text className="text-typography-700 text-xs mt-1">{item.anomaly}</Text>
                <Text className="text-typography-500 text-xs mt-0.5">Cause: {item.cause}</Text>
                <Text className="text-typography-500 text-xs mt-0.5">Action: {item.action}</Text>
              </View>
            );
          })}
        </View>

        {/* Satellite Specifications */}
        <View className="mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100">
          <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">
            Data Sources
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {[
              { sat: "Sentinel-2", res: "10m", revisit: "5 days", bands: "13 bands" },
              { sat: "Landsat-9", res: "30m", revisit: "16 days", bands: "11 bands" },
              { sat: "MODIS", res: "250m", revisit: "Daily", bands: "36 bands" },
              { sat: "Planet", res: "3m", revisit: "Daily", bands: "8 bands" },
            ].map((item, i) => (
              <View key={i} className="bg-background-100 rounded-lg p-2" style={{ width: "48%" }}>
                <Text className="text-typography-800 text-xs font-dm-sans-bold">{item.sat}</Text>
                <Text className="text-typography-400 text-xs">
                  {item.res} \u2022 {item.revisit} \u2022 {item.bands}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
