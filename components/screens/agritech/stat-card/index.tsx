import React from "react";
import { View, Text } from "react-native";
import { COLORS, SHADOWS, RADIUS } from "@/components/screens/agritech/premium/theme";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  color: string;
  subtitle?: string;
}

export default function StatCard({ title, value, unit, icon, color, subtitle }: StatCardProps) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: 140,
        borderRadius: RADIUS.xl,
        padding: 14,
        backgroundColor: COLORS.surface.base,
        borderWidth: 1,
        borderColor: COLORS.surface.borderLight,
        ...SHADOWS.sm,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ width: 32, height: 32, borderRadius: RADIUS.sm, backgroundColor: color + "10", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 16 }}>{icon}</Text>
        </View>
      </View>
      <Text style={{ color: COLORS.text.muted, fontSize: 10, fontFamily: "dm-sans-medium", marginTop: 10, letterSpacing: 0.4, textTransform: "uppercase" }}>
        {title}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: 2 }}>
        <Text style={{ color, fontSize: 24, fontFamily: "dm-sans-bold", letterSpacing: -0.5 }}>
          {value}
        </Text>
        {unit && (
          <Text style={{ color: COLORS.text.muted, fontSize: 11, fontFamily: "dm-sans-regular", marginLeft: 3 }}>{unit}</Text>
        )}
      </View>
      {subtitle && (
        <Text style={{ color: COLORS.text.muted, fontSize: 10, fontFamily: "dm-sans-regular", marginTop: 2 }}>{subtitle}</Text>
      )}
    </View>
  );
}
