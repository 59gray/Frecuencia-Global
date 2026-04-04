"""Automatiza el llenado del formulario de TikTok Developer.

Uso:
    python scripts/tiktok_fill_form.py
"""

import os
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO_ROOT = Path(__file__).parent.parent
CHROME_PROFILE_DIR = REPO_ROOT / ".chrome-tk-stable"
DEBUG_DIR = REPO_ROOT / "scripts" / "tmp_tk_form"
DEBUG_DIR.mkdir(exist_ok=True)

TIKTOK_APP_URL = "https://developers.tiktok.com/app/7624985614836172818/pending/"


def find_chrome():
    for c in [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]:
        if os.path.exists(c):
            return c
    return None


def fill_form(page):
    print("[INFO] Navegando a la app de TikTok...")
    page.goto(TIKTOK_APP_URL, wait_until="domcontentloaded", timeout=60000)
    time.sleep(5)
    page.screenshot(path=str(DEBUG_DIR / "01_app_page.png"))
    
    # Fill Category
    print("[INFO] Seleccionando Category...")
    try:
        category_dropdown = page.locator('select[name="category"], select#category, [data-testid="category-select"]').first
        if category_dropdown.count() > 0:
            category_dropdown.select_option("News")
            time.sleep(1)
    except Exception as e:
        print(f"[WARN] No se pudo seleccionar category: {e}")
    
    # Fill Description
    print("[INFO] Llenando Description...")
    description_text = "Automated content publishing tool for Frecuencia Global, an international analysis media brand covering geopolitics, culture, and global information."
    try:
        desc_field = page.locator('textarea[name="description"], textarea#description, [placeholder*="Describe"]').first
        if desc_field.count() > 0:
            desc_field.fill(description_text)
            time.sleep(1)
            print("[OK] Description llenado")
    except Exception as e:
        print(f"[WARN] No se pudo llenar description: {e}")
    
    # Fill Terms URL
    print("[INFO] Llenando Terms URL...")
    try:
        terms_field = page.locator('input[name*="terms"], input[id*="terms"], input[placeholder*="Terms"]').first
        if terms_field.count() > 0:
            terms_field.fill("https://59gray.github.io/fg-publisher-legal/")
            time.sleep(1)
            print("[OK] Terms URL llenado")
    except Exception as e:
        print(f"[WARN] No se pudo llenar terms: {e}")
    
    # Fill Privacy URL
    print("[INFO] Llenando Privacy URL...")
    try:
        privacy_field = page.locator('input[name*="privacy"], input[id*="privacy"], input[placeholder*="Privacy"]').first
        if privacy_field.count() > 0:
            privacy_field.fill("https://59gray.github.io/fg-publisher-legal/privacy.html/")
            time.sleep(1)
            print("[OK] Privacy URL llenado")
    except Exception as e:
        print(f"[WARN] No se pudo llenar privacy: {e}")
    
    # Select Platforms - Web and Desktop
    print("[INFO] Seleccionando Platforms...")
    try:
        web_checkbox = page.locator('input[type="checkbox"][value="web"], input[name*="web"]').first
        if web_checkbox.count() > 0:
            web_checkbox.check()
            time.sleep(0.5)
        
        desktop_checkbox = page.locator('input[type="checkbox"][value="desktop"], input[name*="desktop"]').first
        if desktop_checkbox.count() > 0:
            desktop_checkbox.check()
            time.sleep(0.5)
        print("[OK] Platforms seleccionados")
    except Exception as e:
        print(f"[WARN] No se pudieron seleccionar platforms: {e}")
    
    page.screenshot(path=str(DEBUG_DIR / "02_form_filled.png"))
    print("\n[INFO] Formulario completado. Revisa la screenshot y haz submit manualmente.")
    print(f"[DEBUG] Screenshots guardadas en: {DEBUG_DIR}")
    
    # Wait for user to review
    time.sleep(30)


def main():
    chrome_exe = find_chrome()
    if not chrome_exe:
        print("[ERROR] Chrome no encontrado")
        return
    
    print("[INFO] Abriendo Chrome para llenar formulario de TikTok...")
    
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
        fill_form(page)
        ctx.close()


if __name__ == "__main__":
    main()
