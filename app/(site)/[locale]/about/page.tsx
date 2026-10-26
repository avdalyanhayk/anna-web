import type { Metadata } from 'next';
import Image from 'next/image';
import { DocumentRenderer } from '@keystatic/core/renderer';
import { Download } from 'lucide-react';
import { Button, DisplayHeading, Eyebrow, GoldRule, Reveal, Section } from '@/components/ui';
import { getAbout } from '@/lib/content';
import { getDictionary, resolveLocale, type LocaleParams } from '@/lib/i18n';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(props);
  return pageMetadata(locale, '/about', { title: getDictionary(locale).nav.about });
}

export default async function AboutPage(props: LocaleParams) {
  const locale = await resolveLocale(props);
  const t = getDictionary(locale);
  const about = await getAbout(locale);

  return (
    <>
      <Section className="pt-32 md:pt-44" innerClassName="grid gap-12 md:grid-cols-[5fr_6fr] md:gap-20">
        <div className="md:sticky md:top-28 md:self-start">
          <div className="relative -mx-4 aspect-[4/5] overflow-hidden bg-paper-deep sm:mx-0">
            {about.portrait && (
              <Image
                src={about.portrait}
                alt={`Anna Avdalyan, ${about.voiceType}`}
                fill
                preload
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
        </div>

        <div>
          <Eyebrow>{t.about.eyebrow}</Eyebrow>
          <DisplayHeading as="h1" size="lg" className="mt-6">
            Anna <span className="italic">Avdalyan</span>
          </DisplayHeading>
          <p className="eyebrow mt-6 text-lapis">{about.voiceType}</p>
          <GoldRule tone="accent" className="mt-10" />

          <div className="rich-text mt-10 max-w-[38rem] text-[1.0625rem] leading-[1.8] text-ink-soft">
            {about.bio ? (
              <DocumentRenderer document={about.bio} />
            ) : (
              <p className="font-display text-2xl text-muted italic">{t.about.empty}</p>
            )}
          </div>

          {about.cvPdf && (
            <Button href={about.cvPdf} variant="ghost" className="mt-12" download>
              <Download aria-hidden className="size-4" strokeWidth={1.25} />
              {t.about.downloadCv}
            </Button>
          )}
        </div>
      </Section>

      {about.pressPhotos.length > 0 && (
        <Section variant="deep" aria-labelledby="press-photos">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <DisplayHeading id="press-photos" size="md">
              {t.about.pressKit}
            </DisplayHeading>
            <p className="max-w-sm text-sm text-muted">{t.about.pressKitHint}</p>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {about.pressPhotos.map((photo, i) => (
              <Reveal as="li" key={`${photo.src}-${i}`} delay={i * 0.05}>
                <div className="aspect-[4/5] overflow-hidden bg-paper">
                  {/* eslint-disable-next-line @next/next/no-img-element -- original file is served for download */}
                  <img src={photo.src} alt={photo.caption || 'Anna Avdalyan'} loading="lazy" className="size-full object-cover" />
                </div>
                {photo.caption && <p className="mt-3 text-xs leading-snug text-muted">{photo.caption}</p>}
                <a
                  href={photo.src}
                  download
                  className="link-draw mt-2 inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase"
                >
                  <Download aria-hidden className="size-3.5" strokeWidth={1.25} />
                  {t.about.download}
                </a>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
