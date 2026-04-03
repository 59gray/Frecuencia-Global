# TIKTOK — Setup Checklist

**Sistema:** Frecuencia Global  
**Versión:** 1.0  
**Fecha:** 2026-04-01  
**Estado:** Pre-lanzamiento

---

## PROPÓSITO

Checklist operativo para dejar TikTok en estado "LISTO PARA PRUEBAS". Cada ítem tiene un estado, responsable y criterio de aceptación.

---

## 1. CUENTA Y PERFIL

| # | Tarea | Estado | Criterio de aceptación |
|---|-------|--------|----------------------|
| 1.1 | Cuenta creada | ✅ Listo | Handle real activo: `@frecuenciaglobal` |
| 1.2 | Display name configurado | ⛔ Bloqueado temporalmente | Cambio de nombre no disponible hasta despues del `2026-04-05`. Objetivo final: "Frecuencia Global" |
| 1.3 | Foto de perfil subida | ⚠️ Listo para subir | Archivo generado: `Frecuencia_Global_Assets_Base/assets/fg_tiktok_profile_200x200.png` |
| 1.4 | Bio redactada | ⚠️ Lista para pegar | Selección A definida en `TIKTOK_Asset_Specs.md` (**REQUIERE APROBACIÓN** antes de publicar) |
| 1.5 | Link en perfil | ❌ Pendiente | `https://frecuenciaglobal.vercel.app` (requiere deploy previo) |
| 1.6 | Cuenta Business/Creator | ⚠️ Verificar | Activar cuenta Creator para analytics |
| 1.7 | Categoría de cuenta | ⚠️ Verificar | "Education" o "News & Entertainment" |

---

## 2. ASSETS VISUALES

| # | Asset | Estado | Spec | Archivo |
|---|-------|--------|------|---------|
| 2.1 | Foto de perfil (200×200) | ✅ Producido | PNG, isotipo + fondo oscuro | `Frecuencia_Global_Assets_Base/assets/fg_tiktok_profile_200x200.png` |
| 2.2 | Overlay vertical GD (cian) | ✅ Producido | 1080×1920 PNG transparente | `Frecuencia_Global_Activos_Canva_v2/FG_Reels_Overlay_Minimal_v1.png` |
| 2.3 | Overlay vertical BB (magenta) | ✅ Producido | 1080×1920 PNG transparente | `Frecuencia_Global_Activos_Canva_v2/FG_Reels_Overlay_Minimal_BB_v1.png` |
| 2.4 | Overlay vertical FG (verde) | ✅ Producido | 1080×1920 PNG transparente | `Frecuencia_Global_Activos_Canva_v2/FG_Reels_Overlay_Minimal_FG_v1.png` |
| 2.5 | Overlay vertical BP (azul) | ✅ Producido | 1080×1920 PNG transparente | `Frecuencia_Global_Activos_Canva_v2/FG_Reels_Overlay_Minimal_BP_v1.png` |
| 2.6 | Cover template base | ✅ Producido | 1080×1920, estructura base FG | `Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920.png` |
| 2.7 | Cover template con guías QA | ✅ Producido | 1080×1920, safe zones visuales | `Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920_guides.png` |
| 2.8 | Overlay vertical full (cian) | ✅ Producido | 1080×1920 PNG transparente | `Frecuencia_Global_Activos_Canva_v2/FG_Reels_Overlay_Full_v1.png` |
| 2.9 | Overlay vertical full BB (magenta) | ✅ Producido | 1080×1920 PNG transparente | `Frecuencia_Global_Activos_Canva_v2/FG_Reels_Overlay_Full_BB_v1.png` |
| 2.10 | Overlay vertical full FG (verde) | ✅ Producido | 1080×1920 PNG transparente | `Frecuencia_Global_Activos_Canva_v2/FG_Reels_Overlay_Full_FG_v1.png` |
| 2.11 | Overlay vertical full BP (azul) | ✅ Producido | 1080×1920 PNG transparente | `Frecuencia_Global_Activos_Canva_v2/FG_Reels_Overlay_Full_BP_v1.png` |

> Specs completas en [`02_Brand_System/TIKTOK_Asset_Specs.md`](../02_Brand_System/TIKTOK_Asset_Specs.md)

---

## 3. CONFIGURACIÓN TÉCNICA

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 3.1 | Verificar resolución de upload | ⚠️ Pendiente | Subir video test 1080×1920 privado |
| 3.2 | Verificar compresión de TikTok | ⚠️ Pendiente | Comparar calidad pre/post upload |
| 3.3 | Validar safe zones en device | ⚠️ Pendiente | Subir pieza con texto en bordes, verificar oclusión |
| 3.4 | Test de audio | ⚠️ Pendiente | Verificar niveles, balance voz/música |
| 3.5 | Test de subtítulos | ⚠️ Pendiente | Verificar legibilidad post-compresión |

---

## 4. DOCUMENTACIÓN

| # | Documento | Estado | Ubicación |
|---|-----------|--------|-----------|
| 4.1 | Asset Specs TikTok | ✅ Creado | `02_Brand_System/TIKTOK_Asset_Specs.md` |
| 4.2 | Test Protocol TikTok | ✅ Creado | `04_Produccion/TIKTOK_Test_Protocol.md` |
| 4.3 | Setup Checklist (este doc) | ✅ Creado | `07_Operaciones/TIKTOK_Setup_Checklist.md` |
| 4.4 | Status Report | ✅ Creado | `07_Operaciones/TIKTOK_Status_Report.md` |

---

## 5. CONTENIDO DE PRUEBA

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 5.1 | Video package listo para test | ⚠️ Parcial | P3_001 (Chokepoints) y P1_002 (Tonga Cable) tienen package, falta producción final |
| 5.2 | Primer upload privado | ❌ Pendiente | Subir como "solo yo" para validar flujo |
| 5.3 | Review en móvil | ❌ Pendiente | Verificar en dispositivo real |
| 5.4 | Log de prueba registrado | ❌ Pendiente | Formato en `TIKTOK_Test_Protocol.md` sección 6 |

---

## 6. INTEGRACIÓN CON SISTEMA

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 6.1 | Website link correcto | ⚠️ Verificar | Debe apuntar al handle real `@frecuenciaglobal` |
| 6.2 | Video producer agent specs | ✅ Listo | Agent incluye TikTok en formatos y export specs |
| 6.3 | Templates de video | ✅ Listo | `TPL_Video_Short_30_60.md`, `TPL_Video_Short_60_90.md` |
| 6.4 | Flujo de producción | ✅ Listo | `FG_Flujo_Produccion_Video.md` cubre TikTok |
| 6.5 | Figma overlay template | ⚠️ Parcial | Código listo en `FG_Figma_Pending_Phases.md`, no ejecutado aún |
| 6.6 | Canva overlay spec | ✅ Listo | Spec definida y overlays producidos en 4 pilares (minimal + full) |
| 6.7 | n8n workflows TikTok | ⚠️ Parcial | WF-010 cloud existe; falta credencial/bridge TikTok, variable `TIKTOK_PUBLISH_WEBHOOK_URL` y pruebas |

---

## 7. ANTES DE PUBLICAR (PRE-LAUNCH GATE)

No publicar contenido oficial hasta cumplir:

- [ ] Foto de perfil subida
- [ ] Bio aprobada y configurada
- [ ] Link funcional en perfil
- [ ] Al menos 1 prueba privada completada y aprobada
- [x] Overlays producidos (4 pilares, versiones minimal y full)
- [x] Cover template funcional
- [ ] Protocol de test ejecutado al menos 1 vez

---

## PROGRESO GENERAL

```
Cuenta:        ███░░░░░░░  30%
Assets:        ██████████ 100%
Config técnica:░░░░░░░░░░   0%
Documentación: ██████████ 100%
Contenido:     ██░░░░░░░░  20%
Integración:   ████████░░  80%
───────────────────────────────
TOTAL:         ██████░░░░  56%
```
