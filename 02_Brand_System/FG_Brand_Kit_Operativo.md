# Frecuencia Global — Brand Kit Operativo

**Versión:** 1.0
**Fecha:** 2026-03-24
**Estado:** Activo — Sprint 1
**Propósito:** Documento maestro que define todos los elementos visuales de la marca. Toda pieza de contenido debe construirse desde este sistema.

---

## 1. Paleta de Color

### 1.1 Colores Primarios

| Rol | Nombre | Hex | RGB | Uso principal |
|-----|--------|-----|-----|---------------|
| Base | Negro Profundo | `#0A0A0F` | 10, 10, 15 | Fondo principal de todas las piezas |
| Acento 1 | Cian Eléctrico | `#00E5FF` | 0, 229, 255 | Color insignia de la marca. Títulos, líneas, acentos, elementos de frecuencia |
| Acento 2 | Magenta Neón | `#FF00E5` | 255, 0, 229 | Segundo acento. Urgencia, alertas, contraste con cian, elementos de energía |

### 1.2 Colores Secundarios

| Rol | Nombre | Hex | RGB | Uso principal |
|-----|--------|-----|-----|---------------|
| Superficie | Grafito Azulado | `#1A1A2E` | 26, 26, 46 | Fondos secundarios, cards, zonas de texto, capas intermedias |
| Acento 3 | Verde Ácido | `#B8FF00` | 184, 255, 0 | Acento terciario. Datos, highlights puntuales, breaking news |
| Texto principal | Blanco Puro | `#FFFFFF` | 255, 255, 255 | Texto sobre fondos oscuros |
| Texto secundario | Gris Claro | `#A0A0B8` | 160, 160, 184 | Subtítulos, metadata, descripciones, fuentes |

### 1.3 Colores por Pilar

Cada pilar tiene un acento secundario asignado para diferenciación visual dentro del sistema unificado:

| Pilar | Color base del pilar | Hex | Aplicación |
|-------|---------------------|-----|------------|
| Geopolitik Drop | Cian Eléctrico | `#00E5FF` | Borde superior, acento en título, ícono de pilar |
| Bass & Borders | Magenta Neón | `#FF00E5` | Borde superior, acento en título, ícono de pilar |
| Frecuencia Global | Verde Ácido | `#B8FF00` | Borde superior, acento en título, ícono de pilar |
| Behind the Policy | Azul Profundo | `#4A6BFF` | Borde superior, acento en título, ícono de pilar |

### 1.4 Reglas de Color

- **Fondo siempre oscuro.** `#0A0A0F` para piezas principales, `#1A1A2E` para zonas internas o cards.
- **Nunca usar Cian y Magenta al mismo peso visual.** Uno domina, el otro acentúa. Proporción recomendada: 70/30.
- **Verde Ácido solo como punteo.** Máximo 10-15% de la pieza. No usar en bloques grandes.
- **Texto siempre en Blanco o Gris Claro** sobre fondos oscuros. Nunca texto oscuro sobre fondo oscuro.
- **Glow permitido** en Cian y Magenta. Efecto de resplandor exterior (outer glow) a 20-40% de opacidad del color base.
- **Gradientes permitidos:** Cian → Magenta (diagonal o radial), Negro → Grafito (vertical). No más de 2 colores por gradiente.
- **Contraste mínimo:** Ratio 4.5:1 para texto legible (WCAG AA). Todos los colores de texto sobre `#0A0A0F` cumplen.

---

## 2. Tipografía

### 2.1 Sistema Tipográfico

| Rol | Fuente | Peso | Tamaño referencia | Uso |
|-----|--------|------|-------------------|-----|
| Display / Títulos | **Bebas Neue** | Regular (400) | 48-120px | Títulos principales en thumbnails, carruseles, portadas. Todo en MAYÚSCULAS. |
| Headlines / Subtítulos | **Space Grotesk** | Bold (700) | 24-36px | Subtítulos, nombres de secciones, labels importantes |
| Body / Cuerpo | **Space Grotesk** | Regular (400) | 14-18px | Texto corrido, descripciones, párrafos informativos |
| Accent / Data | **JetBrains Mono** | Regular (400) | 12-16px | Datos, fechas, códigos, metadata, fuentes, tags |
| Micro | **Space Grotesk** | Medium (500) | 10-12px | Créditos, disclaimers, watermarks, pies de imagen |

### 2.2 Disponibilidad

- **Bebas Neue** → Google Fonts (gratis) + Canva nativo
- **Space Grotesk** → Google Fonts (gratis) + Canva nativo
- **JetBrains Mono** → Google Fonts (gratis) + se puede subir a Canva

### 2.3 Reglas Tipográficas

- **Bebas Neue siempre en MAYÚSCULAS.** Es una fuente diseñada para display. No usar en minúsculas ni para texto largo.
- **Máximo 2 tamaños de Bebas Neue por pieza.** Un tamaño para el título principal, otro para subtítulo si aplica.
- **Space Grotesk para todo lo legible.** Cuerpo, subtítulos, descripciones, CTAs.
- **JetBrains Mono solo para datos.** Fechas, locaciones, fuentes, etiquetas técnicas. Nunca para títulos.
- **Interlineado:**
  - Display (Bebas Neue): 90-100% del tamaño de fuente (tight)
  - Body (Space Grotesk): 140-160% del tamaño de fuente
  - Data (JetBrains Mono): 120-130%
- **Tracking (espaciado entre letras):**
  - Bebas Neue: +2% a +5% (ligeramente abierto)
  - Space Grotesk: 0% (default)
  - JetBrains Mono: 0% (default)

---

## 3. Componentes Visuales

### 3.1 Logotipo / Wordmark

**FRECUENCIA GLOBAL** en Bebas Neue, tracking +3%, color Blanco sobre fondo oscuro.

Variantes:
| Variante | Descripción | Uso |
|----------|-------------|-----|
| Wordmark completo | "FRECUENCIA GLOBAL" en una línea | Header de videos, banners, portadas |
| Wordmark apilado | "FRECUENCIA" arriba, "GLOBAL" abajo | Thumbnails, espacios cuadrados, perfil |
| Wordmark + línea de frecuencia | Wordmark con línea cian debajo (waveform) | Versión principal para branding fuerte |
| Isotipo solo | Ícono de frecuencia/onda + nodo | Favicon, marca de agua, avatar |

### 3.2 Línea de Frecuencia (Elemento Insignia)

Línea horizontal estilizada como waveform de audio. Es el elemento visual más reconocible de la marca.

- **Forma:** Línea con picos de frecuencia tipo ecualizador o onda de audio
- **Color:** Cian Eléctrico `#00E5FF` con glow al 30%
- **Variantes:** Horizontal (debajo de wordmark), vertical (lateral en carruseles), curva (decorativa)
- **Grosor:** 2-4px para línea base, picos variables
- **Aplicación obligatoria:** Presente en toda pieza de marca. Puede ser sutil (borde inferior) o protagonista (fondo).

### 3.3 Nodo de Señal

Círculo pequeño con glow que representa un punto de transmisión/señal.

- **Tamaño:** 8-16px diámetro
- **Color:** Cian o Magenta según pilar
- **Glow:** Outer glow al 40% del color, radio 2x el tamaño del nodo
- **Uso:** Punteo en listas, indicador de sección activa, elementos decorativos en esquinas

### 3.4 Corchetes de Frecuencia

Corchetes `[ ]` estilizados como contenedores de información clave.

- **Tipografía:** JetBrains Mono o Bebas Neue según contexto
- **Color:** Cian Eléctrico
- **Contenido entre corchetes:** Tags de pilar, fechas, locaciones, clasificaciones
- **Ejemplo:** `[GEOPOLITIK DROP]` `[BREAKING]` `[2026.03.24]` `[MEDIO ORIENTE]`

### 3.5 Grid / Rejilla de Frecuencia

Grid sutil de líneas finas como fondo texturizado.

- **Color:** Blanco al 3-5% de opacidad sobre negro
- **Patrón:** Cuadrícula regular o perspectiva
- **Uso:** Fondo de thumbnails, zonas de texto en carruseles, backgrounds de video
- **Nunca superponer grid sobre fotografías.** Solo sobre fondos sólidos oscuros.

### 3.6 Fondos Base

| Tipo | Composición | Uso |
|------|-------------|-----|
| Sólido negro | `#0A0A0F` plano | Default para todo |
| Grafito con grid | `#0A0A0F` + grid al 4% | Thumbnails, carruseles |
| Gradiente profundo | `#0A0A0F` → `#1A1A2E` (vertical) | Cards, slides |
| Gradiente neón | `#0A0A0F` con halo cian/magenta en esquina | Piezas destacadas, breaking news |
| Fotografía tratada | Foto desaturada al 70% + overlay negro al 60% | Thumbnails temáticos con foto de fondo |

---

## 4. Jerarquía Visual (Layout System)

### 4.1 Thumbnail YouTube (1280 × 720 px)

```
┌─────────────────────────────────────────────┐
│  [TAG PILAR]                    ISOTIPO  FG │  ← Zona superior: tag + marca
│                                              │
│     TÍTULO PRINCIPAL                         │  ← Bebas Neue, 64-80px, Blanco
│     EN 2-3 LÍNEAS MÁXIMO                     │     Puede tener palabra en Cian
│                                              │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                   │  ← Línea de frecuencia
│  Subtítulo contextual · 2026                 │  ← Space Grotesk, Gris Claro
└─────────────────────────────────────────────┘
   Fondo: negro + grid / foto tratada
```

**Reglas del thumbnail:**
- Máximo 8 palabras en título principal
- Una palabra clave en color acento del pilar (Cian, Magenta, Verde, Azul)
- Rostro o imagen solo si aporta contexto inmediato
- Tag de pilar en corchetes, esquina superior izquierda
- Logo FG pequeño, esquina superior derecha
- Línea de frecuencia como separador entre título y subtítulo

### 4.2 Carrusel Instagram (1080 × 1350 px)

**Portada (Slide 1):**
```
┌──────────────────────┐
│  [TAG PILAR]         │
│                      │
│  TÍTULO              │  ← Bebas Neue, 48-56px
│  PRINCIPAL           │
│                      │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔     │  ← Línea de frecuencia
│  Subtítulo breve     │
│                      │
│  FRECUENCIA GLOBAL   │  ← Wordmark pequeño
└──────────────────────┘
```

**Slides interiores (2-9):**
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

**Cierre (Último slide):**
```
┌──────────────────────┐
│                      │
│  FRECUENCIA          │  ← Wordmark apilado
│  GLOBAL              │
│                      │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔     │
│  @frecuenciaglobal   │  ← Handle
│  Síguenos · Comparte │  ← CTA
│                      │
└──────────────────────┘
```

### 4.3 TikTok / Reels (1080 × 1920 px)

- Título overlay: Bebas Neue, 40-48px, Blanco con sombra
- Tag de pilar: Corchetes Cian, esquina superior
- Lower third: Barra de `#1A1A2E` al 85% opacidad + texto Space Grotesk
- Línea de frecuencia: Animada debajo del título (en video)
- Logo FG: Esquina superior derecha, pequeño, con glow sutil

---

## 5. Reglas de Composición

### 5.1 Espaciado

- **Margen exterior:** 5-8% del ancho total de la pieza
- **Padding interno de cards:** 16-24px
- **Espacio entre título y subtítulo:** 12-16px
- **Espacio entre línea de frecuencia y texto adyacente:** 8-12px

### 5.2 Alineación

- **Texto principal:** Alineado a la izquierda (nunca centrado en thumbnails)
- **Carruseles portada:** Centrado o izquierda según diseño
- **Carruseles interiores:** Siempre alineado a la izquierda
- **Tags y metadata:** Alineados a la izquierda, zona superior

### 5.3 Efectos Permitidos

| Efecto | Parámetros | Dónde usarlo |
|--------|-----------|--------------|
| Outer Glow | 20-40% opacidad, radio 8-20px | Títulos cian/magenta, nodos, línea de frecuencia |
| Drop Shadow texto | Negro 80%, offset 2px, blur 4px | Texto sobre foto o gradiente complejo |
| Noise/Grain | 3-6% intensidad, monocromático | Fondos sólidos para textura sutil |
| Glitch offset | 2-4px desplazamiento en R/G/B | Solo en piezas de breaking news o urgencia |
| Scan lines | Líneas horizontales al 2-3% opacidad | Decorativo en fondos, opcional |

### 5.4 Efectos Prohibidos

- Sin bordes redondeados excesivos (máx 4px en cards, 0 en thumbnails)
- Sin sombras tipo "drop shadow" corporativo
- Sin degradados pastel o colores cálidos
- Sin texturas de papel, madera, o materiales orgánicos
- Sin emojis en piezas gráficas (sí en copy de redes)
- Sin más de 3 colores de acento por pieza

---

## 6. Nomenclatura de Archivos Visuales

### 6.1 Estructura

```
FG_[PILAR]_[FORMATO]_[TEMA]_[VERSION].[ext]
```

### 6.2 Códigos

**Pilares:**
- `GD` = Geopolitik Drop
- `BB` = Bass & Borders
- `FG` = Frecuencia Global (formato rápido)
- `BP` = Behind the Policy
- `MK` = Marca (assets generales, no de pilar)

**Formatos:**
- `THB` = Thumbnail YouTube
- `CAR` = Carrusel Instagram
- `STR` = Story / Reel / TikTok
- `BNR` = Banner
- `POST` = Post individual (cuadrado)
- `DOC` = Documento / Infografía

**Ejemplos:**
```
FG_GD_THB_Crisis-Taiwan_v1.png
FG_BB_CAR_Techno-Berlin-Muro_v2.png
FG_FG_STR_Resumen-Semanal-W12_v1.mp4
FG_MK_BNR_YouTube-Header_v1.png
```

---

## 7. Aplicación por Plataforma

| Plataforma | Foto perfil | Banner/Header | Estilo piezas |
|------------|------------|---------------|---------------|
| YouTube | Isotipo FG sobre negro | Banner 2560×1440 con wordmark + línea frecuencia | Thumbnails con sistema completo |
| Instagram | Isotipo FG sobre negro | N/A (bio optimizada) | Carruseles + Reels con sistema |
| TikTok | Isotipo FG sobre negro | N/A | Overlays con tag pilar + lower third |
| X/Twitter | Isotipo FG sobre negro | Banner 1500×500 con wordmark | Imágenes adjuntas con sistema |
| LinkedIn | Isotipo FG sobre negro | Banner profesional, más sobrio | Posts con estilo Behind the Policy |

---

## 8. Checklist de Implementación

### Fase A — Assets base (hacer primero)
- [ ] Configurar brand kit en Canva (colores hex + tipografías)
- [ ] Crear isotipo/ícono de Frecuencia Global
- [ ] Crear wordmark en variantes (completo, apilado, con línea)
- [ ] Crear elemento "línea de frecuencia" como componente reutilizable
- [ ] Crear set de fondos base (5 variantes)

### Fase B — Templates madre
- [ ] Template thumbnail YouTube (con variantes por pilar)
- [ ] Template carrusel Instagram portada
- [ ] Template carrusel Instagram slide interior
- [ ] Template carrusel Instagram cierre
- [ ] Template overlay TikTok/Reels

### Fase C — Aplicación a plataformas
- [ ] Foto de perfil unificada
- [ ] Banner YouTube
- [ ] Banner X/Twitter
- [ ] Banner LinkedIn
- [ ] Highlights de Instagram (íconos)

### Fase D — Documentación
- [ ] Este documento revisado y aprobado por Farid
- [ ] Archivo maestro Canva organizado con páginas por tipo
- [ ] Guía rápida de uso (1 página resumen para referencia rápida)
- [x] Paquete operativo LinkedIn creado (`LINKEDIN_Asset_Specs.md`, `LINKEDIN_Test_Protocol.md`, `LINKEDIN_Setup_Checklist.md`, `LINKEDIN_Status_Report.md`)

---

## 9. Referencias de Estilo

**Universo visual de referencia** (para mantener coherencia en dirección de arte):

- Estética de festivales EDM: Tomorrowland, Ultra, Dreamstate (paletas neón sobre negro)
- Motion graphics de VJ sets: geometría, glitch, waveforms
- Diseño editorial de medios como Vox, VICE, The Economist (estructura informativa clara)
- UI de apps de música: Spotify dark mode, Serum synthesizer, Ableton
- Infografías geopolíticas: mapas con data overlay, estilo CSIS o Stratfor pero con energía visual

**El balance es:** la energía y estética de un flyer de festival electrónico + la claridad y credibilidad de un medio editorial serio.

---

*Documento generado: 2026-03-24*
*Actualización: 2026-04-01 — hardening técnico de LinkedIn documentado*
*Siguiente acción: Ejecutar Fase C para LinkedIn (logo + banner + validación en plataforma)*
