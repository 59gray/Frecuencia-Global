#!/usr/bin/env python3
"""
Publicar en X/Twitter usando browser automation con Chrome real.
Usa sesión persistente para evitar login manual.

Uso:
    python scripts/x_publish_post_persistente.py --pieza P1_001
    python scripts/x_publish_post_persistente.py --texto "Tweet de prueba"

Requisitos:
    - Chrome instalado
    - Sesión activa en .chrome-x-stable/ (ejecutar x_chrome_login.py primero si es necesario)
"""

import os
import re
import sys
import time
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeoutError

REPO_ROOT = Path(__file__).parent.parent
PRODUCCION_DIR = REPO_ROOT / "04_Produccion"
CHROME_PROFILE_DIR = REPO_ROOT / ".chrome-x-stable"
X_COMPOSE_URL = "https://x.com/compose/tweet"

def find_chrome():
    """Encuentra el ejecutable de Chrome."""
    for c in [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]:
        if os.path.exists(c):
            return c
    return None

def extract_x_content(pieza: str) -> str | None:
    """Extrae contenido X de PublishReady."""
    filepath = PRODUCCION_DIR / f"{pieza}_PublishReady.md"
    if not filepath.exists():
        print(f"[ERROR] No existe: {filepath}")
        return None

    content = filepath.read_text(encoding="utf-8")
    pattern = r"## X \(Twitter\)\s*\n```\s*\n(.*?)\n```"
    match = re.search(pattern, content, re.DOTALL)

    if match:
        return match.group(1).strip()

    print(f"[WARN] No se encontró sección X en {filepath}")
    return None

def publish_with_persistent_session(text: str, dry_run: bool = False) -> bool:
    """Publica usando sesión Chrome persistente."""

    chrome_exe = find_chrome()
    if not chrome_exe:
        print("[ERROR] Chrome no encontrado")
        return False

    if not CHROME_PROFILE_DIR.exists():
        print(f"[ERROR] No existe sesión persistente: {CHROME_PROFILE_DIR}")
        print("[INFO] Ejecuta primero: python scripts/x_chrome_login.py")
        return False

    print(f"[INFO] Usando sesión persistente: {CHROME_PROFILE_DIR}")
    print(f"[INFO] Chrome: {chrome_exe}")

    if dry_run:
        print(f"[DRY_RUN] Texto a publicar ({len(text)} chars):")
        print(f"---\n{text}\n---")
        return True

    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            user_data_dir=str(CHROME_PROFILE_DIR),
            headless=False,
            executable_path=chrome_exe,
            args=[
                "--start-maximized",
                "--no-first-run",
                "--disable-blink-features=AutomationControlled"
            ],
            viewport=None,
            no_viewport=True,
        )

        page = ctx.new_page()

        try:
            print("[INFO] Navegando a X...")
            page.goto(X_COMPOSE_URL, wait_until="domcontentloaded", timeout=30000)
            time.sleep(3)

            # Verificar si estamos logueados
            if "/login" in page.url:
                print("[ERROR] Sesión no válida. Requiere login manual.")
                print("[INFO] Ejecuta: python scripts/x_chrome_login.py")
                ctx.close()
                return False

            print("[OK] Sesión activa detectada")

            # Encontrar textarea
            selectors = [
                'div[data-testid="tweetTextarea_0"]',
                'div[contenteditable="true"][data-testid="tweetTextarea_0"]',
                'div[role="textbox"]',
            ]

            textarea = None
            for sel in selectors:
                try:
                    el = page.locator(sel).first
                    if el.is_visible(timeout=3000):
                        textarea = el
                        break
                except:
                    continue

            if not textarea:
                print("[ERROR] No se encontró campo de texto")
                ctx.close()
                return False

            # Screenshot antes de escribir
            page.screenshot(path=str(REPO_ROOT / "scripts" / "tmp_x_debug" / "01_before_write.png"))

            # Escribir tweet
            print(f"[INFO] Escribiendo tweet ({len(text)} chars)...")
            textarea.click()
            time.sleep(0.5)
            textarea.fill(text)
            time.sleep(1)

            # Screenshot después de escribir
            page.screenshot(path=str(REPO_ROOT / "scripts" / "tmp_x_debug" / "02_after_write.png"))

            # Click en Post - Múltiples estrategias
            posted = False

            # Estrategia 1: Selectores data-testid
            post_selectors = [
                'button[data-testid="tweetButton"]:enabled',
                'button[data-testid="tweetButtonInline"]:enabled',
                'div[data-testid="tweetButton"]',
                'button:has-text("Post")',
                'button:has-text("Postear")',
                'div[role="button"]:has-text("Post")',
            ]

            for sel in post_selectors:
                try:
                    btn = page.locator(sel).first
                    if btn.is_enabled(timeout=2000) and btn.is_visible(timeout=2000):
                        print(f"[INFO] Click en botón: {sel}")
                        btn.click()
                        time.sleep(3)
                        posted = True
                        break
                except:
                    continue

            # Estrategia 2: JavaScript directo si falla el click
            if not posted:
                try:
                    print("[INFO] Intentando click via JavaScript...")
                    page.evaluate("""() => {
                        const btns = document.querySelectorAll('button[data-testid="tweetButton"], button:has-text("Post")');
                        for (const btn of btns) {
                            if (btn && !btn.disabled) {
                                btn.click();
                                return true;
                            }
                        }
                        return false;
                    }""")
                    time.sleep(3)
                    posted = True
                except:
                    pass

            # Verificar si realmente se publicó
            time.sleep(2)
            current_url = page.url
            print(f"[INFO] URL después de publicar: {current_url}")

            # Screenshot post-click
            page.screenshot(path=str(REPO_ROOT / "scripts" / "tmp_x_debug" / "03_after_click.png"))

            # Verificar que no estamos en /compose (si salimos de compose, es éxito)
            if posted and "/compose" not in current_url:
                print("[OK] Tweet publicado exitosamente (redirección detectada)")
                ctx.close()
                return True
            elif posted:
                # Aún en compose, verificar si hay mensaje de éxito
                try:
                    success_indicator = page.locator('text=/sent|published|posted|enviado/i').first
                    if success_indicator.is_visible(timeout=2000):
                        print("[OK] Tweet publicado exitosamente (indicador de éxito)")
                        ctx.close()
                        return True
                except:
                    pass

                print("[WARN] Click realizado pero no se confirmó redirección")
                page.screenshot(path=str(REPO_ROOT / "scripts" / "tmp_x_debug" / "04_uncertain.png"))
                ctx.close()
                return False
            else:
                print("[ERROR] No se pudo hacer click en Post")
                page.screenshot(path=str(REPO_ROOT / "scripts" / "tmp_x_debug" / "error_post.png"))
                ctx.close()
                return False

        except Exception as e:
            print(f"[ERROR] {e}")
            ctx.close()
            return False

def main():
    parser = argparse.ArgumentParser(description="Publicar en X con sesión persistente")
    parser.add_argument("--pieza", help="Nombre de pieza (ej: P1_001)")
    parser.add_argument("--texto", help="Texto directo del tweet")
    parser.add_argument("--dry-run", action="store_true", help="Solo validar, no publicar")
    args = parser.parse_args()

    if args.texto:
        text = args.texto
    elif args.pieza:
        text = extract_x_content(args.pieza)
        if not text:
            sys.exit(1)
    else:
        print("[ERROR] Especifica --pieza o --texto")
        sys.exit(1)

    # Validar longitud
    if len(text) > 280:
        print(f"[ERROR] Texto excede 280 chars: {len(text)}")
        sys.exit(1)

    print(f"[OK] Texto: {len(text)}/280 chars")

    success = publish_with_persistent_session(text, args.dry_run)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
