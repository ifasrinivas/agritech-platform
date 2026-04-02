import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SHADOWS } from "./theme";
import { ChevronLeft } from "lucide-react-native";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
  onBack?: () => void;
}

export default function ScreenHeader({ title, subtitle, icon, rightAction, onBack }: ScreenHeaderProps) {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surface.borderLight,
      }}
    >
      <Pressable
        onPress={onBack || (() => router.back())}
        style={({ pressed }) => ({
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: pressed ? COLORS.surface.overlay : "transparent",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <ChevronLeft size={22} color={COLORS.text.secondary} strokeWidth={2} />
      </Pressable>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {icon}
          <Text
            style={{
              color: COLORS.text.primary,
              fontSize: 17,
              fontFamily: "dm-sans-bold",
              letterSpacing: -0.3,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
        {subtitle && (
          <Text style={{ color: COLORS.text.muted, fontSize: 11, marginTop: 1, marginLeft: icon ? 26 : 0 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightAction}
    </View>
  );
}
