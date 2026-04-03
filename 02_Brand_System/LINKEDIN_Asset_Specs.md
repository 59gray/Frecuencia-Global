# LinkedIn — Asset Specs

**Sistema:** Frecuencia Global  
**Versión:** 1.0  
**Fecha:** 2026-04-01  
**Estado:** Pre-lanzamiento

---

## 1. PERFIL (COMPANY PAGE)

| Asset | Especificación | Estado |
|-------|---------------|--------|
| **Logo (foto de perfil)** | 400×400 px mín., PNG, fondo `#0A0A0F`, isotipo FG alineado con TikTok/X/Instagram | ✅ Producido — `04_Produccion/linkedin_assets/fg_linkedin_profile_400x400.png` |
| **Display name** | `Frecuencia Global` | ⚠️ Validar en plataforma |
| **URL personalizada** | `linkedin.com/company/frecuencia-global` | ✅ Confirmado |
| **Tagline** | Hasta 120 caracteres. Ver sección 2 | ⚠️ Requiere aprobación |
| **Descripción (About)** | Hasta 2000 caracteres. Ver sección 2 | ⚠️ Requiere aprobación |
| **Website** | `https://website-three-rho-26.vercel.app` | ✅ Usar temporalmente mientras el canónico siga protegido |
| **Sector** | Media & Communications / Online Media | ⚠️ Pendiente configurar |
| **Tamaño de empresa** | 1-10 empleados | ⚠️ Pendiente configurar |
| **Ubicación** | — (opcional, decidir si aplica) | — |

> **Tipo de página:** Company Page (no personal profile). LinkedIn no permite username como tal; la identidad es la URL personalizada.

---

## 2. TAGLINE Y DESCRIPCIÓN

### Tagline (máximo 120 caracteres)

**Opción A (62 chars):**
```
Análisis internacional con pulso electrónico ⚡ Geopolítica × datos
```

**Opción B — más formal (85 chars):**
```
Análisis geopolítico con identidad electrónica | Datos, contexto y frecuencia global
```

**Opción C — directa (52 chars):**
```
Geopolítica con pulso electrónico ⚡ Análisis global
```

### Descripción (About) — Propuesta

```
Frecuencia Global es una plataforma de análisis geopolítico con identidad de música electrónica.

Traducimos relaciones internacionales complejas a formatos visuales, datos accionables y narrativas que conectan — sobre una base estética de techno, ambient y cultura rave.

Pilares editoriales:
🔹 Geopolitik Drop — Análisis intenso y directo
🔹 Bass & Borders — Exploraciones culturales transfronterizas
🔹 Frecuencia Global — Síntesis ágile e informativa
🔹 Behind the Policy — Análisis formal para profesionales

Fundado por Farid Assad.
```

> **REQUIERE APROBACIÓN** — La tagline y descripción son decisiones editoriales (Maya/Farid).

---

## 3. BANNER / COVER IMAGE

| Parámetro | Valor |
|-----------|-------|
| **Resolución** | 1584 × 396 px |
| **Aspect ratio** | 4:1 |
| **Formato** | PNG o JPEG |
| **DPI** | 72 |
| **Fondo** | `#0A0A0F` sólido (máxima legibilidad) |
| **Contenido** | Wordmark "FRECUENCIA GLOBAL" centrado + línea de frecuencia azul `#4A6BFF` + tagline |
| **Tagline** | "ANÁLISIS INTERNACIONAL CON PULSO ELECTRÓNICO" en Space Grotesk, `#A0A0B8` |
| **Color de acento** | Cian `#15DDF4` para consistencia cross-platform |
| **Safe zone centro** | ~1584×200 (contenido visible garantizado desktop y móvil) |

> El banner de LinkedIn es más sobrio que los de otras plataformas. Menos glow, menos glitch, estilo Behind the Policy.

### Consideraciones de recorte

- LinkedIn recorta el banner más agresivamente en móvil (zona visible ~1584×200 centro)
- El logo de la empresa se superpone en esquina inferior izquierda — no poner contenido ahí
- Margen seguro: 50px superior/inferior, 80px laterales
- Wordmark y tagline deben estar centrados vertical y horizontalmente
- Nodos decorativos solo en esquinas superiores, sin información crítica

### Diferencias vs. banner de X

| Aspecto | X | LinkedIn |
|---------|---|----------|
| Resolución | 1500×500 | 1584×396 |
| Ratio | 3:1 | 4:1 (más panorámico) |
| Tono | Cian + glitch sutil | Azul + sobrio |
| Acento | `#00E5FF` | `#4A6BFF` |
| Superposición avatar | Superior izquierda | Inferior izquierda |

---

## 4. POST IMAGE — SPECS TÉCNICAS

### Imagen de publicación estándar

| Parámetro | Valor |
|-----------|-------|
| **Resolución recomendada** | 1200 × 627 px |
| **Aspect ratio** | ~1.91:1 |
| **Formato** | PNG (gráficos/texto) o JPEG (fotos) |
| **Tamaño máximo** | 10 MB |
| **Fondo** | `#0A0A0F` con grid sutil opcional |
| **Presentación en feed** | Se muestra completo, sin recorte significativo |

### Variante cuadrada (opcional)

| Parámetro | Valor |
|-----------|-------|
| **Resolución** | 1080 × 1080 px |
| **Aspect ratio** | 1:1 |
| **Uso** | Infográficos, datos puntuales, citas, polls visuales |

### Variante vertical (carrusel/document)

| Parámetro | Valor |
|-----------|-------|
| **Resolución** | 1080 × 1350 px |
| **Aspect ratio** | 4:5 |
| **Uso** | Documentos PDF (carrusel nativo LinkedIn) |
| **Formato subida** | PDF |
| **Slides recomendados** | 6-12 por documento |

---

## 5. ARTÍCULO LINKEDIN — COVER IMAGE

Para artículos nativos de LinkedIn (formato largo — pilar Behind the Policy).

| Parámetro | Valor |
|-----------|-------|
| **Resolución** | 1200 × 627 px |
| **Aspect ratio** | ~1.91:1 |
| **Formato** | PNG o JPEG |
| **Fondo** | PolicyField (`#0A0A0F` con acentos azul `#4A6BFF`) |
| **Pill** | `[BEHIND THE POLICY]` JetBrains Mono, azul |
| **Título** | Bebas Neue 56px, blanco, drop shadow |
| **Línea de frecuencia** | Azul `#4A6BFF`, 2px, debajo del título |
| **Autor** | "Por Farid Assad · Frecuencia Global" — Space Grotesk |
| **Grid Figma** | 8 columnas, 60px margen, 16px gutter |

> Composición visual en `02_Brand_System/FG_Archivo_Maestro_Visual_Canva.md` §9C.

---

## 6. DOCUMENTO / CARRUSEL PDF

LinkedIn permite subir documentos PDF que se muestran como carrusel swipeable.

| Parámetro | Valor |
|-----------|-------|
| **Resolución por slide** | 1080 × 1350 px |
| **Formato** | PDF (todas las slides en un archivo) |
| **Tamaño máximo** | 100 MB / 300 páginas |
| **Estructura** | Portada + slides interiores + slide de cierre |
| **Slides sugeridos** | 6-12 (tiempo atención profesional) |

### Estructura de slides

| Slide | Contenido |
|-------|-----------|
| **Portada** | Título + pill pilar + línea frecuencia + isotipo |
| **Interior** | Dato/análisis + tipografía grande + espacio gris oscuro |
| **Cierre** | CTA + isotipo + link website + handles sociales |

### Diferencias vs. carrusel Instagram

- **Tono:** Más formal, más espacio blanco (gris oscuro `#1A1A2E`)
- **Color acento:** Azul `#4A6BFF` en vez de cian
- **Texto:** Puede haber más volumen (audiencia profesional lee más)
- **Pill:** `[BEHIND THE POLICY]` en la mayoría de los carruseles LinkedIn
- **CTA:** Orientado a networking — "Conecta para más análisis" vs. "Síguenos"

> Composición visual en `02_Brand_System/FG_Archivo_Maestro_Visual_Canva.md` §9B.

---

## 7. ELEMENTOS BRANDED PARA POSTS

| Elemento | Spec | Aplicación |
|----------|------|------------|
| **Pill de pilar** | `[PILAR]` en JetBrains Mono, color del pilar | Inicio del post o imagen |
| **Línea de frecuencia** | Azul `#4A6BFF` 2px (default LinkedIn) | Separador en imágenes |
| **Nodo de señal** | Círculo 8-12px con glow azul sutil | Punteos en listas/datos |
| **Corchetes** | `[ ]` en azul | Tags, clasificaciones |
| **Marca de agua** | Wordmark "FRECUENCIA GLOBAL" al 15% opacidad | Esquina inferior de imágenes compartibles |
| **Hashtags** | `#geopolitics #InternationalRelations #FrecuenciaGlobal` | Máximo 3-5 por post |

> En LinkedIn, los hashtags son funcionales (descubrimiento real). Usar con moderación pero consistencia.

---

## 8. LINK PREVIEW (Open Graph)

LinkedIn usa Open Graph meta tags para las previews de links compartidos.

| Meta tag | Valor actual | Estado |
|----------|-------------|--------|
| `og:type` | Tipo de página (article/website) | ✅ Configurado |
| `og:url` | URL canónica | ✅ Configurado |
| `og:title` | Título de la página | ✅ Configurado |
| `og:description` | Descripción de la página | ✅ Configurado |
| `og:image` | Imagen OG (1200×627 ideal) | ✅ Configurado |
| `og:locale` | `es_ES` | ✅ Configurado |

> Archivo: `website/src/layouts/BaseLayout.astro`  
> LinkedIn no usa Twitter Cards; depende exclusivamente de `og:` tags.  
> Para forzar recache: usar [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).

---

## 9. ASSETS PENDIENTES — LISTA DE PRODUCCIÓN

| # | Asset | Spec | Herramienta | Prioridad |
|---|-------|------|-------------|-----------|
| 1 | Logo (foto de perfil) | 400×400 PNG, isotipo + fondo `#0A0A0F` | `04_Produccion/linkedin_assets/fg_linkedin_profile_400x400.png` | P0 |
| 2 | Banner/Cover LinkedIn | 1584×396 PNG, wordmark + línea frecuencia cian + tagline | `04_Produccion/linkedin_assets/fg_linkedin_banner_1584x396.png` | P0 |
| 3 | Template post image base | 1200×627 PNG, estructura Behind the Policy | Canva | P1 |
| 4 | Template artículo cover | 1200×627 PNG, pill + título + línea frecuencia | Canva | P1 |
| 5 | Template documento/carrusel | 1080×1350 PDF, portada + interior + cierre | Canva | P1 |
| 6 | Set de quote cards LinkedIn | 1080×1080, cita visual branded en azul | Canva | P2 |

---

## 10. CONSISTENCIA CROSS-PLATFORM

| Plataforma | Handle | Profile pic | Banner | Verificado |
|------------|--------|-------------|--------|------------|
| LinkedIn | `frecuencia-global` (company) | Isotipo FG | 1584×396 | ✅ Assets listos para subir |
| X | `@frec_global` | Isotipo FG | 1500×500 | ⚠️ Pendiente |
| YouTube | `@FrecuenciaGlobal` | Isotipo FG | 2560×1440 | ⚠️ Banner pendiente |
| TikTok | `@frecuenciaglobal` | Isotipo FG | N/A | ⚠️ Foto pendiente |
| Instagram | `@globalfrequency.es` | Isotipo FG | N/A | ✅ |

> **Nota:** Los handles difieren entre plataformas por disponibilidad. El display name debe ser siempre **"Frecuencia Global"** en todas las plataformas para coherencia.

---

## 11. NOMENCLATURA DE ARCHIVOS

Según `system/rules/RULE_Naming_Conventions.md`:

```
FG_MK_BNR_LinkedIn-Cover_v1.png       → Banner/cover de LinkedIn
FG_MK_Avatar_LinkedIn-Logo_v1.png     → Logo (foto de perfil) para LinkedIn
FG_BP_Post_ArticleCover_v1.png        → Cover de artículo LinkedIn (pilar BP)
FG_BP_Doc_Carrusel-LinkedIn_v1.pdf    → Documento/carrusel LinkedIn (pilar BP)
FG_BP_Post_QuoteCard-LI_v1.png        → Quote card LinkedIn (pilar BP)
```

> LinkedIn es primariamente pilar Behind the Policy (`BP`), pero puede usar otros pilares puntualmente.

---

*Generado: 2026-04-01*  
*Referencia: `02_Brand_System/FG_Brand_Kit_Operativo.md`, `02_Brand_System/FG_Archivo_Maestro_Visual_Canva.md`, `02_Brand_System/FG_Figma_Master_Architecture.md`*
