#!/usr/bin/env python3
"""
Script completo: Configura token de Instagram y ejecuta prueba de publicación.
Uso: python scripts/setup_and_test_ig.py --token EAA...
"""

import os
import sys
import argparse
import requests
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
ENV_FILE = REPO_ROOT / "08_n8n" / ".env"
GRAPH_API = "https://graph.instagram.com/v22.0"

def save_token(token):
    """Guardar token en .env."""
    if not ENV_FILE.exists():
        print(f"❌ No existe: {ENV_FILE}")
        return False
    
    content = ENV_FILE.read_text(encoding='utf-8')
    
    # Actualizar o agregar IG_ACCESS_TOKEN
    if 'IG_ACCESS_TOKEN=' in content:
        import re
        content = re.sub(r'IG_ACCESS_TOKEN=.*\n?', f'IG_ACCESS_TOKEN={token}\n', content)
    else:
        content += f"\n# --- Instagram API ---\nIG_ACCESS_TOKEN={token}\n"
    
    # Agregar IG_USER_ID si no existe
    if 'IG_USER_ID=' not in content:
        content += "IG_USER_ID=24263988463298387\n"
    
    ENV_FILE.write_text(content, encoding='utf-8')
    print(f"✅ Token guardado en {ENV_FILE}")
    return True

def verify_token(token):
    """Verificar token con Graph API."""
    print("\n🔍 Verificando token...")
    url = f"{GRAPH_API}/me?fields=id,username&access_token={token}"
    
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Token válido!")
            print(f"   Cuenta: @{data.get('username')}")
            print(f"   ID: {data.get('id')}")
            return data.get('id')
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"   {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def run_test_post(token, user_id):
    """Ejecutar prueba de publicación."""
    print("\n🧪 Ejecutando prueba de publicación...")
    
    # Buscar imagen de prueba
    test_image = REPO_ROOT / "06_Assets" / "P1_001" / "P1_001_IG_1080x1350.png"
    if not test_image.exists():
        # Buscar cualquier imagen IG
        asset_dir = REPO_ROOT / "06_Assets"
        for img in asset_dir.rglob("*IG*.png"):
            test_image = img
            break
    
    if not test_image or not test_image.exists():
        print("❌ No se encontró imagen de prueba")
        return False
    
    print(f"📷 Usando imagen: {test_image}")
    
    # Subir imagen temporalmente
    print("⬆️ Subiendo imagen a host temporal...")
    with open(test_image, "rb") as f:
        r = requests.post(
            "https://litterbox.catbox.moe/resources/internals/api.php",
            data={"reqtype": "fileupload", "time": "72h"},
            files={"fileToUpload": (test_image.name, f, "image/png")},
            timeout=30
        )
    
    if r.status_code != 200 or not r.text.strip().startswith("http"):
        print(f"❌ Error subiendo imagen: {r.status_code}")
        return False
    
    image_url = r.text.strip()
    print(f"✅ Imagen hosteada: {image_url}")
    
    # Crear media container
    print("📦 Creando media container...")
    caption = "🧪 Prueba de publicación automática - Frecuencia Global"
    
    r1 = requests.post(f"{GRAPH_API}/{user_id}/media", data={
        "image_url": image_url,
        "caption": caption,
        "access_token": token,
    }, timeout=30)
    
    if r1.status_code != 200:
        print(f"❌ Error creando container: {r1.json()}")
        return False
    
    creation_id = r1.json()["id"]
    print(f"✅ Container creado: {creation_id}")
    
    # Esperar procesamiento
    print("⏳ Esperando procesamiento...")
    import time
    for i in range(30):
        time.sleep(2)
        check = requests.get(f"{GRAPH_API}/{creation_id}", params={
            "fields": "status_code",
            "access_token": token,
        }, timeout=10)
        if check.status_code == 200:
            status = check.json().get("status_code")
            if status == "FINISHED":
                break
            elif status == "ERROR":
                print(f"❌ Error en procesamiento")
                return False
    
    # Publicar
    print("🚀 Publicando...")
    r2 = requests.post(f"{GRAPH_API}/{user_id}/media_publish", data={
        "creation_id": creation_id,
        "access_token": token,
    }, timeout=30)
    
    if r2.status_code == 200:
        post_id = r2.json()["id"]
        print(f"\n🎉 ¡PUBLICACIÓN EXITOSA!")
        print(f"   Post ID: {post_id}")
        print(f"   URL: https://instagram.com/p/{post_id}")
        return True
    else:
        print(f"❌ Error publicando: {r2.json()}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Configurar Instagram y ejecutar prueba")
    parser.add_argument("--token", required=True, help="Instagram Access Token (EAA...)")
    args = parser.parse_args()
    
    token = args.token.strip()
    
    if not token.startswith("EAA"):
        print("❌ Token inválido. Debe comenzar con 'EAA'")
        sys.exit(1)
    
    print("="*60)
    print("CONFIGURACIÓN Y PRUEBA DE INSTAGRAM")
    print("="*60)
    
    # Guardar token
    if not save_token(token):
        sys.exit(1)
    
    # Verificar token
    user_id = verify_token(token)
    if not user_id:
        sys.exit(1)
    
    # Ejecutar prueba
    if run_test_post(token, user_id):
        print("\n" + "="*60)
        print("✅ TODO COMPLETADO EXITOSAMENTE")
        print("="*60)
    else:
        print("\n" + "="*60)
        print("❌ LA PRUEBA FALLÓ")
        print("="*60)
        sys.exit(1)

if __name__ == "__main__":
    main()
