# Migración a n8n Cloud — Frecuencia Global

**URL cloud:** `https://frecuenciaglobal.app.n8n.cloud`  
**Versión local:** Docker local → descontinuada como producción  
**Razón:** n8n cloud elimina la dependencia de tener la máquina local encendida.

---

## Diferencias técnicas: Local vs Cloud

| Capacidad | Docker local | n8n Cloud |
|-----------|-------------|-----------|
| `require('fs')` en Code nodes | ✅ | ❌ (sandbox) |
| `readWriteFile` node | ✅ | ❌ |
| GitHub API via HTTP Request | ✅ | ✅ |
| Twitter/X node | ✅ | ✅ |
| Telegram via HTTP | ✅ | ✅ |
| Webhook URLs | `localhost:5678/webhook/...` | `frecuenciaglobal.app.n8n.cloud/webhook/...` |

### Solución adoptada
Todos los accesos a archivos se reemplazaron por llamadas a la **GitHub REST API**.  
El repo de GitHub actúa como filesystem persistente del sistema.

---

## Paso 1: Preparar el repositorio GitHub

### 1.1 Crear repositorio (si no existe)
Necesitas un repo GitHub con la estructura del workspace `Frecuencia Global/`.

**Estructura mínima requerida en el repo:**
```
03_Editorial/           → briefs de cada pieza
04_Produccion/
  pipeline_tracker.json → tracker del pipeline (crear vacío: {})
07_Operaciones/
  FG_Operations_Log.md  → log de eventos
08_n8n/templates/
  brief_template.md
  qa_template.md
```

### 1.2 Inicializar el workspace como repo
Desde la terminal, en `C:\Users\farid\Documents\Frecuencia Global`:
```powershell
git init
git remote add origin https://github.com/[TU_USUARIO]/[TU_REPO].git
git add .
git commit -m "feat: init frecuencia global workspace"
git push -u origin main
```

### 1.3 Crear archivo tracker inicial
Si `04_Produccion/pipeline_tracker.json` no existe en el repo:
```json
{}
```
Commitear al repo antes de importar los workflows.

### 1.4 Generar Personal Access Token (PAT)
1. GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Permisos requeridos: `repo` (full control of private repositories)
3. Copiar el token: `ghp_xxxxxxxxxxxxx`

---

## Paso 2: Configurar n8n Cloud

### 2.1 Variables (Settings → Variables)

Ir a `https://frecuenciaglobal.app.n8n.cloud/settings/variables` y crear:

| Nombre | Valor | Sensible |
|--------|-------|---------|
| `GITHUB_OWNER` | tu username de GitHub | No |
| `GITHUB_REPO` | nombre del repo (sin /) | No |
| `GITHUB_BRANCH` | `main` | No |
| `TELEGRAM_BOT_TOKEN` | token del bot | ✅ Sí |
| `TELEGRAM_CHAT_ID` | chat ID | No |
| `IG_PUBLISH_WEBHOOK_URL` | endpoint puente para publicar en Instagram | No |
| `TIKTOK_PUBLISH_WEBHOOK_URL` | endpoint puente para publicar en TikTok | No |
| `LINKEDIN_AUTHOR_URN` | URN del autor/company page para LinkedIn | No |

### 2.2 Credencial GitHub (Credentials → New Credential)

1. Crear: **"Header Auth"** credential  
2. Nombre: `FG GitHub Auth`  
3. Parámetros:
   - Name: `Authorization`
   - Value: `token ghp_xxxxxxxxxxxxx` _(tu PAT de GitHub)_

### 2.3 Credenciales sociales

Crear estas credenciales solo cuando vayas a activar los workflows de publicación:

| Workflow | Tipo | Nombre sugerido |
|---------|------|-----------------|
| WF-007 | `X OAuth2 API` | `FG X (Twitter)` |
| WF-008 | `Header Auth` o credencial del bridge usado | `FG Instagram Auth` |
| WF-009 | `LinkedIn Community Management OAuth2 API` | `FG LinkedIn Auth` |
| WF-010 | `Header Auth` o credencial del bridge usado | `FG TikTok Auth` |

---

## Paso 3: Importar workflows (en orden)

Importar los JSONs desde `08_n8n/workflows_cloud/`. **Orden obligatorio** — los SUBs primero:

```
1. sub/SUB-002_notificar_telegram.json
2. sub/SUB-004_registrar_evento.json
3. sub/SUB-001_escribir_markdown.json
4. sub/SUB-003_template_filler.json
5. WF-001_intake_ideas.json
6. WF-002_registro_brief.json
7. WF-003_qa_checklist.json
8. WF-004_notificacion_log.json
9. WF-005_pipeline_status.json
10. WF-006_preparar_publicacion.json
11. WF-007_publicar_x.json
12. WF-008_publicar_instagram.json
13. WF-009_publicar_linkedin.json
14. WF-010_publicar_tiktok.json
```

**Cómo importar:**  
En n8n cloud → Workflows → `+` → Import from file → seleccionar el JSON.

---

## Paso 4: Vincular referencias de sub-workflows (post-import)

Al importar, n8n Cloud asigna nuevos UUIDs a cada workflow. Los nodos `Execute Workflow` necesitan actualizarse con los IDs reales.

### 4.1 Obtener API Key de n8n Cloud
Settings → API → Generate API Key → copiar clave.

### 4.2 Ejecutar el script de linking

```powershell
# Desde el workspace:
Set-Location "C:\Users\farid\Documents\Frecuencia Global\08_n8n\scripts"
node link_cloud_workflows.js `
  --base-url https://frecuenciaglobal.app.n8n.cloud `
  --api-key "n8n_xxxxxxxxxxxxxxxx"
```

El script:
1. Obtiene todos los workflows del cloud y mapea nombre → ID
2. Actualiza los nodos `Execute Workflow` con los IDs correctos
3. Guarda los cambios vía n8n API

### 4.3 Verificar en la UI
Abrir cada workflow en n8n cloud y confirmar que los nodos "Notificar Telegram" y "Registrar Evento" apuntan a IDs válidos.
No deben quedar referencias a `__LINK_SUB_002__`, `__LINK_SUB_004__` ni a los IDs legacy `a1b2c3d4-*`.

---

## Paso 5: Configurar credenciales en los nodos

Después de importar, abrir cada workflow y asignar credenciales si hiciste import manual desde UI:

| Workflow | Nodo | Credencial |
|---------|------|-----------|
| Todos (con GitHub) | `GitHub: Leer/Escribir *` | `FG GitHub Auth` |
| WF-007 | `Publicar en X` | `FG X (Twitter)` |
| WF-008 | `Publicar en Instagram` | `FG Instagram Auth` |
| WF-009 | `Publicar en LinkedIn` | `FG LinkedIn Auth` |
| WF-010 | `Publicar en TikTok` | `FG TikTok Auth` |

**Nota:** El script `deploy_cloud.js` ya intenta inyectar la credencial GitHub automáticamente. Si importas a mano, sí debes asignarla nodo por nodo.

---

## Paso 6: Activar workflows

Perfil core recomendado:
1. `SUB-002` — Telegram activo
2. `SUB-004` — log operativo activo
3. `WF-001` — intake
4. `WF-002` — tracker
5. `WF-003` — QA
6. `WF-005` — resumen diario
7. `WF-006` — prepare publish

El resto queda inactivo hasta cerrar redes:
8. `WF-004` — opcional
9. `WF-007` — activar cuando X/Twitter ya tenga OAuth listo
10. `WF-008` — activar cuando exista `IG_PUBLISH_WEBHOOK_URL` y credencial IG
11. `WF-009` — activar cuando exista `LINKEDIN_AUTHOR_URN` y credencial LinkedIn
12. `WF-010` — activar cuando exista `TIKTOK_PUBLISH_WEBHOOK_URL` y credencial TikTok

---

## Paso 7: Smoke test en cloud

### WF-001 (Intake):
```bash
curl -X POST https://frecuenciaglobal.app.n8n.cloud/webhook/intake \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Test Cloud","pilar":"GD","angulo":"Testing","formato":"carousel"}'
# Esperado: HTTP 200, nuevo brief en GitHub repo
```

### WF-006 (Preparar publicación):
```bash
curl -X POST https://frecuenciaglobal.app.n8n.cloud/webhook/prepare-publish \
  -H "Content-Type: application/json" \
  -d '{"pieza":"P1_001"}'
# Esperado: HTTP 200, P1_001_PublishReady.md creado en GitHub
```

### Verificación completa del core

Para validar `WF-001`, `WF-002`, `WF-003` y `WF-006` de punta a punta, y revisar que `WF-005` quedó activo con su cron correcto:

```powershell
cd "C:\Users\farid\Documents\Frecuencia Global\08_n8n"
node scripts/verify_core_workflows.js
```

Ese script:
- confirma que `SUB-002`, `SUB-004`, `WF-001`, `WF-002`, `WF-003`, `WF-005` y `WF-006` están activos
- valida que ya no queden placeholders ni IDs legacy en los workflows core
- revisa salud básica de Telegram si `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` existen
- ejecuta un flujo real `WF-001 -> WF-002 -> WF-003 -> WF-006`
- comprueba en GitHub que sí se creó el `Brief`, el `QA`, el `PublishReady`, el update del tracker y el log operativo

Notas:
- Sin `--pieza`, crea una pieza real de prueba en el repo.
- Con `--pieza P1_001`, reutiliza una pieza existente y salta la creación por `WF-001`.
- `WF-005` no se fuerza a correr porque es `cron`; se valida estructuralmente.

---

## URLs de webhooks — Resumen de cambios

| Workflow | URL Local | URL Cloud |
|---------|-----------|-----------|
| WF-001 | `localhost:5678/webhook/intake` | `frecuenciaglobal.app.n8n.cloud/webhook/intake` |
| WF-002 | `localhost:5678/webhook/register-brief` | `frecuenciaglobal.app.n8n.cloud/webhook/register-brief` |
| WF-003 | `localhost:5678/webhook/qa` | `frecuenciaglobal.app.n8n.cloud/webhook/qa` |
| WF-006 | `localhost:5678/webhook/prepare-publish` | `frecuenciaglobal.app.n8n.cloud/webhook/prepare-publish` |
| WF-007 | `localhost:5678/webhook/publish-x` | `frecuenciaglobal.app.n8n.cloud/webhook/publish-x` |
| WF-008 | `localhost:5678/webhook/publish-instagram` | `frecuenciaglobal.app.n8n.cloud/webhook/publish-instagram` |
| WF-009 | `localhost:5678/webhook/publish-linkedin` | `frecuenciaglobal.app.n8n.cloud/webhook/publish-linkedin` |
| WF-010 | `localhost:5678/webhook/publish-tiktok` | `frecuenciaglobal.app.n8n.cloud/webhook/publish-tiktok` |

---

## Arquitectura final (Cloud)

```
GitHub Repo (filesystem)
        ↕ GitHub API
n8n Cloud (frecuenciaglobal.app.n8n.cloud)
        ↕ webhooks / cron
Buffer App / Maya / Producción
        ↕ API
X / Instagram / LinkedIn / TikTok / Telegram
```

El repo GitHub actúa como single source of truth para todos los archivos de contenido.
n8n cloud es el motor de automatización sin dependencia de hardware local.

---

## Step 5 — Deploy automatizado (Go-Live)

El script `deploy_cloud.js` automatiza los pasos 2–4 y deja activada la capa core (WF-001 a WF-006).

### Prerequisitos

1. Repo GitHub creado y con primer push (Step 1 de esta guía).
2. n8n Cloud instance vacía en `frecuenciaglobal.app.n8n.cloud`.
3. API Key de n8n cloud: **Settings → n8n API → Create new key**.
4. Node.js ≥ 18 disponible localmente.

### Ejecución

```powershell
cd "C:\Users\farid\Documents\Frecuencia Global\08_n8n"

# 1. Copiar y rellenar config
cp .env.cloud.example .env.cloud
notepad .env.cloud   # completar N8N_API_KEY, GITHUB_PAT, etc.

# 2. Ejecutar deploy
node scripts/deploy_cloud.js
```

### Qué hace el script

| Paso | Acción |
|------|--------|
| 1 | Crea Variables n8n (`GITHUB_*`, `TELEGRAM_*`, `IG_PUBLISH_WEBHOOK_URL`, `TIKTOK_PUBLISH_WEBHOOK_URL`, `LINKEDIN_AUTHOR_URN`) |
| 2 | Crea credencial `FG GitHub Auth` (Header Auth con PAT) |
| 3 | Importa los 14 workflows en orden correcto (SUBs → WFs) |
| 4 | Resuelve placeholders y referencias legacy de SUB-002 / SUB-004 |
| 5 | Activa el perfil core automáticamente: `SUB-002`, `SUB-004`, `WF-001`, `WF-002`, `WF-003`, `WF-005`, `WF-006` |
| 6 | Smoke test opcional si `SMOKE_TEST_PIEZA` está definido |

### Post-deploy manual

- **WF-007** requiere credencial X OAuth2 API
- **WF-008** requiere credencial del bridge de Instagram + `IG_PUBLISH_WEBHOOK_URL`
- **WF-009** requiere credencial LinkedIn Community Management OAuth2 API + `LINKEDIN_AUTHOR_URN`
- **WF-010** requiere credencial del bridge de TikTok + `TIKTOK_PUBLISH_WEBHOOK_URL`

Una vez configurados, activa esos workflows manualmente desde el canvas.

### Activación manual automatizada del core

Si ya importaste todo y solo quieres dejar operativo el núcleo, puedes correr:

```powershell
cd "C:\Users\farid\Documents\Frecuencia Global\08_n8n"
node scripts/activate_core_workflows.js
```

Ese script activa:
- `SUB-002`
- `SUB-004`
- `WF-001`
- `WF-002`
- `WF-003`
- `WF-005`
- `WF-006`

### Verificación automatizada del core

Después de activar el núcleo, corre:

```powershell
cd "C:\Users\farid\Documents\Frecuencia Global\08_n8n"
node scripts/verify_core_workflows.js
```

Es la forma recomendada de dejar estable `WF-001` a `WF-006` antes de pasar a pruebas de publicación en redes.

### Variables de `.env.cloud`

| Variable | Descripción |
|----------|-------------|
| `N8N_BASE_URL` | `https://frecuenciaglobal.app.n8n.cloud` |
| `N8N_API_KEY` | API key de n8n cloud (Settings → n8n API) |
| `GITHUB_OWNER` | Usuario/org GitHub |
| `GITHUB_REPO` | Nombre del repo |
| `GITHUB_BRANCH` | Rama principal (generalmente `main`) |
| `GITHUB_PAT` | Personal Access Token con permisos `repo` |
| `TELEGRAM_BOT_TOKEN` | Token del bot de Telegram |
| `TELEGRAM_CHAT_ID` | ID del chat destino |
| `IG_PUBLISH_WEBHOOK_URL` | Webhook bridge para Instagram |
| `TIKTOK_PUBLISH_WEBHOOK_URL` | Webhook bridge para TikTok |
| `LINKEDIN_AUTHOR_URN` | URN de la company page o autor para LinkedIn |
| `SMOKE_TEST_PIEZA` | ID de pieza para smoke test (opcional, dejar vacío para saltar) |
