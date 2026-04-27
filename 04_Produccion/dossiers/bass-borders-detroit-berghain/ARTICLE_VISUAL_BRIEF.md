# Visual Brief — Dossier Bass & Borders: Detroit / Berghain

Tipo: Dossier (lectura marco, no artículo individual)
Frecuencia: p2 — Bass & Borders
Slug: bass-and-borders (ruta /pilares/bass-and-borders)
Asset objetivo: `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.png`
Estado del asset: PENDIENTE — requiere ComfyUI

---

## Función del dossier

El dossier no es un artículo nuevo. Es una lectura marco que conecta varias piezas bajo una misma frecuencia. No describe escenas — las analiza como operaciones sociales, materiales y de poder.

Tesis: La música electrónica no solo se escucha: también organiza acceso, pertenencia, memoria, prestigio y poder urbano.

---

## Tesis visual

**No es una postal de dos ciudades. Es la tensión entre dos sistemas.**

Detroit: raíz material. Ciudad-fábrica. Circuito. Señal que viene del piso de la fábrica.
Berghain: umbral. Puerta. Control visual. Espacio que transforma el acceso en símbolo.

La imagen debe activar esa tensión sin representar ninguna de las dos ciudades literalmente.

---

## Elementos permitidos

- Ciudad industrial nocturna en plano lejano o abstracto — skyline sin detalles reconocibles
- Señal electrónica como objeto visual: onda, frecuencia, línea de transmisión
- Puerta / umbral / pasaje — arquitectura abstracta, no fachada identificable
- Textura concreta: asfalto, metal, hormigón, vapor, humo
- Luz de neón o lineal: cyan, magenta, violeta — sin texto
- Ambiente subterráneo o nocturno
- Perspectiva de pasillo o corredor como metáfora del filtro/acceso
- Reflejo en charco urbano nocturno
- Antena, cable, circuito — transmisión como motivo visual

---

## Elementos prohibidos

- Logos de Berghain, Tresor, Submerge, Metroplex o cualquier sello/club identificable
- Fachada del Berghain o del edificio de la centrale Heizkraftwerk (reconocible)
- Puerta de Brandenburgo o monumentos de Berlín
- Skyline de Detroit con silueta reconocible del Renaissance Center
- Personas identificables
- Texto grande incrustado en la imagen
- Estética EDM: colores neón saturados, confeti, crowd con manos arriba
- Colores pastel o alta saturación sin contraste
- Imágenes de stock con marca de agua

---

## Composición sugerida

**Opción A (preferida): Dualidad lateral**
- Mitad izquierda: estructura industrial, señal, transmisión — temperatura fría, azul/cyan
- Mitad derecha: pasillo/umbral oscuro, luz puntual, magenta/violeta
- División central: línea de señal, cable o gradiente que une los dos lados

**Opción B: Perspectiva de umbral**
- POV en el interior de un corredor oscuro mirando hacia una puerta
- Luz exterior industrial al fondo
- Textura de pared de hormigón o metal

**Ratio:** 16:9 (landscape) o 3:2 — para uso como banda visual entre intro y cards
**Resolución mínima:** 1440 × 810 px
**Formato:** PNG o WebP

---

## Paleta de color

- Base: `#0A0A0F` — negro FG
- Acento frío: `#00E5FF` — cyan (señal, circuito, Detroit)
- Acento cálido: `#C800FF` — magenta (umbral, Berghain)
- Violeta profundo: `#7C728F` — tono p2
- Textura: grano de película, ruido digital sutil — 5–10% de opacidad sobre toda la imagen

---

## Uso del asset

Integración en `/pilares/bass-and-borders` como banda visual entre el bloque de intro del dossier y las cards de artículos. Debe tener overlay oscuro sutil (`bg-black/40` o `bg-black/50`) para no competir con el texto superpuesto si se usa con caption.

En layout: `object-cover`, `aspect-video` o altura fija de 280–360px en desktop.

---

## Prompt ComfyUI propuesto

```
Prompt positivo:
industrial city at night, abstract signal wave, dark corridor with light at the end, electric cyan glow, 
magenta neon accent, concrete texture, metal pipes, no text, no people, no logos, 
dark background near black, film grain, high contrast, cinematic still, 
techno aesthetic without EDM clichés, signal as architecture, threshold as concept,
wide format, 16:9

Prompt negativo:
text, watermark, logo, person, face, crowd, hands up, confetti, festival, colorful background,
Berlin Brandenburg gate, Detroit Renaissance Center, Berghain facade,
pastel colors, generic stock photo, low contrast, overexposed, cartoon, illustration

Checkpoint base: SD 1.5 / SDXL
Sampler: DPM++ 2M Karras
Steps: 28–35
CFG scale: 7.0–8.5
Size: 1440 × 810
Seed: documentar con el resultado final
```

---

## Estado

| Item | Estado |
|---|---|
| Brief visual | Creado 2026-04-26 |
| Asset | PENDIENTE — ComfyUI |
| Ruta reservada | `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.png` |
| Integración en [slug].astro | Condicional — renderiza solo si el archivo existe |
