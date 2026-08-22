"""
U-Net Architecture with ResNet34 Backbone for LULC Semantic Segmentation
==========================================================================
Implements U-Net with a pretrained ResNet34 encoder via `segmentation_models_pytorch`.
Supports:
  - 4-channel input (RGB + NIR) or standard 3-channel (RGB)
  - Multi-class output (e.g. 5-6 LULC classes)
  - Two-phase training helpers: encoder freeze, unfreeze, differential learning rates
  - Standalone pure PyTorch fallback in case segmentation_models_pytorch is unavailable
"""

import sys
import torch
import torch.nn as nn
import torch.nn.functional as F

try:
    import segmentation_models_pytorch as smp
    HAS_SMP = True
except ImportError:
    HAS_SMP = False


# ==============================================================================
# 1. Native PyTorch ResNet34 U-Net Fallback (in case SMP is offline / not installed)
# ==============================================================================

class ConvBlock(nn.Module):
    """(Conv2d -> BatchNorm2d -> ReLU) * 2"""
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.block = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_channels, out_channels, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
        )

    def forward(self, x):
        return self.block(x)


class DecoderBlock(nn.Module):
    """Upsampling -> Concatenation with Skip Connection -> ConvBlock"""
    def __init__(self, in_channels, skip_channels, out_channels):
        super().__init__()
        self.conv = ConvBlock(in_channels + skip_channels, out_channels)

    def forward(self, x, skip=None):
        x = F.interpolate(x, scale_factor=2, mode="bilinear", align_corners=True)
        if skip is not None:
            if x.shape[2:] != skip.shape[2:]:
                x = F.interpolate(x, size=skip.shape[2:], mode="bilinear", align_corners=True)
            x = torch.cat([x, skip], dim=1)
        return self.conv(x)


class NativeResNet34UNet(nn.Module):
    """Standalone U-Net using torchvision ResNet34 encoder for 4-channel / 3-channel input."""
    def __init__(self, in_channels=4, num_classes=6, pretrained=True):
        super().__init__()
        import torchvision.models as models

        weights = models.ResNet34_Weights.DEFAULT if pretrained else None
        resnet = models.resnet34(weights=weights)

        # Adapt first conv layer for in_channels (e.g., 4 bands: RGB + NIR)
        if in_channels != 3:
            old_conv = resnet.conv1
            new_conv = nn.Conv2d(
                in_channels, old_conv.out_channels,
                kernel_size=old_conv.kernel_size,
                stride=old_conv.stride,
                padding=old_conv.padding,
                bias=old_conv.bias is not None
            )
            with torch.no_grad():
                # Copy RGB weights and initialize extra channels with mean of RGB channels
                new_conv.weight[:, :3, :, :] = old_conv.weight
                if in_channels > 3:
                    for c in range(3, in_channels):
                        new_conv.weight[:, c:c+1, :, :] = old_conv.weight.mean(dim=1, keepdim=True)
            resnet.conv1 = new_conv

        # Encoder stages
        self.encoder = nn.Module()
        self.encoder.init_block = nn.Sequential(resnet.conv1, resnet.bn1, resnet.relu)  # /2 (64 ch)
        self.encoder.maxpool = resnet.maxpool                                           # /4 (64 ch)
        self.encoder.layer1 = resnet.layer1                                             # /4 (64 ch)
        self.encoder.layer2 = resnet.layer2                                             # /8 (128 ch)
        self.encoder.layer3 = resnet.layer3                                             # /16 (256 ch)
        self.encoder.layer4 = resnet.layer4                                             # /32 (512 ch)

        # Decoder blocks: 512->256, 256->128, 128->64, 64->32, 32->16
        self.dec4 = DecoderBlock(512, 256, 256)
        self.dec3 = DecoderBlock(256, 128, 128)
        self.dec2 = DecoderBlock(128, 64, 64)
        self.dec1 = DecoderBlock(64, 64, 32)
        self.dec0 = DecoderBlock(32, 0, 16)

        self.segmentation_head = nn.Conv2d(16, num_classes, kernel_size=1)

    def forward(self, x):
        # Stage 0: 256x256 -> 128x128
        e0 = self.encoder.init_block(x)
        # Stage 1: 128x128 -> 64x64
        e1 = self.encoder.layer1(self.encoder.maxpool(e0))
        # Stage 2: 64x64 -> 32x32
        e2 = self.encoder.layer2(e1)
        # Stage 3: 32x32 -> 16x16
        e3 = self.encoder.layer3(e2)
        # Stage 4 (Bottleneck): 16x16 -> 8x8
        e4 = self.encoder.layer4(e3)

        d4 = self.dec4(e4, e3)   # 8x8 -> 16x16
        d3 = self.dec3(d4, e2)   # 16x16 -> 32x32
        d2 = self.dec2(d3, e1)   # 32x32 -> 64x64
        d1 = self.dec1(d2, e0)   # 64x64 -> 128x128
        d0 = self.dec0(d1, None) # 128x128 -> 256x256

        return self.segmentation_head(d0)


# ==============================================================================
# 2. Main Builder & Two-Phase Scheduling Helpers
# ==============================================================================

def build_unet_resnet34(in_channels=4, num_classes=6, encoder_weights="imagenet", pretrained=True):
    """
    Constructs a U-Net model with a ResNet34 encoder pretrained on ImageNet.
    Uses `segmentation_models_pytorch` if installed, otherwise falls back to `NativeResNet34UNet`.
    """
    if HAS_SMP:
        weights = encoder_weights if pretrained else None
        print(f"[OK] Initializing SMP U-Net (backbone='resnet34', in_channels={in_channels}, classes={num_classes}, weights='{weights}')")
        model = smp.Unet(
            encoder_name="resnet34",
            encoder_weights=weights,
            in_channels=in_channels,
            classes=num_classes,
            activation=None  # Output raw logits for numerical stability with CrossEntropy & Dice
        )
        return model
    else:
        print(f"[!] Warning: segmentation_models_pytorch not found. Using high-performance Native ResNet34 U-Net fallback.")
        return NativeResNet34UNet(in_channels=in_channels, num_classes=num_classes, pretrained=pretrained)


def freeze_encoder(model: nn.Module):
    """Freezes encoder backbone weights for Phase 1 decoder warm-up."""
    encoder = getattr(model, "encoder", None)
    if encoder is not None:
        for param in encoder.parameters():
            param.requires_grad = False
        encoder.eval()
        print("[LOCKED] Encoder backbone frozen (Training decoder & segmentation head only).")
    else:
        print("[!] Warning: Could not locate encoder module to freeze.")


def unfreeze_encoder(model: nn.Module):
    """Unfreezes encoder backbone for Phase 2 full fine-tuning."""
    encoder = getattr(model, "encoder", None)
    if encoder is not None:
        for param in encoder.parameters():
            param.requires_grad = True
        encoder.train()
        print("[UNLOCKED] Encoder backbone unfrozen (Full network end-to-end fine-tuning).")
    else:
        print("[!] Warning: Could not locate encoder module to unfreeze.")


def get_optimizer_and_groups(model: nn.Module, backbone_lr=1e-5, decoder_lr=1e-4, weight_decay=1e-4):
    """
    Returns an AdamW optimizer configured with differential learning rates:
    - Slower learning rate for the pretrained ResNet34 backbone
    - Standard learning rate for the newly initialized decoder / head
    """
    encoder = getattr(model, "encoder", None)
    if encoder is None:
        return torch.optim.AdamW(model.parameters(), lr=decoder_lr, weight_decay=weight_decay)

    encoder_params = list(encoder.parameters())
    encoder_ids = list(map(id, encoder_params))
    decoder_params = [p for p in model.parameters() if id(p) not in encoder_ids]

    param_groups = [
        {"params": [p for p in encoder_params if p.requires_grad], "lr": backbone_lr, "weight_decay": weight_decay},
        {"params": [p for p in decoder_params if p.requires_grad], "lr": decoder_lr, "weight_decay": weight_decay},
    ]
    return torch.optim.AdamW(param_groups)
