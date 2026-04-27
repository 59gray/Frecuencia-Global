# D08 — Manifest maestro por pieza (C: / D: / F:) — 2026-05-01

## Resumen ejecutivo

Este manifest consolida **trazabilidad repo-first** entre piezas documentadas en `04_Produccion/*` y las rutas locales que definen “verdad material” para assets y website. El objetivo es **prevenir drift** entre el repo canónico (`C:\Users\farid\Documents\Frecuencia Global`), el árbol paralelo (`D:\FrecuenciaGlobal`) y artefactos fuera de repo (ComfyUI outputs), **sin mover ni renombrar archivos**.

Hallazgo central: los trackers y la matriz declaran manifests/carpetas de assets que **no están presentes como árbol completo en `06_Assets/` en C:** (spot-check + ausencia de PNG en `06_Assets`) mientras que **sí hay evidencia fuerte de PNG en `D:\FrecuenciaGlobal\ComfyUI\output`** (incluye familia `techno-detroit*` y `FG_*Detroit*`). En website, el dossier Bass & Borders **sí materializa** `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.png`, pero el artículo Detroit referencia muchos bitmaps bajo `website/public/images/articles/` que **no están presentes** en C: salvo `techno-detroit-featured-card.png`.

## Piezas detectadas (fuente)

- `04_Produccion/PIECE_STATUS_MATRIX.md`
- `04_Produccion/pipeline_tracker.json`
- `04_Produccion/swarm_mvp_tracker.json`

## Manifest maestro por pieza

| piece_id | pillar | editorial_status | editorial_path | c_assets_path | d_assets_path | comfyui_output_path | website_image_path | website_integration_status | drift_risk | recommended_action |
|---|---|---|---|---|---|---|---|---|---|---|
| P1_001 | P1 | `PUBLISHED_MULTI` (`pipeline_tracker.json`) | `03_Editorial/P1_001_PublishReady.md` | `06_Assets/P1_001/` (existe carpeta; JSON presente; **sin PNG verificados en tree local**) | `D:\FrecuenciaGlobal\06_Assets\` existe; **sin subcarpeta `P1_001` verificada** | `D:\FrecuenciaGlobal\ComfyUI\output` + `D:\ComfyUI\output` | `NO_VERIFICADO_EN_WEBSITE` (pieza social-first; sin ruta única en `website/public/images/**`) | EXTERNAL_PUBLISH_WITHOUT_WEB_ASSETS_MANIFEST | ALTO (tracker/manifiesto declaran slides; repo no contiene PNG en `06_Assets`) | Congelar “publicado” como **distribución multiplataforma** hasta reconciliar: o bien materializar PNG en repo, o bien documentar depósito externo como fuente de verdad **sin copiar aún** |
| P1_002 | P1 | `APPROVAL_PENDING` (`pipeline_tracker.json`) vs `COMPLETED` (`PIECE_STATUS_MATRIX.md`) | `04_Produccion/P1_002_PublishReady.md` | `06_Assets/P1_002/` (**solo** `ASSETS_MANIFEST.md`) | `D:\FrecuenciaGlobal\06_Assets\` existe; **sin subcarpeta `P1_002` verificada** | `D:\FrecuenciaGlobal\ComfyUI\output` | `NO_VERIFICADO_EN_WEBSITE` | EXTERNAL_PUBLISH_STATE_DRIFT | CRÍTICO (estado divergente + manifest sin binarios locales) | Resolver GOV/drift de estado con evidencia (publicación vs aprobación) antes de tocar assets |
| P1_003 | P1 | `BRIEF_READY` | `03_Editorial/P1_003_Brief.md` | `NO_VERIFICADO_EN_FUENTE_LOCAL` (no existe `06_Assets/P1_003/`) | `NO_VERIFICADO_EN_FUENTE_LOCAL` | `D:\FrecuenciaGlobal\ComfyUI\output` | `NO_VERIFICADO_EN_WEBSITE` | NOT_STARTED | MEDIO | Mantener como pieza “pipeline siguiente”: crear carpeta/manifest solo cuando haya outputs seleccionados |
| P1_004 | P1 | `BRIEF_READY` | `03_Editorial/P1_004_Brief.md` | `NO_VERIFICADO_EN_FUENTE_LOCAL` (no existe `06_Assets/P1_004/`) | `NO_VERIFICADO_EN_FUENTE_LOCAL` | `D:\FrecuenciaGlobal\ComfyUI\output` | `NO_VERIFICADO_EN_WEBSITE` | NOT_STARTED | MEDIO | No activar hasta cerrar orden `P1_003 → P1_004` |
| EP_001 | SHOW | `PUBLISH_READY` + bloqueos AV (`pipeline_tracker.json`) | `04_Produccion/EP_001_PublishReady.md` | `NO_VERIFICADO_EN_FUENTE_LOCAL` (no existe `04_Produccion/EP_001/` ni bundle local) | `NO_VERIFICADO_EN_FUENTE_LOCAL` | `NO_VERIFICADO_EN_FUENTE_LOCAL` (AV master fuera de alcance D08) | `NO_VERIFICADO_EN_WEBSITE` | BLOCKED_AUDIO_VIDEO | ALTO (metadata YouTube referenciada pero carpeta no existe en C:) | Tratar como backlog AV: master + thumbnail antes de cualquier integración web |
| EP_002 | SHOW | `PUBLISH_READY` + bloqueos AV (`pipeline_tracker.json`) | `04_Produccion/EP_002_PublishReady.md` | `NO_VERIFICADO_EN_FUENTE_LOCAL` (no existe `04_Produccion/EP_002/`) | `NO_VERIFICADO_EN_FUENTE_LOCAL` | `NO_VERIFICADO_EN_FUENTE_LOCAL` | `NO_VERIFICADO_EN_WEBSITE` | BLOCKED_AUDIO_VIDEO | ALTO | Misma política que EP_001 |
| FG_001 | P1 | `SANDBOX_EDITORIAL_DRAFT` (`PIECE_STATUS_MATRIX.md`) | `NO_VERIFICADO_EN_FUENTE_LOCAL` (no existe `FG_001_PublishReady.md` en repo) | `NO_VERIFICADO_EN_FUENTE_LOCAL` | `NO_VERIFICADO_EN_FUENTE_LOCAL` | `D:\FrecuenciaGlobal\ComfyUI\output` | `NO_VERIFICADO_EN_WEBSITE` | SANDBOX_ONLY | ALTO (link roto en matriz) | Crear PublishReady o corregir matriz para evitar “falso asset” |
| MVP_01 | P1 | `PUBLISHED` (`swarm_mvp_tracker.json`) | `04_Produccion/MVP_01_PublishReady.md` | `06_Assets/MVP_01/` (**sin PNG listados localmente**) | `NO_VERIFICADO_EN_FUENTE_LOCAL` (no existe `...\06_Assets\MVP_01` en D:) | `D:\FrecuenciaGlobal\ComfyUI\output` (familia `blueprint_*__subsea_data_routes*` + `cables-submarinos_00001_.png` como candidatos, **sin atribución mecánica**) | `NO_VERIFICADO_EN_WEBSITE` | EXTERNAL_ONLY | ALTO (publicado social vs ausencia de binarios en `06_Assets`) | Documentar depósito de verdad de carruseles (repo vs D:) con selección humana de filenames |
| MVP_02 | P1 | `PUBLISHED` | `04_Produccion/MVP_02_PublishReady.md` | `NO_VERIFICADO_EN_FUENTE_LOCAL` (no existe `06_Assets/MVP_02/`) | `NO_VERIFICADO_EN_FUENTE_LOCAL` | `D:\FrecuenciaGlobal\ComfyUI\output` (familia `blueprint_*__semiconductor_supply_chain*` como candidatos) | `NO_VERIFICADO_EN_WEBSITE` | EXTERNAL_ONLY | ALTO | Idem MVP_01; priorizar recuperar `ASSETS_MANIFEST.md` o equivalente |
| MVP_03 | P1 | `PUBLISHED` | `04_Produccion/MVP_03_PublishReady.md` | `NO_VERIFICADO_EN_FUENTE_LOCAL` (no existe `06_Assets/MVP_03/`) | `NO_VERIFICADO_EN_FUENTE_LOCAL` | `D:\FrecuenciaGlobal\ComfyUI\output` | `NO_VERIFICADO_EN_WEBSITE` | EXTERNAL_ONLY | ALTO | Idem MVP_01 |
| WEB_TECHNO_DETROIT | P2 | `LISTED_NOT_DRAFT` (`website/src/content/articles/techno-detroit-historia-musica-electronica.md`) | `website/src/content/articles/techno-detroit-historia-musica-electronica.md` | `NO_VERIFICADO_EN_FUENTE_LOCAL` (no hay paquete `06_Assets` dedicado en C:) | `NO_VERIFICADO_EN_FUENTE_LOCAL` | `D:\FrecuenciaGlobal\ComfyUI\output` (familia `techno-detroit*` + `FG_DETROIT_*`) | `website/public/images/articles/**` + `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.png` | PARTIAL_SIN_BITMAP_ARTICLE_WEB_ARTICLE_IMAGE_BREAK | CRÍTICO | Desbloqueo mínimo: alinear nombres referenciados en markdown con archivos existentes **o** registrar explícitamente el set canónico y su ubicación (C: vs D:) antes de build |

## Hallazgos C: / D: / F:

- **C: repo canónico**: `06_Assets` no contiene PNG en inventario rápido (sin *.png bajo `06_Assets`), lo que contradice manifests “con slides/PNGs” para varias piezas.
- **D: `D:\FrecuenciaGlobal\ComfyUI\output`**: spot-check por `cmd dir` muestra **centenas** de PNG en raíz (196 archivos totales en enumeración recursiva corta previa), incluyendo outputs `techno-detroit*` y `FG_DETROIT_*`, además de familias `blueprint_*` alineadas temáticamente con MVP_01–03.
- **D: `D:\ComfyUI\output`**: existe pero está casi vacío en spot-check (1 PNG), refuerza **dualidad de rutas** ya documentada en D07.
- **D: `D:\FrecuenciaGlobal\06_Assets`**: existe como directorio; **no** se encontraron por spot-check las carpetas `MVP_02`, `MVP_03`, `P1_001`, etc. como subcarpetas.
- **F: `F:\Frecuencia Global\output`**: existe; contiene subcarpeta `meta-business-verification/` y **0 archivos** en raíz (sin evidencia de outputs editoriales aquí).

## Caso Detroit (editorial + website)

### Rutas editoriales existentes (C:)

- Artículo canónico: `website/src/content/articles/techno-detroit-historia-musica-electronica.md`
- QA previo: `07_Operaciones/D05_QA_EDITORIAL_DETROIT_20260428.md`
- Dossier producción: `04_Produccion/dossiers/bass-borders-detroit-berghain/ASSETS_MANIFEST.md`

### Referencias del artículo vs archivos locales

El frontmatter y el cuerpo referencian múltiples rutas bajo `/images/articles/...`. Spot-check por `Test-Path` en:

`C:\Users\farid\Documents\Frecuencia Global\website\public\images\articles\`

Resultado: **todas falsas** para las rutas probadas del bloque principal **excepto** `techno-detroit-featured-card.png` (**true**).

### Estado website

- **Dossier integrado**: `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.png` existe y coincide con la ruta usada en `website/src/pages/pilares/[slug].astro`.
- **Artículo**: integración **parcial** por rotura de bitmaps en `/images/articles/` (consistente con severidad alta en D05).

### Acción mínima de desbloqueo (sin ejecutar en D08)

1. Elegir set canónico de filenames (C: vs renombre vs import desde D:) **solo como decisión documental**.
2. Actualizar referencias **solo después** de que exista match 1:1 entre markdown y archivos presentes (política D09).

## Piezas sin trazabilidad visual completa

Criterio: manifest/tracker menciona PNG o paquetes, pero **no hay binarios trazables en C:** y tampoco subcarpeta en `D:\FrecuenciaGlobal\06_Assets` para la pieza.

- `MVP_02`, `MVP_03`, `P1_003`, `P1_004`, `FG_001`, `EP_001`, `EP_002` (AV), y **parcialmente** `P1_001`, `P1_002`, `MVP_01`.

## Piezas con outputs ComfyUI pero sin integración website

- `MVP_01`–`MVP_03`: publicación social según tracker; **sin evidencia local** de integración en `website/public/images/**`.
- Familia `techno-detroit*` en `D:\FrecuenciaGlobal\ComfyUI\output`: evidencia de generación; website queda **parcial** hasta copiar/seleccionar y referenciar.

## Acciones recomendadas para D09 (consolidación lógica; todavía sin mover archivos)

1. Definir **tabla de decisión** “fuente de verdad por tipo de pieza”: social-first vs web-first vs AV-first.
2. Para web-first (Detroit): cerrar **mapa filename** entre `website/public/images/articles/*` y candidatos `D:\FrecuenciaGlobal\ComfyUI\output\techno-detroit*` / `FG_DETROIT_*` con revisión humana obligatoria.
3. Para social-first (MVP_*): decidir si `06_Assets` debe volver a contener PNG o si el depósito real es exclusivamente D: (documentar, no copiar aún).
4. Resolver drift `P1_002` **documentalmente** (`APPROVAL_PENDING` vs `COMPLETED`) antes de cualquier operación de assets.

## Límites de auditoría (guardrails D08)

- No se recorrieron carpetas masivas tipo `AV/**` ni inventario profundo de outputs; solo **spot-check** y evidencia en manifests/trackers.
- Atribución “este PNG = esta pieza” solo se marca como **candidato** cuando el nombre/tema lo sugiere; si no hay manifest que amarre, queda como **NO VERIFICADO EN FUENTE LOCAL**.
