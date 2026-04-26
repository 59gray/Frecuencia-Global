"""
Genera thumbnails 16:9 para 3 articulos via ComfyUI API.
SD 1.5 - 1216x704 - copia a website/public/images/articles/
"""
import json, urllib.request, urllib.error, time, glob, shutil

HOST = "127.0.0.1"
PORT = 8000
OUTPUT_DIR = r"D:\FrecuenciaGlobal\ComfyUI\output"
NEG = "text, watermark, logo, blurry, low quality, bright daylight, faces, nsfw, cartoon"

ASSETS = [
    {
        "dest": r"website\public\images\articles\ticketing-plataformas-comision.png",
        "prefix": "ticketing-plataformas",
        "seed": 44120983,
        "prompt": (
            "concert venue entrance at night, neon ticket booth, digital price screens, "
            "crowd silhouettes, dark dramatic atmosphere, cyan and amber neon glow, "
            "cinematic editorial photography, no text overlay, high contrast moody, 4k"
        ),
    },
    {
        "dest": r"website\public\images\articles\cables-submarinos-geopolitica-internet.png",
        "prefix": "cables-submarinos",
        "seed": 58293741,
        "prompt": (
            "underwater fiber optic cables on ocean floor, bioluminescent glow, "
            "deep sea darkness, glowing data lines, dark blue and cyan light, "
            "cinematic underwater editorial photography, no text, 4k"
        ),
    },
    {
        "dest": r"website\public\images\articles\streaming-regalias-artistas.png",
        "prefix": "streaming-regalias",
        "seed": 91837465,
        "prompt": (
            "abstract music streaming waveform visualization, sound data flow, "
            "dark background, neon green and purple digital waveforms, "
            "editorial cyberpunk aesthetic, no text, no logos, cinematic, 4k"
        ),
    },
]


def build_workflow(prompt, seed, prefix):
    return {
        "1": {"class_type": "CheckpointLoaderSimple",
              "inputs": {"ckpt_name": "sd15\\v1-5-pruned-emaonly.safetensors"}},
        "2": {"class_type": "CLIPTextEncode",
              "inputs": {"text": prompt, "clip": ["1", 1]}},
        "3": {"class_type": "CLIPTextEncode",
              "inputs": {"text": NEG, "clip": ["1", 1]}},
        "4": {"class_type": "EmptyLatentImage",
              "inputs": {"width": 1216, "height": 704, "batch_size": 1}},
        "5": {"class_type": "KSampler",
              "inputs": {
                  "model": ["1", 0], "positive": ["2", 0], "negative": ["3", 0],
                  "latent_image": ["4", 0], "seed": seed, "steps": 30,
                  "cfg": 8.5, "sampler_name": "dpmpp_2m",
                  "scheduler": "karras", "denoise": 1.0}},
        "6": {"class_type": "VAEDecode",
              "inputs": {"samples": ["5", 0], "vae": ["1", 2]}},
        "7": {"class_type": "SaveImage",
              "inputs": {"images": ["6", 0], "filename_prefix": prefix}},
    }


def post_prompt(workflow, prefix):
    body = json.dumps({"prompt": workflow, "client_id": f"fg-{prefix}"}).encode()
    req = urllib.request.Request(
        f"http://{HOST}:{PORT}/prompt", data=body,
        headers={"Content-Type": "application/json"}, method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())


def wait_done(prompt_id, timeout=240):
    deadline = time.time() + timeout
    while time.time() < deadline:
        with urllib.request.urlopen(f"http://{HOST}:{PORT}/history/{prompt_id}", timeout=10) as r:
            hist = json.loads(r.read())
        if prompt_id in hist:
            return hist[prompt_id]
        print(f"  aguardando... ({int(deadline - time.time())}s)")
        time.sleep(4)
    raise TimeoutError("ComfyUI no termino a tiempo")


def copy_output(prefix, dest):
    pattern = f"{OUTPUT_DIR}\\{prefix}_*.png"
    files = sorted(glob.glob(pattern))
    if not files:
        raise FileNotFoundError(f"No PNG encontrado: {pattern}")
    src = files[-1]
    shutil.copy2(src, dest)
    kb = round(shutil.os.path.getsize(dest) / 1024)
    print(f"OK {dest} ({kb} KB)")


for asset in ASSETS:
    print(f"\n>> Generando: {asset['prefix']}")
    wf = build_workflow(asset["prompt"], asset["seed"], asset["prefix"])
    resp = post_prompt(wf, asset["prefix"])
    pid = resp["prompt_id"]
    print(f"   prompt_id: {pid}")
    wait_done(pid)
    copy_output(asset["prefix"], asset["dest"])

print("\nDone - 3 assets generados.")
