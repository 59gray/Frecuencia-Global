from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

root = Path(r"C:/Users/farid/Documents/Frecuencia Global")
assets = root / "Frecuencia_Global_Assets_Base" / "assets"
assets.mkdir(parents=True, exist_ok=True)

# Brand colors
C_BASE = (10, 10, 15, 255)      # #0A0A0F
C_SURFACE = (26, 26, 46, 217)    # #1A1A2E @ 85%
C_CYAN = (0, 229, 255, 255)      # #00E5FF
C_GREEN = (184, 255, 0, 255)     # #B8FF00
C_WHITE = (255, 255, 255, 255)

# ---------- 1) TikTok profile 200x200 ----------
profile_src = assets / "fg_isotipo_512.png"
profile_out = assets / "fg_tiktok_profile_200x200.png"

canvas = Image.new("RGBA", (200, 200), C_BASE)
if profile_src.exists():
    icon = Image.open(profile_src).convert("RGBA")
    icon.thumbnail((118, 118), Image.Resampling.LANCZOS)

    # Cyan glow behind icon
    glow = Image.new("RGBA", (200, 200), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    cx, cy = 100, 100
    gdraw.ellipse((cx-54, cy-54, cx+54, cy+54), fill=(0, 229, 255, 95))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=8))
    canvas.alpha_composite(glow)

    ix = (200 - icon.width) // 2
    iy = (200 - icon.height) // 2
    canvas.alpha_composite(icon, (ix, iy))

canvas.save(profile_out, "PNG")

# ---------- 2) TikTok cover template 1080x1920 ----------
cover_out = assets / "fg_tiktok_cover_1080x1920.png"
cover_guides_out = assets / "fg_tiktok_cover_1080x1920_guides.png"
cover = Image.new("RGBA", (1080, 1920), C_BASE)
d = ImageDraw.Draw(cover)

# Subtle grid (editorial look)
for x in range(0, 1081, 40):
    d.line([(x, 0), (x, 1920)], fill=(255, 255, 255, 10), width=1)
for y in range(0, 1921, 40):
    d.line([(0, y), (1080, y)], fill=(255, 255, 255, 10), width=1)

# Soft cyan ambience
rad = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
rd = ImageDraw.Draw(rad)
rd.ellipse((-220, 1120, 620, 1960), fill=(0, 229, 255, 42))
rad = rad.filter(ImageFilter.GaussianBlur(radius=30))
cover.alpha_composite(rad)

# Pill/tag placeholder (top-left safe area)
d.rounded_rectangle((60, 220, 340, 268), radius=14, fill=(26, 26, 46, 220), outline=(0, 229, 255, 180), width=2)

# Accent frequency line under title zone
d.rounded_rectangle((120, 1010, 560, 1016), radius=3, fill=C_GREEN)

# Lower third safe bar
d.rounded_rectangle((60, 1480, 860, 1600), radius=12, fill=C_SURFACE)

cover.save(cover_out, "PNG")

# Safe-zone guide version for QA only
cover_guides = cover.copy()
g = ImageDraw.Draw(cover_guides)
g.rectangle((0, 0, 1080, 200), fill=(255, 0, 0, 22))
g.rectangle((0, 1640, 1080, 1920), fill=(255, 0, 0, 22))
g.rectangle((980, 800, 1080, 1300), fill=(255, 0, 0, 22))
cover_guides.save(cover_guides_out, "PNG")

# ---------- 3) Print validation ----------
for p in [profile_out, cover_out, cover_guides_out]:
    img = Image.open(p)
    kb = p.stat().st_size / 1024
    print(f"{p.name} | {img.width}x{img.height} | {kb:.2f}KB")
