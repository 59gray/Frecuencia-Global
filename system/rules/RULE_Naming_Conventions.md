# REGLA — Naming Conventions

**Sistema:** Frecuencia Global  
**Código:** RULE_Naming_Conventions  
**Severidad:** BLOQUEANTE — Archivos mal nombrados serán rechazados por QA  
**Aplica a:** Todos los agentes, todos los archivos del proyecto

---

## FORMATO GENERAL

```
FG_[PILAR]_[FORMATO]_[TEMA]_[VERSION].[ext]
```

---

## COMPONENTES

### [PILAR] — Código de pilar (2 letras)

| Pilar | Código |
|-------|--------|
| Geopolitik Drop | `GD` |
| Bass & Borders | `BB` |
| Frecuencia Global | `FG` |
| Behind the Policy | `BP` |
| General (sin pilar) | `GN` |
| Sistema/Brand | `SY` |

### [FORMATO] — Tipo de pieza

| Formato | Código |
|---------|--------|
| Video largo YouTube | `Video` |
| Short / Reel | `Short` |
| Thumbnail YouTube | `Thumbnail` |
| Carrusel Instagram | `Carousel` |
| Post estático | `Post` |
| Story Instagram | `Story` |
| Banner (cualquier plataforma) | `Banner` |
| Avatar / perfil | `Avatar` |
| Thread X | `Thread` |
| Overlay video | `Overlay` |
| Background base | `BG` |
| Elemento reutilizable | `Element` |
| Template | `Template` |
| Storyboard | `Storyboard` |
| Editing brief | `EditBrief` |
| Subtítulos / on-screen | `Subs` |
| Thumbnail brief | `ThumbBrief` |
| Repurposing map | `Repurpose` |
| Mockup | `Mockup` |
| Guía/Guide | `Guide` |
| Investigación | `Research` |
| Guión | `Script` |

### [TEMA] — Descripción corta del contenido

- CamelCase sin espacios: `CablesSubmarinos`, `FestivalesConflicto`
- Máximo 30 caracteres
- Sin caracteres especiales, acentos ni ñ en nombres de archivo
- Descriptivo pero conciso

### [VERSION] — Control de versiones

- Formato: `v1`, `v2`, `v3`...
- Para carruseles con múltiples slides: `v1_01`, `v1_02`, `v1_03`...
- Incrementar versión cuando hay cambio sustancial

### [ext] — Extensión

| Tipo | Extensión |
|------|-----------|
| Imágenes raster | `.png` |
| Vectores | `.svg` |
| Video | `.mp4` |
| Documentos | `.md` |
| Subtítulos | `.srt`, `.vtt` |
| Fuentes | `.ttf`, `.otf`, `.woff2` |

---

## EJEMPLOS CORRECTOS

```
FG_GD_Thumbnail_CablesSubmarinos_v1.png
FG_BB_Carousel_FestivalesConflicto_v1_01.png
FG_BB_Carousel_FestivalesConflicto_v1_02.png
FG_FG_Short_NoticiaSemana_v1.mp4
FG_BP_Video_PoliticaClimatica_v2.mp4
FG_GN_Banner_YouTube_v1.png
FG_SY_Element_FrequencyLine_Cyan_v1.png
FG_SY_BG_DarkGrid_v1.png
FG_GD_Template_Carousel_Cover_v1.png
FG_SY_Avatar_Master_v1.png
FG_GD_Storyboard_TongaCable_v1.md
FG_FG_EditBrief_Chokepoints_v1.md
FG_GD_Subs_TongaCable_v1.srt
FG_GD_ThumbBrief_TongaCable_v1.md
FG_SY_Repurpose_VideoSemanal_v1.md
```

## EJEMPLOS INCORRECTOS

```
❌ thumbnail final.png              → Sin formato FG, espacios
❌ FG_carousel_v1.png               → Falta pilar y tema
❌ FG_GD_Cables Submarinos_v1.png   → Espacios en tema
❌ FG_GD_Thumbnail_CablesSubmarinos.png → Falta versión
❌ Geopolitik_Drop_video.mp4        → No sigue formato
❌ final_final_v2_DEFINITIVO.png    → No sigue formato
```

---

## REGLAS ADICIONALES

1. **Sin espacios** en nombres de archivo. Usar `_` como separador, CamelCase en tema.
2. **Sin acentos** en nombres de archivo (sí en contenido de documentos).
3. **Sin MAYÚSCULAS** excepto en códigos de componente (FG, GD, BB, etc.) y CamelCase.
4. **Versión obligatoria** en todo archivo. Nunca `_final`, `_definitivo`, `_nuevo`.
5. **Slides numerados** con `_01`, `_02` (dos dígitos) para mantener orden.

---

## CARPETAS

Las carpetas siguen la estructura del repo:

```
system/           → Sistema operativo (agentes, playbooks, templates, rules)
01_Estrategia/    → Documentos estratégicos
02_Brand_System/  → Kit de marca
03_Editorial/     → Guías editoriales
04_Produccion/    → Flujos de producción
05_Monetizacion/  → Estrategia de monetización
06_Assets/        → Índice de assets
07_Operaciones/   → Guías operativas
```

---

*Esta regla es BLOQUEANTE. Archivos que no sigan la convención serán rechazados en QA.*
