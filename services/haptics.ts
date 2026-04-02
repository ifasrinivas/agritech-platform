// ============================================
// Haptic Feedback Utility
// Provides tactile feedback on key interactions
// Uses expo-haptics (already installed)
// ============================================

import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/** Light tap - for button presses, selections */
export function tapLight() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

/** Medium tap - for toggles, confirmations */
export function tapMedium() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

/** Heavy tap - for important actions (delete, submit) */
export function tapHeavy() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }
}

/** Success notification - for completed actions */
export function notifySuccess() {
  if (Platform.OS !== "web") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}

/** Warning notification - for alerts */
export function notifyWarning() {
  if (Platform.OS !== "web") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }
}

/** Error notification - for failures */
export function notifyError() {
  if (Platform.OS !== "web") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
}

/** Selection changed - for picker/tab changes */
export function selectionChanged() {
  if (Platform.OS !== "web") {
    Haptics.selectionAsync();
  }
}
