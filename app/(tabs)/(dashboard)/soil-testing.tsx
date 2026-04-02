import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fields, soilDataByField, getSoilPHStatus } from "@/data/agritech";

type SoilTab = "overview" | "order" | "history" | "labs";

interface TestOrder {
  id: string;
  date: string;
  lab: string;
  fields: string[];
  tests: string[];
  status: "pending" | "in-progress" | "completed";
  reportDate?: string;
  cost: number;
}

const testHistory: TestOrder[] = [
  { id: "t1", date: "2026-01-15", lab: "ICAR Soil Lab Nashik", fields: ["All 6 fields"], tests: ["pH", "NPK", "OC", "EC", "Micronutrients"], status: "completed", reportDate: "2026-01-25", cost: 2100 },
  { id: "t2", date: "2025-07-10", lab: "KVK Nashik", fields: ["North Block", "South Block", "Central Block"], tests: ["pH", "NPK", "OC"], status: "completed", reportDate: "2025-07-18", cost: 1050 },
  { id: "t3", date: "2025-01-08", lab: "ICAR Soil Lab Nashik", fields: ["All 6 fields"], tests: ["Full Panel + Heavy Metals"], status: "completed", reportDate: "2025-01-22", cost: 3600 },
];

const labs = [
  { name: "ICAR Soil Testing Lab, Nashik", type: "Government", distance: "8 km", tests: "Full NPK + Micro + OC + pH + EC", cost: "\u20b9350/sample", turnaround: "7-10 days", rating: 4.8, icon: "\ud83c\udfe2" },
  { name: "Krishi Vigyan Kendra (KVK), Nashik", type: "Government", distance: "12 km", tests: "Basic NPK + pH + OC", cost: "\u20b9150/sample (subsidized)", turnaround: "5-7 days", rating: 4.6, icon: "\ud83c\udf93" },
  { name: "AgriLab Private Testing", type: "Private", distance: "5 km", tests: "Full Panel + Heavy Metals + Biological", cost: "\u20b9600/sample", turnaround: "3-5 days", rating: 4.9, icon: "\ud83e\uddea" },
  { name: "SoilCare Analytics (Online)", type: "Private/Online", distance: "Courier based", tests: "Comprehensive + AI Recommendations", cost: "\u20b9750/sample", turnaround: "5-7 days + shipping", rating: 4.7, icon: "\ud83d\udce6" },
];

export default function SoilTestingScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SoilTab>("overview");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>(["pH", "NPK", "OC"]);

  const testOptions = ["pH", "NPK", "OC", "EC", "Micronutrients", "Heavy Metals", "Biological Activity", "Water Holding Capacity"];
  const costPerTest: Record<string, number> = { pH: 50, NPK: 100, OC: 50, EC: 50, Micronutrients: 100, "Heavy Metals": 200, "Biological Activity": 150, "Water Holding Capacity": 100 };
  const estimatedCost = selectedFields.length * selectedTests.reduce((s, t) => s + (costPerTest[t] || 100), 0);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83e\udea8"} Soil Testing</Text>
          <Text className="text-typography-400 text-xs">Order tests, view results & track history</Text>
        </View>
      </View>

      <View className="flex-row mx-5 mt-3 mb-3 bg-background-100 rounded-xl p-1">
        {(["overview", "order", "history", "labs"] as SoilTab[]).map((t) => (
          <Pressable key={t} className="flex-1 items-center py-2 rounded-lg" style={activeTab === t ? { backgroundColor: "#16a34a" } : {}} onPress={() => setActiveTab(t)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === t ? "text-white" : "text-typography-500"}`}>
              {t === "overview" ? "\ud83d\udcca Results" : t === "order" ? "\ud83d\uded2 Order" : t === "history" ? "\ud83d\udccb History" : "\ud83c\udfe2 Labs"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "overview" && (
          <View className="px-5">
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-4">
              <Text className="text-blue-800 font-dm-sans-bold text-sm">Last tested: January 15, 2026</Text>
              <Text className="text-blue-600 text-xs mt-0.5">Next recommended: July 2026 (before Kharif sowing)</Text>
            </View>

            {/* Per-field soil summary cards */}
            {fields.map((field) => {
              const soil = soilDataByField[field.id];
              if (!soil) return null;
              const phStatus = getSoilPHStatus(soil.pH);
              const isNLow = soil.nitrogen < 250;
              const isPLow = soil.phosphorus < 20;
              const isKLow = soil.potassium < 150;
              const isOCLow = soil.organicCarbon < 0.5;
              const issues = [isNLow && "Low N", isPLow && "Low P", isKLow && "Low K", isOCLow && "Low OC"].filter(Boolean);

              return (
                <View key={field.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{field.name}</Text>
                    <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: phStatus.color + "15" }}>
                      <Text className="text-xs font-dm-sans-bold" style={{ color: phStatus.color }}>pH {soil.pH}</Text>
                    </View>
                  </View>

                  <View className="flex-row gap-2 mb-2">
                    {[
                      { label: "N", value: soil.nitrogen, unit: "kg/ha", ok: !isNLow },
                      { label: "P", value: soil.phosphorus, unit: "kg/ha", ok: !isPLow },
                      { label: "K", value: soil.potassium, unit: "kg/ha", ok: !isKLow },
                      { label: "OC", value: soil.organicCarbon, unit: "%", ok: !isOCLow },
                      { label: "Moist", value: soil.moisture, unit: "%", ok: soil.moisture >= 25 },
                    ].map((item, i) => (
                      <View key={i} className="flex-1 rounded-lg p-1.5 items-center" style={{ backgroundColor: item.ok ? "#22c55e10" : "#ef444410" }}>
                        <Text className="text-typography-400" style={{ fontSize: 8 }}>{item.label}</Text>
                        <Text className="font-dm-sans-bold text-xs" style={{ color: item.ok ? "#22c55e" : "#ef4444" }}>
                          {item.value}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {issues.length > 0 && (
                    <View className="bg-yellow-50 rounded-lg p-2">
                      <Text className="text-yellow-700 text-xs">{"\u26a0\ufe0f"} Issues: {issues.join(", ")}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {activeTab === "order" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Order Soil Test</Text>

            {/* Field selection */}
            <View className="mb-4">
              <Text className="text-typography-700 text-sm font-dm-sans-medium mb-2">Select Fields</Text>
              <View className="flex-row flex-wrap gap-2">
                {fields.map((field) => {
                  const selected = selectedFields.includes(field.id);
                  return (
                    <Pressable key={field.id} onPress={() => setSelectedFields(selected ? selectedFields.filter((f) => f !== field.id) : [...selectedFields, field.id])}>
                      <View className="rounded-xl px-3 py-2" style={selected ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }}>
                        <Text className={`text-xs font-dm-sans-medium ${selected ? "text-white" : "text-typography-600"}`}>{field.crop}</Text>
                      </View>
                    </Pressable>
                  );
                })}
                <Pressable onPress={() => setSelectedFields(fields.map((f) => f.id))}>
                  <View className="rounded-xl px-3 py-2 bg-blue-50 border border-blue-200">
                    <Text className="text-blue-700 text-xs font-dm-sans-bold">Select All</Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Test selection */}
            <View className="mb-4">
              <Text className="text-typography-700 text-sm font-dm-sans-medium mb-2">Select Tests</Text>
              <View className="flex-row flex-wrap gap-2">
                {testOptions.map((test) => {
                  const selected = selectedTests.includes(test);
                  return (
                    <Pressable key={test} onPress={() => setSelectedTests(selected ? selectedTests.filter((t) => t !== test) : [...selectedTests, test])}>
                      <View className="rounded-xl px-3 py-2" style={selected ? { backgroundColor: "#8b5cf6" } : { backgroundColor: "#f3f4f6" }}>
                        <Text className={`text-xs font-dm-sans-medium ${selected ? "text-white" : "text-typography-600"}`}>
                          {test} ({"\u20b9"}{costPerTest[test]})
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Cost Estimate */}
            <View className="bg-purple-50 rounded-2xl p-4 border border-purple-200 mb-4">
              <Text className="text-purple-800 font-dm-sans-bold text-base">Estimated Cost</Text>
              <Text className="text-purple-800 text-2xl font-dm-sans-bold">{"\u20b9"}{estimatedCost.toLocaleString()}</Text>
              <Text className="text-purple-600 text-xs">{selectedFields.length} field{selectedFields.length !== 1 ? "s" : ""} x {selectedTests.length} test{selectedTests.length !== 1 ? "s" : ""}</Text>
            </View>

            {/* Sampling Guide */}
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
              <Text className="text-green-800 font-dm-sans-bold text-sm mb-2">{"\ud83d\udcd6"} Sampling Instructions</Text>
              {[
                "Collect from 15-20 spots per field in zigzag pattern",
                "Depth: 0-15cm for surface, 15-30cm for sub-surface",
                "Avoid sampling near trees, bunds, manure heaps",
                "Mix all sub-samples, take 500g as composite sample",
                "Air-dry in shade, remove stones/roots, pack in clean bag",
                "Label: Field name, GPS, crop, date, farmer name",
              ].map((step, i) => (
                <Text key={i} className="text-green-700 text-xs leading-5">{i + 1}. {step}</Text>
              ))}
            </View>

            <Pressable
              onPress={() => Alert.alert("Test Ordered!", `Soil test order placed for ${selectedFields.length} fields.\n\nSample collection kit will be delivered in 2 days.\nResults expected in 7-10 days.`)}
              className="bg-green-500 rounded-xl py-3.5 items-center"
            >
              <Text className="text-white font-dm-sans-bold text-sm">Place Order {"\u2192"}</Text>
            </Pressable>
          </View>
        )}

        {activeTab === "history" && (
          <View className="px-5">
            {testHistory.map((test) => {
              const statusColors: Record<string, string> = { completed: "#22c55e", "in-progress": "#3b82f6", pending: "#f59e0b" };
              return (
                <View key={test.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <View>
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{test.lab}</Text>
                      <Text className="text-typography-400 text-xs">{new Date(test.date).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}</Text>
                    </View>
                    <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: statusColors[test.status] + "15" }}>
                      <Text className="text-xs font-dm-sans-bold capitalize" style={{ color: statusColors[test.status] }}>{test.status}</Text>
                    </View>
                  </View>
                  <Text className="text-typography-600 text-xs">Fields: {test.fields.join(", ")}</Text>
                  <Text className="text-typography-600 text-xs">Tests: {test.tests.join(", ")}</Text>
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-typography-500 text-xs">Cost: {"\u20b9"}{test.cost}</Text>
                    {test.reportDate && <Text className="text-green-600 text-xs">Report: {new Date(test.reportDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === "labs" && (
          <View className="px-5">
            {labs.map((lab, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 rounded-xl bg-background-100 items-center justify-center">
                    <Text style={{ fontSize: 24 }}>{lab.icon}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{lab.name}</Text>
                    <Text className="text-typography-500 text-xs">{lab.type} \u2022 {lab.distance}</Text>
                    <Text className="text-typography-600 text-xs mt-1">{lab.tests}</Text>
                    <View className="flex-row items-center mt-2">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{lab.cost}</Text>
                      <Text className="text-typography-400 text-xs ml-2">\u2022 {lab.turnaround}</Text>
                      <Text className="text-yellow-500 text-xs ml-auto">{"\u2b50"} {lab.rating}</Text>
                    </View>
                  </View>
                </View>
                <Pressable className="bg-purple-500 rounded-xl py-2.5 items-center mt-3">
                  <Text className="text-white text-xs font-dm-sans-bold">Book Test</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
