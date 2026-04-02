import React from "react";
import { View, Text, Pressable } from "react-native";
import { IrrigationSchedule } from "@/data/agritech";

interface IrrigationCardProps {
  schedule: IrrigationSchedule;
  onPress?: () => void;
}

const statusColors = {
  scheduled: "#3b82f6",
  "in-progress": "#22c55e",
  completed: "#6b7280",
  skipped: "#ef4444",
};

export default function IrrigationCard({ schedule, onPress }: IrrigationCardProps) {
  const moisturePercent = (schedule.soilMoisture / schedule.optimalMoisture) * 100;
  const isLow = schedule.soilMoisture < schedule.optimalMoisture * 0.6;
  const color = statusColors[schedule.status];

  return (
    <Pressable onPress={onPress}>
      <View className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: color + "15" }}
            >
              <Text style={{ fontSize: 20 }}>{"\ud83d\udca7"}</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-typography-900 font-dm-sans-bold text-sm" numberOfLines={1}>
                {schedule.fieldName}
              </Text>
              <Text className="text-typography-500 text-xs font-dm-sans-regular mt-0.5">
                {schedule.method}
              </Text>
            </View>
          </View>
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: color + "15" }}
          >
            <Text className="text-xs font-dm-sans-medium capitalize" style={{ color }}>
              {schedule.status}
            </Text>
          </View>
        </View>

        {/* Moisture Bar */}
        <View className="mt-3">
          <View className="flex-row justify-between mb-1">
            <Text className="text-typography-500 text-xs font-dm-sans-regular">
              Soil Moisture
            </Text>
            <Text
              className="text-xs font-dm-sans-bold"
              style={{ color: isLow ? "#ef4444" : "#22c55e" }}
            >
              {schedule.soilMoisture}% / {schedule.optimalMoisture}% optimal
            </Text>
          </View>
          <View className="h-2 bg-background-200 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${Math.min(moisturePercent, 100)}%`,
                backgroundColor: isLow ? "#ef4444" : "#22c55e",
              }}
            />
          </View>
        </View>

        <View className="flex-row mt-3 pt-2 border-t border-outline-50">
          <View className="flex-1">
            <Text className="text-typography-400 text-xs">Next Irrigation</Text>
            <Text className="text-typography-800 text-xs font-dm-sans-bold mt-0.5">
              {new Date(schedule.nextIrrigation).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-typography-400 text-xs">Water Required</Text>
            <Text className="text-typography-800 text-xs font-dm-sans-bold mt-0.5">
              {(schedule.waterRequired / 1000).toFixed(0)}K L
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
