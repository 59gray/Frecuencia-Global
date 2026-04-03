from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "output" / "gemini" / "maya_host_render_pass_20260403" / "maya-host-c-avatar-safe.png"
ASSETS_DIR = ROOT / "06_Assets"

KEY_VISUAL_OUT = ASSETS_DIR / "MAYA_HOST_KeyVisual_FullBody_1080x1920_v1.png"
AVATAR_MASTER_OUT = ASSETS_DIR / "MAYA_HOST_Avatar_Master_1080_v1.png"
AVATAR_400_OUT = ASSETS_DIR / "MAYA_HOST_Avatar_Profile_400_v1.png"
AVATAR_200_OUT = ASSETS_DIR / "MAYA_HOST_Avatar_Profile_200_v1.png"


def ensure_source() -> Path:
    if not SOURCE.exists():
        raise FileNotFoundError(f"Source render not found: {SOURCE}")
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    return SOURCE


def build_key_visual(src: Image.Image) -> None:
    target_size = (1080, 1920)
    bg = (247, 243, 241)

    canvas = Image.new("RGB", target_size, bg)
    scale = min(target_size[0] / src.width, target_size[1] / src.height)
    contained = src.resize(
        (int(src.width * scale), int(src.height * scale)),
        Image.Resampling.LANCZOS,
    )

    offset = (
        (target_size[0] - contained.width) // 2,
        (target_size[1] - contained.height) // 2,
    )
    canvas.paste(contained, offset)
    canvas.save(KEY_VISUAL_OUT, "PNG")


def build_avatar_master(src: Image.Image) -> None:
    # Manual crop tuned to keep Maya's face, glasses, ponytail, and shoulders safe
    # inside a circular avatar while preserving the reference fidelity.
    crop_box = (96, 0, 596, 500)
    cropped = src.crop(crop_box)
    master = cropped.resize((1080, 1080), Image.Resampling.LANCZOS)
    master.save(AVATAR_MASTER_OUT, "PNG")
    master.resize((400, 400), Image.Resampling.LANCZOS).save(AVATAR_400_OUT, "PNG")
    master.resize((200, 200), Image.Resampling.LANCZOS).save(AVATAR_200_OUT, "PNG")


def main() -> None:
    source_path = ensure_source()
    src = Image.open(source_path).convert("RGB")

    build_key_visual(src)
    build_avatar_master(src)

    for path in [KEY_VISUAL_OUT, AVATAR_MASTER_OUT, AVATAR_400_OUT, AVATAR_200_OUT]:
        size_kb = path.stat().st_size / 1024
        print(f"{path.name} | {path.stat().st_size} bytes | {size_kb:.1f} KB")


if __name__ == "__main__":
    main()
