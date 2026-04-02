import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fields } from "@/data/agritech";

interface HarvestRecord {
  id: string;
  fieldName: string;
  crop: string;
  date: string;
  quantity: number;
  unit: string;
  quality: string;
  pricePerUnit: number;
  totalRevenue: number;
  buyer?: string;
  notes: string;
  icon: string;
}

const harvestRecords: HarvestRecord[] = [
  {
    id: "h1", fieldName: "West Orchard", crop: "Grapes (Thompson Seedless)", date: "2026-03-15",
    quantity: 42, unit: "quintals", quality: "Export Grade A", pricePerUnit: 5200,
    totalRevenue: 218400, buyer: "Fresh Exports Pvt Ltd", icon: "\ud83c\udf47",
    notes: "Brix: 19.2. Color: Golden green. Berry size: 18-20mm. EU export shipment.",
  },
  {
    id: "h2", fieldName: "West Orchard", crop: "Grapes (Raisin variety)", date: "2026-03-20",
    quantity: 18, unit: "quintals", quality: "Grade B (Raisin)", pricePerUnit: 3800,
    totalRevenue: 68400, buyer: "Kisanara Raisin Unit", icon: "\ud83c\udf47",
    notes: "Sent to raisin-making unit. Expected 6 quintals dried output.",
  },
];

const upcomingHarvests = [
  { field: "West Orchard", crop: "Grapes", date: "Apr 5-15", readiness: 95, quality: "Export A", est: "20 qtl remaining", icon: "\ud83c\udf47", color: "#8b5cf6" },
  { field: "North Block", crop: "Wheat", date: "Apr 18-22", readiness: 72, quality: "Grade A", est: "230 qtl", icon: "\ud83c\udf3e", color: "#f59e0b" },
  { field: "South Block", crop: "Tomato", date: "May 10-Jun 15", readiness: 35, quality: "TBD", est: "96 tons", icon: "\ud83c\udf45", color: "#ef4444" },
  { field: "Central Block", crop: "Onion", date: "May 8-12", readiness: 55, quality: "TBD", est: "40 tons", icon: "\ud83e\uddc5", color: "#f97316" },
  { field: "Greenhouse", crop: "Capsicum", date: "May 25 onwards", readiness: 25, quality: "TBD", est: "60 tons", icon: "\ud83c\udf36\ufe0f", color: "#06b6d4" },
  { field: "East Block", crop: "Rice", date: "Jun 25-30", readiness: 15, quality: "TBD", est: "220 qtl", icon: "\ud83c\udf3e", color: "#22c55e" },
];

export default function HarvestTrackerScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<"upcoming" | "records" | "quality">("upcoming");

  const totalHarvested = harvestRecords.reduce((s, h) => s + h.totalRevenue, 0);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83c\udf3e"} Harvest Tracker</Text>
          <Text className="text-typography-400 text-xs">Yield recording & quality management</Text>
        </View>
        <Pressable className="bg-green-500 rounded-lg px-3 py-1.5">
          <Text className="text-white text-xs font-dm-sans-bold">+ Record</Text>
        </Pressable>
      </View>

      {/* Summary */}
      <View className="flex-row mx-5 mt-3 gap-2 mb-3">
        <View className="flex-1 bg-green-50 rounded-xl p-3 items-center border border-green-200">
          <Text className="text-green-800 text-lg font-dm-sans-bold">{"\u20b9"}{(totalHarvested/1000).toFixed(0)}K</Text>
          <Text className="text-green-600 text-xs">Harvested</Text>
        </View>
        <View className="flex-1 bg-blue-50 rounded-xl p-3 items-center border border-blue-200">
          <Text className="text-blue-800 text-lg font-dm-sans-bold">{upcomingHarvests.length}</Text>
          <Text className="text-blue-600 text-xs">Upcoming</Text>
        </View>
        <View className="flex-1 bg-yellow-50 rounded-xl p-3 items-center border border-yellow-200">
          <Text className="text-yellow-800 text-lg font-dm-sans-bold">60 qtl</Text>
          <Text className="text-yellow-600 text-xs">Total Yield</Text>
        </View>
      </View>

      <View className="flex-row mx-5 mb-3 bg-background-100 rounded-xl p-1">
        {(["upcoming", "records", "quality"] as const).map((t) => (
          <Pressable key={t} className="flex-1 items-center py-2 rounded-lg" style={tab === t ? { backgroundColor: "#16a34a" } : {}} onPress={() => setTab(t)}>
            <Text className={`text-xs font-dm-sans-medium capitalize ${tab === t ? "text-white" : "text-typography-500"}`}>
              {t === "upcoming" ? "\ud83d\udcc5 Upcoming" : t === "records" ? "\ud83d\udccb Records" : "\u2b50 Quality"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {tab === "upcoming" && (
          <View className="px-5">
            {upcomingHarvests.map((h, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 24 }}>{h.icon}</Text>
                    <View className="ml-3">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{h.crop}</Text>
                      <Text className="text-typography-400 text-xs">{h.field} \u2022 {h.date}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-typography-700 font-dm-sans-bold text-sm">{h.est}</Text>
                    <Text className="text-typography-400 text-xs">{h.quality}</Text>
                  </View>
                </View>

                {/* Readiness bar */}
                <View className="mt-2">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-typography-500 text-xs">Harvest Readiness</Text>
                    <Text className="text-xs font-dm-sans-bold" style={{ color: h.color }}>{h.readiness}%</Text>
                  </View>
                  <View className="h-2.5 bg-background-200 rounded-full overflow-hidden">
                    <View className="h-full rounded-full" style={{ width: `${h.readiness}%`, backgroundColor: h.color }} />
                  </View>
                </View>

                {h.readiness > 80 && (
                  <View className="bg-green-50 rounded-xl p-2 mt-2 flex-row items-center">
                    <Text style={{ fontSize: 12 }}>{"\u2705"}</Text>
                    <Text className="text-green-700 text-xs ml-1 font-dm-sans-medium">
                      Ready for harvest - arrange logistics
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {tab === "records" && (
          <View className="px-5">
            {harvestRecords.length === 0 ? (
              <View className="items-center py-12">
                <Text style={{ fontSize: 48 }}>{"\ud83c\udf3e"}</Text>
                <Text className="text-typography-500 mt-2">No harvest records yet</Text>
              </View>
            ) : (
              harvestRecords.map((record) => (
                <View key={record.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <Text style={{ fontSize: 24 }}>{record.icon}</Text>
                      <View className="ml-3">
                        <Text className="text-typography-900 font-dm-sans-bold text-sm">{record.crop}</Text>
                        <Text className="text-typography-400 text-xs">{record.fieldName} \u2022 {new Date(record.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</Text>
                      </View>
                    </View>
                    <View className="bg-green-50 rounded-full px-2 py-0.5">
                      <Text className="text-green-700 text-xs font-dm-sans-bold">{record.quality}</Text>
                    </View>
                  </View>

                  <View className="flex-row gap-3 mb-2">
                    <View className="flex-1 bg-background-100 rounded-lg p-2 items-center">
                      <Text className="text-typography-800 font-dm-sans-bold text-sm">{record.quantity}</Text>
                      <Text className="text-typography-400 text-xs">{record.unit}</Text>
                    </View>
                    <View className="flex-1 bg-background-100 rounded-lg p-2 items-center">
                      <Text className="text-typography-800 font-dm-sans-bold text-sm">{"\u20b9"}{record.pricePerUnit}</Text>
                      <Text className="text-typography-400 text-xs">per qtl</Text>
                    </View>
                    <View className="flex-1 bg-green-50 rounded-lg p-2 items-center">
                      <Text className="text-green-800 font-dm-sans-bold text-sm">{"\u20b9"}{(record.totalRevenue/1000).toFixed(1)}K</Text>
                      <Text className="text-green-600 text-xs">revenue</Text>
                    </View>
                  </View>

                  {record.buyer && (
                    <Text className="text-typography-500 text-xs">Buyer: {record.buyer}</Text>
                  )}
                  <Text className="text-typography-400 text-xs mt-1">{record.notes}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {tab === "quality" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Quality Grading Standards</Text>

            {[
              {
                crop: "Grapes", icon: "\ud83c\udf47",
                grades: [
                  { grade: "Export A", criteria: "Brix > 18, Berry 18-22mm, No blemish, Residue-free", price: "\u20b95,000-6,500/qtl" },
                  { grade: "Export B", criteria: "Brix > 16, Berry 15-18mm, Minor blemish OK", price: "\u20b93,500-5,000/qtl" },
                  { grade: "Domestic", criteria: "Brix > 14, Any size, Cosmetic defects OK", price: "\u20b92,000-3,500/qtl" },
                  { grade: "Raisin", criteria: "High sugar, any appearance, firm berry", price: "\u20b93,500-4,500/qtl" },
                ],
              },
              {
                crop: "Wheat", icon: "\ud83c\udf3e",
                grades: [
                  { grade: "FAQ Grade", criteria: "Moisture < 14%, Foreign matter < 2%, Bold grains", price: "\u20b92,200-2,500/qtl" },
                  { grade: "Average", criteria: "Moisture < 14%, Foreign matter < 4%", price: "\u20b92,000-2,200/qtl" },
                  { grade: "Below Avg", criteria: "Moisture > 14%, shriveled, high damage", price: "\u20b91,800-2,000/qtl" },
                ],
              },
              {
                crop: "Tomato", icon: "\ud83c\udf45",
                grades: [
                  { grade: "A Grade", criteria: "Firm, uniform red, 80-120g, no cracks", price: "\u20b91,200-1,800/qtl" },
                  { grade: "B Grade", criteria: "Slightly soft, mixed size, minor defects", price: "\u20b9800-1,200/qtl" },
                  { grade: "Processing", criteria: "Overripe, irregular shape, for paste/sauce", price: "\u20b9400-800/qtl" },
                ],
              },
            ].map((section, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center mb-3">
                  <Text style={{ fontSize: 22 }}>{section.icon}</Text>
                  <Text className="text-typography-900 font-dm-sans-bold text-base ml-2">{section.crop}</Text>
                </View>
                {section.grades.map((g, j) => (
                  <View key={j} className="py-2" style={j < section.grades.length - 1 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-typography-800 text-sm font-dm-sans-bold">{g.grade}</Text>
                      <Text className="text-green-600 text-xs font-dm-sans-bold">{g.price}</Text>
                    </View>
                    <Text className="text-typography-500 text-xs mt-0.5">{g.criteria}</Text>
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
