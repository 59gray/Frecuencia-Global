# DETROIT_VISUAL_DECISION_MATRIX
# D06 — Matriz de decisión visual Detroit
# 2026-04-25 | Frecuencia Global

**Corte:** 2026-04-25
**Guardrails:** No marcar como final absoluto sin revisión humana · No mover assets · No borrar

---

## Criterios de evaluación

| Criterio | Descripción |
|----------|-------------|
| **Relación con artículo** | ¿La imagen evoca Detroit, techno, industria, diáspora afroamericana? |
| **Legibilidad** | ¿Funciona sin contexto? ¿El mensaje visual es claro? |
| **Encuadre** | ¿El recorte es adecuado para el formato declarado? |
| **Coherencia Bass & Borders** | ¿Alinea con el pilar P2 — migración cultural, música, identidad? |
| **Compatibilidad web** | ¿Peso razonable para web? (objetivo: <500 KB para hero principal) |
| **Compatibilidad social** | ¿Funciona en formato cuadrado o 16:9 para RRSS? |
| **Riesgo visual** | ¿Hay elementos que puedan generar confusión, ofensa o ruido? |

---

## Estados permitidos

- `APPROVED_FOR_HUMAN_REVIEW` — candidato apto, requiere validación visual de Farid
- `NEEDS_HUMAN_REVIEW` — potencialmente útil, necesita inspección directa
- `REJECTED_FOR_NOW` — no apto para este ciclo por razón técnica documentada
- `RAW_OUTPUT_ONLY` — output bruto ComfyUI, no curado, no usar directamente

---

## ROL 1 — Hero web

### Candidato 1: `techno-detroit-hero.webp` (327 KB)

| Criterio | Evaluación |
|----------|-----------|
| Relación con artículo | ✅ Nombre explícito "hero", asociado directamente al slug |
| Legibilidad | No evaluable sin inspección visual directa |
| Encuadre | Formato WebP — compatible con web |
| Coherencia Bass & Borders | Asumida por contexto de generación |
| Compatibilidad web | ✅ 327 KB — dentro del objetivo |
| Compatibilidad social | ⚠️ Requiere verificar ratio — no confirmado localmente |
| Riesgo visual | No identificado sin inspección directa |
| **Estado** | **APPROVED_FOR_HUMAN_REVIEW** |

### Candidato 2: `techno-detroit-hero.png` (3.6 MB)

| Criterio | Evaluación |
|----------|-----------|
| Relación con artículo | ✅ Mismo nombre base que candidato 1 (fuente HD) |
| Legibilidad | No evaluable sin inspección visual directa |
| Encuadre | PNG alta resolución — fuente para conversión |
| Coherencia Bass & Borders | Asumida por contexto |
| Compatibilidad web | ⚠️ 3.6 MB — excede objetivo web; usar como fuente para webp |
| Compatibilidad social | ⚠️ Requiere conversión |
| Riesgo visual | No identificado sin inspección directa |
| **Estado** | **NEEDS_HUMAN_REVIEW** — usar como fuente HD, no publicar directamente |

### Candidato 3: `techno-detroit.png` (827 KB)

| Criterio | Evaluación |
|----------|-----------|
| Relación con artículo | ✅ Nombre base = slug — actualmente en frontmatter |
| Legibilidad | No evaluable sin inspección visual directa |
| Encuadre | Desconocido — formato y ratio no verificados |
| Coherencia Bass & Borders | No confirmada |
| Compatibilidad web | ✅ 827 KB — aceptable como placeholder |
| Compatibilidad social | Desconocida |
| Riesgo visual | No identificado |
| **Estado** | **NEEDS_HUMAN_REVIEW** — válido como placeholder actual, no canónico definitivo |

---

## ROL 2 — Card / thumbnail

### Candidato 1: `techno-detroit-card.png` (1.5 MB)

| Criterio | Evaluación |
|----------|-----------|
| Relación con artículo | ✅ Nombre explícito "card" |
| Legibilidad | No evaluable sin inspección directa |
| Encuadre | Presumiblemente formato card — requiere verificación |
| Coherencia Bass & Borders | Asumida |
| Compatibilidad web | ⚠️ 1.5 MB — alto para card; puede requerir compresión |
| Compatibilidad social | ⚠️ Requiere verificar ratio cuadrado o 16:9 |
| Riesgo visual | No identificado |
| **Estado** | **APPROVED_FOR_HUMAN_REVIEW** — único candidato explícito para este rol |

---

## ROL 3 — Open Graph

### Candidato 1: `techno-detroit-og.png` (1.1 MB)

| Criterio | Evaluación |
|----------|-----------|
| Relación con artículo | ✅ Nombre explícito "og" |
| Legibilidad | No evaluable sin inspección directa |
| Encuadre | OG estándar es 1200×630px — requiere verificación dimensional |
| Coherencia Bass & Borders | Asumida |
| Compatibilidad web | ✅ 1.1 MB — aceptable para OG (no se sirve inline) |
| Compatibilidad social | ✅ Uso específico para meta tags OG |
| Riesgo visual | No identificado |
| **Estado** | **APPROVED_FOR_HUMAN_REVIEW** — único candidato explícito para este rol |

---

## ROL 4 — Billboard / manga editorial

### Candidato 1: `techno-detroit-billboard-manga-v1-rebuilt.webp` (215 KB)

| Criterio | Evaluación |
|----------|-----------|
| Relación con artículo | ✅ Billboard manga "rebuilt" — versión curada del lote v1 |
| Legibilidad | Estilo manga — requiere inspección para verificar legibilidad |
| Encuadre | Formato billboard horizontal — no confirmado dimensionalmente |
| Coherencia Bass & Borders | ✅ Estilo manga-billboard alineado con visual FG |
| Compatibilidad web | ✅ 215 KB — excelente para web |
| Compatibilidad social | ⚠️ Formato billboard puede no ser cuadrado para IG |
| Riesgo visual | No identificado sin inspección directa |
| **Estado** | **APPROVED_FOR_HUMAN_REVIEW** |

### Candidato 2: `techno-detroit-billboard-manga-v3.png` (458 KB)

| Criterio | Evaluación |
|----------|-----------|
| Relación con artículo | ✅ Billboard manga v3 — iteración posterior |
| Legibilidad | No evaluable sin inspección directa |
| Encuadre | Desconocido |
| Coherencia Bass & Borders | ✅ Estilo manga |
| Compatibilidad web | ✅ 458 KB — aceptable |
| Compatibilidad social | Desconocida |
| Riesgo visual | No identificado |
| **Estado** | **NEEDS_HUMAN_REVIEW** |

### Candidato 3: `techno-detroit-manga-02-master-v2.webp` (361 KB)

| Criterio | Evaluación |
|----------|-----------|
| Relación con artículo | ✅ Manga master — iteración v2 curada |
| Legibilidad | No evaluable sin inspección directa |
| Encuadre | Probablemente vertical — requiere verificación |
| Coherencia Bass & Borders | ✅ Estilo manga |
| Compatibilidad web | ✅ 361 KB — aceptable |
| Compatibilidad social | ⚠️ Formato vertical puede ser óptimo para IG stories |
| Riesgo visual | No identificado |
| **Estado** | **NEEDS_HUMAN_REVIEW** |

---

## ROL 5 — Manga editorial (uso en cuerpo de artículo)

### Candidato 1: `techno-detroit-manga-02-master-v2.png` (2.1 MB)

| Criterio | Evaluación |
|----------|-----------|
| Relación con artículo | ✅ Master curado, mayor resolución de la serie manga-02 |
| Compatibilidad web | ⚠️ 2.1 MB — alto; requiere conversión a webp antes de usar inline |
| **Estado** | **APPROVED_FOR_HUMAN_REVIEW** — como fuente HD; publicar vía webp |

### Candidato 2: `techno-detroit-manga-02.png` (1.2 MB)

| Estado | **NEEDS_HUMAN_REVIEW** |
|--------|------------------------|

### Candidato 3: `techno-detroit-manga-03.png` (902 KB)

| Estado | **NEEDS_HUMAN_REVIEW** |
|--------|------------------------|

---

## ROL 6 — Thumbnail vertical / IG story

| Candidato | Estado | Razón |
|-----------|--------|-------|
| faltante real | — | No encontrado en raíz ni confirmado en lotes ComfyUI |

**Acción:** Explorar lotes `_comfy_download_techno_manga/` manualmente en sesión con Farid.

---

## Assets rechazados

| Archivo | Razón | Estado |
|---------|-------|--------|
| `techno-detroit-manga-01-v8.png` (17 KB) | Resolución insuficiente | REJECTED_FOR_NOW |
| `techno-detroit-manga-01-v8.webp` (26 KB) | Resolución insuficiente | REJECTED_FOR_NOW |
| `techno-detroit-manga-01-v9.png` (6 KB) | Resolución insuficiente — thumbnail de prueba | REJECTED_FOR_NOW |
| `techno-detroit-manga-01-v9.webp` (8 KB) | Resolución insuficiente | REJECTED_FOR_NOW |

---

## Lotes ComfyUI

Todos los directorios en `_comfy_download_techno_manga/` marcados como `RAW_OUTPUT_ONLY`. Requieren selección visual directa por Farid — no se pueden curar sin inspección de cada imagen.

---

## Resumen de estados

| Estado | Cantidad |
|--------|---------|
| APPROVED_FOR_HUMAN_REVIEW | 4 |
| NEEDS_HUMAN_REVIEW | 12+ |
| REJECTED_FOR_NOW | 4 |
| RAW_OUTPUT_ONLY | 16 lotes ComfyUI |

---

*Generado: 2026-04-25 | Agente: Windsurf Cascade | Tarea: D06*
