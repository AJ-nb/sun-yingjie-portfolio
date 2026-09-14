# Eagle Aesthetic Atlas / Eagle 审美图谱

This project builds a source-traceable bilingual design-style atlas, renders two 1600 x 2000 study cards per style, and prepares an idempotent Eagle 4 import manifest.

The default workflow is deliberately non-destructive. `npm run dry-run` reads the current Eagle library only to capture a baseline and writes artifacts under `artifacts/`; it never edits the `.library`. Actual import requires opening the packaged Eagle plugin and explicitly applying a validated manifest.

## Evidence model

- `FACT`: copied from an institution or official source.
- `INFERENCE`: style/domain classification derived from the available metadata.
- `JUDGMENT`: curatorial rating, anchor selection, and transfer advice.
- `UNKNOWN`: missing rights, attribution, date, dimensions, or other unresolved fields.

The GitHub projects `joeseesun/learnui` and `alexiseverage/aesthetic-frontend-skills` are vocabulary seeds only. They are not treated as historical authorities or artwork-rights sources.

## Verified package (2026-08-19)

- 144 bilingual style nodes across 23 subdomains.
- 2,500 unique institutional work records with no duplicate `workId` values.
- 288 local 1600 x 2000 PNG study cards (DNA + transfer method).
- 144 generated research dossiers, 166 normal folders, and 6 smart folders.
- Every style has exactly 3 automated anchor works; these are `JUDGMENT`, not manually verified canon.
- 7 adult style nodes are isolated. Adult-scoped works cannot also receive general tags or folders.
- Final audit: 0 blocking errors and 0 warnings; dependency audit: 0 known vulnerabilities.

The 2,500 institutional works are imported as source bookmarks, not local artwork files. In this environment the dominant AIC image endpoint returned a Cloudflare challenge, and 13 other images failed the minimum 900 x 900 quality gate. The package preserves traceable source pages instead of bypassing rights or quality controls.

## Commands

```powershell
npm install
npm run taxonomy
npm run collect -- --target 2500
npm run download
npm run cards
npm run manifest
npm run audit
```

`npm run dry-run -- --target 2500` runs the full sequence used for the verified package. Large collection runs use a persistent HTTP cache and can be resumed.

From the repository root, `npm run release:atlas` creates a portable ZIP and `SHA256SUMS.txt`. The release manifest rewrites local card paths to `cards/...`; caches, draft renders, downloaded references, records, and Eagle libraries are excluded.

## Import gate

Do not apply a manifest while `audit.blockingErrors` is non-empty. The plugin checks the active Eagle library path, reuses exact folder names, detects existing `图谱/ID/...` tags, and stores a resumable `ImportState`. Existing items are never deleted or retagged.

Verified import inputs:

- Plugin directory: `artifacts/eagle-plugin`
- Audited manifest: `artifacts/eagle-import-manifest.json`
- Expected Eagle library: `E:\文件\设计参考.library`

Load the local plugin directory in Eagle, select the audited manifest, and inspect the displayed counts. Writing remains disabled unless the active library path matches, the manifest has zero blocking errors, the confirmation checkbox is selected, and the literal text `IMPORT` is entered. Stop before this step unless library mutation has been explicitly approved.
