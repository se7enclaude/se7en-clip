"""L'IA de texte locale (llama.cpp, Ministral 3 8B, sur la carte graphique) juge chaque moment candidat.

Pour chaque candidat elle lit l'extrait (phrases numérotées) et répond en JSON : une note de potentiel viral,
les phrases où commencer et finir pour que le clip se tienne tout seul, un titre, une description et des
hashtags. Rien ne quitte le PC. Si le modèle ne peut pas démarrer, les signaux seuls décident (titres simples).
"""
from __future__ import annotations

import json
import re
import threading
from typing import Callable

import httpx

from ..logging_setup import get_logger
from ..errors import Canceled
from ..subtitles.llm import LocalLLM
from . import moments as M

log = get_logger("clip")

SYSTEM_FR = """Tu es monteur expert en clips viraux TikTok / YouTube Shorts / Reels (contenu francophone : streams, \
podcasts, vidéos YouTube). On te donne un extrait transcrit d'une longue vidéo, une phrase par ligne numérotée \
avec son temps.

Juge s'il ferait un bon clip vertical de 20 à 75 secondes :
- accroche : les premières secondes donnent-elles envie de rester ?
- moment fort : chute drôle, punchline, réaction, rage, surprise, info choc, émotion, débat ;
- compréhensible SANS le reste de la vidéo ;
- fin nette (pas coupé au milieu d'une idée).

Choisis la phrase de début et de fin (numéros) pour le meilleur clip possible DANS cet extrait : commence au plus \
près de l'accroche, finis juste après la chute. Sois exigeant : un passage banal (explications, blabla, menus, \
silences) vaut moins de 40. Un très bon clip vaut plus de 80.

Le titre : court (max 70 caractères), accrocheur, dans la langue de l'extrait, sans guillemets, et fidèle : n'invente aucun fait, aucun nom, aucun chiffre qui n'est pas dans l'extrait. La description : \
une phrase. Hashtags : 3 à 5, sans espace, avec #. Réponds uniquement en JSON."""

SCHEMA = {
    "type": "object",
    "properties": {
        "score": {"type": "integer", "minimum": 0, "maximum": 100},
        "hook": {"type": "integer", "minimum": 0, "maximum": 10},
        "payoff": {"type": "integer", "minimum": 0, "maximum": 10},
        "standalone": {"type": "integer", "minimum": 0, "maximum": 10},
        "start": {"type": "integer", "minimum": 0},
        "end": {"type": "integer", "minimum": 0},
        "title": {"type": "string"},
        "description": {"type": "string"},
        "hashtags": {"type": "array", "items": {"type": "string"}, "maxItems": 6},
        "why": {"type": "string"},
    },
    "required": ["score", "hook", "payoff", "standalone", "start", "end", "title", "description", "hashtags", "why"],
}


class ClipJudge:
    """Le modèle local, démarré une fois pour toute l'analyse puis arrêté (la carte graphique est libérée)."""

    def __init__(self, cancel: threading.Event, progress: Callable[[int, int], None] | None = None) -> None:
        self.llm = LocalLLM(progress)
        self.llm.cancel = cancel
        self.cancel = cancel

    def ask(self, excerpt: str, context: str) -> dict:
        if self.llm.proc is None or self.llm.proc.poll() is not None:
            self.llm._start()
        user = (f"Contexte de la vidéo : {context}\n\n" if context else "") + f"Extrait :\n{excerpt}"
        payload = {
            "messages": [{"role": "system", "content": SYSTEM_FR}, {"role": "user", "content": user}],
            "temperature": 0.2, "max_tokens": 500, "repeat_penalty": 1.05,
            "response_format": {"type": "json_schema", "json_schema": {"name": "clip", "strict": True,
                                                                       "schema": SCHEMA}}}
        r = httpx.post(f"http://127.0.0.1:{self.llm.port}/v1/chat/completions", json=payload,
                       timeout=httpx.Timeout(30, read=120))
        r.raise_for_status()
        return json.loads(r.json()["choices"][0]["message"]["content"])

    def stop(self) -> None:
        self.llm.stop()


def _clean_tags(tags: list) -> list[str]:
    out = []
    for t in tags or []:
        t = re.sub(r"[^\w#]", "", str(t).replace(" ", ""))
        if not t:
            continue
        t = t if t.startswith("#") else "#" + t
        if t.lower() not in (x.lower() for x in out):
            out.append(t)
    return out[:5]


def fallback_meta(sents: list[M.Sentence], c: M.Candidate) -> dict:
    first = sents[c.first].text.strip()
    title = (first[:67] + "…") if len(first) > 70 else first
    return {"title": title, "description": "", "hashtags": ["#clip", "#fyp", "#pourtoi"], "why": ""}


def judge(sents: list[M.Sentence], cands: list[M.Candidate], context: str, cancel: threading.Event,
          progress: Callable[[float, str], None], model_progress: Callable[[int, int], None] | None = None,
          use_ai: bool = True) -> tuple[list[dict], str | None]:
    """Note chaque candidat. Retourne (moments, note) ; ``note`` explique un repli sans IA."""
    out: list[dict] = []
    judge_ = ClipJudge(cancel, model_progress) if use_ai else None
    note = None
    try:
        for k, c in enumerate(cands):
            if cancel.is_set():
                raise Canceled()
            progress(k / max(1, len(cands)), f"{k + 1}/{len(cands)}")
            ai = None
            if judge_ is not None:
                try:
                    ai = judge_.ask(M.excerpt(sents, c), context)
                except Canceled:
                    raise
                except Exception as e:  # le modèle ne démarre pas / réponse illisible : on continue sans lui
                    log.warning("Local model could not judge candidate %d: %s", k, e)
                    if judge_.llm.proc is None or judge_.llm.proc.poll() is not None:
                        note = "L'IA de texte n'a pas pu démarrer : moments choisis d'après le son et le chat."
                        judge_ = None
            moment = _merge(sents, c, ai)
            out.append(moment)
    finally:
        if judge_ is not None:
            judge_.stop()
    return out, note


def _merge(sents: list[M.Sentence], c: M.Candidate, ai: dict | None) -> dict:
    first, last = c.first, c.last
    pre = min(1.0, c.prescore / 0.6)  # pré-score des signaux ramené vers 0..1
    if ai:
        n = c.last - c.first
        a = max(0, min(n, int(ai.get("start", 0))))
        b = max(a, min(n, int(ai.get("end", n))))
        cand_first, cand_last = c.first + a, c.first + b
        # on n'accepte un resserrage que s'il garde un clip assez long (sinon l'extrait entier)
        if sents[cand_last].end - sents[cand_first].start >= 15:
            first, last = cand_first, cand_last
        ai_score = max(0, min(100, int(ai.get("score", 0)))) / 100
        score = 0.7 * ai_score + 0.3 * pre
        meta = {"title": str(ai.get("title") or "").strip().strip('"«»“”').strip()[:90],
                "description": str(ai.get("description") or "").strip()[:300],
                "hashtags": _clean_tags(ai.get("hashtags")), "why": str(ai.get("why") or "").strip()[:300],
                "hook": int(ai.get("hook", 0)), "payoff": int(ai.get("payoff", 0)),
                "standalone": int(ai.get("standalone", 0))}
        if not meta["title"]:
            meta["title"] = fallback_meta(sents, c)["title"]
    else:
        score = pre
        meta = fallback_meta(sents, c)
    start = max(0.0, sents[first].start - 0.15)
    end = sents[last].end + 0.35
    return {"start": round(start, 3), "end": round(end, 3), "score": round(score * 100), "reasons": c.reasons,
            "ai": ai is not None, **meta}


def pick(moments: list[dict], count: int) -> list[dict]:
    """Les ``count`` meilleurs moments sans chevauchement, du meilleur au moins bon."""
    class _C:
        def __init__(self, m: dict) -> None:
            self.m, self.start, self.end = m, m["start"], m["end"]

        @property
        def duration(self) -> float:
            return self.end - self.start

    chosen = M.non_overlapping([_C(m) for m in moments], count, 0.2, key=lambda c: c.m["score"])
    return sorted((c.m for c in chosen), key=lambda m: -m["score"])
