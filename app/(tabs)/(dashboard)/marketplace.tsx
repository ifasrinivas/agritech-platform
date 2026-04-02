import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type MarketplaceTab = "buy" | "sell" | "services" | "rentals";

interface Listing {
  id: string;
  title: string;
  seller: string;
  location: string;
  price: string;
  unit: string;
  icon: string;
  category: string;
  quality?: string;
  available: string;
  verified: boolean;
}

const buyListings: Listing[] = [
  { id: "b1", title: "Neem Oil 1500ppm (10L)", seller: "Krishi Agro Center", location: "Nashik", price: "4,500", unit: "10L pack", icon: "\ud83c\udf3f", category: "Organic", available: "In Stock", verified: true },
  { id: "b2", title: "Drip Lateral 16mm (500m roll)", seller: "Jain Irrigation Dealer", location: "Nashik", price: "3,200", unit: "roll", icon: "\ud83d\udca7", category: "Equipment", available: "In Stock", verified: true },
  { id: "b3", title: "Trichoderma viride (1kg)", seller: "Bio Agri Solutions", location: "Pune", price: "350", unit: "kg", icon: "\ud83e\uddeb", category: "Biofertilizer", available: "Ships in 2 days", verified: true },
  { id: "b4", title: "Pheromone Traps - FAW (25 pcs)", seller: "IPM Tech India", location: "Mumbai", price: "1,250", unit: "pack of 25", icon: "\ud83e\udeb4", category: "Pest Control", available: "In Stock", verified: false },
  { id: "b5", title: "Vermicompost (1 ton)", seller: "Green Earth Organics", location: "Nashik", price: "6,000", unit: "ton", icon: "\ud83e\udea8", category: "Organic", quality: "Premium Grade", available: "Delivery 3 days", verified: true },
  { id: "b6", title: "Mulching Film 50\u00b5 (400m)", seller: "Plasticulture India", location: "Aurangabad", price: "4,800", unit: "roll", icon: "\ud83c\udf2b\ufe0f", category: "Equipment", available: "In Stock", verified: true },
];

const sellListings: Listing[] = [
  { id: "s1", title: "Thompson Seedless Grapes", seller: "Rajesh Kumar (You)", location: "Nashik", price: "52/kg", unit: "quintal lots", icon: "\ud83c\udf47", category: "Fresh Produce", quality: "Export Grade A", available: "Ready Apr 5", verified: true },
  { id: "s2", title: "Wheat (Lokwan variety)", seller: "Rajesh Kumar (You)", location: "Nashik", price: "23.2/kg", unit: "quintal lots", icon: "\ud83c\udf3e", category: "Grain", quality: "Grade A", available: "Ready Apr 20", verified: true },
  { id: "s3", title: "Fresh Tomato (Arka Rakshak)", seller: "Rajesh Kumar (You)", location: "Nashik", price: "12/kg", unit: "crate (20kg)", icon: "\ud83c\udf45", category: "Fresh Produce", quality: "A Grade", available: "Ready May 15", verified: true },
];

const serviceListings = [
  { id: "sv1", title: "Drone Spraying Service", provider: "AgroWing Drones", price: "\u20b9600/acre", desc: "Precision drone spraying with GPS mapping. Min 5 acres.", rating: 4.8, icon: "\ud83d\ude81" },
  { id: "sv2", title: "Soil Testing (Complete)", provider: "ICAR Lab Nashik", price: "\u20b9350/sample", desc: "Full NPK, pH, EC, OC, micronutrient analysis. Report in 7 days.", rating: 4.9, icon: "\ud83e\uddea" },
  { id: "sv3", title: "Combine Harvester (Wheat)", provider: "Kisan Mechanization", price: "\u20b92,500/acre", desc: "John Deere W70 combine. Operator included. Min 5 acres.", rating: 4.6, icon: "\ud83d\ude9c" },
  { id: "sv4", title: "Grape Export Packing", provider: "Fresh Pack Industries", price: "\u20b925/box", desc: "Cold chain compliant packing. APEDA certified. Corrugated 2kg boxes.", rating: 4.7, icon: "\ud83d\udce6" },
  { id: "sv5", title: "Borewell Recharge (Rain Harvest)", provider: "Water Solutions Nashik", price: "\u20b915,000", desc: "Rainwater harvesting pit + filter system. Recharges 50,000L/year.", rating: 4.5, icon: "\ud83d\udca7" },
  { id: "sv6", title: "Farm Photography (Drone + Ground)", provider: "AgriShots", price: "\u20b93,000/visit", desc: "High-res drone imagery + ground photos. Insurance documentation.", rating: 4.4, icon: "\ud83d\udcf8" },
];

const rentalListings = [
  { id: "r1", title: "Tractor 45HP + Rotavator", provider: "Kisan Rental Hub", price: "\u20b91,200/hr", desc: "Mahindra 575 with 6ft rotavator. Operator included.", available: "Available now", icon: "\ud83d\ude9c" },
  { id: "r2", title: "Power Sprayer (20L)", provider: "Agri Tools Nashik", price: "\u20b9200/day", desc: "Honda engine, 20L tank, 3 nozzle types. Fuel extra.", available: "Available now", icon: "\ud83d\udca8" },
  { id: "r3", title: "Mulch Layer Machine", provider: "Plasticulture Rentals", price: "\u20b9800/acre", desc: "Tractor-mounted. 1.2m width. Includes operator.", available: "Book 2 days ahead", icon: "\u2699\ufe0f" },
  { id: "r4", title: "Laser Land Leveller", provider: "Precision Agri Services", price: "\u20b94,000/acre", desc: "GPS-guided laser levelling. +/- 1cm accuracy. Min 3 acres.", available: "Available next week", icon: "\ud83d\udccd" },
];

export default function MarketplaceScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MarketplaceTab>("buy");
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\ud83d\uded2"} AgriMarketplace
          </Text>
          <Text className="text-typography-400 text-xs">Buy, sell & rent farm essentials</Text>
        </View>
      </View>

      {/* Search */}
      <View className="mx-5 mt-3">
        <View className="bg-background-100 rounded-xl px-4 py-2.5 flex-row items-center">
          <Text className="text-typography-400 mr-2">{"\ud83d\udd0d"}</Text>
          <TextInput
            className="flex-1 text-typography-900 text-sm"
            placeholder="Search products, services..."
            placeholderTextColor="#a1a1aa"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row mx-5 mt-3 mb-3 bg-background-100 rounded-xl p-1">
        {(["buy", "sell", "services", "rentals"] as MarketplaceTab[]).map((tab) => (
          <Pressable
            key={tab}
            className="flex-1 items-center py-2 rounded-lg"
            style={activeTab === tab ? { backgroundColor: "#16a34a" } : {}}
            onPress={() => setActiveTab(tab)}
          >
            <Text className={`text-xs font-dm-sans-medium capitalize ${activeTab === tab ? "text-white" : "text-typography-500"}`}>
              {tab === "buy" ? "\ud83d\uded2 Buy" : tab === "sell" ? "\ud83d\udcb0 Sell" : tab === "services" ? "\ud83d\udee0\ufe0f Services" : "\ud83d\udd11 Rent"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "buy" && (
          <View className="px-5">
            {buyListings.map((item) => (
              <View key={item.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 rounded-xl items-center justify-center bg-background-100">
                    <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm flex-1" numberOfLines={1}>
                        {item.title}
                      </Text>
                      {item.verified && (
                        <Text className="text-blue-500 text-xs">{"\u2713"} Verified</Text>
                      )}
                    </View>
                    <Text className="text-typography-500 text-xs mt-0.5">
                      {item.seller} \u2022 {item.location}
                    </Text>
                    {item.quality && (
                      <Text className="text-green-600 text-xs font-dm-sans-medium mt-0.5">{item.quality}</Text>
                    )}
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-typography-900 font-dm-sans-bold text-base">
                        {"\u20b9"}{item.price}
                      </Text>
                      <View className="bg-green-50 rounded-lg px-2 py-1">
                        <Text className="text-green-700 text-xs font-dm-sans-medium">{item.available}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View className="flex-row gap-2 mt-3">
                  <Pressable className="flex-1 bg-green-500 rounded-xl py-2.5 items-center">
                    <Text className="text-white text-xs font-dm-sans-bold">Contact Seller</Text>
                  </Pressable>
                  <Pressable className="flex-1 bg-background-100 rounded-xl py-2.5 items-center">
                    <Text className="text-typography-700 text-xs font-dm-sans-bold">Add to Cart</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "sell" && (
          <View className="px-5">
            <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
              <Text className="text-green-800 font-dm-sans-bold text-sm">
                {"\ud83d\udcb0"} Your Active Listings
              </Text>
              <Text className="text-green-600 text-xs mt-1">
                Connect directly with buyers and APMC agents
              </Text>
            </View>

            {sellListings.map((item) => (
              <View key={item.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                    <Text className="text-typography-900 font-dm-sans-bold text-sm ml-2">{item.title}</Text>
                  </View>
                  <View className="bg-blue-50 rounded-full px-2 py-0.5">
                    <Text className="text-blue-700 text-xs font-dm-sans-medium">Active</Text>
                  </View>
                </View>
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-typography-900 font-dm-sans-bold text-lg">{"\u20b9"}{item.price}</Text>
                    <Text className="text-typography-400 text-xs">{item.quality} \u2022 {item.available}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-typography-500 text-xs">3 enquiries</Text>
                    <Text className="text-typography-400 text-xs">2 from APMC</Text>
                  </View>
                </View>
              </View>
            ))}

            <Pressable className="bg-green-500 rounded-2xl py-4 items-center mt-2">
              <Text className="text-white font-dm-sans-bold text-sm">{"\u2795"} Create New Listing</Text>
            </Pressable>
          </View>
        )}

        {activeTab === "services" && (
          <View className="px-5">
            {serviceListings.map((item) => (
              <View key={item.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 rounded-xl items-center justify-center bg-background-100">
                    <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.title}</Text>
                    <Text className="text-typography-500 text-xs mt-0.5">{item.provider}</Text>
                    <Text className="text-typography-600 text-xs mt-1 leading-4">{item.desc}</Text>
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-typography-900 font-dm-sans-bold text-base">{item.price}</Text>
                      <View className="flex-row items-center">
                        <Text className="text-yellow-500 text-xs">{"\u2b50"}</Text>
                        <Text className="text-typography-700 text-xs font-dm-sans-bold ml-1">{item.rating}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Pressable className="bg-blue-500 rounded-xl py-2.5 items-center mt-3">
                  <Text className="text-white text-xs font-dm-sans-bold">Book Service</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {activeTab === "rentals" && (
          <View className="px-5">
            {rentalListings.map((item) => (
              <View key={item.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 rounded-xl items-center justify-center bg-background-100">
                    <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{item.title}</Text>
                    <Text className="text-typography-500 text-xs mt-0.5">{item.provider}</Text>
                    <Text className="text-typography-600 text-xs mt-1 leading-4">{item.desc}</Text>
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-typography-900 font-dm-sans-bold text-base">{item.price}</Text>
                      <View className="bg-green-50 rounded-lg px-2 py-1">
                        <Text className="text-green-700 text-xs font-dm-sans-medium">{item.available}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Pressable className="bg-purple-500 rounded-xl py-2.5 items-center mt-3">
                  <Text className="text-white text-xs font-dm-sans-bold">Rent Now</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
