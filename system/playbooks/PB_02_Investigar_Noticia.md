# PLAYBOOK 02 — Investigar una Noticia

**Sistema:** Frecuencia Global  
**Tipo:** Procedimiento operativo  
**Versión:** 1.0  
**Última actualización:** 2026-03-30

---

## CUÁNDO USAR ESTE PLAYBOOK

Cuando hay un evento, noticia o tema que requiere investigación antes de producir contenido. Aplica tanto a investigación estándar (planificada) como a investigación express (breaking news).

---

## MODO A: INVESTIGACIÓN ESTÁNDAR (2-4 horas)

### Paso 1: Recepción del brief (10 min)

1. Recibir brief de Content Strategy con:
   - Tema específico
   - Pilar asignado
   - Formato destino (video, carrusel, thread)
   - Preguntas clave que el contenido debe responder
   - Deadline
2. Evaluar alcance: ¿cuántas preguntas hay que responder?
3. Estimar tiempo necesario

### Paso 2: Búsqueda primaria (30-60 min)

Buscar en orden de confiabilidad:

```
TIER 1 — Documentos primarios (buscar primero)
├── Resoluciones ONU, tratados, comunicados oficiales
├── Datos estadísticos oficiales (Banco Mundial, FMI, OMS)
├── Documentos legislativos, sentencias
└── Registros públicos verificables

TIER 2 — Agencias de noticias (verificar hechos)
├── Reuters, AP, AFP, EFE
└── Buscar mínimo 2 agencias que confirmen el mismo hecho

TIER 3 — Think tanks y academia (profundizar análisis)
├── CFR, IISS, Chatham House, Brookings, Carnegie
├── Papers académicos recientes
└── Foreign Affairs, The Diplomat, War on the Rocks

TIER 4 — Medios de referencia (contextualizar)
├── NYT, BBC, The Guardian, Le Monde, El País
└── Buscar análisis, no solo noticias
```

**Registrar cada fuente encontrada con:**
- URL completa
- Fecha de publicación
- Autor/medio
- Dato específico extraído
- Nivel de confiabilidad (T1-T4)

### Paso 3: Verificación cruzada (30-60 min)

Para cada afirmación clave:
1. ¿La confirman al menos 2 fuentes independientes?
   - SÍ → Marcar como VERIFICADO
   - NO → Marcar como NO VERIFICADO, buscar más fuentes o descartar
2. ¿Hay discrepancias entre fuentes?
   - SÍ → Documentar la discrepancia, priorizar T1 > T2 > T3
   - NO → Registrar como dato sólido
3. ¿Hay datos que solo provienen de una fuente?
   - Marcar como "FUENTE ÚNICA" — usar con precaución en el contenido

### Paso 4: Contextualización (30-45 min)

1. **Antecedentes:** ¿Qué pasó antes? Timeline de eventos relevantes
2. **Actores:** ¿Quiénes son los principales actores? Países, organizaciones, individuos
3. **Relaciones causales:** ¿Qué causó esto? ¿Qué podría causar?
4. **Implicaciones:** ¿Qué significa para la región/mundo/audiencia?
5. **Conexiones:** ¿Se relaciona con otros temas que FG ha cubierto?

### Paso 5: Estructuración de hallazgos (30 min)

Completar [`TPL_Ficha_Investigacion.md`](../templates/TPL_Ficha_Investigacion.md) con:

1. **Resumen ejecutivo** (3-5 frases: qué pasó, por qué importa)
2. **Datos clave** (cifras, fechas, nombres — todos verificados)
3. **Contexto** (antecedentes, actores, mapa de relaciones)
4. **Análisis** (implicaciones, tendencias, escenarios)
5. **Datos de impacto** (para hooks — los más sorprendentes o reveladores)
6. **Fuentes** (tabla completa con URLs, tier, fecha)
7. **Limitaciones** (qué no se pudo verificar, sesgos potenciales)
8. **Ángulo sugerido para FG** (qué hace este tema relevante para la audiencia)

### Paso 6: Evaluación y entrega (10 min)

1. Evaluación de viabilidad:
   - **GO:** Suficiente información verificada para producir contenido creíble
   - **CONDITIONAL GO:** La información es suficiente pero con limitaciones documentadas
   - **NO-GO:** Insuficiente para publicar responsablemente → notificar a Content Strategy
2. Entregar ficha a Scriptwriting Agent via handoff
3. Archivar ficha en repositorio

---

## MODO B: INVESTIGACIÓN EXPRESS — BREAKING NEWS (30-60 min)

### Paso 1: Activación (5 min)
1. Recibir alerta de evento con nivel de urgencia
2. Confirmar que es real (mínimo 2 fuentes T1-T2)
3. Si no se confirma con 2 fuentes → ESPERAR, no proceder

### Paso 2: Investigación rápida (15-25 min)
1. Solo fuentes T1-T2 (documentos oficiales + agencias)
2. Responder solo: ¿Qué? ¿Dónde? ¿Cuándo? ¿Quién?
3. Contexto mínimo: 1-2 antecedentes esenciales
4. 1 dato de impacto para hook

### Paso 3: Entrega express (10 min)
1. Ficha mínima viable:
   - Hecho central (verificado)
   - 3 fuentes
   - Contexto mínimo (2-3 frases)
   - 1 dato de impacto
2. Marcar como "INVESTIGACIÓN PARCIAL"
3. Entregar a Scriptwriting con timeline comprimido

### Paso 4: Ampliación post-publicación (1-2 horas)
1. Completar investigación estándar del tema
2. Verificar que lo publicado sea correcto
3. Si hay errores: preparar corrección inmediata
4. Archivar ficha completa

---

## RED FLAGS — CUÁNDO NO PUBLICAR

| Señal | Acción |
|-------|--------|
| Solo 1 fuente confirma el hecho central | NO PUBLICAR — esperar más confirmaciones |
| Fuente principal es redes sociales sin corroboración | NO PUBLICAR — riesgo de desinformación |
| Datos clave con discrepancias no resueltas | NO PUBLICAR — resolver primero |
| Tema con alto potencial de daño si es incorrecto | Aplicar estándar máximo: 3+ fuentes T1-T2 |
| Fuente tiene historial de desinformación | DESCARTAR fuente, buscar alternativas |

---

## CHECKLIST RÁPIDO

```
□ Brief recibido y comprendido
□ Mínimo 3 fuentes consultadas
□ Fuentes de Tier 1-3 (no solo medios)
□ Datos clave verificados con 2+ fuentes independientes
□ Discrepancias documentadas
□ Contexto incluido (antecedentes, actores)
□ Implicaciones analizadas
□ Limitaciones documentadas
□ Ficha completada en TPL_Ficha_Investigacion.md
□ Evaluación GO/NO-GO emitida
□ Entregado via handoff formal
```

---

## DOCUMENTOS RELACIONADOS

- [`AGENT_03_Research.md`](../agents/AGENT_03_Research.md) — Definición del agente
- [`TPL_Ficha_Investigacion.md`](../templates/TPL_Ficha_Investigacion.md) — Template de ficha
- [`RULE_Source_Quality.md`](../rules/RULE_Source_Quality.md) — Criterios de fuentes
- [`TPL_Brief_Contenido.md`](../templates/TPL_Brief_Contenido.md) — Brief que se recibe
