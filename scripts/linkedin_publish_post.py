"""Publica un post en la Company Page de LinkedIn vía browser automation.

Uso:
    python scripts/linkedin_publish_post.py --pieza P1_001              # modo real
    python scripts/linkedin_publish_post.py --pieza P1_001 --dry-run    # solo valida
    python scripts/linkedin_publish_post.py --texto "Hola mundo"        # texto directo

Requisitos:
    - Playwright instalado
    - Ser admin de la Company Page de Frecuencia Global en LinkedIn
    - Primera ejecución: login manual en la ventana del navegador

Notas:
    - Publica en la Company Page, no en perfil personal.
    - Más frágil que API. Selectores pueden cambiar.
"""

import os
import re
import sys
import time
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeoutError

try:
    from fg_automation_config import chrome_executable, LINKEDIN_COMPANY_SLUG
except ImportError:
    def chrome_executable():
        return None
    LINKEDIN_COMPANY_SLUG = "frecuencia-global"

# ── Configuración ──────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.parent
PRODUCCION_DIR = REPO_ROOT / "04_Produccion"
CHROME_PROFILE_DIR = REPO_ROOT / ".chrome-linkedin-stable"

COMPANY_PAGE_URL = f"https://www.linkedin.com/company/{LINKEDIN_COMPANY_SLUG}"
MAX_WAIT_LOGIN_SEC = 300


# ── Parsing de PublishReady ────────────────────────────────────────────────────
def extract_linkedin_content(pieza: str) -> str | None:
    """Extrae el contenido de la sección LinkedIn de un archivo PublishReady."""
    filepath = PRODUCCION_DIR / f"{pieza}_PublishReady.md"
    if not filepath.exists():
        print(f"[ERROR] No existe: {filepath}")
        return None

    content = filepath.read_text(encoding="utf-8")

    # Buscar sección ## LinkedIn ... ---
    pattern = r"## LinkedIn\s*\n([\s\S]*?)\n\s*---"
    match = re.search(pattern, content)

    if match:
        text = match.group(1).strip()
        if text:
            return text

    print(f"[WARN] No se encontró sección LinkedIn en {filepath}")
    return None


def validate_text(text: str) -> bool:
    """Valida el contenido del post."""
    length = len(text)
    if length == 0:
        print("[ERROR] Texto vacío")
        return False
    if length > 3000:
        print(f"[ERROR] Texto excede límite: {length}/3000 caracteres")
        return False
    print(f"[OK] Longitud: {length}/3000 caracteres")
    return True


# ── Browser automation ─────────────────────────────────────────────────────────
def wait_for_login(page, timeout_sec: int = MAX_WAIT_LOGIN_SEC) -> bool:
    """Espera a que el usuario esté autenticado en LinkedIn."""
    print(f"\n[INFO] Esperando login (máximo {timeout_sec // 60} minutos)...")
    print("[INFO] Inicia sesión en la ventana del navegador si es necesario.")

    deadline = time.time() + timeout_sec
    while time.time() < deadline:
        url = page.url
        if "linkedin.com" in url and "/login" not in url and "/authwall" not in url and "/uas" not in url:
            try:
                page.wait_for_selector(
                    'nav, .global-nav, [data-test-global-nav]',
                    timeout=3000,
                )
                print("[OK] Sesión activa detectada")
                return True
            except PWTimeoutError:
                pass
        time.sleep(2)

    print("[ERROR] Tiempo de espera agotado")
    return False


def switch_to_company_page(page) -> bool:
    """Navega a la Company Page y verifica acceso de admin."""
    print(f"\n[INFO] Navegando a {COMPANY_PAGE_URL}")
    page.goto(COMPANY_PAGE_URL, wait_until="domcontentloaded", timeout=60000)
    time.sleep(3)

    # Verificar si requiere login
    if "/login" in page.url or "/authwall" in page.url:
        if not wait_for_login(page):
            return False
        page.goto(COMPANY_PAGE_URL, wait_until="domcontentloaded", timeout=60000)
        time.sleep(3)

    # Verificar que estamos en la Company Page
    try:
        page.wait_for_selector(
            'button:has-text("View as admin"), button:has-text("Ver como admin"), '
            'a:has-text("View as admin"), a:has-text("Ver como admin")',
            timeout=5000,
        )
        print("[OK] Acceso admin a Company Page confirmado")
    except PWTimeoutError:
        print("[WARN] No se detectó acceso admin, intentando continuar...")

    return True


def publish_post(page, text: str) -> bool:
    """Publica un post en la Company Page de LinkedIn."""
    debug_dir = REPO_ROOT / "scripts" / "tmp_linkedin_debug"
    debug_dir.mkdir(exist_ok=True)

    if not switch_to_company_page(page):
        return False

    page.screenshot(path=str(debug_dir / "01_company_page.png"))
    print(f"[DEBUG] Screenshot: tmp_linkedin_debug/01_company_page.png")

    # Buscar botón "Start a post" / "Crear una publicación"
    print("\n[INFO] Buscando botón para crear post...")
    post_trigger = None
    trigger_selectors = [
        'button:has-text("Create")',
        'button:has-text("Crear")',
        'button:has-text("Start a post")',
        'button:has-text("Crear una publicación")',
        'button:has-text("Create a post")',
        'button.share-box-feed-entry__trigger',
        '[data-test-id="share-box-feed-entry__trigger"]',
        'button:has-text("Share that you")',
    ]

    for sel in trigger_selectors:
        try:
            locator = page.locator(sel)
            if locator.count() > 0 and locator.first.is_visible(timeout=2000):
                post_trigger = locator.first
                break
        except Exception:
            continue

    if not post_trigger:
        print("[ERROR] No se encontró el botón para crear post")
        return False
    else:
        post_trigger.click()
        time.sleep(2)
        page.screenshot(path=str(debug_dir / "02_after_create_click.png"))
        print(f"[DEBUG] Screenshot: tmp_linkedin_debug/02_after_create_click.png")

        # Handle dropdown menu if it appeared
        dropdown_options = [
            'div[role="menuitem"]:has-text("Start a post")',
            'div[role="menuitem"]:has-text("Crear una publicación")',
            'li:has-text("Start a post")',
            'span:has-text("Start a post")',
            '[data-test-id="share-box-feed-entry__option--text"]',
        ]
        for sel in dropdown_options:
            try:
                opt = page.locator(sel)
                if opt.count() > 0 and opt.first.is_visible(timeout=2000):
                    print(f"[INFO] Dropdown detectado, seleccionando: {sel}")
                    opt.first.click()
                    time.sleep(2)
                    break
            except Exception:
                continue

    # Esperar el modal/editor de texto
    print("[INFO] Esperando editor de texto...")
    editor = None
    editor_selectors = [
        'div.ql-editor[contenteditable="true"]',
        '[role="textbox"][contenteditable="true"]',
        'div[data-placeholder="What do you want to talk about?"]',
        'div[data-placeholder]',
        '.editor-content [contenteditable="true"]',
    ]

    for sel in editor_selectors:
        try:
            locator = page.locator(sel)
            if locator.count() > 0 and locator.first.is_visible(timeout=3000):
                editor = locator.first
                break
        except Exception:
            continue

    if not editor:
        print("[ERROR] No se encontró el editor de texto")
        return False

    # Escribir el texto
    try:
        editor.click()
        time.sleep(0.5)

        # Escribir línea por línea para preservar formato
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if i > 0:
                page.keyboard.press("Enter")
            page.keyboard.type(line, delay=5)

        time.sleep(1)
        print(f"[OK] Texto ingresado ({len(text)} caracteres)")
    except Exception as e:
        print(f"[ERROR] No se pudo escribir el texto: {e}")
        return False

    # Buscar y hacer click en el botón Post/Publicar
    print("[INFO] Buscando botón Publicar...")
    post_btn = None
    post_selectors = [
        'button.share-actions__primary-action:has-text("Post")',
        'button:has-text("Post"):not([disabled])',
        'button:has-text("Publicar"):not([disabled])',
        'button.share-actions__primary-action',
    ]

    time.sleep(1)

    for sel in post_selectors:
        try:
            locator = page.locator(sel)
            if locator.count() > 0 and locator.first.is_visible(timeout=2000):
                post_btn = locator.first
                break
        except Exception:
            continue

    if not post_btn:
        print("[ERROR] No se encontró el botón Publicar")
        return False

    try:
        # Esperar a que el botón esté habilitado
        for _ in range(10):
            if post_btn.is_enabled():
                break
            time.sleep(0.5)

        post_btn.evaluate("el => el.click()")
        time.sleep(5)
        print("[OK] Post publicado en Company Page")
        return True
    except Exception as e:
        print(f"[ERROR] No se pudo publicar: {e}")
        return False


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Publicar en LinkedIn Company Page vía browser automation")
    parser.add_argument("--pieza", help="Nombre de la pieza (ej: P1_001)")
    parser.add_argument("--texto", help="Texto directo a publicar")
    parser.add_argument("--dry-run", action="store_true", help="Solo validar, no publicar")
    args = parser.parse_args()

    # Obtener texto
    if args.texto:
        text = args.texto
    elif args.pieza:
        text = extract_linkedin_content(args.pieza)
        if not text:
            sys.exit(1)
        print(f"[INFO] Contenido extraído de {args.pieza}_PublishReady.md")
    else:
        print("[ERROR] Debes especificar --pieza o --texto")
        sys.exit(1)

    if not validate_text(text):
        sys.exit(1)

    print(f"\nContenido:\n{text}\n")

    if args.dry_run:
        print("[DRY_RUN] Validación OK")
        sys.exit(0)

    # Crear directorio de perfil
    CHROME_PROFILE_DIR.mkdir(parents=True, exist_ok=True)

    chrome_exe = chrome_executable()
    # Prefer real Chrome to avoid automation detection
    if not chrome_exe:
        for candidate in [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        ]:
            if os.path.exists(candidate):
                chrome_exe = candidate
                break

    launch_args = {
        "user_data_dir": str(CHROME_PROFILE_DIR),
        "headless": False,
        "args": ["--start-maximized", "--no-first-run", "--disable-blink-features=AutomationControlled"],
        "viewport": None,
        "no_viewport": True,
    }
    if chrome_exe:
        launch_args["executable_path"] = str(chrome_exe)

    print("[INFO] Iniciando navegador...")

    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(**launch_args)
        page = context.new_page()
        success = publish_post(page, text)
        time.sleep(2)
        context.close()

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
