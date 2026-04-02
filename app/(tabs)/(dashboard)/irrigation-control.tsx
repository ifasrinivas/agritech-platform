import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { irrigationSchedules } from "@/data/agritech";

interface Valve {
  id: string;
  name: string;
  field: string;
  status: "open" | "closed" | "scheduled" | "fault";
  flowRate: number;
  totalToday: number;
  autoMode: boolean;
  nextScheduled?: string;
}

const valves: Valve[] = [
  { id: "v1", name: "Drip Zone A", field: "North Block - Wheat", status: "closed", flowRate: 0, totalToday: 8200, autoMode: true, nextScheduled: "Apr 5, 6:00 AM" },
  { id: "v2", name: "Drip Zone B", field: "South Block - Tomato", status: "open", flowRate: 12.5, totalToday: 15400, autoMode: false },
  { id: "v3", name: "Sprinkler Main", field: "South Block - Tomato", status: "closed", flowRate: 0, totalToday: 0, autoMode: true, nextScheduled: "Apr 3, 5:30 AM" },
  { id: "v4", name: "Flood Gate", field: "East Block - Rice", status: "closed", flowRate: 0, totalToday: 42000, autoMode: true, nextScheduled: "Apr 3, 6:00 AM" },
  { id: "v5", name: "Drip Main", field: "West Orchard - Grapes", status: "closed", flowRate: 0, totalToday: 5800, autoMode: true, nextScheduled: "Apr 4, 5:00 AM" },
  { id: "v6", name: "Furrow Valve", field: "Central Block - Onion", status: "fault", flowRate: 0, totalToday: 0, autoMode: false },
  { id: "v7", name: "GH Fertigation", field: "Greenhouse - Capsicum", status: "open", flowRate: 8.2, totalToday: 12100, autoMode: true },
  { id: "v8", name: "GH Misting", field: "Greenhouse - Capsicum", status: "closed", flowRate: 0, totalToday: 3200, autoMode: true, nextScheduled: "Apr 2, 2:00 PM" },
];

const statusColors = {
  open: "#22c55e",
  closed: "#6b7280",
  scheduled: "#3b82f6",
  fault: "#ef4444",
};

const statusIcons = {
  open: "\ud83d\udfe2",
  closed: "\u26aa",
  scheduled: "\ud83d\udd35",
  fault: "\ud83d\udd34",
};

export default function IrrigationControlScreen() {
  const router = useRouter();
  const [valveStates, setValveStates] = useState(valves);

  const openValves = valveStates.filter((v) => v.status === "open").length;
  const faultValves = valveStates.filter((v) => v.status === "fault").length;
  const totalFlowRate = valveStates.reduce((s, v) => s + v.flowRate, 0);
  const totalToday = valveStates.reduce((s, v) => s + v.totalToday, 0);

  const toggleValve = (id: string) => {
    setValveStates((prev) =>
      prev.map((v) =>
        v.id === id && v.status !== "fault"
          ? { ...v, status: v.status === "open" ? "closed" as const : "open" as const, flowRate: v.status === "open" ? 0 : 10 + Math.random() * 5 }
          : v
      )
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\udca7"} Irrigation Control</Text>
          <Text className="text-typography-400 text-xs">Smart valve & schedule management</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-green-500 mr-1" />
          <Text className="text-green-600 text-xs font-dm-sans-medium">Live</Text>
        </View>
      </View>

      {/* Dashboard Summary */}
      <View className="flex-row mx-5 mt-3 gap-2 mb-3">
        <View className="flex-1 rounded-xl p-3 items-center bg-green-50 border border-green-200">
          <Text className="text-green-800 text-lg font-dm-sans-bold">{openValves}</Text>
          <Text className="text-green-600 text-xs">Valves Open</Text>
        </View>
        <View className="flex-1 rounded-xl p-3 items-center bg-blue-50 border border-blue-200">
          <Text className="text-blue-800 text-lg font-dm-sans-bold">{totalFlowRate.toFixed(1)}</Text>
          <Text className="text-blue-600 text-xs">L/min flow</Text>
        </View>
        <View className="flex-1 rounded-xl p-3 items-center bg-purple-50 border border-purple-200">
          <Text className="text-purple-800 text-lg font-dm-sans-bold">{(totalToday/1000).toFixed(1)}K</Text>
          <Text className="text-purple-600 text-xs">Liters today</Text>
        </View>
        {faultValves > 0 && (
          <View className="flex-1 rounded-xl p-3 items-center bg-red-50 border border-red-200">
            <Text className="text-red-800 text-lg font-dm-sans-bold">{faultValves}</Text>
            <Text className="text-red-600 text-xs">Faults</Text>
          </View>
        )}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Emergency Controls */}
        <View className="mx-5 mb-4">
          <View className="flex-row gap-2">
            <Pressable className="flex-1 bg-red-500 rounded-xl py-3 items-center">
              <Text className="text-white font-dm-sans-bold text-sm">{"\u23f9"} Close All Valves</Text>
            </Pressable>
            <Pressable className="flex-1 bg-blue-500 rounded-xl py-3 items-center">
              <Text className="text-white font-dm-sans-bold text-sm">{"\u25b6\ufe0f"} Run Schedule</Text>
            </Pressable>
          </View>
        </View>

        {/* Valve Controls */}
        <View className="px-5">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Valve Controls</Text>

          {valveStates.map((valve) => {
            const color = statusColors[valve.status];
            return (
              <View
                key={valve.id}
                className="bg-background-50 rounded-2xl p-4 mb-3 border"
                style={{ borderColor: valve.status === "fault" ? "#ef444440" : "#e5e7eb" }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center flex-1">
                    <Text style={{ fontSize: 14 }}>{statusIcons[valve.status]}</Text>
                    <View className="ml-2 flex-1">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{valve.name}</Text>
                      <Text className="text-typography-400 text-xs">{valve.field}</Text>
                    </View>
                  </View>
                  {valve.status !== "fault" ? (
                    <Pressable
                      onPress={() => toggleValve(valve.id)}
                      className="rounded-xl px-4 py-2"
                      style={{ backgroundColor: valve.status === "open" ? "#22c55e" : "#e5e7eb" }}
                    >
                      <Text className={`text-xs font-dm-sans-bold ${valve.status === "open" ? "text-white" : "text-typography-600"}`}>
                        {valve.status === "open" ? "\u23f9 Close" : "\u25b6\ufe0f Open"}
                      </Text>
                    </Pressable>
                  ) : (
                    <View className="bg-red-100 rounded-xl px-4 py-2">
                      <Text className="text-red-700 text-xs font-dm-sans-bold">{"\u26a0\ufe0f"} Fault</Text>
                    </View>
                  )}
                </View>

                {/* Metrics */}
                <View className="flex-row gap-3">
                  <View className="flex-1 bg-background-100 rounded-lg p-2">
                    <Text className="text-typography-400" style={{ fontSize: 9 }}>Flow Rate</Text>
                    <Text className="text-typography-800 text-xs font-dm-sans-bold">
                      {valve.flowRate > 0 ? `${valve.flowRate.toFixed(1)} L/min` : "0"}
                    </Text>
                  </View>
                  <View className="flex-1 bg-background-100 rounded-lg p-2">
                    <Text className="text-typography-400" style={{ fontSize: 9 }}>Today</Text>
                    <Text className="text-typography-800 text-xs font-dm-sans-bold">
                      {(valve.totalToday / 1000).toFixed(1)}K L
                    </Text>
                  </View>
                  <View className="flex-1 bg-background-100 rounded-lg p-2">
                    <Text className="text-typography-400" style={{ fontSize: 9 }}>Mode</Text>
                    <Text className="text-xs font-dm-sans-bold" style={{ color: valve.autoMode ? "#22c55e" : "#f59e0b" }}>
                      {valve.autoMode ? "Auto" : "Manual"}
                    </Text>
                  </View>
                  {valve.nextScheduled && (
                    <View className="flex-1 bg-background-100 rounded-lg p-2">
                      <Text className="text-typography-400" style={{ fontSize: 9 }}>Next</Text>
                      <Text className="text-blue-600 text-xs font-dm-sans-bold" numberOfLines={1}>{valve.nextScheduled.split(",")[0]}</Text>
                    </View>
                  )}
                </View>

                {valve.status === "fault" && (
                  <View className="bg-red-50 rounded-lg p-2 mt-2">
                    <Text className="text-red-700 text-xs">Fault detected: Solenoid not responding. Check wiring and 12V supply.</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Water Budget */}
        <View className="mx-5 mt-2 bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-4">
          <Text className="text-blue-800 font-dm-sans-bold text-base mb-2">{"\ud83d\udca7"} Weekly Water Budget</Text>
          <View className="flex-row gap-3">
            {[
              { label: "Budget", value: "1,70,000 L", color: "#3b82f6" },
              { label: "Used", value: "86,700 L", color: "#22c55e" },
              { label: "Remaining", value: "83,300 L", color: "#8b5cf6" },
            ].map((item, i) => (
              <View key={i} className="flex-1 bg-white rounded-xl p-3 items-center">
                <Text className="font-dm-sans-bold text-sm" style={{ color: item.color }}>{item.value}</Text>
                <Text className="text-typography-400 text-xs">{item.label}</Text>
              </View>
            ))}
          </View>
          <View className="h-3 bg-blue-200 rounded-full overflow-hidden mt-3">
            <View className="h-full rounded-full bg-blue-500" style={{ width: "51%" }} />
          </View>
          <Text className="text-blue-600 text-xs mt-1 text-center">51% of weekly budget used (Day 4 of 7)</Text>
        </View>

        {/* Moisture-Based Recommendations */}
        <View className="mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100">
          <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">{"\ud83e\udde0"} AI Irrigation Recommendations</Text>
          {[
            { field: "South Block - Tomato", action: "Irrigate NOW", reason: "Moisture at 18% (critical low). Target: 35%.", urgency: "high" },
            { field: "Central Block - Onion", action: "Repair valve first", reason: "Furrow valve fault. Manual irrigation needed.", urgency: "high" },
            { field: "North Block - Wheat", action: "Skip next cycle", reason: "Rain expected Sat-Sun. Save 45,000L.", urgency: "low" },
            { field: "Greenhouse - Capsicum", action: "Increase frequency", reason: "Summer heat increasing. EC rising to 0.42.", urgency: "medium" },
          ].map((rec, i) => {
            const urgencyColors: Record<string, string> = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };
            return (
              <View key={i} className="py-2.5" style={i < 3 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                <View className="flex-row items-center justify-between">
                  <Text className="text-typography-800 text-xs font-dm-sans-bold">{rec.field}</Text>
                  <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: urgencyColors[rec.urgency] + "15" }}>
                    <Text className="text-xs font-dm-sans-bold" style={{ color: urgencyColors[rec.urgency] }}>{rec.action}</Text>
                  </View>
                </View>
                <Text className="text-typography-500 text-xs mt-0.5">{rec.reason}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
