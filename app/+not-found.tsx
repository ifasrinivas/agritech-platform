import React from "react";
import { View, Text, Pressable } from "react-native";
import { Stack, Link } from "expo-router";
import { COLORS } from "@/components/screens/agritech/premium/theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.surface.raised, padding: 20 }}>
        <Text style={{ fontSize: 56 }}>{"\ud83c\udf3e"}</Text>
        <Text style={{ fontSize: 22, fontFamily: "dm-sans-bold", color: COLORS.text.primary, marginTop: 16 }}>
          Page Not Found
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.text.muted, textAlign: "center", marginTop: 8 }}>
          This field doesn't exist in our records.
        </Text>
        <Link href="/" asChild>
          <Pressable style={{ marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: COLORS.primary.from, borderRadius: 12 }}>
            <Text style={{ color: "#fff", fontFamily: "dm-sans-bold", fontSize: 14 }}>Back to Dashboard</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
