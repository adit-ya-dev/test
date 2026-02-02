"""
Simple Backend Test Script - Minimal Version
Matches the exact flow you provided, but organized as a reusable script.
"""

import requests
import json
import time

# 1. SETUP: Your API URL (WITH /dev stage)
API_URL = "https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev"


def poke_it():
    print(">> POKING THE BACKEND...")

    # --- STEP A: ASK FOR PERMISSION (POST /analyze) ---
    print("\n1. Asking for an upload slot...")
    try:
        response = requests.post(
            f"{API_URL}/analyze", json={"coordinates": {"lat": -10, "lon": -63}}
        )
        data = response.json()

        job_id = data.get("job_id")
        upload_url = data.get("upload_url")

        if not job_id:
            print("X Failed to get Job ID. Backend asleep?")
            print(data)
            return

        print(f"   [OK] Got Job ID: {job_id}")
        print(f"   [OK] Got Upload Ticket (Pre-signed URL)")

    except Exception as e:
        print(f"X Connection Error: {e}")
        return

    # --- STEP B: UPLOAD A DUMMY FILE (PUT to S3) ---
    # We create a tiny fake "image" (just a text file masquerading as a TIF)
    # The backend might fail the analysis (because it's not a real TIF),
    # BUT it proves the S3 trigger works!
    print("\n2. Uploading a test file...")
    dummy_data = b"This is a test file to wake up the Lambda"

    upload_resp = requests.put(
        upload_url, data=dummy_data, headers={"Content-Type": "image/tiff"}
    )

    if upload_resp.status_code == 200:
        print("   [OK] Upload Successful! (S3 received it)")
    else:
        print(f"   X Upload Failed: {upload_resp.status_code}")
        return

    # --- STEP C: CHECK STATUS (GET /results) ---
    print("\n3. Waiting 5 seconds for the Brain to wake up...")
    time.sleep(5)

    print("4. Checking status...")
    status_resp = requests.get(f"{API_URL}/results/{job_id}")
    result = status_resp.json()

    print("\n--- BACKEND RESPONSE ---")
    print(json.dumps(result, indent=2))
    print("------------------------")


if __name__ == "__main__":
    poke_it()
