# D05 — CIERRE QA EDITORIAL DETROIT

- Fecha de cierre: 2026-04-28
- Alcance: QA editorial de Detroit (sin publicar, sin deploy, sin plataformas)
- Base local usada: `04_Produccion/PIECE_STATUS_MATRIX.md`, `04_Produccion/pipeline_tracker.json`, `04_Produccion/swarm_mvp_tracker.json`, `07_Operaciones/BACKLOG_EDITORIAL_10_DIAS_20260427.md`, `07_Operaciones/BACKLOG_EDITORIAL_10_DIAS_20260427.csv`, `website/src/content/articles/techno-detroit-historia-musica-electronica.md`, `04_Produccion/Detroit/*`, `04_Produccion/dossiers/bass-borders-detroit-berghain/*`.

## 1) Localizacion de archivos Detroit (reales)

### Editorial / QA
- `website/src/content/articles/techno-detroit-historia-musica-electronica.md`
- `04_Produccion/Detroit/DETROIT_SOURCE_PACK_20260425.md`
- `04_Produccion/Detroit/DETROIT_QA_REPORT_20260425.md`
- `04_Produccion/Detroit/DETROIT_VISUAL_QA_20260425.md`

### Visuales / ComfyUI / dossier
- `04_Produccion/Detroit/visual_curation/DETROIT_D06_CLOSURE_20260425.md`
- `04_Produccion/Detroit/visual_curation/DETROIT_D07_FINAL_ASSET_SELECTION_20260425.md`
- `04_Produccion/dossiers/bass-borders-detroit-berghain/SERENA_VISUAL_EXTRACTION.md`
- `04_Produccion/dossiers/bass-borders-detroit-berghain/COMFYUI_DOSSIER_PROMPT.md`
- `website/public/images/dossiers/bass-borders-detroit-berghain-dossier.meta.json`

### Website / Astro
- `website/src/components/editorial/DetroitBillboardHero.astro`
- `website/public/images/articles/README.md`

## 2) Consistencia editorial detectada

## 2.1 Titulo, enfoque y copy
- Titulo y enfoque del articulo son consistentes con P2 (Bass & Borders): Detroit como matriz, Berlin como nodo de canonizacion.
- El copy mantiene tesis editorial clara y estructura util para pieza larga.
- Estado: `PASS_CON_OBSERVACIONES`.

## 2.2 Claims y fuentes
- Hay claims fuertes con respaldo parcial en `DETROIT_SOURCE_PACK_20260425.md` y cierre QA previo.
- Persisten claims con respaldo incompleto local:
  - "Detroit no los celebro al principio"
  - "tensiones culturales que persisten hoy"
  - "EDM borro raices politicas"
- En `DETROIT_SOURCE_PACK_20260425.md` faltan URLs exactas para RA/Mixmag y falta identificacion precisa de documental Arte.
- Estado: `REQUIERE_AJUSTE_EDITORIAL`.

## 2.3 Dossier / visual brief vs articulo
- El dossier `bass-borders-detroit-berghain` y prompts ComfyUI son consistentes con dualidad Detroit/Berghain y no contradicen la linea editorial.
- Dependencia ComfyUI permanece documental (no ejecutar en D05).
- Estado: `PASS`.

## 2.4 Estado en trackers
- Detroit no aparece como pieza en `PIECE_STATUS_MATRIX.md`.
- Detroit no aparece como pieza en `pipeline_tracker.json`.
- Detroit no aparece como topic en `swarm_mvp_tracker.json`.
- Estado de tracker Detroit: **NO VERIFICADO EN FUENTE LOCAL** (sin fila/campo dedicado).
- Estado: `BLOCKED_POR_TRAZABILIDAD`.

## 3) Hallazgos accionables D05 (QA editorial)

| Severidad | Area | Hallazgo | Evidencia | Accion requerida | Organo |
|---|---|---|---|---|---|
| Alta | Website / Astro | Referencias de imagen del articulo apuntan a archivos no encontrados localmente en `website/public/images/articles/` | Frontmatter del articulo usa `/images/articles/techno-detroit-hero.png`, `/images/articles/techno-detroit-hero.webp`, `/images/articles/bass-borders-detroit-card.webp`, `/images/articles/techno-detroit-og.png`; en carpeta solo existe `README.md` | Ajustar frontmatter a assets existentes reales o materializar assets faltantes desde fuente local validada | Website / Astro |
| Alta | Editorial | Claims clave sin trazabilidad de fuente exacta local | `DETROIT_SOURCE_PACK_20260425.md` marca faltantes de URL/titulo exacto | Convertir claims a redaccion interpretativa explicita o anexar referencia exacta verificable localmente | Editorial |
| Media | Operaciones / QA | Detroit sin estado en trackers operativos | No existe Detroit en `PIECE_STATUS_MATRIX`, `pipeline_tracker`, `swarm_mvp_tracker` | Crear entrada operativa Detroit en tracker editorial local (sin Notion) o marcar explicitamente fuera de tracker con justificacion | Operaciones / QA |
| Media | Visuales / ComfyUI | Curaduria visual reportada, pero canonicidad final depende de revision humana | `DETROIT_D06_CLOSURE_20260425.md`, `DETROIT_D07_FINAL_ASSET_SELECTION_20260425.md` | Mantener D06 como prerequisito: confirmar set canonico y mapearlo a rutas reales consumidas por website | Diseno / visuales / ComfyUI |
| Baja | Editorial | Pie de fuentes del articulo es general y no lista enlaces concretos | Linea final del articulo + source pack | Sustituir bloque de fuentes por referencias concretas o marcar "NO VERIFICADO EN FUENTE LOCAL" donde aplique | Editorial |

## 4) Bloqueos y dependencias

- Bloqueo 1 (editorial): claims sin fuente exacta local -> dependencia `revision_humana`.
- Bloqueo 2 (website): assets del frontmatter no localizados en carpeta esperada -> dependencia `website`.
- Bloqueo 3 (trazabilidad): Detroit no registrado en trackers base -> dependencia `Notion,revision_humana` para homologacion de estado (sin editar Notion en esta tarea).
- Dependencia ComfyUI: solo para curaduria/seleccion, no para publicar.

## 5) Cierre D05 (decision)

Decision D05: `QA_EDITORIAL_CERRADO_CON_BLOQUEOS_CONTROLADOS`.

Interpretacion operativa:
- QA editorial de contenido queda cerrado a nivel diagnostico y acciones definidas.
- No queda autorizada publicacion ni distribucion.
- Para pasar a estado limpio de ejecucion interna, primero resolver:
  1) fuente exacta de claims criticos,
  2) rutas de assets efectivas en website,
  3) trazabilidad de estado Detroit en tracker local.

## 6) Siguiente accion concreta (D05 -> D06)

1. Editorial: resolver 3 claims en riesgo (fuente exacta o reformulacion).
2. Website / Astro: alinear frontmatter con archivos reales existentes.
3. Visuales / ComfyUI (D06): confirmar set canonico final y registrar mapping de rutas.
