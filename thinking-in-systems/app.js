/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — the opening causal sketch
 *
 *    0ms   wait for the figure to enter the viewport
 *   90ms   stock + flows appear, y 12 → 0 (stage 1)
 *  480ms   feedback returns, y 12 → 0 (stage 2)
 *  900ms   caption settles, y 12 → 0 (stage 3)
 *
 * Replay resets one integer stage and clears its timers.
 * Model changes: commit numbers first, then spring the water
 * level or trace the new chart. Reduced motion skips all motion.
 * ───────────────────────────────────────────────────────── */
(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const models = window.SystemsModels;
  $$('.experiment button, .experiment input').forEach((control) => { control.disabled = false; });
  const TIMING = {
    showStock:    90,  // establish the accumulation and its two flows
    showFeedback: 480, // reveal the returning consequence
    showCaption:  900, // interpret the completed loop
    modelMinute:  1000 // one simulated minute per running second
  };
  const ENTRANCE = {
    offsetY: 12, // gentle displacement, in pixels
    spring: { stiffness: 280, damping: 26, mass: 1 }, // short, small overshoot
    stages: [
      { selector: '.diagram-base', at: TIMING.showStock },
      { selector: '.diagram-loop', at: TIMING.showFeedback },
      { selector: 'figcaption', at: TIMING.showCaption }
    ]
  };
  const WATER = {
    spring: { stiffness: 170, damping: 25, mass: 1 } // near-critical damping prevents sloshing past capacity
  };
  const TRACE = {
    spring: { stiffness: 240, damping: 28, mass: 1 } // settle quickly without hiding chart labels
  };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Map();
  const scene = $('#opening-diagram');
  let stage = 0;
  let sceneTimers = [];

  function springTo(element, config, frame) {
    const previous = animations.get(element);
    if (previous) previous.cancel();
    animations.delete(element);
    const { samples, duration } = window.SystemsMotion.springSamples(config.spring);
    if (reducedMotion.matches || !element.animate) {
      Object.assign(element.style, frame(1));
      return;
    }
    const animation = element.animate(samples.map(frame), { duration, fill: 'both' });
    animations.set(element, animation);
    animation.onfinish = () => {
      if (animations.get(element) !== animation) return;
      Object.assign(element.style, frame(1));
      animation.cancel();
      animations.delete(element);
    };
  }
  function setStage(next) {
    const previousStage = stage;
    stage = next;
    scene.dataset.stage = String(stage);
    ENTRANCE.stages.forEach((item, index) => {
      if (!(stage >= index + 1 && previousStage < index + 1)) return;
      springTo(scene.querySelector(item.selector), ENTRANCE, (position) => ({
        opacity: Math.max(0, Math.min(1, position)),
        transform: `translateY(${ENTRANCE.offsetY * (1 - position)}px)`
      }));
    });
  }
  function replayScene() {
    sceneTimers.forEach(clearTimeout);
    ENTRANCE.stages.forEach((item) => {
      const element = scene.querySelector(item.selector);
      animations.get(element)?.cancel();
      animations.delete(element);
      element.style.opacity = reducedMotion.matches ? '1' : '0';
    });
    stage = 0;
    scene.dataset.stage = String(stage);
    if (reducedMotion.matches) {
      stage = ENTRANCE.stages.length;
      scene.dataset.stage = String(stage);
      return;
    }
    sceneTimers = ENTRANCE.stages.map((item, index) => setTimeout(() => setStage(index + 1), item.at));
  }
  $('#diagram-replay').addEventListener('click', replayScene);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      replayScene();
      observer.disconnect();
    });
    observer.observe(scene);
  }
  reducedMotion.addEventListener('change', () => {
    animations.forEach((animation) => animation.finish());
    replayScene();
  });
  window.addEventListener('pagehide', () => {
    sceneTimers.forEach(clearTimeout);
    animations.forEach((animation) => animation.cancel());
    pauseReservoir();
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) replayScene();
  });
  function traceChart(path) {
    const length = path.getTotalLength();
    springTo(path, TRACE, (position) => ({
      strokeDasharray: String(length),
      strokeDashoffset: String(length * (1 - Math.max(0, Math.min(1, position))))
    }));
  }

  let stock = 50;
  let elapsed = 0;
  let reservoirTimer = null;
  const inflow = $('#inflow');
  const outflow = $('#outflow');
  const runButton = $('#reservoir-toggle');

  function renderReservoir() {
    const entering = Number(inflow.value);
    const requested = Number(outflow.value);
    const next = models.reservoir({ stock, inflow: entering, outflow: requested });
    $('#inflow-display').textContent = entering;
    $('#outflow-display').textContent = next.drained;
    $('#inflow-output').textContent = `${entering} L/min`;
    $('#outflow-output').textContent = `${requested} L/min`;
    inflow.setAttribute('aria-valuetext', `${entering} liters per minute`);
    outflow.setAttribute('aria-valuetext', `${requested} liters per minute requested`);
    $('#stock-value').textContent = stock;
    const water = $('#tank-water');
    const currentHeight = parseFloat(getComputedStyle(water).height) / water.parentElement.clientHeight * 100;
    springTo(water, WATER, (position) => ({ height: `${currentHeight + (stock - currentHeight) * position}%` }));
    $('#reservoir-time').textContent = elapsed;
    const delta = next.stock - stock;
    let message;
    if (next.overflow > 0) {
      message = stock === 100
        ? `The reservoir is full. ${next.overflow} L/min spills over.`
        : `The reservoir will fill next minute, spilling ${next.overflow} L.`;
    } else if (next.drained < requested) {
      message = `Not enough water: ${next.drained} L can leave next minute, below the requested ${requested} L.`;
    } else if (delta === 0) {
      message = 'The level is steady: inflow and outflow are balanced.';
    } else {
      message = `The reservoir is ${delta > 0 ? 'filling' : 'draining'} at ${Math.abs(delta)} L/min.`;
    }
    if ($('#reservoir-status').textContent !== message) $('#reservoir-status').textContent = message;
  }
  function pauseReservoir() {
    window.clearInterval(reservoirTimer);
    reservoirTimer = null;
    runButton.innerHTML = 'Run model <span aria-hidden="true">▶</span>';
    runButton.setAttribute('aria-pressed', 'false');
  }
  function stepReservoir() {
    stock = models.reservoir({ stock, inflow: Number(inflow.value), outflow: Number(outflow.value) }).stock;
    elapsed += 1;
    renderReservoir();
  }
  runButton.setAttribute('aria-pressed', 'false');
  runButton.addEventListener('click', () => {
    if (reservoirTimer !== null) return pauseReservoir();
    reservoirTimer = window.setInterval(stepReservoir, TIMING.modelMinute);
    runButton.innerHTML = 'Pause model <span aria-hidden="true">Ⅱ</span>';
    runButton.setAttribute('aria-pressed', 'true');
  });
  $('#reservoir-step').addEventListener('click', () => {
    pauseReservoir();
    stepReservoir();
  });
  $('#reservoir-reset').addEventListener('click', () => {
    pauseReservoir();
    stock = 50;
    elapsed = 0;
    inflow.value = 6;
    outflow.value = 4;
    renderReservoir();
  });
  [inflow, outflow].forEach((input) => input.addEventListener('input', renderReservoir));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseReservoir();
  });
  // No background simulation when the reader moves on to another concept.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) pauseReservoir();
    }).observe($('.reservoir-experiment'));
  }
  renderReservoir();

  function chartPath(points) {
    return points.map((value, index) => `${index ? 'L' : 'M'}${(45 + index / (points.length - 1) * 375).toFixed(2)} ${(200 - value * 1.7).toFixed(2)}`).join(' ');
  }
  function setFeedback(kind) {
    const reinforcing = kind === 'reinforcing';
    $$('[data-feedback]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.feedback === kind)));
    $('#feedback-path').setAttribute('d', chartPath(models.feedback(kind)));
    traceChart($('#feedback-path'));
    ['#feedback-target', '#target-label'].forEach((selector) => {
      if (reinforcing) $(selector).setAttribute('hidden', '');
      else $(selector).removeAttribute('hidden');
    });
    $('#loop-letter').textContent = reinforcing ? 'R' : 'B';
    $('#loop-top').textContent = reinforcing ? 'Stock size' : 'Gap to 80';
    $('#loop-bottom').textContent = reinforcing ? 'Addition per step' : '10% gap correction';
    $('#loop-caption').textContent = reinforcing ? 'More stock → larger addition → more stock.' : 'Smaller gap → smaller correction.';
    $('#feedback-description').textContent = reinforcing
      ? 'Illustrative model: a stock grows by 5.5% of its current size each step, with no resource limit.'
      : 'Illustrative model: each step closes 10% of the gap between the current stock and a target of 80.';
    $('#feedback-chart-title').textContent = reinforcing
      ? 'Reinforcing growth: a stock increases faster as it grows'
      : 'Balancing feedback: a stock approaches a target of 80';
  }
  $$('[data-feedback]').forEach((button) => button.addEventListener('click', () => setFeedback(button.dataset.feedback)));
  setFeedback('reinforcing');

  function renderDelay() {
    const delay = Number($('#delay').value);
    $('#delay-output').textContent = `${delay} ${delay === 1 ? 'step' : 'steps'}`;
    $('#delay').setAttribute('aria-valuetext', `${delay} ${delay === 1 ? 'step' : 'steps'} of delay`);
    const points = models.delayedAdjustment(delay);
    const overshoot = Math.max(...points) > 60.1;
    $('#delay-path').setAttribute('d', chartPath(points));
    traceChart($('#delay-path'));
    $('#delay-status').textContent = overshoot
      ? 'Older information makes the controller correct too far. In this model, the stock overshoots and oscillates around the target.'
      : delay === 0
        ? 'Current information helps this controller approach its target smoothly.'
        : 'This short delay still allows a smooth approach. Increase the delay to see overshoot.';
    $('#delay-chart-title').textContent = `${delay}-step feedback delay: the stock ${overshoot ? 'overshoots and oscillates around' : 'approaches'} the target of 60`;
  }
  $('#delay').addEventListener('input', renderDelay);
  renderDelay();


  /* WORKSHEET STORYBOARD
   *    0ms   reader chooses a question; stage 0..3 selects one field
   *    0ms   commit visibility + focus; selected field springs y 12 → 0
   * stage 4  review all four notes; preserve every input
   *  350ms   after the last keystroke, save a local draft
   */
  const SHEET = {
    key: 'thinking-in-systems:field-notes:v1', // independent of old completion tracking
    saveAfterTyping: 350, // debounce storage and live-region feedback
    labels: ['Pattern', 'Stock', 'Connections', 'Test'], // one label per question
    entrance: ENTRANCE
  };
  document.documentElement.classList.add('is-enhanced');
  const sheet = $('#field-sheet');
  const steps = $$('.sheet-step');
  const fields = steps.map((step) => step.querySelector('textarea'));
  let sheetStage = 0;
  let saveTimer;
  let storageAvailable = true;
  try {
    const saved = JSON.parse(localStorage.getItem(SHEET.key) || '{}');
    fields.forEach((field) => {
      if (saved && typeof saved[field.name] === 'string') field.value = saved[field.name];
    });
    localStorage.setItem(SHEET.key, JSON.stringify(Object.fromEntries(fields.map((field) => [field.name, field.value]))));
  } catch { storageAvailable = false; }
  const sheetNav = $('#sheet-nav');
  SHEET.labels.forEach((label, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${index + 1} / ${label}`;
    button.addEventListener('click', () => showSheetStage(index, true));
    sheetNav.append(button);
  });
  function showSheetStage(next, moveFocus = false) {
    sheetStage = next;
    const reviewing = sheetStage >= steps.length;
    sheet.dataset.stage = String(sheetStage);
    steps.forEach((step, index) => {
      step.hidden = !reviewing && index !== sheetStage;
      if (!step.hidden && !reviewing) springTo(step, SHEET.entrance, (position) => ({
        opacity: Math.max(0, Math.min(1, position)),
        transform: `translateY(${SHEET.entrance.offsetY * (1 - position)}px)`
      }));
    });
    [...sheetNav.children].forEach((button, index) => {
      if (index === sheetStage) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    $('#sheet-count').textContent = reviewing ? 'All four notes' : `${sheetStage + 1} of ${steps.length}`;
    $('#sheet-back').disabled = sheetStage === 0;
    $('#sheet-next').textContent = reviewing ? 'Edit first note →' : sheetStage === steps.length - 1 ? 'Review all notes →' : 'Next question →';
    if (moveFocus) fields[reviewing ? 0 : sheetStage].focus({ preventScroll: true });
  }
  function saveSheet() {
    clearTimeout(saveTimer);
    const draft = Object.fromEntries(fields.map((field) => [field.name, field.value]));
    try {
      localStorage.setItem(SHEET.key, JSON.stringify(draft));
      storageAvailable = true;
    } catch { storageAvailable = false; }
    $('#sheet-status').textContent = storageAvailable
      ? 'Saved in this browser. Notes stay on this device.'
      : 'Available for this visit. Browser storage is blocked; download your notes to keep them.';
  }
  fields.forEach((field) => field.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveSheet, SHEET.saveAfterTyping);
  }));
  sheet.addEventListener('submit', (event) => event.preventDefault());
  $('#sheet-back').addEventListener('click', () => showSheetStage(Math.max(0, sheetStage - 1), true));
  $('#sheet-next').addEventListener('click', () => showSheetStage(sheetStage >= steps.length ? 0 : sheetStage + 1, true));
  $('#sheet-status').textContent = storageAvailable
    ? 'Notes save in this browser as you type. Nothing is sent to a server.'
    : 'Browser storage is blocked. Download your notes to keep them.';
  showSheetStage(0);
  window.addEventListener('pagehide', saveSheet);
  function notesText() {
    return ['Thinking in Systems — field notes', ...fields.map((field, index) => `${steps[index].querySelector('legend').textContent.trim()}\n${field.value.trim() || '(Not yet recorded)'}`)].join('\n\n');
  }
  $('#download-sheet').addEventListener('click', () => {
    saveSheet();
    const url = URL.createObjectURL(new Blob([notesText()], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'systems-field-notes.txt';
    link.click();
    URL.revokeObjectURL(url);
  });
  function preparePrint() {
    const container = $('#print-notes');
    container.replaceChildren();
    steps.forEach((step, index) => {
      const heading = document.createElement('h3');
      heading.textContent = step.querySelector('legend').textContent;
      const paragraph = document.createElement('p');
      paragraph.textContent = fields[index].value.trim() || 'Not yet recorded.';
      container.append(heading, paragraph);
    });
    // Print reference notes too; restore the reader’s disclosure state afterwards.
    $$('details').forEach((detail) => {
      detail.dataset.printOpen = String(detail.open);
      detail.dataset.printGroup = detail.getAttribute('name') || '';
      detail.removeAttribute('name');
      detail.open = true;
    });
  }
  $('#print-sheet').addEventListener('click', () => {
    saveSheet();
    document.body.classList.add('printing-sheet');
    window.print();
  });
  window.addEventListener('beforeprint', preparePrint);
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing-sheet');
    $$('details[data-print-open]').forEach((detail) => {
      detail.open = detail.dataset.printOpen === 'true';
      if (detail.dataset.printGroup) detail.setAttribute('name', detail.dataset.printGroup);
      delete detail.dataset.printGroup;
      delete detail.dataset.printOpen;
    });
  });
  $$('[data-stress]').forEach((button) => button.addEventListener('click', () => {
    const extraWork = Number(button.dataset.stress);
    $$('[data-stress]').forEach((choice) => choice.setAttribute('aria-pressed', String(choice === button)));
    [['#full-surprise', extraWork ? 20 : 0], ['#spare-surprise', extraWork ? 20 : 0], ['#spare-reserve', extraWork ? 0 : 20]].forEach(([selector, width]) => {
      const bar = $(selector);
      const initial = bar.getBoundingClientRect().width / bar.parentElement.getBoundingClientRect().width * 100;
      bar.textContent = width ? (selector === '#spare-reserve' ? '2 h spare' : '+2 h') : '';
      springTo(bar, WATER, (position) => ({ width: `${initial + (width - initial) * position}%` }));
    });
    $('#resilience-status').textContent = extraWork
      ? 'The fully booked team now has 10 hours of work for an 8-hour day. The team with reserve has 8. The extra demand uses its buffer.'
      : 'Both teams can finish their planned work. The second has 2 hours left for the unexpected. It commits to less in advance.';
  }));
  const sections = $$('.page-section');
  const links = $$('.guide-rail .nav-link');
  let navigationPending = false;
  let currentSection = null;
  function updateNavigation() {
    const threshold = $('.guide-rail').getBoundingClientRect().height < 100 ? 100 : 80;
    const current = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= threshold);
    links.forEach((link) => {
      if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (current && current.id !== currentSection) {
      currentSection = current.id;
      const nav = $('.guide-rail nav');
      const active = links.find((link) => link.hash === `#${currentSection}`);
      if (active && nav.scrollWidth > nav.clientWidth) {
        const left = nav.scrollLeft + active.getBoundingClientRect().left - nav.getBoundingClientRect().left - (nav.clientWidth - active.offsetWidth) / 2;
        nav.scrollTo({ left, behavior: 'instant' });
      }
    }
    navigationPending = false;
  }
  window.addEventListener('scroll', () => {
    if (navigationPending) return;
    navigationPending = true;
    requestAnimationFrame(updateNavigation);
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  $$('a[href^="#"]').forEach((link) => link.addEventListener('click', () => {
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }));
  updateNavigation();
})();
