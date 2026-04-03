"""Sube el banner de canal a YouTube Studio via CDP."""
from playwright.sync_api import sync_playwright
import subprocess
import time
import urllib.request
import os
import struct
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from fg_automation_config import chrome_executable, chrome_profile_dir, repo_path, token_path

BANNER_IMAGE = str(repo_path("Frecuencia_Global_Activos_Canva_v1", "FG_Banner_YouTube_v3.png"))
DEFAULT_YOUTUBE_BRANDING_URL = "https://studio.youtube.com/channel/UCFZYwZwkDD6oUPacaLo7PvQ/editing/profile"
DEFAULT_YOUTUBE_CUSTOMIZATION_URL = "https://studio.youtube.com/channel/UCFZYwZwkDD6oUPacaLo7PvQ/customization/branding"
YOUTUBE_STUDIO_ROOT = "https://studio.youtube.com/"
CDP_URL = "http://127.0.0.1:9222"
CDP_VERSION_URL = f"{CDP_URL}/json/version"
CHROME_EXE = str(chrome_executable())
CHROME_PROFILE_DIR = str(chrome_profile_dir("youtube-stable"))
CHROME_PROFILE_NAME = "Default"
TOKEN_PATH = str(token_path())
SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]
BANNER_MIN_WIDTH = 2048
BANNER_MIN_HEIGHT = 1152
BANNER_MAX_MB = 6


def resolve_profile_url() -> str:
    channel_id = "UCFZYwZwkDD6oUPacaLo7PvQ"
    try:
        if os.path.exists(TOKEN_PATH):
            creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
            youtube = build("youtube", "v3", credentials=creds)
            response = youtube.channels().list(mine=True, part="id").execute()
            items = response.get("items", [])
            if items:
                channel_id = items[0]["id"]
                print(f"Canal detectado por API: {channel_id}")
    except Exception as e:
        print(f"Usando channel ID hardcoded: {e}")
    return f"https://studio.youtube.com/channel/{channel_id}/editing/profile"


def resolve_customization_url() -> str:
    channel_id = "UCFZYwZwkDD6oUPacaLo7PvQ"
    try:
        if os.path.exists(TOKEN_PATH):
            creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
            youtube = build("youtube", "v3", credentials=creds)
            response = youtube.channels().list(mine=True, part="id").execute()
            items = response.get("items", [])
            if items:
                channel_id = items[0]["id"]
    except Exception:
        pass
    return f"https://studio.youtube.com/channel/{channel_id}/customization/branding"


def is_visible(page, text: str) -> bool:
    try:
        return page.get_by_text(text, exact=False).first.is_visible(timeout=1500)
    except Exception:
        return False


def get_png_dimensions(path: str) -> tuple:
    with open(path, "rb") as f:
        header = f.read(24)
    if len(header) < 24 or header[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("El archivo no es un PNG valido.")
    width, height = struct.unpack(">II", header[16:24])
    return width, height


def validate_banner_image(path: str) -> None:
    if not os.path.exists(path):
        raise FileNotFoundError(f"No existe la imagen de banner: {path}")

    width, height = get_png_dimensions(path)
    size_mb = os.path.getsize(path) / (1024 * 1024)

    print(f"Validacion imagen banner -> {width}x{height}, {size_mb:.3f} MB")

    if width < BANNER_MIN_WIDTH or height < BANNER_MIN_HEIGHT:
        raise ValueError(
            f"Banner invalido: minimo {BANNER_MIN_WIDTH}x{BANNER_MIN_HEIGHT}px. "
            f"Actual: {width}x{height}px."
        )
    if size_mb > BANNER_MAX_MB:
        raise ValueError(
            f"Banner invalido: maximo {BANNER_MAX_MB}MB. Actual: {size_mb:.3f}MB."
        )


def cdp_is_ready() -> bool:
    try:
        with urllib.request.urlopen(CDP_VERSION_URL, timeout=2) as response:
            return response.status == 200
    except Exception:
        return False


def start_chrome_debug() -> None:
    os.makedirs(CHROME_PROFILE_DIR, exist_ok=True)
    branding_url = resolve_profile_url()
    cmd = [
        CHROME_EXE,
        "--remote-debugging-port=9222",
        f"--user-data-dir={CHROME_PROFILE_DIR}",
        f"--profile-directory={CHROME_PROFILE_NAME}",
        branding_url,
    ]
    subprocess.Popen(cmd)


def wait_for_login(page, timeout_seconds: int = 300) -> None:
    if "accounts.google.com" not in page.url:
        return

    print("Login detectado en Chrome. Completa el inicio de sesion en la ventana abierta...")
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        if "studio.youtube.com" in page.url and "accounts.google.com" not in page.url:
            return
        time.sleep(2)

    raise TimeoutError("No se detecto sesion iniciada en el tiempo esperado.")


def wait_for_channel_access(page, branding_url: str, timeout_seconds: int = 300) -> None:
    deadline = time.time() + timeout_seconds
    oops_retries = 0
    while time.time() < deadline:
        if is_visible(page, "Oops, something went wrong"):
            print("Error transitorio de Studio detectado. Reintentando...")
            oops_retries += 1
            if oops_retries >= 5:
                raise RuntimeError("Studio mantiene error transitorio despues de 5 reintentos.")
            page.goto(YOUTUBE_STUDIO_ROOT, wait_until="domcontentloaded")
            time.sleep(3)
            page.goto(branding_url, wait_until="domcontentloaded")
            time.sleep(2)
            continue

        if is_visible(page, "you don't have permission to view this page"):
            print("Cuenta sin permisos detectada. Usa 'Switch account' en Chrome...")
            time.sleep(3)
            continue

        if "accounts.google.com" in page.url:
            wait_for_login(page, timeout_seconds=timeout_seconds)
            page.goto(branding_url, wait_until="domcontentloaded")
            time.sleep(2)
            continue

        return

    raise TimeoutError("No se detecto una cuenta con acceso al canal en el tiempo esperado.")


def dump_page_state(page, label: str) -> None:
    try:
        info = page.evaluate("""() => {
            const btns = [...document.querySelectorAll('button, ytcp-button, [role="button"]')]
                .filter(el => el.offsetParent !== null)
                .map(el => ({
                    tag: el.tagName,
                    id: el.id || '',
                    text: (el.textContent || '').trim().substring(0, 60),
                    disabled: el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true'
                }));
            const dialogs = [...document.querySelectorAll('ytcp-dialog, tp-yt-paper-dialog, [role="dialog"]')]
                .filter(el => el.offsetParent !== null)
                .map(el => ({
                    tag: el.tagName,
                    id: el.id || '',
                    text: (el.textContent || '').trim().substring(0, 120)
                }));
            const overlays = document.querySelectorAll('tp-yt-iron-overlay-backdrop').length;
            return {btns, dialogs, overlays};
        }""")
        print(f"\n=== DIAGNOSTICO [{label}] ===")
        print(f"  Overlays: {info['overlays']}")
        for d in info['dialogs']:
            print(f"  Dialog: {d['tag']}#{d['id']} -> {d['text'][:80]}")
        for b in info['btns']:
            dis = " [DISABLED]" if b['disabled'] else ""
            print(f"  Btn: {b['tag']}#{b['id']} -> {b['text'][:50]}{dis}")
        print("=== FIN DIAGNOSTICO ===\n")
    except Exception as e:
        print(f"Diagnostico fallo: {e}")


def dismiss_dialogs_and_overlays(page) -> None:
    """Cierra cualquier dialog abierto y elimina overlays bloqueantes."""
    try:
        page.evaluate("""() => {
            // Cerrar dialogs visibles (clic en Close/X)
            const dialogs = document.querySelectorAll('ytcp-dialog, tp-yt-paper-dialog, [role="dialog"]');
            dialogs.forEach(d => {
                if (d.offsetParent !== null) {
                    // Buscar boton de cerrar
                    const closeBtn = d.querySelector('[aria-label="Close"], [aria-label="Cerrar"], .close-button, ytcp-icon-button');
                    if (closeBtn) closeBtn.click();
                    // Intentar cerrar el dialog
                    if (d.close) d.close();
                    d.style.display = 'none';
                }
            });
            // Eliminar overlays
            document.querySelectorAll('tp-yt-iron-overlay-backdrop').forEach(el => el.remove());
            document.querySelectorAll('.overlay, [class*="backdrop"]').forEach(el => {
                if (el.style) el.style.display = 'none';
            });
            document.querySelectorAll('[style*="pointer-events: none"]').forEach(el => {
                el.style.pointerEvents = 'auto';
            });
        }""")
        time.sleep(1)
    except Exception as e:
        print(f"  dismiss_dialogs: {e}")


def navigate_to_banner_page(page, branding_url: str) -> bool:
    """Navega a la pagina de banner/branding. Retorna True si tuvo exito."""
    customization_url = resolve_customization_url()
    
    # Primero limpiar cualquier dialog/overlay bloqueante
    dismiss_dialogs_and_overlays(page)
    
    # URLs a intentar, en orden
    urls_to_try = [branding_url, customization_url]
    
    for url in urls_to_try:
        print(f"  Intentando navegar a: {url}")
        page.goto(url, wait_until="domcontentloaded")
        try:
            page.wait_for_load_state("networkidle", timeout=15000)
        except Exception:
            pass
        time.sleep(5)
        
        current = page.url
        if "editing/profile" in current or "customization/branding" in current:
            print(f"  Navegacion exitosa: {current}")
            return True
        print(f"  Redirigido a: {current}")
    
    # Fallback: navegar via sidebar desde el dashboard
    print("  Intentando navegacion via sidebar...")
    page.goto(YOUTUBE_STUDIO_ROOT, wait_until="domcontentloaded")
    time.sleep(4)
    
    # Buscar link de Customization en sidebar  
    sidebar_selectors = [
        'a[href*="customization"]',
        'a[href*="editing/profile"]',
        'tp-yt-paper-item:has-text("Customization")',
        'tp-yt-paper-item:has-text("Personalización")',
        '#menu-item-customization',
        '[test-id="customization"]',
    ]
    for sel in sidebar_selectors:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=1000):
                el.click(timeout=3000)
                print(f"  Click en sidebar: {sel}")
                time.sleep(4)
                
                # Si llegamos a customization, ir a branding tab
                if "customization" in page.url:
                    try:
                        branding_tab = page.locator('tp-yt-paper-tab:has-text("Branding"), [role="tab"]:has-text("Branding"), [role="tab"]:has-text("Imagen de marca")').first
                        if branding_tab.is_visible(timeout=2000):
                            branding_tab.click(timeout=3000)
                            print("  Click en tab Branding.")
                            time.sleep(3)
                    except Exception:
                        pass
                    return True
                
                if "editing/profile" in page.url:
                    return True
        except Exception:
            continue
    
    # Ultimo recurso: inyectar navegacion JS
    print("  Intentando navegacion JS...")
    page.evaluate(f"window.location.href = '{customization_url}'")
    time.sleep(6)
    current = page.url
    if "customization" in current or "editing/profile" in current:
        print(f"  Navegacion JS exitosa: {current}")
        return True
    
    print(f"  Todos los metodos de navegacion fallaron. URL actual: {current}")
    return False


def upload_banner(page, branding_url: str) -> None:
    last_error = None

    for attempt in range(3):
        print(f"\n--- Intento {attempt + 1}/3 ---")
        
        if not navigate_to_banner_page(page, branding_url):
            last_error = RuntimeError(f"No se pudo navegar a la pagina de banner. URL: {page.url}")
            continue

        if is_visible(page, "Oops, something went wrong"):
            print("  'Oops' detectado. Cerrando dialogos y recargando...")
            dismiss_dialogs_and_overlays(page)
            time.sleep(2)
            # Recargar la pagina actual en vez de navegar a root
            page.reload(wait_until="domcontentloaded")
            try:
                page.wait_for_load_state("networkidle", timeout=15000)
            except Exception:
                pass
            time.sleep(5)
            dismiss_dialogs_and_overlays(page)
            if is_visible(page, "Oops, something went wrong"):
                last_error = RuntimeError("Studio devolvio 'Oops, something went wrong'.")
                continue

        # Diagnostico previo a busqueda de inputs
        dump_page_state(page, "PRE-INPUT-SEARCH")
        print(f"  URL actual: {page.url}")

        # Scroll completo para forzar carga lazy de elementos
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(2)
        page.evaluate("window.scrollTo(0, 0)")
        time.sleep(2)

        # Polling: buscar inputs con reintentos (hasta 20s)
        inputs = page.locator('input[type="file"]')
        count = 0
        for wait_round in range(10):
            count = inputs.count()
            if count > 0:
                break
            print(f"  Esperando inputs... ({wait_round + 1}/10)")
            time.sleep(2)

        print(f"Inputs file encontrados: {count}")

        if count == 0:
            # Diagnostico extra: listar TODOS los inputs y elementos de upload
            try:
                diag = page.evaluate("""() => {
                    const allInputs = [...document.querySelectorAll('input')].map(el => ({
                        type: el.type, name: el.name || '', id: el.id || '',
                        hidden: el.offsetParent === null
                    }));
                    const uploadBtns = [...document.querySelectorAll('[class*="upload"], [class*="banner"], [id*="banner"], [id*="upload"]')]
                        .map(el => ({tag: el.tagName, id: el.id || '', cls: el.className?.substring?.(0, 80) || ''}));
                    return {allInputs, uploadBtns, bodyLen: document.body.innerHTML.length};
                }""")
                print(f"  DIAG: total inputs en pagina: {len(diag['allInputs'])}")
                for inp in diag['allInputs']:
                    print(f"    input type={inp['type']} name={inp['name']} id={inp['id']} hidden={inp['hidden']}")
                print(f"  DIAG: elementos upload/banner: {len(diag['uploadBtns'])}")
                for el in diag['uploadBtns']:
                    print(f"    {el['tag']}#{el['id']} class={el['cls']}")
                print(f"  DIAG: body innerHTML length: {diag['bodyLen']}")
            except Exception as diag_err:
                print(f"  Diagnostico extra fallo: {diag_err}")

            last_error = RuntimeError("No se encontro input de archivo para el banner.")
            continue

        # Index 0 = Banner
        banner_input_idx = 0
        print(f"Usando input index {banner_input_idx} (Banner).")
        inputs.nth(banner_input_idx).set_input_files(BANNER_IMAGE)
        print("Banner enviado al input.")

        time.sleep(4)
        dump_page_state(page, "POST-UPLOAD")

        # Buscar y cerrar el modal de recorte del banner ("Customize banner art")
        modal_closed = False

        # Metodo 1: clic directo en #done-button via JavaScript (mas fiable)
        try:
            result = page.evaluate("""() => {
                const dialog = document.querySelector('ytcp-dialog#editor-dialog');
                if (!dialog || dialog.offsetParent === null) return 'no-dialog';
                const doneBtn = dialog.querySelector('ytcp-button#done-button');
                if (!doneBtn) return 'no-done-btn';
                const inner = doneBtn.querySelector('button') || doneBtn;
                inner.click();
                return 'clicked';
            }""")
            print(f"Modal editor-dialog #done-button: {result}")
            if result == 'clicked':
                time.sleep(2)
                # Esperar a que el dialog desaparezca (hasta 10s)
                for wait_i in range(10):
                    still_open = page.evaluate("""() => {
                        const d = document.querySelector('ytcp-dialog#editor-dialog');
                        return d && d.offsetParent !== null;
                    }""")
                    if not still_open:
                        print("Modal editor-dialog cerrado correctamente.")
                        modal_closed = True
                        break
                    print(f"  Esperando cierre de modal... ({wait_i + 1}/10)")
                    time.sleep(1)
                if not modal_closed:
                    print("Modal no se cerro tras 10s. Forzando cierre...")
                    page.evaluate("""() => {
                        const d = document.querySelector('ytcp-dialog#editor-dialog');
                        if (d) { d.style.display = 'none'; d.close && d.close(); }
                    }""")
                    time.sleep(1)
                    modal_closed = True
        except Exception as e:
            print(f"Modal #done-button fallo: {e}")

        # Metodo 2: fallback por label
        if not modal_closed:
            for label in ["Done", "DONE", "Listo", "LISTO", "Guardar", "GUARDAR", "OK"]:
                try:
                    btn = page.get_by_role("button", name=label).first
                    if btn.is_visible(timeout=500):
                        btn.click(timeout=3000, force=True)
                        print(f"Boton modal '{label}' pulsado (fallback).")
                        modal_closed = True
                        time.sleep(3)
                        break
                except Exception:
                    pass

        # Metodo 3: selector generico
        if not modal_closed:
            for selector in [
                'ytcp-button#done-button',
                'ytcp-button#save-button',
                '#dialog-buttons ytcp-button.action-button',
            ]:
                try:
                    loc = page.locator(selector).first
                    if loc.is_visible(timeout=500):
                        loc.click(timeout=3000, force=True)
                        print(f"Boton modal via selector '{selector}' pulsado.")
                        modal_closed = True
                        time.sleep(3)
                        break
                except Exception:
                    pass

        if not modal_closed:
            print("No hay modal de confirmacion (o ya fue procesado automaticamente).")

        time.sleep(2)
        dump_page_state(page, "POST-MODAL")

        # Eliminar overlays
        page.evaluate("""() => {
            document.querySelectorAll('tp-yt-iron-overlay-backdrop').forEach(el => el.remove());
            document.querySelectorAll('.overlay, [class*="backdrop"]').forEach(el => {
                if (el.style) el.style.display = 'none';
            });
            document.querySelectorAll('[style*="pointer-events"]').forEach(el => {
                el.style.pointerEvents = 'auto';
            });
        }""")
        time.sleep(1)

        # Intentar publicar
        published = False

        # Metodo 1: clic Playwright
        publish_loc = page.locator('ytcp-button#publish-button')
        if publish_loc.count() > 0:
            is_disabled = page.evaluate("""() => {
                const btn = document.querySelector('ytcp-button#publish-button');
                if (!btn) return true;
                return btn.hasAttribute('disabled') || btn.getAttribute('aria-disabled') === 'true';
            }""")
            print(f"Publish button disabled: {is_disabled}")

            if not is_disabled:
                try:
                    publish_loc.first.scroll_into_view_if_needed(timeout=2000)
                    publish_loc.first.click(timeout=5000, force=True)
                    print("Publish: clic Playwright exitoso.")
                    published = True
                except Exception as e:
                    print(f"Publish: clic Playwright fallo: {e}")

        # Metodo 2: JavaScript click
        if not published:
            try:
                result = page.evaluate("""() => {
                    document.querySelectorAll('tp-yt-iron-overlay-backdrop').forEach(el => el.remove());
                    const outer = document.querySelector('ytcp-button#publish-button');
                    if (!outer) return 'no-outer';
                    if (outer.hasAttribute('disabled')) return 'disabled';
                    const inner = outer.querySelector('button') ||
                                  outer.shadowRoot?.querySelector('button') ||
                                  outer.querySelector('[role="button"]');
                    if (inner) {
                        inner.click();
                        return 'inner-clicked';
                    }
                    outer.click();
                    return 'outer-clicked';
                }""")
                print(f"Publish via JS: {result}")
                if result in ('inner-clicked', 'outer-clicked'):
                    published = True
            except Exception as e:
                print(f"Publish via JS fallo: {e}")

        # Metodo 3: dispatch MouseEvent
        if not published:
            try:
                result = page.evaluate("""() => {
                    const btn = document.querySelector('ytcp-button#publish-button');
                    if (!btn) return 'not-found';
                    const rect = btn.getBoundingClientRect();
                    const x = rect.x + rect.width / 2;
                    const y = rect.y + rect.height / 2;
                    const el = document.elementFromPoint(x, y);
                    if (el) {
                        el.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, clientX: x, clientY: y}));
                        return 'dispatched-on-' + el.tagName;
                    }
                    return 'no-element-at-point';
                }""")
                print(f"Publish via dispatch: {result}")
                if 'dispatched' in result:
                    published = True
            except Exception as e:
                print(f"Publish via dispatch fallo: {e}")

        time.sleep(3)

        if published:
            still_enabled = page.evaluate("""() => {
                const btn = document.querySelector('ytcp-button#publish-button');
                if (!btn) return False;
                return !btn.hasAttribute('disabled') && btn.getAttribute('aria-disabled') !== 'true';
            }""")
            if still_enabled:
                print("AVISO: El boton Publish sigue activo tras el clic.")
            else:
                print("Publish completado: el boton se desactivo correctamente.")
        else:
            print("No fue posible pulsar Publish. El banner quedo cargado para publicar manualmente.")

        dump_page_state(page, "FINAL")
        return

    raise last_error if last_error else RuntimeError("No se pudo cargar el banner.")


if __name__ == "__main__":
    validate_banner_image(BANNER_IMAGE)
    print("Preparando Chrome con depuracion remota...")
    if not cdp_is_ready():
        start_chrome_debug()

    for _ in range(30):
        if cdp_is_ready():
            break
        time.sleep(1)
    else:
        raise RuntimeError("No fue posible iniciar Chrome en modo depuracion remota (puerto 9222).")

    branding_url = resolve_profile_url()
    customization_url = resolve_customization_url()
    print(f"URL de perfil/banner: {branding_url}")
    print(f"URL de customization: {customization_url}")

    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(CDP_URL)
        if browser.contexts:
            context = browser.contexts[0]
        else:
            context = browser.new_context()

        page = context.pages[0] if context.pages else context.new_page()

        # Aceptar automaticamente cualquier dialogo JS (ej. "Leave site?")
        page.on("dialog", lambda dialog: dialog.accept())

        try:
            # Limpiar dialogs/overlays residuales
            dismiss_dialogs_and_overlays(page)
            
            # Navegar primero al root de Studio
            page.goto(YOUTUBE_STUDIO_ROOT, wait_until="domcontentloaded")
            time.sleep(3)
            dismiss_dialogs_and_overlays(page)

            wait_for_login(page)
            wait_for_channel_access(page, branding_url)
            upload_banner(page, branding_url)
            print("Proceso finalizado: valida en YouTube Studio si el banner quedo aplicado.")
        finally:
            browser.close()
