# Catálogo de Workflows — n8n Frecuencia Global

---

## Workflows principales

### WF-001 — Intake de Ideas

| Campo | Valor |
|-------|-------|
| **Archivo** | `workflows/WF-001_intake_ideas.json` |
| **Trigger** | Webhook POST `/webhook/intake` |
| **Input** | `{ titulo, pilar, angulo, formato, plataformas?, autor?, deadline? }` |
| **Output** | Archivo `03_Editorial/P1_NNN_Brief.md` o `03_Editorial/EP_NNN_Brief.md` |
| **Dependencias** | SUB-002 (Telegram), SUB-004 (Log) |
| **Tags** | editorial, intake |

**Flujo:** Webhook → Validar campos → Generar ID secuencial → Leer template brief → Rellenar → Escribir archivo → Log → Telegram → Responder

**Pilares válidos:** `GD` (Geopolitik Drop), `BB` (Bass & Borders), `FG` (Frecuencia Global), `BP` (Blueprint)

**Formatos válidos:** `carousel`, `video`, `reel`, `thread`, `podcast`

---

### WF-002 — Registro de Brief

| Campo | Valor |
|-------|-------|
| **Archivo** | `workflows/WF-002_registro_brief.json` |
| **Trigger** | Webhook POST `/webhook/register-brief` |
| **Input** | `{ pieza, estado }` |
| **Output** | Actualiza `04_Produccion/pipeline_tracker.json` |
| **Dependencias** | SUB-002 (Telegram), SUB-004 (Log) |
| **Tags** | editorial, tracking |

**Flujo:** Webhook → Validar → Verificar brief existe → Actualizar tracker → Log → Telegram → Responder

**Estados válidos:** `BRIEF_READY`, `RESEARCH_DONE`, `SCRIPT_DONE`, `AUDIO_DONE`, `VIDEO_DONE`, `SHOW_NOTES_READY`, `RSS_READY`, `DESIGN_DONE`, `QA_PASS`, `PUBLISHED`, `PUBLISHED_YOUTUBE`, `PUBLISHED_PODCAST`, `PUBLISHED_SOCIAL`

---

### WF-003 — QA Checklist

| Campo | Valor |
|-------|-------|
| **Archivo** | `workflows/WF-003_qa_checklist.json` |
| **Trigger** | Webhook POST `/webhook/qa` |
| **Input** | `{ pieza }` |
| **Output** | Archivo `04_Produccion/P1_NNN_QA.md` |
| **Dependencias** | SUB-002 (Telegram), SUB-004 (Log) |
| **Tags** | produccion, qa |

**Flujo:** Webhook → Validar → Leer brief (extraer metadata) → Leer template QA → Rellenar → Escribir QA → Telegram → Log → Responder

---

### WF-004 — Notificación y Log

| Campo | Valor |
|-------|-------|
| **Archivo** | `workflows/WF-004_notificacion_log.json` |
| **Trigger** | Llamado por otros workflows (executeWorkflow) |
| **Input** | `{ evento, pieza, detalles, timestamp }` |
| **Output** | Append a `07_Operaciones/FG_Operations_Log.md` + Telegram |
| **Dependencias** | SUB-002 (Telegram) |
| **Tags** | operaciones, sub-workflow |

**Flujo:** Trigger → Formatear línea de log → Append a archivo → Notificar Telegram

---

### WF-005 — Pipeline Status (Diario)

| Campo | Valor |
|-------|-------|
| **Archivo** | `workflows/WF-005_pipeline_status.json` |
| **Trigger** | Cron: `0 9 * * *` (9AM diario) |
| **Input** | Ninguno (lee filesystem) |
| **Output** | Resumen Telegram + snapshot en Operations Log |
| **Dependencias** | SUB-002 (Telegram) |
| **Tags** | operaciones, daily |

**Flujo:** Cron → Leer tracker → Calcular estadísticas (total, por estado, bloqueadas >48h) → Telegram → Log

---

## Sub-workflows

### SUB-001 — Escribir Markdown

| Campo | Valor |
|-------|-------|
| **Archivo** | `workflows/sub/SUB-001_escribir_markdown.json` |
| **Input** | `{ filePath, content }` |
| **Output** | Archivo escrito en disco |

---

### SUB-002 — Notificar Telegram

| Campo | Valor |
|-------|-------|
| **Archivo** | `workflows/sub/SUB-002_notificar_telegram.json` |
| **Input** | `{ mensaje }` |
| **Output** | Mensaje enviado (o skip si Telegram no configurado) |
| **Nota** | Falla graceful: si Telegram no está configurado o la API responde error, no tumba el workflow padre |

**Detalles operativos:**
- Envía texto plano para evitar errores de `parse_mode` por Markdown malformado.
- Devuelve `sent: false` con razón (`telegram_not_configured`, `telegram_api_error`, etc.) cuando Telegram no está sano.

---

### SUB-003 — Template Filler

| Campo | Valor |
|-------|-------|
| **Archivo** | `workflows/sub/SUB-003_template_filler.json` |
| **Input** | `{ templatePath, variables: { KEY: "value", ... } }` |
| **Output** | `{ content }` con variables reemplazadas |

---

### SUB-004 — Registrar Evento

| Campo | Valor |
|-------|-------|
| **Archivo** | `workflows/sub/SUB-004_registrar_evento.json` |
| **Input** | `{ evento, pieza, detalles, timestamp? }` |
| **Output** | Línea añadida a `07_Operaciones/FG_Operations_Log.md` |

---

## Mapa de dependencias

```
WF-001 (Intake)       → SUB-004, SUB-002
WF-002 (Registro)     → SUB-004, SUB-002
WF-003 (QA)           → SUB-002, SUB-004
WF-004 (Log)          → SUB-002
WF-005 (Daily Status) → SUB-002
WF-006 (Prepare)      → SUB-002, SUB-004
WF-007 (Publish X)    → SUB-002, SUB-004
WF-008 (Publish IG)   → SUB-002, SUB-004
WF-009 (Publish LI)   → SUB-002, SUB-004
WF-010 (Publish TT)   → SUB-002, SUB-004
```

---

---

### WF-006 — Preparar Publicación

| Campo | Valor |
|-------|-------|
| **Archivo** | `workflows/WF-006_preparar_publicacion.json` |
| **ID runtime** | `fg_wf_006` |
| **Trigger** | Webhook POST `/webhook/prepare-publish` |
| **Input** | `{ "pieza": "P1_NNN" }` o `{ "pieza": "EP_NNN" }` |
| **Output** | Archivo `04_Produccion/P1_NNN_PublishReady.md` o `04_Produccion/EP_NNN_PublishReady.md`, tracker → `PUBLISH_READY` |
| **Dependencias** | SUB-002 (Telegram), SUB-004 (Log) |

**Flujo:** Webhook → Validar Input → Leer Brief → Generar paquete por tipo de pieza → Escribir PublishReady → Actualizar Tracker → Notificar Telegram → Registrar Evento → Responder OK

**Notas:**
- Genera copy optimizado por plataforma (X ≤280 chars, TikTok ≤300 chars, Instagram/LinkedIn completo)
- TikTok copy es solo para uso manual (API no disponible en n8n)
- Lee hashtags automáticamente desde el pilar del brief
- Para `podcast`, genera ademas bloques de metadata RSS.com, metadata YouTube, show notes base, chapters y lista de clips derivados
- Usa `FG_PODCAST_SHOW_URL` y `FG_PODCAST_RSS_URL` para tratar RSS.com como host principal del audio

---

### WF-007 — Publicar en X

| Campo | Valor |
|-------|-------|
| **Archivo** | `workflows/WF-007_publicar_x.json` |
| **ID runtime** | `fg_wf_007` |
| **Trigger** | Webhook POST `/webhook/publish-x` |
| **Input** | `{ "pieza": "P1_NNN" }` |
| **Output** | Tweet publicado en @frec_global, tracker → `PUBLISHED_X` |
| **Dependencias** | SUB-002 (Telegram), SUB-004 (Log) |
| **Credencial requerida** | `twitterOAuth2Api` → nombre: `"FG X (Twitter)"` |

**Flujo:** Webhook → Validar Input → Leer PublishReady → Publicar en X (X node v2) → Actualizar Tracker → Notificar Telegram → Registrar Evento → Responder OK

**Notas:**
- Requiere que WF-006 ya haya generado el archivo `PublishReady.md`
- La credencial X OAuth2 API debe configurarse manualmente en la UI de n8n antes de activar
- Agrega entrada `publicaciones[{ plataforma: 'X', timestamp, tweetId }]` al tracker

---

### WF-008 — Publicar en Instagram

| Campo | Valor |
|-------|-------|
| **Archivo** | `workflows_cloud/WF-008_publicar_instagram.json` |
| **Trigger** | Webhook POST `/webhook/publish-instagram` |
| **Input** | `{ "pieza": "P1_NNN", "imageUrl": "https://..." }` |
| **Output** | Publicación/bridge Instagram ejecutado, tracker → `PUBLISHED_INSTAGRAM` |
| **Dependencias** | SUB-002 (Telegram), SUB-004 (Log) |
| **Variable requerida** | `IG_PUBLISH_WEBHOOK_URL` |

**Flujo:** Webhook → Validar Input → Leer PublishReady → Extraer caption IG → Enviar al bridge/API de Instagram → Actualizar Tracker → Notificar Telegram → Registrar Evento → Responder OK

**Notas:**
- Requiere que WF-006 ya haya generado `P1_NNN_PublishReady.md`
- Requiere credencial de autenticación del bridge/API que publique en Instagram
- Registra `postId` y deja historial `PUBLISHED_INSTAGRAM`

---

### WF-009 — Publicar en LinkedIn

| Campo | Valor |
|-------|-------|
| **Archivo** | `workflows_cloud/WF-009_publicar_linkedin.json` |
| **Trigger** | Webhook POST `/webhook/publish-linkedin` |
| **Input** | `{ "pieza": "P1_NNN" }` |
| **Output** | Post LinkedIn publicado, tracker → `PUBLISHED_LINKEDIN` |
| **Dependencias** | SUB-002 (Telegram), SUB-004 (Log) |
| **Variable requerida** | `LINKEDIN_AUTHOR_URN` |

**Flujo:** Webhook → Validar Input → Leer PublishReady → Extraer copy LinkedIn → Publicar vía LinkedIn API → Actualizar Tracker → Notificar Telegram → Registrar Evento → Responder OK

**Notas:**
- Publica directamente contra `https://api.linkedin.com/v2/ugcPosts`
- Requiere credencial `LinkedIn Community Management OAuth2 API` válida
- Registra `postId` y deja historial `PUBLISHED_LINKEDIN`

---

### WF-010 — Publicar en TikTok

| Campo | Valor |
|-------|-------|
| **Archivo** | `workflows_cloud/WF-010_publicar_tiktok.json` |
| **Trigger** | Webhook POST `/webhook/publish-tiktok` |
| **Input** | `{ "pieza": "P1_NNN", "videoUrl": "https://..." }` |
| **Output** | Publicación/bridge TikTok ejecutado, tracker → `PUBLISHED_TIKTOK` |
| **Dependencias** | SUB-002 (Telegram), SUB-004 (Log) |
| **Variable requerida** | `TIKTOK_PUBLISH_WEBHOOK_URL` |

**Flujo:** Webhook → Validar Input → Leer PublishReady → Extraer copy TikTok → Enviar al bridge/API de TikTok → Actualizar Tracker → Notificar Telegram → Registrar Evento → Responder OK

**Notas:**
- Requiere que WF-006 ya haya generado `P1_NNN_PublishReady.md`
- Requiere credencial de autenticación del bridge/API que publique en TikTok
- Registra `postId` y deja historial `PUBLISHED_TIKTOK`

---

## Archivos del filesystem tocados por n8n

| Archivo | Workflow | Operación |
|---------|----------|-----------|
| `03_Editorial/P1_NNN_Brief.md` / `03_Editorial/EP_NNN_Brief.md` | WF-001 | Crear |
| `04_Produccion/pipeline_tracker.json` | WF-002, WF-005, WF-006, WF-007, WF-008, WF-009, WF-010 | Leer/Escribir |
| `04_Produccion/P1_NNN_QA.md` | WF-003 | Crear |
| `04_Produccion/P1_NNN_PublishReady.md` / `04_Produccion/EP_NNN_PublishReady.md` | WF-006 | Crear |
| `07_Operaciones/FG_Operations_Log.md` | WF-004, WF-005, SUB-004 | Append |
| `08_n8n/templates/brief_template.md` | WF-001 | Leer |
| `08_n8n/templates/qa_template.md` | WF-003 | Leer |
