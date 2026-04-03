"""Genera un logotipo para Frecuencia Global usando Gemini via CDP."""
from playwright.sync_api import sync_playwright
import time
import os
import urllib.request

CDP_URL = "http://127.0.0.1:9222"
OUTPUT_DIR = r"C:\Users\farid\Documents\Frecuencia Global\Frecuencia_Global_Activos_Canva_v1"
OUTPUT_FILE = "FG_Avatar_Master_v2.png"

PROMPT = (
    "Generate an image: A professional, modern logo icon for a YouTube channel "
    "called 'Frecuencia Global' (Global Frequency). The channel covers geopolitics "
    "and international affairs.\n\n"
    "Design requirements:\n"
    "- Circular format, perfect for YouTube profile picture\n"
    "- Dark background using deep black (#0A0A0F)\n"
    "- Primary accent color: electric cyan (#00E5FF) with subtle neon glow effect\n"
    "- Secondary accent: magenta neon (#FF00E5) used sparingly (30% max)\n"
    "- The logo should feature a stylized globe or earth with frequency wave lines "
    "or signal pulses emanating from it\n"
    "- Incorporate subtle bracket symbols [ ] which are part of the brand identity\n"
    "- Clean, minimalist, high-tech aesthetic\n"
    "- NO text in the logo - icon/symbol only\n"
    "- Professional broadcast/news channel quality\n"
    "- The style should feel like a premium geopolitical analysis brand\n"
    "- Dark, sleek, futuristic with electric neon accents\n"
    "- Think: BBC World Service meets cyberpunk aesthetics"
)


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
    # Contar imagenes iniciales para detectar nuevas
    initial_count = page.locator("img").count()
    print(f"  Imagenes iniciales en pagina: {initial_count}")

    while time.time() < deadline:
        # Buscar todas las imagenes y filtrar las que son generadas (grandes)
        all_imgs = page.locator("img")
        for i in range(all_imgs.count()):
            try:
                el = all_imgs.nth(i)
                src = el.get_attribute("src", timeout=500)
                if not src:
                    continue

                # Filtrar: ignorar iconos pequenos, avatares, logos de UI
                # Las imagenes generadas por Gemini suelen tener naturalWidth > 256
                dims = page.evaluate("""(img) => {
                    return {
                        nw: img.naturalWidth,
                        nh: img.naturalHeight,
                        w: img.width,
                        h: img.height,
                        src: img.src.substring(0, 120)
                    };
                }""", el.element_handle())

                nw = dims.get("nw", 0)
                nh = dims.get("nh", 0)

                # Imagen generada: debe ser grande
                if nw >= 256 and nh >= 256:
                    print(f"  Imagen grande encontrada: {nw}x{nh} - {dims['src']}")
                    return el, src

            except Exception:
                pass

        # Verificar si sigue generando (buscar indicadores de carga)
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
        
        # Tambien verificar si el texto de respuesta contiene indicacion de imagen
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
        # Base64 image
        import base64
        header, data = src.split(",", 1)
        with open(output_path, "wb") as f:
            f.write(base64.b64decode(data))
        return True

    if src.startswith("blob:"):
        # Descargar via canvas en el navegador
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
            import base64
            header, data = result.split(",", 1)
            with open(output_path, "wb") as f:
                f.write(base64.b64decode(data))
            return True

    if src.startswith("http"):
        # Para URLs de googleusercontent, pedir tamaño maximo
        download_url = src
        if "googleusercontent" in src or "lh3" in src:
            # Remover parametros de escala y pedir original
            base = src.split("=")[0] if "=" in src else src
            download_url = base + "=s0"  # s0 = tamaño original
        print(f"Descargando de: {download_url[:120]}...")
        urllib.request.urlretrieve(download_url, output_path)
        return True

    return False


def main():
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(CDP_URL)
        ctx = browser.contexts[0]

        page = ctx.new_page()
        print("Navegando a Gemini...")
        page.goto("https://gemini.google.com/app", wait_until="domcontentloaded")
        time.sleep(8)

        print(f"URL: {page.url}")
        print(f"Titulo: {page.title()}")

        # Diagnostico rapido
        input_el = find_input(page)
        if not input_el:
            # Diagnostico detallado
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
                    ph: e.placeholder || e.getAttribute('data-placeholder') || ''
                }));
            }""")
            print("Elementos de entrada encontrados:")
            for el in info:
                print(f"  {el}")
            # Intentar screenshot para diagnostico
            page.screenshot(path=os.path.join(OUTPUT_DIR, "gemini_debug.png"))
            print("Screenshot guardado como gemini_debug.png")
            browser.close()
            return

        print("Campo de entrada encontrado. Enviando prompt...")
        input_el.click()
        time.sleep(0.5)

        # Escribir el prompt
        input_el.fill(PROMPT)
        time.sleep(1)

        # Enviar con Enter o boton de envio
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
        print("Esperando generacion de imagen (puede tardar hasta 3 minutos)...")

        img_el, img_src = wait_for_image(page, timeout_s=180)

        if img_el:
            output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
            print(f"Imagen detectada. Descargando a {output_path}...")
            if download_image_from_page(page, img_el, output_path):
                size = os.path.getsize(output_path)
                print(f"Imagen guardada: {output_path} ({size} bytes)")
                if size < 5000:
                    print("AVISO: Imagen muy pequena, posiblemente es un thumbnail.")
                    # Intentar screenshot de la imagen como fallback
                    try:
                        img_el.screenshot(path=output_path.replace(".png", "_element.png"))
                        print("Screenshot del elemento guardado como fallback.")
                    except Exception:
                        pass
            else:
                print("No se pudo descargar la imagen. Guardando screenshot...")
                page.screenshot(path=output_path, full_page=True)
        else:
            print("No se detecto imagen generada en el tiempo limite.")
            # Guardar screenshot de lo que hay
            ss_path = os.path.join(OUTPUT_DIR, "gemini_result.png")
            page.screenshot(path=ss_path, full_page=True)
            print(f"Screenshot guardado: {ss_path}")

        # Siempre guardar screenshot de verificacion
        verify_path = os.path.join(OUTPUT_DIR, "gemini_verify.png")
        page.screenshot(path=verify_path, full_page=True)
        print(f"Screenshot de verificacion: {verify_path}")

        browser.close()


if __name__ == "__main__":
    main()
