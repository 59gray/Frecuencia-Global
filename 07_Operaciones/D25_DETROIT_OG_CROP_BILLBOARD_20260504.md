# D25 — Detroit OG crop billboard-focused

**Fecha:** 2026-05-04  
**Rama:** `feature/detroit-og-crop-billboard`

## Objetivo

Nuevo asset Open Graph 1200×630 para `techno-detroit-historia-musica-electronica`, con encuadre en el panel “Welcome to Detroit” (billboard), sin cambiar hero on-page ni activar `detroit-billboard`.

## Source verificado

- `website/public/images/articles/FG_DETROIT_P2_IMG_INLINE_MANGA02_v01_20260502_CANONICAL.png` (1280×720), misma pieza que el artículo usa en figura inline con texto “Welcome to Detroit”.

## Derivación técnica

- Recorte con relación 1200:630 sobre ancho completo (alto efectivo 672 px), **alineado al borde superior** para priorizar letrero/personajes en la parte alta del panel.
- Redimensionado LANCZOS a **1200×630**.

## Salida

- `website/public/images/articles/FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png`

## Frontmatter

- `ogImage` → `/images/articles/FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png`

## Validación

- `cd website && npm run build` (ejecutar tras cambios).

## Alcance explícito

- Sin deploy, push, PR, APIs externas o credenciales.
- `FG_DETROIT_P2_IMG_OG_v01_20260502_CANONICAL.png` conservado.
