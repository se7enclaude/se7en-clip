"""Une analyse complète : vidéo (fichier ou lien) → transcription → moments → clips rendus.

Les résultats intermédiaires (son 16 kHz, voix, transcription, chat, mise en page) sont gardés dans le cache du
projet : relancer après une erreur ou demander plus de clips ne refait pas tout.
"""
from __future__ import annotations

import json
import re
import threading
import time
import uuid
from pathlib import Path
from typing import Callable

from ..errors import Canceled, MediaLabError
from ..logging_setup import get_logger
from ..subtitles import project as subs_project
from ..subtitles import transcribe as T
from . import moments as M
from . import project as P
from . import chat as chat_mod
from . import reframe, render, scoring

log = get_logger("clip")
Progress = Callable[[float, str, float | None], None]

def auto_count(duration: float) -> int:
    """Nombre de clips proportionnel à la durée : environ un clip toutes les 4 minutes (3 à 30)."""
    return max(3, min(30, round(duration / 240)))


# part de la barre de progression de chaque étape
STEPS = [("download", 0.00, 0.15), ("audio", 0.15, 0.18), ("transcribe", 0.18, 0.55), ("moments", 0.55, 0.57),
         ("judge", 0.57, 0.75), ("layout", 0.75, 0.78), ("render", 0.78, 1.00)]


class Stepper:
    def __init__(self, pid: str, progress: Progress) -> None:
        self.pid, self.progress, self.t0 = pid, progress, time.monotonic()
        self.name, self.lo, self.hi = "download", 0.0, 0.15

    def step(self, name: str, label: str) -> None:
        self.name, self.lo, self.hi = next((s for s in STEPS if s[0] == name))
        P.patch(self.pid, {"step": name, "status": "analyzing"})
        self.report(0.0, label)

    def report(self, frac: float, label: str) -> None:
        f = self.lo + (self.hi - self.lo) * max(0.0, min(1.0, frac))
        el = time.monotonic() - self.t0
        self.progress(f, label, el / f - el if f > 0.05 else None)


# ------------------------------------------------------------------ source
def _download(project: dict, settings, jctx, st: Stepper) -> Path:
    from ..downloader.base import DownloadContext
    from ..downloader.registry import registry
    url = project["source"]["url"]
    out = P.root() / "sources"
    out.mkdir(parents=True, exist_ok=True)

    def on_progress(p: dict) -> None:
        pct = p.get("percent")
        if pct is None and p.get("total"):
            pct = 100 * (p.get("downloaded") or 0) / max(1, p["total"])
        st.report((pct or 0) / 100, "Téléchargement de la vidéo")

    provider = registry.get("ytdlp")
    opts = {"mode": "av", "quality": "1080", "container": "mp4", "output_dir": str(out), "folder_structure": "",
            "embed_thumbnail": False, "write_subtitles": False}
    from . import login
    site = login.site_for(url)
    connected = bool(site and login.status().get(site))
    if connected:
        # la connexion se garde toute seule : session renouvelée en arrière-plan avant chaque téléchargement
        st.report(0.0, f"Connexion à {login.SITES[site]['name']}")
        login.refresh(site)
    if site and settings.privacy.cookies_mode == "file":
        # session ouverte dans « Se connecter à … » : Cloudflare refuse (« Forbidden ») si le téléchargement ne se
        # présente pas comme le même navigateur, avec l'empreinte réseau de Chrome
        opts.update({"user_agent": login.user_agent(site), "impersonate": "chrome"})

    def attempt(s):
        dctx = DownloadContext(job_id=jctx.job["id"], settings=s, cancel=jctx.cancel, progress=on_progress,
                               temp_dir=jctx.temp_dir)
        return provider.download(url, opts, dctx)

    try:
        res = attempt(settings)
    except MediaLabError as e:
        if connected and e.code in ("members_only", "login_required", "private"):
            name = login.SITES[site]["name"]
            raise MediaLabError("login_required", f"{name} ne reconnaît plus la connexion de se7en Clip.",
                                f"Reconnectez-vous une fois avec « Se connecter à {name} » (le compte doit avoir "
                                "accès à ce post).", True, e.detail) from e
        text = f"{e.message} {e.detail or ''}".lower()
        if settings.privacy.cookies_mode != "browser" or not ("cookie" in text and ("copy" in text or "decrypt" in text)):
            raise
        # Chrome / Edge / Brave chiffrent ou verrouillent leurs cookies : on réessaie sans eux
        log.warning("Browser cookies unreadable (%s); retrying without cookies", settings.privacy.cookies_browser)
        no_cookies = settings.model_copy(update={"privacy": settings.privacy.model_copy(update={"cookies_mode": "none"})})
        try:
            res = attempt(no_cookies)
        except MediaLabError as e2:
            if e2.code in ("members_only", "login_required", "private", "age_restricted"):
                raise MediaLabError(e2.code, f"Les cookies de {settings.privacy.cookies_browser} ne sont pas lisibles "
                                    "et cette vidéo demande d'être connecté.",
                                    "Utilisez le bouton « Se connecter » de se7en Clip.") from e2
            raise
    project = P.load(project["id"])
    project["source"]["path"] = res.file_path
    if res.title:
        project["name"] = res.title[:120]
    P.save(project)
    return Path(res.file_path)


# ------------------------------------------------------------------ analyse
def analyze(pid: str, settings, jctx, progress: Progress, render_clips: bool = True) -> dict:
    cancel: threading.Event = jctx.cancel
    st = Stepper(pid, progress)
    project = P.load(pid)
    opts = project["options"]
    P.patch(pid, {"status": "analyzing", "error": None, "notes": []})
    cache = P.cache_dir(pid)
    notes: list[str] = []
    t_start = time.monotonic()

    # 1. la vidéo
    src_path = project["source"].get("path")
    if not src_path or not Path(src_path).is_file():
        if not project["source"].get("url"):
            raise MediaLabError("source_missing", "La vidéo de ce projet n'existe plus.")
        st.step("download", "Téléchargement de la vidéo")
        src = _download(project, settings, jctx, st)
    else:
        src = Path(src_path)
    video = subs_project.video_info(src)
    if not video.get("has_video"):
        raise MediaLabError("no_video_stream", "Ce fichier n'a pas d'image.", "Choisissez une vidéo.")
    project = P.patch(pid, {"video": video})

    # 2. le son et la transcription mot par mot
    st.step("audio", "Extraction du son")
    cli, vad_tool, model, vad = T.engine_paths(lambda d, t: st.report(
        0.0, f"Téléchargement du modèle de transcription · {d * 100 // max(t, 1)} %"))
    wav = cache / "audio.16k.wav"
    if not wav.exists():
        T.extract_audio(src, wav, video.get("duration"), cancel, lambda f: st.report(f, "Extraction du son"))
    words_file = cache / "words.json"
    if words_file.exists():
        data = json.loads(words_file.read_text("utf-8"))
        words, lang = data["words"], data["lang"]
    else:
        st.step("transcribe", "Détection de la voix")
        speech = T.speech_segments(wav, vad_tool, vad, cancel)
        if not speech:
            raise MediaLabError("no_speech", "Aucune voix trouvée dans cette vidéo.",
                                "se7en Clip choisit les moments d'après ce qui est dit.")
        lang = opts.get("language") if opts.get("language") not in (None, "", "auto") else None
        if not lang:
            st.report(0.02, "Détection de la langue")
            lang = T.detect_language(T.read_wav(wav), speech, cli, model, cancel)["code"]
        t0 = time.monotonic()

        def asr(f: float, _m: str) -> None:
            el = time.monotonic() - t0
            st.report(0.03 + 0.97 * f, "Transcription" + (f" · reste ~{int((el / f - el) / 60) + 1} min" if f > 0.03 else ""))

        segments = T.transcribe(wav, lang, cli, model, cancel, asr)
        segments = T.drop_outside_speech(segments, speech)
        ws = [w for s in segments for w in s["words"]]
        T.snap_to_speech(ws, speech)
        words = [w.to_dict() for w in ws]
        words_file.write_text(json.dumps({"lang": lang, "words": words}, ensure_ascii=False), "utf-8")
    if not words:
        raise MediaLabError("no_speech", "Rien n'a pu être compris dans cette vidéo.", "Vérifiez le son.")
    P.patch(pid, {"language": lang})

    # 3. signaux et candidats
    st.step("moments", "Recherche des moments forts")
    messages = chat_mod.fetch(project["source"].get("url"), float(video["duration"] or 0), cache, cancel)
    chat = [m["t"] for m in messages]
    loud = M.loudness_per_second(T.read_wav(wav))
    sig = M.signals(float(video["duration"] or len(loud)), loud, words, chat)
    sents = M.sentences(words)
    count = int(opts.get("count") or 0) or auto_count(float(video["duration"] or 0))  # 0 = automatique
    count = max(1, min(50, count))
    cands = M.candidates(sents, sig, float(opts.get("min_len") or 20), float(opts.get("max_len") or 75),
                         keep=max(12, min(60, count * 4)))
    if not cands:
        raise MediaLabError("no_moments", "Pas assez de paroles pour faire des clips.",
                            "Essayez une durée minimale plus courte.")

    # 4. l'IA juge les candidats
    st.step("judge", "L'IA choisit les meilleurs moments")
    context = f"{project.get('name') or ''}" + (" (rediffusion de stream)" if chat else "")
    judged, note = scoring.judge(
        sents, cands, context, cancel, lambda f, lbl: st.report(f, f"L'IA choisit les meilleurs moments · {lbl}"),
        lambda d, t: st.report(0.0, f"Téléchargement de l'IA de texte · {d * 100 // max(t, 1)} %"),
        use_ai=bool(opts.get("use_ai", True)))
    if note:
        notes.append(note)
    best = scoring.pick(judged, count)

    # 5. mise en page
    st.step("layout", "Analyse de l'image (visages, facecam)")
    layout_file = cache / "layout.json"
    forced = opts.get("layout") or "auto"
    cached = json.loads(layout_file.read_text("utf-8")) if layout_file.exists() else {}
    if cached.get("v", 1) >= reframe.DETECT_VERSION:
        layout = reframe.Layout.from_dict(cached)
    else:
        layout = reframe.detect_layout(src, float(video["duration"]), int(video["width"]), int(video["height"]), cancel)
        layout_file.write_text(json.dumps(layout.to_dict()), "utf-8")
    if forced != "auto":
        layout = forced_layout(forced, layout)
    if layout.mode == "chat" and not messages:
        layout = reframe.Layout("stream", layout.cam, layout.confidence)
        notes.append("Pas de chat récupérable pour cette vidéo (Twitch et YouTube seulement) : cadrage « Cam + jeu ».")
    clips = []
    for m in best:
        clips.append({"id": uuid.uuid4().hex[:10], **m, "layout": layout.to_dict(),
                      "captions": opts.get("captions") or "tiktok", "lang": lang, "file": None, "thumb": None,
                      "stale": True})
    project = P.patch(pid, {"layout": layout.to_dict(), "clips": clips, "notes": notes,
                            "stats": {"words": len(words), "candidates": len(cands), "chat": len(chat),
                                      "analysis_seconds": round(time.monotonic() - t_start)}})

    # 6. rendu
    if render_clips:
        st.step("render", "Rendu des clips")
        for k, clip in enumerate(clips):
            render_one(pid, clip["id"], settings, cancel,
                       lambda f, lbl, k=k: st.report((k + f) / len(clips), f"Clip {k + 1}/{len(clips)} · {lbl}"),
                       words=words)
    project = P.patch(pid, {"status": "ready", "step": None})
    progress(1.0, "Terminé", 0)
    return project


def forced_layout(mode: str, detected: reframe.Layout) -> reframe.Layout:
    """Mise en page choisie par l'utilisateur, en gardant ce que la détection a trouvé (la cam)."""
    cam = detected.cam if mode in ("stream", "chat") else None
    if mode in ("stream", "chat") and not cam:
        cam = (0.0, 0.0, 0.3, 0.3)  # à ajuster dans « Régler le cadrage »
    return reframe.Layout(mode, cam, 1.0, detected.content)


def render_one(pid: str, cid: str, settings, cancel: threading.Event, progress: Callable[[float, str], None],
               words: list[dict] | None = None) -> dict:
    project = P.load(pid)
    clip = next((c for c in project["clips"] if c["id"] == cid), None)
    if clip is None:
        raise MediaLabError("clip_not_found", "Ce clip n'existe pas.")
    src = Path(project["source"]["path"])
    if not src.is_file():
        raise MediaLabError("source_missing", "La vidéo source de ce projet n'existe plus.")
    if words is None:
        words = json.loads((P.cache_dir(pid) / "words.json").read_text("utf-8"))["words"]
    out_dir = P.output_dir(project)
    rank = project["clips"].index(clip) + 1
    dst = out_dir / f"{rank:02d} - {render.safe_name(clip.get('title') or '', f'clip {rank}')}.mp4"
    if clip.get("file") and Path(clip["file"]).exists() and Path(clip["file"]) != dst:
        Path(clip["file"]).unlink(missing_ok=True)
        Path(clip["file"]).with_suffix(".jpg").unlink(missing_ok=True)
        Path(clip["file"]).with_suffix(".txt").unlink(missing_ok=True)
    messages = None
    if (clip.get("layout") or {}).get("mode") == "chat":
        f = P.cache_dir(pid) / "chat.json"
        messages = json.loads(f.read_text("utf-8")) if f.exists() else []
    res = render.render(src, project["video"], clip, words, dst, cancel, progress,
                        use_gpu=bool(getattr(settings.tools, "use_gpu_encoder", True)), messages=messages)
    dst.with_suffix(".txt").unlink(missing_ok=True)  # ancien fichier texte (avant 0.4.2)
    project = P.load(pid)
    for c in project["clips"]:
        if c["id"] == cid:
            c.update({**res, "stale": False})
            clip = c
    P.save(project)
    return clip
