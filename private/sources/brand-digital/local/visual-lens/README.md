# AJNB Design Workspace

本仓库采用 npm workspace 管理两个模块：

- `visual-lens`：砚台 Chrome 扩展，负责选图、产品造型设计手法拆解、次级风格分类、人工确认和 Eagle 单项写入。
- `packages/aesthetic-atlas`：审美图谱，负责 144 个风格记录、规范文件夹路径、研究资料和 Eagle 素材包生成。

```bash
npm ci
npm run check
```

Node.js 版本统一为 22。开源项目的锁定提交、许可证、隐私风险和复用决定记录在 `docs/research/open-source-register.json`。

## 下载安装

- [砚台 v0.7.5 RC 1 发布页](https://github.com/AJ-nb/AJNB/releases/tag/yantai-v0.7.5-rc.1)
- [直接下载 Chrome ZIP](https://github.com/AJ-nb/AJNB/releases/download/yantai-v0.7.5-rc.1/yantai-chrome-v0.7.5.zip)
- [安装与升级指南](docs/INSTALL-YANTAI.md)
- [全部 GitHub Releases](https://github.com/AJ-nb/AJNB/releases)

仓库为私有仓库，下载链接要求登录 GitHub。当前 RC 来自 Draft PR，用于受控验证；Chrome 通过“加载已解压的扩展程序”安装，GitHub Release 不提供自动更新。
