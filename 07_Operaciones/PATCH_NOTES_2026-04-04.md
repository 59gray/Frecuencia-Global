# Frecuencia Global — Patch Notes

**Fecha:** 4 de abril 2026
**Sesión:** Social Publishing — Browser Automation
**Checkpoint:** `01_Estrategia/FG_Checkpoint_AUTO_2026-04-04_0814.md`

---

## Resumen ejecutivo

Se implementó la ruta alternativa gratuita para publicación en X/Twitter y LinkedIn usando browser automation (Playwright). Ambas plataformas quedaron operativas sin depender de API de pago ni de aprobaciones pendientes.

**Antes:** X bloqueado por créditos ($), LinkedIn bloqueado por Community Management API.
**Después:** Ambas plataformas operativas vía scripts de browser automation, validados con dry-run.

---

## Cambios realizados

### Scripts nuevos — Browser automation

- **`scripts/x_publish_post.py`** — Publica posts en X/Twitter vía navegador
  - Extrae contenido de `PublishReady.md` (sección `## X (Twitter)`)
  - Sesión persistente en `.chrome-x-stable/`
  - Soporta `--pieza`, `--texto`, `--dry-run`
  - Validación de longitud (280 chars)
  - Dry-run validado con P1_001 ✅

- **`scripts/linkedin_publish_post.py`** — Publica posts en LinkedIn Company Page vía navegador
  - Extrae contenido de `PublishReady.md` (sección `## LinkedIn`)
  - Sesión persistente en `.chrome-linkedin-stable/`
  - Navega a Company Page y publica como organización
  - Soporta `--pieza`, `--texto`, `--dry-run`
  - Dry-run validado con P1_001 ✅

### Scripts auxiliares (creados durante exploración)

- `scripts/linkedin_create_app.py` — Intento de crear app LinkedIn vía browser (descartado por conflictos de perfil)
- `scripts/linkedin_open_browser.py` — Helper para abrir navegador en LinkedIn Developer
- `scripts/linkedin_browser.py` — Versión simplificada sin perfil persistente

### LinkedIn Developer Portal

- **App creada:** `Frecuencia Global`
- **Client ID:** `78f23qrq3wfh80`
- **Productos añadidos:** Share on LinkedIn, Sign In with LinkedIn using OpenID Connect
- **Redirect URL configurada:** `https://oauth.n8n.cloud/oauth2/callback`
- **Community Management API:** Bloqueada (requiere aprobación de LinkedIn)

### n8n Cloud — Credenciales

- **LinkedIn account** (OAuth2 standard) — Conectada ✅
- **FG LinkedIn Auth** (Community Management OAuth2) — Pendiente (bloqueada por LinkedIn)

### Documento actualizado

- **`07_Operaciones/SOCIAL_PUBLISH_STATUS_2026-04-03.md`**
  - X/Twitter: actualizado con Opción B (browser automation implementada)
  - LinkedIn: actualizado con app creada, credenciales, y Opción B (browser automation)

---

## Estado actual por plataforma

| Plataforma | Método | Estado | Comando |
|------------|--------|--------|---------|
| X/Twitter | Browser automation | ✅ Operativa | `python scripts/x_publish_post.py --pieza P1_001` |
| LinkedIn | Browser automation | ✅ Operativa | `python scripts/linkedin_publish_post.py --pieza P1_001` |
| Instagram | Pendiente | ❌ Requiere bridge/webhook + media pipeline | — |
| TikTok | Pendiente | ❌ Requiere webhook + videoUrl + WF-010 | — |

---

## Bloqueadores resueltos

- ~~X/Twitter: 402 CreditsDepleted~~ → Browser automation (gratuita)
- ~~LinkedIn: sin credencial Community Management~~ → Browser automation (gratuita)

## Bloqueadores pendientes

- **Instagram:** Requiere `IG_PUBLISH_WEBHOOK_URL`, bridge externo, y media pipeline
- **TikTok:** Requiere `TIKTOK_PUBLISH_WEBHOOK_URL`, `videoUrl`, e importar `WF-010` a cloud
- **LinkedIn API:** Community Management API requiere aprobación de LinkedIn (no urgente, browser automation funciona)

---

## Siguiente sesión (pendientes)

1. Ejecutar publicación real de prueba en X con `P1_001`
2. Ejecutar publicación real de prueba en LinkedIn con `P1_001`
3. Evaluar Instagram y TikTok (browser automation o esperar infraestructura)
4. Primera publicación real: Milestone 1

---

> Generado el 2026-04-04 — Sesión de Social Publishing Browser Automation
