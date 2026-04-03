# X — Asset Specs

**Sistema:** Frecuencia Global  
**Versión:** 1.0  
**Fecha:** 2026-04-01  
**Estado:** Activo

---

## 1. PERFIL

| Asset | Especificación | Estado |
|-------|---------------|--------|
| **Foto de perfil** | 400×400 px mín., PNG, fondo `#0A0A0F`, isotipo FG centrado con glow cian sutil | ✅ Producido — `06_Assets/FG_MK_Avatar_X-Profile_v1.png` |
| **Display name** | `Frecuencia Global` | ⚠️ Validar en plataforma |
| **Username** | `@frec_global` | ✅ Confirmado |
| **Bio** | Ver sección 2 | ✅ Aprobada (Opción A) |
| **Link** | `https://frecuenciaglobal.vercel.app` | ✅ Deploy activo; pendiente configurar en perfil X |
| **Location** | — (opcional, no prioritario) | — |

---

## 2. BIO PROPUESTA

**Máximo 160 caracteres en X.**

**Opción A (145 chars):**
```
Análisis internacional con pulso electrónico ⚡ Geopolítica × música electrónica × datos | Threads, análisis y frecuencias 🌐
```

**Opción B — más compacta (120 chars):**
```
Geopolítica con pulso electrónico ⚡ Análisis en formato de frecuencia | Threads + datos + contexto global
```

**Opción C — directa (98 chars):**
```
Análisis internacional con pulso electrónico ⚡ Geopolítica × cultura × datos
```

> ✅ **APROBADA en jornada técnica 2026-04-01:** Opción A.

---

## 3. HEADER / BANNER

| Parámetro | Valor |
|-----------|-------|
| **Resolución** | 1500 × 500 px |
| **Aspect ratio** | 3:1 |
| **Formato** | PNG o JPEG |
| **DPI** | 72 |
| **Fondo** | `#0A0A0F` sólido (sin grid, máxima legibilidad a tamaño pequeño) |
| **Contenido** | Wordmark "FRECUENCIA GLOBAL" centrado + línea de frecuencia cian + tagline |
| **Tagline** | "ANÁLISIS INTERNACIONAL CON PULSO ELECTRÓNICO" en Space Grotesk, `#A0A0B8` |
| **Safe zone** | Centro ~1500×200 (visibilidad garantizada en desktop y móvil) |

> Prompt de generación disponible en `01_Estrategia/FG_Prompt_Gemini_Rediseno.md` (sección "BANNER X/TWITTER").

### Consideraciones de recorte

- X recorta el banner en móvil (zona visible más reducida verticalmente)
- Todo el contenido crítico debe estar centrado vertical y horizontalmente
- Evitar elementos en los extremos superior/inferior (50px de margen mínimo)
- Nodos decorativos permitidos en esquinas pero no información crítica ahí

---

## 4. POST IMAGE — SPECS TÉCNICAS

| Parámetro | Valor |
|-----------|-------|
| **Resolución recomendada** | 1200 × 675 px |
| **Aspect ratio** | 16:9 |
| **Formato** | PNG (gráficos/texto) o JPEG (fotos) |
| **Tamaño máximo** | 5 MB (PNG), 5 MB (JPEG) |
| **Fondo** | `#0A0A0F` con grid sutil opcional |
| **Presentable en timeline** | Sí — 16:9 se muestra completo en timeline |

### Variante cuadrada (opcional)

| Parámetro | Valor |
|-----------|-------|
| **Resolución** | 1080 × 1080 px |
| **Aspect ratio** | 1:1 |
| **Uso** | Infográficos puntuales, datos únicos, citas |

---

## 5. THREAD IMAGE — SPECS

Para imágenes que acompañan threads (hilos). Cada tweet puede llevar hasta 4 imágenes.

| Parámetro | Valor |
|-----------|-------|
| **Resolución** | 1200 × 675 px (16:9) |
| **Multipanel** | Hasta 4 imágenes por tweet |
| **2 imágenes** | Se muestran lado a lado (~600×675 cada una) |
| **4 imágenes** | Grid 2×2 (~600×337 cada una) |
| **Contenido recomendado** | Dato clave, mapa, gráfico, quote visual, diagrama |
| **Tipografía mínima** | 24px en composición 1200×675 |

---

## 6. ELEMENTOS BRANDED PARA POSTS

| Elemento | Spec | Aplicación |
|----------|------|------------|
| **Pill de pilar** | `[PILAR]` en JetBrains Mono, color del pilar | Inicio del thread o imagen |
| **Línea de frecuencia** | Cian `#00E5FF` 2px, decorativa | Separador en imágenes |
| **Nodo de señal** | Círculo 8-12px con glow | Punteos en listas/datos |
| **Corchetes** | `[ ]` en cian | Tags, clasificaciones |
| **Marca de agua** | Wordmark "FRECUENCIA GLOBAL" al 15% opacidad | Esquina inferior de imágenes compartibles |

---

## 7. LINK PREVIEW (Twitter Card)

Cuando se comparte un link del website en X, la tarjeta de preview usa los meta tags del sitio.

| Meta tag | Valor actual | Estado |
|----------|-------------|--------|
| `twitter:card` | `summary_large_image` | ✅ Configurado |
| `twitter:url` | URL canónica | ✅ Configurado |
| `twitter:title` | Título de la página | ✅ Configurado |
| `twitter:description` | Descripción de la página | ✅ Configurado |
| `twitter:image` | Imagen OG | ✅ Configurado |
| `twitter:site` | `@frec_global` | ✅ Configurado |

> Archivo: `website/src/layouts/BaseLayout.astro`

---

## 8. ASSETS DE PRODUCCIÓN — ESTADO ACTUAL

| # | Asset | Spec | Herramienta | Estado |
|---|-------|------|-------------|--------|
| 1 | Foto de perfil X | 400×400 PNG, isotipo + fondo `#0A0A0F` + glow cian | Export desde `fg_isotipo_512.png` | ✅ Producido (`06_Assets/FG_MK_Avatar_X-Profile_v1.png`) |
| 2 | Banner/Header X | 1500×500 PNG, wordmark + línea frecuencia + tagline | Adaptación de banner existente | ✅ Producido (`06_Assets/FG_MK_BNR_X-Header_v1.png`) |
| 3 | Template post image base | 1200×675 PNG, estructura fija por pilar | Script técnico (`scripts/generate_x_templates.py`) | ✅ Producido (4 variantes: `FG_[GD|BB|FG|BP]_Template_Post_XBase_v1.png`) |
| 4 | Template thread image (4 variantes por pilar) | 1200×675 PNG, dato/gráfico/cita/mapa | Script técnico (`scripts/generate_x_templates.py`) | ✅ Producido (4 variantes: `FG_[GD|BB|FG|BP]_Template_Thread_XBase_v1.png`) |
| 5 | Card de cierre para threads | 1200×675, CTA + isotipo + link | Script técnico (`scripts/generate_x_templates.py`) | ✅ Producido (`FG_GN_Template_ThreadClose_X_v1.png`) |
| 6 | Set de quote cards | 1080×1080, cita visual branded | Canva | ❌ Pendiente |

---

## 9. CONSISTENCIA CROSS-PLATFORM

| Plataforma | Handle | Profile pic | Banner | Verificado |
|------------|--------|-------------|--------|------------|
| X | `@frec_global` | Isotipo FG | 1500×500 | ⚠️ Assets listos; falta aplicar en plataforma |
| YouTube | `@FrecuenciaGlobal` | Isotipo FG | 2560×1440 | ⚠️ Banner pendiente |
| TikTok | `@frecuenciaglobal` | Isotipo FG | N/A | ⚠️ Foto pendiente |
| Instagram | `@globalfrequency.es` | Isotipo FG | N/A | ✅ |
| LinkedIn | frecuencia-global | Isotipo FG | 1584×396 | ⚠️ Pendiente |

> **Nota:** Los handles difieren entre plataformas por disponibilidad. El display name debe ser siempre **"Frecuencia Global"** en todas las plataformas para coherencia.

---

## 10. NOMENCLATURA DE ARCHIVOS

Según `system/rules/RULE_Naming_Conventions.md`:

```
FG_MK_BNR_X-Header_v1.png         → Banner de X
FG_MK_Avatar_X-Profile_v1.png     → Foto de perfil para X
FG_GD_Post_ThreadImage1_v1.png    → Imagen de thread (pilar GD)
FG_BB_Post_QuoteCard_v1.png       → Quote card (pilar BB)
```

---

*Generado: 2026-04-01*  
*Referencia: `02_Brand_System/FG_Brand_Kit_Operativo.md`, `system/rules/RULE_File_Output_Standards.md`*
