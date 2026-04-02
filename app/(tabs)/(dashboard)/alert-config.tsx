import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

interface AlertRule {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  enabled: boolean;
  threshold?: string;
  channels: string[];
}

export default function AlertConfigScreen() {
  const router = useRouter();
  const [rules, setRules] = useState<AlertRule[]>([
    { id: "r1", name: "Pest Detection Alert", description: "AI satellite detects pest infestation patterns", category: "Pest", icon: "\ud83d\udc1b", color: "#ef4444", enabled: true, threshold: "Confidence > 70%", channels: ["Push", "SMS", "WhatsApp"] },
    { id: "r2", name: "Disease Risk Warning", description: "Weather conditions favor disease outbreak", category: "Disease", icon: "\ud83e\uddec", color: "#f59e0b", enabled: true, threshold: "Risk > 60%", channels: ["Push", "WhatsApp"] },
    { id: "r3", name: "NDVI Drop Alert", description: "Significant NDVI decline indicating crop stress", category: "Satellite", icon: "\ud83d\udef0\ufe0f", color: "#8b5cf6", enabled: true, threshold: "Drop > 0.10 in 14 days", channels: ["Push"] },
    { id: "r4", name: "Soil Moisture Critical", description: "Soil moisture below crop-specific threshold", category: "IoT Sensor", icon: "\ud83d\udca7", color: "#3b82f6", enabled: true, threshold: "< 20% (adjustable)", channels: ["Push", "Auto-irrigate"] },
    { id: "r5", name: "Heavy Rainfall Warning", description: "IMD forecast for heavy rain in your district", category: "Weather", icon: "\u26c8\ufe0f", color: "#3b82f6", enabled: true, threshold: "> 50mm in 24hrs", channels: ["Push", "SMS"] },
    { id: "r6", name: "Frost/Heatwave Alert", description: "Extreme temperature warning for crop protection", category: "Weather", icon: "\ud83c\udf21\ufe0f", color: "#ef4444", enabled: true, threshold: "< 4\u00b0C or > 42\u00b0C", channels: ["Push", "SMS"] },
    { id: "r7", name: "Market Price Alert", description: "Significant price change for your crops at APMC", category: "Market", icon: "\ud83d\udcb9", color: "#22c55e", enabled: true, threshold: "Change > \u00b110%", channels: ["Push"] },
    { id: "r8", name: "Irrigation Schedule Reminder", description: "Upcoming irrigation based on crop calendar", category: "Calendar", icon: "\ud83d\udcc5", color: "#06b6d4", enabled: true, threshold: "24 hours before", channels: ["Push"] },
    { id: "r9", name: "Spray Window Alert", description: "Optimal weather conditions for spraying operations", category: "Weather", icon: "\ud83d\udca8", color: "#22c55e", enabled: false, threshold: "Wind < 12 km/h, No rain 4hrs", channels: ["Push"] },
    { id: "r10", name: "Sensor Offline Alert", description: "IoT sensor stopped reporting data", category: "IoT Sensor", icon: "\ud83d\udce1", color: "#ef4444", enabled: true, threshold: "> 2 hours offline", channels: ["Push"] },
    { id: "r11", name: "Government Scheme Deadline", description: "Upcoming deadline for scheme applications", category: "Government", icon: "\ud83c\udfe6", color: "#f97316", enabled: true, threshold: "7 days before deadline", channels: ["Push"] },
    { id: "r12", name: "Harvest Readiness", description: "Crop parameters indicate harvest-ready status", category: "AI", icon: "\ud83c\udf3e", color: "#f59e0b", enabled: false, threshold: "Based on NDVI plateau + Brix/moisture", channels: ["Push"] },
    { id: "r13", name: "Carbon Credit Milestone", description: "New carbon credits verified and earned", category: "Sustainability", icon: "\ud83c\udf0d", color: "#06b6d4", enabled: true, threshold: "Each credit earned", channels: ["Push"] },
    { id: "r14", name: "Community Mentions", description: "Someone replies to your post or mentions you", category: "Community", icon: "\ud83d\udc65", color: "#7c3aed", enabled: false, threshold: "Each mention", channels: ["Push"] },
  ]);

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const enabledCount = rules.filter((r) => r.enabled).length;
  const categories = [...new Set(rules.map((r) => r.category))];

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\udd14"} Alert Configuration</Text>
          <Text className="text-typography-400 text-xs">{enabledCount}/{rules.length} alerts active</Text>
        </View>
      </View>

      {/* Quick toggles */}
      <View className="flex-row mx-5 mt-3 gap-2 mb-3">
        <Pressable onPress={() => setRules((prev) => prev.map((r) => ({ ...r, enabled: true })))} className="flex-1 bg-green-50 rounded-xl py-2.5 items-center border border-green-200">
          <Text className="text-green-700 text-xs font-dm-sans-bold">Enable All</Text>
        </Pressable>
        <Pressable onPress={() => setRules((prev) => prev.map((r) => ({ ...r, enabled: false })))} className="flex-1 bg-red-50 rounded-xl py-2.5 items-center border border-red-200">
          <Text className="text-red-700 text-xs font-dm-sans-bold">Disable All</Text>
        </Pressable>
        <Pressable className="flex-1 bg-blue-50 rounded-xl py-2.5 items-center border border-blue-200">
          <Text className="text-blue-700 text-xs font-dm-sans-bold">+ Custom Rule</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="px-5">
          {categories.map((category) => {
            const categoryRules = rules.filter((r) => r.category === category);
            return (
              <View key={category} className="mb-4">
                <Text className="text-typography-500 font-dm-sans-bold text-xs uppercase mb-2">{category}</Text>
                {categoryRules.map((rule) => (
                  <View key={rule.id} className="bg-background-50 rounded-xl p-4 mb-2 border border-outline-100">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: rule.color + "12" }}>
                        <Text style={{ fontSize: 18 }}>{rule.icon}</Text>
                      </View>
                      <View className="flex-1 ml-3">
                        <Text className="text-typography-900 font-dm-sans-bold text-sm">{rule.name}</Text>
                        <Text className="text-typography-500 text-xs">{rule.description}</Text>
                        {rule.threshold && (
                          <Text className="text-typography-400 text-xs mt-0.5">Threshold: {rule.threshold}</Text>
                        )}
                        <View className="flex-row flex-wrap gap-1 mt-1">
                          {rule.channels.map((ch, i) => (
                            <View key={i} className="bg-background-100 rounded-full px-2 py-0.5">
                              <Text className="text-typography-500" style={{ fontSize: 9 }}>{ch}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                      <Switch
                        value={rule.enabled}
                        onValueChange={() => toggleRule(rule.id)}
                        trackColor={{ false: "#d4d4d4", true: rule.color }}
                        thumbColor="#fff"
                      />
                    </View>
                  </View>
                ))}
              </View>
            );
          })}

          {/* Delivery Channels */}
          <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mt-2">
            <Text className="text-typography-900 font-dm-sans-bold text-sm mb-3">{"\ud83d\udce2"} Delivery Channels</Text>
            {[
              { channel: "Push Notifications", status: "Active", detail: "All alert types", icon: "\ud83d\udd14" },
              { channel: "SMS Alerts", status: "Active", detail: "+91 98XXX XXXXX (critical only)", icon: "\ud83d\udcf1" },
              { channel: "WhatsApp", status: "Active", detail: "+91 98XXX XXXXX (pest + disease)", icon: "\ud83d\udcac" },
              { channel: "Email Digest", status: "Daily", detail: "rajesh@greenvalleyfarms.com", icon: "\ud83d\udce7" },
              { channel: "Auto-actions", status: "2 rules", detail: "Auto-irrigate, auto-cancel spray", icon: "\u2699\ufe0f" },
            ].map((ch, i) => (
              <View key={i} className="flex-row items-center py-2.5" style={i < 4 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                <Text style={{ fontSize: 16 }}>{ch.icon}</Text>
                <View className="flex-1 ml-3">
                  <Text className="text-typography-800 text-sm font-dm-sans-medium">{ch.channel}</Text>
                  <Text className="text-typography-400 text-xs">{ch.detail}</Text>
                </View>
                <View className="bg-green-50 rounded-full px-2 py-0.5">
                  <Text className="text-green-700 text-xs font-dm-sans-medium">{ch.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
