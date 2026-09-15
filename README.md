# 孙英杰 · 品牌与产品设计作品集

v5 将品牌、产品与 AI 实践组织为六个精选案例，以及 30 个可明确署名项目的扩展档案。中文优先，保留英文、筛选、大图、浏览历史和阅读位置恢复。

- 网站：https://sun-yingjie-portfolio.ajhhq.chatgpt.site
- 源码：https://github.com/AJ-nb/sun-yingjie-portfolio（保持私人）
- 精选作品集：`deliverables/portfolio/sun-yingjie-selected-portfolio.pdf`，32 页
- 扩展档案：`deliverables/portfolio/sun-yingjie-portfolio.pdf`，112 页
- 简历：`deliverables/resume/sun-yingjie-resume.pdf` 与 `.docx`，一页 A4，含照片与二维码

网站当前发布状态以 [v5 交付记录](docs/DELIVERY-v5.md) 为准，GitHub 同步与正式网站发布分别核对。

## 设计与内容

首页使用横向指针控制的原视频；页脚通过逐帧测量的视线映射响应指针。两段影像均为作者指定的展示参考，不计作本人项目成果。手机首页提供主动播放，页脚静音循环；减少动态模式和离屏状态停止运动。真人三维模块已经移除。

精选顺序：彼源 AI、Periastra、夜礼司、铝型材灯具、Hermès 季节橱窗、Lensflow。Periastra 采用作者确认的正式 PERIASTRA 字标，早期图形保留为探索。每个案例说明背景、职责、关键问题、取舍、交付与阶段；合作、开源和概念研究分别标明归属。

- [实施规范](docs/superpowers/portfolio-v5-plan.md)
- [个人叙述与证据](docs/profile-evidence.md)
- [v5 开源研究与取舍](web/public/OPEN_SOURCE_REFERENCES.md)
- [第三方声明](web/public/THIRD_PARTY_NOTICES.md)
- [视频与照片来源](web/public/media/v5/sources.json)
- [v4 历史设计说明](docs/design-v4.md)

## 本地运行与检查

使用 Node.js 24+ 和 Git LFS。首次检出执行 `git lfs pull`；Windows 建议使用短路径，必要时设置仓库级 `core.longpaths true`。

```powershell
cd web
npm ci
npm run dev
npm run check:content
npm run typecheck
npm run lint
npm run check:invariants
npm run build
```

生产浏览器检查：先启动 `npm run preview -- --port 4173`，再设置 `PORTFOLIO_QA_URL=http://127.0.0.1:4173/` 运行 `npm run test:browser`。报告默认保存到 `design/qa-v5/`。CI 在默认分支与 v5 分支执行同一组检查。

## 内容维护与文档导出

`web/src/data/profile.json` 是姓名、联系方式和经历的事实主档；`profile.ts` 补充双语叙述。`publication.json` 统一精选顺序、页数与撤选名单。双语案例位于 `web/src/content/works/`，章节关系位于 `chapters.ts`，交互样例位于 `experiments.ts`。

Python 文档依赖：ReportLab、Pillow、pypdf、python-docx、fonttools、brotli。使用已有中文 TrueType 字体或设置 `PORTFOLIO_FONT` / `PORTFOLIO_BOLD_FONT`。

```powershell
python scripts/prepare_document_fonts.py
python scripts/subset_fonts.py
python scripts/build_selected_v5.py
python scripts/build_portfolio.py
python scripts/resume/build_resume.py
./scripts/resume/export_word.ps1
```

简历用 Microsoft Word 原生导出；导出后检查恰为一页。PDF 网页版仅压缩图像，保留文字、目录、链接与透明图层；精选 32 页与扩展 112 页分别保留高清原件和小于 20 MiB 的下载版。

## 来源与发布

`private/` 保留原始来源和暂未核实署名的项目。大体积工程仍在本机原路径，索引见既有来源报告。新图像制作状态必须如实记录；不得把现有图片标为本轮新生成成果。

构建通过显式媒体清单挑选文件，绝不整体发布 `web/public` 或私人源材料。输出清单是 `web/dist/media-index.json`。只有经过验证的 `web/dist` 进入独立 Sites 静态发布目录。

`scripts/prepare_site_release.py --release <.sites-runtime 下的新目录>` 创建发布副本，拒绝覆盖旧目录。发布使用 `.openai/hosting.json` 中既有站点，源凭据不存储。网站按作者要求公开，GitHub 仓库保持现有私人权限。
