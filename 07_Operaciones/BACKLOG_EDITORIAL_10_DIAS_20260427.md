# BACKLOG EDITORIAL 10 DIAS — 2026-04-27 a 2026-05-06

## 1) Resumen ejecutivo

Se consolida un backlog editorial repo-first de 10 dias con base en fuentes locales: `PIECE_STATUS_MATRIX`, `pipeline_tracker`, `swarm_mvp_tracker`, cierre D04 del 2026-04-25 y paneles operativos ya auditados. El foco operativo sigue en contenido/editorial/QA sin publicar ni tocar APIs, y con separacion estricta por organo.

## 2) Estado real detectado (fuente local)

- `MVP_01`, `MVP_02`, `MVP_03`: `PUBLISHED` en `04_Produccion/swarm_mvp_tracker.json`.
- `MVP_04` a `MVP_10`: `IDEA` en `04_Produccion/swarm_mvp_tracker.json`.
- `P1_001`: `PUBLISHED_MULTI` en `04_Produccion/PIECE_STATUS_MATRIX.md` y `04_Produccion/pipeline_tracker.json`.
- `P1_002`: contradiccion local (`COMPLETED` en matriz vs `APPROVAL_PENDING` en tracker); tratar como no activable sin reconciliacion humana.
- `EP_001`, `EP_002`: `PUBLISH_READY` pero bloqueadas por falta de audio master y thumbnail en `04_Produccion/pipeline_tracker.json`.
- `P1_003`, `P1_004`: en cola por brief (`pipeline siguiente`) en `04_Produccion/PIECE_STATUS_MATRIX.md`.
- `Detroit`: pieza piloto activa/canonica en cierre previo `07_Operaciones/DAY04_EDITORIAL_BACKLOG_20260425.md` con QA editorial y curaduria visual pendientes.
- `X` y `TikTok`: `MISCONFIGURED` en `07_Operaciones/API_CONTROL_PANEL.md`; no entran al backlog editorial de ejecucion.

## 3) Agenda editorial de 10 dias

### 2026-04-27 (D04)

| ID | Organo | Pieza | Entrada requerida | Salida esperada | DONE | Dependencia | Estado |
|---|---|---|---|---|---|---|---|
| D04-ED-001 | Editorial | Detroit | `DAY04_EDITORIAL_BACKLOG_20260425.md`, articulo Detroit local | Checklist editorial Detroit v1 (estructura, claims, tono) | Checklist guardado en repo y sin campos vacios | revision_humana | READY |
| D04-OPS-001 | Operaciones / QA | Detroit | Checklist editorial v1 + matriz de piezas | Registro de hallazgos QA editorial priorizados | Hallazgos con severidad y accion concreta | revision_humana | READY |

### 2026-04-28 (D05)

| ID | Organo | Pieza | Entrada requerida | Salida esperada | DONE | Dependencia | Estado |
|---|---|---|---|---|---|---|---|
| D05-OPS-001 | Operaciones / QA | Detroit | Checklist/hallazgos D04 | Cierre QA editorial Detroit | Estado Detroit marcado QA_EDITORIAL_CERRADO en documento operativo | revision_humana | READY |
| D05-ED-001 | Editorial | Detroit | QA editorial cerrado | Lista de ajustes editoriales aplicables (sin publicar) | Ajustes aceptados/rechazados con razon | revision_humana | READY |
| D05-WEB-001 | Website / Astro | Detroit | Ajustes editoriales aprobados | Articulo Detroit alineado en fuente web local | Frontmatter y cuerpo validados contra checklist | website | READY |

### 2026-04-29 (D06)

| ID | Organo | Pieza | Entrada requerida | Salida esperada | DONE | Dependencia | Estado |
|---|---|---|---|---|---|---|---|
| D06-DIS-001 | Diseno / visuales / ComfyUI | Detroit | Inventario assets Detroit + variantes ComfyUI | Naming final de assets visuales por convencion unica | Convencion definida y aplicada en manifiesto local | ComfyUI | READY |
| D06-DIS-002 | Diseno / visuales / ComfyUI | Detroit | Outputs en `website/public/images/articles/_comfy_download_techno_manga/` | Curaduria de outputs ComfyUI por pieza | Set aprobado (hero/card/thumb) con justificacion breve | ComfyUI,revision_humana | READY |
| D06-OPS-001 | Operaciones / QA | Detroit | Naming + curaduria D06 | Validacion QA visual | QA visual aprobado o con bloqueos explicitos | revision_humana | READY |

### 2026-04-30 (D07)

| ID | Organo | Pieza | Entrada requerida | Salida esperada | DONE | Dependencia | Estado |
|---|---|---|---|---|---|---|---|
| D07-ED-001 | Editorial | P1_003 | `03_Editorial/P1_003_Brief.md` | Brief normalizado para ejecucion editorial | Brief con alcance, angulo y fuentes iniciales | revision_humana | READY |
| D07-OPS-001 | Operaciones / QA | P1_003 | Brief normalizado + criterios de gates | Gate de entrada editorial (go/no-go) | Decision documentada sin ambiguedad | revision_humana | READY |

### 2026-05-01 (D08)

| ID | Organo | Pieza | Entrada requerida | Salida esperada | DONE | Dependencia | Estado |
|---|---|---|---|---|---|---|---|
| D08-ED-001 | Editorial | P1_004 | `03_Editorial/P1_004_Brief.md` + orden P1_003->P1_004 | Brief normalizado P1_004 | Brief listo con supuestos y riesgos | revision_humana | READY |
| D08-OPS-001 | Operaciones / QA | P1_004 | Brief normalizado | Gate de entrada editorial P1_004 | Decision go/no-go documentada | revision_humana | READY |

### 2026-05-02 (D09)

| ID | Organo | Pieza | Entrada requerida | Salida esperada | DONE | Dependencia | Estado |
|---|---|---|---|---|---|---|---|
| D09-ED-001 | Editorial | MVP_04 | `swarm_mvp_tracker.json` (MVP_04 IDEA) | IdeaCard/brief editorial MVP_04 | Pieza pasa de IDEA a BRIEF_READY documental | revision_humana | READY |
| D09-DIS-001 | Diseno / visuales / ComfyUI | MVP_04 | brief MVP_04 | requerimiento visual minimo MVP_04 | visual brief base definido | ComfyUI | READY |
| D09-OPS-001 | Operaciones / QA | MVP_04 | brief + visual brief | gate QA de continuidad | gate registrado con riesgos | revision_humana | READY |

### 2026-05-03 (D10)

| ID | Organo | Pieza | Entrada requerida | Salida esperada | DONE | Dependencia | Estado |
|---|---|---|---|---|---|---|---|
| D10-ED-001 | Editorial | MVP_05 | `swarm_mvp_tracker.json` (MVP_05 IDEA) | brief editorial MVP_05 | IDEA -> BRIEF_READY documental | revision_humana | READY |
| D10-DIS-001 | Diseno / visuales / ComfyUI | MVP_05 | brief MVP_05 | visual brief MVP_05 | visual brief aprobado | ComfyUI | READY |

### 2026-05-04 (D11)

| ID | Organo | Pieza | Entrada requerida | Salida esperada | DONE | Dependencia | Estado |
|---|---|---|---|---|---|---|---|
| D11-ED-001 | Editorial | MVP_06 | `swarm_mvp_tracker.json` (MVP_06 IDEA) | brief editorial MVP_06 | IDEA -> BRIEF_READY documental | revision_humana | READY |
| D11-OPS-001 | Operaciones / QA | MVP_06 | brief MVP_06 | gate QA de claims/fuentes | gate con riesgos y accion | revision_humana | READY |

### 2026-05-05 (D12)

| ID | Organo | Pieza | Entrada requerida | Salida esperada | DONE | Dependencia | Estado |
|---|---|---|---|---|---|---|---|
| D12-ED-001 | Editorial | MVP_07 | `swarm_mvp_tracker.json` (MVP_07 IDEA) | brief editorial MVP_07 | IDEA -> BRIEF_READY documental | revision_humana | READY |
| D12-DIS-001 | Diseno / visuales / ComfyUI | MVP_07 | brief MVP_07 | visual brief MVP_07 | set visual minimo definido | ComfyUI | READY |
| D12-WEB-001 | Website / Astro | Detroit | fuente Detroit + QA D05/D06 | validacion integridad web local (sin deploy) | rutas locales verificadas y evidencia registrada | website | READY |

### 2026-05-06 (D13)

| ID | Organo | Pieza | Entrada requerida | Salida esperada | DONE | Dependencia | Estado |
|---|---|---|---|---|---|---|---|
| D13-ED-001 | Editorial | MVP_08 | `swarm_mvp_tracker.json` (MVP_08 IDEA) | brief editorial MVP_08 | IDEA -> BRIEF_READY documental | revision_humana | READY |
| D13-OPS-001 | Operaciones / QA | MVP_08 | brief MVP_08 + backlog D04-D13 | cierre semanal editorial operativo | reporte de cierre y siguiente prioridad | revision_humana | READY |

## 4) Tareas bloqueadas

- `BLK-EP001-001` (Editorial, `EP_001`): bloqueada por falta de audio master y thumbnail. Dependencia: revision_humana. Estado: BLOCKED.
- `BLK-EP002-001` (Editorial, `EP_002`): bloqueada por falta de audio master y thumbnail. Dependencia: revision_humana. Estado: BLOCKED.
- `BLK-P1002-001` (Operaciones / QA, `P1_002`): bloqueada por drift de estado (`COMPLETED` vs `APPROVAL_PENDING`). Dependencia: Notion,revision_humana. Estado: BLOCKED.

## 5) Tareas que NO deben tocarse todavia

- Publicacion en plataformas (Threads/IG/FB/LinkedIn/X/TikTok/YouTube): fuera de alcance D04.
- Credenciales, tokens, `.env`, refresh OAuth y pruebas API: fuera de alcance D04.
- Deploy web o ejecucion de scripts de publicacion/orquestacion: fuera de alcance D04.
- Reapertura de frentes cerrados D02/D03 (n8n bridge/scheduler/sync infra): no reabrir sin dependencia directa.

## 6) Proximos 3 cierres recomendados

1. Cerrar `D05-OPS-001` (QA editorial Detroit) con evidencia de checklist y hallazgos resueltos.
2. Cerrar `D06-DIS-001` y `D06-DIS-002` (naming final + curaduria ComfyUI Detroit) en un mismo paquete documental.
3. Cerrar conversion de `MVP_04` y `MVP_05` de `IDEA` a `BRIEF_READY` para sostener continuidad editorial sin publicar.
