export type ChangeType =
  | "deforestation"
  | "urban_expansion"
  | "encroachment";

export type JobStatus = "Queued" | "Processing" | "Completed" | "Failed";

export interface AnalyzeRequest {
  coordinates: {
    lat: number;
    lon: number;
  };
  start_year: number;
  end_year: number;
  change_types: ChangeType[];
}

export interface AnalyzeResponse {
  job_id: string;
  status: JobStatus;
  message: string;
}

export interface JobStatusResponse {
  job_id: string;
  status: JobStatus;
  progress: number;
  message: string;
  coordinates: { lat: number; lon: number };
  start_year: number;
  end_year: number;
}

export interface JobResultsResponse {
  job_id: string;
  status: "Completed";
  results: {
    statistics: {
      total_area_changed_km2: number;
      deforestation_km2: number;
      urban_expansion_km2: number;
      encroachment_km2: number;
      total_changes: number;
    };
    changes: Array<{
      change_id: string;
      type: ChangeType;
      area_km2: number;
      severity: "low" | "medium" | "high";
      coordinates: { lat: number; lon: number };
      geometry: {
        type: "Polygon";
        coordinates: number[][][];
      };
    }>;
    downloads: {
      geojson_url: string;
      csv_url: string;
      summary_url: string;
    };
  };
}

export interface JobHistoryItem {
  job_id: string;
  status: JobStatus;
  progress: number;
  message: string;
  coordinates: { lat: number; lon: number };
  start_year: number;
  end_year: number;
  change_types: ChangeType[];
  created_at: string;
  updated_at: string;
  results_summary?: JobResultsResponse["results"]["statistics"];
}
