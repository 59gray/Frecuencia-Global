"""Diagnostico DOM: captura botones e inputs en cada pagina de YouTube Studio."""
from playwright.sync_api import sync_playwright
import time

CDP_URL = "http://127.0.0.1:9222"
CHANNEL_ID = "UCFZYwZwkDD6oUPacaLo7PvQ"

PAGES_TO_INSPECT = [
    ("Basic Info", f"https://studio.youtube.com/channel/{CHANNEL_ID}/customization/basicinfo"),
    ("Settings", f"https://studio.youtube.com/channel/{CHANNEL_ID}/settings"),
]


def dump_page(page, label: str) -> None:
    print(f"\n{'='*60}")
    print(f"  DIAGNOSTICO: {label}")
    print(f"  URL: {page.url}")
    print("=" * 60)

    info = page.evaluate("""() => {
        const btns = [...document.querySelectorAll('button, ytcp-button, [role="button"]')]
            .filter(el => el.offsetParent !== null)
            .map(el => ({
                tag: el.tagName,
                id: el.id || '',
                cls: (el.className || '').toString().substring(0, 50),
                text: (el.textContent || '').trim().substring(0, 70),
                aria: el.getAttribute('aria-label') || ''
            }));
        const inputs = [...document.querySelectorAll('input, textarea')]
            .filter(el => el.offsetParent !== null)
            .map(el => ({
                tag: el.tagName,
                id: el.id || '',
                name: el.name || '',
                placeholder: (el.placeholder || '').substring(0, 60),
                aria: (el.getAttribute('aria-label') || '').substring(0, 60),
                type: el.type || ''
            }));
        const links_containers = [...document.querySelectorAll(
            '[class*="link"], [id*="link"], [test-id*="link"], ytcp-url-endpoint-section'
        )]
            .filter(el => el.offsetParent !== null)
            .map(el => ({
                tag: el.tagName,
                id: el.id || '',
                cls: (el.className || '').toString().substring(0, 60),
                testid: el.getAttribute('test-id') || ''
            }));
        return { btns: btns.slice(0,40), inputs: inputs.slice(0,25), links: links_containers.slice(0,15) };
    }""")

    print("--- BUTTONS ---")
    for b in info["btns"]:
        aria = f' aria="{b["aria"]}"' if b["aria"] else ""
        print(f"  {b['tag']}#{b['id']} -> \"{b['text']}\"{aria}")

    print("--- INPUTS/TEXTAREAS ---")
    for i in info["inputs"]:
        print(f"  {i['tag']} id={i['id']} type={i['type']} aria=\"{i['aria']}\" placeholder=\"{i['placeholder']}\"")

    print("--- LINK-RELATED ELEMENTS ---")
    for l in info["links"]:
        print(f"  {l['tag']}#{l['id']} test-id={l['testid']} class={l['cls'][:50]}")


with sync_playwright() as pw:
    browser = pw.chromium.connect_over_cdp(CDP_URL)
    ctx = browser.contexts[0]
    page = ctx.pages[0] if ctx.pages else ctx.new_page()
    page.on("dialog", lambda d: d.accept())

    for label, url in PAGES_TO_INSPECT:
        page.goto(url, wait_until="domcontentloaded")
        try:
            page.wait_for_load_state("networkidle", timeout=14000)
        except Exception:
            pass
        time.sleep(6)
        dump_page(page, label)

print("\nDiagnostico completado.")
