from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter


REPO_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = REPO_ROOT / "06_Assets"

BG = "#0A0A0F"
SURFACE = "#11141C"
GRID = "#172130"
RING = "#182434"
WHITE = "#F4F7FB"
GRAY = "#8F97AA"
CYAN = "#15DDF4"
MAGENTA = "#FF00E5"
ACID = "#B8FF00"
BLUE = "#4A6BFF"


def hex_rgba(value: str, alpha: int = 255) -> tuple[int, int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def rounded_line(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], fill: str, width: int) -> None:
    draw.line(points, fill=fill, width=width, joint="curve")
    r = width // 2
    for x, y in points:
        draw.ellipse((x - r, y - r, x + r, y + r), fill=fill)


def add_grid(base: Image.Image, step: int, alpha: int) -> None:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    color = hex_rgba(GRID, alpha)
    w, h = base.size
    for x in range(0, w, step):
        draw.line((x, 0, x, h), fill=color, width=1)
    for y in range(0, h, step):
        draw.line((0, y, w, y), fill=color, width=1)
    base.alpha_composite(overlay)


def add_corner_brackets(base: Image.Image, color: str, margin: int, size: int, width: int, alpha: int = 255) -> None:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    fill = hex_rgba(color, alpha)
    w, h = base.size
    # top-left
    draw.line((margin, margin + size, margin, margin), fill=fill, width=width)
    draw.line((margin, margin, margin + size, margin), fill=fill, width=width)
    # bottom-right
    draw.line((w - margin - size, h - margin, w - margin, h - margin), fill=fill, width=width)
    draw.line((w - margin, h - margin - size, w - margin, h - margin), fill=fill, width=width)
    base.alpha_composite(overlay)


def add_glow(base: Image.Image, box: tuple[int, int, int, int], color: str, blur: int, alpha: int) -> None:
    glow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    draw.rounded_rectangle(box, radius=(box[2] - box[0]) // 8, fill=hex_rgba(color, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(glow)


def draw_fg_isotipo(draw: ImageDraw.ImageDraw, cx: int, cy: int, scale: float) -> None:
    width = int(18 * scale)
    height = int(96 * scale)
    gap = int(86 * scale)
    radius = int(16 * scale)
    line_w = int(16 * scale)
    node_r = int(28 * scale)

    x1 = cx - gap
    x2 = cx + gap
    y1 = cy - height
    y2 = cy + height

    # left bracket
    rounded_line(draw, [(x1, y1), (x1 - int(30 * scale), y1), (x1 - int(30 * scale), y2), (x1, y2)], CYAN, width)
    # right bracket
    rounded_line(draw, [(x2, y1), (x2 + int(30 * scale), y1), (x2 + int(30 * scale), y2), (x2, y2)], CYAN, width)

    rounded_line(draw, [(cx - int(76 * scale), cy), (cx + int(76 * scale), cy)], CYAN, line_w)
    draw.ellipse((cx - node_r, cy - node_r, cx + node_r, cy + node_r), fill=CYAN)


def draw_icon_grid(draw: ImageDraw.ImageDraw, cx: int, cy: int, color: str, scale: float) -> None:
    size = int(56 * scale)
    gap = int(22 * scale)
    stroke = int(9 * scale)
    radius = int(12 * scale)
    for row in (-1, 1):
        for col in (-1, 1):
            x = cx + col * (size // 2 + gap)
            y = cy + row * (size // 2 + gap)
            draw.rounded_rectangle(
                (x - size // 2, y - size // 2, x + size // 2, y + size // 2),
                radius=radius,
                outline=color,
                width=stroke,
            )


def draw_icon_news(draw: ImageDraw.ImageDraw, cx: int, cy: int, color: str, scale: float) -> None:
    stroke = int(14 * scale)
    rounded_line(draw, [(cx - int(132 * scale), cy), (cx + int(132 * scale), cy)], color, stroke)
    rounded_line(draw, [(cx - int(92 * scale), cy - int(74 * scale)), (cx + int(92 * scale), cy - int(74 * scale))], color, int(10 * scale))
    rounded_line(draw, [(cx - int(92 * scale), cy + int(74 * scale)), (cx + int(92 * scale), cy + int(74 * scale))], color, int(10 * scale))
    r = int(30 * scale)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color)


def draw_icon_policy(draw: ImageDraw.ImageDraw, cx: int, cy: int, color: str, scale: float) -> None:
    stroke = int(12 * scale)
    w = int(170 * scale)
    h = int(210 * scale)
    radius = int(20 * scale)
    draw.rounded_rectangle((cx - w // 2, cy - h // 2, cx + w // 2, cy + h // 2), radius=radius, outline=color, width=stroke)
    for offset in (-52, 0, 52):
        rounded_line(draw, [(cx - int(52 * scale), cy + offset), (cx + int(52 * scale), cy + offset)], color, int(10 * scale))


def draw_icon_borders(draw: ImageDraw.ImageDraw, cx: int, cy: int, color: str, scale: float) -> None:
    stroke = int(14 * scale)
    rounded_line(
        draw,
        [(cx - int(120 * scale), cy + int(90 * scale)), (cx - int(24 * scale), cy - int(6 * scale)), (cx + int(94 * scale), cy - int(122 * scale))],
        color,
        stroke,
    )
    rounded_line(
        draw,
        [(cx - int(70 * scale), cy - int(122 * scale)), (cx + int(18 * scale), cy - int(34 * scale)), (cx + int(128 * scale), cy + int(76 * scale))],
        color,
        stroke,
    )
    for x, y in [
        (cx - int(120 * scale), cy + int(90 * scale)),
        (cx + int(94 * scale), cy - int(122 * scale)),
        (cx - int(70 * scale), cy - int(122 * scale)),
        (cx + int(128 * scale), cy + int(76 * scale)),
    ]:
        r = int(14 * scale)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=color)


def draw_icon_maps(draw: ImageDraw.ImageDraw, cx: int, cy: int, color: str, scale: float) -> None:
    stroke = int(12 * scale)
    r = int(108 * scale)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=color, width=stroke)
    rounded_line(draw, [(cx - int(140 * scale), cy), (cx + int(140 * scale), cy)], color, int(10 * scale))
    rounded_line(draw, [(cx, cy - int(140 * scale)), (cx, cy + int(140 * scale))], color, int(10 * scale))
    node_r = int(28 * scale)
    draw.ellipse((cx - node_r, cy - node_r, cx + node_r, cy + node_r), fill=color)


def draw_icon_about(draw: ImageDraw.ImageDraw, cx: int, cy: int, scale: float) -> None:
    draw_fg_isotipo(draw, cx, cy, scale)


def create_avatar() -> Path:
    size = 400
    image = Image.new("RGBA", (size, size), hex_rgba(BG))
    add_grid(image, 40, 70)

    panel = (36, 36, size - 36, size - 36)
    add_glow(image, panel, CYAN, blur=24, alpha=24)

    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rounded_rectangle(panel, radius=44, fill=hex_rgba(SURFACE, 248))
    draw_fg_isotipo(draw, size // 2, size // 2, 1.05)
    image.alpha_composite(overlay)

    path = OUTPUT_DIR / "FG_IG_Avatar_Profile_v2.png"
    image.save(path)
    return path


def create_highlight(name: str, color: str, icon_fn) -> Path:
    width, height = 1080, 1920
    image = Image.new("RGBA", (width, height), hex_rgba(BG))
    add_grid(image, 72, 52)
    add_corner_brackets(image, color, margin=58, size=96, width=8, alpha=210)

    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    cx, cy = width // 2, height // 2
    safe_r = 330
    panel = (cx - 270, cy - 270, cx + 270, cy + 270)
    add_glow(image, panel, color, blur=40, alpha=20)

    draw.ellipse((cx - safe_r, cy - safe_r, cx + safe_r, cy + safe_r), outline=hex_rgba(RING, 255), width=6)
    icon_fn(draw, cx, cy, color, 1.0) if icon_fn is not draw_icon_about else draw_icon_about(draw, cx, cy, 1.0)

    for dot_x, dot_y in [(196, 346), (876, 532), (284, 1518), (820, 1396)]:
        r = 10
        draw.ellipse((dot_x - r, dot_y - r, dot_x + r, dot_y + r), fill=hex_rgba(color, 220))

    image.alpha_composite(overlay)

    path = OUTPUT_DIR / f"FG_IG_Highlight_{name}_v2.png"
    image.save(path)
    return path


def create_preview(avatar_path: Path, highlight_paths: list[Path]) -> Path:
    card_w, card_h = 1600, 1100
    image = Image.new("RGBA", (card_w, card_h), hex_rgba(BG))
    add_grid(image, 56, 60)
    add_corner_brackets(image, CYAN, margin=36, size=80, width=6, alpha=200)

    avatar = Image.open(avatar_path).convert("RGBA").resize((220, 220))
    image.alpha_composite(avatar, (120, 180))

    y = 210
    x = 420
    labels = ["SERIES", "NEWS", "POLICY", "BORDERS", "MAPS", "ABOUT"]
    for idx, path in enumerate(highlight_paths):
        card = Image.open(path).convert("RGBA").resize((150, 266))
        image.alpha_composite(card, (x + idx * 170, y))

    path = OUTPUT_DIR / "FG_IG_Profile_Refresh_ContactSheet_v1.png"
    image.save(path)
    return path


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    avatar_path = create_avatar()
    highlight_specs = [
        ("Series", CYAN, draw_icon_grid),
        ("News", ACID, draw_icon_news),
        ("Policy", BLUE, draw_icon_policy),
        ("Borders", MAGENTA, draw_icon_borders),
        ("Maps", CYAN, draw_icon_maps),
        ("About", WHITE, draw_icon_about),
    ]
    highlight_paths = [create_highlight(name, color, fn) for name, color, fn in highlight_specs]
    preview_path = create_preview(avatar_path, highlight_paths)

    print("Generated:")
    print(avatar_path)
    for path in highlight_paths:
        print(path)
    print(preview_path)


if __name__ == "__main__":
    main()
