---
title: "Resume Formatter 简历编辑器"
category: "digital"
summary: "基于开源项目二次开发，将简历母版、岗位版本、事实证据与排版放进同一工作区。"
role: "共同创作 · 开源项目二次开发"
credits: "Fork 自 gracexygu/resume-formatter；上游与本 Fork 均采用 MIT License；共同创作"
status: "v2.4.0，公开在线工具"
cover: "/works/digital/resume-formatter/workspace.webp"
tags: ["开源二次开发", "简历工具", "版本管理", "本地优先"]
---

## 背景

项目在开源简历排版工具上继续发展，关注简历内容随岗位变化时的管理问题。内容以结构化方式保留，编辑、模板选择与 PDF 打印在浏览器内完成，并支持独立 HTML 使用。

## 本人职责

本案例属于开源项目的协作式二次设计与开发。上游为 [gracexygu/resume-formatter](https://github.com/gracexygu/resume-formatter)，上游与本 Fork 均采用 MIT License。这里展示的是扩展后的工作区、版本管理和可审阅修改流程，不主张整个项目从零原创。

## 关键问题

同一份履历需要适应不同岗位，但母版更新不能直接覆盖岗位版已有的调整。AI 改写也必须让使用者看清修改，避免把表达润色变成未经确认的新事实。内容管理与排版需要互相连接，同时保持可撤销。

## 设计过程

工作区将母版、岗位信息和事实证据关联起来。岗位版本依据创建时的母版处理后续差异，对已自行修改的字段保留选择权。AI 改写先展示差异，再允许应用或丢弃；排版控制则与真实简历预览并列。

![Resume Formatter 的 AI 改写差异确认](/works/digital/resume-formatter/rewrite-diff.webp)

*先审阅修改，再决定是否应用。画面使用虚构示例履历。*

## 最终作品

桌面三栏工作区连接内容导航、简历预览与岗位或排版检查器。模板选择和精确调整保留在同一编辑流程，便于在内容与阅读顺序之间反复核对。

![简历母版、岗位版本与证据工作区](/works/digital/resume-formatter/workspace.webp)

*v2.4.0 工作区；人物、岗位与履历是虚构测试内容。*

![Resume Formatter 模板与排版调整界面](/works/digital/resume-formatter/layout-controls.webp)

*模板预览与字号、行距、页边距等排版控制。*

## 成果与阶段

v2.4.0 已形成母版与岗位版本、事实证据、模板排版、修改审阅和导出工作流。规则检查用于提示内容与阅读风险，不代表真实 ATS 通过率或招聘结果；AI 功能为可选环节。

[使用 Resume Formatter](https://aj-nb.github.io/resume-formatter/)

<!-- refinement-v2 -->

### 让内容修改可以被核对

导入前先显示识别栏目、警告与未映射片段；扫描型 PDF 明确提示不支持 OCR。岗位版采用创建时母版、当前母版和岗位版的三方差异，只自动同步没有被岗位版单独修改的字段，冲突由用户逐项处理。

AI 改写保留选区与差异确认，数字、日期等变化需要额外复核。彼源是可选服务预设之一，可读取账户可用模型；这不代表已完成全部模型的真实兼容测试。用户可以在不使用 AI 的情况下完成编辑、规则检查与排版。

十二套模板提供真实单栏与双栏结构，版式调整保留字号、行距和页边距的精确控制。投递 PDF 在打印前检查硬错误，工作区备份和普通简历导出分开，避免把岗位研究与内部证据混入投递文件。工具不提供 DOCX 导出，不生成 ATS 通过率或招聘者阅读时间分数。

### 来源

Resume Formatter v2.4.0 README、隐私与第三方声明、保存的虚构履历界面；本地项目记录起于 2026-08-21。MIT Fork 归属沿用上游与本项目声明。
