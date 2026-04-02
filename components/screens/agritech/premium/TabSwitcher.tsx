import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { COLORS, RADIUS } from "./theme";

interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeKey: string;
  onTabChange: (key: string) => void;
  scrollable?: boolean;
}

export default function TabSwitcher({ tabs, activeKey, onTabChange, scrollable = false }: TabSwitcherProps) {
  const content = (
    <View style={{ flexDirection: "row", gap: 6, ...(scrollable ? {} : { flex: 1 }) }}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={({ pressed }) => ({
              flex: scrollable ? undefined : 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              paddingVertical: 8,
              paddingHorizontal: scrollable ? 14 : 8,
              borderRadius: RADIUS.md,
              backgroundColor: isActive ? COLORS.primary.from : "transparent",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            {tab.icon}
            <Text
              style={{
                fontSize: 12,
                fontFamily: isActive ? "dm-sans-bold" : "dm-sans-medium",
                color: isActive ? "#ffffff" : COLORS.text.muted,
              }}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 44, marginHorizontal: 16, marginBottom: 8 }}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 8,
        backgroundColor: COLORS.surface.overlay,
        borderRadius: RADIUS.lg,
        padding: 4,
        flexDirection: "row",
      }}
    >
      {content}
    </View>
  );
}
