"""Projets de clips : une vidéo source, ses moments trouvés et ses clips rendus (JSON dans <données>/clips)."""
from __future__ import annotations

import json
import os
import re
import shutil
import threading
import time
import uuid
from pathlib import Path

from ..config import paths
from ..errors import MediaLabError

_lock = threading.RLock()

DEFAULT_OPTIONS = {"count": 10, "min_len": 20, "max_len": 75, "layout": "auto", "captions": "tiktok",
                   "language": "auto", "use_ai": True}
CLIP_EDITABLE = {"start", "end", "title", "description", "hashtags", "layout", "captions"}


def root() -> Path:
    d = paths().data / "clips"
    d.mkdir(parents=True, exist_ok=True)
    return d


def cache_dir(pid: str) -> Path:
    d = root() / "cache" / pid
    d.mkdir(parents=True, exist_ok=True)
    return d


def output_dir(project: dict) -> Path:
    base = Path(project.get("output_dir") or (Path.home() / "Videos" / "se7en Clip"))
    d = base / _safe(project.get("name") or project["id"])
    d.mkdir(parents=True, exist_ok=True)
    return d


def _safe(name: str) -> str:
    return re.sub(r'[<>:"/\\|?*\x00-\x1f]+', "", name).strip(" .")[:80] or "projet"


def _file(pid: str) -> Path:
    if not re.fullmatch(r"[0-9a-f]{12}", pid or ""):
        raise MediaLabError("project_not_found", "Ce projet n'existe pas.")
    return root() / f"{pid}.json"


def create(source: str, options: dict | None = None, output: str | None = None) -> dict:
    is_url = bool(re.match(r"https?://", source.strip(), re.I))
    if not is_url and not Path(source).is_file():
        raise MediaLabError("file_missing", "Fichier introuvable.", "Il a peut-être été déplacé ou supprimé.")
    now = time.time()
    name = Path(source).stem if not is_url else "Vidéo en ligne"
    project = {
        "id": uuid.uuid4().hex[:12], "name": name, "created": now, "updated": now,
        "source": {"url": source.strip() if is_url else None, "path": None if is_url else str(Path(source).resolve())},
        "video": None, "status": "new", "step": None, "error": None, "notes": [],
        "options": {**DEFAULT_OPTIONS, **(options or {})}, "output_dir": output,
        "language": None, "layout": None, "clips": [], "stats": {},
    }
    return save(project)


def load(pid: str) -> dict:
    f = _file(pid)
    with _lock:  # jamais pendant une écriture (Windows refuse de remplacer un fichier ouvert)
        if not f.exists():
            raise MediaLabError("project_not_found", "Ce projet n'existe pas.")
        return json.loads(f.read_text("utf-8"))


def save(project: dict) -> dict:
    project["updated"] = time.time()
    f = _file(project["id"])
    tmp = f.with_suffix(".tmp")
    with _lock:
        tmp.write_text(json.dumps(project, ensure_ascii=False), "utf-8")
        for attempt in range(20):  # un antivirus ou l'indexation peut tenir le fichier un instant
            try:
                os.replace(tmp, f)
                break
            except PermissionError:
                if attempt == 19:
                    raise
                time.sleep(0.05)
    return project


def patch(pid: str, changes: dict) -> dict:
    project = load(pid)
    project.update(changes)
    return save(project)


def update_clip(pid: str, cid: str, changes: dict) -> tuple[dict, dict]:
    project = load(pid)
    clip = next((c for c in project["clips"] if c["id"] == cid), None)
    if clip is None:
        raise MediaLabError("clip_not_found", "Ce clip n'existe pas.")
    for k, v in changes.items():
        if k in CLIP_EDITABLE and v is not None:
            clip[k] = v
    if {"start", "end", "layout", "captions"} & set(changes):
        clip["stale"] = True  # le fichier rendu ne correspond plus : à refaire
    dur = video_duration(project)
    clip["start"] = max(0.0, float(clip["start"]))
    clip["end"] = min(dur, max(clip["start"] + 3, float(clip["end"]))) if dur else max(clip["start"] + 3, float(clip["end"]))
    save(project)
    return project, clip


def video_duration(project: dict) -> float:
    return float((project.get("video") or {}).get("duration") or 0)


def delete(pid: str) -> None:
    _file(pid).unlink(missing_ok=True)
    shutil.rmtree(root() / "cache" / pid, ignore_errors=True)


def listing() -> list[dict]:
    out = []
    for f in root().glob("*.json"):
        try:
            with _lock:
                p = json.loads(f.read_text("utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        v = p.get("video") or {}
        first = next((c for c in p.get("clips") or [] if c.get("thumb")), None)
        out.append({"id": p["id"], "name": p.get("name"), "updated": p.get("updated"), "status": p.get("status"),
                    "clips": len(p.get("clips") or []), "duration": v.get("duration"),
                    "thumb": first.get("thumb") if first else None, "url": (p.get("source") or {}).get("url")})
    return sorted(out, key=lambda x: x.get("updated") or 0, reverse=True)
