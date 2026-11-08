#!/usr/bin/env python3
"""assets/img/gallery/ 폴더의 사진 목록을 assets/data/gallery.json 으로 만듭니다.

사용법 (wedding 폴더에서):
    python3 scripts/update-gallery.py

사진을 폴더에 넣거나 빼고 이 명령을 한 번 실행하면 갤러리에 반영됩니다.
순서는 파일명 순서입니다 (01.webp, 02.webp ... 처럼 번호를 붙이면 편합니다).
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PHOTO_DIR = ROOT / "assets" / "img" / "gallery"
OUT = ROOT / "assets" / "data" / "gallery.json"
EXTS = {".webp", ".jpg", ".jpeg", ".png", ".avif"}


def natural_key(p: Path):
    # gallery-2 < gallery-10 이 되도록 숫자를 숫자로 비교
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", p.name)]


files = sorted(
    (p for p in PHOTO_DIR.iterdir() if p.suffix.lower() in EXTS and not p.name.startswith(".")),
    key=natural_key,
)

items = [
    {"src": f"./assets/img/gallery/{p.name}", "alt": f"웨딩 사진 {i}"}
    for i, p in enumerate(files, 1)
]

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"사진 {len(items)}장 -> {OUT.relative_to(ROOT)}")
