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


DETECT_VERSION = 2  # les détections plus anciennes (layout.json en cache) sont refaites


@dataclass
class Layout:
    mode: str  # stream | chat | face | fit
    cam: Box | None = None  # la facecam (modes stream et chat)
    confidence: float = 0.0
    content: Box | None = None  # l'image du jeu / du film, sans bandes noires (mode stream)

    def to_dict(self) -> dict:
        return {"mode": self.mode, "cam": list(self.cam) if self.cam else None, "confidence": round(self.confidence, 2),
                "content": list(self.content) if self.content else None, "v": DETECT_VERSION}

    @staticmethod
    def from_dict(d: dict | None) -> "Layout":
        d = d or {}
        cam = d.get("cam")
        content = d.get("content")
        mode = d.get("mode") or "fit"
        if mode == "discord":  # ancien cadrage (0.2.0) : devenu « cam + jeu »
            mode = "stream"
        return Layout(mode, clamp_box(cam) if cam else None, float(d.get("confidence") or 0),
                      clamp_box(content) if content else None)


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
Face = tuple[float, float, float, float]  # cx, cy, w, h (fractions)


def detect_layout(src: Path, duration: float, src_w: int, src_h: int, cancel: threading.Event | None = None,
                  samples: int = 28) -> Layout:
    """Regarde ~30 images réparties dans la vidéo pour choisir la mise en page.

    Une facecam, c'est un visage qui revient au même endroit, hors du centre, sur une bonne partie des images —
    même quand d'autres visages (film, jeu, invités) passent ailleurs à l'écran."""
    if src_h >= src_w * 1.3:
        return Layout("fit", None, 1.0)  # déjà vertical
    imgs: list[np.ndarray] = []
    faces: list[list[Face]] = []
    for k in range(samples):
        if cancel is not None and cancel.is_set():
            raise Canceled()
        img = frame_at(src, duration * (0.05 + 0.9 * k / max(1, samples - 1)), src_w, src_h)
        if img is None:
            continue
        fh, fw = img.shape[:2]
        imgs.append(img)
        faces.append([((f.box[0] + f.box[2]) / 2 / fw, (f.box[1] + f.box[3]) / 2 / fh,
                       (f.box[2] - f.box[0]) / fw, (f.box[3] - f.box[1]) / fh) for f in F.detect(img, threshold=0.65)])
    n = len(imgs)
    if not n:
        return Layout("fit", None, 0.0)
    cam_face, support = _steady_face(faces)
    if cam_face and support / n >= 0.3:
        cx, cy, fw, fh = cam_face
        off_center = abs(cx - 0.5) > 0.15 or abs(cy - 0.5) > 0.15
        if fh < 0.25 and off_center:
            gray = np.stack([i.mean(axis=2) for i in imgs]).astype(np.float32)
            cam = _cam_rect(gray, cam_face) or cam_box(cx, cy, fw, fh, src_w / src_h)
            return Layout("stream", cam, min(1.0, support / n + 0.2), _content_box(gray, cam))
    ratio = sum(1 for f in faces if f) / n
    if ratio < 0.35:
        return Layout("fit", None, 1 - ratio)
    return Layout("face", None, ratio)


def _steady_face(faces: list[list[Face]]) -> tuple[Face | None, int]:
    """Le visage qui revient le plus souvent au même endroit (et le nombre d'images où on le voit)."""
    def near(a: Face, b: Face) -> bool:
        return abs(a[0] - b[0]) < 0.05 and abs(a[1] - b[1]) < 0.07 and 0.6 < a[3] / max(b[3], 1e-6) < 1.6

    best: tuple[Face | None, int] = (None, 0)
    for frame in faces:
        for c in frame:
            support = sum(1 for other in faces if any(near(o, c) for o in other))
            if support > best[1]:
                best = (c, support)
    if best[0] is None:
        return best
    members = [o for other in faces for o in other if near(o, best[0])]
    med = tuple(statistics.median(m[i] for m in members) for i in range(4))
    return med, best[1]  # type: ignore[return-value]


def _edge(moving: np.ndarray, start: int, step: int, need: int) -> int:
    """Depuis le visage (``start``), avance de ``step`` : on traverse la personne (elle bouge), puis le décor
    de la pièce (immobile), et on s'arrête à la première série de ``need`` cases qui bougent après ce décor
    — le jeu ou le film. Retourne l'indice où elles commencent, ou le bord de l'image (-1 / len)."""
    i, run, n, still = start, 0, len(moving), 0
    while 0 <= i < n:
        if moving[i]:
            run += 1
            if still >= need and run >= need:
                return i - step * (need - 1)
        else:
            run = 0
            still += 1
        i += step
    return -1 if step < 0 else n


def _cam_rect(gray: np.ndarray, face: Face) -> Box | None:
    """Rectangle de la facecam : autour du visage, la pièce du streamer bouge peu d'une image à l'autre,
    alors que le jeu ou le film change complètement. On part du visage et on s'arrête là où l'image « bouge »."""
    _, h, w = gray.shape
    moving = gray.std(axis=0) > 28.0
    cx, cy, fw, fh = face
    px, py = int(cx * w), int(cy * h)
    r0, r1 = max(0, int((cy - fh) * h)), min(h, int((cy + fh) * h) + 1)
    cols = moving[r0:r1].mean(axis=0) > 0.8  # le jeu / film bouge partout, la personne seulement par endroits
    need_x, need_y = max(3, w // 100), max(3, h // 100)
    left = _edge(cols, px, -1, need_x) + 1
    right = _edge(cols, px, 1, need_x)
    rows = moving[:, left:right].mean(axis=1) > 0.8
    top = _edge(rows, py, -1, need_y) + 1
    bottom = _edge(rows, py, 1, need_y)
    bw, bh = (right - left) / w, (bottom - top) / h
    # trop grand (jeu figé, plan fixe) ou trop petit : on garde l'estimation autour du visage
    if not (fw * 1.6 < bw < 0.6 and fh * 1.8 < bh < 0.7):
        log.info("Facecam edges not found (%.2f x %.2f): estimated around the face", bw, bh)
        return None

    def snap(v: float) -> float:
        return 0.0 if v < 0.02 else (1.0 if v > 0.98 else v)

    x0, x1, y0, y1 = snap(left / w), snap(right / w), snap(top / h), snap(bottom / h)
    return clamp_box((x0, y0, x1 - x0, y1 - y0))


def _content_box(gray: np.ndarray, cam: Box | None) -> Box | None:
    """La zone utile (jeu, film) : sans les bandes noires ni la facecam."""
    _, h, w = gray.shape
    alive = (gray.max(axis=0) > 24) & (gray.std(axis=0) > 6)
    if cam:
        x, y, cw, ch = cam
        alive[int(y * h):int((y + ch) * h) + 1, int(x * w):int((x + cw) * w) + 1] = False
    rows = np.where(alive.mean(axis=1) > 0.25)[0]
    cols = np.where(alive.mean(axis=0) > 0.25)[0]
    if len(rows) < h * 0.2 or len(cols) < w * 0.2:
        return None
    box = (cols[0] / w, rows[0] / h, (cols[-1] + 1 - cols[0]) / w, (rows[-1] + 1 - rows[0]) / h)
    if box[2] > 0.97 and box[3] > 0.97:
        return None  # toute l'image
    return clamp_box(box)


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


def _game_crop(layout: Layout, src_w: int, src_h: int, bot_aspect: float):
    """Zone utile entière (pour le fond flouté) et partie montrée en bas : on coupe au plus 40 % de la largeur
    (un film garde ses personnages) et on évite la facecam quand elle est posée sur l'image."""
    bx, by, bw, bh = layout.content or (0.0, 0.0, 1.0, 1.0)
    cx, cy, cw, ch = bx * src_w, by * src_h, bw * src_w, bh * src_h
    gh = ch
    gw = min(cw, gh * max(bot_aspect, cw / ch * 0.6))
    gx = cx + (cw - gw) / 2
    if layout.cam:
        kx, ky, kw, kh = layout.cam[0] * src_w, layout.cam[1] * src_h, layout.cam[2] * src_w, layout.cam[3] * src_h
        if ky < cy + gh and ky + kh > cy:  # la cam est posée sur l'image montrée : on se décale à côté
            if kx + kw / 2 > src_w / 2 and gx + gw > kx:
                gx = max(cx, kx - gw)
            elif kx + kw / 2 <= src_w / 2 and gx < kx + kw:
                gx = min(cx + cw - gw, kx + kw)
    return (_even(cw), _even(ch), _even(cx), _even(cy)), (_even(gw), _even(gh), _even(gx), _even(cy))


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
        (cw, ch, cx, cy), (gw, gh, gx, gy) = _game_crop(layout, src_w, src_h, OUT_W / bot_h)
        # le jeu / film, recadré sans trop zoomer, sur un fond flouté de la même image
        graph = (f"[0:v]split=3[a][b][c];"
                 f"[a]{cam_crop},scale={OUT_W}:{top_h}[top];"
                 f"[b]crop={cw}:{ch}:{cx}:{cy},scale={OUT_W}:{bot_h}:force_original_aspect_ratio=increase,"
                 f"crop={OUT_W}:{bot_h},boxblur=24:2,eq=brightness=-0.12[bg];"
                 f"[c]crop={gw}:{gh}:{gx}:{gy},scale={OUT_W}:-2[fg];"
                 f"[bg][fg]overlay=0:(H-h)/2[bot];"
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
