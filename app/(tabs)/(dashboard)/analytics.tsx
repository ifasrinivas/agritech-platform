import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fields, getNDVIColor } from "@/data/agritech";
import { fieldDetails } from "@/data/market";

type AnalyticsTab = "yield" | "health" | "financial" | "comparison";

export default function AnalyticsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("yield");

  const totalArea = fields.reduce((s, f) => s + f.area, 0);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\ud83d\udcca"} Analytics & Reports
          </Text>
          <Text className="text-typography-400 text-xs">Yield predictions, trends & insights</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-12 mx-5 mt-3 mb-2">
        {([
          { key: "yield" as AnalyticsTab, label: "\ud83c\udf3e Yield" },
          { key: "health" as AnalyticsTab, label: "\ud83c\udf31 Health Trends" },
          { key: "financial" as AnalyticsTab, label: "\ud83d\udcb0 Financial" },
          { key: "comparison" as AnalyticsTab, label: "\ud83d\udcca Compare" },
        ]).map((tab) => (
          <Pressable
            key={tab.key}
            className="rounded-xl px-4 py-2 mr-2"
            style={activeTab === tab.key ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text className={`text-xs font-dm-sans-medium ${activeTab === tab.key ? "text-white" : "text-typography-500"}`}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "yield" && (
          <View className="px-5">
            {/* Yield Prediction Summary */}
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
              <Text className="text-green-800 font-dm-sans-bold text-base mb-1">
                {"\ud83e\udde0"} AI Yield Prediction
              </Text>
              <Text className="text-green-600 text-xs mb-3">
                Based on NDVI trends, weather patterns, and soil health data
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-green-800 text-2xl font-dm-sans-bold">92%</Text>
                  <Text className="text-green-600 text-xs">Confidence</Text>
                </View>
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-green-800 text-2xl font-dm-sans-bold">{"\u20b9"}12.5L</Text>
                  <Text className="text-green-600 text-xs">Expected Revenue</Text>
                </View>
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-green-800 text-2xl font-dm-sans-bold">+8%</Text>
                  <Text className="text-green-600 text-xs">vs Last Season</Text>
                </View>
              </View>
            </View>

            {/* Per Crop Yield Forecast */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
              Per-Crop Yield Forecast
            </Text>
            {fields.map((field) => {
              const detail = fieldDetails[field.id];
              if (!detail) return null;
              const ndviTrend = detail.ndviHistory;
              const latestNDVI = ndviTrend[ndviTrend.length - 1]?.value || 0;
              const firstNDVI = ndviTrend[0]?.value || 0;
              const growth = ((latestNDVI - firstNDVI) / firstNDVI * 100).toFixed(0);

              return (
                <View key={field.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <View>
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{field.crop}</Text>
                      <Text className="text-typography-400 text-xs">{field.name} \u2022 {field.area} ac</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-typography-900 font-dm-sans-bold text-lg">
                        {detail.yieldEstimate}
                      </Text>
                      <Text className="text-typography-400 text-xs">{detail.yieldUnit}</Text>
                    </View>
                  </View>

                  {/* Mini NDVI trend */}
                  <View className="h-12 flex-row items-end mb-2">
                    {ndviTrend.map((p, i) => (
                      <View key={i} className="flex-1 items-center">
                        <View
                          className="w-3 rounded-t-sm"
                          style={{
                            height: `${p.value * 100}%`,
                            backgroundColor: getNDVIColor(p.value),
                          }}
                        />
                      </View>
                    ))}
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-typography-500 text-xs">
                      Stage: {detail.growthStage}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-xs font-dm-sans-bold" style={{ color: Number(growth) > 0 ? "#22c55e" : "#ef4444" }}>
                        {Number(growth) > 0 ? "\u2191" : "\u2193"}{growth}% NDVI
                      </Text>
                      <Text className="text-typography-400 text-xs ml-2">
                        \u2022 {detail.daysToHarvest}d to harvest
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === "health" && (
          <View className="px-5">
            {/* Farm Health Score Trend */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-1">
                Farm Health Score Trend
              </Text>
              <Text className="text-typography-400 text-xs mb-3">Weekly average NDVI across all fields</Text>

              <View className="h-40 flex-row items-end">
                {[
                  { week: "W1\nFeb", value: 0.42 },
                  { week: "W2\nFeb", value: 0.48 },
                  { week: "W3\nFeb", value: 0.52 },
                  { week: "W4\nFeb", value: 0.55 },
                  { week: "W1\nMar", value: 0.58 },
                  { week: "W2\nMar", value: 0.62 },
                  { week: "W3\nMar", value: 0.65 },
                  { week: "W4\nMar", value: 0.68 },
                  { week: "W1\nApr", value: 0.71 },
                ].map((item, i) => {
                  const color = getNDVIColor(item.value);
                  return (
                    <View key={i} className="flex-1 items-center">
                      <Text className="text-xs font-dm-sans-bold mb-1" style={{ color, fontSize: 8 }}>
                        {item.value.toFixed(2)}
                      </Text>
                      <View
                        className="w-5 rounded-t-lg"
                        style={{ height: `${item.value * 100}%`, backgroundColor: color }}
                      />
                      <Text className="text-typography-400 mt-1 text-center" style={{ fontSize: 7 }}>
                        {item.week}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View className="flex-row items-center justify-center mt-3 bg-green-50 rounded-lg p-2">
                <Text className="text-green-700 text-xs font-dm-sans-medium">
                  {"\ud83d\udcc8"} Farm health improved 69% since season start
                </Text>
              </View>
            </View>

            {/* Per-Field Health Comparison */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
              Field Health Comparison
            </Text>
            {fields.sort((a, b) => b.ndviScore - a.ndviScore).map((field, i) => {
              const color = getNDVIColor(field.ndviScore);
              return (
                <View key={field.id} className="flex-row items-center mb-3">
                  <Text className="text-typography-400 text-xs w-4 font-dm-sans-bold">
                    {i + 1}
                  </Text>
                  <View className="flex-1 ml-2">
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-typography-800 text-xs font-dm-sans-medium">
                        {field.crop} ({field.area}ac)
                      </Text>
                      <Text className="text-xs font-dm-sans-bold" style={{ color }}>
                        {field.ndviScore.toFixed(2)}
                      </Text>
                    </View>
                    <View className="h-3 bg-background-200 rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{ width: `${field.ndviScore * 100}%`, backgroundColor: color }}
                      />
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Stress Detection Summary */}
            <View className="bg-red-50 rounded-2xl p-4 border border-red-200 mt-4">
              <Text className="text-red-800 font-dm-sans-bold text-sm mb-2">
                {"\u26a0\ufe0f"} Active Stress Indicators
              </Text>
              {[
                { field: "Central Block - Onion", type: "Nitrogen Deficiency", ndvi: "0.45 (-0.15)", severity: "High" },
                { field: "South Block - Tomato", type: "Water Stress", ndvi: "0.62 (stalled)", severity: "Medium" },
              ].map((item, i) => (
                <View key={i} className="bg-white rounded-xl p-3 mb-2">
                  <Text className="text-typography-900 text-xs font-dm-sans-bold">{item.field}</Text>
                  <Text className="text-red-600 text-xs">{item.type} \u2022 NDVI: {item.ndvi}</Text>
                  <Text className="text-typography-400 text-xs">Severity: {item.severity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "financial" && (
          <View className="px-5">
            {/* Revenue & Cost Summary */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
                Season P&L Statement
              </Text>

              {/* Revenue */}
              <View className="bg-green-50 rounded-xl p-3 mb-2">
                <Text className="text-green-700 text-xs font-dm-sans-medium">Total Expected Revenue</Text>
                <Text className="text-green-800 text-2xl font-dm-sans-bold">{"\u20b9"}12,50,000</Text>
              </View>

              {/* Expenses by category */}
              {[
                { cat: "Seeds & Seedlings", amount: 33500, icon: "\ud83c\udf31" },
                { cat: "Fertilizers", amount: 79500, icon: "\ud83e\udea4" },
                { cat: "Pesticides", amount: 35200, icon: "\ud83d\udc1b" },
                { cat: "Irrigation", amount: 45000, icon: "\ud83d\udca7" },
                { cat: "Labor", amount: 108000, icon: "\ud83d\udc77" },
                { cat: "Machinery", amount: 42000, icon: "\ud83d\ude9c" },
                { cat: "Transport", amount: 25000, icon: "\ud83d\ude9a" },
                { cat: "Others", amount: 11800, icon: "\ud83d\udce6" },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center justify-between py-2" style={i < 7 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 14 }}>{item.icon}</Text>
                    <Text className="text-typography-700 text-sm ml-2">{item.cat}</Text>
                  </View>
                  <Text className="text-typography-900 text-sm font-dm-sans-bold">
                    {"\u20b9"}{item.amount.toLocaleString()}
                  </Text>
                </View>
              ))}

              <View className="flex-row items-center justify-between pt-3 mt-2 border-t-2 border-outline-200">
                <Text className="text-typography-900 font-dm-sans-bold text-sm">Total Expenses</Text>
                <Text className="text-red-600 font-dm-sans-bold text-lg">{"\u20b9"}3,80,000</Text>
              </View>

              <View className="flex-row items-center justify-between pt-2">
                <Text className="text-typography-900 font-dm-sans-bold text-base">Net Profit</Text>
                <Text className="text-green-600 font-dm-sans-bold text-xl">{"\u20b9"}8,70,000</Text>
              </View>

              <View className="bg-blue-50 rounded-xl p-3 mt-3">
                <View className="flex-row justify-between">
                  <Text className="text-blue-700 text-xs font-dm-sans-medium">ROI</Text>
                  <Text className="text-blue-800 text-xs font-dm-sans-bold">229%</Text>
                </View>
                <View className="flex-row justify-between mt-1">
                  <Text className="text-blue-700 text-xs font-dm-sans-medium">Cost per acre</Text>
                  <Text className="text-blue-800 text-xs font-dm-sans-bold">{"\u20b9"}8,352</Text>
                </View>
                <View className="flex-row justify-between mt-1">
                  <Text className="text-blue-700 text-xs font-dm-sans-medium">Revenue per acre</Text>
                  <Text className="text-blue-800 text-xs font-dm-sans-bold">{"\u20b9"}27,473</Text>
                </View>
              </View>
            </View>

            {/* Season Comparison */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Season Comparison</Text>
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100">
              <View className="flex-row items-center mb-3">
                <View className="flex-1" />
                <Text className="text-typography-400 text-xs w-20 text-center font-dm-sans-bold">Rabi 24-25</Text>
                <Text className="text-typography-400 text-xs w-20 text-center font-dm-sans-bold">Rabi 25-26</Text>
                <Text className="text-typography-400 text-xs w-14 text-center font-dm-sans-bold">Change</Text>
              </View>
              {[
                { metric: "Revenue", prev: "\u20b910.2L", curr: "\u20b912.5L", change: "+22%", positive: true },
                { metric: "Expenses", prev: "\u20b93.5L", curr: "\u20b93.8L", change: "+8%", positive: false },
                { metric: "Net Profit", prev: "\u20b96.7L", curr: "\u20b98.7L", change: "+30%", positive: true },
                { metric: "Yield/acre", prev: "14.2q", curr: "16.1q", change: "+13%", positive: true },
                { metric: "Water Use", prev: "5.1M L", curr: "4.2M L", change: "-18%", positive: true },
                { metric: "Pest Loss", prev: "8%", curr: "3%", change: "-63%", positive: true },
              ].map((row, i) => (
                <View key={i} className="flex-row items-center py-2" style={i < 5 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <Text className="flex-1 text-typography-700 text-xs font-dm-sans-medium">{row.metric}</Text>
                  <Text className="text-typography-500 text-xs w-20 text-center">{row.prev}</Text>
                  <Text className="text-typography-900 text-xs w-20 text-center font-dm-sans-bold">{row.curr}</Text>
                  <Text className="text-xs w-14 text-center font-dm-sans-bold" style={{ color: row.positive ? "#22c55e" : "#ef4444" }}>
                    {row.change}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "comparison" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
              Crop Performance Comparison
            </Text>

            {/* Radar-style comparison */}
            {[
              {
                crop: "Grapes",
                profitPerAcre: 40333,
                ndvi: 0.71,
                waterEfficiency: 78,
                pestResistance: 60,
                roi: 163,
                color: "#8b5cf6",
              },
              {
                crop: "Capsicum (GH)",
                profitPerAcre: 30750,
                ndvi: 0.88,
                waterEfficiency: 92,
                pestResistance: 85,
                roi: 273,
                color: "#06b6d4",
              },
              {
                crop: "Tomato",
                profitPerAcre: 15000,
                ndvi: 0.62,
                waterEfficiency: 55,
                pestResistance: 45,
                roi: 167,
                color: "#ef4444",
              },
              {
                crop: "Wheat",
                profitPerAcre: 10000,
                ndvi: 0.78,
                waterEfficiency: 72,
                pestResistance: 80,
                roi: 147,
                color: "#f59e0b",
              },
              {
                crop: "Rice",
                profitPerAcre: 11500,
                ndvi: 0.85,
                waterEfficiency: 40,
                pestResistance: 70,
                roi: 256,
                color: "#22c55e",
              },
              {
                crop: "Onion",
                profitPerAcre: 18300,
                ndvi: 0.45,
                waterEfficiency: 60,
                pestResistance: 35,
                roi: 238,
                color: "#f97316",
              },
            ].map((crop, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-typography-900 font-dm-sans-bold text-base">{crop.crop}</Text>
                  <Text className="font-dm-sans-bold text-sm" style={{ color: crop.color }}>
                    ROI: {crop.roi}%
                  </Text>
                </View>

                {/* Metrics bars */}
                {[
                  { label: "Profit/acre", value: crop.profitPerAcre, max: 50000, display: `\u20b9${(crop.profitPerAcre/1000).toFixed(1)}K` },
                  { label: "Crop Health (NDVI)", value: crop.ndvi * 100, max: 100, display: crop.ndvi.toFixed(2) },
                  { label: "Water Efficiency", value: crop.waterEfficiency, max: 100, display: `${crop.waterEfficiency}%` },
                  { label: "Pest Resistance", value: crop.pestResistance, max: 100, display: `${crop.pestResistance}%` },
                ].map((metric, j) => (
                  <View key={j} className="mb-2">
                    <View className="flex-row justify-between mb-0.5">
                      <Text className="text-typography-500 text-xs">{metric.label}</Text>
                      <Text className="text-typography-700 text-xs font-dm-sans-bold">{metric.display}</Text>
                    </View>
                    <View className="h-2 bg-background-200 rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${(metric.value / metric.max) * 100}%`,
                          backgroundColor: crop.color,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            ))}

            {/* Best Performers */}
            <View className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
              <Text className="text-yellow-800 font-dm-sans-bold text-sm mb-2">
                {"\ud83c\udfc6"} Top Performers This Season
              </Text>
              {[
                { label: "Highest ROI", winner: "Capsicum (273%)", icon: "\ud83d\udcb0" },
                { label: "Best Health", winner: "Capsicum (0.88 NDVI)", icon: "\ud83c\udf31" },
                { label: "Most Water Efficient", winner: "Capsicum (92%)", icon: "\ud83d\udca7" },
                { label: "Highest Profit/acre", winner: "Grapes (\u20b940.3K)", icon: "\ud83d\udcc8" },
                { label: "Best Pest Resistance", winner: "Capsicum (85%)", icon: "\ud83d\udee1\ufe0f" },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center py-1.5">
                  <Text style={{ fontSize: 14 }}>{item.icon}</Text>
                  <Text className="text-yellow-700 text-xs ml-2">{item.label}:</Text>
                  <Text className="text-yellow-900 text-xs font-dm-sans-bold ml-1">{item.winner}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
