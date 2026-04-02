import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { userProfile, fields, carbonCredits } from "@/data/agritech";
import { COLORS, GRADIENTS, RADIUS, SHADOWS } from "@/components/screens/agritech/premium/theme";
import { User, Settings, Bell } from "lucide-react-native";
import CarbonDashboard from "@/components/screens/agritech/carbon-dashboard";

type ProfileTab = "overview" | "carbon" | "settings";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [autoIrrigation, setAutoIrrigation] = useState(false);
  const [satelliteAlerts, setSatelliteAlerts] = useState(true);

  const totalArea = fields.reduce((s, f) => s + f.area, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface.raised }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Profile Header */}
        <LinearGradient
          colors={GRADIENTS.hero as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
        >
          <View className="flex-row items-center">
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }}>
              <User size={28} color="#fff" />
            </View>
            <View className="ml-4 flex-1">
              <Text style={{ color: "#fff", fontSize: 20, fontFamily: "dm-sans-bold" }}>
                {userProfile.name}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                {userProfile.farmName}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{"\ud83d\udccd"} {userProfile.location}</Text>
                <View style={{ marginLeft: 8, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
                  <Text style={{ color: "#fff", fontSize: 10, fontFamily: "dm-sans-bold" }}>
                    {userProfile.plan}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={{ flexDirection: "row", marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 12 }}>
            {[
              { value: totalArea, label: "Acres" },
              { value: fields.length, label: "Fields" },
              { value: carbonCredits.totalCredits, label: "Credits" },
              { value: userProfile.memberSince, label: "Since" },
            ].map((item, i) => (
              <View key={i} style={{ flex: 1, alignItems: "center", borderRightWidth: i < 3 ? 1 : 0, borderRightColor: "rgba(255,255,255,0.1)" }}>
                <Text style={{ color: "#fff", fontSize: 17, fontFamily: "dm-sans-bold" }}>{item.value}</Text>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 2 }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Tab Switcher */}
        <View className="flex-row mx-5 mb-4 bg-background-100 rounded-xl p-1">
          {(["overview", "carbon", "settings"] as ProfileTab[]).map((tab) => (
            <Pressable
              key={tab}
              className="flex-1 items-center py-2 rounded-lg"
              style={activeTab === tab ? { backgroundColor: "#16a34a" } : {}}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                className={`text-xs font-dm-sans-medium capitalize ${
                  activeTab === tab ? "text-white" : "text-typography-500"
                }`}
              >
                {tab === "overview" ? "\ud83c\udfe0 Overview" : tab === "carbon" ? "\ud83c\udf0d Carbon" : "\u2699\ufe0f Settings"}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeTab === "overview" && (
          <View className="px-5">
            {/* Crop Distribution */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
                Crop Distribution
              </Text>
              {fields.map((field) => {
                const percentage = (field.area / totalArea) * 100;
                const cropColors: Record<string, string> = {
                  Wheat: "#f59e0b",
                  Tomato: "#ef4444",
                  Rice: "#22c55e",
                  Grapes: "#8b5cf6",
                  Onion: "#f97316",
                  Capsicum: "#06b6d4",
                };
                const color = cropColors[field.crop] || "#6b7280";

                return (
                  <View key={field.id} className="mb-3">
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-typography-700 text-sm font-dm-sans-medium">
                        {field.crop}
                      </Text>
                      <Text className="text-typography-500 text-xs">
                        {field.area}ac ({percentage.toFixed(0)}%)
                      </Text>
                    </View>
                    <View className="h-2.5 bg-background-200 rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Season Summary */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
                Season Summary - Rabi 2025-26
              </Text>
              {[
                { label: "Season Start", value: "October 2025", icon: "\ud83c\udf3e" },
                { label: "Active Crops", value: "6 varieties", icon: "\ud83c\udf31" },
                { label: "Est. Revenue", value: "\u20b912.5 Lakhs", icon: "\ud83d\udcb0" },
                { label: "Input Cost (so far)", value: "\u20b93.8 Lakhs", icon: "\ud83d\udcc9" },
                { label: "Projected Profit", value: "\u20b98.7 Lakhs", icon: "\ud83d\udcca" },
                { label: "Water Used", value: "4.2M Liters", icon: "\ud83d\udca7" },
              ].map((item, i) => (
                <View
                  key={i}
                  className="flex-row items-center justify-between py-2.5"
                  style={i < 5 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}
                >
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                    <Text className="text-typography-600 text-sm font-dm-sans-regular ml-2">
                      {item.label}
                    </Text>
                  </View>
                  <Text className="text-typography-900 text-sm font-dm-sans-bold">
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>

            {/* Achievements */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
                {"\ud83c\udfc6"} Achievements
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {[
                  { title: "Water Saver", desc: "30% less water usage", icon: "\ud83d\udca7", earned: true },
                  { title: "Green Pioneer", desc: "100% organic in 2 fields", icon: "\ud83c\udf3f", earned: true },
                  { title: "Tech Farmer", desc: "50+ AI scans completed", icon: "\ud83e\udde0", earned: true },
                  { title: "Carbon Champion", desc: "20+ carbon credits", icon: "\ud83c\udf0d", earned: true },
                  { title: "Yield Master", desc: "Above avg yield 3 seasons", icon: "\ud83d\udcc8", earned: false },
                  { title: "Zero Waste", desc: "Full crop residue recycling", icon: "\u267b\ufe0f", earned: false },
                ].map((badge, i) => (
                  <View
                    key={i}
                    className="rounded-xl p-3 items-center"
                    style={{
                      width: "30%",
                      backgroundColor: badge.earned ? "#f59e0b10" : "#f3f4f6",
                      opacity: badge.earned ? 1 : 0.5,
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{badge.icon}</Text>
                    <Text className="text-typography-900 text-xs font-dm-sans-bold mt-1 text-center">
                      {badge.title}
                    </Text>
                    <Text className="text-typography-400 text-xs text-center" style={{ fontSize: 9 }}>
                      {badge.desc}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === "carbon" && (
          <View className="px-5">
            <CarbonDashboard />
          </View>
        )}

        {activeTab === "settings" && (
          <View className="px-5">
            {/* Notification Settings */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
                Notifications
              </Text>
              {[
                {
                  label: "Push Notifications",
                  desc: "Alerts for pests, weather, and tasks",
                  value: notifications,
                  onChange: setNotifications,
                },
                {
                  label: "Satellite Alerts",
                  desc: "NDVI changes and crop health updates",
                  value: satelliteAlerts,
                  onChange: setSatelliteAlerts,
                },
                {
                  label: "Auto Irrigation Triggers",
                  desc: "Automatically schedule based on moisture",
                  value: autoIrrigation,
                  onChange: setAutoIrrigation,
                },
              ].map((setting, i) => (
                <View
                  key={i}
                  className="flex-row items-center justify-between py-3"
                  style={i < 2 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}
                >
                  <View className="flex-1 mr-4">
                    <Text className="text-typography-800 text-sm font-dm-sans-medium">
                      {setting.label}
                    </Text>
                    <Text className="text-typography-400 text-xs font-dm-sans-regular mt-0.5">
                      {setting.desc}
                    </Text>
                  </View>
                  <Switch
                    value={setting.value}
                    onValueChange={setting.onChange}
                    trackColor={{ false: "#d4d4d4", true: "#16a34a" }}
                    thumbColor="#fff"
                  />
                </View>
              ))}
            </View>

            {/* Data & Connectivity */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
                Data & Connectivity
              </Text>
              {[
                { label: "Satellite Data", value: "Updated 2h ago", icon: "\ud83d\udef0\ufe0f" },
                { label: "Weather API", value: "Connected", icon: "\u2601\ufe0f" },
                { label: "Soil Sensors", value: "4 of 6 online", icon: "\ud83d\udce1" },
                { label: "Offline Data", value: "128 MB cached", icon: "\ud83d\udcbe" },
              ].map((item, i) => (
                <View
                  key={i}
                  className="flex-row items-center justify-between py-2.5"
                  style={i < 3 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}
                >
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                    <Text className="text-typography-700 text-sm font-dm-sans-regular ml-2">
                      {item.label}
                    </Text>
                  </View>
                  <Text className="text-typography-500 text-xs font-dm-sans-medium">
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>

            {/* All Features Hub */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
                All Features
              </Text>
              {[
                { section: "Farm Operations", items: [
                  { label: "Farm Map", icon: "\ud83d\uddfa\ufe0f", route: "/(tabs)/(dashboard)/farm-map" },
                  { label: "Field Scouting", icon: "\ud83d\udeb6", route: "/(tabs)/(dashboard)/field-scouting" },
                  { label: "Spray Planner", icon: "\ud83d\udca8", route: "/(tabs)/(dashboard)/spray-planner" },
                  { label: "Irrigation Control", icon: "\ud83d\udca7", route: "/(tabs)/(dashboard)/irrigation-control" },
                  { label: "Harvest Tracker", icon: "\ud83c\udf3e", route: "/(tabs)/(dashboard)/harvest-tracker" },
                ]},
                { section: "Intelligence", items: [
                  { label: "Satellite Analysis", icon: "\ud83d\udef0\ufe0f", route: "/(tabs)/(dashboard)/satellite" },
                  { label: "AI Crop Advisor", icon: "\ud83e\udde0", route: "/(tabs)/(dashboard)/crop-advisor" },
                  { label: "Fertilizer Calculator", icon: "\ud83e\udea4", route: "/(tabs)/(dashboard)/fertilizer-calc" },
                  { label: "Market Intelligence", icon: "\ud83d\udcb9", route: "/(tabs)/(dashboard)/market" },
                  { label: "Weather Detail", icon: "\u26c5", route: "/(tabs)/(dashboard)/weather-detail" },
                ]},
                { section: "Management", items: [
                  { label: "Labor Management", icon: "\ud83d\udc77", route: "/(tabs)/(dashboard)/labor-management" },
                  { label: "Equipment", icon: "\ud83d\ude9c", route: "/(tabs)/(dashboard)/equipment" },
                  { label: "Inventory", icon: "\ud83d\udce6", route: "/(tabs)/(dashboard)/inventory" },
                  { label: "Finance Tools", icon: "\ud83e\uddee", route: "/(tabs)/(dashboard)/finance-tools" },
                  { label: "Livestock & Dairy", icon: "\ud83d\udc04", route: "/(tabs)/(dashboard)/livestock" },
                ]},
                { section: "Business", items: [
                  { label: "Contract Farming", icon: "\ud83e\udd1d", route: "/(tabs)/(dashboard)/contract-farming" },
                  { label: "AgriMarketplace", icon: "\ud83d\uded2", route: "/(tabs)/(dashboard)/marketplace" },
                  { label: "Export Docs", icon: "\ud83d\udce6", route: "/(tabs)/(dashboard)/export-docs" },
                  { label: "Insurance Claims", icon: "\ud83d\udee1\ufe0f", route: "/(tabs)/(dashboard)/insurance-claim" },
                  { label: "Government Schemes", icon: "\ud83c\udfe6", route: "/(tabs)/(dashboard)/schemes" },
                ]},
                { section: "Data & Reports", items: [
                  { label: "Reports & Export", icon: "\ud83d\udcc4", route: "/(tabs)/(dashboard)/reports" },
                  { label: "Season Compare", icon: "\ud83d\udcc8", route: "/(tabs)/(dashboard)/season-compare" },
                  { label: "Activity Log", icon: "\ud83d\udcdd", route: "/(tabs)/(dashboard)/activity-log" },
                  { label: "Photo Gallery", icon: "\ud83d\udcf7", route: "/(tabs)/(dashboard)/photo-gallery" },
                  { label: "Farm Passport", icon: "\ud83c\udff7\ufe0f", route: "/(tabs)/(dashboard)/farm-passport" },
                ]},
                { section: "Tools & Settings", items: [
                  { label: "IoT Sensors", icon: "\ud83d\udce1", route: "/(tabs)/(dashboard)/sensors" },
                  { label: "Water Management", icon: "\ud83d\udca7", route: "/(tabs)/(dashboard)/water-management" },
                  { label: "Drone Planner", icon: "\ud83d\ude81", route: "/(tabs)/(dashboard)/drone-planner" },
                  { label: "Alert Config", icon: "\ud83d\udd14", route: "/(tabs)/(dashboard)/alert-config" },
                  { label: "Soil Testing", icon: "\ud83e\udea8", route: "/(tabs)/(dashboard)/soil-testing" },
                  { label: "Training Center", icon: "\ud83c\udf93", route: "/(tabs)/(dashboard)/training" },
                  { label: "Language Settings", icon: "\ud83c\udf10", route: "/(tabs)/(dashboard)/language-settings" },
                  { label: "Help & FAQ", icon: "\u2753", route: "/(tabs)/(dashboard)/help" },
                  { label: "Onboarding Tour", icon: "\ud83d\ude80", route: "/onboarding" },
                ]},
              ].map((section, si) => (
                <View key={si} className="mb-3">
                  <Text className="text-typography-500 text-xs font-dm-sans-bold uppercase mb-1">{section.section}</Text>
                  {section.items.map((item, i) => (
                    <Pressable key={i} onPress={() => router.push(item.route as any)}>
                      <View className="flex-row items-center py-2" style={i < section.items.length - 1 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                        <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                        <Text className="text-typography-700 text-sm font-dm-sans-regular ml-3 flex-1">{item.label}</Text>
                        <Text className="text-typography-400">{"\u203a"}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              ))}
            </View>

            {/* About */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-2">
                About AgriTech Platform
              </Text>
              <Text className="text-typography-500 text-xs font-dm-sans-regular leading-5">
                Version 1.0.0{"\n"}
                Precision agriculture powered by satellite intelligence, AI, and agronomic science.{"\n"}
                Helping farmers shift from intuition-based to data-driven farming.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
