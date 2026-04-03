# REGLA — File Output Standards

**Sistema:** Frecuencia Global  
**Código:** RULE_File_Output_Standards  
**Severidad:** BLOQUEANTE  
**Aplica a:** Design Production Agent, Brand System Agent

---

## FORMATOS DE EXPORTACIÓN

| Tipo de contenido | Formato | Codec/Specs | Peso máximo |
|------------------|---------|-------------|-------------|
| Imágenes estáticas | PNG | RGBA, 8-bit | 5 MB |
| Gráficos vectoriales | SVG | Limpio, sin metadata innecesaria | 1 MB |
| Video horizontal (YT) | MP4 | H.264, AAC, 1080p mínimo | 500 MB |
| Video vertical (Reels/TikTok) | MP4 | H.264, AAC, 1080×1920 | 50 MB |
| Shorts YouTube | MP4 | H.264, AAC, 1080×1920 | 50 MB |
| Paquete documental de video | MD / SRT / VTT | UTF-8, limpio, sin placeholders | 2 MB |

---

## RESOLUCIONES REQUERIDAS

| Formato | Dimensiones exactas | Aspect ratio |
|---------|--------------------:|:-------------|
| YouTube Thumbnail | 1280 × 720 | 16:9 |
| YouTube Banner | 2560 × 1440 | 16:9 |
| YouTube Video | 1920 × 1080 mín. | 16:9 |
| YouTube Short | 1080 × 1920 | 9:16 |
| Instagram Feed (cuadrado) | 1080 × 1080 | 1:1 |
| Instagram Carrusel | 1080 × 1350 | 4:5 |
| Instagram Story | 1080 × 1920 | 9:16 |
| Instagram Reel | 1080 × 1920 | 9:16 |
| TikTok | 1080 × 1920 | 9:16 |
| X/Twitter Header | 1500 × 500 | 3:1 |
| X/Twitter Post image | 1200 × 675 | 16:9 |
| LinkedIn Post image | 1200 × 627 | ~2:1 |
| Avatar (todas) | 400 × 400 mín. | 1:1 |

---

## ESPECIFICACIONES DE VIDEO

| Parámetro | Valor |
|-----------|-------|
| Codec video | H.264 (AVC) |
| Codec audio | AAC |
| Frame rate | 30 fps (mínimo) |
| Bitrate video | 8-12 Mbps para 1080p |
| Bitrate audio | 128-256 kbps |
| Color space | sRGB |
| Audio | Stereo |

---

## ESPECIFICACIONES DE IMAGEN

| Parámetro | Valor |
|-----------|-------|
| Formato | PNG-24 con alpha (transparencia) cuando se necesite |
| Color space | sRGB |
| DPI | 72 para digital (300 para print si alguna vez aplica) |
| Compresión | Sin pérdida (PNG) |
| Alpha channel | Incluir si el elemento necesita transparencia |

---

## NAMING DE ARCHIVOS

Ver [`RULE_Naming_Conventions.md`](RULE_Naming_Conventions.md) para el formato completo.

Resumen: `FG_[PILAR]_[FORMATO]_[TEMA]_[VERSION].[ext]`

---

## ENTREGA

Cada pieza exportada debe entregarse con:

1. **Archivo final** en formato correcto
2. **Link a editable** (Canva link con permisos de edición o archivo .fig)
3. **Brief original** que generó la pieza (referencia)

### Entrega adicional obligatoria para video

1. **Storyboard textual**
2. **Editing brief**
3. **Subtitle / on-screen text sheet**
4. **Thumbnail brief**
5. **Versiones adaptadas por plataforma**

---

## VERIFICACIÓN PRE-ENTREGA

```
□ Formato correcto (PNG/MP4/SVG)
□ Dimensiones exactas según tabla
□ Peso dentro de límite
□ Naming correcto (FG_[PILAR]_[FORMATO]_[TEMA]_[VERSION])
□ Sin artefactos visuales (pixelación, bordes cortados)
□ Color space sRGB
□ Video: audio sincronizado, sin cortes abruptos
□ Video: storyboard + editing brief + subtítulos + thumbnail brief adjuntos
□ PNG: transparencia donde se necesite
□ Link a editable guardado
```

---

*Estos estándares garantizan que cada pieza funcione correctamente en su plataforma destino. Exportar mal = publicar mal.*
