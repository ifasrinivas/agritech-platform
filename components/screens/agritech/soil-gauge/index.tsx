import React from "react";
import { View, Text } from "react-native";

interface SoilGaugeProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  optimalMin: number;
  optimalMax: number;
  color: string;
}

export default function SoilGauge({
  label,
  value,
  unit,
  min,
  max,
  optimalMin,
  optimalMax,
  color,
}: SoilGaugeProps) {
  const range = max - min;
  const position = Math.min(Math.max(((value - min) / range) * 100, 0), 100);
  const optMinPos = ((optimalMin - min) / range) * 100;
  const optMaxPos = ((optimalMax - min) / range) * 100;
  const isOptimal = value >= optimalMin && value <= optimalMax;

  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-typography-700 text-sm font-dm-sans-medium">{label}</Text>
        <Text className="font-dm-sans-bold text-sm" style={{ color: isOptimal ? "#22c55e" : "#f59e0b" }}>
          {value} {unit}
        </Text>
      </View>
      <View className="h-3 bg-background-200 rounded-full overflow-hidden relative">
        {/* Optimal range indicator */}
        <View
          className="absolute h-full opacity-20"
          style={{
            left: `${optMinPos}%`,
            width: `${optMaxPos - optMinPos}%`,
            backgroundColor: "#22c55e",
          }}
        />
        {/* Value indicator */}
        <View
          className="h-full rounded-full"
          style={{
            width: `${position}%`,
            backgroundColor: isOptimal ? "#22c55e" : color,
          }}
        />
      </View>
      <View className="flex-row justify-between mt-1">
        <Text className="text-typography-400 text-xs">{min}</Text>
        <Text className="text-typography-400 text-xs">
          Optimal: {optimalMin}-{optimalMax}
        </Text>
        <Text className="text-typography-400 text-xs">{max}</Text>
      </View>
    </View>
  );
}
