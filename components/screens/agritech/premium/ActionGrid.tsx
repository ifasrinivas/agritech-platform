import React from "react";
import { View, Text, Pressable } from "react-native";
import { COLORS, SHADOWS, RADIUS } from "./theme";

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
  badge?: string;
}

interface ActionGridProps {
  items: ActionItem[];
  columns?: 3 | 4;
}

export default function ActionGrid({ items, columns = 4 }: ActionGridProps) {
  const itemWidth = columns === 4 ? "23.5%" : "31%";

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
      {items.map((item, i) => (
        <Pressable
          key={i}
          onPress={item.onPress}
          style={({ pressed }) => ({
            width: itemWidth as any,
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <View
            style={{
              backgroundColor: COLORS.surface.base,
              borderRadius: RADIUS.lg,
              padding: 12,
              alignItems: "center",
              justifyContent: "center",
              minHeight: 80,
              borderWidth: 1,
              borderColor: COLORS.surface.borderLight,
              ...SHADOWS.sm,
            }}
          >
            {item.badge && (
              <View
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  backgroundColor: COLORS.status.critical,
                  borderRadius: RADIUS.full,
                  width: 16,
                  height: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 8, fontFamily: "dm-sans-bold" }}>{item.badge}</Text>
              </View>
            )}
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: RADIUS.md,
                backgroundColor: item.color + "12",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </View>
            <Text
              style={{
                color: COLORS.text.secondary,
                fontSize: 10,
                fontFamily: "dm-sans-medium",
                marginTop: 6,
                textAlign: "center",
                lineHeight: 13,
              }}
              numberOfLines={2}
            >
              {item.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
