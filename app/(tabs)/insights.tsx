import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS } from "@/components/screens/agritech/premium/theme";
import { BarChart3 } from "lucide-react-native";
import {
  fields,
  soilDataByField,
  cropCalendar,
  irrigationSchedules,
  advisories,
  alerts,
  getSoilPHStatus,
} from "@/data/agritech";
import CalendarTimeline from "@/components/screens/agritech/calendar-timeline";
import IrrigationCard from "@/components/screens/agritech/irrigation-card";
import AdvisoryCard from "@/components/screens/agritech/advisory-card";
import AlertCard from "@/components/screens/agritech/alert-card";
import SoilGauge from "@/components/screens/agritech/soil-gauge";

type InsightTab = "overview" | "soil" | "calendar" | "irrigation" | "advisory";

export default function InsightsScreen() {
  const [activeTab, setActiveTab] = useState<InsightTab>("overview");
  const [selectedFieldForSoil, setSelectedFieldForSoil] = useState(fields[0].id);

  const soilData = soilDataByField[selectedFieldForSoil];
  const phStatus = getSoilPHStatus(soilData.pH);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface.raised }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10, backgroundColor: COLORS.surface.base, borderBottomWidth: 1, borderBottomColor: COLORS.surface.borderLight }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <BarChart3 size={20} color={COLORS.accent.blue} />
          <Text style={{ color: COLORS.text.primary, fontSize: 20, fontFamily: "dm-sans-bold", letterSpacing: -0.3 }}>Insights & Advisory</Text>
        </View>
        <Text style={{ color: COLORS.text.muted, fontSize: 12, marginTop: 2 }}>
          Data-driven farming intelligence
        </Text>
      </View>

      {/* Tab Switcher - Scrollable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-12 mx-5 mb-3"
        contentContainerStyle={{ gap: 8 }}
      >
        {(
          [
            { key: "overview", label: "\ud83c\udfaf Overview" },
            { key: "soil", label: "\ud83e\udea8 Soil Health" },
            { key: "calendar", label: "\ud83d\udcc5 Crop Calendar" },
            { key: "irrigation", label: "\ud83d\udca7 Irrigation" },
            { key: "advisory", label: "\ud83d\udca1 Advisory" },
          ] as { key: InsightTab; label: string }[]
        ).map((tab) => (
          <Pressable
            key={tab.key}
            className="rounded-xl px-4 py-2"
            style={
              activeTab === tab.key
                ? { backgroundColor: "#16a34a" }
                : { backgroundColor: "#f3f4f6" }
            }
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              className={`text-xs font-dm-sans-medium ${
                activeTab === tab.key ? "text-white" : "text-typography-500"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {activeTab === "overview" && (
          <View className="px-5">
            {/* Key Metrics */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
              Farm Intelligence Summary
            </Text>

            <View className="flex-row flex-wrap gap-3 mb-4">
              {[
                { label: "Avg Soil pH", value: "7.0", status: "Neutral", color: "#22c55e", icon: "\ud83e\udea8" },
                { label: "Avg Moisture", value: "32%", status: "Adequate", color: "#3b82f6", icon: "\ud83d\udca7" },
                { label: "Active Alerts", value: String(alerts.length), status: "Needs action", color: "#ef4444", icon: "\u26a0\ufe0f" },
                { label: "Upcoming Tasks", value: String(cropCalendar.filter((c) => c.status === "upcoming").length), status: "This week", color: "#8b5cf6", icon: "\ud83d\udcc5" },
              ].map((metric, i) => (
                <View
                  key={i}
                  className="rounded-2xl p-3 border"
                  style={{
                    width: "48%",
                    backgroundColor: metric.color + "08",
                    borderColor: metric.color + "20",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{metric.icon}</Text>
                  <Text className="text-typography-500 text-xs font-dm-sans-regular mt-1">
                    {metric.label}
                  </Text>
                  <Text className="text-typography-900 text-xl font-dm-sans-bold" style={{ color: metric.color }}>
                    {metric.value}
                  </Text>
                  <Text className="text-typography-400 text-xs">{metric.status}</Text>
                </View>
              ))}
            </View>

            {/* Recent Alerts */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
              Priority Alerts
            </Text>
            {alerts
              .filter((a) => a.severity === "critical" || a.severity === "high")
              .map((alert) => (
                <AlertCard key={alert.id} alert={alert} compact />
              ))}

            {/* Upcoming Tasks Preview */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3 mt-4">
              Upcoming Activities
            </Text>
            <CalendarTimeline
              entries={cropCalendar.filter((c) => c.status === "upcoming" || c.status === "in-progress").slice(0, 4)}
            />
          </View>
        )}

        {activeTab === "soil" && (
          <View className="px-5">
            {/* Field Selector */}
            <Text className="text-typography-700 font-dm-sans-medium text-sm mb-2">
              Select Field
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4 max-h-10"
            >
              {fields.map((field) => (
                <Pressable
                  key={field.id}
                  className="rounded-xl px-3 py-2 mr-2"
                  style={
                    selectedFieldForSoil === field.id
                      ? { backgroundColor: "#16a34a" }
                      : { backgroundColor: "#f3f4f6" }
                  }
                  onPress={() => setSelectedFieldForSoil(field.id)}
                >
                  <Text
                    className={`text-xs font-dm-sans-medium ${
                      selectedFieldForSoil === field.id
                        ? "text-white"
                        : "text-typography-500"
                    }`}
                  >
                    {field.crop}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Soil pH Card */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-typography-900 font-dm-sans-bold text-base">
                  Soil pH Analysis
                </Text>
                <View
                  className="rounded-full px-3 py-1"
                  style={{ backgroundColor: phStatus.color + "15" }}
                >
                  <Text className="text-xs font-dm-sans-bold" style={{ color: phStatus.color }}>
                    {phStatus.label}
                  </Text>
                </View>
              </View>

              {/* pH Scale */}
              <View className="mb-4">
                <View className="h-6 rounded-full overflow-hidden flex-row">
                  {[
                    { color: "#dc2626", flex: 1.5 },
                    { color: "#f97316", flex: 0.5 },
                    { color: "#eab308", flex: 0.5 },
                    { color: "#22c55e", flex: 1.5 },
                    { color: "#eab308", flex: 0.5 },
                    { color: "#f97316", flex: 1 },
                  ].map((seg, i) => (
                    <View key={i} style={{ flex: seg.flex, backgroundColor: seg.color + "60" }} />
                  ))}
                </View>
                {/* pH Pointer */}
                <View
                  className="absolute items-center"
                  style={{ left: `${((soilData.pH - 4) / 6) * 100}%`, top: -4 }}
                >
                  <Text style={{ fontSize: 16 }}>{"\ud83d\udd3b"}</Text>
                </View>
                <View className="flex-row justify-between mt-1">
                  <Text className="text-typography-400 text-xs">4.0 Acidic</Text>
                  <Text className="text-typography-900 font-dm-sans-bold text-sm">
                    pH {soilData.pH}
                  </Text>
                  <Text className="text-typography-400 text-xs">10.0 Alkaline</Text>
                </View>
              </View>
            </View>

            {/* Detailed Soil Gauges */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
                Nutrient Analysis
              </Text>
              <SoilGauge label="Nitrogen (N)" value={soilData.nitrogen} unit="kg/ha" min={0} max={500} optimalMin={250} optimalMax={400} color="#3b82f6" />
              <SoilGauge label="Phosphorus (P)" value={soilData.phosphorus} unit="kg/ha" min={0} max={60} optimalMin={20} optimalMax={45} color="#8b5cf6" />
              <SoilGauge label="Potassium (K)" value={soilData.potassium} unit="kg/ha" min={0} max={400} optimalMin={150} optimalMax={300} color="#f97316" />
              <SoilGauge label="Organic Carbon" value={soilData.organicCarbon} unit="%" min={0} max={2} optimalMin={0.5} optimalMax={1.5} color="#22c55e" />
              <SoilGauge label="Electrical Conductivity" value={soilData.ec} unit="dS/m" min={0} max={2} optimalMin={0.2} optimalMax={0.8} color="#06b6d4" />
            </View>

            {/* Soil Conditions */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
                Physical Properties
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {[
                  { label: "Moisture", value: `${soilData.moisture}%`, icon: "\ud83d\udca7", color: "#3b82f6" },
                  { label: "Temperature", value: `${soilData.temperature}\u00b0C`, icon: "\ud83c\udf21\ufe0f", color: "#ef4444" },
                  { label: "Texture", value: soilData.texture, icon: "\ud83e\udea8", color: "#8b5cf6" },
                  { label: "EC", value: `${soilData.ec} dS/m`, icon: "\u26a1", color: "#f59e0b" },
                ].map((item, i) => (
                  <View
                    key={i}
                    className="rounded-xl p-3"
                    style={{ width: "47%", backgroundColor: item.color + "10" }}
                  >
                    <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                    <Text className="text-typography-500 text-xs mt-1">{item.label}</Text>
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Recommendations */}
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200">
              <Text className="text-green-800 font-dm-sans-bold text-sm mb-2">
                {"\ud83d\udca1"} Soil Improvement Recommendations
              </Text>
              {soilData.recommendations.map((rec, i) => (
                <Text key={i} className="text-green-700 text-xs font-dm-sans-regular leading-5 mb-1">
                  {"\u2022"} {rec}
                </Text>
              ))}
            </View>
          </View>
        )}

        {activeTab === "calendar" && (
          <View className="px-5">
            {/* Calendar Filter */}
            <View className="flex-row flex-wrap gap-2 mb-4">
              {["All", "In Progress", "Upcoming", "Completed"].map((filter) => (
                <View
                  key={filter}
                  className="rounded-full px-3 py-1.5"
                  style={{
                    backgroundColor:
                      filter === "All" ? "#16a34a" :
                      filter === "In Progress" ? "#3b82f620" :
                      filter === "Upcoming" ? "#f59e0b20" : "#6b728020",
                  }}
                >
                  <Text
                    className="text-xs font-dm-sans-medium"
                    style={{
                      color:
                        filter === "All" ? "#fff" :
                        filter === "In Progress" ? "#3b82f6" :
                        filter === "Upcoming" ? "#f59e0b" : "#6b7280",
                    }}
                  >
                    {filter}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar Summary */}
            <View className="flex-row gap-3 mb-4">
              {[
                { label: "In Progress", count: cropCalendar.filter((c) => c.status === "in-progress").length, color: "#3b82f6" },
                { label: "Upcoming", count: cropCalendar.filter((c) => c.status === "upcoming").length, color: "#f59e0b" },
                { label: "Completed", count: cropCalendar.filter((c) => c.status === "completed").length, color: "#22c55e" },
              ].map((item, i) => (
                <View
                  key={i}
                  className="flex-1 rounded-xl p-3 items-center"
                  style={{ backgroundColor: item.color + "10" }}
                >
                  <Text className="text-2xl font-dm-sans-bold" style={{ color: item.color }}>
                    {item.count}
                  </Text>
                  <Text className="text-typography-500 text-xs">{item.label}</Text>
                </View>
              ))}
            </View>

            {/* Timeline */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
              Activity Timeline
            </Text>
            <CalendarTimeline entries={cropCalendar} />
          </View>
        )}

        {activeTab === "irrigation" && (
          <View className="px-5">
            {/* Irrigation Summary */}
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-4">
              <Text className="text-blue-800 font-dm-sans-bold text-base mb-2">
                {"\ud83d\udca7"} Irrigation Overview
              </Text>
              <View className="flex-row">
                <View className="flex-1">
                  <Text className="text-blue-600 text-xs">Active Schedules</Text>
                  <Text className="text-blue-800 text-xl font-dm-sans-bold">
                    {irrigationSchedules.filter((s) => s.status !== "completed").length}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-blue-600 text-xs">Total Water Today</Text>
                  <Text className="text-blue-800 text-xl font-dm-sans-bold">
                    {(irrigationSchedules.reduce((s, i) => s + i.waterRequired, 0) / 1000).toFixed(0)}K L
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-blue-600 text-xs">Fields Below Optimal</Text>
                  <Text className="text-blue-800 text-xl font-dm-sans-bold">
                    {irrigationSchedules.filter((s) => s.soilMoisture < s.optimalMoisture * 0.7).length}
                  </Text>
                </View>
              </View>
            </View>

            {/* Schedules */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
              Irrigation Schedules
            </Text>
            {irrigationSchedules.map((schedule) => (
              <IrrigationCard key={schedule.fieldId} schedule={schedule} />
            ))}

            {/* Water Usage Tips */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mt-2">
              <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">
                {"\ud83d\udca1"} Water Conservation Tips
              </Text>
              {[
                "Use mulching to reduce evaporation by 25-30%",
                "Irrigate during early morning (5-7 AM) to minimize losses",
                "Switch to drip irrigation where possible (60% water savings)",
                "Monitor soil moisture sensors before scheduling irrigation",
                "Practice deficit irrigation during vegetative phase",
              ].map((tip, i) => (
                <Text key={i} className="text-typography-600 text-xs font-dm-sans-regular leading-5 mb-0.5">
                  {"\u2022"} {tip}
                </Text>
              ))}
            </View>
          </View>
        )}

        {activeTab === "advisory" && (
          <View className="px-5">
            {/* Advisory Filter */}
            <View className="flex-row gap-2 mb-4">
              {[
                { label: "\ud83c\udf3f Organic", color: "#22c55e" },
                { label: "\ud83e\uddea Inorganic", color: "#3b82f6" },
                { label: "\ud83d\udca1 General", color: "#8b5cf6" },
              ].map((filter) => (
                <View
                  key={filter.label}
                  className="rounded-full px-3 py-1.5"
                  style={{ backgroundColor: filter.color + "15" }}
                >
                  <Text className="text-xs font-dm-sans-medium" style={{ color: filter.color }}>
                    {filter.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Advisory Cards */}
            {advisories.map((advisory) => (
              <AdvisoryCard key={advisory.id} advisory={advisory} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
