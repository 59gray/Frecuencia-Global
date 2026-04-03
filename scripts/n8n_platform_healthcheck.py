"""Healthcheck para n8n Cloud y superficies publicas de podcast."""

from __future__ import annotations

import os
from pathlib import Path

import requests

try:
    from fg_automation_config import (
        WEBSITE_URL as DEFAULT_WEBSITE_URL,
        PODCAST_RSS_URL as DEFAULT_PODCAST_RSS_URL,
        PODCAST_SHOW_URL as DEFAULT_PODCAST_SHOW_URL,
    )
except Exception:
    DEFAULT_WEBSITE_URL = "https://website-three-rho-26.vercel.app"
    DEFAULT_PODCAST_RSS_URL = ""
    DEFAULT_PODCAST_SHOW_URL = ""


ENV_PATH = Path(__file__).resolve().parent.parent / "08_n8n" / ".env.cloud"
DEFAULT_BASE_URL = "https://frecuenciaglobal.app.n8n.cloud"

REQUIRED_API_VARS = [
    "N8N_BASE_URL",
    "N8N_API_KEY",
    "GITHUB_OWNER",
    "GITHUB_REPO",
    "GITHUB_BRANCH",
    "GITHUB_PAT",
]

CORE_API_WORKFLOWS = [
    "WF-001 - Intake Ideas (Cloud)",
    "WF-002 - Registro Brief (Cloud)",
    "WF-003 - QA Final (Cloud)",
    "WF-005 - Weekly Automation Scheduler",
    "WF-006 - Preparar Publicacion (Cloud)",
]

SOCIAL_WORKFLOWS = [
    "WF-007 - Publicar en X (Cloud)",
    "WF-008 - Publicar en Instagram (Cloud)",
    "WF-009 - Publicar en LinkedIn (Cloud)",
    "WF-010 - Publicar en TikTok (Cloud)",
]

CORE_NOAPI_CHECKS = [
    ("WF-001", "/webhook/intake", {}, "titulo y pilar son requeridos"),
    ("WF-002", "/webhook/register-brief", {}, "campos requeridos: pieza, estado"),
    ("WF-003", "/webhook/qa", {}, "campo requerido: pieza"),
    ("WF-006", "/webhook/prepare-publish", {}, "campo requerido: pieza"),
]

def load_env(path: Path) -> dict[str, str]:
    cfg: dict[str, str] = {}
    if not path.exists():
        return cfg

    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            cfg[key.strip()] = value.strip()
    return cfg


def short_body(text: str | None, limit: int = 180) -> str:
    text = (text or "").replace("\n", " ").strip()
    if len(text) <= limit:
        return text
    return text[: limit - 3] + "..."


def classify_noapi_response(response: requests.Response, expected_snippet: str) -> str:
    body = (response.text or "").lower()
    if response.status_code == 404 or "not registered" in body or "webhook is not registered" in body:
        return "INACTIVE"
    if expected_snippet.lower() in body:
        return "LIVE"
    if response.status_code < 500:
        return "LIVE?"
    return "ERROR"


def classify_surface_response(response: requests.Response, expected_snippet: str) -> str:
    body = (response.text or "").lower()
    if response.status_code in (401, 403):
        return "PROTECTED"
    if response.status_code == 200 and expected_snippet.lower() in body:
        return "LIVE"
    if response.status_code < 500:
        return "LIVE?"
    return "ERROR"


def print_workflow_statuses(names: dict[str, dict], workflow_names: list[str], title: str) -> None:
    print(title)
    for workflow_name in workflow_names:
        if workflow_name not in names:
            print(f"[MISSING] {workflow_name}")
            continue
        workflow = names[workflow_name]
        status = "ACTIVE" if workflow.get("active") else "INACTIVE"
        print(f"[{status}] {workflow_name} (id {workflow['id']})")
    print()


def run_podcast_surface_check(cfg: dict[str, str]) -> None:
    explicit_show_url = (cfg.get("FG_PODCAST_SHOW_URL") or os.environ.get("FG_PODCAST_SHOW_URL") or "").strip()
    explicit_rss_url = (cfg.get("FG_PODCAST_RSS_URL") or os.environ.get("FG_PODCAST_RSS_URL") or "").strip()
    podcast_show_url = explicit_show_url or DEFAULT_PODCAST_SHOW_URL
    podcast_rss_url = explicit_rss_url or DEFAULT_PODCAST_RSS_URL
    website_url = (cfg.get("FG_WEBSITE_URL") or os.environ.get("FG_WEBSITE_URL") or DEFAULT_WEBSITE_URL).rstrip("/")

    checks: list[tuple[str, str, str]] = []
    if not explicit_show_url:
        print(f"[PLACEHOLDER] FG_PODCAST_SHOW_URL no esta configurada. Usando slug provisional de marca: {podcast_show_url}")
    if explicit_show_url and "[" not in podcast_show_url:
        checks.append(("Podcast show (RSS.com)", podcast_show_url, "<html"))
    if not explicit_rss_url:
        print(f"[PLACEHOLDER] FG_PODCAST_RSS_URL no esta configurada. Usando feed provisional de marca: {podcast_rss_url}")
    if explicit_rss_url and "[" not in podcast_rss_url:
        checks.append(("Podcast feed (RSS.com)", podcast_rss_url, "<rss"))
    checks.append(("Podcast page editorial", f"{website_url}/podcast/", "<html"))

    print("Superficies publicas del podcast\n")

    for label, url, expected_snippet in checks:
        try:
            response = requests.get(url, timeout=20)
            status = classify_surface_response(response, expected_snippet)
            preview = short_body(response.text)
            print(f"[{status}] {label} -> {response.status_code} {preview}")
        except Exception as exc:
            print(f"[ERROR] {label} -> {exc}")
    print()


def run_core_noapi_check(cfg: dict[str, str]) -> None:
    base_url = (cfg.get("N8N_BASE_URL") or DEFAULT_BASE_URL).rstrip("/")
    print(f"Modo sin API: comprobando core por webhooks publicos en {base_url}\n")

    for workflow_name, path, payload, expected_snippet in CORE_NOAPI_CHECKS:
        url = f"{base_url}{path}"
        try:
            response = requests.post(url, json=payload, timeout=20)
            status = classify_noapi_response(response, expected_snippet)
            preview = short_body(response.text)
            print(f"[{status}] {workflow_name} -> {response.status_code} {preview}")
        except Exception as exc:
            print(f"[ERROR] {workflow_name} -> {exc}")

    print("[MANUAL] WF-005 -> es un schedule trigger, no tiene webhook publico para verificarlo sin login o API.")
    print("\nTip: si el UI muestra 'Published' en WF-005 y los cuatro webhooks de arriba responden, el core esta practicamente vivo.\n")
    run_podcast_surface_check(cfg)


def run_social_api_check(cfg: dict[str, str]) -> None:
    missing = [key for key in REQUIRED_API_VARS if not cfg.get(key) or "xxxxxxxx" in cfg.get(key, "")]
    if missing:
        print("No hay API key util. Paso a modo sin API.\n")
        run_core_noapi_check(cfg)
        return

    base_url = cfg["N8N_BASE_URL"].rstrip("/")
    token = cfg["N8N_API_KEY"]
    headers = {"X-N8N-API-KEY": token, "Content-Type": "application/json"}

    print(f"Conectando a n8n por API: {base_url}\n")

    try:
        response = requests.get(f"{base_url}/api/v1/workflows", headers=headers, timeout=15)
        response.raise_for_status()
    except Exception as exc:
        print(f"Fallo conectar con n8n API: {exc}")
        print("Paso a modo sin API.\n")
        run_core_noapi_check(cfg)
        return

    workflows = response.json()
    names = {workflow["name"]: workflow for workflow in workflows}

    print_workflow_statuses(names, CORE_API_WORKFLOWS, "Estado workflows core:")
    print_workflow_statuses(names, SOCIAL_WORKFLOWS, "Estado workflows sociales:")

    print("Variables sociales:")
    for key in ["IG_PUBLISH_WEBHOOK_URL", "TIKTOK_PUBLISH_WEBHOOK_URL", "LINKEDIN_AUTHOR_URN"]:
        value = cfg.get(key, "")
        if value:
            print(f"[SET] {key} = {value}")
        else:
            print(f"[MISSING] {key}")

    print("\nComprobacion extra del core sin API:")
    run_core_noapi_check(cfg)


def main() -> None:
    cfg = load_env(ENV_PATH)
    run_social_api_check(cfg)


if __name__ == "__main__":
    main()
