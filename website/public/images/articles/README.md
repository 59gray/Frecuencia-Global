# Article Image Assets — Frecuencia Global

Esta carpeta contiene assets visuales derivados del contenido real de cada artículo.
Cada asset debe tener un brief operativo antes de ser generado.

## Convención de nombres

- `{slug}-thumbnail.png` — cards de archivo / frecuencia (16:9)
- `{slug}-featured-card.png` — señal destacada en home (16:9, mayor resolución)
- `{slug}-social-1200x630.png` — Open Graph / redes sociales

## Uso en frontmatter

```yaml
image:     "/images/articles/{slug}-thumbnail.png"
cardImage: "/images/articles/{slug}-featured-card.png"
ogImage:   "/images/articles/{slug}-social-1200x630.png"
```

## Reglas

- No subir placeholders ni imágenes genéricas sin relación con el artículo.
- No borrar assets referenciados en frontmatter sin actualizar el frontmatter primero.
- No generar assets sin brief visual (`ARTICLE_VISUAL_BRIEF.md`) previo.
- Todo asset debe validarse con HTTP 200 en preview local antes de commit.
- Todo asset debe quedar registrado en `ASSETS_MANIFEST.md` de su carpeta operativa.

## Brief y manifest por artículo

Cada artículo tiene su carpeta de documentación operativa en:

```
04_Produccion/articles/{slug}/
  ARTICLE_VISUAL_BRIEF.md   — brief derivado del contenido
  ASSET_PROMPTS.md          — prompts ComfyUI
  ASSETS_MANIFEST.md        — inventario y estado de assets
  QA_VISUAL_CHECKLIST.md    — checklist antes de commit
```

Ver estándar completo en:
`07_Operaciones/WEBSITE_ARTICLE_ASSET_WORKFLOW.md`
