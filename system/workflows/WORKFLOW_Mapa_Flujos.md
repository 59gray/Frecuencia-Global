# WORKFLOW — Mapa de Flujos de Producción

**Sistema:** Frecuencia Global  
**Versión:** 1.0  
**Fecha:** 2026-03-30

---

## FLUJO A: PRODUCCIÓN DE PIEZA NUEVA (END-TO-END)

El flujo principal. Cubre desde la idea hasta la publicación.

```
┌──────────────────┐
│ CONTENT STRATEGY  │ ← Define tema, pilar, formato, ángulo
│ Output: Brief     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ RESEARCH AGENT    │ ← Investiga, verifica, estructura
│ Output: Ficha     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ SCRIPTWRITING     │ ← Guión, copies, hooks, CTAs
│ Output: Guión +   │
│ Brief de diseño   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ DESIGN PRODUCTION │ ← Piezas visuales finales
│ Output: PNG/MP4   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────┐
│ QA / CONSISTENCY  │────→│ CORRECCIONES  │ (si FAIL)
│ Output: PASS/FAIL │     │ → Agente resp.│
└────────┬─────────┘     └──────┬───────┘
         │ (PASS)                │
         ▼                      │ (Re-entrega)
┌──────────────────┐            │
│ PUBLICACIÓN       │◄───────────┘
│ (via PM Agent)    │
└──────────────────┘
```

**Playbook:** [`PB_01_Crear_Pieza_Nueva.md`](../playbooks/PB_01_Crear_Pieza_Nueva.md)  
**Tiempo total:** 3-8 horas según formato

---

## FLUJO B: BREAKING NEWS (EXPRESS)

Timeline comprimido para eventos urgentes. Máximo 3 horas de idea a publicación.

```
┌────────────────────┐
│ ALERTA / EVENTO     │ ← Detectado por cualquier agente
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ CONTENT STRATEGY    │ ← Evaluación rápida: ¿publicar?
│ (5 min)             │   ¿Es real? ¿Es relevante para FG?
└────────┬───────────┘
         │ (SÍ)
         ▼
┌────────────────────┐
│ RESEARCH EXPRESS    │ ← Solo T1-T2. Mínimo 2 confirmaciones
│ (30 min)            │   Ficha mínima viable
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ SCRIPTWRITING MICRO │ ← Guión 60-90s o carrusel 5 slides
│ (30 min)            │   Hook + 2-3 datos + CTA
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ DESIGN PRODUCTION   │ ← Usar template existente del pilar
│ (30 min)            │   Sin diseño custom
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ QA FAST-TRACK       │ ← Checklist comprimido (10 min)
│ (10 min)            │   Solo: datos, colores, ortografía, CTA
└────────┬───────────┘
         │ (PASS)
         ▼
┌────────────────────┐
│ PUBLICAR INMEDIATO  │ ← <3h del evento
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ POST-PUBLICACIÓN    │ ← Ampliar investigación
│ (1-2h después)      │   Verificar corrección
└────────────────────┘
```

**Playbook:** [`PB_02_Investigar_Noticia.md`](../playbooks/PB_02_Investigar_Noticia.md) (Modo B)  
**Tiempo total:** 1.5-3 horas

---

## FLUJO C: REPURPOSING DE CONTENIDO EXISTENTE

Derivar múltiples piezas de una pieza fuente (típicamente: video largo → shorts + carruseles + threads).

```
┌─────────────────────┐
│ PIEZA FUENTE         │ ← Video largo publicado
│ (ya existe)          │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ CONTENT STRATEGY     │ ← Selecciona qué derivados producir
│ Mapa de repurposing: │
│  ├── 3 shorts        │
│  ├── 1 carrusel      │
│  ├── 1 thread X      │
│  └── 1 LinkedIn post │
└────────┬────────────┘
         │
    ┌────┴────┬────────┬──────────┐
    ▼         ▼        ▼          ▼
┌────────┐ ┌──────┐ ┌──────┐ ┌────────┐
│ SCRIPT │ │SCRIPT│ │SCRIPT│ │ SCRIPT │
│ shorts │ │carrus│ │thread│ │LinkedIn│
└───┬────┘ └──┬───┘ └──┬───┘ └───┬────┘
    │         │        │          │
    ▼         ▼        │          │
┌────────┐ ┌──────┐   │          │
│ DESIGN │ │DESIGN│   │          │
│ shorts │ │carrus│   │          │
└───┬────┘ └──┬───┘   │          │
    │         │        │          │
    └────┬────┘        │          │
         │             │          │
         ▼             ▼          ▼
┌─────────────────────────────────────┐
│ QA (batch)                           │ ← Revisar todo junto
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ PUBLICAR (escalonado por plataforma) │
└─────────────────────────────────────┘
```

**Playbook:** [`PB_03_Tema_a_Contenido.md`](../playbooks/PB_03_Tema_a_Contenido.md) (sección repurposing)  
**Tiempo total:** 2-4 horas para todos los derivados

---

## FLUJO D: ACTUALIZACIÓN DE BRAND ASSETS

Cambios al sistema visual. Impacto alto, frecuencia baja.

```
┌─────────────────────┐
│ NECESIDAD DETECTADA  │ ← Nuevo template / componente / pilar
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ BRAND SYSTEM AGENT   │ ← Evaluar necesidad vs. catálogo actual
│ ¿Existe algo           │   ¿Se puede reutilizar?
│  reutilizable?        │
└────────┬────────────┘
         │ (NO existe)
         ▼
┌─────────────────────┐
│ DISEÑO DEL ASSET     │ ← Crear componente según Brand Kit
│ Brand System Agent   │   Respetar paleta, tipografía, grid
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ QA DEL SISTEMA       │ ← Verificar consistencia con sistema
│ QA Agent             │   ¿Rompe algo existente?
└────────┬────────────┘
         │ (PASS)
         ▼
┌─────────────────────┐
│ DOCUMENTACIÓN        │ ← Actualizar Brand Kit + README
│ Brand System Agent   │   Registrar en changelog
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ NOTIFICACIÓN         │ ← Informar a Design Production
│ PM Agent             │   Template disponible para uso
└─────────────────────┘
```

**Playbook:** [`PB_05_Actualizar_Brand_Assets.md`](../playbooks/PB_05_Actualizar_Brand_Assets.md)

---

## FLUJO E: CICLO SEMANAL COMPLETO

El meta-flujo que organiza toda la semana.

```
LUNES
├── PM revisa semana anterior
├── Content Strategy → plan semanal
├── Distribución de briefs
└── Research inicia investigación del video principal

MARTES
├── Research completa investigación
├── Scriptwriting inicia carruseles (si research listo)
└── PM verifica avance

MIÉRCOLES
├── Scriptwriting completa guión video largo
├── Scriptwriting completa copies carruseles
├── Design Production inicia producción
└── PM facilita handoffs

JUEVES
├── Design Production completa piezas
├── QA revisa todo
├── Correcciones (si QA FAIL)
├── Scriptwriting: thread X + LinkedIn
└── PM: coordina publicación

VIERNES
├── Publicación de piezas restantes
├── Retrospectiva semanal
├── Actualizar checkpoint
└── Preparar próxima semana

WEEKEND
└── Solo breaking news de alto impacto (Flujo B)
```

**Playbook:** [`PB_06_Produccion_Semanal.md`](../playbooks/PB_06_Produccion_Semanal.md)

---

## FLUJO F: PODCAST + VIDEOPODCAST

Línea formal para episodios semanales con salida simultánea a RSS.com, YouTube y web editorial opcional.

```text
CONTENT STRATEGY
  -> define tema, pilar, duración y salidas

RESEARCH
  -> verifica datos, fuentes y estructura del episodio

SCRIPTWRITING
  -> outline, guion, CTA y show notes

AUDIO PRODUCER
  -> audio master y dirección sonora

VIDEO PRODUCER
  -> visualizer 16:9, chapters, metadata YouTube y clip manifest

DESIGN PRODUCTION
  -> cover cuadrado, thumbnail 16:9, lower thirds y exports

QA
  -> valida audio, video, metadata, show notes y clips

PUBLICACIÓN
  -> RSS.com + YouTube + derivados sociales + web editorial opcional
```

**Flujo operativo:** [`../../04_Produccion/FG_Flujo_Produccion_Podcast.md`](../../04_Produccion/FG_Flujo_Produccion_Podcast.md)

---

## MAPA DE HANDOFFS

Cada flecha = un handoff documentado con [`TPL_Handoff_Agentes.md`](../templates/TPL_Handoff_Agentes.md)

```
Content Strategy ──brief──→ Research
Research ──ficha──→ Scriptwriting
Scriptwriting ──guión+show notes──→ Audio Producer
Audio Producer ──audio master──→ Video Producer
Video Producer ──videopodcast+brief diseño──→ Design Production
Scriptwriting ──guión+brief diseño──→ Design Production
Design Production ──pieza final──→ QA
QA ──aprobación──→ PM (publicación)
QA ──rechazo+correcciones──→ Agente responsable
Brand System ──templates──→ Design Production
Brand System ──reglas──→ QA
PM ──sprint plan──→ Todos
PM ──retrospectiva──→ Todos
```

---

## ESTADOS DE UNA PIEZA

```
BACKLOG → BRIEFED → IN_RESEARCH → IN_SCRIPT → IN_DESIGN → IN_QA → QA_PASS → PUBLISHED
                                                              ↓
                                                          QA_FAIL → CORRECCIONES → re-envío a IN_QA
```

| Estado | Responsable | Criterio de salida |
|--------|-------------|-------------------|
| BACKLOG | Content Strategy | Tema identificado, no priorizado |
| BRIEFED | Content Strategy | Brief completo enviado |
| IN_RESEARCH | Research Agent | Investigando |
| IN_SCRIPT | Scriptwriting Agent | Escribiendo guión/copy |
| IN_DESIGN | Design Production | Produciendo visual |
| IN_QA | QA Agent | Revisando |
| QA_PASS | PM Agent | Aprobado → programar publicación |
| QA_FAIL | Agente señalado | Corrigiendo → re-QA |
| PUBLISHED | — | Publicado en plataforma |
| BLOCKED | PM Agent | Detenido, con plan de resolución |
| CANCELLED | PM Agent | Cancelado con justificación |

---

*Estos flujos son el sistema nervioso de la producción. Seguirlos garantiza que nada se pierda entre agentes y que el output sea consistente.*
