import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fields } from "@/data/agritech";

type FinanceTab = "calculator" | "loan" | "input-cost" | "breakeven";

export default function FinanceToolsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FinanceTab>("calculator");

  // Profit Calculator state
  const [calcArea, setCalcArea] = useState("10");
  const [calcYield, setCalcYield] = useState("15");
  const [calcPrice, setCalcPrice] = useState("2300");
  const [calcCost, setCalcCost] = useState("8500");

  // Loan EMI state
  const [loanAmount, setLoanAmount] = useState("250000");
  const [loanRate, setLoanRate] = useState("4");
  const [loanTenure, setLoanTenure] = useState("12");

  const area = parseFloat(calcArea) || 0;
  const yieldPerAcre = parseFloat(calcYield) || 0;
  const pricePerUnit = parseFloat(calcPrice) || 0;
  const costPerAcre = parseFloat(calcCost) || 0;

  const totalRevenue = area * yieldPerAcre * pricePerUnit;
  const totalCost = area * costPerAcre;
  const netProfit = totalRevenue - totalCost;
  const roi = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(0) : "0";

  const principal = parseFloat(loanAmount) || 0;
  const rate = (parseFloat(loanRate) || 0) / 100 / 12;
  const months = parseFloat(loanTenure) || 1;
  const emi = rate > 0 ? (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1) : principal / months;
  const totalPayable = emi * months;
  const totalInterest = totalPayable - principal;

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83e\uddee"} Finance Tools</Text>
          <Text className="text-typography-400 text-xs">Calculators, loans & cost planning</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-12 mx-5 mt-3 mb-2">
        {([
          { key: "calculator" as FinanceTab, label: "\ud83d\udcb0 Profit Calc" },
          { key: "loan" as FinanceTab, label: "\ud83c\udfe6 Loan EMI" },
          { key: "input-cost" as FinanceTab, label: "\ud83d\udce6 Input Cost" },
          { key: "breakeven" as FinanceTab, label: "\ud83d\udcca Break-even" },
        ]).map((tab) => (
          <Pressable key={tab.key} className="rounded-xl px-4 py-2 mr-2" style={activeTab === tab.key ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }} onPress={() => setActiveTab(tab.key)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === tab.key ? "text-white" : "text-typography-500"}`}>{tab.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "calculator" && (
          <View className="px-5">
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Profit Calculator</Text>

              {[
                { label: "Area (acres)", value: calcArea, setter: setCalcArea, placeholder: "10" },
                { label: "Expected Yield (qtl/acre)", value: calcYield, setter: setCalcYield, placeholder: "15" },
                { label: "Expected Price (\u20b9/qtl)", value: calcPrice, setter: setCalcPrice, placeholder: "2300" },
                { label: "Cost per acre (\u20b9)", value: calcCost, setter: setCalcCost, placeholder: "8500" },
              ].map((input, i) => (
                <View key={i} className="mb-3">
                  <Text className="text-typography-600 text-xs font-dm-sans-medium mb-1">{input.label}</Text>
                  <TextInput
                    className="bg-background-100 rounded-xl px-4 py-2.5 text-typography-900 text-sm"
                    keyboardType="decimal-pad"
                    value={input.value}
                    onChangeText={input.setter}
                    placeholder={input.placeholder}
                    placeholderTextColor="#a1a1aa"
                  />
                </View>
              ))}
            </View>

            {/* Results */}
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
              <Text className="text-green-800 font-dm-sans-bold text-base mb-3">Results</Text>
              <View className="flex-row gap-3 mb-3">
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-typography-400 text-xs">Revenue</Text>
                  <Text className="text-green-700 text-lg font-dm-sans-bold">{"\u20b9"}{totalRevenue.toLocaleString()}</Text>
                </View>
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-typography-400 text-xs">Total Cost</Text>
                  <Text className="text-red-600 text-lg font-dm-sans-bold">{"\u20b9"}{totalCost.toLocaleString()}</Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-typography-400 text-xs">Net Profit</Text>
                  <Text className={`text-xl font-dm-sans-bold ${netProfit >= 0 ? "text-green-700" : "text-red-600"}`}>
                    {"\u20b9"}{netProfit.toLocaleString()}
                  </Text>
                </View>
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-typography-400 text-xs">ROI</Text>
                  <Text className={`text-xl font-dm-sans-bold ${Number(roi) >= 0 ? "text-blue-700" : "text-red-600"}`}>
                    {roi}%
                  </Text>
                </View>
              </View>
              <View className="bg-white rounded-xl p-3 mt-3 items-center">
                <Text className="text-typography-400 text-xs">Profit per Acre</Text>
                <Text className="text-green-700 text-lg font-dm-sans-bold">
                  {"\u20b9"}{area > 0 ? (netProfit / area).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "0"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "loan" && (
          <View className="px-5">
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
                {"\ud83c\udfe6"} Kisan Credit Card EMI Calculator
              </Text>

              {[
                { label: "Loan Amount (\u20b9)", value: loanAmount, setter: setLoanAmount },
                { label: "Interest Rate (% p.a.)", value: loanRate, setter: setLoanRate },
                { label: "Tenure (months)", value: loanTenure, setter: setLoanTenure },
              ].map((input, i) => (
                <View key={i} className="mb-3">
                  <Text className="text-typography-600 text-xs font-dm-sans-medium mb-1">{input.label}</Text>
                  <TextInput
                    className="bg-background-100 rounded-xl px-4 py-2.5 text-typography-900 text-sm"
                    keyboardType="decimal-pad"
                    value={input.value}
                    onChangeText={input.setter}
                    placeholderTextColor="#a1a1aa"
                  />
                </View>
              ))}

              <View className="bg-blue-50 rounded-xl p-3 mt-1">
                <Text className="text-blue-700 text-xs">{"\ud83d\udca1"} KCC interest: 7% - 3% subvention = 4%. Extra 3% rebate for timely repayment = effective 1%</Text>
              </View>
            </View>

            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-4">
              <Text className="text-blue-800 font-dm-sans-bold text-base mb-3">EMI Breakdown</Text>
              <View className="flex-row gap-3 mb-3">
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-typography-400 text-xs">Monthly EMI</Text>
                  <Text className="text-blue-700 text-xl font-dm-sans-bold">{"\u20b9"}{emi.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </View>
                <View className="flex-1 bg-white rounded-xl p-3 items-center">
                  <Text className="text-typography-400 text-xs">Total Interest</Text>
                  <Text className="text-red-600 text-xl font-dm-sans-bold">{"\u20b9"}{totalInterest.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </View>
              </View>
              <View className="bg-white rounded-xl p-3 items-center">
                <Text className="text-typography-400 text-xs">Total Payable</Text>
                <Text className="text-typography-900 text-xl font-dm-sans-bold">{"\u20b9"}{totalPayable.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
              </View>

              {/* Visual split */}
              <View className="mt-3 h-4 rounded-full overflow-hidden flex-row">
                <View className="bg-blue-500" style={{ flex: principal }} />
                <View className="bg-red-400" style={{ flex: totalInterest }} />
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="text-blue-600 text-xs">Principal ({((principal / totalPayable) * 100).toFixed(0)}%)</Text>
                <Text className="text-red-500 text-xs">Interest ({((totalInterest / totalPayable) * 100).toFixed(0)}%)</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "input-cost" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">
              Season Input Cost Planner
            </Text>

            {[
              {
                category: "Seeds & Seedlings",
                items: [
                  { name: "Wheat seed (Lokwan)", qty: "25 kg/acre", rate: "\u20b960/kg", total: 18750, acres: 12.5 },
                  { name: "Tomato seedlings (Arka Rakshak)", qty: "1200/acre", rate: "\u20b90.75/seedling", total: 7200, acres: 8 },
                  { name: "Onion sets", qty: "5 kg/acre", rate: "\u20b9400/kg", total: 10000, acres: 5 },
                  { name: "Capsicum seedlings", qty: "3000/acre", rate: "\u20b92/seedling", total: 24000, acres: 4 },
                ],
                icon: "\ud83c\udf31", color: "#22c55e",
              },
              {
                category: "Fertilizers",
                items: [
                  { name: "Urea (46% N)", qty: "2 bags/acre", rate: "\u20b9266/bag", total: 24206, acres: 45.5 },
                  { name: "DAP (18-46-0)", qty: "1 bag/acre", rate: "\u20b91,350/bag", total: 61425, acres: 45.5 },
                  { name: "MOP (60% K\u2082O)", qty: "0.5 bag/acre", rate: "\u20b9850/bag", total: 19338, acres: 45.5 },
                  { name: "Vermicompost", qty: "1 ton/acre", rate: "\u20b96,000/ton", total: 48000, acres: 8 },
                  { name: "19:19:19 (Fertigation)", qty: "5 kg/acre", rate: "\u20b9120/kg", total: 7200, acres: 12 },
                ],
                icon: "\ud83e\udea4", color: "#f59e0b",
              },
              {
                category: "Pesticides & Sprays",
                items: [
                  { name: "Mancozeb 75% WP", qty: "500g/acre", rate: "\u20b9350/500g", total: 5600, acres: 16 },
                  { name: "Emamectin Benzoate 5% SG", qty: "100g/acre", rate: "\u20b9280/100g", total: 3500, acres: 12.5 },
                  { name: "Neem Oil 1500ppm", qty: "200ml/acre", rate: "\u20b9500/L", total: 4550, acres: 45.5 },
                  { name: "Trichoderma viride", qty: "500g/acre", rate: "\u20b9200/500g", total: 1600, acres: 8 },
                ],
                icon: "\ud83d\udc1b", color: "#ef4444",
              },
            ].map((section, i) => {
              const sectionTotal = section.items.reduce((s, item) => s + item.total, 0);
              return (
                <View key={i} className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-3">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <Text style={{ fontSize: 18 }}>{section.icon}</Text>
                      <Text className="text-typography-900 font-dm-sans-bold text-sm ml-2">{section.category}</Text>
                    </View>
                    <Text className="font-dm-sans-bold text-sm" style={{ color: section.color }}>
                      {"\u20b9"}{sectionTotal.toLocaleString()}
                    </Text>
                  </View>
                  {section.items.map((item, j) => (
                    <View key={j} className="flex-row items-center py-2" style={j < section.items.length - 1 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                      <View className="flex-1">
                        <Text className="text-typography-800 text-xs font-dm-sans-medium">{item.name}</Text>
                        <Text className="text-typography-400 text-xs">{item.qty} x {item.acres}ac = {item.rate}</Text>
                      </View>
                      <Text className="text-typography-900 text-xs font-dm-sans-bold">{"\u20b9"}{item.total.toLocaleString()}</Text>
                    </View>
                  ))}
                </View>
              );
            })}

            <View className="bg-green-50 rounded-2xl p-4 border border-green-200">
              <View className="flex-row items-center justify-between">
                <Text className="text-green-800 font-dm-sans-bold text-base">Grand Total</Text>
                <Text className="text-green-800 font-dm-sans-bold text-xl">{"\u20b9"}2,35,369</Text>
              </View>
              <Text className="text-green-600 text-xs mt-1">Avg cost per acre: {"\u20b9"}5,174</Text>
            </View>
          </View>
        )}

        {activeTab === "breakeven" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Break-even Analysis</Text>

            {fields.map((field) => {
              const costMap: Record<string, number> = {
                Wheat: 8500, Tomato: 9000, Rice: 4500, Grapes: 24667, Onion: 7700, Capsicum: 11250,
              };
              const yieldMap: Record<string, number> = {
                Wheat: 18.5, Tomato: 120, Rice: 22, Grapes: 85, Onion: 80, Capsicum: 150,
              };
              const priceMap: Record<string, number> = {
                Wheat: 2320, Tomato: 1200, Rice: 3650, Grapes: 5200, Onion: 2600, Capsicum: 2900,
              };
              const unitMap: Record<string, string> = {
                Wheat: "qtl", Tomato: "qtl (as ton)", Rice: "qtl", Grapes: "qtl", Onion: "qtl (as ton)", Capsicum: "qtl (as ton)",
              };

              const cost = costMap[field.crop] || 8000;
              const yld = yieldMap[field.crop] || 15;
              const price = priceMap[field.crop] || 2000;
              const totalCostField = cost * field.area;
              const breakEvenQty = cost / (price / (field.crop === "Tomato" || field.crop === "Onion" || field.crop === "Capsicum" ? 10 : 1));
              const breakEvenPct = (breakEvenQty / yld) * 100;

              return (
                <View key={field.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{field.crop}</Text>
                    <Text className="text-typography-400 text-xs">{field.area} acres</Text>
                  </View>

                  <View className="flex-row gap-2 mb-2">
                    <View className="flex-1 bg-red-50 rounded-lg p-2 items-center">
                      <Text className="text-typography-400" style={{ fontSize: 9 }}>Cost/acre</Text>
                      <Text className="text-red-600 text-xs font-dm-sans-bold">{"\u20b9"}{cost.toLocaleString()}</Text>
                    </View>
                    <View className="flex-1 bg-green-50 rounded-lg p-2 items-center">
                      <Text className="text-typography-400" style={{ fontSize: 9 }}>Price</Text>
                      <Text className="text-green-600 text-xs font-dm-sans-bold">{"\u20b9"}{price}/{unitMap[field.crop]?.split(" ")[0] || "qtl"}</Text>
                    </View>
                    <View className="flex-1 bg-blue-50 rounded-lg p-2 items-center">
                      <Text className="text-typography-400" style={{ fontSize: 9 }}>Break-even</Text>
                      <Text className="text-blue-600 text-xs font-dm-sans-bold">{breakEvenPct.toFixed(0)}% yield</Text>
                    </View>
                  </View>

                  {/* Break-even bar */}
                  <View className="h-3 bg-red-100 rounded-full overflow-hidden">
                    <View className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(breakEvenPct, 100)}%` }} />
                  </View>
                  <View className="flex-row justify-between mt-1">
                    <Text className="text-red-500 text-xs">Loss zone</Text>
                    <Text className="text-typography-400 text-xs">{breakEvenPct.toFixed(0)}% of expected yield</Text>
                    <Text className="text-green-500 text-xs">Profit zone</Text>
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
