from playwright.sync_api import sync_playwright
import subprocess
import time
import urllib.request
import os
import struct
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from fg_automation_config import chrome_executable, chrome_profile_dir, repo_path, token_path

PROFILE_IMAGE = str(repo_path("06_Assets", "FG_IG_Avatar_Profile_v2.png"))
DEFAULT_YOUTUBE_BRANDING_URL = "https://studio.youtube.com/channel/UC/customization/branding"
DEFAULT_YOUTUBE_PROFILE_URL = "https://studio.youtube.com/channel/UC/editing/profile"
YOUTUBE_STUDIO_ROOT = "https://studio.youtube.com/"
CDP_URL = "http://127.0.0.1:9222"
CDP_VERSION_URL = f"{CDP_URL}/json/version"
CHROME_EXE = str(chrome_executable())
CHROME_PROFILE_DIR = str(chrome_profile_dir("youtube-stable"))
CHROME_PROFILE_NAME = "Default"
TOKEN_PATH = str(token_path())
SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]
PROFILE_MIN_WIDTH = 98
PROFILE_MIN_HEIGHT = 98
PROFILE_MAX_MB = 4


def resolve_branding_url() -> str:
    if not os.path.exists(TOKEN_PATH):
        return DEFAULT_YOUTUBE_BRANDING_URL

    try:
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
        youtube = build("youtube", "v3", credentials=creds)
        response = youtube.channels().list(mine=True, part="id").execute()
        items = response.get("items", [])
        if not items:
            return DEFAULT_YOUTUBE_BRANDING_URL
        channel_id = items[0]["id"]
        print(f"Canal detectado por API: {channel_id}")
        return f"https://studio.youtube.com/channel/{channel_id}/customization/branding"
    except Exception as e:
        print(f"No se pudo resolver canal por API, usando URL por defecto: {e}")
        return DEFAULT_YOUTUBE_BRANDING_URL


def resolve_profile_url() -> str:
    if not os.path.exists(TOKEN_PATH):
        return DEFAULT_YOUTUBE_PROFILE_URL

    try:
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
        youtube = build("youtube", "v3", credentials=creds)
        response = youtube.channels().list(mine=True, part="id").execute()
        items = response.get("items", [])
        if not items:
            return DEFAULT_YOUTUBE_PROFILE_URL
        channel_id = items[0]["id"]
        return f"https://studio.youtube.com/channel/{channel_id}/editing/profile"
    except Exception:
        return DEFAULT_YOUTUBE_PROFILE_URL


def is_visible(page, text: str) -> bool:
    try:
        return page.get_by_text(text, exact=False).first.is_visible(timeout=1500)
    except Exception:
        return False


def get_png_dimensions(path: str) -> tuple[int, int]:
    # PNG guarda ancho y alto en bytes 16..24 del bloque IHDR.
    with open(path, "rb") as f:
        header = f.read(24)
    if len(header) < 24 or header[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("El archivo no es un PNG valido.")
    width, height = struct.unpack(">II", header[16:24])
    return width, height


def validate_profile_image(path: str) -> None:
    if not os.path.exists(path):
        raise FileNotFoundError(f"No existe la imagen de perfil: {path}")

    width, height = get_png_dimensions(path)
    size_mb = os.path.getsize(path) / (1024 * 1024)

    print(f"Validacion imagen perfil -> {width}x{height}, {size_mb:.3f} MB")

    if width < PROFILE_MIN_WIDTH or height < PROFILE_MIN_HEIGHT:
        raise ValueError(
            f"Imagen de perfil invalida: minimo {PROFILE_MIN_WIDTH}x{PROFILE_MIN_HEIGHT}px. "
            f"Actual: {width}x{height}px."
        )
    if size_mb > PROFILE_MAX_MB:
        raise ValueError(
            f"Imagen de perfil invalida: maximo {PROFILE_MAX_MB}MB. Actual: {size_mb:.3f}MB."
        )


def cdp_is_ready() -> bool:
    try:
        with urllib.request.urlopen(CDP_VERSION_URL, timeout=2) as response:
            return response.status == 200
    except Exception:
        return False


def start_chrome_debug() -> None:
    # Perfil dedicado evita romper sesiones del Chrome principal.
    os.makedirs(CHROME_PROFILE_DIR, exist_ok=True)
    branding_url = resolve_branding_url()
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


def wait_for_channel_access(page, timeout_seconds: int = 300) -> None:
    profile_url = resolve_profile_url()
    # Espera hasta que desaparezca el estado de cuenta sin permisos.
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
            page.goto(profile_url, wait_until="domcontentloaded")
            time.sleep(2)
            continue

        if is_visible(page, "you don't have permission to view this page"):
            print("Cuenta sin permisos detectada. Usa 'Switch account' en Chrome...")
            time.sleep(3)
            continue

        if "accounts.google.com" in page.url:
            wait_for_login(page, timeout_seconds=timeout_seconds)
            page.goto(profile_url, wait_until="domcontentloaded")
            time.sleep(2)
            continue

        return

    raise TimeoutError("No se detecto una cuenta con acceso al canal en el tiempo esperado.")


def dump_page_state(page, label: str) -> None:
    """Diagnostico: imprime botones visibles y dialogs abiertos."""
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


def upload_profile(page) -> None:
    profile_url = resolve_profile_url()
    last_error = None

    for attempt in range(3):
        print(f"\n--- Intento {attempt + 1}/3 ---")
        page.goto(YOUTUBE_STUDIO_ROOT, wait_until="domcontentloaded")
        time.sleep(2)
        page.goto(profile_url, wait_until="domcontentloaded")
        time.sleep(4)

        if is_visible(page, "Oops, something went wrong"):
            last_error = RuntimeError("Studio devolvio 'Oops, something went wrong'.")
            continue

        # Buscar todos los inputs de archivo
        inputs = page.locator('input[type="file"]')
        count = inputs.count()
        print(f"Inputs file encontrados: {count}")
        if count == 0:
            last_error = RuntimeError("No se encontro input de archivo para la foto de perfil.")
            continue

        # Index 0 = Banner, Index 1 = Profile Picture, Index 2 = otro
        profile_input_idx = 1 if count > 1 else 0
        print(f"Usando input index {profile_input_idx} de {count} para foto de perfil.")
        inputs.nth(profile_input_idx).set_input_files(PROFILE_IMAGE)
        print("Foto de perfil enviada al input.")

        # Esperar a que aparezca el modal de recorte/confirmacion
        time.sleep(4)
        dump_page_state(page, "POST-UPLOAD")

        # Buscar y hacer clic en el boton de confirmacion del modal de recorte
        modal_clicked = False
        # YouTube Studio usa distintas etiquetas segun idioma
        modal_labels = ["DONE", "Done", "LISTO", "Listo", "SAVE", "Save", "GUARDAR", "Guardar",
                        "APLICAR", "Aplicar", "APPLY", "Apply", "ACEPTAR", "Aceptar",
                        "OK", "Confirm", "CONFIRM", "Confirmar", "CONFIRMAR"]
        for label in modal_labels:
            try:
                btn = page.get_by_role("button", name=label).first
                if btn.is_visible(timeout=500):
                    btn.click(timeout=3000)
                    print(f"Boton modal '{label}' pulsado.")
                    modal_clicked = True
                    time.sleep(2)
                    break
            except Exception:
                pass

        if not modal_clicked:
            # Intentar con selectores directos de YouTube Studio
            for selector in [
                'ytcp-button#done-button',
                'ytcp-button#save-button',
                'tp-yt-paper-dialog ytcp-button:not([id="cancel-button"])',
                '#dialog-buttons ytcp-button.action-button',
            ]:
                try:
                    loc = page.locator(selector).first
                    if loc.is_visible(timeout=500):
                        loc.click(timeout=3000)
                        print(f"Boton modal via selector '{selector}' pulsado.")
                        modal_clicked = True
                        time.sleep(2)
                        break
                except Exception:
                    pass

        if not modal_clicked:
            print("AVISO: No se encontro boton de confirmacion en el modal.")

        dump_page_state(page, "POST-MODAL")

        # Eliminar overlays que bloquean el clic en Publish
        page.evaluate("""
            document.querySelectorAll('tp-yt-iron-overlay-backdrop').forEach(el => el.remove());
            document.querySelectorAll('.overlay, [class*="backdrop"]').forEach(el => {
                if (el.style) el.style.display = 'none';
            });
            document.querySelectorAll('[style*="pointer-events"]').forEach(el => {
                el.style.pointerEvents = 'auto';
            });
        """)
        time.sleep(1)

        # Intentar publicar
        published = False

        # Metodo 1: clic Playwright en #publish-button
        publish_loc = page.locator('ytcp-button#publish-button')
        if publish_loc.count() > 0:
            # Verificar si esta habilitado
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

        # Metodo 2: JavaScript click en el boton interno
        if not published:
            try:
                result = page.evaluate("""() => {
                    // Limpiar overlays otra vez
                    document.querySelectorAll('tp-yt-iron-overlay-backdrop').forEach(el => el.remove());

                    const outer = document.querySelector('ytcp-button#publish-button');
                    if (!outer) return 'no-outer';
                    if (outer.hasAttribute('disabled')) return 'disabled';

                    // Intentar el boton interno <button> dentro del shadow DOM o hijo directo
                    const inner = outer.querySelector('button') ||
                                  outer.shadowRoot?.querySelector('button') ||
                                  outer.querySelector('[role="button"]');
                    if (inner) {
                        inner.click();
                        return 'inner-clicked';
                    }
                    // Fallback: click en el outer
                    outer.click();
                    return 'outer-clicked';
                }""")
                print(f"Publish via JS: {result}")
                if result in ('inner-clicked', 'outer-clicked'):
                    published = True
            except Exception as e:
                print(f"Publish via JS fallo: {e}")

        # Metodo 3: dispatch MouseEvent directo
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
            # Verificar si aparece alguna confirmacion o si el boton se desactivo
            still_enabled = page.evaluate("""() => {
                const btn = document.querySelector('ytcp-button#publish-button');
                if (!btn) return false;
                return !btn.hasAttribute('disabled') && btn.getAttribute('aria-disabled') !== 'true';
            }""")
            if still_enabled:
                print("AVISO: El boton Publish sigue activo tras el clic. El cambio podria no haberse guardado.")
            else:
                print("Publish completado: el boton se desactivo correctamente.")
        else:
            print("No fue posible pulsar Publish. El cambio quedo cargado para publicar manualmente.")

        dump_page_state(page, "FINAL")
        return

    raise last_error if last_error else RuntimeError("No se pudo cargar la foto de perfil.")


if __name__ == "__main__":
    validate_profile_image(PROFILE_IMAGE)
    print("Preparando Chrome con depuracion remota...")
    if not cdp_is_ready():
        start_chrome_debug()

    for _ in range(30):
        if cdp_is_ready():
            break
        time.sleep(1)
    else:
        raise RuntimeError("No fue posible iniciar Chrome en modo depuracion remota (puerto 9222).")

    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(CDP_URL)
        if browser.contexts:
            context = browser.contexts[0]
        else:
            context = browser.new_context()

        page = context.pages[0] if context.pages else context.new_page()
        profile_url = resolve_profile_url()

        try:
            # Si Chrome ya esta navegando a la misma URL (sesion previa),
            # page.goto lanza "interrupted by another navigation". Se reintenta.
            for nav_try in range(3):
                try:
                    page.goto(profile_url, wait_until="domcontentloaded")
                    break
                except Exception as nav_err:
                    if "interrupted" in str(nav_err).lower() or "navigation" in str(nav_err).lower():
                        print(f"Navegacion interrumpida (intento {nav_try + 1}/3). Esperando...")
                        time.sleep(3)
                        # Si ya estamos en la URL correcta, continuar
                        if "studio.youtube.com" in page.url and "editing/profile" in page.url:
                            print("Ya se encuentra en la pagina de perfil.")
                            break
                    else:
                        raise
            else:
                # Ultimo recurso: si la URL ya coincide, continuar igual
                if "studio.youtube.com" not in page.url:
                    raise RuntimeError("No fue posible navegar a YouTube Studio despues de 3 intentos.")

            wait_for_login(page)
            wait_for_channel_access(page)
            upload_profile(page)
            print("Proceso finalizado: valida en YouTube Studio si la foto quedo aplicada.")
        finally:
            browser.close()
