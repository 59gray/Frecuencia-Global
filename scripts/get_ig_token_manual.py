#!/usr/bin/env python3
"""
Script robusto para obtener token de Instagram desde Meta for Developers.
Versión simplificada que usa Chrome real del usuario.
"""

import os
import sys
import re
import time
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("Playwright no instalado")
    sys.exit(1)

REPO_ROOT = Path(__file__).parent.parent
ENV_FILE = REPO_ROOT / "08_n8n" / ".env"

LOCALAPPDATA = Path(os.environ.get("LOCALAPPDATA", str(Path.home() / "AppData" / "Local")))
CHROME_USER_DATA = LOCALAPPDATA / "Google" / "Chrome" / "User Data"

def main():
    print("="*70)
    print("OBTENCIÓN DE TOKEN DE INSTAGRAM - META FOR DEVELOPERS")
    print("="*70)
    
    # Encontrar Chrome
    chrome_exe = None
    for path in [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]:
        if os.path.exists(path):
            chrome_exe = path
            break
    
    if not chrome_exe:
        print("❌ Chrome no encontrado")
        return
    
    print(f"✅ Usando: {chrome_exe}")
    print(f"✅ Perfil: {CHROME_USER_DATA}")
    print("\n🌐 Abriendo Meta for Developers...")
    print("⏳ Espera unos segundos...\n")
    
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            user_data_dir=str(CHROME_USER_DATA),
            channel="chrome",
            executable_path=chrome_exe,
            headless=False,
            viewport={"width": 1440, "height": 1024},
            args=["--disable-blink-features=AutomationControlled"],
        )
        
        page = browser.pages[0] if browser.pages else browser.new_page()
        
        # Navegar directo al Graph API Explorer
        print("🔗 Navegando a Graph API Explorer...")
        page.goto("https://developers.facebook.com/tools/explorer/", wait_until="domcontentloaded")
        
        print("\n" + "="*70)
        print("INSTRUCCIONES:")
        print("="*70)
        print("1. Si te pide login, inicia sesión con Facebook")
        print("2. En 'Application', selecciona: Frecuencia Global Publisher")
        print("3. Click en 'Add Permissions'")
        print("4. Selecciona: instagram_basic, instagram_content_publish")
        print("5. Click en 'Generate Access Token'")
        print("6. CUANDO TENGAS EL TOKEN, presiona Ctrl+C aquí")
        print("="*70)
        
        print("\n⏳ Esperando... (presiona Ctrl+C cuando tengas el token)")
        
        # Esperar interrupción manual
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n\n🔍 Extrayendo token de la página...")
        
        # Intentar extraer token
        token = None
        
        # Buscar en inputs
        try:
            inputs = page.locator('input[value^="EAA"]').all()
            for inp in inputs:
                val = inp.input_value()
                if val and val.startswith("EAA"):
                    token = val
                    break
        except:
            pass
        
        # Buscar en página
        if not token:
            try:
                content = page.content()
                match = re.search(r'EAA[A-Za-z0-9_-]{100,500}', content)
                if match:
                    token = match.group(0)
            except:
                pass
        
        browser.close()
        
        if token:
            print(f"\n{'='*70}")
            print("✅ TOKEN ENCONTRADO!")
            print(f"{'='*70}")
            print(f"\n{token}\n")
            
            # Guardar
            token_file = REPO_ROOT / "scripts" / "instagram_token.txt"
            token_file.write_text(token)
            print(f"💾 Guardado en: {token_file}")
            
            # Guardar en .env
            if ENV_FILE.exists():
                content = ENV_FILE.read_text()
                if 'IG_ACCESS_TOKEN=' in content:
                    content = re.sub(r'IG_ACCESS_TOKEN=.*\n?', f'IG_ACCESS_TOKEN={token}\n', content)
                else:
                    content += f"\nIG_ACCESS_TOKEN={token}\nIG_USER_ID=24263988463298387\n"
                ENV_FILE.write_text(content)
                print(f"💾 Guardado en: {ENV_FILE}")
            
            print("\n" + "="*70)
            print("Prueba la publicación con:")
            print("python scripts/ig_api_publish.py --pieza P1_001 --dry-run")
            print("="*70)
            
        else:
            print("\n❌ No se encontró token automáticamente.")
            print("Pega manualmente el token que copiaste de la página.")

if __name__ == "__main__":
    main()
