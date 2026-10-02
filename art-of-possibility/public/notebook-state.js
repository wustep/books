export const STORAGE_KEY = 'art-of-possibility:notebook:v1';
export const MAX_NOTE_LENGTH = 6000;

export function parseNotebook(raw, allowedSlugs) {
  if (!raw) return {};
  const value = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== 1 || !value.notes || typeof value.notes !== 'object' || Array.isArray(value.notes)) {
    throw new Error('Unrecognized notebook data');
  }
  const notes = {};
  for (const slug of allowedSlugs) {
    const entry = value.notes[slug];
    if (entry && typeof entry.text === 'string' && entry.text.trim() && entry.text.length <= MAX_NOTE_LENGTH && typeof entry.updated === 'string' && Number.isFinite(Date.parse(entry.updated))) {
      notes[slug] = { text: entry.text, updated: entry.updated };
    }
  }
  return notes;
}

export function readNotebook(storage, slugs) {
  try { return { notes: parseNotebook(storage.getItem(STORAGE_KEY), slugs), error: null }; }
  catch { return { notes: {}, error: 'Your saved notebook could not be read. Browser storage may be unavailable or its data may be damaged. Your existing data has not been changed.' }; }
}

export function saveNote(storage, slugs, slug, text, updated = new Date().toISOString()) {
  if (!slugs.includes(slug)) throw new Error('Unknown practice');
  if (!text.trim() || text.length > MAX_NOTE_LENGTH) throw new Error('Write a reflection of 1–6,000 characters before saving.');
  const current = readNotebook(storage, slugs);
  if (current.error) throw new Error(current.error);
  const notes = { ...current.notes, [slug]: { text: text.trim(), updated } };
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, notes }));
  return notes;
}

export function exportNotebook(notes, entries) {
  return ['MY POSSIBILITY NOTEBOOK', 'Reflections on The Art of Possibility', '', ...entries.filter(p => notes[p.slug]).flatMap(p => [
    `${p.number}. ${p.title}`, `Saved: ${notes[p.slug].updated}`, '', p.prompt, '', notes[p.slug].text, '', '—', ''
  ])].join('\n');
}
