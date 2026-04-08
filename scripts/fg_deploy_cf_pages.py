"""Deploy Frecuencia Global website to Cloudflare Pages.

Builds the Astro site and deploys to Cloudflare Pages using Wrangler CLI.

Usage:
    python scripts/fg_deploy_cf_pages.py              # full deploy
    python scripts/fg_deploy_cf_pages.py --skip-build # deploy only (already built)
    python scripts/fg_deploy_cf_pages.py --dry-run     # build only, no deploy

Requirements:
    - Wrangler CLI installed and authenticated (npm install -g wrangler)
    - Cloudflare account with Pages project configured
    - WEBSITE_URL in fg_automation_config must point to Cloudflare Pages URL
"""

import sys
import subprocess
import argparse
from pathlib import Path
from datetime import datetime

sys.path.insert(0, str(Path(__file__).resolve().parent))
from utils import get_optional_secret, FGConfig

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
WEBSITE_DIR = FGConfig.website_dir()
DIST_DIR = WEBSITE_DIR / "dist"
WEBSITE_URL = FGConfig.WEBSITE_URL

TELEGRAM_BOT_TOKEN = get_optional_secret("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = get_optional_secret("TELEGRAM_CHAT_ID")


def now():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def log(msg):
    print(f"[{now()}] {msg}")


def run(cmd, cwd=None, check=True):
    """Run a command and return the result."""
    log(f"  $ {' '.join(str(c) for c in cmd)}")
    result = subprocess.run(
        cmd, cwd=str(cwd) if cwd else None,
        capture_output=True, text=True, timeout=180
    )
    if check and result.returncode != 0:
        log(f"  ERROR (exit {result.returncode}): {result.stderr.strip()}")
        return None
    return result


def send_telegram(message):
    """Send Telegram notification."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return False
    import urllib.request
    import json
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    data = json.dumps({"chat_id": TELEGRAM_CHAT_ID, "text": message}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        return resp.status == 200
    except Exception as e:
        log(f"  Telegram error: {e}")
        return False


def check_wrangler():
    """Check if Wrangler CLI is installed."""
    result = run(["npx", "wrangler", "--version"], check=False)
    if result is None or result.returncode != 0:
        log("ERROR: Wrangler CLI not found")
        log("Install with: npm install -g wrangler")
        log("Or authenticate with: npx wrangler login")
        return False
    log(f"  Wrangler version: {result.stdout.strip()}")
    return True


def build_site():
    """Build the Astro site."""
    log("Building Astro site for Cloudflare Pages...")
    result = run(["npm", "run", "build"], cwd=WEBSITE_DIR)
    if result is None:
        return False
    pages = list(DIST_DIR.rglob("index.html"))
    log(f"  Build complete: {len(pages)} pages")
    return True


def deploy_to_cf_pages(dry_run=False):
    """Deploy dist/ to Cloudflare Pages using Wrangler."""
    if dry_run:
        log("DRY RUN: skipping Cloudflare Pages deploy")
        return True

    log("Deploying to Cloudflare Pages...")
    
    # Check if project name is configured
    project_name = "frecuencia-global"
    
    # Deploy using wrangler pages deploy
    result = run(
        ["npx", "wrangler", "pages", "deploy", str(DIST_DIR), 
         "--project-name", project_name],
        cwd=WEBSITE_DIR,
        check=False
    )
    
    if result is None or result.returncode != 0:
        log("  Deploy command failed")
        if result and result.stderr:
            log(f"  Error: {result.stderr[:500]}")
        return False
    
    log("  Deploy command executed successfully")
    if result and result.stdout:
        log(f"  Output: {result.stdout[:500]}")
    return True


def verify_deploy():
    """Wait and verify the site is live."""
    import time
    import urllib.request
    
    log("Waiting 30s for Cloudflare Pages to propagate...")
    time.sleep(30)
    
    try:
        req = urllib.request.Request(WEBSITE_URL, method="HEAD")
        req.add_header("User-Agent", "FG-Deploy-Agent/1.0")
        resp = urllib.request.urlopen(req, timeout=15)
        status = resp.status
    except Exception:
        status = 0
    
    try:
        stack_url = f"{WEBSITE_URL}/stack"
        req = urllib.request.Request(stack_url, method="HEAD")
        req.add_header("User-Agent", "FG-Deploy-Agent/1.0")
        resp = urllib.request.urlopen(req, timeout=15)
        stack_status = resp.status
    except Exception:
        stack_status = 0
    
    log(f"  / → HTTP {status}")
    log(f"  /stack → HTTP {stack_status}")
    
    if status == 200 and stack_status == 200:
        log("DEPLOY VERIFIED: Site is live on Cloudflare Pages!")
        return True
    else:
        log("DEPLOY PENDING: Site not yet reachable (may need more propagation time)")
        return False


def main():
    parser = argparse.ArgumentParser(description="Deploy Frecuencia Global to Cloudflare Pages")
    parser.add_argument("--skip-build", action="store_true", help="Skip npm build")
    parser.add_argument("--dry-run", action="store_true", help="Build only, don't deploy")
    parser.add_argument("--skip-verify", action="store_true", help="Skip post-deploy verification")
    args = parser.parse_args()

    log("=" * 60)
    log("FG Deploy Agent - Cloudflare Pages")
    log("=" * 60)

    # Check Wrangler
    if not check_wrangler():
        sys.exit(1)

    # Step 1: Build
    if not args.skip_build:
        if not build_site():
            log("BUILD FAILED - aborting")
            sys.exit(1)
    else:
        log("Skipping build (--skip-build)")
        if not DIST_DIR.exists():
            log(f"ERROR: dist/ not found at {DIST_DIR}")
            sys.exit(1)

    # Step 2: Deploy
    if not deploy_to_cf_pages(dry_run=args.dry_run):
        log("DEPLOY FAILED - aborting")
        send_telegram(f"❌ FG Cloudflare Pages Deploy FAILED\n{WEBSITE_URL}")
        sys.exit(1)

    if args.dry_run:
        log("DRY RUN complete. Build successful, no deploy.")
        sys.exit(0)

    # Step 3: Verify
    verified = False
    if not args.skip_verify:
        verified = verify_deploy()

    # Step 4: Notify
    pages = len(list(DIST_DIR.rglob("index.html")))
    status_emoji = "✅" if verified else "⏳"
    msg = (
        f"{status_emoji} FG Deploy to Cloudflare Pages\n\n"
        f"URL: {WEBSITE_URL}\n"
        f"Pages: {pages}\n"
        f"Stack: {WEBSITE_URL}/stack\n"
        f"Verified: {'YES' if verified else 'PENDING'}\n"
        f"Time: {now()}"
    )
    send_telegram(msg)
    log(msg)

    log("=" * 60)
    log("Deploy complete!")
    log("=" * 60)


if __name__ == "__main__":
    main()
