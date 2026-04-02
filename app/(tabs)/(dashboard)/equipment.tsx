import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type EquipTab = "inventory" | "maintenance" | "fuel" | "rental";

interface Equipment {
  id: string;
  name: string;
  type: string;
  brand: string;
  purchaseYear: number;
  status: "operational" | "maintenance" | "repair" | "idle";
  hoursUsed: number;
  nextService: string;
  fuelType?: string;
  currentLocation: string;
  value: number;
  icon: string;
}

const equipmentList: Equipment[] = [
  { id: "eq1", name: "Tractor 35 HP", type: "Tractor", brand: "Mahindra 575 DI", purchaseYear: 2021, status: "operational", hoursUsed: 2450, nextService: "Apr 15, 2026", fuelType: "Diesel", currentLocation: "Farm Shed", value: 650000, icon: "\ud83d\ude9c" },
  { id: "eq2", name: "Rotavator 5ft", type: "Implement", brand: "Shaktiman", purchaseYear: 2022, status: "operational", hoursUsed: 580, nextService: "Jun 2026", currentLocation: "Farm Shed", value: 85000, icon: "\u2699\ufe0f" },
  { id: "eq3", name: "Power Sprayer 20L", type: "Sprayer", brand: "Honda GX25", purchaseYear: 2023, status: "repair", hoursUsed: 320, nextService: "Overdue - Nozzle replacement", fuelType: "Petrol", currentLocation: "Workshop", value: 25000, icon: "\ud83d\udca8" },
  { id: "eq4", name: "Drip System (40 ac)", type: "Irrigation", brand: "Jain Irrigation", purchaseYear: 2022, status: "operational", hoursUsed: 0, nextService: "Filter cleaning Apr 10", currentLocation: "Installed - Fields", value: 320000, icon: "\ud83d\udca7" },
  { id: "eq5", name: "Greenhouse (4 ac)", type: "Structure", brand: "Custom Built", purchaseYear: 2023, status: "operational", hoursUsed: 0, nextService: "Pad replacement Jun 2026", currentLocation: "South side", value: 1200000, icon: "\ud83c\udfe0" },
  { id: "eq6", name: "Weighing Scale 500kg", type: "Measuring", brand: "CAS", purchaseYear: 2024, status: "operational", hoursUsed: 0, nextService: "Calibration Aug 2026", currentLocation: "Pack House", value: 15000, icon: "\u2696\ufe0f" },
  { id: "eq7", name: "Water Pump 5HP", type: "Pump", brand: "Kirloskar", purchaseYear: 2020, status: "operational", hoursUsed: 4200, nextService: "Impeller check May 2026", fuelType: "Electric", currentLocation: "Borewell #1", value: 35000, icon: "\ud83d\udca7" },
  { id: "eq8", name: "Chaff Cutter", type: "Processing", brand: "Rajkumar", purchaseYear: 2022, status: "idle", hoursUsed: 150, nextService: "Blade sharpening before use", fuelType: "Electric", currentLocation: "Farm Shed", value: 18000, icon: "\u2702\ufe0f" },
];

const maintenanceLog = [
  { date: "Mar 25, 2026", equipment: "Tractor 35 HP", work: "Engine oil change + air filter", cost: 2800, mechanic: "Mahindra Service Center" },
  { date: "Mar 18, 2026", equipment: "Drip System", work: "Screen filter cleaning + line flushing", cost: 500, mechanic: "Self / Anil Shinde" },
  { date: "Mar 10, 2026", equipment: "Power Sprayer", work: "Diagnosed nozzle blockage + diaphragm wear", cost: 200, mechanic: "Local dealer" },
  { date: "Feb 28, 2026", equipment: "Water Pump 5HP", work: "Bearing replacement + alignment", cost: 3500, mechanic: "Kirloskar Service" },
  { date: "Feb 15, 2026", equipment: "Greenhouse", work: "Shade net repair (15m section)", cost: 4500, mechanic: "Contractor" },
  { date: "Jan 20, 2026", equipment: "Tractor 35 HP", work: "Full service - 2400hr milestone", cost: 8500, mechanic: "Mahindra Service Center" },
];

const statusColors: Record<string, string> = { operational: "#22c55e", maintenance: "#3b82f6", repair: "#ef4444", idle: "#6b7280" };

export default function EquipmentScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EquipTab>("inventory");

  const totalValue = equipmentList.reduce((s, e) => s + e.value, 0);
  const operational = equipmentList.filter((e) => e.status === "operational").length;
  const needsAttention = equipmentList.filter((e) => e.status === "repair" || e.status === "maintenance").length;

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\ude9c"} Equipment</Text>
          <Text className="text-typography-400 text-xs">Machinery, maintenance & fuel tracking</Text>
        </View>
        <Pressable className="bg-green-500 rounded-lg px-3 py-1.5">
          <Text className="text-white text-xs font-dm-sans-bold">+ Add</Text>
        </Pressable>
      </View>

      <View className="flex-row mx-5 mt-3 gap-2 mb-3">
        <View className="flex-1 bg-green-50 rounded-xl p-2.5 items-center border border-green-200">
          <Text className="text-green-800 text-lg font-dm-sans-bold">{operational}/{equipmentList.length}</Text>
          <Text className="text-green-600 text-xs">Operational</Text>
        </View>
        <View className="flex-1 bg-purple-50 rounded-xl p-2.5 items-center border border-purple-200">
          <Text className="text-purple-800 text-sm font-dm-sans-bold">{"\u20b9"}{(totalValue/100000).toFixed(1)}L</Text>
          <Text className="text-purple-600 text-xs">Asset Value</Text>
        </View>
        {needsAttention > 0 && (
          <View className="flex-1 bg-red-50 rounded-xl p-2.5 items-center border border-red-200">
            <Text className="text-red-800 text-lg font-dm-sans-bold">{needsAttention}</Text>
            <Text className="text-red-600 text-xs">Needs Work</Text>
          </View>
        )}
      </View>

      <View className="flex-row mx-5 mb-3 bg-background-100 rounded-xl p-1">
        {(["inventory", "maintenance", "fuel", "rental"] as EquipTab[]).map((t) => (
          <Pressable key={t} className="flex-1 items-center py-2 rounded-lg" style={activeTab === t ? { backgroundColor: "#16a34a" } : {}} onPress={() => setActiveTab(t)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === t ? "text-white" : "text-typography-500"}`}>
              {t === "inventory" ? "\ud83d\udce6 Assets" : t === "maintenance" ? "\ud83d\udd27 Service" : t === "fuel" ? "\u26fd Fuel" : "\ud83d\udd11 Rental"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "inventory" && (
          <View className="px-5">
            {equipmentList.map((eq) => {
              const color = statusColors[eq.status];
              return (
                <View key={eq.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-xl bg-background-100 items-center justify-center">
                      <Text style={{ fontSize: 24 }}>{eq.icon}</Text>
                    </View>
                    <View className="flex-1 ml-3">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{eq.name}</Text>
                      <Text className="text-typography-500 text-xs">{eq.brand} \u2022 {eq.purchaseYear}</Text>
                    </View>
                    <View className="items-end">
                      <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: color + "15" }}>
                        <Text className="text-xs font-dm-sans-bold capitalize" style={{ color }}>{eq.status}</Text>
                      </View>
                      <Text className="text-typography-400 text-xs mt-0.5">{"\u20b9"}{(eq.value/1000).toFixed(0)}K</Text>
                    </View>
                  </View>

                  <View className="flex-row gap-2 mt-3">
                    {[
                      { label: "Location", value: eq.currentLocation },
                      { label: "Hours", value: eq.hoursUsed > 0 ? `${eq.hoursUsed} hrs` : "N/A" },
                      { label: "Next Service", value: eq.nextService.split(" ").slice(0, 2).join(" ") },
                    ].map((m, i) => (
                      <View key={i} className="flex-1 bg-background-100 rounded-lg p-1.5">
                        <Text className="text-typography-400" style={{ fontSize: 8 }}>{m.label}</Text>
                        <Text className="text-typography-800 text-xs font-dm-sans-medium" numberOfLines={1}>{m.value}</Text>
                      </View>
                    ))}
                  </View>

                  {eq.status === "repair" && (
                    <View className="bg-red-50 rounded-lg p-2 mt-2">
                      <Text className="text-red-700 text-xs">{"\u26a0\ufe0f"} {eq.nextService}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {activeTab === "maintenance" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Service Log</Text>
            {maintenanceLog.map((log, i) => (
              <View key={i} className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-typography-900 text-sm font-dm-sans-bold">{log.equipment}</Text>
                  <Text className="text-typography-700 text-xs font-dm-sans-bold">{"\u20b9"}{log.cost.toLocaleString()}</Text>
                </View>
                <Text className="text-typography-600 text-xs">{log.work}</Text>
                <View className="flex-row items-center justify-between mt-1">
                  <Text className="text-typography-400 text-xs">{log.date}</Text>
                  <Text className="text-typography-400 text-xs">{log.mechanic}</Text>
                </View>
              </View>
            ))}

            <View className="bg-blue-50 rounded-xl p-3 mt-2 border border-blue-200">
              <Text className="text-blue-800 font-dm-sans-bold text-sm">Total Maintenance Cost (Rabi 25-26)</Text>
              <Text className="text-blue-800 text-xl font-dm-sans-bold">{"\u20b9"}{maintenanceLog.reduce((s, l) => s + l.cost, 0).toLocaleString()}</Text>
            </View>
          </View>
        )}

        {activeTab === "fuel" && (
          <View className="px-5">
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Fuel Consumption (Rabi 25-26)</Text>
              {[
                { equipment: "Tractor 35 HP", fuel: "Diesel", total: "420 L", cost: "\u20b937,800", avgUse: "2.8 L/hr" },
                { equipment: "Power Sprayer", fuel: "Petrol", total: "35 L", cost: "\u20b93,640", avgUse: "0.8 L/hr" },
                { equipment: "Water Pump", fuel: "Electric", total: "1,800 kWh", cost: "\u20b914,400", avgUse: "3.7 kWh/hr" },
                { equipment: "Greenhouse Fan/Pad", fuel: "Electric", total: "2,400 kWh", cost: "\u20b919,200", avgUse: "1.5 kW continuous" },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center py-2.5" style={i < 3 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <View className="flex-1">
                    <Text className="text-typography-800 text-xs font-dm-sans-medium">{item.equipment}</Text>
                    <Text className="text-typography-400 text-xs">{item.fuel} \u2022 {item.avgUse}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-typography-900 text-xs font-dm-sans-bold">{item.cost}</Text>
                    <Text className="text-typography-400 text-xs">{item.total}</Text>
                  </View>
                </View>
              ))}
              <View className="flex-row items-center justify-between pt-3 mt-2 border-t-2 border-outline-200">
                <Text className="text-typography-900 font-dm-sans-bold text-sm">Total Energy Cost</Text>
                <Text className="text-typography-900 font-dm-sans-bold text-lg">{"\u20b9"}75,040</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "rental" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Equipment Rental History</Text>
            {[
              { item: "Combine Harvester (Wheat)", provider: "Kisan Mechanization", date: "Expected Apr 18-22", cost: "\u20b92,500/acre x 12.5ac = \u20b931,250", status: "Booked" },
              { item: "Laser Land Leveller", provider: "Precision Agri", date: "Jan 5-7, 2026", cost: "\u20b94,000/acre x 8ac = \u20b932,000", status: "Completed" },
              { item: "Mulch Layer Machine", provider: "Plasticulture Rentals", date: "Jan 12, 2026", cost: "\u20b9800/acre x 5ac = \u20b94,000", status: "Completed" },
            ].map((rental, i) => (
              <View key={i} className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-typography-900 text-sm font-dm-sans-bold">{rental.item}</Text>
                  <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: rental.status === "Booked" ? "#3b82f615" : "#22c55e15" }}>
                    <Text className="text-xs font-dm-sans-medium" style={{ color: rental.status === "Booked" ? "#3b82f6" : "#22c55e" }}>{rental.status}</Text>
                  </View>
                </View>
                <Text className="text-typography-500 text-xs">{rental.provider} \u2022 {rental.date}</Text>
                <Text className="text-typography-700 text-xs font-dm-sans-medium mt-0.5">{rental.cost}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
