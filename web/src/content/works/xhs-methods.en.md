---
title: "XHS Content Workflow Research"
category: "experiments"
summary: "A method study connecting product facts, original assets, generated candidates and human review."
role: "Collaborative method research and product planning"
credits: "Research framework, requirements and prototype are collaborative; implementation stage follows existing code"
status: "Method research and foundation shell; operations system incomplete"
cover: "/works/refinement-digital/xhs-methods/workflow.png"
tags: ["Method study","Content workflow","Fact management","Human review"]
---

## Background

Creating Xiaohongshu content spans product records, copy, images and publishing decisions. If each stage invents its own account, product facts, appearance and final claims can diverge. This research asks how verified inputs can lead to reviewable candidates.

## My role

The work covers collaborative method development, requirements, information structure and an application foundation shell. The implemented homepage explicitly states Foundation Shell / P0 / Task 4. Product libraries, generation, evaluation and approval in the roadmap are planned scope rather than released functionality.

## Key question

As content moves through source records, briefs, images and copy, product facts can be rewritten repeatedly. The method needs to retain the same input constraints and the reasons for generation and rejection. A complete diagram does not establish implemented capabilities.

## Design process

Facts and unknowns first enter a source record, with original images kept separate. A brief then defines audience, angle, language and appearance constraints. Versioned candidates undergo fact, consistency and applicable-rule review before a person decides what enters a publication package.

The continuous-editing study provides a concrete reason: backgrounds, titles or dots can be correctly changed while packaging texture drifts. The method therefore records requested-task completion separately from overall usability and retains inputs, full instructions, raw outputs and rejection reasons. This turns observations into requirements, not a claim of implemented automatic evaluation.

![XHS method workflow](/works/refinement-digital/xhs-methods/workflow.png)

*A method diagram derived from requirements, not a running interface or evidence that all five stages are implemented.*

## Final work

The current delivery brings product facts, assets, briefs, candidates and human review into one requirements structure. The diagram explains those relationships and the foundation page identifies the development stage. They provide a method and an implementation starting point rather than a running end-to-end operations system.

## Outcome and stage

Versioned requirements, architecture, a staged roadmap and an explicitly labeled foundation page exist. The next step is to validate product facts and original-asset organization before implementing generation and review. There is no evidence of automatic publication, live operational feedback or growth outcomes. Platform rules require fresh checks against original sources at the time of publication.

### Sources

xhs-operations-os README, MASTER_PRD, ROADMAP, SPEC_MANIFEST and homepage source; image-method observations refer to the Image Generation and Continuous Editing Study in this portfolio. This is a method study and does not duplicate Lensflow or Yantai implementation outcomes.
