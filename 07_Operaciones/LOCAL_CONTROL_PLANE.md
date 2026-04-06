# FG Local Control Plane
## Control Plane Local Pre-n8n

**Versión:** 1.0
**Fecha:** 2026-04-05
**Ámbito:** Secuencia de validación y ejecución local

---

## Propósito

Este documento define el control plane local que orquesta la publicación de contenido antes de la migración completa a n8n. Especifica la secuencia de validación, comandos mínimos, gates de bloqueo y qué plataformas están operativas hoy.

---

## Secuencia de Validación

### Pre-flight Checklist (Ejecutar en orden)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FASE 1: VALIDACIÓN DE ENTORNO                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  [ ] 1.1 Secrets cargados (.env.local o system)                            │
│      └─ Comando: scripts/load_local_secrets.ps1                            │
│                                                                              │
│  [ ] 1.2 Playwright instalado y navegadores disponibles                    │
│      └─ Comando: python -m playwright install chromium                     │
│                                                                              │
│  [ ] 1.3 Sesiones Chrome persistentes verificadas                          │
│      └─ Directorios: .chrome-x-stable/, .chrome-ig-stable/,                │
│                      .chrome-linkedin-stable/                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  FASE 2: VALIDACIÓN DE PIEZA                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  [ ] 2.1 Archivo PublishReady existe                                       │
│      └─ Path: 04_Produccion/{pieza}_PublishReady.md                       │
│                                                                              │
│  [ ] 2.2 Secciones de plataformas parseables                               │
│      └─ Regex: ## (Instagram|X|LinkedIn|Threads|TikTok)                    │
│                                                                              │
│  [ ] 2.3 Assets de imagen disponibles                                      │
│      └─ Path: 06_Assets/{pieza}/                                           │
│                                                                              │
│  [ ] 2.4 Validación de longitudes                                        │
│      └─ X: ≤280, Threads: ≤500, LinkedIn: ≤3000                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  FASE 3: VALIDACIÓN DE PLATAFORMAS                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  [ ] 3.1 Threads - API Token válido                                        │
│      └─ Comando: python scripts/threads_publish_post.py --dry-run           │
│                                                                              │
│  [ ] 3.2 Instagram - Sesión activa                                         │
│      └─ Comando: scripts/instagram_preflight.ps1                          │
│                                                                              │
│  [ ] 3.3 X - Sesión activa                                                 │
│      └─ Comando: scripts/x_preflight.ps1                                  │
│                                                                              │
│  [ ] 3.4 LinkedIn - Sesión admin válida                                    │
│      └─ Comando: scripts/linkedin_preflight.ps1 (script existe pero app   │
│                  no verificada - FUERA DE MVP)                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  FASE 4: EJECUCIÓN (Dry-Run → Real)                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  [ ] 4.1 Dry-run completo                                                  │
│      └─ --dry-run en todos los scripts de publicación                       │
│                                                                              │
│  [ ] 4.2 Confirmación manual de operador                                   │
│      └─ Gate: Requiere input "Y" para continuar                           │
│                                                                              │
│  [ ] 4.3 Publicación real secuencial                                       │
│      └─ Orden recomendado: Threads → Instagram → X                         │
│      └─ NOTA: LinkedIn FUERA de MVP (bloqueado por app)                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Comandos Mínimos

### Validación de Entorno

```powershell
# Cargar secretos
.\scripts\load_local_secrets.ps1

# Verificar sesiones
Test-Path .\.chrome-x-stable\
Test-Path .\.chrome-ig-stable\
Test-Path .\.chrome-linkedin-stable\

# Verificar Playwright
python -c "from playwright.sync_api import sync_playwright; print('OK')"
```

### Validación de Pieza

```powershell
# Verificar PublishReady existe
Test-Path 04_Produccion\P1_001_PublishReady.md

# Validar con script preflight general
python scripts\preflight.py --pieza P1_001
```

### Publicación por Plataforma (con Dry-run)

```powershell
# Threads (API - más confiable)
python scripts\threads_publish_post.py --pieza P1_001 --dry-run
python scripts\threads_publish_post.py --pieza P1_001              # Real

# Instagram (Browser automation)
python scripts\ig_publish_post.py --pieza P1_001 --dry-run
python scripts\ig_publish_post.py --pieza P1_001                   # Real

# X (Browser automation)
python scripts\x_publish_post.py --pieza P1_001 --dry-run
python scripts\x_publish_post.py --pieza P1_001                     # Real

# LinkedIn (Browser automation - requiere sesión admin)
python scripts\linkedin_publish_post.py --pieza P1_001 --dry-run
python scripts\linkedin_publish_post.py --pieza P1_001              # Real
```

### Publicación Masiva (Script Orquestador)

```powershell
# Ejecutar publicación multi-plataforma
python scripts\run_publish_test.py --pieza P1_001 --skip-webhook
```

---

## Gates de Bloqueo

### Gates Bloqueantes (Stop)

| Gate | Condición | Mensaje de Error |
|------|-----------|------------------|
| `G1_NO_SECRETS` | No se cargaron secrets | `[ERROR] No se encontraron secrets. Ejecutar load_local_secrets.ps1` |
| `G2_NO_PUBLISHREADY` | Archivo PublishReady no existe | `[ERROR] No existe 04_Produccion/{pieza}_PublishReady.md` |
| `G3_NO_ASSETS` | Directorio de assets vacío | `[ERROR] 06_Assets/{pieza}/ no contiene imágenes` |
| `G4_X_TOO_LONG` | Texto X excede 280 chars | `[ERROR] Longitud X: {n}/280 caracteres` |
| `G5_IG_SESSION_INVALID` | Sesión Instagram no válida | `[ERROR] No hay sesión activa. Ejecutar ig_chrome_login.py` |
| `G6_X_SESSION_INVALID` | Sesión X no válida | `[ERROR] No existe perfil .chrome-x-stable/` |
| `G7_LI_SESSION_INVALID` | Sesión LinkedIn no válida | `[ERROR] No hay sesión admin activa` |
| `G8_DRY_RUN_FAILED` | Dry-run retornó error | `[ERROR] Dry-run falló. Abortando.` |

### Gates de Advertencia (Warning, continúa con confirmación)

| Gate | Condición | Acción |
|------|-----------|--------|
| `W1_IMAGE_LOW_RES` | Imagen < 1080px en dimensión mayor | Advertir pero continuar |
| `W2_CAPTION_LONG` | Caption IG > 2,200 chars | Sugerir recorte |
| `W3_NO_HASHTAGS` | Menos de 3 hashtags detectados | Sugerir agregar |
| `W4_SESSION_OLD` | Sesión tiene > 7 días | Sugerir refresh |

### Gates de Confirmación Manual

```
[CONFIRM] Plataformas a publicar:
   - Threads:    API (automático)
   - Instagram:  Browser automation (requiere Chrome)
   - X:           Browser automation (requiere Chrome)
   - LinkedIn:    Browser automation (requiere sesión admin)

[CONFIRM] Pieza: P1_001
[CONFIRM] Assets validados: 3 imágenes encontradas

¿Proceder con publicación REAL? (Y/N): _
```

---

## Qué Plataformas Corren Hoy

### ✅ Operativas (Ready for Production) - MVP REAL

| Plataforma | Método | Script | Estabilidad |
|------------|--------|--------|-------------|
| **Threads** | Graph API | `threads_publish_post.py` | Alta - API directo |
| **Instagram** | Browser automation | `ig_publish_post.py` | Media - UI frágil, requiere sesión manual |
| **X** | Browser automation | `x_publish_post.py` | Media - UI frágil, requiere sesión manual |

> **NOTA:** LinkedIn está FUERA del MVP real. Requiere app verificada (bloqueada por email de negocio).

### ⚠️ Parciales (Requieren intervención manual)

| Plataforma | Estado | Bloqueador |
|------------|--------|------------|
| **YouTube** | Semi-manual | Upload de video requiere interfaz |
| **TikTok** | No publicación | Perfil incompleto, sin API access |

### ❌ No Disponibles (Fuera de MVP)

| Plataforma | Estado | Razón |
|------------|--------|-------|
| **LinkedIn** | Bloqueada | App "FG Community Manager" no verificada (pendiente MX records) |
| **TikTok** | Sin publicación | Perfil incompleto, sin API access |
| **Facebook** | No iniciado | No priorizado en estrategia |

---

## Qué Se Omite (Out of Scope)

### Excluido del Control Plane Local

| Elemento | Razón | Status |
|----------|-------|--------|
| Generación de imágenes | No se produce contenido nuevo | 🔴 Bloqueado por directiva |
| Edición de video/audio | No se produce contenido nuevo | 🔴 Bloqueado por directiva |
| Thumbnail flow | Explicitamente excluido | 🔴 Bloqueado por directiva |
| Asset Ops reorganization | Explicitamente excluido | 🔴 Bloqueado por directiva |
| Website deployment | Explicitamente excluido | 🔴 Bloqueado por directiva |
| Monetización setup | Explicitamente excluido | 🔴 Bloqueado por directiva |
| EP_001 producción | Explicitamente excluido | 🔴 Bloqueado por directiva |
| LinkedIn/TikTok setup | Explicitamente excluido | 🔴 Bloqueado por directiva |
| **Bridge/Tunnel n8n** | No viable - URL dinámica cambia cada restart | 🔴 No operativo |

---

## Qué Queda Listo para n8n (TEÓRICO - No implementado)

> **IMPORTANTE:** La migración a n8n NO está activa. Las especificaciones siguientes son aspiracionales.
> **BLOQUEADOR CRÍTICO:** El bridge/tunnel tiene URL dinámica que cambia con cada restart de cloudflared.
> Esto hace que cualquier integración n8n→local sea inestable y no viable para producción.

### Componentes Migrables

| Componente | Estado Actual | Preparación n8n |
|------------|---------------|-----------------|
| **Threads Publisher** | Script Python funcional | HTTP Request node con token |
| **Image Hosting** | litterbox.catbox.moe | Mismo approach en n8n HTTP |
| **PublishReady Parser** | Regex en Python | Function node o Code node |
| **Asset Discovery** | Pathlib glob | n8n Read Binary Files |
| **Dry-run Logic** | Boolean flag en scripts | IF nodes en workflow |
| **Logging/Tracing** | fg_debug.py NDJSON | n8n Execution log nativo |

### Workflows n8n Objetivo (FUTURO - Ver detalle en N8N_MIGRATION_SPEC.md)

> **ESTADO:** No implementado. Requiere resolver bloqueadores primero.

1. **WF-PUBLISH-MASTER**: Orquestador principal (ASPIRACIONAL)
2. **WF-THREADS-PUBLISH**: HTTP API a Threads (ÚNICO viable hoy)
3. **WF-INSTAGRAM-PUBLISH**: HTTP API (BLOQUEADO - necesita Business Account)
4. **WF-X-PUBLISH**: API o Bridge (API costosa, Bridge inestable)
5. **WF-LINKEDIN-PUBLISH**: HTTP API (BLOQUEADO - app no verificada)

---

## Diagrama de Flujo del Control Plane

```
                    ┌─────────────────┐
                    │   INICIO       │
                    │  Pieza lista   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ FASE 1: Entorno │
                    │  Validar secrets │
                    │  Validar sesiones│
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │ PASS           │           FAIL   │
            ▼                │                ▼
    ┌──────────────┐         │        ┌──────────────┐
    │ FASE 2: Pieza │         │        │  G1-G6 Stop   │
    │  PublishReady │         │        │  Mostrar error│
    │  Assets       │         │        │  Salir        │
    └────────┬──────┘         │        └──────────────┘
             │                │
    ┌────────┼────────┐       │
    │ PASS   │  FAIL  │       │
    ▼        │        ▼       │
┌───────┐    │   ┌─────────┐ │
│ FASE 3 │    │   │ G2-G4   │ │
│Plataf. │    │   │  Stop   │ │
│ Dry-run│    │   └─────────┘ │
└───┬───┘    │               │
    │        │               │
    ▼        │               │
┌─────────────────┐          │
│  FASE 4:        │          │
│  Confirmación   │◄─────────┘
│  Manual         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌───────────────┐
│ Publicación     │────►│  Logging      │
│ Secuencial      │     │  NDJSON       │
└─────────────────┘     └───────────────┘
         │
         ▼
┌─────────────────┐
│   FIN: Pieza    │
│   PUBLICADA     │
└─────────────────┘
```

---

## Archivos de Configuración

### Locales (Pre-n8n)

| Archivo | Propósito |
|---------|-----------|
| `.env.local` | Secrets locales (no commiteado) |
| `.chrome-*/` | Perfiles Chrome persistentes |
| `scripts/fg_automation_config.py` | Configuración compartida |
| `system/memory/STATE_PROJECT.json` | Estado centralizado |

### n8n (Futuro - No implementado)

> **NOTA:** Requiere resolver bloqueo del bridge (URL dinámica) primero.

| Recurso | Tipo | Descripción |
|---------|------|-------------|
| `THREADS_ACCESS_TOKEN` | Credential | Token de Threads API |
| `BRIDGE_URL` | Variable | URL del bridge local - **BLOQUEADA**: cambia con cada restart |
| `FG_PUBLISH_WEBHOOK` | Webhook | Entry point de publicación |

---

## Referencias

- Scripts: `c:\Users\farid\Documents\Frecuencia Global\scripts\`
- Contrato de Publicación: `07_Operaciones/PUBLISHING_CONTRACT.md`
- Matrix de Plataformas: `07_Operaciones/PLATFORM_READINESS_MATRIX.md`
- Especificación n8n: `08_n8n/N8N_MIGRATION_SPEC.md`
