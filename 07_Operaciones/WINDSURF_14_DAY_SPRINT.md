# WINDSURF_14_DAY_SPRINT

> **Plan operativo de 14 días para migración VS Code: → Windsurf**  
> **Inicio:** 2026-04-25  
> **Fin:** 2026-05-09  
> **Agente:** Windsurf Agent  
> **No-dependencia:** OpenAI/Anthropic

---

## RESUMEN EJECUTIVO

**Objetivo:** Convertir Windsurf en entorno sustituto funcional de VS Code:/Copilot para Frecuencia Global, operando sin tocar credenciales, sin publicar automáticamente, y sin ejecutar cargas pesadas sin autorización.

---

## CRONOGRAMA DETALLADO

### DÍA 1 — Onboarding local y snapshot
**Fecha:** 2026-04-25 (HOY)  
**Estado:** 🟢 EN PROGRESO

| Item | Detalle | Evidencia |
|------|---------|-----------|
| **Objetivo** | Crear base documental para sprint | 6 archivos en `07_Operaciones/` |
| **Archivos a revisar** | `NOTION_FIELD_MAP.json`, `FG_Operations_Log.md`, `pipeline_tracker.json`, `.vscode/*`, `website/*` | ✅ Completado |
| **Archivos a crear** | `WINDSURF_BOOTSTRAP_SNAPSHOT_20260425.md`, `WINDSURF_CONTEXT_FG.md`, `WINDSURF_TOOLING_PARITY.md`, `WINDSURF_14_DAY_SPRINT.md`, `WINDSURF_DAILY_LOG.md`, `WINDSURF_HANDOFF_TO_USER.md` | 🔄 En progreso |
| **Entregable** | Contexto operativo documentado | Archivos `.md` |
| **Riesgo** | Bajo - solo documentación | Mitigado: sin cambios a lógica |
| **Criterio de cierre** | 6 archivos creados con información verificable | Snapshot completado |

**Comandos usados:**
```powershell
Get-Date -Format "yyyy-MM-dd HH:mm:ss K"
Test-Path "C:\Users\farid\Documents\Frecuencia Global"
Get-ChildItem -Depth 2 | ...
```

---

### DÍA 2 — Paridad VS Code: → Windsurf
**Fecha:** 2026-04-26

| Item | Detalle | Evidencia |
|------|---------|-----------|
| **Objetivo** | Replicar `.vscode/` en `.windsurf/` | `.windsurf/rules` funcional |
| **Archivos a revisar** | `.vscode/settings.json`, `.vscode/tasks.json`, `.vscode/extensions.json` | Leer y mapear |
| **Archivos a crear/modificar** | `.windsurf/rules` (nuevo), actualizar `WINDSURF_TOOLING_PARITY.md` | Comandos documentados |
| **Entregable** | Rules de Windsurf + tabla de comandos equivalentes | `.windsurf/rules` |
| **Riesgo** | Bajo | Sin cambios destructivos |
| **Criterio de cierre** | Rules creado, smoke test de 1 script editorial exitoso | Ejecución verificada |

**Tareas específicas:**
- [ ] Crear `.windsurf/rules` con contexto FG
- [ ] Mapear cada tarea de `tasks.json` a comando manual
- [ ] Ejecutar smoke test: `fg_crossref_lookup.py` o `fg_openverse_search.py`
- [ ] Verificar `.venv` funciona en Windsurf

---

### DÍA 3 — Mapa de arquitectura FG
**Fecha:** 2026-04-27

| Item | Detalle | Evidencia |
|------|---------|-----------|
| **Objetivo** | Identificar single sources of truth y documentar flujos | Diagrama/documento de arquitectura |
| **Archivos a revisar** | `system/FUENTE_DE_VERDAD_Y_CONTRATO.md`, `NOTION_FIELD_MAP.json`, `pipeline_tracker.json`, estructura `scripts/` | Leer y mapear |
| **Archivos a crear** | `07_Operaciones/WINDSURF_ARCHITECTURE_MAP.md` o similar | Documento de arquitectura |
| **Entregable** | Mapa de arquitectura con fuentes de verdad identificadas | `.md` con diagrama/diagrama textual |
| **Riesgo** | Bajo | Read-only |
| **Criterio de cierre** | Lista de single sources of truth validada | Consistencia verificada |

**Preguntas a responder:**
- ¿Qué archivo dice la verdad sobre estados de piezas?
- ¿Qué archivo dice la verdad sobre mapeo Notion?
- ¿Qué archivo dice la verdad sobre assets?
- ¿Hay conflictos entre fuentes?

---

### DÍA 4 — Notion local/CSV
**Fecha:** 2026-04-28

| Item | Detalle | Evidencia |
|------|---------|-----------|
| **Objetivo** | Preparar capacidad de backfill CSV sin tocar Notion live | Guía + CSV de ejemplo |
| **Archivos a revisar** | `scripts/notion/*.py`, `NOTION_FIELD_MAP.json`, `07_Operaciones/NOTION_PRIORITY_BACKFILL_V1*.md` | Leer scripts existentes |
| **Archivos a crear** | Guía de backfill seguro, checklist CSV→Notion | `.md` con procedimiento |
| **Entregable** | Guía operativa para export/import CSV auditable | Documento de procedimiento |
| **Riesgo** | Medio - preparar pero NO ejecutar | Solo documentación |
| **Criterio de cierre** | Guía completa, CSV template creado | Preparación verificada |

**Restricciones:**
- NO ejecutar scripts contra Notion live
- NO usar tokens de Notion
- Solo documentar el procedimiento

---

### DÍA 5 — n8n local y observabilidad
**Fecha:** 2026-04-29

| Item | Detalle | Evidencia |
|------|---------|-----------|
| **Objetivo** | Inventariar workflows documentados, identificar bridge/server.js | Lista de workflows + documentación |
| **Archivos a revisar** | `08_n8n/workflows/`, `08_n8n/docs/`, `08_n8n/observability/`, `08_n8n/bridge/` | Listar archivos |
| **Archivos a crear** | `07_Operaciones/N8N_WORKFLOW_INVENTORY.md` | Inventario documentado |
| **Entregable** | Lista de workflows con descripción, triggers, acciones | `.md` con inventario |
| **Riesgo** | Bajo - solo inspección | NO ejecutar runtime |
| **Criterio de cierre** | Inventario completo, identificación de WF críticos | Documentación completa |

**Workflows a buscar:**
- WF-007 (si documentado)
- WF-012 (si documentado)
- SUB-002 (si documentado)
- Telegram alerts (observability)

---

### DÍA 6 — Website Astro/Cloudflare
**Fecha:** 2026-04-30

| Item | Detalle | Evidencia |
|------|---------|-----------|
| **Objetivo** | Documentar build/preview local, identificar riesgos de deploy | Guía de operación web |
| **Archivos a revisar** | `website/package.json`, `website/astro.config.mjs`, `website/wrangler.toml`, `website/src/` | Leer config |
| **Archivos a crear** | `website/OPERATIONS_GUIDE.md` o similar | Guía de build/preview |
| **Entregable** | Guía completa para levantar preview local + checklist pre-deploy | `.md` con procedimientos |
| **Riesgo** | Bajo - build local no afecta producción | npm run dev/build local |
| **Criterio de cierre** | Comandos documentados, dependencias verificadas | Build exitoso opcional |

**Comandos a documentar:**
```bash
cd website
npm install
npm run dev
npm run build
npm run preview
```

---

### DÍA 7 — ComfyUI y assets
**Fecha:** 2026-05-01

| Item | Detalle | Evidencia |
|------|---------|-----------|
| **Objetivo** | Validar documentación de motor gráfico, mapear assets | Mapa de assets + workflows |
| **Archivos a revisar** | `04_Produccion/ComfyUI/`, `website/comfyui-workflows/`, `06_Assets/*/ASSETS_MANIFEST.md` | Leer manifiestos |
| **Archivos a crear** | `07_Operaciones/COMFYUI_ASSET_MAP.md` | Mapa de workflows y outputs |
| **Entregable** | Documentación de rutas D:\FrecuenciaGlobal\AV + workflows locales | `.md` con mapa |
| **Riesgo** | Bajo - solo inspección documental | NO ejecutar ComfyUI |
| **Criterio de cierre** | Rutas verificadas, workflows mapeados | Documentación completa |

**Restricciones:**
- NO ejecutar ComfyUI runtime
- NO mover archivos grandes en D:\
- Solo documentar rutas y workflows existentes

---

### DÍA 8 — Editorial system
**Fecha:** 2026-05-02

| Item | Detalle | Evidencia |
|------|---------|-----------|
| **Objetivo** | Revisar piezas en pipeline, identificar 5 tareas editoriales concretas | Lista priorizada de tareas |
| **Archivos a revisar** | `04_Produccion/*/`, `03_Editorial/_specs/`, `pipeline_tracker.json` | Estado de piezas |
| **Archivos a crear** | `07_Operaciones/EDITORIAL_TASK_QUEUE.md` | Lista de 5 tareas concretas |
| **Entregable** | 5 tareas editoriales priorizadas con pasos claros | `.md` con tareas |
| **Riesgo** | Bajo | Read-only + planificación |
| **Criterio de cierre** | Lista de tareas lista para asignar a Farid | Tareas claras y ejecutables |

**Piezas a revisar:**
- IP_REP_V2_002 (en REVIEW, con 6 archivos de gobernanza)
- EP_001, EP_002 (falta audio master + thumbnail)
- P1_002 (APPROVAL_PENDING)

---

### DÍA 9 — QA documental
**Fecha:** 2026-05-03

| Item | Detalle | Evidencia |
|------|---------|-----------|
| **Objetivo** | Revisar inconsistencias entre documentos, crear tabla de conflictos | Tabla de conflictos |
| **Archivos a revisar** | Todos los `.md` canónicos en paralelo | Comparar información |
| **Archivos a crear** | `07_Operaciones/DOCUMENTATION_CONFLICTS.md` | Tabla: Archivo A / Archivo B / Conflicto / Resolución sugerida |
| **Entregable** | Tabla de conflictos detectados con resoluciones propuestas | `.md` con tabla |
| **Riesgo** | Bajo - solo identificación | NO resolver sin evidencia |
| **Criterio de cierre** | Tabla completa, conflictos clasificados por severidad | QA documental completado |

**Conflictos a buscar:**
- Estados de piezas inconsistentes entre trackers
- Pilares mal asignados
- Fechas de actualización divergentes

---

### DÍA 10 — Automatización segura
**Fecha:** 2026-05-04

| Item | Detalle | Evidencia |
|------|---------|-----------|
| **Objetivo** | Clasificar scripts útiles por nivel de riesgo | Matriz de clasificación |
| **Archivos a revisar** | `scripts/**/*.py`, `tools/**/*.py` | Leer headers y docstrings |
| **Archivos a crear** | `07_Operaciones/SCRIPT_SAFETY_MATRIX.md` | Clasificación: read-only / dry-run / requiere creds / peligroso |
| **Entregable** | Lista clasificada de scripts con comandos seguros | `.md` con matriz |
| **Riesgo** | Bajo | Solo lectura y clasificación |
| **Criterio de cierre** | Todos los scripts relevantes clasificados | Cobertura completa |

**Clasificación:**
- 🟢 **Read-only:** Safe to run (fact-checking, research)
- 🟡 **Dry-run:** Safe con flag `--dry-run`
- 🟠 **Requiere creds:** Necesita tokens (no ejecutar)
- 🔴 **Peligroso:** Publish, deploy, modify (no ejecutar)

---

### DÍA 11 — Limpieza documental no destructiva
**Fecha:** 2026-05-05

| Item | Detalle | Evidencia |
|------|---------|-----------|
| **Objetivo** | Proponer consolidación, marcar obsoletos en índice | Índice actualizado |
| **Archivos a revisar** | `07_Operaciones/` (42 archivos), duplicados, backups `.bak_*` | Identificar redundancia |
| **Archivos a crear** | Actualizar `07_Operaciones/DOCUMENTATION_AUTHORITY_INDEX.md` o similar | Índice con estado de cada doc |
| **Entregable** | Índice de documentación con marca de obsolescencia (solo índice, no borrar archivos) | `.md` con índice |
| **Riesgo** | Muy bajo | NO borrar archivos, solo marcar en índice |
| **Criterio de cierre** | Índice completo, propuesta de consolidación clara | Revisión lista para Farid |

**Restricciones:**
- NO borrar archivos históricos
- NO mover archivos `.bak_*`
- Solo actualizar índice

---

### DÍA 12 — Preparación operativa
**Fecha:** 2026-05-06

| Item | Detalle | Evidencia |
|------|---------|-----------|
| **Objetivo** | Crear checklists para tareas frecuentes | Set de checklists |
| **Archivos a crear** | `07_Operaciones/CHECKLIST_ARTICULO_NUEVO.md`, `CHECKLIST_COVER_NUEVO.md`, `CHECKLIST_POST_PACKAGE.md`, `CHECKLIST_SYNC_NOTION.md`, `CHECKLIST_BUILD_WEB.md`, `CHECKLIST_QA_PRE_PUBLISH.md` | 6 checklists |
| **Entregable** | Checklists operativas listas para usar | 6 archivos `.md` |
| **Riesgo** | Bajo | Documentación procedural |
| **Criterio de cierre** | Checklists completas y revisables | Farid puede seguir paso a paso |

**Checklists a crear:**
1. Artículo nuevo (idea → brief → research)
2. Cover nuevo (brief visual → ComfyUI → export)
3. Post package (copy + assets + hashtags)
4. Sync Notion desde CSV (export → edit → import)
5. Build web local (install → dev → build → preview)
6. QA pre-publicación (checklist final antes de publicar)

---

### DÍA 13 — Simulación de handoff
**Fecha:** 2026-05-07

| Item | Detalle | Evidencia |
|------|---------|-----------|
| **Objetivo** | Redactar handoff completo, listar qué puede pedirse a Windsurf | Borrador de handoff |
| **Archivos a revisar** | Todo el trabajo de días 1-12 | Consolidar |
| **Archivos a crear** | Borrador `WINDSURF_HANDOFF_TO_USER.md` versión preliminar | Handoff inicial |
| **Entregable** | Borrador de handoff con capacidades documentadas | `.md` estructurado |
| **Riesgo** | Bajo | Documentación |
| **Criterio de cierre** | Handoff claro, capacidades y límites bien definidos | Revisable por Farid |

**Secciones del handoff:**
- Qué quedó listo (capacidades operativas)
- Qué puede hacer Windsurf ahora (tareas día a día)
- Qué sigue bloqueado (requiere credenciales/autorización)
- Qué requiere validación humana (siempre)

---

### DÍA 14 — Cierre del sprint
**Fecha:** 2026-05-08

| Item | Detalle | Evidencia |
|------|---------|-----------|
| **Objetivo** | Actualizar logs, consolidar handoff, crear resumen ejecutivo | Cierre documentado |
| **Archivos a revisar** | `WINDSURF_DAILY_LOG.md`, todos los entregables del sprint | Revisar completitud |
| **Archivos a crear** | `WINDSURF_SPRINT_CLOSEOUT.md`, `WINDSURF_EXECUTIVE_SUMMARY.md` | Resúmenes finales |
| **Entregable** | Handoff final, resumen ejecutivo, no tareas ambiguas | `.md` finales |
| **Riesgo** | Bajo | Documentación de cierre |
| **Criterio de cierre** | Toda la documentación está completa y revisable | Sprint cerrado formalmente |

**Acciones de cierre:**
- [ ] Revisar `WINDSURF_DAILY_LOG.md` está actualizado
- [ ] Consolidar `WINDSURF_HANDOFF_TO_USER.md` versión final
- [ ] Crear `WINDSURF_EXECUTIVE_SUMMARY.md` (1 página)
- [ ] Verificar no hay tareas "pendientes" sin asignar
- [ ] Documentar próximo sprint recomendado

---

## RESUMEN DE ENTREGABLES POR DÍA

| Día | Entregable Principal | Archivos Creados/Modificados |
|-----|---------------------|------------------------------|
| 1 | Snapshot + Contexto | 6 archivos `WINDSURF_*.md` |
| 2 | Rules + Paridad | `.windsurf/rules`, update `WINDSURF_TOOLING_PARITY.md` |
| 3 | Mapa arquitectura | `WINDSURF_ARCHITECTURE_MAP.md` |
| 4 | Guía Notion CSV | Guía backfill seguro |
| 5 | Inventario n8n | `N8N_WORKFLOW_INVENTORY.md` |
| 6 | Guía Website | `website/OPERATIONS_GUIDE.md` |
| 7 | Mapa ComfyUI | `COMFYUI_ASSET_MAP.md` |
| 8 | Tareas editoriales | `EDITORIAL_TASK_QUEUE.md` |
| 9 | QA documental | `DOCUMENTATION_CONFLICTS.md` |
| 10 | Matriz scripts | `SCRIPT_SAFETY_MATRIX.md` |
| 11 | Índice docs | Update índice con obsolescencia |
| 12 | Checklists | 6 archivos `CHECKLIST_*.md` |
| 13 | Handoff borrador | `WINDSURF_HANDOFF_TO_USER.md` (draft) |
| 14 | Cierre sprint | `WINDSURF_SPRINT_CLOSEOUT.md`, `WINDSURF_EXECUTIVE_SUMMARY.md` |

**Total archivos nuevos estimados:** ~20-25 archivos  
**Total archivos modificados:** ~5 archivos  
**Todo verificable localmente:** ✅ Sí

---

## LÍMITES DEL SPRINT

**NO se hará:**
- ❌ Push a GitHub (no es repo)
- ❌ Deploy a Cloudflare
- ❌ Ejecutar n8n runtime
- ❌ Ejecutar ComfyUI runtime
- ❌ Publicar en redes sociales
- ❌ Modificar Notion live
- ❌ Usar tokens/credenciales

**SÍ se hará:**
- ✅ Documentar todo lo anterior
- ✅ Preparar procedimientos
- ✅ Crear checklists
- ✅ Mapear workflows
- ✅ Identificar tareas
- ✅ Clasificar scripts

---

**Estado actual del sprint:** 🟢 DÍA 1 EN PROGRESO  
**Próximo entregable:** Completar 6 archivos de bootstrap
