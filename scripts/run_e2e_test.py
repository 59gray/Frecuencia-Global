"""Test E2E: local → bridge → n8n Cloud → Telegram

Valida la integración completa del sistema de publicación FG.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

import requests

BASE_DIR = Path(__file__).resolve().parent.parent
LOGS_DIR = BASE_DIR / "logs"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Test E2E: local → bridge → n8n Cloud → Telegram"
    )
    parser.add_argument(
        "--bridge-url",
        default=os.environ.get("FG_BRIDGE_URL", ""),
        help="URL del bridge local (cloudflared tunnel)",
    )
    parser.add_argument(
        "--n8n-base",
        default=os.environ.get("FG_N8N_BASE", "https://frecuenciaglobal.app.n8n.cloud"),
        help="Base URL de n8n Cloud",
    )
    parser.add_argument(
        "--skip-bridge",
        action="store_true",
        help="Saltar test de bridge",
    )
    return parser.parse_args()


def test_bridge(bridge_url: str) -> dict:
    """Test de conectividad al bridge local."""
    if not bridge_url:
        return {"ok": False, "error": "FG_BRIDGE_URL no configurado"}

    try:
        # Health check simple
        response = requests.get(f"{bridge_url}/health", timeout=10)
        return {
            "ok": response.status_code == 200,
            "status_code": response.status_code,
            "response": response.text[:200] if response.text else None,
        }
    except requests.exceptions.RequestException as e:
        return {"ok": False, "error": str(e)}


def test_n8n_cloud(n8n_base: str) -> dict:
    """Test de conectividad a n8n Cloud (webhook de prueba)."""
    try:
        # Intento de POST a webhook de intake (dry-run)
        url = f"{n8n_base}/webhook/intake"
        payload = {
            "titulo": f"E2E Test {datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "pilar": "FG",
            "angulo": "Test E2E de integración",
            "formato": "thread",
            "plataformas": "Telegram",
            "autor": "E2E",
            "deadline": datetime.now().strftime("%Y-%m-%d"),
        }
        response = requests.post(url, json=payload, timeout=30)
        return {
            "ok": response.status_code in (200, 201),
            "status_code": response.status_code,
            "response_snippet": response.text[:500] if response.text else None,
        }
    except requests.exceptions.RequestException as e:
        return {"ok": False, "error": str(e)}


def test_telegram_direct() -> dict:
    """Test de conectividad directa a Telegram API."""
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    if not token or token == "TU_TOKEN_AQUI":
        return {"ok": False, "error": "TELEGRAM_BOT_TOKEN no configurado"}

    try:
        url = f"https://api.telegram.org/bot{token}/getMe"
        response = requests.get(url, timeout=10)
        data = response.json()
        return {
            "ok": data.get("ok", False),
            "status_code": response.status_code,
            "bot_username": data.get("result", {}).get("username") if data.get("ok") else None,
        }
    except requests.exceptions.RequestException as e:
        return {"ok": False, "error": str(e)}


def main() -> int:
    args = parse_args()
    LOGS_DIR.mkdir(exist_ok=True)

    report = {
        "started_at": datetime.now().isoformat(),
        "config": {
            "bridge_url": args.bridge_url or "NO CONFIGURADO",
            "n8n_base": args.n8n_base,
        },
        "tests": {},
        "overall_ok": True,
    }

    print("=" * 60)
    print("TEST E2E: Local → Bridge → n8n Cloud → Telegram")
    print("=" * 60)

    # 1. Test Bridge
    if args.skip_bridge:
        print("\n⚠️  Bridge: SKIPPED (--skip-bridge)")
        report["tests"]["bridge"] = {"ok": None, "skipped": True}
    else:
        print("\n🔍 Test 1/3: Bridge local...")
        bridge_result = test_bridge(args.bridge_url)
        report["tests"]["bridge"] = bridge_result
        if bridge_result["ok"]:
            print("   ✅ PASS: Bridge responde correctamente")
        else:
            print(f"   ❌ FAIL: {bridge_result.get('error', 'Unknown error')}")
            report["overall_ok"] = False

    # 2. Test n8n Cloud
    print("\n🔍 Test 2/3: n8n Cloud...")
    n8n_result = test_n8n_cloud(args.n8n_base)
    report["tests"]["n8n_cloud"] = n8n_result
    if n8n_result["ok"]:
        print("   ✅ PASS: n8n Cloud responde correctamente")
    else:
        print(f"   ❌ FAIL: {n8n_result.get('error', f'HTTP {n8n_result.get('status_code')}')}")
        report["overall_ok"] = False

    # 3. Test Telegram Directo (n8n Cloud Telegram no testeable desde fuera - SUB-002 usa executeWorkflowTrigger)
    print("\n🔍 Test 3/3: Telegram API directo...")
    tg_result = test_telegram_direct()
    report["tests"]["telegram_direct"] = tg_result
    if tg_result["ok"]:
        print(f"   ✅ PASS: Telegram responde (@{tg_result.get('bot_username')})")
    else:
        print(f"   ❌ FAIL: {tg_result.get('error', 'Unknown error')}")
        report["overall_ok"] = False

    # Nota: Telegram vía n8n (SUB-002) no se testea directamente porque usa executeWorkflowTrigger
    # (solo ejecutable desde otros workflows internos, no desde HTTP externo)
    # SUB-002 se valida indirectamente cuando WF-004 lo llama durante logging
    print("\n⚠️  SUB-002 (Telegram vía n8n): SKIPPED (internal subworkflow)")
    print("   ℹ️  Nota: SUB-002 usa executeWorkflowTrigger - no expone endpoint HTTP")
    print("   ℹ️  Validación indirecta: se ejecuta cuando WF-004 lo invoca para notificaciones")
    report["tests"]["telegram_via_n8n"] = {
        "ok": None,
        "skipped": True,
        "reason": "SUB-002 uses executeWorkflowTrigger - internal subworkflow, not externally callable. Validate indirectly via WF-004"
    }

    # Report final
    report["finished_at"] = datetime.now().isoformat()
    report["overall_ok"] = report["overall_ok"] and (
        report["tests"].get("telegram_direct", {}).get("ok", False) or
        report["tests"].get("n8n_cloud", {}).get("ok", False)
    )

    # Guardar reporte
    stamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    out_path = LOGS_DIR / f"e2e_test_{stamp}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    # Output final
    print("\n" + "=" * 60)
    if report["overall_ok"]:
        print("🎉 RESULTADO: PASS — Integración E2E operativa")
        print(f"📄 Reporte guardado: {out_path}")
        return 0
    else:
        print("⚠️  RESULTADO: PARTIAL — Algunos componentes no responden")
        print(f"📄 Reporte guardado: {out_path}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
