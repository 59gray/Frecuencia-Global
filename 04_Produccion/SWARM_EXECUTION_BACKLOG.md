# Swarm MVP — Backlog de ejecución

- **Piloto:** `FG_SWARM_MVP_2026_W16_W17` · **2026-04-13** → **2026-04-24** · `status` en JSON: **READY_TO_RUN** ([`swarm_mvp_tracker.json`](swarm_mvp_tracker.json)).  
- **Títulos y pilares:** Rellenados **2026-04-13** (sesión IA, trazabilidad en `metadata` del JSON); sin bloqueo por cola humana para temas vacíos.  
- **Fuente de tipos por día:** [`SWARM_MVP_PILOTO_2_SEMANAS.md`](SWARM_MVP_PILOTO_2_SEMANAS.md) §6.  
- **Jerarquía:** Subordinado a [`EDITORIAL_CONTROL_PANEL.md`](EDITORIAL_CONTROL_PANEL.md) y al plan piloto. **No** incluye publicación en redes.

---

## Tracker legible (sincronizar con JSON)

| Día | ID tracker | Tipo esperado (plan piloto) | Estado en JSON | Título (repo) |
|-----|------------|----------------------------|----------------|---------------|
| 1 | MVP_01 | Cápsula rápida | **RESEARCH_DONE** | Cápsula: cables submarinos y rutas de datos (Geopolitik Drop) |
| 2 | MVP_02 | Cápsula rápida | IDEA | Cápsula: foundry concentrado — el mapa TSMC (Geopolitik Drop) |
| 3 | MVP_03 | Hilo/brief | IDEA | Hilo/brief: tres lecturas sobre la cadena de semiconductores |
| 4 | MVP_04 | Explicador | IDEA | Explicador: qué es un foundry y por qué importa el 64% de TSMC |
| 5 | MVP_05 | Cápsula rápida | IDEA | Cápsula: noticia global en formato Frecuencia Global (pulso rápido) |
| 6 | MVP_06 | Análisis profundo | IDEA | Análisis profundo: narrativa de show y política pública (EP_002) |
| 7 | MVP_07 | Cápsula rápida | IDEA | Cápsula: minerales críticos y cadena (puente FG_001 sandbox) |
| 8 | MVP_08 | Explicador | IDEA | Explicador: Behind the Policy — marco de políticas y tecnología |
| 9 | MVP_09 | Hilo/brief | IDEA | Hilo/brief: Bass & Borders — cultura electrónica y fronteras |
| 10 | MVP_10 | Análisis profundo | IDEA | Análisis profundo: dossier — geopolítica del cableado y los chips |

---

## Tabla de backlog (operación)

| ID | Pieza / proyecto | Pilar | Estado tracker | Estado ejecución | Prioridad | Siguiente acción | Responsable sugerido | Criterio de cierre |
|----|------------------|-------|----------------|------------------|-----------|------------------|------------------------|-------------------|
| SW-01 | MVP Día 1 | P1 | **RESEARCH_DONE** | **EN CURSO** | P0 | Claim Ledger + Evidence Pack (SLA ≤90min) | F6 + F8 | Gate evidencia completa |
| SW-02 | MVP Día 2 | P1 | IDEA | **LISTO** | P0 | Research + claim | F1 + F5 | Gate EDM + research |
| SW-03 | MVP Día 3 | P1 | IDEA | **LISTO** | P1 | Hilo/brief | F5 + F6 | Claim + evidence |
| SW-04 | MVP Día 4 | P1 | IDEA | **LISTO** | P1 | Explicador | F6 + F7 | Script + visual brief |
| SW-05 | MVP Día 5 | P3 | IDEA | **LISTO** | P1 | Cápsula | F7 | QA PASS |
| SW-06 | MVP Día 6 | P3 | IDEA | **LISTO** | P1 | Análisis profundo | F6 + F7 | Gates completos |
| SW-07 | MVP Día 7 | P1 | IDEA | **LISTO** | P2 | Cápsula | F7 | QA PASS |
| SW-08 | MVP Día 8 | P4 | IDEA | **LISTO** | P2 | Explicador | F6 | Empaque |
| SW-09 | MVP Día 9 | P2 | IDEA | **LISTO** | P2 | Hilo/brief | F5 | Evidence pack |
| SW-10 | MVP Día 10 | P1 | IDEA | **LISTO** | P2 | Análisis profundo | F6 + F8 | Postmortem + KPI |

---

## Notas

- **Owners** en JSON: F1 orquestación, F5 línea editorial, F6 evidencia, F8 QA (ver `swarm_mvp_tracker.json` `owners`).  
- Cada fila **SW-0x** corresponde a **MVP_0x** en el tracker.  
- **Cambio de estado:** actualizar `topics[]` en `swarm_mvp_tracker.json` al avanzar gates; reflejar en [`PIECE_STATUS_MATRIX.md`](PIECE_STATUS_MATRIX.md) cuando exista pieza publicable con ID propio.

---

*Última actualización: 2026-04-13 — MVP_01 avanzado a RESEARCH_DONE (ResearchPack verificado: 14 fuentes, 3 incidentes, Azure confirmó latencia). P1_002 COMPLETED.*
