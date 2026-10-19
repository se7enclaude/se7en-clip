# se7en — Desktop app UI kit

Click-through of the se7en desktop app (1280×800 window, scaled to fit).

Flow: **Launch animation** (click to skip; click the wordmark to replay) → **01 Télécharger** (paste link, cursor-reactive pixel field) → **Analyse** (pixel-resolve preview + live log) → **02 File** (live progress) → **03 Upscale** (import or drop your own image, before/after, confirm, animated resolve) → **Réglages** (gear).

Files: `Splash.jsx` (in-app launch animation), `splash.html` + `launch/` (the same animation as a standalone, timeline-editable and video-exportable piece), `Chrome.jsx` (Wordmark, TopBar, PageHead, Ticks, PixelField), `HomeScreen.jsx`, `AnalyzeScreen.jsx`, `QueueScreen.jsx`, `UpscaleScreen.jsx`, `SettingsScreen.jsx`, `App.jsx`.

There was no existing product to copy, so these screens are the reference design. Media previews are seeded abstract placeholders from `PixelImage`. Replace them with real media.
