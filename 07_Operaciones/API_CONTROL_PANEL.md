# API Control Panel

- Fecha de auditoria: 2026-04-10
- Consolidacion maestra: 2026-04-13 (frentes API-first y web cerrados; ver `07_Operaciones/PROJECT_MASTER_STATUS_2026-04-13.md`)
- Estado documental: VIGENTE
- Documento maestro: SI
- Indice maestro: `07_Operaciones/DOCUMENTATION_AUTHORITY_INDEX.md`
- Comando obligatorio de apertura de jornada: `python scripts/fg_ops_snapshot.py`
- Rutina diaria automatizada: `scripts/fg_daily_credential_check.ps1` — Windows Scheduled Task `FG_Daily_Credential_Check`, 08:00 diaria. Ejecuta: (1) YouTube OAuth refresh, (2) `python scripts/check_all_providers.py` con persistencia de reportes en `07_Operaciones/`. Registrada 2026-04-13.
- Regla operativa: la autoridad vigente para integraciones, continuidad operativa y simplificacion es este archivo.
- Regla de alcance: no se publica, no se regeneran tokens, no se inventan credenciales y no se abren frentes nuevos.
- Nota de override documental: cualquier documento operativo de credenciales o estado fuera de este panel se considera historico y sin autoridad de gobierno.

## Reconciliacion forense 2026-04-12

- Evidencia ejecutada localmente: `python scripts/check_all_providers.py --json-output`.
- Snapshot vigente escrito en `07_Operaciones/TOKEN_LIFECYCLE_STATE.json` a `2026-04-13T02:56:32.458903+00:00`.
- Override operativo inmediato:
  - Threads: `OK`
  - Instagram: `OK`
  - Facebook: `OK`
  - LinkedIn: `OK` para publishing cuando existe `LINKEDIN_MEMBER_URN`; la limitacion de `r_liteprofile` afecta solo autodiscovery de `/me`
  - YouTube: `RENEW_SOON` — refresh verificado 2026-04-13 (access token renovado; refresh_token funcional; rutina diaria automatizada)
  - X: `MISCONFIGURED`
  - TikTok: `MISCONFIGURED`
  - Cloudflare Pages / web: `OK` — etiqueta ejecutiva **WEB_CLOSED_IN_PRODUCTION** (deploy y HTTP verificados 2026-04-13; ver `07_Operaciones/CLOUDFLARE_PRODUCTION_CLOSURE_NOTE_2026-04-13.md`).
  - Frente API-first (publish canónico): **cerrado operativamente** — etiqueta **CLOSED_OPERATIVELY** (`07_Operaciones/API_FIRST_CLOSURE_NOTE_2026-04-13.md`). La publicación social canónica sigue siendo por APIs oficiales; no se reabre validación del flujo como frente abierto.
- Esta reconciliacion invalida cualquier estado previo en este archivo que contradiga ese snapshot.

## 1. Diagnostico ejecutivo corto

Los frentes **API-first** (orquestador + plataformas OK en lifecycle) y **web** (Cloudflare Pages) quedaron **cerrados** como proyectos de apertura; la operación diaria es **mantenimiento y publicación** sobre esas bases, no revalidar infraestructura desde cero.

Frecuencia Global mantiene **Threads**, **Instagram**, **Facebook** y **LinkedIn** en estado `OK` para publishing por API segun `TOKEN_LIFECYCLE_STATE.json`. La ausencia de `r_liteprofile` en LinkedIn solo afecta autodiscovery de `/me`.

La simplificacion vigente es:

1. **No reabrir** como frentes de trabajo: cierre API-first documentado, web **WEB_CLOSED_IN_PRODUCTION**, GitHub Pages y Vercel archivados, browser automation fuera de la ruta principal de publish.
2. Mantener publicación por **APIs oficiales** y el orquestador como entry point canónico.
3. Sacar a **X** y **TikTok** del camino crítico (sigue `MISCONFIGURED` en lifecycle hasta insumo externo).
4. Usar el indice documental, este panel, `TOKEN_LIFECYCLE_STATE.json` y `TOKEN_LIFECYCLE.md` como jerarquia; estado maestro consolidado en `07_Operaciones/PROJECT_MASTER_STATUS_2026-04-13.md`.

## 2. Tabla maestra


| Plataforma                       | Estado                              | Token/credencial                                                                                                       | Expira                                        | Test endpoint                                                                           | Ultimo resultado                                                                                                                | Proxima accion                                                                                               |
| -------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Threads (`API-FIRST`)            | `OK`                                | `THREADS_ACCESS_TOKEN`, `THREADS_USER_ID`                                                                              | 2026-06-09T21:38:04.806681+00:00              | `GET graph.threads.net/me`                                                              | PASS por API oficial; token valido, user id resuelto y expiracion registrada                                                    | Mantener como ruta viva y refrescar antes del siguiente vencimiento                                          |
| Instagram                        | `OK`                                | `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`                                                                          | Segun `INSTAGRAM_TOKEN_EXPIRES_AT` en JSON    | `GET graph.facebook.com/{INSTAGRAM_USER_ID}`                                            | PASS por provider y dry-run; limite: sin `META_APP_SECRET` no hay `fb_exchange_token` long-lived                                | Mantener la ruta API-first; si cae a `REAUTH_REQUIRED`, recuperacion corta oficial una vez y revalidar       |
| LinkedIn                         | `OK`                                | `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_MEMBER_URN`, `LINKEDIN_CLIENT_`*                                                    | Segun `LINKEDIN_TOKEN_EXPIRES_AT` en JSON     | `GET api.linkedin.com/v2/me`                                                            | 403 en `/me` sin `r_liteprofile`; URN explicito valido para publishing como `author`                                            | Publicar con URN; reautorizar con `r_liteprofile` solo si se requiere autodiscovery                          |
| YouTube                          | `RENEW_SOON`                        | `scripts/token.json`, `scripts/client_secret.json`                                                                     | Segun `token.json` vigente tras refresh local | `check_youtube_oauth.py` / refresh OAuth                                                | Hay refresh material, pero no hay flujo canonico de upload/publish por API                                                      | Mantener solo subida manual con `04_Produccion/YOUTUBE_Operations/FG_YT_Upload_SOP.md`                       |
| X                                | `MISCONFIGURED`                     | `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_SECRET`                                                       | N/A                                           | `POST api.x.com/2/tweets`                                                               | Faltan las cuatro credenciales oficiales y no existe write access vigente en el repo                                            | Mantener fuera del frente activo; solo publicar manualmente si un humano lo decide                           |
| TikTok                           | `MISCONFIGURED`                     | `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `TIKTOK_ACCESS_TOKEN`, `TIKTOK_OPEN_ID`                                   | N/A                                           | TikTok Content Posting API / app review                                                 | API no aprobada ni configurada en el repo actual                                                                                | Mantener fuera del frente activo; solo prueba manual privada si un humano lo decide                          |
| Facebook                         | `OK`                                | `FACEBOOK_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID`                                                                            | Segun `FACEBOOK_TOKEN_EXPIRES_AT` en JSON     | `GET graph.facebook.com/{FACEBOOK_PAGE_ID}`                                             | PASS por provider y dry-run; limite: page token sin `fb_exchange_token` long-lived sin `META_APP_SECRET`                        | Mantener la ruta API-first; si cae a `REAUTH_REQUIRED`, recuperacion corta oficial una vez y revalidar       |
| n8n Cloud / Bridge               | `MANUAL_ONLY`                       | `FG_BRIDGE_API_KEY`, secretos del bridge, credenciales n8n                                                             | N/A                                           | `GET /api/health` y workflows n8n                                                       | Hay bridge y workflows, pero el repo contiene muchas variantes paralelas y deriva documental                                    | Sacar publishing del flujo diario; dejar n8n solo como opcional para intake y logging si un humano lo reabre |
| Telegram                         | `MANUAL_ONLY`                       | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`                                                                               | N/A                                           | `GET api.telegram.org/bot.../getMe`                                                     | Integracion opcional y fragmentada entre local y n8n; no debe bloquear operacion                                                | Reemplazar dependencia por logging markdown en `07_Operaciones`                                              |
| Cloudflare Pages / Custom Domain | `OK` (**WEB_CLOSED_IN_PRODUCTION**) | OAuth Wrangler / token; `scripts/fg_deploy_cf_pages.py`; `website/wrangler.toml`; `wrangler` en `website/package.json` | N/a                                           | `GET https://www.frecuenciaglobal.org/` ; `GET https://www.frecuenciaglobal.org/stack/` | **2026-04-13:** deploy real exitoso; `www` y `/stack/` 200; apex `https://frecuenciaglobal.org` 301→`www`; script Windows UTF-8 | Despliegues: `python scripts/fg_deploy_cf_pages.py`; GitHub Pages y Vercel archivados                        |
| GitHub Pages                     | `ARCHIVED`                          | `scripts/fg_deploy_ghpages.py`, `59gray.github.io`                                                                     | N/A                                           | `https://59gray.github.io`                                                              | Ruta historica previa; ya no tiene autoridad operativa                                                                          | Conservar solo como evidencia historica y mover a archivo logico                                             |
| Vercel                           | `ARCHIVED`                          | `website/vercel.json`, referencias a `frecuenciaglobal.vercel.app`                                                     | N/A                                           | `https://frecuenciaglobal.vercel.app`                                                   | Ruta historica previa; sin autoridad operativa vigente                                                                          | Conservar solo como evidencia historica y mover a archivo logico                                             |
| Gemini / generacion de assets    | `MANUAL_ONLY`                       | `GEMINI_API_KEY` o sesion Chrome Gemini                                                                                | N/A                                           | Gemini web / scripts de assets                                                          | Util para assets, pero no es requisito para publicar ni para sostener la operacion                                              | Mantener como apoyo opcional de IA, nunca como dependencia operativa                                         |


## 3. PRIORITY_1 recomendado

**PRIORITY_1: mantenimiento operativo del stack Meta (Instagram/Facebook) ya normalizado por OAuth exchange**

Razon concreta:

- **2026-04-13:** ruta long-lived **cerrada** con evidencia en `07_Operaciones/META_LONG_LIVED_STATUS_2026-04-13.md` (**META_LONG_LIVED_NORMALIZED**): `META_APP_SECRET` presente, `setup_meta_long_lived_auth.py --write-env` exitoso, refresh vía exchange documentado en `refresh_meta_tokens.py`.
- La prioridad pasa a **vigilar expiración / data access** y ejecutar `python scripts/refresh_meta_tokens.py --write-env` segun `TOKEN_LIFECYCLE.md` ante ventana de riesgo, sin reabrir captura de secreto salvo rotacion en Meta.
- X, TikTok y YouTube upload por API siguen fuera de este foco; no consumen la jornada salvo decision explicita.

## 4. Estado de consolidacion Threads

- `.env.local` quedo consolidado con una sola definicion efectiva de:
  - `THREADS_ACCESS_TOKEN`
  - `THREADS_USER_ID`
- La ambiguedad previa estaba causada por una pareja duplicada al inicio del archivo, con `THREADS_USER_ID` vacio.
- `THREADS_TOKEN_EXPIRES_AT` ya quedo registrado por refresh oficial.
- La expiracion vigente quedo en `2026-06-09T21:38:04.806681+00:00`.
- Threads ya no arrastra huecos de metadata en el lifecycle diario.

## 5. Bloqueadores reales

1. X y TikTok siguen bloqueados externamente por credenciales/API no provisionadas y no deben consumir jornada.
2. YouTube sigue en `RENEW_SOON` y se mantiene fuera del frente diario de publishing.
3. LinkedIn sigue limitado para autodiscovery de `/me` sin `r_liteprofile`, pero no bloquea publishing con `LINKEDIN_MEMBER_URN`.
4. Todo documento fuera del indice maestro debe tratarse como historico u obsoleto, no como gobierno operativo.

## 5.1 Regla de estacionamiento Meta

- Meta queda **ACTIVO** cuando Instagram y Facebook estan en `OK` o `RENEW_SOON`, los providers pasan y el orquestador/bridge responden en dry-run.
- Si Instagram o Facebook caen a `REAUTH_REQUIRED` por expiracion del token corto, usar una sola vez la ruta oficial corta de recuperacion:
  1. `python scripts/refresh_meta_tokens.py --write-env`
  2. `python scripts/check_all_providers.py --platforms instagram,facebook --json-output`
  3. `python scripts/check_instagram_provider.py`
  4. `python scripts/check_facebook_provider.py`
  5. `python scripts/fg_publish_orchestrator.py --pieza P1_001 --platforms instagram,facebook --json-output`
- Exito de recuperacion: Instagram/Facebook vuelven a `OK` o `RENEW_SOON`, los providers pasan y el orquestador deja de bloquearlas.
- No correr `python scripts/refresh_meta_tokens.py --write-env` como intento repetitivo de normalizacion mientras falte `META_APP_SECRET`.
- El refresh sin `META_APP_SECRET` solo reemite user token corto desde `Graph API Explorer` y deja a Instagram/Facebook otra vez en `RENEW_SOON`; reactiva el frente, pero no normaliza lifecycle.
- Reabrir Meta long-lived solo cuando el operador humano reingrese password en Meta y permita capturar el `App secret`.

## 6. Flujo operativo por plataforma

### Threads

1. Preparar `04_Produccion/[PIEZA]_PublishReady.md`.
2. Validar lifecycle con `python scripts/check_all_providers.py --platforms threads --json-output --no-write`.
3. Publicar o dry-run por `python scripts/fg_publish_orchestrator.py --pieza <PIEZA> --platforms threads`.
4. Registrar URL, fecha y resultado en `07_Operaciones/FG_PUBLISH_LOG.md`.

### Instagram

1. Preparar `04_Produccion/[PIEZA]_PublishReady.md`.
2. Validar lifecycle con `python scripts/check_all_providers.py --platforms instagram --json-output --no-write`.
3. Publicar o dry-run por `python scripts/fg_publish_orchestrator.py --pieza <PIEZA> --platforms instagram`.
4. Si sigue `RENEW_SOON`, no repetir refresh circular; solo reabrir Meta cuando exista `META_APP_SECRET`.
5. Registrar URL, fecha y resultado en `07_Operaciones/FG_PUBLISH_LOG.md`.

### LinkedIn

1. Preparar `04_Produccion/[PIEZA]_PublishReady.md`.
2. Validar lifecycle con `python scripts/check_all_providers.py --platforms linkedin --json-output --no-write`.
3. Publicar o dry-run por `python scripts/fg_publish_orchestrator.py --pieza <PIEZA> --platforms linkedin`.
4. Reabrir scope `r_liteprofile` solo si se necesita autodiscovery por `/me`.

### YouTube

1. Seguir `04_Produccion/YOUTUBE_Operations/FG_YT_Upload_SOP.md`.
2. Usar `EP_*_YT_Metadata.md` y thumbnail aprobada.
3. Subir primero en `Unlisted`.
4. Validar y luego pasar a publico o programado.

### X

1. Extraer copy corta o hilo desde `PublishReady`.
2. Verificar preview y link si aplica.
3. Publicar manualmente desde la interfaz de X.
4. Guardar URL del post en log markdown.

### TikTok

1. Subir primero en privado o `Solo yo`.
2. Revisar safe zones y cover con `04_Produccion/TIKTOK_Test_Protocol.md`.
3. Publicar desde la app si el test privado pasa.
4. Registrar URL y observaciones.

### Facebook

1. Preparar `04_Produccion/[PIEZA]_PublishReady.md`.
2. Validar lifecycle con `python scripts/check_all_providers.py --platforms facebook --json-output --no-write`.
3. Publicar o dry-run por `python scripts/fg_publish_orchestrator.py --pieza <PIEZA> --platforms facebook`.
4. Si sigue `RENEW_SOON`, no repetir refresh circular; solo reabrir Meta cuando exista `META_APP_SECRET`.
5. Registrar URL y fecha en `07_Operaciones/FG_PUBLISH_LOG.md`.

### n8n / Telegram

1. No bloquear operacion diaria por automatizacion.
2. Sustituir notificaciones por registro manual en markdown.
3. Reabrir n8n solo si se necesita intake o reporting, nunca como condicion para publicar.

## 7. Simplificacion concreta

### Conservar

- `scripts/threads_publish_post.py`
- `scripts/fg_publish_orchestrator.py`, como entry point canonico para Meta
- `scripts/facebook_api_publish.py`
- `scripts/check_threads_provider.py`
- `scripts/credential_lifecycle.py` como evidencia tecnica puntual
- `04_Produccion/PUBLISHREADY_TEMPLATE.md`
- `scripts/validate_publishready.py`
- Protocolos manuales por plataforma en `04_Produccion/*_Test_Protocol.md`
- `scripts/fg_deploy_cf_pages.py` como unica ruta web canonica prevista

### Congelar

- Expansion de scopes LinkedIn (`r_liteprofile`, etc.) salvo necesidad documentada; el publisher con URN ya esta en ruta activa
- Todo publishing via n8n y bridge como dependencia diaria
- Telegram como canal critico
- GitHub Pages y Vercel como rutas historicas sin autoridad operativa

### Archivar logicamente

- Documentos repetidos de credenciales fuera de este panel
- Workflows n8n duplicados o ligados a publish
- Scripts legacy de browser publishing
- Rutas Vercel y GitHub Pages fuera del camino critico

### Depende 100% del usuario

- Reingresar password en Meta cuando se quiera revelar `META_APP_SECRET`
- Completar OAuth humano solo cuando exista cambio externo real en LinkedIn o YouTube
- Ajustes de dashboard en LinkedIn, TikTok, Cloudflare y n8n
- Limpieza y rotacion de residuos sensibles locales

### La IA puede seguir resolviendo

- Generar y validar `PublishReady`
- Adaptar copy por plataforma
- Auditar estado documental y tecnico
- Mantener este panel actualizado
- Preparar checklists, SOPs y reportes
- Detectar contradicciones, duplicados y pasos innecesarios

## 8. Residuos sensibles pendientes de rotacion o archivo


| Ruta                                        | Tipo                             | Accion recomendada        | Motivo                                                                                         |
| ------------------------------------------- | -------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------- |
| `.env.local.backup_20260409_002848`         | Backup de secretos locales       | `conservar temporalmente` | Sirve como rollback inmediato, pero no debe permanecer en repo activo mas de una ventana corta |
| `scripts/token.backup_20260408_232533.json` | Backup OAuth YouTube             | `archivar fuera del repo` | Es material sensible de OAuth y no debe vivir en workspace activo                              |
| `scripts/token.backup_20260409_000206.json` | Backup OAuth YouTube             | `conservar temporalmente` | Es el backup mas reciente y puede servir mientras se estabiliza la ruta manual de YouTube      |
| `.linkedin_creds_temp.json`                 | Residuo temporal de credenciales | `eliminar localmente`     | Es archivo transitorio, no operacional                                                         |
| `scripts/.oauth_state`                      | Estado temporal de OAuth         | `eliminar localmente`     | Es efimero y no aporta gobierno operativo                                                      |
| `scripts/youtube_auth_url.txt`              | URL local de reautorizacion      | `eliminar localmente`     | No debe persistir una vez terminada la corrida                                                 |
| `scripts/youtube_reauth_output.txt`         | Log de reautorizacion            | `archivar fuera del repo` | Puede ser util como evidencia, pero no debe quedar en el workspace activo                      |


## 9. ARCHIVE_CANDIDATES

### A. Docs duplicados de credenciales y estado

- `ESTADO_CREDENCIALES_ACTUAL.md`
- `07_Operaciones/ESTADO_CREDENCIALES_ACTUAL.md`
- `CREDENTIALS_SUMMARY.md`
- `CREDENTIALS_CHECKLIST.md`
- `CREDENTIALS_AUDIT_REPORT.md`
- `CREDENCIALES_FALTANTES.md`
- `07_Operaciones/SECRETS_STATUS.md`
- `07_Operaciones/REAUTH_RUNBOOK_LINKEDIN_YOUTUBE.md`
- `07_Operaciones/TOKEN_LIFECYCLE_STATUS_*.md`
- `07_Operaciones/INSTAGRAM_PROVIDER_STATUS_*.md`
- `07_Operaciones/LINKEDIN_PROVIDER_STATUS_*.md`
- `07_Operaciones/THREADS_PROVIDER_STATUS_*.md`

No archivar:

- `07_Operaciones/DOCUMENTATION_AUTHORITY_INDEX.md`
- `07_Operaciones/API_CONTROL_PANEL.md`
- `07_Operaciones/TOKEN_LIFECYCLE_STATE.json`
- `07_Operaciones/TOKEN_LIFECYCLE.md`
- `07_Operaciones/PUBLISHING_API_FIRST_SOURCE_OF_TRUTH_2026-04-08.md`

### B. Workflows n8n redundantes o fuera del camino critico

- Carpeta completa `08_n8n/workflows_runtime/`
- Carpeta completa `08_n8n/workflows_fixed/`
- Carpeta completa `08_n8n/workflows_import_ready/`
- Carpeta completa `08_n8n/workflows_import_ready_v1/`
- `08_n8n/workflows/WF-006_preparar_publicacion.json`
- `08_n8n/workflows/WF-007_publicar_x.json`
- `08_n8n/workflows/WF-006_Auto_Checkpoint.json`
- `08_n8n/workflows/WF-008_auto_checkpoint.json`
- `08_n8n/workflows/sub/SUB-002_notificar_telegram.json`
- `08_n8n/workflows_cloud/WF-006_preparar_publicacion.json`
- `08_n8n/workflows_cloud/WF-007_publicar_x.json`
- `08_n8n/workflows_cloud/WF-008_publicar_instagram.json`
- `08_n8n/workflows_cloud/WF-009_publicar_linkedin.json`
- `08_n8n/workflows_cloud/WF-010_publicar_tiktok.json`
- `08_n8n/workflows_cloud/WF-011_threads_token_refresh.json`
- `08_n8n/workflows_cloud/sub/SUB-002_notificar_telegram.json`

### C. Scripts legacy de browser publishing

- `scripts/ig_publish_post.py`
- `scripts/ig_publish_chrome_real.py`
- `scripts/ig_chrome_login.py`
- `scripts/linkedin_publish_post.py`
- `scripts/linkedin_chrome_login.py`
- `scripts/tk_publish_post.py`
- `scripts/tk_chrome_login.py`
- `scripts/x_publish_post.py`
- `scripts/x_publish_post_persistente.py`
- `scripts/x_chrome_login.py`
- `scripts/social_web_publish.py`
- `scripts/chrome_broker.py`
- `scripts/chrome_worker.py`
- `scripts/chrome_health.py`
- `scripts/chrome_broker_puppeteer.js`
- `scripts/chrome_worker_puppeteer.js`
- `scripts/chrome_health_puppeteer.js`
- `scripts/playwright-chrome-launcher.js`
- `scripts/playwright-chrome-launcher.mjs`
- `scripts/meta_oauth_flow.py`
- `scripts/meta_token_reauth.py`
- `scripts/meta_token_extract.py`
- `scripts/meta_token_extract_puppeteer.js`
- `scripts/meta_session_check.js`
- `scripts/meta_reauth_step2.py`
- `scripts/meta_quick_check.py`
- `scripts/meta_operate.py`
- `scripts/meta_final.py`
- `scripts/open_meta_explorer.py`

### D. Rutas Vercel y GitHub Pages fuera del camino critico

- `website/vercel.json`
- `scripts/fg_deploy_ghpages.py`
- `scripts/monitor_domain.py`
- Secciones de deploy Vercel en `website/README.md`
- Referencias activas a `59gray.github.io`
- Referencias operativas a `frecuenciaglobal.vercel.app` depuradas en código y guías activas (2026-04-12); ver [IDENTITY_SOURCE_OF_TRUTH.md](../IDENTITY_SOURCE_OF_TRUTH.md). Pueden persistir en informes fechados u ops históricas.

## 10. Inventario auditado

### Env, secretos y residuos de auth

- `.env.example`
- `.env.local.example`
- `.env.local`
- `.env.local.backup_`*
- `.linkedin_creds_temp.json`
- `scripts/.oauth_state`
- `scripts/token.backup_*.json`
- `scripts/youtube_auth_url.txt`
- `scripts/youtube_reauth_output.txt`
- `scripts/load_local_secrets.ps1`
- `scripts/utils/__init__.py`
- `scripts/providers/token_store.py`

### Estado, lifecycle y credenciales

- `07_Operaciones/TOKEN_LIFECYCLE.md`
- `07_Operaciones/TOKEN_LIFECYCLE_STATE.json`
- `07_Operaciones/TOKEN_LIFECYCLE_STATUS_*.md`
- `07_Operaciones/REAUTH_RUNBOOK_LINKEDIN_YOUTUBE.md`
- `07_Operaciones/SECRETS_STATUS.md`
- `ESTADO_CREDENCIALES_ACTUAL.md`
- `07_Operaciones/ESTADO_CREDENCIALES_ACTUAL.md`
- `CREDENTIALS_SUMMARY.md`
- `CREDENTIALS_CHECKLIST.md`
- `CREDENTIALS_AUDIT_REPORT.md`
- `CREDENCIALES_FALTANTES.md`

### Scripts y providers de integracion

- `scripts/fg_publish_orchestrator.py`
- `scripts/threads_publish_post.py`
- `scripts/ig_api_publish.py`
- `scripts/linkedin_mvp_api.py`
- `scripts/check_threads_provider.py`
- `scripts/check_instagram_provider.py`
- `scripts/check_linkedin_provider.py`
- `scripts/check_youtube_oauth.py`
- `scripts/refresh_threads_token.py`
- `scripts/refresh_youtube_token.py`
- `scripts/reauth_youtube_oauth.py`
- `scripts/linkedin_capture_member_urn.py`
- `scripts/providers/`*

### Scripts legacy o semimanuales

- `scripts/ig_publish_post.py`
- `scripts/linkedin_publish_post.py`
- `scripts/tk_publish_post.py`
- `scripts/x_publish_post.py`
- `scripts/x_publish_post_persistente.py`
- `scripts/social_web_publish.py`
- `scripts/meta_*`
- `scripts/*chrome*`
- `scripts/*playwright*`
- `scripts/fg_local_publish_mvp.py`

### n8n, bridge y notificaciones

- `08_n8n/bridge/server.js`
- `08_n8n/CREDENCIALES_N8N_CLOUD.md`
- `08_n8n/CONFIGURAR_TELEGRAM.md`
- `08_n8n/TELEGRAM_N8N_STEPS.md`
- `08_n8n/PLAN_APIs_n8n.md`
- `08_n8n/docs/*`
- `08_n8n/workflows*/*.json`
- `08_n8n/scripts/*.js`

### Publicacion manual y SOPs

- `04_Produccion/PUBLISHREADY_TEMPLATE.md`
- `04_Produccion/PIPELINE_GUIDE.md`
- `04_Produccion/INSTAGRAM_Test_Protocol.md`
- `04_Produccion/LINKEDIN_Test_Protocol.md`
- `04_Produccion/X_Test_Protocol.md`
- `04_Produccion/TIKTOK_Test_Protocol.md`
- `04_Produccion/YOUTUBE_Test_Protocol.md`
- `04_Produccion/YOUTUBE_Operations/*.md`

### Infraestructura y deploy

- `scripts/fg_deploy_ghpages.py`
- `scripts/fg_deploy_cf_pages.py`
- `scripts/fg_system_status.py`
- `scripts/monitor_domain.py`
- `scripts/register_is_a_dev.py`
- `website/vercel.json`
- `website/README.md`
- `website/EMAIL_SETUP.md`
- `domains/frecuenciaglobal.json`

## 11. Recomendacion final

La recomendacion final es **cerrar el proyecto alrededor de un solo control plane activo API-first: Threads, Instagram, Facebook y LinkedIn por APIs oficiales**. LinkedIn queda en este plano solo con `LINKEDIN_MEMBER_URN` real y publicacion por `author` explicito; sin `r_liteprofile` no hay autodiscovery fiable de `/me`.

Todo lo demas debe operar, por ahora, en uno de estos modos:

- **manual nativo**: X, TikTok, YouTube
- **manual asistido por IA**: copy, checklist, QA, logging, panel
- **congelado / fuera del camino critico**: n8n publish, Telegram, Vercel, GitHub Pages, browser automation legacy

Con esta reduccion, Frecuencia Global sigue siendo gobernable y ya tiene una base API-first canonica (Meta + LinkedIn con URN) para operar sin browser automation. El frente web en **Cloudflare Pages** queda **WEB_CLOSED_IN_PRODUCTION** (`07_Operaciones/CLOUDFLARE_PRODUCTION_CLOSURE_NOTE_2026-04-13.md`).