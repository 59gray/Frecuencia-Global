# Configuración X API en n8n Cloud — COMPLETAR AHORA

**Fecha:** 2026-04-04  
**Estado:** Credenciales obtenidas ✅ — Pendiente configurar en n8n Cloud

---

## Credenciales X API (Frecuencia Global n8n)

| Credencial | Valor |
|---|---|
| **API Key (Consumer Key)** | `wc7n5fTg452bjMkFjl87WZ61U` |
| **API Secret (Consumer Secret)** | `fXp3445W9CgbRqEg1bAzxhkMfXAB7vsf9ATkeM05vwYlnittLs` |
| **Access Token** | `2285520619-A8vU1Nke4eGICcG9AXNYL0W4emGi5pJP9BYavTf` |
| **Access Token Secret** | `M78DrpWXTbw0zyGwXR8VS0jJPQmqEqvBojNSVjDuMAf7A` |

⚠️ **IMPORTANTE:** Guardar estas credenciales en 1Password o vault seguro. NO dejar en archivos de texto.

---

## PASOS PARA CONFIGURAR EN N8N CLOUD

### 1. Acceder a n8n Cloud
- URL: https://frecuenciaglobal.app.n8n.cloud
- Login con tus credenciales

### 2. Ir a Settings → Credentials
- Click en "Add Credential"
- Buscar: "X OAuth2 API" o "Twitter"

### 3. Configurar OAuth 2.0

**Screen 1: OAuth Settings**
- **Client ID:** `wc7n5fTg452bjMkFjl87WZ61U` (API Key)
- **Client Secret:** `fXp3445W9CgbRqEg1bAzxhkMfXAB7vsf9ATkeM05vwYlnittLs` (API Secret)

**Screen 2: Advanced Settings (si aparece)**
- **Access Token:** `2285520619-A8vU1Nke4eGICcG9AXNYL0W4emGi5pJP9BYavTf`
- **Access Secret:** `M78DrpWXTbw0zyGwXR8VS0jJPQmqEqvBojNSVjDuMAf7A`
- **Callback URL:** `https://frecuenciaglobal.app.n8n.cloud/rest/oauth2-credential/callback`

### 4. Scopes a habilitar
- ✅ `tweet.read`
- ✅ `tweet.write` (CRÍTICO — permite publicar)
- ✅ `users.read`
- ✅ `offline.access`

### 5. Guardar y Renombrar
- Guardar credencial
- Renombrar a: "X API — Frecuencia Global" (para identificarla fácil)

---

## VERIFICAR CONEXIÓN

### Test 1: Conexión básica
1. Crear workflow de prueba temporal
2. Agregar nodo "X → Create Tweet"
3. Seleccionar credencial recién creada
4. Escribir tweet de prueba: "Test de conexión API desde n8n"
5. Ejecutar (Run once)

**Esperado:** Tweet publicado en @globalfrequency.es

---

## PROBAR WF-007 (Publicar en X)

### Preparar
1. Asegurar que pieza P1_001 o P1_002 tenga contenido X definido
2. Verificar en `04_Produccion/[PIEZA]_PublishReady.md` → sección X

### Ejecutar
1. En n8n Cloud, abrir workflow **WF-007 — Publicar en X**
2. Click en "Execute Workflow"
3. En el panel de parámetros, ingresar:
   ```json
   {
     "pieza": "P1_001"
   }
   ```
4. Click "Run"

**Esperado:** 
- Workflow lee contenido de P1_001
- Publica tweet con credencial X configurada
- Log success en Operations Log

---

## POST-CONFIGURACIÓN

Una vez verificado que funciona:
1. ✅ Borrar este archivo o mover a secure vault
2. ✅ Documentar en `07_Operaciones/` que X API está configurada
3. ✅ Actualizar estado en próximo checkpoint

---

## NOTAS

- Rate limit X API (Basic): 1500 tweets/mes, 200 requests/15min
- Si falla auth: Verificar que tokens no tengan espacios extra
- Si scopes insuficientes: Ir a Twitter Dev Portal → App → Edit → Permissions
