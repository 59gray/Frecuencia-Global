# D09 — Mapa filename web-first (Detroit) — 2026-05-02

## Resumen ejecutivo

El artículo canónico `website/src/content/articles/techno-detroit-historia-musica-electronica.md` referencia **diez rutas** bajo `/images/articles/...` entre frontmatter y cuerpo. En **C:** (repo), spot-check muestra que **ocho rutas no existen** como archivo bajo `website/public/images/articles/`; **dos rutas sí existen** (`techno-detroit-featured-card.png` no está en el markdown del artículo pero sí es consumidor web en `website/src/pages/index.astro`). El dossier Bass & Borders **sí existe** en `website/public/images/dossiers/` y consume la página `pilares/[slug].astro`.

En **D:**, `D:\FrecuenciaGlobal\ComfyUI\output` contiene candidatos PNG con prefijos `FG_DETROIT_*`, `FG_BB_DETROIT_*`, `techno-detroit-*` alineados con hero, inline manga y featured; **no apareció** por spot-check en ese directorio ningún archivo cuyo nombre contenga `billboard` ni `rebuilt`. Bajo **`06_Assets/`** no se localizaron rutas `*detroit*` / `*techno*` en búsqueda superficial (sin inventario profundo).

Este documento **solo** define mapa filename y decisiones documentales para **D10**; no ejecuta copias ni renombres.

## Archivo Detroit revisado

- **Ruta:** `website/src/content/articles/techno-detroit-historia-musica-electronica.md`
- **Frontmatter:** `image`, `heroImageWebp`, `cardImage`, `ogImage`
- **Cuerpo:** tres bloques `<picture>` con PNG + WEBP por ilustración

## Rutas de imagen referenciadas (artículo)

| Referencia | Rol |
|---|---|
| `/images/articles/techno-detroit-hero.png` | Hero PNG (frontmatter `image`) |
| `/images/articles/techno-detroit-hero.webp` | Hero WEBP (`heroImageWebp`) |
| `/images/articles/bass-borders-detroit-card.webp` | Card WEBP (`cardImage`) |
| `/images/articles/techno-detroit-og.png` | OG (`ogImage`) |
| `/images/articles/techno-detroit-billboard-manga-v1-rebuilt.webp` | Inline billboard WEBP |
| `/images/articles/techno-detroit-billboard-manga-v1-rebuilt.png` | Inline billboard PNG |
| `/images/articles/techno-detroit-manga-02-master-v2.webp` | Inline manga 02 WEBP |
| `/images/articles/techno-detroit-manga-02-master-v2.png` | Inline manga 02 PNG |
| `/images/articles/techno-detroit-manga-03.webp` | Inline manga 03 WEBP |
| `/images/articles/techno-detroit-manga-03.png` | Inline manga 03 PNG |

## Consumidor web adicional (no está en el markdown del artículo)

| Referencia | Fuente consumidora |
|---|---|
| `/images/articles/techno-detroit-featured-card.png` | `website/src/pages/index.astro` (bloque featured) |

## Existencia real por ruta (spot-check C:)

Raíz verificada: `C:\Users\farid\Documents\Frecuencia Global\website\public\`

- **Ausentes** en `images/articles/` según `Test-Path` para las ocho rutas del artículo listadas arriba como hero/card/og/inline (PNG/WEBP del artículo).
- **Presente:** `images/articles/techno-detroit-featured-card.png`.
- **Presente:** `images/dossiers/bass-borders-detroit-berghain-dossier.png`.

## Equivalencias encontradas (D: — solo candidatos; selección humana en D10)

Directorio spot-check: `D:\FrecuenciaGlobal\ComfyUI\output`

- **Hero web:** `FG_DETROIT_HERO_WEB_v1_s42_00001_.png`, `FG_DETROIT_HERO_WEB_v1_s137_00001_.png`, `FG_DETROIT_HERO_WEB_v1_s999_00001_.png`
- **Card social / thumbs:** `FG_BB_DETROIT_CARD_v2_s111_00001_.png`, `FG_BB_DETROIT_CARD_v2_s2026_00001_.png`, `FG_BB_DETROIT_CARD_v2_s555_00001_.png`; `FG_BB_DETROIT_THUMB_v1_*`
- **Featured / OG-like:** `FG_DETROIT_FEATURED_v1_*`, `techno-detroit-featured-card_00001_.png`, `techno-detroit-featured-card_00002_.png`
- **Manga 02 / 03:** `techno-detroit-manga-02_00001_.png`, `techno-detroit-manga-02_00002_.png`, `techno-detroit-manga-03_00001_.png`, `techno-detroit-manga-03_00002_.png`
- **Billboard “rebuilt”:** **NO VERIFICADO EN FUENTE LOCAL** como filename en spot-check (`*billboard*` / `*rebuilt*` sin resultados en ese directorio).
- **WEBP:** **NO VERIFICADO EN FUENTE LOCAL** archivo `.webp` homónimo en ese listado superficial; derivación WEBP queda como acción D10 (export / conversión) sin ejecutar aquí.

## Nombres finales recomendados (convención D06 aplicada a Detroit)

Plantilla: `FG_{PIEZA}_{PILAR}_{FORMATO}_{USO}_{VARIANTE}_v{NN}_{YYYYMMDD}_{ESTADO}.{ext}` con `PIEZA=DETROIT`, `PILAR=P2`.

Ejemplos documentales (no renombrar todavía):

| Uso | Nombre recomendado |
|---|---|
| Hero PNG | `FG_DETROIT_P2_IMG_HERO_WEB_v01_20260502_CANONICAL.png` |
| Hero WEBP | `FG_DETROIT_P2_IMG_HERO_WEB_v01_20260502_CANONICAL.webp` |
| Card WEBP | `FG_DETROIT_P2_IMG_CARD_SOCIAL_v01_20260502_CANONICAL.webp` |
| OG PNG | `FG_DETROIT_P2_IMG_OG_v01_20260502_CANONICAL.png` |
| Billboard inline | `FG_DETROIT_P2_IMG_BILLBOARD_MANGA_v01_20260502_REVIEW.png` (+ WEBP homónimo) |
| Manga 02 | `FG_DETROIT_P2_IMG_INLINE_MANGA02_v01_20260502_CANONICAL.png` (+ WEBP) |
| Manga 03 | `FG_DETROIT_P2_IMG_INLINE_MANGA03_v01_20260502_CANONICAL.png` (+ WEBP) |
| Featured home | `FG_DETROIT_P2_IMG_CARD_FEATURED_HOME_v01_20260502_CANONICAL.png` |

La selección de **qué candidato D:** alimenta cada nombre es **humana** (seed/variante); este mapa no la fija sin revisión visual.

## Acción mínima para D10 (sin ejecutar en D09)

1. Curar una tabla **un PNG/D:** → un nombre final `CANONICAL` por slot (hero, OG, tres inline, card).
2. Resolver billboard: localizar fuente real del arte “rebuilt” (**NO VERIFICADO EN FUENTE LOCAL** en ComfyUI output por nombre) o regenerar según política posterior.
3. Exportar WEBP desde PNG curados o alinear referencias si se decide solo PNG.
4. Copiar/pegar bajo `website/public/images/articles/` con **exactamente** los nombres que el markdown ya usa **o** actualizar markdown en el mismo PR que materializa archivos (decisión única en D10).

## Qué NO tocar todavía

- No copiar desde `D:\FrecuenciaGlobal\ComfyUI\output` hacia `website/public/`.
- No renombrar físico en `D:` ni en `C:`.
- No cambiar frontmatter/markdown del artículo hasta que exista paridad archivo-a-ruta.
- No deduplicar `FG_DOSSIER_BASS_BORDERS_*` contra `bass-borders-detroit-berghain-dossier.png` sin comparación visual/hash (fuera de alcance D09).

## Tabla maestra (detalle operativo)

Ver entrega tabular en `07_Operaciones/D09_MAPA_FILENAME_WEB_FIRST_DETROIT_20260502.csv` (columnas exactas solicitadas).
