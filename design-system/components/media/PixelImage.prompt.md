Canvas image with controllable pixelation; use for every media preview and for the resolve/upscale reveal.
```jsx
<PixelImage animateFrom={48} block={1} duration={1800} />
<PixelImage src={url} block={14} />   // "before" of an upscale
```
- No `src` → seeded abstract placeholder (replace with real media).
- `grid` adds the LED gaps at coarse sizes.
