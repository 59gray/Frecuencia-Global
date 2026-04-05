# Prompt para Claude — Corregir Error JSON en GitHub PUT Log (WF-004)

## ERROR ACTUAL
```
Problem in node 'GitHub: PUT Log'
The value in the 'JSON Body' field is not valid JSON
```

## CAUSA
El nodo HTTP Request "GitHub: PUT Log" está enviando un JSON mal formado a la API de GitHub para actualizar el archivo de log.

## SOLUCIÓN REQUERIDA

### Paso 1: Abrir Configuración del Nodo Problemático
1. En WF-004, hacer click en el nodo **"GitHub: PUT Log"** (el que tiene icono rojo X)
2. Esto abrirá el panel de configuración del nodo

### Paso 2: Identificar el Campo JSON Body
Buscar en la configuración:
- **Method:** PUT (ya configurado)
- **URL:** `https://api.github.com/repos/59gray/frecuencia-global/contents/07_Operaciones/FG_Operations_Log.md`
- **Authentication:** GitHub API (o similar)
- **Send Body:** SÍ / true
- **Body Content Type:** JSON
- **JSON Body:** ← **ESTE ES EL PROBLEMA**

### Paso 3: Corregir el JSON Body

El JSON correcto para la API de GitHub debe ser:

```json
{
  "message": "Update operations log",
  "content": "{{ $json.contentBase64 }}",
  "sha": "{{ $json.sha }}"
}
```

**Importante:** 
- Si el contenido actual tiene comillas mal escapadas o formato incorrecto, reemplazarlo completamente
- El campo `content` debe recibir el contenido del log codificado en base64
- El campo `sha` es requerido para updates (no para crear archivo nuevo)

### Paso 4: Verificar Nodo Anterior "Append a Log"

El nodo "Append a Log" debe estar generando estas variables:
- `$json.contentBase64` — contenido del log codificado en base64
- `$json.sha` — SHA del archivo actual (obtenido del GET previo)

Si "Append a Log" no genera estas variables, hay dos opciones:

**Opción A:** Modificar "Append a Log" para que genere:
```javascript
// En el código del nodo "Append a Log"
const content = /* contenido del log */;
const contentBase64 = Buffer.from(content).toString('base64');
return [{ json: { content, contentBase64, sha: $input.first().json.sha } }];
```

**Opción B:** Si "Append a Log" solo modifica localmente, mover la lógica base64 al nodo PUT:
```json
{
  "message": "Update operations log",
  "content": "{{ Buffer.from($json.logContent || '').toString('base64') }}",
  "sha": "{{ $json.sha }}"
}
```

### Paso 5: Guardar y Probar

1. Click en **Save** (del nodo)
2. Click en **Execute Workflow** (del workflow completo)
3. Input de prueba:
   ```json
   {
     "evento": "TEST_GITHUB_FIX",
     "pieza": "P1_001",
     "detalles": "Prueba de corrección JSON",
     "timestamp": "2026-04-04T21:45:00Z"
   }
   ```
4. Verificar que el workflow completa sin errores
5. Confirmar mensaje recibido en Telegram

## ESTRUCTURA CORRECTA DE DATOS

Flujo de datos esperado:
```
GitHub: GET Log → obtiene sha y contenido actual
    ↓
Append a Log → añade nueva línea, genera contentBase64
    ↓
GitHub: PUT Log → envía {message, content: base64, sha}
    ↓
Notificar Telegram → envía mensaje de confirmación
```

## VERIFICACIÓN FINAL

Reportar:
- ✅ JSON Body corregido: SÍ/NO
- ✅ Workflow WF-004 ejecuta sin error: SÍ/NO
- ✅ Mensaje recibido en Telegram: SÍ/NO

## NOTAS
- Si el nodo "GitHub: PUT Log" usa "HTTP Request" node (genérico), asegurar que tiene autenticación configurada
- Si usa "GitHub" node oficial de n8n, verificar que la operación es "Update a file" y los campos están mapeados correctamente
- El SHA es crítico: sin él GitHub rechaza el update (conflict detection)
