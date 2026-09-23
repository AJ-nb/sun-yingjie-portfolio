"""Verify that every public raster/vector image has one reproducible current audit record."""
from __future__ import annotations

from pathlib import Path
import json

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "web" / "public"
MANIFEST = ROOT / "deliverables" / "image-v6" / "image-manifest.json"
EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"}
TREATMENTS = {"transparent-subject", "evidence-repair", "deterministic-optimize", "no-change"}
PRIORITY_GENERATED_COUNT = 5


def image_paths(root: Path) -> list[str]:
    return sorted(path.relative_to(root).as_posix() for path in root.rglob("*") if path.is_file() and path.suffix.lower() in EXTENSIONS)


public_images = image_paths(PUBLIC)
manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
assets = manifest["assets"]

assert manifest["edition"] == "public-image-audit-v7.7"
assert manifest["root"] == "web/public"
assert [item["path"] for item in assets] == public_images
assert len({item["path"] for item in assets}) == len(assets)
assert manifest["assetCount"] == len(public_images)
assert all(item["treatment"] in TREATMENTS for item in assets)
assert all(item["sha256"] and len(item["sha256"]) == 64 for item in assets)
assert all(item["promptZh"] and item["promptEn"] and item["avoid"] for item in assets)
assert all(item["usage"] and item["status"] for item in assets)

transparent = [item for item in assets if item["treatment"] == "transparent-subject"]
outputs = [item["output"] for item in transparent]
assert all(outputs), "Transparent-subject entries require output paths"
assert len(outputs) == len(set(outputs)), "Transparent output paths must be unique"
assert all(output.startswith(("media/v6/", "media/v7/")) and output.endswith(".png") for output in outputs)

generated = [item for item in transparent if item["status"] == "generated"]
assert len(generated) == PRIORITY_GENERATED_COUNT, f"Expected {PRIORITY_GENERATED_COUNT} generated priority cutouts, found {len(generated)}"
for item in generated:
    target = PUBLIC / item["output"]
    assert target.is_file(), f"Missing generated output: {item['output']}"
    with Image.open(target) as image:
        assert "A" in image.getbands(), f"Generated output lacks an alpha channel: {item['output']}"
        alpha = image.getchannel("A")
        low, high = alpha.getextrema()
        assert low == 0 and high == 255, f"Generated output is not genuinely transparent: {item['output']}"

evidence = [item for item in assets if item["treatment"] == "evidence-repair"]
assert all(not item["output"] for item in evidence), "Evidence images are repaired in place only by a deterministic derivative pipeline"
assert all("文字" in item["avoid"] or "text" in item["avoid"].lower() for item in evidence)

print(f"PASS: {len(assets)} public images audited; {len(transparent)} transparent-subject candidates; {len(evidence)} evidence-preservation records.")
