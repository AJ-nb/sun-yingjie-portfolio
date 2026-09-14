---
title: "Formline — Geometry Studio"
category: "digital"
summary: "A local logo editor that keeps geometric construction and optical corrections visible and independently editable."
role: "Collaborative work"
credits: "Collaborative work using PlaneGCS, Paper.js and other open-source components under their respective licenses"
status: "Local editor with desktop and mobile interfaces"
cover: "/works/digital/formline/editor-desktop.webp"
tags: ["Design tool", "Geometric constraints", "Logo", "Interaction design"]
---

## Background

Formline addresses two activities in geometric logo design: building an explainable construction and making small corrections for the final visual result. These are stored separately so that designers can compare construction logic with appearance.

## My role

The tool and interaction work is collaborative. The material covers the canvas, constraints and layers, optical corrections, diagnostic information and export flow. Open-source components support solving and drawing, with their contributions and licenses retained.

## Key question

A valid geometric relationship does not guarantee balanced visual weight. The editor needs to allow optical adjustment while preserving the original construction. Diagnostics should identify particular issues instead of replacing design judgment with a single score.

## Design process

Geometry, Final and X-Ray views make construction and correction directly comparable. Objects retain independent optical adjustments that can be reset. Layers and constraints surround the canvas, while diagnostics separately address open paths, negative space, visual weight and export visibility.

## Final work

The desktop interface accommodates the canvas, inspector and diagnostics together. On mobile, the inspector and diagnostics collapse to leave more space for the drawing. The current example is Aperture 01.

![Formline desktop geometry editor](/works/digital/formline/editor-desktop.webp)

*Desktop interface: layers, constraints, geometric canvas and individual diagnostics.*

![Formline mobile X-Ray view](/works/digital/formline/editor-mobile.webp)

*Mobile interface: the Aperture 01 example and collapsed diagnostic area.*

## Outcome and stage

The editor includes geometric constraints, non-destructive Boolean operations, undo and redo, local saving, and SVG, PNG and project-file export. The first version does not include wordmarks, collaboration, cloud sync or arbitrary SVG round-trip editing. Diagnostics support review; the designer retains the final aesthetic judgment.
