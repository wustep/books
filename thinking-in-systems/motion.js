/* A damped spring, sampled into Web Animations keyframes. No runtime library. */
(function (root) {
  'use strict';
  const SAMPLING = {
    stepSeconds: 1 / 120, // small fixed steps keep the integration stable
    maxSeconds: 2,       // hard stop for a finite, cancellable animation
    restDistance: 0.001, // displacement threshold for a settled spring
    restSpeed: 0.01      // velocity threshold for a settled spring
  };
  function springSamples({ stiffness, damping, mass }) {
    let position = 0;
    let velocity = 0;
    const samples = [0];
    for (let elapsed = 0; elapsed < SAMPLING.maxSeconds; elapsed += SAMPLING.stepSeconds) {
      const force = stiffness * (1 - position) - damping * velocity;
      velocity += force / mass * SAMPLING.stepSeconds;
      position += velocity * SAMPLING.stepSeconds;
      samples.push(position);
      if (Math.abs(1 - position) < SAMPLING.restDistance && Math.abs(velocity) < SAMPLING.restSpeed) break;
    }
    samples.push(1);
    return { samples, duration: (samples.length - 1) * SAMPLING.stepSeconds * 1000 };
  }
  const api = { springSamples };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SystemsMotion = api;
})(typeof window !== 'undefined' ? window : globalThis);
