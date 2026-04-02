import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type SchemeFilter = "all" | "active" | "apply" | "central" | "state";

interface GovScheme {
  id: string;
  name: string;
  ministry: string;
  type: "central" | "state";
  benefit: string;
  eligibility: string;
  deadline: string;
  userStatus: "active" | "apply" | "expired" | "pending";
  amount?: string;
  icon: string;
  color: string;
  details: string[];
}

const schemes: GovScheme[] = [
  {
    id: "gs1", name: "PM-KISAN", ministry: "Ministry of Agriculture", type: "central",
    benefit: "\u20b96,000/year direct income support (3 installments of \u20b92,000)",
    eligibility: "All landholding farmer families",
    deadline: "Ongoing", userStatus: "active", amount: "\u20b96,000/yr",
    icon: "\ud83c\udfe6", color: "#22c55e",
    details: [
      "Next installment: \u20b92,000 expected April 2026",
      "Auto-credited to registered bank account",
      "Aadhaar-linked, no renewal needed",
      "Total received so far: \u20b930,000 (15 installments)",
    ],
  },
  {
    id: "gs2", name: "PMFBY - Crop Insurance", ministry: "Ministry of Agriculture", type: "central",
    benefit: "Crop loss coverage at subsidized premium (1.5% Rabi, 2% Kharif)",
    eligibility: "All farmers growing notified crops",
    deadline: "Dec 31 (Rabi), Jul 31 (Kharif)", userStatus: "active", amount: "\u20b92,250 premium",
    icon: "\ud83d\udee1\ufe0f", color: "#3b82f6",
    details: [
      "Enrolled for Rabi 2025-26: Wheat (12.5ac), Onion (5ac)",
      "Sum insured: \u20b97,50,000",
      "Premium paid: \u20b92,250 (1.5% of sum insured)",
      "Claim window: Within 72 hours of crop loss event",
      "Use app to document damage with photos for faster claims",
    ],
  },
  {
    id: "gs3", name: "Micro Irrigation Subsidy", ministry: "Dept of Agriculture, Maharashtra", type: "state",
    benefit: "55-70% subsidy on drip & sprinkler systems",
    eligibility: "All farmers, priority to small & marginal",
    deadline: "March 31, 2027", userStatus: "apply", amount: "Up to \u20b91.5L",
    icon: "\ud83d\udca7", color: "#06b6d4",
    details: [
      "Subsidy: 55% for general, 70% for SC/ST/Small farmers",
      "Covers: Drip system, sprinkler, micro-sprinkler, fertigation",
      "Max area: 5 hectares per beneficiary",
      "Apply through MahaDBT portal with land records",
      "Your potential saving: \u20b91,20,000 on 10-acre expansion",
    ],
  },
  {
    id: "gs4", name: "Soil Health Card Scheme", ministry: "Ministry of Agriculture", type: "central",
    benefit: "Free soil testing with nutrient-specific fertilizer recommendations",
    eligibility: "All farmers", deadline: "Ongoing", userStatus: "active",
    icon: "\ud83e\udea8", color: "#8b5cf6",
    details: [
      "Last test: January 2026 (all 6 fields)",
      "Next cycle: July 2026",
      "Reports available in-app under Insights > Soil Health",
      "Recommendations auto-integrated into advisory system",
    ],
  },
  {
    id: "gs5", name: "PM Kisan Samman Nidhi", ministry: "Ministry of Agriculture", type: "central",
    benefit: "KCC (Kisan Credit Card) at 4% interest (with subvention)",
    eligibility: "Landholding farmers with crop plan",
    deadline: "Ongoing", userStatus: "apply", amount: "Up to \u20b93L",
    icon: "\ud83d\udcb3", color: "#f59e0b",
    details: [
      "Interest: 7% (3% govt subvention = effective 4%)",
      "Additional 3% for timely repayment = 1% effective",
      "Covers: Crop production, post-harvest, allied activities",
      "Apply at nearest bank with land ownership docs",
      "Recommended limit for your farm: \u20b92,50,000",
    ],
  },
  {
    id: "gs6", name: "National Mission on Sustainable Agriculture", ministry: "Ministry of Agriculture", type: "central",
    benefit: "Support for organic farming, water management, soil health",
    eligibility: "Farmer groups (min 20 farmers, 50 acres)",
    deadline: "Rolling", userStatus: "apply", amount: "\u20b950,000/ha",
    icon: "\ud83c\udf3f", color: "#22c55e",
    details: [
      "Component: Paramparagat Krishi Vikas Yojana (PKVY)",
      "\u20b950,000/hectare over 3 years for organic conversion",
      "Covers: Organic inputs, certification, marketing",
      "Form a 20-farmer cluster to apply",
      "Your eligible area: 2 fields already organic-managed",
    ],
  },
  {
    id: "gs7", name: "eNAM - National Agriculture Market", ministry: "Ministry of Agriculture", type: "central",
    benefit: "Online trading platform for better price discovery across 1000+ mandis",
    eligibility: "Registered APMC traders and farmers",
    deadline: "Ongoing", userStatus: "active",
    icon: "\ud83d\udcb9", color: "#f97316",
    details: [
      "Registered: Nashik APMC (Trader ID: NAS-2024-0847)",
      "Can list produce for pan-India buyers",
      "Real-time price comparison across mandis",
      "Integrated with AgriMarketplace in this app",
    ],
  },
  {
    id: "gs8", name: "Agri Infrastructure Fund", ministry: "Ministry of Agriculture", type: "central",
    benefit: "3% interest subvention on loans up to \u20b92 Cr for farm infrastructure",
    eligibility: "Individual farmers, FPOs, agri-entrepreneurs",
    deadline: "2025-26 (extended)", userStatus: "apply", amount: "Up to \u20b92Cr",
    icon: "\ud83c\udfe2", color: "#6366f1",
    details: [
      "Covers: Cold storage, warehouse, sorting/grading, pack house",
      "CGTMSE credit guarantee for loans up to \u20b92 Cr",
      "Interest subvention: 3% for up to 7 years",
      "Relevant: Cold storage for grape export operations",
      "Potential project: Pack house + pre-cooling unit",
    ],
  },
];

export default function SchemesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<SchemeFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = schemes.filter((s) => {
    if (filter === "all") return true;
    if (filter === "active") return s.userStatus === "active";
    if (filter === "apply") return s.userStatus === "apply";
    if (filter === "central") return s.type === "central";
    if (filter === "state") return s.type === "state";
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\ud83c\udfe6"} Government Schemes
          </Text>
          <Text className="text-typography-400 text-xs">Subsidies, insurance & support programs</Text>
        </View>
      </View>

      {/* Summary */}
      <View className="flex-row mx-5 mt-3 gap-2 mb-3">
        <View className="flex-1 bg-green-50 rounded-xl p-3 items-center border border-green-200">
          <Text className="text-green-800 text-lg font-dm-sans-bold">{schemes.filter((s) => s.userStatus === "active").length}</Text>
          <Text className="text-green-600 text-xs">Active</Text>
        </View>
        <View className="flex-1 bg-blue-50 rounded-xl p-3 items-center border border-blue-200">
          <Text className="text-blue-800 text-lg font-dm-sans-bold">{schemes.filter((s) => s.userStatus === "apply").length}</Text>
          <Text className="text-blue-600 text-xs">Eligible</Text>
        </View>
        <View className="flex-1 bg-yellow-50 rounded-xl p-3 items-center border border-yellow-200">
          <Text className="text-yellow-800 text-lg font-dm-sans-bold">{"\u20b9"}36K+</Text>
          <Text className="text-yellow-600 text-xs">Benefits/yr</Text>
        </View>
      </View>

      {/* Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-10 mx-5 mb-3">
        {([
          { key: "all" as SchemeFilter, label: "All" },
          { key: "active" as SchemeFilter, label: "\u2705 Active" },
          { key: "apply" as SchemeFilter, label: "\ud83d\udcdd Apply" },
          { key: "central" as SchemeFilter, label: "\ud83c\uddee\ud83c\uddf3 Central" },
          { key: "state" as SchemeFilter, label: "\ud83c\udfe2 State" },
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
          {filtered.map((scheme) => {
            const isExpanded = expandedId === scheme.id;
            return (
              <Pressable key={scheme.id} onPress={() => setExpandedId(isExpanded ? null : scheme.id)}>
                <View
                  className="rounded-2xl mb-3 border overflow-hidden"
                  style={{ backgroundColor: scheme.color + "05", borderColor: scheme.color + "20" }}
                >
                  <View className="p-4">
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center flex-1">
                        <Text style={{ fontSize: 22 }}>{scheme.icon}</Text>
                        <View className="ml-3 flex-1">
                          <Text className="text-typography-900 font-dm-sans-bold text-sm">{scheme.name}</Text>
                          <Text className="text-typography-400 text-xs">{scheme.ministry}</Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <View
                          className="rounded-full px-2 py-0.5"
                          style={{
                            backgroundColor: scheme.userStatus === "active" ? "#22c55e15" : scheme.userStatus === "apply" ? "#3b82f615" : "#6b728015",
                          }}
                        >
                          <Text
                            className="text-xs font-dm-sans-bold capitalize"
                            style={{ color: scheme.userStatus === "active" ? "#22c55e" : scheme.userStatus === "apply" ? "#3b82f6" : "#6b7280" }}
                          >
                            {scheme.userStatus === "apply" ? "Eligible" : scheme.userStatus}
                          </Text>
                        </View>
                        {scheme.amount && (
                          <Text className="text-xs font-dm-sans-bold mt-1" style={{ color: scheme.color }}>
                            {scheme.amount}
                          </Text>
                        )}
                      </View>
                    </View>

                    <Text className="text-typography-600 text-xs leading-4">{scheme.benefit}</Text>

                    {isExpanded && (
                      <View className="mt-3 pt-3 border-t" style={{ borderTopColor: scheme.color + "20" }}>
                        <View className="mb-2">
                          <Text className="text-typography-500 text-xs font-dm-sans-bold">Eligibility</Text>
                          <Text className="text-typography-700 text-xs">{scheme.eligibility}</Text>
                        </View>
                        <View className="mb-3">
                          <Text className="text-typography-500 text-xs font-dm-sans-bold">Deadline</Text>
                          <Text className="text-typography-700 text-xs">{scheme.deadline}</Text>
                        </View>

                        <View className="rounded-xl p-3" style={{ backgroundColor: scheme.color + "08" }}>
                          <Text className="text-xs font-dm-sans-bold mb-1" style={{ color: scheme.color }}>
                            {"\ud83d\udca1"} For Your Farm
                          </Text>
                          {scheme.details.map((d, i) => (
                            <Text key={i} className="text-typography-600 text-xs leading-5">
                              {"\u2022"} {d}
                            </Text>
                          ))}
                        </View>

                        {scheme.userStatus === "apply" && (
                          <Pressable
                            className="rounded-xl py-3 items-center mt-3"
                            style={{ backgroundColor: scheme.color }}
                          >
                            <Text className="text-white font-dm-sans-bold text-sm">Apply Now {"\u2192"}</Text>
                          </Pressable>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
