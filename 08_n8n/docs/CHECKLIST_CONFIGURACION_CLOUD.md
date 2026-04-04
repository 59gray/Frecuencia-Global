# Checklist de Configuración — n8n Cloud

**Instancia:** `https://frecuenciaglobal.app.n8n.cloud`  
**Estado actual:** 14/14 workflows publicados  
**Fecha:** 2026-04-03

---

## ✅ Workflows publicados

Ver `07_Operaciones/FG_n8n_Deployment_Summary.md` para IDs y estado detallado.

| Tipo | Cantidad | Estado |
|------|----------|--------|
| Sub-workflows | 4 | ✅ Published |
| Workflows principales | 10 | ✅ Published |

---

## 🔴 Pendientes de configuración (bloqueantes para publicación en redes)

### 1. Variables de entorno (Settings → Variables)

| Variable | Workflow | Estado | Valor requerido |
|----------|----------|--------|-----------------|
| `GITHUB_OWNER` | Todos | ✅ Configurada | Tu usuario de GitHub |
| `GITHUB_REPO` | Todos | ✅ Configurada | Nombre del repo |
| `GITHUB_BRANCH` | Todos | ✅ Configurada | `main` |
| `TELEGRAM_BOT_TOKEN` | SUB-002 | ⚠️ Pendiente | Token de @BotFather |
| `TELEGRAM_CHAT_ID` | SUB-002 | ⚠️ Pendiente | ID del chat destino |
| `IG_PUBLISH_WEBHOOK_URL` | WF-008 | 🔴 Vacío | URL del bridge de Instagram |
| `TIKTOK_PUBLISH_WEBHOOK_URL` | WF-010 | 🔴 Vacío | URL del bridge de TikTok |
| `LINKEDIN_AUTHOR_URN` | WF-009 | 🔴 Vacío | URN de la company page |

### 2. Credenciales por plataforma

| Workflow | Nodo | Tipo de credencial | Estado |
|----------|------|-------------------|--------|
| Todos (GitHub) | `GitHub: Leer/Escribir *` | Header Auth | ✅ Configurada (`V0SuupEfkzLlD5iJ`) |
| WF-007 | `Publicar en X` | X OAuth2 API | 🔴 Pendiente |
| WF-008 | `Publicar en Instagram` | Bridge API / Header Auth | 🔴 Pendiente |
| WF-009 | `Publicar en LinkedIn` | LinkedIn Community Management OAuth2 | 🔴 Pendiente |
| WF-010 | `Publicar en TikTok` | Bridge API / Header Auth | 🔴 Pendiente |

---

## ⚠️ Verificaciones pendientes

### Credencial GitHub
- [ ] Verificar que el PAT tenga permisos `repo` (read/write)
- [ ] Confirmar que el token no ha expirado
- [ ] Probar escritura en el repo con un commit de prueba

### Telegram (opcional pero recomendado)
- [ ] Crear bot con @BotFather si no existe
- [ ] Obtener `chat_id` enviando mensaje al bot y visitando:
  ```
  https://api.telegram.org/bot<TOKEN>/getUpdates
  ```
- [ ] Configurar variables `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`

---

## 🟡 Bridges de publicación (Instagram/TikTok)

Estas plataformas no tienen nodos nativos en n8n Cloud. Se requieren bridges externos:

### Instagram
- [ ] Definir servicio bridge (Buffer, Maya, o custom)
- [ ] Obtener URL del webhook de publicación
- [ ] Configurar `IG_PUBLISH_WEBHOOK_URL`
- [ ] Crear credencial de autenticación del bridge

### TikTok
- [ ] Definir servicio bridge
- [ ] Obtener URL del webhook de publicación
- [ ] Configurar `TIKTOK_PUBLISH_WEBHOOK_URL`
- [ ] Crear credencial de autenticación del bridge

---

## ✅ Core operativo (sin redes sociales)

Los siguientes workflows pueden funcionar **sin** las configuraciones de publicación:

| Workflow | Funcionalidad | Estado |
|----------|---------------|--------|
| WF-001 | Intake de ideas → Brief | ✅ Operativo |
| WF-002 | Registro de brief → Tracker | ✅ Operativo |
| WF-003 | Generación de QA checklist | ✅ Operativo |
| WF-004 | Notificación y log | ✅ Operativo (sin Telegram) |
| WF-005 | Pre-producción visual | ✅ Operativo |
| WF-006 | Preparar publicación | ✅ Operativo |

**Sub-workflows requeridos por el core:**
- SUB-001 (Escribir MD a GitHub) ✅
- SUB-002 (Leer MD desde GitHub) ✅
- SUB-003 (Template Filler) ✅
- SUB-004 (QA Validator) ✅

---

## 🧪 Smoke test recomendado

Después de configurar GitHub y Telegram:

```powershell
# Test WF-001 (Intake)
curl -X POST https://frecuenciaglobal.app.n8n.cloud/webhook/intake `
  -H "Content-Type: application/json" `
  -d '{"titulo":"Test Smoke","pilar":"GD","angulo":"Verificacion","formato":"carousel"}'

# Test WF-006 (Preparar publicación)
curl -X POST https://frecuenciaglobal.app.n8n.cloud/webhook/prepare-publish `
  -H "Content-Type: application/json" `
  -d '{"pieza":"P1_001"}'
```

Verificar en GitHub:
- [ ] Brief creado en `03_Editorial/`
- [ ] Tracker actualizado en `04_Produccion/pipeline_tracker.json`
- [ ] Evento registrado en `07_Operaciones/FG_Operations_Log.md`

---

## 📋 Pasos para completar configuración

1. **Configurar Telegram** (opcional, 15 min)
   - Crear bot, obtener token y chat_id
   - Agregar variables en n8n

2. **Configurar X/Twitter** (30 min)
   - Crear app en Twitter Developer Portal
   - Configurar OAuth2 en n8n
   - Asignar credencial a WF-007

3. **Configurar bridges Instagram/TikTok** (varía)
   - Definir servicio bridge
   - Crear webhooks y credenciales

4. **Configurar LinkedIn** (30 min)
   - Obtener URN de la company page
   - Configurar OAuth2 en n8n
   - Agregar `LINKEDIN_AUTHOR_URN`

---

*Actualizar este checklist conforme se completen las configuraciones.*
