import urllib.request
import json
import time
import shutil
from pathlib import Path

COMFYUI_URL = "http://127.0.0.1:8000"
CKPT = "sdxl\\sd_xl_base_1.0.safetensors"
COMFY_OUT   = Path(r"D:\FrecuenciaGlobal\ComfyUI\output")
OUT_DIR     = Path(r"D:\FrecuenciaGlobal\AV\BassAndBorders\D07_Cards_v2")
OUT_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC      = Path(r"C:\Users\farid\Documents\Frecuencia Global\website\public\images\articles")

# DETROIT card — concept: city-factory interior, assembly line ghosts, analog machine, night circuit
# Deliberately different from the featured hero (exterior skyline/silos)
POSITIVE_DETROIT = (
    "Detroit techno underground, interior of abandoned automobile factory, "
    "assembly line machinery silhouettes, analog synthesizer circuit board close-up, "
    "Belleville Three era basement studio, radio tower signal, urban night circuit, "
    "manga editorial card illustration, black and white high contrast lineart, "
    "sharp ink lines, subtle cyan signal glow accent only, cinematic 16x9 horizontal, "
    "no readable text, no logos, no watermark, documentary editorial tone"
)
NEGATIVE_DETROIT = (
    "exterior skyline, smokestacks, silos, blurry, watermark, logo, readable text, "
    "color photography, generic EDM festival, Las Vegas, random typography, "
    "deformed humans, extra limbs, messy neon clutter, low resolution"
)

# BERGHAIN card — concept: concrete queue / threshold architecture, anonymous hooded figures, door geometry
# B/N + subtle cyan only, no amber/teal/yellow
POSITIVE_BERGHAIN = (
    "Berghain Berlin entrance threshold, brutalist concrete corridor at night, "
    "anonymous figures in queue seen from behind, heavy industrial door geometry, "
    "hierarchy of access through architecture, shadow and light contrast, "
    "manga editorial card illustration, black and white high contrast lineart, "
    "sharp ink lines, subtle cyan signal glow accent only, cinematic 16x9 horizontal, "
    "no identifiable faces, no readable text, no logos, no watermark, documentary editorial tone"
)
NEGATIVE_BERGHAIN = (
    "yellow, amber, orange, teal, colorful, watermark, logo, readable text, "
    "identifiable real faces, celebrity, neon festival crowd, "
    "explicit party scene, distorted bodies, extra limbs, random typography, "
    "blurry, low resolution, messy clutter, exterior street"
)


def build_workflow(positive, negative, seed, prefix):
    return {
        "4":  {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": CKPT}},
        "5":  {"class_type": "EmptyLatentImage",       "inputs": {"width": 896, "height": 512, "batch_size": 1}},
        "6":  {"class_type": "CLIPTextEncode",         "inputs": {"text": positive, "clip": ["4", 1]}},
        "7":  {"class_type": "CLIPTextEncode",         "inputs": {"text": negative, "clip": ["4", 1]}},
        "3":  {
            "class_type": "KSampler",
            "inputs": {
                "seed": seed, "steps": 35, "cfg": 7.5,
                "sampler_name": "dpmpp_2m", "scheduler": "karras", "denoise": 1.0,
                "model": ["4", 0], "positive": ["6", 0], "negative": ["7", 0],
                "latent_image": ["5", 0]
            }
        },
        "8":  {"class_type": "VAEDecode",  "inputs": {"samples": ["3", 0], "vae": ["4", 2]}},
        "9":  {"class_type": "SaveImage",  "inputs": {"images": ["8", 0], "filename_prefix": prefix}}
    }


def queue_prompt(workflow):
    payload = json.dumps({"prompt": workflow}).encode("utf-8")
    req = urllib.request.Request(
        f"{COMFYUI_URL}/prompt", data=payload,
        headers={"Content-Type": "application/json"}, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8")).get("prompt_id", ""), None
    except urllib.error.HTTPError as e:
        return "", e.read().decode("utf-8")[:300]


def wait_for_prompt(prompt_id, timeout=600):
    start = time.time()
    while time.time() - start < timeout:
        with urllib.request.urlopen(f"{COMFYUI_URL}/history/{prompt_id}", timeout=10) as resp:
            history = json.loads(resp.read().decode("utf-8"))
            if prompt_id in history:
                for nid, out in history[prompt_id].get("outputs", {}).items():
                    if "images" in out:
                        return [img["filename"] for img in out["images"]]
                return []
        time.sleep(5)
    return None


print("=" * 60)
print("D07 Bass & Borders — Cards v2 (uniform B/N + cyan)")
print("=" * 60)

# 3 seeds each
jobs = []
for seed in [111, 555, 2026]:
    pid, err = queue_prompt(build_workflow(POSITIVE_DETROIT, NEGATIVE_DETROIT, seed, f"FG_BB_DETROIT_CARD_v2_s{seed}"))
    if err:
        print(f"  ERROR Detroit s{seed}: {err}")
    else:
        jobs.append(("detroit", seed, pid))
        print(f"  QUEUED Detroit s{seed} -> {pid}")

for seed in [222, 666, 1337]:
    pid, err = queue_prompt(build_workflow(POSITIVE_BERGHAIN, NEGATIVE_BERGHAIN, seed, f"FG_BB_BERGHAIN_CARD_v2_s{seed}"))
    if err:
        print(f"  ERROR Berghain s{seed}: {err}")
    else:
        jobs.append(("berghain", seed, pid))
        print(f"  QUEUED Berghain s{seed} -> {pid}")

print(f"\n{len(jobs)} jobs queued. Waiting for completion...")

results = {"detroit": {}, "berghain": {}}
for article, seed, pid in jobs:
    print(f"  Waiting {article} s{seed}...")
    files = wait_for_prompt(pid)
    results[article][seed] = files or []
    print(f"    -> {files}")

# Copy to staging and pick best (largest = most detail)
for article, seed, pid in jobs:
    for fname in results[article].get(seed, []):
        src = COMFY_OUT / fname
        if src.exists():
            shutil.copy2(src, OUT_DIR / fname)

def best(article):
    candidates = list(OUT_DIR.glob(f"FG_BB_{article.upper()}_CARD_v2_s*.png"))
    if not candidates:
        return None
    b = max(candidates, key=lambda f: f.stat().st_size)
    print(f"  BEST {article}: {b.name} ({b.stat().st_size // 1024} KB)")
    return b

print("\nSelecting best candidates...")
best_detroit  = best("detroit")
best_berghain = best("berghain")

if best_detroit:
    dst = PUBLIC / "FG_BASS_BORDERS_DETROIT_CARD_v2.png"
    shutil.copy2(best_detroit, dst)
    print(f"  CANONICAL Detroit  -> {dst}")

if best_berghain:
    dst = PUBLIC / "FG_BASS_BORDERS_BERGHAIN_CARD_v2.png"
    shutil.copy2(best_berghain, dst)
    print(f"  CANONICAL Berghain -> {dst}")

print("\nDone.")
