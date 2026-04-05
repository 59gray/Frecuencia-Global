# Configuración Telegram Bot — n8n Cloud

## PASO 1: Crear Bot con BotFather (2 minutos)

1. Abrir Telegram (app o web.telegram.org)
2. Buscar contacto: **@BotFather**
3. Iniciar conversación y enviar: `/newbot`
4. Responder preguntas:
   - **Nombre del bot:** `Frecuencia Global Checkpoint`
   - **Username:** `FrecuenciaGlobalCheckpointBot` (debe terminar en Bot)
5. BotFather responderá con el **TOKEN** — copiarlo inmediatamente:
   ```
   123456789:ABCdefGHIjklMNOpqrSTUvwxyz
   ```

## PASO 2: Obtener Chat ID (1 minuto)

**Opción A: Método Web (Más fácil)**
1. Enviar mensaje cualquiera al bot recién creado
2. Abrir navegador y visitar:
   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
   (reemplazar `<TOKEN>` con el token real)
3. Buscar en la respuesta JSON:
   ```json
   {"message":{"chat":{"id":123456789, ...}}}
   ```
4. El número `123456789` es tu **CHAT_ID**

**Opción B: Método n8n (Después de configurar TOKEN)**
1. En n8n Cloud, crear workflow temporal con nodo "Telegram → Get Chat ID"
2. Ejecutar, obtener ID de la respuesta

## PASO 3: Configurar en n8n Cloud (3 minutos)

1. Acceder: https://frecuenciaglobal.app.n8n.cloud
2. Ir a: **Settings → Credentials**
3. Click: **Add Credential**
4. Buscar: **Telegram**
5. Seleccionar: **Telegram API**
6. Completar:
   - **Bot Token:** Pegar token de BotFather
   - **Credential Name:** `Telegram — Frecuencia Global Checkpoint`
7. Guardar: **Save**

## PASO 4: Configurar Variables de Entorno (1 minuto)

1. Ir a: **Settings → Variables**
2. Añadir/Editar:
   - `TELEGRAM_BOT_TOKEN` = `123456789:ABCdefGHIjklMNOpqrSTUvwxyz`
   - `TELEGRAM_CHAT_ID` = `123456789`
   - `TELEGRAM_BOT_USERNAME` = `FrecuenciaGlobalCheckpointBot`
3. Guardar

## PASO 5: Probar en WF-004 (Notificación/Log)

1. Abrir workflow: **WF-004 — Notificación/Log**
2. Localizar nodo "Notificar Telegram" (o añadir si no existe)
3. Configurar nodo:
   - **Credential:** Seleccionar la credencial creada
   - **Chat ID:** `{{$vars.TELEGRAM_CHAT_ID}}`
   - **Text:** `📝 Log: {{$json.message}}`
4. Guardar workflow
5. Click: **Execute** (test manual)
6. Verificar mensaje recibido en Telegram

## ESTRUCTURA DE NOTIFICACIONES

### Eventos a notificar:
- ✅ Workflow completado exitosamente
- ❌ Workflow falló (con detalle de error)
- 📝 Checkpoint generado
- 📢 Pieza publicada en X/LinkedIn/IG
- ⚠️ Sesión de Chrome expirada (requiere login)

### Formato sugerido:
```
🤖 Frecuencia Global — {timestamp}

{icon} {evento}

Pieza: {pieza_id}
Estado: {status}
Detalle: {message}

🔗 Ver en n8n: https://frecuenciaglobal.app.n8n.cloud/workflow/{workflow_id}
```

## COMANDOS UTILES PARA EL BOT

**Opcional:** Configurar nodo "Telegram Trigger" para responder comandos:
- `/status` → Resumen de últimas ejecuciones
- `/checkpoint` → Forzar checkpoint manual
- `/publicar {pieza}` → Trigger publicación

## SEGURIDAD

⚠️ **IMPORTANTE:**
- El TOKEN es sensible — guardar en 1Password, no en archivos de texto
- Si el TOKEN se filtra, revocar en BotFather con `/revoke`
- El CHAT_ID es tu ID personal de Telegram — mantener privado

## ARCHIVOS RELACIONADOS

- Credencial n8n: `Telegram — Frecuencia Global Checkpoint`
- Variables n8n: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- Workflow: WF-004 (notificaciones), SUB-002 (sub-workflow reutilizable)

---

## CHECKLIST DE VERIFICACIÓN

- [ ] Bot creado con @BotFather
- [ ] Token guardado en lugar seguro
- [ ] Chat ID obtenido
- [ ] Credencial configurada en n8n Cloud
- [ ] Variables de entorno añadidas
- [ ] WF-004 modificado para usar Telegram
- [ ] Mensaje de prueba recibido en Telegram
- [ ] Comando `/status` configurado (opcional)

---

**Tiempo estimado:** 10-15 minutos  
**Próximo paso después de esto:** Configurar triggers GitHub webhooks
