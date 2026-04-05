# Paths Clave - Frecuencia Global

## Paths Absolutos (Windows)

```
c:\Users\farid\Documents\Frecuencia Global\
├── system\
│   ├── SISTEMA_MAESTRO.md
│   ├── FUENTE_DE_VERDAD_Y_CONTRATO.md
│   ├── agents\
│   ├── gemini\
│   │   ├── prompts\
│   │   ├── workflows\
│   │   ├── references\
│   │   ├── outputs\
│   │   └── qa\
│   ├── playbooks\
│   ├── templates\
│   ├── rules\
│   ├── workflows\
│   └── roadmap\
├── 01_Estrategia\
├── 02_Brand_System\
│   └── FG_Brand_Kit_Operativo.md
├── 03_Editorial\
│   ├── P1_001_Brief.md
│   ├── P1_001_Script.md
│   └── P1_001_Research.md
├── 04_Produccion\
│   ├── pipeline_tracker.json
│   └── FG_Flujo_Produccion_Video.md
├── 05_Monetizacion\
├── 06_Assets\
│   ├── P1_001\
│   │   ├── P1_001_IG_1080x1350.png
│   │   └── P1_001_TK_1080x1920.png
│   └── base\
├── 07_Operaciones\
│   ├── FG_Operations_Log.md
│   └── PATCH_NOTES_2026-04-04_1924.md
├── 08_n8n\
│   ├── workflows_cloud\
│   │   ├── WF-001_intake_ideas.json
│   │   ├── WF-002_registro_brief.json
│   │   ├── WF-003_qa_checklist.json
│   │   ├── WF-004_notificacion_log.json
│   │   ├── WF-005_pipeline_status.json
│   │   ├── WF-006_preparar_publicacion.json
│   │   ├── WF-007_publicar_x.json
│   │   ├── WF-008_publicar_instagram.json
│   │   ├── WF-009_publicar_linkedin.json
│   │   └── WF-010_publicar_tiktok.json
│   ├── templates\
│   │   ├── brief_template.md
│   │   └── qa_template.md
│   └── docs\
├── scripts\
│   ├── x_publish_post.py
│   ├── linkedin_publish_post.py
│   ├── ig_publish_post.py
│   ├── threads_publish_post.py
│   ├── tiktok_publish_post.py
│   └── gemini_generate_image.py
├── website\
│   ├── src\
│   ├── astro.config.mjs
│   └── vercel.json
├── static\
├── .chrome-x-stable\
├── .chrome-linkedin-stable\
├── .chrome-ig-stable\
├── .chrome-tiktok-stable\
└── README.md
```

## Paths Relativos (para uso en scripts y prompts)

```
./
├── system/SISTEMA_MAESTRO.md
├── system/FUENTE_DE_VERDAD_Y_CONTRATO.md
├── system/agents/
├── system/gemini/prompts/
├── system/gemini/workflows/
├── system/playbooks/
├── system/templates/
├── system/rules/
├── 02_Brand_System/FG_Brand_Kit_Operativo.md
├── 03_Editorial/P1_001_Brief.md
├── 04_Produccion/pipeline_tracker.json
├── 07_Operaciones/FG_Operations_Log.md
├── 07_Operaciones/PATCH_NOTES_*.md
├── 08_n8n/workflows_cloud/WF-*.json
├── 08_n8n/templates/
├── scripts/x_publish_post.py
├── scripts/linkedin_publish_post.py
├── scripts/ig_publish_post.py
├── scripts/threads_publish_post.py
├── scripts/tiktok_publish_post.py
├── scripts/gemini_generate_image.py
└── website/
```

## Paths de Sesiones Chrome (Browser Automation)

```
.chrome-x-stable/          # Sesión X/Twitter
.chrome-linkedin-stable/   # Sesión LinkedIn
.chrome-ig-stable/          # Sesión Instagram
.chrome-tiktok-stable/      # Sesión TikTok
.chrome-gemini-stable/      # Sesión Gemini
```

## Paths de Assets

```
06_Assets/
├── P1_001/                # Assets de primera pieza
├── base/                  # Assets base (isotipo, etc.)
├── v1-v6/                 # Iteraciones anteriores
└── podcast/               # Assets de podcast
```

## Paths de Documentación Clave

```
README.md                              # Overview del proyecto
system/SISTEMA_MAESTRO.md              # Documento central
system/FUENTE_DE_VERDAD_Y_CONTRATO.md  # Contrato de datos
02_Brand_System/FG_Brand_Kit_Operativo.md # Sistema visual
07_Operaciones/PATCH_NOTES_*.md        # Estado actual
```

## Paths para Poe Reference

Cuando trabajes en Poe, referencia estos paths para contexto:

- **Visión del sistema:** `system/SISTEMA_MAESTRO.md`
- **Contrato de datos:** `system/FUENTE_DE_VERDAD_Y_CONTRATO.md`
- **Sistema visual:** `02_Brand_System/FG_Brand_Kit_Operativo.md`
- **Estado actual:** `07_Operaciones/PATCH_NOTES_2026-04-04_1924.md`
- **Templates:** `system/templates/`
- **Scripts de publicación:** `scripts/*.py`
- **Workflows n8n:** `08_n8n/workflows_cloud/`
- **Briefs editoriales:** `03_Editorial/`
- **Pipeline tracker:** `04_Produccion/pipeline_tracker.json`
- **Log operativo:** `07_Operaciones/FG_Operations_Log.md`

---

*Última actualización: 2026-04-04*
