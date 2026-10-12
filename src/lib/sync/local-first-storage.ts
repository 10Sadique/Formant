/**
 * Local-First Offline & Android Persistence Engine
 *
 * Designed for seamless parity between the Web App (IndexedDB) and the
 * future Android App (Room SQLite + Local FileSystem `.wav` storage).
 *
 * Stores:
 * 1. `local_recordings` - Acoustic `.wav` blobs + DSP feature metrics + syncStatus
 * 2. `local_profile_cache` - Offline user profile & 18-skill matrix snapshot
 * 3. `sync_outbox_queue` - Pending mutations to push to `/api/v1/sync` when online
 */

export interface LocalRecordingRecord {
  clientRecordId: string;
  userId: string;
  deviceId: string;
  promptId: string;
  promptText: string;
  durationSec: number;
  audioBase64DataUrl?: string;
  localAudioFilePath?: string; // e.g. file:///data/user/0/com.accentlab.app/files/recordings/rec_123.wav on Android
  overallScore: number;
  intelligibilityScore: number;
  fluencyScore: number;
  speechRateWpm: number;
  syncStatus: "pending_upload" | "synced" | "conflict";
  createdAt: string;
}

const DB_NAME = "accentlab_local_db";
const DB_VERSION = 1;

function openIndexedDb(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("local_recordings")) {
        const recStore = db.createObjectStore("local_recordings", {
          keyPath: "clientRecordId",
        });
        recStore.createIndex("syncStatus", "syncStatus", { unique: false });
        recStore.createIndex("createdAt", "createdAt", { unique: false });
      }
      if (!db.objectStoreNames.contains("local_profile_cache")) {
        db.createObjectStore("local_profile_cache", { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

export async function saveRecordingLocally(
  record: LocalRecordingRecord
): Promise<boolean> {
  const db = await openIndexedDb();
  if (!db) return false;

  return new Promise((resolve) => {
    const tx = db.transaction("local_recordings", "readwrite");
    const store = tx.objectStore("local_recordings");
    store.put(record);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
  });
}

export async function listLocalRecordings(): Promise<LocalRecordingRecord[]> {
  const db = await openIndexedDb();
  if (!db) return [];

  return new Promise((resolve) => {
    const tx = db.transaction("local_recordings", "readonly");
    const store = tx.objectStore("local_recordings");
    const req = store.getAll();
    req.onsuccess = () => {
      const list = (req.result as LocalRecordingRecord[]) || [];
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      resolve(list);
    };
    req.onerror = () => resolve([]);
  });
}

export async function cacheStateSnapshotLocally(
  snapshot: unknown
): Promise<void> {
  const db = await openIndexedDb();
  if (!db) return;

  const tx = db.transaction("local_profile_cache", "readwrite");
  tx.objectStore("local_profile_cache").put({
    key: "latest_state",
    updatedAt: new Date().toISOString(),
    payload: snapshot,
  });
}

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "server-node";
  const existing = window.localStorage.getItem("accentlab_device_id");
  if (existing) return existing;
  const created = `dev_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
  window.localStorage.setItem("accentlab_device_id", created);
  return created;
}
