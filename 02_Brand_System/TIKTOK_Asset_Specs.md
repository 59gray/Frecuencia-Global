# TIKTOK — Asset Specs

**Sistema:** Frecuencia Global  
**Versión:** 1.0  
**Fecha:** 2026-04-01  
**Estado:** Activo

---

## 1. PERFIL

| Asset | Especificación | Estado |
|-------|---------------|--------|
| **Foto de perfil** | 200×200 px, PNG, fondo `#0A0A0F`, isotipo FG centrado con glow cian sutil | ✅ Producido — `Frecuencia_Global_Assets_Base/assets/fg_tiktok_profile_200x200.png` |
| **Display name** | `Frecuencia Global` | ⚠️ Validar en plataforma |
| **Username** | `@frecuenciaglobal` | ✅ Confirmado por Farid |
| **Bio** | Ver sección 2 | ⚠️ Requiere aprobación |
| **Link** | `https://frecuenciaglobal.vercel.app` | ⚠️ Pendiente deploy |

---

## 2. BIO PROPUESTA (OPCIONES)

**Opción A (tagline directa):**
```
Análisis internacional con pulso electrónico ⚡
Geopolítica × música electrónica × datos
↓ Web + YouTube + más
```

**Opción B (más periodística):**
```
Geopolítica explicada en clave electrónica.
Contexto global, sin ruido.
↓ Reportes y análisis
```

**Opción C (más cultural):**
```
Bass & Borders: política, cultura y poder.
Frecuencia diaria de análisis internacional.
↓ Mira el último drop
```

**Opción D (más sobria/institucional):**
```
Análisis geopolítico para entender el sistema internacional.
Formato breve, datos claros.
↓ Fuentes y cobertura completa
```

> **REQUIERE APROBACIÓN** — Decisión editorial de Maya/Farid.

### Bio seleccionada para implementación inmediata

**Selección recomendada (A):**
```
Análisis internacional con pulso electrónico ⚡
Geopolítica × música electrónica × datos
↓ Web + YouTube + más
```

**Fallback corto (si TikTok recorta caracteres):**
```
Análisis internacional con pulso electrónico ⚡
Geopolítica, cultura y poder en formato breve.
```

---

## 3. VIDEO — SPECS TÉCNICAS

| Parámetro | Valor |
|-----------|-------|
| **Resolución** | 1080 × 1920 px (9:16) |
| **FPS** | 30 |
| **Codec** | H.264 |
| **Bitrate** | 6 Mbps mínimo |
| **Duración** | 30–90 s (óptimo: 60 s) |
| **Formato archivo** | MP4 |
| **Tamaño máximo** | 287.6 MB (móvil) / 500 MB (web) |
| **Audio** | AAC, 128 kbps mínimo |

---

## 4. SAFE ZONES — OVERLAY

Zonas donde la UI de TikTok tapa contenido. NO colocar información crítica aquí.

```
┌────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← TOP SAFE: 200 px
│ ░░░ Nombre usuario, ░░░░░░│     (barra de estado, header)
│ ░░░ barra de estado ░░░░░░│
├────────────────────────────┤
│                            │
│                            │
│    ZONA SEGURA PARA        │  ← CONTENT: y=200 → y=1640
│    CONTENIDO PRINCIPAL     │     ~1440 px de alto útil
│                            │
│                       ░░░░░│  ← RIGHT: 100 px desde x=980
│                       ░like│     (iconos interacción)
│                       ░comm│     y=800 → y=1300
│                       ░save│
│                       ░░░░░│
│                            │
├────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← BOTTOM SAFE: 280 px
│ ░░░ Caption, controles ░░░│     (caption, barra de música,
│ ░░░ barra de música   ░░░░│      botones de navegación)
│ ░░░ navegación        ░░░░│
└────────────────────────────┘
   60 px margen lateral mínimo
```

| Zona | Posición | Tamaño | Restricción |
|------|----------|--------|-------------|
| Top safe | y: 0–200 | 1080 × 200 | Sin texto crítico |
| Bottom safe | y: 1640–1920 | 1080 × 280 | Sin texto crítico |
| Right icons | x: 980–1080, y: 800–1300 | 100 × 500 | Sin elementos visuales |
| Content safe | y: 200–1640, x: 60–980 | 920 × 1440 | Zona principal de contenido |
| Lower third | y: 1480–1600 | 800 × 120 | Barra branded (opcional) |

---

## 5. OVERLAY BRANDED — ESPECIFICACIONES

Capa transparente que se superpone al video para identidad de marca.

| Elemento | Spec | Posición |
|----------|------|----------|
| **Pill de pilar** | JetBrains Mono 14px, color del pilar, corchetes `[PILAR]` | Superior izquierda (x:60, y:220) |
| **Isotipo FG** | 32px, blanco, glow cian sutil | Superior derecha (x:960, y:220) |
| **Título overlay** | Bebas Neue 40-48px, blanco, drop shadow negro 80% | Centro (y:~900) |
| **Línea de frecuencia** | Color del pilar, 2-4px | Debajo del título |
| **Lower third barra** | `#1A1A2E` al 85% opacidad, 120px alto, border-radius 8px | x:60, y:1480, w:800 |
| **Texto lower third** | Space Grotesk 16px, blanco | Dentro de la barra |

### Variantes por pilar

| Pilar | Color acento | Hex |
|-------|-------------|-----|
| Geopolitik Drop | Cian | `#00E5FF` |
| Bass & Borders | Magenta | `#FF00E5` |
| Frecuencia Global | Verde ácido | `#B8FF00` |
| Behind the Policy | Azul | `#4A6BFF` |

---

## 6. COVER / THUMBNAIL DE VIDEO

TikTok permite seleccionar un frame o subir cover personalizado.

| Parámetro | Valor |
|-----------|-------|
| **Resolución** | 1080 × 1920 px |
| **Formato** | JPEG o PNG |
| **Contenido recomendado** | Frame de mayor impacto visual del video |
| **Texto en cover** | Máximo 5 palabras, Bebas Neue, dentro de safe zone |
| **Consistencia** | Misma estructura visual que el overlay |

---

## 7. SUBTÍTULOS ON-SCREEN

| Parámetro | Valor |
|-----------|-------|
| **Fuente** | Space Grotesk Bold |
| **Tamaño** | 32-40px |
| **Color texto** | `#FFFFFF` |
| **Color fondo** | `#0A0A0F` al 75% opacidad |
| **Posición** | Centro vertical (y: 800–1200), centrado horizontal |
| **Palabras clave** | Resaltadas en color del pilar |
| **Máximo por línea** | 2 líneas, ~6-8 palabras por línea |

---

## 8. ASSETS — ESTADO DE PRODUCCIÓN

| # | Asset | Spec | Estado | Archivo |
|---|-------|------|--------|---------|
| 1 | Foto de perfil TikTok | 200×200 PNG, isotipo + fondo `#0A0A0F` | ✅ Producido | `Frecuencia_Global_Assets_Base/assets/fg_tiktok_profile_200x200.png` |
| 2 | Overlays verticales (minimal + full, 4 pilares) | 1080×1920 PNG transparente | ✅ Completo | `Frecuencia_Global_Activos_Canva_v2/FG_Reels_Overlay_Minimal_v1.png`, `..._Minimal_BB_v1.png`, `..._Minimal_FG_v1.png`, `..._Minimal_BP_v1.png`, `FG_Reels_Overlay_Full_v1.png`, `..._Full_BB_v1.png`, `..._Full_FG_v1.png`, `..._Full_BP_v1.png` |
| 3 | Cover template base | 1080×1920, estructura fija | ✅ Producido | `Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920.png` |
| 4 | Cover template con guías QA | 1080×1920, zonas seguras visuales | ✅ Producido | `Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920_guides.png` |
| 5 | Subtítulo template (estilo) | Preset de estilo para edición | ❌ Pendiente | — |
| 6 | Watermark animado (loop) | Isotipo + glow, 3s, transparente | ❌ Pendiente | — |

---

## 9. CONSISTENCIA CROSS-PLATFORM

| Plataforma | Handle | Profile pic | Verificado |
|------------|--------|-------------|------------|
| TikTok | `@frecuenciaglobal` | Isotipo FG | ⚠️ Perfil publico sin bio/foto aplicadas |
| YouTube | `@FrecuenciaGlobal` | Isotipo FG | ✅ |
| Instagram | `@globalfrequency.es` | Isotipo FG | ✅ |
| X | `@frec_global` | Isotipo FG | ✅ |
| LinkedIn | frecuencia-global | Isotipo FG | ✅ |

> **Nota:** Los handles difieren entre plataformas por disponibilidad. El display name debe ser siempre **"Frecuencia Global"** en todas las plataformas para coherencia.
