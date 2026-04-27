# Detroit Canon Pack — Editorial + Visual (FG)

**Código:** D39 — Detroit Canon Pack  
**Fecha:** 2026-04-27  
**Estado:** canon interno; **no publicar**, **no Buffer**, **no deploy**, **no APIs**, **no Notion**, **sin nuevas imágenes generadas en esta tarea**  
**Pieza:** `techno-detroit-historia-musica-electronica` — P2 Bass & Borders  
**Base revisada:** artículo actual (`website/src/content/articles/…`), `EDITORIAL_BRIEF_VERIFIED.md`, `ARTICLE_VISUAL_BRIEF.md`, `CLAIM_LEDGER.md`, `SOURCE_LEDGER.md`, `ASSETS_MANIFEST.md`, `ASSET_PROMPTS.md`, dossier `bass-borders-detroit-berghain` (`SERENA_VISUAL_EXTRACTION.md`, `COMFYUI_DOSSIER_PROMPT.md`), `07_Operaciones/D37_BUFFER_PACKAGE_DETROIT_20260504.md`, pilares (`system/SISTEMA_MAESTRO.md`, `01_Estrategia/FG_Blueprint_Maestro.md`), QA `D05`, `D10`, integración `SERENA_COMFYUI_INTEGRATION_REPORT_20260426.md`

---

## 1. Diagnóstico editorial — qué funciona

| Dimensión | Qué funciona |
|-------------|----------------|
| **Tesis** | Contraste funcional **matriz (Detroit) vs visibilidad/canon (Berlín)** sin convertir el texto en “batalla de ciudades”; alinea con `EDITORIAL_BRIEF_VERIFIED` y claim **C06**. |
| **Tono P2** | Exploratorio y cultural (Blueprint: Bass & Borders *explorador, cultural, narrativo*): mezcla análisis con escena viva (Heaven, UMA, embed). |
| **Marco FG** | “Geopolítica del relato” (quién narra, qué se exporta) coherente con posicionamiento *análisis internacional con pulso electrónico* sin ser columnismo genérico. |
| **Voz primaria** | Embed de Kevin Saunderson ancla **legitimidad desde la escena**; cumple la regla de no quedarse solo en fuentes europeas del micrófono. |
| **Profundidad sin ensayo largo** | Callouts (`Club Heaven` / DSC, `UMA`) materializan **memoria institucional y continuidad pedagógica** — diferenciador vs post de blog turístico. |
| **Claims** | El cuerpo evita varios **PROHIBIDO** del brief (no acusa a Berlín de “robar”, no reduce a trío sin contexto en las secciones Heaven/UMA); el **footnote** transparenta límites (“afirmaciones genealógicas amplias… orientación editorial”). |
| **Estructura** | Arco claro: imaginario global → matriz Detroit → Berlín como sinónimo → memoria activa → futuro — lector puede seguir sin perder el hilo. |

---

## 2. Diagnóstico visual — qué funciona

| Dimensión | Qué funciona |
|-------------|----------------|
| **Paleta FG** | Base oscura + acentos cyan/magenta en hero y piezas alineados con `RULE_Visual_Consistency` / brand kit; contraste “industrial alto” del brief. |
| **Tesis visual** | Brief verificado refuerza **ciudad-fábrica negra, señal, futuro activo, no ruina turística**; assets curados siguen esa línea más que stock EDM. |
| **Manga inline** | Paneles **Welcome to Detroit** y espacio subterráneo densifican narrativa (genealogía, custodia de memoria) sin caras identificables de terceros. |
| **OG / social** | D37 y `ASSETS_MANIFEST` documentan **OG v02** derivado del panel manga; estrategia link post vs media post definida sin ejecutar Buffer. |
| **Dossier Bass & Borders** | `SERENA_VISUAL_EXTRACTION.md` + `COMFYUI_DOSSIER_PROMPT.md` + asset dossier dan **continuidad semántica** P2 (Detroit/Berghain como funciones, no postal). |
| **Coherencia web** | QA D10 alinea home destacada con `cardImage`; rutas `FG_DETROIT_P2_*_CANONICAL` operativas en preview local según cierre QA. |

---

## 3. Qué todavía se siente dummy o genérico

| Área | Hallazgo |
|------|-----------|
| **Editorial — densidad vs brief** | `EDITORIAL_BRIEF_VERIFIED` describe ecología amplia (Mojo, Collier, Hale, Kraftwerk-vía-Mojo, Chicago-May); el artículo publicado es **deliberadamente corto** y no despliega todo el inventario verificable → riesgo de lectura “ensayo ligero” frente al ledger acumulado. |
| **Editorial — pie de fuentes** | Bloque final admite claims amplios como orientación sin URL en cuerpo → bien éticamente, pero **suena a provisional** si FG aspira a piezas “referencia”. |
| **Editorial — trackers** | D05: pieza **no homologada** en matrices/pipeline → sensación operativa “dummy” aunque el HTML exista. |
| **Visual — manifest obsoleto** | `ASSETS_MANIFEST.md` aún lista rutas antiguas inexistentes y alerta 404; el frontmatter real usa `FG_DETROIT_*` — **documentación desincronizada** genera ruido interno. |
| **Visual — brief tabla assets** | `ARTICLE_VISUAL_BRIEF.md` marca featured/thumbnail “PENDIENTE” mientras el sitio ya usa convención `FG_DETROIT_P2_*` → mismatch canon/realidad. |
| **Visual — primera inline** | Copy/QA D10: escena interior vs metáforas “ciudad abierta”; caption bien encaminado pero la imagen puede leerse **genérica architectural** si no se mantiene el puente textual. |
| **Genérico sector** | Cualquier prompt sin **atoms Serena** (señal, umbral, textura, prohibición ruina/festival) tiende a **skyline cyber genérico** — mitigado en dossier, no garantizado en futuras piezas si se improvisa. |

---

## 4. Reglas editoriales para futuros artículos FG (derivadas de Detroit)

### 4.1 Estructura

1. **Gancho contextual** (imaginario dominante vs hecho territorial o material).  
2. **Tesis en una frase** temprana (funciones distintas, no rivales).  
3. **Núcleo histórico/material** con ancla concreta (lugar, circuito, institución o voz primaria).  
4. **Contrapeso honesto** (Berlín en Detroit: peso real sin caricatura).  
5. **Memoria y poder** (archivo, comunidad, quién custodia el relato).  
6. **Presente/futuro** (escuela, festival, política cultural).  
7. **Cierre prospectivo** corto + **pie de fuentes** explícito (embed + enlaces en cuerpo o declaración de límites).

### 4.2 Tono

- **P2:** explorador, cultural; puede ser intimista sin perder densidad.  
- Evitar **competencia territorial** y **causalidad mecánica** (declive → género).  
- Preferir **“función en el sistema”** (matriz, nodo, archivo, mercado) frente a ranking de ciudades.  
- Primera persona de escena **solo** con contexto y enlace/embed verificable.

### 4.3 Longitud

- **Web Bass & Borders:** 900–1800 palabras como riñón editorial por defecto; Detroit actual está **por debajo** del techo útil para “pieza referencia”.  
- Si el brief verificado supera al texto (>6 claims nucleares), decidir: **acortar brief** o **expandir pieza** — no dejar divergencia silenciosa.

### 4.4 Fuentes

- Mantener **SOURCE_LEDGER + CLAIM_LEDGER** por pieza sensible.  
- Priorizar: **primarias** (RBMA, entrevistas), **institucionales** (DSC, Carnegie), **académicas revisadas** (Routes Journal).  
- No citar personas como “voces del debate” sin fuente (**PROHIBIDO-02** legacy).  
- Pie de página: listing mínimo de enlaces usados en cuerpo **o** disclaimer explícito (como Detroit).

### 4.5 Claims

- Regla ledger: ≥2 independientes + ≥1 primaria/institucional para claims fuertes.  
- **Prohibidos** del brief Detroit trasladables: causalidad industrial simplista, extracción maliciosa no verificada, trinidad exclusiva.  
- **Zonas grises:** citar fuente directa o marcar como opinión/autor.

### 4.6 Captions (figuras y embeds)

- **Pequeño contrato:** qué aporta la imagen (memoria, tensión, genealogía) — no repetir el título.  
- Embed social: **caption corto** que interprete por qué está ahí (“nombrada desde la escena”).  
- Alt text: descriptivo + honesto (“ilustración editorial”, “output curado”) para no simular documento fotográfico donde no lo hay.

---

## 5. Reglas visuales (canon FG aplicado a Detroit y P2)

### 5.1 Manga / ilustración editorial

- **Blanco y negro o alto contraste** permitidos si el layout web mantiene acento FG en hero/overlays.  
- **No** caras identificables de personas reales sin derechos; **no** logos de club/sello.  
- Motivos preferidos: **textura urbana, umbral, multitud abstracta, señal** — alineado a `ARTICLE_VISUAL_BRIEF` + atoms Serena.  
- Relación texto-imagen: cada figura **ilustra una idea del párrafo adyacente** (no decoración global).

### 5.2 Mapas

- Si en el futuro hay mapa: **abstracto o esquemático**; evitar “postal” reconocible como único foco; función narrativa (nodos, flujo) > geografía turística.  
- Consistencia con thesis: **flujo de visibilidad**, no solo fronteras nacionales.

### 5.3 OG (1200×630)

- **Un concepto legible a thumbnail:** señal + silueta urbana o panel fuerte.  
- Crop documentado (v02 desde manga02): mantener **lineage** en `ASSETS_MANIFEST` / ops.  
- Validación externa: Sharing Debugger / Card Validator cuando haya deploy (no en D39).

### 5.4 Cards / hero

- **16:9**; zona oscura para overlay; imagen **no compite** con titular.  
- naming: preferir **slug o FG_*_CANONICAL** estable; actualizar manifest cuando canonicidad cambie.

### 5.5 Dossier images (pilar)

- Pipeline oficial: **Serena extraction → COMFYUI_DOSSIER_PROMPT → gates → PNG dossier**.  
- Dualidad Detroit/Berghain = **tensión operativa**, no collage turístico.

### 5.6 Relación imagen / texto

- Hero = atmósfera + marca; inlines = **argumento**.  
- Si el arte es generativo, **transparencia en alt** (ya iniciado) para credibilidad FG.  
- Evitar ilustración que sugiera **ruina como protagonista** sin capa de futuro/señal.

---

## 6. Rol recomendado de Serena

| Función | Qué hace Serena en el flujo FG |
|---------|-------------------------------|
| **Extracción conceptual** | De `EDITORIAL_BRIEF_VERIFIED` + `ARTICLE_VISUAL_BRIEF`: tesis, dualidades, entidades, límites. |
| **Símbolos visuales** | Listas concretas de objetos (antena, cable, umbral, vapor, charco) — ya modelo dossier. |
| **Tensiones narrativas** | Formular *conflictos útiles* (origen vs visibilidad, archivo vs exportación) para prompts y subtitles. |
| **Mapa semántico** | Nodos: Detroit material / Berlín nodo / memoria queer Black / pedagogía — aristas = flujos de influencia y poder. |
| **Brief ComfyUI** | Atoms positivos/negativos, ratio, gates, seed documentado — `COMFYUI_DOSSIER_PROMPT.md` es el patrón. |

**Brecha:** para **cada artículo largo** como Detroit, valorar un **`SERENA_*_EXTRACTION.md` props** al dossier (no solo dossier pilar), reutilizando la misma plantilla para no mezclar metáforas prohibidas.

---

## 7. Qué pertenece a voz / video (frente aparte)

| Elemento | Web artículo | Voz / video |
|----------|--------------|-------------|
| Longitud | 900–1800 palabras | Scripts 60–90s / 8–15 min según pilar |
| Ritmo | Lectura pausada, notas al pie | Drop, montaje, spotify-noise vs silencio |
| Prueba | Embed, enlaces | sample, VO, subtítulos dinámicos |
| CTAs | Leer fuente en artículo | Suscripción, siguiente episodio |
| Copy red social | D37 **no es voz marca completa**; es variante distribución | Guionista unifica tono hablado con captions |
| Piloto | Pieza lista para leer en web | **Reescritura** obligatoria para hook auditivo |

**Regla:** el artículo Detroit canoniza **pensamiento y límites**; el canal video canoniza **energía y tempo** — comparten claims, no el mismo wording.

---

## 8. Conclusión — estado de Detroit

| Pregunta | Respuesta |
|----------|-----------|
| ¿Sigue como dummy? | **Parcialmente:** operativamente fue “dummy/preview” en varios QA; **contenido y assets canónicos locales** ya desmienten un placeholder vacío. Sigue dummy en **trazabilidad trackers** y en **densidad vs brief completo**. |
| ¿Puede pasar a pieza piloto? | **Sí**, como **piloto web P2** (primera pieza larga con metodología ledger + visual curado), con condiciones del siguiente bloque. |
| ¿Ajuste editorial? | **Recomendado:** ampliar o acotar explícitamente ecología Belleville/Mojo/Collier; endurecer pie de fuentes **o** segunda versión “lectura extendida”; ingresar pieza en **PIECE_STATUS_MATRIX** / pipeline. |
| ¿Ajuste visual? | **Menor pero real:** sincronizar `ARTICLE_VISUAL_BRIEF` + `ASSETS_MANIFEST` con rutas `FG_*`; revisión humana final de crop hero/OG en URL pública post-deploy. |
| ¿Serena / ComfyUI antes de publicación? | **Dossier:** ya integrado. **Artículo:** **no bloqueante** si assets actuales cumplen gates; **opcional** regeneración futura solo si se busca paridad con nuevo brief extendido. |

---

## 9. Qué falta antes de publicar (checklist)

- [ ] Decisión editorial: **versión corta actual** vs **expansión** alineada a `EDITORIAL_BRIEF_VERIFIED`.  
- [ ] Actualizar **ASSETS_MANIFEST** y tabla de `ARTICLE_VISUAL_BRIEF` a estado **CANONICAL** real.  
- [ ] Registrar pieza en **trackers** internos (sin Notion si la regla sigue activa).  
- [ ] Post-deploy: **OG/social** scrape (Meta, LinkedIn, X) según D36/D37.  
- [ ] Opcional: **Serena extraction** archivo dedicado artículo Detroit para relevo de equipo.  
- [ ] **No** ejecutar Buffer hasta autorización explícita.

---

## 10. Referencias cruzadas internas

- Artículo: `website/src/content/articles/techno-detroit-historia-musica-electronica.md`  
- Briefs: `EDITORIAL_BRIEF_VERIFIED.md`, `ARTICLE_VISUAL_BRIEF.md`  
- Ledgers: `CLAIM_LEDGER.md`, `SOURCE_LEDGER.md`  
- Dossier: `04_Produccion/dossiers/bass-borders-detroit-berghain/SERENA_VISUAL_EXTRACTION.md`, `COMFYUI_DOSSIER_PROMPT.md`  
- Buffer (solo copy, sin ejecutar): `07_Operaciones/D37_BUFFER_PACKAGE_DETROIT_20260504.md`  
- Pilares: `system/SISTEMA_MAESTRO.md`, `01_Estrategia/FG_Blueprint_Maestro.md`

---

*Documento generado para D39 — solo análisis y canon; sin cambios de producto ni generación de imágenes en esta entrega.*
