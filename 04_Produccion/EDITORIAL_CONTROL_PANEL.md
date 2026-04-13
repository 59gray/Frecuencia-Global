# Frecuencia Global — Panel de control editorial / producto

- **Corte:** 2026-04-13  
- **Alcance:** línea editorial, piloto Swarm, piezas y plantillas. **No** incluye credenciales, lifecycle de plataformas ni deploy (ver [`07_Operaciones/PROJECT_CONTROL_TOWER.md`](../07_Operaciones/PROJECT_CONTROL_TOWER.md)).  
- **Jerarquía:** Pilares y modelo de negocio editorial en [`01_Estrategia/FG_Blueprint_Maestro.md`](../01_Estrategia/FG_Blueprint_Maestro.md); clasificación sandbox vs pruebas en [`07_Operaciones/SANDBOX_CONTENT_INDEX.md`](../07_Operaciones/SANDBOX_CONTENT_INDEX.md).  
- **Intervenciones humanas:** cola **vacía** a 2026-04-13; histórico de propuestas en [`HUMAN_REVIEW_PACK_2026-04-13.md`](HUMAN_REVIEW_PACK_2026-04-13.md). Fase pruebas / pre-inicio oficial: delegación de decisiones operativas razonables al agente según instrucción del operador.

---

## 0. Estado operativo del frente (2026-04-13)

| Área | Estado |
|------|--------|
| Piloto Swarm (ejecución de temas) | **EN EJECUCIÓN** — MVP_01 avanzado a BRIEF_READY (Día 1); tracker en [`swarm_mvp_tracker.json`](swarm_mvp_tracker.json) |
| P1_002 | **COMPLETED** — publicado y cerrado 2026-04-13; sin incidencias post-publicación |
| Política SANDBOX → oficial | **ADOPTADA** — [`07_Operaciones/SANDBOX_TO_OFFICIAL_POLICY_DERIVED.md`](../07_Operaciones/SANDBOX_TO_OFFICIAL_POLICY_DERIVED.md) (EDIT-002 cerrado) |
| EP_001 / EP_002 (POC) | **Default documental** — `SANDBOX_FROZEN`; conformidad operador 2026-04-13 |
| FG_001 (sandbox) | **Default documental** — sandbox editorial; conformidad operador 2026-04-13 |
| P1_003 / P1_004 | **Orden pipeline** — P1_003 → P1_004 (HA-006 cerrado por IA) |
| **Gobernable sin bloqueo humano** | Plantillas, [`PIPELINE_GUIDE.md`](PIPELINE_GUIDE.md), [`BRIEF_TO_PUBLISHREADY_CHECKLIST.md`](BRIEF_TO_PUBLISHREADY_CHECKLIST.md), validación `validate_publishready.py` |

---

## 1. Resumen ejecutivo

El frente editorial opera en **dos capas**: (a) **piloto Swarm MVP** — tracker **READY_TO_RUN** con temas asignados por evidencia de piezas existentes; (b) **piezas documentadas** (P1, EP, FG) con **defaults sandbox** consolidados en política derivada **adoptada**. La promoción a línea **oficial** sigue el criterio conjunto §2.4 del anexo cuando el proyecto declare inicio oficial fuera de sandbox.

---

## 2. Pilares vigentes y función

| ID | Pilar | Función editorial | Referencia |
|----|-------|-------------------|------------|
| P1 | **Geopolitik Drop** | Conflictos y tendencias globales, narrativa visual fuerte | Blueprint §2 |
| P2 | **Bass & Borders** | Música electrónica × fronteras políticas/culturales | Blueprint §2 |
| P3 | **Frecuencia Global** | Noticias globales en formato rápido | Blueprint §2 |
| P4 | **Behind the Policy** | Contenido profundo para audiencias profesionales | Blueprint §2 |

---

## 3. Flujo editorial mínimo (idea → publish-ready)

1. **Idea** — IdeaCard + score EDM ([`system/editorial/EDM_RELEVANCE_SCORE.md`](../system/editorial/EDM_RELEVANCE_SCORE.md)); plantilla [`03_Editorial/_specs/TPL_IdeaCard.md`](../03_Editorial/_specs/TPL_IdeaCard.md).  
2. **Research** — ResearchPack / briefs en `03_Editorial/`; plantillas `_specs/TPL_*`.  
3. **Guion / copy** — `03_Editorial/*_Script.md` o pipeline según pieza.  
4. **Asset** — `06_Assets/` por pieza; VisualBrief / DistSpec en `_specs`.  
5. **QA** — gates en [`SWARM_MVP_PILOTO_2_SEMANAS.md`](SWARM_MVP_PILOTO_2_SEMANAS.md) §5; informe `TPL_QA_Gate_Report.md`.  
6. **Publish-ready** — `04_Produccion/[ID]_PublishReady.md` usando [`PUBLISHREADY_TEMPLATE.md`](PUBLISHREADY_TEMPLATE.md); validación [`PIPELINE_GUIDE.md`](PIPELINE_GUIDE.md).

**Publicación en plataformas** es un paso **posterior** y **no** vive en este panel.

---

## 4. Bloqueos editoriales reales (mapeados)

| Bloqueo | Evidencia | Resolución |
|---------|-----------|------------|
| **P1_002** | [`P1_002_PublishReady.md`](P1_002_PublishReady.md): `COMPLETED` | Cerrado formalmente 2026-04-13; assets manifest creado |
| **Política sandbox→oficial** | EDIT-002 | Anexo adoptado 2026-04-13 |
| **EP / FG** | Índice sandbox | Conformidad operador 2026-04-13 |

---

## 5. Activos listos (reutilizables)

| Activo | Ubicación |
|--------|-----------|
| Piloto Swarm (SLA, gates, tabla) | [`SWARM_MVP_PILOTO_2_SEMANAS.md`](SWARM_MVP_PILOTO_2_SEMANAS.md) |
| Tracker + KPI | [`swarm_mvp_tracker.json`](swarm_mvp_tracker.json), [`SWARM_KPI_SCOREBOARD.md`](SWARM_KPI_SCOREBOARD.md), [`swarm_kpi_log.csv`](swarm_kpi_log.csv) |
| Plantillas Swarm | [`03_Editorial/_specs/TPL_IdeaCard.md`](../03_Editorial/_specs/TPL_IdeaCard.md), `TPL_EvidencePack.md`, `TPL_ClaimSheet.md`, `TPL_VisualBrief.md`, `TPL_DistSpec.md`, `TPL_QA_Gate_Report.md` |
| Pipeline general | [`PIPELINE_GUIDE.md`](PIPELINE_GUIDE.md) |
| Meta lanes (contenido) | [`system/editorial/META_LANE_STRATEGY.md`](../system/editorial/META_LANE_STRATEGY.md) |
| Taxonomía formatos | [`system/platforms/FORMAT_TAXONOMY.md`](../system/platforms/FORMAT_TAXONOMY.md) |

---

## 6. Documentos que gobiernan vs histórico

| Vigente para operar | Histórico / contexto |
|---------------------|----------------------|
| Este panel, [`SWARM_EXECUTION_BACKLOG.md`](SWARM_EXECUTION_BACKLOG.md), [`PIECE_STATUS_MATRIX.md`](PIECE_STATUS_MATRIX.md) | Informes preflight YT en `07_Operaciones/YOUTUBE_Preflight_*` (no gobiernan línea editorial) |
| `SANDBOX_CONTENT_INDEX` | Piezas duplicadas listadas dos veces en sandbox (p. ej. `TEST_IG_CAROUSEL_MIX_001`) — usar la fila más reciente como referencia |

---

## 7. Siguiente foco recomendado

1. **Ejecución Swarm:** MVP_01 en BRIEF_READY; avanzar gates Research + Claim/Evidence según SLA.  
2. **Nuevas piezas:** [`BRIEF_TO_PUBLISHREADY_CHECKLIST.md`](BRIEF_TO_PUBLISHREADY_CHECKLIST.md).  
3. **Matriz:** [`PIECE_STATUS_MATRIX.md`](PIECE_STATUS_MATRIX.md) — P1_002 COMPLETED.

---

*Última actualización: 2026-04-13 — P1_002 COMPLETED; Swarm MVP en ejecución (Día 1: MVP_01 BRIEF_READY); cola vacía.*
