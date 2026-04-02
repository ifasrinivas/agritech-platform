import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Advisory } from "@/data/agritech";

interface AdvisoryCardProps {
  advisory: Advisory;
}

const typeColors = {
  organic: "#22c55e",
  inorganic: "#3b82f6",
  general: "#8b5cf6",
};

const typeIcons = {
  organic: "\ud83c\udf3f",
  inorganic: "\ud83e\uddea",
  general: "\ud83d\udca1",
};

export default function AdvisoryCard({ advisory }: AdvisoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const color = typeColors[advisory.type];

  return (
    <Pressable onPress={() => setExpanded(!expanded)}>
      <View
        className="rounded-2xl p-4 mb-3 border"
        style={{ backgroundColor: color + "08", borderColor: color + "20" }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Text style={{ fontSize: 20 }}>{typeIcons[advisory.type]}</Text>
            <View className="ml-3 flex-1">
              <View className="flex-row items-center">
                <View
                  className="rounded-full px-2 py-0.5 mr-2"
                  style={{ backgroundColor: color + "20" }}
                >
                  <Text className="text-xs font-dm-sans-medium capitalize" style={{ color }}>
                    {advisory.type}
                  </Text>
                </View>
                <Text className="text-typography-400 text-xs">{advisory.category}</Text>
              </View>
              <Text className="text-typography-900 font-dm-sans-bold text-sm mt-1">
                {advisory.title}
              </Text>
            </View>
          </View>
          <Text className="text-typography-400 text-xl">
            {expanded ? "\u2303" : "\u2304"}
          </Text>
        </View>

        <Text className="text-typography-600 text-xs font-dm-sans-regular mt-2 leading-5">
          {advisory.description}
        </Text>

        {expanded && (
          <View className="mt-3 pt-3 border-t" style={{ borderTopColor: color + "20" }}>
            <Text className="text-typography-500 text-xs font-dm-sans-medium mb-1">
              \u23f0 Timing: {advisory.timing}
            </Text>
            {advisory.dosage && (
              <Text className="text-typography-500 text-xs font-dm-sans-medium mb-1">
                \ud83d\udccf Dosage: {advisory.dosage}
              </Text>
            )}
            {advisory.application && (
              <Text className="text-typography-500 text-xs font-dm-sans-medium mb-1">
                \ud83d\udee0\ufe0f Application: {advisory.application}
              </Text>
            )}
            {advisory.precautions && advisory.precautions.length > 0 && (
              <View className="mt-2 bg-warning-50 rounded-xl p-3">
                <Text className="text-warning-800 text-xs font-dm-sans-bold mb-1">
                  \u26a0\ufe0f Precautions
                </Text>
                {advisory.precautions.map((p, i) => (
                  <Text key={i} className="text-warning-700 text-xs font-dm-sans-regular leading-4">
                    \u2022 {p}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
