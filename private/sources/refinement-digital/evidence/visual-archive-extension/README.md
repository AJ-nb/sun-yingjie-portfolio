# Visual Archive

Manifest V3 Chrome extension for turning a webpage image or local file into an evidence-bounded visual reconstruction archive.

## What it records

- Local measurements: dimensions, aspect ratio, SHA-256 of the selected data URL, and a sampled pixel palette with coverage percentages.
- Model analysis: visible subjects, composition, silhouette, typography, lighting, material cues, uncertainty, and a reproduction plan.
- Provenance: capture method, source URL when available, analysis model, and the distinction between measured, observed, inferred, and unknown fields.

The archive is not original production metadata. A single image cannot determine hidden geometry, exact materials, camera calibration, source files, or the original prompt.

## Model split

- `gpt-5.6` is the default visual-language analysis model. It receives the image through the Responses API and returns schema-constrained JSON.
- `gpt-image-2` is kept as the default reconstruction model. It is not used for JSON analysis because it produces images and does not support Structured Outputs.

The API key is entered in the extension settings and stored only in `chrome.storage.local`. The extension calls `https://api.openai.com/v1/responses` directly; no proxy or application backend exists.

## Load in Chrome

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Select **Load unpacked** and choose this directory.
4. Open **Settings**, enter the API key, and save.
5. Right-click a webpage image and select **Create visual archive**, or open the extension from the toolbar to select a local image.

The optional image-read permission allows direct image downloading from webpages. Without it, the extension tries a visible screenshot crop after a right-click action.

## Validation

Run `npm test` in this directory. It checks the manifest boundary, required model separation, schema usage, key absence, and JavaScript syntax.

## Primary API references

- [Images and vision](https://developers.openai.com/api/docs/guides/images-vision)
- [Structured model outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)
