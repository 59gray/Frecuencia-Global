# Podcast Prelaunch Status

**Fecha:** 2026-04-03
**Estado general:** ALMOST_READY

## Checklist tecnico

| Check | Estado | Detalle |
|-------|--------|---------|
| env:FG_SITE_URL | OK | https://frecuenciaglobal.vercel.app |
| env:FG_WEBSITE_URL | OK | https://frecuenciaglobal.vercel.app |
| env:FG_PODCAST_HOST | OK | rss.com |
| env:FG_PODCAST_SLUG | OK | frecuencia-global-podcast |
| env:FG_PODCAST_SHOW_URL | OK | https://rss.com/podcasts/frecuencia-global-podcast |
| env:FG_PODCAST_RSS_URL | OK | https://media.rss.com/frecuencia-global-podcast/feed.xml |
| podcast_show_real | PENDING | slug de marca configurado, pero el show publico no responde como esperado |
| podcast_feed_real | PENDING | sigue con feed placeholder de marca |
| cloud:n8n_api_key | PENDING | sin API key cloud |
| cloud:github_pat | PENDING | sin PAT GitHub |
| podcast_page | OK | C:\Users\farid\Documents\Frecuencia Global\website\src\pages\podcast\index.astro |
| podcast_feed_route | OK | C:\Users\farid\Documents\Frecuencia Global\website\src\pages\podcast\rss.xml.ts |
| podcast_episode_content | OK | C:\Users\farid\Documents\Frecuencia Global\website\src\content\podcast\frecuencia-global-podcast-ep-001.md |
| workflow_wf001 | OK | C:\Users\farid\Documents\Frecuencia Global\08_n8n\workflows_cloud\WF-001_intake_ideas.json |
| workflow_wf006 | OK | C:\Users\farid\Documents\Frecuencia Global\08_n8n\workflows_cloud\WF-006_preparar_publicacion.json |
| publish_ready_ep001 | OK | C:\Users\farid\Documents\Frecuencia Global\04_Produccion\EP_001_PublishReady.md |
| tracker | OK | C:\Users\farid\Documents\Frecuencia Global\04_Produccion\pipeline_tracker.json |
| json:WF-001_intake_ideas.json | OK | valido |
| json:WF-006_preparar_publicacion.json | OK | valido |
| publish_ready_sections | OK | C:\Users\farid\Documents\Frecuencia Global\04_Produccion\EP_001_PublishReady.md |
| publish_ready_assets | OK | chapters=5 clips=3 |
| tracker:EP_001 | OK | estado_actual=PUBLISH_READY |

## Pendientes reales

- `podcast_show_real` -> slug de marca configurado, pero el show publico no responde como esperado
- `podcast_feed_real` -> sigue con feed placeholder de marca
- `cloud:n8n_api_key` -> sin API key cloud
- `cloud:github_pat` -> sin PAT GitHub

## Lectura operativa

- `READY`: podemos publicar.
- `ALMOST_READY`: solo faltan configuraciones externas o claims finales.
- `NOT_READY`: hay bloqueos tecnicos internos previos a la publicacion.

