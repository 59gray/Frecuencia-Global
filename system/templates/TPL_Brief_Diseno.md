# TEMPLATE — Brief de Diseño

**Sistema:** Frecuencia Global  
**Código:** TPL_Brief_Diseno  
**Usado por:** Scriptwriting Agent → Design Production Agent

---

> **Instrucciones:** Este brief es el handoff de textos y dirección visual a Design Production. Todos los textos deben estar finales y aprobados. Design Production no edita textos, solo los integra.

---

## IDENTIFICACIÓN

| Campo | Valor |
|-------|-------|
| **ID de pieza** | FG-[YYYY]-[WXX]-[##] |
| **Fecha** | [YYYY-MM-DD] |
| **Autor** | [nombre] |
| **Deadline de diseño** | [YYYY-MM-DD] |
| **Brief de contenido ref.** | [ID del brief original] |

---

## ESPECIFICACIONES

| Campo | Valor |
|-------|-------|
| **Formato** | [ ] Thumbnail YT · [ ] Carrusel IG · [ ] Reel/TikTok · [ ] Post estático · [ ] Banner · [ ] Story |
| **Dimensiones** | [ej. 1280×720 / 1080×1350 / 1080×1920] |
| **Pilar** | [ ] Geopolitik Drop · [ ] Bass & Borders · [ ] Frecuencia Global · [ ] Behind the Policy |
| **Color dominante** | [ ] Cian #00E5FF · [ ] Magenta #FF00E5 · [ ] Verde ácido #B8FF00 · [ ] Azul #4A6BFF |
| **Cantidad de archivos** | [ej. "8 slides" o "1 thumbnail"] |
| **Package de video adjunto** | [ ] No aplica · [ ] Sí -> storyboard + editing brief + subtítulos + thumbnail brief |

---

## TEXTOS FINALES

### Para Thumbnail / Post estático:

| Elemento | Texto exacto |
|----------|-------------|
| **Título principal** | [TEXTO EN MAYÚSCULAS PARA BEBAS NEUE] |
| **Subtítulo** | [subtítulo si aplica] |
| **Metadata** | [ej. "[GEOPOLITIK DROP] · 2026-03-30"] |
| **Tag de pilar** | [texto del pill] |

### Para Carrusel (un bloque por slide):

**Slide 1 (Cover):**
| Elemento | Texto exacto |
|----------|-------------|
| Título | [máx. 8 palabras] |
| Subtítulo | [máx. 12 palabras] |

**Slide 2:**
| Elemento | Texto exacto |
|----------|-------------|
| Dato/título | [texto destacado] |
| Explicación | [máx. 40 palabras] |
| Fuente (si aplica) | [fuente] |

**Slide 3:**
| Elemento | Texto exacto |
|----------|-------------|
| Dato/título | [texto destacado] |
| Explicación | [máx. 40 palabras] |

*(Repetir para cada slide adicional)*

**Slide final (CTA):**
| Elemento | Texto exacto |
|----------|-------------|
| CTA principal | [ej. "Guarda este post"] |
| CTA secundario | [ej. "Comenta: ¿qué opinas?"] |

### Para Reel/TikTok — Textos en pantalla:

| Timestamp | Texto en pantalla |
|-----------|-------------------|
| 0:00-0:03 | [texto hook] |
| 0:03-0:10 | [texto contexto] |
| 0:10-0:30 | [dato 1] |
| 0:30-0:50 | [dato 2] |
| 0:50-0:60 | [CTA] |

**Si la pieza usa la capa formal de video:**  
Adjuntar además:
- `TPL_Video_Storyboard.md`
- `TPL_Video_Editing_Brief.md`
- `TPL_Video_Subtitles_OnScreen.md`
- `TPL_Video_Thumbnail_Brief.md`

---

## DIRECCIÓN VISUAL

| Campo | Indicación |
|-------|-----------|
| **Background sugerido** | [ej. DarkGrid, CyanField, PolicyField] |
| **Elementos decorativos** | [ej. "frequency line inferior + 2 signal nodes"] |
| **Imágenes/Gráficos** | [ej. "mapa de la región X", "gráfico de barras con dato Y"] |
| **Referencia visual** | [link a pieza anterior similar o descripción del look] |
| **Notas de composición** | [instrucciones adicionales si las hay] |

---

## CAPTION Y METADATA (para publicación)

| Campo | Texto |
|-------|-------|
| **Caption** | [texto completo del caption] |
| **Hashtags** | [lista de hashtags] |
| **Título YT** (si aplica) | [<60 caracteres] |
| **Descripción YT** (si aplica) | [con timestamps y fuentes] |

---

## ARCHIVOS ADJUNTOS

| Archivo | Descripción |
|---------|-------------|
| [nombre] | [qué es: foto, gráfico, dato visual] |
| [nombre] | [qué es] |

---

## NAMING DE SALIDA

Archivos exportados deben seguir:
```
FG_[PILAR]_[FORMATO]_[TEMA]_[VERSION].png/mp4
```

Ejemplo: `FG_GD_Carousel_CablesSubmarinos_v1_01.png`

Códigos de pilar: GD (Geopolitik Drop), BB (Bass & Borders), FG (Frecuencia Global), BP (Behind the Policy)

---

*Brief de diseño entregado por: [nombre] — Fecha: [fecha]*
