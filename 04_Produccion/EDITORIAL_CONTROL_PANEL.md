# Frecuencia Global — Panel de control editorial / producto

- **Corte:** 2026-04-14
- **Alcance:** línea editorial, piloto Swarm, piezas y plantillas. **No** incluye credenciales, lifecycle de plataformas ni deploy (ver [`07_Operaciones/PROJECT_CONTROL_TOWER.md`](../07_Operaciones/PROJECT_CONTROL_TOWER.md)).
- **Jerarquía:** Pilares y modelo de negocio editorial en [`01_Estrategia/FG_Blueprint_Maestro.md`](../01_Estrategia/FG_Blueprint_Maestro.md); clasificación sandbox vs pruebas en [`07_Operaciones/SANDBOX_CONTENT_INDEX.md`](../07_Operaciones/SANDBOX_CONTENT_INDEX.md).
- **Intervenciones humanas:** cola **vacía** a 2026-04-13; histórico de propuestas en [`HUMAN_REVIEW_PACK_2026-04-13.md`](HUMAN_REVIEW_PACK_2026-04-13.md). Fase pruebas / pre-inicio oficial: delegación de decisiones operativas razonables al agente según instrucción del operador.

---

## Capa 3 (operativa editorial Swarm) — **CAPA_3_CERRADA** (2026-04-14)

Cierre formal del **primer ciclo operativo** de Capa 3: pipeline documental + publicación API-first de prueba + checkpoint +24h, **sin** abrir Capa 4 ni publicar MVP_02 en este acto.

| Elemento | Estado / evidencia |
|----------|-------------------|
| **Stack operativo validado** | Orquestador [`scripts/fg_publish_orchestrator.py`](../scripts/fg_publish_orchestrator.py); Meta (IG/Threads/FB) + LinkedIn en corrida real; lifecycle y panel en [`07_Operaciones/API_CONTROL_PANEL.md`](../07_Operaciones/API_CONTROL_PANEL.md) |
| **MVP_01** | **PUBLICADO** — evidencias en [`MVP_01_PublishReady.md`](MVP_01_PublishReady.md); log [`07_Operaciones/FG_PUBLISH_LOG.md`](../07_Operaciones/FG_PUBLISH_LOG.md); tracker `PUBLISHED` en [`swarm_mvp_tracker.json`](swarm_mvp_tracker.json) |
| **Checkpoint +24h** | Registrado en [`MVP_01_DistSpec.md`](MVP_01_DistSpec.md) (PostMortemMetrics; alcance/guardados N/D por permisos insights API) |
| **MVP_02** | **PUBLISH_READY** — sin cambios en este cierre; cola explícita para siguiente turno |
| **Observaciones no bloqueantes** | Alt-text IG pendiente manual si se exige accesibilidad plena; métricas IG alcance/guardados vía Suite o scopes adicionales; **EP / FG_001 / X / TikTok** sin movimiento en este cierre (ver torre de control para plataformas) |

---

## Capa 4 (Horizonte Swarm MVP) — **EN CURSO** (2026-04-14)

> **STATUS:** EN CURSO | **SUBSTATUS:** SEMANA 1 CUMPLIDA | **CHECKPOINT:** ALCANZADO

Capa 4 del Sistema Operativo Circadiano. Horizonte: piloto Swarm MVP Semana 1–2 (2026-04-14 → 2026-04-24). **Semana 1 cumplida; la capa permanece activa.**

| Elemento | Estado / evidencia |
|----------|-------------------|
| **CAPA 3 cerrada** | Confirmado: MVP_01 PUBLISHED, P1_002 COMPLETED, checkpoint +24h, cola humana vacía |
| **MVP_02** | **PUBLISHED** 2026-04-13 (21:30 CST) — Threads ([18109273126865030](https://threads.net/@frecuenciaglobal/post/18109273126865030)) · IG ([DXGNgdsEYV-](https://www.instagram.com/p/DXGNgdsEYV-/)) · FB ([122105825480848603](https://facebook.com/986972071173928_122105825480848603)) · LinkedIn (urn:li:share:7449660359965097984). Log: `FG_PUBLISH_LOG.md` §21:30:33. |
| **MVP_03** | **PUBLISHED** 2026-04-14 (14:57–14:58 CST) — Threads ([18186882187374269](https://threads.net/@frecuenciaglobal/post/18186882187374269)) · IG ([DXIFW6HD5YG](https://www.instagram.com/p/DXIFW6HD5YG/)) · FB ([122106045938848603](https://facebook.com/986972071173928_122106045938848603)) · LinkedIn (corrida dedicada `linkedin_mvp_api`). Log: `FG_PUBLISH_LOG.md` §14:57:54 y §14:58:14. |
| **Cadencia Semana 1** | 3 publicaciones (MVP_01, MVP_02, MVP_03) completadas |
| **Plataformas** | 4 OK (Threads/IG/FB/LinkedIn); X/TikTok MISCONFIGURED — no tocar |
| **Notion** | Sincronizado repo→Notion (6 filas + 1 parche); espejo de visibilidad, no SoT |
| **Drift** | Reconciliado: `pipeline_tracker.json`, `SWARM_EXECUTION_BACKLOG.md`, `swarm_kpi_log.csv`, `PIECE_STATUS_MATRIX.md` |

**Regla del Swarm:** Si un topic no pasa de IDEA a BRIEF_READY en 48h, se salta al siguiente. El piloto valida la cadencia, no completa una lista.

> **Nota de control (2026-04-13):** Semana 1 cumplida. La capa permanece activa porque el horizonte Swarm MVP aún incluye el siguiente tramo operativo y el cierre de métricas del piloto. **No marcar CAPA_4_CERRADA.**

---

## 0. Estado operativo del frente (CAPA 4 activa)

| Área | Estado |
|------|--------|
| Piloto Swarm (ejecución de temas) | **CAPA 4 ACTIVA** — MVP_01–03 `PUBLISHED`; MVP_04+ IDEA; tracker `swarm_mvp_tracker.json` |
| P1_002 | **COMPLETED** — publicado y cerrado 2026-04-13; sin incidencias post-publicación |
| Política SANDBOX → oficial | **ADOPTADA** — [`07_Operaciones/SANDBOX_TO_OFFICIAL_POLICY_DERIVED.md`](../07_Operaciones/SANDBOX_TO_OFFICIAL_POLICY_DERIVED.md) (EDIT-002 cerrado) |
| EP_001 / EP_002 (POC) | **Default documental** — `SANDBOX_FROZEN`; sin cambios en cierre Capa 3 |
| FG_001 (sandbox) | **Default documental** — sandbox editorial; sin cambios en cierre Capa 3 |
| P1_003 / P1_004 | **Orden pipeline** — P1_003 → P1_004 (HA-006 cerrado por IA) |
| **Gobernable sin bloqueo humano** | Plantillas, [`PIPELINE_GUIDE.md`](PIPELINE_GUIDE.md), [`BRIEF_TO_PUBLISHREADY_CHECKLIST.md`](BRIEF_TO_PUBLISHREADY_CHECKLIST.md), validación `validate_publishready.py` |

---

## 1. Resumen ejecutivo

El frente editorial opera en **CAPA 4 (EN CURSO, Semana 1 cumplida)** del Sistema Operativo Circadiano: (a) **piloto Swarm MVP activo** — MVP_01–03 PUBLISHED (última corrida MVP_03 2026-04-14); (b) **piezas documentadas** (P1, EP, FG) con **defaults sandbox** consolidados en política derivada **adoptada**. Checkpoint alcanzado; la capa sigue abierta para el siguiente tramo.

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

1. **Publicar MVP_03:** gate humano pendiente → `MVP_03_PublishReady.md` + orquestador. Verificar OBS-002 (caption Threads) y OBS-003 (duplicados IG/FB) antes de ejecutar.
2. **Métricas MVP_01 +7d:** columna **+7d** en [`MVP_01_DistSpec.md`](MVP_01_DistSpec.md) (fecha objetivo: 2026-04-20).
3. **Métricas MVP_02 +7d:** columna **+7d** en [`MVP_02_DistSpec.md`](MVP_02_DistSpec.md) (fecha objetivo: 2026-04-20).
4. **Avanzar pipeline Semana 2:** MVP_04 IDEA → BRIEF_READY (SLA 48h, regla Swarm).
5. **Resolver OBS abiertos:** OBS-002 a OBS-006 en [`07_Operaciones/PENDING_FRONTS_BACKLOG.md`](../07_Operaciones/PENDING_FRONTS_BACKLOG.md) §D-bis.
6. **Matriz:** [`PIECE_STATUS_MATRIX.md`](PIECE_STATUS_MATRIX.md).

---

*Última actualización: 2026-04-14 — CAPA 3 cerrada; **CAPA 4 EN CURSO** (Semana 1 cumplida, checkpoint alcanzado). MVP_01 PUBLISHED; MVP_02 PUBLISHED; MVP_03 PUBLISH_READY. No marcar CAPA_4_CERRADA.*
