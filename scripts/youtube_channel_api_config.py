"""Configura metadatos, keywords y watermark del canal via YouTube Data API v3."""

import os

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

from fg_automation_config import (
    INSTAGRAM_PROFILE_URL,
    LINKEDIN_COMPANY_URL,
    TIKTOK_PROFILE_URL,
    WEBSITE_URL,
    X_PROFILE_URL,
    repo_path,
    token_path,
)

BASE_DIR = str(repo_path())
TOKEN_PATH = str(token_path())
WATERMARK_IMAGE = str(repo_path("06_Assets", "fg_youtube_watermark_150.png"))

DEFAULT_CHANNEL_ID = "UCFZYwZwkDD6oUPacaLo7PvQ"
SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]

CHANNEL_DESCRIPTION = """\
Frecuencia Global - analisis internacional con pulso electronico.

Geopolitica, cultura y poder traducidos a formatos accesibles, visuales y consistentes.

Series:
- Geopolitik Drop
- Bass & Borders
- Frecuencia Global
- Behind the Policy

Website: {website}
Instagram: {instagram}
TikTok: {tiktok}
X: {x}
LinkedIn: {linkedin}

Contacto: frecuenciag@outlook.com""".format(
    website=WEBSITE_URL,
    instagram=INSTAGRAM_PROFILE_URL,
    tiktok=TIKTOK_PROFILE_URL,
    x=X_PROFILE_URL,
    linkedin=LINKEDIN_COMPANY_URL,
)

CHANNEL_KEYWORDS = [
    "Frecuencia Global",
    "geopolitica",
    "analisis geopolitico",
    "relaciones internacionales",
    "analisis internacional",
    "conflictos globales",
    "politica global",
    "actualidad global",
    "news and politics",
    "musica electronica",
    "geopolitik drop",
    "bass and borders",
    "behind the policy",
    "noticias globales",
    "geopolitics",
    "international relations",
    "global analysis",
]


def build_youtube_client() -> object:
    if not os.path.exists(TOKEN_PATH):
        raise FileNotFoundError(f"No encontre token.json en: {TOKEN_PATH}")
    creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open(TOKEN_PATH, "w", encoding="utf-8") as f:
            f.write(creds.to_json())
    return build("youtube", "v3", credentials=creds)


def resolve_channel_id(youtube) -> str:
    response = youtube.channels().list(mine=True, part="id,snippet").execute()
    items = response.get("items", [])
    if not items:
        return DEFAULT_CHANNEL_ID
    return items[0]["id"]


def step1_update_channel_metadata(youtube, channel_id: str) -> None:
    print("\n[1/4] Actualizando metadatos del canal...")

    keywords_str = " ".join(f'"{k}"' if " " in k else k for k in CHANNEL_KEYWORDS)

    body = {
        "id": channel_id,
        "brandingSettings": {
            "channel": {
                "title": "Frecuencia Global",
                "description": CHANNEL_DESCRIPTION,
                "keywords": keywords_str,
                "defaultLanguage": "es",
                "country": "MX",
            }
        },
    }

    response = youtube.channels().update(part="brandingSettings", body=body).execute()
    saved_desc = response.get("brandingSettings", {}).get("channel", {}).get("description", "")[:80]
    saved_kw = response.get("brandingSettings", {}).get("channel", {}).get("keywords", "")[:80]
    print(f"  OK Descripcion guardada: {saved_desc}...")
    print(f"  OK Keywords guardadas: {saved_kw}...")
    print(f"  OK Pais: {response.get('brandingSettings', {}).get('channel', {}).get('country', '?')}")
    print(f"  OK Idioma: {response.get('brandingSettings', {}).get('channel', {}).get('defaultLanguage', '?')}")


def step2_set_watermark(youtube, channel_id: str) -> None:
    print("\n[2/4] Configurando watermark del canal...")

    if not os.path.exists(WATERMARK_IMAGE):
        print(f"  FAIL No encontre imagen de watermark: {WATERMARK_IMAGE}")
        return

    size_kb = os.path.getsize(WATERMARK_IMAGE) / 1024
    print(f"  Imagen: {WATERMARK_IMAGE} ({size_kb:.1f} KB)")

    timing = {
        "type": "offsetFromEnd",
        "offsetMs": 15000,
        "durationMs": 15000,
    }

    media = MediaFileUpload(WATERMARK_IMAGE, mimetype="image/png", resumable=False)

    youtube.watermarks().set(
        channelId=channel_id,
        body={"timing": timing, "targetChannelId": channel_id},
        media_body=media,
    ).execute()

    print("  OK Watermark configurado para los ultimos 15s de cada video.")


def step3_verify_channel(youtube) -> None:
    print("\n[3/4] Verificando configuracion guardada...")

    response = youtube.channels().list(
        mine=True,
        part="brandingSettings,snippet",
    ).execute()

    items = response.get("items", [])
    if not items:
        print("  FAIL No se encontraron items de canal.")
        return

    ch = items[0]
    snippet = ch.get("snippet", {})
    branding = ch.get("brandingSettings", {}).get("channel", {})

    print(f"  Canal: {snippet.get('title', '?')} ({snippet.get('customUrl', '?')})")
    print(f"  Descripcion ({len(branding.get('description', ''))} chars): OK")
    print(f"  Keywords: {branding.get('keywords', '')[:100]}")
    print(f"  Pais: {branding.get('country', '?')}")
    print(f"  Idioma: {branding.get('defaultLanguage', '?')}")


def step4_read_channel_id(youtube) -> str:
    print("\n[4/4] Canal ID verificado...")
    response = youtube.channels().list(mine=True, part="id,snippet").execute()
    items = response.get("items", [])
    if items:
        channel_id = items[0]["id"]
        title = items[0].get("snippet", {}).get("title", "?")
        print(f"  OK Canal: {title} | ID: {channel_id}")
        return channel_id
    return DEFAULT_CHANNEL_ID


if __name__ == "__main__":
    print("=" * 60)
    print("  Frecuencia Global - Configuracion de Canal via API")
    print("=" * 60)

    youtube = build_youtube_client()
    channel_id = step4_read_channel_id(youtube)
    step1_update_channel_metadata(youtube, channel_id)
    step2_set_watermark(youtube, channel_id)
    step3_verify_channel(youtube)

    print("\nOK Configuracion de API completada.")
