# Method 2: Update Lambda Code - Step-by-Step Guide

## Goal
Add CORS headers to your existing Lambda function responses.

---

## Step 1: Open AWS Lambda Console

1. Go to https://console.aws.amazon.com/lambda/
2. Sign in to your AWS account
3. Find your Lambda function (look for one connected to API Gateway)
4. **Click on the function name** to open it

---

## Step 2: Find Your Lambda Code

You'll see a code editor. Look for your main handler function.

**Common names:**
- `lambda_handler`
- `handler`
- `main`

---

## Step 3: Add CORS Headers (Copy-Paste)

### Add this at the VERY TOP of your file:

```python
# CORS Headers - ADD THIS AT THE TOP
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Max-Age': '86400'
}
```

---

## Step 4: Update Your /analyze Handler

Find the function that handles POST /analyze.

### BEFORE (probably looks like this):
```python
def handle_analyze(event, context):
    # ... your code ...
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'job_id': job_id,
            'upload_url': upload_url,
            'message': 'Job created...'
        })
    }
```

### AFTER (add 'headers' line):
```python
def handle_analyze(event, context):
    # ... your code ...
    
    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,  # <-- ADD THIS LINE
        'body': json.dumps({
            'job_id': job_id,
            'upload_url': upload_url,
            'message': 'Job created...'
        })
    }
```

---

## Step 5: Update Your /results/{job_id} Handler

Find the function that handles GET /results/{job_id}.

### BEFORE:
```python
def handle_results(event, context):
    # ... your code ...
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'job_id': job_id,
            'status': status,
            'message': message
        })
    }
```

### AFTER (add 'headers' line):
```python
def handle_results(event, context):
    # ... your code ...
    
    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,  # <-- ADD THIS LINE
        'body': json.dumps({
            'job_id': job_id,
            'status': status,
            'message': message
        })
    }
```

---

## Step 6: Add OPTIONS Handler (CRITICAL!)

Add this at the beginning of your main handler to handle CORS preflight:

### Find your main entry point:
```python
def lambda_handler(event, context):
    http_method = event['httpMethod']
    path = event['path']
    
    # ... rest of your code ...
```

### Add OPTIONS check at the TOP:
```python
def lambda_handler(event, context):
    http_method = event.get('httpMethod', '')
    path = event.get('path', '')
    
    # ADD THIS BLOCK AT THE TOP:
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({'message': 'OK'})
        }
    
    # ... rest of your routing code ...
```

---

## Step 7: Deploy the Changes

1. **Scroll down** to find the **Deploy** button (orange button)
2. **Click Deploy**
3. Wait for "Changes deployed" message (about 5-10 seconds)

---

## Step 8: Test It

### Option A: Test in Lambda Console
1. Click **Test** tab
2. Create new test event:
   - Event name: `TestAnalyze`
   - Event JSON:
```json
{
  "httpMethod": "POST",
  "path": "/analyze",
  "body": "{\"coordinates\":{\"lat\":-10,\"lon\":-63}}"
}
```
3. Click **Test**
4. Check the response - should include `headers` with CORS

### Option B: Test with curl
```bash
curl -X POST https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev/analyze \
  -H "Content-Type: application/json" \
  -d '{"coordinates":{"lat":-10,"lon":-63}}' \
  -v 2>&1 | grep -i "access-control"
```

**You should see:**
```
< access-control-allow-origin: *
< access-control-allow-headers: Content-Type,...
```

---

## Step 9: Test Your Frontend

1. Restart your frontend:
   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000/analysis

3. Select area and click **Analyze**

4. Check browser console - **NO MORE CORS ERRORS!**

---

## Complete Example Code

If you want to see the full picture, here's a complete example:

```python
import json
import boto3
import uuid

# STEP 1: Add CORS Headers at the top
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Max-Age': '86400'
}

def lambda_handler(event, context):
    """Main entry point"""
    http_method = event.get('httpMethod', '')
    path = event.get('path', '')
    
    # STEP 2: Handle OPTIONS (CORS preflight)
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({'message': 'OK'})
        }
    
    # Route to handlers
    if '/analyze' in path and http_method == 'POST':
        return handle_analyze(event)
    elif '/results/' in path and http_method == 'GET':
        return handle_results(event)
    else:
        return {
            'statusCode': 404,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': 'Not found'})
        }

def handle_analyze(event):
    """POST /analyze"""
    try:
        body = json.loads(event.get('body', '{}'))
        coordinates = body.get('coordinates', {})
        
        job_id = str(uuid.uuid4())
        
        # Your S3 upload URL logic here...
        upload_url = "https://s3-presigned-url..."
        
        # STEP 3: Add headers to response
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,  # <-- ADD THIS
            'body': json.dumps({
                'job_id': job_id,
                'upload_url': upload_url,
                'message': 'Job created'
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,  # <-- ADD THIS
            'body': json.dumps({'error': str(e)})
        }

def handle_results(event):
    """GET /results/{job_id}"""
    try:
        path_params = event.get('pathParameters', {})
        job_id = path_params.get('job_id')
        
        # Your logic to get results...
        
        # STEP 4: Add headers to response
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,  # <-- ADD THIS
            'body': json.dumps({
                'job_id': job_id,
                'status': 'COMPLETED',
                'message': 'Analysis complete'
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,  # <-- ADD THIS
            'body': json.dumps({'error': str(e)})
        }
```

---

## Troubleshooting

### "I don't see my handler functions"
Your code might be structured differently. Look for:
- Functions that return `{'statusCode': ...}`
- Functions that process `event['httpMethod']`
- Routes that check `if path == '/analyze'`

### "I already have headers in some responses"
Great! Just make sure ALL responses include CORS headers:
- Success responses (200)
- Error responses (400, 500)
- OPTIONS response (200)

### "I use a framework (Chalice, Flask, etc.)"
Different frameworks handle CORS differently:

**Chalice:**
```python
from chalice import Chalice, CORSConfig

cors_config = CORSConfig(
    allow_origin='*',
    allow_headers=['Content-Type', 'X-Amz-Date', ...]
)

@app.route('/analyze', methods=['POST'], cors=cors_config)
def analyze():
    ...
```

**Flask (with serverless-wsgi):**
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins='*')
```

---

## Success Checklist

- [ ] Added `CORS_HEADERS` at top of file
- [ ] Added OPTIONS handler for preflight
- [ ] Added `'headers': CORS_HEADERS` to /analyze response
- [ ] Added `'headers': CORS_HEADERS` to /results response
- [ ] Added `'headers': CORS_HEADERS` to error responses
- [ ] Clicked **Deploy** button
- [ ] Tested with curl and saw `access-control-allow-origin: *`
- [ ] Tested frontend and saw no CORS errors

---

## Need Help?

If you're stuck, share:
1. Your current Lambda code (or the first 50 lines)
2. What error you're getting
3. Which step you're stuck on

I'll help you fix it!
