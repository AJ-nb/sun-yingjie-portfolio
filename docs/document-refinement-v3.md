# 作品集与简历第三版文档交付

本轮将精选阅读与完整归档分开。网站原有的 `sun-yingjie-selected-portfolio.pdf` 文件名现在对应真正的 28 页精选版，完整 33 案例作品集通过独立下载入口提供。职业事实读取 `web/src/data/profile.json`，案例说明读取网站中文 Markdown；未增加工作经历、个人主导、商业效果或实体测试结果。

## 交付文件

| 文件 | 用途 | 页数 |
|---|---|---:|
| `web/public/downloads/sun-yingjie-selected-portfolio.pdf` | 八个重点案例的项目、设计选择与成果说明 | 28 |
| `web/public/downloads/sun-yingjie-full-portfolio.pdf` | 六章、33 个案例和原始图集选页 | 116 |
| `web/public/downloads/sun-yingjie-resume.pdf` | 一页 A4 简历 | 1 |
| `web/public/downloads/sun-yingjie-resume.docx` | 可编辑 Word 简历 | 1 |

高质量作品集母版保存在 `deliverables/portfolio/`，网页版本另存为文件名带 `-web` 的 PDF。两种作品集的压缩只处理嵌入位图；文字、页面结构、书签、链接和内容流保持一致。各文件的最终大小与 SHA-256 以 `deliverables/document-verification.json` 为准。

原始素材未被修改。旧版本仍由仓库历史保留，新导出可以从当前源码和素材重新生成。此处的 Word 简历由独立文档生成器制作，不代表 Resume Formatter 产品新增了 DOCX 导出功能。

## 内容与排版

- 精选版采用暖浅色页面、深墨色个人页与封底、鼠尾草绿编号，形成封面—目录—个人实践—八个案例各三页—联系的 28 页结构。
- 三页案例分别回答项目与个人参与、三个有材料依据的设计判断、当前成果与下一步。团队署名、概念阶段、截图版本、尚未验证的工艺和功能保持明确。
- 插图按原比例容纳，保留原稿可见内容；精选版优先采用形态、部件和关键界面，长图集留给完整版与在线案例。原图中的文字仍是位图，正文和重新排版的说明可搜索。
- 中文标题避免项目名称的孤字换行；正文控制行宽，避免句末标点落在新行开头。目录与“阅读完整案例”具有真实 PDF 链接。
- 简历使用可编辑段落与 Word Title、Heading 1 样式，保持现有任职单位、角色和日期。重点项目改为镜序与 Resume Formatter、Periastra、引渡者与 HUHU CARE，说明参与内容和成果边界。

## 再生成

使用具有 `reportlab`、`Pillow`、`pypdf`、`python-docx` 的 Python 环境。SVG 说明图需要 Node.js 与 `sharp`。本轮使用 Codex 配套依赖；机器路径不写入生成器。

```text
python scripts/build_selected_portfolio.py
python scripts/build_portfolio.py
python scripts/resume/build_resume.py
powershell -File scripts/resume/export_word.ps1
python scripts/resume/verify_exports.py
```

字体可由 `PORTFOLIO_FONT` 和 `PORTFOLIO_BOLD_FONT` 指定为支持中文的 TrueType 字体。SVG 渲染默认识别当前用户的 Codex 依赖位置，也接受 `NODE_BINARY` 和 `NODE_PATH`。源码中的其他历史制作脚本不在这次可移植性修订范围内。

简历 PDF 使用 Windows 上的 Microsoft Word 原生固定格式导出，导出时强制检查一页。若 Word 未安装，DOCX 仍可生成，但该命令不会声称已完成 PDF 或版面验证。

## 验证记录

- 两个作品集 PDF 与一页简历均完成页面渲染。精选版逐页检查，全版检查全部 116 页总览并放大检查密集文字页；未发现页面空白、排版溢出、文字重叠或缺字。原始图像内部已有的构图裁切和小号文字不被误判为新排版缺陷。
- DOCX 首先调用技能随附的 `render_docx.py`，日志确认当前 Windows 配套环境没有 `soffice.exe`。随后沿用仓库的 Microsoft Word 原生导出路径，实际导出一页并检查 1800 px 页面图。未用自行绘制的 PDF 替代 Word 版面验证。
- Word 可访问性检查为 0 个高风险、0 个中风险问题；1 个低风险提示为作品集网址直接作为链接文字。为保证打印简历也保留可辨识网址，保留该写法。
- `scripts/resume/verify_exports.py` 完成 37 项检查：页数、案例数量、中文可搜索性、无泄漏 Markdown、正文事实、源文件哈希、原始媒体哈希、网页副本哈希、压缩结构、可编辑段落、A4 和一页要求均通过。
- 所有本轮文档下载文件均为实际文件，未保留为 LFS 指针。精选与完整网页 PDF 分别低于 20 MiB。

本地视觉检查图位于 `deliverables/portfolio/qa/` 与 `deliverables/resume/qa/`，属于被忽略的检查中间件，不作为网站发布资源。网站链接的登录要求与线上可访问性由网站最终验收单独检查，文档构建不把 URL 存在视为访问验证。
