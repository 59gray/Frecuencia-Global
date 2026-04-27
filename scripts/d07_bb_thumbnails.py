import urllib.request
import json
import time
import shutil
from pathlib import Path

COMFYUI_URL = "http://127.0.0.1:8000"
CKPT = "sdxl\\sd_xl_base_1.0.safetensors"
COMFY_OUT   = Path(r"D:\FrecuenciaGlobal\ComfyUI\output")
OUT_DETROIT  = Path(r"D:\FrecuenciaGlobal\AV\BassAndBorders\D07_Thumbnails\Detroit")
OUT_BERGHAIN = Path(r"D:\FrecuenciaGlobal\AV\BassAndBorders\D07_Thumbnails\Berghain")

POSITIVE_DETROIT = (
    "Detroit techno origin, abandoned industrial architecture, city-factory, Black cultural memory, "
    "analog synth machine, night radio, urban circuit, Afro-diasporic electronic music, "
    "manga editorial thumbnail, black and white lineart, high contrast, "
    "subtle cyan and magenta signal accents, cinematic composition, documentary tone, "
    "no readable text, no logos, no watermark"
)
NEGATIVE_DETROIT = (
    "fake readable text, watermark, logo, blurry, low resolution, "
    "generic EDM festival, Las Vegas mainstage, random typography, "
    "distorted car, deformed humans, extra limbs, political symbols, brand logos, messy neon clutter"
)

POSITIVE_BERGHAIN = (
    "Berghain Berlin as social device, anonymous threshold, brutalist concrete architecture, "
    "nightclub entrance as filter, hierarchy of access, shadowed figures without identifiable faces, "
    "prestige and control of image, manga editorial thumbnail, black and white lineart, "
    "high contrast, subtle cyan and amber signal accents, cinematic documentary tone, "
    "no readable text, no logos, no watermark"
)
NEGATIVE_BERGHAIN = (
    "fake readable text, watermark, logo, blurry, low resolution, "
    "identifiable real faces, celebrity, random typography, neon festival crowd, "
    "explicit party scene, distorted bodies, extra limbs, brand logos, messy clutter"
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
                    details.append(f"node {nid}: {e2['details'][:200]}")
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


print("=" * 60)
print("D07 Bass & Borders — Thumbnail Generation")
print("=" * 60)

jobs = []
# Detroit: 3 seeds
for seed in [303, 777, 1984]:
    prefix = f"FG_BB_DETROIT_THUMB_v1_s{seed}"
    pid, err = queue_prompt(build_workflow(POSITIVE_DETROIT, NEGATIVE_DETROIT, seed, 896, 512, prefix))
    if err:
        print(f"  ERROR Detroit seed={seed}: {err}")
    else:
        jobs.append(("detroit", seed, pid, prefix))
        print(f"  QUEUED Detroit seed={seed} -> {pid}")

# Berghain: 3 seeds
for seed in [404, 888, 2049]:
    prefix = f"FG_BB_BERGHAIN_THUMB_v1_s{seed}"
    pid, err = queue_prompt(build_workflow(POSITIVE_BERGHAIN, NEGATIVE_BERGHAIN, seed, 896, 512, prefix))
    if err:
        print(f"  ERROR Berghain seed={seed}: {err}")
    else:
        jobs.append(("berghain", seed, pid, prefix))
        print(f"  QUEUED Berghain seed={seed} -> {pid}")

print(f"\nTotal jobs queued: {len(jobs)}. Waiting...")

results = {"detroit": {}, "berghain": {}}
for article, seed, pid, prefix in jobs:
    print(f"  Waiting {article} seed={seed}...")
    files = wait_for_prompt(pid, timeout=600)
    results[article][seed] = files
    print(f"    -> {files}")

# Copy outputs
copied = {"detroit": [], "berghain": []}
for article, seed, pid, prefix in jobs:
    files = results[article].get(seed, []) or []
    out_dir = OUT_DETROIT if article == "detroit" else OUT_BERGHAIN
    for fname in files:
        src = COMFY_OUT / fname
        dst = out_dir / fname
        if src.exists():
            shutil.copy2(src, dst)
            copied[article].append(str(dst))
            print(f"  COPIED {fname} -> {dst}")
        else:
            print(f"  NOT FOUND: {src}")

# Pick best per article (largest file = most detail)
def pick_best(article, out_dir):
    candidates = list(out_dir.glob("FG_BB_*_THUMB_v1_s*.png"))
    if not candidates:
        return None
    best = max(candidates, key=lambda f: f.stat().st_size)
    print(f"  BEST {article}: {best.name} ({best.stat().st_size} bytes)")
    return best

print("\nPicking best candidates...")
best_detroit  = pick_best("detroit",  OUT_DETROIT)
best_berghain = pick_best("berghain", OUT_BERGHAIN)

public = Path(r"C:\Users\farid\Documents\Frecuencia Global\website\public\images\articles")
canonical = {}
if best_detroit:
    dst = public / "FG_BASS_BORDERS_DETROIT_THUMB_v1.png"
    shutil.copy2(best_detroit, dst)
    canonical["detroit"] = str(dst)
    print(f"  CANONICAL Detroit -> {dst}")

if best_berghain:
    dst = public / "FG_BASS_BORDERS_BERGHAIN_THUMB_v1.png"
    shutil.copy2(best_berghain, dst)
    canonical["berghain"] = str(dst)
    print(f"  CANONICAL Berghain -> {dst}")

summary = {"results": results, "copied": copied, "canonical": canonical}
with open(OUT_DETROIT.parent / "D07_bb_generation_results.json", "w") as f:
    json.dump(summary, f, indent=2)

print("\nAll done.")
print(json.dumps(summary, indent=2))
