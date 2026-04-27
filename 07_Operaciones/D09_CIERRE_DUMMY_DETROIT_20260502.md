# D09 — Cierre dummy Detroit (vertical web-first operativa)

- Fecha: 2026-05-02
- Alcance: cerrar dummy Detroit con **assets reales** en `website/public`, **sin deploy**, sin publicación externa y sin APIs.

## Archivo Detroit editado

- **`website/src/content/articles/techno-detroit-historia-musica-electronica.md`**
  - Frontmatter apunta a PNG canónicos D06 bajo `/images/articles/`.
  - Eliminado `heroImageWebp` (opcional en schema): hero usa solo PNG para evitar rutas rotas sin WEBP local.
  - Cuerpo: tres ilustraciones con rutas existentes; primera figura usa asset “open still” curado (no hay archivo `*billboard*` verificado en `D:\FrecuenciaGlobal\ComfyUI\output` por nombre); copy y `alt` ajustados para no afirmar motivos que el archivo no muestra.
  - Copy depurado: menos plantillas de apertura; eliminado nombre propio sin fuente adjunta en repo (sustituido por formulación sobre el debate público).
  - Pie de fuentes: solo embed X + enlaces/callouts presentes en el texto; resto marcado como orientación editorial si no hay pack local.

## Ajuste técnico asociado (hero)

- **`website/src/components/editorial/ArticleHeroImage.astro`**: detección `isTechnoDetroitCover` amplía patrón a rutas que incluyen `FG_DETROIT_P2_IMG_HERO_WEB` para conservar tratamiento visual del hero Detroit cuando el archivo ya no se llama `techno-detroit-hero.*`.

## Imágenes copiadas (origen → destino)

Origen fijo: `D:\FrecuenciaGlobal\ComfyUI\output\`  
Destino fijo: `C:\Users\farid\Documents\Frecuencia Global\website\public\images\articles\`

| Archivo origen | Copia D06 (nombre final en website) |
|---|---|
| `FG_DETROIT_HERO_WEB_v1_s137_00001_.png` | `FG_DETROIT_P2_IMG_HERO_WEB_v01_20260502_CANONICAL.png` |
| `FG_BB_DETROIT_CARD_v2_s2026_00001_.png` | `FG_DETROIT_P2_IMG_CARD_SOCIAL_v01_20260502_CANONICAL.png` |
| `FG_DETROIT_FEATURED_v1_s909_00001_.png` | `FG_DETROIT_P2_IMG_OG_v01_20260502_CANONICAL.png` |
| `techno-detroit-manga-02_00001_.png` | `FG_DETROIT_P2_IMG_INLINE_MANGA02_v01_20260502_CANONICAL.png` |
| `techno-detroit-manga-03_00001_.png` | `FG_DETROIT_P2_IMG_INLINE_MANGA03_v01_20260502_CANONICAL.png` |
| `FG_DETROIT_FEATURED_v1_s2025_00001_.png` | `FG_DETROIT_P2_IMG_INLINE_OPEN_STILL_v01_20260502_CANONICAL.png` |

No se borró ni movió ningún archivo en `D:\`; solo lectura + copia hacia `website/public`.

## Rutas corregidas / finales usadas por el artículo

| Uso | Ruta pública |
|---|---|
| Hero | `/images/articles/FG_DETROIT_P2_IMG_HERO_WEB_v01_20260502_CANONICAL.png` |
| Card | `/images/articles/FG_DETROIT_P2_IMG_CARD_SOCIAL_v01_20260502_CANONICAL.png` |
| OG | `/images/articles/FG_DETROIT_P2_IMG_OG_v01_20260502_CANONICAL.png` |
| Inline 1 | `/images/articles/FG_DETROIT_P2_IMG_INLINE_OPEN_STILL_v01_20260502_CANONICAL.png` |
| Inline 2 | `/images/articles/FG_DETROIT_P2_IMG_INLINE_MANGA02_v01_20260502_CANONICAL.png` |
| Inline 3 | `/images/articles/FG_DETROIT_P2_IMG_INLINE_MANGA03_v01_20260502_CANONICAL.png` |

Nota layout home: `website/src/pages/index.astro` sigue usando `/images/articles/techno-detroit-featured-card.png` (archivo ya presente en repo; **NO VERIFICADO EN FUENTE LOCAL** si ese PNG coincide con algún `techno-detroit-featured-card_*.png` del depósito ComfyUI sin comparación binaria).

## Verificación local

- `Test-Path` en disco para todas las rutas tabuladas arriba + dossier existente `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.png`: **OK**.
- `npm run build` en `website/`: **PASS** (2026-05-02, salida estática generada sin error).

## Copy ajustado

- Apertura menos genérica; foco en mapa Europa vs matriz estadounidense sin slogan vacío.
- Figura 1: caption y `alt` alineados con contenido imagen (sin afirmar “billboard Detroit Techno City”).
- Embed X: caption acotado a lo que muestra la publicación enlazada.

## Claims no verificados eliminados o marcados

- Eliminada lista larga del pie (“BLS, Detroit Open Data…” sin evidencia en este archivo).
- Sustituido nombre propio sin fuente adjunta en repo por referencia genérica al debate público sobre crédito del género.
- Pie final declara límites de lo verificable dentro del archivo.

## Pendientes reales

- Sustituir primera ilustración si aparece archivo “billboard/rebuilt” identificable en depósito u otro directorio no spot-check aquí (`NO VERIFICADO EN FUENTE LOCAL` exhaustivo fuera de `ComfyUI\output`).
- Opcional: export WEBP desde PNG para reintroducir `<picture>` sin mentir rutas.
- Revisión visual humana de crops (hero `object-position`, OG 1200×630 vs featured).

## Confirmación operativa

- No hubo deploy ni publicación en redes.
- No se tocó Notion ni APIs externas.
- No se editaron credenciales ni `.env`.
- No se borraron imágenes; no se movieron originales en `D:\`.

## Recomendación inmediata (revisión manual)

1. Abrir `/contenido/techno-detroit-historia-musica-electronica` en preview local y validar jerarquía visual hero + tres inlines.
2. Confirmar OG en redes sociales simulado (meta tags usan `ogImage`).
3. Validar página pilar Bass & Borders: dossier sigue cargando `/images/dossiers/bass-borders-detroit-berghain-dossier.png`.
