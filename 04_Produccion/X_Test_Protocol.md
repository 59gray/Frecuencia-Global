# X — Test Protocol

**Sistema:** Frecuencia Global  
**Versión:** 1.0  
**Fecha:** 2026-04-01  
**Estado:** Activo — Pre-publicación

---

## PROPÓSITO

Protocolo técnico para validar el perfil, assets y contenido de X antes de publicar oficialmente. Durante la fase actual (pre-lanzamiento), todas las pruebas se realizan sin publicación pública.

---

## 1. PRUEBA DE PERFIL

Verificar que todos los elementos del perfil se ven correctos en desktop y móvil.

### Checklist de validación visual del perfil

| # | Check | Criterio | Desktop | Móvil |
|---|-------|----------|---------|-------|
| 1 | Avatar visible | Isotipo FG reconocible a 48px (timeline) y 400px (perfil) | | |
| 2 | Avatar sin recorte | Circular crop no corta elementos del isotipo | | |
| 3 | Display name legible | "Frecuencia Global" sin truncar | | |
| 4 | Handle visible | `@frec_global` completo | | |
| 5 | Bio completa | Texto completo visible, emojis renderizan correctamente | | |
| 6 | Link funcional | Clic en link lleva al website correcto | | |
| 7 | Banner sin recorte | Wordmark y tagline visibles, no cortados | | |
| 8 | Banner en móvil | Zona central visible, márgenes no tapan info | | |
| 9 | Coherencia general | Perfil se siente profesional y consistente con la marca | | |

---

## 2. PRUEBA DE BANNER

El banner es el asset más propenso a recorte. Validar con cuidado.

### Procedimiento

1. Subir banner 1500×500
2. Verificar en desktop:
   - ¿Se ve el wordmark completo?
   - ¿La tagline es legible?
   - ¿La línea de frecuencia es visible?
3. Verificar en móvil:
   - ¿La zona central (~1500×200) se mantiene?
   - ¿Hay contenido cortado?
4. Verificar con avatar sobrepuesto:
   - El avatar circular se superpone al banner en la esquina inferior izquierda
   - ¿Hay conflicto visual?

### Zonas de recorte del banner

```
DESKTOP: ~1500×500 completo visible
MÓVIL:   ~1500×250 zona central visible (recorte superior/inferior ~125px)

┌──────────────────────────────────────────┐
│ ░░░░░░░░░░ PUEDE CORTARSE ░░░░░░░░░░░░░ │  ← ~125px top
├──────────────────────────────────────────┤
│                                          │
│    ZONA SEGURA MÓVIL (~250px alto)       │  ← Centro garantizado
│    → Wordmark, tagline, línea aquí       │
│                                          │
├──────────────────────────────────────────┤
│ ░░░░░░░░░░ PUEDE CORTARSE ░░░░░░░░░░░░░ │  ← ~125px bottom
│ ○ Avatar                                 │  ← Avatar sobrepuesto (esq. inf. izq.)
└──────────────────────────────────────────┘
```

---

## 3. PRUEBA DE AVATAR

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 1 | Tamaño correcto | 400×400 mínimo, subido sin error | |
| 2 | Crop circular | Isotipo no cortado por el recorte circular | |
| 3 | Legibilidad en timeline | Reconocible a 48×48 px (tamaño en feed) | |
| 4 | Consistencia | Mismo isotipo que YouTube, TikTok, Instagram | |
| 5 | Fondo | `#0A0A0F` — se ve bien contra el fondo de X (blanco/oscuro) | |
| 6 | Tema oscuro vs claro | Avatar funciona en ambos temas de X | |

---

## 4. PRUEBA DE POST (TWEET INDIVIDUAL)

Crear un tweet de prueba (no publicar, o publicar y borrar inmediatamente) para validar:

### Opciones de prueba sin publicar

- **Opción A:** Usar la vista de "componer tweet" para preview visual (no enviar)
- **Opción B:** Usar cuenta alternativa/privada para tests reales
- **Opción C:** Publicar y borrar en <30 segundos (último recurso)

### Checklist de post individual

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 1 | Texto dentro de 280 chars | Cabe completo sin truncar | |
| 2 | Imagen adjunta visible | 1200×675, sin recorte extraño | |
| 3 | Imagen legible | Texto en imagen ≥ 24px, contraste suficiente | |
| 4 | Colores fieles | Cian/magenta no alterados por compresión | |
| 5 | Pill de pilar visible | `[GEOPOLITIK DROP]` legible en la imagen | |
| 6 | Link preview | Card de link se genera con título + imagen + descripción | |
| 7 | Hashtags | 1-3 relevantes, sin spam | |
| 8 | Mention de marca | Si aplica, `@frec_global` linkea correctamente | |

---

## 5. PRUEBA DE THREAD (HILO)

### Estructura de thread FG

```
Tweet 1 (Hook):     Dato impactante o pregunta provocadora + imagen de apertura + 🧵
Tweet 2-N (Body):   Análisis secuencial, un concepto por tweet, datos/imágenes donde aporta
Tweet N+1 (Cierre): Resumen + CTA ("Sigue @frec_global para más análisis") + card de cierre
```

### Checklist de thread

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 1 | Longitud | 8-12 tweets, cada uno ≤280 chars | |
| 2 | Numeración | Tweets numerados (1/, 2/, ... o 🧵1, 🧵2) | |
| 3 | Hook | Primer tweet engancha — dato o pregunta | |
| 4 | Ritmo | Cada tweet aporta una idea concreta | |
| 5 | Imágenes | Al menos 2-3 imágenes de apoyo (datos, mapas, gráficos) | |
| 6 | Cierre con CTA | Último tweet tiene call-to-action claro | |
| 7 | Card de cierre | Imagen branded con isotipo + link | |
| 8 | Continuidad visual | Todas las imágenes usan misma paleta/sistema | |
| 9 | Self-reply chain | Todos los tweets están en respuesta al anterior (forman hilo) | |
| 10 | Legibilidad móvil | Texto fluye bien en pantalla angosta | |

---

## 6. PRUEBA DE LINK PREVIEW

Verificar que los links del website generan cards correctos en X.

### Procedimiento

1. Ir a [Twitter Card Validator](https://cards-dev.twitter.com/validator) (o pegar link en compose)
2. Probar URLs:
   - `https://frecuenciaglobal.vercel.app` (home)
   - `https://frecuenciaglobal.vercel.app/contenido/cables-submarinos-geopolitica-internet`
   - `https://frecuenciaglobal.vercel.app/pilares/geopolitik-drop`
3. Verificar:

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 1 | Card type | `summary_large_image` — imagen grande visible | |
| 2 | Título | Correcto, no truncado | |
| 3 | Descripción | Presente y relevante | |
| 4 | Imagen | Se carga, resolución adecuada, no pixelada | |
| 5 | URL visible | Dominio mostrado correctamente | |
| 6 | `twitter:site` | Muestra `@frec_global` como fuente | |

---

## 7. PRUEBA DE CONSISTENCIA VISUAL

Comparar el perfil de X con las otras plataformas:

| # | Check | Plataformas comparadas | ✅/❌ |
|---|-------|----------------------|-------|
| 1 | Avatar igual en todas | X vs YouTube vs TikTok vs IG | |
| 2 | Display name idéntico | "Frecuencia Global" en todas | |
| 3 | Bio coherente en tono | Similar tagline/posicionamiento | |
| 4 | Link principal igual | Mismo URL del website | |
| 5 | Colores del perfil | Palette FG respetada | |

---

## 8. REGISTRO DE PRUEBAS

| # | Fecha | Prueba | Resultado | Notas | Acción |
|---|-------|--------|-----------|-------|--------|
| 1 | 2026-04-01 | Asset avatar generado | ✅ | `FG_MK_Avatar_X-Profile_v1.png` (400×400) producido | Subir en X y validar crop |
| 2 | 2026-04-01 | Asset banner generado | ✅ | `FG_MK_BNR_X-Header_v1.png` (1500×500) producido | Subir en X y validar recorte móvil |
| 3 | 2026-04-01 | Templates post base generados | ✅ | 4 variantes por pilar en `06_Assets/FG_[GD|BB|FG|BP]_Template_Post_XBase_v1.png` | Usar como base de pruebas de copy corto |
| 4 | 2026-04-01 | Templates thread base generados | ✅ | 4 variantes por pilar en `06_Assets/FG_[GD|BB|FG|BP]_Template_Thread_XBase_v1.png` | Usar en pruebas de hilo |
| 5 | 2026-04-01 | Card cierre thread generada | ✅ | `06_Assets/FG_GN_Template_ThreadClose_X_v1.png` | Usar en tweet final de hilo |
| 6 | | Post individual | | | |
| 7 | | Thread completo | | | |
| 8 | 2026-04-01 | Link preview home (metadata) | ⚠️ Parcial | Deploy activo + meta tags `twitter:*` detectados en HTML publicado | Validar render final en X/Card Validator |
| 9 | | Link preview artículo | | | |
| 10 | | Consistencia cross-platform | | | |

---

## 9. ERRORES FRECUENTES EN X

| Error | Causa | Solución |
|-------|-------|----------|
| Banner cortado en móvil | Contenido fuera de zona central | Centrar todos los elementos en franja ~250px |
| Avatar ilegible en feed | Demasiado detalle a 48px | Usar isotipo simple, no wordmark |
| Imagen de post borrosa | Subida como JPEG de baja calidad | PNG para gráficos con texto, JPEG ≥85% para fotos |
| Link preview no genera | Falta meta tags OG/Twitter | Verificar `BaseLayout.astro`, cachear con Card Validator |
| Thread se rompe | Tweets no en reply chain | Construir cada tweet como reply al anterior |
| Colores distorsionados | Compresión de X | Subir PNG para colores exactos, evitar gradientes sutiles |
| Texto truncado en card | Título o descripción muy largos | Título ≤70 chars, descripción ≤200 chars |

---

*Generado: 2026-04-01*  
*Referencia: `02_Brand_System/X_Asset_Specs.md`, `system/rules/RULE_File_Output_Standards.md`*
