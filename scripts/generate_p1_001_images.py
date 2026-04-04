"""Genera imágenes branded para P1_001 (Cables Submarinos).
- Instagram: 1080x1350
- TikTok: 1080x1920

Usa el Brand Kit de Frecuencia Global:
- Fondo: #0A0A0F
- Acento: #00E5FF (Geopolitik Drop)
- Fuentes: Bebas Neue (títulos), Space Grotesk (body)

Uso:
    python scripts/generate_p1_001_images.py
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

REPO_ROOT = Path(__file__).parent.parent
STATIC = REPO_ROOT / "static"
ASSETS = REPO_ROOT / "06_Assets" / "base" / "assets"
OUTPUT_DIR = REPO_ROOT / "06_Assets" / "P1_001"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Brand colors
BG_COLOR = (10, 10, 15)          # #0A0A0F
SURFACE = (26, 26, 46)           # #1A1A2E
CYAN = (0, 229, 255)             # #00E5FF
WHITE = (255, 255, 255)
GRAY = (160, 160, 184)           # #A0A0B8
MAGENTA = (255, 0, 229)          # #FF00E5

# Fonts
BEBAS = STATIC / "BebasNeue-Regular.ttf"
SPACE_BOLD = STATIC / "SpaceGrotesk-Bold.ttf"
SPACE_REG = STATIC / "SpaceGrotesk-Regular.ttf"
SPACE_MED = STATIC / "SpaceGrotesk-Medium.ttf"

# Content
TITLE_LINE1 = "EL 99% DE INTERNET"
TITLE_LINE2 = "VIAJA POR EL FONDO"
TITLE_LINE3 = "DEL OCÉANO"
SUBTITLE = "No por satélite. Por cables."
PILL = "GEOPOLITIK DROP"
DATA_POINT = "3.5 MILLONES DE KM DE CABLE"
BODY = (
    "Una red de fibra óptica tendida en el fondo\n"
    "del océano conecta todos los continentes.\n"
    "Sin estos cables, internet se apaga."
)
BRAND = "FRECUENCIA GLOBAL"
SOURCE = "Fuente: ICPC, 2024"


def load_font(path, size):
    try:
        return ImageFont.truetype(str(path), size)
    except Exception:
        return ImageFont.load_default()


def draw_glow_line(draw, y, x_start, x_end, color, width=3):
    """Draw a glowing horizontal line."""
    # Glow (wider, semi-transparent)
    glow_color = (*color, 60)
    for offset in range(1, 6):
        draw.line([(x_start, y + offset), (x_end, y + offset)], fill=glow_color[:3], width=1)
        draw.line([(x_start, y - offset), (x_end, y - offset)], fill=glow_color[:3], width=1)
    # Core line
    draw.line([(x_start, y), (x_end, y)], fill=color, width=width)


def draw_pill(draw, text, x, y, font, color):
    """Draw a pill/tag with text."""
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pad_x, pad_y = 16, 6
    # Pill background
    draw.rounded_rectangle(
        [x, y, x + tw + pad_x * 2, y + th + pad_y * 2],
        radius=4, fill=None, outline=color, width=2
    )
    draw.text((x + pad_x, y + pad_y), text, fill=color, font=font)
    return tw + pad_x * 2


def add_logo(img, x, y, size=64):
    """Add the FG isotipo logo."""
    logo_path = ASSETS / "fg_isotipo_512.png"
    if logo_path.exists():
        logo = Image.open(logo_path).convert("RGBA")
        logo = logo.resize((size, size), Image.LANCZOS)
        img.paste(logo, (x, y), logo)
        return True
    return False


def generate_instagram(output_path):
    """Generate 1080x1350 Instagram post image."""
    W, H = 1080, 1350
    img = Image.new("RGB", (W, H), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Fonts
    f_title = load_font(BEBAS, 82)
    f_subtitle = load_font(SPACE_REG, 28)
    f_pill = load_font(SPACE_BOLD, 16)
    f_data = load_font(BEBAS, 48)
    f_body = load_font(SPACE_REG, 22)
    f_brand = load_font(SPACE_BOLD, 18)
    f_source = load_font(SPACE_REG, 14)

    margin = 80
    y = 80

    # Top accent line
    draw_glow_line(draw, y, margin, W - margin, CYAN, 3)
    y += 30

    # Pill
    draw_pill(draw, PILL, margin, y, f_pill, CYAN)
    y += 55

    # Title
    for line in [TITLE_LINE1, TITLE_LINE2, TITLE_LINE3]:
        draw.text((margin, y), line, fill=WHITE, font=f_title)
        bbox = draw.textbbox((margin, y), line, font=f_title)
        y += bbox[3] - bbox[1] + 4
    y += 15

    # Subtitle
    draw.text((margin, y), SUBTITLE, fill=GRAY, font=f_subtitle)
    y += 55

    # Separator
    draw_glow_line(draw, y, margin, W - margin, CYAN, 2)
    y += 40

    # Data point
    draw.text((margin, y), DATA_POINT, fill=CYAN, font=f_data)
    y += 70

    # Body text
    for line in BODY.split("\n"):
        draw.text((margin, y), line, fill=WHITE, font=f_body)
        y += 34
    y += 20

    # Source
    draw.text((margin, y), SOURCE, fill=GRAY, font=f_source)
    y += 40

    # Bottom section
    # Surface card
    card_y = H - 180
    draw.rectangle([0, card_y, W, H], fill=SURFACE)
    draw_glow_line(draw, card_y, 0, W, CYAN, 2)

    # Logo + brand name
    logo_size = 48
    add_logo(img, margin, card_y + 30, logo_size)
    draw.text((margin + logo_size + 16, card_y + 38), BRAND, fill=CYAN, font=f_brand)
    draw.text((margin, card_y + 90), "Análisis internacional con pulso electrónico", fill=GRAY, font=f_source)

    # Bottom accent line
    draw.rectangle([0, H - 6, W, H], fill=CYAN)

    img.save(output_path, quality=95)
    print(f"[OK] Instagram: {output_path}")
    return output_path


def generate_tiktok(output_path):
    """Generate 1080x1920 TikTok image."""
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Fonts
    f_title = load_font(BEBAS, 90)
    f_subtitle = load_font(SPACE_REG, 30)
    f_pill = load_font(SPACE_BOLD, 18)
    f_data = load_font(BEBAS, 52)
    f_body = load_font(SPACE_REG, 24)
    f_brand = load_font(SPACE_BOLD, 20)
    f_source = load_font(SPACE_REG, 16)

    margin = 80
    y = 160

    # Top accent line
    draw_glow_line(draw, y - 40, margin, W - margin, CYAN, 3)

    # Pill
    draw_pill(draw, PILL, margin, y, f_pill, CYAN)
    y += 65

    # Title
    for line in [TITLE_LINE1, TITLE_LINE2, TITLE_LINE3]:
        draw.text((margin, y), line, fill=WHITE, font=f_title)
        bbox = draw.textbbox((margin, y), line, font=f_title)
        y += bbox[3] - bbox[1] + 6
    y += 20

    # Subtitle
    draw.text((margin, y), SUBTITLE, fill=GRAY, font=f_subtitle)
    y += 70

    # Separator
    draw_glow_line(draw, y, margin, W - margin, CYAN, 2)
    y += 50

    # Data point
    draw.text((margin, y), DATA_POINT, fill=CYAN, font=f_data)
    y += 85

    # Body text
    for line in BODY.split("\n"):
        draw.text((margin, y), line, fill=WHITE, font=f_body)
        y += 38
    y += 30

    # Extra data point for TikTok (more vertical space)
    draw_glow_line(draw, y, margin, W - margin, MAGENTA, 1)
    y += 40
    draw.text((margin, y), "CHINA CONTROLA 1 DE CADA 4 CABLES", fill=MAGENTA, font=load_font(BEBAS, 44))
    y += 60
    draw.text(
        (margin, y),
        "Un solo corte puede aislar a un país entero\ndel flujo global de datos.",
        fill=WHITE, font=f_body
    )
    y += 30

    # Source
    draw.text((margin, y + 50), SOURCE, fill=GRAY, font=f_source)

    # Bottom section
    card_y = H - 200
    draw.rectangle([0, card_y, W, H], fill=SURFACE)
    draw_glow_line(draw, card_y, 0, W, CYAN, 2)

    logo_size = 52
    add_logo(img, margin, card_y + 35, logo_size)
    draw.text((margin + logo_size + 16, card_y + 45), BRAND, fill=CYAN, font=f_brand)
    draw.text((margin, card_y + 105), "Análisis internacional con pulso electrónico", fill=GRAY, font=f_source)

    # Bottom accent
    draw.rectangle([0, H - 6, W, H], fill=CYAN)

    img.save(output_path, quality=95)
    print(f"[OK] TikTok: {output_path}")
    return output_path


if __name__ == "__main__":
    ig = generate_instagram(OUTPUT_DIR / "P1_001_IG_1080x1350.png")
    tk = generate_tiktok(OUTPUT_DIR / "P1_001_TK_1080x1920.png")
    print(f"\nAssets generados en {OUTPUT_DIR}/")
