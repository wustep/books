import { practices, sources } from './practices.mjs';
import { mark, arrow } from './art.mjs';

export const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const number = n => String(n).padStart(2, '0');
const themeLabel = { perspective: 'A fresh perspective', connection: 'More connection', action: 'A way forward' };
const route = (base, slug) => `${base}practices/${slug}/`;

function shell({ title, description, body, base = './', active = '', className = '', baseHref = '' }) {
  return `<!doctype html>
<html lang="en"><head>${baseHref ? `<base href="${escape(baseHref)}">` : ''}<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}${active === 'home' ? '' : ' · The Art of Possibility'}</title>
<meta name="description" content="${escape(description)}"><meta name="theme-color" content="#f5f3e9">
<meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:type" content="website">
<link rel="icon" href="${base}favicon.svg" type="image/svg+xml"><link rel="preload" href="${base}fonts/source-sans-3-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${base}styles.css"><script type="module" src="${base}app.js"></script></head>
<body class="${className}"><a class="skip-link" href="#main">Skip to content</a>
<header class="site-header wrap"><a class="brand" href="${base}" aria-label="The Art of Possibility — home">${mark}<span>The Art of<br>Possibility<span class="brand-period">.</span></span></a>
<nav class="main-nav" aria-label="Main navigation"><a href="${base}practices/"${active === 'practices' ? ' aria-current="page"' : ''}>The practices</a><a href="${base}about/"${active === 'about' ? ' aria-current="page"' : ''}>About the book</a><a class="notebook-link" href="${base}notebook/"${active === 'notebook' ? ' aria-current="page"' : ''}>My notebook ${arrow}</a></nav></header>
<main id="main" tabindex="-1">${body}</main>
<footer class="site-footer wrap"><div><a class="footer-brand" href="${base}">The Art of Possibility</a><p>An independent guide to the work of<br>Rosamund Stone Zander &amp; Benjamin Zander.</p></div><div class="footer-end"><a href="${base}about/#sources">Sources &amp; reading ${arrow}</a><p>Read an idea. Try it. Record what happens.</p></div></footer>
</body></html>`;
}

function practiceRows(items, base, filtered = false) {
  return `<ol class="practice-list">${items.map(p => `<li${filtered ? ` data-practice data-theme="${p.theme}" data-search="${escape(`${p.title} ${p.short} ${p.summary}`.toLowerCase())}"` : ''} value="${p.number}"><a class="practice-row" href="${route(base, p.slug)}"><span class="practice-number" aria-label="Practice ${p.number}">${number(p.number)}</span><span class="practice-row-copy"><h3>${escape(p.title)}</h3><p>${escape(p.summary)}</p><span class="practice-time">About ${p.time} minutes to try</span></span><span class="row-arrow" aria-hidden="true">↗</span></a></li>`).join('')}</ol>`;
}

export function home() {
  const base = './';
  return shell({ active: 'home', title: 'The Art of Possibility — A practical companion', description: 'Twelve practices. One real situation. A practical companion to The Art of Possibility by Rosamund Stone Zander and Benjamin Zander.', body: `
  <section class="hero wrap" aria-labelledby="hero-title">
    <div class="hero-copy"><p class="edition">The Art of Possibility / A practical companion</p>
    <h1 id="hero-title">What else<br>could be<br><span>possible?</span></h1>
    <p class="hero-lead">Start with a situation you want to change.<br> Try a different way to see it.</p>
    <p class="hero-description">Twelve practices from the book by<br>Rosamund Stone Zander &amp; Benjamin Zander.</p>
    <a class="text-link" href="practices/">Explore the practices <span aria-hidden="true">↗</span></a></div>
    <div class="frame-example" data-frame data-stage="0"><div class="experiment-heading"><span class="section-note">A small experiment</span><span aria-hidden="true">↗</span></div>
    <h2>Same facts.<br>A different next move.</h2>
    <label class="scene-picker" hidden data-enhance>Choose a situation<select id="scene"><option value="comparison">Someone else is getting ahead</option><option value="mistake">I made a mistake</option><option value="leadership">I’m waiting for permission</option></select></label>
    <p id="scene-context" class="scene-context">Someone you know is doing well.</p>
    <div class="old-frame"><span class="frame-label">The story you add</span><p id="frame-before">Their success means I’m falling behind.</p></div>
    <button class="button primary" type="button" data-reveal-frame hidden data-enhance aria-expanded="false" aria-controls="possible-frame">Try another frame <span aria-hidden="true">↓</span></button>
    <div id="possible-frame" class="possible-frame"><div class="new-frame"><span class="frame-label">Another way to see it</span><p id="frame-after">What could we learn or make together?</p></div><p class="frame-action" id="frame-action">Ask them about one thing you want to learn.</p><a id="frame-link" class="text-link" href="practices/universe-of-possibility/">Try this practice <span aria-hidden="true">↗</span></a></div>
    <p class="example-credit">An imagined situation. Original teaching, not a book excerpt.</p></div>
  </section>
  <section class="entry-paths wrap" aria-labelledby="entry-title"><div class="section-heading"><p class="section-note">Bring something real</p><h2 id="entry-title">Where are you stuck?</h2></div><div class="path-grid">
    <a href="practices/its-all-invented/"><span class="path-index">01</span><h3>I’ve already decided<br> how this ends.</h3><p>Separate what happened from the story you added.</p><span class="path-link">Try It’s All Invented ↗</span></a>
    <a href="practices/giving-an-a/"><span class="path-index">03</span><h3>I’m expecting<br> someone to fail.</h3><p>Change how you meet them. Make room for development.</p><span class="path-link">Try Giving an A ↗</span></a>
    <a href="practices/being-a-contribution/"><span class="path-index">04</span><h3>I don’t know<br> what I can offer.</h3><p>Find one useful thing you can do with what you have.</p><span class="path-link">Try Being a Contribution ↗</span></a>
  </div></section>
  <section class="practice-preview wrap" aria-labelledby="practices-title"><div class="section-heading"><div><p class="section-note">The reading index</p><h2 id="practices-title">Twelve practices.<br>Many places to begin.</h2></div><p>Read the idea. Try the exercise.<br>Keep a note of what changes.</p></div>${practiceRows(practices, base)}<a class="text-link all-practices" href="practices/">Find a practice by what you need <span aria-hidden="true">→</span></a></section>
  <section class="invitation wrap" aria-labelledby="invitation-title"><span class="invitation-symbol" aria-hidden="true">↗</span><div><p class="section-note">From reading to doing</p><h2 id="invitation-title">Take one idea into the day.</h2><p>Try it in a conversation, a meeting, or a piece of work.<br> Then write down what happened.</p><a class="text-link" href="notebook/">Open your notebook <span aria-hidden="true">↗</span></a></div></section>` });
}

export function indexPage() {
  const base = '../';
  return shell({ active: 'practices', base, title: 'The twelve practices', description: 'Original explanations and short exercises for all twelve practices from The Art of Possibility.', body: `
  <section class="index-intro wrap"><p class="section-note">The practice collection</p><h1>Twelve practices.<br><span>Choose one.</span></h1><p class="intro-prose">Each practice gives you an idea, an imagined situation, and a short exercise. Read in book order or start with the problem in front of you.</p></section>
  <section class="collection wrap" aria-label="Browse the twelve practices"><div class="collection-tools" hidden data-enhance><fieldset class="filter-group"><legend>What would help today?</legend><div class="filter-buttons">${[['all', 'All practices'], ...Object.entries(themeLabel)].map(([key, label]) => `<button class="filter-button" type="button" data-filter="${key}" aria-pressed="${key === 'all'}">${label}</button>`).join('')}</div></fieldset><label class="search-label">Find a practice<input id="practice-search" type="search" placeholder="Try “leadership” or “A”" autocomplete="off"></label></div><p id="results-count" class="results-count" role="status" hidden data-enhance>12 practices · In book order</p>
  ${practiceRows(practices, base, true)}<div class="empty-results" hidden><h2>No matching practices.</h2><p>No practices match that combination. Try another word or see the full collection.</p><button class="button secondary" type="button" id="reset-filters">Show all practices</button></div></section>
  <aside class="collection-note wrap"><p>The groupings above are this guide’s own reading paths. The twelve practices and their order come from the book.</p><a class="text-link" href="${base}about/#sources">About this guide ${arrow}</a></aside>` });
}

export function lesson(p) {
  const base = '../../';
  const next = practices[p.number % practices.length];
  const prev = practices[p.number - 2];
  return shell({ active: 'practices', base, title: p.title, description: p.summary, className: 'lesson-page', body: `
  <div class="wrap lesson-breadcrumb"><a href="../">All practices</a><span aria-hidden="true">/</span><span>Practice ${number(p.number)} of 12</span></div>
  <header class="lesson-hero wrap"><div><p class="section-note">${escape(p.title)}</p><h1>${escape(p.short)}<span class="title-dot">.</span></h1><p class="lesson-deck">${escape(p.summary)}</p><div class="lesson-meta"><span>${themeLabel[p.theme]}</span><span>About ${p.time} minutes to try</span><a href="#try">Jump to the practice <span aria-hidden="true">↓</span></a></div></div><div class="lesson-art" aria-hidden="true"><span class="art-number">${number(p.number)}</span><span class="lesson-art-label">A practice to return to</span></div></header>
  <div class="lesson-layout wrap"><aside class="lesson-sidebar"><nav aria-label="On this page"><p>In this practice</p><a href="#idea">The idea</a><a href="#everyday">In everyday life</a><a href="#try">Try it yourself</a><a href="#reflect">Your reflection</a></nav><p class="sidebar-note">An original explanation<br>inspired by practice ${p.number}.</p></aside>
  <article class="lesson-content"><section id="idea" class="lesson-section"><h2>The idea</h2><p class="idea-lead">${escape(p.idea)}</p><p>${escape(p.explanation)}</p></section>
  <section id="everyday" class="lesson-section"><h2>In everyday life</h2><p class="example-label">An imagined situation</p><p>${escape(p.scenario)}</p><div class="reframe"><div><h3>The familiar frame</h3><p>${escape(p.oldFrame)}</p></div><span class="reframe-arrow" aria-hidden="true">↓</span><div><h3>A possible shift</h3><p>${escape(p.newFrame)}</p></div></div></section>
  <section id="try" class="exercise lesson-section" data-exercise data-stage="0"><div class="exercise-heading"><h2>Try it yourself</h2><span>About ${p.time} min</span></div><p class="exercise-credit">An exercise created for this guide</p><div class="guide-tools" hidden data-enhance><button class="text-button" type="button" data-guide-toggle aria-pressed="false">Guide me one step at a time <span aria-hidden="true">→</span></button><p class="guide-status" role="status"></p></div><ol class="exercise-steps">${p.steps.map((s, index) => `<li data-step="${number(index + 1)}">${escape(s)}</li>`).join('')}</ol><p class="exercise-output"><span>Leave with</span>${escape(p.outcome)}</p><div class="guide-navigation" hidden><button class="button secondary" type="button" data-guide-back>Previous step</button><button class="button primary" type="button" data-guide-next>Next step →</button></div><details class="nuance"><summary>Keep this distinction in view <span aria-hidden="true">+</span></summary><p>${escape(p.nuance)}</p></details></section>
  <section id="reflect" class="reflection lesson-section"><h2>Choose your next move.</h2><p class="reflection-prompt">${escape(p.prompt)}</p><form data-reflection="${p.slug}" hidden data-enhance><label for="reflection-note">Your reflection</label><textarea id="reflection-note" name="reflection" rows="5" maxlength="6000" placeholder="What happened? What am I assuming? What will I try next?" aria-describedby="note-privacy"></textarea><p id="note-privacy" class="input-hint">Saved only in this browser when you choose Save. No account, no uploads. Download a copy from your notebook to keep it elsewhere.</p><div class="form-actions"><button class="button primary" type="submit">Save reflection <span aria-hidden="true">↗</span></button><a href="${base}notebook/">My notebook</a></div><p class="save-status" role="status" aria-live="polite"></p></form><noscript><p>Take this question to a notebook of your own. Browser saving is available when JavaScript is enabled.</p></noscript></section>
  <aside class="related-practice"><span>A useful companion</span><a href="${route(base, p.related)}">${escape(p.connection)} ${arrow}</a></aside></article></div>
  <nav class="lesson-pagination wrap" aria-label="Between practices">${prev ? `<a href="${route(base, prev.slug)}" rel="prev"><span>← Previous practice</span><strong>${escape(prev.title)}</strong></a>` : `<a href="../"><span>← Back to the collection</span><strong>All twelve practices</strong></a>`}<a href="${route(base, next.slug)}"${p.number < 12 ? ' rel="next"' : ''}><span>${p.number === 12 ? 'Begin again' : 'Next practice'} →</span><strong>${escape(next.title)}</strong></a></nav>` });
}

export function notebook() {
  const base = '../';
  return shell({ active: 'notebook', base, title: 'My practice notebook', description: 'A place for reflections and small next steps. Your notes are saved only in your own browser.', body: `
  <section class="notebook-intro wrap"><p class="section-note">Your practice notebook</p><h1>Keep a record<br>of <span>what changes.</span></h1><p class="intro-prose">Write down the situation and the next move you want to try. After you try it, return to the same note and record what happened.</p><p class="notebook-privacy">Notes live only in this browser. Download a copy to keep them when you switch devices or clear browser data.</p></section>
  <section class="notebook-content wrap" aria-label="Saved reflections"><div class="notebook-tools" hidden data-notebook-tools><p id="note-count" role="status"></p><div><button class="button secondary" type="button" id="export-notes">Download notes <span aria-hidden="true">↓</span></button><button class="text-button" type="button" id="clear-notes">Clear notebook</button></div></div><p id="notebook-status" role="status"></p>
  <div class="notebook-empty" data-notebook-empty><span class="empty-mark" aria-hidden="true">${mark}</span><h2>One situation.<br>One next step.</h2><p>Open a practice and save a reflection. Your words will be waiting here when you return.</p><a class="button primary" href="${route(base, 'giving-an-a')}#reflect">Start with generosity ${arrow}</a><a class="text-link" href="${base}practices/">Or find another practice →</a></div>
  <div class="saved-notes">${practices.map(p => `<article class="saved-note" data-note="${p.slug}" hidden><div class="saved-note-heading"><span class="practice-number">${number(p.number)}</span><div><h2>${escape(p.title)}</h2><time></time></div></div><p class="saved-prompt">${escape(p.prompt)}</p><p class="saved-text"></p><a class="text-link" href="${route(base, p.slug)}#reflect">Continue this reflection ${arrow}</a></article>`).join('')}</div>
  <noscript><p class="noscript-note">Enable JavaScript to read notes saved in this browser, or use the exercises with a paper notebook.</p></noscript></section>
  <dialog id="clear-dialog" aria-labelledby="clear-title" aria-describedby="clear-description"><form method="dialog"><h2 id="clear-title">Clear your notebook?</h2><p id="clear-description">This removes all reflections saved by this guide in this browser. Download your notes first if you want to keep a copy.</p><div class="form-actions"><button class="button secondary" value="cancel">Keep my notes</button><button class="button primary" value="clear">Clear all notes</button></div></form></dialog>` });
}

export function about() {
  const base = '../';
  return shell({ active: 'about', base, title: 'About the book & this guide', description: 'Meet the ideas behind The Art of Possibility, understand this independent guide, and find sources for further reading.', body: `
  <section class="about-hero wrap"><div><p class="section-note">The book behind the practices</p><h1>The book behind<br><span>the practice.</span></h1><p class="intro-prose"><cite>The Art of Possibility</cite> brings Rosamund Stone Zander’s perspective as a therapist together with Benjamin Zander’s experience as a conductor and teacher.</p><p class="about-description">Across twelve practices, they explore how our assumptions and ways of relating can open or narrow what becomes possible.</p><a class="button primary" href="https://www.benjaminzander.org/the-art-of-possibility/">Explore the authors’ book ${arrow}</a></div><figure class="book-object"><div class="book-face"><span>Rosamund Stone Zander<br>Benjamin Zander</span><div>The Art of<br>Possibility</div>${mark}<p>Transforming Professional<br>and Personal Life</p></div><figcaption>A typographic tribute, not the published cover.</figcaption></figure></section>
  <div class="about-body wrap"><section><h2>A companion for practice.</h2><div class="prose"><p>This is an independent educational guide, unaffiliated with the authors or publisher. It offers original explanations, invented everyday situations, and exercises designed for this site. The practice names and order follow the book.</p><p>The situations and inner thoughts are invented to teach the ideas. They are not quotations or events from the authors’ lives. The groupings and reflection prompts are also our own. No chapters or extended passages are reproduced.</p><p>The book’s stories and the interplay between its authors add depth that a short guide cannot carry. Read it alongside this site, or use the public resources below to continue exploring.</p></div></section>
  <section id="sources"><h2>Keep exploring.</h2><p class="source-intro">The book’s chapter order and authorship were checked against the sources below on October 2, 2026. Explanations and exercises are this guide’s interpretations.</p><ol class="source-list">${sources.map(s => `<li><a href="${escape(s.url)}"><span>${escape(s.title)}</span>${arrow}</a><p>${escape(s.note)}</p></li>`).join('')}</ol></section>
  <section class="about-privacy"><h2>A note on your notes.</h2><p>This site has no accounts or analytics. Fonts are served with the site. Saving a reflection stores it on this browser, on this device. Your hosting provider may keep ordinary access logs. Use the notebook’s download button for a portable copy; clearing browser data removes local notes.</p><a class="text-link" href="${base}notebook/">Open my notebook ${arrow}</a></section></div>` });
}

export function notFound(baseHref = '/') {
  return shell({ title: 'Page not found', description: 'Return to the Art of Possibility guide.', base: './', baseHref, body: `<section class="notebook-empty wrap"><p class="section-note">Page not found</p><h1>Page not found.</h1><p>This address does not lead to a practice. Return to the collection to find what you need.</p><a class="button primary" href="./practices/">Explore the practices ${arrow}</a></section>` });
}
