"""Generates packaging/icon.ico — se7en Clip mark: the black "7" on a cyan ground, inside the corner
brackets of a vertical 9:16 frame. Drawn in code, no binary asset."""
from pathlib import Path

from PIL import Image, ImageDraw

RED = (34, 211, 230, 255)  # cyan se7en Clip (nom gardé : même code que se7en Download)
INK = (5, 5, 5, 255)


def render(size: int) -> Image.Image:
    s = size * 4  # supersample
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((0, 0, s - 1, s - 1), radius=int(s * 0.12), fill=RED)  # near-square geometry
    # Heavy geometric 7 (Syne-like): top bar + slanted stem
    t = s * 0.16  # stroke weight
    x0, x1 = s * 0.24, s * 0.78
    y0 = s * 0.22
    d.rectangle((x0, y0, x1, y0 + t), fill=INK)
    d.polygon([(x1 - t * 1.15, y0 + t), (x1, y0 + t), (s * 0.47 + t * 0.2, s * 0.8), (s * 0.47 - t * 0.95, s * 0.8)], fill=INK)
    # coins d'un cadre vertical 9:16 : le recadrage TikTok
    fw, fh = s * 0.5, s * 0.5 * 16 / 9 * 0.92
    fx0, fy0 = (s - fw) / 2, (s - fh) / 2
    arm, w = s * 0.1, max(2, int(s * 0.035))
    for cx, cy, sx, sy in ((fx0, fy0, 1, 1), (fx0 + fw, fy0, -1, 1), (fx0, fy0 + fh, 1, -1), (fx0 + fw, fy0 + fh, -1, -1)):
        if size >= 32:
            d.line((cx, cy, cx + sx * arm, cy), fill=INK, width=w)
            d.line((cx, cy, cx, cy + sy * arm), fill=INK, width=w)
    return img.resize((size, size), Image.Resampling.LANCZOS)


def wizard_images(folder: Path) -> None:
    """Installer artwork in the se7en style: ink ground, scanlines, the "se7en" wordmark with the red 7."""
    from PIL import ImageFont
    font_file = Path(__file__).resolve().parents[1] / "frontend" / "node_modules" / "@fontsource" / "syne" / "files" / "syne-latin-800-normal.woff"
    for name, (w, h), scale in (("wizard-large.bmp", (410, 797), 2.5), ("wizard-small.bmp", (138, 140), 2.5)):
        img = Image.new("RGB", (w, h), INK[:3])
        d = ImageDraw.Draw(img)
        for y in range(0, h, 3):  # scanlines
            d.line((0, y, w, y), fill=(12, 12, 12))
        if name == "wizard-small.bmp":
            mark = render(int(w * 0.72)).convert("RGBA")
            img.paste(mark, ((w - mark.width) // 2, (h - mark.height) // 2), mark)
        else:
            d.rectangle((0, h - 10, w, h), fill=RED[:3])
            def fit(text: str, width: float, start: int):
                size = start
                while size > 8:
                    try:
                        font = ImageFont.truetype(str(font_file), size)
                    except OSError:
                        return ImageFont.load_default()
                    if d.textlength(text, font=font) <= width:
                        return font
                    size -= 2
                return font
            f = fit("se7en clip", w * 0.8, 120)
            x = (w - d.textlength("se7en clip", font=f)) / 2
            y = int(h * 0.40)
            for part, col in (("se", (244, 243, 241)), ("7", RED[:3]), ("en clip", (244, 243, 241))):
                d.text((x, y), part, font=f, fill=col)
                x += d.textlength(part, font=f)
            sub = "CLIPS · CAPTIONS · VERTICAL"
            small = fit(sub, w * 0.6, 40)
            d.text(((w - d.textlength(sub, font=small)) / 2, y + int(f.size * 1.25)), sub, font=small, fill=(125, 124, 121))
            tick = int(10 * scale)
            for cx, cy, sx, sy in ((14, 14, 1, 1), (w - 14, 14, -1, 1), (14, h - 26, 1, -1), (w - 14, h - 26, -1, -1)):
                d.line((cx, cy, cx + sx * tick, cy), fill=(70, 70, 70), width=2)
                d.line((cx, cy, cx, cy + sy * tick), fill=(70, 70, 70), width=2)
        img.save(folder / name)


if __name__ == "__main__":
    out = Path(__file__).with_name("icon.ico")
    render(256).save(out, sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    wizard_images(Path(__file__).parent)
    print("wrote", out, "and installer artwork")
