"""Build the small, pre-cropped photos the landing "Forward pass" network runs on.

Usage (from the repo root):
    python3 scripts/assets/build_forward_pass_inputs.py

Reads scripts/assets/forward-pass-crops.json. Crop boxes are [left, top, right, bottom] in pixels of the
source photo *after* EXIF orientation is applied. Writes public/images/landing/forward-pass/<id>.webp.
An entry with "placeholder": "code" instead draws an abstract code editor, used until a real photo exists.
Requires Pillow.
"""

import json
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[2]
CONFIG = ROOT / "scripts" / "assets" / "forward-pass-crops.json"
OUT_DIR = ROOT / "public" / "images" / "landing" / "forward-pass"


CODE_COLOURS = ["#22d3ee", "#a78bfa", "#f472b6", "#fbbf24", "#34d399", "#94a3b8", "#94a3b8"]


def code_placeholder(size: int, seed: int = 1101) -> Image.Image:
    """An abstract code editor: line-number gutter, indented token bars, a cursor. Drawn at 4x, downsampled."""
    scale = 4
    side = size * scale
    rng = random.Random(seed)
    image = Image.new("RGB", (side, side), "#0b1220")
    draw = ImageDraw.Draw(image)
    draw.rectangle([0, 0, side * 0.13, side], fill="#0f172a")
    line_height = side / 14
    indent = 0
    for line in range(13):
        y = line_height * (line + 0.75)
        draw.rounded_rectangle([side * 0.04, y, side * 0.09, y + line_height * 0.32], radius=6, fill="#334155")
        if line in (4, 9):
            continue  # blank lines
        indent = max(0, min(3, indent + rng.choice([-1, 0, 0, 1])))
        x = side * (0.18 + indent * 0.07)
        for _ in range(rng.randint(1, 4)):
            width = side * rng.uniform(0.06, 0.2)
            if x + width > side * 0.95:
                break
            draw.rounded_rectangle([x, y, x + width, y + line_height * 0.38], radius=8, fill=rng.choice(CODE_COLOURS))
            x += width + side * 0.025
        if line == 11:
            draw.rectangle([x + side * 0.01, y - line_height * 0.1, x + side * 0.02, y + line_height * 0.5], fill="#e2e8f0")
    return image.resize((size, size), Image.LANCZOS)


def main() -> None:
    config = json.loads(CONFIG.read_text())
    size = int(config["size"])
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for entry in config["inputs"]:
        if entry.get("placeholder") == "code":
            target = OUT_DIR / f"{entry['id']}.webp"
            code_placeholder(size).save(target, "WEBP", quality=88, method=6)
            print(f"{target.relative_to(ROOT)}  {target.stat().st_size} bytes (placeholder)")
            continue
        source = ROOT / entry["source"]
        with Image.open(source) as raw:
            image = ImageOps.exif_transpose(raw).convert("RGB")
        left, top, right, bottom = entry["crop"]
        cropped = image.crop((left, top, right, bottom)).resize((size, size), Image.LANCZOS)
        target = OUT_DIR / f"{entry['id']}.webp"
        cropped.save(target, "WEBP", quality=88, method=6)
        print(f"{target.relative_to(ROOT)}  {target.stat().st_size} bytes")


if __name__ == "__main__":
    main()
