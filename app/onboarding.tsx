import React, { useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface OnboardingSlide {
  icon: string;
  title: string;
  subtitle: string;
  features: string[];
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    icon: "\ud83d\udef0\ufe0f",
    title: "Satellite Intelligence",
    subtitle: "See your farm from space",
    features: [
      "Real-time NDVI crop health monitoring",
      "Multi-spectral analysis (vegetation, moisture, temperature)",
      "Anomaly detection with AI-powered alerts",
      "5-day satellite revisit for continuous tracking",
    ],
    color: "#8b5cf6",
  },
  {
    icon: "\ud83e\udde0",
    title: "AI-Powered Insights",
    subtitle: "Your digital agronomist",
    features: [
      "Photo-based disease & pest detection (94%+ accuracy)",
      "AI yield predictions based on NDVI trends",
      "Smart irrigation scheduling from soil sensors",
      "Market price forecasting with confidence scores",
    ],
    color: "#3b82f6",
  },
  {
    icon: "\ud83c\udf3f",
    title: "Precision Advisory",
    subtitle: "Right action, right time, right field",
    features: [
      "Organic & inorganic treatment recommendations",
      "Soil health reports with nutrient mapping",
      "Digital crop calendar with task reminders",
      "Customized dosage and application guidance",
    ],
    color: "#22c55e",
  },
  {
    icon: "\ud83c\udf0d",
    title: "Sustainable & Profitable",
    subtitle: "Farm smarter, not harder",
    features: [
      "Carbon credit tracking for sustainable practices",
      "Water conservation analytics (30%+ savings)",
      "Full farm budget with ROI per crop",
      "AgriMarketplace to buy, sell & rent directly",
    ],
    color: "#f59e0b",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: slide.color + "08" }}>
      {/* Skip */}
      <View className="flex-row justify-end px-5 pt-4">
        <Pressable onPress={() => router.replace("/(tabs)/(dashboard)")}>
          <Text className="text-typography-400 text-sm font-dm-sans-medium">Skip</Text>
        </Pressable>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center px-8">
        {/* Icon */}
        <View
          className="w-32 h-32 rounded-full items-center justify-center mb-8"
          style={{ backgroundColor: slide.color + "15" }}
        >
          <Text style={{ fontSize: 64 }}>{slide.icon}</Text>
        </View>

        {/* Title */}
        <Text className="text-typography-900 text-2xl font-dm-sans-bold text-center">
          {slide.title}
        </Text>
        <Text className="text-typography-500 text-base font-dm-sans-regular text-center mt-2">
          {slide.subtitle}
        </Text>

        {/* Features */}
        <View className="mt-8 w-full">
          {slide.features.map((feature, i) => (
            <View key={i} className="flex-row items-start mb-3">
              <View
                className="w-6 h-6 rounded-full items-center justify-center mr-3 mt-0.5"
                style={{ backgroundColor: slide.color + "20" }}
              >
                <Text className="text-xs font-dm-sans-bold" style={{ color: slide.color }}>
                  {"\u2713"}
                </Text>
              </View>
              <Text className="text-typography-700 text-sm font-dm-sans-regular flex-1 leading-5">
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Navigation */}
      <View className="px-8 pb-8">
        {/* Dots */}
        <View className="flex-row justify-center mb-6">
          {slides.map((_, i) => (
            <Pressable key={i} onPress={() => setCurrentSlide(i)}>
              <View
                className="mx-1 rounded-full"
                style={{
                  width: i === currentSlide ? 24 : 8,
                  height: 8,
                  backgroundColor: i === currentSlide ? slide.color : "#d4d4d4",
                }}
              />
            </Pressable>
          ))}
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3">
          {currentSlide > 0 && (
            <Pressable
              onPress={() => setCurrentSlide(currentSlide - 1)}
              className="flex-1 bg-background-100 rounded-2xl py-4 items-center"
            >
              <Text className="text-typography-700 font-dm-sans-bold text-base">Back</Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => {
              if (currentSlide < slides.length - 1) {
                setCurrentSlide(currentSlide + 1);
              } else {
                router.replace("/(tabs)/(dashboard)");
              }
            }}
            className="flex-1 rounded-2xl py-4 items-center"
            style={{ backgroundColor: slide.color }}
          >
            <Text className="text-white font-dm-sans-bold text-base">
              {currentSlide === slides.length - 1 ? "Get Started \ud83c\udf3e" : "Next \u2192"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
