# 简历交付说明

最终文件：`deliverables/resume/sun-yingjie-resume.docx` 与 `deliverables/resume/sun-yingjie-resume.pdf`。中文单页 A4；正文 10 pt 微软雅黑、15.5 pt 行距，黑色标题、炭灰正文和低饱和鼠尾草绿辅助信息。采用可编辑正文与右对齐制表位，没有图片化正文、技能进度条或生成肖像。

## 事实取舍

- 教育和联系方式依据 `docs/profile-evidence.md` 与原始图像简历，BENWU 日期为 2025.03–2025.12。
- 湖南欧音起始日期存在冲突，使用共同交集年份 2025；公司全名和设计师助理职称来自原始简历。
- 欧音职责仅保留原始简历中的调研、反馈整理、Figma 原型和体验流程，不保留未进一步补证的数量、提升比例、主导或获奖措辞。
- BENWU 职责依据 Hermès、Arc’teryx、灯具中文案例，明确为参与和团队协作；没有把客户写成雇主，也没有主张量产或个人领导。
- HUHU CARE 为合作概念项目；Lensflow 和 Periastra 为共同创作。简历描述项目内容而不归属为独立成果。数字工具说明包含 AI 辅助实现与开源组件；品牌研究不称已投产。
- Rhino、SolidWorks、Figma、CAD、AIGC 来自原简历。没有自行评定熟练度；没有添加无法补证的奖项、排名与效率指标。
- 不展示年龄、目标城市和到岗时效，避免过期值或来源冲突。没有放入私有仓库链接。

## 编辑与再生成

内容源：`deliverables/resume/resume-content.json`。编辑后运行 `scripts/resume/build_resume.py`，随后运行 `scripts/resume/export_word.ps1`。使用 Codex bundled Python；PDF 导出使用本机 Microsoft Word 16 的只读文档导出接口。

`portfolio_url` 已填入本项目的固定站点地址。当前站点访问范围见 `docs/DELIVERY.md`；开放公众访问前，不应把该链接当作匿名可访问的招聘投递链接。修改地址后重新生成，并验证一页布局。

## 验证

已执行技能规定的 `render_docx.py`，失败原因为 Windows 未提供 bundled LibreOffice 且 PATH 无 soffice.exe。未改用用户的 LibreOffice。改用 Microsoft Word 2019 原生 PDF 导出，使用 bundled Poppler 渲染 PNG 并目视检查最终整页。

最终目视验证图为 `deliverables/resume/qa/linked-1.png`：一页，无截断、重叠、缺字、标题边框或多余第二页。PDF 为可选择文本的 tagged A4 文档，DOCX 保持正文可编辑。QA 目录包含迭代图，仅内部检查，不作为用户交付附件。

站点地址已填入 portfolio_url，并以可点击的在线作品集显示。PDF 链接注释已检查，目标匹配本项目固定地址（Word 自动添加末尾斜杠）。页面能否匿名访问需另行确认。

最终上线地址为 `https://sun-yingjie-portfolio.ajhhq.chatgpt.site`。已修正 PDF 注释和 DOCX 的超链接关系；PDF 重渲染后与此前通过审阅的一页版面逐像素一致，DOCX 正文、样式及其他归档条目均保持原字节。当前 PDF 为 302,562 字节，SHA256 `24a0493a665b6909e3cc67eeb37f0bc20f940ccf38ecb14537c30803c215d15b`。详细证据见 `final-url-verification.json`。
