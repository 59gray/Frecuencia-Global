PROMPT PARA OPUS — OBTENER CREDENCIALES X API (TWITTER)
================================================================================

CONTEXTO
--------
Proyecto: Frecuencia Global (sistema de publicación de contenido geopolítico)
Necesidad: Configurar API de X/Twitter en n8n Cloud para publicación automatizada
Estado actual: Workflows listos, falta credencial X OAuth2
Fecha: 2026-04-04

OBJETIVO ESPECIFICO
-------------------
Obtener los 4 tokens necesarios para configurar X OAuth2 API en n8n Cloud:
1. API Key (Consumer Key)
2. API Secret (Consumer Secret)  
3. Access Token
4. Access Token Secret

PASOS EXACTOS A SEGUIR
----------------------
1. Acceder a https://developer.twitter.com/en/portal/dashboard
   - Si no hay cuenta: crearla con email del proyecto
   - Si no hay proyecto: crear proyecto "Frecuencia Global"

2. Crear App dentro del proyecto:
   - App name: "Frecuencia Global Publisher"
   - Description: "Automated publishing for Frecuencia Global content"
   - Website URL: https://frecuenciaglobal.vercel.app
   - Callback URL: https://frecuenciaglobal.app.n8n.cloud/rest/oauth2-credential/callback
   - TOS agreement: Aceptar términos de Twitter Developer

3. Generar tokens (Settings → Keys and Tokens):
   - API Key & Secret: Regenerate si no existen
   - Access Token & Secret: Generate con permisos Read and Write
   - Guardar los 4 valores inmediatamente (solo se muestran una vez)

4. Verificar permisos:
   - App settings → User authentication settings
   - OAuth 2.0 → ON
   - Type of App: Web App, Automated App or Bot
   - Callback URL confirmada: https://frecuenciaglobal.app.n8n.cloud/rest/oauth2-credential/callback
   - Website URL: https://frecuenciaglobal.vercel.app
   - Scope: tweet.read, tweet.write, users.read, offline.access

SCOPES REQUERIDOS PARA N8N
---------------------------
- tweet.read (leer tweets)
- tweet.write (publicar tweets) ← CRITICO
- users.read (obtener info de usuario)
- offline.access (mantener sesión)

RESTRICCIONES DE X API (NIVEL BASICO/GRATUITO)
----------------------------------------------
- 1500 tweets por mes (suficiente para proyecto)
- Rate limits: 200 requests/15 min por user
- No acceso a API v2 premium features
- Solo cuenta asociada a la app puede publicar

ENTREGABLES ESPERADOS
---------------------
Devolver EXACTAMENTE este formato:

```
X API CREDENTIALS — FRECUENCIA GLOBAL
=====================================
Estado: ✅ Obtenido / ❌ Bloqueado / ⚠️ Requiere verificación

App Name: Frecuencia Global Publisher
App ID: [ID de la app en Twitter Developer Portal]

TOKENS (Guardar en 1Password/vault seguro):
-------------------------------------------
API Key:            [valor]
API Secret:         [valor]
Access Token:       [valor]
Access Secret:      [valor]

Callback URL configurada: https://frecuenciaglobal.app.n8n.cloud/rest/oauth2-credential/callback
Scopes habilitados: tweet.read, tweet.write, users.read, offline.access

PRÓXIMO PASO PARA USUARIO:
--------------------------
Ir a n8n Cloud → Settings → Credentials → X OAuth2 API
- Pegar API Key y API Secret
- Pegar Access Token y Access Secret
- Guardar credencial
- Probar con WF-007_publicar_x
```

POSIBLES BLOQUEADORES Y SOLUCIONES
----------------------------------
1. "Developer account pending approval"
   → Esperar aprobación (horas a días) o usar cuenta ya verificada

2. "Phone verification required"
   → Verificar número de teléfono en cuenta de Twitter/X

3. "Elevated access required for write permissions"
   → Solicitar Elevated access en Developer Portal (gratuito, revisión manual)

4. "Cannot create more apps"
   → Nivel Basic/Elevated limita apps, usar app existente o upgrade

NOTAS IMPORTANTES
-----------------
- Los tokens son SENSIBLES, no compartir en texto plano después de obtenerlos
- N8N_CLOUD_URL: https://frecuenciaglobal.app.n8n.cloud
- Si ya existe app "Frecuencia Global Publisher", reutilizar/regenerar tokens
- Capturar screenshot del portal si hay configuraciones especiales

INFORMACION DEL PROYECTO (para TOS)
-----------------------------------
Nombre: Frecuencia Global
Descripción: Newsletter y podcast de análisis geopolítico internacional
Website: https://frecuenciaglobal.vercel.app
Uso: Publicación automatizada de contenido editorial propio (no spam)
País: México
Categoría: News/Media

================================================================================
EJECUTAR ESTOS PASOS Y DEVOLVER ENTREGABLE EN FORMATO ESPECIFICADO ARRIBA.
================================================================================
