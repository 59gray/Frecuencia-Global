"""Publica en Instagram via Graph API.

Uso:
    python scripts/ig_api_publish.py --pieza P1_001
    python scripts/ig_api_publish.py --pieza P1_001 --dry-run
    python scripts/ig_api_publish.py --caption "texto" --image path/to/img.png

Requisitos:
    - Instagram Business/Creator account
    - Access token con instagram_content_publish
    - Imagen debe ser hosteada en URL pública (se sube automáticamente)
"""

import os
import re
import sys
import time
import argparse
import requests
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
PRODUCCION_DIR = REPO_ROOT / "04_Produccion"
ASSETS_DIR = REPO_ROOT / "06_Assets"

IG_ACCESS_TOKEN = os.environ.get("IG_ACCESS_TOKEN", "")
IG_USER_ID = os.environ.get("IG_USER_ID", "")
GRAPH_API = "https://graph.instagram.com/v22.0"


def get_ig_user_id(token):
    """Get Instagram user ID from token."""
    r = requests.get(f"{GRAPH_API}/me", params={
        "fields": "id,username",
        "access_token": token,
    })
    if r.status_code == 200:
        data = r.json()
        print(f"[OK] Cuenta: @{data['username']} (ID: {data['id']})")
        return data["id"]
    print(f"[ERROR] No se pudo obtener user ID: {r.json()}")
    return None


def upload_image_temp(filepath):
    """Upload image to temporary public host for IG API."""
    print(f"[INFO] Subiendo imagen a host temporal...")
    with open(filepath, "rb") as f:
        r = requests.post(
            "https://litterbox.catbox.moe/resources/internals/api.php",
            data={"reqtype": "fileupload", "time": "72h"},
            files={"fileToUpload": (filepath.name, f, "image/png")},
        )
    if r.status_code == 200 and r.text.strip().startswith("http"):
        url = r.text.strip()
        print(f"[OK] Imagen hosteada: {url}")
        return url
    print(f"[ERROR] No se pudo subir imagen: {r.status_code} {r.text[:200]}")
    return None


def extract_ig_caption(pieza):
    """Extract Instagram caption from PublishReady file."""
    filepath = PRODUCCION_DIR / f"{pieza}_PublishReady.md"
    if not filepath.exists():
        print(f"[ERROR] No existe: {filepath}")
        return None
    content = filepath.read_text(encoding="utf-8")
    pattern = r"## Instagram\s*\n([\s\S]*?)\n\s*---"
    match = re.search(pattern, content)
    if match:
        text = match.group(1).strip()
        # Remove the "**Caption:**" prefix if present
        text = re.sub(r"^\*\*Caption:\*\*\s*\n?", "", text).strip()
        return text
    return None


def find_ig_image(pieza):
    """Find the IG image for a pieza."""
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


def publish_photo(user_id, token, image_url, caption):
    """Publish a single photo post via Instagram Graph API."""
    # Step 1: Create media container
    print("[1/2] Creando media container...")
    r1 = requests.post(f"{GRAPH_API}/{user_id}/media", data={
        "image_url": image_url,
        "caption": caption,
        "access_token": token,
    })
    print(f"  Status: {r1.status_code}")

    if r1.status_code != 200:
        print(f"  Error: {r1.json()}")
        return None

    creation_id = r1.json()["id"]
    print(f"  Container ID: {creation_id}")

    # Step 2: Wait for container to be ready
    print("[INFO] Esperando procesamiento...")
    for _ in range(30):
        check = requests.get(f"{GRAPH_API}/{creation_id}", params={
            "fields": "status_code",
            "access_token": token,
        })
        if check.status_code == 200:
            status = check.json().get("status_code")
            if status == "FINISHED":
                break
            elif status == "ERROR":
                print(f"  Error en procesamiento: {check.json()}")
                return None
        time.sleep(2)

    # Step 3: Publish
    print("[2/2] Publicando...")
    r2 = requests.post(f"{GRAPH_API}/{user_id}/media_publish", data={
        "creation_id": creation_id,
        "access_token": token,
    })
    print(f"  Status: {r2.status_code}")

    if r2.status_code == 200:
        post_id = r2.json()["id"]
        print(f"  Post ID: {post_id}")
        return post_id

    print(f"  Error: {r2.json()}")
    return None


def main():
    parser = argparse.ArgumentParser(description="Publicar en Instagram via API")
    parser.add_argument("--pieza", help="Nombre de la pieza (ej: P1_001)")
    parser.add_argument("--caption", help="Caption directo")
    parser.add_argument("--image", help="Path de la imagen")
    parser.add_argument("--image-url", help="URL pública de la imagen (skip upload)")
    parser.add_argument("--token", help="Instagram access token")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    token = args.token or IG_ACCESS_TOKEN
    if not token:
        print("[ERROR] Necesitas --token o env var IG_ACCESS_TOKEN")
        sys.exit(1)

    # Get user ID
    user_id = IG_USER_ID or get_ig_user_id(token)
    if not user_id:
        sys.exit(1)

    # Get caption
    if args.caption:
        caption = args.caption
    elif args.pieza:
        caption = extract_ig_caption(args.pieza)
        if not caption:
            print("[ERROR] No se encontró caption")
            sys.exit(1)
    else:
        print("[ERROR] Especifica --pieza o --caption")
        sys.exit(1)

    # Get image
    if args.image_url:
        image_url = args.image_url
        image_path = None
    elif args.image:
        image_path = Path(args.image)
    elif args.pieza:
        image_path = find_ig_image(args.pieza)
    else:
        image_path = None

    if not args.image_url and (not image_path or not image_path.exists()):
        print(f"[ERROR] Imagen no encontrada: {image_path}")
        sys.exit(1)

    print(f"[OK] Caption: {len(caption)} chars")
    if image_path:
        print(f"[OK] Imagen: {image_path}")
    print(f"\n{caption[:200]}{'...' if len(caption) > 200 else ''}\n")

    if args.dry_run:
        print("[DRY_RUN] OK")
        sys.exit(0)

    # Upload image if needed
    if not args.image_url:
        image_url = upload_image_temp(image_path)
        if not image_url:
            sys.exit(1)

    # Publish
    post_id = publish_photo(user_id, token, image_url, caption)
    if post_id:
        print(f"\n✅ Publicado en Instagram! Post ID: {post_id}")
    else:
        print("\n❌ Error al publicar")
        sys.exit(1)


if __name__ == "__main__":
    main()
