import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type InsuranceTab = "policies" | "file-claim" | "claims" | "evidence";

export default function InsuranceClaimScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<InsuranceTab>("policies");
  const [claimStep, setClaimStep] = useState(1);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\udee1\ufe0f"} Crop Insurance</Text>
          <Text className="text-typography-400 text-xs">PMFBY policies, claims & evidence</Text>
        </View>
      </View>

      <View className="flex-row mx-5 mt-3 mb-3 bg-background-100 rounded-xl p-1">
        {(["policies", "file-claim", "claims", "evidence"] as InsuranceTab[]).map((t) => (
          <Pressable key={t} className="flex-1 items-center py-2 rounded-lg" style={activeTab === t ? { backgroundColor: "#16a34a" } : {}} onPress={() => setActiveTab(t)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === t ? "text-white" : "text-typography-500"}`}>
              {t === "policies" ? "\ud83d\udcdc Active" : t === "file-claim" ? "\ud83d\udcdd Claim" : t === "claims" ? "\ud83d\udccb History" : "\ud83d\udcf7 Evidence"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "policies" && (
          <View className="px-5">
            {/* Active Policy */}
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Text style={{ fontSize: 24 }}>{"\ud83d\udee1\ufe0f"}</Text>
                  <View className="ml-3">
                    <Text className="text-blue-800 font-dm-sans-bold text-base">PMFBY - Rabi 2025-26</Text>
                    <Text className="text-blue-600 text-xs">Policy No: PMFBY/2025/MH/NAS/042785</Text>
                  </View>
                </View>
                <View className="bg-green-100 rounded-full px-2 py-0.5">
                  <Text className="text-green-700 text-xs font-dm-sans-bold">Active</Text>
                </View>
              </View>

              {[
                { label: "Insured Crops", value: "Wheat (12.5ac), Onion (5ac)" },
                { label: "Sum Insured", value: "\u20b97,50,000" },
                { label: "Premium Paid", value: "\u20b92,250 (1.5% of sum insured)" },
                { label: "Policy Period", value: "Oct 2025 - Mar 2026" },
                { label: "Insurance Company", value: "Agriculture Insurance Co." },
                { label: "Claim Window", value: "Within 72 hours of loss event" },
              ].map((item, i) => (
                <View key={i} className="flex-row justify-between py-2" style={i < 5 ? { borderBottomWidth: 1, borderBottomColor: "#bfdbfe" } : {}}>
                  <Text className="text-blue-700 text-xs">{item.label}</Text>
                  <Text className="text-blue-900 text-xs font-dm-sans-bold">{item.value}</Text>
                </View>
              ))}
            </View>

            {/* Coverage Details */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Coverage Scope</Text>
            {[
              { risk: "Natural Calamities", detail: "Drought, flood, cyclone, hailstorm, landslide", covered: true, icon: "\u26c8\ufe0f" },
              { risk: "Pest & Disease", detail: "Epidemic pest/disease attack identified by govt", covered: true, icon: "\ud83d\udc1b" },
              { risk: "Post-Harvest Loss", detail: "Damage within 14 days of harvest due to weather", covered: true, icon: "\ud83c\udf3e" },
              { risk: "Localized Calamity", detail: "Hailstorm, landslide, inundation on individual farm", covered: true, icon: "\ud83c\udf0a" },
              { risk: "Prevented Sowing", detail: "Unable to sow due to rainfall deficit/excess", covered: true, icon: "\ud83c\udf31" },
              { risk: "War & Nuclear", detail: "War, nuclear risks, malicious damage", covered: false, icon: "\u274c" },
              { risk: "Theft/Sabotage", detail: "Deliberate damage or theft of produce", covered: false, icon: "\u274c" },
            ].map((item, i) => (
              <View key={i} className="flex-row items-center py-2.5" style={i < 6 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                <Text style={{ fontSize: 14 }}>{item.icon}</Text>
                <View className="flex-1 ml-3">
                  <Text className="text-typography-800 text-xs font-dm-sans-medium">{item.risk}</Text>
                  <Text className="text-typography-400 text-xs">{item.detail}</Text>
                </View>
                <Text className={`text-xs font-dm-sans-bold ${item.covered ? "text-green-600" : "text-red-500"}`}>
                  {item.covered ? "\u2705 Covered" : "\u274c Not covered"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "file-claim" && (
          <View className="px-5">
            {/* Claim Filing Steps */}
            <View className="bg-red-50 rounded-2xl p-4 border border-red-200 mb-4">
              <Text className="text-red-800 font-dm-sans-bold text-sm">{"\u26a0\ufe0f"} Important: File within 72 hours of crop loss</Text>
              <Text className="text-red-600 text-xs mt-1">Delays may result in claim rejection</Text>
            </View>

            {/* Progress */}
            <View className="mb-4">
              <View className="flex-row items-center">
                {[1, 2, 3, 4].map((step) => (
                  <View key={step} className="flex-1 flex-row items-center">
                    <View className={`w-8 h-8 rounded-full items-center justify-center ${claimStep >= step ? "bg-green-500" : "bg-background-200"}`}>
                      <Text className={`text-xs font-dm-sans-bold ${claimStep >= step ? "text-white" : "text-typography-400"}`}>{step}</Text>
                    </View>
                    {step < 4 && <View className={`flex-1 h-0.5 mx-1 ${claimStep > step ? "bg-green-500" : "bg-background-200"}`} />}
                  </View>
                ))}
              </View>
              <View className="flex-row mt-1">
                {["Report", "Evidence", "Details", "Submit"].map((label, i) => (
                  <Text key={i} className="flex-1 text-center text-typography-400" style={{ fontSize: 9 }}>{label}</Text>
                ))}
              </View>
            </View>

            {claimStep === 1 && (
              <View>
                <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Step 1: Report Loss Event</Text>
                {[
                  { type: "Hailstorm Damage", icon: "\ud83e\udee7", desc: "Physical damage to crop from hail" },
                  { type: "Flood/Waterlogging", icon: "\ud83c\udf0a", desc: "Field submerged for >48 hours" },
                  { type: "Drought/Dry Spell", icon: "\u2600\ufe0f", desc: "No effective rainfall for >3 weeks" },
                  { type: "Pest/Disease Epidemic", icon: "\ud83d\udc1b", desc: "Widespread outbreak (govt notified)" },
                  { type: "Unseasonal Rain", icon: "\ud83c\udf27\ufe0f", desc: "Rain during harvest causing damage" },
                  { type: "Strong Wind/Cyclone", icon: "\ud83d\udca8", desc: "Lodging, branch break, fruit drop" },
                ].map((loss, i) => (
                  <Pressable key={i} onPress={() => setClaimStep(2)}>
                    <View className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100 flex-row items-center">
                      <Text style={{ fontSize: 22 }}>{loss.icon}</Text>
                      <View className="flex-1 ml-3">
                        <Text className="text-typography-900 font-dm-sans-bold text-sm">{loss.type}</Text>
                        <Text className="text-typography-500 text-xs">{loss.desc}</Text>
                      </View>
                      <Text className="text-typography-400">{"\u203a"}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}

            {claimStep === 2 && (
              <View>
                <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Step 2: Upload Evidence</Text>
                <Text className="text-typography-500 text-xs mb-3">Strong evidence increases claim approval chances</Text>

                {[
                  { label: "Field Photographs (min 4)", desc: "Affected area, close-up damage, wide view, GPS tagged", icon: "\ud83d\udcf7", required: true },
                  { label: "Satellite Imagery (Auto)", desc: "Before & after comparison from platform data", icon: "\ud83d\udef0\ufe0f", required: false, auto: true },
                  { label: "Weather Station Data (Auto)", desc: "Rainfall, wind, temperature from IoT sensors", icon: "\ud83c\udf21\ufe0f", required: false, auto: true },
                  { label: "Video Documentation", desc: "30-60 second video showing extent of damage", icon: "\ud83c\udfa5", required: false },
                  { label: "Neighboring Farmer Witness", desc: "Signed statement from adjacent farmer", icon: "\ud83d\udcdd", required: false },
                ].map((evidence, i) => (
                  <View key={i} className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100 flex-row items-center">
                    <Text style={{ fontSize: 20 }}>{evidence.icon}</Text>
                    <View className="flex-1 ml-3">
                      <View className="flex-row items-center">
                        <Text className="text-typography-900 text-sm font-dm-sans-medium">{evidence.label}</Text>
                        {evidence.required && <Text className="text-red-500 text-xs ml-1">*</Text>}
                      </View>
                      <Text className="text-typography-500 text-xs">{evidence.desc}</Text>
                    </View>
                    {(evidence as any).auto ? (
                      <View className="bg-green-50 rounded-lg px-2 py-1">
                        <Text className="text-green-700 text-xs font-dm-sans-bold">{"\u2705"} Auto</Text>
                      </View>
                    ) : (
                      <Pressable className="bg-blue-50 rounded-lg px-3 py-1.5">
                        <Text className="text-blue-700 text-xs font-dm-sans-bold">Upload</Text>
                      </Pressable>
                    )}
                  </View>
                ))}

                <View className="flex-row gap-3 mt-3">
                  <Pressable onPress={() => setClaimStep(1)} className="flex-1 bg-background-100 rounded-xl py-3 items-center">
                    <Text className="text-typography-700 font-dm-sans-bold text-sm">Back</Text>
                  </Pressable>
                  <Pressable onPress={() => setClaimStep(3)} className="flex-1 bg-green-500 rounded-xl py-3 items-center">
                    <Text className="text-white font-dm-sans-bold text-sm">Next {"\u2192"}</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {claimStep === 3 && (
              <View>
                <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Step 3: Damage Assessment</Text>

                {[
                  { label: "Affected Field", value: "North Block - Wheat (12.5 acres)" },
                  { label: "Loss Event", value: "Hailstorm Damage" },
                  { label: "Date of Event", value: "April 5, 2026 (Predicted)" },
                  { label: "Estimated Damage", value: "40-60% crop loss" },
                  { label: "Estimated Loss Amount", value: "\u20b93,10,000" },
                  { label: "Evidence Attached", value: "Photos (4), Satellite (auto), Weather (auto)" },
                ].map((item, i) => (
                  <View key={i} className="flex-row justify-between py-2.5" style={i < 5 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                    <Text className="text-typography-600 text-xs">{item.label}</Text>
                    <Text className="text-typography-900 text-xs font-dm-sans-bold">{item.value}</Text>
                  </View>
                ))}

                <View className="flex-row gap-3 mt-4">
                  <Pressable onPress={() => setClaimStep(2)} className="flex-1 bg-background-100 rounded-xl py-3 items-center">
                    <Text className="text-typography-700 font-dm-sans-bold text-sm">Back</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setClaimStep(4);
                      Alert.alert("Claim Submitted!", "Your claim has been filed successfully.\n\nClaim No: CLM/2026/NAS/04287\nStatus: Under Review\n\nField survey expected within 7 days.");
                    }}
                    className="flex-1 bg-green-500 rounded-xl py-3 items-center"
                  >
                    <Text className="text-white font-dm-sans-bold text-sm">{"\u2713"} Submit Claim</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {claimStep === 4 && (
              <View className="items-center py-8">
                <Text style={{ fontSize: 64 }}>{"\u2705"}</Text>
                <Text className="text-typography-900 font-dm-sans-bold text-xl mt-4">Claim Submitted</Text>
                <Text className="text-typography-500 text-sm text-center mt-2 px-8">
                  Your claim has been filed. Field survey team will visit within 7 working days.
                </Text>
                <Pressable onPress={() => { setClaimStep(1); setActiveTab("claims"); }} className="bg-green-500 rounded-xl px-8 py-3 mt-6">
                  <Text className="text-white font-dm-sans-bold">View Claims</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {activeTab === "claims" && (
          <View className="px-5">
            {[
              { id: "CLM/2024/NAS/01842", date: "Sep 15, 2024", type: "Unseasonal Rain", field: "Onion - 5 ac", amount: "\u20b985,000", status: "Settled", settled: "\u20b972,000", color: "#22c55e" },
              { id: "CLM/2024/NAS/00956", date: "Jul 22, 2024", type: "Flood/Waterlogging", field: "Rice - 10 ac", amount: "\u20b91,80,000", status: "Settled", settled: "\u20b91,45,000", color: "#22c55e" },
              { id: "CLM/2023/NAS/02310", date: "Mar 10, 2023", type: "Hailstorm", field: "Grapes - 6 ac", amount: "\u20b92,40,000", status: "Rejected", settled: "\u20b90", color: "#ef4444" },
            ].map((claim, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-typography-900 font-dm-sans-bold text-sm">{claim.type}</Text>
                  <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: claim.color + "15" }}>
                    <Text className="text-xs font-dm-sans-bold" style={{ color: claim.color }}>{claim.status}</Text>
                  </View>
                </View>
                <Text className="text-typography-400 text-xs">Claim: {claim.id}</Text>
                <Text className="text-typography-500 text-xs">{claim.field} \u2022 Filed: {claim.date}</Text>
                <View className="flex-row justify-between mt-2 pt-2 border-t border-outline-50">
                  <View>
                    <Text className="text-typography-400 text-xs">Claimed</Text>
                    <Text className="text-typography-900 text-sm font-dm-sans-bold">{claim.amount}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-typography-400 text-xs">Settled</Text>
                    <Text className="text-sm font-dm-sans-bold" style={{ color: claim.color }}>{claim.settled}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "evidence" && (
          <View className="px-5">
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-4">
              <Text className="text-blue-800 font-dm-sans-bold text-sm">Auto-Collected Evidence</Text>
              <Text className="text-blue-600 text-xs mt-1">Platform continuously collects evidence that strengthens insurance claims</Text>
            </View>

            {[
              { type: "Satellite NDVI History", desc: "Monthly NDVI snapshots for all fields showing crop health before & after events", count: "24 images", auto: true, icon: "\ud83d\udef0\ufe0f" },
              { type: "Weather Station Data", desc: "Continuous rainfall, temperature, wind speed, humidity logging", count: "365 days", auto: true, icon: "\ud83c\udf21\ufe0f" },
              { type: "IoT Sensor Logs", desc: "Soil moisture, temperature anomaly records with timestamps", count: "1,440 readings/day", auto: true, icon: "\ud83d\udce1" },
              { type: "AI Scan Reports", desc: "All disease/pest detection scans with confidence scores", count: "15 scans", auto: true, icon: "\ud83d\udd2c" },
              { type: "Activity Log", desc: "All farming operations with dates (sprays, irrigation, inputs)", count: "85 entries", auto: true, icon: "\ud83d\udcdd" },
              { type: "Field Photographs", desc: "Tagged photos from photo gallery with GPS + timestamp", count: "12 photos", auto: false, icon: "\ud83d\udcf7" },
              { type: "Drone Survey Images", desc: "High-resolution aerial imagery from completed missions", count: "3 surveys", auto: true, icon: "\ud83d\ude81" },
            ].map((item, i) => (
              <View key={i} className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100 flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-background-100 items-center justify-center">
                  <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-typography-900 text-xs font-dm-sans-bold">{item.type}</Text>
                  <Text className="text-typography-500 text-xs">{item.desc}</Text>
                  <Text className="text-blue-600 text-xs mt-0.5">{item.count} collected</Text>
                </View>
                <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: item.auto ? "#22c55e15" : "#3b82f615" }}>
                  <Text className="text-xs font-dm-sans-medium" style={{ color: item.auto ? "#22c55e" : "#3b82f6" }}>
                    {item.auto ? "Auto" : "Manual"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
