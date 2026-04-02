import React from "react";
import { View, Text } from "react-native";
import { carbonCredits } from "@/data/agritech";

export default function CarbonDashboard() {
  const maxCredit = Math.max(...carbonCredits.history.map((h) => h.credits));

  return (
    <View>
      {/* Summary Cards */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-background-50 rounded-2xl p-4 border border-outline-100">
          <Text style={{ fontSize: 28 }}>{"\ud83c\udf0d"}</Text>
          <Text className="text-typography-400 text-xs font-dm-sans-regular mt-2">
            Total Credits
          </Text>
          <Text className="text-typography-900 text-2xl font-dm-sans-bold" style={{ color: "#22c55e" }}>
            {carbonCredits.totalCredits}
          </Text>
          <Text className="text-typography-400 text-xs">tCO\u2082e</Text>
        </View>
        <View className="flex-1 bg-background-50 rounded-2xl p-4 border border-outline-100">
          <Text style={{ fontSize: 28 }}>{"\ud83d\udcc8"}</Text>
          <Text className="text-typography-400 text-xs font-dm-sans-regular mt-2">
            This Month
          </Text>
          <Text className="text-typography-900 text-2xl font-dm-sans-bold" style={{ color: "#3b82f6" }}>
            +{carbonCredits.earnedThisMonth}
          </Text>
          <Text className="text-typography-400 text-xs">tCO\u2082e</Text>
        </View>
      </View>

      {/* History Chart */}
      <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
        <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
          Monthly Credits Earned
        </Text>
        <View className="flex-row items-end h-32">
          {carbonCredits.history.map((item, i) => {
            const height = (item.credits / maxCredit) * 100;
            return (
              <View key={i} className="flex-1 items-center justify-end">
                <Text className="text-xs font-dm-sans-bold text-typography-600 mb-1">
                  {item.credits}
                </Text>
                <View
                  className="w-8 rounded-t-lg"
                  style={{
                    height: `${height}%`,
                    backgroundColor: i === carbonCredits.history.length - 1 ? "#22c55e" : "#22c55e50",
                  }}
                />
                <Text className="text-xs text-typography-400 mt-1">{item.month}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Practices */}
      <View className="bg-background-50 rounded-2xl p-4 border border-outline-100">
        <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
          Sustainable Practices
        </Text>
        {carbonCredits.practices.map((practice, i) => (
          <View
            key={i}
            className="flex-row items-center justify-between py-3"
            style={i < carbonCredits.practices.length - 1 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}
          >
            <View className="flex-1">
              <Text className="text-typography-900 font-dm-sans-medium text-sm">
                {practice.name}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <View
                  className="w-2 h-2 rounded-full mr-1.5"
                  style={{
                    backgroundColor: practice.status === "Active" ? "#22c55e" : "#f59e0b",
                  }}
                />
                <Text className="text-typography-400 text-xs">{practice.status}</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-typography-900 font-dm-sans-bold text-sm" style={{ color: "#22c55e" }}>
                {practice.credits}
              </Text>
              <Text className="text-typography-400 text-xs">tCO\u2082e</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
