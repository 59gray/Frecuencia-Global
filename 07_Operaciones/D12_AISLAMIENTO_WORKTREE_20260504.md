# D12 — Aislamiento del worktree (dummy Detroit cerrado)

**Fecha:** 2026-05-04  
**Objetivo:** distinguir trabajo ya cerrado en Detroit (D09–D11) del trabajo pendiente ajeno al dummy, sin borrar ni perder cambios.

---

## Rama actual

`feature/geopolitik-drop-cards-thumbnails-20260426`

---

## Commits Detroit confirmados (existentes localmente)

| SHA (corto) | SHA completo |
|-------------|---------------|
| `49a9a859` | `49a9a859a7a5f8106ee8560aa83fdef9db6b8002` |
| `444379d7` | `444379d74bef50de00e2d8302782f64fb02e2a2b` |

**Verificación:** `git cat-file -t <sha>` → `commit` para ambos.

---

## Git status (completo — referencia operativa)

- Comando usado para inventario: `git status --porcelain=v1 -u --no-renames`
- **Resultado:** **5** rutas con cambios en índice/working tree respecto a `HEAD` (` M …`), y **3309** rutas sin seguimiento (`?? …`).
- El volcado línea a línea es muy largo; los totales anteriores describen el estado real del árbol de trabajo.

**Coherencia con dummy Detroit (tracked):** no hay diff respecto a `HEAD` en:

- `website/src/content/articles/` (artículo Detroit),
- `website/src/pages/index.astro`,
- `07_Operaciones/D09_*`, `07_Operaciones/D10_*`, `07_Operaciones/D11_*`.

Todo el dummy Detroit referenciado en D09–D11 queda **sin modificaciones locales pendientes** en rutas tracked de esos cierres.

---

## Grupos de cambios pendientes

### A) Ya versionado — Detroit / D09 / D10 / D11

Contenido del cierre dummy en los commits listados arriba. En el estado actual, **no hay diferencias tracked** pendientes sobre el artículo Detroit ni sobre los archivos de cierre D09–D11 ya metidos en esos commits.

### B) Dossier Bass & Borders / imágenes de dossier (tracked)

Archivos modificados respecto a `HEAD` que cubren prompts/docs del dossier y artefacto publicado:

- `04_Produccion/dossiers/bass-borders-detroit-berghain/COMFYUI_DOSSIER_PROMPT.md`
- `04_Produccion/dossiers/bass-borders-detroit-berghain/SERENA_VISUAL_EXTRACTION.md`
- `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.meta.json`
- `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.png`

### C) Scripts ComfyUI / dossier (tracked)

- `scripts/comfyui_dossier_bass_borders.py`

*(Grupos B + C suman los **cinco** archivos con diff tracked frente a `HEAD`.)*

### D) Ops suelto y artefactos no relacionados con el cierre Detroit

Incluye, entre otros (sin listado exhaustivo):

- **~3309** rutas **no rastreadas** (`??`), con concentración fuerte en:
  - `.git_corrupto_backup_20260425/` (mayor volumen),
  - `.claude/` (p. ej. worktree embebido),
  - `incident_response/`,
  - `07_Operaciones/` (varios ops/cierres no parte del patch),
  - `.cursor/`, `.vs/`,
  - copias/backups bajo `04_Produccion/` (p. ej. `_repair_backups/`, `BassAndBorders/backups/`),
  - raíz: `D07_outputs.json`, `D07_job_ids.json`, `asks_fg_2026-04-23.csv`, `.pytest_cache/`, etc.

Este bloque **no está representado** en el archivo patch de respaldo (véase siguiente sección).

---

## Patch de respaldo creado

**Ruta:** `07_Operaciones/D12_WORKTREE_PENDING_CHANGES_20260504.patch`

**Contenido:** salida de `git diff HEAD` — respaldo de los **cinco** archivos **tracked** con modificaciones locales (grupos B + C).

**Límite importante:** las rutas **solo sin seguimiento** (`??`) **no** forman parte de un `git diff` estándar; siguen en disco sin borrar; conviene no mezclarlas con el cierre Detroit hasta decidir ramificación o commits dedicados.

---

## Qué NO tocar (política D12)

- Sin push, sin hard reset, sin borrar ni mover archivos como “limpieza”.
- Sin credenciales, sin Notion/APIs/deploy.
- Sin editar producto salvo documentación de cierre explícita (este archivo es ops).
- No expandir matrices operativas extensas en este cierre.

---

## Recomendación siguiente

1. Tratar **B + C** como un paquete coherente (dossier Bass & Borders + script ComfyUI + PNG/meta en `website/public/images/dossiers/`) y decidir **rama o commit dedicado** cuando toque integrarlo, separado del hilo Detroit ya cerrado.
2. Para **D**, revisar con calma volumen bajo `.git_corrupto_backup_20260425/` y worktrees embebidos antes de cualquier `.gitignore` o staging masivo (no ejecutado en D12).
3. Mantener este patch como ancla reproducible del diff tracked hasta aplicar o descartar cambios de forma explícita.

---

*Cierre D12 — solo documentación ops; sin commit automático en el marco de esta tarea.*
