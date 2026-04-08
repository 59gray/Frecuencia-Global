"""Genera imágenes vía Gemini API (sin browser).
Lee prompts desde system/gemini/prompts/ y guarda outputs en system/gemini/outputs/visual/

Uso:
    python scripts/gemini_api_generate.py --prompt PROMPT_P1_001_IG_Cover_v1.md
    python scripts/gemini_api_generate.py --prompt PROMPT_P1_001_TK_Cover_v1.md
    python scripts/gemini_api_generate.py --text "Generate a dark editorial image..."

Requisitos:
    - pip install google-genai
    - GEMINI_API_KEY env var o --api-key flag
"""

import os
import re
import sys
import base64
import argparse
from pathlib import Path
from datetime import datetime

# Autoload de secretos desde .env.local
sys.path.insert(0, str(Path(__file__).parent))
from utils import get_required_secret

from google import genai
from google.genai import types

REPO_ROOT = Path(__file__).parent.parent
PROMPTS_DIR = REPO_ROOT / "system" / "gemini" / "prompts"
OUTPUT_DIR = REPO_ROOT / "system" / "gemini" / "outputs" / "visual"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def extract_primary_prompt(prompt_file: Path) -> str:
    content = prompt_file.read_text(encoding="utf-8")
    pattern = r"## Primary Prompt\s*\n\s*```text\s*\n(.*?)\n```"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(1).strip()
    pattern = r"```text\s*\n(.*?)\n```"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None


def generate_output_name(prompt_file: Path) -> str:
    base = prompt_file.stem.replace("PROMPT_", "FG_")
    date = datetime.now().strftime("%Y%m%d")
    return f"{base}_{date}"


def main():
    parser = argparse.ArgumentParser(description="Generar imágenes via Gemini API")
    parser.add_argument("--prompt", help="Nombre del archivo de prompt")
    parser.add_argument("--text", help="Texto directo del prompt")
    parser.add_argument("--api-key", help="Gemini API key")
    parser.add_argument("--model", default="imagen-4.0-generate-001", help="Modelo a usar")
    parser.add_argument("--aspect", default="4:5", help="Aspect ratio (3:4, 4:5, 9:16, 1:1, 16:9)")
    parser.add_argument("--count", type=int, default=2, help="Número de imágenes a generar")
    parser.add_argument("--pieza", help="Fuerza la carpeta destino (ej: P1_002)")
    args = parser.parse_args()

    api_key = args.api_key or get_required_secret("GEMINI_API_KEY")

    # Get prompt
    if args.prompt:
        prompt_file = PROMPTS_DIR / args.prompt
        if not prompt_file.exists():
            print(f"[ERROR] No existe: {prompt_file}")
            sys.exit(1)
        prompt_text = extract_primary_prompt(prompt_file)
        if not prompt_text:
            print(f"[ERROR] No se encontró prompt en {prompt_file}")
            sys.exit(1)
        output_name = generate_output_name(prompt_file)

        if args.pieza:
            pieza = args.pieza
        else:
            match = re.search(r"(P[0-9]_[0-9]{3})", args.prompt)
            pieza = match.group(1) if match else "misc"
        print(f"[INFO] Prompt: {args.prompt} ({len(prompt_text)} chars)")
    elif args.text:
        prompt_text = args.text
        output_name = f"FG_manual_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        pieza = args.pieza or "misc"
    else:
        print("[ERROR] Especifica --prompt o --text")
        sys.exit(1)

    assets_dir = REPO_ROOT / "06_Assets" / pieza
    assets_dir.mkdir(parents=True, exist_ok=True)

    client = genai.Client(api_key=api_key)
    is_imagen = "imagen" in args.model.lower()
    print(f"[INFO] Modelo: {args.model} | Aspect: {args.aspect} | Count: {args.count}")
    print("[INFO] Generando imagen...")

    try:
        if is_imagen:
            # Imagen 4.0 dedicated image generation
            response = client.models.generate_images(
                model=args.model,
                prompt=prompt_text,
                config=types.GenerateImagesConfig(
                    number_of_images=args.count,
                    aspect_ratio=args.aspect,
                ),
            )
            saved = []
            for i, img in enumerate(response.generated_images):
                filename = f"{output_name}_{i}.png"
                out_path = OUTPUT_DIR / filename
                img.image.save(str(out_path))
                saved.append(out_path)
                print(f"[OK] Guardado: {out_path}")

                asset_path = assets_dir / filename
                img.image.save(str(asset_path))
                print(f"[OK] Copiado a: {asset_path}")

        else:
            # Gemini multimodal (flash-image)
            response = client.models.generate_content(
                model=args.model,
                contents=prompt_text,
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE", "TEXT"],
                ),
            )
            saved = []
            for i, part in enumerate(response.candidates[0].content.parts):
                if part.inline_data and part.inline_data.mime_type.startswith("image/"):
                    ext = part.inline_data.mime_type.split("/")[1].replace("jpeg", "jpg")
                    filename = f"{output_name}_{i}.{ext}"
                    out_path = OUTPUT_DIR / filename
                    with open(out_path, "wb") as f:
                        f.write(part.inline_data.data)
                    saved.append(out_path)
                    print(f"[OK] Guardado: {out_path}")

                    asset_path = assets_dir / filename
                    with open(asset_path, "wb") as f:
                        f.write(part.inline_data.data)
                    print(f"[OK] Copiado a: {asset_path}")
                elif part.text:
                    print(f"[TEXT] {part.text[:200]}")

        if saved:
            print(f"\n✅ {len(saved)} imagen(es) generada(s)")
        else:
            print("[WARN] No se generaron imágenes.")

    except Exception as e:
        print(f"[ERROR] {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
