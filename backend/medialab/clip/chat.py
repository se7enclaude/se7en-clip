"""Le chat d'une rediffusion (Twitch, YouTube) : récupéré pour trouver les moments forts, et recréé sous la cam
dans la mise en page « Cam + chat » (messages qui défilent, pseudo en couleur, comme sur Twitch).

* Twitch : API publique GraphQL du lecteur (celle qu'utilise le site pour rejouer le chat d'une rediff), par
  tranches lues en parallèle.
* YouTube : le « live_chat » que yt-dlp sait récupérer pour les rediffusions de live.
Rien de tout ça n'est bloquant : sans chat, l'analyse continue avec le son et la transcription.
"""
from __future__ import annotations

import hashlib
import json
import re
import threading
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import httpx

from ..logging_setup import get_logger

log = get_logger("clip")

TWITCH_GQL = "https://gql.twitch.tv/gql"
TWITCH_CLIENT = "kimne78kx3ncx6brgo4mv6wki5h1ko"  # identifiant public du lecteur web de Twitch
TWITCH_COMMENTS_HASH = "b70a3591ff0f4e0313d126c6a1502d79a1c02baebb288227c582044aa76adf6a"
PALETTE = ["#FF4A4A", "#3BA9FF", "#2BD97A", "#FF8A3D", "#B07CFF", "#FF5FB4", "#29D6D6", "#FFD23F", "#8BE04E",
           "#FF7A7A", "#5DA8FF", "#E07BFF"]


def color_for(user: str) -> str:
    return PALETTE[int(hashlib.md5(user.encode("utf-8")).hexdigest(), 16) % len(PALETTE)]


# ------------------------------------------------------------------ Twitch
def twitch_video_id(url: str) -> str | None:
    m = re.search(r"twitch\.tv/(?:[^/]+/)?videos?/(\d+)", url) or re.search(r"twitch\.tv/[^/]+/v/(\d+)", url)
    return m.group(1) if m else None


def _twitch_page(client: httpx.Client, vid: str, offset: float | None = None, cursor: str | None = None) -> dict:
    variables: dict = {"videoID": vid}
    if cursor:
        variables["cursor"] = cursor
    else:
        variables["contentOffsetSeconds"] = int(offset or 0)
    body = [{"operationName": "VideoCommentsByOffsetOrCursor", "variables": variables,
             "extensions": {"persistedQuery": {"version": 1, "sha256Hash": TWITCH_COMMENTS_HASH}}}]
    r = client.post(TWITCH_GQL, json=body, headers={"Client-ID": TWITCH_CLIENT}, timeout=20)
    r.raise_for_status()
    return ((r.json()[0].get("data") or {}).get("video") or {}).get("comments") or {}


def _twitch_segment(vid: str, start: float, stop: float, cancel: threading.Event) -> list[dict]:
    """Messages de [start, stop[. Twitch refuse la pagination par curseur sans contrôle anti-robot, mais accepte
    la lecture « à partir de telle seconde » : on avance donc dans la vidéo au fil des pages (~60 messages)."""
    out: list[dict] = []
    seen: set[tuple] = set()
    off = start
    with httpx.Client() as client:
        while off < stop and not cancel.is_set():
            edges = _twitch_page(client, vid, offset=off).get("edges") or []
            last = off
            for e in edges:
                n = e.get("node") or {}
                t = float(n.get("contentOffsetSeconds") or 0)
                msg = n.get("message") or {}
                text = "".join(f.get("text") or "" for f in msg.get("fragments") or []).strip()
                user = ((n.get("commenter") or {}).get("displayName")) or "anonyme"
                key = (t, user, text)
                last = max(last, t)
                if text and start <= t < stop and key not in seen:
                    seen.add(key)
                    out.append({"t": t, "user": user, "color": msg.get("userColor") or color_for(user), "text": text})
            # page suivante : juste après le dernier message lu (ou 30 s plus loin si le chat est vide ici)
            off = last + 1 if last > off else off + 30
    return out


def fetch_twitch(vid: str, duration: float, cancel: threading.Event) -> list[dict]:
    step = 300.0  # tranches de 5 minutes, lues en parallèle
    bounds = [(k * step, min(duration + 60, (k + 1) * step)) for k in range(int(duration // step) + 1)]
    with ThreadPoolExecutor(max_workers=8) as pool:
        parts = list(pool.map(lambda b: _twitch_segment(vid, b[0], b[1], cancel), bounds))
    return [m for part in parts for m in part]


# ------------------------------------------------------------------ YouTube (yt-dlp)
def _youtube_messages(p: Path) -> list[dict]:
    out: list[dict] = []
    for line in p.read_text("utf-8", errors="replace").splitlines():
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        replay = obj.get("replayChatItemAction") or {}
        try:
            t = int(replay.get("videoOffsetTimeMsec") or 0) / 1000
        except ValueError:
            continue
        for action in replay.get("actions") or []:
            item = ((action.get("addChatItemAction") or {}).get("item") or {})
            r = item.get("liveChatTextMessageRenderer") or item.get("liveChatPaidMessageRenderer")
            if not r:
                continue
            parts = []
            for run in (r.get("message") or {}).get("runs") or []:
                if "text" in run:
                    parts.append(run["text"])
                elif "emoji" in run:
                    sc = (run["emoji"].get("shortcuts") or [""])[0]
                    parts.append(sc)
            text = "".join(parts).strip()
            user = ((r.get("authorName") or {}).get("simpleText") or "anonyme").lstrip("@")
            if text:
                out.append({"t": t, "user": user, "color": color_for(user), "text": text})
    return out


def fetch_youtube(url: str, cache: Path) -> list[dict]:
    import yt_dlp
    opts = {"skip_download": True, "writesubtitles": True, "subtitleslangs": ["live_chat"],
            "outtmpl": str(cache / "chat.%(ext)s"), "quiet": True, "no_warnings": True, "noprogress": True}
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([url])
    return [m for p in cache.glob("chat*.json") for m in _youtube_messages(p)]


# ------------------------------------------------------------------ point d'entrée
def fetch(url: str | None, duration: float, cache: Path, cancel: threading.Event) -> list[dict]:
    """Messages du chat triés par temps ({t, user, color, text}), gardés dans le cache du projet."""
    f = cache / "chat.json"
    if f.exists():
        return json.loads(f.read_text("utf-8"))
    msgs: list[dict] = []
    if url:
        try:
            vid = twitch_video_id(url)
            if vid:
                msgs = fetch_twitch(vid, duration, cancel)
            elif re.search(r"youtube\.com|youtu\.be", url, re.I):
                msgs = fetch_youtube(url, cache)
        except Exception as e:  # le chat est un bonus : jamais bloquant
            log.info("Chat replay unavailable for %s: %s", url, e)
    msgs.sort(key=lambda m: m["t"])
    f.write_text(json.dumps(msgs, ensure_ascii=False), "utf-8")
    log.info("Chat replay: %d messages", len(msgs))
    return msgs


# ------------------------------------------------------------------ rendu (ASS)
def _ass_color(hex_color: str) -> str:
    h = (hex_color or "#FFFFFF").lstrip("#")
    if len(h) != 6:
        h = "FFFFFF"
    return f"&H{h[4:6]}{h[2:4]}{h[0:2]}&".upper()


def _escape(text: str) -> str:
    return text.replace("\\", "/").replace("{", "(").replace("}", ")").replace("\n", " ")


def _ass_time(t: float) -> str:
    t = max(0.0, t)
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def ass(messages: list[dict], start: float, end: float, width: int, height: int, visible: int = 12,
        max_chars: int = 90) -> str:
    """Le panneau de chat (fond géré par FFmpeg) : à chaque nouveau message, les derniers messages, du plus
    ancien en haut au plus récent en bas, pseudo en gras et en couleur."""
    font = max(30, round(width / 24))
    head = (f"[Script Info]\nScriptType: v4.00+\nPlayResX: {width}\nPlayResY: {height}\nWrapStyle: 0\n"
            "ScaledBorderAndShadow: yes\n\n[V4+ Styles]\n"
            "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, "
            "Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, "
            "MarginL, MarginR, MarginV, Encoding\n"
            f"Style: Chat,Segoe UI,{font},&H00EFEFF1,&H00EFEFF1,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,1,"
            f"{round(width * 0.045)},{round(width * 0.045)},{round(height * 0.04)},1\n"
            f"Style: Head,Segoe UI,{round(font * 0.62)},&H00ADADB8,&H00ADADB8,&H00000000,&H00000000,1,0,0,0,100,100,"
            f"2,0,1,0,0,7,{round(width * 0.045)},{round(width * 0.045)},{round(height * 0.03)},1\n\n"
            "[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n")
    dur = end - start
    lines = [f"Dialogue: 0,{_ass_time(0)},{_ass_time(dur)},Head,,0,0,0,,CHAT DU STREAM"]
    window = [m for m in messages if start - 120 <= m["t"] <= end]
    if not window:
        return head + "\n".join(lines) + "\n"

    def block(upto: int) -> str:
        shown = window[max(0, upto - visible + 1): upto + 1]
        parts = []
        for m in shown:
            text = m["text"] if len(m["text"]) <= max_chars else m["text"][: max_chars - 1] + "…"
            parts.append("{\\b1\\c" + _ass_color(m["color"]) + "}" + _escape(m["user"]) + "{\\b0\\c&HF1EFEF&}: "
                         + _escape(text))
        return "\\N".join(parts)

    first = next((i for i, m in enumerate(window) if m["t"] >= start), len(window))
    events: list[tuple[float, int]] = []
    if first > 0:
        events.append((0.0, first - 1))  # ce qui était déjà dans le chat au début du clip
    events += [(window[i]["t"] - start, i) for i in range(first, len(window))]
    for k, (t, idx) in enumerate(events):
        t_end = events[k + 1][0] if k + 1 < len(events) else dur
        if t_end - t < 0.01:
            continue
        lines.append(f"Dialogue: 0,{_ass_time(t)},{_ass_time(t_end)},Chat,,0,0,0,,{block(idx)}")
    return head + "\n".join(lines) + "\n"
