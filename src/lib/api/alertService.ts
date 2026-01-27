// 1. Remove the broken import
// import type { AlertItem } from "@/types/alert";

export type AlertSeverity = "LOW" | "WARNING" | "CRITICAL";

export type AlertType =
  | "DEFORESTATION"
  | "NDVI_DROP"
  | "URBAN_EXPANSION"
  | "ANOMALY";

export interface Alert {
  id: string;
  scanId: string;
  createdAt: string;
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  description: string;
  regionName: string;
  recommendation: string[];
}

// 2. Update the function to use Promise<Alert[]>
export async function getAlerts(): Promise<Alert[]> {
  const res = await fetch("/api/alerts");
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
}
