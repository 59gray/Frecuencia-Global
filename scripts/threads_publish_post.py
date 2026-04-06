"""Publica un post en Threads via Threads API.

Uso:
    python scripts/threads_publish_post.py --pieza P1_001
    python scripts/threads_publish_post.py --pieza P1_001 --dry-run

Requisitos:
    - THREADS_ACCESS_TOKEN en .env.local, env, o --token
    - threads_content_publish permission
"""

import os
import re
import sys
import json
import argparse
import requests
from pathlib import Path
from dotenv import load_dotenv

# Importar utilidad local para autocargar secretos
sys.path.insert(0, str(Path(__file__).parent))
from utils import get_required_secret

REPO_ROOT = Path(__file__).parent.parent
PRODUCCION_DIR = REPO_ROOT / "04_Produccion"
ASSETS_DIR = REPO_ROOT / "06_Assets"

THREADS_API_BASE = "https://graph.threads.net/v1.0"

def load_token(args_token):
    if args_token:
        return args_token
    # Usar utilidad que autocarga desde .env.local si es necesario
    return get_required_secret("THREADS_ACCESS_TOKEN")

def get_threads_user_id(token, provided_user_id=None):
    """Obtiene el ID del usuario de Threads."""
    if provided_user_id:
        print(f"[OK] Usando user ID proporcionado: {provided_user_id}")
        return provided_user_id
    url = f"{THREADS_API_BASE}/me"
    params = {"access_token": token, "fields": "id,username"}
    resp = requests.get(url, params=params)
    if resp.status_code == 200:
        data = resp.json()
        print(f"[OK] Threads user: {data.get('username')} (ID: {data.get('id')})")
        return data.get("id")
    else:
        print(f"[ERROR] No se pudo obtener user ID: {resp.text}")
        return None

def extract_threads_content(pieza: str) -> str | None:
    filepath = PRODUCCION_DIR / f"{pieza}_PublishReady.md"
    if not filepath.exists():
        print(f"[ERROR] No existe: {filepath}")
        return None
    content = filepath.read_text(encoding="utf-8")
    # Try Threads section first, then Instagram, then TikTok
    for section in ["Threads", "Instagram", "TikTok"]:
        pattern = rf"## {section}\s*\n([\s\S]*?)\n\s*---"
        match = re.search(pattern, content)
        if match:
            text = match.group(1).strip()
            if text:
                return text
    print(f"[WARN] No se encontró sección Threads/Instagram/TikTok en {filepath}")
    return None

def find_image(pieza: str) -> Path | None:
    """Busca imagen IG (1:1 o 4:5) para Threads."""
    asset_dir = ASSETS_DIR / pieza
    if not asset_dir.exists():
        return None
    # Prefer IG image (1080x1350 or 1080x1080)
    for f in sorted(asset_dir.iterdir()):
        if "IG" in f.name.upper() and f.suffix.lower() in (".png", ".jpg", ".jpeg"):
            return f
    # Fallback to TK image
    for f in sorted(asset_dir.iterdir()):
        if "TK" in f.name.upper() and f.suffix.lower() in (".png", ".jpg", ".jpeg"):
            return f
    # Any image
    for f in sorted(asset_dir.iterdir()):
        if f.suffix.lower() in (".png", ".jpg", ".jpeg"):
            return f
    return None

def upload_image_to_temp(image_path: Path) -> str | None:
    """Sube imagen a host temporal y retorna URL pública."""
    print(f"[INFO] Subiendo imagen a host temporal...")
    try:
        # Usar catbox.moe/litterbox
        with open(image_path, "rb") as f:
            files = {"fileToUpload": f}
            resp = requests.post("https://litterbox.catbox.moe/resources/internals/api.php",
                               data={"reqtype": "fileupload", "time": "72h"},
                               files=files)
        if resp.status_code == 200 and resp.text.startswith("http"):
            url = resp.text.strip()
            print(f"[OK] Imagen subida: {url[:60]}...")
            return url
        else:
            print(f"[ERROR] Upload falló: {resp.text}")
            return None
    except Exception as e:
        print(f"[ERROR] Excepción: {e}")
        return None

def create_media_container(token, user_id, text, image_url):
    """Crea un container de media para publicar."""
    url = f"{THREADS_API_BASE}/{user_id}/threads"
    params = {
        "access_token": token,
        "media_type": "IMAGE",
        "image_url": image_url,
        "text": text[:500]  # Threads limita texto
    }
    resp = requests.post(url, params=params)
    if resp.status_code in (200, 201):
        data = resp.json()
        print(f"[OK] Media container creado: {data.get('id')}")
        return data.get("id")
    else:
        print(f"[ERROR] No se pudo crear container: {resp.text}")
        return None

def publish_container(token, user_id, container_id):
    """Publica el container creado."""
    url = f"{THREADS_API_BASE}/{user_id}/threads_publish"
    params = {
        "access_token": token,
        "creation_id": container_id
    }
    resp = requests.post(url, params=params)
    if resp.status_code in (200, 201):
        data = resp.json()
        print(f"[OK] Post publicado en Threads: {data.get('id')}")
        return data.get("id")
    else:
        print(f"[ERROR] No se pudo publicar: {resp.text}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Publicar en Threads")
    parser.add_argument("--pieza", required=True, help="Nombre de la pieza")
    parser.add_argument("--token", help="Threads access token")
    parser.add_argument("--user-id", help="Threads user ID (opcional, usa me/ si no se provee)")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    token = load_token(args.token)

    # Extraer contenido
    text = extract_threads_content(args.pieza)
    if not text:
        sys.exit(1)

    # Encontrar imagen
    image_path = find_image(args.pieza)
    if not image_path:
        print(f"[ERROR] No se encontró imagen para {args.pieza}")
        sys.exit(1)

    print(f"[OK] Imagen: {image_path}")
    print(f"[OK] Texto: {len(text)} chars")
    print(f"\n{text[:200]}{'...' if len(text) > 200 else ''}\n")

    if args.dry_run:
        print("[DRY_RUN] OK - Simulación completada")
        sys.exit(0)

    # Obtener user ID
    user_id = get_threads_user_id(token, args.user_id)
    if not user_id:
        sys.exit(1)

    # Subir imagen temporal
    image_url = upload_image_to_temp(image_path)
    if not image_url:
        sys.exit(1)

    # Crear media container
    container_id = create_media_container(token, user_id, text, image_url)
    if not container_id:
        sys.exit(1)

    # Publicar
    post_id = publish_container(token, user_id, container_id)
    if post_id:
        print(f"\n[OK] Publicación exitosa: https://threads.net/@frecuenciaglobal/post/{post_id}")
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
