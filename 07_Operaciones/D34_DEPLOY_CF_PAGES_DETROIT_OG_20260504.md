# D34 — Deploy manual Cloudflare Pages (Detroit OG v02)

**Fecha:** 2026-04-27 (UTC-06 ejecución local)  
**Tipo:** Deploy manual controlado (`wrangler pages deploy`), sin Git Provider en Pages.

---

## Objetivo

Publicar el estado de `origin/main` en Cloudflare Pages para que producción refleje **OG v02 Detroit** (`FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png`).

---

## Pre-deploy

| Paso | Resultado |
|------|-----------|
| Rama | `main` |
| `git pull --ff-only origin main` | Already up to date |
| **HEAD** | **dec60b0** |
| `git status --short` | Working tree limpio (sin cambios antes del cierre documental) |

---

## Build

| Campo | Valor |
|-------|--------|
| Directorio | `website/` |
| Comando | `npm run build` |
| Resultado | **PASS** (Astro static, 27 páginas) |

---

## Verificaciones pre-upload

| Verificación | Resultado |
|--------------|-----------|
| `dist/images/articles/FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png` | **Presente** |
| `dist/.../techno-detroit-historia-musica-electronica/index.html` → `og:image` | `https://frecuenciaglobal.org/images/articles/FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png` |
| Mismo archivo → `twitter:image` | Igual que `og:image` |

---

## Deploy

| Campo | Valor |
|-------|--------|
| Comando | `npx wrangler pages deploy dist --project-name frecuencia-global --branch main` |
| Wrangler | 4.81.0 |
| Upload | 35 archivos nuevos / 115 totales referenciados en salida |
| **URL deployment (preview Pages)** | **https://18bf50a3.frecuencia-global.pages.dev** |
| Proyecto | `frecuencia-global` |

---

## Post-deploy (producción)

Comprobaciones sobre dominio canónico:

| URL | Resultado |
|-----|-----------|
| `https://www.frecuenciaglobal.org/contenido/techno-detroit-historia-musica-electronica/` | HTML con `og:image` y `twitter:image` → **FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png** |
| `https://www.frecuenciaglobal.org/images/articles/FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png` | **HTTP 200**, **Content-Type: image/png**, Content-Length ~1.35 MB |

Sin fallback HTML para el PNG (respuesta binaria PNG correcta).

---

## Estado anterior (contexto D33)

- Production anterior referenciaba commit **651f25d** y OG antiguo `techno-detroit-og.png`.
- Pages sin Git Provider: pushes a `main` no disparaban deploy automático.

---

## Alcance y límites operativos (D34)

Ejecutado sin: cambios DNS, cambios en settings de Cloudflare, variables de entorno, secretos, commits en repo, Notion, APIs externas fuera del deploy, borrado de deployments, conexión de GitHub.

---

## Git tras añadir este archivo

El presente markdown se añade como evidencia ops; **commit pendiente de autorización explícita** según instrucción D34.
