"""Sous-titres « TikTok » : 1 à 3 mots à la fois, gros, le mot prononcé surligné.

On repart des mots horodatés de la transcription (déjà sur la timeline de la vidéo source) et on les ramène
sur la timeline du clip. Le rendu ASS (animation, couleurs, contour) est celui du module de sous-titres.
"""
from __future__ import annotations

import re

from ..subtitles import styles

_BREAK_AFTER = re.compile(r"[.!?…,;:]+[»\"”)]*$")

# Styles proposés (au-dessus des préréglages du module de sous-titres)
CAPTION_STYLES: dict[str, dict] = {
    "tiktok": {"preset": "tiktok", "animation": "highlight", "highlight_color": "#FFE000", "size": 6.2,
               "uppercase": True, "outline": 0.16},
    "hormozi": {"preset": "tiktok", "font": "Arial Black", "animation": "highlight", "highlight_color": "#2BFF5C",
                "size": 6.8, "uppercase": True, "outline": 0.18},
    "neon": {"preset": "bold", "animation": "highlight", "highlight_color": "#FF3BD4", "size": 6.4,
             "uppercase": True, "outline": 0.14},
    "clean": {"preset": "netflix", "animation": "none", "size": 4.6, "uppercase": False, "outline": 0.1},
    "none": {},
}


def style_for(name: str, vertical: str = "bottom", position: float = 30.0) -> dict | None:
    if name == "none" or name not in CAPTION_STYLES:
        return None if name == "none" else style_for("tiktok", vertical, position)
    return styles.resolve({**CAPTION_STYLES[name], "vertical": vertical, "position": position, "max_width": 86.0})


def chunks(words: list[dict], start: float, end: float, max_words: int = 3, max_chars: int = 18,
           max_gap: float = 0.35) -> list[dict]:
    """Petits groupes de mots du clip [start, end], en secondes depuis le début du clip."""
    inside = [w for w in words if float(w["end"]) > start and float(w["start"]) < end and str(w["text"]).strip()]
    cues: list[dict] = []
    cur: list[dict] = []

    def flush() -> None:
        if not cur:
            return
        ws = [{"text": str(w["text"]).strip(), "start": round(max(0.0, float(w["start"]) - start), 3),
               "end": round(min(end, float(w["end"])) - start, 3)} for w in cur]
        cues.append({"start": ws[0]["start"], "end": max(ws[-1]["end"], ws[0]["start"] + 0.25),
                     "text": " ".join(w["text"] for w in ws), "words": ws})
        cur.clear()

    for w in inside:
        t = str(w["text"]).strip()
        if cur:
            gap = float(w["start"]) - float(cur[-1]["end"])
            chars = sum(len(str(x["text"]).strip()) + 1 for x in cur) + len(t)
            if len(cur) >= max_words or chars > max_chars or gap > max_gap:
                flush()
        cur.append(w)
        if _BREAK_AFTER.search(t):
            flush()
    flush()
    # chaque groupe reste affiché jusqu'au suivant s'il n'y a qu'un petit trou (pas de clignotement)
    for a, b in zip(cues, cues[1:]):
        if 0 < b["start"] - a["end"] < 0.4:
            a["end"] = b["start"]
    for c in cues:
        c["id"] = f"{c['start']:.3f}"
    return cues
