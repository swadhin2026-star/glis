"""
Sentinel-2 LULC Semantic Segmentation Dataset & Preprocessing Pipeline
========================================================================
Handles:
  - 4-channel (RGB + NIR) and 3-channel (RGB) Sentinel-2 / satellite imagery
  - Multi-class mask conversion (indexed or RGB color-coded)
  - Class frequency analysis and automated inverse-frequency loss weighting
  - Data augmentations (flips, rotations, intensity perturbations)
"""

import os
import glob
from pathlib import Path
from typing import List, Tuple, Dict, Optional

import numpy as np
import torch
from torch.utils.data import Dataset
from PIL import Image


# ==============================================================================
# 1. Standard LULC Class Definitions & Color Palette
# ==============================================================================

LULC_CLASSES = [
    "barren",       # 0: Bare soil, sand, rocks, background
    "agriculture",  # 1: Cropland, farmlands, paddy
    "forest",       # 2: Dense forest, trees, wooded areas
    "urban",        # 3: Built-up, settlements, buildings, roads
    "water",        # 4: Rivers, lakes, ponds, reservoirs
    "wetland",      # 5: Marshland, wetlands, mangrove, scrub
]

LULC_COLOR_MAP = {
    0: (160, 160, 160),  # Barren: Gray / Tan
    1: (255, 215, 0),    # Agriculture: Yellow / Gold
    2: (34, 139, 34),    # Forest: Forest Green
    3: (220, 20, 60),    # Urban: Crimson Red
    4: (30, 144, 255),   # Water: Deep Sky Blue
    5: (148, 0, 211),    # Wetland: Violet / Purple
}

# ImageNet standard normalization stats (extended to 4th NIR channel)
IMAGENET_MEAN = [0.485, 0.456, 0.406, 0.500]
IMAGENET_STD  = [0.229, 0.224, 0.225, 0.225]


# ==============================================================================
# 2. Mask RGB -> Class Index Mapping Helper
# ==============================================================================

def rgb_to_class_mask(rgb_mask: np.ndarray, color_dict: Optional[Dict[int, Tuple[int, int, int]]] = None) -> np.ndarray:
    """
    Converts an RGB segmentation mask [H, W, 3] to a 2D class index array [H, W].
    Matches pixels to closest color in color_dict using Euclidean distance in RGB space.
    """
    if rgb_mask.ndim == 2:
        return rgb_mask.astype(np.int64)

    H, W, _ = rgb_mask.shape
    palette = color_dict or LULC_COLOR_MAP
    
    # Custom color presets (e.g. from class_dict_seg.csv)
    # urban:(0,255,255), water:(0,0,255), forest:(0,255,0), agriculture:(255,255,0), road:(255,0,255)
    custom_colors = {
        0: (0, 0, 0),        # barren / background
        1: (255, 255, 0),    # agriculture
        2: (0, 255, 0),      # forest
        3: (0, 255, 255),    # urban
        4: (0, 0, 255),      # water
        5: (255, 0, 255),    # road / wetland
    }

    colors = np.array([custom_colors.get(i, palette.get(i, (0, 0, 0))) for i in range(len(LULC_CLASSES))], dtype=np.float32)
    flat_mask = rgb_mask.reshape(-1, 3).astype(np.float32)

    # Compute Euclidean distance to each class center
    # [N, 1, 3] - [1, C, 3] -> [N, C, 3] -> [N, C]
    dists = np.linalg.norm(flat_mask[:, None, :] - colors[None, :, :], axis=2)
    class_indices = np.argmin(dists, axis=1).reshape((H, W)).astype(np.int64)
    return class_indices


def mask_to_rgb(indexed_mask: np.ndarray, color_map: Optional[Dict[int, Tuple[int, int, int]]] = None) -> np.ndarray:
    """Converts a 2D indexed mask [H, W] to an RGB visualization image [H, W, 3]."""
    palette = color_map or LULC_COLOR_MAP
    H, W = indexed_mask.shape
    rgb = np.zeros((H, W, 3), dtype=np.uint8)
    for cls_idx, color in palette.items():
        rgb[indexed_mask == cls_idx] = color
    return rgb


# ==============================================================================
# 3. Sentinel-2 Multi-Band LULC Dataset
# ==============================================================================

class SentinelLULCDataset(Dataset):
    """
    Dataset loader for multi-band Sentinel-2 land cover segmentation.
    Supports 4 channels (RGB + NIR / Band 8) and 3 channels (RGB).
    """
    def __init__(
        self,
        image_paths: List[str],
        mask_paths: List[str],
        nir_paths: Optional[List[str]] = None,
        img_size: Tuple[int, int] = (256, 256),
        in_channels: int = 4,
        augment: bool = False,
        normalize: bool = True
    ):
        self.image_paths = [Path(p) for p in image_paths]
        self.mask_paths = [Path(p) for p in mask_paths]
        self.nir_paths = [Path(p) for p in nir_paths] if nir_paths else None
        self.img_size = img_size
        self.in_channels = in_channels
        self.augment = augment
        self.normalize = normalize

        assert len(self.image_paths) == len(self.mask_paths), (
            f"Images ({len(self.image_paths)}) and Masks ({len(self.mask_paths)}) count mismatch."
        )

    def __len__(self):
        return len(self.image_paths)

    def _load_image(self, img_path: Path, nir_path: Optional[Path]) -> np.ndarray:
        """Loads RGB + NIR and returns float array [H, W, in_channels] in range [0, 1]."""
        # Load RGB
        rgb_img = Image.open(img_path).convert("RGB")
        rgb_img = rgb_img.resize(self.img_size, Image.BILINEAR)
        rgb_arr = np.array(rgb_img, dtype=np.float32) / 255.0

        if self.in_channels == 3:
            return rgb_arr

        # Handle 4th band (NIR / SAR)
        if nir_path and nir_path.exists():
            nir_img = Image.open(nir_path).convert("L")
            nir_img = nir_img.resize(self.img_size, Image.BILINEAR)
            nir_arr = np.array(nir_img, dtype=np.float32)[:, :, None] / 255.0
        else:
            # Synthetic / Estimated NIR channel from vegetation reflectance proxy:
            # Chlorophyll reflects strongly in Green while Red is absorbed
            # NIR proxy = 0.6 * Green + 0.4 * (1.0 - Red)
            nir_arr = (0.6 * rgb_arr[:, :, 1:2] + 0.4 * (1.0 - rgb_arr[:, :, 0:1])).astype(np.float32)
            nir_arr = np.clip(nir_arr, 0.0, 1.0)

        # Stack into [H, W, 4]
        img_4b = np.concatenate([rgb_arr, nir_arr], axis=-1)
        return img_4b

    def _load_mask(self, mask_path: Path) -> np.ndarray:
        """Loads mask and returns 2D int array [H, W] with class indices 0..C-1."""
        mask_pil = Image.open(mask_path)
        mask_pil = mask_pil.resize(self.img_size, Image.NEAREST)
        mask_arr = np.array(mask_pil)

        if mask_arr.ndim == 3:
            return rgb_to_class_mask(mask_arr)
        else:
            # Ensure indices are within [0, len(LULC_CLASSES) - 1]
            return np.clip(mask_arr.astype(np.int64), 0, len(LULC_CLASSES) - 1)

    def __getitem__(self, idx: int):
        img_path = self.image_paths[idx]
        mask_path = self.mask_paths[idx]
        nir_path = self.nir_paths[idx] if self.nir_paths else None

        img_arr = self._load_image(img_path, nir_path)
        mask_arr = self._load_mask(mask_path)

        # Data Augmentations
        if self.augment:
            # Random Horizontal Flip
            if np.random.rand() > 0.5:
                img_arr = np.fliplr(img_arr).copy()
                mask_arr = np.fliplr(mask_arr).copy()

            # Random Vertical Flip
            if np.random.rand() > 0.5:
                img_arr = np.flipud(img_arr).copy()
                mask_arr = np.flipud(mask_arr).copy()

            # Random 90-deg Rotations
            k = np.random.randint(0, 4)
            if k > 0:
                img_arr = np.rot90(img_arr, k).copy()
                mask_arr = np.rot90(mask_arr, k).copy()

            # Intensity jitter on spectral channels
            if np.random.rand() > 0.5:
                gamma = np.random.uniform(0.85, 1.15)
                img_arr = np.clip(img_arr ** gamma, 0.0, 1.0)

        # Normalize with mean/std
        if self.normalize:
            mean = np.array(IMAGENET_MEAN[:self.in_channels], dtype=np.float32)
            std = np.array(IMAGENET_STD[:self.in_channels], dtype=np.float32)
            img_arr = (img_arr - mean) / std

        # Convert to PyTorch tensors: [H, W, C] -> [C, H, W]
        img_tensor = torch.from_numpy(img_arr.transpose(2, 0, 1)).float()
        mask_tensor = torch.from_numpy(mask_arr).long()

        return img_tensor, mask_tensor, str(img_path)


# ==============================================================================
# 4. Dataset Utilities: Class Weights & Dataset Inspection
# ==============================================================================

def compute_class_weights(dataset: Dataset, num_classes: int = 6, max_samples: int = 200) -> torch.Tensor:
    """
    Computes smooth inverse frequency weights for Cross-Entropy to counter class imbalance:
    w_c = 1 / ln(1.02 + f_c), normalized so mean(w) = 1.0.
    """
    print(f"[*] Analyzing class pixel distribution over {min(len(dataset), max_samples)} patches ...")
    counts = np.zeros(num_classes, dtype=np.int64)
    sample_indices = np.random.choice(len(dataset), size=min(len(dataset), max_samples), replace=False)

    for idx in sample_indices:
        _, mask_tensor, _ = dataset[idx]
        mask_np = mask_tensor.numpy()
        for c in range(num_classes):
            counts[c] += np.sum(mask_np == c)

    total_pixels = np.sum(counts)
    if total_pixels == 0:
        return torch.ones(num_classes, dtype=torch.float32)

    freqs = counts / total_pixels
    # Smooth inverse frequency
    weights = 1.0 / np.log(1.02 + freqs)
    weights = weights / np.mean(weights)  # Normalize mean to 1.0

    print("[*] Class Distribution & Computed Loss Weights:")
    for i, name in enumerate(LULC_CLASSES[:num_classes]):
        print(f"    - {name:<12}: {freqs[i]*100:6.2f}% of pixels | Loss Weight: {weights[i]:.3f}")

    return torch.tensor(weights, dtype=torch.float32)
