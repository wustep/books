import { STORAGE_KEY, readNotebook, saveNote, exportNotebook } from './notebook-state.js';
import { resetFrame, springIn } from './motion.js';
import { entries } from './practice-index.js';

const slugs = entries.map(p => p.slug);
document.querySelectorAll('[data-enhance]').forEach(element => { element.hidden = false; });

const scenes = {
  comparison: { context: 'Someone you know is doing well.', label: 'Through comparison', before: 'Their success means I’m falling behind.', after: 'What could we learn or make together?', slug: 'universe-of-possibility' },
  mistake: { context: 'You stumble during a presentation.', label: 'Through self-judgment', before: 'One mistake, and I’ve ruined the whole thing.', after: 'I can be human and still have something to offer.', slug: 'rule-number-six' },
  leadership: { context: 'A meeting is stuck. You are the newest person there.', label: 'Through hierarchy', before: 'It isn’t my place to say anything.', after: 'What question could help everyone move forward?', slug: 'leading-from-any-chair' }
};
document.querySelector('#scene')?.addEventListener('change', event => {
  const scene = scenes[event.target.value];
  if (!scene) return;
  resetFrame();
  document.querySelector('#scene-context').textContent = scene.context;
  document.querySelector('.old-frame .frame-label').textContent = 'The story you add';
  document.querySelector('#frame-before').textContent = scene.before;
  document.querySelector('#frame-after').textContent = scene.after;
  document.querySelector('#frame-action').textContent = { comparison: 'Ask them about one thing you want to learn.', mistake: 'Correct the mistake, then return to what you were saying.', leadership: 'Ask the group what decision it needs to make.' }[event.target.value];
  springIn(document.querySelector('.old-frame'));
  document.querySelector('#frame-link').href = `practices/${scene.slug}/`;
});

const search = document.querySelector('#practice-search');
if (search) {
  const rows = [...document.querySelectorAll('[data-practice]')];
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const initial = new URL(location.href).searchParams;
  let filter = buttons.some(b => b.dataset.filter === initial.get('theme')) ? initial.get('theme') : 'all';
  search.value = initial.get('q') || '';
  function applyFilters(updateUrl = true) {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const row of rows) {
      row.hidden = !((filter === 'all' || row.dataset.theme === filter) && row.dataset.search.includes(query));
      if (!row.hidden) count++;
    }
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
    document.querySelector('#results-count').textContent = `${count} ${count === 1 ? 'practice' : 'practices'}${count === 12 ? ' · In book order' : ' found'}`;
    document.querySelector('.empty-results').hidden = count !== 0;
    if (updateUrl) {
      const url = new URL(location.href);
      filter === 'all' ? url.searchParams.delete('theme') : url.searchParams.set('theme', filter);
      query ? url.searchParams.set('q', search.value.trim()) : url.searchParams.delete('q');
      history.replaceState(null, '', url);
    }
  }
  buttons.forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; applyFilters(); }));
  search.addEventListener('input', () => applyFilters());
  document.querySelector('#reset-filters').addEventListener('click', () => { filter = 'all'; search.value = ''; applyFilters(); search.focus(); });
  addEventListener('popstate', () => {
    const params = new URL(location.href).searchParams;
    filter = buttons.some(b => b.dataset.filter === params.get('theme')) ? params.get('theme') : 'all';
    search.value = params.get('q') || '';
    applyFilters(false);
  });
  applyFilters(false);
}

function getStorage() {
  try { return window.localStorage; }
  catch { return { getItem() { throw new Error('Storage unavailable'); }, setItem() { throw new Error('Storage unavailable'); }, removeItem() { throw new Error('Storage unavailable'); } }; }
}
const storage = getStorage();
const form = document.querySelector('[data-reflection]');
if (form) {
  const slug = form.dataset.reflection;
  const input = form.querySelector('textarea');
  const status = form.querySelector('.save-status');
  const initial = readNotebook(storage, slugs);
  let savedText = initial.notes[slug]?.text || '';
  input.value = savedText;
  if (initial.error) status.textContent = initial.error;
  else if (savedText) status.textContent = 'Your saved reflection is ready to continue.';
  input.addEventListener('input', () => {
    delete status.dataset.saved;
    status.textContent = input.value !== savedText ? 'Unsaved changes. Choose Save reflection to keep them.' : '';
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      saveNote(storage, slugs, slug, input.value);
      savedText = input.value.trim();
      input.value = savedText;
      status.textContent = 'Saved in this browser. Try your next step, then return to record what happened.';
      status.dataset.saved = 'true';
      springIn(status);
    } catch (error) {
      status.textContent = input.value.trim() ? 'Could not save this reflection. Copy your words somewhere safe; browser storage may be full or unavailable.' : error.message;
    }
  });
  addEventListener('beforeunload', event => {
    if (input.value !== savedText) { event.preventDefault(); event.returnValue = ''; }
  });
}

const notebook = document.querySelector('.saved-notes');
if (notebook) {
  const status = document.querySelector('#notebook-status');
  function renderNotebook() {
    const result = readNotebook(storage, slugs);
    const count = Object.keys(result.notes).length;
    if (result.error) status.textContent = result.error;
    document.querySelector('[data-notebook-empty]').hidden = count > 0;
    document.querySelector('[data-notebook-tools]').hidden = count === 0;
    document.querySelector('#note-count').textContent = `${count} saved ${count === 1 ? 'reflection' : 'reflections'}`;
    for (const article of notebook.querySelectorAll('[data-note]')) {
      const note = result.notes[article.dataset.note];
      article.hidden = !note;
      if (!note) continue;
      article.querySelector('.saved-text').textContent = note.text;
      const time = article.querySelector('time');
      time.dateTime = note.updated;
      time.textContent = `Saved ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(note.updated))}`;
    }
    return result.notes;
  }
  renderNotebook();
  addEventListener('storage', event => { if (event.key === STORAGE_KEY || event.key === null) renderNotebook(); });
  document.querySelector('#export-notes').addEventListener('click', () => {
    const notes = readNotebook(storage, slugs);
    if (notes.error || !Object.keys(notes.notes).length) { status.textContent = notes.error || 'There are no saved notes to download.'; return; }
    const url = URL.createObjectURL(new Blob([exportNotebook(notes.notes, entries)], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-possibility-notebook.txt';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Your notebook download is ready.';
  });
  const dialog = document.querySelector('#clear-dialog');
  document.querySelector('#clear-notes').addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('close', () => {
    if (dialog.returnValue !== 'clear') return;
    try {
      storage.removeItem(STORAGE_KEY);
      status.textContent = 'Your notebook has been cleared.';
      renderNotebook();
      document.querySelector('[data-notebook-empty] a').focus();
    } catch { status.textContent = 'Could not clear this notebook. Browser storage is unavailable.'; }
  });
}

/* EXERCISE STORYBOARD
 * Stage 0: all instructions, for reading or printing.
 * Stage 1–3: one instruction, chosen by the reader; spring y 10 → 0.
 * The last Next action moves to the reflection. Nothing advances on a timer.
 */
const exercise = document.querySelector('[data-exercise]');
if (exercise) {
  const steps = [...exercise.querySelectorAll('.exercise-steps li')];
  const toggle = exercise.querySelector('[data-guide-toggle]');
  const navigation = exercise.querySelector('.guide-navigation');
  const previous = exercise.querySelector('[data-guide-back]');
  const next = exercise.querySelector('[data-guide-next]');
  const status = exercise.querySelector('.guide-status');
  let stage = 0;
  function render() {
    exercise.dataset.stage = String(stage);
    steps.forEach((step, index) => {
      step.hidden = stage > 0 && index !== stage - 1;
    });
    navigation.hidden = stage === 0;
    previous.disabled = stage === 1;
    if (previous.disabled && document.activeElement === previous) next.focus();
    toggle.setAttribute('aria-pressed', String(stage > 0));
    toggle.textContent = stage === 0 ? 'Guide me one step at a time →' : 'Show all steps';
    status.textContent = stage === 0 ? '' : `Step ${stage} of ${steps.length}. Take your time.`;
    next.textContent = stage === steps.length ? 'Go to reflection ↓' : 'Next step →';
    if (stage > 0) springIn(steps[stage - 1]);
  }
  toggle.addEventListener('click', () => { stage = stage === 0 ? 1 : 0; render(); });
  previous.addEventListener('click', () => { stage = Math.max(1, stage - 1); render(); });
  next.addEventListener('click', () => {
    if (stage < steps.length) { stage++; render(); }
    else { location.hash = 'reflect'; document.querySelector('#reflection-note').focus({ preventScroll: true }); }
  });
}

const sectionNav = document.querySelector('.lesson-sidebar nav');
if (sectionNav && 'IntersectionObserver' in window) {
  const links = [...sectionNav.querySelectorAll('a')];
  const observer = new IntersectionObserver(records => {
    const current = records.find(record => record.isIntersecting);
    if (!current) return;
    links.forEach(link => {
      if (link.hash === `#${current.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-10% 0px -60% 0px' });
  document.querySelectorAll('.lesson-section').forEach(section => observer.observe(section));
  addEventListener('pagehide', () => observer.disconnect());
}
