import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  icon: string;
  supported: boolean;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", icon: "\ud83c\uddec\ud83c\udde7", supported: true },
  { code: "hi", name: "Hindi", nativeName: "\u0939\u093f\u0928\u094d\u0926\u0940", icon: "\ud83c\uddee\ud83c\uddf3", supported: true },
  { code: "mr", name: "Marathi", nativeName: "\u092e\u0930\u093e\u0920\u0940", icon: "\ud83c\uddee\ud83c\uddf3", supported: true },
  { code: "gu", name: "Gujarati", nativeName: "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0", icon: "\ud83c\uddee\ud83c\uddf3", supported: true },
  { code: "kn", name: "Kannada", nativeName: "\u0c95\u0ca8\u0ccd\u0ca8\u0ca1", icon: "\ud83c\uddee\ud83c\uddf3", supported: true },
  { code: "te", name: "Telugu", nativeName: "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41", icon: "\ud83c\uddee\ud83c\uddf3", supported: true },
  { code: "ta", name: "Tamil", nativeName: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd", icon: "\ud83c\uddee\ud83c\uddf3", supported: true },
  { code: "pa", name: "Punjabi", nativeName: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40", icon: "\ud83c\uddee\ud83c\uddf3", supported: true },
  { code: "bn", name: "Bengali", nativeName: "\u09ac\u09be\u0982\u09b2\u09be", icon: "\ud83c\uddee\ud83c\uddf3", supported: false },
  { code: "or", name: "Odia", nativeName: "\u0b13\u0b21\u0b3c\u0b3f\u0b06", icon: "\ud83c\uddee\ud83c\uddf3", supported: false },
];

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState("en");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [textSize, setTextSize] = useState<"small" | "medium" | "large">("medium");

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2715"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83c\udf10"} Language & Accessibility</Text>
          <Text className="text-typography-400 text-xs">Choose language, text size & voice</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Language Selection */}
        <View className="px-5 mt-4">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">App Language</Text>

          {languages.map((lang) => (
            <Pressable
              key={lang.code}
              onPress={() => {
                if (lang.supported) {
                  setSelectedLang(lang.code);
                } else {
                  Alert.alert("Coming Soon", `${lang.name} support will be available in the next update.`);
                }
              }}
            >
              <View
                className="flex-row items-center py-3.5 px-4 mb-2 rounded-xl"
                style={
                  selectedLang === lang.code
                    ? { backgroundColor: "#16a34a12", borderWidth: 1.5, borderColor: "#16a34a" }
                    : { backgroundColor: "#f9fafb", borderWidth: 1, borderColor: "#f3f4f6" }
                }
              >
                <Text style={{ fontSize: 22 }}>{lang.icon}</Text>
                <View className="flex-1 ml-3">
                  <Text className={`text-sm font-dm-sans-medium ${selectedLang === lang.code ? "text-green-800" : lang.supported ? "text-typography-800" : "text-typography-400"}`}>
                    {lang.name}
                  </Text>
                  <Text className={`text-xs ${selectedLang === lang.code ? "text-green-600" : "text-typography-400"}`}>
                    {lang.nativeName}
                  </Text>
                </View>
                {selectedLang === lang.code && (
                  <View className="bg-green-500 rounded-full w-6 h-6 items-center justify-center">
                    <Text className="text-white text-xs font-dm-sans-bold">{"\u2713"}</Text>
                  </View>
                )}
                {!lang.supported && (
                  <View className="bg-background-200 rounded-full px-2 py-0.5">
                    <Text className="text-typography-400 text-xs">Soon</Text>
                  </View>
                )}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Text Size */}
        <View className="px-5 mt-4">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Text Size</Text>
          <View className="flex-row gap-3">
            {(["small", "medium", "large"] as const).map((size) => (
              <Pressable key={size} onPress={() => setTextSize(size)} className="flex-1">
                <View
                  className="rounded-xl py-4 items-center"
                  style={textSize === size ? { backgroundColor: "#16a34a15", borderWidth: 1.5, borderColor: "#16a34a" } : { backgroundColor: "#f9fafb", borderWidth: 1, borderColor: "#f3f4f6" }}
                >
                  <Text style={{ fontSize: size === "small" ? 14 : size === "medium" ? 18 : 24, color: textSize === size ? "#16a34a" : "#525252" }}>Aa</Text>
                  <Text className={`text-xs mt-1 font-dm-sans-medium capitalize ${textSize === size ? "text-green-700" : "text-typography-500"}`}>{size}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Voice Features */}
        <View className="px-5 mt-4">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Voice & Audio</Text>
          <View className="bg-background-50 rounded-2xl p-4 border border-outline-100">
            {[
              { label: "Voice Advisory", desc: "Listen to recommendations in your language", icon: "\ud83d\udd0a", enabled: voiceEnabled },
              { label: "Voice Commands", desc: "Navigate the app using voice (\"Show my fields\")", icon: "\ud83c\udf99\ufe0f", enabled: false },
              { label: "Audio Alerts", desc: "Spoken alerts for critical warnings", icon: "\ud83d\udea8", enabled: true },
              { label: "WhatsApp Voice Notes", desc: "Receive advisory as voice notes on WhatsApp", icon: "\ud83d\udcac", enabled: false },
            ].map((item, i) => (
              <View key={i} className="flex-row items-center py-3" style={i < 3 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                <View className="flex-1 ml-3">
                  <Text className="text-typography-800 text-sm font-dm-sans-medium">{item.label}</Text>
                  <Text className="text-typography-400 text-xs">{item.desc}</Text>
                </View>
                <View className={`w-5 h-5 rounded-full items-center justify-center ${item.enabled ? "bg-green-500" : "bg-background-200"}`}>
                  <Text className="text-white text-xs">{item.enabled ? "\u2713" : ""}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Offline Language Packs */}
        <View className="px-5 mt-4">
          <Text className="text-typography-900 font-dm-sans-bold text-base mb-3">Offline Language Packs</Text>
          <View className="bg-background-50 rounded-2xl p-4 border border-outline-100">
            {[
              { lang: "English", size: "Included", status: "installed" },
              { lang: "Hindi", size: "12 MB", status: "installed" },
              { lang: "Marathi", size: "14 MB", status: "available" },
              { lang: "Gujarati", size: "11 MB", status: "available" },
            ].map((pack, i) => (
              <View key={i} className="flex-row items-center py-2.5" style={i < 3 ? { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" } : {}}>
                <View className="flex-1">
                  <Text className="text-typography-800 text-sm font-dm-sans-medium">{pack.lang}</Text>
                  <Text className="text-typography-400 text-xs">{pack.size}</Text>
                </View>
                <View className="rounded-full px-3 py-1" style={{ backgroundColor: pack.status === "installed" ? "#22c55e15" : "#3b82f615" }}>
                  <Text className="text-xs font-dm-sans-bold" style={{ color: pack.status === "installed" ? "#22c55e" : "#3b82f6" }}>
                    {pack.status === "installed" ? "\u2713 Installed" : "\u2b07 Download"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Apply Button */}
        <View className="px-5 mt-6">
          <Pressable
            onPress={() => Alert.alert("Settings Saved", "Language and accessibility preferences updated.")}
            className="bg-green-500 rounded-xl py-3.5 items-center"
          >
            <Text className="text-white font-dm-sans-bold text-base">Apply Changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
