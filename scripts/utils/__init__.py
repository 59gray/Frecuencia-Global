"""Utilidades centralizadas de carga de secretos para Frecuencia Global.

Patrón estándar de resolución:
  1. Variable ya presente en el entorno → usar directamente
  2. Fallback: cargar desde .env.local en raíz del proyecto
  3. Si sigue faltando → error claro y accionable

Uso:
    from utils import get_required_secret, get_optional_secret, load_env_local

    token = get_required_secret("THREADS_ACCESS_TOKEN")   # falla si no existe
    key   = get_optional_secret("GEMINI_API_KEY")          # retorna None si no existe
    load_env_local()                                       # carga masiva
"""

import os
import sys
from pathlib import Path

# Raíz del repo (scripts/utils/ → scripts/ → repo_root)
_REPO_ROOT = Path(__file__).resolve().parent.parent.parent
_ENV_LOADED = False


def load_env_local(env_file=".env.local", force=False):
    """
    Carga variables de entorno desde .env.local si no están ya presentes.

    Args:
        env_file: Nombre del archivo env (default: .env.local)
        force: Si True, carga aunque las variables ya existan

    Returns:
        dict: Variables cargadas {key: value}
    """
    global _ENV_LOADED
    env_path = _REPO_ROOT / env_file

    loaded = {}

    if not env_path.exists():
        return loaded

    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue

        if "=" in line:
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip()

            if value and (force or not os.getenv(key)):
                os.environ[key] = value
                loaded[key] = value

    _ENV_LOADED = True
    return loaded


def _ensure_env_loaded(env_file=".env.local"):
    """Carga .env.local una sola vez por proceso."""
    global _ENV_LOADED
    if not _ENV_LOADED:
        load_env_local(env_file)


def get_required_secret(key, env_file=".env.local"):
    """
    Obtiene un secret requerido del entorno o de .env.local.
    Falla con mensaje claro si no se encuentra.

    Args:
        key: Nombre de la variable requerida
        env_file: Archivo env a usar como fallback

    Returns:
        str: Valor del secret

    Raises:
        SystemExit: Si no se encuentra la variable
    """
    value = os.getenv(key)
    if value:
        return value

    _ensure_env_loaded(env_file)

    value = os.getenv(key)
    if value:
        return value

    env_path = _REPO_ROOT / env_file
    if env_path.exists():
        print(f"[ERROR] {key} no encontrado en entorno ni en {env_file}")
        print(f"        Agrega {key}=<valor> a {env_path}")
    else:
        print(f"[ERROR] {key} no encontrado en entorno y {env_file} no existe")
        print(f"        Crea {env_file} desde .env.local.example y completa {key}")
    sys.exit(1)


def get_optional_secret(key, default=None, env_file=".env.local"):
    """
    Obtiene un secret opcional del entorno o de .env.local.
    Retorna default si no se encuentra (sin fallar).

    Args:
        key: Nombre de la variable
        default: Valor por defecto si no existe
        env_file: Archivo env a usar como fallback

    Returns:
        str | None: Valor del secret o default
    """
    value = os.getenv(key)
    if value:
        return value

    _ensure_env_loaded(env_file)

    return os.getenv(key, default)


def env_file_exists(env_file=".env.local"):
    """Verifica si el archivo .env.local existe en la raíz del proyecto."""
    return (_REPO_ROOT / env_file).exists()


def repo_root():
    """Retorna la raíz del repositorio."""
    return _REPO_ROOT
