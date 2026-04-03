# LinkedIn — Setup Checklist

**Sistema:** Frecuencia Global  
**Versión:** 1.0  
**Fecha:** 2026-04-01  
**Estado:** Pre-lanzamiento

> Referencia operativa actual para pruebas: `07_Operaciones/PLATFORM_TEST_START_CHECKLIST_2026-04-02.md`

---

## PROPÓSITO

Checklist operativo para dejar LinkedIn en estado "LISTO PARA PRUEBAS". Cada ítem tiene un estado, criterio de aceptación y referencia a docs del repo.

---

## 1. COMPANY PAGE — CONFIGURACIÓN

| # | Tarea | Estado | Criterio de aceptación |
|---|-------|--------|----------------------|
| 1.1 | Company page creada | ✅ Listo | URL `linkedin.com/company/frecuencia-global` activa |
| 1.2 | Display name configurado | ⚠️ Verificar | Debe ser "Frecuencia Global" (sin variaciones) |
| 1.3 | Logo (foto de perfil) subido | ⚠️ Listo para subir | `04_Produccion/linkedin_assets/fg_linkedin_profile_400x400.png` |
| 1.4 | Banner/Cover subido | ⚠️ Listo para subir | `04_Produccion/linkedin_assets/fg_linkedin_banner_1584x396.png` |
| 1.5 | Tagline configurada | ❌ Pendiente | **REQUIERE APROBACIÓN** — propuestas en `02_Brand_System/LINKEDIN_Asset_Specs.md` §2 |
| 1.6 | Descripción (About) configurada | ❌ Pendiente | **REQUIERE APROBACIÓN** — propuesta en `02_Brand_System/LINKEDIN_Asset_Specs.md` §2 |
| 1.7 | Website en perfil | ⚠️ Listo para aplicar | `https://website-three-rho-26.vercel.app` |
| 1.8 | Sector configurado | ❌ Pendiente | "Media & Communications" o "Online Media" |
| 1.9 | Tamaño de empresa | ❌ Pendiente | "1-10 empleados" |
| 1.10 | URL personalizada | ✅ Listo | `frecuencia-global` confirmado |
| 1.11 | Botón CTA configurado | ❌ Pendiente | "Visita el sitio web" → link al website |
| 1.12 | Hashtags de empresa | ❌ Pendiente | `#FrecuenciaGlobal`, `#Geopolitics`, `#BehindThePolicy` |

---

## 2. ASSETS VISUALES

| # | Asset | Estado | Spec | Archivo |
|---|-------|--------|------|---------|
| 2.1 | Logo (400×400) | ✅ Producido | PNG, isotipo alineado con otras redes | `04_Produccion/linkedin_assets/fg_linkedin_profile_400x400.png` |
| 2.2 | Banner/Cover (1584×396) | ✅ Producido | PNG, wordmark + tagline + línea frecuencia cian | `04_Produccion/linkedin_assets/fg_linkedin_banner_1584x396.png` |
| 2.3 | Template post image (1200×627) | ❌ Pendiente | Estructura Behind the Policy | — |
| 2.4 | Template artículo cover (1200×627) | ❌ Pendiente | Pill + título + línea frecuencia | — |
| 2.5 | Template documento/carrusel (1080×1350) | ❌ Pendiente | Portada + interior + cierre en PDF | — |

> Specs completas en [`02_Brand_System/LINKEDIN_Asset_Specs.md`](../02_Brand_System/LINKEDIN_Asset_Specs.md)

---

## 3. CONFIGURACIÓN TÉCNICA (WEBSITE)

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 3.1 | Open Graph meta tags | ✅ Listo | `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:locale` configurados en `BaseLayout.astro` |
| 3.2 | Footer link a LinkedIn | ✅ Listo | `https://www.linkedin.com/company/frecuencia-global` en `Footer.astro` |
| 3.3 | Página contacto link | ✅ Listo | LinkedIn agregado en sección "TAMBIÉN NOS ENCUENTRAS EN" de `contacto.astro` |
| 3.4 | OG Image dimensiones | ⚠️ Verificar | Verificar que imagen OG sea 1200×627 (óptima para LinkedIn preview) |
| 3.5 | Link preview funcional | ❌ Pendiente | Validar con [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) post-deploy |

> LinkedIn usa exclusivamente `og:` tags para link previews. No tiene tags propios como Twitter.

---

## 4. DOCUMENTACIÓN

| # | Documento | Estado | Ubicación |
|---|-----------|--------|-----------|
| 4.1 | Asset Specs LinkedIn | ✅ Creado | `02_Brand_System/LINKEDIN_Asset_Specs.md` |
| 4.2 | Test Protocol LinkedIn | ✅ Creado | `04_Produccion/LINKEDIN_Test_Protocol.md` |
| 4.3 | Setup Checklist (este doc) | ✅ Creado | `07_Operaciones/LINKEDIN_Setup_Checklist.md` |
| 4.4 | Status Report LinkedIn | ✅ Creado | `07_Operaciones/LINKEDIN_Status_Report.md` |
| 4.5 | Preflight Report LinkedIn | ✅ Creado | `07_Operaciones/LINKEDIN_Preflight_Report_2026-04-01.md` |
| 4.6 | Log operativo Run 001 | ✅ Creado | `07_Operaciones/LINKEDIN_Test_Run_001.md` |

---

## 5. CONTENIDO DE PRUEBA

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 5.1 | Draft de post profesional | ❌ Pendiente | Redactar 1 post Behind the Policy como sample |
| 5.2 | Draft de artículo LinkedIn | ❌ Pendiente | 1 artículo largo sobre tema existente (reutilizar P1_001 o P1_002) |
| 5.3 | Post image de prueba | ❌ Pendiente | 1 imagen 1200×627 con sistema visual Behind the Policy |
| 5.4 | Documento/carrusel de prueba | ❌ Pendiente | 1 PDF 6-8 slides sobre contenido existente |
| 5.5 | Test de publicación | ❌ Pendiente | Publicar y validar rendering en desktop + móvil |
| 5.6 | Test de artículo | ❌ Pendiente | Publicar artículo borrador y validar cover + formato |
| 5.7 | Log de prueba registrado | ❌ Pendiente | Formato en `LINKEDIN_Test_Protocol.md` sección 8 |

---

## 6. INTEGRACIÓN CON SISTEMA

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 6.1 | Website footer link | ✅ Listo | Footer apunta a `https://www.linkedin.com/company/frecuencia-global` |
| 6.2 | Contacto page link | ✅ Listo | Link a LinkedIn agregado en `contacto.astro` |
| 6.3 | Visual-creator agent | ⚠️ Verificar | `visual-creator.agent.md` incluye LinkedIn en specs de plataforma |
| 6.4 | Video-producer agent | ⚠️ Verificar | LinkedIn 16:9, 90s, analytical tone especificado |
| 6.5 | Content strategy specs | ⚠️ Verificar | Blueprint §3.5 define LinkedIn como "puente profesional" |
| 6.6 | Naming conventions | ⚠️ Verificar | Verificar que LinkedIn esté en `RULE_Naming_Conventions.md` |
| 6.7 | Figma LinkedIn template | ❌ Pendiente | LinkedIn Article P2 en roadmap Figma (no construido) |
| 6.8 | Canva templates LinkedIn | ❌ Pendiente | Templates Behind the Policy para LinkedIn no producidos |
| 6.9 | n8n workflows LinkedIn | ⚠️ Parcial | WF-009 cloud existe; falta credencial LinkedIn, `LINKEDIN_AUTHOR_URN` y pruebas |
| 6.10 | Brand Kit checklist | ❌ Pendiente | Actualizar `[ ] Banner LinkedIn` cuando se produzca |

---

## 7. ANTES DE PUBLICAR (PRE-LAUNCH GATE)

No publicar contenido oficial hasta cumplir:

- [ ] Logo subido y validado (desktop + móvil)
- [ ] Banner subido y validado (desktop + móvil)
- [ ] Tagline y descripción aprobadas y configuradas
- [ ] Sector y datos de empresa configurados
- [ ] Website link funcional en perfil (website deployed)
- [ ] Botón CTA configurado
- [ ] Al menos 1 prueba de post completada
- [ ] Al menos 1 prueba de artículo completada
- [ ] Link preview del website validado con Post Inspector
- [ ] Registro de pruebas firmado en `LINKEDIN_Test_Protocol.md` §8

---

*Generado: 2026-04-01*  
*Referencia: `02_Brand_System/LINKEDIN_Asset_Specs.md`, `04_Produccion/LINKEDIN_Test_Protocol.md`*
