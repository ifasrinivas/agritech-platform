import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scanHistory } from "@/data/agritech";
import ScanResultCard from "@/components/screens/agritech/scan-result-card";
import { COLORS, RADIUS, SHADOWS } from "@/components/screens/agritech/premium/theme";
import { ScanLine } from "lucide-react-native";

type ScanTab = "camera" | "history" | "guide";

export default function ScanScreen() {
  const [activeTab, setActiveTab] = useState<ScanTab>("camera");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface.raised }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10, backgroundColor: COLORS.surface.base, borderBottomWidth: 1, borderBottomColor: COLORS.surface.borderLight }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <ScanLine size={20} color={COLORS.accent.rose} />
          <Text style={{ color: COLORS.text.primary, fontSize: 20, fontFamily: "dm-sans-bold", letterSpacing: -0.3 }}>AI Crop Doctor</Text>
        </View>
        <Text style={{ color: COLORS.text.muted, fontSize: 12, marginTop: 2 }}>
          Scan crops for disease & pest detection
        </Text>
      </View>

      {/* Tab Switcher */}
      <View className="flex-row mx-5 mt-3 mb-4 bg-background-100 rounded-xl p-1">
        {(["camera", "history", "guide"] as ScanTab[]).map((tab) => (
          <Pressable
            key={tab}
            className="flex-1 items-center py-2 rounded-lg"
            style={activeTab === tab ? { backgroundColor: COLORS.primary.from } : {}}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              className={`text-xs font-dm-sans-medium capitalize ${
                activeTab === tab ? "text-white" : "text-typography-500"
              }`}
            >
              {tab === "camera" ? "\ud83d\udcf7 Scan" : tab === "history" ? "\ud83d\udccb History" : "\ud83d\udcd6 Guide"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {activeTab === "camera" && (
          <View className="px-5">
            {/* Camera Viewfinder Simulation */}
            <View className="bg-background-900 rounded-2xl overflow-hidden mb-4">
              <View className="h-80 items-center justify-center relative">
                {/* Viewfinder corners */}
                <View className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white rounded-tl-lg" />
                <View className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white rounded-tr-lg" />
                <View className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white rounded-bl-lg" />
                <View className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white rounded-br-lg" />

                {isAnalyzing ? (
                  <View className="items-center">
                    <Text style={{ fontSize: 48 }}>{"\ud83e\udde0"}</Text>
                    <Text className="text-white font-dm-sans-bold text-base mt-3">
                      Analyzing...
                    </Text>
                    <Text className="text-white/60 text-xs mt-1 font-dm-sans-regular">
                      AI processing leaf patterns
                    </Text>
                    {/* Progress bar */}
                    <View className="w-48 h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden">
                      <View className="w-3/4 h-full bg-green-400 rounded-full" />
                    </View>
                  </View>
                ) : analysisComplete ? (
                  <View className="items-center">
                    <Text style={{ fontSize: 48 }}>{"\u2705"}</Text>
                    <Text className="text-white font-dm-sans-bold text-base mt-3">
                      Analysis Complete
                    </Text>
                    <Text className="text-green-400 text-xs mt-1">Early Blight detected - 94% confidence</Text>
                    <Pressable
                      onPress={() => {
                        setAnalysisComplete(false);
                        setShowResult(true);
                      }}
                      className="mt-3 bg-green-500 rounded-xl px-6 py-2"
                    >
                      <Text className="text-white font-dm-sans-bold text-sm">View Full Report</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View className="items-center">
                    <Text style={{ fontSize: 48 }}>{"\ud83c\udf3f"}</Text>
                    <Text className="text-white/80 font-dm-sans-medium text-sm mt-3">
                      Point camera at affected crop
                    </Text>
                    <Text className="text-white/50 text-xs mt-1 font-dm-sans-regular">
                      Ensure good lighting & focus on leaf surface
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mb-4">
              <Pressable
                className="flex-1 rounded-2xl py-4 items-center"
                style={{ backgroundColor: "#16a34a" }}
                onPress={simulateAnalysis}
              >
                <Text style={{ fontSize: 24 }}>{"\ud83d\udcf8"}</Text>
                <Text className="text-white font-dm-sans-bold text-sm mt-1">Take Photo</Text>
              </Pressable>
              <Pressable
                className="flex-1 bg-background-100 rounded-2xl py-4 items-center border border-outline-100"
                onPress={simulateAnalysis}
              >
                <Text style={{ fontSize: 24 }}>{"\ud83d\uddbc\ufe0f"}</Text>
                <Text className="text-typography-700 font-dm-sans-bold text-sm mt-1">
                  Gallery
                </Text>
              </Pressable>
            </View>

            {/* Quick Tips or Full Result */}
            {showResult ? (
              <View>
                {/* AI Analysis Report */}
                <View className="bg-background-50 rounded-2xl border border-outline-100 mb-4 overflow-hidden">
                  <View className="bg-red-50 p-4 border-b border-red-100">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Text style={{ fontSize: 24 }}>{"\ud83d\udd2c"}</Text>
                        <View className="ml-3">
                          <Text className="text-red-800 font-dm-sans-bold text-base">Early Blight</Text>
                          <Text className="text-red-600 text-xs italic">Alternaria solani</Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <View className="bg-red-500 rounded-full px-3 py-1">
                          <Text className="text-white text-xs font-dm-sans-bold">94% Match</Text>
                        </View>
                        <Text className="text-red-600 text-xs mt-1">Severity: Moderate</Text>
                      </View>
                    </View>
                  </View>

                  <View className="p-4">
                    {/* What was detected */}
                    <View className="mb-4">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm mb-1">
                        {"\ud83d\udd0d"} Detection Analysis
                      </Text>
                      <Text className="text-typography-600 text-xs leading-5">
                        Concentric ring patterns (target spots) detected on lower leaf surfaces. Brown necrotic lesions with characteristic bull's-eye appearance.
                        Pattern matches Early Blight (Alternaria solani) with 94% confidence. Also considered: Septoria Leaf Spot (4%), Bacterial Spot (2%).
                      </Text>
                    </View>

                    {/* Affected area */}
                    <View className="flex-row gap-3 mb-4">
                      {[
                        { label: "Affected Area", value: "~15%", color: "#f59e0b" },
                        { label: "Spread Risk", value: "High", color: "#ef4444" },
                        { label: "Crop Stage", value: "Flowering", color: "#3b82f6" },
                      ].map((item, i) => (
                        <View key={i} className="flex-1 rounded-xl p-3 items-center" style={{ backgroundColor: item.color + "10" }}>
                          <Text className="text-xs font-dm-sans-bold" style={{ color: item.color }}>{item.value}</Text>
                          <Text className="text-typography-400 text-xs mt-0.5">{item.label}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Treatment Plan */}
                    <View className="mb-4">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">
                        {"\ud83e\uddea"} Recommended Treatment Plan
                      </Text>
                      <View className="bg-background-100 rounded-xl p-3 mb-2">
                        <Text className="text-typography-700 text-xs font-dm-sans-bold">Immediate (Today)</Text>
                        <Text className="text-typography-600 text-xs leading-5 mt-1">
                          1. Remove and destroy infected lower leaves{"\n"}
                          2. Spray Mancozeb 75% WP @ 2.5g/L on all plants{"\n"}
                          3. Ensure no overhead irrigation for 48 hours
                        </Text>
                      </View>
                      <View className="bg-background-100 rounded-xl p-3 mb-2">
                        <Text className="text-typography-700 text-xs font-dm-sans-bold">Follow-up (Day 7-10)</Text>
                        <Text className="text-typography-600 text-xs leading-5 mt-1">
                          1. Apply Chlorothalonil 75% WP @ 2g/L{"\n"}
                          2. Scout for spread to upper canopy{"\n"}
                          3. If spreading, escalate to Cymoxanil + Mancozeb
                        </Text>
                      </View>
                    </View>

                    {/* Organic Alternative */}
                    <View className="bg-green-50 rounded-xl p-3 mb-4 border border-green-200">
                      <Text className="text-green-800 font-dm-sans-bold text-xs mb-1">
                        {"\ud83c\udf3f"} Organic Alternative
                      </Text>
                      <Text className="text-green-700 text-xs leading-5">
                        {"\u2022"} Trichoderma viride @ 4g/L foliar spray{"\n"}
                        {"\u2022"} Pseudomonas fluorescens @ 5g/L{"\n"}
                        {"\u2022"} Neem oil 0.3% as antifungal barrier
                      </Text>
                    </View>

                    {/* Economic Impact */}
                    <View className="bg-yellow-50 rounded-xl p-3 mb-4 border border-yellow-200">
                      <Text className="text-yellow-800 font-dm-sans-bold text-xs mb-1">
                        {"\ud83d\udcb0"} Estimated Economic Impact
                      </Text>
                      <View className="flex-row justify-between mt-1">
                        <Text className="text-yellow-700 text-xs">If untreated (yield loss)</Text>
                        <Text className="text-yellow-800 text-xs font-dm-sans-bold">20-40%</Text>
                      </View>
                      <View className="flex-row justify-between mt-1">
                        <Text className="text-yellow-700 text-xs">Treatment cost</Text>
                        <Text className="text-yellow-800 text-xs font-dm-sans-bold">{"\u20b9"}1,200</Text>
                      </View>
                      <View className="flex-row justify-between mt-1">
                        <Text className="text-yellow-700 text-xs">Potential savings</Text>
                        <Text className="text-green-700 text-xs font-dm-sans-bold">{"\u20b9"}38,000+</Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => { setShowResult(false); setActiveTab("history"); }}
                      className="bg-green-500 rounded-xl py-3 items-center"
                    >
                      <Text className="text-white font-dm-sans-bold text-sm">Save to History & Close</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ) : (
              <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <Text className="text-blue-800 font-dm-sans-bold text-sm mb-2">
                  {"\ud83d\udca1"} Tips for Best Results
                </Text>
                {[
                  "Photograph individual leaves with symptoms",
                  "Ensure natural daylight (avoid flash)",
                  "Include both healthy and affected areas",
                  "Hold camera 15-20cm from the leaf",
                  "Capture front and back of leaf if possible",
                ].map((tip, i) => (
                  <Text key={i} className="text-blue-700 text-xs font-dm-sans-regular leading-5">
                    {"\u2022"} {tip}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === "history" && (
          <View className="px-5">
            <Text className="text-typography-700 font-dm-sans-medium text-sm mb-3">
              Recent Scans ({scanHistory.length})
            </Text>
            {scanHistory.map((result) => (
              <ScanResultCard key={result.id} result={result} />
            ))}
          </View>
        )}

        {activeTab === "guide" && (
          <View className="px-5">
            <Text className="text-typography-700 font-dm-sans-bold text-base mb-3">
              Common Crop Diseases Guide
            </Text>

            {[
              {
                crop: "Tomato",
                diseases: [
                  { name: "Early Blight", symptoms: "Brown spots with concentric rings on lower leaves", icon: "\ud83c\udf45" },
                  { name: "Late Blight", symptoms: "Water-soaked lesions, white mold on leaf undersides", icon: "\ud83c\udf45" },
                  { name: "Fusarium Wilt", symptoms: "Yellowing of lower leaves, one-sided wilting", icon: "\ud83c\udf45" },
                ],
              },
              {
                crop: "Wheat",
                diseases: [
                  { name: "Rust (Yellow/Brown)", symptoms: "Orange-yellow pustules on leaves and stems", icon: "\ud83c\udf3e" },
                  { name: "Powdery Mildew", symptoms: "White powdery coating on leaves", icon: "\ud83c\udf3e" },
                  { name: "Loose Smut", symptoms: "Black powdery mass replacing grain head", icon: "\ud83c\udf3e" },
                ],
              },
              {
                crop: "Rice",
                diseases: [
                  { name: "Blast", symptoms: "Diamond-shaped lesions with gray center on leaves", icon: "\ud83c\udf3e" },
                  { name: "Brown Spot", symptoms: "Oval brown spots on leaves, grains", icon: "\ud83c\udf3e" },
                  { name: "Sheath Blight", symptoms: "Oval, water-soaked lesions on leaf sheath", icon: "\ud83c\udf3e" },
                ],
              },
              {
                crop: "Onion",
                diseases: [
                  { name: "Purple Blotch", symptoms: "Purple-brown lesions with yellow halo", icon: "\ud83e\uddc5" },
                  { name: "Downy Mildew", symptoms: "Pale green to yellow patches, violet-gray growth", icon: "\ud83e\uddc5" },
                  { name: "Thrips Damage", symptoms: "Silvery white streaks on leaves, curling", icon: "\ud83e\uddc5" },
                ],
              },
            ].map((section, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-3">
                <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">
                  {section.diseases[0]?.icon} {section.crop}
                </Text>
                {section.diseases.map((disease, j) => (
                  <View
                    key={j}
                    className="py-2"
                    style={j < section.diseases.length - 1 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}
                  >
                    <Text className="text-typography-800 text-sm font-dm-sans-medium">
                      {disease.name}
                    </Text>
                    <Text className="text-typography-500 text-xs font-dm-sans-regular mt-0.5">
                      {disease.symptoms}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
