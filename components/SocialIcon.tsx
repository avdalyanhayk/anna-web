import type { Settings } from '@/lib/content';

type Network = Settings['socials'][number]['label'];

// Thin outline brand marks (lucide-react no longer ships brand icons).
const paths: Record<Network, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  Facebook: <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V9H6.5v3.5H9V21h3.5v-8.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z" />,
  YouTube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9.5 4.5 2.5-4.5 2.5z" />
    </>
  ),
  Spotify: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M7.5 9.5c3-1 6.5-.7 9.2.8M8 12.6c2.5-.7 5.2-.4 7.4.8M8.6 15.5c1.9-.5 3.9-.3 5.6.6" />
    </>
  ),
};

export function SocialIcon({ network, className }: { network: Network; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {paths[network]}
    </svg>
  );
}
