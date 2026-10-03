# Redesign record

## Baseline critique

### Context
An independent book companion for a reader with a real conversation, setback,
or piece of work in mind. The reader needs a useful next move, not motivation.

### First impressions
The 1280px screenshot gives an orange abstract gesture almost half of the hero.
The slogan and two introductory paragraphs postpone the actual teaching.

### Visual design
The white, red, and yellow composition feels promotional. Six featured lessons
receive equal weight. The decorative gesture repeats on every lesson without
adding information. Give the situation and exercise that visual weight instead.

### Interface design
The homepage's strongest teaching tool sits below a 798px hero. Both frames are
shown immediately, so the reader never experiences the act of reconsidering.
Three exercise instructions are displayed at once, with no help carrying one out.

### Consistency and conventions
Real HTML routes, native details, safe notebook storage, and relative links work.
Keep them. Replace the uniform promotional titles and repetitive illustration.

### User context
Someone who feels stuck needs a manageable invitation. Let them choose a familiar
situation, reconsider it, and take a small action before browsing twelve chapters.

### Top opportunities
1. Put a concrete frame experiment in the hero.
2. Give reading and trying distinct hierarchy.
3. Reveal the alternate frame on request.
4. Guide one exercise step at a time without hiding the static instructions.
5. Use motion to show a change of attention, with reduced-motion support.

## Interface Craft pass 1 — entry point and hierarchy
Replaced the promotional home with a situation-led introduction. Moved the frame
experiment above the fold, added three problem-based entry paths, and exposed all
twelve practices in book order. Removed the repeated decorative lesson gesture.

### Re-critique
Context: a first-time reader deciding where to begin. First impression: the demo
now earns the hero space. Visual: the old type and color system still pulls toward
advertising. Interface: the alternate frame needs a deliberate reveal and the
scene change needs feedback. Conventions: preserve native select and links.
User context: give control over the reveal rather than making the reader wait.
Next: a stage-driven sequence and actual spring motion.

## Interface Craft pass 2 — deliberate disclosure and spring motion
Added a vanilla animation module with an ASCII storyboard, named timing and
visual configurations, integer stages, and sampled damped-spring physics. The
alternate interpretation opens on request; its action follows 160ms later.
Scene changes cancel the prior sequence. Reduced motion skips all movement and
waits. With JavaScript disabled both frames remain readable.

### Re-critique
Context: a reader testing an interpretation. First impression: the reveal now
creates a useful pause. Visual: the answer has distinct weight, but the exercise
pages still look like long articles. Interface: three steps have no active focus,
and saving a note gives only a generic status. Conventions: the reveal uses a
button with an expanded state; focus remains on the control. User context: let
readers work one instruction at a time and return to earlier steps freely.
Next: an optional guided mode, explicit progress, and stronger saving feedback.

## Interface Craft pass 3 — guided practice and feedback
Added optional guided exercise mode: one integer stage controls the active
instruction, progress text, back/next controls, and return to the full list.
The final action goes to the reflection. Instructions remain readable without
JavaScript and all three print even when guided mode is active. Added a reading
position indicator and a distinct save acknowledgement with a next action.

### Re-critique
Context: a reader actively trying a practice. First impression: the exercise now
has a usable pace. Visual: giant repeated sans headlines still crowd the quieter
teaching; the generic gray experiment box has no character. Interface: overview
and guided mode are reversible, with no timed advancement. Conventions: native
controls, stable focus, explicit saving, and live progress follow web patterns.
User context: no streaks, score, or demand to complete all twelve.
Next: commit to a single editorial visual language across every route.

## Visual design pass — an editorial practice companion
Replaced the entire stylesheet. Cream paper, forest ink, and citron accents share
one role each. Literata supplies large, quiet headlines and reading text;
Bricolage supplies controls; small monospaced labels carry navigational metadata.
Created an open-frame identity mark. Removed the decorative conductor gesture.
Three entry paths share a dark field. The collection becomes a ruled index;
lessons use large chapter numerals, readable measures, and a distinct exercise.
Local fonts, responsive layouts, print, focus, and forced-color styles remain.

### Re-critique
The serif headline now dominates the home without an unrelated illustration.
The experiment is a working example beside it. Dense collection rows have a
separate title, explanation, and time on desktop, then stack on phones. The
reading measure is limited to 62 characters. Remaining concern: vague language
in the older copy and exercises that sometimes ask readers to imagine too much.

## Content pass 1 — explain the differences
Rewrote every summary, central idea, and explanation. Each practice now describes
a distinct move: evidence versus interpretation; creation versus ranking;
development instead of fixed verdicts; contribution; influence; self-importance;
acceptance; attention; invitation; conditions; repeatable agreements; a shared
account. Rewrote collection, notebook, and About introductions. Removed decorative
quotation marks from invented inner thoughts. Checked authors and chapter order
against the authors' public book page and Google Books' table of contents.

### Re-critique
The concepts are now concrete, but several old steps still ask for a broad
intention instead of a visible action. Giving an A needs a more vivid picture of
development; Being the Board needs a changeable condition, not self-blame.
Next: rewrite all exercises, give them a clear output, and tighten boundaries.

## Content pass 2 — exercises with an output
Rewrote all thirty-six exercise steps. Added a Leave with line to every practice
and replaced all reflection prompts with questions that produce a plan or record
an outcome. Giving an A now uses an original future-note exercise with observable
actions; contribution fits actual capacity; leadership names interventions;
Being the Board identifies a changeable surrounding condition; frameworks end
in an agreement and review; the WE story explicitly asks others to revise it.
Exercise times are estimates. Notes explain how to keep a portable copy.

### Re-critique
The exercise can be completed with a real situation and a few written sentences.
The output makes the end point clear without implying mastery. Each limit stays
close to its practice: evidence, standards, consent, power, safety, or boundaries.
The next check is reading the guide as a whole for repeated slogans, invented
attributions, overly broad claims, and unexplained terms.

## Content pass 3 — whole-site editorial and attribution check
Read across all twelve lessons and the supporting routes. Replaced the remaining
footer slogan and poetic error state with direct language. Made the source-review
date precise and described interpretations as interpretations. Removed quotation
marks from homepage inner thoughts too. Kept invented situations clearly labeled,
all practice-specific distinctions, both authors' names, and the independent
status of this guide. No invented page numbers, anecdotes, or attributed quotes.

### Final critique
The home starts with a choice and a working example. The index supports browsing
without demanding an order. Lessons distinguish understanding, trying, and
recording. Notes are explicitly local and portable via download. The first axe
run caught a chapter numeral rendered too faintly; its contrast was raised.
Remaining validation: inspect final desktop/mobile views, exercise every guided
mode, audit all routes, and verify static build and mount-path behavior.

## Validation completed

- `npm test`: 9 passing checks for content, routes, fragments, document structure,
  local assets, storage integrity, and export.
- `npm run build`: 17 static documents generated successfully.
- All 16 content routes passed axe A/AA checks, plus the expanded frame and guided
  exercise states. No console errors or failed assets.
- Reflow passed at 320, 390, 768, 1024, and 1440px and with text enlarged to 200%.
  Fixed a chapter numeral and cover illustration that overflowed at enlarged text.
- All twelve guided modes passed first/next/back/last, overview recovery, and
  keyboard focus checks. Fixed focus when Back becomes disabled on the first step.
- Ordinary springs settled; scene resets canceled prior sequences; reduced
  motion skipped movement. No-JavaScript reading retained both example frames
  and all exercise instructions.
- Notebook validation, persistence, safe text rendering, export, cancel/clear,
  and blocked-storage recovery passed. Storage format remains version one.
- Subdirectory hosting, nested 404 recovery, and HTTP method behavior passed.
- Inspected desktop/mobile screenshots and final expanded/guided views. Fixed
  missing word spaces when line breaks collapse on mobile. Final visual review
  caught a guided counter beginning at 00; explicit data-driven step labels now
  preserve 01–03 in every mode. Clipped the unfocused skip link so it also stays
  hidden in full-page screenshots taken after scrolling.
- Only `art-of-possibility/` changed.

Automated axe checks supplement visual and keyboard review; they do not claim a
complete accessibility certification. Future source verification is manual.
