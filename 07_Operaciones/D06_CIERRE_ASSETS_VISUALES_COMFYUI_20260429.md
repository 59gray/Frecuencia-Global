# D06 — CIERRE ASSETS VISUALES / COMFYUI

- Fecha de cierre: 2026-04-29
- Alcance: naming final + curaduria de outputs visuales existentes
- Guardrails aplicados: sin publicar, sin deploy, sin APIs, sin credenciales, sin mover/borrar/generar imagenes

## 1) Que se reviso

- `07_Operaciones/BACKLOG_EDITORIAL_10_DIAS_20260427.md`
- `07_Operaciones/BACKLOG_EDITORIAL_10_DIAS_20260427.csv`
- `07_Operaciones/D05_QA_EDITORIAL_DETROIT_20260428.md`
- `07_Operaciones/D05_QA_EDITORIAL_DETROIT_20260428.csv`
- `04_Produccion/PIECE_STATUS_MATRIX.md`
- `04_Produccion/pipeline_tracker.json`
- `04_Produccion/swarm_mvp_tracker.json`
- inventario real en `06_Assets/` y `website/public/images/`
- trazas Detroit/ComfyUI en `04_Produccion/Detroit/visual_curation/*.md` y `04_Produccion/dossiers/bass-borders-detroit-berghain/*.md`

## 2) Que se cambio

- Se definio estandar de naming final en `07_Operaciones/D06_NAMING_ASSETS_VISUALES_20260429.md`.
- Se genero curaduria CSV con activos reales encontrados en el workspace en `07_Operaciones/D06_COMFYUI_OUTPUTS_CURADURIA_20260429.csv`.
- Se clasificaron estados: `usable`, `revisar`, `duplicado`.
- Se documentaron faltantes de trazabilidad Detroit/ComfyUI sin inventar rutas nuevas.

## 3) Archivos creados/actualizados

1. `07_Operaciones/D06_NAMING_ASSETS_VISUALES_20260429.md` (creado)
2. `07_Operaciones/D06_COMFYUI_OUTPUTS_CURADURIA_20260429.csv` (creado)
3. `07_Operaciones/D06_CIERRE_ASSETS_VISUALES_COMFYUI_20260429.md` (creado)

## 4) Hallazgos principales

- En `website/public/images/articles/` solo existe `README.md`; no hay bitmaps Detroit verificables en este workspace.
- `website/src/content/articles/techno-detroit-historia-musica-electronica.md` referencia varios assets Detroit (`hero/card/og/inline`) sin correspondencia fisica local visible.
- Existe traza de ComfyUI via `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.meta.json`, pero su `asset_file` png no se localizo en el inventario D06.
- Hay duplicidad de logos entre `06_Assets/base/assets/` y `website/public/images/logo/`.
- `P1_002` tiene manifest con nombres de imagen, pero esos bitmaps no quedaron localizados por inventario actual.

## 5) Bloqueos

- Detroit website integration: `BLOCKED` por falta de correspondencia entre referencias del articulo y archivos fisicos locales.
- ComfyUI outputs externos (rutas D:/documentadas): `NO VERIFICADO EN FUENTE LOCAL` en este entorno.
- Trazabilidad por pieza en trackers: Detroit sigue fuera de `PIECE_STATUS_MATRIX`, `pipeline_tracker`, `swarm_mvp_tracker`.

## 6) Recomendacion para D07 (sin mover archivos)

1. Construir un mapa de almacenamiento por ruta existente (C/D/F) con columnas: origen, path real, hash, pieza, estado, consumidor.
2. Validar en lectura sola si los outputs Detroit de D:/ComfyUI siguen existiendo y registrar evidencia por archivo.
3. Mapear referencia->archivo para el articulo Detroit (frontmatter + figuras inline) y marcar cada ruta como `exists/missing`.
4. Definir source-of-truth entre `06_Assets/base/assets` y `website/public/images/logo` antes de cualquier renombre fisico.

## 7) Confirmacion operativa

- No se movieron archivos.
- No se borraron outputs.
- No se generaron imagenes nuevas.
- No se ejecutaron acciones de publicacion/deploy.
