# Frecuencia Global — n8n Cloud Deployment Summary

**Fecha de despliegue:** 2026-04-01  
**Plataforma:** n8n Cloud (free trial)  
**Instancia:** `https://frecuenciaglobal.app.n8n.cloud`  
**Cuenta:** `j.farid.assad@gmail.com`  
**Proyecto:** `TM6uOJkzzR8U0pW1`  
**Credencial GitHub en esa instancia:** `V0SuupEfkzLlD5iJ` (Header Auth)

---

## Estado: ✅ 14/14 Workflows Publicados

### Sub-workflows (dependencias)

| ID | Cloud ID | Nombre | Estado |
|----|----------|--------|--------|
| SUB-001 | `ZicjzEXbmmmr8pFl` | Escribir Markdown a GitHub | ✅ Published |
| SUB-002 | `oeydfygD2sym5II0` | Leer Markdown desde GitHub | ✅ Published |
| SUB-003 | `KZcC0W9ncOxikW03` | Template Filler | ✅ Published |
| SUB-004 | `X9iXC0ofiW8xaGcY` | QA Validator | ✅ Published |

### Workflows principales

| ID | Cloud ID | Nombre | Estado |
|----|----------|--------|--------|
| WF-001 | `b5EHhy7aql1ByfDo` | Intake Ideas (Clockify → Brief) | ✅ Published |
| WF-002 | `P12eOp1Jyhu6YtI3` | Registro de Brief | ✅ Published |
| WF-003 | `JE2Sf65O04tYS6MB` | QA Checklist | ✅ Published |
| WF-004 | `gU1WpHnU2Jmf3Wgj` | Notificación y Log | ✅ Published |
| WF-005 | `275IwXNinMaQ0DLo` | Pre-Producción Visual | ✅ Published |
| WF-006 | `NCq8FWgMhLVt2M0Q` | Preparar Publicación | ✅ Published |
| WF-007 | `FjESME3JfSp7thzF` | Publicar en X/Twitter | ✅ Published |
| WF-008 | `Z9mpjiJ9yCxWxNDU` | Publicar en Instagram | ✅ Published |
| WF-009 | `Abf08o3Tul6Mhm9G` | Publicar en LinkedIn | ✅ Published |
| WF-010 | `VfxaVFP9cUZtQlIX` | Publicar en TikTok | ✅ Published |

---

## URLs de producción (webhooks)

Los workflows con trigger tipo Webhook quedan expuestos con estas rutas:

- `WF-001` → `https://frecuenciaglobal.app.n8n.cloud/webhook/intake`
- `WF-002` → `https://frecuenciaglobal.app.n8n.cloud/webhook/register-brief`
- `WF-003` → `https://frecuenciaglobal.app.n8n.cloud/webhook/qa`
- `WF-006` → `https://frecuenciaglobal.app.n8n.cloud/webhook/prepare-publish`
- `WF-007` → `https://frecuenciaglobal.app.n8n.cloud/webhook/publish-x`
- `WF-008` → `https://frecuenciaglobal.app.n8n.cloud/webhook/publish-instagram`
- `WF-009` → `https://frecuenciaglobal.app.n8n.cloud/webhook/publish-linkedin`
- `WF-010` → `https://frecuenciaglobal.app.n8n.cloud/webhook/publish-tiktok`

---

## Configuración pendiente por el usuario

### 1. Variables de entorno (n8n Settings → Variables)

Los workflows de publicación en redes sociales requieren estas variables:

| Variable | Usado por | Descripción |
|----------|-----------|-------------|
| `IG_PUBLISH_WEBHOOK_URL` | WF-008 | Webhook de publicación en Instagram |
| `LINKEDIN_AUTHOR_URN` | WF-009 | URN de la company page o autor usado por LinkedIn API |
| `TIKTOK_PUBLISH_WEBHOOK_URL` | WF-010 | Webhook de publicación en TikTok |

`WF-007` no usa variable de publish URL: publica con el nodo nativo de X/Twitter en n8n.

### 2. Autenticación en nodos de plataforma

El usuario debe terminar de enlazar las credenciales correctas por plataforma:

1. `WF-007` → credencial `X OAuth2 API`
2. `WF-008` → credencial del bridge/API de Instagram
3. `WF-009` → credencial `LinkedIn Community Management OAuth2 API`
4. `WF-010` → credencial del bridge/API de TikTok

### 3. Credencial GitHub

- **Tipo:** Header Auth  
- **Cloud ID de esa instancia:** `V0SuupEfkzLlD5iJ`  
- **Verificar:** que el token tenga permisos `repo` (read/write) sobre el repositorio de Frecuencia Global

Para nuevos imports conviene usar los JSON portables de `08_n8n/workflows_cloud/` y el script `08_n8n/scripts/deploy_cloud.js`, que ya reemplaza IDs fijos por placeholders/resolución dinámica.

---

## Arquitectura de dependencias

```
WF-001 (Intake)
  └── SUB-003 (Template Filler)
  └── SUB-001 (Escribir MD a GitHub)

WF-002 (Registro Brief)
  └── SUB-001 (Escribir MD)
  └── SUB-002 (Leer MD)

WF-003 (QA Checklist)
  └── SUB-004 (QA Validator)
  └── SUB-002 (Leer MD)

WF-004 (Notificación)
  └── SUB-002 (Leer MD)

WF-005 (Pre-Producción)
  └── SUB-002 (Leer MD)
  └── SUB-001 (Escribir MD)

WF-006 (Preparar Publicación)
  └── SUB-002 (Leer MD)
  └── SUB-003 (Template Filler)

WF-007/008/009/010 (Publicar en plataformas)
  └── SUB-002 (Leer MD)
```

---

## Notas técnicas

- **Método de despliegue:** Inyección vía Pinia store en browser (API bloqueada en free trial)
- **Errores de consola:** 9–13 errores internos de n8n por página son normales, no afectan funcionalidad
- **Orden de publicación:** Sub-workflows primero (requerido por n8n Cloud), luego workflows principales
- **Verificación:** Cada publicación confirmada visualmente con screenshot del diálogo "Workflow published"
