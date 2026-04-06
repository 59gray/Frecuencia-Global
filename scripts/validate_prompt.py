#!/usr/bin/env python3
"""
Validate prompt files for Gemini image generation.

Usage:
    python scripts/validate_prompt.py PROMPT_EP001_THB_YT_v1.md
    python scripts/validate_prompt.py system/gemini/prompts/PROMPT_*.md

Validates:
- File exists and is readable
- Has required sections (prompt block)
- Prompt length is reasonable (not too short, not too long)
- Contains required fields for Nano Banana 2
"""

import sys
import re
from pathlib import Path

# Required fields for Nano Banana 2 prompts
REQUIRED_FIELDS = [
    "1280×720",  # or 1920×1080 for higher resolution
    "background",
    "composition",
    "avoid"
]

def validate_prompt_file(prompt_path: Path) -> tuple[bool, str]:
    """Validate a single prompt file.
    
    Returns:
        (is_valid, message)
    """
    if not prompt_path.exists():
        return False, f"❌ File not found: {prompt_path}"
    
    if not prompt_path.suffix == ".md":
        return False, f"❌ Not a markdown file: {prompt_path}"
    
    try:
        content = prompt_path.read_text(encoding="utf-8")
    except Exception as e:
        return False, f"❌ Error reading file: {e}"
    
    # Check if file is empty
    if len(content.strip()) < 50:
        return False, "❌ File is too short or empty"
    
    # Extract prompt block (code block with actual prompt)
    prompt_blocks = re.findall(r"```[^\n]*\n(.*?)```", content, re.DOTALL)
    
    if not prompt_blocks:
        return False, "❌ No code block found with prompt content"
    
    if len(prompt_blocks) > 1:
        return False, "⚠️ Multiple code blocks found - using first one"
    
    prompt_content = prompt_blocks[0].strip()
    
    # Check prompt length
    if len(prompt_content) < 100:
        return False, "❌ Prompt too short (< 100 chars)"
    
    if len(prompt_content) > 4000:
        return False, "⚠️ Prompt very long (> 4000 chars) - may be truncated"
    
    # Check for required fields
    prompt_lower = prompt_content.lower()
    missing_fields = []
    
    for field in REQUIRED_FIELDS:
        if field.lower() not in prompt_lower:
            missing_fields.append(field)
    
    if missing_fields:
        return False, f"❌ Missing required fields: {', '.join(missing_fields)}"
    
    # Check for common issues
    issues = []
    
    if "text" in prompt_lower and "no text" not in prompt_lower:
        issues.append("Contains 'text' but no 'no text' instruction")
    
    if "logo" in prompt_lower and "no logo" not in prompt_lower:
        issues.append("Contains 'logo' but no 'no logo' instruction")
    
    if "watermark" in prompt_lower and "no watermark" not in prompt_lower:
        issues.append("Contains 'watermark' but no 'no watermark' instruction")
    
    if issues:
        return False, f"⚠️ Potential issues: {'; '.join(issues)}"
    
    return True, f"✅ Valid prompt ({len(prompt_content)} chars)"

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/validate_prompt.py <prompt_file.md>")
        sys.exit(1)
    
    prompt_file = Path(sys.argv[1])
    
    is_valid, message = validate_prompt_file(prompt_file)
    
    print(f"Validating: {prompt_file}")
    print(message)
    
    if not is_valid:
        sys.exit(1)
    
    print(f"✅ Prompt ready for generation")

if __name__ == "__main__":
    main()
