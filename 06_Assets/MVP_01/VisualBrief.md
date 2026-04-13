# VisualBrief — MVP_01

**ID pieza:** MVP_01  
**Pilar / hex acento:** Geopolitik Drop / `#00E5FF` (Cian Eléctrico)  
**Dimensiones export:** 1080×1350 px × 5 slides (carrusel IG)  
**Fecha:** 2026-04-13

---

## Ritmo visual

1. **Impacto** — Slide 1 rompe con dato visual fuerte (cable submarino + dato ">95%"). Fondo oscuro total, tipografía display dominante.
2. **Mapa + incidente** — Slides 2–4 alternan geografía (Mar Rojo, Báltico) con datos de impacto. Cada slide introduce un chokepoint nuevo.
3. **Cierre personal** — Slide 5 conecta con la experiencia cotidiana del usuario. Tono directo, sin mapa.

---

## Por slide

### Slide 1 — HOOK: dato de tráfico

- **Hero:** Texto display "MÁS DEL 95%" en Bebas Neue, 96px, `#00E5FF`, centrado en tercio superior.
- **Secundario:** "DEL TRÁFICO INTERCONTINENTAL / VIAJA POR CABLES SUBMARINOS" en Space Grotesk Bold, 28px, `#FFFFFF`, debajo del hero.
- **Subtext:** "No por satélites." en Space Grotesk Regular, 18px, `#A0A0B8`.
- **Acento (hex):** `#00E5FF` — glow exterior 30% sobre el "95%".
- **Componente marca:** Frequency line horizontal en `#00E5FF` al 40% opacidad, cruzando detrás del número.
- **Fondo:** `#0A0A0F` sólido. Sin imagen.
- **Notas:** Safe zone 80px en todos los bordes para IG. El número "95%" debe dominar visualmente. No saturar con elementos.

### Slide 2 — CHOKEPOINT: Mar Rojo

- **Hero:** Texto "MAR ROJO" en Bebas Neue, 72px, `#00E5FF`.
- **Secundario:** ">90% de comunicaciones Europa–Asia cruzan por aquí" en Space Grotesk Bold, 22px, `#FFFFFF`.
- **Data badge:** "3 CABLES CORTADOS / FEB 2024" en JetBrains Mono, 14px, `#00E5FF`, dentro de rectángulo con borde `#00E5FF` 1px.
- **Acento (hex):** `#00E5FF`.
- **Componente marca:** Brackets `[ ]` en `#00E5FF` al 60% opacidad enmarcando el data badge.
- **Fondo:** `#0A0A0F` con gradiente sutil `#0A0A0F` → `#1A1A2E` (vertical, oscuro a ligeramente más claro en base).
- **Notas:** Considerar mapa estilizado minimalista del corredor Mar Rojo como elemento de fondo al 15% opacidad si hay asset disponible. Si no, fondo limpio.

### Slide 3 — IMPACTO: datos medidos

- **Hero:** "25%" en Bebas Neue, 96px, `#00E5FF` + "DEL TRÁFICO EUROPA–ASIA AFECTADO" en Space Grotesk Bold, 24px, `#FFFFFF`.
- **Secundario:** "Microsoft Azure confirmó latencia elevada" en Space Grotesk Regular, 18px, `#A0A0B8`.
- **Data badge:** "HASTA +60 MS DE RETRASO / RUTA ALTERNATIVA" en JetBrains Mono, 14px, `#B8FF00` (Verde Ácido para contraste).
- **Acento (hex):** `#00E5FF` principal + `#B8FF00` puntual en el dato de latencia.
- **Componente marca:** Grid pattern al 8% opacidad en fondo.
- **Fondo:** `#0A0A0F`.
- **Notas:** El "25%" debe ser el ancla visual. Verde Ácido solo en el dato de latencia como highlight puntual (máx 10% de la composición).

### Slide 4 — BÁLTICO: segundo incidente

- **Hero:** "MAR BÁLTICO / NOV 2024" en Bebas Neue, 64px, `#00E5FF`.
- **Cita:** "Nadie cree que hayan sido cortados accidentalmente." en Space Grotesk Italic (o Regular con comillas), 20px, `#FFFFFF`, centrada.
- **Atribución:** "— Boris Pistorius, Ministro de Defensa de Alemania" en JetBrains Mono, 12px, `#A0A0B8`.
- **Data badge:** "2 CABLES CORTADOS" en JetBrains Mono, 14px, borde `#00E5FF`.
- **Acento (hex):** `#00E5FF`.
- **Componente marca:** Nodo de señal en esquina inferior derecha, `#00E5FF` al 25% opacidad.
- **Fondo:** `#1A1A2E` (Grafito Azulado para diferenciar de los slides anteriores).
- **Notas:** La cita es el ancla visual. No competir con elementos extra.

### Slide 5 — CIERRE + CTA

- **Hero:** "LA PRÓXIMA VEZ QUE UN STREAM SE CONGELE" en Bebas Neue, 56px, `#FFFFFF`, tercio superior.
- **Secundario:** "PUEDE QUE NO SEA TU WIFI." en Bebas Neue, 56px, `#00E5FF`, inmediatamente debajo.
- **Marca:** Wordmark "FRECUENCIA GLOBAL" en Space Grotesk Bold, 16px, `#A0A0B8`, centrado en zona inferior.
- **Componente marca:** Frequency line en `#00E5FF` al 30% opacidad, horizontal, tercio inferior (separando texto de marca).
- **Fondo:** `#0A0A0F`.
- **Notas:** Slide de cierre. Limpio, memorable. El contraste blanco/cian en las dos líneas debe ser el único foco.

---

## Assets requeridos

| Asset | Especificación | Prioridad |
|-------|---------------|-----------|
| 5 slides carrusel | 1080×1350 px, PNG, sRGB | P0 |
| Cover para Threads/FB | 1080×1350 px (slide 1 reutilizable) | P1 |
| Thumbnail LinkedIn | 1200×628 px (derivado de slide 1, reencuadrado) | P2 |

---

## Nomenclatura de archivos

```
FG_MVP_01_GD_CAR_S01_1080x1350.png
FG_MVP_01_GD_CAR_S02_1080x1350.png
FG_MVP_01_GD_CAR_S03_1080x1350.png
FG_MVP_01_GD_CAR_S04_1080x1350.png
FG_MVP_01_GD_CAR_S05_1080x1350.png
FG_MVP_01_GD_THB_LI_1200x628.png
```

---

## Coherencia obligatoria

- [x] Paleta `FG_Brand_Kit_Operativo.md` — solo `#0A0A0F`, `#1A1A2E`, `#00E5FF`, `#B8FF00`, `#FFFFFF`, `#A0A0B8`
- [x] Ningún dato en tipografía display que no esté en Claim Ledger
- [x] Bebas Neue solo en MAYÚSCULAS
- [x] JetBrains Mono solo para datos / metadata
- [x] Glow permitido solo en `#00E5FF` (30-40% opacidad)
- [x] Contraste WCAG AA en todo texto legible
