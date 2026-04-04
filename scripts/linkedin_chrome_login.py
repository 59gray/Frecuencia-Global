"""Abre tu Chrome real para login en LinkedIn.
La sesión se guarda en .chrome-linkedin-stable/

Uso:
    python scripts/linkedin_chrome_login.py
"""

import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
CHROME_PROFILE_DIR = REPO_ROOT / ".chrome-linkedin-stable"
CHROME_PROFILE_DIR.mkdir(parents=True, exist_ok=True)

CHROME_PATHS = [
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    Path.home() / r"AppData\Local\Google\Chrome\Application\chrome.exe",
]

def find_chrome():
    for p in CHROME_PATHS:
        if p.exists():
            return str(p)
    return None

chrome = find_chrome()
if not chrome:
    print("[ERROR] No se encontró Chrome.")
    exit(1)

print(f"Chrome: {chrome}")
print(f"Perfil: {CHROME_PROFILE_DIR}")
print()
print("1. Inicia sesión en LinkedIn")
print("2. Cierra Chrome cuando termines")
print()

proc = subprocess.Popen([
    chrome,
    f"--user-data-dir={CHROME_PROFILE_DIR}",
    "--no-first-run",
    "--no-default-browser-check",
    "https://www.linkedin.com/login"
])

print("Chrome abierto. Esperando a que lo cierres...")
proc.wait()
print("\nSesión guardada en .chrome-linkedin-stable/")
