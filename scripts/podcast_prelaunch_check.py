from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import date
from pathlib import Path

import requests

from run_publish_test import load_publish_ready, validate_publish_ready


BASE_DIR = Path(__file__).resolve().parent.parent
OPERACIONES_DIR = BASE_DIR / "07_Operaciones"
PRODUCCION_DIR = BASE_DIR / "04_Produccion"
N8N_DIR = BASE_DIR / "08_n8n"
WEBSITE_DIR = BASE_DIR / "website"

ENV_FILES = [N8N_DIR / ".env", N8N_DIR / ".env.cloud"]
PLACEHOLDER_PODCAST_SHOW = "https://rss.com/podcasts/frecuencia-global-podcast"
PLACEHOLDER_PODCAST_FEED = "https://media.rss.com/frecuencia-global-podcast/feed.xml"


@dataclass
class CheckResult:
    label: str
    status: str
    detail: str


def load_env(path: Path) -> dict[str, str]:
    cfg: dict[str, str] = {}
    if not path.exists():
        return cfg
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        cfg[key.strip()] = value.strip()
    return cfg


def merged_env() -> dict[str, str]:
    merged: dict[str, str] = {}
    for path in ENV_FILES:
        merged.update(load_env(path))
    return merged


def check_env(cfg: dict[str, str]) -> list[CheckResult]:
    results: list[CheckResult] = []
    for key in [
        "FG_SITE_URL",
        "FG_WEBSITE_URL",
        "FG_PODCAST_HOST",
        "FG_PODCAST_SLUG",
        "FG_PODCAST_SHOW_URL",
        "FG_PODCAST_RSS_URL",
    ]:
        value = cfg.get(key, "")
        status = "OK" if value else "BLOCKED"
        detail = value or "faltante"
        results.append(CheckResult(f"env:{key}", status, detail))

    show_url = cfg.get("FG_PODCAST_SHOW_URL", "")
    feed_url = cfg.get("FG_PODCAST_RSS_URL", "")
    show_live = False
    if show_url:
        try:
            response = requests.get(show_url, timeout=20)
            body = response.text or ""
            if (
                response.status_code == 200
                and "frecuencia-global-podcast" in body.lower()
                and "media.rss.com/frecuencia-global-podcast/feed.xml" in body.lower()
            ):
                show_live = True
                results.append(CheckResult("podcast_show_real", "OK", show_url))
            elif show_url == PLACEHOLDER_PODCAST_SHOW:
                results.append(CheckResult("podcast_show_real", "PENDING", "slug de marca configurado, pero el show publico no responde como esperado"))
            else:
                results.append(CheckResult("podcast_show_real", "PENDING", show_url or "configurado"))
        except Exception as exc:
            if show_url == PLACEHOLDER_PODCAST_SHOW:
                results.append(CheckResult("podcast_show_real", "PENDING", f"slug de marca configurado, sin confirmacion remota: {exc}"))
            else:
                results.append(CheckResult("podcast_show_real", "PENDING", str(exc)))
    else:
        results.append(CheckResult("podcast_show_real", "PENDING", "faltante"))

    if feed_url:
        try:
            response = requests.get(feed_url, timeout=20)
            if response.status_code == 200 and "<rss" in (response.text or "").lower():
                results.append(CheckResult("podcast_feed_real", "OK", feed_url))
            elif show_live:
                results.append(CheckResult("podcast_feed_real", "PENDING", "feed configurado pero seguira 404 hasta publicar el primer episodio"))
            elif feed_url == PLACEHOLDER_PODCAST_FEED:
                results.append(CheckResult("podcast_feed_real", "PENDING", "sigue con feed placeholder de marca"))
            else:
                results.append(CheckResult("podcast_feed_real", "PENDING", feed_url))
        except Exception as exc:
            if show_live:
                results.append(CheckResult("podcast_feed_real", "PENDING", f"feed configurado; probable activacion tras primer episodio ({exc})"))
            else:
                results.append(CheckResult("podcast_feed_real", "PENDING", str(exc)))
    else:
        results.append(CheckResult("podcast_feed_real", "PENDING", "faltante"))

    api_key = cfg.get("N8N_API_KEY", "")
    github_pat = cfg.get("GITHUB_PAT", "")
    results.append(CheckResult("cloud:n8n_api_key", "PENDING" if not api_key else "OK", "sin API key cloud" if not api_key else "configurada"))
    results.append(CheckResult("cloud:github_pat", "PENDING" if not github_pat else "OK", "sin PAT GitHub" if not github_pat else "configurado"))
    return results


def check_files() -> list[CheckResult]:
    results: list[CheckResult] = []
    required_paths = [
        ("podcast_page", WEBSITE_DIR / "src" / "pages" / "podcast" / "index.astro"),
        ("podcast_feed_route", WEBSITE_DIR / "src" / "pages" / "podcast" / "rss.xml.ts"),
        ("podcast_episode_content", WEBSITE_DIR / "src" / "content" / "podcast" / "frecuencia-global-podcast-ep-001.md"),
        ("workflow_wf001", N8N_DIR / "workflows_cloud" / "WF-001_intake_ideas.json"),
        ("workflow_wf006", N8N_DIR / "workflows_cloud" / "WF-006_preparar_publicacion.json"),
        ("publish_ready_ep001", PRODUCCION_DIR / "EP_001_PublishReady.md"),
        ("tracker", PRODUCCION_DIR / "pipeline_tracker.json"),
    ]
    for label, path in required_paths:
        status = "OK" if path.exists() else "BLOCKED"
        results.append(CheckResult(label, status, str(path)))
    return results


def check_workflow_json() -> list[CheckResult]:
    results: list[CheckResult] = []
    for name in ["WF-001_intake_ideas.json", "WF-006_preparar_publicacion.json"]:
        path = N8N_DIR / "workflows_cloud" / name
        try:
            json.loads(path.read_text(encoding="utf-8"))
            results.append(CheckResult(f"json:{name}", "OK", "valido"))
        except Exception as exc:
            results.append(CheckResult(f"json:{name}", "BLOCKED", str(exc)))
    return results


def check_publish_ready() -> list[CheckResult]:
    results: list[CheckResult] = []
    publish_ready_path, text = load_publish_ready("EP_001")
    report = validate_publish_ready("EP_001", text)
    if report["missing_sections"]:
        results.append(CheckResult("publish_ready_sections", "BLOCKED", ", ".join(report["missing_sections"])))
    else:
        results.append(CheckResult("publish_ready_sections", "OK", str(publish_ready_path)))

    results.append(
        CheckResult(
            "publish_ready_assets",
            "OK" if report.get("chapters_count", 0) >= 1 and report.get("clips_count", 0) >= 1 else "BLOCKED",
            f"chapters={report.get('chapters_count', 0)} clips={report.get('clips_count', 0)}",
        )
    )
    return results


def check_tracker() -> list[CheckResult]:
    results: list[CheckResult] = []
    tracker = json.loads((PRODUCCION_DIR / "pipeline_tracker.json").read_text(encoding="utf-8"))
    ep = tracker.get("EP_001")
    if not ep:
        return [CheckResult("tracker:EP_001", "BLOCKED", "no existe entrada")]
    status = ep.get("estado_actual", "")
    results.append(CheckResult("tracker:EP_001", "OK" if status == "PUBLISH_READY" else "PENDING", f"estado_actual={status}"))
    return results


def summarize(results: list[CheckResult]) -> tuple[str, list[CheckResult]]:
    blocked = [r for r in results if r.status == "BLOCKED"]
    pending = [r for r in results if r.status == "PENDING"]
    if blocked:
        return "NOT_READY", blocked + pending
    if pending:
        return "ALMOST_READY", pending
    return "READY", []


def render_markdown(overall: str, results: list[CheckResult], focus: list[CheckResult]) -> str:
    lines = [
        "# Podcast Prelaunch Status",
        "",
        f"**Fecha:** {date.today().isoformat()}",
        f"**Estado general:** {overall}",
        "",
        "## Checklist tecnico",
        "",
        "| Check | Estado | Detalle |",
        "|-------|--------|---------|",
    ]
    for result in results:
        lines.append(f"| {result.label} | {result.status} | {result.detail} |")

    lines += ["", "## Pendientes reales", ""]
    if focus:
        for item in focus:
            lines.append(f"- `{item.label}` -> {item.detail}")
    else:
        lines.append("- Ninguno")

    lines += [
        "",
        "## Lectura operativa",
        "",
        "- `READY`: podemos publicar.",
        "- `ALMOST_READY`: solo faltan configuraciones externas o claims finales.",
        "- `NOT_READY`: hay bloqueos tecnicos internos previos a la publicacion.",
        "",
    ]
    return "\n".join(lines) + "\n"


def main() -> None:
    cfg = merged_env()
    results: list[CheckResult] = []
    results.extend(check_env(cfg))
    results.extend(check_files())
    results.extend(check_workflow_json())
    results.extend(check_publish_ready())
    results.extend(check_tracker())

    overall, focus = summarize(results)
    report = render_markdown(overall, results, focus)
    out_path = OPERACIONES_DIR / f"Podcast_Prelaunch_Status_{date.today().isoformat()}.md"
    out_path.write_text(report, encoding="utf-8")
    print(report)
    print(f"Reporte guardado en {out_path}")


if __name__ == "__main__":
    main()
