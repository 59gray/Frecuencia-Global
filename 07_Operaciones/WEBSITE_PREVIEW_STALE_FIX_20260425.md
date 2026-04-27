# WEBSITE_PREVIEW_STALE_FIX
# Diagnóstico: Sitio viejo en panel Windsurf
# 2026-04-25 | Frecuencia Global

---

## Causa raíz

El panel de preview integrado de Windsurf usa un **proxy interno** (`http://127.0.0.1:55873`) que cachea el contenido del servidor subyacente. Cuando se inicia `astro preview` (que sirve el `dist/` estático compilado), el proxy retiene la versión anterior en su caché — incluso tras reinicios del servidor. El hard refresh (`Ctrl+Shift+R`) no es suficiente porque el proxy no expone headers de cache-control al browser interno.

## Solución aplicada

Reemplazar `astro preview` (estático) por `astro dev` (compilación en tiempo real desde `src/`). El dev server no usa caché de assets y Windsurf lo renderiza correctamente.

---

## Estado confirmado

| Item | Valor |
|------|-------|
| Carpeta real | `C:\Users\farid\Documents\Frecuencia Global` |
| Branch | `main` |
| Remote | `https://github.com/59gray/Frecuencia-Global.git` |
| Último commit | `15bd780` — docs: record Serena MCP setup for Windsurf |
| Segundo commit | `c0c4a6f` — assets: generate Detroit missing visual assets with ComfyUI |
| Servidor activo | `astro dev` en `http://127.0.0.1:4321` |
| Build previo | PASS — 16 páginas en 12.33s |
| URL local correcta | `http://127.0.0.1:4321` |
| Artículo Detroit | `http://127.0.0.1:4321/contenido/techno-detroit-historia-musica-electronica/` |

## Assets Detroit confirmados en public/

| Archivo | Fecha |
|---------|-------|
| `FG_DETROIT_HERO_WEB_v1.png` | 2026-04-25 |
| `FG_DETROIT_THUMB_VERTICAL_v1.png` | 2026-04-25 |
| `FG_DETROIT_OG_v1.png` | 2026-04-19 |
| `FG_DETROIT_MANGA_EDITORIAL_HD_v2.png` | 2026-04-20 |

## Había servidor viejo

Sí — proceso `astro preview` (PID 2628/22544) corriendo en 4321 desde sesión anterior. Matado antes de iniciar dev server.

## Había dist viejo

Sí — `website/dist/` reconstruido limpio antes del diagnóstico (Remove-Item + build fresco). No fue la causa raíz — el proxy de Windsurf cacheaba independientemente del contenido del dist.

---

*Generado: 2026-04-25 | Agente: Windsurf Cascade*
