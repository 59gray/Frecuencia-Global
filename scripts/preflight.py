"""Preflight check para Frecuencia Global.

Valida que el entorno local esté listo para operar antes de cada jornada.
Ejecutar desde la raíz del proyecto:

    python scripts/preflight.py
    python scripts/preflight.py --verbose
    python scripts/preflight.py --platform threads

Salida resumida por plataforma: OK / WARN / BLOCKED
"""

import os
import sys
import argparse
from pathlib import Path

# ── Resolución de rutas ────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent

sys.path.insert(0, str(SCRIPT_DIR))
from utils import load_env_local, env_file_exists

# ── Configuración de plataformas ───────────────────────────────────────

PLATFORMS = {
    "threads": {
        "status": "VALIDADO",
        "secrets_required": ["THREADS_ACCESS_TOKEN"],
        "secrets_optional": ["THREADS_USER_ID"],
        "chrome_profile": None,
        "publish_script": "threads_publish_post.py",
        "dry_run_cmd": "python scripts/threads_publish_post.py --pieza P1_001 --dry-run",
        "oauth_files": [],
    },
    "x": {
        "status": "VALIDADO",
        "secrets_required": [],
        "secrets_optional": [],
        "chrome_profile": ".chrome-x-stable",
        "publish_script": "x_publish_post.py",
        "dry_run_cmd": "python scripts/x_publish_post.py --pieza P1_001 --dry-run",
        "oauth_files": [],
    },
    "instagram": {
        "status": "VALIDADO",
        "secrets_required": [],
        "secrets_optional": ["IG_ACCESS_TOKEN", "IG_USER_ID"],
        "chrome_profile": ".chrome-ig-stable",
        "publish_script": "ig_publish_post.py",
        "dry_run_cmd": "python scripts/ig_publish_post.py --pieza P1_001 --dry-run",
        "oauth_files": [],
    },
    "youtube": {
        "status": "VALIDADO",
        "secrets_required": [],
        "secrets_optional": [],
        "chrome_profile": ".chrome-youtube-stable",
        "publish_script": "youtube_channel_api_config.py",
        "dry_run_cmd": None,
        "oauth_files": ["scripts/token.json", "scripts/client_secret.json"],
    },
    "website": {
        "status": "VALIDADO",
        "secrets_required": [],
        "secrets_optional": [],
        "chrome_profile": None,
        "publish_script": None,
        "dry_run_cmd": None,
        "oauth_files": [],
    },
    "linkedin": {
        "status": "BLOQUEADO_EXTERNO",
        "secrets_required": [],
        "secrets_optional": [],
        "chrome_profile": ".chrome-linkedin-stable",
        "publish_script": "linkedin_publish_post.py",
        "dry_run_cmd": None,
        "oauth_files": [],
    },
    "tiktok": {
        "status": "CONGELADO",
        "secrets_required": [],
        "secrets_optional": [],
        "chrome_profile": ".chrome-tiktok-stable",
        "publish_script": "tk_publish_post.py",
        "dry_run_cmd": None,
        "oauth_files": [],
    },
}

# Secretos cross-platform (utilidades compartidas)
CROSS_PLATFORM_SECRETS = {
    "GEMINI_API_KEY": {"used_by": "gemini_api_generate.py", "required": False},
}

# ── Checks individuales ───────────────────────────────────────────────


def check_env_file():
    """Verifica existencia de .env.local."""
    exists = env_file_exists()
    return "OK" if exists else "WARN", exists


def check_secret(key):
    """Verifica si un secret está disponible (env o .env.local)."""
    value = os.getenv(key)
    if value:
        return "OK", f"env ({len(value)} chars)"
    return "MISSING", None


def check_chrome_profile(profile_name):
    """Verifica existencia de perfil de Chrome."""
    if not profile_name:
        return "N/A", None
    profile_path = REPO_ROOT / profile_name
    if profile_path.exists() and any(profile_path.iterdir()):
        return "OK", str(profile_path)
    elif profile_path.exists():
        return "WARN", "directorio vacío"
    return "MISSING", None


def check_publish_ready(pieza="P1_001"):
    """Verifica existencia de archivo PublishReady."""
    pr_path = REPO_ROOT / "04_Produccion" / f"{pieza}_PublishReady.md"
    return "OK" if pr_path.exists() else "WARN", str(pr_path) if pr_path.exists() else None


def check_oauth_files(files):
    """Verifica existencia de archivos OAuth."""
    results = []
    for f in files:
        path = REPO_ROOT / f
        results.append((f, path.exists()))
    all_ok = all(ok for _, ok in results)
    return "OK" if all_ok else "WARN", results


def check_publish_script(script_name):
    """Verifica existencia del script de publicación."""
    if not script_name:
        return "N/A", None
    path = SCRIPT_DIR / script_name
    return "OK" if path.exists() else "MISSING", str(path)


# ── Evaluación por plataforma ─────────────────────────────────────────


def evaluate_platform(name, cfg, verbose=False):
    """Evalúa el estado de una plataforma. Retorna (estado_global, detalles)."""
    details = []
    issues = []

    # Estado declarado
    declared = cfg["status"]
    if declared in ("BLOQUEADO_EXTERNO", "CONGELADO"):
        return declared, [f"Estado declarado: {declared}"]

    # Secretos requeridos
    for key in cfg["secrets_required"]:
        status, info = check_secret(key)
        details.append(f"  {key}: {status}" + (f" ({info})" if info else ""))
        if status == "MISSING":
            issues.append(f"{key} no disponible")

    # Secretos opcionales
    if verbose:
        for key in cfg["secrets_optional"]:
            status, info = check_secret(key)
            details.append(f"  {key}: {status} (opcional)" + (f" ({info})" if info else ""))

    # Chrome profile
    if cfg["chrome_profile"]:
        status, info = check_chrome_profile(cfg["chrome_profile"])
        details.append(f"  Chrome profile: {status}" + (f" ({cfg['chrome_profile']})" if status == "OK" else ""))
        if status == "MISSING":
            issues.append(f"Chrome profile {cfg['chrome_profile']} no existe")

    # OAuth files
    if cfg["oauth_files"]:
        status, file_results = check_oauth_files(cfg["oauth_files"])
        for fname, exists in file_results:
            st = "OK" if exists else "MISSING"
            details.append(f"  {fname}: {st}")
            if not exists:
                issues.append(f"{fname} no encontrado")

    # Script de publicación
    if cfg["publish_script"]:
        status, _ = check_publish_script(cfg["publish_script"])
        if verbose:
            details.append(f"  Script: {status} ({cfg['publish_script']})")
        if status == "MISSING":
            issues.append(f"Script {cfg['publish_script']} no existe")

    # Dry-run disponible
    if cfg["dry_run_cmd"]:
        if verbose:
            details.append(f"  Dry-run: disponible")
    elif verbose:
        details.append(f"  Dry-run: no configurado")

    # Estado global
    if issues:
        global_status = "BLOCKED" if cfg["secrets_required"] and any("no disponible" in i for i in issues) else "WARN"
    else:
        global_status = "OK"

    return global_status, details


# ── Main ──────────────────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(description="Preflight check — Frecuencia Global")
    parser.add_argument("--verbose", "-v", action="store_true", help="Mostrar detalles")
    parser.add_argument("--platform", "-p", help="Validar solo una plataforma")
    parser.add_argument("--pieza", default="P1_001", help="Pieza a verificar (default: P1_001)")
    args = parser.parse_args()

    # Cargar .env.local antes de evaluar
    load_env_local()

    print("=" * 56)
    print("  PREFLIGHT CHECK — Frecuencia Global")
    print("=" * 56)

    # 1. .env.local
    env_status, _ = check_env_file()
    print(f"\n  .env.local: {env_status}")

    # 2. PublishReady
    pr_status, pr_path = check_publish_ready(args.pieza)
    print(f"  PublishReady ({args.pieza}): {pr_status}")

    # 3. Cross-platform secrets
    if args.verbose:
        print(f"\n  --- Secretos compartidos ---")
        for key, info in CROSS_PLATFORM_SECRETS.items():
            status, detail = check_secret(key)
            label = "requerido" if info["required"] else "opcional"
            print(f"  {key}: {status} ({label}, {info['used_by']})")

    # 4. Plataformas
    print(f"\n  --- Plataformas ---")

    platforms_to_check = PLATFORMS
    if args.platform:
        name = args.platform.lower()
        if name not in PLATFORMS:
            print(f"  [ERROR] Plataforma desconocida: {name}")
            sys.exit(1)
        platforms_to_check = {name: PLATFORMS[name]}

    results = {}
    for name, cfg in platforms_to_check.items():
        status, details = evaluate_platform(name, cfg, verbose=args.verbose)
        results[name] = status

        # Formato de salida
        icon = {"OK": "OK", "WARN": "WARN", "BLOCKED": "BLOCKED",
                "BLOQUEADO_EXTERNO": "BLOCKED", "CONGELADO": "FROZEN"}.get(status, status)
        print(f"\n  [{icon:>7}] {name.upper()}")
        if args.verbose or status not in ("OK", "BLOQUEADO_EXTERNO", "CONGELADO"):
            for d in details:
                print(d)

    # 5. Resumen
    ok_count = sum(1 for s in results.values() if s == "OK")
    warn_count = sum(1 for s in results.values() if s == "WARN")
    blocked_count = sum(1 for s in results.values() if s in ("BLOCKED", "BLOQUEADO_EXTERNO"))
    frozen_count = sum(1 for s in results.values() if s == "CONGELADO")

    print(f"\n{'=' * 56}")
    print(f"  RESUMEN: {ok_count} OK | {warn_count} WARN | {blocked_count} BLOCKED | {frozen_count} FROZEN")

    # Dry-run commands disponibles
    if args.verbose:
        print(f"\n  --- Dry-runs disponibles ---")
        for name, cfg in platforms_to_check.items():
            if cfg["dry_run_cmd"] and results.get(name) == "OK":
                print(f"  {name}: {cfg['dry_run_cmd']}")

    print(f"{'=' * 56}\n")

    # Exit code
    has_critical = any(s == "BLOCKED" for s in results.values())
    sys.exit(1 if has_critical else 0)


if __name__ == "__main__":
    main()
