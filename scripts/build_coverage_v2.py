"""Combine preserved source snapshots with the current selected build; no large originals are reread."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(__file__).resolve().parents[1]
PRIVATE = ROOT / 'private/sources'
HISTORY = PRIVATE / 'history/refinement-r1'
HISTORY.mkdir(parents=True, exist_ok=True)
historical = HISTORY / 'coverage.json'
if not historical.exists():
    historical.write_bytes((PRIVATE / 'coverage.json').read_bytes())
for name in ['source-coverage.md', 'DELIVERY.md', 'browser-qa.md', 'clean-checkout-verification.json', 'remote-delivery-verification.json']:
    archived = HISTORY / name
    if not archived.exists():
        archived.write_bytes((ROOT / 'docs' / name).read_bytes())

def record(path):
    data = path.read_bytes()
    return {'path': path.relative_to(ROOT).as_posix(), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}

def field(text, key):
    match = re.search(r'^' + re.escape(key) + r':\s*(.*)$', text, re.M)
    return match.group(1).strip().strip('"') if match else ''

old = json.loads(historical.read_text(encoding='utf-8-sig'))
chapters = (ROOT / 'web/src/data/chapters.ts').read_text(encoding='utf-8')
sequence_text = chapters.split('const sequence:')[1].split('// Dates')[0]
sequence = {key: re.findall(r"'([^']+)'", items) for key, items in re.findall(r'(\w+):\s*\[([^]]*)\]', sequence_text)}
chapter_names = {'windows': '商业橱窗', 'lighting': '铝型材灯具', 'products': '产品设计与模型', 'rendering': '三维渲染实践', 'brands': '品牌孵化', 'ai': 'AI 与数字产品'}
cases = []
errors = []
for chapter, slugs in sequence.items():
    for order, slug in enumerate(slugs):
        paths = [ROOT / f'web/src/content/works/{slug}.{lang}.md' for lang in ['zh', 'en']]
        if not all(path.exists() for path in paths):
            errors.append(f'Missing bilingual case: {slug}')
            continue
        texts = [path.read_text(encoding='utf-8-sig') for path in paths]
        refs = []
        for text in texts:
            refs.append(set(re.findall(r'!\[[^\]]*\]\((/[^\s)]+)', text)) | set(re.findall(r'(?:src|poster)="(/[^\"]+)"', text)) | {field(text, 'cover')})
        if refs[0] != refs[1]:
            errors.append(f'Media differs between languages: {slug}')
        cases.append({'id': slug, 'chapter': chapter, 'order': order, 'titleZh': field(texts[0], 'title'), 'roleZh': field(texts[0], 'role'), 'creditsZh': field(texts[0], 'credits'), 'statusZh': field(texts[0], 'status'), 'files': [record(path) for path in paths], 'media': sorted(refs[0])})

media = json.loads((ROOT / 'web/dist/media-index.json').read_text(encoding='utf-8'))
for item in media:
    path = item['path'].lstrip('/')
    source = ROOT / 'web/public' / path
    built = ROOT / 'web/dist' / path
    if not source.is_file() or not built.is_file() or source.read_bytes() != built.read_bytes():
        errors.append(f'Build differs from source: {path}')
selected = {item['path'] for item in media}
expected_files = {item['path'].lstrip('/') for item in media} | {'index.html', 'media-index.json'}
expected_files.update(path.relative_to(ROOT / 'web/dist').as_posix() for path in (ROOT / 'web/dist/assets').rglob('*') if path.is_file())
actual_files = {path.relative_to(ROOT / 'web/dist').as_posix() for path in (ROOT / 'web/dist').rglob('*') if path.is_file()}
if actual_files != expected_files:
    errors.append(f'Build file set differs from selected assets: {sorted(actual_files ^ expected_files)}')
for case in cases:
    for path in case['media']:
        if path not in selected:
            errors.append(f'Case media not in build: {case["id"]} {path}')

manifests = []
for directory in ['refinement-v2', 'refinement-digital']:
    for path in sorted((PRIVATE / directory).glob('*.json')):
        manifests.append(record(path))
deliverables = [record(ROOT / path) for path in ['deliverables/portfolio/sun-yingjie-portfolio.pdf', 'deliverables/portfolio/sun-yingjie-portfolio-web.pdf', 'deliverables/resume/sun-yingjie-resume.pdf', 'deliverables/resume/sun-yingjie-resume.docx', 'avatar/sun-yingjie-avatar-draft-v3.blend', 'web/public/models/avatar.glb'] if (ROOT / path).exists()]
report = {
    'schemaVersion': 2,
    'generatedAt': datetime.now(timezone.utc).isoformat(),
    'scope': 'Second-round selected website, bilingual cases and deliverables. Historical originals retain their earlier verification date; no claim to have reread all large archives.',
    'historicalSourceSnapshot': {**record(historical), 'verifiedAt': old.get('historicalSourceVerifiedAt', old.get('generatedAt')), 'sourceRecordCount': len(old['sources']), 'unchangedHistoricalSources': old['sources']},
    'currentSourceOverrides': [
        {'source': 'XHS Operations OS', 'case': 'xhs-methods', 'disposition': 'method-research', 'note': 'Included as a methods study; implemented foundation and planned features remain distinct.'},
        {'source': 'Large model archives', 'cases': ['plumber', 'huhu-care'], 'disposition': 'targeted-working-set-and-selected-original-renders', 'evidence': 'private/sources/refinement-v2/model-extraction-manifest.json'},
        {'source': 'Two PSDs', 'cases': ['lingmu', 'jimu-studio'], 'disposition': 'native-layer-review-and-selected-exports', 'evidence': 'private/sources/refinement-v2/'},
        {'source': 'Static rendering PDF', 'disposition': '43-unique-embedded-images-reviewed', 'evidence': 'private/sources/refinement-v2/pdf-case-mapping.json'},
    ],
    'refinementEvidence': manifests,
    'cases': cases,
    'publication': {'snapshot': 'local-validated-build-only', 'assets': media, 'assetCount': len(media), 'bytes': sum(item['bytes'] for item in media)},
    'deliverables': deliverables,
    'issues': errors,
    'limitations': ['Remote publication is verified separately.', 'Avatar likeness is a separate user decision.', 'HUHU OBJ was imported and reopened in Blender with matching geometry counts. C4D 2026 could not run the scene script because the installed license was unavailable; C4D geometry and texture resolution remain unverified.', 'No image2.5 generation was performed in this round: the requested browser operation was stopped by automatic safety review.'],
}
(PRIVATE / 'coverage.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
lines = [
    '# 第二轮素材覆盖报告', '',
    f'本地构建快照：{report["generatedAt"]}。当前 {len(cases)} 个案例、{len(cases) * 2} 份双语正文，按六章排序。选入构建 {len(media)} 项资产，共 {report["publication"]["bytes"]:,} 字节。此统计不代表已完成远端发布。', '',
    '历史 159 条来源及其原件校验快照完整保存在 `private/sources/history/refinement-r1/coverage.json`。本轮沿用该历史校验，不重新宣称读取了约 23.3 GB 的大型原件。旧报告中的 30 案例、40 页和仅本人预览均属于第一轮状态。', '',
    '## 本轮来源与去向', '',
    '| 来源 | 当前处理 | 逐项记录 |', '|---|---|---|',
    '| 旧站 32 项资源 | 30 张作品图继续在案例展示；头像与PDF保留历史来源 | 历史快照及内容校验 |',
    '| 管道机器人、HUHU CARE模型包 | 定向提取、原始渲染选片；实际几何检查单独留证 | refinement-v2/model-extraction-manifest.json、published-model-media.json |',
    '| 渲染PDF | 44次图像引用、43张唯一图像；37张可用分图回填案例，7次引用归档/排除 | refinement-v2/pdf-embedded-index.json、pdf-case-mapping.json |',
    '| 两份PSD | Photoshop原生分层核对，合成与独立内容选用；保留团队署名 | refinement-v2/ 下 layers / exports / published-psd 清单 |',
    '| 品牌与数字项目 | 彼源公开页面、原项目证据、薪跳原生界面；XHS按方法研究新增 | refinement-digital/verification.json |',
    '| 人物工程 | 原创几何、独立眼球、350帧镜头；相似度单独审阅 | avatar/README.md、avatar/evidence/ |',
    '| 生图优化 | 已写三套结构锁定提示词；指定浏览器操作被自动校验终止，未生成新图 | prompts/refinement-v2/product-presentation.md |', '',
    '模型既有渲染、新模型视角与AI辅助图按来源区分。HUHU OBJ已实际导入并重开，40个网格、903,562顶点、680,711面与原始计数一致，原件哈希未变；尺寸单位未确定。C4D 2026因本机许可不可用而未能执行模型脚本，管道C4D几何与贴图解析不能标为已验证。没有通过生图补造产品内部结构、量产或测试成果。约21.7GiB历史工程原件保留本地；公开构建不含私人档案、提示词或Blender原件。', '',
    '## 完整案例', '', '| 章节 | 案例 | 引用媒体数 |', '|---|---|---|',
]
for case in cases:
    lines.append(f'| {chapter_names[case["chapter"]]} | {case["titleZh"]} | {len(case["media"])} |')
lines += ['', '## 检查范围', '', f'当前正文与构建一致性问题数：{len(errors)}。机器清单：`private/sources/coverage.json`；本轮证据清单均记录文件摘要。新增素材计入本轮证据，不混入历史159条原件统计。', '', '检查范围为已发现并登记的资料。未知项目日期不由文件修改时间推断；模型能打开不等于功能验证，文件哈希一致不等于原创权利认证。合作署名、衍生开发及方法研究阶段以案例正文为准。数字工具未被包装成自研浏览器或已上线商业产品。', '']
(ROOT / 'docs/source-coverage.md').write_text('\n'.join(lines), encoding='utf-8')
print(json.dumps({'cases': len(cases), 'selectedAssets': len(media), 'evidenceManifests': len(manifests), 'errors': errors}, ensure_ascii=False))
if errors:
    raise SystemExit(1)
