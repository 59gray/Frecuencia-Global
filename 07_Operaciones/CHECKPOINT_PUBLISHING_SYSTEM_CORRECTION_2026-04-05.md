# CHECKPOINT: Publishing System Correction Pass
**Fecha:** 2026-04-05  
**Pass:** PUBLISHING_SYSTEM_CORRECTION_PASS  
**Estado:** COMPLETADO ✅

---

## Resumen Ejecutivo

Corrección completa del sistema documental/operativo para reflejar el **estado real** del sistema de publicación. Se eliminó la falsa sensación de readiness y se fijó el MVP real de publicación.

---

## Cambios por Archivo

### 1. PLATFORM_READINESS_MATRIX.md

| Sección | Cambio |
|---------|--------|
| Resumen Ejecutivo | LinkedIn: 🟡→🔴 Bloqueada (no disponible) |
| X (Twitter) | Aptitud n8n: 🟡→🔴 No viable (bridge inestable) |
| LinkedIn detalle | Estado: 🟡→🔴 Bloqueada, prioridad: Media→Baja |
| MVP Real | Quitar LinkedIn, agregar nota de exclusión |
| Recomendaciones | Reorganizar según nuevo MVP (3 plataformas) |

**Bloqueadores documentados:**
- LinkedIn: App "FG Community Manager" no verificada (pendiente MX records)
- X: API costosa $100/mes, bridge dinámico no viable
- Instagram: Requiere Business Account para API

---

### 2. PUBLISHING_CONTRACT.md

| Sección | Cambio |
|---------|--------|
| `plataformas_target` | Ejemplo: `["instagram", "x", "linkedin", "threads"]`→`["instagram", "x", "threads"]` |
| LinkedIn Assets | Marcado como "(FUTURO - No disponible)" |
| TikTok sección | Marcado como "(FUTURO - No disponible)" |
| Extensiones n8n | Marcado como "(FUTURO - No implementado)" con alertas |
| Payload entrada | Plataformas reducidas a solo `threads` como viable |
| Payload salida | Nota: "MVP REAL: Solo Threads vía API" |

---

### 3. LOCAL_CONTROL_PLANE.md

| Sección | Cambio |
|---------|--------|
| Fase 3 (Validación) | LinkedIn: Agregada nota "FUERA DE MVP" |
| Fase 4 (Ejecución) | Orden: Quitado LinkedIn de secuencia |
| Operativas Ready | Título: "MVP REAL", quitado LinkedIn de lista |
| No Disponibles | Agregado LinkedIn y TikTok con razones |
| Out of Scope | Agregado "Bridge/Tunnel n8n" como no operativo |
| Listo para n8n | Marcado como "TEÓRICO - No implementado" |
| Workflows n8n | Marcados como "FUTURO", con bloqueadores |
| n8n Recursos | Nota: "Requiere resolver bloqueo del bridge primero" |

**Scripts verificados existen:**
- `load_local_secrets.ps1` ✅
- `preflight.py` ✅
- `instagram_preflight.ps1` ✅
- `x_preflight.ps1` ✅
- `linkedin_preflight.ps1` ✅ (pero no operativo)

---

### 4. N8N_MIGRATION_SPEC.md

| Sección | Cambio |
|---------|--------|
| Título | Agregado "ASPIRACIONAL" y "No activa" |
| Alerta crítica | Bloqueador: URL dinámica del bridge |
| WF-002 Threads | Nota: Único viable pero migración no priorizada |
| WF-004 IG Bridge | Marcado como "NO VIABLE", veredicto: no implementar |
| WF-005 X Bridge | Marcado como "NO VIABLE", veredicto: mantener local |
| WF-006 LinkedIn | Marcado como "BLOQUEADO", veredicto: fuera de MVP |
| Bridge/Interino | Notas: "NO VIABLE / BLOQUEADO" |
| Dependencias | Cloudflare Tunnel: "NO VIABLE" |
| Secuencia migración | Marcada como "FUTURO - No activa" |

**Veredicto Bridge documentado:**
> "No viable para producción. La URL dinámica del Cloudflare Tunnel hace que cualquier integración n8n Cloud → local sea inestable y requería actualización manual en cada restart."

---

## MVP Real Definitivo

### Plataformas Operativas (3):
1. **Threads** - API directo ✅ (única ruta API sólida)
2. **Instagram** - Browser automation manual 🟡
3. **X** - Browser automation manual 🟡

### Plataformas Bloqueadas (4):
- **LinkedIn:** App no verificada (pendiente MX records)
- **TikTok:** Perfil incompleto, sin API access
- **Facebook:** No iniciado
- **YouTube:** Flujo semi-manual

---

## Frontera Local vs n8n

| Aspecto | Local (Hoy) | n8n (Futuro) |
|---------|-------------|--------------|
| **Operación** | 100% local scripts Python | NO VIABLE - Bridge dinámico |
| **Threads** | `threads_publish_post.py` | WF-002 posible pero no priorizado |
| **Instagram** | `ig_publish_post.py` | Bloqueado: Business Account + bridge |
| **X** | `x_publish_post.py` | Bloqueado: API costosa o bridge inestable |
| **LinkedIn** | Script existe pero sin app | Bloqueado: App no verificada |
| **Orquestación** | `run_publish_test.py` | No implementar hasta resolver bridge |

**Veredicto:** Mantener operación 100% local indefinidamente. Evaluar n8n solo si:
1. Se resuelve URL estática para bridge, O
2. Instagram se convierte a Business Account (para API directa), O
3. Se decide pagar API de X ($100/mes)

---

## Scripts/Comandos a Verificar Después

### Pre-flight (Todos existen):
```powershell
# Validación de entorno
.\scripts\load_local_secrets.ps1
python -c "from playwright.sync_api import sync_playwright; print('OK')"

# Verificar sesiones persistentes
Test-Path .\.chrome-x-stable\
Test-Path .\.chrome-ig-stable\

# Validación de pieza
python scripts\preflight.py --pieza P1_001
```

### Publicación por plataforma:
```powershell
# Threads (API - más confiable)
python scripts\threads_publish_post.py --pieza P1_001 --dry-run
python scripts\threads_publish_post.py --pieza P1_001              # Real

# Instagram (Browser automation manual)
python scripts\ig_publish_post.py --pieza P1_001 --dry-run
python scripts\ig_publish_post.py --pieza P1_001                   # Real

# X (Browser automation manual)
python scripts\x_publish_post.py --pieza P1_001 --dry-run
python scripts\x_publish_post.py --pieza P1_001                     # Real

# LinkedIn - NO USAR (bloqueado)
# python scripts\linkedin_publish_post.py --pieza P1_001  # FUERA DE MVP
```

### NO disponibles:
- TikTok: `tk_publish_post.py` existe pero no operativo
- LinkedIn API: App no verificada

---

## Bloqueadores Activos

| Bloqueador | Impacto | Solución potencial |
|------------|---------|-------------------|
| Cloudflare Tunnel URL dinámica | 🔴 Alto - Imposibilita bridge n8n | Tunnel persistente pago, o VPN, o VPS |
| LinkedIn App verification | 🟡 Medio - Fuera de MVP | Esperar merge MX records is-a.dev |
| Instagram Business Account | 🟡 Medio - Bloquea Graph API | Convertir @globalfrequency.es a Business |
| X API costosa | 🟡 Medio - $100/mes | Evaluar si volumen justifica costo |

---

## Próximos Pasos Recomendados

1. **No iniciar migración n8n** hasta resolver bloqueadores
2. **Operar 100% local** con los 3 scripts de MVP
3. **Documentar flujos manuales** para Instagram y X
4. **Monitorear** MX records para desbloquear LinkedIn (baja prioridad)
5. **Evaluar** si volumen de contenido justifica X API Basic ($100/mes)

---

## Referencias

- `07_Operaciones/PLATFORM_READINESS_MATRIX.md` - Estado real de plataformas
- `07_Operaciones/PUBLISHING_CONTRACT.md` - Contrato canónico corregido
- `07_Operaciones/LOCAL_CONTROL_PLANE.md` - Control plane local actual
- `08_n8n/N8N_MIGRATION_SPEC.md` - Especificación aspiracional (no activa)

---

*Generado automáticamente por PUBLISHING_SYSTEM_CORRECTION_PASS*
