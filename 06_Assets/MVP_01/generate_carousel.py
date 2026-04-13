"""Generate MVP_01 carousel slides per VisualBrief spec."""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1080, 1350
SAFE = 80

FONTS = Path(__file__).parent / "_fonts"
BEBAS = str(FONTS / "BebasNeue-Regular.ttf")
SPACE = str(FONTS / "SpaceGrotesk-Regular.ttf")
SPACE_BOLD = str(FONTS / "SpaceGrotesk-Bold.ttf")
JETBRAINS = str(FONTS / "JetBrainsMono-Regular.ttf")

BG_DEEP = (10, 10, 15)
BG_GRAFITO = (26, 26, 46)
CYAN = (0, 229, 255)
GREEN = (184, 255, 0)
WHITE = (255, 255, 255)
GRAY = (160, 160, 184)

OUT = Path(__file__).parent


def _font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def _center_x(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> int:
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    return (W - tw) // 2


def _draw_freq_line(img: Image.Image, y: int, color: tuple, alpha: int = 102):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.line([(SAFE, y), (W - SAFE, y)], fill=(*color, alpha), width=2)
    segments = [(SAFE + 80, y - 12, SAFE + 120, y + 12),
                (W // 2 - 40, y - 18, W // 2 + 40, y + 18),
                (W - SAFE - 120, y - 10, W - SAFE - 80, y + 10)]
    for x1, y1, x2, y2 in segments:
        d.line([(x1, y1), ((x1 + x2) // 2, y - 25), (x2, y2)], fill=(*color, alpha), width=2)
    img.paste(Image.alpha_composite(Image.new("RGBA", img.size, (0, 0, 0, 0)), overlay), mask=overlay)


def _draw_glow_text(img: Image.Image, draw: ImageDraw.ImageDraw, pos: tuple, text: str,
                     font: ImageFont.FreeTypeFont, color: tuple, glow_radius: int = 12):
    glow_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow_layer)
    gd.text(pos, text, font=font, fill=(*color, 77))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(glow_radius))
    img.paste(Image.alpha_composite(Image.new("RGBA", img.size, (0, 0, 0, 0)), glow_layer), mask=glow_layer)
    draw.text(pos, text, font=font, fill=color)


def _draw_grid(img: Image.Image, alpha: int = 20):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    step = 60
    for x in range(0, W, step):
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, alpha), width=1)
    for y in range(0, H, step):
        d.line([(0, y), (W, y)], fill=(255, 255, 255, alpha), width=1)
    img.paste(Image.alpha_composite(Image.new("RGBA", img.size, (0, 0, 0, 0)), overlay), mask=overlay)


def _draw_badge(draw: ImageDraw.ImageDraw, text: str, cx: int, cy: int,
                font: ImageFont.FreeTypeFont, text_color: tuple, border_color: tuple):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pad_x, pad_y = 20, 12
    x1 = cx - tw // 2 - pad_x
    y1 = cy - th // 2 - pad_y
    x2 = cx + tw // 2 + pad_x
    y2 = cy + th // 2 + pad_y
    draw.rectangle([x1, y1, x2, y2], outline=border_color, width=2)
    draw.text((cx - tw // 2, cy - th // 2), text, font=font, fill=text_color)


def _draw_brackets(draw: ImageDraw.ImageDraw, x1: int, y1: int, x2: int, y2: int,
                   color: tuple, alpha_color: tuple | None = None, size: int = 20):
    c = alpha_color or color
    draw.line([(x1, y1), (x1 + size, y1)], fill=c, width=3)
    draw.line([(x1, y1), (x1, y1 + size)], fill=c, width=3)
    draw.line([(x2, y1), (x2 - size, y1)], fill=c, width=3)
    draw.line([(x2, y1), (x2, y1 + size)], fill=c, width=3)
    draw.line([(x1, y2), (x1 + size, y2)], fill=c, width=3)
    draw.line([(x1, y2), (x1, y2 - size)], fill=c, width=3)
    draw.line([(x2, y2), (x2 - size, y2)], fill=c, width=3)
    draw.line([(x2, y2), (x2, y2 - size)], fill=c, width=3)


def _draw_nodo(draw: ImageDraw.ImageDraw, cx: int, cy: int, color: tuple, r: int = 18):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=2)
    draw.ellipse([cx - r // 3, cy - r // 3, cx + r // 3, cy + r // 3], fill=color)
    for dx, dy in [(-r * 2, -r), (r * 2, r), (-r * 2, r)]:
        draw.line([(cx, cy), (cx + dx, cy + dy)], fill=color, width=1)


def slide_01():
    img = Image.new("RGBA", (W, H), BG_DEEP)
    draw = ImageDraw.Draw(img)

    hero_font = _font(BEBAS, 120)
    hero_text = "MÁS DEL 95%"
    hx = _center_x(draw, hero_text, hero_font)
    hy = 320

    _draw_freq_line(img, hy + 55, CYAN, alpha=102)
    _draw_glow_text(img, draw, (hx, hy), hero_text, hero_font, CYAN)

    sub_font = _font(SPACE_BOLD, 32)
    line1 = "DEL TRÁFICO INTERCONTINENTAL"
    line2 = "VIAJA POR CABLES SUBMARINOS"
    draw.text((_center_x(draw, line1, sub_font), hy + 150), line1, font=sub_font, fill=WHITE)
    draw.text((_center_x(draw, line2, sub_font), hy + 195), line2, font=sub_font, fill=WHITE)

    sub2_font = _font(SPACE, 22)
    sub2 = "No por satélites."
    draw.text((_center_x(draw, sub2, sub2_font), hy + 280), sub2, font=sub2_font, fill=GRAY)

    return img.convert("RGB")


def slide_02():
    img = Image.new("RGBA", (W, H), BG_DEEP)
    draw = ImageDraw.Draw(img)
    for y in range(H):
        ratio = y / H
        r = int(BG_DEEP[0] + (BG_GRAFITO[0] - BG_DEEP[0]) * ratio)
        g = int(BG_DEEP[1] + (BG_GRAFITO[1] - BG_DEEP[1]) * ratio)
        b = int(BG_DEEP[2] + (BG_GRAFITO[2] - BG_DEEP[2]) * ratio)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    hero_font = _font(BEBAS, 88)
    hero_text = "MAR ROJO"
    draw.text((_center_x(draw, hero_text, hero_font), 340), hero_text, font=hero_font, fill=CYAN)

    sub_font = _font(SPACE_BOLD, 26)
    sub_text = ">90% de comunicaciones Europa–Asia"
    draw.text((_center_x(draw, sub_text, sub_font), 460), sub_text, font=sub_font, fill=WHITE)
    sub2 = "cruzan por aquí"
    draw.text((_center_x(draw, sub2, sub_font), 500), sub2, font=sub_font, fill=WHITE)

    badge_font = _font(JETBRAINS, 16)
    badge_text = "3 CABLES CORTADOS / FEB 2024"
    _draw_badge(draw, badge_text, W // 2, 620, badge_font, CYAN, CYAN)

    bbox = draw.textbbox((0, 0), badge_text, badge_font)
    tw = bbox[2] - bbox[0]
    pad = 30
    bx1 = W // 2 - tw // 2 - pad - 20
    by1 = 620 - 28 - 15
    bx2 = W // 2 + tw // 2 + pad + 20
    by2 = 620 + 28 + 15
    _draw_brackets(draw, bx1, by1, bx2, by2, CYAN)

    return img.convert("RGB")


def slide_03():
    img = Image.new("RGBA", (W, H), BG_DEEP)
    _draw_grid(img, alpha=20)
    draw = ImageDraw.Draw(img)

    hero_font = _font(BEBAS, 120)
    hero_text = "25%"
    hx = _center_x(draw, hero_text, hero_font)
    hy = 320
    _draw_glow_text(img, draw, (hx, hy), hero_text, hero_font, CYAN)

    sub_font = _font(SPACE_BOLD, 28)
    sub = "DEL TRÁFICO EUROPA–ASIA AFECTADO"
    draw.text((_center_x(draw, sub, sub_font), hy + 140), sub, font=sub_font, fill=WHITE)

    note_font = _font(SPACE, 20)
    note = "Microsoft Azure confirmó latencia elevada"
    draw.text((_center_x(draw, note, note_font), hy + 210), note, font=note_font, fill=GRAY)

    badge_font = _font(JETBRAINS, 15)
    badge = "HASTA +60 MS DE RETRASO / RUTA ALTERNATIVA"
    _draw_badge(draw, badge, W // 2, hy + 320, badge_font, GREEN, GREEN)

    return img.convert("RGB")


def slide_04():
    img = Image.new("RGBA", (W, H), BG_GRAFITO)
    draw = ImageDraw.Draw(img)

    hero_font = _font(BEBAS, 72)
    hero = "MAR BÁLTICO / NOV 2024"
    draw.text((_center_x(draw, hero, hero_font), 280), hero, font=hero_font, fill=CYAN)

    cite_font = _font(SPACE, 24)
    cite = "\"Nadie cree que hayan sido"
    cite2 = "cortados accidentalmente.\""
    draw.text((_center_x(draw, cite, cite_font), 440), cite, font=cite_font, fill=WHITE)
    draw.text((_center_x(draw, cite2, cite_font), 480), cite2, font=cite_font, fill=WHITE)

    attr_font = _font(JETBRAINS, 14)
    attr = "— Boris Pistorius, Ministro de Defensa de Alemania"
    draw.text((_center_x(draw, attr, attr_font), 540), attr, font=attr_font, fill=GRAY)

    badge_font = _font(JETBRAINS, 16)
    _draw_badge(draw, "2 CABLES CORTADOS", W // 2, 660, badge_font, CYAN, CYAN)

    _draw_nodo(draw, W - SAFE - 40, H - SAFE - 40, CYAN)

    return img.convert("RGB")


def slide_05():
    img = Image.new("RGBA", (W, H), BG_DEEP)
    draw = ImageDraw.Draw(img)

    hero_font = _font(BEBAS, 58)
    l1 = "LA PRÓXIMA VEZ QUE"
    l2 = "UN STREAM SE CONGELE"
    draw.text((_center_x(draw, l1, hero_font), 380), l1, font=hero_font, fill=WHITE)
    draw.text((_center_x(draw, l2, hero_font), 450), l2, font=hero_font, fill=WHITE)

    l3 = "PUEDE QUE NO SEA"
    l4 = "TU WIFI."
    draw.text((_center_x(draw, l3, hero_font), 550), l3, font=hero_font, fill=CYAN)
    draw.text((_center_x(draw, l4, hero_font), 620), l4, font=hero_font, fill=CYAN)

    _draw_freq_line(img, 780, CYAN, alpha=77)

    wm_font = _font(SPACE_BOLD, 18)
    wm = "FRECUENCIA GLOBAL"
    draw.text((_center_x(draw, wm, wm_font), 850), wm, font=wm_font, fill=GRAY)

    return img.convert("RGB")


def main():
    generators = [slide_01, slide_02, slide_03, slide_04, slide_05]
    for i, gen in enumerate(generators, 1):
        img = gen()
        name = f"FG_MVP_01_GD_CAR_S{i:02d}_1080x1350.png"
        path = OUT / name
        img.save(str(path), "PNG", optimize=True)
        print(f"[OK] {name} — {img.size[0]}x{img.size[1]} — {path.stat().st_size // 1024} KB")
    print(f"\nAll 5 slides saved to: {OUT}")


if __name__ == "__main__":
    main()
