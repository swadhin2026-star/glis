from PIL import Image
import numpy as np

# RGB mask
rgb = np.array(Image.open(r"data\segmentation\test_mask\Test_1.png"))
print("RGB mask unique colors (R,G,B):")
if rgb.ndim == 3:
    colors = np.unique(rgb.reshape(-1, rgb.shape[2]), axis=0)
    print(colors)
else:
    print("Not 3D:", np.unique(rgb))

# Pixel-based mask
pixel = np.array(Image.open(r"data\segmentation\pixel_based_mask\test_mask\Test_1.png"))
print("\nPixel-based mask unique values:")
if pixel.ndim == 3:
    colors = np.unique(pixel.reshape(-1, pixel.shape[2]), axis=0)
    print(colors)
else:
    print(np.unique(pixel))
