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
réactions, podcasts, vidéos YouTube). On te donne un extrait transcrit d'une longue vidéo, une phrase par ligne \
numérotée avec son temps.

Décide s'il contient un VRAI moment à clipper, de {DUR} secondes. Un vrai moment, c'est une mise en place puis une \
chute : blague qui fait rire, punchline, grosse réaction (fou rire, cri, rage, choc), révélation, embrouille, \
anecdote qui finit fort, avis tranché qui fait débat. Il doit se comprendre SANS le reste de la vidéo.

Ce ne sont PAS des moments (note sous 30) : début ou fin de stream, « bonjour à tous », pub ou sponsor, lecture \
des dons ou abonnements, problème technique, attente, menu, chargement, explication plate, blabla sans chute, \
passage qui coupe au milieu d'une histoire.

D'abord : résume en une phrase ce qui se passe, puis dis quelle est la chute (« aucune » s'il n'y en a pas). \
Ensuite note : accroche (les 3 premières secondes donnent-elles envie de rester ?), chute, compréhensible seul, \
sur 10 chacun, et la note globale sur 100. Sois exigeant : sans vraie chute, pas plus de 45 ; un clip qu'on \
partagerait à un pote, plus de 80.

Choisis la phrase de début et de fin (numéros) : commence juste avant la mise en place (pas de blabla avant), \
finis juste après la chute (rien d'inutile après). Le clip doit durer {DUR} secondes.

Dans une réaction, la transcription mélange la voix du streamer (commentaires courts, rires, « wesh », « non mais… ») \
et les répliques de ce qu'il regarde (film, vidéo, jeu) : ne les confonds pas.

Le titre : un résumé factuel de ce qui se passe (max 60 caractères), une phrase simple avec des espaces et des \
articles, sans « Quand… », sans emoji, sans guillemets. La description : une phrase accrocheuse pour la publication. \
Hashtags : 3 à 5, sans espace, avec #. Réponds uniquement en JSON."""

SCHEMA = {
    "type": "object",
    "properties": {  # dans cet ordre : l'IA résume et cherche la chute AVANT de noter
        "resume": {"type": "string"},
        "chute": {"type": "string"},
        "hook": {"type": "integer", "minimum": 0, "maximum": 10},
        "payoff": {"type": "integer", "minimum": 0, "maximum": 10},
        "standalone": {"type": "integer", "minimum": 0, "maximum": 10},
        "score": {"type": "integer", "minimum": 0, "maximum": 100},
        "start": {"type": "integer", "minimum": 0},
        "end": {"type": "integer", "minimum": 0},
        "title": {"type": "string"},
        "description": {"type": "string"},
        "hashtags": {"type": "array", "items": {"type": "string"}, "maxItems": 6},
    },
    "required": ["resume", "chute", "hook", "payoff", "standalone", "score", "start", "end", "title", "description",
                 "hashtags"],
}

TITLE_FR = """Tu nommes des clips vidéo (TikTok / Shorts) tirés d'une longue vidéo francophone. On te donne la \
transcription exacte du clip et, s'il y en a, des messages du chat pendant ce moment (ils montrent à quoi les \
spectateurs réagissent).

1. « faits » : en une ou deux phrases, ce qui se passe vraiment, seulement d'après le texte. Dans une réaction, la \
transcription mélange la voix du streamer (commentaires courts, rires, « wesh », « non mais… ») et les répliques de \
ce qu'il regarde (film, vidéo, jeu) : un personnage qui parle n'est pas le streamer.
2. « titre » : le nom du clip, qui dit en un coup d'œil ce qui se passe. Max 60 caractères, une phrase simple et \
bien écrite (avec articles et espaces), dans la langue du clip. Le sujet concret d'abord : qui, quoi.
   Bons exemples : « Le streamer explose de rire devant la scène du don de sperme », « Ted et John cambriolent la \
   maison de Tom Brady », « Le chat se moque de la coiffure du streamer ».
   Interdit : « Quand… », « POV », « Incroyable », « Ce moment où… », emoji, hashtag, guillemets, point final, et tout \
   fait, nom ou chiffre absent du texte. En cas de doute, reste général plutôt que d'inventer.
Réponds uniquement en JSON."""

TITLE_SCHEMA = {
    "type": "object",
    "properties": {"faits": {"type": "string"}, "titre": {"type": "string"}},
    "required": ["faits", "titre"],
}


class ClipJudge:
    """Le modèle local, démarré une fois pour toute l'analyse puis arrêté (la carte graphique est libérée)."""

    def __init__(self, cancel: threading.Event, progress: Callable[[int, int], None] | None = None) -> None:
        self.llm = LocalLLM(progress)
        self.llm.cancel = cancel
        self.cancel = cancel

    def ask(self, excerpt: str, context: str, min_len: float = 20, max_len: float = 75) -> dict:
        user = (f"Contexte de la vidéo : {context}\n\n" if context else "") + f"Extrait :\n{excerpt}"
        system = SYSTEM_FR.replace("{DUR}", f"{int(min_len)} à {int(max_len)}")
        return self._chat(system, user, SCHEMA, 600)

    def title(self, text: str, context: str, chat: list[str]) -> dict:
        user = (f"Contexte de la vidéo : {context}\n\n" if context else "") + f"Transcription du clip :\n{text}"
        if chat:
            user += "\n\nMessages du chat pendant le clip :\n" + "\n".join(f"- {m}" for m in chat[:25])
        return self._chat(TITLE_FR, user, TITLE_SCHEMA, 250)

    def _chat(self, system: str, user: str, schema: dict, max_tokens: int) -> dict:
        if self.llm.proc is None or self.llm.proc.poll() is not None:
            self.llm._start()
        payload = {
            "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
            "temperature": 0.2, "max_tokens": max_tokens, "repeat_penalty": 1.05,
            "response_format": {"type": "json_schema", "json_schema": {"name": "clip", "strict": True,
                                                                       "schema": schema}}}
        r = httpx.post(f"http://127.0.0.1:{self.llm.port}/v1/chat/completions", json=payload,
                       timeout=httpx.Timeout(30, read=120))
        r.raise_for_status()
        return json.loads(r.json()["choices"][0]["message"]["content"])

    def stop(self) -> None:
        self.llm.stop()


def _clean_tags(tags: list) -> list[str]:
    out = []
    # l'IA colle parfois plusieurs hashtags dans un seul (« #TikTok#Meme ») : on les sépare
    words = [w for t in tags or [] for w in re.split(r"(?=#)", str(t).replace(" ", ""))]
    for t in words:
        t = re.sub(r"[^\w]", "", t)
        if not t:
            continue
        t = "#" + t
        if t.lower() not in (x.lower() for x in out):
            out.append(t)
    return out[:5]


def tidy_title(title: str) -> str:
    """Titre propre pour un nom de fichier : sans guillemets ni point final ; un titre collé par l'IA
    (« TomBradyDemandeSignature ») retrouve ses espaces."""
    t = re.sub(r"[*_`#]", "", str(title or "")).strip().strip('"«»“”').strip()
    if " " not in t and len(t) > 8:
        t = re.sub(r"(?<=[a-zà-ÿ])(?=[A-ZÀ-Þ0-9])|(?<=[0-9])(?=[A-Za-zÀ-ÿ])", " ", t)
    return t.rstrip(" .")[:90]


def fallback_meta(sents: list[M.Sentence], c: M.Candidate) -> dict:
    first = sents[c.first].text.strip()
    title = (first[:67] + "…") if len(first) > 70 else first
    return {"title": title, "description": "", "hashtags": ["#clip", "#fyp", "#pourtoi"], "why": ""}


def judge(sents: list[M.Sentence], cands: list[M.Candidate], context: str, cancel: threading.Event,
          progress: Callable[[float, str], None], model_progress: Callable[[int, int], None] | None = None,
          use_ai: bool = True, min_len: float = 20, max_len: float = 75) -> tuple[list[dict], str | None]:
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
                    ai = judge_.ask(M.excerpt(sents, c), context, min_len, max_len)
                except Canceled:
                    raise
                except Exception as e:  # le modèle ne démarre pas / réponse illisible : on continue sans lui
                    log.warning("Local model could not judge candidate %d: %s", k, e)
                    if judge_.llm.proc is None or judge_.llm.proc.poll() is not None:
                        note = "L'IA de texte n'a pas pu démarrer : moments choisis d'après le son et le chat."
                        judge_ = None
            moment = _merge(sents, c, ai, min_len)
            out.append(moment)
    finally:
        if judge_ is not None:
            judge_.stop()
    return out, note


def _merge(sents: list[M.Sentence], c: M.Candidate, ai: dict | None, min_len: float = 15.0) -> dict:
    first, last = c.first, c.last
    pre = min(1.0, c.prescore / 0.6)  # pré-score des signaux ramené vers 0..1
    if ai:
        n = c.last - c.first
        a = max(0, min(n, int(ai.get("start", 0))))
        b = max(a, min(n, int(ai.get("end", n))))
        cand_first, cand_last = c.first + a, c.first + b
        # on n'accepte un resserrage que s'il garde la durée demandée (sinon l'extrait entier)
        if sents[cand_last].end - sents[cand_first].start >= max(15.0, min_len):
            first, last = cand_first, cand_last
        ai_score = max(0, min(100, int(ai.get("score", 0)))) / 100
        score = 0.7 * ai_score + 0.3 * pre
        meta = {"title": tidy_title(ai.get("title")),
                "description": str(ai.get("description") or "").strip()[:300],
                "hashtags": _clean_tags(ai.get("hashtags")),
                "why": " · ".join(str(ai.get(k) or "").strip() for k in ("resume", "chute") if ai.get(k))[:300],
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


def pick(moments: list[dict], count: int, min_score: int = 0, keep_at_least: int = 3) -> list[dict]:
    """Les ``count`` meilleurs moments sans chevauchement, du meilleur au moins bon. Les moments notés sous
    ``min_score`` sont écartés (on en garde quand même ``keep_at_least``) : pas de clip pour remplir."""
    class _C:
        def __init__(self, m: dict) -> None:
            self.m, self.start, self.end = m, m["start"], m["end"]

        @property
        def duration(self) -> float:
            return self.end - self.start

    chosen = M.non_overlapping([_C(m) for m in moments], count, 0.2, key=lambda c: c.m["score"])
    ranked = sorted((c.m for c in chosen), key=lambda m: -m["score"])
    good = [m for m in ranked if m["score"] >= min_score]
    return good if len(good) >= keep_at_least else ranked[:max(len(good), keep_at_least)]


def retitle(sents: list[M.Sentence], moments: list[dict], context: str, messages: list[dict],
            cancel: threading.Event, progress: Callable[[float, str], None]) -> None:
    """Un titre soigné pour chaque clip retenu, écrit sur son texte exact (et le chat de ce moment)."""
    judge_ = ClipJudge(cancel)
    try:
        for k, m in enumerate(moments):
            if cancel.is_set():
                raise Canceled()
            progress(k / max(1, len(moments)), f"{k + 1}/{len(moments)}")
            text = " ".join(s.text.strip() for s in sents if s.end > m["start"] and s.start < m["end"])
            chat = [f"{c.get('user', '')}: {c.get('text', '')}" for c in messages
                    if m["start"] <= float(c.get("t", -1)) <= m["end"] + 10][:25]
            try:
                title = tidy_title(judge_.title(text, context, chat).get("titre"))
            except Canceled:
                raise
            except Exception as e:  # on garde le titre de la première passe
                log.warning("Title pass failed: %s", e)
                if judge_.llm.proc is None or judge_.llm.proc.poll() is not None:
                    return
                continue
            if len(title) >= 8:
                m["title"] = title
    finally:
        judge_.stop()
