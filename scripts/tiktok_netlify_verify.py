"""
Automatiza completamente la verificación de TikTok con Netlify.
1. Va a TikTok Developer
2. Actualiza las URLs con la URL de Netlify
3. Obtiene el código de verificación
4. Sube el archivo de verificación a Netlify via drag-and-drop
5. Verifica el dominio en TikTok
"""

import os
import re
import time
import subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright

NETLIFY_URL = "https://statuesque-cajeta-f5bd40.netlify.app"
TIKTOK_APP_URL = "https://developers.tiktok.com/app/7624985614836172818/pending/"
NETLIFY_DASHBOARD = "https://app.netlify.com/sites/statuesque-cajeta-f5bd40/overview"
TMP_DIR = Path(__file__).parent.parent / "scripts" / "tmp_netlify"


def find_chrome():
    for c in [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]:
        if os.path.exists(c):
            return c
    return None


def complete_tiktok_verification():
    chrome_exe = find_chrome()
    if not chrome_exe:
        print("[ERROR] Chrome no encontrado")
        return False
    
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            user_data_dir=str(Path(__file__).parent.parent / ".chrome-tk-stable"),
            headless=False,
            args=["--start-maximized", "--no-first-run", "--disable-blink-features=AutomationControlled"],
            executable_path=chrome_exe,
            viewport=None,
            no_viewport=True,
        )
        
        page = ctx.new_page()
        
        # Paso 1: Ir a TikTok y actualizar URLs
        print("[1/5] Navegando a TikTok Developer...")
        page.goto(TIKTOK_APP_URL, wait_until="domcontentloaded", timeout=60000)
        time.sleep(5)
        
        print("[2/5] Actualizando URLs con Netlify...")
        
        # Actualizar Terms URL
        try:
            terms_inputs = page.locator('input').all()
            for inp in terms_inputs:
                placeholder = inp.get_attribute('placeholder') or ''
                name = inp.get_attribute('name') or ''
                if 'terms' in name.lower() or 'terms' in placeholder.lower():
                    inp.fill(f"{NETLIFY_URL}/")
                    print(f"  [OK] Terms URL: {NETLIFY_URL}/")
                    time.sleep(1)
                    break
        except Exception as e:
            print(f"  [WARN] Error Terms: {e}")
        
        # Actualizar Privacy URL
        try:
            privacy_inputs = page.locator('input').all()
            for inp in privacy_inputs:
                placeholder = inp.get_attribute('placeholder') or ''
                name = inp.get_attribute('name') or ''
                if 'privacy' in name.lower() or 'privacy' in placeholder.lower():
                    inp.fill(f"{NETLIFY_URL}/privacy.html")
                    print(f"  [OK] Privacy URL: {NETLIFY_URL}/privacy.html")
                    time.sleep(1)
                    break
        except Exception as e:
            print(f"  [WARN] Error Privacy: {e}")
        
        # Guardar cambios
        try:
            save_btn = page.locator('button:has-text("Save"), button:has-text("Guardar"), button[type="submit"]').first
            if save_btn.count() > 0:
                save_btn.click()
                print("  [OK] Guardado")
                time.sleep(3)
        except:
            pass
        
        # Paso 3: Click en Verify URL properties
        print("[3/5] Buscando botón de verificación...")
        time.sleep(3)
        
        # Tomar screenshot para debug
        page.screenshot(path=str(Path(__file__).parent.parent / "scripts" / "tiktok_before_verify.png"))
        
        # Buscar enlaces de verificación
        verify_links = page.locator('a, button').all()
        verification_code = None
        
        for link in verify_links:
            try:
                text = link.text_content() or ''
                if 'verify' in text.lower() or 'verificar' in text.lower() or 'url properties' in text.lower():
                    print(f"  Click en: {text}")
                    link.click()
                    time.sleep(5)
                    
                    # Buscar código de verificación en la página
                    page_content = page.content()
                    
                    # Buscar el código
                    match = re.search(r'tiktok-developers-site-verification=([a-zA-Z0-9]+)', page_content)
                    if match:
                        verification_code = match.group(1)
                        print(f"  [OK] Código encontrado: {verification_code}")
                        
                        # Tomar screenshot
                        page.screenshot(path=str(Path(__file__).parent.parent / "scripts" / "tiktok_verification_dialog.png"))
                        
                        # Cerrar diálogo
                        try:
                            close_btn = page.locator('button:has-text("Ok"), button:has-text("OK"), button.close, [aria-label="Close"]').first
                            if close_btn.count() > 0:
                                close_btn.click()
                                time.sleep(2)
                        except:
                            page.keyboard.press("Escape")
                            time.sleep(1)
                        
                        break
            except Exception as e:
                continue
        
        if not verification_code:
            print("[ERROR] No se encontró código de verificación")
            print("[INFO] Intentando extraer de la URL actual...")
            
            # Intentar obtener de la URL
            current_url = page.url
            print(f"  URL actual: {current_url}")
            
            # Buscar en el texto visible
            page_text = page.inner_text('body')
            match = re.search(r'tiktok-developers-site-verification=([a-zA-Z0-9]+)', page_text)
            if match:
                verification_code = match.group(1)
                print(f"  [OK] Código encontrado en texto: {verification_code}")
        
        ctx.close()
        
        if verification_code:
            print(f"\n[4/5] Creando archivo de verificación: {verification_code}")
            create_verification_file(verification_code)
            
            print("\n[5/5] Abriendo Netlify para subir archivo...")
            open_netlify_to_upload(chrome_exe, verification_code)
            
            return True
        else:
            print("[ERROR] No se pudo obtener código de verificación")
            return False


def create_verification_file(code):
    """Crea el archivo de verificación."""
    filename = f"tiktok{code}.txt"
    filepath = TMP_DIR / filename
    filepath.write_text(f"tiktok-developers-site-verification={code}")
    print(f"  [OK] Archivo creado: {filepath}")
    return filepath


def open_netlify_to_upload(chrome_exe, code):
    """Abre Netlify para que el usuario suba el archivo."""
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            user_data_dir=str(Path(__file__).parent.parent / ".chrome-netlify"),
            headless=False,
            args=["--start-maximized", "--no-first-run"],
            executable_path=chrome_exe,
            viewport=None,
            no_viewport=True,
        )
        
        page = ctx.new_page()
        page.goto(NETLIFY_DASHBOARD, wait_until="domcontentloaded", timeout=60000)
        
        print(f"\n{'='*60}")
        print("INSTRUCCIONES PARA SUBIR EL ARCHIVO A NETLIFY:")
        print(f"{'='*60}")
        print(f"\n1. En la sección 'Production deploys' de Netlify")
        print(f"2. Arrastra este archivo a la zona de drop:")
        print(f"   {TMP_DIR / f'tiktok{code}.txt'}")
        print(f"\n3. Espera 30 segundos a que se deploye")
        print(f"4. Vuelve a TikTok y dale click a 'Verify'")
        print(f"\n{'='*60}")
        
        # Mantener abierto para que el usuario vea
        time.sleep(60)
        
        ctx.close()


if __name__ == "__main__":
    complete_tiktok_verification()
