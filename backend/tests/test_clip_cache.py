"""Caches de se7en Clip : transcription par vidéo, chat raté jamais gardé, source supprimée avec le projet."""
import os

from medialab.clip import chat
from medialab.clip import pipeline as PL
from medialab.clip import project as P


def test_transcript_cached_by_source_fingerprint(tmp_path):
    src = tmp_path / "live.mp4"
    src.write_bytes(b"x" * 100)
    key = PL.source_key(src, None)
    assert PL.source_key(src, None) == key
    assert PL.source_key(src, "fr") != key  # langue forcée : autre transcription
    assert PL.load_transcript(key) is None
    PL.save_transcript(key, {"lang": "fr", "words": [{"w": "salut", "s": 0.0, "e": 0.4}]})
    assert PL.load_transcript(key)["words"][0]["w"] == "salut"
    copy = tmp_path / "autre dossier"
    copy.mkdir()
    same = copy / "live.mp4"  # la même vidéo (même nom, taille, date) ailleurs : réutilisée
    same.write_bytes(b"x" * 100)
    os.utime(same, ns=(src.stat().st_atime_ns, src.stat().st_mtime_ns))
    assert PL.source_key(same, None) == key
    src.write_bytes(b"y" * 101)  # vidéo modifiée : nouvelle empreinte
    assert PL.source_key(src, None) != key
    (PL._transcripts() / f"{key}.json").write_text("", "utf-8")  # fichier abîmé : pas de cache
    assert PL.load_transcript(key) is None


def test_steps_give_transcription_most_of_the_bar():
    spans = {n: hi - lo for n, lo, hi in PL.STEPS}
    assert spans["transcribe"] == max(spans.values()) and spans["transcribe"] > 0.6
    assert PL.STEPS[0][1] == 0.0 and PL.STEPS[-1][2] == 1.0
    assert all(a[2] == b[1] for a, b in zip(PL.STEPS, PL.STEPS[1:]))


def test_failed_chat_is_not_cached(monkeypatch, tmp_path):
    import threading

    def boom(*a, **k):
        raise RuntimeError("Twitch indisponible")

    monkeypatch.setattr(chat, "fetch_twitch", boom)
    url = "https://www.twitch.tv/videos/123456789"
    assert chat.fetch(url, 60, tmp_path, threading.Event()) == []
    assert not (tmp_path / "chat.json").exists()  # réessayé à la prochaine analyse
    monkeypatch.setattr(chat, "fetch_twitch", lambda *a: [{"t": 2.0, "user": "a", "color": "#fff", "text": "gg"}])
    assert len(chat.fetch(url, 60, tmp_path, threading.Event())) == 1
    assert (tmp_path / "chat.json").exists()


def test_delete_removes_downloaded_source_only():
    picked = P.root().parent / "ma video.mp4"
    picked.write_bytes(b"x")
    own = P.create(str(picked))
    P.delete(own["id"])
    assert picked.exists()  # fichier choisi par l'utilisateur : jamais supprimé
    picked.unlink()

    (P.root() / "sources").mkdir(exist_ok=True)
    dl = P.root() / "sources" / "stream.mp4"
    dl.write_bytes(b"x")
    a = P.create("https://www.twitch.tv/videos/1")
    b = P.create("https://www.twitch.tv/videos/1")
    for p in (a, b):
        p["source"]["path"] = str(dl)
        P.save(p)
    P.delete(a["id"])
    assert dl.exists()  # encore utilisée par l'autre projet
    P.delete(b["id"])
    assert not dl.exists()
