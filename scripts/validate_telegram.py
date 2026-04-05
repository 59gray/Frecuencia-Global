"""Valida credenciales de Telegram para n8n Cloud.

Uso:
    python scripts/validate_telegram.py --token "123456:ABC..." --chat-id "123456789"

Requisitos:
    pip install requests
"""

import argparse
import sys
import requests

TELEGRAM_API_BASE = "https://api.telegram.org/bot"

def validate_token(token: str) -> bool:
    """Valida que el token sea correcto."""
    url = f"{TELEGRAM_API_BASE}{token}/getMe"
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("ok"):
                bot = data["result"]
                print(f"✅ Token válido")
                print(f"   Bot: @{bot.get('username')}")
                print(f"   Nombre: {bot.get('first_name')}")
                return True
        print(f"❌ Token inválido: {resp.text[:200]}")
        return False
    except Exception as e:
        print(f"❌ Error validando token: {e}")
        return False

def validate_chat_id(token: str, chat_id: str) -> bool:
    """Valida que el chat ID sea correcto y accesible."""
    url = f"{TELEGRAM_API_BASE}{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": "🧪 Validación de configuración Telegram — Frecuencia Global\n\nSi ves este mensaje, la configuración es correcta. ✅",
        "parse_mode": "HTML"
    }
    try:
        resp = requests.post(url, json=payload, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("ok"):
                print(f"✅ Chat ID válido y mensaje enviado")
                print(f"   Message ID: {data['result']['message_id']}")
                return True
        print(f"❌ Chat ID inválido o no accesible: {resp.text[:200]}")
        return False
    except Exception as e:
        print(f"❌ Error validando chat ID: {e}")
        return False

def get_chat_id_from_updates(token: str) -> str | None:
    """Obtiene chat ID desde getUpdates (si hay mensajes previos)."""
    url = f"{TELEGRAM_API_BASE}{token}/getUpdates"
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("ok") and data.get("result"):
                # Buscar el primer mensaje con chat
                for update in data["result"]:
                    if "message" in update and "chat" in update["message"]:
                        chat = update["message"]["chat"]
                        chat_id = chat.get("id")
                        chat_type = chat.get("type")
                        print(f"✅ Chat ID encontrado en updates:")
                        print(f"   ID: {chat_id}")
                        print(f"   Tipo: {chat_type}")
                        if chat.get("username"):
                            print(f"   Username: @{chat.get('username')}")
                        return str(chat_id)
                print("⚠️ No se encontró chat ID en updates. Envía un mensaje al bot primero.")
                return None
        print(f"❌ Error obteniendo updates: {resp.text[:200]}")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Validar credenciales Telegram")
    parser.add_argument("--token", required=True, help="Bot token de BotFather")
    parser.add_argument("--chat-id", help="Chat ID (opcional, si no se proporciona se intenta obtener)")
    parser.add_argument("--auto-get-chat-id", action="store_true", help="Obtener chat ID automáticamente de getUpdates")
    args = parser.parse_args()
    
    print("="*60)
    print("VALIDACIÓN TELEGRAM — Frecuencia Global")
    print("="*60)
    
    # Paso 1: Validar token
    print("\n[Paso 1] Validando token...")
    if not validate_token(args.token):
        sys.exit(1)
    
    # Paso 2: Obtener o validar chat ID
    chat_id = args.chat_id
    if args.auto_get_chat_id or not chat_id:
        print("\n[Paso 2] Obteniendo chat ID desde updates...")
        chat_id = get_chat_id_from_updates(args.token)
        if chat_id:
            print(f"\n👉 Chat ID para configurar: {chat_id}")
        else:
            print("\n⚠️  No se pudo obtener chat ID automáticamente.")
            print("   1. Envía un mensaje a tu bot en Telegram")
            print("   2. Vuelve a ejecutar este script con --auto-get-chat-id")
            sys.exit(1)
    
    # Paso 3: Validar envío de mensaje
    print(f"\n[Paso 3] Validando envío de mensaje a chat ID {chat_id}...")
    if not validate_chat_id(args.token, chat_id):
        sys.exit(1)
    
    print("\n" + "="*60)
    print("✅ CONFIGURACIÓN VÁLIDA")
    print("="*60)
    print(f"\nValores para n8n Cloud:")
    print(f"  TELEGRAM_BOT_TOKEN: {args.token}")
    print(f"  TELEGRAM_CHAT_ID: {chat_id}")
    print(f"\nSiguiente paso:")
    print(f"  1. Configurar credencial en n8n Cloud")
    print(f"  2. Configurar variables de entorno")
    print(f"  3. Probar WF-004")
    print("="*60)

if __name__ == "__main__":
    main()
