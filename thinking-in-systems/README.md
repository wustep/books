# Thinking in Systems — a field guide

An independent companion to Donella H. Meadows’ *Thinking in Systems: A Primer*, edited by Diana Wright (2008). Seven field notes cover stocks and flows, feedback, delays, resilience, leverage points, system traps, and application. The explanations, backlog diagram, library examples, and capacity sketch are original teaching material. Primary essays and the publisher are linked in the guide. No quotations or page-number claims.

## Run and ship

With Node.js 20 or later, from this directory:

```sh
npm run dev
# http://127.0.0.1:4173
npm test
npm run build
```

`npm start` also serves the site. Set `PORT` for a different port or `SITE_DIR=dist` to serve the build. Upload `dist/` to a static host. Relative asset paths support subdirectory hosting. You can also open `index.html` directly. No package installation or runtime network access is required.

## Reading and interaction

- **Reservoir:** begins at 50 L, with a 100 L capacity. Adjustable rates are L/min; one click advances one minute, and running advances one minute per second. Arrival precedes drainage in each step. Unavailable water limits drainage; excess spills over. Run pauses when hidden or offscreen.
- **Feedback:** compares growth of 5.5% per step with a correction of 10% of the gap to 80. Each begins at 10 and runs for 40 steps. The loop labels describe the equations, not a real forecasting model.
- **Delay:** begins at 20; each step adjusts by 12% of the perceived gap to 60. Readings can be delayed by 0–10 steps; the stock is bounded to 0–100. This is a simplified controller.
- **Resilience sketch:** compares 8 planned hours with 6 planned hours plus a 2-hour reserve against the same 8-hour capacity. An optional 2-hour disturbance shows the tradeoff. It is not a staffing forecast.
- **Field notes:** four questions, then an all-notes review. Drafts use `thinking-in-systems:field-notes:v1` in local storage. Nothing is transmitted. When storage is blocked, notes remain available for the visit and can be downloaded. Print generates readable paragraphs so long notes are not clipped by textareas.

Without JavaScript, all lessons, the reading route, native reference disclosures, and four worksheet inputs remain available. Model controls are disabled. Reduced motion presents settled diagrams and model states without transitions. The site supports keyboard focus and light print layouts.

## Craft and verification

[CRAFT.md](CRAFT.md) records the initial critique, three Interface Craft implementation passes, the visual pass, and three content passes. `app.js` contains the animation storyboards and named timing/configuration values. `motion.js` samples physical damped springs; the water spring preserves tank bounds.

`npm test` runs deterministic model and spring tests with Node’s built-in runner. An optional Playwright integration check covers responsive layouts, real controls, worksheet persistence/export, blocked storage, no-JS reading, reduced motion, print, and asset/anchor integrity:

```sh
node tests/browser-check.mjs --url=http://127.0.0.1:4173
# Requires Playwright installed separately; --module=/absolute/path/to/index.mjs is supported.
```

Source Serif 4 and Public Sans are served from `assets/fonts/`, with their SIL Open Font License files. Diagrams and the favicon are local SVG. No analytics, third-party scripts, or visible debug tools are included.
