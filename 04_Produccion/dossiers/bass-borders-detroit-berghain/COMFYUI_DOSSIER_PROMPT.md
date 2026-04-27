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

## POSITIVE PROMPT (DERIVADO DE SERENA)

```
industrial city at night, abstract signal wave transmission, dark concrete corridor with single light,
electric cyan frequency glow, magenta accent light beam, metal infrastructure textures,
high contrast film grain cinematic still, no text no people no logos,
dark background near black, techno aesthetic without festival clichés, threshold as power concept,
signal as architecture connecting two urban nodes, wide format 16:9, mature cinematic mood,
Afrofuturism inspired, future active not nostalgic, concrete and metal materiality,
city skyline distant and abstracted not recognizable, antenna transmission visual, 
cool temperature with warm magenta counterpoint, asphalt texture vapor mist,
geometric no figurative, editorial starkness, no EDM festival no crowd no hands up,
refined composition balanced asymmetric, no Berghain facade no Detroit landmarks,
no pastel no cartoon no stock photo, cyberpunk dark academia blend
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
ruin industrial collapse melancholy passive nostalgia,
bright saturated candy colors pastoral peaceful,
watermark artifact compression error pixelated
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
