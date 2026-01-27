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
