const test = require('node:test');
const assert = require('node:assert/strict');
const { reservoir, feedback, delayedAdjustment } = require('../models.js');

test('balanced flows preserve a stock while water moves through it', () => {
  assert.deepEqual(reservoir({ stock: 50, inflow: 6, outflow: 6 }), { stock: 50, drained: 6, overflow: 0 });
});

test('slower inflow still grows the stock when it exceeds outflow', () => {
  assert.equal(reservoir({ stock: 50, inflow: 8, outflow: 4 }).stock, 54);
  assert.equal(reservoir({ stock: 50, inflow: 5, outflow: 4 }).stock, 51);
});

test('empty and full reservoirs conserve water, including unmet demand and overflow', () => {
  for (const stock of [0, 1, 50, 99, 100]) {
    for (const inflow of [0, 4, 12]) {
      for (const outflow of [0, 4, 12]) {
        const next = reservoir({ stock, inflow, outflow });
        assert.ok(next.stock >= 0 && next.stock <= 100);
        assert.ok(next.drained <= outflow);
        assert.equal(stock + inflow, next.stock + next.drained + next.overflow);
      }
    }
  }
  assert.deepEqual(reservoir({ stock: 0, inflow: 4, outflow: 12 }), { stock: 0, drained: 4, overflow: 0 });
  assert.deepEqual(reservoir({ stock: 100, inflow: 12, outflow: 4 }), { stock: 100, drained: 4, overflow: 8 });
});

test('flow rates account for the length of a timestep', () => {
  assert.deepEqual(reservoir({ stock: 50, inflow: 6, outflow: 2, dt: 0.5 }), { stock: 52, drained: 1, overflow: 0 });
});

test('reinforcing growth accelerates; balancing feedback closes the target gap', () => {
  const growth = feedback('reinforcing');
  assert.ok(growth.at(-1) - growth.at(-2) > growth[1] - growth[0]);
  const balance = feedback('balancing');
  assert.ok(balance.every((value, i) => value < 80 && (i === 0 || value > balance[i - 1])));
  assert.ok(80 - balance.at(-1) < 2);
});

test('a long feedback delay creates overshoot while immediate feedback settles smoothly', () => {
  const immediate = delayedAdjustment(0);
  assert.ok(immediate.every((value, i) => value < 60 && (i === 0 || value > immediate[i - 1])));
  const delayed = delayedAdjustment(10);
  assert.ok(Math.max(...delayed) > 70);
  const peak = delayed.indexOf(Math.max(...delayed));
  assert.ok(delayed.slice(peak).some((value) => value < 60));
  assert.ok(delayed.every((value) => value >= 0 && value <= 100));
});
