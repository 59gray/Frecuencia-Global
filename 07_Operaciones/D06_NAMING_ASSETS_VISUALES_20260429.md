# D06 — NAMING FINAL DE ASSETS VISUALES

## Objetivo del estandar

Definir una convención unica repo-first para que los assets visuales sean trazables por pieza/pilar/formato/estado, y para que D07 pueda mapear almacenamiento C/D/F sin mover archivos ni regenerar outputs.

## Convencion final

Formato canonico:

`FG_{PIEZA}_{PILAR}_{FORMATO}_{USO}_{VARIANTE}_v{NN}_{YYYYMMDD}_{ESTADO}.{ext}`

Campos:
- `PIEZA`: `P1_002`, `MVP_01`, `DETROIT`, `GLOBAL`.
- `PILAR`: `P1`, `P2`, `P3`, `P4`, `SYS` (sistema/brand), `NA` si no aplica.
- `FORMATO`: `IMG`, `SVG`, `JSON`, `PACK`.
- `USO`: `HERO`, `CARD`, `OG`, `BILLBOARD`, `LOGO`, `OVERLAY`, `MANIFEST`, etc.
- `VARIANTE`: `A`, `B`, `HD`, `WEB`, `MONO`, `DARK`, `LIGHT`, `MASTER`.
- `v{NN}`: version con dos digitos.
- `YYYYMMDD`: fecha de curaduria/normalizacion documental.
- `ESTADO`: `RAW`, `CURATED`, `CANONICAL`, `REVIEW`, `ARCHIVE`.

## Reglas por formato

- `SVG` (brand/system): no convertir ni rasterizar en D06; solo normalizar naming documental.
- `PNG/JPG/WEBP`: conservar fuente original; si hay canonicidad dudosa, marcar `REVIEW`.
- `JSON` de metadatos ComfyUI: tratar como traza tecnica (`FORMATO=JSON`, `USO=MANIFEST`).
- No renombrar archivos fisicamente en D06; solo definir nombre recomendado.

## Ejemplos aplicados a piezas reales

- `06_Assets/base/assets/fg_isotipo.svg` -> `FG_GLOBAL_SYS_SVG_LOGO_ISOTIPO_A_v01_20260429_CANONICAL.svg`
- `06_Assets/base/assets/fg_wordmark_dark.svg` -> `FG_GLOBAL_SYS_SVG_LOGO_WORDMARK_DARK_v01_20260429_CANONICAL.svg`
- `06_Assets/base/assets/fg_wordmark_light.svg` -> `FG_GLOBAL_SYS_SVG_LOGO_WORDMARK_LIGHT_v01_20260429_CANONICAL.svg`
- `website/public/images/system/fg-overlay-hero-master.svg` -> `FG_GLOBAL_SYS_SVG_OVERLAY_HERO_MASTER_v01_20260429_CANONICAL.svg`
- `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.meta.json` -> `FG_DETROIT_P2_JSON_MANIFEST_DOSSIER_MASTER_v01_20260429_REVIEW.json`

## Reglas para Detroit

- El articulo `website/src/content/articles/techno-detroit-historia-musica-electronica.md` referencia assets bitmap en `/images/articles/...`.
- En el workspace actual, `website/public/images/articles/` contiene solo `README.md`; no hay bitmaps Detroit verificables.
- Resultado operativo Detroit en D06:
  - Estado de assets bitmap: `NO VERIFICADO EN FUENTE LOCAL`.
  - Bloqueo de integracion website: activo hasta que existan rutas fisicas locales o se corrijan referencias.
- No afirmar existencia de outputs en `D:\FrecuenciaGlobal\ComfyUI\output...`; en este entorno no se localizaron rutas con `*detroit*`.

## Reglas para futuros pilares

- P1/P2/P3/P4 deben usar `PIEZA` + `PILAR` obligatorios.
- Assets de sistema visual transversal usan `PIEZA=GLOBAL`, `PILAR=SYS`.
- Cualquier output de ComfyUI sin evidencia de archivo local queda en `ESTADO=RAW` con nota `NO VERIFICADO EN FUENTE LOCAL`.
- Para publicar naming como canónico, se requiere: archivo existente + uso definido + referencia consumidora (articulo/componente/manifest).

## Que NO renombrar todavia

- Outputs ComfyUI fuera del workspace (rutas C/D/F solo documentadas).
- Referencias antiguas listadas en `04_Produccion/Detroit/visual_curation/*.md` sin archivo presente local.
- Assets de piezas sin inventario real en disco (ejemplo: bitmaps de `P1_002` citados en manifest pero no localizados por inventario D06).
