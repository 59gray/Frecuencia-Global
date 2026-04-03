"""Diagnostica el DOM después de hacer click en 'Add link' en /editing/profile."""
from playwright.sync_api import sync_playwright
import time, json, urllib.request, subprocess, os

CDP_URL = "http://127.0.0.1:9222"
YOUTUBE_STUDIO_ROOT = "https://studio.youtube.com/"
CHROME_EXE = r"C:/Program Files/Google/Chrome/Application/chrome.exe"
CHROME_PROFILE_DIR = r"C:/Users/farid/Documents/Frecuencia Global/.chrome-youtube-stable"
CHANNEL_ID = "UCFZYwZwkDD6oUPacaLo7PvQ"
BASE_DIR = r"C:/Users/farid/Documents/Frecuencia Global"

def cdp_is_ready():
    try:
        with urllib.request.urlopen(f"{CDP_URL}/json/version", timeout=2) as r:
            return r.status == 200
    except:
        return False

def main():
    if not cdp_is_ready():
        print("Iniciando Chrome...")
        subprocess.Popen([CHROME_EXE, "--remote-debugging-port=9222",
                          f"--user-data-dir={CHROME_PROFILE_DIR}", "--profile-directory=Default",
                          YOUTUBE_STUDIO_ROOT])
        for _ in range(30):
            time.sleep(1)
            if cdp_is_ready():
                break

    with sync_playwright() as pw:
        browser = pw.chromium.connect_over_cdp(CDP_URL)
        ctx = browser.contexts[0]
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.on("dialog", lambda d: d.accept())

        # Navegar a Studio root → sidebar Customization
        print("Navegando a Studio root...")
        page.goto(YOUTUBE_STUDIO_ROOT, wait_until="domcontentloaded")
        try: page.wait_for_load_state("networkidle", timeout=12000)
        except: pass
        time.sleep(4)

        print("Clickeando Customization en sidebar...")
        try:
            link = page.locator('a:has-text("Customization")').first
            link.wait_for(state="visible", timeout=8000)
            link.click()
            try: page.wait_for_load_state("networkidle", timeout=10000)
            except: pass
            time.sleep(4)
        except Exception as e:
            print(f"Sidebar: {e}")

        print(f"URL: {page.url}")
        page.screenshot(path=os.path.join(BASE_DIR, "scripts", "diag_01_before_addlink.png"))

        # Dump todos los inputs/buttons antes de click
        before = page.evaluate("""() => {
            const results = [];
            // Todos los inputs visibles
            document.querySelectorAll('input, textarea').forEach(el => {
                if (el.offsetParent !== null) {
                    results.push({
                        tag: el.tagName,
                        type: el.type,
                        placeholder: el.placeholder,
                        ariaLabel: el.getAttribute('aria-label'),
                        id: el.id,
                        name: el.name,
                        value: el.value ? el.value.substr(0, 40) : ''
                    });
                }
            });
            return results;
        }""")
        print("\n=== INPUTS antes de Add link ===")
        for item in before:
            print(json.dumps(item, ensure_ascii=False))

        # Hacer click en "Add link"
        print("\nHaciendo click en Add link...")
        clicked = False
        for sel in ['ytcp-button:has-text("Add link")', 'button:has-text("Add link")',
                    'ytcp-button:has-text("Agregar enlace")', 'button:has-text("Agregar enlace")']:
            try:
                btns = page.locator(sel)
                if btns.count() > 0:
                    btns.first.scroll_into_view_if_needed(timeout=3000)
                    btns.first.click(timeout=4000)
                    clicked = True
                    print(f"  Click via: {sel}")
                    break
            except:
                continue

        if not clicked:
            print("  No se encontró 'Add link'!")

        time.sleep(3)
        page.screenshot(path=os.path.join(BASE_DIR, "scripts", "diag_02_after_addlink.png"))

        # Dump DOM extensivo después del click
        after = page.evaluate("""() => {
            const results = { inputs: [], buttons: [], dialogs: [], ytcp: [], shadowInfo: [] };

            // Inputs visibles
            document.querySelectorAll('input, textarea').forEach(el => {
                if (el.offsetParent !== null) {
                    results.inputs.push({
                        tag: el.tagName,
                        type: el.type,
                        placeholder: el.placeholder,
                        ariaLabel: el.getAttribute('aria-label'),
                        id: el.id,
                        name: el.name,
                        parentTag: el.parentElement ? el.parentElement.tagName : '',
                        grandParentTag: el.parentElement && el.parentElement.parentElement ? el.parentElement.parentElement.tagName : ''
                    });
                }
            });

            // Dialogs / overlays
            document.querySelectorAll('[role="dialog"], ytcp-dialog, tp-yt-paper-dialog, ytcp-link-editor-dialog').forEach(el => {
                if (el.offsetParent !== null) {
                    results.dialogs.push({
                        tag: el.tagName,
                        id: el.id,
                        class: el.className ? el.className.substr(0, 60) : '',
                        innerHTML: el.innerHTML ? el.innerHTML.substr(0, 200) : ''
                    });
                }
            });

            // ytcp-* elements relevantes
            document.querySelectorAll('ytcp-link-editor, ytcp-link-editor-dialog, ytcp-text-input, ytcp-form-input-container').forEach(el => {
                results.ytcp.push({
                    tag: el.tagName,
                    id: el.id,
                    class: el.className ? el.className.substr(0, 60) : '',
                    visible: el.offsetParent !== null
                });
            });

            // HTML DEL BODY después del click (limitado)
            results.bodySnippet = document.body.innerHTML.substr(0, 2000);

            return results;
        }""")

        print("\n=== INPUTS después de Add link ===")
        for item in after.get('inputs', []):
            print(json.dumps(item, ensure_ascii=False))

        print("\n=== DIALOGS después de Add link ===")
        for item in after.get('dialogs', []):
            print(json.dumps(item, ensure_ascii=False))

        print("\n=== YTCP ELEMENTS ===")
        for item in after.get('ytcp', []):
            print(json.dumps(item, ensure_ascii=False))

        # También intentar buscar en shadow DOM
        shadow_info = page.evaluate("""() => {
            // buscar inputs en shadow roots
            const findInShadow = (root, depth=0) => {
                if (depth > 5) return [];
                const results = [];
                root.querySelectorAll('input, textarea').forEach(el => {
                    results.push({
                        depth,
                        tag: el.tagName,
                        placeholder: el.placeholder,
                        ariaLabel: el.getAttribute('aria-label'),
                        id: el.id,
                        hostTag: root.host ? root.host.tagName : 'DOCUMENT'
                    });
                });
                root.querySelectorAll('*').forEach(el => {
                    if (el.shadowRoot) {
                        results.push(...findInShadow(el.shadowRoot, depth+1));
                    }
                });
                return results;
            };
            return findInShadow(document);
        }""")
        print("\n=== SHADOW DOM INPUTS ===")
        for item in shadow_info:
            print(json.dumps(item, ensure_ascii=False))

        print("\nScreenshots guardadas en scripts/diag_0*.png")
        print("Para ver el DOM completo, revisa la screenshot.")

if __name__ == "__main__":
    main()
