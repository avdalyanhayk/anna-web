import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findPhoto, normalizeTitle, parseCaption } from '../photos.ts';

const photo = (caption: string, category = 'stage') => ({ caption, category });

const gallery = [
  photo('', 'portrait'),
  photo('Adele - Die Fledermaus, Schleswig-Holsteinisches Landestheater'),
  photo('Lisa - Jekyll and Hyde, Schleswig-Holsteinisches Landestheater'),
  photo('Mabel - The Pirates of Penzance, Schleswig-Holsteinisches Landestheater'),
  photo('Molly - Der Arme Jonathan, Schleswig-Holsteinisches Landestheater'),
];

test('normalizeTitle drops accents, articles, conjunctions and subtitles', () => {
  assert.equal(normalizeTitle('Die Teufel von Loudun (The Devils of Loudun)'), 'teufel von loudun');
  assert.equal(normalizeTitle('Jekyll und Hyde'), normalizeTitle('Jekyll and Hyde'));
  assert.equal(normalizeTitle('La bohème'), 'boheme');
});

test('parseCaption reads "Role - Work, Venue"', () => {
  assert.deepEqual(parseCaption('Adele - Die Fledermaus, Landestheater'), { role: 'adele', work: 'fledermaus' });
  assert.deepEqual(parseCaption('Gala, Vienna'), { role: '', work: 'gala' });
});

test('matches a production by its work, across spelling variants', () => {
  assert.equal(findPhoto(gallery, { works: ['Die Fledermaus'] })?.caption, gallery[1].caption);
  assert.equal(findPhoto(gallery, { works: ['Jekyll und Hyde'], role: 'Lisa' })?.caption, gallery[2].caption);
  assert.equal(findPhoto(gallery, { works: ['', 'Der arme Jonathan'] })?.caption, gallery[4].caption);
});

test('falls back to an exact role name, and returns null otherwise', () => {
  assert.equal(findPhoto(gallery, { works: ['Something else'], role: 'Mabel' })?.caption, gallery[3].caption);
  assert.equal(findPhoto(gallery, { works: ['Der Freischütz'], role: 'Ännchen' }), null);
  assert.equal(findPhoto(gallery, { works: ['Die'] }), null);
});
