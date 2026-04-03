"""
Generate pilar-specific overlay variants by hue-shifting the existing
cyan (Geopolitik Drop) overlays to magenta, green, and blue.

Inputs:  Frecuencia_Global_Activos_Canva_v2/FG_Reels_Overlay_Minimal_v1.png
         Frecuencia_Global_Activos_Canva_v2/FG_Reels_Overlay_Full_v1.png
Outputs: 6 new overlays (3 colors × 2 types) in same folder
"""
from pathlib import Path
import numpy as np
from PIL import Image

root = Path(r"C:/Users/farid/Documents/Frecuencia Global")
canva_v2 = root / "Frecuencia_Global_Activos_Canva_v2"

# Source overlays (cyan / Geopolitik Drop)
sources = {
    "Minimal": canva_v2 / "FG_Reels_Overlay_Minimal_v1.png",
    "Full": canva_v2 / "FG_Reels_Overlay_Full_v1.png",
}

# Target pilar variants
pillar_configs = {
    "BB": {"name": "Bass & Borders", "target_hue_deg": 306},      # magenta #FF00E5
    "FG": {"name": "Frecuencia Global", "target_hue_deg": 73},    # green   #B8FF00
    "BP": {"name": "Behind the Policy", "target_hue_deg": 231},   # blue    #4A6BFF
}

CYAN_HUE_DEG = 187.0  # Source cyan #00E5FF


def hue_shift_overlay(src_path: Path, target_hue_deg: float) -> Image.Image:
    """Shift cyan-hued pixels to a new hue while preserving alpha, grays, and greens."""
    img = Image.open(src_path).convert("RGBA")
    arr = np.array(img)

    rgb = arr[:, :, :3].copy()
    alpha = arr[:, :, 3]

    # Convert to HSV via PIL
    hsv_img = Image.fromarray(rgb, "RGB").convert("HSV")
    hsv = np.array(hsv_img).copy()

    h = hsv[:, :, 0].astype(np.float64)  # PIL HSV: H 0-255 maps to 0°-360°
    s = hsv[:, :, 1]

    # Convert degree targets to PIL's 0-255 scale
    cyan_h = CYAN_HUE_DEG * 255.0 / 360.0   # ~132.3
    target_h = target_hue_deg * 255.0 / 360.0
    shift = target_h - cyan_h

    # Circular distance from cyan hue
    h_dist = np.abs(h - cyan_h)
    h_dist = np.minimum(h_dist, 255.0 - h_dist)

    # Mask: near-cyan hue + colored (not gray) + visible
    tolerance = 25.0  # ~35° in real degrees
    mask = (h_dist < tolerance) & (s > 25) & (alpha > 5)

    # Apply shift preserving fractional hue for smooth gradients
    h[mask] = (h[mask] + shift) % 255.0

    hsv[:, :, 0] = np.clip(h, 0, 255).astype(np.uint8)

    # Convert back
    result_rgb = np.array(Image.fromarray(hsv, "HSV").convert("RGB"))
    result = np.dstack([result_rgb, alpha])
    return Image.fromarray(result, "RGBA")


# Generate all variants
print("Generating overlay variants...\n")
generated = []

for pilar_code, config in pillar_configs.items():
    for overlay_type, src_path in sources.items():
        if not src_path.exists():
            print(f"⚠️  Source missing: {src_path.name}")
            continue

        result = hue_shift_overlay(src_path, config["target_hue_deg"])
        out_name = f"FG_Reels_Overlay_{overlay_type}_{pilar_code}_v1.png"
        out_path = canva_v2 / out_name
        result.save(out_path, "PNG", optimize=True)
        kb = out_path.stat().st_size / 1024
        print(f"✅ {out_name} | {result.width}x{result.height} | {kb:.1f}KB | {config['name']}")
        generated.append(out_path)

print(f"\n{'='*60}")
print(f"Total: {len(generated)} overlays generated")
print(f"Location: {canva_v2}")
