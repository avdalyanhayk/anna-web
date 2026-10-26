'use client';

import type { Recording } from '@/lib/media';
import { YouTube } from './YouTube';

/** Plays a repertoire recording in place: YouTube video, Spotify or SoundCloud audio. */
export function RecordingEmbed({ recording, title }: { recording: Recording; title: string }) {
  if (recording.kind === 'youtube') return <YouTube url={recording.id} title={title} autoStart />;
  const height = recording.kind === 'spotify' ? 152 : 166;
  return (
    <iframe
      src={recording.embedUrl}
      title={title}
      height={height}
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      className="w-full border-0"
    />
  );
}
