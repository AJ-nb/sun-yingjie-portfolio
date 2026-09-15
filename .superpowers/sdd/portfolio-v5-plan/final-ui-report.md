# Portfolio v5 final UI report

Date: 2026-09-16

## Implemented

- Replaced the hero discipline links with four immediate destinations: selected work, selected portfolio PDF, resume PDF, and contact.
- Read the six selected case slugs and order from `web/src/data/publication.json`.
- Set the Periastra selected-work image to `/works/brand/periastra/final-wordmark.png`.
- Rebuilt the home footer as three desktop columns for work navigation, personal wordmark, and contact/downloads. The original purple video remains behind the desktop footer and moves below all content on mobile.
- Added bilingual access to `OPEN_SOURCE_REFERENCES.md`.
- Added `scripts/qa/browser-v5.cjs` with `BASE_URL` and `PORTFOLIO_QA_URL` support, configurable `PORTFOLIO_QA_OUTPUT`, Windows Edge execution, and Playwright Chromium execution on non-Windows systems.
- Updated the package lock root version from 0.4.0 to 0.5.0.

## Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed with zero warnings.
- `npm run test:video`: 3/3 passed.
- `npx vite build`: passed. Vite emitted a non-blocking main-chunk size advisory.
- `npm run test:browser`: 11/11 passed against `http://127.0.0.1:5176/`.

The browser suite covers 320, 390, 768, and 1440 px layouts; reduced-motion poster fallback; publication order; the final Periastra asset; menu focus and Escape restoration; contact navigation; both PDF downloads; archive filter/list behavior; case routing and history state; lightbox open/close; desktop hero scrubbing in both directions; desktop footer video positioning; English labels; runtime errors; explicit mobile hero playback; and muted looping mobile footer video placement.

## Evidence

Generated evidence is in `design/qa-v5/`:

- `frontend-browser.json`
- `hero-320.png`
- `hero-390.png`
- `hero-768.png`
- `hero-1440.png`
- `footer-390.png`
- `footer-1440.png`
- `footer-video-390.png`

The mobile and desktop screenshots were inspected visually after the assertions passed. No horizontal overflow, text overlap, or footer/video ordering issue was observed.
