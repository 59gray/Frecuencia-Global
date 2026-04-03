# REGLA — Source Quality

**Sistema:** Frecuencia Global  
**Código:** RULE_Source_Quality  
**Severidad:** BLOQUEANTE — Contenido sin fuentes verificables no se publica  
**Aplica a:** Research Agent, QA/Consistency Agent, Scriptwriting Agent

---

## PRINCIPIO

Frecuencia Global construye credibilidad a través de rigor. Toda afirmación factual en contenido publicado debe ser trazable a una fuente verificable. Sin fuentes, no hay publicación.

---

## JERARQUÍA DE FUENTES (TIERS)

| Tier | Tipo | Ejemplos | Confiabilidad | Uso permitido |
|------|------|----------|---------------|---------------|
| **T1** | Documentos primarios | Tratados, resoluciones ONU, leyes, datos oficiales (BM, FMI, OMS), registros corporativos | **Máxima** | Citar directamente. Fuente preferida |
| **T2** | Agencias de noticias | Reuters, AP, AFP, EFE | **Alta** | Base factual. Verbatim confiable |
| **T3** | Think tanks / Academia | CFR, IISS, Chatham House, Brookings, Carnegie, Foreign Affairs, papers peer-reviewed | **Alta** | Análisis y contexto. Citar autoría |
| **T4** | Medios de referencia | NYT, BBC, The Guardian, Le Monde, El País, The Economist, FT | **Media-alta** | Reportajes y análisis. Verificar con T1/T2 |
| **T5** | Medios especializados | The Diplomat, War on the Rocks, Lawfare, Rest of World, Bellingcat | **Media** | Ángulos y contexto específico |
| **T6** | Redes sociales / OSINT | X, Telegram, imágenes satélite, geolocalización | **Baja** | Solo con verificación T1-T4 |

---

## REGLAS DE SOURCING

### Obligatorias (BLOQUEANTES)

1. **Mínimo 3 fuentes** por pieza de contenido
2. **Mínimo 2 fuentes independientes** para cada afirmación clave
3. **Mínimo 1 fuente T1-T3** por pieza (no solo medios)
4. **Registro completo** de cada fuente: URL, fecha, autor/medio, tier, dato extraído
5. **Transparencia** sobre limitaciones ("no se pudo verificar X")

### Recomendadas

6. Diversidad geográfica de fuentes cuando el tema lo permita
7. Incluir perspectivas del Sur Global cuando sea relevante
8. Buscar fuentes en idioma original del evento (traducir si necesario)
9. Verificar que fuentes citadas sigan activas/accesibles al momento de publicar

---

## FUENTES NO ACEPTABLES

| Tipo | Razón |
|------|-------|
| Wikipedia como fuente final | Es agregador, no fuente primaria. Aceptable como punto de partida |
| Blogs sin autoría identificable | Sin accountability |
| Medios con historial documentado de desinformación | Riesgo reputacional |
| Fuentes anónimas sin corroboración | No verificable |
| Contenido generado por IA sin verificación | No confiable |
| Artículos sin fecha | No se puede evaluar recencia |
| "Se dice que..." / "Según fuentes" sin especificar | No verificable |

---

## RECENCIA

| Tipo de dato | Recencia máxima aceptable |
|-------------|---------------------------|
| Noticias / eventos | <7 días para breaking, <30 días para análisis |
| Estadísticas | <1 año (preferir datos del año actual) |
| Contexto histórico | Sin límite (pero verificar con fuentes actualizadas) |
| Cargos / títulos de personas | Verificar que sea actual al momento de publicar |
| Tratados / leyes | Verificar vigencia actual |

---

## PROTOCOLO DE VERIFICACIÓN

```
PARA CADA DATO CLAVE:

1. ¿De dónde viene? → Registrar fuente
2. ¿Es fuente primaria o secundaria? → Asignar tier
3. ¿Hay al menos 1 fuente más que confirme? → Verificar
   → SÍ: VERIFICADO
   → NO: FUENTE ÚNICA (marcar, usar con precaución)
4. ¿Hay discrepancias? → Documentar, priorizar tier mayor
5. ¿La fuente sigue accesible? → Verificar URL
```

---

## CÓMO CITAR EN CONTENIDO FG

### En video (voz)
```
"Según [fuente], ..."
"De acuerdo con datos de [organización], ..."
"[Medio] reporta que ..."
```

### En carrusel / post (texto visual)
```
Fuente: [organización/medio] — en texto pequeño (JetBrains Mono)
```

### En descripción de YouTube
```
📚 FUENTES:
• [nombre] — [URL]
• [nombre] — [URL]
• [nombre] — [URL]
```

### En thread de X
```
Último tweet: "Fuentes: [lista con links]"
```

---

## MANEJO DE INCERTIDUMBRE

| Situación | Cómo comunicar |
|-----------|----------------|
| Dato verificado con múltiples fuentes | Decirlo con confianza |
| Dato de fuente única pero confiable (T1-T2) | "Según [fuente]..." |
| Dato no verificable independientemente | "Reportes indican que..." + nota de limitación |
| Cifras con rango / estimación | Dar el rango, no un número falso de precisión |
| Información en desarrollo | "Al momento de esta publicación..." |
| No hay datos confiables | NO publicar. Decir "no hay información verificable" |

---

*Esta regla protege la credibilidad de Frecuencia Global. Un solo dato incorrecto publicado daña más que 10 piezas correctas construyen.*
