# Frecuencia Global — Checkpoint Automation Setup

**Fecha:** 2026-04-01  
**Versión:** 1.0  
**Autor:** Copilot  

---

## 1. ARQUITECTURA

```
┌──────────────────────────────────────────────────────────────┐
│                  WINDOWS TASK SCHEDULER                       │
│             (09:17 + 21:17 America/Monterrey)                │
│                         │                                     │
│                         ▼                                     │
│              scripts/run_checkpoint.bat                       │
│                         │                                     │
│                         ▼                                     │
│            scripts/generate_checkpoint.py                     │
│          ┌──────────┬──────────┬──────────┐                  │
│          ▼          ▼          ▼          ▼                   │
│     Markdown    STATE_      Log       Payload                │
│    Checkpoint   PROJECT   (diario)    (n8n)                  │
│          │      .json        │          │                     │
│          │         │         │          │                     │
│          ▼         ▼         ▼          ▼                     │
│   01_Estrategia/ system/  07_Oper/  system/                  │
│   FG_Check...    memory/  logs/     memory/                  │
│                                        │                     │
│                                        ▼ HTTP POST           │
│                                ┌──────────────┐              │
│                                │     n8n      │              │
│                                │   WF-008     │              │
│                                │  /checkpoint │              │
│                                │      │       │              │
│                                │      ▼       │              │
│                                │  Log + TG    │              │
│                                └──────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

**Task Scheduler** es el disparador maestro.  
**n8n** es capa opcional de registro, notificación y extensión.  
Si n8n no está corriendo, el checkpoint funciona igual — el payload queda en disco.

---

## 2. ARCHIVOS DEL SISTEMA

| Archivo | Propósito |
|---------|-----------|
| `scripts/generate_checkpoint.py` | Script principal — genera los 4 artefactos |
| `scripts/run_checkpoint.bat` | Wrapper BAT para Task Scheduler |
| `08_n8n/workflows/WF-006_Auto_Checkpoint.json` | Workflow n8n complementario (archivo requerido) |
| `08_n8n/workflows/WF-008_auto_checkpoint.json` | Compatibilidad con versión previa |
| `07_Operaciones/Checkpoint_Automation_Setup.md` | Este documento |
| `07_Operaciones/Checkpoint_Review_Protocol.md` | Protocolo de revisión con Maya |

### Artefactos generados por ejecución

| Artefacto | Ruta | Formato |
|-----------|------|---------|
| Checkpoint markdown | `01_Estrategia/FG_Checkpoint_AUTO_YYYY-MM-DD_HHMM.md` | Markdown |
| Estado persistente | `system/memory/STATE_PROJECT.json` | JSON |
| Log diario | `07_Operaciones/logs/checkpoint_log_YYYY-MM-DD.json` | JSON |
| Payload n8n | `system/memory/checkpoint_payload_latest.json` | JSON |
| Setup para chat (post-sesion) | `system/memory/checkpoints_chat_setup_latest.md` | Markdown |
| Log del runner | `07_Operaciones/logs/checkpoint_runner.log` | Texto plano |
| Log n8n (si activo) | `07_Operaciones/logs/n8n_checkpoint_log_YYYY-MM-DD.json` | JSON |

---

## 3. INSTALACIÓN

### 3.1 Prerrequisitos

- Python 3.10+ (ya en `.venv/`)
- Git instalado y en PATH
- Windows 10/11
- Docker Desktop (para n8n, opcional)

### 3.2 Verificar Python

```powershell
cd "C:\Users\farid\Documents\Frecuencia Global"
.\.venv\Scripts\Activate.ps1
python --version
# Debe ser 3.10+
```

El script usa **solo la biblioteca estándar** — no requiere `pip install`.

### 3.3 Probar manualmente

```powershell
# Desde el repo root con venv activo:
python scripts\generate_checkpoint.py

# Con lookback de 24 horas:
python scripts\generate_checkpoint.py --hours 24

# Sin intentar notificar a n8n:
python scripts\generate_checkpoint.py --no-n8n
```

### 3.4 Probar el BAT

```cmd
scripts\run_checkpoint.bat
```

Verificar el log en `07_Operaciones\logs\checkpoint_runner.log`.

---

## 4. TASK SCHEDULER — CONFIGURACIÓN

### 4.1 Crear las tareas (cmd)

```cmd
schtasks /Create /TN "FG_Checkpoint_0917" /TR "C:\Windows\System32\cmd.exe /c C:\Users\farid\DOCUME~1\FRECUE~1\scripts\run_checkpoint.bat" /SC DAILY /ST 09:17 /F

schtasks /Create /TN "FG_Checkpoint_2117" /TR "C:\Windows\System32\cmd.exe /c C:\Users\farid\DOCUME~1\FRECUE~1\scripts\run_checkpoint.bat" /SC DAILY /ST 21:17 /F
```

> **Zona horaria:** `schtasks` usa la zona horaria local de Windows. Para cumplir `America/Monterrey`, configurar Windows con esa zona o ajustar `/ST` según desfase local.

**Nota:** Se usan rutas cortas 8.3 (`DOCUME~1`, `FRECUE~1`) para evitar errores de ejecución por espacios en ruta.

### 4.2 Verificar las tareas

```cmd
schtasks /Query /TN "FG_Checkpoint_0917"
schtasks /Query /TN "FG_Checkpoint_2117"
```

### 4.3 Ejecutar manualmente

```cmd
schtasks /Run /TN "FG_Checkpoint_0917"
```

### 4.4 Modificar horarios

```cmd
schtasks /Change /TN "FG_Checkpoint_0917" /ST 08:00
schtasks /Change /TN "FG_Checkpoint_2117" /ST 22:00
```

### 4.5 Eliminar tareas

```cmd
schtasks /Delete /TN "FG_Checkpoint_0917" /F
schtasks /Delete /TN "FG_Checkpoint_2117" /F
```

### 4.6 Configuración avanzada (Task Scheduler GUI)

Si prefieres la GUI (`taskschd.msc`):

1. Abrir **Task Scheduler** → Create Task
2. **General:**
   - Nombre: `FG Checkpoint Morning` / `FG Checkpoint Evening`
   - ✅ Run whether user is logged on or not (opcional)
   - ✅ Run with highest privileges (recomendado para acceso a git)
3. **Triggers:**
   - Daily, 09:17 / 21:17
4. **Actions:**
   - Program: `C:\Users\farid\Documents\Frecuencia Global\scripts\run_checkpoint.bat`
   - Start in: `C:\Users\farid\Documents\Frecuencia Global`
5. **Conditions:**
   - ❌ Start only if on AC power (desmarcar para que corra en batería)
6. **Settings:**
   - ✅ If the task fails, restart every 5 minutes (up to 3 times)
   - ✅ Stop the task if it runs longer than 5 minutes

---

## 5. n8n — CONFIGURACIÓN

### 5.1 Importar workflow

```powershell
cd "C:\Users\farid\Documents\Frecuencia Global\08_n8n"
docker compose exec -T n8n n8n import:workflow --input="/workspace/08_n8n/workflows/WF-006_Auto_Checkpoint.json"
```

### 5.2 Activar workflow

Opción A — desde la UI de n8n (http://localhost:5678):

1. Buscar "WF-006A — Auto Checkpoint (Hybrid)"
2. Toggle de active → On

Opción B — por CLI (requiere restart de n8n para aplicar activación):

```powershell
docker compose exec -T n8n n8n update:workflow --id=<WORKFLOW_ID_WF-006A> --active=true
docker compose restart n8n
```

> **Nota:** El ID real puede diferir. Obtenerlo con `docker compose exec -T n8n n8n list:workflow`.

### 5.3 Probar webhook manualmente

```powershell
$payload = @{
    event = "checkpoint_generated"
    timestamp = (Get-Date -Format o)
    checkpoint_file = "01_Estrategia/FG_Checkpoint_AUTO_TEST.md"
    summary = "Test checkpoint manual"
    git_status = "clean"
    git_branch = "main"
    touched_areas = @("system", "scripts")
    new_files_count = 1
    modified_files_count = 2
    key_files = @("system/SISTEMA_MAESTRO.md")
    blockers = @("0 piezas publicadas en ninguna plataforma")
    next_action = "Publicar P1_001"
    website_build_exists = $true
    website_article_count = 2
} | ConvertTo-Json -Depth 3

Invoke-WebRequest -Uri "http://localhost:5678/webhook/checkpoint" -Method POST -ContentType "application/json" -Body $payload
```

### 5.4 Telegram (opcional)

El nodo de Telegram está **desactivado por defecto**. Para habilitarlo:

1. Configurar en `.env`:
   ```
   TELEGRAM_BOT_TOKEN=<tu_token_de_BotFather>
   TELEGRAM_CHAT_ID=<tu_chat_id>
   ```
2. Reiniciar n8n: `docker compose restart n8n`
3. En la UI de n8n → abrir WF-006A → habilitar nodo "Telegram (opcional)"

> **REQUIERE APROBACIÓN:** creación del bot en @BotFather y entrega del token/chat_id.

**Identidad sugerida del bot (alineada a marca):**
- Nombre visible: `Frecuencia Global Checkpoint`
- Username sugerido: `FGCheckpointBot` (o variante disponible)
- Bio corta: `Análisis internacional con pulso electrónico · Alertas de checkpoint`

---

## 6. QUÉ DETECTA EL SCRIPT

| Área | Qué revisa |
|------|-----------|
| **Git** | Branch, status (dirty/clean), archivos sin commit, diff, últimos 5 commits |
| **system/** | Cambios en SISTEMA_MAESTRO, agents, templates, rules, playbooks, memory |
| **01_Estrategia/** | Checkpoints, blueprint, diagnósticos |
| **02_Brand_System/** | Brand Kit, Figma docs |
| **03_Editorial/** | Briefs, research, scripts |
| **04_Produccion/** | Handoffs, QA, production logs, PublishReady |
| **05_Monetizacion/** | Cualquier archivo nuevo (vacía por ahora) |
| **06_Assets/** | Watermarks, video assets |
| **07_Operaciones/** | Operations log, checklists, reports |
| **08_n8n/** | Workflows, docker-compose, docs |
| **website/** | Components, pages, articles, config (excluye dist/, node_modules/) |
| **scripts/** | Automation scripts |
| **Assets_Base/** | SVGs, PNGs del brand system |
| **.github/agents/** | VS Code agent definitions |

### Detección de bloqueadores

- No hay archivos `*PublishReady*` en `04_Produccion/` → "0 piezas publicadas"
- `website/dist/` no existe → "Sin build generado"
- Build tiene >1 semana → "Build desactualizado"

---

## 7. ESTRATEGIA POST-SESION (CHAT CHECKPOINTS)

Cada ejecucion de `generate_checkpoint.py` ahora deja listo un bloque reutilizable en:

- `system/memory/checkpoints_chat_setup_latest.md`

Ese archivo se usa al iniciar la siguiente sesion para configurar el chat en modo Checkpoints sin rearmar contexto manual.

### Flujo recomendado

1. Cerrar sesion y generar checkpoint (manual o scheduler).
2. Al volver, abrir `system/memory/checkpoints_chat_setup_latest.md`.
3. Copiar el bloque `Reusable Prompt` al chat.
4. Ejecutar la `Next Action` y validar bloqueadores antes de producir.

### Objetivo operativo

- Menos tiempo de onboarding por sesion.
- Menos perdida de contexto entre turnos.
- Priorizacion consistente con el ultimo estado real del proyecto.

### Archivos clave

El script marca como "archivo clave" cualquier archivo nuevo/modificado cuyo nombre contenga:
`SISTEMA_MAESTRO`, `ROADMAP`, `Blueprint`, `Brand_Kit`, `Checkpoint`, `Brief`, `Script`, `QA`, `PublishReady`, `Operations_Log`, `STATE_PROJECT`

---

## 7. RELACIÓN TASK SCHEDULER + SCRIPT + n8n

1. **09:17** — Windows Task Scheduler ejecuta `run_checkpoint.bat`
2. El BAT activa `.venv` y corre `generate_checkpoint.py`
3. El script:
   - Lee git status
   - Escanea 14 directorios por cambios recientes
   - Verifica website y assets
   - Detecta bloqueadores
   - Escribe 4 artefactos en disco
   - Intenta POST a `http://localhost:5678/webhook/checkpoint`
4. Si n8n está activo → WF-008 recibe el payload, escribe log adicional, responde OK
5. Si n8n NO está activo → el payload queda en `system/memory/checkpoint_payload_latest.json`
6. **21:17** — Se repite el ciclo

---

## 8. TROUBLESHOOTING

| Problema | Solución |
|----------|----------|
| Script no encuentra Python | Verificar `.venv/Scripts/activate.bat` existe y Python está instalado |
| Git no encontrado | Instalar git y agregar a PATH |
| Task Scheduler no ejecuta | Verificar con `schtasks /Query /TN "FG\Checkpoint_Morning"`; revisar permisos |
| n8n no recibe webhook | Verificar que Docker está corriendo: `docker ps`; revisar `docker compose logs n8n` |
| Telegram no envía | Verificar TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID en `.env`; habilitar nodo en UI |
| Permission denied en logs/ | Verificar que `07_Operaciones/logs/` existe y tiene permisos de escritura |

---

## 9. NOTAS

- **WF-006** ya existe como "Preparar Publicación" y **WF-007** como "Publicar X". Por eso el checkpoint es **WF-008**.
- El script no requiere paquetes externos — usa solo la biblioteca estándar de Python.
- El lookback por defecto es 12 horas. Para el primer run, usar `--hours 24` o más.
- `STATE_PROJECT.json` se sobreescribe en cada checkpoint (estado actual, no histórico).
- Los logs diarios sí son append — se acumulan entradas por día.

---

*Documento creado: 2026-04-01*
