#!/usr/bin/env python3
"""
Extrae token de Instagram automáticamente desde Meta for Developers.
Usa Chrome real del usuario donde ya está logueado en Facebook.

Uso:
    python scripts/get_ig_token_from_chrome.py
    python scripts/get_ig_token_from_chrome.py --save  # Guarda en .env
    python scripts/get_ig_token_from_chrome.py --test    # Verifica y prueba
"""

import os
import sys
import re
import time
import argparse
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("❌ Playwright no instalado")
    sys.exit(1)

REPO_ROOT = Path(__file__).parent.parent
ENV_FILE = REPO_ROOT / "08_n8n" / ".env"

# Chrome real del usuario
LOCALAPPDATA = Path(os.environ.get("LOCALAPPDATA", str(Path.home() / "AppData" / "Local")))
CHROME_USER_DATA = LOCALAPPDATA / "Google" / "Chrome" / "User Data"

def find_chrome():
    """Encuentra Chrome instalado."""
    candidates = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return None

def extract_token_from_page(page):
    """Extrae el token EAA de la página."""
    # Intentar múltiples métodos
    
    # Método 1: Buscar en inputs
    try:
        inputs = page.locator('input[value^="EAA"]').all()
        for inp in inputs:
            val = inp.input_value()
            if val and val.startswith("EAA"):
                return val
    except:
        pass
    
    # Método 2: Buscar en textareas
    try:
        textareas = page.locator('textarea:has-text("EAA")').all()
        for ta in textareas:
            text = ta.input_value()
            if "EAA" in text:
                match = re.search(r'EAA[A-Za-z0-9_-]+', text)
                if match:
                    return match.group(0)
    except:
        pass
    
    # Método 3: Buscar en contenido de página
    try:
        content = page.content()
        match = re.search(r'EAA[A-Za-z0-9_-]{100,500}', content)
        if match:
            return match.group(0)
    except:
        pass
    
    return None

def get_instagram_token(save=False, test=False):
    """Obtiene token de Instagram desde Meta for Developers."""
    
    print("="*70)
    print("EXTRACCIÓN DE TOKEN DE INSTAGRAM")
    print("="*70)
    print("\nEste script usará Chrome con tu sesión de Facebook ya iniciada.")
    print("Se navegará a Meta for Developers para generar el token.\n")
    
    chrome_exe = find_chrome()
    if not chrome_exe:
        print("❌ Chrome no encontrado")
        return None
    
    print(f"✅ Chrome: {chrome_exe}")
    print(f"✅ Perfil: {CHROME_USER_DATA}")
    print("\n🔍 Abriendo Chrome y navegando a Meta for Developers...")
    
    token = None
    
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            user_data_dir=str(CHROME_USER_DATA),
            channel="chrome",
            executable_path=chrome_exe,
            headless=False,  # Visible para que el usuario vea el proceso
            viewport={"width": 1440, "height": 1024},
            args=["--disable-blink-features=AutomationControlled"],
        )
        
        try:
            page = browser.pages[0] if browser.pages else browser.new_page()
            
            # Ir al Graph API Explorer
            print("🌐 Navegando a Graph API Explorer...")
            page.goto("https://developers.facebook.com/tools/explorer/", wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            
            # Verificar si estamos logueados
            if "login" in page.url.lower() or "auth" in page.url.lower():
                print("⚠️ Se detectó página de login. Parece que no estás logueado en Facebook.")
                print("   Por favor, inicia sesión en Facebook primero.")
                browser.close()
                return None
            
            print("✅ Sesión de Facebook detectada")
            
            # Seleccionar app "Frecuencia Global Publisher"
            print("📱 Seleccionando app 'Frecuencia Global Publisher'...")
            try:
                # Buscar y seleccionar la app
                app_selectors = [
                    'select[data-testid="app-selector"]',
                    'select[name="app"]',
                    '[data-testid="app-selector"]',
                ]
                
                for sel in app_selectors:
                    try:
                        dropdown = page.locator(sel).first
                        if dropdown.is_visible(timeout=3000):
                            # Buscar opción por texto o value
                            options = dropdown.locator("option").all()
                            for opt in options:
                                text = opt.text_content()
                                val = opt.get_attribute("value")
                                if "frecuencia" in text.lower() or "1227523599160977" in str(val):
                                    dropdown.select_option(value=val)
                                    print(f"   ✅ App seleccionada: {text}")
                                    page.wait_for_timeout(1000)
                                    break
                            break
                    except:
                        continue
            except Exception as e:
                print(f"   ⚠️ No se pudo seleccionar automáticamente: {e}")
            
            # Agregar permisos de Instagram
            print("🔑 Configurando permisos...")
            try:
                # Buscar botón de agregar permisos
                add_btn = page.locator('text="Add Permissions", text="Agregar permisos"').first
                if add_btn.is_visible(timeout=3000):
                    add_btn.click()
                    page.wait_for_timeout(1000)
                    
                    # Buscar y seleccionar permisos de Instagram
                    perms = ["instagram_basic", "instagram_content_publish"]
                    for perm in perms:
                        try:
                            perm_checkbox = page.locator(f'text="{perm}"').first
                            if perm_checkbox.is_visible(timeout=2000):
                                perm_checkbox.click()
                                page.wait_for_timeout(500)
                                print(f"   ✅ {perm} seleccionado")
                        except:
                            pass
                    
                    # Confirmar
                    confirm = page.locator('text="Confirm", text="Confirmar"').first
                    if confirm.is_visible(timeout=2000):
                        confirm.click()
                        page.wait_for_timeout(2000)
            except Exception as e:
                print(f"   ⚠️ Permisos: {e}")
            
            # Generar token
            print("⚡ Generando token...")
            try:
                gen_btn = page.locator('text="Generate Access Token", text="Generar token"').first
                if gen_btn.is_visible(timeout=5000):
                    gen_btn.click()
                    print("   ✅ Token generado")
                    page.wait_for_timeout(3000)
            except Exception as e:
                print(f"   ⚠️ Botón generar no encontrado: {e}")
            
            # Extraer token
            print("\n🔍 Extrayendo token...")
            token = extract_token_from_page(page)
            
            if token:
                print(f"\n{'='*70}")
                print("🎉 ¡TOKEN OBTENIDO!")
                print(f"{'='*70}")
                print(f"\n🔑 Token: {token[:50]}...")
                print(f"   Longitud: {len(token)} caracteres")
                
                if save:
                    print(f"\n💾 Guardando en {ENV_FILE}...")
                    if ENV_FILE.exists():
                        content = ENV_FILE.read_text(encoding='utf-8')
                        
                        if 'IG_ACCESS_TOKEN=' in content:
                            content = re.sub(r'IG_ACCESS_TOKEN=.*\n?', f'IG_ACCESS_TOKEN={token}\n', content)
                        else:
                            content += f"\n# --- Instagram API ---\nIG_ACCESS_TOKEN={token}\nIG_USER_ID=24263988463298387\n"
                        
                        ENV_FILE.write_text(content, encoding='utf-8')
                        print("   ✅ Token guardado en .env")
                
                # Verificar token
                if test:
                    print(f"\n🔍 Verificando token...")
                    import requests
                    url = f"https://graph.instagram.com/v22.0/me?fields=id,username&access_token={token}"
                    try:
                        r = requests.get(url, timeout=10)
                        if r.status_code == 200:
                            data = r.json()
                            print(f"   ✅ Token válido!")
                            print(f"   📊 Cuenta: @{data.get('username')} (ID: {data.get('id')})")
                        else:
                            print(f"   ⚠️ Token inválido: {r.text[:200]}")
                    except Exception as e:
                        print(f"   ⚠️ Error verificando: {e}")
                
            else:
                print("\n❌ No se pudo extraer el token automáticamente.")
                print("   Posibles causas:")
                print("   - El token aún no se generó")
                print("   - La UI de Meta cambió")
                print("   - Necesitas loguearte primero")
                
                # Screenshot para debugging
                debug_dir = REPO_ROOT / "scripts" / "tmp_token_debug"
                debug_dir.mkdir(exist_ok=True)
                screenshot = debug_dir / "token_extraction.png"
                page.screenshot(path=str(screenshot), full_page=True)
                print(f"\n📸 Screenshot guardado: {screenshot}")
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()
        finally:
            browser.close()
    
    return token

def main():
    parser = argparse.ArgumentParser(description="Extraer token de Instagram")
    parser.add_argument("--save", action="store_true", help="Guardar token en .env")
    parser.add_argument("--test", action="store_true", help="Verificar token después")
    args = parser.parse_args()
    
    token = get_instagram_token(save=args.save, test=args.test)
    
    if token:
        print(f"\n{'='*70}")
        print("TOKEN COMPLETO (para copiar):")
        print(f"{'='*70}")
        print(token)
        print(f"\n{'='*70}")
        
        # También guardar en archivo temporal
        token_file = REPO_ROOT / "scripts" / "instagram_token.txt"
        token_file.write_text(token)
        print(f"💾 Token guardado en: {token_file}")
        
        if args.save:
            print("\n✅ Token guardado en 08_n8n/.env")
            print("\nPuedes probar la publicación con:")
            print("   python scripts/ig_api_publish.py --pieza P1_001 --dry-run")
        
        sys.exit(0)
    else:
        print("\n❌ No se pudo obtener el token")
        sys.exit(1)

if __name__ == "__main__":
    main()
