import type { Metadata } from 'next';
import Image from 'next/image';
import { DocumentRenderer } from '@keystatic/core/renderer';
import { Download } from 'lucide-react';
import { BioSwitcher } from '@/components/BioSwitcher';
import { CopyButton } from '@/components/CopyButton';
import { Button, DisplayHeading, Eyebrow, GoldRule, Reveal, Section } from '@/components/ui';
import { getAbout, getSettings } from '@/lib/content';
import { getDictionary, resolveLocale, type LocaleParams } from '@/lib/i18n';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(props);
  return pageMetadata(locale, '/about', { title: getDictionary(locale).nav.about });
}

export default async function AboutPage(props: LocaleParams) {
  const locale = await resolveLocale(props);
  const t = getDictionary(locale);
  const [about, settings] = await Promise.all([getAbout(locale), getSettings(locale)]);
  const hasManagement = Boolean(settings.managementAgency || settings.managementName || settings.managementEmail);

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

      <Section id="press-kit" variant="deep" aria-labelledby="press-kit-title" className="scroll-mt-16">
        <Eyebrow>{t.about.pressKit}</Eyebrow>
        <DisplayHeading id="press-kit-title" size="md" className="mt-4">
          {t.about.pressKitTitle}
        </DisplayHeading>
        <p className="mt-4 max-w-2xl text-muted">{t.about.pressKitHint}</p>
        <GoldRule tone="accent" className="mt-8" />

        <div className="mt-12 grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div className="space-y-10">
            {about.shortBio && (
              <div>
                <h3 className="eyebrow text-ink">{t.about.shortBio}</h3>
                <p className="mt-4 whitespace-pre-line text-ink-soft">{about.shortBio}</p>
                <CopyButton text={about.shortBio} label={t.about.copyShortBio} copiedLabel={t.about.copied} className="mt-6" />
              </div>
            )}
            {about.cvPdf && (
              <Button href={about.cvPdf} download>
                <Download aria-hidden className="size-4" strokeWidth={1.75} />
                {t.about.downloadCv}
              </Button>
            )}
            {hasManagement && (
              <address className="border-t border-champagne pt-6 not-italic">
                <h3 className="eyebrow text-ink">{t.about.management}</h3>
                <p className="mt-3 font-semibold">{settings.managementAgency}</p>
                {settings.managementName && <p className="text-ink-soft">{settings.managementName}</p>}
                {settings.managementEmail && (
                  <a href={`mailto:${settings.managementEmail}`} className="link-draw text-accent">
                    {settings.managementEmail}
                  </a>
                )}
              </address>
            )}
          </div>

          {about.pressPhotos.length > 0 && (
            <div>
              <h3 className="eyebrow text-ink">{t.about.pressPhotos}</h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6">
                {about.pressPhotos.map((photo, i) => (
                  <Reveal as="li" key={`${photo.src}-${i}`} delay={i * 0.05}>
                    <div className="aspect-[4/5] overflow-hidden bg-paper">
                      {/* eslint-disable-next-line @next/next/no-img-element -- original file is served for download */}
                      <img src={photo.src} alt={photo.caption || 'Anna Avdalyan'} loading="lazy" className="size-full object-cover" />
                    </div>
                    {photo.caption && <p className="mt-3 text-sm leading-snug text-muted">{photo.caption}</p>}
                    <a
                      href={photo.src}
                      download
                      className="link-draw mt-2 inline-flex items-center gap-2 text-[0.8125rem] font-semibold tracking-[0.12em] uppercase"
                    >
                      <Download aria-hidden className="size-4" strokeWidth={1.75} />
                      {t.about.download}
                    </a>
                  </Reveal>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
