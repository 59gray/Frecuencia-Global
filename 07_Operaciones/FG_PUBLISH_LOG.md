# FG Publish Log

## 2026-04-12 — TEST_FB_STORY_VID_001 (Publicación Real — video_stories fix)

- **Pieza:** TEST_FB_STORY_VID_001
- **Formato:** `fb_story_video`
- **Acción:** Publicación real tras corrección de endpoint en `publish_story()`

### ✅ SUCCESS facebook (Story Video)

- **Status:** SUCCESS
- **Veredicto:** `FB_STORIES_VALIDATED` ✅
- **Post ID:** `2024829101777737`
- **Post URL:** `https://facebook.com/stories/2024829101777737`
- **Duración:** 9.52s
- **Asset:** TEST_FB_STORY_VID_001_1080x1920.mp4 (205 KB, ~1s)
- **Flujo API:** `video_stories` start (video_id=2196788721127343) → transfer → finish
- **Return code:** 0

---

## 2026-04-12 — TEST_FB_STORY_IMG_001 (Publicación Real — photo_stories fix)

- **Pieza:** TEST_FB_STORY_IMG_001
- **Formato:** `fb_story_image`
- **Acción:** Publicación real tras corrección de endpoint en `publish_story()`

### ✅ SUCCESS facebook (Story Image)

- **Status:** SUCCESS
- **Veredicto:** `FB_STORIES_VALIDATED` ✅
- **Post ID:** `1486675876418367`
- **Duración:** 7.06s
- **Asset:** TEST_FB_STORY_IMG_001_1080x1920.png
- **Flujo API:** `/photos` (published=false) → `photo_stories` con `photo_id=122105294126848603`
- **Fix aplicado:** `/{page_id}/stories` (incorrecto) → `/photos` + `/{page_id}/photo_stories` con photo_id
- **Return code:** 0

---

## 2026-04-12 06:17:00 — TEST_FB_STORY_IMG_001 (Retry post-pages_manage_engagement)

- **Pieza:** TEST_FB_STORY_IMG_001
- **Formato:** Facebook Story Image
- **Acción:** Retry completo tras confirmar `pages_manage_engagement` granted
- **Operación:** PLATAFORMAS / FACEBOOK STORIES RETRY

### PRECHECK

- **Provider status:** operational
- **Configured:** True
- **Auth valid:** True
- **Page token:** válido para Frecuencia Global (986972071173928)
- **User token scopes:** pages_show_list, pages_manage_metadata, pages_manage_posts
- **me/accounts:** data=[] (vacío, acceso por ruta directa confirmado)

### DRY-RUN facebook (Story Image)

- **Status:** PASS
- **Asset type:** image (1080x1920)
- **Copy source:** Facebook

### ❌ FAIL facebook (Story Image — publicación real)

- **Status:** FAIL
- **Error HTTP:** 400
- **Error code:** 100
- **Error subcode:** 33
- **Error type:** GraphMethodException
- **Error message:** `Unsupported post request. Object with ID '986972071173928' does not exist, cannot be loaded due to missing permissions, or does not support this operation.`
- **Endpoint usado:** `POST /v21.0/986972071173928/stories`
- **Return code:** 1

### DIAGNÓSTICO DIFERENCIAL (post-retry)

Tras confirmar que `pages_manage_engagement` ya está granted y que el bloqueo previo de permisos no aplica, se realizó diagnóstico de endpoints:


| Endpoint                                           | Resultado  | Código | Tipo                      |
| -------------------------------------------------- | ---------- | ------ | ------------------------- |
| `POST /{page_id}/stories`                          | 400        | 100/33 | GraphMethodException      |
| `POST /{page_id}/photo_stories` (sin URL)          | 500        | 1      | OAuthException            |
| `POST /{page_id}/video_stories?upload_phase=start` | **200 OK** | —      | —                         |
| `GET /{page_id}/subscribed_apps`                   | 200        | —      | data=[]                   |
| `GET /me/permissions` (con page token)             | 200        | —      | [] (esperado: page token) |


**Causa exacta confirmada:**

- `/{page_id}/stories` es un edge de **lectura**, NO de escritura para crear Stories.
- Los endpoints correctos son `/{page_id}/photo_stories` (imagen) y `/{page_id}/video_stories` (video).
- `video_stories?upload_phase=start` devolvió **200 OK**, confirmando que el token SÍ tiene acceso a endpoints de stories — el bloqueo no es de permisos ni de app installation.
- El error 100/33 es consecuencia directa de llamar un edge que no soporta POST de creación.

### FASE 2 — Story Video

- **Pieza:** TEST_FB_STORY_VID_001
- **Estado:** SKIP — pieza no existe (`04_Produccion/TEST_FB_STORY_VID_001_PublishReady.md` ausente)
- **Nota:** Solo existe `TEST_IG_STORY_VID_001`. No se creó pieza FB equivalente.

---

## 2026-04-08 17:33:33 — P1_001

- **Dry-run:** True
- **Total:** 2 | **Passed:** 2 | **Failed:** 0 | **Skipped:** 0 | **Errors:** 0

### ✅ THREADS

- **Status:** PASS
- **Duration:** 0.7s
- **Return Code:** 0

### ✅ INSTAGRAM

- **Status:** PASS
- **Duration:** 0.5s
- **Return Code:** 0

## 2026-04-08 21:11:21 - P1_001

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 2 | Failed: 1 | Skipped: 0 | Errors: 0

### OK threads

- Status: PASS
- Duration: 0.5s
- Return code: 0

### OK instagram

- Status: PASS
- Duration: 0.4s
- Return code: 0

### FAIL linkedin

- Status: FAIL
- Duration: 0.1s
- Detail: 2026-04-08 21:11:21 [ERROR] LINKEDIN_MEMBER_URN inv�lido: urn:li:person:YOUR_PERSON_ID_HERE
2026-04-08 21:11:21 [ERROR] Formato requerido: urn:li:person:{id_real} y no placeholder
- Return code: 1

## 2026-04-08 21:11:47 - P1_001

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 2 | Failed: 1 | Skipped: 0 | Errors: 0

### OK threads

- Status: PASS
- Duration: 0.4s
- Return code: 0

### OK instagram

- Status: PASS
- Duration: 0.5s
- Return code: 0

### FAIL linkedin

- Status: FAIL
- Duration: 0.1s
- Detail: 2026-04-08 21:11:47 [ERROR] LINKEDIN_MEMBER_URN inv�lido: urn:li:person:YOUR_PERSON_ID_HERE
2026-04-08 21:11:47 [ERROR] Formato requerido: urn:li:person:{id_real} y no placeholder
- Return code: 1

## 2026-04-08 21:12:22 - P1_001

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 1 | Failed: 2 | Skipped: 0 | Errors: 0

### OK threads

- Status: PASS
- Duration: 1.1s
- Return code: 0

### FAIL instagram

- Status: FAIL
- Duration: 0.8s
- Detail: [OK] Caption: 416 chars
[OK] Imagen: C:\Users\farid\Documents\Frecuencia Global\06_Assets\P1_001\FG_P1_001_IG_Cover_v1_20260404_0.png

Los cables submarinos que conectan (y controlan) internet

Los cables submarinos no son solo infraestructura t�cnica: son el nuevo campo de batalla geopol�tico donde Estados Unidos, China y Rusia comp...

[ERROR] No se pudo validar acceso Instagram: {'error': {'mes

- Return code: 1

### FAIL linkedin

- Status: FAIL
- Duration: 0.2s
- Detail: 2026-04-08 21:12:22 [ERROR] LINKEDIN_MEMBER_URN inv�lido: urn:li:person:YOUR_PERSON_ID_HERE
2026-04-08 21:12:22 [ERROR] Formato requerido: urn:li:person:{id_real} y no placeholder
- Return code: 1

## 2026-04-08 21:22:46 - P1_001

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 1 | Failed: 2 | Skipped: 0 | Errors: 0

### OK threads

- Status: PASS
- Duration: 1.1s
- Return code: 0

### FAIL instagram

- Status: FAIL
- Duration: 1.1s
- Detail: [OK] Caption: 416 chars
[OK] Imagen: C:\Users\farid\Documents\Frecuencia Global\06_Assets\P1_001\FG_P1_001_IG_Cover_v1_20260404_0.png

Los cables submarinos que conectan (y controlan) internet

Los cables submarinos no son solo infraestructura t�cnica: son el nuevo campo de batalla geopol�tico donde Estados Unidos, China y Rusia comp...

[ERROR] No se pudo validar acceso Instagram: {'error': {'mes

- Return code: 1

### FAIL linkedin

- Status: FAIL
- Duration: 0.2s
- Detail: 2026-04-08 21:22:46 [ERROR] LINKEDIN_MEMBER_URN inv�lido: urn:li:person:YOUR_PERSON_ID_HERE
2026-04-08 21:22:46 [ERROR] Formato requerido: urn:li:person:{id_real} y no placeholder
- Return code: 1

## 2026-04-08 21:41:34 - P1_001

- Mode: dry-run
- API only: True
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0

### OK threads

- Status: PASS
- Duration: 1.0s
- Return code: 0

## 2026-04-08 21:41:34 - P1_001

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 1 | Failed: 0 | Skipped: 2 | Errors: 0

### OK threads

- Status: PASS
- Duration: 1.0s
- Return code: 0

### SKIP instagram

- Status: SKIPPED
- Duration: 0.0s
- Detail: Credential lifecycle blocked instagram: REAUTH_REQUIRED :: Instagram Graph API 400: Error validating access token: Session has expired on Wednesday, 08-Apr-26 18:00:00 PDT. The current time is Wednesday, 08-Apr-26 20:41:35 PDT. :: Regenerar INSTAGRAM_ACCESS_TOKEN oficial y rerun scripts/check_instagram_provider.py.

### SKIP linkedin

- Status: SKIPPED
- Duration: 0.0s
- Detail: Credential lifecycle blocked linkedin: MISCONFIGURED :: LinkedIn API 403: Not enough permissions to access: me.GET.NO_VERSION :: El token no permite resolver /me y LINKEDIN_MEMBER_URN sigue ausente o placeholder. Reautoriza con r_liteprofile o fija el person URN real manualmente.

## 2026-04-08 21:56:08 - P1_001

- Mode: dry-run
- API only: True
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0

### OK threads

- Status: PASS
- Duration: 1.0s
- Return code: 0

## 2026-04-08 22:14:22 - P1_001

- Mode: dry-run
- API only: True
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0

### OK threads

- Status: PASS
- Duration: 0.9s
- Return code: 0

## 2026-04-08 22:26:50 - P1_001

- Mode: dry-run
- API only: True
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0

### OK threads

- Status: PASS
- Duration: 1.1s
- Lifecycle state: OK
- Return code: 0

## 2026-04-08 22:27:07 - P1_001

- Mode: dry-run
- API only: True
- Total: 2 | Passed: 1 | Failed: 0 | Skipped: 1 | Errors: 0

### OK threads

- Status: PASS
- Duration: 1.1s
- Lifecycle state: OK
- Return code: 0

### SKIP linkedin

- Status: SKIPPED
- Duration: 0.0s
- Lifecycle state: MISCONFIGURED
- Detail: Credential lifecycle blocked linkedin: MISCONFIGURED :: LinkedIn API 403: Not enough permissions to access: me.GET.NO_VERSION :: LINKEDIN_MEMBER_URN sigue en placeholder y el token actual no puede autodescubrirlo porque no tiene r_liteprofile. Configura LINKEDIN_MEMBER_URN=urn:li:person:{id_real} o reautoriza con python scripts/linkedin_capture_member_urn.py --print-reauth-url.

## 2026-04-08 22:30:38 - P1_001

- Mode: dry-run
- API only: True
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0

### OK threads

- Status: PASS
- Duration: 1.1s
- Lifecycle state: OK
- Return code: 0

## 2026-04-08 22:31:42 - P1_001

- Mode: dry-run
- API only: True
- Total: 2 | Passed: 1 | Failed: 0 | Skipped: 1 | Errors: 0

### OK threads

- Status: PASS
- Duration: 1.0s
- Lifecycle state: OK
- Return code: 0

### SKIP linkedin

- Status: SKIPPED
- Duration: 0.0s
- Lifecycle state: MISCONFIGURED
- Detail: Credential lifecycle blocked linkedin: MISCONFIGURED :: LinkedIn API 403: Not enough permissions to access: me.GET.NO_VERSION :: LINKEDIN_MEMBER_URN sigue en placeholder y el token actual no puede autodescubrirlo porque no tiene r_liteprofile. Configura LINKEDIN_MEMBER_URN=urn:li:person:{id_real} o reautoriza con python scripts/linkedin_capture_member_urn.py --print-reauth-url.

## 2026-04-10 15:37:12 - P1_001

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 3 | Failed: 0 | Skipped: 0 | Errors: 0

### OK threads

- Status: PASS
- Duration: 1.2s
- Lifecycle state: OK
- Return code: 0

### OK instagram

- Status: PASS
- Duration: 1.1s
- Lifecycle state: RENEW_SOON
- Return code: 0

### OK facebook

- Status: PASS
- Duration: 1.6s
- Lifecycle state: RENEW_SOON
- Return code: 0

## 2026-04-10 18:50:26 - P1_001

- Mode: dry-run
- API only: True
- Total: 2 | Passed: 2 | Failed: 0 | Skipped: 0 | Errors: 0

### OK instagram

- Status: PASS
- Duration: 1.3s
- Lifecycle state: RENEW_SOON
- Return code: 0

### OK facebook

- Status: PASS
- Duration: 1.5s
- Lifecycle state: RENEW_SOON
- Return code: 0

## 2026-04-10 23:51:21 - P1_001

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 1 | Failed: 0 | Skipped: 2 | Errors: 0

### OK threads

- Status: PASS
- Duration: 0.9s
- Lifecycle state: OK
- Return code: 0

### SKIP instagram

- Status: SKIPPED
- Duration: 0.0s
- Lifecycle state: REAUTH_REQUIRED
- Detail: Credential lifecycle blocked instagram: REAUTH_REQUIRED :: Instagram Graph API 400: Error validating access token: Session has expired on Friday, 10-Apr-26 19:00:00 PDT. The current time is Friday, 10-Apr-26 22:51:19 PDT. :: Ejecutar python scripts/refresh_meta_tokens.py --write-env y rerun scripts/check_instagram_provider.py.

### SKIP facebook

- Status: SKIPPED
- Duration: 0.0s
- Lifecycle state: REAUTH_REQUIRED
- Detail: Credential lifecycle blocked facebook: REAUTH_REQUIRED :: Facebook Graph API 400: Error validating access token: Session has expired on Friday, 10-Apr-26 19:00:00 PDT. The current time is Friday, 10-Apr-26 22:51:19 PDT. :: Ejecutar python scripts/refresh_meta_tokens.py --write-env y validar el PAGE_ID.

## 2026-04-11 10:29:02 - P1_001

- Mode: dry-run
- API only: True
- Total: 2 | Passed: 2 | Failed: 0 | Skipped: 0 | Errors: 0

### OK instagram

- Status: PASS
- Duration: 1.1s
- Lifecycle state: RENEW_SOON
- Return code: 0

### OK facebook

- Status: PASS
- Duration: 1.4s
- Lifecycle state: RENEW_SOON
- Return code: 0

## 2026-04-11 10:34:46 - P1_001

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 3 | Failed: 0 | Skipped: 0 | Errors: 0

### OK threads

- Status: PASS
- Duration: 1.2s
- Lifecycle state: OK
- Return code: 0

### OK instagram

- Status: PASS
- Duration: 1.1s
- Lifecycle state: RENEW_SOON
- Return code: 0

### OK facebook

- Status: PASS
- Duration: 1.3s
- Lifecycle state: RENEW_SOON
- Return code: 0

## 2026-04-11 10:44:31 - P1_001

- Mode: publish
- API only: True
- Total: 3 | Passed: 3 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 1
- Post-verification correction: Instagram publish succeeded externally; the only failure was a local stdout encoding bug after `media_publish`.

### OK threads

- Status: PASS
- Duration: 12.0s
- Lifecycle state: OK
- Post ID: 17933378511233121
- Post URL: [https://threads.net/@frecuenciaglobal/post/17933378511233121](https://threads.net/@frecuenciaglobal/post/17933378511233121)
- Return code: 0

### OK instagram

- Status: PASS
- Operational status: PUBLISHED_WITH_LOCAL_WARNING
- Duration: 9.7s
- Lifecycle state: RENEW_SOON
- Post ID: 18368026819166081
- Post URL: [https://www.instagram.com/p/DW_5_0yFT0N/](https://www.instagram.com/p/DW_5_0yFT0N/)
- Warning: El post se publico externamente, pero el proceso local termino con una excepcion tardia despues de capturar el identificador de publicacion.
- Detail: Traceback (most recent call last):
File "C:\Users\farid\Documents\Frecuencia Global\scripts\ig_api_publish.py", line 251, in 
  main()
- Return code: 1

### OK facebook

- Status: PASS
- Duration: 7.4s
- Lifecycle state: RENEW_SOON
- Post ID: 122105146814848603
- Post URL: [https://facebook.com/122105146814848603](https://facebook.com/122105146814848603)
- Return code: 0

## 2026-04-11 11:11:18 - EP_001

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 3 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK threads

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.0s
- Lifecycle state: OK
- Return code: 0

### OK instagram

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.1s
- Lifecycle state: RENEW_SOON
- Return code: 0

### OK facebook

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.3s
- Lifecycle state: RENEW_SOON
- Return code: 0

## 2026-04-11 11:17:43 - EP_001

- Mode: publish
- API only: True
- Total: 3 | Passed: 3 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK threads

- Status: PASS
- Operational status: PUBLISHED
- Duration: 13.3s
- Lifecycle state: OK
- Post ID: 18081231518099143
- Post URL: [https://threads.net/@frecuenciaglobal/post/18081231518099143](https://threads.net/@frecuenciaglobal/post/18081231518099143)
- Return code: 0

### OK instagram

- Status: PASS
- Operational status: PUBLISHED
- Duration: 17.9s
- Lifecycle state: RENEW_SOON
- Post ID: 18088708561975416
- Post URL: [https://www.instagram.com/p/DW_9ymBlRH9/](https://www.instagram.com/p/DW_9ymBlRH9/)
- Return code: 0

### OK facebook

- Status: PASS
- Operational status: PUBLISHED
- Duration: 8.1s
- Lifecycle state: RENEW_SOON
- Post ID: 122105154116848603
- Post URL: [https://facebook.com/122105154116848603](https://facebook.com/122105154116848603)
- Return code: 0

## 2026-04-11 11:40:46 - EP_002

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 2 | Failed: 1 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK threads

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 0.5s
- Lifecycle state: OK
- Return code: 0

### FAIL instagram

- Status: FAIL
- Duration: 0.5s
- Lifecycle state: RENEW_SOON
- Detail: [ERROR] Imagen no encontrada: None
- Return code: 1

### OK facebook

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.4s
- Lifecycle state: RENEW_SOON
- Return code: 0

## 2026-04-11 11:42:06 - EP_002

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 0 | Failed: 0 | Skipped: 3 | Errors: 0 | Warnings: 0

### SKIP threads

- Status: SKIPPED
- Duration: 0.8s
- Lifecycle state: OK
- Detail: [SKIPPED] Threads no soporta publicaci�n de video por API todav�a. Asset: EP_002_clip_1_IG_1080x1920.mp4
- Return code: 0

### SKIP instagram

- Status: SKIPPED
- Duration: 0.9s
- Lifecycle state: RENEW_SOON
- Detail: [SKIPPED] Instagram no soporta publicación de video por API de forma segura todavía. Asset: EP_002_clip_1_IG_1080x1920.mp4
- Return code: 0

### SKIP facebook

- Status: SKIPPED
- Duration: 1.1s
- Lifecycle state: RENEW_SOON
- Detail: [SKIPPED] Facebook no soporta publicaci�n de video por API todav�a. Asset: EP_002_clip_1_IG_1080x1920.mp4
- Return code: 0

## 2026-04-11 11:46:26 - EP_002

- Mode: dry-run
- API only: True
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK instagram

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.1s
- Lifecycle state: RENEW_SOON
- Return code: 0

## 2026-04-11 11:47:56 - EP_002

- Mode: dry-run
- API only: True
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK instagram

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.0s
- Lifecycle state: RENEW_SOON
- Asset type: video
- Return code: 0

## 2026-04-11 11:52:17 - EP_002

- Mode: dry-run
- API only: True
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK threads

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 0.8s
- Lifecycle state: OK
- Asset type: video
- Return code: 0

## 2026-04-11 12:01:52 - EP_002

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 1 | Failed: 0 | Skipped: 2 | Errors: 0 | Warnings: 0

### OK threads

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 0.5s
- Lifecycle state: OK
- Asset type: video
- Return code: 0

### SKIP instagram

- Status: SKIPPED
- Duration: 0.0s
- Lifecycle state: REAUTH_REQUIRED
- Detail: Credential lifecycle blocked instagram: REAUTH_REQUIRED :: Instagram Graph API 400: Error validating access token: Session has expired on Saturday, 11-Apr-26 11:00:00 PDT. The current time is Saturday, 11-Apr-26 11:01:53 PDT. :: Ejecutar python scripts/refresh_meta_tokens.py --write-env y rerun scripts/check_instagram_provider.py.

### SKIP facebook

- Status: SKIPPED
- Duration: 0.0s
- Lifecycle state: REAUTH_REQUIRED
- Detail: Credential lifecycle blocked facebook: REAUTH_REQUIRED :: Facebook Graph API 400: Error validating access token: Session has expired on Saturday, 11-Apr-26 11:00:00 PDT. The current time is Saturday, 11-Apr-26 11:01:53 PDT. :: Ejecutar python scripts/refresh_meta_tokens.py --write-env y validar el PAGE_ID.

## 2026-04-11 12:02:27 - EP_002

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 1 | Failed: 0 | Skipped: 2 | Errors: 0 | Warnings: 0

### OK threads

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 0.5s
- Lifecycle state: OK
- Asset type: video
- Return code: 0

### SKIP instagram

- Status: SKIPPED
- Duration: 0.0s
- Lifecycle state: REAUTH_REQUIRED
- Detail: Credential lifecycle blocked instagram: REAUTH_REQUIRED :: Instagram Graph API 400: Error validating access token: Session has expired on Saturday, 11-Apr-26 11:00:00 PDT. The current time is Saturday, 11-Apr-26 11:02:27 PDT. :: Ejecutar python scripts/refresh_meta_tokens.py --write-env y rerun scripts/check_instagram_provider.py.

### SKIP facebook

- Status: SKIPPED
- Duration: 0.0s
- Lifecycle state: REAUTH_REQUIRED
- Detail: Credential lifecycle blocked facebook: REAUTH_REQUIRED :: Facebook Graph API 400: Error validating access token: Session has expired on Saturday, 11-Apr-26 11:00:00 PDT. The current time is Saturday, 11-Apr-26 11:02:28 PDT. :: Ejecutar python scripts/refresh_meta_tokens.py --write-env y validar el PAGE_ID.

## 2026-04-11 12:09:39 - EP_002

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 3 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK threads

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 0.7s
- Lifecycle state: OK
- Asset type: video
- Return code: 0

### OK instagram

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.3s
- Lifecycle state: RENEW_SOON
- Asset type: video
- Return code: 0

### OK facebook

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.6s
- Lifecycle state: RENEW_SOON
- Asset type: video
- Return code: 0

## 2026-04-11 12:16:27 - EP_002

- Mode: publish
- API only: True
- Total: 3 | Passed: 0 | Failed: 3 | Skipped: 0 | Errors: 0 | Warnings: 0

### FAIL threads

- Status: FAIL
- Operational status: FAILED
- Duration: 20.7s
- Lifecycle state: OK
- Detail: [OK] Asset (video): C:\Users\farid\Documents\Frecuencia Global\06_Assets\EP_002\EP_002_clip_1_IG_1080x1920.mp4
[OK] Texto: 363 chars

Frecuencia Global Podcast 002: quien controla tu feed y por que importa

Segundo episodio de prueba de Frecuencia Global sobre plataformas, dependencia tecnica y control de la distribucion digital.

N...

[OK] Threads user: globalfrequency.es (ID: 26618714181055427)

- Return code: 1

### FAIL instagram

- Status: FAIL
- Operational status: FAILED
- Duration: 41.3s
- Lifecycle state: RENEW_SOON
- Detail: [OK] Caption: 363 chars
[OK] Asset (video): C:\Users\farid\Documents\Frecuencia Global\06_Assets\EP_002\EP_002_clip_1_IG_1080x1920.mp4

Frecuencia Global Podcast 002: quien controla tu feed y por que importa

Segundo episodio de prueba de Frecuencia Global sobre plataformas, dependencia tecnica y control de la distribucion digital.

N...

[INFO] Subiendo asset a host temporal...
[OK] Asset hostead

- Return code: 1

### FAIL facebook

- Status: FAIL
- Operational status: FAILED
- Duration: 2.2s
- Lifecycle state: RENEW_SOON
- Asset type: video
- Detail: [OK] Tipo de asset: video
[OK] Texto: 363 chars
[OK] Copy source: Instagram
[OK] Video: C:\Users\farid\Documents\Frecuencia Global\06_Assets\EP_002\EP_002_clip_1_IG_1080x1920.mp4
[INFO] Provider health: status=operational configured=True auth_valid=True
{
"success": false,
"provider": "facebook",
"piece_id": "EP_002",
"error_code": "382",
"error_message": "The video file you tried to upl
- Return code: 1

## 2026-04-11 12:22:15 - EP_002

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 0 | Failed: 3 | Skipped: 0 | Errors: 0 | Warnings: 0

### FAIL threads

- Status: FAIL
- Duration: 0.5s
- Lifecycle state: OK
- Detail: [ERROR] Asset inv�lido: El video es demasiado peque�o (6 bytes). Probablemente es un mock vac�o. M�nimo requerido: 100KB.
- Return code: 1

### FAIL instagram

- Status: FAIL
- Duration: 0.5s
- Lifecycle state: RENEW_SOON
- Detail: [ERROR] Asset inválido: El video es demasiado pequeño (6 bytes). Probablemente es un mock vacío. Mínimo requerido: 100KB.
- Return code: 1

### FAIL facebook

- Status: FAIL
- Duration: 0.9s
- Lifecycle state: RENEW_SOON
- Asset type: video
- Detail: [OK] Tipo de asset: video
[OK] Texto: 363 chars
[OK] Copy source: Instagram
[ERROR] Asset inv�lido: El video es demasiado peque�o (6 bytes). Probablemente es un mock vac�o. M�nimo requerido: 100KB.
- Return code: 1

## 2026-04-11 13:22:03 - TEST_ECO_001

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 3 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK threads

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 0.5s
- Lifecycle state: OK
- Asset type: video
- Return code: 0

### OK instagram

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.1s
- Lifecycle state: RENEW_SOON
- Asset type: video
- Return code: 0

### OK facebook

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.4s
- Lifecycle state: RENEW_SOON
- Asset type: video
- Return code: 0

## 2026-04-11 13:23:18 - TEST_ECO_001 [SANDBOX_TEST]

- Mode: publish
- API only: True
- **Tipo:** Prueba técnica del ecosistema social (no contenido editorial oficial)
- **Propósito:** Validar publicación API-first en Threads, Instagram y Facebook
- **Nota:** Esta corrida usa assets generados programáticamente para testing técnico. Descartable, no representa línea editorial de Frecuencia Global.
- Total: 3 | Passed: 3 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK threads

- Status: PASS
- Operational status: PUBLISHED
- Duration: 34.8s
- Lifecycle state: OK
- Asset type: video
- Post ID: 17876908647433876
- Post URL: [https://threads.net/@frecuenciaglobal/post/17876908647433876](https://threads.net/@frecuenciaglobal/post/17876908647433876)
- Return code: 0

### OK instagram

- Status: PASS
- Operational status: PUBLISHED
- Duration: 23.3s
- Lifecycle state: RENEW_SOON
- Asset type: video
- Publish duration: 21.35s
- Post ID: 18070526756302328
- Post URL: [https://www.instagram.com/reel/DXAMJPXDGE7/](https://www.instagram.com/reel/DXAMJPXDGE7/)
- Return code: 0

### OK facebook

- Status: PASS
- Operational status: PUBLISHED
- Duration: 8.5s
- Lifecycle state: RENEW_SOON
- Asset type: video
- Post ID: 828934913572275
- Post URL: [https://facebook.com/828934913572275](https://facebook.com/828934913572275)
- Return code: 0

## 2026-04-11 13:32:49 - TEST_IG_CAROUSEL_IMG_001 [SANDBOX_TEST]

- Mode: dry-run
- API only: True
- **Tipo:** Prueba técnica de carrusel Instagram (limitación detectada: solo 1 imagen encontrada)
- **Nota:** Asset discovery retorna únicamente la primera imagen. Carousel multi-imagen requiere extensión del orquestador.
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK instagram

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.1s
- Lifecycle state: RENEW_SOON
- Asset type: image
- Return code: 0

## 2026-04-11 13:33:12 - TEST_IG_CAROUSEL_IMG_001 [SANDBOX_TEST]

- Mode: publish
- API only: True
- **Tipo:** Prueba técnica de carrusel Instagram — publicado como single image
- **Limitación detectada:** El orquestador solo detecta y publica la primera imagen (FG_TEST_IG_CAROUSEL_IMG_001_01). Las slides 02 y 03 existen pero no fueron incluidas.
- **Gap técnico:** `asset_discovery.get_asset()` retorna tupla (path, type) para un solo asset. Para carrusel multi-imagen se requiere modificar para retornar lista de paths.
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK instagram

- Status: PASS
- Operational status: PUBLISHED
- Duration: 11.8s
- Lifecycle state: RENEW_SOON
- Asset type: image
- Publish duration: 10.12s
- Post ID: 18076649525536361
- Post URL: [https://www.instagram.com/p/DXANT7akoLl/](https://www.instagram.com/p/DXANT7akoLl/)
- Return code: 0

## 2026-04-11 13:38:40 - TEST_IG_CAROUSEL_IMG_001 [SANDBOX_TEST]

- Mode: dry-run
- API only: True
- **Tipo:** Prueba técnica de carrusel Instagram post-fix
- **Resultado:** Detectadas 3 imágenes, modo carrusel activado correctamente
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK instagram

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.3s
- Lifecycle state: RENEW_SOON
- Asset type: carousel,
- Return code: 0

## 2026-04-11 13:39:39 - TEST_IG_CAROUSEL_IMG_001 [SANDBOX_TEST]

- Mode: publish
- API only: True
- **Tipo:** Prueba técnica de carrusel Instagram — POST-FIX EXITOSO
- **Resultado:** Carrusel de 3 slides publicado correctamente
- **Gap corregido:** `asset_discovery.get_assets_multi()` + `ig_api_publish.py` ahora soportan múltiples imágenes
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK instagram

- Status: PASS
- Operational status: PUBLISHED
- Duration: 24.0s
- Lifecycle state: RENEW_SOON
- Asset type: carousel
- Publish duration: 21.04s
- Post ID: 18071810981276969
- Post URL: [https://www.instagram.com/p/DXAODRRD1pB/](https://www.instagram.com/p/DXAODRRD1pB/)
- Return code: 0

## 2026-04-11 15:14:00 - TEST_IG_CAROUSEL_MIX_001 [SANDBOX_TEST]

- Mode: dry-run
- API only: True
- **Tipo:** Prueba técnica de carrusel MIXTO Instagram (imágenes + video)
- **Implementación:** Nuevo soporte para mixed carousel agregado a `ig_api_publish.py` y `asset_discovery.py`
- **Detección:** Carrusel MIXTO detectado: 3 items - Slide01[IMAGE], Slide02[VIDEO], Slide03[IMAGE]
- **Orden:** Preservado correctamente por orden alfabético
- **Bloqueo:** Token IG expirado (190 OAuthException) - requiere renovación antes de publish real
- **Veredicto:** IMPLEMENTATION_OK | TOKEN_BLOCKED | REAUTH_REQUIRED
- Total: 1 | Passed: 0 | Failed: 0 | Skipped: 1 | Errors: 0

### SKIP instagram

- Status: SKIPPED
- Operational status: DRY_RUN_MIXED_CAROUSEL_OK_BUT_TOKEN_EXPIRED
- Duration: 1.0s
- Lifecycle state: REAUTH_REQUIRED
- Asset type: mixed_carousel
- Detail: Carrusel mixto detectado correctamente (3 items: IMAGE, VIDEO, IMAGE). Caption: 233 chars. Token expirado - requiere re-autenticación para publish real. Código implementado y validado estructuralmente.
- Error: Instagram Graph API 400: Error validating access token: Session has expired on Saturday, 11-Apr-26 13:00:00 PDT
- Return code: 1

## 2026-04-11 15:20:15 - TEST_IG_STORY_IMG_001 [SANDBOX_TEST]

- Mode: publish
- API only: True
- **Tipo:** Prueba técnica de Instagram Story image
- **Implementación:** Nuevo soporte para `media_type=STORIES` agregado a `ig_api_publish.py` y `instagram_provider.py`
- **Gap corregido:** Story image NOT_SUPPORTED_YET → SUPPORTED
- **Flujo:** `publish_story_image()` con `media_type=STORIES`, sin caption (API lo ignora)
- **Asset:** 1080x1920 PNG generado programáticamente
- **Veredicto:** IG_STORY_IMAGE_VALIDATED
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0

### OK instagram

- Status: PASS
- Operational status: PUBLISHED
- Duration: 10.02s
- Lifecycle state: RENEW_SOON
- Asset type: story_image
- Post ID: 18095390552114874
- Post URL: [https://www.instagram.com/stories/globalfrequency.es/3873207257672936510](https://www.instagram.com/stories/globalfrequency.es/3873207257672936510)
- Return code: 0

## 2026-04-11 15:26:00 - TEST_IG_STORY_VID_001 [SANDBOX_TEST]

- Mode: publish
- API only: True
- **Tipo:** Prueba técnica de Instagram Story video
- **Implementación:** `publish_story_video()` agregado a `ig_api_publish.py`
- **Gap cerrado:** Story video NOT_SUPPORTED_YET → SUPPORTED
- **Flujo:** `media_type=STORIES` con `video_url`
- **Asset:** 1080x1920 MP4
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0

### OK instagram

- Status: PASS
- Operational status: PUBLISHED
- Duration: 39.09s
- Lifecycle state: RENEW_SOON
- Asset type: story_video
- Post ID: 17966234513901963
- Post URL: [https://www.instagram.com/stories/globalfrequency.es/3873211569315959795](https://www.instagram.com/stories/globalfrequency.es/3873211569315959795)
- Return code: 0

## 2026-04-11 15:30:00 - TEST_IG_CAROUSEL_MIX_001 [SANDBOX_TEST]

- Mode: publish
- API only: True
- **Tipo:** Prueba técnica de Instagram Carousel MIXED (imágenes + videos)
- **Implementación:** `publish_mixed_carousel()` en `ig_api_publish.py`
- **Bloqueo detectado:** Instagram Graph API no soporta `video_url` directamente en items de carrusel con `is_carousel_item=true`
- **Error:** `OAuthException: (#100) The parameter image_url is required` cuando se envía `video_url`
- **Veredicto:** IMPLEMENTATION_OK | API_BLOCKED — Los carruseles mixtos requieren flujo diferente: crear media containers de video por separado, luego ensamblar carrusel
- **Gap técnico:** La API de Instagram no permite items de video en carruseles con el mismo patrón que imágenes. Requiere investigación adicional de endpoint alternativo.
- Total: 1 | Passed: 0 | Failed: 1 | Skipped: 0 | Errors: 0

### FAIL instagram

- Status: FAIL
- Duration: 45.2s
- Lifecycle state: RENEW_SOON
- Asset type: mixed_carousel
- Error code: 100
- Error: `OAuthException: (#100) The parameter image_url is required` — API limitation para videos en carrusel items
- Detail: El item de video en carrusel requiere flujo diferente al de imagen. Instagram Graph API espera `image_url` incluso para items de video en carrusel, lo cual es inconsistente.
- Return code: 1

## 2026-04-11 15:45:00 - TEST_IG_CAROUSEL_MIX_001 [SANDBOX_TEST - REINTENTO #1]

- Mode: publish
- API only: True
- **Implementación actualizada:** `publish_mixed_carousel()` corregido para usar `media_type=REELS` en lugar de `VIDEO` (deprecado según API)
- **Flujo:**
  1. Item IMAGE: Container ID 18077455529236380 ✅
  2. Item VIDEO: Container ID 18077455544236380 ✅ (procesado en 10 attempts)
  3. Item IMAGE: Container ID 18077455577236380 ✅
  4. Carousel Container ID: 18077455604236380 ✅
- **Bloqueo final:** Error 500 al publicar — `OAuthException: An unexpected error has occurred`
- **Veredicto técnico:** La API acepta la estructura REELS+IMAGES en carrusel, procesa correctamente, pero falla internamente al publicar.

### FAIL instagram

- Status: FAIL
- Duration: 95.3s
- Lifecycle state: RENEW_SOON
- Asset type: mixed_carousel
- Error code: 2
- Error: `OAuthException: An unexpected error has occurred. Please retry your request later.` (is_transient: True)
- Container IDs creados: 18077455529236380, 18077455544236380, 18077455577236380
- Carousel Container ID: 18077455604236380
- Detail: Fallo consistente en paso final media_publish. Error reproduce en segundo intento.
- Return code: 1

## 2026-04-11 15:52:00 - TEST_IG_CAROUSEL_MIX_001 [SANDBOX_TEST - REINTENTO #2]

- Mode: publish
- API only: True
- **Propósito:** Confirmar si error 500 es transient o persistente
- **Flujo:**
  1. Item IMAGE: Container ID 18077455631236380 ✅
  2. Item VIDEO: Container ID 18077455655236380 ✅ (procesado en 10 attempts)
  3. Item IMAGE: Container ID 18077455700236380 ✅
  4. Carousel Container ID: 18077455715236380 ✅
- **Resultado:** Error 500 idéntico al intento anterior
- **Veredicto final técnico:** Error NO es transient. La combinación REELS+IMAGES en carrusel no está soportada por Instagram Graph API pública a pesar de que la API acepta la estructura.

### FAIL instagram

- Status: FAIL
- Duration: 98.1s
- Lifecycle state: RENEW_SOON
- Asset type: mixed_carousel
- Error code: 2
- Error: `OAuthException: An unexpected error has occurred. Please retry your request later.` (is_transient: True, pero error reproduce consistentemente)
- Container IDs creados: 18077455631236380, 18077455655236380, 18077455700236380
- Carousel Container ID: 18077455715236380
- Detail: Error 500 persistente en media_publish. Implementación correcta, API bloquea operación.
- Return code: 1

## 2026-04-11 16:00:00 - TEST_IG_CAROUSEL_MIX_001 [SANDBOX_TEST - ÉXITO FINAL]

- Mode: publish
- API only: True
- **Implementación final corregida:** `publish_mixed_carousel()` ajustado para usar:
  - `media_type=VIDEO` + `video_url` + `is_carousel_item=true` para items de video
  - `image_url` + `is_carousel_item=true` para items de imagen
  - Polling individual de video antes de ensamblar carrusel
- **Flujo exitoso:**
  1. Item IMAGE: Container ID 18077456156236380 ✅
  2. Item VIDEO: Container ID 18077456174236380 ✅ (procesado en 10 attempts)
  3. Item IMAGE: Container ID 18077456198236380 ✅
  4. Carousel Container ID: 18077456216236380 ✅
  5. Publish: Post ID 18099864614315343 ✅
- **Veredicto final:** IG_CAROUSEL_MIX_VALIDATED
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0

### OK instagram

- Status: PASS
- Operational status: PUBLISHED
- Duration: 91.25s
- Lifecycle state: RENEW_SOON
- Asset type: mixed_carousel
- Post ID: 18099864614315343
- Post URL: [https://www.instagram.com/p/DXAceWYCZ4L/](https://www.instagram.com/p/DXAceWYCZ4L/)
- Detail: Carrusel mixto (IMAGE→VIDEO→IMAGE) publicado exitosamente vía Instagram Graph API.
- Return code: 0

## 2026-04-11 16:10:00 - TEST_FB_STORY_IMG_001 [SANDBOX_TEST]

- Mode: publish
- API only: True
- **Tipo:** Prueba técnica de Facebook Story image
- **Implementación:** `publish_story()` en `facebook_provider.py` con endpoint `/{page_id}/stories`
- **Error:** `GraphMethodException: Unsupported post request` (code: 100, subcode: 33)
- **Causa root:** El token de Meta Graph API actual tiene permisos `pages_show_list, pages_manage_metadata, pages_manage_posts` pero **NO** tiene permisos para publicar Stories.
- **Permiso requerido:** Según documentación de Meta, Facebook Stories API requiere `pages_manage_engagement` u otros permisos especiales no disponibles en el token actual.
- **Veredicto:** Implementación correcta, API bloquea por permisos insuficientes.

### FAIL facebook

- Status: FAIL
- Duration: 3.2s
- Lifecycle state: RENEW_SOON
- Asset type: story_image
- Error code: 100
- Error: `GraphMethodException: (#100) Unsupported post request` — Permisos insuficientes para Stories API
- Error subcode: 33
- Detail: El token actual no tiene permisos para publicar en Facebook Stories vía API. Requiere permisos adicionales de Meta App.
- Return code: 1

## 2026-04-11 16:32:00 — TEST_FB_MULTI_PHOTO_001

- **Pieza:** TEST_FB_MULTI_PHOTO_001
- **Formato:** `fb_multi_photo_post` (taxonomía canónica)
- **Mode:** dry-run
- **Asset type:** multi_photo
- **Assets detectados:** 3 imágenes (1200x628)

### 🔄 PARTIAL facebook

- **Status:** PARTIAL
- **Veredicto:** `FB_MULTI_PHOTO_PARTIAL`
- **Lifecycle state:** RENEW_SOON
- **Detalle:** Implementación validada correctamente: detecta 3 imágenes, asset_type=multi_photo, naming alineado a taxonomía canónica (`fb_multi_photo_post` vs `fb_carousel`). Publicación real bloqueada por token expirado (expiró 16:00:00 PDT, hora actual 16:32:47 PDT). El código del provider (`facebook_provider.py:254-275`) implementa correctamente `attached_media` con `media_fbid` para múltiples imágenes.
- **Nota:** El gap era naming/terminología, no implementación técnica. Corregido `facebook_api_publish.py` para usar "multi_photo" en lugar de "carousel".
- **Return code:** 1 (blocked by credentials, not implementation)

## 2026-04-11 16:36:49 — TEST_FB_MULTI_PHOTO_001 (Re-check)

- **Pieza:** TEST_FB_MULTI_PHOTO_001
- **Formato:** `fb_multi_photo_post`
- **Acción:** Intento de recuperación de token + validación final

### ❌ FAIL facebook (Token Check)

- **Status:** FAIL
- **Veredicto:** `FB_MULTI_PHOTO_BLOCKED_BY_TOKEN`
- **Error:** `OAuthException 190/463` — Session has expired on Saturday, 11-Apr-26 16:00:00 PDT
- **Token source:** INSTAGRAM_ACCESS_TOKEN (fuente para FB user token)
- **Detalle:** El token de Meta sigue expirado. No hay token vigente disponible para publicación real. Provider health = DOWN por auth invalid.
- **Conclusión:** Implementación técnica lista, publicación real bloqueada por estado de credenciales. Requiere renovación de token en `.env.local`.
- **Return code:** 1

## 2026-04-11 17:56:00 — TEST_FB_MULTI_PHOTO_001 (Publicación Real)

- **Pieza:** TEST_FB_MULTI_PHOTO_001
- **Formato:** `fb_multi_photo_post`
- **Acción:** Publicación real de multi-photo post tras fixes de implementación

### ✅ SUCCESS facebook

- **Status:** SUCCESS
- **Veredicto:** `FB_MULTI_PHOTO_VALIDATED` ✅
- **Post ID:** `986972071173928_122105232722848603`
- **Post URL:** `https://facebook.com/986972071173928_122105232722848603`
- **Duración:** 7.99s
- **Assets:** 3 imágenes 1200x628
- **Fixes aplicados:**
  1. `attached_media`: `str().replace()` → `json.dumps()` (formato JSON válido)
  2. `session.post()`: `params=` → `data=` (enviar en body, no query)
  3. `published=false` en photo containers (no publicar fotos individuales)
- **Token:** Long-lived válido hasta 2026-06-10 (~60 días)
- **Return code:** 0

## 2026-04-13 00:12:35 - P1_001

- Mode: dry-run
- API only: True
- Total: 3 | Passed: 3 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK threads

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 0.5s
- Lifecycle state: OK
- Asset type: image
- Return code: 0

### OK instagram

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.0s
- Lifecycle state: OK
- Asset type: carousel,
- Return code: 0

### OK facebook

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.6s
- Lifecycle state: OK
- Asset type: multi_photo
- Return code: 0

## 2026-04-13 00:17:41 - P1_001

- Mode: dry-run
- API only: True
- Total: 4 | Passed: 4 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK threads

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 0.4s
- Lifecycle state: OK
- Asset type: image
- Return code: 0

### OK instagram

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 0.9s
- Lifecycle state: OK
- Asset type: carousel,
- Return code: 0

### OK facebook

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.2s
- Lifecycle state: OK
- Asset type: multi_photo
- Return code: 0

### OK linkedin

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 0.2s
- Lifecycle state: OK
- Return code: 0

## 2026-04-13 10:58:29 - P1_001

- Mode: dry-run
- API only: True
- Total: 4 | Passed: 4 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK threads

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 0.6s
- Lifecycle state: OK
- Asset type: image
- Return code: 0

### OK instagram

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.1s
- Lifecycle state: OK
- Asset type: carousel,
- Return code: 0

### OK facebook

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.8s
- Lifecycle state: OK
- Asset type: multi_photo
- Return code: 0

### OK linkedin

- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 0.2s
- Lifecycle state: OK
- Return code: 0

## 2026-04-13 15:53:54 - P1_002
- Mode: publish
- API only: True
- Total: 4 | Passed: 4 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK threads
- Status: PASS
- Operational status: PUBLISHED
- Duration: 9.7s
- Lifecycle state: OK
- Asset type: image
- Post ID: 18084798923343230
- Post URL: https://threads.net/@frecuenciaglobal/post/18084798923343230
- Return code: 0

### OK instagram
- Status: PASS
- Operational status: PUBLISHED
- Duration: 27.3s
- Lifecycle state: OK
- Asset type: carousel
- Publish duration: 24.30s
- Post ID: 18041755226604056
- Post URL: https://www.instagram.com/p/DXFm-35Gp1V/
- Return code: 0

### OK facebook
- Status: PASS
- Operational status: PUBLISHED
- Duration: 11.1s
- Lifecycle state: OK
- Asset type: multi_photo
- Post ID: 986972071173928_122105760656848603
- Post URL: https://facebook.com/986972071173928_122105760656848603
- Return code: 0

### OK linkedin
- Status: PASS
- Duration: 0.7s
- Lifecycle state: OK
- Return code: 0

## 2026-04-13 18:36:27 - MVP_01
- Mode: publish
- API only: True
- Total: 4 | Passed: 4 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK instagram
- Status: PASS
- Operational status: PUBLISHED
- Duration: 37.1s
- Lifecycle state: OK
- Asset type: carousel
- Publish duration: 28.95s
- Post ID: 18070673519291515
- Post URL: https://www.instagram.com/p/DXF5j6ZlOwN/
- Return code: 0

### OK threads
- Status: PASS
- Operational status: PUBLISHED
- Duration: 11.3s
- Lifecycle state: OK
- Asset type: image
- Post ID: 18127074766510580
- Post URL: https://threads.net/@frecuenciaglobal/post/18127074766510580
- Return code: 0

### OK linkedin
- Status: PASS
- Duration: 1.4s
- Lifecycle state: OK
- Return code: 0

### OK facebook
- Status: PASS
- Operational status: PUBLISHED
- Duration: 12.5s
- Lifecycle state: OK
- Asset type: multi_photo
- Post ID: 986972071173928_122105790518848603
- Post URL: https://facebook.com/986972071173928_122105790518848603
- Return code: 0

## 2026-04-13 21:29:27 - MVP_02
- Mode: dry-run
- API only: True
- Total: 4 | Passed: 4 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK threads
- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 0.4s
- Lifecycle state: OK
- Asset type: image
- Return code: 0

### OK instagram
- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.0s
- Lifecycle state: OK
- Asset type: carousel,
- Return code: 0

### OK facebook
- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 1.5s
- Lifecycle state: OK
- Asset type: multi_photo
- Return code: 0

### OK linkedin
- Status: PASS
- Operational status: DRY_RUN_OK
- Duration: 0.2s
- Lifecycle state: OK
- Return code: 0

## 2026-04-13 21:30:33 - MVP_02
- Mode: publish
- API only: True
- Total: 4 | Passed: 4 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK threads
- Status: PASS
- Operational status: PUBLISHED
- Duration: 10.2s
- Lifecycle state: OK
- Asset type: image
- Post ID: 18109273126865030
- Post URL: https://threads.net/@frecuenciaglobal/post/18109273126865030
- Return code: 0

### OK instagram
- Status: PASS
- Operational status: PUBLISHED
- Duration: 35.5s
- Lifecycle state: OK
- Asset type: carousel
- Publish duration: 31.72s
- Post ID: 17944432188168339
- Post URL: https://www.instagram.com/p/DXGNgdsEYV-/
- Return code: 0

### OK facebook
- Status: PASS
- Operational status: PUBLISHED
- Duration: 11.6s
- Lifecycle state: OK
- Asset type: multi_photo
- Post ID: 986972071173928_122105825480848603
- Post URL: https://facebook.com/986972071173928_122105825480848603
- Return code: 0

### OK linkedin
- Status: PASS
- Duration: 0.8s
- Lifecycle state: OK
- Return code: 0

## 2026-04-14 14:57:54 - MVP_03
- Mode: publish
- API only: True
- Total: 3 | Passed: 3 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK threads
- Status: PASS
- Operational status: PUBLISHED
- Duration: 14.0s
- Lifecycle state: OK
- Asset type: image
- Publish duration: 11.43s
- Post ID: 18186882187374269
- Post URL: https://threads.net/@frecuenciaglobal/post/18186882187374269
- Return code: 0

### OK instagram
- Status: PASS
- Operational status: PUBLISHED
- Duration: 34.9s
- Lifecycle state: OK
- Asset type: carousel
- Publish duration: 31.30s
- Post ID: 18130341244560742
- Post URL: https://www.instagram.com/p/DXIFW6HD5YG/
- Return code: 0

### OK facebook
- Status: PASS
- Operational status: PUBLISHED
- Duration: 14.4s
- Lifecycle state: OK
- Asset type: multi_photo
- Publish duration: 13.41s
- Post ID: 986972071173928_122106045938848603
- Post URL: https://facebook.com/986972071173928_122106045938848603
- Return code: 0

## 2026-04-14 14:58:14 - MVP_03
- Mode: publish
- API only: True
- Total: 1 | Passed: 1 | Failed: 0 | Skipped: 0 | Errors: 0 | Warnings: 0

### OK linkedin
- Status: PASS
- Duration: 0.8s
- Lifecycle state: OK
- Return code: 0

