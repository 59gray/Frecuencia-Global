# Website Article Asset Workflow — Frecuencia Global

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
