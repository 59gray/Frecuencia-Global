# Prompt para Claude — Configurar Telegram en n8n Cloud

## OBJETIVO
Configurar las variables de entorno `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` en la instancia n8n Cloud de Frecuencia Global.

## DATOS DE CONFIGURACIÓN
- **URL n8n Cloud:** https://frecuenciaglobal.app.n8n.cloud
- **TELEGRAM_BOT_TOKEN:** `8649865467:AAEnAgcdTslKCpLNMgue6_tke10y-mSsvtU`
- **TELEGRAM_CHAT_ID:** `7226596813`

## PASOS A EJECUTAR

### Paso 1: Acceder a n8n Cloud
1. Navegar a https://frecuenciaglobal.app.n8n.cloud
2. Si hay login, esperar instrucciones del usuario
3. Verificar que se carga el dashboard de n8n (lista de workflows visible)

### Paso 2: Ir a Settings → Variables
1. Localizar menú lateral izquierdo
2. Buscar y hacer click en "Settings" (icono de engranaje ⚙️)
3. En el submenú de Settings, hacer click en "Variables"
4. Verificar que se muestra la lista de variables existentes (GITHUB_OWNER, GITHUB_REPO, etc.)

### Paso 3: Añadir Variable TELEGRAM_BOT_TOKEN
1. Buscar botón "Add Variable" (generalmente arriba derecha de la tabla)
2. Click en "Add Variable"
3. Completar campos:
   - **Name:** `TELEGRAM_BOT_TOKEN`
   - **Value:** `8649865467:AAEnAgcdTslKCpLNMgue6_tke10y-mSsvtU`
4. Click en botón "Save"
5. Verificar que la variable aparece en la lista

### Paso 4: Añadir Variable TELEGRAM_CHAT_ID
1. Click en "Add Variable" otra vez
2. Completar campos:
   - **Name:** `TELEGRAM_CHAT_ID`
   - **Value:** `7226596813`
3. Click en botón "Save"
4. Verificar que aparece en la lista junto a TELEGRAM_BOT_TOKEN

### Paso 5: Verificación Final
1. Confirmar que en la lista de Variables se ven:
   - ✅ GITHUB_OWNER (existente)
   - ✅ GITHUB_REPO (existente)
   - ✅ GITHUB_BRANCH (existente)
   - ✅ TELEGRAM_BOT_TOKEN (nuevo)
   - ✅ TELEGRAM_CHAT_ID (nuevo)

## REPORTE DE RESULTADO

Al finalizar, reportar EXACTAMENTE:
```
✅ Configuración completada:
- TELEGRAM_BOT_TOKEN: Guardado (8649865467:AAEn...svtU)
- TELEGRAM_CHAT_ID: Guardado (7226596813)
- Variables visibles en n8n Cloud: SÍ / NO

Próximo paso: Probar WF-004 con Execute Workflow
```

## NOTAS IMPORTANTES
- Si el botón se llama diferente (ej: "Create Variable", "New Variable", "+"), usar el que esté disponible
- Si hay modal de confirmación, aceptar
- Si hay error de red, reintentar una vez
- NO modificar otras variables existentes (GITHUB_*)
- Si la sesión expiró, reportar "Sesión requiere login" y detenerse
