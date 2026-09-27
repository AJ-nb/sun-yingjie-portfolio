# YINGJIE SUN — Portfolio

Industrial & Product Designer · 工业与产品设计师

[Open the portfolio](https://aj-nb.github.io/sun-yingjie-portfolio/) · [English](https://aj-nb.github.io/sun-yingjie-portfolio/en/) · [Résumé and downloads](https://aj-nb.github.io/sun-yingjie-portfolio/resume/)

35 bilingual projects, eleven selected works, and a research library containing a pinned reference index and eight authored method studies. The reference library is not counted as personal project work.

## Quick Studio workflow

[Workflow guide](https://aj-nb.github.io/sun-yingjie-portfolio/tools/quick-studio/) · [English guide](https://aj-nb.github.io/sun-yingjie-portfolio/en/tools/quick-studio/) · [Open the workbench](https://quick-studio-web.vercel.app/)

The portfolio now includes a public entry for the garment visual workflow: front/back references → on-model generation → human review → optional detail-image stitching → image delivery, with video as an optional branch. Visitors use their own assets and API keys. The workbench runs on Vercel because GitHub Pages cannot run its API proxy. Simulation makes reference copies; real generation requires a compatible provider and incurs provider charges. Paid image quality has not yet been accepted using a valid key.

The tool is presented separately from the 35 documented portfolio projects and existing PDF editions. Public links do not contain or synchronize a visitor's drafts, uploaded assets or keys.

## Local development

Node.js 24 or later. From `web`, run `npm ci` and `npm run dev`.

For GitHub Pages builds set `PORTFOLIO_BASE_PATH=/sun-yingjie-portfolio/` and `VITE_SITE_ORIGIN=https://aj-nb.github.io`, then run `npm run build`. The workflow publishes only the verified asset allowlist. Nested routes contain static HTML; JavaScript enhances interaction.

## Publications

`web/public/downloads` contains 18 PDFs and eight editable Word résumés in Chinese and English. Generators are in `scripts`; PDF regeneration requires Python with ReportLab, Pillow, pypdf and PyMuPDF. The three licensed document fonts are included in `web/public/fonts/documents`. Chinese fonts can be supplied through `PORTFOLIO_FONT` and `PORTFOLIO_BOLD_FONT`. Editable résumé export uses Microsoft Word on Windows. Existing verified downloads can be published without rebuilding publications.

## Rights and provenance

Public access does not grant a blanket reuse license for portfolio artwork, client identities or project media. Personal responsibility and project maturity are documented in each case. Retrospective studies and concepts are labeled. Third-party license notices are in `web/public/THIRD_PARTY_NOTICES.md` and `web/public/licenses`.

Research curation credits Awesome Seedance / goodcase.ai under CC BY 4.0. Third-party reference videos are loaded from official posts on demand; no repository-wide license grants permission to redistribute their media. Private originals, credentials and archived development history are excluded from this source snapshot.
