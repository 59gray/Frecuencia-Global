#!/usr/bin/env python3
"""
Configura el token de Instagram para Frecuencia Global.
Este script guía la generación del token desde Meta for Developers.
"""

import os
import sys
import json
import requests
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
ENV_FILE = REPO_ROOT / "08_n8n" / ".env"

def check_ig_account_type():
    """Verificar si la cuenta es Business/Creator (requerido para API)."""
    print("="*60)
    print("CONFIGURACIÓN DE TOKEN DE INSTAGRAM")
    print("="*60)
    print("\n📋 PASO 1: Verificar tipo de cuenta")
    print("   - Abre Instagram app → Perfil → Menú (3 líneas)")
    print("   - Configuración → Cuenta → Cambiar a cuenta profesional")
    print("   - Selecciona: Creator (Creador) o Business (Empresa)")
    print("\n   Estado requerido: Creator o Business ✅")
    print("   Estado personal: Necesita conversión ❌")
    
def generate_token_instructions():
    """Instrucciones para generar token desde Meta for Developers."""
    print("\n📋 PASO 2: Generar Access Token")
    print("   1. Ve a: https://developers.facebook.com/tools/explorer/")
    print("   2. Selecciona app: 'Frecuencia Global Publisher'")
    print("   3. En 'User or Page', selecciona tu cuenta Instagram")
    print("   4. Agrega permisos:")
    print("      ✓ instagram_basic")
    print("      ✓ instagram_content_publish")
    print("   5. Click 'Generate Access Token'")
    print("   6. Copia el token (comienza con EAA...)")
    
def save_token_to_env(token):
    """Guardar token en archivo .env."""
    print(f"\n📋 PASO 3: Guardar token")
    
    if not ENV_FILE.exists():
        print(f"   ❌ No existe: {ENV_FILE}")
        return False
    
    content = ENV_FILE.read_text(encoding='utf-8')
    
    # Verificar si ya existe IG_ACCESS_TOKEN
    if 'IG_ACCESS_TOKEN=' in content:
        # Reemplazar existente
        import re
        content = re.sub(r'IG_ACCESS_TOKEN=.*\n?', f'IG_ACCESS_TOKEN={token}\n', content)
    else:
        # Agregar al final
        content += f"\n# --- Instagram API ---\nIG_ACCESS_TOKEN={token}\nIG_USER_ID=24263988463298387\n"
    
    ENV_FILE.write_text(content, encoding='utf-8')
    print(f"   ✅ Token guardado en: {ENV_FILE}")
    return True

def test_token(token):
    """Probar token con Instagram Graph API."""
    print(f"\n📋 PASO 4: Verificar token")
    
    url = f"https://graph.instagram.com/v22.0/me?fields=id,username&access_token={token}"
    
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Token válido!")
            print(f"   📊 Cuenta: @{data.get('username')} (ID: {data.get('id')})")
            return True
        else:
            print(f"   ❌ Error: {response.status_code}")
            print(f"      {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
        return False

def main():
    check_ig_account_type()
    generate_token_instructions()
    
    print("\n" + "="*60)
    print("INGRESA TU TOKEN DE INSTAGRAM")
    print("="*60)
    print("Pega el token aquí (EAA...) y presiona Enter:")
    
    token = input("> ").strip()
    
    if not token.startswith("EAA"):
        print("   ❌ Token inválido. Debe comenzar con 'EAA'")
        sys.exit(1)
    
    if save_token_to_env(token):
        if test_token(token):
            print("\n" + "="*60)
            print("🎉 CONFIGURACIÓN COMPLETADA")
            print("="*60)
            print("\nPuedes ejecutar la prueba con:")
            print("   python scripts/ig_api_publish.py --pieza P1_001 --dry-run")
        else:
            print("\n⚠️ Token guardado pero no se pudo verificar.")
    else:
        print("\n❌ No se pudo guardar el token.")
        sys.exit(1)

if __name__ == "__main__":
    main()
