# SECRETS_STATUS.md
## Estado de Secretos y Tokens — Frecuencia Global

**Documento operativo.** Actualizar tras cada cambio de credenciales.
**Regla:** NUNCA commitear valores reales. Solo registrar existencia y ubicacion.
**Preflight:** `python scripts/preflight.py --verbose`

---

## Tabla Maestra de Secretos

| Plataforma | Script principal | Secreto | Fuente de carga | Autocarga soportada | Estado | Ultima validacion |
|---|---|---|---|---|---|---|
| Threads | threads_publish_post.py | THREADS_ACCESS_TOKEN | env / .env.local | Si | VALIDADO | 2026-04-05 |
| Threads | threads_publish_post.py | THREADS_USER_ID | env / .env.local | Si (opcional) | VALIDADO | 2026-04-05 |
| Gemini (assets) | gemini_api_generate.py | GEMINI_API_KEY | env / .env.local | Si | LOCAL_ONLY | 2026-04-05 |
| Instagram (API) | ig_api_publish.py | IG_ACCESS_TOKEN | env / .env.local | Si (opcional) | PENDING | 2026-04-05 |
| Instagram (API) | ig_api_publish.py | IG_USER_ID | env / .env.local | Si (opcional) | PENDING | 2026-04-05 |
| Instagram (browser) | ig_publish_post.py | — (Chrome profile) | .chrome-ig-stable/ | N/A | VALIDADO | 2026-04-05 |
| X (browser) | x_publish_post.py | — (Chrome profile) | .chrome-x-stable/ | N/A | VALIDADO | 2026-04-05 |
| YouTube | youtube_channel_api_config.py | token.json + client_secret.json | scripts/ (archivos) | N/A (OAuth file) | VALIDADO | 2026-04-05 |
| Website | — | — | — | N/A | VALIDADO | 2026-04-05 |
| Telegram (monitor) | monitor_domain.py | TELEGRAM_BOT_TOKEN | env / .env.local | Si (opcional) | LOCAL_ONLY | 2026-04-05 |
| Telegram (monitor) | monitor_domain.py | TELEGRAM_CHAT_ID | env / .env.local | Si (opcional) | LOCAL_ONLY | 2026-04-05 |
| LinkedIn | linkedin_publish_post.py | — | — | N/A | BLOQUEADO_EXTERNO | 2026-04-05 |
| TikTok | tk_publish_post.py | — | — | N/A | CONGELADO | 2026-04-05 |

---

## Patron de Autocarga

Todos los scripts Python usan `scripts/utils/__init__.py` con el siguiente patron:

1. `os.getenv(KEY)` — variable ya en el entorno
2. Fallback: `load_env_local()` carga `.env.local` desde raiz del proyecto
3. Si sigue faltando: error claro con instrucciones

Funciones disponibles:
- `get_required_secret(key)` — falla si no existe
- `get_optional_secret(key, default)` — retorna default si no existe
- `load_env_local()` — carga masiva

---

## Archivos Clave

| Archivo | Proposito | Commiteable |
|---|---|---|
| .env.local | Valores reales de secretos | NO |
| .env.local.example | Template con claves vacias | Si |
| .env.example | Template legacy (referencia) | Si |
| scripts/utils/__init__.py | Utilidad centralizada de carga | Si |
| scripts/load_local_secrets.ps1 | Carga en sesion PowerShell | Si |
| scripts/check_required_secrets.ps1 | Validacion rapida PS1 | Si |
| scripts/preflight.py | Preflight check completo | Si |
| scripts/token.json | OAuth YouTube | NO |
| scripts/client_secret.json | OAuth YouTube (app config) | NO |

---

## Checklist de Configuracion Local

1. Copiar `.env.local.example` a `.env.local`
2. Completar THREADS_ACCESS_TOKEN con valor real
3. Completar GEMINI_API_KEY si se usara generacion de assets
4. Ejecutar: `python scripts/preflight.py --verbose`
5. Dry-run de Threads: `python scripts/threads_publish_post.py --pieza P1_001 --dry-run`

---

## Historial de Cambios

| Fecha | Accion | Detalle |
|---|---|---|
| 2026-04-05 | Creacion inicial | Documento basico con THREADS_ACCESS_TOKEN |
| 2026-04-05 | Hardening | Autocarga estandarizada, preflight, tabla completa |
