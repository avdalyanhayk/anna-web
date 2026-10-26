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
  recording: null,
  recordingUrl: null,
  fromSchedule: false,
  ...over,
});

test('a scheduled role becomes a repertoire entry with just composer, work and role', () => {
  const [item] = mergeRepertoire([], [perf({})], today);
  assert.equal(item.work, 'La bohème');
  assert.equal(item.composer, 'Giacomo Puccini');
  assert.equal(item.role, 'Mimì');
  assert.equal(item.category, 'opera');
  assert.equal(item.fromSchedule, true);
  assert.equal(item.inPreparation, true, 'only a future date: in preparation');
  assert.equal('details' in item, false, 'no venue or date details');
});

test('the same role in several performances is listed once', () => {
  const items = mergeRepertoire(
    [],
    [
      perf({ slug: 'a', date: '2025-03-01' }),
      perf({ slug: 'b', date: '2026-11-14' }),
      perf({ slug: 'c', title: 'La Boheme', role: 'mimi', date: '2024-05-01' }),
    ],
    today,
  );
  assert.equal(items.length, 1);
  assert.equal(items[0].inPreparation, false, 'a past date: performed');
});

test('a matching manual entry keeps its recording and becomes performed after a past date', () => {
  const [item] = mergeRepertoire(
    [manual({ recordingUrl: 'https://youtu.be/dQw4w9WgXcQ', inPreparation: true })],
    [perf({ date: '2025-01-10' })],
    today,
  );
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
