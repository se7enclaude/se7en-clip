"""Mise en page verticale 9:16 (1080×1920).

* ``stream`` : la facecam d'un stream en haut, le jeu en bas (détection automatique de la cam) ;
* ``chat``   : la facecam en haut, le chat de la rediff recréé en dessous (messages qui défilent) ;
* ``face``   : le cadre suit le visage principal (podcast, vlog, face cam plein écran) ;
* ``fit``    : la vidéo entière au centre, sur un fond flouté (pas de visage, ou plan large).

Les visages sont trouvés par YuNet (le détecteur de se7en Download), sur la carte graphique via DirectML.
"""
from __future__ import annotations

import statistics
import subprocess
import threading
from dataclasses import dataclass
from pathlib import Path

import numpy as np

from ..components import CREATE_NO_WINDOW, require
from ..errors import Canceled
from ..logging_setup import get_logger
from ..upscale import face as F
from . import tracking

log = get_logger("clip")

OUT_W, OUT_H = 1080, 1920
SAMPLE_W = 640


Box = tuple[float, float, float, float]  # x, y, w, h en fractions de l'image


@dataclass
class Layout:
    mode: str  # stream | chat | face | fit
    cam: Box | None = None  # la facecam (modes stream et chat)
    confidence: float = 0.0

    def to_dict(self) -> dict:
        return {"mode": self.mode, "cam": list(self.cam) if self.cam else None, "confidence": round(self.confidence, 2)}

    @staticmethod
    def from_dict(d: dict | None) -> "Layout":
        d = d or {}
        cam = d.get("cam")
        mode = d.get("mode") or "fit"
        if mode == "discord":  # ancien cadrage (0.2.0) : devenu « cam + jeu »
            mode = "stream"
        return Layout(mode, clamp_box(cam) if cam else None, float(d.get("confidence") or 0))


def clamp_box(b) -> Box:
    x, y, w, h = (float(v) for v in b)
    w, h = min(1.0, max(0.03, w)), min(1.0, max(0.03, h))
    return (round(min(max(0.0, x), 1 - w), 4), round(min(max(0.0, y), 1 - h), 4), round(w, 4), round(h, 4))


# ------------------------------------------------------------------ lecture d'images
def _frame_size(src_w: int, src_h: int) -> tuple[int, int]:
    w = SAMPLE_W
    h = int(round(src_h * w / max(1, src_w) / 2)) * 2
    return w, max(2, h)


def frames(src: Path, start: float, duration: float, fps: float, src_w: int, src_h: int,
           cancel: threading.Event | None = None):
    """Images RGB réduites (640 px de large) à ``fps`` images/s, avec leur temps depuis ``start``."""
    w, h = _frame_size(src_w, src_h)
    cmd = [require("ffmpeg"), "-hide_banner", "-nostdin", "-loglevel", "error", "-ss", f"{start:.3f}", "-t",
           f"{duration:.3f}", "-i", str(src), "-an", "-vf", f"fps={fps},scale={w}:{h}", "-f", "rawvideo",
           "-pix_fmt", "rgb24", "pipe:1"]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, creationflags=CREATE_NO_WINDOW)
    size = w * h * 3
    i = 0
    try:
        assert proc.stdout
        while True:
            if cancel is not None and cancel.is_set():
                raise Canceled()
            buf = proc.stdout.read(size)
            if len(buf) < size:
                break
            yield i / fps, np.frombuffer(buf, dtype=np.uint8).reshape(h, w, 3)
            i += 1
    finally:
        proc.kill()
        proc.wait()


def frame_at(src: Path, t: float, src_w: int, src_h: int) -> np.ndarray | None:
    return next((f for _, f in frames(src, t, 0.5, 2, src_w, src_h)), None)


# ------------------------------------------------------------------ détection de la mise en page
def detect_layout(src: Path, duration: float, src_w: int, src_h: int, cancel: threading.Event | None = None,
                  samples: int = 28) -> Layout:
    """Regarde ~30 images réparties dans la vidéo pour choisir la mise en page."""
    if src_h >= src_w * 1.3:
        return Layout("fit", None, 1.0)  # déjà vertical
    found: list[tuple[float, float, float, float]] = []  # cx, cy, w, h (fractions)
    times = [duration * (0.05 + 0.9 * k / max(1, samples - 1)) for k in range(samples)]
    for t in times:
        if cancel is not None and cancel.is_set():
            raise Canceled()
        img = frame_at(src, t, src_w, src_h)
        if img is None:
            continue
        faces = F.detect(img, threshold=0.7)
        if not faces:
            continue
        fh, fw = img.shape[:2]
        x1, y1, x2, y2 = max(faces, key=lambda f: (f.box[2] - f.box[0]) * (f.box[3] - f.box[1])).box
        found.append(((x1 + x2) / 2 / fw, (y1 + y2) / 2 / fh, (x2 - x1) / fw, (y2 - y1) / fh))
    ratio = len(found) / max(1, samples)
    if ratio < 0.35:
        return Layout("fit", None, 1 - ratio)
    cx = statistics.median(f[0] for f in found)
    cy = statistics.median(f[1] for f in found)
    fw = statistics.median(f[2] for f in found)
    fh = statistics.median(f[3] for f in found)
    spread = max(statistics.pstdev([f[0] for f in found]), statistics.pstdev([f[1] for f in found]))
    off_center = abs(cx - 0.5) > 0.18 or abs(cy - 0.5) > 0.18
    if fh < 0.22 and spread < 0.06 and off_center:
        return Layout("stream", cam_box(cx, cy, fw, fh, src_w / src_h), min(1.0, ratio * (1 - spread * 5)))
    return Layout("face", None, ratio)


def cam_box(cx: float, cy: float, fw: float, fh: float, aspect: float) -> tuple[float, float, float, float]:
    """Rectangle probable de la facecam autour du visage (16:9 environ), collé aux bords proches."""
    w = min(0.6, fw * 3.4)
    h = min(0.6, w * aspect * 9 / 16)  # w et h en fractions : corrige le rapport de l'image source
    x = cx - w / 2
    y = cy - h * 0.45
    x, y = min(max(0.0, x), 1 - w), min(max(0.0, y), 1 - h)
    # une facecam est presque toujours collée à un bord : on l'y aimante
    if x < 0.04:
        x = 0.0
    if x + w > 0.96:
        x = 1 - w
    if y < 0.04:
        y = 0.0
    if y + h > 0.96:
        y = 1 - h
    return round(x, 4), round(y, 4), round(w, 4), round(h, 4)


# ------------------------------------------------------------------ suivi du visage
def track(src: Path, start: float, duration: float, src_w: int, src_h: int,
          cancel: threading.Event | None = None, fps: float = 6.0) -> list[tracking.Sample]:
    """Centre horizontal du visage suivi (fraction de la largeur) ~6 fois par seconde."""
    out: list[tracking.Sample] = []
    prev: float | None = None
    for t, img in frames(src, start, duration, fps, src_w, src_h, cancel):
        faces = F.detect(img, threshold=0.6)
        w = img.shape[1]
        if not faces:
            out.append((t, None))
            continue
        def area(f): return (f.box[2] - f.box[0]) * (f.box[3] - f.box[1])
        biggest = max(faces, key=area)
        pick = biggest
        if prev is not None:
            # hystérésis : on reste sur la même personne tant qu'elle reste assez grande
            near = min(faces, key=lambda f: abs((f.box[0] + f.box[2]) / 2 / w - prev))
            if abs((near.box[0] + near.box[2]) / 2 / w - prev) < 0.12 and area(near) >= 0.6 * area(biggest):
                pick = near
        x = (pick.box[0] + pick.box[2]) / 2 / w
        out.append((t, x))
        prev = x
    return out


# ------------------------------------------------------------------ graphe FFmpeg
def _even(v: float) -> int:
    v = int(round(v))
    return v - v % 2


def _cam_crop(cam: Box, src_w: int, src_h: int) -> tuple[int, str]:
    """Hauteur de la zone du haut et filtre ``crop`` de la cam, ajusté au rapport de cette zone (centré)."""
    x, y, w, h = cam
    cw, ch = w * src_w, h * src_h
    top_h = _even(min(860, max(560, OUT_W * ch / max(1, cw))))
    want = OUT_W / top_h
    if cw / ch > want:
        ncw, nch = ch * want, ch
    else:
        ncw, nch = cw, cw / want
    cx0 = min(max(0, x * src_w + (cw - ncw) / 2), src_w - ncw)
    cy0 = min(max(0, y * src_h + (ch - nch) / 2), src_h - nch)
    return top_h, f"crop={_even(ncw)}:{_even(nch)}:{_even(cx0)}:{_even(cy0)}"


def filtergraph(layout: Layout, src_w: int, src_h: int, subtitles: bool, track_file: bool,
                fps: float = 30.0, duration: float = 60.0) -> tuple[str, float]:
    """Graphe ``-filter_complex`` (sortie ``[v]``) et hauteur du haut de la zone de sous-titres (en %)."""
    tail = (",ass=subs.ass" if subtitles else "") + "[v]"
    if layout.mode == "chat":
        top_h, cam_crop = _cam_crop(layout.cam or (0.0, 0.0, 0.25, 0.25), src_w, src_h)
        bot_h = OUT_H - top_h
        # panneau sombre façon Twitch, sur lequel chat.ass dessine les messages
        graph = (f"[0:v]{cam_crop},scale={OUT_W}:{top_h},format=yuv420p[top];"
                 f"color=c=0x18181B:s={OUT_W}x{bot_h}:r={fps:g}:d={duration:.3f},format=yuv420p,ass=chat.ass[bot];"
                 f"[top][bot]vstack=inputs=2,setsar=1{tail}")
        return graph, round(top_h / OUT_H * 100 + 3, 1)
    if layout.mode == "stream" and layout.cam:
        top_h, cam_crop = _cam_crop(layout.cam, src_w, src_h)
        bot_h = OUT_H - top_h
        gw, gh = src_h * OUT_W / bot_h, src_h
        if gw > src_w:
            gw, gh = src_w, src_w * bot_h / OUT_W
        gx, gy = (src_w - gw) / 2, (src_h - gh) / 2
        graph = (f"[0:v]split=2[a][b];"
                 f"[a]{cam_crop},scale={OUT_W}:{top_h}[top];"
                 f"[b]crop={_even(gw)}:{_even(gh)}:{_even(gx)}:{_even(gy)},scale={OUT_W}:{bot_h}[bot];"
                 f"[top][bot]vstack=inputs=2,setsar=1{tail}")
        return graph, round(top_h / OUT_H * 100 + 3, 1)
    if layout.mode == "face" and src_w > src_h:
        cw = _even(src_h * OUT_W / OUT_H)
        x0 = _even((src_w - cw) / 2)
        cmd = "sendcmd=f=track.cmd," if track_file else ""
        graph = f"[0:v]{cmd}crop@track={cw}:{_even(src_h)}:{x0}:0,scale={OUT_W}:{OUT_H},setsar=1{tail}"
        return graph, 0.0
    graph = (f"[0:v]split=2[a][b];"
             f"[a]scale={OUT_W}:{OUT_H}:force_original_aspect_ratio=increase,crop={OUT_W}:{OUT_H},"
             f"boxblur=28:2,eq=brightness=-0.10[bg];"
             f"[b]scale={OUT_W}:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1{tail}")
    return graph, 0.0


def crop_fraction(src_w: int, src_h: int) -> float:
    return min(1.0, (src_h * OUT_W / OUT_H) / max(1, src_w))
