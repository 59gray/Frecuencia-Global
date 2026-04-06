# Thumbnail Generation Workflow - Windsurf Edition

## Overview
Minimal, reusable workflow for thumbnail generation using Windsurf (Kimi + SWE + Gemini).

## Files Created/Modified

### New Scripts
- `scripts/validate_prompt.py` - Validates prompt files
- `scripts/thumbnail_preflight.py` - Checks if all components are ready
- `scripts/organize_outputs.py` - Organizes generated images with consistent naming

### Modified
- `scripts/gemini_generate_image.py` - Added `--prompt-file` and `--output-dir` arguments

## Quick Start Commands

### 1. Preflight Check
```bash
# Check if EP001 is ready
python scripts/thumbnail_preflight.py EP001
```

### 2. Validate Prompt
```bash
# Validate the prompt file
python scripts/validate_prompt.py system/gemini/prompts/PROMPT_EP001_THB_YT_v1.md
```

### 3. Generate Images
```bash
# Generate using prompt file with canonical output directory
python scripts/gemini_generate_image.py --prompt-file system/gemini/prompts/PROMPT_EP001_THB_YT_v1.md --output-dir 06_Assets/production/P1_001
```

### 4. Organize Outputs
```bash
# Move generated images to review folder
python scripts/organize_outputs.py --episode EP001 --type thumbnail
```

## Example: EP_001 Thumbnail Workflow

```bash
# Step 0: Check everything is ready
python scripts/thumbnail_preflight.py EP001

# Step 1: Validate prompt (optional but recommended)
python scripts/validate_prompt.py system/gemini/prompts/PROMPT_EP001_THB_YT_v1.md

# Step 2: Generate images to canonical location
python scripts/gemini_generate_image.py --prompt-file system/gemini/prompts/PROMPT_EP001_THB_YT_v1.md --output-dir 06_Assets/production/P1_001

# Step 3: Organize outputs to review folder
python scripts/organize_outputs.py --episode EP001 --type thumbnail

# Step 4: Manual overlay in Canva/Figma (not automated)
# Open Canva/Figma, import from 06_Assets/production/P1_001/review/
# Follow overlay instructions from the brief
```

## File Structure After Generation

```
06_Assets/production/P1_001/
├── review/                    # Generated backgrounds
│   ├── FG_EP001_THB_v1_20260405.png
│   ├── FG_EP001_THB_v2_20260405.png
│   └── FG_EP001_THB_v3_20260405.png
├── final/                     # Final thumbnails (after overlay)
│   └── EP001_THUMB_16x9_20260405.png
└── EP001_manifest.json       # Tracking file

06_Assets/latest_stable/thumbnails/  # Stable copies (when approved)
```

## Notes

- **Chrome Profile**: First time run `python scripts/gemini_generate_image.py --login-only`
- **Output Naming**: Consistent with `FG_[EPISODE]_THB_v[variant]_[date].png`
- **Asset Ops Structure**: Uses canonical `06_Assets/production/P1_XXX/` paths
- **No Canva/Figma Automation**: Still manual overlay required
- **No Commits**: All scripts are read-only, won't modify git

## Troubleshooting

### "Chrome profile not found"
Run: `python scripts/gemini_generate_image.py --login-only`

### "No generated files found"
Check: `06_Assets/production/P1_001/` for raw files, then run organize

### "Prompt validation failed"
Edit the prompt file to include required fields:
- Resolution (1280×720 or 1920×1080)
- Background description
- Composition details
- Avoid section
