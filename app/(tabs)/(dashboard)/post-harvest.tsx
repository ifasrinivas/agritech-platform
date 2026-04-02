import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type PHTab = "storage" | "processing" | "losses" | "value-add";

export default function PostHarvestScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PHTab>("storage");

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83c\udfe0"} Post-Harvest Management</Text>
          <Text className="text-typography-400 text-xs">Storage, processing & value addition</Text>
        </View>
      </View>

      <View className="flex-row mx-5 mt-3 mb-3 bg-background-100 rounded-xl p-1">
        {(["storage", "processing", "losses", "value-add"] as PHTab[]).map((t) => (
          <Pressable key={t} className="flex-1 items-center py-2 rounded-lg" style={activeTab === t ? { backgroundColor: "#16a34a" } : {}} onPress={() => setActiveTab(t)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === t ? "text-white" : "text-typography-500"}`}>
              {t === "storage" ? "\ud83c\udfe0 Storage" : t === "processing" ? "\u2699\ufe0f Process" : t === "losses" ? "\ud83d\udcc9 Losses" : "\ud83d\udcb0 Value Add"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "storage" && (
          <View className="px-5">
            {/* Active Storage */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Current Storage</Text>
            {[
              { produce: "Onion", qty: "15 tons (cured)", location: "On-farm storage shed", temp: "Ambient (28-35\u00b0C)", shelfLife: "4-5 months (Kharif lot)", condition: "Good - 5% sprouting", icon: "\ud83e\uddc5", color: "#f97316" },
              { produce: "Wheat Grain", qty: "Expected 230 qtl (Apr 20)", location: "Godown (booked)", temp: "Ambient, moisture < 14%", shelfLife: "12+ months if dry", condition: "Not yet harvested", icon: "\ud83c\udf3e", color: "#f59e0b" },
              { produce: "Grape (Cold Store)", qty: "42 qtl (export packed)", location: "FPO Cold Storage, MIDC", temp: "0-2\u00b0C, 90-95% RH", shelfLife: "45-60 days", condition: "Excellent - ready to ship", icon: "\ud83c\udf47", color: "#8b5cf6" },
            ].map((item, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                    <View className="ml-3">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.produce}</Text>
                      <Text className="text-typography-500 text-xs">{item.qty}</Text>
                    </View>
                  </View>
                  <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: item.color + "15" }}>
                    <Text className="text-xs font-dm-sans-medium" style={{ color: item.color }}>{item.condition.split("-")[0].trim()}</Text>
                  </View>
                </View>
                <View className="flex-row gap-2">
                  {[
                    { label: "Location", value: item.location },
                    { label: "Temperature", value: item.temp },
                    { label: "Shelf Life", value: item.shelfLife },
                  ].map((m, j) => (
                    <View key={j} className="flex-1 bg-background-100 rounded-lg p-1.5">
                      <Text className="text-typography-400" style={{ fontSize: 8 }}>{m.label}</Text>
                      <Text className="text-typography-800 text-xs font-dm-sans-medium" numberOfLines={2}>{m.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {/* Storage Best Practices */}
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mt-2">
              <Text className="text-blue-800 font-dm-sans-bold text-sm mb-2">{"\ud83d\udca1"} Storage Tips</Text>
              {[
                "Onion: Cure 10-14 days in shade. Store in well-ventilated structure. Avoid moisture.",
                "Wheat: Dry to < 14% moisture. Fumigate godown. Stack on dunnage.",
                "Grapes: Pre-cool to 2\u00b0C within 4 hours. Use SO\u2082 pads. Ship in reefer.",
                "Tomato: Store at 12-15\u00b0C for green, 8-10\u00b0C for red. Do not mix maturities.",
              ].map((tip, i) => (
                <Text key={i} className="text-blue-700 text-xs leading-5 mb-1">{"\u2022"} {tip}</Text>
              ))}
            </View>
          </View>
        )}

        {activeTab === "processing" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Processing Opportunities</Text>
            {[
              { input: "Grapes \u2192 Raisins", process: "Sun drying / shade drying on racks", investment: "\u20b925,000 (drying racks)", returns: "1 kg grapes = 250g raisins @ \u20b9250/kg", margin: "+40% over fresh sale", duration: "10-15 days drying", icon: "\ud83c\udf47\u2192", color: "#8b5cf6" },
              { input: "Tomato \u2192 Puree/Sauce", process: "Wash, blanch, pulp, concentrate, pack", investment: "\u20b93-5 Lakhs (mini unit)", returns: "1 ton tomato = 200kg puree @ \u20b9120/kg", margin: "+100% over glut-price fresh", duration: "Same day processing", icon: "\ud83c\udf45\u2192", color: "#ef4444" },
              { input: "Onion \u2192 Dehydrated Flakes", process: "Peel, slice, dry (mechanical/solar)", investment: "\u20b92-3 Lakhs (solar dryer)", returns: "1 ton fresh = 130kg dried @ \u20b9180/kg", margin: "+60% with year-round selling", duration: "24-48 hours drying", icon: "\ud83e\uddc5\u2192", color: "#f97316" },
              { input: "Capsicum \u2192 Dried Powder", process: "Slice, solar dry, grind, pack", investment: "\u20b950,000 (grinder + packing)", returns: "1 ton fresh = 100kg powder @ \u20b9400/kg", margin: "+150% over fresh sale", duration: "3-4 days drying", icon: "\ud83c\udf36\ufe0f\u2192", color: "#dc2626" },
              { input: "Cow Dung \u2192 Vermicompost", process: "Shred, add earthworms, harvest 60 days", investment: "\u20b910,000 (beds + worms)", returns: "1 ton dung = 600kg vermicompost @ \u20b96/kg", margin: "Replaces \u20b91,08,000 fertilizers/yr", duration: "60-90 days cycle", icon: "\ud83d\udca9\u2192", color: "#22c55e" },
            ].map((item, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border-l-4" style={{ borderLeftColor: item.color }}>
                <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.input}</Text>
                <Text className="text-typography-600 text-xs mt-1">{item.process}</Text>
                <View className="flex-row gap-2 mt-2">
                  <View className="flex-1 bg-background-100 rounded-lg p-2">
                    <Text className="text-typography-400" style={{ fontSize: 8 }}>Investment</Text>
                    <Text className="text-typography-800 text-xs font-dm-sans-bold">{item.investment}</Text>
                  </View>
                  <View className="flex-1 bg-green-50 rounded-lg p-2">
                    <Text className="text-green-600" style={{ fontSize: 8 }}>Extra Margin</Text>
                    <Text className="text-green-800 text-xs font-dm-sans-bold">{item.margin}</Text>
                  </View>
                  <View className="flex-1 bg-background-100 rounded-lg p-2">
                    <Text className="text-typography-400" style={{ fontSize: 8 }}>Duration</Text>
                    <Text className="text-typography-800 text-xs font-dm-sans-bold" numberOfLines={1}>{item.duration}</Text>
                  </View>
                </View>
                <Text className="text-typography-500 text-xs mt-2">{"\ud83d\udcb0"} {item.returns}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "losses" && (
          <View className="px-5">
            <View className="bg-red-50 rounded-2xl p-4 border border-red-200 mb-4">
              <Text className="text-red-800 font-dm-sans-bold text-base mb-1">Post-Harvest Loss Tracker</Text>
              <Text className="text-red-600 text-xs">India loses 16-18% of fruits & vegetables post-harvest. Your farm target: &lt; 5%</Text>
            </View>

            {[
              { crop: "Grapes", totalHarvested: "60 qtl", lost: "1.5 qtl (2.5%)", cause: "Transport bruising + overripe", value: "\u20b97,800", target: "< 2%", status: "Near target", color: "#22c55e" },
              { crop: "Onion (Prev season)", totalHarvested: "35 tons", lost: "4.2 tons (12%)", cause: "Sprouting + black mold in storage", value: "\u20b91,09,200", target: "< 8%", status: "Above target", color: "#ef4444" },
              { crop: "Tomato (Prev season)", totalHarvested: "80 tons", lost: "5.6 tons (7%)", cause: "Cracking + squishing in transport", value: "\u20b956,000", target: "< 5%", status: "Above target", color: "#f59e0b" },
            ].map((item, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.crop}</Text>
                  <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: item.color + "15" }}>
                    <Text className="text-xs font-dm-sans-bold" style={{ color: item.color }}>{item.status}</Text>
                  </View>
                </View>
                <View className="flex-row gap-2 mb-2">
                  {[
                    { label: "Harvested", value: item.totalHarvested },
                    { label: "Lost", value: item.lost },
                    { label: "Value Lost", value: item.value },
                  ].map((m, j) => (
                    <View key={j} className="flex-1 bg-background-100 rounded-lg p-2 items-center">
                      <Text className="text-typography-800 text-xs font-dm-sans-bold">{m.value.split("(")[0]}</Text>
                      <Text className="text-typography-400" style={{ fontSize: 8 }}>{m.label}</Text>
                    </View>
                  ))}
                </View>
                <Text className="text-typography-600 text-xs">Cause: {item.cause}</Text>
                <Text className="text-typography-400 text-xs mt-0.5">Target: {item.target}</Text>
              </View>
            ))}

            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mt-2">
              <Text className="text-green-800 font-dm-sans-bold text-sm mb-2">{"\ud83d\udca1"} Loss Reduction Strategies</Text>
              {[
                "Pre-cool produce within 4 hours of harvest (reduces losses by 50%)",
                "Onion: Cure properly (10-14 days) before storage. Reduces rot by 60%",
                "Tomato: Harvest at pink stage, not red. Better transport survival.",
                "Use corrugated boxes instead of gunny bags (-70% bruising)",
                "Sort & grade at farm gate. Reject diseased produce immediately.",
                "Plan harvest to match buyer pickup schedule. Avoid overnight storage.",
              ].map((tip, i) => (
                <Text key={i} className="text-green-700 text-xs leading-5">{"\u2022"} {tip}</Text>
              ))}
            </View>
          </View>
        )}

        {activeTab === "value-add" && (
          <View className="px-5">
            <View className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 mb-4">
              <Text className="text-yellow-800 font-dm-sans-bold text-base mb-2">{"\ud83d\udcb0"} Value Addition Revenue Potential</Text>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-yellow-800 text-xl font-dm-sans-bold">{"\u20b9"}4.5L</Text>
                  <Text className="text-yellow-600 text-xs">Current (fresh)</Text>
                </View>
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-green-800 text-xl font-dm-sans-bold">{"\u20b9"}7.2L</Text>
                  <Text className="text-green-600 text-xs">With processing</Text>
                </View>
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-blue-800 text-xl font-dm-sans-bold">+60%</Text>
                  <Text className="text-blue-600 text-xs">Extra income</Text>
                </View>
              </View>
            </View>

            {/* Products you can make */}
            {[
              { product: "Grape Raisins (Kishmish)", from: "18 qtl Grade B grapes", output: "4.5 qtl raisins", revenue: "\u20b91,12,500", investment: "Drying racks (existing)", icon: "\ud83c\udf47" },
              { product: "Onion Powder", from: "2 tons (sorted rejects)", output: "200 kg powder", revenue: "\u20b980,000", investment: "Solar dryer + grinder", icon: "\ud83e\uddc5" },
              { product: "Tomato Puree (Seasonal)", from: "5 tons (glut season excess)", output: "1 ton puree", revenue: "\u20b91,20,000", investment: "Mini processing unit", icon: "\ud83c\udf45" },
              { product: "Vermicompost", from: "18 tons cattle dung/yr", output: "10.8 tons vermicompost", revenue: "\u20b964,800 (or farm use)", investment: "\u20b910,000 (one-time)", icon: "\ud83e\udeb1" },
              { product: "Organic Jaggery/Honey", from: "Potential: Sugarcane inter-crop", output: "TBD", revenue: "Premium pricing \u20b9120/kg", investment: "Evaluation stage", icon: "\ud83c\udf6f" },
            ].map((p, i) => (
              <View key={i} className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100 flex-row items-center">
                <Text style={{ fontSize: 24 }}>{p.icon}</Text>
                <View className="flex-1 ml-3">
                  <Text className="text-typography-900 font-dm-sans-bold text-sm">{p.product}</Text>
                  <Text className="text-typography-500 text-xs">{p.from} {"\u2192"} {p.output}</Text>
                  <Text className="text-green-600 text-xs font-dm-sans-bold mt-0.5">{p.revenue}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
