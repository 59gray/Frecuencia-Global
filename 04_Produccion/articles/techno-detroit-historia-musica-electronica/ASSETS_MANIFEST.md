# Assets Manifest — Detroit Techno

## Article

- **Slug:** techno-detroit-historia-musica-electronica
- **Source:** website/src/content/articles/techno-detroit-historia-musica-electronica.md
- **Frequency:** p2 — Bass & Borders

---

## OG social (2026-05-04)

- **ogImage activo:** `website/public/images/articles/FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png` (1200×630). Derivación: crop superior + resize desde `FG_DETROIT_P2_IMG_INLINE_MANGA02_v01_20260502_CANONICAL.png` (panel “Welcome to Detroit”). `FG_DETROIT_P2_IMG_OG_v01_20260502_CANONICAL.png` permanece en repo sin borrar.

---

## Assets referenciados en frontmatter

Rutas exactas que el artículo espera encontrar:

| Campo | Ruta esperada | Existe |
|---|---|---|
| image | /images/articles/techno-detroit-hero.png | NO |
| heroImageWebp | /images/articles/techno-detroit-hero.webp | NO |
| cardImage | /images/articles/bass-borders-detroit-card.webp | NO |
| ogImage | /images/articles/techno-detroit-og.png | NO |
| inline figure 1 | /images/articles/techno-detroit-billboard-manga-v1-rebuilt.png | NO |
| inline figure 1 webp | /images/articles/techno-detroit-billboard-manga-v1-rebuilt.webp | NO |
| inline figure 2 | /images/articles/techno-detroit-manga-02-master-v2.png | NO |
| inline figure 2 webp | /images/articles/techno-detroit-manga-02-master-v2.webp | NO |
| inline figure 3 | /images/articles/techno-detroit-manga-03.png | NO |
| inline figure 3 webp | /images/articles/techno-detroit-manga-03.webp | NO |

> ALERTA: Todas las rutas referenciadas en el frontmatter y cuerpo del artículo NO EXISTEN como archivos.
> Existen assets con nombres distintos en /images/articles/ (prefijo FG_DETROIT_*) que no coinciden con las rutas esperadas.

---

## Assets existentes en /images/articles/ relacionados con Detroit

| Archivo actual | Tamaño | Ruta convención | Acción recomendada |
|---|---|---|---|
| FG_DETROIT_HERO_WEB_v1.png | 450KB | techno-detroit-hero.png | Renombrar o crear symlink |
| FG_BASS_BORDERS_DETROIT_CARD_v2.png | 937KB | techno-detroit-featured-card.png | Candidato para featured card |
| FG_DETROIT_OG_v1.png | 1.1MB | techno-detroit-og.png | Candidato para ogImage |
| FG_DETROIT_BILLBOARD_MANGA_HD_v1.png | 1.2MB | techno-detroit-billboard-manga-v1-rebuilt.png | Candidato inline fig 1 |
| FG_DETROIT_MANGA_EDITORIAL_HD_v2.png | 2.1MB | techno-detroit-manga-02-master-v2.png | Candidato inline fig 2 |
| FG_DETROIT_FEATURED_REDESIGN_v1.png | 629KB | — | Evaluar uso |
| techno-detroit-featured-card.png | 1.4MB | techno-detroit-featured-card.png | Ya tiene nombre convención |

---

## Assets según estándar de derivación visual (pendientes)

| Asset | Ruta convención | Estado | Método | Notas |
|---|---|---|---|---|
| Featured card | techno-detroit-historia-musica-electronica-featured-card.png | PENDIENTE | ComfyUI | Brief listo en ARTICLE_VISUAL_BRIEF.md |
| Thumbnail | techno-detroit-historia-musica-electronica-thumbnail.png | PENDIENTE | ComfyUI | Prompts listos en ASSET_PROMPTS.md |
| Social preview | techno-detroit-historia-musica-electronica-social-1200x630.png | FUTURO | ComfyUI | No prioridad inmediata |

---

## Acción pendiente bloqueante

Antes de publicar este artículo en producción sin 404:

1. Decidir si renombrar los assets FG_DETROIT_* a las rutas exactas del frontmatter, O
2. Actualizar el frontmatter para que apunte a los archivos que sí existen.

Opción 2 (actualizar frontmatter) es menos disruptiva. Requiere aprobación editorial.

---

## Validation (estado al 2026-04-26)

- HTTP 200 en preview: NO VERIFICADO (archivos ausentes en rutas referenciadas)
- Build: PASS (Astro no falla en build por imágenes 404, solo en runtime)
- Preview /pilares/bass-and-borders: muestra cards sin imagen si el path no existe
- Alt text visible: NO (componente usa alt={title} en img, no texto visible extra)
- 404 en runtime: PROBABLE para hero, cardImage, ogImage e imágenes inline
