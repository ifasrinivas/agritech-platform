/**
 * Farmer-Friendly Visual Cards
 * Designed for illiterate farmers — uses:
 * - Traffic-light colors (red/yellow/green)
 * - Large icons instead of text
 * - Visual gauges and progress bars
 * - Minimal text, maximum visual
 */
import React from "react";
import { View, Text, Pressable } from "react-native";
import { COLORS, RADIUS, SHADOWS } from "./theme";

// ========================================
// 1. CROP HEALTH TRAFFIC LIGHT
// ========================================
interface CropHealthCardProps {
  cropName: string;
  ndvi: number;
  healthScore: number;
  healthStatus: string;
  growthStage?: string;
  recommendation?: string;
  onPress?: () => void;
}

export function CropHealthCard({ cropName, ndvi, healthScore, healthStatus, growthStage, recommendation, onPress }: CropHealthCardProps) {
  const statusConfig: Record<string, { color: string; bg: string; icon: string; label: string }> = {
    excellent: { color: "#059669", bg: "#d1fae5", icon: "\u2705", label: "Healthy" },
    good:      { color: "#65a30d", bg: "#ecfccb", icon: "\ud83d\udc4d", label: "Good" },
    moderate:  { color: "#d97706", bg: "#fef3c7", icon: "\u26a0\ufe0f", label: "Watch" },
    poor:      { color: "#ea580c", bg: "#ffedd5", icon: "\ud83d\udea8", label: "Danger" },
    critical:  { color: "#dc2626", bg: "#fee2e2", icon: "\u274c", label: "Critical" },
  };
  const cfg = statusConfig[healthStatus] || statusConfig.moderate;

  return (
    <Pressable onPress={onPress}>
      <View style={{ backgroundColor: cfg.bg, borderRadius: RADIUS.xl, padding: 16, borderWidth: 2, borderColor: cfg.color + "30", ...SHADOWS.md }}>
        {/* Traffic light header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ fontSize: 32 }}>{cfg.icon}</Text>
            <View>
              <Text style={{ fontSize: 18, fontFamily: "dm-sans-bold", color: cfg.color }}>{cfg.label}</Text>
              <Text style={{ fontSize: 12, color: cfg.color + "90" }}>{cropName}</Text>
            </View>
          </View>
          {/* Score circle */}
          <View style={{
            width: 56, height: 56, borderRadius: 28,
            backgroundColor: cfg.color, alignItems: "center", justifyContent: "center",
            ...SHADOWS.md,
          }}>
            <Text style={{ color: "#fff", fontSize: 18, fontFamily: "dm-sans-bold" }}>{Math.round(healthScore)}</Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 8 }}>/100</Text>
          </View>
        </View>

        {/* Visual gauge bar */}
        <View style={{ marginTop: 14 }}>
          <View style={{ height: 10, backgroundColor: "rgba(0,0,0,0.08)", borderRadius: 5, overflow: "hidden" }}>
            <View style={{ height: "100%", width: `${healthScore}%`, backgroundColor: cfg.color, borderRadius: 5 }} />
          </View>
          {/* Scale labels with emojis */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
            <Text style={{ fontSize: 10, color: "#dc2626" }}>{"\u274c"} Bad</Text>
            <Text style={{ fontSize: 10, color: "#d97706" }}>{"\u26a0\ufe0f"} OK</Text>
            <Text style={{ fontSize: 10, color: "#059669" }}>{"\u2705"} Great</Text>
          </View>
        </View>

        {/* Growth stage + NDVI */}
        <View style={{ flexDirection: "row", marginTop: 12, gap: 8 }}>
          {growthStage && (
            <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.6)", borderRadius: RADIUS.sm, padding: 8, alignItems: "center" }}>
              <Text style={{ fontSize: 16 }}>{"\ud83c\udf31"}</Text>
              <Text style={{ fontSize: 10, color: COLORS.text.secondary, marginTop: 2 }}>{growthStage}</Text>
            </View>
          )}
          <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.6)", borderRadius: RADIUS.sm, padding: 8, alignItems: "center" }}>
            <Text style={{ fontSize: 16 }}>{"\ud83d\udef0\ufe0f"}</Text>
            <Text style={{ fontSize: 10, color: COLORS.text.secondary, marginTop: 2 }}>NDVI: {ndvi.toFixed(2)}</Text>
          </View>
        </View>

        {/* Recommendation */}
        {recommendation && (
          <View style={{ marginTop: 10, backgroundColor: "rgba(255,255,255,0.7)", borderRadius: RADIUS.sm, padding: 10 }}>
            <Text style={{ fontSize: 11, color: COLORS.text.secondary, lineHeight: 16 }}>
              {"\ud83d\udca1"} {recommendation}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

// ========================================
// 2. SOIL HEALTH VISUAL GAUGE
// ========================================
interface SoilHealthCardProps {
  pH: number;
  pHStatus: string;
  texture: string;
  organicCarbon: number;
  moisture: number;
  soilTemp: number;
  recommendations: string[];
}

export function SoilHealthCard({ pH, pHStatus, texture, organicCarbon, moisture, soilTemp, recommendations }: SoilHealthCardProps) {
  const phColor = pH < 5.5 ? "#dc2626" : pH < 6.5 ? "#f59e0b" : pH <= 7.5 ? "#059669" : pH <= 8 ? "#f59e0b" : "#dc2626";
  const moistColor = moisture < 15 ? "#dc2626" : moisture < 25 ? "#f59e0b" : moisture < 45 ? "#059669" : "#3b82f6";
  const ocColor = organicCarbon < 0.3 ? "#dc2626" : organicCarbon < 0.5 ? "#f59e0b" : "#059669";

  return (
    <View style={{ backgroundColor: COLORS.surface.base, borderRadius: RADIUS.xl, padding: 16, ...SHADOWS.md }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Text style={{ fontSize: 24 }}>{"\ud83e\udea8"}</Text>
        <Text style={{ fontSize: 16, fontFamily: "dm-sans-bold", color: COLORS.text.primary }}>Soil Health</Text>
      </View>

      {/* Visual Gauges */}
      <View style={{ gap: 10 }}>
        <GaugeRow icon="\ud83e\uddea" label="pH" value={pH} display={`${pH} (${pHStatus})`} min={4} max={10} optMin={6} optMax={7.5} color={phColor} />
        <GaugeRow icon="\ud83d\udca7" label="Moisture" value={moisture} display={`${moisture}%`} min={0} max={60} optMin={25} optMax={45} color={moistColor} />
        <GaugeRow icon="\ud83c\udf3f" label="Organic C" value={organicCarbon * 100} display={`${organicCarbon}%`} min={0} max={200} optMin={50} optMax={150} color={ocColor} />
        <GaugeRow icon="\ud83c\udf21\ufe0f" label="Soil Temp" value={soilTemp} display={`${soilTemp}°C`} min={0} max={50} optMin={15} optMax={35} color={soilTemp > 35 ? "#dc2626" : soilTemp < 10 ? "#3b82f6" : "#059669"} />
      </View>

      {/* Texture badge */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12, gap: 6 }}>
        <Text style={{ fontSize: 14 }}>{"\ud83e\udea8"}</Text>
        <View style={{ backgroundColor: COLORS.surface.overlay, borderRadius: RADIUS.sm, paddingHorizontal: 10, paddingVertical: 4 }}>
          <Text style={{ fontSize: 12, fontFamily: "dm-sans-medium", color: COLORS.text.secondary }}>{texture}</Text>
        </View>
      </View>

      {/* Visual recommendations */}
      {recommendations.length > 0 && (
        <View style={{ marginTop: 12, backgroundColor: "#f0fdf4", borderRadius: RADIUS.md, padding: 10 }}>
          <Text style={{ fontSize: 12, fontFamily: "dm-sans-bold", color: "#059669", marginBottom: 4 }}>{"\ud83d\udca1"} What to do:</Text>
          {recommendations.slice(0, 3).map((r, i) => (
            <Text key={i} style={{ fontSize: 11, color: "#065f46", lineHeight: 16 }}>{"\u2022"} {r}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

// ========================================
// 3. WEATHER ADVISORY (simple icons)
// ========================================
interface WeatherAdvisoryCardProps {
  temperature: number;
  humidity: number;
  sprayOk: boolean;
  sprayReason: string;
  diseaseRisk: string;
  diseases: string[];
  irrigationAdvice: string;
  rainNext3d: number;
}

export function WeatherAdvisoryCard({ temperature, humidity, sprayOk, sprayReason, diseaseRisk, diseases, irrigationAdvice, rainNext3d }: WeatherAdvisoryCardProps) {
  return (
    <View style={{ backgroundColor: COLORS.surface.base, borderRadius: RADIUS.xl, padding: 16, ...SHADOWS.md }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Text style={{ fontSize: 24 }}>{"\u26c5"}</Text>
        <Text style={{ fontSize: 16, fontFamily: "dm-sans-bold", color: COLORS.text.primary }}>Today's Advisory</Text>
      </View>

      {/* Big visual indicators */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        {/* Spray */}
        <View style={{ flex: 1, backgroundColor: sprayOk ? "#d1fae5" : "#fee2e2", borderRadius: RADIUS.lg, padding: 12, alignItems: "center" }}>
          <Text style={{ fontSize: 28 }}>{sprayOk ? "\u2705" : "\u274c"}</Text>
          <Text style={{ fontSize: 12, fontFamily: "dm-sans-bold", color: sprayOk ? "#059669" : "#dc2626", marginTop: 4 }}>
            {sprayOk ? "Spray OK" : "No Spray"}
          </Text>
          <Text style={{ fontSize: 9, color: COLORS.text.muted, textAlign: "center", marginTop: 2 }}>{sprayReason}</Text>
        </View>

        {/* Disease */}
        <View style={{ flex: 1, backgroundColor: diseaseRisk === "high" ? "#fee2e2" : diseaseRisk === "medium" ? "#fef3c7" : "#d1fae5", borderRadius: RADIUS.lg, padding: 12, alignItems: "center" }}>
          <Text style={{ fontSize: 28 }}>{diseaseRisk === "high" ? "\ud83d\udc1b" : diseaseRisk === "medium" ? "\u26a0\ufe0f" : "\ud83d\udee1\ufe0f"}</Text>
          <Text style={{ fontSize: 12, fontFamily: "dm-sans-bold", color: diseaseRisk === "high" ? "#dc2626" : diseaseRisk === "medium" ? "#d97706" : "#059669", marginTop: 4 }}>
            {diseaseRisk === "high" ? "High Risk" : diseaseRisk === "medium" ? "Watch" : "Safe"}
          </Text>
          <Text style={{ fontSize: 9, color: COLORS.text.muted, textAlign: "center", marginTop: 2 }}>Disease</Text>
        </View>

        {/* Irrigation */}
        <View style={{ flex: 1, backgroundColor: irrigationAdvice === "skip" ? "#dbeafe" : irrigationAdvice === "increase" ? "#fef3c7" : "#d1fae5", borderRadius: RADIUS.lg, padding: 12, alignItems: "center" }}>
          <Text style={{ fontSize: 28 }}>{irrigationAdvice === "skip" ? "\ud83c\udf27\ufe0f" : irrigationAdvice === "increase" ? "\ud83d\udca7" : "\ud83d\udc4d"}</Text>
          <Text style={{ fontSize: 12, fontFamily: "dm-sans-bold", color: irrigationAdvice === "skip" ? "#2563eb" : irrigationAdvice === "increase" ? "#d97706" : "#059669", marginTop: 4 }}>
            {irrigationAdvice === "skip" ? "Skip Water" : irrigationAdvice === "increase" ? "More Water" : "Normal"}
          </Text>
          <Text style={{ fontSize: 9, color: COLORS.text.muted, textAlign: "center", marginTop: 2 }}>
            Rain: {rainNext3d}mm/3d
          </Text>
        </View>
      </View>

      {/* Temperature + Humidity */}
      <View style={{ flexDirection: "row", marginTop: 10, gap: 8 }}>
        <View style={{ flex: 1, backgroundColor: COLORS.surface.overlay, borderRadius: RADIUS.md, padding: 10, flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ fontSize: 20 }}>{"\ud83c\udf21\ufe0f"}</Text>
          <Text style={{ fontSize: 18, fontFamily: "dm-sans-bold", color: temperature > 35 ? "#dc2626" : COLORS.text.primary }}>{Math.round(temperature)}°C</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: COLORS.surface.overlay, borderRadius: RADIUS.md, padding: 10, flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ fontSize: 20 }}>{"\ud83d\udca7"}</Text>
          <Text style={{ fontSize: 18, fontFamily: "dm-sans-bold", color: COLORS.text.primary }}>{humidity}%</Text>
        </View>
      </View>

      {/* Disease names if any */}
      {diseases.length > 0 && (
        <View style={{ marginTop: 8, backgroundColor: "#fef2f2", borderRadius: RADIUS.sm, padding: 8 }}>
          <Text style={{ fontSize: 10, color: "#991b1b" }}>{"\u26a0\ufe0f"} Risk: {diseases.join(", ")}</Text>
        </View>
      )}
    </View>
  );
}

// ========================================
// 4. VISUAL GAUGE ROW (reusable)
// ========================================
function GaugeRow({ icon, label, value, display, min, max, optMin, optMax, color }: {
  icon: string; label: string; value: number; display: string;
  min: number; max: number; optMin: number; optMax: number; color: string;
}) {
  const range = max - min;
  const pct = Math.min(Math.max(((value - min) / range) * 100, 0), 100);
  const optMinPct = ((optMin - min) / range) * 100;
  const optMaxPct = ((optMax - min) / range) * 100;

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={{ fontSize: 14 }}>{icon}</Text>
          <Text style={{ fontSize: 11, fontFamily: "dm-sans-medium", color: COLORS.text.secondary }}>{label}</Text>
        </View>
        <Text style={{ fontSize: 12, fontFamily: "dm-sans-bold", color }}>{display}</Text>
      </View>
      <View style={{ height: 8, backgroundColor: COLORS.surface.muted, borderRadius: 4, overflow: "hidden", position: "relative" }}>
        {/* Optimal range */}
        <View style={{ position: "absolute", left: `${optMinPct}%`, width: `${optMaxPct - optMinPct}%`, height: "100%", backgroundColor: "#05966915" }} />
        {/* Value */}
        <View style={{ height: "100%", width: `${pct}%`, backgroundColor: color, borderRadius: 4 }} />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 1 }}>
        <Text style={{ fontSize: 8, color: COLORS.text.muted }}>{min}</Text>
        <Text style={{ fontSize: 8, color: "#059669" }}>Ideal: {optMin}-{optMax}</Text>
        <Text style={{ fontSize: 8, color: COLORS.text.muted }}>{max}</Text>
      </View>
    </View>
  );
}

// ========================================
// 5. SIMPLE ACTION BUTTON (icon-first)
// ========================================
interface FarmerActionProps {
  icon: string;
  label: string;
  sublabel?: string;
  color: string;
  onPress: () => void;
  badge?: string;
}

export function FarmerAction({ icon, label, sublabel, color, onPress, badge }: FarmerActionProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
      <View style={{ backgroundColor: color + "10", borderRadius: RADIUS.lg, padding: 14, alignItems: "center", borderWidth: 1, borderColor: color + "20", minHeight: 90, justifyContent: "center", position: "relative" }}>
        {badge && (
          <View style={{ position: "absolute", top: 4, right: 4, backgroundColor: "#dc2626", borderRadius: 8, width: 16, height: 16, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontSize: 8, fontFamily: "dm-sans-bold" }}>{badge}</Text>
          </View>
        )}
        <Text style={{ fontSize: 28 }}>{icon}</Text>
        <Text style={{ fontSize: 11, fontFamily: "dm-sans-bold", color, marginTop: 4, textAlign: "center" }}>{label}</Text>
        {sublabel && <Text style={{ fontSize: 9, color: COLORS.text.muted, textAlign: "center" }}>{sublabel}</Text>}
      </View>
    </Pressable>
  );
}

// ========================================
// 6. IDEAL VALUES REFERENCE CARD
// ========================================
interface IdealValue {
  parameter: string;
  icon: string;
  ideal: string;
  current: string;
  status: "good" | "warn" | "bad";
}

export function IdealValuesCard({ values, title }: { values: IdealValue[]; title: string }) {
  const statusIcon = { good: "\u2705", warn: "\u26a0\ufe0f", bad: "\u274c" };
  const statusBg = { good: "#d1fae5", warn: "#fef3c7", bad: "#fee2e2" };
  const statusColor = { good: "#059669", warn: "#d97706", bad: "#dc2626" };

  return (
    <View style={{ backgroundColor: COLORS.surface.base, borderRadius: RADIUS.xl, padding: 16, ...SHADOWS.md }}>
      <Text style={{ fontSize: 15, fontFamily: "dm-sans-bold", color: COLORS.text.primary, marginBottom: 12 }}>{"\ud83d\udcca"} {title}</Text>
      {values.map((v, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: i < values.length - 1 ? 1 : 0, borderBottomColor: COLORS.surface.borderLight }}>
          <Text style={{ fontSize: 18, width: 28 }}>{v.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontFamily: "dm-sans-medium", color: COLORS.text.primary }}>{v.parameter}</Text>
            <Text style={{ fontSize: 10, color: COLORS.text.muted }}>Ideal: {v.ideal}</Text>
          </View>
          <View style={{ backgroundColor: statusBg[v.status], borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 4, flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 12 }}>{statusIcon[v.status]}</Text>
            <Text style={{ fontSize: 11, fontFamily: "dm-sans-bold", color: statusColor[v.status] }}>{v.current}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
