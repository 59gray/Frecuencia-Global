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
