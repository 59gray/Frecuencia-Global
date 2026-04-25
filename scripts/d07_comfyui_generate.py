import urllib.request
import json
import time
import sys

COMFYUI_URL = "http://127.0.0.1:8000"
CKPT = "sdxl\\sd_xl_base_1.0.safetensors"

POSITIVE_HERO = (
    "Detroit techno origin, abandoned industrial factory district, Belleville Three era, "
    "Afro-diasporic electronic music, night radio, analog synth atmosphere, "
    "manga editorial style, black and white with controlled cyan magenta accent, "
    "high contrast ink, cinematic wide urban composition, Frecuencia Global editorial cover, "
    "dramatic 1980s midwest industrial cityscape at night, empty streets, smokestack silhouettes"
)
NEGATIVE = (
    "blurry, low resolution, fake readable text, distorted buildings, deformed people, "
    "extra limbs, watermark, logo, political symbols, random typography, "
    "generic EDM festival crowd, neon clutter, nsfw, ugly, bad anatomy, cartoon, anime chibi"
)

POSITIVE_THUMB = (
    "Detroit techno origin, vertical editorial portrait composition, abandoned industrial interior, "
    "DJ setup silhouette, Belleville Three era, Afro-diasporic electronic music culture, "
    "analog synthesizer close-up, manga editorial style, black and white with cyan magenta accent, "
    "high contrast ink, Frecuencia Global mobile story cover, dramatic vertical frame, "
    "1980s industrial midwest atmosphere"
)


def build_workflow(positive, negative, seed, width, height, prefix):
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
                "steps": 35,
                "cfg": 7.5,
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
            "inputs": {"images": ["8", 0], "filename_prefix": prefix}
        }
    }


def queue_prompt(workflow):
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
            return "", "\n".join(details) or err.get("error", {}).get("message", body[:300])
        except Exception:
            return "", body[:300]


def wait_for_prompt(prompt_id, timeout=300):
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
print("D07 ComfyUI SDXL Generation — Detroit")
print("=" * 60)

# ── HERO WEB 768x432 ──
hero_seeds = [42, 137, 999]
hero_ids = []
print("\n[HERO WEB 768x432]")
for seed in hero_seeds:
    prefix = f"FG_DETROIT_HERO_WEB_v1_s{seed}"
    wf = build_workflow(POSITIVE_HERO, NEGATIVE, seed, 768, 432, prefix)
    pid, err = queue_prompt(wf)
    if err:
        print(f"  ERROR seed={seed}: {err}")
    else:
        hero_ids.append((seed, pid))
        print(f"  QUEUED seed={seed} -> prompt_id={pid}")

# ── THUMB VERTICAL 512x896 ──
thumb_seeds = [7, 88, 444]
thumb_ids = []
print("\n[THUMB VERTICAL 512x896]")
for seed in thumb_seeds:
    prefix = f"FG_DETROIT_THUMB_VERTICAL_v1_s{seed}"
    wf = build_workflow(POSITIVE_THUMB, NEGATIVE, seed, 512, 896, prefix)
    pid, err = queue_prompt(wf)
    if err:
        print(f"  ERROR seed={seed}: {err}")
    else:
        thumb_ids.append((seed, pid))
        print(f"  QUEUED seed={seed} -> prompt_id={pid}")

print(f"\nTotal hero jobs: {len(hero_ids)}")
print(f"Total thumb jobs: {len(thumb_ids)}")

# Save IDs for polling
all_ids = {"hero": hero_ids, "thumb": thumb_ids}
with open("D07_job_ids.json", "w") as f:
    json.dump(all_ids, f, indent=2)
print("\nJob IDs saved to D07_job_ids.json")
print("Now waiting for completion...")

# Wait for all jobs
all_outputs = {"hero": {}, "thumb": {}}
for seed, pid in hero_ids:
    print(f"  Waiting hero seed={seed}...")
    files = wait_for_prompt(pid, timeout=600)
    all_outputs["hero"][seed] = files
    print(f"    -> {files}")

for seed, pid in thumb_ids:
    print(f"  Waiting thumb seed={seed}...")
    files = wait_for_prompt(pid, timeout=600)
    all_outputs["thumb"][seed] = files
    print(f"    -> {files}")

with open("D07_outputs.json", "w") as f:
    json.dump(all_outputs, f, indent=2)
print("\nAll done. Outputs saved to D07_outputs.json")
print(json.dumps(all_outputs, indent=2))
