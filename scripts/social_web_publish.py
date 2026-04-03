import argparse
import os
import sys
import time
from pathlib import Path

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import sync_playwright


def stamp():
    return time.strftime("%Y%m%d-%H%M%S")


def ensure_dir(path_str):
    path = Path(path_str)
    path.mkdir(parents=True, exist_ok=True)
    return path


def read_caption(path_str):
    path = Path(path_str)
    text = path.read_text(encoding="utf-8")
    return text.strip()


def screenshot(page, out_dir, label):
    path = out_dir / f"{label}.png"
    page.screenshot(path=str(path), full_page=True)
    print(f"SCREENSHOT {path}")
    return path


def wait_visible(locator, timeout=15000):
    locator.wait_for(state="visible", timeout=timeout)
    return locator


def first_visible(page, selectors, timeout=5000):
    deadline = time.time() + (timeout / 1000)
    while time.time() < deadline:
        for selector in selectors:
            locator = page.locator(selector)
            try:
                count = locator.count()
            except Exception:
                continue
            for idx in range(count):
                candidate = locator.nth(idx)
                try:
                    if candidate.is_visible():
                        return candidate
                except Exception:
                    continue
        page.wait_for_timeout(250)
    raise RuntimeError(f"No visible selector matched: {selectors}")


def click_if_present(page, selectors, timeout=2500):
    try:
        locator = first_visible(page, selectors, timeout=timeout)
        locator.click()
        return True
    except Exception:
        return False


def fill_locator(locator, value):
    locator.click()
    locator.fill("")
    locator.fill(value)


def detect_block(page, platform):
    body = page.locator("body").inner_text(timeout=5000)
    block_terms = {
        "instagram": ["suspend", "challenge", "confirm it's you", "security code"],
        "tiktok": ["verify", "security check", "captcha", "unusual activity"],
    }
    terms = block_terms.get(platform, [])
    for term in terms:
        if term.lower() in body.lower():
            raise RuntimeError(f"{platform} blocked by challenge: {term}")


def login_instagram(page, username, password, out_dir):
    page.goto("https://www.instagram.com/accounts/login/", wait_until="domcontentloaded")
    page.wait_for_timeout(3000)
    screenshot(page, out_dir, "01_instagram_login")

    user_input = first_visible(
        page,
        [
            'input[name="username"]',
            'input[aria-label*="username" i]',
            'input[placeholder*="username" i]',
            'input[type="text"]',
        ],
        timeout=12000,
    )
    pass_input = first_visible(
        page,
        [
            'input[name="password"]',
            'input[aria-label*="password" i]',
            'input[placeholder*="password" i]',
            'input[type="password"]',
        ],
        timeout=12000,
    )

    fill_locator(user_input, username)
    fill_locator(pass_input, password)
    screenshot(page, out_dir, "02_instagram_credentials")

    try:
        submit = first_visible(
            page,
            [
                'button[type="submit"]',
                'button:has-text("Log in")',
                'button:has-text("Iniciar sesion")',
                'div[role="button"]:has-text("Log in")',
                'div[role="button"]:has-text("Iniciar sesion")',
                'div:has-text("Log in")',
            ],
            timeout=5000,
        )
        submit.click()
    except Exception:
        pass_input.press("Enter")
    page.wait_for_timeout(7000)
    screenshot(page, out_dir, "03_instagram_after_login")
    detect_block(page, "instagram")

    click_if_present(page, ['button:has-text("Not now")', 'div[role="button"]:has-text("Not now")'], timeout=4000)
    click_if_present(page, ['button:has-text("Ahora no")', 'div[role="button"]:has-text("Ahora no")'], timeout=4000)
    page.wait_for_timeout(2000)


def post_instagram(page, asset_path, caption, out_dir):
    page.goto("https://www.instagram.com/create/select/", wait_until="domcontentloaded")
    page.wait_for_timeout(4000)
    screenshot(page, out_dir, "04_instagram_create")
    detect_block(page, "instagram")

    file_input = first_visible(
        page,
        [
            'input[type="file"]',
            'input[accept*="image"]',
        ],
        timeout=12000,
    )
    file_input.set_input_files(str(asset_path))
    page.wait_for_timeout(5000)
    screenshot(page, out_dir, "05_instagram_uploaded")

    for idx in range(2):
        clicked = click_if_present(
            page,
            [
                'button:has-text("Next")',
                'div[role="button"]:has-text("Next")',
                'button:has-text("Siguiente")',
                'div[role="button"]:has-text("Siguiente")',
            ],
            timeout=8000,
        )
        if clicked:
            page.wait_for_timeout(3500)
            screenshot(page, out_dir, f"06_instagram_next_{idx + 1}")

    caption_box = first_visible(
        page,
        [
            'textarea[aria-label]',
            'div[contenteditable="true"][role="textbox"]',
            'textarea',
        ],
        timeout=12000,
    )
    caption_box.click()
    try:
        caption_box.fill("")
        caption_box.fill(caption)
    except Exception:
        page.keyboard.press("Control+A")
        page.keyboard.type(caption, delay=10)
    screenshot(page, out_dir, "07_instagram_caption")

    share = first_visible(
        page,
        [
            'button:has-text("Share")',
            'div[role="button"]:has-text("Share")',
            'button:has-text("Compartir")',
            'div[role="button"]:has-text("Compartir")',
        ],
        timeout=12000,
    )
    share.click()
    page.wait_for_timeout(10000)
    screenshot(page, out_dir, "08_instagram_after_share")

    page_text = page.locator("body").inner_text(timeout=5000)
    if "shared" in page_text.lower() or "compart" in page_text.lower():
        return
    if "/p/" in page.url or "instagram.com" in page.url:
        return
    raise RuntimeError("Instagram share did not confirm success")


def login_tiktok(page, username, password, out_dir):
    page.goto("https://www.tiktok.com/login/phone-or-email/email", wait_until="domcontentloaded")
    page.wait_for_timeout(5000)
    screenshot(page, out_dir, "01_tiktok_login")

    click_if_present(
        page,
        [
            'text="Log in with email or username"',
            'text="Use phone / email / username"',
            'text="Email / Username"',
            'text="Email or username"',
        ],
        timeout=5000,
    )
    page.wait_for_timeout(2000)

    user_input = first_visible(
        page,
        [
            'input[name="username"]',
            'input[placeholder*="Email or username" i]',
            'input[placeholder*="username" i]',
            'input[type="text"]',
        ],
        timeout=15000,
    )
    pass_input = first_visible(
        page,
        [
            'input[type="password"]',
            'input[placeholder*="Password" i]',
        ],
        timeout=15000,
    )

    fill_locator(user_input, username)
    fill_locator(pass_input, password)
    screenshot(page, out_dir, "02_tiktok_credentials")

    submit = first_visible(
        page,
        [
            'button[data-e2e="login-button"]',
            'button:has-text("Log in")',
            'button:has-text("Iniciar sesion")',
        ],
        timeout=12000,
    )
    submit.click()
    page.wait_for_timeout(9000)
    screenshot(page, out_dir, "03_tiktok_after_login")
    detect_block(page, "tiktok")


def post_tiktok(page, asset_path, caption, out_dir):
    upload_url = "https://www.tiktok.com/tiktokstudio/upload"
    page.goto(upload_url, wait_until="domcontentloaded")
    page.wait_for_timeout(5000)
    screenshot(page, out_dir, "04_tiktok_upload_start")
    detect_block(page, "tiktok")

    if "login" in page.url.lower():
        raise RuntimeError("TikTok still on login page")

    file_input = first_visible(
        page,
        [
            'input[type="file"]',
            'input[accept*="video"]',
        ],
        timeout=20000,
    )
    file_input.set_input_files(str(asset_path))
    page.wait_for_timeout(8000)
    screenshot(page, out_dir, "05_tiktok_uploaded")

    caption_box = first_visible(
        page,
        [
            'div[contenteditable="true"]',
            'textarea',
        ],
        timeout=15000,
    )
    caption_box.click()
    try:
        page.keyboard.press("Control+A")
    except Exception:
        pass
    page.keyboard.type(caption, delay=10)
    screenshot(page, out_dir, "06_tiktok_caption")

    post_button = first_visible(
        page,
        [
            'button:has-text("Post")',
            'button:has-text("Publish")',
            '[data-e2e="post_video_button"]',
        ],
        timeout=15000,
    )
    post_button.click()
    page.wait_for_timeout(12000)
    screenshot(page, out_dir, "07_tiktok_after_post")

    page_text = page.locator("body").inner_text(timeout=5000)
    if "posted" in page_text.lower() or "uploaded" in page_text.lower() or "manage posts" in page_text.lower():
        return
    if "tiktokstudio" in page.url.lower():
        return
    raise RuntimeError("TikTok post did not confirm success")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--platform", choices=["instagram", "tiktok"], required=True)
    parser.add_argument("--asset", required=True)
    parser.add_argument("--caption-file", required=True)
    parser.add_argument("--out-dir", required=True)
    parser.add_argument("--headed", action="store_true")
    args = parser.parse_args()

    asset_path = Path(args.asset).resolve()
    out_dir = ensure_dir(args.out_dir)
    caption = read_caption(args.caption_file)

    if not asset_path.exists():
        raise SystemExit(f"Asset not found: {asset_path}")

    if args.platform == "instagram":
        username = os.environ.get("FG_IG_USER")
        password = os.environ.get("FG_IG_PASS")
    else:
        username = os.environ.get("FG_TIKTOK_USER")
        password = os.environ.get("FG_TIKTOK_PASS")

    if not username or not password:
        raise SystemExit(f"Missing credentials for {args.platform}")

    profile_dir = ensure_dir(out_dir / f"profile-{args.platform}")
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            user_data_dir=str(profile_dir),
            channel="chrome",
            headless=not args.headed,
            viewport={"width": 1440, "height": 1024},
            args=["--disable-blink-features=AutomationControlled"],
        )
        try:
            page = browser.pages[0] if browser.pages else browser.new_page()
            page.set_default_timeout(20000)
            page.set_default_navigation_timeout(30000)

            if args.platform == "instagram":
                login_instagram(page, username, password, out_dir)
                post_instagram(page, asset_path, caption, out_dir)
            else:
                login_tiktok(page, username, password, out_dir)
                post_tiktok(page, asset_path, caption, out_dir)

            screenshot(page, out_dir, f"99_{args.platform}_final")
            print(f"{args.platform.upper()}_DONE {page.url}")
        finally:
            browser.close()


if __name__ == "__main__":
    try:
        main()
    except PlaywrightTimeoutError as exc:
        print(f"TIMEOUT {exc}", file=sys.stderr)
        raise
