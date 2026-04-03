"""
Automatiza el cambio de foto de perfil en LinkedIn usando Playwright.
- Requiere: pip install playwright && python -m playwright install
- Primer uso: inicia sesion manualmente en LinkedIn cuando el navegador se abra.
- Usa el logo de Frecuencia Global como avatar.
"""

import time

from playwright.sync_api import sync_playwright

from fg_automation_config import LINKEDIN_COMPANY_URL, TIKTOK_PROFILE_IMAGE, chrome_executable

AVATAR_PATH = str(TIKTOK_PROFILE_IMAGE)
LINKEDIN_URL = LINKEDIN_COMPANY_URL
CHROME_EXE = str(chrome_executable())

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, executable_path=CHROME_EXE)
    context = browser.new_context()
    page = context.new_page()
    page.goto(LINKEDIN_URL)
    print("Inicia sesion manualmente si es necesario...")
    page.wait_for_timeout(15000)

    try:
        page.click('img.pv-top-card-profile-picture__image', timeout=10000)
    except Exception:
        print("No se encontro el avatar, intenta manualmente.")
        browser.close()
        raise SystemExit(1)

    time.sleep(2)

    try:
        page.click('button[aria-label*="Editar foto"]', timeout=8000)
    except Exception:
        print("No se encontro el boton de editar foto, intenta manualmente.")
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
