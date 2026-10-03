# Redesign record

Interface Craft was applied in vanilla HTML, CSS, and JavaScript. No React, DialKit, or visible tuning panel. The review used the skill’s six lenses in order: context, first impression, visual design, interface design, conventions, and user context. Screenshots and real browser interactions were used between implementation passes.

## Initial critique

**Context.** A book companion for a curious reader who wants to understand a recurring problem. Reading should feel deliberate, with enough support to try an idea.

**First impression.** The dark sidebar and cyan garden make this look like a learning dashboard. The opening statement is broad; the first usable example is below the fold.

**Visual design.** At 1440 px, a 244 px fixed rail and a large garden dominate. Numerous 8–12 px labels lose weight beside the 85 px headline. Teal is used for connections, decoration, navigation, and completion. Establish one instructional diagram, increase reading sizes, and assign color by meaning.

**Interface design.** Six equal cards compete with “Start exploring.” Completion marks record visits rather than help the reader reason. There is no distinct resilience lesson or place to apply the concepts. Replace the card overview with a reading route and end with a concrete worksheet.

**Conventions.** Native sliders and details are useful. The mobile menu is a separate interaction model. Retain native controls and anchors, simplify navigation, and stop asking readers to manage completion state.

**User context.** Someone arriving with a frustrating recurring problem needs a concrete entry, not a slogan. Use a backlog and carry its implications through the guide.

**Priorities.** Rebuild the reading hierarchy; teach through a causal sketch; add resilience and application; make motion explain sequence.

## Interface Craft pass 1 — structure and readability

**Implemented.** Replaced the dashboard with a masthead, contents rail, editorial opening, and seven ordered field notes. Added a backlog diagram, resilience section, and four-question field sheet. Removed progress tracking and rotating reflection prompts. Increased lesson copy to 15–16 px and retained the three deterministic models and native disclosures.

**Re-critique / context.** The guide now supports reading toward an actual decision.

**First impression.** The title and causal sketch provide a clear entry. The two columns have different roles rather than competing cards.

**Visual design.** The provisional paper-and-ink palette supports reading, but system fonts and plain rectangles still need a coherent visual finish.

**Interface design.** The whole opening loop arrives at once. Model changes are instantaneous. Reveal accumulation before feedback and acknowledge change with motion.

**Conventions.** Anchors and native controls now carry the reading route. Keep them while enhancing behavior.

**User context.** The reader can start with a problem, but the interface still asks them to interpret all connections at once.

**Next priorities.** Sequence the diagram, use physical springs, respect reduced motion, and make replay meaningful.

## Interface Craft pass 2 — storyboard and spring physics

**Implemented.** Added the 90 / 480 / 900 ms storyboard: stock and flows, returning feedback, then interpretation. One integer stage drives sequencing; replay clears pending timers. Named configuration objects define all timing, displacement, stiffness, damping, and mass. `motion.js` integrates a damped spring into Web Animations keyframes. Water changes start from the current visible level; chart traces acknowledge a new model. Reduced motion skips animation. Model simulation pauses out of view or when the document is hidden.

**Re-critique / context.** Motion now follows the explanation rather than running continuously during reading.

**First impression.** The short loop reveal draws attention to the returning cause. Replay supports studying the diagram.

**Visual design.** Movement is small and the water remains within its physical bounds. The diagram’s labels still intersect paths; resolve this during the visual pass.

**Interface design.** The worksheet still dumps four questions together. The resilience example names a reserve without testing a disturbance.

**Conventions.** Buttons remain native; reduced motion immediately presents the settled diagram. Numerical results update before their visual transitions.

**User context.** A reader can follow the causal sequence, but still needs a manageable way to describe their own problem.

**Next priorities.** Stage the field sheet, preserve notes, and let the reader compare a disturbance against two capacity choices.

**Verification.** Model and spring tests passed. Browser checks covered replay, reduced motion, rapid model updates, and seven viewport widths.

## Interface Craft pass 3 — progressive disclosure and application

**Implemented.** Added four worksheet stages plus an all-notes review, direct question selection, focus transfer, debounced local drafts, plain-text download, and print preparation. Storage failure is disclosed without losing in-memory input. Added the 8-hour capacity comparison with a 2-hour disturbance and spring transitions. Named native details groups keep the twelve leverage notes and eight traps compact. Added active section navigation and anchor focus.

**Re-critique / context.** The field guide now supports observation, experimentation, and an artifact the reader can keep.

**First impression.** The selected worksheet question has a clear focus. The capacity comparison makes the reserve’s purpose visible.

**Visual design.** Large experiment panels still resemble slabs. Their labels, captions, and typography need a shared figure language.

**Interface design.** Stage controls preserve answers and allow skipping. Printing needs to expand grouped details without closing earlier items; remove and restore grouping around print. Model assumptions should be disclosed separately from the result.

**Conventions.** Standard textareas, pressed states, details, browser storage, and downloads avoid custom interaction machinery.

**User context.** Notes stay available when storage is blocked, and export gives the reader a practical way to keep them.

**Next priorities.** Finish the typography and figure language, separate labels from paths, then revise explanatory content.

**Verification.** Browser checks covered all worksheet stages, persistence after reload, downloads, blocked storage, native no-JS disclosures, model controls, and seven viewport widths.

## Visual design pass — annotated technical notebook

**Implemented.** Committed to warm paper, dark ink, vermilion annotations, and blue for measured behavior. Added locally served Newsreader regular/italic and Public Sans with their OFL licenses. Rebuilt the opening SVG with labels outside the paths, colored feedback arrows, and a restrained drawing grid. Added ruled figures, figure numbering, typographic distinctions, active navigation marks, and a matching stock-and-loop favicon. Tuned narrow layouts and print surfaces.

**Re-critique.** The title and diagram now belong to the same editorial system. Body copy remains readable beside the larger serif headings. There are no stock photographs, ornamental illustrations, remote fonts, or continuous decorative animations. The phone deck needed shorter copy; the next pass addresses it. Screenshots were checked at desktop and phone sizes, and the interaction suite passed.

## Content pass 1 — conceptual precision

**Implemented.** Defined parts, connections, and function/purpose. Added the stock-change equation and distinguished steady levels from equal moving flows. Clarified amplification versus correction, and removed any implication that balancing means desirable. Matched loop labels to the model equations; added chart units, numerical scales, target values, and step counts. Described delayed information as one specific mechanism, not a universal prediction. Distinguished resilience from a quiet period.

**Re-critique.** Definitions and experiments now agree. Leverage and trap entries still move too quickly from example to remedy; add ways to test an explanation and consider costs.

## Content pass 2 — decisions and checks

**Implemented.** Grouped leverage points into three readable bands without changing Meadows’ order. Added original library tradeoffs and questions about access, demand signals, resources, and authority. Each trap now has an example, a possible action, and a diagnostic question. Replaced “a way out” with “try” to avoid presenting a guaranteed cure. Made the shared-studio example’s individual incentives explicit.

**Re-critique.** The notes invite investigation instead of announcing diagnoses. The reading route, model assumptions, and worksheet still contain excess wording; tighten those and clarify sources.

## Content pass 3 — usable prompts and honest attribution

**Implemented.** Shortened the opening deck; replaced broad invitation copy with concrete recurring problems. Distinguished the three live models from the capacity sketch. Moved long reservoir and delay assumptions into native disclosures. Added precise worksheet examples, units, a review date, and stopping criteria. Kept static charts aligned with the deterministic models. Added publisher and primary essay links, book credits, and an explicit distinction between paraphrased ideas and original teaching examples. No pull quotes, invented anecdotes, or page numbers.

**Final re-critique.** The reading route offers a definition, a test or reference, and a field question in each section. The worksheet can be used in stages, reviewed together, exported, or printed. Mobile navigation, blocked storage, no-JS reading, reduced motion, local assets, and print restore behavior are part of the final verification. This remains a simplified companion to the book; the models show mechanisms under stated assumptions.

## Final verification

- `npm test`: eight passing tests for conservation, balanced flows, feedback, delay, and spring settling/bounds.
- `npm run build`: passes; dev/start/build/test entry points retained.
- Optional Playwright suite against `/dist/`: models, automatic offscreen pause, replay, reduced motion, all worksheet stages, persistence, download, blocked storage, keyboard controls, print expansion/restoration, anchors, local fonts and assets, and widths 320 / 390 / 560 / 768 / 800 / 1024 / 1440. No page errors, failed asset requests, or remote runtime requests.
- Screenshots reviewed for desktop, phone, models, resilience, worksheet, and print layout.
- Changes restricted to `thinking-in-systems/` and one root README line; `art-of-possibility/` untouched.
