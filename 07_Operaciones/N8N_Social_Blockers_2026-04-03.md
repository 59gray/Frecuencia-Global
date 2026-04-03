# n8n Social Blockers - 2026-04-03

## Estado real

- `WF-007 — Publicar en X (Cloud)` ya pasa lectura de `PublishReady` y llega al nodo `Publicar en X`.
- `FG GitHub Auth` ya fue corregida con un PAT valido.
- `origin/main` ya existe y contiene `04_Produccion/P1_001_PublishReady.md`.

## Bloqueo actual de X

- La ejecucion `53` de `WF-007` falla en `Publicar en X`.
- Error exacto devuelto por la API de X:
  - `402 Payment required`
  - `CreditsDepleted`
  - `Your enrolled account [2040016112885133312] does not have any credits to fulfill this request.`

## Bloqueos por plataforma

- `X`
  - Bloqueo de dinero: la cuenta de X Developer no tiene creditos.
  - `n8n` y GitHub ya no son el problema.

- `LinkedIn`
  - `WF-009` existe y esta activo.
  - El nodo `Publicar en LinkedIn` es un `HTTP Request` a `https://api.linkedin.com/v2/ugcPosts`.
  - No tiene credencial configurada en cloud.
  - No existe credencial de LinkedIn en `n8n` cloud al 2026-04-03.

- `Instagram`
  - `WF-008` existe y esta activo.
  - Requiere `IG_PUBLISH_WEBHOOK_URL`.
  - Esa variable no esta configurada en cloud.
  - El flujo depende de un bridge externo de publicacion.

- `TikTok`
  - El archivo local `WF-010_publicar_tiktok.json` existe.
  - La instancia cloud actual no tiene `WF-010` importado.
  - El flujo requiere `TIKTOK_PUBLISH_WEBHOOK_URL` y una credencial `FG TikTok Auth`.
  - Tambien requiere `videoUrl`, asi que no sirve para una prueba de texto puro.

## Decision operacional

- El primer limite que ya involucra gastar dinero es `X`: hay que cargar creditos en X Developer.
- Sin ese gasto, `WF-007` no puede completar una publicacion real por API.
