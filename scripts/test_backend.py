"""
Backend API Test Script for Sentinel Eye
This script tests the 3-step backend integration flow.

Usage:
    python test_backend.py

Requirements:
    pip install requests
"""

import requests
import json
import time
import sys
from pathlib import Path

# API Configuration (WITH /dev stage)
API_URL = "https://48ih4pysre.execute-api.us-west-2.amazonaws.com/dev"


def test_backend_with_file(file_path: str = None):
    """
    Test the complete backend flow:
    1. POST /analyze - Get job_id and upload_url
    2. PUT to upload_url - Upload file to S3
    3. GET /results/{job_id} - Poll for results

    Args:
        file_path: Optional path to a .tif file. If not provided, uses dummy data.
    """
    print("=" * 60)
    print("SENTINEL EYE - BACKEND API TEST")
    print("=" * 60)

    # --- STEP 1: INITIALIZE JOB ---
    print("\n[1] Initializing analysis job...")
    print(f"    URL: {API_URL}/analyze")

    try:
        response = requests.post(
            f"{API_URL}/analyze",
            json={"coordinates": {"lat": -10, "lon": -63}},
            headers={"Content-Type": "application/json"},
            timeout=10,
        )

        print(f"    Status: {response.status_code}")

        if response.status_code != 200:
            print(f"    [FAIL] {response.text}")
            return False

        data = response.json()
        job_id = data.get("job_id")
        upload_url = data.get("upload_url")

        if not job_id:
            print(f"    [FAIL] No job_id in response: {data}")
            return False

        print(f"    [OK] Job ID: {job_id}")
        print(f"    [OK] Upload URL received (length: {len(upload_url)} chars)")

    except requests.exceptions.RequestException as e:
        print(f"    [FAIL] Connection error: {e}")
        return False

    # --- STEP 2: UPLOAD FILE ---
    print("\n[2] Uploading file to S3...")

    try:
        if file_path and Path(file_path).exists():
            # Upload real file
            print(f"    File: {file_path}")
            with open(file_path, "rb") as f:
                file_data = f.read()
                file_size = len(file_data)
            print(f"    Size: {file_size / 1024 / 1024:.2f} MB")

            upload_response = requests.put(
                upload_url,
                data=file_data,
                headers={"Content-Type": "image/tiff"},
                timeout=30,
            )
        else:
            # Upload dummy test file
            if file_path:
                print(f"    [WARN] File not found: {file_path}")
                print(f"    Using dummy test data instead")
            else:
                print(f"    Using dummy test data")

            dummy_data = b"This is a test file to wake up the Lambda"
            print(f"    Size: {len(dummy_data)} bytes (dummy data)")

            upload_response = requests.put(
                upload_url,
                data=dummy_data,
                headers={"Content-Type": "image/tiff"},
                timeout=30,
            )

        print(f"    Status: {upload_response.status_code}")

        if upload_response.status_code == 200:
            print("    [OK] Upload successful!")
        else:
            print(f"    [FAIL] Upload failed: {upload_response.text[:200]}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"    [FAIL] Upload error: {e}")
        return False

    # --- STEP 3: POLL FOR RESULTS ---
    print("\n[3] Polling for results...")
    print("    Waiting 5 seconds for processing to start...")
    time.sleep(5)

    max_attempts = 20
    poll_interval = 3

    for attempt in range(1, max_attempts + 1):
        try:
            print(f"    Poll attempt {attempt}/{max_attempts}...", end=" ")

            result_response = requests.get(f"{API_URL}/results/{job_id}", timeout=10)

            if result_response.status_code != 200:
                print(f"[ERROR] {result_response.status_code}")
                time.sleep(poll_interval)
                continue

            result = result_response.json()
            status = result.get("status", "UNKNOWN")

            if status == "COMPLETED":
                print("[COMPLETED]")
                print("\n" + "=" * 60)
                print("ANALYSIS RESULTS:")
                print("=" * 60)
                print(json.dumps(result, indent=2))
                print("=" * 60)
                return True

            elif status == "FAILED":
                print("[FAILED]")
                print(f"\nError: {result.get('error', 'Unknown error')}")
                return False

            elif status == "PROCESSING":
                print("[PROCESSING]")
                time.sleep(poll_interval)

            elif status == "PENDING":
                print("[PENDING]")
                time.sleep(poll_interval)

            else:
                print(f"[?] {status}")
                time.sleep(poll_interval)

        except requests.exceptions.RequestException as e:
            print(f"[ERROR] {e}")
            time.sleep(poll_interval)

    print(f"\n    [WARN] Polling timed out after {max_attempts} attempts")
    return False


def quick_test():
    """Quick connectivity test (Step 1 only)"""
    print("=" * 60)
    print("QUICK CONNECTIVITY TEST")
    print("=" * 60)
    print(f"\nTesting: {API_URL}/analyze")

    try:
        response = requests.post(
            f"{API_URL}/analyze",
            json={"coordinates": {"lat": -10, "lon": -63}},
            timeout=10,
        )

        print(f"\nStatus Code: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"\n[OK] Backend is ONLINE!")
            print(f"    Job ID: {data.get('job_id', 'N/A')[:20]}...")
            print(f"    Message: {data.get('message', 'N/A')}")
            return True
        else:
            print(f"\n[FAIL] Backend returned error: {response.text[:200]}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"\n[FAIL] Connection failed: {e}")
        return False


def main():
    """Main entry point"""
    import argparse

    parser = argparse.ArgumentParser(
        description="Test Sentinel Eye Backend API",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python test_backend.py              # Quick connectivity test only
  python test_backend.py --full       # Full 3-step test with dummy data
  python test_backend.py --file image.tif  # Full test with real file
        """,
    )

    parser.add_argument(
        "--full",
        action="store_true",
        help="Run full 3-step test (not just connectivity)",
    )
    parser.add_argument(
        "--file", type=str, help="Path to .tif file to upload (implies --full)"
    )
    parser.add_argument(
        "--quick", action="store_true", help="Quick connectivity test only (default)"
    )

    args = parser.parse_args()

    print()

    if args.quick or (not args.full and not args.file):
        # Quick test only
        success = quick_test()
    else:
        # Full test
        success = test_backend_with_file(args.file)

    print()
    if success:
        print("[PASS] TEST PASSED")
        sys.exit(0)
    else:
        print("[FAIL] TEST FAILED")
        sys.exit(1)


if __name__ == "__main__":
    main()
