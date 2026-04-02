// ============================================
// WebSocket Client for Real-time NDVI Progress
// Connects to backend ws://host/ws/ndvi/{fieldId}
// ============================================

import { BACKEND_URL } from "./api-config";

export interface NDVIProgressMessage {
  step: string;
  progress: number;
  detail: string;
  result?: {
    ndvi_mean: number;
    health_score: number;
    health_status: string;
    source: string;
    satellite_date: string;
    growth_stage: string | null;
    recommendation: string | null;
    has_irrigation_alert: boolean;
  };
}

export type ProgressCallback = (message: NDVIProgressMessage) => void;

/**
 * Connect to WebSocket for real-time NDVI analysis updates.
 * Returns a cleanup function to close the connection.
 */
export function connectNDVIWebSocket(
  fieldId: string,
  onProgress: ProgressCallback,
  onError?: (error: string) => void,
  onComplete?: (result: NDVIProgressMessage["result"]) => void,
): () => void {
  const wsUrl = BACKEND_URL.replace("http://", "ws://").replace("https://", "wss://");
  const ws = new WebSocket(`${wsUrl}/ws/ndvi/${fieldId}`);

  ws.onopen = () => {
    onProgress({ step: "connected", progress: 0, detail: "Connected to analysis server" });
  };

  ws.onmessage = (event) => {
    try {
      const msg: NDVIProgressMessage = JSON.parse(event.data);
      onProgress(msg);

      if (msg.step === "complete" && msg.result && onComplete) {
        onComplete(msg.result);
      }

      if (msg.step === "error" && onError) {
        onError(msg.detail);
      }
    } catch (e) {
      onError?.("Failed to parse server message");
    }
  };

  ws.onerror = () => {
    onError?.("WebSocket connection failed. Backend may be unreachable.");
  };

  ws.onclose = () => {
    // Normal close after complete
  };

  // Return cleanup function
  return () => {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  };
}
