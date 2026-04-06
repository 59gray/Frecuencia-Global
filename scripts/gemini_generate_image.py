"""Genera imágenes vía Gemini web (aprovecha suscripción Pro/Plus).
Usa clipboard paste para no interferir con la UI de Gemini.

Uso:
    python scripts/gemini_generate_image.py --prompt PROMPT_P1_001_IG_Cover_v1.md
    python scripts/gemini_generate_image.py --prompt PROMPT_P1_001_TK_Cover_v1.md
    python scripts/gemini_generate_image.py --login-only

Requisitos:
    - Chrome con sesión de Google activa (.chrome-gemini-stable/)
    - Suscripción Gemini Pro/Plus para generación de imágenes
"""

import base64
import os
import re
import sys
import time
import argparse
from pathlib import Path
from datetime import datetime
from PIL import Image
from playwright.sync_api import sync_playwright

REPO_ROOT = Path(__file__).parent.parent
PROMPTS_DIR = REPO_ROOT / "system" / "gemini" / "prompts"
OUTPUT_DIR = REPO_ROOT / "system" / "gemini" / "outputs" / "visual"
CHROME_PROFILE_DIR = REPO_ROOT / ".chrome-gemini-stable"
DEBUG_DIR = REPO_ROOT / "scripts" / "tmp_gemini_debug"
GEMINI_URL = "https://gemini.google.com/app"

for d in [OUTPUT_DIR, CHROME_PROFILE_DIR, DEBUG_DIR]:
    d.mkdir(parents=True, exist_ok=True)


def find_chrome():
    for candidate in [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]:
        if os.path.exists(candidate):
            return candidate
    return None


def extract_primary_prompt(prompt_file: Path) -> str:
    content = prompt_file.read_text(encoding="utf-8")
    # Regex robusto: extrae el contenido del primer bloque de código que encuentre
    pattern = r"```[^\n]*\n(.*?)```"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None


def generate_output_name(prompt_file: Path) -> str:
    base = prompt_file.stem.replace("PROMPT_", "FG_")
    date = datetime.now().strftime("%Y%m%d")
    return f"{base}_{date}"


def launch_browser():
    chrome_exe = find_chrome()
    if not chrome_exe:
        print("[ERROR] Chrome no encontrado")
        sys.exit(1)
    return {
        "user_data_dir": str(CHROME_PROFILE_DIR),
        "headless": False,
        "args": [
            "--start-maximized",
            "--no-first-run",
            "--disable-blink-features=AutomationControlled",
        ],
        "executable_path": chrome_exe,
        "viewport": None,
        "no_viewport": True,
    }


def wait_for_input(page, timeout=30):
    """Wait for Gemini's text input to be ready."""
    for _ in range(timeout):
        for sel in [
            'div[contenteditable="true"]',
            'rich-textarea div[contenteditable="true"]',
            '.ql-editor[contenteditable="true"]',
            'p[data-placeholder]',
        ]:
            try:
                el = page.locator(sel)
                if el.count() > 0 and el.first.is_visible(timeout=500):
                    return el.first
            except Exception:
                pass
        time.sleep(1)
    return None


def paste_prompt(page, text):
    """Paste prompt via clipboard — instant, non-interfering."""
    page.evaluate(
        "text => navigator.clipboard.writeText(text)", text
    )
    time.sleep(0.3)
    page.keyboard.press("Control+v")
    time.sleep(1)
    # Simular una pulsación extra para despertar el botón de envío en la UI
    page.keyboard.press("Space")
    time.sleep(0.5)


def click_send(page):
    """Find and click the send button."""
    for sel in [
        'button[aria-label*="Send"]',
        'button[aria-label*="Enviar"]',
        'button[data-testid*="send"]',
        'button[data-test-id*="send"]',
        'button.send-button',
        '.send-button-container button',
    ]:
        try:
            btn = page.locator(sel)
            if btn.count() > 0 and btn.first.is_visible(timeout=1000):
                btn.first.evaluate("el => el.click()")
                return True
        except Exception:
            pass
    # Fallback: Ctrl+Enter (envía el mensaje en lugar de agregar una nueva línea)
    page.keyboard.press("Control+Enter")
    return True


def wait_for_image_ready(page, timeout=180):
    """Wait until a large generated image appears in the page."""
    print(f"[INFO] Esperando imagen generada (máx {timeout}s)...")
    start = time.time()
    time.sleep(8)  # Initial wait for Gemini to start processing

    while time.time() - start < timeout:
        # Look for any large image (generated, not UI icons)
        try:
            imgs = page.locator('img')
            for i in range(imgs.count()):
                try:
                    w = imgs.nth(i).evaluate("el => el.naturalWidth") or 0
                    h = imgs.nth(i).evaluate("el => el.naturalHeight") or 0
                    if w >= 256 and h >= 256:
                        # Extra wait to ensure full render
                        time.sleep(5)
                        print(f"[OK] Imagen generada detectada ({w}x{h})")
                        return True
                except Exception:
                    continue
        except Exception:
            pass

        elapsed = int(time.time() - start)
        if elapsed % 10 == 0 and elapsed > 0:
            print(f"  ... esperando imagen ({elapsed}s)")
        time.sleep(5)

    print("[WARN] Timeout — no se detectó imagen")
    return False


def remove_gemini_watermark(filepath: Path):
    """Remove the Gemini sparkle watermark from the bottom-right corner."""
    try:
        img = Image.open(filepath)
        w, h = img.size
        # Watermark is ~40-60px sparkle in bottom-right corner
        # Paint over with the dominant background color from that area
        crop_size = int(min(w, h) * 0.08)  # ~8% of smallest dimension
        # Sample background color from nearby area (just above the watermark)
        sample_x = w - crop_size * 2
        sample_y = h - crop_size * 2
        bg_color = img.getpixel((sample_x, sample_y))
        # Paint rectangle over watermark area
        for x in range(w - crop_size, w):
            for y in range(h - crop_size, h):
                img.putpixel((x, y), bg_color)
        img.save(filepath)
        print(f"[OK] Watermark removido: {filepath.name}")
    except Exception as e:
        print(f"[WARN] No se pudo remover watermark: {e}")


def extract_images(page, output_name, assets_dir):
    """Extract all large images from the page via canvas conversion."""
    saved = []
    try:
        imgs = page.locator('img')
        count = imgs.count()
        print(f"[INFO] Encontradas {count} imágenes en la página, filtrando...")

        idx = 0
        for i in range(count):
            img = imgs.nth(i)
            try:
                w = img.evaluate("el => el.naturalWidth") or 0
                h = img.evaluate("el => el.naturalHeight") or 0
            except Exception:
                continue

            # Only save large images (generated, not UI)
            if w >= 256 and h >= 256:
                try:
                    data_url = img.evaluate("""el => {
                        const c = document.createElement('canvas');
                        c.width = el.naturalWidth;
                        c.height = el.naturalHeight;
                        c.getContext('2d').drawImage(el, 0, 0);
                        return c.toDataURL('image/png');
                    }""")
                    if data_url and data_url.startswith("data:image"):
                        b64 = data_url.split(",", 1)[1]
                        raw = base64.b64decode(b64)

                        fname = f"{output_name}_{idx}.png"

                        # Save to gemini outputs
                        out = OUTPUT_DIR / fname
                        out.write_bytes(raw)

                        # Copy to assets
                        assets_dir.mkdir(parents=True, exist_ok=True)
                        asset = assets_dir / fname
                        asset.write_bytes(raw)

                        saved.append(out)
                        idx += 1
                        print(f"[OK] Imagen {idx}: {w}x{h} → {out}")
                        # Remove Gemini watermark from both copies
                        remove_gemini_watermark(out)
                        remove_gemini_watermark(asset)
                except Exception as e:
                    print(f"[WARN] No se pudo extraer imagen {i}: {e}")
    except Exception as e:
        print(f"[ERROR] Error extrayendo imágenes: {e}")

    return saved


def main():
    parser = argparse.ArgumentParser(description="Generate images via Gemini web")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--prompt", help="Prompt file in system/gemini/prompts/")
    group.add_argument("--prompt-file", help="Full path to prompt file")
    group.add_argument("--login-only", action="store_true", help="Only login to Gemini")
    parser.add_argument("--output-dir", help="Custom output directory")
    parser.add_argument("--text", help="Texto directo del prompt")
    parser.add_argument("--pieza", help="Fuerza la carpeta destino (ej: P1_002)")
    args = parser.parse_args()

    if args.login_only:
        with sync_playwright() as p:
            browser = p.chromium.launch(**launch_browser())
            page = browser.new_page()
            page.goto(GEMINI_URL)
            print("Login to Gemini, then close the browser when ready")
            input("Press Enter when done...")
            browser.close()
        return

    # Determine prompt file path
    if args.prompt:
        prompt_file = PROMPTS_DIR / args.prompt
    else:
        prompt_file = Path(args.prompt_file)

    # Determine output directory
    if args.output_dir:
        output_dir = Path(args.output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
    else:
        # Extract episode ID from prompt filename and convert to P1_XXX format
        filename = prompt_file.stem
        if "PROMPT_" in filename:
            episode = filename.split("_")[1]
            if episode.startswith("EP"):
                piece_id = f"P1_{episode[2:]}"
            else:
                piece_id = episode
            output_dir = REPO_ROOT / "06_Assets" / "production" / piece_id
            output_dir.mkdir(parents=True, exist_ok=True)
        else:
            output_dir = OUTPUT_DIR

    if not prompt_file.exists():
        print(f"[ERROR] No existe: {prompt_file}")
        sys.exit(1)

    if args.prompt:
        prompt_text = extract_primary_prompt(prompt_file)
        if not prompt_text:
            print(f"[ERROR] No se encontró prompt en {prompt_file}")
            sys.exit(1)
        output_name = generate_output_name(prompt_file)

        if args.pieza:
            pieza = args.pieza
        else:
            match = re.search(r"(P[0-9]_[0-9]{3})", args.prompt)
            pieza = match.group(1) if match else "misc"
        print(f"[INFO] Prompt: {args.prompt} ({len(prompt_text)} chars)")
    elif args.prompt_file:
        prompt_text = extract_primary_prompt(prompt_file)
        if not prompt_text:
            print(f"[ERROR] No se encontró prompt en {prompt_file}")
            sys.exit(1)
        output_name = generate_output_name(prompt_file)
        pieza = args.pieza or "misc"
        print(f"[INFO] Prompt file: {args.prompt_file} ({len(prompt_text)} chars)")
    elif args.text:
        prompt_text = args.text
        output_name = f"FG_manual_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        pieza = args.pieza or "misc"
    else:
        print("[ERROR] Usa --prompt, --prompt-file, --text, o --login-only")
        sys.exit(1)

    assets_dir = REPO_ROOT / "06_Assets" / pieza

    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(**launch_browser())
        page = ctx.new_page()

        print(f"[INFO] Navegando a {GEMINI_URL}")
        page.goto(GEMINI_URL, wait_until="domcontentloaded", timeout=60000)
        time.sleep(5)

        # Login check
        if "accounts.google" in page.url or "signin" in page.url:
            print("[ACCIÓN] Inicia sesión en Google. Cierra Chrome al terminar.")
            try:
                while ctx.pages:
                    time.sleep(1)
            except Exception:
                pass
            return

        if args.login_only:
            print("[OK] Gemini accesible. Cierra Chrome para guardar sesión.")
            try:
                while ctx.pages:
                    time.sleep(1)
            except Exception:
                pass
            return

        page.screenshot(path=str(DEBUG_DIR / "01_gemini_ready.png"))

        # Find input
        input_el = wait_for_input(page)
        if not input_el:
            print("[ERROR] No se encontró campo de texto")
            page.screenshot(path=str(DEBUG_DIR / "error_no_input.png"))
            ctx.close()
            sys.exit(1)

        # Focus input and paste via clipboard (instant, non-interfering)
        print("[INFO] Pegando prompt via clipboard...")
        input_el.click()
        time.sleep(0.5)
        paste_prompt(page, prompt_text)

        page.screenshot(path=str(DEBUG_DIR / "02_prompt_pasted.png"))
        print("[OK] Prompt pegado")

        # Send
        time.sleep(1)
        click_send(page)
        print("[OK] Prompt enviado")
        page.screenshot(path=str(DEBUG_DIR / "03_sent.png"))

        # Wait passively for generation
        completed = wait_for_image_ready(page, timeout=180)
        time.sleep(5)

        page.screenshot(path=str(DEBUG_DIR / f"{output_name}_final.png"))

        # Save images
        saved = extract_images(page, output_name, output_dir)

        if saved:
            print(f"\n✅ {len(saved)} imagen(es) guardada(s)")
            for s in saved:
                print(f"   {s}")
            time.sleep(2)
            ctx.close()
        else:
            print("[WARN] No se extrajeron imágenes automáticamente.")
            print(f"[INFO] Screenshot: {DEBUG_DIR / output_name}_final.png")
            print("[INFO] Descarga manualmente y cierra Chrome.")
            try:
                while ctx.pages:
                    time.sleep(1)
            except Exception:
                pass

    print("[DONE]")


if __name__ == "__main__":
    main()
