# Asset Prompts — Detroit Techno

> Derivados del ARTICLE_VISUAL_BRIEF.md. No usar estos prompts sin leer el brief primero.
> No ejecutar generación sin ComfyUI activo y autorización explícita.

---

## Featured card prompt

**Para:** `website/public/images/articles/techno-detroit-historia-musica-electronica-featured-card.png`
**Ratio:** 1216x704 (16:9)

### Intención visual

Ciudad-fábrica de Detroit de noche: infraestructura industrial pesada cruzada con señal electrónica. No una postal de ruina, sino una ciudad densa con energía subterránea todavía activa.

### Positive prompt

```
cinematic aerial view of Detroit industrial cityscape at night, dark factory district, dense urban grid, cyan and magenta light traces, electronic signal lines overlaid on city streets, brutalist architecture, neon reflections on wet pavement, deep blue and black sky, volumetric industrial haze, circuit-like light patterns, high contrast, moody, photorealistic, film grain, no text, no logos, no people
```

### Negative prompt

```
text, watermark, logo, brand, festival crowd, EDM stage, confetti, pastel colors, Berlin landmarks, tourist monuments, flags, cheerful, daytime, aerial drone cliché, generic cyberpunk city, neon signs with letters, faces, portraits, overexposed
```

### Estilo FG

- Paleta oscura: negro profundo + cyan + magenta
- Grano de película sutil
- Sin texto incrustado
- Espacio visual en zona superior e inferior para overlay HTML

### Tamaño recomendado: 1216x704

---

## Thumbnail prompt

**Para:** `website/public/images/articles/techno-detroit-historia-musica-electronica-thumbnail.png`
**Ratio:** 1216x704 (16:9)

### Intención visual

Versión más compacta y directa: circuito electrónico abstracto con textura urbana de Detroit. Legible a 400px de ancho.

### Positive prompt

```
abstract electronic circuit pattern merging with Detroit urban grid, dark industrial texture, cyan signal lines, magenta accent glow, concrete and metal surfaces, underground club atmosphere, deep shadow, minimal composition, high contrast noir, no faces, no text, no logos
```

### Negative prompt

```
text, watermark, logo, brand, faces, people, festival, EDM, pastel, cheerful, generic cityscape, tourist, flags, overexposed, white background
```

### Estilo FG

- Más abstracto que el featured card
- Funciona a escala pequeña
- Sin elementos que compitan con el título en la card HTML

### Tamaño recomendado: 1216x704

---

## Social preview prompt (futuro)

**Para:** `website/public/images/articles/techno-detroit-historia-musica-electronica-social-1200x630.png`
**Ratio:** 1200x630

### Intención visual

Composición para Open Graph: espacio en zona izquierda para texto superpuesto de plataforma. Ambiente nocturno Detroit, señal electrónica visible.

### Positive prompt

```
Detroit skyline at night from ground level, industrial district, cyan light rays from underground, magenta electrical glow, dark atmospheric fog, high contrast, cinematic, wide shot, empty street, no text, film grain, editorial quality
```

### Negative prompt

```
text, watermark, logo, people, faces, festival, EDM, daytime, pastel, generic stock photo, flags, tourist landmarks
```

### Nota

No generar hasta que haya flujo de publicación en redes activo. Priorizar featured card y thumbnail primero.

---

## Parámetros ComfyUI recomendados

```
checkpoint: dreamshaper o analogMadness (SD 1.5)
steps: 30–35
cfg: 7.5–9.0
sampler: DPM++ 2M Karras
seed: documentar en ASSETS_MANIFEST.md después de generar
```
