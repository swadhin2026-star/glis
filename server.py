"""
India Land Information Portal & AI Model Backend Server
========================================================
Lightweight, resilient HTTP and REST API server.

Serves:
1. Static Web Portal (index.html, stitch_india_land_information_portal/)
2. REST API Endpoints:
   - GET  /api/status      -> GPU, PyTorch, and Model checkpoint status
   - GET  /api/samples     -> Available test/sample satellite imagery
   - POST /api/predict     -> Run U-Net LULC segmentation on image / path
   - POST /api/gis         -> GIS Land Surface Temperature prediction

Usage:
  python server.py [--port 8000] [--host 0.0.0.0]
"""

import os
import sys
import json
import base64
import secrets
import argparse
import functools
import traceback
import subprocess
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
DATA_DIR = BASE_DIR / "data"
SAMPLES_DIR = (DATA_DIR / "segmentation" / "test_image").resolve()

# ==============================================================================
# Security configuration
# ==============================================================================

# Only these top-level paths are servable as static files. Everything else
# (server.py, .venv, .git, requirements.txt, notebooks, etc.) is blocked.
ALLOWED_STATIC_PREFIXES = (
    "/stitch_india_land_information_portal/",
    "/data/",
    "/models/",
)

# Browsers running the portal locally use these origins. Add your deployed
# origin here if you host this somewhere other than localhost.
ALLOWED_ORIGINS = {
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "null",  # file:// pages send Origin: null
}

# Optional shared-secret auth. If BACKEND_API_KEY is set in the environment,
# every /api/* request must include header 'X-API-Key: <value>'.
API_KEY = os.environ.get("BACKEND_API_KEY", "")

MAX_BODY_BYTES = 20 * 1024 * 1024  # 20 MB cap on request bodies

# ==============================================================================
# Safe AI Dependencies Import with Fallbacks
# ==============================================================================

AI_ENGINE_AVAILABLE = False
_IMPORT_ERROR_MSG = None

# Default class definitions and color maps
LULC_CLASSES = ["barren", "agriculture", "forest", "urban", "water", "wetland"]
LULC_COLOR_MAP = {
    0: (160, 160, 160),  # Barren: Gray / Tan
    1: (255, 215, 0),    # Agriculture: Yellow / Gold
    2: (34, 139, 34),    # Forest: Forest Green
    3: (220, 20, 60),    # Urban: Crimson Red
    4: (30, 144, 255),   # Water: Deep Sky Blue
    5: (148, 0, 211),    # Wetland: Violet / Purple
}

try:
    import numpy as np
    from PIL import Image
    import torch
    import torch.nn.functional as F
    from models_unet import build_unet_resnet34
    from predict import load_model, preprocess_image, predict_lulc
    from lulc_dataset import LULC_CLASSES, LULC_COLOR_MAP, mask_to_rgb
    AI_ENGINE_AVAILABLE = True
except Exception as _e:
    AI_ENGINE_AVAILABLE = False
    _IMPORT_ERROR_MSG = str(_e)

# Global model cache for fast API response
_MODEL_CACHE = {
    "model": None,
    "device": None,
    "in_channels": 4,
    "num_classes": 6,
    "img_size": 256,
    "mtime": 0
}


def get_loaded_model(force_reload=False):
    """Lazy load or return cached PyTorch U-Net model."""
    if not AI_ENGINE_AVAILABLE:
        return None, "CPU (AI dependencies not loaded in current environment)"

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model_path = MODELS_DIR / "unet_resnet34_lulc_best.pth"

    if not model_path.exists():
        print(f"[!] Warning: Best model not found at {model_path}")
        return None, device

    current_mtime = model_path.stat().st_mtime
    if not force_reload and _MODEL_CACHE["model"] is not None and _MODEL_CACHE["mtime"] == current_mtime:
        return _MODEL_CACHE["model"], _MODEL_CACHE["device"]

    try:
        model, in_c, n_cls, img_sz = load_model(model_path, device)
        _MODEL_CACHE["model"] = model
        _MODEL_CACHE["device"] = device
        _MODEL_CACHE["in_channels"] = in_c
        _MODEL_CACHE["num_classes"] = n_cls
        _MODEL_CACHE["img_size"] = img_sz
        _MODEL_CACHE["mtime"] = current_mtime
        print(f"[OK] Model checkpoint successfully loaded on {device} (Weights: {model_path.name})")
    except Exception as e:
        print(f"[!] Error loading model checkpoint: {e}")
        return None, device

    return _MODEL_CACHE["model"], device


class LandPortalRequestHandler(SimpleHTTPRequestHandler):
    """Custom HTTP Request Handler serving static frontend and AI API."""

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # Root route redirect to national portal
        if path in ["/", "/index.html"]:
            self.send_response(302)
            self.send_header("Location", "/stitch_india_land_information_portal/")
            self.end_headers()
            return

        # API: Status & Hardware
        if path == "/api/status":
            if not self._check_api_key():
                return
            self.handle_api_status()
            return

        # API: Sample satellite images
        if path == "/api/samples":
            if not self._check_api_key():
                return
            self.handle_api_samples()
            return

        # Everything else must be static content under an explicitly
        # allowed directory. This blocks source code, .venv, .git, data
        # files outside the sample set, etc. from being downloaded.
        if not self._is_allowed_static_path(path):
            self.send_error(403, "Forbidden")
            return

        if path.startswith("/models/") and not path.lower().endswith((".png", ".jpg", ".jpeg")):
            # Only serve generated mask/preview images from /models, never
            # the .pth model checkpoints themselves.
            self.send_error(403, "Forbidden")
            return

        return super().do_GET()

    def _is_allowed_static_path(self, path):
        if ".." in path:
            return False
        return any(path.startswith(prefix) for prefix in ALLOWED_STATIC_PREFIXES)

    def _check_api_key(self):
        """If BACKEND_API_KEY is configured, require a matching X-API-Key header."""
        if not API_KEY:
            return True
        supplied = self.headers.get("X-API-Key", "")
        if supplied == API_KEY:
            return True
        self._send_json({"error": "Unauthorized"}, 401)
        return False

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if not self._check_api_key():
            return

        # Reject oversized bodies before reading them into memory.
        try:
            content_length = int(self.headers.get("Content-Length", 0))
        except ValueError:
            content_length = 0
        if content_length > MAX_BODY_BYTES:
            self._send_json({"error": "Request body too large"}, 413)
            return

        if path == "/api/predict":
            self.handle_api_predict()
            return
        elif path == "/api/gis":
            self.handle_api_gis()
            return
        else:
            self.send_error(404, "API Endpoint Not Found")

    def _cors_origin(self):
        origin = self.headers.get("Origin", "")
        return origin if origin in ALLOWED_ORIGINS else None

    def _send_json(self, data, status_code=200):
        body = json.dumps(data).encode("utf-8")
        try:
            self.send_response(status_code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            origin = self._cors_origin()
            if origin:
                self.send_header("Access-Control-Allow-Origin", origin)
                self.send_header("Vary", "Origin")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type, X-API-Key")
            self.end_headers()
            self.wfile.write(body)
        except ConnectionError:
            # Client disconnected before we could send the response. Harmless.
            pass

    def do_OPTIONS(self):
        self.send_response(200)
        origin = self._cors_origin()
        if origin:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-API-Key")
        self.end_headers()

    def handle_api_status(self):
        best_model_exists = (MODELS_DIR / "unet_resnet34_lulc_best.pth").exists()
        gis_model_exists = (MODELS_DIR / "land_gis_model.pth").exists()

        if AI_ENGINE_AVAILABLE:
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            gpu_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() else "None"
            status_data = {
                "status": "online",
                "ai_engine": "active",
                "pytorch_version": torch.__version__,
                "cuda_available": torch.cuda.is_available(),
                "device": str(device),
                "gpu_name": gpu_name,
                "models": {
                    "unet_segmentation_best": best_model_exists,
                    "gis_regression_model": gis_model_exists
                },
                "classes": LULC_CLASSES
            }
        else:
            status_data = {
                "status": "online",
                "ai_engine": "disabled",
                "note": "AI packages (torch/numpy) not in current Python. Start server using .venv/Scripts/python.exe to enable GPU inference.",
                "models": {
                    "unet_segmentation_best": best_model_exists,
                    "gis_regression_model": gis_model_exists
                },
                "classes": LULC_CLASSES
            }

        self._send_json(status_data)

    def handle_api_samples(self):
        test_dir = DATA_DIR / "segmentation" / "test_image"
        samples = []
        if test_dir.exists():
            for p in sorted(list(test_dir.glob("*.jpg")) + list(test_dir.glob("*.png"))):
                rel_path = str(p.relative_to(BASE_DIR)).replace("\\", "/")
                samples.append({
                    "name": p.name,
                    "relative_url": "/" + rel_path,
                    "path": str(p)
                })
        self._send_json({"samples": samples, "total": len(samples)})

    def handle_api_predict(self):
        if not AI_ENGINE_AVAILABLE:
            self._send_json({
                "error": "PyTorch AI dependencies are not loaded. Please start server with .venv/Scripts/python.exe or start_backend.bat."
            }, 503)
            return

        try:
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            payload = json.loads(post_data.decode("utf-8")) if post_data else {}

            image_path_str = payload.get("image_path")
            image_base64 = payload.get("image_base64")

            temp_img_path = None
            if image_base64:
                # Cap decoded upload size to avoid memory-exhaustion DoS.
                b64_data = image_base64.split(",")[-1]
                if len(b64_data) > MAX_BODY_BYTES:
                    self._send_json({"error": "Image payload too large"}, 413)
                    return
                try:
                    img_bytes = base64.b64decode(b64_data, validate=True)
                except Exception:
                    self._send_json({"error": "Invalid base64 image data"}, 400)
                    return
                # Unique filename per request instead of a shared fixed name,
                # to avoid race conditions between concurrent requests.
                temp_img_path = MODELS_DIR / f"temp_input_{secrets.token_hex(8)}.jpg"
                with open(temp_img_path, "wb") as f:
                    f.write(img_bytes)
                target_path = temp_img_path
            elif image_path_str:
                # SECURITY: image_path is user-controlled input. Only allow
                # filenames that resolve inside SAMPLES_DIR - no absolute
                # paths, no ".." traversal, nothing outside the sample set.
                candidate = (SAMPLES_DIR / Path(image_path_str).name).resolve()
                if SAMPLES_DIR not in candidate.parents and candidate != SAMPLES_DIR:
                    self._send_json({"error": "Invalid image path"}, 400)
                    return
                if os.path.commonpath([str(candidate), str(SAMPLES_DIR)]) != str(SAMPLES_DIR):
                    self._send_json({"error": "Invalid image path"}, 400)
                    return
                target_path = candidate
            else:
                target_path = SAMPLES_DIR / "Test_1.jpg"

            if not target_path.exists():
                self._send_json({"error": "Image file not found"}, 400)
                return

            model, device = get_loaded_model()
            if model is None:
                self._send_json({"error": "Segmentation model checkpoint not found. Please train model first."}, 500)
                return

            in_channels = _MODEL_CACHE["in_channels"]
            img_size = _MODEL_CACHE["img_size"]
            tensor, _ = preprocess_image(target_path, in_channels=in_channels, img_size=img_size)
            tensor = tensor.to(device)

            with torch.no_grad():
                logits = model(tensor)
                probs = F.softmax(logits, dim=1)
                conf_scores, preds = torch.max(probs, dim=1)
                conf_scores = conf_scores.squeeze(0).cpu().numpy()
                preds = preds.squeeze(0).cpu().numpy()

            # Confidence Threshold filtering
            conf_threshold = float(payload.get("confidence_threshold", payload.get("conf_threshold", 0.0)))
            if conf_threshold > 1.0:
                conf_threshold /= 100.0

            confident_mask = conf_scores >= conf_threshold
            total_pixels = preds.size
            mean_conf = float(np.mean(conf_scores) * 100.0)
            conf_coverage = float((np.sum(confident_mask) / total_pixels) * 100.0)

            filtered_preds = np.where(confident_mask, preds, -1)

            # Quantitative Land Cover Stats
            class_stats = {}
            for idx, cname in enumerate(LULC_CLASSES):
                count = int(np.sum(filtered_preds == idx))
                pct = float((count / total_pixels) * 100.0)
                class_stats[cname] = {
                    "count": count,
                    "percentage": round(pct, 2),
                    "color_rgb": LULC_COLOR_MAP[idx]
                }

            uncertain_count = int(np.sum(filtered_preds == -1))
            if uncertain_count > 0:
                class_stats["uncertain"] = {
                    "count": uncertain_count,
                    "percentage": round(float((uncertain_count / total_pixels) * 100.0), 2),
                    "color_rgb": (80, 80, 80)
                }

            # Generate Color Mask RGBA PNG
            color_mask = np.zeros((img_size, img_size, 4), dtype=np.uint8)
            for idx, color in LULC_COLOR_MAP.items():
                match = (filtered_preds == idx)
                color_mask[match, 0] = color[0]
                color_mask[match, 1] = color[1]
                color_mask[match, 2] = color[2]
                color_mask[match, 3] = 255

            if uncertain_count > 0:
                unc = (filtered_preds == -1)
                color_mask[unc, 0] = 50
                color_mask[unc, 1] = 50
                color_mask[unc, 2] = 50
                color_mask[unc, 3] = 120

            mask_filename = f"mask_{target_path.stem}.png"
            mask_out_path = MODELS_DIR / mask_filename
            Image.fromarray(color_mask, mode="RGBA").save(mask_out_path)

            response_data = {
                "success": True,
                "image_name": target_path.name,
                "resolution": f"{img_size}x{img_size}",
                "confidence_threshold": round(conf_threshold * 100.0, 1),
                "mean_confidence": round(mean_conf, 2),
                "confidence_coverage": round(conf_coverage, 2),
                "class_breakdown": class_stats,
                "mask_url": f"/models/{mask_filename}",
                "prediction_plot_url": f"/models/prediction_{target_path.stem}.png" if (MODELS_DIR / f"prediction_{target_path.stem}.png").exists() else None
            }
            self._send_json(response_data)

        except Exception:
            # Log full detail server-side only; never expose internals to the client.
            traceback.print_exc()
            self._send_json({"error": "Prediction failed. See server logs for details."}, 500)
        finally:
            if temp_img_path is not None and Path(temp_img_path).exists():
                try:
                    os.remove(temp_img_path)
                except OSError:
                    pass

    def handle_api_gis(self):
        if not AI_ENGINE_AVAILABLE:
            self._send_json({
                "error": "PyTorch AI dependencies not loaded. Please start server with .venv/Scripts/python.exe."
            }, 503)
            return

        try:
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            payload = json.loads(post_data.decode("utf-8")) if post_data else {}

            gis_model_path = MODELS_DIR / "land_gis_model.pth"
            if not gis_model_path.exists():
                self._send_json({"error": "GIS model checkpoint not found"}, 500)
                return

            # NOTE: weights_only=False allows arbitrary pickled objects to be
            # deserialized. Only safe because this file is produced by your
            # own training pipeline (train.py) and lives in a directory this
            # server no longer exposes for public upload/overwrite. Do not
            # point gis_model_path at a file of unknown origin.
            checkpoint = torch.load(gis_model_path, map_location="cpu", weights_only=False)
            features = checkpoint["feature_cols"]

            input_vals = [float(payload.get(f, 0.5)) for f in features]
            scaled = (np.array(input_vals) - checkpoint["scaler_X_mean"]) / checkpoint["scaler_X_scale"]

            from train import GISLandMLP
            model = GISLandMLP(input_dim=len(features))
            model.load_state_dict(checkpoint["model_state_dict"])
            model.eval()

            with torch.no_grad():
                pred = model(torch.tensor(scaled, dtype=torch.float32).unsqueeze(0))
                pred_val = float(pred.item() * checkpoint["scaler_y_scale"][0] + checkpoint["scaler_y_mean"][0])

            self._send_json({
                "success": True,
                "target": checkpoint["target_col"],
                "predicted_value": round(pred_val, 2),
                "features_used": features
            })
        except Exception:
            traceback.print_exc()
            self._send_json({"error": "GIS prediction failed. See server logs for details."}, 500)


def run_server(host="127.0.0.1", port=8000):
    handler = functools.partial(LandPortalRequestHandler, directory=str(BASE_DIR))
    server_address = (host, port)
    httpd = ThreadingHTTPServer(server_address, handler)
    print("="*75)
    print("  INDIA LAND INFORMATION PORTAL & AI MODEL SERVER")
    print("="*75)
    if host not in ("127.0.0.1", "localhost"):
        print(f"[!] WARNING: Server is bound to '{host}', not just localhost.")
        print("[!] This exposes the API to your network (or the internet, if port-forwarded).")
        print("[!] Set BACKEND_API_KEY and review ALLOWED_ORIGINS in server.py before doing this.")
    if not API_KEY:
        print("[!] BACKEND_API_KEY is not set - /api endpoints are unauthenticated.")
        print("[!] Fine for local-only use; set the env var before exposing this server.")
    print(f"[*] Server running on: http://localhost:{port}/")
    print(f"[*] Web Portal:        http://localhost:{port}/stitch_india_land_information_portal/")
    print(f"[*] REST API Health:   http://localhost:{port}/api/status")
    print(f"[*] API Sample Images: http://localhost:{port}/api/samples")
    print(f"[*] AI Inference:      {'ACTIVE (GPU / PyTorch)' if AI_ENGINE_AVAILABLE else 'OFFLINE (No PyTorch)'}")
    print("="*75)
    print("[*] Press Ctrl+C to stop the server.\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[!] Shutting down server gracefully...")
        httpd.server_close()


def auto_switch_venv():
    """Auto-switch to .venv python if started by a python environment without torch."""
    venv_python = BASE_DIR / ".venv" / "Scripts" / "python.exe"
    if venv_python.exists() and sys.executable.lower() != str(venv_python).lower() and "--no-reexec" not in sys.argv:
        if not AI_ENGINE_AVAILABLE:
            print(f"[*] Launching via project virtual environment: {venv_python}")
            cmd = [str(venv_python), str(Path(__file__).resolve())] + sys.argv[1:] + ["--no-reexec"]
            try:
                sys.exit(subprocess.call(cmd))
            except Exception as e:
                print(f"[!] Auto-switch notice: {e}")


if __name__ == "__main__":
    auto_switch_venv()

    parser = argparse.ArgumentParser(description="Start Land Portal & AI Backend Server")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host IP (default: 127.0.0.1, localhost-only). Use 0.0.0.0 only if you understand the exposure and have set BACKEND_API_KEY.")
    parser.add_argument("--port", type=int, default=8000, help="Port number (default: 8000)")
    parser.add_argument("--no-reexec", action="store_true", help=argparse.SUPPRESS)
    args = parser.parse_args()

    get_loaded_model()
    run_server(host=args.host, port=args.port)
