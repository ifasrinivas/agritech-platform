import "@/global.css";
import { LogBox } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { LiveDataProvider } from "@/contexts/live-data-context";

// Suppress known third-party deprecation warnings
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated",
]);
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";

const MainLayout = () => {
  const [fontsLoaded] = useFonts({
    "dm-sans-regular": DMSans_400Regular,
    "dm-sans-medium": DMSans_500Medium,
    "dm-sans-bold": DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar translucent style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, presentation: "fullScreenModal" }} />
      </Stack>
    </>
  );
};

export default function RootLayout() {
  return (
    <LiveDataProvider>
      <MainLayout />
    </LiveDataProvider>
  );
}
