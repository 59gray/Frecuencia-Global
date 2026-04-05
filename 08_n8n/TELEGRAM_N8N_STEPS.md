# Configuración Telegram en n8n Cloud — PASOS EXACTOS

## ✅ LO QUE YA ESTÁ LISTO (No tocar)

| Componente | Estado | Detalle |
|------------|--------|---------|
| **WF-004** | ✅ Listo | Llama a SUB-002 para notificaciones |
| **SUB-002** | ✅ Listo | Recibe `$env.TELEGRAM_BOT_TOKEN` y `$env.TELEGRAM_CHAT_ID` |
| **Script validación** | ✅ Listo | `scripts/validate_telegram.py` |
| **Template config** | ✅ Listo | `08_n8n/.env.telegram` |

---

## 🎯 SOLO FALTA ESTO (10 minutos cuando tengas el token)

### Paso 1: Obtener TOKEN y CHAT_ID (5 min)

**En Telegram:**
1. Buscar @BotFather → /newbot
2. Nombre: `Frecuencia Global Checkpoint`
3. Username: `FrecuenciaGlobalCheckpointBot`
4. Copiar TOKEN (ej: `123456789:ABC...`)
5. Enviar mensaje a tu bot
6. Abrir: `https://api.telegram.org/bot<TOKEN>/getUpdates`
7. Buscar `"chat":{"id":123456789` → copiar número

**Validar localmente:**
```bash
python scripts/validate_telegram.py --token "TU_TOKEN" --auto-get-chat-id
```

---

### Paso 2: Configurar en n8n Cloud UI (3 min)

**Ir a:** https://frecuenciaglobal.app.n8n.cloud

**A. Variables de Entorno:**
1. Menu lateral → **Settings** → **Variables**
2. Click **Add Variable** (x3):

| Nombre | Valor | Tipo |
|--------|-------|------|
| `TELEGRAM_BOT_TOKEN` | `123456789:ABC...` | String |
| `TELEGRAM_CHAT_ID` | `123456789` | String |
| `TELEGRAM_BOT_USERNAME` | `FrecuenciaGlobalCheckpointBot` | String |

3. **Save** cada una

**B. (Opcional) Credencial Telegram API:**
1. Settings → **Credentials** → **Add Credential**
2. Buscar: **Telegram**
3. Type: **Telegram API**
4. Bot Token: `{{$vars.TELEGRAM_BOT_TOKEN}}`
5. Save as: `Telegram — FG Checkpoint`

*Nota: SUB-002 usa variables directamente, la credencial es opcional.*

---

### Paso 3: Probar (2 min)

**Opción A: Via n8n UI**
1. Abrir **WF-004 — Notificación y Log**
2. Click **Execute Workflow**
3. Input JSON:
   ```json
   {
     "evento": "TEST",
     "pieza": "P1_001",
     "detalles": "Prueba de configuración Telegram",
     "timestamp": "2026-04-04T20:30:00Z"
   }
   ```
4. Click **Run**
5. Verificar mensaje en Telegram

**Opción B: Via curl**
```bash
curl -X POST https://api.telegram.org/bot<TOKEN>/sendMessage \
  -d "chat_id=<CHAT_ID>" \
  -d "text=🧪 Test manual de Telegram"
```

---

## 📋 CHECKLIST POST-CONFIGURACIÓN

- [ ] Variables `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` en n8n Cloud
- [ ] Mensaje de prueba recibido en Telegram
- [ ] WF-004 ejecutado sin errores (ver Execution Log en n8n)
- [ ] Borrar `.env.telegram` local (contiene datos sensibles)
- [ ] Documentar en próximo checkpoint que Telegram está operativo

---

## 🔄 FLUJO DE FUNCIONAMIENTO (Así funciona)

```
[Workflow Principal] 
    ↓ (llama)
[WF-004 Notificación/Log]
    ↓ (formatea mensaje)
    ↓ (llama con $json.mensaje)
[SUB-002 Notificar Telegram]
    ↓ (lee variables de entorno)
    ↓ (verifica config válida)
    ↓ (HTTP POST a api.telegram.org)
[Tu Teléfono] 📱
```

**Variables usadas por SUB-002:**
- `$env.TELEGRAM_BOT_TOKEN` → Bot token
- `$env.TELEGRAM_CHAT_ID` → Tu chat ID personal

**Si variables no están configuradas:**
- SUB-002 hace `console.log()` y continúa sin error
- No se envía mensaje pero workflow no falla

---

## 🛡️ SEGURIDAD

⚠️ **El TOKEN es sensible:**
- Guardar en 1Password / password manager
- NO dejar en archivos de texto
- Revocar en BotFather (`/revoke`) si se filtra
- Solo tú debes tener acceso al bot

---

## 📁 ARCHIVOS PREPARADOS

| Archivo | Propósito |
|---------|-----------|
| `scripts/validate_telegram.py` | Validar token y chat ID localmente |
| `08_n8n/.env.telegram` | Template de variables (completar y borrar) |
| `08_n8n/CONFIGURAR_TELEGRAM.md` | Guía completa de configuración |
| Este archivo | Pasos exactos para n8n Cloud UI |

---

**Tiempo total estimado:** 10-15 minutos (cuando tengas el token)

**Próximo paso después de esto:** Configurar GitHub Webhooks para triggers automáticos
