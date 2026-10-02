# The Art of Possibility — Design System

## Direction

A conductor’s invitation: daylight, open gestures, confident typography, and the
gold of a concert-hall acoustic shell. White provides clarity. Amber carries the
warmth; vermilion identifies actions and moments of possibility. This is distinct
from the Systems sibling’s dark teal palette and persistent sidebar.

The visual anchor is an original vector composition: twenty-four open curves and
a baton, reused at smaller scale as the lesson motif. All imagery is code-native;
there are no stock portraits, generated book covers, or remote image dependencies.
The About page’s typographic book object is explicitly labeled as a tribute.

## Color

Source of truth: `public/styles.css`, `:root`. OKLCH tokens:

| Role | Value | Use |
| --- | --- | --- |
| Canvas | `oklch(100% 0 0)` | True white background |
| Ink | `oklch(24% .02 45)` | Text, selected filters |
| Muted | `oklch(45% .018 50)` | Secondary text with AA contrast |
| Accent | `oklch(53% .19 32)` | Vermilion actions, emphasis, focus |
| Accent hover | `oklch(45% .16 32)` | Hovered primary actions |
| Gold | `oklch(87% .15 78)` | Opening teaching interaction |
| Gold light | `oklch(95% .085 85)` | Exercises, brief feedback |
| Surface | `oklch(97% 0 0)` | Quiet neutral supporting regions |
| Line | `oklch(87% .007 65)` | Decorative separators |
| Control line | `oklch(57% .018 50)` | Input borders and meaningful edges |

Impeccable palette seed: `seed-149`, honey hue 70°. The gold role stays within
the seed’s ±10° range. The strategy combines an amber teaching surface and
expressive amber art with vermilion actions on a true white canvas.

## Type

Voice: gestural, resonant, inviting. Bricolage Grotesque has the lively, slightly
unexpected proportions of a concert poster; Literata gives sustained teaching
text a distinct reading rhythm. Navigation and compact labels use the platform
sans family. Reflex choices such as Inter, Fraunces, and Instrument Serif were
rejected. Both chosen fonts are self-hosted Latin WOFF2 variable files, with OFL
licenses beside them, and `font-display: swap`.

- Display: Bricolage, weight 600; fluid headings capped at 6rem.
- Reading: Literata, weight 400; 1–1.25rem, line height 1.8–1.9.
- Interface: platform sans, 400/500/600; body at 1rem.
- Heading tracking never below −0.04em; balanced headings, pretty prose.
- Long paragraphs stay within 65–70 characters per line.

## Layout and components

- Container: 1440px maximum with fluid 20–80px gutters.
- Space: 8, 16, 24, 32, 48, and 72px foundation, with fluid section spacing.
- Home: split introduction and gesture, full-width amber experiment, open
  two-column practice list, compact invitation, and footer.
- Index: topic filters plus text search; a ruled list in book order, stacking at
  520px. Numbers identify real practice order, rather than decorative sections.
- Lessons: generous heading, compact local navigation, a reading column, one
  imagined example, a gold exercise, reflection form, and related/adjacent links.
- Notebook: calm empty state, then full-width saved reflections. No scores or
  streaks. Save, export, and destructive clear have explicit feedback.
- Buttons: minimum 44px target, restrained 5px corners, clear label plus arrow.
- Inputs: visible labels, 1px contrast-safe borders, readable placeholders.

## Motion and responsive behavior

The main SVG opens with one small rotation and scale movement. Button and arrow
hover states have short transitions. Everything remains visible before animation.
`prefers-reduced-motion` removes animation and smooth scrolling. Forced-colors
mode preserves control boundaries.

At 760px the hero stacks and lesson navigation becomes a wrapping row. At 520px,
the header becomes two rows and the practice index becomes one column. Every
lesson remains native HTML with working links and exercises without JavaScript.
Print CSS removes controls and supporting art for legible teaching pages.

## Editing and live mode

Edit `src/templates.mjs`, `src/practices.mjs`, `src/art.mjs`, and `public/styles.css`.
The build emits independent pages into `dist/`. Impeccable’s live config targets
`dist/**/*.html`, the files the browser actually loads. Re-run live injection
after a build; accepted changes belong in the source templates or stylesheet.
CSP detection found no policy to patch. Live instrumentation is not shipped.
