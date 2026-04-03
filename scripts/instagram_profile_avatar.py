"""
Automatiza el cambio de foto de perfil en Instagram usando Playwright.
- Requiere: pip install playwright && python -m playwright install
- Primer uso: inicia sesion manualmente en Instagram cuando el navegador se abra.
- Usa el logo de Frecuencia Global como avatar.
"""

import time

from playwright.sync_api import sync_playwright

from fg_automation_config import TIKTOK_PROFILE_IMAGE, chrome_executable

AVATAR_PATH = str(TIKTOK_PROFILE_IMAGE)
INSTAGRAM_URL = "https://www.instagram.com/accounts/edit/"
CHROME_EXE = str(chrome_executable())

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, executable_path=CHROME_EXE)
    context = browser.new_context()
    page = context.new_page()
    page.goto(INSTAGRAM_URL)
    print("Inicia sesion manualmente si es necesario...")
    page.wait_for_timeout(15000)

    try:
        page.click('img[data-testid="user-avatar"]', timeout=10000)
    except Exception:
        print("No se encontro el avatar, intenta manualmente.")
        browser.close()
        raise SystemExit(1)

    time.sleep(2)

    try:
        page.click('text="Cambiar foto de perfil"', timeout=8000)
    except Exception:
        print("No se encontro el boton de cambiar foto, intenta manualmente.")
        browser.close()
        raise SystemExit(1)

    time.sleep(2)
    input_file = page.query_selector('input[type="file"]')
    if input_file:
        input_file.set_input_files(AVATAR_PATH)
        print("Logo subido. Confirma el cambio en la UI si es necesario.")
    else:
        print("No se encontro el input de archivo. Hazlo manualmente.")

    time.sleep(10)
    browser.close()
