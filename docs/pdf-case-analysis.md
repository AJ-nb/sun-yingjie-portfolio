# PDF、展板与渲染案例分析

内部资料审阅记录，2026-09-15。此文件及 `private/sources/` 用于来源核对，不进入网站公开正文。公开案例保存在 `web/src/content/works/`，仅引用 `web/public/works/` 下的展示资产。

本次形成 18 个案例、36 份中英文 Markdown、83 张不重复的案例图库图片及 1 段视频。18 项由 6 个完整项目、11 个独立展板项目和 1 个渲染编辑选集组成。渲染选集中的不同产品画面不额外计算为新项目。

## 资料范围与证据方法

- `private/sources/documents/portfolio-51.json`：51 页作品集的归档信息、提取文本与展示页映射。
- `private/sources/documents/office-fitness.json`：12 页办公健身项目。
- `private/sources/documents/legacy-full-portfolio.json`：旧站 63 页完整作品集。
- `private/sources/documents/rendering-sheet.json`：单页超长“产品展示”渲染选集。
- `private/sources/documents/resume-source.json`：简历资料，仅用于个人信息审阅，不作为项目案例。
- `private/sources/local-media-manifest.json`：14 项本地媒体的原路径、归档路径、校验值及公开映射。
- `private/sources/legacy-manifest.json`：旧站媒体与图库来源。

已逐页阅读提取文本，并对完整项目中的重要页面、全部具有实质内容的图像型页面、本地展板、9 张嵌入展板、旧站自行车渲染及照明图进行视觉审阅。图像型页面不能因文本提取为空而视为无内容。数据图、技术框图、人物访谈文本与渲染只能证明原提案包含这些表达，不单独证明真实调研、工程运行或产品效能。

`private/sources/pdf-cases.json` 是本组结构化案例清单；其中的 `evidenceLimits` 保留原稿矛盾及未核实信息。中英文公开正文仅描述可见设计内容，不转述无依据的销量、效率、医疗、飞行或材料性能结论。

## 页面与案例对应

| 案例 id | 项目 | 主资料 | 封面 | 展示图数 |
| --- | --- | --- | --- | ---: |
| plumber | 引渡者 · 管道危机24小时 | portfolio-51 p.3–17；旧版 p.10/13/17 | portfolio-51/016.webp | 18 |
| huhu-care | HUHU CARE · 儿童呼气检测概念 | portfolio-51 p.18–28；旧版 p.22/23 | portfolio-51/028.webp | 13 |
| go-glow | GO GLOW · 模块化个护 | portfolio-51 p.29–36；旧版 p.30 | portfolio-51/036.webp | 9 |
| lingmu | LINGMU · 无臂人士洗浴概念 | portfolio-51 p.37–43 | portfolio-51/043.webp | 7 |
| jimu-studio | JiMu Studio · 玉米芯板材模块化家具 | portfolio-51 p.44–49 | portfolio-51/049.webp | 6 |
| plant-companion | 植遇相伴 · 办公轻智能健身 | office-fitness p.1–12；对应旧版 p.52–63 | office-fitness/012.webp | 12 |
| bat-quad | 蝠型四轮越野电动摩托车 | p.50 X2；local-01 | embedded-boards/x2.webp | 1 |
| baobab-glow | BAOBAB GLOW · 便携照明 | p.50 X1；local-02 | embedded-boards/x1.webp | 1 |
| water-walking-bath | 适老型水中漫步浴缸 | local-03 | /works/local/local-03.webp | 1 |
| yuju | 雨聚 · 共享雨伞应用 | p.50 X6；local-04 | embedded-boards/x6.webp | 1 |
| construction-recycler | 模块化建筑废料回收装备 | local-05 | /works/local/local-05.webp | 1 |
| cloudwing | 云端之翼 · 垂直起降载人飞行器 | p.50 X3；local-06 | embedded-boards/x3.webp | 1 |
| little-orange | 小橘运动加油站 | p.50 X4；local-07 | embedded-boards/x4.webp | 1 |
| water-guardian | 水中卫士 · 清藻机 | p.50 X5；local-08 | embedded-boards/x5.webp | 1 |
| ecological-harvest | 生态丰收漫游者 · 落叶回收转换清洁车 | p.50 X7 | embedded-boards/x7.webp | 1 |
| purewater-rolling-filter | PureWater · 滚动取水过滤设备 | p.50 X8 | embedded-boards/x8.webp | 1 |
| polar-wing | 极翼 · 载人级无人驾驶eVTOL | p.50 X9 | embedded-boards/x9.webp | 1 |
| rendering-studies | 渲染与动态影像习作 | rendering-sheet p.1；旧站自行车6图；local-14 视频 | /works/legacy/rendering/6b8d00417baa8b204447fd0857eb435a.webp | 7 + 视频 |

表中未以 `/works/` 起始的展示相对路径位于 `/works/documents/`。全部精确图库 URL 以结构化案例清单为准。完整项目的每张非重复页面均已插入双语正文；角色段落不推定个人主导或独立完成。雨聚公开分类为 `digital`，渲染选集为 `experiments`，其他为 `product`。

作品集 p.1 为封面、p.2 为个人介绍、p.51 为结束页，不构成作品案例。p.50 为课程展板总览，9 个原始嵌入图分别进入对应项目；总览不另外计数。LINGMU 保留原英文名称，不补造中文品牌名。“植遇相伴”从封面视觉确认，原 PDF 提取文本未识别出该标题。

## 旧版63页去重与版本保留

旧版 p.1–51 对应 portfolio-51 p.1–51，旧版 p.52–63 对应 office-fitness p.1–12。按每一对实际公开 WebP 的 SHA256、解码 RGB 像素及提取文本逐页核验：

- 63/63 页提取文本完全一致。
- 57/63 对 WebP 文件字节与解码像素同时完全一致。
- 6 对页面文本相同但像素不同，页码为 10、13、17、22、23、30。
- 办公健身12页全部字节与像素一致。

六对差异页均已进行并列视觉审阅，主题与构图一致，差异细微。不能将文本一致等同于图像完全重复，也不能未经证据认定差异由特定渲染器或压缩流程造成。两版均保留在来源归档；以下差异页同时保留在公开案例中。

| 项目 | 当前公开图 | 早期版本公开图 | 平均绝对 RGB 差异（0–255） |
| --- | --- | --- | --- |
| plumber | /works/documents/portfolio-51/010.webp | /works/documents/legacy-full-portfolio/010.webp | 0.002307 / 0.001701 / 0.002846 |
| plumber | /works/documents/portfolio-51/013.webp | /works/documents/legacy-full-portfolio/013.webp | 0.162969 / 0.158008 / 0.162826 |
| plumber | /works/documents/portfolio-51/017.webp | /works/documents/legacy-full-portfolio/017.webp | 0.157166 / 0.165299 / 0.171548 |
| huhu-care | /works/documents/portfolio-51/022.webp | /works/documents/legacy-full-portfolio/022.webp | 0.005563 / 0.005598 / 0.005570 |
| huhu-care | /works/documents/portfolio-51/023.webp | /works/documents/legacy-full-portfolio/023.webp | 0.464644 / 0.448717 / 0.470372 |
| go-glow | /works/documents/portfolio-51/030.webp | /works/documents/legacy-full-portfolio/030.webp | 0.001997 / 0.002053 / 0.002011 |

57 张精确重复的旧版展示页不再次插入正文，原归档仍保留。逐页比较结果记录于 `private/sources/embedded-boards/validation.json` 的 `portfolioComparison`，含全部63页对应、字节/像素/文本比较和差值。公开正文只用“早期演示版本”区分图组，不放入校验方法及内部路径。

## p.50内嵌展板恢复

直接提取 portfolio-51 原 PDF p.50 的 X1–X9 九个 JP2 图像对象，未补绘、重构或生成。原始压缩图像保存至 `private/sources/embedded-boards/X<n>.jp2`；公开版保存至 `/works/documents/embedded-boards/x<n>.webp`，统一最长边 3600 像素，WebP quality 92。

| PDF对象 | 项目 | 本地对应 | 原始尺寸 |
| --- | --- | --- | --- |
| X1 | BAOBAB GLOW | local-02 | 4096 × 2893 |
| X2 | 蝠型四轮越野电动摩托车 | local-01 | 2896 × 4096 |
| X3 | 云端之翼 | local-06 | 2896 × 4096 |
| X4 | 小橘运动加油站 | local-07 | 2896 × 4096 |
| X5 | 水中卫士 | local-08 | 3182 × 4096 |
| X6 | 雨聚 | local-04 | 2896 × 4096 |
| X7 | 生态丰收漫游者 | 本地8张展板中无对应 | 2896 × 4096 |
| X8 | PureWater | 本地8张展板中无对应 | 4096 × 2893 |
| X9 | 极翼 | 本地8张展板中无对应 | 2896 × 4096 |

对应的6份本地展板与嵌入图在布局和设计内容上相同，但压缩与尺寸不同，不是字节级重复。公开正文采用3600像素长边的内嵌版本；本地原图及原有 `/works/local/local-<n>.webp` 映射继续保留，不删除署名。归一化视觉比较仅辅助对应判断，不能用作工程内容一致性的证明。实际显示尺寸、原始 SHA256 与归一化差异见 `validation.json` 的 `embeddedBoards`。

| 原图 | SHA256 |
| --- | --- |
| X1.jp2 | ec51da77f599c55bf6f3b92914a3ab13d4a484296e3ac37226167d25faf9791f |
| X2.jp2 | 5525a2963545a6a2440d322e60ddaa0b77c948a28f720ae221baf0c32b50a5d4 |
| X3.jp2 | 7dede7b46f5638432c0eecab3616f46b22b3c79aaba4c1392433d038fd147acb |
| X4.jp2 | 3eeaa2f7f0409fda94a19a188def756c636e7054ff29a596f2753d6f41f8f593 |
| X5.jp2 | f493deb99c23acb53fad21bd57ad2b9d1b413deaafa437f87281f6e0f45e00ea |
| X6.jp2 | 750f1c78116e72b717ff82e65b767801481e7d05d1546b7995813c45fd770499 |
| X7.jp2 | 9315a985e38c7ef7716d45a84ba6d85fae851a88e0065d75f01a95c9c832e343 |
| X8.jp2 | b173f2112437e9b43a15c21225d2b081eca7012e2a3307bfb912e7fd42310228 |
| X9.jp2 | 5de1a93a9732d7bba2f823ef16c47879b5f1ad4f026c62d240025d363ba3b192 |

## 合作署名与阶段

用户明确说明带邓志成、张成承署名的作品为合作项目；本地8张展板依用户要求按合作收录。完整五个作品集项目没有逐项分工证据，同样保守标注合作，不将整份作品集归属转换为每一个环节都由个人独立完成的结论。

| 项目 | 原始署名证据 | 公开处理 |
| --- | --- | --- |
| BAOBAB GLOW | 展板“邓志成21090303” | 中英文正文与 credits 保留邓志成；图片不裁署名 |
| 适老型水中漫步浴缸 | 展板“邓志成21090303”；指导老师陶裕仿 | 保留邓志成及陶裕仿的角色 |
| 水中卫士 | 原文件名含邓志成、张成承 | 中英文均保留两名协作者 |
| PureWater | 原展板“孙英杰21090315” | 保留孙英杰；不推定独立工程开发 |
| 植遇相伴 | 页面标明 Teamwork | 明确团队项目，具体分工与其余成员待补充 |
| 其他项目 | 未形成可核实的完整分工清单 | 共同创作，具体分工与协作者署名待补充 |

公开文字不重复学号，原始展板保持完整。公开阶段为概念/提案或视觉习作，没有使用已交付、量产或测试完成的状态。植遇相伴页脚标2022，但正文出现2024及后续时间图表，不填入完成年份。其他项目也不从相邻履历或文件时间推定项目年份。

## 渲染选集与视频

`rendering-sheet` 是单页长卷，公开图为 `/works/documents/rendering-sheet/001.webp`，尺寸689 × 6000。内容包括 GO GLOW、HUHU CARE、植遇相伴、灯具、圆形装饰场景、农用装备、手臂装置、引渡者地下场景及科幻飞行器。未标名的习作不补造客户、功能、工程结构或年份。

长卷与 portfolio-51 p.15–16、27–28、34、36，以及 office-fitness p.1、8、12 存在部分画面交叉。以长卷作为编辑选集保留，不重复计为产品案例。

长卷中的六幅照明视觉与旧站以下图像存在对应关系：

- `legacy/lighting/5beb6f4875965136b4cf16ffcfe6f1fe.webp`：桌面灯与书本。
- `legacy/lighting/e9ab15f955279470fd53cb6e9e9a8c18.webp`：旋钮近景。
- `legacy/lighting/3f7ec7c3d1a16952bb9a0a0c1523be7b.webp`：门洞旁壁灯。
- `legacy/lighting/4c9ca8a7b2459a9667ce0b7438da56e1.webp`：壁龛场景壁灯。
- `legacy/lighting/916094a2d9a1fe336ac2d4c9854737b4.webp`：黑底落地灯。
- `legacy/lighting/a56bfb9a22490e6fa6dc7073ce8b6f87.webp`：黑底悬吊条灯。

这些对应仅用于内容关联；旧站照明项目中的其他照片与展览图由主任务另行整理。

旧站 `legacy/rendering` 六张均为自行车渲染，与产品长卷不是同一组内容，不按目录名称去重。公开案例保留6张原图：暗色整车、CLIMBER MINI24雪地组合、山地车场景、车架与水壶、车把、传动部件。选用横向雪地场景作为封面，以避免超长卷的缩略图无法清楚呈现。

`local-14` 的 `111.mp4` 已核验：H.264视频、AAC音轨，960 × 544，24fps，时长27.916667秒。九个分布时间点的抽样帧显示带 Ferrari 标志的跑车在极光与沙漠场景中切换，包含车头、侧面、轮组、车尾和移动镜头。它不是自行车静态图的动态版本，按同一视觉习作选集下的独立“跑车动态习作”组收录，URL为 `/works/local/111.mp4`。

抽样联系图保存于 `private/sources/embedded-boards/video-review.jpg`。模型、背景、品牌委托关系及音轨作者未核实；公开正文不声称车辆造型原创或 Ferrari 委托，视频视觉内容已确认属于渲染演示。

## 本地媒体去向

| 本地编号 | 处理 |
| --- | --- |
| local-01–08 | 对应8个合作案例；其中6个使用内嵌高清图，local-03与05使用本地展示图 |
| local-09 | 人物肖像，透明抠图边缘有瑕疵；不是作品案例 |
| local-10 | 旧简历图；用于私有资料审阅，不插入项目正文 |
| local-11 | 与local-09相同人物的较整洁方形肖像；可由主任务处理个人页 |
| local-12/13 | 肖像参考，清单已标记 portrait-reference-private |
| local-14 | 跑车渲染视频，已确认并纳入 rendering-studies |

简历/个人介绍中存在联系方式、获奖及履历量化表述；本子任务不将其传播到项目文案。是否保留原有公开简历与头像资产由主任务的整体隐私审阅处理。

## 关键证据边界

- HUHU CARE 原稿混用碳13/碳14尿素呼气试验、CO2与NH3传感器描述；“糖果”试剂、诊断准确性及儿童临床适用性不能作为已验证功能。p.23仅显示形态手工模型，不是运行检测设备。p.19注明部分故事画面来自Midjourney。
- 蝠型四轮车正文60V/3000Wh与表格12V/12V5Ah矛盾，不转成已实现电池参数。
- 云端之翼与极翼分别为不同造型概念。动力描述混合喷气、电推进等术语，均无可飞行性证据；极翼展示多人座舱且参数写4人，不称为单座。
- JiMu Studio 没有板材样品、配方或性能试验记录；耐水、阻燃、抗菌、降解、承载与环境收益不作为事实结论。
- PureWater 没有饮水安全和污染物去除验证；“过滤”不等于安全饮用水。
- 植遇相伴、小橘与水中漫步浴缸没有健康、康复或持续行为效果证据；以日常体验概念描述。
- 清淤、清藻、落叶回收与建筑废料方案没有设备运行和材料输出验证，相关效率与环保收益属于设计目标。
- 原稿用户访谈、画像和统计图缺少原始样本记录，正文概述问题情境，不复述百分比作为本项目发现。

## 文件级验证

`private/sources/embedded-boards/verify-cases.py` 对本组18项目完成检查，并生成 `validation.json`：

- 36份Markdown中英文成对存在，均含8个约定frontmatter字段及6个正文段落。
- 标量与tags均可按JSON值解析；category仅使用product/digital/experiments。
- 每份正文图片集合与对应JSON galleries完全一致，正文内无重复图片。
- 83张图库图、所有封面与1个视频引用均实际存在。
- 中英文中邓志成、张成承、陶裕仿和孙英杰出现情况一致，保留原稿署名关系。
- 公开正文没有内部源路径、校验信息、恢复过程说明或重复学号。
- 9个JP2原图与9个3600像素长边WebP均存在并可解码。
- 63页文本及图像比较复核通过；57页精确重复，6页差异映射与正文一致。

以上为内容、资产和归档对应验证；应用构建、浏览器样式及video标签运行由主任务验证。本子任务未改应用代码、未提交Git、未部署。
