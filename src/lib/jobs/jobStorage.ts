import type { JobHistoryItem } from "@/types/jobs";

const STORAGE_KEY = "sentinel_eye_job_history_v1";
const MAX_ITEMS = Number(process.env.NEXT_PUBLIC_MAX_SCAN_HISTORY || 20);

export function getJobHistory(): JobHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Job history parse failed:", err);
    return [];
  }
}

export function getJobById(jobId: string): JobHistoryItem | null {
  const items = getJobHistory();
  return items.find((j) => j.job_id === jobId) ?? null;
}

export function upsertJob(item: JobHistoryItem) {
  if (typeof window === "undefined") return;
  const existing = getJobHistory();
  const filtered = existing.filter((j) => j.job_id !== item.job_id);
  const updated = [item, ...filtered].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("job-history-updated"));
}

export function clearJobHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("job-history-updated"));
}
