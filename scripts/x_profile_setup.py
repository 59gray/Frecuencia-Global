"""Aplica identidad de perfil en X (Twitter): avatar, banner, bio, nombre, link.

Uso:
    python scripts/x_profile_setup.py              # modo real
    python scripts/x_profile_setup.py --dry-run    # sólo valida, no toca X

Primera ejecución: el navegador abrirá X. Inicia sesión manualmente.
Las siguientes ejecuciones usan la sesión guardada en .chrome-x-stable/.
"""

import os
import sys
import struct
import time
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeoutError
from fg_automation_config import WEBSITE_URL, chrome_executable

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(errors="replace")

# ── Configuración ──────────────────────────────────────────────────────────────
DRY_RUN: bool = "--dry-run" in sys.argv

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

AVATAR_PATH = os.path.join(REPO_ROOT, "06_Assets", "FG_MK_Avatar_X-Profile_v1.png")
BANNER_PATH = os.path.join(REPO_ROOT, "06_Assets", "FG_MK_BNR_X-Header_v1.png")

DISPLAY_NAME = "Frecuencia Global"
BIO = (
    "Análisis internacional con pulso electrónico ⚡ "
    "Geopolítica × música electrónica × datos | "
    "Threads, análisis y frecuencias 🌐"
)
WEBSITE = WEBSITE_URL

CHROME_EXE = str(chrome_executable())
CHROME_PROFILE_DIR = os.path.join(REPO_ROOT, ".chrome-x-stable")

X_SETTINGS_URL = "https://x.com/settings/profile"
MAX_WAIT_LOGIN_SEC = 300  # 5 minutos

# ── Estado de resultados ────────────────────────────────────────────────────────
_results: list = []


def _log(step: str, status: str, detail: str = "") -> None:
    _results.append((step, status, detail))
    icon = {"OK": "[OK]", "FAIL": "[FAIL]", "DRY_RUN": "[DRY]", "WARN": "[WARN]"}.get(status, "[..]")
    line = f"  {icon}  {step}"
    if detail:
        line += f"  -  {detail}"
    print(line)


# ── Validación de activos ───────────────────────────────────────────────────────
def _get_png_dims(path: str):
    with open(path, "rb") as f:
        hdr = f.read(24)
    if hdr[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("No es un PNG válido")
    w, h = struct.unpack(">II", hdr[16:24])
    return w, h


def validate_assets() -> bool:
    ok = True
    specs = [
        ("Avatar", AVATAR_PATH, 400, 400),
        ("Banner", BANNER_PATH, 1500, 500),
    ]
    for label, path, exp_w, exp_h in specs:
        if not os.path.exists(path):
            _log(f"Asset {label}", "FAIL", f"No encontrado: {path}")
            ok = False
            continue
        try:
            w, h = _get_png_dims(path)
            status = "OK" if (w == exp_w and h == exp_h) else "WARN"
            _log(f"Asset {label}", status, f"{w}×{h}px (esperado {exp_w}×{exp_h})")
        except Exception as e:
            _log(f"Asset {label}", "FAIL", str(e))
            ok = False

    bio_len = len(BIO)
    if bio_len <= 160:
        _log("Bio longitud", "OK", f"{bio_len}/160 chars")
    else:
        _log("Bio longitud", "FAIL", f"{bio_len} chars — excede límite de 160")
        ok = False

    return ok


# ── Helpers de browser ──────────────────────────────────────────────────────────
def _wait_for_login(page) -> bool:
    """Espera hasta que el usuario esté autenticado en X."""
    print(
        "\n  ⏳  Si no estás logoneado en X, inicia sesión en la ventana del navegador.\n"
        f"      Tiempo límite: {MAX_WAIT_LOGIN_SEC // 60} minutos.\n"
    )
    deadline = time.time() + MAX_WAIT_LOGIN_SEC
    while time.time() < deadline:
        current_url = page.url
        if "x.com" in current_url and "/login" not in current_url and "/flow" not in current_url:
            # Verificar que hay elementos de UI autenticada
            try:
                page.wait_for_selector(
                    '[data-testid="SideNav_AccountSwitcher_Button"], '
                    '[data-testid="primaryColumn"], '
                    'nav[aria-label="Primary"]',
                    timeout=3000,
                )
                return True
            except PWTimeoutError:
                pass
        time.sleep(2)
    return False


def _fill_field(page, selector: str, value: str, timeout: int = 10000) -> None:
    """Limpia y rellena un input/textarea en X (compatible con React)."""
    page.wait_for_selector(selector, state="visible", timeout=timeout)
    page.click(selector)
    page.keyboard.press("Control+a")
    page.keyboard.press("Backspace")
    time.sleep(0.3)
    page.fill(selector, value)


def _dismiss_crop_dialog(page) -> None:
    """Si aparece un modal de recorte, lo acepta."""
    for btn_name in ["Apply", "Done", "Aplicar", "Save"]:
        try:
            btn = page.get_by_role("button", name=btn_name, exact=False)
            if btn.first.is_visible(timeout=2500):
                btn.first.click()
                time.sleep(1)
                return
        except Exception:
            pass


# ── Pasos de configuración ──────────────────────────────────────────────────────
def step_upload_banner(page) -> None:
    if DRY_RUN:
        _log("Upload banner", "DRY_RUN", os.path.basename(BANNER_PATH))
        return
    try:
        # Estrategia 1: vía filechooser (botón cámara del header)
        trigger_selectors = [
            '[data-testid="headerPhotoEditButton"]',
            '[aria-label*="Add photos to header" i]',
            '[aria-label*="banner" i]',
            '[aria-label*="header photo" i]',
        ]
        uploaded = False
        for sel in trigger_selectors:
            try:
                if page.locator(sel).count() > 0:
                    with page.expect_file_chooser(timeout=8000) as fc_info:
                        page.locator(sel).first.click()
                    fc_info.value.set_files(BANNER_PATH)
                    time.sleep(2)
                    _dismiss_crop_dialog(page)
                    _log("Upload banner", "OK", os.path.basename(BANNER_PATH))
                    uploaded = True
                    break
            except Exception:
                pass

        if not uploaded:
            # Estrategia 2: set_input_files directo en primer input[type=file]
            inputs = page.locator('input[type="file"]')
            inputs.nth(0).set_input_files(BANNER_PATH)
            time.sleep(2)
            _dismiss_crop_dialog(page)
            _log("Upload banner", "OK", "(fallback directo)")

    except Exception as e:
        _log("Upload banner", "FAIL", str(e))


def step_upload_avatar(page) -> None:
    if DRY_RUN:
        _log("Upload avatar", "DRY_RUN", os.path.basename(AVATAR_PATH))
        return
    try:
        trigger_selectors = [
            '[data-testid="profilePhotoEditButton"]',
            '[aria-label*="profile photo" i]',
            '[aria-label*="avatar" i]',
        ]
        uploaded = False
        for sel in trigger_selectors:
            try:
                if page.locator(sel).count() > 0:
                    with page.expect_file_chooser(timeout=8000) as fc_info:
                        page.locator(sel).first.click()
                    fc_info.value.set_files(AVATAR_PATH)
                    time.sleep(2)
                    _dismiss_crop_dialog(page)
                    _log("Upload avatar", "OK", os.path.basename(AVATAR_PATH))
                    uploaded = True
                    break
            except Exception:
                pass

        if not uploaded:
            # Fallback: segundo input[type=file] (avatar suele ser el segundo)
            inputs = page.locator('input[type="file"]')
            count = inputs.count()
            idx = 1 if count > 1 else 0
            inputs.nth(idx).set_input_files(AVATAR_PATH)
            time.sleep(2)
            _dismiss_crop_dialog(page)
            _log("Upload avatar", "OK", "(fallback directo)")

    except Exception as e:
        _log("Upload avatar", "FAIL", str(e))


def step_set_name(page) -> None:
    if DRY_RUN:
        _log("Display name", "DRY_RUN", DISPLAY_NAME)
        return
    try:
        _fill_field(page, 'input[name="displayName"]', DISPLAY_NAME)
        _log("Display name", "OK", DISPLAY_NAME)
    except Exception as e:
        _log("Display name", "FAIL", str(e))


def step_set_bio(page) -> None:
    if DRY_RUN:
        _log("Bio", "DRY_RUN", f"{len(BIO)} chars")
        return
    try:
        _fill_field(page, 'textarea[name="description"]', BIO, timeout=10000)
        _log("Bio", "OK", f"{len(BIO)} chars")
    except Exception as e:
        _log("Bio", "FAIL", str(e))


def step_set_website(page) -> None:
    if DRY_RUN:
        _log("Website", "DRY_RUN", WEBSITE)
        return
    try:
        _fill_field(page, 'input[name="url"]', WEBSITE)
        _log("Website", "OK", WEBSITE)
    except Exception as e:
        _log("Website", "FAIL", str(e))


def step_save(page) -> None:
    if DRY_RUN:
        _log("Save profile", "DRY_RUN")
        return
    try:
        save_btn = page.get_by_role("button", name="Save", exact=True)
        if not save_btn.is_visible(timeout=5000):
            # Intentar con texto en español
            save_btn = page.get_by_role("button", name="Guardar", exact=True)
        save_btn.click()
        time.sleep(3)
        _log("Save profile", "OK")
    except Exception as e:
        _log("Save profile", "FAIL", str(e))


# ── Reporte ─────────────────────────────────────────────────────────────────────
def print_report() -> None:
    ok   = sum(1 for _, s, _ in _results if s == "OK")
    fail = sum(1 for _, s, _ in _results if s == "FAIL")
    dry  = sum(1 for _, s, _ in _results if s == "DRY_RUN")
    warn = sum(1 for _, s, _ in _results if s == "WARN")

    print("\n" + "-" * 60)
    tag = "DRY_RUN" if DRY_RUN else ("PASS" if fail == 0 else "FAIL")
    print(f"  {tag}   OK={ok}  FAIL={fail}  WARN={warn}  DRY={dry}")
    print("-" * 60)


# ── Main ────────────────────────────────────────────────────────────────────────
def main() -> None:
    print("=" * 60)
    print("  X Profile Setup — Frecuencia Global")
    print(f"  DRY_RUN = {DRY_RUN}")
    print("=" * 60 + "\n")

    print("[1/3] Validando activos y datos...")
    if not validate_assets():
        print("\n  ❌  Activos inválidos. Corrige los errores antes de continuar.")
        print_report()
        sys.exit(1)

    if DRY_RUN:
        print("\n[2/3] Simulando pasos (sin tocar X)...")
        for fn in [
            step_upload_banner,
            step_upload_avatar,
            step_set_name,
            step_set_bio,
            step_set_website,
            step_save,
        ]:
            fn(None)
        print("\n[3/3] DRY_RUN completado.")
        print_report()
        return

    print("\n[2/3] Iniciando navegador...")
    os.makedirs(CHROME_PROFILE_DIR, exist_ok=True)


    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            CHROME_PROFILE_DIR,
            headless=False,
            executable_path=CHROME_EXE,
            args=[
                "--start-maximized",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-features=ChromeWhatsNew",
            ],
            viewport=None,
            no_viewport=True,
        )

        page = context.new_page()
        print(f"  → Navegando a {X_SETTINGS_URL}")
        page.goto(X_SETTINGS_URL, wait_until="domcontentloaded", timeout=60000)
        time.sleep(2)

        # Detectar si se requiere login
        if "/login" in page.url or "/flow/login" in page.url:
            _log("Sesión X", "WARN", "No autenticado — esperando login manual")
            if not _wait_for_login(page):
                _log("Login", "FAIL", "Tiempo de espera agotado")
                print_report()
                context.close()
                sys.exit(1)
            page.goto(X_SETTINGS_URL, wait_until="domcontentloaded", timeout=60000)
            time.sleep(2)
        else:
            _log("Sesión X", "OK", "Autenticado")

        # Esperar formulario de perfil en settings/profile
        found_form = False
        try:
            page.wait_for_selector(
                'input[name="displayName"], input[placeholder*="Name" i]',
                timeout=15000,
            )
            _log("Carga settings/profile", "OK")
            found_form = True
        except PWTimeoutError:
            _log("Carga settings/profile", "FAIL", "No se encontró el formulario — intentando desde perfil público")

        # Fallback: ir al perfil público y buscar botón Edit Profile
        if not found_form:
            profile_url = "https://x.com/frec_global"
            print(f"  → Fallback: navegando a {profile_url}")
            page.goto(profile_url, wait_until="domcontentloaded", timeout=60000)
            time.sleep(2)
            # Buscar botón Edit Profile
            edit_btn = None
            for i in range(10):
                try:
                    edit_btn = page.locator('a:has-text("Edit profile"), button:has-text("Edit profile"), a:has-text("Editar perfil"), button:has-text("Editar perfil")').first
                    if edit_btn.is_visible(timeout=2000):
                        edit_btn.click()
                        time.sleep(2)
                        break
                except Exception:
                    pass
                page.reload(wait_until="domcontentloaded")
                time.sleep(2)
            # Esperar formulario
            try:
                page.wait_for_selector('input[placeholder*="Name" i], input[name*="name" i]', timeout=10000)
                _log("Formulario perfil público", "OK")
                found_form = True
            except PWTimeoutError:
                _log("Formulario perfil público", "FAIL", "No se encontró el formulario de edición")
                print_report()
                context.close()
                sys.exit(1)

        print("\n[3/3] Aplicando identidad...")
        step_upload_banner(page)
        time.sleep(1)
        step_upload_avatar(page)
        time.sleep(1)
        step_set_name(page)
        step_set_bio(page)
        step_set_website(page)
        step_save(page)

        time.sleep(3)
        context.close()

    print_report()
    if any(s == "FAIL" for _, s, _ in _results):
        sys.exit(1)


if __name__ == "__main__":
    main()
