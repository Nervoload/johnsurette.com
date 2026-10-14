"""Build the small, pre-cropped photos the landing "Forward pass" network runs on.

Usage (from the repo root):
    python3 scripts/assets/build_forward_pass_inputs.py

Reads scripts/assets/forward-pass-crops.json. Crop boxes are [left, top, right, bottom] in pixels of the
source photo *after* EXIF orientation is applied. Writes public/images/landing/forward-pass/<id>.webp.
Requires Pillow.
"""

import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
CONFIG = ROOT / "scripts" / "assets" / "forward-pass-crops.json"
OUT_DIR = ROOT / "public" / "images" / "landing" / "forward-pass"


def main() -> None:
    config = json.loads(CONFIG.read_text())
    size = int(config["size"])
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for entry in config["inputs"]:
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
