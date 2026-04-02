import React from "react";
import { View, Text, Pressable } from "react-native";
import { Alert, getAlertColor } from "@/data/agritech";

interface AlertCardProps {
  alert: Alert;
  onPress?: () => void;
  compact?: boolean;
}

const alertIcons: Record<Alert["type"], string> = {
  pest: "\ud83d\udc1b",
  disease: "\ud83e\uddec",
  weather: "\u26c8\ufe0f",
  irrigation: "\ud83d\udca7",
  nutrient: "\ud83c\udf3f",
};

const severityLabels: Record<Alert["severity"], string> = {
  critical: "CRITICAL",
  high: "HIGH",
  medium: "MEDIUM",
  low: "LOW",
};

export default function AlertCard({ alert, onPress, compact = false }: AlertCardProps) {
  const color = getAlertColor(alert.severity);

  return (
    <Pressable onPress={onPress}>
      <View
        className="rounded-2xl p-4 mb-3"
        style={{
          backgroundColor: color + "10",
          borderLeftWidth: 4,
          borderLeftColor: color,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Text style={{ fontSize: 20 }}>{alertIcons[alert.type]}</Text>
            <View className="ml-3 flex-1">
              <View className="flex-row items-center">
                <View
                  className="rounded-full px-2 py-0.5 mr-2"
                  style={{ backgroundColor: color + "25" }}
                >
                  <Text
                    className="text-xs font-dm-sans-bold"
                    style={{ color, fontSize: 10 }}
                  >
                    {severityLabels[alert.severity]}
                  </Text>
                </View>
                <Text className="text-typography-400 text-xs font-dm-sans-regular">
                  {alert.fieldName}
                </Text>
              </View>
              <Text
                className="text-typography-900 font-dm-sans-bold mt-1"
                style={{ fontSize: 14 }}
                numberOfLines={1}
              >
                {alert.title}
              </Text>
            </View>
          </View>
          <Text className="text-typography-400 text-lg">{"\u203a"}</Text>
        </View>
        {!compact && (
          <>
            <Text
              className="text-typography-600 text-xs mt-2 font-dm-sans-regular leading-5"
              numberOfLines={2}
            >
              {alert.description}
            </Text>
            <View className="bg-background-50 rounded-xl p-3 mt-2">
              <Text className="text-typography-500 text-xs font-dm-sans-medium">
                \u26a1 Action: {alert.actionRequired}
              </Text>
            </View>
          </>
        )}
      </View>
    </Pressable>
  );
}
