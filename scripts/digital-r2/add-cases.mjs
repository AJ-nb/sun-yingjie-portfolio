import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const write=(slug,lang,meta,body)=>fs.writeFileSync(path.join(root,`web/src/content/works/${slug}.${lang}.md`),`---\n${Object.entries(meta).map(([k,v])=>`${k}: ${JSON.stringify(v)}`).join('\n')}\n---\n\n${body.trim()}\n`);
const methodDir=path.join(root,'web/public/works/refinement-digital/xhs-methods');
fs.mkdirSync(methodDir,{recursive:true});
fs.writeFileSync(path.join(methodDir,'workflow.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="960" viewBox="0 0 1440 960"><rect width="1440" height="960" fill="#f3f0e8"/><g font-family="Arial, Microsoft YaHei, sans-serif"><text x="80" y="85" fill="#68746d" font-size="20" letter-spacing="3">XHS OPERATIONS OS / METHOD STUDY</text><text x="80" y="160" fill="#1b302b" font-size="48" font-weight="700">先保留事实，再组织表达</text><text x="80" y="208" fill="#68746d" font-size="23">Evidence → Brief → Variants → Review → Package</text><path d="M180 350 H1260" stroke="#b3bdb3" stroke-width="3"/><g fill="#1b302b"><circle cx="180" cy="350" r="30"/><circle cx="450" cy="350" r="30"/><circle cx="720" cy="350" r="30"/><circle cx="990" cy="350" r="30"/><circle cx="1260" cy="350" r="30"/></g><g fill="#fff" text-anchor="middle" font-size="21"><text x="180" y="358">01</text><text x="450" y="358">02</text><text x="720" y="358">03</text><text x="990" y="358">04</text><text x="1260" y="358">05</text></g><g fill="#1b302b" text-anchor="middle" font-size="27" font-weight="700"><text x="180" y="428">产品事实</text><text x="450" y="428">内容简报</text><text x="720" y="428">候选表达</text><text x="990" y="428">人工复核</text><text x="1260" y="428">发布资料包</text></g><g fill="#68746d" text-anchor="middle" font-size="18"><text x="180" y="470">原始素材 / 来源 / 未知项</text><text x="450" y="470">对象 / 角度 / 保留约束</text><text x="720" y="470">文字 / 图像 / 版本</text><text x="990" y="470">事实 / 形态 / 规则</text><text x="1260" y="470">导出 / 手动发布 / 复盘</text></g><rect x="80" y="595" width="1280" height="205" rx="8" fill="#e0e5dc"/><text x="120" y="648" fill="#1b302b" font-size="22" font-weight="700">研究原则 / RESEARCH PRINCIPLES</text><text x="120" y="694" fill="#425c50" font-size="22">原始素材不被替换 · 推断不写成事实 · 指定修改与整体可用性分别验收</text><text x="120" y="738" fill="#425c50" font-size="19">Keep originals · Label inference · Review both requested edits and unintended changes</text><text x="80" y="884" fill="#68746d" font-size="18">方法示意，非运行界面。当前实现为 Foundation Shell（P0 / Task 4）。</text><text x="80" y="916" fill="#68746d" font-size="16">Method diagram, not an application screenshot. Implementation is at the foundation-shell stage.</text></g></svg>`);

write('xhs-methods','zh',{title:'XHS 内容生产方法研究',category:'experiments',summary:'把产品事实、原始素材、生成候选和人工复核连接起来的内容工作流研究。',role:'方法研究与产品规划共同创作',credits:'研究框架、需求与原型共同创作；功能阶段按现有代码说明',status:'方法研究与基础应用壳；尚未完成运营系统',cover:'/works/refinement-digital/xhs-methods/workflow.svg',tags:['方法研究','内容工作流','事实管理','人工审阅']},`
## 背景

面向小红书的内容工作涉及产品资料、文案、图像和发布判断。不同阶段若各自生成一套说法，商品事实、视觉形态与最终表达容易脱节。这项研究关注如何先建立可核对的输入，再形成可审阅的内容候选。

## 本人职责

工作涵盖方法框架、需求整理、信息结构和基础应用壳的共同创作。现有代码首页明确标记 Foundation Shell / P0 / Task 4；路线图中的产品库、生成、评测和审批流程是后续设计范围，不能写成已经上线的功能。

## 研究路径

产品事实与未知项先进入资料记录，原始图片保持独立。内容简报再指定目标对象、主题角度、语言和必须保留的外观。生成结果以候选版本保存，经事实、产品一致性与适用规则复核后，由人决定是否进入发布资料包。

![XHS 内容方法研究流程](/works/refinement-digital/xhs-methods/workflow.svg)

*依据需求文档整理的方法示意，不是运行界面，也不代表五个阶段已实现。*

## 与图像实验的连接

现有连续编辑实验提供了一个具体方法问题：背景、标题或圆点被正确修改时，包装纹理仍可能漂移。因此流程应分别记录“指定修改完成”和“整体是否可用”，保留每轮输入、完整指令、原始输出与退回原因。此处将实验结论用于需求定义，不宣称已完成自动评测系统。

## 当前成果与下一步

已形成版本化需求、架构与分阶段路线图，以及可辨认阶段的基础页面。下一步应先验证产品事实和原始素材的组织，再实现候选生成与人工审阅。当前没有自动发布、真实运营数据回流或增长成效证据；平台规则应在具体发布时按原始来源重新核对。

## 来源

xhs-operations-os 的 README、MASTER_PRD、ROADMAP、SPEC_MANIFEST 与首页源码；图像方法参照同作品集中的“图像生成与连续编辑评测”。该项目作为方法研究单列，不与镜序或砚台重复计算实现成果。
`);
write('xhs-methods','en',{title:'XHS Content Workflow Research',category:'experiments',summary:'A method study connecting product facts, original assets, generated candidates and human review.',role:'Collaborative method research and product planning',credits:'Research framework, requirements and prototype are collaborative; implementation stage follows existing code',status:'Method research and foundation shell; operations system incomplete',cover:'/works/refinement-digital/xhs-methods/workflow.svg',tags:['Method study','Content workflow','Fact management','Human review']},`
## Context

Creating Xiaohongshu content spans product records, copy, images and publishing decisions. If each stage invents its own account, product facts, appearance and final claims can diverge. This research asks how verified inputs can lead to reviewable candidates.

## My contribution

The work covers collaborative method development, requirements, information structure and an application foundation shell. The implemented homepage explicitly states Foundation Shell / P0 / Task 4. Product libraries, generation, evaluation and approval in the roadmap are planned scope rather than released functionality.

## Research path

Product facts and unknowns enter a source record, with original images kept separately. A brief defines the audience, angle, language and appearance constraints. Generated candidates retain versions and undergo fact, product-consistency and applicable-rule review before a human decides whether they belong in a publication package.

![XHS method workflow](/works/refinement-digital/xhs-methods/workflow.svg)

*A method diagram derived from requirements, not a running interface or evidence that all five stages are implemented.*

## Connection to the image experiments

The existing continuous-edit study exposes a concrete problem: an edit can correctly change the background, headline or dot while packaging texture still drifts. The proposed workflow therefore records requested-change completion separately from overall usability, retaining each input, complete prompt, original output and rejection reason. These findings inform requirements; they do not establish an implemented automatic evaluator.

## Current outcome and next step

Versioned requirements, architecture, a staged roadmap and an explicitly labeled foundation page exist. The next step is to validate product facts and original-asset organization before implementing generation and review. There is no evidence of automatic publication, live operational feedback or growth outcomes. Platform rules require fresh checks against original sources at the time of publication.

## Sources

xhs-operations-os README, MASTER_PRD, ROADMAP, SPEC_MANIFEST and homepage source; image-method observations refer to the Image Generation and Continuous Editing Study in this portfolio. This is a method study and does not duplicate Lensflow or Yantai implementation outcomes.
`);

const ipSource=path.join(root,'private/sources/refinement-digital/xintiao-isolated/miniprogram/assets/ip/poses/hello.png');
const ipDest=path.join(root,'web/public/works/refinement-digital/xintiao/monster-hello.png');
fs.copyFileSync(ipSource,ipDest);
write('xintiao','zh',{title:'薪跳 · 原生微信小程序',category:'digital',summary:'以今日已赚金额为首页中心，连接薪资月历、每日记录与三步引导的轻量工具。',role:'产品、交互、视觉与微信平台改造参与',credits:'工资核心复用 MrBaoboer/PayDance（AGPL-3.0-only）；薪跳并非 PayDance 官方产品；项目按共同创作呈现',status:'本地原生小程序；隔离副本构建与338项测试通过',cover:'/works/refinement-digital/xintiao/monster-hello.png',tags:['微信小程序','产品交互','开源复用','本地数据']},`
## 背景

薪跳让用户打开首页就看到今天已经赚了多少，再按需要查看日历与明细。金额是第一视觉，工作状态、倒计时、进度与统计为其提供解释；角色和桌面小工具承担轻量反馈，不挤占工资主体。

## 本人职责与复用范围

参与产品组织、交互、视觉与微信平台改造。工资计算核心源自 [MrBaoboer/PayDance](https://github.com/MrBaoboer/PayDance)，涉及计薪配置、工时段、跨零点夜班、快照与校验，保留原始署名和 AGPL-3.0-only 声明。薪跳是基于该核心的独立小程序项目，并非 PayDance 官方产品；不将该核心宣称为从零原创。

## 从第一次打开到日常查看

首次使用通过计薪方式、上下班时间和午休三个步骤建立配置，每一步校验对应输入。完成后回到“今天”，金额由真实时间重新计算，定时刷新只决定重算频率，不依靠后台不断累加。跨零点班次仍沿工资核心的工时逻辑处理。

一级导航为“今天 / 日子”。“日子”用月历和汇总提供回看入口，每日页连接实际收入、工时、加班与心情短记录；设置从独立入口进入。深色主题和减少动画选项服务不同使用条件，金额和状态仍保持主要层级。

## 视觉与平台实现

“面包机小怪”以不同姿态对应引导和状态反馈。当前素材集包含十个 PNG 姿态，组件统一控制角色呈现。原生页面、组件、分包与本地存储构成微信平台实现；不是把网页截图放入 WebView。

![薪跳原始角色素材](/works/refinement-digital/xintiao/monster-hello.png)

*小程序实际使用的角色 PNG 原素材，不是运行截图。*

## 实际验证与当前边界

2026-09-15 在作品集内部的隔离副本核对：原始目录只读；由于原目录缺少根级类型检查配置，仅在副本补充指向原有小程序配置的入口。当前构建校验覆盖 14 个页面、7 个主包共享组件，0 个构建失败；338 项测试通过。这里的构建校验不等于微信开发者工具编译或真机测试。

原生界面采集仍待完成：本次微信 CLI 报告服务端口关闭，未更改安全设置。现阶段不展示设计稿冒充运行截图。已核对的本地存储代码版本为 5，高于 README 的旧描述；提醒目前是应用内机制，微信订阅消息尚未接入。

## 来源

today-salary-miniapp README、NOTICE、工资核心文件头、原生页面/组件、当前存储代码，以及本次隔离验证报告。测试数量来自本次执行，不沿用 README 的历史 295 项口径。用户规模、微信审核上线和真实薪资准确率尚无验证材料。
`);
write('xintiao','en',{title:'Xintiao — Native WeChat Mini Program',category:'digital',summary:'A lightweight tool centered on today’s earned income, connecting a salary calendar, daily records and three-step onboarding.',role:'Product, interaction, visual and WeChat adaptation participation',credits:'Salary core reused from MrBaoboer/PayDance under AGPL-3.0-only; not an official PayDance product; presented as collaborative work',status:'Local native mini program; isolated build and 338 tests passed',cover:'/works/refinement-digital/xintiao/monster-hello.png',tags:['WeChat mini program','Product interaction','Open-source reuse','Local data']},`
## Context

Xintiao opens directly on today's earned amount, with calendar and detail views available when needed. Work state, countdown, progress and summary figures explain the amount. The character and small desk tools provide feedback while income remains the main focus.

## My contribution and reused core

Participation covers product structure, interaction, visual design and adaptation to WeChat. The salary core comes from [MrBaoboer/PayDance](https://github.com/MrBaoboer/PayDance), including salary configuration, work spans, overnight shifts, snapshots and validation. Original attribution and AGPL-3.0-only notices remain. Xintiao is an independent mini-program project based on that core, not an official PayDance product; the core is not claimed as original work from scratch.

## From first launch to daily use

Three onboarding steps establish salary type, work hours and lunch breaks, validating the relevant inputs at each step. Completion returns to Today. The amount is recomputed from real time; the heartbeat controls refresh frequency rather than accumulating income in the background. Overnight shifts follow the reused salary core's work-span logic.

The primary navigation is Today / Days. Days connects a calendar and monthly summaries to daily income, hours, overtime, mood and a short note. Settings have a separate entry. Dark appearance and reduced motion support different conditions while preserving the amount and state hierarchy.

## Visual and platform implementation

The toaster character uses different poses for onboarding and state feedback. The current asset set contains ten PNG poses, presented through a shared component. Native pages, components, subpackages and local storage form the WeChat implementation; it is not webpage imagery inside a WebView.

![Original Xintiao character asset](/works/refinement-digital/xintiao/monster-hello.png)

*The actual character PNG used by the mini program. This is artwork, not a runtime screenshot.*

## Actual verification and current boundary

On 15 September 2026, an isolated copy inside the portfolio was checked while the original directory remained read-only. The source lacked a root type-check configuration, so the copy received an entry pointing to its existing mini-program configuration. Build validation covered 14 pages and 7 shared main-package components with no build failures; 338 tests passed. This validation is separate from WeChat DevTools compilation or device testing.

Native interface capture remains incomplete: the WeChat CLI reported that its service port was disabled, and no security setting was changed. Design mockups are not presented as runtime captures. The inspected storage code uses version 5, newer than the README description. Reminders are currently in-app; WeChat subscription messages are not integrated.

## Sources

today-salary-miniapp README, NOTICE, salary-core headers, native pages/components, current storage code and this round's isolated validation reports. The test count comes from this execution rather than the README's historical 295 tests. User scale, WeChat publication approval and real-world payroll accuracy are not established.
`);
console.log('Added XHS methods and Xintiao in Chinese and English.');
