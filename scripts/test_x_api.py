"""Prueba de publicación en X/Twitter usando API v1.1 (OAuth 1.0a)

Uso:
    python scripts/test_x_api.py

Requisitos:
    pip install requests requests-oauthlib
"""

import os
import sys
from pathlib import Path

# Credenciales X API (Frecuencia Global n8n)
API_KEY = "wc7n5fTg452bjMkFjl87WZ61U"
API_SECRET = "fXp3445W9CgbRqEg1bAzxhkMfXAB7vsf9ATkeM05vwYlnittLs"
ACCESS_TOKEN = "2285520619-A8vU1Nke4eGICcG9AXNYL0W4emGi5pJP9BYavTf"
ACCESS_SECRET = "M78DrpWXTbw0zyGwXR8VS0jJPQmqEqvBojNSVjDuMAf7A"

def test_x_api():
    """Prueba simple de conexión y publicación en X."""
    
    try:
        from requests_oauthlib import OAuth1Session
    except ImportError:
        print("[ERROR] Instalar dependencias: pip install requests requests-oauthlib")
        sys.exit(1)
    
    # Crear sesión OAuth1
    oauth = OAuth1Session(
        API_KEY,
        client_secret=API_SECRET,
        resource_owner_key=ACCESS_TOKEN,
        resource_owner_secret=ACCESS_SECRET
    )
    
    # URL de la API v2 para crear tweet
    url = "https://api.twitter.com/2/tweets"
    
    # Payload del tweet
    payload = {
        "text": "🧪 Test de API desde n8n Cloud — Frecuencia Global. Si ves esto, la integración funciona. #TestAutomatizado"
    }
    
    print("[INFO] Enviando tweet de prueba...")
    print(f"[INFO] URL: {url}")
    print(f"[INFO] Payload: {payload}")
    
    # Hacer la petición POST
    response = oauth.post(url, json=payload)
    
    if response.status_code == 201:
        data = response.json()
        tweet_id = data.get('data', {}).get('id')
        print(f"\n✅ SUCCESS — Tweet publicado")
        print(f"   Tweet ID: {tweet_id}")
        print(f"   URL: https://twitter.com/user/status/{tweet_id}")
        return True
    elif response.status_code == 403:
        error = response.json()
        print(f"\n❌ ERROR 403 — Permisos insuficientes")
        print(f"   Detail: {error.get('detail', 'Unknown')}")
        print(f"   Title: {error.get('title', 'No title')}")
        print(f"\n   Posibles causas:")
        print(f"   - App no tiene 'Elevated Access'")
        print(f"   - Tokens no tienen permiso 'tweet.write'")
        print(f"   - Cuenta suspendida o limitada")
        return False
    elif response.status_code == 401:
        print(f"\n❌ ERROR 401 — Autenticación fallida")
        print(f"   Verificar que los tokens sean correctos")
        return False
    else:
        print(f"\n❌ ERROR {response.status_code}")
        print(f"   Response: {response.text[:500]}")
        return False

def test_user_info():
    """Obtener info del usuario autenticado (test de lectura)."""
    
    try:
        from requests_oauthlib import OAuth1Session
    except ImportError:
        print("[ERROR] Instalar dependencias: pip install requests requests-oauthlib")
        return False
    
    oauth = OAuth1Session(
        API_KEY,
        client_secret=API_SECRET,
        resource_owner_key=ACCESS_TOKEN,
        resource_owner_secret=ACCESS_SECRET
    )
    
    # Obtener info del usuario
    url = "https://api.twitter.com/2/users/me"
    response = oauth.get(url)
    
    if response.status_code == 200:
        data = response.json()
        user = data.get('data', {})
        print(f"\n✅ User Info — Conexión OK")
        print(f"   Username: @{user.get('username')}")
        print(f"   Name: {user.get('name')}")
        print(f"   ID: {user.get('id')}")
        return True
    else:
        print(f"\n❌ Error obteniendo user info: {response.status_code}")
        print(f"   {response.text[:300]}")
        return False

if __name__ == "__main__":
    print("="*60)
    print("TEST DE API X/TWITTER — Frecuencia Global")
    print("="*60)
    
    # Test 1: User info (lectura)
    print("\n[Test 1] Verificando credenciales (user info)...")
    user_ok = test_user_info()
    
    if not user_ok:
        print("\n⚠️  No se pudo obtener info de usuario. Abortando test de publicación.")
        sys.exit(1)
    
    # Test 2: Publicar tweet
    print("\n[Test 2] Publicando tweet de prueba...")
    tweet_ok = test_x_api()
    
    print("\n" + "="*60)
    if tweet_ok:
        print("RESULTADO: ✅ API X configurada correctamente")
        print("\nPróximo paso:")
        print("- Configurar credencial en n8n Cloud con estos mismos tokens")
        print("- Probar WF-007_publicar_x con una pieza real")
    else:
        print("RESULTADO: ❌ Error en API X")
        print("\nAcciones sugeridas:")
        print("- Verificar que la app tenga 'Elevated Access' en developer.twitter.com")
        print("- Revisar que los tokens incluyan permiso 'tweet.write'")
    print("="*60)
