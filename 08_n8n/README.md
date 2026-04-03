# n8n — Frecuencia Global

Motor de orquestación del pipeline editorial. n8n automatiza la creación de briefs, tracking de piezas, generación de QA checklists, logging de operaciones y reportes diarios.

**n8n NO reemplaza agentes ni decisiones humanas.** Solo orquesta tareas repetitivas del filesystem.

---

## Requisitos

- **Docker Desktop** (Windows/Mac) o Docker CE (Linux)
- Puerto **5678** libre
- **Telegram Bot** (opcional, para notificaciones)

---

## Instalación

```bash
# 1. Copiar variables de entorno
cp .env.example .env

# 2. Editar .env con tus valores
#    - Credenciales de autenticación
#    - Token de Telegram (opcional)

# 3. Levantar n8n
cd 08_n8n
docker compose up -d

# 4. Abrir en navegador
# http://localhost:5678
```

---

## Primer uso

1. Abre `http://localhost:5678`
2. Inicia sesión con las credenciales del `.env`
3. **Importar workflows:**
   - Settings → Import from File
   - Importa cada JSON de `workflows/` y `workflows/sub/`
4. **Configurar Telegram** (opcional):
   - Habla con `@BotFather` en Telegram → `/newbot` → copia el token
   - Envía un mensaje al bot, luego visita `https://api.telegram.org/bot<TOKEN>/getUpdates` para obtener tu `chat_id`
   - Actualiza `.env` con `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`
5. **Activar workflows** que tengan trigger (WF-001, WF-002, WF-003, WF-005)

---

## Workflows disponibles

| ID | Nombre | Trigger | Descripción |
|----|--------|---------|-------------|
| WF-001 | Intake de Ideas | Webhook POST `/webhook/intake` | Genera brief desde template |
| WF-002 | Registro de Brief | Webhook POST `/webhook/register-brief` | Actualiza pipeline tracker |
| WF-003 | QA Checklist | Webhook POST `/webhook/qa` | Genera QA desde template |
| WF-004 | Notificación/Log | Sub-workflow | Registra evento en Operations Log |
| WF-005 | Pipeline Status | Cron 9AM | Resumen diario de pipeline |

### Sub-workflows

| ID | Nombre | Uso |
|----|--------|-----|
| SUB-001 | Escribir Markdown | Utilidad: escribe archivo .md |
| SUB-002 | Notificar Telegram | Envía mensaje a Telegram (graceful skip si no configurado) |
| SUB-003 | Template Filler | Lee template + reemplaza `{{VARIABLES}}` |
| SUB-004 | Registrar Evento | Append a Operations Log |

---

## Uso rápido

### Crear un brief nuevo
```bash
curl -X POST http://localhost:5678/webhook/intake \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "El impacto de los BRICS en el comercio global",
    "pilar": "GD",
    "angulo": "Análisis de las nuevas rutas comerciales",
    "formato": "carousel"
  }'
```

### Actualizar estado de una pieza
```bash
curl -X POST http://localhost:5678/webhook/register-brief \
  -H "Content-Type: application/json" \
  -d '{
    "pieza": "P1_002",
    "estado": "RESEARCH_DONE"
  }'
```

### Generar QA para una pieza
```bash
curl -X POST http://localhost:5678/webhook/qa \
  -H "Content-Type: application/json" \
  -d '{
    "pieza": "P1_001"
  }'
```

---

## Estructura de archivos

```
08_n8n/
├── docker-compose.yml      # Stack Docker
├── .env.example             # Template de variables
├── .env                     # Variables reales (NO commitear)
├── README.md                # Este archivo
├── export_workflows.sh      # Script de exportación
├── templates/
│   ├── brief_template.md    # Template para WF-001
│   └── qa_template.md       # Template para WF-003
├── workflows/
│   ├── WF-001_intake_ideas.json
│   ├── WF-002_registro_brief.json
│   ├── WF-003_qa_checklist.json
│   ├── WF-004_notificacion_log.json
│   ├── WF-005_pipeline_status.json
│   └── sub/
│       ├── SUB-001_escribir_markdown.json
│       ├── SUB-002_notificar_telegram.json
│       ├── SUB-003_template_filler.json
│       └── SUB-004_registrar_evento.json
└── docs/
    ├── WORKFLOWS.md          # Catálogo detallado
    └── TROUBLESHOOTING.md    # Errores comunes
```

---

## Cómo añadir un workflow nuevo

1. Créalo en la UI de n8n (`http://localhost:5678`)
2. Nómbralo con el patrón: `WF-NNN — Nombre` o `SUB-NNN — Nombre`
3. Etiquétalo con tags relevantes
4. Exporta: Settings → Download
5. Guarda el JSON en `workflows/` (o `workflows/sub/`)
6. Actualiza `docs/WORKFLOWS.md`
7. Commit a Git

---

## Cómo parar / reiniciar

```bash
# Parar
docker compose down

# Reiniciar
docker compose up -d

# Ver logs
docker compose logs -f

# Reset completo (borra datos de n8n, NO del workspace)
docker compose down -v
docker compose up -d
```

---

## Mantenimiento

- **Antes de cada commit:** exporta workflows modificados desde la UI a `workflows/`
- **Después de pull:** re-importa workflows si hay cambios en los JSON
- **Semanal:** revisa `07_Operaciones/FG_Operations_Log.md` para detectar anomalías
- **Ver errores:** consulta `docs/TROUBLESHOOTING.md`
