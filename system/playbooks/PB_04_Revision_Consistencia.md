# PLAYBOOK 04 — Revisión de Consistencia Visual y Editorial

**Sistema:** Frecuencia Global  
**Tipo:** Procedimiento operativo  
**Versión:** 1.0  
**Última actualización:** 2026-03-30

---

## CUÁNDO USAR ESTE PLAYBOOK

- Antes de publicar cualquier pieza de contenido
- En auditorías periódicas de piezas ya publicadas
- Cuando se detecta una posible inconsistencia

---

## REVISIÓN PRE-PUBLICACIÓN (Obligatoria)

### Fase 1: Revisión editorial (10-15 min)

| # | Checkpoint | Verificar | Resultado |
|---|-----------|-----------|-----------|
| E1 | **Tono** | ¿Es consistente con el pilar asignado? | □ PASS □ FAIL |
| E2 | **Hook** | ¿Los primeros 3 seg / primera línea generan engagement? | □ PASS □ WARN |
| E3 | **Claridad** | ¿Se entiende sin contexto previo? | □ PASS □ FAIL |
| E4 | **Ortografía** | ¿Cero errores ortográficos y gramaticales? | □ PASS □ FAIL |
| E5 | **CTA** | ¿Hay llamada a la acción clara y específica? | □ PASS □ FAIL |
| E6 | **Longitud** | ¿Dentro del rango del formato? | □ PASS □ WARN |
| E7 | **Consistencia** | ¿Misma voz y terminología que piezas anteriores del pilar? | □ PASS □ WARN |

**Si hay algún FAIL editorial → RECHAZAR. Especificar corrección exacta.**

### Fase 2: Revisión visual (10-15 min)

| # | Checkpoint | Verificar | Resultado |
|---|-----------|-----------|-----------|
| V1 | **Colores** | ¿Solo colores del sistema? Verificar hex | □ PASS □ FAIL |
| V2 | **Tipografía** | ¿Solo Bebas Neue / Space Grotesk / JetBrains Mono? | □ PASS □ FAIL |
| V3 | **Resolución** | ¿Dimensiones correctas para la plataforma? | □ PASS □ FAIL |
| V4 | **Safe areas** | ¿Texto dentro de zonas seguras? | □ PASS □ FAIL |
| V5 | **Componentes** | ¿Elementos del catálogo del Brand System? | □ PASS □ FAIL |
| V6 | **Mobile** | ¿Legible al 50% zoom? | □ PASS □ WARN |
| V7 | **Pill de pilar** | ¿Color correcto del pilar? | □ PASS □ FAIL |
| V8 | **Logo/Wordmark** | ¿Presente y en variante correcta? | □ PASS □ WARN |

**Referencia rápida de colores:**
```
#0A0A0F  Negro profundo (base)
#00E5FF  Cian eléctrico (Geopolitik Drop)
#FF00E5  Magenta neón (Bass & Borders)
#B8FF00  Verde ácido (Frecuencia Global)
#4A6BFF  Azul profundo (Behind the Policy)
#1A1A2E  Gris pizarra (superficies)
#FFFFFF  Blanco (texto primario)
#A0A0B8  Gris claro (texto secundario)
```

**Si hay algún FAIL visual → RECHAZAR. Especificar componente y corrección exacta.**

### Fase 3: Revisión factual (10 min)

| # | Checkpoint | Verificar | Resultado |
|---|-----------|-----------|-----------|
| F1 | **Datos** | ¿Números/cifras coinciden con ficha de investigación? | □ PASS □ FAIL |
| F2 | **Nombres** | ¿Escritura correcta de nombres propios? | □ PASS □ FAIL |
| F3 | **Fechas** | ¿Fechas correctas y actuales? | □ PASS □ FAIL |
| F4 | **Cargos** | ¿Títulos/cargos actuales al momento de publicación? | □ PASS □ FAIL |
| F5 | **Fuentes** | ¿Fuentes citadas existen y son accesibles? | □ PASS □ FAIL |

**Si hay algún FAIL factual → RECHAZAR. NUNCA publicar con datos incorrectos.**

### Fase 4: Revisión de archivo (5 min)

| # | Checkpoint | Verificar | Resultado |
|---|-----------|-----------|-----------|
| A1 | **Naming** | ¿Sigue `FG_[PILAR]_[FORMATO]_[TEMA]_[VERSION]`? | □ PASS □ FAIL |
| A2 | **Formato** | ¿PNG/MP4/SVG correcto? | □ PASS □ FAIL |
| A3 | **Peso** | ¿PNG <5MB, MP4 <50MB? | □ PASS □ WARN |

---

## VEREDICTO FINAL

| Resultado | Condición | Acción |
|-----------|-----------|--------|
| **APROBADO** | 0 FAIL + 0-3 WARN | Publicar. Registrar advertencias para mejora |
| **APROBADO CON NOTAS** | 0 FAIL + 4+ WARN | Publicar. Crear action item para mejorar |
| **RECHAZADO** | 1+ FAIL | No publicar. Enviar correcciones al agente responsable |

---

## AUDITORÍA PERIÓDICA (Mensual)

Para piezas ya publicadas:

1. Seleccionar 10-15 piezas publicadas en el último mes
2. Aplicar la misma revisión visual + editorial (no re-verificar hechos)
3. Documentar hallazgos en tabla:

```
| Pieza | Fecha | Plataforma | Hallazgos | Severidad |
|-------|-------|------------|-----------|-----------|
| ...   | ...   | ...        | ...       | ...       |
```

4. Identificar patrones de error recurrente
5. Si un error aparece 3+ veces: crear action item para corregir proceso
6. Entregar reporte a Brand System Agent + Project Manager

---

## REGISTRO DE ERRORES RECURRENTES

Mantener tabla acumulativa:

```
| Error | Frecuencia | Agente responsable | Acción correctiva | Estado |
|-------|------------|--------------------|--------------------|--------|
| ...   | ...        | ...                | ...                | ...    |
```

Cuando un error alcanza 3 ocurrencias → escalar a Project Manager para corrección sistémica.

---

## DOCUMENTOS RELACIONADOS

- [`AGENT_06_QA_Consistency.md`](../agents/AGENT_06_QA_Consistency.md) — Definición del agente
- [`TPL_QA_Checklist.md`](../templates/TPL_QA_Checklist.md) — Checklist formal
- [`RULE_Visual_Consistency.md`](../rules/RULE_Visual_Consistency.md) — Reglas visuales
- [`RULE_Tone_of_Voice.md`](../rules/RULE_Tone_of_Voice.md) — Reglas de tono
- [`RULE_Naming_Conventions.md`](../rules/RULE_Naming_Conventions.md) — Naming
