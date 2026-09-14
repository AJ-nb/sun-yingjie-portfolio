# 砚台

砚台是 `AJ-nb/AJNB` 中的 Chrome Manifest V3 产品造型学习模块。它从网页、本地或 URL 图片中拆解设计手法与造型推演，再经人工确认写入唯一允许的 Eagle 图库 `E:\文件\设计参考.library`。

当前版本：`0.7.5`。图谱模块位于 `../packages/aesthetic-atlas`，运行时提供 144 个版本化风格 ID 与规范文件夹路径。

![砚台 Logo](public/brand/yantai-logo.png)

## 下载与安装

- [砚台 v0.7.5 RC 1](https://github.com/AJ-nb/AJNB/releases/tag/yantai-v0.7.5-rc.1)
- [Chrome ZIP](https://github.com/AJ-nb/AJNB/releases/download/yantai-v0.7.5-rc.1/yantai-chrome-v0.7.5.zip)
- [完整安装、升级和回退说明](../docs/INSTALL-YANTAI.md)

私有仓库要求先登录 GitHub。Release ZIP 通过 Chrome 的“加载已解压的扩展程序”安装，不是 Chrome Web Store 自动安装包。

## 工作流

1. 从当前网页选图、直接拖入网页图片、本地上传或输入图片 URL；所有来源先完成解码和尺寸验证。
2. 一次结构化视觉请求完成产品造型手法、形态母型、结构假设和设计推演，并返回最多三个次级归档风格候选。
3. 设计语言、结构、CMF 分别按需生成并独立缓存。
4. 人工确认主风格、任意多个 Eagle 文件夹与内容范围。
5. 执行一次 Eagle 写入和稳定标签回读验证；重复素材只追加缺失的文件夹归属。

成人疑似或 `adultOnly` 风格默认进入成人隔离路径。覆盖为常规范围还需勾选并输入 `GENERAL`。稳定标签 `图谱/ID/capture/<sha256>` 用于阻止重复写入。Eagle 导入不再要求全局 `IMPORT` 解锁，但每件素材仍须确认本次目标文件夹。

## 数据边界

- 分类、设计语言、结构和 CMF 结论均为 `INFERENCE`。
- 单张图片不能证明作者、来源、真实材料、工艺、隐藏结构、安全、人因或量产可行性。
- 旧版分析档案与备份仍可读取；已删除的工作台、OCR、主体分区、SVG、裁切、图片编辑、三视图和重建数据不再显示或生成。
- API Key 默认只保存在浏览器会话；持久保存必须主动开启。

## 构建

要求 Node.js 22。

```bash
cd ..
npm ci
npm run check
```

在 Chrome 的 `chrome://extensions` 中加载 `visual-lens/.output/chrome-mv3`。

## 仓库与研究

- GitHub：`AJ-nb/AJNB`（私有仓库）
- 开源调研：`../docs/research/open-source-register.json`
- 架构记录：`../docs/research/yantai-atlas-integration.md`
- 隐私与安全：[PRIVACY.md](PRIVACY.md)、[SECURITY.md](SECURITY.md)

源码使用 [MIT License](LICENSE)。无许可证参考项目只用于核对行为，不复制源码。
