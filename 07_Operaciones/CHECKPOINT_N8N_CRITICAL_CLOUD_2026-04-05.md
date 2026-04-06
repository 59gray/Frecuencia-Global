# CHECKPOINT N8N Critical Cloud Migration — 2026-04-05

**Fecha:** 2026-04-05  
**Fase:** Paso 2 — Migrar workflows críticos a n8n Cloud  
**Estado:** ✅ COMPLETADO

---

## Workflows Migrados

### SUB-002 — Notificar Telegram
| Propiedad | Valor |
|-----------|-------|
| **ID Cloud** | `oeydfg22aym5l0` |
| **Estado** | ✅ Activo y operativo |
| **Credenciales** | Usa variables `$vars.TELEGRAM_BOT_TOKEN` y `$vars.TELEGRAM_CHAT_ID` |
| **Notas** | No requiere credenciales n8n (HTTP directo a API Telegram) |

### WF-004 — Notificación y Log
| Propiedad | Valor |
|-----------|-------|
| **ID Cloud** | `gU1WpHnU2Jmf3Wgj` |
| **Estado** | ✅ Importado, pendiente activación manual |
| **Credenciales placeholder** | `V0SuupEfkzLlD5iJ` (FG GitHub Auth) |
| **Notas** | Placeholders asignados manualmente en UI n8n Cloud |

---

## Acciones Manuales en n8n Cloud UI

### 1. SUB-002 (ya operativo)
- ✅ Configurar variables de entorno:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
- ✅ Activar workflow

### 2. WF-004 (requiere configuración)
1. Abrir workflow `gU1WpHnU2Jmf3Wgj` en n8n Cloud
2. Reemplazar credencial placeholder en nodos:
   - `GitHub: GET Log` (línea 40 en JSON)
   - `GitHub: PUT Log` (línea 78 en JSON)
3. Asignar credencial real: **FG GitHub Auth**
4. Activar workflow

---

## Placeholders de Credenciales

> **IMPORTANTE:** Los placeholders en JSON se reemplazan **manualmente en la UI de n8n Cloud**, no en los archivos JSON.

| Placeholder | Nodo(s) afectados | Acción requerida |
|-------------|-------------------|------------------|
| `V0SuupEfkzLlD5iJ` | GitHub: GET Log, GitHub: PUT Log | Asignar credencial real "FG GitHub Auth" en UI |

---

## Variables de Entorno Requeridas

```bash
# GitHub (para WF-004)
GITHUB_OWNER=59gray
GITHUB_REPO=Frecuencia-Global
GITHUB_BRANCH=main

# Telegram (para SUB-002)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

---

## Estado del Sistema

| Componente | Estado |
|------------|--------|
| SUB-002 (Telegram) | ✅ Operativo |
| WF-004 (Log) | ⚠️ Configuración manual pendiente |
| Bridge local | ⚠️ URL dinámica (cloudflared) |
| Credenciales GitHub | ⚠️ Pendiente asignación en UI |

---

## Commit Sugerido

```bash
git add 08_n8n/workflows_cloud/WF-004_notificacion_log.json
git add 07_Operaciones/CHECKPOINT_N8N_CRITICAL_CLOUD_2026-04-05.md
git commit -m "chore(n8n): migrate critical workflows SUB-002 and WF-004 to cloud"
```

---

## Referencias

- `08_n8n/workflows_cloud/sub/SUB-002_notificar_telegram.json`
- `08_n8n/workflows_cloud/WF-004_notificacion_log.json`
- `08_n8n/CREDENCIALES_N8N_CLOUD.md`

---

**Validado por:** Sistema de Automatización FG  
**Próximo paso:** Paso 3 — Validar integración end-to-end
