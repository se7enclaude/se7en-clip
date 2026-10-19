"""Tests de la logique de se7en Clip (sans GPU, sans modèle, sans vidéo)."""
import numpy as np

from medialab.clip import captions, chat, moments as M, reframe, scoring, tracking


def _words(text: str, start: float = 0.0, step: float = 0.3) -> list[dict]:
    out, t = [], start
    for w in text.split():
        out.append({"text": w, "start": round(t, 3), "end": round(t + step * 0.8, 3), "p": 0.9})
        t += step
    return out


def test_sentences_split_on_punctuation_and_silence():
    words = _words("Salut tout le monde. Aujourd'hui on teste") + _words("un truc incroyable !", start=10)
    s = M.sentences(words)
    assert [x.text for x in s] == ["Salut tout le monde.", "Aujourd'hui on teste", "un truc incroyable !"]
    assert s[2].start == 10


def test_long_sentence_is_cut_near_max_len():
    words = _words(" ".join(["mot,"] * 120), step=0.4)  # 48 s sans point
    s = M.sentences(words, max_len=18)
    assert len(s) >= 2
    assert all(x.duration <= 19.5 for x in s)


def test_signals_peak_where_it_is_loud_and_reactive():
    dur = 600
    loud = np.full(dur, -30.0, dtype=np.float32)
    loud[300:320] = -8.0  # cris
    words = _words("blabla " * 900, step=0.6)
    words += [{"text": "MDR !", "start": 305.0, "end": 305.5}, {"text": "wesh", "start": 306.0, "end": 306.3}]
    sig = M.signals(dur, loud, sorted(words, key=lambda w: w["start"]), chat_times=[310 + i * 0.1 for i in range(80)])
    assert sig["has_chat"]
    peak_at = int(np.argmax(sig["interest"]))
    assert 290 <= peak_at <= 325


def test_candidates_respect_durations_and_do_not_overlap():
    rng = np.random.default_rng(1)
    words = []
    t = 0.0
    for k in range(400):
        words += _words(f"phrase numéro {k} avec des mots.", start=t)
        t += 3.0 + rng.random()
    dur = t + 5
    loud = rng.normal(-25, 2, int(dur)).astype(np.float32)
    loud[600:640] = -5
    sig = M.signals(dur, loud, words)
    sents = M.sentences(words)
    cands = M.candidates(sents, sig, 20, 75, keep=12)
    assert 1 <= len(cands) <= 12
    assert all(20 <= c.duration <= 75 for c in cands)
    for a in cands:
        for b in cands:
            if a is not b:
                assert M.overlap(a, b) <= 0.25
    best = max(cands, key=lambda c: c.prescore)
    assert best.start <= 640 and best.end >= 600  # le passage fort est trouvé


def test_merge_uses_ai_bounds_and_titles():
    words = []
    for k in range(10):
        words += _words(f"Phrase {k} un deux trois quatre cinq six sept.", start=k * 5.0)
    sents = M.sentences(words)
    c = M.Candidate(0, 9, sents[0].start, sents[9].end, 0.4)
    ai = {"score": 90, "hook": 9, "payoff": 8, "standalone": 9, "start": 2, "end": 7, "title": "« Le moment fou »",
          "description": "d", "hashtags": ["fyp", "#Drôle", "#drôle", "mdr lol"], "why": "x"}
    m = scoring._merge(sents, c, ai)
    assert abs(m["start"] - (sents[2].start - 0.15)) < 1e-6
    assert m["title"] == "Le moment fou"
    assert m["hashtags"] == ["#fyp", "#Drôle", "#mdrlol"]
    assert m["score"] > 70
    no_ai = scoring._merge(sents, c, None)
    assert no_ai["title"].startswith("Phrase 0")


def test_pick_keeps_best_without_overlap():
    ms = [{"start": 0, "end": 40, "score": 50}, {"start": 10, "end": 50, "score": 90}, {"start": 100, "end": 130, "score": 70}]
    best = scoring.pick(ms, 5)
    assert [m["score"] for m in best] == [90, 70]


def test_caption_chunks_are_short_and_relative_to_clip():
    words = _words("Bon alors là on va voir si ça marche vraiment bien, regarde ça !", start=100)
    cues = captions.chunks(words, 100.0, 120.0)
    assert cues[0]["start"] >= 0 and cues[0]["start"] < 0.5
    assert all(len(c["words"]) <= 3 for c in cues)
    assert all(len(c["text"]) <= 22 for c in cues)
    assert all(a["end"] <= b["start"] + 1e-6 for a, b in zip(cues, cues[1:]))


def test_tracking_path_is_smooth_and_cuts_on_jumps():
    fps = 30
    samples = [(t / 6, 0.3 + 0.02 * np.sin(t / 6)) for t in range(0, 60)]  # ~10 s, petit balancement
    samples += [(10 + t / 6, 0.75) for t in range(0, 60)]  # changement de plan à 10 s
    xs = tracking.path(samples, fps, 20.0, 0.316)
    assert len(xs) == 600
    steps = np.abs(np.diff(xs[:290]))
    assert steps.max() < 0.01  # pas de tremblement avant la coupe
    assert abs(xs[310] - 0.75) < 0.05  # coupe nette sur la nouvelle personne
    lo, hi = 0.316 / 2, 1 - 0.316 / 2
    assert min(xs) >= lo - 1e-9 and max(xs) <= hi + 1e-9


def test_tracking_without_face_holds_then_recenters():
    samples = [(0.0, 0.2), (1.0, 0.2)] + [(1 + k / 6, None) for k in range(1, 60)]
    filled = tracking.fill(samples, hold=2.0)
    assert filled[3][1] == 0.2
    assert abs(filled[-1][1] - 0.5) < 0.05


def test_sendcmd_lines_only_when_moving():
    txt = tracking.sendcmd([0.5] * 30 + [0.6] * 30, 30, 1920, 606)
    assert txt.count("crop@track x") == 2


def test_filtergraphs():
    g, seam = reframe.filtergraph(reframe.Layout("stream", (0.0, 0.0, 0.25, 0.25)), 1920, 1080, True, False)
    assert "vstack" in g and g.endswith("ass=subs.ass[v]") and 30 < seam < 50
    g, _ = reframe.filtergraph(reframe.Layout("face"), 1920, 1080, False, True)
    assert "sendcmd=f=track.cmd" in g and "crop@track=608:1080" in g
    g, _ = reframe.filtergraph(reframe.Layout("fit"), 1920, 1080, False, False)
    assert "boxblur" in g and g.endswith("[v]")





def test_auto_count_follows_duration():
    from medialab.clip.pipeline import auto_count
    assert auto_count(10 * 60) == 3
    assert auto_count(60 * 60) == 15
    assert auto_count(4 * 3600) == 30



def test_cam_box_snaps_to_corner():
    x, y, w, h = reframe.cam_box(0.12, 0.85, 0.06, 0.11, 16 / 9)
    assert x == 0.0 and abs(y + h - 1.0) < 1e-6


def test_twitch_video_id():
    assert chat.twitch_video_id("https://www.twitch.tv/videos/2905130118") == "2905130118"
    assert chat.twitch_video_id("https://www.twitch.tv/zerator/video/123?t=1h") == "123"
    assert chat.twitch_video_id("https://www.youtube.com/watch?v=x") is None


def test_youtube_live_chat_parsing(tmp_path):
    f = tmp_path / "chat.live_chat.json"
    f.write_text('{"replayChatItemAction": {"videoOffsetTimeMsec": "12500", "actions": [{"addChatItemAction": '
                 '{"item": {"liveChatTextMessageRenderer": {"message": {"runs": [{"text": "trop fort "}, '
                 '{"emoji": {"shortcuts": [":fire:"]}}]}, "authorName": {"simpleText": "@Bob"}}}}}]}}\n', "utf-8")
    msgs = chat._youtube_messages(f)
    assert msgs == [{"t": 12.5, "user": "Bob", "color": chat.color_for("Bob"), "text": "trop fort :fire:"}]


def test_chat_ass_scrolls_and_escapes():
    msgs = [{"t": 95.0, "user": "Avant", "color": "#FF0000", "text": "déjà là"},
            {"t": 101.0, "user": "Alice", "color": "#00FF00", "text": "mdr {lol}"},
            {"t": 103.5, "user": "Bob", "color": "#0000FF", "text": "x" * 200}]
    a = chat.ass(msgs, 100.0, 110.0, 1080, 1180)
    events = [ln for ln in a.splitlines() if ln.startswith("Dialogue") and ",Chat," in ln]
    assert len(events) == 3  # état initial + 2 nouveaux messages
    assert events[0].startswith("Dialogue: 0,0:00:00.00,0:00:01.00,Chat")
    assert "{" not in events[1].split("Alice", 1)[1].replace("{\\b0\\c&HF1EFEF&}", "")
    assert "&H00FF00&" in events[1] and "&HFF0000&" in events[2]  # couleurs en BGR
    assert "…" in events[2]  # message trop long raccourci
    assert "CHAT DU STREAM" in a


def test_chat_filtergraph():
    g, seam = reframe.filtergraph(reframe.Layout("chat", (0.0, 0.7, 0.25, 0.3)), 1920, 1080, True, False, 30, 42.5)
    assert "color=c=0x18181B" in g and "d=42.500" in g and "ass=chat.ass" in g and g.endswith("ass=subs.ass[v]")
    assert 30 < seam < 50
    assert reframe.Layout.from_dict({"mode": "discord", "cam": [0, 0, 0.2, 0.2]}).mode == "stream"
