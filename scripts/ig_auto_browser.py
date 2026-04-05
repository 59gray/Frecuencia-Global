#!/usr/bin/env python3
"""
Automatización completa de Instagram usando browser automation.
No requiere token API - usa login directo con Playwright.
"""

import os
import sys
import time
import argparse
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
except ImportError:
    print("❌ Playwright no instalado. Instalando...")
    os.system("pip install playwright")
    os.system("playwright install chromium")
    from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

REPO_ROOT = Path(__file__).parent.parent
ASSETS_DIR = REPO_ROOT / "06_Assets"
OUTPUT_DIR = REPO_ROOT / "scripts" / "tmp_ig_test"

def ensure_dir(path):
    path.mkdir(parents=True, exist_ok=True)
    return path

def find_test_image():
    """Buscar imagen de prueba."""
    # Buscar en P1_001
    test_dirs = [
        ASSETS_DIR / "P1_001",
        ASSETS_DIR / "v2_X_Reels",
        ASSETS_DIR / "base" / "assets",
    ]
    
    for dir_path in test_dirs:
        if not dir_path.exists():
            continue
        for img in dir_path.glob("*.png"):
            if "IG" in img.name.upper() or "instagram" in img.name.lower():
                return img
        # Si no hay específica de IG, buscar cualquier PNG
        for img in dir_path.glob("*.png"):
            return img
    
    return None

def post_to_instagram(username, password, image_path, caption, headed=False):
    """Publicar en Instagram usando browser automation."""
    
    print("="*60)
    print("AUTOMATIZACIÓN DE INSTAGRAM - BROWSER METHOD")
    print("="*60)
    
    output_dir = ensure_dir(OUTPUT_DIR)
    profile_dir = ensure_dir(output_dir / "chrome-profile")
    
    print(f"📷 Imagen: {image_path}")
    print(f"👤 Usuario: {username}")
    print(f"📝 Caption: {caption[:50]}...")
    print(f"🔧 Modo: {'Con ventana' if headed else 'Headless'}")
    print()
    
    with sync_playwright() as p:
        # Lanzar Chrome con perfil persistente
        browser = p.chromium.launch_persistent_context(
            user_data_dir=str(profile_dir),
            channel="chrome",
            headless=not headed,
            viewport={"width": 1440, "height": 1024},
            args=["--disable-blink-features=AutomationControlled"],
        )
        
        try:
            page = browser.pages[0] if browser.pages else browser.new_page()
            page.set_default_timeout(20000)
            page.set_default_navigation_timeout(30000)
            
            # 1. Login
            print("🔐 Paso 1/6: Login en Instagram...")
            page.goto("https://www.instagram.com/accounts/login/", wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            
            # Encontrar campos de login
            user_input = page.locator('input[name="username"]').first
            pass_input = page.locator('input[name="password"]').first
            
            if not user_input.is_visible():
                # Intentar selectores alternativos
                user_input = page.locator('input[type="text"]').first
                pass_input = page.locator('input[type="password"]').first
            
            user_input.fill(username)
            pass_input.fill(password)
            
            # Click en login o presionar Enter
            try:
                submit = page.locator('button[type="submit"]').first
                submit.click()
            except:
                pass_input.press("Enter")
            
            page.wait_for_timeout(5000)
            print("   ✅ Login completado")
            
            # 2. Cerrar popups
            print("🔕 Paso 2/6: Cerrando popups...")
            for _ in range(3):
                try:
                    not_now = page.locator('text="Not now"').first
                    if not_now.is_visible():
                        not_now.click()
                        page.wait_for_timeout(1000)
                except:
                    pass
                try:
                    ahora_no = page.locator('text="Ahora no"').first
                    if ahora_no.is_visible():
                        ahora_no.click()
                        page.wait_for_timeout(1000)
                except:
                    pass
            print("   ✅ Popups cerrados")
            
            # 3. Ir a crear post
            print("📝 Paso 3/6: Creando nuevo post...")
            page.goto("https://www.instagram.com/create/select/", wait_until="domcontentloaded")
            page.wait_for_timeout(4000)
            
            # 4. Subir imagen
            print("📤 Paso 4/6: Subiendo imagen...")
            file_input = page.locator('input[type="file"]').first
            file_input.set_input_files(str(image_path))
            page.wait_for_timeout(5000)
            print("   ✅ Imagen subida")
            
            # 5. Avanzar y agregar caption
            print("➡️ Paso 5/6: Configurando caption...")
            for i in range(2):
                try:
                    next_btn = page.locator('text="Next"').first
                    if next_btn.is_visible():
                        next_btn.click()
                        page.wait_for_timeout(3000)
                except:
                    try:
                        siguiente = page.locator('text="Siguiente"').first
                        if siguiente.is_visible():
                            siguiente.click()
                            page.wait_for_timeout(3000)
                    except:
                        pass
            
            # Agregar caption
            try:
                caption_box = page.locator('textarea[aria-label], div[contenteditable="true"]').first
                caption_box.click()
                caption_box.fill(caption)
                page.wait_for_timeout(2000)
                print("   ✅ Caption agregado")
            except Exception as e:
                print(f"   ⚠️ No se pudo agregar caption: {e}")
            
            # 6. Compartir
            print("🚀 Paso 6/6: Publicando...")
            try:
                share_btn = page.locator('text="Share"').first
                share_btn.click()
            except:
                try:
                    compartir = page.locator('text="Compartir"').first
                    compartir.click()
                except:
                    pass
            
            page.wait_for_timeout(8000)
            
            # Verificar resultado
            page_text = page.locator("body").inner_text()
            if "shared" in page_text.lower() or "compart" in page_text.lower() or "/p/" in page.url:
                print("\n" + "="*60)
                print("🎉 ¡PUBLICACIÓN EXITOSA!")
                print("="*60)
                print(f"📍 URL: {page.url}")
                return True
            else:
                print("\n⚠️ No se pudo confirmar la publicación")
                print(f"   URL actual: {page.url}")
                return False
                
        except Exception as e:
            print(f"\n❌ Error: {e}")
            # Screenshot de error
            try:
                error_screenshot = output_dir / "error_screenshot.png"
                page.screenshot(path=str(error_screenshot))
                print(f"📸 Screenshot guardado: {error_screenshot}")
            except:
                pass
            return False
        finally:
            browser.close()

def main():
    parser = argparse.ArgumentParser(description="Publicar en Instagram via browser automation")
    parser.add_argument("--user", help="Usuario de Instagram")
    parser.add_argument("--pass", dest="password", help="Contraseña de Instagram")
    parser.add_argument("--image", help="Ruta de imagen")
    parser.add_argument("--caption", default="🧪 Prueba de publicación automática - Frecuencia Global", help="Caption del post")
    parser.add_argument("--headed", action="store_true", help="Mostrar navegador")
    args = parser.parse_args()
    
    # Obtener credenciales
    username = args.user or os.environ.get("FG_IG_USER") or os.environ.get("INSTAGRAM_USER")
    password = args.password or os.environ.get("FG_IG_PASS") or os.environ.get("INSTAGRAM_PASS")
    
    if not username or not password:
        print("❌ Se requiere usuario y contraseña de Instagram")
        print("   Opciones:")
        print("   1. Usa --user y --pass")
        print("   2. Define FG_IG_USER y FG_IG_PASS en variables de entorno")
        print("\n💡 El handle de Instagram es: globalfrequency.es")
        sys.exit(1)
    
    # Buscar imagen
    image_path = args.image
    if not image_path:
        img = find_test_image()
        if img:
            image_path = str(img)
        else:
            print("❌ No se encontró imagen de prueba")
            sys.exit(1)
    
    # Ejecutar
    success = post_to_instagram(username, password, image_path, args.caption, args.headed)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
