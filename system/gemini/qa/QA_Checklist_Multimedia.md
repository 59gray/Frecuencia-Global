# QA Checklist — Multimedia (Gemini Pipeline)

**Sistema:** Frecuencia Global  
**Código:** QA_Checklist_Multimedia  
**Versión:** 1.0  
**Usado por:** Supervisor Agent, QA/Consistency Agent (AGENT_06)

---

## PROPÓSITO

Checklist de validación cruzada para piezas multimedia producidas a través del pipeline Gemini. Verifica coherencia entre las disciplinas visual, video y audio antes de handoff al sistema de producción.

---

## A. CONSISTENCIA VISUAL

| # | Criterio | Pass | Fail | N/A |
|---|----------|------|------|-----|
| A1 | Paleta cromática respeta los 8 colores del sistema | ☐ | ☐ | ☐ |
| A2 | Color dominante corresponde al pilar correcto | ☐ | ☐ | ☐ |
| A3 | Tipografía usa exclusivamente Bebas Neue / Space Grotesk / JetBrains Mono | ☐ | ☐ | ☐ |
| A4 | Jerarquía tipográfica respeta niveles (Display > Headlines > Body > Data > Micro) | ☐ | ☐ | ☐ |
| A5 | Componentes visuales pertenecen al catálogo (frequency line, signal node, brackets, grid, pill, wordmark, isotipo) | ☐ | ☐ | ☐ |
| A6 | Legibilidad: texto legible en todas las resoluciones target | ☐ | ☐ | ☐ |
| A7 | Composición respeta jerarquía: título → subtítulo → soporte → metadata | ☐ | ☐ | ☐ |
| A8 | Prompt de Nano Banana 2 especifica los parámetros completos (11 campos) | ☐ | ☐ | ☐ |

## B. CONSISTENCIA DE VIDEO

| # | Criterio | Pass | Fail | N/A |
|---|----------|------|------|-----|
| B1 | Formato correcto para plataforma destino (aspect ratio, duración) | ☐ | ☐ | ☐ |
| B2 | Storyboard incluye todos los campos requeridos | ☐ | ☐ | ☐ |
| B3 | Shot list tiene timing y transiciones definidos | ☐ | ☐ | ☐ |
| B4 | Export specs completos (codec, resolución, FPS, bitrate) | ☐ | ☐ | ☐ |
| B5 | Adaptaciones multiplatforma definidas | ☐ | ☐ | ☐ |
| B6 | Hook en primeros 3 segundos | ☐ | ☐ | ☐ |
| B7 | CTA definido y posicionado | ☐ | ☐ | ☐ |
| B8 | Subtítulos/on-screen text especificados | ☐ | ☐ | ☐ |

## C. CONSISTENCIA DE AUDIO

| # | Criterio | Pass | Fail | N/A |
|---|----------|------|------|-----|
| C1 | BPM dentro del rango del pilar | ☐ | ☐ | ☐ |
| C2 | Carácter sonoro alineado con el pilar | ☐ | ☐ | ☐ |
| C3 | Espacio en mid-range para voiceover | ☐ | ☐ | ☐ |
| C4 | Specs de delivery completos (formato, sample rate, loudness) | ☐ | ☐ | ☐ |
| C5 | Variaciones solicitadas (stripped, stems) | ☐ | ☐ | ☐ |
| C6 | No copia material de RAVE LOKOTE u otra fuente | ☐ | ☐ | ☐ |
| C7 | Continuidad con audio previamente aprobado | ☐ | ☐ | ☐ |
| C8 | Loopability verificada (si aplica) | ☐ | ☐ | ☐ |

## D. COHERENCIA CROSS-DISCIPLINA

| # | Criterio | Pass | Fail | N/A |
|---|----------|------|------|-----|
| D1 | Visual y audio pertenecen al mismo pilar | ☐ | ☐ | ☐ |
| D2 | Energía visual coincide con energía sonora | ☐ | ☐ | ☐ |
| D3 | Timing de video sincroniza con audio (beats, transiciones) | ☐ | ☐ | ☐ |
| D4 | Paleta cromática y sonic palette son del mismo pilar | ☐ | ☐ | ☐ |
| D5 | No hay conflictos entre outputs de diferentes subagentes | ☐ | ☐ | ☐ |
| D6 | Pieza se reconoce como Frecuencia Global en <2 segundos | ☐ | ☐ | ☐ |

## E. METADATA Y TRAZABILIDAD

| # | Criterio | Pass | Fail | N/A |
|---|----------|------|------|-----|
| E1 | Pilar identificado | ☐ | ☐ | ☐ |
| E2 | Plataforma destino especificada | ☐ | ☐ | ☐ |
| E3 | Archivos nombrados según naming convention | ☐ | ☐ | ☐ |
| E4 | Outputs guardados en `system/gemini/outputs/[tipo]/` | ☐ | ☐ | ☐ |
| E5 | Referencias utilizadas documentadas | ☐ | ☐ | ☐ |
| E6 | Versión y fecha registrados | ☐ | ☐ | ☐ |

---

## RESULTADO

| Sección | Total Pass | Total Fail | Total N/A | Status |
|---------|-----------|-----------|----------|--------|
| A. Visual | /8 | /8 | /8 | |
| B. Video | /8 | /8 | /8 | |
| C. Audio | /8 | /8 | /8 | |
| D. Cross-disciplina | /6 | /6 | /6 | |
| E. Metadata | /6 | /6 | /6 | |
| **TOTAL** | **/36** | **/36** | **/36** | |

### Criterio de aprobación:
- **0 Fails** → ✅ Aprobado para handoff
- **1-2 Fails** → ⚠️ Correcciones menores, puede proceder con nota
- **3+ Fails** → ❌ Devolver a producción

---

**Revisor:** _______________  
**Fecha:** _______________  
**Decisión:** ☐ Aprobado  ☐ Correcciones menores  ☐ Devolver

---

*Complementa `system/templates/TPL_QA_Checklist.md` para piezas que pasan por el pipeline Gemini.*
