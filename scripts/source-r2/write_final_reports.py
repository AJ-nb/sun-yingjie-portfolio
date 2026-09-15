from pathlib import Path
from datetime import datetime,timezone
import json,hashlib,collections
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[2]
folder=ROOT/'private/sources/refinement-v2'
qa=json.loads((folder/'portfolio-qa.json').read_text(encoding='utf-8'))
manifest=json.loads((ROOT/'private/sources/download-manifest.json').read_text(encoding='utf-8'))
pdf=ROOT/'deliverables/portfolio/sun-yingjie-portfolio.pdf'
reader=PdfReader(pdf)
def outline_count(items):return sum(outline_count(x) if isinstance(x,list) else 1 for x in items)
meta={'verifiedAt':datetime.now(timezone.utc).isoformat(),'file':str(pdf.relative_to(ROOT)).replace('\\','/'),'publicPath':manifest['publicPath'],'bytes':pdf.stat().st_size,'sha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'pageCount':len(reader.pages),'pageSizePoints':[float(reader.pages[0].mediabox.width),float(reader.pages[0].mediabox.height)],'pdfMetadata':{str(k):str(v) for k,v in reader.metadata.items()},'outlineEntries':outline_count(reader.outline),'pageKinds':dict(collections.Counter(p['kind'] for p in manifest['pages'])),'caseCount':manifest['caseCount'],'linkKinds':dict(collections.Counter(p['kind'] for p in qa['links'])),'allPagesRendered':len(qa['renderedPages']),'visualReviewStatus':qa['visualReview']['status'],'caseFieldsVerified':['title','summary','role','status','credits'],'profileSource':'web/src/data/profile.json','chapterSource':'web/src/data/chapters.ts','manifest':'private/sources/download-manifest.json','qaReport':'private/sources/refinement-v2/portfolio-qa.json'}
(folder/'portfolio-metadata.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2),encoding='utf-8')
doc=ROOT/'docs/portfolio-qa.md'
history=ROOT/'private/sources/history/portfolio-qa-first-edition.md'
history.parent.mkdir(exist_ok=True)
if not history.exists():history.write_text(doc.read_text(encoding='utf-8'),encoding='utf-8')
doc.write_text(f'''# 作品集 PDF 质检记录 · 第二版

核对时间：{meta['verifiedAt']}。最终 116 页已逐页渲染并完成视觉复核。本记录替代旧 40 页报告；旧报告保存在 `private/sources/history/portfolio-qa-first-edition.md`。

| 项目 | 核对结果 |
| --- | --- |
| 交付文件 | `deliverables/portfolio/sun-yingjie-portfolio.pdf` |
| 公开下载副本 | `web/public/downloads/sun-yingjie-selected-portfolio.pdf`，与交付文件哈希相同 |
| SHA-256 | `{meta['sha256']}` |
| 字节数 | {meta['bytes']:,} |
| 页面 | 116 页，960 × 600 pt 横版 |
| 结构 | 封面、目录、个人实践、6 章分隔、33 案例介绍、73 详情页、联系页 |
| 目录内链 | 33/33，目标页逐项匹配案例介绍页 |
| 书签 | {meta['outlineEntries']}，含 6 章与 33 案例 |
| PDF 链接注释 | {len(qa['links'])}，含目录往返、固定网站案例与联系方式 |
| 文字比对 | 33 案例的标题、摘要、职责、阶段与署名均与中文 Markdown 一致；仅忽略排版空白、中点和撇号规范化 |
| 共享资料 | 履历及联系方式来自 `web/src/data/profile.json`；章节及顺序来自 `web/src/data/chapters.ts` |
| 全页渲染 | Poppler 输出 116 张 1440 × 900 PNG，无渲染失败 |
| 视觉复核 | 116/116 页，未发现缺图、正文截断、字形方框、图注和页脚碰撞 |

## 预览与复核记录

- 逐页预览：`deliverables/portfolio/qa/refinement-v2/pages/page-001.png` 至 `page-116.png`。
- 四页联系表：`deliverables/portfolio/qa/refinement-v2/sheets/sheet-01.jpg` 至 `sheet-29.jpg`。
- 结构、链接和视觉复核：`private/sources/refinement-v2/portfolio-qa.json`。
- 当前元数据快照：`private/sources/refinement-v2/portfolio-metadata.json`。
- 最终分页计划：`private/sources/refinement-v2/portfolio-page-plan.json`，116 页。
- 首轮已经通过的页面通过排除页脚后的内容像素哈希关联到修订版；变动页面重新查看。数字代理独立复核最终 81–116 页，并放大核对 98、101、102、113 页，见最终 QA 记录。
- 最后两处文案精修后，全部页面重新渲染并对比：只有封面与第 101 页变化，其余 114 页 PNG 字节相同。两张变化页均重新放大复核通过，详见 `portfolio-final-refinement-check.json`。

## 已修正的问题

- 横向展板不再被放入竖图三栏，关键场景和草图按整页展示。
- LINGMU 与 JiMu 介绍页使用真实产品视觉；原生扉页、研究、草图、CMF 与细节作为过程页保留。
- Periastra 说明图内嵌 WebP 在栅格化副本中转换为 PNG，中央标志和应用图恢复；原 SVG 不变。
- 砚台长截图按原始像素区域分成图像入口、手法拆解、迁移归档三页，保留演示夹具说明，未重绘界面。
- 薪跳保留默认演示薪资、工时参数、非个人收入声明，以及深色选项保存后仍显示浅色的真实限制。
- 图像实验保留 18 张中 10 张直接可用、8 张需修正的单人目视记录；P2 标题层级、S3 留白及连续编辑纹理漂移均在详情中呈现。

## 来源和解释边界

22 张模型项目图片是归档内既有渲染；17 张 PSD 选图来自 Photoshop 26.9.0 实际导出的原生版块及独立图层；渲染 PDF 的高清分图来自原作品集内嵌图像。本轮没有用 AI 图片替换这些素材，也没有把既有渲染说成新渲染。两份 PSD 的原件哈希、字节数和修改时间均未变化。

合作项目和原展板署名保留，概念研究不等于已验证的工程、临床或制造结果。砚台与部分数字界面使用明确标注的演示夹具；薪跳截图来自微信开发者工具。原展板中的小字、研究数据和概念参数没有在排版质检中重新验证；读者可放大 PDF 或访问在线原图。

链接检查验证的是 PDF 内部目标及固定案例 URL；它不代替网站部署、远端可达性或网站交互测试。此册覆盖全部 33 案例，但不等于全部原始工程、网站图库和视频的离线归档。
''',encoding='utf-8')
print(json.dumps({'metadata':str(folder/'portfolio-metadata.json'),'qaDoc':str(doc),'pages':len(reader.pages)},ensure_ascii=False))
