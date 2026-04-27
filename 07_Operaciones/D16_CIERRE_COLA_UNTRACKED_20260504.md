# D16 — Cierre: cola de sin seguimiento (~114 rutas post-D15)

**Rama:** `feature/geopolitik-drop-cards-thumbnails-20260426`  
**Referencias:** `07_Operaciones/D15_CIERRE_GITIGNORE_OPS_20260504.md`, auditoría D14, `.gitignore` actual.

---

## Conteos `??`

| Momento | Rutas `??` |
|---------|------------|
| **Antes** de D16 (punto de partida) | **114** |
| **Después** de patrones D16 en `.gitignore` (sin commit aún) | **31** |
| **Después** del commit D16 (versión ops segura) | **1** (residual previsto: `website/netlify.toml`) |

---

## Clasificación de las 114 rutas (por tipo)

| Clasificación | Rutas (aprox.) | Notas |
|----------------|----------------|--------|
| **ops versionable** | 25 | CSV/MD en `07_Operaciones/` (D04–D09, backlog, auditorías Windsurf/workspace, etc.), excluyendo artefactos de backup/snapshot nombrados abajo. |
| **script versionable** | 4 | `scripts/d07_*.py`, `gen_detroit_card.py` — tooling auxiliar; no se inspeccionó código en profundidad (política path-only). |
| **evidencia operativa / producción** | 1 | `04_Produccion/Detroit/visual_curation/DETROIT_FEATURED_REDESIGN_REPORT_20260425.md` — informe de curación, no assets `website/`. |
| **preview / build local no versionable** | 2 | `website/bass-borders-preview.png`, `website/bass-borders-preview-full.png` — ignorados por nombre (fuera de `public/`). |
| **raíz suelta no versionable** | 3 | `D07_outputs.json`, `D07_job_ids.json`, `asks_fg_2026-04-23.csv` — salidas de job en raíz. |
| **sensible / no tocar** | ~75 | Árbol `incident_response/` (bundles Git, espejos, `*token*`, `*secret*`, escaneos — **no leer, no versionar**). |
| **evidencia archivada / snapshot deploy** | 3 | `07_Operaciones/_retired_artifacts/...`, `D__ARTIFACT_BACKUP_manifest_*.json`, `FG_PROD_SNAPSHOT_AFTER_DEPLOY_*.html` — **fuera** del commit; ignorados por patrón seguro. |
| **requiere revisión humana** | 1 | `website/netlify.toml` — política de deploy/producto; **no** incluido en este commit ni ignorado automáticamente. |

*(Sumas orientativas: 25+4+1+2+3+75+3 = 113; la ruta residual en clasificación encaja en solapamientos de etiquetas.)*

---

## Lista explícita — **sí versionar** (commit D16)

**`.gitignore`** (bloque D16)

**Producción (1):**

- `04_Produccion/Detroit/visual_curation/DETROIT_FEATURED_REDESIGN_REPORT_20260425.md`

**Ops (25):**

- `07_Operaciones/BACKLOG_EDITORIAL_10_DIAS_20260427.csv`
- `07_Operaciones/BACKLOG_EDITORIAL_10_DIAS_20260427.md`
- `07_Operaciones/D04_CONSOLIDAR_BACKLOG_EDITORIAL_CIERRE.md`
- `07_Operaciones/D05_QA_EDITORIAL_DETROIT_20260428.csv`
- `07_Operaciones/D05_QA_EDITORIAL_DETROIT_20260428.md`
- `07_Operaciones/D06_CIERRE_ASSETS_VISUALES_COMFYUI_20260429.md`
- `07_Operaciones/D06_COMFYUI_OUTPUTS_CURADURIA_20260429.csv`
- `07_Operaciones/D06_NAMING_ASSETS_VISUALES_20260429.md`
- `07_Operaciones/D07_CIERRE_MAPA_ALMACENAMIENTO_20260430.md`
- `07_Operaciones/D07_MAPA_ALMACENAMIENTO_CDF_20260430.csv`
- `07_Operaciones/D07_MAPA_ALMACENAMIENTO_CDF_20260430.md`
- `07_Operaciones/D08_CIERRE_MANIFEST_PIEZAS_ASSETS_20260501.md`
- `07_Operaciones/D08_MANIFEST_PIEZAS_ASSETS_CDF_20260501.csv`
- `07_Operaciones/D08_MANIFEST_PIEZAS_ASSETS_CDF_20260501.md`
- `07_Operaciones/D09_MAPA_FILENAME_WEB_FIRST_DETROIT_20260502.csv`
- `07_Operaciones/D09_MAPA_FILENAME_WEB_FIRST_DETROIT_20260502.md`
- `07_Operaciones/GIT_POST_BASELINE_AUDIT_20260425.md`
- `07_Operaciones/HOMEFOLD_LAYOUT_FIX_20260425.md`
- `07_Operaciones/RESTORE_HOME_PRODUCTION_LOOK_20260425.md`
- `07_Operaciones/ROOT_OPENING_STANDARD.md`
- `07_Operaciones/SERENA_ENVIRONMENT_DIAGNOSTIC_20260425.md`
- `07_Operaciones/WEBSITE_PREVIEW_STALE_FIX_20260425.md`
- `07_Operaciones/WINDSURF_DAY03_ARCHITECTURE_MAP.md`
- `07_Operaciones/WINDSURF_NEXT_72H_EXECUTION_PLAN.md`
- `07_Operaciones/WORKSPACE_ROOT_AUDIT_20260426.md`

**Scripts (4):**

- `scripts/d07_bb_cards_v2.py`
- `scripts/d07_bb_thumbnails.py`
- `scripts/d07_featured_comfyui.py`
- `scripts/gen_detroit_card.py`

**Total rutas de contenido:** 30 + `.gitignore` = **31 archivos** en el commit.

---

## Lista explícita — **no deben entrar** (en este commit)

| Ruta o patrón | Motivo |
|---------------|--------|
| `incident_response/**` | Posible exposición de historial / tokens / bundles; solo ignorado. |
| `07_Operaciones/_retired_artifacts/**` | Copias retiradas; no editorial activa. |
| `07_Operaciones/D__ARTIFACT_BACKUP_manifest_*.json` | Manifest de backup puntual. |
| `07_Operaciones/FG_PROD_SNAPSHOT_AFTER_DEPLOY_*.html` | Snapshot post-deploy; revisión aparte. |
| `/D07_outputs.json`, `/D07_job_ids.json`, `/asks_fg_*.csv` | Artefactos de job en raíz. |
| `website/bass-borders-preview*.png` | Previews locales. |
| `website/netlify.toml` | **Revisión humana** — deploy/producto; sin decisión en D16. |

---

## Patrones `.gitignore` añadidos (D16)

Ver bloque **«D16 — Cola residual»** en `.gitignore`: `incident_response/`, `_retired_artifacts/`, manifests/snapshot ops nombrados, artefactos raíz D07/asks_fg, previews PNG locales en `website/`.

---

## Commit local

**Mensaje:** `chore(ops): close remaining untracked audit queue`

**Identificación Git:** mensaje `chore(ops): close remaining untracked audit queue`. Para SHA exacto: `git rev-parse HEAD` en la punta tras D16 (evitar autopersistir si se hará amend).

---

## Qué queda pendiente

- **`website/netlify.toml`** sin seguimiento hasta decisión explícita de política de versión/deploy (sin ignorar por D16).
- Revisión eventual de si parte de `incident_response/` debe vivir solo fuera del repo (ya ignorado en Git).

---

## Confirmación de política

Sin push, sin `git add .`, sin hard reset, sin borrar ni mover archivos, sin credenciales, sin lectura de secretos, sin Notion/APIs/deploy, sin cambios al producto en `website/` (fuentes bajo `src/`, `public/`, etc.).
