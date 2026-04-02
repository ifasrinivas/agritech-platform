import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { userProfile, fields, carbonCredits } from "@/data/agritech";

export default function FarmPassportScreen() {
  const router = useRouter();
  const totalArea = fields.reduce((s, f) => s + f.area, 0);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83c\udff7\ufe0f"} Digital Farm Passport</Text>
          <Text className="text-typography-400 text-xs">Your verified farm identity card</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Farm ID Card */}
        <View className="mx-5 mt-4 rounded-3xl overflow-hidden" style={{ backgroundColor: "#16a34a" }}>
          {/* Card Header */}
          <View className="px-6 pt-5 pb-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-white/60 text-xs font-dm-sans-medium">AGRITECH FARM PASSPORT</Text>
              <Text className="text-white/60 text-xs">{"\ud83d\udef0\ufe0f"} Verified</Text>
            </View>
          </View>

          {/* Card Body */}
          <View className="px-6 pb-5">
            <View className="flex-row items-center mb-4">
              <View className="w-20 h-20 rounded-2xl bg-white/20 items-center justify-center">
                <Text style={{ fontSize: 40 }}>{"\ud83d\udc68\u200d\ud83c\udf3e"}</Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white text-xl font-dm-sans-bold">{userProfile.name}</Text>
                <Text className="text-white/80 text-sm">{userProfile.farmName}</Text>
                <Text className="text-white/60 text-xs mt-0.5">{"\ud83d\udccd"} {userProfile.location}</Text>
              </View>
            </View>

            <View className="flex-row bg-white/10 rounded-xl p-3">
              <View className="flex-1 items-center">
                <Text className="text-white font-dm-sans-bold text-lg">{totalArea}</Text>
                <Text className="text-white/60 text-xs">Acres</Text>
              </View>
              <View className="w-px bg-white/20" />
              <View className="flex-1 items-center">
                <Text className="text-white font-dm-sans-bold text-lg">{fields.length}</Text>
                <Text className="text-white/60 text-xs">Fields</Text>
              </View>
              <View className="w-px bg-white/20" />
              <View className="flex-1 items-center">
                <Text className="text-white font-dm-sans-bold text-lg">{carbonCredits.totalCredits}</Text>
                <Text className="text-white/60 text-xs">Carbon Cr.</Text>
              </View>
              <View className="w-px bg-white/20" />
              <View className="flex-1 items-center">
                <Text className="text-white font-dm-sans-bold text-lg">A+</Text>
                <Text className="text-white/60 text-xs">Rating</Text>
              </View>
            </View>

            <View className="mt-3 flex-row justify-between items-center">
              <Text className="text-white/40 text-xs">ID: GVF-2023-NAS-00847</Text>
              <Text className="text-white/40 text-xs">Member since {userProfile.memberSince}</Text>
            </View>
          </View>

          {/* QR Code area */}
          <View className="bg-white/10 py-3 items-center">
            <Text className="text-white/80 text-xs font-dm-sans-medium">Scan QR for verification \u2022 Valid till Mar 2027</Text>
          </View>
        </View>

        {/* Farm Details */}
        <View className="mx-5 mt-4 bg-background-50 rounded-2xl p-4 border border-outline-100">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Farm Registration</Text>
          {[
            { label: "Farm ID", value: "GVF-2023-NAS-00847" },
            { label: "Owner", value: userProfile.name },
            { label: "Farm Name", value: userProfile.farmName },
            { label: "Location", value: "Nashik District, Maharashtra, India" },
            { label: "GPS Center", value: "20.006\u00b0N, 73.791\u00b0E" },
            { label: "Total Area", value: `${totalArea} acres (${(totalArea * 0.4047).toFixed(1)} hectares)` },
            { label: "Survey Numbers", value: "121/1, 121/2, 122/3, 123/1" },
            { label: "Land Type", value: "Irrigated Agricultural Land" },
            { label: "Taluka", value: "Nashik" },
            { label: "Village", value: "Gangapur Road area" },
            { label: "Registration Date", value: "January 15, 2023" },
            { label: "Plan", value: `${userProfile.plan} (Active)` },
          ].map((item, i) => (
            <View key={i} className="flex-row justify-between py-2" style={i < 11 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
              <Text className="text-typography-500 text-xs">{item.label}</Text>
              <Text className="text-typography-800 text-xs font-dm-sans-medium text-right flex-1 ml-4">{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Certifications */}
        <View className="mx-5 mt-4 bg-background-50 rounded-2xl p-4 border border-outline-100">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">{"\ud83c\udfc5"} Certifications & Compliance</Text>
          {[
            { name: "GLOBALG.A.P. Certified", status: "Active", date: "Sep 2025", icon: "\ud83c\udfc5", color: "#22c55e" },
            { name: "India Organic (NPOP)", status: "2 fields", date: "Aug 2025", icon: "\ud83c\udf3f", color: "#22c55e" },
            { name: "APEDA Registered Exporter", status: "Active", date: "Jan 2024", icon: "\ud83c\udfe2", color: "#3b82f6" },
            { name: "Soil Health Card", status: "Active", date: "Jan 2026", icon: "\ud83e\udea8", color: "#8b5cf6" },
            { name: "PM-KISAN Beneficiary", status: "Active", date: "2023", icon: "\ud83c\udfe6", color: "#f59e0b" },
            { name: "PMFBY Crop Insurance", status: "Active", date: "Oct 2025", icon: "\ud83d\udee1\ufe0f", color: "#3b82f6" },
            { name: "Carbon Credit Verified", status: "24.5 tCO\u2082e", date: "Ongoing", icon: "\ud83c\udf0d", color: "#06b6d4" },
            { name: "KCC Loan Active", status: "\u20b92.5L limit", date: "2024", icon: "\ud83d\udcb3", color: "#f97316" },
          ].map((cert, i) => (
            <View key={i} className="flex-row items-center py-2.5" style={i < 7 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
              <Text style={{ fontSize: 16 }}>{cert.icon}</Text>
              <View className="flex-1 ml-3">
                <Text className="text-typography-800 text-xs font-dm-sans-medium">{cert.name}</Text>
                <Text className="text-typography-400 text-xs">{cert.date}</Text>
              </View>
              <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: cert.color + "15" }}>
                <Text className="text-xs font-dm-sans-medium" style={{ color: cert.color }}>{cert.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Infrastructure */}
        <View className="mx-5 mt-4 bg-background-50 rounded-2xl p-4 border border-outline-100">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">{"\ud83c\udfe0"} Farm Infrastructure</Text>
          <View className="flex-row flex-wrap gap-2">
            {[
              { label: "Drip Irrigation", value: "40 acres", icon: "\ud83d\udca7" },
              { label: "Sprinkler", value: "8 acres", icon: "\ud83c\udf0a" },
              { label: "Greenhouse", value: "4 acres (Polyhouse)", icon: "\ud83c\udfe0" },
              { label: "Borewell", value: "2 (5HP + 3HP)", icon: "\u26f2" },
              { label: "Farm Pond", value: "1 (5000 cu.m)", icon: "\ud83d\udca7" },
              { label: "Pack House", value: "Via FPO partner", icon: "\ud83d\udce6" },
              { label: "Weather Station", value: "1 (IoT enabled)", icon: "\ud83c\udf21\ufe0f" },
              { label: "Soil Sensors", value: "6 (4 online)", icon: "\ud83d\udce1" },
              { label: "Tractor", value: "35HP Mahindra", icon: "\ud83d\ude9c" },
              { label: "Cold Storage", value: "Via FPO (shared)", icon: "\u2744\ufe0f" },
            ].map((item, i) => (
              <View key={i} className="bg-background-100 rounded-xl p-3" style={{ width: "48%" }}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                <Text className="text-typography-800 text-xs font-dm-sans-bold mt-1">{item.label}</Text>
                <Text className="text-typography-500 text-xs">{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Crop History */}
        <View className="mx-5 mt-4 bg-background-50 rounded-2xl p-4 border border-outline-100">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">{"\ud83c\udf3e"} Crop History (Last 3 Seasons)</Text>
          {[
            { season: "Rabi 2025-26 (Current)", crops: "Wheat, Tomato, Rice, Grapes, Onion, Capsicum", area: "45.5 ac", status: "Active" },
            { season: "Kharif 2025", crops: "Soybean, Rice, Kharif Onion, Maize", area: "35 ac", status: "Completed" },
            { season: "Rabi 2024-25", crops: "Wheat, Tomato, Grapes, Onion, Capsicum", area: "40 ac", status: "Completed" },
          ].map((s, i) => (
            <View key={i} className="py-2.5" style={i < 2 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
              <View className="flex-row items-center justify-between">
                <Text className="text-typography-900 text-xs font-dm-sans-bold">{s.season}</Text>
                <Text className={`text-xs ${s.status === "Active" ? "text-green-600" : "text-typography-400"}`}>{s.area}</Text>
              </View>
              <Text className="text-typography-500 text-xs mt-0.5">{s.crops}</Text>
            </View>
          ))}
        </View>

        {/* Share / Export */}
        <View className="mx-5 mt-4 flex-row gap-3">
          <Pressable className="flex-1 bg-green-500 rounded-xl py-3.5 items-center">
            <Text className="text-white font-dm-sans-bold text-sm">{"\ud83d\udcc4"} Export PDF</Text>
          </Pressable>
          <Pressable className="flex-1 bg-blue-500 rounded-xl py-3.5 items-center">
            <Text className="text-white font-dm-sans-bold text-sm">{"\ud83d\udd17"} Share Link</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
