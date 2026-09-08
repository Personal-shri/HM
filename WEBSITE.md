# HM family website

The website presents the current selected exterior, latest floor plan, interactive exterior model, saved budget estimate, room/opening schedule and design notes. Previous concepts are grouped under design history. The 3D viewer and all four appearance images can be downloaded as a standalone offline HTML file.

## Preview

Run `npm run build`, then `npm start`. Open http://localhost:56800. The build requires Node.js and no npm dependencies; the preview uses Python 3. Only an explicit list of intended website assets and notes is copied into `dist/`.

## Deploy on Vercel

Import the public `shri-skg/HM` repository into Vercel. Use the repository root, framework preset **Other**, build command **npm run build**, and output directory **dist**. These settings are also in `vercel.json`. No environment variables are required.

This repository is public, so its committed plans, images and source files are publicly accessible. Vercel access protection only protects the deployed website; it does not restrict the public repository. This website does not implement authentication. If family-only access is required, configure deployment access protection in Vercel before sharing; available protection methods depend on the account/plan. The noindex metadata and robots.txt discourage search indexing but do not restrict access. No public deployment is performed by the local build.

## Updating

Edit website/index.html, style.css and app.js. The build reads the existing cost, opening and design notes from the repository. Rebuild the standalone model separately with `node outputs/model/build.cjs` if its model sources or embedded images change, then run the website build.
