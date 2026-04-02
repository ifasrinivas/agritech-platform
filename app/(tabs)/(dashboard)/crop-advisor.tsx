import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type AdvisorTab = "recommend" | "companion" | "rotation" | "calendar";

interface CropRecommendation {
  crop: string;
  score: number;
  icon: string;
  season: string;
  reasons: string[];
  risks: string[];
  expectedYield: string;
  expectedRevenue: string;
  waterNeed: string;
  duration: string;
}

const recommendations: CropRecommendation[] = [
  {
    crop: "Soybean", score: 95, icon: "\ud83c\udf3e", season: "Kharif 2026",
    reasons: [
      "Excellent nitrogen fixation after Wheat (saves \u20b94,000/acre in fertilizer)",
      "Soil pH 7.2 ideal for Soybean (6.5-7.5 range)",
      "Good monsoon forecast - adequate rainfall expected",
      "Market price trending up (+8% YoY), MSP \u20b94,600/qtl",
    ],
    risks: ["Susceptible to Girdle Beetle in July", "Waterlogging if drainage poor"],
    expectedYield: "12-15 qtl/acre", expectedRevenue: "\u20b955,000-69,000/acre",
    waterNeed: "450-500mm (mostly rainfed)", duration: "100-110 days",
  },
  {
    crop: "Green Gram (Moong)", score: 88, icon: "\ud83c\udf3e", season: "Kharif 2026",
    reasons: [
      "Short duration (65 days) - allows double cropping",
      "Legume - fixes 40-50 kg N/ha for next season",
      "High market demand for organic Moong",
      "Low water requirement suits your drip infrastructure",
    ],
    risks: ["Yellow Mosaic Virus risk in humid conditions", "Market price volatile"],
    expectedYield: "5-7 qtl/acre", expectedRevenue: "\u20b935,000-50,000/acre",
    waterNeed: "250-300mm", duration: "60-70 days",
  },
  {
    crop: "Turmeric", score: 82, icon: "\ud83e\uddc1", season: "Kharif 2026",
    reasons: [
      "Nashik climate well-suited (humidity + temp)",
      "9-month crop with excellent storage potential",
      "Organic premium 40-50% above conventional",
      "Can be grown under drip - your infra supports it",
    ],
    risks: ["Long duration locks up land for 9 months", "Rhizome rot if drainage poor", "High labor for harvest"],
    expectedYield: "80-100 qtl/acre (fresh)", expectedRevenue: "\u20b980,000-1,20,000/acre",
    waterNeed: "700-800mm (drip efficient)", duration: "270 days",
  },
  {
    crop: "Maize (Sweet Corn)", score: 79, icon: "\ud83c\udf3d", season: "Kharif 2026",
    reasons: [
      "Fast growing (90 days), good rotation crop",
      "Local demand from processing units in Nashik",
      "Tolerant to moderate waterlogging",
      "Good for silage production (dairy integration)",
    ],
    risks: ["Fall Armyworm endemic - need monitoring", "Price suppression if mass production"],
    expectedYield: "25-30 qtl/acre", expectedRevenue: "\u20b940,000-55,000/acre",
    waterNeed: "500-600mm", duration: "85-95 days",
  },
];

const companionPlants = [
  {
    crop1: "Tomato", crop2: "Basil", benefit: "Basil repels aphids and whiteflies from tomato. Improves flavor (claimed).",
    icon1: "\ud83c\udf45", icon2: "\ud83c\udf3f", type: "beneficial" as const,
  },
  {
    crop1: "Onion", crop2: "Carrot", benefit: "Onion scent masks carrot fly. Carrot scent masks onion fly. Mutual protection.",
    icon1: "\ud83e\uddc5", icon2: "\ud83e\udd55", type: "beneficial" as const,
  },
  {
    crop1: "Maize", crop2: "Bean + Squash", benefit: "Three Sisters: Maize supports beans, beans fix N, squash covers soil (weed suppression).",
    icon1: "\ud83c\udf3d", icon2: "\ud83c\udf3e + \ud83c\udf83", type: "beneficial" as const,
  },
  {
    crop1: "Grape", crop2: "Mustard cover crop", benefit: "Mustard between rows attracts beneficial insects and suppresses nematodes.",
    icon1: "\ud83c\udf47", icon2: "\ud83c\udf3c", type: "beneficial" as const,
  },
  {
    crop1: "Tomato", crop2: "Fennel", benefit: "Fennel inhibits tomato growth. Keep separated by at least 10 meters.",
    icon1: "\ud83c\udf45", icon2: "\ud83c\udf3f", type: "avoid" as const,
  },
  {
    crop1: "Onion", crop2: "Beans/Peas", benefit: "Alliums stunt legume growth. Do not intercrop or plant immediately after.",
    icon1: "\ud83e\uddc5", icon2: "\ud83c\udf3e", type: "avoid" as const,
  },
];

export default function CropAdvisorScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdvisorTab>("recommend");
  const [expandedCrop, setExpandedCrop] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\ud83e\udde0"} AI Crop Advisor
          </Text>
          <Text className="text-typography-400 text-xs">Smart recommendations for your farm</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-12 mx-5 mt-3 mb-2">
        {([
          { key: "recommend" as AdvisorTab, label: "\ud83c\udf31 Recommendations" },
          { key: "companion" as AdvisorTab, label: "\ud83e\udd1d Companion Plants" },
          { key: "rotation" as AdvisorTab, label: "\ud83d\udd04 Smart Rotation" },
          { key: "calendar" as AdvisorTab, label: "\ud83d\udcc5 Sowing Guide" },
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
        {activeTab === "recommend" && (
          <View className="px-5">
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-4">
              <Text className="text-blue-800 font-dm-sans-bold text-sm">
                {"\ud83e\udde0"} AI Analysis for Kharif 2026
              </Text>
              <Text className="text-blue-600 text-xs mt-1">
                Based on your soil health, climate, market trends, crop history, and infrastructure
              </Text>
            </View>

            {recommendations.map((rec) => {
              const isExpanded = expandedCrop === rec.crop;
              const scoreColor = rec.score >= 90 ? "#22c55e" : rec.score >= 80 ? "#84cc16" : rec.score >= 70 ? "#f59e0b" : "#ef4444";

              return (
                <Pressable key={rec.crop} onPress={() => setExpandedCrop(isExpanded ? null : rec.crop)}>
                  <View className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center">
                        <Text style={{ fontSize: 28 }}>{rec.icon}</Text>
                        <View className="ml-3">
                          <Text className="text-typography-900 font-dm-sans-bold text-base">{rec.crop}</Text>
                          <Text className="text-typography-400 text-xs">{rec.season} \u2022 {rec.duration}</Text>
                        </View>
                      </View>
                      <View className="items-center">
                        <View
                          className="w-14 h-14 rounded-full items-center justify-center"
                          style={{ backgroundColor: scoreColor + "15", borderWidth: 3, borderColor: scoreColor }}
                        >
                          <Text className="font-dm-sans-bold text-lg" style={{ color: scoreColor }}>
                            {rec.score}
                          </Text>
                        </View>
                        <Text className="text-typography-400 text-xs mt-0.5">score</Text>
                      </View>
                    </View>

                    {/* Quick metrics */}
                    <View className="flex-row gap-2 mb-2">
                      {[
                        { label: "Yield", value: rec.expectedYield, color: "#22c55e" },
                        { label: "Revenue", value: rec.expectedRevenue.split("-")[0] + "+", color: "#3b82f6" },
                        { label: "Water", value: rec.waterNeed, color: "#06b6d4" },
                      ].map((m, i) => (
                        <View key={i} className="flex-1 rounded-lg p-2 items-center" style={{ backgroundColor: m.color + "08" }}>
                          <Text className="text-typography-400" style={{ fontSize: 9 }}>{m.label}</Text>
                          <Text className="font-dm-sans-bold" style={{ fontSize: 10, color: m.color }}>{m.value}</Text>
                        </View>
                      ))}
                    </View>

                    {isExpanded && (
                      <View className="mt-2 pt-2 border-t border-outline-100">
                        <Text className="text-typography-900 font-dm-sans-bold text-xs mb-1">
                          {"\u2705"} Why This Crop
                        </Text>
                        {rec.reasons.map((r, i) => (
                          <Text key={i} className="text-green-700 text-xs leading-5">{"\u2022"} {r}</Text>
                        ))}

                        <Text className="text-typography-900 font-dm-sans-bold text-xs mt-3 mb-1">
                          {"\u26a0\ufe0f"} Risk Factors
                        </Text>
                        {rec.risks.map((r, i) => (
                          <Text key={i} className="text-red-600 text-xs leading-5">{"\u2022"} {r}</Text>
                        ))}

                        <Pressable className="bg-green-500 rounded-xl py-3 items-center mt-3">
                          <Text className="text-white font-dm-sans-bold text-sm">Add to Season Plan</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {activeTab === "companion" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
              Companion Planting Guide
            </Text>

            <Text className="text-green-700 font-dm-sans-bold text-sm mb-2">{"\u2705"} Beneficial Pairs</Text>
            {companionPlants.filter((c) => c.type === "beneficial").map((pair, i) => (
              <View key={i} className="bg-green-50 rounded-xl p-3 mb-2 border border-green-200">
                <View className="flex-row items-center mb-1">
                  <Text style={{ fontSize: 18 }}>{pair.icon1}</Text>
                  <Text className="text-green-600 mx-2 font-dm-sans-bold">+</Text>
                  <Text style={{ fontSize: 18 }}>{pair.icon2}</Text>
                  <Text className="text-green-800 font-dm-sans-bold text-sm ml-2">
                    {pair.crop1} + {pair.crop2}
                  </Text>
                </View>
                <Text className="text-green-700 text-xs leading-4">{pair.benefit}</Text>
              </View>
            ))}

            <Text className="text-red-700 font-dm-sans-bold text-sm mb-2 mt-4">{"\u274c"} Avoid Together</Text>
            {companionPlants.filter((c) => c.type === "avoid").map((pair, i) => (
              <View key={i} className="bg-red-50 rounded-xl p-3 mb-2 border border-red-200">
                <View className="flex-row items-center mb-1">
                  <Text style={{ fontSize: 18 }}>{pair.icon1}</Text>
                  <Text className="text-red-600 mx-2 font-dm-sans-bold">{"\u2260"}</Text>
                  <Text style={{ fontSize: 18 }}>{pair.icon2}</Text>
                  <Text className="text-red-800 font-dm-sans-bold text-sm ml-2">
                    {pair.crop1} + {pair.crop2}
                  </Text>
                </View>
                <Text className="text-red-700 text-xs leading-4">{pair.benefit}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "rotation" && (
          <View className="px-5">
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-2">
                AI Rotation Optimizer
              </Text>
              <Text className="text-typography-500 text-xs mb-3">
                Suggested crop sequence based on nutrient cycling, pest breaks, and profitability
              </Text>

              {[
                {
                  principle: "Cereal \u2192 Legume \u2192 Root Crop",
                  benefit: "Balances N fixation with N consumption. Root crops break pest cycles.",
                  example: "Wheat \u2192 Soybean \u2192 Onion",
                  icon: "\ud83d\udd04",
                },
                {
                  principle: "Deep root \u2192 Shallow root",
                  benefit: "Deep roots bring up subsoil nutrients. Shallow roots use topsoil layer.",
                  example: "Grapes (perennial deep) \u2192 Onion (shallow) adjacent",
                  icon: "\ud83c\udf31",
                },
                {
                  principle: "Heavy feeder \u2192 Light feeder \u2192 Soil builder",
                  benefit: "Prevents nutrient depletion. Soil builders (legumes/green manure) restore fertility.",
                  example: "Tomato (heavy) \u2192 Beans (light + N-fix) \u2192 Green Manure",
                  icon: "\ud83e\udea8",
                },
                {
                  principle: "Alternate plant families",
                  benefit: "Different pest and disease spectrums. Breaks pathogen buildup.",
                  example: "Solanaceae (Tomato) \u2192 Leguminosae (Soybean) \u2192 Liliaceae (Onion)",
                  icon: "\ud83d\udee1\ufe0f",
                },
              ].map((item, i) => (
                <View key={i} className="rounded-xl p-3 mb-2" style={{ backgroundColor: "#f3f4f6" }}>
                  <View className="flex-row items-center mb-1">
                    <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                    <Text className="text-typography-900 font-dm-sans-bold text-sm ml-2">{item.principle}</Text>
                  </View>
                  <Text className="text-typography-600 text-xs leading-4">{item.benefit}</Text>
                  <Text className="text-blue-600 text-xs font-dm-sans-medium mt-1">Example: {item.example}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "calendar" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
              Regional Sowing Calendar - Nashik
            </Text>

            {[
              {
                month: "June",
                crops: [
                  { name: "Soybean", window: "Jun 15-30", type: "Kharif" },
                  { name: "Green Gram", window: "Jun 15-Jul 5", type: "Kharif" },
                  { name: "Maize", window: "Jun 20-Jul 10", type: "Kharif" },
                  { name: "Turmeric", window: "Jun 1-20", type: "Kharif" },
                ],
              },
              {
                month: "July",
                crops: [
                  { name: "Paddy (Transplant)", window: "Jul 1-15", type: "Kharif" },
                  { name: "Cotton", window: "Jun 15-Jul 15", type: "Kharif" },
                  { name: "Kharif Onion (Nursery)", window: "Jul 1-15", type: "Kharif" },
                ],
              },
              {
                month: "October",
                crops: [
                  { name: "Wheat", window: "Oct 25-Nov 20", type: "Rabi" },
                  { name: "Chickpea", window: "Oct 15-Nov 5", type: "Rabi" },
                  { name: "Rabi Onion (Nursery)", window: "Oct 1-15", type: "Rabi" },
                ],
              },
              {
                month: "November",
                crops: [
                  { name: "Rabi Onion (Transplant)", window: "Nov 15-Dec 15", type: "Rabi" },
                  { name: "Tomato (Transplant)", window: "Nov 1-Jan 15", type: "Rabi" },
                  { name: "Capsicum", window: "Nov-Feb (Greenhouse)", type: "Rabi" },
                ],
              },
              {
                month: "February-March",
                crops: [
                  { name: "Summer Groundnut", window: "Feb 1-20", type: "Summer" },
                  { name: "Summer Okra", window: "Feb 15-Mar 15", type: "Summer" },
                  { name: "Cucumber (Protected)", window: "Year-round", type: "Protected" },
                ],
              },
            ].map((period, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">
                  {"\ud83d\udcc5"} {period.month}
                </Text>
                {period.crops.map((crop, j) => (
                  <View
                    key={j}
                    className="flex-row items-center justify-between py-2"
                    style={j < period.crops.length - 1 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}
                  >
                    <View>
                      <Text className="text-typography-800 text-sm font-dm-sans-medium">{crop.name}</Text>
                      <Text className="text-typography-400 text-xs">{crop.window}</Text>
                    </View>
                    <View
                      className="rounded-full px-2 py-0.5"
                      style={{
                        backgroundColor:
                          crop.type === "Kharif" ? "#22c55e15" :
                          crop.type === "Rabi" ? "#3b82f615" :
                          crop.type === "Summer" ? "#f59e0b15" : "#8b5cf615",
                      }}
                    >
                      <Text
                        className="text-xs font-dm-sans-medium"
                        style={{
                          color:
                            crop.type === "Kharif" ? "#22c55e" :
                            crop.type === "Rabi" ? "#3b82f6" :
                            crop.type === "Summer" ? "#f59e0b" : "#8b5cf6",
                        }}
                      >
                        {crop.type}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
