# WINDSURF_TOOLING_PARITY

> **Paridad de herramientas: VS Code → Windsurf**  
> **Fecha:** 2026-04-25 (actualizado 2026-04-25 sesión Día 2)  
> **Estado:** ✅ Día 2 completado — Paridad documentada, comandos mapeados

---

## 1. RESUMEN

Este documento mapea qué capacidades de VS Code: están disponibles en Windsurf, qué se puede replicar, y qué NO debe copiarse por seguridad.

---

## 2. VS CODE: CONFIGURACIÓN ACTUAL (Inventariada Día 2)

### 2.1 settings.json

**Ubicación:** `.vscode/settings.json` (486 bytes)

```json
{
  "[python]": {
    "defaultInterpreterPath": "${workspaceFolder}/.venv/Scripts/python.exe",
    "linting.ruffPath": "${workspaceFolder}/.venv/Scripts/ruff.exe",
    "linting.enabled": true,
    "linting.ruffEnabled": true
  },
  "ruff.path": ["${workspaceFolder}/.venv/Scripts/ruff.exe"],
  "ruff.interpreter": ["${workspaceFolder}/.venv/Scripts/python.exe"],
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  },
  "astro.deno.enable": false
}
```

**Capacidades detectadas:**
- Python con venv localizado (`.venv/Scripts/python.exe`)
- Linting con Ruff (`.venv/Scripts/ruff.exe`)
- Formateo Astro (`astro-build.astro-vscode`)

### 2.2 tasks.json (6 tareas inventariadas)

**Ubicación:** `.vscode/tasks.json` (2,664 bytes)

| # | Label | Tipo | Comando | Args | Propósito |
|---|-------|------|---------|------|-----------|
| 1 | FG Editorial: env check | shell | `powershell.exe` | `-ExecutionPolicy Bypass -File tools/editorial/scripts/fg_editorial_env_check.ps1` | Verificar entorno editorial |
| 2 | FG Editorial: Crossref smoke | shell | `python` | `tools/editorial/scripts/fg_crossref_lookup.py --query "Detroit techno" --rows 3 --out-md tools/editorial/reports/crossref_smoke_20260424.md` | Buscar DOI en Crossref |
| 3 | FG Editorial: FactCheck smoke | shell | `python` | `tools/editorial/scripts/fg_factcheck_search.py --query "Detroit techno Juan Atkins" --language en --page-size 5 --out-md tools/editorial/reports/factcheck_smoke_20260424.md` | Verificación de hechos |
| 4 | FG Editorial: Openverse smoke | shell | `python` | `tools/editorial/scripts/fg_openverse_search.py --media images --query "Detroit techno" --license by --rows 10 --out-md tools/editorial/reports/openverse_smoke_20260424.md` | Buscar assets libres |
| 5 | FG Editorial: asset metadata | shell | `powershell.exe` | `-ExecutionPolicy Bypass -File tools/editorial/scripts/fg_asset_metadata.ps1 -Path 04_Produccion -Out tools/editorial/reports/asset_metadata_repo_20260424.md` | Escanear metadatos assets |
| 6 | FG Editorial: skeleton refresh | shell | `python` | `tools/editorial/scripts/fg_build_piece_evidence_skeleton.py --piece-id IP_REP_V2_002 --title "Techno en Detroit y Berlin: cruce de fronteras sonoras" --out-dir 04_Produccion` | Crear estructura pieza |

### 2.3 extensions.json

**Ubicación:** `.vscode/extensions.json` (182 bytes)

```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "charliermarsh.ruff",
    "ms-python.python",
    "ms-vscode.powershell"
  ],
  "unwantedRecommendations": []
}
```

**Extensiones recomendadas:**
1. `astro-build.astro-vscode` — Soporte Astro
2. `charliermarsh.ruff` — Python linting
3. `ms-python.python` — Python support
4. `ms-vscode.powershell` — PowerShell support

### 2.4 launch.json

**Estado:** ❌ No existe (`.vscode/launch.json` no encontrado)

**Impacto:** Debug Python requiere configuración manual o uso de `print()` + logs

---

## 3. EQUIVALENCIA WINDSURF

### 3.1 ¿Qué SÍ está disponible?

| Capacidad VS Code: | Windsurf Equivalente | Notas |
|--------------------|----------------------|-------|
| Terminal integrada | ✅ Terminal integrado | Mismo PowerShell/bash |
| Ejecutar scripts | ✅ `run_command` tool | Disponible, requiere aprobación usuario |
| Python + venv | ✅ Detecta venv automáticamente | Verificar path |
| IntelliSense | ✅ Cascade + contexto | Funciona con archivos abiertos |
| Markdown preview | ✅ Built-in | Disponible |
| JSON validation | ✅ Built-in | Disponible |

### 3.2 ¿Qué NO está disponible (o es diferente)?

| Capacidad VS Code: | Estado en Windsurf | Alternativa |
|--------------------|-------------------|-------------|
| `tasks.json` | ❌ No exacto | `.windsurf/rules` + documentación manual |
| `launch.json` | ❌ No exacto | Terminal manual + documentación |
| Extensiones marketplace | ⚠️ Limitado | Funcionalidades core están |
| `settings.json` workspace | ⚠️ Diferente | User settings en Windsurf |

### 3.3 ¿Qué DEBE crearse?

| Componente | Ubicación | Prioridad |
|------------|-----------|-----------|
| `.windsurf/rules` | `C:\Users\farid\Documents\Frecuencia Global\.windsurf\rules` | Alta (Día 2) |
| Comandos documentados | Este archivo + contexto | Media |
| Scripts envoltorio | `tools/windsurf/` si necesario | Baja |

---

## 4. MAPEO DE TAREAS

### 4.1 Tareas seguras para Windsurf

| Tarea VS Code: | Comando Windsurf equivalente | Riesgo |
|----------------|------------------------------|--------|
| env check | `powershell -File tools/editorial/scripts/fg_editorial_env_check.ps1` | 🟢 Bajo |
| Crossref smoke | `python tools/editorial/scripts/fg_crossref_lookup.py --query "..." --rows 3 --out-md ...` | 🟢 Bajo |
| Openverse smoke | `python tools/editorial/scripts/fg_openverse_search.py ...` | 🟢 Bajo |
| asset metadata | `powershell -File tools/editorial/scripts/fg_asset_metadata.ps1 ...` | 🟢 Bajo |

### 4.2 Tareas que requieren verificación

| Tarea VS Code: | Bloqueo | Solución propuesta |
|----------------|---------|-------------------|
| FactCheck smoke | Requiere `FG_FACTCHECK_API_KEY` | Verificar si existe en `.env` local, documentar cómo obtener |
| skeleton refresh | Crea archivos en `04_Produccion/` | Crear backup manual antes de ejecutar |

### 4.3 Clasificación Build (website/)

**Archivo revisado:** `website/package.json` (FASE 3 — Reparación Operativa 2026-04-25)

| Script | Comando | Clasificación | Justificación |
|--------|---------|---------------|---------------|
| `dev` | `astro dev` | ✅ **Tier 1 — Seguro** | Servidor desarrollo local, no publica |
| `build` | `astro build` | ✅ **Tier 1 — Seguro** | Genera archivos estáticos localmente, no deploy |
| `preview` | `astro preview` | ✅ **Tier 1 — Seguro** | Preview local de build, no publica |
| `astro` | `astro` | ✅ **Tier 1 — Seguro** | CLI Astro, comandos manuales |
| *(ausente)* | `wrangler deploy` | ⚠️ **Tier 4 — Bloqueado** | Requiere autorización explícita |

**Verificación de seguridad:**
- ✅ `wrangler` presente como `devDependency` pero **NO** en scripts
- ✅ NO hay scripts `deploy`, `publish`, `upload`
- ✅ `build` = solo Astro build estático (genera `dist/` local)

**Comando verificado seguro para ejecutar:**
```bash
cd website && npm run build
```

### 4.4 Tareas que NO se migrarán

| Tarea VS Code: | Razón |
|----------------|-------|
| Cualquier tarea con token/credencial | Política de no secretos |
| Tareas de publicación (deploy) | No automatizar sin autorización |
| Tareas n8n runtime | Requiere `.env` |

---

## 5. REPLICABILIDAD

### 5.1 Extensiones VS Code: relevantes

| Extensión | Función | Estado en Windsurf |
|-----------|---------|-------------------|
| astro-build.astro-vscode | Astro support | ⚠️ Verificar syntax highlighting |
| charliermarsh.ruff | Python linting | ✅ Ruff disponible via CLI |
| ms-python.python | Python support | ✅ Built-in |
| bradlc.vscode-tailwindcss | Tailwind IntelliSense | ⚠️ Verificar |

### 5.2 Equivalentes sugeridos

```
# Ruff (ya configurado en .venv)
.venv/Scripts/ruff.exe check .
.venv/Scripts/ruff.exe format .

# Astro (via npm)
cd website && npm run astro check

# TypeScript (via npm)
cd website && npx tsc --noEmit
```

---

## 6. COMANDOS DOCUMENTADOS (Día 2)

### 6.1 Comandos SEGUROS (Read-Only / Dry-Run)

**Tier 0 — Research APIs (Bajo riesgo, solo lectura):**

| # | Comando | Origen VS Code: | Riesgo | Notas |
|---|---------|-----------------|--------|-------|
| 1 | `python tools/editorial/scripts/fg_crossref_lookup.py --query "..." --rows N --out-md PATH` | Task 2: Crossref smoke | 🟢 Bajo | API externa Crossref, read-only |
| 2 | `python tools/editorial/scripts/fg_openverse_search.py --media images --query "..." --license by --rows N` | Task 4: Openverse smoke | 🟢 Bajo | API externa Openverse, read-only |
| 3 | `python tools/editorial/scripts/fg_factcheck_search.py --query "..." --language en --page-size N` | Task 3: FactCheck smoke | 🟡 Medio | Requiere `FG_FACTCHECK_API_KEY`, degrade gracefully |

**Tier 0 — Entorno local (Bajo riesgo, solo lectura):**

| # | Comando | Origen VS Code: | Riesgo | Notas |
|---|---------|-----------------|--------|-------|
| 4 | `powershell -File tools/editorial/scripts/fg_editorial_env_check.ps1` | Task 1: env check | 🟢 Bajo | Verifica entorno, no modifica archivos |
| 5 | `powershell -File tools/editorial/scripts/fg_asset_metadata.ps1 -Path 04_Produccion -Out PATH` | Task 5: asset metadata | 🟢 Bajo | Escanear assets existentes, no crea nuevos |

**Tier 0 — Build local (Bajo riesgo, no deploy):**

| # | Comando | Origen VS Code: | Riesgo | Notas |
|---|---------|-----------------|--------|-------|
| 6 | `cd website && npm run build` | Build Astro | 🟢 Bajo | Build estático, no deploy |
| 7 | `cd website && npm run dev` | Dev server | 🟢 Bajo | Preview local, no publica |
| 8 | `.venv/Scripts/ruff.exe check .` | Linting | 🟢 Bajo | Solo análisis, no modifica |

### 6.2 Comandos BLOQUEADOS (Forbidden)

| Patrón | Razón | Tier | Origen/Contexto |
|--------|-------|------|-----------------|
| `cat.*\.env`, `type.*\.env`, `Get-Content.*\.env` | Exposición de credenciales | Tier 3 | `.windsurf/rules` denylist |
| `docker.*up.*n8n` | Inicio de servicios requiere autorización | Tier 4 | `.windsurf/rules` forbidden |
| `wrangler deploy` | Deploy a producción | Tier 4 | `.windsurf/rules` forbidden |
| `npm run deploy` | Deploy a producción | Tier 4 | `.windsurf/rules` forbidden |
| `python.*publish` | Publicación automatizada | Tier 4 | `.windsurf/rules` forbidden |
| `publish_dispatch` | Scripts de publicación | Tier 4 | `.windsurf/rules` forbidden |
| `notion.*import.*token` | Importación con tokens | Tier 3 | `.windsurf/rules` forbidden |

### 6.3 Comandos que requieren BACKUP previo (Tier 2)

| Comando | Origen VS Code: | Riesgo | Condición |
|---------|-----------------|--------|-----------|
| `python tools/editorial/scripts/fg_build_piece_evidence_skeleton.py --piece-id ID --out-dir 04_Produccion` | Task 6: skeleton refresh | 🟡 Medio | **Crea archivos en 04_Produccion/**. Requiere: 1) Backup 07_Operaciones/ si se modifica, 2) Verificar pieza ID existe en pipeline_tracker.json |

### 6.4 PowerShell Read-Only (Windsurf tool-safe)

```powershell
# Listar archivos con metadata
Get-ChildItem -Filter "*.md" | Select-Object Name, LastWriteTime, Length

# Verificar existencia
Test-Path "archivo.json" -PathType Leaf

# Búsqueda segura de strings
Select-String -Path "*.md" -Pattern "TODO|FIXME"

# Calcular hash para verificación
Get-FileHash "archivo.md" -Algorithm SHA256

# Verificar estado Git
git status --short 2>$null; if ($LASTEXITCODE -eq 0) { "Repo Git" } else { "No es repo Git" }
```

---

## 7. BRECHAS DETECTADAS (Actualizado Día 2)

| Brecha | Impacto | Mitigación | Estado Día 2 |
|--------|---------|------------|--------------|
| No `tasks.json` integrado | Tareas no están a un click | Tabla de comandos equivalentes en Sección 6 | ✅ Documentado |
| No `launch.json` | Debug Python requiere terminal | Usar `print()` + logs, o debug manual | ✅ Documentado |
| Sin `.windsurf/rules` | Contexto inicial vacío | Creado en Día 1, confirmado Día 2 | ✅ Completado |
| Extensiones marketplace | No hay GUI de extensiones | Usar CLI tools (ruff, astro, npm) | ✅ Aceptado |
| Settings workspace | User settings diferentes | Configs en `.windsurf/rules` | ✅ Documentado |

---

## 8. ACCIONES COMPLETADAS (DÍA 2)

- [x] ✅ Confirmar `.windsurf/rules` como marco operativo (leído, adoptado)
- [x] ✅ Inventariar `.vscode/` completo (settings.json, tasks.json, extensions.json, launch.json ausente)
- [x] ✅ Documentar comandos equivalentes para cada tarea de `tasks.json` (6 tareas mapeadas)
- [x] ✅ Clasificar comandos seguros vs. bloqueados (8 seguros, 7+ bloqueados)
- [x] ✅ Documentar brechas de paridad (4 brechas identificadas)
- [ ] ⏳ Verificar `.venv` está funcional en Windsurf (smoke test pendiente autorización)
- [ ] ⏳ Probar un script de tooling editorial como smoke test (pendiente autorización)
- [ ] ⏳ Documentar cómo obtener `FG_FACTCHECK_API_KEY` (pendiente research)

---

## 9. CHECKLIST DE PARIDAD

| Capacidad | VS Code: | Windsurf | Estado |
|-----------|----------|----------|--------|
| Python venv | ✅ | ✅ | Verificar |
| Ruff linting | ✅ | ✅ | Via CLI |
| Astro dev | ✅ | ✅ | Via npm |
| Editorial scripts | ✅ | ✅ | Documentar |
| Tasks a un click | ✅ | ⚠️ | Documentar comandos |
| Debug Python | ✅ | ⚠️ | Terminal manual |
| Git GUI | ✅ | ⚠️ | Terminal git |

---

**Conclusión:** Windsurf puede operar como sustituto funcional de VS Code: para tareas documentales, editorial y web. La principal brecha es la ausencia de `tasks.json` integrado, que se mitiga documentando los comandos equivalentes.

**Próximo paso:** Crear `.windsurf/rules` y ejecutar smoke test de un script editorial.
