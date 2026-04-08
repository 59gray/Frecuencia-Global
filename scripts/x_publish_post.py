"""Publica un post en X (Twitter) vía browser automation (alternativa gratuita a API).

Uso:
    python scripts/x_publish_post.py --pieza P1_001              # modo real
    python scripts/x_publish_post.py --pieza P1_001 --dry-run    # solo valida, no publica
    python scripts/x_publish_post.py --texto "Hola mundo"        # texto directo

Requisitos:
    - Sesión activa de X guardada en .chrome-x-stable/ (usar x_profile_setup.py primero)
    - Playwright instalado

Notas:
    - Este método es gratuito pero más frágil que la API.
    - Los selectores pueden cambiar si X modifica su UI.
    - Puede violar términos de servicio de X si se usa excesivamente.
"""

import os
import re
import sys
import time
import json
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeoutError

# Configuración compartida
try:
    from fg_automation_config import chrome_executable
except ImportError:
    def chrome_executable():
        return None

# ── Configuración ──────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.parent
PRODUCCION_DIR = REPO_ROOT / "04_Produccion"
CHROME_PROFILE_DIR = REPO_ROOT / ".chrome-x-stable"

X_COMPOSE_URL = "https://x.com/compose/tweet"
MAX_WAIT_LOGIN_SEC = 300

# Selectores de X (pueden cambiar)
SELECTORS = {
    "compose_textarea": [
        'div[data-testid="tweetTextarea_0"]',
        'div[contenteditable="true"][data-testid="tweetTextarea_0"]',
    ],
    "post_button": [
        'button[data-testid="tweetButton"]',
        'button[data-testid="tweetButtonInline"]',
        '[data-testid="tweetButton"]',
    ],
    "login_indicator": [
        '[data-testid="SideNav_AccountSwitcher_Button"]',
        '[data-testid="primaryColumn"]',
    ],
}


def extract_x_content(pieza: str) -> str | None:
    """Extrae el contenido de la sección X (Twitter) de un archivo PublishReady."""
    filepath = PRODUCCION_DIR / f"{pieza}_PublishReady.md"
    if not filepath.exists():
        print(f"[ERROR] No existe: {filepath}")
        return None

    content = filepath.read_text(encoding="utf-8")
    # Formato 1: contenido en code fences (``` ... ```)
    pattern_fenced = r"## X \(Twitter\)\s*\n```[^\n]*\n(.*?)```"
    match = re.search(pattern_fenced, content, re.DOTALL)
    if match:
        return match.group(1).strip()

    # Formato 2: texto plano entre heading y siguiente delimitador (--- o ##)
    pattern_plain = r"## X \(Twitter\)\s*\n(.*?)(?=\n---|\n## |\Z)"
    match = re.search(pattern_plain, content, re.DOTALL)
    if match:
        text = match.group(1).strip()
        # Limpiar líneas de metadata como _Longitud: ..._
        lines = [l for l in text.split("\n") if not l.strip().startswith("_Longitud:")]
        text = "\n".join(lines).strip()
        if text:
            return text

    print(f"[WARN] No se encontró sección X (Twitter) en {filepath}")
    return None


def validate_text_length(text: str, max_len: int = 280) -> bool:
    length = len(text)
    if length > max_len:
        print(f"[ERROR] Texto excede límite: {length}/{max_len} caracteres")
        return False
    print(f"[OK] Longitud: {length}/{max_len} caracteres")
    return True


def wait_for_login(page, timeout_sec: int = MAX_WAIT_LOGIN_SEC) -> bool:
    print(f"\n[INFO] Esperando login (máximo {timeout_sec // 60} minutos)...")
    deadline = time.time() + timeout_sec

    while time.time() < deadline:
        if "x.com" in page.url and "/login" not in page.url and "/flow" not in page.url:
            for sel in SELECTORS["login_indicator"]:
                try:
                    page.wait_for_selector(sel, timeout=3000)
                    print("[OK] Sesión activa detectada")
                    return True
                except PWTimeoutError:
                    continue
        time.sleep(2)

    return False


def find_working_selector(page, selectors: list):
    for sel in selectors:
        try:
            locator = page.locator(sel)
            if locator.count() > 0 and locator.first.is_visible(timeout=2000):
                return locator.first
        except Exception:
            continue
    return None


def emit_result(ok: bool, **payload):
    print(json.dumps({"ok": ok, **payload}, ensure_ascii=False))


def publish_post(page, text: str):
    debug_dir = REPO_ROOT / "scripts" / "tmp_x_debug"
    debug_dir.mkdir(exist_ok=True)

    print(f"\n[INFO] Navegando a {X_COMPOSE_URL}")
    page.goto(X_COMPOSE_URL, wait_until="domcontentloaded", timeout=60000)
    time.sleep(5)
    print(f"[DEBUG] URL actual: {page.url}")

    if "/login" in page.url or "/flow" in page.url:
        print("[INFO] Redirigido a login — esperando sesión...")
        if not wait_for_login(page):
            return {"published": False, "error": "login_timeout"}
        page.goto(X_COMPOSE_URL, wait_until="domcontentloaded", timeout=60000)
        time.sleep(5)
        print(f"[DEBUG] URL después de login: {page.url}")

    # Extra wait for SPA to render
    time.sleep(3)
    page.screenshot(path=str(debug_dir / "01_compose_loaded.png"))
    print(f"[DEBUG] Screenshot: tmp_x_debug/01_compose_loaded.png")

    textarea = find_working_selector(page, SELECTORS["compose_textarea"])
    if not textarea:
        print("[ERROR] No se encontró el campo de texto")
        return {"published": False, "error": "compose_textarea_not_found"}

    try:
        # Use JavaScript to focus the textarea directly
        textarea.evaluate("el => el.focus()")
        time.sleep(0.3)
        textarea.click(force=True)
        time.sleep(0.5)
        page.keyboard.type(text, delay=15)
        time.sleep(1)
        page.screenshot(path=str(debug_dir / "02_text_entered.png"))
        print(f"[OK] Texto ingresado (screenshot: tmp_x_debug/02_text_entered.png)")
    except Exception as e:
        print(f"[ERROR] No se pudo escribir: {e}")
        page.screenshot(path=str(debug_dir / "error_write.png"))
        return {"published": False, "error": f"write_failed: {e}"}

    post_btn = find_working_selector(page, SELECTORS["post_button"])
    if not post_btn:
        print("[ERROR] No se encontró el botón Post")
        page.screenshot(path=str(debug_dir / "error_no_button.png"))
        return {"published": False, "error": "post_button_not_found"}

    try:
        for _ in range(10):
            if post_btn.is_enabled():
                break
            time.sleep(0.5)

        page.screenshot(path=str(debug_dir / "03_before_click.png"))
        # Use JS click to trigger React event handlers properly
        post_btn.evaluate("el => el.click()")
        time.sleep(5)
        page.screenshot(path=str(debug_dir / "04_after_click.png"))
        print(f"[DEBUG] Screenshots guardados en tmp_x_debug/")

        # Check if we're back on home (success) or still on compose (failure)
        current_url = page.url
        print(f"[DEBUG] URL después de post: {current_url}")
        if "/compose" not in current_url:
            print("[OK] Post publicado — redirigido fuera de compose")
            tweet_url = current_url if "/status/" in current_url else None
            tweet_id = None
            if tweet_url:
                match = re.search(r"/status/(\d+)", tweet_url)
                if match:
                    tweet_id = match.group(1)
            return {
                "published": True,
                "url": tweet_url,
                "tweetId": tweet_id,
                "textLength": len(text),
            }
        else:
            print("[WARN] Aún en compose — el post podría no haberse enviado")
            return {"published": False, "error": "still_in_compose", "textLength": len(text)}
    except Exception as e:
        print(f"[ERROR] No se pudo hacer click en Post: {e}")
        page.screenshot(path=str(debug_dir / "error_click.png"))
        return {"published": False, "error": f"post_click_failed: {e}"}


def main():
    parser = argparse.ArgumentParser(description="Publicar en X vía browser automation")
    parser.add_argument("--pieza", help="Nombre de la pieza (ej: P1_001)")
    parser.add_argument("--texto", help="Texto directo a publicar")
    parser.add_argument("--dry-run", action="store_true", help="Solo validar")
    args = parser.parse_args()

    if args.texto:
        text = args.texto
    elif args.pieza:
        text = extract_x_content(args.pieza)
        if not text:
            emit_result(False, pieza=args.pieza, error="publish_ready_x_block_not_found")
            sys.exit(1)
    else:
        print("[ERROR] Debes especificar --pieza o --texto")
        emit_result(False, error="missing_required_argument")
        sys.exit(1)

    if not validate_text_length(text):
        emit_result(False, pieza=args.pieza, error="text_too_long", textLength=len(text))
        sys.exit(1)

    print(f"\nContenido:\n{text}\n")

    if args.dry_run:
        print("[DRY_RUN] Validación OK")
        emit_result(True, pieza=args.pieza, dryRun=True, textLength=len(text))
        sys.exit(0)

    if not CHROME_PROFILE_DIR.exists():
        print(f"[ERROR] No existe perfil: {CHROME_PROFILE_DIR}")
        print("[INFO] Ejecuta primero: python scripts/x_profile_setup.py")
        emit_result(False, pieza=args.pieza, error="chrome_profile_missing")
        sys.exit(1)

    chrome_exe = chrome_executable()
    # Prefer real Chrome to avoid automation detection by X
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

    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(**launch_args)
        page = context.new_page()
        result = publish_post(page, text)
        time.sleep(2)
        context.close()

    emit_result(bool(result.get("published")), pieza=args.pieza, **result)
    sys.exit(0 if result.get("published") else 1)


if __name__ == "__main__":
    main()
