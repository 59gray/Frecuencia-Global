"""Abre Chrome en LinkedIn Developer Portal para login manual.
Sin perfil persistente para evitar conflictos.

Uso:
    python scripts/linkedin_browser.py
"""

import time
from playwright.sync_api import sync_playwright

try:
    from fg_automation_config import chrome_executable
except ImportError:
    def chrome_executable():
        return None

URL = "https://www.linkedin.com/developers/apps"

chrome_exe = chrome_executable()
args = {
    "headless": False,
    "args": ["--start-maximized"],
}

if chrome_exe:
    args["executable_path"] = str(chrome_exe)

print("Abriendo navegador...")
print("Logueate en LinkedIn y crea la app.")
print("Cierra el navegador cuando termines.\n")

with sync_playwright() as p:
    browser = p.chromium.launch(**args)
    context = browser.new_context()
    page = context.new_page()
    page.goto(URL, timeout=60000)
    
    print("Navegador abierto. Esperando...")
    print("Cuando tengas Client ID y Client Secret, avísame.")
    
    # Mantener abierto
    try:
        while True:
            time.sleep(60)
    except KeyboardInterrupt:
        pass
    
    browser.close()
