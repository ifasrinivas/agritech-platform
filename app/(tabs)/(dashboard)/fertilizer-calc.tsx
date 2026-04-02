import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type CalcTab = "calculator" | "schedule" | "organic" | "deficiency";

interface NutrientReq {
  crop: string;
  n: number;
  p: number;
  k: number;
  icon: string;
}

const cropNutrients: NutrientReq[] = [
  { crop: "Wheat", n: 120, p: 60, k: 40, icon: "\ud83c\udf3e" },
  { crop: "Rice", n: 100, p: 50, k: 50, icon: "\ud83c\udf3e" },
  { crop: "Tomato", n: 150, p: 80, k: 80, icon: "\ud83c\udf45" },
  { crop: "Onion", n: 100, p: 50, k: 60, icon: "\ud83e\uddc5" },
  { crop: "Grapes", n: 200, p: 100, k: 200, icon: "\ud83c\udf47" },
  { crop: "Capsicum", n: 180, p: 90, k: 90, icon: "\ud83c\udf36\ufe0f" },
  { crop: "Soybean", n: 30, p: 60, k: 40, icon: "\ud83c\udf3e" },
  { crop: "Maize", n: 120, p: 60, k: 40, icon: "\ud83c\udf3d" },
];

export default function FertilizerCalcScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CalcTab>("calculator");
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [area, setArea] = useState("10");
  const [soilN, setSoilN] = useState("280");
  const [soilP, setSoilP] = useState("22");
  const [soilK, setSoilK] = useState("185");

  const crop = cropNutrients.find((c) => c.crop === selectedCrop) || cropNutrients[0];
  const areaVal = parseFloat(area) || 0;

  // Soil test based adjustment (simplified)
  const soilNVal = parseFloat(soilN) || 0;
  const soilPVal = parseFloat(soilP) || 0;
  const soilKVal = parseFloat(soilK) || 0;

  const nDeficit = Math.max(crop.n - (soilNVal > 300 ? crop.n * 0.7 : soilNVal > 200 ? crop.n * 0.4 : 0), 0);
  const pDeficit = Math.max(crop.p - (soilPVal > 30 ? crop.p * 0.5 : soilPVal > 15 ? crop.p * 0.2 : 0), 0);
  const kDeficit = Math.max(crop.k - (soilKVal > 200 ? crop.k * 0.5 : soilKVal > 100 ? crop.k * 0.2 : 0), 0);

  // Calculate fertilizer quantities
  const ureaKg = (nDeficit / 0.46).toFixed(1); // 46% N
  const dapKg = (pDeficit / 0.46).toFixed(1); // 46% P2O5
  const mopKg = (kDeficit / 0.60).toFixed(1); // 60% K2O
  const dapN = parseFloat(dapKg) * 0.18; // DAP also provides 18% N
  const adjustedUrea = Math.max(parseFloat(ureaKg) - (dapN / 0.46), 0).toFixed(1);

  const totalUrea = (parseFloat(adjustedUrea) * areaVal).toFixed(0);
  const totalDAP = (parseFloat(dapKg) * areaVal).toFixed(0);
  const totalMOP = (parseFloat(mopKg) * areaVal).toFixed(0);

  const ureaCost = Math.round(parseFloat(totalUrea) / 45 * 266);
  const dapCost = Math.round(parseFloat(totalDAP) / 50 * 1350);
  const mopCost = Math.round(parseFloat(totalMOP) / 50 * 850);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83e\udea4"} Fertilizer Calculator</Text>
          <Text className="text-typography-400 text-xs">Soil-test based nutrient recommendations</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-12 mx-5 mt-3 mb-2">
        {([
          { key: "calculator" as CalcTab, label: "\ud83e\uddee Calculator" },
          { key: "schedule" as CalcTab, label: "\ud83d\udcc5 Split Schedule" },
          { key: "organic" as CalcTab, label: "\ud83c\udf3f Organic" },
          { key: "deficiency" as CalcTab, label: "\u26a0\ufe0f Deficiency Guide" },
        ]).map((tab) => (
          <Pressable key={tab.key} className="rounded-xl px-4 py-2 mr-2" style={activeTab === tab.key ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }} onPress={() => setActiveTab(tab.key)}>
            <Text className={`text-xs font-dm-sans-medium ${activeTab === tab.key ? "text-white" : "text-typography-500"}`}>{tab.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "calculator" && (
          <View className="px-5">
            {/* Crop Selection */}
            <View className="mb-4">
              <Text className="text-typography-700 text-sm font-dm-sans-medium mb-2">Select Crop</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {cropNutrients.map((c) => (
                    <Pressable key={c.crop} onPress={() => setSelectedCrop(c.crop)}>
                      <View className="rounded-xl px-3 py-2 items-center" style={selectedCrop === c.crop ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }}>
                        <Text style={{ fontSize: 18 }}>{c.icon}</Text>
                        <Text className={`text-xs font-dm-sans-medium mt-0.5 ${selectedCrop === c.crop ? "text-white" : "text-typography-600"}`}>{c.crop}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Inputs */}
            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mb-4">
              <Text className="text-typography-900 font-dm-sans-bold text-sm mb-3">Input Parameters</Text>
              <View className="flex-row gap-3 mb-3">
                <View className="flex-1">
                  <Text className="text-typography-600 text-xs mb-1">Area (acres)</Text>
                  <TextInput className="bg-background-100 rounded-xl px-3 py-2 text-typography-900 text-sm" value={area} onChangeText={setArea} keyboardType="decimal-pad" placeholderTextColor="#a1a1aa" />
                </View>
              </View>
              <Text className="text-typography-700 text-xs font-dm-sans-bold mb-2">Soil Test Values (your last report)</Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-typography-600 text-xs mb-1">N (kg/ha)</Text>
                  <TextInput className="bg-background-100 rounded-xl px-3 py-2 text-typography-900 text-sm" value={soilN} onChangeText={setSoilN} keyboardType="decimal-pad" placeholderTextColor="#a1a1aa" />
                </View>
                <View className="flex-1">
                  <Text className="text-typography-600 text-xs mb-1">P (kg/ha)</Text>
                  <TextInput className="bg-background-100 rounded-xl px-3 py-2 text-typography-900 text-sm" value={soilP} onChangeText={setSoilP} keyboardType="decimal-pad" placeholderTextColor="#a1a1aa" />
                </View>
                <View className="flex-1">
                  <Text className="text-typography-600 text-xs mb-1">K (kg/ha)</Text>
                  <TextInput className="bg-background-100 rounded-xl px-3 py-2 text-typography-900 text-sm" value={soilK} onChangeText={setSoilK} keyboardType="decimal-pad" placeholderTextColor="#a1a1aa" />
                </View>
              </View>
            </View>

            {/* Crop Requirement */}
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-4">
              <Text className="text-blue-800 font-dm-sans-bold text-sm mb-2">{crop.icon} {crop.crop} - Standard NPK Requirement</Text>
              <View className="flex-row gap-3">
                {[
                  { label: "Nitrogen (N)", value: crop.n, color: "#3b82f6" },
                  { label: "Phosphorus (P)", value: crop.p, color: "#8b5cf6" },
                  { label: "Potassium (K)", value: crop.k, color: "#f97316" },
                ].map((item, i) => (
                  <View key={i} className="flex-1 bg-white rounded-xl p-2 items-center">
                    <Text className="font-dm-sans-bold text-lg" style={{ color: item.color }}>{item.value}</Text>
                    <Text className="text-typography-400 text-xs">kg/ha</Text>
                    <Text className="text-typography-500" style={{ fontSize: 9 }}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Recommendation */}
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
              <Text className="text-green-800 font-dm-sans-bold text-base mb-3">
                {"\ud83e\udde0"} Recommended Fertilizers for {areaVal} acres
              </Text>

              {[
                { name: "Urea (46% N)", qty: `${totalUrea} kg`, bags: `${(parseFloat(totalUrea) / 45).toFixed(1)} bags`, cost: `\u20b9${ureaCost.toLocaleString()}`, color: "#3b82f6", perAcre: `${adjustedUrea} kg/acre` },
                { name: "DAP (18-46-0)", qty: `${totalDAP} kg`, bags: `${(parseFloat(totalDAP) / 50).toFixed(1)} bags`, cost: `\u20b9${dapCost.toLocaleString()}`, color: "#8b5cf6", perAcre: `${dapKg} kg/acre` },
                { name: "MOP (60% K\u2082O)", qty: `${totalMOP} kg`, bags: `${(parseFloat(totalMOP) / 50).toFixed(1)} bags`, cost: `\u20b9${mopCost.toLocaleString()}`, color: "#f97316", perAcre: `${mopKg} kg/acre` },
              ].map((fert, i) => (
                <View key={i} className="bg-white rounded-xl p-3 mb-2">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{fert.name}</Text>
                    <Text className="font-dm-sans-bold text-sm" style={{ color: fert.color }}>{fert.cost}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-typography-500 text-xs">{fert.qty} ({fert.bags})</Text>
                    <Text className="text-typography-400 text-xs ml-2">\u2022 {fert.perAcre}</Text>
                  </View>
                </View>
              ))}

              <View className="bg-white rounded-xl p-3 mt-1 flex-row items-center justify-between">
                <Text className="text-green-800 font-dm-sans-bold text-sm">Total Fertilizer Cost</Text>
                <Text className="text-green-800 font-dm-sans-bold text-lg">
                  {"\u20b9"}{(ureaCost + dapCost + mopCost).toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Application Notes */}
            <View className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
              <Text className="text-yellow-800 font-dm-sans-bold text-sm mb-2">{"\ud83d\udca1"} Application Guidelines</Text>
              {[
                "Apply full DAP + 1/3 Urea + full MOP as basal dose at sowing",
                "2nd Urea split at 25-30 DAS (tillering/vegetative stage)",
                "3rd Urea split at 50-55 DAS (panicle initiation/flowering)",
                "Incorporate basal dose into soil, do not surface broadcast",
                "Irrigate immediately after top-dressing Urea for absorption",
                "Never mix Urea with DAP - apply separately",
              ].map((note, i) => (
                <Text key={i} className="text-yellow-700 text-xs leading-5">{i + 1}. {note}</Text>
              ))}
            </View>
          </View>
        )}

        {activeTab === "schedule" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Split Application Schedule</Text>

            {[
              {
                stage: "Basal (At Sowing)",
                timing: "Day 0",
                fertilizers: [
                  { name: "DAP", amount: "Full dose (100%)", reason: "Phosphorus needed early for root development" },
                  { name: "MOP", amount: "Full dose (100%)", reason: "Potassium for cell structure from start" },
                  { name: "Urea", amount: "1/3 of total (33%)", reason: "Initial nitrogen for germination" },
                ],
                method: "Incorporate into soil at 5-8cm depth along seed rows",
                color: "#22c55e", icon: "\ud83c\udf31",
              },
              {
                stage: "1st Top Dressing",
                timing: "Day 25-30 (Tillering/Vegetative)",
                fertilizers: [
                  { name: "Urea", amount: "1/3 of total (33%)", reason: "Vigorous vegetative growth phase" },
                ],
                method: "Broadcast in standing crop. Irrigate within 24 hours. Apply in evening.",
                color: "#3b82f6", icon: "\ud83c\udf3f",
              },
              {
                stage: "2nd Top Dressing",
                timing: "Day 50-55 (Flowering/Panicle)",
                fertilizers: [
                  { name: "Urea", amount: "Remaining 1/3 (34%)", reason: "Grain filling and yield determination" },
                ],
                method: "Broadcast or fertigation. Critical timing - do not skip.",
                color: "#f59e0b", icon: "\ud83c\udf3e",
              },
              {
                stage: "Micronutrient Spray",
                timing: "Day 35-40",
                fertilizers: [
                  { name: "ZnSO4 0.5%", amount: "2.5g/L spray", reason: "Zinc essential for grain development" },
                  { name: "FeSO4 1%", amount: "10g/L spray (if deficient)", reason: "Iron for chlorophyll, if yellowing observed" },
                ],
                method: "Foliar spray in early morning. 500L solution/acre.",
                color: "#8b5cf6", icon: "\ud83d\udca7",
              },
            ].map((stage, i) => (
              <View key={i} className="flex-row mb-4">
                <View className="items-center w-8">
                  <View className="w-4 h-4 rounded-full z-10" style={{ backgroundColor: stage.color }} />
                  {i < 3 && <View className="w-0.5 flex-1" style={{ backgroundColor: stage.color + "30" }} />}
                </View>
                <View className="flex-1 ml-3">
                  <View className="rounded-2xl p-4 border" style={{ backgroundColor: stage.color + "06", borderColor: stage.color + "20" }}>
                    <View className="flex-row items-center mb-2">
                      <Text style={{ fontSize: 18 }}>{stage.icon}</Text>
                      <View className="ml-2">
                        <Text className="text-typography-900 font-dm-sans-bold text-sm">{stage.stage}</Text>
                        <Text className="text-typography-400 text-xs">{stage.timing}</Text>
                      </View>
                    </View>

                    {stage.fertilizers.map((f, j) => (
                      <View key={j} className="bg-white rounded-lg p-2 mb-1">
                        <View className="flex-row items-center justify-between">
                          <Text className="text-typography-800 text-xs font-dm-sans-bold">{f.name}</Text>
                          <Text className="text-xs font-dm-sans-medium" style={{ color: stage.color }}>{f.amount}</Text>
                        </View>
                        <Text className="text-typography-400 text-xs">{f.reason}</Text>
                      </View>
                    ))}

                    <View className="bg-background-100 rounded-lg p-2 mt-1">
                      <Text className="text-typography-500 text-xs">{"\ud83d\udee0\ufe0f"} {stage.method}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "organic" && (
          <View className="px-5">
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
              <Text className="text-green-800 font-dm-sans-bold text-sm">{"\ud83c\udf3f"} Organic Nutrient Equivalents</Text>
              <Text className="text-green-600 text-xs mt-1">Replace or supplement chemical fertilizers with organic inputs</Text>
            </View>

            {[
              {
                name: "Farmyard Manure (FYM)", nutrient: "0.5% N, 0.2% P, 0.5% K", rate: "5-10 ton/acre",
                equivalent: "Replaces 25-50 kg Urea + 20 kg SSP + 40 kg MOP per acre",
                benefits: ["Improves soil structure", "Increases organic carbon by 0.1-0.2%", "Enhances water holding capacity", "Supports soil microbes"],
                cost: "\u20b93,000-5,000/ton", icon: "\ud83d\udca9",
              },
              {
                name: "Vermicompost", nutrient: "1.5% N, 0.5% P, 0.8% K", rate: "2-3 ton/acre",
                equivalent: "Replaces 65 kg Urea + 25 kg SSP + 25 kg MOP per acre",
                benefits: ["Rich in plant growth hormones", "Contains beneficial microbes", "Slow-release nutrients", "Higher NPK than FYM"],
                cost: "\u20b96,000-8,000/ton", icon: "\ud83e\udeb1",
              },
              {
                name: "Jeevamrutha (Liquid)", nutrient: "Bio-stimulant (indirect nutrition)", rate: "200L/acre via drip, every 15 days",
                equivalent: "Activates soil microbial activity = better nutrient availability",
                benefits: ["Boosts soil biology", "Zero cost (farm-made)", "Improves root development", "Disease suppressive"],
                cost: "Free (DIY: 10kg dung + 10L urine + 2kg jaggery + 2kg pulse flour)", icon: "\ud83e\udded",
              },
              {
                name: "Neem Cake", nutrient: "5% N, 1% P, 1.5% K", rate: "200-400 kg/acre",
                equivalent: "Replaces 45 kg Urea + 5 kg SSP + 10 kg MOP + pest repellent",
                benefits: ["Slow-release nitrogen", "Nitrification inhibitor (less N loss)", "Nematode suppressive", "Soil pest control"],
                cost: "\u20b91,500-2,000/quintal", icon: "\ud83c\udf3f",
              },
              {
                name: "Green Manuring (Dhaincha/Sunhemp)", nutrient: "Fixes 25-30 kg N/acre", rate: "Sow @ 20 kg seed/acre, incorporate at 45 days",
                equivalent: "Replaces 55-65 kg Urea + adds organic matter",
                benefits: ["Free nitrogen from atmosphere", "Adds biomass to soil", "Suppresses weeds", "Improves soil structure"],
                cost: "\u20b9400-600 (seed only)", icon: "\ud83c\udf31",
              },
            ].map((organic, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center mb-2">
                  <Text style={{ fontSize: 22 }}>{organic.icon}</Text>
                  <View className="ml-3 flex-1">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{organic.name}</Text>
                    <Text className="text-typography-500 text-xs">{organic.nutrient}</Text>
                  </View>
                  <Text className="text-green-600 text-xs font-dm-sans-bold">{organic.rate}</Text>
                </View>

                <View className="bg-green-50 rounded-lg p-2 mb-2">
                  <Text className="text-green-700 text-xs font-dm-sans-medium">{"\u2194\ufe0f"} {organic.equivalent}</Text>
                </View>

                <View className="flex-row flex-wrap gap-1 mb-2">
                  {organic.benefits.map((b, j) => (
                    <View key={j} className="bg-background-100 rounded-full px-2 py-0.5">
                      <Text className="text-typography-600" style={{ fontSize: 9 }}>{"\u2022"} {b}</Text>
                    </View>
                  ))}
                </View>

                <Text className="text-typography-400 text-xs">{"\ud83d\udcb0"} Cost: {organic.cost}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "deficiency" && (
          <View className="px-5">
            <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Visual Nutrient Deficiency Guide</Text>

            {[
              { nutrient: "Nitrogen (N)", symptoms: "General yellowing of older/lower leaves first. Stunted growth. Pale green canopy.", correction: "Foliar: 2% Urea spray. Soil: Urea top-dress + irrigate.", icon: "\ud83d\udfe1", color: "#eab308" },
              { nutrient: "Phosphorus (P)", symptoms: "Purple/reddish discoloration of leaves. Poor root development. Delayed maturity.", correction: "Soil: DAP/SSP near root zone. Foliar: 2% DAP spray.", icon: "\ud83d\udfe3", color: "#8b5cf6" },
              { nutrient: "Potassium (K)", symptoms: "Scorching/browning of leaf margins (older leaves). Weak stems. Poor fruit quality.", correction: "Soil: MOP broadcast + irrigate. Foliar: 1% KCl spray.", icon: "\ud83d\udfe0", color: "#f97316" },
              { nutrient: "Zinc (Zn)", symptoms: "Interveinal chlorosis on young leaves. Stunted internodes (khaira disease in rice).", correction: "Foliar: ZnSO4 0.5% + lime 0.25% spray. Soil: ZnSO4 10 kg/acre.", icon: "\u26aa", color: "#6b7280" },
              { nutrient: "Iron (Fe)", symptoms: "Interveinal chlorosis on youngest leaves (veins stay green). White/yellow new growth.", correction: "Foliar: FeSO4 1% + citric acid 0.1%. Soil: FeSO4 10 kg/acre.", icon: "\ud83d\udfe2", color: "#22c55e" },
              { nutrient: "Boron (B)", symptoms: "Hollow stem in brassicas. Cracked/corky fruits. Poor fruit set.", correction: "Foliar: Borax 0.2% spray. Soil: Borax 2-4 kg/acre.", icon: "\ud83d\udd35", color: "#3b82f6" },
              { nutrient: "Calcium (Ca)", symptoms: "Blossom End Rot in tomato/capsicum. Tip burn in lettuce. Pit on apple.", correction: "Foliar: CaCl2 0.5% spray at fruiting. Soil: Gypsum/lime application.", icon: "\u26aa", color: "#d4d4d4" },
              { nutrient: "Sulphur (S)", symptoms: "Uniform yellowing of younger leaves (similar to N but on NEW growth). Thin stems.", correction: "Soil: Gypsum/Ammonium sulphate. Foliar: MgSO4 1% spray.", icon: "\ud83d\udfe1", color: "#ca8a04" },
            ].map((item, i) => (
              <View key={i} className="bg-background-50 rounded-2xl p-4 mb-3 border-l-4" style={{ borderLeftColor: item.color }}>
                <View className="flex-row items-center mb-2">
                  <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                  <Text className="text-typography-900 font-dm-sans-bold text-sm ml-2">{item.nutrient}</Text>
                </View>
                <View className="bg-red-50 rounded-lg p-2 mb-2">
                  <Text className="text-red-700 text-xs font-dm-sans-medium">{"\ud83d\udd0d"} Symptoms: {item.symptoms}</Text>
                </View>
                <View className="bg-green-50 rounded-lg p-2">
                  <Text className="text-green-700 text-xs font-dm-sans-medium">{"\ud83d\udc8a"} Correction: {item.correction}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
