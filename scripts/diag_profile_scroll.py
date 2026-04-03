"""Diagnóstico: scroll en /editing/profile para encontrar sección de links, luego Settings."""
from playwright.sync_api import sync_playwright
import subprocess
import time
import urllib.request
import os

CHANNEL_ID = "UCFZYwZwkDD6oUPacaLo7PvQ"
CDP_URL = "http://127.0.0.1:9222"
CDP_VERSION_URL = f"{CDP_URL}/json/version"
CHROME_EXE = r"C:/Program Files/Google/Chrome/Application/chrome.exe"
CHROME_PROFILE_DIR = r"C:/Users/farid/Documents/Frecuencia Global/.chrome-youtube-stable"
CHROME_PROFILE_NAME = "Default"
STUDIO_ROOT = "https://studio.youtube.com/"
SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))


def cdp_is_ready():
    try:
        with urllib.request.urlopen(CDP_VERSION_URL, timeout=2) as r:
            return r.status == 200
    except Exception:
        return False


def start_chrome():
    os.makedirs(CHROME_PROFILE_DIR, exist_ok=True)
    cmd = [
        CHROME_EXE, "--remote-debugging-port=9222",
        f"--user-data-dir={CHROME_PROFILE_DIR}",
        f"--profile-directory={CHROME_PROFILE_NAME}",
        STUDIO_ROOT,
    ]
    subprocess.Popen(cmd)


with sync_playwright() as pw:
    if not cdp_is_ready():
        print("Iniciando Chrome...")
        start_chrome()
        for _ in range(20):
            time.sleep(1.5)
            if cdp_is_ready():
                break
        else:
            raise RuntimeError("Chrome no inició en tiempo.")

    browser = pw.chromium.connect_over_cdp(CDP_URL)
    ctx = browser.contexts[0]
    pages = ctx.pages
    page = pages[0] if pages else ctx.new_page()

    print("Navegando al root de Studio...")
    page.goto(STUDIO_ROOT, wait_until="domcontentloaded")
    try:
        page.wait_for_load_state("networkidle", timeout=12000)
    except Exception:
        pass
    time.sleep(4)

    # --- Click Customization in sidebar ---
    print("\n[1] Clickeando 'Customization' en sidebar...")
    try:
        page.locator('a:has-text("Customization")').first.click(timeout=5000)
        time.sleep(4)
        print(f"  URL: {page.url}")
    except Exception as e:
        print(f"  Error: {e}")

    # Screenshot at top
    shot1 = os.path.join(SCRIPTS_DIR, "diag_profile_top.png")
    page.screenshot(path=shot1, full_page=False)
    print(f"  Screenshot guardado: diag_profile_top.png")

    # Scroll 50% down
    print("\n[2] Scroll 50% down...")
    page.evaluate("window.scrollTo(0, document.body.scrollHeight / 2)")
    time.sleep(2)
    shot2 = os.path.join(SCRIPTS_DIR, "diag_profile_mid.png")
    page.screenshot(path=shot2, full_page=False)
    print("  Screenshot: diag_profile_mid.png")

    # Scroll to bottom
    print("\n[3] Scroll to bottom...")
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(2)
    shot3 = os.path.join(SCRIPTS_DIR, "diag_profile_bottom.png")
    page.screenshot(path=shot3, full_page=False)
    print("  Screenshot: diag_profile_bottom.png")

    # Dump visible text and key elements from the page
    print("\n[4] Inspeccionando DOM del perfil (links section)...")
    elements = page.evaluate("""() => {
        const results = [];
        // Look for link-related elements
        const keywords = ['link', 'url', 'social', 'contact', 'website', 'email', 
                          'add-link', 'enlace', 'sitio web'];
        // Get all input, button, ytcp-* elements
        const all = document.querySelectorAll('input, button, ytcp-button, a[href], [id*="link"], [id*="email"], [class*="link"]');
        all.forEach(el => {
            const id = el.id || '';
            const cls = (el.className || '').toString().substring(0, 80);
            const tag = el.tagName.toLowerCase();
            const text = (el.textContent || el.innerText || el.value || '').trim().substring(0, 80);
            const ariaLabel = el.getAttribute('aria-label') || '';
            const placeholder = el.getAttribute('placeholder') || '';
            const visible = el.offsetParent !== null;
            if (visible && (id || text || ariaLabel || placeholder)) {
                results.push({ tag, id, text, ariaLabel, placeholder, visible });
            }
        });
        return results.slice(0, 80);
    }""")
    for el in elements:
        if any(kw in (el.get('id','') + el.get('text','') + el.get('ariaLabel','') + el.get('placeholder','')).lower()
               for kw in ['link', 'url', 'email', 'contact', 'social', 'add', 'website', 'enlace', 'agregar']):
            print(f"  [{el['tag']}] id={el['id']} | text={el['text'][:50]} | aria={el['ariaLabel'][:40]} | placeholder={el['placeholder'][:40]}")

    # Full DOM dump of key containers
    print("\n[5] Buscando contenedores de links/URL en DOM...")
    containers = page.evaluate("""() => {
        const results = [];
        const all = document.querySelectorAll('[id*="link"], [id*="url"], ytcp-url-endpoint, ytcp-social-link, [class*="link-row"], [class*="url-row"]');
        all.forEach(el => {
            results.push({
                tag: el.tagName.toLowerCase(),
                id: el.id || '',
                className: (el.className || '').toString().substring(0, 80),
                outerHTML: el.outerHTML.substring(0, 300)
            });
        });
        return results;
    }""")
    for c in containers:
        print(f"  [{c['tag']}] id={c['id']} | class={c['className']}")
        print(f"    HTML: {c['outerHTML'][:200]}")

    # --- Now navigate to Settings using #settings-item ---
    print("\n[6] Navegando a Settings via #settings-item...")
    page.goto(STUDIO_ROOT, wait_until="domcontentloaded")
    try:
        page.wait_for_load_state("networkidle", timeout=10000)
    except Exception:
        pass
    time.sleep(3)

    try:
        settings_el = page.locator('#settings-item').first
        settings_el.wait_for(state="visible", timeout=5000)
        settings_el.click(timeout=5000)
        time.sleep(4)
        print(f"  URL tras click Settings: {page.url}")
    except Exception as e:
        # try alternative
        print(f"  Error con #settings-item: {e}")
        print("  Intentando selector alternativo...")
        try:
            page.locator('tp-yt-paper-icon-item#settings-item').first.click(timeout=5000)
            time.sleep(4)
            print(f"  URL tras click Settings (alt): {page.url}")
        except Exception as e2:
            print(f"  Error alternativa: {e2}")
            try:
                # Try clicking by looking for Settings text at the bottom
                page.locator('text=Settings').last.click(timeout=5000)
                time.sleep(4)
                print(f"  URL tras click Settings (text): {page.url}")
            except Exception as e3:
                print(f"  Error texto: {e3}")

    shot4 = os.path.join(SCRIPTS_DIR, "diag_settings.png")
    page.screenshot(path=shot4, full_page=False)
    print("  Screenshot: diag_settings.png")
    print(f"  URL final: {page.url}")

    # Check if settings modal/dialog opened
    print("\n[7] Buscando diálogo de Settings...")
    settings_content = page.evaluate("""() => {
        const results = [];
        const dialogs = document.querySelectorAll('dialog, [role="dialog"], ytcp-dialog, tp-yt-paper-dialog, ytcp-settings-dialog');
        dialogs.forEach(d => {
            const visible = d.offsetParent !== null || d.open || d.getAttribute('opened') === '';
            if (visible) {
                results.push({
                    tag: d.tagName.toLowerCase(),
                    id: d.id || '',
                    visible,
                    html: d.innerHTML.substring(0, 500)
                });
            }
        });
        return results;
    }""")
    if settings_content:
        for s in settings_content:
            print(f"  DIALOG [{s['tag']}] id={s['id']} visible={s['visible']}")
            print(f"    HTML: {s['html'][:300]}")
    else:
        print("  No se encontraron diálogos de Settings visibles")

    # Look for all visible text-containing elements
    print("\n[8] Bloques de texto visibles en la página actual...")
    texts = page.evaluate("""() => {
        const results = [];
        const all = document.querySelectorAll('h1, h2, h3, tp-yt-paper-tab, [class*="tab-"]');
        all.forEach(el => {
            const text = (el.textContent || '').trim();
            const visible = el.offsetParent !== null;
            if (visible && text.length > 0 && text.length < 100) {
                results.push(text);
            }
        });
        return [...new Set(results)];
    }""")
    print("  Encabezados/tabs visibles:", texts[:30])

    browser.close()
    print("\nDiagnóstico completado.")
