import React from "react";
import { View, Text, Pressable } from "react-native";
import { COLORS } from "./theme";

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
  badge?: number;
  icon?: React.ReactNode;
}

export default function SectionHeader({ title, action, onAction, badge, icon }: SectionHeaderProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12, paddingHorizontal: 2 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {icon}
        <Text style={{ color: COLORS.text.primary, fontSize: 17, fontFamily: "dm-sans-bold", letterSpacing: -0.3 }}>
          {title}
        </Text>
        {badge !== undefined && badge > 0 && (
          <View
            style={{
              backgroundColor: COLORS.status.critical + "15",
              borderRadius: 10,
              paddingHorizontal: 7,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: COLORS.status.critical, fontSize: 11, fontFamily: "dm-sans-bold" }}>{badge}</Text>
          </View>
        )}
      </View>
      {action && onAction && (
        <Pressable onPress={onAction}>
          <Text style={{ color: COLORS.primary.from, fontSize: 13, fontFamily: "dm-sans-medium" }}>
            {action}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
