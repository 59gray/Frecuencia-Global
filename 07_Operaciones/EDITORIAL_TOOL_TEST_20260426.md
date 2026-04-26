# Editorial Tool Test — FG Detroit Pipeline

Fecha: 2026-04-26
Artículo de prueba: techno-detroit-historia-musica-electronica
Ejecutor: Cascade (pipeline editorial FG)

---

## Inventario de herramientas disponibles

### Búsqueda web
- **search_web** (Windsurf nativa) — disponible, sin quota confirmada, resultados con snippets y URLs
- **read_url_content** — disponible, lectura profunda de URLs específicas, requiere aprobación por request
- **view_content_chunk** — disponible, lectura por segmentos de documentos ya cargados

### Lectura de fuentes
- **read_file** — disponible, lectura de archivos locales (artículo, markdown, json)
- **read_url_content + view_content_chunk** — pipeline funcional para lectura de URLs externas

### Extracción de citas
- Sin herramienta dedicada de extracción automática. Proceso manual: leer chunk → parafrasear y registrar cita en EVIDENCE_NOTES.
- Funciona correctamente para fuentes accesibles. No funciona para PDFs tras paywall.

### Guardar evidencia
- **write_to_file** — disponible, crea documentos locales en el workspace
- **edit / multi_edit** — disponible para actualizar documentos existentes
- Evidencia guardada en: SOURCE_LEDGER.md, CLAIM_LEDGER.md, EVIDENCE_NOTES.md, ARTICLE_FACT_CHECK.md

### Armar claim ledger
- Proceso manual estructurado: verificación fuente por fuente, comparación de afirmaciones, aplicación de regla dura (≥2 fuentes + ≥1 primaria)
- No hay herramienta automatizada de claim-matching. Cascade actúa como agente de verificación.

### Limitaciones actuales
- ResearchGate: acceso bloqueado (Forbidden). Papers académicos detrás de paywall no son accesibles.
- Algunos sitios bloquean acceso programático (posible: JSTOR, Springer, Nature)
- No hay acceso a bases de datos académicas suscritas (Google Scholar HTML sí, pero PDF full-text no)
- La búsqueda `search_web` devuelve snippets pero no texto completo — requiere `read_url_content` para profundizar

### Herramientas no disponibles o bloqueadas
- ComfyUI — no aplica en esta fase
- Pillow — no aplica en esta fase
- Wikipedia — regla FG (no usar)
- ResearchGate full-text — bloqueado por Forbidden en esta sesión

---

## Resultado de la prueba

### Rapidez para encontrar fuentes
**Buena.** Con 3 búsquedas `search_web` se identificaron 7 fuentes candidatas. De las 7, 6 fueron utilizables. La búsqueda priorizada (DSC → RBMA → académico) funcionó correctamente.

### Calidad de fuentes encontradas
**Alta.** Se obtuvieron:
- 2 entrevistas primarias directas a fundadores (Juan Atkins y Derrick May, RBMA)
- 1 archivo institucional primario (Detroit Sound Conservancy)
- 1 artículo académico revisado por pares (Routes Journal, University of Sussex)
- 1 recurso institucional cultural de primer nivel (Carnegie Hall)
- 1 entrevista adicional en medio especializado (Afropop Worldwide)

### Capacidad de verificar claims
**Alta para claims históricos y culturales.** El pipeline fue capaz de:
- Verificar 6/6 claims planteados
- Aplicar la regla dura sin excepciones
- Identificar un dato no verificado (Markowitz) que no habría sido detectado sin proceso explícito

### Claridad de evidencia
**Alta.** El SOURCE_LEDGER documenta 7 fuentes con nivel de confianza, qué aportan y cómo se conectan con cada claim. Las citas están parafraseadas con referencia a fuente — no hay afirmaciones sin soporte.

### Utilidad para briefs visuales
**Alta.** La investigación modificó 4 elementos del ARTICLE_VISUAL_BRIEF:
1. Añadió el ambiente Club Heaven (cultura Black LGBTQ nocturna, neon subterráneo)
2. Precisó que la radio nocturna (Electrifying Mojo) es elemento visual válido
3. Confirmó el Afrofuturismo como marco — señal de futuro, no ruina pasiva
4. Prohibió explícitamente representaciones de "ciudad en colapso" como causa del techno

### Riesgos detectados
1. Paywall académico limita acceso a papers completos (ResearchGate, JSTOR)
2. El proceso de verificación es manual — depende de que el agente aplique la regla dura correctamente
3. No hay validación automática cruzada entre fuentes — la coherencia debe verificarse manualmente
4. Figuras secundarias sin nombre completo o fuente trazable (caso Markowitz) pueden pasar sin detección si no hay proceso explícito

### Herramientas que funcionaron
- search_web: discovery inicial eficiente
- read_url_content: lectura profunda funcional en RBMA, DSC, Routes Journal, Carnegie Hall
- view_content_chunk: esencial para navegar documentos largos (entrevista Derrick May: 24 chunks)
- write_to_file / edit: pipeline documental estable

### Herramientas que fallaron o tuvieron limitaciones
- ResearchGate: acceso bloqueado (Forbidden)
- Sin herramienta de extracción automática de citas — proceso completamente manual
- Sin detección automática de inconsistencias entre fuentes

### Mejoras al flujo editorial

1. **Añadir verificación de identidad** para toda persona citada como "voz del debate" — no solo fuentes históricas
2. **Crear una lista de fuentes confiables por frecuencia** — para Bass & Borders: RBMA, DSC, Carnegie Hall, Routes Journal son fuentes estándar. Documentar en operaciones.
3. **Pie de fuentes del artículo debe ser auditado antes de publicar** — actualmente el artículo lista fuentes que no aparecen en el cuerpo del texto
4. **Establecer criterio para fuentes de "continuidad contemporánea"** — UMA, eventos actuales — con estándar de verificación ligeramente menos estricto que para claims históricos, pero con fuente directa obligatoria
5. **Formalizar un paso de "verificación de personas" en el pipeline** — cualquier nombre propio citado como fuente debe tener: quién es, qué dijo, en qué medio/contexto

---

## Veredicto del pipeline

El pipeline editorial ejecutado en Detroit es **válido y replicable**.

Las 9 fases pueden aplicarse a cualquier artículo de Bass & Borders o Geopolitik Drop con los mismos criterios. El tiempo estimado por artículo: 1 sesión de investigación completa (discovery + lectura profunda) + 1 sesión de documentación (SOURCE_LEDGER + CLAIM_LEDGER + EVIDENCE_NOTES + FACT_CHECK + BRIEF_VERIFIED).

**Condición para replicar:** el artículo debe tener ARTICLE_VISUAL_BRIEF previo antes de comenzar la investigación.

---

## Estado final

PIPELINE BASE FG — VALIDADO EN DETROIT
Listo para replicar en: Geopolitik Drop, Frecuencia Global, Behind the Policy
