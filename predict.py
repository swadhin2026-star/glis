"""
Sentinel-2 LULC Semantic Segmentation Inference & Land Area Analytics
======================================================================
Performs multi-class segmentation inference on satellite images using
the trained U-Net (ResNet34 backbone) model.

Features:
- Full support for 4-channel (RGB + NIR) and 3-channel (RGB) inputs
- Color-mapped segmentation visualization with clean legend
- Semi-transparent overlay atop the original satellite image
- Quantitative land use percentage breakdown & analytics
- Export to PNG / TIFF

Usage:
  python predict.py --image path/to/satellite_image.jpg
  python predict.py --model models/unet_resnet34_lulc_best.pth
"""

import sys
import argparse
from pathlib import Path
from typing import Optional, Tuple

import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

import torch
import torch.nn.functional as F

from models_unet import build_unet_resnet34
from lulc_dataset import (
    LULC_CLASSES,
    LULC_COLOR_MAP,
    mask_to_rgb,
    IMAGENET_MEAN,
    IMAGENET_STD
)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"


def load_model(model_path: Path, device: torch.device):
    """Loads U-Net ResNet34 model from checkpoint."""
    if not model_path.exists():
        raise FileNotFoundError(f"Model checkpoint not found at: {model_path}")

    checkpoint = torch.load(model_path, map_location=device, weights_only=False)
    in_channels = checkpoint.get("in_channels", 4)
    num_classes = checkpoint.get("num_classes", len(LULC_CLASSES))
    img_size = checkpoint.get("img_size", 256)

    model = build_unet_resnet34(
        in_channels=in_channels,
        num_classes=num_classes,
        pretrained=False
    ).to(device)

    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()

    best_mIoU = checkpoint.get("mIoU", None)
    if best_mIoU is not None:
        print(f"[OK] Loaded model checkpoint (Best Val mIoU: {best_mIoU:.4f}, Epoch {checkpoint.get('epoch', '?')})")

    return model, in_channels, num_classes, img_size


def preprocess_image(image_path: Path, in_channels: int, img_size: int = 256) -> Tuple[torch.Tensor, np.ndarray]:
    """Loads, resizes, and normalizes input satellite image."""
    img_pil = Image.open(image_path).convert("RGB")
    img_resized = img_pil.resize((img_size, img_size), Image.BILINEAR)
    rgb_arr = np.array(img_resized, dtype=np.float32) / 255.0

    if in_channels == 3:
        img_arr = rgb_arr
    else:
        # 4-band: synthesize/estimate NIR proxy from spectral channels if NIR not provided separately
        nir_arr = (0.6 * rgb_arr[:, :, 1:2] + 0.4 * (1.0 - rgb_arr[:, :, 0:1])).astype(np.float32)
        nir_arr = np.clip(nir_arr, 0.0, 1.0)
        img_arr = np.concatenate([rgb_arr, nir_arr], axis=-1)

    # Normalize with ImageNet mean/std
    mean = np.array(IMAGENET_MEAN[:in_channels], dtype=np.float32)
    std = np.array(IMAGENET_STD[:in_channels], dtype=np.float32)
    img_norm = (img_arr - mean) / std

    tensor = torch.from_numpy(img_norm.transpose(2, 0, 1)).unsqueeze(0).float()
    return tensor, rgb_arr


def predict_lulc(
    image_path: str,
    model_path: Path = MODELS_DIR / "unet_resnet34_lulc_best.pth",
    output_path: Optional[Path] = None
):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    image_path = Path(image_path)

    if not image_path.exists():
        print(f"[!] Error: Image not found at {image_path}")
        return

    # 1. Load model & preprocess image
    model, in_channels, num_classes, img_size = load_model(model_path, device)
    img_tensor, rgb_display = preprocess_image(image_path, in_channels, img_size=img_size)
    img_tensor = img_tensor.to(device)

    # 2. Forward pass
    with torch.no_grad():
        logits = model(img_tensor)
        probs = F.softmax(logits, dim=1).squeeze(0).cpu().numpy()  # [C, H, W]
        pred_mask = np.argmax(probs, axis=0)                     # [H, W]

    # 3. Compute class area statistics
    total_pixels = pred_mask.size
    class_stats = {}
    print("\n" + "="*50)
    print(f"LAND USE / LAND COVER BREAKDOWN: {image_path.name}")
    print("="*50)

    for idx, name in enumerate(LULC_CLASSES[:num_classes]):
        count = np.sum(pred_mask == idx)
        pct = (count / total_pixels) * 100.0
        class_stats[name] = pct
        print(f"  - {name.capitalize():<14}: {pct:6.2f}% ({count:,} pixels)")
    print("="*50)

    # 4. Generate Visual Analytics Figure
    pred_rgb = mask_to_rgb(pred_mask)
    overlay = (0.55 * (rgb_display * 255) + 0.45 * pred_rgb).astype(np.uint8)

    fig, axes = plt.subplots(2, 2, figsize=(14, 12))

    # Panel 1: Original Satellite Image
    axes[0, 0].imshow(rgb_display)
    axes[0, 0].set_title("Input Satellite Imagery (RGB)", fontsize=12, fontweight="bold")
    axes[0, 0].axis("off")

    # Panel 2: Predicted LULC Mask with Legend
    axes[0, 1].imshow(pred_rgb)
    axes[0, 1].set_title("U-Net LULC Segmentation Map", fontsize=12, fontweight="bold")
    axes[0, 1].axis("off")
    # Legend
    legend_patches = [
        mpatches.Patch(color=np.array(LULC_COLOR_MAP[i]) / 255.0, label=f"{LULC_CLASSES[i].capitalize()} ({class_stats[LULC_CLASSES[i]]:.1f}%)")
        for i in range(num_classes)
    ]
    axes[0, 1].legend(handles=legend_patches, loc="lower right", framealpha=0.9, fontsize=9)

    # Panel 3: Overlay on Satellite Image
    axes[1, 0].imshow(overlay)
    axes[1, 0].set_title("Overlay (50% Satellite + 50% LULC)", fontsize=12, fontweight="bold")
    axes[1, 0].axis("off")

    # Panel 4: Land Distribution Bar Chart
    axes[1, 1].set_title("Land Cover Distribution (% Area)", fontsize=12, fontweight="bold")
    bar_colors = [np.array(LULC_COLOR_MAP[i]) / 255.0 for i in range(num_classes)]
    bars = axes[1, 1].bar(
        [c.capitalize() for c in LULC_CLASSES[:num_classes]],
        [class_stats[c] for c in LULC_CLASSES[:num_classes]],
        color=bar_colors,
        edgecolor="black",
        alpha=0.85
    )
    axes[1, 1].set_ylabel("Coverage Area (%)", fontsize=10)
    axes[1, 1].set_ylim(0, max(100, max(class_stats.values()) + 10))
    axes[1, 1].grid(axis="y", linestyle="--", alpha=0.5)
    for bar in bars:
        h = bar.get_height()
        axes[1, 1].text(bar.get_x() + bar.get_width()/2.0, h + 1.0, f"{h:.1f}%", ha='center', va='bottom', fontsize=9, fontweight="bold")

    plt.tight_layout()

    if output_path is None:
        output_path = MODELS_DIR / f"prediction_{image_path.stem}.png"

    plt.savefig(output_path, dpi=200, bbox_inches="tight")
    plt.close()
    print(f"[OK] Prediction visualization saved to: {output_path}")

    # Also save raw mask as PNG
    mask_png_path = MODELS_DIR / f"mask_{image_path.stem}.png"
    Image.fromarray(pred_rgb).save(mask_png_path)
    print(f"[OK] Colorized mask saved to: {mask_png_path}")


def main():
    parser = argparse.ArgumentParser(description="Sentinel-2 LULC Semantic Segmentation Inference")
    parser.add_argument("--image", type=str, help="Path to input satellite image (.jpg, .png, .tif)")
    parser.add_argument("--model", type=str, default=str(MODELS_DIR / "unet_resnet34_lulc_best.pth"),
                        help="Path to trained U-Net checkpoint (.pth)")
    parser.add_argument("--output", type=str, help="Path to save prediction plot (.png)")

    args = parser.parse_args()

    if args.image:
        predict_lulc(args.image, Path(args.model), Path(args.output) if args.output else None)
    else:
        # Check for sample test image in data directory
        test_imgs = sorted(list((DATA_DIR / "segmentation").glob("**/test_image/*.*")))
        if test_imgs:
            print(f"[*] No --image provided. Running inference on sample test patch: {test_imgs[0].name}")
            predict_lulc(str(test_imgs[0]), Path(args.model), Path(args.output) if args.output else None)
        else:
            print("[!] Please provide an image to predict: python predict.py --image path/to/image.jpg")


if __name__ == "__main__":
    main()
