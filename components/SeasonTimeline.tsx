'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { PerformanceView } from '@/lib/content';

/**
 * The season as a horizontal ribbon: drag with the mouse, swipe on touch,
 * or scroll with the keyboard. Month markers sit on a hairline above the cards.
 */
export function SeasonTimeline({
  performances,
  scheduleHref,
  typeLabels,
}: {
  performances: PerformanceView[];
  scheduleHref: string;
  typeLabels: Record<PerformanceView['type'], string>;
}) {
  const scroller = useRef<HTMLOListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !scroller.current) return;
    drag.current = { x: e.clientX, left: scroller.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !scroller.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    scroller.current.scrollLeft = drag.current.left - dx;
  };
  const endDrag = () => {
    window.setTimeout(() => (drag.current = null), 0);
  };
  // Swallow the click that ends a drag so a card isn't opened by accident.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <ol
      ref={scroller}
      tabIndex={0}
      aria-label="Season"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={onClickCapture}
      className="no-scrollbar -mx-4 flex cursor-grab snap-x gap-0 overflow-x-auto px-4 select-none active:cursor-grabbing sm:-mx-6 sm:px-6 md:-mx-10 md:px-10"
    >
      {performances.map((p, i) => {
        const prev = performances[i - 1];
        const newMonth = !prev || prev.month !== p.month || prev.year !== p.year;
        return (
          <li key={p.slug} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc(100%/3.4)]">
            <div className="relative h-14 border-b border-ink/80">
              {newMonth && (
                <span className="eyebrow absolute bottom-3 left-0 text-ink">
                  {p.month} <span className="text-muted">{p.year}</span>
                </span>
              )}
              <span aria-hidden className="absolute -bottom-[5px] left-0 size-[9px] rounded-full border border-ink bg-paper" />
            </div>
            <Link
              href={scheduleHref}
              draggable={false}
              className="group block pt-8 pr-8 pb-2"
            >
              <p className="flex items-baseline gap-3">
                <span className="font-display text-6xl leading-none tabular-nums transition-colors duration-300 group-hover:text-lapis">
                  {p.day}
                </span>
                <span className="text-xs text-muted">
                  {p.weekday}
                  {p.time && ` · ${p.time}`}
                </span>
              </p>
              <p className="eyebrow mt-6 text-lapis">{typeLabels[p.type]}</p>
              <h3 className="mt-2 font-display text-2xl leading-tight italic">{p.title}</h3>
              {p.role && <p className="mt-2 text-sm">{p.role}</p>}
              <p className="mt-4 text-sm text-muted">
                {p.venue}
                {p.place && <>, {p.place}</>}
              </p>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
