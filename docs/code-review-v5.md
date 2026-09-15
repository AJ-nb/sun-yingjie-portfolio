# Portfolio v5 whole-branch review

Date: 2026-09-16
Base: `d41c71bd40990baf2d897a1c58d8fa00e6828383`
Head: `4302e7a00ab69bb5b6b241e8a97662e2316785ad`

## Scope and method

Read the implementation plan, delivery record, reviewer template, Task 1 review, final UI report and final document review. Reviewed the branch in passes: React/video/navigation; canonical content and case selection; public staging and CI; document generators and manifests; sources and attribution. Binary document visual inspection is supported by the independent document review, not repeated or represented as my own inspection. No implementation, index or HEAD changes were made. This report is the explicitly permitted report-only write.

The parent is separately running the freshly staged production browser suite. A concurrent uncommitted change to `scripts/qa/browser-v5.cjs` was observed late in review and is outside this SHA-specific verdict.

## Strengths

- Video work is isolated from reading/navigation. Native seeking serializes decoder writes and retains the latest request, cleans up pending work, and clamps endpoints. Footer gaze uses measured source-frame angles and cover-crop geometry; resize/scroll recompute geometry. Reduced motion removes video elements; visibility gates playback and pointer listeners; media failures retain posters and readable content.
- Mobile menu disclosure, Escape restoration, destination focus, modified-click behavior, case-return focus and the established history/reading-state machinery are retained. The chapter gallery no longer competes for the selected-section ID.
- The six selected cases share `publication.json`; canonical Liling dates are February–September 2026. Adopted Periastra lettering is separated from historical symbols in cards, cases, interactive views and export inputs. Collaboration and unverified production/market claims remain qualified.
- Public output uses an explicit media allowlist, rejects unresolved LFS PDFs and unexpected files, checks retained license hashes, and copies a fresh static build into a new release directory. Vite does not copy the entire public tree for production. The three uncleared cases and legacy personal avatar are excluded from the examined staged media list.
- CI uses Node 24, frozen dependency installation, publishable LFS downloads, content/type/lint/invariant/build checks, then a v5 browser suite with an explicit server wait and Linux Chromium support. The committed document downloads are inputs to site CI; regenerating Word/PDF is a separate local workflow.

## Issues

### Critical

None identified.

### Important

None identified in the implemented scope.

### Minor

1. `scripts/resume/export_word.ps1:17` pins its post-export page-count check to the Codex cache Python path. A Windows machine with Word and all README-listed Python packages, but without that particular bundled runtime, cannot finish the documented export command. Existing exported files and website CI are unaffected. Prefer a configurable Python executable with the current path as a fallback, or document that extra prerequisite.

## Verification

Freshly reran and passed:

- Content validation: 30 bilingual public cases, 205 media references, selected 32-page arithmetic, uncleared-case exclusion.
- Experiment invariants: 9 bilingual experiments and 28 asset references; recovery and review transitions.
- Scroll timeline invariants and 120 bilingual case recommendations.
- Native video controller tests: 3/3, including reversal, delayed metadata, endpoint bounds and disposal.

Read the staged media index: 482 records, with no paths matching the legacy avatar, private directories, three withheld case slugs, Blender files or PowerPoint sources. The independent final document report records inspection of all 145 PDF pages; the delivery record additionally records 38 integrity checks and independent decoding of all three QR codes. The UI report records 11 browser checks. Those reports are supporting evidence; no new browser, full build, PDF render or external publication is claimed by this reviewer. `git diff --check` reports only an extra terminal blank line in `web/src/ui/videoSeek.ts:16`.

## Plan limitation

The specified sidebar image2.5 generation/retouching requirement remains unfulfilled. The delivery record correctly says the portrait is the original supplied photograph and existing renders are not newly generated. Permission to use an alternative image tool remains pending. This is a known scope limitation, not an unexplained runtime defect, and must remain explicit in the final delivery statement. This review does not certify full completion of that requirement or establish a blanket redistribution license for the reference footage.

## Assessment

**Ready to merge? Yes, for the implemented scope.** No critical or important defect was found that requires holding the branch. The original-photo limitation is transparent and does not break the delivered navigation, cases, documents or media fallbacks.

**Ready to publish? Technically suitable, subject to the parent’s final production-browser result and the already planned exact-commit/public-download verification.** Local checks are not proof that GitHub or the public site has been updated. Keep repository visibility private and report image generation as outstanding.

Confidence: High for source-level integration and the fresh invariant/content checks; production confidence remains bounded by the independent browser/document evidence and pending remote verification.

Root follow-up: production browser checks passed 11/11 after normalizing the relative reference URL assertion. The resume exporter now supports PORTFOLIO_PYTHON, the bundled runtime and PATH Python, with an early pypdf check; PowerShell syntax and available runtime were verified.
