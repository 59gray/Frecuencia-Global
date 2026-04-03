from __future__ import annotations

import argparse
import base64
import os
from pathlib import Path
import subprocess
import time
import urllib.request

from playwright.sync_api import sync_playwright

from fg_automation_config import chrome_executable, chrome_profile_dir, repo_path

CDP_URL = "http://127.0.0.1:9222"
CDP_VERSION_URL = f"{CDP_URL}/json/version"
CHROME_EXE = str(chrome_executable())
CHROME_PROFILE_DIR = str(chrome_profile_dir("gemini-maya"))
GEMINI_URL = "https://gemini.google.com/app"


def cdp_is_ready() -> bool:
    try:
        with urllib.request.urlopen(CDP_VERSION_URL, timeout=2) as response:
            return response.status == 200
    except Exception:
        return False


def start_chrome_debug() -> None:
    os.makedirs(CHROME_PROFILE_DIR, exist_ok=True)
    cmd = [
        CHROME_EXE,
        "--remote-debugging-port=9222",
        f"--user-data-dir={CHROME_PROFILE_DIR}",
        "--profile-directory=Default",
        GEMINI_URL,
    ]
    subprocess.Popen(cmd)


def wait_for_login(page, timeout_seconds: int = 300) -> None:
    if "accounts.google.com" not in page.url:
        return

    print("Gemini requires Google login. Complete login in the opened Chrome window...")
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        if "accounts.google.com" not in page.url and "gemini.google.com" in page.url:
            print("Google login detected as completed.")
            return
        time.sleep(2)

    raise TimeoutError("Google login was not completed in time.")


def find_input(page):
    selectors = [
        'div[contenteditable="true"]',
        "rich-textarea div[contenteditable]",
        ".ql-editor",
        "textarea",
        '[role="textbox"]',
        "p[data-placeholder]",
    ]
    for sel in selectors:
        loc = page.locator(sel)
        for i in range(loc.count()):
            try:
                candidate = loc.nth(i)
                if candidate.is_visible(timeout=1500):
                    return candidate
            except Exception:
                pass
    return None


def ensure_image_tool_selected(page) -> None:
    selected = page.locator('button[aria-label*="Deselect Create image"]')
    if selected.count() > 0:
        try:
            if selected.first.is_visible(timeout=1000):
                print("Create image tool is already selected.")
                return
        except Exception:
            pass

    trigger = page.locator('button[aria-label*="Create image"]')
    if trigger.count() == 0:
        raise RuntimeError("Gemini Create image tool button was not found.")

    trigger.first.click(timeout=10000)
    time.sleep(2)
    print("Create image tool selected.")


def attach_reference_image(page, image_path: str) -> bool:
    try:
        ensure_image_tool_selected(page)
    except Exception as exc:
        print(f"Could not select Create image tool: {exc}")
        return False

    file_inputs = page.locator('input[type="file"]')
    for i in range(file_inputs.count()):
        try:
            file_inputs.nth(i).set_input_files(image_path)
            print(f"Reference image attached via existing file input: {image_path}")
            time.sleep(2)
            return True
        except Exception:
            pass

    upload_toggle_selectors = [
        'button[aria-label="Open upload file menu"]',
        'button[aria-label*="Open upload file menu"]',
        'button[aria-label*="upload file menu"]',
    ]
    upload_menu_selectors = [
        '[data-test-id="local-images-files-uploader-button"]',
        'button[role="menuitem"][aria-label*="Upload files"]',
        'button[role="menuitem"]:has-text("Upload files")',
        'button[aria-label*="Upload files"]',
        'button:has-text("Upload files")',
    ]

    for toggle_sel in upload_toggle_selectors:
        try:
            upload_toggle = page.locator(toggle_sel).first
            if not upload_toggle.is_visible(timeout=1000):
                continue

            upload_toggle.click(timeout=10000)
            time.sleep(1)
        except Exception:
            continue

        for menu_sel in upload_menu_selectors:
            try:
                upload_menu_item = page.locator(menu_sel).first
                if not upload_menu_item.is_visible(timeout=1500):
                    continue

                with page.expect_file_chooser(timeout=10000) as fc_info:
                    upload_menu_item.click(timeout=10000)
                file_chooser = fc_info.value
                file_chooser.set_files(image_path)

                preview = page.locator('div.text-input-field img').first
                remove_button = page.locator('button[aria-label^="Remove file"]').first
                try:
                    preview.wait_for(state="visible", timeout=10000)
                except Exception:
                    remove_button.wait_for(state="visible", timeout=10000)

                print(f"Reference image attached via Gemini upload menu: {image_path}")
                time.sleep(2)
                return True
            except Exception as exc:
                print(f"Upload attempt failed for selector {menu_sel}: {exc}")

    print("Upload files menu item was not found.")
    return False


def start_new_chat(page) -> None:
    new_chat_button = page.locator('[aria-label="New chat"]')
    if new_chat_button.count() == 0:
        return

    try:
        new_chat_button.first.click(timeout=5000)
        time.sleep(2)
        print("Started a fresh Gemini chat.")
    except Exception:
        pass


def close_upload_menu_if_open(page) -> None:
    close_button = page.locator('button[aria-label*="Close upload file menu"]')
    if close_button.count() == 0:
        return

    try:
        if close_button.first.is_visible(timeout=1000):
            close_button.first.click(timeout=3000)
            time.sleep(1)
    except Exception:
        pass


def dismiss_google_photos_picker_if_open(page) -> None:
    close_selectors = [
        'button[aria-label*="Close"]',
        'button[aria-label*="Dismiss"]',
        'button:has-text("Cancel")',
        'button:has-text("Close")',
    ]
    for sel in close_selectors:
        try:
            btn = page.locator(sel)
            if btn.count() > 0 and btn.first.is_visible(timeout=500):
                btn.first.click(timeout=2000)
                time.sleep(1)
                return
        except Exception:
            pass
    return False


def wait_for_image(page, timeout_s: int = 240):
    deadline = time.time() + timeout_s
    initial_count = page.locator("img").count()
    print(f"Initial image count on Gemini page: {initial_count}")

    while time.time() < deadline:
        all_imgs = page.locator("img")
        for i in range(all_imgs.count()):
            try:
                el = all_imgs.nth(i)
                src = el.get_attribute("src", timeout=500)
                if not src:
                    continue

                dims = page.evaluate(
                    """(img) => ({
                        nw: img.naturalWidth || 0,
                        nh: img.naturalHeight || 0,
                        src: (img.src || '').substring(0, 120)
                    })""",
                    el.element_handle(),
                )

                if dims.get("nw", 0) >= 256 and dims.get("nh", 0) >= 256:
                    print(f"Large image found: {dims['nw']}x{dims['nh']} - {dims['src']}")
                    return el
            except Exception:
                pass

        time.sleep(5)

    return None


def download_image_from_page(page, img_element, output_path: str) -> bool:
    src = img_element.get_attribute("src")
    if not src:
        return False

    print(f"Image source: {src[:100]}...")

    if src.startswith("data:image"):
        _, data = src.split(",", 1)
        with open(output_path, "wb") as f:
            f.write(base64.b64decode(data))
        return True

    if src.startswith("blob:"):
        data_url = page.evaluate(
            """(imgEl) => {
                return new Promise((resolve) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = imgEl.naturalWidth || imgEl.width;
                    canvas.height = imgEl.naturalHeight || imgEl.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(imgEl, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                });
            }""",
            img_element.element_handle(),
        )
        if data_url and data_url.startswith("data:image"):
            _, data = data_url.split(",", 1)
            with open(output_path, "wb") as f:
                f.write(base64.b64decode(data))
            return True

    if src.startswith("http"):
        download_url = src
        if "googleusercontent" in src or "lh3" in src:
            base = src.split("=")[0] if "=" in src else src
            download_url = base + "=s0"
        try:
            urllib.request.urlretrieve(download_url, output_path)
            return True
        except Exception:
            pass

        try:
            data_url = page.evaluate(
                """async (imgEl) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = imgEl.naturalWidth || imgEl.width;
                    canvas.height = imgEl.naturalHeight || imgEl.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(imgEl, 0, 0);
                    return canvas.toDataURL('image/png');
                }""",
                img_element.element_handle(),
            )
            if data_url and data_url.startswith("data:image"):
                _, data = data_url.split(",", 1)
                with open(output_path, "wb") as f:
                    f.write(base64.b64decode(data))
                return True
        except Exception:
            pass

        try:
            img_element.screenshot(path=output_path)
            return True
        except Exception:
            pass

    return False


def read_prompt(prompt_file: str) -> str:
    return Path(prompt_file).read_text(encoding="utf-8").strip()


def send_prompt(page, prompt: str) -> None:
    input_el = find_input(page)
    if input_el is None:
        raise RuntimeError("Gemini input box was not found.")

    input_el.click(force=True)
    time.sleep(0.5)
    input_el.fill(prompt)
    time.sleep(1)

    send_selectors = [
        'button[aria-label*="Send"]',
        'button[aria-label*="Enviar"]',
        "button.send-button",
        'button[data-test-id="send-button"]',
    ]

    for sel in send_selectors:
        try:
            btn = page.locator(sel).first
            if btn.is_visible(timeout=1000):
                btn.click(timeout=2000)
                print(f"Prompt sent via button selector: {sel}")
                return
        except Exception:
            pass

    input_el.press("Enter")
    print("Prompt sent via Enter.")


def run(prompt_file: str, output_file: str, reference_image: str | None) -> None:
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    prompt = read_prompt(prompt_file)

    if not cdp_is_ready():
        print("Starting Chrome with remote debugging on port 9222...")
        start_chrome_debug()
        for _ in range(45):
            time.sleep(1)
            if cdp_is_ready():
                break
        else:
            raise RuntimeError("Chrome remote debugging did not start on port 9222.")

    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(CDP_URL)
        context = browser.contexts[0] if browser.contexts else browser.new_context()
        page = context.new_page()

        print("Opening Gemini...")
        page.goto(GEMINI_URL, wait_until="domcontentloaded")
        time.sleep(8)

        wait_for_login(page)
        page.goto(GEMINI_URL, wait_until="domcontentloaded")
        time.sleep(5)
        start_new_chat(page)
        dismiss_google_photos_picker_if_open(page)
        close_upload_menu_if_open(page)

        if reference_image:
            attach_reference_image(page, reference_image)

        send_prompt(page, prompt)
        print("Waiting for Gemini image generation...")
        img_el = wait_for_image(page, timeout_s=240)

        verify_path = str(output_path.with_name(output_path.stem + "_verify.png"))
        page.screenshot(path=verify_path, full_page=True)
        print(f"Verification screenshot saved: {verify_path}")

        if img_el is None:
            raise RuntimeError("Gemini did not return an image within the time limit.")

        if not download_image_from_page(page, img_el, str(output_path)):
            raise RuntimeError("Could not download the generated Gemini image.")

        size = output_path.stat().st_size
        print(f"Generated image saved: {output_path} ({size} bytes)")
        browser.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Maya Host images via Gemini web automation.")
    parser.add_argument("--prompt-file", required=True)
    parser.add_argument("--output-file", required=True)
    parser.add_argument("--reference-image")
    args = parser.parse_args()

    reference_image = args.reference_image
    if reference_image:
        reference_image = str(Path(reference_image).resolve())

    run(args.prompt_file, args.output_file, reference_image)


if __name__ == "__main__":
    main()
