# WINDSURF_CONTEXT_FG

> **Contexto operativo completo para agente Windsurf**  
> **Proyecto:** Frecuencia Global  
> **Sprint:** 14 días migración VS Code → Windsurf  
> **Actualizado:** 2026-04-25

---

## 1. RESUMEN EJECUTIVO

Frecuencia Global es un proyecto editorial multiplataforma que combina:
- **Geopolítica y política migratoria** (P1 Geopolitik Drop)
- **Música electrónica y fronteras** (P2 Bass & Borders)
- **Cultura global y tendencias** (P3 Frecuencia Global)
- **Análisis de política pública** (P4 Behind the Policy)

**Stack técnico:** Astro + Cloudflare + n8n + ComfyUI + Notion (hub operativo)

---

## 2. ARQUITECTURA ACTUAL

### 2.1 Órganos del Proyecto

| Órgano | Responsabilidad | Ubicación | Estado |
|--------|----------------|-----------|--------|
| **Editorial** | Contenido, investigación, piezas | `03_Editorial/`, `04_Produccion/` | Activo |
| **Plataformas** | Distribución, publicación | `scripts/publish_dispatch/`, `08_n8n/` | Activo |
| **Assets** | Imágenes, videos, audio | `06_Assets/`, `D:\FrecuenciaGlobal\AV` | Activo |
| **Operaciones** | Logs, tracking, coordinación | `07_Operaciones/` | Activo |
| **Web** | Site Astro + Cloudflare | `website/` | Activo |

### 2.2 Flujo Editorial (Estandarizado)

```
IDEA → RESEARCH → DRAFT → REVIEW → APPROVED → READY_TO_PRODUCE → SCHEDULED → PUBLISHED
     ↓           ↓        ↓         ↓             ↓                  ↓           ↓
  TPL_IdeaCard  Research  Script   QA Gate    Design Done       Post Package   Multi-platform
```

**Mapeo Notion ↔ Repo:**
- `NOTION_FIELD_MAP.json` define 10 estados posibles
- `pipeline_tracker.json` es la autoridad local de estados
- NOTION es el hub operativo (no tocar sin autorización)

### 2.3 Pilares Estratégicos

| Pilar | Nombre | Tipo de contenido |
|-------|--------|-------------------|
| P1 | Geopolitik Drop | Geopolítica, conectividad, infraestructura |
| P2 | Bass & Borders | Música electrónica, fronteras, migración |
| P3 | Frecuencia Global | Cultura, tendencias, análisis global |
| P4 | Behind the Policy | Política pública, migración, análisis |

---

## 3. HERRAMIENTAS ACTIVAS

### 3.1 Website (Astro + Cloudflare)

| Componente | Versión | Configuración |
|------------|---------|---------------|
| Astro | 6.1.2 | `website/astro.config.mjs` |
| Tailwind | 4.2.2 | Via Vite plugin |
| Wrangler | 4.81.0 | Cloudflare Pages |
| Site | frecuenciaglobal.org | Deploy en `dist/` |

**Comandos seguros:**
```bash
cd website
npm install          # Solo si package.json cambió
npm run dev          # Preview local
npm run build        # Build estático
npm run preview      # Preview del build
```

### 3.2 Tooling Editorial (Recién creado 2026-04-24)

Ubicación: `tools/editorial/`

| Script | Propósito | Estado |
|--------|-----------|--------|
| `fg_editorial_env_check.ps1` | Verificar entorno | ✅ Listo |
| `fg_crossref_lookup.py` | Búsqueda académica | ✅ Listo |
| `fg_factcheck_search.py` | Fact-checking | ⚠️ Requiere API key |
| `fg_openverse_search.py` | Assets Creative Commons | ✅ Listo |
| `fg_asset_metadata.ps1` | Metadata de assets | ✅ Listo |
| `fg_build_piece_evidence_skeleton.py` | Estructura evidencia | ✅ Listo |

**Integración VS Code:**
- `tasks.json` tiene 6 tareas mapeadas a estos scripts
- Se migrará a `.windsurf/` en Día 2

### 3.3 Scripts Legacy

Ubicación: `scripts/`

| Categoría | Scripts | Estado |
|-----------|---------|--------|
| `notion/` | API client, seed, export/import | ⚠️ Requiere token |
| `publish_dispatch/` | Buffer, Meta, X, LinkedIn | ⚠️ Requiere credenciales |
| `social_operations/` | Automatización redes | ⚠️ Requiere credenciales |
| `comfy/` | Adapters ComfyUI | ✅ Read-only safe |
| `pipeline/` | Management pipeline | ✅ Read-only safe |

### 3.4 n8n Local

Ubicación: `08_n8n/`

| Componente | Estado | Nota |
|------------|--------|------|
| `.env` | 🔴 NO TOCAR | Contiene tokens |
| `bridge/` | Verificar | Posible `server.js` |
| `workflows/` | Documentar | Inventariar nombres |
| `observability/` | Telegram alerts | Seguro leer |

---

## 4. HERRAMIENTAS BLOQUEADAS (No disponibles)

| Herramienta | Razón | Alternativa local |
|-------------|-------|-------------------|
| Claude Agent | No dependencia OpenAI/Anthropic | Windsurf Agent |
| VS Code Agent | Migrando a Windsurf | Windsurf Agent |
| OpenAI API | Cuotas/costos | Tooling local Python |
| n8n Runtime | Requiere `.env` | Documentación workflows |
| ComfyUI Runtime | Recursos GPU | Documentación workflows |

---

## 5. RUTAS CANÓNICAS

### 5.1 Repo Local

```
C:\Users\farid\Documents\Frecuencia Global/
├── 03_Editorial/_specs/          # Templates y specs
├── 04_Produccion/                  # Piezas activas
│   └── P1_001..P1_004, EP_001..EP_002
├── 06_Assets/                      # Assets y manifiestos
├── 07_Operaciones/                 # Logs y operaciones
├── 08_n8n/                         # Workflows (NO .env)
├── scripts/                        # Scripts Python/JS
├── tools/editorial/                # Tooling nuevo
└── website/                        # Astro site
```

### 5.2 Assets Pesados (D:)

```
D:\FrecuenciaGlobal\AV/
├── outputs/                        # Renders ComfyUI
├── workflows/                      # Workflows ComfyUI
├── inputs/                         # Assets source
└── [por definir más granularidad]
```

**Regla:** No mover archivos grandes sin plan. Validar existencia antes de referenciar.

---

## 6. REGLAS DE OPERACIÓN

### 6.1 Reglas Duras (Inmutables)

1. **NO publicar** en plataformas externas
2. **NO usar** scripts de publicación automática
3. **NO tocar** credenciales, tokens, cookies, `.env`
4. **NO copiar** secretos desde VS Code a Windsurf
5. **NO inventar** IDs, tokens, rutas, estados
6. **NO modificar** producción sin instrucción explícita
7. **Snapshot antes** de editar cualquier archivo
8. **Evidencia verificable** para cada cambio
9. **Prioridad:** Avance producto > seguridad, excepto riesgo de datos/creds
10. **Si no es verificable local:** Marcar "requiere verificación humana"

### 6.2 Separación de Órganos

| Órgano Editorial | Órgano Plataformas |
|------------------|-------------------|
| Contenido | Distribución |
| Investigación | Publicación API |
| QA editorial | Automatización n8n |
| Assets creativos | Redes sociales |

**NO mezclar responsabilidades.** Una pieza puede estar en `PUBLISHED` (editorial) y aún no publicarse en plataformas.

### 6.3 ComfyUI como Motor Gráfico Oficial

- Workflows en `website/comfyui-workflows/`
- Outputs en `D:\FrecuenciaGlobal\AV\outputs/`
- **NO ejecutar** cargas pesadas sin autorización
- **SÍ documentar** workflows y rutas

---

## 7. LÍMITES

### 7.1 Qué Windsurf NO puede hacer

| Capacidad | Limitación | Razón |
|-----------|------------|-------|
| Ejecutar n8n | ❌ Bloqueado | Requiere `.env` con tokens |
| Publicar en redes | ❌ Bloqueado | Política de no publicación automática |
| Acceder a Notion Live | ❌ Bloqueado | Requiere token (y es live) |
| Ejecutar ComfyUI | ⚠️ Limitado | Recursos GPU, dependencias |
| Push a GitHub | ⚠️ Limitado | No es repo Git actualmente |
| Deploy Cloudflare | ⚠️ Limitado | Requiere auth Cloudflare |

### 7.2 Qué Windsurf SÍ puede hacer

| Capacidad | Ejemplos |
|-----------|----------|
| Documentación | Crear/actualizar `.md`, logs, matrices |
| Scripts read-only | Ejecutar fact-checking, research |
| Build local | `npm run build` en website (preview) |
| QA documental | Verificar consistencia entre archivos |
| Preparar CSVs | Para backfill Notion (sin tocar live) |
| Mapear workflows | Documentar n8n sin ejecutar |
| Tooling editorial | Crossref, Openverse, asset metadata |

---

## 8. SINGLE SOURCES OF TRUTH

| Información | Autoridad | Ubicación |
|-------------|-----------|-----------|
| Estados de piezas | `pipeline_tracker.json` | `04_Produccion/` |
| Mapeo Notion | `NOTION_FIELD_MAP.json` | `07_Operaciones/` |
| Operaciones | `FG_Operations_Log.md` | `07_Operaciones/` |
| Assets | `ASSETS_MANIFEST.md` | `06_Assets/EP_XXX/` |
| Config web | `astro.config.mjs` | `website/` |
| Tareas editoriales | `tasks.json` | `.vscode/` → `.windsurf/` |
| Workflows n8n | `workflows/` | `08_n8n/` (documentar) |

---

## 9. PIEZAS ACTIVAS (Desde pipeline_tracker.json)

| Pieza | Estado Actual | Plataformas | Bloqueantes |
|-------|---------------|-------------|-------------|
| **P1_001** | `PUBLISHED_MULTI` | X, Threads | — Publicado |
| **P1_002** | `APPROVAL_PENDING` | — | Pendiente aprobación |
| **P1_003** | `BRIEF_READY` | — | En research |
| **P1_004** | `BRIEF_READY` | — | En research |
| **EP_001** | `PUBLISH_READY` | — | Falta audio master, thumbnail |
| **EP_002** | `PUBLISH_READY` | — | Falta audio master, thumbnail |

**Prioridad inmediata:** `IP_REP_V2_002` está en `REVIEW_REQUIRED` con 6 archivos de gobernanza creados el 2026-04-24.

---

## 10. PRÓXIMAS TAREAS VALIDADAS

1. **Día 2:** Mapear `.vscode/` → `.windsurf/rules` y tareas equivalentes
2. **Día 3:** Identificar conflictos entre documentos existentes
3. **Día 4:** Preparar guía CSV backfill Notion (sin tocar live)
4. **Día 5:** Inventariar workflows n8n documentados
5. **Día 6:** Documentar build/preview local del website

---

**Versión:** 1.0  
**Autoridad:** Windsurf Agent + `NOTION_FIELD_MAP.json`  
**Próxima revisión:** Día 2 del sprint
