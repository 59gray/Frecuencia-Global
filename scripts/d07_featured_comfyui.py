import urllib.request
import json
import time
import sys
import shutil
from pathlib import Path

COMFYUI_URL = "http://127.0.0.1:8000"
CKPT = "sdxl\\sd_xl_base_1.0.safetensors"
OUTPUT_DIR = Path(r"D:\FrecuenciaGlobal\AV\Detroit\D07_Featured_Redesign")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

POSITIVE = (
    "Detroit techno origin, abandoned industrial architecture at night, Belleville Three era, "
    "Afro-diasporic electronic music culture, analog synthesizer silhouette, "
    "manga editorial illustration, high contrast black and white lineart, "
    "cinematic wide 16:9 composition, industrial urban landscape, empty streets, smokestack skyline, "
    "dramatic chiaroscuro lighting, subtle cyan signal glow, magenta accent streak, "
    "Frecuencia Global editorial feature image, documentary tone, "
    "no readable text, no logos, no watermark, serious artistic quality"
)
NEGATIVE = (
    "fake readable text, watermark, logo, blurry, low resolution, "
    "generic EDM festival crowd, Las Vegas mainstage, random typography, "
    "distorted buildings, deformed humans, extra limbs, political symbols, "
    "brand logos, messy neon clutter, nsfw, bad anatomy, cartoon chibi, anime kawaii"
)


def build_workflow(positive, negative, seed, width, height, prefix):
    return {
        "4": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": CKPT}},
        "5": {"class_type": "EmptyLatentImage", "inputs": {"width": width, "height": height, "batch_size": 1}},
        "6": {"class_type": "CLIPTextEncode", "inputs": {"text": positive, "clip": ["4", 1]}},
        "7": {"class_type": "CLIPTextEncode", "inputs": {"text": negative, "clip": ["4", 1]}},
        "3": {
            "class_type": "KSampler",
            "inputs": {
                "seed": seed, "steps": 35, "cfg": 7.5,
                "sampler_name": "dpmpp_2m", "scheduler": "karras", "denoise": 1.0,
                "model": ["4", 0], "positive": ["6", 0], "negative": ["7", 0], "latent_image": ["5", 0]
            }
        },
        "8": {"class_type": "VAEDecode", "inputs": {"samples": ["3", 0], "vae": ["4", 2]}},
        "9": {"class_type": "SaveImage", "inputs": {"images": ["8", 0], "filename_prefix": prefix}}
    }


def queue_prompt(workflow):
    payload = json.dumps({"prompt": workflow}).encode("utf-8")
    req = urllib.request.Request(f"{COMFYUI_URL}/prompt", data=payload,
                                  headers={"Content-Type": "application/json"}, method="POST")
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


def wait_for_prompt(prompt_id, timeout=480):
    start = time.time()
    while time.time() - start < timeout:
        req = urllib.request.Request(f"{COMFYUI_URL}/history/{prompt_id}", method="GET")
        with urllib.request.urlopen(req, timeout=10) as resp:
            history = json.loads(resp.read().decode("utf-8"))
            if prompt_id in history:
                outputs = history[prompt_id].get("outputs", {})
                for nid, out in outputs.items():
                    if "images" in out:
                        return [img["filename"] for img in out["images"]]
                return []
        time.sleep(5)
    return None


def get_comfy_output_dir():
    try:
        req = urllib.request.Request(f"{COMFYUI_URL}/object_info", method="GET")
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return None
    except Exception:
        return None


print("=" * 60)
print("D07 FeaturedBlock — ComfyUI SDXL Hero Generation")
print("=" * 60)

seeds = [2025, 7734, 909]
jobs = []
print(f"\n[HERO WIDE 896x512] — 3 candidatos")
for seed in seeds:
    prefix = f"FG_DETROIT_FEATURED_v1_s{seed}"
    wf = build_workflow(POSITIVE, NEGATIVE, seed, 896, 512, prefix)
    pid, err = queue_prompt(wf)
    if err:
        print(f"  ERROR seed={seed}: {err}")
    else:
        jobs.append((seed, pid, prefix))
        print(f"  QUEUED seed={seed} -> {pid}")

print(f"\nWaiting for {len(jobs)} jobs...")
results = {}
for seed, pid, prefix in jobs:
    print(f"  Waiting seed={seed}...")
    files = wait_for_prompt(pid, timeout=600)
    results[seed] = files
    print(f"    -> {files}")

print("\nDone.")
print(json.dumps(results, indent=2))

# Try to copy from ComfyUI output to our dir
comfy_output = Path(r"C:\Users\farid\ComfyUI\output")
if not comfy_output.exists():
    comfy_output = Path(r"D:\ComfyUI\output")
if not comfy_output.exists():
    # search common paths
    for p in [Path.home() / "ComfyUI" / "output", Path("D:/ComfyUI/output"), Path("C:/ComfyUI/output")]:
        if p.exists():
            comfy_output = p
            break

print(f"\nLooking for outputs in: {comfy_output}")
copied = []
for seed, files in results.items():
    if files:
        for fname in files:
            src = comfy_output / fname
            dst = OUTPUT_DIR / fname
            if src.exists():
                shutil.copy2(src, dst)
                print(f"  COPIED: {fname} -> {dst}")
                copied.append(str(dst))
            else:
                print(f"  NOT FOUND: {src}")

with open(OUTPUT_DIR / "D07_generation_results.json", "w") as f:
    json.dump({"seeds": seeds, "results": results, "copied": copied}, f, indent=2)
print(f"\nResults saved to {OUTPUT_DIR / 'D07_generation_results.json'}")
