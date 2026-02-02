# Connection Roadmap - COMPLETE IMPLEMENTATION

## Overview
This document shows the exact implementation of the 3-step roadmap for connecting your Next.js frontend to the AWS backend.

## The 3-Step Roadmap

### Step 1: Setup (Environment Variables)

**File**: `.env.local`

```bash
# The "Phone Number" of your backend
NEXT_PUBLIC_API_URL=https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev
```

✅ **Status**: Already configured

---

### Step 2: The "Upload" Component (The Input)

**File**: `src/lib/api/backendClient.ts`

```typescript
const API = process.env.NEXT_PUBLIC_API_URL;

/**
 * Step 2: Upload Image
 * 
 * Logic Flow:
 * 1. User picks a file
 * 2. Frontend calls POST /analyze (Your API)
 * 3. Your API returns a job_id and an upload_url
 * 4. Frontend uses that upload_url to send the file directly to S3
 */
export async function uploadImage(
  file: File,
  coordinates?: { lat: number; lon: number }
): Promise<string> {
  
  // 1. Ask Backend for permission (The Handshake)
  const initReq = await fetch(`${API}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      coordinates: coordinates || { lat: -10, lon: -63 }
    }),
  });

  const { job_id, upload_url } = await initReq.json();

  // 2. Upload the file to S3 (The Heavy Lift)
  // Note: We use the secure URL you generated!
  await fetch(upload_url, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "image/tiff" }
  });

  return job_id; // Pass this to Step 3
}
```

✅ **Status**: Implemented in `backendClient.ts`

---

### Step 3: The "Status" Component (The Output)

**File**: `src/lib/api/backendClient.ts`

```typescript
/**
 * Step 3: Check Status
 * 
 * Logic Flow:
 * 1. Frontend takes the job_id from Step 2
 * 2. It creates a loop (polling) that runs every 2 seconds
 * 3. It calls GET /results/{job_id}
 * 4. If the JSON says status: "COMPLETED", it stops the loop and shows the alert
 */
export async function checkStatus(
  jobId: string,
  onProgress?: (message: string) => void
): Promise<any> {
  
  const pollInterval = 2000; // 2 seconds
  const maxAttempts = 60; // 2 minutes max

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    
    const response = await fetch(`${API}/results/${jobId}`);
    const data = await response.json();

    if (data.status === 'COMPLETED') {
      // SUCCESS! Show the red alert badge
      alert(data.message); // "ALERT: Illegal Encroachment..."
      return data;
    } else {
      // Still thinking... wait 2 seconds and try again
      console.log("Analyzing...");
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }
}
```

✅ **Status**: Implemented in `backendClient.ts`

---

## Complete Usage Example

### Simple Component

```typescript
// components/UploadForm.tsx
"use client";

import { useState } from "react";
import { uploadImage, checkStatus } from "@/lib/api/backendClient";

export default function UploadForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = e.target.elements.file;
    const file = fileInput.files[0];

    if (!file) return;

    setLoading(true);

    try {
      // Step 2: Upload
      const jobId = await uploadImage(file);

      // Step 3: Check Status
      const data = await checkStatus(jobId);

      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="file" accept=".tif,.tiff" />
      <button type="submit" disabled={loading}>
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>
      
      {result && (
        <div className="alert">
          <h3>{result.severity}</h3>
          <p>{result.message}</p>
        </div>
      )}
    </form>
  );
}
```

---

## Summary Checklist

✅ **Environment Variable**
- NEXT_PUBLIC_API_URL set in .env.local

✅ **Upload Component (Step 2)**
- POST /analyze to get job_id and upload_url
- PUT to upload_url to send file to S3
- Returns job_id for Step 3

✅ **Status Component (Step 3)**
- GET /results/{job_id} every 2 seconds
- Stop when status is "COMPLETED"
- Show alert with data.message

✅ **Rules Followed**
- Don't open API URL in browser (won't work)
- Use POST for /analyze
- Use PUT for upload_url
- Use GET for /results/{id}

---

## File Structure

```
src/
├── lib/
│   └── api/
│       ├── backendClient.ts      ← Step 2 & 3 Implementation
│       ├── analyzeService.ts     ← Uses backendClient
│       └── awsClient.ts          ← Legacy (kept for compatibility)
├── hooks/
│   └── useAnalyzeRegion.ts       ← Uses analyzeService
└── app/
    └── analysis/
        ├── page.tsx              ← Analysis page
        └── components/
            ├── FileUploader.tsx  ← File input component
            └── ...

.env.local                          ← Step 1 Configuration
```

---

## Console Output Example

When you run the analysis, you'll see:

```
============================================================
ANALYZE REGION - ROADMAP IMPLEMENTATION
============================================================
[LIVE MODE] Using AWS Backend
API URL: https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev

>>> STEP 2: No file provided, uploading dummy file...
Step 2: Upload Component - Starting upload process...
  → POST /analyze (asking for upload permission)
  ✅ Got Job ID: 6f34e870-2723-420b-9e71-be969899d98f
  ✅ Got Upload URL (length: 1280)
  → PUT to S3 (uploading file)...
  ✅ File uploaded successfully to S3

>>> STEP 3: Checking status...
Step 3: Status Component - Checking analysis status...
  → GET /results/6f34e870... (attempt 1/60)
  Status: PROCESSING
  ⏳ Still processing... waiting 2000ms
  
  → GET /results/6f34e870... (attempt 2/60)
  Status: COMPLETED
  ✅ ANALYSIS COMPLETED!

============================================================
BACKEND RESPONSE:
============================================================
{
  "job_id": "6f34e870-2723-420b-9e71-be969899d98f",
  "status": "COMPLETED",
  "severity": "CRITICAL",
  "message": "ALERT: Illegal Encroachment detected in Protected Area! (25.4% coverage)",
  "urban_pct": "25.4"
}
============================================================
```

---

## Testing

### Python Script Test
```bash
python scripts/test_backend.py --full
```

### Frontend Test
```bash
npm run dev
# Go to http://localhost:3000/analysis
# Select area on map and click "Analyze"
```

---

## Status

✅ **All 3 Steps Implemented**
✅ **Build Successful**
✅ **Backend Connection Verified**
✅ **Ready for Production**

**Last Updated**: 2026-02-02
