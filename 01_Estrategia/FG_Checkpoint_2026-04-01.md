# Frecuencia Global — Checkpoint del Proyecto

**Fecha:** 2026-04-01  
**Versión:** 3.0  
**Propósito:** Snapshot completo del estado del proyecto para evaluación estratégica con Maya (ChatGPT).  
**Contexto:** Después de una sesión intensiva de configuración de agentes, integraciones, plataformas y sistema operativo.

---

## 1. QUÉ ES FRECUENCIA GLOBAL

Marca multiplataforma que traduce geopolítica, relaciones internacionales y cultura global a formatos accesibles con identidad visual y narrativa inspirada en música electrónica.

- **Tagline:** "Análisis internacional con pulso electrónico"
- **Audiencia primaria:** 18-35, consumidores de EDM con curiosidad geopolítica
- **Audiencia secundaria:** Profesionales de RI, diplomacia, seguridad, entretenimiento
- **Diferenciador:** Intersección entre RI profesional, cultura bass/EDM y formatos nativos digitales
- **YouTube como hub central** — el contenido largo vive ahí; lo demás se deriva

---

## 2. ESTADO DE COMPLETITUD — RESUMEN EJECUTIVO

| Área | Completitud | Cambio vs. anterior | Notas |
|------|-------------|---------------------|-------|
| Estrategia y documentación fundacional | 95% | = | Blueprint, checkpoints, diagnósticos completos |
| Brand System (definición) | 95% | = | Paleta, tipografía, componentes, reglas — todo documentado |
| Sistema de agentes (definición) | 100% | ↑ de 100% | 12 agentes core/soporte + 4 agentes VS Code Gemini layer |
| Sistema maestro operativo | 100% | ✨ NUEVO | SISTEMA_MAESTRO.md — documento central de gobierno |
| Capa Gemini (generación creativa) | 100% | ✨ NUEVO | 4 agentes VS Code + infraestructura completa |
| n8n (automatización pipeline) | 90% | ✨ NUEVO | Docker-ready, 5 workflows + 4 sub-workflows |
| Website (Astro) | 85% | ✨ NUEVO | Build completo, 2 artículos, RSS, sitemap |
| YouTube Channel | 80% | ✨ NUEVO | Canal configurado, watermark generado, scripts de setup |
| MCP Plugins (VS Code) | 100% | ✨ NUEVO | Canva MCP + Chrome DevTools MCP activos |
| Assets visuales (SVG/PNG) | 75% | ↑ de 70% | Wordmark, isotipo, corchetes, nodo, banner — en Assets_Base |
| Editorial (contenido listo) | 30% | ↑ de 0% | P1_001 completo (brief→script→QA); P1_002 brief hecho |
| Producción documentada | 40% | ↑ de 0% | Flujo de producción video, packages, handoffs, QA |
| Templates | 100% | ↑ | 19 templates: base + video + Gemini |
| Playbooks | 100% | = | 6 playbooks operativos |
| Reglas del sistema | 100% | ↑ | 7 reglas formales documentadas |
| Monetización | 0% | = | Fase 3 del roadmap |
| Contenido publicado | 0% | = | **0 piezas publicadas en ninguna plataforma** |

---

## 3. LO QUE SE CONSTRUYÓ EN ESTA SESIÓN (01-ABR-2026)

### 3.1 Agentes VS Code nativos (capa Gemini)

Cuatro agentes `.agent.md` en `.github/agents/` que operan como subagentes invocables desde Copilot Chat:

| Agente | Archivo | Función |
|--------|---------|---------|
| **Supervisor** | `.github/agents/supervisor.agent.md` | Orquesta producción multimedia, delega a los 3 subagentes |
| **Visual Creator** | `.github/agents/visual-creator.agent.md` | Generación de prompts Nano Banana 2, thumbnails, covers, mockups |
| **Video Producer** | `.github/agents/video-producer.agent.md` | Storyboards, shot lists, editing briefs, multiplatform |
| **Audio Producer** | `.github/agents/audio-producer.agent.md` | Sonic branding, SFX, jingles, referencia RAVE LOKOTE |

**Invocación:** `@supervisor`, `@visual-creator`, `@video-producer`, `@audio-producer`

**Relación con sistema existente:**
- Supervisor ≠ Project Manager (AGENT_07) — el PM maneja proyecto, el Supervisor maneja sesión creativa
- Visual Creator ≠ Design Production (AGENT_05) — Design ejecuta en Canva/Figma; Visual Creator genera vía Gemini
- Video Producer Gemini extiende AGENT_12 con capacidades de generación
- Audio Producer es completamente nuevo

### 3.2 Infraestructura Gemini (`system/gemini/`)

```
system/gemini/
├── prompts/         ← Prompts catalogados para Nano Banana 2
├── workflows/       ← WORKFLOW_Multimedia_Pipeline.md
├── references/      ← approved/ | exploratory/ | discarded/ + RAVE_LOKOTE_Reference.md
├── outputs/         ← visual/ | video/ | audio/
└── qa/              ← QA_Checklist_Multimedia.md
```

### 3.3 Templates Gemini

3 nuevos templates de brief para generación creativa:
- `TPL_Brief_Visual_Gemini.md`
- `TPL_Brief_Video_Gemini.md`
- `TPL_Brief_Audio_Gemini.md`

### 3.4 MCP Plugins configurados (`.vscode/mcp.json`)

| Plugin | Protocolo | Función |
|--------|-----------|---------|
| **Canva MCP** | stdio / npx | Acceso directo a Canva desde VS Code — diseño, assets, brand kit |
| **Chrome DevTools** | stdio / npx | Control de Chrome para debugging, screenshots, testing visual |

### 3.5 n8n — Motor de automatización (`08_n8n/`)

Stack: Docker Compose → n8n en puerto 5678

| Workflow | Trigger | Función |
|----------|---------|---------|
| WF-001 Intake Ideas | Webhook POST | Genera brief desde template |
| WF-002 Registro Brief | Webhook POST | Actualiza pipeline tracker |
| WF-003 QA Checklist | Webhook POST | Genera QA desde template |
| WF-004 Notificación/Log | Sub-workflow | Registra evento en Operations Log |
| WF-005 Pipeline Status | Cron 9AM | Resumen diario de pipeline |

Sub-workflows: escribir markdown, notificar Telegram, template filler, registrar evento.

### 3.6 Website — Astro + Tailwind (`website/`)

| Elemento | Detalle |
|----------|---------|
| Framework | Astro 6.1 + Tailwind CSS 4.2 |
| Tipografía | Bebas Neue + Space Grotesk + JetBrains Mono (via @fontsource) |
| URL de deploy | `https://frecuenciaglobal.vercel.app` (configurado) |
| Build | `dist/` generado con HTML, CSS, sitemap, RSS |
| Páginas | index, sobre, contacto, contenido, pilares (con rutas dinámicas) |
| Componentes | Hero, Header, Footer, FrequencyLine, SignalNode, PillarPill, PillarSection, ArticleCard, ContactForm |
| Artículos | 2 publicados en content collection: cables submarinos + techno Detroit |
| SEO | Sitemap XML, RSS feed, OG tags preparados |

### 3.7 YouTube Channel Setup

- Scripts de configuración: `youtube_channel_setup.py`, `youtube_studio_automation.py`, etc.
- API credentials configuradas (`client_secret.json`, `token.json`)
- Watermark generado: `06_Assets/fg_youtube_watermark_150.png`
- Script de generación: `scripts/make_watermark.py`
- Documentación: `scripts/README_YOUTUBE_SETUP.md`

### 3.8 SISTEMA_MAESTRO.md actualizado a v1.1

Documento central de gobierno actualizado con:
- Mapa completo de 12 agentes core + 4 agentes Gemini
- Flujo G (Pipeline multimedia Gemini) añadido
- Templates de video (8) + Gemini (3) documentados
- Changelog del sistema actualizado
- Estructura del repo actualizada con `system/gemini/` y `.github/agents/`

---

## 4. ARQUITECTURA ACTUAL DEL PROYECTO

### 4.1 Estructura del repositorio

```
Frecuencia Global/
├── .github/
│   ├── agents/                    ← 4 agentes VS Code (Gemini layer)
│   │   ├── supervisor.agent.md
│   │   ├── visual-creator.agent.md
│   │   ├── video-producer.agent.md
│   │   └── audio-producer.agent.md
│   └── instructions/
│       └── fg-brand-context.instructions.md  ← Contexto brand auto-cargado
│
├── .vscode/
│   └── mcp.json                   ← Canva MCP + Chrome DevTools MCP
│
├── system/
│   ├── SISTEMA_MAESTRO.md         ← Documento central de gobierno (v1.1)
│   ├── agents/                    ← 12 definiciones de agentes
│   ├── gemini/                    ← Infraestructura generación creativa
│   │   ├── prompts/
│   │   ├── workflows/
│   │   ├── references/            ← RAVE_LOKOTE_Reference.md + approved/exploratory/discarded
│   │   ├── outputs/               ← visual/ video/ audio/
│   │   └── qa/
│   ├── playbooks/                 ← 6 playbooks operativos
│   ├── templates/                 ← 19 templates (base + video + Gemini)
│   ├── rules/                     ← 7 reglas formales
│   ├── workflows/                 ← WORKFLOW_Mapa_Flujos.md
│   ├── roadmap/                   ← ROADMAP_FG.md
│   └── memory/                    ← STATE_PROJECT.json (vacío — no inicializado)
│
├── 01_Estrategia/                 ← Blueprint, checkpoints, diagnósticos
├── 02_Brand_System/               ← Brand Kit Operativo, Figma architecture
├── 03_Editorial/                  ← P1_001 (brief, research, script, caption) + P1_002 brief
├── 04_Produccion/                 ← Flujo video, packages, handoffs, QA
├── 05_Monetizacion/               ← VACÍO (Fase 3)
├── 06_Assets/                     ← YouTube watermark + video_watermark/
├── 07_Operaciones/                ← Guía de cuentas
├── 08_n8n/                        ← Docker Compose + 5 workflows + 4 sub-workflows
│
├── website/                       ← Astro 6 + Tailwind 4 (build listo)
│   ├── src/
│   │   ├── components/            ← 9 componentes Astro
│   │   ├── content/articles/      ← 2 artículos markdown
│   │   ├── pages/                 ← index, sobre, contacto, contenido, pilares
│   │   └── styles/global.css
│   └── dist/                      ← Build estático generado
│
├── Frecuencia_Global_Assets_Base/
│   └── assets/                    ← SVGs y PNGs: wordmark, isotipo, corchetes, nodo, banner
│
├── Frecuencia_Global_Activos_Canva_v1-v6/  ← Exports de Canva (histórico)
├── static/                        ← Fuentes Space Grotesk (.ttf)
├── scripts/                       ← YouTube setup, watermark gen, Canva automation (70+ scripts)
└── SpaceGrotesk-VariableFont_wght.ttf
```

### 4.2 Mapa de agentes (16 total)

**Capa core (7):** Brand System, Content Strategy, Research, Scriptwriting, Design Production, QA, PM  
**Capa soporte (4):** Memory Manager, Critical Reviewer, Context Mapper, Integrator  
**Capa especialista (1):** Video Producer  
**Capa Gemini VS Code (4):** Supervisor, Visual Creator, Video Producer, Audio Producer

### 4.3 Flujos de producción (7)

| Flujo | Descripción |
|-------|-------------|
| A | Pieza nueva completa |
| B | Breaking news rápida |
| C | Repurposing |
| D | Actualización brand assets |
| E | Ciclo semanal completo |
| F | Producción formal de video |
| G | Pipeline multimedia Gemini |

---

## 5. PIPELINE EDITORIAL — ESTADO

### Piezas en pipeline

| Pieza | Pilar | Estado | Archivos |
|-------|-------|--------|----------|
| **P1_001** — Cables submarinos | Geopolitik Drop | ✅ Script + QA completos, caption lista | Brief, Research, Script, Design Handoff, QA, QA_FINAL, Instagram Caption |
| **P1_002** — Cable de Tonga | Geopolitik Drop | 📝 Brief + Video Package hechos | Brief, Video Package |
| **P3_001** — Chokepoints | Frecuencia Global | 📝 Solo video package | Video Package |

### Artículos web publicados (en build)

1. `cables-submarinos-geopolitica-internet.md` — Geopolitik Drop
2. `techno-detroit-historia-musica-electronica.md` — Bass & Borders

---

## 6. PLATAFORMAS Y CUENTAS

| Plataforma | Estado | Configuración |
|------------|--------|---------------|
| **YouTube** | ✅ Canal activo | API configurada, watermark generado, scripts de automatización |
| **Instagram** | ✅ Cuenta activa | Caption P1_001 lista |
| **TikTok** | ✅ Cuenta activa | Sin contenido |
| **X/Twitter** | ✅ Cuenta activa | Sin contenido |
| **LinkedIn** | ✅ Cuenta activa | Sin contenido |
| **Facebook** | ❌ Descartado | Decisión tomada |
| **Website** | ✅ Build listo | Astro + Tailwind, URL: frecuenciaglobal.vercel.app |
| **n8n** | ✅ Configurado | Docker-ready, workflows importables |

---

## 7. INTEGRACIONES TÉCNICAS

| Integración | Tipo | Estado | Detalle |
|-------------|------|--------|---------|
| **Canva MCP** | VS Code plugin | ✅ Activo | Acceso directo a Canva desde IDE |
| **Chrome DevTools MCP** | VS Code plugin | ✅ Activo | Control de Chrome, screenshots, debugging |
| **YouTube Data API v3** | Python scripts | ✅ Configurado | client_secret.json + token.json |
| **Playwright MCP** | Browser automation | ✅ Instalado | Logs/snapshots en .playwright-mcp/ |
| **n8n + Telegram** | Notificaciones | ⚙️ Configurable | Bot token + chat_id requeridos en .env |
| **Vercel** | Deploy website | ⚙️ Pendiente | URL definida, deploy manual pendiente |
| **Gemini / Nano Banana 2** | Generación visual | ⚙️ Via prompts | Workflows y templates listos, ejecución via Gemini directamente |

---

## 8. ASSETS DISPONIBLES EN EL REPO

### SVG/PNG (Frecuencia_Global_Assets_Base/assets/)

| Asset | Formato | Estado |
|-------|---------|--------|
| fg_wordmark_dark.svg | SVG | ✅ |
| fg_wordmark_light.svg | SVG | ✅ |
| fg_isotipo.svg | SVG | ✅ |
| fg_isotipo_512.png | PNG | ✅ |
| fg_corchetes.svg | SVG | ✅ |
| fg_nodo.svg | SVG | ✅ |
| fg_banner_team.png | PNG | ✅ |

### YouTube

| Asset | Formato | Estado |
|-------|---------|--------|
| fg_youtube_watermark_150.png | PNG 150px | ✅ Generado |

### Fuentes

| Fuente | Formato | Ubicación |
|--------|---------|-----------|
| Space Grotesk (5 pesos) | TTF | `static/` |
| Space Grotesk Variable | TTF | Raíz |
| Bebas Neue, Space Grotesk, JetBrains Mono | npm | `website/node_modules/@fontsource*/` |

### Website logos (website/public/images/logo/)

| Asset | Formato |
|-------|---------|
| fg_isotipo.svg | SVG |
| fg_isotipo_512.png | PNG |
| fg_wordmark_dark.svg | SVG |
| fg_wordmark_light.svg | SVG |

---

## 9. QUÉ FALTA — PRIORIZADO

### P0 — Bloquea publicación

| # | Pendiente | Esfuerzo | Bloquea |
|---|-----------|----------|---------|
| 1 | **Publicar primera pieza** en al menos 1 plataforma | 2-4h | Todo — valida el sistema end-to-end |
| 2 | **Deploy del website a Vercel** | 30 min | Presencia web |
| 3 | **Diseño final de P1_001 en Canva** — verificar y exportar | 1-2h | Publicación |

### P1 — Necesario esta semana

| # | Pendiente | Esfuerzo |
|---|-----------|----------|
| 4 | Configurar Canva Brand Kit nativo (6 colores + 3 fuentes) | 1h |
| 5 | Templates para pilares Frecuencia Global y Behind the Policy | 2-3h |
| 6 | Banner YouTube (2560×1440) diseñado y subido | 1-2h |
| 7 | Banner X/Twitter (1500×500) | 1h |
| 8 | Foto de perfil unificada exportada (multi-tamaño) | 30min |
| 9 | Limpiar raíz del repo (PDFs, DOCXs, ZIPs a carpeta archivo) | 30min |

### P2 — Próximas 2 semanas

| # | Pendiente | Esfuerzo |
|---|-----------|----------|
| 10 | Guías editoriales por pilar (4 guías) | 4-6h |
| 11 | Inicializar STATE_PROJECT.json (está vacío) | 30min |
| 12 | TikTok/Reels overlay con safe text area | 1h |
| 13 | Instagram highlights icons | 1-2h |
| 14 | Levantar n8n y testear workflows | 2-3h |
| 15 | Producir semana completa (Milestone 2 del roadmap) | 15-20h |

### P3 — Mes 2+

| # | Pendiente |
|---|-----------|
| 16 | Monetización (carpeta 05_Monetizacion vacía) |
| 17 | Newsletter setup |
| 18 | Analítica y KPIs |
| 19 | Glosario de términos FG |

---

## 10. DECISIONES TOMADAS (NO REVISITAR)

1. Nombre y posicionamiento definidos
2. 4 pilares de contenido con color, tono y formato cada uno
3. YouTube como hub central — lo demás se deriva
4. Estética EDM como diferenciador narrativo (no decorativo)
5. Estructura de carpetas 01-08 + system/ + website/
6. Canva como herramienta de diseño principal, Figma para estructura
7. Paleta cerrada (8 colores) — no se añaden más
8. Tipografía cerrada (3 familias) — no se añaden más
9. Facebook descartado
10. Roadmap de 3 fases: Fundación (meses 1-3), Crecimiento (4-6), Monetización (7-12)
11. Nano Banana 2 / Gemini como motor de generación visual
12. RAVE LOKOTE como referencia sonora (dirección, no copia)
13. n8n como motor de automatización del pipeline
14. Astro + Tailwind para el website
15. Copilot como agente de ejecución; Maya (ChatGPT) como agente estratégico

---

## 11. CADENA DE DELEGACIÓN IA

| Rol | Agente | Jurisdicción |
|-----|--------|-------------|
| **Estrategia y editorial** | Maya (ChatGPT) | Visión de marca, ángulos editoriales, decisiones de contenido |
| **Ejecución y producción** | Copilot (este agente) | Código, diseño, implementación, configuraciones, sistema operativo |
| **Generación visual** | Nano Banana 2 (Gemini) | Imágenes, thumbnails, mockups, backgrounds |
| **Producción en Canva** | AGENT_05 / Canva MCP | Diseño final, templates, exports |
| **Supervisión creativa** | @supervisor | Coordina visual + video + audio en sesión |

**Escalamiento:** Cuando se requiere una decisión estratégica → `⚠️ MAYA INPUT REQUIRED`

---

## 12. MILESTONES DEL ROADMAP

| Milestone | Objetivo | Estado |
|-----------|----------|--------|
| **M1: First Publish** | 1 pieza publicada usando el sistema completo | 🔴 Pendiente |
| **M2: Primera semana completa** | 5+ piezas en una semana con QA | 🔴 Pendiente |
| **M3: Sistema editorial completo** | Guías por pilar + flujos documentados | 🟡 Parcial — flujo video hecho |
| **M4: Ritmo sostenible** | Producción semanal regular | 🔴 Pendiente |

---

## 13. ARCHIVOS CLAVE PARA MAYA

Si Maya necesita profundizar en algún área, estos son los documentos de referencia:

| Área | Archivo |
|------|---------|
| Visión completa | `01_Estrategia/FG_Blueprint_Maestro.md` |
| Brand system | `02_Brand_System/FG_Brand_Kit_Operativo.md` |
| Sistema operativo | `system/SISTEMA_MAESTRO.md` |
| Roadmap | `system/roadmap/ROADMAP_FG.md` |
| Primera pieza (script) | `03_Editorial/P1_001_Script.md` |
| Auditoría honesta | `AUDITORIA_FALTANTES_FG.md` |
| Este checkpoint | `01_Estrategia/FG_Checkpoint_2026-04-01.md` |

---

## 14. PREGUNTAS PARA MAYA

1. **¿Es el momento de publicar P1_001 o necesita ajustes editoriales antes?** El script y QA están listos, pero no ha pasado por revisión estratégica de contenido.
2. **¿Cuál debería ser la secuencia de publicación multiplataforma?** ¿YouTube primero → recortar para TikTok/Reels → carrusel Instagram? ¿O arrancar con formato corto?
3. **¿Validamos el tono de los artículos web?** Hay 2 artículos listos en el build del website — ¿están alineados con la voz editorial que Maya ha definido?
4. **¿Prioridad: pulir P1_001 para publicar, o producir más piezas primero para lanzar con volumen?**
5. **¿El website debería ir live antes de publicar contenido en redes, o se puede lanzar en paralelo?**

---

*Documento generado: 2026-04-01*  
*Próximo checkpoint recomendado: 2026-04-07 (tras primera publicación)*  
*Siguiente acción inmediata: Publicar P1_001 (Milestone 1) o consultar a Maya para validación editorial*
