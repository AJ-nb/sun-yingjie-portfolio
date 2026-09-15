# 孙英杰作品集 · 第二轮交付

固定网址：<https://sun-yingjie-portfolio.ajhhq.chatgpt.site>。私人仓库：<https://github.com/AJ-nb/sun-yingjie-portfolio>。

## 交付文件

- 网站：33个案例、66份双语正文，六章依次为商业橱窗、铝型材灯具、产品与模型、三维渲染、品牌孵化、AI与数字产品。
- 完整作品集：`deliverables/portfolio/sun-yingjie-portfolio.pdf`，116页，33案例、73详情页、39书签及256链接。原图与合作署名保留。
- 简历：`deliverables/resume/sun-yingjie-resume.pdf`，一页A4；同目录 `.docx` 为可编辑Word，二维码链接固定网站。
- 原创人物：`avatar/sun-yingjie-avatar-draft-v3.blend`、`web/public/models/avatar.glb`；四视图和转台见 `web/public/images/avatar/`，技术证据见 `avatar/evidence/`。
- 设计、维护与来源：`DESIGN.md`、`README.md`、`docs/source-coverage.md`及 `private/sources/coverage.json`。

## 网站与文档

采用sen的固定三维首屏、居中信息、四角框、文字上移模糊、五个履历节点停靠、350帧镜头、磨砂履历、景深与光效。桌面滚动浏览横向六章，手机和低动态模式使用纵向章节。保留筛选、搜索、独立案例、浏览器返回位置、灯箱、视频、中英文与下载。

网站和文档共用事实档案：理灵2026.03至今，BENWU2025.03–2025.12，欧音2023.12–2025.02；商业橱窗叙事起点为用户指定的2025.04，不改写任职日期。彼源、夜礼司和Periastra按参与品牌孵化呈现；数字案例区分Chrome扩展、原生小程序与方法研究。

新增22张既有模型渲染、17张Photoshop原生选图、37张渲染PDF分图。薪跳增加5张原生界面，338项测试通过；深色设置未在此次模拟器生效，已保留限制说明。没有编写未经证实的量产、负责人、4年经验或比例业绩。

## 验证与当前状态

本轮类型、代码、内容和构建检查通过；15项生产浏览器检查与7项独立专项检查通过，零普通流程页面异常。作品集116页全部渲染并视觉审阅，最后仅两页文案精修，其余114页像素一致。简历一页A4和Word正文均已复核。详细结果见 `browser-qa.md`、`portfolio-qa.md`、`resume-notes.md`。

人物有真实几何、独立眼球及350帧镜头，工程重开与GLB验证通过。相似度仍待用户一次集中定稿审阅，记录于 `avatar/evidence/user-review-v3.json`。公开发布已获授权；在人物确认前仅更新本人预览，不将网站宣称为已匿名公开。

私人仓库同步、新检出构建与本轮远端状态由 `clean-checkout-verification.json`、`remote-delivery-verification.json`记录。第一轮报告归档在 `private/sources/history/refinement-r1/`，其中30案例、40页和旧校验值不代表本轮交付。

## 已知边界

- HUHU OBJ已实际打开并重开，原始计数与导入计数一致、源文件哈希未变。管道C4D在官方脚本启动阶段被本机许可证阻止，未实际加载场景或验证贴图；已选既有真实渲染仍可展示。
- 已准备三套结构锁定的产品表现提示词。指定ChatGPT入口被自动安全校验拒绝，理由是无法可靠确认当前浏览器网址；本轮没有生成新的image2.5优化图，也没有换用其他模型。
- 公开构建只含246项选入资产和页面程序，不含原始档案、提示词、Word或Blender原件。约21.7GiB历史工程原件留在本地，保留早期校验快照；本轮不宣称重新读取所有大型原件。
- 未实测实体手机、Safari和移动GPU电池消耗。站点不配置阅后失效或访问次数限制；托管方服务与流量限制仍适用，未承诺无限流量或永久零故障。
