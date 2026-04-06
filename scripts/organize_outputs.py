#!/usr/bin/env python3
"""
Organize generated image outputs to proper locations with consistent naming.

Usage:
    python scripts/organize_outputs.py --episode EP001 --type thumbnail
    python scripts/organize_outputs.py --input 06_Assets/EP_001/FG_EP001_THB_*.png

Moves generated images to review folder, applies consistent naming, and creates manifest.
"""

import sys
import argparse
import json
from pathlib import Path
from datetime import datetime

REPO_ROOT = Path(__file__).parent.parent

def organize_episode_outputs(episode_id: str, asset_type: str = "thumbnail") -> dict:
    """Organize outputs for a specific episode using Asset Ops canonical paths."""
    # Convert EP001 to P1_001 format
    if episode_id.startswith("EP"):
        piece_id = f"P1_{episode_id[2:]}"
    else:
        piece_id = episode_id

    # Use canonical Asset Ops structure
    production_dir = REPO_ROOT / "06_Assets" / "production" / piece_id
    review_dir = production_dir / "review"
    final_dir = production_dir / "final"
    latest_dir = REPO_ROOT / "06_Assets" / "latest_stable" / "thumbnails"

    # Create directories
    review_dir.mkdir(parents=True, exist_ok=True)
    final_dir.mkdir(parents=True, exist_ok=True)
    latest_dir.mkdir(parents=True, exist_ok=True)

    # Find generated images (check both old and new locations)
    source_dirs = [
        REPO_ROOT / "06_Assets" / episode_id,  # Old location
        production_dir,  # Current location
    ]

    generated_files = []
    for source_dir in source_dirs:
        pattern = f"FG_{episode_id}_THB_*.png"
        generated_files.extend(source_dir.glob(pattern))

    if not generated_files:
        return {
            "success": False,
            "message": f"No generated files found with pattern: {pattern}"
        }

    organized = []
    date = datetime.now().strftime("%Y%m%d")

    for i, file in enumerate(generated_files, 1):
        # New consistent name
        new_name = f"FG_{episode_id}_THB_v{i}_{date}.png"
        new_path = review_dir / new_name

        # Move file
        file.rename(new_path)

        organized.append({
            "original": str(file.name),
            "new": str(new_name),
            "path": str(new_path.relative_to(REPO_ROOT)),
            "size": new_path.stat().st_size,
            "variant": i
        })

    # Create manifest
    manifest = {
        "episode_id": episode_id,
        "piece_id": piece_id,
        "asset_type": asset_type,
        "generated_at": datetime.now().isoformat(),
        "total_variants": len(organized),
        "files": organized,
        "review_folder": str(review_dir.relative_to(REPO_ROOT)),
        "final_folder": str(final_dir.relative_to(REPO_ROOT)),
        "latest_folder": str(latest_dir.relative_to(REPO_ROOT))
    }

    manifest_path = production_dir / f"{episode_id}_manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    return {
        "success": True,
        "message": f"Organized {len(organized)} files",
        "manifest": str(manifest_path.relative_to(REPO_ROOT)),
        "organized": organized
    }

def organize_specific_files(input_pattern: str) -> dict:
    """Organize specific files matching a pattern."""
    input_path = Path(input_pattern)

    if input_path.is_file():
        files = [input_path]
    else:
        files = list(REPO_ROOT.glob(input_pattern))

    if not files:
        return {
            "success": False,
            "message": f"No files found: {input_pattern}"
        }

    organized = []

    for file in files:
        # Determine episode from filename
        filename = file.stem
        parts = filename.split("_")

        if len(parts) >= 3 and parts[1].startswith("EP"):
            episode_id = parts[1]
            # Convert to P1_XXX format
            piece_id = f"P1_{episode_id[2:]}"
            variant = parts[2] if len(parts) > 2 else "1"
        else:
            episode_id = "UNKNOWN"
            piece_id = "UNKNOWN"
            variant = "1"

        # Create review dir using canonical structure
        episode_dir = REPO_ROOT / "06_Assets" / "production" / piece_id
        review_dir = episode_dir / "review"
        review_dir.mkdir(parents=True, exist_ok=True)

        # Move to review
        new_path = review_dir / file.name
        file.rename(new_path)

        organized.append({
            "original": str(file.relative_to(REPO_ROOT)),
            "new": str(new_path.relative_to(REPO_ROOT)),
            "episode": episode_id,
            "piece_id": piece_id,
            "variant": variant
        })

    return {
        "success": True,
        "message": f"Organized {len(organized)} files",
        "organized": organized
    }

def print_results(result: dict):
    """Print organization results."""
    if result["success"]:
        print(f"✅ {result['message']}")
        if "manifest" in result:
            print(f"📋 Manifest: {result['manifest']}")
        print("\nOrganized files:")
        for item in result.get("organized", []):
            print(f"  {item['original']} → {item.get('new', item['original'])}")
    else:
        print(f"❌ {result['message']}")

def main():
    parser = argparse.ArgumentParser(description="Organize generated image outputs")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--episode", help="Episode ID (e.g., EP001)")
    group.add_argument("--input", help="Input file or pattern")
    parser.add_argument("--type", default="thumbnail", help="Asset type (default: thumbnail)")

    args = parser.parse_args()

    if args.episode:
        result = organize_episode_outputs(args.episode, args.type)
    else:
        result = organize_specific_files(args.input)

    print_results(result)

    if not result["success"]:
        sys.exit(1)

if __name__ == "__main__":
    main()
