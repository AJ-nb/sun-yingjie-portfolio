# 来源清单

核查日期：2026-09-09（Asia/Shanghai，日期精度）。

23条来源记录来自16个发布者或作者群，不是23份独立测评；部分仅用于辨伪、排除或寻找测试线索。未达到20—30个独立来源的目标，Reddit、V2EX等缺口见 research/coverage-gaps.md。未找到后端明确、参数统一且公开完整样本的第三方受控对测。

公开编号Rxx对应research/sources.json的Sxx，以免与草图测试S1—S3混淆。所有第三方图片均未转载。本次亲测原图、输入和评语独立保存在tests目录。

## R01 Introducing ChatGPT Images 2.5

发布者：OpenAI；平台：official；发布日期：2026-09-08。

原文：[Introducing ChatGPT Images 2.5](https://openai.com/index/introducing-chatgpt-images-2-5/)

证据类别：`official_claim`；置信度：High for announcement; unverified for generalized performance。

支持范围：Release identity and date；Separate model advances from ChatGPT interaction features；Faster generation and multi-turn consistency are vendor claims

限制：Official showcases are selected examples, not independent or representative tests. No universal 50% speed guarantee. Public rollout is not proof of current account capability.

## R02 GPT-Image-2.5 Flare model

发布者：OpenAI；平台：official_docs；发布日期：未注明。

原文：[GPT-Image-2.5 Flare model](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare)

证据类别：`FACT`；置信度：High。

支持范围：Exact model/snapshot IDs；Quality settings；Token-rate versus per-image-cost distinction

限制：Model page date not stated. Responses endpoint marked unsupported refers to direct top-level model selection; guide supports this image model inside the image_generation tool.

## R03 GPT-Image-2.5 Sunburst model

发布者：OpenAI；平台：official_docs；发布日期：未注明。

原文：[GPT-Image-2.5 Sunburst model](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst)

证据类别：`FACT`；置信度：High。

支持范围：Exact model identity；Vendor intended positioning

限制：Positioning is not a measured superiority claim. Date not stated. Same endpoint distinction as S02.

## R04 Image generation guide

发布者：OpenAI；平台：official_docs；发布日期：未注明。

原文：[Image generation guide](https://developers.openai.com/api/docs/guides/image-generation)

证据类别：`FACT`；置信度：High。

支持范围：No pixel-exact mask guarantee；New 2.5 output-token calculator exists at access time；Direct Image API versus orchestrated Responses workflow；Remaining text/consistency/composition limitations

限制：Dynamic page. New 2.5 calculator exists now even though early community users reported missing pricing tools. Do not present their old report as current fact. Generic limitations do not quantify error rates.

## R05 OpenAI API changelog

发布者：OpenAI；平台：official_docs；发布日期：2026-08-20; 2026-09-08 entries。

原文：[OpenAI API changelog](https://developers.openai.com/api/docs/changelog)

证据类别：`FACT`；置信度：High。

支持范围：Transparent output was already available for Image 2 on August 20；September 8 launch of the two 2.5 API models

限制：API support cannot establish that every UI or account exposed the feature on August 20.

## R06 Add GPT Image 2.5 models and extend image generation options

发布者：OpenAI OpenAPI Publisher；平台：GitHub；发布日期：2026-09-08T18:37:52Z。

原文：[Add GPT Image 2.5 models and extend image generation options](https://github.com/openai/openai-openapi/commit/21cb7e98d8166a691a0eb8679a90419eb816cf35)

证据类别：`FACT`；置信度：High。

支持范围：Schema-level model IDs and snapshots；Supported image-generation options

限制：Schema availability is not a successful call. Bare gpt-image-2.5 was not an added enum in this commit.

## R07 ChatGPT Images 2.5 System Card

发布者：OpenAI；平台：official；发布日期：2026-09-08。

原文：[ChatGPT Images 2.5 System Card](https://deploymentsafety.openai.com/chatgpt-images-2-5)

证据类别：`official_claim`；置信度：High for disclosed methods; not independent validation。

支持范围：Safety-evaluation scope and limitations；C2PA plus SynthID provenance；System card is not an image-quality benchmark

限制：No independent replication. Do not repurpose safety rates as aesthetics, factual accuracy, or task-success rates.

## R08 Introducing GPT Images 2.5 in the API and ChatGPT

发布者：VeitB；平台：OpenAI Community；发布日期：2026-09-08T19:12:36.115Z。

原文：[Introducing GPT Images 2.5 in the API and ChatGPT](https://community.openai.com/t/introducing-gpt-images-2-5-in-the-api-and-chatgpt/1395897/1)

证据类别：`release_relay`；置信度：High for existence of post; derivative release evidence。

支持范围：Release discussion and feature discoverability

限制：Moderator relay of announcement; not independent measurement. Do not count as independent confirmation of performance.

## R09 Early retry behavior and API rollout observations

发布者：_j；平台：OpenAI Community；发布日期：2026-09-08T20:15:38.936Z。

原文：[Early retry behavior and API rollout observations](https://community.openai.com/t/introducing-gpt-images-2-5-in-the-api-and-chatgpt/1395897/5)

证据类别：`user_claim`；置信度：Medium for reported experience; Low for causal attribution。

支持范围：Potential orchestration/UI retry confound；Need preserve every output and record mode

限制：Author explicitly says behavior occurred before this release. Not established as 2.5 regression. Later same-author post consolidated, not counted separately. Early calculator absence is now stale relative to S04.

## R10 Question about token consumption and price per image

发布者：merefield；平台：OpenAI Community；发布日期：2026-09-08T20:01:46.478Z。

原文：[Question about token consumption and price per image](https://community.openai.com/t/introducing-gpt-images-2-5-in-the-api-and-chatgpt/1395897/3)

证据类别：`question`；置信度：High for question; not test evidence。

支持范围：Early community uncertainty about token usage

限制：A question, not a price measurement. Answer with current S04 rather than freeze first-hour uncertainty.

## R11 Developer speed observation

发布者：jjcm；平台：Hacker News；发布日期：2026-09-08T19:42:48Z。

原文：[Developer speed observation](https://news.ycombinator.com/item?id=49615865)

证据类别：`user_claim`；置信度：Medium for individual observation; Low for general speed estimate。

支持范围：Speed may matter to iterative UI-design workflows

限制：New-version sample count, precise model, resolution, quality and workload uncontrolled or unstated. Linked video not reviewed. Do not present 104/35 as universal speedup.

## R12 Criticism of details in official composite party photo

发布者：pelzatessa；平台：Hacker News；发布日期：2026-09-08T18:55:08Z。

原文：[Criticism of details in official composite party photo](https://news.ycombinator.com/item?id=49614999)

证据类别：`user_claim`；置信度：Medium for existence of criticism; image finding not independently verified。

支持范围：Inspect teeth, fingers and identity at crop scale

限制：Original showcase image not visually rechecked in this subtask. Do not state the defect as our own observation.

## R13 Food-photo edit with explicitly uncertain model version

发布者：shagie；平台：Hacker News；发布日期：2026-09-08T19:11:49Z。

原文：[Food-photo edit with explicitly uncertain model version](https://news.ycombinator.com/item?id=49615285)

证据类别：`user_claim`；置信度：High for explicit uncertainty; unusable as confirmed 2.5 test。

支持范围：Model provenance must precede comparison

限制：Exclude from confirmed 2.5 test corpus. Shared image/conversation not opened in this subtask.

## R14 Comment about edit detail loss in earlier OpenAI models

发布者：kfarr；平台：Hacker News；发布日期：2026-09-08T19:17:44Z。

原文：[Comment about edit detail loss in earlier OpenAI models](https://news.ycombinator.com/item?id=49615399)

证据类别：`user_claim`；置信度：Low for 2.5-specific performance。

支持范围：Motivation for fine-detail retention test

限制：Not established as hands-on 2.5 comparison; no prompts, version IDs or samples in the comment. Do not quote as proof of competitor superiority.

## R15 GPT Image 2.5悄悄上线，依赖提示语提升AI生图可控性的时代过去了

发布者：卡尔的AI沃茨 / aiwarts；平台：X；发布日期：2026-09-09T08:45:00+08:00。

原文：[GPT Image 2.5悄悄上线，依赖提示语提升AI生图可控性的时代过去了](https://x.com/aiwarts/status/2097486484588872156)

证据类别：`mixed_user_claim_and_judgment`；置信度：Medium for UI experience; Low for version inference。

支持范围：User-facing interaction changes can matter independently of model aesthetics；Dissenting stylistic preference；Specific erroneous transparent-background identification heuristic

限制：Transparency identification claim contradicted by S05. Author tests not independently reproduced; raw settings and backend routing not verified. Dates are browser display in local Asia/Shanghai. UI availability is account/time-specific. Do not copy author's promotional headline.

## R16 Generation praised but unexpected five-person group

发布者：老爸的AI联萌 / ChrisWangwy；平台：X；发布日期：2026-09-09。

原文：[Generation praised but unexpected five-person group](https://x.com/ChrisWangwy/status/2097523008466563086)

证据类别：`user_claim`；置信度：Low to Medium。

支持范围：Visual appeal and instruction fidelity can diverge

限制：No prompt or API provenance; attached image not inspected in this subtask. Full page auto-translation altered wording, so exact excerpt retained from original-text timeline, not translated page. Use as test lead only.

## R17 新版GPT Image 2.5已经能伪造GPT-6发布会了

发布者：量子位；平台：Zhihu；发布日期：2026-09-04T05:56:00+08:00。

原文：[新版GPT Image 2.5已经能伪造GPT-6发布会了](https://zhuanlan.zhihu.com/p/2079084191296250781)

证据类别：`prerelease_report`；置信度：High for article text; Low for model attribution。

支持范围：Pre-release rumor timeline and anonymous-model attribution uncertainty

限制：Not a formal release or verified 2.5 measurement. Report relays X examples. Do not label speculative anonymous model as confirmed shipping 2.5. Do not reuse impersonation examples for our test.

## R18 gpt image 2.5 发布

发布者：ycoroy；平台：LINUX DO；发布日期：2026-09-09。

原文：[gpt image 2.5 发布](https://linux.do/t/topic/2876753)

证据类别：`user_claim`；置信度：Medium for described test; Low for generalized quality。

支持范围：Dissent on general aesthetics but improvement in multi-turn editing；Actual prompt and image links visible

限制：Model backend, before/after settings and repeated sample count unverified. Images were linked but not visually evaluated in this subtask. Original post display gives date/relative time, not exact publication time.

## R19 测试GPT Images 2.5绘图功能！灵魂画师上线

发布者：tangxianzhi；平台：LINUX DO；发布日期：2026-09-09。

原文：[测试GPT Images 2.5绘图功能！灵魂画师上线](https://linux.do/t/topic/2877243)

证据类别：`user_claim`；置信度：Low for model test; High for source availability。

支持范围：Third-party wrapper/account availability uncertainty

限制：Minimal text plus screenshot, no controlled test. Do not infer support for unofficial wrapper from post title. Included for coverage and exclusion reasoning, not performance evidence.

## R20 Nano Banana image generation

发布者：Google；平台：competitor_official_docs；发布日期：未注明。

原文：[Nano Banana image generation](https://ai.google.dev/gemini-api/docs/image-generation)

证据类别：`FACT_and_vendor_positioning`；置信度：High for current model catalog; no independent comparison。

支持范围：Use current explicit competitor IDs；Lite speed/cost positioning is different from multi-turn editing；Do not conflate legacy Gemini 2.5 Flash Image with OpenAI Image 2.5

限制：Last quote applies to Nano Banana 2 Lite only. No head-to-head test run. Page publication date unknown.

## R21 FLUX.2 Overview

发布者：Black Forest Labs；平台：competitor_official_docs；发布日期：未注明。

原文：[FLUX.2 Overview](https://docs.bfl.ai/flux_2/flux2_overview)

证据类别：`FACT_and_vendor_positioning`；置信度：High for documented offering; no independent comparison。

支持范围：Direct image editing/generation competitors；Pinned versus preview endpoints for reproducibility

限制：Vendor claims about exact color matching and highest consistency not independently verified. Do not compare different quality/cost tiers without labels.

## R22 FLUX 3 Overview

发布者：Black Forest Labs；平台：competitor_official_docs；发布日期：未注明。

原文：[FLUX 3 Overview](https://docs.bfl.ai/flux_3/flux3_overview)

证据类别：`FACT`；置信度：High。

支持范围：Avoid confusing newest numbered model with current standalone image-generation competitor

限制：This page documents video modes, not an equivalent image-generation benchmark. Consolidate under BFL, not a second independent publisher.

## R23 OpenAI releases ChatGPT Images 2.5 with sharper details and more precise editing

发布者：Zac Hall / 9to5Mac；平台：media；发布日期：2026-09-08T11:50:00-07:00。

原文：[OpenAI releases ChatGPT Images 2.5 with sharper details and more precise editing](https://9to5mac.com/2026/09/08/openai-releases-chatgpt-images-2-5-with-sharper-details-and-more-precise-editing/)

证据类别：`release_relay`；置信度：High for article; derivative performance evidence。

支持范围：Contemporaneous release coverage

限制：Restates vendor claims, not independent hands-on testing. Article misspells Sunburst as Sunburt once; IDs must come from S02/S03.
