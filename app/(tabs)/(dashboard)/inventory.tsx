import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type InvTab = "stock" | "low-stock" | "procurement" | "usage";

interface InventoryItem {
  id: string;
  name: string;
  category: "fertilizer" | "pesticide" | "seed" | "equipment" | "organic" | "consumable";
  currentStock: number;
  unit: string;
  minRequired: number;
  costPerUnit: number;
  lastPurchased: string;
  expiryDate?: string;
  supplier: string;
  icon: string;
}

const inventory: InventoryItem[] = [
  { id: "i1", name: "Urea (46% N)", category: "fertilizer", currentStock: 8, unit: "bags (45kg)", minRequired: 15, costPerUnit: 266, lastPurchased: "2026-04-01", supplier: "Nashik Krishi Kendra", icon: "\ud83e\udea4" },
  { id: "i2", name: "DAP (18-46-0)", category: "fertilizer", currentStock: 12, unit: "bags (50kg)", minRequired: 10, costPerUnit: 1350, lastPurchased: "2026-03-15", supplier: "Nashik Krishi Kendra", icon: "\ud83e\udea4" },
  { id: "i3", name: "MOP (60% K\u2082O)", category: "fertilizer", currentStock: 5, unit: "bags (50kg)", minRequired: 8, costPerUnit: 850, lastPurchased: "2026-03-15", supplier: "Agri Mart Nashik", icon: "\ud83e\udea4" },
  { id: "i4", name: "Vermicompost", category: "organic", currentStock: 2, unit: "tons", minRequired: 5, costPerUnit: 6000, lastPurchased: "2026-02-20", supplier: "Green Earth Organics", icon: "\ud83c\udf3f" },
  { id: "i5", name: "Mancozeb 75% WP", category: "pesticide", currentStock: 3, unit: "kg", minRequired: 2, costPerUnit: 700, lastPurchased: "2026-03-25", expiryDate: "2028-03-25", supplier: "UPL Ltd", icon: "\ud83e\uddea" },
  { id: "i6", name: "Emamectin Benzoate 5% SG", category: "pesticide", currentStock: 0.5, unit: "kg", minRequired: 1, costPerUnit: 2800, lastPurchased: "2026-03-10", expiryDate: "2027-09-10", supplier: "Syngenta", icon: "\ud83e\uddea" },
  { id: "i7", name: "Neem Oil 1500ppm", category: "organic", currentStock: 4, unit: "liters", minRequired: 10, costPerUnit: 500, lastPurchased: "2026-03-20", expiryDate: "2027-03-20", supplier: "Bio Agri Solutions", icon: "\ud83c\udf3f" },
  { id: "i8", name: "Trichoderma viride", category: "organic", currentStock: 2, unit: "kg", minRequired: 3, costPerUnit: 400, lastPurchased: "2026-03-28", expiryDate: "2026-09-28", supplier: "ICAR Bio Center", icon: "\ud83c\udf3f" },
  { id: "i9", name: "19:19:19 Water Soluble", category: "fertilizer", currentStock: 10, unit: "kg", minRequired: 25, costPerUnit: 120, lastPurchased: "2026-03-15", supplier: "Coromandel", icon: "\ud83e\udea4" },
  { id: "i10", name: "Drip Lateral 16mm (spare)", category: "equipment", currentStock: 200, unit: "meters", minRequired: 100, costPerUnit: 6.4, lastPurchased: "2026-01-10", supplier: "Jain Irrigation", icon: "\ud83d\udd27" },
  { id: "i11", name: "Spray Nozzles (Hollow cone)", category: "consumable", currentStock: 5, unit: "pieces", minRequired: 10, costPerUnit: 80, lastPurchased: "2026-02-15", supplier: "Local dealer", icon: "\ud83d\udca8" },
  { id: "i12", name: "Sulphur 80% WP", category: "pesticide", currentStock: 4, unit: "kg", minRequired: 5, costPerUnit: 150, lastPurchased: "2026-03-18", expiryDate: "2028-03-18", supplier: "BASF", icon: "\ud83e\uddea" },
];

const categoryColors: Record<string, string> = { fertilizer: "#f59e0b", pesticide: "#ef4444", seed: "#22c55e", equipment: "#3b82f6", organic: "#22c55e", consumable: "#6b7280" };

export default function InventoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<InvTab>("stock");

  const lowStockItems = inventory.filter((i) => i.currentStock < i.minRequired);
  const totalValue = inventory.reduce((s, i) => s + i.currentStock * i.costPerUnit, 0);
  const expiringItems = inventory.filter((i) => {
    if (!i.expiryDate) return false;
    const exp = new Date(i.expiryDate);
    const now = new Date("2026-04-02");
    const diffDays = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays < 180;
  });

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\udce6"} Inventory</Text>
          <Text className="text-typography-400 text-xs">Stock management & procurement</Text>
        </View>
        <Pressable className="bg-green-500 rounded-lg px-3 py-1.5">
          <Text className="text-white text-xs font-dm-sans-bold">+ Item</Text>
        </Pressable>
      </View>

      <View className="flex-row mx-5 mt-3 gap-2 mb-3">
        <View className="flex-1 bg-purple-50 rounded-xl p-2.5 items-center border border-purple-200">
          <Text className="text-purple-800 text-sm font-dm-sans-bold">{"\u20b9"}{(totalValue/1000).toFixed(0)}K</Text>
          <Text className="text-purple-600 text-xs">Stock Value</Text>
        </View>
        <View className="flex-1 bg-red-50 rounded-xl p-2.5 items-center border border-red-200">
          <Text className="text-red-800 text-lg font-dm-sans-bold">{lowStockItems.length}</Text>
          <Text className="text-red-600 text-xs">Low Stock</Text>
        </View>
        <View className="flex-1 bg-yellow-50 rounded-xl p-2.5 items-center border border-yellow-200">
          <Text className="text-yellow-800 text-lg font-dm-sans-bold">{expiringItems.length}</Text>
          <Text className="text-yellow-600 text-xs">Expiring</Text>
        </View>
      </View>

      <View className="flex-row mx-5 mb-3 bg-background-100 rounded-xl p-1">
        {(["stock", "low-stock", "procurement", "usage"] as InvTab[]).map((t) => (
          <Pressable key={t} className="flex-1 items-center py-2 rounded-lg" style={activeTab === t ? { backgroundColor: "#16a34a" } : {}} onPress={() => setActiveTab(t)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === t ? "text-white" : "text-typography-500"}`}>
              {t === "stock" ? "\ud83d\udce6 All" : t === "low-stock" ? "\u26a0\ufe0f Low" : t === "procurement" ? "\ud83d\uded2 Buy" : "\ud83d\udcca Usage"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {(activeTab === "stock" || activeTab === "low-stock") && (
          <View className="px-5">
            {(activeTab === "low-stock" ? lowStockItems : inventory).map((item) => {
              const isLow = item.currentStock < item.minRequired;
              const stockPct = Math.min((item.currentStock / item.minRequired) * 100, 100);
              const color = categoryColors[item.category];

              return (
                <View key={item.id} className="bg-background-50 rounded-2xl p-4 mb-2 border border-outline-100">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: color + "15" }}>
                      <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                    </View>
                    <View className="flex-1 ml-3">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.name}</Text>
                      <Text className="text-typography-400 text-xs">{item.supplier} \u2022 \u20b9{item.costPerUnit}/{item.unit.split(" ")[0]}</Text>
                    </View>
                    <View className="items-end">
                      <Text className={`font-dm-sans-bold text-lg ${isLow ? "text-red-600" : "text-green-600"}`}>
                        {item.currentStock}
                      </Text>
                      <Text className="text-typography-400 text-xs">{item.unit}</Text>
                    </View>
                  </View>

                  {/* Stock level bar */}
                  <View className="mt-2">
                    <View className="flex-row justify-between mb-0.5">
                      <Text className="text-typography-400" style={{ fontSize: 9 }}>Min required: {item.minRequired}</Text>
                      <Text className="text-xs" style={{ color: isLow ? "#ef4444" : "#22c55e" }}>{stockPct.toFixed(0)}%</Text>
                    </View>
                    <View className="h-2 bg-background-200 rounded-full overflow-hidden">
                      <View className="h-full rounded-full" style={{ width: `${stockPct}%`, backgroundColor: isLow ? "#ef4444" : "#22c55e" }} />
                    </View>
                  </View>

                  {isLow && (
                    <Pressable className="bg-red-50 rounded-lg p-2 mt-2 flex-row items-center justify-between"
                      onPress={() => Alert.alert("Reorder", `Add ${item.minRequired - item.currentStock} ${item.unit} of ${item.name} to cart?\n\nEst. cost: \u20b9${((item.minRequired - item.currentStock) * item.costPerUnit).toLocaleString()}`)}>
                      <Text className="text-red-700 text-xs font-dm-sans-medium">
                        {"\u26a0\ufe0f"} Need {item.minRequired - item.currentStock} more {item.unit}
                      </Text>
                      <Text className="text-red-700 text-xs font-dm-sans-bold">Reorder {"\u2192"}</Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {activeTab === "procurement" && (
          <View className="px-5">
            <View className="bg-red-50 rounded-2xl p-4 border border-red-200 mb-4">
              <Text className="text-red-800 font-dm-sans-bold text-sm mb-2">{"\ud83d\uded2"} Recommended Purchases</Text>
              {lowStockItems.map((item, i) => {
                const needed = item.minRequired - item.currentStock;
                const cost = needed * item.costPerUnit;
                return (
                  <View key={i} className="bg-white rounded-xl p-3 mb-2 flex-row items-center justify-between">
                    <View>
                      <Text className="text-typography-900 text-xs font-dm-sans-bold">{item.name}</Text>
                      <Text className="text-typography-500 text-xs">{needed} {item.unit} needed</Text>
                    </View>
                    <Text className="text-red-700 font-dm-sans-bold text-sm">{"\u20b9"}{cost.toLocaleString()}</Text>
                  </View>
                );
              })}
              <View className="bg-white rounded-xl p-3 mt-1 flex-row items-center justify-between">
                <Text className="text-red-800 font-dm-sans-bold text-sm">Total Procurement Cost</Text>
                <Text className="text-red-800 font-dm-sans-bold text-lg">
                  {"\u20b9"}{lowStockItems.reduce((s, i) => s + (i.minRequired - i.currentStock) * i.costPerUnit, 0).toLocaleString()}
                </Text>
              </View>
            </View>

            <View className="bg-green-50 rounded-2xl p-4 border border-green-200">
              <Text className="text-green-800 font-dm-sans-bold text-sm mb-2">{"\ud83d\udca1"} Procurement Tips</Text>
              {[
                "Buy Urea and DAP early before Kharif demand spike (May-Jun)",
                "Order Neem Oil in bulk (20L) for 15% discount",
                "Check subsidy on bio-agents at KVK - up to 50% off",
                "Drip laterals on 30% subsidy under PMKSY scheme",
                "Compare prices across 3+ dealers before purchasing",
              ].map((tip, i) => (
                <Text key={i} className="text-green-700 text-xs leading-5">{"\u2022"} {tip}</Text>
              ))}
            </View>
          </View>
        )}

        {activeTab === "usage" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Monthly Usage Trends</Text>
            {[
              { name: "Urea", usage: [2, 3, 2, 4, 3, 2], unit: "bags", color: "#f59e0b" },
              { name: "Neem Oil", usage: [1, 1.5, 2, 2, 1.5, 2], unit: "L", color: "#22c55e" },
              { name: "Mancozeb", usage: [0, 0.5, 1, 1.5, 0.5, 1], unit: "kg", color: "#8b5cf6" },
              { name: "19:19:19", usage: [2, 3, 4, 5, 4, 5], unit: "kg", color: "#3b82f6" },
            ].map((item, i) => {
              const max = Math.max(...item.usage);
              return (
                <View key={i} className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.name}</Text>
                    <Text className="text-typography-500 text-xs">Last 6 months ({item.unit}/month)</Text>
                  </View>
                  <View className="h-16 flex-row items-end gap-1">
                    {item.usage.map((val, j) => (
                      <View key={j} className="flex-1 items-center">
                        <View className="w-full rounded-t-sm" style={{ height: `${(val / max) * 100}%`, backgroundColor: j === item.usage.length - 1 ? item.color : item.color + "50" }} />
                        <Text className="text-typography-400 mt-0.5" style={{ fontSize: 8 }}>{["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"][j]}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
