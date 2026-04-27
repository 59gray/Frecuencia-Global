# D36 — Verificación preview social (Detroit OG v02)

**Fecha:** 2026-04-27  
**Cierre ampliado (D36-C):** verificación con sesión en Meta Sharing Debugger, LinkedIn Post Inspector y X Card Validator.

---

## URL probada

`https://www.frecuenciaglobal.org/contenido/techno-detroit-historia-musica-electronica/`

## OG esperado

`https://frecuenciaglobal.org/images/articles/FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png`

---

## 1. Producción (HTTP)

| Verificación | Resultado |
|--------------|-----------|
| `og:image` | Apunta al PNG v02 (canónico apex) |
| `twitter:image` | Igual que `og:image` |
| PNG v02 (`HEAD`) | **200**, **Content-Type: image/png**, ~1.35 MB |

---

## 2. Servicio público tipo crawler (Microlink)

**Endpoint:** `https://api.microlink.io/?url=<article-url>` — **success**

| Campo | Valor |
|-------|--------|
| `image.url` | `https://frecuenciaglobal.org/images/articles/FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png` |
| Dimensiones | 1200 × 630 |

---

## 3. Meta / Facebook — Sharing Debugger

**Herramienta:** `https://developers.facebook.com/tools/debug/`

| Resultado | Detalle |
|-----------|---------|
| Preview | Imagen **B/N cartel TECHNO CITY / DETROIT** — coherente con OG v02 billboard |
| Título | *El techno nació en Detroit, no en Berlín — Frecuencia Global* |
| Scrape | **Scrape Again** ejecutado; tiempo de scrape reciente (segundos), **HTTP 200** |
| **Aviso `fb:app_id`** | **Warnings:** propiedad requerida faltante **`fb:app_id`**. No bloquea preview ni `og:image` en la práctica habitual |

---

## 4. LinkedIn — Post Inspector

**Herramienta:** `https://www.linkedin.com/post-inspector/`

| Resultado | Detalle |
|-----------|---------|
| Inspect | Tras iniciar sesión: **Inspect** sobre la URL del artículo |
| Preview | Tarjeta con misma imagen tipo cartel (Detroit / TECHNO CITY), título y dominio `frecuenciaglobal.org` |
| Última lectura | **Last scraped:** hace segundos (datos frescos) |

### Nota CDN proxy de LinkedIn

La miniatura que muestra Post Inspector puede servirse vía **`media.licdn.com`** (proxy/cache de LinkedIn). Es comportamiento esperado; no sustituye la necesidad de que el **`og:image` original** sea público y correcto en origen.

---

## 5. X / Twitter — Card Validator

**Herramienta:** `https://cards-dev.twitter.com/validator` → redirección operativa a **`https://cards-dev.x.com/validator`**

| Resultado | Detalle |
|-----------|---------|
| Log (tras **Preview card**) | **INFO:** Page fetched successfully |
| | **INFO:** 20 metatags were found |
| | **INFO:** `twitter:card = summary_large_image` tag found |
| | **INFO:** Card loaded successfully |

### Nota Card Validator vs Composer

La interfaz indica que la **previsualización gráfica de la tarjeta se ha movido al Tweet Composer**. El validador confirma metadatos y tipo de tarjeta en el **log**; para ver la miniatura como en la red social hace falta **borrador de post en X** con la misma URL.

---

## 6. Conclusión

- **Meta / Facebook:** OG **v02** validado visualmente en Sharing Debugger (cartel Detroit).
- **LinkedIn:** Preview alineado con **v02** en Post Inspector; imagen servida en UI vía CDN de LinkedIn según política de la plataforma.
- **X:** Metatags correctos (`summary_large_image`, carga OK en log); confirmación visual de imagen recomendada en **composer**.

---

## 7. Alcance operativo (D36 / D36-C)

Sin cambios de producto, sin deploy, sin hosting/DNS/settings, sin Notion, sin APIs del proyecto ni exposición de credenciales.

---

## 8. Git

Versión operativa registrada en `main` con commit **`docs(ops): add D36 social preview validation`** (D36-C).
