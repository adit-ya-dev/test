# Sentinel Eye - Backend Integration

## Quick Reference

### Backend API Endpoint
```
https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev
```

### 3-Step Process (Both Python & JavaScript)

| Step | Action | Endpoint | Purpose |
|------|--------|----------|---------|
| 1 | POST | `/analyze` | Initialize job, get job_id + upload_url |
| 2 | PUT | `upload_url` | Upload .tif file to S3 |
| 3 | GET | `/results/{job_id}` | Poll for analysis results |

---

## Option 1: Python Testing Script

### Quick Start

```bash
# Navigate to scripts folder
cd scripts

# Install dependencies (if not already installed)
pip install requests

# Quick connectivity test (Step 1 only)
python test_backend.py --quick

# Full test with dummy data
python test_backend.py --full

# Full test with real .tif file
python test_backend.py --file /path/to/your/satellite_image.tif
```

### Python Code Example

```python
import requests
import json
import time

API_URL = "https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev"

# --- STEP 1: INITIALIZE JOB ---
response = requests.post(
    f"{API_URL}/analyze",
    json={"coordinates": {"lat": -10, "lon": -63}},
    headers={"Content-Type": "application/json"}
)

data = response.json()
job_id = data['job_id']
upload_url = data['upload_url']

print(f"Job ID: {job_id}")
print(f"Upload URL: {upload_url[:50]}...")

# --- STEP 2: UPLOAD FILE ---
with open('satellite_image.tif', 'rb') as f:
    file_data = f.read()

upload_response = requests.put(
    upload_url,
    data=file_data,
    headers={"Content-Type": "image/tiff"}
)

print(f"Upload status: {upload_response.status_code}")

# --- STEP 3: POLL FOR RESULTS ---
time.sleep(5)  # Wait for processing to start

result_response = requests.get(f"{API_URL}/results/{job_id}")
result = result_response.json()

print(f"Status: {result['status']}")
print(f"Results: {json.dumps(result, indent=2)}")
```

---

## Option 2: Frontend (Next.js)

### Environment Variables (Already Configured)

Your `.env.local` is already set up:

```env
NEXT_PUBLIC_AWS_API_BASE=https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev
NEXT_PUBLIC_ANALYSIS_API=https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev/analyze
NEXT_PUBLIC_USE_MOCK_DATA=false
```

### JavaScript/TypeScript Implementation

#### Step 1: Initialize Job (POST /analyze)

```typescript
// src/lib/api/awsClient.ts
const API_BASE = process.env.NEXT_PUBLIC_AWS_API_BASE;

export interface AnalyzeJobResponse {
  job_id: string;
  upload_url: string;
  status: string;
  message?: string;
}

export async function initializeAnalysis(payload: {
  coordinates: { lat: number; lon: number };
}): Promise<AnalyzeJobResponse> {
  const url = `${API_BASE}/analyze`;
  
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }

  return res.json();
}

// Usage:
const { job_id, upload_url } = await initializeAnalysis({
  coordinates: { lat: -10, lon: -63 }
});
```

#### Step 2: Upload File (PUT to S3)

```typescript
export async function uploadFileToS3(
  uploadUrl: string,
  file: File
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "image/tiff",
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status}`);
  }
}

// Usage:
await uploadFileToS3(upload_url, selectedFile);
```

#### Step 3: Poll for Results (GET /results/{job_id})

```typescript
export interface JobResultResponse {
  job_id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  coordinates: { lat: number; lon: number };
  results?: {
    prediction: number;
    confidence: number;
    analysis: string;
  };
  error?: string;
}

export async function pollForResults(
  jobId: string,
  options: {
    intervalMs?: number;
    maxAttempts?: number;
  } = {}
): Promise<JobResultResponse> {
  const { intervalMs = 3000, maxAttempts = 60 } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const result = await getJobResults(jobId);

    if (result.status === "COMPLETED") {
      return result;
    }

    if (result.status === "FAILED") {
      throw new Error(result.error || "Job failed");
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("Polling timed out");
}

// Usage:
const results = await pollForResults(job_id, {
  intervalMs: 3000,  // Check every 3 seconds
  maxAttempts: 60    // Max 60 attempts (3 minutes)
});
```

---

## Complete Workflow (JavaScript)

```typescript
import {
  initializeAnalysis,
  uploadFileToS3,
  pollForResults
} from "@/lib/api/awsClient";

async function runAnalysis(file: File, bbox: BoundingBox) {
  // 1. Calculate center from bounding box
  const coordinates = {
    lat: (bbox.north + bbox.south) / 2,
    lon: (bbox.east + bbox.west) / 2,
  };

  // 2. Initialize job
  console.log("Step 1: Initializing job...");
  const { job_id, upload_url } = await initializeAnalysis({ coordinates });
  console.log(`Job ID: ${job_id}`);

  // 3. Upload file
  console.log("Step 2: Uploading file...");
  await uploadFileToS3(upload_url, file);
  console.log("Upload complete!");

  // 4. Poll for results
  console.log("Step 3: Polling for results...");
  const results = await pollForResults(job_id);
  
  console.log("Analysis complete!", results);
  return results;
}
```

---

## Side-by-Side Comparison

### Python vs JavaScript

| Python | JavaScript |
|--------|------------|
| `requests.post(url, json=payload)` | `fetch(url, {method: "POST", body: JSON.stringify(payload)})` |
| `response.json()` | `await response.json()` |
| `requests.put(url, data=file)` | `fetch(url, {method: "PUT", body: file})` |
| `requests.get(url)` | `fetch(url, {method: "GET"})` |
| `time.sleep(5)` | `await new Promise(r => setTimeout(r, 5000))` |

---

## Testing

### Test with Python Script

```bash
# Quick test
python scripts/test_backend.py --quick

# Full test with dummy data
python scripts/test_backend.py --full

# Test with real file
python scripts/test_backend.py --file ~/Downloads/satellite_image.tif
```

### Test with Frontend

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000/analysis
```

**Steps:**
1. Select area on map
2. Upload .tif file (optional)
3. Click "Analyze"
4. Watch console logs for 3-step process

---

## Response Format

### POST /analyze Response

```json
{
  "job_id": "4189f853-8403-416d-8671-c8edf2d8d8b5",
  "upload_url": "https://landuse-rondonia-data-dev.s3.amazonaws.com/...",
  "message": "Job created. Use upload_url to PUT your TIF file."
}
```

### GET /results/{job_id} Response (Success)

```json
{
  "job_id": "4189f853-8403-416d-8671-c8edf2d8d8b5",
  "status": "COMPLETED",
  "coordinates": {
    "lat": -10,
    "lon": -63
  },
  "results": {
    "prediction": 0.85,
    "confidence": 0.92,
    "analysis": "High deforestation risk detected in the analyzed region."
  },
  "created_at": "2025-02-02T10:30:00Z",
  "updated_at": "2025-02-02T10:32:15Z"
}
```

### GET /results/{job_id} Response (Pending)

```json
{
  "job_id": "4189f853-8403-416d-8671-c8edf2d8d8b5",
  "status": "PROCESSING",
  "coordinates": {
    "lat": -10,
    "lon": -63
  },
  "created_at": "2025-02-02T10:30:00Z",
  "updated_at": "2025-02-02T10:31:00Z"
}
```

---

## Troubleshooting

### "Failed to initialize analysis"
- Check backend URL is correct
- Check coordinates are valid
- Check CORS is enabled on backend

### "Upload failed"
- Verify file is .tif format
- Check file size (should be reasonable)
- Verify upload_url hasn't expired (5 minutes)

### "Polling timed out"
- Backend processing might be slow
- Check backend logs
- Try with a smaller file

### CORS Errors
Backend already has CORS configured:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type
```

---

## Files Structure

```
sentinel_eye_frontend/
├── scripts/
│   └── test_backend.py      # Python test script
├── src/
│   └── lib/
│       └── api/
│           ├── awsClient.ts    # Main API client (3-step process)
│           └── analyzeService.ts  # High-level analysis service
│   └── app/
│       └── analysis/
│           ├── page.tsx        # Analysis page with file upload
│           └── components/
│               └── FileUploader.tsx  # File upload UI
└── .env.local               # API configuration
```

---

## Summary

✅ **Backend API**: Fully integrated
✅ **Frontend**: Complete 3-step workflow implemented
✅ **Python Script**: Testing tool provided
✅ **Environment**: Already configured
✅ **Documentation**: This file

**Ready to use!** 🚀
