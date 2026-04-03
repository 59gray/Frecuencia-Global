# Script de automatización para subir foto de perfil y banner a YouTube Studio usando Playwright
# Requisitos: pip install playwright
# Inicializa Playwright: playwright install

from playwright.sync_api import sync_playwright
import time

# Rutas de los archivos
PROFILE_IMAGE = r'C:/Users/farid/Documents/Frecuencia Global/Frecuencia_Global_Activos_Canva_v1/FG_Avatar_Master_v1.png'
BANNER_IMAGE = r'C:/Users/farid/Documents/Frecuencia Global/Frecuencia_Global_Activos_Canva_v1/FG_Banner_YouTube_v1.png'
UPLOAD_BANNER = False

# URL de YouTube Studio
YOUTUBE_STUDIO_URL = 'https://studio.youtube.com/'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto(YOUTUBE_STUDIO_URL)
    print('Intentando continuar automáticamente en YouTube Studio...')
    time.sleep(5)

    # Si hay login pendiente, espera a que el usuario termine en YouTube Studio.
    if 'accounts.google.com' in page.url:
        print('Login detectado. Esperando hasta 300s por sesion activa...')
        deadline = time.time() + 300
        while time.time() < deadline:
            if 'studio.youtube.com' in page.url and 'accounts.google.com' not in page.url:
                break
            time.sleep(2)

    # Ir a personalización
    page.goto('https://studio.youtube.com/channel/UC/customization')
    time.sleep(5)

    # Subir foto de perfil
    try:
        print('Subiendo foto de perfil...')
        page.goto('https://studio.youtube.com/channel/UC/customization/branding')
        page.wait_for_selector('input[type="file"]', timeout=30000)
        file_inputs = page.locator('input[type="file"]')
        if file_inputs.count() == 0:
            raise RuntimeError('No se encontraron inputs de archivo en Branding.')
        file_inputs.nth(0).set_input_files(PROFILE_IMAGE)
        time.sleep(2)
        print('Foto de perfil seleccionada. Confirma el cambio manualmente si es necesario.')
    except Exception as e:
        print('No se pudo automatizar la subida de foto de perfil:', e)

    # Subir banner (opcional)
    if UPLOAD_BANNER:
        try:
            print('Subiendo banner...')
            # Busca el input de banner (puede requerir ajuste de selector)
            page.set_input_files('input[type="file"]', BANNER_IMAGE)
            time.sleep(2)
            print('Banner seleccionado. Confirma el cambio manualmente si es necesario.')
        except Exception as e:
            print('No se pudo automatizar la subida de banner:', e)

    print('Revisa y guarda los cambios manualmente en YouTube Studio.')
    time.sleep(10)
    browser.close()
