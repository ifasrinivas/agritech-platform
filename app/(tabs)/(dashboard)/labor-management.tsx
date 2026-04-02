import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type LaborTab = "roster" | "attendance" | "payroll" | "tasks";

interface Worker {
  id: string;
  name: string;
  role: string;
  type: "permanent" | "seasonal" | "contract";
  phone: string;
  dailyWage: number;
  daysWorked: number;
  totalDays: number;
  skills: string[];
  present: boolean;
  assignedField: string;
}

const workers: Worker[] = [
  { id: "w1", name: "Ramesh Jadhav", role: "Field Supervisor", type: "permanent", phone: "+91 98XXX XXXXX", dailyWage: 500, daysWorked: 24, totalDays: 26, skills: ["Spraying", "Irrigation", "Supervision"], present: true, assignedField: "North Block" },
  { id: "w2", name: "Sunita Pawar", role: "Greenhouse Operator", type: "permanent", phone: "+91 97XXX XXXXX", dailyWage: 450, daysWorked: 25, totalDays: 26, skills: ["Fertigation", "Pruning", "Harvesting"], present: true, assignedField: "Greenhouse" },
  { id: "w3", name: "Ganesh More", role: "Tractor Operator", type: "permanent", phone: "+91 96XXX XXXXX", dailyWage: 550, daysWorked: 22, totalDays: 26, skills: ["Tractor", "Rotavator", "Sprayer"], present: false, assignedField: "All Fields" },
  { id: "w4", name: "Priya Bhosale", role: "Field Worker", type: "permanent", phone: "+91 95XXX XXXXX", dailyWage: 350, daysWorked: 26, totalDays: 26, skills: ["Weeding", "Harvesting", "Staking"], present: true, assignedField: "South Block" },
  { id: "w5", name: "Anil Shinde", role: "Irrigation Tech", type: "permanent", phone: "+91 94XXX XXXXX", dailyWage: 500, daysWorked: 23, totalDays: 26, skills: ["Drip Repair", "Plumbing", "Sensor Install"], present: true, assignedField: "All Fields" },
  { id: "w6", name: "Manjula Kale", role: "Harvest Worker", type: "seasonal", phone: "+91 93XXX XXXXX", dailyWage: 400, daysWorked: 12, totalDays: 15, skills: ["Grape Picking", "Grading", "Packing"], present: true, assignedField: "West Orchard" },
  { id: "w7", name: "Santosh Gaikwad", role: "Harvest Worker", type: "seasonal", phone: "+91 92XXX XXXXX", dailyWage: 400, daysWorked: 12, totalDays: 15, skills: ["Grape Picking", "Loading"], present: true, assignedField: "West Orchard" },
  { id: "w8", name: "Rekha Patil", role: "Weeding Worker", type: "seasonal", phone: "+91 91XXX XXXXX", dailyWage: 350, daysWorked: 10, totalDays: 15, skills: ["Weeding", "Transplanting"], present: false, assignedField: "Central Block" },
];

const taskAssignments = [
  { task: "Tomato Staking", field: "South Block", workers: ["Priya B.", "2 seasonal"], deadline: "Apr 6", status: "in-progress", progress: 60 },
  { task: "Grape Harvest", field: "West Orchard", workers: ["Manjula K.", "Santosh G.", "4 casual"], deadline: "Apr 15", status: "upcoming", progress: 0 },
  { task: "Sprayer Maintenance", field: "Workshop", workers: ["Ganesh M."], deadline: "Apr 3", status: "in-progress", progress: 80 },
  { task: "Drip Line Cleaning", field: "All Drip Fields", workers: ["Anil S.", "1 helper"], deadline: "Apr 10", status: "upcoming", progress: 0 },
  { task: "Onion Pest Scouting", field: "Central Block", workers: ["Ramesh J."], deadline: "Apr 5", status: "in-progress", progress: 40 },
  { task: "Capsicum Micronutrient Spray", field: "Greenhouse", workers: ["Sunita P."], deadline: "Apr 9", status: "upcoming", progress: 0 },
];

export default function LaborManagementScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LaborTab>("roster");

  const totalPermanent = workers.filter((w) => w.type === "permanent").length;
  const totalSeasonal = workers.filter((w) => w.type === "seasonal").length;
  const presentToday = workers.filter((w) => w.present).length;
  const totalPayroll = workers.reduce((s, w) => s + w.dailyWage * w.daysWorked, 0);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\udc77"} Labor Management</Text>
          <Text className="text-typography-400 text-xs">Roster, attendance & payroll</Text>
        </View>
        <Pressable className="bg-green-500 rounded-lg px-3 py-1.5">
          <Text className="text-white text-xs font-dm-sans-bold">+ Worker</Text>
        </Pressable>
      </View>

      {/* Summary */}
      <View className="flex-row mx-5 mt-3 gap-2 mb-3">
        <View className="flex-1 bg-blue-50 rounded-xl p-2.5 items-center border border-blue-200">
          <Text className="text-blue-800 text-lg font-dm-sans-bold">{totalPermanent}</Text>
          <Text className="text-blue-600 text-xs">Permanent</Text>
        </View>
        <View className="flex-1 bg-yellow-50 rounded-xl p-2.5 items-center border border-yellow-200">
          <Text className="text-yellow-800 text-lg font-dm-sans-bold">{totalSeasonal}</Text>
          <Text className="text-yellow-600 text-xs">Seasonal</Text>
        </View>
        <View className="flex-1 bg-green-50 rounded-xl p-2.5 items-center border border-green-200">
          <Text className="text-green-800 text-lg font-dm-sans-bold">{presentToday}/{workers.length}</Text>
          <Text className="text-green-600 text-xs">Present</Text>
        </View>
        <View className="flex-1 bg-purple-50 rounded-xl p-2.5 items-center border border-purple-200">
          <Text className="text-purple-800 text-sm font-dm-sans-bold">{"\u20b9"}{(totalPayroll/1000).toFixed(0)}K</Text>
          <Text className="text-purple-600 text-xs">Payroll</Text>
        </View>
      </View>

      <View className="flex-row mx-5 mb-3 bg-background-100 rounded-xl p-1">
        {(["roster", "attendance", "payroll", "tasks"] as LaborTab[]).map((t) => (
          <Pressable key={t} className="flex-1 items-center py-2 rounded-lg" style={activeTab === t ? { backgroundColor: "#16a34a" } : {}} onPress={() => setActiveTab(t)}>
            <Text className={`text-xs font-dm-sans-medium capitalize ${activeTab === t ? "text-white" : "text-typography-500"}`}>
              {t === "roster" ? "\ud83d\udc65 Roster" : t === "attendance" ? "\u2705 Today" : t === "payroll" ? "\ud83d\udcb0 Payroll" : "\ud83d\udccb Tasks"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "roster" && (
          <View className="px-5">
            {workers.map((worker) => (
              <View key={worker.id} className="bg-background-50 rounded-2xl p-4 mb-2 border border-outline-100">
                <View className="flex-row items-center">
                  <View className="w-11 h-11 rounded-full bg-background-100 items-center justify-center">
                    <Text style={{ fontSize: 22 }}>{worker.type === "permanent" ? "\ud83d\udc68\u200d\ud83c\udf3e" : "\ud83d\udc77"}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{worker.name}</Text>
                      <View className={`w-2 h-2 rounded-full ml-2 ${worker.present ? "bg-green-500" : "bg-gray-300"}`} />
                    </View>
                    <Text className="text-typography-500 text-xs">{worker.role} \u2022 {worker.assignedField}</Text>
                    <View className="flex-row flex-wrap gap-1 mt-1">
                      {worker.skills.slice(0, 3).map((skill, i) => (
                        <View key={i} className="bg-background-100 rounded-full px-2 py-0.5">
                          <Text className="text-typography-500" style={{ fontSize: 9 }}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View className="items-end">
                    <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: worker.type === "permanent" ? "#3b82f615" : "#f59e0b15" }}>
                      <Text className="text-xs font-dm-sans-medium capitalize" style={{ color: worker.type === "permanent" ? "#3b82f6" : "#f59e0b" }}>
                        {worker.type}
                      </Text>
                    </View>
                    <Text className="text-typography-400 text-xs mt-1">{"\u20b9"}{worker.dailyWage}/day</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "attendance" && (
          <View className="px-5">
            <Text className="text-typography-700 font-dm-sans-bold text-sm mb-2">Today - April 2, 2026</Text>
            {workers.map((worker) => (
              <View key={worker.id} className="flex-row items-center py-3 border-b border-outline-50">
                <View className={`w-8 h-8 rounded-full items-center justify-center ${worker.present ? "bg-green-100" : "bg-red-50"}`}>
                  <Text style={{ fontSize: 14 }}>{worker.present ? "\u2705" : "\u274c"}</Text>
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-typography-800 text-sm font-dm-sans-medium">{worker.name}</Text>
                  <Text className="text-typography-400 text-xs">{worker.role}</Text>
                </View>
                <View className="items-end">
                  <Text className={`text-xs font-dm-sans-bold ${worker.present ? "text-green-600" : "text-red-500"}`}>
                    {worker.present ? "Present" : "Absent"}
                  </Text>
                  <Text className="text-typography-400 text-xs">{worker.present ? "7:00 AM" : ""}</Text>
                </View>
              </View>
            ))}

            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mt-4">
              <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">Monthly Summary (April)</Text>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-green-50 rounded-lg p-2 items-center">
                  <Text className="text-green-800 font-dm-sans-bold">24</Text>
                  <Text className="text-green-600 text-xs">Working Days</Text>
                </View>
                <View className="flex-1 bg-red-50 rounded-lg p-2 items-center">
                  <Text className="text-red-800 font-dm-sans-bold">4</Text>
                  <Text className="text-red-600 text-xs">Sundays</Text>
                </View>
                <View className="flex-1 bg-yellow-50 rounded-lg p-2 items-center">
                  <Text className="text-yellow-800 font-dm-sans-bold">2</Text>
                  <Text className="text-yellow-600 text-xs">Holidays</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === "payroll" && (
          <View className="px-5">
            <View className="bg-purple-50 rounded-2xl p-4 border border-purple-200 mb-4">
              <Text className="text-purple-800 font-dm-sans-bold text-base">March 2026 Payroll</Text>
              <Text className="text-purple-800 text-2xl font-dm-sans-bold mt-1">{"\u20b9"}{totalPayroll.toLocaleString()}</Text>
              <Text className="text-purple-600 text-xs">For {workers.length} workers \u2022 Status: Pending</Text>
            </View>

            {workers.map((worker) => {
              const earned = worker.dailyWage * worker.daysWorked;
              const attendance = ((worker.daysWorked / worker.totalDays) * 100).toFixed(0) as string;
              return (
                <View key={worker.id} className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-typography-900 text-sm font-dm-sans-bold">{worker.name}</Text>
                    <Text className="text-typography-900 font-dm-sans-bold">{"\u20b9"}{earned.toLocaleString()}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-typography-400 text-xs">{worker.daysWorked}/{worker.totalDays} days \u2022 {attendance}% attendance \u2022 {"\u20b9"}{worker.dailyWage}/day</Text>
                  </View>
                  <View className="h-1.5 bg-background-200 rounded-full overflow-hidden mt-2">
                    <View className="h-full rounded-full bg-purple-400" style={{ width: `${attendance}%` as any }} />
                  </View>
                </View>
              );
            })}

            <Pressable className="bg-purple-500 rounded-xl py-3.5 items-center mt-3">
              <Text className="text-white font-dm-sans-bold text-sm">Process Payroll {"\u2192"}</Text>
            </Pressable>
          </View>
        )}

        {activeTab === "tasks" && (
          <View className="px-5">
            {taskAssignments.map((task, i) => {
              const statusColors: Record<string, string> = { "in-progress": "#3b82f6", upcoming: "#f59e0b", completed: "#22c55e" };
              const color = statusColors[task.status] || "#6b7280";
              return (
                <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{task.task}</Text>
                    <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: color + "15" }}>
                      <Text className="text-xs font-dm-sans-medium capitalize" style={{ color }}>{task.status}</Text>
                    </View>
                  </View>
                  <Text className="text-typography-500 text-xs">{"\ud83d\udccd"} {task.field} \u2022 Due: {task.deadline}</Text>
                  <Text className="text-typography-500 text-xs mt-0.5">{"\ud83d\udc65"} {task.workers.join(", ")}</Text>
                  {task.progress > 0 && (
                    <View className="mt-2">
                      <View className="flex-row justify-between mb-0.5">
                        <Text className="text-typography-400 text-xs">Progress</Text>
                        <Text className="text-xs font-dm-sans-bold" style={{ color }}>{task.progress}%</Text>
                      </View>
                      <View className="h-2 bg-background-200 rounded-full overflow-hidden">
                        <View className="h-full rounded-full" style={{ width: `${task.progress}%`, backgroundColor: color }} />
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
