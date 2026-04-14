# Matriz de estado de piezas (operativa)

- **Corte:** 2026-04-14
- **Jerarquía:** Complementa [`07_Operaciones/SANDBOX_CONTENT_INDEX.md`](../07_Operaciones/SANDBOX_CONTENT_INDEX.md) para clasificación. **No** sustituye `PublishReady` ni el tracker Swarm.
- **Leyenda columnas:** ✓ = presente en repo · — = no aplica / no hay evidencia · pend = pendiente · Cola humana vacía a 2026-04-13 (autorización operador).

---

## Piezas con PublishReady o brief en `03_Editorial/`

| ID pieza | Formato | Pilar | Research | Copy / script | Asset visual | QA | Publish-ready | Estado frente | Cola humana |
|----------|---------|-------|----------|---------------|--------------|-----|---------------|---------------|-------------|
| P1_001 | Carrusel | Geopolitik Drop | ✓ [`P1_001_Research.md`](../03_Editorial/P1_001_Research.md) | ✓ [`P1_001_PublishReady.md`](P1_001_PublishReady.md) | ✓ (carrusel) | pend | **PUBLISHED_MULTI** | Publicado sandbox: X, Threads (2026-04-05), IG, FB (2026-04-11). No oficial. | — |
| P1_002 | Post + cover | Geopolitik Drop | ✓ [`P1_002_Research.md`](../03_Editorial/P1_002_Research.md) | ✓ [`P1_002_PublishReady.md`](P1_002_PublishReady.md) | ✓ (3 img) [`ASSETS_MANIFEST`](../06_Assets/P1_002/ASSETS_MANIFEST.md) | ✓ validate_publishready 100/100 | **COMPLETED** | Cerrado 2026-04-13. Publicado: Threads, IG, FB, LinkedIn. Sin incidencias. | — |
| EP_001 | Podcast / video | Frecuencia Global (show notes) | ✓ briefs | ✓ [`EP_001_PublishReady.md`](EP_001_PublishReady.md) | ✓ manifiestos | pend | PUBLISH_READY | POC congelado (`SANDBOX_FROZEN`) — [`SANDBOX_TO_OFFICIAL_POLICY_DERIVED.md`](../07_Operaciones/SANDBOX_TO_OFFICIAL_POLICY_DERIVED.md) §2.2 | — |
| EP_002 | Podcast / video | Frecuencia Global (notas en PR) | ✓ [`EP_002_Brief.md`](../03_Editorial/EP_002_Brief.md) | ✓ [`EP_002_PublishReady.md`](EP_002_PublishReady.md) | ✓ (repo) | pend | PUBLISH_READY | POC congelado (`SANDBOX_FROZEN`) — política derivada §2.2 | — |
| FG_001 | Carrusel + video FB | Narrativa (minerales críticos) | — | ✓ [`FG_001_PublishReady.md`](FG_001_PublishReady.md) | ✓ sandbox | pend | SANDBOX_EDITORIAL_DRAFT | Sandbox editorial — [`SANDBOX_CONTENT_INDEX.md`](../07_Operaciones/SANDBOX_CONTENT_INDEX.md); política derivada §2.3 | — |
| P1_003 | — | Geopolitik Drop (brief) | — | ✓ [`P1_003_Brief.md`](../03_Editorial/P1_003_Brief.md) | — | — | — | **Pipeline siguiente** — orden mecánico antes que P1_004 | — |
| P1_004 | — | Geopolitik Drop (brief) | — | ✓ [`P1_004_Brief.md`](../03_Editorial/P1_004_Brief.md) | — | — | — | En cola tras P1_003 (mismo bucket brief; ver `HUMAN_ACTION_QUEUE` HA-006 cerrado) | — |

---

## Piloto Swarm (tracker `swarm_mvp_tracker.json`)

| ID tracker | Formato (plan) | Pilar | Research | Copy / script | Asset visual | QA | Publish-ready | Notas |
|------------|----------------|-------|----------|---------------|--------------|-----|---------------|--------|
| **MVP_01** | Carrusel 5 slides | Geopolitik Drop | ✓ [`MVP_01_ResearchPack.md`](../03_Editorial/MVP_01_ResearchPack.md) | ✓ [`MVP_01_Script.md`](MVP_01_Script.md) | ✓ (5 PNG) `06_Assets/MVP_01/` | ✓ QA aprobada | **PUBLICADO** 2026-04-13 | [`MVP_01_PublishReady.md`](MVP_01_PublishReady.md) — registro § Publicación ejecutada | — |
| **MVP_02** | Cápsula (plan) | Geopolitik Drop | ✓ [`MVP_02_ResearchPack.md`](../03_Editorial/MVP_02_ResearchPack.md) · ✓ [`MVP_02_Claim_Ledger.md`](../03_Editorial/MVP_02_Claim_Ledger.md) · ✓ [`MVP_02_Evidence_Pack.md`](../03_Editorial/MVP_02_Evidence_Pack.md) | ✓ [`MVP_02_Script.md`](MVP_02_Script.md) | ✓ 5 PNG [`ASSETS_MANIFEST`](../06_Assets/MVP_02/ASSETS_MANIFEST.md) | ✓ QA assets | **PUBLICADO** 2026-04-13 | [`MVP_02_PublishReady.md`](MVP_02_PublishReady.md) — Threads/IG/FB/LinkedIn | — |
| **MVP_03** | Hilo/brief (curation) | Geopolitik Drop | ✓ [`MVP_03_ResearchPack.md`](../03_Editorial/MVP_03_ResearchPack.md) · ✓ [`MVP_03_Claim_Ledger.md`](../03_Editorial/MVP_03_Claim_Ledger.md) · ✓ [`MVP_03_Evidence_Pack.md`](../03_Editorial/MVP_03_Evidence_Pack.md) | ✓ [`MVP_03_Script.md`](MVP_03_Script.md) | ✓ 5 PNG [`ASSETS_MANIFEST`](../06_Assets/MVP_03/ASSETS_MANIFEST.md) | ✓ QA assets | **PUBLICADO** 2026-04-14 | [`MVP_03_PublishReady.md`](MVP_03_PublishReady.md) — Threads/IG/FB/LinkedIn; log `FG_PUBLISH_LOG.md` | — |
| MVP_04 … MVP_10 | Ver [`SWARM_MVP_PILOTO_2_SEMANAS.md`](SWARM_MVP_PILOTO_2_SEMANAS.md) §6 | Asignado en JSON (`pilar`) | — | — | — | — | IDEA | Ejecución según gates — [`SWARM_EXECUTION_BACKLOG.md`](SWARM_EXECUTION_BACKLOG.md) |

---

## Piezas TEST_* (solo infraestructura)

Las piezas `TEST_*` y `TEST_ECO_001` son **SANDBOX_INFRA**; no entran en matriz editorial de producto. Detalle: [`SANDBOX_CONTENT_INDEX.md`](../07_Operaciones/SANDBOX_CONTENT_INDEX.md).

---

*Última actualización: 2026-04-14 — CAPA 4 activa. MVP_01–03 PUBLISHED (MVP_03 2026-04-14 API).*
