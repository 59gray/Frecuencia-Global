from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

REPO_ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = REPO_ROOT / "06_Assets"
OUT_DIR.mkdir(parents=True, exist_ok=True)

W, H = 1200, 675

COLORS = {
    "black": (10, 10, 15),
    "cyan": (0, 229, 255),
    "magenta": (255, 0, 229),
    "green": (184, 255, 0),
    "blue": (74, 107, 255),
    "white": (255, 255, 255),
    "gray": (160, 160, 184),
    "surface": (26, 26, 46),
}

PILLARS = [
    ("GD", "GEOPOLITIK DROP", COLORS["cyan"]),
    ("BB", "BASS & BORDERS", COLORS["magenta"]),
    ("FG", "FRECUENCIA GLOBAL", COLORS["green"]),
    ("BP", "BEHIND THE POLICY", COLORS["blue"]),
]


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    # Fallback chain to keep generation robust across machines.
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def add_grid(draw: ImageDraw.ImageDraw) -> None:
    step = 60
    grid_color = (255, 255, 255, 18)
    for x in range(0, W, step):
        draw.line((x, 0, x, H), fill=grid_color, width=1)
    for y in range(0, H, step):
        draw.line((0, y, W, y), fill=grid_color, width=1)


def glow_line(base: Image.Image, y: int, color: tuple[int, int, int]) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.line((180, y, W - 180, y), fill=(*color, 255), width=4)
    d.ellipse((W // 2 - 12, y - 12, W // 2 + 12, y + 12), fill=(*color, 255))
    blur = layer.filter(ImageFilter.GaussianBlur(8))
    base.alpha_composite(blur)
    base.alpha_composite(layer)


def make_base(accent: tuple[int, int, int]) -> Image.Image:
    img = Image.new("RGBA", (W, H), (*COLORS["black"], 255))
    draw = ImageDraw.Draw(img, "RGBA")
    add_grid(draw)

    # Bracket rails inspired by the FG isotipo language.
    rail_w = 6
    y0, y1 = 90, H - 90
    x_left, x_right = 72, W - 72
    draw.line((x_left, y0, x_left, y1), fill=(*accent, 220), width=rail_w)
    draw.line((x_right, y0, x_right, y1), fill=(*accent, 220), width=rail_w)
    draw.line((x_left, y0, x_left + 34, y0), fill=(*accent, 220), width=rail_w)
    draw.line((x_left, y1, x_left + 34, y1), fill=(*accent, 220), width=rail_w)
    draw.line((x_right - 34, y0, x_right, y0), fill=(*accent, 220), width=rail_w)
    draw.line((x_right - 34, y1, x_right, y1), fill=(*accent, 220), width=rail_w)

    glow_line(img, 250, accent)
    return img


def draw_pill(draw: ImageDraw.ImageDraw, text: str, accent: tuple[int, int, int]) -> None:
    font = load_font(24, bold=True)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x, y = 90, 52
    pad_x, pad_y = 18, 10
    draw.rounded_rectangle(
        (x, y, x + tw + 2 * pad_x, y + th + 2 * pad_y),
        radius=16,
        fill=(*accent, 42),
        outline=(*accent, 235),
        width=2,
    )
    draw.text((x + pad_x, y + pad_y), text, font=font, fill=(*accent, 255))


def save_post_template(code: str, name: str, accent: tuple[int, int, int]) -> Path:
    img = make_base(accent)
    draw = ImageDraw.Draw(img, "RGBA")

    draw_pill(draw, f"[{name}]", accent)

    h1 = load_font(72, bold=True)
    h2 = load_font(34, bold=False)
    meta = load_font(22, bold=False)

    draw.text((180, 310), "TITULAR PRINCIPAL", font=h1, fill=(*COLORS["white"], 255))
    draw.text((180, 390), "Subtitulo o dato clave en una linea.", font=h2, fill=(*COLORS["gray"], 255))
    draw.text((180, 590), "Frecuencia Global | @frec_global", font=meta, fill=(*COLORS["gray"], 220))

    out = OUT_DIR / f"FG_{code}_Template_Post_XBase_v1.png"
    img.convert("RGB").save(out, "PNG")
    return out


def save_thread_template(code: str, name: str, accent: tuple[int, int, int]) -> Path:
    img = make_base(accent)
    draw = ImageDraw.Draw(img, "RGBA")

    draw_pill(draw, f"[{name}] THREAD", accent)

    h1 = load_font(64, bold=True)
    h2 = load_font(30, bold=False)
    mono = load_font(24, bold=True)

    draw.text((180, 312), "THREAD VISUAL", font=h1, fill=(*COLORS["white"], 255))
    draw.text((180, 386), "Dato / mapa / grafico para tweet de soporte", font=h2, fill=(*COLORS["gray"], 255))

    # Placeholder boxes for data labels.
    for i in range(3):
        x = 180 + i * 250
        draw.rounded_rectangle((x, 470, x + 220, 540), radius=12, outline=(*accent, 200), width=2)
        draw.text((x + 16, 494), f"DATO {i+1}", font=mono, fill=(*accent, 255))

    out = OUT_DIR / f"FG_{code}_Template_Thread_XBase_v1.png"
    img.convert("RGB").save(out, "PNG")
    return out


def save_close_card() -> Path:
    accent = COLORS["cyan"]
    img = make_base(accent)
    draw = ImageDraw.Draw(img, "RGBA")

    h1 = load_font(68, bold=True)
    h2 = load_font(34, bold=False)

    draw.text((180, 300), "SIGUE LA FRECUENCIA", font=h1, fill=(*COLORS["white"], 255))
    draw.text((180, 388), "@frec_global | frecuenciaglobal.vercel.app", font=h2, fill=(*COLORS["gray"], 255))

    out = OUT_DIR / "FG_GN_Template_ThreadClose_X_v1.png"
    img.convert("RGB").save(out, "PNG")
    return out


def main() -> None:
    generated = []
    for code, name, accent in PILLARS:
        generated.append(save_post_template(code, name, accent))
        generated.append(save_thread_template(code, name, accent))
    generated.append(save_close_card())

    print("Generated templates:")
    for p in generated:
        print(f"- {p.as_posix()}")


if __name__ == "__main__":
    main()
