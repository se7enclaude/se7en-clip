# se7en Clip

Clip farm TikTok / Shorts / Reels, façon Opus Clip, **100 % local** : on donne une longue vidéo (fichier ou lien :
rediff Twitch / Kick / YouTube, podcast…) et se7en Clip trouve tout seul les meilleurs moments, les met en 9:16
(cam en haut + jeu en bas, ou visage suivi, ou plein cadre) et ajoute des sous-titres mot par mot.

Basé sur le code de se7en Download (même architecture, même design system recoloré en cyan). Les moteurs et
modèles déjà téléchargés par se7en Download (`%LOCALAPPDATA%\MediaLab`) sont réutilisés.

## Comment les moments sont choisis (`backend/medialab/clip/`)
1. `pipeline.py` — téléchargement (yt-dlp) + chat de la rediff si disponible, son 16 kHz, transcription
   mot par mot (whisper.cpp large-v3-turbo, VAD Silero).
2. `moments.py` — phrases, signaux par seconde (énergie du son, réactions « mdr / wesh / quoi ?! », débit,
   pics du chat), candidats de 20 à 75 s calés sur les phrases, pré-score.
3. `scoring.py` — l'IA de texte locale (llama.cpp, Ministral 3 8B) note chaque candidat (accroche, chute,
   compréhensible seul), resserre début/fin et écrit titre, description, hashtags.
4. `reframe.py` + `tracking.py` — détection de la facecam ou suivi du visage (YuNet sur la carte graphique),
   trajectoire de caméra amortie avec zone morte et coupes franches.
5. `captions.py` + `render.py` — sous-titres mot par mot (ASS), un seul passage FFmpeg par clip (NVENC).

Interface : `frontend/src/pages/ClipsPage.tsx` (+ `styles/clip.css`). API : `backend/medialab/clip/api.py`.

## Commandes
```bash
cd backend && .venv/Scripts/python -m pytest tests/test_clip.py
```
```bash
cd backend && .venv/Scripts/python -m medialab --dev
```
```bash
cd frontend && npm run build
```
Installateur : `packaging\build.ps1` (PyInstaller + composants + Inno Setup), publication : `packaging\publish.ps1`.
