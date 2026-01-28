export type ScanSeverity = "LOW" | "MODERATE" | "WARNING" | "CRITICAL";

export interface ScanFinding {
  id: string;
  type: "DEFORESTATION" | "URBAN_EXPANSION" | "WATER_LOSS" | "ILLEGAL_MINING";
  severity: ScanSeverity;
  areaHectares: number;
  confidence: number; 
  description: string;
}

export interface ScanResultResponse {
  scanId: string;
  status: "COMPLETED" | "PROCESSING" | "FAILED";
  severity: ScanSeverity;

  timestamps: {
    before: string;
    after: string;
    analyzedAt: string;
  };

  images: {
    beforeImageUrl: string;
    afterImageUrl: string;
    changeMaskUrl?: string;
    ndviHeatmapUrl?: string;
  };

  stats: {
    ndviMean: number;
    forestLossPercent: number;
    urbanGainPercent: number;
    waterLossPercent: number;
  };

  findings: ScanFinding[];
}
