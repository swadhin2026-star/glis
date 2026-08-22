"""
Loss Functions and Evaluation Metrics for Multi-Class LULC Semantic Segmentation
================================================================================
Implements:
  - CombinedDiceCELoss: Hybrid Weighted Cross-Entropy + Multiclass Soft Dice Loss
  - LULCMetrics: Vectorized confusion matrix, Mean IoU (mIoU), per-class IoU/Dice, Pixel Accuracy
"""

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F


# ==============================================================================
# 1. Combined Weighted Cross-Entropy + Multiclass Dice Loss
# ==============================================================================

class CombinedDiceCELoss(nn.Module):
    """
    Hybrid loss combining Weighted Cross-Entropy and Soft Multiclass Dice Loss.
    
    CE focuses on pixel-level classification accuracy and class weighting prevents
    frequent classes (e.g. agriculture) from dominating rare classes (e.g. built-up / water).
    Dice Loss penalizes region and boundary level segmentation mismatches.
    """
    def __init__(self, ce_weights=None, ce_weight=1.0, dice_weight=1.0, smooth=1.0, ignore_index=-100):
        super().__init__()
        self.ce_weight = ce_weight
        self.dice_weight = dice_weight
        self.smooth = smooth
        self.ignore_index = ignore_index

        if ce_weights is not None:
            if not isinstance(ce_weights, torch.Tensor):
                ce_weights = torch.tensor(ce_weights, dtype=torch.float32)
        self.register_buffer("ce_weights", ce_weights)

    def forward(self, logits: torch.Tensor, targets: torch.Tensor):
        """
        Args:
            logits:  [B, C, H, W] unnormalized model outputs
            targets: [B, H, W] or [B, 1, H, W] ground truth class indices (0 to C-1)
        Returns:
            total_loss, dict of individual loss terms
        """
        if targets.dim() == 4:
            targets = targets.squeeze(1)
        targets = targets.long()

        # 1. Weighted Cross-Entropy Loss
        ce_loss = F.cross_entropy(
            logits, targets,
            weight=self.ce_weights,
            ignore_index=self.ignore_index,
            reduction="mean"
        )

        # 2. Multiclass Soft Dice Loss
        num_classes = logits.shape[1]
        probs = F.softmax(logits, dim=1)  # [B, C, H, W]

        # Valid mask (excluding ignore_index)
        valid_mask = (targets != self.ignore_index)  # [B, H, W]
        targets_clamped = targets.clone()
        targets_clamped[~valid_mask] = 0

        # One-hot encode targets: [B, H, W] -> [B, C, H, W]
        targets_one_hot = F.one_hot(targets_clamped, num_classes=num_classes).permute(0, 3, 1, 2).float()

        # Apply valid mask across channels
        if not valid_mask.all():
            mask_expanded = valid_mask.unsqueeze(1).expand_as(probs)
            probs = probs * mask_expanded.float()
            targets_one_hot = targets_one_hot * mask_expanded.float()

        # Calculate Dice per class across spatial dimensions [B, C] -> [C]
        dims = (0, 2, 3)
        intersection = torch.sum(probs * targets_one_hot, dim=dims)
        cardinality = torch.sum(probs + targets_one_hot, dim=dims)
        dice_per_class = (2.0 * intersection + self.smooth) / (cardinality + self.smooth)

        dice_loss = 1.0 - torch.mean(dice_per_class)

        # 3. Combined weighted loss
        total_loss = (self.ce_weight * ce_loss) + (self.dice_weight * dice_loss)

        return total_loss, {
            "ce_loss": ce_loss.item(),
            "dice_loss": dice_loss.item(),
            "mean_dice": torch.mean(dice_per_class).item()
        }


# ==============================================================================
# 2. Vectorized Metric Accumulator (mIoU, Class IoU, F1/Dice, Pixel Accuracy)
# ==============================================================================

class LULCMetrics:
    """
    Maintains a confusion matrix over batches to compute exact global
    Mean IoU (mIoU), per-class IoU, per-class F1/Dice, and Pixel Accuracy.
    """
    def __init__(self, num_classes: int, class_names: list = None, ignore_index: int = -100):
        self.num_classes = num_classes
        self.class_names = class_names or [f"Class_{i}" for i in range(num_classes)]
        self.ignore_index = ignore_index
        self.reset()

    def reset(self):
        """Resets the internal confusion matrix."""
        self.confusion_matrix = np.zeros((self.num_classes, self.num_classes), dtype=np.int64)

    def update(self, preds: torch.Tensor, targets: torch.Tensor):
        """
        Updates confusion matrix with current batch.
        
        Args:
            preds:   [B, C, H, W] logits or [B, H, W] class predictions
            targets: [B, H, W] or [B, 1, H, W] ground truth class indices
        """
        with torch.no_grad():
            if preds.dim() == 4:
                preds = torch.argmax(preds, dim=1)  # [B, H, W]

            if targets.dim() == 4:
                targets = targets.squeeze(1)

            preds = preds.view(-1).cpu().numpy()
            targets = targets.view(-1).cpu().numpy()

            # Filter valid pixels
            valid = (targets != self.ignore_index) & (targets >= 0) & (targets < self.num_classes)
            preds = preds[valid]
            targets = targets[valid]

            if len(targets) > 0:
                # Fast bincount for 2D confusion matrix: row=target (true), col=pred
                indices = self.num_classes * targets.astype(np.int64) + preds.astype(np.int64)
                count = np.bincount(indices, minlength=self.num_classes ** 2)
                self.confusion_matrix += count.reshape((self.num_classes, self.num_classes))

    def compute(self):
        """
        Computes summary metrics from accumulated confusion matrix.
        
        Returns:
            dict containing:
              - 'mIoU': Mean Intersection over Union across valid classes
              - 'pixel_accuracy': Global overall pixel accuracy
              - 'class_iou': dict mapping class name to its IoU score
              - 'class_dice': dict mapping class name to its Dice/F1 score
        """
        cm = self.confusion_matrix
        tp = np.diag(cm)
        fp = np.sum(cm, axis=0) - tp
        fn = np.sum(cm, axis=1) - tp

        union = tp + fp + fn
        
        # Per-class IoU: TP / (TP + FP + FN)
        class_iou = {}
        valid_ious = []
        for i, name in enumerate(self.class_names):
            if union[i] > 0:
                iou = tp[i] / union[i]
                class_iou[name] = float(iou)
                valid_ious.append(iou)
            else:
                class_iou[name] = 0.0

        m_iou = float(np.mean(valid_ious)) if valid_ious else 0.0

        # Per-class Dice: 2*TP / (2*TP + FP + FN)
        class_dice = {}
        for i, name in enumerate(self.class_names):
            denom = (2 * tp[i]) + fp[i] + fn[i]
            class_dice[name] = float((2.0 * tp[i]) / denom) if denom > 0 else 0.0

        # Overall pixel accuracy: sum(TP) / sum(Total)
        total_pixels = np.sum(cm)
        pixel_acc = float(np.sum(tp) / total_pixels) if total_pixels > 0 else 0.0

        return {
            "mIoU": m_iou,
            "pixel_accuracy": pixel_acc,
            "class_iou": class_iou,
            "class_dice": class_dice,
            "confusion_matrix": cm
        }
