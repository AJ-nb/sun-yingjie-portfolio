# 全来源覆盖与公开版去向

来源原件核对快照：`2026-09-14T17:09:27.018557+00:00`；最终本地构建快照：`2026-09-14T17:52:33.590390+00:00`。范围为本项目现有来源清单、当前60份案例Markdown及最终本地构建；不声称覆盖整台电脑或GitHub账户中的所有项目。

当前 **30 个案例 / 60 份双语正文**均有来源对应。现有清单 **159 条来源记录 / 154 种文件内容**均有明确去向；在本次审阅范围内，未发现已确认的独立作品被静默丢弃。XHS Operations OS作为规划候选保留，户外电源PPTX作为历史研究归档，未冒充已落地产品。

最终本地构建实际选择 **164 项媒体资产，共 55,384,994 字节（52.82 MiB）**。本文“公开版”指已纳入该本地构建的资产；远端部署结果由主代理交付记录提供。

机器可读逐项记录：`private/sources/coverage.json`。完整SHA256、源文件与归档校验、每页PDF去向、PPTX每页和嵌入图、164项构建资产及90项未选择中间文件均记录其中。新增交付与五张参考图独立登记，不并入历史159条作品来源。

## 数量与统计口径

| 来源组 | 记录数 | 字节数 | 体积 |
| --- | ---: | ---: | ---: |
| 旧站资源 | 32 | 357,682,167 | 341.11 MiB |
| 本地PDF原件 | 4 | 186,416,555 | 177.78 MiB |
| 本地媒体 | 14 | 91,379,191 | 87.15 MiB |
| PPTX原件 | 2 | 5,251,227 | 5.01 MiB |
| 工程原件 | 11 | 23,283,668,869 | 22205.04 MiB |
| 品牌GitHub原件 | 30 | 30,288,572 | 28.89 MiB |
| 数字项目本地证据 | 66 | 3,214,011 | 3.07 MiB |
| 合计（记录口径） | 159 | 23,957,900,592 | 22848.03 MiB |

另有旧站HTML与Sen原项目的实现历史清单/规则备份，用作网站重建支持；它们不构成作品内容原件，也不计入159条作品来源记录。相关元数据校验记录在JSON的`implementationSupport`。

来源字节按原件/归档记录各计一次，未把公开衍生图、页渲染、压缩包内部文件、缩略图或PPTX媒体再次加进原件总量。记录之间仍可能存在内容重复；159条记录与154种内容不是作品数量。11个工程文件属于2组按文件名关联的模型资料，其中管道机器人为10卷分卷压缩包。

案例分类：工业与产品 17、商业空间 2、品牌视觉 2、数字产品 7、创作实验 2。PDF来源共5份（本地4份加旧站1份）、128页；PPTX共2份、21页。

## 实际构建边界

`web/vite.config.ts` 的生产构建关闭自动public复制；`scripts/stage-public.mjs`从正文引用、封面、30张缩略图和4项固定资产建立选择清单。`web/dist/media-index.json` 与当前正文推导的选择集合一致，逐项文件大小与SHA256核对一致。

| 构建组成 | 项数 |
| --- | ---: |
| 案例图片与视频（按URL去重） | 130 |
| 案例缩略图 | 30 |
| 头像GLB、头像静帧、作品集PDF、简历PDF | 4 |
| 合计 | 164 |

`web/public/`当前有 254 个文件，其中 90 个、29,367,890字节（28.01 MiB）未纳入构建。它们主要是精确重复的旧版页、个人资料页、替代展板图与头像审阅图。目录名称public不构成已发布证据。

下载作品集已替换为新排版的40页版本：30个案例介绍、6个精选细节页，以及封面、目录、个人实践与联系页。全部30个案例均有目录跳转和网页链接；它不是全部原PDF页面、图片及视频的完整离线归档。原51页和63页等PDF完整保存在私有来源中。原p.50总览不再整页放入下载件，其9张拆出展板作为对应案例展示。JSON的`pdfPages[].editorialCasePages`仅记录关联案例在新册的页码，不表示原页在该页完整复现；旧60页下载页码字段已移除。

当前公开头像静帧来自用户提供的生成参考图 `avatar/references/user-generated/landscape.png`，由 `scripts/prepare_web_assets.py`转换为WebP；不是新头像模型的正面渲染。封面也使用该横版图。GLB与静帧是本次制作资产，另列构建清单，不计入历史作品来源或新增作品案例。

## 本次新增交付与参考图

下列是本次制作的交付与输入，不加入159条历史来源、154种历史文件内容或30个作品案例的统计。机器记录分别为`newDeliverables`和`currentProductionReferences`。

| 交付组 | 文件 | 字节数 | 页数 | SHA256摘要 |
| --- | --- | ---: | ---: | --- |
| 作品集 | `deliverables/portfolio/sun-yingjie-portfolio.pdf` | 16,945,242 | 40 | `9ac44ac3533e` |
| 简历 | `deliverables/resume/sun-yingjie-resume.pdf` | 289,953 | 1 | `a62d7d2b2573` |
| 简历 | `deliverables/resume/sun-yingjie-resume.docx` | 38,558 | 可编辑DOCX | `5c71f5171262` |

作品集40页已逐页视觉检查并核对30个目录内链、30个书签及32个URI链接，详见`docs/portfolio-qa.md`。简历PDF为1页，同时保留可编辑DOCX及内容JSON；简历的内容与版式记录见`docs/resume-notes.md`。本次对这些交付重新核对文件摘要与公开下载副本。

| 用户提供的生成参考图 | 尺寸 | 字节数 | SHA256摘要 |
| --- | --- | ---: | --- |
| `front.png` | 1254 × 1254 | 2,573,781 | `740c6108f98d` |
| `three-quarter.png` | 1254 × 1254 | 2,509,000 | `9798b0a3cc97` |
| `side.png` | 1254 × 1254 | 2,402,767 | `e5cebdaecca7` |
| `back.png` | 1254 × 1254 | 2,598,469 | `30697a84d855` |
| `landscape.png` | 1586 × 992 | 2,257,457 | `48f677150511` |

五张生成图的导入记录与归档副本SHA256一致。它们用于头像视觉方向；横版landscape图也用于首页静帧与作品集封面，不是测量扫描或解剖精度证据。最终GLB为6,803,224字节，其public与dist副本一致；本报告不据此认证人物相似度。

## 三十个案例及来源对应

| 案例 | 名称 | 来源组 | 引用资产数 |
| --- | --- | --- | ---: |
| aesthetic-atlas | Eagle 审美图谱 | 品牌/数字 | 2 |
| arcteryx | Arc’teryx Alpha Center 橱窗 | 旧站 | 1 |
| baobab-glow | BAOBAB GLOW · 便携照明 | PDF/本地 | 1 |
| bat-quad | 蝠型四轮越野电动摩托车 | PDF/本地 | 1 |
| cloudwing | 云端之翼 · 垂直起降载人飞行器 | PDF/本地 | 1 |
| construction-recycler | 模块化建筑废料回收装备 | PDF/本地 | 1 |
| ecological-harvest | 生态丰收漫游者 · 落叶回收转换清洁车 | PDF/本地 | 1 |
| formline | 构线 Formline | 品牌/数字 | 2 |
| go-glow | GO GLOW · 模块化个护 | PDF/本地 | 9 |
| hermes | Hermès 季节橱窗 | 旧站 | 12 |
| huhu-care | HUHU CARE · 儿童呼气检测概念 | PDF/本地 | 13 |
| image-2-5-xhs | 图像生成与连续编辑评测 | 品牌/数字 | 3 |
| jimu-studio | JiMu Studio · 玉米芯板材模块化家具 | PDF/本地 | 6 |
| lensflow | 镜序 Lensflow | 品牌/数字 | 2 |
| lighting | 铝型材灯具系统 | 旧站 | 11 |
| lingmu | LINGMU · 无臂人士洗浴概念 | PDF/本地 | 7 |
| little-orange | 小橘运动加油站 | PDF/本地 | 1 |
| periastra | Periastra 相机包品牌标志 | 品牌/数字 | 4 |
| plant-companion | 植遇相伴 · 办公轻智能健身 | PDF/本地 | 12 |
| plumber | 引渡者 · 管道危机24小时 | PDF/本地 | 18 |
| polar-wing | 极翼 · 载人级无人驾驶eVTOL | PDF/本地 | 1 |
| purewater-rolling-filter | PureWater · 滚动取水过滤设备 | PDF/本地 | 1 |
| rendering-studies | 渲染与动态影像习作 | PDF/本地、旧站 | 8 |
| resume-formatter | Resume Formatter 简历编辑器 | 品牌/数字 | 3 |
| visual-archive | 视觉档案 | 品牌/数字 | 2 |
| water-guardian | 水中卫士 · 清藻机 | PDF/本地 | 1 |
| water-walking-bath | 适老型水中漫步浴缸 | PDF/本地 | 1 |
| yantai | 砚台 · 产品造型学习工具 | 品牌/数字 | 1 |
| yelisi | 夜礼司 · 品牌识别与身体装置研究 | 品牌/数字 | 3 |
| yuju | 雨聚 · 共享雨伞应用 | PDF/本地 | 1 |

公开案例定稿另见`docs/content-finalization.md`：已审阅60份并整理其中54份占位文案，未知分工保留在`private/sources/contribution-uncertainties.json`。案例文件摘要已更新，图片与视频选择集合未变。

角色、合作署名及阶段以双语案例正文为准。本表确认资料对应，不把展示图当作制造、运行、临床或商业绩效验证。

## PDF逐页去向

逐页记录位于JSON的`pdfPages`，共128条。下表将连续且去向相同的页面合并显示；6个差异页单独列出，未省略任何页。

| 来源 | 页码 | 案例/去向 | 处理 |
| --- | --- | --- | --- |
| portfolio-51 | 1 | 原文件归档 | 封面/结束页归档 |
| portfolio-51 | 2 | 履历支持 | 个人资料私有 |
| portfolio-51 | 3–17 | plumber | 公开案例页面 |
| portfolio-51 | 18–28 | huhu-care | 公开案例页面 |
| portfolio-51 | 29–36 | go-glow | 公开案例页面 |
| portfolio-51 | 37–43 | lingmu | 公开案例页面 |
| portfolio-51 | 44–49 | jimu-studio | 公开案例页面 |
| portfolio-51 | 50 | 9个课程展板案例 | 拆出9个展板案例 |
| portfolio-51 | 51 | 原文件归档 | 封面/结束页归档 |
| office-fitness | 1–12 | plant-companion | 公开案例页面 |
| rendering-sheet | 1 | rendering-studies | 公开案例页面 |
| resume-source | 1 | 履历支持 | 个人资料私有 |
| legacy-full-portfolio | 1 | 原文件归档 | 封面/结束页归档 |
| legacy-full-portfolio | 2 | 履历支持 | 个人资料私有 |
| legacy-full-portfolio | 3–9 | plumber | 重复内容并入 |
| legacy-full-portfolio | 10 | plumber | 公开早期差异版本 |
| legacy-full-portfolio | 11–12 | plumber | 重复内容并入 |
| legacy-full-portfolio | 13 | plumber | 公开早期差异版本 |
| legacy-full-portfolio | 14–16 | plumber | 重复内容并入 |
| legacy-full-portfolio | 17 | plumber | 公开早期差异版本 |
| legacy-full-portfolio | 18–21 | huhu-care | 重复内容并入 |
| legacy-full-portfolio | 22–23 | huhu-care | 公开早期差异版本 |
| legacy-full-portfolio | 24–28 | huhu-care | 重复内容并入 |
| legacy-full-portfolio | 29 | go-glow | 重复内容并入 |
| legacy-full-portfolio | 30 | go-glow | 公开早期差异版本 |
| legacy-full-portfolio | 31–36 | go-glow | 重复内容并入 |
| legacy-full-portfolio | 37–43 | lingmu | 重复内容并入 |
| legacy-full-portfolio | 44–49 | jimu-studio | 重复内容并入 |
| legacy-full-portfolio | 50 | 9个课程展板案例 | 拆出9个展板案例 |
| legacy-full-portfolio | 51 | 原文件归档 | 封面/结束页归档 |
| legacy-full-portfolio | 52–63 | plant-companion | 重复内容并入 |

旧站63页与当前文档逐页比对：63页提取文本相同，57页WebP字节及RGB像素精确相同；p.10、13、17、22、23、30存在细微像素差异，两版均保留。去向统计中的“重复内容并入”为53页，是因为57个精确相同页里的封面、个人介绍、展板总览和结束页按各自用途分类，并未漏掉4页。

p.50原PDF的X1–X9九个内嵌JP2均已保存，并输出3600像素长边WebP。X1/X2/X3/X4/X5/X6分别对应本地02/01/06/07/08/04，保留更适合展示的内嵌版本；X7生态丰收漫游者、X8 PureWater、X9极翼补足此前总览中不易辨识的项目。原署名未裁除。详见`docs/pdf-case-analysis.md`与JSON的`embeddedBoards`。

## 两份PPTX明确去向

| 原件 | 页数 | 字节数 | 去向 | SHA256 |
| --- | ---: | ---: | --- | --- |
| 孙英杰个人介绍.pptx | 1 | 502,416 | 履历支持资料私有 | c29d8d9b4fe26ef5698d25c8b807b4e06681333e11a3f40292f3c2ced983b5bb |
| 户外移动电源市场需求分析报告.pptx | 20 | 4,748,811 | 历史研究支持归档 | d479d28c29b4cf108d3a69753faa822ff56b8b1c377f8f6dfe8f6c06fbe2ed6d |

**孙英杰个人介绍.pptx**只有1页，整页为嵌入图，文本提取为空不意味着内容为空。已视觉核对其个人介绍、产品设计学习阶段、软件技能、荣誉和联系方式。基础教育/技能信息并入履历证据链；原页面、联系人信息和未另行证实的奖项表述不整页公开。当前履历中的具体任职信息仍以`docs/profile-evidence.md`的多来源取舍为准，不能由这页个人介绍单独证明。

**户外移动电源市场需求分析报告.pptx**共20页，封面/末页标2025.02.21、孙英杰。内容包括目标人群、需求、市场规模与竞争、技术与材料、标准认证和增长挑战。第9页是产品参考拼图，已核对嵌入图中的Anker、EcoFlow、OUKITEL、Yoshino等品牌与其他概念/产品参考；其余嵌入图也包含装饰背景。未发现足以建立用户原创户外电源完成方案、工程样机或已落地产品的证据。

报告中的2022/2024市场金额、增长预测、厂商份额、法规/认证和技术性能未逐项溯源核实；其中“UN3”等原始表述也不能作为准确标准引用。整份资料作为历史研究支持私有归档，不把预测更新为2026年的事实，也不把竞品图计作用户作品。

| PPTX | 页码 | 内容/处理 |
| --- | --- | --- |
| 个人介绍 | 1 | 个人信息图；履历支持，原图私有 |
| 户外电源报告 | 1–3 | 标题、目录与市场章节；历史研究 |
| 户外电源报告 | 4–7 | 用户、需求、市场和竞争；未核实数据保留原稿 |
| 户外电源报告 | 8 | 产品调研章节页 |
| 户外电源报告 | 9 | 竞品/产品参考拼图；不公开为原创案例 |
| 户外电源报告 | 10–14 | 技术、材料和标准认证；历史研究 |
| 户外电源报告 | 15–19 | 增长、风险与战略；历史研究 |
| 户外电源报告 | 20 | 结束页与原稿日期 |

2份PPTX包均通过ZIP完整性检查，21个幻灯片XML和15个嵌入图均有逐项SHA256记录。个人介绍1图、市场报告14图均已目视查看；未重新渲染整份PPTX布局。PPTX、页图与嵌入图均未纳入164项构建清单。

## 品牌与数字库存

| 候选 | 来源记录数 | 公开资产数 | 去向 |
| --- | ---: | ---: | --- |
| Periastra 相机包品牌标志 | 10 | 4 | 已入案例 |
| 夜礼司品牌识别与身体装置研究 | 20 | 3 | 已入案例 |
| 镜序 Lensflow | 11 | 2 | 已入案例 |
| 砚台 · 产品造型学习工具 | 11 | 1 | 已入案例 |
| 构线 Formline | 7 | 2 | 已入案例 |
| Resume Formatter 简历编辑器 | 7 | 3 | 已入案例 |
| 视觉档案 | 5 | 2 | 已入案例 |
| Eagle 审美图谱 | 7 | 2 | 已入案例 |
| 小红书内容运营工作台 | 6 | 0 | 规划与早期工作区资料保留，未入案例 |
| 图像生成与连续编辑评测 | 12 | 3 | 已入案例 |

10个候选中9个进入案例，22份公开资产均在构建内。30个GitHub品牌原件和66份本地项目证据均已逐条核对并列在下方附录；并不等于完整克隆所有数字项目源码。

明确保留的归属边界：Resume Formatter为MIT开源Fork，保留上游；砚台的luck-power和visual-lens为同一演化线；夜礼司中的Songnasty仅作为历史阶段；图谱机构原作属于原作者；图像评测为虚构品牌AI测试，9/9不等同直接可用率。不同目录、副本、构建输出或旧发布版本不再次计为作品。

明确排除公开的素材包括：夜礼司历史字形来源拼贴、蓝色闪蝶形态参考及尺寸衍生、人像佩戴参考；图谱机构原作参考目录；Lensflow设计探索参考画面。原始清单中的“排除目录”是范围声明，不表示本报告对那些目录内全部文件另做完整清点。GitHub原件中的7份参考文件（含相同内容副本）保留私有，未直接成为公开资产。

## 原始文件逐项登记

“校验摘要”为完整SHA256的前12位，仅方便对照；完整值、原件/归档两端检查与Git blob SHA-1检查记录于JSON。字节数取实际文件。已纳入公开版通常表示选用了其衍生图或内容，不表示原始文件本身作为下载件发布。

### 旧站资源（32条）

| 来源 | 字节数 | 案例/去向 | 处理 | 校验摘要 |
| --- | ---: | --- | --- | --- |
| 始祖鸟/cb880134dd55b4ea48ac6a2c188bf65b.jpg | 233,932 | arcteryx | 公开版采用衍生图/视频 | c8ee89556090 |
| 孙英杰个人作品集/项目.pdf | 173,240,209 | 完整PDF拆为15个项目；逐页表另列 | 拆分并去重纳入案例 | 71c6237f2b1e |
| 渲染作品/22de046ff3e66598345084183a3aea6b.jpg | 588,679 | rendering-studies | 公开版采用衍生图/视频 | 3565d0adc64b |
| 渲染作品/6b8d00417baa8b204447fd0857eb435a.png | 18,065,593 | rendering-studies | 公开版采用衍生图/视频 | 991416b918c9 |
| 渲染作品/7ddd2cc1d08f22e83dbf11ca277471eb.png | 48,199,970 | rendering-studies | 公开版采用衍生图/视频 | 584cae873334 |
| 渲染作品/a7bdacdb33c834301102c595220b48d3.png | 30,414,775 | rendering-studies | 公开版采用衍生图/视频 | 28b22d366d36 |
| 渲染作品/c7db2abf68343f46198039db6ab4fba6.png | 43,724,748 | rendering-studies | 公开版采用衍生图/视频 | a3ba11181883 |
| 渲染作品/d426d7f675239cd43c29396f4b542fee.png | 22,719,701 | rendering-studies | 公开版采用衍生图/视频 | 05a148e5c32f |
| 爱马仕/冬季/54f3c93240044222915bc785ca86bc40.jpg | 160,381 | hermes | 公开版采用衍生图/视频 | 9748917c4a0c |
| 爱马仕/冬季/776d28c61be0075bb8c93bffd65035ef.jpg | 148,067 | hermes | 公开版采用衍生图/视频 | 8f921d51a46f |
| 爱马仕/冬季/8c4f37a6cb7ca715256d9a6f7dc9e210.jpg | 172,162 | hermes | 公开版采用衍生图/视频 | 7ba3ead4547c |
| 爱马仕/冬季/bfdc3c738e0adc5a35237a99374f7ac5.jpg | 191,973 | hermes | 公开版采用衍生图/视频 | 2169fff20ec3 |
| 爱马仕/冬季/e8d955a3898da97773e081384d4117e3.jpg | 218,923 | hermes | 公开版采用衍生图/视频 | 32b388ba4884 |
| 爱马仕/冬季/f1455674fa1906fe49bd555bcad97e9c.jpg | 209,108 | hermes | 公开版采用衍生图/视频 | a10eed8cc6bf |
| 爱马仕/夏季/40379d8484144b6a435498fcf8b9d857.png | 3,444,984 | hermes | 公开版采用衍生图/视频 | df83fbc85f28 |
| 爱马仕/夏季/51a7ab3976cb48ff18f4591b5056409e.jpg | 340,941 | hermes | 公开版采用衍生图/视频 | 2e204034fb66 |
| 爱马仕/夏季/a8d210af1968eb83486446dc2f40027a.jpg | 451,044 | hermes | 公开版采用衍生图/视频 | b593a72e9e27 |
| 爱马仕/秋季/043e019544984416521bf2009313a5fb.jpg | 255,739 | hermes | 公开版采用衍生图/视频 | 33d7bac8d8c7 |
| 爱马仕/秋季/34aa997644c1849af5a716bd5cdcf55b.jpg | 249,748 | hermes | 公开版采用衍生图/视频 | 7b9e5e61cf73 |
| 爱马仕/秋季/b1d7e5fa28f89c792ee7a540882cf5ce.jpg | 220,317 | hermes | 公开版采用衍生图/视频 | 3eb815209b13 |
| 设计上海与米兰设计周/1a933b09873b81c73f03877f8f9a61ea.jpg | 4,973,042 | lighting | 公开版采用衍生图/视频 | c2733ed26547 |
| 设计上海与米兰设计周/211a2e25f8d767e880624789a3a63594.jpg | 70,777 | lighting | 公开版采用衍生图/视频 | c2003e7bda33 |
| 设计上海与米兰设计周/3f7ec7c3d1a16952bb9a0a0c1523be7b.jpg | 590,898 | lighting | 公开版采用衍生图/视频 | 547406057065 |
| 设计上海与米兰设计周/450b32ccc90b8ca88b74c5bbf307c838.png | 397,004 | lighting | 公开版采用衍生图/视频 | dc2b5f8ad8c5 |
| 设计上海与米兰设计周/4c9ca8a7b2459a9667ce0b7438da56e1.jpg | 526,469 | lighting | 公开版采用衍生图/视频 | ba21d6d6f441 |
| 设计上海与米兰设计周/5beb6f4875965136b4cf16ffcfe6f1fe.png | 572,398 | lighting | 公开版采用衍生图/视频 | 7cfa166190c1 |
| 设计上海与米兰设计周/916094a2d9a1fe336ac2d4c9854737b4.jpg | 37,753 | lighting | 公开版采用衍生图/视频 | 94ae2b1ff6d2 |
| 设计上海与米兰设计周/9aa74a4014cf6e5ba9f80dae478ae31e.jpg | 149,363 | lighting | 公开版采用衍生图/视频 | 4a2d0fcf110d |
| 设计上海与米兰设计周/a56bfb9a22490e6fa6dc7073ce8b6f87.png | 119,265 | lighting | 公开版采用衍生图/视频 | 3c06aabdd848 |
| 设计上海与米兰设计周/b3462a8b9f91b20f2fb239d91e7cadcf.jpg | 358,662 | lighting | 公开版采用衍生图/视频 | d68d7cdf3866 |
| 设计上海与米兰设计周/e9ab15f955279470fd53cb6e9e9a8c18.jpg | 200,220 | lighting | 公开版采用衍生图/视频 | 84333a4f1ffa |
| 证件照.png | 6,435,322 | 履历 | 个人资料私有 | 2a426c3cc226 |

### 本地PDF原件（4条）

| 来源 | 字节数 | 案例/去向 | 处理 | 校验摘要 |
| --- | ---: | --- | --- | --- |
| 孙英杰个人作品集.pdf | 139,785,925 | 14个项目；逐页表另列 | 拆分纳入公开版 | f5c8166183a0 |
| 静态渲染师 孙英杰作品集.pdf | 12,766,757 | rendering-studies | 拆分纳入公开版 | 579908cbaac6 |
| 孙英杰简历.pdf | 280,794 | 履历 | 个人资料私有 | f698979fb886 |
| 项目.pdf | 33,583,079 | plant-companion | 拆分纳入公开版 | 3963fd11e024 |

### 本地媒体（14条）

| 来源 | 字节数 | 案例/去向 | 处理 | 校验摘要 |
| --- | ---: | --- | --- | --- |
| 03展板.jpg | 6,618,087 | bat-quad | 重复内容并入 | f5b8056521de |
| 1.jpg | 13,151,550 | baobab-glow | 重复内容并入 | cd51df93dd99 |
| 21090303邓志成展板.jpg | 13,202,207 | water-walking-bath | 公开版采用衍生图/视频 | ac524ef2e4c0 |
| APP展板.jpg | 3,191,681 | yuju | 重复内容并入 | bd39b7032a59 |
| 图片1.png | 13,193,567 | construction-recycler | 公开版采用衍生图/视频 | 9780cec066ec |
| 展板(1).jpg | 1,930,230 | cloudwing | 重复内容并入 | c89abbde9876 |
| 展板.jpg | 6,557,750 | little-orange | 重复内容并入 | 38c9dbb5097a |
| 水中卫士-清藻机智能装备设计—邓志成—张成承.png | 22,350,961 | water-guardian | 重复内容并入 | 745696423339 |
| 11.png | 1,836,564 | 私有资料 | 肖像参考私有 | b21745aaae7a |
| 98a0e7c15c0e45ca80f339215435b3d.png | 140,826 | 履历 | 个人资料私有 | 2704b576c55c |
| 9a631869da37997b419e2f69840dbb27.jpg | 76,385 | 私有资料 | 肖像参考私有 | c22921860ca6 |
| 照片1.jpg | 4,859,965 | 私有资料 | 肖像参考私有 | d0b8535783ec |
| 照片2.jpg | 29,952 | 私有资料 | 肖像参考私有 | f9b0ec7687ff |
| 111.mp4 | 4,239,466 | rendering-studies | 公开版采用衍生图/视频 | 440a6cde308f |

### PPTX原件（2条）

| 来源 | 字节数 | 案例/去向 | 处理 | 校验摘要 |
| --- | ---: | --- | --- | --- |
| 孙英杰个人介绍.pptx | 502,416 | 履历 | 履历支持资料私有 | c29d8d9b4fe2 |
| 户外移动电源市场需求分析报告.pptx | 4,748,811 | 私有资料 | 历史研究支持归档 | d479d28c29b4 |

### 工程原件（11条）

| 来源 | 字节数 | 案例/去向 | 处理 | 校验摘要 |
| --- | ---: | --- | --- | --- |
| 儿童幽门螺杆菌检测仪.zip | 3,005,130,539 | huhu-care | 工程原件保留本地 | 7c813b375d69 |
| 管道清淤机器人.z01 | 2,147,483,648 | plumber | 工程原件保留本地 | 58d6237e7e93 |
| 管道清淤机器人.z02 | 2,147,483,648 | plumber | 工程原件保留本地 | eb1473b94610 |
| 管道清淤机器人.z03 | 2,147,483,648 | plumber | 工程原件保留本地 | 60ed5468da49 |
| 管道清淤机器人.z04 | 2,147,483,648 | plumber | 工程原件保留本地 | 9ce2ae23d2e0 |
| 管道清淤机器人.z05 | 2,147,483,648 | plumber | 工程原件保留本地 | 0a27c9d4ebfc |
| 管道清淤机器人.z06 | 2,147,483,648 | plumber | 工程原件保留本地 | 422845509ca7 |
| 管道清淤机器人.z07 | 2,147,483,648 | plumber | 工程原件保留本地 | 9802b94daaaa |
| 管道清淤机器人.z08 | 2,147,483,648 | plumber | 工程原件保留本地 | 5e545860514e |
| 管道清淤机器人.z09 | 2,147,483,648 | plumber | 工程原件保留本地 | 2e880615bb49 |
| 管道清淤机器人.zip | 951,185,498 | plumber | 工程原件保留本地 | e8394cf868c4 |

### 品牌GitHub原件（30条）

| 来源 | 字节数 | 案例/去向 | 处理 | 校验摘要 |
| --- | ---: | --- | --- | --- |
| Periastra 相机包品牌设计/00_项目总览/Periastra 相机包品牌设计.md | 712 | periastra | 项目支持资料私有 | c2c85c69fd00 |
| Periastra 相机包品牌设计/01_Logo 设计/Periastra Logo 设计分析.md | 2,988 | periastra | 项目支持资料私有 | 22cf66e7e457 |
| Periastra 相机包品牌设计/02_应用与优化/Periastra 应用与优化.md | 2,156 | periastra | 项目支持资料私有 | a50bbcdcb699 |
| Periastra 相机包品牌设计/Periastra 结构流程.md | 807 | periastra | 项目支持资料私有 | e1e7444c19d4 |
| Periastra 相机包品牌设计/Periastra 项目图谱.canvas | 2,086 | periastra | 项目支持资料私有 | e0e65c5d923a |
| Periastra 相机包品牌设计/assets/explainers/periastra-application-fit-v01.svg | 1,574 | periastra | 公开版采用衍生图/视频 | 945ea09deb16 |
| Periastra 相机包品牌设计/assets/explainers/periastra-lineweight-negative-space-v01.svg | 1,486 | periastra | 公开版采用衍生图/视频 | e3d2c9d83b88 |
| Periastra 相机包品牌设计/assets/explainers/periastra-structure-breakdown-v01.svg | 1,263 | periastra | 公开版采用衍生图/视频 | f66a6b259a21 |
| Periastra 相机包品牌设计/assets/logo/periastra-logo-v01-20260422.png | 242,402 | periastra | 公开版采用衍生图/视频 | 45b9cf85e1f4 |
| Periastra 相机包品牌设计/assets/raw/4-22确认.png | 242,402 | periastra | 重复内容并入 | 45b9cf85e1f4 |
| 夜礼司/00_品牌总览/夜礼司 品牌设计.md | 2,947 | yelisi | 项目支持资料私有 | ffee1f943978 |
| 夜礼司/01_Logo 设计/00_项目总览/夜礼司 Logo 设计.md | 2,190 | yelisi | 项目支持资料私有 | 69a90182b4b8 |
| 夜礼司/01_Logo 设计/01_方案与决策/夜礼司 Logo 方案与决策.md | 8,047 | yelisi | 项目支持资料私有 | d999627310e5 |
| 夜礼司/01_Logo 设计/02_规范与字标/夜礼司 Logo 规范与字标.md | 2,946 | yelisi | 项目支持资料私有 | 1f32372387c2 |
| 夜礼司/01_Logo 设计/03_演化与时间线/夜礼司 Logo 演化时间线.md | 5,307 | yelisi | 项目支持资料私有 | b6a7c6413373 |
| 夜礼司/01_Logo 设计/assets/history/历史_Songnasty旧版最终标志.png | 15,957 | yelisi | 公开版采用衍生图/视频 | 62e9deb0d0cf |
| 夜礼司/01_Logo 设计/assets/history/历史_Songnasty设计来源.png | 35,215 | yelisi | 参考素材排除公开 | c310d66f0c6d |
| 夜礼司/01_Logo 设计/assets/logo/yelisi-final-logo-v01-20260514.png | 41,179 | yelisi | 公开版采用衍生图/视频 | f574d9c82db4 |
| 夜礼司/01_Logo 设计/夜礼司 Logo 结构流程.md | 911 | yelisi | 项目支持资料私有 | 96890a39a165 |
| 夜礼司/01_Logo 设计/夜礼司 Logo 设计知识图谱.canvas | 3,289 | yelisi | 项目支持资料私有 | 2bb956392dd5 |
| 夜礼司/02_产品设计/蛇形口咬道具_绒花蝴蝶磁吸配件/assets/raw/佩戴示意.png | 459,934 | yelisi | 重复内容并入 | cd6d3a3fcbda |
| 夜礼司/02_产品设计/蛇形口咬道具_绒花蝴蝶磁吸配件/assets/raw/制作尺寸.png | 5,488,911 | yelisi | 参考素材排除公开 | cc3d365e29e7 |
| 夜礼司/02_产品设计/蛇形口咬道具_绒花蝴蝶磁吸配件/assets/raw/暂定制作.png | 5,789,792 | yelisi | 参考素材排除公开 | 181f9a199db4 |
| 夜礼司/02_产品设计/蛇形口咬道具_绒花蝴蝶磁吸配件/assets/raw/示意1.png | 3,095,272 | yelisi | 参考素材排除公开 | 0e3dfc5466f7 |
| 夜礼司/02_产品设计/蛇形口咬道具_绒花蝴蝶磁吸配件/assets/佩戴效果图.png | 459,934 | yelisi | 公开版采用衍生图/视频 | cd6d3a3fcbda |
| 夜礼司/02_产品设计/蛇形口咬道具_绒花蝴蝶磁吸配件/assets/蓝色闪蝶尺寸图.png | 5,488,911 | yelisi | 参考素材排除公开 | cc3d365e29e7 |
| 夜礼司/02_产品设计/蛇形口咬道具_绒花蝴蝶磁吸配件/assets/蓝色闪蝶形态参考图.png | 5,789,792 | yelisi | 参考素材排除公开 | 181f9a199db4 |
| 夜礼司/02_产品设计/蛇形口咬道具_绒花蝴蝶磁吸配件/assets/蛇造型尺寸图.png | 3,095,272 | yelisi | 参考素材排除公开 | 0e3dfc5466f7 |
| 夜礼司/02_产品设计/蛇形口咬道具_绒花蝴蝶磁吸配件/结构与叙事流程.md | 973 | yelisi | 项目支持资料私有 | 0a06c0594f82 |
| 夜礼司/02_产品设计/蛇形口咬道具_绒花蝴蝶磁吸配件/蛇形口咬道具_绒花蝴蝶磁吸配件.md | 3,917 | yelisi | 项目支持资料私有 | 0536d85835f7 |

### 数字项目本地证据（66条）

| 来源 | 字节数 | 案例/去向 | 处理 | 校验摘要 |
| --- | ---: | --- | --- | --- |
| lensflow/README.md | 4,448 | lensflow | 项目支持资料私有 | e48a6de64d48 |
| lensflow/package.json | 1,180 | lensflow | 项目支持资料私有 | 82d6780ff32d |
| lensflow/LICENSE | 1,099 | lensflow | 项目支持资料私有 | 7d7289af7a62 |
| lensflow/THIRD_PARTY_NOTICES.md | 1,004 | lensflow | 项目支持资料私有 | 5cf2930c7dc1 |
| luck-power/README.md | 6,206 | yantai | 项目支持资料私有 | 3911cbeb7e53 |
| luck-power/package.json | 1,355 | yantai | 项目支持资料私有 | 0c3f3fd6a8ee |
| luck-power/LICENSE | 1,097 | yantai | 项目支持资料私有 | c005ed2e2094 |
| logo-geometry-studio/README.md | 2,761 | formline | 项目支持资料私有 | 86cc3f0e02b4 |
| logo-geometry-studio/package.json | 1,084 | formline | 项目支持资料私有 | 241886af9a83 |
| logo-geometry-studio/THIRD_PARTY_NOTICES.md | 1,276 | formline | 项目支持资料私有 | afe4ff4a81f4 |
| resume-formatter/README.md | 9,123 | resume-formatter | 项目支持资料私有 | 66e8142e4cfd |
| resume-formatter/package.json | 791 | resume-formatter | 项目支持资料私有 | ed89a7b13069 |
| resume-formatter/LICENSE | 1,107 | resume-formatter | 项目支持资料私有 | 74f4ffd2606e |
| resume-formatter/THIRD_PARTY_NOTICES.md | 773 | resume-formatter | 项目支持资料私有 | b8ea16d6257b |
| visual-lens/README.md | 1,112 | yantai | 项目支持资料私有 | c62c86cb07e5 |
| visual-lens/package.json | 1,091 | yantai | 项目支持资料私有 | d0f0b2859855 |
| visual-archive-extension/README.md | 2,214 | visual-archive | 项目支持资料私有 | 432eda2e06a1 |
| visual-archive-extension/package.json | 164 | visual-archive | 项目支持资料私有 | 083fbf74c63e |
| visual-archive-extension/manifest.json | 529 | visual-archive | 项目支持资料私有 | 059ae32304f7 |
| eagle-aesthetic-atlas/README.md | 3,111 | aesthetic-atlas | 项目支持资料私有 | 58c5c43b401a |
| eagle-aesthetic-atlas/package.json | 891 | aesthetic-atlas | 项目支持资料私有 | 33fe9f56967c |
| xhs-operations-os/README.md | 967 | XHS Operations OS | 规划候选，未列作品 | dab4bdb12862 |
| xhs-operations-os/package.json | 901 | XHS Operations OS | 规划候选，未列作品 | bdbf1ad3489f |
| image-2-5-xhs/README.md | 3,152 | image-2-5-xhs | 项目支持资料私有 | d5cccc7fdb09 |
| lensflow/docs/project-status.md | 2,171 | lensflow | 项目支持资料私有 | 128a495f0eff |
| lensflow/docs/product/product-spec.md | 6,089 | lensflow | 项目支持资料私有 | 2b9b0ec0a00f |
| lensflow/docs/research/viko-analysis.md | 4,148 | lensflow | 项目支持资料私有 | f5dc032437d3 |
| lensflow/docs/releases/v0.3.3.md | 2,407 | lensflow | 项目支持资料私有 | 010ac1121636 |
| lensflow/docs/releases/v0.3.0.md | 2,676 | lensflow | 项目支持资料私有 | 3650dad8267d |
| luck-power/vendor/img2threejs/UPSTREAM.md | 876 | yantai | 项目支持资料私有 | 7ec1760332e3 |
| logo-geometry-studio/docs/research.md | 3,519 | formline | 项目支持资料私有 | 866189702207 |
| logo-geometry-studio/docs/verification.md | 1,972 | formline | 项目支持资料私有 | 7e0960beacdb |
| visual-lens/visual-lens/README.md | 2,738 | yantai | 项目支持资料私有 | 6345606c71bc |
| visual-lens/visual-lens/package.json | 1,251 | yantai | 项目支持资料私有 | d949a99e8c63 |
| visual-lens/visual-lens/LICENSE | 1,096 | yantai | 项目支持资料私有 | 5b5d3b07943d |
| visual-lens/packages/aesthetic-atlas/README.md | 3,359 | aesthetic-atlas | 项目支持资料私有 | ad9043254a3e |
| visual-lens/docs/INSTALL-YANTAI.md | 3,152 | yantai | 项目支持资料私有 | 81609cf6c0c5 |
| eagle-aesthetic-atlas/design-philosophy.md | 1,957 | aesthetic-atlas | 项目支持资料私有 | 15bb189d234e |
| eagle-aesthetic-atlas/artifacts/analysis/bauhaus-product.md | 4,984 | aesthetic-atlas | 项目支持资料私有 | 543df2ce317c |
| xhs-operations-os/SPEC_MANIFEST.json | 601 | XHS Operations OS | 规划候选，未列作品 | de5ad840bf2f |
| xhs-operations-os/docs/MASTER_PRD.md | 15,063 | XHS Operations OS | 规划候选，未列作品 | dcfde4187a3a |
| xhs-operations-os/docs/ARCHITECTURE.md | 11,597 | XHS Operations OS | 规划候选，未列作品 | a30174e05c36 |
| xhs-operations-os/docs/ROADMAP.md | 8,931 | XHS Operations OS | 规划候选，未列作品 | fa8c246e31fb |
| image-2-5-xhs/STATUS.md | 1,510 | image-2-5-xhs | 项目支持资料私有 | f01f331c7506 |
| image-2-5-xhs/sources.md | 14,812 | image-2-5-xhs | 项目支持资料私有 | 451520fab25d |
| image-2-5-xhs/post.md | 3,031 | image-2-5-xhs | 项目支持资料私有 | 6d2975a0132b |
| image-2-5-xhs/publish/image-provenance.json | 6,892 | image-2-5-xhs | 项目支持资料私有 | 16945901c381 |
| image-2-5-xhs/tests/protocol.json | 4,109 | image-2-5-xhs | 项目支持资料私有 | b5ae56b489e4 |
| image-2-5-xhs/tests/evaluation.json | 5,373 | image-2-5-xhs | 项目支持资料私有 | 936ab45f6c99 |
| image-2-5-xhs/tests/session-register.json | 2,588 | image-2-5-xhs | 项目支持资料私有 | f1ee5c8c25a0 |
| image-2-5-xhs/qa/final-verification.json | 10,877 | image-2-5-xhs | 项目支持资料私有 | 3b376ca4ae26 |
| lensflow/output/xiaohongshu-lensflow-v0.3.0/evidence/studio-analysis.png | 166,312 | lensflow | 公开版采用衍生图/视频 | 6ab7a066f23f |
| lensflow/output/playwright/lensflow-v030-demo-desktop.png | 90,917 | lensflow | 公开版采用衍生图/视频 | 6c247f964d04 |
| visual-lens/output/playwright/yantai-instrument-study-760.png | 321,672 | yantai | 公开版采用衍生图/视频 | 77fc6319f350 |
| logo-geometry-studio/output/playwright/viewport-1440x900.png | 133,734 | formline | 公开版采用衍生图/视频 | 55179ebc3c8e |
| logo-geometry-studio/output/playwright/viewport-390x844.png | 43,052 | formline | 公开版采用衍生图/视频 | 035341de8922 |
| resume-formatter/output/xiaohongshu-v2.4.0/raw/03-workspace-ui.png | 125,314 | resume-formatter | 公开版采用衍生图/视频 | b41e27ce03d6 |
| resume-formatter/output/xiaohongshu-v2.4.0/raw/04-ai-diff-ui.png | 167,796 | resume-formatter | 公开版采用衍生图/视频 | 28194f762c75 |
| resume-formatter/output/xiaohongshu-v2.4.0/raw/05-layout-ui.png | 133,951 | resume-formatter | 公开版采用衍生图/视频 | a3f202bdcc5a |
| visual-archive-extension/output/playwright/analysis-chinese-desktop.png | 160,788 | visual-archive | 公开版采用衍生图/视频 | 483902186c84 |
| visual-archive-extension/output/playwright/analysis-chinese-mobile.png | 77,424 | visual-archive | 公开版采用衍生图/视频 | 11392e30a465 |
| eagle-aesthetic-atlas/artifacts/cards/bauhaus-product--dna.png | 116,787 | aesthetic-atlas | 公开版采用衍生图/视频 | 8047fb26d81a |
| eagle-aesthetic-atlas/artifacts/cards/bauhaus-product--transfer.png | 112,734 | aesthetic-atlas | 公开版采用衍生图/视频 | 78e49ddded6d |
| image-2-5-xhs/publish/cards/01.png | 617,309 | image-2-5-xhs | 公开版采用衍生图/视频 | e1275e65f252 |
| image-2-5-xhs/publish/cards/04.png | 561,913 | image-2-5-xhs | 公开版采用衍生图/视频 | 9cf77c79d8cf |
| image-2-5-xhs/publish/cards/09.png | 209,093 | image-2-5-xhs | 公开版采用衍生图/视频 | c5566c9d6265 |

工程原件总计23,283,668,869字节，全部位于原有`作品集/完成模型`目录，未复制到网站或部署包。儿童检测仪zip按文件名对应HUHU CARE；管道机器人z01–z09加zip按文件名对应引渡者。这一对应置信度为中等：已校验文件存在、字节和SHA256，但本报告未打开压缩包内容、验证模型版本或检查运行状态。

## 校验结果与边界

- 159条来源记录均有去向，128条PDF页记录无未映射项。30个案例具备60份中英文文件，语言版本引用的资产集合一致。
- 32个旧站资源的归档SHA256与已保存下载清单一致；本次未重新请求远端32个URL，因此结论针对归档快照。
- 来源核对阶段已核对4份本地PDF、14项本地媒体、2份PPTX、11个工程原件和66份本地数字证据；相关私有归档与清单SHA256一致。本次最终构建刷新沿用该历史来源校验，不重新读取约23.3 GB工程原件。
- 30份GitHub原件重新计算Git blob SHA-1并与记录相符，同时记录实际SHA256；这验证既有快照，不表示重新同步远端最新分支。
- 22份品牌/数字衍生资产的源与输出SHA256均一致；9个内嵌JP2与公开WebP映射存在。
- 最终164项媒体在public源目录与dist构建中的文件字节和SHA256一致，选择集合与当前Markdown相符；60份案例文件按最终LF字节重新计算摘要。

当前覆盖与文件一致性检查问题数：**0**。历史来源校验时间与最终构建快照时间分开记录；159条来源数量、154种文件内容、来源字节总量及工程原件哈希均保持。构建完成后未以本报告推断远端同步成功。

仍明确保留的不完整范围：

1. XHS Operations OS有规划与早期工作区，未形成有充分展示证据的独立公开案例。
2. 户外电源报告有研究内容，但没有可以据此确认的原创完成产品；按历史研究保留，不静默忽略。
3. 工程包内部尚未检查，无法排除其中存在尚未识别的版本、附属模型或额外作品。
4. 渲染长卷里未独立命名的装饰、农用装备、手臂装置和科幻形态均保留在选集中；资料不足以拆成更多有确定名称、分工和结果的项目。
5. 来源清单以已发现的材料为边界，不保证电脑其他目录、未读取的私有仓库、远端新提交或尚未提供文件里没有其他作品。

本报告只记录来源、去向和文件完整性，没有重新执行各数字工具的功能测试，也不把文件校验视为医疗、材料、飞行、量产或商业绩效验证。当前记录是最终本地构建快照；远端部署结果由主代理交付记录提供。
