import { DisplayHeading, Eyebrow, GoldRule } from './ui';

/** Shared page opening: small caps eyebrow, large Bodoni title, optional lede. */
export function PageIntro({ eyebrow, title, lede }: { eyebrow: string; title: string; lede?: string }) {
  return (
    <header className="mx-auto w-full max-w-[1200px] px-4 pt-32 pb-12 sm:px-6 md:px-10 md:pt-44 md:pb-20">
      <Eyebrow>{eyebrow}</Eyebrow>
      <DisplayHeading as="h1" size="lg" className="mt-6 max-w-4xl">
        {title}
      </DisplayHeading>
      <GoldRule tone="accent" className="mt-10" />
      {lede && <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">{lede}</p>}
    </header>
  );
}
