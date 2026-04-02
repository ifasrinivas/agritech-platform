import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

interface PhotoEntry {
  id: string;
  field: string;
  date: string;
  type: "scan" | "progress" | "damage" | "harvest" | "drone" | "general";
  description: string;
  icon: string;
  tags: string[];
  color: string;
}

const photos: PhotoEntry[] = [
  { id: "ph1", field: "South Block - Tomato", date: "2026-04-02", type: "progress", description: "Flowering stage, 60% plants flowering. Good fruit set visible.", icon: "\ud83c\udf3c", tags: ["Flowering", "Progress"], color: "#22c55e" },
  { id: "ph2", field: "South Block - Tomato", date: "2026-03-28", type: "scan", description: "Early Blight detected on lower leaves. Concentric ring spots.", icon: "\ud83d\udd2c", tags: ["Disease", "AI Scan"], color: "#ef4444" },
  { id: "ph3", field: "West Orchard - Grapes", date: "2026-03-25", type: "harvest", description: "Pre-harvest quality check. Brix: 19.2. Berry size: 18-20mm.", icon: "\ud83c\udf47", tags: ["Quality Check", "Export"], color: "#8b5cf6" },
  { id: "ph4", field: "Central Block - Onion", date: "2026-03-29", type: "damage", description: "Nitrogen deficiency - yellowing lower leaves in NE section.", icon: "\u26a0\ufe0f", tags: ["Deficiency", "Nitrogen"], color: "#f59e0b" },
  { id: "ph5", field: "All Fields", date: "2026-03-25", type: "drone", description: "3D terrain mapping complete. 2.1cm/pixel resolution.", icon: "\ud83d\ude81", tags: ["Drone", "Mapping"], color: "#3b82f6" },
  { id: "ph6", field: "North Block - Wheat", date: "2026-03-20", type: "progress", description: "Grain filling stage. Good ear formation, uniform stand.", icon: "\ud83c\udf3e", tags: ["Grain Filling", "Progress"], color: "#22c55e" },
  { id: "ph7", field: "Greenhouse - Capsicum", date: "2026-03-15", type: "progress", description: "First fruit set. Pollination by bumble bees working well.", icon: "\ud83c\udf36\ufe0f", tags: ["Fruiting", "Greenhouse"], color: "#06b6d4" },
  { id: "ph8", field: "Central Block - Onion", date: "2026-03-20", type: "scan", description: "Purple Blotch detected. 87% confidence. NE corner worst affected.", icon: "\ud83d\udd2c", tags: ["Disease", "AI Scan"], color: "#ef4444" },
  { id: "ph9", field: "East Block - Rice", date: "2026-03-10", type: "progress", description: "Active tillering stage. Plant count: 25 hills/sqm. Excellent stand.", icon: "\ud83c\udf3e", tags: ["Tillering", "Progress"], color: "#22c55e" },
  { id: "ph10", field: "West Orchard - Grapes", date: "2026-02-15", type: "general", description: "Winter pruning completed. 2-bud spurs, 40 buds/vine.", icon: "\u2702\ufe0f", tags: ["Pruning", "Management"], color: "#6b7280" },
  { id: "ph11", field: "North Block - Wheat", date: "2026-03-05", type: "scan", description: "Healthy scan - no disease detected. 97% confidence.", icon: "\u2705", tags: ["Healthy", "AI Scan"], color: "#22c55e" },
  { id: "ph12", field: "All Fields", date: "2026-01-15", type: "general", description: "Soil testing samples collected from all 6 fields for Rabi season.", icon: "\ud83e\udea8", tags: ["Soil Test", "Season Start"], color: "#8b5cf6" },
];

const typeFilters = [
  { key: "all", label: "All", icon: "\ud83d\udcf7" },
  { key: "progress", label: "Progress", icon: "\ud83c\udf31" },
  { key: "scan", label: "AI Scans", icon: "\ud83d\udd2c" },
  { key: "damage", label: "Damage", icon: "\u26a0\ufe0f" },
  { key: "harvest", label: "Harvest", icon: "\ud83c\udf3e" },
  { key: "drone", label: "Drone", icon: "\ud83d\ude81" },
];

export default function PhotoGalleryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline");

  const filtered = filter === "all" ? photos : photos.filter((p) => p.type === filter);

  // Group by month
  const grouped: Record<string, PhotoEntry[]> = {};
  filtered.forEach((p) => {
    const month = new Date(p.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(p);
  });

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\udcf7"} Field Gallery</Text>
          <Text className="text-typography-400 text-xs">{photos.length} photos \u2022 Visual field documentation</Text>
        </View>
        <Pressable className="bg-green-500 rounded-lg px-3 py-1.5">
          <Text className="text-white text-xs font-dm-sans-bold">{"\ud83d\udcf8"} Add</Text>
        </Pressable>
      </View>

      {/* Type Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-10 mx-5 mt-3 mb-3">
        {typeFilters.map((tf) => (
          <Pressable key={tf.key} className="rounded-xl px-3 py-2 mr-2" style={filter === tf.key ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }} onPress={() => setFilter(tf.key)}>
            <Text className={`text-xs font-dm-sans-medium ${filter === tf.key ? "text-white" : "text-typography-500"}`}>
              {tf.icon} {tf.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* View Mode Toggle */}
      <View className="flex-row mx-5 mb-3 gap-2">
        {(["timeline", "grid"] as const).map((mode) => (
          <Pressable key={mode} onPress={() => setViewMode(mode)} className="rounded-lg px-3 py-1.5" style={viewMode === mode ? { backgroundColor: "#e5e7eb" } : {}}>
            <Text className={`text-xs font-dm-sans-medium ${viewMode === mode ? "text-typography-800" : "text-typography-400"}`}>
              {mode === "timeline" ? "\u2502 Timeline" : "\u2588\u2588 Grid"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {viewMode === "timeline" ? (
          <View className="px-5">
            {Object.entries(grouped).map(([month, entries]) => (
              <View key={month} className="mb-4">
                <Text className="text-typography-500 font-dm-sans-bold text-xs uppercase mb-2">{month}</Text>
                {entries.map((photo, i) => (
                  <View key={photo.id} className="flex-row mb-3">
                    {/* Timeline dot */}
                    <View className="items-center w-6 mr-2">
                      <View className="w-3 h-3 rounded-full z-10" style={{ backgroundColor: photo.color }} />
                      {i < entries.length - 1 && <View className="w-0.5 flex-1" style={{ backgroundColor: photo.color + "30" }} />}
                    </View>
                    {/* Card */}
                    <View className="flex-1 bg-background-50 rounded-xl overflow-hidden border border-outline-100">
                      {/* Photo placeholder */}
                      <View className="h-36 items-center justify-center" style={{ backgroundColor: photo.color + "12" }}>
                        <Text style={{ fontSize: 40 }}>{photo.icon}</Text>
                        <Text className="text-typography-500 text-xs mt-1 font-dm-sans-medium">{photo.field}</Text>
                      </View>
                      <View className="p-3">
                        <View className="flex-row items-center justify-between mb-1">
                          <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: photo.color + "15" }}>
                            <Text className="text-xs font-dm-sans-medium capitalize" style={{ color: photo.color }}>{photo.type}</Text>
                          </View>
                          <Text className="text-typography-400 text-xs">
                            {new Date(photo.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          </Text>
                        </View>
                        <Text className="text-typography-700 text-xs leading-4 mt-1">{photo.description}</Text>
                        <View className="flex-row flex-wrap gap-1 mt-2">
                          {photo.tags.map((tag, j) => (
                            <View key={j} className="bg-background-100 rounded-full px-2 py-0.5">
                              <Text className="text-typography-500" style={{ fontSize: 9 }}>#{tag}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View className="px-5">
            <View className="flex-row flex-wrap gap-2">
              {filtered.map((photo) => (
                <View
                  key={photo.id}
                  className="rounded-xl overflow-hidden border border-outline-100"
                  style={{ width: "48%" }}
                >
                  <View className="h-28 items-center justify-center" style={{ backgroundColor: photo.color + "12" }}>
                    <Text style={{ fontSize: 32 }}>{photo.icon}</Text>
                  </View>
                  <View className="p-2">
                    <Text className="text-typography-800 text-xs font-dm-sans-bold" numberOfLines={1}>{photo.field.split(" - ")[1] || photo.field}</Text>
                    <Text className="text-typography-400" style={{ fontSize: 9 }}>
                      {new Date(photo.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} \u2022 {photo.type}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
