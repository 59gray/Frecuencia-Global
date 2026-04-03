# SISTEMA MAESTRO - Frecuencia Global

**Versión:** 1.1  
**Fecha:** 2026-04-01  
**Tipo:** Documento maestro del sistema operativo de producción  
**Estado:** Activo

---

## 1. VISIÓN DEL PROYECTO

Frecuencia Global es una marca multiplataforma que traduce geopolítica, relaciones internacionales y cultura global a formatos accesibles con una identidad visual y narrativa inspirada en música electrónica.

**Misión:** Hacer que el análisis internacional sea accesible, visual y relevante para audiencias jóvenes sin sacrificar rigor analítico.  
**Tagline:** *"Análisis internacional con pulso electrónico"*

---

## 2. POSICIONAMIENTO

| Dimensión | Definición |
|-----------|------------|
| **Qué es** | Canal de análisis geopolítico y cultural con estética electrónica |
| **Qué no es** | Canal de música, blog de opinión sin fuentes, medio tradicional |
| **Diferenciador** | Intersección entre IR profesional, cultura bass/EDM y formatos nativos digitales |
| **Propuesta de valor** | Contenido geopolítico con ritmo, intensidad y estructura de "drop" informativo |

---

## 3. AUDIENCIA

### Primaria (18-35)

- Consumidores de música electrónica con interés en asuntos globales
- Estudiantes y jóvenes profesionales de RI, ciencia política y periodismo
- Nativos digitales que consumen contenido en TikTok, YouTube e Instagram

### Secundaria

- Profesionales de RI, diplomacia y seguridad
- Industria del entretenimiento y música con ángulo internacional
- Académicos buscando nuevas formas de divulgación

---

## 4. PILARES DE CONTENIDO

| # | Pilar | Color | Hex | Tono | Formato principal |
|---|-------|-------|-----|------|-------------------|
| 1 | **Geopolitik Drop** | Cian eléctrico | `#00E5FF` | Intenso, directo, visual | Video largo, shorts, episodios |
| 2 | **Bass & Borders** | Magenta neón | `#FF00E5` | Exploratorio, cultural | Video largo, carruseles, episodios |
| 3 | **Frecuencia Global** | Verde ácido | `#B8FF00` | Ágil, informativo, rítmico | TikTok/Reels 60-90 s, carruseles, clips de episodio |
| 4 | **Behind the Policy** | Azul profundo | `#4A6BFF` | Formal, analítico | LinkedIn, newsletter, video, episodios |

---

## 5. SISTEMA VISUAL - RESUMEN EJECUTIVO

> Documento completo: [`02_Brand_System/FG_Brand_Kit_Operativo.md`](../02_Brand_System/FG_Brand_Kit_Operativo.md)

### Paleta

| Rol | Color | Hex |
|-----|-------|-----|
| Base | Negro profundo | `#0A0A0F` |
| Acento primario | Cian eléctrico | `#00E5FF` |
| Acento secundario | Magenta neón | `#FF00E5` |
| Superficie | Gris pizarra | `#1A1A2E` |
| Terciario | Verde ácido | `#B8FF00` |
| Texto primario | Blanco puro | `#FFFFFF` |
| Texto secundario | Gris claro | `#A0A0B8` |

### Tipografía

| Nivel | Fuente | Peso | Uso |
|-------|--------|------|-----|
| Display | Bebas Neue | 400 | Títulos |
| Headlines | Space Grotesk | 700 | Subtítulos y jerarquías |
| Body | Space Grotesk | 400 | Texto descriptivo |
| Data | JetBrains Mono | 400 | Metadata, fechas, labels |

### Componentes

- Wordmark
- Isotipo
- Frequency line
- Signal node
- Brackets
- Grid

---

## 6. MAPA DE AGENTES

El sistema opera con una capa de agentes core y una capa de soporte/especialidad. Cada agente tiene un archivo de definición completo en [`system/agents/`](agents/).

### Agentes core

| # | Agente | Archivo | Responsabilidad clave |
|---|--------|---------|----------------------|
| 1 | Brand System | [`AGENT_01_Brand_System.md`](agents/AGENT_01_Brand_System.md) | Identidad visual, consistencia y templates |
| 2 | Content Strategy | [`AGENT_02_Content_Strategy.md`](agents/AGENT_02_Content_Strategy.md) | Pilares, series, calendario y ángulos |
| 3 | Research | [`AGENT_03_Research.md`](agents/AGENT_03_Research.md) | Investigación, sourcing y fact-checking |
| 4 | Scriptwriting | [`AGENT_04_Scriptwriting.md`](agents/AGENT_04_Scriptwriting.md) | Guiones, hooks, copies y CTAs |
| 5 | Design Production | [`AGENT_05_Design_Production.md`](agents/AGENT_05_Design_Production.md) | Diseño, edición y exportación final |
| 6 | QA / Consistency | [`AGENT_06_QA_Consistency.md`](agents/AGENT_06_QA_Consistency.md) | Revisión editorial y visual |
| 7 | Project Manager | [`AGENT_07_Project_Manager.md`](agents/AGENT_07_Project_Manager.md) | Coordinación, handoffs y prioridades |

### Agentes de soporte

| # | Agente | Archivo | Responsabilidad clave |
|---|--------|---------|----------------------|
| 8 | Memory / State Manager | [`AGENT_08_Memory_State_Manager.md`](agents/AGENT_08_Memory_State_Manager.md) | Estado persistente y trazabilidad |
| 9 | Critical Reviewer | [`AGENT_09_Critical_Reviewer.md`](agents/AGENT_09_Critical_Reviewer.md) | Riesgos, huecos y falsa seguridad |
| 10 | Context Mapper | [`AGENT_10_Context_Mapper.md`](agents/AGENT_10_Context_Mapper.md) | Contexto mínimo accionable |
| 11 | Integrator | [`AGENT_11_Integrator.md`](agents/AGENT_11_Integrator.md) | Ensamblado final de outputs |

### Agente especialista

| # | Agente | Archivo | Responsabilidad clave |
|---|--------|---------|----------------------|
| 12 | Video Producer | [`AGENT_12_Video_Producer.md`](agents/AGENT_12_Video_Producer.md) | Concepto, hooks, storyboard, shot list, edición y adaptaciones de video |

### Flujo principal de producción

```text
1. Content Strategy -> Define tema, pilar, formato y objetivo
2. Research -> Investiga, verifica y estructura hallazgos
3. Scriptwriting -> Convierte research en guión/copy
4. Audio Producer -> Si la pieza incluye podcast o audio master, define la salida sonora
5. Video Producer -> Si la pieza incluye video o videopodcast, la baja a paquete audiovisual completo
6. Design Production -> Diseña, edita y exporta piezas finales
7. QA / Consistency -> Revisa coherencia, tono, branding y specs
8. Project Manager -> Coordina todo el flujo
9. Brand System -> Mantiene estándares visuales (consultivo)
```

**Nota:** Para piezas no audiovisuales, los pasos de Audio Producer y Video Producer pueden omitirse según aplique.

### 6.1 Capa Gemini - Agentes de generación creativa (VS Code)

Capa complementaria de agentes nativos de VS Code (`.agent.md`) enfocados en generación creativa con Nano Banana 2 y dirección de audio/video. Opera ENTRE Scriptwriting (paso 3) y Design Production (paso 5) del flujo principal.

| Agente | Archivo | Responsabilidad |
|--------|---------|-----------------|
| **Supervisor** | [`.github/agents/supervisor.agent.md`](../../.github/agents/supervisor.agent.md) | Orquesta sesiones creativas, delega a subagentes, consolida outputs |
| **Visual Creator** | [`.github/agents/visual-creator.agent.md`](../../.github/agents/visual-creator.agent.md) | Genera prompts Nano Banana 2, dirección visual, thumbnails, covers |
| **Video Producer** | [`.github/agents/video-producer.agent.md`](../../.github/agents/video-producer.agent.md) | Storyboards, shot lists, editing briefs, adaptaciones multiplataforma |
| **Audio Producer** | [`.github/agents/audio-producer.agent.md`](../../.github/agents/audio-producer.agent.md) | Diseño sonoro, identidad musical, briefs de audio, referencia RAVE LOKOTE |

**Relación con agentes existentes:**
- Supervisor != Project Manager (AGENT_07) - PM maneja proyecto; Supervisor maneja sesión creativa
- Visual Creator != Design Production (AGENT_05) - Design ejecuta en Canva/Figma; Visual Creator genera vía Nano Banana
- Video Producer Gemini extiende AGENT_12 con capacidades de generación
- Audio Producer es completamente nuevo

**Infraestructura Gemini:**
- Prompts: `system/gemini/prompts/`
- Workflows: `system/gemini/workflows/`
- Referencias: `system/gemini/references/` (approved / exploratory / discarded)
- Outputs: `system/gemini/outputs/` (visual / video / audio)
- QA: `system/gemini/qa/`
- Brief templates: `system/templates/TPL_Brief_[Visual|Video|Audio]_Gemini.md`

**Invocación:** usar `@supervisor`, `@visual-creator`, `@video-producer`, `@audio-producer` en Copilot Chat de VS Code.

---

## 7. FLUJOS DE TRABAJO

> Detalle completo: [`system/workflows/WORKFLOW_Mapa_Flujos.md`](workflows/WORKFLOW_Mapa_Flujos.md)

### Flujo A: Producción de pieza nueva
`Content Strategy -> Research -> Scriptwriting -> Video Producer (si aplica) -> Design Production -> QA -> Publicación`

### Flujo B: Breaking news rápida
`Research express -> Scriptwriting micro -> Video Producer micro (si aplica) -> Design Production -> QA fast -> Publicación`

### Flujo C: Repurposing de contenido existente
`Content Strategy -> Scriptwriting -> Video Producer -> Design Production -> QA -> Publicación`

### Flujo D: Actualización de brand assets
`Brand System -> Design Production -> QA -> Documentación`

### Flujo E: Ciclo semanal completo
`Project Manager -> Content Strategy -> [Flujos A/B/C] -> QA -> Retrospectiva`

### Flujo F: Producción formal de video
`Brief -> Guión -> Storyboard -> Shot list -> Editing brief -> Export versions`

### Flujo G: Pipeline multimedia Gemini
`Brief -> @supervisor analiza -> Delega a @visual/@video/@audio -> Producción -> Consolidación -> Handoff a Design Production/QA`
> Detalle completo: [`system/gemini/workflows/WORKFLOW_Multimedia_Pipeline.md`](gemini/workflows/WORKFLOW_Multimedia_Pipeline.md)

### Flujo H: Producción formal de podcast + videopodcast
`Brief -> Guión -> Audio master -> Video visualizer 16:9 -> Show notes -> QA -> RSS.com + YouTube + derivados + web editorial opcional`
> Detalle completo: [`04_Produccion/FG_Flujo_Produccion_Podcast.md`](../04_Produccion/FG_Flujo_Produccion_Podcast.md)

---

## 8. REGLAS MAESTRAS DEL SISTEMA

### No negociables

1. Todo asset debe trazarse a un template, regla o componente del sistema.
2. Naming convention obligatorio.
3. Paleta cerrada.
4. Tipografía cerrada.
5. Toda afirmación factual requiere fuente verificable.
6. Cada pilar tiene su tono.
7. QA antes de publicar.
8. Documentar decisiones y cambios relevantes.

### Principios operativos

- Modularidad
- Consistencia > creatividad aislada
- Estructura > decoración
- Progreso > perfección
- IA para ejecutar y empaquetar, no para improvisar la marca

---

## 9. ESTRUCTURA DEL REPOSITORIO

```text
Frecuencia Global/
|
|-- .github/
|   |-- agents/             <- Agentes VS Code nativos (Gemini layer)
|   `-- instructions/       <- Contexto compartido auto-cargado
|
|-- system/
|   |-- SISTEMA_MAESTRO.md
|   |-- agents/
|   |-- gemini/             <- Infraestructura de generación Gemini
|   |   |-- prompts/
|   |   |-- workflows/
|   |   |-- references/
|   |   |-- outputs/
|   |   `-- qa/
|   |-- playbooks/
|   |-- templates/
|   |-- rules/
|   |-- workflows/
|   `-- roadmap/
|
|-- 01_Estrategia/
|-- 02_Brand_System/
|-- 03_Editorial/
|-- 04_Produccion/
|-- 05_Monetizacion/
|-- 06_Assets/
|-- 07_Operaciones/
|
|-- 08_n8n/                <- Workflows n8n (cloud)
|-- website/               <- Sitio Astro (Vercel)
|-- scripts/               <- Automatizaciones sociales
|-- static/                <- Tipografías locales
`-- README.md
```

---

## 10. PLAYBOOKS DISPONIBLES

| # | Playbook | Archivo | Cuándo usarlo |
|---|----------|---------|---------------|
| 1 | Crear pieza nueva | [`PB_01_Crear_Pieza_Nueva.md`](playbooks/PB_01_Crear_Pieza_Nueva.md) | Contenido desde cero |
| 2 | Investigar noticia | [`PB_02_Investigar_Noticia.md`](playbooks/PB_02_Investigar_Noticia.md) | Evento o tema a cubrir |
| 3 | Tema a contenido | [`PB_03_Tema_a_Contenido.md`](playbooks/PB_03_Tema_a_Contenido.md) | Reel, carrusel, post |
| 4 | Revisión de consistencia | [`PB_04_Revision_Consistencia.md`](playbooks/PB_04_Revision_Consistencia.md) | Antes de publicar |
| 5 | Actualizar brand assets | [`PB_05_Actualizar_Brand_Assets.md`](playbooks/PB_05_Actualizar_Brand_Assets.md) | Cambios al sistema visual |
| 6 | Producción semanal | [`PB_06_Produccion_Semanal.md`](playbooks/PB_06_Produccion_Semanal.md) | Planificación semanal |

---

## 11. TEMPLATES DISPONIBLES

### Templates base

| Template | Archivo | Usado por |
|----------|---------|-----------|
| Brief de contenido | [`TPL_Brief_Contenido.md`](templates/TPL_Brief_Contenido.md) | Content Strategy |
| Brief de diseño | [`TPL_Brief_Diseno.md`](templates/TPL_Brief_Diseno.md) | Scriptwriting / Design |
| Ficha de investigación | [`TPL_Ficha_Investigacion.md`](templates/TPL_Ficha_Investigacion.md) | Research |
| Handoff estructurado | [`TPL_Handoff_Structured.json`](templates/TPL_Handoff_Structured.json) | Todos |
| QA Checklist | [`TPL_QA_Checklist.md`](templates/TPL_QA_Checklist.md) | QA |
| Calendar Entry | [`TPL_Calendar_Entry.md`](templates/TPL_Calendar_Entry.md) | PM / Strategy |
| Creative Request | [`TPL_Creative_Request.md`](templates/TPL_Creative_Request.md) | Cualquier agente |

### Templates de video

| Template | Archivo | Usado por |
|----------|---------|-----------|
| Short 30-60 s | [`TPL_Video_Short_30_60.md`](templates/TPL_Video_Short_30_60.md) | Scriptwriting / Video Producer |
| Short 60-90 s | [`TPL_Video_Short_60_90.md`](templates/TPL_Video_Short_60_90.md) | Scriptwriting / Video Producer |
| Video brief 2-5 min | [`TPL_Video_Brief_2_5_Min.md`](templates/TPL_Video_Brief_2_5_Min.md) | Strategy / Script / Video |
| Storyboard | [`TPL_Video_Storyboard.md`](templates/TPL_Video_Storyboard.md) | Video Producer |
| Editing brief | [`TPL_Video_Editing_Brief.md`](templates/TPL_Video_Editing_Brief.md) | Video Producer / Design |
| Subtitle / on-screen text | [`TPL_Video_Subtitles_OnScreen.md`](templates/TPL_Video_Subtitles_OnScreen.md) | Video Producer / QA |
| Thumbnail brief | [`TPL_Video_Thumbnail_Brief.md`](templates/TPL_Video_Thumbnail_Brief.md) | Video Producer / Design |
| Repurposing map | [`TPL_Video_Repurposing.md`](templates/TPL_Video_Repurposing.md) | Video Producer / PM |

### Flujos operativos complementarios

| Flujo | Archivo | Usado por |
|-------|---------|-----------|
| Producción formal de video | [`04_Produccion/FG_Flujo_Produccion_Video.md`](../04_Produccion/FG_Flujo_Produccion_Video.md) | Video Producer / Design / QA |
| Producción formal de podcast | [`04_Produccion/FG_Flujo_Produccion_Podcast.md`](../04_Produccion/FG_Flujo_Produccion_Podcast.md) | Audio Producer / Video Producer / PM / QA |

### Templates Gemini (generación creativa)

| Template | Archivo | Usado por |
|----------|---------|-----------|
| Brief visual Gemini | [`TPL_Brief_Visual_Gemini.md`](templates/TPL_Brief_Visual_Gemini.md) | Visual Creator / Supervisor |
| Brief video Gemini | [`TPL_Brief_Video_Gemini.md`](templates/TPL_Brief_Video_Gemini.md) | Video Producer / Supervisor |
| Brief audio Gemini | [`TPL_Brief_Audio_Gemini.md`](templates/TPL_Brief_Audio_Gemini.md) | Audio Producer / Supervisor |

---

## 12. REGLAS DEL SISTEMA

| Regla | Archivo | Aplica a |
|-------|---------|----------|
| Naming Conventions | [`RULE_Naming_Conventions.md`](rules/RULE_Naming_Conventions.md) | Todos los archivos |
| Folder Conventions | [`RULE_Folder_Conventions.md`](rules/RULE_Folder_Conventions.md) | Estructura del repo |
| Source Quality | [`RULE_Source_Quality.md`](rules/RULE_Source_Quality.md) | Research |
| Tone of Voice | [`RULE_Tone_of_Voice.md`](rules/RULE_Tone_of_Voice.md) | Scriptwriting, QA |
| Visual Consistency | [`RULE_Visual_Consistency.md`](rules/RULE_Visual_Consistency.md) | Design, Brand |
| File Output Standards | [`RULE_File_Output_Standards.md`](rules/RULE_File_Output_Standards.md) | Design, video exports |
| AI Collaboration | [`RULE_AI_Collaboration.md`](rules/RULE_AI_Collaboration.md) | Gobernanza IA |

---

## 13. CHANGELOG DEL SISTEMA

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2026-03-30 | Creación del sistema maestro v1.0 | Sistema |
| 2026-03-30 | Implementación del sistema base de agentes, playbooks, templates y reglas | Sistema |
| 2026-03-30 | Integración con documentación estratégica y visual existente | Sistema |
| 2026-03-30 | Añadida `RULE_AI_Collaboration` para gobernanza IA | Sistema |
| 2026-04-01 | Integrada capa formal de video: `Video Producer Agent`, workflow, templates y ejemplos | Sistema |
| 2026-04-01 | Normalizado el mapa real de agentes del repo (core + soporte + especialidad) | Sistema |
| 2026-04-01 | Añadida capa Gemini: 4 agentes VS Code (`.agent.md`), infraestructura `system/gemini/`, templates de brief, workflow multimedia, QA checklist, referencia RAVE LOKOTE | Copilot |

---

## 14. CONTACTO Y OWNERSHIP

| Rol | Nombre | Responsabilidad |
|-----|--------|----------------|
| Fundador / Director | Farid Assad | Decisiones estratégicas, contenido, marca |
| Sistema de agentes | Este repositorio | Operaciones, estándares y producción |

---

*Este documento es la referencia central del sistema. Toda decisión operativa debe alinearse con lo aquí establecido.*
