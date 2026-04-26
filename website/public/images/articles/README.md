# Article Image Assets — Frecuencia Global

## Convención de nombres

- `{slug}-thumbnail.png` — cards de archivo / frecuencia (16:9)
- `{slug}-featured-card.png` — señal destacada en home (16:9, mayor resolución)
- `{slug}-social-1200x630.png` — Open Graph / redes sociales

## Uso en frontmatter

```yaml
image: "/images/articles/{slug}-thumbnail.png"
cardImage: "/images/articles/{slug}-featured-card.png"
ogImage: "/images/articles/{slug}-social-1200x630.png"
```

## Criterios

- Ratio 16:9 para cards
- Sin texto incrustado grande
- Sin logos externos
- Generados con ComfyUI o assets editoriales propios
- Validar HTTP 200 antes de deploy
