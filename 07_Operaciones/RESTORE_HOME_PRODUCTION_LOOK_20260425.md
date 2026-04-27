# RESTORE HOME PRODUCTION LOOK — 2026-04-25

## Causa real

El header copy en `Header.astro` difería del estado de producción (`frecuenciaglobal.org`):
- `Frecuencias` → debía ser `PILARES`
- `About` → debía ser `SOBRE`
- brand label `frecuencia global` → debía ser `SEÑAL CENTRAL`

El subtitle del HomeFold ya tenía el fix de inline style del commit anterior (`949d702`).

## Archivos restaurados/modificados

| Archivo | Cambio |
|---|---|
| `website/src/components/Header.astro` | Copy: Frecuencias→PILARES, About→SOBRE, brand→SEÑAL CENTRAL |
| `website/src/components/editorial/HomeFold.astro` | Ya tenía fix previo (inline style en subtitle) |

## Commit usado como referencia visual

Producción `frecuenciaglobal.org` — estado visual canónico.

## Build result

✅ PASS — 17 páginas en 6.15s

## URL local validada

`http://127.0.0.1:4321/` — header con SEÑAL CENTRAL / PILARES / SOBRE, subtitle horizontal.

## Branch

`rescue/restore-home-production-look-20260425` — commit `f433362`

## No se tocó

- Bass & Borders ✅
- Artículos Detroit/Berghain/Cables ✅
- Assets ✅
- global.css ✅
- n8n / Notion / ComfyUI ✅
- .env ✅

## Confirmaciones

- No deploy ✅
- No publicación ✅
- main NO fue tocada directamente ✅
- No force push ✅

## Backup

`04_Produccion/Website/backups/RESTORE_HOME_PRODUCTION_LOOK_20260425/Header.astro.bak`
