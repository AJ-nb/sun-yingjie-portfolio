# 开源机制检索与采用记录 v3

核查日期：2026-09-15。目标是让作品集的阅读、图像检查、三维展示和状态反馈更完整，而不是增加未经完成的项目经历或重复依赖。

## 检索方法与证据

执行了八组 GitHub 仓库搜索，得到 70 个去重候选；另对 35 个与现有技术栈和创意方向直接相关的上游仓库核对名称、描述、归档状态及许可证文件。搜索词为 `react portfolio animation`、`scrollytelling javascript`、`image comparison slider react`、`react lightbox accessibility`、`gltf optimize validate`、`scroll typography animation`、`self host font npm` 和 `webgl portfolio interactive`。

每组最多取十项，按 stars 排序仅用于定位入口，不作为质量评分。搜索包含无关或许可不明结果；70 项不等于70项完成许可审计，也不表示穷尽 GitHub。采用判断以功能适配、现有架构、内容需要和可核对许可为准。

- [搜索记录](open-source-search-v3.json)：检索词、返回范围与候选；过长的描述截至400字符，仓库身份不改写。
- [35仓库核查快照](open-source-verification-v3.json)：GitHub元数据、许可证文件路径、Git blob SHA与SHA-256。没有LICENSE端点的多字体仓库改查具体字体OFL。
- [分发许可清单](../web/public/licenses/inventory.json)：实际安装版本、文件来源和校验值。安装并不等于每项均进入最终浏览器包。

## 实际采用与工具链

| 上游仓库 | 采用机制 | 本轮取舍与许可核对 |
| --- | --- | --- |
| [Motion](https://github.com/motiondivision/motion) | 页面进入、布局与状态过渡 | 保留 `framer-motion` 11.18.2，避免增加第二套动画系统；MIT原文随版本保留。 |
| [Three.js](https://github.com/mrdoob/three.js) | 三维场景、相机、光照与模型 | 使用0.169.0；三维负责人物空间关系，正文仍可独立阅读；MIT。 |
| [React Three Fiber](https://github.com/pmndrs/react-three-fiber) | React中的三维渲染生命周期 | 8.18.0；复用既有场景。npm包未含根LICENSE，从匹配 `v8.18.0` 标签补取MIT原文。 |
| [Drei](https://github.com/pmndrs/drei) | 场景与模型辅助能力 | 9.122.0；复用已使用的辅助能力，不把所有示例效果装进首页；MIT。 |
| [React Postprocessing](https://github.com/pmndrs/react-postprocessing) | 现有场景后处理 | 2.19.1；保留已有架构，表现服从材质与轮廓；MIT。 |
| [Zustand](https://github.com/pmndrs/zustand) | 现有状态组织 | 4.5.7；不为案例实验另引一套全局状态库；MIT。 |
| [Yet Another React Lightbox](https://github.com/igordanchenko/yet-another-react-lightbox) | 图集、缩放、图注与计数 | 3.32.2；按需加载，用于真实作品图检查；MIT。 |
| [img-comparison-slider](https://github.com/sneas/img-comparison-slider) | 明确目的的双图比较 | 8.0.7；只比较有说明依据的状态，不把不同视角当成精确测量；MIT，上游许可blob已记录。 |
| [Lucide](https://github.com/lucide-icons/lucide) | 统一操作图标 | `lucide-react` 1.46.0；原文包含ISC与Feather衍生图标的MIT，二者同时保留。GitHub的NOASSERTION不能被简化为“未知即可忽略”。 |
| [Fontsource](https://github.com/fontsource/fontsource) | 本地字体包的组织方式 | Fontsource代码为MIT；实际字体使用各自OFL，不把包工具许可当字体许可。 |
| [Fontsource font-files](https://github.com/fontsource/font-files) | Bodoni Moda与Noto Sans SC包 | 两个包均5.3.0；复制包内OFL，并对照Google Fonts具体字体目录。 |
| [Bodoni](https://github.com/indestructible-type/Bodoni) | 拉丁展示字体来源 | Bodoni Moda字体原文署名指向该项目；SIL OFL1.1。使用字体，不复制其品牌作品。 |
| [Noto CJK](https://github.com/notofonts/noto-cjk) | 中文字体来源体系 | 顶层LICENSE端点不足以判断整个仓库；实际Noto Sans SC以包内及具体目录OFL1.1核对。 |
| [Google Fonts](https://github.com/google/fonts) | 字体原始许可交叉核对 | 核对 `ofl/bodonimoda/OFL.txt` 与 `ofl/notosanssc/OFL.txt`；不作全仓库统一许可推断。 |
| [Playwright](https://github.com/microsoft/playwright) | 浏览器行为与回归检查 | 1.63.0开发工具；保留Apache2.0、NOTICE及第三方文本。安装与实际测试结果分开记录。 |
| [axe-core](https://github.com/dequelabs/axe-core) | 自动无障碍检查 | 4.13.0；MPL2.0。自动检查提供问题线索，键盘、焦点与阅读顺序仍需实际检查。 |
| [axe-core-npm](https://github.com/dequelabs/axe-core-npm) | Playwright无障碍集成 | `@axe-core/playwright` 4.13.0；MPL2.0，与底层axe-core分别留存文本。 |
| [glTF Transform](https://github.com/donmccurdy/glTF-Transform) | 模型检查与优化 | CLI/core 4.5.0；MIT。优化前后需保留人物特征、相机和动画关系，不能只比较文件大小。 |
| [glTF Validator](https://github.com/KhronosGroup/glTF-Validator) | glTF规范检查 | 2.0.0-dev.3.10；Apache2.0及NOTICES。规范通过不等于画面、人体或动画表现通过。 |
| [sen-3d-resume](https://github.com/dayinji/sen-3d-resume) | 既有三维简历的代码基础 | 保留 `LICENSE.sen` 与 `NOTICE.sen`。上游明确仅代码使用MIT；作者肖像、人物模型、简历与作品资产不获该许可授权。 |

版本依据实际安装包与锁文件记录。组件是否在最终构建中保留，以最终代码与产物检查为准，不把研发工具表述为访客功能。

## 创意参考：理解机制，不增加运行依赖

| 上游仓库 | 借鉴的问题 | 实施方式与边界 |
| --- | --- | --- |
| [ScrollBasedLayoutAnimations](https://github.com/codrops/ScrollBasedLayoutAnimations) | 图像从局部阅读过渡到整体布局 | 参考滚动与布局切换的对应，使用现有Motion与CSS；其GSAP/Flip示例不整套引入；MIT。 |
| [LinesToLayout](https://github.com/codrops/LinesToLayout) | 文字目录进入大图案例时如何保持联系 | 参考目录、图像和详情的连续阅读，不使用示例人物、图片或文案；MIT。 |
| [OnScrollTypographyAnimations](https://github.com/codrops/OnScrollTypographyAnimations) | 章节展示字的节奏 | 只用于短标题，中文正文保持稳定；MIT。 |
| [Scroll3DGrid](https://github.com/codrops/Scroll3DGrid) | 透视图集的空间层次 | 参考有限透视与图像排列，避免每张作品都成为持续运动画布；MIT。 |
| [Scrollama](https://github.com/russellsamora/scrollama) | 讲解步骤与视觉状态对应 | 参考IntersectionObserver式滚动叙事，用浏览器能力和现有状态实现；MIT。 |
| [Code Hike](https://github.com/code-hike/codehike) | Markdown讲解如何关联可操作内容 | 借鉴正文与演示的组织，不迁移MDX内容架构；MIT。 |
| [XYFlow](https://github.com/xyflow/xyflow) | 任务节点、过程与失败状态的可读性 | 小型固定流程用轻量SVG/组件表达，不加入通用节点编辑器；MIT。 |

这些来源是实现方法的研究对象，不是孙英杰新增完成的设计项目。个人作品、品牌、图像、场景和研究数据保持各自署名；代码许可不会自动覆盖演示资产。

## 比较后未采用

| 上游仓库 | 可解决的问题 | 本轮不引入的原因 |
| --- | --- | --- |
| [Embla Carousel](https://github.com/davidjerleke/embla-carousel) | 触摸轮播与拖动 | 与图集和现有原生滚动职责重复；MIT。 |
| [Lenis](https://github.com/darkroomengineering/lenis) | 平滑滚动 | 现有横向章节、正文纵向滚动与移动端手势已有交互约束，减少滚动层叠；MIT。 |
| [React Spring](https://github.com/pmndrs/react-spring) | 弹簧式React动画 | 与Motion重复，避免两套时序与动画参数；MIT。 |
| [Theatre.js](https://github.com/theatre-js/theatre) | 可视化动效时间线 | 当前案例无需额外编辑器和时间线维护；Apache2.0。 |
| [Lighthouse](https://github.com/GoogleChrome/lighthouse) | 实验室性能检查 | 作为核查候选记录；当前核心自动检查采用Playwright/axe，不能将安装列表当作Lighthouse已运行；Apache2.0。 |
| [Satori](https://github.com/vercel/satori) | HTML/CSS转SVG | 文档由现有导出流程产生，新增转换层无必要；MPL2.0。 |
| [glTF JSX](https://github.com/pmndrs/gltfjsx) | 模型转JSX | 已有相机、眼球与动画节点，额外代码生成会增加迁移成本；MIT。 |
| [Leva](https://github.com/pmndrs/leva) | 开发者参数面板 | 不把场景调试参数放进访客阅读流程；MIT。 |

搜索中出现的完整作品集模板、React Native控件、无关配置仓库和未明示许可候选未用于代码或资产复制。未采用项不代表项目质量差，只表示与本轮目标的额外收益不足。

## 分发文本与核查限制

`web/public/licenses/` 保留216个锁定包的224份许可或声明文本，覆盖208个运行依赖和8个选定开发工具包，另保留两份字体源OFL及Sen原始通知。大部分文本直接复制自安装包；缺失根文本的依赖记录具体上游来源与Git blob，不把默认分支许可伪称成匹配版本标签。

一个保留缺口：间接依赖 `stats-gl` 2.4.2 在package.json和README声明MIT，但安装包和实时上游均未提供独立完整LICENSE文本。已保留原声明、作者字段和这一边界，没有虚构版权年份或授权文字。项目源码未直接引入StatsGl面板；是否被最终打包需由产物检查确认。

发布构建应同时携带 `THIRD_PARTY_NOTICES.md` 与 `licenses/`。新下载件或依赖版本改变后，应更新对应文本与清单校验值。现有依赖许可不授予商业品牌、第三方产品、用户肖像或合作作品的新使用权。
