#!/usr/bin/env python3
"""
Publicar en Instagram usando el Chrome del usuario (con sesiones ya iniciadas).

Este script usa el perfil de Chrome real del usuario donde ya está logueado,
eliminando la necesidad de manejar credenciales o 2FA.

Uso:
    python scripts/ig_publish_chrome_real.py --pieza P1_001
    python scripts/ig_publish_chrome_real.py --image ruta/imagen.png --caption "texto"
"""

import os
import sys
import time
import re
import argparse
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright, TimeoutError as PWTimeoutError
except ImportError:
    print("❌ Playwright no instalado")
    sys.exit(1)

REPO_ROOT = Path(__file__).parent.parent
PRODUCCION_DIR = REPO_ROOT / "04_Produccion"
ASSETS_DIR = REPO_ROOT / "06_Assets"
DEBUG_DIR = REPO_ROOT / "scripts" / "tmp_ig_debug"

# Usar el Chrome real del usuario
LOCALAPPDATA = Path(os.environ.get("LOCALAPPDATA", str(Path.home() / "AppData" / "Local")))
CHROME_EXE = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
CHROME_USER_DATA = LOCALAPPDATA / "Google" / "Chrome" / "User Data"

def find_chrome():
    """Encuentra Chrome instalado."""
    candidates = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.environ.get("FG_CHROME_EXE"),
    ]
    for c in candidates:
        if c and os.path.exists(c):
            return c
    return None

def extract_ig_caption(pieza):
    """Extrae caption de PublishReady."""
    filepath = PRODUCCION_DIR / f"{pieza}_PublishReady.md"
    if not filepath.exists():
        return None
    content = filepath.read_text(encoding="utf-8")
    pattern = r"## Instagram\s*\n([\s\S]*?)\n\s*---"
    match = re.search(pattern, content)
    if match:
        text = match.group(1).strip()
        text = re.sub(r"^\*\*Caption:\*\*\s*\n?", "", text).strip()
        return text
    return None

def find_ig_image(pieza):
    """Busca imagen de Instagram para la pieza."""
    asset_dir = ASSETS_DIR / pieza
    if not asset_dir.exists():
        return None
    for f in sorted(asset_dir.iterdir()):
        if "IG" in f.name.upper() and f.suffix.lower() in (".png", ".jpg", ".jpeg"):
            return f
    for f in sorted(asset_dir.iterdir()):
        if f.suffix.lower() in (".png", ".jpg", ".jpeg"):
            return f
    return None

def publish_post(page, image_path, caption):
    """Publica en Instagram usando Chrome real."""
    DEBUG_DIR.mkdir(parents=True, exist_ok=True)
    
    print("[INFO] Navegando a Instagram...")
    page.goto("https://www.instagram.com/", wait_until="domcontentloaded")
    page.wait_for_timeout(3000)
    
    # Verificar si estamos logueados
    try:
        # Buscar indicadores de sesión
        nav = page.locator("nav, [role='navigation']").first
        if nav.is_visible(timeout=5000):
            print("[OK] Sesión de Instagram detectada")
        else:
            print("[WARN] No se detectó sesión. Continuando de todas formas...")
    except:
        pass
    
    print("[INFO] Buscando botón crear...")
    create_btn = page.locator('svg[aria-label="New post"]').first
    if create_btn.is_visible(timeout=10000):
        create_btn.click()
        print("[OK] Click en crear post")
    else:
        print("[WARN] No se encontró botón New post, intentando alternativa...")
        page.goto("https://www.instagram.com/create/select/")
    
    page.wait_for_timeout(2000)
    
    # Seleccionar Post (no Story ni Reel)
    try:
        post_option = page.locator('text="Post"').first
        if post_option.is_visible(timeout=5000):
            post_option.click()
            print("[OK] Seleccionado 'Post'")
            page.wait_for_timeout(1000)
    except:
        pass
    
    # Subir imagen
    print(f"[INFO] Subiendo imagen: {image_path.name}")
    file_input = page.locator('input[type="file"]').first
    file_input.set_input_files(str(image_path))
    print("[OK] Imagen subida")
    page.wait_for_timeout(3000)
    
    # Next (2 veces para llegar a caption)
    for i in range(2):
        try:
            next_btn = page.locator('text="Next"').first
            if next_btn.is_visible(timeout=5000):
                next_btn.click()
                print(f"[OK] Click Next {i+1}/2")
                page.wait_for_timeout(2000)
        except:
            try:
                siguiente = page.locator('text="Siguiente"').first
                if siguiente.is_visible(timeout=3000):
                    siguiente.click()
                    page.wait_for_timeout(2000)
            except:
                pass
    
    # Agregar caption
    print("[INFO] Agregando caption...")
    try:
        caption_box = page.locator('textarea[aria-label], div[contenteditable="true"]').first
        caption_box.click()
        caption_box.fill(caption)
        print("[OK] Caption agregado")
        page.wait_for_timeout(1000)
    except Exception as e:
        print(f"[WARN] No se pudo agregar caption: {e}")
    
    # Compartir
    print("[INFO] Publicando...")
    try:
        share_btn = page.locator('text="Share"').first
        share_btn.click()
        print("[OK] Click en Share")
    except:
        try:
            compartir = page.locator('text="Compartir"').first
            compartir.click()
            print("[OK] Click en Compartir")
        except:
            pass
    
    page.wait_for_timeout(5000)
    
    # Verificar resultado
    page_text = page.locator("body").inner_text()
    if "shared" in page_text.lower() or "compart" in page_text.lower():
        print("\n🎉 ¡Publicación exitosa!")
        return True
    
    if "/p/" in page.url:
        print(f"\n🎉 ¡Publicación exitosa! URL: {page.url}")
        return True
    
    print(f"\n⚠️ No se pudo confirmar publicación. URL: {page.url}")
    return False

def main():
    parser = argparse.ArgumentParser(description="Publicar en Instagram usando Chrome real")
    parser.add_argument("--pieza", help="Nombre de pieza (ej: P1_001)")
    parser.add_argument("--image", help="Ruta de imagen")
    parser.add_argument("--caption", help="Caption")
    parser.add_argument("--headed", action="store_true", default=True, help="Mostrar Chrome")
    args = parser.parse_args()
    
    # Encontrar imagen y caption
    image_path = None
    caption = None
    
    if args.pieza:
        image_path = find_ig_image(args.pieza)
        caption = extract_ig_caption(args.pieza)
    
    if args.image:
        image_path = Path(args.image)
    if args.caption:
        caption = args.caption
    
    if not image_path or not image_path.exists():
        print(f"[ERROR] Imagen no encontrada: {image_path}")
        sys.exit(1)
    
    if not caption:
        print("[ERROR] Caption no proporcionado")
        sys.exit(1)
    
    print(f"[OK] Imagen: {image_path}")
    print(f"[OK] Caption: {len(caption)} chars\n")
    
    # Usar Chrome real del usuario
    chrome_exe = find_chrome()
    if not chrome_exe:
        print("[ERROR] Chrome no encontrado")
        sys.exit(1)
    
    print(f"[INFO] Usando Chrome: {chrome_exe}")
    print(f"[INFO] Perfil: {CHROME_USER_DATA}")
    print("[INFO] Abriendo Chrome con tu perfil real...\n")
    
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            user_data_dir=str(CHROME_USER_DATA),
            channel="chrome",
            executable_path=chrome_exe,
            headless=False,  # Siempre visible para usar sesiones
            viewport={"width": 1440, "height": 1024},
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-first-run",
            ],
        )
        
        try:
            page = browser.pages[0] if browser.pages else browser.new_page()
            success = publish_post(page, image_path, caption)
            
            if success:
                print("\n✅ Proceso completado")
            else:
                print("\n❌ No se pudo confirmar publicación")
                
        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()
        finally:
            browser.close()

if __name__ == "__main__":
    main()
