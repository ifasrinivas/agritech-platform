import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

interface Task {
  id: string;
  title: string;
  field: string;
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  dueTime?: string;
  assignee: string;
  done: boolean;
  icon: string;
  notes?: string;
}

const priorityColors: Record<string, string> = { critical: "#dc2626", high: "#f97316", medium: "#eab308", low: "#22c55e" };

export default function DailyTasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([
    { id: "t1", title: "Apply Mancozeb spray - Tomato (Late Blight prevention)", field: "South Block", priority: "critical", category: "Spray", dueTime: "Before 10 AM", assignee: "Ramesh J.", done: false, icon: "\ud83d\udca8", notes: "2.5g/L, 500L/acre. Must spray before Saturday rain." },
    { id: "t2", title: "Scout for thrips - Onion (ETL crossed yesterday)", field: "Central Block", priority: "critical", category: "Scouting", dueTime: "Morning", assignee: "Ramesh J.", done: false, icon: "\ud83d\udc1b", notes: "Check NE corner especially. Blue sticky traps need replacement." },
    { id: "t3", title: "Continue tomato staking (rows 25-40)", field: "South Block", priority: "high", category: "Field Work", dueTime: "All day", assignee: "Priya B. + 2 seasonal", done: false, icon: "\ud83c\udf3f" },
    { id: "t4", title: "Drip fertigation - Capsicum (19:19:19 @ 5g/L)", field: "Greenhouse", priority: "high", category: "Fertigation", dueTime: "6:00 AM - 9:00 AM", assignee: "Sunita P.", done: true, icon: "\ud83d\udca7" },
    { id: "t5", title: "Check grape Brix level (harvest readiness)", field: "West Orchard", priority: "medium", category: "Quality Check", dueTime: "Morning", assignee: "Rajesh Kumar", done: false, icon: "\ud83c\udf47", notes: "Target Brix > 18. Check 10 vines across block." },
    { id: "t6", title: "Apply Urea top-dressing - Onion (N deficiency)", field: "Central Block", priority: "high", category: "Fertilizer", dueTime: "Evening", assignee: "Ganesh M.", done: false, icon: "\ud83e\udea4", notes: "50 kg/acre. Irrigate within 24 hours after application." },
    { id: "t7", title: "Clean drip screen filters (monthly)", field: "All Drip Fields", priority: "medium", category: "Maintenance", dueTime: "Afternoon", assignee: "Anil S.", done: false, icon: "\ud83d\udd27" },
    { id: "t8", title: "Download satellite NDVI update", field: "All Fields", priority: "low", category: "Data", dueTime: "Auto", assignee: "System", done: true, icon: "\ud83d\udef0\ufe0f" },
    { id: "t9", title: "Order Neem Oil (stock low - 4L remaining)", field: "Farm Office", priority: "medium", category: "Procurement", dueTime: "Today", assignee: "Rajesh Kumar", done: false, icon: "\ud83d\uded2", notes: "Need 10L. Check price at Bio Agri Solutions." },
    { id: "t10", title: "Rice paddy water level check & adjust", field: "East Block", priority: "medium", category: "Irrigation", dueTime: "Morning", assignee: "Anil S.", done: true, icon: "\ud83d\udca7" },
    { id: "t11", title: "Arrange transport for grape harvest (Apr 5)", field: "West Orchard", priority: "medium", category: "Logistics", dueTime: "By EOD", assignee: "Rajesh Kumar", done: false, icon: "\ud83d\ude9a", notes: "Contact cold chain transporter. Reefer truck needed." },
    { id: "t12", title: "Update soil moisture sensor (South Block offline)", field: "South Block", priority: "low", category: "IoT", dueTime: "When available", assignee: "Anil S.", done: false, icon: "\ud83d\udce1" },
  ]);

  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  const filtered = filter === "all" ? tasks : filter === "pending" ? tasks.filter((t) => !t.done) : tasks.filter((t) => t.done);
  const doneCount = tasks.filter((t) => t.done).length;
  const criticalPending = tasks.filter((t) => !t.done && (t.priority === "critical" || t.priority === "high")).length;

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\u2611\ufe0f"} Today's Tasks</Text>
          <Text className="text-typography-400 text-xs">Wednesday, April 2, 2026</Text>
        </View>
        <Pressable className="bg-green-500 rounded-lg px-3 py-1.5">
          <Text className="text-white text-xs font-dm-sans-bold">+ Task</Text>
        </Pressable>
      </View>

      {/* Progress */}
      <View className="mx-5 mt-3 mb-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-typography-700 text-sm font-dm-sans-medium">
            {doneCount}/{tasks.length} completed
          </Text>
          {criticalPending > 0 && (
            <Text className="text-red-600 text-xs font-dm-sans-bold">
              {"\u26a0\ufe0f"} {criticalPending} urgent pending
            </Text>
          )}
        </View>
        <View className="h-3 bg-background-200 rounded-full overflow-hidden">
          <View className="h-full rounded-full bg-green-500" style={{ width: `${(doneCount / tasks.length) * 100}%` }} />
        </View>
      </View>

      {/* Filter */}
      <View className="flex-row mx-5 mb-3 gap-2">
        {(["all", "pending", "done"] as const).map((f) => (
          <Pressable key={f} className="rounded-xl px-4 py-2" style={filter === f ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }} onPress={() => setFilter(f)}>
            <Text className={`text-xs font-dm-sans-medium capitalize ${filter === f ? "text-white" : "text-typography-500"}`}>
              {f === "all" ? `All (${tasks.length})` : f === "pending" ? `Pending (${tasks.length - doneCount})` : `Done (${doneCount})`}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="px-5">
          {filtered.map((task) => {
            const color = priorityColors[task.priority];
            return (
              <Pressable key={task.id} onPress={() => toggleTask(task.id)}>
                <View
                  className="rounded-2xl p-4 mb-2 border"
                  style={{
                    backgroundColor: task.done ? "#fafafa" : color + "04",
                    borderColor: task.done ? "#e5e7eb" : color + "20",
                    opacity: task.done ? 0.7 : 1,
                  }}
                >
                  <View className="flex-row items-start">
                    {/* Checkbox */}
                    <View
                      className="w-6 h-6 rounded-lg items-center justify-center mt-0.5 border-2"
                      style={{
                        borderColor: task.done ? "#22c55e" : color,
                        backgroundColor: task.done ? "#22c55e" : "transparent",
                      }}
                    >
                      {task.done && <Text className="text-white text-xs font-dm-sans-bold">{"\u2713"}</Text>}
                    </View>

                    <View className="flex-1 ml-3">
                      <Text
                        className={`text-sm font-dm-sans-medium ${task.done ? "text-typography-400 line-through" : "text-typography-900"}`}
                        numberOfLines={2}
                      >
                        {task.icon} {task.title}
                      </Text>

                      <View className="flex-row items-center mt-1 flex-wrap gap-1">
                        <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: color + "15" }}>
                          <Text className="capitalize font-dm-sans-medium" style={{ fontSize: 9, color }}>{task.priority}</Text>
                        </View>
                        <Text className="text-typography-400 text-xs">{task.field}</Text>
                        {task.dueTime && <Text className="text-typography-400 text-xs">{"\u2022"} {task.dueTime}</Text>}
                        <Text className="text-typography-400 text-xs">{"\u2022"} {task.assignee}</Text>
                      </View>

                      {task.notes && !task.done && (
                        <View className="bg-background-100 rounded-lg p-2 mt-2">
                          <Text className="text-typography-500 text-xs">{"\ud83d\udcdd"} {task.notes}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* AI Suggestions */}
        <View className="mx-5 mt-4 bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <Text className="text-blue-800 font-dm-sans-bold text-sm mb-2">{"\ud83e\udde0"} AI-Suggested Tasks for Tomorrow</Text>
          {[
            "Thu: Continue tomato staking (expected completion 60% \u2192 85%)",
            "Thu: Grape harvest preparation - check boxes, SO\u2082 pads, labels",
            "Thu: Verify Mancozeb spray effectiveness (24hr post-spray check)",
            "Fri: Pre-rain preparation - clear drainage channels in all fields",
            "Fri: Final Neem Oil spray before rain (organic fields only)",
          ].map((s, i) => (
            <Text key={i} className="text-blue-700 text-xs leading-5">{"\u2022"} {s}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
