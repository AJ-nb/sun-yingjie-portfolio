# 孙英杰设计作品集

面向求职与商业合作的个人作品集，定位为品牌与产品设计＋AI：33 个案例、66 份中英文正文、六章阅读、三维人物，以及重新排版的作品集和简历。

- 线上预览（当前仅本人访问）：https://sun-yingjie-portfolio.ajhhq.chatgpt.site
- 私人源码仓库：https://github.com/AJ-nb/sun-yingjie-portfolio
- 排版作品集：`deliverables/portfolio/sun-yingjie-portfolio.pdf`
- 简历 PDF 与可编辑 Word：`deliverables/resume/`

当前版本 **v0.4.0 · Beyond the form**：强对比动态展览、首屏四种设计视角、详细双语个人档案、六项能力与案例证据、五步设计方法，以及带理由的项目关联。保留 33 个双语案例、八个固定样本交互实验、精选/完整作品集与一页简历。

[设计说明](docs/design-v4.md) · [个人文字介绍](docs/personal-narrative-v4.md) · [逻辑架构](docs/logic-architecture-v4.md) · [GitHub 开源调研](docs/open-source-research-v4.md) · [交付与验收](docs/DELIVERY-v4.md)

上方受限站点是历史托管版本；GitHub 更新不等同于 Sites 已重新发布。v3 的历史验收保留在 `docs/DELIVERY-v3.md`。

## 本地运行

使用 Node.js 24 LTS 或更新的受支持版本，并安装 Git LFS。首次检出时执行 `git lfs pull`，确保 PDF 和 Blender 工程为实际文件。

Windows 下建议使用较短的检出路径；本轮在仓库内设置 `git config core.longpaths true`，解决深层品牌资料的长路径限制。若首次检出提示路径过长，先设置该选项，再仅在新建、没有个人改动的验证副本中恢复 HEAD 文件。

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
npm run check:invariants
npm run build
npm run preview
```

构建只选择案例引用的媒体、缩略图、人物模型、静帧、四个下载件和许可文本。`web/public` 不会被整体复制到发布目录。最终资源清单位于 `web/dist/media-index.json`。

## 内容维护

案例位于 `web/src/content/works/<slug>.zh.md` 和 `.en.md`。保持两种语言的分类、署名和媒体一致。每个案例包含背景、本人职责、关键问题、设计过程、最终作品、成果与阶段。`web/src/data/chapters.ts` 控制六章顺序、精选项目及有依据的日期精度；`web/src/data/profile.json` 统一姓名、联系信息、教育与工作经历，供网站和文档共用。

`web/src/data/profile.ts` 在事实主档上补充中英双语个人叙述、能力与方法，使用 `caseSlugs` 指向既有项目；`caseRelations.ts` 用人工关联、共同能力与章节关系给出推荐及理由。首屏、目录、案例和能力入口共享项目 slug。新增叙述后运行 `python scripts/subset_fonts.py`，刷新本地中文字体子集。

修改封面后运行 `python scripts/prepare_web_assets.py`，生成缩略图和人物静帧。精选作品集使用 `python scripts/build_selected_portfolio.py`（28页）；完整33案例档案使用 `python scripts/build_portfolio.py`（116页），依赖 ReportLab、Pillow、pypdf 和 Windows 微软雅黑字体；同时保留高清原版并生成小于20MiB的网页优化版。网页优化仅压缩内嵌图片，文字、矢量、目录、书签和链接保留；独立验证见 `docs/portfolio-web-qa.md`。简历内容和再生成方法见 `deliverables/resume/resume-content.json` 与 `docs/resume-notes.md`。

v4 将三维人物作为有边界的数字肖像，使用原始透明静帧与原 GLB。桌面在可见时延迟加载；手机和低动态模式由读者主动请求，离屏或页面隐藏时停止持续渲染。原有 GLB 镜头与两个独立眼球节点保留；五段履历镜头已不作为新版页面的阅读导航。`scrollTimeline.ts` 与原模型校验仍保留，作为历史素材与映射规则的回归检查。制作方法与参考来源见 `avatar/README.md`。

桌面通过竖向滚动浏览横向章节，手机与低动态模式使用纵向章节。全局暂停动效保持阅读锚点，且遵循系统减少动态效果设置。独立案例采用 `#/work/<slug>`，英文版本为 `?lang=en#/work/<slug>`。检索、分类、图/列表显示、首屏视角、方法步骤、能力展开状态、案例返回位置与浏览器前进后退由页面历史维护。性能不足或模型失败时仍可完整浏览作品。

## 来源与权利

`private/sources/` 保存原始材料、来源、校验值、重复内容和排除说明。约 21.7 GiB 的工程文件保留在本机原路径，不放入 Git；精确字节与校验值见 `engineering-originals.json`。完整逐项报告见 `docs/source-coverage.md`。

合作项目保留已知署名；无法证明的个人主导、量产、效果或业绩不写成事实。数字工具保留衍生开发、上游许可与 AI 辅助实现说明，薪跳注明 PayDance 工资核心的 AGPL 来源。Chrome 扩展不称为自研浏览器，XHS Operations OS 按方法研究说明实现与规划的边界。用户提交的五张人物生成图作为本次设计参考，不是历史项目照片或真实扫描，未验证其生成模型名称。

三维实现沿用 sen-3d-resume 参考链，保留 MIT 代码说明于 `LICENSE.sen` 和 `NOTICE.sen`；原作者人物、姓名与个人素材未用于成品。本轮重新检索 119 个候选并重点核读 29 个源码，采用与排除项见 `docs/open-source-research-v4.md` 和 `THIRD_PARTY_NOTICES.md`。新机制在现有技术栈内独立实现，未将参考作者的实现代码、作品或个人经历移植入网站。技能使用见 `docs/skills-v4.md`，历史基线仍保留。

第二轮来源记录位于 `private/sources/refinement-v2` 和 `private/sources/refinement-digital`；历史159条原件校验快照保存在 `private/sources/history/refinement-r1`。模型工作副本仅做定向提取，PSD经过Photoshop原生分层审阅，渲染长卷拆为独立高清图。完整模型原件不随网页发布；既有渲染、模型新视角与AI表现分开记来源。

## 发布维护

只有 `web/dist` 中明确选入的公开构建参与 Sites 发布。Sites 使用独立的静态发布目录；私人来源档案、建模工程、生成提示词不上传到公开站点。GitHub 仓库保存可维护的源文件和交付文档，并保持私人可见性。站点身份信息在 `.openai/hosting.json`，凭据不写入文件。

新增素材后，先确认用途和署名，更新中英文案例，运行内容校验和构建，再发布。本次未购买素材、模型服务或存储容量。

最后运行 `python scripts/build_coverage_v2.py`，刷新本地构建与当前来源覆盖快照。远端公开验证单独记录，不能将本地构建检查等同于匿名访问成功。网站不设置阅后失效或访问次数限制；托管平台的实际服务与流量限制仍适用，不承诺无限流量或永久零故障。

发布时使用干净检出的构建目录。`scripts/prepare_site_release.py --build <构建目录> --release <.sites-runtime下的新目录>` 会创建独立静态发布包，拒绝覆盖既有目录。页面输出通过后，才运行 Sites 的打包和发布流程。

构建与发布器均严格核对实际文件与选入清单，不能跳过额外文件错误。此前版本发布时，旧输出曾发现已撤选的薪跳角色图，最终使用排除该图的全新 GitHub 检出构建。本轮 v4 尚未重新发布 Sites。当前依赖审计和开发服务维护边界见 `docs/dependency-maintenance.md`。

浏览器回归：先运行 `npm run preview -- --port 4173`，另一终端在 web 目录运行 `npm run test:browser`。脚本读取 `PORTFOLIO_QA_URL`；可用 `npx playwright install chromium` 安装匹配的测试浏览器。GitHub Actions 对内容、类型、样例恢复逻辑、模型锚点、构建与浏览器回归持续验证。

Windows 同步目录可能在构建时注入临时文件。可设置 `PORTFOLIO_BUILD_DIR` 指向同步范围以外的新构建目录，构建和预览均使用该变量；测试报告可用 `PORTFOLIO_QA_OUTPUT` 指向独立目录。不要跳过额外文件检查。
