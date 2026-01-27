import type { ScanResult } from "@/types/scan";

const STORAGE_KEY = "sentinel_eye_scan_history_v1";

export function getScanHistory(): ScanResult[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Scan history parse failed:", err);
    return [];
  }
}

export function saveScanToHistory(scan: ScanResult) {
  if (typeof window === "undefined") return;

  const existing = getScanHistory();
  const filtered = existing.filter((s) => s.scanId !== scan.scanId);
  const updated = [scan, ...filtered];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearScanHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
