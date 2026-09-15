# Final document review

Review date: 2026-09-16

## Completion scope

- Read-only QA of the final web PDFs; no source or deliverable edits.
- Fresh renders stored under `.cache/v5/final-doc-review/`.
- Poppler rasterization at 150 DPI for both portfolios and 200 DPI for the resume.
- Every page visually inspected: selected portfolio 32/32, archive portfolio 112/112, resume 1/1 (145 pages total).
- Visual checks covered clipping, overlap, missing glyphs, unexpected page breaks, image framing/cropping, caption association, hierarchy, headers/footers, and page numbering.
- Structural checks used `pypdf` for page count, encryption state, text extraction, annotations, and external link targets.

## Files reviewed

| File | SHA-256 | Pages | Extractable text | External links |
| --- | --- | ---: | --- | --- |
| `deliverables/portfolio/sun-yingjie-selected-portfolio-web.pdf` | `d16ca5b44f5e0f653663571d86536cf3e3f55924d5cb0518aad81368136e7550` | 32 | Yes on every page; 9,459 characters total | 8 URI actions: six case links, email, portfolio site |
| `deliverables/portfolio/sun-yingjie-portfolio-web.pdf` | `8cbadb34e3f008a30ae09ddc4ba9f03b9943a6a8f65df46d3ed475bbedc7b76e` | 112 | Yes on every page; 24,247 characters total | 105 URI actions; archive cover/contact and case links resolve to the portfolio site routes, plus email |
| `deliverables/resume/sun-yingjie-resume.pdf` | `0f8f85a0bab6f058f4d122e1673f12164f55170fad47a0b4a159f6969a61de9c` | 1 | Yes; 1,007 characters | Portfolio site URI present |

All three PDFs are unencrypted. No page is image-only or missing an extractable text layer.

## Visual findings

No blocking or visible document defects found.

- Selected portfolio: all 32 pages render cleanly. Type hierarchy, recurring navigation/footer labels, page numbers, case transitions, image frames, and captions are consistent. No clipping, overlap, missing glyphs, broken images, or ambiguous caption placement observed.
- Archive portfolio: all 112 pages render cleanly. The index on page 2 is balanced across two 15-row columns and lists 30 cases; the final entry points to page 111. Chapter dividers, project openers, dense case boards, image-led detail pages, captions, and the contact page remain within bounds. Page numbering is continuous through 112.
- Resume: the one-page layout is clean and readable. The original portrait is sharp and proportionally framed at the intended size. Dates, headings, body copy, URL, QR block, and lower-page whitespace do not collide or clip.
- QR graphics on selected page 32, archive page 112, and resume page 1 are visually sharp with intact quiet zones. Corresponding PDF URI annotations target `https://sun-yingjie-portfolio.ajhhq.chatgpt.site` (the resume annotation includes the equivalent trailing slash). The bundled Python environment lacks a QR decoder, so this review did not independently decode the raster symbols.

## Content and asset limitation

Image generation remains blocked pending user approval to change the specified sidebar tool. The original portrait and existing application media are therefore intentional interim assets. This is a known production limitation, not a PDF rendering defect.

## Conclusion

Document QA is complete for the specified final files. Confidence is high for page completeness, visual integrity, text selectability, and embedded link coverage. Confidence in the QR payload is medium because the raster symbols were visually inspected and paired with correct PDF link annotations but were not independently decoded in this environment.

Root follow-up: all three QR symbols were independently decoded with zxing-cpp 3.1.1; every payload is the exact public portfolio URL. See deliverables/qr-verification-v5.json.
