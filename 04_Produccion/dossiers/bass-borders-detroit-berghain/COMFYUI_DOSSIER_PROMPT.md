# ComfyUI Dossier Prompt — Bass & Borders

**Fecha:** 2026-04-26  
**Origen:** SERENA_VISUAL_EXTRACTION.md  
**Target:** ComfyUI API call via /prompt endpoint  
**Output path:** `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.png`  
**Ratio:** 16:9  

---

## INTENT

Generar imagen de dossier visual para Bass & Borders que:
- Conecta Detroit (raíz material) y Berghain (umbral/acceso) sin fusionarlos
- Comunica la tensión operativa entre dos nodos del techno
- Evita clichés EDM, ruinas turísticas, o fusión literal
- Representa señal como objeto central (sintetizador, radio, transmisión)
- Mantiene atmósfera nocturna, densa, de futuro activo
- Paleta FG cerrada: negro, cyan, magenta/violeta

---

## TRADUCCIÓN VISUAL DESDE SERENA (GATE PREVIO)

### Izquierda — Detroit (origen/producción)
- Nave fabril de chapa corrugada
- Poste/antena de transmisión
- Cables/líneas de señal en diagonal
- Asfalto húmedo con reflejo cyan
- Vapor industrial de ducto lateral

### Derecha — Berghain (filtro/acceso)
- Muro de hormigón armado
- Puerta metálica maciza cerrada
- Corredor de concreto en fuga
- Luz puntual restringida magenta/violeta
- Barrera de control frente al umbral

### Relación visual obligatoria
- Línea de señal cyan conectando ambos lados y comprimiéndose en el umbral derecho (transición clara, no mezcla).

### Composición obligatoria
- División o conexión por línea de señal.
- Transición visual clara (sin fusión literal).
- Tensión legible entre apertura (Detroit) y restricción (Berghain).

---

## POSITIVE PROMPT (DERIVADO DE SERENA)

```
industrial city at night, corrugated factory hall on the left, transmission pole and overhead signal cables,
wet asphalt with cyan reflections and side steam duct, concrete massive wall on the right,
closed heavy metal door and narrow corridor perspective, restricted magenta violet point light on threshold,
cyan signal line crossing from left to right and compressing at the entrance,
clear split composition, no literal fusion, tension between open production and controlled access,
electric cyan frequency glow, magenta accent light beam, metal infrastructure textures,
high contrast film grain cinematic still, no text no people no logos,
dark background near black, techno aesthetic without festival clichés, threshold as power concept,
signal as architecture connecting two urban nodes, wide format 16:9, mature cinematic mood,
Afrofuturism inspired, future active not nostalgic, concrete and metal materiality,
city skyline distant and abstracted not recognizable, antenna transmission visual,
cool temperature with warm magenta counterpoint, asphalt texture vapor mist,
geometric no figurative, editorial starkness, no EDM festival no crowd no hands up,
refined composition balanced asymmetric, no Berghain facade no Detroit landmarks,
no pastel no cartoon no stock photo look, no vaporwave cliché, cyberpunk dark academia blend
```

---

## NEGATIVE PROMPT (CERRADO)

```
text watermark logo brand name,
person face crowd hands up identifiable celebrity,
festival confetti colorful neon generic EDM party,
Berlin Brandenburg gate Detroit Renaissance Center Berghain facade recognizable landmark,
pastel colors cartoon illustration overexposed low contrast generic stock,
blurry low resolution deformed anatomy extra limbs distorted,
club scene explicit party scene DJ turntable,
DJ, DJs, performer booth, dancefloor action,
ruin industrial collapse melancholy passive nostalgia,
bright saturated candy colors pastoral peaceful,
watermark artifact compression error pixelated,
vaporwave grid sunset retro synthwave poster style,
generic skyline wallpaper stock image look
```

---

## TECHNICAL SPECIFICATION

### Model & Sampler
- **Base model:** SDXL 1.0 or equivalent (sd_xl_base_1.0.safetensors recommended)
- **Sampler:** DPM++ 2M Karras (reliable for detail and speed)
- **Steps:** 32 (balance entre calidad y velocidad; documentar si varía)
- **CFG Scale:** 8.0 (coherencia con prompt, sin oversaturation)
- **Scheduler:** karras

### Generation Parameters
- **Width:** 1920
- **Height:** 1080
- **Seed:** [GENERA VARIABLE — documentar el valor usado para reproducibilidad]
- **Denoise:** 1.0
- **Format:** PNG

### ComfyUI API Structure
```json
{
  "checkpoint": "sd_xl_base_1.0.safetensors",
  "positive": "[POSITIVE PROMPT TEXT]",
  "negative": "[NEGATIVE PROMPT TEXT]",
  "width": 1920,
  "height": 1080,
  "steps": 32,
  "cfg": 8.0,
  "sampler_name": "DPM++ 2M Karras",
  "scheduler": "karras",
  "seed": null,
  "output_format": "png"
}
```

---

## QUALITY GATES

| Gate | Criterio | Fallo |
|------|----------|--------|
| **Text visible** | NO texto grande incrustado | Rechazar y regen |
| **People/faces** | NO personas identificables | Rechazar y regen |
| **Landmark recognition** | Skyline abstracto; NO reconocible | Rechazar si identificable |
| **Palette fidelity** | Cyan + magenta presentes; base negra | Aceptar variación de matiz |
| **Composition** | Dualidad o umbral legible | Rechazar si fusion literal o caos |
| **Contrast** | Alto; no plano ni washed out | Aceptar grano; rechazar bajo contraste |
| **Format** | PNG, 1920×1080 | Rechazar si menor o diferente ratio |
| **File path** | Exacto: `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.png` | Falso si distinta ruta |

---

## GENERATION PLAN

### Attempt 1
- Seed: [auto random first run]
- Variación: Default prompt as written
- Documentar resultado completo

### Attempt 2 (si necesario)
- Seed: [variable, registrar]
- Ajuste mínimo: Si Attempt 1 falla gates, refinar prompt negativo o CFG
- NO hacer cambios arquitectónicos grandes

**Máximo:** 2 intentos. Si ambos fallan → BLOQUEO documentado.

---

## INTEGRATION CHECKLIST

- [ ] Imagen generada en ruta exacta
- [ ] HTTP 200 verificable en ruta local
- [ ] Imagen visible en preview HTML/Astro
- [ ] No 404 en build log
- [ ] Overlay test: texto legible con `bg-black/40` sobre imagen
- [ ] Verificar en desktop (1920×1080) y mobile (600px ancho)
- [ ] Sin regresión de contenido: cards, slug, copy intactos

---

## VERSIONING

| Version | Date | Seed | Result | Notes |
|---------|------|------|--------|-------|
| v1 | 2026-04-26 | [PENDIENTE] | [PENDIENTE] | First generation attempt |
| v2 | — | — | — | Refinement if v1 fails |

---

## VALIDACIÓN PRE-GENERACIÓN (OBLIGATORIA)

- **¿La imagen representa una tensión?**
  **Sí.** La composición separa origen productivo (Detroit) y filtro de acceso (Berghain), unidos por una señal que cambia de estado.

- **¿Puede alguien entender la diferencia sin leer texto?**
  **Sí.** Los objetos físicos de cada lado son inequívocos (fábrica/cables/vapor vs muro/puerta/corredor/luz restringida).

Resultado de gate: ✅ **APROBADO PARA EJECUTAR COMFYUI**.

---

## POST-GENERATION

1. Copiar PNG exacto a: `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.png`
2. Verificar integridad (no corrupto, no blanco/gris)
3. Registrar seed y parámetros en sección VERSIONING
4. Actualizar ASSETS_MANIFEST.md con metadata
5. Verificar integración en [slug].astro
6. Run `npm run build` — confirmar PASS
7. Documento: COMFYUI_GENERATION_LOG.md (timestamp, seed, result)

---

## REFERENCIA

**Basado en:** SERENA_VISUAL_EXTRACTION.md (2026-04-26)  
**Paleta:** FG Brand Closed (#0A0A0F, #00E5FF, #C800FF, #7C728F)  
**Conceptos:** Detroit raíz material + Berghain umbral operativo  
**Restricción:** Sin ComoUI = STOP (sin fallback Pillow, CSS, SVG)
