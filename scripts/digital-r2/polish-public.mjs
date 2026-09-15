import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const slugs=['biyuan','yelisi','periastra','lensflow','yantai','formline','resume-formatter','visual-archive','aesthetic-atlas','image-2-5-xhs','xintiao','xhs-methods'];
for(const slug of slugs)for(const lang of ['zh','en']){
  const file=path.join(root,`web/src/content/works/${slug}.${lang}.md`);let s=fs.readFileSync(file,'utf8');
  const split=s.split('<!-- refinement-v2 -->');
  if(split.length>1)s=split[0]+'<!-- refinement-v2 -->'+split.slice(1).join('<!-- refinement-v2 -->').replace(/^## /gm,'### ');
  if(slug==='biyuan'){
    if(lang==='zh'){
      s=s.replace('credits: "本人确认全面参与上述工作；项目按协作成果呈现"','credits: "孙英杰参与；与项目团队共同完成"');
      s=s.replace('本人参与品牌设计、官网页面、交互设计与开发，参与范围由本人确认。案例按共同完成的项目呈现；公开页面用于核对最终表现，镜序与简历编辑器中的彼源接入用于补充工具侧证据。现有材料没有把每个页面与代码片段单独归到个人名下。','参与品牌设计、官网页面、交互设计与开发，与项目团队共同完成从服务表达、页面组织到工具接入的体验。工作围绕品牌可辨识、模型可选择、接入路径可理解三个方面展开。');
      s=s.replace('## 从品牌表达进入使用路径','## 关键问题').replace('## 模型广场的信息与交互','## 设计过程').replace('## 从官网延伸到创作工具','## 最终作品').replace('## 移动端与阶段','## 成果与阶段').replace('## 来源','### 来源');
      s=s.replace('本次核对实际输入了 gpt-image，并观察到结果从完整列表收束为相关条目；这验证的是搜索界面行为。','名称搜索将完整列表收束为相关条目，使用户能从用途探索切换到明确目标的查找。');
      s=s.replace('公开官网及模型搜索可访问；本次没有进入登录后控制台、读取用户密钥或执行模型收费请求。独立官网源码尚未纳入本地来源集，因此不把其他工具的源码当作官网实现文件。','官网与模型广场已公开，服务在创作工具中的接入仍持续迭代。模型可用范围取决于服务与账户，目录展示本身不能替代逐项调用验证。');
      s=s.replace('；本人参与范围来自本轮确认。','。');
    }else{
      s=s.replace('credits: "Participation confirmed by the designer; presented as collaborative work"','credits: "Sun Yingjie participated; completed with the project team"');
      s=s.replace('I participated in brand design, website pages, interaction design and development. This scope is confirmed by me and presented as collaborative work. Public pages establish the visible outcome; Biyuan integrations in Lensflow and Resume Formatter provide separate evidence of product integration. The available records do not assign every page or code fragment to one individual.','I participated in brand design, website pages, interaction design and development with the project team. The work connects service communication, page structure and product integration around three concerns: a recognizable identity, understandable model selection and a clear route into use.');
      s=s.replace('## Context','## Background').replace('## My contribution','## My role').replace('## From identity to an entry point','## Key question').replace('## Finding a model','## Design process').replace('## Extending the service into creative tools','## Final work').replace('## Mobile and current stage','## Outcome and stage').replace('## Sources','### Sources');
      s=s.replace('In this review, entering gpt-image narrowed the full directory to matching entries. This verifies the visible search interaction.','Name search narrows the directory to matching entries, letting visitors move from exploring use cases to finding a specific model.');
      s=s.replace('The public site and model search were accessible. This review did not enter the authenticated console, read user keys or issue billable model requests. No independent website source tree was included in the local evidence set; source files for the other tools are not presented as website source.','The website and model directory are public, while creative-tool integration continues to evolve. Model availability depends on the service and account; listing a model does not replace individual call verification.');
      s=s.replace('; participation scope confirmed by the designer during this refinement.','.');
    }
  }
  if(slug==='xhs-methods'){
    if(lang==='zh'){
      s=s.replace('## 研究路径','## 关键问题\n\n需要解决的是跨阶段的信息一致性：产品事实如何进入简报，图像派生结果如何保留出处，退回后的修改如何继续沿用同一组约束。\n\n## 设计过程').replace('## 与图像实验的连接','## 最终作品').replace('## 当前成果与下一步','## 成果与阶段').replace('## 来源','### 来源');
    }else{
      s=s.replace('## Context','## Background').replace('## My contribution','## My role').replace('## Research path','## Key question\n\nThe central question is consistency across stages: how facts enter a brief, how derivatives retain provenance, and how revisions preserve the same constraints.\n\n## Design process').replace('## Connection to the image experiments','## Final work').replace('## Current outcome and next step','## Outcome and stage').replace('## Sources','### Sources');
    }
  }
  if(slug==='xintiao'){
    if(lang==='zh'){
      s=s.replace('status: "本地原生小程序；隔离副本构建与338项测试通过"','status: "原生小程序开发与验证阶段"');
      s=s.replace('## 本人职责与复用范围','## 本人职责').replace('## 从第一次打开到日常查看','## 关键问题\n\n实时金额必须与工时规则一致，跨零点与午休不能靠界面动画推算；第一次配置要足够清楚，日常回看又不能被设置流程打断。\n\n## 设计过程').replace('## 视觉与平台实现','## 最终作品').replace('## 实际验证与当前边界','## 成果与阶段').replace('## 来源','### 来源');
      s=s.replace(/2026-09-15 在作品集内部的隔离副本核对：[\s\S]*?这里的构建校验不等于微信开发者工具编译或真机测试。/,'现有原生工程包含 14 个页面和 7 个主包共享组件，覆盖首页、日历、每日记录、设置与分包工具。工资计算、本地记录、主题与组件组织已形成可验证的代码与素材，项目仍处于本地开发阶段。');
      s=s.replace(/原生界面采集仍待完成：[\s\S]*?微信订阅消息尚未接入。/,'目前展示角色原始素材；原生运行界面与真机表现需进一步验证。提醒目前为应用内机制，微信订阅消息尚未接入。用户规模、微信审核上线和真实薪资准确率尚无验证材料。');
      s=s.replace('以及本次隔离验证报告。测试数量来自本次执行，不沿用 README 的历史 295 项口径。用户规模、微信审核上线和真实薪资准确率尚无验证材料。','以及项目构建与测试记录。');
    }else{
      s=s.replace('status: "Local native mini program; isolated build and 338 tests passed"','status: "Native mini-program development and validation"');
      s=s.replace('## Context','## Background').replace('## My contribution and reused core','## My role').replace('## From first launch to daily use','## Key question\n\nIncome must follow work-span rules rather than animation, including overnight shifts and lunch breaks. Initial setup needs to be understandable without interrupting everyday review.\n\n## Design process').replace('## Visual and platform implementation','## Final work').replace('## Actual verification and current boundary','## Outcome and stage').replace('## Sources','### Sources');
      s=s.replace(/On 15 September 2026, an isolated copy[\s\S]*?This validation is separate from WeChat DevTools compilation or device testing\./,'The native project contains 14 pages and 7 shared main-package components covering the home, calendar, daily records, settings and subpackage tools. Salary calculation, local records, themes and components have a source and asset implementation. The project remains in local development.');
      s=s.replace(/Native interface capture remains incomplete:[\s\S]*?WeChat subscription messages are not integrated\./,'Original character artwork is shown at this stage; native runtime and device behavior require further verification. Reminders are in-app, and WeChat subscription messages are not integrated. User scale, WeChat publication approval and real-world payroll accuracy are not established.');
      s=s.replace("and this round's isolated validation reports. The test count comes from this execution rather than the README's historical 295 tests. User scale, WeChat publication approval and real-world payroll accuracy are not established.",'and project build/test records.');
    }
  }
  const replacements=[
    ['本轮有依据的个人参与范围仍是','个人参与范围为'],
    ['；本轮没有对用户的真实 Eagle 图库执行写入测试。','；实际图库写入仍需按环境验证。'],
    ['本轮没有对用户的真实 Eagle 图库执行写入测试。','实际图库写入仍需按环境验证。'],
    ['本轮保留原脏工作区，未修改来源代码或执行实际图库导入。','当前案例保留演化记录；实际图库导入效果需按环境验证。'],
    ['2026-09-15 本轮只读核对源码与文档；没有读取凭据或重新跑收费接口，也未覆盖原工作区缺失文件。','现有界面、源码与版本记录共同说明项目阶段。'],
    ['本轮为资料核对，未重新执行全套编辑器测试。',''],
    ['本轮未调用带凭据的服务。',''],
    ['No writes to the user\'s real Eagle library were performed in this review.','Live library integration requires environment-specific validation.'],
    ['The original modified workspace was preserved, with no source edits or real library import.','The development history remains visible; live library import requires environment-specific validation.'],
    ['The 15 September review read source and documentation only; it did not access credentials, rerun billable calls or restore missing files in the original workspace.','The interface, source and version records jointly establish the project stage.'],
    ['This round reviewed the evidence rather than rerunning the full editor test suite.',''],
    ['No credentialed service was called during this review.',''],
  ];
  for(const [a,b] of replacements)s=s.replaceAll(a,b);
  fs.writeFileSync(file,s);
}
console.log('Polished public copy; execution details retained in private verification.');
