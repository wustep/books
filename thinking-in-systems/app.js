/* Progressive enhancement: the guide and native disclosures work without JS. */
(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const models = window.SystemsModels;
  const sections = $$('.page-section');
  const navigation = $$('.nav-link');
  const mobile = window.matchMedia('(max-width: 760px)');
  const menu = $('.menu-toggle');
  const sidebar = $('#sidebar');

  function closeMenu({ returnFocus = false } = {}) {
    sidebar.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    if (returnFocus) menu.focus();
  }

  menu.addEventListener('click', () => {
    const open = sidebar.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sidebar.classList.contains('is-open')) {
      closeMenu({ returnFocus: true });
    }
  });
  document.addEventListener('pointerdown', (event) => {
    if (!sidebar.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });
  mobile.addEventListener('change', () => closeMenu());
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      closeMenu();
      // Move keyboard navigation to the destination without replacing native anchors.
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  let scrollPending = false;
  function updateNavigation() {
    const threshold = mobile.matches ? 120 : 110;
    const current = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= threshold) || sections[0];
    navigation.forEach((link) => {
      const active = link.hash === `#${current.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollPending = false;
  }
  function scheduleNavigation() {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(updateNavigation);
  }
  window.addEventListener('scroll', scheduleNavigation, { passive: true });
  window.addEventListener('resize', scheduleNavigation);
  window.addEventListener('hashchange', scheduleNavigation);
  updateNavigation();

  const progressKey = 'thinking-in-systems:explored:v1';
  const completeButtons = $$('[data-complete]');
  const validLessons = new Set(completeButtons.map((button) => button.dataset.complete));
  let completed = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey) || '[]');
    if (Array.isArray(saved)) completed = new Set(saved.filter((id) => validLessons.has(id)));
  } catch { /* Progress remains available for this visit if storage is unavailable. */ }

  function renderProgress() {
    completeButtons.forEach((button) => {
      const explored = completed.has(button.dataset.complete);
      button.setAttribute('aria-pressed', String(explored));
      button.innerHTML = `${explored ? 'Explored' : 'Mark as explored'} <span aria-hidden="true">✓</span>`;
    });
    navigation.forEach((link) => link.classList.toggle('explored', completed.has(link.hash.slice(1))));
    $('#progress-count').textContent = `${completed.size} / ${validLessons.size}`;
    $('#progress-fill').style.width = `${completed.size / validLessons.size * 100}%`;
    $('.progress-track').setAttribute('aria-valuenow', String(completed.size));
    $('#completion-message').hidden = completed.size !== validLessons.size;
  }
  completeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.complete;
      if (completed.has(id)) completed.delete(id);
      else completed.add(id);
      try { localStorage.setItem(progressKey, JSON.stringify([...completed])); } catch { /* Optional storage. */ }
      renderProgress();
    });
  });
  renderProgress();

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
    $('#tank-water').style.height = `${stock}%`;
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
    $('#reservoir-status').textContent = message;
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
    reservoirTimer = window.setInterval(stepReservoir, 1000);
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
    ['#feedback-target', '#target-label'].forEach((selector) => {
      if (reinforcing) $(selector).setAttribute('hidden', '');
      else $(selector).removeAttribute('hidden');
    });
    $('#loop-letter').textContent = reinforcing ? 'R' : 'B';
    $('#loop-top').textContent = reinforcing ? 'More skill' : 'Gap to the target';
    $('#loop-bottom').textContent = reinforcing ? 'More rewarding practice' : 'Correction reduces the gap';
    $('#loop-caption').textContent = reinforcing ? 'Change feeds further change.' : 'A response counteracts the change.';
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
    $('#delay-status').textContent = overshoot
      ? 'Older information makes the controller correct too far. The stock overshoots and oscillates around the target.'
      : delay === 0
        ? 'Current information helps the stock approach its target smoothly.'
        : 'This short delay still allows a smooth approach. Increase the delay to see overshoot.';
    $('#delay-chart-title').textContent = `${delay}-step feedback delay: the stock ${overshoot ? 'overshoots and oscillates around' : 'approaches'} the target of 60`;
  }
  $('#delay').addEventListener('input', renderDelay);
  renderDelay();

  const reflectionPrompts = [
    $('#reflection-prompt').textContent,
    'Think of something you want to build: skill, trust, or time. What adds to that stock, and what drains it?',
    'Where might you be reacting before an earlier action has had time to work? What would help you wait and observe?',
    'Choose a rule you work with. What behavior does it reward—and is that behavior serving its intended purpose?',
    'Whose perspective is missing from your picture of a problem? How could you listen to their experience?',
    'Name one assumption behind your plan. What evidence would lead you to revise it?'
  ];
  let reflectionIndex = 0;
  $('#reflection-prompt').setAttribute('aria-live', 'polite');
  $('#reflection-next').addEventListener('click', () => {
    reflectionIndex = (reflectionIndex + 1) % reflectionPrompts.length;
    $('#reflection-prompt').textContent = reflectionPrompts[reflectionIndex];
    $('#reflection-count').textContent = `${String(reflectionIndex + 1).padStart(2, '0')} / 06`;
  });
})();
