#!/usr/bin/env python3
"""
Frecuencia Global — Automatic Checkpoint Generator
===================================================
Generates project state snapshots for strategic review with Maya (ChatGPT).

Outputs:
  1. 01_Estrategia/FG_Checkpoint_AUTO_YYYY-MM-DD_HHMM.md
  2. system/memory/STATE_PROJECT.json
  3. 07_Operaciones/logs/checkpoint_log_YYYY-MM-DD.json
  4. system/memory/checkpoint_payload_latest.json
    5. system/memory/checkpoints_chat_setup_latest.md

Usage:
  python scripts/generate_checkpoint.py
  python scripts/generate_checkpoint.py --hours 24
  python scripts/generate_checkpoint.py --no-n8n
"""

import json
import os
import subprocess
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import URLError

try:
    from zoneinfo import ZoneInfo
except ImportError:  # pragma: no cover
    ZoneInfo = None  # type: ignore

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent

SCAN_DIRS = [
    "system",
    "01_Estrategia",
    "02_Brand_System",
    "03_Editorial",
    "04_Produccion",
    "05_Monetizacion",
    "06_Assets",
    "07_Operaciones",
    "08_n8n",
    "website",
    "scripts",
    "Frecuencia_Global_Assets_Base",
    ".github/agents",
    ".github/instructions",
]

SKIP_DIRS = {
    ".git", "node_modules", "__pycache__", ".venv", "dist",
    "workflows_runtime", "workflows_fixed",
    "workflows_import_ready", "workflows_import_ready_v1",
    ".playwright-mcp",
}

KEY_FILE_PATTERNS = [
    "SISTEMA_MAESTRO", "ROADMAP", "Blueprint", "Brand_Kit",
    "Checkpoint", "Brief", "Script", "QA", "PublishReady",
    "Operations_Log", "STATE_PROJECT",
]

N8N_WEBHOOK_URL = os.environ.get(
    "FG_CHECKPOINT_WEBHOOK",
    "http://localhost:5678/webhook/checkpoint",
)

DEFAULT_LOOKBACK_HOURS = 24
CHECKPOINT_TIMEZONE = "America/Monterrey"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def run_git(*args: str) -> tuple[str, int]:
    """Run a git command in the repo root. Returns (stdout, returncode)."""
    try:
        r = subprocess.run(
            ["git", *args],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            timeout=30,
            encoding="utf-8",
            errors="replace",
        )
        return r.stdout.strip(), r.returncode
    except FileNotFoundError:
        return "", 127  # git not installed
    except Exception:
        return "", 1


def get_git_info() -> dict:
    """Gather git repository status."""
    branch, _ = run_git("branch", "--show-current")
    status_raw, rc_status = run_git("status", "--porcelain")
    diff_raw, _ = run_git("diff", "--name-only", "HEAD")
    log_raw, _ = run_git("log", "--oneline", "-5", "--no-decorate")

    changed = [l for l in status_raw.splitlines() if l.strip()] if rc_status == 0 else []
    diff_files = [l for l in diff_raw.splitlines() if l.strip()]
    recent_commits = [l for l in log_raw.splitlines() if l.strip()]

    return {
        "branch": branch or "unknown",
        "is_dirty": len(changed) > 0,
        "status": "dirty" if changed else "clean",
        "changed_files": changed,
        "diff_files": diff_files,
        "uncommitted_count": len(changed),
        "recent_commits": recent_commits[:5],
    }


def scan_directory(base_dir: str, cutoff: float) -> tuple[list[str], list[str]]:
    """
    Walk *base_dir* inside the repo and return two lists:
      (new_files, modified_files) whose mtime >= cutoff.
    On Windows ctime = creation time, so ctime >= cutoff -> new.
    """
    new_files: list[str] = []
    modified_files: list[str] = []
    scan_path = REPO_ROOT / base_dir

    if not scan_path.exists():
        return new_files, modified_files

    for root, dirs, files in os.walk(scan_path):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".")]
        for fname in files:
            fpath = Path(root) / fname
            try:
                st = fpath.stat()
                if st.st_mtime < cutoff:
                    continue
                rel = str(fpath.relative_to(REPO_ROOT)).replace("\\", "/")
                if st.st_ctime >= cutoff:
                    new_files.append(rel)
                else:
                    modified_files.append(rel)
            except (OSError, ValueError):
                continue

    return new_files, modified_files


def check_website() -> dict:
    """Return website build & content status."""
    dist = REPO_ROOT / "website" / "dist"
    pkg = REPO_ROOT / "website" / "package.json"
    articles = REPO_ROOT / "website" / "src" / "content" / "articles"

    info: dict = {
        "build_exists": dist.exists(),
        "build_fresh": False,
        "build_age_hours": None,
        "package_json": pkg.exists(),
        "article_count": 0,
    }

    if dist.exists():
        idx = dist / "index.html"
        if idx.exists():
            age_h = (time.time() - idx.stat().st_mtime) / 3600
            info["build_age_hours"] = round(age_h, 1)
            info["build_fresh"] = age_h < 48

    if articles.exists():
        info["article_count"] = sum(1 for f in articles.iterdir() if f.suffix == ".md")

    return info


def check_assets() -> list[str]:
    """List relevant asset files found in the repo."""
    found: list[str] = []
    assets_base = REPO_ROOT / "Frecuencia_Global_Assets_Base" / "assets"
    if assets_base.exists():
        for f in sorted(assets_base.iterdir()):
            if f.is_file() and f.suffix.lower() in (".svg", ".png", ".jpg", ".jpeg", ".webp"):
                found.append(f"Frecuencia_Global_Assets_Base/assets/{f.name}")

    yt = REPO_ROOT / "06_Assets" / "fg_youtube_watermark_150.png"
    if yt.exists():
        found.append("06_Assets/fg_youtube_watermark_150.png")

    logo_dir = REPO_ROOT / "website" / "public" / "images" / "logo"
    if logo_dir.exists():
        for f in sorted(logo_dir.iterdir()):
            if f.is_file():
                found.append(f"website/public/images/logo/{f.name}")

    return found


def detect_blockers() -> list[str]:
    """Detect visible blockers from the filesystem."""
    blockers: list[str] = []

    # 1. Check for published content (PublishReady files or similar)
    prod = REPO_ROOT / "04_Produccion"
    has_publish_ready = False
    if prod.exists():
        for f in prod.iterdir():
            if "PublishReady" in f.name or "published" in f.name.lower():
                has_publish_ready = True
                break
    if not has_publish_ready:
        blockers.append("0 piezas publicadas en ninguna plataforma")

    # 2. Website build
    dist = REPO_ROOT / "website" / "dist"
    if not dist.exists():
        blockers.append("Website: sin build generado (dist/ no existe)")
    else:
        idx = dist / "index.html"
        if idx.exists():
            age_h = (time.time() - idx.stat().st_mtime) / 3600
            if age_h > 168:  # > 1 week
                blockers.append(f"Website: build tiene {age_h:.0f}h de antigüedad (>1 semana)")

    # 3. Monetización vacía
    mon = REPO_ROOT / "05_Monetizacion"
    if mon.exists() and not any(mon.iterdir()):
        pass  # known, not a blocker yet (Phase 3)

    return blockers


def derive_priorities(blockers: list[str], website: dict) -> list[str]:
    """Generate ordered priority list based on current state."""
    prios: list[str] = []
    if any("0 piezas publicadas" in b for b in blockers):
        prios.append("P0: Publicar primera pieza en al menos 1 plataforma")
    if not website.get("build_fresh") and website.get("build_exists"):
        prios.append("P0: Rebuild y deploy del website a Vercel")
    elif not website.get("build_exists"):
        prios.append("P0: Generar build del website y deploy a Vercel")
    prios.extend([
        "P1: Diseño final de P1_001 en Canva — verificar y exportar",
        "P1: Configurar Canva Brand Kit nativo (6 colores + 3 fuentes)",
        "P1: Banner YouTube (2560×1440) diseñado y subido",
        "P2: Guías editoriales por pilar",
        "P2: Levantar n8n y testear workflows completos",
    ])
    return prios


def load_previous_state() -> dict:
    """Load the previous STATE_PROJECT.json, if any."""
    sf = REPO_ROOT / "system" / "memory" / "STATE_PROJECT.json"
    if sf.exists() and sf.stat().st_size > 10:
        try:
            return json.loads(sf.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            pass
    return {}


def get_checkpoint_now() -> tuple[datetime, str]:
    """Return checkpoint datetime in America/Monterrey if available, else local time."""
    if ZoneInfo is not None:
        try:
            return datetime.now(ZoneInfo(CHECKPOINT_TIMEZONE)), CHECKPOINT_TIMEZONE
        except Exception:
            pass
    return datetime.now().astimezone(), "local-system"


# ---------------------------------------------------------------------------
# Writers
# ---------------------------------------------------------------------------

def write_checkpoint_md(path: Path, data: dict) -> None:
    """Write the human-readable checkpoint markdown."""
    ts = data["timestamp_human"]
    git = data["git"]
    ws = data["website"]
    n_new = len(data["new_files"])
    n_mod = len(data["modified_files"])
    n_areas = len(data["touched_areas"])

    L: list[str] = []  # line accumulator
    a = L.append

    a("# Frecuencia Global — Checkpoint Automático")
    a("")
    a(f"**Generado:** {ts}")
    a("**Tipo:** Automático (generate_checkpoint.py)")
    a(f"**Repo:** {git['status']} (branch: `{git['branch']}`)")
    a(f"**Archivos sin commit:** {git['uncommitted_count']}")
    if data["previous_checkpoint"] and data["previous_checkpoint"] != "none":
        a(f"**Checkpoint anterior:** `{data['previous_checkpoint']}`")
    a("")
    a("---")
    a("")

    # --- Resumen ejecutivo ---
    a("## Resumen Ejecutivo")
    a("")
    a(f"- **{n_new}** archivos nuevos detectados (últimas {data['lookback_hours']}h)")
    a(f"- **{n_mod}** archivos modificados")
    a(f"- **{n_areas}** áreas del proyecto tocadas")
    a(f"- **Repo:** {git['status']}")
    a("")

    # --- Cambios ---
    a("## Cambios Detectados")
    a("")

    if data["touched_areas"]:
        a("### Áreas Tocadas")
        a("")
        a("| Área | Nuevos | Modificados |")
        a("|------|--------|-------------|")
        for area in data["touched_areas"]:
            d = data["area_details"].get(area, {})
            a(f"| `{area}/` | {len(d.get('new', []))} | {len(d.get('modified', []))} |")
        a("")
    else:
        a(f"_Sin cambios detectados en las últimas {data['lookback_hours']} horas._")
        a("")

    if data["new_files"]:
        a("### Archivos Nuevos Relevantes")
        a("")
        for f in data["new_files"][:40]:
            a(f"- `{f}`")
        if len(data["new_files"]) > 40:
            a(f"- _…y {len(data['new_files']) - 40} más_")
        a("")

    if data["modified_files"]:
        a("### Archivos Modificados Relevantes")
        a("")
        for f in data["modified_files"][:40]:
            a(f"- `{f}`")
        if len(data["modified_files"]) > 40:
            a(f"- _…y {len(data['modified_files']) - 40} más_")
        a("")

    if data["key_files"]:
        a("### Archivos Clave Actualizados")
        a("")
        for f in data["key_files"]:
            a(f"- `{f}`")
        a("")

    # --- Website ---
    a("## Estado del Website")
    a("")
    a("| Aspecto | Estado |")
    a("|---------|--------|")
    a(f"| Build (dist/) | {'✅ Existe' if ws['build_exists'] else '❌ No existe'} |")
    if ws.get("build_age_hours") is not None:
        fresh = "🟢 Fresco" if ws["build_fresh"] else "🟡 No fresco"
        a(f"| Antigüedad del build | {ws['build_age_hours']:.0f}h ({fresh}) |")
    a(f"| Artículos en content/ | {ws['article_count']} |")
    a(f"| package.json | {'✅' if ws['package_json'] else '❌'} |")
    a("")

    # --- Assets ---
    a("## Assets Detectados")
    a("")
    if data["assets"]:
        for asset in data["assets"]:
            a(f"- `{asset}`")
    else:
        a("_Sin assets encontrados._")
    a("")

    # --- Git ---
    if git["changed_files"]:
        a("## Estado Git (sin commit)")
        a("")
        for f in git["changed_files"][:25]:
            a(f"- `{f}`")
        if len(git["changed_files"]) > 25:
            a(f"- _…y {len(git['changed_files']) - 25} más_")
        a("")

    if git["recent_commits"]:
        a("## Últimos Commits")
        a("")
        for c in git["recent_commits"]:
            a(f"- `{c}`")
        a("")

    # --- Bloqueadores ---
    a("## Bloqueadores Detectados")
    a("")
    if data["blockers"]:
        for b in data["blockers"]:
            a(f"- ⚠️ {b}")
    else:
        a("✅ Sin bloqueadores críticos detectados.")
    a("")

    # --- Siguiente paso ---
    a("## Siguiente Paso Recomendado")
    a("")
    a(f"**{data['next_action']}**")
    a("")

    # --- MAYA_REVIEW_INPUT ---
    a("---")
    a("")
    a("## MAYA_REVIEW_INPUT")
    a("")
    a("_Sección optimizada para copiar y pegar en ChatGPT (Maya) para evaluación estratégica._")
    a("")
    a("```")
    a("CHECKPOINT AUTOMÁTICO — Frecuencia Global")
    a(f"Fecha: {ts}")
    a(f"Repo: {git['status']} (branch: {git['branch']})")
    a("")
    a(f"CAMBIOS: {n_new} archivos nuevos, {n_mod} modificados en {n_areas} áreas.")
    areas_str = ", ".join(data["touched_areas"]) if data["touched_areas"] else "ninguna"
    a(f"Áreas tocadas: {areas_str}")
    a("")
    if data["key_files"]:
        a("ARCHIVOS CLAVE TOCADOS:")
        for f in data["key_files"][:10]:
            a(f"  - {f}")
        a("")
    a(f"WEBSITE: {'Build existe' if ws['build_exists'] else 'Sin build'}, {ws['article_count']} artículos en content/")
    a("")
    if data["blockers"]:
        a("BLOQUEADORES:")
        for b in data["blockers"]:
            a(f"  - {b}")
        a("")
    a(f"SIGUIENTE ACCIÓN RECOMENDADA: {data['next_action']}")
    a("")
    a("¿Qué priorizamos? ¿Ajusto algo antes de avanzar?")
    a("```")
    a("")

    # --- CHECKPOINTS_CHAT_SETUP ---
    a("## CHECKPOINTS_CHAT_SETUP")
    a("")
    a("_Bloque optimizado para arrancar el siguiente chat de trabajo con contexto operativo._")
    a("")
    a("```")
    a("Frecuencia Global — Configuración de chat (Checkpoints)")
    a("")
    a("Contexto de cierre de sesión:")
    a(f"- Checkpoint base: 01_Estrategia/{path.name}")
    a(f"- Estado repo: {git['status']} (branch: {git['branch']})")
    a(f"- Cambios recientes: {n_new} nuevos, {n_mod} modificados")
    a(f"- Áreas tocadas: {areas_str}")
    a("")
    a("Instrucción al iniciar la siguiente sesión:")
    a("1) Leer primero el checkpoint base y system/memory/STATE_PROJECT.json")
    a("2) Confirmar bloqueadores actuales y validar si siguen vigentes")
    a("3) Ejecutar la siguiente acción recomendada")
    a("")
    a("Siguiente acción recomendada:")
    a(f"- {data['next_action']}")
    if data["blockers"]:
        a("")
        a("Bloqueadores detectados:")
        for b in data["blockers"]:
            a(f"- {b}")
    a("```")
    a("")

    a("---")
    a(f"_Generado automáticamente por `scripts/generate_checkpoint.py` — {ts}_")

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(L), encoding="utf-8")


def write_state_json(state: dict) -> None:
    """Write/update system/memory/STATE_PROJECT.json."""
    sf = REPO_ROOT / "system" / "memory" / "STATE_PROJECT.json"
    sf.parent.mkdir(parents=True, exist_ok=True)
    sf.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")


def write_log(entry: dict, date_str: str) -> Path:
    """Append to daily log file in 07_Operaciones/logs/."""
    log_dir = REPO_ROOT / "07_Operaciones" / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    log_path = log_dir / f"checkpoint_log_{date_str}.json"

    entries: list = []
    if log_path.exists():
        try:
            raw = json.loads(log_path.read_text(encoding="utf-8"))
            entries = raw if isinstance(raw, list) else [raw]
        except (json.JSONDecodeError, OSError):
            entries = []
    entries.append(entry)
    log_path.write_text(json.dumps(entries, indent=2, ensure_ascii=False), encoding="utf-8")
    return log_path


def write_payload(payload: dict) -> Path:
    """Write n8n payload to system/memory/checkpoint_payload_latest.json."""
    pp = REPO_ROOT / "system" / "memory" / "checkpoint_payload_latest.json"
    pp.parent.mkdir(parents=True, exist_ok=True)
    pp.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    return pp


def write_chat_setup_md(content: str) -> Path:
    """Write latest post-session chat setup instructions."""
    cp = REPO_ROOT / "system" / "memory" / "checkpoints_chat_setup_latest.md"
    cp.parent.mkdir(parents=True, exist_ok=True)
    cp.write_text(content, encoding="utf-8")
    return cp


def build_chat_setup_block(data: dict, checkpoint_file: str) -> str:
    """Build a reusable block for next-session checkpoint chat setup."""
    git = data["git"]
    n_new = len(data["new_files"])
    n_mod = len(data["modified_files"])
    areas_str = ", ".join(data["touched_areas"]) if data["touched_areas"] else "ninguna"
    lines: list[str] = [
        "# Checkpoints Chat Setup — Latest",
        "",
        f"- Generated: {data['timestamp_human']} ({data['timestamp_timezone']})",
        f"- Checkpoint: {checkpoint_file}",
        f"- Repo: {git['status']} (branch: {git['branch']})",
        f"- Activity: {n_new} new, {n_mod} modified files",
        f"- Touched areas: {areas_str}",
        "",
        "## Reusable Prompt",
        "",
        "```",
        "Actua en modo Checkpoints para Frecuencia Global.",
        f"Toma como base {checkpoint_file} y system/memory/STATE_PROJECT.json.",
        "Valida bloqueadores vigentes, riesgos inmediatos y define un plan ejecutable para las proximas 12 horas.",
        "Entrega salida en 3 bloques: Prioridad P0, Acciones P1, Riesgos/Alertas.",
        "```",
        "",
        "## Next Action",
        "",
        f"- {data['next_action']}",
    ]
    if data["blockers"]:
        lines.extend(["", "## Blockers", ""])
        for blocker in data["blockers"]:
            lines.append(f"- {blocker}")
    return "\n".join(lines) + "\n"


def post_to_n8n(payload: dict) -> bool:
    """POST payload to n8n webhook. Returns True on success."""
    try:
        data = json.dumps(payload).encode("utf-8")
        req = Request(
            N8N_WEBHOOK_URL,
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urlopen(req, timeout=10) as resp:
            print(f"  [n8n] Notificado (HTTP {resp.status})")
            return True
    except Exception as exc:
        print(f"  [n8n] No disponible ({exc}) — payload guardado en disco")
        return False


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def generate_checkpoint(lookback_hours: int = DEFAULT_LOOKBACK_HOURS,
                        skip_n8n: bool = False) -> int:
    """Run the full checkpoint generation pipeline."""
    now, tz_label = get_checkpoint_now()
    ts_file = now.strftime("%Y-%m-%d_%H%M")
    ts_human = now.strftime("%Y-%m-%d %H:%M")
    date_str = now.strftime("%Y-%m-%d")
    cutoff = time.time() - (lookback_hours * 3600)

    print(f"═══ Frecuencia Global — Checkpoint {ts_human} ═══")
    print(f"  TZ: {tz_label} | Lookback: {lookback_hours}h | Repo: {REPO_ROOT}")
    print()

    # ---- 1. Git ----
    print("  [1/7] Leyendo estado git…")
    git = get_git_info()

    # ---- 2. Scan directories ----
    print("  [2/7] Escaneando directorios…")
    all_new: list[str] = []
    all_mod: list[str] = []
    touched_areas: list[str] = []
    area_details: dict = {}

    for d in SCAN_DIRS:
        new, mod = scan_directory(d, cutoff)
        if new or mod:
            touched_areas.append(d)
            area_details[d] = {"new": new, "modified": mod}
        all_new.extend(new)
        all_mod.extend(mod)

    # ---- 3. Website ----
    print("  [3/7] Verificando website…")
    website = check_website()

    # ---- 4. Assets ----
    print("  [4/7] Detectando assets…")
    assets = check_assets()

    # ---- 5. Blockers ----
    print("  [5/7] Evaluando bloqueadores…")
    blockers = detect_blockers()

    # ---- Key files ----
    key_files: list[str] = []
    for f in all_new + all_mod:
        for pat in KEY_FILE_PATTERNS:
            if pat.lower() in f.lower():
                key_files.append(f)
                break
    key_files = sorted(set(key_files))

    # ---- Previous state ----
    prev = load_previous_state()

    # ---- Next action ----
    if any("0 piezas publicadas" in b for b in blockers):
        next_action = "Publicar P1_001 como primera pieza (Milestone 1)"
    elif not website.get("build_fresh"):
        next_action = "Rebuild y deploy del website a Vercel"
    elif not key_files and not all_new:
        next_action = "Continuar pipeline editorial — producir siguiente pieza"
    else:
        next_action = "Revisar cambios recientes y avanzar pipeline editorial"

    # ---- Assemble data ----
    data = {
        "timestamp": now.isoformat(),
        "timestamp_human": ts_human,
        "timestamp_timezone": tz_label,
        "date": date_str,
        "lookback_hours": lookback_hours,
        "git": git,
        "touched_areas": touched_areas,
        "area_details": area_details,
        "new_files": all_new,
        "modified_files": all_mod,
        "key_files": key_files,
        "website": website,
        "assets": assets,
        "blockers": blockers,
        "next_action": next_action,
        "previous_checkpoint": prev.get("last_checkpoint_file", "none"),
    }

    # ---- 6. Write outputs ----

    # 6a. Markdown checkpoint
    print("  [6/7] Generando artefactos…")
    ck_name = f"FG_Checkpoint_AUTO_{ts_file}.md"
    ck_path = REPO_ROOT / "01_Estrategia" / ck_name
    write_checkpoint_md(ck_path, data)
    print(f"    ✓ Markdown  → 01_Estrategia/{ck_name}")

    # 6b. STATE_PROJECT.json
    priorities = derive_priorities(blockers, website)
    state = {
        "last_checkpoint_timestamp": now.isoformat(),
        "last_checkpoint_file": f"01_Estrategia/{ck_name}",
        "repo_dirty_clean_status": git["status"],
        "touched_areas": touched_areas,
        "key_files_updated": key_files[:20],
        "latest_assets_detected": assets,
        "website_status": {
            "build_exists": website["build_exists"],
            "build_fresh": website["build_fresh"],
            "build_age_hours": website["build_age_hours"],
            "article_count": website["article_count"],
        },
        "pending_priorities": priorities,
        "blockers": blockers,
        "next_recommended_action": next_action,
        "next_chat_setup_file": "system/memory/checkpoints_chat_setup_latest.md",
    }
    write_state_json(state)
    print("    ✓ State     → system/memory/STATE_PROJECT.json")

    # 6c. Daily log
    log_entry = {
        "timestamp": now.isoformat(),
        "checkpoint_file": f"01_Estrategia/{ck_name}",
        "git_status": git["status"],
        "git_branch": git["branch"],
        "areas_touched": len(touched_areas),
        "new_files_count": len(all_new),
        "modified_files_count": len(all_mod),
        "blockers_count": len(blockers),
        "success": True,
    }
    log_path = write_log(log_entry, date_str)
    print(f"    ✓ Log       → {log_path.relative_to(REPO_ROOT)}")

    # 6d. n8n payload
    payload = {
        "event": "checkpoint_generated",
        "timestamp": now.isoformat(),
        "checkpoint_file": f"01_Estrategia/{ck_name}",
        "summary": (
            f"Checkpoint {ts_human}: "
            f"{len(all_new)} nuevos, {len(all_mod)} modificados, "
            f"{len(touched_areas)} áreas"
        ),
        "git_status": git["status"],
        "git_branch": git["branch"],
        "touched_areas": touched_areas,
        "new_files_count": len(all_new),
        "modified_files_count": len(all_mod),
        "key_files": key_files[:10],
        "blockers": blockers,
        "next_action": next_action,
        "website_build_exists": website["build_exists"],
        "website_article_count": website["article_count"],
        "chat_setup_file": "system/memory/checkpoints_chat_setup_latest.md",
    }
    payload_path = write_payload(payload)
    print(f"    ✓ Payload   → {payload_path.relative_to(REPO_ROOT)}")

    # 6e. latest chat setup block
    checkpoint_rel = f"01_Estrategia/{ck_name}"
    chat_setup = build_chat_setup_block(data, checkpoint_rel)
    chat_setup_path = write_chat_setup_md(chat_setup)
    print(f"    ✓ ChatSetup → {chat_setup_path.relative_to(REPO_ROOT)}")

    # ---- 7. Notify n8n ----
    print("  [7/7] Notificando n8n…")
    if skip_n8n:
        print("    → Omitido (--no-n8n)")
    else:
        post_to_n8n(payload)

    # ---- Summary ----
    print()
    print("═══ Checkpoint completado ═══")
    print(f"  Áreas tocadas:        {len(touched_areas)}")
    print(f"  Archivos nuevos:      {len(all_new)}")
    print(f"  Archivos modificados: {len(all_mod)}")
    print(f"  Archivos clave:       {len(key_files)}")
    print(f"  Bloqueadores:         {len(blockers)}")
    print(f"  Siguiente acción:     {next_action}")
    print()

    return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> int:
    hours = 24
    skip_n8n = False

    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--hours" and i + 1 < len(args):
            hours = int(args[i + 1])
            i += 2
        elif args[i] == "--no-n8n":
            skip_n8n = True
            i += 1
        elif args[i] in ("--help", "-h"):
            print(__doc__)
            return 0
        else:
            print(f"Argumento desconocido: {args[i]}")
            return 1

    try:
        return generate_checkpoint(lookback_hours=hours, skip_n8n=skip_n8n)
    except Exception as exc:
        print(f"\n[ERROR] Checkpoint falló: {exc}", file=sys.stderr)
        # Try to write a failure log entry
        try:
            log_dir = REPO_ROOT / "07_Operaciones" / "logs"
            log_dir.mkdir(parents=True, exist_ok=True)
            err_entry = {
                "timestamp": datetime.now().isoformat(),
                "checkpoint_file": None,
                "success": False,
                "error": str(exc),
            }
            date_str = datetime.now().strftime("%Y-%m-%d")
            write_log(err_entry, date_str)
        except Exception:
            pass
        return 1


if __name__ == "__main__":
    sys.exit(main())
