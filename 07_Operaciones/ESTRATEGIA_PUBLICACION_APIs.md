# Estrategia de Publicación — Frecuencia Global

**Fecha:** 2026-04-04  
**Estado:** Post-M1, Priorizando APIs

---

## Resumen Ejecutivo

| Plataforma | Método Actual | Estado | Decisión |
|------------|---------------|--------|----------|
| **X/Twitter** | Browser Automation | ✅ Operativo | Mantener - API paga ($100/mes) |
| **LinkedIn** | Browser Automation | ✅ Operativo | Mantener - API requiere partnership |
| **Instagram** | Browser Automation | ✅ Operativo | **Principal:** Browser. **API:** Bloqueada por tipo de cuenta |
| **Threads** | Graph API | ✅ Operativo | **Mantener API** - ya funciona |
| **TikTok** | Browser Automation | ⏸️ STANDBY | Esperando autorización cuenta |
| **Facebook** | — | ❌ No iniciado | No prioritario post-M1 |

---

## Instagram: Decisión Táctica

### Situación Actual
- Cuenta: @globalfrequency.es (tipo: **Personal**)
- Graph API requiere: Business Account o Creator Account
- Browser automation: Operativo con `ig_publish_post.py`

### Opciones Evaluadas

| Opción | Pros | Contras | Decisión |
|--------|------|---------|----------|
| **A. Convertir a Business/Creator** | Acceso a Graph API, analytics, programación | Pierde características personales, requiere verificación, proceso irreversible | ❌ No hoy - decisión de negocio |
| **B. Mantener browser automation** | Funciona ahora, sin cambios de cuenta, control total | Requiere Chrome real, más frágil que API | ✅ **Mantener como método principal** |

### Decisión
**Mantener browser automation como método principal indefinidamente.**

La conversión a Business/Creator es una decisión de estrategia de marca, no técnica. El browser automation está operativo y probado (P1_001 publicado exitosamente). No hay urgencia para migrar a API.

**Scripts consolidados:**
- ✅ Principal: `scripts/ig_publish_post.py` (browser automation)
- ✅ Backup: `scripts/ig_publish_chrome_real.py` (variante Chrome real)
- 🗑️ Archivados: 5 scripts de token exploration en `scripts/_archive/ig_token_exploration/`

---

## Threads: API Operativa

### Configuración Actual
- **App:** Frecuencia Global Publisher (App ID: 1227523599160977)
- **Token:** Válido, permisos `threads_basic`, `threads_content_publish`
- **Post P1_001:** Publicado (ID: 18216358396316291)

### Requisitos para usar
```bash
# Opción 1: Variable de entorno
export THREADS_ACCESS_TOKEN=your_token_here

# Opción 2: Flag en comando
python scripts/threads_publish_post.py --pieza P1_001 --token YOUR_TOKEN
```

### Template creado
`/.env.example` - contiene estructura de variables para todas las APIs.

---

## TikTok: En STANDBY

### Razón
Esperando autorización de cuenta / domain verification.

### Estado Scripts
- ✅ `scripts/tk_chrome_login.py` - Listo
- ✅ `scripts/tk_publish_post.py` - Listo
- ✅ Assets P1_001 generados

### Bloqueador
Autorización externa - no hay acción técnica posible.

---

## Checklist Consolidación Realizada (2026-04-04)

- [x] Scripts IG duplicados identificados (5 archivos)
- [x] Scripts archivados en `scripts/_archive/ig_token_exploration/`
- [x] TIKTOK_Status_Report.md actualizado con estado STANDBY
- [x] Template `.env.example` creado para credenciales APIs
- [x] Estrategia Instagram documentada (browser automation principal)

---

## Próximos Pasos

### Cuando se autorice TikTok:
1. Ejecutar `python scripts/tk_chrome_login.py`
2. Publicar P1_001: `python scripts/tk_publish_post.py --pieza P1_001`
3. Actualizar estado a OPERATIVO

### Para Threads (ya operativo):
1. Copiar `.env.example` a `.env`
2. Completar `THREADS_ACCESS_TOKEN`
3. Publicar: `python scripts/threads_publish_post.py --pieza P1_001`

### Para Instagram (sin cambios):
1. Continuar usando: `python scripts/ig_publish_post.py --pieza P1_001`
2. Decisión de conversión a Business/Creator: **diferida indefinidamente**

---

*Documento generado durante jornada técnica 2026-04-04*
