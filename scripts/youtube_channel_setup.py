"""Configuracion base del canal de YouTube usando OAuth local."""

import os
import shutil

import google.auth.transport.requests
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from fg_automation_config import (
    INSTAGRAM_PROFILE_URL,
    LINKEDIN_COMPANY_URL,
    TIKTOK_PROFILE_URL,
    WEBSITE_URL,
    X_PROFILE_URL,
    client_secret_path,
    token_path,
)

SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]

CHANNEL_DESCRIPTION = (
    "Frecuencia Global - analisis internacional con pulso electronico.\n\n"
    "Geopolitica, cultura y poder traducidos a formatos accesibles, visuales y consistentes.\n\n"
    f"Website: {WEBSITE_URL}\n"
    f"Instagram: {INSTAGRAM_PROFILE_URL}\n"
    f"TikTok: {TIKTOK_PROFILE_URL}\n"
    f"X: {X_PROFILE_URL}\n"
    f"LinkedIn: {LINKEDIN_COMPANY_URL}\n\n"
    "Contacto: frecuenciag@outlook.com"
)

CLIENT_SECRET_PATH = str(client_secret_path())
TOKEN_PATH = str(token_path())
CLIENT_SECRET_SOURCE = os.environ.get("FG_CLIENT_SECRET_SOURCE", "")


def ensure_client_secret() -> None:
    if os.path.exists(CLIENT_SECRET_PATH):
        return

    if CLIENT_SECRET_SOURCE and os.path.exists(CLIENT_SECRET_SOURCE):
        shutil.copyfile(CLIENT_SECRET_SOURCE, CLIENT_SECRET_PATH)
        print("Archivo client_secret.json copiado desde FG_CLIENT_SECRET_SOURCE.")
        return

    raise FileNotFoundError(
        f"No se encontro client_secret.json en {CLIENT_SECRET_PATH}. "
        "Colocalo ahi o define FG_CLIENT_SECRET_SOURCE."
    )


def build_credentials() -> Credentials:
    creds = None
    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)

    if creds and creds.valid:
        return creds

    if creds and creds.expired and creds.refresh_token:
        creds.refresh(google.auth.transport.requests.Request())
    else:
        ensure_client_secret()
        flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_PATH, SCOPES)
        creds = flow.run_local_server(port=0)

    with open(TOKEN_PATH, "w", encoding="utf-8") as token_file:
        token_file.write(creds.to_json())

    return creds


def main() -> None:
    youtube = build("youtube", "v3", credentials=build_credentials())

    channels_response = youtube.channels().list(mine=True, part="snippet").execute()
    channel = channels_response["items"][0]
    snippet = channel["snippet"]
    snippet["description"] = CHANNEL_DESCRIPTION

    youtube.channels().update(part="snippet", body={"id": channel["id"], "snippet": snippet}).execute()
    print("Descripcion del canal actualizada correctamente.")
    print("Nota: La foto de perfil y el banner se gestionan con los scripts de Studio/CDP.")


if __name__ == "__main__":
    main()
