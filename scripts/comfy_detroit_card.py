"""
Genera techno-detroit-featured-card.png via ComfyUI API (puerto 8000).
SD 1.5 — txt2img — 1216x704 — Detroit nocturno / cyber / techno.
"""
import json
import urllib.request
import urllib.error
import time
import os
import shutil

HOST = "127.0.0.1"
PORT = 8000
OUTPUT_DIR = r"D:\FrecuenciaGlobal\ComfyUI\output"
DEST = r"website\public\images\articles\techno-detroit-featured-card.png"
CLIENT_ID = "fg-detroit-card"

WORKFLOW = {
    "1": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": {"ckpt_name": "sd15\\v1-5-pruned-emaonly.safetensors"}
    },
    "2": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "text": (
                "Detroit at night, techno music, industrial city skyline, "
                "neon cyan and magenta lights, electronic circuit board patterns, "
                "dark atmospheric fog, club music visual, signal frequency waves, "
                "cyberpunk aesthetic, cinematic photography, dramatic lighting, "
                "no text, no logos, no people"
            ),
            "clip": ["1", 1]
        }
    },
    "3": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "text": "text, watermark, logo, blurry, low quality, daytime, bright white, people faces, nsfw",
            "clip": ["1", 1]
        }
    },
    "4": {
        "class_type": "EmptyLatentImage",
        "inputs": {"width": 1216, "height": 704, "batch_size": 1}
    },
    "5": {
        "class_type": "KSampler",
        "inputs": {
            "model": ["1", 0],
            "positive": ["2", 0],
            "negative": ["3", 0],
            "latent_image": ["4", 0],
            "seed": 20260426,
            "steps": 28,
            "cfg": 7.5,
            "sampler_name": "dpmpp_2m",
            "scheduler": "karras",
            "denoise": 1.0
        }
    },
    "6": {
        "class_type": "VAEDecode",
        "inputs": {"samples": ["5", 0], "vae": ["1", 2]}
    },
    "7": {
        "class_type": "SaveImage",
        "inputs": {"images": ["6", 0], "filename_prefix": "techno-detroit-featured-card"}
    }
}


def post_prompt():
    body = json.dumps({"prompt": WORKFLOW, "client_id": CLIENT_ID}).encode()
    req = urllib.request.Request(
        f"http://{HOST}:{PORT}/prompt",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        print(f"HTTP {e.code} error body: {err_body}")
        raise


def poll_queue(prompt_id, timeout=180):
    deadline = time.time() + timeout
    while time.time() < deadline:
        with urllib.request.urlopen(f"http://{HOST}:{PORT}/history/{prompt_id}", timeout=10) as r:
            hist = json.loads(r.read())
        if prompt_id in hist:
            outputs = hist[prompt_id].get("outputs", {})
            for node_id, node_out in outputs.items():
                if "images" in node_out:
                    return node_out["images"]
            # completed but no images key yet
            return []
        print(f"  aguardando... ({int(deadline - time.time())}s restantes)".encode('ascii', 'replace').decode())
        time.sleep(4)
    raise TimeoutError("ComfyUI no completó en tiempo")


def copy_output(images):
    for img_info in images:
        fname = img_info["filename"]
        src = os.path.join(OUTPUT_DIR, fname)
        if os.path.exists(src):
            shutil.copy2(src, DEST)
            size_kb = os.path.getsize(DEST) // 1024
            print(f"OK Copiado: {src} -> {DEST} ({size_kb} KB)")
            return True
    return False


if __name__ == "__main__":
    print(">> Enviando prompt a ComfyUI...")
    resp = post_prompt()
    print(f"  Respuesta: {resp}")

    prompt_id = resp.get("prompt_id")
    if not prompt_id:
        print("ERROR: no se recibió prompt_id")
        raise SystemExit(1)

    print(f"  prompt_id: {prompt_id}")
    print(">> Esperando generacion...")
    images = poll_queue(prompt_id)

    if not images:
        print("ERROR: workflow completó pero sin imágenes")
        raise SystemExit(1)

    if copy_output(images):
        print("OK Asset listo para el website.")
    else:
        print(f"ERROR: archivo no encontrado en {OUTPUT_DIR}")
        raise SystemExit(1)
