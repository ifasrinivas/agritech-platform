import React, { useState, useContext } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { fields, alerts, userProfile } from "@/data/agritech";
import { LiveDataContext } from "@/contexts/live-data-context";
import { weatherCodeToCondition } from "@/services/weather-service";
import WeatherWidget from "@/components/screens/agritech/weather-widget";
import NDVIMap from "@/components/screens/agritech/ndvi-map";
import LiveStatusBar from "@/components/screens/agritech/live-status-bar";
import GlassCard from "@/components/screens/agritech/premium/GlassCard";
import MetricPill from "@/components/screens/agritech/premium/MetricPill";
import ActionGrid from "@/components/screens/agritech/premium/ActionGrid";
import SectionHeader from "@/components/screens/agritech/premium/SectionHeader";
import { CropHealthCard, WeatherAdvisoryCard, IdealValuesCard, FarmerAction } from "@/components/screens/agritech/premium/FarmerCards";
import { COLORS, SHADOWS, GRADIENTS } from "@/components/screens/agritech/premium/theme";
import {
  Satellite, ShoppingCart, CloudSun, ClipboardList, BarChart3, FileText,
  Bug, Droplets, Bell, Radio, Landmark, Brain, Wheat, MapPin, Plus, HelpCircle,
  Tractor, Camera, Users, AlertTriangle, ChevronRight, Search,
} from "lucide-react-native";

export default function DashboardScreen() {
  const router = useRouter();
  const { weather, weatherInsights, refreshAll } = useContext(LiveDataContext);
  const [refreshing, setRefreshing] = useState(false);

  const criticalAlerts = alerts.filter((a) => a.severity === "critical" || a.severity === "high");
  const avgNDVI = fields.reduce((s, f) => s + f.ndviScore, 0) / fields.length;
  const healthyFields = fields.filter((f) => f.healthStatus === "good" || f.healthStatus === "excellent").length;
  const liveTemp = weather?.current?.temperature;
  const liveCondition = weather?.current ? weatherCodeToCondition(weather.current.weatherCode).condition : null;

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAll();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface.raised }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary.from} />}
      >
        {/* Hero Header */}
        <LinearGradient
          colors={GRADIENTS.hero as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}
        >
          <SafeAreaView edges={["top"]} style={{ paddingTop: 0 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View>
                <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, fontFamily: "dm-sans-medium" }}>
                  Good Morning
                </Text>
                <Text style={{ color: "#fff", fontSize: 22, fontFamily: "dm-sans-bold", letterSpacing: -0.3, marginTop: 2 }}>
                  {userProfile.name}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Pressable onPress={() => router.push("/(tabs)/(dashboard)/notifications" as any)}>
                    <View style={{ position: "relative" }}>
                      <Bell size={20} color="rgba(255,255,255,0.8)" strokeWidth={1.8} />
                      <View style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: 7, backgroundColor: "#ef4444", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "#fff", fontSize: 8, fontFamily: "dm-sans-bold" }}>3</Text>
                      </View>
                    </View>
                  </Pressable>
                  <Pressable onPress={() => router.push("/(tabs)/(dashboard)/search" as any)}>
                    <Search size={20} color="rgba(255,255,255,0.8)" strokeWidth={1.8} />
                  </Pressable>
                </View>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "dm-sans-regular", marginTop: 4 }}>
                  {userProfile.farmName}
                </Text>
              </View>
            </View>

            {/* Search Bar */}
            <Pressable onPress={() => router.push("/(tabs)/(dashboard)/search" as any)}>
              <View style={{
                flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, marginTop: 16,
                borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
              }}>
                <Search size={16} color="rgba(255,255,255,0.5)" strokeWidth={1.8} />
                <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, fontFamily: "dm-sans-regular", marginLeft: 10 }}>
                  Search fields, alerts, crops...
                </Text>
              </View>
            </Pressable>
          </SafeAreaView>
        </LinearGradient>

        {/* Metrics Row */}
        <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 20, marginTop: -20 }}>
          <MetricPill label="Farm Area" value={userProfile.totalArea} unit="acres" color={COLORS.accent.blue} />
          <MetricPill label="Health" value={`${(avgNDVI * 100).toFixed(0)}%`} color={avgNDVI > 0.6 ? COLORS.status.excellent : COLORS.status.moderate} trend="up" />
          <MetricPill label="Temp" value={liveTemp !== undefined ? Math.round(liveTemp) : "--"} unit="\u00b0C" color={COLORS.status.poor} />
        </View>

        {/* Critical Alert Banner */}
        {criticalAlerts.length > 0 && (
          <Pressable onPress={() => router.push({ pathname: "/(tabs)/(dashboard)/alert-detail", params: { id: criticalAlerts[0].id } } as any)}>
            <View style={{ marginHorizontal: 20, marginTop: 16 }}>
              <LinearGradient
                colors={["#fef2f2", "#fee2e2"]}
                style={{ borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#fecaca" }}
              >
                <AlertTriangle size={18} color="#dc2626" strokeWidth={2} />
                <Text style={{ color: "#991b1b", fontSize: 13, fontFamily: "dm-sans-bold", marginLeft: 10, flex: 1 }}>
                  {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? "s" : ""} Need Attention
                </Text>
                <ChevronRight size={16} color="#dc2626" />
              </LinearGradient>
            </View>
          </Pressable>
        )}

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <SectionHeader title="Quick Actions" />
          <ActionGrid
            columns={4}
            items={[
              { label: "Satellite", icon: <Satellite size={18} color={COLORS.accent.violet} />, color: COLORS.accent.violet, onPress: () => router.push("/(tabs)/(dashboard)/satellite" as any) },
              { label: "Market", icon: <ShoppingCart size={18} color={COLORS.status.excellent} />, color: COLORS.status.excellent, onPress: () => router.push("/(tabs)/(dashboard)/market" as any) },
              { label: "Weather", icon: <CloudSun size={18} color={COLORS.accent.blue} />, color: COLORS.accent.blue, onPress: () => router.push("/(tabs)/(dashboard)/weather-detail" as any) },
              { label: "Planner", icon: <ClipboardList size={18} color={COLORS.accent.amber} />, color: COLORS.accent.amber, onPress: () => router.push("/(tabs)/(dashboard)/farm-planner" as any) },
              { label: "Analytics", icon: <BarChart3 size={18} color={COLORS.status.critical} />, color: COLORS.status.critical, onPress: () => router.push("/(tabs)/(dashboard)/analytics" as any) },
              { label: "Crop Doctor", icon: <Bug size={18} color={COLORS.accent.rose} />, color: COLORS.accent.rose, onPress: () => router.push("/(tabs)/(dashboard)/pest-encyclopedia" as any) },
              { label: "Irrigation", icon: <Droplets size={18} color={COLORS.accent.cyan} />, color: COLORS.accent.cyan, onPress: () => router.push("/(tabs)/(dashboard)/irrigation-control" as any) },
              { label: "Sensors", icon: <Radio size={18} color={COLORS.accent.teal} />, color: COLORS.accent.teal, onPress: () => router.push("/(tabs)/(dashboard)/sensors" as any) },
              { label: "Schemes", icon: <Landmark size={18} color={COLORS.accent.amber} />, color: COLORS.accent.amber, onPress: () => router.push("/(tabs)/(dashboard)/schemes" as any) },
              { label: "AI Advisor", icon: <Brain size={18} color={COLORS.accent.indigo} />, color: COLORS.accent.indigo, onPress: () => router.push("/(tabs)/(dashboard)/crop-advisor" as any) },
              { label: "Harvest", icon: <Wheat size={18} color="#ca8a04" />, color: "#ca8a04", onPress: () => router.push("/(tabs)/(dashboard)/harvest-tracker" as any) },
              { label: "Add Field", icon: <Plus size={18} color={COLORS.primary.from} />, color: COLORS.primary.from, onPress: () => router.push("/(tabs)/(dashboard)/add-field" as any) },
            ]}
          />
        </View>

        {/* Live Status */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <LiveStatusBar />
        </View>

        {/* Weather Widget */}
        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <SectionHeader title="Weather" action="Details" onAction={() => router.push("/(tabs)/(dashboard)/weather-detail" as any)} />
          <Pressable onPress={() => router.push("/(tabs)/(dashboard)/weather-detail" as any)}>
            <WeatherWidget />
          </Pressable>
        </View>

        {/* AI Insights */}
        {weatherInsights && (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <SectionHeader title="AI Farm Insights" icon={<Brain size={16} color={COLORS.accent.indigo} />} />
            <GlassCard>
              {[
                { label: "Spray Window", value: weatherInsights.sprayWindow.suitable ? "Suitable" : "Hold", detail: weatherInsights.sprayWindow.reason, color: weatherInsights.sprayWindow.suitable ? COLORS.status.excellent : COLORS.status.critical },
                { label: "Irrigation", value: weatherInsights.irrigationAdvice.action, detail: weatherInsights.irrigationAdvice.reason, color: COLORS.accent.blue },
                { label: "Disease Risk", value: weatherInsights.diseaseRisk.level.toUpperCase(), detail: weatherInsights.diseaseRisk.reason, color: weatherInsights.diseaseRisk.level === "high" ? COLORS.status.critical : weatherInsights.diseaseRisk.level === "medium" ? COLORS.status.moderate : COLORS.status.excellent },
              ].map((insight, i) => (
                <View
                  key={i}
                  style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: COLORS.surface.borderLight }}
                >
                  <View style={{ width: 4, height: 28, borderRadius: 2, backgroundColor: insight.color, marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ color: COLORS.text.primary, fontSize: 13, fontFamily: "dm-sans-bold" }}>{insight.label}</Text>
                      <Text style={{ color: insight.color, fontSize: 11, fontFamily: "dm-sans-bold" }}>{insight.value}</Text>
                    </View>
                    <Text style={{ color: COLORS.text.muted, fontSize: 11, fontFamily: "dm-sans-regular", marginTop: 2, lineHeight: 15 }} numberOfLines={2}>
                      {insight.detail}
                    </Text>
                  </View>
                </View>
              ))}
            </GlassCard>
          </View>
        )}

        {/* Farmer-Friendly Weather Advisory */}
        {weatherInsights && weather && (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <SectionHeader title="Today's Advisory" />
            <WeatherAdvisoryCard
              temperature={weather.current?.temperature ?? 30}
              humidity={weather.current?.humidity ?? 50}
              sprayOk={weatherInsights.sprayWindow.suitable}
              sprayReason={weatherInsights.sprayWindow.reason}
              diseaseRisk={weatherInsights.diseaseRisk.level}
              diseases={weatherInsights.diseaseRisk.diseases}
              irrigationAdvice={weatherInsights.irrigationAdvice.action.includes("Skip") ? "skip" : weatherInsights.irrigationAdvice.action.includes("Increase") ? "increase" : "normal"}
              rainNext3d={0}
            />
          </View>
        )}

        {/* Ideal Values Quick Reference */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <IdealValuesCard
            title="Ideal Values for Your Crops"
            values={[
              { parameter: "Soil pH", icon: "\ud83e\uddea", ideal: "6.0 - 7.5", current: "7.2", status: "good" },
              { parameter: "Soil Moisture", icon: "\ud83d\udca7", ideal: "25-45%", current: "20%", status: "warn" },
              { parameter: "NDVI Health", icon: "\ud83c\udf31", ideal: "> 0.6", current: avgNDVI.toFixed(2), status: avgNDVI > 0.6 ? "good" : avgNDVI > 0.4 ? "warn" : "bad" },
              { parameter: "Temperature", icon: "\ud83c\udf21\ufe0f", ideal: "20-35°C", current: `${liveTemp ?? "--"}°C`, status: (liveTemp ?? 30) > 35 ? "bad" : (liveTemp ?? 30) < 15 ? "bad" : "good" },
              { parameter: "Organic Carbon", icon: "\ud83c\udf3f", ideal: "> 0.5%", current: "0.65%", status: "good" },
              { parameter: "Wind (Spray)", icon: "\ud83d\udca8", ideal: "< 12 km/h", current: `${weather?.current?.windSpeed ?? "--"} km/h`, status: (weather?.current?.windSpeed ?? 10) < 12 ? "good" : "bad" },
            ]}
          />
        </View>

        {/* NDVI Map */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <SectionHeader
            title="Satellite Health"
            action="Full Analysis"
            onAction={() => router.push("/(tabs)/(dashboard)/satellite" as any)}
          />
          <NDVIMap
            onFieldPress={(fieldId) =>
              router.push({ pathname: "/(tabs)/(dashboard)/field-detail", params: { id: fieldId } } as any)
            }
          />
        </View>

        {/* Alerts */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <SectionHeader title="Active Alerts" badge={alerts.length} />
          {alerts.slice(0, 3).map((alert) => {
            const colorMap: Record<string, string> = { critical: "#dc2626", high: "#ea580c", medium: "#d97706", low: "#22c55e" };
            const color = colorMap[alert.severity] || "#6b7280";
            return (
              <Pressable
                key={alert.id}
                onPress={() => router.push({ pathname: "/(tabs)/(dashboard)/alert-detail", params: { id: alert.id } } as any)}
              >
                <GlassCard style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 4, height: "100%", minHeight: 40, borderRadius: 2, backgroundColor: color, position: "absolute", left: -16 }} />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <View style={{ backgroundColor: color + "15", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                          <Text style={{ color, fontSize: 9, fontFamily: "dm-sans-bold", textTransform: "uppercase" }}>{alert.severity}</Text>
                        </View>
                        <Text style={{ color: COLORS.text.muted, fontSize: 11 }}>{alert.fieldName}</Text>
                      </View>
                      <Text style={{ color: COLORS.text.primary, fontSize: 14, fontFamily: "dm-sans-bold", marginTop: 4 }} numberOfLines={1}>
                        {alert.title}
                      </Text>
                      <Text style={{ color: COLORS.text.muted, fontSize: 11, marginTop: 3, lineHeight: 15 }} numberOfLines={2}>
                        {alert.description}
                      </Text>
                    </View>
                    <ChevronRight size={16} color={COLORS.text.muted} style={{ marginLeft: 8 }} />
                  </View>
                </GlassCard>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
