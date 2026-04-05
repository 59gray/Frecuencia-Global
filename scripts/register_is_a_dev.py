"""Register frecuencia-global.is-a.dev via a GitHub PR to is-a-dev/register.

Steps performed:
  1. Fork is-a-dev/register into the authenticated user's account (idempotent).
  2. Ensure the fork's default branch is up-to-date with upstream.
  3. Create a feature branch in the fork.
  4. Commit the domain JSON file (domains/frecuencia-global.json).
  5. Open a PR against is-a-dev/register with proof-of-ownership screenshot.

Usage:
    python scripts/register_is_a_dev.py --token <GITHUB_TOKEN>

Environment variable alternative:
    GITHUB_TOKEN=<token> python scripts/register_is_a_dev.py
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import time

import requests

UPSTREAM_OWNER = "is-a-dev"
UPSTREAM_REPO = "register"
UPSTREAM_DEFAULT_BRANCH = "main"

FG_GITHUB_USER = "59gray"
FG_EMAIL = "frecuenciag@outlook.com"
SUBDOMAIN = "frecuencia-global"
CNAME_TARGET = "frecuenciaglobal.vercel.app"

SCREENSHOT_URL = "__SCREENSHOT_URL__"

PR_TITLE = f"feat: add {SUBDOMAIN}.is-a.dev"
PR_BODY = f"""\
## New subdomain registration: `{SUBDOMAIN}.is-a.dev`

| Field | Value |
|---|---|
| GitHub user | [@{FG_GITHUB_USER}](https://github.com/{FG_GITHUB_USER}) |
| Subdomain | `{SUBDOMAIN}.is-a.dev` |
| Record type | `CNAME` |
| CNAME target | `{CNAME_TARGET}` |

### Proof of ownership

![screenshot]({SCREENSHOT_URL})

---
*Automated via `scripts/register_is_a_dev.py` in [59gray/Frecuencia-Global](https://github.com/59gray/Frecuencia-Global).*
"""

DOMAIN_JSON = {
    "owner": {
        "username": FG_GITHUB_USER,
        "email": FG_EMAIL,
    },
    "record": {
        "CNAME": CNAME_TARGET,
    },
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Register frecuencia-global.is-a.dev via GitHub PR.")
    parser.add_argument(
        "--token",
        default=os.environ.get("GITHUB_TOKEN"),
        help="GitHub personal access token with repo scope (or set GITHUB_TOKEN env var)",
    )
    parser.add_argument("--dry-run", action="store_true", help="Print actions without making API calls")
    return parser.parse_args()


class GitHubClient:
    BASE = "https://api.github.com"

    def __init__(self, token: str) -> None:
        self.session = requests.Session()
        self.session.headers.update(
            {
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            }
        )

    def get(self, path: str) -> dict:
        resp = self.session.get(f"{self.BASE}{path}")
        resp.raise_for_status()
        return resp.json()

    def post(self, path: str, **kwargs) -> dict:
        resp = self.session.post(f"{self.BASE}{path}", **kwargs)
        resp.raise_for_status()
        return resp.json()

    def put(self, path: str, **kwargs) -> dict:
        resp = self.session.put(f"{self.BASE}{path}", **kwargs)
        resp.raise_for_status()
        return resp.json()

    def current_user(self) -> str:
        return self.get("/user")["login"]

    # ------------------------------------------------------------------
    # Fork
    # ------------------------------------------------------------------

    def fork(self, owner: str, repo: str) -> dict:
        return self.post(f"/repos/{owner}/{repo}/forks")

    def get_repo(self, owner: str, repo: str) -> dict:
        return self.get(f"/repos/{owner}/{repo}")

    # ------------------------------------------------------------------
    # Refs / branches
    # ------------------------------------------------------------------

    def get_ref(self, owner: str, repo: str, ref: str) -> dict:
        return self.get(f"/repos/{owner}/{repo}/git/ref/{ref}")

    def create_ref(self, owner: str, repo: str, ref: str, sha: str) -> dict:
        return self.post(f"/repos/{owner}/{repo}/git/refs", json={"ref": f"refs/heads/{ref}", "sha": sha})

    # ------------------------------------------------------------------
    # File contents
    # ------------------------------------------------------------------

    def get_file(self, owner: str, repo: str, path: str, ref: str | None = None) -> dict | None:
        params = {}
        if ref:
            params["ref"] = ref
        resp = self.session.get(f"{self.BASE}/repos/{owner}/{repo}/contents/{path}", params=params)
        if resp.status_code == 404:
            return None
        resp.raise_for_status()
        return resp.json()

    def upsert_file(
        self,
        owner: str,
        repo: str,
        path: str,
        message: str,
        content: str,
        branch: str,
        sha: str | None = None,
    ) -> dict:
        payload: dict = {"message": message, "content": content, "branch": branch}
        if sha:
            payload["sha"] = sha
        return self.put(f"/repos/{owner}/{repo}/contents/{path}", json=payload)

    # ------------------------------------------------------------------
    # Pull requests
    # ------------------------------------------------------------------

    def list_prs(self, owner: str, repo: str, head: str) -> list:
        resp = self.session.get(
            f"{self.BASE}/repos/{owner}/{repo}/pulls",
            params={"state": "open", "head": head},
        )
        resp.raise_for_status()
        return resp.json()

    def create_pr(self, owner: str, repo: str, title: str, body: str, head: str, base: str) -> dict:
        return self.post(
            f"/repos/{owner}/{repo}/pulls",
            json={"title": title, "body": body, "head": head, "base": base},
        )


def wait_for_fork(gh: GitHubClient, fork_owner: str, repo: str, timeout: int = 60) -> dict:
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            return gh.get_repo(fork_owner, repo)
        except requests.HTTPError:
            time.sleep(3)
    raise TimeoutError(f"Fork {fork_owner}/{repo} not ready after {timeout}s")


def main() -> None:
    args = parse_args()

    if not args.token:
        raise SystemExit("ERROR: provide --token or set GITHUB_TOKEN env var")

    if SCREENSHOT_URL == "__SCREENSHOT_URL__":
        raise SystemExit(
            "ERROR: __SCREENSHOT_URL__ has not been replaced.\n"
            "Upload a screenshot to a GitHub issue/comment to get a public URL, "
            "then replace __SCREENSHOT_URL__ in this script with that URL."
        )

    gh = GitHubClient(args.token)
    actor = gh.current_user()
    print(f"Authenticated as: {actor}")

    domain_file = f"domains/{SUBDOMAIN}.json"
    branch_name = f"add-{SUBDOMAIN}"

    if args.dry_run:
        print("[dry-run] Would fork is-a-dev/register")
        print(f"[dry-run] Would create branch '{branch_name}' in {actor}/register")
        print(f"[dry-run] Would commit {domain_file}:")
        print(json.dumps(DOMAIN_JSON, indent=2))
        print(f"[dry-run] Would open PR: {PR_TITLE}")
        return

    # 1. Fork (idempotent — GitHub returns existing fork if already present)
    print(f"Forking {UPSTREAM_OWNER}/{UPSTREAM_REPO} ...")
    gh.fork(UPSTREAM_OWNER, UPSTREAM_REPO)
    fork = wait_for_fork(gh, actor, UPSTREAM_REPO)
    print(f"Fork ready: {fork['html_url']}")

    # 2. Get HEAD SHA of upstream default branch
    upstream_ref = gh.get_ref(UPSTREAM_OWNER, UPSTREAM_REPO, f"heads/{UPSTREAM_DEFAULT_BRANCH}")
    upstream_sha = upstream_ref["object"]["sha"]
    print(f"Upstream HEAD ({UPSTREAM_DEFAULT_BRANCH}): {upstream_sha}")

    # 3. Create feature branch in fork
    try:
        gh.create_ref(actor, UPSTREAM_REPO, branch_name, upstream_sha)
        print(f"Created branch '{branch_name}' in fork")
    except requests.HTTPError as exc:
        if exc.response is not None and exc.response.status_code == 422:
            print(f"Branch '{branch_name}' already exists in fork — reusing")
        else:
            raise

    # 4. Commit domain JSON
    content_b64 = base64.b64encode(json.dumps(DOMAIN_JSON, indent=2).encode()).decode()
    existing = gh.get_file(actor, UPSTREAM_REPO, domain_file, ref=branch_name)
    file_sha = existing["sha"] if existing else None
    gh.upsert_file(
        actor,
        UPSTREAM_REPO,
        domain_file,
        message=f"feat: add {SUBDOMAIN}.is-a.dev",
        content=content_b64,
        branch=branch_name,
        sha=file_sha,
    )
    print(f"Committed {domain_file}")

    # 5. Open PR (skip if already open)
    head_ref = f"{actor}:{branch_name}"
    existing_prs = gh.list_prs(UPSTREAM_OWNER, UPSTREAM_REPO, head=head_ref)
    if existing_prs:
        pr = existing_prs[0]
        print(f"PR already open: {pr['html_url']}")
    else:
        pr = gh.create_pr(
            UPSTREAM_OWNER,
            UPSTREAM_REPO,
            title=PR_TITLE,
            body=PR_BODY,
            head=head_ref,
            base=UPSTREAM_DEFAULT_BRANCH,
        )
        print(f"PR created: {pr['html_url']}")


if __name__ == "__main__":
    main()
