import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { alerts, getAlertColor } from "@/data/agritech";

const typeIcons: Record<string, string> = {
  pest: "\ud83d\udc1b",
  disease: "\ud83e\uddec",
  weather: "\u26c8\ufe0f",
  irrigation: "\ud83d\udca7",
  nutrient: "\ud83c\udf3f",
};

export default function AlertDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const alert = alerts.find((a) => a.id === id) || alerts[0];
  const color = getAlertColor(alert.severity);

  // Detailed response protocols per alert type
  const getProtocol = () => {
    switch (alert.type) {
      case "pest":
        return {
          immediate: [
            "Conduct field scouting within 24 hours",
            "Identify pest species and infestation level",
            "Check Economic Threshold Level (ETL) before spraying",
            "Isolate heavily infested patches",
          ],
          shortTerm: [
            "Apply recommended pesticide with proper PPE",
            "Set up pheromone traps for monitoring",
            "Notify adjacent field owners",
            "Record spray details in logbook",
          ],
          prevention: [
            "Maintain trap density for early detection",
            "Practice crop rotation next season",
            "Encourage natural predators (birds, beneficial insects)",
            "Use border/trap crops around main field",
          ],
        };
      case "disease":
        return {
          immediate: [
            "Remove and destroy visibly infected plant parts",
            "Apply preventive fungicide spray on unaffected areas",
            "Reduce irrigation to lower humidity around canopy",
            "Improve air circulation through pruning",
          ],
          shortTerm: [
            "Apply curative fungicide if infection spreads",
            "Monitor daily for 7 days for spread patterns",
            "Send sample to diagnostic lab if unsure",
            "Adjust fertigation to boost plant immunity",
          ],
          prevention: [
            "Use disease-resistant varieties next season",
            "Ensure proper plant spacing at transplanting",
            "Practice crop rotation with non-host crops",
            "Treat seeds/seedlings before planting",
          ],
        };
      case "weather":
        return {
          immediate: [
            "Prepare drainage channels in low-lying areas",
            "Harvest any mature produce immediately",
            "Secure greenhouse structures and shade nets",
            "Move harvested produce to covered storage",
          ],
          shortTerm: [
            "Delay fertilizer application until after event",
            "Check field conditions after weather event",
            "Assess crop damage and document for insurance",
            "Drain excess water within 24 hours",
          ],
          prevention: [
            "Install weather station for farm-level alerts",
            "Build permanent raised beds in flood-prone areas",
            "Maintain crop insurance (PMFBY) active status",
            "Plan sowing dates to avoid peak risk windows",
          ],
        };
      default:
        return {
          immediate: [
            "Verify issue through soil/plant tissue testing",
            "Apply corrective measure as recommended",
            "Increase monitoring frequency to daily",
          ],
          shortTerm: [
            "Follow up with second application if needed",
            "Adjust fertigation/irrigation schedule",
            "Document changes and outcomes",
          ],
          prevention: [
            "Regular soil testing every 6 months",
            "Balanced nutrient management program",
            "Maintain organic matter through composting",
          ],
        };
    }
  };

  const protocol = getProtocol();

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3" style={{ backgroundColor: color + "08", borderBottomWidth: 1, borderBottomColor: color + "20" }}>
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text style={{ fontSize: 20 }}>{typeIcons[alert.type]}</Text>
            <View className="rounded-full px-2 py-0.5 ml-2" style={{ backgroundColor: color + "20" }}>
              <Text className="text-xs font-dm-sans-bold uppercase" style={{ color }}>{alert.severity}</Text>
            </View>
          </View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold mt-1">{alert.title}</Text>
          <Text className="text-typography-400 text-xs mt-0.5">
            {alert.fieldName} \u2022 {new Date(alert.timestamp).toLocaleString("en-IN", {
              month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
            })}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Full Description */}
        <View className="mx-5 mt-4 bg-background-50 rounded-2xl p-4 border border-outline-100">
          <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">Description</Text>
          <Text className="text-typography-700 text-sm font-dm-sans-regular leading-6">
            {alert.description}
          </Text>
        </View>

        {/* Recommended Action */}
        <View className="mx-5 mt-3 rounded-2xl p-4" style={{ backgroundColor: color + "08", borderWidth: 1, borderColor: color + "20" }}>
          <Text className="font-dm-sans-bold text-sm mb-2" style={{ color }}>
            {"\u26a1"} Recommended Action
          </Text>
          <Text className="text-typography-800 text-sm font-dm-sans-regular leading-6">
            {alert.actionRequired}
          </Text>
        </View>

        {/* Response Protocol */}
        <View className="mx-5 mt-4">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
            Response Protocol
          </Text>

          {/* Immediate */}
          <View className="bg-red-50 rounded-2xl p-4 border border-red-200 mb-3">
            <Text className="text-red-800 font-dm-sans-bold text-sm mb-2">
              {"\ud83d\udea8"} Immediate (0-24 hours)
            </Text>
            {protocol.immediate.map((item, i) => (
              <View key={i} className="flex-row items-start mb-1">
                <Text className="text-red-600 text-xs mr-2 mt-0.5">{i + 1}.</Text>
                <Text className="text-red-700 text-xs font-dm-sans-regular leading-5 flex-1">{item}</Text>
              </View>
            ))}
          </View>

          {/* Short Term */}
          <View className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 mb-3">
            <Text className="text-yellow-800 font-dm-sans-bold text-sm mb-2">
              {"\u23f0"} Short Term (1-7 days)
            </Text>
            {protocol.shortTerm.map((item, i) => (
              <View key={i} className="flex-row items-start mb-1">
                <Text className="text-yellow-600 text-xs mr-2 mt-0.5">{i + 1}.</Text>
                <Text className="text-yellow-700 text-xs font-dm-sans-regular leading-5 flex-1">{item}</Text>
              </View>
            ))}
          </View>

          {/* Prevention */}
          <View className="bg-green-50 rounded-2xl p-4 border border-green-200">
            <Text className="text-green-800 font-dm-sans-bold text-sm mb-2">
              {"\ud83d\udee1\ufe0f"} Long-Term Prevention
            </Text>
            {protocol.prevention.map((item, i) => (
              <View key={i} className="flex-row items-start mb-1">
                <Text className="text-green-600 text-xs mr-2 mt-0.5">{i + 1}.</Text>
                <Text className="text-green-700 text-xs font-dm-sans-regular leading-5 flex-1">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Affected Area */}
        <View className="mx-5 mt-4 bg-background-50 rounded-2xl p-4 border border-outline-100">
          <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">Impact Assessment</Text>
          <View className="flex-row flex-wrap gap-3">
            {[
              { label: "Severity", value: alert.severity.toUpperCase(), color },
              { label: "Affected Area", value: alert.fieldName, color: "#3b82f6" },
              { label: "Detection", value: "Satellite + AI", color: "#8b5cf6" },
              { label: "Response Time", value: "< 6 hours", color: "#22c55e" },
            ].map((item, i) => (
              <View key={i} className="rounded-xl p-3" style={{ width: "47%", backgroundColor: item.color + "08" }}>
                <Text className="text-typography-400 text-xs">{item.label}</Text>
                <Text className="font-dm-sans-bold text-sm mt-0.5" style={{ color: item.color }}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
