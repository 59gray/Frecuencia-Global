# WEBSITE PUBLIC BASELINE — 2026-04-26

## Estado
WORKSPACE ALINEADO CON VERSIÓN PÚBLICA

---

## Identificación de fuente

| Campo | Valor |
|-------|-------|
| Rama fuente | `rescue/restore-home-production-look-20260425` |
| Commit fuente (HEAD) | `e874e9c` |
| Commit recuperado base | `fc384d7` ("chore: establish repaired local baseline") |
| Entry point | `website/src/pages/index.astro` |
| Componente hero | `HomeFold` (no `Hero`) |
| Framework | Astro v6.1.2 + Tailwind v4 |
| Build | PASS — 27 páginas, EXIT 0, 0 errores |

---

## Evidencia textual (5/5 señales confirmadas)

| Señal | Archivo | Línea |
|-------|---------|-------|
| "Marca paraguas con cuatro pilares editoriales" | `website/src/pages/index.astro` | 94 |
| "Accesos al sistema" | `website/src/pages/index.astro` | 117 |
| `headline="Análisis destacado"` | `website/src/pages/index.astro` | 129 |
| "Frame editorial" | `website/src/components/editorial/HomeFold.astro` | 103 |
| "El techno nació en Detroit" | `website/src/content/articles/techno-detroit-historia-musica-electronica.md` | 2 |

---

## Preview validado

| Item | Valor |
|------|-------|
| URL local | `http://127.0.0.1:4322/` |
| Producción comparada | `https://frecuenciaglobal.org` |
| Coincidencia visual | 7/7 elementos clave presentes |

---

## Assets locales faltantes

### Carpeta `public/images/hero/` — NO EXISTE localmente

Referenciados en source pero ausentes en `website/public/`:

| Asset | Referenciado en | Impacto |
|-------|----------------|---------|
| `/images/hero/fg-hero-atmosphere-grid.png` | `HomeFold.astro:35`, `FeaturedBlock.astro:76`, `DetroitBillboardHero.astro:14`, `podcast/index.astro:70` | Capa de atmósfera del hero (degradea a fondo oscuro) |
| `/images/hero/fg-hero-atmosphere-cyan.png` | `HomeFold.astro:43`, `index.astro:214` | Capa cyan del hero (decorativa) |
| `/images/hero/fg-hero-atmosphere-frame.png` | `HomeFold.astro:46` | Capa frame del hero (decorativa) |

### Assets presentes en `public/` (no faltantes)
- `/images/system/fg-overlay-hero-master.svg` — ✅ existe en `public/images/system/`
- `/images/sections/fg-section-radar.png` — ✅ existe en `public/images/sections/`

### Assets adicionales con 404 en dev (menor prioridad)
- `/images/articles/techno-detroit-hero.png` — referenciado en artículo Detroit
- `/images/components/cards/template-featured-1200x630.svg` — placeholder de card

El layout y el copy funcionan correctamente sin estos assets (degradan gracefully a fondo oscuro). La paridad visual completa con producción requiere crear la carpeta `website/public/images/hero/` y recuperar/re-generar los 3 PNGs de atmósfera.

---

## Archivos legacy — NO usar para home

Los siguientes componentes pertenecen al home antiguo y NO deben ser el entry point del index:

- `website/src/components/Hero.astro` — hero antiguo (título "FRECUENCIA GLOBAL" en mayúsculas)
- `website/src/components/PillarSection.astro` — sección de pilares antigua

Conservar en repo, no eliminar. Solo asegurarse de que `website/src/pages/index.astro` importe `HomeFold`, no `Hero`.

---

## Causa raíz del desfase histórico

La rama `rescue/` heredó el `index.astro` de `main` (`949d702`), que usaba `<Hero>`. El commit `fc384d7` tenía el home correcto con `<HomeFold>` pero nunca fue incluido en la cadena de commits de `rescue/`. La restauración aplicada en `e874e9c` sincronizó todo `website/src/` desde `fc384d7`.

---

## Pendientes antes de deploy

1. Recuperar assets de atmósfera del hero (listados arriba) — sin ellos el hero funciona pero la capa visual de fondo queda degradada.
2. Abrir y mergear PR `rescue/` → `main` para que `main` deje de estar desactualizada.
3. Verificar que Cloudflare Pages esté configurado para deployar desde `main` (o desde `rescue/` temporalmente).
