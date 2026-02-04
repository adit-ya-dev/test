
export type Severity = "LOW" | "MODERATE" | "WARNING" | "CRITICAL";

/**
 * NDVI value statistics + vegetation health classification
 */
export interface NdviStats {
  mean: number;
  min: number;
  max: number;
  /** Health classification derived from mean NDVI */
  healthStatus: "CRITICAL" | "POOR" | "MODERATE" | "GOOD" | "EXCELLENT";
  /** Optional – can be added later without breaking changes */
  stdDev?: number;
  validPixelPercentage?: number;
}

/**
 * Key land-use/land-cover transition percentages
 * (percentages are relative to total analyzed area)
 */
export interface LandUseTransitions {
  forestToUrbanPercent: number;
  waterToLandPercent: number;
  /** Future-proof: easy to extend with more transition classes */
  // forestToAgriculturePercent?: number;
  // agricultureToUrbanPercent?: number;
  // barrenToVegetationPercent?: number;
}

/**
 * Image URLs related to a single analysis/scan
 * - before/after: original satellite images (usually from Sentinel/Landsat/etc.)
 * - generated overlays: AI-processed results (change mask, NDVI heatmap, etc.)
 */
export interface AnalysisImages {
  /** Original image before the change period (e.g. older date) */
  beforeImageUrl: string;
  /** Original image after the change period (e.g. newer date) */
  afterImageUrl: string;
  /** AI-generated change detection mask (binary or probability map) */
  changeMaskUrl?: string;
  /** NDVI heatmap visualization (colored raster) */
  ndviHeatmapUrl?: string;
  /** Optional: semantic segmentation mask (class-colored) */
  segmentationMaskUrl?: string;
  /** Optional: when presigned URLs are used (S3, CloudFront, etc.) */
  expiresAt?: string;
}

/**
 * Dashboard statistics for overview page
 */
export interface DashboardStats {
  totalScans: number;
  activeThreats: number;
  areaMonitoredKm2: number;
  recentChanges: number;
}

/**
 * Full response shape from a single analysis request (/api/analyze or similar)
 */
export interface AnalyzeResponse {
  /** Current processing state of this scan */
  status: "PROCESSING" | "COMPLETED" | "FAILED";

  /** Unique identifier for this analysis run */
  scanId: string;

  /** Overall threat/severity level for this scan */
  severity: Severity;

  /** Vegetation health & NDVI statistics */
  ndvi: NdviStats;

  /** Detected land-use transitions */
  transitions: LandUseTransitions;

  /** All relevant image URLs (original + AI-generated) */
  images: AnalysisImages;

  /** Optional human-readable message or error detail */
  message?: string;

  /** Optional metadata – very useful for debugging & UI */
  processedAt?: string; // ISO timestamp
  processingTimeMs?: number; // how long it took
  errorDetails?: string; // only present when status === 'FAILED'
  requestCoordinates?: {
    // optional echo of input AOI
    north: number;
    south: number;
    east: number;
    west: number;
  };
}
