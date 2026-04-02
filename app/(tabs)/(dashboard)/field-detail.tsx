import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fields, soilDataByField, getNDVIColor, getFieldHealthColor } from "@/data/agritech";
import { fieldDetails } from "@/data/market";
import SoilGauge from "@/components/screens/agritech/soil-gauge";
import { backendClient, CropHealthResponse, NDVIReadingResponse } from "@/services/backend-client";
import { connectNDVIWebSocket, NDVIProgressMessage } from "@/services/websocket-client";

export default function FieldDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const field = fields.find((f) => f.id === id) || fields[0];
  const soil = soilDataByField[field.id];
  const detail = fieldDetails[field.id];
  const healthColor = getFieldHealthColor(field.healthStatus);

  // Backend NDVI state
  const [backendNDVI, setBackendNDVI] = useState<CropHealthResponse | null>(null);
  const [ndviHistory, setNdviHistory] = useState<NDVIReadingResponse[]>([]);
  const [ndviLoading, setNdviLoading] = useState(false);
  const [ndviError, setNdviError] = useState<string | null>(null);

  useEffect(() => {
    fetchBackendData();
  }, [id]);

  async function fetchBackendData() {
    if (!id) return;
    setNdviLoading(true);
    try {
      // Try to get NDVI history from backend
      const history = await backendClient.getNDVIHistory(id);
      setNdviHistory(history);
      setNdviError(null);
    } catch {
      setNdviError("Backend unavailable - showing local data");
    }
    setNdviLoading(false);
  }

  // WebSocket progress state
  const [wsProgress, setWsProgress] = useState<NDVIProgressMessage | null>(null);
  const wsCleanup = useRef<(() => void) | null>(null);

  function triggerNDVIAnalysis() {
    if (!id) return;
    setNdviLoading(true);
    setNdviError(null);
    setWsProgress(null);

    // Clean up previous WebSocket
    wsCleanup.current?.();

    // Connect via WebSocket for real-time progress
    wsCleanup.current = connectNDVIWebSocket(
      id,
      (msg) => {
        setWsProgress(msg);
      },
      (error) => {
        // WebSocket failed, fall back to HTTP
        setWsProgress(null);
        triggerNDVIHTTP();
      },
      (result) => {
        if (result) {
          setBackendNDVI({
            field_id: id,
            field_name: field.name,
            crop: field.crop,
            ndvi_mean: result.ndvi_mean,
            health_score: result.health_score,
            health_status: result.health_status,
            source: result.source,
            satellite_date: result.satellite_date,
            growth_stage: result.growth_stage,
            recommendation: result.recommendation,
            ndvi_min: null,
            ndvi_max: null,
            irrigation_alert: null,
            days_after_sowing: null,
            expected_ndvi_range: null,
            deviation: null,
          });
        }
        setNdviLoading(false);
        setWsProgress(null);
        fetchBackendData(); // Refresh history
      },
    );
  }

  async function triggerNDVIHTTP() {
    if (!id) return;
    try {
      const result = await backendClient.triggerNDVI(id);
      setBackendNDVI(result);
      setNdviError(null);
    } catch (e: any) {
      setNdviError(e.message || "NDVI analysis failed");
    }
    setNdviLoading(false);
  }

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => { wsCleanup.current?.(); };
  }, []);
  const ndviColor = getNDVIColor(field.ndviScore);

  const totalExpenses = detail?.expenses.reduce((s, e) => s + e.amount, 0) || 0;
  const maxNDVI = Math.max(...(detail?.ndviHistory.map((h) => h.value) || [1]));

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{field.name}</Text>
          <Text className="text-typography-400 text-xs">{field.area} acres \u2022 {field.soilType}</Text>
        </View>
        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: healthColor + "15" }}
        >
          <Text className="text-xs font-dm-sans-bold capitalize" style={{ color: healthColor }}>
            {field.healthStatus}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Quick Stats Row */}
        <View className="flex-row px-5 py-4 gap-3">
          {[
            { label: "NDVI", value: field.ndviScore.toFixed(2), color: ndviColor, icon: "\ud83d\udef0\ufe0f" },
            { label: "Stage", value: detail?.growthStage || "N/A", color: "#3b82f6", icon: "\ud83c\udf31" },
            { label: "Harvest In", value: `${detail?.daysToHarvest || "?"}d`, color: "#f59e0b", icon: "\ud83d\udcc5" },
            { label: "Est. Yield", value: `${detail?.yieldEstimate || "?"}`, color: "#22c55e", icon: "\ud83d\udcca" },
          ].map((stat, i) => (
            <View
              key={i}
              className="flex-1 rounded-xl p-3 items-center"
              style={{ backgroundColor: stat.color + "10" }}
            >
              <Text style={{ fontSize: 18 }}>{stat.icon}</Text>
              <Text className="text-typography-500 text-xs mt-1">{stat.label}</Text>
              <Text className="font-dm-sans-bold text-xs mt-0.5" style={{ color: stat.color }} numberOfLines={1}>
                {stat.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Backend NDVI Analysis */}
        <View className="mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-typography-900 font-dm-sans-bold text-base">
                {"\ud83d\udef0\ufe0f"} Satellite NDVI Analysis
              </Text>
              <Text className="text-typography-400 text-xs">
                {backendNDVI ? `Source: ${backendNDVI.source} | ${backendNDVI.satellite_date}` : "Run live satellite analysis"}
              </Text>
            </View>
            <Pressable
              onPress={triggerNDVIAnalysis}
              disabled={ndviLoading}
              className="rounded-xl px-4 py-2"
              style={{ backgroundColor: ndviLoading ? "#d4d4d4" : "#16a34a" }}
            >
              {ndviLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white text-xs font-dm-sans-bold">
                  {backendNDVI ? "\u21bb Refresh" : "\u25b6\ufe0f Analyze"}
                </Text>
              )}
            </Pressable>
          </View>

          {/* WebSocket Progress Bar */}
          {wsProgress && ndviLoading && (
            <View className="mb-3">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-typography-700 text-xs font-dm-sans-medium">{wsProgress.detail}</Text>
                <Text className="text-green-600 text-xs font-dm-sans-bold">{wsProgress.progress}%</Text>
              </View>
              <View className="h-2 bg-background-200 rounded-full overflow-hidden">
                <View className="h-full rounded-full bg-green-500" style={{ width: `${wsProgress.progress}%` }} />
              </View>
              <Text className="text-typography-400 text-xs mt-1">Step: {wsProgress.step}</Text>
            </View>
          )}

          {backendNDVI && (
            <View>
              <View className="flex-row gap-2 mb-3">
                {[
                  { label: "NDVI", value: backendNDVI.ndvi_mean.toFixed(3), color: getNDVIColor(backendNDVI.ndvi_mean) },
                  { label: "Health", value: `${backendNDVI.health_score}/100`, color: backendNDVI.health_score >= 70 ? "#22c55e" : backendNDVI.health_score >= 50 ? "#f59e0b" : "#ef4444" },
                  { label: "Status", value: backendNDVI.health_status, color: getFieldHealthColor(backendNDVI.health_status as any) },
                ].map((item, i) => (
                  <View key={i} className="flex-1 rounded-xl p-3 items-center" style={{ backgroundColor: item.color + "10" }}>
                    <Text className="font-dm-sans-bold text-base" style={{ color: item.color }}>{item.value}</Text>
                    <Text className="text-typography-400 text-xs">{item.label}</Text>
                  </View>
                ))}
              </View>

              {backendNDVI.growth_stage && (
                <View className="bg-background-100 rounded-xl p-3 mb-2">
                  <Text className="text-typography-700 text-xs">
                    {"\ud83c\udf31"} Stage: {backendNDVI.growth_stage}
                    {backendNDVI.days_after_sowing !== null ? ` (Day ${backendNDVI.days_after_sowing})` : ""}
                  </Text>
                  {backendNDVI.expected_ndvi_range && (
                    <Text className="text-typography-500 text-xs mt-0.5">
                      Expected NDVI: {backendNDVI.expected_ndvi_range} | {backendNDVI.deviation}
                    </Text>
                  )}
                </View>
              )}

              {backendNDVI.recommendation && (
                <View className="bg-green-50 rounded-xl p-3 mb-2">
                  <Text className="text-green-700 text-xs">{"\ud83d\udca1"} {backendNDVI.recommendation}</Text>
                </View>
              )}

              {backendNDVI.irrigation_alert && (
                <View className="bg-red-50 rounded-xl p-3 border border-red-200">
                  <Text className="text-red-800 text-xs font-dm-sans-bold">
                    {"\ud83d\udca7"} {backendNDVI.irrigation_alert.title}
                  </Text>
                  <Text className="text-red-600 text-xs mt-1">{backendNDVI.irrigation_alert.description}</Text>
                  <Text className="text-red-700 text-xs mt-1 font-dm-sans-medium">{backendNDVI.irrigation_alert.action_required}</Text>
                </View>
              )}
            </View>
          )}

          {ndviError && !backendNDVI && (
            <View className="bg-yellow-50 rounded-xl p-3">
              <Text className="text-yellow-700 text-xs">{"\u26a0\ufe0f"} {ndviError}</Text>
            </View>
          )}

          {/* Backend NDVI History */}
          {ndviHistory.length > 0 && (
            <View className="mt-3 pt-3 border-t border-outline-100">
              <Text className="text-typography-700 text-xs font-dm-sans-bold mb-2">
                Backend History ({ndviHistory.length} readings)
              </Text>
              <View className="h-20 flex-row items-end">
                {ndviHistory.slice(-12).map((reading, i) => {
                  const color = getNDVIColor(reading.ndvi_mean);
                  return (
                    <View key={i} className="flex-1 items-center">
                      <Text style={{ fontSize: 7, color }}>{reading.ndvi_mean.toFixed(2)}</Text>
                      <View className="w-4 rounded-t-sm" style={{ height: `${reading.ndvi_mean * 100}%`, backgroundColor: color }} />
                      <Text className="text-typography-400" style={{ fontSize: 6 }}>
                        {new Date(reading.satellite_date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }).split(" ")[0]}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* NDVI History Chart */}
        {detail && (
          <View className="mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-1">
              NDVI Vegetation Index History
            </Text>
            <Text className="text-typography-400 text-xs font-dm-sans-regular mb-3">
              Satellite-tracked crop health progression
            </Text>

            {/* Chart */}
            <View className="h-40 flex-row items-end">
              {detail.ndviHistory.map((point, i) => {
                const height = (point.value / 1) * 100;
                const color = getNDVIColor(point.value);
                return (
                  <View key={i} className="flex-1 items-center">
                    <Text className="text-xs font-dm-sans-bold mb-1" style={{ color, fontSize: 9 }}>
                      {point.value.toFixed(2)}
                    </Text>
                    <View
                      className="w-6 rounded-t-lg"
                      style={{ height: `${height}%`, backgroundColor: color }}
                    />
                    <Text className="text-typography-400 text-xs mt-1" style={{ fontSize: 8 }}>
                      {point.date}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Trend Indicator */}
            <View className="flex-row items-center justify-center mt-2 bg-green-50 rounded-lg p-2">
              <Text style={{ fontSize: 14 }}>{"\ud83d\udcc8"}</Text>
              <Text className="text-green-700 text-xs font-dm-sans-medium ml-1">
                NDVI trending upward (+{((detail.ndviHistory[detail.ndviHistory.length - 1].value -
                  detail.ndviHistory[0].value) * 100).toFixed(0)}% since sowing)
              </Text>
            </View>
          </View>
        )}

        {/* Soil Analysis */}
        <View className="mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
            Soil Health Report
          </Text>
          <SoilGauge label="pH Level" value={soil.pH} unit="" min={4} max={10} optimalMin={6.0} optimalMax={7.5} color="#f59e0b" />
          <SoilGauge label="Nitrogen (N)" value={soil.nitrogen} unit="kg/ha" min={0} max={500} optimalMin={250} optimalMax={400} color="#3b82f6" />
          <SoilGauge label="Phosphorus (P)" value={soil.phosphorus} unit="kg/ha" min={0} max={60} optimalMin={20} optimalMax={45} color="#8b5cf6" />
          <SoilGauge label="Potassium (K)" value={soil.potassium} unit="kg/ha" min={0} max={400} optimalMin={150} optimalMax={300} color="#f97316" />
          <SoilGauge label="Moisture" value={soil.moisture} unit="%" min={0} max={100} optimalMin={30} optimalMax={50} color="#06b6d4" />
          <SoilGauge label="Organic Carbon" value={soil.organicCarbon} unit="%" min={0} max={2} optimalMin={0.5} optimalMax={1.5} color="#22c55e" />

          <View className="mt-3 pt-3 border-t border-outline-100">
            {soil.recommendations.map((rec, i) => (
              <Text key={i} className="text-typography-600 text-xs font-dm-sans-regular leading-5 mb-1">
                {"\u2022"} {rec}
              </Text>
            ))}
          </View>
        </View>

        {/* Water Usage */}
        {detail && (
          <View className="mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
              {"\ud83d\udca7"} Water Usage (Last 4 Weeks)
            </Text>
            <View className="h-28 flex-row items-end">
              {detail.waterUsage.map((w, i) => {
                const maxWater = Math.max(...detail.waterUsage.map((ww) => ww.liters));
                const height = (w.liters / maxWater) * 100;
                return (
                  <View key={i} className="flex-1 items-center">
                    <Text className="text-typography-600 text-xs font-dm-sans-bold mb-1" style={{ fontSize: 9 }}>
                      {(w.liters / 1000).toFixed(0)}K
                    </Text>
                    <View
                      className="w-10 rounded-t-lg"
                      style={{ height: `${height}%`, backgroundColor: "#3b82f680" }}
                    />
                    <Text className="text-typography-400 text-xs mt-1">{w.week}</Text>
                  </View>
                );
              })}
            </View>
            <Text className="text-typography-400 text-xs text-center mt-2">
              Total: {(detail.waterUsage.reduce((s, w) => s + w.liters, 0) / 1000).toFixed(0)}K liters
            </Text>
          </View>
        )}

        {/* Expenses */}
        {detail && (
          <View className="mx-5 bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-typography-900 font-dm-sans-bold text-base">
                {"\ud83d\udcb0"} Expenses Breakdown
              </Text>
              <Text className="text-typography-900 font-dm-sans-bold">
                {"\u20b9"}{(totalExpenses / 1000).toFixed(1)}K
              </Text>
            </View>
            {detail.expenses.map((exp, i) => {
              const pct = (exp.amount / totalExpenses) * 100;
              const colors = ["#3b82f6", "#22c55e", "#ef4444", "#06b6d4", "#f59e0b", "#8b5cf6"];
              const color = colors[i % colors.length];
              return (
                <View key={i} className="mb-2">
                  <View className="flex-row justify-between mb-0.5">
                    <Text className="text-typography-700 text-xs font-dm-sans-medium">{exp.category}</Text>
                    <Text className="text-typography-500 text-xs">
                      {"\u20b9"}{exp.amount.toLocaleString()} ({pct.toFixed(0)}%)
                    </Text>
                  </View>
                  <View className="h-2 bg-background-200 rounded-full overflow-hidden">
                    <View className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Field Notes */}
        {detail && (
          <View className="mx-5 bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
            <Text className="text-yellow-800 font-dm-sans-bold text-sm mb-2">
              {"\ud83d\udcdd"} Field Notes
            </Text>
            {detail.notes.map((note, i) => (
              <Text key={i} className="text-yellow-700 text-xs font-dm-sans-regular leading-5 mb-1">
                {"\u2022"} {note}
              </Text>
            ))}
          </View>
        )}

        {/* Crop Info Footer */}
        <View className="mx-5 mt-4 bg-background-50 rounded-2xl p-4 border border-outline-100">
          <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">Crop Details</Text>
          <View className="flex-row flex-wrap">
            {[
              { label: "Crop", value: field.crop },
              { label: "Sowing Date", value: new Date(field.sowingDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) },
              { label: "Expected Harvest", value: new Date(field.expectedHarvest).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) },
              { label: "Irrigation", value: field.irrigationType },
              { label: "Soil Type", value: field.soilType },
              { label: "Area", value: `${field.area} acres` },
            ].map((item, i) => (
              <View key={i} className="w-1/2 py-1.5">
                <Text className="text-typography-400 text-xs">{item.label}</Text>
                <Text className="text-typography-800 text-xs font-dm-sans-medium">{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
