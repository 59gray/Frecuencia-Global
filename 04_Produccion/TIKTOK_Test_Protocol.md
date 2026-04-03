# TIKTOK — Test Protocol

**Sistema:** Frecuencia Global  
**Versión:** 1.0  
**Fecha:** 2026-04-01  
**Estado:** Activo — Pre-publicación

---

## PROPÓSITO

Protocolo para validar piezas de video antes de publicarlas en TikTok. Ninguna pieza sale al público sin pasar por este flujo completo. Durante la fase actual (pre-lanzamiento), todas las pruebas se realizan en modo privado.

---

## 1. FLUJO DE PRUEBA PRIVADA

```
Pieza editada (MP4 final)
  → Upload a TikTok como "solo yo" (privado)
  → Revisión en móvil (pantalla real)
  → Checklist de validación
  → Aprobado → marcar como "listo para publicación"
  → No aprobado → anotar corrección → re-editar → repetir
```

### Configuración de upload privado

1. Abrir TikTok → botón `+`
2. Subir video
3. En la pantalla de publicación:
   - **Quién puede ver este video:** `Solo yo`
   - **Permitir comentarios:** Off
   - **Permitir Duet:** Off
   - **Permitir Stitch:** Off
4. Publicar (queda privado, solo visible para la cuenta)

---

## 2. CHECKLIST DE VALIDACIÓN — PRE-PUBLICACIÓN

### A. Render y calidad visual

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 1 | Resolución correcta | 1080×1920, sin bordes negros laterales | |
| 2 | Sin pixelación | Bitrate ≥ 6 Mbps, sin artefactos de compresión | |
| 3 | FPS estable | 30fps constante, sin drops visibles | |
| 4 | Colores correctos | Paleta FG respetada, cian/magenta fieles | |
| 5 | Duración adecuada | 30-90s según formato | |

### B. Safe zones

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 6 | Top safe clear | Nada crítico en y: 0–200 | |
| 7 | Bottom safe clear | Nada crítico en y: 1640–1920 | |
| 8 | Right icons clear | Nada en x: 980–1080, y: 800–1300 | |
| 9 | Texto legible | Todo el texto dentro de content safe zone | |
| 10 | Lower third visible | Barra no tapada por caption de TikTok | |

### C. Branding

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 11 | Pill de pilar | Presente, color correcto, `[PILAR]` visible | |
| 12 | Isotipo FG | Visible en esquina superior derecha | |
| 13 | Tipografía correcta | Bebas Neue para títulos, Space Grotesk para body | |
| 14 | Overlay consistente | Estructura según spec en `TIKTOK_Asset_Specs.md` | |
| 15 | Línea de frecuencia | Presente, color del pilar | |

### D. Audio

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 16 | Audio presente | No hay silencio accidental | |
| 17 | Voz clara | Voiceover audible por encima de música | |
| 18 | Niveles correctos | No clipea, no demasiado bajo | |
| 19 | Música/SFX | Si aplica, alineada con drops visuales | |
| 20 | Audio sin copyright | Track original o licenciada | |

### E. Texto en pantalla / Subtítulos

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 21 | Subtítulos legibles | Tamaño ≥ 32px, contraste suficiente | |
| 22 | Timing correcto | Texto sincronizado con audio | |
| 23 | Palabras clave resaltadas | Color del pilar, no rojo ni colores fuera de paleta | |
| 24 | Sin typos | Revisión ortográfica completa | |
| 25 | Duración de texto | Cada bloque visible ≥ 2 segundos | |

### F. Caption y metadata

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 26 | Caption redactado | Hook + contexto + CTA en ≤ 300 chars | |
| 27 | Hashtags | 3-5 relevantes, sin spam | |
| 28 | Mención de marca | `@frecuenciaglobal` si aplica | |
| 29 | CTA claro | Follow, share, o pregunta al viewer | |

### G. Vista en dispositivo

| # | Check | Criterio | ✅/❌ |
|---|-------|----------|-------|
| 30 | Vista en móvil | Revisado en teléfono real, no solo desktop | |
| 31 | Vista en perfil | Cover/thumbnail se ve bien en grid de perfil | |
| 32 | Carga de video | Se reproduce sin buffering excesivo | |
| 33 | First frame | Frame inicial atractivo (para quienes no autoplay) | |

---

## 3. PROTOCOLO DE COMPRESIÓN

### Exportación recomendada

```
Codec: H.264
Resolución: 1080×1920
FPS: 30
Bitrate: 6–8 Mbps (CBR o VBR 2-pass)
Audio: AAC 128kbps, 44.1kHz
Container: MP4
```

### Si TikTok re-comprime agresivamente

1. Subir a la mayor calidad posible (≤ 287 MB)
2. Verificar que el re-encode de TikTok no destruya texto pequeño
3. Si el texto se vuelve ilegible post-upload:
   - Aumentar tamaño de fuente (+4px)
   - Aumentar contraste del fondo de subtítulos
   - Re-subir y re-verificar

---

## 4. MANEJO DE COVERS

### Opción A — Frame del video
1. En el editor de TikTok, seleccionar el frame más impactante
2. Verificar que el frame tenga texto legible y composición clara
3. Preferir frames con título visible + branding

### Opción B — Cover personalizado
1. Diseñar en Canva con template `cover TikTok` (1080×1920)
2. Texto limitado: máximo 5 palabras (Bebas Neue, UPPERCASE)
3. Importar al publicar desde la galería del dispositivo

---

## 5. ERRORES FRECUENTES A EVITAR

| Error | Consecuencia | Prevención |
|-------|-------------|------------|
| Texto en bottom safe zone | Caption de TikTok lo tapa | Mantener texto arriba de y=1640 |
| Texto demasiado pequeño | Ilegible en móvil | Mínimo 32px para subtítulos |
| Video sin audio | Engagement cae ~70% | Siempre incluir voz o música |
| Colores fuera de paleta | Rompe identidad visual | Verificar hex contra Brand Kit |
| Duración > 90s | Caída de retención | Editar tighter, máximo 90s |
| Subtítulos desincronizados | Confusión, baja credibilidad | Revisar timing frame a frame |
| Upload en baja resolución | Pixelación post-compresión | Siempre 1080×1920 @ 6+ Mbps |

---

## 6. REGISTRO DE PRUEBAS

Para cada prueba privada, registrar:

```markdown
### Test [ID] — [Fecha]

- **Pieza:** [nombre/ID]
- **Pilar:** [pilar]
- **Duración:** [Xs]
- **Checks passed:** [N/33]
- **Issues encontrados:**
  - [ ] [descripción del issue]
- **Acción:** [aprobado / re-editar / cambio específico]
- **Notas:** [observaciones]
```

---

## 7. CRITERIO DE APROBACIÓN

Una pieza está **LISTA PARA PUBLICACIÓN** cuando:

- [ ] 33/33 checks del checklist pasados
- [ ] Revisada en dispositivo móvil real
- [ ] Caption y hashtags aprobados
- [ ] Cover seleccionado o diseñado
- [ ] Sin bloqueadores de marca o legales
- [ ] Registrada en el log de pruebas
