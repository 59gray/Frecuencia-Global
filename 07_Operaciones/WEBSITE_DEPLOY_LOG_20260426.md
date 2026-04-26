# Website Deploy Log — Frecuencia Global — 2026-04-26

## Estado
DEPLOY_OK

## Repo
- Rama: main
- Commit: 651f25d (merge: website polish 2026-04-26)
- Tag: v0.4.0-website-polish-20260426
- Working tree: limpio (untracked no relevantes)

## Build
- Resultado: PASS
- Herramienta: astro build
- Errors: ninguno

## Cloudflare
- Herramienta: npx wrangler 4.81.0
- Cuenta: j.farid.assad@gmail.com (d47e8ee1cb672217ae205e6d9acf68ac)
- Project name: frecuencia-global
- Branch: main
- Deployment URL: https://8c9158c0.frecuencia-global.pages.dev
- Dominio: https://frecuenciaglobal.org
- Timestamp: 2026-04-26 ~13:21 UTC-06

## Verificación producción
- https://frecuenciaglobal.org: HTTP 200
- Señales encontradas: FRECUENCIA GLOBAL, About, favicon.svg, Últimas señales, Cuatro frecuencias, TRANSMISIÓN CONTINUA

## Assets críticos
- favicon.svg: 200
- techno-detroit-featured-card.png: 200
- ticketing-plataformas-comision.png: 200
- cables-submarinos-geopolitica-internet.png: 200
- streaming-regalias-artistas.png: 200

## Cambios incluidos en este deploy
- Thumbnails ComfyUI: ticketing, cables submarinos, streaming (3 imágenes nuevas)
- Footer compacto: copy con acentos, rutas/legal separados, redes iconos cuadrados
- Favicon isotipo oficial: corchetes [ o ] cyan, eliminado favicon.ico con "A"
- Header: FRECUENCIA GLOBAL como nombre principal, badge "4", status bar compacta
- Home sections: microcopy Últimas señales + Cuatro frecuencias refinado
- PillarGrid: eliminado lenguaje "pilar" visible
- pillars.ts: subtítulos y descripciones compactados

## Cambios fuera de scope
Ninguno. Solo deploy oficial desde build existente.
