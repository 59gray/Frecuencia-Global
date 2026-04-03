from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path

import requests


BASE_DIR = Path(__file__).resolve().parent.parent
PRODUCCION_DIR = BASE_DIR / "04_Produccion"
LOGS_DIR = BASE_DIR / "logs"
DEFAULT_N8N_BASE = "https://frecuenciaglobal.app.n8n.cloud"
DEFAULT_PODCAST_SHOW_URL = "https://rss.com/podcasts/frecuencia-global-podcast"
DEFAULT_PODCAST_RSS_URL = "https://media.rss.com/frecuencia-global-podcast/feed.xml"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Valida un PublishReady y opcionalmente dispara publish-x.")
    parser.add_argument("--pieza", default=os.environ.get("FG_PIEZA", "P1_001"), help="ID de pieza o episodio, por ejemplo P1_001 o EP_001")
    parser.add_argument("--n8n-base", default=os.environ.get("FG_N8N_BASE", DEFAULT_N8N_BASE), help="Base URL de n8n Cloud")
    parser.add_argument("--skip-webhook", action="store_true", help="No dispara /webhook/publish-x")
    return parser.parse_args()


def load_publish_ready(pieza: str) -> tuple[Path, str]:
    path = PRODUCCION_DIR / f"{pieza}_PublishReady.md"
    if not path.exists():
        raise FileNotFoundError(f"No se encontro archivo {path}")
    return path, path.read_text(encoding="utf-8")


def detect_podcast(pieza: str, text: str) -> bool:
    return (
        pieza.startswith("EP_")
        or "## Podcast / RSS / Web" in text
        or "## Podcast / RSS.com / Web" in text
        or "## YouTube Videopodcast" in text
    )


def resolve_podcast_heading(text: str) -> str:
    if "## Podcast / RSS.com / Web" in text:
        return "Podcast / RSS.com / Web"
    return "Podcast / RSS / Web"


def extract_code_block(text: str, heading: str) -> str | None:
    pattern = rf"##\s*{re.escape(heading)}\s*\n```(?:\w+)?\n(.*?)\n```"
    match = re.search(pattern, text, re.DOTALL)
    return match.group(1).strip() if match else None


def extract_section(text: str, heading: str) -> str | None:
    pattern = rf"##\s*{re.escape(heading)}\s*\n(.*?)(?=\n##\s|\n---\n|$)"
    match = re.search(pattern, text, re.DOTALL)
    return match.group(1).strip() if match else None


def extract_field(text: str, label: str) -> str | None:
    pattern = rf"\*\*{re.escape(label)}:\*\*\s*(.+)"
    match = re.search(pattern, text)
    return match.group(1).strip() if match else None


def extract_bullets(section_text: str | None) -> list[str]:
    if not section_text:
        return []
    return [line[2:].strip() for line in section_text.splitlines() if line.strip().startswith("- ")]


def extract_marked_bullets(section_text: str | None, marker: str) -> list[str]:
    if not section_text:
        return []

    items: list[str] = []
    in_block = False
    for line in section_text.splitlines():
        stripped = line.strip()
        if stripped.startswith(marker):
            in_block = True
            continue
        if in_block and stripped.startswith("- "):
            items.append(stripped[2:].strip())
            continue
        if in_block and stripped:
            break
    return items


def build_threads_copy(x_text: str) -> str:
    threads_text = x_text + "\n\nFrecuencia Global conecta analisis internacional, podcast y videopodcast. #FrecuenciaGlobal #Podcast"
    if len(threads_text) > 500:
        threads_text = threads_text[:497] + "..."
    return threads_text


def validate_publish_ready(pieza: str, text: str) -> dict:
    is_podcast = detect_podcast(pieza, text)
    required_sections = ["X (Twitter)", "Instagram", "LinkedIn", "TikTok"]
    if is_podcast:
        required_sections = [resolve_podcast_heading(text), "YouTube Videopodcast"] + required_sections

    present_sections = {}
    missing_sections = []
    for heading in required_sections:
        section = extract_section(text, heading)
        present_sections[heading] = bool(section)
        if not section:
            missing_sections.append(heading)

    x_text = extract_code_block(text, "X (Twitter)") or ""
    tt_text = extract_code_block(text, "TikTok") or ""
    result = {
        "pieza": pieza,
        "is_podcast": is_podcast,
        "missing_sections": missing_sections,
        "x_copy": x_text,
        "x_length": len(x_text),
        "threads_copy": build_threads_copy(x_text) if x_text else "",
        "tiktok_copy": tt_text,
        "tiktok_length": len(tt_text),
        "present_sections": present_sections,
    }

    if is_podcast:
        podcast_section = extract_section(text, resolve_podcast_heading(text))
        youtube_section = extract_section(text, "YouTube Videopodcast")
        chapters = extract_marked_bullets(youtube_section, "**Capitulos sugeridos:**")
        clips = extract_marked_bullets(youtube_section, "**Clips derivados:**")

        result.update(
            {
                "podcast_show_url": extract_field(text, "Show principal") or extract_field(text, "Show principal RSS.com"),
                "podcast_feed_url": extract_field(text, "Feed RSS principal"),
                "editorial_url": extract_field(text, "Pagina editorial") or extract_field(text, "Página editorial"),
                "canonical_url": extract_field(text, "URL canonica") or extract_field(text, "URL canónica"),
                "slug": extract_field(text, "Slug sugerido"),
                "youtube_title": extract_field(text, "Titulo sugerido") or extract_field(text, "Título sugerido"),
                "video_mode": extract_field(text, "Modo de video"),
                "chapters_count": len(chapters),
                "clips_count": len(clips),
                "chapters": chapters,
                "clips": clips,
                "show_notes_present": "**Show notes base:**" in (podcast_section or ""),
            }
        )

    return result


def print_report(report: dict, publish_ready_file: Path) -> None:
    print(f"=== PublishReady ===\n{publish_ready_file}")
    print(f"=== Pieza: {report['pieza']} ===")
    print(f"=== Modo podcast: {'SI' if report['is_podcast'] else 'NO'} ===")

    if report["missing_sections"]:
        print("=== Secciones faltantes ===")
        for heading in report["missing_sections"]:
            print(f"- {heading}")
    else:
        print("=== Secciones requeridas: OK ===")

    if report["is_podcast"]:
        podcast_show_url = report.get("podcast_show_url") or report.get("canonical_url") or DEFAULT_PODCAST_SHOW_URL
        podcast_feed_url = report.get("podcast_feed_url") or DEFAULT_PODCAST_RSS_URL
        print(f"=== Show principal ===\n{podcast_show_url}")
        print(f"=== Feed RSS ===\n{podcast_feed_url}")
        print(f"=== Pagina editorial ===\n{report.get('editorial_url') or report.get('canonical_url') or '[opcional]'}")
        print(f"=== Titulo YouTube ===\n{report.get('youtube_title') or '[no encontrado]'}")
        print(f"=== Modo de video ===\n{report.get('video_mode') or '[no encontrado]'}")
        print(f"=== Chapters: {report.get('chapters_count', 0)} ===")
        print(f"=== Clips derivados: {report.get('clips_count', 0)} ===")

    if report["x_copy"]:
        print("=== X copy a publicar ===")
        print(report["x_copy"])
        print(f"=== Longitud: {report['x_length']} caracteres ===")

    if report["threads_copy"]:
        print("\n=== Threads copy propuesta ===")
        print(report["threads_copy"])
        print(f"=== Longitud: {len(report['threads_copy'])} caracteres ===")


def maybe_call_webhook(n8n_base: str, pieza: str, skip_webhook: bool) -> dict:
    if skip_webhook:
        return {"called": False, "status_code": None, "body": "skip-webhook"}

    webhook_url = f"{n8n_base.rstrip('/')}/webhook/publish-x"
    payload = {"pieza": pieza}
    try:
        response = requests.post(webhook_url, json=payload, timeout=15)
        return {"called": True, "status_code": response.status_code, "body": response.text}
    except Exception as exc:
        return {"called": True, "status_code": None, "body": str(exc)}


def write_log(report: dict, webhook_result: dict) -> Path:
    LOGS_DIR.mkdir(exist_ok=True)
    out_path = LOGS_DIR / f"{report['pieza']}_publish_test.json"
    payload = dict(report)
    payload["webhook"] = webhook_result
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return out_path


def main() -> None:
    args = parse_args()
    publish_ready_file, text = load_publish_ready(args.pieza)
    report = validate_publish_ready(args.pieza, text)
    print_report(report, publish_ready_file)

    webhook_result = maybe_call_webhook(args.n8n_base, args.pieza, args.skip_webhook)
    if webhook_result["called"]:
        print(f"\nCall webhook publish-x -> {webhook_result['status_code']}")
        print(webhook_result["body"])
    else:
        print("\nWebhook publish-x omitido por --skip-webhook")

    out_path = write_log(report, webhook_result)
    print(f"\nArchivo de prueba creado en {out_path}")

    if report["missing_sections"]:
        raise SystemExit(1)

    if report["is_podcast"] and (report.get("chapters_count", 0) == 0 or report.get("clips_count", 0) == 0):
        raise SystemExit("PublishReady de podcast sin chapters o clips derivados")


if __name__ == "__main__":
    main()
