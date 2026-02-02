"""
AWS Lambda Handler with CORS Support
=====================================

This is the ROOT FIX for the CORS error.
Add these CORS headers to your Lambda function responses.

File: lambda_function.py (or your main Lambda handler file)
"""

import json
import boto3
from datetime import datetime

# CORS Headers - ADD THESE TO ALL RESPONSES
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",  # Allow all origins (or specify your domain)
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Max-Age": "86400",  # Cache preflight for 24 hours
}


def lambda_handler(event, context):
    """
    Main Lambda handler with CORS support
    """
    print(f"Event: {json.dumps(event)}")

    http_method = event.get("httpMethod", "")
    path = event.get("path", "")

    # Handle CORS Preflight (OPTIONS request)
    if http_method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "CORS preflight successful"}),
        }

    # Route to appropriate handler
    if path == "/analyze" and http_method == "POST":
        return handle_analyze(event, context)
    elif path.startswith("/results/") and http_method == "GET":
        return handle_results(event, context)
    else:
        return {
            "statusCode": 404,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Not found"}),
        }


def handle_analyze(event, context):
    """
    Handle POST /analyze
    Creates a job and returns upload URL
    """
    try:
        # Parse request body
        body = json.loads(event.get("body", "{}"))
        coordinates = body.get("coordinates", {})

        # Generate job ID
        import uuid

        job_id = str(uuid.uuid4())

        # Generate S3 pre-signed URL (your existing logic)
        s3 = boto3.client("s3")
        bucket_name = "landuse-rondonia-data-dev"
        s3_key = f"raw-data/sentinel2/{job_id}_input.tif"

        upload_url = s3.generate_presigned_url(
            "put_object",
            Params={"Bucket": bucket_name, "Key": s3_key, "ContentType": "image/tiff"},
            ExpiresIn=3600,
        )

        # Store job in DynamoDB (your existing logic)
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("your-jobs-table")

        table.put_item(
            Item={
                "job_id": job_id,
                "status": "PENDING",
                "coordinates": coordinates,
                "s3_key": s3_key,
                "created_at": int(datetime.now().timestamp()),
                "updated_at": int(datetime.now().timestamp()),
            }
        )

        # Return response WITH CORS HEADERS
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(
                {
                    "job_id": job_id,
                    "upload_url": upload_url,
                    "message": "Job created. Use upload_url to PUT your TIF file.",
                }
            ),
        }

    except Exception as e:
        print(f"Error in handle_analyze: {str(e)}")
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)}),
        }


def handle_results(event, context):
    """
    Handle GET /results/{job_id}
    Returns job status and results
    """
    try:
        # Extract job_id from path
        path_params = event.get("pathParameters", {})
        job_id = path_params.get("job_id")

        if not job_id:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "job_id is required"}),
            }

        # Get job from DynamoDB (your existing logic)
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table("your-jobs-table")

        response = table.get_item(Key={"job_id": job_id})
        job = response.get("Item")

        if not job:
            return {
                "statusCode": 404,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "Job not found"}),
            }

        # Return job status WITH CORS HEADERS
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(
                {
                    "job_id": job_id,
                    "status": job.get("status"),
                    "message": job.get("message", ""),
                    "severity": job.get("severity", ""),
                    "urban_pct": job.get("urban_pct", "0"),
                    "coordinates": job.get("coordinates", {}),
                    "created_at": job.get("created_at"),
                    "updated_at": job.get("updated_at"),
                }
            ),
        }

    except Exception as e:
        print(f"Error in handle_results: {str(e)}")
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)}),
        }


# ============================================================================
# MINIMAL CORS FIX (If you want to add CORS to your existing code)
# ============================================================================

"""
QUICK FIX for existing Lambda:

Just add these headers to every response in your current Lambda:

headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS'
}

Then return:
return {
    'statusCode': 200,
    'headers': headers,
    'body': json.dumps(your_data)
}

Also add an OPTIONS handler:
if event['httpMethod'] == 'OPTIONS':
    return {
        'statusCode': 200,
        'headers': headers,
        'body': ''
    }
"""
