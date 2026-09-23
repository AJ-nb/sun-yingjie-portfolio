---
title: "AI Video Systems — From Prompt Cases to Reusable Workflows"
category: "digital"
summary: "A 22-second vertical film records how storyboard, blocking, identity continuity and camera constraints can become a reviewable AI-video workflow."
role: "Independent research and workflow design"
credits: "Final film and process account supplied by Yingjie Sun; public libraries, posts and articles are reference studies credited below"
status: "Independent applied research"
cover: "/works/ai-video-systems/ai-video-systems-cover.webp"
tags: ["AI video", "Storyboard system", "Blender blocking", "Prompt engineering", "Human review"]
---

## Overview

I developed an independent AI-video workflow to translate a story, camera-language reference and two character inputs into controllable shots. The work connects storyboard writing, Blender blocking, visual inputs and render review.

The final film is a 1080 × 1440, 22.08-second video supplied by the author. This page focuses on workflow design, visual control and human judgment.

## My role and input boundary

I translated the plot into a storyboard script, defined camera movement and visual invariants, arranged Blender blocking, and organized character images, scene images and prompts for Seedance 2.5. A film scene informed the camera language; that reference film is not published here and is not represented as project material.

My process log records two protagonist images as inputs for extending the cast, extracting visual cues and writing video prompts. It describes the 22-second film as containing eleven storyboard units and more than twenty characters. The “single-pass generation” description records the production flow used for this film.

## Control system

One long prompt is a weak way to control story, identity, time, physics and camera at once. This study separates six layers: intent, visual lock, temporal structure, physical logic, camera system and evaluation loop. Each layer must be observable and reviewable in the output.

![Six control layers for an AI video workflow](/works/ai-video-systems/control-layers.svg)

The prompt becomes a design specification rather than a style description: objective, reference, invariants, camera path, time blocks, action causality, end state and evaluation targets are written separately.

![Structured prompt architecture for the AI video workflow](/works/ai-video-systems/prompt-architecture.svg)

## Storyboard, blocking and render

The workflow begins with case observation, not copying a single prompt: observe visible results, decompose variables, compare directions, diagnose failures, then write transferable findings as templates. The designer retains decisions about camera, character relations, tempo and selection.

![Workflow map from case observation to a reviewed output](/works/ai-video-systems/workflow-map.svg)

The blocking video checks viewpoint, crowd density, direction of movement and shot hand-offs before final visual generation; it is not final art direction. The final stage supplied character images, blocking video, author-directed scene images and prompts to Seedance 2.5, then reviewed the render against the storyboard.

![A Blender blocking frame from the supplied source video used to check camera and cast relations](/works/ai-video-systems/ai-video-systems-blocking.webp)

<video src="/works/ai-video-systems/ai-video-systems-film.mp4" poster="/works/ai-video-systems/ai-video-systems-cover.webp" controls preload="metadata" playsinline><track kind="captions" src="/works/ai-video-systems/ai-video-systems.en.vtt" srclang="en" label="English visual description" default></track><track kind="captions" src="/works/ai-video-systems/ai-video-systems.zh.vtt" srclang="zh" label="中文视觉说明"></track></video>

*A 22.08-second final film supplied by the author. “Seedance 2.5 single-pass generation” and “GPT 6 + Blender automatic modelling” are the production labels used in the source video.*

**Visual description:** The screen pairs the final render above with a Blender blocking preview below. Walking shots, character close-ups and group compositions show how cast positions, action and camera framing carry between the two views. Yellow labels identify the author's tool and generation claims. The caption tracks describe these visuals; they are not a speech transcript.

## Evaluation and product-design transfer

Evaluation asks more than whether a frame looks attractive. Each storyboard unit checks recognisable identity, causal action, narratively motivated camera movement, continuous spatial scale and an end state that answers the opening objective. When a check fails, only the corresponding layer is revised instead of burying every problem under more adjectives.

The approach can transfer to product and spatial communication: hold a product form or use action as a visual invariant, define user tasks through story beats, then use blocking to check camera, contact and scale. It is a pre-generation design-judgment framework for structured visual production.

### From cases to a method library

Public reference documents are organized into intent, visual lock, time, physics, camera and evaluation, with eight method studies connecting product, CMF, space and narrative. Document analysis and personal workflow application are recorded as separate layers.

[Explore AI video methods](/en/systems/ai-video-methods)

## Reflection

The useful output is a set of controllable relationships, not a promise that every scene can be generated reliably in one pass. The next step is to compare repeat runs against the same storyboard criteria.

## Credits & Context

This is **Level B / Project Archive** evidence: the public page includes the author-supplied film, derived frames, newly authored system diagrams and an author process account. It excludes source character images, the reference film, editable Blender files, complete prompts and third-party case media.

The study is informed by [Awesome Seedance](https://github.com/LearnPrompt/awesome-seedance), the [original post](https://x.com/aiwarts/status/2102240456092626951) and an [article by AI Warts](https://www.woshipm.com/ai/6468462.html). Awesome Seedance is a public LearnPrompt project, not original open-source work by Yingjie Sun. Its code is under the [MIT License](https://github.com/LearnPrompt/awesome-seedance/blob/main/LICENSE); curation is licensed CC BY 4.0 with attribution to awesome-seedance / goodcase.ai; original posts, prompts, images and videos remain with their respective creators or rights holders. Its case counts change over time, so this page does not use them as fixed KPIs.
