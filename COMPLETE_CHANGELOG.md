# SENTINEL EYE - COMPLETE PROJECT DOCUMENTATION

## Table of Contents
1. [Overview](#overview)
2. [All Changes Made](#all-changes-made)
3. [Architecture Diagram](#architecture-diagram)
4. [File Structure](#file-structure)
5. [How to Make Changes](#how-to-make-changes)
6. [API Endpoints](#api-endpoints)
7. [Troubleshooting](#troubleshooting)
8. [Future Improvements](#future-improvements)

---

## Overview

This document describes all changes made to integrate the Sentinel Eye frontend with the AWS backend API, including CORS fixes, API proxy routes, and frontend components.

**Backend URL:** `https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev`

**Key Features:**
- 3-step backend workflow (initialize → upload → poll)
- CORS proxy pattern (to bypass browser CORS restrictions)
- File upload support (.tif files)
- Real-time progress tracking
- Backend-only mode (no mock data fallback)

---

## All Changes Made

### 1. Environment Configuration

**File:** `.env.local`

**Changes:**
- Added `NEXT_PUBLIC_API_URL` for API endpoint
- Kept `NEXT_PUBLIC_AWS_API_BASE` for backward compatibility
- Set `NEXT_PUBLIC_USE_MOCK_DATA=false` to always use backend

```env
NEXT_PUBLIC_API_URL=https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev
NEXT_PUBLIC_AWS_API_BASE=https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev
NEXT_PUBLIC_USE_MOCK_DATA=false
```

---

### 2. API Client - Backend Integration

**File:** `src/lib/api/backendClient.ts` (NEW FILE)

**Purpose:** Main API client following the 3-step roadmap

**Functions:**
- `uploadImage(file, coordinates)` - Step 2: Initialize job and upload file
- `checkStatus(jobId, onProgress)` - Step 3: Poll for results
- `analyzeFile(file, coordinates, onProgress)` - Complete workflow

**Key Implementation:**
```typescript
// Uses CORS proxy routes instead of direct AWS calls
export async function uploadImage(file: File, coordinates?: { lat: number; lon: number }) {
  // Step 1: POST /api/analyze (proxy, no CORS!)
  const initReq = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coordinates }),
  });
  const { job_id, upload_url } = await initReq.json();

  // Step 2: PUT file to S3 (direct upload with pre-signed URL)
  await fetch(upload_url, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "image/tiff" },
  });

  return job_id;
}
```

---

### 3. Analyze Service - High-Level Integration

**File:** `src/lib/api/analyzeService.ts` (MODIFIED)

**Changes:**
- Removed mock data fallback (was triggered when no file provided)
- Now ALWAYS calls backend (even without file)
- Uses `backendClient.ts` for API calls
- Transforms backend response to frontend format

**Key Change:**
```typescript
// BEFORE: Used mock data when no file
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || !file;

// AFTER: Only uses mock if explicitly enabled
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// Always calls backend - uploads dummy file if no real file provided
if (!file) {
  const dummyData = new Blob(["coordinate-analysis"], { type: "image/tiff" });
  const dummyFile = new File([dummyData], "coords.tif", { type: "image/tiff" });
  jobId = await uploadImage(dummyFile, coordinates);
}
```

---

### 4. CORS Proxy Route - /api/analyze

**File:** `src/app/api/analyze/route.ts` (MODIFIED)

**Purpose:** Proxies requests to AWS backend to avoid CORS errors

**How it works:**
1. Frontend calls same-origin `/api/analyze` (no CORS issues)
2. Next.js server forwards to AWS `/analyze` (server-to-server, no CORS)
3. Response returned to frontend

**Implementation:**
```typescript
const AWS_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  const body = await req.json();
  
  // Forward to AWS (server-to-server, no CORS!)
  const awsResponse = await fetch(`${AWS_API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  
  const awsData = await awsResponse.json();
  return NextResponse.json(awsData);
}
```

---

### 5. CORS Proxy Route - /api/results/[job_id]

**File:** `src/app/api/results/[job_id]/route.ts` (NEW FILE)

**Purpose:** Proxies polling requests to AWS backend

**Route:** `GET /api/results/:job_id`

**Implementation:**
```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ job_id: string }> }
) {
  const { job_id } = await params;
  
  // Forward to AWS
  const awsResponse = await fetch(`${AWS_API_URL}/results/${job_id}`);
  const awsData = await awsResponse.json();
  
  return NextResponse.json(awsData);
}
```

---

### 6. Frontend Hook - useAnalyzeRegion

**File:** `src/hooks/useAnalyzeRegion.ts` (MODIFIED)

**Changes:**
- Added `progress` state for real-time updates
- Added `reset` function
- Improved error handling
- Better console logging

**Interface:**
```typescript
export interface AnalysisProgress {
  stage: "idle" | "initializing" | "uploading" | "processing" | "completed" | "error";
  message: string;
  attempt?: number;
}

export function useAnalyzeRegion() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress>(...);
  
  const run = async (payload: AOIRequest, file?: File) => { ... };
  const reset = () => { ... };
  
  return { run, loading, result, error, progress, reset };
}
```

---

### 7. File Upload Component

**File:** `src/app/analysis/components/FileUploader.tsx` (NEW FILE)

**Purpose:** UI component for uploading .tif files

**Features:**
- File selection with drag-and-drop
- File type validation (.tif, .tiff)
- File size validation (100MB max)
- Shows selected file details
- Clear/reset functionality

**Usage:**
```typescript
<FileUploader
  onFileSelect={(file) => setSelectedFile(file)}
  accept=".tif,.tiff"
  maxSizeMB={100}
/>
```

---

### 8. Analysis Page Integration

**File:** `src/app/analysis/page.tsx` (MODIFIED)

**Changes:**
- Added `FileUploader` component
- Added file state management
- Modified `run()` call to pass file
- Updated UI layout with file upload section

**Key Integration:**
```typescript
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const { run, loading, result, error, progress } = useAnalyzeRegion();

// Call analysis with file
run({
  bbox: bbox!,
  startDate,
  endDate,
  regionName: "Selected AOI",
}, selectedFile || undefined);
```

---

### 9. Progress Log Component

**File:** `src/app/analysis/components/ScanProgressLog.tsx` (MODIFIED)

**Changes:**
- Added real-time progress messages
- Shows current stage (initializing → uploading → processing → completed)
- Displays backend status updates
- Added "FILE UPLOAD" step

**Props:**
```typescript
interface ScanProgressLogProps {
  loading: boolean;
  result: any;
  progress?: AnalysisProgress;
}
```

---

### 10. Python Test Scripts

**Files Created:**
- `scripts/poke_backend.py` - Simple test
- `scripts/test_backend.py` - Full test suite with CLI args
- `deploy_cors_fix.py` - AWS deployment automation

**Usage:**
```bash
# Quick connectivity test
python scripts/test_backend.py --quick

# Full 3-step test
python scripts/test_backend.py --full

# Test with real file
python scripts/test_backend.py --file satellite.tif
```

---

### 11. Documentation Files

**Files Created:**
- `BACKEND_INTEGRATION.md` - Initial integration guide
- `BACKEND_INTEGRATION_GUIDE.md` - Complete guide with examples
- `BACKEND_ONLY_UPDATE.md` - Backend-only mode documentation
- `INTEGRATION_COMPLETE.md` - Summary of all changes
- `ROADMAP_IMPLEMENTATION.md` - Roadmap-based documentation
- `CORS_FIX.md` - CORS workaround documentation
- `AWS_CORS_ROOT_FIX.md` - Root cause fix guide
- `METHOD2_LAMBDA_CORS_GUIDE.md` - Lambda CORS update guide
- `aws-lambda-cors-fix.py` - Complete Lambda code with CORS

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Browser)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Analysis    │  │   File       │  │  Progress    │      │
│  │    Page      │──│  Uploader    │  │    Log       │      │
│  └──────┬───────┘  └──────────────┘  └──────────────┘      │
│         │                                                    │
│  ┌──────▼───────┐                                            │
│  │useAnalyze    │                                            │
│  │   Region     │                                            │
│  └──────┬───────┘                                            │
│         │                                                    │
│  ┌──────▼───────┐                                            │
│  │  analyze     │                                            │
│  │  Service     │                                            │
│  └──────┬───────┘                                            │
│         │                                                    │
│  ┌──────▼───────┐                                            │
│  │  Backend     │                                            │
│  │   Client     │                                            │
│  └──────┬───────┘                                            │
└─────────┼────────────────────────────────────────────────────┘
          │
          │ Same-Origin (No CORS)
          ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTES (Server)                     │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  /api/analyze    │  │ /api/results/    │                 │
│  │     (POST)       │  │   [job_id]       │                 │
│  │                  │  │     (GET)        │                 │
│  └────────┬─────────┘  └────────┬─────────┘                 │
└───────────┼─────────────────────┼───────────────────────────┘
            │                     │
            │ Server-to-Server    │ (No CORS)
            ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    AWS BACKEND                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   API        │  │   Lambda     │  │   S3 Bucket  │      │
│  │  Gateway     │──│  Functions   │──│  (File Store)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│        │                  │                                 │
│        │                  │                                 │
│   /analyze           /results/{id}                         │
│   (POST)              (GET)                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
sentinel_eye_frontend/
│
├── .env.local                          ← Environment variables (ADDED URL)
├── package.json                        ← Dependencies
├── next.config.ts                      ← Next.js config
│
├── src/
│   ├── lib/
│   │   └── api/
│   │       ├── backendClient.ts        ← NEW: Main API client
│   │       ├── analyzeService.ts       ← MODIFIED: Always uses backend
│   │       └── awsClient.ts            ← MODIFIED: Legacy functions
│   │
│   ├── hooks/
│   │   └── useAnalyzeRegion.ts         ← MODIFIED: Added progress tracking
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts            ← MODIFIED: CORS proxy
│   │   │   └── results/
│   │   │       └── [job_id]/
│   │   │           └── route.ts        ← NEW: Results proxy
│   │   │
│   │   └── analysis/
│   │       ├── page.tsx                ← MODIFIED: Added file upload
│   │       └── components/
│   │           ├── FileUploader.tsx    ← NEW: File upload UI
│   │           ├── ScanProgressLog.tsx ← MODIFIED: Progress display
│   │           └── ...
│   │
│   ├── types/
│   │   ├── analysis.ts                 ← Type definitions
│   │   └── geo.ts
│   │
│   └── ...
│
├── scripts/
│   ├── poke_backend.py                 ← NEW: Simple test
│   ├── test_backend.py                 ← NEW: Full test suite
│   └── deploy_cors_fix.py              ← NEW: Deployment script
│
└── Documentation/
    ├── BACKEND_INTEGRATION.md          ← Initial guide
    ├── BACKEND_INTEGRATION_GUIDE.md    ← Complete guide
    ├── INTEGRATION_COMPLETE.md         ← Summary
    ├── CORS_FIX.md                     ← CORS workaround
    ├── AWS_CORS_ROOT_FIX.md            ← Lambda CORS fix
    └── METHOD2_LAMBDA_CORS_GUIDE.md    ← Step-by-step guide
```

---

## How to Make Changes

### 1. Change API Endpoint URL

**If your backend URL changes:**

1. Open `.env.local`
2. Update both URLs:
```env
NEXT_PUBLIC_API_URL=https://your-new-api.execute-api.region.amazonaws.com/stage
NEXT_PUBLIC_AWS_API_BASE=https://your-new-api.execute-api.region.amazonaws.com/stage
```
3. Restart dev server: `npm run dev`

**Note:** The proxy routes (`/api/analyze`, `/api/results`) will automatically use the new URL.

---

### 2. Add New API Endpoints

**To add a new backend endpoint:**

1. **Create proxy route** (if CORS is an issue):
```typescript
// src/app/api/new-endpoint/route.ts
import { NextResponse } from "next/server";

const AWS_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  const awsResponse = await fetch(`${AWS_API_URL}/new-endpoint`);
  const data = await awsResponse.json();
  return NextResponse.json(data);
}
```

2. **Add client function**:
```typescript
// src/lib/api/backendClient.ts
export async function callNewEndpoint() {
  const response = await fetch("/api/new-endpoint");
  return response.json();
}
```

3. **Use in component**:
```typescript
const data = await callNewEndpoint();
```

---

### 3. Modify File Upload

**To change file upload behavior:**

1. Open `src/lib/api/backendClient.ts`
2. Find `uploadImage` function
3. Modify the S3 upload section:

```typescript
// Change file type validation
await fetch(upload_url, {
  method: "PUT",
  body: file,
  headers: {
    "Content-Type": "image/png",  // Changed from image/tiff
  },
});
```

**To add file size limit:**

1. Open `src/app/analysis/components/FileUploader.tsx`
2. Find `handleFileChange` function
3. Modify validation:
```typescript
const maxSizeBytes = 50 * 1024 * 1024; // 50MB instead of 100MB
if (file.size > maxSizeBytes) {
  setError(`File too large. Maximum size is 50MB.`);
}
```

---

### 4. Change Polling Behavior

**To adjust polling frequency:**

1. Open `src/lib/api/backendClient.ts`
2. Find `checkStatus` function
3. Modify parameters:
```typescript
const pollInterval = 5000; // 5 seconds instead of 2
const maxAttempts = 30;    // 30 attempts instead of 60
```

---

### 5. Add New Analysis Parameters

**To send additional data to backend:**

1. Modify `uploadImage` to accept more parameters:
```typescript
export async function uploadImage(
  file: File,
  coordinates?: { lat: number; lon: number },
  options?: { resolution?: string; dateRange?: string }  // NEW
) {
  const initReq = await fetch("/api/analyze", {
    method: "POST",
    body: JSON.stringify({
      coordinates,
      options  // Send additional data
    }),
  });
}
```

2. Update proxy route to forward new data:
```typescript
// In route.ts
const body = await req.json();
// body now includes coordinates and options
```

---

### 6. Switch to Direct AWS Calls (After CORS Fix)

**Once you fix CORS on AWS backend:**

1. Open `src/lib/api/backendClient.ts`
2. Change fetch URLs:
```typescript
// FROM:
const initReq = await fetch("/api/analyze", ...)

// TO:
const API = process.env.NEXT_PUBLIC_API_URL;
const initReq = await fetch(`${API}/analyze`, ...)
```

3. Delete proxy routes (optional):
- `src/app/api/analyze/route.ts`
- `src/app/api/results/[job_id]/route.ts`

---

### 7. Enable Mock Mode

**To use mock data for testing:**

1. Open `.env.local`
2. Change:
```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```
3. Restart dev server

**Note:** This bypasses the backend and returns fake data.

---

### 8. Add Error Handling

**To add custom error handling:**

1. Open `src/lib/api/backendClient.ts`
2. Wrap API calls in try-catch:
```typescript
try {
  const response = await fetch("/api/analyze", ...);
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Too many requests. Please wait.");
    } else if (response.status === 500) {
      throw new Error("Backend error. Please try again later.");
    }
  }
  return response.json();
} catch (error) {
  console.error("API Error:", error);
  throw error;
}
```

---

### 9. Customize Progress Messages

**To change what users see during analysis:**

1. Open `src/lib/api/analyzeService.ts`
2. Find `onProgress` calls:
```typescript
// Change these messages:
onProgress?.("Initializing analysis job...");
onProgress?.("Uploading satellite imagery...");
onProgress?.("Processing imagery...");

// To something else:
onProgress?.("Starting satellite analysis...");
onProgress?.("Uploading your image to cloud storage...");
onProgress?.("AI is analyzing the satellite data...");
```

---

### 10. Add Backend Response Transform

**To transform backend data differently:**

1. Open `src/lib/api/analyzeService.ts`
2. Find `transformBackendResponse` function
3. Modify the transformation:
```typescript
function transformBackendResponse(backendData: any): AnalyzeResponse {
  return {
    status: backendData.status,
    scanId: backendData.job_id,
    severity: backendData.severity || "LOW",
    // Add custom fields
    customField: backendData.some_backend_field,
    // ... rest of mapping
  };
}
```

---

## API Endpoints

### Frontend → Proxy → Backend Flow

| Method | Frontend Path | Proxy Path | Backend Path | Description |
|--------|--------------|------------|--------------|-------------|
| POST | `/api/analyze` | `/api/analyze` | `/analyze` | Initialize job, get upload URL |
| GET | `/api/results/:id` | `/api/results/[job_id]` | `/results/{job_id}` | Poll for results |
| PUT | Direct S3 | Direct S3 | S3 pre-signed URL | Upload file |

### Backend Response Format

**POST /analyze Response:**
```json
{
  "job_id": "uuid-string",
  "upload_url": "https://s3-presigned-url...",
  "message": "Job created. Use upload_url to PUT your TIF file."
}
```

**GET /results/{job_id} Response (Processing):**
```json
{
  "job_id": "uuid-string",
  "status": "PROCESSING",
  "created_at": 1770031728,
  "updated_at": 1770031728
}
```

**GET /results/{job_id} Response (Completed):**
```json
{
  "job_id": "uuid-string",
  "status": "COMPLETED",
  "severity": "CRITICAL",
  "message": "ALERT: Illegal Encroachment detected!",
  "urban_pct": "25.4",
  "coordinates": {"lat": -10, "lon": -63},
  "created_at": 1770031728,
  "updated_at": 1770031732
}
```

---

## Troubleshooting

### Issue: CORS Errors Still Appearing

**Cause:** Backend still doesn't have CORS headers, and proxy isn't working.

**Solution:**
1. Check that proxy routes exist:
   - `src/app/api/analyze/route.ts`
   - `src/app/api/results/[job_id]/route.ts`
2. Check that frontend uses proxy URLs:
   - Should call `/api/analyze`, not `https://aws-api.../analyze`
3. Restart dev server

---

### Issue: File Upload Fails

**Cause:** File too large, wrong format, or S3 URL expired.

**Solution:**
1. Check file size (< 100MB)
2. Check file type (.tif or .tiff)
3. Check that upload happens quickly after getting URL (expires in ~1 hour)

---

### Issue: Polling Times Out

**Cause:** Backend processing too slow or job stuck.

**Solution:**
1. Increase `maxAttempts` in `checkStatus` function
2. Check backend logs in AWS CloudWatch
3. Verify backend Lambda is running

---

### Issue: Mock Data Instead of Backend

**Cause:** `NEXT_PUBLIC_USE_MOCK_DATA=true` or logic error.

**Solution:**
1. Check `.env.local`: `NEXT_PUBLIC_USE_MOCK_DATA=false`
2. Restart dev server after changing env vars
3. Check console for "[LIVE MODE]" vs "[MOCK MODE]"

---

## Future Improvements

### 1. Remove Proxy Routes (After CORS Fix)
Once backend has CORS headers:
- Delete `src/app/api/analyze/route.ts`
- Delete `src/app/api/results/[job_id]/route.ts`
- Update `backendClient.ts` to call AWS directly

### 2. Add WebSocket Support
Replace polling with WebSocket for real-time updates:
- More efficient
- Instant notifications
- Lower latency

### 3. Add Image Compression
Compress .tif files before upload:
- Faster uploads
- Lower bandwidth
- Better UX

### 4. Add Batch Processing
Upload and analyze multiple files at once:
- Better for large datasets
- Parallel processing
- Queue management

### 5. Add Result Caching
Cache analysis results:
- Faster repeat queries
- Reduced backend load
- Better performance

### 6. Add Progress Bar
Show upload progress percentage:
- Better UX for large files
- Real-time upload speed
- Estimated time remaining

---

## Quick Reference

### Restart Everything
```bash
# Stop dev server (Ctrl+C)
# Then restart:
npm run dev

# Test backend connection:
python scripts/test_backend.py --quick
```

### Test Full Flow
```bash
# Terminal 1:
npm run dev

# Terminal 2:
python scripts/test_backend.py --full

# Browser:
# Go to http://localhost:3000/analysis
```

### Deploy CORS Fix to AWS
```bash
# Method 1: Manual update
# Follow METHOD2_LAMBDA_CORS_GUIDE.md

# Method 2: Automated
python scripts/deploy_cors_fix.py --function-name your-lambda-name
```

---

## Support

**Files to check if something breaks:**
1. `.env.local` - Environment variables
2. `src/lib/api/backendClient.ts` - API client
3. `src/app/api/analyze/route.ts` - Proxy route
4. Browser console - JavaScript errors

**Need to revert changes?**
- All original files were modified, not replaced
- Git history has original versions
- Can restore from git if needed

---

## Summary

✅ **All Changes Complete**
✅ **CORS Workaround Implemented**
✅ **Backend Integration Working**
✅ **Documentation Complete**

**Last Updated:** 2026-02-02
**Status:** Production Ready
