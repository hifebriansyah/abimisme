#!/usr/bin/env python3
"""Render each bait of kitab.md as square JPG cards, light and dark:
public/assets/kitab/<jilid>-<bab>-<bait>.jpg and <jilid>-<bab>-<bait>-dark.jpg

The light card is the one link previews show (og:image); the bait page picks light or dark to match the site theme.

Usage:
    python3 tools/make_baik_images.py 1-1-1        one bait (test run)
    python3 tools/make_baik_images.py              every bait
Needs:  Pillow, and the Georgia fonts of macOS.
"""
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
KITAB = ROOT / "kitab.md"
LOGO = ROOT / "public" / "assets" / "logo.png"
OUT = ROOT / "public" / "assets" / "kitab"

SIZE = 1080
# The site's own colours (app/styles/app.css): --bg, --ink, --muted, and the brand orange for the ref and the second "i".
# "glow": a soft shadow around the logo (its dark outline would vanish on the dark page)
THEMES = {
    "light": {"bg": "#f7f1e6", "ink": "#2a2118", "muted": "#7a6b5a", "accent": "#E68355", "glow": None},
    "dark": {"bg": "#15110d", "ink": "#f1e8d8", "muted": "#a79a86", "accent": "#E68355", "glow": "#ffffff"},
}
FONTS = Path("/System/Library/Fonts/Supplemental")
FONT_TEXT = FONTS / "Georgia.ttf"
FONT_BOLD = FONTS / "Georgia Bold.ttf"

MARGIN = 110
LINE_RE = re.compile(r"^(\d+):(\d+):(\d+):(\d+)\s+(.*\S)\s*$")


def parse_kitab():
    """Return {(jilid, bab, bait): [lines]}."""
    baits = {}
    for raw in KITAB.read_text(encoding="utf-8").splitlines():
        m = LINE_RE.match(raw)
        if m:
            j, b, t, _ = map(int, m.groups()[:4])
            baits.setdefault((j, b, t), []).append(m.group(5))
    return baits


def font(path, size):
    return ImageFont.truetype(str(path), size)


def wrap(draw, text, fnt, max_width):
    lines, cur = [], ""
    for word in text.split():
        trial = f"{cur} {word}".strip()
        if cur and draw.textlength(trial, font=fnt) > max_width:
            lines.append(cur)
            cur = word
        else:
            cur = trial
    return lines + [cur] if cur else lines


def fit_text(draw, rows, max_width, max_height):
    """Largest font at which the bait, run together as one paragraph, fits the box."""
    text = " ".join(rows)
    for size in range(52, 27, -2):
        fnt = font(FONT_TEXT, size)
        lines = wrap(draw, text, fnt, max_width)
        if len(lines) * size * 1.3 <= max_height:
            break
    return fnt, lines


GLOW_SPREAD = 1   # px the shape is grown before it is blurred
GLOW_BLUR = 1.5     # blur radius, px


def with_glow(logo, color):
    """The logo on a transparent canvas with a soft shadow of `color` around its shape."""
    pad = GLOW_SPREAD + round(3 * GLOW_BLUR)
    canvas = Image.new("RGBA", (logo.width + 2 * pad, logo.height + 2 * pad), (0, 0, 0, 0))
    canvas.paste(logo, (pad, pad), logo)
    shape = canvas.getchannel("A").filter(ImageFilter.MaxFilter(2 * GLOW_SPREAD + 1)).filter(ImageFilter.GaussianBlur(GLOW_BLUR))
    glow = Image.new("RGBA", canvas.size, color)
    glow.putalpha(shape)
    return Image.alpha_composite(glow, canvas)


def render(key, rows, theme):
    t_ = THEMES[theme]
    BG, INK, MUTED, ACCENT = t_["bg"], t_["ink"], t_["muted"], t_["accent"]
    j, b, t = key
    img = Image.new("RGB", (SIZE, SIZE), BG)
    draw = ImageDraw.Draw(img)

    # header, centred: logo, then the "abimisme" wordmark with the second "i" in the accent colour
    logo = Image.open(LOGO).convert("RGBA")
    h = 90
    logo = logo.resize((round(logo.width * h / logo.height), h), Image.LANCZOS)
    if t_["glow"]:
        logo = with_glow(logo, t_["glow"])
    img.paste(logo, ((SIZE - logo.width) // 2, 55 + (h - logo.height) // 2), logo)

    word_font = font(FONT_BOLD, 40)
    parts = [("abim", INK), ("i", ACCENT), ("sme", INK)]
    x = (SIZE - draw.textlength("abimisme", font=word_font)) / 2
    for text, color in parts:
        draw.text((x, 160), text, font=word_font, fill=color)
        x += draw.textlength(text, font=word_font)

    draw.line([(MARGIN, 235), (SIZE - MARGIN, 235)], fill=MUTED, width=1)

    # the bait itself, left-aligned, centred vertically between the two rules
    top, bottom = 235, 850
    fnt, lines = fit_text(draw, rows, SIZE - 2 * MARGIN, bottom - top - 60)
    lh = round(fnt.size * 1.3)
    y = top + (bottom - top - lh * len(lines)) / 2
    for line in lines:
        draw.text((MARGIN, y), line, font=fnt, fill=INK)
        y += lh

    # footer: rule, then the ref centred
    draw.line([(MARGIN, 850), (SIZE - MARGIN, 850)], fill=MUTED, width=1)
    ref = f"{j}:{b}:{t}"
    ref_font = font(FONT_BOLD, 34)
    draw.text(((SIZE - draw.textlength(ref, font=ref_font)) / 2, 895), ref, font=ref_font, fill=ACCENT)
    return img


def main():
    baits = parse_kitab()
    if len(sys.argv) > 1:
        wanted = []
        for arg in sys.argv[1:]:
            try:
                key = tuple(int(x) for x in arg.split("-"))
                assert len(key) == 3 and key in baits
            except (ValueError, AssertionError):
                sys.exit(f"No such bait: {arg} (use jilid-bab-bait, e.g. 1-1-1)")
            wanted.append(key)
    else:
        wanted = sorted(baits)

    OUT.mkdir(parents=True, exist_ok=True)
    for key in wanted:
        for theme, suffix in (("light", ""), ("dark", "-dark")):
            path = OUT / ("-".join(map(str, key)) + suffix + ".jpg")
            render(key, baits[key], theme).save(path, "JPEG", quality=90, optimize=True)
            print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
