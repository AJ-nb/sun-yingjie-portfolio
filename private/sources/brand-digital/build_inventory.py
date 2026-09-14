"""Archive verified project sources and convert selected existing portfolio images.

No creative image editing, source repository mutation, or publication is performed.
"""
from pathlib import Path
from PIL import Image, ImageOps
import base64
import hashlib
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone

sys.stdout.reconfigure(encoding="utf-8")
BASE = Path("D:/OneDrive/桌面/文件/项目")
ROOT = BASE / "sun-yingjie-portfolio"
PRIVATE = ROOT / "private/sources/brand-digital"
BRANDS = PRIVATE / "github/AJ-nb/AJNB/Design-Knowledge-Base/projects"
STAMP = datetime.now(timezone.utc).isoformat()
asset_manifest = []
evidence_manifest = []


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def local_evidence(rel):
    src = BASE / rel
    if not src.is_file():
        return None
    dst = PRIVATE / "local" / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    entry = {"sourcePath": str(src), "privatePath": str(dst.relative_to(ROOT)).replace("\\", "/"), "sha256": sha(dst)}
    evidence_manifest.append(entry)
    return entry["privatePath"]


def image_asset(src, output, caption, kind="screenshot", limit="", owner="local"):
    src = Path(src)
    dst = ROOT / "web/public" / output.lstrip("/")
    dst.parent.mkdir(parents=True, exist_ok=True)
    if owner == "local":
        local_evidence(str(src.relative_to(BASE)))
    with Image.open(src) as opened:
        im = ImageOps.exif_transpose(opened)
        original_size = list(im.size)
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "transparency" in im.info else "RGB")
        im.thumbnail((2000, 2000), Image.Resampling.LANCZOS)
        im.save(dst, "WEBP", quality=91, method=6, lossless=(kind == "logo"))
        size = list(im.size)
    entry = {"publicPath": "/" + output.lstrip("/"), "sourcePath": str(src), "sourceSha256": sha(src), "outputSha256": sha(dst), "captionZh": caption, "kind": kind, "originalDimensions": original_size, "dimensions": size, "bytes": dst.stat().st_size, "operations": "等比缩放（最长边不超过 2000 px）与 WebP 格式转换；无裁切、重绘、修图或内容替换", "provenanceLimit": limit}
    asset_manifest.append(entry)
    return entry


def svg_asset(src, output, caption, replacement_image=None):
    dst = ROOT / "web/public" / output.lstrip("/")
    dst.parent.mkdir(parents=True, exist_ok=True)
    content = src.read_text(encoding="utf-8-sig")
    operation = "原 SVG 复制"
    if replacement_image:
        data = base64.b64encode(replacement_image.read_bytes()).decode("ascii")
        content = content.replace("../logo/periastra-logo-v01-20260422.png", "data:image/webp;base64," + data)
        operation = "将原 SVG 的相对 Logo 引用内嵌为该 Logo 的 WebP 副本，避免网页图片依赖失效；未改动图形和文字"
    assert not re.search(r"<script\b|\bonload\s*=", content, re.I)
    dst.write_text(content, encoding="utf-8")
    entry = {"publicPath": "/" + output.lstrip("/"), "sourcePath": str(src), "sourceSha256": sha(src), "outputSha256": sha(dst), "captionZh": caption, "kind": "process-diagram", "bytes": dst.stat().st_size, "operations": operation, "provenanceLimit": "应用适配与优化说明；并非已经完成的实体工艺测试"}
    asset_manifest.append(entry)
    return entry


def project(id, title_zh, title_en, category, description, paths, role, limits, status, assets, links=None, aliases=None, attribution=None, details=None):
    return {"id": id, "titleZh": title_zh, "titleEn": title_en, "category": category, "confirmedDescription": description, "sourcePaths": [str(BASE / p) if not p.startswith("github:") else p for p in paths], "publicAssetPaths": [a["publicPath"] for a in assets], "assets": assets, "role": role, "provenanceLimits": limits, "status": status, "displayEligible": bool(assets), "links": links or [], "aliases": aliases or [], "attribution": attribution, "confirmedDetails": details or []}


for slug in ["lensflow", "luck-power", "logo-geometry-studio", "resume-formatter", "visual-lens", "visual-archive-extension", "eagle-aesthetic-atlas", "xhs-operations-os", "image-2-5-xhs"]:
    for filename in ["README.md", "package.json", "manifest.json", "LICENSE", "LICENSE.md", "THIRD_PARTY_NOTICES.md"]:
        local_evidence(f"{slug}/{filename}")

extra_docs = [
    "lensflow/docs/project-status.md", "lensflow/docs/product/product-spec.md", "lensflow/docs/research/viko-analysis.md",
    "lensflow/docs/releases/v0.3.3.md", "lensflow/docs/releases/v0.3.0.md",
    "luck-power/CHANGELOG.md", "luck-power/vendor/img2threejs/UPSTREAM.md",
    "logo-geometry-studio/docs/research.md", "logo-geometry-studio/docs/verification.md",
    "visual-lens/visual-lens/README.md", "visual-lens/visual-lens/package.json", "visual-lens/visual-lens/LICENSE",
    "visual-lens/packages/aesthetic-atlas/README.md", "visual-lens/docs/research/open-source-register.json", "visual-lens/docs/INSTALL-YANTAI.md",
    "eagle-aesthetic-atlas/design-philosophy.md", "eagle-aesthetic-atlas/artifacts/analysis/bauhaus-product.md",
    "xhs-operations-os/SPEC_MANIFEST.json", "xhs-operations-os/docs/MASTER_PRD.md", "xhs-operations-os/docs/ARCHITECTURE.md", "xhs-operations-os/docs/ROADMAP.md",
    "image-2-5-xhs/STATUS.md", "image-2-5-xhs/sources.md", "image-2-5-xhs/post.md", "image-2-5-xhs/publish/image-provenance.json",
    "image-2-5-xhs/tests/protocol.json", "image-2-5-xhs/tests/evaluation.json", "image-2-5-xhs/tests/session-register.json", "image-2-5-xhs/qa/final-verification.json"
]
for rel in extra_docs:
    local_evidence(rel)

repo_snapshots = []
for slug in ["AJNB", "lensflow", "luck-power", "resume-formatter", "xhs-operations-os"]:
    p = subprocess.run(["gh", "api", f"repos/AJ-nb/{slug}"], capture_output=True, encoding="utf-8")
    if p.returncode == 0:
        d = json.loads(p.stdout)
        repo_snapshots.append({"repository": d["full_name"], "url": d["html_url"], "private": d["private"], "fork": d["fork"], "parent": d.get("parent", {}).get("full_name"), "license": (d.get("license") or {}).get("spdx_id"), "verifiedAt": STAMP})

def repo_link(slug, label="项目源码", public=True):
    return {"label": label, "url": f"https://github.com/AJ-nb/{slug}", "verified": True, "method": "GitHub REST API", "verifiedAt": STAMP, "public": public}

def live_link(slug):
    return {"label": "在线体验", "url": f"https://aj-nb.github.io/{slug}/", "verified": True, "method": "GitHub Pages API + HTTP 200（2026-09-15）", "public": True}

candidates = []
per = BRANDS / "Periastra 相机包品牌设计"
per_assets = [image_asset(per / "assets/logo/periastra-logo-v01-20260422.png", "works/brand/periastra/logo/periastra-logo-v01-20260422.webp", "Periastra 标志：首字母 P、镜头旋涡与保护容器", "logo", "标志研究；未核实实体应用或量产", "github")]
for name, caption in [
    ("periastra-structure-breakdown-v01", "P、保护外框与镜头旋涡的结构拆解"),
    ("periastra-lineweight-negative-space-v01", "线宽层级与中央负形的优化方向"),
    ("periastra-application-fit-v01", "小尺寸与工艺适配检查项（待验证）"),
]:
    per_assets.append(svg_asset(per / f"assets/explainers/{name}.svg", f"works/brand/periastra/explainers/{name}.svg", caption, ROOT / "web/public/works/brand/periastra/logo/periastra-logo-v01-20260422.webp" if "breakdown" in name else None))
candidates.append(project("periastra", "Periastra 相机包品牌标志", "Periastra Camera Bag Identity", "brand", "以字母 P、镜头旋涡与保护容器为母题，构建摄影装备品牌标志，并记录线宽、负形与小尺寸应用的优化方向。", ["github:AJ-nb/AJNB/Design-Knowledge-Base/projects/Periastra 相机包品牌设计"], "品牌标志与视觉结构研究；现有资料未单列个人、AI 与协作分工。", ["资料范围为 Logo 及应用研究，不代表相机包整机/结构设计。", "金属铭牌、织唛、压印等为拟验证方向，没有实体生产或商用客户证明。"], "标志方案与应用研究", per_assets))

ye = BRANDS / "夜礼司"
ye_assets = [
    image_asset(ye / "01_Logo 设计/assets/logo/yelisi-final-logo-v01-20260514.png", "works/brand/yelisi/yelisi-logo.webp", "夜礼司现行标志：私印秩序与中央身体负形", "logo", "原稿记录的正式方向；矢量化精修与工艺测试尚待完成", "github"),
    image_asset(ye / "01_Logo 设计/assets/history/历史_Songnasty旧版最终标志.png", "works/brand/yelisi/songnasty-historical-logo.webp", "Songnasty 历史探索阶段（非现行品牌标志）", "logo", "历史工作名，仅作演化证据", "github"),
    image_asset(ye / "02_产品设计/蛇形口咬道具_绒花蝴蝶磁吸配件/assets/佩戴效果图.png", "works/brand/yelisi/snake-component-dimensions-concept.webp", "蛇形部件概念与尺寸标注（研究稿）", "concept-render", "源文件名为“佩戴效果图”，实际画面为蛇形部件尺寸渲染；尺寸、材料、安全与佩戴性能均未独立验证", "github"),
]
candidates.append(project("yelisi", "夜礼司品牌识别与身体装置研究", "YELISI — Night Ritual Atelier", "brand", "从 Songnasty 早期 S 曲线探索转向中文品牌夜礼司，以宋式私印、篆书空间和身体负形建立识别，并延伸研究蛇形口咬主体与蝴蝶磁吸配件的连接关系。", ["github:AJ-nb/AJNB/Design-Knowledge-Base/projects/夜礼司"], "品牌视觉与产品概念研究；现有资料未提供委托合同、团队分工或商业生产证明。", ["Songnasty 是历史工作名，不作为独立品牌重复计数。", "Logo 定向不等于工艺完稿；资料仍列出矢量化、字标和应用测试任务。", "产品图只能证明概念研究；无实物打样、磁吸力、口部材料安全和人体工学验证。", "纯蝴蝶形态参考、人像佩戴示意及历史字形参考图未纳入公开资产。"], "现行品牌方向；产品概念研究", ye_assets, aliases=["Songnasty", "Night Ritual Atelier"]))

def digital_assets(slug, selections):
    return [image_asset(BASE / source, f"works/digital/{slug}/{name}.webp", caption, kind, limit) for source, name, caption, kind, limit in selections]

lens_assets = digital_assets("lensflow", [
    ("lensflow/output/xiaohongshu-lensflow-v0.3.0/evidence/studio-analysis.png", "studio-analysis", "镜序 Studio：素材分析与结构化结果界面（v0.3.0 演示）", "screenshot", "界面内灯具为演示素材，不作为独立原创工业设计成果。"),
    ("lensflow/output/playwright/lensflow-v030-demo-desktop.png", "studio-guide", "镜序首次使用引导与本地演示界面", "screenshot", "演示模式预计算数据，不代表本次实时模型调用结果。"),
])
candidates.append(project("lensflow", "镜序 Lensflow", "Lensflow", "digital", "面向设计素材的本地 AI 创作工作台，贯通图像采集、结构化分析、提示词与参考组织、批量生成任务及资产归档。扩展与产品网站共享工作区界面。", ["lensflow/README.md", "lensflow/docs/project-status.md", "lensflow/THIRD_PARTY_NOTICES.md"], "个人工具项目的产品与交互实现；人工、AI 与上游组件的逐项贡献比例未核实。", ["截图为 v0.3.0 保存的演示界面；本地 package 记录 v0.3.3。", "第三方模型真实接口兼容性与外部集成不是全面验证状态。", "Chrome Web Store、账号、付费、云同步与完整移动编辑不在已确认交付范围。"], "已有源码、文档、截图及公开产品站", lens_assets, [live_link("lensflow"), repo_link("lensflow")], aliases=["镜序"], attribution="项目与第三方依赖保留各自许可证；Viko 为行为调研对象，不冒认其品牌或素材。"))

yantai_assets = digital_assets("yantai", [
    ("visual-lens/output/playwright/yantai-instrument-study-760.png", "design-study-fixture", "砚台产品造型学习界面：观察、拆解、迁移与归档（演示夹具）", "screenshot", "画面明确标注“预览夹具 · study”；灯具与分析数字为界面演示内容，不是用户产品成果或测量性能。"),
])
candidates.append(project("yantai", "砚台 · 产品造型学习工具", "Yantai — Form Study", "digital", "从网页、本地或图片链接采集视觉素材，拆解产品造型手法与结构假设，再由人工确认分类与 Eagle 归档。当前 AJNB 模块将重点收束到设计学习和可追溯归档。", ["luck-power/README.md", "visual-lens/README.md", "visual-lens/visual-lens/README.md", "visual-lens/docs/INSTALL-YANTAI.md"], "工具产品与交互演化项目；具体人机协作分工未在已核对资料中完整列明。", ["luck-power v0.6.3 与 visual-lens/AJNB v0.7.5 属同一砚台演化线。", "旧版 OCR、三视图、重建、工作台等已在当前模块删除，不应混写为现行功能。", "AJNB 当前仓库与 RC 下载为私有访问，公开访客只能访问旧版 luck-power。", "截图为演示夹具，设计推断不是原作者、真实材料、工艺、隐藏结构或安全性证明。"], "砚台当前 v0.7.5 RC；既有公开前身 v0.6.3", yantai_assets, [repo_link("luck-power", "公开前身源码 v0.6.3"), repo_link("AJNB", "当前私有工作区", False)], aliases=["luck-power", "visual-lens", "luck-power-yantai"], attribution="保留 MIT 及各依赖许可；img2threejs 等仅属于旧版工作流范围。"))

form_assets = digital_assets("formline", [
    ("logo-geometry-studio/output/playwright/viewport-1440x900.png", "editor-desktop", "构线桌面编辑器：几何画布、图层、约束与诊断", "screenshot", "画面为已有自动化验收截图；示例为 Aperture 01。"),
    ("logo-geometry-studio/output/playwright/viewport-390x844.png", "editor-mobile", "构线移动端画布与折叠检查器", "screenshot", "界面诊断辅助设计判断，不代表审美评分。"),
])
candidates.append(project("formline", "构线 Formline", "Formline — Geometry Studio", "digital", "本地优先的几何 Logo 设计器，将约束构造与可撤销的光学校正分别保存，提供图层、布尔操作、三种视图、诊断和 SVG／PNG／工程导出。", ["logo-geometry-studio/README.md", "logo-geometry-studio/docs/verification.md", "logo-geometry-studio/THIRD_PARTY_NOTICES.md"], "几何设计工具的产品与交互实现；原始资料未逐项拆分个人与 AI 贡献。", ["几何诊断不是审美评分，也不能替代设计判断。", "第一版不包含字标、云同步、多人协作与任意 SVG 往返编辑。", "未发现独立 Git 远端，不编造在线地址。"], "本地实现与已保存验收记录", form_assets, aliases=["logo-geometry-studio", "luck-power/logo-geometry-studio"], attribution="PlaneGCS（LGPL-2.1）与其余依赖许可见私档 THIRD_PARTY_NOTICES.md。"))

resume_assets = digital_assets("resume-formatter", [
    ("resume-formatter/output/xiaohongshu-v2.4.0/raw/03-workspace-ui.png", "workspace", "简历母版、岗位版本与事实证据工作区", "screenshot", "使用仓库声明的虚构 fixture，画面不代表孙英杰的个人履历。"),
    ("resume-formatter/output/xiaohongshu-v2.4.0/raw/04-ai-diff-ui.png", "rewrite-diff", "AI 改写先展示差异，再由用户应用", "screenshot", "虚构样例；不把其中数字作为真实业绩。"),
    ("resume-formatter/output/xiaohongshu-v2.4.0/raw/05-layout-ui.png", "layout-controls", "模板选择与精确排版控制", "screenshot", "v2.4.0 保存的展示素材。"),
])
candidates.append(project("resume-formatter", "Resume Formatter 简历编辑器", "Resume Formatter", "digital", "在开源简历排版工具基础上扩展本地优先工作区，管理母版、岗位版本、事实证据、模板排版和可审阅的 AI 修改；支持独立 HTML 与 PDF 打印流程。", ["resume-formatter/README.md", "resume-formatter/LICENSE", "resume-formatter/THIRD_PARTY_NOTICES.md"], "基于开源项目的二次设计与开发；不宣称从零原创完整项目。", ["上游为 gracexygu/resume-formatter，GitHub API 已确认 Fork 关系。", "截图中的人物、岗位、履历与成效为虚构测试资料。", "规则检查不代表真实 ATS 通过率或招聘结果。"], "v2.4.0 Fork；公开源码与 Pages", resume_assets, [live_link("resume-formatter"), repo_link("resume-formatter"), {"label": "上游项目", "url": "https://github.com/gracexygu/resume-formatter", "verified": True, "method": "GitHub fork.parent", "public": True}], attribution="基于 gracexygu/resume-formatter 二次开发；上游与本 Fork 均采用 MIT License。此署名应在公开案例保留。"))

archive_assets = digital_assets("visual-archive", [
    ("visual-archive-extension/output/playwright/analysis-chinese-desktop.png", "analysis-desktop", "视觉档案：本地尺寸与色板测量、待生成档案状态", "screenshot", "画面中模型档案尚未生成；截图证明本地测量与空状态界面，不证明模型分析精度。"),
    ("visual-archive-extension/output/playwright/analysis-chinese-mobile.png", "analysis-mobile", "视觉档案移动端：本地测量与待生成档案状态", "screenshot", "截图中模型档案尚未生成；结构化档案不是原始制作元数据。"),
])
candidates.append(project("visual-archive", "视觉档案", "Visual Archive", "digital", "将网页图片或本地文件整理为带来源与证据边界的视觉档案，区分本地尺寸与色板测量、模型观察、推断、未知项及复现计划。", ["visual-archive-extension/README.md", "visual-archive-extension/manifest.json"], "浏览器扩展原型与交互实现；具体个人与 AI 分工未完整标注。", ["单张图无法确定隐藏几何、精确材料、相机标定、源文件或原始提示词。", "未发现公开仓库或正式扩展商店链接。", "这是独立早期原型，不重复计作砚台当前功能。"], "本地 v0.1.0 扩展原型与截图", archive_assets, aliases=["visual-archive-extension"]))

atlas_assets = digital_assets("aesthetic-atlas", [
    ("eagle-aesthetic-atlas/artifacts/cards/bauhaus-product--dna.png", "bauhaus-product-dna", "审美图谱：包豪斯产品风格 DNA 学习卡", "study-card", "这是本项目生成的学习卡版式与示意图，不是历史作品原作，也不是历史权威结论。"),
    ("eagle-aesthetic-atlas/artifacts/cards/bauhaus-product--transfer.png", "bauhaus-product-transfer", "审美图谱：包豪斯产品风格迁移方法卡", "study-card", "策展分类、锚点选择和迁移建议属于判断；没有公开转存机构艺术品图像。"),
])
atlas_data = json.loads((BASE / "eagle-aesthetic-atlas/artifacts/eagle-import-manifest.json").read_text(encoding="utf-8-sig"))
atlas_summary = {"sourcePath": str(BASE / "eagle-aesthetic-atlas/artifacts/eagle-import-manifest.json"), "sha256": sha(BASE / "eagle-aesthetic-atlas/artifacts/eagle-import-manifest.json"), "generatedAt": atlas_data["generatedAt"], "mode": atlas_data["mode"], "audit": atlas_data["audit"], "note": "保存的 dry-run 清单；不能证明实际 Eagle 导入或独立逐条学术核验。"}
(PRIVATE / "atlas-manifest-summary.json").write_text(json.dumps(atlas_summary, ensure_ascii=False, indent=2), encoding="utf-8")
candidates.append(project("aesthetic-atlas", "Eagle 审美图谱", "Eagle Aesthetic Atlas", "digital", "将设计风格、来源记录、双语学习卡与 Eagle 导入清单串联为可追溯的视觉研究资料系统，并明确区分机构事实、分类推断和策展判断。", ["eagle-aesthetic-atlas/README.md", "eagle-aesthetic-atlas/artifacts/eagle-import-manifest.json", "visual-lens/packages/aesthetic-atlas/README.md"], "视觉研究资料系统、学习卡与归档工具；机构作品作者权利不归本项目。", ["独立目录与 AJNB 内 packages/aesthetic-atlas 是同一图谱项目，不重复计数。", "清单为 dry-run，不能单凭它声称已经导入 Eagle 图库。", "源文档与已读清单记录 144 个风格、2500 个来源书签和 288 张学习卡；数量不代表人工逐条核实或用户规模。", "参考机构作品图片、草稿目录与词汇种子项目未作为原创作品公开展示。"], "既有资料包、学习卡与导入清单", atlas_assets, [repo_link("AJNB", "整合后的私有工作区", False)], aliases=["eagle-aesthetic-atlas", "visual-lens/packages/aesthetic-atlas"], attribution="机构原作保留各自作者及权利；joeseesun/learnui 与 alexiseverage/aesthetic-frontend-skills 仅为词汇种子来源。"))

candidates.append(project("xhs-operations-os", "小红书内容运营工作台", "XHS Operations OS", "digital", "面向已核实产品资料到可审阅内容包的运营工具规划，现有资料包括产品需求、工作流、数据与架构规范，以及工作区配置。", ["xhs-operations-os/README.md", "xhs-operations-os/SPEC_MANIFEST.json", "xhs-operations-os/docs/MASTER_PRD.md", "xhs-operations-os/docs/ROADMAP.md"], "产品与系统规划候选；完整界面和端到端实现尚未从现有材料建立。", ["未找到现有界面截图；本次不创建伪界面作为完成证明。", "路线图是计划，不能改写成已完成的内容生成、审核、发布或业务分析功能。", "当前仓库为私有，缺少可供公开访客体验的链接。"], "规划与早期工作区配置；暂不进入公开作品卡片", [], [repo_link("xhs-operations-os", "私有项目资料", False)]))

experiment_assets = digital_assets("image-2-5-xhs", [
    ("image-2-5-xhs/publish/cards/01.png", "evaluation-cover", "图像生成与连续编辑测试：研究图文封面", "research-card", "虚构品牌 AI 生成测试。页面中的 Image 2.5 为原测试记录网页标签，API 子型号未核实。"),
    ("image-2-5-xhs/publish/cards/04.png", "product-consistency", "同一虚构包装的参考与生成结果比较", "research-card", "示例为 AI 生成，不是商品摄影；图卡来源映射保存在原项目中。"),
    ("image-2-5-xhs/publish/cards/09.png", "evaluation-boundaries", "可用性判定与小样本结论边界", "research-card", "单人、单一虚构品牌、无竞品或人工基线；不推广为普遍成功率或效率提升。"),
])
candidates.append(project("image-2-5-xhs", "图像生成与连续编辑评测", "Image Generation & Editing Study", "experiment", "围绕虚构包装、海报、草图和连续编辑任务保存提示词、原图、逐张验收与来源记录，并将可用性判断整理为九张研究图文。", ["image-2-5-xhs/README.md", "image-2-5-xhs/STATUS.md", "image-2-5-xhs/tests/evaluation.json", "image-2-5-xhs/publish/image-provenance.json"], "测试任务设计、人工目视评估与研究图文整理；画面包含 AI 生成内容。", ["Image 2.5 仅沿用原始网页记录的名称；本次未独立确认 API 子型号。", "9/9 指指定修改执行完成，不等于 9/9 可直接使用。", "没有旧版、竞品或人工基线，不能推导节省返工比例或工时。", "原项目明确没有操作小红书发布。"], "2026-09-09 已保存研究素材包；未发布", experiment_assets))

download_manifest = json.loads((PRIVATE / "github-download-manifest.json").read_text(encoding="utf-8"))
hash_groups = {}
for entry in download_manifest["files"]:
    h = sha(Path(entry["privatePath"]))
    hash_groups.setdefault(h, []).append(entry["sourcePath"])
duplicates = [{"sha256": h, "sourcePaths": paths} for h, paths in hash_groups.items() if len(paths) > 1]

inventory = {"schemaVersion": 1, "assembledAt": STAMP, "scope": "品牌与本地数字项目素材；由父任务决定最终网站编排", "sourceRepository": "AJ-nb/AJNB", "sourceTreeSha": download_manifest["treeSha"], "candidateCount": len(candidates), "displayEligibleCount": sum(c["displayEligible"] for c in candidates), "publicAssetCount": len(asset_manifest), "candidates": candidates, "repositorySnapshots": repo_snapshots, "deduplication": {"projectRules": ["Songnasty 合并为夜礼司历史阶段", "luck-power、luck-power-xhs-v063 与 visual-lens 归为砚台演化线", "logo-geometry-studio 独立目录与 luck-power 内复制不重复计数", "eagle-aesthetic-atlas 与 visual-lens/packages/aesthetic-atlas 不重复计数", "lensflow worktrees、planning-seed 与输出构建不另算项目", "各 .output、dist、页面构建、视口副本不另算作品"], "identicalBrandSources": duplicates}, "excludedPublicMaterials": [{"path": "夜礼司/01_Logo 设计/assets/history/历史_Songnasty设计来源.png", "reason": "历史字形参考拼贴；保留私档，不作为独立原创交付"}, {"path": "夜礼司/02_产品设计/蛇形口咬道具_绒花蝴蝶磁吸配件/assets/蓝色闪蝶形态参考图.png", "reason": "纯形态参考；作者与授权未核实"}, {"path": "夜礼司/02_产品设计/蛇形口咬道具_绒花蝴蝶磁吸配件/assets/蓝色闪蝶尺寸图.png", "reason": "参考图的尺寸标注衍生；作者与制作边界未核实"}, {"path": "夜礼司/02_产品设计/蛇形口咬道具_绒花蝴蝶磁吸配件/assets/蛇造型尺寸图.png", "reason": "文件名与实际人像佩戴示意不一致；人物图像来源与授权未核实"}, {"path": "eagle-aesthetic-atlas/artifacts/references", "reason": "机构及第三方作品；不作为用户原创成果搬入公开图库"}, {"path": "lensflow/docs/design/assets", "reason": "设计探索参考画面，已有真实运行截图优先"}], "verification": {"brandDownloads": "已按 Git blob 下载 30 个文件并保存树 SHA 和逐文件来源", "visualReview": "全部选定素材已经逐图或带文件索引的联系表目视核对", "runtimeTests": "本子任务仅归档、查证和格式转换，未重新运行各工具项目测试", "publicLinkChecks": "Lensflow 与 Resume Formatter Pages 已读取到 HTTP 200；仓库公开状态和 Fork 关系由 GitHub API 核实"}}

for name, data in [("inventory.json", inventory), ("public-assets-manifest.json", asset_manifest), ("local-evidence-manifest.json", evidence_manifest)]:
    (PRIVATE / name).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

rows = ["| 候选 | 类别 | 已确认范围 | 公开素材 |", "|---|---|---|---|"]
for c in candidates:
    rows.append(f"| {c['titleZh']} | {c['category']} | {c['status']} | {len(c['assets'])} 张/份 |")
doc = """# 品牌与数字作品素材盘点

核对日期：2026-09-15。原始资料依据 AJ-nb/AJNB 私有仓库与用户本地项目；没有修改源项目、推送、部署或发布操作。

共整理 **10 个候选**，其中 **9 个已有展示素材**；公开素材共 **22 份，约 1.28 MB**。Periastra 与夜礼司为 2 个品牌项目；砚台的旧版与当前版合为一条演化线。XHS Operations OS 仅保留规划候选。

""" + "\n".join(rows) + """

## 素材与出处

- 两个品牌目录共 30 个原文件已完整保存到 `private/sources/brand-digital/github/AJ-nb/AJNB/`。树 SHA、blob SHA 与原路径见 `github-download-manifest.json`。
- 机器可读候选、公开路径、图注、角色边界、来源与链接见 `private/sources/brand-digital/inventory.json`。
- 网页素材位于 `web/public/works/brand/` 与 `web/public/works/digital/`。每份素材的源哈希、输出哈希、尺寸和处理方式见 `public-assets-manifest.json`。
- 本地 README、所用截图、许可证及相关文档原件保存于 `private/sources/brand-digital/local/`；对应表见 `local-evidence-manifest.json`。
- 图片只作等比缩放与 WebP 转换，没有重绘、修图或改写截图数据。Periastra 结构 SVG 内嵌了其 Logo 副本以保留网页显示。

## 必须保留的事实边界

1. **Resume Formatter** 是 `gracexygu/resume-formatter` 的 MIT Fork。公开案例应写“基于开源项目二次开发”，保留上游链接；截图中的人物与履历为虚构 fixture。
2. **砚台**：luck-power v0.6.3 是前身，AJNB / visual-lens v0.7.5 是当前演化。当前已删除旧工作台、OCR、图片编辑、三视图与重建功能，不能叠加写入现行介绍。选中截图带有“预览夹具 · study”标识。
3. **夜礼司** 为现行名称，Songnasty 只作早期过程。Logo 矢量精修和实体工艺测试仍列为后续任务。产品图是概念研究，无材料、磁吸和人体工学验证。
4. 夜礼司原文件 `assets/佩戴效果图.png` 实际显示蛇形部件尺寸，`assets/蛇造型尺寸图.png` 实际显示人像佩戴示意。原件未改名；公开副本按实际内容命名。人像与纯蝴蝶参考均未公开。
5. **Periastra** 现有证据是 Logo 与应用研究；小尺寸、金属、织唛与压印是拟验证场景，不能写成已投产产品。
6. **审美图谱** 的机构作品不属于用户原创。只选本项目学习卡；144 风格、2500 来源书签、288 学习卡可由已读 dry-run 清单交叉核实，不代表实际导入完成、人工逐条核验或用户规模。
7. **图像评测** 使用 AI 生成的虚构品牌测试。9/9 是指定编辑动作完成数，并非直接可用率；无竞品或人工基线，不能推导效率提升。原项目明确未发布到小红书。
8. **XHS Operations OS** 未发现已有截图，现有可确认资料为规范与工作区配置；路线图不能改写为已实现产品功能。
9. **视觉档案** 现有截图显示本地尺寸与色板测量，但模型档案尚未生成。可以展示原型工作流，不能用截图声称真实模型分析已验证。

## 链接检查

Lensflow 与 Resume Formatter 的 GitHub Pages 均读取到 HTTP 200。lensflow、luck-power、resume-formatter 为公开仓库；AJNB 与 xhs-operations-os 为私有仓库。公开页面不应向普通访客承诺私有仓库可以直接下载。其他项目未找到已验证的公开链接。

## 去重与验证

工作树、构建目录、旧发布副本和嵌套项目复制不另计作品。品牌原件存在内容完全相同的重复图，已保存哈希分组；公开图库只保留有独立叙事价值的版本。素材均经过目视核对与文件可读取检查；本次未重新运行各软件项目的功能测试。
"""
(ROOT / "docs/brand-digital-inventory.md").write_text(doc, encoding="utf-8")

for c in candidates:
    for a in c["assets"]:
        p = ROOT / "web/public" / a["publicPath"].lstrip("/")
        assert p.is_file()
        assert sha(p) == a["outputSha256"]
        if p.suffix == ".webp":
            with Image.open(p) as im:
                im.verify()
assert len({c["id"] for c in candidates}) == len(candidates)
assert len({a["publicPath"] for a in asset_manifest}) == len(asset_manifest)
print(json.dumps({"candidateCount": len(candidates), "displayEligibleCount": sum(c["displayEligible"] for c in candidates), "publicAssetCount": len(asset_manifest), "publicAssetBytes": sum(a["bytes"] for a in asset_manifest), "localEvidenceFiles": len(evidence_manifest), "brandRawFiles": len(download_manifest["files"]), "brandDuplicateGroups": len(duplicates)}, ensure_ascii=False))
