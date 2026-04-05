# Prompt para Claude — Diagnosticar Error GitHub en n8n Cloud WF-004

## OBJETIVO
Diagnosticar y corregir el error en el nodo "GitHub: PUT Log" del workflow WF-004 en n8n Cloud.

## CONTEXTO
- **Workflow:** WF-004 — Notificación y Log (Cloud)
- **Error visible:** "Problem in node 'GitHub: PUT Log' - Your request is invalid or could not be processed by the service"
- **El workflow se detiene aquí** y no llega al nodo "Notificar Telegram"
- **Variables GitHub configuradas:** GITHUB_OWNER=59gray, GITHUB_REPO=frecuencia-global, GITHUB_BRANCH=main
- **GitHub PAT:** Configurado en credenciales (nombre: likely "GitHub API" o similar)

## PASOS A EJECUTAR

### Paso 1: Examinar el Error Detallado
1. En WF-004, localizar el nodo con error (GitHub: PUT Log - tiene icono rojo X)
2. Click en el nodo para abrir su configuración
3. Identificar qué operación está fallando:
   - ¿Es GET del log existente?
   - ¿Es PUT/escritura del log actualizado?
   - ¿Es autenticación?
4. Si hay botón "View Error Details" o similar, click para ver mensaje completo

### Paso 2: Verificar Credencial GitHub
1. Ir a Settings → Credentials
2. Buscar credencial GitHub (nombre típico: "GitHub API", "GitHub", "FG GitHub")
3. Verificar que:
   - Tipo: GitHub API
   - Token está presente (no vacío)
   - Scopes del token incluyen `repo` (lectura/escritura)
4. Si el token es placeholder (ej: "ghp_xxx" o "REPLACE_WITH_TOKEN"), reportar "Token inválido"

### Paso 3: Verificar Ruta del Archivo Log
1. En n8n Cloud, los workflows no tienen acceso a filesystem local
2. El nodo "Append a Log" intenta escribir a `/workspace/07_Operaciones/FG_Operations_Log.md`
3. Verificar si el workflow tiene acceso GitHub API para escribir archivos
4. Si el nodo GitHub PUT Log usa HTTP Request directo a GitHub API, verificar:
   - URL correcta: `https://api.github.com/repos/59gray/frecuencia-global/contents/07_Operaciones/FG_Operations_Log.md`
   - Método: PUT
   - Headers: Authorization con token
   - Body: contenido en base64

### Paso 4: Opciones de Solución

**Opción A: Si el problema es autenticación GitHub**
- Verificar que el GitHub PAT tenga scope `repo`
- Regenerar token en GitHub si es necesario
- Actualizar credencial en n8n

**Opción B: Si el problema es la ruta del archivo**
- El archivo `07_Operaciones/FG_Operations_Log.md` debe existir en el repo
- Si no existe, crearlo vacío primero (vía GitHub web o API)

**Opción C: Si el problema es el formato de la API**
- El nodo GitHub PUT Log debe usar la API REST de GitHub correctamente
- Verificar que se está codificando el contenido en base64
- Verificar que se maneja el SHA del archivo existente (requerido para updates)

**Opción D: Bypass temporal para probar Telegram**
- Desconectar temporalmente el nodo "GitHub: PUT Log"
- Conectar "Append a Log" directamente a "Notificar Telegram"
- Esto permite probar Telegram mientras se arregla GitHub

### Paso 5: Implementar Solución Recomendada

**Recomendación prioritaria:** Opción D (Bypass) para validar Telegram ahora, luego Opción A/B para arreglar GitHub.

Pasos para bypass:
1. En WF-004, click en nodo "GitHub: PUT Log"
2. Buscar opción "Disable Node" o desconectar las conexiones
3. Crear nueva conexión: "Append a Log" → "Notificar Telegram"
4. Guardar workflow
5. Ejecutar nuevamente con input de prueba

## DATOS DE PRUEBA

Input para probar WF-004:
```json
{
  "evento": "TEST_TELEGRAM",
  "pieza": "P1_001",
  "detalles": "Prueba de notificación Telegram",
  "timestamp": "2026-04-04T21:10:00Z"
}
```

## REPORTE ESPERADO

Al finalizar, reportar EXACTAMENTE:
```
🔍 Diagnóstico:
- Error identificado: [descripción breve]
- Causa raíz: [autenticación / ruta / formato API / otro]

✅ Acciones tomadas:
- [Lista de cambios realizados]

🧪 Prueba:
- WF-004 ejecutado: SÍ / NO
- Mensaje recibido en Telegram: SÍ / NO
- Errores restantes: [si hay]
```

## NOTAS IMPORTANTES
- NO modificar otros workflows sin confirmar
- Si se desconecta GitHub PUT Log, documentar para reconectar después
- Telegram ya está configurado (variables TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID están listas)
- Prioridad: Validar que Telegram funcione, luego arreglar GitHub
