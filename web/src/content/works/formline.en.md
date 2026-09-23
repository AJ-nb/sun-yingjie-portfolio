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

The tool is intended for designers refining geometric marks: construct with circles, lines and constraints, inspect negative space and visual weight, then export a final graphic for applications and a construction drawing for explanation. Work often spread across guides, duplicate versions and export files stays within one local project.

## My role

The tool and interaction work is collaborative. The material covers the canvas, constraints and layers, optical corrections, diagnostic information and export flow. Open-source components support solving and drawing, with their contributions and licenses retained.

## Key question

Mathematical validity does not guarantee balanced visual weight. Designers need to see the difference between construction and optical correction and reset a correction independently. Diagnostics should identify concrete issues instead of replacing judgment with one score.

## Design process

Geometry, Final and X-Ray show construction, corrected appearance and their relationship. Independent, resettable optical adjustments avoid destroying the underlying geometry. Layers and constraints surround the canvas, keeping the object being edited visible.

Diagnostics separate open paths, negative space, visual weight and export visibility so the current review question stays clear. Desktop shows the inspector alongside the canvas; mobile collapses supporting areas without merging construction and correction.

### Reading a path from construction to delivery

Starting with the existing Aperture 01 example, a designer can inspect axes and shape relationships in Geometry, adjust an individual object's optical position or visual weight in Final, then compare the change in X-Ray. An unsuitable adjustment can be reset for that object while its construction remains intact. Final SVG, construction SVG, PNG and project JSON then serve different purposes: presentation and application need different files, while continued editing needs the project relationships.

This is a walkthrough of existing editing functions. Preserving stable geometry when constraints conflict, non-destructive Boolean nodes and local autosaving support continued work; they do not decide whether the final mark is balanced.

## Final work

The desktop interface accommodates the canvas, inspector and diagnostics together. On mobile, the inspector and diagnostics collapse to leave more space for the drawing. The current example is Aperture 01.

![Formline desktop geometry editor](/works/digital/formline/editor-desktop.webp)

*Desktop interface: layers, constraints, geometric canvas and individual diagnostics.*

![Formline mobile X-Ray view](/works/digital/formline/editor-mobile.webp)

*Mobile interface: the Aperture 01 example and collapsed diagnostic area.*

## Outcome and stage

The editor includes geometric constraints, non-destructive Boolean operations, undo and redo, local saving, and SVG, PNG and project export. The first version excludes wordmarks, collaboration, cloud sync and arbitrary SVG round-trip editing.

PlaneGCS solves geometric constraints and Paper.js supports drawing; they do not establish verified automatic logo fitting from an arbitrary bitmap. Individual diagnostics guide review without proving suitability for every scale or manufacturing process.

### Sources

logo-geometry-studio README, third-party notices and original desktop/mobile captures; local records begin on 14 August 2026. PlaneGCS and Paper.js contributions and licenses remain acknowledged.
