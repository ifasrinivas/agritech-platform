import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { COLORS, RADIUS } from "./theme";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export default function Skeleton({ width = "100%", height = 16, borderRadius = RADIUS.sm, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: COLORS.surface.muted,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function CardSkeleton() {
  return (
    <View style={{ backgroundColor: COLORS.surface.base, borderRadius: RADIUS.xl, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: COLORS.surface.borderLight }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Skeleton width={40} height={40} borderRadius={RADIUS.md} />
        <View style={{ flex: 1, gap: 6 }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={10} />
        </View>
      </View>
      <View style={{ marginTop: 14, gap: 8 }}>
        <Skeleton height={12} />
        <Skeleton width="80%" height={12} />
      </View>
    </View>
  );
}

export function MetricsSkeleton() {
  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={{ flex: 1, backgroundColor: COLORS.surface.base, borderRadius: RADIUS.lg, padding: 14, borderWidth: 1, borderColor: COLORS.surface.borderLight }}>
          <Skeleton width={28} height={28} borderRadius={RADIUS.sm} />
          <Skeleton width="50%" height={10} style={{ marginTop: 10 }} />
          <Skeleton width="70%" height={20} style={{ marginTop: 4 }} />
        </View>
      ))}
    </View>
  );
}
