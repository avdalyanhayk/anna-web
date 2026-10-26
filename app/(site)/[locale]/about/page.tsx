import type { Metadata } from 'next';
import Image from 'next/image';
import { DocumentRenderer } from '@keystatic/core/renderer';
import { Download } from 'lucide-react';
import { BioSwitcher } from '@/components/BioSwitcher';
import { Button, DisplayHeading, Eyebrow, GoldRule, Section } from '@/components/ui';
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
            Anna Avdalyan
          </DisplayHeading>
          <p className="eyebrow mt-6 text-accent">{about.voiceType}</p>
          <GoldRule tone="accent" className="mt-10" />

          <div className="rich-text mt-10 max-w-[38rem] text-[1.125rem] leading-[1.75] text-ink-soft">
            {about.bio ? (
              <BioSwitcher shortBio={about.shortBio} labels={t.about}>
                <DocumentRenderer document={about.bio} />
              </BioSwitcher>
            ) : (
              <p className="text-lg text-muted">{about.shortBio || t.about.empty}</p>
            )}
          </div>

          {about.cvPdf && (
            <Button href={about.cvPdf} variant="ghost" className="mt-12" download>
              <Download aria-hidden className="size-4" strokeWidth={1.75} />
              {t.about.downloadCv}
            </Button>
          )}
        </div>
      </Section>
    </>
  );
}
