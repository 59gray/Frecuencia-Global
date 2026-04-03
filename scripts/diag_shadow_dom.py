"""Diagnostico con shadow DOM piercing y screenshots para YouTube Studio."""
from playwright.sync_api import sync_playwright
import time
import os

CDP_URL = "http://127.0.0.1:9222"
CHANNEL_ID = "UCFZYwZwkDD6oUPacaLo7PvQ"
BASE_DIR = r"C:\Users\farid\Documents\Frecuencia Global"
STUDIO_ROOT = "https://studio.youtube.com/"


def go_with_retry(page, url: str, max_attempts: int = 5) -> bool:
    # Establish Studio session from root first
    if "studio.youtube.com" not in page.url:
        print("  Nav to Studio root first...")
        page.goto(STUDIO_ROOT, wait_until="domcontentloaded")
        try: page.wait_for_load_state("networkidle", timeout=12000)
        except: pass
        time.sleep(5)

    for attempt in range(1, max_attempts + 1):
        print(f"  Attempt {attempt}: nav to {url}")
        page.goto(url, wait_until="domcontentloaded")
        try: page.wait_for_load_state("networkidle", timeout=15000)
        except: pass
        time.sleep(6)

        # Check for error
        try:
            oops = page.get_by_text("something went wrong", exact=False).first
            if oops.is_visible(timeout=1500):
                print(f"  Oops error — retry from root...")
                page.goto(STUDIO_ROOT, wait_until="domcontentloaded")
                try: page.wait_for_load_state("networkidle", timeout=12000)
                except: pass
                time.sleep(5)
                continue
        except: pass

        current = page.url
        if any(seg in current for seg in ["customization", "settings"]):
            # Check page is not empty error
            try:
                has_error = page.get_by_text("something went wrong", exact=False).first.is_visible(timeout=1500)
                if not has_error:
                    print(f"  Loaded: {current}")
                    return True
            except:
                print(f"  Loaded: {current}")
                return True

    print(f"  Failed to reach {url}")
    return False


def dump_shadow_dom(page, label: str) -> None:
    print(f"\n{'='*60}")
    print(f"  DIAGNOSTICO SHADOW DOM: {label}")
    print(f"  URL: {page.url}")
    print("=" * 60)

    try:
        inputs = page.locator("input, textarea").all()
        print(f"\n--- INPUTS ({len(inputs)}) ---")
        for el in inputs[:20]:
            try:
                attrs = {
                    "id": el.get_attribute("id") or "",
                    "name": el.get_attribute("name") or "",
                    "type": el.get_attribute("type") or "",
                    "placeholder": el.get_attribute("placeholder") or "",
                    "aria": el.get_attribute("aria-label") or "",
                }
                print(f"  INPUT id={attrs['id']} type={attrs['type']} aria=\"{attrs['aria'][:50]}\" placeholder=\"{attrs['placeholder'][:50]}\"")
            except Exception as e:
                print(f"  (error: {e})")
    except Exception as e:
        print(f"  inputs error: {e}")

    try:
        btns = page.locator("button, [role='button']").all()
        print(f"\n--- BUTTONS ({len(btns)}) ---")
        for el in btns[:30]:
            try:
                text = el.inner_text() or ""
                aria = el.get_attribute("aria-label") or ""
                eid = el.get_attribute("id") or ""
                testid = el.get_attribute("test-id") or ""
                if text.strip() or aria:
                    print(f"  BTN id={eid} test-id={testid} aria=\"{aria[:50]}\" text=\"{text.strip()[:60]}\"")
            except: pass
    except Exception as e:
        print(f"  buttons error: {e}")

    # Screenshot
    screenshot_path = os.path.join(BASE_DIR, f"scripts/diag_{label.replace(' ', '_')}.png")
    try:
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"\n  Screenshot: {screenshot_path}")
    except Exception as e:
        print(f"  Screenshot error: {e}")

    # Full outer HTML of #app or #content (first element)
    try:
        tag_names = page.evaluate("""() => {
            // List all custom elements visible
            const all = [...document.querySelectorAll('*')];
            const ytcp = all.filter(el => el.tagName.toLowerCase().startsWith('ytcp-') || el.tagName.toLowerCase().startsWith('ytd-'));
            return [...new Set(ytcp.map(el => el.tagName.toLowerCase()))].slice(0, 40);
        }""")
        print(f"\n--- YTCP/YTD ELEMENTS ({len(tag_names)}) ---")
        for t in tag_names:
            print(f"  {t}")
    except Exception as e:
        print(f"  ytcp scan error: {e}")


with sync_playwright() as pw:
    browser = pw.chromium.connect_over_cdp(CDP_URL)
    ctx = browser.contexts[0]
    page = ctx.pages[0] if ctx.pages else ctx.new_page()
    page.on("dialog", lambda d: d.accept())

    # BasicInfo
    print("Navigating to Basic Info...")
    if go_with_retry(page, f"https://studio.youtube.com/channel/{CHANNEL_ID}/customization/basicinfo"):
        dump_shadow_dom(page, "BasicInfo")
        page.evaluate("window.scrollTo(0, 800)")
        time.sleep(2)
        page.screenshot(path=os.path.join(BASE_DIR, "scripts/diag_BasicInfo_scrolled.png"), full_page=False)
        print("  Screenshot scrolled saved.")

    # Settings
    print("\nNavigating to Settings...")
    if go_with_retry(page, f"https://studio.youtube.com/channel/{CHANNEL_ID}/settings"):
        dump_shadow_dom(page, "Settings")

print("\nDiagnostico completado.")

