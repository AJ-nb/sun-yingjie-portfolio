"""Create the v7 transparent profile portrait from the canonical source.

The source is a supplied photographic portrait. This script performs only a
deterministic background extraction: it estimates the smooth studio backdrop
from safe border samples, flood-fills that backdrop, and keeps the original
RGB pixels while writing a feathered alpha channel. No pixels inside the
subject are generated or redrawn.
"""
from __future__ import annotations

from collections import deque
from hashlib import sha256
import json
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "private/sources/portrait/profile-portrait-v7-source.png"
OUTPUT = ROOT / "web/public/media/v7/profile-portrait-cutout.png"
PROVENANCE = ROOT / "private/sources/portrait/profile-portrait-v7.json"
THRESHOLD = 18.0


def _background_model(rgb: np.ndarray) -> np.ndarray:
    """Fit a low-order backdrop model from border pixels not covered by hair."""
    height, width, _ = rgb.shape
    ys, xs = np.mgrid[0:height, 0:width]
    x = xs / (width - 1) * 2 - 1
    y = ys / (height - 1) * 2 - 1
    features = np.stack([np.ones_like(x), x, y, x * x, x * y, y * y], axis=-1)

    # The sweater touches the bottom edge. Use the top edge and narrow side
    # strips, excluding the top-center hair, as known-background samples.
    samples = (ys < 80) | (xs < 35) | (xs >= width - 35)
    samples &= ~((ys > 20) & (ys < 80) & (xs > 250) & (xs < 1000))
    coefficients = np.linalg.lstsq(
        features[samples], rgb[samples], rcond=None
    )[0]
    return features.reshape(-1, 6) @ coefficients


def _background_reachable(distance: np.ndarray, threshold: float) -> np.ndarray:
    """Flood-fill pixels matching the backdrop from the image border."""
    height, width = distance.shape
    candidate = distance < threshold
    reached = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        if candidate[0, x]:
            reached[0, x] = True
            queue.append((0, x))
        if candidate[height - 1, x] and not reached[height - 1, x]:
            reached[height - 1, x] = True
            queue.append((height - 1, x))
    for y in range(height):
        if candidate[y, 0] and not reached[y, 0]:
            reached[y, 0] = True
            queue.append((y, 0))
        if candidate[y, width - 1] and not reached[y, width - 1]:
            reached[y, width - 1] = True
            queue.append((y, width - 1))

    while queue:
        y, x = queue.popleft()
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = y + dy, x + dx
            if (
                0 <= ny < height
                and 0 <= nx < width
                and candidate[ny, nx]
                and not reached[ny, nx]
            ):
                reached[ny, nx] = True
                queue.append((ny, nx))
    return reached


def build() -> dict[str, object]:
    if not SOURCE.is_file():
        raise FileNotFoundError(SOURCE)
    original = Image.open(SOURCE).convert("RGB")
    rgb = np.asarray(original, dtype=np.float32)
    height, width, _ = rgb.shape
    backdrop = _background_model(rgb).reshape(height, width, 3)
    distance = np.linalg.norm(rgb - backdrop, axis=2)
    background = _background_reachable(distance, THRESHOLD)

    # Keep original RGB values. Feather only the boundary and remove the
    # fitted gray backdrop contribution from semitransparent edge pixels.
    alpha = np.clip((distance - 3.0) / (THRESHOLD - 3.0) * 255.0, 0, 255)
    alpha[background] = 0
    coverage = alpha / 255.0
    corrected = rgb.copy()
    for channel in range(3):
        corrected[:, :, channel] = np.where(
            coverage > 0.08,
            (rgb[:, :, channel] - (1.0 - coverage) * backdrop[:, :, channel])
            / np.maximum(coverage, 0.08),
            rgb[:, :, channel],
        )
    corrected = np.clip(corrected, 0, 255).astype(np.uint8)
    rgba = np.dstack([corrected, alpha.astype(np.uint8)])

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba, mode="RGBA").save(OUTPUT, format="PNG", optimize=True)

    source_hash = sha256(SOURCE.read_bytes()).hexdigest()
    output_hash = sha256(OUTPUT.read_bytes()).hexdigest()
    with Image.open(OUTPUT) as image:
        alpha_channel = image.getchannel("A")
        alpha_min, alpha_max = alpha_channel.getextrema()
        output_size = image.size
    record = {
        "edition": "v7",
        "asset": "profile-portrait-cutout",
        "source": SOURCE.relative_to(ROOT).as_posix(),
        "sourceSha256": source_hash,
        "output": OUTPUT.relative_to(ROOT).as_posix(),
        "outputSha256": output_hash,
        "dimensions": {"width": output_size[0], "height": output_size[1]},
        "sourceRole": "canonical user-supplied portrait; preserved unchanged",
        "derivativeRole": "transparent website and portfolio-PDF layout portrait",
        "derivativeMethod": "Deterministic polynomial studio-background model, border flood-fill, alpha feather and edge decontamination; no generative redraw",
        "identityConstraints": [
            "same face, hair, pose, clothing, crop, camera view and lighting",
            "only the background is replaced with alpha",
            "no invented detail, retouching, reshaping, or new scene",
        ],
        "alphaExtrema": {"min": alpha_min, "max": alpha_max},
    }
    PROVENANCE.parent.mkdir(parents=True, exist_ok=True)
    PROVENANCE.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return record


if __name__ == "__main__":
    print(json.dumps(build(), ensure_ascii=False, indent=2))
