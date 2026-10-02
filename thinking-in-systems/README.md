# Thinking in Systems — a field guide

An independent, illustrated microsite inspired by Donella H. Meadows’ *Thinking in Systems: A Primer*, edited by Diana Wright (2008). Original explanations and examples cover stocks and flows, reinforcing and balancing feedback, delays, all twelve leverage points, eight system traps, and practices for living with systems. Source links appear in the guide.

## Open or run

Open `index.html` directly in a browser. All assets are local, with no runtime dependencies, remote fonts, analytics, or build requirement. JavaScript adds experiments and locally saved exploration progress; the text, links, and expandable notes also work without it.

For a local HTTP server, use Node.js 20 or later:

```sh
npm run dev
# http://localhost:4173
```

Set `PORT` to change the port. The development server binds to localhost.

## Build and deploy

```sh
npm test
npm run build
```

Upload the contents of `dist/` to any static host. Relative asset paths support subdirectory deployment, including GitHub Pages. No package installation is required.

For GitHub Pages, after merging the PR, choose **Settings → Pages → Deploy from a branch → main → / (root)**. The repository root is also a complete static site. This project does not merge or enable deployment automatically.

## Teaching models

- **Reservoir:** a 100-liter stock starts at 50 liters; sliders set rates in liters per simulated minute. One running second advances one minute. Drainage is limited by available water; excess spills over. The pipe label reports available outflow, while the control shows requested outflow. Run, pause, step, and reset are supported. The model pauses when hidden or scrolled out of view.
- **Feedback:** compares unrestricted 5.5% growth per step against a correction of 10% of the remaining gap to a target of 80. These are conceptual examples, not forecasts.
- **Delay:** adjusts a stock by 12% of the perceived gap to 60 each step, with readings delayed by 0–10 steps and a stock bounded to 0–100. Longer delays illustrate overshoot and oscillation.

The deterministic models are in `models.js` and tested with Node’s built-in test runner. `app.js` connects them to accessible native controls and SVG charts. `styles.css` includes mobile layouts, keyboard focus states, reduced-motion support, and print styles. Progress uses a single versioned local-storage key and falls back to in-memory state when storage is blocked.

The visual system uses OKLCH tokens for deep-ink surfaces, teal actions and connections, and cyan chart accents. Inline diagrams share those tokens; print styles switch to light surfaces and dark text. `PRODUCT.md` records the guide’s design context for Impeccable.

The guide is unaffiliated with the author’s estate or publisher and is a starting point for reading the book, not a substitute for it.
