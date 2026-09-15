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

The central question is consistency across stages: how facts enter a brief, how derivatives retain provenance, and how revisions preserve the same constraints.

## Design process

Product facts and unknowns enter a source record, with original images kept separately. A brief defines the audience, angle, language and appearance constraints. Generated candidates retain versions and undergo fact, product-consistency and applicable-rule review before a human decides whether they belong in a publication package.

![XHS method workflow](/works/refinement-digital/xhs-methods/workflow.png)

*A method diagram derived from requirements, not a running interface or evidence that all five stages are implemented.*

## Final work

The existing continuous-edit study exposes a concrete problem: an edit can correctly change the background, headline or dot while packaging texture still drifts. The proposed workflow therefore records requested-change completion separately from overall usability, retaining each input, complete prompt, original output and rejection reason. These findings inform requirements; they do not establish an implemented automatic evaluator.

## Outcome and stage

Versioned requirements, architecture, a staged roadmap and an explicitly labeled foundation page exist. The next step is to validate product facts and original-asset organization before implementing generation and review. There is no evidence of automatic publication, live operational feedback or growth outcomes. Platform rules require fresh checks against original sources at the time of publication.

### Sources

xhs-operations-os README, MASTER_PRD, ROADMAP, SPEC_MANIFEST and homepage source; image-method observations refer to the Image Generation and Continuous Editing Study in this portfolio. This is a method study and does not duplicate Lensflow or Yantai implementation outcomes.
