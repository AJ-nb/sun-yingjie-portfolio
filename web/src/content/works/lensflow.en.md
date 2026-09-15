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

Lensflow focuses on the path from a reference image to reusable creative assets. Capture, analysis, prompts, reference relationships and generated results share one workspace so that the creative process can be organised and reused.

## My role

Product and interaction work is collaborative, with AI-assisted implementation and open-source components. This case focuses on workspace organisation, the first-use path and continuity across generation tasks.

## Key question

How does an analysis inform the next creation? How can completed results survive a partly failed generation batch? How does a new user understand the sequence? These questions shape the workspace structure.

## Design process

The flow starts with capture and local measurements, moves into structured analysis and an editable brief, then organises generation inputs through prompts, composition, colour, form and reference relationships. Persistent tasks keep completed results and let users manually fill failed slots. Onboarding and a local demo explain the sequence before a service is configured.

![Lensflow onboarding and demo workspace](/works/digital/lensflow/studio-guide.webp)

*A v0.3.0 demo using precomputed content, not the result of a live model call.*

## Final work

The product includes a Chrome extension, the Studio workspace and a public product site. Collections, the current task and service settings sit alongside each other. Analysis keeps the image, palette and written information connected.

![Lensflow image analysis and structured results](/works/digital/lensflow/studio-analysis.webp)

*A saved v0.3.0 demo. The lamp is demonstration content, not a separate industrial design outcome of this case.*

## Outcome and stage

The work includes an accessible product site and an extension workflow. The screenshots show v0.3.0; development later reached v0.3.3. Compatibility with external models and integrations still depends on the particular service. Full mobile editing, accounts and cloud sync are outside the current delivery scope.

[Explore Lensflow](https://aj-nb.github.io/lensflow/)

<!-- refinement-v2 -->

### From input to a traceable result

Inputs come from webpage images, local images or selected text. Local tools first obtain dimensions, aspect ratio, hashes and palettes; a model then provides structured analysis and prompt variants. Users edit the brief and organize references along five axes: style, subject, composition, color and dynamics. Preflight checks the current input before submission.

Each position in a generation batch has its own record. When a batch partly fails, successful results remain and failed positions wait for manual refill. Automatic resubmission of the entire batch is not the default recovery path. Results can be downloaded, added to a collection or actively exported. Captures, analyses, prompts, references, jobs and assets are separate records, keeping the next creative task connected to its inputs.

### Human judgment and version boundaries

The real workspace and demonstration are separate. The guide shown here uses read-only, precomputed content with generation disabled; it is not evidence of a live model call. Model choices are retrieved after users configure their service. Biyuan, OpenAI-compatible and ComfyUI adapters exist, while universal live compatibility remains unestablished. Available models depend on the service and account response.

An independent project line began on 29 August 2026 and reached v0.3.3 by 1 September; the retained screenshots show v0.3.0. This is a Chrome extension and product website, not a custom browser. Earlier Yantai experiments and related working copies remain development context and are not counted as separate projects.

### Sources

Lensflow README, implementation status dated 31 August 2026, workflow/version records and original v0.3.0 captures. The interface, source and version records jointly establish the project stage.
