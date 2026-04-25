# WINDSURF_HANDOFF_TO_USER

> **Qué puede hacer Windsurf ahora vs. qué requiere tu acción**  
> **Actualizado:** 2026-04-25 (Día 1 del sprint)  
> **Versión:** 0.1 — Actualizarse diariamente

---

## ✅ QUÉ QUEDÓ LISTO (DÍA 1)

### Contexto operativo documentado
- ✅ Raíz del proyecto confirmada y mapeada
- ✅ Estructura real de carpetas documentada (diferente a la esperada inicialmente)
- ✅ Archivos canónicos leídos y resumidos:
  - Mapeo Noton completo (`NOTION_FIELD_MAP.json`)
  - Estado de piezas (`pipeline_tracker.json`: P1_001 a EP_002)
  - Configuración VS Code: (`settings.json`, `tasks.json`)
  - Stack web (Astro 6.1.2 + Cloudflare)
- ✅ Riesgos identificados y gestionados:
  - `.env` en `08_n8n/` marcado como NO TOCAR
  - Perfiles de navegador `.chrome-*` marcados como NO TOCAR
- ✅ 6 archivos de bootstrap creados en `07_Operaciones/`

---

## ✅ QUÉ PUEDE HACER WINDSURF AHORA

### Tareas operativas (sin credenciales)

| Tarea | Ejemplo de solicitud |
|-------|----------------------|
| **Documentación** | "Crear especificación para nueva pieza P1_005" |
| **Research local** | "Ejecutar búsqueda Crossref sobre 'techno Detroit' y guardar en reports/" |
| **Assets Creative Commons** | "Buscar imágenes CC-BY sobre 'migración Europa' en Openverse" |
| **QA documental** | "Verificar si hay conflictos entre pipeline_tracker.json y los archivos en 04_Produccion/" |
| **Preparar CSV** | "Generar CSV template para backfill de piezas en estado REVIEW" |
| **Build local** | "Ejecutar npm run build en website/ y reportar errores" |
| **Linting** | "Verificar formato de archivos Markdown en 07_Operaciones/" |
| **Resumen operativo** | "¿Cuál es el estado de todas las piezas según pipeline_tracker.json?" |

### Scripts de tooling editorial disponibles

Ubicación: `tools/editorial/scripts/`

| Script | Seguro ejecutar | Requiere API key |
|--------|-----------------|------------------|
| `fg_crossref_lookup.py` | ✅ Sí | ❌ No |
| `fg_openverse_search.py` | ✅ Sí | ❌ No (rate limited) |
| `fg_factcheck_search.py` | ⚠️ Consultar | ✅ `FG_FACTCHECK_API_KEY` |
| `fg_asset_metadata.ps1` | ✅ Sí | ❌ No |
| `fg_editorial_env_check.ps1` | ✅ Sí | ❌ No |

---

## ❌ QUÉ SIGUE BLOQUEADO (requiere tu acción)

| Capacidad | Bloqueo | Para desbloquear |
|-----------|---------|------------------|
| **n8n runtime** | Requiere `.env` con tokens | Iniciar n8n local manualmente con `docker-compose up` |
| **Publicar en redes** | Política de no automatización | Usar scripts de `scripts/publish_dispatch/` manualmente |
| **Notion live** | Requiere `NOTION_TOKEN` | Ejecutar scripts en `scripts/notion/` con tu token |
| **Deploy Cloudflare** | Requiere auth Wrangler | `wrangler deploy` desde tu máquina |
| **ComfyUI runtime** | Requiere GPU + dependencias | Iniciar ComfyUI local manualmente |
| **Git push** | No es repo Git | Inicializar repo si decides versionar |

---

## ⚠️ QUÉ REQUIERE VALIDACIÓN HUMANA

| Tipo de tarea | Razón |
|---------------|-------|
| **Cambiar estado de pieza a PUBLISHED** | Solo tú confirmas publicación |
| **Modificar pipeline_tracker.json** | Autoridad operativa humana |
| **Ejecutar script que escribe en 04_Produccion/** | Revisar cambios antes de commit |
| **Decisiones editoriales** | Juicio editorial humano |
| **Validación de fuentes** | Verificación humana de evidencia |

---

## 🛠️ COMANDOS RECOMENDADOS

### Verificar estado del proyecto
```powershell
cd "C:\Users\farid\Documents\Frecuencia Global"
Get-ChildItem 07_Operaciones\WINDSURF_*.md | Select-Object Name, LastWriteTime
```

### Ejecutar research (Crossref)
```powershell
cd "C:\Users\farid\Documents\Frecuencia Global"
.venv\Scripts\python tools\editorial\scripts\fg_crossref_lookup.py --query "techno Berlin" --rows 5 --out-md tools\editorial\reports\techno_berlin_$(Get-Date -Format 'yyyyMMdd').md
```

### Build web local
```powershell
cd "C:\Users\farid\Documents\Frecuencia Global\website"
npm install
npm run build
```

### Verificar entorno editorial
```powershell
cd "C:\Users\farid\Documents\Frecuencia Global"
powershell -File tools\editorial\scripts\fg_editorial_env_check.ps1
```

---

## 📋 CHECKLIST PARA TAREAS COMUNES

### "Quiero que Windsurf investigue un tema"
- [ ] Proporcionar query de búsqueda
- [ ] Especificar formato de salida (markdown, JSON)
- [ ] Indicar si necesitas fuentes académicas (Crossref) o generales
- [ ] Revisar resultado antes de usar en pieza

### "Quiero que Windsurf prepare una pieza nueva"
- [ ] Especificar Pilar (P1-P4)
- [ ] Proporcionar título propuesto
- [ ] Indicar plataformas objetivo
- [ ] Validar estructura generada antes de llenar contenido

### "Quiero que Windsurf revise consistencia"
- [ ] Especificar qué archivos comparar
- [ ] Indicar qué campo/propiedad verificar
- [ ] Revisar reporte de conflictos
- [ ] Tomar decisión de corrección

---

## 🎯 PRÓXIMOS ENTREGABLES (DÍAS 2-14)

| Día | Entregable | Valor para ti |
|-----|------------|---------------|
| 2 | `.windsurf/rules` + smoke test | Contexto automático al abrir proyecto |
| 3 | Mapa de arquitectura | Saber dónde buscar cada cosa |
| 4 | Guía CSV Notion | Poder exportar/importar sin romper nada |
| 5 | Inventario n8n | Saber qué workflows tienes |
| 6 | Guía website | Poder hacer preview local fácil |
| 7 | Mapa ComfyUI | Saber dónde están los workflows y outputs |
| 8 | 5 tareas editoriales | Lista de trabajo concreto listo |
| 9 | QA documental | Saber si tus docs tienen conflictos |
| 10 | Matriz de scripts | Saber qué scripts puedes correr seguro |
| 11 | Limpieza docs | Índice de qué documentos son actuales |
| 12 | 6 checklists | Procedimientos paso a paso |
| 13 | Handoff refinado | Este documento, pero completo |
| 14 | Resumen ejecutivo | Cierre formal del sprint |

---

## 🚨 COSAS QUE NO DEBES PEDIR A WINDSURF

❌ "Publica esto en Instagram" → Política: no publicación automática  
❌ "Conecta a Notion y actualiza" → Bloqueado: requiere token  
❌ "Haz deploy del website" → Bloqueado: requiere auth Cloudflare  
❌ "Ejecuta n8n" → Bloqueado: requiere `.env`  
❌ "Lee mi archivo .env" → Bloqueado: política de no secretos  

✅ Alternativa para todo lo anterior: Documentar el procedimiento para que **tú** lo ejecutes manualmente.

---

## 📞 CÓMO PEDIR AYUDA A WINDSURF

### Formato recomendado

```
"[Contexto] + [Tarea específica] + [Restricciones]"

Ejemplo:
"Necesito research para pieza P1_005 sobre migración tech workers a Portugal. 
Busca en Crossref fuentes académicas de 2020-2025. 
Guarda en tools/editorial/reports/P1_005_research_YYYYMMDD.md. 
NO ejecutes scripts que requieran API keys."
```

---

**Documento vivo:** Se actualiza diariamente durante el sprint  
**Autoridad:** `WINDSURF_DAILY_LOG.md` y archivos referenciados  
**Próxima actualización:** 2026-04-26 (Día 2)
