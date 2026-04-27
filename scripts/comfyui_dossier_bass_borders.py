#!/usr/bin/env python3
"""
ComfyUI Dossier Generation — Bass & Borders
Serena + ComfyUI pipeline for visual asset generation
Date: 2026-04-26
"""

import urllib.request
import json
import time
import sys
from pathlib import Path

COMFYUI_URL = "http://127.0.0.1:8000"
CKPT = "sdxl\\sd_xl_base_1.0.safetensors"

# Target output
# Script lives in repo/scripts, so repo root is parent.parent
WEBSITE_ROOT = Path(__file__).parent.parent / "website"
TARGET_DIR = WEBSITE_ROOT / "public" / "images" / "dossiers"
TARGET_FILE = "bass-borders-detroit-berghain-dossier.png"

# Ensure target dir exists
TARGET_DIR.mkdir(parents=True, exist_ok=True)

# Prompts from COMFYUI_DOSSIER_PROMPT.md
POSITIVE = (
    "cinematic industrial city at night, corrugated factory hall on the left, transmission pole and overhead signal cables, "
    "wet asphalt with cyan reflections and side steam duct, concrete massive wall on the right, "
    "closed heavy metal door and narrow corridor perspective, restricted magenta violet point light on threshold, "
    "cyan signal line crossing from left to right and compressing at the entrance, "
    "clear split composition, no literal fusion, tension between open production and controlled access, "
    "electric cyan frequency glow, magenta accent light beam, metal infrastructure textures, "
    "high contrast film grain cinematic still, no text no people no logos, "
    "dark background near black, realistic environment scene, threshold as power concept, "
    "signal as architecture connecting two urban nodes, wide format 16:9, mature cinematic mood, "
    "Afrofuturism inspired, future active not nostalgic, concrete and metal materiality, "
    "city skyline distant and abstracted not recognizable, antenna transmission visual, "
    "cool temperature with warm magenta counterpoint, asphalt texture vapor mist, "
    "geometric no figurative, pure environmental scene, no signage no typography no labels, no EDM festival no crowd no hands up, "
    "refined composition balanced asymmetric, no Berghain facade no Detroit landmarks, "
    "no pastel no cartoon no stock photo look, no vaporwave cliché"
)

NEGATIVE = (
    "text watermark logo brand name letters words typography subtitles captions title card, "
    "ORIGEN UMBRAL fabrica radio senal memoria puerta filtro acceso autoridad, "
    "person face crowd hands up identifiable celebrity, "
    "festival confetti colorful neon generic EDM party, "
    "Berlin Brandenburg gate Detroit Renaissance Center Berghain facade recognizable landmark, "
    "pastel colors cartoon illustration overexposed low contrast generic stock, "
    "blurry low resolution deformed anatomy extra limbs distorted, "
    "club scene explicit party scene DJ turntable DJs performer booth dancefloor action, "
    "ruin industrial collapse melancholy passive nostalgia, "
    "bright saturated candy colors pastoral peaceful, "
    "watermark artifact compression error pixelated, "
    "vaporwave grid sunset retro synthwave poster style, "
    "ui overlay hud lower third infographic labels annotations street signs billboards, "
    "generic skyline wallpaper stock image look"
)


def build_workflow(positive, negative, seed, width, height):
    """ComfyUI workflow structure for dossier generation."""
    return {
        "4": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {"ckpt_name": CKPT}
        },
        "5": {
            "class_type": "EmptyLatentImage",
            "inputs": {"width": width, "height": height, "batch_size": 1}
        },
        "6": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": positive, "clip": ["4", 1]}
        },
        "7": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": negative, "clip": ["4", 1]}
        },
        "3": {
            "class_type": "KSampler",
            "inputs": {
                "seed": seed,
                "steps": 32,
                "cfg": 8.0,
                "sampler_name": "dpmpp_2m",
                "scheduler": "karras",
                "denoise": 1.0,
                "model": ["4", 0],
                "positive": ["6", 0],
                "negative": ["7", 0],
                "latent_image": ["5", 0]
            }
        },
        "8": {
            "class_type": "VAEDecode",
            "inputs": {"samples": ["3", 0], "vae": ["4", 2]}
        },
        "9": {
            "class_type": "SaveImage",
            "inputs": {"images": ["8", 0], "filename_prefix": "FG_DOSSIER_BASS_BORDERS"}
        }
    }


def queue_prompt(workflow):
    """Queue prompt to ComfyUI and return prompt_id."""
    payload = json.dumps({"prompt": workflow}).encode("utf-8")
    req = urllib.request.Request(
        f"{COMFYUI_URL}/prompt",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            return result.get("prompt_id", ""), None
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            err = json.loads(body)
            details = []
            for nid, nerr in err.get("node_errors", {}).items():
                for e2 in nerr["errors"]:
                    details.append(f"node {nid}: {e2['details'][:300]}")
            return "", "\n".join(details) or body[:300]
        except Exception:
            return "", body[:300]


def wait_for_prompt(prompt_id, timeout=600):
    """Poll history until prompt completes and return output filenames."""
    start = time.time()
    while time.time() - start < timeout:
        req = urllib.request.Request(f"{COMFYUI_URL}/history/{prompt_id}", method="GET")
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                history = json.loads(resp.read().decode("utf-8"))
                if prompt_id in history:
                    outputs = history[prompt_id].get("outputs", {})
                    for nid, out in outputs.items():
                        if "images" in out:
                            return [img["filename"] for img in out["images"]]
                    return []
        except Exception as e:
            print(f"[WARN] Poll error: {e}")
        time.sleep(3)
    return None


def find_comfyui_output():
    """Locate ComfyUI output directory."""
    candidates = [
        Path(r"D:\FrecuenciaGlobal\ComfyUI\output"),
        Path(r"C:\Users\farid\ComfyUI\output"),
        Path(r"D:\ComfyUI\output"),
        Path(r"C:\ComfyUI\output"),
    ]
    for p in candidates:
        if p.exists():
            return p
    return None


def main():
    print("=" * 70)
    print("COMFYUI DOSSIER GENERATION — Bass & Borders (Serena → ComfyUI)")
    print("=" * 70)

    # Check ComfyUI availability
    try:
        req = urllib.request.Request(f"{COMFYUI_URL}/system_stats", method="GET")
        with urllib.request.urlopen(req, timeout=5) as resp:
            stats = json.loads(resp.read().decode("utf-8"))
            print(f"\n[OK] ComfyUI available at {COMFYUI_URL}")
            print(f"  System: {stats}")
    except Exception as e:
        print(f"\n[ERROR] ComfyUI not available: {e}")
        print("BLOCKED — No fallback. Exiting.")
        sys.exit(1)

    # Second allowed attempt with stricter anti-text negatives
    seed = 2046
    width, height = 1920, 1080

    print(f"\n[BUILD] Workflow: {width}x{height}, seed={seed}")
    workflow = build_workflow(POSITIVE, NEGATIVE, seed, width, height)

    print(f"[QUEUE] Sending to ComfyUI...")
    prompt_id, err = queue_prompt(workflow)
    if err:
        print(f"[ERROR] Queue failed: {err}")
        sys.exit(1)
    print(f"[QUEUED] Prompt ID: {prompt_id}")

    print(f"[WAIT] Waiting for generation (timeout: 10 min)...")
    files = wait_for_prompt(prompt_id, timeout=600)

    if files is None:
        print("[ERROR] Generation timeout")
        sys.exit(1)

    if not files:
        print("[ERROR] No output files generated")
        sys.exit(1)

    print(f"[DONE] Generated: {files}")

    # Find and copy ComfyUI output
    comfy_output = find_comfyui_output()
    if not comfy_output:
        print("[ERROR] Cannot locate ComfyUI output directory")
        print("[INFO] Searched: D:\\FrecuenciaGlobal\\ComfyUI\\output, C:\\Users\\farid\\ComfyUI\\output, etc.")
        sys.exit(1)

    print(f"[COPY] Source ComfyUI output: {comfy_output}")

    copied_file = None
    for fname in files:
        src = comfy_output / fname
        if src.exists():
            dst = TARGET_DIR / TARGET_FILE
            try:
                with open(src, "rb") as f_src:
                    with open(dst, "wb") as f_dst:
                        f_dst.write(f_src.read())
                print(f"[OK] Copied: {fname}")
                print(f"     To:     {dst}")
                copied_file = dst
            except Exception as e:
                print(f"[ERROR] Copy failed: {e}")
                sys.exit(1)
        else:
            print(f"[WARN] Not found in ComfyUI output: {fname}")

    if not copied_file:
        print("[ERROR] No files copied to target location")
        sys.exit(1)

    # Verify file
    if not copied_file.exists():
        print(f"[ERROR] Target file does not exist: {copied_file}")
        sys.exit(1)

    file_size = copied_file.stat().st_size
    if file_size < 1000:
        print(f"[ERROR] Target file too small ({file_size} bytes) — likely corrupted")
        sys.exit(1)

    print(f"\n[SUCCESS] Asset generated and deployed:")
    print(f"  Path:     {copied_file}")
    print(f"  Size:     {file_size:,} bytes")
    print(f"  Seed:     {seed}")
    print(f"  Model:    {CKPT}")

    # Log metadata
    log_file = TARGET_DIR / "bass-borders-detroit-berghain-dossier.meta.json"
    metadata = {
        "generated": time.strftime("%Y-%m-%d %H:%M:%S"),
        "asset_file": TARGET_FILE,
        "method": "Serena + ComfyUI",
        "seed": seed,
        "model": CKPT,
        "width": width,
        "height": height,
        "steps": 32,
        "cfg": 8.0,
        "sampler": "dpmpp_2m",
        "scheduler": "karras",
        "file_size": file_size,
        "comfyui_url": COMFYUI_URL,
        "prompt_id": prompt_id
    }
    with open(log_file, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"  Metadata: {log_file}")

    print("\n[OK] Dossier visual asset generation COMPLETE")
    sys.exit(0)


if __name__ == "__main__":
    main()
