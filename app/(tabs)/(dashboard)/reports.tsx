import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fields, userProfile } from "@/data/agritech";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sections: string[];
  lastGenerated?: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "r1", name: "Farm Health Report", description: "Comprehensive NDVI analysis, soil health, and crop status across all fields",
    icon: "\ud83c\udf31", color: "#22c55e",
    sections: ["NDVI Maps", "Soil Analysis (all fields)", "Crop Growth Stage", "Health Anomalies", "Irrigation Status"],
    lastGenerated: "Mar 28, 2026",
  },
  {
    id: "r2", name: "Financial Summary", description: "Season P&L, per-crop economics, input costs, and ROI analysis",
    icon: "\ud83d\udcb0", color: "#f59e0b",
    sections: ["Revenue Projections", "Expense Breakdown", "Per-Crop ROI", "Input Cost Trends", "Season Comparison"],
    lastGenerated: "Mar 31, 2026",
  },
  {
    id: "r3", name: "Soil Test Report", description: "Complete soil analysis with pH, NPK, micronutrients, and recommendations",
    icon: "\ud83e\udea8", color: "#8b5cf6",
    sections: ["pH Analysis", "NPK Levels", "Organic Carbon", "Micronutrients", "Fertilizer Recommendations"],
    lastGenerated: "Jan 15, 2026",
  },
  {
    id: "r4", name: "Pest & Disease Log", description: "All detections, treatments applied, outcomes, and prevention measures",
    icon: "\ud83d\udc1b", color: "#ef4444",
    sections: ["AI Scan Results", "Disease Detections", "Treatments Applied", "Spray Schedule", "Prevention Protocol"],
  },
  {
    id: "r5", name: "Water Usage Report", description: "Irrigation schedules, water consumption, efficiency metrics, and conservation",
    icon: "\ud83d\udca7", color: "#3b82f6",
    sections: ["Per-Field Water Usage", "Irrigation Efficiency", "Soil Moisture Trends", "Rainfall Data", "Savings vs Flood Irrigation"],
    lastGenerated: "Mar 25, 2026",
  },
  {
    id: "r6", name: "Carbon Credit Report", description: "Sustainable practices, carbon sequestration, and credit verification",
    icon: "\ud83c\udf0d", color: "#06b6d4",
    sections: ["Total Carbon Credits", "Practice-wise Breakdown", "Monthly Trends", "Verification Status", "Revenue Potential"],
  },
  {
    id: "r7", name: "Crop Insurance Documentation", description: "Field photos, satellite evidence, weather data for PMFBY claims",
    icon: "\ud83d\udee1\ufe0f", color: "#f97316",
    sections: ["Field Photographs", "Satellite Imagery (before/after)", "Weather Station Data", "Damage Assessment", "Claim Summary"],
  },
  {
    id: "r8", name: "Season End Report", description: "Complete season analysis with yield, economics, learnings, and next season plan",
    icon: "\ud83d\udcca", color: "#7c3aed",
    sections: ["Yield vs Predictions", "Revenue Achieved", "Top Learnings", "Soil Health Changes", "Next Season Recommendations"],
  },
];

export default function ReportsScreen() {
  const router = useRouter();
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = (report: ReportTemplate) => {
    setGenerating(report.id);
    setTimeout(() => {
      setGenerating(null);
      Alert.alert(
        "Report Ready!",
        `${report.name} has been generated.\n\nFile: ${userProfile.farmName.replace(/\s/g, "_")}_${report.id}_Apr2026.pdf\n\nOptions: View, Share via WhatsApp, Email, or Print.`,
        [
          { text: "Share", onPress: () => {} },
          { text: "OK" },
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\ud83d\udcc4"} Reports & Export
          </Text>
          <Text className="text-typography-400 text-xs">Generate shareable PDF reports</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Quick Summary */}
        <View className="mx-5 mt-4 bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-4">
          <Text className="text-blue-800 font-dm-sans-bold text-sm mb-1">
            {"\ud83d\udcc1"} {userProfile.farmName} - Report Center
          </Text>
          <Text className="text-blue-600 text-xs">
            {fields.length} fields \u2022 {userProfile.totalArea} acres \u2022 Rabi 2025-26
          </Text>
          <View className="flex-row mt-3 gap-2">
            <View className="flex-1 bg-white rounded-lg p-2 items-center">
              <Text className="text-blue-800 font-dm-sans-bold">5</Text>
              <Text className="text-blue-600 text-xs">Generated</Text>
            </View>
            <View className="flex-1 bg-white rounded-lg p-2 items-center">
              <Text className="text-blue-800 font-dm-sans-bold">8</Text>
              <Text className="text-blue-600 text-xs">Available</Text>
            </View>
            <View className="flex-1 bg-white rounded-lg p-2 items-center">
              <Text className="text-blue-800 font-dm-sans-bold">PDF</Text>
              <Text className="text-blue-600 text-xs">Format</Text>
            </View>
          </View>
        </View>

        {/* Report Templates */}
        <View className="px-5">
          {reportTemplates.map((report) => {
            const isGenerating = generating === report.id;
            return (
              <View
                key={report.id}
                className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100"
              >
                <View className="flex-row items-start">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: report.color + "15" }}
                  >
                    <Text style={{ fontSize: 24 }}>{report.icon}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{report.name}</Text>
                    <Text className="text-typography-500 text-xs mt-0.5 leading-4">{report.description}</Text>

                    {/* Sections preview */}
                    <View className="flex-row flex-wrap gap-1 mt-2">
                      {report.sections.slice(0, 3).map((sec, i) => (
                        <View key={i} className="bg-background-100 rounded-full px-2 py-0.5">
                          <Text className="text-typography-500" style={{ fontSize: 9 }}>{sec}</Text>
                        </View>
                      ))}
                      {report.sections.length > 3 && (
                        <View className="bg-background-100 rounded-full px-2 py-0.5">
                          <Text className="text-typography-400" style={{ fontSize: 9 }}>+{report.sections.length - 3} more</Text>
                        </View>
                      )}
                    </View>

                    {report.lastGenerated && (
                      <Text className="text-typography-400 text-xs mt-2">
                        Last generated: {report.lastGenerated}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row gap-2 mt-3">
                  <Pressable
                    onPress={() => handleGenerate(report)}
                    className="flex-1 rounded-xl py-2.5 items-center"
                    style={{ backgroundColor: isGenerating ? "#d4d4d4" : report.color }}
                  >
                    <Text className="text-white text-xs font-dm-sans-bold">
                      {isGenerating ? "Generating..." : "\ud83d\udcc4 Generate PDF"}
                    </Text>
                  </Pressable>
                  {report.lastGenerated && (
                    <Pressable className="bg-background-100 rounded-xl py-2.5 px-4 items-center">
                      <Text className="text-typography-700 text-xs font-dm-sans-bold">{"\ud83d\udd17"} Share</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Export Options */}
        <View className="mx-5 mt-2 bg-background-50 rounded-2xl p-4 border border-outline-100">
          <Text className="text-typography-900 font-dm-sans-bold text-sm mb-3">
            {"\ud83d\udce4"} Export Options
          </Text>
          {[
            { label: "Export all data as CSV", desc: "Raw data for spreadsheet analysis", icon: "\ud83d\udcc0" },
            { label: "Share via WhatsApp", desc: "Send summary to advisory group", icon: "\ud83d\udce9" },
            { label: "Email to agronomist", desc: "Share detailed reports for review", icon: "\ud83d\udce7" },
            { label: "Print-ready format", desc: "Optimized for A4 printing", icon: "\ud83d\udda8\ufe0f" },
          ].map((item, i) => (
            <Pressable key={i}>
              <View className="flex-row items-center py-3" style={i < 3 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                <View className="flex-1 ml-3">
                  <Text className="text-typography-800 text-sm font-dm-sans-medium">{item.label}</Text>
                  <Text className="text-typography-400 text-xs">{item.desc}</Text>
                </View>
                <Text className="text-typography-400">{"\u203a"}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
