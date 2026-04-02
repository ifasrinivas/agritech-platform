import React, { useContext, useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { LiveDataContext } from "@/contexts/live-data-context";
import { backendClient } from "@/services/backend-client";
import { COLORS, RADIUS } from "@/components/screens/agritech/premium/theme";
import { CloudSun, Satellite, Server, RefreshCw } from "lucide-react-native";

interface LiveStatusBarProps {
  compact?: boolean;
}

export default function LiveStatusBar({ compact = false }: LiveStatusBarProps) {
  const { apiStatus, weatherLastUpdated, satelliteLastUpdated, refreshAll, weatherLoading, satelliteLoading, soilLoading } = useContext(LiveDataContext);
  const [backendStatus, setBackendStatus] = useState<"connected" | "error" | "loading">("loading");

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 60000);
    return () => clearInterval(interval);
  }, []);

  async function checkBackend() {
    setBackendStatus("loading");
    const ok = await backendClient.isAvailable();
    setBackendStatus(ok ? "connected" : "error");
  }

  const isAnyLoading = weatherLoading || satelliteLoading || soilLoading;
  const allConnected = apiStatus.weather === "connected" && backendStatus === "connected";

  const formatTime = (date: Date | null) => {
    if (!date) return "--";
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return "Now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    return `${Math.floor(diff / 3600)}h`;
  };

  if (compact) {
    return (
      <Pressable onPress={refreshAll}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: allConnected ? COLORS.status.excellent : COLORS.status.moderate, marginRight: 5 }} />
          <Text style={{ color: COLORS.text.muted, fontSize: 11 }}>{isAnyLoading ? "Syncing..." : allConnected ? "Live" : "Offline"}</Text>
        </View>
      </Pressable>
    );
  }

  const services = [
    { label: "Weather", status: apiStatus.weather, updated: weatherLastUpdated, icon: <CloudSun size={14} color={apiStatus.weather === "connected" ? COLORS.status.excellent : COLORS.text.muted} /> },
    { label: "Satellite", status: apiStatus.satellite, updated: satelliteLastUpdated, icon: <Satellite size={14} color={apiStatus.satellite === "connected" ? COLORS.status.excellent : COLORS.text.muted} /> },
    { label: "Backend", status: backendStatus, updated: null, icon: <Server size={14} color={backendStatus === "connected" ? COLORS.status.excellent : COLORS.text.muted} /> },
  ];

  return (
    <View
      style={{
        backgroundColor: COLORS.surface.base,
        borderRadius: RADIUS.lg,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.surface.borderLight,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {services.map((s, i) => {
            const color = s.status === "connected" ? COLORS.status.excellent : s.status === "loading" ? COLORS.status.moderate : COLORS.status.critical;
            return (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                {s.icon}
                <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: color }} />
                <Text style={{ color: COLORS.text.muted, fontSize: 10, fontFamily: "dm-sans-medium" }}>
                  {s.updated ? formatTime(s.updated) : s.status === "connected" ? "OK" : "..."}
                </Text>
              </View>
            );
          })}
        </View>
        <Pressable onPress={refreshAll} style={{ padding: 4 }}>
          <RefreshCw size={14} color={COLORS.text.muted} />
        </Pressable>
      </View>
    </View>
  );
}
