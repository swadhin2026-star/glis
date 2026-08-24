import sys
import os
import argparse
from pathlib import Path
import numpy as np
from PIL import Image
from sklearn.metrics import confusion_matrix, precision_score, recall_score, accuracy_score
import torch
import torch.nn.functional as F

from server import get_loaded_model, _MODEL_CACHE
from lulc_dataset import LULC_CLASSES, rgb_to_class_mask
from predict import preprocess_image

BASE_DIR = Path(__file__).resolve().parent
TEST_IMG_DIR = BASE_DIR / "data" / "segmentation" / "test_image"
TEST_MASK_DIR = BASE_DIR / "data" / "segmentation" / "pixel_based_mask" / "test_mask"

def evaluate_model():
    model, device = get_loaded_model(force_reload=True)
    if model is None:
        print("Failed to load model from server.py")
        return
    
    in_channels = _MODEL_CACHE.get("in_channels", 4)
    img_size = _MODEL_CACHE.get("img_size", 256)
    num_classes = _MODEL_CACHE.get("num_classes", 6)

    y_true_all = []
    y_pred_all = []

    image_files = list(TEST_IMG_DIR.glob("*.jpg"))
    if not image_files:
        print(f"No test images found in {TEST_IMG_DIR}")
        return
        
    print(f"Found {len(image_files)} test images. Starting evaluation on {device}...")
    
    for img_path in image_files:
        mask_path = TEST_MASK_DIR / (img_path.stem + ".png")
        if not mask_path.exists():
            print(f"Warning: Mask for {img_path.name} not found, skipping.")
            continue
        
        # Ground truth
        mask_pil = Image.open(mask_path)
        gt_mask = np.array(mask_pil.resize((img_size, img_size), Image.NEAREST)).astype(np.int64)
        gt_mask = np.clip(gt_mask, 0, len(LULC_CLASSES) - 1)
        
        # Prediction
        img_tensor, _ = preprocess_image(img_path, in_channels, img_size)
        img_tensor = img_tensor.to(device)
        
        with torch.no_grad():
            logits = model(img_tensor)
            probs = F.softmax(logits, dim=1).squeeze(0).cpu().numpy()
            pred_mask = np.argmax(probs, axis=0)
            
        y_true_all.append(gt_mask.flatten())
        y_pred_all.append(pred_mask.flatten())
        
        print(f"Processed {img_path.name}")
        
    if not y_true_all:
        print("No paired images and masks found.")
        return

    print("\nComputing metrics (this may take a moment for large masks)...")
    y_true = np.concatenate(y_true_all)
    y_pred = np.concatenate(y_pred_all)

    acc = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred, average=None, zero_division=0)
    recall = recall_score(y_true, y_pred, average=None, zero_division=0)
    
    cm = confusion_matrix(y_true, y_pred)

    print("\n" + "="*50)
    print("EVALUATION METRICS")
    print("="*50)
    print(f"Overall Accuracy: {acc*100:.2f}%\n")
    
    print(f"{'Class':<15} | {'Precision':<10} | {'Recall':<10}")
    print("-" * 40)
    
    # Only iterate over classes present in the true labels or up to num_classes
    num_found_classes = max(len(precision), num_classes)
    for i in range(num_found_classes):
        if i < len(LULC_CLASSES):
            cname = LULC_CLASSES[i].capitalize()
        else:
            cname = f"Class {i}"
        
        p = precision[i] if i < len(precision) else 0.0
        r = recall[i] if i < len(recall) else 0.0
        print(f"{cname:<15} | {p*100:6.2f}%    | {r*100:6.2f}%")
        
    print("\nConfusion Matrix:")
    print(cm)

if __name__ == '__main__':
    evaluate_model()
