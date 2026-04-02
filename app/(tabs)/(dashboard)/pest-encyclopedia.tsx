import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { pestEncyclopedia } from "@/data/market";

type FilterType = "all" | "pest" | "disease" | "weed";

const typeColors = { pest: "#ef4444", disease: "#8b5cf6", weed: "#22c55e" };
const severityColors = { low: "#22c55e", medium: "#f59e0b", high: "#ef4444" };

export default function PestEncyclopediaScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = pestEncyclopedia.filter((entry) => {
    const matchesType = filter === "all" || entry.type === filter;
    const matchesSearch =
      searchQuery === "" ||
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.affectedCrops.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\ud83d\udcda"} Pest & Disease Encyclopedia
          </Text>
          <Text className="text-typography-400 text-xs">{pestEncyclopedia.length} entries</Text>
        </View>
      </View>

      {/* Search */}
      <View className="mx-5 mt-3">
        <View className="bg-background-100 rounded-xl px-4 py-3 flex-row items-center">
          <Text className="text-typography-400 mr-2">{"\ud83d\udd0d"}</Text>
          <TextInput
            className="flex-1 text-typography-900 text-sm"
            placeholder="Search by name or crop..."
            placeholderTextColor="#a1a1aa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Type Filter */}
      <View className="flex-row mx-5 mt-3 mb-3 gap-2">
        {(["all", "pest", "disease", "weed"] as FilterType[]).map((type) => (
          <Pressable
            key={type}
            className="rounded-full px-4 py-1.5"
            style={
              filter === type
                ? { backgroundColor: type === "all" ? "#16a34a" : typeColors[type as keyof typeof typeColors] }
                : { backgroundColor: "#f3f4f6" }
            }
            onPress={() => setFilter(type)}
          >
            <Text
              className={`text-xs font-dm-sans-medium capitalize ${
                filter === type ? "text-white" : "text-typography-500"
              }`}
            >
              {type === "all" ? "All" : type === "pest" ? "\ud83d\udc1b Pests" : type === "disease" ? "\ud83e\uddec Diseases" : "\ud83c\udf3f Weeds"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {filtered.map((entry) => {
          const isExpanded = expandedId === entry.id;
          const color = typeColors[entry.type];

          return (
            <Pressable
              key={entry.id}
              onPress={() => setExpandedId(isExpanded ? null : entry.id)}
            >
              <View className="mx-5 mb-3 bg-background-50 rounded-2xl border border-outline-100 overflow-hidden">
                {/* Header */}
                <View className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <Text style={{ fontSize: 24 }}>{entry.icon}</Text>
                      <View className="ml-3 flex-1">
                        <Text className="text-typography-900 font-dm-sans-bold text-sm">
                          {entry.name}
                        </Text>
                        <Text className="text-typography-400 text-xs italic">
                          {entry.scientificName}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <View className="flex-row gap-1">
                        <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: color + "15" }}>
                          <Text className="text-xs font-dm-sans-medium capitalize" style={{ color }}>
                            {entry.type}
                          </Text>
                        </View>
                        <View
                          className="rounded-full px-2 py-0.5"
                          style={{ backgroundColor: severityColors[entry.severity] + "15" }}
                        >
                          <Text className="text-xs font-dm-sans-medium capitalize" style={{ color: severityColors[entry.severity] }}>
                            {entry.severity}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Affected Crops */}
                  <View className="flex-row flex-wrap gap-1 mt-2">
                    {entry.affectedCrops.map((crop, i) => (
                      <View key={i} className="bg-background-100 rounded-full px-2 py-0.5">
                        <Text className="text-typography-600 text-xs">{crop}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Expanded Content */}
                {isExpanded && (
                  <View className="px-4 pb-4 border-t border-outline-100 pt-3">
                    {/* Symptoms */}
                    <View className="mb-3">
                      <Text className="text-typography-900 font-dm-sans-bold text-xs mb-1">
                        {"\ud83d\udd0d"} Symptoms
                      </Text>
                      {entry.symptoms.map((s, i) => (
                        <Text key={i} className="text-typography-600 text-xs leading-5">
                          {"\u2022"} {s}
                        </Text>
                      ))}
                    </View>

                    {/* Lifecycle */}
                    <View className="mb-3 bg-background-100 rounded-xl p-3">
                      <Text className="text-typography-900 font-dm-sans-bold text-xs mb-1">
                        {"\ud83d\udd04"} Lifecycle
                      </Text>
                      <Text className="text-typography-600 text-xs leading-5">{entry.lifecycle}</Text>
                    </View>

                    {/* Favorable Conditions */}
                    <View className="mb-3 bg-warning-50 rounded-xl p-3">
                      <Text className="text-warning-800 font-dm-sans-bold text-xs mb-1">
                        {"\u26a0\ufe0f"} Favorable Conditions
                      </Text>
                      <Text className="text-warning-700 text-xs leading-5">{entry.favorableConditions}</Text>
                    </View>

                    {/* Chemical Control */}
                    <View className="mb-3">
                      <Text className="text-typography-900 font-dm-sans-bold text-xs mb-1">
                        {"\ud83e\uddea"} Chemical Control
                      </Text>
                      {entry.chemicalControl.map((c, i) => (
                        <View key={i} className="flex-row py-1">
                          <Text className="text-typography-700 text-xs font-dm-sans-medium flex-1">{c.name}</Text>
                          <Text className="text-typography-500 text-xs">{c.dosage}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Organic Control */}
                    <View className="mb-3 bg-green-50 rounded-xl p-3">
                      <Text className="text-green-800 font-dm-sans-bold text-xs mb-1">
                        {"\ud83c\udf3f"} Organic / Bio-Control
                      </Text>
                      {entry.organicControl.map((c, i) => (
                        <View key={i} className="py-1">
                          <Text className="text-green-700 text-xs font-dm-sans-medium">{c.name}</Text>
                          <Text className="text-green-600 text-xs">{c.method}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Prevention */}
                    <View>
                      <Text className="text-typography-900 font-dm-sans-bold text-xs mb-1">
                        {"\ud83d\udee1\ufe0f"} Prevention
                      </Text>
                      {entry.preventionMethods.map((p, i) => (
                        <Text key={i} className="text-typography-600 text-xs leading-5">
                          {"\u2022"} {p}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}

        {filtered.length === 0 && (
          <View className="items-center py-12">
            <Text style={{ fontSize: 48 }}>{"\ud83d\udd0d"}</Text>
            <Text className="text-typography-500 text-sm mt-2">No entries found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
