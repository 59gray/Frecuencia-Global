# Frecuencia Global - Fase 1 Audit

- Fecha: 2026-04-02
- Objetivo de la sesion: estabilizar la base tecnica, reducir friccion operativa y dejar entry points sociales mas claros para pruebas controladas.

## A. Diagnostico inicial

### Zonas existentes

- `system/`: sistema maestro, agentes, playbooks, reglas, roadmap, memoria y templates.
- `scripts/`: automatizaciones sociales, scripts YouTube/CDP, generadores de assets, checkpoints y bastante material diagnostico.
- `website/`: sitio Astro con contenido, layouts, metadata social y build funcional.
- `08_n8n/`: workflows y variantes de export/import/runtime.
- `01_Estrategia` a `07_Operaciones`: documentacion operativa, briefs, QA, checklists y reportes por plataforma.
- `Frecuencia_Global_Assets_Base/` + `Frecuencia_Global_Activos_Canva_v1-v6/`: base de assets y versiones de produccion visual.

### Que parece funcional

- `website/` compila correctamente con `npm run build`.
- `scripts/x_preflight.ps1` da `PASS`.
- `scripts/x_profile_setup.py --dry-run` valida assets y flujo sin tocar X.
- `scripts/generate_checkpoint.py` y `run_checkpoint.ps1` forman un flujo coherente de memoria/checkpoints.
- `system/` esta bien estructurado y sirve como source of truth operativo.

### Que estaba incompleto

- TikTok no tenia preflight tecnico formal.
- Instagram y LinkedIn tenian automatizacion parcial y dependian mas de runbooks que de entry points claros.
- No habia manifiesto corto que dijera que script es oficial vs fallback vs legado.
- No habia `requirements.txt` para los scripts Python.

### Que estaba roto o fragil

- Rutas absolutas del repo en varios entry points (`TikTok`, `Instagram`, `LinkedIn`, `YouTube`).
- `scripts/youtube_channel_setup.py` dependia de una copia desde `D:\OneDrive\...`.
- `scripts/linkedin_preflight.ps1` usaba reporte con fecha fija y trataba el canonic protegido como simple caida.
- El handle de TikTok no era consistente entre automatizaciones y website.
- `scripts/x_profile_setup.py --dry-run` fallaba en consola Windows por caracteres Unicode.

### Que esta duplicado o mezclado

- TikTok: `tiktok_apply_profile_persistent.mjs`, `tiktok_apply_profile_wait_login.mjs`, `tiktok_apply_profile.mjs`, `tiktok_profile_fill.py`, `apply_tiktok_identity.ps1`.
- YouTube: scripts principales mezclados con mucho legado de diagnostico (`diag_*.py`, `step*.js`, `youtube_studio_automation.py`).
- n8n: multiples arboles de workflows (`workflows`, `workflows_cloud`, `workflows_runtime`, `workflows_fixed`, `workflows_import_ready`, `workflows_import_ready_v1`).
- Assets: coexistencia de base + versiones Canva v1-v6 + exports zip en raiz.

### Que bloquea el siguiente avance

- `frecuenciaglobal.vercel.app` sigue protegido por Vercel Authentication.
- El preview remoto todavia no refleja el ajuste del link de TikTok hecho en codigo local.
- Las pruebas reales en plataforma siguen requiriendo acceso manual a cuentas/sesiones.
- Existen secretos locales en `scripts/client_secret*.json` y `scripts/token.json`; estan ignorados, pero siguen siendo un riesgo operativo local.

## B. Plan de ejecucion priorizado

### Fase 1

1. Centralizar configuracion/rutas compartidas para automatizaciones sociales.
2. Fortalecer entry points principales sin romper los flujos actuales.
3. Corregir inconsistencias publicas (TikTok handle, reportes/preflights).
4. Dejar manifiesto minimo de entry points y dependencias.

### Fase 2

1. Consolidar preflights/reportes restantes.
2. Revisar legado diagnostico de YouTube y declarar principal vs deprecated.
3. Separar mejor artefactos de debug de scripts operativos.

### Fase 3

1. Ejecutar pruebas controladas reales por plataforma.
2. Documentar evidencia de UI y ajustar selectores fragiles.
3. Cerrar gaps manuales de perfil/bio/banner/upload.

### Fase 4

1. Consolidar `08_n8n/` en una estructura principal + snapshots.
2. Limpiar raiz del repo y mover material de export/zip a archivo historico o anexos.

## C. Implementacion real ejecutada en esta sesion

### Configuracion compartida

- Se agrego configuracion compartida para Python, Node y PowerShell:
  - `scripts/fg_automation_config.py`
  - `scripts/fg_automation_config.mjs`
  - `scripts/fg_automation_config.ps1`

### Entry points estabilizados

- TikTok:
  - `tiktok_apply_profile_persistent.mjs`
  - `tiktok_apply_profile_wait_login.mjs`
  - `tiktok_apply_profile.mjs`
  - `apply_tiktok_identity.ps1`
- X:
  - `x_profile_setup.py` usa config compartida y ya no cae por Unicode en dry-run.
- YouTube:
  - `youtube_channel_setup.py` ya no depende de una ruta fija en OneDrive.
  - `youtube_channel_api_config.py` usa rutas relativas.
  - `youtube_studio_config_cdp.py`, `youtube_studio_banner_cdp.py` y `youtube_studio_profile_cdp.py` usan config compartida.
- LinkedIn:
  - `linkedin_preflight.ps1` reescrito con fecha dinamica y deteccion de Vercel Authentication.
  - `linkedin_pipeline.ps1` y `linkedin_run.ps1` alineados con reportes dinamicos.

### Estandarizacion de superficie publica

- Se debe unificar TikTok publico a `https://tiktok.com/@frecuenciaglobal` en:
  - `website/src/components/Footer.astro`
  - `website/src/pages/contacto.astro`
  - `scripts/youtube_studio_config_cdp.py`

### Operacion y mantenimiento

- Se agrego `scripts/requirements.txt`.
- Se agrego `scripts/README_AUTOMATIONS.md` con principal/fallback/legacy.
- Se amplio `.gitignore` para perfiles locales de Chrome, traces de automatizacion y `website/dist/`.
- Se agregaron scripts npm utiles en `scripts/package.json`.
- Se creo `scripts/tiktok_preflight.ps1` para equiparar TikTok con el resto de plataformas.

## D. Verificacion ejecutada

- `python -m py_compile` sobre scripts Python tocados: OK
- `node --check` sobre scripts TikTok `.mjs`: OK
- `npm run build` en `website/`: OK
- `python scripts/x_profile_setup.py --dry-run`: OK
- `./scripts/x_preflight.ps1`: PASS
- `./scripts/instagram_preflight.ps1`: PARTIAL
  - Solo falla por Vercel Authentication en el canonic.
- `./scripts/linkedin_preflight.ps1`: PARTIAL
  - Ahora refleja correctamente el bloqueo de auth en el canonic.
- `./scripts/tiktok_preflight.ps1`: PARTIAL
  - Detecta auth en el canonic y que el preview remoto no trae todavia el link nuevo de TikTok.

## E. Candidatos a deprecacion

- `scripts/tiktok_profile_fill.py`
- `scripts/youtube_studio_automation.py`
- `scripts/diag_*.py`
- `scripts/step*.js`
- capturas de debug en `scripts/`
- versiones redundantes de workflows en `08_n8n/` una vez se elija un arbol principal

## F. Riesgos detectados

- Dominio canonic protegido por auth: bloquea bio links y preflights publicos.
- Preview remoto desactualizado respecto al codigo local.
- Secretos locales presentes en `scripts/` aunque ignorados por git.
- Automatizaciones UI siguen expuestas a cambios de selector de terceros.

## G. Que ya quedo listo para prueba

- Website local/build estable.
- X: preflight y dry-run listos.
- TikTok: assets, entry points y preflight tecnico ya existen y estan alineados.
- LinkedIn: preflight util y reportes con fecha actual.
- YouTube: rutas y bootstrap OAuth menos fragiles.

## H. Que sigue despues

1. Desactivar o gestionar Vercel Authentication para el canonic.
2. Hacer deploy/preview nuevo para que el link TikTok corregido viva en el HTML remoto.
3. Ejecutar pruebas controladas de perfil en X y TikTok con sesion real.
4. Revisar `08_n8n/` para declarar un arbol principal y mover snapshots a estado historico.
