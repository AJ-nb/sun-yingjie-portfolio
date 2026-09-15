# 开源作品集与视觉交互研究 v4

核查时间：2026-09-15（Asia/Shanghai）。本轮从“个人作品集本身如何组织作品和身份”出发，同时核查创意排版、图集、三维与转场源码。结论支持本仓库的 v4 实现，开源作者的项目不计入孙英杰的个人经历。

## 已完成的研究

- **10 个方向、11 次搜索，119 个去重候选。** 每次最多取 20 个结果；其中一次 `scroll gallery user:codrops` 无结果，扩大为同作者 `gallery` 搜索。记录保留零结果，不伪装成每组都找到有效项目。
- **29 个重点项目，29 个均核读关键源码。** 包括真实个人站点、可配置作品集模板与完整视觉演示代码；没有把资料列表、截图集或一般动画依赖算作重点源码。
- **22 个仓库取得独立完整许可文本。** 其中 20 项为未见本轮声明冲突的标准代码许可，1 项自定义限制许可，1 项的 LICENSE 与 README 相冲突。另有 1 项 README/源码声明 MIT 但没有独立完整文本，1 项源码与 README 许可冲突，5 项未发现明确授权。
- 28 个重点项目来自本轮搜索结果；`codrops/Scroll3DGrid` 是对既有相关方向的直接重新核查。它计入重点核查，不增加搜索候选数量。
- 每项记录查询时间、仓库 URL、提交 SHA、文件路径、Git blob SHA、上游字节数与实际阅读片段。过渡期的 EOF 请求已重试补齐。

[完整搜索记录](open-source-search-v4.json) · [29 项源码与许可快照](open-source-verification-v4.json) · [逻辑架构与验收映射](logic-architecture-v4.md)

搜索按 stars 排序只用于寻找入口；本文没有用 stars 判断设计优劣。未运行这些上游项目的构建、性能基准或线上用户测试；“核读事实”描述源码行为，视觉价值与本站采用属于设计判断。

研究文件核对通过：91 份支持文件的路径、blob SHA、上游字节数与记录一致，386 条摘录逐行匹配已取得的原文；29 项表格条目完整，106 个本地文档链接可解析。两份 notices 的原许可表与库存说明未改。具体结果见核查 JSON 的 artifactValidation。

## 本轮实际实现、仅参考与未采用

以下映射对照本轮本地源码；“已实现”表示已能在仓库中审查，不替代发布后的浏览器验收。所有新增机制均在现有 React、Motion、CSS 和 Three.js 体系内独立实现，本轮未将上游实现代码、案例资产、字体或个人文案移植入网站；研究记录保留必要的署名摘录，也没有因这些参考新增依赖。

| 状态 | 实际采用及可审查位置 | 研究关联与范围 |
| --- | --- | --- |
| 已实现 | [Studio.tsx](../web/src/ui/Studio.tsx) 将原作品主图放入开场；4 个可逆选择按钮同步封面、标题、序号与目标案例。大字滚动位移和细微指针透视在低动态模式停用。 | ITom 的单选状态、TypographyMotion 的可逆选择、Scroll3DGrid 的有限透视提供机制参考；独立实现普通 DOM 选择器，没有复制三维展厅。 |
| 部分采用 | 同一开场组合超大文字与完整作品图。 | ImageExpansionTypography **只参考文字和图像的构图关系**；文字内部图像展开、Flip 测量和 ScrollTrigger 时间线均未采用。不能把当前开场称作该效果已实现。 |
| 已实现 | [StudioSelected](../web/src/ui/Studio.tsx) 的 3 项精选采用主项与双项的不同尺度，显示摘要、本人职责与阶段；[studio.css](../web/src/studio.css) 为六章设置不同图像比例和交替版式。 | Hamish 的精选节奏与 Jodie 的策展顺序；沿用本站案例与 DOM 阅读顺序。 |
| 已实现 | [App.tsx](../web/src/App.tsx) 提供网格/列表选择，保留分类、搜索和摘要；[CasePage.tsx](../web/src/ui/CasePage.tsx) 首屏显示职责、合作署名和阶段。 | InlineMenuLayout 的明确对象映射、Polaris 的内容完整性。未复刻菜单项与悬浮图片的 Flip 转场，也不依赖 hover 才能获取摘要。 |
| 已实现 | [profile.ts](../web/src/data/profile.ts) 和 [StudioProfile.tsx](../web/src/ui/StudioProfile.tsx) 提供详细双语档案、工作与教育、6 项能力证据、5 步方法及 4 个下载入口。 | Polaris、Emilia 与 Emma 的身份/内容分离；6 项能力是对既有材料的编辑归纳，链接到本人现有案例。 |
| 已实现 | 案例首屏以摘要、事实区和“如何阅读”目录建立阅读入口；目录按钮进入实际正文段落。 | xdesro/David 仅用于内容组织比较；未复制这两个授权有限/缺失仓库的源代码或作者经历。未新增统一 CaseGuide 数据模型。 |
| 已实现 | [caseRelations.ts](../web/src/data/caseRelations.ts) 按人工关联 → 共同能力 → 同章选择最多 2 项，排除自己、重复和不存在的目标；CasePage 显示具体关联理由。 | 分类契约与当前对象映射提供比较依据；关联文本独立编辑，来自本站真实案例关系。 |
| 已实现 / 沿用 | 目录与案例使用可分享的同一 slug；现有媒体查看器保留局部查看和关闭返回；原生历史仍由 App 管理。 | TooltipTransition 的逐层阅读、FullscreenLayout 的目标映射仅作状态逻辑参考；其 Flip 转场、滚动拦截和旧式控件未采用。 |
| 已实现 | 开场作品图立即加载，其余目录/精选图懒加载；App 监听人像进入视口及页面隐藏状态，将 active 传给原有 GLB 场景。 | ECarry 首图策略、Hamish 可见性与 Iuri/Vaalentin 生命周期是机制参考；没有新增人物模型，也未声称全程稳定 60 FPS。 |
| 已实现 | 重复短词装饰标记 aria-hidden；全局暂停与低动态设置关闭装饰运动，正文稳定可读。 | RepetitiveTypography 的重复短词节奏；未采用其完整分字滚动时间线或模糊正文。 |
| 已实现 | 原有 [portrait.webp](../web/public/avatar/portrait.webp) 直接作为静态后备，像素格式为 RGBA、alpha 范围 0–255；原 GLB 以 alpha 画布显示。半透明粘性导航和图注叠层在 CSS 中实现。 | 这是已有资产与界面层次的重新编排；当前小人像使用原模型初始姿态和指针视差，旧履历五段镜头不再作为新首页的导览机制。 |
| 未采用 | 全站自定义滚动、无限三维走廊、每张作品实时三维、EXIF 伪造、框架/CMS 迁移。 | 原因见下方“未采用的机制”；它们属于研究范围，不属于已交付功能。 |

影像边界：已有作品图、原 GLB 和原始资料继续使用。本轮额外尝试用 imagegen 为 HUHU 图像生成透明背景，服务返回 **HTTP 500 / convert_request_failed**，未产生可用新图；原图保留。原 avatar 中已存在的 alpha 素材及透明界面叠层属于现有资产/呈现方式的使用，不能写成新的实拍照片或生成成功。

## 最初提出的 12 项实施建议

| 优先级 | 机制与目的 | 最直接的源码依据 | 本站做法与完成判据 |
| --- | --- | --- | --- |
| P0 | 作品主视觉进入大字，再从文字内展开，建立一个明确开场 | ImageExpansionTypography 的 type--open / Flip 测量 | 使用已有真实项目图；Motion/CSS 只做一处主转场。静态与低动态仍显示完整姓名、定位和作品入口。 |
| P0 | 精选入口从“漂亮封面”变成一个可判断的设计问题 | Hamish 的 ProjectSummary、Polaris 的 challenge/solution/results | 每项展示问题、作品名、职责与阶段，点击进入相同 slug。角色与交付物来自已有记录。 |
| P0 | 完整目录采用大字项目行与旁侧预览，形成密集信息和大图的对比 | InlineMenuLayout 的 menuItems/contentItems 配对 | 序号、标题、类别、日期按行组织；hover 与 focus 同等预览，触摸直接进入案例。 |
| P0 | 精选版式有全幅、交替双栏、成对细部的节奏 | Hamish alternate/mobile 分支；Jodie modify-grid | 固定策展顺序，视觉顺序与 DOM 顺序一致；不让所有项目重复同一张圆角卡片。 |
| P0 | 能力直接连接作品证据 | Polaris schema；Emilia areas；本站既有 role/credits | 4–5 个能力入口，每个 1–3 个既有案例；点击后能看到具体行动与材料，工具标签降为辅助。 |
| P0 | 案例首屏先给问题、本人行动、核心判断与阶段 | xdesro abstract/Discipline/Tenure；David ProjectContent | 原始合作署名保留；读者不操作实验也能理解项目。实验前显示观察目的。 |
| P0 | 图片、当前选项和解释共享一个身份 | ITom selectedCard；WebGPU 草案 syncCurrentIndex | 同一 selected id 决定图像、标题、说明和计数。切换不留下上一个项目的图注。 |
| P0 | 相关案例解释“为什么相关” | Jodie 分类数据；InlineMenu 的对象映射；本站 relatedCases 审核 | 关联项保存 slug 与 reason；默认按同能力/同章推荐，排除自己和重复，覆盖全部 33 项。 |
| P1 | 预览 → 案例 → 大图形成逐步深入 | TooltipTransition 的 hover/click/fullscreen 三状态 | 预览不改路由；案例有可分享地址；大图关闭返回原按钮；原生后退/前进保存阅读位置。 |
| P1 | 作品材料按比例和用途编排 | andyzg Config/Renderer；rampatra 原图/缩略图分离 | 场景、细部和结构各成资料组；保留自然比例与简短图注，避免强行方形裁切隐藏设计信息。 |
| P1 | 主图优先、其他图按需，三维只在需要时运行 | ECarry isFirstSlide；Hamish visible/lazy；Vaalentin start/stop | 首图优先，其余懒加载；离屏/隐藏暂停三维，失败有静态图和可达入口。 |
| P2 | 短词与有限透视增强章节性 | RepetitiveTypography；Scroll3DGrid | 少量装饰重复文本设 aria-hidden；标题只有一个语义入口；低动态使用平面静态版。 |

这一表保留研究阶段的候选方案，**不等同于全部已实施**；本轮选择、简化或未采用的结果以上一节为准。具体交互通过情况以最终浏览器记录为准。

## 个人作品集：身份、精选与内容架构

| 项目 | 核读事实与源码 | 可借鉴机制与本站建议 | 许可及边界 |
| --- | --- | --- | --- |
| [HamishMW/portfolio](https://github.com/HamishMW/portfolio) | 首页由 Intro、三个 ProjectSummary、Profile 组成；ProjectSummary 用 alternate 调整顺序，visible/focused 驱动过渡并延迟加载模型。 [源码1](https://github.com/HamishMW/portfolio/blob/b7444bc16216f38c64f4afb8d2f53b8c4cbb2bda/app/routes/home/home.jsx#L101) / [源码2](https://github.com/HamishMW/portfolio/blob/b7444bc16216f38c64f4afb8d2f53b8c4cbb2bda/app/routes/home/project-summary.jsx#L31) | 精选项目交替编排；能力描述先于技术名；可见时才加载三维。<br>**建议**：首屏与精选展示；沿用 Motion，保留原生标题和链接。 | MIT。README 明确不能把作者项目当作自己的；不复制项目图与经历。 |
| [iuridepaula/portfolio](https://github.com/iuridepaula/portfolio) | Home.vue 将职业与个人背景拆成独立 Scene 组件，isPlaying 控制循环，卸载时销毁时间线。 [源码1](https://github.com/iuridepaula/portfolio/blob/c28f47a685c047c657242753f6a6710a92ac5b58/src/views/Home.vue#L3) / [源码2](https://github.com/iuridepaula/portfolio/blob/c28f47a685c047c657242753f6a6710a92ac5b58/src/components/SceneSection.vue#L2) | 把职业路径组织成少量有主题的章节，并停止离屏动画。<br>**建议**：借鉴叙事分段；保留本站真实履历，不使用游戏人物与音频。 | MIT（版权占位字段未填写）。README 明确实现来自 2018/2019，不能直接当作现代技术栈建议。 |
| [davidhckh/portfolio-2025](https://github.com/davidhckh/portfolio-2025) | 项目文案按 en/de 与 slug 组织，ProjectContent 用类型化媒体块保存 src/alt/caption；首页按 locale 加载预览。 [源码1](https://github.com/davidhckh/portfolio-2025/blob/f331fe16f507d52b60348fee73d56ab7ec330e56/src/content/projects/en/particles.ts#L19) / [源码2](https://github.com/davidhckh/portfolio-2025/blob/f331fe16f507d52b60348fee73d56ab7ec330e56/src/features/home/components/Projects.vue#L21) | 摘要与详细内容来自同一身份；媒体说明紧贴媒体；语言版本保持 slug 一致。<br>**建议**：仅参考内容结构并独立实现，不复制其受限制源码。 | 自定义：限个人/教育、需可见署名、商业复用需许可。不是 MIT，也不能笼统称为无条件开源；商业边界不确定时不复用代码。 |
| [ITomPoland/portfolio-itom](https://github.com/ITomPoland/portfolio-itom) | GalleryRoom 有 CMS 数据与 FALLBACK_PROJECTS 回退；selectedCard 和 globalIsAnimating 管理单卡打开；hover 能力决定是否加载 painted 纹理。 [源码](https://github.com/ITomPoland/portfolio-itom/blob/3e82d28097eba435a47ac46f9988334379a5ac79/src/components/canvas/rooms/Gallery/GalleryRoom.jsx#L37) | 一次只有一个被展开对象；触摸环境使用原始视图；加载失败仍能浏览。<br>**建议**：借鉴渐进增强与明确选择态；不引入完整三维走廊。 | MIT（代码）。README 排除个人纹理、图像和文案；其 zero lag/60 FPS 等性能主张未独立验证。 |
| [bizarro/bruno-arizio](https://github.com/bizarro/bruno-arizio) | Canvas/Home 维护 index、indexInfinite、current/target 位置；滑动后吸附，并对非当前项目统一 show/hide。 [源码](https://github.com/bizarro/bruno-arizio/blob/2db7432ba3d19f54f36ce0cd06a69ee7cdc1d00f/app/components/Canvas/Home/index.js#L76) | 封面、序号与标题共享当前作品索引，形成连续展览感。<br>**建议**：借鉴当前项联动与轻微景深层次；以原生滚动实现有限序列。 | 未发现独立代码许可证。README 的 open source 表述不能替代完整授权；不复制代码、文字纹理或作品素材。 |
| [bizarro/bizar.ro](https://github.com/bizarro/bizar.ro) | Home 页面把 show/hide、resize、touch、wheel 和 update 统一交给 Scrolling 对象。 [源码](https://github.com/bizarro/bizar.ro/blob/061cfc632d32feac29d90de4e82164b717defe56/app/pages/Home/index.js#L27) | 离开页面时停用交互源；一个滚动状态驱动当前列表。<br>**建议**：借鉴生命周期边界，避免路由离开后仍运行指针或滚动逻辑。 | 未发现独立代码许可证。仅作实现研究；不照搬自定义滚动系统。 |
| [vaalentin/2015](https://github.com/vaalentin/2015) | appModule 区分 heads/tails 两种阅读状态；SectionClass 有独立 in/out/start/stop 与 playing 标志。 [源码1](https://github.com/vaalentin/2015/blob/80b24c10bd411b723a5188fbc94fa27ea368c92f/app/src/js/modules/appModule.js#L11) / [源码2](https://github.com/vaalentin/2015/blob/80b24c10bd411b723a5188fbc94fa27ea368c92f/app/src/js/classes/SectionClass.js#L15) | 视觉体验和信息阅读有明确入口；每段动画可以停止。<br>**建议**：借鉴“作品优先、资料可达”的双路径，不移植旧 jQuery/Bower 工具链。 | 未发现独立代码许可证。2015 实验源码；实际现代浏览器兼容性未运行验证。 |
| [xdesro/true-terrors](https://github.com/xdesro/true-terrors) | 案例模板有 abstract、Discipline、Tenure、theme.fill/theme.contrast，以及可选目录；正文与元数据分开。 [源码](https://github.com/xdesro/true-terrors/blob/e84aa9c1bd13b7845f8a1b996575be794227994a/src/_includes/layouts/_case.njk#L9) | 案例首页先给项目概述、参与领域与时间；每个案例可以有受控强调色。<br>**建议**：借鉴事实卡与案例色彩规则；原数据继续使用本站 role/credits/status。 | 未发现独立代码许可证。README 使用商业字体；不能复制字体、作者文案或品牌图形。 |
| [logotip4ik/portfolio](https://github.com/logotip4ik/portfolio) | 项目卡分别提供站内案例与可选 source 链接；有 reduced-motion 分支和 focus-within 高亮；项目正文用 Markdown。 [源码1](https://github.com/logotip4ik/portfolio/blob/f9ee705f83150a77ecddefc85859476f5d7d2dc5/components/V-Projects-Item.vue#L5) / [源码2](https://github.com/logotip4ik/portfolio/blob/f9ee705f83150a77ecddefc85859476f5d7d2dc5/content/project/portfolio.md#L3) | 阅读项目与打开源码分成不同操作；键盘焦点获得同等预览。<br>**建议**：目录预览同时支持 hover/focus；原始代码链接独立显示。 | 代码 CC0-1.0；图像与项目内容 CC BY-NC-SA-4.0。分别核读 LICENSE 与 CC-BY-NC-SA-4.0，不能把 CC0 扩大到案例资产。 |
| [educlopez/Polaris](https://github.com/educlopez/Polaris) | 内容 schema 强制 challenge、solution、results、coverAlt、date 等字段；首页从 site.json 读取身份与经历。 [源码1](https://github.com/educlopez/Polaris/blob/c78407dd8e678d10697366a4f11d95030bf7d69f/src/content.config.ts#L9) / [源码2](https://github.com/educlopez/Polaris/blob/c78407dd8e678d10697366a4f11d95030bf7d69f/src/pages/index.astro#L3) | 约束案例数据完整性；将身份、经历、项目和联系数据集中维护。<br>**建议**：新增轻量 CaseGuide 关系表和静态校验；不迁移 Astro 或照抄示例结果。 | MIT。源码中的 hover 才显示经历不适合直接沿用；访客必须可通过点击或键盘阅读。 |


## 摄影与图像作品集：材料、比例和内容配置

| 项目 | 核读事实与源码 | 可借鉴机制与本站建议 | 许可及边界 |
| --- | --- | --- | --- |
| [rampatra/photography](https://github.com/rampatra/photography) | 首页模板按 fulls 原图生成 thumb 链接，缩略图与原图目录分离；README 描述 EXIF 展示与批量缩略图流程。 [源码](https://github.com/rampatra/photography/blob/f2c2d5e18debfbb947ce510d8e7f9ded0520d2f0/index.html#L19) | 浏览图与检查原图分别加载；真实照片元数据可增加内容信息。<br>**建议**：保留缩略图→大图流程；不为渲染图虚构 EXIF 或摄影属性。 | GPL-3.0。不引入整套 GPL 模板；其空 alt 和示例表单不作为无障碍参考。 |
| [JoaoFranco03/photography-portfolio](https://github.com/JoaoFranco03/photography-portfolio) | 首页以作品/关于/联系三入口组织，图片通过统一 data-fancybox 组成图集，并提供具体 alt。 [源码](https://github.com/JoaoFranco03/photography-portfolio/blob/9de2a6633f4bca2c2166ff788c132fc2cf2564d9/index.html#L79) | 清晰导航与统一图集入口；使用明确图像说明。<br>**建议**：仅参考导航与图片语义，不拷贝模板代码或 Unsplash 示例资产。 | 许可冲突：LICENSE 为 MIT；README 写 GPL-3.0。两处声明不一致，未擅自选择更宽松许可；复用需作者澄清。 |
| [andyzg/gallery](https://github.com/andyzg/gallery) | Config 按 album 保存照片；Renderer 将数据与布局分开；VerticalRenderer 按当前最短列放图，压缩图与原图分别处理。 [源码](https://github.com/andyzg/gallery/blob/a2cde3140b27b3164ec1ceb4226c7707eda7aba6/js/gallery.js#L5) | 相册/项目是内容单位；图像比例决定排布而非每张统一裁切。<br>**建议**：案例按场景/细部/结构组织；保留原图比例，用 CSS Grid 独立实现。 | MIT。示例不保证图片权利与无障碍完整性；不移植 innerHTML 拼装与随机排序。 |
| [ECarry/photography-website](https://github.com/ECarry/photography-website) | SliderView 对第一张图 eager/high、其余 lazy；有空态；ProfileCard 从 siteConfig 获取身份与联系链接。 [源码1](https://github.com/ECarry/photography-website/blob/1b987df6a66b3731dd15060f6abe28969793f553/src/modules/home/ui/views/slider-view.tsx#L21) / [源码2](https://github.com/ECarry/photography-website/blob/1b987df6a66b3731dd15060f6abe28969793f553/src/modules/home/ui/components/profile-card.tsx#L8) | 第一张主图优先；身份信息只有一个来源；加载与空状态明确。<br>**建议**：用于首页主图和联系区；不引入其账号、地图、数据库和照片后台。 | MIT。读取的是具体组件行为，不将 README 技术版本或性能营销语当作本站已验证事实。 |
| [LekoArts/gatsby-starter-portfolio-emilia](https://github.com/LekoArts/gatsby-starter-portfolio-emilia) | gatsby-config 指向 Emilia 主题；README 的项目规范用 cover/date/title/areas/slug，并支持独立 about 文案。 [源码](https://github.com/LekoArts/gatsby-starter-portfolio-emilia/blob/616037c5207da1b111eef0c22ef2d3bea9e9b7dd/gatsby-config.ts#L7) | 封面、参与领域、日期和稳定链接成为最小项目身份。<br>**建议**：保留现有 Markdown，完善元数据校验和摘要入口。 | 0BSD。核心渲染在外部 theme 包；本轮只核读 starter 配置与内容规范，未声称运行主题。 |
| [LekoArts/gatsby-starter-portfolio-jodie](https://github.com/LekoArts/gatsby-starter-portfolio-jodie) | MDX 包含 title/shortTitle/category/color/cover/date；modify-grid 接收带 slug、title、cover、类型的数组。 [源码1](https://github.com/LekoArts/gatsby-starter-portfolio-jodie/blob/f023db23e3d4c157741c92d2e54d6027922dc830/src/%40lekoarts/gatsby-theme-jodie/utils/modify-grid.ts#L11) / [源码2](https://github.com/LekoArts/gatsby-starter-portfolio-jodie/blob/f023db23e3d4c157741c92d2e54d6027922dc830/content/projects/neon/index.mdx#L3) | 短标题供目录、长标题供案例；颜色与分类分开；展示顺序可策展。<br>**建议**：宽图窄图交错但 DOM 阅读顺序稳定；每个项目可选强调色。 | 0BSD。README 的对比度主张未在本站实测；实际颜色仍需独立检查。 |
| [LekoArts/gatsby-starter-portfolio-emma](https://github.com/LekoArts/gatsby-starter-portfolio-emma) | 示例 MDX 将 client/title/cover/date/service/color 放在 frontmatter，正文独立；README 定义自动导航的附加页面。 [源码](https://github.com/LekoArts/gatsby-starter-portfolio-emma/blob/6ac22235ef6a19e23a4c3027f18cf9bc7fce4111/content/projects/emma/index.mdx#L2) | 职责/服务与客户字段分离；关于、联系与项目正文不混写。<br>**建议**：将 role/credits/status 放在案例事实区，并保留明确下载入口。 | 0BSD。示例包含虚构人物和测试段落；只能参考结构，不能作为个人履历。 |


## 创意动效与空间图集：强视觉的状态逻辑

| 项目 | 核读事实与源码 | 可借鉴机制与本站建议 | 许可及边界 |
| --- | --- | --- | --- |
| [codrops/OnScrollTypographyAnimations](https://github.com/codrops/OnScrollTypographyAnimations) | 源码按 data-effect1 到 data-effect15 分组，对拆分文字施加不同滚动与旋转效果。 [源码](https://github.com/codrops/OnScrollTypographyAnimations/blob/af28d61d1f8d3d117f5d1e9b09d5209e20a1a212/src/js/index.js#L21) | 标题可以建立进入节奏；效果与具体节点明确绑定。<br>**建议**：只选择一个短标题揭示方案；中文正文不拆字滚动。 | MIT。示例图片来自 Unsplash；演示数量不等于应在作品集中全部使用。 |
| [codrops/ImageExpansionTypography](https://github.com/codrops/ImageExpansionTypography) | effect-1 先测量 type--open 状态，再以 Flip/ScrollTrigger 将文字内图像展开。 [源码1](https://github.com/codrops/ImageExpansionTypography/blob/0d614791f94198bcab655762b26a3cb85da851f4/js/index.js#L1) / [源码2](https://github.com/codrops/ImageExpansionTypography/blob/0d614791f94198bcab655762b26a3cb85da851f4/js/effect-1/expandImageEffect.js#L9) | 从标题中的小图进入作品主视觉，保持图像身份连续。<br>**建议**：作为首页唯一主转场，使用本站原图、Motion/CSS，减少依赖。 | MIT。README 明确演示图来自 Midjourney；不能把它们当真实摄影或自己的项目。 |
| [codrops/TypographyMotion](https://github.com/codrops/TypographyMotion) | Home/About 切换通过暂停时间线 play/reverse 完成，文字、背景与图片在同一 switchtime 交接。 [源码](https://github.com/codrops/TypographyMotion/blob/800c4b530783565b69619b8a9033e0ca069207ec/src/js/index.js#L50) | 界面状态改变与动效方向一致，返回是同一状态的逆过程。<br>**建议**：用于简短导航/展开状态；不移植长段文字逐字延迟。 | MIT。示例是对 Thibaud Allie 动效的复现，文档保留原始设计出处。 |
| [codrops/InlineMenuLayout](https://github.com/codrops/InlineMenuLayout) | menuItems 与 contentItems 按位置配对，保存 currentItemIndex；点击显示对应内容，返回恢复目录状态。 [源码](https://github.com/codrops/InlineMenuLayout/blob/ccfb1d128002efe53c83703aaa5fbb438036259f/src/js/menuController.js#L40) | 密集文字目录与大图预览形成强弱对比；选中项身份可保持。<br>**建议**：目录行预览、明确序号和案例入口；增加 focus/touch 等价路径。 | MIT。源码鼠标交互不能直接当完整可访问性实现；本轮需独立补齐键盘与焦点恢复。 |
| [codrops/ContentLayoutTransition](https://github.com/codrops/ContentLayoutTransition) | Slideshow 以 Flip 在 stack 与 slides 容器之间转移图像；isOpen/isAnimating 避免重复操作。 [源码](https://github.com/codrops/ContentLayoutTransition/blob/ef96cdc22f1d7b8b426f73283c6c70e163eb9b29/src/js/slideshow.js#L52) | 缩略材料进入放大阅读时保持来源关系；明确展开/关闭状态。<br>**建议**：案例单个资料组可展开；使用已有大图查看器，不复制 wheel/touch 拦截关闭。 | MIT。源例会拦截滚动以关闭图集，与本站长文阅读冲突。 |
| [codrops/TooltipTransition](https://github.com/codrops/TooltipTransition) | 源码区分 hover 预览、click 图集、fullscreen 放大三种状态，沿同一图片做 Flip 过渡。 [源码](https://github.com/codrops/TooltipTransition/blob/689dfac88af4c81f4ba11d62cacc25d268c5d789/src/js/index.js#L49) | 预览→阅读→检查细节是逐层加深，而不是三个无关页面。<br>**建议**：目录 hover/focus 只预览，点击进入案例，图片按钮进入大图检查。 | MIT。悬停信息不能是唯一内容入口；移动端需明显点击操作。 |
| [codrops/FullscreenLayoutPageTransitions](https://github.com/codrops/FullscreenLayoutPageTransitions) | boxlayout 通过 data-panel 将作品和详情对应；section 放大、详情上移，带 next/close。 [源码](https://github.com/codrops/FullscreenLayoutPageTransitions/blob/1dfb62faf91a9f548240438622161d407db6c05f/js/boxlayout.js#L5) | 入口、详情、返回对象之间保持显式映射。<br>**建议**：仅借鉴可逆展开和目标映射，沿用现有路由历史与焦点。 | README 与源码头声明 MIT；缺独立完整许可证。不把源例 span 控件和 transitionend 依赖照搬到生产导航。 |
| [codrops/Exhibition](https://github.com/codrops/Exhibition) | 房间与说明由 currentRoom 统一索引；鼠标倾斜、导航、菜单与信息面板有独立状态。 [源码](https://github.com/codrops/Exhibition/blob/e10dca0ae1d32ca808e41fef0788e815b6539af7/js/main.js#L5) | 每章像独立展室，图片和说明始终描述同一对象。<br>**建议**：借鉴章节层次与少量透视；不引入走房间式必经导航。 | 许可冲突：源码头 MIT；README 自定义分发限制。仅研究机制；不将整个仓库统一写为 MIT，示例资产另有来源。 |
| [bruno-quintela/portfolio-webgpu](https://github.com/bruno-quintela/portfolio-webgpu) | GalleryProvider 管理 galleryData，startNewGallery 回调同步当前图与选中图片；UI拆出标题、段落、计数器。 [源码1](https://github.com/bruno-quintela/portfolio-webgpu/blob/da71cc3ddb54a7a7b0878dc6aa647dd836163feb/components/Gallery/Gallery.tsx#L6) / [源码2](https://github.com/bruno-quintela/portfolio-webgpu/blob/da71cc3ddb54a7a7b0878dc6aa647dd836163feb/components/Gallery/components/KeyboardShortcuts.tsx#L3) | 画布状态与 DOM 说明共享同一索引，视觉与文本保持一致。<br>**建议**：适合检验现有 3D/DOM 联动；不引入 WebGPU 或演示调试键。 | 未发现独立代码许可证。仓库名称不证明运行时采用 WebGPU；已读组件名为 WebGLCanvas，底层兼容性未运行验证。 |
| [codrops/ScrollBlurTypography](https://github.com/codrops/ScrollBlurTypography) | effect-1 对拆字内容从 blur(10px)/brightness(0%) 变为清晰，并在 resize 后重建。 [源码](https://github.com/codrops/ScrollBlurTypography/blob/3e64d4bdae65b1f291e21a9a9c4b2ac6258c45c1/js/effect-1/blurScrollEffect.js#L1) | 可以比较文字进入方式，但不能牺牲读者当前可读性。<br>**建议**：本轮不采用模糊正文；短标题用位移/遮罩替代。 | MIT。滤镜与逐字 scrub 带来可读性及重绘负担；实际负担未做基准测量。 |
| [codrops/RepetitiveTypography](https://github.com/codrops/RepetitiveTypography) | 源码建立中心、重复中心、上下多个标题行，并将行对应内容条带和标题。 [源码](https://github.com/codrops/RepetitiveTypography/blob/9bd910cadc638ac3a855690600eecf485504b6e1/src/js/index.js#L12) | 重复短词可表现分类系统与节奏，但需要语义主次。<br>**建议**：最多作为一处装饰章节标识，重复文本 aria-hidden，保留一个真实标题。 | MIT。不把重复文本用于核心导航或长正文；目前为候选，非必装依赖。 |
| [codrops/Scroll3DGrid](https://github.com/codrops/Scroll3DGrid) | applyAnimation 按 grid 类型设置 perspective、rotation、z 和 scrub；源码还单独初始化 Lenis。 [源码](https://github.com/codrops/Scroll3DGrid/blob/69718a2eff87b32ab19764b3a6d7b3773dab6af3/js/index.js#L10) | 在图像组合中建立远近层次；可从平面目录过渡到精选图像。<br>**建议**：仅采纳低幅透视与版式节奏；保持原生滚动及低动态静态布局。 | MIT。README 演示图由 Midjourney 生成；不复制图像或持续随机大幅运动。 |


## 内容结构的共同点

可借鉴的不是某套个人经历，而是内容身份与呈现分工：

1. **一个稳定 slug 对应一个项目。** 列表、正文、媒体、语言版本和下一步都引用它。本站已经有这一基础，不需要新增 CMS。
2. **目录摘要与案例正文用途不同。** 目录负责让人选择；案例用问题、约束、行动和材料解释判断；图集负责检视细节。
3. **职责、客户/合作方、阶段与产物分开。** 模板里的 client/service/results 字段不能被当作自己的事实。本站已有 role/credits/status 应保持唯一来源。
4. **图像有身份与说明。** caption 和 alt 不只是装饰；它们帮助确认眼前是哪一版、哪个视角、什么材料。路径标签无法证明照片、量产或实测。
5. **关于区负责建立可信的能力关联。** 优先写做过的行动并链接案例，工具名与联系方式集中维护。
6. **相关案例要有关系理由。** 同一设计问题可以跨品牌、产品和数字界面；推荐理由必须是编辑判断，并能由展示材料支持。

具体字段、数据映射、首页顺序和验证点见 [logic-architecture-v4.md](logic-architecture-v4.md)。

## 未采用的机制与原因

- **全站自定义滚动或无限走廊**：几份源码将 wheel/touch 与视图状态紧密绑定。本站有长文、筛选和大图，原生历史与键盘阅读更重要。本轮借鉴视觉层次，保留原生滚动。
- **正文逐字模糊、随机旋转和长时间 stagger**：ScrollBlurTypography/OnScrollTypography 的代码能实现这些效果，但这不证明适合中文案例。正文保持稳定；短标题可以有一次轻量进入。
- **把每个卡片都变成实时三维场景**：增加纹理、状态和降级维护；本轮现有人物足以承担三维识别，作品材料以清楚可读为主。
- **把摄影模板的 EXIF 当作真实感来源**：EXIF 适合有来源的实拍照片；产品渲染、示意图和保存截图不能添加虚假的摄影元数据。
- **为研究采用 Astro/Gatsby/Nuxt/新 CMS**：这些框架说明内容组织方法，不构成迁移本站 React/Vite 的理由。
- **导入作者完整项目和品牌资产**：Hamish、ITom、logotip4ik 已明确区分代码与资产许可；其余仓库的宽松代码许可也不自动授予案例、字体、照片或商标使用权。

## 许可冲突与不确定项

- **David Heckhoff**：全文限定个人/教育使用，要求在源码、README 与公开部署保留可见署名；商业使用或大量复用须作者许可。记录为自定义限制许可，未当成 MIT。
- **JoaoFranco03**：独立 LICENSE 为 MIT，README 却写 GPL-3.0 且引用不同文件名。两者冲突未解决，本轮不复用代码。
- **Codrops Exhibition**：源码头写 MIT，README 对原样再分发及插件化有额外限制。保留冲突，不能只选择更宽松的一处。
- **Codrops FullscreenLayoutPageTransitions**：README 与源码头写 MIT，但没有独立完整许可文本。可研究逻辑；若未来复制代码，应补齐并明确适用声明。
- **Iuri de Paula**：MIT 文件的版权年份/姓名仍是占位文字；README 又明确标注实现年代。记录其缺口，研究叙事方法，不假定维护状态与现代兼容性。
- **五个缺少独立授权的公开源码仓库**：bizarro/bruno-arizio、bizarro/bizar.ro、vaalentin/2015、xdesro/true-terrors、bruno-quintela/portfolio-webgpu。公开可读与允许复用是不同事实，本轮没有复制。
- **AI 演示图**：ImageExpansionTypography 与 Scroll3DGrid 的 README 明确注明 Midjourney。只借鉴布局机制，不能把这些图当作真实照片来解决本站真实感问题。

## 实施判断

最强的反对意见是：创意作品集本来就依赖视觉新奇，过度限制效果可能把网站做成普通资料库。这个问题成立，因此本轮用四视角主视觉、尺度交替的精选、网格/列表目录和与解释同步的局部交互保留识别度。

同时，源码核读显示这些效果通常依赖明确的当前项、展开状态、返回路径和材料身份。设计冲击力应建立在这些关系上。首页负责引起兴趣，案例负责证明判断，原图负责提供可检查材料；三者连贯比堆叠更多动画更有价值。

**置信度**：对引用文件、许可文本与所述源码机制为高；对本站设计收益为设计判断，需通过实际版面和交互检查评估；对外部站点的实时表现、真实设备性能、项目商业效果均未验证。
