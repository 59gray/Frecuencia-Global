"""Copia un prompt de Gemini al clipboard y abre Gemini en Chrome.

Uso:
    python scripts/copy_prompt_to_clipboard.py PROMPT_P1_001_IG_Cover_v1.md
    python scripts/copy_prompt_to_clipboard.py PROMPT_P1_001_TK_Cover_v1.md
"""

import re
import sys
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
PROMPTS_DIR = REPO_ROOT / "system" / "gemini" / "prompts"


def extract_primary_prompt(prompt_file):
    content = prompt_file.read_text(encoding="utf-8")
    pattern = r"## Primary Prompt\s*\n+\s*```text\s*\n(.*?)\n```"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None


def main():
    if len(sys.argv) < 2:
        print("Uso: python copy_prompt_to_clipboard.py <nombre_prompt.md>")
        sys.exit(1)

    prompt_name = sys.argv[1]
    prompt_file = PROMPTS_DIR / prompt_name
    if not prompt_file.exists():
        print(f"[ERROR] No existe: {prompt_file}")
        sys.exit(1)

    text = extract_primary_prompt(prompt_file)
    if not text:
        print(f"[ERROR] No se encontró prompt en {prompt_file}")
        sys.exit(1)

    # Copy to clipboard
    proc = subprocess.run(["clip"], input=text.encode("utf-8"))
    print(f"[OK] Prompt copiado al clipboard ({len(text)} chars)")
    print()
    print("Instrucciones:")
    print("1. En Gemini, pega (Ctrl+V) el prompt")
    print("2. Genera la imagen")
    print("3. Click derecho en la imagen → Guardar como...")
    print(f"4. Guardar en: {REPO_ROOT / '06_Assets' / 'P1_001'}")
    print()

    # Open Gemini in default browser
    subprocess.Popen(["cmd", "/c", "start", "https://gemini.google.com/app"])
    print("[OK] Gemini abierto en tu navegador")


if __name__ == "__main__":
    main()
