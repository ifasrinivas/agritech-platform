import React from "react";
import { View, Text, Pressable } from "react-native";
import { fields, getNDVIColor } from "@/data/agritech";
import { COLORS, SHADOWS, RADIUS } from "@/components/screens/agritech/premium/theme";
import { Satellite } from "lucide-react-native";

interface NDVIMapProps {
  onFieldPress?: (fieldId: string) => void;
}

export default function NDVIMap({ onFieldPress }: NDVIMapProps) {
  const avgNDVI = fields.reduce((sum, f) => sum + f.ndviScore, 0) / fields.length;

  return (
    <View style={{ backgroundColor: COLORS.surface.base, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.surface.border, overflow: "hidden", ...SHADOWS.md }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, paddingBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ width: 32, height: 32, borderRadius: RADIUS.sm, backgroundColor: COLORS.accent.violet + "12", alignItems: "center", justifyContent: "center" }}>
            <Satellite size={16} color={COLORS.accent.violet} />
          </View>
          <View>
            <Text style={{ color: COLORS.text.primary, fontSize: 15, fontFamily: "dm-sans-bold" }}>
              Satellite Health Index
            </Text>
            <Text style={{ color: COLORS.text.muted, fontSize: 11, fontFamily: "dm-sans-regular", marginTop: 1 }}>
              NDVI Analysis
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ color: COLORS.text.muted, fontSize: 10, letterSpacing: 0.3 }}>FARM AVG</Text>
          <Text style={{ fontFamily: "dm-sans-bold", fontSize: 20, color: getNDVIColor(avgNDVI), letterSpacing: -0.5 }}>
            {avgNDVI.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Grid */}
      <View style={{ backgroundColor: "#0f1a12", margin: 12, marginTop: 0, borderRadius: RADIUS.lg, padding: 8 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {fields.map((field) => {
            const ndviColor = getNDVIColor(field.ndviScore);
            return (
              <Pressable
                key={field.id}
                onPress={() => onFieldPress?.(field.id)}
                style={({ pressed }) => ({
                  width: `${Math.max((field.area / 45.5) * 100, 30)}%`,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <View
                  style={{
                    margin: 3,
                    borderRadius: RADIUS.md,
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: ndviColor + "20",
                    borderWidth: 1.5,
                    borderColor: ndviColor + "50",
                    minHeight: 76,
                  }}
                >
                  <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontFamily: "dm-sans-bold" }} numberOfLines={1}>
                    {field.crop}
                  </Text>
                  <Text style={{ color: ndviColor, fontSize: 18, fontFamily: "dm-sans-bold", marginTop: 2, letterSpacing: -0.5 }}>
                    {field.ndviScore.toFixed(2)}
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{field.area}ac</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Legend */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, gap: 16 }}>
        {[
          { label: "Poor", color: "#dc2626" },
          { label: "Low", color: "#ea580c" },
          { label: "Moderate", color: "#ca8a04" },
          { label: "Good", color: "#65a30d" },
          { label: "Excellent", color: "#15803d" },
        ].map((item) => (
          <View key={item.label} style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: item.color, marginRight: 4 }} />
            <Text style={{ color: COLORS.text.muted, fontSize: 10 }}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
