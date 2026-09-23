---
title: "AI 视频生成系统｜从 Prompt Case 到可复用 Workflow"
category: "digital"
summary: "以一支 22 秒竖屏短片为记录，拆解分镜、白模、角色一致性与镜头约束如何组成可复核的 AI 视频工作流。"
role: "独立研究与工作流设计"
credits: "本人提供成片与过程说明；公开案例库、原帖与文章仅作参考研究并在文末署名"
status: "独立应用研究"
cover: "/works/ai-video-systems/ai-video-systems-cover.webp"
tags: ["AI 视频", "分镜系统", "Blender Blocking", "Prompt Engineering", "人工评审"]
---

## 概览

这不是一个商业委托，也不是对某个开源提示词库的搬运。它记录一次独立的 AI 视频工作流研究：怎样把镜头参考、一个新剧情和少量角色输入，变成可检查的镜头、时间、动作与画面约束。

成片是作者提供的 1080 × 1440、22.08 秒视频。页面讨论工作流设计与人工判断，不把画面视为模型能力、商业投放、外部传播或任何第三方素材权利的证明。

## 本人职责与输入边界

本人负责把剧情改写为分镜脚本，定义镜头运动和画面不变量，安排 Blender 白模预演，并组织供 Seedance 2.5 使用的角色图、场景图和提示词。过程参考了一段电影场景的运镜语言；该参考片不在本页发布，也不被归为本项目素材。

作者记录为：两张主角角色图用于扩展人物、提取风格线索与撰写视频提示词；22 秒成片包含 11 个分镜单元和 20 余个角色。上述数量和“单次生成”描述属于作者过程记录，未作第三方独立核验。

## 控制系统

一次长提示词难以稳定同时处理叙事、人物、时间、物理和镜头。本研究将其拆成六层：意图、视觉锁定、时间结构、物理逻辑、镜头系统和评估循环。每一层都要能在输出中被观察和判断。

![AI 视频工作流的六层控制模型](/works/ai-video-systems/control-layers.svg)

提示词因此不只是风格描述，而是一份可检查的设计规格：目标、参考、不得变化的元素、镜头路径、时间段、动作因果、结束状态与评估目标分开书写。

![AI 视频提示词的结构化架构](/works/ai-video-systems/prompt-architecture.svg)

## 分镜、白模与渲染

工作流从案例观察开始，而不是从复制某一条 Prompt 开始：观察可见结果，拆解变量，比较方向，诊断失败，再把可迁移部分写成模板。设计师始终保留镜头、角色关系、节奏与选择的决定权。

![从案例到系统再到输出的工作流图](/works/ai-video-systems/workflow-map.svg)

白模视频用于提前检查机位、人物密度、运动方向和镜头交接；它不是最终美术。最终阶段将角色图、白模视频、经人工整理的场景与提示词交给 Seedance 2.5 渲染，再以分镜逐项复看。

![原视频中用于检查镜头和人物关系的 Blender 白模画面](/works/ai-video-systems/ai-video-systems-blocking.webp)

<video src="/works/ai-video-systems/ai-video-systems-film.mp4" poster="/works/ai-video-systems/ai-video-systems-cover.webp" controls preload="metadata" playsinline><track kind="captions" src="/works/ai-video-systems/ai-video-systems.zh.vtt" srclang="zh" label="中文视觉说明" default></track><track kind="captions" src="/works/ai-video-systems/ai-video-systems.en.vtt" srclang="en" label="English visual description"></track></video>

*22.08 秒作者提供成片。画面内的“Seedance 2.5 一次生成”与“GPT 6 + Blender 自动建模”为原视频中的作者标注，不构成第三方验证。*

**画面说明：** 上方为最终渲染，下方为 Blender 白模预演。行走镜头、人物特写与群像构图展示角色位置、动作和镜头取景在两种画面中的对应关系。黄色文字记录作者所述的工具与生成方式。字幕轨道提供视觉说明，不作为对白转录。

## 评估与产品设计迁移

评估不是只问“画面是否好看”。每个分镜要检查角色是否仍可识别、动作是否有因果、镜头运动是否由叙事驱动、空间尺度是否连续，以及结束状态是否回应了开始的目标。发现问题后，只改写对应层，而不是用更多形容词覆盖全部问题。

这套方法可迁移到产品和空间表达：以产品形态或使用动作作为视觉不变量，以分镜定义用户任务，再用白模检查相机、接触和尺度关系。它是生成前的设计判断框架，不声称已经验证为通用生产流程。

### 从案例到方法库

将公开参考文档整理为意图、视觉一致性、时间结构、物理逻辑、镜头与评估六个控制层，再以八项方法拆解连接产品、CMF、空间和叙事。文档分析与个人试验分别记录；参考库的复测不计为个人成果。

[阅读 AI 视频研究方法库](/systems/ai-video-methods)

## 反思

这次研究的可复用部分是对输入、镜头与评估的控制。下一步需要在相同分镜标准下比较重复生成结果，检查方法的稳定性。

## 署名与背景

证据等级为 **Level B / Project Archive**：公开页面包含作者提供的成片、其派生画面、从零绘制的系统图和作者过程说明；不包含原始角色图、参考影片、可编辑 Blender 文件、完整提示词或第三方案例媒体。

本研究参考 [Awesome Seedance](https://github.com/LearnPrompt/awesome-seedance)、[原始帖文](https://x.com/aiwarts/status/2102240456092626951) 和 [卡尔的 AI 沃茨文章](https://www.woshipm.com/ai/6468462.html)。Awesome Seedance 是 LearnPrompt 的公开项目，并非本人原创开源项目；其代码采用 [MIT License](https://github.com/LearnPrompt/awesome-seedance/blob/main/LICENSE)，整理内容采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)；原帖、提示词、图片和视频仍归各自创作者或权利人所有。仓库的案例数量会变化，因而本页不把它写成固定 KPI。

整理内容保留 awesome-seedance / goodcase.ai 来源；提示词与媒体权利不由仓库统一授予。
