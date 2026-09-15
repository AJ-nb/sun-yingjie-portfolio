# 第二轮原生素材与来源记录

此目录保存来源索引、原生操作记录和选片依据。大体积工作副本位于忽略目录 `.production-runtime/model-worksets/`，仅网页选片位于 `web/public/works/refinement-v2/`。原始文件只读，没有覆盖。

## 模型工作集

- 管道清淤机器人：从分卷 ZIP 定向提取 `C4D/render/`，排除备份与含 `@` 文件，共 62 文件、1,149,335,608 字节。包含 `render.c4d`、30 贴图与 31 原始渲染。没有整包展开。
- HUHU CARE：提取 `C4D/PRODUCT/PRODUCT.c4d`、`model/03rhino5.obj`、MTL 和 `render` / `render2` 中 40 张已有渲染，共 43 文件。没有整包展开。
- 从 71 张既有原始渲染中选择 22 张用于网站。形态、结构和既有镜头保持不变；这 22 张均为原始渲染，不含本轮新增渲染或 AI 图像操作。
- `model-extraction-manifest.json` 记录归档内路径、CRC、原始大小和实际提取路径；`published-model-media.json` 记录入选文件 SHA-256、尺寸、双语说明与网页地址。
- 模型包含 GSG / Poliigon 贴图、硬件或环境组件。本轮不把这些第三方资产单独发布，也不称其为原创产品设计。案例继续保留合作项目属性。
- HUHU 的实际 OBJ 导入、计数一致性、新进程重开和私有灰模视图由人物代理验证，见 `huhu-geometry-check.json`。检查渲染只用于私有几何对应核对，没有加入公开图或作品集 PDF。
- 管道 `render.c4d` 已通过本机官方 `D:/c4d/c4dpy.exe` 2026.0.0 尝试读取。在选择 Maxon App 许可方式后，程序返回 `Please fix the license in the MaxonApp, press return to try again:`，脚本未到达读取场景阶段。故管道 C4D 实际打开、几何和贴图解析均未验证；30 个提取贴图的存在不能替代解析结果。证据与可重试脚本见 `plumber-c4d-inspection.json`、`plumber-c4d-license-transcript.txt`、`scripts/source-r2/c4d_inspect_plumber.py`。

## 渲染 PDF

- 原件：`D:/OneDrive/桌面/文件/作品集/静态渲染师 孙英杰作品集.pdf`，1 页。
- 递归提取 44 次内嵌图像引用，SHA-256 去重后为 43 个唯一图像；`pdf-030` 与 `pdf-032` 是同一装饰纹理。
- 原始带透明遮罩的 JP2 保存在忽略工作目录。用于网页的分图依据原始 alpha 遮罩去掉透明边缘，在白色背景合成并限制最长边 2560 px；没有生成式补画。
- 37 张可用分图已完成视觉匹配，见 `pdf-case-mapping.json`。7 个引用不进入网站：3 张人像合成来源未明、1 张带水印参考风景、1 个图形符号、2 次装饰纹理引用。
- PDF 来源本身不能独立证明所有产品、人物、背景与模型的作者。记录的是原作品集中的视觉呈现；项目设计归属和合作边界以对应案例及原始署名为准。
- `pdf-embedded-index.json` 保留全部引用、原始尺寸、哈希、筛选原因和处理记录。高分辨率独立图像作为主要展示，原长卷仅作档案链接。

## Photoshop 原生处理

- 原生程序：Adobe Photoshop 26.9.0。COM 注册仍指向旧版类型库，因此采用 Photoshop 自身的 JSX 文件入口，未修改系统注册表。
- 两份 PSD 原件均由原生程序核实为 6614 × 2480、CMYK、Japan Color 2001 Coated。先由 Photoshop 读取真实图层树，然后以合并副本转换至 sRGB IEC61966-2.1；原件关闭时不保存。
- `lingmu-photoshop-layers.json` 记录 765 个普通图层和 87 个组，共 852 个原生对象。PSD 底层的 939 条记录包含组闭合标记，不等于可见图层数量。
- `jimu-photoshop-layers.json` 记录 1034 个普通图层和 107 个组，共 1141 个原生对象。底层 1248 条记录的差值对应 107 个组闭合标记。初次读取时，隐藏父组 `效果图` 的 38 个直接子层均返回不可见；原生导出验证显示，只打开父组即可恢复完整设计版块，未改其子层可见性，因此不能据初次记录断言这些子层各自被隐藏。原生版块与另外单独选取的产品图层明确区分。
- `photoshop-native-log.txt`、`photoshop-groups-log.txt` 与 `*-photoshop-exports.json` 提供真实原生操作及版块导出记录。已原生导出 13 个顶层版块和 7 个独立图层；其中 JiMu 的柜体细节独立层导出为空白，未进入网站。最终网页选片 17 张，详见 `published-psd-media.json`。
- 无臂人士洗浴 PSD 对应现有 `lingmu`；玉米芯家具 PSD 对应 `jimu-studio`。它们不属于适老水中漫步浴缸案例。

## 验证

`validation.json` 记录完整图片解码、案例媒体路径和模型提取大小检查。联系表用于人工视觉复核，单图的最终尺寸以各索引为准。网站构建与公共发布由根任务统一执行。

`psd-source-preservation.json` 核对两份 PSD 的原始 SHA-256、字节数和修改时间，均未变化。76 张公开图片均完整解码，修改案例中的 104 条新媒体引用有效。

## 第二版作品集 PDF

`scripts/build_portfolio.py` 从共享 profile、chapters 和 33 份案例生成完整 116 页作品集。交付 PDF 与公开下载副本字节相同，详情来源、哈希和图片裁切区域记录在 `private/sources/download-manifest.json`。PNG 栅格化副本只用于呈现 SVG 内嵌 WebP，原 SVG 保留；砚台的长截图按真实来源像素分成三段，没有重绘。

最终分页见 `portfolio-page-plan.json`，全部 116 页完成 Poppler 渲染和视觉复核，33 个目录目标及案例元数据均通过。`portfolio-qa.json`、`portfolio-metadata.json` 和 `docs/portfolio-qa.md` 是当前版记录；旧版报告放入历史目录。预览位于忽略路径 `deliverables/portfolio/qa/refinement-v2/`。
