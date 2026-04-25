# WINDSURF_SECURE_ZONE_INVENTORY

> **Inventario seguro de zonas sensibles - NO leídas, solo detectadas**  
> **Fecha:** 2026-04-25  
> **Generado por:** Windsurf Agent (sin acceso a contenido)  
> **Política:** Documentar existencia, NO inspeccionar contenido
> **✅ Creado inventario seguro de zonas sensibles:**
> - `WINDSURF_SECURE_ZONE_INVENTORY.md` — 19 zonas detectadas: 15 perfiles Chrome + 1 archivo .env + 2 contextos de agentes (.claude/.cursor) + 1 zona no-versionada (07_Operaciones) SIN leer contenido

---

## RESUMEN EJECUTIVO

Este documento registra zonas sensibles detectadas en el proyecto Frecuencia Global sin acceder a su contenido. Sirve como:
- **Inventario de riesgos** para auditorías de seguridad
- **Guía de no-tocar** para operaciones futuras
- **Mapa de dependencias** que requieren autorización explícita

---

## ZONAS SENSIBLES DETECTADAS

### 1. Archivos .env

| Ruta | Tipo | Tamaño | Última modificación | Razón de no-tocar |
|------|------|--------|---------------------|-------------------|
| `08_n8n/.env` | Archivo | 94 bytes | 2026-04-20 | Contiene tokens API, credenciales n8n |

**Variables inferidas desde documentación:**
- NOTION_TOKEN
- NOTION_DB_PIECES_ID / NOTION_DB_PIEZAS_ID
- NOTION_DB_FUENTES_ID
- NOTION_DB_ASSETS_ID
- NOTION_DB_INCIDENCIAS_ID
- N8N_WEBHOOK_URL, N8N_BASIC_AUTH_*
- TELEGRAM_BOT_TOKEN (para observabilidad)
- Posibles: X_API_*, META_ACCESS_TOKEN, BUFFER_ACCESS_TOKEN, etc.

**Acción segura recomendada:**
- ✅ Documentar en `.env.example` (variables sin valores)
- ✅ Referenciar en procedimientos manuales
- ❌ NO abrir/ leer/ copiar contenido
- ❌ NO versionar en Git
- ❌ NO transferir a Windsurf/ otros agentes

---

### 2. Perfiles de Navegador Chrome (.chrome-*)

| Ruta | Tipo | Última modificación | Propósito inferido | Razón de no-tocar |
|------|------|---------------------|-------------------|-------------------|
| `.chrome-gemini-stable/` | Directorio | 2026-04-18 | Perfil Gemini / Google | Cookies, tokens OAuth |
| `.chrome-ig-stable/` | Directorio | 2026-04-18 | Perfil Instagram | Sessiones activas |
| `.chrome-linkedin-stable/` | Directorio | 2026-04-18 | Perfil LinkedIn | Sessiones activas |
| `.chrome-n8n-cdp/` | Directorio | 2026-04-20 | Chrome DevTools Protocol para n8n | Configuración CDP |
| `.chrome-n8n-cloud/` | Directorio | 2026-04-20 | n8n cloud automation | Tokens n8n cloud |
| `.chrome-n8n-cloud-copy/` | Directorio | 2026-04-20 | Backup n8n cloud | Tokens n8n cloud |
| `.chrome-probe/` | Directorio | 2026-04-20 | Probing/ testing | Sessiones de prueba |
| `.chrome-probe-2/` | Directorio | 2026-04-20 | Probing/ testing alternativo | Sessiones de prueba |
| `.chrome-rsscom/` | Directorio | 2026-04-20 | RSS.com integration | Tokens RSS.com |
| `.chrome-tiktok-manual/` | Directorio | 2026-04-20 | TikTok manual operations | Sessiones TikTok |
| `.chrome-tiktok-stable/` | Directorio | 2026-04-18 | TikTok automation | Tokens TikTok |
| `.chrome-tk-stable/` | Directorio | 2026-04-20 | TikTok alternativo | Tokens TikTok |
| `.chrome-x-stable/` | Directorio | 2026-04-18 | X / Twitter operations | Tokens X API |
| `.chrome-youtube-profile/` | Directorio | 2026-04-20 | YouTube operations | Tokens YouTube |
| `.chrome-youtube-stable/` | Directorio | 2026-04-18 | YouTube automation | Tokens YouTube API |

**Contenido típico (NO verificado):**
- `Cookies` / `Network Persistent State`
- `Login Data` (credenciales guardadas)
- `Web Data` (autofill, history)
- `Preferences` (configuración de perfil)
- Extensiones instaladas y sus datos

**Acción segura recomendada:**
- ✅ Documentar existencia en este inventario
- ✅ Referenciar en procedimientos de rotación de tokens
- ❌ NO abrir/ copiar/ modificar
- ❌ NO usar para automatización sin autorización
- ❌ NO transferir a otros agentes/ entornos

---

### 3. Contexto Histórico de Agentes IA

| Ruta | Tipo | Última modificación | Propósito inferido | Razón de no-tocar |
|------|------|---------------------|-------------------|-------------------|
| `.claude/` | Directorio | 2026-04-12 | Contexto Claude Desktop/ Web | Historial de conversaciones, memoria |
| `.cursor/` | Directorio | 2026-04-20 | Contexto Cursor IDE | Historial de chats, contexto de proyecto |

**Contenido típico (NO verificado):**
- Historial de conversaciones con Claude
- Archivos de contexto de Cursor
- Preferencias de usuario para IA
- Memoria/ embeddings de conversaciones previas

**Acción segura recomendada:**
- ✅ Documentar existencia
- ✅ Respetar privacidad de sesiones previas
- ❌ NO acceder/ leer/ copiar
- ❌ NO usar para "recuperar" contexto de Claude/ Cursor
- ❌ NO versionar en Git

---

## BACKUPS MANUALES REALIZADOS

| Fecha | Ruta origen | Archivos respaldados | Ubicación backup | Alcance |
|-------|-------------|----------------------|------------------|---------|
| 2026-04-25 11:50 | `07_Operaciones/` | 6 archivos WINDSURF_*.md | `07_Operaciones/.backups/` | Archivos creados en Día 1 |

**Lista de archivos respaldados:**
1. `WINDSURF_BOOTSTRAP_SNAPSHOT_20260425.md`
2. `WINDSURF_CONTEXT_FG.md`
3. `WINDSURF_TOOLING_PARITY.md`
4. `WINDSURF_14_DAY_SPRINT.md`
5. `WINDSURF_DAILY_LOG.md`
6. `WINDSURF_HANDOFF_TO_USER.md`

**Nota:** Backup realizado porque el proyecto NO es repositorio Git. Cualquier modificación futura requiere backup manual previo.

---

## TABLA DE ZONAS / AMENAZAS / OPORTUNIDADES / ACCIONES / ESTADO

| Zona | Amenaza | Oportunidad | Acción segura | Estado |
|------|---------|-------------|---------------|--------|
| **08_n8n/.env** | Exposición de tokens API; acceso no autorizado a Notion, n8n, Telegram | Template para nuevas configuraciones limpias | Crear `.env.example` con variables documentadas (SIN valores); referenciar en procedimientos manuales | 🔴 BLOQUEADO - Contenido NO leído |
| **.chrome-gemini-stable/** | Compromiso de credenciales Google/ Gemini | Reconocimiento de dependencia con servicios Google | Documentar en inventario; rotación de tokens si se sospecha compromiso | 🔴 BLOQUEADO - Contenido NO accedido |
| **.chrome-ig-stable/** | Compromiso de cuenta Instagram | Identificación de canal activo de plataforma | Documentar; verificar si es cuenta business/ personal | 🔴 BLOQUEADO - Contenido NO accedido |
| **.chrome-linkedin-stable/** | Compromiso de credenciales LinkedIn | Identificación de canal B2B activo | Documentar; evaluar Community Management API vs personal | 🔴 BLOQUEADO - Contenido NO accedido |
| **.chrome-n8n-cdp/** | Exposición de configuración CDP | Documentación de arquitectura n8n local | Referenciar en `N8N_WORKFLOW_INVENTORY.md` (Día 5) | 🔴 BLOQUEADO - Contenido NO accedido |
| **.chrome-n8n-cloud/** | Exposición de credenciales n8n cloud | Identificación de instancia cloud usada | Documentar dualidad local/cloud; procedimiento de failover | 🔴 BLOQUEADO - Contenido NO accedido |
| **.chrome-n8n-cloud-copy/** | Exposición de credenciales n8n cloud (copia) | Identificación de instancia cloud backup | Documentar dualidad; procedimiento de failover/restore | 🔴 BLOQUEADO - Contenido NO accedido |
| **.chrome-tiktok-manual/** | Compromiso de sesión TikTok | Diferenciación manual vs automation | Documentar estrategia multi-canal; sandbox vs producción | 🔴 BLOQUEADO - Contenido NO accedido |
| **.chrome-tk-stable/** | Compromiso de sesión TikTok alternativo | Identificación de canal TikTok adicional | Documentar estrategia multi-canal; verificar si redundancia o testing | 🔴 BLOQUEADO - Contenido NO accedido |
| **.chrome-tiktok-stable/** | Compromiso de token TikTok API | Identificación de canal video corto activo | Documentar; verificar estado de API access (sandbox vs prod) | 🔴 BLOQUEADO - Contenido NO accedido |
| **.chrome-x-stable/** | Compromiso de API keys X (Twitter) | Identificación de canal texto primario | Documentar; evaluar limitaciones de API tier actual | 🔴 BLOQUEADO - Contenido NO accedido |
| **.chrome-youtube-profile/** | Compromiso de cuenta YouTube | Identificación de canal video largo primario | Documentar en `YOUTUBE_Operations/`; verificar brand account vs personal | 🔴 BLOQUEADO - Contenido NO accedido |
| **.chrome-youtube-stable/** | Exposición de tokens YouTube Data API | Confirmación de uso de API oficial (no solo web) | Documentar; preparar rotación de API key si necesario | 🔴 BLOQUEADO - Contenido NO accedido |
| **.chrome-probe/** **.chrome-probe-2/** | Exposición de credenciales de testing | Identificación de entorno de pruebas | Documentar separación prod/test; procedimiento de CI/CD | 🔴 BLOQUEADO - Contenido NO accedido |
| **.chrome-rsscom/** | Exposición de token RSS.com | Identificación de hosting podcast | Documentar en EP_001/EP_002; feed URL | 🔴 BLOQUEADO - Contenido NO accedido |
| **.claude/** | Exposición de historial privado de conversaciones | Respeto a sesiones previas de usuario | Documentar; NO usar como fuente de contexto para Windsurf | 🔴 BLOQUEADO - Contenido NO accedido |
| **.cursor/** | Exposición de contexto de desarrollo previo | Respeto a trabajo previo en Cursor | Documentar; NO recuperar archivos/ configuración desde aquí | 🔴 BLOQUEADO - Contenido NO accedido |
| **07_Operaciones/ (modificada)** | Pérdida de documentación creada por no ser repo Git | Oportunidad de implementar backups manuales sistemáticos | Crear `.backups/`; copiar archivos antes de edición; documentar en manifiesto | 🟡 GESTIONADO - Backup creado 2026-04-25 |

---

## RIESGO OPERATIVO ACUMULADO

| Categoría | Número de zonas | Riesgo máximo | Mitigación aplicada |
|-----------|-----------------|---------------|---------------------|
| .env files | 1 | 🔴 CRÍTICO | Documentado, NO leído, ejemplo creado |
| Chrome profiles | 15 | 🔴 CRÍTICO | Inventariados (16 líneas tabla), NO accedidos |
| Agent context (.claude, .cursor) | 2 | 🟡 MEDIO | Documentado, privacidad respetada |
| Carpetas sin Git | 1 (07_Operaciones) | 🟡 MEDIO | Backup manual implementado |
| **TOTAL** | **19** | — | Todas documentadas, ninguna accedida |

**Riesgo residual:** Las credenciales existen en el filesystem. Acceso físico al equipo = compromiso potencial. Mitigación: cifrado de disco, acceso controlado al workspace.

---

## PROCEDIMIENTO DE ROTACIÓN DE TOKENS (Si se requiere)

Si se sospecha que alguna zona sensible fue comprometida:

1. **Notion:**
   - Ir a notion.so/my-integrations
   - Revocar token existente
   - Crear nueva integración
   - Actualizar `08_n8n/.env` (manual, por Farid)
   - Verificar conexión en n8n local

2. **X (Twitter):**
   - Ir a developer.twitter.com
   - Regenerar API keys
   - Actualizar en `.chrome-x-stable/` (manual)
   - Test con post de prueba

3. **YouTube:**
   - Ir a Google Cloud Console
   - Credenciales > API Keys > Regenerar
   - Actualizar en `.chrome-youtube-stable/`
   - Verificar en `EP_001/EP_002`

4. **n8n:**
   - Ir a n8n.io/account
   - Regenerar API keys si aplica
   - Actualizar `08_n8n/.env`
   - Reiniciar instancia local

**Nota:** Toda rotación debe hacerse manualmente por Farid. Windsurf NO toca `.env` ni perfiles de navegador.

---

## EVIDENCIA DE NO-ACCESO

Comandos usados para detección (NO lectura de contenido):

```powershell
# Detección de zonas sensibles (solo nombres, NO contenido)
Get-ChildItem "C:\Users\farid\Documents\Frecuencia Global" -Force | 
  Where-Object { $_.Name -match '^\.env$|^\.chrome-|^\.claude$|^\.cursor$' } |
  Select-Object FullName, LastWriteTime, @{N='Size';E={$_.Length}}

# Verificación existencia .env específico (SIN leer)
Test-Path "C:\Users\farid\Documents\Frecuencia Global\08_n8n\.env" -PathType Leaf
# Resultado: True (existe, NO leído)
```

**Hash de verificación de integridad:**
- `.env.example` creado desde cero con variables inferidas de documentación pública
- Ningún valor copiado desde `.env` real
- Fecha de generación: 2026-04-25

---

## PRÓXIMAS ACCIONES RECOMENDADAS

| Prioridad | Acción | Responsable | Plazo |
|-------------|--------|-------------|-------|
| Alta | Revisar `.env.example` y completar variables adicionales inferidas desde otros scripts | Farid | Día 2-3 |
| Media | Evaluar si `.chrome-*` perfiles están activos o pueden archivarse | Farid | Día 7-10 |
| Media | Considerar migración a gestor de secrets (1Password, Bitwarden, etc.) | Farid | Post-sprint |
| Baja | Implementar copias de seguridad automatizadas de `07_Operaciones/` | Farid | Post-sprint |

---

## INSTRUCCIONES DE RESTAURACIÓN DESDE BACKUP

### Ubicación del backup
```
07_Operaciones/.backups/
├── BACKUP_MANIFEST_20260425.txt  (este archivo - registro de backup)
├── WINDSURF_BOOTSTRAP_SNAPSHOT_20260425.md  (11.38 KB)
├── WINDSURF_CONTEXT_FG.md  (9.34 KB)
├── WINDSURF_14_DAY_SPRINT.md  (14.74 KB)
├── WINDSURF_DAILY_LOG.md  (3.96 KB)
├── WINDSURF_HANDOFF_TO_USER.md  (6.75 KB)
└── WINDSURF_TOOLING_PARITY.md  (7.09 KB)
```

### Hashes SHA256 para verificación
| Archivo | SHA256 |
|---------|--------|
| WINDSURF_BOOTSTRAP_SNAPSHOT_20260425.md | `E5DCC45CBACC74E15ED6D1407B09871360F585E2C6357D021671AE4047345939` |
| WINDSURF_CONTEXT_FG.md | `8966557785E0A6CC92A75EF1DD649D468A873CFE9A3E3C263ECEC35A88CE3E88` |
| WINDSURF_TOOLING_PARITY.md | `EBF7EFD16D5FF43ECC0C076ECADD5B21B59F93BF7028B158A857C006C2398FB8` |
| WINDSURF_14_DAY_SPRINT.md | `4DEBB34119912F3D922BCE93B9966F39DDBFABD403C1EB14602DA2A2CA2C235B` |
| WINDSURF_DAILY_LOG.md | `566864D2EA07CCB4FDC27B3036232A184A9F8B26BE65A38A214202334D28DA68` |
| WINDSURF_HANDOFF_TO_USER.md | `4B9E140928D913328994BE3E7797DA7170314069FEC2F07F5F711F96A803D6BC` |
| BACKUP_MANIFEST_20260425.txt | `C0771A6331A93F8CB24D9F69B9EF88B6CDD39BA5EEB345381E20A74FB95BF184` |

### Restauración manual (PowerShell)

#### Opción 1: Restaurar archivo individual
```powershell
cd "C:\Users\farid\Documents\Frecuencia Global"
Copy-Item "07_Operaciones/.backups/WINDSURF_CONTEXT_FG.md" `
          "07_Operaciones/WINDSURF_CONTEXT_FG.md" -Force
```

#### Opción 2: Restaurar todos los archivos
```powershell
cd "C:\Users\farid\Documents\Frecuencia Global"
Get-ChildItem "07_Operaciones/.backups/WINDSURF_*.md" | ForEach-Object {
    Copy-Item $_.FullName "07_Operaciones/$($_.Name)" -Force
}
```

#### Opción 3: Verificación de integridad antes de restaurar
```powershell
cd "C:\Users\farid\Documents\Frecuencia Global"
$backupHash = Get-FileHash "07_Operaciones/.backups/WINDSURF_CONTEXT_FG.md" SHA256
Write-Host "Backup hash: $($backupHash.Hash)"
# Comparar con tabla arriba: debe ser 8966557785E0A6CC92A75EF1DD649D468A873CFE9A3E3C263ECEC35A88CE3E88
```

#### Opción 4: Restauración con verificación post-copia
```powershell
cd "C:\Users\farid\Documents\Frecuencia Global"
$source = "07_Operaciones/.backups/WINDSURF_CONTEXT_FG.md"
$target = "07_Operaciones/WINDSURF_CONTEXT_FG.md"

# Verificar hash antes
echo "Hash backup:"
Get-FileHash $source SHA256

# Copiar
Copy-Item $source $target -Force

# Verificar hash después
echo "Hash restaurado:"
Get-FileHash $target SHA256
# Deben coincidir
```

### Cuándo restaurar
- **Corruptción de archivo:** Si un .md se corrompe o se edita accidentalmente
- **Pérdida de archivo:** Si se borra sin querer
- **Reversión de cambios:** Para volver a versión del Día 1
- **Auditoría:** Para verificar estado inicial del sprint

### Nota importante
> **Este backup es INDEPENDIENTE de Git.** El proyecto NO es repositorio Git.
> Cualquier modificación futura en 07_Operaciones/ debe hacer backup PREVIO
> siguiendo la regla documentada en `.windsurf/rules`.

---

**Documento vivo:** Se actualiza si se detectan nuevas zonas sensibles  
**Próxima revisión:** Día 5 (inventario n8n) o si se detectan nuevas zonas  
**Autoridad:** `WINDSURF_BOOTSTRAP_SNAPSHOT_20260425.md` y este documento
