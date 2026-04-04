"""Abre tu Chrome real (no Chromium de Playwright) para login en X.
Evita la detección de 'automated test software'.
La sesión se guarda en .chrome-x-stable/

Uso:
    python scripts/x_chrome_login.py
"""

import time
import subprocess
import shutil
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
CHROME_PROFILE_DIR = REPO_ROOT / ".chrome-x-stable"

# Buscar Chrome real en ubicaciones comunes
CHROME_PATHS = [
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    Path.home() / r"AppData\Local\Google\Chrome\Application\chrome.exe",
]

def find_chrome():
    for p in CHROME_PATHS:
        if p.exists():
            return str(p)
    # Intentar con where
    result = subprocess.run(["where", "chrome"], capture_output=True, text=True)
    if result.returncode == 0:
        return result.stdout.strip().split("\n")[0]
    return None

chrome = find_chrome()
if not chrome:
    print("[ERROR] No se encontró Chrome instalado.")
    print("Instala Chrome o indica la ruta manualmente.")
    exit(1)

print(f"Chrome: {chrome}")
print(f"Perfil: {CHROME_PROFILE_DIR}")
print()
print("Se abrirá Chrome SIN banner de automatización.")
print("1. Inicia sesión en X/Twitter")
print("2. Cierra Chrome cuando termines")
print()

# Lanzar Chrome real con perfil separado
proc = subprocess.Popen([
    chrome,
    f"--user-data-dir={CHROME_PROFILE_DIR}",
    "--no-first-run",
    "--no-default-browser-check",
    "https://x.com/login"
])

print("Chrome abierto. Esperando a que lo cierres...")
proc.wait()
print("\nSesión guardada en .chrome-x-stable/")
print("Ya puedes ejecutar: python scripts/x_publish_post.py --pieza P1_001")
