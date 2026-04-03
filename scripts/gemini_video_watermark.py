"""Genera un video watermark con Gemini via CDP y exporta versiones 150x150."""
from __future__ import annotations

import base64
import os
import time
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright

CDP_URL = "http://127.0.0.1:9222"
ROOT_DIR = Path(r"C:\Users\farid\Documents\Frecuencia Global")
OUTPUT_DIR = ROOT_DIR / "06_Assets" / "video_watermark"
RAW_FILE = OUTPUT_DIR / "FG_Video_Watermark_Gemini_raw.png"
FINAL_FILE = OUTPUT_DIR / "FG_Video_Watermark_Gemini_150.png"
TRANSPARENT_FILE = OUTPUT_DIR / "FG_Video_Watermark_Gemini_150_transparent.png"
BRAND_FILE = OUTPUT_DIR / "FG_Video_Watermark_Brand_150_transparent.png"
VERIFY_FILE = OUTPUT_DIR / "FG_Video_Watermark_Gemini_verify.png"

PROMPT = (
    "Generate an image: a square minimalist logo icon optimized as a YouTube video watermark "
    "for the brand 'Frecuencia Global'.\n\n"
    "CRITICAL OUTPUT GOAL:\n"
    "- This icon must remain clear and legible at very small size, especially 150x150 pixels.\n"
    "- NO text, NO words, NO letters.\n"
    "- Single centered symbol only.\n"
    "- Thick clean geometric lines.\n"
    "- Minimal detail. Avoid maps, tiny grids, tiny labels, tiny dots, or decorative clutter.\n"
    "- Keep strong empty space around the symbol.\n\n"
    "Brand language:\n"
    "- Deep black background (#0A0A0F) or transparent-looking dark backdrop\n"
    "- Primary color: electric cyan (#00E5FF)\n"
    "- Optional tiny magenta accent (#FF00E5), 10 percent max\n"
    "- Use the Frecuencia Global visual system: bracket shapes [ ] plus a central signal node or pulse line\n"
    "- Futuristic, broadcast-tech, geopolitical, electronic-music-adjacent aesthetic\n"
    "- Premium, clean, iconic, not illustrative\n"
    "- Flat or subtle neon glow only\n"
    "- Square composition, perfectly centered\n"
    "- No mockup, no interface, no shadowed room, no extra objects\n"
    "- Deliver a crisp icon that could work as a channel watermark on top of video"
)


def ensure_pillow():
    try:
        from PIL import Image  # noqa: F401
    except ImportError:
        import subprocess
        import sys

        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])


def find_input(page):
    selectors = [
        'div[contenteditable="true"]',
        'rich-textarea div[contenteditable]',
        ".ql-editor",
        "textarea",
        '[role="textbox"]',
        "p[data-placeholder]",
    ]
    for sel in selectors:
        loc = page.locator(sel)
        count = loc.count()
        for i in range(count):
            try:
                if loc.nth(i).is_visible(timeout=1000):
                    return loc.nth(i)
            except Exception:
                pass
    return None


def close_overlays(page):
    page.evaluate(
        """() => {
            const closeSelectors = [
                'button[aria-label="Close"]',
                'button[aria-label="Dismiss"]',
                'button[aria-label="Cerrar"]',
                '[mat-dialog-close]'
            ];
            for (const sel of closeSelectors) {
                document.querySelectorAll(sel).forEach((btn) => btn.click());
            }
            document.querySelectorAll('.cdk-overlay-backdrop').forEach((el) => el.click());
        }"""
    )


def send_prompt(page, prompt: str):
    input_el = find_input(page)
    if not input_el:
        raise RuntimeError("No se encontro el campo de entrada de Gemini.")

    close_overlays(page)
    time.sleep(1)
    input_el.click(force=True)
    time.sleep(0.5)
    input_el.fill(prompt)
    time.sleep(1)

    send_btn = page.locator(
        'button[aria-label*="Send"], button[aria-label*="Enviar"], '
        'button.send-button, button[data-test-id="send-button"], '
        '[class*="send"] button'
    )

    for i in range(send_btn.count()):
        try:
            button = send_btn.nth(i)
            if button.is_visible(timeout=1000) and button.is_enabled(timeout=1000):
                button.click(timeout=3000)
                return
        except Exception:
            pass

    input_el.press("Enter")


def wait_for_image(page, timeout_s=240):
    deadline = time.time() + timeout_s
    baseline = set()
    all_imgs = page.locator("img")
    for i in range(all_imgs.count()):
        try:
            src = all_imgs.nth(i).get_attribute("src", timeout=500)
            if src:
                baseline.add(src)
        except Exception:
            pass

    while time.time() < deadline:
        all_imgs = page.locator("img")
        for i in range(all_imgs.count()):
            try:
                el = all_imgs.nth(i)
                src = el.get_attribute("src", timeout=500)
                if not src or src in baseline:
                    continue

                dims = page.evaluate(
                    """(img) => ({
                        nw: img.naturalWidth || 0,
                        nh: img.naturalHeight || 0,
                        visible: !!(img.offsetParent)
                    })""",
                    el.element_handle(),
                )

                if dims["visible"] and dims["nw"] >= 256 and dims["nh"] >= 256:
                    return el
            except Exception:
                pass

        time.sleep(4)

    return None


def download_image_from_page(page, img_element, output_path: Path) -> bool:
    src = img_element.get_attribute("src")
    if not src:
        return False

    if src.startswith("data:image"):
        _, data = src.split(",", 1)
        output_path.write_bytes(base64.b64decode(data))
        return True

    if src.startswith("blob:"):
        result = page.evaluate(
            """(imgEl) => {
                const canvas = document.createElement('canvas');
                canvas.width = imgEl.naturalWidth || imgEl.width;
                canvas.height = imgEl.naturalHeight || imgEl.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(imgEl, 0, 0);
                return canvas.toDataURL('image/png');
            }""",
            img_element.element_handle(),
        )
        if result and result.startswith("data:image"):
            _, data = result.split(",", 1)
            output_path.write_bytes(base64.b64decode(data))
            return True

    if src.startswith("http"):
        download_url = src
        if "googleusercontent" in src or "lh3" in src:
            base = src.split("=")[0] if "=" in src else src
            download_url = base + "=s0"
        urllib.request.urlretrieve(download_url, output_path)
        return True

    return False


def prepare_variants():
    ensure_pillow()
    from PIL import Image

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    raw = Image.open(RAW_FILE).convert("RGBA")
    raw.thumbnail((150, 150), Image.LANCZOS)
    canvas = Image.new("RGBA", (150, 150), (10, 10, 15, 255))
    offset = ((150 - raw.width) // 2, (150 - raw.height) // 2)
    canvas.paste(raw, offset, raw)
    canvas.save(FINAL_FILE, "PNG")

    rgba = canvas.copy()
    px = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = px[x, y]
            brightness = max(r, g, b)
            if brightness <= 22:
                px[x, y] = (r, g, b, 0)
            elif brightness <= 60:
                alpha = int((brightness - 22) / (60 - 22) * 110)
                px[x, y] = (r, g, b, max(alpha, a // 3))
    rgba.save(TRANSPARENT_FILE, "PNG")

    brand_path = ROOT_DIR / "Frecuencia_Global_Assets_Base" / "assets" / "fg_isotipo_512.png"
    brand = Image.open(brand_path).convert("RGBA")
    brand.thumbnail((150, 150), Image.LANCZOS)
    brand_rgba = Image.new("RGBA", (150, 150), (0, 0, 0, 0))
    offset = ((150 - brand.width) // 2, (150 - brand.height) // 2)
    brand_rgba.paste(brand, offset, brand)

    px = brand_rgba.load()
    for y in range(brand_rgba.height):
        for x in range(brand_rgba.width):
            r, g, b, a = px[x, y]
            if max(r, g, b) <= 20:
                px[x, y] = (r, g, b, 0)
    brand_rgba.save(BRAND_FILE, "PNG")


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(CDP_URL)
        ctx = browser.contexts[0]
        page = ctx.new_page()
        page.goto("https://gemini.google.com/app", wait_until="domcontentloaded")
        time.sleep(8)

        send_prompt(page, PROMPT)
        time.sleep(5)

        img_el = wait_for_image(page)
        if not img_el:
            page.screenshot(path=str(VERIFY_FILE), full_page=True)
            raise RuntimeError("Gemini no devolvio una imagen en el tiempo esperado.")

        if not download_image_from_page(page, img_el, RAW_FILE):
            page.screenshot(path=str(VERIFY_FILE), full_page=True)
            raise RuntimeError("No se pudo descargar la imagen generada por Gemini.")

        page.screenshot(path=str(VERIFY_FILE), full_page=True)
        browser.close()

    prepare_variants()

    print(f"Raw: {RAW_FILE}")
    print(f"Final: {FINAL_FILE}")
    print(f"Transparent: {TRANSPARENT_FILE}")
    print(f"Brand fallback: {BRAND_FILE}")


if __name__ == "__main__":
    main()
