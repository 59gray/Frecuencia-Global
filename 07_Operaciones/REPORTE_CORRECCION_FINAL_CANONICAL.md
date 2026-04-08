# REPORTE DE CORRECCIÓN FINAL — CANONICAL Y METATAGS

**Fecha:** 2026-04-07  
**Estado:** COMPLETADO — Build verificado localmente  
**Commit requerido:** Sí, para deploy en Vercel  

---

## 1) Hallazgo raíz

El problema NO era hardcodeo en el código fuente, sino un **build antiguo** en `website/dist/` generado cuando `astro.config.mjs` tenía `site: 'https://59gray.github.io'`.

**Evidencia encontrada:**
- `website/dist/sitemap-0.xml` contenía 18 URLs con `https://59gray.github.io/`
- `website/dist/index.html` tenía canonical y OG tags apuntando al dominio viejo
- El código fuente en `src/` estaba correcto: usa `Astro.site` dinámicamente

**Segunda incidencia detectada:**
- `website/src/pages/podcast/rss.xml.ts` línea 42 tenía email hardcodeado: `contacto@frecuenciaglobal.mx`

---

## 2) Cambios aplicados

| Archivo | Línea/Sección | Valor anterior | Valor nuevo | Motivo |
|---------|---------------|----------------|-------------|--------|
| `podcast/rss.xml.ts` | 42 | `contacto@frecuenciaglobal.mx` | `contact@frecuenciaglobal.org` | Unificación email institucional |

**Build regenerado:** `npm run build` ejecutado exitosamente. Nuevo `dist/` validado.

---

## 3) Búsqueda residual

### Dominios viejos en `src/`

| Cadena | Resultado | Ubicación | Acción |
|--------|-----------|-----------|--------|
| `59gray.github.io` | ❌ No encontrado | — | — |
| `59gray` | ✅ 2 matches | `stack.astro` línea 250 | **No cambiar** — es enlace al perfil GitHub legítimo |
| `frecuenciaglobal.vercel.app` | ❌ No encontrado | — | — |
| `frecuenciaglobal.mx` | ❌ No encontrado | — | — |
| `is-a.dev` | ❌ No encontrado | — | — |

### Estado en nuevo `dist/` (post-build)

| Elemento | Valor detectado | Estado |
|----------|-----------------|--------|
| Sitemap URLs | `https://frecuenciaglobal.org/*` | ✅ CORRECTO |
| Robots sitemap | `https://frecuenciaglobal.org/sitemap-index.xml` | ✅ CORRECTO |
| RSS podcast email | `contact@frecuenciaglobal.org` | ✅ CORRECTO |
| RSS podcast links | `https://frecuenciaglobal.org/podcast/*` | ✅ CORRECTO |
| 59gray.github.io | No aparece | ✅ LIMPIO |

---

## 4) Estado esperado post-deploy

Tras hacer commit y deploy en Vercel, se debe observar:

| Verificación | Valor esperado |
|--------------|----------------|
| `curl -I https://frecuenciaglobal.org` | `200 OK` + headers Vercel |
| Canonical en HTML | `https://frecuenciaglobal.org/` |
| `og:url` en HTML | `https://frecuenciaglobal.org/` |
| `twitter:url` en HTML | `https://frecuenciaglobal.org/` |
| Sitemap accesible | `https://frecuenciaglobal.org/sitemap-index.xml` con URLs `.org` |
| RSS podcast | `https://frecuenciaglobal.org/podcast/rss.xml` con email `.org` |
| Email en /contacto | `contact@frecuenciaglobal.org` visible y en mailto |

**Nota:** Si Vercel ya tiene auto-deploy en cada push, el cambio estará vivo en ~2 minutos post-commit.

---

## 5) Comandos de verificación

```powershell
# 1. Verificar canonical y og:url
curl -s https://frecuenciaglobal.org | findstr -i "canonical\|og:url" | Select-Object -First 5

# 2. Verificar sitemap apunta a .org
curl -s https://frecuenciaglobal.org/sitemap-0.xml | findstr "loc" | Select-Object -First 3

# 3. Verificar robots.txt
curl -s https://frecuenciaglobal.org/robots.txt | findstr "Sitemap"

# 4. Verificar email en podcast RSS
curl -s https://frecuenciaglobal.org/podcast/rss.xml | findstr "itunes:email"

# 5. Verificar email visible en contacto
curl -s https://frecuenciaglobal.org/contacto | findstr "contact@frecuenciaglobal.org"

# 6. Verificar headers Vercel (confirma deploy nuevo)
curl -I https://frecuenciaglobal.org | findstr -i "vercel|x-vercel"
```

**Todos deben retornar valores con `frecuenciaglobal.org`** (no 59gray.github.io ni vercel.app).

---

## 6) Commit sugerido

```
fix: unificar email podcast y regenerar build con dominio .org canónico

- Corrige email iTunes en podcast/rss.xml.ts: contacto@frecuenciaglobal.mx → contact@frecuenciaglobal.org
- Regenera build Astro con site: https://frecuenciaglobal.org
- Elimina referencias residuales a 59gray.github.io en sitemap y metatags
- Alinea canonical, og:url, twitter:url al dominio canónico .org

Verificación local: sitemap, robots, RSS, y HTML contienen solo URLs .org
```

---

**Acción inmediata requerida:** Ejecutar commit y push para deploy en Vercel.
