# Verification Record

Date: 2026-08-14  
Platform: Windows, Chrome / Playwright Chromium

The results below come from executed checks, not planned targets.

## Automated checks

- Unit and integration tests: **30 passed in 5 files** (`npm test`)
- TypeScript and production build: **passed** (`npm run build`)
- Oxlint: **passed with zero warnings** (`npm run lint`)
- Playwright: **7 passed** using installed Google Chrome 151 (`npm run test:e2e`)
- Workflow coverage: draw two circles, group, equal-radius and tangent constraints, editable Bezier nodes and endpoint tangent solve, optical correction, all canvas modes, reference image exclusion, SVG/PNG/JSON downloads, IndexedDB reload, future-version rejection, keyboard focus and axe serious/critical scan

## Viewports

- 1440 × 900: passed layout, nonblank canvas pixel and screenshot review
- 1280 × 800: passed layout, nonblank canvas pixel and screenshot review
- 1024 × 768: passed layout, nonblank canvas pixel and screenshot review
- 390 × 844: passed layout, nonblank canvas pixel and screenshot review; inspector and diagnostics default to collapsed

Screenshots are in `output/playwright/viewport-*.png`.

## Stress fixture

- Fixture: 200 geometry objects, 300 constraints
- Target: warm P95 solver time <= 100 ms
- Samples: 25 total; first 5 discarded as warm-up
- Warm P95: **2.6 ms**
- Result: **passed**

The document contains all 200 objects and 300 constraints. The Worker builds the PlaneGCS system only from objects referenced by active non-fixed relationships; fixed-only and unrelated objects stay stable outside the equation matrix, while unconstrained objects still contribute to the displayed DOF estimate. Raw measurements are in `output/playwright/stress-metrics.json`.

## Known verification boundary

Safari is not in the claimed support set. Browser checks validate software behavior and rendering only; diagnostics remain design-review aids rather than proof of aesthetic quality.
