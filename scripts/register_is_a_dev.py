"""
Registra frecuenciaglobal.is-a.dev via GitHub API.
Fork del repo is-a-dev/register, crea los archivos JSON y abre un PR.

Uso:
    python scripts/register_is_a_dev.py --token ghp_XXXX
"""

import argparse
import base64
import json
import time
import urllib.request
import urllib.error

UPSTREAM = "is-a-dev/register"
FORK_OWNER = "59gray"
BRANCH = "frecuenciaglobal-v2"
PR_TITLE = "Register frecuenciaglobal.is-a.dev"

# PR body must match the is-a-dev PR template exactly.
# Checkboxes must be [x] (lowercase, no spaces).
# BEFORE RUNNING: Ensure frecuenciaglobal.vercel.app returns 200 (not 401).
#   → Vercel Dashboard → Project Settings → Deployment Protection → disable or set to public.
# BEFORE RUNNING: Upload a real screenshot to GitHub and replace https://github.com/user-attachments/assets/7806a6c3-8e08-46a9-b8c2-68da8c890fd7 below.
#   → Go to any GitHub issue, paste screenshot, copy the uploaded URL.
PR_BODY = """\
# Requirements

- [x] I **agree** to the [Terms of Service](https://is-a.dev/terms).
- [x] My file is following the [domain structure](https://docs.is-a.dev/domain-structure/).
- [x] My website is **reachable** and **completed**.
- [x] My website is **software development** related.
- [x] My website is **not for commercial use**.
- [x] I have provided contact information in the `owner` key.
- [x] I have provided a preview of my website below.

# Website Preview

**Frecuencia Global** — Developer portfolio and international analysis project.

Live: https://website-three-rho-26.vercel.app

![Website Preview](https://github.com/user-attachments/assets/7806a6c3-8e08-46a9-b8c2-68da8c890fd7)
"""

FILES = {
    "domains/frecuenciaglobal.json": json.dumps({
        "owner": {
            "username": "59gray",
            "email": "frecuenciag@outlook.com"
        },
        "description": "Frecuencia Global - Developer portfolio and international analysis project",
        "records": {
            "A": ["216.198.79.1"],
            "MX": [
                {"target": "mx1.forwardemail.net", "priority": 10},
                {"target": "mx2.forwardemail.net", "priority": 20}
            ],
            "TXT": [
                "forward-email=contact:frecuenciag@outlook.com"
            ]
        }
    }, indent=2) + "\n",
    "domains/_vercel.frecuenciaglobal.json": json.dumps({
        "owner": {
            "username": "59gray",
            "email": "frecuenciag@outlook.com"
        },
        "records": {
            "TXT": ["vc-domain-verify=frecuenciaglobal.is-a.dev,f0cc958055d8faebfde4"]
        }
    }, indent=2) + "\n",
}


def gh_api(method, path, token, data=None):
    url = f"https://api.github.com{path}" if path.startswith("/") else path
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    if body:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        raise RuntimeError(f"GitHub API {e.code}: {err_body}")


def main():
    parser = argparse.ArgumentParser(description="Register frecuenciaglobal.is-a.dev")
    parser.add_argument("--token", required=True, help="GitHub Personal Access Token")
    args = parser.parse_args()
    token = args.token

    # 1. Fork the repo
    print(f"1/5  Forking {UPSTREAM}...")
    try:
        fork = gh_api("POST", f"/repos/{UPSTREAM}/forks", token, {
            "default_branch_only": True
        })
        fork_full = fork["full_name"]
        print(f"     Fork: {fork_full}")
    except RuntimeError as e:
        if "already exists" in str(e).lower() or "Name already exists" in str(e):
            fork_full = f"{FORK_OWNER}/register"
            print(f"     Fork already exists: {fork_full}")
        else:
            raise

    # Wait for fork to be ready
    print("     Waiting for fork to be ready...")
    time.sleep(5)

    # 2. Get default branch SHA
    print("2/5  Getting default branch info...")
    repo_info = gh_api("GET", f"/repos/{fork_full}", token)
    default_branch = repo_info["default_branch"]
    ref = gh_api("GET", f"/repos/{fork_full}/git/ref/heads/{default_branch}", token)
    base_sha = ref["object"]["sha"]
    print(f"     Default branch: {default_branch} @ {base_sha[:8]}")

    # 3. Create feature branch
    print(f"3/5  Creating branch '{BRANCH}'...")
    try:
        gh_api("POST", f"/repos/{fork_full}/git/refs", token, {
            "ref": f"refs/heads/{BRANCH}",
            "sha": base_sha
        })
        print(f"     Branch created.")
    except RuntimeError as e:
        if "Reference already exists" in str(e):
            print(f"     Branch already exists, updating...")
            gh_api("PATCH", f"/repos/{fork_full}/git/refs/heads/{BRANCH}", token, {
                "sha": base_sha,
                "force": True
            })
        else:
            raise

    # 4. Create files
    print("4/5  Creating domain files...")
    for filepath, content in FILES.items():
        encoded = base64.b64encode(content.encode()).decode()
        try:
            gh_api("PUT", f"/repos/{fork_full}/contents/{filepath}", token, {
                "message": f"Add {filepath}",
                "content": encoded,
                "branch": BRANCH
            })
            print(f"     Created {filepath}")
        except RuntimeError as e:
            if "sha" in str(e) and "already exists" in str(e).lower():
                # File exists, get its SHA and update
                existing = gh_api("GET", f"/repos/{fork_full}/contents/{filepath}?ref={BRANCH}", token)
                gh_api("PUT", f"/repos/{fork_full}/contents/{filepath}", token, {
                    "message": f"Update {filepath}",
                    "content": encoded,
                    "sha": existing["sha"],
                    "branch": BRANCH
                })
                print(f"     Updated {filepath}")
            else:
                raise

    # 5. Create PR
    print("5/5  Opening Pull Request...")
    pr = gh_api("POST", f"/repos/{UPSTREAM}/pulls", token, {
        "title": PR_TITLE,
        "body": PR_BODY,
        "head": f"{FORK_OWNER}:{BRANCH}",
        "base": default_branch
    })
    print(f"\n✅ PR creado: {pr['html_url']}")
    print("   Ahora toca esperar a que lo mergeen (horas a ~2 días).")


if __name__ == "__main__":
    main()
