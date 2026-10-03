const test = require('node:test');
const assert = require('node:assert/strict');
const { springSamples } = require('../motion.js');
test('entrance spring overshoots slightly and settles exactly at its target', () => {
  const { samples, duration } = springSamples({ stiffness: 280, damping: 26, mass: 1 });
  assert.equal(samples[0], 0);
  assert.equal(samples.at(-1), 1);
  assert.ok(Math.max(...samples) > 1 && Math.max(...samples) < 1.04);
  assert.ok(duration > 300 && duration < 2000);
});
test('water spring moves monotonically, preserving visual tank bounds', () => {
  const { samples } = springSamples({ stiffness: 170, damping: 25, mass: 1 });
  assert.ok(samples.every((value) => value >= 0 && value <= 1));
});
