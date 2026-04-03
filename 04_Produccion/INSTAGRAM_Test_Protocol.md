# INSTAGRAM — Test Protocol

**Sistema:** Frecuencia Global  
**Versión:** 1.0  
**Fecha:** 2026-04-01  
**Estado:** Activo — Pre-publicación

---

## PROPÓSITO

Protocolo para validar piezas antes de publicarlas en Instagram. Ninguna pieza sale al público sin pasar por este flujo completo. Durante la fase actual (pre-lanzamiento), todas las pruebas se realizan en modo borrador o subidas privadas de prueba.

---

## 1. FLUJO DE PRUEBA

```
Pieza final (PNG / MP4)
  → Revisión en desktop (Canva / local)
  → Revisión en móvil (pantalla real)
  → Checklist de validación
  → Aprobado → marcar como "listo para publicación"
  → No aprobado → anotar corrección → re-editar → repetir
```

### Opciones de prueba sin publicar

| Método | Cómo | Ventaja |
|--------|------|---------|
| **Draft en Instagram** | Crear post → Configuración avanzada → Guardar borrador | Vista real en app sin publicar |
| **Archivo privado** | Publicar → Archivar inmediatamente | Test de compresión real, no visible en grid |
| **Close Friends (Stories)** | Story → Close Friends (solo tu cuenta) | Test de stories sin audiencia |
| **Preview app** | Usar app de preview de grid (Planoly, Preview, etc.) | Simular cómo se ve el feed completo |
| **Envío a uno mismo** | Compartir por DM a tu cuenta secundaria | Vista de cómo se ve en inbox |

---

## 2. CHECKLIST DE VALIDACIÓN — POSTS (1:1 y 4:5)

### A. Render y calidad visual

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 1 | Resolución correcta | 1080×1080 (1:1) o 1080×1350 (4:5) | |
| 2 | Sin pixelación | Exportado a calidad ≥85%, sin artefactos | |
| 3 | Colores correctos | Paleta FG respetada: `#0A0A0F`, `#00E5FF`, `#FF00E5`, `#B8FF00`, `#4A6BFF` | |
| 4 | Formato correcto | PNG (gráficos) o JPEG ≥85% (fotos) | |
| 5 | Texto dentro de safe zone | Margen 60px lateral, 80px sup/inf (4:5) | |

### B. Branding

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 6 | Tag de pilar presente | `[PILAR]` en JetBrains Mono, color del pilar | |
| 7 | Tipografía correcta | Bebas Neue display, Space Grotesk body, JetBrains Mono datos | |
| 8 | Isotipo/wordmark FG | Presente si la pieza lo requiere | |
| 9 | Línea de frecuencia | Presente, color del pilar | |
| 10 | Fondo correcto | `#0A0A0F` base o fondo del catálogo (v5) | |

### C. Legibilidad

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 11 | Texto legible en móvil | Verificar en pantalla ≤ 6.5" | |
| 12 | Contraste suficiente | Texto blanco sobre fondo oscuro visible | |
| 13 | Jerarquía clara | Título → subtítulo → body diferenciados | |
| 14 | Sin typos | Revisión ortográfica completa | |
| 15 | Fuente mínima | ≥ 24px para texto principal en post | |

### D. Caption y metadata

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 16 | Caption redactado | Hook + contexto en ≤ 2200 chars | |
| 17 | Hashtags | 5-15 relevantes, sin spam | |
| 18 | Mención de marca | `@globalfrequency.es` si aplica | |
| 19 | CTA claro | Guardar, compartir, seguir, o pregunta | |
| 20 | Alt text | Descripción accesible de la imagen | |

### E. Vista en dispositivo

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 21 | Vista en móvil | Revisado en teléfono real | |
| 22 | Vista en grid | Thumbnail 1:1 se ve coherente con el feed | |
| 23 | Consistencia de grid | Colores y estilo consistentes con posts anteriores | |

---

## 3. CHECKLIST DE VALIDACIÓN — CARRUSEL

Aplican todos los checks de la sección 2, más:

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| C1 | Portada con hook | Slide 1 tiene título claro y atractivo | |
| C2 | Numeración de slides | Cada slide muestra posición (ej. 2/8) | |
| C3 | Flujo narrativo | Los slides se leen como secuencia lógica | |
| C4 | Slide de cierre | Último slide con CTA + handle + wordmark | |
| C5 | Consistencia visual | Todos los slides mantienen mismo layout base | |
| C6 | Máximo de slides | ≤ 20 slides (recomendado 5-10) | |
| C7 | Grid preview | Slide 1 se ve bien como cuadrado en el feed | |
| C8 | Fuentes citadas | Si hay datos, fuente visible en el slide o al final | |
| C9 | Swipe flow | Verificar en móvil que el swipe es fluido | |
| C10 | Formato consistente | Todos los slides mismo aspect ratio (4:5) | |

---

## 4. CHECKLIST DE VALIDACIÓN — STORIES

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| S1 | Resolución | 1080×1920 exacto | |
| S2 | Top safe zone | Nada crítico en y: 0–250 (barra estado + username) | |
| S3 | Bottom safe zone | Nada crítico en y: 1620–1920 (responder, nav) | |
| S4 | Lateral safe zone | Margen ≥ 60px a cada lado | |
| S5 | Texto legible | ≥ 32px, contraste suficiente | |
| S6 | Duración adecuada | ≤ 60s por segmento | |
| S7 | Stickers nativos | No tapan contenido clave | |
| S8 | CTA presente | Si aplica: link sticker, encuesta, pregunta | |
| S9 | Branding mínimo | Isotipo o nombre de marca visible | |
| S10 | Test en Close Friends | Probado sin audiencia real | |

---

## 5. CHECKLIST DE VALIDACIÓN — REELS

### A. Video técnico

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| R1 | Resolución | 1080×1920, sin bordes negros laterales | |
| R2 | FPS | 30fps constante | |
| R3 | Bitrate | ≥ 6 Mbps | |
| R4 | Codec | H.264, container MP4 | |
| R5 | Audio | AAC ≥ 128kbps | |
| R6 | Duración | 15–90s (óptimo 30–60s) | |

### B. Safe zones (Reels)

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| R7 | Top safe | Nada crítico en y: 0–250 | |
| R8 | Bottom safe | Nada crítico en y: 1620–1920 | |
| R9 | Right icons | Nada en x: 980–1080, y: 900–1400 | |
| R10 | Content safe | Todo el contenido en y: 250–1620, x: 60–980 | |

### C. Branding y overlay

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| R11 | Pill de pilar | Presente, color correcto, posición correcta | |
| R12 | Isotipo FG | Visible, no tapado por UI de Instagram | |
| R13 | Overlay consistente | Según spec en `INSTAGRAM_Asset_Specs.md` §7 | |
| R14 | Lower third | Si aplica, barra dentro de zona segura | |
| R15 | Línea de frecuencia | Presente, color del pilar | |

### D. Audio

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| R16 | Audio presente | No hay silencio accidental | |
| R17 | Voz clara | Voiceover audible sobre música | |
| R18 | Niveles | No clipea, no demasiado bajo | |
| R19 | Música sincronizada | Drops alineados con cambios visuales | |
| R20 | Sin copyright issues | Track original o licenciada | |

### E. Subtítulos

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| R21 | Legibles | ≥ 32px, con contraste | |
| R22 | Timing | Sincronizados con audio | |
| R23 | Keywords resaltadas | Color del pilar, no colores random | |
| R24 | Sin typos | Revisión ortográfica | |
| R25 | Duración texto | Cada bloque visible ≥ 2 segundos | |

### F. Cover de Reel

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| R26 | Cover asignado | No usar auto-frame, cover diseñado | |
| R27 | Zona visible en grid | Título dentro del centro cuadrado (y: 420–1500) | |
| R28 | Safe zone título | Texto dentro de 900×900 central | |
| R29 | Consistencia grid | Cover coherente con el resto del feed | |
| R30 | Legible en miniatura | Texto legible a ~150px de ancho | |

### G. Caption y metadata (Reels)

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| R31 | Caption redactado | Hook + contexto + CTA ≤ 2200 chars | |
| R32 | Hashtags | 5-15 relevantes | |
| R33 | Cover seleccionado | Cover custom subido | |

---

## 6. PROTOCOLO DE COMPRESIÓN — INSTAGRAM

### Imágenes (Posts / Carruseles)

```
Formato: PNG (gráficos) o JPEG calidad ≥ 85%
Resolución: 1080×1080 (1:1) o 1080×1350 (4:5)
Color space: sRGB
DPI: 72
Máx tamaño archivo: < 30 MB
```

### Video (Reels / Stories)

```
Codec: H.264
Resolución: 1080×1920
FPS: 30
Bitrate: 6–8 Mbps (CBR o VBR 2-pass)
Audio: AAC 128kbps, 44.1kHz
Container: MP4
Máx tamaño: ≤ 250 MB (Reels), ≤ 30 MB (Stories)
```

### Si Instagram re-comprime agresivamente

1. Subir a la mayor calidad posible
2. Verificar que texto pequeño siga legible post-upload
3. Si el texto se vuelve ilegible:
   - Aumentar tamaño de fuente (+4px)
   - Aumentar contraste del fondo
   - Re-subir y re-verificar
4. Para imágenes: si JPEG se degrada, probar PNG

---

## 7. PRUEBA DE PERFIL

Antes de publicar contenido, validar el perfil completo:

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| P1 | Avatar visible | Recorte circular correcto, isotipo reconocible | |
| P2 | Display name | "Frecuencia Global" — sin variaciones | |
| P3 | Bio legible | ≤ 150 chars, tagline + descripción + CTA | |
| P4 | Link funcional | URL abre correctamente, página carga | |
| P5 | Categoría | Configurada como Education o News & Media | |
| P6 | Cuenta profesional | Creator o Business activada | |
| P7 | Botones contacto | Si aplica, email o website configurados | |
| P8 | Highlight covers | 6 covers circulares visibles y coherentes | |
| P9 | Grid vacío coherente | Sin publicaciones random de prueba visibles | |

---

## 8. PRUEBA DE HIGHLIGHTS

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| H1 | 6 highlights creados | SERIES, NEWS, POLICY, BORDERS, MAPS, ABOUT | |
| H2 | Covers circulares | Recorte no corta ícono ni texto | |
| H3 | Nombres correctos | Uppercase, máx 10 chars | |
| H4 | Colores correctos | Cada highlight usa color de su pilar | |
| H5 | Contenido placeholder | Al menos 1 story por highlight (puede ser test) | |
| H6 | Orden correcto | Orden lógico en el perfil | |

---

## 9. ERRORES FRECUENTES A EVITAR

| Error | Consecuencia | Prevención |
|-------|-------------|------------|
| Texto en bottom safe zone (Reels) | UI de Instagram lo tapa | Mantener texto arriba de y=1620 |
| Texto demasiado pequeño | Ilegible en móvil | Mínimo 24px posts, 32px Reels/Stories |
| Carrusel sin slide de cierre | Sin CTA, pierde conversión | Siempre incluir cierre con handle |
| Cover de Reel sin safe zone | Título cortado en grid | Diseñar considerando centro cuadrado |
| Colores fuera de paleta | Rompe identidad visual | Verificar hex contra Brand Kit |
| Grid inconsistente | Perfil se ve caótico | Planear publicaciones con preview de grid |
| Imagen 16:9 en feed | Bordes negros o recorte forzado | Usar solo 1:1 o 4:5 para feed |
| Alt text vacío | Accesibilidad pobre, SEO perdido | Siempre completar alt text |
| Hashtags en caption principal | Ruido visual | Usar primer comentario para hashtags |

---

## 10. REGISTRO DE PRUEBAS

Para cada prueba, registrar:

```markdown
### Test [ID] — [Fecha]

- **Pieza:** [nombre/ID]
- **Formato:** [Post 1:1 / Post 4:5 / Carrusel / Story / Reel]
- **Pilar:** [pilar]
- **Checks passed:** [N/total]
- **Issues encontrados:**
  - [ ] [descripción del issue]
- **Acción:** [aprobado / re-editar / cambio específico]
- **Notas:** [observaciones]
- **Screenshots:** [si aplica, referencia al archivo]
```

---

## 11. CRITERIO DE APROBACIÓN

Una pieza está **LISTA PARA PUBLICACIÓN** cuando:

- [ ] Todos los checks del formato correspondiente pasados
- [ ] Revisada en dispositivo móvil real
- [ ] Caption, hashtags y alt text aprobados
- [ ] Cover diseñado (si es Reel)
- [ ] Vista de grid verificada
- [ ] Sin bloqueadores de marca o legales
- [ ] Registrada en el log de pruebas

---

## REFERENCIAS

- `02_Brand_System/INSTAGRAM_Asset_Specs.md` — Specs completas de assets
- `02_Brand_System/FG_Brand_Kit_Operativo.md` — Paleta, tipografía, reglas de marca
- `system/rules/RULE_Visual_Consistency.md` — Reglas de consistencia visual
- `04_Produccion/FG_Flujo_Produccion_Video.md` — Flujo de producción para Reels
