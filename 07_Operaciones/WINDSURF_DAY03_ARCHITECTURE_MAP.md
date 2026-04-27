# WINDSURF DAY 3 — MAPA OPERATIVO DE ARQUITECTURA

> **Fecha:** 2026-04-25  
> **Objetivo:** Mapa actionable de arquitectura de producción FG  
> **Estado:** Activo — para uso operativo inmediato

---

## 1. PIPELINE EDITORIAL REAL

```
┌─────────┐    ┌──────────┐    ┌─────────┐    ┌──────────┐    ┌─────────┐
│  IDEA   │───▶│ RESEARCH │───▶│ SCRIPT  │───▶│  EDIT   │───▶│ RENDER  │
└─────────┘    └──────────┘    └─────────┘    └──────────┘    └─────────┘
     │               │               │              │              │
     ▼               ▼               ▼              ▼              ▼
 TPL_IdeaCard   ResearchPack    Script.md      Assets Gen     Video/Img
 (Notion)      (03_Editorial)   (04_Prod)      (ComfyUI)      (06_Assets)

┌─────────┐    ┌──────────┐    ┌─────────┐    ┌──────────┐
│ COVER   │───▶│ CAPTION  │───▶│   QA    │───▶│ PUBLISH │
└─────────┘    └──────────┘    └─────────┘    └──────────┘
     │               │               │              │
     ▼               ▼               ▼              ▼
Cover Gen      Hashtags +       validate_      Post Package
(Comfy)        CTA               publishready   (04_Prod/*_PublishReady.md)
```

---

## 2. FUENTES DE VERDAD POR DOMINIO

| Dominio | Fuente de Verdad | Ubicación | Autoridad |
|---------|------------------|-----------|-----------|
| **Piezas (estado)** | `pipeline_tracker.json` | `04_Produccion/pipeline_tracker.json` | Local — Repo |
| **Mapeo Notion** | `NOTION_FIELD_MAP.json` | `07_Operaciones/NOTION_FIELD_MAP.json` | Local — Repo |
| **Assets** | `ASSETS_MANIFEST.md` por pieza | `06_Assets/{PIECE_ID}/` | Local — Repo |
| **Publicación** | `*_PublishReady.md` | `04_Produccion/` | Local — Repo |
| **Website** | `website/` + build | `website/`, `dist/` | Local + Cloudflare |
| **Operaciones** | `FG_Operations_Log.md` | `07_Operaciones/FG_Operations_Log.md` | Local — Repo |
| **n8n workflows** | Archivos JSON + local n8n | `08_n8n/` (backup) | Local — n8n runtime |
| **ComfyUI** | Workflows JSON + checkpoints | `comfy/workflows/`, `D:\FrecuenciaGlobal\ComfyUI` | Local — ComfyUI |

---

## 3. JERARQUÍA DE ARCHIVOS (Qué manda sobre qué)

### Editorial → Producción → Publicación
```
03_Editorial/{PIECE}_Research.md
        │
        ▼
04_Produccion/{PIECE}_Script.md (si aplica video/podcast)
        │
        ▼
04_Produccion/{PIECE}_PublishReady.md ← DECISIÓN FINAL PARA PUBLICAR
        │
        ▼
06_Assets/{PIECE}/ ← Assets vinculados por manifiesto
```

### Website
```
website/src/content/ ← Archivos .md/.mdx con frontmatter
        │
        ▼
website/dist/ ← Output build (NO versionar, generado)
        │
        ▼
Cloudflare Pages ← Deploy manual (Tier 4 — requiere autorización)
```

### Notion (Hub Operativo — Read Only para agente)
```
NOTION_FIELD_MAP.json ← Define mapeo campos
        │
        ▼
CSV export (si aplica backfill) ← Preparar, NO ejecutar sin autorización
        │
        ▼
Notion Live ← NO tocar directamente
```

---

## 4. ESTADO POR FRENTE (Corte 2026-04-25)

| Frente | Estado | Archivo de Control | Siguiente Acción |
|--------|--------|-------------------|------------------|
| **Editorial** | Activo | `PIECE_STATUS_MATRIX.md` | P1_003 → completar Research → Script |
| **Website** | Activo | `website/astro.config.mjs` | Validar build local, revisar rutas |
| **ComfyUI** | Activo | `comfy/extra_model_paths.yaml` | Validar adapter funciona, rutas correctas |
| **n8n** | Backup | `08_n8n/*.json` | Mapear workflows locales (sin ejecutar runtime) |
| **Notion** | Hub externo | `NOTION_FIELD_MAP.json` | Preparar CSV seguro (no API live) |
| **Git/GitHub** | ✅ Sincronizado | `.git/` | Listo — 1b394fe en origin/main |
| **Plataformas** | Bloqueado | `.windsurf/rules` | NO ejecutar publish sin autorización explícita |
| **Assets** | Mixto | `06_Assets/` | P1_003: faltan assets por generar |

---

## 5. ANÁLISIS DE PIEZAS CANDIDATAS

| Pieza | Estado | Avance | Bloqueantes | Candidata |
|-------|--------|--------|-------------|-----------|
| **P1_001** | PUBLISHED_MULTI | 100% | — | ❌ Ya publicada |
| **P1_002** | COMPLETED | 100% | — | ❌ Ya publicada |
| **MVP_01-03** | PUBLICADO | 100% | — | ❌ Ya publicadas |
| **EP_001** | PUBLISH_READY | 80% | SANDBOX_FROZEN (§2.2), falta audio master, thumbnail | ❌ Congelado por política |
| **EP_002** | PUBLISH_READY | 80% | SANDBOX_FROZEN (§2.2), falta audio master, thumbnail | ❌ Congelado por política |
| **FG_001** | SANDBOX_EDITORIAL_DRAFT | 40% | No hay PublishReady en repo | ⚠️ Requiere crear desde cero |
| **P1_003** | BRIEF_READY | 20% | Solo tiene brief, falta: ResearchPack, Script, Assets, PublishReady | ✅ **MEJOR CANDIDATA** — pipeline siguiente, sin bloqueos de política |
| **P1_004** | BRIEF_READY | 20% | Solo tiene brief, en cola tras P1_003 | ⚠️ Orden mecánico: después de P1_003 |

---

## 6. DECISIÓN: PIEZA PRIORITARIA

### **P1_003 — Geopolitik Drop**

**Razón de selección:**
1. Pipeline siguiente según matriz operativa
2. Sin bloqueos de política (no está SANDBOX_FROZEN)
3. No publicada (no duplicar trabajo)
4. Pilar Geopolitik Drop (P1) — alineado con semana actual (semiconductores, tecnología)
5. Tiene base: Brief.md existe en `03_Editorial/`

**Archivos existentes:**
- ✅ `03_Editorial/P1_003_Brief.md` — Base de investigación inicial
- ✅ `04_Produccion/P1_003_QA.md` — Plantilla de QA

**Faltantes concretos:**
1. `03_Editorial/P1_003_ResearchPack.md` — Research completo con fuentes
2. `04_Produccion/P1_003_Script.md` — Script/copy para publicación
3. `06_Assets/P1_003/` — Directorio con assets generados
4. `06_Assets/P1_003/ASSETS_MANIFEST.md` — Manifiesto de assets
5. `04_Produccion/P1_003_PublishReady.md` — Paquete de publicación final

**Acciones para llegar a PublishReady:**
1. Desarrollar ResearchPack a partir del brief
2. Generar copy/script para X, Instagram, LinkedIn, TikTok
3. Generar assets visuales (cover, carrusel si aplica) con ComfyUI
4. Validar con `validate_publishready.py`
5. Crear PublishReady.md

**Comando siguiente para P1_003:**
```bash
# Leer brief existente
Get-Content "03_Editorial/P1_003_Brief.md" -Raw

# Siguiente: Crear ResearchPack.md con profundización
```

---

## 7. MAPEO DE COMANDOS EJECUTABLES

### Website
```bash
cd website
npm run build          # Tier 1 — seguro, local only
npm run preview        # Tier 1 — preview local
git status             # Verificar dist/ ignorado
```

### Editorial
```bash
# Validar pieza
python scripts/validate_publishready.py --pieza P1_003

# Verificar assets
Test-Path "06_Assets/P1_003/ASSETS_MANIFEST.md"
```

### ComfyUI
```bash
# Verificar adapter
python comfy/extra_model_paths.yaml
# (Requiere validación manual en UI)
```

### Git
```bash
git status
git log --oneline -n 3
git remote -v
# Estado actual: 1b394fe en origin/main — sincronizado
```

---

## 8. PRÓXIMO ARCHIVO A MODIFICAR

**`03_Editorial/P1_003_ResearchPack.md`**

- Tipo: Crear desde cero (no existe)
- Base: `03_Editorial/P1_003_Brief.md`
- Contenido: Research profundizado con fuentes, claims verificables, evidencia
- Objetivo: Llevar P1_003 de BRIEF_READY a research completo para producción

---

*Generado: 2026-04-25 — Para uso operativo inmediato en Windsurf*
