# Social Automation Index

## Official entry points

| Platform | Primary entry point | Why this is the main flow |
|---|---|---|
| X | `scripts/x_profile_setup.py` | Most complete automation: validates assets, supports `--dry-run`, and preserves session in `.chrome-x-stable/`. |
| TikTok | `scripts/tiktok_apply_profile_persistent.mjs` | Best balance of persistence and full-profile edits; reuses the local Chrome session instead of requiring a fresh login each time. |
| Instagram | `scripts/instagram_preflight.ps1` | Today this is the safest operational check; profile automation is still partial and should be treated as assisted/manual. |
| LinkedIn | `scripts/linkedin_preflight.ps1` + `scripts/linkedin_run.ps1` | The active operational flow is preflight plus run logging. The avatar-only browser helper is still secondary. |
| YouTube | `scripts/youtube_preflight.ps1` + `scripts/youtube_channel_api_config.py` + `scripts/youtube_studio_config_cdp.py` | Start with preflight, then apply metadata via API, then finish links/defaults/banner in Studio. |
| Checkpoints | `scripts/generate_checkpoint.py` | Current checkpoint/state generator used by `run_checkpoint.ps1`. |

## Secondary / fallback flows

| Script | Use only when |
|---|---|
| `scripts/tiktok_apply_profile_wait_login.mjs` | You need the persistent TikTok flow but expect to log in manually during the run. |
| `scripts/tiktok_apply_profile.mjs` | You want a clean, non-persistent test window and accept that it may stop at login. |
| `scripts/apply_tiktok_identity.ps1` | You want a manual assist flow that opens the right profile and copies the bio to clipboard. |

## Legacy / diagnostic-heavy candidates

These are still useful as references, but they should not be treated as the default production path:

- `scripts/tiktok_profile_fill.py`
- `scripts/youtube_studio_automation.py`
- `scripts/diag_*.py`
- `scripts/step*.js`
- `scripts/diag*.png`, `scripts/debug*.png`, `scripts/fail*.png`

## Environment notes

- Shared defaults now live in:
  - `scripts/fg_automation_config.py`
  - `scripts/fg_automation_config.mjs`
  - `scripts/fg_automation_config.ps1`
- Supported overrides:
- `FG_WEBSITE_URL`
- `FG_WEBSITE_PREVIEW_URL`
- `FG_PODCAST_HOST`
- `FG_PODCAST_RSS_URL`
- `FG_PODCAST_SHOW_URL`
- `FG_INSTAGRAM_HANDLE`
- `FG_LINKEDIN_COMPANY_SLUG`
- `FG_TIKTOK_HANDLE`
- `FG_X_HANDLE`
- `FG_YOUTUBE_HANDLE`
- `FG_CHROME_EXE`
- `FG_CHROME_USER_DATA_DIR`

## Depuración estructurada (`FG_DEBUG`)

- Módulo: `scripts/fg_debug.py` — escribe líneas **NDJSON** (una por evento) en `logs/fg_debug.ndjson` (carpeta `logs/` ignorada por git).
- Activar: `FG_DEBUG=1` (también `true` / `yes` / `on`).
- Opcional: `FG_DEBUG_LOG` (ruta relativa al repo o absoluta), `FG_DEBUG_INGEST=1` + `FG_DEBUG_INGEST_URL` para POST al ingest de una sesión de depuración, `FG_DEBUG_SESSION_ID` para la cabecera `X-Debug-Session-Id`.
- Integración de referencia: `fg_automation_config.py` (lanzamiento de Chrome y `check_session_valid`) e `ig_publish_post.py` (flujo principal y resultado JS de share).
- Los campos de datos se **sanitizan** (p. ej. claves que contienen `token`, `secret`, `password`) para no volcar secretos.

## Suggested install

```powershell
.venv\\Scripts\\python.exe -m pip install -r scripts/requirements.txt
cd scripts
npm install
```

## Podcast ops

- `scripts/n8n_platform_healthcheck.py` revisa el show y feed del podcast usando `FG_PODCAST_SHOW_URL` y `FG_PODCAST_RSS_URL`; la pagina web queda como superficie editorial secundaria.
- `scripts/run_publish_test.py --pieza EP_001 --skip-webhook` valida un `PublishReady` de podcast/videopodcast sin disparar publicacion real.
- `scripts/podcast_prelaunch_check.py` genera un reporte unico de readiness antes de la primera publicacion del podcast.
- `scripts/podcast_apply_launch_values.py` aplica las URLs reales de RSS.com y, si quieres, tambien `N8N_API_KEY` y `GITHUB_PAT` en los archivos operativos.
