# Checklist QA Final — Thumbnail EP_001 (Pre-Aprobación)

**Pieza:** EP_001 — Thumbnail YouTube  
**Archivo objetivo:** `FG_GD_THB_Cables-Poder_EP001_v1_20260405_0.png`  
**Herramienta:** Canva/Figma (proceso manual)  
**Fecha:** 2026-04-05  

---

## INSTRUCCIONES DE USO

1. Marcar cada ítem con `[ ]` pendiente, `[/]` en revisión, `[x]` completado
2. Todos los ítems bloqueantes (🔴) deben estar `[x]` para aprobar
3. Ítems de mejora (🟡) son recomendados pero no bloquean
4. Cualquier `[ ]` en bloqueantes = NO APROBADO

---

## SECCIÓN A: DIMENSIONES Y FORMATO 🔴 BLOQUEANTE

| # | Criterio | Status | Notas |
|---|----------|--------|-------|
| A1 | Archivo es PNG | `[ ]` |  |
| A2 | Resolución exacta 1280×720 px | `[ ]` | Verificar propiedades imagen |
| A3 | Tamaño archivo < 2MB | `[ ]` | Verificar en propiedades |
| A4 | Color space sRGB | `[ ]` |  |
| A5 | Sin transparencia (fondo sólido) | `[ ]` |  |

**Pass A requerido:** 5/5 `[x]`

---

## SECCIÓN B: IDENTIDAD DE MARCA 🔴 BLOQUEANTE

| # | Criterio | Status | Notas |
|---|----------|--------|-------|
| B1 | Fondo principal oscuro (#0A0A0F o similar) | `[ ]` | Verificar con color picker |
| B2 | Paleta FG presente: cian #00E5FF visible | `[ ]` |  |
| B3 | Máximo 3 colores de acento principales | `[ ]` |  |
| B4 | Wordmark "FRECUENCIA GLOBAL" visible | `[ ]` | Esquina superior derecha |
| B5 | Línea de frecuencia presente (elemento gráfico) | `[ ]` | Debajo del título |

**Pass B requerido:** 5/5 `[x]`

---

## SECCIÓN C: TIPOGRAFÍA 🔴 BLOQUEANTE

| # | Criterio | Status | Notas |
|---|----------|--------|-------|
| C1 | Título "CABLES DE PODER" presente | `[ ]` |  |
| C2 | Título en Bebas Neue (o equivalente sans-serif bold) | `[ ]` |  |
| C3 | Título en MAYÚSCULAS | `[ ]` |  |
| C4 | Título color blanco #FFFFFF | `[ ]` |  |
| C5 | Título con sombra/drop shadow para contraste | `[ ]` |  |
| C6 | Wordmark "FRECUENCIA GLOBAL" en Bebas Neue | `[ ]` |  |
| C7 | "EP 001" en fuente mono o técnica | `[ ]` | JetBrains Mono o similar |
| C8 | Contraste título sobre fondo ≥ 4.5:1 | `[ ]` | Verificar con herramienta WCAG |
| C9 | Texto legible a 200px de ancho (preview) | `[ ]` | Reducir y verificar |

**Pass C requerido:** 9/9 `[x]`

---

## SECCIÓN D: LAYOUT Y COMPOSICIÓN 🔴 BLOQUEANTE

| # | Criterio | Status | Notas |
|---|----------|--------|-------|
| D1 | Título en tercio izquierdo | `[ ]` | No centrado |
| D2 | Título dentro de safe zone (márgenes suficientes) | `[ ]` | 100px+ de bordes |
| D3 | Wordmark esquina superior derecha | `[ ]` | No sobre el título |
| D4 | Elemento visual (cables) no obstruye título | `[ ]` |  |
| D5 | "EP 001" esquina inferior izquierda | `[ ]` |  |
| D6 | Sin elementos críticos en bordes externos | `[ ]` | Safe zone 1546×423 |

**Pass D requerido:** 6/6 `[x]`

---

## SECCIÓN E: EFECTOS VISUALES 🟡 MEJORA

| # | Criterio | Status | Notas |
|---|----------|--------|-------|
| E1 | Glow en acentos sutil (no excesivo) | `[ ]` | Opcional |
| E2 | Sin bordes redondeados corporativos | `[ ]` |  |
| E3 | Efectos consistentes con estilo FG | `[ ]` | Cian/magenta glow |
| E4 | Grid de fondo sutil si aplica | `[ ]` | ~4% opacidad |

**Pass E:** 0/4 requerido (mejora)

---

## SECCIÓN F: NAMING Y ARCHIVO 🔴 BLOQUEANTE

| # | Criterio | Status | Notas |
|---|----------|--------|-------|
| F1 | Nombre exacto: `FG_GD_THB_Cables-Poder_EP001_v1_20260405_0.png` | `[ ]` |  |
| F2 | Sin espacios en nombre (solo guiones) | `[ ]` |  |
| F3 | Versión correcta: v1_20260405_0 | `[ ]` |  |

**Pass F requerido:** 3/3 `[x]`

---

## SECCIÓN G: COMPARACIÓN CON BRIEF ORIGINAL 🔴 BLOQUEANTE

| # | Criterio | Status | Notas |
|---|----------|--------|-------|
| G1 | Concepto "Cables de poder" representado | `[ ]` | Hook visual presente |
| G2 | Ángulo misterio + poder corporativo + vulnerabilidad | `[ ]` |  |
| G3 | No usa fotografía real de cables (estilizado) | `[ ]` |  |
| G4 | Máximo 3 palabras en título principal | `[ ]` | "CABLES DE PODER" = 3 |

**Pass G requerido:** 4/4 `[x]`

---

## RESUMEN DE APROBACIÓN

| Sección | Bloqueantes | Completados | Status |
|---------|-------------|-------------|--------|
| A — Dimensiones | 5 | __/5 | _______ |
| B — Identidad | 5 | __/5 | _______ |
| C — Tipografía | 9 | __/9 | _______ |
| D — Layout | 6 | __/6 | _______ |  
| E — Efectos | 0 | __/4 | (mejora) |
| F — Naming | 3 | __/3 | _______ |
| G — Brief | 4 | __/4 | _______ |
| **TOTAL** | **32** | **__/32** | **______** |

---

## CRITERIO DE APROBACIÓN FINAL

### ✅ APROBADO PARA FINAL

**Condición:** Todos los ítems bloqueantes (A, B, C, D, F, G) deben estar `[x]`

**Si PASS:**
1. Mover archivo a: `06_Assets/production/P1_001/final/`
2. Copia a: `06_Assets/latest_stable/thumbnails/`
3. Marcar en: `04_Produccion/EP_001/EP_001_Thumbnail_Brief.md` como completado
4. Listo para upload test EP_001

---

### ❌ REQUIERE ITERACIÓN

**Si algún bloqueante está `[ ]`:**
1. Documentar qué falló en sección "Notas de Rechazo"
2. Corregir en Canva/Figma
3. Re-exportar
4. Re-ejecutar este checklist

---

## NOTAS DE RECHAZO (si aplica)

<!-- Si se rechaza, documentar aquí el motivo específico -->

Rechazado porque:
1. 
2. 
3. 

Correcciones requeridas:
- 
- 

---

## SIGN-OFF

| Rol | Nombre | Fecha | Firma/Initials |
|-----|--------|-------|----------------|
| Diseño/Asset Ops | | | |
| QA Visual | | | |
| Aprobación Final | | | |

---

*Checklist QA Final — FG-ASSET-OPS-EP001-THUMB-FINAL*
