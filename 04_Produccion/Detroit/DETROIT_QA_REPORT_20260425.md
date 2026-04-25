# DETROIT_QA_REPORT
# D05 — QA Editorial Detroit
# 2026-04-25 | Frecuencia Global

**Tarea Notion:** D05 — `34cf773b-f4a7-8175-8b74-cec9a6121250`  
**Corte:** 2026-04-25  
**Guardrails:** Sin publicación · Sin deploy · Sin n8n · Sin credenciales

---

## 1. Estado del artículo

| Campo | Valor |
|-------|-------|
| Ruta | `website/src/content/articles/techno-detroit-historia-musica-electronica.md` |
| Título | "El techno nació en Detroit, no en Berlín" |
| Slug | `techno-detroit-historia-musica-electronica` |
| Fecha | 2026-04-06 |
| Pilar | `p2` (Bass & Borders) |
| Draft status | `false` (declarado; NO verificado como live) |
| Descripción | "La historia de la música electrónica es también una historia de migración, resistencia y globalización cultural. De las fábricas de Detroit a las pistas de baile del mundo." |
| Imagen principal declarada | `/images/articles/techno-detroit.jpg` |
| Estado imagen | ⚠️ **HERO ROTO** — `techno-detroit.jpg` no existe localmente. Existe `techno-detroit.png` y `techno-detroit.webp`. |
| Tags | `["música electrónica", "Detroit", "techno", "cultura", "migración", "globalización"]` |
| Build dist | `website/dist/contenido/techno-detroit-historia-musica-electronica/` — directorio existente (build previo) |

---

## 2. Argumento central

### Resumen (3–5 líneas)

El techno nació en Detroit en los 80, creado por jóvenes afroamericanos (los "Belleville Three") en el contexto del colapso industrial y la segregación racial. Europa —especialmente Berlín— lo adoptó antes que EE.UU., apropiando un sonido de raíz afroamericana hacia audiencias mayoritariamente blancas. La globalización del EDM diluyó sus raíces políticas y comunitarias. La pregunta central: ¿a quién pertenece el techno?

### ¿El argumento es claro?

**SÍ.** La tesis es nítida desde el título: el techno nació en Detroit, no en Berlín. El artículo desarrolla este argumento cronológicamente y termina conectando con la misión editorial de FG.

### Huecos narrativos detectados

- No profundiza en el rol de las **estaciones de radio WGPR y The Wizard (Jeff Mills)** en la diseminación temprana — referenciadas implícitamente pero no nombradas. Hueco menor; no compromete el argumento.
- La ironía de la apropiación cultural (párrafo 4) es afirmada pero no desarrollada. Menciona "tensiones culturales que persisten hoy" sin ejemplos concretos. Hueco importante para una pieza que aspira a profundidad analítica.
- La sección "La globalización del beat" menciona Sónar, Tomorrowland y Movement sin contexto de por qué estos tres y no otros. Leve falta de criterio editorial explícito.
- No hay referencia a la escena actual de Detroit (ni Moodymann, ni Underground Resistance, ni Carl Craig). El artículo podría actualizarse para el lector contemporáneo.

### Afirmaciones fuertes sin respaldo explícito

- "Detroit no los celebró — al menos no al principio." — Verdadero históricamente, pero no hay fuente inline ni pie de página para este claim específico.
- "generando tensiones culturales que persisten hoy" — afirmación amplia sin cita ni ejemplo.
- "El EDM de Las Vegas y los mainstages de festivales masivos borraron las raíces políticas" — interpretativo y válido editorialmente, pero requiere al menos una fuente de respaldo.

---

## 3. Estructura

| Elemento | Estado | Nota |
|----------|--------|------|
| Introducción / hook | ✅ Sólido | El primer párrafo sitúa tiempo, lugar y contexto en 3 líneas. |
| Desarrollo | ✅ Coherente | 4 secciones temáticas bien diferenciadas. |
| Cierre | ✅ Funcional | Conecta con misión FG. Puede fortalecerse. |
| Ritmo editorial | ✅ Ágil | Párrafos cortos, tono periodístico. Adecuado para web. |
| Tono FG | ✅ Compatible | Analítico pero accesible. Sin jerga excesiva. |
| Compatibilidad P2 Bass & Borders | ✅ Directa | El artículo es un caso de manual para P2: música, identidad, diáspora, fronteras culturales. |

---

## 4. Claims

| Claim | Tipo | Evidencia / Fuente | Estado | Acción |
|-------|------|--------------------|--------|--------|
| El techno nació en Detroit en los años 80 | Histórico | Resident Advisor, Mixmag, BBC "High Tech Soul" (2006) | validado localmente (fuente al pie) | Ninguna |
| Juan Atkins, Derrick May, Kevin Saunderson = "Belleville Three" | Histórico | Resident Advisor, BBC "High Tech Soul" | validado localmente (fuente al pie) | Ninguna |
| Fusionaron funk, Kraftwerk y radio nocturna de Detroit | Histórico/musical | BBC "High Tech Soul" (2006) | validado localmente | Ninguna |
| Sellos Metroplex y Transmat fueron independientes/underground | Histórico | Resident Advisor | validado localmente | Ninguna |
| "No UFOs" (Model 500) y "Strings of Life" como himnos fundacionales | Musical | Resident Advisor, Mixmag | validado localmente | Ninguna |
| "Detroit no los celebró al principio" | Histórico/social | No atribuido inline | requiere fuente externa | Agregar fuente o reformular como interpretación editorial |
| Berlín adoptó el techno tras caída del Muro (1989) | Histórico | Arte Documentary | validado localmente (fuente al pie) | Ninguna |
| Los DJs de Detroit giraban más por Europa que por EE.UU. | Histórico | Requiere fuente específica | requiere fuente externa | Agregar fuente o reformular |
| "tensiones culturales que persisten hoy" | Social/interpretativo | Sin fuente | requiere fuente externa | Agregar ejemplo concreto o reformular como opinión editorial |
| Sónar, Tomorrowland y Movement como ejemplos de globalización | Factual | Verificable públicamente | requiere verificación externa | Aceptable como afirmación general; sin riesgo editorial |
| EDM borró raíces políticas del techno | Interpretativo/cultural | Sin fuente | requiere fuente externa | Reformular como interpretación editorial explícita o agregar fuente |
| Colectivos en Nairobi, São Paulo, Tbilisi, Ciudad de México | Factual/referencial | Sin fuente específica | requiere verificación externa | Aceptable como afirmación general; agregar ejemplos concretos en revisión posterior |

---

## 5. Correcciones necesarias

### Críticas

- **Hero roto:** `image: "/images/articles/techno-detroit.jpg"` apunta a un archivo que no existe localmente. Existe `techno-detroit.png`. **Corregido en este QA** (ver sección 8).

### Importantes

- Agregar al menos una fuente para el claim "Detroit no los celebró al principio".
- Desarrollar o ejemplificar "tensiones culturales que persisten hoy".
- Reformular "el EDM de Las Vegas borraron las raíces políticas" como interpretación editorial explícita (no afirmación de hecho).

### Menores

- Pie de fuentes (línea 45): "Arte Documentary" — falta título completo. Verificar o dejar como referencia general.
- Considerar actualizar con referencia a Underground Resistance o Carl Craig para anclar la escena actual de Detroit.
- El cierre ("Y eso es exactamente lo que hacemos en Frecuencia Global") es efectivo pero muy directo. Opcional: suavizar para lectura externa.

---

## 6. Correcciones aplicadas en este QA

### Corrección 1 — Hero image path

**Tipo:** Crítica  
**Archivo:** `website/src/content/articles/techno-detroit-historia-musica-electronica.md`  
**Campo modificado:** `image`  
**Antes:** `image: "/images/articles/techno-detroit.jpg"`  
**Después:** `image: "/images/articles/techno-detroit.png"`  
**Razón:** `techno-detroit.jpg` no existe localmente. `techno-detroit.png` existe y es el candidato más directo con ese nombre base.  
**Backup creado:** `04_Produccion/Detroit/backups/techno-detroit-historia-musica-electronica_backup_20260425.md`

---

## 7. Decisión QA

```
QA_PASS_WITH_MINOR_EDITS
```

**Razón:**
- Argumento central claro y válido editorialmente.
- Estructura sólida y tono compatible con FG/P2.
- Hero corregido (path roto → `techno-detroit.png`).
- Claims principales con respaldo en fuentes al pie.
- 3 claims importantes requieren fuente o reformulación en revisión posterior (no bloquean el piloto).
- No se marcó QA_PASS porque quedan claims sin fuente externa verificable.
- No se marcó QA_BLOCKED porque la pieza es funcional como piloto y el único bloqueante crítico (hero roto) fue resuelto.

**Condición para QA_PASS completo:** Resolver en revisión editorial posterior los 3 claims marcados como "requiere fuente externa".

---

*Generado: 2026-04-25 | Agente: Windsurf Cascade | Tarea: D05*
