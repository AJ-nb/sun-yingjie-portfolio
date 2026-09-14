# Image 2.5 小红书图文素材包

本次生成测试与图文制作已完成，未操作小红书发布。

## 发布文件

- `publish/cards/01.png` 至 `09.png`：9张1080×1440正式图卡，按编号顺序使用。
- `publish/contact-sheet.png`：九图总览，仅供审阅，不代替九张正式图。
- `post.md`：3个标题候选、正文、话题、发布说明。
- `sources.md`：公开来源精简表及原文链接。
- `image-2-5-xhs-delivery.zip`：完整素材包，包含发布文件、原图、输入、研究、脚本与验收记录。

## 实测与研究材料

- `tests/originals/`：全部18张1086×1448原始PNG，未修图。
- `tests/protocol.json`：出图前冻结的提示词与检查项。
- `tests/evaluation.json`：逐张评语、评分口径和分组数量。
- `tests/session-register.json`：输入、会话、编辑顺序与观察时间。
- `tests/saved-image-verification.json`：原图尺寸与SHA-256。
- `inputs/`：自制虚构包装图、草图，非模型成绩。
- `research/`：23条来源记录、覆盖缺口、证据笔记及横纵分析。

## 编辑与复现

可编辑排版源为 `scripts/build_cards.py`。文字、坐标、颜色、图片路径和裁切区域均可直接修改。运行后重新生成9张PNG、手机预览和图片来源映射。需要Python、Pillow、Windows微软雅黑及本机canvas-design中的Work Sans字体。未嵌入或转售系统字体。

```powershell
& 'C:\Users\sunyingjie\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' .\scripts\build_cards.py
& 'C:\Users\sunyingjie\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' .\scripts\verify_saved.py
& 'C:\Users\sunyingjie\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' .\scripts\finalize.py
```

`publish/image-provenance.json`记录每次排版采用的原图、裁切坐标与等比缩放结果。图7前后使用相同原图坐标及显示尺寸；图4采用近轮廓裁切后等高展示，不能据此视为同视角几何测量。排版没有修复、磨皮、调色或重绘测评原图。

`qa/final-verification.json`保存原图哈希、图卡尺寸、文字边界、图像来源、等比缩放和正文计数等自动检查，以及手机尺寸目视复核说明。正文包含689个汉字、864个非空白字符（含英文、数字与标点）。来源覆盖不足与无对照基线是明确限制，不因文件验收通过而消失。

## 结论边界

9/9轮指定修改完成，但整体验收与目标完成分开统计。海报2/3、商品首图3/3、草图2/3、编辑图3/9直接可用。判定是单人针对本次虚构任务的目视意见，不是普遍成功率。没有旧版、竞品和人工基线，不能推导减少返工的百分比或小时数。

网页页面名为ChatGPT图像2.5，可见模式为“高”；API子型号未知。所有图像是AI生成的虚构品牌测试，不是实际产品摄影或真实活动宣传。第三方图片未转载，第三方案例仅链接和必要文字归纳。研究数量为23条来源记录、16个发布者/作者群，非23份独立测评。
