"""What changed in each version, shown once after an update ("se7en has been updated")."""
from __future__ import annotations

CHANGES: dict[str, dict[str, list[str]]] = {
    "1.5.0": {
        "fr": ["Nouveau : « Analyser tout le site ». La page est ouverte dans un vrai navigateur (sans compte ni "
               "cookie) : les vidéos chargées par JavaScript, les lecteurs dans des cadres et les flux HLS sont "
               "trouvés.",
               "L'analyse suit aussi les sous-pages et les dossiers du même site, avec une vraie progression et un "
               "bouton Annuler. Les vidéos sont groupées par page.",
               "Chaque vidéo est téléchargée avec la bonne page d'origine (Referer). Les flux protégés (DRM) sont "
               "signalés et ne sont pas téléchargés."],
        "en": ["New: \"Scan the whole site\". The page is opened in a real browser (no account, no cookie): videos "
               "loaded by JavaScript, players inside frames and HLS streams are found.",
               "The scan also follows the sub-pages and folders of the same site, with real progress and a Cancel "
               "button. Videos are grouped by page.",
               "Each video is downloaded with the right source page (Referer). Protected (DRM) streams are flagged "
               "and not downloaded."],
    },
    "1.4.0": {
        "fr": ["Nouveau : « Toutes les vidéos de la page ». se7en trouve chaque vidéo d'une page (lecteurs, "
               "fichiers, liens, lecteurs YouTube / Vimeo intégrés…) et les télécharge en une fois.",
               "Une page qu'aucun moteur ne reconnaît est maintenant parcourue automatiquement."],
        "en": ["New: \"All the videos on the page\". se7en finds every video of a page (players, files, links, "
               "embedded YouTube / Vimeo players…) and downloads them at once.",
               "A page no engine recognizes is now scanned automatically."],
    },
    "1.3.2": {
        "fr": ["Mises à jour plus sûres : si se7en est rouvert pendant l'installation, il est fermé puis relancé "
               "au lieu de bloquer la mise à jour (ce qui pouvait abîmer l'installation)."],
        "en": ["Safer updates: if se7en is reopened during the install, it is closed and reopened afterwards "
               "instead of blocking the update (which could damage the installation)."],
    },
    "1.3.1": {
        "fr": ["Nouvelle animation de lancement, en verre, sans son.",
               "Le champ où l'on colle le lien est corrigé : un seul cadre, le lien reste sur une ligne."],
        "en": ["New glass launch animation, without sound.",
               "The link field is fixed: a single frame, and the link stays on one line."],
    },
    "1.3.0": {
        "fr": ["Nouveau design « liquid glass » rouge : verre dépoli, grandes typos, nouvel écran d'accueil.",
               "Sur l'accueil, choisissez Vidéo, Audio ou Image avant de coller votre lien.",
               "Le thème sombre reste disponible dans Réglages › Général › Thème."],
        "en": ["New red \"liquid glass\" design: frosted glass, big type, a new home screen.",
               "On the home screen, pick Video, Audio or Image before pasting your link.",
               "The dark theme is still available in Settings › General › Theme."],
    },
    "1.2.2": {
        "fr": ["TikTok fonctionne à nouveau : les vidéos se téléchargent normalement."],
        "en": ["TikTok works again: videos download normally."],
    },
    "1.2.1": {
        "fr": ["Les mises à jour automatiques fonctionnent à nouveau : les prochaines versions s'installeront "
               "toutes seules."],
        "en": ["Automatic updates work again: the next versions will install themselves."],
    },
    "1.2.0": {
        "fr": [
            "Nouvel onglet Sous-titres : transcription automatique, détection de la langue, correction du français "
            "et traduction naturelle dans plus de 100 langues.",
            "Éditeur complet : texte, minutages, frise, fusion, découpe, recherche / remplacement, annuler / rétablir.",
            "9 styles prêts à l'emploi (Netflix, YouTube, TikTok, Cinématique…) et des animations (karaoké, "
            "mot par mot, machine à écrire…).",
            "Export SRT, VTT, ASS, TXT ou vidéo avec les sous-titres incrustés, sans perte de qualité.",
            "Tout fonctionne sur votre PC ; une clé Claude optionnelle (Réglages) donne une qualité maximale.",
            "Une fenêtre prévient désormais au lancement quand une mise à jour est disponible.",
        ],
        "en": [
            "New Subtitles tab: automatic transcription, language detection, text correction and natural "
            "translation into 100+ languages.",
            "Full editor: text, timings, timeline, merge, split, find / replace, undo / redo.",
            "9 ready-made styles (Netflix, YouTube, TikTok, Cinematic…) and animations (karaoke, word by word, "
            "typewriter…).",
            "Export to SRT, VTT, ASS, TXT or a video with burned-in subtitles, without quality loss.",
            "Everything runs on your PC; an optional Claude key (Settings) gives the best quality.",
            "A window now tells you at launch when an update is available.",
        ],
    },
}


def since(previous: str, current: str) -> dict[str, list[str]]:
    """Everything that changed after ``previous`` up to ``current``, newest first ("older": since before 1.2)."""
    from .updater import is_newer, parse_version
    out: dict[str, list[str]] = {}
    for v in sorted(CHANGES, key=parse_version, reverse=True):
        if is_newer(v, current):
            continue
        if previous != "older" and not is_newer(v, previous):
            continue
        for lang, items in CHANGES[v].items():
            out.setdefault(lang, []).extend(items)
    return out
