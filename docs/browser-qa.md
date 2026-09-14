# Production browser QA

Result: **14/14 functional checks passed** on 2026-09-15 01:48 Asia/Shanghai. No unresolved Critical or Important functional issue was observed in this run.

## Environment and evidence

- Production preview: `http://127.0.0.1:4173/`.
- Initial verification used agent-browser 0.37.1, isolated session `syj-final-qa`. It confirmed meaningful content, 30 catalog cards, no framework error overlay, and an empty CLI error list. The host browser reported reduced-motion preference enabled. The session was closed afterward.
- Automated assertions used Playwright Core with Chrome **152.0.7977.83**, a separate temporary profile, explicit reduced/no-preference contexts, and permission for software WebGL. Existing browser sessions were not used.
- Tested build entry SHA-256: `6da534625d703526c0c374208db1f3e368ff6668fa3b65e80595ce70f47f6c22`.
- Build assets: `index-CP_pINMR.js`, `PortraitScene-Cx9dcKFz.js`, `index-K-08r9Oa.css`.
- Reproducible checks: [browser-qa.mjs](../scripts/qa/browser-qa.mjs). Full measured results: [browser-results.json](../design/qa/browser-results.json).

## Verified behavior

| Check | Result and evidence |
| --- | --- |
| Catalog and thumbnails | 30 cards and 30 unique thumbnails decoded successfully in Chrome. |
| Categories | Source counts matched UI: commercial 2, product 17, brand 2, digital 7, experiments 2. |
| Search and reset | Full-width uppercase `ＬＥＮＳＦＬＯＷ` with surrounding spaces found Lensflow; an unmatched query displayed the empty state; clearing restored all 30 cards. |
| Independent case routes | All 30 Chinese case routes loaded, each with six sections; 129 unique case images decoded successfully. |
| Invalid routes | Both `#/work/%` and a nonexistent slug displayed the case fallback; its return action recovered the work index. |
| Case navigation and history | Product category and `管道` query survived case → next case → return. Scroll position was **4751 px before and after**. Browser forward returned to the latest case; browser back returned to the filtered catalog. |
| Cross-page anchors | Case → about, contact, and top reached their intended targets. The contact check accounts for the document's maximum scroll position. |
| Lightbox keyboard and focus | ArrowRight wrapped `12 / 12` to `1 / 12`; ArrowLeft restored the previous image. Zoom changed the view, Escape closed it, body scrolling resumed, and keyboard focus returned to the opening image button. |
| Video | Muted playback advanced beyond 0.25 seconds without media error: **960 × 544**, duration **27.916667 seconds**, readyState 4. |
| Language and downloads | Chinese/English home and case copy, document language, and language query parameter changed together. Both links triggered browser download events and served HTTP 200 with a PDF signature. Portfolio: **16,945,242 bytes**; résumé: **289,953 bytes**. |
| Responsive width | At 320, 390, and 1440 px, Chinese and English home/index/representative case pages had document and body widths equal to viewport width. Screenshots were inspected for the 320 px Chinese home, 390 px English home and catalog, 320 px English case, and desktop live scene. |
| Reduced motion | A fresh reduced-motion context made **zero** requests for the dynamic scene/Three bundle or GLB before an explicit click. Clicking loaded one GLB, revealed the live scene, and hid the poster. Switching to still view removed the canvas and restored the poster. |
| Normal and delayed GLB | Normal preference automatically loaded the live scene. An intentionally held GLB request left the poster visible and canvas transparent until the model's first frame. Releasing it produced a 1440 × 1000 canvas and hid the poster. |
| Model failure and runtime errors | Deliberately aborting the GLB request restored the static portrait. Ordinary functional checks recorded **zero console errors and zero uncaught page errors**. Expected errors from the deliberately aborted request were isolated from ordinary checks. |

## Fixes from this QA

The initial real-browser run exposed missing focus restoration when the lightbox was removed. `App.tsx` now records the opening focused element before showing the dialog and explicitly focuses it, if still connected, during cleanup. The final keyboard test confirms the correction.

Chrome also requested a missing `/favicon.ico`. An inline sage/ivory SVG favicon in `web/index.html` removes that unnecessary 404. Final ordinary browser checks recorded no errors.

Two initial test failures were corrected in the test harness: the contact anchor is constrained by maximum document scroll, and independent test fixtures must explicitly clear previously retained catalog filters. Neither required a product change.

## Validation and limits

`npm run build` (including TypeScript) and `npm run lint` passed after these fixes. The build staged 164 selected assets, reported as 52.8 MiB. Vite still reported its existing warning for minified chunks over 500 kB: the main bundle was 598.15 kB and the dynamic scene bundle 891.27 kB. This is a build-size observation, not a measured runtime performance finding.

This run used desktop Chrome with simulated viewport widths. It did not test physical iOS/Android hardware, Safari/Firefox, screen-reader output, real mobile GPU/battery behavior, network performance, or audio playback. Video was muted. Case images were explicitly decoded to check the files, rather than requiring a visitor to scroll through every lazy image. All Chinese cases were checked; English functionality and representative layouts were checked, not every English translation sentence. PDF download delivery was verified; PDF editorial/layout review belongs to the separate document checks. Avatar likeness was outside this QA. A later replacement GLB needs its own loading/fallback/render verification.

## Re-run

From the project root, with the production preview running:

```powershell
node scripts/qa/browser-qa.mjs
```

The script accepts `SYJ_QA_URL`, `SYJ_QA_CHROME`, and `SYJ_QA_PLAYWRIGHT` environment overrides. Its default browser and Playwright paths reflect this Windows host. It writes evidence only under `design/qa/`, uses a temporary isolated browser profile, and closes its browser on completion.

Representative screenshots:

- [Chinese home, 320 px](../design/qa/home-zh-320.png)
- [English home, 390 px](../design/qa/home-en-390.png)
- [Catalog, 390 px](../design/qa/catalog-390.png)
- [English case, 320 px](../design/qa/case-en-320.png)
- [Lightbox, 390 px](../design/qa/lightbox-390.png)
- [Live scene, 1440 px](../design/qa/normal-live-3d-1440.png)

The 01:48 full rerun used final avatar GLB SHA256 `e2f130df044e950b0459e05e8467aaa3604a42bc6d4923bf53d6fa0aa3118be5` and the final 40-page PDF. All 14 checks passed again, including actual model loading, first-frame display, failure fallback and manual still view. Likeness remains a separate user review.
