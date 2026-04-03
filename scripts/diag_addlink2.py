"""Diagnóstico rápido: busca inputs después de 'Add link' usando JS recursivo en shadow DOM."""
from playwright.sync_api import sync_playwright
import time, json, urllib.request, subprocess, os

CDP_URL = "http://127.0.0.1:9222"
YOUTUBE_STUDIO_ROOT = "https://studio.youtube.com/"
CHROME_EXE = r"C:/Program Files/Google/Chrome/Application/chrome.exe"
CHROME_PROFILE_DIR = r"C:/Users/farid/Documents/Frecuencia Global/.chrome-youtube-stable"
BASE_DIR = r"C:/Users/farid/Documents/Frecuencia Global"

def cdp_ready():
    try:
        with urllib.request.urlopen(f"{CDP_URL}/json/version", timeout=2) as r:
            return r.status == 200
    except: return False

FIND_ALL_INPUTS_JS = """
() => {
    const results = [];
    function scan(root, path, depth) {
        if (depth > 8) return;
        const els = root.querySelectorAll('input, textarea');
        els.forEach(el => {
            results.push({
                path,
                depth,
                tag: el.tagName,
                type: el.type,
                placeholder: el.placeholder,
                ariaLabel: el.getAttribute('aria-label'),
                id: el.id,
                name: el.name,
                readonly: el.readOnly,
                disabled: el.disabled,
                offsetParent: el.offsetParent !== null,
                rect: (() => { try { const r = el.getBoundingClientRect(); return {top:Math.round(r.top),left:Math.round(r.left),w:Math.round(r.width),h:Math.round(r.height)}; } catch(e) { return null; } })(),
                parentTag: el.parentElement ? el.parentElement.tagName : ''
            });
        });
        // recurse into shadow roots
        root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) {
                scan(el.shadowRoot, path + '>' + el.tagName + (el.id?'#'+el.id:''), depth+1);
            }
        });
    }
    scan(document, 'document', 0);
    return results;
}
"""

def main():
    if not cdp_ready():
        print("Iniciando Chrome...")
        subprocess.Popen([CHROME_EXE, "--remote-debugging-port=9222",
            f"--user-data-dir={CHROME_PROFILE_DIR}", "--profile-directory=Default", YOUTUBE_STUDIO_ROOT])
        for _ in range(20):
            time.sleep(1)
            if cdp_ready(): break

    with sync_playwright() as pw:
        browser = pw.chromium.connect_over_cdp(CDP_URL)
        ctx = browser.contexts[0]
        page = ctx.pages[0] if ctx.pages else ctx.new_page()

        print(f"URL actual: {page.url}")

        # Navegar a profile si no estamos ahí
        if "/editing/profile" not in page.url:
            print("Navegando a Studio root...")
            try:
                page.goto(YOUTUBE_STUDIO_ROOT, wait_until="domcontentloaded", timeout=15000)
                time.sleep(4)
            except Exception as e:
                print(f"goto error: {e}")
            print("Clickeando Customization en sidebar...")
            try:
                link = page.locator('a:has-text("Customization")').first
                link.wait_for(state="visible", timeout=8000)
                link.click()
                time.sleep(4)
            except Exception as e:
                print(f"Sidebar: {e}")
            print(f"URL: {page.url}")

        # Dump todos los inputs ANTES de click
        print("\n=== INPUTS ANTES de click Add link ===")
        before = page.evaluate(FIND_ALL_INPUTS_JS)
        for item in before[:20]:  # limit output
            print(json.dumps(item, ensure_ascii=False))

        # Click Add link
        print("\n--- Click en Add link ---")
        for sel in ['ytcp-button:has-text("Add link")', 'button:has-text("Add link")']:
            try:
                b = page.locator(sel).first
                if b.count() > 0:
                    b.scroll_into_view_if_needed(timeout=3000)
                    b.click(timeout=4000)
                    print(f"  Clicked via: {sel}")
                    break
            except Exception as e:
                print(f"  {sel}: {e}")

        time.sleep(3)
        page.screenshot(path=os.path.join(BASE_DIR, "scripts", "diag_addlink_after.png"))
        print("Screenshot guardada: diag_addlink_after.png")

        # Dump TODOS los inputs DESPUÉS
        print("\n=== INPUTS DESPUÉS de click Add link ===")
        after = page.evaluate(FIND_ALL_INPUTS_JS)
        new_inputs = [i for i in after if i not in before]
        all_inputs = after

        print(f"Total inputs: {len(all_inputs)}, Nuevos: {len(new_inputs)}")
        for item in all_inputs:
            print(json.dumps(item, ensure_ascii=False))

        # Intentar fill usando JS directo en shadow DOM
        print("\n--- Intentando fill directo via JS ---")
        fill_result = page.evaluate("""
        (url_val) => {
            function findAndFill(root, placeholder, value, depth) {
                if (depth > 8) return false;
                const inputs = root.querySelectorAll('input, textarea');
                for (const input of inputs) {
                    if (input.placeholder && input.placeholder.toLowerCase().includes(placeholder.toLowerCase())) {
                        // Intentar fill via React/Angular events
                        input.focus();
                        input.value = value;
                        input.dispatchEvent(new Event('input', {bubbles: true}));
                        input.dispatchEvent(new Event('change', {bubbles: true}));
                        return {found: true, placeholder: input.placeholder, value: input.value};
                    }
                }
                // recurse shadow roots
                for (const el of root.querySelectorAll('*')) {
                    if (el.shadowRoot) {
                        const result = findAndFill(el.shadowRoot, placeholder, value, depth+1);
                        if (result) return result;
                    }
                }
                return false;
            }
            return findAndFill(document, 'URL', url_val, 0);
        }
        """, "https://www.instagram.com/frecuencia.global")
        print(f"JS fill result: {fill_result}")

        time.sleep(1)
        page.screenshot(path=os.path.join(BASE_DIR, "scripts", "diag_after_fill.png"))

if __name__ == "__main__":
    main()
