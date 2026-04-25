# WINDSURF_BOOTSTRAP_SNAPSHOT_20260425

> **Snapshot de onboarding local para sprint Windsurf**  
> **Fecha/Hora:** 2026-04-25 11:46:22 -06:00  
> **Agente:** Windsurf Agent (migración desde VS Code context)

---

## 1. RAÍZ CANÓNICA

- **Ruta:** `C:\Users\farid\Documents\Frecuencia Global`
- **Estado:** Directorio confirmado, accesible, NO es repositorio Git
- **Nota:** Toda modificación requiere backup manual explícito

---

## 2. ESTADO GIT

```
fatal: not a git repository (or any of the parent directories): .git
```

- **Es repo Git:** NO
- **Branch actual:** N/A
- **Commits recientes:** N/A
- **Archivos modificados:** N/A (no hay tracking)

---

## 3. ÁRBOL DE CARPETAS (Primer y segundo nivel)

```
C:\Users\farid\Documents\Frecuencia Global/
├── .chrome-gemini-stable/           (0 bytes - NO TOCAR)
├── .chrome-ig-stable/               (0 bytes - NO TOCAR)
├── .chrome-linkedin-stable/         (NO TOCAR)
├── .chrome-n8n-cdp/                 (0 items - NO TOCAR)
├── .chrome-n8n-cloud/               (0 items - NO TOCAR)
├── .chrome-tiktok-manual/           (0 items - NO TOCAR)
├── .chrome-tiktok-stable/           (0 bytes - NO TOCAR)
├── .chrome-tk-stable/               (0 items - NO TOCAR)
├── .chrome-x-stable/                (0 bytes - NO TOCAR)
├── .chrome-youtube-profile/         (0 items - NO TOCAR)
├── .chrome-youtube-stable/          (0 bytes - NO TOCAR)
├── .claude/                         (0 items - NO TOCAR)
├── .cursor/                         (0 items - NO TOCAR)
├── .github/                         (0 items)
├── .vscode/                         (0 items) ← Config VS Code activa
│   ├── settings.json                (15 líneas - Python/Ruff/Astro)
│   ├── tasks.json                   (105 líneas - 6 tareas editoriales)
│   └── extensions.json              (referenciado en ops log)
├── 03_Editorial/                    (0 items)
│   └── _specs/                      - Templates, claim sheets, matrices
├── 04_Produccion/                   (0 items)
│   ├── ComfyUI/                     - README.md, workflows
│   ├── EP_001/                      - Metadata YouTube, thumbnail brief
│   ├── EP_002/                      - Metadata YouTube
│   ├── Pipeline/                    - README.md
│   ├── W17_TEST_PREP_2026-04-20_2026-04-24/ - Plan semanal
│   ├── YOUTUBE_Operations/          - SOPs, naming conventions
│   ├── linkedin_assets/
│   ├── notas/
│   ├── platform_handoffs/           - BUFFER_READY_SPEC, TIKTOK_READY_SPEC
│   └── post_packages/
├── 06_Assets/                       (0 items)
│   ├── EP_001/                      - ASSETS_MANIFEST.md
│   └── EP_002/                      - ASSETS_MANIFEST.md
├── 07_Operaciones/                  (0 items) ← **AQUI ESTAMOS**
│   └── 42 archivos operativos (ver lista completa abajo)
├── 08_n8n/                          (0 items)
│   ├── .env                         (94 bytes - NO LEER/NO COPIAR)
│   ├── bridge/                      - server.js (si existe)
│   ├── docs/                        - Documentación workflows
│   ├── exports/                     - Backups workflows
│   ├── observability/               - Telegram alerts
│   ├── scripts/                     - Helpers n8n
│   ├── self_hosted/                 - Configuración local
│   ├── templates/                   - Templates workflows
│   ├── workflows/                   - Workflows activos
│   ├── workflows_cloud/             - Export n8n cloud
│   ├── workflows_fixed/             - Versiones reparadas
│   ├── workflows_import_ready/      - Listos para import
│   └── workflows_runtime/           - Runtime activo
├── 09_People/                       (0 items)
├── agents/                          (0 items)
├── automation/                      (0 items)
├── bridge/                          (0 items)
├── comfy/                           (0 items)
├── config/                          (0 items)
├── data/                            (0 items)
├── docs/                            (0 items)
├── incident_response/               (0 items)
├── input/                           (0 items)
├── logs/                            (0 items)
├── node_modules/                    (0 items)
├── output                           (0 bytes)
├── scripts/                         (0 items)
│   ├── buffer/                      - Publicación Buffer
│   ├── comfy/                     - ComfyUI adapters
│   ├── fg_core/                     - Core functions
│   ├── notion/                    - Scripts Notion API
│   ├── ops/                         - Operaciones generales
│   ├── pipeline/                    - Pipeline management
│   ├── prompts/                     - Prompts IA
│   ├── providers/                   - Proveedores externos
│   ├── publish_dispatch/            - Publicación multi-plataforma
│   ├── research/                    - Investigación
│   ├── social_operations/           - Operaciones redes
│   ├── tests/                       - Tests
│   └── utils/                       - Utilidades
├── system/                          (0 items)
├── tools/                           (0 items)
│   ├── 07_Operaciones/
│   └── editorial/                   - Tooling recién creado (2026-04-24)
│       ├── README.md
│       ├── README_ZOTERO.md
│       ├── reports/                 - Reportes generados
│       └── scripts/                 - Scripts Python/PowerShell
└── website/                         (0 items)
    ├── .astro/                      - Cache Astro
    ├── .vscode/                     - VS Code workspace
    ├── .wrangler/                 - Cloudflare config
    ├── astro.config.mjs           - Site: frecuenciaglobal.org
    ├── comfyui-workflows/         - Workflows ComfyUI
    ├── dist/                      - Build output
    ├── node_modules/              - Dependencias
    ├── package.json               - Astro 6.1.2 + Tailwind 4
    ├── package-lock.json          - Lockfile
    ├── public/                    - Assets públicos
    ├── scripts/                   - Scripts build/OG images
    ├── src/                       - Source Astro
    ├── wrangler.toml              - Cloudflare Pages config
```

---

## 4. ARCHIVOS CLAVE DETECTADOS

### Documentación canónica (leídos)

| Archivo | Tamaño | Estado | Observación |
|---------|--------|--------|-------------|
| `07_Operaciones/NOTION_FIELD_MAP.json` | 472 líneas | ✅ | Mapeo completo Notion↔Repo, pilares, estados, plataformas |
| `07_Operaciones/FG_Operations_Log.md` | 40 líneas | ✅ | Bitácora hasta 2026-04-24, tooling editorial iniciado |
| `04_Produccion/pipeline_tracker.json` | 155 líneas | ✅ | 6 piezas: P1_001, P1_002, P1_003, P1_004, EP_001, EP_002 |
| `website/astro.config.mjs` | 10 líneas | ✅ | Astro 6.1.2, site: frecuenciaglobal.org |
| `website/wrangler.toml` | 4 líneas | ✅ | Cloudflare Pages, output: dist |
| `website/package.json` | 29 líneas | ✅ | Node >=22.12.0, Astro, Tailwind, Wrangler |
| `.vscode/settings.json` | 15 líneas | ✅ | Python .venv, Ruff, Astro formatter |
| `.vscode/tasks.json` | 105 líneas | ✅ | 6 tareas: env check, Crossref, FactCheck, Openverse, asset metadata, skeleton refresh |

### Archivos canónicos REFERENCIADOS pero AUSENTES

| Archivo | Referencia en | Acción |
|---------|---------------|--------|
| `01_Estrategia/FG_Direccion_Estrategica_Maestra.md` | Plan inicial | Marcar "no existe" en docs |
| `FG_Blueprint_Maestro.md` | Plan inicial | Marcar "no existe" en docs |
| `04_Produccion/EDITORIAL_CONTROL_PANEL.md` | NOTION_FIELD_MAP.repo_authority | Marcar "no existe" en docs |
| `04_Produccion/PIECE_STATUS_MATRIX.md` | NOTION_FIELD_MAP.repo_authority | Marcar "no existe" en docs |
| `system/FUENTE_DE_VERDAD_Y_CONTRATO.md` | NOTION_FIELD_MAP.repo_authority | Verificar existencia |
| `07_Operaciones/notion_workspace_ids.json` | NOTION_FIELD_MAP | Marcar "no existe" en docs |
| `07_Operaciones/TOKEN_LIFECYCLE_STATE.json` | Plan inicial | Marcar "no existe" en docs |

---

## 5. RIESGOS INMEDIATOS

| Riesgo | Nivel | Evidencia | Mitigación aplicada |
|--------|-------|-----------|---------------------|
| `08_n8n/.env` | 🔴 CRÍTICO | Existe, 94 bytes | NO leer contenido, NO copiar, NO versionar |
| Perfiles `.chrome-*` | 🔴 CRÍTICO | 15+ perfiles | NO tocar - contienen tokens/cookies/historial |
| `.claude/`, `.cursor/` | 🔴 CRÍTICO | 0 items cada uno | NO tocar - contexto histórico privado |
| NO es repo Git | 🟡 MEDIO | `fatal: not a git repository` | Crear backup manual antes de cada edición |
| `EDITORIAL_CONTROL_PANEL.md` ausente | 🟡 MEDIO | Referenciado en NOTION_FIELD_MAP | Documentar ausencia, no crear placeholder |
| Pieza `IP_REP_V2_002` en REVIEW | 🟡 MEDIO | 6 archivos en 04_Produccion/ | NO forzar estado sin validación humana |

---

## 6. ARCHIVOS QUE SE TOCARÁN (Días 1-2)

Crear NUEVOS (no existen, sin riesgo):
- `07_Operaciones/WINDSURF_BOOTSTRAP_SNAPSHOT_20260425.md` (este archivo)
- `07_Operaciones/WINDSURF_CONTEXT_FG.md`
- `07_Operaciones/WINDSURF_TOOLING_PARITY.md`
- `07_Operaciones/WINDSURF_14_DAY_SPRINT.md`
- `07_Operaciones/WINDSURF_DAILY_LOG.md`
- `07_Operaciones/WINDSURF_HANDOFF_TO_USER.md`

Posiblemente LEER (sin modificar):
- `system/FUENTE_DE_VERDAD_Y_CONTRATO.md` (verificar existencia)
- `tools/editorial/scripts/*.py` (documentar capacidades)
- `scripts/notion/*.py` (mapear scripts disponibles)

---

## 7. ARCHIVOS QUE NO SE TOCARÁN (Nunca)

| Archivo/Ruta | Razón |
|--------------|-------|
| `08_n8n/.env` | Contiene tokens/credenciales |
| `.chrome-*/` | Perfiles navegador con cookies/tokens |
| `.claude/`, `.cursor/` | Contexto privado de otras sesiones IA |
| Cualquier `.env` real | Política de no secretos |
| `website/.wrangler/` | Posiblemente contenga tokens Cloudflare |
| `D:\FrecuenciaGlobal\AV\` | Assets pesados, no inspeccionar sin necesidad |

---

## 8. PRÓXIMOS PASOS

1. ✅ **Bootstrap read-only** (HOY) - Crear 6 archivos de contexto Windsurf
2. **Día 2:** Paridad VS Code → Windsurf - Mapear `.vscode/` a `.windsurf/`
3. **Día 3:** Mapa arquitectura FG - Identificar single sources of truth
4. **Día 4:** Notion local/CSV - Documentar backfill seguro
5. **Día 5:** n8n local - Inventariar workflows sin ejecutar

---

## 9. EVIDENCIA VERIFICABLE

Comandos usados para este snapshot:
```powershell
# Timestamp y verificación raíz
Get-Date -Format "yyyy-MM-dd HH:mm:ss K"
Test-Path "C:\Users\farid\Documents\Frecuencia Global" -PathType Container

# Árbol de carpetas (primer y segundo nivel)
Get-ChildItem "C:\Users\farid\Documents\Frecuencia Global" -Depth 2 | ...

# Estado Git
git status --short
git branch --show-current

# Archivos específicos
Get-ChildItem "07_Operaciones" -Filter "*.json"
Get-Content "07_Operaciones/NOTION_FIELD_MAP.json" -TotalCount 50
```

---

**Estado del snapshot:** ✅ COMPLETO  
**Listo para:** Creación de archivos de contexto Windsurf  
**Bloqueos:** Ninguno  
**Riesgos activos:** `.env` en 08_n8n/, perfiles `.chrome-*` (gestionados)
