import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type ExportTab = "checklist" | "documents" | "traceability" | "certifications";

export default function ExportDocsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ExportTab>("checklist");

  const exportChecklist = [
    { item: "APEDA Registration", status: "completed", detail: "Reg No: APEDA/2024/NAS/0847", icon: "\u2705" },
    { item: "Phytosanitary Certificate", status: "completed", detail: "Valid till Jun 2026. Issued by Plant Quarantine, Nashik", icon: "\u2705" },
    { item: "Residue Analysis Report", status: "in-progress", detail: "Sample sent Mar 27. Results expected Apr 4.", icon: "\ud83d\udd04" },
    { item: "Pack House Certification", status: "completed", detail: "Fresh Pack Industries (APEDA certified)", icon: "\u2705" },
    { item: "Cold Chain Documentation", status: "pending", detail: "Temperature log from farm to port needed", icon: "\u23f3" },
    { item: "Bill of Lading", status: "pending", detail: "Ship: MSC Shipping. Port: JNPT Mumbai", icon: "\u23f3" },
    { item: "Certificate of Origin", status: "pending", detail: "Apply at Chamber of Commerce", icon: "\u23f3" },
    { item: "EUR.1 / GSP Certificate", status: "pending", detail: "For EU preferential tariff. Apply with DGFT", icon: "\u23f3" },
    { item: "Insurance Certificate", status: "completed", detail: "Marine cargo insurance - ICICI Lombard", icon: "\u2705" },
    { item: "Invoice & Packing List", status: "pending", detail: "Draft ready. Final after weighment", icon: "\u23f3" },
  ];

  const completedCount = exportChecklist.filter((c) => c.status === "completed").length;

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83d\udce6"} Export Documentation</Text>
          <Text className="text-typography-400 text-xs">Compliance, traceability & certifications</Text>
        </View>
      </View>

      <View className="flex-row mx-5 mt-3 mb-3 bg-background-100 rounded-xl p-1">
        {(["checklist", "documents", "traceability", "certifications"] as ExportTab[]).map((t) => (
          <Pressable key={t} className="flex-1 items-center py-2 rounded-lg" style={activeTab === t ? { backgroundColor: "#16a34a" } : {}} onPress={() => setActiveTab(t)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === t ? "text-white" : "text-typography-500"}`}>
              {t === "checklist" ? "\u2611\ufe0f List" : t === "documents" ? "\ud83d\udcc4 Docs" : t === "traceability" ? "\ud83d\udd0d Trace" : "\ud83c\udfc5 Certs"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "checklist" && (
          <View className="px-5">
            {/* Progress */}
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-green-800 font-dm-sans-bold text-sm">Export Readiness</Text>
                <Text className="text-green-800 font-dm-sans-bold">{completedCount}/{exportChecklist.length}</Text>
              </View>
              <View className="h-3 bg-green-200 rounded-full overflow-hidden">
                <View className="h-full bg-green-500 rounded-full" style={{ width: `${(completedCount / exportChecklist.length) * 100}%` }} />
              </View>
              <Text className="text-green-600 text-xs mt-1">Grape export to EU - Thompson Seedless</Text>
            </View>

            {exportChecklist.map((item, i) => {
              const statusColors: Record<string, string> = { completed: "#22c55e", "in-progress": "#3b82f6", pending: "#d4d4d4" };
              return (
                <View key={i} className="flex-row items-start py-3" style={i < exportChecklist.length - 1 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                  <View className="flex-1 ml-3">
                    <Text className={`text-sm font-dm-sans-medium ${item.status === "completed" ? "text-typography-900" : "text-typography-600"}`}>
                      {item.item}
                    </Text>
                    <Text className="text-typography-400 text-xs mt-0.5">{item.detail}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === "documents" && (
          <View className="px-5">
            {[
              { name: "Phytosanitary Certificate", date: "Mar 2026", size: "245 KB", type: "PDF", icon: "\ud83d\udcdc" },
              { name: "APEDA Registration", date: "Jan 2024", size: "180 KB", type: "PDF", icon: "\ud83c\udfe2" },
              { name: "Pack House Certificate", date: "Dec 2025", size: "320 KB", type: "PDF", icon: "\ud83c\udfe0" },
              { name: "Marine Insurance Policy", date: "Mar 2026", size: "450 KB", type: "PDF", icon: "\ud83d\udee1\ufe0f" },
              { name: "Residue Analysis (Previous)", date: "Nov 2025", size: "520 KB", type: "PDF", icon: "\ud83e\uddea" },
              { name: "GLOBALG.A.P. Certificate", date: "Sep 2025", size: "380 KB", type: "PDF", icon: "\ud83c\udfc5" },
              { name: "Organic Certification (2 fields)", date: "Aug 2025", size: "290 KB", type: "PDF", icon: "\ud83c\udf3f" },
              { name: "Farm Registration Document", date: "2023", size: "150 KB", type: "PDF", icon: "\ud83d\udccb" },
            ].map((doc, i) => (
              <Pressable key={i}>
                <View className="bg-background-50 rounded-xl p-3 mb-2 border border-outline-100 flex-row items-center">
                  <View className="w-10 h-10 rounded-lg bg-red-50 items-center justify-center">
                    <Text style={{ fontSize: 18 }}>{doc.icon}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-900 text-sm font-dm-sans-medium">{doc.name}</Text>
                    <Text className="text-typography-400 text-xs">{doc.date} \u2022 {doc.size} \u2022 {doc.type}</Text>
                  </View>
                  <Text className="text-blue-500 text-xs font-dm-sans-bold">{"\u2b07\ufe0f"}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {activeTab === "traceability" && (
          <View className="px-5">
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-4">
              <Text className="text-blue-800 font-dm-sans-bold text-sm">Farm-to-Fork Traceability</Text>
              <Text className="text-blue-600 text-xs mt-1">Complete chain of custody for export consignment</Text>
            </View>

            {/* Traceability Timeline */}
            {[
              { step: "Farm Production", detail: "Green Valley Farms, Nashik\nField: West Orchard, 6 acres\nVariety: Thompson Seedless\nSowing: Aug 2025", date: "Aug 2025 - Mar 2026", icon: "\ud83c\udf31", color: "#22c55e" },
              { step: "Crop Management", detail: "IPM followed, 3 sprays total\nDrip irrigation, fertigation\nLast spray: Feb 15 (40-day PHI)", date: "Aug - Mar", icon: "\ud83d\udca7", color: "#3b82f6" },
              { step: "Pre-harvest Testing", detail: "Brix: 19.2 (>18 required)\nResidue: Below MRL (pending final)\nBerry size: 18-20mm", date: "Mar 25, 2026", icon: "\ud83e\uddea", color: "#8b5cf6" },
              { step: "Harvest & Grading", detail: "Manual harvest, field grading\nExport A: 42 qtl\nGrade B (raisin): 18 qtl", date: "Mar 15-25, 2026", icon: "\ud83c\udf47", color: "#f59e0b" },
              { step: "Pack House", detail: "Fresh Pack Industries (APEDA cert)\nPre-cooling: 2-4\u00b0C within 4 hours\n2 kg corrugated boxes, SO\u2082 pad", date: "Mar 15-25, 2026", icon: "\ud83d\udce6", color: "#06b6d4" },
              { step: "Cold Chain Transport", detail: "Reefer truck: Nashik \u2192 JNPT Mumbai\nTemp maintained: 0-2\u00b0C\nTransit time: 6 hours", date: "Mar 26, 2026", icon: "\ud83d\ude9a", color: "#f97316" },
              { step: "Port & Shipping", detail: "JNPT Mumbai \u2192 Rotterdam, Netherlands\nMSC Shipping, 40ft reefer container\nETA: 18-21 days", date: "Mar 28, 2026", icon: "\ud83d\udea2", color: "#3b82f6" },
              { step: "Destination", detail: "Rotterdam Port \u2192 Distribution\nImporter: FreshEU Trading BV\nFinal retail: EU supermarkets", date: "Apr 15-18, 2026 (est)", icon: "\ud83c\uddea\ud83c\uddfa", color: "#22c55e" },
            ].map((step, i, arr) => (
              <View key={i} className="flex-row mb-0">
                <View className="items-center w-8">
                  <View className="w-4 h-4 rounded-full z-10" style={{ backgroundColor: step.color }} />
                  {i < arr.length - 1 && <View className="w-0.5 flex-1" style={{ backgroundColor: step.color + "30" }} />}
                </View>
                <View className="flex-1 ml-3 pb-4">
                  <View className="rounded-xl p-3" style={{ backgroundColor: step.color + "08", borderLeftWidth: 3, borderLeftColor: step.color }}>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Text style={{ fontSize: 14 }}>{step.icon}</Text>
                        <Text className="text-typography-900 font-dm-sans-bold text-sm ml-2">{step.step}</Text>
                      </View>
                      <Text className="text-typography-400 text-xs">{step.date.split(",")[0]}</Text>
                    </View>
                    <Text className="text-typography-600 text-xs mt-1 leading-4">{step.detail}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "certifications" && (
          <View className="px-5">
            {[
              { name: "GLOBALG.A.P.", status: "Active", expiry: "Sep 2026", desc: "Good Agricultural Practices certification for EU export market", color: "#22c55e", icon: "\ud83c\udfc5" },
              { name: "Organic (India Organic / NPOP)", status: "Active (2 fields)", expiry: "Aug 2026", desc: "Certified organic for North Block (Wheat) and Central Block (Onion)", color: "#22c55e", icon: "\ud83c\udf3f" },
              { name: "APEDA Export Registration", status: "Active", expiry: "Jan 2027", desc: "Authorized exporter for fresh fruits and vegetables", color: "#22c55e", icon: "\ud83c\udfe2" },
              { name: "ISO 22000 (Pack House)", status: "Via Partner", expiry: "Dec 2026", desc: "Food safety management system - Fresh Pack Industries", color: "#3b82f6", icon: "\ud83d\udee1\ufe0f" },
              { name: "Carbon Neutral Certification", status: "In Progress", expiry: "Applying", desc: "Voluntary carbon market verification for 24.5 tCO\u2082e credits", color: "#f59e0b", icon: "\ud83c\udf0d" },
              { name: "Fair Trade", status: "Exploring", expiry: "N/A", desc: "Fair Trade certification for grape exports - evaluation phase", color: "#8b5cf6", icon: "\ud83e\udd1d" },
            ].map((cert, i) => {
              const statusColors: Record<string, string> = { Active: "#22c55e", "Active (2 fields)": "#22c55e", "Via Partner": "#3b82f6", "In Progress": "#f59e0b", Exploring: "#8b5cf6" };
              return (
                <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <Text style={{ fontSize: 22 }}>{cert.icon}</Text>
                      <View className="ml-3">
                        <Text className="text-typography-900 font-dm-sans-bold text-sm">{cert.name}</Text>
                        <Text className="text-typography-400 text-xs">Expiry: {cert.expiry}</Text>
                      </View>
                    </View>
                    <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: (statusColors[cert.status] || "#6b7280") + "15" }}>
                      <Text className="text-xs font-dm-sans-bold" style={{ color: statusColors[cert.status] || "#6b7280" }}>{cert.status}</Text>
                    </View>
                  </View>
                  <Text className="text-typography-600 text-xs leading-4">{cert.desc}</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
