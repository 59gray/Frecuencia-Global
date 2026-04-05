# TIKTOK — Status Report

**Sistema:** Frecuencia Global
**Fecha:** 2026-04-01
**Jornada:** Hardening técnico TikTok
**Autor:** Agente técnico (Copilot)

---

## A. ESTADO ACTUAL DE TIKTOK

| Dimensión | Estado | Detalle |
|-----------|--------|---------|
| **Cuenta** | ✅ Activa | Handle real confirmado: `@frecuenciaglobal` |
| **Contenido** | ❌ Vacío | 0 publicaciones |
| **Perfil** | ⚠️ Incompleto | En publico: sin bio y sin foto de marca aplicada |
| **Assets** | ✅ Completos | Foto de perfil, cover base/QA y overlays (minimal + full en 4 pilares) disponibles |
| **Documentación** | ✅ Completa | 4 documentos operativos creados |
| **Integración** | ⚠️ Parcial | Website correcto, Figma/Canva en spec no ejecutada, n8n sin workflows |
| **Pruebas** | ❌ No iniciadas | Sin uploads privados ni validaciones en device |

**Estado general: PARCIALMENTE LISTO PARA PRUEBAS — falta subir primer test privado y cerrar perfil (bio + link).**

---

## B. CAMBIOS REALIZADOS EN ESTA JORNADA

### Documentos creados

| # | Archivo | Ubicación | Contenido |
|---|---------|-----------|-----------|
| 1 | `TIKTOK_Asset_Specs.md` | `02_Brand_System/` | Specs de perfil, video, safe zones, overlay, subtítulos, covers, assets pendientes |
| 2 | `TIKTOK_Test_Protocol.md` | `04_Produccion/` | Flujo de prueba privada, checklist 33 puntos, protocolo de compresión, errores frecuentes |
| 3 | `TIKTOK_Setup_Checklist.md` | `07_Operaciones/` | Checklist operativo con 30+ ítems, progreso por área, pre-launch gate |
| 4 | `TIKTOK_Status_Report.md` | `07_Operaciones/` | Este documento — estado consolidado |

### Auditoría realizada

- Revisión completa del repo: `system/`, `02_Brand_System/`, `04_Produccion/`, `07_Operaciones/`, `.github/agents/`, `website/`, `scripts/`, `08_n8n/`
- Inventario de 20+ referencias a TikTok en el proyecto
- Cruce de specs entre video producer agent, Figma pending phases, Canva archivo maestro y brand kit

### Hallazgos notables

1. **Instagram handle inconsistencia (no TikTok, pero relevante):**
   - `website/src/components/Footer.astro` → `globalfrequency.es`
   - `website/src/pages/contacto.astro` → `frecuenciaglobal.wav`
   - Repo memory confirma: `@globalfrequency.es`
   - **Acción recomendada:** Unificar — `contacto.astro` tiene un handle distinto

2. **Overlay de Figma:** El código para crear el template TikTok 1080×1920 está listo en `FG_Figma_Pending_Phases.md` (CALL 4) con safe zones correctas, pero no ha sido ejecutado en Figma (plan Starter limitado a 6 calls/mes)

3. **Overlay en Canva:** Spec completa en `FG_Archivo_Maestro_Visual_Canva.md` §10 y assets ya producidos en `Frecuencia_Global_Activos_Canva_v2`:
   - `FG_Reels_Overlay_Minimal_v1.png` (1080×1920, RGBA)
   - `FG_Reels_Overlay_Full_v1.png` (1080×1920, RGBA)
   - `FG_Reels_Overlay_Minimal_BB_v1.png`, `FG_Reels_Overlay_Minimal_FG_v1.png`, `FG_Reels_Overlay_Minimal_BP_v1.png`
   - `FG_Reels_Overlay_Full_BB_v1.png`, `FG_Reels_Overlay_Full_FG_v1.png`, `FG_Reels_Overlay_Full_BP_v1.png`

4. **Video packages existentes:** Dos piezas ya tienen video package listo para TikTok:
   - `P1_002_Video_Package_TongaCable.md` — short 60-90s
   - `P3_001_Video_Package_Chokepoints.md` — short 60-90s
   - Ambos incluyen adaptación TikTok, pero falta producción final (edición de video)

5. **Actualización post-reinicio (esta sesión):**
   - Foto de perfil generada y validada a 200×200: `Frecuencia_Global_Assets_Base/assets/fg_tiktok_profile_200x200.png`
   - Cover template base generado y validado a 1080×1920: `Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920.png`
   - Versión guía QA del cover con safe zones: `Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920_guides.png`

---

## C. ARCHIVOS CREADOS/ACTUALIZADOS

| Acción | Archivo |
|--------|---------|
| CREADO | `02_Brand_System/TIKTOK_Asset_Specs.md` |
| CREADO | `04_Produccion/TIKTOK_Test_Protocol.md` |
| CREADO | `07_Operaciones/TIKTOK_Setup_Checklist.md` |
| CREADO | `07_Operaciones/TIKTOK_Status_Report.md` |

No se modificó ningún archivo existente. No se realizaron cambios destructivos.

---

## D. PENDIENTES PRIORITARIOS

### P0 — Bloquean pruebas

| # | Pendiente | Responsable | Esfuerzo |
|---|-----------|-------------|----------|
| 1 | Editar y exportar primer video test (cualquiera de los 2 packages) | Editor humano o herramienta | 2-4h |
| 2 | Subir foto de perfil + primer upload privado + validación en móvil | Farid (requiere acceso a la cuenta) | 30 min |
| 3 | Ajustar overlay seleccionado al video test (minimal o full) | Copilot / Editor | 20 min |

### P1 — Necesarios antes de publicar

| # | Pendiente | Responsable | Esfuerzo |
|---|-----------|-------------|----------|
| 4 | Aprobar y pegar bio seleccionada en TikTok | Farid / Maya | 10 min |
| 5 | Deploy website a Vercel (para tener link funcional) | Copilot / Farid | 30 min |
| 6 | Configurar cuenta Creator/Business | Farid | 10 min |
| 7 | Corregir inconsistencia de IG handle en `contacto.astro` | Copilot | 5 min |

### P2 — Mejoras post-lanzamiento

| # | Pendiente | Responsable | Esfuerzo |
|---|-----------|-------------|----------|
| 11 | Workflows de n8n para scheduling TikTok | Copilot | 2-3h |
| 12 | Analytics tracking setup | Farid | 1h |
| 13 | Template de caption reutilizable | Copilot | 30 min |
| 14 | Ejecutar Figma CALL 4 para overlay template | Copilot (Figma MCP) | 15 min |

---

## E. BLOQUEADORES REALES

| # | Bloqueador | Impacto | Cómo desbloquear |
|---|-----------|---------|-----------------|
| 1 | **No hay video editado** | Sin video no se puede hacer ninguna prueba real en TikTok | Editar al menos una pieza corta (Chokepoints o Tonga Cable) |
| 2 | **Website no deployado** | No hay link válido para el perfil | Deploy a Vercel |
| 3 | **Bio sin aprobar** | Perfil incompleto | Decisión de Farid/Maya sobre texto |
| 4 | **Acceso a cuenta TikTok** | Solo Farid puede subir y verificar en la app | Requiere sesión de prueba manual |

---

## F. RECOMENDACIÓN PARA SIGUIENTE JORNADA

### Próxima jornada: "TikTok — Producción de assets + primera prueba privada"

**Objetivo:** Pasar de "documentado" a "probado".

**Secuencia recomendada:**

1. **Subir foto de perfil ya producida** (10 min) — usar `fg_tiktok_profile_200x200.png` en la cuenta TikTok
2. **Seleccionar y aplicar overlay al primer test** (20 min) — elegir variante por pilar (minimal o full)
3. **Editar 1 video corto** (2-4h) — Tomar package de Chokepoints (P3_001), editar con overlay, subtítulos, audio
4. **Configurar bio en TikTok** (10 min) — Farid, en móvil
5. **Upload privado del video test** (10 min) — Farid, modo "solo yo"
6. **Ejecutar test protocol completo** (30 min) — Checklist de 33 puntos
7. **Registrar resultados** (10 min) — Anotar en log del test protocol

**Duración total estimada de la jornada:** 3-5 horas.

Al finalizar esa jornada, TikTok estará en estado **LISTO PARA PUBLICACIÓN CONTROLADA**.

---

## CHECKLIST FINAL DE VALIDACIÓN

| Área | Ítem | Estado |
|------|------|--------|
| **Cuenta** | Handle registrado (`@frecuenciaglobal`) | ✅ Listo |
| **Cuenta** | Display name | ⚠️ Verificar en plataforma |
| **Cuenta** | Foto de perfil | ⚠️ Listo para subir (archivo generado) |
| **Cuenta** | Bio | ⚠️ Lista para pegar (requiere aprobación) |
| **Cuenta** | Link en perfil | ❌ Pendiente (requiere deploy) |
| **Cuenta** | Tipo de cuenta (Creator/Business) | ⚠️ Verificar |
| **Assets** | Overlay vertical (al menos 1 variante) | ✅ Listo |
| **Assets** | Cover template | ✅ Listo |
| **Assets** | Foto de perfil exportada | ✅ Listo |
| **Specs** | Safe zones documentadas | ✅ Listo |
| **Specs** | Video specs (resolución, codec, bitrate) | ✅ Listo |
| **Specs** | Overlay specs (elementos, posiciones, colores) | ✅ Listo |
| **Specs** | Subtítulos specs | ✅ Listo |
| **Docs** | Asset specs | ✅ Listo |
| **Docs** | Test protocol | ✅ Listo |
| **Docs** | Setup checklist | ✅ Listo |
| **Docs** | Status report | ✅ Listo |
| **Producción** | Video packages con adaptación TikTok | ⚠️ Parcial (2 packages, 0 editados) |
| **Producción** | Templates de video (30-60s, 60-90s) | ✅ Listo |
| **Integración** | Website links a TikTok | ✅ Listo |
| **Integración** | Video producer agent cubre TikTok | ✅ Listo |
| **Integración** | Figma overlay template (código) | ⚠️ Parcial (código listo, no ejecutado) |
| **Integración** | Canva overlay spec | ✅ Listo (spec lista, overlays producidos en 4 pilares) |
| **Integración** | n8n workflows | ⚠️ Parcial (WF-010 cloud existe; falta bridge/credencial y activación) |
| **Pruebas** | Upload privado | ❌ Pendiente |
| **Pruebas** | Validación en móvil | ❌ Pendiente |
| **Pruebas** | Test protocol ejecutado | ❌ Pendiente |

**Resumen:** ✅ 16 listos / ⚠️ 5 parciales / ❌ 6 pendientes

---

*Documento generado durante jornada técnica del 2026-04-01. No se publicó nada. No se realizaron cambios destructivos.*

---

## Update 2026-04-04 — Estado STANDBY

**Decisión:** TikTok puesto en standby temporal.

**Razón:** En espera de autorización de cuenta / domain verification.

**Scripts listos:**
- `scripts/tk_chrome_login.py` — Login persistente
- `scripts/tk_publish_post.py` — Publicación browser automation

**Assets P1_001 listos:**
- `06_Assets/P1_001/P1_001_TK_1080x1920.png` — Cover TikTok generado
- `06_Assets/P1_001/FG_P1_001_TK_Cover_v1_20260404_0.png` — Cover alternativo

**Bloqueador:** Autorización de cuenta pendiente.

**Próximo paso:** Reactivar cuando se autorice acceso completo a cuenta TikTok @frecuenciaglobal.
