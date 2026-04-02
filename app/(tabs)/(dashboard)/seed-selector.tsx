import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type SeedTab = "recommend" | "catalog" | "comparison" | "suppliers";

interface SeedVariety {
  id: string;
  crop: string;
  variety: string;
  developer: string;
  duration: string;
  yield: string;
  features: string[];
  resistance: string[];
  suitability: string;
  seedRate: string;
  price: string;
  score: number;
  icon: string;
}

const varieties: SeedVariety[] = [
  { id: "v1", crop: "Tomato", variety: "Arka Rakshak", developer: "IIHR Bangalore", duration: "140 days", yield: "75-80 ton/ha", features: ["Triple disease resistant", "Large fruits 90-100g", "Good shelf life 15 days", "Suited for staking"], resistance: ["ToLCV", "Bacterial Wilt", "Early Blight"], suitability: "Maharashtra, Karnataka, AP", seedRate: "150g/acre (nursery)", price: "\u20b9850/10g packet", score: 95, icon: "\ud83c\udf45" },
  { id: "v2", crop: "Tomato", variety: "NS 4266 (Namdhari)", developer: "Namdhari Seeds", duration: "130 days", yield: "65-70 ton/ha", features: ["Hybrid F1", "Round firm fruits", "Heat tolerant", "Long harvest window"], resistance: ["ToLCV", "TYLCV"], suitability: "All India, open field", seedRate: "100g/acre", price: "\u20b91,200/10g packet", score: 88, icon: "\ud83c\udf45" },
  { id: "v3", crop: "Wheat", variety: "HD 3226 (Pusa Yashasvi)", developer: "IARI New Delhi", duration: "142 days", yield: "58-62 qtl/ha", features: ["Rust resistant", "High protein 12.5%", "Amber grain", "Timely sown"], resistance: ["Yellow Rust", "Brown Rust", "Leaf Blight"], suitability: "North India, Maharashtra", seedRate: "40 kg/acre", price: "\u20b960/kg (certified)", score: 92, icon: "\ud83c\udf3e" },
  { id: "v4", crop: "Wheat", variety: "Lokwan (Local)", developer: "Traditional", duration: "135 days", yield: "45-50 qtl/ha", features: ["Excellent chapati quality", "Market premium", "Adapted to local conditions", "Seed self-saving"], resistance: ["Moderate rust tolerance"], suitability: "Maharashtra", seedRate: "45 kg/acre", price: "\u20b945/kg (local)", score: 80, icon: "\ud83c\udf3e" },
  { id: "v5", crop: "Onion", variety: "Bhima Shakti", developer: "DOGR Pune", duration: "120 days (Rabi)", yield: "30-35 ton/ha", features: ["Dark red color", "High TSS", "Storage up to 5 months", "Uniform bulbs"], resistance: ["Purple Blotch tolerant", "Thrips tolerant"], suitability: "Maharashtra, Gujarat, MP", seedRate: "4-5 kg/acre", price: "\u20b9400/kg", score: 90, icon: "\ud83e\uddc5" },
  { id: "v6", crop: "Onion", variety: "N-53", developer: "MPKV Rahuri", duration: "110 days", yield: "25-30 ton/ha", features: ["Early maturity", "Light red", "Moderate storage 3 months", "Popular local variety"], resistance: ["Moderate"], suitability: "Maharashtra", seedRate: "5 kg/acre", price: "\u20b9350/kg", score: 75, icon: "\ud83e\uddc5" },
  { id: "v7", crop: "Rice", variety: "Pusa Basmati 1637", developer: "IARI New Delhi", duration: "135 days", yield: "50-55 qtl/ha", features: ["Long slender grain", "Excellent aroma", "Non-lodging", "Export quality"], resistance: ["Blast resistant", "BLB resistant"], suitability: "Irrigated conditions", seedRate: "8 kg/acre (SRI method)", price: "\u20b9120/kg (certified)", score: 93, icon: "\ud83c\udf3e" },
  { id: "v8", crop: "Soybean", variety: "JS 9560", developer: "JNKVV Jabalpur", duration: "95 days", yield: "25-30 qtl/ha", features: ["High oil content 20%", "Semi-determinate", "Pod shattering resistant", "Kharif adapted"], resistance: ["Rust tolerant", "Pod borer moderate"], suitability: "Central India, Maharashtra", seedRate: "30 kg/acre", price: "\u20b980/kg", score: 88, icon: "\ud83c\udf3e" },
  { id: "v9", crop: "Capsicum", variety: "Indra (Syngenta)", developer: "Syngenta", duration: "180 days (harvest window)", yield: "40-50 ton/ha", features: ["Blocky green\u2192red", "Thick wall 7mm", "Greenhouse suited", "Virus tolerant"], resistance: ["TMV", "BW"], suitability: "Protected cultivation", seedRate: "50g/acre (nursery)", price: "\u20b92,500/1000 seeds", score: 91, icon: "\ud83c\udf36\ufe0f" },
];

export default function SeedSelectorScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SeedTab>("recommend");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [search, setSearch] = useState("");

  const crops = ["all", ...new Set(varieties.map((v) => v.crop))];
  const filtered = varieties.filter((v) => {
    const matchesCrop = selectedCrop === "all" || v.crop === selectedCrop;
    const matchesSearch = !search || v.variety.toLowerCase().includes(search.toLowerCase()) || v.crop.toLowerCase().includes(search.toLowerCase());
    return matchesCrop && matchesSearch;
  }).sort((a, b) => b.score - a.score);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83c\udf31"} Seed Variety Selector</Text>
          <Text className="text-typography-400 text-xs">Regional recommendations & comparison</Text>
        </View>
      </View>

      {/* Search */}
      <View className="mx-5 mt-3 mb-2">
        <View className="bg-background-100 rounded-xl px-4 py-2.5 flex-row items-center">
          <Text className="text-typography-400 mr-2">{"\ud83d\udd0d"}</Text>
          <TextInput className="flex-1 text-typography-900 text-sm" placeholder="Search varieties..." placeholderTextColor="#a1a1aa" value={search} onChangeText={setSearch} />
        </View>
      </View>

      {/* Crop Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-10 mx-5 mb-3">
        {crops.map((crop) => (
          <Pressable key={crop} className="rounded-xl px-3 py-2 mr-2" style={selectedCrop === crop ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }} onPress={() => setSelectedCrop(crop)}>
            <Text className={`text-xs font-dm-sans-medium capitalize ${selectedCrop === crop ? "text-white" : "text-typography-500"}`}>
              {crop === "all" ? "All Crops" : crop}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "recommend" && (
          <View className="px-5">
            {filtered.map((variety, i) => {
              const scoreColor = variety.score >= 90 ? "#22c55e" : variety.score >= 80 ? "#84cc16" : variety.score >= 70 ? "#f59e0b" : "#ef4444";
              return (
                <View key={variety.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center flex-1">
                      <Text style={{ fontSize: 24 }}>{variety.icon}</Text>
                      <View className="ml-3 flex-1">
                        <Text className="text-typography-900 font-dm-sans-bold text-sm">{variety.variety}</Text>
                        <Text className="text-typography-500 text-xs">{variety.crop} \u2022 {variety.developer}</Text>
                      </View>
                    </View>
                    <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: scoreColor + "15", borderWidth: 2, borderColor: scoreColor }}>
                      <Text className="font-dm-sans-bold text-sm" style={{ color: scoreColor }}>{variety.score}</Text>
                    </View>
                  </View>

                  {/* Quick specs */}
                  <View className="flex-row gap-2 mb-2">
                    {[
                      { label: "Duration", value: variety.duration.split(" ")[0] + "d" },
                      { label: "Yield", value: variety.yield.split(" ")[0] },
                      { label: "Seed Rate", value: variety.seedRate.split(" ")[0] + " " + variety.seedRate.split(" ")[1] },
                      { label: "Price", value: variety.price.split("/")[0] },
                    ].map((spec, j) => (
                      <View key={j} className="flex-1 bg-background-100 rounded-lg p-1.5 items-center">
                        <Text className="text-typography-800 text-xs font-dm-sans-bold" numberOfLines={1}>{spec.value}</Text>
                        <Text className="text-typography-400" style={{ fontSize: 8 }}>{spec.label}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Features */}
                  <View className="flex-row flex-wrap gap-1 mb-2">
                    {variety.features.slice(0, 3).map((f, j) => (
                      <View key={j} className="bg-green-50 rounded-full px-2 py-0.5">
                        <Text className="text-green-700" style={{ fontSize: 9 }}>{"\u2713"} {f}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Resistance */}
                  <View className="flex-row flex-wrap gap-1 mb-2">
                    {variety.resistance.map((r, j) => (
                      <View key={j} className="bg-blue-50 rounded-full px-2 py-0.5">
                        <Text className="text-blue-700" style={{ fontSize: 9 }}>{"\ud83d\udee1\ufe0f"} {r}</Text>
                      </View>
                    ))}
                  </View>

                  <Text className="text-typography-400 text-xs">{"\ud83d\udccd"} {variety.suitability}</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
