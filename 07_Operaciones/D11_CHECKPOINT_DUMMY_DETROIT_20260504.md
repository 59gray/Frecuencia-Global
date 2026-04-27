# D11 — Checkpoint seguro del dummy Detroit

- Fecha: 2026-05-04
- Rama: `feature/geopolitik-drop-cards-thumbnails-20260426`
- Build: `npm run build` en `website/` — **OK** (27 páginas, 2026-05-04 11:29:23 aprox. en ejecución de verificación D11)

## Git status antes del commit (resumen)

- **Modificados** además del scope dummy: `04_Produccion/dossiers/bass-borders-detroit-berghain/*`, `scripts/comfyui_dossier_bass_borders.py`, `website/public/images/dossiers/bass-borders-detroit-berghain.*`, entre otros — **fuera del commit checkpoint** de este paso.
- **No trackeados masivos**: `07_Operaciones/` (distintos entregables), artefactos, backups, `.cursor/`, scripts sueltos, logs — **no incluidos** en el commit acotado.

Archivos incluidos en el commit checkpoint (lista explícita):

- `website/src/content/articles/techno-detroit-historia-musica-electronica.md`
- `website/src/components/editorial/ArticleHeroImage.astro`
- `website/src/components/editorial/FeaturedBlock.astro`
- `website/src/pages/index.astro`
- `website/src/lib/pillars.ts` (descripción pilar p2 Bass & Borders)
- `website/public/images/articles/FG_DETROIT_P2_IMG_*_v01_20260502_CANONICAL.png` (6 archivos)
- `07_Operaciones/D09_CIERRE_DUMMY_DETROIT_20260502.md`
- `07_Operaciones/D10_QA_VISUAL_DUMMY_DETROIT_20260503.md`

Excluidos a propósito del commit (relacionados D09 pero no cerrados aquí):

- `07_Operaciones/D09_MAPA_FILENAME_WEB_FIRST_DETROIT_20260502.md`
- `07_Operaciones/D09_MAPA_FILENAME_WEB_FIRST_DETROIT_20260502.csv`

## URLs locales de referencia (preview dev)

Base: `http://127.0.0.1:4321`

- Artículo: `/contenido/techno-detroit-historia-musica-electronica/`
- Home: `/`
- Pilar Bass & Borders: `/pilares/bass-and-borders`

## Rutas públicas finales de imágenes Detroit (bundled en commit)

Prefijo site: `/images/articles/`

- `FG_DETROIT_P2_IMG_HERO_WEB_v01_20260502_CANONICAL.png`
- `FG_DETROIT_P2_IMG_CARD_SOCIAL_v01_20260502_CANONICAL.png`
- `FG_DETROIT_P2_IMG_OG_v01_20260502_CANONICAL.png`
- `FG_DETROIT_P2_IMG_INLINE_OPEN_STILL_v01_20260502_CANONICAL.png`
- `FG_DETROIT_P2_IMG_INLINE_MANGA02_v01_20260502_CANONICAL.png`
- `FG_DETROIT_P2_IMG_INLINE_MANGA03_v01_20260502_CANONICAL.png`

Dossier ya existente sin cambios en este commit (referencia QA): `/images/dossiers/bass-borders-detroit-berghain-dossier.png`

## Commit checkpoint

- **Hash:** `49a9a859a7a5f8106ee8560aa83fdef9db6b8002`
- **Mensaje:** `chore(fg): close Detroit dummy visual QA`
- **Push:** no ejecutado.

## Pendientes reales fuera del commit

- Resolver o aislar cambios pendientes en `website/public/images/dossiers/bass-borders-detroit-berghain.*`, scripts ComfyUI y `04_Produccion/dossiers/...` en PR separado.
- Limpiar o ignorar artefactos locales (`website/*.log`, previews, etc.) según política del repo.

## Confirmación operativa

- Sin deploy, sin publicación, sin Notion, sin APIs, sin credenciales editadas.
- Sin mover ni borrar assets fuera del control de versiones descrito arriba.

## Recomendación siguiente

Tras fusionar o cerrar el resto de cambios sucios del working tree, etiquetar release `detroit-dummy-qa` o abrir PR solo con commit `49a9a85` si se desea PR atómico.
