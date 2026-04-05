# Credenciales para n8n Cloud — Frecuencia Global
# Fecha: 2026-04-04
# Estado: Integrando avances del dia

## Credenciales Ya Configuradas (n8n Cloud)
✅ GitHub API — Header Auth (ID: V0SuupEfkzLlD5iJ)
   - Permite leer/escribir archivos en el repo via REST API
   - Nodo: "GitHub: Leer/Escribir"

## Credenciales PENDIENTES (Bloquean publicación en redes)

### 1. X/Twitter (WF-007)
**Tipo:** X OAuth2 API
**Pasos para obtener:**
1. Ir a https://developer.twitter.com/en/portal/dashboard
2. Crear proyecto + app
3. Generar API Key, API Secret, Access Token, Access Secret
4. En n8n Cloud: Settings → Credentials → X OAuth2 API

**Scopes necesarios:** tweet.read, tweet.write, users.read

---

### 2. LinkedIn (WF-009)
**Tipo:** LinkedIn Community Management OAuth2
**Pasos para obtener:**
1. Ir a https://www.linkedin.com/developers/apps
2. Crear app "Frecuencia Global Publisher"
3. Solicitar accesso a Community Management API (tarda dias)
4. En n8n Cloud: Settings → Credentials → LinkedIn OAuth2

**Variable adicional:** LINKEDIN_AUTHOR_URN
- Ir a tu LinkedIn Company Page
- URL: https://www.linkedin.com/company/XXXXX/
- El URN es: urn:li:company:XXXXX

---

### 3. Instagram (WF-008)
**Tipo:** Bridge API / Header Auth (webhook bridge)
**Opciones:**

**Opción A: Bridge personalizado**
- Crear endpoint en Vercel/Netlify que reciba POST de n8n
- Bridge ejecuta script local: `scripts/ig_publish_post.py`
- Webhook URL: `https://tu-bridge.vercel.app/api/publish/ig`

**Opción B: Browser automation directo (no cloud)**
- Mantener `scripts/ig_publish_post.py` en local
- Ejecutar manualmente o con task scheduler

**Variable:** IG_PUBLISH_WEBHOOK_URL

---

### 4. TikTok (WF-010)
**Tipo:** Bridge API / Header Auth
**Mismo esquema que Instagram:**
- Webhook bridge o browser automation local
- Script: `scripts/tk_publish_post.py`

**Variable:** TIKTOK_PUBLISH_WEBHOOK_URL

---

## Variables de Entorno (n8n Cloud → Settings → Variables)

| Variable | Estado | Valor |
|----------|--------|-------|
| GITHUB_OWNER | ✅ | Tu usuario GitHub |
| GITHUB_REPO | ✅ | Nombre del repo |
| GITHUB_BRANCH | ✅ | main |
| IG_PUBLISH_WEBHOOK_URL | 🔴 Vacío | URL del bridge IG |
| TIKTOK_PUBLISH_WEBHOOK_URL | 🔴 Vacío | URL del bridge TikTok |
| LINKEDIN_AUTHOR_URN | 🔴 Vacío | URN de company page |
| TELEGRAM_BOT_TOKEN | ⚠️ Opcional | Token de @BotFather |
| TELEGRAM_CHAT_ID | ⚠️ Opcional | ID del chat |

---

## Recomendación Estratégica (basada en avances de hoy)

Dado que hoy instalaste Docker y tenemos scripts de browser automation funcionando:

**Opción A: Híbrida (Recomendada)**
- n8n Cloud: Orquestación (intake, QA, tracking)
- Scripts locales: Publicación final (browser automation)
- Bridge: Webhook simple en Vercel que ejecute scripts locales

**Ventaja:** No necesitas APIs oficiales (que cuestan $$$ y tienen rate limits)

**Opción B: 100% Cloud**
- Configurar todas las credenciales OAuth
- Aceptar costos de APIs (X: $100/mes, LinkedIn: enterprise)

---

## Acción Inmediata Sugerida

1. Configurar X API (la más accesible y gratuita en nivel básico)
2. Dejar IG/TikTok/LinkedIn en modo "bridge" o local por ahora
3. Crear webhook bridge simple en Vercel para conectar n8n Cloud → scripts locales

---

## Nota sobre el día de hoy

Se instaló Docker Desktop y se levantó n8n local, pero el proyecto real está en:
**n8n Cloud: https://frecuenciaglobal.app.n8n.cloud**

Los 14 workflows ya están publicados allí, solo faltan las credenciales sociales.
