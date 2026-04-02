import React from "react";
import { View, ViewProps } from "react-native";
import { COLORS, SHADOWS, RADIUS } from "./theme";

interface GlassCardProps extends ViewProps {
  variant?: "default" | "raised" | "accent" | "dark";
  noPadding?: boolean;
}

export default function GlassCard({ variant = "default", noPadding, style, children, ...props }: GlassCardProps) {
  const variants = {
    default: {
      backgroundColor: COLORS.surface.base,
      borderColor: COLORS.surface.border,
      ...SHADOWS.sm,
    },
    raised: {
      backgroundColor: COLORS.surface.base,
      borderColor: COLORS.surface.borderLight,
      ...SHADOWS.md,
    },
    accent: {
      backgroundColor: COLORS.glass.green,
      borderColor: COLORS.primary.muted + "30",
      ...SHADOWS.sm,
    },
    dark: {
      backgroundColor: COLORS.glass.dark,
      borderColor: "rgba(255,255,255,0.1)",
    },
  };

  return (
    <View
      style={[
        {
          borderRadius: RADIUS.xl,
          borderWidth: 1,
          padding: noPadding ? 0 : 16,
          overflow: "hidden",
        },
        variants[variant],
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
