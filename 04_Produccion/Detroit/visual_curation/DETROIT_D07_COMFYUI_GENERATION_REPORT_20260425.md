# DETROIT_D07_COMFYUI_GENERATION_REPORT
# D07 — Reporte de generación ComfyUI Detroit
# 2026-04-25 | Frecuencia Global

**Corte:** 2026-04-25
**Guardrails:** Sin publicación · Sin deploy · Sin modelos nuevos · Sin dependencias nuevas

---

## Configuración de generación

| Parámetro | Valor |
|-----------|-------|
| Endpoint | `http://127.0.0.1:8000` |
| ComfyUI versión | 0.19.5 |
| GPU | NVIDIA RTX 5060 (8.5 GB VRAM, 7.3 GB libres) |
| Modelo/Checkpoint | `sdxl\sd_xl_base_1.0.safetensors` |
| Sampler | dpmpp_2m |
| Scheduler | karras |
| Steps | 35 |
| CFG | 7.5 |
| Denoise | 1.0 |
| Script usado | `scripts/d07_comfyui_generate.py` |

---

## Prompt positivo — Hero web

```
Detroit techno origin, abandoned industrial factory district, Belleville Three era,
Afro-diasporic electronic music, night radio, analog synth atmosphere,
manga editorial style, black and white with controlled cyan magenta accent,
high contrast ink, cinematic wide urban composition, Frecuencia Global editorial cover,
dramatic 1980s midwest industrial cityscape at night, empty streets, smokestack silhouettes
```

## Prompt positivo — Thumb vertical

```
Detroit techno origin, vertical editorial portrait composition, abandoned industrial interior,
DJ setup silhouette, Belleville Three era, Afro-diasporic electronic music culture,
analog synthesizer close-up, manga editorial style, black and white with cyan magenta accent,
high contrast ink, Frecuencia Global mobile story cover, dramatic vertical frame,
1980s industrial midwest atmosphere
```

## Prompt negativo (ambos)

```
blurry, low resolution, fake readable text, distorted buildings, deformed people,
extra limbs, watermark, logo, political symbols, random typography,
generic EDM festival crowd, neon clutter, nsfw, ugly, bad anatomy, cartoon, anime chibi
```

---

## Outputs generados — Hero web (768x432)

| Archivo | Seed | Tamaño | Ruta ComfyUI | Ruta canónica |
|---------|------|--------|-------------|---------------|
| `FG_DETROIT_HERO_WEB_v1_s42.png` | 42 | 358 KB | `output/exports/.../hero/` | — |
| `FG_DETROIT_HERO_WEB_v1_s137.png` | 137 | 440 KB | `output/exports/.../hero/` | `FG_DETROIT_HERO_WEB_v1.png` ✅ SELECCIONADO |
| `FG_DETROIT_HERO_WEB_v1_s999.png` | 999 | 421 KB | `output/exports/.../hero/` | — |

**Selección:** seed=137 — tamaño equilibrado, candidato técnico principal.

---

## Outputs generados — Thumb vertical (512x896)

| Archivo | Seed | Tamaño | Ruta ComfyUI | Ruta canónica |
|---------|------|--------|-------------|---------------|
| `FG_DETROIT_THUMB_VERTICAL_v1_s7.png` | 7 | 590 KB | `output/exports/.../thumb_vertical/` | — |
| `FG_DETROIT_THUMB_VERTICAL_v1_s88.png` | 88 | 703 KB | `output/exports/.../thumb_vertical/` | `FG_DETROIT_THUMB_VERTICAL_v1.png` ✅ SELECCIONADO |
| `FG_DETROIT_THUMB_VERTICAL_v1_s444.png` | 444 | 483 KB | `output/exports/.../thumb_vertical/` | — |

**Selección:** seed=88 — mayor resolución/detalle entre los candidatos.

---

## Assets canónicos copiados a website/public/images/articles/

| Archivo canónico | Tamaño | Estado |
|-----------------|--------|--------|
| `FG_DETROIT_HERO_WEB_v1.png` | 440 KB | ✅ Creado |
| `FG_DETROIT_THUMB_VERTICAL_v1.png` | 703 KB | ✅ Creado |

---

## Errores

Ninguno. Todos los jobs completaron sin errores.

---

## Frontmatter actualizado

```
image: "/images/articles/FG_DETROIT_HERO_WEB_v1.png"
```

---

*Generado: 2026-04-25 | Agente: Windsurf Cascade | Tarea: D07*
