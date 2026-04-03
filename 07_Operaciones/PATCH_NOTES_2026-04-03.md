# Frecuencia Global — Patch Notes

**Fecha:** 3 de abril 2026  
**Commit:** `482d5ab` → `main`  
**Repo:** [github.com/59gray/Frecuencia-Global](https://github.com/59gray/Frecuencia-Global)

---

## Resumen ejecutivo

Se realizó una auditoría integral del proyecto, limpieza profunda del workspace y consolidación de assets. El repositorio pasa de tener ~500 archivos dispersos a una estructura organizada y lista para producción.

**Antes:** 1 commit, raíz contaminada con PDFs/ZIPs/DOCXs, 85 scripts de debug sin archivar, assets fragmentados en 7 carpetas sueltas.  
**Después:** Workspace limpio, assets consolidados, referencias actualizadas, todo pusheado a GitHub.

---

## Cambios realizados

### Limpieza del workspace

- **85 scripts de debug** (`step*.js`) archivados en `scripts/_archive/step_scripts/`
- **97 PNGs de diagnóstico** archivados en `scripts/_archive/debug_pngs/`
- **8 PDFs, 8 ZIPs, 3 DOCXs** y archivos misceláneos movidos a `_archivo/`
- **3 auditorías históricas** (`AUDITORIA_*.md`) archivadas desde la raíz
- Archivos sueltos de la raíz (fuentes, TXT de verificación, guidelines) limpiados

### Consolidación de assets

- **7 carpetas de assets** (`Frecuencia_Global_Assets_Base/`, `v1` a `v6`) consolidadas bajo `06_Assets/`:
  - `06_Assets/base/` — SVGs maestros (isotipo, wordmarks, nodo, corchetes)
  - `06_Assets/v1_Banners_Avatares/` — Banners YouTube, avatares
  - `06_Assets/v2_X_Reels/` — Banner X, overlays Reels (4 pilares)
  - `06_Assets/v3_Highlights_Covers/` — IG Highlights, Series covers
  - `06_Assets/v4_Carousel_Templates/` — Carruseles (4 pilares)
  - `06_Assets/v5_Backgrounds_Elements/` — Backgrounds, elementos decorativos
  - `06_Assets/v6_Mockups/` — Mockups de perfiles
- Creado `06_Assets/README_Assets_Index.md` — índice maestro de ~113 assets

### Documentación actualizada

- `README.md` — Estructura del repo actualizada (ya no menciona carpetas eliminadas, incluye `08_n8n/`, `website/`, `scripts/`)
- `system/SISTEMA_MAESTRO.md` — Mapa del repositorio corregido
- `04_Produccion/P1_001_PublishReady.md` — Ruta de TikTok profile corregida
- `.gitignore` — Nuevas exclusiones: `_archivo/`, `scripts/_archive/`, `tmp/`, `output/`, `logs/`, `.sixth/`, `.venv/`

### Contenido nuevo incorporado (sesiones previas)

- `03_Editorial/EP_002_Brief.md` — Brief del episodio piloto 002
- `04_Produccion/EP_002_PublishReady.md` — Publish ready del EP_002
- `website/src/content/podcast/frecuencia-global-podcast-ep-002.md` — Episodio 002 en web
- `06_Assets/FG_Podcast_Cover_3000x3000_v1.*` — Cover art del podcast (PNG/JPG)
- `06_Assets/MAYA_HOST_*` — Assets del host visual (avatar, key visual full body)
- `07_Operaciones/N8N_Social_Blockers_2026-04-03.md` — Reporte de bloqueadores n8n
- `07_Operaciones/Podcast_Distribution_Matrix_RSScom.md` — Matriz de distribución podcast
- `07_Operaciones/RSScom_Launch_Checklist.md` — Checklist de lanzamiento RSS.com
- `90_Copilot_Studio_Integration/` — Documentación de integración con Copilot Studio

---

## Estado actual del proyecto

| Área | Estado |
|------|--------|
| Website (Astro) | Build OK — 14 páginas, 2 artículos, 2 podcasts |
| Pipeline editorial | P1_001 `PUBLISH_READY`, P1_002-004 `BRIEF_READY`, EP_001-002 `PUBLISH_READY` |
| Assets visuales | ~113 archivos consolidados bajo `06_Assets/` |
| n8n (cloud) | Activo, WF-001 a WF-009 desplegados |
| GitHub | Sincronizado — 2 commits en `main` |
| Plataformas sociales | Perfiles creados en YouTube, TikTok, Instagram, X, LinkedIn |

---

## Bloqueadores activos

| # | Bloqueador | Acción requerida |
|---|-----------|-----------------|
| 1 | **Vercel Authentication activa** — el website público está bloqueado | Desactivar auth en Vercel dashboard → Settings → General → Password Protection |
| 2 | **P1_001 exports de Canva expiraron** (~24h) | Re-exportar los 8 slides desde los links de Canva en `P1_001_Produccion_Log.md` |
| 3 | **P1_001 QA visual pendiente** | Revisar tipografías, colores y safe areas en Canva antes de publicar |
| 4 | **X API: 402 Credits Depleted** | Cargar créditos en X Developer Portal para publicar vía n8n |
| 5 | **LinkedIn/IG/TikTok sin credenciales n8n cloud** | Configurar OAuth en n8n cloud por plataforma |

---

## Próximos pasos recomendados (en orden)

1. **Desbloquear Vercel** — quitar Password Protection para que los bio links funcionen
2. **Revisar P1_001 en Canva** — abrir los 8 links, verificar textos/tipografías, exportar PNGs finales
3. **Publicar P1_001 en Instagram** — subir carrusel manualmente con caption de `P1_001_Instagram_Caption.md`
4. **Primera publicación = romper la inercia** — el proyecto tiene 0 publicaciones tras 10 días de infraestructura
5. **Cargar créditos X Developer** — para habilitar publicación automatizada vía n8n
6. **Configurar credenciales sociales en n8n cloud** — LinkedIn, Instagram, TikTok

---

## Métricas de esta sesión

| Métrica | Valor |
|---------|-------|
| Archivos archivados | 193 (85 scripts + 97 PNGs + 11 raíz) |
| Carpetas consolidadas | 7 → 1 (`06_Assets/`) |
| Referencias corregidas | 3 documentos clave |
| Archivos nuevos | 1 (`README_Assets_Index.md`) |
| Commits | 1 (`482d5ab`) |
| Push a GitHub | Completado |

---

*Generado el 2026-04-03 por sesión de auditoría y limpieza.*
