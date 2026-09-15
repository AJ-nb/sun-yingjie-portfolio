# 网页优化作品集 PDF 验收记录

核对日期：2026-09-15。网页版已通过严格小于 20 MiB 的大小检查、结构保留检查、全页渲染及视觉复核。高清原版保持不变。网页下载副本的同步与远端验收由网站整合流程另行记录。

| 文件 | 用途 | 字节数 | MiB |
| --- | --- | ---: | ---: |
| `deliverables/portfolio/sun-yingjie-portfolio-web.pdf` | 网页阅读与下载 | 20,387,294 | 19.443 |
| `deliverables/portfolio/sun-yingjie-portfolio.pdf` | 高清留档、放大阅读与印刷用途 | 54,192,777 | 51.682 |

网页版 SHA-256：`aef1cfe4c5e653a781d13be92b6b6f09b4211e3b0c7ce66180d93d617793295a`。

高清原版 SHA-256：`2758f8e26b7065432a06c359c3c6b3fff7110885831611b1cc346747e8a3a5bb`。

大小上限为 20 × 1,048,576 = 20,971,520 字节，要求严格小于该值。网页版较原版缩小 62.38%。

## 优化方式与选择依据

仅替换 PDF 中的 123 个唯一位图 XObject：最长边限制为 1800 px，使用 JPEG quality 80、4:4:4 色度采样和优化 Huffman 编码。不放大低于上限的原图，不重绘图像，不使用生成式图像操作，不把整页转成图片。文字、矢量及原有页面内容流保留。

| 图片最长边 / JPEG 质量 | 输出字节数 | 小于 20 MiB |
| --- | ---: | --- |
| 2000 / 84 | 25,217,096 | 否 |
| 1800 / 82 | 21,521,073 | 否 |
| 1600 / 80 | 18,115,948 | 是 |
| **1800 / 80（最终）** | **20,387,294** | **是** |

最终选择 1800 / 80，在满足限制的同时保留比 1600 / 80 更多的图像像素。每次尝试均从高清原版开始，没有对前一压缩结果再次压缩。前三组试验见 `private/sources/refinement-v2/portfolio-web-compression-trials.json`；最终参数、逐图原始/输出尺寸和字节数见 `private/sources/refinement-v2/portfolio-web-compression.json`。

## 结构与渲染验证

| 检查项 | 结果 |
| --- | --- |
| 页数、页面尺寸 | 116 页；每页均与原版一致，960 × 600 pt |
| 文字 | 每页抽取文字与原版一致 |
| 页面内容流 | 每页内容流 SHA-256 与原版一致 |
| 书签 | 39 个；标题、层级和目标页均一致 |
| 链接注释 | 256 个；页面、类型、URI、目标及点击矩形均一致 |
| 原版保护 | 压缩前后及最终验收时 SHA-256 与字节数一致 |
| 全页渲染 | Poppler 成功渲染 116 页，116 张 1440 × 900 PNG 均完整解码 |

结构检查针对 PDF 内部数据；不代表远端网站链接已经访问验证。源展板中的研究数字、署名及概念参数的事实核查边界沿用高清版 QA。

## 视觉复核

两名代理合计查看全部 29 张四页联系表，覆盖 116 页：素材代理检查第 1–80 页，数字与品牌代理检查第 81–116 页。另在相同的 1440 × 900 渲染尺度下，对照高清原版和网页版的 12 个重点区域：第 5、20、38、41、44、49、51、88、98、101、107、113 页。

素材对照覆盖橱窗层次、机器人外壳与履带细节、HUHU 草图和实物模型照片、JiMu 结构与尺寸图。独立数字对照覆盖 LINGMU 用户画像及 CMF 细引线、JiMu 材料图表、Periastra 中央标志、砚台中文界面、薪跳数值与演示声明、简历差异弹窗和图像实验计数。

本次检查未发现压缩新增的缺图、色块、布局碰撞或实质可读性损失。部分图像纹理略微变软，符合有损图片优化的预期。原 PSD 展板内极小字号及第 107 页弹窗本就需要放大；网页版不是无损存档，也不保证任意放大倍率下与高清版等同。需要大倍率阅读或印刷时使用保留的高清原版。

- 逐页预览：`deliverables/portfolio/qa/web-optimized/pages/`。
- 联系表：`deliverables/portfolio/qa/web-optimized/sheets/`。
- 原版/网页版同区域对照：`deliverables/portfolio/qa/web-optimized/comparisons/`。
- 结构化验收、检查范围和限制：`private/sources/refinement-v2/portfolio-web-qa.json`。

## 重复执行

在项目根目录使用带有 `pypdf` 和 Pillow 的 Python：

```text
python scripts/compress_portfolio_pdf.py --input deliverables/portfolio/sun-yingjie-portfolio.pdf --output deliverables/portfolio/sun-yingjie-portfolio-web.pdf --report private/sources/refinement-v2/portfolio-web-compression.json
```

默认即为最长边 1800、JPEG 质量 80 和严格小于 20 MiB。脚本禁止输入和输出为同一路径，并在临时结果完成结构与大小检查后才替换输出文件。若默认参数超限，脚本会尝试更小的保守候选；后续新版本仍需重新检查视觉质量，不应复用此次结论。

`scripts/source-r2/qa_portfolio_web.py` 可重新生成全页预览和对照图；其生成的视觉检查状态初始为 Pending，必须完成实际视觉复核后更新。
