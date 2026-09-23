# 开源研究与设计实现 / Open-source research

核查日期：2026-09-16。本轮研究覆盖 41 个与视觉生产、交互、三维、出版和验收相关的仓库，结合既有固定版本研究进行选型。研究范围不等于已安装或已运行范围；下表区分实际采用、个人项目中的二次设计，以及参考方案。

## 实际使用

| 项目 | 许可 | 在作品集中的用途 |
| --- | --- | --- |
| [Motion](https://github.com/motiondivision/motion) | MIT | 沿用 Framer Motion 11 处理进入、退出和状态变化；鼠标控制视频进度使用浏览器原生能力。 |
| [Yet Another React Lightbox](https://github.com/igordanchenko/yet-another-react-lightbox) | MIT | 案例原图与设计解析的放大阅读、键盘退出和焦点恢复。 |
| [img-comparison-slider](https://github.com/sneas/img-comparison-slider) | MIT | 已有对照图交互，保留触控与键盘入口。 |
| [Sharp](https://github.com/lovell/sharp) | Apache-2.0 | 构建时派生图片尺寸和解析版面，保留原始项目图；不在浏览器运行。 |
| [SVGO](https://github.com/svg/svgo) | MIT | 新增构建工具，优化 SVG 输出；可编辑母版另外保留。 |
| [FFmpeg](https://github.com/FFmpeg/FFmpeg) | 依构建为 LGPL / GPL | 本地编排和编码原图短片，使用的本机构建含 GPL 组件；网站不分发该工具二进制。 |
| [Playwright](https://github.com/microsoft/playwright) | Apache-2.0 | 响应式、导航状态、媒体加载与下载检查；测试结果独立记录。 |
| [axe-core](https://github.com/dequelabs/axe-core) | MPL-2.0 | 自动可访问性检查，不代替人工或辅助技术验收。 |

完整软件与字体声明、已保留的版本许可证文本见 [第三方声明](THIRD_PARTY_NOTICES.md) 和 [许可证清单](licenses/inventory.json)。构建工具、验收工具与实际浏览器依赖分别管理。

## 二次设计与代码起点

| 项目 | 关系 | 个人贡献边界 |
| --- | --- | --- |
| [Resume Formatter](https://github.com/gracexygu/resume-formatter) | MIT 上游项目，作品集中的二次开发案例 | 个人设计围绕母版／岗位版、局部改写审阅、差异确认与撤销；上游框架及作者来源保留。 |
| [sen-3d-resume](https://github.com/dayinji/sen-3d-resume) | 历史代码基础，代码 MIT | 保留 SEN 的代码与资产排除声明；本版内容、版式、案例逻辑和媒体控制另行组织。旧个人三维模块已移除。 |

## 参考与取舍

保留原生滚动与现有动画系统，没有因为视觉参考引入第二套滚动或动效引擎。[Lenis](https://github.com/darkroomengineering/lenis)、[GSAP](https://github.com/greensock/GSAP) 和 [React Bits](https://github.com/DavidHDev/react-bits) 用于比较交互方案，未复制其组件进入本轮实现。GSAP 使用自定义许可；React Bits 的 MIT + Commons Clause 不能写成无限制 MIT。

Codrops 的 [InlineMenuLayout](https://github.com/codrops/InlineMenuLayout)、[ContentLayoutTransition](https://github.com/codrops/ContentLayoutTransition) 等启发选择、展开、返回的连续阅读；[Polaris](https://github.com/educlopez/Polaris) 与 [photography-website](https://github.com/ECarry/photography-website) 用于内容组织及缩略图／原图分工研究。网站以现有 React / Vite 架构独立实现选定机制。

在视觉生产中比较了 [Penpot](https://github.com/penpot/penpot)、[Excalidraw](https://github.com/excalidraw/excalidraw)、[Style Dictionary](https://github.com/style-dictionary/style-dictionary) 等工具。当前静态作品集采用可编辑 SVG 与构建管线，没有嵌入完整编辑器。[tldraw](https://github.com/tldraw/tldraw) 与 [Remotion](https://github.com/remotion-dev/remotion) 具有需要单独评估的许可条件，本轮未集成。

## 图像、影像与品牌内容

Hermès、Arc’teryx 两段项目短片由原始项目图和设计解析版面编排，来源见 [项目短片素材记录](media/v7/films/sources.json)；新增解析版面见 [图像清单](media/v7/manifest.json)。它们服务案例说明，完整保留产品主体。页脚继续使用 Arc’teryx 项目片段，Hermès 短片保留为项目资产。

首页使用作者明确指定的 [Mainframe 原始片源](https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4)，不列为个人项目成果。公开媒体包括约 4.6 MB 原片、约 20.6 MB 全关键帧版本与静态封面，来源和文件记录见 [首屏参考来源](media/v7/reference-sources.json)。Mainframe 同时提供首屏交互与视觉组织参考，身份、文案和入口对应本人作品集。

页面使用作者指定的 [HelveticaNowDisplay-Medium 远程 CSS](https://db.onlinewebfonts.com/c/5ac3fe7c6abd2f62067f266d89671492?family=HelveticaNowDisplay-Medium) 与 [HelveticaNowDisplayW01-Rg 远程 CSS](https://db.onlinewebfonts.com/c/1aa3377e489837a26d019bba501e779d?family=HelveticaNowDisplayW01-Rg)，样式服务来源：[OnlineWebFonts Web Fonts](http://www.onlinewebfonts.com/fonts/)。未复制字体二进制入仓库；中文和网络失败时保留原字体回退。商业品牌与合作项目的名称、商标和图像保留各自权利及案例署名。

## English

This edition evaluates 41 relevant repositories and retains a focused implementation: existing React motion, image viewing and verification tools, plus SVGO for build-time production. Research-only candidates are not represented as installed or runtime-verified integrations.

Resume Formatter is an attributed derivative case. The historical sen-3d-resume foundation retains its original notices and asset exclusions. Portfolio-specific design decisions, content, layouts and delivery work are separate from upstream authorship.

The hero uses the Mainframe source video expressly selected by the portfolio author, with an original file, an all-intra scrub version and a poster. It is presentation media, not a personal project achievement. The footer retains the Arc’teryx project film; the Hermès project film remains a project asset. Two user-specified Helvetica Now stylesheets load remotely, with existing font fallbacks for Chinese and failed requests; font binaries are not copied into the repository. Project imagery, trademarks and upstream contributions retain their respective attribution.


## AI video methods research (2026-09-23)

Research curation is adapted from [awesome-seedance / goodcase.ai](https://github.com/LearnPrompt/awesome-seedance/tree/9927d9b5bc2d1c305b2945917e461b3547642497). Source code is MIT; curation (selection, organization, templates and editorial summaries) is [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). This portfolio reorganizes the documentation into six control layers and eight product-design method studies. Prompts and media remain individually owned. No third-party prompt text, poster or video is copied into the release; optional original-platform embeds preserve source attribution. The research has not been personally retested.
