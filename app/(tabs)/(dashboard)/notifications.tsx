import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { alerts, getAlertColor } from "@/data/agritech";

type NotifFilter = "all" | "unread" | "critical";

interface Notification {
  id: string;
  type: "alert" | "system" | "market" | "weather" | "task" | "community";
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  icon: string;
  color: string;
  actionLabel?: string;
}

const notifications: Notification[] = [
  {
    id: "n1", type: "alert", title: "Fall Armyworm Detected",
    body: "High probability of Fall Armyworm infestation in North Block. Immediate scouting recommended.",
    timestamp: "2026-04-02T06:30:00Z", read: false, icon: "\ud83d\udc1b", color: "#ef4444", actionLabel: "View Alert",
  },
  {
    id: "n2", type: "weather", title: "Heavy Rainfall Warning",
    body: "IMD advisory: Heavy to very heavy rainfall expected Sat-Sun. Prepare drainage channels.",
    timestamp: "2026-04-02T05:00:00Z", read: false, icon: "\u26c8\ufe0f", color: "#3b82f6", actionLabel: "View Forecast",
  },
  {
    id: "n3", type: "alert", title: "Late Blight Risk - 78%",
    body: "Weather conditions favor Late Blight in Tomato. Preventive Mancozeb spray recommended.",
    timestamp: "2026-04-02T08:00:00Z", read: false, icon: "\ud83e\uddec", color: "#f59e0b", actionLabel: "View Advisory",
  },
  {
    id: "n4", type: "task", title: "Upcoming: Grape Harvest",
    body: "Grape harvest scheduled Apr 5-15. Brix level at 19.2 (ready). Arrange transport.",
    timestamp: "2026-04-01T18:00:00Z", read: true, icon: "\ud83c\udf47", color: "#8b5cf6",
  },
  {
    id: "n5", type: "market", title: "Onion Prices Up +12.4%",
    body: "Lasalgaon APMC: Onion modal price \u20b92,600/qtl. Strong export demand driving prices.",
    timestamp: "2026-04-01T16:00:00Z", read: true, icon: "\ud83d\udcb9", color: "#22c55e", actionLabel: "View Market",
  },
  {
    id: "n6", type: "system", title: "Satellite Data Updated",
    body: "New Sentinel-2 imagery processed. NDVI maps updated for all 6 fields. 2 anomalies detected.",
    timestamp: "2026-04-01T14:00:00Z", read: true, icon: "\ud83d\udef0\ufe0f", color: "#06b6d4",
  },
  {
    id: "n7", type: "alert", title: "Nitrogen Deficiency - Onion",
    body: "NDVI dropped 0.15 in Central Block. Spectral analysis confirms nitrogen deficiency.",
    timestamp: "2026-04-01T12:00:00Z", read: true, icon: "\ud83c\udf3f", color: "#f59e0b", actionLabel: "View Details",
  },
  {
    id: "n8", type: "system", title: "Soil Sensor Offline",
    body: "Sensor in South Block stopped reporting 6 hours ago. Check battery or connectivity.",
    timestamp: "2026-04-01T10:00:00Z", read: true, icon: "\ud83d\udce1", color: "#ef4444",
  },
  {
    id: "n9", type: "community", title: "New Buyer Enquiry - Grapes",
    body: "APMC agent from Mumbai enquired about Thompson Seedless. Export quality, 50 qtl lot.",
    timestamp: "2026-03-31T15:00:00Z", read: true, icon: "\ud83e\udd1d", color: "#22c55e", actionLabel: "Respond",
  },
  {
    id: "n10", type: "task", title: "Reminder: Micronutrient Spray",
    body: "Capsicum micronutrient spray (Calcium Boron) due Apr 8-9. Evening application preferred.",
    timestamp: "2026-03-31T08:00:00Z", read: true, icon: "\ud83d\udcc5", color: "#3b82f6",
  },
  {
    id: "n11", type: "market", title: "Tomato Prices Dropping",
    body: "Tomato prices down 8.5%. Peak arrivals expected next 2 weeks. Consider early harvest.",
    timestamp: "2026-03-30T16:00:00Z", read: true, icon: "\ud83d\udcc9", color: "#ef4444",
  },
  {
    id: "n12", type: "weather", title: "High UV Advisory",
    body: "UV Index 9 (Very High) expected tomorrow. Avoid midday spraying. Workers need protection.",
    timestamp: "2026-03-30T18:00:00Z", read: true, icon: "\u2600\ufe0f", color: "#f59e0b",
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<NotifFilter>("all");

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "critical") return n.type === "alert" && !n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\ud83d\udd14"} Notifications
          </Text>
          <Text className="text-typography-400 text-xs">{unreadCount} unread</Text>
        </View>
        <Pressable>
          <Text className="text-green-600 text-xs font-dm-sans-bold">Mark all read</Text>
        </Pressable>
      </View>

      {/* Filter */}
      <View className="flex-row mx-5 mt-3 mb-3 gap-2">
        {([
          { key: "all" as NotifFilter, label: "All", count: notifications.length },
          { key: "unread" as NotifFilter, label: "Unread", count: unreadCount },
          { key: "critical" as NotifFilter, label: "Critical", count: notifications.filter(n => n.type === "alert" && !n.read).length },
        ]).map((tab) => (
          <Pressable
            key={tab.key}
            className="rounded-xl px-4 py-2"
            style={filter === tab.key ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }}
            onPress={() => setFilter(tab.key)}
          >
            <Text className={`text-xs font-dm-sans-medium ${filter === tab.key ? "text-white" : "text-typography-500"}`}>
              {tab.label} ({tab.count})
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="px-5">
          {filtered.map((notif) => (
            <Pressable key={notif.id}>
              <View
                className="rounded-2xl p-4 mb-2"
                style={{
                  backgroundColor: notif.read ? "#fafafa" : notif.color + "06",
                  borderWidth: notif.read ? 1 : 1.5,
                  borderColor: notif.read ? "#f3f4f6" : notif.color + "25",
                }}
              >
                <View className="flex-row items-start">
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center"
                    style={{ backgroundColor: notif.color + "15" }}
                  >
                    <Text style={{ fontSize: 18 }}>{notif.icon}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center">
                      <Text
                        className={`text-sm flex-1 ${!notif.read ? "font-dm-sans-bold text-typography-900" : "font-dm-sans-medium text-typography-700"}`}
                        numberOfLines={1}
                      >
                        {notif.title}
                      </Text>
                      {!notif.read && (
                        <View className="w-2 h-2 rounded-full ml-2" style={{ backgroundColor: notif.color }} />
                      )}
                    </View>
                    <Text className="text-typography-500 text-xs font-dm-sans-regular mt-1 leading-4">
                      {notif.body}
                    </Text>
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-typography-400 text-xs">
                        {new Date(notif.timestamp).toLocaleDateString("en-IN", {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </Text>
                      {notif.actionLabel && (
                        <Text className="text-xs font-dm-sans-bold" style={{ color: notif.color }}>
                          {notif.actionLabel} {"\u203a"}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
