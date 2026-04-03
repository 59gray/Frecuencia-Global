from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageColor, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = ROOT / "06_Assets"
CANVA_DIR = ROOT / "Frecuencia_Global_Activos_Canva_v1"

SOURCE_ICON = CANVA_DIR / "FG_Avatar_Master_v2.png"
OUTPUT_PNG = ASSETS_DIR / "FG_Podcast_Cover_3000x3000_v1.png"
OUTPUT_JPG = ASSETS_DIR / "FG_Podcast_Cover_3000x3000_v1.jpg"
OUTPUT_PREVIEW = ASSETS_DIR / "FG_Podcast_Cover_1400_preview_v1.jpg"

SIZE = 3000
BG = "#080910"
CYAN = "#19E7FF"
MAGENTA = "#FF3FD2"
WHITE = "#F4F6FB"
MUTED = "#A7ACC0"
GRID = "#1B2234"
LIME = "#B8FF00"


def font_path(name: str) -> Path:
    path = Path("C:/Windows/Fonts") / name
    if not path.exists():
        raise FileNotFoundError(f"Font not found: {path}")
    return path


TITLE_FONT = str(font_path("bahnschrift.ttf"))
SUB_FONT = str(font_path("ARIALN.TTF"))
SUB_BOLD_FONT = str(font_path("ARIALNB.TTF"))


def load_icon() -> Image.Image:
    if not SOURCE_ICON.exists():
        raise FileNotFoundError(f"Source icon not found: {SOURCE_ICON}")
    return Image.open(SOURCE_ICON).convert("RGB")


def add_glow_blob(overlay: Image.Image, bbox: tuple[int, int, int, int], color: str, blur: int, alpha: int) -> None:
    blob = Image.new("RGBA", overlay.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(blob)
    rgba = ImageColor.getrgb(color) + (alpha,)
    draw.ellipse(bbox, fill=rgba)
    blob = blob.filter(ImageFilter.GaussianBlur(blur))
    overlay.alpha_composite(blob)


def add_grid(draw: ImageDraw.ImageDraw, size: int) -> None:
    step = 150
    grid_rgba = (27, 34, 52, 135)
    for x in range(0, size + 1, step):
        draw.line((x, 0, x, size), fill=grid_rgba, width=2)
    for y in range(0, size + 1, step):
        draw.line((0, y, size, y), fill=grid_rgba, width=2)


def circular_icon(icon: Image.Image, diameter: int) -> Image.Image:
    resized = icon.resize((diameter, diameter), Image.Resampling.LANCZOS)
    mask = Image.new("L", (diameter, diameter), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, diameter - 1, diameter - 1), fill=255)
    result = Image.new("RGBA", (diameter, diameter), (0, 0, 0, 0))
    result.paste(resized, (0, 0), mask)
    return result


def draw_text_center(draw: ImageDraw.ImageDraw, text: str, y: int, font: ImageFont.FreeTypeFont, fill: str, tracking: int = 0) -> None:
    if tracking <= 0:
        bbox = draw.textbbox((0, 0), text, font=font)
        x = (SIZE - (bbox[2] - bbox[0])) // 2
        draw.text((x, y), text, font=font, fill=fill)
        return

    widths = []
    total = 0
    for char in text:
        bbox = draw.textbbox((0, 0), char, font=font)
        width = bbox[2] - bbox[0]
        widths.append(width)
        total += width
    total += tracking * max(0, len(text) - 1)
    x = (SIZE - total) // 2
    for char, width in zip(text, widths):
        draw.text((x, y), char, font=font, fill=fill)
        x += width + tracking


def build_cover() -> Image.Image:
    base = Image.new("RGBA", (SIZE, SIZE), BG)
    overlay = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))

    add_glow_blob(overlay, (420, 140, 2100, 1400), CYAN, 220, 58)
    add_glow_blob(overlay, (1450, 260, 2720, 1520), MAGENTA, 250, 42)
    add_glow_blob(overlay, (780, 1750, 2280, 2860), CYAN, 260, 36)
    base.alpha_composite(overlay)

    draw = ImageDraw.Draw(base)
    add_grid(draw, SIZE)

    # Side brackets
    bracket_color = ImageColor.getrgb(CYAN) + (235,)
    stroke = 10
    left_x = 210
    right_x = SIZE - 210
    top_y = 520
    bottom_y = SIZE - 520
    arm = 88
    draw.line((left_x, top_y, left_x, bottom_y), fill=bracket_color, width=stroke)
    draw.line((left_x, top_y, left_x + arm, top_y), fill=bracket_color, width=stroke)
    draw.line((left_x, bottom_y, left_x + arm, bottom_y), fill=bracket_color, width=stroke)
    draw.line((right_x, top_y, right_x, bottom_y), fill=bracket_color, width=stroke)
    draw.line((right_x - arm, top_y, right_x, top_y), fill=bracket_color, width=stroke)
    draw.line((right_x - arm, bottom_y, right_x, bottom_y), fill=bracket_color, width=stroke)

    # Top pill
    pill_w, pill_h = 620, 120
    pill_x = (SIZE - pill_w) // 2
    pill_y = 180
    draw.rounded_rectangle((pill_x, pill_y, pill_x + pill_w, pill_y + pill_h), radius=60, fill=MAGENTA)
    pill_font = ImageFont.truetype(SUB_BOLD_FONT, 66)
    draw_text_center(draw, "PODCAST", pill_y + 18, pill_font, WHITE, tracking=8)

    # Icon with glow/ring
    icon = circular_icon(load_icon(), 1220)
    ring_center = SIZE // 2
    ring_y = 430
    ring_bbox = (ring_center - 690, ring_y - 40, ring_center + 690, ring_y + 1340)
    ring_layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    ring_draw = ImageDraw.Draw(ring_layer)
    ring_draw.ellipse(ring_bbox, outline=ImageColor.getrgb(CYAN) + (205,), width=14)
    ring_draw.ellipse((ring_bbox[0] + 46, ring_bbox[1] + 46, ring_bbox[2] - 46, ring_bbox[3] - 46), outline=ImageColor.getrgb(MAGENTA) + (90,), width=4)
    ring_layer = ring_layer.filter(ImageFilter.GaussianBlur(1))
    base.alpha_composite(ring_layer)
    base.alpha_composite(icon, ((SIZE - 1220) // 2, 470))

    # Divider line
    line_y = 1965
    draw.line((520, line_y, SIZE - 520, line_y), fill=ImageColor.getrgb(CYAN) + (220,), width=8)
    draw.ellipse((SIZE // 2 - 18, line_y - 18, SIZE // 2 + 18, line_y + 18), fill=CYAN)

    title_font = ImageFont.truetype(TITLE_FONT, 308)
    draw_text_center(draw, "FRECUENCIA", 2080, title_font, WHITE, tracking=10)
    draw_text_center(draw, "GLOBAL", 2360, title_font, CYAN, tracking=14)

    subtitle_font = ImageFont.truetype(SUB_FONT, 86)
    draw_text_center(draw, "Geopolitica, cultura y actualidad internacional", 2728, subtitle_font, MUTED, tracking=3)

    accent_draw = ImageDraw.Draw(base)
    accent_draw.line((760, 2860, 1100, 2860), fill=ImageColor.getrgb(CYAN) + (255,), width=8)
    accent_draw.line((1230, 2860, 1570, 2860), fill=ImageColor.getrgb(MAGENTA) + (255,), width=8)
    accent_draw.line((1900, 2860, 2240, 2860), fill=ImageColor.getrgb(LIME) + (255,), width=8)

    return base.convert("RGB")


def main() -> None:
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    cover = build_cover()
    cover.save(OUTPUT_PNG, "PNG", optimize=True)
    cover.save(OUTPUT_JPG, "JPEG", quality=95, optimize=True, progressive=True)
    cover.resize((1400, 1400), Image.Resampling.LANCZOS).save(
        OUTPUT_PREVIEW,
        "JPEG",
        quality=92,
        optimize=True,
        progressive=True,
    )

    for path in [OUTPUT_PNG, OUTPUT_JPG, OUTPUT_PREVIEW]:
        size_kb = path.stat().st_size / 1024
        print(f"{path.name} | {size_kb:.1f} KB")


if __name__ == "__main__":
    main()
