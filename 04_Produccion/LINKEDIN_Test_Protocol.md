# LinkedIn — Test Protocol

**Sistema:** Frecuencia Global  
**Versión:** 1.0  
**Fecha:** 2026-04-01  
**Objetivo:** Validar que LinkedIn está técnicamente listo para operar en modo prueba antes de publicación oficial.

---

## 0. PRE-CONDICIONES

Antes de iniciar pruebas:

- Company page existe (`/company/frecuencia-global`)
- Logo y banner cargados en LinkedIn
- Website desplegado (o staging público accesible)
- Al menos 1 asset de prueba por formato:
  - Post image `1200×627`
  - Documento PDF (carrusel) `1080×1350` por slide
  - Cover de artículo `1200×627`

---

## 1. TEST DE PERFIL (COMPANY PAGE)

| Ítem | Validación | Resultado |
|------|-----------|-----------|
| 1.1 | Display name visible: `Frecuencia Global` | ☐ |
| 1.2 | URL personalizada correcta: `/company/frecuencia-global` | ☐ |
| 1.3 | Tagline visible y sin truncado crítico | ☐ |
| 1.4 | About/Descripción legible y con saltos correctos | ☐ |
| 1.5 | Website link clickeable y abre en nueva pestaña | ☐ |
| 1.6 | Sector, tamaño empresa y metadata visibles | ☐ |
| 1.7 | CTA button visible (si aplica) | ☐ |
| 1.8 | Coherencia idioma (español) en todos los campos | ☐ |

### Criterio de aprobación

- 8/8 checks en estado OK
- Sin truncados críticos en tagline/about
- Sin enlaces rotos

---

## 2. TEST DE BANNER / COVER

| Ítem | Validación | Resultado |
|------|-----------|-----------|
| 2.1 | Resolución correcta (`1584×396`) | ☐ |
| 2.2 | Wordmark legible en desktop | ☐ |
| 2.3 | Tagline legible en desktop | ☐ |
| 2.4 | Wordmark legible en móvil | ☐ |
| 2.5 | Tagline legible en móvil | ☐ |
| 2.6 | Sin elementos críticos bajo zona de avatar | ☐ |
| 2.7 | Sin recorte de texto en extremos | ☐ |
| 2.8 | Color acento azul `#4A6BFF` consistente | ☐ |
| 2.9 | Estilo sobrio Behind the Policy (sin exceso de glow) | ☐ |

### Criterio de aprobación

- 9/9 checks en estado OK
- Visual estable en desktop + móvil

---

## 3. TEST DE LOGO (FOTO DE PERFIL)

| Ítem | Validación | Resultado |
|------|-----------|-----------|
| 3.1 | Resolución adecuada (`>=400×400`) | ☐ |
| 3.2 | Isotipo centrado | ☐ |
| 3.3 | Contraste correcto sobre fondo LinkedIn | ☐ |
| 3.4 | Se reconoce en tamaño miniatura (feed) | ☐ |
| 3.5 | Sin pixelado en retina/high-DPI | ☐ |

### Criterio de aprobación

- 5/5 checks en estado OK

---

## 4. TEST DE POST IMAGE (1200×627)

Publicar un post de prueba con imagen horizontal.

| Ítem | Validación | Resultado |
|------|-----------|-----------|
| 4.1 | Imagen se muestra completa en feed desktop | ☐ |
| 4.2 | Imagen se muestra completa en feed móvil | ☐ |
| 4.3 | Texto dentro de imagen es legible en móvil | ☐ |
| 4.4 | Pill `[BEHIND THE POLICY]` legible | ☐ |
| 4.5 | Compresión de LinkedIn no destruye calidad | ☐ |
| 4.6 | Caption conserva saltos de línea | ☐ |
| 4.7 | Hashtags renderizan correctamente | ☐ |
| 4.8 | Link en caption es clickeable (si aplica) | ☐ |

### Criterio de aprobación

- 8/8 checks en estado OK
- Legibilidad mínima garantizada en móvil

---

## 5. TEST DE DOCUMENTO/CARRUSEL (PDF)

Publicar un documento PDF de prueba (6-8 slides).

| Ítem | Validación | Resultado |
|------|-----------|-----------|
| 5.1 | PDF sube sin error | ☐ |
| 5.2 | Portada (slide 1) se muestra correctamente | ☐ |
| 5.3 | Slides interiores se renderizan nítidas | ☐ |
| 5.4 | Swipe desktop funciona | ☐ |
| 5.5 | Swipe móvil funciona | ☐ |
| 5.6 | Texto en slides legible en móvil | ☐ |
| 5.7 | Slide de cierre visible y legible | ☐ |
| 5.8 | Título del documento aparece correctamente | ☐ |
| 5.9 | No hay saltos o páginas en blanco no deseadas | ☐ |
| 5.10 | Peso del PDF dentro de límites aceptables | ☐ |

### Criterio de aprobación

- 10/10 checks en estado OK
- Navegación fluida desktop + móvil

---

## 6. TEST DE ARTÍCULO LINKEDIN

Crear artículo de prueba (borrador o publicado) con cover.

| Ítem | Validación | Resultado |
|------|-----------|-----------|
| 6.1 | Cover 1200×627 se renderiza correctamente | ☐ |
| 6.2 | Título del artículo visible sin truncado crítico | ☐ |
| 6.3 | Nombre del autor correcto (Farid Assad / Frecuencia Global) | ☐ |
| 6.4 | Cuerpo del artículo conserva formato (H2, listas, párrafos) | ☐ |
| 6.5 | Links internos/externos funcionan | ☐ |
| 6.6 | Preview al compartir el artículo se ve correcta | ☐ |
| 6.7 | Tiempo de carga aceptable en móvil | ☐ |
| 6.8 | Toque visual coincide con pilar Behind the Policy | ☐ |

### Criterio de aprobación

- 8/8 checks en estado OK
- Cover + estructura editorial sin fallos

---

## 7. TEST DE LINK PREVIEW (WEBSITE → LINKEDIN)

Validar `og:` tags con LinkedIn Post Inspector.

| Ítem | Validación | Resultado |
|------|-----------|-----------|
| 7.1 | URL analizada en Post Inspector sin errores críticos | ☐ |
| 7.2 | `og:title` correcto | ☐ |
| 7.3 | `og:description` correcto | ☐ |
| 7.4 | `og:image` carga correctamente | ☐ |
| 7.5 | Proporción OG image adecuada para LinkedIn (1200×627 ideal) | ☐ |
| 7.6 | Recache forzado aplicado tras cambios (si hubo cambios) | ☐ |

### Criterio de aprobación

- 6/6 checks en estado OK
- Link preview estable al compartir en post

---

## 8. CONSISTENCIA VISUAL Y DE MARCA

| Ítem | Validación | Resultado |
|------|-----------|-----------|
| 8.1 | Paleta respetada (`#0A0A0F`, `#4A6BFF`, `#FFFFFF`, `#A0A0B8`) | ☐ |
| 8.2 | Tipografías correctas (Bebas Neue / Space Grotesk / JetBrains Mono) | ☐ |
| 8.3 | Pill `[BEHIND THE POLICY]` consistente | ☐ |
| 8.4 | Tono visual sobrio y profesional (sin exceso de FX) | ☐ |
| 8.5 | Naming de assets consistente (`FG_*`) | ☐ |
| 8.6 | Coherencia con X/IG/TikTok en identidad núcleo | ☐ |

### Criterio de aprobación

- 6/6 checks en estado OK

---

## 9. REGISTRO DE PRUEBAS

Completar por cada corrida:

| Fecha | Tester | Entorno | Casos ejecutados | Fallos críticos | Estado final |
|------|--------|---------|------------------|----------------|-------------|
| YYYY-MM-DD | Nombre | Desktop + Mobile | 1-8 | # | ✅/⚠️/❌ |

### Fallos encontrados

| ID | Caso | Descripción | Severidad | Acción correctiva | Estado |
|----|------|-------------|-----------|-------------------|--------|
| LI-001 | 2.4 | Ejemplo: tagline no legible en móvil | Alta | Reexport banner con mayor contraste | Abierto |

---

## 10. ERRORES FRECUENTES (CHECK RÁPIDO)

- Subir banner con dimensiones de X (`1500×500`) en vez de LinkedIn (`1584×396`)
- Texto demasiado cerca de zona avatar (esquina inferior izquierda)
- Cargar post image 16:9 con texto demasiado pequeño para móvil
- Exportar carrusel como PNG suelto en vez de PDF
- Usar demasiados hashtags (>5) y perder tono profesional
- No recachear OG preview tras actualizar imagen/título
- Mezclar acento cian en piezas que deberían priorizar azul Behind the Policy

---

## 11. DEFINICIÓN DE "LISTO PARA PRUEBAS"

LinkedIn se considera **LISTO PARA PRUEBAS** cuando:

- Perfil Company Page completo (sección 1 al 100%)
- Assets clave cargados (logo + banner)
- 1 post image test validado
- 1 documento/carrusel test validado
- 1 artículo test validado
- Link previews validadas con Post Inspector
- Registro de pruebas con al menos una corrida completa

---

## 12. RUN 001 — EJECUCIÓN INMEDIATA (30-45 MIN)

Objetivo: completar la primera corrida real en plataforma para pasar de "Parcialmente lista" a "Lista para pruebas".

Orden recomendado:

1. Configurar Company Page (sección 1)
2. Validar banner y logo (secciones 2 y 3)
3. Publicar post image de prueba (sección 4)
4. Publicar documento/carrusel PDF de prueba (sección 5)
5. Crear artículo de prueba con cover (sección 6)
6. Validar previews en Post Inspector (sección 7)
7. Cerrar consistencia de marca (sección 8)
8. Registrar resultados en `07_Operaciones/LINKEDIN_Test_Run_001.md`

Regla de cierre:

- Si hay fallos de severidad alta: no publicar oficialmente
- Si solo hay fallos medios/bajos: corregir y repetir casos impactados

### Automatizacion de registro (terminal)

Generar log de corrida sin tocar estado global:

```powershell
./scripts/linkedin_run.ps1 -RunId 001 -Tester "Farid"
```

Generar log y actualizar checklist/status cuando la corrida este completa (sin PENDING):

```powershell
./scripts/linkedin_run.ps1 -RunId 001 -Tester "Farid" -B1 OK -B2 OK -B3 OK -B4 OK -B5 OK -B6 OK -B7 OK -B8 OK -CriticalFailures 0 -ApplyStatusUpdates
```

Pipeline completo (preflight + run log) en un comando:

```powershell
./scripts/linkedin_pipeline.ps1 -RunId 001 -Tester "Farid"
```

Pipeline completo y cierre de estado cuando todo da OK:

```powershell
./scripts/linkedin_pipeline.ps1 -RunId 001 -Tester "Farid" -B1 OK -B2 OK -B3 OK -B4 OK -B5 OK -B6 OK -B7 OK -B8 OK -CriticalFailures 0 -ApplyStatusUpdates
```

---

*Generado: 2026-04-01*  
*Referencia: `07_Operaciones/LINKEDIN_Setup_Checklist.md`, `02_Brand_System/LINKEDIN_Asset_Specs.md`, `website/src/layouts/BaseLayout.astro`*
