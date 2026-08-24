"""
Sentinel-2 LULC Semantic Segmentation & GIS Modeling Training Pipeline
========================================================================
Main training pipeline implementing:
1. U-Net with ResNet34 backbone (pretrained ImageNet via segmentation_models_pytorch)
2. 4-channel Sentinel-2 input (RGB + NIR) / 3-channel RGB
3. Combined Weighted Cross-Entropy + Multiclass Dice Loss
4. Two-Phase Training Schedule:
   - Phase 1: Frozen encoder (warm-up decoder, 10-15 epochs)
   - Phase 2: Full fine-tuning with differential LR (20-25 epochs)
5. Early stopping based on validation mean IoU (mIoU) with checkpoint saving
6. Comprehensive evaluation metrics & visualization curves
7. GIS Environmental Tabular Regression support
"""

import os
import sys
import glob
import time
import zipfile
import argparse
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd
from PIL import Image
import matplotlib.pyplot as plt
from tqdm import tqdm

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Project modules
from models_unet import build_unet_resnet34, freeze_encoder, unfreeze_encoder, get_optimizer_and_groups
from losses_and_metrics import CombinedDiceCELoss, LULCMetrics
from lulc_dataset import (
    SentinelLULCDataset,
    LULC_CLASSES,
    LULC_COLOR_MAP,
    mask_to_rgb,
    compute_class_weights
)

# Directories
BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / "dataset"
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)


# ==============================================================================
# 1. Dataset Extraction Helpers
# ==============================================================================

def extract_zip_if_needed(zip_path: Path, extract_to: Path, marker_file: str = None) -> bool:
    """Extracts a zip file if destination directory does not have the marker."""
    if not zip_path.exists():
        print(f"[!] Warning: Zip file not found at {zip_path}")
        return False

    if marker_file and (extract_to / marker_file).exists():
        print(f"[OK] Data already extracted at {extract_to}")
        return True

    print(f"[*] Extracting {zip_path.name} to {extract_to} ...")
    extract_to.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
    print(f"[OK] Successfully extracted {zip_path.name}")
    return True


# ==============================================================================
# 2. LULC Segmentation Training & Validation Logic
# ==============================================================================

def run_validation_epoch(model, val_loader, criterion, metric_tracker, device):
    """Evaluates model over validation dataset."""
    model.eval()
    val_loss = 0.0
    val_ce_loss = 0.0
    val_dice_loss = 0.0
    metric_tracker.reset()

    with torch.no_grad():
        for imgs, masks, _ in val_loader:
            imgs = imgs.to(device)
            masks = masks.to(device)

            logits = model(imgs)
            loss, loss_dict = criterion(logits, masks)

            val_loss += loss.item() * imgs.size(0)
            val_ce_loss += loss_dict["ce_loss"] * imgs.size(0)
            val_dice_loss += loss_dict["dice_loss"] * imgs.size(0)

            metric_tracker.update(logits, masks)

    total_samples = len(val_loader.dataset)
    metrics_summary = metric_tracker.compute()
    metrics_summary["val_loss"] = val_loss / total_samples
    metrics_summary["val_ce_loss"] = val_ce_loss / total_samples
    metrics_summary["val_dice_loss"] = val_dice_loss / total_samples

    return metrics_summary


def train_lulc_unet(args, device):
    print("\n" + "="*75)
    print(">>> U-NET (RESNET34) LULC SEMANTIC SEGMENTATION TRAINING")
    print("="*75)
    print(f"[*] Backbone: ResNet34 (Pretrained ImageNet)")
    print(f"[*] Input Channels: {args.in_channels} ({'RGB+NIR' if args.in_channels==4 else 'RGB'})")
    print(f"[*] Target Classes: {len(LULC_CLASSES)} classes -> {LULC_CLASSES}")
    print(f"[*] Batch Size: {args.batch_size} | Image Resolution: {args.img_size}x{args.img_size}")
    print(f"[*] Hardware Device: {device} ({torch.cuda.get_device_name(0) if device.type == 'cuda' else 'CPU'})")

    # 1. Dataset Discovery & Extraction
    seg_dir = DATA_DIR / "segmentation"
    zip_path = DATASET_DIR / "archive (3).zip"
    extract_zip_if_needed(zip_path, seg_dir, marker_file="train_image")

    # Locate image and mask pairs
    train_imgs = sorted(list(seg_dir.glob("**/train_image/*.*")))
    train_masks = sorted(list(seg_dir.glob("**/pixel_based_mask/train_mask/*.*")))
    if not train_masks:
        train_masks = sorted(list(seg_dir.glob("**/train_mask/*.*")))

    test_imgs = sorted(list(seg_dir.glob("**/test_image/*.*")))
    test_masks = sorted(list(seg_dir.glob("**/pixel_based_mask/test_mask/*.*")))
    if not test_masks:
        test_masks = sorted(list(seg_dir.glob("**/test_mask/*.*")))

    if not train_imgs or not train_masks:
        print(f"[!] Error: Could not find training images/masks in {seg_dir}")
        return

    # Match filenames
    train_mask_dict = {Path(p).stem: p for p in train_masks}
    valid_train_imgs = [p for p in train_imgs if Path(p).stem in train_mask_dict]
    valid_train_masks = [train_mask_dict[Path(p).stem] for p in valid_train_imgs]

    test_mask_dict = {Path(p).stem: p for p in test_masks}
    valid_test_imgs = [p for p in test_imgs if Path(p).stem in test_mask_dict]
    valid_test_masks = [test_mask_dict[Path(p).stem] for p in valid_test_imgs]

    if valid_test_imgs:
        train_img_list, val_img_list = valid_train_imgs, valid_test_imgs
        train_mask_list, val_mask_list = valid_train_masks, valid_test_masks
    else:
        train_img_list, val_img_list, train_mask_list, val_mask_list = train_test_split(
            valid_train_imgs, valid_train_masks, test_size=0.2, random_state=42
        )

    print(f"[OK] Found {len(train_img_list)} training patches, {len(val_img_list)} validation patches.")

    # 2. Build Datasets & Loaders
    train_dataset = SentinelLULCDataset(
        train_img_list, train_mask_list,
        img_size=(args.img_size, args.img_size),
        in_channels=args.in_channels,
        augment=True
    )
    val_dataset = SentinelLULCDataset(
        val_img_list, val_mask_list,
        img_size=(args.img_size, args.img_size),
        in_channels=args.in_channels,
        augment=False
    )

    num_workers = 0 if os.name == 'nt' else 2
    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True, num_workers=num_workers)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=num_workers)

    # Compute inverse frequency class weights to balance rare classes (clipped to
    # avoid over-emphasizing extremely rare classes like 'urban' in small datasets)
    ce_weights, class_freqs = compute_class_weights(
        train_dataset,
        num_classes=len(LULC_CLASSES),
        weight_clip=tuple(args.weight_clip) if args.weight_clip else None,
        return_freqs=True,
    )
    ce_weights = ce_weights.to(device)

    # 3. Model, Loss, Metrics Tracker
    model = build_unet_resnet34(
        in_channels=args.in_channels,
        num_classes=len(LULC_CLASSES),
        encoder_weights="imagenet",
        pretrained=True
    ).to(device)

    criterion = CombinedDiceCELoss(ce_weights=ce_weights, ce_weight=1.0, dice_weight=1.0)
    metric_tracker = LULCMetrics(num_classes=len(LULC_CLASSES), class_names=LULC_CLASSES)

    # Checkpoint Paths
    best_model_path = MODELS_DIR / "unet_resnet34_lulc_best.pth"
    last_model_path = MODELS_DIR / "unet_resnet34_lulc_last.pth"

    history = {
        "train_loss": [], "val_loss": [],
        "train_ce": [], "train_dice": [],
        "val_mIoU": [], "val_pixel_acc": [],
        "class_iou_history": {name: [] for name in LULC_CLASSES}
    }

    best_mIoU = -1.0
    patience_counter = 0
    total_epochs = args.phase1_epochs + args.phase2_epochs
    current_epoch = 1

    # ==========================================================================
    # PHASE 1: Frozen Encoder (Decoder Warm-Up)
    # ==========================================================================
    if args.phase1_epochs > 0:
        print("\n" + "-"*75)
        print(f"[+] PHASE 1: WARM-UP DECODER (Encoder Frozen) - {args.phase1_epochs} Epochs")
        print(f"[*] Learning Rate: {args.lr_decoder} | Optimizer: AdamW")
        print("-"*75)

        freeze_encoder(model)
        optimizer = torch.optim.AdamW(
            [p for p in model.parameters() if p.requires_grad],
            lr=args.lr_decoder,
            weight_decay=1e-4
        )
        scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.phase1_epochs, eta_min=1e-6)

        for ep in range(1, args.phase1_epochs + 1):
            model.train()
            # Ensure encoder stays in eval mode while frozen
            if hasattr(model, "encoder"):
                model.encoder.eval()

            running_loss, running_ce, running_dice = 0.0, 0.0, 0.0
            pbar = tqdm(train_loader, desc=f"Epoch {current_epoch:02d}/{total_epochs:02d} [Phase 1 Train]")

            for imgs, masks, _ in pbar:
                imgs, masks = imgs.to(device), masks.to(device)
                optimizer.zero_grad()
                logits = model(imgs)
                loss, loss_dict = criterion(logits, masks)
                loss.backward()
                optimizer.step()

                running_loss += loss.item() * imgs.size(0)
                running_ce += loss_dict["ce_loss"] * imgs.size(0)
                running_dice += loss_dict["dice_loss"] * imgs.size(0)
                pbar.set_postfix({"Loss": f"{loss.item():.4f}", "DiceL": f"{loss_dict['dice_loss']:.4f}"})

            scheduler.step()

            # Validation
            val_metrics = run_validation_epoch(model, val_loader, criterion, metric_tracker, device)
            ep_train_loss = running_loss / len(train_dataset)

            history["train_loss"].append(ep_train_loss)
            history["val_loss"].append(val_metrics["val_loss"])
            history["val_mIoU"].append(val_metrics["mIoU"])
            history["val_pixel_acc"].append(val_metrics["pixel_accuracy"])
            for name in LULC_CLASSES:
                history["class_iou_history"][name].append(val_metrics["class_iou"].get(name, 0.0))

            print(f"[*] Ep {current_epoch:02d} | Train Loss: {ep_train_loss:.4f} | Val Loss: {val_metrics['val_loss']:.4f} | Val mIoU: {val_metrics['mIoU']:.4f} | Pixel Acc: {val_metrics['pixel_accuracy']*100:.2f}%")

            # Checkpoint
            if val_metrics["mIoU"] > best_mIoU:
                best_mIoU = val_metrics["mIoU"]
                torch.save({
                    "epoch": current_epoch,
                    "phase": 1,
                    "model_state_dict": model.state_dict(),
                    "mIoU": best_mIoU,
                    "class_iou": val_metrics["class_iou"],
                    "pixel_accuracy": val_metrics["pixel_accuracy"],
                    "in_channels": args.in_channels,
                    "num_classes": len(LULC_CLASSES),
                    "img_size": args.img_size,
                    "class_freqs": class_freqs.tolist()
                }, best_model_path)
                print(f"    [BEST] New Best Model Saved -> {best_model_path.name} (Val mIoU: {best_mIoU:.4f})")

            current_epoch += 1

    # ==========================================================================
    # PHASE 2: Full Network End-to-End Fine-Tuning
    # ==========================================================================
    if args.phase2_epochs > 0:
        print("\n" + "-"*75)
        print(f"[+] PHASE 2: FULL FINE-TUNING (Encoder Unfrozen) - {args.phase2_epochs} Epochs")
        print(f"[*] Backbone LR: {args.lr_backbone} | Decoder LR: {args.lr_decoder}")
        print(f"[*] Early Stopping Patience: {args.patience} epochs on Validation mIoU")
        print("-"*75)

        unfreeze_encoder(model)
        optimizer = get_optimizer_and_groups(
            model,
            backbone_lr=args.lr_backbone,
            decoder_lr=args.lr_decoder,
            weight_decay=1e-4
        )
        scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
            optimizer, mode="max", factor=0.5, patience=3, min_lr=1e-6
        )

        for ep in range(1, args.phase2_epochs + 1):
            model.train()
            running_loss = 0.0
            pbar = tqdm(train_loader, desc=f"Epoch {current_epoch:02d}/{total_epochs:02d} [Phase 2 Fine-Tune]")

            for imgs, masks, _ in pbar:
                imgs, masks = imgs.to(device), masks.to(device)
                optimizer.zero_grad()
                logits = model(imgs)
                loss, loss_dict = criterion(logits, masks)
                loss.backward()
                optimizer.step()

                running_loss += loss.item() * imgs.size(0)
                pbar.set_postfix({"Loss": f"{loss.item():.4f}", "DiceL": f"{loss_dict['dice_loss']:.4f}"})

            # Validation
            val_metrics = run_validation_epoch(model, val_loader, criterion, metric_tracker, device)
            ep_train_loss = running_loss / len(train_dataset)

            scheduler.step(val_metrics["mIoU"])

            history["train_loss"].append(ep_train_loss)
            history["val_loss"].append(val_metrics["val_loss"])
            history["val_mIoU"].append(val_metrics["mIoU"])
            history["val_pixel_acc"].append(val_metrics["pixel_accuracy"])
            for name in LULC_CLASSES:
                history["class_iou_history"][name].append(val_metrics["class_iou"].get(name, 0.0))

            print(f"[*] Ep {current_epoch:02d} | Train Loss: {ep_train_loss:.4f} | Val Loss: {val_metrics['val_loss']:.4f} | Val mIoU: {val_metrics['mIoU']:.4f} | Pixel Acc: {val_metrics['pixel_accuracy']*100:.2f}%")

            # Early Stopping & Checkpoint Logic
            if val_metrics["mIoU"] > best_mIoU:
                best_mIoU = val_metrics["mIoU"]
                patience_counter = 0
                torch.save({
                    "epoch": current_epoch,
                    "phase": 2,
                    "model_state_dict": model.state_dict(),
                    "mIoU": best_mIoU,
                    "class_iou": val_metrics["class_iou"],
                    "pixel_accuracy": val_metrics["pixel_accuracy"],
                    "in_channels": args.in_channels,
                    "num_classes": len(LULC_CLASSES),
                    "img_size": args.img_size,
                    "class_freqs": class_freqs.tolist()
                }, best_model_path)
                print(f"    [BEST] New Best Model Saved -> {best_model_path.name} (Val mIoU: {best_mIoU:.4f})")
            else:
                patience_counter += 1
                print(f"    [-] Patience: {patience_counter}/{args.patience} (Best mIoU: {best_mIoU:.4f})")
                if patience_counter >= args.patience:
                    print(f"\n[STOP] Early stopping triggered at epoch {current_epoch} due to plateau in validation mIoU.")
                    break

            current_epoch += 1

    # Save last model checkpoint
    torch.save({
        "epoch": current_epoch - 1,
        "model_state_dict": model.state_dict(),
        "mIoU": history["val_mIoU"][-1] if history["val_mIoU"] else 0.0,
        "in_channels": args.in_channels,
        "num_classes": len(LULC_CLASSES),
        "img_size": args.img_size,
        "class_freqs": class_freqs.tolist()
    }, last_model_path)

    # 4. Generate Visual Plots & Evaluation Reports
    plot_training_results(history, model, val_loader, device, MODELS_DIR / "segmentation_results.png")
    print(f"\n[OK] Training complete. Best Validation mIoU: {best_mIoU:.4f}")
    print(f"[OK] Checkpoint saved: {best_model_path}")


# ==============================================================================
# 3. Comprehensive Metric Visualization & Predictions Plot
# ==============================================================================

def plot_training_results(history, model, val_loader, device, save_path):
    """Plots training/validation curves, per-class IoU bar charts, and visual prediction overlays."""
    model.eval()
    fig = plt.figure(figsize=(16, 12))

    # 1. Total Loss Curve
    plt.subplot(2, 2, 1)
    epochs = range(1, len(history["train_loss"]) + 1)
    plt.plot(epochs, history["train_loss"], "b-o", label="Train Loss", linewidth=2, markersize=4)
    plt.plot(epochs, history["val_loss"], "r-s", label="Val Loss", linewidth=2, markersize=4)
    plt.title("Combined BCE + Multiclass Dice Loss", fontsize=12, fontweight="bold")
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.grid(True, linestyle="--", alpha=0.5)
    plt.legend()

    # 2. Validation mIoU & Pixel Accuracy Curves
    plt.subplot(2, 2, 2)
    plt.plot(epochs, history["val_mIoU"], "g-^", label="Validation mIoU", linewidth=2, markersize=5)
    plt.plot(epochs, history["val_pixel_acc"], "m-d", label="Pixel Accuracy", linewidth=2, markersize=5)
    plt.title("Validation Mean IoU & Pixel Accuracy", fontsize=12, fontweight="bold")
    plt.xlabel("Epoch")
    plt.ylabel("Score")
    plt.grid(True, linestyle="--", alpha=0.5)
    plt.legend()

    # 3. Per-Class Final IoU Bar Chart
    plt.subplot(2, 2, 3)
    final_ious = [history["class_iou_history"][c][-1] if history["class_iou_history"][c] else 0.0 for c in LULC_CLASSES]
    bar_colors = [np.array(LULC_COLOR_MAP[i]) / 255.0 for i in range(len(LULC_CLASSES))]
    bars = plt.bar(LULC_CLASSES, final_ious, color=bar_colors, edgecolor="black", alpha=0.85)
    plt.title("Per-Class IoU at Convergence", fontsize=12, fontweight="bold")
    plt.ylabel("IoU Score")
    plt.ylim(0.0, 1.0)
    plt.xticks(rotation=20)
    plt.grid(axis="y", linestyle="--", alpha=0.5)
    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2.0, yval + 0.02, f"{yval:.2f}", ha='center', va='bottom', fontsize=9)

    # 4. Visual Prediction Sample
    plt.subplot(2, 2, 4)
    with torch.no_grad():
        imgs, masks, _ = next(iter(val_loader))
        imgs, masks = imgs.to(device), masks.to(device)
        logits = model(imgs)
        preds = torch.argmax(logits, dim=1).cpu().numpy()
        masks_np = masks.cpu().numpy()
        # Denormalize RGB channels for display
        rgb_display = imgs[0, :3].cpu().numpy().transpose(1, 2, 0)
        rgb_display = (rgb_display - rgb_display.min()) / (rgb_display.max() - rgb_display.min() + 1e-8)

    pred_rgb = mask_to_rgb(preds[0])
    gt_rgb = mask_to_rgb(masks_np[0])

    # Side-by-side composite inside subplot 4
    comp = np.hstack([rgb_display, gt_rgb / 255.0, pred_rgb / 255.0])
    plt.imshow(comp)
    plt.title("Input RGB  |  Ground Truth Mask  |  U-Net Prediction", fontsize=11, fontweight="bold")
    plt.axis("off")

    plt.tight_layout()
    plt.savefig(save_path, dpi=200, bbox_inches="tight")
    plt.close()
    print(f"[OK] Saved comprehensive evaluation & prediction plot -> {save_path}")


# ==============================================================================
# 4. Tabular GIS / Land Surface Temperature Regressor
# ==============================================================================

class GISLandMLP(nn.Module):
    """Deep Multi-Layer Perceptron for Land Surface Temperature & GIS Modeling."""
    def __init__(self, input_dim, hidden_dims=[128, 64, 32], output_dim=1):
        super().__init__()
        layers = []
        curr_dim = input_dim
        for h_dim in hidden_dims:
            layers.extend([
                nn.Linear(curr_dim, h_dim),
                nn.BatchNorm1d(h_dim),
                nn.ReLU(),
                nn.Dropout(0.1)
            ])
            curr_dim = h_dim
        layers.append(nn.Linear(curr_dim, output_dim))
        self.network = nn.Sequential(*layers)

    def forward(self, x):
        return self.network(x)


def train_gis_tabular(args, device):
    print("\n" + "="*75)
    print(">>> LAND SURFACE TEMPERATURE & GIS ENVIRONMENTAL MODELING")
    print("="*75)

    tab_dir = DATA_DIR / "tabular"
    zip_path = DATASET_DIR / "archive (4).zip"
    extract_zip_if_needed(zip_path, tab_dir, marker_file="dataset_v3.csv")

    csv_path = tab_dir / "dataset_v3.csv"
    if not csv_path.exists():
        print(f"[!] Error: Could not find {csv_path}")
        return

    df = pd.read_csv(csv_path).dropna()
    target_col = "LST_Day" if "LST_Day" in df.columns else df.columns[2]
    feature_cols = [c for c in df.columns if c != target_col]

    X = df[feature_cols].values
    y = df[target_col].values.reshape(-1, 1)

    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.2, random_state=42)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

    scaler_X, scaler_y = StandardScaler(), StandardScaler()
    X_train_scaled = scaler_X.fit_transform(X_train)
    X_val_scaled = scaler_X.transform(X_val)
    X_test_scaled = scaler_X.transform(X_test)
    y_train_scaled = scaler_y.fit_transform(y_train)
    y_val_scaled = scaler_y.transform(y_val)
    y_test_scaled = scaler_y.transform(y_test)

    train_loader = DataLoader(
        torch.utils.data.TensorDataset(torch.tensor(X_train_scaled, dtype=torch.float32), torch.tensor(y_train_scaled, dtype=torch.float32)),
        batch_size=64, shuffle=True
    )
    val_loader = DataLoader(
        torch.utils.data.TensorDataset(torch.tensor(X_val_scaled, dtype=torch.float32), torch.tensor(y_val_scaled, dtype=torch.float32)),
        batch_size=64, shuffle=False
    )

    model = GISLandMLP(input_dim=len(feature_cols)).to(device)
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.003, weight_decay=1e-5)
    best_model_path = MODELS_DIR / "land_gis_model.pth"

    gis_epochs = max(20, args.phase2_epochs)
    best_loss = float("inf")

    for epoch in range(1, gis_epochs + 1):
        model.train()
        for bx, by in train_loader:
            bx, by = bx.to(device), by.to(device)
            optimizer.zero_grad()
            loss = criterion(model(bx), by)
            loss.backward()
            optimizer.step()

        model.eval()
        v_loss = 0.0
        with torch.no_grad():
            for bx, by in val_loader:
                bx, by = bx.to(device), by.to(device)
                v_loss += criterion(model(bx), by).item() * bx.size(0)
        v_loss /= len(val_loader.dataset)

        if v_loss < best_loss:
            best_loss = v_loss
            torch.save({
                "model_state_dict": model.state_dict(),
                "feature_cols": feature_cols,
                "target_col": target_col,
                "scaler_X_mean": scaler_X.mean_, "scaler_X_scale": scaler_X.scale_,
                "scaler_y_mean": scaler_y.mean_, "scaler_y_scale": scaler_y.scale_,
            }, best_model_path)

    print(f"[OK] GIS Regression model trained and saved to {best_model_path.name}")


# ==============================================================================
# 5. CLI Entry Point
# ==============================================================================

def main():
    parser = argparse.ArgumentParser(description="Sentinel-2 LULC Semantic Segmentation Pipeline")
    parser.add_argument("--task", type=str, default="segmentation", choices=["segmentation", "gis", "all"],
                        help="Task to run: 'segmentation', 'gis', or 'all' (default: segmentation)")
    parser.add_argument("--in-channels", type=int, default=4, choices=[3, 4],
                        help="Input channels: 4 (RGB+NIR) or 3 (RGB) (default: 4)")
    parser.add_argument("--batch-size", type=int, default=8,
                        help="Batch size (default: 8, safe for Colab T4 / RTX A2000)")
    parser.add_argument("--img-size", type=int, default=256,
                        help="Resolution of patches (default: 256)")
    parser.add_argument("--phase1-epochs", type=int, default=10,
                        help="Phase 1: Frozen backbone warmup epochs (default: 10)")
    parser.add_argument("--phase2-epochs", type=int, default=25,
                        help="Phase 2: Unfrozen fine-tuning epochs (default: 25)")
    parser.add_argument("--lr-decoder", type=float, default=1e-4,
                        help="Learning rate for decoder & segmentation head (default: 1e-4)")
    parser.add_argument("--lr-backbone", type=float, default=1e-5,
                        help="Learning rate for pretrained ResNet34 backbone in Phase 2 (default: 1e-5)")
    parser.add_argument("--patience", type=int, default=6,
                        help="Early stopping patience on validation mIoU (default: 6)")
    parser.add_argument("--weight-clip", type=float, nargs=2, default=[0.5, 3.0], metavar=("MIN", "MAX"),
                        help="Min/max bounds for inverse-frequency class loss weights, prevents over-emphasis "
                             "of extremely rare classes (default: 0.5 3.0). Pass e.g. --weight-clip 0 100 to disable.")
    parser.add_argument("--device", type=str, default="auto", choices=["auto", "cuda", "cpu"],
                        help="Hardware device (default: auto)")

    args = parser.parse_args()

    # Determine hardware device
    if args.device == "auto":
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    else:
        device = torch.device(args.device)

    if args.task in ["all", "segmentation"]:
        train_lulc_unet(args, device)

    if args.task in ["all", "gis"]:
        train_gis_tabular(args, device)


if __name__ == "__main__":
    main()
