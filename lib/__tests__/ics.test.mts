import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildIcs, escapeIcsText, foldIcsLine } from '../ics.ts';

const now = new Date(Date.UTC(2026, 9, 26, 8, 5, 9));

test('timed event uses floating local times with a 3h default duration', () => {
  const ics = buildIcs(
    { uid: 'boheme@annaavdalyan.com', title: 'La bohème', date: '2026-11-14', time: '19:30', location: 'Opernhaus, Zurich' },
    now,
  );
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /\r\nDTSTAMP:20261026T080509Z\r\n/);
  assert.match(ics, /\r\nDTSTART:20261114T193000\r\n/);
  assert.match(ics, /\r\nDTEND:20261114T223000\r\n/);
  assert.match(ics, /\r\nSUMMARY:La bohème\r\n/);
  assert.match(ics, /\r\nLOCATION:Opernhaus\\, Zurich\r\n/);
  assert.ok(ics.endsWith('END:VEVENT\r\nEND:VCALENDAR\r\n'));
});

test('late events roll over to the next day', () => {
  const ics = buildIcs({ uid: 'gala', title: 'New Year Gala', date: '2026-12-31', time: '22:30' }, now);
  assert.match(ics, /DTEND:20270101T013000/);
});

test('event without time is all-day', () => {
  const ics = buildIcs({ uid: 'recital', title: 'Recital', date: '2027-02-28', time: '' }, now);
  assert.match(ics, /DTSTART;VALUE=DATE:20270228\r\n/);
  assert.match(ics, /DTEND;VALUE=DATE:20270301\r\n/);
});

test('escapes special characters', () => {
  assert.equal(escapeIcsText('a,b;c\\d\ne'), 'a\\,b\;c\\\\d\\ne');
});

test('folds lines longer than 75 octets', () => {
  const folded = foldIcsLine(`DESCRIPTION:${'é'.repeat(60)}`);
  for (const line of folded.split('\r\n')) assert.ok(new TextEncoder().encode(line).length <= 75);
  assert.equal(folded.replace(/\r\n /g, ''), `DESCRIPTION:${'é'.repeat(60)}`);
});
