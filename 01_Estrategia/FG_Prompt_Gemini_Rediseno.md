# Prompt para Gemini Pro — Rediseño de Elementos Gráficos de Frecuencia Global

> Copia y pega el bloque de abajo en Gemini Pro. Usa las secciones por separado si necesitas generar elemento por elemento.
>
> Este archivo sigue siendo para identidad visual e imagen. Para preproducción y empaquetado de video usa `FG_Prompt_Gemini_Video_Producer.md`.

---

## PROMPT MAESTRO (contexto general — pegar siempre primero)

```
Eres un diseñador gráfico senior trabajando en el sistema visual de "Frecuencia Global", una marca de contenido digital que cubre geopolítica y actualidad internacional con estética de música electrónica (Dubstep/EDM).

IDENTIDAD VISUAL OBLIGATORIA:
- Fondo siempre negro o casi negro: #0A0A0F
- Color insignia: Cian Eléctrico #00E5FF (dominante en toda la marca)
- Segundo acento: Magenta Neón #FF00E5
- Tercer acento (solo punteos): Verde Ácido #B8FF00
- Superficie/cards: Grafito Azulado #1A1A2E
- Texto: Blanco #FFFFFF y Gris #A0A0B8
- Tipografía display: Bebas Neue en MAYÚSCULAS
- Tipografía body: Space Grotesk
- Tipografía data: JetBrains Mono

ESTÉTICA OBJETIVO:
- La energía visual de un flyer de festival de música electrónica (Tomorrowland, Dreamstate, Ultra)
- Combinada con la claridad y credibilidad de un medio editorial serio (Vox, The Economist)
- Elementos de VJ sets: waveforms, ecualizadores, glitch sutil, geometría digital
- UI de apps de música: Spotify dark mode, Serum synthesizer, Ableton
- Todo debe sentirse: oscuro, neón, limpio, contemporáneo, digital, reconocible

PROHIBIDO:
- Fondos claros o blancos
- Colores cálidos, pasteles o tierra
- Bordes redondeados excesivos
- Sombras corporativas tipo Material Design
- Texturas orgánicas (papel, madera, tela)
- Estética infantil, cartoon o clipart
- Exceso de elementos — la composición debe respirar
```

---

## PROMPT 1 — ISOTIPO / ÍCONO DE MARCA

```
Genera un isotipo (ícono) para "Frecuencia Global".

El ícono debe representar la fusión entre señal de frecuencia/onda de audio y conectividad global. Puede combinar:
- Una waveform o línea de ecualizador estilizada
- Un nodo o punto de señal con glow
- Una referencia sutil a lo global (sin usar un globo terráqueo literal — prefiero abstracción geométrica)

Especificaciones:
- Formato cuadrado, fondo #0A0A0F
- Color principal: Cian #00E5FF con efecto de glow/resplandor
- Acento opcional: Magenta #FF00E5 (máximo 20% de la composición)
- Estilo: minimalista pero con personalidad, limpio, geométrico, digital
- Debe funcionar a 64px (favicon) y a 512px (avatar de plataforma)
- Sin texto — solo el ícono

Referencias de estilo: íconos de apps de música como Serum, FL Studio, o logos de sellos de EDM como Monstercat, Ophelia Records, Disciple.
```

---

## PROMPT 2 — WORDMARK (LOGOTIPO TIPOGRÁFICO)

```
Genera el wordmark (logotipo tipográfico) de "FRECUENCIA GLOBAL".

Versión A — Una línea:
"FRECUENCIA GLOBAL" en tipografía sans-serif condensada tipo Bebas Neue, todo en MAYÚSCULAS, tracking ligeramente abierto (+3%), color blanco #FFFFFF sobre fondo #0A0A0F. Debajo del texto, una línea horizontal estilizada como waveform de audio en Cian #00E5FF con glow sutil.

Versión B — Apilado:
"FRECUENCIA" arriba y "GLOBAL" abajo, misma tipografía, centrado. La línea de frecuencia (waveform cian) como separador entre ambas palabras.

Especificaciones:
- Fondo: #0A0A0F
- Texto: Blanco #FFFFFF
- Línea de frecuencia: Cian #00E5FF, con picos de audio tipo ecualizador, glow al 30%
- Estilo limpio, editorial pero con energía digital
- La línea de frecuencia es el elemento firma de la marca — debe verse como una onda de audio real, no una línea plana genérica
```

---

## PROMPT 3 — LÍNEA DE FRECUENCIA (ELEMENTO INSIGNIA)

```
Genera el elemento gráfico insignia de la marca: la "Línea de Frecuencia".

Es una línea horizontal estilizada como waveform de audio / señal de ecualizador. Este elemento aparece en TODA pieza visual de la marca.

Especificaciones:
- Forma: línea con picos de frecuencia irregulares tipo audio waveform o ecualizador en vivo
- Color: Cian Eléctrico #00E5FF con outer glow al 30% del mismo color
- Fondo: #0A0A0F (negro)
- Grosor de línea base: 2-3px, picos variables en altura
- Estilo: no simétrica ni perfecta — debe sentirse como una señal real capturada en movimiento
- Generar 3 variantes: horizontal larga (para debajo de títulos), horizontal corta (separador), y una versión con fade en los extremos

Referencia: visualizadores de audio de Spotify, waveforms de SoundCloud, displays de sintetizadores como Serum o Massive.
```

---

## PROMPT 4 — NODO DE SEÑAL

```
Genera el componente "Nodo de Señal" de la marca Frecuencia Global.

Es un círculo pequeño luminoso que representa un punto de transmisión o señal activa.

Especificaciones:
- Círculo sólido de 12-16px de diámetro
- Color principal: Cian #00E5FF
- Efecto: outer glow difuso al 40% del color, radio del glow = 2x el tamaño del nodo
- Fondo: #0A0A0F
- Generar variantes en: Cian #00E5FF, Magenta #FF00E5, Verde Ácido #B8FF00, Azul #4A6BFF
- Debe parecer una señal encendida en un panel de control o un punto en un mapa de red

Generar también una composición con 3-4 nodos conectados por líneas finas (#FFFFFF al 10%) como si fueran nodos de una red global.
```

---

## PROMPT 5 — THUMBNAIL YOUTUBE (TEMPLATE)

```
Genera un template de thumbnail para YouTube de la marca Frecuencia Global.

Dimensiones: 1280 × 720 px
Fondo: #0A0A0F con grid de líneas finas (blanco al 4%) como textura sutil

Layout:
- Esquina superior izquierda: tag "[GEOPOLITIK DROP]" en JetBrains Mono, Cian #00E5FF, tamaño pequeño
- Esquina superior derecha: isotipo pequeño de la marca
- Centro-izquierda: título en 2 líneas máximo, tipografía condensada sans-serif tipo Bebas Neue, MAYÚSCULAS, blanco. UNA palabra clave en Cian #00E5FF para contraste.
- Debajo del título: línea de frecuencia (waveform cian con glow)
- Debajo de la línea: subtítulo en tipografía limpia sans-serif, color gris #A0A0B8

Ejemplo de contenido para el template:
Título: "IRÁN CIERRA EL ESTRECHO" (con "ESTRECHO" en cian)
Tag: [GEOPOLITIK DROP]
Subtítulo: "El bloqueo que puede disparar el petróleo · 2026"

Estilo: oscuro, neón, editorial, impactante. Como un flyer de festival electrónico pero informativo.
```

---

## PROMPT 6 — CARRUSEL INSTAGRAM (PORTADA)

```
Genera una portada de carrusel para Instagram de la marca Frecuencia Global.

Dimensiones: 1080 × 1350 px
Fondo: #0A0A0F con gradiente sutil hacia #1A1A2E en la parte inferior

Layout:
- Parte superior: tag "[GEOPOLITIK DROP]" en tipografía monoespaciada, Cian #00E5FF
- Centro: título principal en tipografía condensada MAYÚSCULAS, blanco, 2-3 líneas. Una palabra clave en color del pilar.
- Debajo del título: línea de frecuencia (waveform cian)
- Debajo: subtítulo corto en gris #A0A0B8
- Parte inferior: "FRECUENCIA GLOBAL" como wordmark pequeño

Ejemplo de contenido:
Tag: [GEOPOLITIK DROP]
Título: "5 CONFLICTOS QUE DEFINIRÁN 2026" (con "2026" en cian)
Subtítulo: "Mapa de riesgos geopolíticos"

Estilo: mismo sistema visual que el thumbnail pero adaptado a vertical. Oscuro, limpio, tipográfico.
```

---

## PROMPT 7 — SET DE FONDOS BASE

```
Genera un set de 5 fondos base para la marca Frecuencia Global. Cada uno en 1920×1080.

1. SÓLIDO CON GRID: Fondo #0A0A0F con grid de líneas rectas muy sutiles (blanco al 3-4%). Limpio, técnico.

2. GRADIENTE PROFUNDO: Gradiente vertical de #0A0A0F (arriba) a #1A1A2E (abajo). Sin grid. Elegante, simple.

3. HALO CIAN: Fondo #0A0A0F con un halo difuso de Cian #00E5FF en la esquina inferior derecha, como luz de neón fuera de cuadro. Sutil, atmosférico.

4. HALO MAGENTA: Igual que el anterior pero con Magenta #FF00E5 en la esquina superior izquierda.

5. DUAL NEÓN: Fondo #0A0A0F con halo cian en una esquina y magenta en la opuesta, creando tensión cromática diagonal. Para piezas destacadas o breaking news.

Todos deben sentirse como pantallas de un setup de DJ o la interfaz de un sintetizador. Oscuros, digitales, limpios.
```

---

## PROMPT 8 — BANNERS DE PLATAFORMA

```
Genera banners para las plataformas de Frecuencia Global.

BANNER YOUTUBE (2560 × 1440 px):
- Fondo: #0A0A0F con grid sutil
- Centro: wordmark "FRECUENCIA GLOBAL" en tipografía condensada MAYÚSCULAS, blanco
- Debajo del wordmark: línea de frecuencia (waveform cian #00E5FF con glow)
- Debajo: tagline "ANÁLISIS INTERNACIONAL CON PULSO ELECTRÓNICO" en tipografía sans-serif, gris #A0A0B8, tracking abierto
- Esquinas: nodos de señal cian con glow sutil
- Zona segura (1546×423 centro) debe contener toda la información importante

BANNER X/TWITTER (1500 × 500 px):
- Mismo sistema visual pero más compacto
- Wordmark centrado + línea de frecuencia + tagline
- Sin grid, fondo sólido #0A0A0F para máxima legibilidad a tamaño pequeño
```

---

## NOTAS DE USO

- Genera cada elemento por separado para mejor calidad.
- Si un resultado no cumple el sistema, indica qué ajustar referenciando los hex codes y reglas de este prompt.
- Pide variantes cuando haga falta: "dame 3 variantes del isotipo manteniendo los colores #00E5FF y #0A0A0F".
- Para pilares diferentes, cambia el color de acento: Cian (Geopolitik Drop), Magenta (Bass & Borders), Verde Ácido #B8FF00 (Frecuencia Global rápido), Azul #4A6BFF (Behind the Policy).

---

*Generado: 2026-03-24*
*Referencia técnica completa: FG_Brand_Kit_Operativo.md*
