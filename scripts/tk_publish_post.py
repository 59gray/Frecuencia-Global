"""Publica un post con imagen en TikTok vía browser automation.

Uso:
    python scripts/tk_publish_post.py --pieza P1_001
    python scripts/tk_publish_post.py --pieza P1_001 --dry-run
    python scripts/tk_publish_post.py --texto "Caption" --imagen path/to/img.png

Requisitos:
    - Playwright + Chrome real
    - Sesión activa en .chrome-tk-stable/
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
CHROME_PROFILE_DIR = REPO_ROOT / ".chrome-tk-stable"
DEBUG_DIR = REPO_ROOT / "scripts" / "tmp_tk_debug"
DEBUG_DIR.mkdir(exist_ok=True)
CHROME_PROFILE_DIR.mkdir(parents=True, exist_ok=True)

TIKTOK_UPLOAD_URL = "https://www.tiktok.com/creator#/upload?scene=creator_center"


def find_chrome():
    for c in [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]:
        if os.path.exists(c):
            return c
    return None


def extract_tk_content(pieza: str) -> str | None:
    filepath = PRODUCCION_DIR / f"{pieza}_PublishReady.md"
    if not filepath.exists():
        print(f"[ERROR] No existe: {filepath}")
        return None
    content = filepath.read_text(encoding="utf-8")
    # Try TikTok section first
    for section in ["TikTok", "Instagram"]:
        pattern = rf"## {section}\s*\n([\s\S]*?)\n\s*---"
        match = re.search(pattern, content)
        if match:
            text = match.group(1).strip()
            if text:
                return text
    print(f"[WARN] No se encontró sección TikTok/Instagram en {filepath}")
    return None


def find_image(pieza: str) -> Path | None:
    asset_dir = ASSETS_DIR / pieza
    if not asset_dir.exists():
        return None
    # Prefer Gemini-generated TK image
    for f in sorted(asset_dir.iterdir()):
        if "TK" in f.name.upper() and f.suffix.lower() in (".png", ".jpg", ".jpeg"):
            return f
    for f in sorted(asset_dir.iterdir()):
        if f.suffix.lower() in (".png", ".jpg", ".jpeg"):
            return f
    return None


def publish_post(page, image_path: Path, caption: str) -> bool:
    print(f"\n[INFO] Navegando a TikTok Creator Center...")
    page.goto(TIKTOK_UPLOAD_URL, wait_until="domcontentloaded", timeout=60000)
    time.sleep(5)

    # Check login
    if "/login" in page.url:
        print("[ERROR] No hay sesión activa. Ejecuta tk_chrome_login.py primero.")
        return False

    page.screenshot(path=str(DEBUG_DIR / "01_upload_page.png"))

    # Upload image via file input
    print(f"[INFO] Subiendo imagen: {image_path.name}")
    try:
        file_input = page.locator('input[type="file"]')
        if file_input.count() > 0:
            file_input.first.set_input_files(str(image_path))
            time.sleep(5)
            page.screenshot(path=str(DEBUG_DIR / "02_image_uploaded.png"))
            print("[OK] Imagen subida")
        else:
            # Try clicking upload area first
            for sel in [
                'button:has-text("Select file")',
                'button:has-text("Seleccionar archivo")',
                'div.upload-card',
                '[class*="upload"]',
            ]:
                try:
                    btn = page.locator(sel)
                    if btn.count() > 0:
                        btn.first.click()
                        time.sleep(2)
                        break
                except Exception:
                    continue
            file_input = page.locator('input[type="file"]')
            file_input.first.set_input_files(str(image_path))
            time.sleep(5)
            print("[OK] Imagen subida")
    except Exception as e:
        print(f"[ERROR] No se pudo subir imagen: {e}")
        page.screenshot(path=str(DEBUG_DIR / "error_upload.png"))
        return False

    # Switch to photo mode if needed
    for sel in [
        'div[role="tab"]:has-text("Photo")',
        'div[role="tab"]:has-text("Foto")',
        'button:has-text("Switch to photo mode")',
    ]:
        try:
            tab = page.locator(sel)
            if tab.count() > 0 and tab.first.is_visible(timeout=2000):
                tab.first.click()
                time.sleep(2)
                break
        except Exception:
            continue

    # Enter caption
    print("[INFO] Ingresando caption...")
    caption_selectors = [
        'div[contenteditable="true"]',
        '[data-placeholder]',
        'div.public-DraftEditor-content',
        'div[role="textbox"]',
    ]
    caption_el = None
    for sel in caption_selectors:
        try:
            loc = page.locator(sel)
            if loc.count() > 0 and loc.first.is_visible(timeout=3000):
                caption_el = loc.first
                break
        except Exception:
            continue

    if caption_el:
        caption_el.click()
        time.sleep(0.5)
        # Clear existing text
        page.keyboard.press("Control+a")
        page.keyboard.press("Backspace")
        time.sleep(0.3)
        # Paste caption via clipboard for speed
        page.evaluate("text => navigator.clipboard.writeText(text)", caption)
        time.sleep(0.3)
        page.keyboard.press("Control+v")
        time.sleep(1)
        print(f"[OK] Caption ingresado ({len(caption)} chars)")
    else:
        print("[WARN] No se encontró campo de caption")

    page.screenshot(path=str(DEBUG_DIR / "03_before_post.png"))

    # Click Post
    print("[INFO] Publicando...")
    for sel in [
        'button:has-text("Post")',
        'button:has-text("Publicar")',
        'div[role="button"]:has-text("Post")',
    ]:
        try:
            btn = page.locator(sel)
            if btn.count() > 0 and btn.first.is_visible(timeout=2000):
                btn.first.evaluate("el => el.click()")
                time.sleep(10)
                page.screenshot(path=str(DEBUG_DIR / "04_after_post.png"))
                print("[OK] Post publicado en TikTok")
                return True
        except Exception:
            continue

    print("[ERROR] No se encontró botón publicar")
    page.screenshot(path=str(DEBUG_DIR / "error_no_post.png"))
    return False


def main():
    parser = argparse.ArgumentParser(description="Publicar en TikTok")
    parser.add_argument("--pieza", help="Nombre de la pieza")
    parser.add_argument("--texto", help="Caption directo")
    parser.add_argument("--imagen", help="Path de la imagen")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.texto:
        caption = args.texto
    elif args.pieza:
        caption = extract_tk_content(args.pieza)
        if not caption:
            sys.exit(1)
    else:
        print("[ERROR] Especifica --pieza o --texto")
        sys.exit(1)

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
