/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — a frame changes on the reader's cue
 *
 *    0ms   stage 0: the situation and first interpretation
 *    0ms   stage 1: alternate frame opens; y 14 → 0
 *  160ms   stage 2: the next action and reading link arrive
 *  760ms   spring settles; no looping or automatic replay
 *
 * A new situation resets to stage 0 and cancels the old sequence.
 * Reduced motion shows every requested stage immediately.
 * ───────────────────────────────────────────────────────── */
export const TIMING = {
  frameOpen:      0, // reader requests another frame
  actionArrive: 160, // action follows the changed interpretation
  springSettle: 760, // sampled physical spring comes to rest
  sampleStep:    16, // keyframe sampling interval
};
const FRAME = {
  offsetY: 14, // opening distance in px
  stiffness: 280, // force restoring the panel to rest
  damping: 28, // strong damping keeps reading text stable
  mass: 1, // unit mass
};
const ACTION = { ...FRAME, offsetY: 8, stiffness: 350, damping: 30 };
const GUIDE = { ...FRAME, offsetY: 10, stiffness: 330, damping: 29 };
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const running = new Map();

// Analytic solution of a damped spring, sampled into Web Animation keyframes.
// This is physical spring motion, not an easing curve approximating a spring.
export function springIn(element, config = GUIDE) {
  running.get(element)?.cancel();
  if (preference.matches || !element.animate) return;
  const omega = Math.sqrt(config.stiffness / config.mass);
  const decay = config.damping / (2 * config.mass);
  const frequency = Math.sqrt(omega * omega - decay * decay);
  const frames = [];
  for (let ms = 0; ms < TIMING.springSettle; ms += TIMING.sampleStep) {
    const t = ms / 1000;
    const displacement = Math.exp(-decay * t) * (Math.cos(frequency * t) + decay / frequency * Math.sin(frequency * t));
    frames.push({ transform: `translateY(${config.offsetY * displacement}px)`, opacity: Math.min(1, Math.max(0, 1 - displacement)), offset: ms / TIMING.springSettle });
  }
  frames.push({ transform: 'translateY(0)', opacity: 1, offset: 1 });
  const animation = element.animate(frames, { duration: TIMING.springSettle, easing: 'linear' });
  running.set(element, animation);
  animation.finished.then(() => { if (running.get(element) === animation) running.delete(element); }).catch(() => {});
}
preference.addEventListener('change', () => { running.forEach(animation => animation.finish()); running.clear(); });

const frame = document.querySelector('[data-frame]');
let timer;
let stage = 0;
function setStage(value) {
  stage = value;
  if (!frame) return;
  frame.dataset.stage = String(stage);
  const panel = frame.querySelector('#possible-frame');
  const button = frame.querySelector('[data-reveal-frame]');
  panel.hidden = stage < 1;
  button.setAttribute('aria-expanded', String(stage >= 1));
  button.textContent = stage >= 1 ? 'Return to the first frame ↑' : 'Try another frame ↓';
  frame.querySelectorAll('.frame-action, #frame-link').forEach(element => { element.hidden = stage < 2; });
}
export function resetFrame() {
  clearTimeout(timer);
  if (!frame) return;
  frame.querySelectorAll('*').forEach(element => { running.get(element)?.cancel(); running.delete(element); });
  setStage(0);
}
if (frame) {
  setStage(0);
  frame.querySelector('[data-reveal-frame]').addEventListener('click', () => {
    if (stage >= 1) { resetFrame(); return; }
    setStage(1);
    springIn(frame.querySelector('.new-frame'), FRAME);
    const action = () => {
      setStage(2);
      springIn(frame.querySelector('.frame-action'), ACTION);
      springIn(frame.querySelector('#frame-link'), ACTION);
    };
    if (preference.matches) action();
    else timer = setTimeout(action, TIMING.actionArrive);
  });
}
addEventListener('pagehide', () => { clearTimeout(timer); running.forEach(animation => animation.cancel()); running.clear(); });
