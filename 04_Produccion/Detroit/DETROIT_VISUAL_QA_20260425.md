# DETROIT_VISUAL_QA
# D05 — QA Visual Detroit
# 2026-04-25 | Frecuencia Global

**Corte:** 2026-04-25  
**Guardrails:** No generar imágenes nuevas · No ejecutar ComfyUI · No borrar assets

---

## 1. Hero declarado en frontmatter

| Campo | Valor |
|-------|-------|
| Declarado en `image:` | `/images/articles/techno-detroit.jpg` |
| Ruta local resuelta | `website/public/images/articles/techno-detroit.jpg` |
| Existe localmente | ❌ NO — archivo `.jpg` ausente |
| Alternativa directa | `website/public/images/articles/techno-detroit.png` — ✅ EXISTE |
| Alternativa webp | `website/public/images/articles/techno-detroit.webp` — ✅ EXISTE |

**Acción aplicada:** Frontmatter corregido de `.jpg` → `.png` en QA D05.

---

## 2. Inventario de assets Detroit encontrados

### Assets en `website/public/images/articles/` (raíz, profundidad 1)

| Archivo | Tipo | Uso probable |
|---------|------|--------------|
| `techno-detroit.png` | PNG | Hero candidato principal (nombre base = slug) |
| `techno-detroit.webp` | WebP | Hero candidato optimizado |
| `techno-detroit-hero.png` | PNG | Hero explícito — candidato principal |
| `techno-detroit-hero.webp` | WebP | Hero optimizado — candidato principal |
| `techno-detroit-hero-billboard.png` | PNG | Hero billboard/formato amplio |
| `techno-detroit-hero-context.png` | PNG | Variante contextual del hero |
| `techno-detroit-card.png` | PNG | Card / thumbnail para listados |
| `techno-detroit-og.png` | PNG | Open Graph (redes sociales) |
| `techno-detroit-manga-01.png` | PNG | Manga estilo — uso editorial/blog |
| `techno-detroit-manga-01.webp` | WebP | Idem optimizado |
| `techno-detroit-manga-01-v8.png` | PNG | Variante v8 manga-01 |
| `techno-detroit-manga-01-v8.webp` | WebP | Idem webp |
| `techno-detroit-manga-01-v9.png` | PNG | Variante v9 |
| `techno-detroit-manga-01-v9.webp` | WebP | Idem webp |
| `techno-detroit-manga-01-v10.png` | PNG | Variante v10 |
| `techno-detroit-manga-01-v10.webp` | WebP | Idem webp |
| `techno-detroit-manga-01-v11.png` | PNG | Variante v11 |
| `techno-detroit-manga-01-v11.webp` | WebP | Idem webp |
| `techno-detroit-manga-01-v12.png` | PNG | Variante v12 |
| `techno-detroit-manga-01-v12.webp` | WebP | Idem webp |
| `techno-detroit-manga-02.png` | PNG | Manga estilo 02 |
| `techno-detroit-manga-02.webp` | WebP | Idem webp |
| `techno-detroit-manga-02-master-v2.png` | PNG | Manga 02 master v2 |
| `techno-detroit-manga-02-master-v2.webp` | WebP | Idem webp |
| `techno-detroit-manga-03.png` | PNG | Manga estilo 03 |
| `techno-detroit-manga-03.webp` | WebP | Idem webp |
| `techno-detroit-billboard-manga-v1.png` | PNG | Billboard manga v1 — base |
| `techno-detroit-billboard-manga-v1-rebuilt.jpg` | JPG | Billboard reconstruido |
| `techno-detroit-billboard-manga-v1-rebuilt.png` | PNG | Billboard reconstruido PNG |
| `techno-detroit-billboard-manga-v1-rebuilt.webp` | WebP | Billboard reconstruido WebP |
| `techno-detroit-billboard-manga-v1-refine-1.png` | PNG | Refinamiento 1 |
| `techno-detroit-billboard-manga-v1-refine-2.png` | PNG | Refinamiento 2 |
| `techno-detroit-billboard-manga-v1-refine-3.png` | PNG | Refinamiento 3 |
| `techno-detroit-billboard-manga-v2.png` | PNG | Billboard manga v2 |
| `techno-detroit-billboard-manga-v3.png` | PNG | Billboard manga v3 |

**Total assets raíz:** 34 archivos

### Assets en `_comfy_download_techno_manga/` (lotes ComfyUI brutos)

Lotes encontrados (directorios):

| Lote ComfyUI | Contenido |
|--------------|-----------|
| `techno-detroit-billboard-manga-v1/` | 12 pass1 + 4 pass2 = 16 exports PNG |
| `techno-detroit-billboard-manga-v1-refine-1/` | lote de refinamiento |
| `techno-detroit-billboard-manga-v1-refine-2/` | lote de refinamiento |
| `techno-detroit-billboard-manga-v1-refine-3/` | lote de refinamiento |
| `techno-detroit-billboard-manga-v2/` | lote v2 |
| `techno-detroit-billboard-manga-v3/` | lote v3 |
| `techno-detroit-manga-01/` | lote manga-01 base |
| `techno-detroit-manga-02/` | lote manga-02 base |
| `techno-detroit-manga-02-lineart-master/` | lineart master |
| `techno-detroit-manga-02-lineart-master-d/` | lineart master variante D |
| `techno-detroit-manga-02-master-v3a/` | master v3a |
| `techno-detroit-manga-02-master-v3a-r1/` | refinamiento r1 |
| `techno-detroit-manga-02-master-v3a-r2/` | refinamiento r2 |
| `techno-detroit-manga-02-master-v3b/` | master v3b |
| `techno-detroit-manga-02-master-v4/` | master v4 |
| `techno-detroit-manga-02-style-a/` | style-a |

**Total lotes ComfyUI:** 16+ directorios — sin curar

---

## 3. Candidatos aprobados por rol

| Rol | Candidato recomendado | Justificación |
|-----|-----------------------|---------------|
| Hero web | `techno-detroit-hero.png` / `.webp` | Nombre explícito "hero", existe en raíz |
| Hero alt (actual en frontmatter corregido) | `techno-detroit.png` | Nombre base = slug del artículo |
| Card / thumbnail | `techno-detroit-card.png` | Nombre explícito "card" |
| Open Graph | `techno-detroit-og.png` | Nombre explícito "og" |
| Billboard editorial | `techno-detroit-billboard-manga-v1-rebuilt.webp` | Versión reconstruida, formato webp optimizado |

**Nota:** La curaduría final de qué candidato queda como hero canónico es tarea D06.

---

## 4. Faltantes visuales

| Item | Estado |
|------|--------|
| `techno-detroit.jpg` (declarado en frontmatter original) | ❌ FALTA — corregido a `.png` |
| Thumbnail vertical (formato story/IG) | ❌ No encontrado en raíz — puede estar en lotes ComfyUI sin curar |
| Imagen cuadrada (formato IG feed) | ❌ No encontrado en raíz |

---

## 5. Assets excluidos de esta QA

- Lotes ComfyUI en `_comfy_download_techno_manga/` — **no curados**. Requieren selección manual en D06.
- Assets `.webp` generados (fuera de raíz) — no evaluados en este corte.

---

## 6. Decisión visual

```
HERO_NEEDS_REPLACEMENT
THUMB_PENDING
```

**Razón:**
- El hero declarado (`techno-detroit.jpg`) no existe. **Corregido provisionalmente a `techno-detroit.png`** para que el build no falle.
- `techno-detroit.png` es válido como placeholder de piloto — existe, tiene nombre base coherente con el slug.
- El hero canónico final debe seleccionarse en D06 entre los candidatos identificados (especialmente `techno-detroit-hero.png` / `.webp`).
- Thumbnail para IG/vertical: pendiente de curaduría ComfyUI en D06.

---

*Generado: 2026-04-25 | Agente: Windsurf Cascade | Tarea: D05*
