# D17 — Decisión sobre `website/netlify.toml`

**Fecha:** 2026-05-04  
**Rama:** `feature/geopolitik-drop-cards-thumbnails-20260426`

---

## Estado Git

- **Antes de D17:** un único `??` → `website/netlify.toml`
- **Política:** sin push, sin deploy, sin APIs, sin credenciales, sin Netlify UI / Cloudflare dashboard.

---

## Contenido funcional de `website/netlify.toml` (resumen)

| Sección | Valor | Rol |
|---------|--------|-----|
| `[build]` | `command = "npm run build"` | Misma orden que `website/package.json` → `astro build`. |
| `[build]` | `publish = "dist"` | Salida estática estándar de Astro (`output: static` / `dist/`). |
| `[build.environment]` | `NODE_VERSION = "22"` | Alineado con `package.json` → `engines.node` ≥ 22.12. |

**Secretos:** ningún token, variable de entorno secreta ni nombre de archivo sensible; solo configuración de build pública.

---

## Comparación con Astro y Cloudflare

| Artefacto | Observación |
|-----------|-------------|
| `website/astro.config.mjs` | Define `site`, Vite/Tailwind, integración sitemap — **no** define proveedor de hosting ni duplica `netlify.toml`. |
| `website/wrangler.toml` | **No presente** en el árbol actual; la documentación ops (p. ej. `API_CONTROL_PANEL.md`) referencia Cloudflare Pages + Wrangler como ruta operativa. |
| `netlify.toml` | Configura **solo** el pipeline de build para Netlify; **no** sustituye Wrangler ni CF Pages. |

**Conclusión:** `netlify.toml` es **configuración opcional de proveedor** (Netlify), no residuo de migración con datos sensibles. La producción documentada sigue siendo **Cloudflare Pages**; este archivo puede servir para previews Netlify o referencia histórica sin conflicto con `astro.config.mjs`.

---

## Decisión tomada

**Versionar** `website/netlify.toml` en el repositorio **tal cual** (sin editar contenido), como referencia explícita de cómo construir el sitio en Netlify si se usa ese proveedor. La autoridad de deploy en producción no cambia (sigue documentada en ops para Cloudflare).

**No** se añade entrada en `.gitignore` para este archivo.

---

## Archivos del commit D17

| Archivo | Acción |
|---------|--------|
| `website/netlify.toml` | Añadido al índice (primera versión en repo). |
| `07_Operaciones/D17_DECISION_NETLIFY_TOML_20260504.md` | Este cierre. |

**Mensaje de commit:** `chore(website): document Netlify config decision`

**SHA:** obtener con `git rev-parse HEAD` tras el commit en esta rama (evitar autopersistir si hay amend).

---

## `git status` esperado tras D17

Árbol de trabajo limpio respecto a sin seguimiento (`??` vacío para estos artefactos).

---

## Confirmación

Sin deploy, sin push, sin modificación de dashboards Netlify/Cloudflare, sin APIs, sin exposición de secretos.
