const ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

/**
 * Extracts the 11-character video ID from any common YouTube URL format
 * (watch?v=, youtu.be/, /shorts/, /embed/, /live/, /v/), or a bare ID.
 * Returns null when the input is not a recognisable YouTube video.
 */
export function parseYouTubeId(input: string | null | undefined): string | null {
  if (!input) return null;
  const value = input.trim();
  if (ID_PATTERN.test(value)) return value;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  const segments = url.pathname.split('/').filter(Boolean);
  let candidate: string | null | undefined;

  if (host === 'youtu.be' || host === 'www.youtu.be') {
    candidate = segments[0];
  } else if (YOUTUBE_HOSTS.has(host)) {
    if (segments[0] === 'watch') candidate = url.searchParams.get('v');
    else if (['embed', 'shorts', 'live', 'v', 'e'].includes(segments[0] ?? '')) candidate = segments[1];
    else candidate = url.searchParams.get('v');
  }

  return candidate && ID_PATTERN.test(candidate) ? candidate : null;
}

export const youTubeThumbnail = (id: string, quality: 'maxresdefault' | 'hqdefault' = 'hqdefault') =>
  `https://i.ytimg.com/vi/${id}/${quality}.jpg`;

export const youTubeEmbedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
