import { parseYouTubeId } from './youtube.ts';

export type Recording =
  | { kind: 'youtube'; id: string }
  | { kind: 'spotify'; embedUrl: string }
  | { kind: 'soundcloud'; embedUrl: string };

/**
 * Turns a recording link (YouTube, Spotify or SoundCloud) into something the
 * site can embed in place. Anything else returns null and is shown as a plain link.
 */
export function parseRecording(input: string | null | undefined): Recording | null {
  if (!input) return null;
  const youtube = parseYouTubeId(input);
  if (youtube) return { kind: 'youtube', id: youtube };

  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();

  if (host === 'open.spotify.com') {
    const match = url.pathname.match(/^\/(?:intl-[a-z-]+\/)?(track|album|playlist|episode)\/([A-Za-z0-9]+)/);
    if (match) return { kind: 'spotify', embedUrl: `https://open.spotify.com/embed/${match[1]}/${match[2]}` };
    return null;
  }

  if (host === 'soundcloud.com' || host === 'www.soundcloud.com' || host === 'm.soundcloud.com') {
    const clean = `https://soundcloud.com${url.pathname}`;
    return {
      kind: 'soundcloud',
      embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(clean)}&color=%238a7245&auto_play=true&visual=false`,
    };
  }

  return null;
}
