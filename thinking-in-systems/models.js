/* Small, deterministic teaching models. Units and assumptions are shown in the UI. */
(function (root) {
  'use strict';
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function reservoir({ stock, inflow, outflow, dt = 1, capacity = 100 }) {
    const available = stock + inflow * dt;
    const drained = Math.min(available, outflow * dt);
    const overflow = Math.max(0, available - drained - capacity);
    return { stock: clamp(available - drained, 0, capacity), drained, overflow };
  }

  function feedback(kind, steps = 40) {
    let stock = 10;
    const points = [stock];
    for (let i = 0; i < steps; i += 1) {
      stock += kind === 'reinforcing' ? stock * 0.055 : (80 - stock) * 0.1;
      points.push(stock);
    }
    return points;
  }

  function delayedAdjustment(delay, steps = 60) {
    const target = 60;
    const points = [20];
    for (let t = 0; t < steps; t += 1) {
      const perceived = points[Math.max(0, t - delay)];
      points.push(clamp(points[t] + 0.12 * (target - perceived), 0, 100));
    }
    return points;
  }

  const api = { reservoir, feedback, delayedAdjustment };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SystemsModels = api;
})(typeof window !== 'undefined' ? window : globalThis);
