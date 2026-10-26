'use client';

import { useId, useState } from 'react';
import { CopyButton } from './CopyButton';
import { cn } from './ui/cn';

type Version = 'short' | 'full';

/**
 * Lets visitors switch between the short biography (plain text, copyable for
 * programme books) and the full one (server-rendered rich text passed as children).
 */
export function BioSwitcher({
  shortBio,
  children,
  labels,
}: {
  shortBio: string;
  children: React.ReactNode;
  labels: { shortBio: string; fullBio: string; bioVersion: string; copyShortBio: string; copied: string };
}) {
  const [version, setVersion] = useState<Version>('full');
  const id = useId();
  if (!shortBio) return <>{children}</>;

  const tabs: { key: Version; label: string }[] = [
    { key: 'full', label: labels.fullBio },
    { key: 'short', label: labels.shortBio },
  ];

  return (
    <div>
      <div role="tablist" aria-label={labels.bioVersion} className="inline-flex border border-ink/20 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            id={`${id}-${tab.key}`}
            aria-selected={version === tab.key}
            aria-controls={`${id}-panel`}
            onClick={() => setVersion(tab.key)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') setVersion((v) => (v === 'full' ? 'short' : 'full'));
            }}
            tabIndex={version === tab.key ? 0 : -1}
            className={cn(
              'min-h-10 px-4 text-[0.8125rem] font-semibold tracking-[0.12em] uppercase transition-colors',
              version === tab.key ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${version}`} className="mt-10">
        {version === 'full' ? (
          children
        ) : (
          <div>
            <div className="space-y-5">
              {shortBio.split(/\n\s*\n/).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <CopyButton text={shortBio} label={labels.copyShortBio} copiedLabel={labels.copied} className="mt-8" />
          </div>
        )}
      </div>
    </div>
  );
}
