import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type WaterTab = "overview" | "borewell" | "quality" | "rainwater" | "budget";

export default function WaterManagementScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<WaterTab>("overview");

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\udca7"} Water Management</Text>
          <Text className="text-typography-400 text-xs">Borewell, quality, rainwater & budget</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-12 mx-5 mt-3 mb-2">
        {([
          { key: "overview" as WaterTab, label: "\ud83d\udcca Overview" },
          { key: "borewell" as WaterTab, label: "\u26f2 Borewell" },
          { key: "quality" as WaterTab, label: "\ud83e\uddea Quality" },
          { key: "rainwater" as WaterTab, label: "\ud83c\udf27\ufe0f Rainwater" },
          { key: "budget" as WaterTab, label: "\ud83d\udcb0 Budget" },
        ]).map((tab) => (
          <Pressable key={tab.key} className="rounded-xl px-4 py-2 mr-2" style={activeTab === tab.key ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }} onPress={() => setActiveTab(tab.key)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === tab.key ? "text-white" : "text-typography-500"}`}>{tab.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "overview" && (
          <View className="px-5">
            {/* Water Balance */}
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-4">
              <Text className="text-blue-800 font-dm-sans-bold text-base mb-3">Water Balance (This Season)</Text>
              <View className="flex-row gap-3 mb-3">
                {[
                  { label: "Total Available", value: "8.2M L", sub: "Borewell + Rain + Pond", color: "#3b82f6" },
                  { label: "Used", value: "4.2M L", sub: "51% of total", color: "#22c55e" },
                  { label: "Remaining", value: "4.0M L", sub: "~6 weeks supply", color: "#8b5cf6" },
                ].map((item, i) => (
                  <View key={i} className="flex-1 bg-white rounded-xl p-3 items-center">
                    <Text className="font-dm-sans-bold text-lg" style={{ color: item.color }}>{item.value}</Text>
                    <Text className="text-typography-400 text-xs">{item.label}</Text>
                    <Text className="text-typography-300" style={{ fontSize: 8 }}>{item.sub}</Text>
                  </View>
                ))}
              </View>

              {/* Usage by source */}
              <View className="h-4 rounded-full overflow-hidden flex-row bg-blue-200">
                <View className="bg-blue-500" style={{ flex: 60 }} />
                <View className="bg-cyan-400" style={{ flex: 25 }} />
                <View className="bg-indigo-400" style={{ flex: 15 }} />
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="text-blue-600 text-xs">Borewell (60%)</Text>
                <Text className="text-cyan-600 text-xs">Rain (25%)</Text>
                <Text className="text-indigo-600 text-xs">Pond (15%)</Text>
              </View>
            </View>

            {/* Per-field water usage */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Per-Field Water Usage</Text>
            {[
              { field: "East Block - Rice", usage: 2.8, total: 8.2, method: "Flood", icon: "\ud83c\udf3e" },
              { field: "South Block - Tomato", usage: 0.6, total: 8.2, method: "Sprinkler", icon: "\ud83c\udf45" },
              { field: "North Block - Wheat", usage: 0.4, total: 8.2, method: "Drip", icon: "\ud83c\udf3e" },
              { field: "Greenhouse - Capsicum", usage: 0.15, total: 8.2, method: "Fertigation", icon: "\ud83c\udf36\ufe0f" },
              { field: "West Orchard - Grapes", usage: 0.2, total: 8.2, method: "Drip", icon: "\ud83c\udf47" },
              { field: "Central Block - Onion", usage: 0.05, total: 8.2, method: "Furrow", icon: "\ud83e\uddc5" },
            ].map((field, i) => {
              const pct = (field.usage / field.total) * 100;
              return (
                <View key={i} className="mb-3">
                  <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center">
                      <Text style={{ fontSize: 14 }}>{field.icon}</Text>
                      <Text className="text-typography-700 text-xs font-dm-sans-medium ml-2">{field.field}</Text>
                    </View>
                    <Text className="text-blue-600 text-xs font-dm-sans-bold">{field.usage}M L ({field.method})</Text>
                  </View>
                  <View className="h-2 bg-background-200 rounded-full overflow-hidden">
                    <View className="h-full rounded-full bg-blue-400" style={{ width: `${pct * 3}%` }} />
                  </View>
                </View>
              );
            })}

            {/* Water efficiency */}
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mt-2">
              <Text className="text-green-800 font-dm-sans-bold text-sm mb-2">{"\ud83d\udcc8"} Water Efficiency Score: 78/100</Text>
              {[
                "Drip irrigation saves 60% vs flood (active on 40 acres)",
                "Rice paddy AWD technique saving 30% (1.2M L saved)",
                "Greenhouse fertigation at 92% efficiency",
                "Recommendation: Convert remaining 5.5 acres to drip for +15 pts",
              ].map((item, i) => (
                <Text key={i} className="text-green-700 text-xs leading-5">{"\u2022"} {item}</Text>
              ))}
            </View>
          </View>
        )}

        {activeTab === "borewell" && (
          <View className="px-5">
            {[
              {
                name: "Borewell #1 (Main)", depth: "180 ft", yield: "3,500 L/hr", pump: "5 HP Kirloskar",
                status: "operational", waterLevel: "42 ft (static)", drawdown: "68 ft (pumping)",
                hoursToday: 4, hoursMonth: 85, quality: "Good (TDS: 480 ppm)", age: "2018",
                icon: "\u26f2",
              },
              {
                name: "Borewell #2 (Backup)", depth: "220 ft", yield: "2,200 L/hr", pump: "3 HP Crompton",
                status: "operational", waterLevel: "55 ft (static)", drawdown: "95 ft (pumping)",
                hoursToday: 0, hoursMonth: 25, quality: "Moderate (TDS: 720 ppm)", age: "2020",
                icon: "\u26f2",
              },
            ].map((well, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-4 border border-outline-100">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 24 }}>{well.icon}</Text>
                    <View className="ml-3">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{well.name}</Text>
                      <Text className="text-typography-400 text-xs">Depth: {well.depth} \u2022 Since: {well.age}</Text>
                    </View>
                  </View>
                  <View className="bg-green-50 rounded-full px-2 py-0.5 border border-green-200">
                    <Text className="text-green-700 text-xs font-dm-sans-bold capitalize">{well.status}</Text>
                  </View>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  {[
                    { label: "Yield", value: well.yield, icon: "\ud83d\udca7" },
                    { label: "Pump", value: well.pump, icon: "\u2699\ufe0f" },
                    { label: "Water Level", value: well.waterLevel, icon: "\ud83d\udccf" },
                    { label: "Drawdown", value: well.drawdown, icon: "\u2b07\ufe0f" },
                    { label: "Today", value: `${well.hoursToday} hrs`, icon: "\u23f1\ufe0f" },
                    { label: "This Month", value: `${well.hoursMonth} hrs`, icon: "\ud83d\udcc5" },
                    { label: "Quality", value: well.quality.split("(")[0], icon: "\ud83e\uddea" },
                    { label: "TDS", value: well.quality.match(/\((.+)\)/)?.[1] || "", icon: "\ud83d\udcca" },
                  ].map((item, j) => (
                    <View key={j} className="bg-background-100 rounded-lg p-2" style={{ width: "23%" }}>
                      <Text style={{ fontSize: 10 }}>{item.icon}</Text>
                      <Text className="text-typography-800 text-xs font-dm-sans-bold" numberOfLines={1}>{item.value}</Text>
                      <Text className="text-typography-400" style={{ fontSize: 8 }}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {/* Water Level Trend */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100">
              <Text className="text-typography-900 font-dm-sans-bold text-sm mb-3">Water Table Trend (Borewell #1)</Text>
              <View className="h-28 flex-row items-start">
                {[
                  { month: "Oct", level: 35 },
                  { month: "Nov", level: 37 },
                  { month: "Dec", level: 39 },
                  { month: "Jan", level: 40 },
                  { month: "Feb", level: 42 },
                  { month: "Mar", level: 44 },
                  { month: "Apr", level: 42 },
                ].map((item, i) => {
                  const maxLevel = 50;
                  const height = (item.level / maxLevel) * 100;
                  return (
                    <View key={i} className="flex-1 items-center">
                      <Text className="text-typography-500 text-xs mb-1" style={{ fontSize: 8 }}>{item.level}ft</Text>
                      <View className="w-5 rounded-b-lg" style={{ height: `${height}%`, backgroundColor: item.level > 42 ? "#ef4444" : "#3b82f6" }} />
                      <Text className="text-typography-400 mt-1" style={{ fontSize: 8 }}>{item.month}</Text>
                    </View>
                  );
                })}
              </View>
              <Text className="text-typography-400 text-xs text-center mt-1">Deeper = more drawdown (water table dropping)</Text>
            </View>
          </View>
        )}

        {activeTab === "quality" && (
          <View className="px-5">
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Water Quality Report</Text>
              <Text className="text-typography-400 text-xs mb-3">Last tested: Feb 2026 \u2022 ICAR Lab Nashik</Text>

              {[
                { param: "pH", value: "7.2", ideal: "6.5-8.5", status: "ok", unit: "" },
                { param: "TDS", value: "480", ideal: "< 1000", status: "ok", unit: "ppm" },
                { param: "EC", value: "0.72", ideal: "< 2.0", status: "ok", unit: "dS/m" },
                { param: "Hardness", value: "185", ideal: "< 300", status: "ok", unit: "mg/L" },
                { param: "Chloride", value: "95", ideal: "< 250", status: "ok", unit: "mg/L" },
                { param: "Sodium (SAR)", value: "4.2", ideal: "< 10", status: "ok", unit: "" },
                { param: "Iron", value: "0.8", ideal: "< 1.0", status: "watch", unit: "mg/L" },
                { param: "Boron", value: "0.3", ideal: "< 0.5", status: "ok", unit: "mg/L" },
                { param: "RSC", value: "1.2", ideal: "< 2.5", status: "ok", unit: "meq/L" },
                { param: "Coliform", value: "Absent", ideal: "Absent", status: "ok", unit: "" },
              ].map((item, i) => {
                const statusColors: Record<string, string> = { ok: "#22c55e", watch: "#f59e0b", bad: "#ef4444" };
                return (
                  <View key={i} className="flex-row items-center py-2.5" style={i < 9 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                    <Text className="text-typography-700 text-xs font-dm-sans-medium w-20">{item.param}</Text>
                    <Text className="text-typography-900 text-xs font-dm-sans-bold flex-1">{item.value} {item.unit}</Text>
                    <Text className="text-typography-400 text-xs w-16">{item.ideal}</Text>
                    <View className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[item.status] }} />
                  </View>
                );
              })}
            </View>

            <View className="bg-green-50 rounded-2xl p-4 border border-green-200">
              <Text className="text-green-800 font-dm-sans-bold text-sm mb-2">{"\u2705"} Water Quality Verdict</Text>
              <Text className="text-green-700 text-xs leading-5">
                Overall: GOOD for irrigation. Safe for all crops including sensitive ones (grapes, capsicum).
                Iron slightly elevated - may cause clogging in drip emitters. Recommend inline filter cleaning monthly.
                SAR acceptable - no sodicity risk. Suitable for drip, sprinkler, and flood irrigation.
              </Text>
            </View>
          </View>
        )}

        {activeTab === "rainwater" && (
          <View className="px-5">
            <View className="bg-cyan-50 rounded-2xl p-4 border border-cyan-200 mb-4">
              <Text className="text-cyan-800 font-dm-sans-bold text-base mb-2">{"\ud83c\udf27\ufe0f"} Rainwater Harvesting</Text>
              <View className="flex-row gap-3 mb-3">
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-cyan-800 text-xl font-dm-sans-bold">650mm</Text>
                  <Text className="text-cyan-600 text-xs">Annual Rainfall</Text>
                </View>
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-cyan-800 text-xl font-dm-sans-bold">2.1M L</Text>
                  <Text className="text-cyan-600 text-xs">Harvested/yr</Text>
                </View>
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-cyan-800 text-xl font-dm-sans-bold">5,000</Text>
                  <Text className="text-cyan-600 text-xs">Pond (m\u00b3)</Text>
                </View>
              </View>
            </View>

            {/* Infrastructure */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-sm mb-3">Harvesting Infrastructure</Text>
              {[
                { name: "Farm Pond", capacity: "5,000 m\u00b3", status: "45% full", type: "Surface storage", icon: "\ud83d\udca7" },
                { name: "Borewell Recharge Pit", capacity: "50,000 L/yr recharge", status: "Active (monsoon)", type: "Groundwater recharge", icon: "\u26f2" },
                { name: "Rooftop Collection", capacity: "15,000 L (shed roof)", status: "Connected to pond", type: "Roof harvest", icon: "\ud83c\udfe0" },
                { name: "Contour Bunds", capacity: "In-situ moisture conservation", status: "6 bunds across farm", type: "Soil moisture", icon: "\ud83c\udf0e" },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center py-2.5" style={i < 3 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-800 text-xs font-dm-sans-bold">{item.name}</Text>
                    <Text className="text-typography-500 text-xs">{item.type} \u2022 {item.capacity}</Text>
                  </View>
                  <View className="bg-cyan-50 rounded-full px-2 py-0.5">
                    <Text className="text-cyan-700 text-xs font-dm-sans-medium">{item.status}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Rainfall Log */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100">
              <Text className="text-typography-900 font-dm-sans-bold text-sm mb-3">Monthly Rainfall (mm)</Text>
              <View className="h-28 flex-row items-end">
                {[
                  { month: "Jun", rain: 120 }, { month: "Jul", rain: 180 },
                  { month: "Aug", rain: 150 }, { month: "Sep", rain: 110 },
                  { month: "Oct", rain: 45 }, { month: "Nov", rain: 15 },
                  { month: "Dec", rain: 5 }, { month: "Jan", rain: 0 },
                  { month: "Feb", rain: 8 }, { month: "Mar", rain: 12 },
                  { month: "Apr", rain: 0 }, { month: "May", rain: 5 },
                ].map((item, i) => {
                  const maxRain = 200;
                  const height = Math.max((item.rain / maxRain) * 100, 2);
                  return (
                    <View key={i} className="flex-1 items-center">
                      <Text className="text-typography-500 mb-0.5" style={{ fontSize: 7 }}>{item.rain}</Text>
                      <View className="w-4 rounded-t-sm" style={{ height: `${height}%`, backgroundColor: item.rain > 0 ? "#06b6d4" : "#e5e7eb" }} />
                      <Text className="text-typography-400 mt-0.5" style={{ fontSize: 7 }}>{item.month}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {activeTab === "budget" && (
          <View className="px-5">
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-4">
              <Text className="text-blue-800 font-dm-sans-bold text-base mb-2">Water Cost Analysis (Rabi 25-26)</Text>

              {[
                { source: "Borewell Electricity", cost: 33600, detail: "4,200 kWh x \u20b98/kWh" },
                { source: "Pump Maintenance", cost: 6500, detail: "Bearing + service" },
                { source: "Drip System Maintenance", cost: 3500, detail: "Filters, laterals, fittings" },
                { source: "Sprinkler Operation", cost: 2000, detail: "Nozzles + fuel" },
                { source: "Farm Pond Maintenance", cost: 1500, detail: "De-silting (annual share)" },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center justify-between py-2" style={i < 4 ? { borderBottomWidth: 1, borderBottomColor: "#bfdbfe" } : {}}>
                  <View>
                    <Text className="text-blue-800 text-xs font-dm-sans-medium">{item.source}</Text>
                    <Text className="text-blue-600 text-xs">{item.detail}</Text>
                  </View>
                  <Text className="text-blue-800 text-xs font-dm-sans-bold">{"\u20b9"}{item.cost.toLocaleString()}</Text>
                </View>
              ))}
              <View className="flex-row items-center justify-between pt-3 mt-2 border-t-2 border-blue-300">
                <Text className="text-blue-800 font-dm-sans-bold text-sm">Total Water Cost</Text>
                <Text className="text-blue-800 font-dm-sans-bold text-lg">{"\u20b9"}47,100</Text>
              </View>
              <Text className="text-blue-600 text-xs mt-1">Cost per acre: {"\u20b9"}1,035 \u2022 Cost per 1000L: {"\u20b9"}11.2</Text>
            </View>

            {/* Savings from drip */}
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200">
              <Text className="text-green-800 font-dm-sans-bold text-sm mb-2">{"\ud83d\udcb0"} Savings from Efficient Irrigation</Text>
              {[
                "Drip vs Flood: 60% water saved = \u20b970,000 in electricity",
                "AWD in Rice: 30% saved = \u20b912,000 in pumping costs",
                "Sensor-based scheduling: 15% optimization = \u20b97,000",
                "Total estimated savings this season: \u20b989,000",
                "ROI on drip investment: Paid back in 2.5 seasons",
              ].map((item, i) => (
                <Text key={i} className="text-green-700 text-xs leading-5">{"\u2022"} {item}</Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
