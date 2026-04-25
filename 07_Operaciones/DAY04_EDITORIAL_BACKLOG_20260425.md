# DAY04 — Backlog Editorial Consolidado
# D04 — FG10D-20260424-015
# 2026-04-25 | Frecuencia Global

**Tarea Notion:** FG10D-20260424-015  
**Página:** `34cf773b-f4a7-81e5-a665-ce5f5b0e7042`  
**Corte:** 2026-04-25  
**Guardrails activos:** Sin publicación · Sin deploy · Sin n8n · Sin Scheduler · Sin credenciales · Sin bulk edits

---

## 1. Decisión central

**Detroit queda como:**

- Pieza piloto activa/canónica del flujo de producción FG
- Dummy canónico de producción para diseñar el flujo completo
- Laboratorio de flujo editorial → diseño → assets → web → QA → post package
- Base para aprender el flujo que luego se replicará en otras piezas

**P1_001** y **P1_002** quedan como referencias históricas. No activar.  
**P1_002** conserva estado operativo vivo dudoso (Notion REVIEW vs evidencia de publicación local — drift no resuelto, ver FG-TASK-GOV-005).  
**EP_001** y **EP_002** quedan como backlog episódico / YouTube readiness. No activar hoy.

---

## 2. Clasificación de piezas

| Pieza | Rol operativo | Estado real | Evidencia | Acción |
|-------|---------------|-------------|-----------|--------|
| **Detroit** | Piloto activo/canónico | Artículo completo publicado en web local (`draft:false`, 2026-04-06); assets visuales extensos; sin paso formal por flujo de producción | `website/src/content/articles/techno-detroit-historia-musica-electronica.md`; ~20 assets en `website/public/images/articles/*detroit*`; dist en `website/dist/contenido/techno-detroit-historia-musica-electronica/`; NO figura en `pipeline_tracker.json` ni en `PIECE_STATUS_MATRIX.md`; NO existe en FG — PIEZAS (Notion) | Avanzar flujo: auditar artículo + inventario de assets → QA editorial (D05) |
| **P1_001** | Referencia histórica publicada | PUBLISHED_MULTI — publicado X + Threads (2026-04-05); sandbox IG + FB (2026-04-11) | `04_Produccion/P1_001_PublishReady.md`, `P1_001_QA.md`, `P1_001_QA_FINAL.md`, `P1_001_Design_Handoff.md`, `P1_001_Produccion_Log.md`; `03_Editorial/P1_001_Research.md`, `P1_001_Brief.md`, `P1_001_Script.md`; `06_Assets/P1_001/`; `pipeline_tracker.json` estado `PUBLISHED_MULTI` | No activar — pieza cerrada |
| **P1_002** | Referencia histórica con estado operativo vivo dudoso | COMPLETED local (pub 2026-04-13 Threads/IG/FB/LinkedIn) vs Notion estado REVIEW — drift no resuelto (FG-TASK-GOV-005) | `04_Produccion/P1_002_PublishReady.md` (estado COMPLETED, score 100/100), `P1_002_Video_Package_TongaCable.md`; `03_Editorial/P1_002_Brief.md`; `06_Assets/P1_002/ASSETS_MANIFEST.md`; `pipeline_tracker.json` estado `APPROVAL_PENDING` (desactualizado); Notion REVIEW | No activar — drift pendiente, resolución en GOV-005 |
| **EP_001** | Backlog episódico / YouTube readiness | PUBLISH_READY pero bloqueado: falta audio master, thumbnail, imagen IG; status SANDBOX_FROZEN | `04_Produccion/EP_001_PublishReady.md`; `pipeline_tracker.json` estado `PUBLISH_READY` con bloqueantes explícitos; sin carpeta local `/EP_001/` en `04_Produccion/`; sin assets en `06_Assets/EP_001/` | No activar hoy — faltan audio + visual |
| **EP_002** | Backlog episódico / YouTube readiness | PUBLISH_READY pero bloqueado: falta audio master, thumbnail, imagen IG; status SANDBOX_FROZEN | `04_Produccion/EP_002_PublishReady.md`; `03_Editorial/EP_002_Brief.md`; `pipeline_tracker.json` estado `PUBLISH_READY` con bloqueantes; sin carpeta local `/EP_002/` en `04_Produccion/` | No activar hoy — faltan audio + visual |

---

## 3. Cola editorial real

### ACTIVA

- **Detroit** — Piloto de flujo de producción. Siguiente acción: D05 QA editorial/visual.

### REFERENCIA (histórica)

- **P1_001** — PUBLISHED_MULTI. Cerrada. Valor como referencia de flujo ejecutado.
- **P1_002** — COMPLETED local / REVIEW Notion. Estado operativo vivo dudoso. No activar.

### BACKLOG EPISÓDICO

- **EP_001** — SANDBOX_FROZEN. YouTube/RSS readiness pendiente. Bloqueante: audio master + thumbnail.
- **EP_002** — SANDBOX_FROZEN. YouTube/RSS readiness pendiente. Bloqueante: audio master + thumbnail.

### BLOQUEADO

- EP_001 y EP_002 califican también como BLOQUEADOS por falta de activos mínimos (audio master, thumbnail, imagen IG). Sin evidencia de ruta de desbloqueio activa en este corte.

---

## 4. Flujo de producción Detroit

Detroit es el piloto para diseñar y validar el flujo completo FG: texto → diseño → assets → web → QA → post package.

| # | Paso | Estado actual | Archivo encontrado | Faltante | Acción siguiente |
|---|------|---------------|-------------------|----------|-----------------|
| 1 | Texto editorial | ✅ Completo | `website/src/content/articles/techno-detroit-historia-musica-electronica.md` (46 líneas, artículo completo, pilar p2) | — | Revisar frontmatter: `image` apunta a `/images/articles/techno-detroit.jpg` — validar existencia |
| 2 | Investigación / fuentes | ⚠️ Parcial | Fuentes citadas al pie del artículo (Resident Advisor, Mixmag, BBC, Arte) | No hay `ResearchPack` formal ni `Claim_Ledger` | Crear evidencia documental o aceptar fuentes inline como suficientes para piloto |
| 3 | Guion / estructura | ✅ Completo (artículo) | El artículo actúa como estructura narrativa (5 secciones claras) | No hay guion separado | Aceptar estructura del artículo como equivalente para piloto |
| 4 | Diseño visual | ⚠️ Parcial | Múltiples assets en `website/public/images/articles/`: hero, card, billboard, manga variants | `techno-detroit.jpg` (imagen principal en frontmatter) — verificar si existe | Auditar qué asset va como hero canónico |
| 5 | Assets ComfyUI | ✅ Generados | `website/public/images/articles/_comfy_download_techno_manga/` — múltiples lotes (manga-02 style-a/b/c, master-v3a/v3b/v4, manga-03) | Curaduría: falta selección aprobada para uso | Acción D06: curar outputs ComfyUI Detroit |
| 6 | Integración web | ✅ Integrado | `website/src/content/articles/techno-detroit-historia-musica-electronica.md` + build en `website/dist/contenido/techno-detroit-historia-musica-electronica/` | Validar ruta de imagen hero en build | Smoke test local: verificar slug resuelve en dev server |
| 7 | QA editorial | ❌ Pendiente | No existe `Detroit_QA.md` ni informe de QA formal | QA editorial: estructura, claims, fuentes, tono | Tarea D05: Cerrar QA editorial Detroit |
| 8 | QA visual | ❌ Pendiente | Assets generados pero sin curaduría formal | Selección aprobada de hero/thumb/card | Tarea D05 + D06 |
| 9 | Post package | ❌ Pendiente | No existe `Detroit_PublishReady.md` ni `DistSpec` | Captions por plataforma, hashtags, distribución | Construir post-QA |
| 10 | Distribución futura | ❌ Pendiente | No planificada | Plataformas, fecha, canal | Definir post-QA |

---

## 5. Siguiente acción concreta

**Acción única elegida:** Ejecutar D05 — QA editorial Detroit.

Revisar el artículo `techno-detroit-historia-musica-electronica.md` contra checklist editorial mínimo:
- estructura narrativa
- claims verificables vs fuentes declaradas
- frontmatter completo (imagen hero existente, pilar correcto, draft status)
- tono y registro FG

Esto es ejecutable sin deploy, sin publicación, sin credenciales.

**Tarea Notion para esto:** `34cf773b-f4a7-8175-8b74-cec9a6121250` — D05 Cerrar QA editorial Detroit

---

## 6. Archivos no encontrados localmente

Los siguientes archivos fueron buscados y **no existen localmente:**

- `04_Produccion/W17_TEST_PREP_2026-04-20_2026-04-24/` — no encontrado (directorio ausente)
- `docs/editorial/pilots/detroit_stack_pilot/DETROIT_X_RUN_V1_1_PLAN.md` — no encontrado (referenciado en D05 Notion, no materializado localmente)
- `06_Assets/ASSETS_MANIFEST.md` (raíz) — no encontrado (sí existe `06_Assets/P1_002/ASSETS_MANIFEST.md`)
- `06_Assets/Detroit/` — no encontrado (assets Detroit están en `website/public/images/articles/`)

---

*Generado: 2026-04-25 | Agente: Windsurf Cascade | Tarea: FG10D-20260424-015 D04*
