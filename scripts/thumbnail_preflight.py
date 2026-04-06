#!/usr/bin/env python3
"""
Thumbnail preflight check - validates all required components before generation.

Usage:
    python scripts/thumbnail_preflight.py EP001
    python scripts/thumbnail_preflight.py --brief 04_Produccion/EP_001/EP_001_Thumbnail_Brief.md

Validates that all required files exist and are ready for thumbnail generation.
"""

import sys
import argparse
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent

def find_prompt_file(episode_id: str) -> Path | None:
    """Find the prompt file for an episode."""
    patterns = [
        f"system/gemini/prompts/PROMPT_{episode_id}_THB_YT_v1.md",
        f"system/gemini/prompts/PROMPT_{episode_id}_THB_*.md",
        f"system/gemini/prompts/PROMPT_{episode_id}_*.md"
    ]

    for pattern in patterns:
        matches = list(REPO_ROOT.glob(pattern))
        if matches:
            return matches[0]

    return None

def find_brief_file(episode_id: str) -> Path | None:
    """Find the brief file for an episode."""
    patterns = [
        f"04_Produccion/{episode_id}/{episode_id}_Thumbnail_Brief.md",
        f"04_Produccion/{episode_id}/*_Thumbnail_Brief.md",
        f"04_Produccion/{episode_id}/*_Brief.md"
    ]

    for pattern in patterns:
        matches = list(REPO_ROOT.glob(pattern))
        if matches:
            return matches[0]

    return None

def check_output_dir(episode_id: str) -> Path:
    """Check/create output directory."""
    output_dir = REPO_ROOT / "06_Assets" / episode_id
    output_dir.mkdir(parents=True, exist_ok=True)
    return output_dir

def validate_episode(episode_id: str) -> dict:
    """Validate all components for an episode."""
    results = {
        "episode_id": episode_id,
        "ready": False,
        "components": {},
        "errors": []
    }

    # Check brief
    brief_path = find_brief_file(episode_id)
    if brief_path and brief_path.exists():
        results["components"]["brief"] = {
            "status": "✅",
            "path": str(brief_path.relative_to(REPO_ROOT)),
            "size": f"{brief_path.stat().st_size} bytes"
        }
    else:
        results["components"]["brief"] = {
            "status": "❌",
            "path": "Not found",
            "size": "N/A"
        }
        results["errors"].append("Brief file not found")

    # Check prompt
    prompt_path = find_prompt_file(episode_id)
    if prompt_path and prompt_path.exists():
        results["components"]["prompt"] = {
            "status": "✅",
            "path": str(prompt_path.relative_to(REPO_ROOT)),
            "size": f"{prompt_path.stat().st_size} bytes"
        }
    else:
        results["components"]["prompt"] = {
            "status": "❌",
            "path": "Not found",
            "size": "N/A"
        }
        results["errors"].append("Prompt file not found")

    # Check output directory
    # Convert EP001 to P1_001 format for Asset Ops
    if episode_id.startswith("EP"):
        piece_id = f"P1_{episode_id[2:]}"
    else:
        piece_id = episode_id

    output_dir = REPO_ROOT / "06_Assets" / "production" / piece_id
    output_dir.mkdir(parents=True, exist_ok=True)
    results["components"]["output_dir"] = {
        "status": "✅",
        "path": str(output_dir.relative_to(REPO_ROOT)),
        "exists": output_dir.exists()
    }

    # Check Chrome profile (required for Gemini)
    chrome_profile = REPO_ROOT / ".chrome-gemini-stable"
    if chrome_profile.exists():
        results["components"]["chrome_profile"] = {
            "status": "✅",
            "path": str(chrome_profile.relative_to(REPO_ROOT))
        }
    else:
        results["components"]["chrome_profile"] = {
            "status": "⚠️",
            "path": str(chrome_profile.relative_to(REPO_ROOT))
        }
        results["errors"].append("Chrome profile not found - run gemini_generate_image.py --login-only first")

    # Check generation script
    gen_script = REPO_ROOT / "scripts" / "gemini_generate_image.py"
    if gen_script.exists():
        results["components"]["gen_script"] = {
            "status": "✅",
            "path": str(gen_script.relative_to(REPO_ROOT))
        }
    else:
        results["components"]["gen_script"] = {
            "status": "❌",
            "path": "Not found"
        }
        results["errors"].append("Generation script not found")

    results["ready"] = len(results["errors"]) == 0

    return results

def print_results(results: dict):
    """Print validation results."""
    print(f"\n🔍 Thumbnail Preflight - {results['episode_id']}")
    print("=" * 50)

    for component, info in results["components"].items():
        status = info["status"]
        path = info["path"]
        print(f"{status} {component}")
        print(f"   Path: {path}")
        if "size" in info:
            print(f"   Size: {info['size']}")
        print()

    if results["ready"]:
        print("✅ READY FOR GENERATION")
        print("\nNext command:")
        prompt_path = results["components"]["prompt"]["path"]
        output_dir = results["components"]["output_dir"]["path"]
        print(f"python scripts/gemini_generate_image.py --prompt-file {prompt_path} --output-dir {output_dir}")
    else:
        print("❌ NOT READY")
        print("\nErrors:")
        for error in results["errors"]:
            print(f"  - {error}")

    print("\n" + "=" * 50)

def main():
    parser = argparse.ArgumentParser(description="Check if all components are ready for thumbnail generation")
    parser.add_argument("episode", help="Episode ID (e.g., EP001)")
    parser.add_argument("--brief", help="Override brief file path")

    args = parser.parse_args()

    results = validate_episode(args.episode)
    print_results(results)

    if not results["ready"]:
        sys.exit(1)

if __name__ == "__main__":
    main()
