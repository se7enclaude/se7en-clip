"""se7en Clip : d'une longue vidéo à des clips verticaux prêts pour TikTok / Shorts / Reels.

1. ``moments``  : phrases, signaux (son, rires, chat) et moments candidats ;
2. ``scoring``  : l'IA de texte locale note chaque candidat et écrit titre / hashtags ;
3. ``reframe``  : mise en page 9:16 (cam + jeu, visage suivi, ou vidéo entière sur fond flouté) ;
4. ``captions`` : sous-titres mot par mot ;
5. ``render``   : un passage FFmpeg par clip (recadrage + sous-titres + son normalisé, encodeur GPU) ;
6. ``pipeline`` : enchaîne tout dans une tâche, avec la progression.
"""
