// ============================================
// Market Intelligence & Crop Pricing Data
// ============================================

export interface MarketPrice {
  id: string;
  commodity: string;
  variety: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  trend: "up" | "down" | "stable";
  changePercent: number;
  date: string;
}

export interface MarketForecast {
  commodity: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  timeframe: string;
  factors: string[];
  recommendation: "sell" | "hold" | "wait";
}

export interface PestEntry {
  id: string;
  name: string;
  scientificName: string;
  type: "pest" | "disease" | "weed";
  affectedCrops: string[];
  symptoms: string[];
  lifecycle: string;
  favorableConditions: string;
  chemicalControl: { name: string; dosage: string }[];
  organicControl: { name: string; method: string }[];
  preventionMethods: string[];
  severity: "low" | "medium" | "high";
  icon: string;
}

export interface NDVIHistory {
  date: string;
  value: number;
}

export interface FieldDetailData {
  fieldId: string;
  ndviHistory: NDVIHistory[];
  yieldEstimate: number;
  yieldUnit: string;
  growthStage: string;
  daysToHarvest: number;
  waterUsage: { week: string; liters: number }[];
  expenses: { category: string; amount: number }[];
  notes: string[];
}

// --- Market Prices ---
export const marketPrices: MarketPrice[] = [
  {
    id: "mp1",
    commodity: "Wheat",
    variety: "Lokwan",
    market: "Nashik APMC",
    minPrice: 2150,
    maxPrice: 2450,
    modalPrice: 2320,
    unit: "quintal",
    trend: "up",
    changePercent: 3.2,
    date: "2026-04-02",
  },
  {
    id: "mp2",
    commodity: "Tomato",
    variety: "Hybrid",
    market: "Nashik APMC",
    minPrice: 800,
    maxPrice: 1600,
    modalPrice: 1200,
    unit: "quintal",
    trend: "down",
    changePercent: -8.5,
    date: "2026-04-02",
  },
  {
    id: "mp3",
    commodity: "Onion",
    variety: "Red",
    market: "Lasalgaon APMC",
    minPrice: 1800,
    maxPrice: 3200,
    modalPrice: 2600,
    unit: "quintal",
    trend: "up",
    changePercent: 12.4,
    date: "2026-04-02",
  },
  {
    id: "mp4",
    commodity: "Grapes",
    variety: "Thompson Seedless",
    market: "Nashik APMC",
    minPrice: 3500,
    maxPrice: 6500,
    modalPrice: 5200,
    unit: "quintal",
    trend: "stable",
    changePercent: 0.8,
    date: "2026-04-02",
  },
  {
    id: "mp5",
    commodity: "Rice",
    variety: "Basmati",
    market: "Nashik APMC",
    minPrice: 3200,
    maxPrice: 4100,
    modalPrice: 3650,
    unit: "quintal",
    trend: "up",
    changePercent: 2.1,
    date: "2026-04-02",
  },
  {
    id: "mp6",
    commodity: "Capsicum",
    variety: "Green",
    market: "Nashik APMC",
    minPrice: 2000,
    maxPrice: 3800,
    modalPrice: 2900,
    unit: "quintal",
    trend: "down",
    changePercent: -4.2,
    date: "2026-04-02",
  },
  {
    id: "mp7",
    commodity: "Urea",
    variety: "46% N",
    market: "Local Dealer",
    minPrice: 266,
    maxPrice: 266,
    modalPrice: 266,
    unit: "bag (45kg)",
    trend: "stable",
    changePercent: 0,
    date: "2026-04-02",
  },
  {
    id: "mp8",
    commodity: "DAP",
    variety: "18-46-0",
    market: "Local Dealer",
    minPrice: 1350,
    maxPrice: 1350,
    modalPrice: 1350,
    unit: "bag (50kg)",
    trend: "stable",
    changePercent: 0,
    date: "2026-04-02",
  },
];

export const marketForecasts: MarketForecast[] = [
  {
    commodity: "Wheat",
    currentPrice: 2320,
    predictedPrice: 2500,
    confidence: 78,
    timeframe: "Next 30 days",
    factors: [
      "Government procurement at MSP \u20b92275/qtl starts April 15",
      "Low carry-over stocks from last Rabi",
      "Export demand steady from Middle East",
    ],
    recommendation: "hold",
  },
  {
    commodity: "Tomato",
    currentPrice: 1200,
    predictedPrice: 800,
    confidence: 85,
    timeframe: "Next 30 days",
    factors: [
      "Peak arrival season - supply glut expected",
      "Summer production from Karnataka entering market",
      "Storage/cold chain constraints",
    ],
    recommendation: "sell",
  },
  {
    commodity: "Onion",
    currentPrice: 2600,
    predictedPrice: 3200,
    confidence: 72,
    timeframe: "Next 30 days",
    factors: [
      "Rabi onion arrivals delayed by 2 weeks",
      "Strong export demand from Bangladesh, UAE",
      "Previous season's low production creating gap",
    ],
    recommendation: "hold",
  },
  {
    commodity: "Grapes",
    currentPrice: 5200,
    predictedPrice: 4800,
    confidence: 65,
    timeframe: "Next 15 days",
    factors: [
      "Season ending - quality declining in heat",
      "Export window closing for EU shipments",
      "Raisin-making demand provides floor price",
    ],
    recommendation: "sell",
  },
];

// --- Pest Encyclopedia ---
export const pestEncyclopedia: PestEntry[] = [
  {
    id: "pe1",
    name: "Fall Armyworm",
    scientificName: "Spodoptera frugiperda",
    type: "pest",
    affectedCrops: ["Wheat", "Rice", "Maize", "Sorghum"],
    symptoms: [
      "Irregular holes in leaves with ragged edges",
      "Larval frass (excrement) visible in leaf whorl",
      "Windowpane effect on young leaves",
      "Larvae feed at night, hide in whorl during day",
    ],
    lifecycle: "Egg (3 days) \u2192 Larva (14-21 days, 6 instars) \u2192 Pupa (9-13 days) \u2192 Adult moth (10-21 days). Complete cycle: 30-60 days.",
    favorableConditions: "Warm temperatures (25-30\u00b0C), moderate humidity, continuous monocropping",
    chemicalControl: [
      { name: "Emamectin Benzoate 5% SG", dosage: "0.4g/L spray" },
      { name: "Chlorantraniliprole 18.5% SC", dosage: "0.4ml/L spray" },
      { name: "Spinetoram 11.7% SC", dosage: "0.5ml/L spray" },
    ],
    organicControl: [
      { name: "Neem seed kernel extract", method: "5% NSKE spray at egg laying" },
      { name: "Bacillus thuringiensis (Bt)", method: "2g/L spray on early instar larvae" },
      { name: "Trichogramma wasps", method: "Release 50,000/acre at egg stage" },
    ],
    preventionMethods: [
      "Pheromone traps @ 5/acre for monitoring",
      "Inter-cropping with legumes",
      "Early sowing to escape peak infestation",
      "Conservation of natural enemies (birds, spiders)",
    ],
    severity: "high",
    icon: "\ud83d\udc1b",
  },
  {
    id: "pe2",
    name: "Late Blight",
    scientificName: "Phytophthora infestans",
    type: "disease",
    affectedCrops: ["Tomato", "Potato"],
    symptoms: [
      "Water-soaked, dark brown lesions on leaves",
      "White cottony growth on leaf undersides (humid)",
      "Fruit develops large, firm, brown lesions",
      "Rapid spread - can destroy crop in 7-10 days",
    ],
    lifecycle: "Sporangia spread by wind/rain \u2192 Zoospores released in water \u2192 Infect through stomata \u2192 Mycelium colonizes tissue \u2192 New sporangia in 3-5 days",
    favorableConditions: "Cool nights (10-15\u00b0C), warm days (20-25\u00b0C), high humidity >90%, rain/fog/dew",
    chemicalControl: [
      { name: "Mancozeb 75% WP", dosage: "2.5g/L preventive spray" },
      { name: "Cymoxanil 8% + Mancozeb 64% WP", dosage: "3g/L systemic+contact" },
      { name: "Metalaxyl 8% + Mancozeb 64% WP", dosage: "2.5g/L for active infection" },
    ],
    organicControl: [
      { name: "Copper hydroxide 77% WP", method: "2.5g/L preventive spray" },
      { name: "Trichoderma viride", method: "4g/L soil drench + foliar spray" },
      { name: "Bordeaux mixture", method: "1% concentration spray" },
    ],
    preventionMethods: [
      "Use certified disease-free transplants",
      "Maintain plant spacing for air circulation",
      "Avoid overhead irrigation",
      "Remove and destroy infected plant debris",
      "Resistant varieties: Arka Rakshak, Arka Samrat",
    ],
    severity: "high",
    icon: "\ud83e\uddec",
  },
  {
    id: "pe3",
    name: "Thrips (Onion Thrips)",
    scientificName: "Thrips tabaci",
    type: "pest",
    affectedCrops: ["Onion", "Garlic", "Chilli"],
    symptoms: [
      "Silvery white streaks on leaves",
      "Curling and distortion of leaf tips",
      "Stunted plant growth",
      "Brownish-black fecal spots on leaves",
    ],
    lifecycle: "Egg (5-10 days, inserted in leaf tissue) \u2192 Nymph (8-10 days, 2 instars) \u2192 Pre-pupa + Pupa (3-5 days, in soil) \u2192 Adult (14-30 days). Cycle: 15-30 days.",
    favorableConditions: "Hot, dry weather (30-35\u00b0C), low humidity, drought stress, dense planting",
    chemicalControl: [
      { name: "Fipronil 5% SC", dosage: "1ml/L spray at ETL (5 thrips/plant)" },
      { name: "Lambda Cyhalothrin 5% EC", dosage: "0.5ml/L spray" },
      { name: "Carbosulfan 25% EC", dosage: "2ml/L spray" },
    ],
    organicControl: [
      { name: "Spinosad 45% SC", method: "0.3ml/L spray (bio-derived)" },
      { name: "Beauveria bassiana", method: "5g/L spray on nymphs" },
      { name: "Neem oil 1500ppm", method: "3ml/L + sticker, weekly spray" },
    ],
    preventionMethods: [
      "Blue/white sticky traps @ 12/acre for monitoring",
      "Overhead sprinkler irrigation to dislodge nymphs",
      "Inter-cropping with coriander (repellent)",
      "Avoid water stress - maintain adequate irrigation",
    ],
    severity: "medium",
    icon: "\ud83e\udeb2",
  },
  {
    id: "pe4",
    name: "Powdery Mildew",
    scientificName: "Uncinula necator (Grapes)",
    type: "disease",
    affectedCrops: ["Grapes", "Capsicum", "Wheat", "Pea"],
    symptoms: [
      "White powdery coating on leaves, shoots, berries",
      "Leaf curling and premature drop",
      "Berry cracking and scarring",
      "Reduced sugar content in grapes",
    ],
    lifecycle: "Conidia (spores) spread by wind \u2192 Germinate on surface (no free water needed) \u2192 Haustoria penetrate cells \u2192 New conidia in 5-7 days \u2192 Cleistothecia (sexual stage) overwinter",
    favorableConditions: "Moderate temperature (20-27\u00b0C), humidity 40-100%, shaded conditions, dense canopy. Unlike most fungi, does NOT need free water for infection.",
    chemicalControl: [
      { name: "Sulphur 80% WP", dosage: "2g/L spray (not in >35\u00b0C)" },
      { name: "Hexaconazole 5% EC", dosage: "1ml/L systemic spray" },
      { name: "Azoxystrobin 23% SC", dosage: "0.5ml/L spray" },
    ],
    organicControl: [
      { name: "Potassium bicarbonate", method: "5g/L + sticker, weekly spray" },
      { name: "Milk spray", method: "10% fresh milk in water, biweekly" },
      { name: "Ampelomyces quisqualis (AQ10)", method: "Mycoparasite, 5g/10L spray" },
    ],
    preventionMethods: [
      "Proper canopy management and pruning",
      "Ensure good air circulation between rows",
      "Remove and destroy infected shoot tips",
      "Resistant varieties where available",
    ],
    severity: "medium",
    icon: "\ud83c\udf44",
  },
  {
    id: "pe5",
    name: "Rice Blast",
    scientificName: "Magnaporthe oryzae",
    type: "disease",
    affectedCrops: ["Rice"],
    symptoms: [
      "Diamond/spindle-shaped lesions with gray center on leaves",
      "Neck blast: brown-black lesion at panicle base",
      "Node blast: blackening at nodes causing breakage",
      "White empty panicles (neck blast)",
    ],
    lifecycle: "Conidia spread by wind/rain \u2192 Appressorium forms on leaf (6-8 hrs) \u2192 Penetration peg breaches cell wall \u2192 Lesion forms in 4-5 days \u2192 Sporulation in humid conditions",
    favorableConditions: "Continuous leaf wetness >12 hrs, temperature 25-28\u00b0C, excess nitrogen, drought stress followed by flooding",
    chemicalControl: [
      { name: "Tricyclazole 75% WP", dosage: "0.6g/L preventive spray" },
      { name: "Isoprothiolane 40% EC", dosage: "1.5ml/L spray" },
      { name: "Carbendazim 50% WP", dosage: "1g/L spray at boot/heading" },
    ],
    organicControl: [
      { name: "Pseudomonas fluorescens", method: "10g/L seed treatment + foliar spray" },
      { name: "Trichoderma harzianum", method: "5g/L spray at tillering" },
      { name: "Silicon-based spray", method: "Potassium silicate 0.5% strengthens cell walls" },
    ],
    preventionMethods: [
      "Balanced nitrogen fertilization (avoid excess)",
      "Resistant varieties: Rajendra Mahsuri, Pusa Basmati 1637",
      "Seed treatment with Pseudomonas",
      "Maintain 2-3cm standing water during tillering",
      "Avoid drought stress followed by sudden flooding",
    ],
    severity: "high",
    icon: "\ud83c\udf3e",
  },
  {
    id: "pe6",
    name: "Cyperus rotundus (Nutgrass)",
    scientificName: "Cyperus rotundus",
    type: "weed",
    affectedCrops: ["Onion", "Tomato", "Capsicum", "Rice"],
    symptoms: [
      "Dense weed patches competing for nutrients and water",
      "Reduced crop yield by 20-40%",
      "Underground tuber network makes eradication difficult",
      "Allelopathic effect suppressing crop growth",
    ],
    lifecycle: "Propagates primarily through tubers (not seeds). One tuber can produce 1900 plants and 7000 tubers in one season. Dormant tubers viable for 3+ years.",
    favorableConditions: "Moist, warm soils, disturbed land, irrigated fields, all soil types",
    chemicalControl: [
      { name: "Glyphosate 41% SL", dosage: "10ml/L pre-planting directed spray" },
      { name: "Halosulfuron methyl 75% WG", dosage: "0.09g/L post-emergence" },
      { name: "Imazethapyr 10% SL", dosage: "750ml/acre (for legume fields)" },
    ],
    organicControl: [
      { name: "Solar mulching", method: "Black polythene mulch 50 micron for 45 days" },
      { name: "Smother cropping", method: "Dense cowpea/sunnhemp cover crop" },
      { name: "Repeated tillage", method: "Expose tubers to summer sun (June)" },
    ],
    preventionMethods: [
      "Avoid introducing tuber-contaminated soil",
      "Stale seedbed technique before sowing",
      "Dense crop spacing to suppress growth",
      "Regular hand weeding before tuber formation",
    ],
    severity: "medium",
    icon: "\ud83c\udf3f",
  },
];

// --- Field Detail Data ---
export const fieldDetails: Record<string, FieldDetailData> = {
  f1: {
    fieldId: "f1",
    ndviHistory: [
      { date: "Jan 15", value: 0.25 },
      { date: "Feb 01", value: 0.38 },
      { date: "Feb 15", value: 0.52 },
      { date: "Mar 01", value: 0.65 },
      { date: "Mar 15", value: 0.72 },
      { date: "Apr 01", value: 0.78 },
    ],
    yieldEstimate: 18.5,
    yieldUnit: "quintals/acre",
    growthStage: "Grain Filling",
    daysToHarvest: 18,
    waterUsage: [
      { week: "W1", liters: 35000 },
      { week: "W2", liters: 42000 },
      { week: "W3", liters: 38000 },
      { week: "W4", liters: 45000 },
    ],
    expenses: [
      { category: "Seeds", amount: 4500 },
      { category: "Fertilizers", amount: 12000 },
      { category: "Pesticides", amount: 3500 },
      { category: "Irrigation", amount: 8000 },
      { category: "Labor", amount: 15000 },
    ],
    notes: [
      "Good tillering observed, above average plant count",
      "One spray of fungicide applied March 5 for rust prevention",
      "Second irrigation delayed by 3 days - no visible stress",
    ],
  },
  f2: {
    fieldId: "f2",
    ndviHistory: [
      { date: "Jan 20", value: 0.15 },
      { date: "Feb 05", value: 0.28 },
      { date: "Feb 20", value: 0.42 },
      { date: "Mar 05", value: 0.55 },
      { date: "Mar 20", value: 0.60 },
      { date: "Apr 01", value: 0.62 },
    ],
    yieldEstimate: 12.0,
    yieldUnit: "tons/acre",
    growthStage: "Flowering + Early Fruiting",
    daysToHarvest: 43,
    waterUsage: [
      { week: "W1", liters: 28000 },
      { week: "W2", liters: 25000 },
      { week: "W3", liters: 30000 },
      { week: "W4", liters: 22000 },
    ],
    expenses: [
      { category: "Seedlings", amount: 6000 },
      { category: "Fertilizers", amount: 9500 },
      { category: "Pesticides", amount: 5200 },
      { category: "Irrigation", amount: 6000 },
      { category: "Staking/Labor", amount: 18000 },
    ],
    notes: [
      "Early blight spotted on lower leaves - treated Mar 28",
      "Staking in progress, 60% complete",
      "Soil moisture critically low - urgent irrigation needed",
    ],
  },
  f3: {
    fieldId: "f3",
    ndviHistory: [
      { date: "Feb 10", value: 0.20 },
      { date: "Feb 25", value: 0.40 },
      { date: "Mar 10", value: 0.58 },
      { date: "Mar 25", value: 0.75 },
      { date: "Apr 01", value: 0.85 },
    ],
    yieldEstimate: 22.0,
    yieldUnit: "quintals/acre",
    growthStage: "Active Tillering",
    daysToHarvest: 89,
    waterUsage: [
      { week: "W1", liters: 75000 },
      { week: "W2", liters: 80000 },
      { week: "W3", liters: 72000 },
      { week: "W4", liters: 80000 },
    ],
    expenses: [
      { category: "Seeds", amount: 3000 },
      { category: "Fertilizers", amount: 8000 },
      { category: "Pesticides", amount: 2000 },
      { category: "Irrigation", amount: 4000 },
      { category: "Labor", amount: 12000 },
    ],
    notes: [
      "Excellent growth - highest NDVI on farm",
      "Green manuring done before transplanting",
      "Weed management due April 12-15",
    ],
  },
  f4: {
    fieldId: "f4",
    ndviHistory: [
      { date: "Sep 01", value: 0.45 },
      { date: "Oct 01", value: 0.58 },
      { date: "Nov 01", value: 0.68 },
      { date: "Dec 01", value: 0.75 },
      { date: "Jan 01", value: 0.72 },
      { date: "Feb 01", value: 0.71 },
      { date: "Mar 01", value: 0.71 },
    ],
    yieldEstimate: 8.5,
    yieldUnit: "tons/acre",
    growthStage: "Harvest Ready",
    daysToHarvest: 3,
    waterUsage: [
      { week: "W1", liters: 18000 },
      { week: "W2", liters: 15000 },
      { week: "W3", liters: 12000 },
      { week: "W4", liters: 8000 },
    ],
    expenses: [
      { category: "Inputs", amount: 35000 },
      { category: "Fertilizers", amount: 28000 },
      { category: "Pesticides", amount: 18000 },
      { category: "Irrigation", amount: 22000 },
      { category: "Labor", amount: 45000 },
    ],
    notes: [
      "Brix level at 19.2 - ready for harvest",
      "Export quality grading in progress",
      "Coordinate with transport for cold chain",
    ],
  },
  f5: {
    fieldId: "f5",
    ndviHistory: [
      { date: "Feb 01", value: 0.18 },
      { date: "Feb 15", value: 0.30 },
      { date: "Mar 01", value: 0.42 },
      { date: "Mar 15", value: 0.50 },
      { date: "Apr 01", value: 0.45 },
    ],
    yieldEstimate: 8.0,
    yieldUnit: "tons/acre",
    growthStage: "Bulb Development",
    daysToHarvest: 38,
    waterUsage: [
      { week: "W1", liters: 20000 },
      { week: "W2", liters: 18000 },
      { week: "W3", liters: 22000 },
      { week: "W4", liters: 19000 },
    ],
    expenses: [
      { category: "Seedlings", amount: 12000 },
      { category: "Fertilizers", amount: 7000 },
      { category: "Pesticides", amount: 4500 },
      { category: "Irrigation", amount: 5000 },
      { category: "Labor", amount: 10000 },
    ],
    notes: [
      "NDVI dropped last 2 weeks - nitrogen deficiency confirmed",
      "Purple blotch detected in NE corner - treating",
      "Thrips monitoring with blue sticky traps",
    ],
  },
  f6: {
    fieldId: "f6",
    ndviHistory: [
      { date: "Feb 25", value: 0.22 },
      { date: "Mar 05", value: 0.45 },
      { date: "Mar 15", value: 0.65 },
      { date: "Mar 25", value: 0.80 },
      { date: "Apr 01", value: 0.88 },
    ],
    yieldEstimate: 15.0,
    yieldUnit: "tons/acre",
    growthStage: "Vegetative + Early Flowering",
    daysToHarvest: 60,
    waterUsage: [
      { week: "W1", liters: 12000 },
      { week: "W2", liters: 14000 },
      { week: "W3", liters: 15000 },
      { week: "W4", liters: 15000 },
    ],
    expenses: [
      { category: "Seedlings", amount: 8000 },
      { category: "Fertigation", amount: 15000 },
      { category: "Pesticides", amount: 2000 },
      { category: "Greenhouse Maint.", amount: 12000 },
      { category: "Labor", amount: 8000 },
    ],
    notes: [
      "Greenhouse conditions optimal - fastest growth on farm",
      "Micronutrient spray scheduled April 8-9",
      "Pollination support with bumble bees active",
    ],
  },
};
