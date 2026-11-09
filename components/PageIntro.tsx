import { DisplayHeading, GoldRule } from './ui';

/** Shared page opening: small caps eyebrow, large Bodoni title, optional lede. */
export function PageIntro({ eyebrow, title, lede }: { eyebrow: string; title: string; lede?: string }) {
  return (
    <header className="mx-auto w-full max-w-[1200px] px-4 pt-32 pb-12 sm:px-6 md:px-10 md:pt-48 md:pb-20">
      <p className="eyebrow flex items-center gap-4 text-accent">
        <span aria-hidden className="h-px w-10 bg-champagne" />
        {eyebrow}
      </p>
      <DisplayHeading as="h1" size="xl" className="mt-6 max-w-5xl">
        {title}
      </DisplayHeading>
      <GoldRule tone="accent" className="mt-12" />
      {lede && <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">{lede}</p>}
    </header>
  );
}
