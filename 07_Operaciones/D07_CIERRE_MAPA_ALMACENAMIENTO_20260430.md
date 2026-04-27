# D07 — CIERRE MAPA DE ALMACENAMIENTO C:/ D:/ F:

- Fecha: 2026-04-30
- Alcance: auditoria repo-first + spot-check no destructivo de rutas clave

## 1) Que se reviso

- `07_Operaciones/D06_CIERRE_ASSETS_VISUALES_COMFYUI_20260429.md`
- `07_Operaciones/D06_NAMING_ASSETS_VISUALES_20260429.md`
- `07_Operaciones/D06_COMFYUI_OUTPUTS_CURADURIA_20260429.csv`
- `07_Operaciones/BACKLOG_EDITORIAL_10_DIAS_20260427.md`
- `07_Operaciones/API_CONTROL_PANEL.md`
- `04_Produccion/PIECE_STATUS_MATRIX.md`
- rutas referenciadas en scripts (`scripts/*.py`) y ops (`07_Operaciones/*.md`)
- spot-check `Test-Path` selectivo para raices confirmadas en C/D/F

## 2) Que se cambio

- Se creo documentacion operativa de mapa de almacenamiento sin modificar archivos fuera de entregables D07.

## 3) Archivos creados/actualizados

1. `07_Operaciones/D07_MAPA_ALMACENAMIENTO_CDF_20260430.md`
2. `07_Operaciones/D07_MAPA_ALMACENAMIENTO_CDF_20260430.csv`
3. `07_Operaciones/D07_CIERRE_MAPA_ALMACENAMIENTO_20260430.md`

## 4) Hallazgos principales

- Repo canonico operativo permanece en `C:\Users\farid\Documents\Frecuencia Global`.
- Existe jerarquia paralela `D:\FrecuenciaGlobal` con duplicacion de carpetas tipo repo (`04_Produccion`, `06_Assets`) ademas de `AV`, `ComfyUI`, `backups`.
- Outputs ComfyUI aparecen como dependencia operativa en scripts apuntando a `D:\FrecuenciaGlobal\ComfyUI\output`, con ruta alternativa documentada `D:\ComfyUI\output`.
- En `F:\` existe `F:\Frecuencia Global\output` vacio en spot-check superficial; **NO VERIFICADO EN FUENTE LOCAL** el proposito en fuentes prioritarias.

## 5) Bloqueos

- No hay bloqueo de auditoria documental; si hay bloqueo operativo es **drift C: vs D:** sin reconciliacion.
- Migraciones futuras quedan bloqueadas hasta inventario manifest por pieza y definicion de source-of-truth.

## 6) Confirmacion operativa

- No se movieron archivos entre discos.
- No se borraron ni renombraron archivos.
- No se editaron `.env`, tokens ni credenciales.

## 7) Recomendacion concreta para D08

1. Generar tabla `pieza -> path_canonico_assets -> path_alternativo_D -> estado` usando manifests existentes (`ASSETS_MANIFEST.md`, trackers) sin mover archivos.
2. Resolver duplicidad `06_Assets` y `website/public/images/**` versus depositos `D:\\FrecuenciaGlobal\\AV\\**` mediante documentacion de handoff, no por copia masiva.
