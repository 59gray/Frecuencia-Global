# D13 — Cierre: paquete Git Bass & Borders (dossier + ComfyUI)

**Fecha:** 2026-05-04  
**Rama:** `feature/geopolitik-drop-cards-thumbnails-20260426`  
**Objetivo:** empaquetar en un commit local el trabajo de dossier Bass & Borders (producción, imágenes publicadas y script ComfyUI), sin tocar el grupo D de archivos sueltos ni el cierre dummy Detroit.

---

## Base y verificación

- Referencia previa: `07_Operaciones/D12_AISLAMIENTO_WORKTREE_20260504.md` (grupos B + C).
- Diffs revisados **solo** bajo:
  - `scripts/comfyui_dossier_bass_borders.py`
  - `website/public/images/dossiers/bass-borders-*`
  - `04_Produccion/dossiers/bass-borders-detroit-berghain/`
- **Ámbito:** prompts/extracción Serena, regeneración/adecuación del PNG de dossier ya existente en repo (sin pipeline de generación nueva en esta tarea), meta JSON y ajustes del script de cómputo local.

---

## Build local (`website/`)

```text
npm run build
```

**Resultado:** exit code **0** — `astro build` completado; **27** páginas estáticas generadas (advertencia única de Vite sobre imports no usados en dependencia Astro; no bloqueante).

---

## Commit local (sin push)

**Mensaje:** `feat(website): package Bass & Borders dossier assets`

**Archivos incluidos (staging selectivo, sin `git add .`):**

1. `04_Produccion/dossiers/bass-borders-detroit-berghain/COMFYUI_DOSSIER_PROMPT.md`
2. `04_Produccion/dossiers/bass-borders-detroit-berghain/SERENA_VISUAL_EXTRACTION.md`
3. `scripts/comfyui_dossier_bass_borders.py`
4. `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.meta.json`
5. `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.png`
6. `07_Operaciones/D13_CIERRE_DOSSIER_BASS_BORDERS_20260504.md` *(este archivo)*

**SHA:** no se autopersiste en este archivo (evita desajuste tras `git commit --amend`). Para el hash canónico del paquete en esta rama: `git log -1 --format=%H --grep="package Bass & Borders dossier assets"` o `git log -1 --format=%H`.

---

## Qué no se tocó (política D13)

- Sin **push**.
- Sin `git add .`, sin hard reset, sin borrar ni mover archivos.
- Sin credenciales, Notion, APIs ni deploy.
- **Detroit / dummy D09–D11:** sin cambios en este paquete.
- **Grupo D (~3309+ rutas `??`):** no añadidos al índice; solo se permite tocar artefactos ops explícitos (D12/D13) según alcance — en la práctica, este cierre **no** incorpora otros `??` masivos.

---

## Recomendación siguiente

Cuando exista política de remoto, **push** de esta rama con este commit incluido; antes, revisar si los artefactos `07_Operaciones/D12_*.patch` / `D12_*.md` sin seguimiento deben entrar en otro commit ops aparte.
