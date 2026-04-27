# DETROIT_FEATURED_REDESIGN_REPORT
# D07 — Rediseño "Análisis destacado" + imagen hero
# 2026-04-25 | Frecuencia Global

---

## Componente modificado

`website/src/components/editorial/FeaturedBlock.astro`

### Cambios aplicados
- Layout: stack vertical (mobile) / grid `[1fr_0.85fr]` (desktop) — imagen a la derecha
- Badge superior: `SEÑAL DESTACADA` con dot pulsante cian
- Badge de pilar: `PillarPill` size md
- Badge condicional Detroit: `PILOTO FG` (detecta `DETROIT` en path de imagen)
- Microcopy Detroit hardcodeado: "De las fábricas de Detroit a las pistas del mundo..."
- Metadata footer: pilar tag · "Detroit" · fecha
- CTA: "Leer análisis →"
- Imagen: panel derecho con overlay cian/magenta + grayscale + label "Detroit · Bass & Borders"
- Accent bar superior: gradiente horizontal cian/50
- Sin placeholder. Sin texto falso. Sin rediseño de otras secciones.

---

## ComfyUI — Generación imagen hero

### Endpoint
`http://127.0.0.1:8000` (ComfyUI v0.19.5)

### Modelo
`sdxl\sd_xl_base_1.0.safetensors`

### Dimensiones
`896 × 512` (wide editorial 16:9 aprox.)

### Prompt positivo
```
Detroit techno origin, abandoned industrial architecture at night, Belleville Three era,
Afro-diasporic electronic music culture, analog synthesizer silhouette,
manga editorial illustration, high contrast black and white lineart,
cinematic wide 16:9 composition, industrial urban landscape, empty streets, smokestack skyline,
dramatic chiaroscuro lighting, subtle cyan signal glow, magenta accent streak,
Frecuencia Global editorial feature image, documentary tone,
no readable text, no logos, no watermark, serious artistic quality
```

### Prompt negativo
```
fake readable text, watermark, logo, blurry, low resolution,
generic EDM festival crowd, Las Vegas mainstage, random typography,
distorted buildings, deformed humans, extra limbs, political symbols,
brand logos, messy neon clutter, nsfw, bad anatomy, cartoon chibi, anime kawaii
```

### Sampler
- KSampler: dpmpp_2m / karras / steps=35 / cfg=7.5

### Outputs generados

| Seed | Archivo | Tamaño | Ruta |
|------|---------|--------|------|
| 2025 | FG_DETROIT_FEATURED_v1_s2025_00001_.png | 540 KB | D:\FrecuenciaGlobal\AV\Detroit\D07_Featured_Redesign\ |
| 7734 | FG_DETROIT_FEATURED_v1_s7734_00001_.png | 555 KB | D:\FrecuenciaGlobal\AV\Detroit\D07_Featured_Redesign\ |
| 909  | FG_DETROIT_FEATURED_v1_s909_00001_.png  | 630 KB | D:\FrecuenciaGlobal\AV\Detroit\D07_Featured_Redesign\ |

### Recomendado técnico
`seed=909` — mayor peso = mayor detalle en lineart y composición.

### Asset canónico copiado como
`website/public/images/articles/FG_DETROIT_FEATURED_REDESIGN_v1.png`

---

## Build

- **PASS** — 27 páginas en 14.95s
- Sin errores de TypeScript ni Astro

---

## Git

| Commit | Descripción |
|--------|-------------|
| `44b03cd` | ui: redesign Detroit featured analysis block and refine nav copy |
| `ba038ef` | feat: add Detroit featured redesign image and update article frontmatter |

Push: `15bd780..ba038ef` → `origin/main` ✅

---

## Estado

**READY_FOR_HUMAN_REVIEW**

### Pendiente humano
- Revisar visualmente los 3 candidatos en `D:\FrecuenciaGlobal\AV\Detroit\D07_Featured_Redesign\`
- Confirmar si `s909` es el candidato final o elegir otro seed
- Si se elige otro seed: copiar manualmente como `FG_DETROIT_FEATURED_REDESIGN_v1.png`

### No tocado
- Hero del artículo individual Detroit (layout del artículo)
- Header/nav (salvo copy aprobado antes)
- Otras secciones del homepage
- n8n, Notion, credenciales, scheduler
- Assets anteriores `FG_DETROIT_*` existentes

---

*Generado: 2026-04-25 | Cascade Windsurf*
