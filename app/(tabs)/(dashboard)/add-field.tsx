import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, ScrollView, Pressable, TextInput, Alert,
  Platform, ActivityIndicator, Dimensions, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE, HAS_MAPS } from "@/components/screens/agritech/map-wrapper";
type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
import { LinearGradient } from "expo-linear-gradient";
import { backendClient } from "@/services/backend-client";
import { BACKEND_URL } from "@/services/api-config";
import { COLORS, SHADOWS, RADIUS, GRADIENTS } from "@/components/screens/agritech/premium/theme";
import {
  X, ChevronLeft, ChevronRight, MapPin, Undo2, Trash2,
  Crosshair, PenTool, Navigation, Check, Layers,
} from "lucide-react-native";

interface GPSPoint {
  latitude: number;
  longitude: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function AddFieldScreen() {
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    crop: "",
    area: "",
    soilType: "",
    irrigationType: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // GPS / Map state
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [currentLocation, setCurrentLocation] = useState<GPSPoint | null>(null);
  const [boundaryPoints, setBoundaryPoints] = useState<GPSPoint[]>([]);
  const [mapType, setMapType] = useState<"satellite" | "standard">("satellite");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [webLat, setWebLat] = useState<number | null>(null);
  const [webLng, setWebLng] = useState<number | null>(null);

  const crops = ["Wheat", "Rice", "Tomato", "Onion", "Grapes", "Capsicum", "Soybean", "Maize", "Cotton", "Sugarcane", "Chilli", "Other"];
  const soilTypes = ["Black Cotton Soil", "Red Laterite", "Alluvial", "Sandy Loam", "Clay Loam", "Silty Clay", "Sandy Clay", "Prepared Mix"];
  const irrigationTypes = ["Drip Irrigation", "Sprinkler", "Flood", "Furrow", "Drip Fertigation", "Rainfed"];
  const totalSteps = 3;

  // Request location on step 3
  useEffect(() => {
    if (step === 3) requestLocationPermission();
  }, [step]);

  async function requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === "granted";
      setLocationPermission(granted);
      if (granted) getCurrentLocation();
      else setLocationError("Location permission denied. Enable in Settings.");
    } catch {
      setLocationError("Failed to request location.");
      setLocationPermission(false);
    }
  }

  async function getCurrentLocation() {
    try {
      setLocationError(null);
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const point = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setCurrentLocation(point);
      // Center map on user location
      mapRef.current?.animateToRegion({
        ...point,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    } catch {
      setLocationError("Could not get location. Ensure GPS is on.");
    }
  }

  // Tap on map to add boundary point
  const handleMapPress = useCallback((e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setBoundaryPoints((prev) => [...prev, { latitude, longitude }]);
  }, []);

  function undoLastPoint() {
    setBoundaryPoints((prev) => prev.slice(0, -1));
  }

  function clearAllPoints() {
    Alert.alert("Clear Boundary", "Remove all points?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => setBoundaryPoints([]) },
    ]);
  }

  // Shoelace formula: GPS polygon -> acres
  function calculateArea(points: GPSPoint[]): number {
    if (points.length < 3) return 0;
    let area = 0;
    const n = points.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const xi = points[i].longitude * Math.cos((points[i].latitude * Math.PI) / 180) * 111320;
      const yi = points[i].latitude * 110540;
      const xj = points[j].longitude * Math.cos((points[j].latitude * Math.PI) / 180) * 111320;
      const yj = points[j].latitude * 110540;
      area += xi * yj - xj * yi;
    }
    return Math.abs(area) / 2 / 4046.86; // sq meters -> acres
  }

  const calculatedArea = calculateArea(boundaryPoints);
  const hasEnoughPoints = boundaryPoints.length >= 3;

  // Default region (Nashik) or user location
  const initialRegion: Region = currentLocation
    ? { ...currentLocation, latitudeDelta: 0.005, longitudeDelta: 0.005 }
    : { latitude: 20.0063, longitude: 73.7910, latitudeDelta: 0.01, longitudeDelta: 0.01 };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface.raised }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.surface.border, backgroundColor: COLORS.surface.base }}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <X size={22} color={COLORS.text.secondary} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ color: COLORS.text.primary, fontSize: 17, fontFamily: "dm-sans-bold" }}>Add New Field</Text>
        </View>
        {/* Step indicator */}
        <View style={{ flexDirection: "row", gap: 4 }}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={{ width: s === step ? 20 : 8, height: 4, borderRadius: 2, backgroundColor: s <= step ? COLORS.primary.from : COLORS.surface.muted }} />
          ))}
        </View>
      </View>

      {step === 3 ? (
        /* ========== STEP 3: MAP VIEW (full screen) ========== */
        <View style={{ flex: 1 }}>
          {/* Map */}
          <View style={{ flex: 1, position: "relative" }}>
            {HAS_MAPS ? (
              <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
                mapType={mapType}
                initialRegion={initialRegion}
                showsUserLocation
                showsMyLocationButton={false}
                showsCompass
                onPress={handleMapPress}
              >
                {boundaryPoints.length >= 3 && (
                  <Polygon
                    coordinates={boundaryPoints}
                    fillColor="rgba(5, 150, 105, 0.20)"
                    strokeColor={COLORS.primary.from}
                    strokeWidth={2.5}
                  />
                )}
                {boundaryPoints.map((point, idx) => (
                  <Marker key={idx} coordinate={point} anchor={{ x: 0.5, y: 0.5 }}>
                    <View style={{
                      width: 24, height: 24, borderRadius: 12,
                      backgroundColor: idx === 0 ? COLORS.primary.from : "#fff",
                      borderWidth: 2.5, borderColor: COLORS.primary.from,
                      alignItems: "center", justifyContent: "center",
                      ...SHADOWS.md,
                    }}>
                      <Text style={{ color: idx === 0 ? "#fff" : COLORS.primary.from, fontSize: 9, fontFamily: "dm-sans-bold" }}>
                        {idx + 1}
                      </Text>
                    </View>
                  </Marker>
                ))}
              </MapView>
            ) : (
              /* Web fallback: manual coordinate entry */
              <View style={{ flex: 1, backgroundColor: "#0f1a12", alignItems: "center", justifyContent: "center", padding: 20 }}>
                <MapPin size={48} color={COLORS.primary.muted} />
                <Text style={{ color: "#fff", fontSize: 16, fontFamily: "dm-sans-bold", marginTop: 12, textAlign: "center" }}>
                  Map requires native device
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4, textAlign: "center" }}>
                  Use Expo Go on your phone to draw boundaries on Google Maps.
                  {"\n"}Or enter coordinates manually below.
                </Text>
                {/* Manual coordinate input for web */}
                <View style={{ width: "100%", maxWidth: 300, marginTop: 16 }}>
                  <TextInput
                    style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: "#fff", fontSize: 13, marginBottom: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}
                    placeholder="Latitude (e.g. 20.007)"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="decimal-pad"
                    onSubmitEditing={(e) => {
                      const lat = parseFloat(e.nativeEvent.text);
                      if (!isNaN(lat)) setWebLat(lat);
                    }}
                    onChangeText={(t) => { const v = parseFloat(t); if (!isNaN(v)) setWebLat(v); }}
                  />
                  <TextInput
                    style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: "#fff", fontSize: 13, marginBottom: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}
                    placeholder="Longitude (e.g. 73.790)"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="decimal-pad"
                    onChangeText={(t) => { const v = parseFloat(t); if (!isNaN(v)) setWebLng(v); }}
                  />
                  <Pressable
                    onPress={() => {
                      if (webLat && webLng) {
                        setBoundaryPoints((prev) => [...prev, { latitude: webLat!, longitude: webLng! }]);
                      }
                    }}
                    style={{ backgroundColor: COLORS.primary.from, borderRadius: 10, paddingVertical: 10, alignItems: "center" }}
                  >
                    <Text style={{ color: "#fff", fontFamily: "dm-sans-bold", fontSize: 13 }}>Add Point</Text>
                  </Pressable>
                </View>

                {/* Show added points */}
                {boundaryPoints.length > 0 && (
                  <View style={{ marginTop: 12, width: "100%", maxWidth: 300 }}>
                    {boundaryPoints.map((p, i) => (
                      <Text key={i} style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginBottom: 2 }}>
                        P{i + 1}: {p.latitude.toFixed(6)}, {p.longitude.toFixed(6)}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Map controls overlay - top right */}
            <View style={{ position: "absolute", top: 12, right: 12, gap: 8 }}>
              <Pressable
                onPress={() => setMapType(mapType === "satellite" ? "standard" : "satellite")}
                style={{ width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center", ...SHADOWS.md }}
              >
                <Layers size={18} color={COLORS.text.secondary} />
              </Pressable>
              <Pressable
                onPress={getCurrentLocation}
                style={{ width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center", ...SHADOWS.md }}
              >
                <Navigation size={18} color={COLORS.accent.blue} />
              </Pressable>
            </View>

            {/* Instructions overlay - top center */}
            <View style={{ position: "absolute", top: 12, left: 60, right: 60, alignItems: "center" }}>
              <View style={{ backgroundColor: "rgba(0,0,0,0.7)", borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 8 }}>
                <Text style={{ color: "#fff", fontSize: 12, fontFamily: "dm-sans-medium", textAlign: "center" }}>
                  {boundaryPoints.length === 0
                    ? "Tap on map to place boundary points"
                    : boundaryPoints.length < 3
                    ? `${3 - boundaryPoints.length} more point${3 - boundaryPoints.length > 1 ? "s" : ""} needed`
                    : `${boundaryPoints.length} points \u2022 ${calculatedArea.toFixed(2)} acres`
                  }
                </Text>
              </View>
            </View>

            {/* Area badge - bottom center */}
            {hasEnoughPoints && (
              <View style={{ position: "absolute", bottom: 90, left: 0, right: 0, alignItems: "center" }}>
                <LinearGradient
                  colors={GRADIENTS.primary as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: RADIUS.xl, paddingHorizontal: 20, paddingVertical: 10, ...SHADOWS.glow }}
                >
                  <Text style={{ color: "#fff", fontSize: 20, fontFamily: "dm-sans-bold", textAlign: "center" }}>
                    {calculatedArea.toFixed(2)} acres
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, textAlign: "center" }}>
                    {(calculatedArea * 0.4047).toFixed(2)} hectares \u2022 {boundaryPoints.length} points
                  </Text>
                </LinearGradient>
              </View>
            )}
          </View>

          {/* Bottom toolbar */}
          <View style={{ backgroundColor: COLORS.surface.base, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: COLORS.surface.border }}>
            {/* Point actions */}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
              <Pressable
                onPress={undoLastPoint}
                disabled={boundaryPoints.length === 0}
                style={{
                  flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
                  backgroundColor: boundaryPoints.length > 0 ? COLORS.surface.overlay : COLORS.surface.muted,
                  borderRadius: RADIUS.md, paddingVertical: 10,
                }}
              >
                <Undo2 size={16} color={boundaryPoints.length > 0 ? COLORS.text.secondary : COLORS.text.muted} />
                <Text style={{ color: boundaryPoints.length > 0 ? COLORS.text.secondary : COLORS.text.muted, fontSize: 13, fontFamily: "dm-sans-medium" }}>
                  Undo
                </Text>
              </Pressable>
              <Pressable
                onPress={clearAllPoints}
                disabled={boundaryPoints.length === 0}
                style={{
                  flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
                  backgroundColor: boundaryPoints.length > 0 ? "#fef2f2" : COLORS.surface.muted,
                  borderRadius: RADIUS.md, paddingVertical: 10,
                }}
              >
                <Trash2 size={16} color={boundaryPoints.length > 0 ? COLORS.status.critical : COLORS.text.muted} />
                <Text style={{ color: boundaryPoints.length > 0 ? COLORS.status.critical : COLORS.text.muted, fontSize: 13, fontFamily: "dm-sans-medium" }}>
                  Clear All
                </Text>
              </Pressable>
            </View>

            {/* Navigation buttons */}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => setStep(2)}
                style={{ flex: 1, backgroundColor: COLORS.surface.overlay, borderRadius: RADIUS.lg, paddingVertical: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
              >
                <ChevronLeft size={18} color={COLORS.text.secondary} />
                <Text style={{ color: COLORS.text.secondary, fontSize: 15, fontFamily: "dm-sans-bold" }}>Back</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (!hasEnoughPoints) {
                    Alert.alert("Not Enough Points", "Place at least 3 points on the map to define your field boundary.");
                    return;
                  }
                  setSubmitting(true);
                  const finalArea = calculatedArea;

                  (async () => {
                    try {
                      // Use quick-add-field endpoint (creates farmer+farm+field+NDVI+soil in one call)
                      const resp = await fetch(`${BACKEND_URL}/api/v1/quick-add-field`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          field_name: form.name || "New Field",
                          crop: form.crop || "Unknown",
                          area: parseFloat(finalArea.toFixed(2)),
                          soil_type: form.soilType || undefined,
                          irrigation_type: form.irrigationType || undefined,
                          coordinates: boundaryPoints.map((p) => ({ latitude: p.latitude, longitude: p.longitude })),
                          farmer_name: "App User",
                          farm_name: form.name ? `${form.name} Farm` : "My Farm",
                        }),
                      });

                      if (!resp.ok) {
                        const err = await resp.json().catch(() => ({ detail: resp.statusText }));
                        throw new Error(err.detail || `HTTP ${resp.status}`);
                      }

                      const result = await resp.json();
                      setSubmitting(false);

                      // Build result message
                      let msg = `${result.field?.name || form.name} saved to server.\n`;
                      msg += `Farmer: ${result.farmer_id?.slice(0, 8)}...\n`;
                      msg += `Farm: ${result.farm_id?.slice(0, 8)}...\n`;
                      msg += `Boundary: ${boundaryPoints.length} GPS points\n`;

                      const ndvi = result.ndvi_analysis;
                      if (ndvi && !ndvi.error) {
                        msg += `\n--- Satellite NDVI ---`;
                        msg += `\nNDVI: ${ndvi.ndvi_mean?.toFixed(4) || "?"}`;
                        msg += `\nHealth: ${ndvi.health_status || "?"} (${ndvi.health_score || "?"}/100)`;
                        msg += `\nSource: ${ndvi.source || "?"}`;
                        if (ndvi.growth_stage) msg += `\nStage: ${ndvi.growth_stage}`;
                      }

                      const soil = result.soil_report;
                      if (soil && !soil.error) {
                        const p = soil.physical_properties || {};
                        const c = soil.chemical_properties || {};
                        msg += `\n\n--- Soil ---`;
                        msg += `\nTexture: ${p.texture_class || "?"}`;
                        msg += `\npH: ${c.pH || "?"} (${c.pH_status || "?"})`;
                        if (soil.current_conditions?.soil_temperature) {
                          msg += `\nTemp: ${soil.current_conditions.soil_temperature.surface_0cm}°C`;
                        }
                      }

                      const sat = result.sentinel_scenes;
                      if (sat?.count > 0) {
                        msg += `\n\n--- Sentinel-2 ---`;
                        msg += `\n${sat.count} passes | Latest: ${sat.scenes[0]?.date}`;
                      }

                      Alert.alert("Field Added!", msg, [{ text: "Done", onPress: () => router.back() }]);

                    } catch (err: any) {
                      setSubmitting(false);
                      Alert.alert(
                        "Error",
                        `${err.message || "Backend unavailable"}\n\nBackend: ${BACKEND_URL}`,
                        [{ text: "OK", onPress: () => router.back() }]
                      );
                    }
                  })();
                }}
                disabled={submitting}
                style={{
                  flex: 2, borderRadius: RADIUS.lg, paddingVertical: 14, alignItems: "center",
                  flexDirection: "row", justifyContent: "center", gap: 6,
                  backgroundColor: submitting ? COLORS.primary.muted : hasEnoughPoints ? COLORS.primary.from : COLORS.surface.muted,
                  ...SHADOWS.glow,
                }}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Check size={18} color={hasEnoughPoints ? "#fff" : COLORS.text.muted} />
                    <Text style={{ color: hasEnoughPoints ? "#fff" : COLORS.text.muted, fontSize: 15, fontFamily: "dm-sans-bold" }}>
                      Save Field
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        /* ========== STEPS 1 & 2: Form ========== */
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20, paddingTop: 20 }}>
            {step === 1 && (
              <View>
                <Text style={{ color: COLORS.text.primary, fontSize: 20, fontFamily: "dm-sans-bold", marginBottom: 4 }}>Basic Information</Text>
                <Text style={{ color: COLORS.text.muted, fontSize: 13, marginBottom: 20 }}>Enter your field details</Text>

                <Text style={{ color: COLORS.text.secondary, fontSize: 13, fontFamily: "dm-sans-medium", marginBottom: 6 }}>Field Name *</Text>
                <TextInput
                  style={{ backgroundColor: COLORS.surface.overlay, borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: COLORS.text.primary, borderWidth: 1, borderColor: COLORS.surface.border, marginBottom: 16 }}
                  placeholder="e.g., North Block - Wheat"
                  placeholderTextColor={COLORS.text.muted}
                  value={form.name}
                  onChangeText={(t) => setForm({ ...form, name: t })}
                />

                <Text style={{ color: COLORS.text.secondary, fontSize: 13, fontFamily: "dm-sans-medium", marginBottom: 6 }}>Crop *</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {crops.map((crop) => (
                    <Pressable key={crop} onPress={() => setForm({ ...form, crop })}>
                      <View style={{
                        borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 8,
                        backgroundColor: form.crop === crop ? COLORS.primary.from : COLORS.surface.overlay,
                        borderWidth: 1, borderColor: form.crop === crop ? COLORS.primary.from : COLORS.surface.border,
                      }}>
                        <Text style={{ fontSize: 13, fontFamily: "dm-sans-medium", color: form.crop === crop ? "#fff" : COLORS.text.secondary }}>
                          {crop}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {step === 2 && (
              <View>
                <Text style={{ color: COLORS.text.primary, fontSize: 20, fontFamily: "dm-sans-bold", marginBottom: 4 }}>Soil & Irrigation</Text>
                <Text style={{ color: COLORS.text.muted, fontSize: 13, marginBottom: 20 }}>Field conditions</Text>

                <Text style={{ color: COLORS.text.secondary, fontSize: 13, fontFamily: "dm-sans-medium", marginBottom: 6 }}>Soil Type</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                  {soilTypes.map((type) => (
                    <Pressable key={type} onPress={() => setForm({ ...form, soilType: type })}>
                      <View style={{
                        borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 8,
                        backgroundColor: form.soilType === type ? COLORS.primary.from : COLORS.surface.overlay,
                        borderWidth: 1, borderColor: form.soilType === type ? COLORS.primary.from : COLORS.surface.border,
                      }}>
                        <Text style={{ fontSize: 13, fontFamily: "dm-sans-medium", color: form.soilType === type ? "#fff" : COLORS.text.secondary }}>
                          {type}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>

                <Text style={{ color: COLORS.text.secondary, fontSize: 13, fontFamily: "dm-sans-medium", marginBottom: 8 }}>Irrigation Method</Text>
                {irrigationTypes.map((type) => (
                  <Pressable key={type} onPress={() => setForm({ ...form, irrigationType: type })}>
                    <View style={{
                      flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 14,
                      marginBottom: 8, borderRadius: RADIUS.md,
                      backgroundColor: form.irrigationType === type ? COLORS.primary.from + "08" : COLORS.surface.overlay,
                      borderWidth: 1, borderColor: form.irrigationType === type ? COLORS.primary.from : COLORS.surface.border,
                    }}>
                      <Droplet type={type} />
                      <Text style={{ fontSize: 14, fontFamily: "dm-sans-medium", marginLeft: 10, flex: 1, color: form.irrigationType === type ? COLORS.primary.dark : COLORS.text.secondary }}>
                        {type}
                      </Text>
                      {form.irrigationType === type && <Check size={18} color={COLORS.primary.from} />}
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Bottom navigation */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: COLORS.surface.border, backgroundColor: COLORS.surface.base }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {step > 1 && (
                <Pressable
                  onPress={() => setStep(step - 1)}
                  style={{ flex: 1, backgroundColor: COLORS.surface.overlay, borderRadius: RADIUS.lg, paddingVertical: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
                >
                  <ChevronLeft size={18} color={COLORS.text.secondary} />
                  <Text style={{ color: COLORS.text.secondary, fontSize: 15, fontFamily: "dm-sans-bold" }}>Back</Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => {
                  if (step === 1 && (!form.name || !form.crop)) {
                    Alert.alert("Required", "Please enter field name and select a crop.");
                    return;
                  }
                  setStep(step + 1);
                }}
                style={{ flex: step === 1 ? 1 : 2, backgroundColor: COLORS.primary.from, borderRadius: RADIUS.lg, paddingVertical: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6, ...SHADOWS.glow }}
              >
                <Text style={{ color: "#fff", fontSize: 15, fontFamily: "dm-sans-bold" }}>
                  {step === 2 ? "Draw Boundary" : "Next"}
                </Text>
                <ChevronRight size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

// Simple irrigation icon component
function Droplet({ type }: { type: string }) {
  const icons: Record<string, string> = {
    "Drip Irrigation": "\ud83d\udca7", Sprinkler: "\ud83c\udf0a", Flood: "\ud83c\udf0a",
    Furrow: "\ud83d\udca7", "Drip Fertigation": "\ud83d\udca7", Rainfed: "\ud83c\udf27\ufe0f",
  };
  return <Text style={{ fontSize: 18 }}>{icons[type] || "\ud83d\udca7"}</Text>;
}
