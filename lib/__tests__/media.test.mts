import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRecording } from '../media.ts';

test('recognises YouTube, Spotify and SoundCloud links', () => {
  assert.deepEqual(parseRecording('https://youtu.be/dQw4w9WgXcQ'), { kind: 'youtube', id: 'dQw4w9WgXcQ' });
  assert.deepEqual(parseRecording('https://open.spotify.com/intl-de/track/4uLU6hMCjMI75M1A2tKUQC?si=x'), {
    kind: 'spotify',
    embedUrl: 'https://open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC',
  });
  const sc = parseRecording('https://soundcloud.com/artist/aria?in=x');
  assert.equal(sc?.kind, 'soundcloud');
  assert.ok(sc && 'embedUrl' in sc && sc.embedUrl.includes(encodeURIComponent('https://soundcloud.com/artist/aria')));
});

test('returns null for unsupported or empty links', () => {
  for (const bad of ['', null, 'https://example.com/a.mp3', 'not a url', 'https://open.spotify.com/artist']) {
    assert.equal(parseRecording(bad), null, String(bad));
  }
});
