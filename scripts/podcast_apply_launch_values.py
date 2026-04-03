from __future__ import annotations

import argparse
import re
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
N8N_DIR = BASE_DIR / "08_n8n"
PRODUCCION_DIR = BASE_DIR / "04_Produccion"

TARGETS = [
    N8N_DIR / ".env",
    N8N_DIR / ".env.cloud",
]

PUBLISH_READY_PATH = PRODUCCION_DIR / "EP_001_PublishReady.md"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Aplica valores reales de lanzamiento para el podcast.")
    parser.add_argument("--podcast-show-url", required=True, help="URL real del show en RSS.com")
    parser.add_argument("--podcast-rss-url", required=True, help="URL real del feed RSS")
    parser.add_argument("--n8n-api-key", help="API key real de n8n Cloud")
    parser.add_argument("--github-pat", help="GitHub PAT real")
    return parser.parse_args()


def replace_env_key(text: str, key: str, value: str) -> str:
    pattern = re.compile(rf"^{re.escape(key)}=.*$", re.MULTILINE)
    replacement = f"{key}={value}"
    if pattern.search(text):
        return pattern.sub(replacement, text)
    if not text.endswith("\n"):
        text += "\n"
    return text + replacement + "\n"


def update_env_file(path: Path, args: argparse.Namespace) -> None:
    text = path.read_text(encoding="utf-8")
    text = replace_env_key(text, "FG_PODCAST_SHOW_URL", args.podcast_show_url)
    text = replace_env_key(text, "FG_PODCAST_RSS_URL", args.podcast_rss_url)
    if args.n8n_api_key and path.name == ".env.cloud":
        text = replace_env_key(text, "N8N_API_KEY", args.n8n_api_key)
    if args.github_pat and path.name == ".env.cloud":
        text = replace_env_key(text, "GITHUB_PAT", args.github_pat)
    path.write_text(text, encoding="utf-8")


def update_publish_ready(path: Path, args: argparse.Namespace) -> None:
    text = path.read_text(encoding="utf-8")
    replacements = [
        (
            re.compile(r"^\*\*Show principal RSS\.com:\*\* .*$", re.MULTILINE),
            f"**Show principal RSS.com:** {args.podcast_show_url}",
        ),
        (
            re.compile(r"^\*\*Feed RSS principal:\*\* .*$", re.MULTILINE),
            f"**Feed RSS principal:** {args.podcast_rss_url}",
        ),
        (
            re.compile(r"^Podcast en RSS\.com: .*$", re.MULTILINE),
            f"Podcast en RSS.com: {args.podcast_show_url}",
        ),
        (
            re.compile(r"^Feed RSS: .*$", re.MULTILINE),
            f"Feed RSS: {args.podcast_rss_url}",
        ),
    ]
    for pattern, replacement in replacements:
        text = pattern.sub(replacement, text)

    # Actualiza el primer link aislado dentro del bloque de X con la URL real del show.
    text = text.replace(
        "https://rss.com/podcasts/frecuencia-global-podcast",
        args.podcast_show_url,
        1,
    )
    path.write_text(text, encoding="utf-8")


def main() -> None:
    args = parse_args()
    for path in TARGETS:
        update_env_file(path, args)
    update_publish_ready(PUBLISH_READY_PATH, args)
    print("Valores de lanzamiento aplicados.")
    for path in TARGETS + [PUBLISH_READY_PATH]:
        print(path)


if __name__ == "__main__":
    main()
