# FG n8n Migration Specification
## Especificación ASPIRACIONAL de Migración a n8n Cloud

**Versión:** 1.0
**Fecha:** 2026-04-05
**Ámbito:** Especificación FUTURA - No activa para implementación

> **⚠️ ALERTA CRÍTICA:** Esta especificación es **ASPIRACIONAL**. No implementar.
>
> **BLOQUEADORES ACTIVOS:**
> - Bridge/Tunnel tiene URL dinámica (cambia con cada restart de cloudflared)
> - Esto hace inviable cualquier integración n8n Cloud → local para producción
> - Instagram/X/LinkedIn requieren resolución de bloqueadores específicos
>
> **ESTADO REAL:** Operación 100% local vía scripts Python + browser automation.
> Threads es la única plataforma con API sólida, pero migración no priorizada.

---

## Propósito

Este documento especifica cómo migrar el sistema de publicación local a n8n Cloud, detallando workflows objetivo, inputs/outputs por workflow, credenciales/APIs requeridas y qué scripts locales serán reemplazados.

---

## Workflows Objetivo

### WF-001: Publish Master (Orquestador)

**Descripción:** Entry point para todas las publicaciones. Recibe webhook, valida payload, orquesta workflows específicos por plataforma.

**Input (Webhook)**
```json
{
  "pieza_id": "P1_001",
  "plataformas": ["threads", "instagram", "x", "linkedin"],
  "dry_run": false,
  "prioridad": "normal",
  "metadata": {
    "autor": "sistema",
    "campania": "cables_submarinos"
  }
}
```

**Output**
```json
{
  "ok": true,
  "pieza_id": "P1_001",
  "ejecucion_id": "exec_20260405_143000",
  "resultados": {
    "threads": {"ok": true, "id": "18216358396316291", "url": "https://threads.net/..."},
    "instagram": {"ok": true, "id": "1234567890", "url": "https://instagram.com/p/..."},
    "x": {"ok": false, "error": "rate_limited"},
    "linkedin": {"ok": false, "error": "not_implemented"}
  },
  "timestamp": "2026-04-05T14:30:00Z"
}
```

> **NOTA:** Este payload de salida es ASPIRACIONAL. Solo Threads es viable vía API hoy.
> Instagram y X requieren ejecución manual local. LinkedIn está bloqueado.

**Nodos Requeridos:**
- Webhook node (POST /publish)
- Function node (validación)
- HTTP Request nodes (llamadas a workflows específicos)
- Wait node (sincronización)
- Respond to Webhook node

**Reemplaza:** `scripts/run_publish_test.py`

---

### WF-002: Threads Publisher

**Descripción:** Publica en Threads vía Graph API. Más simple y confiable que browser automation.

**Input**
```json
{
  "pieza_id": "P1_001",
  "texto": "Caption del post...",
  "imagen_path": "06_Assets/P1_001/FG_P1_001_IG_Cover_v1.png",
  "dry_run": false
}
```

**Output**
```json
{
  "ok": true,
  "platform": "threads",
  "post_id": "18216358396316291",
  "url": "https://threads.net/@frecuenciaglobal/post/18216358396316291",
  "timestamp": "2026-04-05T14:30:00Z"
}
```

**Nodos Requeridos:**
- Execute Command (upload imagen a litterbox/catbox)
- HTTP Request (POST /v1.0/{user_id}/threads)
- HTTP Request (POST /v1.0/{user_id}/threads_publish)
- IF node (dry_run)

> **ESTADO:** WF-002 es el ÚNICO workflow viable para implementación.
> Sin embargo, la migración completa está BLOQUEADA por el problema del Bridge dinámico.

**Credenciales:**
- `THREADS_ACCESS_TOKEN` (ya disponible)
- `THREADS_USER_ID` (26618714181055427)

**Reemplaza:** `scripts/threads_publish_post.py`

---

### WF-003: Instagram Publisher (API)

**Descripción:** Publica en Instagram vía Graph API. **BLOQUEADO** hasta conversión Business Account.

**Input**
```json
{
  "pieza_id": "P1_001",
  "caption": "Caption del post...",
  "imagen_url": "https://litter.catbox.moe/xxx.png",
  "dry_run": false
}
```

**Output**
```json
{
  "ok": true,
  "platform": "instagram",
  "post_id": "1234567890",
  "permalink": "https://instagram.com/p/ABC123/",
  "timestamp": "2026-04-05T14:30:00Z"
}
```

**Nodos Requeridos:**
- HTTP Request (POST /v22.0/{user_id}/media)
- Wait node (polling status)
- HTTP Request (POST /v22.0/{user_id}/media_publish)

**Credenciales (Faltantes):**
- `IG_ACCESS_TOKEN` (requiere Business Account)
- `IG_USER_ID`

**Reemplaza:** `scripts/ig_api_publish.py` (actualmente sin credenciales)

**Bloqueador:** Instagram @globalfrequency.es necesita conversión a Business/Creator

---

### WF-004: Instagram Publisher (Bridge) - NO VIABLE

> **⚠️ ESTADO:** NO VIABLE PARA PRODUCCIÓN
>
> **BLOQUEADOR CRÍTICO:** El bridge usa Cloudflare Tunnel con URL dinámica.
> Cada restart de cloudflared cambia la URL, rompiendo la integración n8n.

**Descripción:** Alternativa temporal que usa bridge local para browser automation hasta tener API.

**Input**
```json
{
  "pieza_id": "P1_001",
  "plataforma": "instagram",
  "dry_run": false
}
```

**Output**
```json
{
  "ok": false,
  "platform": "instagram",
  "error": "bridge_url_dynamic_not_viable"
}
```

**Nodos Requeridos:**
- HTTP Request (POST a bridge local) - **BLOQUEADO por URL dinámica**
- Bridge ejecutaría `ig_publish_post.py`

**Credenciales:**
- `BRIDGE_AUTH_TOKEN`
- `BRIDGE_URL` - **NO VIABLE:** cambia con cada restart de cloudflared

**Reemplaza:** `scripts/ig_publish_post.py` parcialmente (lo delega)

**VEREDICTO:** NO implementar hasta tener URL estática o Instagram Graph API.

---

### WF-005: X Publisher (Bridge) - NO VIABLE

> **⚠️ ESTADO:** NO VIABLE PARA PRODUCCIÓN - Bridge dinámico inestable

**Descripción:** Publica en X vía bridge local (browser automation). API de pago costosa.

**Input**
```json
{
  "pieza_id": "P1_001",
  "texto": "Tweet content...",
  "dry_run": false
}
```

**Output**
```json
{
  "ok": false,
  "platform": "x",
  "error": "bridge_url_dynamic_not_viable"
}
```

**Nodos Requeridos:**
- HTTP Request (POST a bridge local) - **BLOQUEADO por URL dinámica**
- Bridge ejecutaría `x_publish_post.py`

**Alternativa API (costosa):**
- API Basic: $100/mes, 10,000 tweets/mes
- API Pro: $5,000/mes

**Reemplaza:** `scripts/x_publish_post.py`

**VEREDICTO:** Mantener ejecución local manual. Evaluar API paga si volumen lo justifica.

---

### WF-006: LinkedIn Publisher (BLOQUEADO)

> **⚠️ ESTADO:** BLOQUEADO - App no verificada

**Descripción:** Publica en LinkedIn Company Page. **BLOQUEADO** hasta verificación de app.

**Input**
```json
{
  "pieza_id": "P1_001",
  "texto": "Post content...",
  "dry_run": false
}
```

**Output**
```json
{
  "ok": false,
  "platform": "linkedin",
  "error": "app_not_verified"
}
```

**Nodos Requeridos:**
- HTTP Request (POST /v2/posts) - **BLOQUEADO**
- OAuth2 credentials - **BLOQUEADO**

**Credenciales (Faltantes):**
- LinkedIn OAuth2 (app "FG Community Manager" pendiente verificación)
- Email de negocio: esperando MX records para contact@frecuenciaglobal.is-a.dev

**Reemplaza:** `scripts/linkedin_publish_post.py` (futuro, no disponible)

**VEREDICTO:** No implementar. Mantener fuera de MVP hasta desbloqueo.

---

### WF-007: Image Uploader (Utility)

**Descripción:** Workflow utility para subir imágenes a hosting temporal.

**Input**
```json
{
  "imagen_path": "06_Assets/P1_001/FG_P1_001_IG_Cover_v1.png",
  "expiracion": "72h"
}
```

**Output**
```json
{
  "ok": true,
  "url_temporal": "https://litter.catbox.moe/xxx.png",
  "expiracion": "2026-04-08T14:30:00Z"
}
```

**Nodos Requeridos:**
- HTTP Request (POST litterbox.catbox.moe)

**Reemplaza:** Función interna de múltiples scripts

---

## Inputs/Outputs por Workflow

### Resumen de Interfaces

| Workflow | Input Principal | Output Principal | Trigger |
|----------|-----------------|------------------|---------|
| WF-001 Master | JSON pieza + plataformas | JSON resultados | Webhook POST |
| WF-002 Threads | pieza_id, texto, imagen | post_id, url | Workflow call |
| WF-003 IG API | pieza_id, caption, imagen_url | post_id, permalink | Workflow call |
| WF-004 IG Bridge | pieza_id | result | Workflow call |
| WF-005 X Bridge | pieza_id, texto | tweet_id, url | Workflow call |
| WF-006 LinkedIn | pieza_id, texto | post_id | Workflow call (pendiente) |
| WF-007 Image Upload | imagen_path | url_temporal | Utility call |

---

## Credenciales/API por Workflow

### Disponibles (Listos para usar)

| Credencial | Workflow | Tipo | Estado |
|------------|----------|------|--------|
| `THREADS_ACCESS_TOKEN` | WF-002 | Bearer Token | ✅ Activo |
| `THREADS_USER_ID` | WF-002 | String | ✅ 26618714181055427 |

### Pendientes (Bloquean migración)

| Credencial | Workflow | Bloqueador | Acción Requerida |
|------------|----------|------------|------------------|
| `IG_ACCESS_TOKEN` | WF-003 | Cuenta personal | Convertir @globalfrequency.es a Business |
| `IG_USER_ID` | WF-003 | Depende de token | Obtener tras conversión |
| `X_API_KEY` | WF-005 (API) | Costo | Evaluar $100/mes vs bridge |
| `LINKEDIN_OAUTH2` | WF-006 | Verificación app | Esperar MX records merge |
| `BRIDGE_AUTH` | WF-004,005 | Variable dinámica | Configurar en cada restart |

### Variables n8n Cloud

| Variable | Descripción | Valor Actual |
|----------|-------------|--------------|
| `BRIDGE_URL` | URL del bridge local | Cambia con cada restart de cloudflared |
| `FG_WEBSITE_URL` | URL web | https://frecuenciaglobal.is-a.dev |
| `TELEGRAM_CHAT_ID` | Chat para notificaciones | Configurado |

---

## Qué Scripts Locales Serán Reemplazados

### Reemplazo Directo (1:1)

| Script Local | Workflow n8n | Complejidad | Estado |
|--------------|--------------|-------------|--------|
| `threads_publish_post.py` | WF-002 | Baja | 🟢 Listo para migrar |
| `ig_api_publish.py` | WF-003 | Media | 🔴 Bloqueado por Business Account |
| `run_publish_test.py` | WF-001 | Media | 🟡 Requiere bridge o APIs |

### Reemplazo vía Bridge (Interino)

| Script Local | Workflow n8n + Bridge | Nota |
|--------------|----------------------|------|
| `ig_publish_post.py` | WF-004 + Bridge | **NO VIABLE:** Bridge dinámico inestable |
| `x_publish_post.py` | WF-005 + Bridge | **NO VIABLE:** Bridge dinámico inestable |
| `linkedin_publish_post.py` | WF-006 + Bridge | **BLOQUEADO:** App no verificada |

### Mantener Local (No migrar aún)

| Script | Razón |
|--------|-------|
| `ig_chrome_login.py` | Requiere browser real |
| `x_profile_setup.py` | Requiere browser real |
| `linkedin_preflight.ps1` | Valida sesión manual |
| `gemini_generate_image.py` | Generación de assets (no publicación) |

---

## Qué Dependencias Siguen Externas

### Servicios Externos (No cambian)

| Servicio | Uso | Contrato |
|----------|-----|----------|
| `litterbox.catbox.moe` | Hosting temporal imágenes | URL 72h, límite 1GB |
| `graph.threads.net` | Threads API | v1.0, requiere token |
| `graph.instagram.com` | Instagram API | v22.0, requiere Business |
| Cloudflare Tunnel | Bridge local → n8n Cloud | **NO VIABLE:** URL cambia cada restart |

### Dependencias Locales (Bridge - NO VIABLE)

| Componente | Rol | Persistencia |
|------------|-----|--------------|
| Bridge server | Recibe calls de n8n, ejecuta scripts | `08_n8n/bridge/server.js` |
| Chrome profiles | Sesiones persistentes | `.chrome-*-stable/` |
| Python scripts | Lógica de publicación | `scripts/*_publish_post.py` |

> **⚠️ VEREDICTO BRIDGE:** No viable para producción. La URL dinámica del Cloudflare Tunnel
> hace que cualquier integración n8n Cloud → local sea inestable y requería actualización
> manual en cada restart. Mantener operación 100% local hasta resolver esto.

---

## Secuencia de Migración Recomendada (FUTURO - No activa)

> **ESTADO:** No iniciar migración. Resolver bloqueadores primero.

### Fase 1: Threads (ÚNICA viable, pero no priorizada)

```
Cuando se decida migrar (si se decide):
├── Importar WF-002 (Threads Publisher) a n8n Cloud
├── Configurar credencial THREADS_ACCESS_TOKEN
├── Test dry-run
└── Publicación real de prueba
```

### Fase 2: Bridge Setup - NO VIABLE ACTUALMENTE

```
BLOQUEADO:
├── Configurar bridge server local
├── Crear Cloudflare Tunnel persistente - URL dinámica!
├── Documentar BRIDGE_URL en n8n Cloud - Requiere update manual cada restart
└── Test end-to-end - Inestable
```

> **NOTA:** Sin solución de URL estática, el Bridge es inviable para producción.

### Fase 3+: Resto de plataformas (BLOQUEADAS)

```
BLOQUEADOS hasta desbloqueo:
├── Instagram: Business Account conversion
├── X: Decisión API paga vs mantener manual local
└── LinkedIn: App verification (MX records)
```

---

## Diagrama de Arquitectura Post-Migración

```
                         ┌─────────────────────┐
                         │   Cliente/Trigger   │
                         │  (Manual/Webhook)   │
                         └──────────┬──────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           n8n CLOUD                                      │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  WF-001: Publish Master                                          │   │
│  │  ├── Webhook Trigger                                             │   │
│  │  ├── Validate Pieza                                              │   │
│  │  ├── IF dry_run                                                  │   │
│  │  ├── Call WF-002 (Threads) ──┐                                   │   │
│  │  ├── Call WF-004 (IG Bridge)─┼──┐                               │   │
│  │  ├── Call WF-005 (X Bridge)──┼──┼──┐                            │   │
│  │  └── Aggregate Results ◄──────┘  │  │                            │   │
│  │       └── Response to Webhook    │  │                            │   │
│  └──────────────────────────────────┼──┼────────────────────────────┘   │
│                                     │  │                                │
│  ┌──────────────────────────────────┼──┼────────────────────────────┐   │
│  │  WF-002: Threads               │  │  (HTTP Request)              │   │
│  │  ├── Upload Image              │  │                                │   │
│  │  ├── Create Container          │  │                                │   │
│  │  └── Publish                   │  │                                │   │
│  └──────────────────────────────────┼──┼────────────────────────────┘   │
│                                     │  │                                │
│  ┌──────────────────────────────────┼──┼────────────────────────────┐   │
│  │  WF-004/005: IG/X Bridge         │  │                            │   │
│  │  └── HTTP Request to Bridge ◄──┘  │                            │   │
│  └─────────────────────────────────────┘─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                          Cloudflare Tunnel
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        MÁQUINA LOCAL (Bridge)                            │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │  Bridge Server   │────│  Chrome Profile  │────│  Instagram/X/LI    │  │
│  │  (Node.js)       │    │  (Persistent)    │    │  (Browser)         │  │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Referencias

- n8n Workflows actuales: `c:\Users\farid\Documents\Frecuencia Global\08_n8n\workflows_cloud\`
- Bridge server: `c:\Users\farid\Documents\Frecuencia Global\08_n8n\bridge\server.js`
- Credenciales n8n: `08_n8n/CREDENCIALES_N8N_CLOUD.md`
- Control Plane local: `07_Operaciones/LOCAL_CONTROL_PLANE.md`
- Publishing Contract: `07_Operaciones/PUBLISHING_CONTRACT.md`
