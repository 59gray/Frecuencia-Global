# D08 — Cierre manifest maestro por pieza (assets + C/D/F)

- Fecha: 2026-05-01
- Alcance: consolidar manifest **repo-first** por pieza para mitigar drift entre `C:` (repo), `D:` (árbol paralelo + ComfyUI output) y `F:` (spot-check superficial), sin mover ni renombrar archivos.

## Qué se revisó

- `07_Operaciones/D07_MAPA_ALMACENAMIENTO_CDF_20260430.md`
- `07_Operaciones/D07_MAPA_ALMACENAMIENTO_CDF_20260430.csv`
- `07_Operaciones/D07_CIERRE_MAPA_ALMACENAMIENTO_20260430.md`
- `07_Operaciones/D06_COMFYUI_OUTPUTS_CURADURIA_20260429.csv`
- `07_Operaciones/D06_NAMING_ASSETS_VISUALES_20260429.md`
- `07_Operaciones/D05_QA_EDITORIAL_DETROIT_20260428.md`
- `04_Produccion/PIECE_STATUS_MATRIX.md`
- `04_Produccion/pipeline_tracker.json`
- `04_Produccion/swarm_mvp_tracker.json`
- Spot-check local:
  - `06_Assets/**` (presencia/ausencia de árboles por pieza)
  - `website/public/images/**`
  - `D:\FrecuenciaGlobal\ComfyUI\output` (listado superficial)
  - `D:\ComfyUI\output` (existencia)
  - `D:\FrecuenciaGlobal\06_Assets` (existencia raíz)
  - `F:\Frecuencia Global\output` (existencia)

## Qué se cambió

- Se creó documentación operativa D08 en `07_Operaciones/` únicamente (ver lista abajo).
- No se modificó código de website, no se actualizaron trackers, no se tocaron credenciales ni `.env`.

## Archivos creados/actualizados

1. `07_Operaciones/D08_MANIFEST_PIEZAS_ASSETS_CDF_20260501.md`
2. `07_Operaciones/D08_MANIFEST_PIEZAS_ASSETS_CDF_20260501.csv`
3. `07_Operaciones/D08_CIERRE_MANIFEST_PIEZAS_ASSETS_20260501.md`

## Hallazgos principales

- **Drift documentación vs disco (C:)**: varias piezas referencian manifests/carpetas (`06_Assets/MVP_02`, `MVP_03`, PNG en `MVP_01`, PNG en `P1_002`) que **no están presentes** como paquete verificable en el árbol local del repo.
- **Depósito visual fuerte en D:** `D:\FrecuenciaGlobal\ComfyUI\output` contiene evidencia masiva de PNG (incluye familias `techno-detroit*` y `FG_DETROIT_*`), mientras `D:\ComfyUI\output` aparece como ruta alternativa casi vacía en spot-check.
- **Detroit web**: dossier `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.png` existe e integra en `pilares/[slug].astro`, pero el artículo referencia muchos bitmaps bajo `website/public/images/articles/` que **no están presentes** en spot-check (salvo `techno-detroit-featured-card.png`). Esto reproduce el bloque de QA D05.
- **Drift operativo**: `P1_002` muestra divergencia de estado entre `pipeline_tracker.json` y `PIECE_STATUS_MATRIX.md`.
- **`FG_001`**: matriz enlaza `FG_001_PublishReady.md` pero el archivo **no existe** en repo (spot-check por búsqueda de ruta).
- **`EP_001` / `EP_002`**: PublishReady existe, pero carpetas/metadata referenciadas por tracker **no aparecen** localmente para tratamiento AV completo.

## Bloqueos

- No hay bloqueo para **auditar**, pero sí bloqueo para **“cerrar canonicalidad”**: falta decisión humana de filenames y política de depósito (C: vs D:) sin contradecir publicaciones ya ejecutadas en redes.
- Integración website Detroit queda bloqueada en nivel **build UX** hasta resolver las rutas rotas en `/images/articles/` (consistente con D05).

## Confirmación operativa

- No se movieron archivos entre discos.
- No se borraron ni renombraron archivos.
- No se generaron imágenes ni symlinks.

## Recomendación concreta para D09

1. Producción de **tabla filename-level** solo para piezas web-first (Detroit): candidatos en `D:\FrecuenciaGlobal\ComfyUI\output` → nombre final en `website/public/images/articles/` (sin ejecutar copia hasta aprobación).
2. Producción de **fuente de verdad** para piezas social-first (`MVP_*`): declarar si `06_Assets` debe rehabilitarse como mirror o si D: es el depósito operativo único (documentación + reglas de copy controlado).
3. Resolver **GOV/drift** `P1_002` antes de cualquier reconciliación de assets.
