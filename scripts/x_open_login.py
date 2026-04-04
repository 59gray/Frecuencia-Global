"""Abre Chrome con perfil persistente para login en X/Twitter.
Cierra el navegador manualmente cuando termines de loguearte.
La sesión se guarda en .chrome-x-stable/

Uso:
    python scripts/x_open_login.py
"""

import time
from pathlib import Path
from playwright.sync_api import sync_playwright

try:
    from fg_automation_config import chrome_executable
except ImportError:
    def chrome_executable():
        return None

REPO_ROOT = Path(__file__).parent.parent
CHROME_PROFILE_DIR = REPO_ROOT / ".chrome-x-stable"

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

print(f"Perfil: {CHROME_PROFILE_DIR}")
print("Abriendo navegador... Inicia sesión en X.")
print("Cierra el navegador manualmente cuando termines.\n")

with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context(**launch_args)
    page = ctx.new_page()
    page.goto("https://x.com/login", timeout=60000)

    # Mantener abierto hasta que el usuario cierre el navegador
    try:
        while ctx.pages:
            time.sleep(1)
    except Exception:
        pass

print("\nSesión guardada en .chrome-x-stable/")
