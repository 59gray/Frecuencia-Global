# N8N Credential Runbook — 2026-04-02

## Estado actual

### Listo

- `WF-001` a `WF-006` publicados en n8n Cloud
- `WF-007` a `WF-010` publicados en n8n Cloud
- `SUB-002` y `SUB-004` publicados en n8n Cloud
- Variable `LINKEDIN_AUTHOR_URN` creada en n8n Cloud:
  - `urn:li:organization:112349668`
- Redirect URL confirmado en la UI real de n8n Cloud para OAuth:
  - `https://oauth.n8n.cloud/oauth2/callback`

### Bloqueos vigentes

- `X`:
  - falta credencial `FG X (Twitter)`
  - el workflow ya quedo alineado a `twitterOAuth2Api`
- `LinkedIn`:
  - falta credencial `FG LinkedIn Auth`
- `Instagram`:
  - el workflow exige `imageUrl`, no sirve para post de solo texto
- `TikTok`:
  - el workflow exige `videoUrl`, no sirve para post de solo texto

### Hallazgos operativos

- Existe `FG GitHub Auth` en n8n Cloud
- Existen variables `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`
- Existen variables `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`, pero hoy siguen con valores placeholder
- No existen todavia credenciales de `X` ni de `LinkedIn` en la instancia cloud
- `WF-007` en cloud sigue usando `HTTP Request` hacia `X_PUBLISH_WEBHOOK_URL`
- `WF-009` en cloud sigue usando `HTTP Request` hacia LinkedIn
- Antes de migrar esos dos workflows al modelo OAuth nativo, conviene crear primero las credenciales

## Orden recomendado

1. Resolver `X`
2. Resolver `LinkedIn`
3. Dejar `Instagram` y `TikTok` para cuando exista pipeline con media real

## X — Credencial requerida

Nombre deseado en n8n:

- `FG X (Twitter)`

Datos a conseguir fuera de n8n:

- `Client ID`
- `Client Secret`
- app con permisos de escritura
- callback URL exacto:
  - `https://oauth.n8n.cloud/oauth2/callback`

Tipo de credencial a crear en n8n:

- `X OAuth2 API`

## LinkedIn — Credencial requerida

Nombre deseado en n8n:

- `FG LinkedIn Auth`

Tipo de credencial a crear en n8n:

- `LinkedIn Community Management OAuth2 API`

Datos a conseguir fuera de n8n:

- `Client ID`
- `Client Secret`
- callback URL exacto:
  - `https://oauth.n8n.cloud/oauth2/callback`

Requisitos funcionales:

- app asociada a la company page de Frecuencia Global
- productos habilitados:
  - `Share on LinkedIn`
  - `Sign In with LinkedIn using OpenID Connect`
- para publicar como organizacion:
  - `Community Management App Review`

## Siguiente paso operativo

El primer objetivo realista para post de texto es:

- `X`, cuando exista `FG X (Twitter)`
- `LinkedIn`, cuando exista `FG LinkedIn Auth`

En cuanto una de esas dos credenciales exista en n8n, volver a correr:

```powershell
node "C:\Users\farid\Documents\Frecuencia Global\scripts\n8n_social_readiness_ui.mjs"
```

Si el resultado marca `ready: true`, ya podemos preparar la publicacion de prueba de texto.
