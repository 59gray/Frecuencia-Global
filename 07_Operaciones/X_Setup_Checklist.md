# X — Setup Checklist

**Sistema:** Frecuencia Global  
**Versión:** 1.0  
**Fecha:** 2026-04-01  
**Estado:** Pre-lanzamiento

---

## PROPÓSITO

Checklist operativo para dejar X en estado "LISTO PARA PRUEBAS". Cada ítem tiene un estado, criterio de aceptación y referencia a docs del repo.

---

## 1. CUENTA Y PERFIL

| # | Tarea | Estado | Criterio de aceptación |
|---|-------|--------|----------------------|
| 1.1 | Cuenta creada | ✅ Listo | Handle `@frec_global` activo |
| 1.2 | Display name configurado | ✅ Verificado | Validado manualmente en incógnito el `2026-04-02`: "Frecuencia Global" |
| 1.3 | Foto de perfil preparada | ✅ Listo | `06_Assets/FG_MK_Avatar_X-Profile_v1.png` listo para subir |
| 1.4 | Banner/Header preparado | ✅ Listo | `06_Assets/FG_MK_BNR_X-Header_v1.png` (1500×500) listo para subir |
| 1.5 | Bio aprobada | ✅ Listo | Opción A aprobada en jornada técnica |
| 1.6 | Link en perfil | ⚠️ Verificar contra decisión de dominio | Perfil visible correcto en incógnito; definir si se mantiene link temporal o se espera al dominio final |
| 1.7 | Location | ⚠️ Opcional | Decidir si aplica — no prioritario |
| 1.8 | Tema del perfil | ⚠️ Verificar | Color de acento del perfil en cian si X lo permite |

---

## 2. ASSETS VISUALES

| # | Asset | Estado | Spec | Archivo |
|---|-------|--------|------|---------|
| 2.1 | Foto de perfil (400×400) | ✅ Generado | PNG, isotipo + fondo oscuro + glow | `06_Assets/FG_MK_Avatar_X-Profile_v1.png` |
| 2.2 | Banner/Header (1500×500) | ✅ Generado | PNG, wordmark + tagline centrados | `06_Assets/FG_MK_BNR_X-Header_v1.png` |
| 2.3 | Template post image (1200×675) | ✅ Generado | 4 variantes por pilar | `FG_[GD|BB|FG|BP]_Template_Post_XBase_v1.png` |
| 2.4 | Template thread image (1200×675) | ✅ Generado | Dato/gráfico/cita/mapa (4 variantes por pilar) | `FG_[GD|BB|FG|BP]_Template_Thread_XBase_v1.png` |
| 2.5 | Card de cierre thread | ✅ Generado | CTA + isotipo + link | `FG_GN_Template_ThreadClose_X_v1.png` |

> Specs completas en [`02_Brand_System/X_Asset_Specs.md`](../02_Brand_System/X_Asset_Specs.md)

---

## 3. CONFIGURACIÓN TÉCNICA (WEBSITE)

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 3.1 | Twitter Card meta tags | ✅ Listo | `summary_large_image` configurado en `BaseLayout.astro` |
| 3.2 | `twitter:site` tag | ✅ Listo | `@frec_global` agregado en `BaseLayout.astro` |
| 3.3 | Footer link a X | ✅ Listo | `https://x.com/frec_global` en `Footer.astro` |
| 3.4 | OG Image configurada | ✅ Listo | Meta tags validados sobre deploy activo |
| 3.5 | Link preview funcional | ⚠️ Parcial | HTML y meta tags OK; falta validar render en X/Card Validator |

---

## 4. DOCUMENTACIÓN

| # | Documento | Estado | Ubicación |
|---|-----------|--------|-----------|
| 4.1 | Asset Specs X | ✅ Creado | `02_Brand_System/X_Asset_Specs.md` |
| 4.2 | Test Protocol X | ✅ Creado | `04_Produccion/X_Test_Protocol.md` |
| 4.3 | Setup Checklist (este doc) | ✅ Creado | `07_Operaciones/X_Setup_Checklist.md` |
| 4.4 | Status Report X | ✅ Creado | `07_Operaciones/X_Status_Report.md` |

---

## 5. CONTENIDO DE PRUEBA

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 5.1 | Draft de post individual | ❌ Pendiente | Redactar 1 post por pilar como sample |
| 5.2 | Draft de thread | ❌ Pendiente | 1 thread de 8-10 tweets sobre tema existente (P1_001 o similar) |
| 5.3 | Post image de prueba | ❌ Pendiente | 1 imagen 1200×675 con sistema visual |
| 5.4 | Thread image set de prueba | ❌ Pendiente | 2-3 imágenes para acompañar thread |
| 5.5 | Test de publicación | ❌ Pendiente | Publicar y borrar, o usar compose preview |
| 5.6 | Log de prueba registrado | ❌ Pendiente | Formato en `X_Test_Protocol.md` sección 8 |

---

## 6. INTEGRACIÓN CON SISTEMA

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 6.1 | Website link correcto | ✅ Listo | Footer apunta a `https://x.com/frec_global` |
| 6.2 | YouTube links configurados | ✅ Listo | `scripts/youtube_studio_config_cdp.py` tiene X configurado |
| 6.3 | Scriptwriting agent specs | ✅ Listo | `AGENT_04_Scriptwriting.md` incluye threads de X |
| 6.4 | Content strategy agent | ✅ Listo | `AGENT_02_Content_Strategy.md` incluye X |
| 6.5 | Project manager agent | ✅ Listo | `AGENT_07_Project_Manager.md` tiene X en calendar grid |
| 6.6 | Playbooks con X | ✅ Listo | PB_01, PB_03, PB_06 incluyen Thread X |
| 6.7 | Naming conventions | ✅ Listo | `Thread` definido en `RULE_Naming_Conventions.md` |
| 6.8 | Format specs | ✅ Listo | 1500×500 y 1200×675 en `RULE_File_Output_Standards.md` |
| 6.9 | Prompt Gemini banner | ✅ Listo | Prompt de banner X en `FG_Prompt_Gemini_Rediseno.md` |
| 6.10 | Templates base X | ✅ Listo | Generados en `06_Assets/` para post/thread/cierre |
| 6.11 | n8n workflows X | ⚠️ Parcial | WF-007 cloud existe; falta enlazar credencial X/Twitter y activar pruebas |

---

## 7. ANTES DE PUBLICAR (PRE-LAUNCH GATE)

No publicar contenido oficial hasta cumplir:

- [x] Foto de perfil subida y validada (desktop + móvil)
- [x] Banner subido y validada (desktop + móvil)
- [ ] Bio configurada en perfil (aprobación ya completada)
- [ ] Link funcional en perfil (pendiente decisión de dominio final)
- [ ] Al menos 1 prueba de post completada
- [ ] Al menos 1 prueba de thread completada
- [ ] Link preview del website validado con Card Validator
- [ ] Registro de pruebas firmado en `X_Test_Protocol.md` §8

> Nota de jornada 2: assets listos en `06_Assets/` y deploy activo en `https://website-three-rho-26.vercel.app`.

---

*Generado: 2026-04-01*  
*Referencia: `02_Brand_System/X_Asset_Specs.md`, `04_Produccion/X_Test_Protocol.md`*
