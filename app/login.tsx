import React, { useState } from "react";
import { View, Text, Pressable, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { backendClient } from "@/services/backend-client";

type AuthMode = "login" | "signup";

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    if (!phone || !password || (mode === "signup" && !name)) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (mode === "signup") {
        const resp = await fetch(`${backendClient["baseUrl"]}/api/v1/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, password, location: location || undefined }),
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({ detail: "Signup failed" }));
          throw new Error(err.detail || `Error ${resp.status}`);
        }
        result = await resp.json();
      } else {
        const resp = await fetch(`${backendClient["baseUrl"]}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password }),
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({ detail: "Login failed" }));
          throw new Error(err.detail || `Error ${resp.status}`);
        }
        result = await resp.json();
      }

      // Store tokens (in production: use SecureStore)
      // For now just navigate to dashboard
      Alert.alert(
        mode === "signup" ? "Welcome!" : "Logged In",
        `Hello, ${result.farmer_name}! ${mode === "signup" ? "Account created successfully." : "Welcome back."}`,
        [{ text: "Continue", onPress: () => router.replace("/(tabs)/(dashboard)") }]
      );
    } catch (err: any) {
      // Offline: allow skip
      Alert.alert(
        "Connection Issue",
        `${err.message || "Cannot reach server."}\n\nYou can continue in offline mode.`,
        [
          { text: "Retry", style: "cancel" },
          { text: "Continue Offline", onPress: () => router.replace("/(tabs)/(dashboard)") },
        ]
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 justify-center px-8">
          {/* Logo */}
          <View className="items-center mb-8">
            <Text style={{ fontSize: 56 }}>{"\ud83c\udf3e"}</Text>
            <Text className="text-typography-900 text-2xl font-dm-sans-bold mt-3">AgriTech Platform</Text>
            <Text className="text-typography-500 text-sm font-dm-sans-regular mt-1">Precision agriculture for modern farmers</Text>
          </View>

          {/* Mode Toggle */}
          <View className="flex-row bg-background-100 rounded-xl p-1 mb-6">
            {(["login", "signup"] as AuthMode[]).map((m) => (
              <Pressable key={m} onPress={() => setMode(m)} className="flex-1 py-2.5 rounded-lg items-center" style={mode === m ? { backgroundColor: "#16a34a" } : {}}>
                <Text className={`font-dm-sans-bold text-sm ${mode === m ? "text-white" : "text-typography-500"}`}>
                  {m === "login" ? "Login" : "Sign Up"}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Form */}
          {mode === "signup" && (
            <View className="mb-4">
              <Text className="text-typography-700 text-xs font-dm-sans-medium mb-1.5">Full Name *</Text>
              <TextInput
                className="bg-background-100 rounded-xl px-4 py-3 text-typography-900 text-sm"
                placeholder="Rajesh Kumar"
                placeholderTextColor="#a1a1aa"
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View className="mb-4">
            <Text className="text-typography-700 text-xs font-dm-sans-medium mb-1.5">Phone Number *</Text>
            <TextInput
              className="bg-background-100 rounded-xl px-4 py-3 text-typography-900 text-sm"
              placeholder="+91 98765 43210"
              placeholderTextColor="#a1a1aa"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View className="mb-4">
            <Text className="text-typography-700 text-xs font-dm-sans-medium mb-1.5">Password *</Text>
            <TextInput
              className="bg-background-100 rounded-xl px-4 py-3 text-typography-900 text-sm"
              placeholder={mode === "signup" ? "Min 6 characters" : "Enter password"}
              placeholderTextColor="#a1a1aa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {mode === "signup" && (
            <View className="mb-4">
              <Text className="text-typography-700 text-xs font-dm-sans-medium mb-1.5">Location (optional)</Text>
              <TextInput
                className="bg-background-100 rounded-xl px-4 py-3 text-typography-900 text-sm"
                placeholder="e.g., Nashik, Maharashtra"
                placeholderTextColor="#a1a1aa"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          )}

          {/* Submit */}
          <Pressable
            onPress={handleAuth}
            disabled={loading}
            className="rounded-xl py-4 items-center mb-4"
            style={{ backgroundColor: loading ? "#86efac" : "#16a34a" }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-dm-sans-bold text-base">
                {mode === "login" ? "Login" : "Create Account"}
              </Text>
            )}
          </Pressable>

          {/* Skip */}
          <Pressable onPress={() => router.replace("/(tabs)/(dashboard)")} className="items-center py-2">
            <Text className="text-typography-400 text-sm font-dm-sans-medium">Skip for now {"\u2192"}</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View className="items-center pb-6">
          <Text className="text-typography-300 text-xs">Satellite intelligence for every farmer</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
