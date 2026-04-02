// ============================================
// Premium Design System - AgriTech Platform
// ============================================

export const COLORS = {
  // Primary green gradient
  primary: {
    from: "#059669",    // emerald-600
    via: "#10b981",     // emerald-500
    to: "#34d399",      // emerald-400
    dark: "#064e3b",    // emerald-900
    light: "#d1fae5",   // emerald-100
    muted: "#6ee7b7",   // emerald-300
  },
  // Accent
  accent: {
    blue: "#0ea5e9",
    indigo: "#6366f1",
    amber: "#f59e0b",
    rose: "#f43f5e",
    violet: "#8b5cf6",
    teal: "#14b8a6",
    cyan: "#06b6d4",
  },
  // Neutral
  surface: {
    base: "#ffffff",
    raised: "#f8fafc",
    overlay: "#f1f5f9",
    muted: "#e2e8f0",
    border: "#e2e8f0",
    borderLight: "#f1f5f9",
  },
  // Text
  text: {
    primary: "#0f172a",
    secondary: "#475569",
    muted: "#94a3b8",
    inverse: "#ffffff",
    accent: "#059669",
  },
  // Status
  status: {
    excellent: "#059669",
    good: "#65a30d",
    moderate: "#d97706",
    poor: "#ea580c",
    critical: "#dc2626",
  },
  // Glass
  glass: {
    white: "rgba(255,255,255,0.72)",
    whiteBorder: "rgba(255,255,255,0.18)",
    dark: "rgba(15,23,42,0.60)",
    green: "rgba(5,150,105,0.08)",
  },
};

export const SHADOWS = {
  sm: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  glow: {
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const GRADIENTS = {
  primary: ["#059669", "#10b981", "#34d399"] as const,
  primaryDark: ["#064e3b", "#065f46", "#059669"] as const,
  hero: ["#064e3b", "#059669", "#10b981"] as const,
  sky: ["#0ea5e9", "#38bdf8", "#7dd3fc"] as const,
  sunset: ["#f97316", "#fb923c", "#fdba74"] as const,
  violet: ["#7c3aed", "#8b5cf6", "#a78bfa"] as const,
  surface: ["#f8fafc", "#ffffff", "#ffffff"] as const,
  dark: ["#0f172a", "#1e293b", "#334155"] as const,
};

// Consistent spacing scale (4px base)
export const SPACE = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Border radius
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};
