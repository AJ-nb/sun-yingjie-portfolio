# 孙英杰设计作品集

面向求职与商业合作的个人作品集：30 个案例、60 份中英文正文、三维人物、完整案例阅读，以及重新排版的作品集和简历。

- 在线作品集：https://sun-yingjie-portfolio.mauve-heron-8150.chatgpt.site
- 私人源码仓库：https://github.com/AJ-nb/sun-yingjie-portfolio
- 排版作品集：`deliverables/portfolio/sun-yingjie-portfolio.pdf`
- 简历 PDF 与可编辑 Word：`deliverables/resume/`

## 本地运行

使用 Node.js 20 或更新的受支持版本，并安装 Git LFS。首次检出时执行 `git lfs pull`，确保 PDF 和 Blender 工程为实际文件。

```powershell
cd web
npm ci
npm run dev
```

## 验证与构建

```powershell
cd web
npm run check:content
npm run typecheck
npm run lint
npm run build
npm run preview
```

构建只选择案例引用的媒体、缩略图、人物模型、静帧和两个下载件。`web/public` 不会被整体复制到发布目录。最终资源清单位于 `web/dist/media-index.json`。

## 内容维护

案例位于 `web/src/content/works/<slug>.zh.md` 和 `.en.md`。保持两种语言的分类、署名和媒体一致。每个案例包含背景、本人职责、关键问题、设计过程、最终作品、成果与阶段。`web/src/data/workDocs.ts` 控制首页代表作品排序。

修改封面后运行 `python scripts/prepare_web_assets.py`，生成缩略图和人物静帧。新版设计作品集使用 `python scripts/build_portfolio.py`，依赖 ReportLab、Pillow 和 Windows 微软雅黑字体。简历内容和再生成方法见 `deliverables/resume/resume-content.json` 与 `docs/resume-notes.md`。

网站三维模块延迟加载，低动态模式仅在主动请求后加载。镜头根据整个介绍区的滚动进度播放 GLB 中的 `CameraAction`；履历条目不与旧模板的停靠点数量绑定。眼球根节点保持独立。制作方法与参考来源见 `avatar/README.md`。

## 来源与权利

`private/sources/` 保存原始材料、来源、校验值、重复内容和排除说明。约 21.7 GiB 的工程文件保留在本机原路径，不放入 Git；精确字节与校验值见 `engineering-originals.json`。完整逐项报告见 `docs/source-coverage.md`。

合作项目保留已知署名；无法证明的个人主导、量产、效果或业绩不写成事实。数字工具保留 Fork、MIT 许可与 AI 辅助实现说明。用户提交的五张人物生成图作为本次设计参考，不是历史项目照片或真实扫描。未验证其生成模型名称。

页面参考 sen-3d-resume 的人物主导结构，保留 MIT 代码说明于 `LICENSE.sen` 和 `NOTICE.sen`；原作者人物、姓名与个人素材未用于成品。技能与参考版本见 `docs/skills-lock.json`，实际设计取舍见 `DESIGN.md`。

## 发布维护

只有 `web/dist` 中明确选入的公开构建参与 Sites 发布。Sites 使用独立的静态发布目录；私人来源档案、建模工程、生成提示词不上传到公开站点。GitHub 仓库保存可维护的源文件和交付文档，并保持私人可见性。站点身份信息在 `.openai/hosting.json`，凭据不写入文件。

新增素材后，先确认用途和署名，更新中英文案例，运行内容校验和构建，再发布。本次未购买素材、模型服务或存储容量。
