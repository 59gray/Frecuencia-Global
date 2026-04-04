# Fuente de Verdad y Contrato de Datos — Frecuencia Global

**Versión:** 1.0  
**Fecha:** 2026-04-03  
**Estado:** Activo

---

## 1. Fuente de Verdad Operativa

### Definición
La **fuente de verdad operativa** del sistema es el **repositorio GitHub** que actúa como datastore de archivos (Markdown + JSON). n8n Cloud lee y escribe en este repositorio vía GitHub REST API.

### Artefactos obligatorios en el repo (rama `main`)

| Archivo | Propósito | Formato |
|---------|-----------|---------|
| `04_Produccion/pipeline_tracker.json` | Estado de todas las piezas del pipeline | JSON |
| `07_Operaciones/FG_Operations_Log.md` | Log de eventos operativos | Markdown (tabla) |
| `08_n8n/templates/brief_template.md` | Template para generación de briefs | Markdown |
| `08_n8n/templates/qa_template.md` | Template para generación de QA | Markdown |
| `03_Editorial/` | Briefs, scripts y documentos editoriales | Markdown |
| `04_Produccion/` | PublishReady, QA, logs de producción | Markdown |

### Persistencia de n8n
- **n8n Cloud:** No tiene filesystem persistente. Usa GitHub API como "filesystem".
- **n8n Local (Docker):** SQLite en volumen `n8n_data`. **Descontinuado como producción** (solo para dev local).

---

## 2. Contrato de Datos

### 2.1 pipeline_tracker.json — Schema

```json
{
  "PIEZA_ID": {
    "tipo": "video | podcast | carousel | short",
    "historial": [
      {
        "estado": "ESTADO_VALIDO",
        "timestamp": "ISO8601",
        "nota": "string (opcional)"
      }
    ],
    "estado_actual": "ESTADO_VALIDO",
    "ultima_actualizacion": "ISO8601",
    "salidas": ["rss", "web", "youtube", "instagram", "tiktok", "x", "linkedin"]
  }
}
```

### Estados válidos (enum)

| Estado | Descripción | Siguiente posible |
|--------|-------------|-------------------|
| `BRIEF_READY` | Brief creado, pendiente de research | `RESEARCH_DONE` |
| `RESEARCH_DONE` | Investigación completada | `SCRIPT_DONE` |
| `SCRIPT_DONE` | Guión/copy listo | `DESIGN_DONE` |
| `DESIGN_DONE` | Diseño completado | `QA_PENDING` |
| `QA_PENDING` | En revisión de calidad | `QA_APPROVED`, `QA_REJECTED` |
| `QA_APPROVED` | Aprobado para publicación | `PUBLISH_READY` |
| `QA_REJECTED` | Rechazado, requiere corrección | `DESIGN_DONE` |
| `PUBLISH_READY` | Listo para publicar | `PUBLISHED` |
| `PUBLISHED` | Publicado en al menos una plataforma | — |

### 2.2 FG_Operations_Log.md — Contrato de eventos

#### Columnas obligatorias

| Columna | Tipo | Obligatorio | Descripción |
|---------|------|-------------|-------------|
| Fecha | `YYYY-MM-DD` | ✅ | Fecha del evento |
| Hora | `HH:MM` | ✅ | Hora del evento (24h) |
| Evento | string | ✅ | Tipo de evento (ver catálogo) |
| Pieza | ID o `—` | ✅ | ID de pieza afectada o `—` si es global |
| Detalles | string | ✅ | Descripción accionable del evento |

#### Eventos válidos

| Evento | Cuándo registrarlo | Detalles requeridos |
|--------|-------------------|---------------------|
| `BRIEF_CREADO` | WF-001 genera un brief | ID de pieza, título |
| `ESTADO_ACTUALIZADO` | WF-002 cambia estado | ID de pieza, estado anterior → nuevo |
| `QA_GENERADO` | WF-003 crea checklist | ID de pieza |
| `PUBLISH_READY` | WF-006 prepara publicación | ID de pieza, plataformas destino |
| `PUBLICACION_EXITOSA` | WF-007/008/009/010 publica | ID de pieza, plataforma, URL |
| `ERROR` | Cualquier fallo en workflow | Workflow ID, mensaje de error |
| `SMOKE_TEST` | Verificación de core | Workflows verificados, resultado |

---

## 3. Responsabilidades

| Componente | Responsabilidad |
|------------|-----------------|
| **GitHub Repo** | Single source of truth para archivos de contenido y estado |
| **n8n Cloud** | Motor de automatización que lee/escribe en GitHub |
| **SUB-001** | Escribir archivos Markdown en GitHub |
| **SUB-002** | Leer archivos Markdown desde GitHub |
| **SUB-004** | Registrar eventos en FG_Operations_Log.md |

---

## 4. Reglas de integridad

1. **Ningún workflow puede asumir que un archivo existe** — debe verificar antes de leer.
2. **Todo evento debe registrarse con detalles completos** — no se permiten campos vacíos.
3. **Las transiciones de estado deben ser válidas** — respetar el enum de estados.
4. **Los timestamps deben ser ISO8601** — formato consistente para ordenamiento.
5. **El tracker es append-only** — el historial nunca se borra, solo se agregan entradas.

---

## 5. Migración futura (Power Platform/Dataverse)

Si se migra a Dataverse, las tablas equivalentes serían:

| Archivo actual | Tabla Dataverse |
|----------------|-----------------|
| `pipeline_tracker.json` | `fg_piezas`, `fg_historial_estados` |
| `FG_Operations_Log.md` | `fg_eventos_operativos` |
| Briefs en `03_Editorial/` | `fg_briefs` (adjuntos o campos de texto) |

Esta migración está documentada en `90_Copilot_Studio_Integration/`.

---

*Este documento define el contrato operativo del datastore. Cualquier cambio debe actualizarse aquí primero.*
