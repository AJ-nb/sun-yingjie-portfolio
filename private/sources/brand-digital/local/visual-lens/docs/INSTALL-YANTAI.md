# 砚台下载安装

砚台当前通过 GitHub Release 分发 Chrome MV3 ZIP。仓库为私有仓库，下载前必须登录具有 `AJ-nb/AJNB` 访问权限的 GitHub 账号。

## 当前版本

- [砚台 v0.7.5 RC 1 发布页](https://github.com/AJ-nb/AJNB/releases/tag/yantai-v0.7.5-rc.1)
- [扩展 ZIP](https://github.com/AJ-nb/AJNB/releases/download/yantai-v0.7.5-rc.1/yantai-chrome-v0.7.5.zip)
- [SHA-256 校验文件](https://github.com/AJ-nb/AJNB/releases/download/yantai-v0.7.5-rc.1/SHA256SUMS.txt)
- [安装脚本](https://github.com/AJ-nb/AJNB/releases/download/yantai-v0.7.5-rc.1/install-yantai.ps1)
- [全部版本](https://github.com/AJ-nb/AJNB/releases)

RC 版本来自尚未合并的 Draft PR，只用于受控验证，不代表 Chrome Web Store 正式发布。

## 推荐安装

需要 Chrome 122 或更高版本、PowerShell 7 和已登录私有仓库的 [GitHub CLI](https://cli.github.com/)。

```powershell
gh auth login
gh release download yantai-v0.7.5-rc.1 --repo AJ-nb/AJNB --pattern install-yantai.ps1 --dir $env:TEMP\yantai-installer
pwsh -NoProfile -File $env:TEMP\yantai-installer\install-yantai.ps1 -Tag yantai-v0.7.5-rc.1
```

脚本会执行以下操作：

1. 使用当前 GitHub 登录身份下载 ZIP 和 `SHA256SUMS.txt`。
2. 校验 ZIP 的 SHA-256；不一致时停止。
3. 解压到固定路径 `%LOCALAPPDATA%\AJNB\Yantai\current`。
4. 升级前把旧版本保留到 `%LOCALAPPDATA%\AJNB\Yantai\previous`。
5. 校验根目录 `manifest.json` 是名为“砚台”的 MV3 扩展。

安装完成后打开 `chrome://extensions`，启用“开发者模式”，点击“加载已解压的扩展程序”，选择脚本输出的 `installPath`。Chrome 的官方说明见 [Load an unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)。

## 手动安装

1. 从发布页下载 `yantai-chrome-v0.7.5.zip` 和 `SHA256SUMS.txt`。
2. 运行 `Get-FileHash .\yantai-chrome-v0.7.5.zip -Algorithm SHA256`，与校验文件比较。
3. 将 ZIP 内容直接解压到一个长期不变的目录，目录根部必须能看到 `manifest.json`。
4. 在 `chrome://extensions` 中加载这个目录。

不要每次升级都换一个新的解压路径。未打包扩展的 ID 与路径相关，改变路径可能导致 Chrome 将其视为另一个扩展。

## 升级与迁移

- 使用同一固定安装目录时，重新运行安装脚本并在 `chrome://extensions` 点击“重新加载”。
- 第一次从已有的其他路径迁移前，先在砚台“设置 → 数据管理”导出备份；加载固定路径版本后再合并导入。
- GitHub Release 不能为“加载已解压”的扩展提供 Chrome 自动更新。每个版本都必须重新运行脚本或手动替换文件。
- Release 不包含 API Key、用户档案、Eagle `.library` 或本地分析缓存。

## 回退与卸载

升级脚本只保留一个 `previous`。需要回退时，先在 Chrome 中移除当前加载项，再把 `previous` 恢复为 `current` 并重新加载。卸载前先导出需要保留的砚台数据；删除安装目录不会从 Eagle 删除已写入素材。
