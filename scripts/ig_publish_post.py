"""Publica un post con imagen en Instagram vía browser automation.

Uso:
    python scripts/ig_publish_post.py --pieza P1_001
    python scripts/ig_publish_post.py --pieza P1_001 --dry-run
    python scripts/ig_publish_post.py --texto "Caption" --imagen path/to/img.png

Requisitos:
    - Playwright + Chrome real
    - Sesión activa en .chrome-ig-stable/
"""

import os
import re
import sys
import time
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO_ROOT = Path(__file__).parent.parent
PRODUCCION_DIR = REPO_ROOT / "04_Produccion"
ASSETS_DIR = REPO_ROOT / "06_Assets"
CHROME_PROFILE_DIR = REPO_ROOT / ".chrome-ig-stable"
DEBUG_DIR = REPO_ROOT / "scripts" / "tmp_ig_debug"
DEBUG_DIR.mkdir(exist_ok=True)
CHROME_PROFILE_DIR.mkdir(parents=True, exist_ok=True)


def find_chrome():
    for c in [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]:
        if os.path.exists(c):
            return c
    return None


def extract_ig_content(pieza: str) -> str | None:
    filepath = PRODUCCION_DIR / f"{pieza}_PublishReady.md"
    if not filepath.exists():
        print(f"[ERROR] No existe: {filepath}")
        return None
    content = filepath.read_text(encoding="utf-8")
    pattern = r"## Instagram\s*\n([\s\S]*?)\n\s*---"
    match = re.search(pattern, content)
    if match:
        text = match.group(1).strip()
        if text:
            return text
    print(f"[WARN] No se encontró sección Instagram en {filepath}")
    return None


def find_image(pieza: str) -> Path | None:
    asset_dir = ASSETS_DIR / pieza
    if not asset_dir.exists():
        return None
    # Prefer Gemini-generated IG image
    for f in sorted(asset_dir.iterdir()):
        if "IG" in f.name.upper() and f.suffix.lower() in (".png", ".jpg", ".jpeg"):
            return f
    # Fallback: any large image
    for f in sorted(asset_dir.iterdir()):
        if f.suffix.lower() in (".png", ".jpg", ".jpeg"):
            return f
    return None


def publish_post(page, image_path: Path, caption: str) -> bool:
    print(f"\n[INFO] Navegando a Instagram...")
    page.goto("https://www.instagram.com/", wait_until="domcontentloaded", timeout=60000)
    time.sleep(5)

    # Check login
    if "/accounts/login" in page.url:
        print("[ERROR] No hay sesión activa. Ejecuta ig_chrome_login.py primero.")
        return False

    # page.screenshot(path=str(DEBUG_DIR / "01_home.png"))

    # Click create button (+ icon in side nav)
    print("[INFO] Buscando botón crear...")
    create_btn = None
    for sel in [
        ':is(a, div[role="button"]):has(svg[aria-label="New post"])',
        ':is(a, div[role="button"]):has(svg[aria-label="Nueva publicación"])',
        'a:has-text("Create")',
        'a:has-text("Crear")',
    ]:
        try:
            loc = page.locator(sel)
            if loc.count() > 0 and loc.first.is_visible(timeout=2000):
                create_btn = loc.first
                print(f"[OK] Botón crear encontrado: {sel}")
                break
        except Exception:
            continue

    if not create_btn:
        print("[ERROR] No se encontró botón crear")
        # page.screenshot(path=str(DEBUG_DIR / "error_no_create.png"))
        return False

    create_btn.click(force=True)
    time.sleep(2)
    # page.screenshot(path=str(DEBUG_DIR / "02_create_clicked.png"))

    # Handle dropdown: click "Post" option using JS click
    post_clicked = False
    for sel in [
        'a:has(svg[aria-label="Post"])',
        'a:has(span:text("Post"))',
        'a:has(span:text("Publicación"))',
        'div[role="dialog"] a >> text="Post"',
    ]:
        try:
            opt = page.locator(sel)
            if opt.count() > 0 and opt.first.is_visible(timeout=2000):
                opt.first.evaluate("el => el.click()")
                print(f"[OK] 'Post' seleccionado: {sel}")
                post_clicked = True
                time.sleep(3)
                break
        except Exception:
            continue

    if not post_clicked:
        # Fallback: look for any visible "Post" text in the dropdown area
        try:
            items = page.locator('a, div[role="menuitem"]')
            for i in range(items.count()):
                item = items.nth(i)
                text = (item.text_content() or "").strip()
                if text == "Post" or text == "Publicación":
                    item.evaluate("el => el.click()")
                    print(f"[OK] 'Post' seleccionado (fallback): '{text}'")
                    post_clicked = True
                    time.sleep(3)
                    break
        except Exception:
            pass

    # page.screenshot(path=str(DEBUG_DIR / "02b_post_selected.png"))

    # Wait for the create dialog/modal to appear
    time.sleep(2)

    # Upload image: first try setting file input directly (it may be hidden)
    print(f"[INFO] Subiendo imagen: {image_path.name}")
    try:
        # Instagram hides the file input — try to find it even if hidden
        file_inputs = page.locator('input[type="file"][accept*="image"]')
        if file_inputs.count() == 0:
            file_inputs = page.locator('input[type="file"]')

        if file_inputs.count() > 0:
            file_inputs.first.set_input_files(str(image_path))
            time.sleep(3)
            # page.screenshot(path=str(DEBUG_DIR / "03_image_uploaded.png"))
            print("[OK] Imagen subida via input directo")
        else:
            # Click "Select from computer" to trigger the file dialog
            for sel in [
                'button:has-text("Select from computer")',
                'button:has-text("Seleccionar del ordenador")',
                'button:has-text("Seleccionar de la computadora")',
                'button:has-text("Select")',
            ]:
                try:
                    btn = page.locator(sel)
                    if btn.count() > 0 and btn.first.is_visible(timeout=2000):
                        # Set up file chooser handler before clicking
                        with page.expect_file_chooser() as fc_info:
                            btn.first.click()
                        file_chooser = fc_info.value
                        file_chooser.set_files(str(image_path))
                        time.sleep(3)
                        print("[OK] Imagen subida via file chooser")
                        break
                except Exception:
                    continue
            # page.screenshot(path=str(DEBUG_DIR / "03_image_uploaded.png"))
    except Exception as e:
        print(f"[ERROR] No se pudo subir imagen: {e}")
        # page.screenshot(path=str(DEBUG_DIR / "error_upload.png"))
        return False

    # Click Next (crop screen)
    for _ in range(2):  # Next on crop, Next on filters
        time.sleep(2)
        for sel in [
            'button:has-text("Next")',
            'button:has-text("Siguiente")',
            'div[role="button"]:has-text("Next")',
            'div[role="button"]:has-text("Siguiente")',
        ]:
            try:
                btn = page.locator(sel)
                if btn.count() > 0 and btn.first.is_visible(timeout=2000):
                    btn.first.evaluate("el => el.click()")
                    print("[OK] Siguiente")
                    time.sleep(2)
                    break
            except Exception:
                continue

    # page.screenshot(path=str(DEBUG_DIR / "04_caption_screen.png"))

    # Enter caption
    print("[INFO] Ingresando caption...")
    caption_selectors = [
        'textarea[aria-label="Write a caption..."]',
        'textarea[aria-label="Escribe un pie de foto..."]',
        'div[contenteditable="true"][role="textbox"]',
        'div[aria-label="Write a caption..."]',
        'div[aria-label="Escribe un pie de foto..."]',
    ]
    caption_el = None
    for sel in caption_selectors:
        try:
            loc = page.locator(sel)
            if loc.count() > 0 and loc.first.is_visible(timeout=2000):
                caption_el = loc.first
                break
        except Exception:
            continue

    if caption_el:
        caption_el.click()
        time.sleep(0.5)
        # Use clipboard paste for speed and reliability
        page.evaluate("t => navigator.clipboard.writeText(t)", caption)
        time.sleep(0.3)
        page.keyboard.press("Control+v")
        time.sleep(2)
        # Press Tab to move focus away and dismiss any hashtag dropdown
        page.keyboard.press("Tab")
        time.sleep(1)
        print(f"[OK] Caption ingresado ({len(caption)} chars)")
    else:
        print("[WARN] No se encontró campo de caption")

    # Dismiss any open popups/dropdowns
    page.keyboard.press("Escape")
    time.sleep(1)

    # page.screenshot(path=str(DEBUG_DIR / "05_before_share.png"))

    # Click the blue "Share" in the modal header
    # Strategy: find the header bar of the Create new post modal, then click its rightmost text
    print("[INFO] Publicando...")
    shared = False

    try:
        result = page.evaluate("""() => {
            // Find the header bar containing "Create new post" or "Crear nueva publicación"
            const allEls = document.querySelectorAll('*');
            let headerBar = null;
            for (const el of allEls) {
                if (el.children.length >= 2) {
                    const txt = el.textContent || '';
                    if ((txt.includes('Create new post') || txt.includes('Crear nueva publicación'))
                        && el.offsetHeight < 80 && el.offsetHeight > 20) {
                        const rect = el.getBoundingClientRect();
                        if (rect.width > 300) {
                            headerBar = el;
                            break;
                        }
                    }
                }
            }
            if (!headerBar) return 'no_header';

            // Find the "Share" child in the header
            const children = headerBar.querySelectorAll('*');
            for (const child of children) {
                const ct = (child.textContent || '').trim();
                if ((ct === 'Share' || ct === 'Compartir') && child.children.length === 0) {
                    child.click();
                    return 'header_share_clicked';
                }
            }

            // Fallback: click the rightmost clickable element in header
            let rightmost = null;
            let maxX = 0;
            for (const child of children) {
                const r = child.getBoundingClientRect();
                if (r.right > maxX && r.width < 100 && r.height < 40 && r.width > 10) {
                    maxX = r.right;
                    rightmost = child;
                }
            }
            if (rightmost) {
                rightmost.click();
                return 'rightmost_clicked: ' + rightmost.textContent.trim();
            }
            return 'no_share_found';
        }""")
        print(f"[DEBUG] Share result: {result}")
        if result and 'clicked' in result:
            time.sleep(12)
            # page.screenshot(path=str(DEBUG_DIR / "06_after_share.png"))
            shared = True
    except Exception as e:
        print(f"[WARN] JS share falló: {e}")

    if not shared:
        print("[ERROR] No se pudo publicar")
        # page.screenshot(path=str(DEBUG_DIR / "error_no_share.png"))
        return False

    # Verify: check if we see "Your post has been shared" or similar success
    time.sleep(3)
    # page.screenshot(path=str(DEBUG_DIR / "07_verify.png"))
    return True


def main():
    parser = argparse.ArgumentParser(description="Publicar en Instagram")
    parser.add_argument("--pieza", help="Nombre de la pieza (ej: P1_001)")
    parser.add_argument("--texto", help="Caption directo")
    parser.add_argument("--imagen", help="Path de la imagen")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    # Get caption
    if args.texto:
        caption = args.texto
    elif args.pieza:
        caption = extract_ig_content(args.pieza)
        if not caption:
            sys.exit(1)
    else:
        print("[ERROR] Especifica --pieza o --texto")
        sys.exit(1)

    # Get image
    if args.imagen:
        image_path = Path(args.imagen)
    elif args.pieza:
        image_path = find_image(args.pieza)
    else:
        image_path = None

    if not image_path or not image_path.exists():
        print(f"[ERROR] Imagen no encontrada: {image_path}")
        sys.exit(1)

    print(f"[OK] Imagen: {image_path}")
    print(f"[OK] Caption: {len(caption)} chars")
    print(f"\n{caption[:200]}{'...' if len(caption) > 200 else ''}\n")

    if args.dry_run:
        print("[DRY_RUN] OK")
        sys.exit(0)

    chrome_exe = find_chrome()
    if not chrome_exe:
        print("[ERROR] Chrome no encontrado")
        sys.exit(1)

    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            user_data_dir=str(CHROME_PROFILE_DIR),
            headless=False,
            args=["--start-maximized", "--no-first-run", "--disable-blink-features=AutomationControlled"],
            executable_path=chrome_exe,
            viewport=None,
            no_viewport=True,
        )
        page = ctx.new_page()
        success = publish_post(page, image_path, caption)
        time.sleep(2)
        ctx.close()

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
