# 孙英杰设计作品集

面向求职与商业合作的个人作品集，定位为品牌与产品设计＋AI：33 个案例、66 份中英文正文、六章阅读、三维人物，以及重新排版的作品集和简历。

- 线上预览（当前仅本人访问）：https://sun-yingjie-portfolio.ajhhq.chatgpt.site
- 私人源码仓库：https://github.com/AJ-nb/sun-yingjie-portfolio
- 排版作品集：`deliverables/portfolio/sun-yingjie-portfolio.pdf`
- 简历 PDF 与可编辑 Word：`deliverables/resume/`

当前状态：网站与文档已完成验证，三维人物相似度等待用户集中审阅。依照已确认方案，审阅后才开放公众访问。实际交付和验证记录见 `docs/DELIVERY.md`。

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

案例位于 `web/src/content/works/<slug>.zh.md` 和 `.en.md`。保持两种语言的分类、署名和媒体一致。每个案例包含背景、本人职责、关键问题、设计过程、最终作品、成果与阶段。`web/src/data/chapters.ts` 控制六章顺序、精选项目及有依据的日期精度；`web/src/data/profile.json` 统一姓名、联系信息、教育与工作经历，供网站和文档共用。

修改封面后运行 `python scripts/prepare_web_assets.py`，生成缩略图和人物静帧。新版设计作品集使用 `python scripts/build_portfolio.py`，依赖 ReportLab、Pillow 和 Windows 微软雅黑字体。简历内容和再生成方法见 `deliverables/resume/resume-content.json` 与 `docs/resume-notes.md`。

网站三维模块延迟加载，低动态模式仅在主动请求后加载。镜头按五个履历节点停靠，GLB 中的 `CameraAction` 为350帧、24fps，末段进入作品。`scrollTimeline.ts` 统一节点与镜头映射，`verify-scroll-timeline.mjs` 检查驻留、反向滚动与视口变化。只旋转两个独立眼球根节点，触屏不启用光标跟随。制作方法与参考来源见 `avatar/README.md`。

桌面通过竖向滚动浏览横向章节，手机与低动态模式使用纵向章节。独立案例采用 `#/work/<slug>`，英文版本为 `?lang=en#/work/<slug>`。检索、分类、案例返回位置与浏览器前进后退由现有路由状态维护。性能不足或模型失败时仍可完整浏览作品。

## 来源与权利

`private/sources/` 保存原始材料、来源、校验值、重复内容和排除说明。约 21.7 GiB 的工程文件保留在本机原路径，不放入 Git；精确字节与校验值见 `engineering-originals.json`。完整逐项报告见 `docs/source-coverage.md`。

合作项目保留已知署名；无法证明的个人主导、量产、效果或业绩不写成事实。数字工具保留衍生开发、上游许可与 AI 辅助实现说明，薪跳注明 PayDance 工资核心的 AGPL 来源。Chrome 扩展不称为自研浏览器，XHS Operations OS 按方法研究说明实现与规划的边界。用户提交的五张人物生成图作为本次设计参考，不是历史项目照片或真实扫描，未验证其生成模型名称。

页面参考 sen-3d-resume 的人物主导结构，保留 MIT 代码说明于 `LICENSE.sen` 和 `NOTICE.sen`；原作者人物、姓名与个人素材未用于成品。技能与参考版本见 `docs/skills-lock.json`，实际设计取舍见 `DESIGN.md`。

第二轮来源记录位于 `private/sources/refinement-v2` 和 `private/sources/refinement-digital`；历史159条原件校验快照保存在 `private/sources/history/refinement-r1`。模型工作副本仅做定向提取，PSD经过Photoshop原生分层审阅，渲染长卷拆为独立高清图。完整模型原件不随网页发布；既有渲染、模型新视角与AI表现分开记来源。

## 发布维护

只有 `web/dist` 中明确选入的公开构建参与 Sites 发布。Sites 使用独立的静态发布目录；私人来源档案、建模工程、生成提示词不上传到公开站点。GitHub 仓库保存可维护的源文件和交付文档，并保持私人可见性。站点身份信息在 `.openai/hosting.json`，凭据不写入文件。

新增素材后，先确认用途和署名，更新中英文案例，运行内容校验和构建，再发布。本次未购买素材、模型服务或存储容量。

最后运行 `python scripts/build_coverage_v2.py`，刷新本地构建与当前来源覆盖快照。远端公开验证单独记录，不能将本地构建检查等同于匿名访问成功。网站不设置阅后失效或访问次数限制；托管平台的实际服务与流量限制仍适用，不承诺无限流量或永久零故障。

发布时使用干净检出的构建目录。`scripts/prepare_site_release.py --build <构建目录> --release <.sites-runtime下的新目录>` 会创建独立静态发布包，拒绝覆盖既有目录。页面输出通过后，才运行 Sites 的打包和发布流程。
