'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from './ui/cn';

/** Copies a text (e.g. the short biography) for programme books and press. */
export function CopyButton({ text, label, copiedLabel, className }: { text: string; label: string; copiedLabel: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); the text stays selectable.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        'inline-flex min-h-11 items-center gap-2 border border-ink/25 px-4 text-[0.8125rem] font-semibold tracking-[0.12em] uppercase transition-colors hover:border-ink',
        className,
      )}
    >
      {copied ? <Check aria-hidden className="size-4 text-accent" strokeWidth={2} /> : <Copy aria-hidden className="size-4" strokeWidth={1.75} />}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
