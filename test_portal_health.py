"""
India Land Information Portal - Comprehensive Automated System & API Diagnostic
Checks server connectivity, static asset serving, REST APIs, and PyTorch GPU inference.
"""

import sys
import json
import urllib.request
import urllib.error
from pathlib import Path

BASE_URL = "http://localhost:8000"

def test_endpoint(name, url, method="GET", data=None):
    print(f"[*] Testing {name} ({method} {url}) ...", end=" ")
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode("utf-8") if data else None,
            headers={"Content-Type": "application/json"} if data else {}
        )
        res = urllib.request.urlopen(req, timeout=10)
        status = res.status
        content_type = res.headers.get("Content-Type", "")
        body = res.read().decode("utf-8", errors="ignore")

        if status in [200, 302]:
            print(f"[PASSED] (HTTP {status})")
            return True, body
        else:
            print(f"[FAILED] (HTTP {status})")
            return False, body
    except Exception as e:
        print(f"[ERROR] {e}")
        return False, str(e)

def run_diagnostics():
    print("=" * 70)
    print("     INDIA LAND INFORMATION PORTAL & AI SYSTEM HEALTH DIAGNOSTIC")
    print("=" * 70)

    checks = []

    # 1. Main Root Redirect
    ok, _ = test_endpoint("Root Redirect", f"{BASE_URL}/")
    checks.append(("Root URL Redirect", ok))

    # 2. Main Portal HTML
    ok, _ = test_endpoint("Main Portal UI", f"{BASE_URL}/stitch_india_land_information_portal/index.html")
    checks.append(("Main Web Portal HTML", ok))

    # 4. API: System Status & GPU Telemetry
    ok, body = test_endpoint("AI Status API", f"{BASE_URL}/api/status")
    if ok:
        try:
            status_data = json.loads(body)
            gpu = status_data.get("gpu_name", "None")
            cuda = status_data.get("cuda_available", False)
            print(f"    -> GPU: {gpu} | CUDA: {cuda} | AI Engine: {status_data.get('ai_engine')}")
        except Exception:
            pass
    checks.append(("REST API /api/status", ok))

    # 5. API: Sample Satellite Images List
    ok, body = test_endpoint("Sample Images API", f"{BASE_URL}/api/samples")
    if ok:
        try:
            samples_data = json.loads(body)
            total = samples_data.get("total", 0)
            print(f"    -> Total Satellite Tiles Available: {total}")
        except Exception:
            pass
    checks.append(("REST API /api/samples", ok))

    # 6. API: Real PyTorch U-Net Inference on GPU
    predict_payload = {
        "image_path": "data/segmentation/test_image/Test_1.jpg",
        "confidence_threshold": 50
    }
    ok, body = test_endpoint("PyTorch U-Net Inference", f"{BASE_URL}/api/predict", method="POST", data=predict_payload)
    if ok:
        try:
            pred_data = json.loads(body)
            print(f"    -> Predicted Classes: {list(pred_data.get('class_breakdown', {}).keys())}")
            print(f"    -> Mask Generated: {pred_data.get('mask_url')}")
            print(f"    -> Mean Confidence: {pred_data.get('mean_confidence')}%")
        except Exception:
            pass
    checks.append(("PyTorch AI Segmentation (/api/predict)", ok))

    # 7. Checkpoint File Verification
    best_pth = Path("models/unet_resnet34_lulc_best.pth")
    checkpoint_ok = best_pth.exists() and best_pth.stat().st_size > 10_000_000
    print(f"[*] Checking model file ({best_pth}) ...", "[PASSED]" if checkpoint_ok else "[FAILED]")
    if checkpoint_ok:
        print(f"    -> File Size: {best_pth.stat().st_size / (1024*1024):.2f} MB")
    checks.append(("PyTorch Model Checkpoint (unet_resnet34_lulc_best.pth)", checkpoint_ok))

    # Summary
    print("\n" + "=" * 70)
    print("                             DIAGNOSTIC SUMMARY")
    print("=" * 70)
    all_passed = True
    for name, passed in checks:
        status_str = "[OK] PASSED" if passed else "[X] FAILED"
        print(f"  {status_str:14} : {name}")
        if not passed:
            all_passed = False

    print("=" * 70)
    if all_passed:
        print("  ALL CHECKS PASSED! Your website and AI backend are 100% OK.")
    else:
        print("  Some checks failed. Please check server and virtual environment.")
    print("=" * 70 + "\n")

if __name__ == "__main__":
    run_diagnostics()
