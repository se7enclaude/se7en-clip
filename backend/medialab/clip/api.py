"""Routes de l'API et tâche de fond de se7en Clip."""
from __future__ import annotations

import os
import threading
from pathlib import Path

from fastapi import FastAPI
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel

from ..errors import Canceled, MediaLabError
from ..events import bus
from ..logging_setup import get_logger
from . import pipeline
from . import project as P
from .captions import CAPTION_STYLES

log = get_logger("clip")


class NewProjectBody(BaseModel):
    source: str
    count: int = 0  # 0 = automatique (selon la durée)
    min_len: int = 20
    max_len: int = 75
    layout: str = "auto"
    captions: str = "tiktok"
    language: str = "auto"
    use_ai: bool = True
    output_dir: str | None = None


class ClipPatchBody(BaseModel):
    start: float | None = None
    end: float | None = None
    title: str | None = None
    description: str | None = None
    hashtags: list[str] | None = None
    layout: dict | None = None
    captions: str | None = None


class LayoutBody(BaseModel):
    mode: str
    cam: list[float] | None = None
    apply_all: bool = True


class OptionsBody(BaseModel):
    count: int | None = None
    captions: str | None = None
    layout: str | None = None


def make_worker(settings):
    """Tâche « clip » : analyse complète d'un projet, ou nouveau rendu d'un seul clip."""
    def worker(job: dict, jctx) -> dict:
        s = settings.get()
        opts = dict(job.get("options") or {})
        pid = str(opts.get("project") or "")

        def progress(frac: float, label: str, eta: float | None = None) -> None:
            jctx.progress({"stage": "processing", "label": label, "percent": frac * 100, "eta": eta, "speed": 0})
            bus.publish("clip_progress", {"project": pid, "percent": frac * 100, "label": label, "eta": eta})

        try:
            if opts.get("op") == "render":
                clip = pipeline.render_one(pid, str(opts["clip"]), s, jctx.cancel, lambda f, lbl: progress(f, lbl))
                bus.publish("clip_project", {"project": pid})
                return {"file_path": clip.get("file"), "title": clip.get("title"), "platform": "clip",
                        "format": "MP4 · 1080×1920", "meta": {"project": pid, "clip": clip["id"]}}
            project = pipeline.analyze(pid, s, jctx, progress)
            bus.publish("clip_project", {"project": pid})
            n = len(project["clips"])
            return {"file_path": None, "title": project["name"], "platform": "clip",
                    "format": f"{n} clips", "duration": (project.get("video") or {}).get("duration"),
                    "meta": {"project": pid, "clips": n}}
        except Canceled:
            P.patch(pid, {"status": "paused", "step": None})
            bus.publish("clip_project", {"project": pid})
            raise
        except MediaLabError as e:
            P.patch(pid, {"status": "error", "error": {"code": e.code, "message": e.message, "hint": e.hint},
                          "step": None})
            bus.publish("clip_project", {"project": pid})
            raise
        except Exception as e:
            log.exception("Clip job failed")
            P.patch(pid, {"status": "error", "error": {"message": str(e), "hint": "Voir le journal."}, "step": None})
            bus.publish("clip_project", {"project": pid})
            raise
    return worker


def register(app: FastAPI, S) -> None:
    def start_analysis(pid: str) -> dict:
        project = P.load(pid)
        src = project["source"].get("url") or project["source"].get("path") or ""
        P.patch(pid, {"status": "queued", "error": None})
        job = S.jobs.add("clip", src, {"op": "analyze", "project": pid}, title=project["name"], platform="clip")
        P.patch(pid, {"job": job["id"]})
        bus.publish("clip_project", {"project": pid})
        return job

    @app.get("/api/clip/catalog")
    async def clip_catalog():
        return {"captions": list(CAPTION_STYLES), "layouts": ["auto", "stream", "chat", "face", "fit"],
                "output_dir": str(Path.home() / "Videos" / "se7en Clip")}

    @app.get("/api/clip/projects")
    async def clip_list():
        return {"projects": await run_in_threadpool(P.listing)}

    @app.post("/api/clip/projects")
    async def clip_create(body: NewProjectBody):
        opts = body.model_dump(exclude={"source", "output_dir"})
        project = await run_in_threadpool(P.create, body.source, opts, body.output_dir)
        job = start_analysis(project["id"])
        return {"project": P.load(project["id"]), "job": job}

    @app.get("/api/clip/projects/{pid}")
    async def clip_get(pid: str):
        return P.load(pid)

    @app.delete("/api/clip/projects/{pid}")
    async def clip_delete(pid: str):
        project = P.load(pid)
        if project.get("job"):
            try:
                S.jobs.cancel(project["job"])
            except MediaLabError:
                pass
        P.delete(pid)
        return {"ok": True}

    @app.post("/api/clip/projects/{pid}/analyze")
    async def clip_reanalyze(pid: str, body: OptionsBody):
        project = P.load(pid)
        changes = {k: v for k, v in body.model_dump().items() if v is not None}
        if changes:
            P.patch(pid, {"options": {**project["options"], **changes}})
        return {"job": start_analysis(pid)}

    @app.post("/api/clip/projects/{pid}/cancel")
    async def clip_cancel(pid: str):
        project = P.load(pid)
        if project.get("job"):
            try:
                S.jobs.cancel(project["job"])
            except MediaLabError:
                pass
        P.patch(pid, {"status": "paused", "step": None})
        return {"ok": True}

    @app.patch("/api/clip/projects/{pid}/clips/{cid}")
    async def clip_patch(pid: str, cid: str, body: ClipPatchBody):
        _, clip = await run_in_threadpool(P.update_clip, pid, cid, body.model_dump(exclude_none=True))
        return clip

    @app.post("/api/clip/projects/{pid}/clips/{cid}/render")
    async def clip_render(pid: str, cid: str):
        project = P.load(pid)
        clip = next((c for c in project["clips"] if c["id"] == cid), None)
        if clip is None:
            raise MediaLabError("clip_not_found", "Ce clip n'existe pas.")
        job = S.jobs.add("clip", project["source"].get("path") or "", {"op": "render", "project": pid, "clip": cid},
                         title=clip.get("title") or project["name"], platform="clip")
        return {"job": job}

    @app.delete("/api/clip/projects/{pid}/clips/{cid}")
    async def clip_remove(pid: str, cid: str):
        project = P.load(pid)
        keep = []
        for c in project["clips"]:
            if c["id"] == cid:
                for ext in (".mp4", ".jpg", ".txt"):
                    if c.get("file"):
                        Path(c["file"]).with_suffix(ext).unlink(missing_ok=True)
            else:
                keep.append(c)
        project["clips"] = keep
        P.save(project)
        return project

    @app.get("/api/clip/login")
    async def clip_login_status():
        from . import login
        return await run_in_threadpool(login.status)

    @app.post("/api/clip/login/{site}")
    async def clip_login(site: str):
        from . import login
        return await run_in_threadpool(login.open_window, site, S.settings)

    @app.post("/api/clip/login/{site}/refresh")
    async def clip_login_refresh(site: str):
        from . import login
        return {"ok": await run_in_threadpool(login.refresh, site)}

    @app.delete("/api/clip/login/{site}")
    async def clip_logout(site: str):
        from . import login
        await run_in_threadpool(login.logout, site)
        return {"ok": True}

    @app.get("/api/clip/projects/{pid}/frame")
    async def clip_frame(pid: str, t: float | None = None):
        """Une image de la vidéo source (pour régler le cadrage)."""
        from fastapi.responses import FileResponse
        from ..media import ffmpeg
        project = P.load(pid)
        src = Path(project["source"].get("path") or "")
        if not src.is_file():
            raise MediaLabError("source_missing", "La vidéo source de ce projet n'existe plus.")
        at = t if t is not None else (project["clips"][0]["start"] + 2 if project["clips"] else
                                      P.video_duration(project) * 0.3)
        out = P.cache_dir(pid) / f"frame-{int(at * 10)}.jpg"
        if not out.exists():
            await run_in_threadpool(ffmpeg.extract_frame, src, at, out)
        return FileResponse(out, media_type="image/jpeg", headers={"Cache-Control": "no-store"})

    @app.put("/api/clip/projects/{pid}/layout")
    async def clip_layout(pid: str, body: LayoutBody):
        from .reframe import Layout, clamp_box
        if body.mode not in ("stream", "chat", "face", "fit"):
            raise MediaLabError("invalid", "Cadrage inconnu.")
        layout = Layout(body.mode, clamp_box(body.cam) if body.cam else None, 1.0).to_dict()
        project = P.load(pid)
        project["layout"] = layout
        if body.apply_all:
            for c in project["clips"]:
                c["layout"] = dict(layout)
                c["stale"] = True
        P.save(project)
        return project

    @app.post("/api/clip/projects/{pid}/render-all")
    async def clip_render_all(pid: str):
        project = P.load(pid)
        jobs = [S.jobs.add("clip", project["source"].get("path") or "", {"op": "render", "project": pid, "clip": c["id"]},
                           title=c.get("title") or project["name"], platform="clip")
                for c in project["clips"] if c.get("stale") or not c.get("file")]
        return {"jobs": len(jobs)}

    @app.post("/api/clip/projects/{pid}/open-folder")
    async def clip_open_folder(pid: str):
        d = P.output_dir(P.load(pid))
        threading.Thread(target=lambda: os.startfile(str(d)), daemon=True).start()  # noqa: S606
        return {"path": str(d)}
