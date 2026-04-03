from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont


REPO_ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = REPO_ROOT / "04_Produccion" / "linkedin_assets"
STATIC_DIR = REPO_ROOT / "static"

BG = "#0A0A0F"
SURFACE = "#11141C"
GRID = "#172130"
CYAN = "#15DDF4"
WHITE = "#F4F7FB"
MUTED = "#9EA7BC"


def rgba(hex_value: str, alpha: int = 255) -> tuple[int, int, int, int]:
    hex_value = hex_value.lstrip("#")
    return tuple(int(hex_value[i : i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


FONT_BOLD = font(STATIC_DIR / "SpaceGrotesk-Bold.ttf", 86)
FONT_SEMI = font(STATIC_DIR / "SpaceGrotesk-SemiBold.ttf", 34)


def add_grid(base: Image.Image, step: int, alpha: int) -> None:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    color = rgba(GRID, alpha)
    w, h = base.size
    for x in range(0, w, step):
        draw.line((x, 0, x, h), fill=color, width=1)
    for y in range(0, h, step):
        draw.line((0, y, w, y), fill=color, width=1)
    base.alpha_composite(overlay)


def add_corner_brackets(base: Image.Image, color: str, margin: int, size: int, width: int) -> None:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    fill = rgba(color, 230)
    w, h = base.size
    draw.line((margin, margin + size, margin, margin), fill=fill, width=width)
    draw.line((margin, margin, margin + size, margin), fill=fill, width=width)
    draw.line((w - margin - size, h - margin, w - margin, h - margin), fill=fill, width=width)
    draw.line((w - margin, h - margin - size, w - margin, h - margin), fill=fill, width=width)
    base.alpha_composite(overlay)


def rounded_line(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], fill: str, width: int) -> None:
    draw.line(points, fill=fill, width=width, joint="curve")
    radius = width // 2
    for x, y in points:
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=fill)


def draw_isotipo(draw: ImageDraw.ImageDraw, cx: int, cy: int, scale: float) -> None:
    bracket_w = int(16 * scale)
    gap = int(86 * scale)
    height = int(96 * scale)
    line_w = int(16 * scale)
    node_r = int(28 * scale)
    arm = int(30 * scale)

    x1 = cx - gap
    x2 = cx + gap
    y1 = cy - height
    y2 = cy + height

    rounded_line(draw, [(x1, y1), (x1 - arm, y1), (x1 - arm, y2), (x1, y2)], CYAN, bracket_w)
    rounded_line(draw, [(x2, y1), (x2 + arm, y1), (x2 + arm, y2), (x2, y2)], CYAN, bracket_w)
    rounded_line(draw, [(cx - int(76 * scale), cy), (cx + int(76 * scale), cy)], CYAN, line_w)
    draw.ellipse((cx - node_r, cy - node_r, cx + node_r, cy + node_r), fill=CYAN)


def make_logo() -> Path:
    size = 400
    base = Image.new("RGBA", (size, size), rgba(BG))
    add_grid(base, 40, 62)

    glow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.rounded_rectangle((38, 38, size - 38, size - 38), radius=42, fill=rgba(CYAN, 22))
    glow = glow.filter(ImageFilter.GaussianBlur(18))
    base.alpha_composite(glow)

    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rounded_rectangle((36, 36, size - 36, size - 36), radius=42, fill=rgba(SURFACE, 248))
    draw_isotipo(draw, size // 2, size // 2, 1.05)
    base.alpha_composite(overlay)

    out = OUT_DIR / "fg_linkedin_profile_400x400.png"
    base.save(out)
    return out


def make_banner() -> Path:
    width, height = 1584, 396
    base = Image.new("RGBA", (width, height), rgba(BG))
    add_grid(base, 80, 48)
    add_corner_brackets(base, CYAN, margin=24, size=66, width=5)

    glow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.rounded_rectangle((240, 110, width - 240, 282), radius=24, fill=rgba(CYAN, 10))
    glow = glow.filter(ImageFilter.GaussianBlur(26))
    base.alpha_composite(glow)

    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    wordmark = "FRECUENCIA GLOBAL"
    bbox = draw.textbbox((0, 0), wordmark, font=FONT_BOLD)
    text_w = bbox[2] - bbox[0]
    tx = (width - text_w) // 2
    ty = 84
    draw.text((tx, ty), wordmark, font=FONT_BOLD, fill=WHITE)

    line_y = 210
    x1, x2 = 260, width - 260
    rounded_line(draw, [(x1, line_y), (x2, line_y)], CYAN, 8)
    node_r = 14
    cx = width // 2
    draw.ellipse((cx - node_r, line_y - node_r, cx + node_r, line_y + node_r), fill=CYAN)

    tagline = "ANALISIS INTERNACIONAL CON PULSO ELECTRONICO"
    tb = draw.textbbox((0, 0), tagline, font=FONT_SEMI)
    tagline_w = tb[2] - tb[0]
    draw.text(((width - tagline_w) // 2, 256), tagline, font=FONT_SEMI, fill=MUTED)

    base.alpha_composite(overlay)
    out = OUT_DIR / "fg_linkedin_banner_1584x396.png"
    base.save(out)
    return out


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    logo = make_logo()
    banner = make_banner()
    print(logo)
    print(banner)


if __name__ == "__main__":
    main()
