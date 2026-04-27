# Website Article Asset Workflow — Frecuencia Global

---

## Estándar de derivación visual por artículo

### Regla madre

Ningún thumbnail o asset de artículo debe generarse sin antes crear un brief visual derivado del contenido del artículo.

No usar imágenes genéricas tipo "cyber, dark, cyan, geopolitics". El asset debe salir del material de cada pieza: tesis, conceptos, lugar, tensión, objetos concretos, tono, símbolos permitidos y prohibidos.

### Flujo obligatorio

```
Artículo → lectura de contenido → ARTICLE_VISUAL_BRIEF.md → ASSET_PROMPTS.md → generación ComfyUI → QA_VISUAL_CHECKLIST.md → asset final → ASSETS_MANIFEST.md
```

No saltarse pasos.

### Componentes del brief visual (ARTICLE_VISUAL_BRIEF.md)

1. Slug del artículo
2. Título
3. Frecuencia
4. Source file
5. Tesis central (3–5 líneas derivadas del artículo)
6. Tesis visual (una frase: qué debe comunicar la imagen)
7. Conceptos clave extraídos del artículo
8. Elementos visuales permitidos
9. Elementos visuales prohibidos
10. Dirección de color alineada con la frecuencia
11. Composición (ratio, uso, legibilidad en pequeño)
12. Usos del asset: featured card / thumbnail / social preview

### Método de generación

- **ComfyUI** es el método preferente para todos los assets.
- Fallbacks creativos (Pillow, placeholders, stock) requieren autorización humana explícita.
- No generar masivamente. Un artículo por pasada.

### Estructura de carpeta por artículo

```
04_Produccion/articles/{slug}/
  ARTICLE_VISUAL_BRIEF.md
  ASSET_PROMPTS.md
  ASSETS_MANIFEST.md
  QA_VISUAL_CHECKLIST.md
```

### Convención de nombres de assets

```
website/public/images/articles/{slug}-featured-card.png    # señal destacada en home
website/public/images/articles/{slug}-thumbnail.png        # cards de archivo / frecuencia
website/public/images/articles/{slug}-social-1200x630.png  # Open Graph / redes
```

El frontmatter del artículo debe apuntar a estas rutas exactas:

```yaml
image:     "/images/articles/{slug}-thumbnail.png"
cardImage: "/images/articles/{slug}-featured-card.png"
ogImage:   "/images/articles/{slug}-social-1200x630.png"
```

### Reglas de calidad

1. Todo asset deriva del contenido real del artículo.
2. Ningún asset tiene texto grande incrustado si el HTML ya muestra el título.
3. Ratio 16:9 para cards y thumbnail. 1200x630 para OG.
4. Sin logos externos ni marcas identificables.
5. Sin imágenes realistas de personas específicas sin autorización.
6. Todo asset debe responder HTTP 200 en preview local antes del commit.
7. Todo asset debe quedar registrado en ASSETS_MANIFEST.md.
8. No subir placeholders al repositorio.
9. No borrar assets referenciados en frontmatter sin actualizar primero el frontmatter.

---

## Método Serena → ComfyUI para visuales editoriales

**Introducción:** A partir de 2026-04-26, el método oficial para generar imágenes de dossiers, artículos destacados y thumbnails es la integración de **Serena** (análisis semántico) con **ComfyUI** (generación AI).

Este método garantiza que cada imagen derive del contenido verificado, no de intuición estética.

### Paso 1: Análisis semántico (SERENA)

**Crear archivo:**
```
04_Produccion/dossiers/{DOSSIER}/SERENA_VISUAL_EXTRACTION.md
OR
04_Produccion/articles/{ARTICLE}/SERENA_VISUAL_EXTRACTION.md
```

**Serena extrae del contenido:**
- Conceptos núcleo (tesis central, tensiones, entidades)
- Entidades visuales permitidas (qué objetos son válidos)
- Metáforas visuales válidas (opciones de composición)
- Metáforas prohibidas (qué evitar absoluto)
- Símbolos concretos (nucleares y secundarios)
- Atmósfera (tiempo, temperatura, densidad, ritmo, volumen, futuro)
- Composición (ratio, profundidad, punto focal, distribución de luz)
- Paleta (colors vinculados a contenido, no genéricos)
- Prompt atoms (bloques constructivos para ComfyUI)

### Paso 2: Generar ComfyUI Prompt

**Crear archivo:**
```
04_Produccion/dossiers/{DOSSIER}/COMFYUI_DOSSIER_PROMPT.md
OR
04_Produccion/articles/{ARTICLE}/COMFYUI_ARTICLE_PROMPT.md
```

**Secciones:**
- **Intent:** Propósito de la imagen
- **Positive prompt:** Derivado de Serena atoms (100-150 palabras)
- **Negative prompt:** Qué prohibir (80-100 palabras)
- **Technical:** Model (SDXL 1.0 recomendado), Sampler (DPM++ 2M Karras), Steps (32), CFG (8.0), Resolution, Seed, Format (PNG)
- **Quality gates:** Checklist de validación (no text, no people, landmarks abstractos, paleta, composición, contraste, formato)
- **Generation plan:** Hasta 2 intentos máximo

### Paso 3: Generar con ComfyUI

**Script Python:**
```
scripts/comfyui_{dossier|article}_{name}.py
```

**Flujo:**
1. Verificar ComfyUI disponible (`GET /system_stats`)
2. Construir workflow (CheckpointLoader → CLIP → KSampler → VAEDecode → SaveImage)
3. Queue prompt (`POST /prompt`)
4. Poll history (`GET /history/{prompt_id}`)
5. Copiar output de ComfyUI a ruta exacta: `website/public/images/dossiers|articles/{slug}.png`
6. Registrar metadata: seed, steps, CFG, timestamp

**Si ComfyUI no responde:**
- STOP — no generar fallback
- Reportar BLOQUEADO
- No usar Pillow, SVG, CSS como asset final creativo

### Paso 4: Integrar en HTML

**Patrón Astro:**
```astro
<img 
  src="/images/dossiers/{dossier-slug}.png"
  alt="[Alt text descriptivo en español]"
  class="w-full h-full object-cover"
  onerror="this.style.display='none'"
/>
<!-- SVG fallback debajo si existe -->
```

### Paso 5: Validar

```bash
cd website
npm run build
```

**Checklist:**
- [ ] Build PASS
- [ ] Imagen existe en `dist/images/`
- [ ] PNG válido (>1MB)
- [ ] Preview local: imagen cargada, sin 404
- [ ] Visible en desktop y mobile

### Paso 6: Documentar

**Crear/actualizar:**
```
04_Produccion/dossiers|articles/{SLUG}/ASSETS_MANIFEST.md
```

**Tabla:**
| Asset | Path | Source Method | Content Basis | Status | Validation |
|---|---|---|---|---|---|
| Visual | `website/public/images/...` | ComfyUI | SERENA extraction + COMFYUI prompt | ✅ | PNG, dimensiones, seed |
| Serena | `.../SERENA_VISUAL_EXTRACTION.md` | Análisis semántico | Briefs verificados | ✅ | Conceptos, entidades, metáforas |
| Prompt | `.../COMFYUI_PROMPT.md` | Derivado de Serena | Positive/negative atoms | ✅ | Reproducible |

### Ejemplo: Bass & Borders Dossier (2026-04-26)

1. **Serena:** SERENA_VISUAL_EXTRACTION.md (Detroit raíz material, Berghain umbral, señal como objeto, sin clichés)
2. **Prompt:** COMFYUI_DOSSIER_PROMPT.md (industrial city, signal wave, concrete, cyan/magenta, no text/people/logos)
3. **Generación:** 1 intento, seed 2026, SDXL, 1920×1080, 32 steps, CFG 8.0
4. **Deploy:** `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.png`
5. **Integración:** `website/src/pages/pilares/[slug].astro`
6. **Build:** ✅ PASS
7. **Result:** Imagen visible, metafóricamente coherente, libre de clichés

### Para futuros pilares

1. Copiar estructura: `scripts/comfyui_dossier_bass_borders.py` → `scripts/comfyui_dossier_p1_p3_p4.py`
2. Crear Serena extraction para cada pilar
3. Derivar ComfyUI prompt
4. Generar y validar
5. Documentar en ASSETS_MANIFEST.md
6. Integrar en template `.astro`

**Método replicable y auditable. Cada asset traceable a su origen semántico.**

---

## Thumbnails por frecuencia

### Convención de nombres

```
website/public/images/articles/{slug}-thumbnail.png      # cards de frecuencia / archivo
website/public/images/articles/{slug}-featured-card.png  # señal destacada en home
website/public/images/articles/{slug}-social-1200x630.png # redes sociales OG
```

### En frontmatter del artículo

```yaml
image: "/images/articles/{slug}-thumbnail.png"       # imagen principal / OG fallback
cardImage: "/images/articles/{slug}-featured-card.png" # override para cards (opcional)
ogImage: "/images/articles/{slug}-social-1200x630.png" # override para OG (opcional)
```

### Criterios de calidad

- Formato: PNG o WebP
- Ratio: 16:9 para cards, 1200x630 para OG
- Sin texto incrustado grande (el HTML ya muestra el título)
- Sin logos externos
- Estética compatible con la frecuencia (cyan para p1, púrpura para p2, verde para p3, dorado para p4)
- Validar HTTP 200 en preview antes de commit

### Generación con ComfyUI

- Solo si ComfyUI está corriendo y hay autorización explícita
- Script base: `scripts/comfy_thumbnails_batch.py`
- Sin texto incrustado, sin marcas externas
- Guardar en `website/public/images/articles/`
- Documentar seed y prompt en el script

## Estado por frecuencia (2026-04-26)

### p1 — Geopolitik Drop

| Artículo | Slug | cardImage | Estado |
|---|---|---|---|
| Los cables submarinos | cables-submarinos-geopolitica-internet | cables-submarinos-geopolitica-internet.png | OK |
| DSA y soberanía digital | eu-act-digital-soberania | — | PENDIENTE thumbnail |

### p2 — Bass & Borders

| Artículo | Slug | cardImage | Estado |
|---|---|---|---|
| Detroit: historia del techno | techno-detroit-historia-musica-electronica | FG_BASS_BORDERS_DETROIT_CARD_v2.png | OK |
| Berghain: reglas y no fotos | berghain-reglas-no-fotos | FG_BASS_BORDERS_BERGHAIN_CARD_v2.png | OK |

### p3 — Frecuencia Global (señal corta)

| Artículo | Slug | cardImage | Estado |
|---|---|---|---|
| Streaming y regalías | streaming-regalias-artistas | streaming-regalias-artistas.png | OK |
| RSS y protocolos abiertos | rss-open-protocolo | — | PENDIENTE thumbnail |

### p4 — Behind the Policy

| Artículo | Slug | cardImage | Estado |
|---|---|---|---|
| Chips Act y semiconductores | chips-act-semiconductores-eu | — | PENDIENTE thumbnail |
| Ticketing y comisiones | ticketing-plataformas-comision | ticketing-plataformas-comision.png | OK |
