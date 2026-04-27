# WINDSURF NEXT 72H — PLAN DE EJECUCIÓN INMEDIATA

> **Fecha:** 2026-04-25  
> **Ventana:** Próximas 72 horas (hasta 2026-04-28)  
> **Regla 70/30:** 70% producto visible, 30% máx infraestructura  
> **Pieza prioritaria:** P1_003

---

## RESUMEN EJECUTIVO

| Hora | Bloque | Acción | Producto |
|------|--------|--------|----------|
| H0-2 | A | Validar website build | Build limpio, rutas verificadas |
| H2-4 | A | Leer P1_003 brief | Entender base investigación |
| H4-8 | A | Crear ResearchPack P1_003 | Research.md completo |
| H8-12 | B | Documentar workflows n8n | Mapeo sin ejecución |
| H12-16 | A | Generar assets P1_003 (ComfyUI) | Cover + carrusel PNGs |
| H16-20 | A | Crear PublishReady P1_003 | Paquete publicación multiplataforma |
| H20-24 | B | Validar con scripts | QA + validate_publishready |
| H24-72 | A | Avanzar pieza siguiente / refinar | Según resultado P1_003 |

---

## BLOQUE A — PRODUCTO VISIBLE (70%)

### Acción A1: Website Build Validado ✅ PRIMERA
**Tiempo:** 30 min  
**Comando:**
```powershell
cd "C:\Users\farid\Documents\Frecuencia Global\website"
npm run build
```
**Éxito:** Build sin errores, dist/ generado (~180 MB)  
**Siguiente:** Revisar rutas generadas en dist/

### Acción A2: Leer P1_003 Brief ✅ SEGUNDA
**Tiempo:** 30 min  
**Archivo:** `03_Editorial/P1_003_Brief.md`  
**Objetivo:** Entender tema, ángulo, fuentes iniciales  
**Output:** Resumen ejecutivo para ResearchPack

### Acción A3: Crear P1_003 ResearchPack ✅ TERCERA
**Tiempo:** 4 horas  
**Archivo nuevo:** `03_Editorial/P1_003_ResearchPack.md`  
**Contenido mínimo:**
- Tema central (del brief)
- 3-5 claims verificables
- Fuentes primarias (URLs)
- Datos concretos (cifras, fechas)
- Contexto geopolítico
- Contrapuntos / perspectivas alternativas

**Basado en:** P1_001 y P1_002 Research.md como referencia

### Acción A4: Generar Assets P1_003 (ComfyUI) ✅ CUARTA
**Tiempo:** 4 horas  
**Output:** `06_Assets/P1_003/` con:
- Cover principal (1200x630 PNG)
- Carrusel Instagram 4-5 slides (1080x1080 PNGs)
- Thumbnail video/podcast (1280x720)

**Workflow:** Usar ComfyUI con modelos existentes  
**Nota:** Si adapter tiene problemas, documentar en `07_Operaciones/WINDSURF_COMFYUI_STATUS.md`

### Acción A5: Crear P1_003 PublishReady ✅ QUINTA
**Tiempo:** 4 horas  
**Archivo nuevo:** `04_Produccion/P1_003_PublishReady.md`  
**Basado en:** `P1_002_PublishReady.md` (estructura 100/100 validada)  
**Secciones requeridas:**
- X (Twitter): 280 chars max, hashtags
- Instagram: Caption + hashtags
- LinkedIn: Versión profesional
- TikTok: 300 chars max
- Pre-evaluación automática (placeholder)

---

## BLOQUE B — OPERACIÓN (≤30%)

### Acción B1: Mapear Workflows n8n
**Tiempo:** 2 horas  
**Input:** Archivos JSON en `08_n8n/`  
**Output:** `07_Operaciones/WINDSURF_N8N_WORKFLOW_MAP.md`
**Restricción:** SIN ejecutar n8n runtime, SIN docker up
**Contenido:**
- Lista de workflows identificados
- Triggers de cada workflow
- Acciones principales
- Dependencias (Notion, APIs)

### Acción B2: Preparar CSV Notion Seguro
**Tiempo:** 1 hora  
**Output:** `07_Operaciones/WINDSURF_NOTION_CSV_TEMPLATE.md`
**Restricción:** NO ejecutar import, solo preparar estructura
**Basado en:** `NOTION_FIELD_MAP.json`

### Acción B3: QA + Validación
**Tiempo:** 1 hora  
**Comandos:**
```powershell
# Validar estructura PublishReady
python scripts/validate_publishready.py --pieza P1_003 2>&1 || echo "Script no disponible - validación manual"

# Verificar assets
Test-Path "06_Assets/P1_003/ASSETS_MANIFEST.md"
Get-ChildItem "06_Assets/P1_003/" -ErrorAction SilentlyContinue
```

---

## BLOQUE C — RIESGOS NO BLOQUEANTES

| Riesgo | Mitigación | Estado |
|--------|------------|--------|
| ComfyUI adapter falla | Usar assets placeholder / documentar | Monitorear |
| n8n no levanta | NO requerido para P1_003 | Aceptable |
| Notion API no disponible | Usar CSV local | Aceptable |
| Build website falla | Revisar deps, no deploy | Monitorear |
| Falta token plataformas | NO publicar, solo preparar | Aceptable |

---

## ORDEN RECOMENDADO DE EJECUCIÓN

```
1. A1 (30 min) ──▶ Build website
2. A2 (30 min) ──▶ Leer P1_003 brief
3. B1 (2 hrs) ──▶ Mapeo n8n (paralelo si aplica)
4. A3 (4 hrs) ──▶ ResearchPack P1_003
5. A4 (4 hrs) ──▶ Assets ComfyUI
6. A5 (4 hrs) ──▶ PublishReady P1_003
7. B2 (1 hr) ──▶ CSV Notion template
8. B3 (1 hr) ──▶ QA + validación
9. Cierre ────▶ Update logs, commit, reporte
```

---

## CRITERIO DE ÉXITO 72H

✅ **Mínimo aceptable:**
- Website build pasa sin errores
- P1_003 tiene ResearchPack.md completo
- P1_003 tiene PublishReady.md con copy multiplataforma

✅ **Óptimo:**
- Todo lo anterior +
- Assets P1_003 generados (cover + 4-5 slides)
- QA validación 100/100
- Commit con archivos en repo

---

## COMANDOS CLAVE POR ACCIÓN

### A1 — Website Build
```powershell
cd "C:\Users\farid\Documents\Frecuencia Global\website"
npm run build
# Éxito: dist/ generado sin errores
```

### A3 — Crear ResearchPack
```powershell
# Leer base
Get-Content "03_Editorial/P1_003_Brief.md" -Raw

# Referencias
Get-Content "03_Editorial/P1_002_Research.md" -Raw | Select-Object -First 50

# Crear archivo
New-Item -ItemType File -Path "03_Editorial/P1_003_ResearchPack.md" -Force
```

### A4 — Assets
```powershell
# Verificar directorio
New-Item -ItemType Directory -Path "06_Assets/P1_003" -Force

# Crear manifiesto
@"
# ASSETS_MANIFEST P1_003

## Cover
- File: P1_003_cover_1200x630.png
- Status: PENDING
- Workflow: cover_generate_api.json

## Carrusel
- Files: P1_003_slide_{01..05}_1080x1080.png
- Status: PENDING
- Workflow: background_generate_api.json
"@ | Set-Content "06_Assets/P1_003/ASSETS_MANIFEST.md"
```

### A5 — PublishReady
```powershell
# Copiar template de P1_002
Get-Content "04_Produccion/P1_002_PublishReady.md" -Raw | Set-Content "04_Produccion/P1_003_PublishReady.md"
# Luego editar con contenido P1_003
```

### Cierre
```powershell
# Status
cd "C:\Users\farid\Documents\Frecuencia Global"
git status

# Commit
git add 03_Editorial/P1_003_ResearchPack.md 04_Produccion/P1_003_PublishReady.md 06_Assets/P1_003/
git commit -m "content: P1_003 research and publish package ready"

# Push (solo si A1-B3 completados)
git push origin main
```

---

## PRÓXIMO COMANDO INMEDIATO

```powershell
cd "C:\Users\farid\Documents\Frecuencia Global\website"
npm run build
```

**Razón:** Validar que el stack de producción (website) está operativo antes de invertir tiempo en contenido.

---

*Plan generado: 2026-04-25 — Para ejecución inmediata*
