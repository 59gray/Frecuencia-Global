# Frecuencia Global — Website

Sitio web oficial de **Frecuencia Global**: análisis internacional con estética de club nocturno, archivo editorial y ahora también archivo público del podcast/videopodcast.

## Stack

- **Framework:** [Astro](https://astro.build) v6
- **Estilos:** [Tailwind CSS](https://tailwindcss.com) v4
- **Contenido:** Astro Content Collections (Markdown)
- **Hosting:** [Vercel](https://vercel.com) (free tier)
- **Fuentes:** Bebas Neue, Space Grotesk, JetBrains Mono (auto-hospedadas via Fontsource)

## Desarrollo local

```bash
cd website
npm install
npm run dev
```

El servidor de desarrollo se levanta en `http://localhost:4321`.

## Build de producción

```bash
npm run build
npm run preview
```

Los archivos estáticos se generan en `dist/`.

## Estructura

```text
src/
├── components/     # Header, Footer, Hero, ArticleCard, EpisodeCard, PillarPill, etc.
├── content/
│   ├── articles/   # Artículos en Markdown con frontmatter
│   └── podcast/    # Episodios del podcast/videopodcast
├── layouts/        # BaseLayout, ArticleLayout, EpisodeLayout
├── pages/
│   ├── index.astro
│   ├── sobre.astro
│   ├── contacto.astro
│   ├── contenido/
│   ├── podcast/
│   ├── pilares/
│   ├── rss.xml.ts
│   └── podcast/rss.xml.ts
└── styles/
    └── global.css
```

## Añadir contenido editorial

Crea un archivo `.md` en `src/content/articles/` con este frontmatter:

```md
---
title: "Título del artículo"
description: "Descripción corta"
date: 2026-04-01
pilar: p1
tags: ["tag1", "tag2"]
image: "/images/articles/mi-imagen.jpg"
draft: false
---

Contenido en Markdown aquí...
```

## Añadir un episodio

Crea un archivo `.md` en `src/content/podcast/` con este frontmatter:

```md
---
title: "Frecuencia Global Podcast 001"
description: "Descripción corta del episodio"
publishDate: 2026-04-02
pilar: p1
season: 1
episodeNumber: 1
duration: "18:42"
audioUrl: "https://cdn.example.com/audio/ep-001.mp3"
audioBytes: 12345678
coverImage: "/images/og/fg_website_hero_20260402_v1.webp"
youtubeVideoId: "VIDEO_ID"
videoMode: editorial-visualizer
explicit: false
draft: false
platformLinks:
  spotify: "https://open.spotify.com/..."
  apple: "https://podcasts.apple.com/..."
  youtube: "https://youtube.com/watch?v=VIDEO_ID"
---

Show notes en Markdown aquí...
```

## Pilares

| ID  | Nombre            | Color   |
|-----|-------------------|---------|
| p1  | Geopolitik Drop   | Cyan    |
| p2  | Bass & Borders    | Magenta |
| p3  | Frecuencia Global | Verde   |
| p4  | Behind the Policy | Azul    |

## Feeds

- Artículos: `/rss.xml`
- Podcast: `/podcast/rss.xml` (secundario si el host principal es RSS.com)

## Deploy a Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Framework preset: **Astro**
3. Root directory: `website`
4. Deploy automático en cada push

URL temporal: `https://frecuenciaglobal.vercel.app`
Nota: para podcast podemos operar con RSS.com como host principal y usar el sitio como soporte editorial.

## Contacto

El formulario de contacto usa [Formspree](https://formspree.io). Para activarlo, reemplaza `[PLACEHOLDER]` en `src/components/ContactForm.astro` con tu ID de Formspree.
