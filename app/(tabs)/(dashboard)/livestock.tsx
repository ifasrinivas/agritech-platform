import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type LivestockTab = "herd" | "dairy" | "health" | "feed" | "integration";

interface Animal {
  id: string;
  tag: string;
  type: string;
  breed: string;
  age: string;
  status: string;
  dailyMilk?: number;
  lastVet?: string;
  icon: string;
}

const animals: Animal[] = [
  { id: "a1", tag: "GVF-C001", type: "Cow", breed: "Gir", age: "5 yrs", status: "Lactating", dailyMilk: 12, lastVet: "Mar 15", icon: "\ud83d\udc04" },
  { id: "a2", tag: "GVF-C002", type: "Cow", breed: "Gir", age: "4 yrs", status: "Lactating", dailyMilk: 10, lastVet: "Mar 15", icon: "\ud83d\udc04" },
  { id: "a3", tag: "GVF-C003", type: "Cow", breed: "HF Cross", age: "3 yrs", status: "Lactating", dailyMilk: 18, lastVet: "Feb 28", icon: "\ud83d\udc04" },
  { id: "a4", tag: "GVF-C004", type: "Cow", breed: "Gir", age: "6 yrs", status: "Dry (Due Jun 15)", dailyMilk: 0, lastVet: "Mar 20", icon: "\ud83d\udc04" },
  { id: "a5", tag: "GVF-B001", type: "Bull", breed: "Gir", age: "4 yrs", status: "Active", lastVet: "Jan 10", icon: "\ud83d\udc02" },
  { id: "a6", tag: "GVF-H001", type: "Calf", breed: "Gir", age: "8 months", status: "Growing", lastVet: "Mar 1", icon: "\ud83d\udc04" },
  { id: "a7", tag: "GVF-H002", type: "Calf", breed: "HF Cross", age: "4 months", status: "Growing", lastVet: "Mar 1", icon: "\ud83d\udc04" },
];

export default function LivestockScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LivestockTab>("herd");

  const totalMilk = animals.reduce((s, a) => s + (a.dailyMilk || 0), 0);
  const lactatingCount = animals.filter((a) => a.status === "Lactating").length;

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\udc04"} Livestock & Dairy</Text>
          <Text className="text-typography-400 text-xs">Herd management & farm integration</Text>
        </View>
      </View>

      <View className="flex-row mx-5 mt-3 gap-2 mb-3">
        <View className="flex-1 bg-yellow-50 rounded-xl p-2.5 items-center border border-yellow-200">
          <Text className="text-yellow-800 text-lg font-dm-sans-bold">{animals.length}</Text>
          <Text className="text-yellow-600 text-xs">Total Head</Text>
        </View>
        <View className="flex-1 bg-blue-50 rounded-xl p-2.5 items-center border border-blue-200">
          <Text className="text-blue-800 text-lg font-dm-sans-bold">{totalMilk}L</Text>
          <Text className="text-blue-600 text-xs">Daily Milk</Text>
        </View>
        <View className="flex-1 bg-green-50 rounded-xl p-2.5 items-center border border-green-200">
          <Text className="text-green-800 text-sm font-dm-sans-bold">{"\u20b9"}{(totalMilk * 55).toLocaleString()}</Text>
          <Text className="text-green-600 text-xs">Daily Income</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-10 mx-5 mb-3">
        {([
          { key: "herd" as LivestockTab, label: "\ud83d\udc04 Herd" },
          { key: "dairy" as LivestockTab, label: "\ud83e\udd5b Dairy" },
          { key: "health" as LivestockTab, label: "\ud83e\ude7a Health" },
          { key: "feed" as LivestockTab, label: "\ud83c\udf3e Feed" },
          { key: "integration" as LivestockTab, label: "\ud83d\udd04 Farm Link" },
        ]).map((tab) => (
          <Pressable key={tab.key} className="rounded-xl px-4 py-2 mr-2" style={activeTab === tab.key ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }} onPress={() => setActiveTab(tab.key)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === tab.key ? "text-white" : "text-typography-500"}`}>{tab.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "herd" && (
          <View className="px-5">
            {animals.map((animal) => (
              <View key={animal.id} className="bg-background-50 rounded-2xl p-4 mb-2 border border-outline-100">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-xl bg-background-100 items-center justify-center">
                    <Text style={{ fontSize: 24 }}>{animal.icon}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{animal.tag}</Text>
                      <View className="bg-background-100 rounded-full px-2 py-0.5 ml-2">
                        <Text className="text-typography-500 text-xs">{animal.type}</Text>
                      </View>
                    </View>
                    <Text className="text-typography-500 text-xs">{animal.breed} \u2022 {animal.age}</Text>
                  </View>
                  <View className="items-end">
                    <Text className={`text-xs font-dm-sans-bold ${animal.status === "Lactating" ? "text-green-600" : "text-typography-400"}`}>
                      {animal.status.split("(")[0].trim()}
                    </Text>
                    {animal.dailyMilk !== undefined && animal.dailyMilk > 0 && (
                      <Text className="text-blue-600 text-xs font-dm-sans-bold">{animal.dailyMilk} L/day</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "dairy" && (
          <View className="px-5">
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-4">
              <Text className="text-blue-800 font-dm-sans-bold text-base mb-3">{"\ud83e\udd5b"} Dairy Production Summary</Text>
              <View className="flex-row gap-3 mb-3">
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-blue-800 text-xl font-dm-sans-bold">{totalMilk}L</Text>
                  <Text className="text-blue-600 text-xs">Daily</Text>
                </View>
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-blue-800 text-xl font-dm-sans-bold">{totalMilk * 30}L</Text>
                  <Text className="text-blue-600 text-xs">Monthly</Text>
                </View>
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-green-800 text-xl font-dm-sans-bold">{"\u20b9"}{(totalMilk * 30 * 55 / 1000).toFixed(0)}K</Text>
                  <Text className="text-green-600 text-xs">Monthly Rev</Text>
                </View>
              </View>

              <Text className="text-blue-700 text-xs">{lactatingCount} lactating cows \u2022 Avg: {(totalMilk / lactatingCount).toFixed(1)} L/cow/day \u2022 Rate: \u20b955/L</Text>
            </View>

            {/* Monthly trend */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-sm mb-3">Monthly Milk Production (L)</Text>
              <View className="h-28 flex-row items-end">
                {[
                  { month: "Nov", value: 900 },
                  { month: "Dec", value: 1050 },
                  { month: "Jan", value: 1150 },
                  { month: "Feb", value: 1100 },
                  { month: "Mar", value: 1200 },
                  { month: "Apr", value: 1200 },
                ].map((item, i) => {
                  const max = 1400;
                  const height = (item.value / max) * 100;
                  return (
                    <View key={i} className="flex-1 items-center">
                      <Text className="text-blue-600 mb-1" style={{ fontSize: 8 }}>{item.value}</Text>
                      <View className="w-8 rounded-t-lg" style={{ height: `${height}%`, backgroundColor: i === 5 ? "#3b82f6" : "#3b82f660" }} />
                      <Text className="text-typography-400 mt-1" style={{ fontSize: 8 }}>{item.month}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Buyers */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100">
              <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">Milk Buyers</Text>
              {[
                { buyer: "Gokul Dairy Cooperative", qty: "25 L/day", rate: "\u20b955/L", payment: "Monthly" },
                { buyer: "Direct to households", qty: "10 L/day", rate: "\u20b965/L", payment: "Weekly" },
                { buyer: "Farm use (FYM/Jeevamrutha)", qty: "5 L cow urine/day", rate: "Internal", payment: "N/A" },
              ].map((b, i) => (
                <View key={i} className="flex-row items-center justify-between py-2" style={i < 2 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <View>
                    <Text className="text-typography-800 text-xs font-dm-sans-medium">{b.buyer}</Text>
                    <Text className="text-typography-400 text-xs">{b.qty} \u2022 {b.rate}</Text>
                  </View>
                  <Text className="text-typography-500 text-xs">{b.payment}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "health" && (
          <View className="px-5">
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">{"\ud83e\ude7a"} Veterinary Schedule</Text>
              {[
                { event: "FMD Vaccination (all)", date: "Apr 15, 2026", status: "Scheduled", vet: "Dr. Patil", icon: "\ud83d\udc89" },
                { event: "HS-BQ Vaccination", date: "May 1, 2026", status: "Scheduled", vet: "Dr. Patil", icon: "\ud83d\udc89" },
                { event: "Deworming (all)", date: "Apr 20, 2026", status: "Scheduled", vet: "Self", icon: "\ud83d\udc8a" },
                { event: "Pregnancy check GVF-C004", date: "Apr 10, 2026", status: "Scheduled", vet: "Dr. Patil", icon: "\ud83e\ude7a" },
                { event: "Routine checkup (herd)", date: "Mar 15, 2026", status: "Completed", vet: "Dr. Patil", icon: "\u2705" },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center py-2.5" style={i < 4 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-800 text-xs font-dm-sans-medium">{item.event}</Text>
                    <Text className="text-typography-400 text-xs">{item.date} \u2022 {item.vet}</Text>
                  </View>
                  <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: item.status === "Completed" ? "#22c55e15" : "#3b82f615" }}>
                    <Text className="text-xs font-dm-sans-medium" style={{ color: item.status === "Completed" ? "#22c55e" : "#3b82f6" }}>{item.status}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "feed" && (
          <View className="px-5">
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">{"\ud83c\udf3e"} Daily Feed Requirement</Text>
              {[
                { item: "Green Fodder (Napier/Maize)", qty: "140 kg/day", cost: "\u20b9700/day", source: "Farm grown" },
                { item: "Dry Fodder (Wheat straw)", qty: "35 kg/day", cost: "\u20b9175/day", source: "Own harvest" },
                { item: "Concentrate Feed", qty: "21 kg/day", cost: "\u20b9630/day", source: "Purchased" },
                { item: "Mineral Mixture", qty: "350 g/day", cost: "\u20b935/day", source: "Purchased" },
                { item: "Salt (Lick block)", qty: "As needed", cost: "\u20b910/day", source: "Purchased" },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center justify-between py-2.5" style={i < 4 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <View className="flex-1">
                    <Text className="text-typography-800 text-xs font-dm-sans-medium">{item.item}</Text>
                    <Text className="text-typography-400 text-xs">{item.qty} \u2022 {item.source}</Text>
                  </View>
                  <Text className="text-typography-700 text-xs font-dm-sans-bold">{item.cost}</Text>
                </View>
              ))}
              <View className="bg-yellow-50 rounded-lg p-2 mt-2">
                <Text className="text-yellow-800 text-xs font-dm-sans-bold">Daily Feed Cost: \u20b91,550 \u2022 Monthly: \u20b946,500</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "integration" && (
          <View className="px-5">
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
              <Text className="text-green-800 font-dm-sans-bold text-base mb-2">{"\ud83d\udd04"} Farm-Livestock Integration</Text>
              <Text className="text-green-600 text-xs">Circular economy benefits from integrated farming</Text>
            </View>

            {[
              {
                flow: "Dung \u2192 FYM/Vermicompost", icon: "\ud83d\udca9\u2192\ud83e\udea4",
                detail: "7 cattle produce ~50 kg dung/day = 18 tons/year",
                value: "Replaces \u20b91,08,000 worth of chemical fertilizers",
                savings: "FYM applied to all fields. Vermicompost for nursery beds.",
                color: "#22c55e",
              },
              {
                flow: "Cow Urine \u2192 Jeevamrutha/Panchagavya", icon: "\ud83d\udca7\u2192\ud83e\udded",
                detail: "~15L cow urine/day for bio-stimulant preparation",
                value: "Free bio-input worth \u20b924,000/year",
                savings: "Monthly Jeevamrutha for 8 acres. Boosts soil biology.",
                color: "#8b5cf6",
              },
              {
                flow: "Crop Residue \u2192 Cattle Feed", icon: "\ud83c\udf3e\u2192\ud83d\udc04",
                detail: "Wheat straw (12.5 ac) = ~6 tons dry fodder",
                value: "Saves \u20b936,000 in purchased dry fodder",
                savings: "6 months fodder supply from own wheat harvest.",
                color: "#f59e0b",
              },
              {
                flow: "Milk Income \u2192 Farm Investment", icon: "\ud83e\udd5b\u2192\ud83d\udcb0",
                detail: "Monthly dairy income: \u20b966,000",
                value: "Covers all farm labor costs (\u20b946,500) + feed surplus",
                savings: "Dairy provides steady cash flow during crop growing season.",
                color: "#3b82f6",
              },
              {
                flow: "Biogas Potential", icon: "\ud83d\udca8\u2192\u26a1",
                detail: "50 kg dung/day = 2 m\u00b3 biogas (enough for cooking + light)",
                value: "Saves \u20b92,400/month in LPG + electricity",
                savings: "Slurry from biogas plant = enriched liquid fertilizer.",
                color: "#06b6d4",
              },
            ].map((item, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border-l-4" style={{ borderLeftColor: item.color }}>
                <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.flow}</Text>
                <Text className="text-typography-600 text-xs mt-1">{item.detail}</Text>
                <View className="bg-green-50 rounded-lg p-2 mt-2">
                  <Text className="text-green-700 text-xs font-dm-sans-medium">{"\ud83d\udcb0"} {item.value}</Text>
                </View>
                <Text className="text-typography-500 text-xs mt-1">{item.savings}</Text>
              </View>
            ))}

            <View className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 mt-2">
              <Text className="text-yellow-800 font-dm-sans-bold text-sm mb-1">Total Integration Value</Text>
              <Text className="text-yellow-800 text-2xl font-dm-sans-bold">{"\u20b9"}1,96,800/year</Text>
              <Text className="text-yellow-600 text-xs">In fertilizer savings + feed savings + biogas + steady income</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
