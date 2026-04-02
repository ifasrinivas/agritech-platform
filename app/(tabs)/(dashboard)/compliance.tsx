import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function ComplianceScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<"safety" | "regulatory" | "organic" | "audit">("safety");

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\u2611\ufe0f"} Compliance & Safety</Text>
          <Text className="text-typography-400 text-xs">Safety protocols, regulatory & audit</Text>
        </View>
      </View>

      <View className="flex-row mx-5 mt-3 mb-3 bg-background-100 rounded-xl p-1">
        {(["safety", "regulatory", "organic", "audit"] as const).map((t) => (
          <Pressable key={t} className="flex-1 items-center py-2 rounded-lg" style={tab === t ? { backgroundColor: "#16a34a" } : {}} onPress={() => setTab(t)}>
            <Text className={`text-xs font-dm-sans-medium ${tab === t ? "text-white" : "text-typography-500"}`}>
              {t === "safety" ? "\u26d1\ufe0f Safety" : t === "regulatory" ? "\ud83d\udcdc Rules" : t === "organic" ? "\ud83c\udf3f Organic" : "\ud83d\udd0d Audit"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {tab === "safety" && (
          <View className="px-5">
            <View className="bg-red-50 rounded-2xl p-4 border border-red-200 mb-4">
              <Text className="text-red-800 font-dm-sans-bold text-sm">{"\u26d1\ufe0f"} Farm Worker Safety Checklist</Text>
              <Text className="text-red-600 text-xs mt-1">Complete before any spray/chemical operation</Text>
            </View>

            {[
              { category: "Personal Protective Equipment (PPE)", items: [
                { item: "Rubber gloves (chemical resistant)", status: true },
                { item: "Face mask / respirator (N95 for powder)", status: true },
                { item: "Safety goggles / face shield", status: true },
                { item: "Full-sleeve clothing + apron", status: true },
                { item: "Rubber boots (knee-high for paddy)", status: false },
                { item: "Head covering / hat", status: true },
              ]},
              { category: "Chemical Handling", items: [
                { item: "Read label before mixing every time", status: true },
                { item: "Use measuring cups (not estimate)", status: true },
                { item: "Mix chemicals in open/ventilated area", status: true },
                { item: "Never eat, drink, smoke while handling", status: true },
                { item: "Triple-rinse empty containers", status: false },
                { item: "Locked chemical storage cabinet", status: true },
              ]},
              { category: "First Aid & Emergency", items: [
                { item: "First aid kit available at farm shed", status: true },
                { item: "Emergency phone numbers posted", status: true },
                { item: "Clean water for eye/skin wash", status: true },
                { item: "Poison control number: 1800-XXX-XXXX", status: true },
                { item: "Workers trained on chemical spill procedure", status: false },
                { item: "Anti-venom kit for snake bite", status: false },
              ]},
              { category: "Equipment Safety", items: [
                { item: "Tractor PTO guard in place", status: true },
                { item: "Sprayer nozzle leak test before use", status: true },
                { item: "Electrical connections earthed/grounded", status: true },
                { item: "Pump house ventilation adequate", status: true },
              ]},
            ].map((section, si) => {
              const completedCount = section.items.filter((i) => i.status).length;
              return (
                <View key={si} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{section.category}</Text>
                    <Text className={`text-xs font-dm-sans-bold ${completedCount === section.items.length ? "text-green-600" : "text-yellow-600"}`}>
                      {completedCount}/{section.items.length}
                    </Text>
                  </View>
                  {section.items.map((item, i) => (
                    <View key={i} className="flex-row items-center py-1.5">
                      <View className={`w-5 h-5 rounded items-center justify-center ${item.status ? "bg-green-500" : "bg-background-200"}`}>
                        <Text className="text-white text-xs">{item.status ? "\u2713" : ""}</Text>
                      </View>
                      <Text className={`text-xs ml-2 flex-1 ${item.status ? "text-typography-700" : "text-typography-400"}`}>{item.item}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {tab === "regulatory" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Regulatory Compliance</Text>
            {[
              { rule: "Insecticides Act 1968", requirement: "Only use registered pesticides. Maintain spray log.", status: "Compliant", icon: "\ud83d\udc1b", color: "#22c55e" },
              { rule: "Food Safety (FSSAI)", requirement: "Produce must meet MRL (Maximum Residue Limits).", status: "Compliant", icon: "\ud83c\udf7d\ufe0f", color: "#22c55e" },
              { rule: "Environment Protection Act", requirement: "No burning crop residue. Proper chemical disposal.", status: "Compliant", icon: "\ud83c\udf0d", color: "#22c55e" },
              { rule: "Water (P&CP) Act", requirement: "No chemical runoff into water bodies. Maintain buffer.", status: "Compliant", icon: "\ud83d\udca7", color: "#22c55e" },
              { rule: "Labour Act (Farm Workers)", requirement: "Min wages, safe working conditions, no child labor.", status: "Compliant", icon: "\ud83d\udc77", color: "#22c55e" },
              { rule: "APEDA Export Standards", requirement: "GLOBALG.A.P., residue tests, traceability for export.", status: "Active", icon: "\ud83d\udce6", color: "#3b82f6" },
              { rule: "PM-FME (Processing)", requirement: "FSSAI license needed if selling processed products.", status: "Not Started", icon: "\u2699\ufe0f", color: "#f59e0b" },
              { rule: "Drone Operation (DGCA)", requirement: "Remote Pilot License for drone > 250g. Register on DigitalSky.", status: "In Progress", icon: "\ud83d\ude81", color: "#f59e0b" },
            ].map((item, i) => (
              <View key={i} className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100">
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row items-center flex-1">
                    <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                    <Text className="text-typography-900 font-dm-sans-bold text-xs ml-2">{item.rule}</Text>
                  </View>
                  <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: item.color + "15" }}>
                    <Text className="text-xs font-dm-sans-medium" style={{ color: item.color }}>{item.status}</Text>
                  </View>
                </View>
                <Text className="text-typography-500 text-xs ml-6">{item.requirement}</Text>
              </View>
            ))}
          </View>
        )}

        {tab === "organic" && (
          <View className="px-5">
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
              <Text className="text-green-800 font-dm-sans-bold text-sm">{"\ud83c\udf3f"} Organic Certification Status</Text>
              <Text className="text-green-600 text-xs mt-1">2 of 6 fields under organic management (NPOP certified)</Text>
            </View>

            {/* Organic standards */}
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Organic Standards Compliance</Text>
            {[
              { standard: "No synthetic pesticides used", status: true, note: "Bio-agents only (Trichoderma, Neem, Bt)" },
              { standard: "No chemical fertilizers applied", status: true, note: "FYM + Vermicompost + Jeevamrutha only" },
              { standard: "No GMO seeds/inputs used", status: true, note: "Open-pollinated & certified organic seeds" },
              { standard: "Buffer zone (>25m from chemical fields)", status: true, note: "30m buffer maintained with vetiver grass" },
              { standard: "3-year conversion period completed", status: true, note: "Started 2023, certified Aug 2025" },
              { standard: "Soil fertility maintained organically", status: true, note: "Green manuring + crop rotation" },
              { standard: "Record keeping (all inputs/outputs)", status: true, note: "Logged in AgriTech platform" },
              { standard: "Annual inspection passed", status: true, note: "Last: Aug 2025, Next: Aug 2026" },
            ].map((item, i) => (
              <View key={i} className="flex-row items-start py-2" style={i < 7 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                <View className={`w-5 h-5 rounded items-center justify-center mt-0.5 ${item.status ? "bg-green-500" : "bg-red-500"}`}>
                  <Text className="text-white text-xs">{item.status ? "\u2713" : "\u2717"}</Text>
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-typography-800 text-xs font-dm-sans-medium">{item.standard}</Text>
                  <Text className="text-typography-400 text-xs">{item.note}</Text>
                </View>
              </View>
            ))}

            <View className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 mt-4">
              <Text className="text-yellow-800 font-dm-sans-bold text-sm mb-1">{"\ud83d\udcc5"} Conversion Roadmap</Text>
              <Text className="text-yellow-700 text-xs leading-5">
                {"\u2022"} Year 1-2 (Done): Transition period - organic practices, no chemical inputs{"\n"}
                {"\u2022"} Year 3 (Done): Certification audit, soil testing confirms no residues{"\n"}
                {"\u2022"} Year 4 (Current): Full organic certification - premium pricing{"\n"}
                {"\u2022"} Plan: Convert 2 more fields (Capsicum, Rice) by 2027
              </Text>
            </View>
          </View>
        )}

        {tab === "audit" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Audit Trail & Records</Text>

            {/* All auto-logged records */}
            {[
              { category: "Spray Records", count: "42 entries", lastUpdate: "Apr 2", completeness: 100, icon: "\ud83d\udca8" },
              { category: "Fertilizer Application", count: "28 entries", lastUpdate: "Apr 1", completeness: 100, icon: "\ud83e\udea4" },
              { category: "Irrigation Log", count: "85 entries", lastUpdate: "Apr 2", completeness: 95, icon: "\ud83d\udca7" },
              { category: "Pest Scouting Reports", count: "15 entries", lastUpdate: "Apr 2", completeness: 100, icon: "\ud83d\udc1b" },
              { category: "Soil Test Results", count: "3 tests", lastUpdate: "Jan 25", completeness: 100, icon: "\ud83e\udea8" },
              { category: "Harvest Records", count: "2 entries", lastUpdate: "Mar 25", completeness: 80, icon: "\ud83c\udf3e" },
              { category: "Financial Transactions", count: "65 entries", lastUpdate: "Apr 1", completeness: 90, icon: "\ud83d\udcb0" },
              { category: "Worker Attendance", count: "624 entries", lastUpdate: "Apr 2", completeness: 100, icon: "\ud83d\udc77" },
              { category: "Weather Data (IoT)", count: "17,280 readings", lastUpdate: "Apr 2", completeness: 100, icon: "\ud83c\udf21\ufe0f" },
              { category: "Satellite Imagery", count: "24 snapshots", lastUpdate: "Apr 1", completeness: 100, icon: "\ud83d\udef0\ufe0f" },
            ].map((item, i) => (
              <View key={i} className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100 flex-row items-center">
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                <View className="flex-1 ml-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-typography-800 text-xs font-dm-sans-bold">{item.category}</Text>
                    <Text className={`text-xs font-dm-sans-bold ${item.completeness === 100 ? "text-green-600" : "text-yellow-600"}`}>
                      {item.completeness}%
                    </Text>
                  </View>
                  <Text className="text-typography-400 text-xs">{item.count} \u2022 Updated: {item.lastUpdate}</Text>
                </View>
              </View>
            ))}

            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mt-2">
              <Text className="text-green-800 font-dm-sans-bold text-sm mb-1">{"\u2705"} Audit Readiness: 97%</Text>
              <Text className="text-green-700 text-xs">All critical records maintained digitally. Ready for GLOBALG.A.P., organic, and insurance audits at any time.</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
