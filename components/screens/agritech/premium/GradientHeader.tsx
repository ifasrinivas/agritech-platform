import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS, COLORS } from "./theme";

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  gradient?: readonly string[];
  compact?: boolean;
}

export default function GradientHeader({
  title,
  subtitle,
  rightContent,
  gradient = GRADIENTS.hero,
  compact = false,
}: GradientHeaderProps) {
  return (
    <LinearGradient
      colors={gradient as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingHorizontal: 20,
        paddingTop: compact ? 12 : 20,
        paddingBottom: compact ? 16 : 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
              fontFamily: "dm-sans-medium",
              letterSpacing: 0.5,
            }}
          >
            {subtitle}
          </Text>
          <Text
            style={{
              color: "#ffffff",
              fontSize: compact ? 20 : 24,
              fontFamily: "dm-sans-bold",
              marginTop: 2,
              letterSpacing: -0.3,
            }}
          >
            {title}
          </Text>
        </View>
        {rightContent}
      </View>
    </LinearGradient>
  );
}
