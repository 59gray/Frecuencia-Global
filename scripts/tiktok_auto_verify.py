"""Automatiza TODO el proceso de verificación de TikTok Developer.
Lee el código de verificación de la página, lo sube a GitHub, y completa el formulario.
"""

import os
import re
import time
import subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO_ROOT = Path(__file__).parent.parent
CHROME_PROFILE_DIR = REPO_ROOT / ".chrome-tk-stable"
GITHUB_PAGES_DIR = REPO_ROOT / "scripts" / "tmp_github_pages"
TIKTOK_APP_URL = "https://developers.tiktok.com/app/7624985614836172818/pending/"

def find_chrome():
    for c in [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]:
        if os.path.exists(c):
            return c
    return None

def extract_verification_code(page):
    """Extrae el código de verificación de la página de TikTok."""
    # Buscar el código en el texto de la página
    html_content = page.content()
    
    # Patrón: tiktok-developers-site-verification=XXXXXXXX
    match = re.search(r'tiktok-developers-site-verification=([a-zA-Z0-9]+)', html_content)
    if match:
        return match.group(1)
    
    # Buscar en elementos visibles
    try:
        code_elements = page.locator('text=/tiktok-developers-site-verification=/').all()
        for el in code_elements:
            text = el.text_content()
            match = re.search(r'tiktok-developers-site-verification=([a-zA-Z0-9]+)', text)
            if match:
                return match.group(1)
    except:
        pass
    
    return None

def get_verification_url(page):
    """Obtiene la URL exacta que TikTok está intentando verificar."""
    try:
        # Buscar el mensaje de error que muestra la URL
        error_elements = page.locator('text=/https:\/\/59gray\.github\.io/').all()
        for el in error_elements:
            text = el.text_content()
            # Extraer URL del texto
            match = re.search(r'(https://59gray\.github\.io/[^\s]+)', text)
            if match:
                return match.group(1)
    except:
        pass
    return None

def deploy_to_github():
    """Hace push del código de verificación a GitHub."""
    print("[INFO] Subiendo a GitHub...")
    os.chdir(GITHUB_PAGES_DIR)
    subprocess.run(["git", "add", "."], check=True)
    subprocess.run(["git", "commit", "-m", "Update TikTok verification"], check=False)
    subprocess.run(["git", "push", "origin", "main"], check=True)
    print("[OK] Subido a GitHub. Esperando 30s para que GitHub Pages se actualice...")
    time.sleep(30)

def automate_verification():
    chrome_exe = find_chrome()
    if not chrome_exe:
        print("[ERROR] Chrome no encontrado")
        return False
    
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            user_data_dir=str(CHROME_PROFILE_DIR),
            headless=False,
            args=["--start-maximized", "--no-first-run", "--disable-blink-features=AutomationControlled"],
            executable_path=chrome_exe,
            viewport=None,
            no_viewport=True,
        )
        page = ctx.new_page()
        
        # 1. Navegar a la app de TikTok
        print("[1/5] Navegando a TikTok Developer...")
        page.goto(TIKTOK_APP_URL, wait_until="domcontentloaded", timeout=60000)
        time.sleep(5)
        
        # 2. Actualizar URLs en el formulario
        print("[2/5] Actualizando URLs...")
        
        # Llenar Terms URL
        terms_field = page.locator('input[placeholder*="Terms"], input[name*="terms"]').first
        if terms_field.count() > 0:
            terms_field.fill("https://59gray.github.io/fg-publisher-legal/")
            time.sleep(1)
        
        # Llenar Privacy URL  
        privacy_field = page.locator('input[placeholder*="Privacy"], input[name*="privacy"]').first
        if privacy_field.count() > 0:
            privacy_field.fill("https://59gray.github.io/fg-publisher-legal/privacy.html")
            time.sleep(1)
        
        # 3. Click en Verify URL properties
        print("[3/5] Buscando botón de verificación...")
        verify_links = page.locator('text=/Verify URL properties|Verify/').all()
        
        for link in verify_links:
            try:
                link.click()
                time.sleep(3)
                
                # 4. Extraer código de verificación
                print("[4/5] Extrayendo código de verificación...")
                code = extract_verification_code(page)
                verify_url = get_verification_url(page)
                
                if code:
                    print(f"[OK] Código encontrado: {code}")
                    print(f"[INFO] URL de verificación: {verify_url}")
                    
                    # 5. Crear archivo de verificación
                    filename = f"tiktok{code}.txt"
                    filepath = GITHUB_PAGES_DIR / filename
                    filepath.write_text(f"tiktok-developers-site-verification={code}")
                    print(f"[OK] Archivo creado: {filename}")
                    
                    # Determinar subdirectorio si es necesario
                    if verify_url and "/privacy.html/" in verify_url:
                        # Necesita estar en privacy.html/
                        privacy_dir = GITHUB_PAGES_DIR / "privacy.html"
                        privacy_dir.mkdir(exist_ok=True)
                        (privacy_dir / "index.txt").write_text(f"tiktok-developers-site-verification={code}")
                        print("[OK] Archivo también creado en privacy.html/")
                    
                    # 6. Deploy a GitHub
                    deploy_to_github()
                    
                    # 7. Volver a TikTok y dar click en Verify
                    print("[5/5] Volviendo a TikTok para verificar...")
                    page.goto(TIKTOK_APP_URL, wait_until="domcontentloaded", timeout=60000)
                    time.sleep(5)
                    
                    # Intentar verificar de nuevo
                    verify_btn = page.locator('button:has-text("Verify"), button:has-text("Verificar")').first
                    if verify_btn.count() > 0:
                        verify_btn.click()
                        time.sleep(5)
                        print("[OK] Verificación completada")
                    
                    return True
                else:
                    print("[WARN] No se encontró código de verificación")
                    page.screenshot(path=str(REPO_ROOT / "scripts" / "tiktok_verification_error.png"))
                    
            except Exception as e:
                print(f"[WARN] Error en paso: {e}")
                continue
        
        print("[ERROR] No se pudo completar la verificación")
        return False

if __name__ == "__main__":
    automate_verification()
