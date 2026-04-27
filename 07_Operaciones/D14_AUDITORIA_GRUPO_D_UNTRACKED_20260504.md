# D14 — Auditoría del grupo D (archivos sin seguimiento)

**Fecha:** 2026-05-04  
**Rama:** `feature/geopolitik-drop-cards-thumbnails-20260426`

---

## Alcance y política

- **Fuente:** `git status --porcelain=v1 -u --no-renames`, líneas `??`.
- **Inventario clasificado:** **3310** rutas (la captura excluye artefactos D14 en construcción: `_d14_classify.ps1`, este `.md` y el `.csv` hasta que existan en el árbol).
- **Método:** solo **ruta, nombre y extensión**; **sin** lectura de `.env`, tokens, cookies, BrowserProfiles, Security, ni contenido de backups sensibles.
- **Referencias locales:** `07_Operaciones/D12_AISLAMIENTO_WORKTREE_20260504.md`, `07_Operaciones/D12_WORKTREE_PENDING_CHANGES_20260504.patch`.
- **Commits de contexto** (solo referencia): `49a9a859a7a5f8106ee8560aa83fdef9db6b8002`, `444379d74bef50de00e2d8302782f64fb02e2a2b`, `4d095ee564cd9cad7ac96e82a474ea7f6a844b8e`.

---

## Conteo por categoría

| Categoría | Rutas |
|-----------|-------|
| backup local | 2583 |
| IDE/agent state | 603 |
| evidencia operativa | 79 |
| ops legítimo | 32 |
| asset candidato | 6 |
| zona sensible/no tocar | 4 |
| basura probable | 2 |
| cache/tooling | 1 |
| **Total** | **3310** |

---

## Conteo por prefijo raíz (primer segmento)

| Prefijo raíz | Rutas |
|----------------|-------|
| `.git_corrupto_backup_20260425` | 2562 |
| `.claude` | 596 |
| `incident_response` | 76 |
| `07_Operaciones` | 30 |
| `04_Produccion` | 22 |
| `.vs` | 9 |
| `website` | 5 |
| `scripts` | 4 |
| `.cursor` | 2 |
| `.pytest_cache` | 1 |
| `D07_job_ids.json` | 1 |
| `D07_outputs.json` | 1 |
| `asks_fg_2026-04-23.csv` | 1 |

*(La suma coincide con 3310.)*

---

## Tabla de decisión (por categoría)

| Categoría | Riesgo típico | Acción recomendada (siguiente fase) | Candidato `.gitignore` | Candidato commit futuro | Candidato mover a `D:/` |
|-----------|---------------|-------------------------------------|-------------------------|---------------------------|---------------------------|
| backup local | medio | Ignorar en repo + archivo externo | **Sí** (plantillas glob) | No | **Sí** |
| IDE/agent state | medio | Ignorar; no versionar tooling | **Sí** (`/.claude/`, `/.cursor/`, `.vs/`) | No | Opcional si se externaliza tooling |
| evidencia operativa | bajo–medio | Documentar índice ops; cribar subsets | Parcial (`incident_response/`…) | Quizá CSV/MD puntuales | **Sí** volumen grande |
| ops legítimo | bajo | Commits ops selectivos (tipo D09–D13) | No para `07_Operaciones/*.md` productivos | **Sí** | No |
| asset candidato | bajo | Revisar duplicados vs `public/` | Parcial (`website/*.png` preview) | Maybe scripts/`website` | Si duplica prod |
| zona sensible/no tocar | alto | **No abrir** en automatización | No (no exponer rutas en ignore público sin revisión) | No | Opcional copia cifrada fuera repo |
| basura probable | bajo | Ignorar logs | **Sí** (`*.log`, `astro-dev*.log`) | No | No |
| cache/tooling | bajo | Ignorar | **Sí** (`.pytest_cache/`) | No | No |

**Nota:** En esta fase **no** se editó `.gitignore`; la columna solo lista **candidatos** para una tarea posterior.

---

## Hallazgos puntuales (solo rutas)

- **Zona sensible (4 rutas):** incluye `settings.local.json`, script con `token` en nombre bajo `.claude/worktrees/`, y artefactos `*_token*.txt` bajo `incident_response/`. **No inspeccionar contenido** hasta política explícita.
- **Ops sin seguimiento (`07_Operaciones/`, 30):** incluye `D12_*` y otros cierres/backlog — candidatos naturales a commit ops aparte (sin `git add .`).
- **Raíz:** `D07_outputs.json`, `D07_job_ids.json`, `asks_fg_*.csv` — artefactos de jobs; mejor ignorar o mover a almacén externo.

---

## Confirmación de ejecución D14

En esta tarea **no** se realizó: `push`, `commit`, `git add .`, `git add` selectivo de masivos, `hard reset`, borrado, movimiento de archivos, ni modificación de producto. Solo se generó documentación y el CSV inventariado.

---

## Entregables

| Archivo | Descripción |
|---------|-------------|
| `07_Operaciones/D14_AUDITORIA_GRUPO_D_UNTRACKED_20260504.csv` | Una fila por ruta `??`, columnas según especificación D14, codificación UTF-8 con BOM. |
| Este informe | Resumen ejecutivo y tabla de decisión. |

**Recomendación siguiente:** tarea dedicada «D15» o similar: proponer parches **acotados** a `.gitignore` (solo globs validados) y un plan de commit por lotes para `07_Operaciones/` y scripts, sin tocar las 4 rutas sensibles hasta revisión humana.
