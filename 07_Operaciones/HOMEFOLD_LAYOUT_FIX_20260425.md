# HOMEFOLD LAYOUT FIX — 2026-04-25

## Causa real detectada

El subtítulo del HomeFold hero aparecía con una palabra por línea en el dev server local (`127.0.0.1:4321`), pero correctamente en producción.

**Causa raíz**: Tailwind v4 en modo desarrollo sirve el CSS como archivo fuente (`/src/styles/global.css`) procesado en tiempo real. Las clases `w-full` y `min-w-0` añadidas en ediciones previas no fueron regeneradas por el watcher de Vite después de un crash del proceso (`astro:server-app.js` not found). El HTML tenía las clases correctas en el DOM pero el CSS compilado en dev no las incluía para ese contexto de flex container anidado.

## Archivo modificado

`website/src/components/editorial/HomeFold.astro`

## Clases/propiedades que rompían el subtitle

- `flex-1` sin `width` explícito en el contenedor padre — colapsaba a 0 cuando Tailwind no regeneraba `w-full`
- `line-clamp-3` (removido en fix anterior) — forzaba `-webkit-box-orient: vertical`

## Solución aplicada

Se añadieron `style` inline en los contenedores críticos para garantizar ancho independiente de Tailwind:

```html
<!-- Contenedor flex principal -->
<div style="width:100%" class="flex flex-col ...">

<!-- Contenedor del texto -->
<div style="width:100%;min-width:0" class="flex-1">

<!-- Párrafo subtitle -->
<p style="width:100%;max-width:720px;white-space:normal;word-break:normal;overflow-wrap:break-word"
   class="text-base leading-relaxed text-fg-gray/95 ...">
```

## Build result

✅ PASS — `npm run build` completado en 6.21s, 17 páginas generadas.

## URL local validada

`http://127.0.0.1:4321/` — subtitle fluye como párrafo horizontal.

## Commit hash

`949d702` — pushed a `main`

## Confirmación

- No deploy ✅
- No publicación ✅
- No se tocó Bass & Borders ✅
- No se tocaron artículos ✅
- No se tocaron assets ✅
- No force push ✅

## Backup

`04_Produccion/Website/backups/HOMEFOLD_LAYOUT_FIX_20260425/HomeFold.astro.bak`
