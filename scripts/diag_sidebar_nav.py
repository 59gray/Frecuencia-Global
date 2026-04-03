"""
Diagnóstico: navega via sidebar en Studio (como lo haría un usuario real).
Captura DOM de Customization/BasicInfo y Settings.
"""
from playwright.sync_api import sync_playwright
import time
import os

CDP_URL = "http://127.0.0.1:9222"
CHANNEL_ID = "UCFZYwZwkDD6oUPacaLo7PvQ"
BASE_DIR = r"C:\Users\farid\Documents\Frecuencia Global"
STUDIO_ROOT = "https://studio.youtube.com/"


def screenshot(page, name: str) -> None:
    path = os.path.join(BASE_DIR, f"scripts/diag_{name}.png")
    page.screenshot(path=path, full_page=False)
    print(f"  Screenshot: diag_{name}.png")


def dump_page(page) -> None:
    url = page.url
    print(f"  URL: {url}")

    btns_found = []
    try:
        btns = page.locator("button, [role='button']").all()
        for el in btns[:40]:
            try:
                text = (el.inner_text() or "").strip()
                aria = el.get_attribute("aria-label") or ""
                eid = el.get_attribute("id") or ""
                testid = el.get_attribute("test-id") or ""
                tag = el.evaluate("el => el.tagName")
                if text or aria:
                    btns_found.append(f"  {tag} id={eid} test-id={testid} aria=\"{aria[:50]}\" text=\"{text[:60]}\"")
            except:
                pass
    except:
        pass

    inputs_found = []
    try:
        inputs = page.locator("input, textarea").all()
        for el in inputs[:25]:
            try:
                eid = el.get_attribute("id") or ""
                name = el.get_attribute("name") or ""
                t = el.get_attribute("type") or ""
                ph = el.get_attribute("placeholder") or ""
                aria = el.get_attribute("aria-label") or ""
                inputs_found.append(f"  INPUT id={eid} name={name} type={t} aria=\"{aria[:50]}\" ph=\"{ph[:50]}\"")
            except:
                pass
    except:
        pass

    print(f"\n  BUTTONS ({len(btns_found)}):")
    for b in btns_found:
        print(b)
    print(f"\n  INPUTS ({len(inputs_found)}):")
    for i in inputs_found:
        print(i)


def click_sidebar(page, text: str) -> bool:
    """Intenta hacer clic en un item del sidebar de Studio."""
    selectors = [
        f'tp-yt-paper-item:has-text("{text}")',
        f'[data-nav-item-id*="{text.lower()}"]',
        f'ytd-guide-entry-renderer:has-text("{text}")',
        f'a:has-text("{text}")',
        f'div:has-text("{text}")',
    ]
    for sel in selectors:
        try:
            els = page.locator(sel).all()
            for el in els:
                if el.is_visible(timeout=1500):
                    el.click(timeout=3000)
                    print(f"  Clicked sidebar item: '{text}' via {sel}")
                    time.sleep(4)
                    return True
        except:
            pass
    
    # Last resort: click by exact text match
    try:
        page.get_by_text(text, exact=True).first.click(timeout=3000)
        print(f"  Clicked sidebar item by text: '{text}'")
        time.sleep(4)
        return True
    except:
        pass

    print(f"  ✗ Could not click sidebar item: '{text}'")
    return False


def click_tab(page, text: str) -> bool:
    """Hace clic en una tab dada su etiqueta."""
    try:
        tab = page.get_by_role("tab", name=text, exact=False).first
        if tab.is_visible(timeout=2000):
            tab.click(timeout=3000)
            print(f"  Clicked tab: '{text}'")
            time.sleep(3)
            return True
    except:
        pass
    try:
        tab = page.get_by_text(text, exact=False).first
        if tab.is_visible(timeout=1500):
            tab.click(timeout=3000)
            print(f"  Clicked tab text: '{text}'")
            time.sleep(3)
            return True
    except:
        pass
    print(f"  ✗ Tab not clicked: '{text}'")
    return False


with sync_playwright() as pw:
    browser = pw.chromium.connect_over_cdp(CDP_URL)
    ctx = browser.contexts[0]
    page = ctx.pages[0] if ctx.pages else ctx.new_page()
    page.on("dialog", lambda d: d.accept())

    # Go to Studio Root and wait for it to load
    print("\n[1] Studio Root...")
    page.goto(STUDIO_ROOT, wait_until="domcontentloaded")
    try: page.wait_for_load_state("networkidle", timeout=15000)
    except: pass
    time.sleep(6)
    print(f"  URL: {page.url}")
    screenshot(page, "00_studio_root")

    # Click Customization in sidebar
    print("\n[2] Clicking 'Customization' in sidebar...")
    if click_sidebar(page, "Customization") or click_sidebar(page, "Personalización"):
        screenshot(page, "01_customization")
        print(f"  After click URL: {page.url}")

        # Click 'Basic info' tab
        print("\n[3] Clicking 'Basic info' tab...")
        if click_tab(page, "Basic info") or click_tab(page, "Información básica"):
            screenshot(page, "02_basic_info")
            print(f"  After tab URL: {page.url}")
            print("\n--- Dumping Basic Info DOM ---")
            dump_page(page)

            # Scroll to find links section
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(3)
            screenshot(page, "03_basic_info_scrolled")
            print("\n--- Dumping Basic Info DOM (scrolled) ---")
            dump_page(page)
    
    # Now go to Settings
    print("\n[4] Clicking 'Settings' in sidebar...")
    page.goto(STUDIO_ROOT, wait_until="domcontentloaded")
    time.sleep(5)

    if click_sidebar(page, "Settings") or click_sidebar(page, "Configuración"):
        screenshot(page, "04_settings")
        print(f"  After Settings click URL: {page.url}")
        print("\n--- Dumping Settings DOM ---")
        dump_page(page)

        # Try to open Upload Defaults section
        print("\n[5] Looking for Upload defaults tab...")
        if click_tab(page, "Upload defaults") or click_tab(page, "Valores predeterminados"):
            screenshot(page, "05_upload_defaults")
            print("\n--- Dumping Upload Defaults DOM ---")
            dump_page(page)

print("\nDiagnostico via sidebar completado.")
