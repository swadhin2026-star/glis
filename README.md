# U-Net LULC Semantic Segmentation & GIS Modeling System

An end-to-end Deep Learning system for **Land Use / Land Cover (LULC) Semantic Segmentation** from multi-spectral Sentinel-2 satellite imagery (RGB + NIR bands) and GIS Environmental Parameter Modeling.

---

## 🛰️ Architecture Overview

- **Model Framework**: `segmentation_models_pytorch` (`smp.Unet`) with native PyTorch fallback.
- **Encoder (Backbone)**: `ResNet34` pretrained on ImageNet.
- **Decoder**: Standard U-Net decoder with skip connections from matching encoder resolution stages.
- **Input Channels**: **4 channels** (RGB + NIR / Band 8) for optimal vegetation and water boundary separation.
- **Output Classes**: **6 LULC Classes**:
  1. `Barren / Background` (Bare soil, sand, rocks)
  2. `Agriculture` (Cropland, farmlands, paddy)
  3. `Forest` (Dense canopy, trees, vegetation)
  4. `Urban / Built-up` (Settlements, buildings, roads)
  5. `Water` (Rivers, lakes, reservoirs)
  6. `Wetland / Scrubland` (Wetlands, marshes, scrub)
- **Loss Function**: Combined **Multiclass Dice Loss + Weighted Cross-Entropy Loss** with dynamic inverse-frequency class weighting to eliminate class imbalance issues.
- **Optimization**: AdamW with `CosineAnnealingLR` (Phase 1) and `ReduceLROnPlateau` (Phase 2).
- **Validation Metric**: Mean Intersection over Union (**mIoU**), Pixel Accuracy, and Per-Class IoU/Dice.

---

## 📅 Two-Phase Training Schedule

| Training Phase | Description | Recommended Epochs | Learning Rates | Purpose |
|---|---|---|---|---|
| **Phase 1: Warm-up** | Pretrained `ResNet34` encoder frozen. Train decoder & segmentation head only. | 10 – 15 epochs | Decoder: `1e-4` | Fast baseline convergence without destroying pretrained ImageNet weights. |
| **Phase 2: Full Fine-Tuning** | Unfreeze encoder backbone. Train end-to-end with differential learning rates. | 20 – 30 epochs | Backbone: `1e-5`<br>Decoder: `1e-4` | Adapts deep filters to satellite multi-spectral features; stops early on validation mIoU plateau. |

---

## 🚀 Quick Start (Automated One-Click Setup & Run)

### Windows Batch File (Recommended)
```cmd
setup_and_train.bat
```

### PowerShell
```powershell
.\setup_and_train.ps1
```

---

## 🛠️ CLI Training Options

Execute `train.py` with custom hyperparameters:

```bash
# Standard 2-Phase Training (10 Warm-up + 25 Fine-Tune Epochs on GPU)
python train.py --task segmentation --phase1-epochs 10 --phase2-epochs 25 --batch-size 8 --device cuda

# Quick Dry Run / Fast Test
python train.py --phase1-epochs 2 --phase2-epochs 3 --batch-size 8

# Train on 3-channel RGB imagery only
python train.py --in-channels 3

# Train GIS Land Surface Temperature Regression MLP
python train.py --task gis
```

### Key CLI Flags:
- `--in-channels`: Number of input spectral bands (`4` for RGB+NIR, `3` for RGB).
- `--batch-size`: Batch size (default: `8`, optimal for 6GB GPUs like RTX A2000 / Colab T4).
- `--phase1-epochs`: Epochs for frozen encoder warm-up (default: `10`).
- `--phase2-epochs`: Epochs for full network fine-tuning (default: `25`).
- `--lr-decoder`: Learning rate for decoder and segmentation head (default: `1e-4`).
- `--lr-backbone`: Learning rate for ResNet34 backbone in Phase 2 (default: `1e-5`).
- `--patience`: Early stopping patience tracking validation mIoU (default: `6`).
- `--device`: `auto`, `cuda`, or `cpu`.

---

## 🔮 Inference & Land Area Analytics

Use `predict.py` to segment new satellite images, generate colorized masks, and output quantitative area statistics:

```bash
# Predict on a specific satellite image
python predict.py --image path/to/satellite_patch.jpg

# Use custom model weights
python predict.py --image path/to/satellite_patch.jpg --model models/unet_resnet34_lulc_best.pth
```

### Outputs Generated:
- `models/prediction_<image_name>.png`: 4-panel visual analytics graphic (Input RGB, LULC Color Mask with Legend, 50% Overlay, and Class Area Distribution Bar Chart).
- `models/mask_<image_name>.png`: Raw indexed/colorized segmentation mask.
- Console table showing exact pixel counts and percentage area coverage per class.

---

## 📁 Repository Structure

```
├── dataset/                         # Raw dataset archives
│   ├── archive (1).zip              # Multi-spectral Sentinel patches
│   ├── archive (3).zip              # LULC pixel segmentation masks
│   └── archive (4).zip              # GIS & Land Surface Temperature tabular data
├── data/                            # Extracted dataset working folders
│   ├── segmentation/
│   └── tabular/
├── models/                          # Model checkpoints and visual plots
│   ├── unet_resnet34_lulc_best.pth  # Best checkpoint (highest validation mIoU)
│   ├── unet_resnet34_lulc_last.pth  # Final epoch checkpoint
│   ├── segmentation_results.png     # Training loss, mIoU curves & prediction grid
│   └── prediction_*.png             # Inference result visual plots
├── models_unet.py                   # ResNet34 U-Net (SMP + native PyTorch fallback)
├── losses_and_metrics.py            # Combined Dice + Weighted CE loss & mIoU tracker
├── lulc_dataset.py                  # 4-band Sentinel-2 dataset loader & augmentations
├── train.py                         # Two-phase training pipeline with early stopping
├── predict.py                       # Inference & land cover area analytics
├── requirements.txt                 # Dependencies (PyTorch, SMP, Albumentations, etc.)
├── setup_and_train.bat              # One-click Windows batch runner
└── setup_and_train.ps1              # One-click PowerShell runner
```