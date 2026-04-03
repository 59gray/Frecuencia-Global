# YouTube Preflight Report

- Fecha: 2026-04-02 14:46:15
- Preview URL: https://website-three-rho-26.vercel.app
- Resultado global: **PASS**
- Checks OK: 23
- Checks FAIL: 0

## Resultados

| Check | Estado | Detalle |
|-------|--------|---------|
| Doc exists: 07_Operaciones/YOUTUBE_Setup_Checklist.md | OK | Present |
| Doc exists: 07_Operaciones/YOUTUBE_Status_Report.md | OK | Present |
| Doc exists: 04_Produccion/YOUTUBE_Test_Protocol.md | OK | Present |
| Doc exists: scripts/README_YOUTUBE_SETUP.md | OK | Present |
| Script exists: scripts/youtube_preflight.ps1 | OK | Present |
| Script exists: scripts/youtube_channel_api_config.py | OK | Present |
| Script exists: scripts/youtube_channel_setup.py | OK | Present |
| Script exists: scripts/youtube_studio_config_cdp.py | OK | Present |
| Script exists: scripts/youtube_studio_banner_cdp.py | OK | Present |
| Script exists: scripts/youtube_studio_profile_cdp.py | OK | Present |
| Footer has YouTube URL | OK | website/src/components/Footer.astro |
| Contacto has YouTube URL | OK | website/src/pages/contacto.astro |
| API config references WEBSITE_URL | OK | scripts/youtube_channel_api_config.py |
| Studio config references WEBSITE_URL | OK | scripts/youtube_studio_config_cdp.py |
| Asset exists: 06_Assets/FG_IG_Avatar_Profile_v2.png | OK | 06_Assets/FG_IG_Avatar_Profile_v2.png |
| Asset exists: Frecuencia_Global_Activos_Canva_v1/FG_Banner_YouTube_v3.png | OK | Frecuencia_Global_Activos_Canva_v1/FG_Banner_YouTube_v3.png |
| Asset exists: 06_Assets/fg_youtube_watermark_150.png | OK | 06_Assets/fg_youtube_watermark_150.png |
| Dimensions: FG_IG_Avatar_Profile_v2.png | OK | Actual 400x400 / Expected 400x400 |
| Dimensions: FG_Banner_YouTube_v3.png | OK | Actual 2560x1440 / Expected 2560x1440 |
| Dimensions: fg_youtube_watermark_150.png | OK | Actual 150x150 / Expected 150x150 |
| OAuth token present for YouTube API | OK | scripts/token.json |
| Preview URL reachable | OK | https://website-three-rho-26.vercel.app (HTTP 200) |
| Preview has YouTube URL | OK | https://website-three-rho-26.vercel.app |

## Recomendacion

YouTube queda tecnicamente listo para ejecutar pruebas controladas.
