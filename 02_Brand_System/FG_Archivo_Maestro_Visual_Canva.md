# ARCHIVO MAESTRO DEL SISTEMA VISUAL — Frecuencia Global

**Versión:** 1.0  
**Fecha:** 2026-03-31  
**Estado:** Definitivo — Ejecutar en Canva  
**Fuente de verdad:** Este archivo + `FG_Brand_Kit_Operativo.md`  
**Decisiones cerradas:** Ver Checkpoint 2026-03-30 § 9

---

## Estructura del archivo en Canva

El archivo maestro se organiza como **un solo documento multipágina en Canva** (tipo presentación, 1920×1080 px). Las 12 secciones se mapean a páginas o grupos de páginas. Cada sección tiene un separador visual claro.

| # | Sección | Páginas estimadas |
|---|---------|:-----------------:|
| 1 | Portada maestra | 1 |
| 2 | Sistema de logos | 2 |
| 3 | Paleta cromática | 2 |
| 4 | Sistema tipográfico | 2 |
| 5 | Componentes base reutilizables | 3 |
| 6 | Template maestro Geopolitik Drop | 3 |
| 7 | Template maestro Bass & Borders | 3 |
| 8 | Template maestro Frecuencia Global | 3 |
| 9 | Template maestro Behind the Policy | 3 |
| 10 | Overlay vertical TikTok/Reels | 2 |
| 11 | Reglas de uso rápido | 1 |
| 12 | Checklist de consistencia visual | 1 |
| **Total** | | **~26 páginas** |

---

## 1. PORTADA MAESTRA

### Objetivo
Identificar el archivo como el sistema visual único de Frecuencia Global. Cualquier persona que lo abra entiende en 3 segundos qué es, de quién es y que no debe modificarse sin criterio.

### Elementos obligatorios
- Wordmark "FRECUENCIA GLOBAL" centrado (Bebas Neue, blanco, 96px)
- Línea de frecuencia debajo del wordmark (cian `#00E5FF`, glow 30%)
- Subtítulo: "SISTEMA VISUAL MAESTRO — v1.0" (Space Grotesk Bold, 24px, `#A0A0B8`)
- Fecha de última actualización (JetBrains Mono, 14px, `#A0A0B8`)
- Fondo: `#0A0A0F` con grid sutil al 4%
- Los 4 colores de pilar como barra inferior (cian, magenta, verde ácido, azul) — franjas horizontales de 4px

### Layout recomendado
```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│          FRECUENCIA GLOBAL                       │  ← Wordmark centrado
│          ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                     │  ← Línea de frecuencia
│                                                  │
│       SISTEMA VISUAL MAESTRO — v1.0              │  ← Space Grotesk Bold
│       Última actualización: 2026-03-31           │  ← JetBrains Mono
│                                                  │
│                                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  ← Barra 4 colores de pilar
└──────────────────────────────────────────────────┘
   Fondo: #0A0A0F + grid 4%
```

### Bloqueado como sistema
- Wordmark, línea de frecuencia, fondo, barra de colores → **intocables**
- Nombre del archivo → no se cambia

### Editable por pieza
- Fecha de actualización (cuando se modifique el sistema)
- Número de versión

---

## 2. SISTEMA DE LOGOS

### Objetivo
Reunir todas las variantes del logo aprobadas con reglas de uso, tamaños mínimos y zonas de protección. Eliminar ambigüedad sobre cuál logo usar en cada contexto.

### Elementos obligatorios

**Página 2A — Variantes del logo:**

| Variante | Descripción | Archivo fuente |
|----------|-------------|----------------|
| Wordmark completo | "FRECUENCIA GLOBAL" en línea | `fg_wordmark_dark.svg` |
| Wordmark apilado | "FRECUENCIA" / "GLOBAL" | Derivar del wordmark |
| Wordmark + línea de frecuencia | Versión principal de branding fuerte | Wordmark + elemento cian |
| Wordmark light | Para fondos claros (si aplica) | `fg_wordmark_light.svg` |
| Isotipo | Ícono de frecuencia/onda + nodo | `fg_isotipo.svg` |
| Monograma FG | Letras "FG" estilizadas | Canva Design `DAHFf-nM5sA` |

Cada variante se muestra sobre fondo `#0A0A0F` y sobre fondo `#1A1A2E`, a tamaño real de uso más frecuente.

**Página 2B — Reglas de uso:**

- Tamaño mínimo: isotipo 24px, wordmark 120px de ancho
- Zona de protección: espacio libre alrededor = alto de la "F" del wordmark
- Usos prohibidos: estirar, rotar, cambiar colores, agregar sombras, poner sobre fondos claros sin variante light
- Tabla de aplicación por plataforma (qué variante en cada contexto)

### Layout recomendado
```
Página 2A:
┌──────────────────────────────────────────────────┐
│  [SISTEMA DE LOGOS]                              │  ← Título sección
│                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │Wordmark │  │ Apilado │  │Wordmark │          │
│  │completo │  │         │  │+ línea  │          │
│  └─────────┘  └─────────┘  └─────────┘          │
│                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ Isotipo │  │Monogram │  │ Light   │          │
│  │         │  │  FG     │  │         │          │
│  └─────────┘  └─────────┘  └─────────┘          │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Bloqueado como sistema
- Formas, proporciones, colores de todos los logos
- Zona de protección mínima
- Restricciones de uso

### Editable por pieza
- Nada. Los logos no se modifican pieza a pieza.

---

## 3. PALETA CROMÁTICA

### Objetivo
Documentar los 8 colores cerrados con sus códigos exactos, roles asignados y reglas de proporción. Impedir el uso de cualquier color fuera del sistema.

### Elementos obligatorios

**Página 3A — Colores del sistema:**

| Rol | Nombre | Hex | Muestra | Uso principal |
|-----|--------|-----|---------|---------------|
| Base | Negro Profundo | `#0A0A0F` | ■ | Fondo principal |
| Acento 1 | Cian Eléctrico | `#00E5FF` | ■ | Color insignia. Títulos, líneas, acentos |
| Acento 2 | Magenta Neón | `#FF00E5` | ■ | Urgencia, energía, contraste con cian |
| Superficie | Grafito Azulado | `#1A1A2E` | ■ | Cards, zonas de texto |
| Acento 3 | Verde Ácido | `#B8FF00` | ■ | Datos, highlights puntuales |
| Texto 1 | Blanco Puro | `#FFFFFF` | ■ | Texto sobre fondos oscuros |
| Texto 2 | Gris Claro | `#A0A0B8` | ■ | Subtítulos, metadata |
| Pilar BP | Azul Profundo | `#4A6BFF` | ■ | Exclusivo Behind the Policy |

Cada color se muestra como rectángulo grande con hex, RGB y nombre encima.

**Página 3B — Colores por pilar + reglas:**

- Tabla de color dominante por pilar (Geopolitik=cian, Bass&Borders=magenta, FrecuenciaGlobal=verde, BehindThePolicy=azul)
- Proporción: color dominante 70% / acento secundario 30% — nunca al mismo peso
- Verde ácido: máximo 10-15% de la pieza
- Gradientes permitidos: Cian→Magenta (diagonal/radial), Negro→Grafito (vertical)
- Contraste mínimo: ratio 4.5:1 (WCAG AA)
- Glow: solo en cian, magenta, verde. Opacidad 20-40%. Nunca en texto.
- **CERO colores fuera de esta tabla.**

### Layout recomendado
```
Página 3A:
┌──────────────────────────────────────────────────┐
│  [PALETA CROMÁTICA]                              │
│                                                  │
│  ████████  ████████  ████████  ████████          │
│  #0A0A0F   #00E5FF   #FF00E5   #1A1A2E          │
│  Negro     Cian      Magenta   Grafito           │
│                                                  │
│  ████████  ████████  ████████  ████████          │
│  #B8FF00   #FFFFFF   #A0A0B8   #4A6BFF           │
│  Verde     Blanco    Gris      Azul              │
│                                                  │
└──────────────────────────────────────────────────┘

Página 3B:
┌──────────────────────────────────────────────────┐
│  COLORES POR PILAR          REGLAS DE USO        │
│                                                  │
│  GD ■ Cian                  70/30 dominante      │
│  BB ■ Magenta               Verde máx 15%        │
│  FG ■ Verde                 Glow ≤40% opacidad   │
│  BP ■ Azul                  Contraste ≥4.5:1     │
│                                                  │
│  GRADIENTES PERMITIDOS      PROHIBIDO            │
│  Cian→Magenta               Colores fuera tabla  │
│  Negro→Grafito              Pasteles, cálidos    │
│                             Glow en texto        │
└──────────────────────────────────────────────────┘
```

### Bloqueado como sistema
- Los 8 colores hex exactos
- Asignación de color por pilar
- Todas las reglas de proporción y contraste

### Editable por pieza
- Cuál de los gradientes permitidos usar
- Intensidad del glow dentro del rango 20-40%

---

## 4. SISTEMA TIPOGRÁFICO

### Objetivo
Definir las 3 familias tipográficas, sus pesos, tamaños y roles. Garantizar que ninguna pieza use fuentes fuera del sistema.

### Elementos obligatorios

**Página 4A — Familias y jerarquía:**

| Nivel | Fuente | Peso | Tamaño ref. | Uso | Regla clave |
|-------|--------|------|-------------|-----|-------------|
| Display | Bebas Neue | Regular 400 | 48-120px | Títulos principales | SIEMPRE MAYÚSCULAS |
| Headlines | Space Grotesk | Bold 700 | 24-36px | Subtítulos, secciones | Sentence case |
| Body | Space Grotesk | Regular 400 | 14-18px | Texto corrido | Sentence case |
| Data/Accent | JetBrains Mono | Regular 400 | 12-16px | Fechas, tags, metadata | lowercase o UPPERCASE |
| Micro | Space Grotesk | Medium 500 | 10-12px | Créditos, disclaimers | lowercase |

Mostrar cada fuente con ejemplo de texto real del proyecto:
- Bebas Neue: `CRISIS EN EL ESTRECHO DE TAIWÁN`
- Space Grotesk Bold: `Análisis del bloqueo naval chino`
- Space Grotesk Regular: `El 15 de marzo de 2026, la marina china...`
- JetBrains Mono: `[2026.03.15] [GEOPOLITIK DROP] [ASIA-PACÍFICO]`

**Página 4B — Reglas tipográficas:**

- Interlineado: Bebas 90-100% | Space Grotesk 140-160% | JetBrains Mono 120-130%
- Tracking: Bebas +2% a +5% | Space Grotesk 0% | JetBrains Mono 0%
- Máximo 2 tamaños de Bebas por pieza
- JetBrains Mono NUNCA para títulos
- Combo prohibido: Bebas Neue en minúsculas (no funciona visualmente)
- Tres familias, sin excepciones

### Layout recomendado
```
Página 4A:
┌──────────────────────────────────────────────────┐
│  [SISTEMA TIPOGRÁFICO]                           │
│                                                  │
│  BEBAS NEUE                                      │  ← 80px, blanco
│  CRISIS EN EL ESTRECHO DE TAIWÁN                 │
│                                                  │
│  Space Grotesk Bold                              │  ← 28px
│  Análisis del bloqueo naval chino                │
│                                                  │
│  Space Grotesk Regular                           │  ← 16px
│  El 15 de marzo de 2026, la marina china...      │
│                                                  │
│  JetBrains Mono                                  │  ← 14px, cian
│  [2026.03.15] [GEOPOLITIK DROP] [ASIA-PACÍFICO]  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Bloqueado como sistema
- Las 3 familias tipográficas (Bebas Neue, Space Grotesk, JetBrains Mono)
- Pesos asignados por rol
- Regla de MAYÚSCULAS para Bebas Neue
- Roles de cada fuente

### Editable por pieza
- Tamaño exacto dentro del rango definido (ej: Bebas entre 48-120px)
- Interlineado dentro del rango definido

---

## 5. COMPONENTES BASE REUTILIZABLES

### Objetivo
Reunir todos los elementos gráficos modulares del sistema como componentes que se arrastran y usan. Cada componente tiene variantes por pilar. Esto es el "kit de piezas" del sistema.

### Elementos obligatorios

**Página 5A — Elementos de marca:**

| Componente | Descripción | Variantes | Fuente |
|------------|-------------|-----------|--------|
| Línea de frecuencia | Waveform horizontal, cian + glow 30% | Horizontal, vertical, curva | v5: Element_FrequencyLine |
| Nodo de señal | Círculo 8-16px con glow 40% | Cian, magenta, verde, azul | v5: Element_SignalNode |
| Corchetes `[ ]` | Contenedores de metadata estilizados | Cian, azul (policy) | `fg_corchetes.svg`, v5 |
| Pill de pilar | Rectángulo redondeado con nombre del pilar | 4 variantes (1 por pilar) | Crear en Canva |
| Divisor con nodos | Línea horizontal con nodos en extremos | Cian | v5: Divider |

**Página 5B — Fondos base:**

| Fondo | Composición | Uso principal |
|-------|-------------|---------------|
| DarkSolid | `#0A0A0F` plano | Default para todo |
| DarkGrid | `#0A0A0F` + grid blanco al 4% | Thumbnails, portadas |
| CyanField | Negro + halo cian diagonal | Geopolitik Drop, piezas energéticas |
| PolicyField | Negro + tono azul profundo sutil | Behind the Policy |
| ModularFrame | Negro con zonas delimitadas | Layouts multi-bloque |
| NewsField | Negro + verde ácido sutil | Frecuencia Global (noticias) |
| GradienteNegro→Grafito | `#0A0A0F` → `#1A1A2E` vertical | Cards, slides interiores |
| GradienteNeón | Negro + halo cian/magenta en esquina | Breaking news, highlights |

Cada fondo se muestra como miniatura con nombre debajo.

**Página 5C — Barras de metadata y frames:**

| Componente | Descripción | Uso |
|------------|-------------|-----|
| Metadata bar (cian) | Barra con fecha + pilar + región | Thumbnails, carruseles |
| Metadata bar (neutral) | Barra gris para datos secundarios | Slides interiores |
| Photo frame (cian) | Marco para fotos con borde cian | Thumbnails con foto |
| Photo frame (policy) | Marco azul para Behind the Policy | Piezas BP |
| Quote frame | Marco para citas destacadas | Carruseles |
| Map frame | Marco para mapas/infografías | Videos, carruseles |
| Keyword pills | Etiquetas de tema por color de pilar | Todas las piezas |

### Layout recomendado
```
Página 5A:
┌──────────────────────────────────────────────────┐
│  [COMPONENTES — ELEMENTOS DE MARCA]              │
│                                                  │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔  Línea de frecuencia       │
│                                                  │
│  ●  ●  ●  ●          Nodos (cian/mag/verde/azul) │
│                                                  │
│  [ GEOPOLITIK DROP ]  Corchetes                  │
│                                                  │
│  ┌GEOPOLITIK DROP┐    Pill de pilar              │
│  ┌BASS & BORDERS ┐                               │
│  ┌FRECUENCIA GLOBAL┐                             │
│  ┌BEHIND THE POLICY┐                             │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Bloqueado como sistema
- Formas, colores y proporciones de todos los componentes
- Variantes de color (solo los colores del sistema)
- Grosor de líneas, tamaños de nodos
- Los 8 fondos base como catálogo cerrado

### Editable por pieza
- Cuál componente usar según el pilar y formato
- Posición dentro de la composición
- Cuál fondo base seleccionar

---

## 6. TEMPLATE MAESTRO — GEOPOLITIK DROP

### Objetivo
Template completo y repetible para el pilar de análisis geopolítico. Color dominante: **Cian Eléctrico `#00E5FF`**. Tono visual: intenso, directo, impacto.

### Elementos obligatorios
- Pill `[GEOPOLITIK DROP]` en cian
- Línea de frecuencia cian debajo del título
- Fondo: DarkGrid o CyanField
- Nodo de señal cian en metadata
- Logo FG (isotipo) esquina superior derecha
- Corchetes cian para tags de región y fecha

### Subpáginas del template

**6A — Thumbnail YouTube (1280×720)**
```
┌─────────────────────────────────────────────┐
│  [GEOPOLITIK DROP]              ◉ FG        │  ← Pill cian + isotipo
│                                              │
│  TÍTULO PRINCIPAL                            │  ← Bebas Neue 64-80px, blanco
│  CON PALABRA EN CIAN                         │     1 palabra en #00E5FF
│                                              │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                    │  ← Línea frecuencia cian
│  Subtítulo · [2026.03.15]                    │  ← Space Grotesk + JetBrains Mono
└─────────────────────────────────────────────┘
   Fondo: DarkGrid o foto tratada (desaturada 70%, overlay negro 60%)
   Regla: máx 8 palabras en título. Evitar esquina inferior derecha.
```

**6B — Carrusel Instagram (1080×1350)**

Portada:
```
┌──────────────────────┐
│  [GEOPOLITIK DROP]   │  ← Pill cian
│                      │
│  TÍTULO              │  ← Bebas Neue 48-56px
│  PRINCIPAL           │
│                      │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔     │  ← Línea frecuencia
│  Subtítulo breve     │  ← Space Grotesk, gris claro
│                      │
│  FRECUENCIA GLOBAL   │  ← Wordmark pequeño
└──────────────────────┘
```

Slide interior:
```
┌──────────────────────┐
│  02 / 08             │  ← JetBrains Mono, cian
│                      │
│  Headline del        │  ← Space Grotesk Bold 24px
│  punto clave         │
│                      │
│  Texto explicativo   │  ← Space Grotesk Regular 16px
│  3-4 líneas máximo   │
│                      │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔     │
│  [FUENTE]            │  ← JetBrains Mono, gris
└──────────────────────┘
```

Cierre:
```
┌──────────────────────┐
│                      │
│  FRECUENCIA          │  ← Wordmark apilado
│  GLOBAL              │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔     │
│  @frecuenciaglobal   │
│  Síguenos · Comparte │
└──────────────────────┘
```

**6C — Post cuadrado (1080×1080)**
```
┌──────────────────────┐
│  [GEOPOLITIK DROP]   │
│                      │
│  TÍTULO              │  ← Bebas Neue 44-52px
│  EN 2 LÍNEAS         │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔     │
│  Dato + fecha        │  ← JetBrains Mono
│         ◉ FG        │  ← Isotipo esquina
└──────────────────────┘
```

### Bloqueado como sistema
- Color dominante: cian `#00E5FF`
- Layout de thumbnail (jerarquía, posición de elementos)
- Pill `[GEOPOLITIK DROP]`
- Presencia de línea de frecuencia e isotipo
- Tipografías y roles (Bebas=título, SpaceGrotesk=body, JetBrains=data)

### Editable por pieza
- Texto del título, subtítulo, contenido
- Elección de fondo (DarkGrid vs foto tratada)
- Número de slides del carrusel
- Palabra destacada en color cian

---

## 7. TEMPLATE MAESTRO — BASS & BORDERS

### Objetivo
Template para el pilar de intersección música electrónica × fronteras culturales. Color dominante: **Magenta Neón `#FF00E5`**. Tono visual: explorador, cultural, energético.

### Elementos obligatorios
- Pill `[BASS & BORDERS]` en magenta
- Línea de frecuencia magenta
- Fondo: DarkGrid o gradiente con halo magenta
- Nodo de señal magenta
- Logo FG (isotipo)
- Corchetes magenta para tags

### Subpáginas del template

**7A — Thumbnail YouTube (1280×720)**
```
┌─────────────────────────────────────────────┐
│  [BASS & BORDERS]               ◉ FG        │
│                                              │
│  TÍTULO PRINCIPAL                            │  ← Bebas Neue 64-80px
│  CON PALABRA EN MAGENTA                      │     1 palabra en #FF00E5
│                                              │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                    │  ← Línea frecuencia magenta
│  Subtítulo · [2026.03.15]                    │
└─────────────────────────────────────────────┘
   Fondo: DarkGrid o foto tratada con halo magenta
```

**7B — Carrusel Instagram (1080×1350)**

Misma estructura que Geopolitik Drop (§6B) pero:
- Pill y acentos en `#FF00E5` magenta
- Numeración de slides en magenta
- Línea de frecuencia en magenta

**7C — Post cuadrado (1080×1080)**

Misma estructura que §6C pero con acentos magenta.

### Bloqueado como sistema
- Color dominante magenta `#FF00E5`
- Estructura de layout idéntica a Geopolitik Drop (cambia solo color)
- Pill `[BASS & BORDERS]`

### Editable por pieza
- Texto, contenido, fondo específico
- Palabra destacada en magenta
- Número de slides

---

## 8. TEMPLATE MAESTRO — FRECUENCIA GLOBAL

### Objetivo
Template para el pilar de noticias rápidas en formato breve. Color dominante: **Verde Ácido `#B8FF00`**. Tono visual: ágil, informativo, rítmico. Piezas más compactas y directas.

### Elementos obligatorios
- Pill `[FRECUENCIA GLOBAL]` en verde ácido
- Línea de frecuencia verde ácido (uso sutil — verde máx 15% de la pieza)
- Fondo: DarkSolid o NewsField
- Nodo de señal verde
- Logo FG (isotipo)
- Corchetes verde para tags
- El verde ácido se usa como **punteo**, nunca en bloques grandes

### Subpáginas del template

**8A — Thumbnail YouTube Shorts (1280×720)**
```
┌─────────────────────────────────────────────┐
│  [FRECUENCIA GLOBAL]            ◉ FG        │
│                                              │
│  TITULAR CORTO                               │  ← Bebas Neue 72px
│  EN 1-2 LÍNEAS                               │     Palabra clave en #B8FF00
│                                              │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                           │  ← Línea frecuencia verde (sutil)
│  [2026.03.15] · [EUROPA]                     │
└─────────────────────────────────────────────┘
   Fondo: DarkSolid o NewsField
```

**8B — Carrusel Instagram (1080×1350)**

Misma estructura que §6B pero:
- Pill y acentos en `#B8FF00` verde ácido
- Numeración en verde
- Slides más cortos (2-3 líneas por slide, formato noticias)
- Máximo 6 slides (formato rápido)

**8C — Post cuadrado (1080×1080)**

Estructura compacta, optimizada para impacto rápido:
```
┌──────────────────────┐
│  [FRECUENCIA GLOBAL] │
│                      │
│  TITULAR             │  ← Bebas Neue 48px
│  DIRECTO             │
│  ▔▔▔▔▔▔▔▔▔▔         │
│  Dato clave ·  fecha │
│              ◉ FG    │
└──────────────────────┘
```

### Bloqueado como sistema
- Color verde ácido `#B8FF00` como punteo (nunca dominante)
- Proporción: verde máximo 15% de superficie
- Pill `[FRECUENCIA GLOBAL]`
- Formato más compacto que otros pilares

### Editable por pieza
- Texto, titular, datos
- Número de slides (máx 6)
- Palabra clave en verde

---

## 9. TEMPLATE MAESTRO — BEHIND THE POLICY

### Objetivo
Template para contenido profundo/profesional. Color dominante: **Azul Profundo `#4A6BFF`**. Tono visual: formal, analítico, editorial. Estética más sobria que los otros pilares.

### Elementos obligatorios
- Pill `[BEHIND THE POLICY]` en azul
- Línea de frecuencia azul (más fina, menos glow que otros pilares)
- Fondo: PolicyField o DarkSolid (nunca CyanField ni NewsField)
- Nodo de señal azul
- Logo FG (isotipo)
- Corchetes azul para tags
- Menos elementos decorativos que otros pilares — priorizar claridad y espacio

### Subpáginas del template

**9A — Thumbnail YouTube (1280×720)**
```
┌─────────────────────────────────────────────┐
│  [BEHIND THE POLICY]            ◉ FG        │
│                                              │
│  TÍTULO PRINCIPAL                            │  ← Bebas Neue 64-72px
│  MÁS EDITORIAL                              │     Palabra clave en #4A6BFF
│                                              │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                     │  ← Línea frecuencia azul
│  Subtítulo analítico · [2026]                │
└─────────────────────────────────────────────┘
   Fondo: PolicyField. Sin glitch, sin elementos EDM exagerados.
```

**9B — Carrusel Instagram/LinkedIn (1080×1350)**

Misma estructura que §6B pero:
- Pill y acentos en `#4A6BFF` azul
- Tono más formal en textos
- Más espacio blanco (gris oscuro)
- Slides pueden tener más texto (audiencia profesional)
- Apto para crosspost en LinkedIn

**9C — Artículo LinkedIn (1200×627)**
```
┌────────────────────────────────────────┐
│  [BEHIND THE POLICY]                   │
│                                        │
│  TÍTULO DEL ANÁLISIS                   │  ← Bebas Neue 56px
│  EN FORMATO EDITORIAL                  │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                │
│  Por Farid Assad · Frecuencia Global   │  ← Space Grotesk
└────────────────────────────────────────┘
   Fondo: PolicyField. Estilo sobrio.
```

### Bloqueado como sistema
- Color azul `#4A6BFF`
- Tono visual más contenido (menos glow, menos glitch)
- Pill `[BEHIND THE POLICY]`
- Fondos solo PolicyField o DarkSolid

### Editable por pieza
- Texto, contenido, extensión de carrusel
- Formato LinkedIn vs Instagram
- Palabra clave en azul

---

## 10. OVERLAY VERTICAL — TIKTOK/REELS

### Objetivo
Overlay reutilizable para poner sobre video vertical (1080×1920). Funciona como capa superior transparente que aporta identidad de marca sin bloquear contenido.

### Elementos obligatorios

**Página 10A — Overlay estructura:**

| Zona | Contenido | Especificación |
|------|-----------|----------------|
| Superior izq | Pill de pilar en corchetes | JetBrains Mono 14px, color del pilar |
| Superior der | Isotipo FG pequeño | 32px, blanco, glow cian sutil |
| Centro | Título overlay | Bebas Neue 40-48px, blanco, drop shadow negro 80% |
| Lower third | Barra `#1A1A2E` al 85% opacidad | Height: 120px |
| Lower third | Texto en barra | Space Grotesk 16px, blanco |
| Lower third | Línea de frecuencia | Color del pilar, debajo del título |
| Safe areas | 150px arriba/abajo, 60px laterales | Zona libre de UI de plataforma |

```
┌──────────────────────┐
│ [PILAR]         ◉ FG │  ← 150px zona segura superior
│                      │
│                      │
│                      │  ← Video pasa por debajo
│                      │
│   TÍTULO OVERLAY     │  ← Bebas Neue + sombra
│   ▔▔▔▔▔▔▔▔▔▔▔▔      │  ← Línea frecuencia
│ ┌──────────────────┐ │
│ │ Dato · Fecha     │ │  ← Lower third con barra
│ │ Fuente           │ │
│ └──────────────────┘ │
│                      │  ← 150px zona segura inferior
└──────────────────────┘
   60px margen lateral
```

**Página 10B — Variantes por pilar:**

4 versiones del overlay con el color de pilar correspondiente:
- GD: cian
- BB: magenta
- FG: verde ácido (sutil)
- BP: azul

### Bloqueado como sistema
- Estructura de zonas (pill arriba, título centro, lower third abajo)
- Safe areas (150px arriba/abajo, 60px laterales)
- Barra lower third en `#1A1A2E` al 85%
- Posición del isotipo

### Editable por pieza
- Texto del título, datos, fuente
- Color de pilar (seleccionar la variante correcta)
- Si el lower third se muestra o no (según el video)

---

## 11. REGLAS DE USO RÁPIDO

### Objetivo
Una página única que cualquier colaborador pueda consultar en 30 segundos para no romper el sistema. Resumen ejecutivo de todo lo anterior.

### Elementos obligatorios

Una sola página con todas las reglas en formato ultra-compacto:

```
┌──────────────────────────────────────────────────┐
│  REGLAS DE USO RÁPIDO — FRECUENCIA GLOBAL        │
│                                                  │
│  COLORES                                         │
│  • Solo 8 colores. Hex exacto. Sin excepciones.  │
│  • Fondo siempre oscuro (#0A0A0F o #1A1A2E).     │
│  • Verde ácido máx 15%. Glow máx 40%.            │
│                                                  │
│  TIPOGRAFÍA                                      │
│  • 3 fuentes: Bebas Neue / Space Grotesk /       │
│    JetBrains Mono. Sin excepciones.              │
│  • Bebas SIEMPRE en MAYÚSCULAS.                  │
│  • JetBrains solo para datos, nunca títulos.     │
│                                                  │
│  COMPONENTES                                     │
│  • Solo del catálogo. No inventar elementos.     │
│  • Pill de pilar obligatoria en toda pieza.      │
│  • Isotipo FG presente en toda pieza.            │
│  • Línea de frecuencia: elemento insignia.       │
│                                                  │
│  COMPOSICIÓN                                     │
│  • Texto alineado a la izquierda (thumbs).       │
│  • Margen exterior: 5-8% del ancho.              │
│  • Contraste texto ≥4.5:1. Legible en mobile.    │
│  • Safe areas por plataforma respetadas.         │
│                                                  │
│  PROHIBIDO                                       │
│  • Bordes redondeados >4px. Sombras corporativas.│
│  • Degradados pastel. Colores cálidos.           │
│  • Texturas orgánicas. Emojis en piezas gráficas.│
│  • Más de 3 acentos por pieza.                   │
│                                                  │
│  NOMENCLATURA                                    │
│  FG_[PILAR]_[FORMATO]_[TEMA]_[VERSION].[ext]     │
│  Pilares: GD / BB / FG / BP / MK                 │
│  Formatos: THB / CAR / STR / BNR / POST / DOC    │
└──────────────────────────────────────────────────┘
```

### Bloqueado como sistema
- Todo el contenido de esta página

### Editable por pieza
- Nada. Esta página es de referencia.

---

## 12. CHECKLIST DE CONSISTENCIA VISUAL

### Objetivo
Lista de verificación que se recorre antes de exportar cualquier pieza. Si un punto falla, la pieza no sale.

### Elementos obligatorios

Una sola página con checklist de 2 columnas:

```
┌──────────────────────────────────────────────────┐
│  CHECKLIST DE CONSISTENCIA — VERIFICAR ANTES     │
│  DE EXPORTAR                                     │
│                                                  │
│  IDENTIDAD                    TIPOGRAFÍA         │
│  □ Solo colores hex del       □ Solo Bebas /     │
│    sistema                      SpaceG / JBMono  │
│  □ Color de pilar correcto    □ Bebas en MAYÚSC  │
│  □ Pill de pilar presente     □ Tamaños dentro   │
│  □ Isotipo FG presente          del rango        │
│  □ Línea de frecuencia       □ JetBrains solo    │
│    presente                     para datos       │
│                                                  │
│  COMPOSICIÓN                  EXPORTACIÓN        │
│  □ Fondo del catálogo         □ Resolución       │
│  □ Componentes del catálogo     exacta para      │
│  □ Margen exterior 5-8%        plataforma        │
│  □ Contraste ≥4.5:1          □ Nomenclatura      │
│  □ Legible en mobile            FG_XX_YY_ZZ_v#   │
│    (test zoom 50%)           □ Sin elementos     │
│  □ Safe areas respetadas       fuera del sistema │
│  □ Máx 3 acentos por pieza  □ Aprobado para     │
│                                 publicación      │
│                                                  │
│  SI UN PUNTO FALLA → NO PUBLICAR → CORREGIR      │
└──────────────────────────────────────────────────┘
```

### Bloqueado como sistema
- Todos los puntos del checklist
- La regla de bloqueo ("si falla, no sale")

### Editable por pieza
- Nada. Se aplica a toda pieza sin excepción.

---

---

# LISTA DE EJECUCIÓN EN CANVA

Orden estricto de producción. Cada paso depende del anterior. No saltar pasos.

## FASE 1 — CIMIENTOS (hacer primero, ~2 horas)

| # | Acción | Detalle | Tiempo |
|---|--------|---------|:------:|
| 1.1 | Crear archivo maestro | Nuevo diseño Canva tipo Presentación 1920×1080. Nombre: `FG_Sistema_Visual_Maestro_v1` | 5 min |
| 1.2 | Verificar Brand Kit | Confirmar que los 8 colores aparecen en el Brand Kit nativo de Canva (`kAGEfgAcmZ0`). Si falta alguno, agregarlo con hex exacto. | 10 min |
| 1.3 | Verificar tipografías | Confirmar Bebas Neue y Space Grotesk disponibles en Brand Kit. Si JetBrains Mono no está, subirlo desde `static/`. | 10 min |
| 1.4 | Subir logos al Brand Kit | Subir `fg_isotipo.svg`, `fg_wordmark_dark.svg`, `fg_wordmark_light.svg`, `fg_corchetes.svg`, `fg_nodo.svg` desde `Frecuencia_Global_Assets_Base/assets/`. Exportar monograma FG del diseño `DAHFf-nM5sA` como PNG transparente y subirlo. | 15 min |
| 1.5 | Subir elementos v5 | Subir los 15 PNGs de `Frecuencia_Global_Activos_Canva_v5/` como elementos de biblioteca en Canva (fondos + elementos reutilizables). | 15 min |

## FASE 2 — PÁGINAS DE SISTEMA (construir en el archivo maestro, ~2 horas)

| # | Acción | Página(s) | Tiempo |
|---|--------|:---------:|:------:|
| 2.1 | Portada maestra | Pág 1 — Seguir layout §1 exacto | 15 min |
| 2.2 | Sistema de logos | Pág 2-3 — Colocar variantes + reglas según §2 | 20 min |
| 2.3 | Paleta cromática | Pág 4-5 — Muestras grandes con hex + reglas según §3 | 15 min |
| 2.4 | Sistema tipográfico | Pág 6-7 — Ejemplos de texto real + reglas según §4 | 15 min |
| 2.5 | Componentes base | Pág 8-10 — Elementos, fondos, barras según §5 | 30 min |
| 2.6 | Reglas de uso rápido | Pág 23 (penúltima) — Contenido exacto de §11 | 10 min |
| 2.7 | Checklist consistencia | Pág 24 (última) — Contenido exacto de §12 | 10 min |

## FASE 3 — TEMPLATES POR PILAR (núcleo de producción, ~3 horas)

| # | Acción | Página(s) | Prioridad | Tiempo |
|---|--------|:---------:|:---------:|:------:|
| 3.1 | Template Geopolitik Drop | Pág 11-13 — Thumbnail + Carrusel (portada/interior/cierre) + Post. Color: cian. Según §6 | **P0** | 45 min |
| 3.2 | Template Bass & Borders | Pág 14-16 — Duplicar estructura de GD, cambiar color a magenta + pill. Según §7 | **P0** | 30 min |
| 3.3 | Template Frecuencia Global | Pág 17-19 — Adaptar estructura (más compacta). Color: verde ácido. Según §8 | **P0** | 30 min |
| 3.4 | Template Behind the Policy | Pág 20-22 — Adaptar estructura (más sobria). Color: azul + formato LinkedIn. Según §9 | **P0** | 45 min |

## FASE 4 — OVERLAY VERTICAL (~45 min)

| # | Acción | Página(s) | Tiempo |
|---|--------|:---------:|:------:|
| 4.1 | Crear overlay base | Nuevo frame 1080×1920 dentro del archivo. Estructura según §10. | 20 min |
| 4.2 | Duplicar × 4 pilares | 4 variantes del overlay con color de pilar. Pág 25-26. | 15 min |
| 4.3 | Marcar safe areas | Agregar guías o rectángulos semi-transparentes en zonas de safe area. | 10 min |

## FASE 5 — BLOQUEO Y VALIDACIÓN (~30 min)

| # | Acción | Detalle | Tiempo |
|---|--------|---------|:------:|
| 5.1 | Bloquear elementos de sistema | En cada página de sistema (§1-5, §11-12): bloquear posición de elementos que no deben moverse. Usar la función "Lock" de Canva. | 10 min |
| 5.2 | Validar checklist | Recorrer el checklist §12 contra cada template (§6-9) y overlay (§10). Corregir discrepancias. | 15 min |
| 5.3 | Nombrar todas las páginas | Cada página del archivo maestro con nombre descriptivo: `01_Portada`, `02_Logos_Variantes`, `03_Logos_Reglas`, etc. | 5 min |

## FASE 6 — PRODUCCIÓN INMEDIATA (~1 hora)

| # | Acción | Detalle | Tiempo |
|---|--------|---------|:------:|
| 6.1 | Duplicar template GD como primera pieza | Duplicar Pág 11 (thumbnail GD) → nuevo diseño → cambiar título por tema real de P1_001 | 15 min |
| 6.2 | Duplicar template GD carrusel | Duplicar Págs 12-13 → nuevo diseño → llenar con contenido del guión | 30 min |
| 6.3 | Pasar checklist §12 | Verificar la pieza real contra el checklist | 10 min |
| 6.4 | Exportar con nomenclatura | Exportar como `FG_GD_THB_[Tema]_v1.png` y `FG_GD_CAR_[Tema]_v1.png` | 5 min |

---

## RESUMEN DE TIEMPOS

| Fase | Tiempo estimado |
|------|:--------------:|
| Fase 1 — Cimientos | ~55 min |
| Fase 2 — Páginas de sistema | ~1h 55 min |
| Fase 3 — Templates por pilar | ~2h 30 min |
| Fase 4 — Overlay vertical | ~45 min |
| Fase 5 — Bloqueo y validación | ~30 min |
| Fase 6 — Primera pieza real | ~1h |
| **Total** | **~7h 35 min** |

**Criterio de "terminado":**  
El archivo maestro está terminado cuando:
1. Las 26 páginas existen con contenido real (no placeholders)
2. Todos los elementos de sistema están bloqueados
3. Cada template produce una pieza nueva en <15 minutos duplicando y editando
4. La primera pieza real (P1_001) pasa el checklist §12 sin fallos

---

*Documento generado: 2026-03-31*  
*Fuente de verdad visual: este archivo + `FG_Brand_Kit_Operativo.md`*  
*No reabrir decisiones cerradas (ver Checkpoint 2026-03-30 § 9)*
