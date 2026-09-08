# HM family website

The website presents the current selected exterior, latest floor plan, interactive exterior model, saved budget estimate, room/opening schedule and design notes. Previous concepts are grouped under design history. The 3D viewer and all four appearance images can be downloaded as a standalone offline HTML file.

## Preview

Run `npm run build`, then `npm start`. Open http://localhost:56800. The build requires Node.js and no npm dependencies; the preview uses Python 3. Only an explicit list of intended website assets and notes is copied into `dist/`.

## Deploy on Vercel

Import the public `Personal-shri/HM` repository into Vercel. Use the repository root, framework preset **Other**, build command **npm run build**, and output directory **dist**. These settings are also in `vercel.json`. No environment variables are required.

This repository is public, so its committed plans, images and source files are publicly accessible. Vercel access protection only protects the deployed website; it does not restrict the public repository. This website does not implement authentication. If family-only access is required, configure deployment access protection in Vercel before sharing; available protection methods depend on the account/plan. The noindex metadata and robots.txt discourage search indexing but do not restrict access. No public deployment is performed by the local build.

## Updating

Edit the page content in website/pages/, the shared shell in website/layout.cjs, and website/style.css or website/app.js. Each main aspect has its own URL: /exterior.html, /plans.html, /explore.html, /budget.html and /library.html. The build reads the existing cost, opening and design notes from the repository. Rebuild the standalone model separately with `node outputs/model/build.cjs` if its model sources or embedded images change, then run the website build.


## Languages and practical guides

Use the header selector for English, Hindi or Marathi. The preference persists between pages. Translation catalogues are bundled; no visitor content is submitted to a translation service. The website build also embeds translation controls/catalogues in the downloadable viewer copies. Original drawings and raster-image text remain source artifacts. See website/locales/README.md for translation provenance and maintenance.

`/guides/overview.html` contains an annotated facade linking to five numbered guides with layer diagrams, quantity calculators and a purchasing-note form. Values are illustrative; supplier rates are explicitly requested where unknown. Notes stay in the page session until downloaded.

Checked: all 18 principal/document/guide routes in three languages, mobile overflow, 41 local links, calculator arithmetic and validation, translated purchasing-note downloads and iframe language persistence.

Project execution workbook: `/project.html` covers all 11 workstreams with owners, current state and completion evidence. `/comparison.html` presents two unapproved 1,500 sq ft room-area programmes separately from the saved plan. `/control.html` provides a 14-package ₹45 lakh allocation tracker, three-quote comparison and decision notes. Blank forecasts remain unknown. Storage is local to the browser/origin; JSON backups are downloads, not cloud sync. Templates are downloadable at `/downloads/CONTRACTOR-HANDOVER.md` and `/downloads/PROJECT-ROADMAP.md`.

Validation: three new pages checked at mobile width in English/Hindi/Marathi; budget sum, incomplete forecasts, payments exceeding forecast, quote differences, reload persistence and backup downloads checked. Catalogue numeric audit passed. All physical surveys, engineering, authority approvals, supplier quotations and sample approvals remain outstanding.

Completion audit: the roadmap now explicitly distinguishes available deliverables from remaining closure evidence for each of the 11 points. The list is not represented as complete. The local workbook adds 12 purchase lines and 9 proposed architectural drawing records, included in the existing browser save and backup. No order is sent and no approval is inferred from a register status. Verified row counts, saved values, status persistence, backup contents and mobile language switching.
