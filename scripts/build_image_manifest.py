"""Build the current public-image audit and bilingual prompt book."""
from __future__ import annotations

from hashlib import sha256
from pathlib import Path
from xml.etree import ElementTree
import json
import re

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "web" / "public"
OUT = ROOT / "deliverables" / "image-v6"
MANIFEST = OUT / "image-manifest.json"
PROMPTS = OUT / "PROMPTS.md"
EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"}

PRIORITY_OUTPUTS = {
    "media/v5/portrait.png": "media/v6/portrait-cutout.png",
    "media/v7/resume-portrait.png": "media/v7/profile-portrait-cutout.png",
    "works/refinement-v2/plumber/three-quarter.webp": "media/v6/product-plumber-cutout.png",
    "works/refinement-v2/huhu/three-quarter.webp": "media/v6/product-huhu-cutout.png",
    "works/legacy/lighting/916094a2d9a1fe336ac2d4c9854737b4.webp": "media/v6/product-lighting-cutout.png",
}


def public_images() -> list[Path]:
    return sorted(path for path in PUBLIC.rglob("*") if path.is_file() and path.suffix.lower() in EXTENSIONS)


def dimensions(path: Path) -> tuple[int | None, int | None, str, bool | None]:
    if path.suffix.lower() == ".svg":
        try:
            root = ElementTree.parse(path).getroot()
            width = re.sub(r"[^0-9.]", "", root.attrib.get("width", ""))
            height = re.sub(r"[^0-9.]", "", root.attrib.get("height", ""))
            view_box = [float(value) for value in root.attrib.get("viewBox", "").split()]
            return (
                int(float(width)) if width else int(view_box[2]) if len(view_box) == 4 else None,
                int(float(height)) if height else int(view_box[3]) if len(view_box) == 4 else None,
                "SVG",
                True,
            )
        except (ElementTree.ParseError, ValueError, OSError):
            return None, None, "SVG", True
    try:
        with Image.open(path) as image:
            has_alpha = "A" in image.getbands() or "transparency" in image.info
            return image.width, image.height, image.mode, has_alpha
    except (OSError, ValueError):
        return None, None, "unknown", None


def transparent_candidate(relative: str) -> bool:
    if relative in PRIORITY_OUTPUTS:
        return True
    if relative.startswith("works/refinement-v2/huhu/"):
        return not any(term in relative for term in ("product-scene", "early-form"))
    if relative.startswith("works/refinement-v2/plumber/"):
        return not any(term in relative for term in ("underground",))
    return False


def output_path(relative: str) -> str:
    if relative in PRIORITY_OUTPUTS:
        return PRIORITY_OUTPUTS[relative]
    stem = re.sub(r"[^a-z0-9]+", "-", Path(relative).stem.lower()).strip("-")
    family = "huhu" if "/huhu/" in relative else "plumber"
    return f"media/v6/{family}-{stem}-cutout.png"


def classify(relative: str) -> tuple[str, str]:
    lower = relative.lower()
    if transparent_candidate(relative):
        return "isolated-subject", "transparent-subject"
    if lower.endswith(".svg") or "/logo/" in lower or "wordmark" in lower or "logo" in lower:
        return "vector-or-brand-source", "no-change"
    if relative.startswith("thumbnails/") or "/media/v5/" in lower:
        return "site-thumbnail-or-poster", "deterministic-optimize"
    if any(term in lower for term in (
        "works/documents/", "/digital/", "refinement-digital", "refinement-brand",
        "native.png", "desktop.png", "mobile.png", "workflow.png", "dimension", "dimensions",
        "sketch", "board", "journey", "cmf", "exploded", "application", "research",
    )):
        return "documentary-evidence", "evidence-repair"
    return "project-evidence", "evidence-repair"


def prompts(relative: str, usage: str, treatment: str) -> tuple[str, str, str]:
    filename = Path(relative).name
    if treatment == "transparent-subject":
        subject = "人物肖像" if "portrait" in relative else "产品或三维模型主体"
        zh = (
            f"用例：background-extraction。资产：{relative}。仅提取{subject}并输出真正透明背景；"
            "保留原主体的身份或几何、比例、材料、表面细节、光线方向与相机视角；清理边缘白边和灰雾；"
            "不重新设计，不补画被遮挡结构，不添加投影、文字、Logo、水印或新零件。"
        )
        en = (
            f"Use case: background-extraction. Asset: {relative}. Extract only the existing subject onto a genuinely transparent background. "
            "Preserve identity or geometry, proportions, materials, surface detail, lighting direction and camera view. Clean edge halos only. "
            "Do not redesign, invent hidden structure, add shadows, text, logos, watermarks or parts."
        )
        avoid = "禁止改变身份、文字、Logo、产品几何、比例、材质、结构、视角；no invented detail, no opaque backdrop, no halo"
        return zh, en, avoid
    if treatment == "evidence-repair":
        zh = (
            f"用例：precise-object-edit。证据资产：{relative}。仅修复压缩噪点、色偏、轻微透视和清晰度，"
            "保持原始构图、文字、Logo、界面、尺寸、几何、比例、项目阶段和署名完全不变；不重绘成果。"
        )
        en = (
            f"Use case: precise-object-edit. Evidence asset: {relative}. Correct only compression noise, color cast, minor perspective and clarity. "
            "Keep composition, text, logos, UI, dimensions, geometry, proportions, project stage and credits unchanged. Do not redraw the outcome."
        )
        avoid = "禁止生成或改写文字/text、Logo、UI、尺寸、几何、产品结构、人物、署名、结果；no invented outcome"
        return zh, en, avoid
    if treatment == "deterministic-optimize":
        zh = f"资产：{relative}。不交给生成模型重画；使用确定性编码优化体积、色彩配置与响应式尺寸，保持每个像素表达的原意。"
        en = f"Asset: {relative}. Do not redraw with a generative model; use deterministic encoding for file size, color profile and responsive dimensions while preserving the image meaning."
        avoid = "禁止生成式重绘、风格迁移、裁掉关键信息、改变文字或主体；no generative redraw"
        return zh, en, avoid
    zh = f"资产：{relative}。保持原文件，不做生成式编辑；仅验证链接、授权、可访问性替代文本和使用场景。"
    en = f"Asset: {relative}. Preserve the original file; perform no generative edit. Verify link, license, accessible alternative text and usage context only."
    avoid = "禁止栅格化矢量、重绘 Logo/文字、改变品牌源文件；no rasterization or brand redraw"
    return zh, en, avoid


def build() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    assets = []
    for path in public_images():
        relative = path.relative_to(PUBLIC).as_posix()
        width, height, mode, has_alpha = dimensions(path)
        usage, treatment = classify(relative)
        prompt_zh, prompt_en, avoid = prompts(relative, usage, treatment)
        output = output_path(relative) if treatment == "transparent-subject" else ""
        generated_output = PUBLIC / output if output else None
        status = (
            "generated" if relative in PRIORITY_OUTPUTS and generated_output and generated_output.is_file() else
            "ready-for-generation" if relative in PRIORITY_OUTPUTS else
            "queued" if treatment == "transparent-subject" else
            "source-preserved" if treatment == "evidence-repair" else
            "encoder-ready" if treatment == "deterministic-optimize" else
            "preserved"
        )
        assets.append({
            "path": relative,
            "sha256": sha256(path.read_bytes()).hexdigest(),
            "width": width,
            "height": height,
            "mode": mode,
            "hasAlpha": has_alpha,
            "usage": usage,
            "treatment": treatment,
            "promptZh": prompt_zh,
            "promptEn": prompt_en,
            "avoid": avoid,
            "output": output,
            "status": status,
            "sourceName": filename if (filename := path.name) else "",
        })
    counts = {name: sum(asset["treatment"] == name for asset in assets) for name in ("transparent-subject", "evidence-repair", "deterministic-optimize", "no-change")}
    payload = {"edition": "public-image-audit-v7.7", "root": "web/public", "assetCount": len(assets), "treatmentCounts": counts, "assets": assets}
    MANIFEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Current public image audit / v7.7 prompt book",
        "",
        f"公开图片总数：{len(assets)}。透明主体候选：{counts['transparent-subject']}；证据修复：{counts['evidence-repair']}；确定性优化：{counts['deterministic-optimize']}；原样保留：{counts['no-change']}。",
        "",
        "生成结果不得进入实拍、已落地或原始证据段落；前台不统一显示 AI 标签，内部清单保留来源、提示词与版本。",
        "",
    ]
    titles = {"transparent-subject": "透明主体", "evidence-repair": "证据修复", "deterministic-optimize": "确定性优化", "no-change": "原样保留"}
    for treatment in titles:
        lines.extend([f"## {titles[treatment]}", ""])
        for asset in (item for item in assets if item["treatment"] == treatment):
            lines.extend([
                f"### `{asset['path']}`",
                "",
                f"- 用途：`{asset['usage']}`",
                f"- 状态：`{asset['status']}`",
                f"- 输出：`{asset['output'] or '保留原文件'}`",
                f"- 中文提示词：{asset['promptZh']}",
                f"- English prompt: {asset['promptEn']}",
                f"- 禁止项：{asset['avoid']}",
                "",
            ])
    PROMPTS.write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps({"assets": len(assets), "treatments": counts, "manifest": str(MANIFEST), "prompts": str(PROMPTS)}, ensure_ascii=False))


if __name__ == "__main__":
    build()
