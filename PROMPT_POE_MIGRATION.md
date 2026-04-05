# Prompt para Poe - Frecuencia Global

## Contexto del Proyecto

Frecuencia Global es una marca multiplataforma que traduce geopolítica, relaciones internacionales y cultura global a formatos accesibles con una identidad visual inspirada en música electrónica.

**Misión:** Hacer que el análisis internacional sea accesible, visual y relevante para audiencias jóvenes sin sacrificar rigor analítico.
**Tagline:** "Análisis internacional con pulso electrónico"

---

## Estructura del Repositorio

```
Frecuencia Global/
├── system/                          # Sistema operativo de agentes
│   ├── SISTEMA_MAESTRO.md          # Documento central
│   ├── FUENTE_DE_VERDAD_Y_CONTRATO.md # Single source of truth
│   ├── agents/                     # Agentes core, soporte y especialidad
│   ├── gemini/                     # Infraestructura de generación Gemini
│   │   ├── prompts/                # Prompts versionados
│   │   ├── workflows/              # Workflows multimedia
│   │   ├── references/             # Referencias visuales
│   │   ├── outputs/                # Outputs generados
│   │   └── qa/                     # QA de generación
│   ├── playbooks/                  # Procedimientos operativos
│   ├── templates/                  # Plantillas base
│   ├── rules/                      # Reglas del sistema
│   ├── workflows/                  # Mapa de flujos
│   └── roadmap/                    # Plan de desarrollo
├── 01_Estrategia/                  # Documentos estratégicos
├── 02_Brand_System/                # Kit de marca operativo
├── 03_Editorial/                   # Briefs, scripts, research
├── 04_Produccion/                  # Flujos de producción
├── 05_Monetizacion/                # Estrategia de monetización
├── 06_Assets/                      # Assets consolidados
├── 07_Operaciones/                 # Logs y status operacional
├── 08_n8n/                         # Workflows n8n cloud
│   ├── workflows_cloud/            # Workflows de producción
│   └── docs/                       # Documentación
├── website/                        # Sitio Astro (Vercel)
├── scripts/                        # Automatizaciones sociales
│   ├── x_publish_post.py          # X/Twitter automation
│   ├── linkedin_publish_post.py   # LinkedIn automation
│   ├── ig_publish_post.py         # Instagram automation
│   ├── threads_publish_post.py    # Threads Graph API
│   ├── tiktok_publish_post.py     # TikTok automation
│   └── gemini_generate_image.py  # Generación de imágenes
└── static/                         # Tipografías locales
```

---

## Sistema de Agentes

### Agentes Core

1. **Brand System** - Identidad visual, consistencia y templates
2. **Content Strategy** - Pilares, series, calendario y ángulos
3. **Research** - Investigación, sourcing y fact-checking
4. **Scriptwriting** - Guiones, hooks, copies y CTAs
5. **Design Production** - Diseño, edición y exportación final
6. **QA / Consistency** - Revisión editorial y visual
7. **Project Manager** - Coordinación, handoffs y prioridades

### Agentes de Soporte

8. **Memory / State Manager** - Estado persistente y trazabilidad
9. **Critical Reviewer** - Riesgos, huecos y falsa seguridad
10. **Context Mapper** - Contexto mínimo accionable
11. **Integrator** - Ensamblado final de outputs

### Agente Especialista

12. **Video Producer** - Concepto, hooks, storyboard, shot list, edición

### Flujo Principal de Producción

```
Content Strategy → Research → Scriptwriting → Video Producer (si aplica) → 
Design Production → QA/Consistency → Project Manager → Brand System (consultivo)
```

---

## Pilares de Contenido

| Pilar | Color | Hex | Tono | Formato Principal |
|-------|-------|-----|------|-------------------|
| **Geopolitik Drop** | Cian eléctrico | `#00E5FF` | Intenso, directo, visual | Video largo, shorts, episodios |
| **Bass & Borders** | Magenta neón | `#FF00E5` | Exploratorio, cultural | Video largo, carruseles, episodios |
| **Frecuencia Global** | Verde ácido | `#B8FF00` | Ágil, informativo, rítmico | TikTok/Reels 60-90s, carruseles |
| **Behind the Policy** | Azul profundo | `#4A6BFF` | Formal, analítico | LinkedIn, newsletter, video, episodios |

---

## Sistema Visual

### Paleta de Colores

- **Base:** Negro profundo `#0A0A0F`
- **Acento primario:** Cian eléctrico `#00E5FF`
- **Acento secundario:** Magenta neón `#FF00E5`
- **Superficie:** Gris pizarra `#1A1A2E`
- **Terciario:** Verde ácido `#B8FF00`
- **Texto primario:** Blanco puro `#FFFFFF`
- **Texto secundario:** Gris claro `#A0A0B8`

### Tipografía

- **Display:** Bebas Neue (400) - Títulos
- **Headlines:** Space Grotesk (700) - Subtítulos
- **Body:** Space Grotesk (400) - Texto descriptivo
- **Data:** JetBrains Mono (400) - Metadata, fechas, labels

### Componentes Visuales

- Wordmark
- Isotipo
- Frequency line
- Signal node
- Brackets
- Grid

---

## Integraciones API

### Threads (OPERATIVO ✅)
- **App:** Frecuencia Global Publisher (App ID: 1227523599160977)
- **Account:** @globalfrequency.es (ID: 26618714181055427)
- **Permisos:** threads_basic, threads_content_publish
- **Image hosting:** catbox.moe / litterbox (URLs temp 72h)

### Instagram Graph API (PENDIENTE ⚠️)
- **Cuenta actual:** Personal (@globalfrequency.es)
- **Bloqueo:** Necesita conversión a Business/Creator
- **Alternativa:** Browser automation operativa

---

## Scripts de Publicación

| Script | Plataforma | Método | Estado |
|--------|-----------|--------|--------|
| `x_publish_post.py` | X/Twitter | Browser automation | ✅ Operativo |
| `linkedin_publish_post.py` | LinkedIn | Browser automation | ✅ Operativo |
| `ig_publish_post.py` | Instagram | Browser automation | ✅ Operativo |
| `threads_publish_post.py` | Threads | Graph API | ✅ Operativo |
| `tiktok_publish_post.py` | TikTok | Browser automation | ⚠️ En progreso |

### Sesiones Persistentes
- `.chrome-x-stable/` - X/Twitter
- `.chrome-linkedin-stable/` - LinkedIn
- `.chrome-ig-stable/` - Instagram
- `.chrome-tiktok-stable/` - TikTok

---

## Workflows n8n Cloud

| Workflow | ID | Propósito |
|----------|-----|-----------|
| WF-001 | Intake Ideas | Registro de ideas de contenido |
| WF-002 | Registro Brief | Creación de briefs estructurados |
| WF-003 | QA Checklist | Generación de checklist de calidad |
| WF-004 | Notificación Log | Registro de eventos operativos |
| WF-005 | Pipeline Status | Estado del pipeline de producción |
| WF-006 | Preparar Publicación | Preparación multiplataforma |
| WF-007 | Publicar X | Publicación en X/Twitter |
| WF-008 | Publicar Instagram | Publicación en Instagram |
| WF-009 | Publicar LinkedIn | Publicación en LinkedIn |
| WF-010 | Publicar TikTok | Publicación en TikTok |

---

## Fuente de Verdad Operativa

### Archivos Obligatorios en GitHub

| Archivo | Propósito | Formato |
|---------|-----------|---------|
| `04_Produccion/pipeline_tracker.json` | Estado de piezas | JSON |
| `07_Operaciones/FG_Operations_Log.md` | Log de eventos | Markdown |
| `08_n8n/templates/brief_template.md` | Template briefs | Markdown |
| `08_n8n/templates/qa_template.md` | Template QA | Markdown |
| `03_Editorial/` | Briefs, scripts | Markdown |
| `04_Produccion/` | PublishReady, QA | Markdown |

### Estados del Pipeline

- `BRIEF_READY` → `RESEARCH_DONE` → `SCRIPT_DONE` → `DESIGN_DONE` → `QA_PENDING` → `QA_APPROVED` / `QA_REJECTED` → `PUBLISH_READY` → `PUBLISHED`

---

## Reglas del Sistema

### No Negociables

1. Todo asset debe trazarse a un template, regla o componente del sistema
2. Naming convention obligatorio
3. Paleta cerrada
4. Tipografía cerrada
5. Toda afirmación factual requiere fuente verificable
6. Cada pilar tiene su tono
7. QA antes de publicar
8. Documentar decisiones y cambios relevantes

### Principios Operativos

- Modularidad
- Consistencia > creatividad aislada
- Estructura > decoración
- Progreso > perfección
- IA para ejecutar y empaquetar, no para improvisar la marca

---

## Estado Actual (2026-04-04)

### Milestones

| Milestone | Estado | Fecha |
|-----------|--------|-------|
| M1: Primera publicación multiplataforma | ✅ COMPLETADO | 2026-04-04 |
| M2: TikTok operativo | 🔄 En progreso | — |
| M3: Dominio propio activo | ⏳ Pendiente merge | — |
| M4: Facebook activo | ❌ No iniciado | — |
| M5: Podcast RSS | ⏳ Configurado | — |

### Plataformas Operativas

- **X/Twitter:** ✅ Browser automation
- **LinkedIn:** ✅ Browser automation
- **Instagram:** ✅ Browser automation (Graph API pendiente)
- **Threads:** ✅ Graph API
- **TikTok:** ⚠️ En progreso (domain verification)
- **Facebook:** ❌ Pendiente

### Dominio

- **Nuevo:** frecuenciaglobal.is-a.dev (PR abierto, esperando merge)
- **Anterior:** frecuenciaglobal.int.eu.org (Invalid Configuration)

---

## Tecnologías

- **Website:** Astro (Vercel)
- **Automatización social:** Python + Playwright
- **Workflows:** n8n Cloud
- **Generación de imágenes:** Gemini web + Nano Banana 2
- **Control de versiones:** GitHub
- **APIs:** Threads Graph API, Instagram Graph API (configurado, pendiente conversión cuenta)

---

## Instrucciones para Poe

Cuando trabajes en este proyecto:

1. **Siempre consulta** el `system/SISTEMA_MAESTRO.md` para entender el contexto completo
2. **Respeta las reglas del sistema** - especialmente la paleta cerrada y naming conventions
3. **Sigue el flujo de producción** definido en los agentes
4. **Usa los templates** en `system/templates/` para cualquier output
5. **Verifica el estado actual** en `07_Operaciones/PATCH_NOTES_*.md`
6. **Para automatización social**, revisa los scripts en `scripts/`
7. **Para workflows n8n**, consulta `08_n8n/workflows_cloud/`
8. **Para generación creativa**, usa la capa Gemini en `system/gemini/`

### Comandos Útiles

```bash
# Publicar pieza
python scripts/x_publish_post.py --pieza P1_001
python scripts/linkedin_publish_post.py --pieza P1_001
python scripts/ig_publish_post.py --pieza P1_001
python scripts/threads_publish_post.py --pieza P1_001

# Generar imágenes
python scripts/gemini_generate_image.py --prompt-file system/gemini/prompts/PROMPT_X.md

# Status del proyecto
cat system/memory/STATE_PROJECT.json
```

---

## Archivos Clave para Referencia Rápida

- `system/SISTEMA_MAESTRO.md` - Visión completa del sistema
- `system/FUENTE_DE_VERDAD_Y_CONTRATO.md` - Contrato de datos
- `README.md` - Overview del proyecto
- `07_Operaciones/PATCH_NOTES_2026-04-04_1924.md` - Estado más reciente
- `02_Brand_System/FG_Brand_Kit_Operativo.md` - Sistema visual completo

---

## Notas Importantes

- El proyecto usa browser automation para X, LinkedIn, Instagram (sesiones persistentes en Chrome)
- Threads usa Graph API (única plataforma con API operativa actualmente)
- Instagram Graph API está configurado pero la cuenta personal necesita conversión a Business/Creator
- El dominio is-a.dev está esperando merge del PR
- n8n Cloud no tiene filesystem persistente, usa GitHub API como datastore
- La capa Gemini (VS Code agents) es para generación creativa con Nano Banana 2
- Priorizar API-based approaches sobre browser automation cuando sea posible

---

*Este prompt es el contexto completo para trabajar en Frecuencia Global en Poe. Actualiza según evolucione el proyecto.*
