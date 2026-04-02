import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="field-detail" options={{ presentation: "card" }} />
      <Stack.Screen name="alert-detail" options={{ presentation: "card" }} />
      <Stack.Screen name="weather-detail" options={{ presentation: "card" }} />
      <Stack.Screen name="market" options={{ presentation: "card" }} />
      <Stack.Screen name="satellite" options={{ presentation: "card" }} />
      <Stack.Screen name="farm-planner" options={{ presentation: "card" }} />
      <Stack.Screen name="pest-encyclopedia" options={{ presentation: "card" }} />
      <Stack.Screen name="analytics" options={{ presentation: "card" }} />
      <Stack.Screen name="add-field" options={{ presentation: "modal" }} />
      <Stack.Screen name="activity-log" options={{ presentation: "card" }} />
      <Stack.Screen name="marketplace" options={{ presentation: "card" }} />
      <Stack.Screen name="notifications" options={{ presentation: "card" }} />
      <Stack.Screen name="sensors" options={{ presentation: "card" }} />
      <Stack.Screen name="schemes" options={{ presentation: "card" }} />
      <Stack.Screen name="crop-advisor" options={{ presentation: "card" }} />
      <Stack.Screen name="reports" options={{ presentation: "card" }} />
      <Stack.Screen name="help" options={{ presentation: "card" }} />
      <Stack.Screen name="search" options={{ presentation: "transparentModal", animation: "fade" }} />
      <Stack.Screen name="community" options={{ presentation: "card" }} />
      <Stack.Screen name="harvest-tracker" options={{ presentation: "card" }} />
      <Stack.Screen name="drone-planner" options={{ presentation: "card" }} />
      <Stack.Screen name="photo-gallery" options={{ presentation: "card" }} />
      <Stack.Screen name="farm-map" options={{ presentation: "card" }} />
      <Stack.Screen name="irrigation-control" options={{ presentation: "card" }} />
      <Stack.Screen name="finance-tools" options={{ presentation: "card" }} />
      <Stack.Screen name="labor-management" options={{ presentation: "card" }} />
      <Stack.Screen name="soil-testing" options={{ presentation: "card" }} />
      <Stack.Screen name="export-docs" options={{ presentation: "card" }} />
      <Stack.Screen name="alert-config" options={{ presentation: "card" }} />
      <Stack.Screen name="training" options={{ presentation: "card" }} />
      <Stack.Screen name="season-compare" options={{ presentation: "card" }} />
      <Stack.Screen name="spray-planner" options={{ presentation: "card" }} />
      <Stack.Screen name="inventory" options={{ presentation: "card" }} />
      <Stack.Screen name="insurance-claim" options={{ presentation: "card" }} />
      <Stack.Screen name="equipment" options={{ presentation: "card" }} />
      <Stack.Screen name="contract-farming" options={{ presentation: "card" }} />
      <Stack.Screen name="language-settings" options={{ presentation: "modal" }} />
      <Stack.Screen name="fertilizer-calc" options={{ presentation: "card" }} />
      <Stack.Screen name="field-scouting" options={{ presentation: "card" }} />
      <Stack.Screen name="farm-passport" options={{ presentation: "card" }} />
      <Stack.Screen name="water-management" options={{ presentation: "card" }} />
      <Stack.Screen name="livestock" options={{ presentation: "card" }} />
      <Stack.Screen name="daily-tasks" options={{ presentation: "card" }} />
      <Stack.Screen name="seed-selector" options={{ presentation: "card" }} />
      <Stack.Screen name="post-harvest" options={{ presentation: "card" }} />
      <Stack.Screen name="credit-tracker" options={{ presentation: "card" }} />
      <Stack.Screen name="compliance" options={{ presentation: "card" }} />
      <Stack.Screen name="boundary-tool" options={{ presentation: "card" }} />
    </Stack>
  );
}
