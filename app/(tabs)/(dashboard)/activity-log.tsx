import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type LogFilter = "all" | "field" | "expense" | "spray" | "harvest";

interface ActivityEntry {
  id: string;
  type: "field" | "expense" | "spray" | "harvest" | "irrigation" | "observation";
  title: string;
  description: string;
  field: string;
  date: string;
  amount?: number;
  icon: string;
  color: string;
}

const activityLog: ActivityEntry[] = [
  {
    id: "l1", type: "spray", title: "Mancozeb Spray - Tomato",
    description: "Preventive spray for Late Blight. 2.5g/L, 500L solution for 8 acres. Applied with power sprayer.",
    field: "South Block", date: "2026-04-02T07:30:00Z", amount: 1200, icon: "\ud83d\udca8", color: "#ef4444",
  },
  {
    id: "l2", type: "irrigation", title: "Drip Irrigation - Capsicum",
    description: "3-hour fertigation cycle. 19:19:19 @ 5g/L through drip. Total water: 15,000L.",
    field: "Greenhouse", date: "2026-04-02T06:00:00Z", icon: "\ud83d\udca7", color: "#3b82f6",
  },
  {
    id: "l3", type: "expense", title: "Purchased Urea (8 bags)",
    description: "Urea 46% N from Nashik Krishi Kendra. Rate: \u20b9266/bag. Delivery to farm gate.",
    field: "All Fields", date: "2026-04-01T15:00:00Z", amount: 2128, icon: "\ud83d\udcb0", color: "#f59e0b",
  },
  {
    id: "l4", type: "observation", title: "Thrips scouting - Onion",
    description: "Found 8 thrips/plant in NE corner (above ETL of 5). Blue sticky traps showing high counts. Spray recommended.",
    field: "Central Block", date: "2026-04-01T10:00:00Z", icon: "\ud83d\udc41\ufe0f", color: "#8b5cf6",
  },
  {
    id: "l5", type: "field", title: "Tomato Staking Started",
    description: "Bamboo staking initiated. 4 laborers assigned. Expected completion by April 6. Spacing: single stake per plant.",
    field: "South Block", date: "2026-04-01T08:00:00Z", amount: 3500, icon: "\ud83c\udf3f", color: "#22c55e",
  },
  {
    id: "l6", type: "harvest", title: "Grape Quality Check",
    description: "Brix: 19.2 (target >18). Color: Golden green. Berry firmness: Good. Approved for harvest starting April 5.",
    field: "West Orchard", date: "2026-03-31T11:00:00Z", icon: "\ud83c\udf47", color: "#a855f7",
  },
  {
    id: "l7", type: "expense", title: "Labor Payment - Weekly",
    description: "8 permanent workers x \u20b92,125 = \u20b917,000. Includes overtime for irrigation shift.",
    field: "All Fields", date: "2026-03-31T18:00:00Z", amount: 17000, icon: "\ud83d\udcb0", color: "#f59e0b",
  },
  {
    id: "l8", type: "spray", title: "NPK 19:19:19 Foliar - Tomato",
    description: "Split dose application through drip. 5g/L concentration. EC monitored at 0.45 dS/m. Next dose: April 15.",
    field: "South Block", date: "2026-03-30T07:00:00Z", amount: 2800, icon: "\ud83e\udea4", color: "#22c55e",
  },
  {
    id: "l9", type: "observation", title: "Nitrogen Deficiency Spotted",
    description: "Lower leaves yellowing in Central Block onion. Confirmed by spectral analysis (NDVI drop 0.15). Urea application ordered.",
    field: "Central Block", date: "2026-03-29T09:00:00Z", icon: "\u26a0\ufe0f", color: "#f59e0b",
  },
  {
    id: "l10", type: "field", title: "Soil Moisture Sensors Calibrated",
    description: "Recalibrated 4 of 6 field sensors. Sensors in East Block and Greenhouse reading accurately. 2 sensors offline (South, Central).",
    field: "Multiple", date: "2026-03-28T14:00:00Z", icon: "\ud83d\udce1", color: "#06b6d4",
  },
  {
    id: "l11", type: "harvest", title: "Sample Sent - Grape Export Quality",
    description: "Sent 2kg sample to APEDA lab for residue analysis. Results expected in 5 days. Required for EU export certification.",
    field: "West Orchard", date: "2026-03-27T10:00:00Z", amount: 500, icon: "\ud83d\udce6", color: "#8b5cf6",
  },
  {
    id: "l12", type: "spray", title: "AI Scan - Early Blight Detection",
    description: "AI crop doctor detected Early Blight (94% confidence) on lower tomato leaves. Mancozeb spray applied same day.",
    field: "South Block", date: "2026-03-28T10:30:00Z", amount: 800, icon: "\ud83d\udd2c", color: "#ef4444",
  },
];

export default function ActivityLogScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<LogFilter>("all");

  const filtered = filter === "all"
    ? activityLog
    : activityLog.filter((a) => a.type === filter);

  const totalExpenses = activityLog
    .filter((a) => a.amount)
    .reduce((s, a) => s + (a.amount || 0), 0);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\ud83d\udcdd"} Activity Log
          </Text>
          <Text className="text-typography-400 text-xs">
            {activityLog.length} entries \u2022 \u20b9{totalExpenses.toLocaleString()} recorded expenses
          </Text>
        </View>
        <Pressable className="bg-green-500 rounded-lg px-3 py-1.5">
          <Text className="text-white text-xs font-dm-sans-bold">+ Add</Text>
        </Pressable>
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-12 mx-5 mt-3 mb-2">
        {([
          { key: "all" as LogFilter, label: "All" },
          { key: "field" as LogFilter, label: "\ud83c\udf3f Field Work" },
          { key: "expense" as LogFilter, label: "\ud83d\udcb0 Expenses" },
          { key: "spray" as LogFilter, label: "\ud83d\udca8 Sprays" },
          { key: "harvest" as LogFilter, label: "\ud83c\udf3e Harvest" },
        ]).map((tab) => (
          <Pressable
            key={tab.key}
            className="rounded-xl px-4 py-2 mr-2"
            style={filter === tab.key ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }}
            onPress={() => setFilter(tab.key)}
          >
            <Text className={`text-xs font-dm-sans-medium ${filter === tab.key ? "text-white" : "text-typography-500"}`}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="px-5">
          {filtered.map((entry, index) => {
            const prevEntry = index > 0 ? filtered[index - 1] : null;
            const entryDate = new Date(entry.date).toLocaleDateString("en-IN", {
              month: "short", day: "numeric", year: "numeric",
            });
            const prevDate = prevEntry
              ? new Date(prevEntry.date).toLocaleDateString("en-IN", {
                  month: "short", day: "numeric", year: "numeric",
                })
              : "";
            const showDateHeader = entryDate !== prevDate;

            return (
              <View key={entry.id}>
                {showDateHeader && (
                  <Text className="text-typography-500 font-dm-sans-bold text-xs mt-4 mb-2">
                    {entryDate}
                  </Text>
                )}
                <View className="flex-row mb-3">
                  {/* Timeline */}
                  <View className="items-center w-8 mr-2">
                    <View
                      className="w-3 h-3 rounded-full z-10"
                      style={{ backgroundColor: entry.color }}
                    />
                    {index < filtered.length - 1 && (
                      <View className="w-0.5 flex-1" style={{ backgroundColor: entry.color + "30" }} />
                    )}
                  </View>

                  {/* Content */}
                  <View className="flex-1 bg-background-50 rounded-xl p-3 border border-outline-100">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <Text style={{ fontSize: 16 }}>{entry.icon}</Text>
                        <Text className="text-typography-900 font-dm-sans-bold text-sm ml-2 flex-1" numberOfLines={1}>
                          {entry.title}
                        </Text>
                      </View>
                      {entry.amount && (
                        <Text className="text-typography-700 text-xs font-dm-sans-bold">
                          {"\u20b9"}{entry.amount.toLocaleString()}
                        </Text>
                      )}
                    </View>
                    <Text className="text-typography-600 text-xs font-dm-sans-regular mt-1.5 leading-4">
                      {entry.description}
                    </Text>
                    <View className="flex-row items-center justify-between mt-2">
                      <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: entry.color + "10" }}>
                        <Text className="text-xs" style={{ color: entry.color }}>{entry.field}</Text>
                      </View>
                      <Text className="text-typography-400 text-xs">
                        {new Date(entry.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
