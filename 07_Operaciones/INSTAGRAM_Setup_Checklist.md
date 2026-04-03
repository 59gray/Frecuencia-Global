# INSTAGRAM — Setup Checklist

**Sistema:** Frecuencia Global  
**Versión:** 1.0  
**Fecha:** 2026-04-01  
**Estado:** Pre-lanzamiento

> Referencia operativa actual para pruebas: `07_Operaciones/PLATFORM_TEST_START_CHECKLIST_2026-04-02.md`

---

## PROPÓSITO

Checklist operativo para dejar Instagram en estado "LISTO PARA PRUEBAS". Cada ítem tiene estado, criterio de aceptación y referencia.

---

## 1. CUENTA Y PERFIL

| # | Tarea | Estado | Criterio de aceptación |
|---|-------|--------|----------------------|
| 1.1 | Cuenta creada | ✅ Listo | Handle `@globalfrequency.es` activo |
| 1.2 | Display name configurado | ⚠️ Verificar | Debe ser "Frecuencia Global" (sin variaciones) |
| 1.3 | Foto de perfil subida | ⚠️ Parcial | Isotipo FG ≥320×320, alineado con TikTok/X — `06_Assets/FG_IG_Avatar_Profile_v2.png` listo, falta validar recorte circular |
| 1.4 | Bio redactada | ❌ Pendiente | **REQUIERE APROBACIÓN** — propuesta en `INSTAGRAM_Asset_Specs.md` §2 |
| 1.5 | Link en perfil | ❌ Pendiente | `https://frecuenciaglobal.vercel.app` (requiere deploy previo) |
| 1.6 | Cuenta Professional | ⚠️ Verificar | Activar como Creator o Business para analytics |
| 1.7 | Categoría de cuenta | ⚠️ Verificar | "Education" o "News & Media" |
| 1.8 | Botones de contacto | ❌ Pendiente | Email o website si se activa Business |

---

## 2. ASSETS VISUALES

| # | Asset | Estado | Spec | Archivo |
|---|-------|--------|------|---------|
| 2.1 | Avatar (320×320+) | ✅ Rediseñado | PNG, isotipo alineado con TikTok/X | `06_Assets/FG_IG_Avatar_Profile_v2.png` |
| 2.2 | Highlight cover — SERIES | ✅ Rediseñado | 1080×1920. Cian `#00E5FF` | `06_Assets/FG_IG_Highlight_Series_v2.png` |
| 2.3 | Highlight cover — NEWS | ✅ Rediseñado | 1080×1920, Verde `#B8FF00` | `06_Assets/FG_IG_Highlight_News_v2.png` |
| 2.4 | Highlight cover — POLICY | ✅ Rediseñado | 1080×1920, Azul `#4A6BFF` | `06_Assets/FG_IG_Highlight_Policy_v2.png` |
| 2.5 | Highlight cover — BORDERS | ✅ Rediseñado | 1080×1920, Magenta `#FF00E5` | `06_Assets/FG_IG_Highlight_Borders_v2.png` |
| 2.6 | Highlight cover — MAPS | ✅ Rediseñado | 1080×1920, Cian `#00E5FF` | `06_Assets/FG_IG_Highlight_Maps_v2.png` |
| 2.7 | Highlight cover — ABOUT | ✅ Rediseñado | 1080×1920, Blanco `#FFFFFF` | `06_Assets/FG_IG_Highlight_About_v2.png` |
| 2.8 | Carrusel cover — GD | ✅ Listo | 1080×1350 PNG | `FG_Carousel_GeopolitikDrop_Cover_v1.png` |
| 2.9 | Carrusel interior — GD | ✅ Listo | 1080×1350 PNG | `FG_Carousel_GeopolitikDrop_Internal_v1.png` |
| 2.10 | Carrusel cover — BB | ✅ Listo | 1080×1350 PNG | `FG_Carousel_BassAndBorders_Cover_v1.png` |
| 2.11 | Carrusel interior — BB | ✅ Listo | 1080×1350 PNG | `FG_Carousel_BassAndBorders_Internal_v1.png` |
| 2.12 | Carrusel cover — FG | ✅ Listo | 1080×1350 PNG | `FG_Carousel_FrecuenciaGlobal_Cover_v1.png` |
| 2.13 | Carrusel interior — FG | ✅ Listo | 1080×1350 PNG | `FG_Carousel_FrecuenciaGlobal_Internal_v1.png` |
| 2.14 | Carrusel cover — BP | ✅ Listo | 1080×1350 PNG | `FG_Carousel_BehindThePolicy_Cover_v1.png` |
| 2.15 | Carrusel interior — BP | ✅ Listo | 1080×1350 PNG | `FG_Carousel_BehindThePolicy_Internal_v1.png` |
| 2.16 | Reel Overlay Full | ✅ Listo | 1080×1920 PNG transparente | `FG_Reels_Overlay_Full_v1.png` |
| 2.17 | Reel Overlay Minimal | ✅ Listo | 1080×1920 PNG transparente | `FG_Reels_Overlay_Minimal_v1.png` |
| 2.18 | Reel Overlay Guide | ✅ Listo | 1080×1920 PNG transparente | `FG_Reels_Overlay_Guide_v1.png` |
| 2.19 | Reel Cover Master | ✅ Listo | 1080×1920 PNG | `FG_ReelCover_Master_v1.png` |
| 2.20 | Fondos feed (8) | ✅ Listo | 1080×1080/1350 PNG | `FG_BG_Feed_*.png` (v5) |
| 2.21 | Elementos modulares (15) | ✅ Listo | PNG transparente | `FG_Element_*.png` (v5) |
| 2.22 | Mockup Instagram Profile | ✅ Listo | Referencia visual | `FG_Mockup_Instagram_Profile_v1.png` (v6) |
| 2.23 | Slide de cierre carrusel | ❌ Pendiente | 1080×1350, wordmark + handle + CTA | — |
| 2.24 | Template Story frame | ❌ Pendiente | 1080×1920, branded, zonas marcadas | — |
| 2.25 | Post cuadrado base (1:1) | ❌ Pendiente | 1080×1080 PNG | — |
| 2.26 | Covers Reel por pilar (4) | ❌ Pendiente | 1080×1920, variantes del master | — |

> Specs completas en [`02_Brand_System/INSTAGRAM_Asset_Specs.md`](../02_Brand_System/INSTAGRAM_Asset_Specs.md)

---

## 3. HIGHLIGHTS

| # | Highlight | Estado | Cover | Contenido |
|---|-----------|--------|-------|-----------|
| 3.1 | SERIES | ⚠️ Cover listo, sin contenido | ✅ | ❌ Necesita al menos 1 story placeholder |
| 3.2 | NEWS | ⚠️ Cover listo, sin contenido | ✅ | ❌ |
| 3.3 | POLICY | ⚠️ Cover listo, sin contenido | ✅ | ❌ |
| 3.4 | BORDERS | ⚠️ Cover listo, sin contenido | ✅ | ❌ |
| 3.5 | MAPS | ⚠️ Cover listo, sin contenido | ✅ | ❌ |
| 3.6 | ABOUT | ⚠️ Cover listo, sin contenido | ✅ | ❌ |

> Para crear un highlight, se necesita al menos 1 story. Para pruebas, subir story placeholder como Close Friends → crear highlight → asignar cover.

---

## 4. CONFIGURACIÓN TÉCNICA

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 4.1 | Verificar recorte circular del avatar | ❌ Pendiente | Subir `06_Assets/FG_IG_Avatar_Profile_v2.png` y validar en móvil |
| 4.2 | Test de compresión posts | ❌ Pendiente | Subir imagen 1:1 test, comparar pre/post upload |
| 4.3 | Test de compresión Reels | ❌ Pendiente | Subir video test 1080×1920 privado |
| 4.4 | Validar safe zones en device | ❌ Pendiente | Subir pieza con texto en bordes, verificar oclusión |
| 4.5 | Test de carrusel (swipe) | ❌ Pendiente | Subir carrusel draft, verificar transiciones y legibilidad |
| 4.6 | Test de Reel cover en grid | ❌ Pendiente | Verificar que cover custom se muestra correctamente |
| 4.7 | Test de link en bio | ❌ Pendiente | Requiere website deployed |
| 4.8 | Verificar vista de grid | ❌ Pendiente | Revisar coherencia visual del feed planificado |

---

## 5. DOCUMENTACIÓN

| # | Documento | Estado | Ubicación |
|---|-----------|--------|-----------|
| 5.1 | Asset Specs Instagram | ✅ Creado | `02_Brand_System/INSTAGRAM_Asset_Specs.md` |
| 5.2 | Test Protocol Instagram | ✅ Creado | `04_Produccion/INSTAGRAM_Test_Protocol.md` |
| 5.3 | Setup Checklist (este doc) | ✅ Creado | `07_Operaciones/INSTAGRAM_Setup_Checklist.md` |
| 5.4 | Status Report | ✅ Creado | `07_Operaciones/INSTAGRAM_Status_Report.md` |
| 5.5 | Script de preflight automatizado | ✅ Creado | `scripts/instagram_preflight.ps1` |
| 5.6 | Reporte preflight (ultima corrida) | ✅ Generado | `07_Operaciones/INSTAGRAM_Preflight_Report_2026-04-01.md` |

---

## 6. INTEGRACIÓN CON SISTEMA

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 6.1 | Website footer link | ✅ Listo | `https://instagram.com/globalfrequency.es` en `Footer.astro` |
| 6.2 | Website contacto link | ✅ Listo | `contacto.astro` corregido a `https://instagram.com/globalfrequency.es` |
| 6.3 | Brand Kit referencia | ✅ Listo | `FG_Brand_Kit_Operativo.md` incluye handle IG |
| 6.4 | Agents con soporte IG | ✅ Listo | Visual-creator, Content Strategy, Scriptwriting agents |
| 6.5 | Templates de carrusel | ✅ Listo | 4 portadas + 4 interiores por pilar (v4) |
| 6.6 | Overlays de Reel | ✅ Listo | Full + Minimal + Guide (v2) |
| 6.7 | Fondos y elementos | ✅ Listo | 8 fondos + 15 elementos modulares (v5) |
| 6.8 | Figma templates | ⚠️ Parcial | Specs en `FG_Figma_Pending_Phases.md`, no ejecutado |
| 6.9 | Canva templates | ⚠️ Parcial | Spec en `FG_Archivo_Maestro_Visual_Canva.md`, algunos producidos |
| 6.10 | n8n workflows IG | ⚠️ Parcial | WF-008 cloud existe; falta credencial/bridge IG, variable `IG_PUBLISH_WEBHOOK_URL` y pruebas |
| 6.11 | Website build local | ✅ Listo | `npm run build` ejecutado y `website/dist` regenerado |
| 6.12 | Preview deploy URL | ✅ Listo | `website-three-rho-26.vercel.app` responde y muestra handle correcto |
| 6.13 | Dominio canónico | ⚠️ Parcial | `frecuenciaglobal.vercel.app` aliasado, pero protegido por autenticación de Vercel (401) |
| 6.14 | Preflight automatizado | ✅ Listo | Script valida docs, links, assets, dimensiones y URLs con reporte Markdown |

---

## 7. FORMATOS BASE DE OPERACIÓN

### 7.1 Post individual

```
Nombre: FG_IG_POST_[PILAR]_[TEMA]_[VERSION].png
Resolución: 1080×1080 (1:1) o 1080×1350 (4:5)
Elementos: Tag pilar + título + contenido + fuente + isotipo
Caption: Hook + contexto + CTA
Hashtags: 5-15 en primer comentario
Alt text: Obligatorio
```

### 7.2 Carrusel

```
Nombre: FG_IG_CAR_[PILAR]_[TEMA]_[VERSION]_S[N].png
Resolución: 1080×1350 (4:5) todas las slides
Slides: Portada + 4-8 interiores + cierre
Portada: Tag pilar + título + línea de frecuencia + wordmark
Interior: Numeración + headline + body + fuente
Cierre: Wordmark + handle + CTA
Caption: Resumen del tema + CTA a guardar/compartir
```

### 7.3 Reel

```
Nombre: FG_IG_REEL_[PILAR]_[TEMA]_[VERSION].mp4
Resolución: 1080×1920 (9:16)
Duración: 30-60s (óptimo)
Overlay: Full o Minimal según complejidad
Cover: Custom 1080×1920, título en safe zone central
Subtítulos: ≥ 32px, color del pilar para keywords
Caption: Hook + contexto + CTA + hashtags
```

### 7.4 Story

```
Nombre: FG_IG_STORY_[PILAR]_[TEMA]_[VERSION].[png|mp4]
Resolución: 1080×1920 (9:16)
Safe zone: y=250 a y=1620
Branding: Isotipo mínimo + color del pilar
Duración: ≤ 60s si video
Destino: Highlight correspondiente al pilar
```

---

## 8. CONVENCIÓN DE NAMING

```
FG_IG_[FORMATO]_[PILAR]_[TEMA]_[VERSION].[ext]
```

| Código | Significado |
|--------|-------------|
| `POST` | Post individual |
| `CAR` | Carrusel (slide) |
| `REEL` | Reel / video vertical |
| `STORY` | Story |
| `COVER` | Cover de Reel o Highlight |
| `GD` | Geopolitik Drop |
| `BB` | Bass & Borders |
| `FG` | Frecuencia Global |
| `BP` | Behind the Policy |

Ejemplo: `FG_IG_CAR_GD_CablesSubmarinos_v1_S01.png`

---

## 9. CHECKLIST PRE-PUBLICACIÓN

Antes de publicar cualquier pieza:

- [ ] Pieza pasó el Test Protocol correspondiente (post/carrusel/reel/story)
- [ ] Caption redactado y revisado
- [ ] Hashtags preparados (primer comentario)
- [ ] Alt text escrito
- [ ] Cover custom asignado (si Reel)
- [ ] Vista previa de grid verificada
- [ ] Hora de publicación decidida
- [ ] Pilar y highlight destino definidos
- [ ] Sin bloqueadores de marca o legales

---

## 10. CHECKLIST POST-PUBLICACIÓN

Después de publicar:

- [ ] Post visible en grid, sin errores visuales
- [ ] Hashtags pegados en primer comentario
- [ ] Link en bio actualizado si aplica
- [ ] Story de acompañamiento publicada (si aplica)
- [ ] Registro de publicación actualizado
- [ ] Métricas a revisar en 24h: reach, saves, shares

---

## 11. ANTES DE PUBLICAR (PRE-LAUNCH GATE)

No publicar contenido oficial hasta cumplir:

- [ ] Foto de perfil subida y validada (recorte circular OK)
- [ ] Bio aprobada y configurada
- [ ] Link funcional en perfil
- [ ] Categoría y tipo de cuenta configurados
- [ ] Highlights creados con covers correctos
- [ ] Al menos 1 prueba por formato (post, carrusel, reel, story)
- [x] Inconsistencia de handle en `contacto.astro` corregida
- [ ] Protocolo de test ejecutado al menos 1 vez por formato
- [ ] Grid preview validado

---

## PROGRESO GENERAL

```
Cuenta:          ████░░░░░░  40%
Assets:          ███████░░░  70%
Highlights:      ████░░░░░░  40% (covers listos, sin contenido)
Config técnica:  ░░░░░░░░░░   0%
Documentación:   ██████████ 100%
Integración:     ████████░░  80%
Formatos base:   ██████████ 100%
───────────────────────────────
TOTAL:           ██████░░░░  58%
```
