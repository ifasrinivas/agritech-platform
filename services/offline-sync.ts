// ============================================
// Offline Sync Service
// Queues operations when backend is unreachable
// and syncs them when connectivity is restored.
// ============================================

import { backendClient, FieldCreateRequest, CropHealthResponse } from "./backend-client";

export interface QueuedOperation {
  id: string;
  type: "create_field" | "trigger_ndvi" | "create_farmer";
  payload: any;
  createdAt: string;
  retries: number;
  lastError?: string;
}

// In-memory queue (in production: use AsyncStorage or SQLite)
let operationQueue: QueuedOperation[] = [];
let isSyncing = false;

export function getQueue(): QueuedOperation[] {
  return [...operationQueue];
}

export function getQueueSize(): number {
  return operationQueue.length;
}

export function addToQueue(type: QueuedOperation["type"], payload: any): string {
  const id = `op_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  operationQueue.push({
    id,
    type,
    payload,
    createdAt: new Date().toISOString(),
    retries: 0,
  });
  // Try sync immediately
  trySyncQueue();
  return id;
}

export function removeFromQueue(id: string): void {
  operationQueue = operationQueue.filter((op) => op.id !== id);
}

export function clearQueue(): void {
  operationQueue = [];
}

export async function trySyncQueue(): Promise<{ synced: number; failed: number }> {
  if (isSyncing || operationQueue.length === 0) {
    return { synced: 0, failed: 0 };
  }

  isSyncing = true;
  let synced = 0;
  let failed = 0;

  // Check if backend is available first
  const available = await backendClient.isAvailable();
  if (!available) {
    isSyncing = false;
    return { synced: 0, failed: operationQueue.length };
  }

  // Process queue in order
  const toProcess = [...operationQueue];
  for (const op of toProcess) {
    try {
      await processOperation(op);
      removeFromQueue(op.id);
      synced++;
    } catch (err: any) {
      op.retries++;
      op.lastError = err.message || "Unknown error";
      failed++;

      // Remove after 5 retries
      if (op.retries >= 5) {
        removeFromQueue(op.id);
      }
    }
  }

  isSyncing = false;
  return { synced, failed };
}

async function processOperation(op: QueuedOperation): Promise<void> {
  switch (op.type) {
    case "create_field":
      await backendClient.createField(op.payload as FieldCreateRequest);
      break;
    case "trigger_ndvi":
      await backendClient.triggerNDVI(op.payload.fieldId);
      break;
    case "create_farmer":
      await backendClient.createFarmer(op.payload);
      break;
    default:
      throw new Error(`Unknown operation type: ${op.type}`);
  }
}

// Auto-sync every 2 minutes
let syncInterval: ReturnType<typeof setInterval> | null = null;

export function startAutoSync(intervalMs = 120000): void {
  if (syncInterval) return;
  syncInterval = setInterval(() => {
    trySyncQueue();
  }, intervalMs);
}

export function stopAutoSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}
