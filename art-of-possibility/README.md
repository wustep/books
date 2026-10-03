# The Art of Possibility

An independent educational microsite for the book by Rosamund Stone Zander and
Benjamin Zander. Twelve teaching pages pair original explanations with invented
everyday examples, guided exercises with clear outputs, and a private browser notebook.
The home includes an interactive frame experiment; every practice remains readable
without JavaScript. See `CRAFT.md` for the redesign passes and critiques.

## Run locally

Requires Node.js 22 or later. The production build has no runtime dependencies.

```sh
cd art-of-possibility
npm ci
npm run dev
```

Visit `http://127.0.0.1:4174`. The dev server rebuilds on source changes; refresh
the browser to see them. Set `PORT` to change the port. `npm start` serves a fresh
build without watching.

## Build and deploy

```sh
npm run build
```

Deploy the contents of `dist/` to any static host that serves directory indexes.
The seventeen generated HTML documents include home, the practice collection,
twelve lessons, notebook, About/sources, and a 404 page. All navigation and assets
use relative URLs, supporting a root deployment or a mount such as
`/art-of-possibility/`. No SPA rewrite or application server is needed.

Configure your host to serve `404.html` with HTTP 404. For a deployment beneath a
path prefix, build with `BASE_PATH=/art-of-possibility/ npm run build`; this sets
the error page’s base URL so its assets and recovery links work at missing nested
addresses. Other pages use portable relative links. The local server adjusts the
error-page base for its configured mount. No SPA fallback is needed.

The static generator can run with `node scripts/build.mjs` without installing
test dependencies. Assets, including both fonts and their OFL licenses, are local.

## Validate

```sh
npm test
npx playwright install chromium
npm run test:browser
```

The browser suite starts its own temporary local server and uses Playwright’s
bundled Chromium. Set `BROWSER_CHANNEL=chrome` to use an installed Chrome instead.
Screenshots are written to ignored `test-results/` for visual inspection.

- Unit/build checks cover complete practice content, all local links and
  fragments, HTML landmarks, metadata, and notebook data integrity.
- Browser checks cover all sixteen content routes, automated axe WCAG A/AA
  checks, responsive widths from 320 to 1440px, combined filtering and search,
  note persistence/export/clear, all twelve guided exercises, motion cancellation,
  keyboard access, reduced motion, no-JavaScript
  reading, storage failures, and deployment beneath a path prefix.
- Automated accessibility checks supplement visual and keyboard inspection;
  they are not a claim of full WCAG certification.

## Source map

| Path | Purpose |
| --- | --- |
| `src/practices.mjs` | Original teaching copy, canonical practice names, source links |
| `src/templates.mjs` | Semantic page templates and relative navigation |
| `src/art.mjs` | Original open-frame identity mark |
| `public/styles.css` | Design tokens, layouts, responsive/print/motion states |
| `public/app.js` | Guided practice, filtering, and notebook interactions |
| `public/motion.js` | Storyboard, stage sequencing, sampled physical springs |
| `public/notebook-state.js` | Validated, versioned browser storage and text export |
| `scripts/` | Static generator and development server |
| `tests/` | Content/storage tests and browser smoke/a11y suite |
| `PRODUCT.md`, `DESIGN.md` | Product intent and design decisions |
| `CRAFT.md` | Pass-by-pass redesign critique and validation record |

## Content and privacy

The guide is unaffiliated with the authors or publisher. The practice names
identify the book’s chapters; all teaching explanations, imagined dialogue,
exercises, and prompts are original. Public sources are linked on the About page.
No book PDFs or extended passages are included.

Notes are saved on explicit submission in localStorage under
`art-of-possibility:notebook:v1`. No accounts, analytics, cookies, or note uploads
are added by the site. Saving can fail if storage is unavailable or full; the
form keeps the text visible and explains how to preserve it. A plain-text export
provides a portable copy. Shared browsers share the same notes. Hosting providers
may retain their own access logs.

All source, assets, generated files, and project tooling stay within this
directory. The Thinking in Systems site is independent.
