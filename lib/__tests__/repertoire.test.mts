import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeRepertoire, type ScheduledRole } from '../repertoire.ts';
import type { RepertoireItem } from '../content.ts';

const today = '2026-10-26';

const perf = (over: Partial<ScheduledRole>): ScheduledRole => ({
  slug: 'x',
  title: 'La bohème',
  work: '',
  composer: 'Giacomo Puccini',
  role: 'Mimì',
  type: 'opera',
  date: '2026-11-14',
  venue: 'Opernhaus',
  city: 'Zurich',
  addToRepertoire: true,
  ...over,
});

const manual = (over: Partial<RepertoireItem>): RepertoireItem => ({
  slug: 'm',
  work: 'La bohème',
  composer: 'Giacomo Puccini',
  role: 'Mimì',
  category: 'opera',
  inPreparation: false,
  details: '',
  recording: null,
  recordingUrl: null,
  fromSchedule: false,
  ...over,
});

test('a scheduled role becomes a repertoire entry without entering it twice', () => {
  const [item] = mergeRepertoire([], [perf({})], today);
  assert.equal(item.work, 'La bohème');
  assert.equal(item.role, 'Mimì');
  assert.equal(item.category, 'opera');
  assert.equal(item.fromSchedule, true);
  assert.equal(item.inPreparation, true, 'only a future date: in preparation');
  assert.equal(item.details, 'Opernhaus, Zurich 2026');
});

test('the same role in several performances is listed once with all venues, newest first', () => {
  const items = mergeRepertoire(
    [],
    [
      perf({ slug: 'a', date: '2025-03-01', venue: 'Staatsoper', city: 'Stuttgart' }),
      perf({ slug: 'b', date: '2026-11-14' }),
      perf({ slug: 'c', date: '2026-11-16' }), // same venue and year: not repeated
      perf({ slug: 'd', title: 'La Boheme', role: 'mimi', date: '2024-05-01', venue: 'Volksoper', city: 'Wien' }),
    ],
    today,
  );
  assert.equal(items.length, 1);
  assert.equal(items[0].inPreparation, false, 'a past date: performed');
  assert.equal(items[0].details, 'Opernhaus, Zurich 2026 · Staatsoper, Stuttgart 2025 · Volksoper, Wien 2024');
});

test('a matching manual entry keeps its details and recording; scheduled venues are added', () => {
  const [item] = mergeRepertoire(
    [manual({ details: 'Role debut 2023', recordingUrl: 'https://youtu.be/dQw4w9WgXcQ', inPreparation: true })],
    [perf({ date: '2025-01-10' })],
    today,
  );
  assert.equal(item.details, 'Role debut 2023 · Opernhaus, Zurich 2025');
  assert.equal(item.recordingUrl, 'https://youtu.be/dQw4w9WgXcQ');
  assert.equal(item.inPreparation, false);
  assert.equal(item.fromSchedule, true);
});

test('galas without a role, unticked entries and the "work" override', () => {
  const items = mergeRepertoire(
    [manual({ work: 'Faust', composer: 'Charles Gounod', role: 'Marguerite' })],
    [
      perf({ title: 'New Year Gala', role: '', type: 'concert' }),
      perf({ title: 'La traviata', composer: 'Giuseppe Verdi', role: 'Violetta', addToRepertoire: false }),
      perf({ title: 'Brahms Requiem', work: 'Ein deutsches Requiem', composer: 'Johannes Brahms', role: 'Soprano solo', type: 'concert' }),
    ],
    today,
  );
  assert.deepEqual(
    items.map((i) => `${i.work}/${i.category}`),
    ['Faust/opera', 'Ein deutsches Requiem/concert'],
  );
});
