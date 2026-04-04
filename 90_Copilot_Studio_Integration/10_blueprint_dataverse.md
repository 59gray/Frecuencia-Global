# Blueprint de Migración a Power Platform/Dataverse

**Proyecto:** Frecuencia Global  
**Fecha:** 2026-04-03  
**Estado:** Plan de migración

---

## 1. Arquitectura objetivo

```
┌─────────────────────────────────────────────────────────────┐
│                    COPILOT STUDIO                            │
│  (Agente conversacional + Knowledge base)                    │
│  - Consulta de briefs, scripts, guías                        │
│  - Soporte documental para producción                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    POWER AUTOMATE                            │
│  (Reemplazo de workflows n8n)                                │
│  - Intake de ideas → Brief                                   │
│  - Tracking de pipeline                                       │
│  - Generación de QA                                           │
│  - Notificaciones                                             │
│  - Publicación en redes (via connectors)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATAVERSE                                  │
│  (Base de datos relacional)                                  │
│  - Piezas y estados                                           │
│  - Historial de transiciones                                  │
│  - Eventos operativos                                         │
│  - Briefs y metadatos                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Mapeo de tablas Dataverse

### Tabla: `fg_piezas`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `fg_piezaid` | GUID | ID único |
| `fg_codigo` | Text (20) | ID legible (P1_001, EP_002) |
| `fg_titulo` | Text (200) | Título de la pieza |
| `fg_pilar` | Choice | GD, BB, FG, BP |
| `fg_formato` | Choice | video, podcast, carousel, short |
| `fg_estado_actual` | Choice | Estados del enum |
| `fg_tipo` | Choice | video, podcast, carousel, short |
| `fg_ultima_actualizacion` | DateTime | Timestamp ISO8601 |
| `fg_salidas` | MultiSelect | rss, web, youtube, instagram, tiktok, x, linkedin |

### Tabla: `fg_historial_estados`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `fg_historialid` | GUID | ID único |
| `fg_pieza` | Lookup (fg_piezas) | Referencia a pieza |
| `fg_estado` | Choice | Estado registrado |
| `fg_timestamp` | DateTime | Fecha/hora del cambio |
| `fg_nota` | Text (500) | Nota opcional |

### Tabla: `fg_eventos_operativos`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `fg_eventoid` | GUID | ID único |
| `fg_fecha` | Date | Fecha del evento |
| `fg_hora` | Text (10) | Hora del evento |
| `fg_tipo_evento` | Choice | BRIEF_CREADO, ESTADO_ACTUALIZADO, etc. |
| `fg_pieza` | Lookup (fg_piezas) | Referencia a pieza (opcional) |
| `fg_detalles` | Text (1000) | Descripción del evento |

### Tabla: `fg_briefs`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `fg_briefid` | GUID | ID único |
| `fg_pieza` | Lookup (fg_piezas) | Referencia a pieza |
| `fg_contenido` | Multiple Lines of Text | Contenido del brief |
| `fg_angulo` | Text (500) | Ángulo editorial |
| `fg_fecha_creacion` | DateTime | Fecha de creación |

---

## 3. Mapeo de workflows n8n → Power Automate

| n8n Workflow | Power Automate Flow | Trigger | Acciones principales |
|--------------|---------------------|---------|----------------------|
| WF-001 (Intake) | `FG - Intake de Ideas` | HTTP Request / Power Apps | Crear registro en `fg_piezas`, Crear brief en `fg_briefs` |
| WF-002 (Registro) | `FG - Actualizar Estado` | HTTP Request / Dataverse trigger | Actualizar `fg_estado_actual`, Crear registro en `fg_historial_estados` |
| WF-003 (QA) | `FG - Generar QA Checklist` | HTTP Request | Crear documento QA (SharePoint/OneDrive) |
| WF-004 (Log) | `FG - Registrar Evento` | Called from other flows | Crear registro en `fg_eventos_operativos` |
| WF-005 (Pipeline Status) | `FG - Resumen Diario` | Recurrence (9 AM) | Query `fg_piezas`, Send email/notification |
| WF-006 (Preparar Pub) | `FG - Preparar Publicación` | HTTP Request | Actualizar estado a PUBLISH_READY |
| WF-007 (X/Twitter) | `FG - Publicar en X` | HTTP Request / Dataverse | X connector (nativo) |
| WF-008 (Instagram) | `FG - Publicar en Instagram` | HTTP Request | Instagram connector (Business) |
| WF-009 (LinkedIn) | `FG - Publicar en LinkedIn` | HTTP Request | LinkedIn connector (nativo) |
| WF-010 (TikTok) | `FG - Publicar en TikTok` | HTTP Request | Custom connector / bridge |

---

## 4. Migración de datos

### Paso 1: Exportar datos actuales

```powershell
# Exportar pipeline_tracker.json a CSV para importar a Dataverse
# Script: scripts/export_tracker_to_csv.ps1
```

### Paso 2: Crear tablas en Dataverse

1. Crear solución `FrecuenciaGlobal` en Power Apps
2. Crear tablas según schema arriba
3. Configurar relaciones (Lookup)
4. Crear choices (Choice fields)

### Paso 3: Importar datos

1. Usar Power Apps -> Data -> Tables -> Import
2. Mapear campos del CSV a columnas Dataverse
3. Verificar integridad referencial

---

## 5. Migración de scripts

| Script actual | Alternativa Power Platform |
|---------------|---------------------------|
| `scripts/build_podcast_cover_art.py` | Power Automate + SharePoint + Python in Azure Functions |
| `scripts/build_tiktok_assets.py` | Power Automate + Azure Functions |
| `scripts/youtube_studio_*.py` | YouTube API connector + Power Automate |
| `scripts/configure_brandkit.js` | Power Automate + Canva API (si disponible) |

---

## 6. Conectores nativos disponibles

| Plataforma | Conector Power Automate | Notas |
|------------|------------------------|-------|
| X/Twitter | ✅ Twitter | Nativo, OAuth2 |
| LinkedIn | ✅ LinkedIn | Nativo, OAuth2 |
| Instagram | ⚠️ Instagram Business | Requiere cuenta Business |
| TikTok | ❌ No nativo | Custom connector o bridge |
| YouTube | ✅ YouTube | Nativo, OAuth2 |
| Telegram | ✅ Telegram | Custom connector disponible |
| GitHub | ✅ GitHub | Nativo, OAuth2/PAT |

---

## 7. Fases de migración

### Fase 1: Core operativo (2-3 semanas)

- [ ] Crear solución y tablas en Dataverse
- [ ] Migrar `pipeline_tracker.json` a Dataverse
- [ ] Crear flows para WF-001, WF-002, WF-003
- [ ] Configurar Copilot Studio con knowledge base

### Fase 2: Notificaciones y logging (1 semana)

- [ ] Migrar WF-004 (eventos operativos)
- [ ] Migrar WF-005 (resumen diario)
- [ ] Configurar alertas por email/Teams

### Fase 3: Publicación en redes (2-3 semanas)

- [ ] Configurar connectors X, LinkedIn, YouTube
- [ ] Crear bridges para Instagram/TikTok
- [ ] Migrar WF-007, WF-008, WF-009, WF-010

### Fase 4: Transición y cleanup (1 semana)

- [ ] Validar integridad de datos
- [ ] Desactivar workflows n8n
- [ ] Documentar nueva arquitectura
- [ ] Entrenar usuarios

---

## 8. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Límites de licencia Power Platform | Media | Alto | Verificar límites antes de migrar |
| Conectores no disponibles | Baja | Medio | Usar Azure Functions como bridge |
| Curva de aprendizaje | Alta | Medio | Documentar y entrenar |
| Pérdida de datos en migración | Baja | Alto | Backup completo antes de migrar |
| Costos de Dataverse | Media | Medio | Evaluar modelo de licenciamiento |

---

## 9. Prerrequisitos

- [ ] Licencia Power Platform (App Pass o similar)
- [ ] Acceso de administrador a entorno Dataverse
- [ ] Cuentas de plataforma configuradas (X, LinkedIn, YouTube)
- [ ] Aprobación de presupuesto para Azure Functions (si se requieren bridges)

---

## 10. Rollback plan

Si la migración falla:

1. Mantener n8n Cloud activo durante 30 días post-migración
2. Backup de `pipeline_tracker.json` y `FG_Operations_Log.md` antes de cada fase
3. Documentar rollback steps para cada componente

---

*Este blueprint es un plan de alto nivel. Requiere refinamiento técnico antes de ejecución.*
