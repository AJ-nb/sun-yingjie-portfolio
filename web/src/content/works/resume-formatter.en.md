---
title: "Resume Formatter"
category: "digital"
summary: "An open-source fork bringing a master resume, job-specific versions, factual evidence and formatting into one workspace."
role: "Collaborative work on an open-source fork"
credits: "Collaborative development of a fork of gracexygu/resume-formatter; upstream and this fork use the MIT License"
status: "v2.4.0, public web tool"
cover: "/works/digital/resume-formatter/workspace.webp"
tags: ["Open-source fork", "Resume tool", "Version management", "Local-first"]
---

## Background

This project extends an open-source resume formatter to address how resume content changes for different roles. Content remains structured, with editing, template selection and PDF printing handled in the browser. A standalone HTML version is also supported.

## My role

This case presents collaborative design and development of an open-source fork. The upstream project is [gracexygu/resume-formatter](https://github.com/gracexygu/resume-formatter). Both upstream and this fork use the MIT License. The work shown covers the extended workspace, version management and reviewable changes; the whole project is not claimed as an original creation from scratch.

## Key question

One professional history may serve several applications, but a master update should not overwrite changes already made for a particular job. AI rewriting must expose its edits so that polishing language does not introduce unconfirmed facts. Content and formatting need to remain connected and reversible.

## Design process

The workspace connects the master resume, job information and factual evidence. A job-specific version uses its original master baseline when handling later differences, retaining a choice for fields edited independently. AI rewrites show a diff before they can be applied or discarded. Formatting controls sit beside the actual resume preview.

![Reviewing an AI rewrite diff in Resume Formatter](/works/digital/resume-formatter/rewrite-diff.webp)

*Review the change before applying it. The resume content is fictional.*

## Final work

The desktop's three columns connect content navigation, the resume preview, and a job or layout inspector. Template selection and precise adjustments stay within the editing flow, supporting repeated checks of content and reading order.

![Master resume, job version and evidence workspace](/works/digital/resume-formatter/workspace.webp)

*The v2.4.0 workspace. The person, job and professional history are fictional test content.*

![Resume Formatter template and layout controls](/works/digital/resume-formatter/layout-controls.webp)

*Template previews and controls for type size, line spacing, margins and other layout settings.*

## Outcome and stage

Version 2.4.0 brings together master and job-specific versions, factual evidence, template layout, change review and export. Rule-based checks flag content and reading risks; they do not represent actual ATS acceptance rates or hiring outcomes. AI assistance remains optional.

[Use Resume Formatter](https://aj-nb.github.io/resume-formatter/)
