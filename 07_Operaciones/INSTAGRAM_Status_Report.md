# INSTAGRAM — Status Report

**Sistema:** Frecuencia Global  
**Fecha:** 2026-04-01  
**Jornada:** Hardening técnico Instagram  
**Autor:** Agente técnico (Copilot)

> Referencia operativa actual para pruebas: `07_Operaciones/PLATFORM_TEST_START_CHECKLIST_2026-04-02.md`

---

## A. ESTADO ACTUAL DE INSTAGRAM

| Dimensión | Estado | Detalle |
|-----------|--------|---------|
| **Cuenta** | ✅ Activa | Handle `@globalfrequency.es` registrado |
| **Contenido** | ❌ Vacío | 0 publicaciones |
| **Perfil** | ⚠️ Incompleto | Falta bio aprobada, link funcional, categoría, botones |
| **Assets** | ⚠️ Mayoría listos | 22 de 26 assets producidos; faltan 4 (slide cierre, story frame, post base 1:1, covers reel por pilar) |
| **Highlights** | ⚠️ Covers listos, sin contenido | 6 covers en v3; requieren stories placeholder para activarse |
| **Documentación** | ✅ Completa | 4 documentos operativos creados |
| **Integración** | ⚠️ Parcial | Website source/dist/preview con handle correcto; dominio canónico aliasado pero protegido (401) |
| **Pruebas** | ❌ No iniciadas | Sin uploads ni validaciones en device |

**Estado general: LISTO PARA PREPARAR PRUEBAS — infraestructura documental y de assets mayoritariamente resuelta.**

---

## B. CAMBIOS REALIZADOS EN ESTA JORNADA

### Documentos creados

| # | Archivo | Ubicación | Contenido |
|---|---------|-----------|-----------|
| 1 | `INSTAGRAM_Asset_Specs.md` | `02_Brand_System/` | Specs de perfil, bio, 4 formatos con medidas, safe zones, highlights, carrusel, reel overlay, fondos, elementos, mockups, cross-platform, nomenclatura, assets pendientes |
| 2 | `INSTAGRAM_Test_Protocol.md` | `04_Produccion/` | Protocolo de prueba por formato (post, carrusel, story, reel), checklists de validación (~60 checks), compresión, errores frecuentes, registro de pruebas |
| 3 | `INSTAGRAM_Setup_Checklist.md` | `07_Operaciones/` | Checklist operativo: cuenta, assets (26 ítems), highlights, config técnica, integración, formatos base, naming, pre/post publicación, pre-launch gate |
| 4 | `INSTAGRAM_Status_Report.md` | `07_Operaciones/` | Este documento — estado consolidado |
| 5 | `instagram_preflight.ps1` | `scripts/` | Script automatizado de validación técnica Instagram (docs, web, assets, dimensiones, deploy) |
| 6 | `INSTAGRAM_Preflight_Report_2026-04-01.md` | `07_Operaciones/` | Reporte automático de la última corrida |

### Correcciones técnicas aplicadas

| # | Archivo | Cambio | Impacto |
|---|---------|--------|---------|
| 1 | `website/src/pages/contacto.astro` | Handle IG corregido de `frecuenciaglobal.wav` a `globalfrequency.es` | Consistencia cross-platform del handle de Instagram |
| 2 | `website/dist/*` | Regenerado con `npm run build` | Fix de handle reflejado en salida estática |

### Verificaciones técnicas (jornada siguiente)

| # | Validación | Resultado |
|---|------------|-----------|
| 1 | `npm run build` en `website/` | ✅ OK |
| 2 | Búsqueda en `website/dist/**` de handle antiguo (`frecuenciaglobal.wav`) | ✅ 0 coincidencias |
| 3 | Búsqueda en `website/dist/**` de handle correcto (`globalfrequency.es`) | ✅ 12 coincidencias |
| 4 | Preview deploy (`website-three-rho-26.vercel.app`) | ✅ Online y con handle IG correcto |
| 5 | Deploy productivo vía Vercel CLI | ✅ Ejecutado y alias principal actualizado |
| 6 | Alias canónico (`frecuenciaglobal.vercel.app`) | ✅ Asignado al último deploy |
| 7 | Acceso público al canónico | ⚠️ Bloqueado por Vercel Authentication (401) |
| 8 | Preflight Instagram automatizado | ✅ Ejecutado (`51 OK / 2 FAIL`) |
| 9 | Fails actuales del preflight | ⚠️ Solo canónico público (2 checks relacionados con auth) |

### Auditoría realizada

- Revisión completa del repo: `system/`, `01_Estrategia/`, `02_Brand_System/`, `04_Produccion/`, `07_Operaciones/`, `.github/agents/`, `website/`, `scripts/`, `Frecuencia_Global_Activos_Canva_v1-v6/`
- 40+ referencias a Instagram identificadas en el proyecto
- Inventario de 22 assets existentes para Instagram
- Cruce de specs: Brand Kit, agents, rules, website, Figma pending, Canva maestro, Checkpoint docs
- Detección y corrección de inconsistencia de handle en `contacto.astro`

---

## C. DIAGNÓSTICO — QUÉ ESTÁ LISTO vs QUÉ FALTA

### ✅ LISTO

| # | Elemento | Detalle |
|---|----------|---------|
| 1 | Handle confirmado | `@globalfrequency.es` — consistente en Brand Kit, Footer, repo memory |
| 2 | Cuenta activa | Checkpoint confirma cuenta existente |
| 3 | Avatar + highlights refresh | Nueva tanda alineada con TikTok/X en `06_Assets/` (avatar + 6 covers), falta validar recorte circular en plataforma |
| 4 | 6 highlight covers | SERIES, NEWS, POLICY, BORDERS, MAPS, ABOUT — en v3 |
| 5 | 8 templates carrusel | 4 portadas + 4 interiores por pilar — en v4 |
| 6 | 3 overlays Reel | Full, Minimal, Guide — en v2 |
| 7 | Reel cover master | Master + Guide — en v2/v3 |
| 8 | 8 fondos para feed | DarkSolid, Grid, CyanField, Policy, Modular, News, Reel bases — en v5 |
| 9 | 15 elementos modulares | Líneas, dividers, nodos, corchetes, pills, frames — en v5 |
| 10 | Mockup de perfil | `FG_Mockup_Instagram_Profile_v1.png` — en v6 |
| 11 | Website footer + contacto link | `https://instagram.com/globalfrequency.es` correcto |
| 12 | Specs de dimensiones | 4 formatos documentados con safe zones completas |
| 13 | Estructura de carrusel | Portada, interior y cierre definidos con layouts ASCII |
| 14 | 4 documentos operativos | Asset Specs, Test Protocol, Setup Checklist, Status Report |
| 15 | Naming convention | `FG_IG_[FORMATO]_[PILAR]_[TEMA]_[VERSION].[ext]` |
| 16 | Formatos base | Post, carrusel, reel, story — specs operativas completas |
| 17 | Checklists pre/post pub | Listos y documentados |

### ⚠️ PARCIAL

| # | Elemento | Falta | Esfuerzo |
|---|----------|-------|----------|
| 1 | Avatar | Validar recorte circular en Instagram real | 10 min |
| 2 | Bio | Propuesta lista, requiere aprobación Farid/Maya | 5 min |
| 3 | Cuenta Business/Creator | Verificar tipo actual | 5 min |
| 4 | Categoría | Verificar/configurar | 5 min |
| 5 | Figma templates IG | Specs listas en Pending Phases, no ejecutadas | 30 min |
| 6 | Canva templates IG | Algunos producidos, otros en spec | variable |
| 7 | Highlight covers | Covers listos, pero requieren stories para crear highlights | 30 min |

### ❌ PENDIENTE

| # | Elemento | Bloquea pruebas | Esfuerzo | Herramienta |
|---|----------|----------------|----------|-------------|
| 1 | **Bio aprobada** | Sí | 5 min — decisión Farid/Maya | Texto |
| 2 | **Quitar protección de autenticación del canónico** | Sí (link en bio) | 10-20 min | Vercel |
| 3 | **Slide cierre carrusel** | Parcial | 30 min | Canva |
| 4 | **Template Story frame** | Parcial | 30 min | Canva |
| 5 | **Post base 1:1** | Parcial | 30 min | Canva |
| 6 | **Covers Reel por pilar (4)** | No — master existe | 1h | Canva |
| 7 | **Primer upload test** | Sí para validación | 30 min | Farid (acceso cuenta) |
| 8 | **Highlights configurados** | Sí para perfil completo | 20 min | Farid (acceso cuenta) |
| 9 | **n8n workflows IG** | Parcial | 30-60 min para binding final de WF-008 | n8n |

---

## D. ARCHIVOS CREADOS/ACTUALIZADOS

| Acción | Archivo |
|--------|---------|
| CREADO | `02_Brand_System/INSTAGRAM_Asset_Specs.md` |
| CREADO | `04_Produccion/INSTAGRAM_Test_Protocol.md` |
| CREADO | `07_Operaciones/INSTAGRAM_Setup_Checklist.md` |
| CREADO | `07_Operaciones/INSTAGRAM_Status_Report.md` |
| EDITADO | `website/src/pages/contacto.astro` — handle IG corregido |

No se eliminó ningún archivo. No se realizaron cambios destructivos.

---

## E. PENDIENTES PRIORITARIOS

### P0 — Bloquean pruebas reales

| # | Pendiente | Responsable | Esfuerzo |
|---|-----------|-------------|----------|
| 1 | Validar recorte circular del avatar en IG | Farid (requiere acceso) | 10 min |
| 2 | Aprobar bio de Instagram | Farid / Maya | 5 min |
| 3 | Desactivar Vercel Authentication para producción de `website` | Farid | 10-20 min |
| 4 | Primer upload de prueba (post draft o archivo) | Farid | 20 min |
| 5 | Crear highlights con stories placeholder | Farid | 30 min |

### P1 — Necesarios antes de publicar contenido real

| # | Pendiente | Responsable | Esfuerzo |
|---|-----------|-------------|----------|
| 6 | Producir slide de cierre carrusel | Canva / Copilot | 30 min |
| 7 | Producir template Story frame | Canva / Copilot | 30 min |
| 8 | Producir template post 1:1 base | Canva / Copilot | 30 min |
| 9 | Configurar tipo de cuenta (Creator/Business) | Farid | 5 min |
| 10 | Configurar categoría de cuenta | Farid | 5 min |
| 11 | Ejecutar test protocol completo (1 pieza por formato) | Farid | 1-2h |
| 12 | Revalidar canónico con `Invoke-WebRequest` tras desactivar protección | Copilot / Farid | 5 min |

### P2 — Mejoras post-lanzamiento

| # | Pendiente | Responsable | Esfuerzo |
|---|-----------|-------------|----------|
| 13 | Producir 4 covers de Reel por pilar | Canva | 1h |
| 14 | Ejecutar Figma templates (Pending Phases) | Copilot (si se libera Starter call) | 30 min |
| 15 | Enlazar credencial/bridge y activar WF-008 | Copilot | 30-60 min |
| 16 | Integrar Canva MCP para producción rápida | Copilot | 1h |
| 17 | Estrategia de grid visual | Maya | Variable |

---

## F. BLOQUEADORES REALES

| # | Bloqueador | Impacto | Resolución |
|---|-----------|---------|------------|
| 1 | **Vercel Authentication activa en canónico** | Link de bio objetivo no es accesible públicamente | Desactivar Deployment Protection en producción o configurar bypass para validaciones |
| 2 | **Acceso manual a Instagram** | Todas las pruebas de perfil, uploads y highlights requieren acceso a la app | Farid debe ejecutarlas manualmente |
| 3 | **Aprobación de bio** | No se puede configurar perfil sin bio final | Decisión de Farid o Maya — propuesta lista en Asset Specs |

No hay bloqueadores técnicos de infraestructura. Los 3 bloqueadores son acciones humanas (deploy, acceso a cuenta, decisión editorial).

---

## G. RECOMENDACIÓN PARA SIGUIENTE JORNADA

### Jornada recomendada: "Instagram — Pruebas en Device"

**Prerrequisitos:**
1. Bio aprobada por Farid/Maya
2. Website deployed (al menos preview URL)

**Secuencia sugerida:**
1. Configurar perfil completo: avatar, bio, link, categoría, tipo de cuenta
2. Crear los 6 highlights con stories placeholder + covers
3. Producir slide de cierre + story frame + post base 1:1 (Canva)
4. Subir 1 pieza de cada formato como draft/archivo: post 1:1, carrusel 4:5, story, reel
5. Ejecutar test protocol completo en cada formato
6. Validar grid preview
7. Documentar resultados en el log de pruebas
8. Actualizar status report

**Criterio de éxito:** Perfil completo + 1 pieza de cada formato probada y aprobada.

---

## H. CHECKLIST FINAL DE VALIDACIÓN

| # | Ítem | Estado |
|---|------|--------|
| 1 | Handle confirmado y consistente | ✅ Listo |
| 2 | Avatar base disponible | ✅ Listo |
| 3 | Avatar recorte circular validado | ❌ Pendiente |
| 4 | Bio propuesta | ✅ Listo |
| 5 | Bio aprobada y configurada | ❌ Pendiente |
| 6 | Link en bio funcional | ❌ Pendiente (canónico protegido por auth 401) |
| 7 | Tipo de cuenta configurado | ⚠️ Parcial (verificar) |
| 8 | Categoría configurada | ⚠️ Parcial (verificar) |
| 9 | 6 highlight covers | ✅ Listo |
| 10 | 6 highlights activos en perfil | ❌ Pendiente |
| 11 | Templates carrusel (4 pilares) | ✅ Listo |
| 12 | Slide de cierre carrusel | ❌ Pendiente |
| 13 | Overlays de Reel | ✅ Listo |
| 14 | Reel cover master | ✅ Listo |
| 15 | Fondos para feed | ✅ Listo |
| 16 | Elementos modulares | ✅ Listo |
| 17 | Template story frame | ❌ Pendiente |
| 18 | Template post 1:1 | ❌ Pendiente |
| 19 | Specs de dimensiones documentadas | ✅ Listo |
| 20 | Safe zones documentadas | ✅ Listo |
| 21 | Test protocol creado | ✅ Listo |
| 22 | Setup checklist creado | ✅ Listo |
| 23 | Naming convention definida | ✅ Listo |
| 24 | Formatos base definidos | ✅ Listo |
| 25 | Checklists pre/post publicación | ✅ Listo |
| 26 | Pre-launch gate definido | ✅ Listo |
| 27 | Website footer link correcto | ✅ Listo |
| 28 | Website contacto link corregido | ✅ Listo |
| 29 | Primera prueba en device ejecutada | ❌ Pendiente |
| 30 | Cross-platform consistency table | ✅ Listo |

**Resumen: 18 ✅ | 2 ⚠️ | 10 ❌**

---

*Generado por agente técnico (Copilot) — Jornada Instagram 2026-04-01*
