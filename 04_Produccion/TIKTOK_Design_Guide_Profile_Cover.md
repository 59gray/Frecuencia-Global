# Guía de Diseño — TikTok: Foto de Perfil + Cover Template

**Proyecto:** Frecuencia Global  
**Versión:** 1.0  
**Fecha:** 2026-04-01  
**Herramienta de producción:** Canva  
**Estado:** Listo para ejecución

---

## A) ESPECIFICACIÓN VISUAL EJECUTABLE

### PIEZA 1 — Foto de Perfil (200 × 200 px)

```
┌──────────────────────┐
│                      │
│    ┌──────────┐      │
│    │          │      │  ← Isotipo FG centrado
│    │  ISOTIPO │      │     dentro de círculo seguro
│    │    FG    │      │
│    │          │      │
│    └──────────┘      │
│         ○            │  ← Glow cian sutil (30% opacidad)
│                      │
└──────────────────────┘
   Fondo: #0A0A0F sólido
```

| Parámetro | Valor |
|-----------|-------|
| **Canvas** | 200 × 200 px |
| **Formato de exportación** | PNG (transparencia no necesaria) |
| **DPI** | 72 |
| **Fondo** | `#0A0A0F` sólido, sin gradiente |
| **Elemento central** | Isotipo FG (onda + nodo) |
| **Tamaño del isotipo** | 120 × 120 px máximo (centrado) |
| **Color del isotipo** | `#FFFFFF` principal |
| **Glow** | `#00E5FF` al 30% opacidad, blur 8-10px, detrás del isotipo |
| **Márgenes de seguridad** | 20 px por lado (TikTok recorta en círculo ~170px diámetro visible) |
| **Zona de recorte circular** | Radio 85px desde el centro — todo elemento clave dentro de este radio |

**Reglas de composición:**
- El isotipo debe verse completo dentro del crop circular de TikTok
- No colocar texto — a 200px es ilegible
- El glow NO debe competir con el isotipo — es ambiental
- Contraste mínimo del isotipo blanco sobre negro: ratio >15:1 (cumple WCAG AAA)

---

### PIEZA 2 — Cover Template (1080 × 1920 px)

```
┌────────────────────────────────┐
│  ░░░░░░░ TOP SAFE 200px ░░░░░░│  ← NO texto aquí
│                                │
│  [GEOPOLITIK DROP]     FG ●   │  ← y:220 | Pill pilar + isotipo
│                                │
│                                │
│                                │
│                                │
│      TÍTULO PRINCIPAL          │  ← Bebas Neue 56px, blanco
│      EN MAYÚSCULAS             │     Máx 5 palabras / 2 líneas
│      ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔          │  ← Frequency line (color pilar)
│      Subtítulo breve           │  ← Space Grotesk 24px, #A0A0B8
│                                │
│                                │
│                           ░░░░│  ← RIGHT SAFE 100px (iconos TikTok)
│                           ░░░░│
│                                │
│  ┌──────────────────────┐      │  ← Lower third barra
│  │ Dato clave · 2026    │      │     #1A1A2E @ 85% opacidad
│  └──────────────────────┘      │     y:1480, w:800, h:120
│  ░░░░░ BOTTOM SAFE 280px ░░░░░│  ← NO texto aquí
└────────────────────────────────┘
   Márgenes laterales: 60px
```

| Parámetro | Valor |
|-----------|-------|
| **Canvas** | 1080 × 1920 px |
| **Formato de exportación** | PNG o JPEG (calidad 95%+) |
| **DPI** | 72 |
| **Fondo base** | `#0A0A0F` + grid sutil (blanco al 4% opacidad) |
| **Zona segura de contenido** | x: 60–980, y: 200–1640 (920 × 1440 px útiles) |

#### Jerarquía tipográfica del cover:

| Nivel | Fuente | Tamaño | Color | Posición Y aproximada |
|-------|--------|--------|-------|----------------------|
| Pill de pilar | JetBrains Mono | 14px | Color del pilar | y: 220 |
| Isotipo FG | — | 32px | `#FFFFFF` + glow `#00E5FF` | y: 220 (derecha, x: 960) |
| Título principal | Bebas Neue UPPERCASE | 52–56px | `#FFFFFF`, 1 palabra en color pilar | y: ~800–950 (centro visual) |
| Frequency line | — | 2–4px grosor, ~400px largo | Color del pilar | debajo del título, gap 8px |
| Subtítulo | Space Grotesk Regular | 22–24px | `#A0A0B8` | debajo de frequency line, gap 12px |
| Lower third | Space Grotesk Regular | 16px | `#FFFFFF` | y: 1480–1600 |
| Dato/metadata | JetBrains Mono | 14px | `#A0A0B8` | dentro del lower third |

#### Márgenes y espaciado:

| Zona | Valor |
|------|-------|
| Margen lateral | 60 px |
| Margen superior (zona segura) | 200 px |
| Margen inferior (zona segura) | 280 px |
| Padding interno lower third | 16 px |
| Gap título → frequency line | 8 px |
| Gap frequency line → subtítulo | 12 px |
| Zona de iconos TikTok (derecha) | x > 980 — no colocar elementos |

---

## B) VARIANTES DE ESTILO (3 por pieza = 6 total)

### FOTO DE PERFIL — 3 Variantes

#### Variante P1: Minimal Puro
- **Descripción:** Isotipo FG blanco sobre negro plano, sin efectos
- **Glow:** Ninguno
- **Fondo:** `#0A0A0F` sólido
- **Rationale:** Máxima legibilidad a tamaño pequeño. El isotipo habla solo. Funciona en cualquier contexto visual (feed oscuro o claro)

#### Variante P2: Glow Cian Sutil
- **Descripción:** Isotipo FG blanco con resplandor cian detrás
- **Glow:** `#00E5FF` al 30%, blur 10px, detrás del isotipo
- **Fondo:** `#0A0A0F` sólido
- **Rationale:** Agrega el ADN electrónico sin saturar. Consistente con el tratamiento de la frequency line. **Recomendada como opción principal** por alineación con el sistema visual

#### Variante P3: Nodo Dual
- **Descripción:** Isotipo FG blanco con dos puntos de glow: cian (dominante, arriba-izquierda) + magenta (sutil, abajo-derecha)
- **Glow cian:** `#00E5FF` al 30%, blur 10px
- **Glow magenta:** `#FF00E5` al 15%, blur 8px
- **Fondo:** `#0A0A0F` sólido
- **Rationale:** Refuerza la dualidad cromática de la marca. Mayor memorabilidad visual, pero verificar que no se pierda definición a 200px

---

### COVER TEMPLATE — 3 Variantes

#### Variante C1: Grid Editorial
- **Fondo:** `#0A0A0F` + grid de frecuencia (líneas blancas al 4% opacidad)
- **Composición:** Título centrado vertical (y: ~850), pill arriba-izquierda, lower third activo
- **Acentos:** Solo color del pilar (una tinta de acento)
- **Rationale:** Aspecto sobrio, periodístico-institucional. Máxima legibilidad. Ideal para temas de análisis (Geopolitik Drop, Behind the Policy)

#### Variante C2: Gradiente Neón
- **Fondo:** `#0A0A0F` con halo de color pilar en esquina inferior-izquierda (radial, 20% opacidad, radio ~600px)
- **Composición:** Título alineado a la izquierda (x: 60, y: ~800), más cinematográfico
- **Frecuency line:** Más prominente, 4px, con glow al 40%
- **Rationale:** Mayor impacto visual en feed. El halo genera profundidad sin romper la oscuridad base. Ideal para Bass & Borders o Frecuencia Global (más energía)

#### Variante C3: Foto Tratada
- **Fondo:** Fotografía editorial desaturada al 70% + overlay `#0A0A0F` al 60%
- **Composición:** Título centrado-abajo (y: ~1000–1100), foto ocupa tercio superior como contexto visual
- **Lower third:** Sobre fondo ya oscurecido, sin barra adicional — texto directo
- **Rationale:** Conecta visualmente con el tema del video. Funciona bien para contenido con referente geográfico o evento específico. Requiere foto de calidad por pieza (no es template reutilizable sin cambio)

---

## C) PROMPTS PARA NANO BANANA 2

### Prompt C-NB1: Fondo Grid de Frecuencia (para Variante C1)

```
COMPOSITION: Full frame abstract background, no focal subject, uniform distribution
STYLE: Dark editorial, minimal, institutional — NO sci-fi, NO cyberpunk
LIGHTING: No visible light source, ambient only, very low luminance
COLOR: Dominant #0A0A0F deep black, thin grid lines in pure white at 3-5% opacity, subtle cyan #00E5FF glow at one edge (top-left corner, 10% opacity, soft radial falloff over 300px)
TEXTURE: Ultra-fine noise grain at 2% over entire surface, matte finish
DEPTH: Flat, single-layer composition, no depth of field
ELEMENTS ALLOWED: Geometric grid pattern (regular square grid, 40px spacing), one or two nodes (small circles, 6px, white at 8% opacity) at grid intersections
ELEMENTS PROHIBITED: Globes, flags, headphones, turntables, speakers, equalizers, people, text, logos, waveforms, rave aesthetics, neon floods
ASPECT RATIO: 9:16 (1080×1920)
LEGIBILITY PRIORITY: Background must not compete with overlaid text — keep luminance under 15% across 90% of surface
BRAND ALIGNMENT: Frecuencia Global — dark editorial geopolitics base, electronic DNA expressed only through grid geometry
```

**Uso:** Exportar a 1080×1920 PNG. Importar a Canva como fondo del cover template.

---

### Prompt C-NB2: Fondo Gradiente Neón (para Variante C2)

```
COMPOSITION: Full frame abstract background, soft radial gradient emanating from lower-left corner
STYLE: Dark editorial, contemporary, restrained neon — NOT festival, NOT gaming
LIGHTING: Single soft radial light source from lower-left, color temperature cool (cyan cast), intensity very low (peak 25% brightness), natural falloff
COLOR: Dominant #0A0A0F deep black occupying 75%+ of frame, radial gradient of #00E5FF cyan at 15-20% opacity in lower-left quadrant fading to black, NO secondary color
TEXTURE: Fine film grain at 3%, matte surface, no gloss
DEPTH: Single atmospheric layer, slight fog-like diffusion in gradient zone
ELEMENTS ALLOWED: Very subtle dust particles (white, 2% opacity, sparse), barely visible thin horizontal lines (1px, white at 2%) suggesting frequency
ELEMENTS PROHIBITED: Globes, flags, headphones, turntables, speakers, equalizers, people, text, logos, bold waveforms, glitch effects, lens flares
ASPECT RATIO: 9:16 (1080×1920)
LEGIBILITY PRIORITY: Upper half and right side must remain near-black for text overlay — gradient confined to lower-left only
BRAND ALIGNMENT: Frecuencia Global — cyan electronic pulse energy restrained to ambient background glow
```

**Variación por pilar:** Sustituir `#00E5FF` por:
- `#FF00E5` para Bass & Borders
- `#B8FF00` para Frecuencia Global
- `#4A6BFF` para Behind the Policy

---

### Prompt C-NB3: Textura Ambiental Oscura (uso general)

```
COMPOSITION: Full frame dark abstract texture, no recognizable shapes, no focal point
STYLE: Dark editorial, analog-digital hybrid texture
LIGHTING: No directional light, ambient only, deep shadow
COLOR: #0A0A0F to #1A1A2E vertical gradient, very subtle. No bright colors anywhere
TEXTURE: Combination of fine digital noise (2-3%) and subtle fabric/paper texture, creates depth without distraction
DEPTH: Very shallow, almost flat, slight tonal variation suggesting atmospheric depth
ELEMENTS ALLOWED: Micro-texture only — nothing recognizable as a shape or icon
ELEMENTS PROHIBITED: Globes, flags, headphones, turntables, speakers, equalizers, people, text, logos, grids, waveforms, geometric shapes
ASPECT RATIO: 9:16 (1080×1920)
LEGIBILITY PRIORITY: Must function as pure background — max luminance 12% anywhere
BRAND ALIGNMENT: Frecuencia Global — neutral dark base for text-heavy covers
```

---

> **Nota:** La foto de perfil (200×200) NO requiere prompt de Nano Banana 2. Se construye directamente en Canva usando el isotipo existente (`fg_isotipo_512.png` → redimensionar) sobre fondo `#0A0A0F`.

---

## D) CHECKLIST QA VISUAL — 10 PUNTOS

Validar cada punto antes de exportar desde Canva:

| # | Criterio | Aplica a | Método de verificación |
|---|----------|----------|----------------------|
| 1 | **Paleta cerrada** — Solo hex del sistema (`#0A0A0F`, `#00E5FF`, `#FF00E5`, `#1A1A2E`, `#B8FF00`, `#FFFFFF`, `#A0A0B8`, `#4A6BFF`) | Ambas piezas | Revisar cada elemento en Canva → verificar hex exacto |
| 2 | **Tipografías correctas** — Solo Bebas Neue (UPPERCASE), Space Grotesk, JetBrains Mono | Cover | Seleccionar cada texto → verificar fuente y peso |
| 3 | **Bebas Neue en MAYÚSCULAS** — Sin excepciones | Cover | Visual: ninguna letra minúscula en Bebas Neue |
| 4 | **Safe zones TikTok respetadas** — Sin texto en top 200px, bottom 280px, ni right 100px (x>980) | Cover | Activar guías en Canva a y:200, y:1640, x:980 |
| 5 | **Legibilidad móvil** — Texto principal legible en pantalla de 375px de ancho (~50% de diseño) | Cover | Vista previa al 50% de zoom en Canva / preview en móvil |
| 6 | **Cian ≤30% del área** — El acento no inunda la pieza | Ambas | Evaluación visual: el negro domina, el cian es puntual |
| 7 | **Contraste WCAG AA** — Ratio ≥4.5:1 para todo texto | Cover | Verificar blanco/gris sobre negro (cumple nativamente, solo vigilar sobre gradientes) |
| 8 | **Isotipo dentro del crop circular** — Todo el isotipo visible dentro de radio 85px del centro | Perfil | Superponer guía circular de 170px centrada → verificar que nada se corta |
| 9 | **Resolución exacta y formato correcto** — 200×200 PNG (perfil) / 1080×1920 PNG/JPEG 95%+ (cover) | Ambas | Verificar config de exportación en Canva antes de descargar |
| 10 | **Consistencia cross-platform** — La pieza es reconocible como FG junto a los assets de YouTube, Instagram, X y LinkedIn | Ambas | Comparar visualmente con assets existentes aprobados |

---

## E) NOMBRES DE ARCHIVO Y CONVENCIÓN DE VERSIONADO

### Convención de nomenclatura

```
FG_[PLATAFORMA]_[TIPO]_[VARIANTE]_v[VERSIÓN].[FORMATO]
```

### Foto de perfil

| Variante | Nombre de archivo |
|----------|-------------------|
| P1 — Minimal Puro | `FG_TikTok_ProfilePic_Minimal_v1.png` |
| P2 — Glow Cian | `FG_TikTok_ProfilePic_GlowCyan_v1.png` |
| P3 — Nodo Dual | `FG_TikTok_ProfilePic_DualNode_v1.png` |

### Cover template

| Variante | Nombre de archivo |
|----------|-------------------|
| C1 — Grid Editorial | `FG_TikTok_Cover_GridEditorial_v1.png` |
| C2 — Gradiente Neón | `FG_TikTok_Cover_GradienteNeon_v1.png` |
| C3 — Foto Tratada | `FG_TikTok_Cover_FotoTratada_v1.png` |

### Fondos generados por Nano Banana 2

| Prompt | Nombre de archivo |
|--------|-------------------|
| C-NB1 Grid | `FG_BG_Grid9x16_v1.png` |
| C-NB2 Gradiente Cian | `FG_BG_GradientCyan9x16_v1.png` |
| C-NB2 Gradiente Magenta | `FG_BG_GradientMagenta9x16_v1.png` |
| C-NB2 Gradiente Verde | `FG_BG_GradientGreen9x16_v1.png` |
| C-NB2 Gradiente Azul | `FG_BG_GradientBlue9x16_v1.png` |
| C-NB3 Textura | `FG_BG_DarkTexture9x16_v1.png` |

### Reglas de versionado

- `v1` = primera versión aprobada
- `v1.1`, `v1.2` = ajustes menores (color, tamaño, posición)
- `v2` = rediseño significativo o cambio de variante
- Nunca sobrescribir — siempre incrementar versión
- El archivo subido a TikTok se marca con sufijo `_LIVE`: e.g. `FG_TikTok_ProfilePic_GlowCyan_v1_LIVE.png`
- Almacenar en: `06_Assets/tiktok/`

---

## NOTAS FINALES DE PRODUCCIÓN

| Aspecto | Decisión |
|---------|----------|
| Bio / copy | Fuera de alcance de este documento — decisión editorial |
| Isotipo fuente | Usar `fg_isotipo_512.png` existente (verificar en `Frecuencia_Global_Assets_Base/assets/`) |
| Grid pattern | Si no se genera con Nano Banana, crear en Canva: líneas de 1px blanco al 4% opacidad, espaciado 40px |
| Frequency line | Elemento del catálogo v5: `Element_FrequencyLine` — importar a Canva o recrear como línea + picos |
| QA final | Pasar por AGENT_06 (QA/Consistency) antes de marcar como `_LIVE` |
