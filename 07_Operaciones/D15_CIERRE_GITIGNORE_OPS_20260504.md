# D15 — Cierre: `.gitignore` quirúrgico + commit ops de evidencia

**Fecha:** 2026-05-04  
**Rama:** `feature/geopolitik-drop-cards-thumbnails-20260426`

---

## Objetivo

Reducir ruido del working tree ignorando solo artefactos locales repetibles (IDE, caches, backups de rescate, logs), **sin** ignorar fuente del producto ni **`07_Operaciones/*.md`** ni **`07_Operaciones/*.csv`** como categorías (continúan siendo versionables).

---

## Conteo `??` (antes / después)

| Momento | Rutas `??` |
|---------|----------------|
| Antes de actualizar `.gitignore` | **3312** |
| Después de actualizar `.gitignore` | **118** |

*Reducción neta:* **3194** rutas dejan de aparecer como sin seguimiento por exclusión ignorada (sin borrar ni mover archivos en disco).

---

## Patrones añadidos a `.gitignore` (conservadores, comentados)

Bloque **«D15 — Ruido local»** en `.gitignore`:

| Patrón | Finalidad |
|--------|-----------|
| `.claude/` | Worktrees / estado agente embebido |
| `.cursor/` | Estado Cursor local |
| `.vs/` | Visual Studio |
| `.pytest_cache/` | Cache pytest |
| `.git_corrupto_backup_*/` | Snapshot tras incidente de índice Git |
| `**/backups/` | Carpetas nombradas `backups` en cualquier nivel |
| `_repair_backups/` | Árboles de rescate bajo producción |
| `BrowserProfiles/` | Perfiles de navegador locales |
| `Security/` | Área local de seguridad (no confundir con código app) |
| `*.log` | Logs sueltos de ejecución/desarrollo |

**No añadido:** `incident_response/` — en D14 quedó como **evidencia operativa** (no como backup prescindible); ignorarlo habría ocultado material de revisión sin política explícita aparte.

---

## Commit local (sin push)

**Mensaje:** `chore(ops): reduce untracked noise and preserve audit evidence`

**Archivos incluidos (staging selectivo explícito, sin `git add .`):**

1. `.gitignore`
2. `07_Operaciones/D12_AISLAMIENTO_WORKTREE_20260504.md`
3. `07_Operaciones/D12_WORKTREE_PENDING_CHANGES_20260504.patch`
4. `07_Operaciones/D14_AUDITORIA_GRUPO_D_UNTRACKED_20260504.md`
5. `07_Operaciones/D14_AUDITORIA_GRUPO_D_UNTRACKED_20260504.csv`
6. `07_Operaciones/D15_CIERRE_GITIGNORE_OPS_20260504.md` *(este archivo)*

**Identificación Git:** mensaje exacto `chore(ops): reduce untracked noise and preserve audit evidence`. SHA: `git rev-parse HEAD` en la punta tras D15 (no autopersistido en este archivo para evitar desajuste tras amend).

---

## Qué queda pendiente (ruido residual ~118 `??`)

Tras el ignore, suele quedar:

- **`incident_response/`** — evidencia de incidentes (decisión futura: commit selectivo, archivo externo o política aparte).
- **`07_Operaciones/`** — otros ops/backlog no incluidos en este commit (p. ej. retirados, snapshots HTML, `_retired_artifacts/`).
- **`scripts/*.py`** sin seguimiento — scripts auxiliares D07/D… (cribar antes de commit).
- **`website/`** — `netlify.toml`, previews PNG, logs si reaparecen fuera de patrones.
- **Raíz:** `D07_*.json`, `asks_fg_*.csv`.
- **`04_Produccion/`** — restos sueltos no cubiertos por `**/backups/` o `_repair_backups/` (validar caso a caso).

---

## Confirmación de política D15

- **Sin push**, sin deploy, sin APIs, sin Notion.
- **Sin** hard reset, borrado o movimiento de archivos.
- **Sin** modificación de producto (`website/` fuente / editorial / assets del sitio).
- **Sin** lectura ni impresión de secretos.

---

*Cierre operativo D15.*
