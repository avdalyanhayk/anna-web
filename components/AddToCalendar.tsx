'use client';

import { CalendarPlus } from 'lucide-react';
import type { PerformanceView } from '@/lib/content';
import { buildIcs } from '@/lib/ics';
import { cn } from './ui/cn';

export function AddToCalendar({ performance: p, label, className }: { performance: PerformanceView; label: string; className?: string }) {
  const download = () => {
    const ics = buildIcs({
      uid: `${p.slug}-${p.date}@annaavdalyan.com`,
      title: `${p.title} — Anna Avdalyan`,
      date: p.date,
      time: p.time,
      location: [p.venue, p.place].filter(Boolean).join(', '),
      description: [p.composer, p.role, p.notes].filter(Boolean).join('\n'),
      url: p.ticketsUrl,
    });
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${p.slug}.ics`;
    document.body.append(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <button
      type="button"
      onClick={download}
      className={cn('link-draw inline-flex items-center gap-2 text-[0.8125rem] font-semibold tracking-[0.12em] uppercase text-ink-soft hover:text-ink', className)}
    >
      <CalendarPlus aria-hidden className="size-4" strokeWidth={1.75} />
      {label}
    </button>
  );
}
