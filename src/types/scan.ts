export type ScanSeverity = "LOW" | "MODERATE" | "WARNING" | "CRITICAL";
export type ScanStatus = "PROCESSING" | "COMPLETED" | "FAILED";
export type ScanHealthStatus =
  | "CRITICAL"
  | "POOR"
  | "MODERATE"
  | "GOOD"
  | "EXCELLENT";

export interface ScanImages {
  beforeImageUrl: string;
  afterImageUrl: string;
  changeMaskUrl: string;
  ndviHeatmapUrl: string;
}

export interface NDVIStats {
  mean: number;
  min: number;
  max: number;
  healthStatus: ScanHealthStatus;
}

export interface BoundingBox {
  minLat: number;
  minLon: number;
  maxLat: number;
  maxLon: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

// ────────────────────────────────────────────────
// Consolidated ScanResult (ONLY ONE DEFINITION)
// ────────────────────────────────────────────────
export interface ScanResult {
  scanId: string;
  createdAt: string;
  regionName: string;
  bbox: BoundingBox;
  dateRange: DateRange;
  severity: ScanSeverity;
  status: ScanStatus;
  transitions: {
    forestToUrbanPercent: number;
    waterToLandPercent: number;
    urbanExpansionPercent: number; // Included correctly here
  };
  ndvi: NDVIStats;
  images: ScanImages;
  message?: string;
  forestLossPercent?: number;
  urbanGainPercent?: number;
  meanNdvi?: number;
}

// ────────────────────────────────────────────────
// Compact version used in list/dashboard view
// ────────────────────────────────────────────────
export interface Scan {
  id: string;
  regionName: string;
  createdAt: string;
  status: ScanStatus;
  severity: ScanSeverity;
  forestLossPercent?: number;
  urbanGainPercent?: number;
  meanNdvi?: number;
}
