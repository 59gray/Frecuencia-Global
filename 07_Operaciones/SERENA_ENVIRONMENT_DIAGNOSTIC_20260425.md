# Serena Environment Diagnostic
**Fecha:** 2026-04-25  
**Hora:** ~16:45 CST  
**Solicitante:** Farid  
**Objetivo:** Localizar Serena realmente, determinar si está instalada como app/binario/paquete/MCP/servicio/script/cache

---

## 1. Resumen Ejecutivo

| Aspecto | Estado |
|---------|--------|
| **Serena instalada** | ✅ **SÍ** |
| **Serena configurada como MCP** | ⚠️ **PARCIALMENTE** (en VS Code, no en Windsurf) |
| **Serena visible para Windsurf** | ❌ **NO** |
| **Tipo de instalación** | Paquete MCP GitHub Gallery (oraios/serena v1.0.0) |
| **Runtime** | uvx (universal Python tool runner) |

---

## 2. Evidencia de Serena Encontrada

### 2.1 Ubicación Exacta
```
C:\Users\farid\AppData\Roaming\Code\User\mcp\oraios.serena-1.0.0\
├── README.md (12,907 bytes)
└── manifest.json (1,130 bytes)
```

**Fecha de instalación:** 2026-03-30 11:21:39 PM

### 2.2 Comando de Ejecución (extraído de manifest.json)
```bash
uvx --from git+https://github.com/oraios/serena serena start-mcp-server
```

Parámetros MCP:
- **Runtime:** uvx (en `C:\Users\farid\.local\bin\uvx.exe`)
- **Transport:** stdio
- **Package:** serena desde GitHub (oraios/serena)
- **Entry point:** cli con subcommand `start-mcp-server`

### 2.3 Descripción Oficial
> "Semantic code retrieval & editing tools for coding agents."  
> Serena proporciona herramientas IDE-like para LLMs: `find_symbol`, `find_referencing_symbols`, `insert_after_symbol`, etc.

---

## 3. Otros MCPs Encontrados en VS Code

Serena no está sola. VS Code tiene **12 servidores MCP** instalados:

| Servidor MCP | Versión | Publisher |
|--------------|---------|-----------|
| oraios.serena | 1.0.0 | oraios |
| com.figma.mcp | 1.0.3 | Figma |
| coplaydev.unity-mcp | 1.0.0 | Unity |
| firecrawl.firecrawl-mcp-server | 1.0.0 | Firecrawl |
| io.github.ChromeDevTools.chrome-devtools-mcp | 0.20.3 | ChromeDevTools |
| io.github.github.github-mcp-server | 0.33.0 | GitHub |
| io.github.upstash.context7 | 1.0.31 | Upstash |
| io.github.wonderwhy-er.desktop-commander | 0.2.38 | DesktopCommander |
| makenotion.notion-mcp-server | 1.0.0 | Notion |
| microsoft.markitdown | 1.0.0 | Microsoft |
| microsoft.playwright-mcp | 0.0.1-seed | Microsoft |
| microsoftdocs.mcp | 1.0.0 | MicrosoftDocs |

**Ubicación base:** `C:\Users\farid\AppData\Roaming\Code\User\mcp\`

---

## 4. Estado de Configuración MCP

### 4.1 VS Code (Cline extension)
```
C:\Users\farid\AppData\Roaming\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
```
**Contenido:**
```json
{
  "mcpServers": {}
}
```
❌ **VACÍO** - Los MCPs están instalados pero NO configurados

### 4.2 Windsurf
```
C:\Users\farid\AppData\Roaming\Windsurf\User\globalStorage\rooveterinaryinc.roo-cline\settings\mcp_settings.json
C:\Users\farid\AppData\Roaming\Windsurf\User\globalStorage\sixth.sixth-ai\settings\sixth-mcp-settings.json
```
**Contenido de ambos:**
```json
{
  "mcpServers": {}
}
```
❌ **VACÍOS** - Sin configuración MCP

### 4.3 Windsurf settings.json
```
C:\Users\farid\AppData\Roaming\Windsurf\User\settings.json
```
**Relevante para MCP:**
```json
"chat.mcp.gallery.enabled": true,
```
✅ Windsurf tiene la galería MCP habilitada  
❌ Pero no tiene paquetes MCP instalados localmente

---

## 5. Herramientas Disponibles en el Sistema

| Herramienta | Ubicación | Estado |
|-------------|-----------|--------|
| uv | `C:\Users\farid\.local\bin\uv.exe` | ✅ Instalado v0.11.2 |
| uvx | `C:\Users\farid\.local\bin\uvx.exe` | ✅ Instalado |
| python | `C:\Users\farid\AppData\Local\Python\bin\python.exe` | ✅ Disponible |
| node | `C:\Program Files\nodejs\node.exe` | ✅ Instalado |
| npx/npm | `C:\Program Files\nodejs\` | ✅ Instalados |
| pipx | No encontrado | ❌ No instalado |

---

## 6. Procesos Activos Relacionados

```
ProcessName    Id     Path
-----------    --     ----
python      25000     D:\FrecuenciaGlobal\ComfyUI\.venv\Scripts\python.exe
python      25048     C:\Users\farid\AppData\Roaming\uv\python\cpython-3.12.11-windows-x86_64-none\python.exe
```

**Nota:** No hay proceso Serena activo actualmente. Es un servidor MCP que se inicia bajo demanda.

---

## 7. Referencias Históricas

**Historial PowerShell** (`ConsoleHost_history.txt`) muestra:
- Línea 4545-4554: Comandos de diagnóstico ejecutados hoy (2026-04-25)
- Busquedas por `serena|mcp` en el sistema

Esto confirma que Farid ha estado investigando Serena recientemente.

---

## 8. Por Qué Windsurf No Ve Serena

### Análisis de la situación:

1. **Serena está instalada** → Sí, pero solo en el contexto de VS Code
2. **Ubicación VS Code:** `C:\Users\farid\AppData\Roaming\Code\User\mcp\`
3. **Ubicación Windsurf:** No existe carpeta `mcp\` equivalente

### Razón técnica:

Windsurf y VS Code mantienen sus paquetes MCP en **directorios separados**:
- VS Code: `%APPDATA%\Code\User\mcp\`
- Windsurf: `%APPDATA%\Windsurf\User\mcp\` ← **NO EXISTE**

Aunque Windsurf tiene `chat.mcp.gallery.enabled: true`, esto solo habilita la UI para buscar/instalar MCPs desde la galería. No automáticamente migra los MCPs de VS Code.

---

## 9. Acción Exacta para Habilitar Serena en Windsurf

### Opción A: Instalar desde Galería MCP (Recomendada)

1. Abrir Windsurf
2. Ir al panel de chat/agente
3. Buscar "MCP Gallery" o "Add MCP Server"
4. Buscar "Serena" (oraios/serena)
5. Click en "Install"

### Opción B: Configuración Manual

Crear/editar archivo:
```
C:\Users\farid\AppData\Roaming\Windsurf\User\mcp_settings.json
```

Contenido:
```json
{
  "mcpServers": {
    "serena": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/oraios/serena",
        "serena",
        "start-mcp-server"
      ]
    }
  }
}
```

**Nota:** El formato exacto puede variar según la versión de Windsurf.

### Opción C: Copiar desde VS Code

Copiar toda la carpeta:
```powershell
Copy-Item -Path "$env:APPDATA\Code\User\mcp\oraios.serena-1.0.0" `
          -Destination "$env:APPDATA\Windsurf\User\mcp\oraios.serena-1.0.0" `
          -Recurse -Force
```

Luego configurar el mcp_settings.json de Windsurf para apuntar al paquete.

---

## 10. Lo Que NO Se Tocó

| Elemento | Razón |
|----------|-------|
| `.env` files | Instrucción explícita de no tocar |
| Credenciales/Secrets | No se abrieron archivos con tokens/passwords |
| Perfiles `.chrome-*`, `.claude`, `.cursor` | Instrucción explícita de no abrir |
| Archivos de historial completos | Solo se buscaron líneas con "serena\|mcp" |
| Instalación de nuevos paquetes | Diagnóstico read-only |
| Modificación de configs existentes | Diagnóstico read-only |

---

## 11. Conclusión

**Serena está instalada pero aislada en VS Code.**

- ✅ **Encontrada:** `C:\Users\farid\AppData\Roaming\Code\User\mcp\oraios.serena-1.0.0`
- ✅ **Funcional:** Listo para ejecutar via `uvx`
- ❌ **No conectada a Windsurf:** Falta configuración y posiblemente reinstalación en contexto Windsurf

**Próximo paso recomendado:** Usar la Galería MCP de Windsurf para instalar Serena, o configurar manualmente el `mcp_settings.json` de Windsurf.

---

*Fin del diagnóstico. No se modificó ningún archivo.*
