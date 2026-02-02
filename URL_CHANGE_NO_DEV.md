# URL Structure Change - /dev Removal

## Summary

Changed all API URLs from `/dev/*` format to root `/*` format.

**BEFORE:**
```
https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev/analyze
https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev/results/{id}
```

**AFTER:**
```
https://48ih4pysre.execute-api.us-west-2.amazonaws.com/analyze
https://48ih4pysre.execute-api.us-west-2.amazonaws.com/results/{id}
```

---

## Files Changed

### 1. Environment Variables

**File:** `.env.local`

```env
# BEFORE:
NEXT_PUBLIC_API_URL=https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev

# AFTER:
NEXT_PUBLIC_API_URL=https://48ih4pysre.execute-api.us-west-2.amazonaws.com
```

---

### 2. Proxy Routes

**Files:**
- `src/app/api/analyze/route.ts`
- `src/app/api/results/[job_id]/route.ts`

**Changed:**
```typescript
// BEFORE:
const AWS_API_URL = process.env.NEXT_PUBLIC_API_URL || 
    "https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev";

// AFTER:
const AWS_API_URL = process.env.NEXT_PUBLIC_API_URL || 
    "https://48ih4pysre.execute-api.us-west-2.amazonaws.com";
```

**Result:**
```
Proxy calls:
- /api/analyze → https://...amazonaws.com/analyze (no /dev)
- /api/results/{id} → https://...amazonaws.com/results/{id} (no /dev)
```

---

### 3. Python Test Scripts

**Files:**
- `scripts/test_backend.py`
- `scripts/poke_backend.py`

```python
# BEFORE:
API_URL = "https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev"

# AFTER:
API_URL = "https://48ih4pysre.execute-api.us-west-2.amazonaws.com"
```

---

## Build Status

✅ **Build Successful**
```
✓ Compiled successfully in 13.3s
✓ All routes working
✓ No errors
```

---

## Testing

### Test the new URLs:

```bash
# Test /analyze endpoint
curl -X POST https://48ih4pysre.execute-api.us-west-2.amazonaws.com/analyze \
  -H "Content-Type: application/json" \
  -d '{"coordinates":{"lat":-10,"lon":-63}}'

# Test /results endpoint  
curl https://48ih4pysre.execute-api.us-west-2.amazonaws.com/results/YOUR_JOB_ID
```

### Test via Python script:
```bash
python scripts/test_backend.py --quick
```

---

## Frontend Usage

The frontend automatically uses the new URLs through the proxy:

```typescript
// Frontend calls proxy (same-origin, no CORS)
fetch("/api/analyze", {...})

// Proxy forwards to AWS (without /dev)
// → https://48ih4pysre.execute-api.us-west-2.amazonaws.com/analyze
```

---

## Important Note

⚠️ **Backend Configuration Required**

Your AWS API Gateway must be configured to handle requests at root paths:
- `/analyze` (NOT `/dev/analyze`)
- `/results/{id}` (NOT `/dev/results/{id}`)

**If backend still has stage-based URLs:**
1. Either remove the stage from API Gateway
2. Or use a custom domain
3. Or update the backend to handle root paths

**To revert to /dev if needed:**
Just change `.env.local` back:
```env
NEXT_PUBLIC_API_URL=https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev
```

---

## Verification Checklist

- [x] .env.local updated
- [x] Proxy routes updated
- [x] Python scripts updated
- [x] Build successful
- [x] No TypeScript errors
- [x] Routes working

---

**Last Updated:** 2026-02-02
**Status:** Ready for Testing
