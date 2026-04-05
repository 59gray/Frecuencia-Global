from __future__ import annotations

import os
from pathlib import Path
from typing import Optional, Dict

try:
    from playwright.sync_api import sync_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

SCRIPTS_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPTS_DIR.parent

# ============================================================================
# CONFIGURACIÓN DE PLATAFORMAS Y URLs
# ============================================================================

WEBSITE_URL = os.environ.get("FG_WEBSITE_URL", "https://frecuenciaglobal.vercel.app")
WEBSITE_PREVIEW_URL = os.environ.get("FG_WEBSITE_PREVIEW_URL", "https://website-three-rho-26.vercel.app")
PODCAST_HOST = os.environ.get("FG_PODCAST_HOST", "rss.com")
PODCAST_SLUG = os.environ.get("FG_PODCAST_SLUG", "frecuencia-global-podcast")
PODCAST_RSS_URL = os.environ.get("FG_PODCAST_RSS_URL", f"https://media.rss.com/{PODCAST_SLUG}/feed.xml")
PODCAST_SHOW_URL = os.environ.get("FG_PODCAST_SHOW_URL", f"https://rss.com/podcasts/{PODCAST_SLUG}")

TIKTOK_HANDLE = os.environ.get("FG_TIKTOK_HANDLE", "frecuenciaglobal")
TIKTOK_PROFILE_URL = f"https://www.tiktok.com/@{TIKTOK_HANDLE}"
TIKTOK_PROFILE_IMAGE = REPO_ROOT / "Frecuencia_Global_Assets_Base" / "assets" / "fg_tiktok_profile_200x200.png"
TIKTOK_COVER_IMAGE = REPO_ROOT / "Frecuencia_Global_Assets_Base" / "assets" / "fg_tiktok_cover_1080x1920.png"
TIKTOK_COVER_GUIDES_IMAGE = REPO_ROOT / "Frecuencia_Global_Assets_Base" / "assets" / "fg_tiktok_cover_1080x1920_guides.png"

X_HANDLE = os.environ.get("FG_X_HANDLE", "frec_global")
X_PROFILE_URL = f"https://x.com/{X_HANDLE}"

INSTAGRAM_HANDLE = os.environ.get("FG_INSTAGRAM_HANDLE", "globalfrequency.es")
INSTAGRAM_PROFILE_URL = f"https://instagram.com/{INSTAGRAM_HANDLE}"

LINKEDIN_COMPANY_SLUG = os.environ.get("FG_LINKEDIN_COMPANY_SLUG", "frecuencia-global")
LINKEDIN_COMPANY_URL = f"https://www.linkedin.com/company/{LINKEDIN_COMPANY_SLUG}"

YOUTUBE_HANDLE = os.environ.get("FG_YOUTUBE_HANDLE", "FrecuenciaGlobal")
YOUTUBE_CHANNEL_URL = f"https://youtube.com/@{YOUTUBE_HANDLE}"

LOCALAPPDATA = Path(os.environ.get("LOCALAPPDATA", str(Path.home() / "AppData" / "Local")))

_CHROME_CANDIDATES = [
    os.environ.get("FG_CHROME_EXE"),
    str(Path(os.environ.get("PROGRAMFILES", r"C:\Program Files")) / "Google/Chrome/Application/chrome.exe"),
    str(Path(os.environ.get("PROGRAMFILES(X86)", r"C:\Program Files (x86)")) / "Google/Chrome/Application/chrome.exe"),
]

# ============================================================================
# PERFILES DE CHROME PERSISTENTES
# ============================================================================

CHROME_PROFILES: Dict[str, Path] = {
    "x": REPO_ROOT / ".chrome-x-stable",
    "linkedin": REPO_ROOT / ".chrome-linkedin-stable",
    "gemini": REPO_ROOT / ".chrome-gemini-stable",
    "youtube": REPO_ROOT / ".chrome-youtube-stable",
    "meta": REPO_ROOT / ".chrome-meta-stable",  # Facebook + Instagram + Threads
    "tiktok": REPO_ROOT / ".chrome-tiktok-stable",
    "rsscom": REPO_ROOT / ".chrome-rsscom-stable",
}

PLATFORM_URLS: Dict[str, str] = {
    "x": "https://x.com",
    "linkedin": "https://www.linkedin.com",
    "gemini": "https://gemini.google.com",
    "youtube": "https://studio.youtube.com",
    "meta": "https://www.facebook.com",
    "tiktok": "https://www.tiktok.com/login",
    "rsscom": "https://rss.com/login",
}

def get_chrome_profile(platform: str) -> Path:
    """Obtiene el path del perfil de Chrome para una plataforma."""
    return CHROME_PROFILES.get(platform, REPO_ROOT / f".chrome-{platform}-stable")

def ensure_profile_exists(platform: str) -> Path:
    """Asegura que el directorio del perfil exista."""
    profile_dir = get_chrome_profile(platform)
    profile_dir.mkdir(parents=True, exist_ok=True)
    return profile_dir

def list_profiles():
    """Lista todos los perfiles y su estado."""
    result = {}
    for platform, path in CHROME_PROFILES.items():
        size = 0
        if path.exists():
            try:
                size = sum(f.stat().st_size for f in path.rglob("*") if f.is_file())
            except:
                pass
        result[platform] = {
            "path": str(path),
            "exists": path.exists(),
            "size_bytes": size,
            "size_mb": size / (1024 * 1024),
        }
    return result

def reset_profile(platform: str) -> bool:
    """Elimina el perfil de una plataforma."""
    profile_dir = get_chrome_profile(platform)
    if profile_dir.exists():
        import shutil
        shutil.rmtree(profile_dir)
        return True
    return False

# ============================================================================
# FUNCIONES DE CHROME Y NAVEGADOR
# ============================================================================

def repo_path(*parts: str) -> Path:
    return REPO_ROOT.joinpath(*parts)

def first_existing_path(*candidates: str | Path | None) -> Path | None:
    for candidate in candidates:
        if not candidate:
            continue
        path = Path(candidate)
        if path.exists():
            return path
    return None

def chrome_executable() -> Path:
    return first_existing_path(*_CHROME_CANDIDATES) or Path(_CHROME_CANDIDATES[1])

def chrome_user_data_dir() -> Path:
    override = os.environ.get("FG_CHROME_USER_DATA_DIR")
    if override:
        return Path(override)
    return LOCALAPPDATA / "Google" / "Chrome" / "User Data"

def chrome_profile_dir(name: str) -> Path:
    """Legacy: use get_chrome_profile() instead."""
    return get_chrome_profile(name)

def launch_persistent_browser(platform: str, headless: bool = False):
    """
    Lanza Chrome con un perfil persistente para la plataforma especificada.

    Args:
        platform: Nombre de la plataforma (x, linkedin, meta, etc.)
        headless: Si True, corre sin ventana visible

    Returns:
        Tuple[BrowserContext, Playwright]: Contexto y instancia de playwright
    """
    if not PLAYWRIGHT_AVAILABLE:
        raise RuntimeError("Playwright no instalado. Ejecuta: pip install playwright && playwright install chromium")

    profile_dir = ensure_profile_exists(platform)
    chrome_exe = str(chrome_executable())

    p = sync_playwright().start()

    browser = p.chromium.launch_persistent_context(
        user_data_dir=str(profile_dir),
        channel="chrome",
        headless=headless,
        executable_path=chrome_exe,
        viewport={"width": 1440, "height": 1024},
        args=[
            "--disable-blink-features=AutomationControlled",
            "--no-first-run",
        ],
    )

    return browser, p

def check_session_valid(platform: str, timeout_sec: int = 10) -> bool:
    """
    Verifica rápidamente si la sesión de una plataforma sigue válida.
    """
    if not PLAYWRIGHT_AVAILABLE:
        return False

    import time

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch_persistent_context(
                user_data_dir=str(ensure_profile_exists(platform)),
                channel="chrome",
                headless=True,
                args=["--disable-blink-features=AutomationControlled"],
            )

            page = browser.new_page()
            page.set_default_timeout(timeout_sec * 1000)

            url = PLATFORM_URLS.get(platform, "https://google.com")
            page.goto(url, wait_until="domcontentloaded")
            time.sleep(2)

            current_url = page.url
            browser.close()

            # Si estamos en página de login, la sesión expiró
            if "/login" in current_url or "/auth" in current_url or "login" in current_url:
                return False

            return True

    except Exception as e:
        print(f"⚠️ Error verificando sesión de {platform}: {e}")
        return False

def client_secret_path() -> Path:
    return repo_path("scripts", "client_secret.json")

def token_path() -> Path:
    return repo_path("scripts", "token.json")
