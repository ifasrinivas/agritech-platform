import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { marketPrices, marketForecasts } from "@/data/market";

type MarketTab = "prices" | "forecast" | "inputs";

const trendIcons = { up: "\ud83d\udcc8", down: "\ud83d\udcc9", stable: "\u27a1\ufe0f" };
const trendColors = { up: "#22c55e", down: "#ef4444", stable: "#6b7280" };
const recColors = { sell: "#ef4444", hold: "#f59e0b", wait: "#3b82f6" };
const recIcons = { sell: "\ud83d\udfe2 Sell Now", hold: "\ud83d\udfe1 Hold", wait: "\ud83d\udd35 Wait" };

export default function MarketScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MarketTab>("prices");

  const cropPrices = marketPrices.filter((p) => !["Urea", "DAP"].includes(p.commodity));
  const inputPrices = marketPrices.filter((p) => ["Urea", "DAP"].includes(p.commodity));

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\ud83d\udcb9"} Market Intelligence
          </Text>
          <Text className="text-typography-400 text-xs">APMC prices \u2022 Updated today</Text>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row mx-5 my-3 bg-background-100 rounded-xl p-1">
        {(["prices", "forecast", "inputs"] as MarketTab[]).map((tab) => (
          <Pressable
            key={tab}
            className="flex-1 items-center py-2 rounded-lg"
            style={activeTab === tab ? { backgroundColor: "#16a34a" } : {}}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              className={`text-xs font-dm-sans-medium capitalize ${
                activeTab === tab ? "text-white" : "text-typography-500"
              }`}
            >
              {tab === "prices" ? "\ud83c\udf3e Crop Prices" : tab === "forecast" ? "\ud83d\udd2e Forecast" : "\ud83e\uddea Inputs"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {activeTab === "prices" && (
          <View className="px-5">
            {/* Price Cards */}
            {cropPrices.map((price) => (
              <View key={price.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-typography-900 font-dm-sans-bold text-base">
                        {price.commodity}
                      </Text>
                      <Text className="text-typography-400 text-xs ml-2 font-dm-sans-regular">
                        ({price.variety})
                      </Text>
                    </View>
                    <Text className="text-typography-500 text-xs mt-0.5">{price.market}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-typography-900 text-xl font-dm-sans-bold">
                      {"\u20b9"}{price.modalPrice}
                    </Text>
                    <View className="flex-row items-center">
                      <Text style={{ fontSize: 12 }}>{trendIcons[price.trend]}</Text>
                      <Text
                        className="text-xs font-dm-sans-bold ml-1"
                        style={{ color: trendColors[price.trend] }}
                      >
                        {price.changePercent > 0 ? "+" : ""}{price.changePercent}%
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Price Range Bar */}
                <View className="mt-3">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-typography-400 text-xs">
                      Min: {"\u20b9"}{price.minPrice}
                    </Text>
                    <Text className="text-typography-400 text-xs">
                      Max: {"\u20b9"}{price.maxPrice}
                    </Text>
                  </View>
                  <View className="h-2 bg-background-200 rounded-full overflow-hidden relative">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${((price.modalPrice - price.minPrice) / (price.maxPrice - price.minPrice)) * 100}%`,
                        backgroundColor: trendColors[price.trend],
                      }}
                    />
                  </View>
                  <Text className="text-typography-400 text-xs text-center mt-1">
                    per {price.unit}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "forecast" && (
          <View className="px-5">
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-4">
              <Text className="text-blue-800 font-dm-sans-bold text-sm">
                {"\ud83e\udde0"} AI-Powered Price Predictions
              </Text>
              <Text className="text-blue-600 text-xs font-dm-sans-regular mt-1">
                Based on historical data, supply patterns, and market trends
              </Text>
            </View>

            {marketForecasts.map((forecast, i) => {
              const priceDiff = forecast.predictedPrice - forecast.currentPrice;
              const isUp = priceDiff > 0;
              const recColor = recColors[forecast.recommendation];

              return (
                <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-typography-900 font-dm-sans-bold text-base">
                      {forecast.commodity}
                    </Text>
                    <View
                      className="rounded-full px-3 py-1"
                      style={{ backgroundColor: recColor + "15" }}
                    >
                      <Text className="text-xs font-dm-sans-bold" style={{ color: recColor }}>
                        {recIcons[forecast.recommendation]}
                      </Text>
                    </View>
                  </View>

                  {/* Price Comparison */}
                  <View className="flex-row items-center justify-between bg-background-100 rounded-xl p-3 mb-3">
                    <View className="items-center flex-1">
                      <Text className="text-typography-400 text-xs">Current</Text>
                      <Text className="text-typography-900 text-lg font-dm-sans-bold">
                        {"\u20b9"}{forecast.currentPrice}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 24 }}>{isUp ? "\u2192\ud83d\udcc8" : "\u2192\ud83d\udcc9"}</Text>
                    <View className="items-center flex-1">
                      <Text className="text-typography-400 text-xs">Predicted</Text>
                      <Text
                        className="text-lg font-dm-sans-bold"
                        style={{ color: isUp ? "#22c55e" : "#ef4444" }}
                      >
                        {"\u20b9"}{forecast.predictedPrice}
                      </Text>
                    </View>
                  </View>

                  {/* Confidence */}
                  <View className="mb-2">
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-typography-500 text-xs">Prediction Confidence</Text>
                      <Text className="text-typography-700 text-xs font-dm-sans-bold">
                        {forecast.confidence}%
                      </Text>
                    </View>
                    <View className="h-2 bg-background-200 rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${forecast.confidence}%`,
                          backgroundColor: forecast.confidence > 75 ? "#22c55e" : "#f59e0b",
                        }}
                      />
                    </View>
                  </View>

                  <Text className="text-typography-400 text-xs mb-2">
                    Timeframe: {forecast.timeframe}
                  </Text>

                  {/* Factors */}
                  <View className="bg-background-100 rounded-xl p-3">
                    <Text className="text-typography-700 text-xs font-dm-sans-bold mb-1">
                      Key Factors:
                    </Text>
                    {forecast.factors.map((factor, j) => (
                      <Text key={j} className="text-typography-600 text-xs leading-5">
                        {"\u2022"} {factor}
                      </Text>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === "inputs" && (
          <View className="px-5">
            <Text className="text-typography-700 font-dm-sans-bold text-base mb-3">
              Agricultural Inputs Pricing
            </Text>

            {inputPrices.map((price) => (
              <View key={price.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-typography-900 font-dm-sans-bold text-base">
                      {price.commodity}
                    </Text>
                    <Text className="text-typography-500 text-xs">{price.variety} \u2022 {price.market}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-typography-900 text-xl font-dm-sans-bold">
                      {"\u20b9"}{price.modalPrice}
                    </Text>
                    <Text className="text-typography-400 text-xs">per {price.unit}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Input Calculator */}
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mt-2">
              <Text className="text-green-800 font-dm-sans-bold text-sm mb-2">
                {"\ud83e\uddee"} Quick Input Calculator
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  { label: "Urea for 45.5 acres", value: "\u20b924,843", detail: "93.5 bags needed" },
                  { label: "DAP for 45.5 acres", value: "\u20b961,425", detail: "45.5 bags needed" },
                  { label: "MOP (60% K\u2082O)", value: "\u20b938,675", detail: "45.5 bags @ \u20b9850" },
                  { label: "Neem Oil (1500ppm)", value: "\u20b94,550", detail: "9.1L @ \u20b9500/L" },
                ].map((item, i) => (
                  <View key={i} className="bg-white rounded-xl p-3" style={{ width: "48%" }}>
                    <Text className="text-green-800 text-xs font-dm-sans-medium">{item.label}</Text>
                    <Text className="text-green-900 text-lg font-dm-sans-bold">{item.value}</Text>
                    <Text className="text-green-600 text-xs">{item.detail}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Subsidy Info */}
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mt-3">
              <Text className="text-blue-800 font-dm-sans-bold text-sm mb-2">
                {"\ud83c\udfdb\ufe0f"} Government Subsidies
              </Text>
              {[
                { scheme: "PM-KISAN", benefit: "\u20b96,000/year direct transfer", status: "Active" },
                { scheme: "Soil Health Card", benefit: "Free soil testing", status: "Apply" },
                { scheme: "PMFBY Crop Insurance", benefit: "1.5-5% premium (Rabi)", status: "Active" },
                { scheme: "Micro Irrigation Subsidy", benefit: "55-70% on drip/sprinkler", status: "Apply" },
              ].map((item, i) => (
                <View
                  key={i}
                  className="flex-row items-center justify-between py-2"
                  style={i < 3 ? { borderBottomWidth: 1, borderBottomColor: "#bfdbfe" } : {}}
                >
                  <View className="flex-1">
                    <Text className="text-blue-900 text-sm font-dm-sans-medium">{item.scheme}</Text>
                    <Text className="text-blue-600 text-xs">{item.benefit}</Text>
                  </View>
                  <View
                    className="rounded-full px-2 py-0.5"
                    style={{ backgroundColor: item.status === "Active" ? "#22c55e20" : "#3b82f620" }}
                  >
                    <Text
                      className="text-xs font-dm-sans-bold"
                      style={{ color: item.status === "Active" ? "#22c55e" : "#3b82f6" }}
                    >
                      {item.status}
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
