"""Trouver les moments intéressants d'une longue vidéo, sans IA de texte (rapide, déterministe, testé).

* La transcription mot par mot est regroupée en **phrases** (ponctuation finale ou silence).
* Des **signaux** sont calculés pour chaque seconde : énergie du son (cris, rires, excitation) comparée au
  reste de la vidéo, débit de parole, mots qui trahissent une réaction (« mdr », « wesh », « quoi ?! »…),
  et l'activité du **chat** quand on l'a (rediffusion Twitch / YouTube).
* Les **candidats** sont des suites de phrases de la bonne durée ; ils reçoivent un pré-score à partir des
  signaux, puis les meilleurs (sans chevauchement) partent à l'IA de texte.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field

import numpy as np

END_PUNCT = re.compile(r"[.!?…]+[»\"”)]*$")
REACTION = re.compile(
    r"\b(mdr|ptdr|xptdr|lol|haha+|hahaha+|hihi+|ahah+|wesh|wsh|oh+|ah+|wow+|putain|ptn|purée|sérieux|"
    r"incroyable|dingue|ouf|chaud|énorme|non+|quoi|what|omg|bruh|oskour|mais non|c'est pas possible|"
    r"laugh(?:s|ter)?|rires?)\b", re.IGNORECASE)


@dataclass
class Sentence:
    start: float
    end: float
    text: str
    words: list[dict] = field(default_factory=list)

    @property
    def duration(self) -> float:
        return self.end - self.start


@dataclass
class Candidate:
    first: int  # index de la première phrase
    last: int   # index de la dernière phrase (incluse)
    start: float
    end: float
    prescore: float
    reasons: list[str] = field(default_factory=list)

    @property
    def duration(self) -> float:
        return self.end - self.start

    def to_dict(self) -> dict:
        return {"first": self.first, "last": self.last, "start": round(self.start, 3), "end": round(self.end, 3),
                "prescore": round(self.prescore, 4), "reasons": self.reasons}


# ------------------------------------------------------------------ phrases
def sentences(words: list[dict], gap: float = 0.9, max_len: float = 18.0) -> list[Sentence]:
    """Phrases : coupe à la ponctuation finale, sur un silence de ``gap`` secondes, ou (phrases-fleuves des
    streams) sur une virgule ou un petit silence au-delà de ``max_len`` secondes."""
    out: list[Sentence] = []
    cur: list[dict] = []

    def flush() -> None:
        if cur:
            text = " ".join(str(w["text"]).strip() for w in cur).strip()
            out.append(Sentence(float(cur[0]["start"]), float(cur[-1]["end"]), text, list(cur)))
            cur.clear()

    for i, w in enumerate(words):
        if cur and float(w["start"]) - float(cur[-1]["end"]) >= gap:
            flush()
        cur.append(w)
        t = str(w["text"]).strip()
        long_enough = cur and float(w["end"]) - float(cur[0]["start"]) >= max_len
        nxt = words[i + 1] if i + 1 < len(words) else None
        small_pause = nxt is not None and float(nxt["start"]) - float(w["end"]) >= 0.3
        if END_PUNCT.search(t) or (long_enough and (t.endswith(",") or small_pause)):
            flush()
    flush()
    return out


# ------------------------------------------------------------------ signaux
def loudness_per_second(pcm: np.ndarray, sr: int = 16000) -> np.ndarray:
    """Niveau sonore (dB RMS) de chaque seconde."""
    n = len(pcm) // sr
    if n == 0:
        return np.zeros(0, dtype=np.float32)
    frames = pcm[: n * sr].astype(np.float32).reshape(n, sr)
    rms = np.sqrt(np.mean(frames * frames, axis=1) + 1e-12)
    return (20 * np.log10(rms + 1e-9)).astype(np.float32)


def _rolling_z(x: np.ndarray, window: int = 120) -> np.ndarray:
    """Écart à la normale locale (médiane glissante), en écarts-types robustes : un passage fort ressort même
    si toute la vidéo est bruyante, et une partie calme n'est pas pénalisée pour autant."""
    if len(x) == 0:
        return x
    half = window // 2
    pad = np.pad(x, (half, half), mode="edge")
    med = np.array([np.median(pad[i:i + window]) for i in range(len(x))], dtype=np.float32)
    mad = np.median(np.abs(x - np.median(x))) * 1.4826 + 1e-6
    return ((x - med) / mad).astype(np.float32)


def signals(duration: float, loud_db: np.ndarray, words: list[dict], chat_times: list[float] | None = None) -> dict:
    """Signaux par seconde (tableaux de même longueur) et ``interest`` qui les combine (≈ 0 à 1)."""
    n = max(1, int(np.ceil(duration)))
    energy = np.zeros(n, dtype=np.float32)
    m = min(n, len(loud_db))
    if m:
        z = _rolling_z(loud_db[:m])
        energy[:m] = np.clip(z, -3, 6)

    rate = np.zeros(n, dtype=np.float32)
    react = np.zeros(n, dtype=np.float32)
    for w in words:
        s = int(min(n - 1, max(0, float(w["start"]))))
        rate[s] += 1
        t = str(w["text"])
        if REACTION.search(t):
            react[s] += 1.0
        if "!" in t or "?!" in t:
            react[s] += 0.5
    rate = np.convolve(rate, np.ones(5) / 5, mode="same").astype(np.float32)
    rate_z = np.clip(_rolling_z(rate), -3, 4) if n > 10 else np.zeros(n, dtype=np.float32)
    react = np.convolve(react, np.ones(4), mode="same").astype(np.float32)

    chat = np.zeros(n, dtype=np.float32)
    has_chat = bool(chat_times)
    for t in chat_times or []:
        if 0 <= t < n:
            chat[int(t)] += 1
    if has_chat:
        # le chat réagit avec ~5 à 15 s de retard : on ramène les pics vers le moment qui les a causés
        chat = np.convolve(chat, np.ones(10) / 10, mode="same")
        chat = np.roll(chat, -8)
        chat_z = np.clip(_rolling_z(chat.astype(np.float32), 300), -3, 8)
    else:
        chat_z = np.zeros(n, dtype=np.float32)

    def norm(a: np.ndarray, hi: float) -> np.ndarray:
        return np.clip(a / hi, 0, 1)

    weights = {"energy": 0.35, "chat": 0.30, "react": 0.20, "rate": 0.15} if has_chat else \
              {"energy": 0.50, "chat": 0.0, "react": 0.30, "rate": 0.20}
    interest = (weights["energy"] * norm(energy, 4) + weights["chat"] * norm(chat_z, 5)
                + weights["react"] * norm(react, 3) + weights["rate"] * norm(rate_z, 3))
    return {"energy": energy, "rate": rate_z, "react": react, "chat": chat_z, "interest": interest.astype(np.float32),
            "has_chat": has_chat}


# ------------------------------------------------------------------ candidats
def _window_score(interest: np.ndarray, start: float, end: float) -> tuple[float, float]:
    a, b = int(start), max(int(start) + 1, int(np.ceil(end)))
    seg = interest[a:b]
    if not len(seg):
        return 0.0, 0.0
    k = max(1, len(seg) // 4)
    peak = float(np.mean(np.sort(seg)[-k:]))  # le meilleur quart : un clip vit de ses pics
    hook = float(np.mean(interest[a:min(b, a + 4)]))  # les 3-4 premières secondes accrochent-elles ?
    return peak, hook


def candidates(sents: list[Sentence], sig: dict, min_len: float = 20.0, max_len: float = 75.0,
               ideal: float = 40.0, keep: int = 40) -> list[Candidate]:
    """Meilleure fenêtre de phrases pour chaque phrase de départ, puis les ``keep`` meilleures sans chevauchement."""
    interest = sig["interest"]
    pool: list[Candidate] = []
    for i, s in enumerate(sents):
        best: Candidate | None = None
        for j in range(i, len(sents)):
            start, end = s.start, sents[j].end
            dur = end - start
            if dur > max_len:
                break
            if dur < min_len:
                continue
            peak, hook = _window_score(interest, start, end)
            # préférence douce pour une durée proche de l'idéal, et pour une fin de phrase franche
            fit = 1.0 - min(1.0, abs(dur - ideal) / ideal) * 0.25
            clean_end = 1.0 if END_PUNCT.search(sents[j].text) else 0.92
            score = (0.75 * peak + 0.25 * hook) * fit * clean_end
            if best is None or score > best.prescore:
                reasons = []
                if hook > 0.35:
                    reasons.append("accroche")
                if sig["has_chat"] and float(np.max(sig["chat"][int(start):int(end) + 1], initial=0)) > 3:
                    reasons.append("chat")
                if float(np.max(sig["react"][int(start):int(end) + 1], initial=0)) >= 2:
                    reasons.append("réaction")
                if float(np.max(sig["energy"][int(start):int(end) + 1], initial=0)) > 3:
                    reasons.append("son")
                best = Candidate(i, j, start, end, score, reasons)
        if best:
            pool.append(best)
    return non_overlapping(pool, keep)


def overlap(a: Candidate, b: Candidate) -> float:
    inter = max(0.0, min(a.end, b.end) - max(a.start, b.start))
    return inter / max(1e-6, min(a.duration, b.duration))


def non_overlapping(pool: list, keep: int, max_overlap: float = 0.25, key=lambda c: c.prescore) -> list:
    chosen: list = []
    for c in sorted(pool, key=key, reverse=True):
        if all(overlap(c, o) <= max_overlap for o in chosen):
            chosen.append(c)
            if len(chosen) >= keep:
                break
    return sorted(chosen, key=lambda c: c.start)


def excerpt(sents: list[Sentence], c: Candidate, offset: float | None = None) -> str:
    """Le texte d'un candidat, une phrase par ligne numérotée, avec son temps (pour l'IA de texte)."""
    base = c.start if offset is None else offset
    lines = []
    for k in range(c.first, c.last + 1):
        s = sents[k]
        lines.append(f"[{k - c.first}] ({s.start - base:5.1f}s) {s.text}")
    return "\n".join(lines)
