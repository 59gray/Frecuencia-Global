"""Genera un banner YouTube para Frecuencia Global usando Gemini via CDP."""
from playwright.sync_api import sync_playwright
import time
import os
import base64
import struct
import urllib.request

CDP_URL = "http://127.0.0.1:9222"
OUTPUT_DIR = r"C:\Users\farid\Documents\Frecuencia Global\Frecuencia_Global_Activos_Canva_v1"
OUTPUT_FILE = "FG_Banner_YouTube_v3.png"

# Banner YouTube: recomendado 2560x1440, minimo 2048x1152
BANNER_MIN_W = 2048
BANNER_MIN_H = 1152

PROMPT = (
    "Generate a wide landscape banner image for a YouTube channel called "
    "'Frecuencia Global'. The channel covers geopolitics and international affairs.\n\n"
    "CRITICAL: This MUST be a wide horizontal/landscape format image, like a YouTube banner. "
    "Wide 16:9 ratio, very wide, not square.\n\n"
    "IMPORTANT: ALL text in the image must be in SPANISH only. No English words anywhere.\n\n"
    "YOUTUBE SAFE AREA — EXTREMELY IMPORTANT:\n"
    "YouTube crops this banner on different devices. Only a narrow HORIZONTAL BAND in the "
    "exact vertical CENTER of the image is visible on ALL devices (mobile, tablet, desktop).\n"
    "- ALL text, logos, and key visual elements MUST be placed in the MIDDLE 30% of the image height.\n"
    "- The top 35% and bottom 35% should contain ONLY subtle background elements (dark gradients, "
    "faint grid patterns, ambient glow) — NO text, NO logos, NO important visuals there.\n"
    "- Think of it as a HORIZONTAL STRIP design: content lives in a centered band, "
    "with cinematic dark padding above and below.\n\n"
    "Design requirements:\n"
    "- Wide landscape format (16:9 ratio, much wider than tall)\n"
    "- Deep black background (#0A0A0F) filling the entire canvas\n"
    "- Primary accent: electric cyan (#00E5FF) with neon glow\n"
    "- Secondary accent: magenta neon (#FF00E5), used sparingly\n"
    "- IN THE CENTER BAND: stylized globe with frequency/signal waves emanating horizontally\n"
    "- IN THE CENTER BAND: Large bold text 'FRECUENCIA GLOBAL' (Bebas Neue or similar bold display font)\n"
    "- IN THE CENTER BAND: Subtitle 'Geopolítica y actualidad internacional' in smaller text\n"
    "- IN THE CENTER BAND: Tags 'ANÁLISIS · NOTICIAS · POLÍTICA · MAPAS'\n"
    "- All text and the globe should be VERTICALLY CENTERED in the image\n"
    "- Subtle grid/HUD overlay pattern across the background (can extend to edges)\n"
    "- Thin cyan horizontal lines as decorative accents in the center band\n"
    "- Left side of center band: frequency waveform or signal visualization\n"
    "- Right side of center band: world map outline or globe segment\n"
    "- High-tech, cyberpunk-broadcast aesthetic\n"
    "- Premium quality, professional broadcast channel look\n"
    "- Think: BBC World Service meets cyberpunk aesthetics, wide cinematic banner\n"
    "- REMINDER: Every single word must be in Spanish, not English\n"
    "- REMINDER: Keep ALL content in the vertical center — top and bottom must be mostly empty dark space"
)


def get_png_dimensions(path: str):
    with open(path, "rb") as f:
        header = f.read(24)
    if len(header) < 24 or header[:8] != b"\x89PNG\r\n\x1a\n":
        return None, None
    w, h = struct.unpack(">II", header[16:24])
    return w, h


def resize_to_banner(input_path: str, output_path: str) -> None:
    """Redimensiona / extiende la imagen a 2560x1440 con fondo #0A0A0F usando Pillow."""
    try:
        from PIL import Image
    except ImportError:
        print("Pillow no instalado. Instalando...")
        import subprocess, sys
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        from PIL import Image

    target_w, target_h = 2560, 1440
    bg_color = (10, 10, 15)  # #0A0A0F

    img = Image.open(input_path).convert("RGBA")
    iw, ih = img.size
    print(f"  Imagen original: {iw}x{ih}")

    # Escalar manteniendo aspecto para que quepa en 2560x1440
    scale = min(target_w / iw, target_h / ih)
    new_w = int(iw * scale)
    new_h = int(ih * scale)
    img_resized = img.resize((new_w, new_h), Image.LANCZOS)

    # Crear canvas negro y pegar centrado
    canvas = Image.new("RGBA", (target_w, target_h), bg_color + (255,))
    offset_x = (target_w - new_w) // 2
    offset_y = (target_h - new_h) // 2
    canvas.paste(img_resized, (offset_x, offset_y), img_resized)

    # Guardar como PNG
    canvas = canvas.convert("RGB")
    canvas.save(output_path, "PNG", optimize=False)
    print(f"  Redimensionado a {target_w}x{target_h}: {output_path}")


def find_input(page):
    """Busca el campo de entrada de Gemini."""
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
        for i in range(loc.count()):
            try:
                if loc.nth(i).is_visible(timeout=1500):
                    return loc.nth(i)
            except Exception:
                pass
    return None


def wait_for_image(page, timeout_s=180):
    """Espera a que Gemini genere y muestre una imagen."""
    deadline = time.time() + timeout_s
    initial_count = page.locator("img").count()
    print(f"  Imagenes iniciales en pagina: {initial_count}")

    while time.time() < deadline:
        all_imgs = page.locator("img")
        for i in range(all_imgs.count()):
            try:
                el = all_imgs.nth(i)
                src = el.get_attribute("src", timeout=500)
                if not src:
                    continue

                dims = page.evaluate("""(img) => {
                    return {
                        nw: img.naturalWidth,
                        nh: img.naturalHeight,
                        src: img.src.substring(0, 120)
                    };
                }""", el.element_handle())

                nw = dims.get("nw", 0)
                nh = dims.get("nh", 0)

                if nw >= 256 and nh >= 256:
                    print(f"  Imagen grande encontrada: {nw}x{nh} - {dims['src']}")
                    return el, src

            except Exception:
                pass

        loading = page.evaluate("""() => {
            const indicators = document.querySelectorAll(
                '.loading, .generating, [class*="loading"], [class*="progress"], ' +
                '[class*="spinner"], mat-progress-bar, .thinking'
            );
            const visible = [...indicators].filter(el => el.offsetParent !== null);
            return visible.length;
        }""")
        if loading > 0:
            print("  Gemini sigue generando...")

        resp_text = page.evaluate("""() => {
            const responses = document.querySelectorAll('model-response, .response-container, message-content');
            if (responses.length === 0) return '';
            const last = responses[responses.length - 1];
            return (last.textContent || '').substring(0, 200);
        }""")
        if resp_text:
            elapsed = int(timeout_s - (deadline - time.time()))
            print(f"  [{elapsed}s] Respuesta parcial: {resp_text[:100]}...")

        time.sleep(5)

    return None, None


def download_image_from_page(page, img_element, output_path):
    """Descarga la imagen generada."""
    src = img_element.get_attribute("src")
    print(f"Fuente de imagen: {src[:100]}...")

    if src.startswith("data:image"):
        header, data = src.split(",", 1)
        with open(output_path, "wb") as f:
            f.write(base64.b64decode(data))
        return True

    if src.startswith("blob:"):
        result = page.evaluate("""(imgEl) => {
            return new Promise((resolve) => {
                const canvas = document.createElement('canvas');
                canvas.width = imgEl.naturalWidth || imgEl.width;
                canvas.height = imgEl.naturalHeight || imgEl.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(imgEl, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            });
        }""", img_element.element_handle())
        if result and result.startswith("data:image"):
            header, data = result.split(",", 1)
            with open(output_path, "wb") as f:
                f.write(base64.b64decode(data))
            return True

    if src.startswith("http"):
        download_url = src
        if "googleusercontent" in src or "lh3" in src:
            base = src.split("=")[0] if "=" in src else src
            download_url = base + "=s0"
        print(f"Descargando de: {download_url[:120]}...")
        urllib.request.urlretrieve(download_url, output_path)
        return True

    return False


def main():
    output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(CDP_URL)
        ctx = browser.contexts[0]

        page = ctx.new_page()
        print("Navegando a Gemini...")
        page.goto("https://gemini.google.com/app", wait_until="domcontentloaded")
        time.sleep(8)

        print(f"URL: {page.url}")
        print(f"Titulo: {page.title()}")

        input_el = find_input(page)
        if not input_el:
            info = page.evaluate("""() => {
                const els = document.querySelectorAll(
                    'input, textarea, [contenteditable], [role="textbox"]'
                );
                return [...els].map(e => ({
                    tag: e.tagName,
                    role: e.getAttribute('role') || '',
                    ce: e.contentEditable,
                    id: e.id || '',
                    cls: (e.className || '').toString().substring(0, 60),
                    vis: e.offsetParent !== null,
                }));
            }""")
            print("Elementos de entrada encontrados:")
            for el in info:
                print(f"  {el}")
            page.screenshot(path=os.path.join(OUTPUT_DIR, "gemini_banner_debug.png"))
            print("Screenshot guardado.")
            browser.close()
            return

        print("Campo de entrada encontrado. Enviando prompt de banner...")

        # Cerrar cualquier overlay/popup que bloquee la interaccion
        page.evaluate("""() => {
            // Cerrar overlay containers (Canvas discovery, etc.)
            document.querySelectorAll('.cdk-overlay-container .cdk-overlay-backdrop').forEach(el => el.click());
            document.querySelectorAll('.cdk-overlay-container').forEach(el => {
                const closeBtn = el.querySelector('button[aria-label="Close"], button[aria-label="Dismiss"], [mat-dialog-close], .close-button');
                if (closeBtn) closeBtn.click();
            });
            // Quitar overlays que interceptan clicks
            document.querySelectorAll('.cdk-overlay-pane').forEach(el => el.remove());
            document.querySelectorAll('.cdk-overlay-backdrop').forEach(el => el.remove());
        }""")
        time.sleep(1)

        input_el.click(force=True)
        time.sleep(0.5)
        input_el.fill(PROMPT)
        time.sleep(1)

        send_btn = page.locator('button[aria-label*="Send"], button[aria-label*="Enviar"], '
                                'button.send-button, button[data-test-id="send-button"], '
                                '[class*="send"] button')
        sent = False
        for i in range(send_btn.count()):
            try:
                if send_btn.nth(i).is_visible(timeout=1000):
                    send_btn.nth(i).click(timeout=2000)
                    sent = True
                    print("Prompt enviado via boton.")
                    break
            except Exception:
                pass

        if not sent:
            input_el.press("Enter")
            print("Prompt enviado via Enter.")

        time.sleep(5)
        print("Esperando generacion de banner (puede tardar hasta 3 minutos)...")

        img_el, img_src = wait_for_image(page, timeout_s=180)

        if img_el:
            raw_path = output_path.replace(".png", "_raw.png")
            print(f"Imagen detectada. Descargando a {raw_path}...")
            if download_image_from_page(page, img_el, raw_path):
                raw_size = os.path.getsize(raw_path)
                print(f"Imagen raw guardada: {raw_path} ({raw_size} bytes)")

                if raw_size < 5000:
                    print("AVISO: Imagen muy pequena, posiblemente es un thumbnail.")
                    page.screenshot(path=output_path, full_page=True)
                    print("Screenshot de pagina guardado como fallback.")
                else:
                    # Verificar dimensiones
                    w, h = get_png_dimensions(raw_path)
                    print(f"Dimensiones raw: {w}x{h}")

                    if w is not None and w >= BANNER_MIN_W and h >= BANNER_MIN_H:
                        # Ya cumple los requisitos de tamaño
                        import shutil
                        shutil.copy2(raw_path, output_path)
                        print(f"Banner cumple dimensiones minimas. Copiado a: {output_path}")
                    else:
                        print(f"Dimensiones insuficientes ({w}x{h}). Redimensionando a 2560x1440...")
                        resize_to_banner(raw_path, output_path)

                    final_w, final_h = get_png_dimensions(output_path)
                    final_mb = os.path.getsize(output_path) / (1024 * 1024)
                    print(f"\nBanner final: {final_w}x{final_h}, {final_mb:.3f} MB")
                    print(f"Guardado en: {output_path}")
            else:
                print("No se pudo descargar la imagen.")
        else:
            print("No se detecto imagen generada en el tiempo limite.")
            ss_path = os.path.join(OUTPUT_DIR, "gemini_banner_result.png")
            page.screenshot(path=ss_path, full_page=True)
            print(f"Screenshot guardado: {ss_path}")

        verify_path = os.path.join(OUTPUT_DIR, "gemini_banner_verify.png")
        page.screenshot(path=verify_path, full_page=True)
        print(f"Screenshot de verificacion: {verify_path}")

        browser.close()


if __name__ == "__main__":
    main()
