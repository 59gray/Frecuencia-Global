# FG Platform Readiness Matrix
## Estado Real de Plataformas de Publicación

**Versión:** 1.0
**Fecha:** 2026-04-05
**Ámbito:** FG_PUBLISHING_SYSTEM_READINESS

---

## Resumen Ejecutivo

| Plataforma | Estado | Método | Publicación Real | Migración n8n |
|------------|--------|--------|------------------|---------------|
| X (Twitter) | 🟡 Funcional | Browser automation | ✅ Disponible | � API costosa ($100/mes) - Bridge no viable |
| Instagram | 🟡 Funcional | Browser automation | ✅ Disponible | 🔴 Requiere Business Account |
| Threads | 🟢 Operativa | Graph API | ✅ Disponible | 🟢 Lista para migración |
| LinkedIn | � Bloqueada | N/A | ❌ No disponible | � App pendiente verificación email |
| TikTok | 🔴 Bloqueada | N/A | ❌ No disponible | 🔴 Pendiente setup |
| YouTube | 🟡 Parcial | API/CDP híbrido | ⚠️ Manual parcial | 🟡 Requiere OAuth completo |
| Facebook | 🔴 No iniciada | N/A | ❌ No disponible | 🔴 Pendiente |

---

## Matriz Detallada

### 1. X (Twitter)

| Atributo | Valor |
|----------|-------|
| **Plataforma** | X (Twitter) |
| **Estado Actual** | 🟡 Funcional vía browser automation (MANUAL) |
| **Método Actual** | Playwright + Chrome persistente `.chrome-x-stable/` |
| **Script Principal** | `scripts/x_publish_post.py` |
| **Credenciales Requeridas** | Username/password (sesión persistente) |
| **Credenciales Faltantes** | API Key + API Secret ($100/mes) |
| **Dry-run Disponible** | ✅ `--dry-run` valida texto y longitud |
| **Publicación Real Disponible** | ✅ Sí, con sesión activa |
| **Bloqueadores** | Selectores UI frágiles; API costosa; Bridge no viable (tunnel dinámico) |
| **Prioridad** | Media |
| **Aptitud para n8n** | � No viable - requiere API paga o bridge dinámico inestable |

**Notas Operativas:**
- Script usa `x.com/compose/tweet` con selectores data-testid
- Soporta `--pieza` (desde PublishReady) o `--texto` directo
- Límite: 280 caracteres validado localmente
- Última ejecución conocida: P1_001 publicado exitosamente

---

### 2. Instagram

| Atributo | Valor |
|----------|-------|
| **Plataforma** | Instagram |
| **Estado Actual** | 🟡 Funcional vía browser automation |
| **Método Actual** | Playwright + Chrome persistente `.chrome-ig-stable/` |
| **Script Principal** | `scripts/ig_publish_post.py` |
| **Credenciales Requeridas** | Sesión web activa (cookies) |
| **Credenciales Faltantes** | IG_ACCESS_TOKEN + IG_USER_ID (Graph API) |
| **Dry-run Disponible** | ✅ Valida caption e imagen sin publicar |
| **Publicación Real Disponible** | ✅ Sí, P1_001 publicado 2026-04-04 |
| **Bloqueadores** | Cuenta personal (no Business/Creator) - Graph API requiere conversión |
| **Prioridad** | Alta |
| **Aptitud para n8n** | 🔴 Bloqueada hasta conversión Business + token permanente |

**Notas Operativas:**
- Browser automation: Upload directo de imagen + caption paste vía clipboard
- API alternativa: `scripts/ig_api_publish.py` preparado pero sin credenciales válidas
- Requiere cuenta Business o Creator para Graph API
- Imagen: Busca archivos con "IG" en nombre, fallback a cualquier imagen

---

### 3. Threads

| Atributo | Valor |
|----------|-------|
| **Plataforma** | Threads |
| **Estado Actual** | 🟢 Operativa vía Graph API |
| **Método Actual** | HTTP API directo a graph.threads.net |
| **Script Principal** | `scripts/threads_publish_post.py` |
| **Credenciales Requeridas** | THREADS_ACCESS_TOKEN (funcionando) |
| **Credenciales Faltantes** | Ninguna - sistema operativo |
| **Dry-run Disponible** | ✅ Valida texto e imagen sin crear container |
| **Publicación Real Disponible** | ✅ Sí, P1_001 publicado (ID: 18216358396316291) |
| **Bloqueadores** | Ninguno identificado |
| **Prioridad** | Alta (ya operativa) |
| **Aptitud para n8n** | 🟢 Lista - HTTP Request node con token |

**Notas Operativas:**
- Flujo: Upload imagen a litterbox.catbox.moe (72h) → Create container → Publish
- Extrae contenido desde sección Threads/Instagram/TikTok de PublishReady
- Limitación: 500 caracteres de texto
- User ID: 26618714181055427 (@globalfrequency.es)
- App: "Frecuencia Global Publisher" (ID: 1227523599160977)

---

### 4. LinkedIn

| Atributo | Valor |
|----------|-------|
| **Plataforma** | LinkedIn Company Page |
| **Estado Actual** | � Bloqueada - No disponible para producción |
| **Método Actual** | N/A - App pendiente verificación |
| **Script Principal** | `scripts/linkedin_publish_post.py` (existe pero sin app aprobada) |
| **Credenciales Requeridas** | N/A - Sin capacidad de publicación |
| **Credenciales Faltantes** | OAuth2 tokens (bloqueado por verificación email de negocio) |
| **Dry-run Disponible** | ❌ No aplicable |
| **Publicación Real Disponible** | ❌ No - App no verificada |
| **Bloqueadores** | Email de negocio pendiente (MX records en espera); sin API aprobada |
| **Prioridad** | Baja (fuera de MVP) |
| **Aptitud para n8n** | � Bloqueada hasta app "FG Community Manager" verificada |

**Notas Operativas:**
- Company Page: frecuencia-global
- App creada: "FG Community Manager" (Client ID: 78yndcu04v1m7)
- Bloqueada por verificación de email de negocio (pendiente MX records)
- Límite: 3000 caracteres
- Publica en Company Page, no perfil personal

---

### 5. TikTok

| Atributo | Valor |
|----------|-------|
| **Plataforma** | TikTok |
| **Estado Actual** | 🔴 Bloqueada - Perfil incompleto |
| **Método Actual** | N/A - Sin capacidad de publicación |
| **Script Principal** | `scripts/tk_publish_post.py` (preparado, no operativo) |
| **Credenciales Requeridas** | N/A |
| **Credenciales Faltantes** | TikTok API access + Business Account |
| **Dry-run Disponible** | ❌ No disponible |
| **Publicación Real Disponible** | ❌ No disponible |
| **Bloqueadores** | Perfil no configurado; dominio verificado pero flujo incompleto |
| **Prioridad** | Baja (según directivas) |
| **Aptitud para n8n** | 🔴 No iniciada |

**Notas Operativas:**
- Cuenta existe (@frecuenciaglobal) pero perfil incompleto
- Scripts de profile automation disponibles pero no priorizados
- Sin capacidad real de publicación de contenido

---

### 6. YouTube

| Atributo | Valor |
|----------|-------|
| **Plataforma** | YouTube (Videos/Shorts) |
| **Estado Actual** | 🟡 Parcial - Setup complejo |
| **Método Actual** | API híbrido + CDP para Studio |
| **Script Principal** | `scripts/youtube_studio_config_cdp.py` |
| **Credenciales Requeridas** | client_secret.json + OAuth refresh token |
| **Credenciales Faltantes** | Refresh token permanente en producción |
| **Dry-run Disponible** | ⚠️ Parcial (preflight checks) |
| **Publicación Real Disponible** | ⚠️ Semi-manual (subida + metadata API) |
| **Bloqueadores** | OAuth flow requiere intervención manual para refresh token |
| **Prioridad** | Baja (según directivas) |
| **Aptitud para n8n** | 🟡 Requiere OAuth2 credentials node configurado |

**Notas Operativas:**
- Canal creado y configurado
- API: Metadata editable, pero upload de video requiere subida manual o SDK
- Scripts de Studio automation (banner, links) disponibles pero frágiles

---

### 7. Facebook

| Atributo | Valor |
|----------|-------|
| **Plataforma** | Facebook Page |
| **Estado Actual** | 🔴 No iniciada |
| **Método Actual** | N/A |
| **Script Principal** | Ninguno |
| **Credenciales Requeridas** | N/A |
| **Credenciales Faltantes** | Todas |
| **Dry-run Disponible** | ❌ No |
| **Publicación Real Disponible** | ❌ No |
| **Bloqueadores** | No priorizado en estrategia actual |
| **Prioridad** | Muy baja |
| **Aptitud para n8n** | 🔴 No iniciada |

---

## Gaps Reales Detectados

| Gap | Impacto | Acción Requerida |
|-----|---------|------------------|
| Instagram Business Account | 🔴 Alto | Convertir @globalfrequency.es a Business/Creator |
| LinkedIn App Verification | 🟡 Medio | Esperar MX records para email de negocio |
| X API Credentials | 🟡 Medio | Comprar X API Basic ($100/mes) o mantener browser |
| TikTok Publicación | 🟡 Medio | Completar perfil + solicitar API access |
| YouTube OAuth Permanente | 🟡 Medio | Configurar refresh token automatizado |
| Image Hosting Estable | 🟡 Medio | Dependencia de litterbox.catbox.moe (72h) |

---

## MVP de Publicación (Hoy) - REAL

> **IMPORTANTE:** Solo 3 plataformas forman parte del MVP operativo real.
> LinkedIn y TikTok están FUERA del MVP hasta desbloqueo de APIs.

### Plataformas Operativas para Producción:
1. **Threads** - API directo, más confiable ✅
2. **Instagram** - Browser automation funcional (requiere sesión manual) 🟡
3. **X** - Browser automation funcional (requiere sesión manual) 🟡

### Plataformas NO Disponibles (Fuera de MVP):
- **LinkedIn:** Bloqueada - App no verificada (email de negocio pendiente)
- **TikTok:** Sin capacidad de publicación
- **Facebook:** No iniciado
- **YouTube:** Flujo semi-manual

---

## Recomendaciones de Prioridad

### Inmediata (Pre-producción):
1. Validar `--dry-run` para plataformas MVP (Threads, Instagram, X)
2. Documentar flujos de sesión persistente

### Corto plazo (Evaluación, no migración forzada):
1. **Threads:** HTTP Request workflow (listo, evaluar prioridad real)
2. **Instagram:** Aguardar Business Account + token (bloqueado)
3. **LinkedIn:** Esperar app verification (fuera de MVP, baja prioridad)

### Mediano plazo:
1. **X:** Evaluar costo/beneficio de API vs mantener manual local
2. **TikTok:** Completar perfil o descartar de MVP

---

## Referencias

- Scripts: `c:\Users\farid\Documents\Frecuencia Global\scripts\`
- n8n Workflows: `c:\Users\farid\Documents\Frecuencia Global\08_n8n\workflows_cloud\`
- PublishReady Template: `c:\Users\farid\Documents\Frecuencia Global\04_Produccion\*_PublishReady.md`
