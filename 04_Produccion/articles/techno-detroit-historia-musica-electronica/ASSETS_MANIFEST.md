# Assets Manifest — Detroit Techno

## Article

- **Slug:** `techno-detroit-historia-musica-electronica`
- **Source:** `website/src/content/articles/techno-detroit-historia-musica-electronica.md`
- **Frequency:** p2 — Bass & Borders
- **Alcance editorial:** piloto web P2 (calibración flujo investigación → web → assets); **no** tratado aquí como paquete de redes.

---

## Inventario canónico en repo

Rutas verificadas bajo `website/public/images/articles/` (patrón `FG_DETROIT_P2_*_CANONICAL`). Sin archivos inventados.

| Activo | Ruta en repo | Ruta web |
|--------|----------------|----------|
| Hero web | `website/public/images/articles/FG_DETROIT_P2_IMG_HERO_WEB_v01_20260502_CANONICAL.png` | `/images/articles/FG_DETROIT_P2_IMG_HERO_WEB_v01_20260502_CANONICAL.png` |
| Card / feed cuadrado | `website/public/images/articles/FG_DETROIT_P2_IMG_CARD_SOCIAL_v01_20260502_CANONICAL.png` | `/images/articles/FG_DETROIT_P2_IMG_CARD_SOCIAL_v01_20260502_CANONICAL.png` |
| OG (variante documentada v01) | `website/public/images/articles/FG_DETROIT_P2_IMG_OG_v01_20260502_CANONICAL.png` | `/images/articles/FG_DETROIT_P2_IMG_OG_v01_20260502_CANONICAL.png` |
| OG billboard v02 | `website/public/images/articles/FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png` | `/images/articles/FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png` |
| Inline 1 (open still) | `website/public/images/articles/FG_DETROIT_P2_IMG_INLINE_OPEN_STILL_v01_20260502_CANONICAL.png` | `/images/articles/FG_DETROIT_P2_IMG_INLINE_OPEN_STILL_v01_20260502_CANONICAL.png` |
| Inline 2 (manga / Welcome) | `website/public/images/articles/FG_DETROIT_P2_IMG_INLINE_MANGA02_v01_20260502_CANONICAL.png` | `/images/articles/FG_DETROIT_P2_IMG_INLINE_MANGA02_v01_20260502_CANONICAL.png` |
| Inline 3 (manga / bóveda) | `website/public/images/articles/FG_DETROIT_P2_IMG_INLINE_MANGA03_v01_20260502_CANONICAL.png` | `/images/articles/FG_DETROIT_P2_IMG_INLINE_MANGA03_v01_20260502_CANONICAL.png` |

---

## Frontmatter del artículo (consumo actual)

Referencias en `techno-detroit-historia-musica-electronica.md` frente a archivos en repo:

| Campo | Ruta en markdown | Estado |
|-------|------------------|--------|
| `image` | `/images/articles/FG_DETROIT_P2_IMG_HERO_WEB_v01_20260502_CANONICAL.png` | OK — archivo presente |
| `cardImage` | `/images/articles/FG_DETROIT_P2_IMG_CARD_SOCIAL_v01_20260502_CANONICAL.png` | OK — archivo presente |
| `ogImage` | `/images/articles/FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png` | OK — archivo presente |

**Nota OG (D42):** `ogImage` del artículo usa **v02 billboard** (1200×630, crop documentado desde `FG_DETROIT_P2_IMG_INLINE_MANGA02_*`, coherente con ops D25/D37). `FG_DETROIT_P2_IMG_OG_v01_20260502_CANONICAL.png` permanece en repo como baseline histórico.

---

## Imágenes inline en cuerpo (HTML)

| Figura | Ruta web | Estado |
|--------|----------|--------|
| Primera ilustración | `/images/articles/FG_DETROIT_P2_IMG_INLINE_OPEN_STILL_v01_20260502_CANONICAL.png` | OK |
| Segunda ilustración | `/images/articles/FG_DETROIT_P2_IMG_INLINE_MANGA02_v01_20260502_CANONICAL.png` | OK |
| Tercera ilustración | `/images/articles/FG_DETROIT_P2_IMG_INLINE_MANGA03_v01_20260502_CANONICAL.png` | OK |

---

## Consumidor adicional (home)

- `website/src/pages/index.astro` — señal destacada: `/images/articles/FG_DETROIT_P2_IMG_CARD_SOCIAL_v01_20260502_CANONICAL.png` (alineado con `cardImage` según QA documentado).

---

## Validation (D40–D44 — 2026-04-27)

- Archivos `FG_DETROIT_P2_*_CANONICAL` listados arriba: presentes en `website/public/images/articles/`.
- Rutas legacy del manifiesto previo (`techno-detroit-hero.png`, `bass-borders-detroit-card.webp`, etc.): **no** usadas por el artículo actual; retiradas de este documento para evitar señales falsas de 404.
