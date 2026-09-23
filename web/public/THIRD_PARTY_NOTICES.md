# Third-party notices / 第三方声明

This portfolio uses open-source software, self-hosted fonts and user-specified remote font stylesheets. The following records preserve author notices and license text for the installed versions used in this edition. A package in the dependency inventory is not necessarily imported into the final browser bundle.

本作品集的开源代码依赖、字体与展示作品分别保留权利归属。使用组件不构成对其作者作品的原创声明，也不会扩大商业品牌、肖像、合作作品和参考图像的使用许可。

## Existing code foundation

The original [sen-3d-resume](https://github.com/dayinji/sen-3d-resume) code foundation is credited to Sen Zheng (SEN). Its [MIT source-code license](licenses/sen/LICENSE.sen) and [asset exclusions](licenses/sen/NOTICE.sen) are retained without modification. The upstream notice expressly excludes personal likeness, character models, resume content, work descriptions and brand imagery from the code license. This notice does not grant reuse rights to those assets.

## Direct runtime dependencies

Versions are read from installed package metadata associated with this edition's lockfile. Full texts, including additional third-party notices supplied by packages, are available through the links below and the [complete inventory](licenses/inventory.json).

| Package | Installed version | Declared license | Retained text |
| --- | --- | --- | --- |
| `@fontsource/epilogue` | 5.3.0 | OFL-1.1 | [LICENSE](licenses/packages/fontsource-epilogue-5.3.0/LICENSE) |
| `@fontsource/dm-sans` | 5.3.0 | OFL-1.1 | [LICENSE](licenses/packages/fontsource-dm-sans-5.3.0/LICENSE) |
| `@fontsource/noto-sans-sc` | 5.3.0 | OFL-1.1 | [LICENSE](licenses/packages/fontsource-noto-sans-sc-5.3.0/LICENSE) |
| `@fontsource/geist` | 5.3.0 | OFL-1.1 | [LICENSE](licenses/packages/fontsource-geist-5.3.0/LICENSE) |
| `@fontsource/geist-mono` | 5.3.0 | OFL-1.1 | [LICENSE](licenses/packages/fontsource-geist-mono-5.3.0/LICENSE) |
| `framer-motion` | 11.18.2 | MIT | [LICENSE.md](licenses/packages/framer-motion-11.18.2/LICENSE.md) |
| `img-comparison-slider` | 8.0.7 | MIT | [LICENSE.upstream](licenses/packages/img-comparison-slider-8.0.7/LICENSE.upstream) |
| `lucide-react` | 1.46.0 | ISC | [LICENSE](licenses/packages/lucide-react-1.46.0/LICENSE) |
| `react` | 18.3.1 | MIT | [LICENSE](licenses/packages/react-18.3.1/LICENSE) |
| `react-dom` | 18.3.1 | MIT | [LICENSE](licenses/packages/react-dom-18.3.1/LICENSE) |
| `react-markdown` | 10.1.0 | MIT | [license](licenses/packages/react-markdown-10.1.0/license) |
| `rehype-raw` | 7.0.0 | MIT | [license](licenses/packages/rehype-raw-7.0.0/license) |
| `remark-gfm` | 4.0.1 | MIT | [license](licenses/packages/remark-gfm-4.0.1/license) |
| `yet-another-react-lightbox` | 3.32.2 | MIT | [LICENSE](licenses/packages/yet-another-react-lightbox-3.32.2/LICENSE) |
| `zustand` | 4.5.7 | MIT | [LICENSE](licenses/packages/zustand-4.5.7/LICENSE) |

Lucide's retained LICENSE includes both the ISC terms for Lucide and the MIT terms for the listed Feather-derived icons, with their original copyright notices. Its package's ISC metadata alone is not a substitute for that full text.

## Fonts

Epilogue, DM Sans, Noto Sans SC, Geist and Geist Mono are supplied through Fontsource 5.3.0 under the SIL Open Font License 1.1. Source licenses are retained: [Epilogue OFL](licenses/font-sources/Epilogue/OFL.txt), [DM Sans OFL](licenses/font-sources/DM-Sans/OFL.txt), [Noto Sans SC OFL](licenses/font-sources/Noto-Sans-SC/OFL.txt), [Geist OFL](licenses/font-sources/Geist/OFL.txt), [Geist Mono OFL](licenses/font-sources/Geist-Mono/OFL.txt). The PDF export converts the installed Latin WOFF files to TTF without changing their outlines, then embeds subsets. Document Chinese text uses the available Microsoft YaHei font. Fontsource's tooling license does not replace individual font licenses.

At the portfolio author's request, the website also references the remote [HelveticaNowDisplay-Medium stylesheet](https://db.onlinewebfonts.com/c/5ac3fe7c6abd2f62067f266d89671492?family=HelveticaNowDisplay-Medium) and [HelveticaNowDisplayW01-Rg stylesheet](https://db.onlinewebfonts.com/c/1aa3377e489837a26d019bba501e779d?family=HelveticaNowDisplayW01-Rg), provided through [OnlineWebFonts Web Fonts](http://www.onlinewebfonts.com/fonts/). Their font binaries are not copied into this repository. Existing fonts remain as fallbacks for Chinese text and failed remote requests; these remote fonts are separate from the Fontsource OFL inventory.

## Build and verification tools

These records cover current verification tools and historical model-processing tools. The latter remain as archival attribution; the personal 3D module and its Three.js dependencies were removed in v5 and are not restored in v7. Test outcomes are recorded separately from package availability.

| Package | Installed version | Declared license | Retained text |
| --- | --- | --- | --- |
| `@axe-core/playwright` | 4.13.0 | MPL-2.0 | [LICENSE](licenses/packages/axe-core-playwright-4.13.0/LICENSE) |
| `@gltf-transform/cli` | 4.5.0 | MIT | [LICENSE.md](licenses/packages/gltf-transform-cli-4.5.0/LICENSE.md) |
| `@gltf-transform/core` | 4.5.0 | MIT | [LICENSE.md](licenses/packages/gltf-transform-core-4.5.0/LICENSE.md) |
| `@playwright/test` | 1.63.0 | Apache-2.0 | [LICENSE](licenses/packages/playwright-test-1.63.0/LICENSE), [NOTICE](licenses/packages/playwright-test-1.63.0/NOTICE) |
| `axe-core` | 4.13.0 | MPL-2.0 | [LICENSE](licenses/packages/axe-core-4.13.0/LICENSE), [LICENSE-3RD-PARTY.txt](licenses/packages/axe-core-4.13.0/LICENSE-3RD-PARTY.txt) |
| `gltf-validator` | 2.0.0-dev.3.10 | Apache-2.0 | [LICENSE](licenses/packages/gltf-validator-2.0.0-dev.3.10/LICENSE), [NOTICES](licenses/packages/gltf-validator-2.0.0-dev.3.10/NOTICES) |
| `playwright` | 1.63.0 | Apache-2.0 | [LICENSE](licenses/packages/playwright-1.63.0/LICENSE), [NOTICE](licenses/packages/playwright-1.63.0/NOTICE), [ThirdPartyNotices.txt](licenses/packages/playwright-1.63.0/ThirdPartyNotices.txt) |
| `playwright-core` | 1.63.0 | Apache-2.0 | [LICENSE](licenses/packages/playwright-core-1.63.0/LICENSE), [NOTICE](licenses/packages/playwright-core-1.63.0/NOTICE), [ThirdPartyNotices.txt](licenses/packages/playwright-core-1.63.0/ThirdPartyNotices.txt) |

## Indirect dependencies and source records

The [inventory](licenses/inventory.json) retains current and historical package records, notice files, SHA-256 values and provenance. Removed v4 packages remain in this archive; the runtime table above describes the retained direct dependencies. Most texts are exact installed-package copies; recorded upstream blobs supply missing root licenses, with release tags distinguished from upstream snapshots.

For the indirect `stats-gl` 2.4.2 dependency, the installed README and package metadata declare MIT, but no full standalone license text was present in the package or live upstream license endpoint at the check date. Its [declaration and source limitation](licenses/packages/stats-gl-2.4.2/LICENSE-DECLARATION.txt) are retained rather than an invented upstream copyright notice. This portfolio does not directly import the StatsGl overlay.

## Design references and portfolio content

Codrops [ScrollBasedLayoutAnimations](https://github.com/codrops/ScrollBasedLayoutAnimations), [LinesToLayout](https://github.com/codrops/LinesToLayout), [OnScrollTypographyAnimations](https://github.com/codrops/OnScrollTypographyAnimations) and [Scroll3DGrid](https://github.com/codrops/Scroll3DGrid) were researched for layout continuity, title rhythm and perspective composition. Their repositories provide MIT code licenses. Referencing those mechanisms does not make their sample images, authors' portfolios or brand assets part of this author's work.

Case-specific project authorship, team credits, upstream forks, image sources and completion stages remain in each bilingual case. Existing commercial trademarks and collaborative design materials retain their respective rights holders. Newly explained open-source mechanisms are tools and references, not additional personal project achievements.

Verification date: 2026-09-16. Retained source hashes and package versions are recorded in the inventory.

## Current presentation media and open-source decisions

The hero uses the [Mainframe video specified by the portfolio author](https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4). Its original file, all-intra scrub derivative and poster are documented in [reference media sources](media/v7/reference-sources.json). This footage is presentation media and is not presented as a personal project achievement.

The Arc’teryx footer film and retained Hermès project film are editorial sequences of original project imagery and authored design analyses, documented in [project film sources](media/v7/films/sources.json). Diagram and application layouts preserve the original subjects and are documented in the [v7 image manifest](media/v7/manifest.json).

The [open-source research record](OPEN_SOURCE_REFERENCES.md) distinguishes installed production and interaction tools, attributed derivative projects, historical foundations and research-only references. Mainframe informs the hero's interaction and composition; the portfolio's identity, copy and navigation remain specific to Yingjie Sun.

## v4 design and content research

The v4 research reviewed 29 repositories across personal portfolios, photography layouts and visual transitions. References include [HamishMW/portfolio](https://github.com/HamishMW/portfolio), [Polaris](https://github.com/educlopez/Polaris), [ECarry/photography-website](https://github.com/ECarry/photography-website), [InlineMenuLayout](https://github.com/codrops/InlineMenuLayout), [RepetitiveTypography](https://github.com/codrops/RepetitiveTypography) and [Scroll3DGrid](https://github.com/codrops/Scroll3DGrid). The local design independently implements selected ideas for curated layouts, explicit selection, content relationships and limited decorative motion using the existing dependencies. No upstream source code, sample assets, fonts or personal project claims were copied in this revision; this research did not install new dependencies.

The detailed research, source verification and adoption records are retained in the private source repository. The public upstream links above preserve the origins of the references. Publicly readable sources with absent, conflicting or restricted grants were studied without copying. These research references do not change the dependency license inventory above or grant rights to authors' projects, photographs, brands or fonts.


## v7 design production

SVGO 4.1.0 (MIT) optimizes authored SVG analysis boards at build time; its [license text](licenses/packages/svgo-4.1.0/LICENSE) is retained. Sharp (Apache-2.0) renders the boards. FFmpeg is used as an external production tool for editorial films and seek-friendly video encoding; the local build includes GPL components and its binary is not distributed. Original brand marks and project images retain their owners and project credits. The Mainframe hero footage is separately attributed above.

## Portfolio v9

Kanit typeface: SIL Open Font License 1.1; exact installed notice retained in the license inventory. Noto Sans SC remains the Chinese typeface. Motion is used under MIT. React Bits, Codrops Scroll3DGrid and HamishMW/portfolio informed interaction research only; no code or demo media from those references is included in this rebuild.


## AI video methods research (2026-09-23)

Research curation is adapted from [awesome-seedance / goodcase.ai](https://github.com/LearnPrompt/awesome-seedance/tree/9927d9b5bc2d1c305b2945917e461b3547642497). Source code is MIT; curation (selection, organization, templates and editorial summaries) is [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). This portfolio reorganizes the documentation into six control layers and eight product-design method studies. Prompts and media remain individually owned. No third-party prompt text, poster or video is copied into the release; optional original-platform embeds preserve source attribution. The research has not been personally retested.
