import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type CompareTab = "yield" | "financial" | "health" | "water" | "inputs";

interface SeasonData {
  season: string;
  year: string;
  crops: number;
  area: number;
  revenue: number;
  expenses: number;
  profit: number;
  avgNDVI: number;
  waterUsed: number;
  pestLoss: number;
  yieldPerAcre: number;
}

const seasons: SeasonData[] = [
  { season: "Rabi 2025-26", year: "Current", crops: 6, area: 45.5, revenue: 1250000, expenses: 380000, profit: 870000, avgNDVI: 0.71, waterUsed: 4200000, pestLoss: 3, yieldPerAcre: 16.1 },
  { season: "Kharif 2025", year: "Previous", crops: 4, area: 35, revenue: 850000, expenses: 290000, profit: 560000, avgNDVI: 0.65, waterUsed: 5100000, pestLoss: 8, yieldPerAcre: 13.8 },
  { season: "Rabi 2024-25", year: "Last Year", crops: 5, area: 40, revenue: 1020000, expenses: 350000, profit: 670000, avgNDVI: 0.62, waterUsed: 5500000, pestLoss: 12, yieldPerAcre: 14.2 },
  { season: "Kharif 2024", year: "2 Seasons Ago", crops: 4, area: 35, revenue: 720000, expenses: 260000, profit: 460000, avgNDVI: 0.58, waterUsed: 4800000, pestLoss: 15, yieldPerAcre: 12.5 },
];

export default function SeasonCompareScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CompareTab>("yield");

  const current = seasons[0];
  const previous = seasons[2]; // Compare with same season last year

  const getChange = (curr: number, prev: number) => {
    const pct = ((curr - prev) / prev * 100).toFixed(0);
    return { value: pct, positive: curr >= prev };
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\udcc8"} Season Comparison</Text>
          <Text className="text-typography-400 text-xs">Historical data & trend analysis</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-12 mx-5 mt-3 mb-2">
        {([
          { key: "yield" as CompareTab, label: "\ud83c\udf3e Yield" },
          { key: "financial" as CompareTab, label: "\ud83d\udcb0 Financial" },
          { key: "health" as CompareTab, label: "\ud83c\udf31 Health" },
          { key: "water" as CompareTab, label: "\ud83d\udca7 Water" },
          { key: "inputs" as CompareTab, label: "\ud83d\udce6 Inputs" },
        ]).map((tab) => (
          <Pressable key={tab.key} className="rounded-xl px-4 py-2 mr-2" style={activeTab === tab.key ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }} onPress={() => setActiveTab(tab.key)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === tab.key ? "text-white" : "text-typography-500"}`}>{tab.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Season Trend Chart */}
        <View className="mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
            {activeTab === "yield" ? "Yield Trend" : activeTab === "financial" ? "Profit Trend" : activeTab === "health" ? "NDVI Trend" : activeTab === "water" ? "Water Usage Trend" : "Pest Loss Trend"}
          </Text>

          <View className="h-36 flex-row items-end">
            {seasons.slice().reverse().map((s, i) => {
              const values: Record<CompareTab, number> = {
                yield: s.yieldPerAcre,
                financial: s.profit / 100000,
                health: s.avgNDVI * 100,
                water: s.waterUsed / 100000,
                inputs: s.pestLoss,
              };
              const maxValues: Record<CompareTab, number> = {
                yield: 20,
                financial: 10,
                health: 100,
                water: 60,
                inputs: 20,
              };
              const colors: Record<CompareTab, string> = {
                yield: "#22c55e",
                financial: "#3b82f6",
                health: "#8b5cf6",
                water: "#06b6d4",
                inputs: "#ef4444",
              };

              const val = values[activeTab];
              const max = maxValues[activeTab];
              const height = (val / max) * 100;
              const color = colors[activeTab];
              const isCurrent = i === seasons.length - 1;

              return (
                <View key={i} className="flex-1 items-center">
                  <Text className="font-dm-sans-bold mb-1" style={{ fontSize: 9, color }}>
                    {activeTab === "financial" ? `${val.toFixed(1)}L` : activeTab === "water" ? `${val.toFixed(0)}` : activeTab === "health" ? `${(val/100).toFixed(2)}` : `${val}`}
                    {activeTab === "yield" ? "q" : activeTab === "inputs" ? "%" : ""}
                  </Text>
                  <View
                    className="w-10 rounded-t-lg"
                    style={{
                      height: `${Math.min(height, 100)}%`,
                      backgroundColor: isCurrent ? color : color + "60",
                    }}
                  />
                  <Text className="text-typography-400 mt-1 text-center" style={{ fontSize: 8 }}>
                    {s.season.split(" ")[0]}{"\n"}{s.season.split(" ")[1] || ""}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* YoY Comparison Table */}
        <View className="mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
            Year-over-Year: {current.season} vs {previous.season}
          </Text>

          {[
            { metric: "Total Revenue", curr: `\u20b9${(current.revenue/100000).toFixed(1)}L`, prev: `\u20b9${(previous.revenue/100000).toFixed(1)}L`, ...getChange(current.revenue, previous.revenue) },
            { metric: "Total Expenses", curr: `\u20b9${(current.expenses/100000).toFixed(1)}L`, prev: `\u20b9${(previous.expenses/100000).toFixed(1)}L`, ...getChange(current.expenses, previous.expenses), positive: current.expenses <= previous.expenses },
            { metric: "Net Profit", curr: `\u20b9${(current.profit/100000).toFixed(1)}L`, prev: `\u20b9${(previous.profit/100000).toFixed(1)}L`, ...getChange(current.profit, previous.profit) },
            { metric: "Avg NDVI", curr: current.avgNDVI.toFixed(2), prev: previous.avgNDVI.toFixed(2), ...getChange(current.avgNDVI, previous.avgNDVI) },
            { metric: "Yield/Acre", curr: `${current.yieldPerAcre}q`, prev: `${previous.yieldPerAcre}q`, ...getChange(current.yieldPerAcre, previous.yieldPerAcre) },
            { metric: "Water Used", curr: `${(current.waterUsed/1000000).toFixed(1)}M L`, prev: `${(previous.waterUsed/1000000).toFixed(1)}M L`, ...getChange(previous.waterUsed, current.waterUsed) },
            { metric: "Pest Loss", curr: `${current.pestLoss}%`, prev: `${previous.pestLoss}%`, ...getChange(previous.pestLoss, current.pestLoss) },
            { metric: "Cultivated Area", curr: `${current.area}ac`, prev: `${previous.area}ac`, ...getChange(current.area, previous.area) },
          ].map((row, i) => (
            <View key={i} className="flex-row items-center py-2.5" style={i < 7 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
              <Text className="flex-1 text-typography-700 text-xs font-dm-sans-medium">{row.metric}</Text>
              <Text className="text-typography-500 text-xs w-16 text-center">{row.prev}</Text>
              <Text className="text-typography-900 text-xs w-16 text-center font-dm-sans-bold">{row.curr}</Text>
              <View className="w-14 items-end">
                <Text className="text-xs font-dm-sans-bold" style={{ color: row.positive ? "#22c55e" : "#ef4444" }}>
                  {row.positive ? "\u2191" : "\u2193"}{row.value}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Key Insights */}
        <View className="mx-5 bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
          <Text className="text-green-800 font-dm-sans-bold text-sm mb-2">{"\ud83d\udca1"} Key Improvements This Season</Text>
          {[
            "Profit increased 30% (\u20b98.7L vs \u20b96.7L) through precision farming",
            "Water usage reduced 24% (4.2M vs 5.5M L) with drip + sensor-based scheduling",
            "Pest losses reduced from 12% to 3% with AI early warning + IPM",
            "NDVI improved from 0.62 to 0.71 (14.5% better crop health)",
            "5.5 acres more under cultivation (40 \u2192 45.5 acres)",
          ].map((insight, i) => (
            <Text key={i} className="text-green-700 text-xs leading-5">{"\u2022"} {insight}</Text>
          ))}
        </View>

        {/* Areas for Improvement */}
        <View className="mx-5 bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
          <Text className="text-yellow-800 font-dm-sans-bold text-sm mb-2">{"\u26a0\ufe0f"} Focus Areas for Next Season</Text>
          {[
            "Central Block onion NDVI still low (0.45) - soil improvement needed",
            "South Block tomato water efficiency below target - fix sprinkler issues",
            "Expenses per acre up 8% - review labor and input procurement",
            "2 soil sensors offline - invest in robust monitoring infrastructure",
            "Explore Kharif Soybean for nitrogen fixation (AI recommendation score: 95)",
          ].map((area, i) => (
            <Text key={i} className="text-yellow-700 text-xs leading-5">{"\u2022"} {area}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
