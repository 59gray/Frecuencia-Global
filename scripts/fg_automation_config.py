from __future__ import annotations

import os
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPTS_DIR.parent

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
    return repo_path(f".chrome-{name}")


def client_secret_path() -> Path:
    return repo_path("scripts", "client_secret.json")


def token_path() -> Path:
    return repo_path("scripts", "token.json")
