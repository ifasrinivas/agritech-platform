import React from "react";
import { View, Text, Pressable } from "react-native";
import { Field, getFieldHealthColor, getNDVIColor } from "@/data/agritech";

interface FieldCardProps {
  field: Field;
  onPress?: () => void;
}

const cropIcons: Record<string, string> = {
  Wheat: "\ud83c\udf3e",
  Tomato: "\ud83c\udf45",
  Rice: "\ud83c\udf3e",
  Grapes: "\ud83c\udf47",
  Onion: "\ud83e\uddc5",
  Capsicum: "\ud83c\udf36\ufe0f",
};

export default function FieldCard({ field, onPress }: FieldCardProps) {
  const healthColor = getFieldHealthColor(field.healthStatus);
  const ndviColor = getNDVIColor(field.ndviScore);

  return (
    <Pressable onPress={onPress}>
      <View className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: healthColor + "18" }}
            >
              <Text style={{ fontSize: 24 }}>{cropIcons[field.crop] || "\ud83c\udf31"}</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-typography-900 font-dm-sans-bold text-sm" numberOfLines={1}>
                {field.name}
              </Text>
              <Text className="text-typography-500 text-xs font-dm-sans-regular mt-0.5">
                {field.area} acres \u2022 {field.soilType}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <View className="flex-row items-center">
              <View
                className="w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: healthColor }}
              />
              <Text
                className="text-xs font-dm-sans-medium capitalize"
                style={{ color: healthColor }}
              >
                {field.healthStatus}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row mt-3 pt-3 border-t border-outline-50">
          <View className="flex-1 items-center">
            <Text className="text-typography-400 text-xs font-dm-sans-regular">NDVI</Text>
            <Text className="font-dm-sans-bold text-sm mt-0.5" style={{ color: ndviColor }}>
              {field.ndviScore.toFixed(2)}
            </Text>
          </View>
          <View className="w-px bg-outline-100" />
          <View className="flex-1 items-center">
            <Text className="text-typography-400 text-xs font-dm-sans-regular">Irrigation</Text>
            <Text className="text-typography-800 font-dm-sans-medium text-xs mt-0.5">
              {field.irrigationType.split(" ")[0]}
            </Text>
          </View>
          <View className="w-px bg-outline-100" />
          <View className="flex-1 items-center">
            <Text className="text-typography-400 text-xs font-dm-sans-regular">Harvest</Text>
            <Text className="text-typography-800 font-dm-sans-medium text-xs mt-0.5">
              {new Date(field.expectedHarvest).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
            </Text>
          </View>
        </View>

        {/* NDVI Bar */}
        <View className="mt-3">
          <View className="h-2 bg-background-200 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{ width: `${field.ndviScore * 100}%`, backgroundColor: ndviColor }}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
