# Resumen Jornada 2026-04-04 — Estado Frecuencia Global

**Hora cierre:** 2026-04-04 ~19:40 UTC-6  
**Enfoque:** Priorizar APIs, dejar TikTok en STANDBY

---

## Acciones Completadas

| # | Acción | Estado | Archivo/Resultado |
|---|--------|--------|-------------------|
| 1 | TikTok en STANDBY | ✅ | `07_Operaciones/TIKTOK_Status_Report.md` actualizado |
| 2 | Scripts IG archivados | ✅ | 5 scripts movidos a `scripts/_archive/ig_token_exploration/` |
| 3 | Template .env creado | ✅ | `/.env.example` con estructura Threads/Instagram APIs |
| 4 | Estrategia documentada | ✅ | `07_Operaciones/ESTRATEGIA_PUBLICACION_APIs.md` creado |

---

## Estado Plataformas Post-Jornada

| Plataforma | Método | Estado | Acción Requerida |
|------------|--------|--------|------------------|
| **X/Twitter** | Browser | ✅ | Ninguna - operativo |
| **LinkedIn** | Browser | ✅ | Ninguna - operativo |
| **Instagram** | Browser | ✅ | Ninguna - operativo |
| **Threads** | Graph API | ✅ | Configurar `THREADS_ACCESS_TOKEN` en `.env` |
| **TikTok** | Browser | ⏸️ STANDBY | Esperar autorización cuenta |
| **Facebook** | — | ❌ | No prioritario |

---

## Scripts Consolidados

**Publicación activos:**
- `scripts/ig_publish_post.py` (principal operativo)
- `scripts/threads_publish_post.py` (API - necesita token)
- `scripts/x_publish_post.py` (browser)
- `scripts/linkedin_publish_post.py` (browser)
- `scripts/tk_publish_post.py` (browser - STANDBY)

**Archivados (5 scripts):**
- `scripts/_archive/ig_token_exploration/`
  - `configure_ig_token.py`
  - `get_ig_token_auto.py`
  - `get_ig_token_from_chrome.py`
  - `get_ig_token_manual.py`
  - `ig_api_publish.py`

---

## Bloqueadores Actuales

| Bloqueador | Tipo | Workaround |
|------------|------|------------|
| TikTok autorización | Externo | STANDBY - scripts listos para cuando se autorice |
| Instagram Graph API | Estratégico | Usar browser automation (ya operativo) |
| Threads token config | Técnico | Completar `.env` con `THREADS_ACCESS_TOKEN` |

---

## Próxima Acción Recomendada

**Para reactivar Threads API:**
```bash
# 1. Copiar template
cp .env.example .env

# 2. Editar .env con token real
THREADS_ACCESS_TOKEN=your_actual_token_here

# 3. Probar publicación
python scripts/threads_publish_post.py --pieza P1_001
```

**Para reactivar TikTok cuando se autorice:**
```bash
python scripts/tk_chrome_login.py
python scripts/tk_publish_post.py --pieza P1_001
```

---

## Notas Técnicas

- **Lints markdown:** Warnings menores sobre formato de tablas en documentos. No afectan contenido ni funcionalidad.
- **Chrome real:** Todos los scripts de browser automation usan Chrome real (`headless=False`) como solicitado.
- **APIs vs Browser:** Estrategia clara - Threads usa API, resto usa browser automation hasta que APIs sean viables.

---

*Resumen generado automáticamente post-jornada 2026-04-04*
