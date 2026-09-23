import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const works = path.join(root, 'web/src/content/works');
const write = (slug, lang, meta, body) => fs.writeFileSync(path.join(works, `${slug}.${lang}.md`), `---\n${Object.entries(meta).map(([k,v]) => `${k}: ${JSON.stringify(v)}`).join('\n')}\n---\n\n${body.trim()}\n`);
const append = (slug,lang,body) => {
  const f=path.join(works,`${slug}.${lang}.md`);
  const old=fs.readFileSync(f,'utf8').split('\n<!-- refinement-v2 -->')[0].trimEnd();
  fs.writeFileSync(f,`${old}\n\n<!-- refinement-v2 -->\n\n${body.trim().replace(/^## /gm,'### ')}\n`);
};

write('biyuan','zh',{
  title:'彼源 AI · 品牌、官网与产品接入', category:'brand',
  summary:'参与品牌视觉、官网、交互和开发，把统一模型接入服务转化为可理解的页面与工具入口。',
  role:'品牌、官网、交互与开发参与', credits:'本人确认全面参与上述工作；项目按协作成果呈现',
  status:'公开官网与模型广场；工具侧接入持续迭代',
  cover:'/works/refinement-brand/biyuan/home-desktop.png',
  tags:['品牌体验','官网设计','交互开发','AI 服务']
},`
## 背景

彼源 AI 面向需要使用不同模型的创作者与开发者。品牌官网承担两个连续任务：先解释服务，再让访问者找到适合的模型、文档和接入入口。品牌识别、页面层级与真实使用路径因此需要一起考虑。

## 本人职责

本人参与品牌设计、官网页面、交互设计与开发，参与范围由本人确认。案例按共同完成的项目呈现；公开页面用于核对最终表现，镜序与简历编辑器中的彼源接入用于补充工具侧证据。现有材料没有把每个页面与代码片段单独归到个人名下。

## 从品牌表达进入使用路径

公开页面用深色图形标志和中文字标建立识别，暖白底色与橙色强调连接标题、按钮和状态。首屏把“一个密钥”的服务入口放在第一层，并并列提供“快速开始”与“查看接口文档”：前者进入使用流程，后者支持需要先理解接口的人。

![彼源官网桌面首页](/works/refinement-brand/biyuan/home-desktop.png)

*2026-09-15 公开官网真实截图。页面中的服务、价格与性能文案属于网站当时的表述，本案例不将其转换为独立性能测试结论。*

## 模型广场的信息与交互

模型广场用用途筛选、名称搜索和模型卡片处理选择问题。页面保留“去试用”与“复制名称”入口，让理解模型与实际调用之间有明确的下一步。本次核对实际输入了 gpt-image，并观察到结果从完整列表收束为相关条目；这验证的是搜索界面行为。

![彼源模型广场](/works/refinement-brand/biyuan/models-desktop.png)

*公开模型目录的桌面呈现，含用途、价格说明与操作入口。*

![彼源模型名称搜索结果](/works/refinement-brand/biyuan/models-filtered.png)

*实际搜索后的页面状态。目录中的可见模型名不等于已逐项完成真实接口调用。*

## 从官网延伸到创作工具

镜序与 Resume Formatter 均已有彼源服务预设。工具把服务地址、可用模型读取、连接检查与后续任务分开：用户先配置自己的服务，再决定哪些图像或文字进入分析。镜序文档把第三方服务的全面兼容状态列为待核实；简历工具在改写前保留差异审阅，在全文发送前呈现发送范围。品牌参与由此延伸到服务在具体产品中的接入体验。

## 移动端与阶段

移动端首屏保留品牌、标题与主要行动入口，次要导航收束到页面底部。公开官网及模型搜索可访问；本次没有进入登录后控制台、读取用户密钥或执行模型收费请求。独立官网源码尚未纳入本地来源集，因此不把其他工具的源码当作官网实现文件。

![彼源官网移动端首页](/works/refinement-brand/biyuan/home-mobile.png)

*390 × 844 视口的真实网页截图。*

## 来源

[彼源官网](https://biyuan.ai/)与[模型广场](https://biyuan.ai/models)，公开页面核对于 2026-09-15；本人参与范围来自本轮确认。工具侧依据 Lensflow 的 README、实施状态文档，以及 Resume Formatter v2.4.0 的 README。截图保留原页面，未重绘界面。
`);
write('biyuan','en',{
  title:'Biyuan AI — Brand, Website & Product Integration',category:'brand',
  summary:'Participation across brand identity, website, interaction and development, connecting an AI service to understandable pages and product entry points.',
  role:'Brand, website, interaction and development participation',credits:'Participation confirmed by the designer; presented as collaborative work',
  status:'Public website and model directory; product integrations in iteration',cover:'/works/refinement-brand/biyuan/home-desktop.png',
  tags:['Brand experience','Website design','Interaction development','AI service']
},`
## Context

Biyuan AI serves creators and developers using different models. Its website has two connected jobs: explain the service, then help a visitor find a model, documentation and an entry point. Identity, information hierarchy and the path into actual use need to work together.

## My contribution

I participated in brand design, website pages, interaction design and development. This scope is confirmed by me and presented as collaborative work. Public pages establish the visible outcome; Biyuan integrations in Lensflow and Resume Formatter provide separate evidence of product integration. The available records do not assign every page or code fragment to one individual.

## From identity to an entry point

The public site combines a dark symbol and Chinese wordmark with a warm white background and orange accents across the headline, buttons and status elements. The opening screen introduces the one-key service and places Quick Start beside API Documentation, supporting both immediate use and prior technical reading.

![Biyuan desktop homepage](/works/refinement-brand/biyuan/home-desktop.png)

*Actual public website capture, 15 September 2026. Service, price and performance statements inside the screenshot are the site's wording at that time, not independent benchmark findings.*

## Finding a model

The model directory combines use-case filters, name search and cards. Try and Copy Name actions connect the selection step to use. In this review, entering gpt-image narrowed the full directory to matching entries. This verifies the visible search interaction.

![Biyuan model directory](/works/refinement-brand/biyuan/models-desktop.png)

*The public directory presents use cases, price information and actions.*

![Filtered model search](/works/refinement-brand/biyuan/models-filtered.png)

*An actual search state. A model name being listed does not establish a completed live API call for that model.*

## Extending the service into creative tools

Lensflow and Resume Formatter include a Biyuan preset. Service configuration, available-model retrieval, connection checking and the creative task are separate steps: users configure their own service and choose what imagery or text to submit. Lensflow's status document leaves universal provider compatibility unverified. Resume Formatter retains rewrite review and discloses the scope before sending a full document. This connects the brand experience to concrete product integration work.

## Mobile and current stage

The mobile opening screen retains the identity, headline and primary actions, with secondary links available below. The public site and model search were accessible. This review did not enter the authenticated console, read user keys or issue billable model requests. No independent website source tree was included in the local evidence set; source files for the other tools are not presented as website source.

![Biyuan mobile homepage](/works/refinement-brand/biyuan/home-mobile.png)

*Actual webpage capture at a 390 × 844 viewport.*

## Sources

[Biyuan](https://biyuan.ai/) and its [model directory](https://biyuan.ai/models), checked on 15 September 2026; participation scope confirmed by the designer during this refinement. Integration evidence: Lensflow README and implementation status, and Resume Formatter v2.4.0 README. Captures preserve the real interface without redrawing it.
`);

append('yelisi','zh',`
## 品牌目标与应用关系

品牌目标是为私密摄影道具与身体装置建立克制而可辨认的身份。中文命名承担语义，近方形印面承担边界，中央负形承担身体联想；三者各有角色，避免把视觉识别压缩为单一的 S 字母。

2026 年 5 月的演化记录保留了四步：Songnasty 探索、旧名称与识别中心的问题、中文私印方向重定、夜礼司方向确认。前期曲线与印感被保留，英文中心与直白的身体联想被降为辅助层。这里描述的是项目内部设计判断，尚无消费者认知测试证明识别改善。

产品概念把蛇形主体、磁吸连接和绒花蝴蝶组织为“结构承担支撑、配件承担叙事”的关系。品牌应用应同时检验标志在小面积上的清晰度、中文字标的搭配，以及产品展示中仪式感与结构可读性的平衡。当前材料能证明概念与规范研究，不能证明实物佩戴、安全性或量产完成。

## 来源

AJ-nb/AJNB 设计知识库中《夜礼司 品牌设计》《夜礼司 Logo 演化时间线》《夜礼司 Logo 规范与字标》与蛇形口咬道具研究，记录日期为 2026-05-14 至 2026-05-15。展示沿用真实原稿；Songnasty 作为历史阶段保留，不另计一个项目。
`);
append('yelisi','en',`
## Brand objective and product applications

The objective is a restrained, recognizable identity for intimate photography props and body objects. The Chinese name carries meaning, the near-square seal establishes a boundary, and the central negative space carries a bodily association. These roles keep the identity from relying on an S monogram alone.

The May 2026 record preserves four stages: Songnasty exploration, problems with the earlier name and recognition hierarchy, a move toward Chinese seal semantics, and confirmation of the YELISI direction. Curves and the seal structure remain; English-first recognition and more explicit bodily associations become secondary. These are internal design judgments, without a consumer recognition study establishing an improvement.

The product concept relates a snake-shaped support, magnetic connection and velvet-flower butterfly: structure provides support, while the accessory carries the narrative. Applications need to check small-area legibility, the Chinese wordmark and the balance between ritual expression and readable structure in product presentation. The material establishes concept and guideline research, not tested wearability, safety or manufacturing.

## Sources

AJ-nb/AJNB design knowledge base: YELISI brand overview, logo evolution timeline, logo and wordmark guidelines, and snake-shaped prop study, dated 14–15 May 2026. Real source artwork is retained. Songnasty remains a historical phase of this project rather than an additional project.
`);
append('periastra','zh',`
## 品牌目标与产品关系

Periastra 的目标是在摄影装备场景中表达聚焦、收纳与保护。相机包是品牌语境；本轮有依据的个人参与范围仍是品牌图形与应用研究，不能由 Logo 推导为整包结构设计。

2026-04-22 的标志稿和 5 月的分析记录构成连续证据。优化不是增加更多摄影符号，而是建立先读 P、再读镜头和容器的顺序：主干清楚、中央留白足够、外框与内部旋涡有重量差，断口像有意的开合而非未完成笔画。

应用记录提出 16 px 数字图标、8 mm 五金标、20 mm 织唛与 30 mm 橡胶章等检查条件，并关联拉链头、肩带、内胆、包装封签与防尘袋。这些尺寸是拟验证条件，不是已完成生产规格。应用研究的价值在于把同一识别放到不同载体，提前暴露堵塞、失重和黑白反转后的辨识问题。

## 来源

AJ-nb/AJNB 设计知识库中《Periastra 相机包品牌设计》《Periastra Logo 设计分析》《Periastra 应用与优化》及现有标志、结构说明图。Logo 资产文件日期 2026-04-22；应用记录日期 2026-05-11。实体样品、供应商工艺报告与市场使用数据尚未提供。
`);
append('periastra','en',`
## Brand objective and product relationship

Periastra aims to express focus, organization and protection within photography equipment. The camera bag is the brand context. The evidenced contribution remains identity and application research; a logo does not establish authorship of the bag's structure.

The logo artwork dated 22 April 2026 and the May analysis form a continuous record. Refinement establishes a reading order—P first, then lens and container—through a clear stem, sufficient central space, different weights for the frame and spiral, and intentional-looking openings.

The application record proposes checks at 16 px for a digital icon, 8 mm for a metal mark, 20 mm for a woven label and 30 mm for a rubber patch, alongside zipper pulls, straps, dividers, packaging seals and dust bags. These are proposed verification conditions, not approved production specifications. The study tests how one identity might reveal congestion, weak visual weight or reversed-color legibility issues across different carriers.

## Sources

AJ-nb/AJNB design knowledge base: Periastra project overview, logo analysis and application/refinement record, plus the actual logo and explanatory artwork. Logo asset: 22 April 2026; application record: 11 May 2026. Physical samples, supplier process reports and market-use data have not been provided.
`);

append('lensflow','zh',`
## 从输入到可追溯结果

输入来自网页图片、本地图片或划词。尺寸、比例、哈希和色板先由本地工具获取，模型再提供结构化解构与提示词变体。用户编辑简报，并沿风格、主体、构图、色彩、动态五个维度组织参考关系；提交前检查当前输入，而不是把一次分析直接变成不可修改的生成指令。

批次把每个生成位置单独记录。部分失败时，已成功的结果继续保留，失败位置等待用户手动补全；没有把整批自动重跑作为默认恢复行为。结果随后可以下载、收入作品集或由用户主动导出。来源图、分析、提示词、参考关系、生成任务和成品分别保存，让下一次创作仍能追溯其输入。

## 人工判断与版本边界

真实工作区与演示入口分开。当前展示的首次引导使用只读预计算内容，生成按钮禁用，不代表完成实时调用。模型目录来自用户配置服务后的读取；彼源、OpenAI-compatible 与 ComfyUI 的适配代码存在，但全面真实兼容性仍未建立。可用模型应以具体服务与账户返回为准。

本项目在 2026-08-29 形成独立演化线，后续至 2026-09-01 的 v0.3.3；当前截图仍对应 v0.3.0。它是 Chrome 扩展与产品网站，不是自研浏览器。早期砚台与相关工作树保留为演化背景，不按副本重复计为新项目。

## 来源

Lensflow README、2026-08-31 实施状态、工作流与版本资料，以及原始保存的 v0.3.0 界面。2026-09-15 本轮只读核对源码与文档；没有读取凭据或重新跑收费接口，也未覆盖原工作区缺失文件。
`);
append('lensflow','en',`
## From input to a traceable result

Inputs come from webpage images, local images or selected text. Local tools first obtain dimensions, aspect ratio, hashes and palettes; a model then provides structured analysis and prompt variants. Users edit the brief and organize references along five axes: style, subject, composition, color and dynamics. Preflight checks the current input before submission.

Each position in a generation batch has its own record. When a batch partly fails, successful results remain and failed positions wait for manual refill. Automatic resubmission of the entire batch is not the default recovery path. Results can be downloaded, added to a collection or actively exported. Captures, analyses, prompts, references, jobs and assets are separate records, keeping the next creative task connected to its inputs.

## Human judgment and version boundaries

The real workspace and demonstration are separate. The guide shown here uses read-only, precomputed content with generation disabled; it is not evidence of a live model call. Model choices are retrieved after users configure their service. Biyuan, OpenAI-compatible and ComfyUI adapters exist, while universal live compatibility remains unestablished. Available models depend on the service and account response.

An independent project line began on 29 August 2026 and reached v0.3.3 by 1 September; the retained screenshots show v0.3.0. This is a Chrome extension and product website, not a custom browser. Earlier Yantai experiments and related working copies remain development context and are not counted as separate projects.

## Sources

Lensflow README, implementation status dated 31 August 2026, workflow/version records and original v0.3.0 captures. The 15 September review read source and documentation only; it did not access credentials, rerun billable calls or restore missing files in the original workspace.
`);
append('yantai','zh',`
## 一个完整的学习回路

采集先验证图像能否解码和尺寸是否有效，再生成造型手法、形态母型、结构假设与设计推演。设计语言、结构和 CMF 可以按需继续分析，分别缓存。与一段泛泛的“风格描述”相比，这个组织方式让使用者知道自己正在复核哪一类问题。

归档前由用户确认主风格、目标文件夹和本次写入内容。稳定的素材标识用于识别重复图，已有素材只补充缺失的文件夹归属；写入后再读回标签核对。这里说明源码规定的恢复与去重机制，本轮没有对用户的真实 Eagle 图库执行写入测试。

## 演化与收束

luck-power、visual-lens 与 AJNB 砚台模块属于同一演化线。2026 年 8 月的记录显示项目由广泛图像功能逐渐收束到造型学习，保留旧数据读取，同时移除当前模块中的 OCR、图片编辑、三视图和重建入口。案例因此保留前身，却只把当前模块实际保留的能力写入成果。

图谱的风格 ID 与文件夹结构提供归档词汇，不能替代判断。模型给出的材料、连接、风格与制造解释均应作为推断；人工确认控制的是记录和归档，不会把单张图片推断自动变成已证实事实。

## 来源

visual-lens/visual-lens README、安装与升级说明、v0.7.5 模块资料及原始 study 演示夹具。当前模块位于私有仓库；公开前身为 [luck-power](https://github.com/AJ-nb/luck-power)。本轮保留原脏工作区，未修改来源代码或执行实际图库导入。
`);
append('yantai','en',`
## A complete learning loop

Capture first validates image decoding and dimensions, then produces form techniques, underlying form families, structural hypotheses and design exploration. Design language, structure and CMF can be requested separately and cached independently, making the question under review explicit.

Before archiving, users confirm a primary style, target folders and the content to write. A stable capture identifier identifies duplicates; existing assets only receive missing folder memberships. Tags are read back after writing. This describes the source-defined recovery and deduplication mechanism. No writes to the user's real Eagle library were performed in this review.

## Evolution and focus

luck-power, visual-lens and the AJNB Yantai module are one development line. August 2026 records show a narrowing from broad image functions to form study, retaining access to older data while removing OCR, image editing, three-view and reconstruction interfaces from the current module. The predecessor is preserved, while current results describe retained capabilities only.

Style IDs and folder paths provide a vocabulary for archiving, not a replacement for judgment. Model statements about material, connections, style and manufacturing remain inferences. Human confirmation governs recording and archiving; it does not turn a single-image inference into a verified fact.

## Sources

visual-lens/visual-lens README, installation/upgrade documentation, v0.7.5 module records and the original study fixture. The current module is private; [luck-power](https://github.com/AJ-nb/luck-power) is the public predecessor. The original modified workspace was preserved, with no source edits or real library import.
`);

append('formline','zh',`
## 可编辑性与能力边界

构线的价值来自设计师可操作的几何关系、光学校正和明确的导出路径。它没有经过验证的“AI 读取任意位图并自动拟合 Logo”能力，不能把几何求解器写成图像识别模型。当前原型中的诊断是分项复核线索，不能直接证明标志在所有尺寸和工艺下都可用。

## 来源

logo-geometry-studio 的 README、第三方声明及原始桌面/移动截图；本地记录起于 2026-08-14。依赖包括 PlaneGCS 与 Paper.js，贡献与许可沿用原项目声明。本轮为资料核对，未重新执行全套编辑器测试。
`);
append('formline','en',`
## Editability and capability boundary

Formline's value lies in editable geometric relationships, optical corrections and explicit exports. No verified feature reads an arbitrary bitmap with AI and automatically fits a logo. The geometric solver is not presented as an image-recognition model. Diagnostics guide individual checks; they do not prove suitability for every size and manufacturing process.

## Sources

logo-geometry-studio README, third-party notices and original desktop/mobile captures; local records begin on 14 August 2026. PlaneGCS and Paper.js contributions and licenses remain acknowledged. This round reviewed the evidence rather than rerunning the full editor test suite.
`);
append('resume-formatter','zh',`
## 让内容修改可以被核对

导入前先显示识别栏目、警告与未映射片段；扫描型 PDF 明确提示不支持 OCR。岗位版采用创建时母版、当前母版和岗位版的三方差异，只自动同步没有被岗位版单独修改的字段，冲突由用户逐项处理。

AI 改写保留选区与差异确认，数字、日期等变化需要额外复核。彼源是可选服务预设之一，可读取账户可用模型；这不代表已完成全部模型的真实兼容测试。用户可以在不使用 AI 的情况下完成编辑、规则检查与排版。

十二套模板提供真实单栏与双栏结构，版式调整保留字号、行距和页边距的精确控制。投递 PDF 在打印前检查硬错误，工作区备份和普通简历导出分开，避免把岗位研究与内部证据混入投递文件。工具不提供 DOCX 导出，不生成 ATS 通过率或招聘者阅读时间分数。

## 来源

Resume Formatter v2.4.0 README、隐私与第三方声明、保存的虚构履历界面；本地项目记录起于 2026-08-21。MIT Fork 归属沿用上游与本项目声明。本轮未调用带凭据的服务。
`);
append('resume-formatter','en',`
## Making content changes reviewable

Import previews detected sections, warnings and unmapped text. Scanned PDFs explicitly report that OCR is unsupported. Job versions compare the creation baseline, current master and current job version; only fields not independently changed in the job version synchronize automatically. Users resolve conflicts individually.

AI rewriting retains selection and difference review, with additional checks for changes to numbers and dates. Biyuan is one optional preset and can retrieve account-available models. This does not establish live compatibility with every model. Editing, rule checks and layout remain usable without AI.

Twelve templates provide real single- and two-column structures, with precise control over type size, spacing and margins. Application PDF output checks blocking errors before printing. Workspace backups are separate from ordinary resume exports so internal evidence and job research do not become application content. The tool does not export DOCX or produce ATS pass-rate or recruiter-reading-time scores.

## Sources

Resume Formatter v2.4.0 README, privacy and third-party notices, and saved fictional-resume interface captures; local records begin on 21 August 2026. MIT Fork attribution follows the upstream and project notices. No credentialed service was called during this review.
`);

append('visual-archive','zh',`## 来源与阶段核对

资料来自 visual-archive-extension v0.1.0 README 与保存的桌面、移动端分析页。它是 Chrome 扩展原型，不是自研浏览器。原始项目起始日期未确认，界面中的待生成状态与来源空缺继续保留，不用演示图补成已完成模型分析。`);
append('visual-archive','en',`## Source and stage check

Evidence comes from the visual-archive-extension v0.1.0 README and saved desktop/mobile analysis pages. This is a Chrome extension prototype, not a custom browser. The original start date is unconfirmed. Pending-analysis states and missing source information remain visible instead of being replaced with invented completed analysis.`);
append('aesthetic-atlas','zh',`## 来源与导入边界

资料来自 eagle-aesthetic-atlas 的 2026-08-19 项目记录、卡片文件与清单汇总。144 个风格、2500 个书签和 288 张卡片为已有资料包的文件/记录计数；Eagle 环节目前有 dry-run 清单，不代表已实际写入图库。风格分类与迁移建议应与机构原作事实分开阅读。`);
append('aesthetic-atlas','en',`## Sources and import boundary

Evidence comes from eagle-aesthetic-atlas records dated 19 August 2026, card files and manifest summaries. The 144 styles, 2,500 bookmarks and 288 cards describe files and records in the existing package. The Eagle stage has a dry-run manifest rather than proof of a completed library import. Classification and transfer advice should be read separately from institutional facts about original works.`);
for (const lang of ['zh','en']) {
  const f=path.join(works,`visual-archive.${lang}.md`);
  fs.writeFileSync(f,fs.readFileSync(f,'utf8').replaceAll('浏览器扩展','Chrome 扩展').replaceAll('browser extension','Chrome extension').replaceAll('Browser extension','Chrome extension'));
  const l=path.join(works,`lensflow.${lang}.md`);
  fs.writeFileSync(l,fs.readFileSync(l,'utf8').replaceAll('浏览器扩展','Chrome 扩展').replaceAll('browser extension','Chrome extension').replaceAll('Browser extension','Chrome extension'));
}

append('image-2-5-xhs','zh',`
## 输入 → 指令 → 输出 → 失败判断

商品任务以自制的虚构青序包装图为唯一外观参考，明确奶白罐身、深绿盖、蓝色竖条、唯一橙色圆点与指定文字。连续编辑沿同一商品图依次修改背景、底部标题和圆点颜色，并要求其余内容保持不变。原图、完整提示词和每轮输出均保存，不修复原始错误后再评分。

失败判断同时检查“改了什么”和“本不该变的什么被改了”。例如，P2 的品牌字大于活动标题，违反标题优先级；S3 的上部添加枝叶状光影，不满足干净留白；第二、三轮编辑虽然改对标题或圆点，罐盖与标签纹理仍发生累计漂移。因此，9 次指定编辑完成不能被解释为 9 张均可直接使用。

2026-09-09 的逐图记录将 18 张正式输出分为 10 张直接可用、8 张需修正、0 张主要任务未完成。此分级仅针对该虚构简报，来自单人目视评估；它不是像素一致、工程几何准确或普遍成功率的证明。界面名称记录为 Images 2.5，API 子型号仍为未知。

## 来源

image-2-5-xhs 中的 protocol.json（任务与完整提示词）、evaluation.json（逐图评价）与原始图卡。测试未设置竞品、旧版或人工基线，未发布到小红书。
`);
append('image-2-5-xhs','en',`
## Input → instruction → output → failure judgment

The product task used a self-made fictional Qingxu packaging reference, specifying the cream body, dark green lid, blue vertical label, single orange dot and exact text. Continuous edits changed the background, bottom headline and dot color in sequence while requiring other content to remain unchanged. Original images, complete prompts and every output were preserved without repairing errors before grading.

Review checks both the requested change and unintended changes. P2 made the brand name larger than the event title, violating hierarchy. S3 added foliage-like shadows to an area required to remain clear. The second and third edit rounds changed the requested headline or dot, but accumulated changes to lid and label textures. Nine completed edit instructions therefore do not mean nine directly usable images.

The assessment dated 9 September 2026 classified 18 formal outputs as 10 directly usable, 8 requiring revision and 0 failing the primary task. These grades apply to this fictional brief and a single visual reviewer. They do not establish pixel identity, engineering geometry or a general success rate. The interface name was recorded as Images 2.5; the API subtype remains unknown.

## Sources

image-2-5-xhs protocol.json (tasks and complete prompts), evaluation.json (per-image judgments) and original research cards. No competitor, previous-version or human baseline was included, and the material was not published to Xiaohongshu.
`);

console.log('Updated Biyuan and 9 existing bilingual brand/digital/experiment cases.');
