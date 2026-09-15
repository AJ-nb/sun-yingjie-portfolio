---
title: "Image Generation & Editing Study"
category: "experiments"
summary: "Fictional packaging, poster and sketch tasks examining completion, product consistency and drift across successive image edits."
role: "Collaborative work"
credits: "Includes AI-generated images and a single evaluator's visual assessment; the test brand is fictional; collaborative test-design and research-editorial work"
status: "Research package completed; not published on Xiaohongshu"
cover: "/works/digital/image-2-5-xhs/evaluation-cover.webp"
tags: ["AI image experiment", "Successive editing", "Product consistency", "Research editorial"]
---

## Background

The experiment uses one fictional packaging brand across poster, product-image, sketch and successive-editing tasks. It examines not only whether an image is completed, but also whether packaging structure is retained and whether details outside the requested changes drift over time.

## My role

Test design and the research editorial are collaborative work. The work includes organising tasks and prompts, preserving original outputs, visual assessment by one evaluator and editing the cards. Images include AI-generated content; the brand and products are fictional test subjects.

## Key question

Completing a requested edit and producing a directly usable image are different judgments. A result can satisfy one change while altering materials, details or product consistency. The experiment records these outcomes separately and makes the basis of assessment visible.

## Design process

Prompts, inputs, original images and edit order were retained, followed by an assessment of each task. The cards show references beside outputs, successive edits and local details. Packaging comparisons use near-silhouette crops and equal display height to aid reading, but the viewpoints differ, so they do not support precise geometric measurement.

![Reference and generated versions of the fictional packaging](/works/digital/image-2-5-xhs/product-consistency.webp)

*An AI-generation test using fictional packaging. The comparison is neither physical product photography nor a same-view measurement.*

## Final work

The 18 formal outputs and individual assessments were organised into 9 research cards covering generation, successive editing and the limits of the findings. The cards retain “Image 2.5” from the original test page; the corresponding API submodel is unknown.

![Cover of the image generation and successive-editing study](/works/digital/image-2-5-xhs/evaluation-cover.webp)

*Research editorial cover. The brand, packaging and generated results are experimental content.*

![Usability judgments and limits of the experiment](/works/digital/image-2-5-xhs/evaluation-boundaries.webp)

*The conclusion card presents both usability judgments and sample limitations.*

## Outcome and stage

The research cards and asset package are complete and have not been published on Xiaohongshu. All 9/9 requested editing rounds were completed, but this does not mean that 9/9 images were directly usable. The findings come from one evaluator, one fictional brand and a small sample, without an earlier-version, competitor or human baseline. They cannot establish a general success rate or savings in rework or working time.

<!-- refinement-v2 -->

### Input → instruction → output → failure judgment

The product task used a self-made fictional Qingxu packaging reference, specifying the cream body, dark green lid, blue vertical label, single orange dot and exact text. Continuous edits changed the background, bottom headline and dot color in sequence while requiring other content to remain unchanged. Original images, complete prompts and every output were preserved without repairing errors before grading.

Review checks both the requested change and unintended changes. P2 made the brand name larger than the event title, violating hierarchy. S3 added foliage-like shadows to an area required to remain clear. The second and third edit rounds changed the requested headline or dot, but accumulated changes to lid and label textures. Nine completed edit instructions therefore do not mean nine directly usable images.

The assessment dated 9 September 2026 classified 18 formal outputs as 10 directly usable, 8 requiring revision and 0 failing the primary task. These grades apply to this fictional brief and a single visual reviewer. They do not establish pixel identity, engineering geometry or a general success rate. The interface name was recorded as Images 2.5; the API subtype remains unknown.

### Sources

image-2-5-xhs protocol.json (tasks and complete prompts), evaluation.json (per-image judgments) and original research cards. No competitor, previous-version or human baseline was included, and the material was not published to Xiaohongshu.
