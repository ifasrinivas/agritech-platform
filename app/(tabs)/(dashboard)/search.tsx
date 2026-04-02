import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fields, alerts, cropCalendar, advisories, irrigationSchedules } from "@/data/agritech";
import { marketPrices, pestEncyclopedia } from "@/data/market";

interface SearchResult {
  id: string;
  type: "field" | "alert" | "advisory" | "pest" | "market" | "calendar" | "screen" | "irrigation";
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route: string;
  params?: Record<string, string>;
}

const screenIndex: SearchResult[] = [
  { id: "sc1", type: "screen", title: "Dashboard", subtitle: "Farm overview & quick stats", icon: "\ud83c\udfe1", color: "#22c55e", route: "/(tabs)/(dashboard)" },
  { id: "sc2", type: "screen", title: "Satellite Analysis", subtitle: "NDVI, moisture, temperature layers", icon: "\ud83d\udef0\ufe0f", color: "#8b5cf6", route: "/(tabs)/(dashboard)/satellite" },
  { id: "sc3", type: "screen", title: "Market Prices", subtitle: "APMC prices & AI forecasts", icon: "\ud83d\udcb9", color: "#22c55e", route: "/(tabs)/(dashboard)/market" },
  { id: "sc4", type: "screen", title: "Weather Detail", subtitle: "Hourly forecast & farm impact", icon: "\u26c5", color: "#3b82f6", route: "/(tabs)/(dashboard)/weather-detail" },
  { id: "sc5", type: "screen", title: "Farm Planner", subtitle: "Season planning, rotation & budget", icon: "\ud83d\udccb", color: "#f59e0b", route: "/(tabs)/(dashboard)/farm-planner" },
  { id: "sc6", type: "screen", title: "Analytics & Reports", subtitle: "Yield predictions, financial trends", icon: "\ud83d\udcca", color: "#ef4444", route: "/(tabs)/(dashboard)/analytics" },
  { id: "sc7", type: "screen", title: "AI Crop Doctor", subtitle: "Photo-based disease detection", icon: "\ud83d\udd2c", color: "#dc2626", route: "/(tabs)/scan" },
  { id: "sc8", type: "screen", title: "Pest Encyclopedia", subtitle: "Disease & pest database", icon: "\ud83d\udcda", color: "#f97316", route: "/(tabs)/(dashboard)/pest-encyclopedia" },
  { id: "sc9", type: "screen", title: "IoT Sensors", subtitle: "Real-time field monitoring", icon: "\ud83d\udce1", color: "#059669", route: "/(tabs)/(dashboard)/sensors" },
  { id: "sc10", type: "screen", title: "Government Schemes", subtitle: "Subsidies & insurance", icon: "\ud83c\udfe6", color: "#f97316", route: "/(tabs)/(dashboard)/schemes" },
  { id: "sc11", type: "screen", title: "AI Crop Advisor", subtitle: "Smart crop recommendations", icon: "\ud83e\udde0", color: "#6366f1", route: "/(tabs)/(dashboard)/crop-advisor" },
  { id: "sc12", type: "screen", title: "AgriMarketplace", subtitle: "Buy, sell & rent farm essentials", icon: "\ud83d\uded2", color: "#7c3aed", route: "/(tabs)/(dashboard)/marketplace" },
  { id: "sc13", type: "screen", title: "Activity Log", subtitle: "Farm diary & expense tracker", icon: "\ud83d\udcdd", color: "#06b6d4", route: "/(tabs)/(dashboard)/activity-log" },
  { id: "sc14", type: "screen", title: "Carbon Credits", subtitle: "Sustainability tracking", icon: "\ud83c\udf0d", color: "#06b6d4", route: "/(tabs)/profile" },
  { id: "sc15", type: "screen", title: "Irrigation Control", subtitle: "Smart valve & schedule management", icon: "\ud83d\udca7", color: "#3b82f6", route: "/(tabs)/(dashboard)/irrigation-control" },
  { id: "sc16", type: "screen", title: "Harvest Tracker", subtitle: "Yield recording & quality grading", icon: "\ud83c\udf3e", color: "#f59e0b", route: "/(tabs)/(dashboard)/harvest-tracker" },
  { id: "sc17", type: "screen", title: "Drone Planner", subtitle: "Survey missions & flight paths", icon: "\ud83d\ude81", color: "#8b5cf6", route: "/(tabs)/(dashboard)/drone-planner" },
  { id: "sc18", type: "screen", title: "Farm Map", subtitle: "Interactive field map with overlays", icon: "\ud83d\uddfa\ufe0f", color: "#22c55e", route: "/(tabs)/(dashboard)/farm-map" },
  { id: "sc19", type: "screen", title: "Community", subtitle: "Farmer network & expert Q&A", icon: "\ud83d\udc65", color: "#f59e0b", route: "/(tabs)/(dashboard)/community" },
  { id: "sc20", type: "screen", title: "Spray Planner", subtitle: "Schedule, PHI tracking & weather windows", icon: "\ud83d\udca8", color: "#8b5cf6", route: "/(tabs)/(dashboard)/spray-planner" },
  { id: "sc21", type: "screen", title: "Inventory", subtitle: "Stock management & procurement", icon: "\ud83d\udce6", color: "#f97316", route: "/(tabs)/(dashboard)/inventory" },
  { id: "sc22", type: "screen", title: "Crop Insurance", subtitle: "PMFBY claims & evidence", icon: "\ud83d\udee1\ufe0f", color: "#3b82f6", route: "/(tabs)/(dashboard)/insurance-claim" },
  { id: "sc23", type: "screen", title: "Equipment", subtitle: "Machinery, maintenance & fuel", icon: "\ud83d\ude9c", color: "#f59e0b", route: "/(tabs)/(dashboard)/equipment" },
  { id: "sc24", type: "screen", title: "Contract Farming", subtitle: "Contracts, FPO & partnerships", icon: "\ud83e\udd1d", color: "#22c55e", route: "/(tabs)/(dashboard)/contract-farming" },
  { id: "sc25", type: "screen", title: "Finance Tools", subtitle: "Calculators, loans & budgeting", icon: "\ud83e\uddee", color: "#f59e0b", route: "/(tabs)/(dashboard)/finance-tools" },
  { id: "sc26", type: "screen", title: "Labor Management", subtitle: "Roster, attendance & payroll", icon: "\ud83d\udc77", color: "#3b82f6", route: "/(tabs)/(dashboard)/labor-management" },
  { id: "sc27", type: "screen", title: "Soil Testing", subtitle: "Order tests, results & labs", icon: "\ud83e\udea8", color: "#8b5cf6", route: "/(tabs)/(dashboard)/soil-testing" },
  { id: "sc28", type: "screen", title: "Export Docs", subtitle: "Compliance & traceability", icon: "\ud83d\udce6", color: "#06b6d4", route: "/(tabs)/(dashboard)/export-docs" },
  { id: "sc29", type: "screen", title: "Alert Config", subtitle: "Custom alert rules & channels", icon: "\ud83d\udd14", color: "#ef4444", route: "/(tabs)/(dashboard)/alert-config" },
  { id: "sc30", type: "screen", title: "Training", subtitle: "Courses & certifications", icon: "\ud83c\udf93", color: "#7c3aed", route: "/(tabs)/(dashboard)/training" },
  { id: "sc31", type: "screen", title: "Season Compare", subtitle: "Historical data & trends", icon: "\ud83d\udcc8", color: "#22c55e", route: "/(tabs)/(dashboard)/season-compare" },
  { id: "sc32", type: "screen", title: "Language Settings", subtitle: "Multi-language & accessibility", icon: "\ud83c\udf10", color: "#3b82f6", route: "/(tabs)/(dashboard)/language-settings" },
  { id: "sc33", type: "screen", title: "Fertilizer Calculator", subtitle: "Soil-test based NPK recommendations", icon: "\ud83e\udea4", color: "#22c55e", route: "/(tabs)/(dashboard)/fertilizer-calc" },
  { id: "sc34", type: "screen", title: "Field Scouting", subtitle: "Crop walk reports & observations", icon: "\ud83d\udeb6", color: "#3b82f6", route: "/(tabs)/(dashboard)/field-scouting" },
  { id: "sc35", type: "screen", title: "Farm Passport", subtitle: "Digital farm identity card", icon: "\ud83c\udff7\ufe0f", color: "#16a34a", route: "/(tabs)/(dashboard)/farm-passport" },
  { id: "sc36", type: "screen", title: "Water Management", subtitle: "Borewell, quality & rainwater", icon: "\ud83d\udca7", color: "#06b6d4", route: "/(tabs)/(dashboard)/water-management" },
  { id: "sc37", type: "screen", title: "Livestock & Dairy", subtitle: "Herd, dairy & farm integration", icon: "\ud83d\udc04", color: "#f59e0b", route: "/(tabs)/(dashboard)/livestock" },
  { id: "sc38", type: "screen", title: "Daily Tasks", subtitle: "Farm to-do checklist & AI suggestions", icon: "\u2611\ufe0f", color: "#22c55e", route: "/(tabs)/(dashboard)/daily-tasks" },
  { id: "sc39", type: "screen", title: "Seed Selector", subtitle: "Variety recommendations & comparison", icon: "\ud83c\udf31", color: "#8b5cf6", route: "/(tabs)/(dashboard)/seed-selector" },
  { id: "sc40", type: "screen", title: "Post-Harvest", subtitle: "Storage, processing & value addition", icon: "\ud83c\udfe0", color: "#f97316", route: "/(tabs)/(dashboard)/post-harvest" },
  { id: "sc41", type: "screen", title: "Credit Tracker", subtitle: "Agri-loans, KCC & repayment", icon: "\ud83c\udfe6", color: "#3b82f6", route: "/(tabs)/(dashboard)/credit-tracker" },
  { id: "sc42", type: "screen", title: "Compliance & Safety", subtitle: "Safety protocols & audit trail", icon: "\u2611\ufe0f", color: "#ef4444", route: "/(tabs)/(dashboard)/compliance" },
  { id: "sc43", type: "screen", title: "Boundary Tool", subtitle: "GPS measurement & survey records", icon: "\ud83d\udccf", color: "#22c55e", route: "/(tabs)/(dashboard)/boundary-tool" },
];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const allResults = useMemo<SearchResult[]>(() => {
    const results: SearchResult[] = [];

    // Fields
    fields.forEach((f) => {
      results.push({
        id: `field-${f.id}`, type: "field",
        title: f.name, subtitle: `${f.crop} \u2022 ${f.area}ac \u2022 NDVI: ${f.ndviScore}`,
        icon: "\ud83c\udf31", color: "#22c55e",
        route: "/(tabs)/(dashboard)/field-detail", params: { id: f.id },
      });
    });

    // Alerts
    alerts.forEach((a) => {
      results.push({
        id: `alert-${a.id}`, type: "alert",
        title: a.title, subtitle: `${a.severity.toUpperCase()} \u2022 ${a.fieldName}`,
        icon: "\u26a0\ufe0f", color: "#ef4444",
        route: "/(tabs)/(dashboard)/alert-detail", params: { id: a.id },
      });
    });

    // Market
    marketPrices.forEach((m) => {
      results.push({
        id: `market-${m.id}`, type: "market",
        title: `${m.commodity} (${m.variety})`, subtitle: `\u20b9${m.modalPrice}/${m.unit} \u2022 ${m.market}`,
        icon: "\ud83d\udcb9", color: "#f59e0b",
        route: "/(tabs)/(dashboard)/market",
      });
    });

    // Pests
    pestEncyclopedia.forEach((p) => {
      results.push({
        id: `pest-${p.id}`, type: "pest",
        title: p.name, subtitle: `${p.type} \u2022 ${p.affectedCrops.join(", ")}`,
        icon: p.icon, color: "#8b5cf6",
        route: "/(tabs)/(dashboard)/pest-encyclopedia",
      });
    });

    // Calendar
    cropCalendar.forEach((c) => {
      results.push({
        id: `cal-${c.id}`, type: "calendar",
        title: c.activity, subtitle: `${c.status} \u2022 ${c.category}`,
        icon: "\ud83d\udcc5", color: "#3b82f6",
        route: "/(tabs)/insights",
      });
    });

    // Advisory
    advisories.forEach((a) => {
      results.push({
        id: `adv-${a.id}`, type: "advisory",
        title: a.title, subtitle: `${a.type} \u2022 ${a.category}`,
        icon: "\ud83d\udca1", color: "#22c55e",
        route: "/(tabs)/insights",
      });
    });

    // Irrigation
    irrigationSchedules.forEach((i) => {
      results.push({
        id: `irr-${i.fieldId}`, type: "irrigation",
        title: i.fieldName, subtitle: `${i.method} \u2022 Moisture: ${i.soilMoisture}%`,
        icon: "\ud83d\udca7", color: "#3b82f6",
        route: "/(tabs)/(dashboard)/irrigation-control",
      });
    });

    // Screens (always included)
    results.push(...screenIndex);

    return results;
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return screenIndex; // Show screens as default
    const q = query.toLowerCase();
    return allResults.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [query, allResults]);

  const typeLabels: Record<string, string> = {
    field: "Fields", alert: "Alerts", advisory: "Advisory", pest: "Pest/Disease",
    market: "Market", calendar: "Calendar", screen: "Screens", irrigation: "Irrigation",
  };

  // Group results by type
  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    filtered.forEach((r) => {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    });
    return groups;
  }, [filtered]);

  return (
    <SafeAreaView className="flex-1 bg-background-0/95">
      <View className="flex-1">
        {/* Search Header */}
        <View className="px-5 pt-4 pb-3">
          <View className="flex-row items-center bg-background-100 rounded-2xl px-4 py-3">
            <Text className="text-typography-400 mr-3" style={{ fontSize: 18 }}>{"\ud83d\udd0d"}</Text>
            <TextInput
              className="flex-1 text-typography-900 text-base font-dm-sans-regular"
              placeholder="Search fields, alerts, crops, schemes..."
              placeholderTextColor="#a1a1aa"
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            <Pressable onPress={() => router.back()}>
              <Text className="text-typography-500 text-sm font-dm-sans-medium ml-2">Cancel</Text>
            </Pressable>
          </View>
        </View>

        {/* Quick Filters */}
        {!query && (
          <View className="px-5 mb-3">
            <Text className="text-typography-500 text-xs font-dm-sans-medium mb-2">Quick Search</Text>
            <View className="flex-row flex-wrap gap-2">
              {["Wheat", "Tomato", "NDVI", "Pest", "Irrigation", "Urea", "Blight", "Subsidy"].map((tag) => (
                <Pressable key={tag} onPress={() => setQuery(tag)}>
                  <View className="bg-background-100 rounded-full px-3 py-1.5">
                    <Text className="text-typography-600 text-xs font-dm-sans-medium">{tag}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Results */}
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
          {Object.entries(grouped).map(([type, results]) => (
            <View key={type} className="mb-4">
              <Text className="px-5 text-typography-500 text-xs font-dm-sans-bold uppercase mb-2">
                {typeLabels[type] || type} ({results.length})
              </Text>
              {results.map((result) => (
                <Pressable
                  key={result.id}
                  onPress={() => {
                    if (result.params) {
                      router.replace({ pathname: result.route as any, params: result.params });
                    } else {
                      router.replace(result.route as any);
                    }
                  }}
                >
                  <View className="flex-row items-center px-5 py-3">
                    <View
                      className="w-10 h-10 rounded-xl items-center justify-center"
                      style={{ backgroundColor: result.color + "12" }}
                    >
                      <Text style={{ fontSize: 18 }}>{result.icon}</Text>
                    </View>
                    <View className="flex-1 ml-3">
                      <Text className="text-typography-900 font-dm-sans-medium text-sm" numberOfLines={1}>
                        {result.title}
                      </Text>
                      <Text className="text-typography-400 text-xs" numberOfLines={1}>
                        {result.subtitle}
                      </Text>
                    </View>
                    <Text className="text-typography-300">{"\u203a"}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ))}

          {query && filtered.length === 0 && (
            <View className="items-center py-16">
              <Text style={{ fontSize: 48 }}>{"\ud83d\udd0d"}</Text>
              <Text className="text-typography-500 text-sm mt-3">No results for "{query}"</Text>
              <Text className="text-typography-400 text-xs mt-1">Try different keywords</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
