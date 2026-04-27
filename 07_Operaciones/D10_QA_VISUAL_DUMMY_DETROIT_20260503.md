# D10 — QA visual dummy Detroit (local)

- Fecha: 2026-05-03
- Preview revisado: `http://127.0.0.1:4321/` (dev), rutas listadas abajo.

## Archivo(s) revisados

- `website/src/content/articles/techno-detroit-historia-musica-electronica.md`
- `website/src/pages/index.astro` (bloque HomeFold / señal destacada)
- `website/src/components/editorial/FeaturedBlock.astro` (defensa de overlay si se reusa el componente)

## Correcciones aplicadas

1. **Primera ilustración (`OPEN_STILL`)**: `alt` ajustado para no sugerir “ciudad abierta” si la pieza es escena interior arquitectónica (coherencia visual texto ↔ imagen).
2. **Home `/`**: imagen de la señal destacada alineada al mismo PNG que `cardImage` del artículo (`FG_DETROIT_P2_IMG_CARD_SOCIAL_v01_20260502_CANONICAL.png`) para consistencia marca/card entre home y pieza.
3. **`FeaturedBlock`**: detección ampliada (`FG_DETROIT_P2`, `techno-detroit-featured`) para que tratamiento Detroit (grayscale + overlay) no dependa solo de `techno-detroit-hero` si el asset cambia de nombre.

## Resultado build / preview

- **Dev**: `npm run dev -- --host 127.0.0.1 --port 4321` — página artículo y home cargadas sin errores visibles en consola de red para PNG locales (revisión network: `200` en rutas `/images/articles/FG_DETROIT_*`).
- **Build**: `npm run build` en `website/` — **OK** (27 páginas; sin fallo de compilación).

## Rutas visuales finales (artículo)

- Hero: `/images/articles/FG_DETROIT_P2_IMG_HERO_WEB_v01_20260502_CANONICAL.png`
- Card / OG: `/images/articles/FG_DETROIT_P2_IMG_CARD_SOCIAL_v01_20260502_CANONICAL.png`, `/images/articles/FG_DETROIT_P2_IMG_OG_v01_20260502_CANONICAL.png`
- Inlines: `..._INLINE_OPEN_STILL_...`, `..._MANGA02_...`, `..._MANGA03_...`

## Rutas revisadas en navegador (manual)

- `http://127.0.0.1:4321/contenido/techno-detroit-historia-musica-electronica/` — hero con overlay cyan/magenta, deck legible, inlines cargados.
- `http://127.0.0.1:4321/` — bloque destacado Bass & Borders con imagen de fondo visible tras alinear asset.
- `http://127.0.0.1:4321/pilares/bass-and-borders` — dossier textual + lectura de artículos sin roturas de PNG locales del dossier (`/images/dossiers/bass-borders-detroit-berghain-dossier.png` ya existente).

## Pendientes reales

- Embed X: depende de scripts externos de Twitter; no bloquea PNG locales (red externa fuera del alcance “asset roto”).
- Ilustración “billboard” específica: **NO VERIFICADO EN FUENTE LOCAL** como archivo dedicado; no sustituida en D09/D10 por política explícita.
- Revisión OG en redes reales (meta share): no ejecutada aquí (sin deploy).

## Confirmación operativa

- Sin deploy, sin publicación, sin Notion, sin APIs editadas, sin credenciales tocadas.

## Recomendación inmediata

1. Revisión humana final de **crop hero** (`heroImagePosition`) y de **OG** en cliente social simulado (meta tags) cuando haya URL pública.
2. Si se desea variante “featured” distinta del card social, duplicar asset con otro crop **sin borrar** el PNG actual.
