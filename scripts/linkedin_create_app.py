"""Crea una app en LinkedIn Developer Portal vía browser automation.

Uso:
    python scripts/linkedin_create_app.py

Requisitos:
    - Sesión activa de LinkedIn (el script esperará login si es necesario)
    - Playwright instalado

El script:
    1. Abre LinkedIn Developer Portal
    2. Espera login si es necesario
    3. Crea la app "Frecuencia Global"
    4. Añade productos requeridos
    5. Configura redirect URL
    6. Muestra Client ID y Client Secret al final
"""

import time
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeoutError

try:
    from fg_automation_config import chrome_executable
except ImportError:
    def chrome_executable():
        return None

# ── Configuración ──────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.parent
CHROME_PROFILE_DIR = REPO_ROOT / ".chrome-linkedin-stable"

APP_NAME = "Frecuencia Global"
REDIRECT_URL = "https://oauth.n8n.cloud/oauth2/callback"

LINKEDIN_DEVELOPERS_URL = "https://www.linkedin.com/developers/apps"
MAX_WAIT_LOGIN_SEC = 300

# ── Helpers ────────────────────────────────────────────────────────────────────
def wait_for_login(page, timeout_sec: int = MAX_WAIT_LOGIN_SEC) -> bool:
    """Espera a que el usuario esté autenticado en LinkedIn."""
    print(f"\n[INFO] Esperando login (máximo {timeout_sec // 60} minutos)...")
    print("[INFO] Si no estás logueado, inicia sesión en la ventana del navegador.")

    deadline = time.time() + timeout_sec
    while time.time() < deadline:
        current_url = page.url
        # Verificar que estamos en LinkedIn y no en página de login
        if "linkedin.com" in current_url and "/login" not in current_url and "/uas/login" not in current_url:
            # Buscar indicadores de sesión activa
            try:
                # Buscar elementos que solo aparecen cuando estás logueado
                page.wait_for_selector('nav[aria-label="Main navigation"], .global-nav, [data-test-global-nav]', timeout=3000)
                print("[OK] Sesión activa detectada")
                return True
            except PWTimeoutError:
                pass
        time.sleep(2)

    print("[ERROR] Tiempo de espera agotado - no se detectó sesión")
    return False


def create_app(page) -> dict | None:
    """Crea la app en LinkedIn Developer Portal."""
    result = {"client_id": None, "client_secret": None}

    # Navegar al portal de desarrolladores
    print(f"\n[INFO] Navegando a {LINKEDIN_DEVELOPERS_URL}")
    page.goto(LINKEDIN_DEVELOPERS_URL, wait_until="domcontentloaded", timeout=60000)
    time.sleep(3)

    # Verificar si necesitamos login
    if "/login" in page.url or "/uas/login" in page.url or "/authwall" in page.url:
        if not wait_for_login(page):
            return None
        page.goto(LINKEDIN_DEVELOPERS_URL, wait_until="domcontentloaded", timeout=60000)
        time.sleep(3)

    # Buscar botón "Create app"
    print("\n[INFO] Buscando botón 'Create app'...")
    create_btn = None
    for selector in ['button:has-text("Create app")', 'a:has-text("Create app")', '[data-test-create-app]']:
        try:
            locator = page.locator(selector)
            if locator.count() > 0 and locator.first.is_visible(timeout=2000):
                create_btn = locator.first
                break
        except Exception:
            continue

    if not create_btn:
        print("[ERROR] No se encontró el botón 'Create app'")
        print("[INFO] ¿Ya tienes apps creadas? Verifica manualmente.")
        return None

    create_btn.click()
    time.sleep(2)

    # Paso 1: Nombre de la app
    print(f"\n[INFO] Ingresando nombre: {APP_NAME}")
    try:
        name_input = page.locator('input[name="name"], input[placeholder*="app name" i], input[id*="name"]').first
        name_input.fill(APP_NAME)
        time.sleep(0.5)
    except Exception as e:
        print(f"[ERROR] No se pudo ingresar el nombre: {e}")
        return None

    # Paso 2: Seleccionar Company Page
    print("\n[INFO] Debes seleccionar la Company Page manualmente en el navegador.")
    print("[INFO] Busca el dropdown/select de Company Page y selecciona 'Frecuencia Global'.")
    print("[INFO] Esperando 30 segundos para que lo hagas...")
    time.sleep(30)

    # Paso 3: Aceptar términos
    print("\n[INFO] Buscando checkbox de términos...")
    try:
        checkbox = page.locator('input[type="checkbox"][name*="terms"], input[type="checkbox"][id*="terms"], input[type="checkbox"]').first
        if not checkbox.is_checked():
            checkbox.check()
            print("[OK] Términos aceptados")
    except Exception:
        print("[WARN] No se encontró checkbox de términos - acéptalo manualmente")

    # Paso 4: Click en "Create app" final
    print("\n[INFO] Buscando botón final 'Create app'...")
    time.sleep(2)
    for selector in ['button[type="submit"]:has-text("Create app")', 'button:has-text("Create app")']:
        try:
            btn = page.locator(selector).first
            if btn.is_visible(timeout=2000):
                btn.click()
                print("[OK] App creada")
                break
        except Exception:
            continue

    time.sleep(5)

    # Esperar a que cargue la página de la app
    print("\n[INFO] Esperando a que cargue la página de la app...")
    time.sleep(5)

    # Añadir productos
    print("\n[INFO] Añadiendo productos...")
    products_to_add = ["Share on LinkedIn", "Sign In with LinkedIn using OpenID Connect"]

    for product in products_to_add:
        try:
            # Buscar el producto
            product_btn = page.locator(f'button:has-text("{product}"), a:has-text("{product}")').first
            if product_btn.is_visible(timeout=3000):
                product_btn.click()
                print(f"[OK] Producto añadido: {product}")
                time.sleep(2)
        except Exception:
            print(f"[WARN] No se pudo añadir automáticamente: {product}")
            print(f"[INFO] Añádelo manualmente desde la pestaña 'Products'")

    # Configurar redirect URL
    print(f"\n[INFO] Configurando redirect URL: {REDIRECT_URL}")
    try:
        # Ir a la pestaña Auth
        auth_tab = page.locator('a:has-text("Auth"), button:has-text("Auth"), [data-test-auth-tab]').first
        if auth_tab.is_visible(timeout=3000):
            auth_tab.click()
            time.sleep(2)

        # Buscar sección de redirect URLs
        redirect_input = page.locator('input[placeholder*="redirect" i], input[name*="redirect"]').first
        if redirect_input.is_visible(timeout=3000):
            redirect_input.fill(REDIRECT_URL)
            # Buscar botón para añadir
            add_btn = page.locator('button:has-text("Add"), button:has-text("Update")').first
            if add_btn.is_visible(timeout=2000):
                add_btn.click()
                print(f"[OK] Redirect URL configurada: {REDIRECT_URL}")
    except Exception as e:
        print(f"[WARN] No se pudo configurar redirect URL automáticamente: {e}")
        print(f"[INFO] Configúrala manualmente en la pestaña 'Auth'")

    # Obtener credenciales
    print("\n[INFO] Obteniendo credenciales...")
    time.sleep(2)

    try:
        # Buscar Client ID
        client_id_elem = page.locator('span:has-text("Client ID") + span, [data-test-client-id], code:has-text("client")').first
        if client_id_elem.is_visible(timeout=3000):
            result["client_id"] = client_id_elem.inner_text().strip()
            print(f"[OK] Client ID: {result['client_id']}")

        # Buscar Client Secret (puede requerir click en "Show")
        show_secret_btn = page.locator('button:has-text("Show"), button:has-text("Reveal")').first
        if show_secret_btn.is_visible(timeout=2000):
            show_secret_btn.click()
            time.sleep(1)

        client_secret_elem = page.locator('span:has-text("Client Secret") + span, [data-test-client-secret], code:has-text("secret")').first
        if client_secret_elem.is_visible(timeout=3000):
            result["client_secret"] = client_secret_elem.inner_text().strip()
            print(f"[OK] Client Secret: {result['client_secret']}")
    except Exception as e:
        print(f"[WARN] No se pudieron obtener credenciales automáticamente: {e}")

    return result


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  LinkedIn Developer App Creator — Frecuencia Global")
    print("=" * 60)

    # Crear directorio de perfil si no existe
    CHROME_PROFILE_DIR.mkdir(parents=True, exist_ok=True)

    chrome_exe = chrome_executable()
    launch_args = {
        "user_data_dir": str(CHROME_PROFILE_DIR),
        "headless": False,
        "args": [
            "--start-maximized",
            "--no-first-run",
            "--no-default-browser-check",
        ],
        "viewport": None,
        "no_viewport": True,
    }
    if chrome_exe:
        launch_args["executable_path"] = str(chrome_exe)

    print("\n[INFO] Iniciando navegador...")

    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(**launch_args)
        page = context.new_page()

        result = create_app(page)

        print("\n" + "=" * 60)
        if result and result["client_id"]:
            print("  CREDENCIALES OBTENIDAS:")
            print(f"  Client ID:     {result['client_id']}")
            print(f"  Client Secret: {result['client_secret']}")
            print("=" * 60)
            print("\n[INFO] Copia estas credenciales y guárdalas de forma segura.")
            print("[INFO] Úsalas para crear la credencial 'FG LinkedIn Auth' en n8n Cloud.")
        else:
            print("  El proceso completó pero no se obtuvieron credenciales automáticamente.")
            print("  Verifica la app en el navegador y copia las credenciales manualmente.")
        print("=" * 60)

        print("\n[INFO] El navegador permanecerá abierto 60 segundos para que verifiques.")
        time.sleep(60)
        context.close()

    sys.exit(0)


if __name__ == "__main__":
    main()
