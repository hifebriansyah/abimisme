#!/usr/bin/env python3
"""Rebuild everything in assets/ from logo.png (or a path given as the first argument).

Usage:  python3 build_assets.py [path/to/logo]
Needs:  ImageMagick 7 (`magick`), e.g. `brew install imagemagick`.

Outputs: logo.png (transparent), favicon.ico, favicon-32.png, apple-touch-icon.png,
icon-192.png, icon-512.png, og.jpg and site.webmanifest.
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "assets"
BG = "#f7f1e6"      # page --bg (light)
INK = "#2a2118"     # --ink
MUTED = "#7a6b5a"   # --muted
ACCENT = "#E68355"  # --accent
FONTS = Path("/System/Library/Fonts/Supplemental")
FONT_BOLD = FONTS / "Georgia Bold.ttf"
FONT_ITALIC = FONTS / "Georgia Italic.ttf"
TAGLINE = "Nasihat bapak-bapak yang bijak,\nnyeleneh, dan bikin “iya juga ya” —\ndikompilasi jadi kitab puitis."


def magick(*args):
    subprocess.run(["magick", *map(str, args)], check=True)


def cut_out(src, dst):
    """Trim transparent logo, or remove outer white background if the source is opaque."""
    opaque = subprocess.check_output(
        ["magick", str(src), "-format", "%[opaque]", "info:"], text=True
    ).strip() == "True"
    if not opaque:
        magick(src, "-trim", "+repage", dst)
        return
    magick(
        src,
        "-bordercolor", "white", "-border", 4,      # so all outer white is one connected area
        "-alpha", "set", "-fuzz", "12%", "-fill", "none",
        "-floodfill", "+0+0", "white",
        "-shave", "4x4",
        "-channel", "A", "-morphology", "Erode", "Disk:1", "-blur", "0x0.7", "+channel",  # clean edge halo
        "-trim", "+repage",
        dst,
    )


def tile(logo, dst, size, logo_pct):
    """Transparent square app icon with the logo centred, filling logo_pct of the width."""
    inner = size * logo_pct // 100
    magick(logo, "-resize", f"{inner}x{inner}",
           "-background", "none", "-gravity", "center", "-extent", f"{size}x{size}",
           "-strip", "-colors", 128, "-define", "png:compression-level=9", dst)


def main():
    if not shutil.which("magick"):
        sys.exit("ImageMagick not found. Install it with: brew install imagemagick")
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "logo.png"
    if not src.exists():
        sys.exit(f"Logo not found: {src}")
    OUT.mkdir(exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        cut = Path(tmp) / "cut.png"
        square = Path(tmp) / "square.png"
        cut_out(src, cut)

        # Logo used on the page (header + home hero)
        magick(cut, "-resize", "640x", "-strip", "-colors", 128,
               "-define", "png:compression-level=9", OUT / "logo.png")

        # Favicons: transparent, logo padded to a square
        magick(cut, "-resize", "1000x1000", "-background", "none",
               "-gravity", "center", "-extent", "1040x1040", square)
        magick(square, "-resize", "32x32", OUT / "favicon-32.png")
        magick(square,
               "(", "-clone", 0, "-resize", "16x16", ")",
               "(", "-clone", 0, "-resize", "32x32", ")",
               "(", "-clone", 0, "-resize", "48x48", ")",
               "-delete", 0, OUT / "favicon.ico")

        # App icons: no background, logo nearly edge to edge
        tile(cut, OUT / "apple-touch-icon.png", 180, 96)
        tile(cut, OUT / "icon-192.png", 192, 96)
        tile(cut, OUT / "icon-512.png", 512, 96)
        (OUT / "icon-maskable-512.png").unlink(missing_ok=True)  # maskable icons need a solid background

        # Share image (og:image / twitter:image)
        magick("-size", "1200x630", f"xc:{BG}",
               "(", cut, "-resize", "470x470", ")",
               "-gravity", "west", "-geometry", "+70+0", "-composite",
               "-gravity", "northwest",
               "-font", FONT_BOLD, "-fill", INK, "-pointsize", 104, "-annotate", "+590+170", "abimisme",
               "-font", FONT_BOLD, "-fill", ACCENT, "-pointsize", 26, "-annotate", "+596+138", "KITAB Nasihat BAPAK-BAPAK",
               "-font", FONT_ITALIC, "-fill", MUTED, "-pointsize", 34, "-interline-spacing", 8,
               "-annotate", "+596+320", TAGLINE,
               "-fill", ACCENT, "-draw", "rectangle 0,614 1200,630",
               "-strip", "-quality", 86, OUT / "og.jpg")

    (OUT / "site.webmanifest").write_text(json.dumps({
        "name": "abimisme — Kitab Nasihat Bapak-Bapak",
        "short_name": "abimisme",
        "start_url": "../#/",
        "scope": "../",
        "display": "standalone",
        "background_color": BG,
        "theme_color": ACCENT,
        "icons": [
            {"src": "icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "icon-512.png", "sizes": "512x512", "type": "image/png"},
        ],
    }, ensure_ascii=False, indent=2) + "\n")

    for f in sorted(OUT.iterdir()):
        print(f"{f.stat().st_size / 1024:7.1f} KB  assets/{f.name}")


if __name__ == "__main__":
    main()
