"""Abre Chrome en LinkedIn Developer Portal para login manual.

Uso:
    python scripts/linkedin_open_browser.py
"""

import time
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

try:
    from fg_automation_config import chrome_executable
except ImportError:
    def chrome_executable():
        return None

REPO_ROOT = Path(__file__).parent.parent
CHROME_PROFILE_DIR = REPO_ROOT / ".chrome-linkedin-stable"
LINKEDIN_DEVELOPERS_URL = "https://www.linkedin.com/developers/apps"

CHROME_PROFILE_DIR.mkdir(parents=True, exist_ok=True)

chrome_exe = chrome_executable()
launch_args = {
    "user_data_dir": str(CHROME_PROFILE_DIR),
    "headless": False,
    "args": ["--start-maximized", "--no-first-run"],
    "viewport": None,
    "no_viewport": True,
}
if chrome_exe:
    launch_args["executable_path"] = str(chrome_exe)

print("Abriendo navegador en LinkedIn Developer Portal...")
print("Logueate manualmente y crea la app.")
print("El navegador permanecerá abierto 10 minutos.")

with sync_playwright() as p:
    context = p.chromium.launch_persistent_context(**launch_args)
    page = context.new_page()
    page.goto(LINKEDIN_DEVELOPERS_URL, wait_until="domcontentloaded", timeout=60000)
    
    print("\nNavegador abierto. Haz login y crea la app.")
    print("Cuando tengas Client ID y Client Secret, cierra el navegador.")
    
    # Esperar hasta 10 minutos
    time.sleep(600)
    context.close()
