# Portfolio v4 — Between form & feeling

## Brief and design read

Overhaul the visual language and expand the personal narrative for prospective collaborators and hiring teams. The user explicitly requested implementation and GitHub synchronization. This revision uses the existing portfolio as the factual source and keeps the project routes, original media, credits, downloads and eight working experiments.

Design dials: visual variance 9/10, motion intensity 8/10 in exhibition surfaces and 2/10 in reading surfaces, information density 7/10, original asset dependence 9/10, identity fidelity 8/10. These describe implementation intent, not measured quality scores.

## Before → after

- The opening withholds project images behind a long résumé scroll → original work appears in the opening composition and an operable featured-project stage.
- Personal copy repeats one short summary → a detailed bilingual profile connects education, employment, responsibilities, practice, methods and project evidence.
- Six similar chapter layouts → alternating image scales, oversized chapter numbers and different editorial compositions, with explicit navigation.
- The index exposes only a title and category → descriptions, interaction labels and grid/list views support project selection.
- Restrained sage and paper palette → near-black `#111210`, acid yellow-green `#d6ff4f`, paper `#f2f0e9`, muted warm gray. Existing product imagery provides the other colors.

## System

Typography: locally hosted Portfolio Sans for Chinese and body text, system grotesk for oversized English display, Bodoni Moda as a selective editorial accent. Dense body copy remains at a comfortable reading size and line length. The same heading never relies on outlined text alone for meaning.

Spacing: 8px rhythm, responsive page gutter of 20–80px. Editorial blocks use rules and negative space. Large rounded shapes are reserved for the portrait stage; project imagery retains its own proportions.

Motion: reveal, reversible image changes, scroll-linked composition and subtle pointer depth. Short controls respond within 160–240ms. Decorative motion has a persistent pause control, respects reduced-motion preferences, and stops when inactive. No artificial loading gate or wheel interception.

## Content contracts

Personal history derives from `web/src/data/profile.json` and retained source documents. Exact content and evidence mapping are recorded in `personal-narrative-v4.md`. Open-source work remains credited reference or implementation material, not claimed personal client work. No invented achievements, clinical results, performance percentages or personal biographical facts.

## Implementation and verification

The original hash routes, bilingual URL state, catalogue filters, browser history restoration, original portrait GLB and download artifacts stay operable. The browser suite checks preserved journeys and the new controls; visual review covers both languages and mobile/desktop. Research findings and actual adaptations are recorded separately in `open-source-research-v4.md`.
