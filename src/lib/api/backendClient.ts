/**
 * AWS Backend API Client - CORS-PROXY VERSION
 * 
 * To avoid CORS issues, we route requests through Next.js API routes:
 * 
 * Frontend → /api/analyze → AWS /analyze
 * Frontend → /api/results/{id} → AWS /results/{id}
 * Frontend → S3 (direct, pre-signed URL) → File upload
 * 
 * This works because:
 * 1. Browser calls same-origin /api/* routes (no CORS)
 * 2. Next.js server calls AWS (server-to-server, no CORS)
 * 3. S3 pre-signed URLs work with proper headers
 */

/**
 * Step 2: Upload Component
 * 
 * Logic Flow:
 * 1. User picks a file
 * 2. Frontend calls POST /api/analyze (PROXY - no CORS!)
 * 3. AWS returns job_id and upload_url
 * 4. Frontend uploads file directly to S3 using upload_url
 * 
 * @param file - The selected file (e.g., from <input type="file">)
 * @param coordinates - Optional coordinates {lat: number, lon: number}
 * @returns job_id - Pass this to checkStatus()
 */
export async function uploadImage(
  file: File,
  coordinates?: { lat: number; lon: number }
): Promise<string> {
  console.log("Step 2: Upload Component - Starting upload process...");

  // 1. Ask Backend for permission (through PROXY - no CORS!)
  console.log("  → POST /api/analyze (via proxy to avoid CORS)");
  const initReq = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: coordinates || { lat: -10, lon: -63 },
    }),
  });

  if (!initReq.ok) {
    const error = await initReq.text();
    throw new Error(`Failed to initialize upload: ${initReq.status} - ${error}`);
  }

  const { job_id, upload_url } = await initReq.json();
  console.log(`  ✅ Got Job ID: ${job_id}`);
  console.log(`  ✅ Got Upload URL (length: ${upload_url.length})`);

  // 2. Upload the file to S3 (direct upload, pre-signed URL handles auth)
  console.log("  → PUT to S3 (uploading file directly)...");
  const uploadRes = await fetch(upload_url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "image/tiff",
    },
  });

  if (!uploadRes.ok) {
    const error = await uploadRes.text();
    throw new Error(`Failed to upload file: ${uploadRes.status} - ${error}`);
  }

  console.log("  ✅ File uploaded successfully to S3");
  console.log(`Step 2 Complete! Job ID: ${job_id}`);

  return job_id;
}

/**
 * Step 3: Status Component
 * 
 * Logic Flow:
 * 1. Frontend takes the job_id from Step 2
 * 2. It creates a loop (polling) that runs every 2 seconds
 * 3. It calls GET /api/results/{job_id} (PROXY - no CORS!)
 * 4. If status is "COMPLETED", it stops the loop and shows the alert
 * 
 * @param jobId - The job ID from uploadImage()
 * @param onProgress - Optional callback for progress updates
 * @returns The complete result data
 */
export async function checkStatus(
  jobId: string,
  onProgress?: (message: string) => void
): Promise<any> {
  console.log("Step 3: Status Component - Checking analysis status...");

  const pollInterval = 2000; // 2 seconds
  const maxAttempts = 60; // 2 minutes max

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`  → GET /api/results/${jobId} (attempt ${attempt}/${maxAttempts})`);
    onProgress?.(`Checking status... (attempt ${attempt})`);

    // Call through PROXY (no CORS!)
    const response = await fetch(`/api/results/${jobId}`);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to check status: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log(`  Status: ${data.status}`);

    if (data.status === "COMPLETED") {
      console.log("  ✅ ANALYSIS COMPLETED!");
      console.log("  Result:", data);
      onProgress?.("Analysis complete!");
      return data;
    } else if (data.status === "FAILED") {
      console.error("  ❌ ANALYSIS FAILED");
      throw new Error(data.error || "Analysis failed");
    } else {
      console.log(`  ⏳ Still processing... waiting ${pollInterval}ms`);
      onProgress?.(`Analyzing... (status: ${data.status})`);
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }
  }

  throw new Error(`Polling timed out after ${maxAttempts} attempts`);
}

/**
 * Complete Analysis Workflow
 * 
 * Combines Step 2 (Upload) and Step 3 (Status) into one function
 */
export async function analyzeFile(
  file: File,
  coordinates?: { lat: number; lon: number },
  onProgress?: (message: string) => void
): Promise<any> {
  console.log("=".repeat(60));
  console.log("COMPLETE ANALYSIS WORKFLOW (CORS-PROXY)");
  console.log("=".repeat(60));

  onProgress?.("Starting upload...");
  const jobId = await uploadImage(file, coordinates);

  onProgress?.("Waiting for analysis...");
  const result = await checkStatus(jobId, onProgress);

  console.log("=".repeat(60));
  console.log("WORKFLOW COMPLETE!");
  console.log("=".repeat(60));

  return result;
}

// Types
export interface AnalyzeResponse {
  job_id: string;
  upload_url: string;
  message?: string;
}

export interface ResultResponse {
  job_id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  coordinates: {
    lat: number;
    lon: number;
  };
  message?: string;
  severity?: string;
  urban_pct?: string;
  error?: string;
  created_at: number;
  updated_at: number;
}

/**
 * CHECKLIST:
 * ✅ POST /api/analyze (proxy, no CORS)
 * ✅ PUT to S3 (direct, pre-signed URL)
 * ✅ GET /api/results/{id} (proxy, no CORS)
 */
