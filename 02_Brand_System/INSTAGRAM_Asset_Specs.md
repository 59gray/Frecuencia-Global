# INSTAGRAM — Asset Specs

**Sistema:** Frecuencia Global  
**Versión:** 1.0  
**Fecha:** 2026-04-01  
**Estado:** Activo

---

## 1. PERFIL

| Asset | Especificación | Estado |
|-------|---------------|--------|
| **Foto de perfil** | 320×320 px mínimo (se muestra ~110px en feed), PNG, fondo `#0A0A0F`, isotipo FG alineado al sistema TikTok/X | ✅ Rediseñado — `06_Assets/FG_IG_Avatar_Profile_v2.png`, validar recorte circular |
| **Display name** | `Frecuencia Global` | ⚠️ Validar en plataforma |
| **Username** | `@globalfrequency.es` | ✅ Confirmado |
| **Bio** | Ver sección 2 | ⚠️ Requiere aprobación |
| **Link** | `https://frecuenciaglobal.vercel.app` | ⚠️ Pendiente deploy |
| **Category** | Education / News & Media | ⚠️ Requiere configuración |

---

## 2. BIO PROPUESTA

```
Análisis internacional con pulso electrónico ⚡
Geopolítica × música electrónica × datos
🌐 frecuenciaglobal.vercel.app
```

**Alternativa corta:**
```
Geopolítica con pulso electrónico ⚡
Análisis en formato de frecuencia
🔗 Link en bio
```

> **REQUIERE APROBACIÓN** — La bio es decisión editorial (Maya/Farid).

### Criterios técnicos de bio
- Máximo 150 caracteres
- Primera línea = tagline de marca (idéntica cross-platform)
- Emoji funcional, no decorativo (máx 2-3)
- No hashtags en bio (ocupan espacio sin valor)
- CTA implícito en link (no "click aquí")

---

## 3. FORMATOS — DIMENSIONES Y SPECS

### 3.1 Post cuadrado (1:1)

| Parámetro | Valor |
|-----------|-------|
| **Resolución** | 1080 × 1080 px |
| **Aspect ratio** | 1:1 |
| **DPI** | 72 |
| **Formato archivo** | PNG (gráficos) / JPEG (fotos, ≥85% quality) |
| **Color space** | sRGB |
| **Uso** | Posts individuales, citas, data points |
| **Safe zone texto** | Margen 60px por lado (contenido en 960×960) |

### 3.2 Post vertical / Carrusel (4:5)

| Parámetro | Valor |
|-----------|-------|
| **Resolución** | 1080 × 1350 px |
| **Aspect ratio** | 4:5 |
| **DPI** | 72 |
| **Formato archivo** | PNG |
| **Máx slides carrusel** | 20 (recomendado: 5-10) |
| **Uso** | Carruseles educativos, análisis por slides |
| **Safe zone texto** | Margen 60px lateral, 80px sup/inf |
| **Grid preview** | Centro cuadrado visible (1080×1080 de la zona central) |

### 3.3 Story / Reel (9:16)

| Parámetro | Valor |
|-----------|-------|
| **Resolución** | 1080 × 1920 px |
| **Aspect ratio** | 9:16 |
| **DPI** | 72 |
| **Formato archivo** | MP4 (video) / PNG (story estática) |
| **Video codec** | H.264 |
| **Video bitrate** | ≥6 Mbps |
| **FPS** | 30 |
| **Audio** | AAC, 128 kbps mínimo |
| **Duración Reel** | 15–90 s (óptimo: 30–60 s) |
| **Duración Story** | Máx 60 s por segmento |

### 3.4 Reel cover visible en grid

| Parámetro | Valor |
|-----------|-------|
| **Resolución cover** | 1080 × 1920 px (se sube completo) |
| **Zona visible en grid** | Centro cuadrado 1080×1080 (y: 420–1500) |
| **Safe zone título** | Dentro de la zona central 900×900 |
| **Formato** | JPEG o PNG |
| **Consejo** | Diseñar considerando que solo se ve ~56% central en el feed |

---

## 4. SAFE ZONES — STORIES / REELS

```
┌────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← TOP SAFE: 250 px
│ ░░░ Username, hora,  ░░░░░│     (barra de estado, nombre,
│ ░░░ stickers nativos ░░░░░│      controles de story)
├────────────────────────────┤
│                            │
│                            │
│    ZONA SEGURA PARA        │  ← CONTENT: y=250 → y=1620
│    CONTENIDO PRINCIPAL     │     ~1370 px de alto útil
│                            │
│                       ░░░░░│  ← RIGHT (Reels): 100 px
│                       ░like│     iconos interacción
│                       ░comm│     y=900 → y=1400
│                       ░save│
│                       ░░░░░│
│                            │
├────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← BOTTOM SAFE: 300 px
│ ░░░ Caption, controles ░░░│     (caption, botones,
│ ░░░ responder, nav    ░░░░│      barra de navegación)
└────────────────────────────┘
   60 px margen lateral mínimo
```

| Zona | Posición | Tamaño | Restricción |
|------|----------|--------|-------------|
| Top safe | y: 0–250 | 1080 × 250 | Sin texto crítico |
| Bottom safe | y: 1620–1920 | 1080 × 300 | Sin texto crítico |
| Right icons (Reels) | x: 980–1080, y: 900–1400 | 100 × 500 | Sin elementos visuales |
| Content safe | y: 250–1620, x: 60–980 | 920 × 1370 | Zona principal |
| Lower third | y: 1460–1580 | 860 × 120 | Barra branded (opcional) |

---

## 5. HIGHLIGHT COVERS

Covers para categorías de stories highlights.

| Parámetro | Valor |
|-----------|-------|
| **Resolución** | 1080 × 1920 px (se recorta a círculo central) |
| **Zona visible** | Círculo central ~640px diámetro |
| **Formato** | PNG |
| **Estilo** | Fondo `#0A0A0F`, ícono minimalista en color del pilar, nombre debajo |
| **Tipografía** | JetBrains Mono (si incluye texto) |

### Highlights definidos

| Highlight | Nombre | Ícono/Color | Asset existente |
|-----------|--------|-------------|-----------------|
| Series | `SERIES` | Cian `#00E5FF` | `06_Assets/FG_IG_Highlight_Series_v2.png` ✅ |
| News | `NEWS` | Verde `#B8FF00` | `06_Assets/FG_IG_Highlight_News_v2.png` ✅ |
| Policy | `POLICY` | Azul `#4A6BFF` | `06_Assets/FG_IG_Highlight_Policy_v2.png` ✅ |
| Borders | `BORDERS` | Magenta `#FF00E5` | `06_Assets/FG_IG_Highlight_Borders_v2.png` ✅ |
| Maps | `MAPS` | Cian `#00E5FF` | `06_Assets/FG_IG_Highlight_Maps_v2.png` ✅ |
| About | `ABOUT` | Blanco `#FFFFFF` | `06_Assets/FG_IG_Highlight_About_v2.png` ✅ |

> Los 6 covers ya existen en `Frecuencia_Global_Activos_Canva_v3/`. Validar recorte circular en Instagram.

---

## 6. CARRUSEL — ESTRUCTURA VISUAL

### Portada (Slide 1)

```
┌──────────────────────┐
│  [TAG PILAR]         │  ← JetBrains Mono 14px, color pilar
│                      │
│  TÍTULO              │  ← Bebas Neue, 48-56px, blanco
│  PRINCIPAL           │
│                      │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔     │  ← Línea de frecuencia, color pilar
│  Subtítulo breve     │  ← Space Grotesk 16px, gris
│                      │
│  FRECUENCIA GLOBAL   │  ← Wordmark pequeño
└──────────────────────┘
```

### Slides interiores (2-N)

```
┌──────────────────────┐
│  Número / Total      │  ← JetBrains Mono, Cian
│                      │
│  Headline del        │  ← Space Grotesk Bold, 24px
│  punto clave         │
│                      │
│  Texto explicativo   │  ← Space Grotesk Regular, 16px
│  de 3-4 líneas       │
│  máximo por slide    │
│                      │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔     │
│  [FUENTE]            │  ← JetBrains Mono, Gris Claro
└──────────────────────┘
```

### Cierre (Último slide)

```
┌──────────────────────┐
│                      │
│  FRECUENCIA          │  ← Wordmark apilado
│  GLOBAL              │
│                      │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔     │
│  @globalfrequency.es │  ← Handle
│  Síguenos · Comparte │  ← CTA
│                      │
└──────────────────────┘
```

### Templates existentes (v4)

| Template | Archivo | Estado |
|----------|---------|--------|
| Portada Geopolitik Drop | `FG_Carousel_GeopolitikDrop_Cover_v1.png` | ✅ |
| Interior Geopolitik Drop | `FG_Carousel_GeopolitikDrop_Internal_v1.png` | ✅ |
| Portada Bass & Borders | `FG_Carousel_BassAndBorders_Cover_v1.png` | ✅ |
| Interior Bass & Borders | `FG_Carousel_BassAndBorders_Internal_v1.png` | ✅ |
| Portada Frecuencia Global | `FG_Carousel_FrecuenciaGlobal_Cover_v1.png` | ✅ |
| Interior Frecuencia Global | `FG_Carousel_FrecuenciaGlobal_Internal_v1.png` | ✅ |
| Portada Behind the Policy | `FG_Carousel_BehindThePolicy_Cover_v1.png` | ✅ |
| Interior Behind the Policy | `FG_Carousel_BehindThePolicy_Internal_v1.png` | ✅ |

> Templates en `Frecuencia_Global_Activos_Canva_v4/`. Falta template de slide de cierre.

---

## 7. REEL OVERLAY — ESPECIFICACIONES

Capa para identidad de marca sobre Reels.

| Elemento | Spec | Posición |
|----------|------|----------|
| **Pill de pilar** | JetBrains Mono 14px, color del pilar, `[PILAR]` | Superior izquierda (x:60, y:270) |
| **Isotipo FG** | 32px, blanco, glow cian sutil | Superior derecha (x:960, y:270) |
| **Título overlay** | Bebas Neue 40-48px, blanco, drop shadow negro 80% | Centro (y:~900) |
| **Línea de frecuencia** | Color del pilar, 2-4px | Debajo del título |
| **Lower third barra** | `#1A1A2E` al 85% opacidad, 120px alto | x:60, y:1460, w:860 |
| **Texto lower third** | Space Grotesk 16px, blanco | Dentro de la barra |

### Overlays existentes (v2)

| Asset | Archivo | Estado |
|-------|---------|--------|
| Overlay Full | `FG_Reels_Overlay_Full_v1.png` | ✅ |
| Overlay Minimal | `FG_Reels_Overlay_Minimal_v1.png` | ✅ |
| Overlay Guide | `FG_Reels_Overlay_Guide_v1.png` | ✅ |

### Reel cover

| Asset | Archivo | Estado |
|-------|---------|--------|
| Reel Cover Master | `FG_ReelCover_Master_v1.png` | ✅ |
| Reel Cover Guide | `FG_ReelCover_Master_Guide_v1.png` | ✅ |

> Overlays y covers en `Frecuencia_Global_Activos_Canva_v2/` y `_v3/`.

---

## 8. FONDOS Y ELEMENTOS REUTILIZABLES

### Fondos (v5)

| Fondo | Uso recomendado | Archivo |
|-------|----------------|---------|
| DarkSolid | Default, slides interiores | `FG_BG_Feed_DarkSolid_01.png` |
| DarkGrid | Texturas, covers | `FG_BG_Feed_DarkGrid_02.png` |
| CyanField | Geopolitik Drop | `FG_BG_Feed_CyanField_03.png` |
| PolicyField | Behind the Policy | `FG_BG_Feed_Policy_04.png` |
| ModularFrame | Layouts complejos | `FG_BG_Feed_ModularFrame_05.png` |
| NewsField | Frecuencia Global | `FG_BG_Feed_NewsField_06.png` |
| Reel DarkBase | Fondo base para Reels | `FG_BG_Reel_DarkBase_07.png` |
| Reel Policy | Reels Behind the Policy | `FG_BG_Reel_Policy_08.png` |

### Elementos modulares (v5)

| Elemento | Uso | Archivo |
|----------|-----|---------|
| Línea cian | Separador | `FG_Element_Line_Cyan_Long_01.png` |
| Dots divider | Separador secundario | `FG_Element_Divider_Dots_Cyan_02.png` |
| Nodo cian | Gráficos de red | `FG_Element_Node_Cyan_03.png` |
| Corchetes cian | Tags | `FG_Element_Brackets_Cyan_04.png` |
| Corchetes policy | Tags BP | `FG_Element_Brackets_Policy_05.png` |
| Metadata bar cian | Barra inferior | `FG_Element_MetadataBar_Dark_Cyan_06.png` |
| Metadata bar neutral | Barra inferior | `FG_Element_MetadataBar_Dark_Neutral_07.png` |
| Keyword pill cian | Etiquetas | `FG_Element_KeywordPill_Cyan_08.png` |
| Keyword pill magenta | Etiquetas BB | `FG_Element_KeywordPill_Magenta_09.png` |
| Keyword pill acid | Etiquetas FG | `FG_Element_KeywordPill_Acid_10.png` |
| Keyword pill policy | Etiquetas BP | `FG_Element_KeywordPill_Policy_11.png` |
| Photo frame cian | Marco para fotos | `FG_Element_PhotoFrame_Cyan_12.png` |
| Quote frame | Marco para citas | `FG_Element_QuoteFrame_Cyan_13.png` |
| Map frame | Marco para mapas | `FG_Element_MapFrame_Cyan_14.png` |
| Photo frame policy | Marco BP | `FG_Element_PhotoFrame_Policy_15.png` |

---

## 9. MOCKUPS DE REFERENCIA

| Mockup | Archivo | Ubicación |
|--------|---------|-----------|
| Instagram Profile | `FG_Mockup_Instagram_Profile_v1.png` | `Activos_Canva_v6_Mockups/` |
| Reels + Carrusel | `FG_Mockup_Reels_Carousel_v1.png` | `Activos_Canva_v6_Mockups/` |
| Review Board | `FG_Mockup_System_Review_Board_v1.png` | `Activos_Canva_v6_Mockups/` |

---

## 10. ASSETS PENDIENTES — LISTA DE PRODUCCIÓN

| # | Asset | Spec | Herramienta | Prioridad |
|---|-------|------|-------------|-----------|
| 1 | Foto de perfil Instagram | 400×400 PNG → recorte circular, isotipo alineado con TikTok/X | Rediseñado (`06_Assets/FG_IG_Avatar_Profile_v2.png`), validar recorte | P0 |
| 2 | Slide de cierre carrusel | 1080×1350 PNG, wordmark + handle + CTA | Canva | P1 |
| 3 | Template de Story frame | 1080×1920 PNG, branded, zonas marcadas | Canva | P1 |
| 4 | Post cuadrado base (1:1) | 1080×1080 PNG | Canva | P2 |
| 5 | Cover de Reel por pilar (4) | 1080×1920 PNG (variantes del master) | Canva | P2 |

---

## 11. CONSISTENCIA CROSS-PLATFORM

| Plataforma | Handle | Profile pic | Bio tagline | Verificado |
|------------|--------|-------------|-------------|------------|
| Instagram | `@globalfrequency.es` | Isotipo FG 400×400 | "Análisis internacional con pulso electrónico" | ⚠️ Validar |
| YouTube | `@FrecuenciaGlobal` | Isotipo FG | Misma línea | ✅ |
| TikTok | `@frecuenciaglobal` | Isotipo FG | Misma línea | ⚠️ Pendiente |
| X | `@frec_global` | Isotipo FG | Misma línea | ✅ |
| LinkedIn | frecuencia-global | Isotipo FG | Misma línea | ✅ |

> **Nota:** Los handles difieren entre plataformas por disponibilidad. El display name debe ser siempre **"Frecuencia Global"** y la primera línea de bio siempre el tagline oficial.

---

## 12. NOMENCLATURA DE ARCHIVOS

```
FG_IG_[FORMATO]_[PILAR]_[TEMA]_[VERSION].[ext]
```

| Código formato | Significado |
|---------------|-------------|
| `CAR` | Carrusel (slide) |
| `POST` | Post cuadrado |
| `REEL` | Reel / video vertical |
| `STR` | Story |
| `HL` | Highlight cover |
| `COV` | Cover de reel |
| `OVR` | Overlay |

**Ejemplos:**
```
FG_IG_CAR_GD_CablesSubmarinos_v1_01.png  (slide 1 de carrusel)
FG_IG_REEL_BB_TechnoBerlin_v1.mp4
FG_IG_POST_FG_ResumenW14_v1.png
FG_IG_STR_GD_Breaking_v1.png
FG_IG_HL_Series_v1.png
FG_IG_COV_GD_CablesSubmarinos_v1.png
```
