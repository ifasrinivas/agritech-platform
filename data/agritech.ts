// ============================================
// AgriTech Platform - Mock Data Layer
// ============================================

// --- Types ---
export interface Field {
  id: string;
  name: string;
  crop: string;
  area: number; // acres
  location: { latitude: number; longitude: number };
  ndviScore: number; // 0-1
  healthStatus: "excellent" | "good" | "moderate" | "poor" | "critical";
  soilType: string;
  sowingDate: string;
  expectedHarvest: string;
  irrigationType: string;
  coordinates: { latitude: number; longitude: number }[]; // polygon boundary
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  condition: string;
  icon: string;
  forecast: { day: string; high: number; low: number; condition: string; rainChance: number }[];
}

export interface Alert {
  id: string;
  type: "pest" | "disease" | "weather" | "irrigation" | "nutrient";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  fieldName: string;
  timestamp: string;
  actionRequired: string;
}

export interface SoilData {
  fieldId: string;
  pH: number;
  nitrogen: number; // kg/ha
  phosphorus: number;
  potassium: number;
  organicCarbon: number; // %
  moisture: number; // %
  temperature: number;
  ec: number; // dS/m electrical conductivity
  texture: string;
  recommendations: string[];
}

export interface CropCalendarEntry {
  id: string;
  activity: string;
  startDate: string;
  endDate: string;
  status: "completed" | "in-progress" | "upcoming" | "overdue";
  category: "sowing" | "irrigation" | "fertilization" | "pest-control" | "harvest" | "soil-prep";
  notes: string;
}

export interface ScanResult {
  id: string;
  cropName: string;
  disease: string;
  confidence: number;
  severity: "mild" | "moderate" | "severe";
  treatment: string[];
  organicAlternative: string[];
  preventionTips: string[];
  timestamp: string;
}

export interface CarbonCredit {
  totalCredits: number;
  earnedThisMonth: number;
  practices: { name: string; credits: number; status: string }[];
  history: { month: string; credits: number }[];
}

export interface IrrigationSchedule {
  fieldId: string;
  fieldName: string;
  nextIrrigation: string;
  waterRequired: number; // liters
  method: string;
  soilMoisture: number;
  optimalMoisture: number;
  status: "scheduled" | "in-progress" | "completed" | "skipped";
}

export interface Advisory {
  id: string;
  type: "organic" | "inorganic" | "general";
  category: string;
  title: string;
  description: string;
  timing: string;
  dosage?: string;
  application?: string;
  precautions?: string[];
}

// --- Mock Data ---

export const userProfile = {
  name: "Rajesh Kumar",
  farmName: "Green Valley Farms",
  location: "Nashik, Maharashtra",
  totalArea: 45.5,
  totalFields: 6,
  memberSince: "2023",
  plan: "Premium",
  avatar: null,
};

export const fields: Field[] = [
  {
    id: "f1",
    name: "North Block - Wheat",
    crop: "Wheat",
    area: 12.5,
    location: { latitude: 20.0063, longitude: 73.7910 },
    ndviScore: 0.78,
    healthStatus: "good",
    soilType: "Black Cotton Soil",
    sowingDate: "2025-11-15",
    expectedHarvest: "2026-04-20",
    irrigationType: "Drip Irrigation",
    coordinates: [
      { latitude: 20.0070, longitude: 73.7900 },
      { latitude: 20.0070, longitude: 73.7920 },
      { latitude: 20.0055, longitude: 73.7920 },
      { latitude: 20.0055, longitude: 73.7900 },
    ],
  },
  {
    id: "f2",
    name: "South Block - Tomato",
    crop: "Tomato",
    area: 8.0,
    location: { latitude: 20.0043, longitude: 73.7895 },
    ndviScore: 0.62,
    healthStatus: "moderate",
    soilType: "Red Laterite",
    sowingDate: "2026-01-10",
    expectedHarvest: "2026-05-15",
    irrigationType: "Sprinkler",
    coordinates: [
      { latitude: 20.0050, longitude: 73.7885 },
      { latitude: 20.0050, longitude: 73.7905 },
      { latitude: 20.0035, longitude: 73.7905 },
      { latitude: 20.0035, longitude: 73.7885 },
    ],
  },
  {
    id: "f3",
    name: "East Block - Rice Paddy",
    crop: "Rice",
    area: 10.0,
    location: { latitude: 20.0080, longitude: 73.7935 },
    ndviScore: 0.85,
    healthStatus: "excellent",
    soilType: "Alluvial",
    sowingDate: "2026-02-01",
    expectedHarvest: "2026-06-30",
    irrigationType: "Flood",
    coordinates: [
      { latitude: 20.0088, longitude: 73.7925 },
      { latitude: 20.0088, longitude: 73.7945 },
      { latitude: 20.0072, longitude: 73.7945 },
      { latitude: 20.0072, longitude: 73.7925 },
    ],
  },
  {
    id: "f4",
    name: "West Orchard - Grapes",
    crop: "Grapes",
    area: 6.0,
    location: { latitude: 20.0058, longitude: 73.7870 },
    ndviScore: 0.71,
    healthStatus: "good",
    soilType: "Sandy Loam",
    sowingDate: "2025-08-01",
    expectedHarvest: "2026-03-15",
    irrigationType: "Drip Irrigation",
    coordinates: [
      { latitude: 20.0065, longitude: 73.7860 },
      { latitude: 20.0065, longitude: 73.7880 },
      { latitude: 20.0050, longitude: 73.7880 },
      { latitude: 20.0050, longitude: 73.7860 },
    ],
  },
  {
    id: "f5",
    name: "Central Block - Onion",
    crop: "Onion",
    area: 5.0,
    location: { latitude: 20.0060, longitude: 73.7910 },
    ndviScore: 0.45,
    healthStatus: "poor",
    soilType: "Black Cotton Soil",
    sowingDate: "2026-01-20",
    expectedHarvest: "2026-05-10",
    irrigationType: "Furrow",
    coordinates: [
      { latitude: 20.0065, longitude: 73.7905 },
      { latitude: 20.0065, longitude: 73.7915 },
      { latitude: 20.0055, longitude: 73.7915 },
      { latitude: 20.0055, longitude: 73.7905 },
    ],
  },
  {
    id: "f6",
    name: "Greenhouse - Capsicum",
    crop: "Capsicum",
    area: 4.0,
    location: { latitude: 20.0050, longitude: 73.7925 },
    ndviScore: 0.88,
    healthStatus: "excellent",
    soilType: "Prepared Mix",
    sowingDate: "2026-02-15",
    expectedHarvest: "2026-06-01",
    irrigationType: "Drip Irrigation",
    coordinates: [
      { latitude: 20.0055, longitude: 73.7920 },
      { latitude: 20.0055, longitude: 73.7930 },
      { latitude: 20.0045, longitude: 73.7930 },
      { latitude: 20.0045, longitude: 73.7920 },
    ],
  },
];

export const weatherData: WeatherData = {
  temperature: 32,
  humidity: 65,
  windSpeed: 12,
  rainfall: 0,
  condition: "Partly Cloudy",
  icon: "cloud-sun",
  forecast: [
    { day: "Today", high: 34, low: 22, condition: "Partly Cloudy", rainChance: 10 },
    { day: "Thu", high: 33, low: 21, condition: "Sunny", rainChance: 5 },
    { day: "Fri", high: 31, low: 20, condition: "Cloudy", rainChance: 40 },
    { day: "Sat", high: 28, low: 19, condition: "Rain", rainChance: 85 },
    { day: "Sun", high: 27, low: 18, condition: "Thunderstorm", rainChance: 90 },
    { day: "Mon", high: 30, low: 20, condition: "Cloudy", rainChance: 30 },
    { day: "Tue", high: 32, low: 21, condition: "Sunny", rainChance: 5 },
  ],
};

export const alerts: Alert[] = [
  {
    id: "a1",
    type: "pest",
    severity: "critical",
    title: "Fall Armyworm Detected",
    description: "High probability of Fall Armyworm infestation detected via satellite imagery analysis in North Block. Leaf damage patterns consistent with early-stage larval feeding.",
    fieldName: "North Block - Wheat",
    timestamp: "2026-04-02T06:30:00Z",
    actionRequired: "Immediate scouting recommended. Apply Emamectin Benzoate 5% SG @ 0.4g/L or Neem-based spray as organic alternative.",
  },
  {
    id: "a2",
    type: "disease",
    severity: "high",
    title: "Late Blight Risk - Tomato",
    description: "Weather conditions (high humidity + moderate temperature) favor Late Blight (Phytophthora infestans). 78% risk probability over next 72 hours.",
    fieldName: "South Block - Tomato",
    timestamp: "2026-04-02T08:00:00Z",
    actionRequired: "Preventive spray of Mancozeb 75% WP @ 2.5g/L recommended. Ensure proper drainage.",
  },
  {
    id: "a3",
    type: "weather",
    severity: "high",
    title: "Heavy Rainfall Warning",
    description: "IMD advisory: Heavy to very heavy rainfall expected Sat-Sun (80-120mm). Risk of waterlogging in low-lying fields.",
    fieldName: "All Fields",
    timestamp: "2026-04-02T05:00:00Z",
    actionRequired: "Prepare drainage channels. Delay any planned fertilizer application. Harvest ready produce from West Orchard.",
  },
  {
    id: "a4",
    type: "nutrient",
    severity: "medium",
    title: "Nitrogen Deficiency Detected",
    description: "Spectral analysis shows yellowing patterns consistent with nitrogen deficiency in Central Block. NDVI dropped 0.15 in past 2 weeks.",
    fieldName: "Central Block - Onion",
    timestamp: "2026-04-01T14:00:00Z",
    actionRequired: "Apply Urea @ 50kg/acre or Neem-coated Urea for slow release. Foliar spray of 2% Urea for immediate correction.",
  },
  {
    id: "a5",
    type: "irrigation",
    severity: "medium",
    title: "Soil Moisture Below Threshold",
    description: "Soil moisture at 18% in South Block, below optimal threshold of 35% for Tomato. Crop stress indicators visible.",
    fieldName: "South Block - Tomato",
    timestamp: "2026-04-01T16:00:00Z",
    actionRequired: "Increase irrigation frequency. Check drip lines for blockage. Target 35-40% soil moisture.",
  },
];

export const soilDataByField: Record<string, SoilData> = {
  f1: {
    fieldId: "f1",
    pH: 7.2,
    nitrogen: 280,
    phosphorus: 22,
    potassium: 185,
    organicCarbon: 0.65,
    moisture: 32,
    temperature: 24,
    ec: 0.45,
    texture: "Clay Loam",
    recommendations: [
      "Maintain current pH levels - ideal for Wheat",
      "Apply 20kg/acre DAP for phosphorus boost",
      "Add vermicompost @ 2 ton/acre to improve organic carbon",
    ],
  },
  f2: {
    fieldId: "f2",
    pH: 6.1,
    nitrogen: 195,
    phosphorus: 35,
    potassium: 210,
    organicCarbon: 0.48,
    moisture: 18,
    temperature: 26,
    ec: 0.32,
    texture: "Sandy Clay",
    recommendations: [
      "Apply lime @ 2 quintal/acre to raise pH to 6.5",
      "Increase nitrogen via split application of Urea",
      "Urgent: Increase irrigation - moisture critically low",
      "Mulching recommended to retain soil moisture",
    ],
  },
  f3: {
    fieldId: "f3",
    pH: 6.8,
    nitrogen: 320,
    phosphorus: 28,
    potassium: 165,
    organicCarbon: 0.82,
    moisture: 55,
    temperature: 23,
    ec: 0.58,
    texture: "Silty Clay",
    recommendations: [
      "Excellent organic carbon - continue green manuring",
      "Apply MOP @ 25kg/acre for potassium",
      "Monitor water level - currently optimal for paddy",
    ],
  },
  f4: {
    fieldId: "f4",
    pH: 7.5,
    nitrogen: 240,
    phosphorus: 18,
    potassium: 290,
    organicCarbon: 0.55,
    moisture: 28,
    temperature: 25,
    ec: 0.65,
    texture: "Sandy Loam",
    recommendations: [
      "Slightly alkaline - apply Sulphur @ 10kg/acre",
      "Increase phosphorus - apply SSP @ 50kg/acre",
      "Good potassium levels for grape production",
    ],
  },
  f5: {
    fieldId: "f5",
    pH: 7.8,
    nitrogen: 150,
    phosphorus: 12,
    potassium: 140,
    organicCarbon: 0.35,
    moisture: 22,
    temperature: 27,
    ec: 0.78,
    texture: "Heavy Clay",
    recommendations: [
      "CRITICAL: Very low organic carbon - apply FYM @ 5 ton/acre",
      "Nitrogen severely deficient - immediate Urea application needed",
      "pH too high for Onion - apply Sulphur + organic matter",
      "Improve drainage to prevent waterlogging in clay soil",
    ],
  },
  f6: {
    fieldId: "f6",
    pH: 6.5,
    nitrogen: 310,
    phosphorus: 40,
    potassium: 250,
    organicCarbon: 0.95,
    moisture: 38,
    temperature: 22,
    ec: 0.40,
    texture: "Prepared Cocopeat Mix",
    recommendations: [
      "Optimal conditions across all parameters",
      "Continue current fertigation schedule",
      "Monitor EC - keep below 0.5 for Capsicum",
    ],
  },
};

export const cropCalendar: CropCalendarEntry[] = [
  {
    id: "cc1",
    activity: "Soil Testing & Preparation",
    startDate: "2026-01-05",
    endDate: "2026-01-15",
    status: "completed",
    category: "soil-prep",
    notes: "Complete soil analysis for all blocks. Prepare beds for Rabi season.",
  },
  {
    id: "cc2",
    activity: "Tomato Transplanting",
    startDate: "2026-01-10",
    endDate: "2026-01-15",
    status: "completed",
    category: "sowing",
    notes: "Transplant 30-day seedlings. Spacing: 60cm x 45cm. Variety: Arka Rakshak.",
  },
  {
    id: "cc3",
    activity: "Wheat - 2nd Irrigation",
    startDate: "2026-02-10",
    endDate: "2026-02-12",
    status: "completed",
    category: "irrigation",
    notes: "Crown root initiation stage. Critical irrigation - do not skip.",
  },
  {
    id: "cc4",
    activity: "Tomato - NPK Fertilization",
    startDate: "2026-03-28",
    endDate: "2026-04-01",
    status: "completed",
    category: "fertilization",
    notes: "Apply 19:19:19 @ 5g/L through drip. Split dose - 2nd application due April 15.",
  },
  {
    id: "cc5",
    activity: "Onion - Pest Scouting",
    startDate: "2026-04-01",
    endDate: "2026-04-05",
    status: "in-progress",
    category: "pest-control",
    notes: "Monitor for thrips and purple blotch. Check traps weekly.",
  },
  {
    id: "cc6",
    activity: "Grape Harvest - Table Variety",
    startDate: "2026-04-05",
    endDate: "2026-04-15",
    status: "upcoming",
    category: "harvest",
    notes: "Check Brix level > 18. Harvest early morning. Pack in 2kg crates.",
  },
  {
    id: "cc7",
    activity: "Wheat - Pre-harvest Drying",
    startDate: "2026-04-10",
    endDate: "2026-04-18",
    status: "upcoming",
    category: "harvest",
    notes: "Stop irrigation. Allow grain moisture to reach 14%. Arrange combine harvester.",
  },
  {
    id: "cc8",
    activity: "Capsicum - Micronutrient Spray",
    startDate: "2026-04-08",
    endDate: "2026-04-09",
    status: "upcoming",
    category: "fertilization",
    notes: "Spray Calcium Boron @ 2ml/L for fruit quality. Evening application preferred.",
  },
  {
    id: "cc9",
    activity: "Rice Paddy - Weed Management",
    startDate: "2026-04-12",
    endDate: "2026-04-15",
    status: "upcoming",
    category: "pest-control",
    notes: "Apply Bispyribac Sodium 10% SC @ 120ml/acre. Maintain 2-3cm water level.",
  },
  {
    id: "cc10",
    activity: "Tomato - Staking & Pruning",
    startDate: "2026-04-03",
    endDate: "2026-04-06",
    status: "in-progress",
    category: "general" as any,
    notes: "Support plants with bamboo stakes. Remove suckers below first fruit cluster.",
  },
];

export const scanHistory: ScanResult[] = [
  {
    id: "s1",
    cropName: "Tomato",
    disease: "Early Blight (Alternaria solani)",
    confidence: 94,
    severity: "moderate",
    treatment: [
      "Mancozeb 75% WP @ 2.5g/L spray",
      "Chlorothalonil 75% WP @ 2g/L",
      "Remove and destroy infected leaves",
    ],
    organicAlternative: [
      "Trichoderma viride @ 4g/L foliar spray",
      "Pseudomonas fluorescens @ 5g/L",
      "Neem oil 0.3% spray",
    ],
    preventionTips: [
      "Maintain proper plant spacing for air circulation",
      "Avoid overhead irrigation",
      "Practice crop rotation with non-solanaceous crops",
      "Use disease-free certified seeds",
    ],
    timestamp: "2026-03-28T10:30:00Z",
  },
  {
    id: "s2",
    cropName: "Wheat",
    disease: "Healthy - No Disease Detected",
    confidence: 97,
    severity: "mild",
    treatment: [],
    organicAlternative: [],
    preventionTips: [
      "Continue current management practices",
      "Monitor for rust symptoms as temperatures rise",
    ],
    timestamp: "2026-03-25T14:15:00Z",
  },
  {
    id: "s3",
    cropName: "Onion",
    disease: "Purple Blotch (Alternaria porri)",
    confidence: 87,
    severity: "severe",
    treatment: [
      "Difenoconazole 25% EC @ 0.5ml/L",
      "Tebuconazole 25.9% EC @ 1ml/L",
      "Spray at 10-day interval for 3 applications",
    ],
    organicAlternative: [
      "Trichoderma harzianum @ 5g/L",
      "Copper oxychloride 50% WP @ 3g/L",
      "Improve field drainage immediately",
    ],
    preventionTips: [
      "Ensure proper drainage in field",
      "Avoid late evening irrigation",
      "Remove and destroy crop debris after harvest",
    ],
    timestamp: "2026-03-20T09:45:00Z",
  },
];

export const carbonCredits: CarbonCredit = {
  totalCredits: 24.5,
  earnedThisMonth: 3.2,
  practices: [
    { name: "Cover Cropping", credits: 8.5, status: "Active" },
    { name: "No-Till Farming", credits: 6.2, status: "Active" },
    { name: "Drip Irrigation", credits: 4.8, status: "Active" },
    { name: "Organic Composting", credits: 3.0, status: "Active" },
    { name: "Agroforestry Buffer", credits: 2.0, status: "Pending Verification" },
  ],
  history: [
    { month: "Oct", credits: 2.1 },
    { month: "Nov", credits: 2.5 },
    { month: "Dec", credits: 2.8 },
    { month: "Jan", credits: 3.0 },
    { month: "Feb", credits: 2.9 },
    { month: "Mar", credits: 3.2 },
  ],
};

export const irrigationSchedules: IrrigationSchedule[] = [
  {
    fieldId: "f1",
    fieldName: "North Block - Wheat",
    nextIrrigation: "2026-04-05",
    waterRequired: 45000,
    method: "Drip Irrigation",
    soilMoisture: 32,
    optimalMoisture: 35,
    status: "scheduled",
  },
  {
    fieldId: "f2",
    fieldName: "South Block - Tomato",
    nextIrrigation: "2026-04-02",
    waterRequired: 30000,
    method: "Sprinkler",
    soilMoisture: 18,
    optimalMoisture: 35,
    status: "in-progress",
  },
  {
    fieldId: "f3",
    fieldName: "East Block - Rice Paddy",
    nextIrrigation: "2026-04-03",
    waterRequired: 80000,
    method: "Flood Irrigation",
    soilMoisture: 55,
    optimalMoisture: 60,
    status: "scheduled",
  },
  {
    fieldId: "f6",
    fieldName: "Greenhouse - Capsicum",
    nextIrrigation: "2026-04-02",
    waterRequired: 15000,
    method: "Drip Fertigation",
    soilMoisture: 38,
    optimalMoisture: 40,
    status: "completed",
  },
];

export const advisories: Advisory[] = [
  {
    id: "adv1",
    type: "inorganic",
    category: "Fertilizer",
    title: "Wheat - Top Dressing (Urea)",
    description: "Apply second split dose of Nitrogen at tillering stage for optimal grain filling.",
    timing: "45-50 days after sowing",
    dosage: "Urea @ 55 kg/acre",
    application: "Broadcast in standing crop followed by light irrigation",
    precautions: ["Do not apply in waterlogged conditions", "Apply in evening hours", "Avoid during heavy rain forecast"],
  },
  {
    id: "adv2",
    type: "organic",
    category: "Biofertilizer",
    title: "Tomato - Jeevamrutha Application",
    description: "Liquid organic manure to boost soil microbial activity and plant immunity.",
    timing: "Every 15 days during vegetative & fruiting stage",
    dosage: "200L Jeevamrutha per acre via drip",
    application: "Mix 10kg desi cow dung + 10L cow urine + 2kg jaggery + 2kg pulse flour in 200L water. Ferment 48hrs.",
    precautions: ["Use within 7 days of preparation", "Do not mix with chemical fertilizers"],
  },
  {
    id: "adv3",
    type: "organic",
    category: "Pest Management",
    title: "Neem Oil Spray - Broad Spectrum",
    description: "Effective against sucking pests (aphids, whiteflies, thrips) and as antifeedant for caterpillars.",
    timing: "Apply at first sign of pest or preventively every 10-14 days",
    dosage: "Neem oil 1500ppm @ 3ml/L + sticker 0.5ml/L",
    application: "Spray on both leaf surfaces, early morning or late evening",
    precautions: ["Do not mix with Sulphur-based products", "Avoid spraying in direct sunlight", "Re-apply after rain"],
  },
  {
    id: "adv4",
    type: "inorganic",
    category: "Micronutrient",
    title: "Zinc Sulphate Spray - Rice",
    description: "Correct zinc deficiency common in paddy fields. Zinc is critical for grain development.",
    timing: "25-30 days after transplanting",
    dosage: "ZnSO4 @ 5g/L + lime 2.5g/L",
    application: "Foliar spray, 500L spray solution per acre",
    precautions: ["Always add lime to neutralize acidity", "Do not mix with phosphatic fertilizers"],
  },
  {
    id: "adv5",
    type: "general",
    category: "Water Management",
    title: "Alternate Wetting & Drying (AWD) - Rice",
    description: "Water-saving technique that reduces water use by 30% without yield loss. Also reduces methane emissions.",
    timing: "From 15 days after transplanting to flowering",
    application: "Allow water level to drop to 15cm below soil surface, then re-flood to 5cm. Install perforated pipe to monitor.",
    precautions: ["Maintain continuous flooding during flowering stage", "Not suitable for saline soils"],
  },
  {
    id: "adv6",
    type: "organic",
    category: "Soil Health",
    title: "Green Manuring with Dhaincha",
    description: "In-situ green manuring adds 25-30 kg N/acre and improves soil structure for next season.",
    timing: "Sow immediately after Rabi harvest, incorporate at 45 days",
    dosage: "Dhaincha seed @ 20 kg/acre",
    application: "Broadcast and incorporate with rotavator at 50% flowering stage",
    precautions: ["Ensure adequate moisture for germination", "Do not let it set seed"],
  },
];

// Helper functions
export const getFieldHealthColor = (status: Field["healthStatus"]) => {
  switch (status) {
    case "excellent": return "#22c55e";
    case "good": return "#84cc16";
    case "moderate": return "#eab308";
    case "poor": return "#f97316";
    case "critical": return "#ef4444";
  }
};

export const getNDVIColor = (score: number) => {
  if (score >= 0.8) return "#15803d";
  if (score >= 0.6) return "#65a30d";
  if (score >= 0.4) return "#ca8a04";
  if (score >= 0.2) return "#ea580c";
  return "#dc2626";
};

export const getAlertColor = (severity: Alert["severity"]) => {
  switch (severity) {
    case "critical": return "#dc2626";
    case "high": return "#ea580c";
    case "medium": return "#eab308";
    case "low": return "#22c55e";
  }
};

export const getSoilPHStatus = (pH: number) => {
  if (pH < 5.5) return { label: "Very Acidic", color: "#dc2626" };
  if (pH < 6.0) return { label: "Acidic", color: "#ea580c" };
  if (pH < 6.5) return { label: "Slightly Acidic", color: "#eab308" };
  if (pH <= 7.5) return { label: "Neutral (Ideal)", color: "#22c55e" };
  if (pH <= 8.0) return { label: "Slightly Alkaline", color: "#eab308" };
  return { label: "Alkaline", color: "#ea580c" };
};

export const getCalendarCategoryColor = (cat: CropCalendarEntry["category"]) => {
  switch (cat) {
    case "sowing": return "#8b5cf6";
    case "irrigation": return "#3b82f6";
    case "fertilization": return "#22c55e";
    case "pest-control": return "#ef4444";
    case "harvest": return "#f59e0b";
    case "soil-prep": return "#6b7280";
    default: return "#6b7280";
  }
};
