import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type CreditTab = "active" | "compare" | "eligibility" | "repayment";

export default function CreditTrackerScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CreditTab>("active");

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83c\udfe6"} Agri-Credit Tracker</Text>
          <Text className="text-typography-400 text-xs">Loans, credit comparison & repayment</Text>
        </View>
      </View>

      <View className="flex-row mx-5 mt-3 mb-3 bg-background-100 rounded-xl p-1">
        {(["active", "compare", "eligibility", "repayment"] as CreditTab[]).map((t) => (
          <Pressable key={t} className="flex-1 items-center py-2 rounded-lg" style={activeTab === t ? { backgroundColor: "#16a34a" } : {}} onPress={() => setActiveTab(t)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === t ? "text-white" : "text-typography-500"}`}>
              {t === "active" ? "\ud83d\udcb3 Active" : t === "compare" ? "\ud83d\udcca Compare" : t === "eligibility" ? "\u2705 Eligible" : "\ud83d\udcc5 Repay"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "active" && (
          <View className="px-5">
            {/* Active Loan */}
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Text style={{ fontSize: 24 }}>{"\ud83d\udcb3"}</Text>
                  <View className="ml-3">
                    <Text className="text-blue-800 font-dm-sans-bold text-base">Kisan Credit Card</Text>
                    <Text className="text-blue-600 text-xs">A/C: XXXXXXXXXX4287 \u2022 SBI Nashik</Text>
                  </View>
                </View>
                <View className="bg-green-100 rounded-full px-2 py-0.5">
                  <Text className="text-green-700 text-xs font-dm-sans-bold">Active</Text>
                </View>
              </View>

              <View className="flex-row gap-3 mb-3">
                {[
                  { label: "Credit Limit", value: "\u20b92,50,000", color: "#3b82f6" },
                  { label: "Used", value: "\u20b91,80,000", color: "#f59e0b" },
                  { label: "Available", value: "\u20b970,000", color: "#22c55e" },
                ].map((item, i) => (
                  <View key={i} className="flex-1 bg-white rounded-xl p-3 items-center">
                    <Text className="font-dm-sans-bold text-lg" style={{ color: item.color }}>{item.value}</Text>
                    <Text className="text-typography-400 text-xs">{item.label}</Text>
                  </View>
                ))}
              </View>

              <View className="h-3 bg-blue-200 rounded-full overflow-hidden">
                <View className="h-full rounded-full bg-blue-500" style={{ width: "72%" }} />
              </View>
              <Text className="text-blue-600 text-xs mt-1 text-center">72% utilized</Text>

              {[
                { label: "Interest Rate", value: "7% p.a. (effective 4% with subvention)" },
                { label: "Timely Repayment Rebate", value: "Additional 3% = effective 1% p.a." },
                { label: "Valid Till", value: "March 2027 (Annual renewal)" },
                { label: "Last Withdrawal", value: "\u20b950,000 on Mar 15, 2026" },
                { label: "Next Repayment Due", value: "Jun 30, 2026 (crop harvest proceeds)" },
              ].map((item, i) => (
                <View key={i} className="flex-row justify-between py-2" style={i < 4 ? { borderBottomWidth: 1, borderBottomColor: "#bfdbfe" } : {}}>
                  <Text className="text-blue-700 text-xs">{item.label}</Text>
                  <Text className="text-blue-900 text-xs font-dm-sans-bold">{item.value}</Text>
                </View>
              ))}
            </View>

            {/* PM-KISAN */}
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
              <View className="flex-row items-center mb-2">
                <Text style={{ fontSize: 20 }}>{"\ud83c\udfe6"}</Text>
                <View className="ml-3">
                  <Text className="text-green-800 font-dm-sans-bold text-sm">PM-KISAN Income Support</Text>
                  <Text className="text-green-600 text-xs">Not a loan - direct benefit transfer</Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-green-800 text-lg font-dm-sans-bold">{"\u20b9"}30,000</Text>
                  <Text className="text-green-600 text-xs">Total Received</Text>
                </View>
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-green-800 text-lg font-dm-sans-bold">{"\u20b9"}2,000</Text>
                  <Text className="text-green-600 text-xs">Next (Apr 2026)</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === "compare" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Agri-Loan Comparison</Text>

            {[
              {
                bank: "SBI Kisan Credit Card", rate: "7% (eff. 4%)", limit: "Up to \u20b93L", tenure: "Annual (5yr validity)",
                pros: ["Lowest effective rate", "Govt subvention", "Easy renewal"], cons: ["Crop-specific limits", "Annual repayment pressure"],
                icon: "\ud83c\udfe6", color: "#3b82f6", score: 95,
              },
              {
                bank: "Agri Gold Loan (SBI/BoB)", rate: "7.5%", limit: "Up to \u20b925L (vs gold)", tenure: "12-36 months",
                pros: ["Quick disbursement (1 hour)", "No income proof needed", "Flexible repayment"], cons: ["Need gold collateral", "Risk of gold seizure"],
                icon: "\ud83d\udcb0", color: "#f59e0b", score: 82,
              },
              {
                bank: "NABARD Warehouse Receipt", rate: "6-7%", limit: "60-70% of stored produce value", tenure: "6-12 months",
                pros: ["Pledged loan on stored produce", "Sell when prices rise", "Low interest"], cons: ["Need registered warehouse", "Only post-harvest"],
                icon: "\ud83c\udfe0", color: "#8b5cf6", score: 78,
              },
              {
                bank: "Agri Infra Fund (AIF)", rate: "3% subvention on bank rate", limit: "Up to \u20b92 Cr", tenure: "7 years",
                pros: ["For infra: cold storage, pack house", "CGTMSE guarantee", "Long tenure"], cons: ["Project proposal needed", "Longer approval time"],
                icon: "\ud83c\udfe2", color: "#22c55e", score: 75,
              },
              {
                bank: "Micro Finance (SHG/JLG)", rate: "12-18%", limit: "\u20b950K-2L", tenure: "6-24 months",
                pros: ["No collateral", "Group guarantee", "Weekly repayment option"], cons: ["High interest", "Small amounts", "Group dependency"],
                icon: "\ud83d\udc65", color: "#ef4444", score: 55,
              },
            ].map((loan, i) => {
              const scoreColor = loan.score >= 90 ? "#22c55e" : loan.score >= 75 ? "#84cc16" : loan.score >= 60 ? "#f59e0b" : "#ef4444";
              return (
                <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <Text style={{ fontSize: 20 }}>{loan.icon}</Text>
                      <Text className="text-typography-900 font-dm-sans-bold text-sm ml-2">{loan.bank}</Text>
                    </View>
                    <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: scoreColor + "15", borderWidth: 2, borderColor: scoreColor }}>
                      <Text className="font-dm-sans-bold text-xs" style={{ color: scoreColor }}>{loan.score}</Text>
                    </View>
                  </View>

                  <View className="flex-row gap-2 mb-2">
                    <View className="flex-1 bg-background-100 rounded-lg p-2 items-center">
                      <Text className="text-typography-800 text-xs font-dm-sans-bold">{loan.rate}</Text>
                      <Text className="text-typography-400" style={{ fontSize: 8 }}>Interest</Text>
                    </View>
                    <View className="flex-1 bg-background-100 rounded-lg p-2 items-center">
                      <Text className="text-typography-800 text-xs font-dm-sans-bold" numberOfLines={1}>{loan.limit}</Text>
                      <Text className="text-typography-400" style={{ fontSize: 8 }}>Limit</Text>
                    </View>
                    <View className="flex-1 bg-background-100 rounded-lg p-2 items-center">
                      <Text className="text-typography-800 text-xs font-dm-sans-bold" numberOfLines={1}>{loan.tenure}</Text>
                      <Text className="text-typography-400" style={{ fontSize: 8 }}>Tenure</Text>
                    </View>
                  </View>

                  <View className="flex-row gap-2">
                    <View className="flex-1 bg-green-50 rounded-lg p-2">
                      <Text className="text-green-700" style={{ fontSize: 8 }}>Pros</Text>
                      {loan.pros.map((p, j) => <Text key={j} className="text-green-600 leading-4" style={{ fontSize: 9 }}>{"\u2713"} {p}</Text>)}
                    </View>
                    <View className="flex-1 bg-red-50 rounded-lg p-2">
                      <Text className="text-red-700" style={{ fontSize: 8 }}>Cons</Text>
                      {loan.cons.map((c, j) => <Text key={j} className="text-red-600 leading-4" style={{ fontSize: 9 }}>{"\u2022"} {c}</Text>)}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === "eligibility" && (
          <View className="px-5">
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
              <Text className="text-green-800 font-dm-sans-bold text-sm">{"\u2705"} Your Eligibility Summary</Text>
              <Text className="text-green-600 text-xs mt-1">Based on your landholding, income, and farm profile</Text>
            </View>

            {[
              { scheme: "KCC Enhancement (\u20b93L \u2192 \u20b95L)", eligible: true, reason: "45.5 acres irrigated land, good repayment history", docs: "Land records, KCC statement, crop plan", action: "Apply at SBI branch" },
              { scheme: "Agri Infra Fund (Cold Storage)", eligible: true, reason: "Grape export activity qualifies for pack house + pre-cooler", docs: "Project report, APEDA registration, land docs", action: "Apply via AIF portal" },
              { scheme: "PMFBY Premium Credit", eligible: true, reason: "Auto-debited from KCC for insured crops", docs: "Already enrolled - automatic", action: "No action needed" },
              { scheme: "Solar Pump Subsidy (PM-KUSUM)", eligible: true, reason: "Existing borewell, no solar pump yet", docs: "Electricity bill, borewell docs, Aadhaar", action: "Apply on state portal" },
              { scheme: "Dairy Loan (NABARD)", eligible: true, reason: "7 cattle, existing dairy operation", docs: "Cattle insurance, milk society membership", action: "Apply via NABARD" },
            ].map((item, i) => (
              <View key={i} className="bg-background-50 rounded-xl p-4 mb-2 border border-outline-100">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.scheme}</Text>
                  <View className="bg-green-50 rounded-full px-2 py-0.5">
                    <Text className="text-green-700 text-xs font-dm-sans-bold">{"\u2705"} Eligible</Text>
                  </View>
                </View>
                <Text className="text-typography-600 text-xs mt-1">{item.reason}</Text>
                <Text className="text-typography-400 text-xs mt-0.5">{"\ud83d\udcc4"} Docs: {item.docs}</Text>
                <Pressable className="bg-green-500 rounded-lg py-2 items-center mt-2">
                  <Text className="text-white text-xs font-dm-sans-bold">{item.action} {"\u2192"}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {activeTab === "repayment" && (
          <View className="px-5">
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Repayment Plan</Text>

              {/* Timeline */}
              {[
                { date: "Jun 30, 2026", amount: "\u20b91,80,000", source: "Wheat + Onion harvest proceeds", status: "planned", interest: "\u20b92,700 (4% for 3 months)" },
                { date: "Oct 31, 2026", amount: "Withdrawal for Rabi", source: "KCC withdrawal for next season", status: "planned", interest: "New cycle starts" },
              ].map((item, i) => (
                <View key={i} className="flex-row mb-3">
                  <View className="items-center w-6">
                    <View className="w-3 h-3 rounded-full bg-blue-500 z-10" />
                    {i === 0 && <View className="w-0.5 flex-1 bg-blue-200" />}
                  </View>
                  <View className="flex-1 ml-3 bg-blue-50 rounded-xl p-3 border border-blue-200">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-blue-800 font-dm-sans-bold text-sm">{item.date}</Text>
                      <Text className="text-blue-800 font-dm-sans-bold text-sm">{item.amount}</Text>
                    </View>
                    <Text className="text-blue-600 text-xs">{item.source}</Text>
                    <Text className="text-blue-500 text-xs mt-0.5">{item.interest}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Interest Savings Tips */}
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200">
              <Text className="text-green-800 font-dm-sans-bold text-sm mb-2">{"\ud83d\udca1"} Interest Saving Tips</Text>
              {[
                "Repay within 1 year to get 3% subvention (7% \u2192 4%)",
                "Repay on time for additional 3% prompt bonus (4% \u2192 1%!)",
                "Your effective cost on \u20b91.8L: only \u20b91,800/year at 1%",
                "Partial repayments reduce interest proportionally",
                "Keep receipts for income tax benefit under Section 80P",
              ].map((tip, i) => (
                <Text key={i} className="text-green-700 text-xs leading-5">{"\u2022"} {tip}</Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
