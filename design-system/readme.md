# se7en — Design System

## Product context
**se7en** (tagline: *Download Everything & Upscale*) is a desktop software product that lets users download any video or photo from a link (paste a URL → pick format/quality → download), with an optional AI **upscale** that raises the resolution/quality of photos and videos (2× / 4×).

One surface is represented: the **desktop app** (`ui_kits/desktop/`). No website, mobile app, codebase, Figma file, logo or font files were supplied.

### Sources
- Brief (FR): "Il s'agit d'un logiciel qui permettra aux utilisateurs de pouvoir télécharger n'importe quelle vidéo ou photo depuis le lien. De plus, il y aura une option qui permet d'upscale la qualité des photos et vidéos."
- Three **mood-reference** images in `uploads/` (third-party concept shots, not the product):
  - `e263c41b…jpg` — pale steel-grey car landing page: hairline oversized display type, 62° diagonal slash panel, "01 / 03" index, thin UI.
  - `2709d243…jpg` — near-black hero with signal-red disc behind a red statue, heavy caps "DESIGN", circle-outline arrow button, "01 —— 03" progress.
  - `42490c88…jpg` — frosted glass capsules over full-bleed photography, pill nav, circular icon rail, large rounded window.
- **v2 direction (current):** the client asked for something far more premium and experiential, plus a launch animation reading **se7en**. The system is now cinematic near-black + a single signal red (the "7"), heavy Syne display type, near-square geometry, HUD corner ticks, faint scanlines, and the **pixel-resolve** motif (coarse pixel blocks → crisp) that makes upscaling visible everywhere.

## Index
- `styles.css` — entry point (imports only) → `tokens/` (`fonts`, `icons`, `colors`, `typography`, `spacing`, `effects`, `base`)
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/` — React primitives (see below), one `*.card.html` per folder
- `ui_kits/desktop/` — interactive desktop app recreation
- `thumbnail.html` — homepage tile · `SKILL.md` — agent skill entry
- `uploads/` — original mood references

## Components
- **core/** — `Button`, `IconButton`, `Badge`, `Icon`
- **forms/** — `UrlInput`, `Select`, `Segmented`, `Switch`, `Checkbox`
- **feedback/** — `ProgressBar`, `StepIndex`, `Toast`, `Dialog`, `Tooltip`
- **media/** — `PixelImage`, `MediaFrame`, `DownloadItem`, `CompareSlider`, `GlassPanel`

No source defined a component inventory, so this is a from-scratch set sized to the product. Product-specific additions: `PixelImage` (pixel-resolve signature), `UrlInput` (hero link field), `DownloadItem` (queue row), `CompareSlider` (before/after upscale), `StepIndex` ("01 —— 03" motif from references), `Icon` (wrapper over the Lucide font).

## CONTENT FUNDAMENTALS
- **Language:** French UI copy. Brand name **se7en**, always lowercase with the 7 in red. The English tagline "Download everything — Upscale anything" is used only in the launch animation.
- **Address:** *vous*, with imperative verbs on actions: "Coller un lien", "Analyser", "Télécharger", "Lancer". The product never says "je" or "nous".
- **Tone:** terse, cinematic, precise. Headlines are two short sentences, the second in grey: "Un lien. / Tout le reste." Body copy is one plain sentence.
- **Section indices:** every section has a mono number: `01 — Coller un lien`, `02 — File d'attente`, `03 — Amélioration IA`. The same numbers prefix the nav tabs.
- **Casing:** eyebrows, labels and buttons are MONO UPPERCASE (tracked +0.14em). Headlines and body use sentence case. Statuses are single words: En attente, Téléchargement, Upscale, Terminé, Échec.
- **Numbers:** always in mono with real units: `2160p`, `3840×2160`, `212 MB`, `18.2 MB/s`. Use × for factors (`4×`). Logs use `›` prompts and `ok`.
- **Emoji:** never.

## VISUAL FOUNDATIONS
- **Theme:** cinematic near-black (`--ink-0` #050505). A light theme exists via `[data-theme="light"]` for print and marketing.
- **Color:** ink and warm fog, plus **one** accent, signal red `--red-500` #F22B2B. Red is reserved for the 7 in the wordmark, the primary action, the active tab underline (with glow), section indices, selection and the scan line. Semantic green, amber and blue appear only in status badges and the "GPU prêt" dot.
- **Type:** **Syne 800** for display (60–160px, −0.045em, lh .9). **Geist** for UI and body. **Geist Mono** for labels, buttons, specs, logs and URLs. Signature headline: a white line followed by an echo line in `--text-disabled`.
- **Signature motif — pixel-resolve:** media starts as coarse pixel blocks with dark LED gaps and resolves to crisp (`PixelImage animateFrom`). It is used in the launch animation, the analyse preview, the upscale before/after and the upscale progress.
- **Backgrounds:** flat black with a faint red radial glow from the top-right. A full-window scanline overlay sits at 2.8% white. The home screen has a cursor-reactive **pixel field**: a 16px dot grid that swells and turns red near the pointer. No photos are baked into the chrome, and there are no gradients beyond these glows.
- **HUD language:** 14–16px corner ticks frame media and the splash. Mono read-outs sit in the corners (resolution, status, version), with hairline progress lines.
- **Corners:** near-square. Controls and buttons 4px, badges 2px, cards 6px, panels and media 10px, window 12px. Pill shapes are used only for the switch track.
- **Cards:** `GlassPanel` solid `--surface-1` with a 1px border at 12% white, an inset top highlight and a deep black shadow. It becomes frosted (`rgba(11,11,12,.66)`, blur 20) only over media. The selected row gets a red 1px border, a red-900 fill and a 3px inset red bar.
- **Borders:** hairlines only (7% / 12% / 26% white).
- **Shadows:** deep soft black. Red glow (`--shadow-accent`, `--glow-accent`) only on primary hover and the active tab bar.
- **Transparency & blur:** top bar (black 70% + blur), menus, toasts, dialog scrim. Nothing else.
- **Hover:** one ink step lighter. Primary red → `--red-400` + red glow. Outline borders brighten. **Press:** scale .98. **Focus:** 4px red ring at 45%.
- **Motion:** expo ease-out cubic-bezier(.16,1,.3,1). Content *rises* 14px + fades in on enter, staggered 60–90ms. Tab underline scales from the left. The marquee of supported sources scrolls at 40s per loop. No bounces.
- **Launch animation (4.5s):** red cursor block blinks (0.5s), then **se7en** resolves through 9 pixel steps (56px blocks → crisp, 144p → 4K read-out) under a sweeping red scan line. Red letters turn white, and the 7 stays red. A white light sweep passes over the word, the tagline types in, and the whole frame scales 7% and fades into the app. Click to skip.
- **Layout:** 64px top bar (wordmark, numbered tabs, status, settings), content padding 48–64px, and page heads with a red mono eyebrow over a 60px Syne title.

## ICONOGRAPHY
- **Set:** [Lucide](https://lucide.dev) via the `lucide-static@0.460.0` icon font (`tokens/icons.css`). Usage: `<i class="icon-download"></i>` or `<Icon name="download"/>`. **Substitution:** no icon set was provided.
- Outline only, `currentColor`, 14–20px. Inside square icon buttons, glyphs are 40% of the button size.
- Key glyphs: `download`, `scan-line`, `sparkles` (upscale), `image-up`, `arrow-left`, `chevrons-left-right`, `settings`.
- Unicode is used as UI glyphs only for `›` (log prompt), `⌘ ↵` (keyboard hints), `×` and `—`. No emoji and no platform logos: sources are shown as mono domains.
- **Logo:** no logo file was supplied. The wordmark is typeset: **se7en** in Syne 800 at −0.05em, with the 7 in red (or the 7 in black on a red ground). Replace it when a real mark exists.

## Fonts
No font files were supplied. **Syne**, **Geist** and **Geist Mono** load from Google Fonts as substitutes (`tokens/fonts.css`).
