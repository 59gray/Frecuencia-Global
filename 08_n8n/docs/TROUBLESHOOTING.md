# Troubleshooting — n8n Frecuencia Global

---

## Puerto 5678 ocupado

**Síntoma:** `docker compose up` falla con "port already in use"

**Solución:**
```bash
# Identificar proceso usando el puerto
netstat -ano | findstr :5678

# Opción A: matar el proceso
taskkill /PID <PID> /F

# Opción B: cambiar puerto en docker-compose.yml
ports:
  - "5679:5678"  # Cambiar 5679 al puerto que prefieras
```

---

## Volúmenes Docker sin permisos

**Síntoma:** n8n inicia pero no puede escribir archivos, error "EACCES: permission denied"

**Solución:**
```bash
# Revisar permisos del volumen
docker compose exec n8n ls -la /workspace

# Si los archivos son read-only, recrear el volumen
docker compose down -v
docker compose up -d
```

**En Windows:** Asegúrate de que Docker Desktop tiene acceso a la carpeta del workspace (Settings → Resources → File sharing).

---

## Webhook no responde

**Síntoma:** `curl` devuelve "Connection refused" o timeout

**Checklist:**
1. ¿n8n está corriendo? → `docker compose ps`
2. ¿El workflow está activo? → Verificar toggle en la UI
3. ¿La URL es correcta? → `http://localhost:5678/webhook/intake`
4. ¿Estás en modo test? → En modo test la URL es `/webhook-test/intake`

```bash
# Verificar que n8n responde
curl http://localhost:5678/healthz
# Debe devolver: {"status":"ok"}
```

---

## Telegram bot no envía mensajes

**Síntoma:** Workflows ejecutan sin error pero no llega notificación

**Checklist:**
1. ¿`.env` tiene `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`?
2. ¿Reiniciaste n8n después de cambiar `.env`? → `docker compose restart`
3. ¿Hablaste con el bot primero? (Telegram requiere que el usuario inicie la conversación)
4. ¿El chat_id es correcto?

```bash
# Probar manualmente
curl -X POST "https://api.telegram.org/bot<TU_TOKEN>/sendMessage" \
  -d "chat_id=<TU_CHAT_ID>&text=Test desde terminal"
```

**Nota:** SUB-002 está diseñado para fallar silenciosamente si Telegram no está configurado. Revisa los logs de ejecución en la UI de n8n para confirmar.

---

## Archivos no se escriben en el workspace

**Síntoma:** WF-001 o WF-003 responde OK pero no aparece el archivo

**Checklist:**
1. ¿El volumen está montado? → `docker compose exec n8n ls /workspace`
2. ¿Existe el directorio destino? → `docker compose exec n8n ls /workspace/03_Editorial/`
3. ¿Permisos del directorio? → Revisar que no sea read-only

```bash
# Test de escritura
docker compose exec n8n sh -c "echo test > /workspace/test_write.txt"
# Si funciona:
rm test_write.txt
```

---

## Workflow importado no aparece

**Síntoma:** Importaste un JSON pero no lo ves en la lista

**Solución:**
- Verifica que el JSON es válido: `python -m json.tool < workflow.json`
- Importa desde la UI: clic en "..." → "Import from File"
- Si importaste por API, refresca la página

---

## Error "Cannot find module 'fs'"

**Síntoma:** Nodo Code lanza error de módulo no encontrado

**Solución:** n8n necesita que `NODE_FUNCTION_ALLOW_BUILTIN` incluya `fs`:
```yaml
# En docker-compose.yml, ya configurado:
environment:
  - NODE_FUNCTION_ALLOW_BUILTIN=*
```

Si el error persiste, verifica que la variable está en el compose y reinicia: `docker compose restart`

---

## pipeline_tracker.json corrupto

**Síntoma:** WF-002 o WF-005 fallan con "Unexpected token"

**Solución:**
```bash
# Verificar JSON válido
python -m json.tool < 04_Produccion/pipeline_tracker.json

# Si está corrupto, restaurar desde git
git checkout -- 04_Produccion/pipeline_tracker.json

# Si no existe en git, crear vacío
echo "{}" > 04_Produccion/pipeline_tracker.json
```

---

## n8n no inicia después de update

**Síntoma:** Container se reinicia en loop

```bash
# Ver logs
docker compose logs n8n

# Solución habitual: recrear container sin borrar datos
docker compose down
docker compose pull
docker compose up -d
```

---

## Cómo ver logs de ejecución

1. **UI de n8n:** Cada workflow tiene pestaña "Executions" con historial completo
2. **Docker logs:** `docker compose logs -f n8n`
3. **Operations Log:** `07_Operaciones/FG_Operations_Log.md` (escrito por SUB-004)
