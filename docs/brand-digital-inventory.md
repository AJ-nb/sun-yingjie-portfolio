# 品牌与数字作品素材盘点

核对日期：2026-09-15。原始资料依据 AJ-nb/AJNB 私有仓库与用户本地项目；没有修改源项目、推送、部署或发布操作。

共整理 **10 个候选**，其中 **9 个已有展示素材**；公开素材共 **22 份，约 1.28 MB**。Periastra 与夜礼司为 2 个品牌项目；砚台的旧版与当前版合为一条演化线。XHS Operations OS 仅保留规划候选。

| 候选 | 类别 | 已确认范围 | 公开素材 |
|---|---|---|---|
| Periastra 相机包品牌标志 | brand | 标志方案与应用研究 | 4 张/份 |
| 夜礼司品牌识别与身体装置研究 | brand | 现行品牌方向；产品概念研究 | 3 张/份 |
| 镜序 Lensflow | digital | 已有源码、文档、截图及公开产品站 | 2 张/份 |
| 砚台 · 产品造型学习工具 | digital | 砚台当前 v0.7.5 RC；既有公开前身 v0.6.3 | 1 张/份 |
| 构线 Formline | digital | 本地实现与已保存验收记录 | 2 张/份 |
| Resume Formatter 简历编辑器 | digital | v2.4.0 Fork；公开源码与 Pages | 3 张/份 |
| 视觉档案 | digital | 本地 v0.1.0 扩展原型与截图 | 2 张/份 |
| Eagle 审美图谱 | digital | 既有资料包、学习卡与导入清单 | 2 张/份 |
| 小红书内容运营工作台 | digital | 规划与早期工作区配置；暂不进入公开作品卡片 | 0 张/份 |
| 图像生成与连续编辑评测 | experiment | 2026-09-09 已保存研究素材包；未发布 | 3 张/份 |

## 素材与出处

- 两个品牌目录共 30 个原文件已完整保存到 `private/sources/brand-digital/github/AJ-nb/AJNB/`。树 SHA、blob SHA 与原路径见 `github-download-manifest.json`。
- 机器可读候选、公开路径、图注、角色边界、来源与链接见 `private/sources/brand-digital/inventory.json`。
- 网页素材位于 `web/public/works/brand/` 与 `web/public/works/digital/`。每份素材的源哈希、输出哈希、尺寸和处理方式见 `public-assets-manifest.json`。
- 本地 README、所用截图、许可证及相关文档原件保存于 `private/sources/brand-digital/local/`；对应表见 `local-evidence-manifest.json`。
- 图片只作等比缩放与 WebP 转换，没有重绘、修图或改写截图数据。Periastra 结构 SVG 内嵌了其 Logo 副本以保留网页显示。

## 必须保留的事实边界

1. **Resume Formatter** 是 `gracexygu/resume-formatter` 的 MIT Fork。公开案例应写“基于开源项目二次开发”，保留上游链接；截图中的人物与履历为虚构 fixture。
2. **砚台**：luck-power v0.6.3 是前身，AJNB / visual-lens v0.7.5 是当前演化。当前已删除旧工作台、OCR、图片编辑、三视图与重建功能，不能叠加写入现行介绍。选中截图带有“预览夹具 · study”标识。
3. **夜礼司** 为现行名称，Songnasty 只作早期过程。Logo 矢量精修和实体工艺测试仍列为后续任务。产品图是概念研究，无材料、磁吸和人体工学验证。
4. 夜礼司原文件 `assets/佩戴效果图.png` 实际显示蛇形部件尺寸，`assets/蛇造型尺寸图.png` 实际显示人像佩戴示意。原件未改名；公开副本按实际内容命名。人像与纯蝴蝶参考均未公开。
5. **Periastra** 现有证据是 Logo 与应用研究；小尺寸、金属、织唛与压印是拟验证场景，不能写成已投产产品。
6. **审美图谱** 的机构作品不属于用户原创。只选本项目学习卡；144 风格、2500 来源书签、288 学习卡可由已读 dry-run 清单交叉核实，不代表实际导入完成、人工逐条核验或用户规模。
7. **图像评测** 使用 AI 生成的虚构品牌测试。9/9 是指定编辑动作完成数，并非直接可用率；无竞品或人工基线，不能推导效率提升。原项目明确未发布到小红书。
8. **XHS Operations OS** 未发现已有截图，现有可确认资料为规范与工作区配置；路线图不能改写为已实现产品功能。
9. **视觉档案** 现有截图显示本地尺寸与色板测量，但模型档案尚未生成。可以展示原型工作流，不能用截图声称真实模型分析已验证。

## 链接检查

Lensflow 与 Resume Formatter 的 GitHub Pages 均读取到 HTTP 200。lensflow、luck-power、resume-formatter 为公开仓库；AJNB 与 xhs-operations-os 为私有仓库。公开页面不应向普通访客承诺私有仓库可以直接下载。其他项目未找到已验证的公开链接。

## 去重与验证

工作树、构建目录、旧发布副本和嵌套项目复制不另计作品。品牌原件存在内容完全相同的重复图，已保存哈希分组；公开图库只保留有独立叙事价值的版本。素材均经过目视核对与文件可读取检查；本次未重新运行各软件项目的功能测试。
