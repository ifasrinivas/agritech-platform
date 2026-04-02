import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fields } from "@/data/agritech";

type PlannerTab = "seasonal" | "rotation" | "budget" | "resources";

export default function FarmPlannerScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PlannerTab>("seasonal");

  const totalArea = fields.reduce((s, f) => s + f.area, 0);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\ud83d\udccb"} Farm Planner
          </Text>
          <Text className="text-typography-400 text-xs">Season planning & resource management</Text>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-12 mx-5 mt-3 mb-2">
        {([
          { key: "seasonal" as PlannerTab, label: "\ud83c\udf3e Seasonal Plan" },
          { key: "rotation" as PlannerTab, label: "\ud83d\udd04 Crop Rotation" },
          { key: "budget" as PlannerTab, label: "\ud83d\udcb0 Budget" },
          { key: "resources" as PlannerTab, label: "\ud83d\udce6 Resources" },
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
        {activeTab === "seasonal" && (
          <View className="px-5">
            {/* Current Season */}
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-green-800 font-dm-sans-bold text-base">
                    Rabi Season 2025-26
                  </Text>
                  <Text className="text-green-600 text-xs">Oct 2025 - Apr 2026</Text>
                </View>
                <View className="bg-green-500 rounded-full px-3 py-1">
                  <Text className="text-white text-xs font-dm-sans-bold">Active</Text>
                </View>
              </View>
              <View className="mt-3">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-green-700 text-xs">Season Progress</Text>
                  <Text className="text-green-800 text-xs font-dm-sans-bold">78%</Text>
                </View>
                <View className="h-2 bg-green-200 rounded-full overflow-hidden">
                  <View className="h-full rounded-full bg-green-500" style={{ width: "78%" }} />
                </View>
              </View>
            </View>

            {/* Next Season Planning */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
              Kharif 2026 Plan (Jun - Oct)
            </Text>

            {[
              {
                field: "North Block",
                current: "Wheat",
                planned: "Soybean",
                area: 12.5,
                reason: "Nitrogen fixation after cereal, good monsoon crop",
                sowDate: "Jun 15-20",
                color: "#22c55e",
              },
              {
                field: "South Block",
                current: "Tomato",
                planned: "Paddy (Basmati)",
                area: 8.0,
                reason: "Good water availability, premium price for Basmati",
                sowDate: "Jun 25-30",
                color: "#3b82f6",
              },
              {
                field: "Central Block",
                current: "Onion",
                planned: "Green Manure + Kharif Onion",
                area: 5.0,
                reason: "Soil rejuvenation needed, late Kharif onion for higher prices",
                sowDate: "Jun 01 (green manure), Aug 15 (onion)",
                color: "#8b5cf6",
              },
              {
                field: "East Block",
                current: "Rice (cont.)",
                planned: "Rice (Kharif main crop)",
                area: 10.0,
                reason: "Perennial paddy field, excellent water management",
                sowDate: "Jun 20-25",
                color: "#06b6d4",
              },
              {
                field: "Greenhouse",
                current: "Capsicum",
                planned: "Cucumber + Cherry Tomato",
                area: 4.0,
                reason: "High-value crops, protected cultivation advantage",
                sowDate: "Jul 01",
                color: "#f59e0b",
              },
            ].map((plan, i) => (
              <View
                key={i}
                className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-typography-900 font-dm-sans-bold text-sm">{plan.field}</Text>
                  <Text className="text-typography-400 text-xs">{plan.area} acres</Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <View className="bg-background-200 rounded-lg px-2 py-1">
                    <Text className="text-typography-600 text-xs">{plan.current}</Text>
                  </View>
                  <Text className="text-typography-400 mx-2">{"\u2192"}</Text>
                  <View className="rounded-lg px-2 py-1" style={{ backgroundColor: plan.color + "15" }}>
                    <Text className="text-xs font-dm-sans-bold" style={{ color: plan.color }}>{plan.planned}</Text>
                  </View>
                </View>
                <Text className="text-typography-500 text-xs leading-4">{plan.reason}</Text>
                <Text className="text-typography-400 text-xs mt-1">{"\ud83d\udcc5"} Sow: {plan.sowDate}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "rotation" && (
          <View className="px-5">
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-4">
              <Text className="text-blue-800 font-dm-sans-bold text-sm">
                {"\ud83d\udd04"} 3-Year Crop Rotation Plan
              </Text>
              <Text className="text-blue-600 text-xs mt-1">
                Optimized for soil health, pest break, and nutrient cycling
              </Text>
            </View>

            {/* Rotation Table */}
            {[
              {
                field: "North Block (12.5 ac)",
                rotation: [
                  { season: "Rabi 25-26", crop: "Wheat", icon: "\ud83c\udf3e" },
                  { season: "Kharif 26", crop: "Soybean", icon: "\ud83c\udf3e" },
                  { season: "Rabi 26-27", crop: "Chickpea", icon: "\ud83c\udf3e" },
                  { season: "Kharif 27", crop: "Maize", icon: "\ud83c\udf3d" },
                  { season: "Rabi 27-28", crop: "Wheat", icon: "\ud83c\udf3e" },
                  { season: "Kharif 28", crop: "Green Manure", icon: "\ud83c\udf3f" },
                ],
              },
              {
                field: "South Block (8 ac)",
                rotation: [
                  { season: "Rabi 25-26", crop: "Tomato", icon: "\ud83c\udf45" },
                  { season: "Kharif 26", crop: "Paddy", icon: "\ud83c\udf3e" },
                  { season: "Rabi 26-27", crop: "Cabbage", icon: "\ud83e\udd66" },
                  { season: "Kharif 27", crop: "Soybean", icon: "\ud83c\udf3e" },
                  { season: "Rabi 27-28", crop: "Tomato", icon: "\ud83c\udf45" },
                  { season: "Kharif 28", crop: "Paddy", icon: "\ud83c\udf3e" },
                ],
              },
              {
                field: "Central Block (5 ac)",
                rotation: [
                  { season: "Rabi 25-26", crop: "Onion", icon: "\ud83e\uddc5" },
                  { season: "Kharif 26", crop: "Green Manure", icon: "\ud83c\udf3f" },
                  { season: "Rabi 26-27", crop: "Garlic", icon: "\ud83e\uddc4" },
                  { season: "Kharif 27", crop: "Okra", icon: "\ud83c\udf3f" },
                  { season: "Rabi 27-28", crop: "Onion", icon: "\ud83e\uddc5" },
                  { season: "Kharif 28", crop: "Cowpea", icon: "\ud83c\udf3e" },
                ],
              },
            ].map((item, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <Text className="text-typography-900 font-dm-sans-bold text-sm mb-3">{item.field}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-1">
                    {item.rotation.map((rot, j) => (
                      <View key={j} className="items-center" style={{ width: 80 }}>
                        <View
                          className="rounded-xl p-2 items-center w-full"
                          style={{
                            backgroundColor: j === 0 ? "#22c55e15" : "#f3f4f6",
                            borderWidth: j === 0 ? 1 : 0,
                            borderColor: "#22c55e40",
                          }}
                        >
                          <Text style={{ fontSize: 18 }}>{rot.icon}</Text>
                          <Text className="text-typography-800 text-xs font-dm-sans-medium text-center mt-1" numberOfLines={1}>
                            {rot.crop}
                          </Text>
                        </View>
                        <Text className="text-typography-400 text-xs mt-1" style={{ fontSize: 8 }}>{rot.season}</Text>
                        {j < item.rotation.length - 1 && (
                          <Text className="text-typography-300 absolute right-[-8]" style={{ top: 16 }}>{"\u2192"}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ))}

            {/* Rotation Benefits */}
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200">
              <Text className="text-green-800 font-dm-sans-bold text-sm mb-2">
                Benefits of This Rotation
              </Text>
              {[
                "Legume crops (Soybean, Chickpea) fix 80-120 kg N/ha",
                "Pest cycle breaks reduce pesticide costs by 25-30%",
                "Green manure improves organic carbon by 0.1-0.2% per year",
                "Diverse root systems improve soil structure",
                "Reduced risk from single-crop market fluctuations",
              ].map((item, i) => (
                <Text key={i} className="text-green-700 text-xs leading-5">{"\u2022"} {item}</Text>
              ))}
            </View>
          </View>
        )}

        {activeTab === "budget" && (
          <View className="px-5">
            {/* Season Budget Summary */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
                Rabi 2025-26 Budget Summary
              </Text>

              <View className="flex-row mb-4">
                <View className="flex-1 bg-green-50 rounded-xl p-3 mr-2">
                  <Text className="text-green-600 text-xs">Expected Revenue</Text>
                  <Text className="text-green-800 text-xl font-dm-sans-bold">{"\u20b9"}12.5L</Text>
                </View>
                <View className="flex-1 bg-red-50 rounded-xl p-3 ml-2">
                  <Text className="text-red-600 text-xs">Total Expenses</Text>
                  <Text className="text-red-800 text-xl font-dm-sans-bold">{"\u20b9"}3.8L</Text>
                </View>
              </View>

              <View className="bg-blue-50 rounded-xl p-3 mb-3">
                <Text className="text-blue-600 text-xs">Projected Net Profit</Text>
                <Text className="text-blue-800 text-2xl font-dm-sans-bold">{"\u20b9"}8.7 Lakhs</Text>
                <Text className="text-blue-600 text-xs">ROI: 229%</Text>
              </View>

              {/* Expense Breakdown */}
              <Text className="text-typography-700 font-dm-sans-bold text-sm mb-2">Expense Breakdown</Text>
              {[
                { category: "Seeds & Seedlings", amount: 33500, pct: 8.8, color: "#8b5cf6" },
                { category: "Fertilizers & Manure", amount: 79500, pct: 20.9, color: "#22c55e" },
                { category: "Pesticides & Sprays", amount: 35200, pct: 9.3, color: "#ef4444" },
                { category: "Irrigation & Water", amount: 45000, pct: 11.8, color: "#3b82f6" },
                { category: "Labor", amount: 108000, pct: 28.4, color: "#f59e0b" },
                { category: "Machinery & Fuel", amount: 42000, pct: 11.1, color: "#06b6d4" },
                { category: "Transport & Marketing", amount: 25000, pct: 6.6, color: "#f97316" },
                { category: "Miscellaneous", amount: 11800, pct: 3.1, color: "#6b7280" },
              ].map((item, i) => (
                <View key={i} className="mb-2">
                  <View className="flex-row justify-between mb-0.5">
                    <Text className="text-typography-700 text-xs">{item.category}</Text>
                    <Text className="text-typography-500 text-xs">{"\u20b9"}{item.amount.toLocaleString()} ({item.pct}%)</Text>
                  </View>
                  <View className="h-2 bg-background-200 rounded-full overflow-hidden">
                    <View className="h-full rounded-full" style={{ width: `${item.pct * 3}%`, backgroundColor: item.color }} />
                  </View>
                </View>
              ))}
            </View>

            {/* Per-Crop Economics */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Per-Crop Economics</Text>
            {[
              { crop: "Wheat", area: 12.5, cost: 85000, revenue: 210000, icon: "\ud83c\udf3e" },
              { crop: "Tomato", area: 8.0, cost: 72000, revenue: 192000, icon: "\ud83c\udf45" },
              { crop: "Grapes", area: 6.0, cost: 148000, revenue: 390000, icon: "\ud83c\udf47" },
              { crop: "Rice", area: 10.0, cost: 45000, revenue: 160000, icon: "\ud83c\udf3e" },
              { crop: "Onion", area: 5.0, cost: 38500, revenue: 130000, icon: "\ud83e\uddc5" },
              { crop: "Capsicum", area: 4.0, cost: 45000, revenue: 168000, icon: "\ud83c\udf36\ufe0f" },
            ].map((item, i) => {
              const profit = item.revenue - item.cost;
              const roi = ((profit / item.cost) * 100).toFixed(0);
              return (
                <View key={i} className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100 flex-row items-center">
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.crop}</Text>
                    <Text className="text-typography-400 text-xs">{item.area} ac \u2022 Cost: {"\u20b9"}{(item.cost/1000).toFixed(0)}K</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-green-600 font-dm-sans-bold text-sm">{"\u20b9"}{(profit/1000).toFixed(0)}K</Text>
                    <Text className="text-typography-400 text-xs">ROI: {roi}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === "resources" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
              Resource Inventory
            </Text>

            {/* Equipment */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-700 font-dm-sans-bold text-sm mb-3">{"\ud83d\ude9c"} Equipment</Text>
              {[
                { name: "Tractor (35 HP)", status: "Operational", next: "Service due May 15", icon: "\ud83d\ude9c" },
                { name: "Rotavator", status: "Operational", next: "Available", icon: "\u2699\ufe0f" },
                { name: "Sprayer (Power)", status: "Needs Repair", next: "Nozzle replacement needed", icon: "\ud83d\udca8" },
                { name: "Drip System (40ac)", status: "Active", next: "Filter cleaning Apr 10", icon: "\ud83d\udca7" },
                { name: "Greenhouse Fan/Pad", status: "Active", next: "Pad replacement Jun", icon: "\ud83c\udf21\ufe0f" },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center py-2.5" style={i < 4 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-800 text-sm font-dm-sans-medium">{item.name}</Text>
                    <Text className="text-typography-400 text-xs">{item.next}</Text>
                  </View>
                  <View
                    className="rounded-full px-2 py-0.5"
                    style={{
                      backgroundColor: item.status === "Needs Repair" ? "#ef444415" : "#22c55e15",
                    }}
                  >
                    <Text
                      className="text-xs font-dm-sans-medium"
                      style={{ color: item.status === "Needs Repair" ? "#ef4444" : "#22c55e" }}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Labor */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-700 font-dm-sans-bold text-sm mb-3">{"\ud83d\udc77"} Labor Force</Text>
              <View className="flex-row gap-3 mb-3">
                <View className="flex-1 bg-blue-50 rounded-xl p-3 items-center">
                  <Text className="text-blue-800 text-xl font-dm-sans-bold">8</Text>
                  <Text className="text-blue-600 text-xs">Permanent</Text>
                </View>
                <View className="flex-1 bg-yellow-50 rounded-xl p-3 items-center">
                  <Text className="text-yellow-800 text-xl font-dm-sans-bold">12</Text>
                  <Text className="text-yellow-600 text-xs">Seasonal</Text>
                </View>
                <View className="flex-1 bg-green-50 rounded-xl p-3 items-center">
                  <Text className="text-green-800 text-xl font-dm-sans-bold">{"\u20b9"}8.5K</Text>
                  <Text className="text-green-600 text-xs">Avg Monthly</Text>
                </View>
              </View>
              <Text className="text-typography-500 text-xs">
                Peak labor demand: Grape harvest (Apr 5-15) + Tomato staking = 20 workers needed
              </Text>
            </View>

            {/* Input Inventory */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100">
              <Text className="text-typography-700 font-dm-sans-bold text-sm mb-3">{"\ud83d\udce6"} Input Stock</Text>
              {[
                { item: "Urea (46% N)", stock: "8 bags", need: "15 bags", status: "low" },
                { item: "DAP (18-46-0)", stock: "12 bags", need: "10 bags", status: "ok" },
                { item: "MOP (60% K\u2082O)", stock: "5 bags", need: "8 bags", status: "low" },
                { item: "Neem Oil 1500ppm", stock: "4 liters", need: "10 liters", status: "low" },
                { item: "Mancozeb 75% WP", stock: "3 kg", need: "2 kg", status: "ok" },
                { item: "Drip fittings", stock: "Adequate", need: "-", status: "ok" },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center py-2" style={i < 5 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <View className="flex-1">
                    <Text className="text-typography-800 text-xs font-dm-sans-medium">{item.item}</Text>
                    <Text className="text-typography-400 text-xs">Stock: {item.stock} \u2022 Need: {item.need}</Text>
                  </View>
                  <View
                    className="rounded-full px-2 py-0.5"
                    style={{ backgroundColor: item.status === "low" ? "#ef444415" : "#22c55e15" }}
                  >
                    <Text className="text-xs font-dm-sans-medium" style={{ color: item.status === "low" ? "#ef4444" : "#22c55e" }}>
                      {item.status === "low" ? "Restock" : "OK"}
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
