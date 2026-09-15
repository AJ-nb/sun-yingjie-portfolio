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

One career history may support several applications, but every rewrite should not become a new document disconnected from its source. This project extends an open-source formatter with master resumes, job-specific versions and factual evidence. Structured editing, template selection and PDF printing run in the browser, with standalone HTML use also supported.

## My role

This case presents collaborative design and development of an open-source fork of [gracexygu/resume-formatter](https://github.com/gracexygu/resume-formatter). Upstream and this fork use the MIT License. The contribution shown is the extended workspace, version management and reviewable changes, not sole authorship of the entire project from scratch.

## Key question

A master update should reach job versions without overwriting deliberate adjustments. AI may change wording but should not quietly change a person's history. Formatting also needs to be judged in the actual preview rather than from a template thumbnail.

## Design process

### Protect job-specific edits through differences

Job versions compare their creation baseline, the current master and the current job version. Only fields not independently changed synchronize automatically; users resolve conflicts individually. Import previews detected sections, warnings and unmapped text. Scanned PDFs explicitly report that OCR is unsupported.

### Stop rewriting at the review boundary

AI rewriting retains the selection and shows a diff for acceptance or rejection, with additional checks for numbers and dates. Biyuan is one optional preset that retrieves account models, not proof of compatibility with every model. Editing, rule checks and formatting remain usable without AI.

### Separate working material from application output

Twelve templates offer single- and two-column structures with precise type, spacing and margin controls. PDF output checks blocking errors before printing. Workspace backups are separate from ordinary resume exports, keeping internal evidence and job research out of applications. This edition's fictional demo explains review and undo; its history is not the author's resume.

![Reviewing an AI rewrite diff in Resume Formatter](/works/digital/resume-formatter/rewrite-diff.webp)

*Review the change before applying it. The resume content is fictional.*

## Final work

The desktop's three columns connect content navigation, an actual resume preview and a job or layout inspector. Content choices and layout adjustments stay in one workspace, allowing reading order to be checked after each change instead of switching between disconnected files.

![Master resume, job version and evidence workspace](/works/digital/resume-formatter/workspace.webp)

*The v2.4.0 workspace. The person, job and professional history are fictional test content.*

![Resume Formatter template and layout controls](/works/digital/resume-formatter/layout-controls.webp)

*Template previews and controls for type size, line spacing, margins and other layout settings.*

## Outcome and stage

Version 2.4.0 combines master and job versions, evidence, templates, review and export. Rule checks flag content and reading risks; they do not provide actual ATS acceptance rates, recruiter reading times or hiring probabilities. AI remains optional. The tool does not export DOCX; the Word resume delivered separately with this portfolio does not imply that capability was added to the tool.

[Use Resume Formatter](https://aj-nb.github.io/resume-formatter/)

### Sources

Resume Formatter v2.4.0 README, privacy and third-party notices, and saved fictional-resume interface captures; local records begin on 21 August 2026. MIT Fork attribution follows the upstream and project notices.
