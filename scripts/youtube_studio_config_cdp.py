"""Configura YouTube Studio via CDP: descripción, channel settings y upload defaults."""
from playwright.sync_api import sync_playwright
import subprocess
import time
import urllib.request
import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from fg_automation_config import (
    INSTAGRAM_PROFILE_URL,
    LINKEDIN_COMPANY_URL,
    TIKTOK_PROFILE_URL,
    WEBSITE_URL,
    X_PROFILE_URL,
    chrome_executable,
    chrome_profile_dir,
    repo_path,
    token_path,
)

# ── Constantes ──────────────────────────────────────────────────────────────
DEFAULT_CHANNEL_ID = "UCFZYwZwkDD6oUPacaLo7PvQ"
CDP_URL = "http://127.0.0.1:9222"
CDP_VERSION_URL = f"{CDP_URL}/json/version"
CHROME_EXE = str(chrome_executable())
CHROME_PROFILE_DIR = str(chrome_profile_dir("youtube-stable"))
CHROME_PROFILE_NAME = "Default"
YOUTUBE_STUDIO_ROOT = "https://studio.youtube.com/"
BASE_DIR = str(repo_path())
TOKEN_PATH = str(token_path())
SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]


def resolve_channel_id_from_token() -> str:
    if not os.path.exists(TOKEN_PATH):
        return DEFAULT_CHANNEL_ID

    try:
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
        youtube = build("youtube", "v3", credentials=creds)
        response = youtube.channels().list(mine=True, part="id").execute()
        items = response.get("items", [])
        if not items:
            return DEFAULT_CHANNEL_ID
        return items[0]["id"]
    except Exception:
        return DEFAULT_CHANNEL_ID


CHANNEL_ID = resolve_channel_id_from_token()

# URLs
CUSTOMIZATION_BASICINFO_URL = f"https://studio.youtube.com/channel/{CHANNEL_ID}/customization/basicinfo"
SETTINGS_CHANNEL_URL = f"https://studio.youtube.com/channel/{CHANNEL_ID}/settings"

# Datos a configurar
CONTACT_EMAIL = "frecuenciag@outlook.com"
SOCIAL_LINKS = [
    {"title": "Website", "url": WEBSITE_URL},
    {"title": "Instagram", "url": INSTAGRAM_PROFILE_URL},
    {"title": "TikTok", "url": TIKTOK_PROFILE_URL},
    {"title": "X (Twitter)", "url": X_PROFILE_URL},
    {"title": "LinkedIn", "url": LINKEDIN_COMPANY_URL},
]
UPLOAD_TAGS = "Frecuencia Global,geopolítica,análisis internacional,relaciones internacionales"
UPLOAD_CATEGORY = "News & Politics"   # category id = 25 en YouTube
UPLOAD_CATEGORY_INDEX = 25

# ── Datos pendientes ────────────────────────────────────────────────────────
CHANNEL_DESCRIPTION = (
    "Análisis internacional con pulso electrónico 🎧⚡\n\n"
    "Traducimos la geopolítica y la actualidad global en contenido accesible, "
    "dinámico y culturalmente relevante — con la energía de la música electrónica "
    "como diferenciador visual y narrativo.\n\n"
    "📡 Geopolitik Drop · Bass & Borders · Behind the Policy\n\n"
    "Nuevo video cada semana.\n\n"
    "📩 Contacto: frecuenciag@outlook.com\n"
    "🔗 Instagram: @globalfrequency.es\n"
    "🔗 TikTok: @frecuenciaglobal\n"
    "🔗 X: @frec_global"
)

CHANNEL_KEYWORDS = (
    "Frecuencia Global,geopolítica,análisis internacional,"
    "relaciones internacionales,actualidad global,política internacional,"
    "geopolitik,noticias internacionales,análisis geopolítico"
)

CHANNEL_COUNTRY = "Mexico"  # YouTube uses English country names internally

UPLOAD_DEFAULT_DESCRIPTION = (
    "📡 Frecuencia Global — Análisis internacional con pulso electrónico\n\n"
    "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n"
    "🔔 Suscríbete y activa la campana para no perderte ningún análisis.\n\n"
    "📲 Síguenos:\n"
    "→ Instagram: https://www.instagram.com/globalfrequency.es\n"
    f"→ TikTok: {TIKTOK_PROFILE_URL}\n"
    "→ X: https://x.com/frec_global\n"
    "→ LinkedIn: https://www.linkedin.com/company/frecuencia-global\n\n"
    "📩 Contacto: frecuenciag@outlook.com\n\n"
    "#FrecuenciaGlobal #Geopolítica #AnálisisInternacional"
)


# ── Helpers CDP ──────────────────────────────────────────────────────────────

# Normalizacion 2026-04-02: dejar copy y defaults alineados con el sistema actual.
UPLOAD_TAGS = "Frecuencia Global,geopolitica,analisis internacional,relaciones internacionales,news and politics"

CHANNEL_DESCRIPTION = (
    "Frecuencia Global - analisis internacional con pulso electronico.\n\n"
    "Geopolitica, cultura y poder traducidos a formatos accesibles, visuales y consistentes.\n\n"
    "Series: Geopolitik Drop, Bass & Borders, Frecuencia Global, Behind the Policy.\n\n"
    f"Website: {WEBSITE_URL}\n"
    f"Instagram: {INSTAGRAM_PROFILE_URL}\n"
    f"TikTok: {TIKTOK_PROFILE_URL}\n"
    f"X: {X_PROFILE_URL}\n"
    f"LinkedIn: {LINKEDIN_COMPANY_URL}\n\n"
    "Contacto: frecuenciag@outlook.com"
)

CHANNEL_KEYWORDS = (
    "Frecuencia Global,geopolitica,analisis internacional,"
    "relaciones internacionales,actualidad global,politica internacional,"
    "geopolitik,noticias internacionales,analisis geopolitico,"
    "bass and borders,behind the policy"
)

UPLOAD_DEFAULT_DESCRIPTION = (
    "Frecuencia Global - analisis internacional con pulso electronico\n\n"
    f"Website: {WEBSITE_URL}\n"
    f"Instagram: {INSTAGRAM_PROFILE_URL}\n"
    f"TikTok: {TIKTOK_PROFILE_URL}\n"
    f"X: {X_PROFILE_URL}\n"
    f"LinkedIn: {LINKEDIN_COMPANY_URL}\n\n"
    "Contacto: frecuenciag@outlook.com\n\n"
    "#FrecuenciaGlobal #Geopolitica #AnalisisInternacional"
)

def cdp_is_ready() -> bool:
    try:
        with urllib.request.urlopen(CDP_VERSION_URL, timeout=2) as response:
            return response.status == 200
    except Exception:
        return False


def start_chrome_debug() -> None:
    os.makedirs(CHROME_PROFILE_DIR, exist_ok=True)
    cmd = [
        CHROME_EXE,
        "--remote-debugging-port=9222",
        f"--user-data-dir={CHROME_PROFILE_DIR}",
        f"--profile-directory={CHROME_PROFILE_NAME}",
        f"https://studio.youtube.com/channel/{CHANNEL_ID}",
    ]
    subprocess.Popen(cmd)


def is_visible(page, text: str) -> bool:
    try:
        return page.get_by_text(text, exact=False).first.is_visible(timeout=1500)
    except Exception:
        return False


def dismiss_dialogs_and_overlays(page) -> None:
    try:
        page.evaluate("""() => {
            const dialogs = document.querySelectorAll('ytcp-dialog, tp-yt-paper-dialog, [role="dialog"]');
            dialogs.forEach(d => {
                if (d.offsetParent !== null) {
                    const closeBtn = d.querySelector('[aria-label="Close"], [aria-label="Cerrar"], .close-button, ytcp-icon-button');
                    if (closeBtn) closeBtn.click();
                    if (d.close) d.close();
                    d.style.display = 'none';
                }
            });
            document.querySelectorAll('tp-yt-iron-overlay-backdrop').forEach(el => el.remove());
            document.querySelectorAll('.overlay, [class*="backdrop"]').forEach(el => {
                if (el.style) el.style.display = 'none';
            });
        }""")
        time.sleep(0.8)
    except Exception as e:
        print(f"  dismiss_dialogs: {e}")


def nuke_beforeunload(page) -> None:
    """Elimina todos los beforeunload listeners y previene que se registren nuevos.
    Esto evita el diálogo 'Reload site? Changes you made may not be saved.'"""
    try:
        page.evaluate("""() => {
            // Limpiar handler directo
            window.onbeforeunload = null;
            // Monkey-patch addEventListener para bloquear futuros beforeunload
            if (!window.__origAddEventListener) {
                window.__origAddEventListener = window.addEventListener.bind(window);
                window.addEventListener = function(type, fn, opts) {
                    if (type === 'beforeunload') return;
                    return window.__origAddEventListener(type, fn, opts);
                };
            }
        }""")
    except Exception:
        pass


def retry_studio_error(page, target_url: str, max_attempts: int = 5) -> bool:
    """Maneja el error 'Oops, something went wrong' de Studio con reintentos."""
    for attempt in range(1, max_attempts + 1):
        # Detectar pantalla de error
        try:
            oops = page.get_by_text("something went wrong", exact=False).first
            if oops.is_visible(timeout=1500):
                print(f"  Error de Studio detectado (intento {attempt}). Reintentando desde root...")
                # Ir al root de Studio primero
                nuke_beforeunload(page)
                page.goto(YOUTUBE_STUDIO_ROOT, wait_until="domcontentloaded")
                try:
                    page.wait_for_load_state("networkidle", timeout=12000)
                except Exception:
                    pass
                time.sleep(5)
                # Volver a intentar la URL objetivo
                dismiss_dialogs_and_overlays(page)
                nuke_beforeunload(page)
                page.goto(target_url, wait_until="domcontentloaded")
                try:
                    page.wait_for_load_state("networkidle", timeout=15000)
                except Exception:
                    pass
                time.sleep(6)
                continue
        except Exception:
            pass

        # Verificar si cargó correctamente
        current = page.url
        if any(seg in current for seg in ["customization", "settings", "editing"]):
            # Verificar que no hay error en la página
            try:
                has_error = page.get_by_text("something went wrong", exact=False).first.is_visible(timeout=1500)
                if not has_error:
                    return True
            except Exception:
                return True

        if attempt < max_attempts:
            time.sleep(3)

    return False


def wait_for_state(page, url: str, max_retries: int = 4) -> bool:
    """Navega a una URL con reintentos y validacion de error de Studio."""
    # Primero ir al root de Studio para establecer sesion
    current = page.url
    if "studio.youtube.com" not in current:
        print("  Estableciendo sesion en Studio root...")
        page.goto(YOUTUBE_STUDIO_ROOT, wait_until="domcontentloaded")
        try:
            page.wait_for_load_state("networkidle", timeout=14000)
        except Exception:
            pass
        time.sleep(5)

    for attempt in range(1, max_retries + 1):
        print(f"  [{attempt}/{max_retries}] Navegando a: {url}")
        dismiss_dialogs_and_overlays(page)
        nuke_beforeunload(page)
        page.goto(url, wait_until="domcontentloaded")
        try:
            page.wait_for_load_state("networkidle", timeout=15000)
        except Exception:
            pass
        time.sleep(6)

        # Manejar error transitorio
        ok = retry_studio_error(page, url)
        if ok:
            print(f"  Listo: {page.url}")
            return True

        current = page.url
        if any(seg in current for seg in ["customization", "settings", "editing"]):
            print(f"  Listo: {current}")
            return True

        print(f"  Redirigido a: {current}")

    return False


def safe_click(page, selector: str, label: str = "", timeout: int = 5000) -> bool:
    try:
        el = page.locator(selector).first
        el.wait_for(state="visible", timeout=timeout)
        el.click(timeout=timeout)
        print(f"  ✓ Click en: {label or selector}")
        return True
    except Exception as e:
        print(f"  ✗ No se pudo hacer click en {label or selector}: {e}")
        return False


def safe_fill(page, selector: str, value: str, label: str = "", timeout: int = 5000) -> bool:
    try:
        el = page.locator(selector).first
        el.wait_for(state="visible", timeout=timeout)
        el.click(timeout=timeout)
        el.clear()
        el.fill(value)
        print(f"  ✓ Campo llenado: {label or selector} → '{value[:40]}'")
        return True
    except Exception as e:
        print(f"  ✗ No se pudo llenar {label or selector}: {e}")
        return False


def click_save(page) -> bool:
    """Intenta hacer clic en el botton Guardar / Publish."""
    save_selectors = [
        'ytcp-button[test-id="save-button"]',
        'ytcp-button:has-text("Guardar")',
        'ytcp-button:has-text("Save")',
        'ytcp-button:has-text("Publish")',
        'ytcp-button:has-text("Publicar")',
        'button:has-text("Guardar")',
        'button:has-text("Save")',
    ]
    for sel in save_selectors:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=2000) and not el.is_disabled():
                el.click(timeout=4000)
                print(f"  ✓ Click en guardar: {sel}")
                time.sleep(4)
                return True
        except Exception:
            continue
    print("  ✗ Botón de guardar no encontrado.")
    return False


# ── Navegación vía sidebar (SPA routing) ────────────────────────────────────

def navigate_to_profile(page) -> bool:
    """Navega a Customization > Profile via sidebar click (más fiable que URL directa)."""
    current = page.url

    # Si ya estamos en profile, no hay que hacer nada
    if "/editing/profile" in current:
        print(f"  Ya en profile: {current}")
        return True

    # Primero ir al dashboard para tener el sidebar visible
    studio_url = f"https://studio.youtube.com/channel/{CHANNEL_ID}"
    if CHANNEL_ID not in current or "/editing/" in current or "/settings" in current:
        print(f"  Navegando a Studio dashboard...")
        nuke_beforeunload(page)
        page.goto(studio_url, wait_until="domcontentloaded", timeout=30000)
        try:
            page.wait_for_load_state("networkidle", timeout=12000)
        except Exception:
            pass
        time.sleep(4)

    # Click en "Customization" en el sidebar
    print("  Clickeando Customization en sidebar...")
    # Esperar a que el sidebar se renderice completamente
    time.sleep(2)
    customization_selectors = [
        '#menu-item-7',  # Customization (confirmado via diagnóstico DOM)
        'a[href*="editing"]',
        'a:has-text("Customization")',
        'a:has-text("Personalización")',
    ]
    clicked = False
    for sel in customization_selectors:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=5000):
                el.click(timeout=5000)
                print(f"  ✓ Click sidebar: {sel}")
                clicked = True
                time.sleep(4)
                break
        except Exception as e:
            print(f"    selector {sel}: {e}")
            continue

    if not clicked:
        # Fallback: click via JavaScript
        print("  Selectors fallaron. Intentando click via JS...")
        try:
            js_result = page.evaluate("""() => {
                const a = document.querySelector('#menu-item-7') ||
                          document.querySelector('a[href*="editing"]');
                if (a) { a.click(); return {ok: true, href: a.href, id: a.id}; }
                return {ok: false};
            }""")
            if js_result and js_result.get("ok"):
                print(f"  ✓ Click via JS: {js_result}")
                clicked = True
                time.sleep(4)
            else:
                print(f"  ✗ JS click falló: {js_result}")
        except Exception as e:
            print(f"  ✗ JS click error: {e}")

    # Esperar a que la SPA redirija a /editing/
    if clicked:
        try:
            page.wait_for_url("**/editing/**", timeout=8000)
        except Exception:
            pass
        time.sleep(2)

    # Si el sidebar click no cambió la URL (SPA no reaccionó al click), usar goto directo
    url = page.url
    if "/editing/" not in url and "/customization" not in url:
        print(f"  Click en sidebar no navegó (URL: {url}). Usando goto directo...")
        profile_url = f"https://studio.youtube.com/channel/{CHANNEL_ID}/editing/profile"
        nuke_beforeunload(page)
        try:
            page.goto(profile_url, wait_until="domcontentloaded", timeout=30000)
        except Exception:
            pass
        try:
            page.wait_for_load_state("networkidle", timeout=12000)
        except Exception:
            pass
        time.sleep(4)

    # Ahora deberíamos estar en /editing/ — verificar si estamos en Profile o Home tab
    url = page.url
    print(f"  URL tras click sidebar: {url}")

    if "/editing/" not in url and "/customization" not in url:
        print(f"  ✗ No se llegó a Customization. URL: {url}")
        return False

    # Si estamos en basicinfo (Home), clickear el tab "Profile"
    if "/editing/profile" not in url:
        print("  Clickeando tab 'Profile'...")
        profile_tab_selectors = [
            'tp-yt-paper-tab:has-text("Profile")',
            'tp-yt-paper-tab:has-text("Perfil")',
            'paper-tab:has-text("Profile")',
            'div[role="tab"]:has-text("Profile")',
            'div[role="tab"]:has-text("Perfil")',
        ]
        for sel in profile_tab_selectors:
            try:
                el = page.locator(sel).first
                if el.is_visible(timeout=3000):
                    el.click(timeout=3000)
                    print(f"  ✓ Tab Profile clickeado: {sel}")
                    time.sleep(3)
                    break
            except Exception:
                continue

    try:
        page.wait_for_load_state("networkidle", timeout=8000)
    except Exception:
        pass
    time.sleep(2)
    nuke_beforeunload(page)

    url = page.url
    print(f"  URL actual: {url}")
    return "/editing/profile" in url or "/editing/" in url or "/customization" in url


# ── Tareas de configuración ──────────────────────────────────────────────────

_FILL_JS = """
([placeholder_text, value, row_index]) => {
    const inputs = [...document.querySelectorAll('input')];
    const targets = inputs.filter(i =>
        i.placeholder && i.placeholder.includes(placeholder_text) &&
        i.offsetParent !== null && !i.readOnly && !i.disabled
    );
    const idx = (row_index !== undefined && row_index !== null) ? row_index : targets.length - 1;
    const el = targets[idx];
    if (!el) return {ok: false, total: targets.length, requestedIdx: idx};
    try {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setter.call(el, value);
    } catch(e) { el.value = value; }
    el.focus();
    el.dispatchEvent(new Event('focus', {bubbles: true}));
    el.dispatchEvent(new Event('input', {bubbles: true}));
    el.dispatchEvent(new Event('change', {bubbles: true}));
    el.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true}));
    return {ok: true, value: el.value, placeholder: el.placeholder, idx: idx};
}
"""

_ADD_LINK_SELECTORS = [
    'ytcp-button:has-text("Add link")',
    'button:has-text("Add link")',
    'ytcp-button:has-text("Agregar enlace")',
    'button[aria-label="Add link"]',
]


def task1_add_channel_links(page) -> None:
    """Agrega links sociales en Customization > Profile (/editing/profile)."""
    print("\n[TAREA 1] Agregando links sociales al canal...")

    if not navigate_to_profile(page):
        print("  ✗ No se pudo navegar a /editing/profile. Saltando tarea.")
        return

    dismiss_dialogs_and_overlays(page)
    time.sleep(2)

    # Contar filas URL existentes
    existing_rows = page.evaluate(
        "() => document.querySelectorAll('input[placeholder=\"Enter a URL\"]').length"
    )
    print(f"  Filas URL detectadas en página: {existing_rows}")
    # Si ya hay filas suficientes, no agregar más (solo actualizar valores)
    need_new_rows = max(0, len(SOCIAL_LINKS) - existing_rows)
    print(f"  Filas nuevas necesarias: {need_new_rows}")

    links_added = 0
    for i, link_data in enumerate(SOCIAL_LINKS):
        title = link_data["title"]
        link_url = link_data["url"]
        print(f"\n  [{i+1}/{len(SOCIAL_LINKS)}] {title} → {link_url}")

        # Si no hay fila disponible para este índice, crear una nueva
        if i >= existing_rows:
            clicked_add = False
            for sel in _ADD_LINK_SELECTORS:
                try:
                    btns = page.locator(sel)
                    if btns.count() > 0:
                        btns.first.scroll_into_view_if_needed(timeout=4000)
                        btns.first.click(timeout=4000)
                        clicked_add = True
                        print(f"    ✓ Click 'Add link' via: {sel}")
                        time.sleep(2.5)
                        break
                except Exception:
                    continue
            if not clicked_add:
                print(f"    ✗ Botón 'Add link' no encontrado. Saltando {title}.")
                continue

        # Llenar URL via JS con índice de fila (Playwright locator falla en este SPA Angular)
        url_result = page.evaluate(_FILL_JS, ["Enter a URL", link_url, i])
        if url_result and url_result.get("ok"):
            print(f"    ✓ URL[{i}]: {url_result.get('value')}")
        else:
            print(f"    ✗ URL no llenada (row {i}, {url_result}). Saltando.")
            continue

        time.sleep(0.5)

        # Llenar título via JS con índice de fila
        title_result = page.evaluate(_FILL_JS, ["Enter a title", title, i])
        if title_result and title_result.get("ok"):
            print(f"    ✓ Título[{i}]: {title_result.get('value')}")
        else:
            print(f"    ✗ Título no llenado (row {i}, {title_result})")

        links_added += 1
        time.sleep(1.0)

    if links_added > 0:
        print(f"\n  {links_added} links preparados. Se guardarán con el email (Tarea 2).")
    else:
        print("  ✗ No se pudieron agregar links. Verificar manualmente UI de Studio.")


def task2_set_contact_email(page) -> None:
    """Configura email de contacto en Customization > Profile (/editing/profile).
    
    El campo #business-email está en la misma página de Profile, por lo que
    si task1 ya navegó ahí, continuamos en la misma página. Si no, navegamos de nuevo.
    """
    print("\n[TAREA 2] Configurando email de contacto del canal...")

    # Verificar que seguimos en /editing/profile, si no, navegar
    if "/editing/profile" not in page.url and "/customization" not in page.url:
        print("  Navegando de nuevo a /editing/profile...")
        if not navigate_to_profile(page):
            print("  ✗ No se pudo navegar a /editing/profile. Saltando tarea.")
            return
    else:
        print(f"  Ya en página de perfil: {page.url}")

    time.sleep(2)
    dismiss_dialogs_and_overlays(page)

    # Llenar email de negocio via JS (mismo enfoque que links)
    email_result = page.evaluate(_FILL_JS, ["Email address", CONTACT_EMAIL])
    if email_result and email_result.get("ok"):
        print(f"  ✓ Email llenado: {email_result.get('value')}")
    else:
        # Fallback: intentar con selector #business-email
        try:
            el = page.locator('#business-email input').first
            el.scroll_into_view_if_needed(timeout=4000)
            el.triple_click(timeout=3000)
            el.fill(CONTACT_EMAIL)
            print(f"  ✓ Email llenado via fallback selector: {CONTACT_EMAIL}")
        except Exception as e:
            print(f"  ✗ Campo de email no encontrado ({e}). Verificar manualmente.")
            return

    time.sleep(0.5)

    # Publicar con el botón Publish/Save de la página de perfil
    print("  Publicando cambios (links + email)...")
    publish_selectors = [
        'ytcp-button:has-text("Publish")',
        'ytcp-button:has-text("Publicar")',
        'button:has-text("Publish")',
        'button:has-text("Publicar")',
        'ytcp-button:has-text("Save")',
        'ytcp-button:has-text("Guardar")',
        'button[aria-label="Publish"]',
    ]
    published = False
    for sel in publish_selectors:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=2000) and not el.is_disabled():
                el.scroll_into_view_if_needed(timeout=3000)
                el.click(timeout=4000)
                published = True
                print(f"  ✓ Publicado via: {sel}")
                time.sleep(4)
                break
        except Exception:
            continue

    if not published:
        print("  ✗ Botón de publicar no encontrado. Los cambios podrían no haberse guardado.")


def task3_set_channel_description(page) -> None:
    """Configura la descripción del canal en Customization > Profile."""
    print("\n[TAREA 3] Configurando descripción del canal...")

    if not navigate_to_profile(page):
        print("  ✗ No se pudo navegar a /editing/profile. Saltando tarea.")
        return

    dismiss_dialogs_and_overlays(page)
    time.sleep(3)

    # Scroll down para exponer el campo de descripción (debajo de Name y Handle)
    page.evaluate("window.scrollTo(0, 800)")
    time.sleep(2)

    # El campo podría ser un textarea, contenteditable div, o un
    # componente web (ytcp-social-suggestions-textbox, iron-autogrow-textarea).
    desc_selectors = [
        '#description-container textarea',
        '#description-container [contenteditable="true"]',
        'textarea[aria-label*="description" i]',
        'textarea[aria-label*="descripción" i]',
        '#description-wrapper textarea',
        'ytcp-social-suggestions-textbox textarea',
        'ytcp-social-suggestions-textbox [contenteditable="true"]',
        'iron-autogrow-textarea textarea',
        '#description textarea',
    ]
    filled = False
    for sel in desc_selectors:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=3000):
                el.scroll_into_view_if_needed(timeout=3000)
                el.click(timeout=3000)
                time.sleep(0.5)
                el.fill("")
                time.sleep(0.3)
                el.fill(CHANNEL_DESCRIPTION)
                print(f"  ✓ Descripción llenada ({len(CHANNEL_DESCRIPTION)} chars) via {sel}")
                filled = True
                break
        except Exception:
            continue

    if not filled:
        # Fallback: JS que busca CUALQUIER textarea o contenteditable visible
        print("  Intentando detección JS ampliada...")
        try:
            result = page.evaluate("""(desc) => {
                // 1. Try textareas
                const textareas = [...document.querySelectorAll('textarea')];
                for (const t of textareas) {
                    if (t.offsetParent === null) continue;
                    // Skip tiny textareas (e.g. search bars)
                    if (t.offsetHeight < 40) continue;
                    const setter = Object.getOwnPropertyDescriptor(
                        HTMLTextAreaElement.prototype, 'value').set;
                    setter.call(t, desc);
                    t.dispatchEvent(new Event('input', {bubbles: true}));
                    t.dispatchEvent(new Event('change', {bubbles: true}));
                    return {ok: true, method: 'textarea', id: t.id};
                }
                // 2. Try contenteditable divs
                const editables = [...document.querySelectorAll('[contenteditable="true"]')];
                for (const e of editables) {
                    if (e.offsetParent === null) continue;
                    if (e.offsetHeight < 40) continue;
                    e.focus();
                    e.textContent = desc;
                    e.dispatchEvent(new Event('input', {bubbles: true}));
                    return {ok: true, method: 'contenteditable'};
                }
                return {
                    ok: false,
                    textareas: textareas.length,
                    editables: editables.length,
                    bodyText: document.body?.innerText?.substring(0, 200)
                };
            }""", CHANNEL_DESCRIPTION)
            if result and result.get("ok"):
                print(f"  ✓ Descripción llenada via JS ({result.get('method')})")
                filled = True
            else:
                print(f"  ✗ Descripción no encontrada: {result}")
        except Exception as e:
            print(f"  ✗ Error JS descripción: {e}")    

    if filled:
        time.sleep(1)
        # Publicar
        print("  Publicando descripción...")
        publish_selectors = [
            'ytcp-button:has-text("Publish")',
            'ytcp-button:has-text("Publicar")',
            'ytcp-button:has-text("Save")',
            'ytcp-button:has-text("Guardar")',
        ]
        for sel in publish_selectors:
            try:
                el = page.locator(sel).first
                if el.is_visible(timeout=2000) and not el.is_disabled():
                    el.click(timeout=4000)
                    print(f"  ✓ Publicado via: {sel}")
                    time.sleep(4)
                    break
            except Exception:
                continue


def _open_settings_dialog(page) -> bool:
    """Navega a Studio root y abre el diálogo de Settings. Retorna True si se abrió."""
    # Si el dialog ya está abierto, cerrar primero para limpiar estado
    try:
        close_btn = page.locator('#cancel-button').first
        if close_btn.is_visible(timeout=1000):
            close_btn.click(timeout=3000)
            time.sleep(2)
    except Exception:
        pass

    # Navegar a Studio dashboard para acceder al sidebar
    studio_url = f"https://studio.youtube.com/channel/{CHANNEL_ID}"
    print("  Navegando a Studio dashboard...")
    nuke_beforeunload(page)
    page.goto(studio_url, wait_until="domcontentloaded", timeout=30000)
    try:
        page.wait_for_load_state("networkidle", timeout=12000)
    except Exception:
        pass
    time.sleep(4)
    nuke_beforeunload(page)

    # Click en Settings en el sidebar
    print("  Abriendo Settings...")
    try:
        settings_el = page.locator('#settings-item').first
        settings_el.wait_for(state="visible", timeout=8000)
        settings_el.click(timeout=5000)
        time.sleep(3)
    except Exception as e:
        print(f"  ✗ No se pudo abrir Settings: {e}")
        return False

    # Verificar que se abrió — usar IDs específicos del dialog de Settings
    # (hay múltiples tp-yt-paper-dialog en el DOM; el primero puede estar oculto)
    dialog_checks = [
        'ytcp-dialog#settings-dialog',
        '#dialog-title',
        'ytcp-settings-dialog',
        'ytcp-navigation',
    ]
    for dialog_sel in dialog_checks:
        try:
            el = page.locator(dialog_sel).first
            if el.is_visible(timeout=4000):
                print(f"  ✓ Settings dialog abierto ({dialog_sel})")
                return True
        except Exception:
            continue

    print("  ✗ Settings dialog no apareció.")
    return False


def _click_settings_tab(page, tab_names: list) -> bool:
    """Click en un tab del Settings dialog. tab_names = lista de textos posibles."""
    # Buscar dentro del ytcp-navigation del dialog de Settings
    for name in tab_names:
        try:
            el = page.locator(f'ytcp-navigation >> text="{name}"').first
            if el.is_visible(timeout=2000):
                el.click(timeout=3000)
                time.sleep(2)
                print(f"  ✓ Tab clickeado: {name}")
                return True
        except Exception:
            continue
    # Fallback: buscar texto directo en el dialog
    for name in tab_names:
        try:
            el = page.locator(f'ytcp-settings-dialog >> text="{name}"').first
            if el.is_visible(timeout=2000):
                el.click(timeout=3000)
                time.sleep(2)
                print(f"  ✓ Tab clickeado (dialog): {name}")
                return True
        except Exception:
            continue
    print(f"  ✗ Tab no encontrado: {tab_names}")
    return False


def _save_settings_dialog(page) -> bool:
    """Click en Save dentro del settings dialog."""
    time.sleep(1)
    # Usar el ID #submit-button descubierto via diagnóstico DOM
    save_selectors = [
        '#submit-button',
        'ytcp-settings-dialog #submit-button',
        'ytcp-settings-dialog ytcp-button:has-text("Save")',
        'ytcp-settings-dialog ytcp-button:has-text("Guardar")',
    ]
    for sel in save_selectors:
        try:
            el = page.locator(sel).last  # usar .last por si hay multiples
            if el.is_visible(timeout=3000) and not el.is_disabled():
                el.click(timeout=4000)
                print(f"  ✓ Settings guardados via {sel}")
                time.sleep(5)
                return True
        except Exception:
            continue
    print("  ✗ Botón Save no encontrado en dialog.")
    return False


def task4_channel_settings(page) -> None:
    """Configura Settings > Channel: país, keywords, audience."""
    print("\n[TAREA 4] Configurando Channel Settings (país, keywords, audience)...")

    if not _open_settings_dialog(page):
        return

    # Click en tab "Channel"
    if not _click_settings_tab(page, ["Channel", "Canal"]):
        print("  ✗ Tab 'Channel' no encontrado.")
        return

    # Sub-tab: Basic info (suele estar por defecto)
    _click_settings_tab(page, ["Basic info", "Información básica"])
    time.sleep(1)

    # ── Country / País ──
    print(f"  Configurando país: {CHANNEL_COUNTRY}...")
    country_selectors = [
        'ytcp-dropdown-trigger[formcontrolname="country"]',
        'ytcp-dropdown-trigger:has-text("Country")',
        'ytcp-dropdown-trigger:has-text("País")',
        '#country-container ytcp-dropdown-trigger',
    ]
    for sel in country_selectors:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=3000):
                el.scroll_into_view_if_needed(timeout=3000)
                el.click(timeout=3000)
                time.sleep(1.5)
                # Buscar "Mexico" en el listbox — puede necesitar typing para filtrar
                option_selectors = [
                    f'tp-yt-paper-item:has-text("{CHANNEL_COUNTRY}")',
                    f'ytcp-ve:has-text("{CHANNEL_COUNTRY}")',
                    f'tp-yt-paper-item:has-text("México")',
                ]
                for opt_sel in option_selectors:
                    try:
                        opt = page.locator(opt_sel).first
                        if opt.is_visible(timeout=3000):
                            opt.click(timeout=3000)
                            print(f"  ✓ País: {CHANNEL_COUNTRY}")
                            time.sleep(1)
                            break
                    except Exception:
                        continue
                break
        except Exception:
            continue

    # ── Keywords ──
    print(f"  Configurando keywords del canal...")
    kw_selectors = [
        '#keywords-container input',
        'input[formcontrolname="keywords"]',
        'input[aria-label*="keyword" i]',
        'input[aria-label*="palabra" i]',
        '#keywords input',
    ]
    for sel in kw_selectors:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=3000):
                el.scroll_into_view_if_needed(timeout=3000)
                el.click(timeout=3000)
                el.fill("")
                time.sleep(0.3)
                el.fill(CHANNEL_KEYWORDS)
                print(f"  ✓ Keywords llenados ({len(CHANNEL_KEYWORDS)} chars)")
                time.sleep(0.5)
                break
        except Exception:
            continue

    # ── Sub-tab: Advanced settings (para Audience) ──
    print("  Navegando a Advanced settings...")
    _click_settings_tab(page, ["Advanced settings", "Configuración avanzada", "Advanced"])
    time.sleep(1)

    # ── Audience: "No, it's not made for kids" ──
    print("  Configurando audience: No, it's not made for kids...")
    not_kids_selectors = [
        'tp-yt-paper-radio-button:has-text("No, it\'s not")',
        'tp-yt-paper-radio-button:has-text("No, no está")',
        '#not-made-for-kids-radio',
        'input[value="NOT_MADE_FOR_KIDS"]',
        'tp-yt-paper-radio-button:has-text("not made for kids")',
    ]
    for sel in not_kids_selectors:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=3000):
                el.scroll_into_view_if_needed(timeout=3000)
                el.click(timeout=3000)
                print(f"  ✓ Audience: Not made for kids")
                time.sleep(1)
                break
        except Exception:
            continue

    _save_settings_dialog(page)


def task5_upload_defaults(page) -> None:
    """Configura Settings > Upload defaults: tags, categoría, licencia, idioma, descripción."""
    print("\n[TAREA 5] Configurando Upload Defaults...")

    if not _open_settings_dialog(page):
        return

    # Click en tab "Upload defaults"
    if not _click_settings_tab(page, ["Upload defaults", "Valores predeterminados", "Default uploads"]):
        print("  ✗ Tab 'Upload defaults' no encontrado.")
        return

    # ── Description template ──
    print("  Configurando descripción por defecto...")

    # Scroll dentro del dialog para asegurar visibilidad
    try:
        page.evaluate("""() => {
            const dialog = document.querySelector('ytcp-settings-dialog');
            if (dialog) {
                const scrollable = dialog.querySelector('.scrollable-content, [class*="scrollable"], .dialog-body');
                if (scrollable) scrollable.scrollTop = 0;
            }
        }""")
        time.sleep(0.5)
    except Exception:
        pass

    # Selectores scoped al dialog de Settings
    desc_selectors = [
        'ytcp-settings-dialog #description-container textarea',
        'ytcp-settings-dialog textarea[aria-label*="description" i]',
        'ytcp-settings-dialog textarea[aria-label*="descripción" i]',
        'ytcp-settings-dialog #description-wrapper textarea',
        'ytcp-settings-dialog ytcp-social-suggestions-textbox textarea',
        'ytcp-settings-dialog ytcp-social-suggestions-textbox [contenteditable="true"]',
        'ytcp-settings-dialog iron-autogrow-textarea textarea',
        'ytcp-settings-dialog #description textarea',
        'ytcp-settings-dialog [contenteditable="true"]',
        # Sin scope (fallback)
        '#description-container textarea',
        'ytcp-social-suggestions-textbox textarea',
        'ytcp-social-suggestions-textbox [contenteditable="true"]',
    ]
    desc_filled = False
    for sel in desc_selectors:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=2000):
                el.scroll_into_view_if_needed(timeout=3000)
                el.click(timeout=3000)
                time.sleep(0.5)
                # Para contenteditable, necesitamos usar textContent
                tag = el.evaluate("e => e.tagName.toLowerCase()")
                is_editable = el.evaluate("e => e.contentEditable === 'true'")
                if tag == 'textarea':
                    el.fill("")
                    time.sleep(0.3)
                    el.fill(UPLOAD_DEFAULT_DESCRIPTION)
                elif is_editable:
                    el.evaluate("(e, text) => { e.textContent = text; e.dispatchEvent(new Event('input', {bubbles:true})); }", UPLOAD_DEFAULT_DESCRIPTION)
                else:
                    el.fill(UPLOAD_DEFAULT_DESCRIPTION)
                print(f"  ✓ Descripción por defecto llenada via {sel}")
                desc_filled = True
                time.sleep(0.5)
                break
        except Exception:
            continue

    if not desc_filled:
        # Fallback JS: buscar dentro del dialog cualquier textarea/editable visible
        print("  Intentando JS fallback para descripción en dialog...")
        try:
            result = page.evaluate("""(desc) => {
                const dialog = document.querySelector('ytcp-settings-dialog');
                if (!dialog) return {ok: false, reason: 'no dialog'};
                
                // 1. Textareas dentro del dialog
                const textareas = [...dialog.querySelectorAll('textarea')];
                for (const t of textareas) {
                    if (t.offsetParent === null) continue;
                    if (t.offsetHeight < 30) continue;
                    const setter = Object.getOwnPropertyDescriptor(
                        HTMLTextAreaElement.prototype, 'value').set;
                    setter.call(t, desc);
                    t.dispatchEvent(new Event('input', {bubbles: true}));
                    t.dispatchEvent(new Event('change', {bubbles: true}));
                    return {ok: true, method: 'textarea', id: t.id, h: t.offsetHeight};
                }
                // 2. Contenteditable divs
                const editables = [...dialog.querySelectorAll('[contenteditable="true"]')];
                for (const e of editables) {
                    if (e.offsetParent === null) continue;
                    if (e.offsetHeight < 30) continue;
                    e.focus();
                    e.textContent = desc;
                    e.dispatchEvent(new Event('input', {bubbles: true}));
                    return {ok: true, method: 'contenteditable', h: e.offsetHeight};
                }
                return {
                    ok: false,
                    textareas: textareas.length,
                    visibleTextareas: textareas.filter(t => t.offsetParent !== null).length,
                    editables: editables.length,
                    visibleEditables: editables.filter(e => e.offsetParent !== null).length,
                };
            }""", UPLOAD_DEFAULT_DESCRIPTION)
            if result and result.get("ok"):
                print(f"  ✓ Descripción por defecto via JS ({result.get('method')}, h={result.get('h')})")
                desc_filled = True
            else:
                print(f"  ✗ Descripción upload no encontrada: {result}")
        except Exception as e:
            print(f"  ✗ Error JS descripción upload: {e}")

    # ── Tags ──
    print(f"  Configurando tags: {UPLOAD_TAGS[:50]}...")
    tags_selectors = [
        'ytcp-free-text-chip-bar textarea',
        'ytcp-chip-bar textarea',
        'textarea[aria-label*="tag" i]',
        'input[aria-label*="tag" i]',
        '#tags-input textarea',
    ]
    for sel in tags_selectors:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=3000):
                el.scroll_into_view_if_needed(timeout=3000)
                el.click()
                current = el.input_value() or ""
                if UPLOAD_TAGS not in current:
                    el.fill(UPLOAD_TAGS)
                print(f"  ✓ Tags llenados")
                time.sleep(0.5)
                break
        except Exception:
            continue

    # ── Advanced settings sub-tab (category, license, language) ──
    print("  Navegando a Advanced settings del upload defaults...")
    _click_settings_tab(page, ["Advanced settings", "Configuración avanzada", "Advanced"])
    time.sleep(1)

    # ── Categoría: News & Politics ──
    print("  Configurando categoría: News & Politics...")
    category_selectors = [
        'ytcp-dropdown-trigger[formcontrolname="categoryId"]',
        'ytcp-dropdown-trigger:has-text("Category")',
        'ytcp-dropdown-trigger:has-text("Categoría")',
        '#category-container ytcp-dropdown-trigger',
    ]
    for sel in category_selectors:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=3000):
                el.scroll_into_view_if_needed(timeout=3000)
                el.click(timeout=3000)
                time.sleep(1.5)
                for opt_sel in [
                    'tp-yt-paper-item:has-text("News & Politics")',
                    'tp-yt-paper-item:has-text("Noticias y política")',
                    'tp-yt-paper-item:has-text("Noticias")',
                    '[data-value="25"]',
                ]:
                    try:
                        opt = page.locator(opt_sel).first
                        if opt.is_visible(timeout=2000):
                            opt.click(timeout=3000)
                            print("  ✓ Categoría: News & Politics")
                            time.sleep(1)
                            break
                    except Exception:
                        continue
                break
        except Exception:
            continue

    # ── Licencia: Standard YouTube License ──
    print("  Configurando licencia...")
    license_selectors = [
        'ytcp-dropdown-trigger[formcontrolname="license"]',
        'ytcp-dropdown-trigger:has-text("License")',
        'ytcp-dropdown-trigger:has-text("Licencia")',
    ]
    for sel in license_selectors:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=3000):
                el.scroll_into_view_if_needed(timeout=3000)
                el.click(timeout=3000)
                time.sleep(1.5)
                for opt_sel in [
                    'tp-yt-paper-item:has-text("Standard YouTube")',
                    'tp-yt-paper-item:has-text("YouTube estándar")',
                ]:
                    try:
                        opt = page.locator(opt_sel).first
                        if opt.is_visible(timeout=2000):
                            opt.click(timeout=3000)
                            print("  ✓ Licencia: Standard YouTube License")
                            time.sleep(1)
                            break
                    except Exception:
                        continue
                break
        except Exception:
            continue

    # ── Idioma: Español ──
    print("  Configurando idioma: Español...")
    lang_selectors = [
        'ytcp-dropdown-trigger[formcontrolname="language"]',
        'ytcp-dropdown-trigger:has-text("Language")',
        'ytcp-dropdown-trigger:has-text("Idioma")',
        '#language-container ytcp-dropdown-trigger',
    ]
    for sel in lang_selectors:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=3000):
                el.scroll_into_view_if_needed(timeout=3000)
                el.click(timeout=3000)
                time.sleep(1.5)
                for opt_sel in [
                    'tp-yt-paper-item:has-text("Spanish")',
                    'tp-yt-paper-item:has-text("Español")',
                ]:
                    try:
                        opt = page.locator(opt_sel).first
                        if opt.is_visible(timeout=3000):
                            opt.click(timeout=3000)
                            print("  ✓ Idioma: Español")
                            time.sleep(1)
                            break
                    except Exception:
                        continue
                break
        except Exception:
            continue

    _save_settings_dialog(page)


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    print("=" * 60)
    print("  Frecuencia Global — Configuración Studio via CDP")
    print("=" * 60)

    # Iniciar Chrome si no está corriendo
    if not cdp_is_ready():
        print("\nIniciando Chrome con debug port 9222...")
        start_chrome_debug()
        for i in range(30):
            time.sleep(1)
            if cdp_is_ready():
                print(f"Chrome listo tras {i+1}s.")
                break
        else:
            raise RuntimeError("Chrome no respondió en el debug port después de 30s.")
    else:
        print("Chrome con CDP ya está corriendo.")

    with sync_playwright() as pw:
        browser = pw.chromium.connect_over_cdp(CDP_URL)
        ctx = browser.contexts[0]
        page = ctx.pages[0] if ctx.pages else ctx.new_page()

        # ── Estrategia anti-"Reload site?" en 3 capas ──────────────────────
        # Capa 1: init_script — se inyecta ANTES de que Angular cargue en cada
        #         navegación, bloqueando beforeunload en el origen.
        ctx.add_init_script("""
            Object.defineProperty(window, 'onbeforeunload', {
                get: function() { return null; },
                set: function(fn) { /* bloqueado */ },
                configurable: true
            });
            const _origAEL = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, fn, opts) {
                if (type === 'beforeunload') return;
                return _origAEL.call(this, type, fn, opts);
            };
        """)

        # Capa 2: CDP event listener — auto-acepta cualquier diálogo a nivel
        #         de protocolo Chrome, antes de que llegue a la UI.
        cdp_session = ctx.new_cdp_session(page)
        cdp_session.send("Page.enable")

        def _cdp_dialog_handler(params):
            try:
                cdp_session.send("Page.handleJavaScriptDialog", {"accept": True})
            except Exception:
                pass

        cdp_session.on("Page.javascriptDialogOpening", _cdp_dialog_handler)

        # Cerrar diálogo previo que haya quedado abierto de ejecución anterior
        try:
            cdp_session.send("Page.handleJavaScriptDialog", {"accept": True})
        except Exception:
            pass  # No había diálogo abierto — OK

        # Capa 3: Playwright dialog handler (fallback)
        def _safe_dismiss(dialog):
            try:
                dialog.accept()
            except Exception:
                pass
        page.on("dialog", _safe_dismiss)

        time.sleep(1)

        # Verificar que estamos en Studio del canal correcto
        current_url = page.url
        print(f"\nURL actual: {current_url}")
        if "accounts.google.com" in current_url:
            print("Sesión de Google detectada. Completa el login manualmente y presiona Enter...")
            input()

        # Asegurar que estamos en el canal Frecuencia Global (no el personal)
        target_studio = f"https://studio.youtube.com/channel/{CHANNEL_ID}"
        if CHANNEL_ID not in page.url:
            print(f"\n  ⚠ No estamos en el canal correcto. Navegando a Frecuencia Global...")
            nuke_beforeunload(page)
            page.goto(target_studio, wait_until="domcontentloaded", timeout=60000)
            try:
                page.wait_for_load_state("networkidle", timeout=15000)
            except Exception:
                pass
            time.sleep(4)
            # Verificar que la redirección fue al canal correcto
            if CHANNEL_ID not in page.url:
                # Intentar via JS
                page.evaluate(f"() => window.location.href = '{target_studio}'")
                time.sleep(6)
            if CHANNEL_ID not in page.url:
                raise RuntimeError(
                    f"No se pudo navegar al canal {CHANNEL_ID}. "
                    f"URL actual: {page.url}. "
                    f"Cambia manualmente al canal Frecuencia Global en YouTube Studio."
                )
            print(f"  ✓ Canal correcto: {page.url}")
        else:
            print(f"  ✓ Ya en canal Frecuencia Global")

        def _snap(name):
            try:
                page.screenshot(path=os.path.join(BASE_DIR, "scripts", name), timeout=8000)
                print(f"  Screenshot: {name}")
            except Exception as e:
                print(f"  Screenshot skipped ({name}): {e}")

        # ── Tareas 1 y 2 (links + email) ya completadas — SKIP ──
        print("\n  ⏭ Tareas 1-2 (links + email) ya publicadas. Saltando.")

        # Ejecutar tareas pendientes
        task3_set_channel_description(page)
        _snap("result_03_description.png")

        # Tareas 4+5: re-ejecutar para asegurar que todo quedó bien
        # (son idempotentes — configuran los mismos valores)
        task4_channel_settings(page)
        _snap("result_04_channel_settings.png")

        task5_upload_defaults(page)
        _snap("result_05_upload_defaults.png")

        print("\n" + "=" * 60)
        print("  Configuración CDP completada.")
        print("  Verifica los cambios en YouTube Studio.")
        print("=" * 60)

        # No cerrar Chrome (puede necesitar acción adicional)


if __name__ == "__main__":
    main()
