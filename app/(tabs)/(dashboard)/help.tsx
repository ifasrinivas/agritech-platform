import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type HelpTab = "faq" | "guides" | "glossary" | "support";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How does satellite crop monitoring work?",
    answer: "We use Sentinel-2 satellite imagery (10m resolution, revisited every 5 days) to calculate NDVI (Normalized Difference Vegetation Index). NDVI measures the difference between near-infrared light (reflected by healthy vegetation) and red light (absorbed by chlorophyll). Values range from 0 (bare soil) to 1 (dense healthy vegetation). The AI analyzes changes over time to detect stress, disease, and growth patterns.",
  },
  {
    question: "How accurate is the AI disease detection?",
    answer: "Our AI model has been trained on 2M+ crop disease images and achieves 90-95% accuracy for common diseases. It works best with: clear photos in natural daylight, close-up of affected leaves (15-20cm), and both front and back leaf surfaces. The system provides confidence scores - use results above 80% as actionable. Always cross-verify with a field agronomist for critical decisions.",
  },
  {
    question: "What does NDVI score mean for my crop?",
    answer: "NDVI ranges: 0.0-0.2 = Bare soil or dead vegetation. 0.2-0.4 = Sparse or stressed vegetation. 0.4-0.6 = Moderate growth (young crops or stressed). 0.6-0.8 = Healthy, actively growing crops. 0.8-1.0 = Very dense, peak health vegetation. Compare your field's NDVI to the expected range for your crop's growth stage.",
  },
  {
    question: "How are carbon credits calculated?",
    answer: "Carbon credits are measured in tCO\u2082e (tonnes of CO\u2082 equivalent). We calculate based on verified sustainable practices: Cover cropping (~0.5 tCO\u2082e/acre/year), No-till farming (~0.3 tCO\u2082e/acre/year), Drip irrigation (~0.2 tCO\u2082e/acre/year), Organic inputs (~0.15 tCO\u2082e/acre/year). Credits are third-party verified and tradeable on voluntary carbon markets.",
  },
  {
    question: "How does the AI crop advisor choose recommendations?",
    answer: "The AI considers 7 factors: 1) Your soil type and pH, 2) Previous crop (rotation benefit), 3) Available infrastructure (drip, greenhouse), 4) Historical weather patterns, 5) Current market prices and trends, 6) Regional agro-climatic suitability, 7) Your farm's yield history. Each crop gets a composite score (0-100) representing overall suitability.",
  },
  {
    question: "Can I use this app offline?",
    answer: "Yes, partially. Offline features include: viewing last-synced field data, crop calendar, advisory recommendations, pest encyclopedia, and activity logging. Features requiring internet: live satellite data, market prices, weather updates, AI scanning, and notifications. Data syncs automatically when connection is restored. Cached data: ~128 MB.",
  },
  {
    question: "How do IoT sensors connect to the platform?",
    answer: "Sensors communicate via LoRaWAN (long-range, low-power) to a gateway on your farm, which sends data via WiFi/cellular to our cloud. Supported sensors: soil moisture, soil temperature, air temperature/humidity, rain gauge, wind speed, leaf wetness, and EC. Battery life: 2-3 years. Range: up to 3km from gateway.",
  },
  {
    question: "What government schemes am I eligible for?",
    answer: "The platform auto-checks eligibility based on your profile (landholding, location, crops, category). Go to Dashboard > Government Schemes to see all active and applicable schemes. Currently, most farmers are eligible for PM-KISAN (\u20b96,000/yr), PMFBY (crop insurance), Soil Health Card (free testing), and Micro Irrigation Subsidy (55-70% off).",
  },
];

const glossary = [
  { term: "NDVI", definition: "Normalized Difference Vegetation Index. Satellite-derived measure of plant health (0-1)." },
  { term: "ETL", definition: "Economic Threshold Level. Pest density at which control action becomes economically justified." },
  { term: "NPK", definition: "Nitrogen, Phosphorus, Potassium - the three primary macronutrients for plant growth." },
  { term: "EC", definition: "Electrical Conductivity. Measures soil salinity in dS/m. Optimal: 0.2-0.8 dS/m for most crops." },
  { term: "LAI", definition: "Leaf Area Index. Ratio of leaf area to ground area. Indicates canopy density and biomass." },
  { term: "APMC", definition: "Agricultural Produce Market Committee. Government-regulated wholesale markets (mandis)." },
  { term: "MSP", definition: "Minimum Support Price. Government-guaranteed floor price for select crops." },
  { term: "FYM", definition: "Farmyard Manure. Organic manure from cattle dung, typically applied at 5-10 ton/acre." },
  { term: "IPM", definition: "Integrated Pest Management. Holistic approach combining biological, cultural, and chemical control." },
  { term: "Fertigation", definition: "Application of fertilizers through irrigation (drip) system. More efficient than broadcasting." },
  { term: "Brix", definition: "Measure of sugar content in fruit juice. Higher Brix = sweeter fruit. Grapes harvest at Brix > 18." },
  { term: "tCO\u2082e", definition: "Tonnes of CO\u2082 equivalent. Standard unit for measuring carbon credits." },
  { term: "DAP", definition: "Di-Ammonium Phosphate (18-46-0). Most common phosphatic fertilizer." },
  { term: "MOP", definition: "Muriate of Potash (60% K\u2082O). Standard potassic fertilizer." },
  { term: "WP/SC/EC/SL", definition: "Pesticide formulations: Wettable Powder, Suspension Concentrate, Emulsifiable Concentrate, Soluble Liquid." },
];

export default function HelpScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<HelpTab>("faq");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\u2753"} Help & Support
          </Text>
          <Text className="text-typography-400 text-xs">FAQs, guides & glossary</Text>
        </View>
      </View>

      <View className="flex-row mx-5 mt-3 mb-3 bg-background-100 rounded-xl p-1">
        {(["faq", "guides", "glossary", "support"] as HelpTab[]).map((tab) => (
          <Pressable
            key={tab}
            className="flex-1 items-center py-2 rounded-lg"
            style={activeTab === tab ? { backgroundColor: "#16a34a" } : {}}
            onPress={() => setActiveTab(tab)}
          >
            <Text className={`text-xs font-dm-sans-medium capitalize ${activeTab === tab ? "text-white" : "text-typography-500"}`}>
              {tab === "faq" ? "FAQ" : tab === "guides" ? "Guides" : tab === "glossary" ? "Glossary" : "Support"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "faq" && (
          <View className="px-5">
            {faqs.map((faq, i) => (
              <Pressable key={i} onPress={() => setExpandedFAQ(expandedFAQ === i ? null : i)}>
                <View className="bg-background-50 rounded-xl p-4 mb-2 border border-outline-100">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm flex-1 pr-3">
                      {faq.question}
                    </Text>
                    <Text className="text-typography-400 text-lg">
                      {expandedFAQ === i ? "\u2303" : "\u2304"}
                    </Text>
                  </View>
                  {expandedFAQ === i && (
                    <Text className="text-typography-600 text-xs leading-5 mt-3 pt-3 border-t border-outline-100">
                      {faq.answer}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {activeTab === "guides" && (
          <View className="px-5">
            {[
              { title: "Getting Started", desc: "Set up your farm, add fields, connect sensors", icon: "\ud83d\ude80", duration: "5 min", color: "#22c55e" },
              { title: "Understanding Satellite Data", desc: "NDVI, moisture, temperature layers explained", icon: "\ud83d\udef0\ufe0f", duration: "8 min", color: "#8b5cf6" },
              { title: "AI Crop Doctor Tutorial", desc: "How to take photos for best detection results", icon: "\ud83d\udd2c", duration: "3 min", color: "#ef4444" },
              { title: "Soil Health Masterclass", desc: "pH, NPK, organic carbon - what they mean", icon: "\ud83e\udea8", duration: "10 min", color: "#f59e0b" },
              { title: "Setting Up IoT Sensors", desc: "Installation, calibration, and automation rules", icon: "\ud83d\udce1", duration: "12 min", color: "#3b82f6" },
              { title: "Carbon Credit Guide", desc: "How to earn and trade carbon credits", icon: "\ud83c\udf0d", duration: "7 min", color: "#06b6d4" },
              { title: "Market Intelligence", desc: "Using price forecasts and sell timing", icon: "\ud83d\udcb9", duration: "5 min", color: "#22c55e" },
              { title: "Government Schemes", desc: "How to apply for subsidies and insurance", icon: "\ud83c\udfe6", duration: "6 min", color: "#f97316" },
            ].map((guide, i) => (
              <Pressable key={i}>
                <View className="bg-background-50 rounded-xl p-4 mb-2 border border-outline-100 flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: guide.color + "15" }}
                  >
                    <Text style={{ fontSize: 22 }}>{guide.icon}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{guide.title}</Text>
                    <Text className="text-typography-500 text-xs">{guide.desc}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-typography-400 text-xs">{guide.duration}</Text>
                    <Text className="text-typography-400 text-lg">{"\u203a"}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {activeTab === "glossary" && (
          <View className="px-5">
            {glossary.map((item, i) => (
              <View key={i} className="py-3" style={i < glossary.length - 1 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.term}</Text>
                <Text className="text-typography-600 text-xs leading-4 mt-0.5">{item.definition}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "support" && (
          <View className="px-5">
            {[
              { label: "Chat with Agri Expert", desc: "Live chat with certified agronomist (9AM-6PM)", icon: "\ud83d\udcac", color: "#22c55e" },
              { label: "Call Helpline", desc: "1800-XXX-XXXX (toll free)", icon: "\ud83d\udcde", color: "#3b82f6" },
              { label: "WhatsApp Support", desc: "+91 XXXXX XXXXX", icon: "\ud83d\udce9", color: "#25D366" },
              { label: "Email Support", desc: "support@agritech.app", icon: "\ud83d\udce7", color: "#f59e0b" },
              { label: "Report a Bug", desc: "Help us improve the platform", icon: "\ud83d\udc1b", color: "#ef4444" },
              { label: "Feature Request", desc: "Suggest new features", icon: "\ud83d\udca1", color: "#8b5cf6" },
            ].map((item, i) => (
              <Pressable key={i}>
                <View className="bg-background-50 rounded-xl p-4 mb-3 border border-outline-100 flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: item.color + "15" }}
                  >
                    <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.label}</Text>
                    <Text className="text-typography-500 text-xs">{item.desc}</Text>
                  </View>
                  <Text className="text-typography-400 text-lg">{"\u203a"}</Text>
                </View>
              </Pressable>
            ))}

            <View className="bg-background-50 rounded-2xl p-4 border border-outline-100 mt-4">
              <Text className="text-typography-900 font-dm-sans-bold text-sm mb-2">App Information</Text>
              {[
                { label: "Version", value: "1.0.0 (Build 2026.04.02)" },
                { label: "Platform", value: "React Native + Expo" },
                { label: "Satellite Provider", value: "Sentinel-2 (ESA)" },
                { label: "AI Model", value: "CropNet v3.2 (94% accuracy)" },
                { label: "Data Center", value: "AWS Mumbai (ap-south-1)" },
                { label: "Privacy", value: "DPDP Act 2023 Compliant" },
              ].map((item, i) => (
                <View key={i} className="flex-row justify-between py-1.5" style={i < 5 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                  <Text className="text-typography-500 text-xs">{item.label}</Text>
                  <Text className="text-typography-700 text-xs font-dm-sans-medium">{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
