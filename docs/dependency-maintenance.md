# 依赖维护记录

核查日期：2026-09-15。完整 npm 审计返回 8 项（3 moderate、5 high），排除开发依赖后剩 1 项 fflate。没有执行自动升级；下述修复版本已查询存在，但升级后的依赖树尚未安装或验证。

当前交付是静态文件，未发现这些公告在网站现有输入路径中的可达利用方式。这是基于代码与产物检查的判断，不等于未来修改也不受影响。本任务的 8946 开发服务及 8947 预览服务已停止，线上静态网站无需运行它们。

| 范围 | 已核查情况 | 后续维护 |
| --- | --- | --- |
| fflate 0.6.10 | [ZIP64 解压死循环](https://github.com/advisories/GHSA-px8p-9vwx-vf98)。网站只加载固定 GLB，没有 ZIP 上传；GLTFLoader 不调用 ZIP 解压，当前可达产物未发现相应入口。 | 可在现有依赖范围内更新至 0.6.11。 |
| Vite 5.4.21 | [Windows 路径绕过](https://github.com/advisories/GHSA-fx2h-pf6j-xcff)、[依赖映射路径遍历](https://github.com/advisories/GHSA-4w7w-66w2-5vf9)、[本地编辑器接口 NTLM 泄露](https://github.com/advisories/GHSA-v6wh-96g9-6wx3)。静态网站没有这些开发接口；仅绑定本机也不能消除所有本地服务风险。 | 继续长期启用开发服务前，单独验证升级到 6.4.3 或当时受支持版本；属于主版本升级。 |
| esbuild 0.21.5 | [serve 跨站响应读取](https://github.com/advisories/GHSA-67mh-4wv8-2f99)。当前使用构建转换，静态产物不运行其服务。 | 随 Vite 升级验证 0.25.0 或更新兼容版本。 |
| PostCSS、Browserslist、baseline-browser-mapping | 仅用于本地构建，当前没有网页输入进入该流程。 | 定向锁文件更新候选：8.5.23、4.28.7、2.11.0。 |
| brace-expansion、nanoid | 分别由代码检查及 PostCSS 引入，未发现网站输入入口。 | 定向锁文件更新候选：5.0.9、3.3.18。 |

维护时重新查询公告和版本，使用独立改动验证内容、类型、代码、构建及必要的交互回归。不能直接使用 `audit fix --force` 改动主版本后就宣称通过。
