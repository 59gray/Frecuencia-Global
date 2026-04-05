# Chrome Real + Sesiones Persistentes — Regla de Oro

**Fecha:** 2026-04-04  
**Estado:** Ahora regla obligatoria para todo script de browser automation

---

## Principio Fundamental

> **TODO script que use browser automation DEBE usar Chrome real con sesiones persistentes.**

**NO permitido:**
- ❌ Chrome headless sin perfil
- ❌ Perfiles temporales que se borran al cerrar
- ❌ Login manual en cada ejecución

**Obligatorio:**
- ✅ Chrome real (`headless=False`)
- ✅ Sesión persistente (directorio `.chrome-[plataforma]-stable/`)
- ✅ Login una sola vez, reusar indefinidamente

---

## Estructura de Sesiones

```
Frecuencia Global/
├── .chrome-x-stable/           ← Sesión X/Twitter (logueada @globalfrequency.es)
├── .chrome-linkedin-stable/    ← Sesión LinkedIn (logueada Company Page)
├── .chrome-ig-stable/          ← Sesión Instagram (logueada @globalfrequency.es)
├── .chrome-tk-stable/          ← Sesión TikTok (logueada @frecuenciaglobal)
├── .chrome-youtube-stable/     ← Sesión YouTube (logueada channel)
└── .chrome-rsscom/             ← Sesión RSS.com
```

---

## Scripts que Siguen Esta Regla

| Plataforma | Script | Sesión Usada |
|------------|--------|--------------|
| **X/Twitter** | `scripts/x_publish_post_persistente.py` | `.chrome-x-stable/` |
| **LinkedIn** | `scripts/linkedin_publish_post.py` | `.chrome-linkedin-stable/` |
| **Instagram** | `scripts/ig_publish_post.py` | `.chrome-ig-stable/` |
| **TikTok** | `scripts/tk_publish_post.py` | `.chrome-tk-stable/` |

---

## Template para Nuevos Scripts

```python
from playwright.sync_api import sync_playwright
from pathlib import Path

# Configuración obligatoria
CHROME_PROFILE_DIR = Path(__file__).parent.parent / ".chrome-[plataforma]-stable"
CHROME_EXE = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# Siempre usar persistent_context
with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context(
        user_data_dir=str(CHROME_PROFILE_DIR),
        headless=False,  # ← NUNCA headless
        executable_path=CHROME_EXE,
        args=["--start-maximized", "--no-first-run"],
        viewport=None,
        no_viewport=True,
    )
    # ... resto del script
```

---

## Mantenimiento de Sesiones

### Verificar estado de sesión
```bash
# Ver si existe sesión
ls .chrome-x-stable/Default/Cookies

# Si no existe o está vacío → Requiere login
python scripts/x_chrome_login.py
```

### Renovación de sesión (si expira)

**X/Twitter:**
```bash
python scripts/x_chrome_login.py
# Login manual en Chrome, cerrar ventana cuando termine
```

**LinkedIn:**
```bash
python scripts/linkedin_chrome_login.py
```

**Instagram:**
```bash
python scripts/ig_chrome_login.py
```

**TikTok:**
```bash
python scripts/tk_chrome_login.py
```

---

## Beneficios

1. **Sin APIs de pago** — No requiere créditos (X, TikTok, etc.)
2. **Sin rate limits** — Solo límites humanos de la plataforma
3. **Login único** — Una vez al mes o cuando expire
4. **100% funcional** — Igual que publicar manualmente

---

## Problemas Comunes

| Síntoma | Causa | Solución |
|---------|-------|----------|
| "No hay sesión activa" | Sesión expirada/borrada | Re-ejecutar `*_chrome_login.py` |
| "Chrome no encontrado" | Chrome no instalado | Instalar Chrome o ajustar ruta |
| "/login" en URL | Sesión inválida | Verificar cookies, posible 2FA requerido |

---

## Integración con n8n Cloud

**Opción A: Scripts locales + n8n orquesta**
- n8n Cloud genera contenido → GitHub
- Scripts locales leen GitHub → Publican
- Ventaja: Sin costos de API

**Opción B: Bridge webhook**
- n8n Cloud POST a webhook
- Webhook ejecuta scripts locales
- Más complejo pero automatizado 100%

**Recomendación:** Opción A para empezar.

---

## Checklist Antes de Publicar

- [ ] Sesión existe: `ls .chrome-[plataforma]-stable/`
- [ ] Cookies no vacías: `ls .chrome-[plataforma]-stable/Default/Cookies`
- [ ] Script usa `headless=False`
- [ ] Script apunta a sesión correcta
- [ ] Dry-run primero: `python script.py --pieza P1_001 --dry-run`

---

> **REGLA DE ORO:** Si el script abre Chrome y pide login, la sesión persistente no está funcionando. Detener y arreglar antes de continuar.
