"""
Genera el Video Watermark de Frecuencia Global para YouTube.
150x150 px, PNG con transparencia.
Basado en el isotipo existente (fg_isotipo_512.png).
"""

from PIL import Image, ImageFilter
import numpy as np
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Frecuencia_Global_Assets_Base" / "assets" / "fg_isotipo_512.png"
OUT = ROOT / "06_Assets" / "fg_youtube_watermark_150.png"

def make_watermark():
    img = Image.open(SRC).convert("RGBA")
    pixels = np.array(img)

    r, g, b, a = pixels[:,:,0], pixels[:,:,1], pixels[:,:,2], pixels[:,:,3]

    # Detect dark background: pixels where R < 30, G < 30, B < 40
    is_dark = (r < 40) & (g < 40) & (b < 50)

    # Make dark background fully transparent
    pixels[is_dark, 3] = 0

    # For the cyan symbol pixels (remaining visible pixels), 
    # apply ~70% opacity so it's visible but not distracting
    is_visible = ~is_dark & (a > 0)
    pixels[is_visible, 3] = int(255 * 0.70)

    img_clean = Image.fromarray(pixels)

    # Resize to 150x150 with high-quality resampling
    img_150 = img_clean.resize((150, 150), Image.LANCZOS)

    # Ensure output directory exists
    OUT.parent.mkdir(parents=True, exist_ok=True)
    img_150.save(OUT, "PNG", optimize=True)

    size_kb = OUT.stat().st_size / 1024
    print(f"✅ Watermark guardado: {OUT}")
    print(f"   Tamaño: 150×150 px | {size_kb:.1f} KB")


if __name__ == "__main__":
    make_watermark()
