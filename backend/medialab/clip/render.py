"""Rendu d'un clip : un seul passage FFmpeg (recadrage 9:16 + sous-titres + son normalisé, encodeur GPU)."""
from __future__ import annotations

import os
import re
import shutil
import tempfile
import threading
import time
from pathlib import Path
from typing import Callable

from ..errors import MediaLabError
from ..logging_setup import get_logger
from ..media import ffmpeg
from ..subtitles import formats
from . import captions, reframe, tracking

log = get_logger("clip")
Progress = Callable[[float, str], None]


def safe_name(title: str, fallback: str) -> str:
    name = re.sub(r'[<>:"/\\|?*\x00-\x1f]+', "", title or "").strip(" .")
    return (name[:80] or fallback).strip()


def render(src: Path, video: dict, clip: dict, words: list[dict], dst: Path, cancel: threading.Event,
           progress: Progress, use_gpu: bool = True) -> dict:
    """Rend ``clip`` ({start, end, layout, captions…}) dans ``dst`` (MP4 1080×1920)."""
    start, end = float(clip["start"]), float(clip["end"])
    dur = end - start
    sw, sh = int(video["width"]), int(video["height"])
    # cadence standard la plus proche (une capture à 29,99 i/s sort à 30 : lu partout sans saccade)
    src_fps = float(video.get("fps") or 30.0)
    fps = min((24.0, 25.0, 30.0, 50.0, 60.0), key=lambda f: abs(f - min(60.0, src_fps)))
    layout = reframe.Layout.from_dict(clip.get("layout"))
    tmp = Path(tempfile.mkdtemp(prefix="se7en-clip-"))
    part = dst.with_name(f"{dst.stem}.part{dst.suffix}")
    t0 = time.perf_counter()
    try:
        track_file = False
        if layout.mode == "face" and sw > sh:
            progress(0.02, "Suivi du visage")
            samples = reframe.track(src, start, dur, sw, sh, cancel)
            xs = tracking.path(samples, fps, dur, reframe.crop_fraction(sw, sh))
            cw = reframe._even(sh * reframe.OUT_W / reframe.OUT_H)
            (tmp / "track.cmd").write_text(tracking.sendcmd(xs, fps, sw, cw), "utf-8")
            track_file = True
        style_name = clip.get("captions") or "tiktok"
        cues = captions.chunks(words, start, end) if style_name != "none" else []
        _, seam = reframe.filtergraph(layout, sw, sh, False, track_file)
        if layout.mode == "stream":
            style = captions.style_for(style_name, "top", seam)
        else:
            style = captions.style_for(style_name, "bottom", 26.0)
        has_subs = bool(cues and style)
        if has_subs:
            formats.write(tmp / "subs.ass", formats.to_ass(cues, style, reframe.OUT_W, reframe.OUT_H, clip.get("lang") or ""))
        graph, _ = reframe.filtergraph(layout, sw, sh, has_subs, track_file)

        last_err: MediaLabError | None = None
        for gpu in ([True, False] if use_gpu else [False]):
            enc = (ffmpeg.best_encoder("h264") if gpu else None) or "libx264"
            vargs = ffmpeg.encoder_args(enc, 20 if enc.endswith("_nvenc") else 19)
            args = ["-ss", f"{start:.3f}", "-t", f"{dur:.3f}", "-i", str(src), "-filter_complex", graph,
                    "-map", "[v]", "-map", "0:a:0?", "-r", f"{fps:g}", *vargs, "-g", str(int(fps * 2)),
                    "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                    "-movflags", "+faststart", str(part)]
            try:
                ffmpeg.run(args, duration=dur, cancel=cancel, label="clip render", cwd=str(tmp),
                           on_progress=lambda f, _s: progress(0.1 + 0.88 * f, f"Rendu · {enc}"))
                last_err = None
                break
            except MediaLabError as e:
                part.unlink(missing_ok=True)
                last_err = e
                if e.code == "encoder_failed" and gpu:
                    log.warning("GPU encoder failed for a clip; retrying on the CPU")
                    continue
                raise
        if last_err:
            raise last_err
        os.replace(part, dst)
        thumb = dst.with_suffix(".jpg")
        try:
            ffmpeg.run(["-ss", f"{min(1.5, dur / 2):.2f}", "-i", str(dst), "-frames:v", "1", "-vf", "scale=360:-2",
                        "-q:v", "4", str(thumb)], label="clip thumbnail")
        except MediaLabError:
            thumb = None
    except BaseException:
        part.unlink(missing_ok=True)
        raise
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    log.info("Rendered clip %s (%.1fs, %s) in %.1fs", dst.name, dur, layout.mode, time.perf_counter() - t0)
    return {"file": str(dst), "thumb": str(thumb) if thumb else None, "size": dst.stat().st_size,
            "rendered_at": time.time()}


def write_caption_file(dst: Path, clip: dict) -> Path:
    """Le texte à coller sur TikTok : titre, description, hashtags."""
    txt = "\n\n".join(x for x in (clip.get("title"), clip.get("description"), " ".join(clip.get("hashtags") or [])) if x)
    p = dst.with_suffix(".txt")
    p.write_text(txt + "\n", "utf-8")
    return p
