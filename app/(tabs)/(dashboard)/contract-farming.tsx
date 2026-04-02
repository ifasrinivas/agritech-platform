import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type ContractTab = "active" | "opportunities" | "fpo" | "history";

export default function ContractFarmingScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContractTab>("active");

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83e\udd1d"} Contract Farming & FPO</Text>
          <Text className="text-typography-400 text-xs">Contracts, partnerships & farmer groups</Text>
        </View>
      </View>

      <View className="flex-row mx-5 mt-3 mb-3 bg-background-100 rounded-xl p-1">
        {(["active", "opportunities", "fpo", "history"] as ContractTab[]).map((t) => (
          <Pressable key={t} className="flex-1 items-center py-2 rounded-lg" style={activeTab === t ? { backgroundColor: "#16a34a" } : {}} onPress={() => setActiveTab(t)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === t ? "text-white" : "text-typography-500"}`}>
              {t === "active" ? "\ud83d\udcdc Active" : t === "opportunities" ? "\ud83c\udf1f New" : t === "fpo" ? "\ud83d\udc65 FPO" : "\ud83d\udccb Past"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "active" && (
          <View className="px-5">
            {[
              {
                buyer: "Fresh Exports Pvt Ltd", crop: "Grapes (Thompson Seedless)", icon: "\ud83c\udf47",
                contract: "Export Grade A, 50 qtl minimum", price: "\u20b95,200/qtl (fixed floor)",
                duration: "Jan - Apr 2026", status: "Active - Delivering",
                delivered: "42/50 qtl", payment: "\u20b92,18,400 received", remaining: "8 qtl by Apr 15",
                terms: ["Floor price guaranteed", "Quality: Brix>18, Berry>18mm, Residue-free", "Packaging provided by buyer", "Payment within 7 days of delivery"],
                color: "#8b5cf6",
              },
              {
                buyer: "BigBasket (Supermarket Chain)", crop: "Tomato (Arka Rakshak)", icon: "\ud83c\udf45",
                contract: "Grade A, weekly supply 5 tons", price: "\u20b915/kg (min) - market linked",
                duration: "May - Jun 2026", status: "Signed - Not Started",
                delivered: "0/40 tons", payment: "Advance: \u20b950,000 received", remaining: "Starts May 10",
                terms: ["Weekly pickup from farm gate", "Sorting/grading by farmer", "Payment: T+3 days via RTGS", "Quality rejection max 10%"],
                color: "#ef4444",
              },
            ].map((contract, i) => (
              <View key={i} className="bg-background-50 rounded-2xl overflow-hidden mb-4 border border-outline-100">
                <View className="h-1.5" style={{ backgroundColor: contract.color }} />
                <View className="p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <Text style={{ fontSize: 22 }}>{contract.icon}</Text>
                      <View className="ml-3">
                        <Text className="text-typography-900 font-dm-sans-bold text-sm">{contract.buyer}</Text>
                        <Text className="text-typography-500 text-xs">{contract.crop}</Text>
                      </View>
                    </View>
                    <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: contract.color + "15" }}>
                      <Text className="text-xs font-dm-sans-bold" style={{ color: contract.color }}>{contract.status.split(" - ")[0]}</Text>
                    </View>
                  </View>

                  <View className="flex-row gap-2 mb-3">
                    {[
                      { label: "Price", value: contract.price.split(" ")[0] },
                      { label: "Duration", value: contract.duration.split(" ")[0] + " " + contract.duration.split(" ")[2] },
                      { label: "Delivered", value: contract.delivered.split("/")[0] },
                    ].map((m, j) => (
                      <View key={j} className="flex-1 bg-background-100 rounded-lg p-2 items-center">
                        <Text className="text-typography-800 text-xs font-dm-sans-bold">{m.value}</Text>
                        <Text className="text-typography-400" style={{ fontSize: 9 }}>{m.label}</Text>
                      </View>
                    ))}
                  </View>

                  <Text className="text-typography-600 text-xs">{"\ud83d\udcb0"} {contract.payment}</Text>
                  <Text className="text-typography-500 text-xs">{"\ud83d\udcc5"} {contract.remaining}</Text>

                  <View className="mt-3 pt-3 border-t border-outline-100">
                    <Text className="text-typography-700 text-xs font-dm-sans-bold mb-1">Key Terms:</Text>
                    {contract.terms.map((term, j) => (
                      <Text key={j} className="text-typography-500 text-xs leading-4">{"\u2022"} {term}</Text>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "opportunities" && (
          <View className="px-5">
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
              <Text className="text-green-800 font-dm-sans-bold text-sm">New Contract Opportunities</Text>
              <Text className="text-green-600 text-xs mt-1">Based on your crops, location, and farm capabilities</Text>
            </View>

            {[
              { buyer: "ITC e-Choupal", crop: "Wheat (Kharif Soybean)", price: "MSP + \u20b9100/qtl premium", qty: "Min 20 qtl", deadline: "Apply by May 31", match: 95, icon: "\ud83c\udf3e" },
              { buyer: "Sahyadri Farms FPO", crop: "Grapes (Export)", price: "\u20b955-65/kg (EU market)", qty: "Min 10 tons/season", deadline: "Open enrollment", match: 90, icon: "\ud83c\udf47" },
              { buyer: "Marico Ltd", crop: "Safflower / Soybean", price: "Contract price, buy-back assured", qty: "Min 10 acres", deadline: "Apply by Jun 15", match: 72, icon: "\ud83c\udf3b" },
              { buyer: "Desai Vegetables Pvt Ltd", crop: "Capsicum (Colored)", price: "\u20b940-60/kg guaranteed", qty: "Weekly 500 kg", deadline: "Rolling", match: 88, icon: "\ud83c\udf36\ufe0f" },
              { buyer: "Jain Farm Fresh", crop: "Onion (Dehydrated)", price: "\u20b918/kg (A grade)", qty: "Min 50 tons/season", deadline: "Apply by Sep 30", match: 68, icon: "\ud83e\uddc5" },
            ].map((opp, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 22 }}>{opp.icon}</Text>
                    <View className="ml-3">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{opp.buyer}</Text>
                      <Text className="text-typography-500 text-xs">{opp.crop}</Text>
                    </View>
                  </View>
                  <View className="bg-green-50 rounded-full w-12 h-12 items-center justify-center border border-green-300">
                    <Text className="text-green-700 font-dm-sans-bold text-sm">{opp.match}%</Text>
                    <Text className="text-green-600" style={{ fontSize: 7 }}>match</Text>
                  </View>
                </View>

                <View className="flex-row gap-2 mb-2">
                  <View className="flex-1 bg-background-100 rounded-lg p-1.5">
                    <Text className="text-typography-400" style={{ fontSize: 8 }}>Price</Text>
                    <Text className="text-typography-800 text-xs font-dm-sans-medium" numberOfLines={1}>{opp.price}</Text>
                  </View>
                  <View className="flex-1 bg-background-100 rounded-lg p-1.5">
                    <Text className="text-typography-400" style={{ fontSize: 8 }}>Quantity</Text>
                    <Text className="text-typography-800 text-xs font-dm-sans-medium">{opp.qty}</Text>
                  </View>
                </View>

                <Text className="text-typography-500 text-xs mb-2">{"\ud83d\udcc5"} {opp.deadline}</Text>

                <Pressable className="bg-green-500 rounded-xl py-2.5 items-center">
                  <Text className="text-white text-xs font-dm-sans-bold">Express Interest {"\u2192"}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {activeTab === "fpo" && (
          <View className="px-5">
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-4">
              <View className="flex-row items-center">
                <Text style={{ fontSize: 28 }}>{"\ud83d\udc65"}</Text>
                <View className="ml-3">
                  <Text className="text-blue-800 font-dm-sans-bold text-base">Nashik Grape Growers FPO</Text>
                  <Text className="text-blue-600 text-xs">Member since 2024 \u2022 Share: \u20b910,000</Text>
                </View>
              </View>
            </View>

            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">FPO Benefits</Text>
              {[
                { benefit: "Collective Bargaining", detail: "Better prices through bulk selling (5-15% premium)", value: "\u20b945,000 saved", icon: "\ud83d\udcb0" },
                { benefit: "Input Procurement", detail: "Bulk purchase of fertilizers and chemicals at discount", value: "12% discount", icon: "\ud83d\udce6" },
                { benefit: "Export Facilitation", detail: "Shared APEDA registration, pack house, cold chain", value: "EU market access", icon: "\ud83c\uddea\ud83c\uddfa" },
                { benefit: "Technical Training", detail: "Monthly workshops on GAP, IPM, post-harvest", value: "12 sessions/yr", icon: "\ud83c\udf93" },
                { benefit: "Credit Linkage", detail: "FPO-backed loans at preferential rates", value: "Up to \u20b95L", icon: "\ud83c\udfe6" },
                { benefit: "Insurance Support", detail: "Group insurance at lower premiums", value: "15% discount", icon: "\ud83d\udee1\ufe0f" },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center py-2.5" style={i < 5 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-800 text-xs font-dm-sans-bold">{item.benefit}</Text>
                    <Text className="text-typography-500 text-xs">{item.detail}</Text>
                  </View>
                  <Text className="text-green-600 text-xs font-dm-sans-bold">{item.value}</Text>
                </View>
              ))}
            </View>

            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100">
              <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">FPO Details</Text>
              {[
                { label: "Registration", value: "Company Act 2013 (Producer Co.)" },
                { label: "Members", value: "148 farmers, 620 acres" },
                { label: "Turnover (2024-25)", value: "\u20b93.2 Crore" },
                { label: "Main Crops", value: "Grapes, Onion, Pomegranate" },
                { label: "Export Markets", value: "EU, UK, Middle East" },
                { label: "CEO", value: "Mr. Avinash Gavhane" },
                { label: "Board Meetings", value: "Monthly (1st Saturday)" },
              ].map((item, i) => (
                <View key={i} className="flex-row justify-between py-1.5" style={i < 6 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <Text className="text-typography-500 text-xs">{item.label}</Text>
                  <Text className="text-typography-800 text-xs font-dm-sans-medium">{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "history" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Past Contracts</Text>
            {[
              { buyer: "Fresh Exports Pvt Ltd", crop: "Grapes", season: "Rabi 2024-25", qty: "48 qtl delivered", revenue: "\u20b92,30,400", rating: 5, status: "Completed - Paid" },
              { buyer: "Metro Cash & Carry", crop: "Capsicum", season: "Rabi 2024-25", qty: "12 tons delivered", revenue: "\u20b94,80,000", rating: 4, status: "Completed - Paid" },
              { buyer: "Haldiram's", crop: "Onion (dehydrated)", season: "Kharif 2024", qty: "30 tons", revenue: "\u20b95,40,000", rating: 4, status: "Completed - Paid" },
            ].map((past, i) => (
              <View key={i} className="bg-background-50 rounded-xl p-4 mb-2 border border-outline-100">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-typography-900 font-dm-sans-bold text-sm">{past.buyer}</Text>
                  <View className="bg-green-50 rounded-full px-2 py-0.5">
                    <Text className="text-green-700 text-xs font-dm-sans-bold">{"\u2713"} {past.status.split(" - ")[1]}</Text>
                  </View>
                </View>
                <Text className="text-typography-500 text-xs">{past.crop} \u2022 {past.season}</Text>
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-typography-600 text-xs">{past.qty}</Text>
                  <Text className="text-green-700 font-dm-sans-bold text-sm">{past.revenue}</Text>
                </View>
                <View className="flex-row items-center mt-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Text key={j} style={{ fontSize: 12, color: j < past.rating ? "#f59e0b" : "#d4d4d4" }}>{"\u2605"}</Text>
                  ))}
                  <Text className="text-typography-400 text-xs ml-1">Your rating</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
