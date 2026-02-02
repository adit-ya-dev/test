# Backend Integration Guide

## Overview

The frontend has been fully integrated with the AWS backend API. The integration follows a 3-step process:

1. **Initialize Job** (POST /analyze) - Send coordinates to get a Job ID and S3 upload URL
2. **Upload File** (PUT to upload_url) - Upload the satellite imagery (.tif file) directly to S3
3. **Poll Results** (GET /results/{job_id}) - Check job status until completion

## Environment Configuration

Your `.env.local` already has the correct configuration:

```env
NEXT_PUBLIC_AWS_API_BASE=https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev
NEXT_PUBLIC_ANALYSIS_API=https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev/analyze
NEXT_PUBLIC_USE_MOCK_DATA=false
```

## Key Files Modified

### 1. API Client (`src/lib/api/awsClient.ts`)
Completely rewritten to handle the 3-step backend workflow:
- `initializeAnalysis()` - Step 1: POST to /analyze
- `uploadFileToS3()` - Step 2: PUT to pre-signed S3 URL
- `getJobResults()` - Step 3: GET /results/{job_id}
- `pollForResults()` - Automated polling with progress callbacks

### 2. Analyze Service (`src/lib/api/analyzeService.ts`)
Updated to support both modes:
- **Backend Mode**: When a .tif file is uploaded, uses the 3-step AWS process
- **Mock Mode**: When no file is provided, returns mock data for testing

### 3. Analysis Hook (`src/hooks/useAnalyzeRegion.ts`)
Enhanced with:
- File upload support
- Progress tracking (initializing → uploading → processing → completed)
- Detailed progress messages for UI feedback

### 4. File Uploader Component (`src/app/analysis/components/FileUploader.tsx`)
New component for uploading .tif files:
- Validates file type (.tif, .tiff)
- Validates file size (up to 100MB)
- Shows file details and clear option

### 5. Analysis Page (`src/app/analysis/page.tsx`)
Updated with:
- File upload section
- Passes selected file to analysis function
- Real-time progress display

### 6. Scan Progress Log (`src/app/analysis/components/ScanProgressLog.tsx`)
Enhanced to show:
- Real-time progress messages
- Current processing stage
- File upload step

## How to Use

### Option 1: With Backend API (File Upload)

1. Go to the Analysis page (`/analysis`)
2. Select an Area of Interest (AOI) on the map
3. Choose date range
4. **Upload a .tif satellite imagery file** (new section added)
5. Click "Analyze Region"
6. The system will:
   - Initialize the job with coordinates
   - Upload your file to S3
   - Poll for results (3-second intervals)
   - Display the analysis results

### Option 2: Without File (Mock Data)

1. Go to the Analysis page
2. Select AOI on the map
3. Choose date range
4. **Don't upload a file**
5. Click "Analyze Region"
6. The system returns mock data immediately

## API Testing (Postman/Insomnia)

Test the backend without frontend code:

```bash
# Step 1: Initialize Job
POST https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev/analyze
Content-Type: application/json

Body:
{
  "coordinates": {
    "lat": -10,
    "lon": -63
  }
}

# Response:
{
  "job_id": "uuid-here",
  "upload_url": "https://s3-presigned-url...",
  "status": "PENDING"
}

# Step 2: Upload File
PUT {upload_url from step 1}
Content-Type: image/tiff

Body: <binary .tif file>

# Step 3: Poll Results
GET https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev/results/{job_id}

# Response when complete:
{
  "job_id": "uuid-here",
  "status": "COMPLETED",
  "results": {
    "prediction": 0.85,
    "confidence": 0.92,
    "analysis": "Analysis description..."
  }
}
```

## CORS Handling

The backend already includes CORS headers:
```
Access-Control-Allow-Origin: '*'
Access-Control-Allow-Headers: 'Content-Type'
```

This allows the frontend running on `http://localhost:3000` to communicate with the AWS API.

## Error Handling

The integration includes comprehensive error handling:
- Network errors
- Invalid file types
- File size limits
- Backend API errors
- Timeout handling (60 polling attempts max)

## Next Steps

1. **Test the integration**:
   ```bash
   npm run dev
   ```
   Then visit `http://localhost:3000/analysis`

2. **Verify backend connectivity**:
   The system automatically tests the connection on first use

3. **Upload a test file**:
   - Select an AOI on the map
   - Upload a small .tif file (under 100MB)
   - Monitor the progress indicators

4. **Check browser console** for detailed logs of the 3-step process

## Troubleshooting

### "Failed to initialize analysis"
- Check that `NEXT_PUBLIC_AWS_API_BASE` is set correctly
- Verify backend is running (test with Postman)
- Check browser console for detailed error messages

### "File upload failed"
- Verify file is .tif or .tiff format
- Check file size is under 100MB
- Check browser console for S3 upload errors

### "Polling timed out"
- Backend processing may be slow
- Check backend logs for job status
- Try with a smaller file

## Build Verification

The project builds successfully:
```bash
npm run build
```

All TypeScript types are correctly configured and the integration is production-ready.
