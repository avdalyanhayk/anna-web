import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseYouTubeId } from '../youtube.ts';

const ID = 'dQw4w9WgXcQ';

test('parses every common YouTube URL format', () => {
  const urls = [
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}&t=42s&list=PL123`,
    `https://m.youtube.com/watch?feature=share&v=${ID}`,
    `https://music.youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?si=abc&t=10`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/embed/${ID}?rel=0`,
    `https://www.youtube-nocookie.com/embed/${ID}`,
    `https://www.youtube.com/live/${ID}?feature=shared`,
    `https://www.youtube.com/v/${ID}`,
    `youtube.com/watch?v=${ID}`,
    `  https://youtu.be/${ID}  `,
    ID,
  ];
  for (const url of urls) assert.equal(parseYouTubeId(url), ID, url);
});

test('rejects invalid input', () => {
  for (const bad of [
    '',
    null,
    undefined,
    'not a url',
    'https://vimeo.com/123456789',
    'https://www.youtube.com/',
    'https://www.youtube.com/watch?v=short',
    'https://example.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/',
  ]) {
    assert.equal(parseYouTubeId(bad), null, String(bad));
  }
});
