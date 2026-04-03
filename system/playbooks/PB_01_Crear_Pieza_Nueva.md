# PLAYBOOK 01 — Crear Pieza Nueva desde Cero

**Sistema:** Frecuencia Global  
**Tipo:** Procedimiento operativo  
**Versión:** 1.0  
**Última actualización:** 2026-03-30

---

## CUÁNDO USAR ESTE PLAYBOOK

Cada vez que se produce una pieza de contenido nueva (no derivada de contenido existente). Aplica a: video largo, short/reel, carrusel, post estático, thread, artículo.

---

## FLUJO COMPLETO

```
[1] IDEACIÓN          → Content Strategy Agent
[2] INVESTIGACIÓN     → Research Agent
[3] ESCRITURA         → Scriptwriting Agent
[4] PRODUCCIÓN VISUAL → Design Production Agent
[5] REVISIÓN QA       → QA/Consistency Agent
[6] PUBLICACIÓN       → Project Manager Agent
```

---

## PASO 1: IDEACIÓN (Content Strategy Agent)

**Tiempo estimado:** 15-30 min  
**Output:** Brief de contenido completado

1. Seleccionar tema del backlog o identificar tema reactivo
2. Asignar pilar de contenido:
   - Conflicto/tendencia global → **Geopolitik Drop** (cian)
   - Música × cultura × fronteras → **Bass & Borders** (magenta)
   - Noticia rápida → **Frecuencia Global** (verde ácido)
   - Política pública / decisiones → **Behind the Policy** (azul)
3. Definir formato y plataforma destino
4. Definir ángulo diferenciador (¿qué del tema es FG?)
5. Completar [`TPL_Brief_Contenido.md`](../templates/TPL_Brief_Contenido.md)
6. Enviar brief a Research Agent

**Criterio de avance:** Brief completo con pilar, formato, ángulo y deadline asignados.

---

## PASO 2: INVESTIGACIÓN (Research Agent)

**Tiempo estimado:** 2-4 horas (estándar) / 30-60 min (express)  
**Output:** Ficha de investigación completada

1. Recibir brief de Content Strategy
2. Identificar preguntas clave a responder
3. Investigar en fuentes T1-T5 (ver jerarquía en AGENT_03)
4. Verificar datos con cruce de mínimo 2 fuentes independientes
5. Contextualizar: antecedentes, actores, implicaciones
6. Completar [`TPL_Ficha_Investigacion.md`](../templates/TPL_Ficha_Investigacion.md)
7. Evaluar viabilidad:
   - **GO:** Suficiente información verificada → enviar a Scriptwriting
   - **NO-GO:** Insuficiente → notificar a Content Strategy con alternativa
8. Entregar ficha via handoff

**Criterio de avance:** Ficha completa con 3+ fuentes verificadas, datos cruzados, contexto.

---

## PASO 3: ESCRITURA (Scriptwriting Agent)

**Tiempo estimado:** 1-2 horas  
**Output:** Guión/copy final + brief de diseño

1. Recibir ficha de investigación + brief de contenido
2. Identificar tono según pilar
3. Escribir según formato:
   - **Video largo:** Hook (15s) + Intro + 3 bloques + cierre + CTA
   - **Short/Reel:** Hook (3s) + contexto + 2-3 datos + cierre + CTA
   - **Carrusel:** Cover + 5-8 slides + cierre con CTA
   - **Thread X:** 8-12 tweets con hilo narrativo
4. Generar 3 opciones de hook, seleccionar la más fuerte
5. Escribir título para plataforma (<60 chars para YT)
6. Escribir caption y hashtags
7. Completar [`TPL_Brief_Diseno.md`](../templates/TPL_Brief_Diseno.md) con textos finales
8. Entregar guión + brief de diseño a Design Production

**Criterio de avance:** Textos finales aprobados, brief de diseño completo, hook seleccionado.

---

## PASO 4: PRODUCCIÓN VISUAL (Design Production Agent)

**Tiempo estimado:** 30-90 min  
**Output:** Piezas visuales finales exportadas

1. Recibir brief de diseño con textos finales
2. Abrir template correspondiente en Canva/Figma
3. Seleccionar componentes:
   - Background según pilar y formato
   - Color dominante según pilar
   - Elementos decorativos del catálogo
4. Insertar textos del brief (copiar exacto, sin editar)
5. Componer según grid del sistema
6. Revisión interna rápida:
   - □ Colores hex correctos
   - □ Tipografías correctas
   - □ Safe areas respetadas
   - □ Legible en mobile
7. Exportar en formato y resolución correcta
8. Nombrar archivo: `FG_[PILAR]_[FORMATO]_[TEMA]_[VERSION].ext`
9. Entregar a QA con pieza + link editable + brief original

**Criterio de avance:** Archivos exportados, nombrados correctamente, entregados a QA.

---

## PASO 5: REVISIÓN QA (QA/Consistency Agent)

**Tiempo estimado:** 20-30 min  
**Output:** PASS o FAIL con correcciones

1. Recibir pieza + brief + ficha de investigación
2. Abrir [`TPL_QA_Checklist.md`](../templates/TPL_QA_Checklist.md)
3. Revisión editorial:
   - □ Tono alineado con pilar
   - □ Ortografía y gramática
   - □ Hook efectivo
   - □ CTA presente
4. Revisión visual:
   - □ Colores de la paleta
   - □ Tipografías autorizadas
   - □ Resolución correcta
   - □ Componentes del catálogo
5. Revisión factual:
   - □ Datos cruzados con ficha
   - □ Nombres y fechas correctos
6. Veredicto:
   - **PASS:** Enviar a Project Manager para publicación
   - **FAIL:** Enviar correcciones al agente responsable → volver al paso que corresponda

**Criterio de avance:** Checklist completado, pieza aprobada o correcciones enviadas.

---

## PASO 6: PUBLICACIÓN (Project Manager Agent)

**Tiempo estimado:** 15 min  
**Output:** Contenido publicado en plataforma(s)

1. Recibir pieza aprobada por QA
2. Verificar que todo el paquete esté completo:
   - □ Archivo(s) visual(es) final(es)
   - □ Caption / descripción
   - □ Hashtags
   - □ Título (si YT)
   - □ Thumbnail (si YT)
3. Publicar en plataforma según calendario
4. Verificar que se ve correcto en la plataforma
5. Registrar publicación en tracking semanal
6. Activar repurposing si aplica (derivar shorts, carruseles)

**Criterio de avance:** Pieza viva en plataforma, registrada en tracking.

---

## DIAGRAMA RESUMEN

```
  IDEA → BRIEF → RESEARCH → FICHA → GUIÓN → BRIEF DISEÑO
                                                    ↓
              PUBLICACIÓN ← QA PASS ← PIEZA VISUAL FINAL
                              ↑ ↓
                          QA FAIL → CORRECCIONES → RE-ENTREGA
```

---

## TIEMPOS TOTALES ESTIMADOS

| Formato | Research | Script | Diseño | QA | Total |
|---------|----------|--------|--------|----|-------|
| Video largo | 3-4h | 1.5-2h | 1h | 30min | 6-7.5h |
| Short/Reel | 30min | 30min | 30min | 15min | 1.5-2h |
| Carrusel | 1-2h | 45min | 45min | 20min | 3-4h |
| Thread X | 1h | 30min | — | 15min | 1.5-2h |

---

## DOCUMENTOS RELACIONADOS

- [`TPL_Brief_Contenido.md`](../templates/TPL_Brief_Contenido.md)
- [`TPL_Ficha_Investigacion.md`](../templates/TPL_Ficha_Investigacion.md)
- [`TPL_Brief_Diseno.md`](../templates/TPL_Brief_Diseno.md)
- [`TPL_QA_Checklist.md`](../templates/TPL_QA_Checklist.md)
- [`TPL_Handoff_Agentes.md`](../templates/TPL_Handoff_Agentes.md)
