import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { ScanResult } from "@/data/agritech";

interface ScanResultCardProps {
  result: ScanResult;
}

const severityColors = {
  mild: "#22c55e",
  moderate: "#f59e0b",
  severe: "#ef4444",
};

export default function ScanResultCard({ result }: ScanResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const color = severityColors[result.severity];
  const isHealthy = result.disease.includes("Healthy");

  return (
    <Pressable onPress={() => setExpanded(!expanded)}>
      <View className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: isHealthy ? "#22c55e15" : color + "15" }}
            >
              <Text style={{ fontSize: 24 }}>{isHealthy ? "\u2705" : "\ud83d\udd2c"}</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-typography-900 font-dm-sans-bold text-sm" numberOfLines={1}>
                {result.disease}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-typography-500 text-xs font-dm-sans-regular">
                  {result.cropName}
                </Text>
                <Text className="text-typography-300 mx-2">\u2022</Text>
                <Text
                  className="text-xs font-dm-sans-medium"
                  style={{ color }}
                >
                  {result.confidence}% confidence
                </Text>
              </View>
            </View>
          </View>
          {!isHealthy && (
            <View
              className="rounded-full px-2 py-1"
              style={{ backgroundColor: color + "15" }}
            >
              <Text className="text-xs font-dm-sans-bold capitalize" style={{ color }}>
                {result.severity}
              </Text>
            </View>
          )}
        </View>

        {expanded && !isHealthy && (
          <View className="mt-3 pt-3 border-t border-outline-100">
            {/* Chemical Treatment */}
            {result.treatment.length > 0 && (
              <View className="mb-3">
                <Text className="text-typography-900 font-dm-sans-bold text-xs mb-1.5">
                  \ud83e\uddea Chemical Treatment
                </Text>
                {result.treatment.map((t, i) => (
                  <Text key={i} className="text-typography-600 text-xs font-dm-sans-regular leading-5">
                    {i + 1}. {t}
                  </Text>
                ))}
              </View>
            )}

            {/* Organic Alternative */}
            {result.organicAlternative.length > 0 && (
              <View className="mb-3 bg-success-50 rounded-xl p-3">
                <Text className="text-success-800 font-dm-sans-bold text-xs mb-1.5">
                  \ud83c\udf3f Organic Alternative
                </Text>
                {result.organicAlternative.map((t, i) => (
                  <Text key={i} className="text-success-700 text-xs font-dm-sans-regular leading-5">
                    {i + 1}. {t}
                  </Text>
                ))}
              </View>
            )}

            {/* Prevention */}
            {result.preventionTips.length > 0 && (
              <View>
                <Text className="text-typography-900 font-dm-sans-bold text-xs mb-1.5">
                  \ud83d\udee1\ufe0f Prevention Tips
                </Text>
                {result.preventionTips.map((t, i) => (
                  <Text key={i} className="text-typography-600 text-xs font-dm-sans-regular leading-5">
                    \u2022 {t}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {expanded && isHealthy && result.preventionTips.length > 0 && (
          <View className="mt-3 pt-3 border-t border-outline-100">
            <Text className="text-typography-900 font-dm-sans-bold text-xs mb-1.5">
              \ud83d\udcdd Recommendations
            </Text>
            {result.preventionTips.map((t, i) => (
              <Text key={i} className="text-typography-600 text-xs font-dm-sans-regular leading-5">
                \u2022 {t}
              </Text>
            ))}
          </View>
        )}

        <Text className="text-typography-400 text-xs mt-2 text-right">
          {new Date(result.timestamp).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </Pressable>
  );
}
