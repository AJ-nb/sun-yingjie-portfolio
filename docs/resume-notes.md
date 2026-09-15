# 第二轮简历交付说明

交付：deliverables/resume/sun-yingjie-resume.docx 与 sun-yingjie-resume.pdf。Word正文可编辑；PDF一页A4、文字可选择。字体微软雅黑，正文9pt/15pt行距，深灰文字与灰绿色辅助信息，使用真实作品网址二维码；不展示年龄、性别、薪资、平台旧二维码和技能进度条。

网站档案 web/src/data/profile.json 是姓名、定位、联系方式及任职时间的唯一来源。scripts/resume/build_resume.py 从该档案生成简历内容清单与Word；scripts/resume/export_word.ps1 用本机Microsoft Word原生导出PDF。作品细述在同一生成器中编辑，事实更新先修改统一档案。

2026-09-15验证：重新生成与Word导出完成；Poppler整页检查修正首行与二维码行高后通过，没有截断、重叠与多余第二页。页数、日期、联系方式和超链接目标由PDF解析复核。二维码按固定站点URL生成。网站下载已同步；公共访问仍随整站发布进行匿名验证。

不再沿用第一轮PDF哈希或当时的任职时间取舍。原始简历及新旧事实关系见docs/profile-evidence.md。
