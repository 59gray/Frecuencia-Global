#!/usr/bin/env python3
"""
Automatización completa para obtener token de Instagram desde Meta Graph API Explorer.
Requiere: usuario/contraseña de Facebook (no Instagram directamente)
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
    print("Instalando Playwright...")
    os.system("pip install playwright")
    os.system("playwright install chromium")
    from playwright.sync_api import sync_playwright

REPO_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = REPO_ROOT / "scripts" / "tmp_ig_token"

APP_ID = "1227523599160977"

def ensure_dir(path):
    path.mkdir(parents=True, exist_ok=True)
    return path

def get_instagram_token(fb_email, fb_password, headed=True):
    """
    Automatiza la obtención del token de Instagram desde Meta for Developers.
    Requiere credenciales de Facebook (no Instagram).
    """
    output_dir = ensure_dir(OUTPUT_DIR)
    profile_dir = ensure_dir(output_dir / "chrome-meta-profile")
    
    print("="*70)
    print("OBTENCIÓN AUTOMÁTICA DE TOKEN DE INSTAGRAM")
    print("="*70)
    print(f"📧 Facebook: {fb_email}")
    print(f"🔧 Modo: {'Con ventana' if headed else 'Headless'}")
    print(f"🎯 App: Frecuencia Global Publisher ({APP_ID})")
    print()
    
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            user_data_dir=str(profile_dir),
            channel="chrome",
            headless=not headed,
            viewport={"width": 1440, "height": 1024},
            args=["--disable-blink-features=AutomationControlled"],
        )
        
        try:
            page = browser.pages[0] if browser.pages else browser.new_page()
            page.set_default_timeout(30000)
            
            # 1. Ir al Graph API Explorer
            print("🌐 Paso 1/5: Abriendo Graph API Explorer...")
            page.goto("https://developers.facebook.com/tools/explorer/", wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            
            # Verificar si ya está logueado
            if "login" in page.url.lower():
                print("🔐 Paso 2/5: Login en Facebook...")
                
                # Llenar credenciales
                email_input = page.locator('input[name="email"], input#email, input[type="text"]').first
                pass_input = page.locator('input[name="pass"], input#pass, input[type="password"]').first
                
                email_input.fill(fb_email)
                pass_input.fill(fb_password)
                
                # Click login
                login_btn = page.locator('button[name="login"], button[type="submit"]').first
                login_btn.click()
                
                page.wait_for_timeout(5000)
                print("   ✅ Login completado")
            else:
                print("   ✅ Ya está autenticado")
            
            # 2. Seleccionar app
            print("📱 Paso 3/5: Seleccionando app...")
            try:
                # Buscar selector de app
                app_selector = page.locator('select[data-testid="app-selector"], select[name="app"]').first
                if app_selector.is_visible():
                    app_selector.select_option(value=APP_ID)
                    page.wait_for_timeout(2000)
                    print("   ✅ App seleccionada")
            except:
                print("   ⚠️ No se pudo seleccionar app automáticamente")
            
            # 3. Agregar permisos
            print("🔑 Paso 4/5: Configurando permisos...")
            try:
                # Click en "Add Permissions"
                add_perm = page.locator('text="Add Permissions"').first
                if add_perm.is_visible():
                    add_perm.click()
                    page.wait_for_timeout(1000)
                    
                    # Buscar y seleccionar permisos de Instagram
                    perm_search = page.locator('input[placeholder*="Search"]').first
                    if perm_search.is_visible():
                        perm_search.fill("instagram")
                        page.wait_for_timeout(1000)
                        
                        # Seleccionar permisos
                        for perm in ["instagram_basic", "instagram_content_publish"]:
                            try:
                                checkbox = page.locator(f'text="{perm}"').first
                                if checkbox.is_visible():
                                    checkbox.click()
                                    page.wait_for_timeout(500)
                            except:
                                pass
                        
                        # Click en Confirm
                        confirm = page.locator('text="Confirm"').first
                        if confirm.is_visible():
                            confirm.click()
                            page.wait_for_timeout(2000)
            except Exception as e:
                print(f"   ⚠️ Permisos: {e}")
            
            # 4. Generar token
            print("⚡ Paso 5/5: Generando token...")
            try:
                generate_btn = page.locator('text="Generate Access Token"').first
                if generate_btn.is_visible():
                    generate_btn.click()
                    page.wait_for_timeout(5000)
                    print("   ✅ Token generado")
            except:
                print("   ⚠️ Botón no encontrado, token puede estar listo")
            
            # 5. Extraer token
            print("\n📋 EXTRAYENDO TOKEN...")
            
            # El token aparece en un campo de texto o en la URL
            token = None
            
            # Intentar extraer de campo de token
            try:
                token_input = page.locator('input[value^="EAA"], textarea:has-text("EAA")').first
                if token_input.is_visible():
                    token = token_input.input_value()
            except:
                pass
            
            # Intentar extraer de URL
            if not token:
                current_url = page.url
                match = re.search(r'access_token=([^&]+)', current_url)
                if match:
                    token = match.group(1)
            
            # Intentar extraer del page content
            if not token:
                page_content = page.content()
                match = re.search(r'EAA[A-Za-z0-9_-]{100,500}', page_content)
                if match:
                    token = match.group(0)
            
            if token:
                print(f"\n{'='*70}")
                print("🎉 ¡TOKEN OBTENIDO!")
                print(f"{'='*70}")
                print(f"\n🔑 Token: {token[:50]}...")
                print(f"   Longitud: {len(token)} caracteres")
                
                # Guardar en archivo
                token_file = output_dir / "instagram_token.txt"
                token_file.write_text(token)
                print(f"\n💾 Guardado en: {token_file}")
                
                # También guardar en .env
                env_file = REPO_ROOT / "08_n8n" / ".env"
                if env_file.exists():
                    content = env_file.read_text()
                    if 'IG_ACCESS_TOKEN=' in content:
                        content = re.sub(r'IG_ACCESS_TOKEN=.*\n?', f'IG_ACCESS_TOKEN={token}\n', content)
                    else:
                        content += f"\nIG_ACCESS_TOKEN={token}\nIG_USER_ID=24263988463298387\n"
                    env_file.write_text(content)
                    print(f"💾 Actualizado: {env_file}")
                
                return token
            else:
                print("\n❌ No se pudo extraer el token automáticamente")
                # Screenshot para debugging
                screenshot = output_dir / "token_extraction.png"
                page.screenshot(path=str(screenshot), full_page=True)
                print(f"📸 Screenshot guardado: {screenshot}")
                return None
                
        except Exception as e:
            print(f"\n❌ Error: {e}")
            screenshot = output_dir / "error.png"
            try:
                page.screenshot(path=str(screenshot), full_page=True)
                print(f"📸 Screenshot: {screenshot}")
            except:
                pass
            return None
        finally:
            browser.close()

def test_token(token):
    """Probar token con Instagram Graph API."""
    print(f"\n{'='*70}")
    print("VERIFICANDO TOKEN...")
    print(f"{'='*70}")
    
    import requests
    url = f"https://graph.instagram.com/v22.0/me?fields=id,username&access_token={token}"
    
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Token válido!")
            print(f"   Cuenta: @{data.get('username')}")
            print(f"   ID: {data.get('id')}")
            return True
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Obtener token de Instagram automáticamente")
    parser.add_argument("--email", help="Email de Facebook")
    parser.add_argument("--pass", dest="password", help="Contraseña de Facebook")
    parser.add_argument("--headed", action="store_true", default=True, help="Mostrar navegador")
    parser.add_argument("--test", action="store_true", help="Probar token después de obtenerlo")
    args = parser.parse_args()
    
    # Obtener credenciales
    fb_email = args.email or os.environ.get("FB_EMAIL") or os.environ.get("FACEBOOK_EMAIL")
    fb_password = args.password or os.environ.get("FB_PASS") or os.environ.get("FACEBOOK_PASS")
    
    if not fb_email or not fb_password:
        print("❌ Se requieren credenciales de Facebook")
        print("\nOpciones:")
        print("  1. Usa --email y --pass")
        print("  2. Define FB_EMAIL y FB_PASS en variables de entorno")
        print("\nNota: Se requiere cuenta de Facebook (no Instagram directamente)")
        print("      que tenga acceso a la app 'Frecuencia Global Publisher'")
        sys.exit(1)
    
    # Obtener token
    token = get_instagram_token(fb_email, fb_password, args.headed)
    
    if token and args.test:
        test_token(token)
        
        # Ofrecer ejecutar prueba de publicación
        print(f"\n{'='*70}")
        print("¿EJECUTAR PRUEBA DE PUBLICACIÓN?")
        print(f"{'='*70}")
        response = input("¿Deseas publicar una prueba en Instagram ahora? (s/n): ").lower()
        if response in ['s', 'si', 'yes', 'y']:
            subprocess.run([
                sys.executable, 
                str(REPO_ROOT / "scripts" / "ig_api_publish.py"),
                "--pieza", "P1_001",
                "--token", token
            ])
    
    sys.exit(0 if token else 1)

if __name__ == "__main__":
    import subprocess
    main()
