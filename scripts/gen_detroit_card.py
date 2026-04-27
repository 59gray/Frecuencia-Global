"""
Genera techno-detroit-featured-card.png
Asset card 1200x675 para la señal destacada del home.
Estética: cyber/editorial — gradiente oscuro, grid de señal, ruido, acento cyan.
"""
import random
from PIL import Image, ImageDraw, ImageFilter

W, H = 1200, 675
OUT = r"website\public\images\articles\techno-detroit-featured-card.png"

img = Image.new("RGB", (W, H), (0, 0, 0))
draw = ImageDraw.Draw(img)

# --- Capa 1: gradiente base oscuro (negro a azul profundo) ---
for y in range(H):
    t = y / H
    r = int(0 + t * 4)
    g = int(0 + t * 8)
    b = int(12 + t * 28)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# --- Capa 2: gradiente lateral izquierdo cyan/teal ---
for x in range(W // 3):
    t = 1 - (x / (W // 3))
    alpha = int(t * 38)
    draw.line([(x, 0), (x, H)], fill=(0, alpha, alpha // 2 + 8))

# --- Capa 3: grid de señal horizontal + vertical ---
GRID_COLOR = (0, 180, 200, 18)
grid_img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
grid_draw = ImageDraw.Draw(grid_img)

for y in range(0, H, 36):
    grid_draw.line([(0, y), (W, y)], fill=(0, 180, 200, 14))
for x in range(0, W, 36):
    grid_draw.line([(x, 0), (x, H)], fill=(0, 180, 200, 10))

img = Image.alpha_composite(img.convert("RGBA"), grid_img).convert("RGB")
draw = ImageDraw.Draw(img)

# --- Capa 4: líneas de señal diagonales tenues ---
rng = random.Random(42)
for _ in range(18):
    x0 = rng.randint(0, W)
    y0 = rng.randint(0, H)
    length = rng.randint(80, 320)
    angle_x = rng.randint(-length // 4, length)
    c = rng.randint(20, 55)
    draw.line([(x0, y0), (x0 + angle_x, y0 + rng.randint(-8, 8))],
              fill=(0, c, c + 10), width=1)

# --- Capa 5: bloques rectangulares de acento (ciudad nocturna abstracta) ---
city_blocks = [
    (820, 340, 870, 620), (890, 280, 940, 620), (960, 390, 1010, 620),
    (1030, 300, 1080, 620), (1100, 350, 1150, 620), (1160, 260, 1200, 620),
    (750, 420, 795, 620), (680, 460, 730, 620), (610, 380, 660, 620),
]
for (x1, y1, x2, y2) in city_blocks:
    shade = rng.randint(8, 22)
    draw.rectangle([x1, y1, x2, y2], fill=(shade, shade + 4, shade + 12))
    # ventanas: puntos de luz
    for wy in range(y1 + 10, y2 - 10, 16):
        for wx in range(x1 + 5, x2 - 5, 8):
            if rng.random() > 0.55:
                lc = rng.randint(30, 70)
                draw.rectangle([wx, wy, wx + 2, wy + 3],
                               fill=(lc // 3, lc, lc + 10))

# --- Capa 6: ruido fino (grano de film) ---
noise = Image.new("RGB", (W, H))
noise_px = noise.load()
rng2 = random.Random(99)
for y in range(H):
    for x in range(W):
        v = rng2.randint(0, 18)
        noise_px[x, y] = (v, v, v)
img = Image.blend(img, noise, alpha=0.06)

# --- Capa 7: viñeta oscura en bordes ---
vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
vg_draw = ImageDraw.Draw(vignette)
steps = 80
for i in range(steps):
    t = i / steps
    alpha = int((1 - t) ** 1.8 * 160)
    vg_draw.rectangle([i * 2, i * 2, W - i * 2, H - i * 2],
                      outline=(0, 0, 0, alpha))
img = Image.alpha_composite(img.convert("RGBA"), vignette).convert("RGB")
draw = ImageDraw.Draw(img)

# --- Capa 8: línea de señal horizontal destacada (acento cyan) ---
cy = H // 2 + 60
draw.line([(0, cy), (W // 2, cy)], fill=(0, 210, 220), width=1)
draw.line([(0, cy), (120, cy)], fill=(0, 230, 240), width=2)

# --- Capa 9: punto de señal izquierdo ---
draw.ellipse([28, cy - 4, 36, cy + 4], fill=(0, 229, 255))

# --- Blur suave final para cohesión ---
img = img.filter(ImageFilter.GaussianBlur(radius=0.6))

img.save(OUT, "PNG", optimize=True)
print(f"Generado: {OUT} — {W}x{H}")
