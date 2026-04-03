# ARQUITECTURA DEL ARCHIVO MAESTRO FIGMA — Frecuencia Global

**Versión:** 1.1  
**Fecha:** 2026-03-31  
**Estado:** EN CONSTRUCCIÓN — Fase 1 completada, Fase 2+ pendiente por rate limit  
**Relación:** Complementa `FG_Archivo_Maestro_Visual_Canva.md` — no lo reemplaza  
**Rol de Figma:** Sistema maestro, fuente de verdad estructural, gobernanza visual  
**Rol de Canva:** Producción rápida, publicación, iteración de contenido  
**File key:** `1Gbya37K99sDRIPxi694yl`  
**URL:** https://www.figma.com/design/1Gbya37K99sDRIPxi694yl  
**Plan:** Starter (6 tool calls/mes, 3 páginas máx.)

---

## 0. ESTADO ACTUAL DE IMPLEMENTACIÓN

> **Actualizado:** 2026-03-31

### ✅ COMPLETADO

| Elemento | Cantidad | Detalles |
|----------|----------|---------|
| Páginas | 3 | System, Templates, Documentation (máx. del plan Starter) |
| Variables de color | 13 | 8 base + 5 semánticos en colección `fg-colors` |
| Variables numéricas | 16 | Spacing (4→64px) + radius (2→16px) + stroke (1,2,3px) en `fg-spacing` |
| Estilos de texto | 14 | display xl/lg/md/sm, headline lg/md/sm, body lg/md/sm, data md/sm/xs, micro |
| Estilos de efecto | 7 | glow/cyan, magenta, green, blue, node + shadow/text + blur/background |

### 🔲 PENDIENTE (requiere tool calls nuevos)

| Elemento | Prioridad | Est. calls |
|----------|-----------|-----------|
| Brand components (frequency line, node, pills, brackets, divider) | P0 | 1 |
| UI block components (header, title, lower third, card) | P0 | 1–2 |
| Template frames (YouTube, IG, TikTok, Post, LinkedIn) | P1 | 2–3 |
| Documentation page content | P2 | 1 |

### ⚠️ RESTRICCIONES DEL PLAN STARTER

- **3 páginas máximo** — todo el contenido se organiza usando Secciones y Frames dentro de las 3 páginas
- **6 tool calls/mes** — ya consumidos para este período. La construcción continúa en el próximo ciclo
- `use_figma` (escritura) aparentemente también cuenta hacia el límite mensual
- `whoami`, `generate_figma_design`, `add_code_connect_map` son exentos

### Adaptación de 17 páginas → 3 páginas

| Página Figma | Contiene (como secciones) |
|-------------|---------------------------|
| 🧩 System — Foundations + Components | Cover, Color, Typography, Spacing, Effects, Brand Elements, UI Blocks, Backgrounds, Logo System |
| 📄 Templates — YouTube, IG, TikTok, LinkedIn | Thumbnail, Carrusel, Story/Reel, Post, LinkedIn, YouTube Banner |
| 📖 Documentation — Rules + Figma↔Canva | Reglas, Checklist, Flujo operativo, DO/DON'T, Explorations |

---

## 1. ESTRUCTURA DE PÁGINAS DEL ARCHIVO FIGMA

Un solo archivo Figma. Nombre: **`FG — Sistema Visual Maestro`**

| # | Página | Contenido | Propósito |
|---|--------|-----------|-----------|
| 0 | 📋 Cover | Portada del archivo con wordmark, versión, fecha, estado | Identificación inmediata |
| 1 | 📐 Foundations / Color | Paleta completa, semántica de color, colores por pilar, gradientes, reglas | Fuente de verdad cromática |
| 2 | 📐 Foundations / Typography | 3 familias, escala tipográfica, pesos, roles, interlineado, tracking | Fuente de verdad tipográfica |
| 3 | 📐 Foundations / Spacing & Grid | Sistema de espaciado (4px base), grids por formato, márgenes, paddings | Consistencia dimensional |
| 4 | 📐 Foundations / Effects | Glow, sombras, noise, glitch, scan lines — con parámetros exactos | Catálogo cerrado de efectos |
| 5 | 🧩 Components / Brand Elements | Línea de frecuencia, nodo, corchetes, pills de pilar, divisores | Piezas atómicas del sistema |
| 6 | 🧩 Components / UI Blocks | Headers, lower thirds, metadata bars, cards, quote frames, map frames | Bloques compositivos |
| 7 | 🧩 Components / Backgrounds | 8 fondos base como componentes reutilizables | Catálogo de superficies |
| 8 | 🧩 Components / Logo System | Todas las variantes del logo con reglas de uso y zona de protección | Gobernanza de marca |
| 9 | 📄 Templates / YouTube Thumbnail | Template 1280×720 con variantes por pilar (GD, BB, FG, BP) | Plantilla maestra thumbnail |
| 10 | 📄 Templates / Carrusel IG | Template 1080×1350: portada, slide interior, cierre — por pilar | Plantilla maestra carrusel |
| 11 | 📄 Templates / Story-Reel-TikTok | Overlay 1080×1920 con safe areas y variantes por pilar | Plantilla maestra vertical |
| 12 | 📄 Templates / Post Cuadrado | Template 1080×1080 por pilar | Plantilla maestra post |
| 13 | 📄 Templates / LinkedIn Article | Template 1200×627 (Behind the Policy + general) | Plantilla crosspost |
| 14 | 📄 Templates / YouTube Banner | Template 2560×1440 con safe areas | Cabecera canal |
| 15 | 🔬 Explorations | Zona libre para experimentar sin romper el sistema | Sandbox controlado |
| 16 | 📖 Documentation | Reglas de uso, checklist, flujo Figma↔Canva, DO/DON'T | Guía operativa interna |

**Total: 17 páginas.** Cada página tiene un emoji de categoría para navegación rápida.

### Convención de nombres dentro de cada página

```
Frames de sección:     [Categoría] / [Nombre]          → Foundations / Color Primarios
Componentes:           FG/[Categoría]/[Nombre]          → FG/Brand/FrequencyLine
Variantes:             Property=Value                    → Pilar=GeopolitikDrop, State=Active
Estilos locales:       fg/[grupo]/[nombre]               → fg/color/cyan-electric
Variables:             fg.[grupo].[nombre]                → fg.color.accent.cyan
```

---

## 2. ORDEN RECOMENDADO DE CONSTRUCCIÓN

La construcción se hace en 4 fases. Cada fase desbloquea la siguiente. No saltar fases.

### FASE 1 — Foundations (Prioridad P0)
> Sin foundations, los componentes no tienen base. Todo lo demás hereda de aquí.

| Paso | Entregable | Dependencia | Esfuerzo |
|------|-----------|-------------|----------|
| 1.1 | Variables de color (8 colores + semántica) | Ninguna | Bajo |
| 1.2 | Variables de spacing (escala 4px) | Ninguna | Bajo |
| 1.3 | Estilos de texto (5 niveles tipográficos) | Fuentes instaladas | Bajo |
| 1.4 | Estilos de efecto (glow, shadow, noise) | 1.1 completado | Bajo |
| 1.5 | Grids por formato (1280×720, 1080×1350, 1080×1920, 1080×1080) | 1.2 completado | Medio |

**Entregable de Fase 1:** Foundations completas. Cualquier frame nuevo hereda automáticamente del sistema.

### FASE 2 — Componentes atómicos (Prioridad P0)
> Son las piezas que se repiten en todo. Construirlos bien elimina el 80% del trabajo manual.

| Paso | Entregable | Dependencia | Esfuerzo |
|------|-----------|-------------|----------|
| 2.1 | Logo system (6 variantes como componentes) | Fase 1 | Medio |
| 2.2 | Línea de frecuencia (3 variantes × 4 colores) | Fase 1 | Bajo |
| 2.3 | Nodo de señal (4 colores) | Fase 1 | Bajo |
| 2.4 | Corchetes (2 variantes) | Fase 1 | Bajo |
| 2.5 | Pill de pilar (4 variantes con auto layout) | Fase 1 | Bajo |
| 2.6 | Metadata bar (2 variantes × 4 colores) | 2.2, 2.3, 2.4 | Medio |
| 2.7 | Fondos base (8 como componentes) | Fase 1 | Medio |

**Entregable de Fase 2:** Librería de componentes base publicable. Todas las piezas atómicas listas.

### FASE 3 — Bloques compositivos + Templates (Prioridad P1)
> Combinan componentes atómicos en estructuras reutilizables.

| Paso | Entregable | Dependencia | Esfuerzo |
|------|-----------|-------------|----------|
| 3.1 | Header block (pill + isotipo + metadata) | Fase 2 | Medio |
| 3.2 | Title block (título + línea frecuencia + subtítulo) | Fase 2 | Medio |
| 3.3 | Lower third (barra + texto + línea frecuencia) | Fase 2 | Medio |
| 3.4 | Card informativa (body text + fuente + divisor) | Fase 2 | Medio |
| 3.5 | Template Thumbnail YouTube (4 variantes pilar) | 3.1, 3.2 | Alto |
| 3.6 | Template Carrusel IG: portada + interior + cierre | 3.1, 3.2, 3.4 | Alto |
| 3.7 | Template Overlay TikTok/Reels (4 variantes) | 3.1, 3.3 | Alto |
| 3.8 | Template Post cuadrado (4 variantes) | 3.1, 3.2 | Medio |

**Entregable de Fase 3:** Templates maestros funcionando. Se puede producir contenido desde Figma.

### FASE 4 — Documentación + Flujo operativo (Prioridad P1)
> Hace que el sistema sea transmisible y mantenible.

| Paso | Entregable | Dependencia | Esfuerzo |
|------|-----------|-------------|----------|
| 4.1 | Página de documentación con DO/DON'T | Fase 3 | Medio |
| 4.2 | Checklist de consistencia visual | Fase 3 | Bajo |
| 4.3 | Guía de flujo Figma↔Canva | Fase 3 | Medio |
| 4.4 | Exportables para Canva (guía de handoff) | Fase 3 | Medio |

---

## 3. FOUNDATIONS A DEFINIR PRIMERO

### 3.1 Color Variables (Figma Variables — modo Collection)

**Collection: `fg-colors`**

| Variable | Value | Alias semántico | Uso |
|----------|-------|-----------------|-----|
| `fg.color.base.black` | `#0A0A0F` | `fg.color.surface.primary` | Fondo principal |
| `fg.color.base.graphite` | `#1A1A2E` | `fg.color.surface.secondary` | Cards, zonas internas |
| `fg.color.base.white` | `#FFFFFF` | `fg.color.text.primary` | Texto principal |
| `fg.color.base.gray` | `#A0A0B8` | `fg.color.text.secondary` | Subtítulos, metadata |
| `fg.color.accent.cyan` | `#00E5FF` | `fg.color.pilar.geopolitik` | Acento 1 + Geopolitik Drop |
| `fg.color.accent.magenta` | `#FF00E5` | `fg.color.pilar.bass` | Acento 2 + Bass & Borders |
| `fg.color.accent.green` | `#B8FF00` | `fg.color.pilar.frecuencia` | Acento 3 + Frecuencia Global |
| `fg.color.accent.blue` | `#4A6BFF` | `fg.color.pilar.policy` | Behind the Policy |

**Modos de la collection (opcional, Fase 2+):**

| Modo | Descripción | Cambio principal |
|------|-------------|-----------------|
| Default | Sistema base | Valores como arriba |
| Pilar-GD | Geopolitik Drop activo | `fg.color.accent.active` = cyan |
| Pilar-BB | Bass & Borders activo | `fg.color.accent.active` = magenta |
| Pilar-FG | Frecuencia Global activo | `fg.color.accent.active` = green |
| Pilar-BP | Behind the Policy activo | `fg.color.accent.active` = blue |

Esto permite cambiar el pilar de un template completo cambiando un solo modo. Poder real del sistema.

### 3.2 Spacing Variables

**Collection: `fg-spacing`**

Base unit: **4px**

| Variable | Value | Uso |
|----------|-------|-----|
| `fg.space.2xs` | 4px | Mínimo entre elementos inline |
| `fg.space.xs` | 8px | Espacio entre línea de frecuencia y texto |
| `fg.space.sm` | 12px | Espacio título-subtítulo |
| `fg.space.md` | 16px | Padding interno cards |
| `fg.space.lg` | 24px | Padding cards generoso |
| `fg.space.xl` | 32px | Separación entre secciones |
| `fg.space.2xl` | 48px | Margen exterior piezas |
| `fg.space.3xl` | 64px | Margen exterior piezas grandes |

### 3.3 Typography Styles

**5 estilos de texto como Text Styles en Figma:**

| Style Name | Font | Weight | Size | Line Height | Letter Spacing | Transform |
|------------|------|--------|------|-------------|----------------|-----------|
| `fg/display/xl` | Bebas Neue | 400 | 80px | 90% | +3% | UPPERCASE |
| `fg/display/lg` | Bebas Neue | 400 | 64px | 90% | +3% | UPPERCASE |
| `fg/display/md` | Bebas Neue | 400 | 48px | 95% | +3% | UPPERCASE |
| `fg/display/sm` | Bebas Neue | 400 | 40px | 95% | +3% | UPPERCASE |
| `fg/headline/lg` | Space Grotesk | 700 | 36px | 140% | 0 | None |
| `fg/headline/md` | Space Grotesk | 700 | 28px | 140% | 0 | None |
| `fg/headline/sm` | Space Grotesk | 700 | 24px | 140% | 0 | None |
| `fg/body/lg` | Space Grotesk | 400 | 18px | 160% | 0 | None |
| `fg/body/md` | Space Grotesk | 400 | 16px | 160% | 0 | None |
| `fg/body/sm` | Space Grotesk | 400 | 14px | 150% | 0 | None |
| `fg/data/md` | JetBrains Mono | 400 | 16px | 130% | 0 | None |
| `fg/data/sm` | JetBrains Mono | 400 | 14px | 130% | 0 | None |
| `fg/data/xs` | JetBrains Mono | 400 | 12px | 120% | 0 | None |
| `fg/micro` | Space Grotesk | 500 | 10px | 140% | 0 | None |

### 3.4 Effect Styles

| Style Name | Type | Parameters |
|------------|------|------------|
| `fg/glow/cyan` | Drop Shadow | Color `#00E5FF` @ 30%, X:0 Y:0, Blur: 16px |
| `fg/glow/magenta` | Drop Shadow | Color `#FF00E5` @ 30%, X:0 Y:0, Blur: 16px |
| `fg/glow/green` | Drop Shadow | Color `#B8FF00` @ 30%, X:0 Y:0, Blur: 16px |
| `fg/glow/blue` | Drop Shadow | Color `#4A6BFF` @ 30%, X:0 Y:0, Blur: 16px |
| `fg/glow/node` | Drop Shadow | Color variable @ 40%, X:0 Y:0, Blur: 12px |
| `fg/shadow/text` | Drop Shadow | Color `#000000` @ 80%, X:0 Y:2, Blur: 4px |
| `fg/noise` | Layer Blur placeholder | Documentar: noise 4%, monocromático (aplicar via plugin) |

### 3.5 Grids por formato

| Formato | Dimensión | Columnas | Margen | Gutter | Uso |
|---------|-----------|----------|--------|--------|-----|
| YouTube Thumbnail | 1280×720 | 12 | 64px (5%) | 16px | Composición de thumbnails |
| Carrusel IG | 1080×1350 | 6 | 54px (5%) | 16px | Portada + slides |
| Post cuadrado | 1080×1080 | 6 | 54px (5%) | 16px | Posts |
| Overlay vertical | 1080×1920 | 4 | 60px | 16px | TikTok/Reels |
| YouTube Banner | 2560×1440 | 12 | 128px | 24px | Banner canal |
| LinkedIn Article | 1200×627 | 8 | 60px | 16px | Cover LinkedIn |

### 3.6 Border Radius

| Token | Value | Uso |
|-------|-------|-----|
| `fg.radius.none` | 0px | Thumbnails, frames, overlays |
| `fg.radius.sm` | 2px | Pills de pilar, corchetes |
| `fg.radius.md` | 4px | Cards (máximo permitido) |
| `fg.radius.full` | 999px | Nodos de señal |

### 3.7 Stroke

| Token | Value | Uso |
|-------|-------|-----|
| `fg.stroke.thin` | 1px | Grid de fondo, líneas sutiles |
| `fg.stroke.base` | 2px | Línea de frecuencia base |
| `fg.stroke.medium` | 3px | Línea de frecuencia destacada |
| `fg.stroke.thick` | 4px | Bordes de pilar en cards |

---

## 4. LISTA DE COMPONENTES BASE

### 4.1 Brand Elements (Atómicos)

| Componente | Nombre en Figma | Variantes (Properties) | Auto Layout |
|------------|----------------|----------------------|-------------|
| Línea de frecuencia | `FG/Brand/FrequencyLine` | Direction: Horizontal, Vertical, Curve · Pilar: GD, BB, FG, BP | No (vector) |
| Nodo de señal | `FG/Brand/SignalNode` | Pilar: GD, BB, FG, BP · Size: SM (8px), MD (12px), LG (16px) | No |
| Corchetes | `FG/Brand/Brackets` | Pilar: GD, BB, FG, BP | Sí — contenido flexible |
| Pill de pilar | `FG/Brand/PillarPill` | Pilar: GD, BB, FG, BP | Sí — padding horizontal 12px, vertical 4px |
| Divisor con nodos | `FG/Brand/Divider` | Pilar: GD, BB, FG, BP | Sí — width flexible |
| Isotipo FG | `FG/Brand/Isotipo` | Size: SM (24px), MD (32px), LG (48px) | No |
| Wordmark | `FG/Brand/Wordmark` | Layout: Inline, Stacked · Variant: Dark, Light | No |

### 4.2 UI Blocks (Compositivos)

| Componente | Nombre en Figma | Contenido | Variantes | Auto Layout |
|------------|----------------|-----------|-----------|-------------|
| Header block | `FG/Block/Header` | Pill + Isotipo, distribuidos en extremos | Pilar: GD, BB, FG, BP | Sí — space-between |
| Title block | `FG/Block/Title` | Título (Bebas) + Línea de frecuencia + Subtítulo | Pilar: GD, BB, FG, BP · hasSubtitle: true/false | Sí — vertical, gap sm |
| Lower third | `FG/Block/LowerThird` | Barra semitransparente + texto + línea frec. | Pilar: GD, BB, FG, BP | Sí — vertical |
| Metadata bar | `FG/Block/MetadataBar` | Fecha + Pilar + Región en corchetes | Pilar: GD, BB, FG, BP · Style: Accent, Neutral | Sí — horizontal, gap xs |
| Card informativa | `FG/Block/InfoCard` | Número + Headline + Body + Fuente | Pilar: GD, BB, FG, BP | Sí — vertical, padding md |
| Cierre carrusel | `FG/Block/CarouselClose` | Wordmark apilado + handle + CTA + línea frec. | — | Sí — vertical, centrado |
| Quote frame | `FG/Block/QuoteFrame` | Cita + atribución + marco lateral | Pilar: GD, BB, FG, BP | Sí — vertical |
| Photo frame | `FG/Block/PhotoFrame` | Imagen + borde color pilar | Pilar: GD, BB, FG, BP | No (clip content) |
| Keyword pill | `FG/Block/KeywordPill` | Texto de tema | Pilar: GD, BB, FG, BP | Sí — padding 8/4 |
| Slide counter | `FG/Block/SlideCounter` | "02 / 08" | Pilar: GD, BB, FG, BP | Sí |

### 4.3 Backgrounds (Fondos como componentes)

| Componente | Nombre en Figma | Composición |
|------------|----------------|-------------|
| DarkSolid | `FG/BG/DarkSolid` | `#0A0A0F` plano |
| DarkGrid | `FG/BG/DarkGrid` | `#0A0A0F` + grid blanco al 4% |
| CyanField | `FG/BG/CyanField` | Negro + halo cian diagonal |
| MagentaField | `FG/BG/MagentaField` | Negro + halo magenta |
| NewsField | `FG/BG/NewsField` | Negro + verde ácido sutil |
| PolicyField | `FG/BG/PolicyField` | Negro + tono azul profundo |
| GradienteVertical | `FG/BG/GradientVertical` | `#0A0A0F` → `#1A1A2E` |
| GradienteNeon | `FG/BG/GradientNeon` | Negro + halo cian/magenta esquina |

---

## 5. QUÉ TEMPLATES CONSTRUIR PRIMERO

### Prioridad por impacto en producción

| Prioridad | Template | Formato | Por qué primero |
|-----------|----------|---------|----------------|
| 🔴 P0 | Thumbnail YouTube | 1280×720 | Es la pieza más frecuente. Cada video necesita uno. |
| 🔴 P0 | Carrusel IG (portada + interior + cierre) | 1080×1350 | Segundo formato más usado. Alto repurposing. |
| 🟡 P1 | Overlay TikTok/Reels | 1080×1920 | Necesario para vertical video. Crecimiento TikTok. |
| 🟡 P1 | Post cuadrado | 1080×1080 | Piezas rápidas, noticias, quotes. |
| 🟢 P2 | LinkedIn Article cover | 1200×627 | Principalmente Behind the Policy. Menor volumen. |
| 🟢 P2 | YouTube Banner | 2560×1440 | Se hace una vez. Bajo volumen de cambio. |

**Cada template P0 y P1 debe tener las 4 variantes de pilar** desde el primer build. Si usas variables de modo por pilar, cambiar de variante es instantáneo.

---

## 6. QUÉ DEBE ESTAR EN FIGMA vs. QUÉ EN CANVA

### En Figma (sistema, precisión, gobernanza)

| Función | Por qué en Figma |
|---------|-----------------|
| Definición de foundations (colores, tipografía, spacing, grids) | Variables nativas, consistencia absoluta |
| Componentes maestros con variantes y propiedades | Component Properties, auto layout real |
| Templates maestros como referencia | Estructura precisa, medidas exactas |
| Logo system y zona de protección | Medidas al pixel, exportación vectorial limpia |
| Documentación visual del sistema | Páginas dedicadas, anotaciones claras |
| Design tokens para futura exportación web | Variables exportables a JSON/CSS |
| Exploración y prototipado de nuevos formatos | Antes de comprometerse a producción |
| Auditoría visual (checklist, DO/DON'T) | Referencia estática para consistencia |

### En Canva (producción, velocidad, publicación)

| Función | Por qué en Canva |
|---------|-----------------|
| Producción de piezas individuales (thumbnails, carruseles, posts) | Flujo rápido, acceso a fotos/stock |
| Iteración rápida de contenido (cambiar texto, imagen) | Editor intuitivo, no requiere training |
| Exportación y publicación directa | Integración con redes, formatos listos |
| Colaboración rápida con terceros no-diseñadores | Acceso web, sin instalación |
| Brand Kit nativo como enforcement básico | Colores y fuentes accesibles al crear |
| Animaciones básicas (si aplica) | Canva tiene animación simple |

### Flujo de trabajo híbrido

```
FIGMA                                    CANVA
┌─────────────────┐                      ┌─────────────────┐
│ 1. Define       │                      │ 4. Produce      │
│    foundations   │───── exportar ─────→ │    pieza final   │
│    + componentes │    (specs, guías)    │    con texto     │
│                  │                      │    real          │
│ 2. Construye    │                      │                  │
│    template     │                      │ 5. Exporta      │
│    maestro      │                      │    para          │
│                  │                      │    publicación   │
│ 3. Documenta    │                      │                  │
│    reglas de uso │◄──── feedback ──────│ 6. QA visual    │
│                  │   (ajustes si hay   │    contra specs  │
│                  │    inconsistencias) │    de Figma      │
└─────────────────┘                      └─────────────────┘
```

### Exportables de Figma → Canva

| Exportable | Formato | Uso en Canva |
|------------|---------|-------------|
| Specs de layout (posiciones, tamaños, márgenes) | PNG anotado o PDF | Referencia al construir piezas |
| Componentes vectoriales (logos, línea de frecuencia, nodos) | SVG | Upload directo como elements |
| Fondos base | PNG 2x | Upload como brand photos/graphics |
| Paleta de colores | Lista hex | Copiar a Brand Kit |
| Typography specs | Documentación | Referencia para configurar Brand Fonts |
| Templates como referencia visual | PNG flatten | "Así debe verse" al producir en Canva |

---

## 7. RIESGOS SI EL SISTEMA SE CONSTRUYE MAL

| # | Riesgo | Consecuencia | Mitigación |
|---|--------|-------------|------------|
| R1 | **Construir templates antes que foundations** | Templates sin base. Cada cambio de color o tipografía requiere editar manualmente cada template. Los tokens no propagan. | Siempre Fase 1 → Fase 2 → Fase 3. Sin excepciones. |
| R2 | **No usar variables de Figma** | Sin variables, los componentes son estáticos. Cambiar de pilar requiere rehacer todo. Se pierde la ventaja principal sobre Canva. | Crear la collection `fg-colors` con modos por pilar desde el día 1. |
| R3 | **Componentes sin auto layout** | Piezas que se rompen al cambiar texto. Thumbnails que no escalan. Lower thirds que requieren reposicionar a mano. | Todo bloque compositivo (Block/*) debe usar auto layout. Solo vectores puros (Brand/*) pueden prescindir. |
| R4 | **Nombrar componentes sin convención** | Librería caótica. No se encuentra nada. Duplicación de piezas. | Seguir la convención `FG/[Categoría]/[Nombre]` estrictamente. Documentar en la página Cover. |
| R5 | **Duplicar el sistema en Canva y Figma** | Dos fuentes de verdad = ninguna fuente de verdad. Divergencia inevitable. | Figma es sistema. Canva es producción. Si hay conflicto, Figma gana. |
| R6 | **Crear componentes demasiado rígidos** | Piezas que no se adaptan a contenido real (títulos más largos, slides extra, texto en otro idioma). | Diseñar con min/max constraints. Probar con contenido extremo (título de 3 palabras vs. 12 palabras). |
| R7 | **Ignorar Behind the Policy** | 3 pilares con sistema, 1 sin sistema. Cuando llegue el contenido de BP, se improvisa y se rompe la consistencia. | Definir BP desde Fase 1 con la misma estructura que GD/BB/FG. El azul `#4A6BFF` ya está asignado. |
| R8 | **No documentar el flujo Figma↔Canva** | Cada vez que se produce una pieza, hay que "recordar" cómo se traduce de Figma a Canva. Se pierde tiempo y se generan errores. | Fase 4 es obligatoria. La documentación es parte del sistema, no un extra. |
| R9 | **Sobreingeniería del sistema** | Variables para todo, 40 variantes por componente, 6 niveles de anidación. Resultado: sistema que nadie usa porque es más lento que diseñar desde cero. | Máximo 2 niveles de component nesting. Máximo 4 properties por componente (Pilar es obligatorio, el resto según necesidad real). |
| R10 | **No testear con contenido real** | Templates que funcionan con "Lorem ipsum" pero se rompen con "CRISIS EN EL ESTRECHO DE TAIWÁN: EL BLOQUEO NAVAL QUE CAMBIA TODO". | Antes de cerrar cualquier template, probarlo con 3 títulos reales del proyecto: uno corto, uno medio, uno largo. |

---

## 8. HIPÓTESIS DE TRABAJO

> Señalo aquí lo que NO está explícitamente definido en los documentos actuales y que estoy resolviendo por inferencia. Si alguna es incorrecta, corregir antes de construir.

| # | Hipótesis | Base de inferencia | Impacto si es incorrecta |
|---|-----------|-------------------|-------------------------|
| H1 | **Behind the Policy usa `#4A6BFF` como color de pilar.** Ya aparece asignado en la documentación pero sin el mismo nivel de detalle que GD/BB/FG. | `FG_Brand_Kit_Operativo.md` tabla 1.3 lo lista. `FG_Archivo_Maestro_Visual_Canva.md` §9 lo desarrolla. | Bajo — el color ya está documentado. |
| H2 | **El sistema de spacing sigue base 4px.** No hay definición explícita de sistema de espaciado; los valores documentados (5-8%, 16-24px, 12-16px, 8-12px) son aproximaciones que caen cerca de múltiplos de 4. | Valores en §5.1 de `FG_Brand_Kit_Operativo.md`. | Bajo — ajustar valores a múltiplos exactos de 4 mejora consistencia sin cambiar la intención. |
| H3 | **Los grids de Figma deben ser de columnas (no filas).** La documentación describe márgenes relativos (5-8%) pero no define un grid de columnas. Propongo 12 col para landscape, 6 para portrait, 4 para vertical. | Estándar de industria para formatos sociales. | Bajo — si se prefiere otro grid, se cambia en Fase 1. |
| H4 | **No existe un quinto pilar.** El sistema se cierra en 4 pilares: GD, BB, FG, BP. | Documentación solo menciona 4. | Medio — si aparece un pilar 5, la estructura de variables con modos escala bien. |
| H5 | **Bebas Neue no necesita variante itálica ni bold.** Solo se usa en peso Regular (400) y siempre en MAYÚSCULAS. | `FG_Brand_Kit_Operativo.md` §2.1: solo Regular 400. | Bajo — si se necesita bold, se agrega un text style. |
| H6 | **El glow nunca se aplica directamente sobre texto legible, solo sobre elementos decorativos.** | Regla implícita en las reglas de efecto: "Glow permitido en Cian y Magenta" referido a líneas y nodos, no a texto. | Medio — si se quiere glow en títulos, documentar condiciones de legibilidad. |
| H7 | **La producción se hace por una sola persona (Farid) por ahora.** No hay equipo de diseño multi-persona. Esto simplifica las necesidades de branching, permisos y flujo de aprobación. | Contexto del proyecto. | Bajo — si se suma alguien, se necesita guía de onboarding (ya cubierta en Fase 4). |

---

## 9. CHECKLIST DE AUDITORÍA PRE-CONSTRUCCIÓN

Antes de abrir Figma y empezar a construir, verificar:

- [ ] Fuentes instaladas localmente: Bebas Neue, Space Grotesk (5 pesos), JetBrains Mono
- [ ] SVGs base disponibles: isotipo, wordmark dark, wordmark light, corchetes, nodo
- [ ] Decisión confirmada: ¿Behind the Policy `#4A6BFF` es definitivo?
- [ ] Decisión confirmada: ¿Se necesita un 5to pilar o el sistema se cierra en 4?
- [ ] Decisión confirmada: ¿Existe un monograma FG definitivo o es iteración?
- [ ] Cuenta Figma activa con acceso a variables (requiere plan Professional o superior para modos múltiples)
- [ ] Archivo Canva master visual referenciable durante construcción

---

## 10. RESUMEN DE PRIORIDADES INMEDIATAS

```
AHORA (Sesión 1):
├── Crear archivo Figma "FG — Sistema Visual Maestro"
├── Configurar página Cover
├── Crear collection fg-colors con los 8 valores
├── Crear collection fg-spacing con escala 4px
└── Crear los 14 text styles

SIGUIENTE (Sesión 2):
├── Crear effect styles (glow × 4 pilares + shadow + noise)
├── Importar SVGs como componentes (logo system)
├── Crear componentes Brand/* (línea, nodo, corchetes, pill, divisor)
└── Crear grids por formato

DESPUÉS (Sesión 3):
├── Crear componentes Block/* con auto layout
├── Template maestro Thumbnail YouTube (4 variantes)
└── Template maestro Carrusel IG (4 variantes)

LUEGO (Sesión 4):
├── Template Overlay vertical
├── Template Post cuadrado
├── Documentación + checklist
└── Guía Figma↔Canva
```

---

*Este documento es la guía de construcción. Toda decisión de diseño en Figma debe verificarse contra las foundations definidas aquí y contra `FG_Brand_Kit_Operativo.md` como fuente de verdad de identidad visual.*
