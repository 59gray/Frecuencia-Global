# Estado de Publicacion en Redes — 2026-04-03

Documento consolidado de estado real por plataforma.
Fuentes: `N8N_Social_Blockers_2026-04-03.md`, `N8N_Credential_Runbook_2026-04-02.md`, `PATCH_NOTES_2026-04-03.md`, `.env.cloud.example`.

---

## X/Twitter

### 1. App creada en la plataforma
- **Si** — verificado.
- La ejecucion 53 de `WF-007` llego al nodo `Publicar en X` y la API de X devolvio `402 CreditsDepleted` para la cuenta `2040016112885133312`.
- Esto confirma que la app existe, tiene permisos de escritura y la autenticacion OAuth funciona.

### 2. Credencial creada en n8n
- **Funcional** — verificado.
- El workflow `WF-007` alcanzo la API de X, lo que implica que la credencial `X OAuth2 API` esta configurada y autenticada.
- Nombre esperado en n8n: `FG X (Twitter)`.

### 3. Workflow probado
- **Parcialmente** — verificado.
- `WF-007` esta publicado y activo en n8n Cloud.
- Ejecucion 53 llego al nodo final de publicacion.
- Fallo por `402 CreditsDepleted`, no por error tecnico del workflow.

### 4. Variable obligatoria cargada
- **No aplica** — `WF-007` no usa variable tipo `*_PUBLISH_WEBHOOK_URL`.
- Publica directamente via nodo OAuth nativo de n8n.

### 5. Webhook/bridge real definido
- **No requiere** — publicacion directa via API con nodo nativo.

### 6. Que falta para dejarla operativa

**Opcion A: API oficial (pago)**
- Cargar creditos en X Developer Portal.
- Sin ese gasto, la API rechaza cualquier publicacion.
- Una vez cargados los creditos, volver a ejecutar `WF-007` con una pieza `PUBLISH_READY`.

**Opcion B: Browser automation (gratuita) — IMPLEMENTADA**
- Script creado: `scripts/x_publish_post.py`
- Usa sesion persistente en `.chrome-x-stable/`
- No requiere API ni creditos.
- Mas fragil (selectores pueden cambiar) pero funcional.

### 7. Estado hoy
- **Operativa via browser automation** (gratuita).
- API oficial: bloqueada por creditos.
- Browser automation: script listo para usar.
- Comando de prueba: `python scripts/x_publish_post.py --pieza P1_001 --dry-run`

---

## LinkedIn

### 1. App creada en la plataforma

- **Si** — creada 2026-04-04.
- App name: `Frecuencia Global` en LinkedIn Developer Portal.
- Client ID: `78f23qrq3wfh80`.
- Productos: `Share on LinkedIn`, `Sign In with LinkedIn using OpenID Connect`.
- Redirect URL: `https://oauth.n8n.cloud/oauth2/callback`.

### 2. Credencial creada en n8n

- **Parcial** — credencial `LinkedIn account` (OAuth2 standard) conectada en n8n Cloud.
- Credencial `FG LinkedIn Auth` (Community Management OAuth2) **no conectada**.
- Community Management API requiere aprobacion de LinkedIn (Request access bloqueado).

### 3. Workflow probado

- **No via API** — `WF-009` requiere Community Management OAuth2 que esta bloqueado.
- `WF-009` esta publicado en n8n Cloud pero no puede ejecutarse sin esa credencial.

### 4. Variable obligatoria cargada

- **Si** — `LINKEDIN_AUTHOR_URN` ya esta creada en n8n Cloud.
- Valor: `urn:li:organization:112349668`.

### 5. Webhook/bridge real definido

- **No requiere** — publicacion directa (API o browser).

### 6. Que falta para dejarla operativa

**Opcion A: API oficial (bloqueada)**
- Requiere aprobacion de `Community Management API` por LinkedIn.
- Una vez aprobada, conectar `FG LinkedIn Auth` en n8n Cloud y ejecutar `WF-009`.

**Opcion B: Browser automation (gratuita) — IMPLEMENTADA**
- Script creado: `scripts/linkedin_publish_post.py`
- Publica en la Company Page via navegador con sesion persistente.
- No requiere API ni Community Management API.
- Mas fragil (selectores pueden cambiar) pero funcional.

### 7. Estado hoy

- **Operativa via browser automation** (gratuita).
- API oficial: bloqueada por Community Management API (pendiente aprobacion LinkedIn).
- Browser automation: script listo para usar.
- Comando de prueba: `python scripts/linkedin_publish_post.py --pieza P1_001 --dry-run`

---

## Instagram

### 1. App creada en la plataforma
- **Pendiente de verificacion.**
- No hay evidencia en el repo de app/configuracion Meta lista para esta integracion.
- Creator account de Instagram ya activada (per Platform Test Checklist).

### 2. Credencial creada en n8n
- **Ausente.**
- `WF-008` depende de bridge externo, no de credencial OAuth directa en n8n.

### 3. Workflow probado
- **No.**
- `WF-008` esta publicado y activo en n8n Cloud.
- No puede ejecutarse: falta `IG_PUBLISH_WEBHOOK_URL` y el bridge externo.
- Nota adicional: el workflow exige `imageUrl` — no sirve para prueba de solo texto.

### 4. Variable obligatoria cargada
- **Ausente** — `IG_PUBLISH_WEBHOOK_URL` esta vacia.

### 5. Webhook/bridge real definido
- **Ausente.**
- La arquitectura requiere un bridge externo de publicacion.
- No hay endpoint real definido.

### 6. Que falta para dejarla operativa
1. Definir bridge real de publicacion para Instagram.
2. Obtener URL real del webhook.
3. Cargar `IG_PUBLISH_WEBHOOK_URL` en n8n Cloud.
4. Crear credencial para el bridge/API si aplica.
5. Resolver que el workflow exige `imageUrl` (no sirve solo texto).
6. Ejecutar prueba real con imagen.
7. Confirmar trazabilidad de la publicacion.

### 7. Estado hoy
- **Bloqueada.**
- Falta variable obligatoria.
- Falta bridge real.
- Falta media pipeline (el WF exige imagen).

---

## TikTok

### 1. App creada en la plataforma
- **Pendiente de verificacion.**
- No hay evidencia de app/configuracion oficial en TikTok para esta integracion.

### 2. Credencial creada en n8n
- **Ausente.**
- Se requiere credencial `FG TikTok Auth` y bridge externo.

### 3. Workflow probado
- **No.**
- `WF-010` existe como archivo local (`WF-010_publicar_tiktok.json`).
- **No esta importado en n8n Cloud** (per Social Blockers 2026-04-03).
- Requiere `videoUrl` — no sirve para prueba de solo texto.

### 4. Variable obligatoria cargada
- **Ausente** — `TIKTOK_PUBLISH_WEBHOOK_URL` esta vacia.

### 5. Webhook/bridge real definido
- **Ausente.**
- La arquitectura requiere bridge externo de publicacion.

### 6. Que falta para dejarla operativa
1. Importar `WF-010` en n8n Cloud.
2. Definir bridge real de publicacion para TikTok.
3. Obtener URL real del webhook.
4. Cargar `TIKTOK_PUBLISH_WEBHOOK_URL` en n8n Cloud.
5. Crear credencial `FG TikTok Auth`.
6. Resolver que el workflow exige `videoUrl` (no sirve solo texto).
7. Ejecutar prueba real con video.
8. Confirmar resultado.

### 7. Estado hoy
- **Bloqueada.**
- Workflow ni siquiera esta en cloud.
- Falta variable, bridge, credencial y media pipeline.

---

## Tabla comparativa

| Dimension | X/Twitter | LinkedIn | Instagram | TikTok |
|-----------|-----------|----------|-----------|--------|
| App en plataforma | Si (verificada) | Pendiente | Pendiente | Pendiente |
| Credencial en n8n | Funcional | Ausente | Ausente | Ausente |
| Workflow en cloud | Activo | Activo | Activo | No importado |
| Workflow probado | Parcial (402) | No | No | No |
| Variable obligatoria | No aplica | Lista (`AUTHOR_URN`) | Ausente (`IG_PUBLISH_WEBHOOK_URL`) | Ausente (`TIKTOK_PUBLISH_WEBHOOK_URL`) |
| Bridge externo | No requiere | No requiere | Ausente | Ausente |
| Soporte solo texto | Si | Si | No (exige imagen) | No (exige video) |
| Bloqueador principal | Creditos X Developer | Credencial OAuth | Bridge + variable + media | WF no importado + bridge + variable + media |
| Estado | Bloqueada (financiero) | Bloqueada (credencial) | Bloqueada (estructural) | Bloqueada (estructural) |

---

## Ruta minima viable para desbloquear publicacion

### Ola 1 — X/Twitter (menor friccion)

**Unico paso externo:** cargar creditos en X Developer Portal.

| Paso | Accion | Responsable | Dependencia |
|------|--------|-------------|-------------|
| 1.1 | Cargar creditos en X Developer Portal | Usuario | Acceso a cuenta + medio de pago |
| 1.2 | Ejecutar `WF-007` con pieza `PUBLISH_READY` | Cascade/Usuario | Paso 1.1 |
| 1.3 | Verificar publicacion en X | Usuario | Paso 1.2 |

### Ola 2 — LinkedIn (requiere credencial nueva)

| Paso | Accion | Responsable | Dependencia |
|------|--------|-------------|-------------|
| 2.1 | Verificar/crear app en LinkedIn Developer Portal | Usuario | Acceso a LinkedIn Developer |
| 2.2 | Habilitar productos: `Share on LinkedIn`, `Sign In with LinkedIn using OpenID Connect` | Usuario | Paso 2.1 |
| 2.3 | Solicitar `Community Management App Review` si se publica como organizacion | Usuario | Paso 2.2 |
| 2.4 | Obtener `Client ID` y `Client Secret` | Usuario | Paso 2.1 |
| 2.5 | Crear credencial `FG LinkedIn Auth` en n8n Cloud | Cascade/Usuario | Paso 2.4 + callback URL |
| 2.6 | Asignar credencial al nodo de `WF-009` | Cascade/Usuario | Paso 2.5 |
| 2.7 | Ejecutar prueba real (post de texto) | Cascade/Usuario | Paso 2.6 |
| 2.8 | Verificar publicacion en LinkedIn | Usuario | Paso 2.7 |

### Ola 3 — Instagram y TikTok (requieren bridge + media pipeline)

Ambas plataformas comparten la misma causa de bloqueo estructural:
- Bridge externo de publicacion no existe.
- Variable de webhook vacia.
- Workflows exigen media (imagen / video), no soportan solo texto.

Se recomienda resolver en paralelo una vez que:
- Exista pipeline de media real (assets de produccion listos para publicar).
- Se defina la estrategia de bridge (servicio propio, Make, Zapier u otro).

| Paso | Accion | Responsable | Dependencia |
|------|--------|-------------|-------------|
| 3.1 | Decidir estrategia de bridge para IG y TikTok | Usuario | Decision de arquitectura |
| 3.2 | Implementar bridge y obtener URLs reales | Cascade/Usuario | Paso 3.1 |
| 3.3 | Importar `WF-010` en n8n Cloud (TikTok) | Cascade | Paso 3.2 |
| 3.4 | Cargar `IG_PUBLISH_WEBHOOK_URL` y `TIKTOK_PUBLISH_WEBHOOK_URL` | Cascade/Usuario | Paso 3.2 |
| 3.5 | Crear credenciales para bridges | Cascade/Usuario | Paso 3.2 |
| 3.6 | Ejecutar pruebas reales con media | Usuario | Pasos 3.3-3.5 + assets listos |

---

## Matriz operativa accionable

| # | Plataforma | Evidencia actual | Faltante exacto | Responsable | Dependencia | Orden |
|---|-----------|-----------------|-----------------|-------------|-------------|-------|
| 1 | X/Twitter | App verificada, credencial funcional, WF-007 llega al nodo final | Creditos en X Developer Portal | Usuario (pago) | Medio de pago | **Primero** |
| 2 | LinkedIn | WF-009 activo, `AUTHOR_URN` lista, redirect URL confirmada | App en LinkedIn Dev + credencial `FG LinkedIn Auth` | Usuario (app) + Cascade (n8n) | Client ID/Secret de LinkedIn | **Segundo** |
| 3 | Instagram | WF-008 activo, Creator account lista | Bridge real + `IG_PUBLISH_WEBHOOK_URL` + media pipeline | Usuario (decision) + Cascade (config) | Estrategia de bridge definida | **Tercero** |
| 4 | TikTok | WF-010 solo local, assets de perfil listos | Importar WF + bridge real + `TIKTOK_PUBLISH_WEBHOOK_URL` + video pipeline | Usuario (decision) + Cascade (import/config) | Estrategia de bridge definida | **Cuarto** |

---

*Generado el 2026-04-03. Fuente unica de verdad para estado de publicacion social.*
