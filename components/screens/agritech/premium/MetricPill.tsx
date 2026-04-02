import React from "react";
import { View, Text } from "react-native";
import { COLORS, SHADOWS, RADIUS } from "./theme";

interface MetricPillProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "stable";
}

export default function MetricPill({ label, value, unit, color = COLORS.primary.from, icon, trend }: MetricPillProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color + "0A",
        borderRadius: RADIUS.lg,
        padding: 14,
        borderWidth: 1,
        borderColor: color + "15",
        ...SHADOWS.sm,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
        {trend && (
          <Text style={{ fontSize: 10, color: trend === "up" ? COLORS.status.excellent : trend === "down" ? COLORS.status.critical : COLORS.text.muted }}>
            {trend === "up" ? "\u25b2" : trend === "down" ? "\u25bc" : "\u25cf"}
          </Text>
        )}
      </View>
      <Text
        style={{
          color: COLORS.text.muted,
          fontSize: 11,
          fontFamily: "dm-sans-medium",
          marginTop: 8,
          letterSpacing: 0.3,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: 2 }}>
        <Text style={{ color, fontSize: 22, fontFamily: "dm-sans-bold", letterSpacing: -0.5 }}>
          {value}
        </Text>
        {unit && (
          <Text style={{ color: COLORS.text.muted, fontSize: 11, fontFamily: "dm-sans-regular", marginLeft: 3 }}>
            {unit}
          </Text>
        )}
      </View>
    </View>
  );
}
