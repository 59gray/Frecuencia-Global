"""Diagnóstico rápido: screenshot del Studio root."""
from playwright.sync_api import sync_playwright
import time
import os

CDP_URL = "http://127.0.0.1:9222"
CHANNEL_ID = "UCFZYwZwkDD6oUPacaLo7PvQ"
BASE_DIR = r"C:\Users\farid\Documents\Frecuencia Global"

with sync_playwright() as pw:
    browser = pw.chromium.connect_over_cdp(CDP_URL)
    ctx = browser.contexts[0]
    page = ctx.pages[0] if ctx.pages else ctx.new_page()
    page.on("dialog", lambda d: d.accept())

    # Go to Studio root
    print("Going to Studio root...")
    page.goto("https://studio.youtube.com/", wait_until="domcontentloaded")
    try:
        page.wait_for_load_state("networkidle", timeout=20000)
    except Exception:
        pass
    time.sleep(8)
    print(f"URL after root load: {page.url}")
    page.screenshot(path=os.path.join(BASE_DIR, "scripts/diag_root.png"), full_page=False)
    print("Screenshot: diag_root.png")

    # Try clicking 'Customization' from sidebar
    print("\nLooking for Customization in sidebar...")
    custom_selectors = [
        'a[href*="customization"]',
        '[aria-label*="customization"]',
        '[aria-label*="Customization"]',
        '[aria-label*="Personalización"]',
        'tp-yt-paper-item:has-text("Customization")',
        'tp-yt-paper-item:has-text("Personalización")',
    ]
    for sel in custom_selectors:
        els = page.locator(sel).all()
        if els:
            print(f"  Found {len(els)} elements with: {sel}")
            for el in els[:3]:
                try:
                    txt = el.inner_text()
                    href = el.get_attribute("href") or ""
                    print(f"    text='{txt.strip()[:50]}' href='{href}'")
                except:
                    pass

    # Try clicking first customization link
    try:
        link = page.locator('a[href*="customization"]').first
        if link.is_visible(timeout=2000):
            print("\nClicking first customization link...")
            link.click()
            time.sleep(5)
            print(f"URL after click: {page.url}")
            page.screenshot(path=os.path.join(BASE_DIR, "scripts/diag_after_custom_click.png"))
            print("Screenshot: diag_after_custom_click.png")
    except Exception as e:
        print(f"  Couldn't click customization link: {e}")

    # Also try going to settings via sidebar
    page.goto("https://studio.youtube.com/", wait_until="domcontentloaded")
    time.sleep(5)
    try:
        settings_link = page.locator('a[href*="settings"]').first
        if settings_link.is_visible(timeout=2000):
            print("\nClicking settings link...")
            settings_link.click()
            time.sleep(5)
            print(f"URL after settings click: {page.url}")
            page.screenshot(path=os.path.join(BASE_DIR, "scripts/diag_settings_click.png"))
            print("Screenshot: diag_settings_click.png")
    except Exception as e:
        print(f"  Settings link: {e}")

print("\nDone.")
