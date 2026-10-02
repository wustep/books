import test from 'node:test';
import assert from 'node:assert/strict';
import { parseNotebook, readNotebook, saveNote, exportNotebook, STORAGE_KEY } from '../public/notebook-state.js';
const slugs = ['giving-an-a', 'rule-number-six'];
const timestamp = '2026-10-01T12:00:00.000Z';
const memory = (initial = null) => {
  let value = initial;
  return { getItem: () => value, setItem: (key, next) => { assert.equal(key, STORAGE_KEY); value = next; } };
};

test('saving and editing preserve reflections for other practices', () => {
  const storage = memory();
  saveNote(storage, slugs, slugs[0], '  Start with trust.  ', timestamp);
  saveNote(storage, slugs, slugs[1], 'Take a breath.', timestamp);
  saveNote(storage, slugs, slugs[0], 'Ask what would help.', timestamp);
  assert.deepEqual(readNotebook(storage, slugs).notes, {
    'giving-an-a': { text: 'Ask what would help.', updated: timestamp },
    'rule-number-six': { text: 'Take a breath.', updated: timestamp }
  });
});

test('corrupt or incompatible storage is reported and never overwritten on save', () => {
  for (const raw of ['{broken', 'null', '[]', '{"version":2,"notes":{}}']) {
    const storage = memory(raw);
    assert.ok(readNotebook(storage, slugs).error);
    assert.throws(() => saveNote(storage, slugs, slugs[0], 'A new thought.', timestamp));
    assert.equal(storage.getItem(STORAGE_KEY), raw);
  }
});

test('invalid entries, unknown keys, and invalid dates are not rendered', () => {
  const raw = JSON.stringify({ version: 1, notes: {
    'giving-an-a': { text: 'Valid', updated: timestamp },
    'rule-number-six': { text: 'Invalid date', updated: 'bad' },
    unknown: { text: 'Ignore', updated: timestamp }
  } });
  assert.deepEqual(Object.keys(parseNotebook(raw, slugs)), ['giving-an-a']);
  assert.throws(() => saveNote(memory(), slugs, '__proto__', 'Bad key', timestamp));
});

test('empty, oversized, unavailable, and full storage fail without false success', () => {
  assert.throws(() => saveNote(memory(), slugs, slugs[0], '  ', timestamp));
  assert.throws(() => saveNote(memory(), slugs, slugs[0], 'a'.repeat(6001), timestamp));
  assert.ok(readNotebook({ getItem() { throw new Error('Blocked'); } }, slugs).error);
  assert.throws(() => saveNote({ getItem: () => null, setItem() { throw new Error('Quota'); } }, slugs, slugs[0], 'My note', timestamp), /Quota/);
});

test('plain-text export includes the saved words and practice context in book order', () => {
  const storage = memory();
  const notes = saveNote(storage, slugs, slugs[0], '<script>My own words & symbols</script>\nSecond line.', timestamp);
  const text = exportNotebook(notes, [{ slug: slugs[0], number: 3, title: 'Giving an A', prompt: 'What could change?' }]);
  assert.match(text, /3\. Giving an A/);
  assert.match(text, /What could change\?/);
  assert.ok(text.includes('<script>My own words & symbols</script>\nSecond line.'));
});
