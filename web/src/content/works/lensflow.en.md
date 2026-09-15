---
title: "Lensflow"
category: "digital"
summary: "A local AI creation workspace connecting image capture, structured analysis, prompt organisation and generation tasks."
role: "Collaborative work"
credits: "Includes AI-assisted implementation and open-source components; dependency licenses retained"
status: "Workspace, Chrome extension and product site"
cover: "/works/digital/lensflow/studio-analysis.webp"
tags: ["AI workflow", "Chrome extension", "Local-first", "Interaction design"]
---

## Background

After capture, analysis and generation, a reference image can easily leave only a final output behind. Lensflow keeps sources, local measurements, analysis, editable briefs, reference relationships and results together so the next creative task can understand and reuse earlier inputs.

## My role

Product and interaction work is collaborative, with AI-assisted implementation and open-source components. This case focuses on workspace organization, first use and task continuity; dependency licenses are retained. The demonstration lamp explains the interface and is not counted as a new industrial design outcome.

## Key question

A model analysis should not become an uneditable generation command. One failed item in a batch should not erase completed results. The workspace needs to preserve the user's opportunity to change inputs and make the location of a partial failure clear.

## Design process

### Measure first, then build an editable interpretation

Web images, local images or selected text enter the workspace. Local tools obtain dimensions, aspect ratio, hashes and palettes before a model adds structured analysis and prompt variants. Users edit the brief and organize references along style, subject, composition, color and dynamics, reviewing the current inputs before submission.

### Recover a batch at the individual result position

Each generation position is persisted separately. Successful results survive a partial failure; failed positions await manual refill rather than an automatic whole-batch rerun. Captures, analyses, prompts, references, jobs and assets remain separate records, preserving input traceability after download or collection.

### Let understanding precede service configuration

The first-use guide contains read-only, precomputed content with generation disabled. Demo and live workspaces are separate, so the sequence can be understood before a provider is configured. This edition's interactive explanation also uses fixed examples to demonstrate editing and recovery, not live model calls.

![Lensflow onboarding and demo workspace](/works/digital/lensflow/studio-guide.webp)

*A v0.3.0 demo using precomputed content, not the result of a live model call.*

## Final work

The Chrome extension brings capture into browsing; Studio connects collections, current tasks and service settings; the public site provides an entry point. Images, palettes and written analysis remain associated, letting users return from a result to its inputs without reconstructing a one-off conversation.

![Lensflow image analysis and structured results](/works/digital/lensflow/studio-analysis.webp)

*A saved v0.3.0 demo. The lamp is demonstration content, not a separate industrial design outcome of this case.*

## Outcome and stage

The independent project line began on 29 August 2026 and reached v0.3.3 on 1 September. The retained captures show the v0.3.0 demo and are not relabeled as later screens. Biyuan, OpenAI-compatible and ComfyUI adapters exist, but universal live compatibility is unestablished; model availability depends on the configured account.

This is a Chrome extension and product website. Earlier Yantai work and related working copies remain development context rather than additional projects. Full mobile editing, accounts and cloud synchronization are outside this case's delivery scope.

[Explore Lensflow](https://aj-nb.github.io/lensflow/)

### Sources

Lensflow README, implementation status dated 31 August 2026, workflow/version records and original v0.3.0 captures. The interface, source and version records jointly establish the project stage.
