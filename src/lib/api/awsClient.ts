/**
 * AWS Backend API Client
 * Handles the 3-step process:
 * 1. POST /analyze - Initialize job and get upload URL
 * 2. PUT to upload_url - Upload file to S3
 * 3. GET /results/{job_id} - Poll for results
 */

const API_BASE = process.env.NEXT_PUBLIC_AWS_API_BASE;

if (!API_BASE) {
  console.error("Missing NEXT_PUBLIC_AWS_API_BASE environment variable");
}

/**
 * Backend response from POST /analyze
 */
export interface AnalyzeJobResponse {
  job_id: string;
  upload_url: string;
  status: string;
  message?: string;
}

/**
 * Backend response from GET /results/{job_id}
 */
export interface JobResultResponse {
  job_id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  coordinates: {
    lat: number;
    lon: number;
  };
  results?: {
    prediction: number;
    confidence: number;
    analysis: string;
    details?: Record<string, any>;
  };
  error?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Calculate center point from bounding box
 */
function getCenterFromBbox(bbox: {
  north: number;
  south: number;
  east: number;
  west: number;
}): { lat: number; lon: number } {
  return {
    lat: (bbox.north + bbox.south) / 2,
    lon: (bbox.east + bbox.west) / 2,
  };
}

/**
 * Step 1: Initialize analysis job
 * POST /analyze
 */
export async function initializeAnalysis(payload: {
  coordinates: { lat: number; lon: number };
}): Promise<AnalyzeJobResponse> {
  const url = `${API_BASE}/analyze`;

  console.log("Initializing analysis job:", { url, payload });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Initialize analysis failed:", res.status, errorText);
    throw new Error(
      `Failed to initialize analysis: ${res.status} - ${errorText}`
    );
  }

  return res.json();
}

/**
 * Step 2: Upload file to S3 using pre-signed URL
 * PUT to upload_url
 */
export async function uploadFileToS3(
  uploadUrl: string,
  file: File
): Promise<void> {
  console.log("Uploading file to S3:", { uploadUrl, fileName: file.name, fileSize: file.size });

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "image/tiff",
    },
    body: file,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("File upload failed:", res.status, errorText);
    throw new Error(`Failed to upload file: ${res.status} - ${errorText}`);
  }

  console.log("File uploaded successfully");
}

/**
 * Step 3: Poll for job results
 * GET /results/{job_id}
 */
export async function getJobResults(
  jobId: string
): Promise<JobResultResponse> {
  const url = `${API_BASE}/results/${jobId}`;

  console.log("Polling job results:", { jobId });

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Get job results failed:", res.status, errorText);
    throw new Error(`Failed to get job results: ${res.status} - ${errorText}`);
  }

  return res.json();
}

/**
 * Poll for results until completion or timeout
 */
export async function pollForResults(
  jobId: string,
  options: {
    intervalMs?: number;
    maxAttempts?: number;
    onProgress?: (status: string, attempt: number) => void;
  } = {}
): Promise<JobResultResponse> {
  const { intervalMs = 3000, maxAttempts = 60, onProgress } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const result = await getJobResults(jobId);

    console.log(`Poll attempt ${attempt}/${maxAttempts}:`, result.status);

    if (onProgress) {
      onProgress(result.status, attempt);
    }

    if (result.status === "COMPLETED") {
      return result;
    }

    if (result.status === "FAILED") {
      throw new Error(result.error || "Analysis job failed");
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Polling timed out after ${maxAttempts} attempts`);
}

/**
 * Complete analysis workflow
 * Combines all 3 steps with polling
 */
export async function runCompleteAnalysis(
  bbox: {
    north: number;
    south: number;
    east: number;
    west: number;
  },
  file: File,
  options: {
    onProgress?: (message: string) => void;
  } = {}
): Promise<JobResultResponse> {
  const { onProgress } = options;

  // Step 1: Initialize job
  onProgress?.("Initializing analysis job...");
  const coordinates = getCenterFromBbox(bbox);
  const jobResponse = await initializeAnalysis({ coordinates });

  console.log("Job initialized:", jobResponse);

  // Step 2: Upload file
  onProgress?.("Uploading satellite imagery...");
  await uploadFileToS3(jobResponse.upload_url, file);

  // Step 3: Poll for results
  onProgress?.("Processing imagery...");
  const results = await pollForResults(jobResponse.job_id, {
    onProgress: (status, attempt) => {
      onProgress?.(`Processing... (attempt ${attempt}, status: ${status})`);
    },
  });

  onProgress?.("Analysis complete!");
  return results;
}

/**
 * Legacy direct API call (for other endpoints)
 */
export async function callAWS<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AWS API Error ${res.status}: ${text}`);
  }

  return res.json();
}
