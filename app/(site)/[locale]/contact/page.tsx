import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { PageIntro } from '@/components/PageIntro';
import { Eyebrow, Section } from '@/components/ui';
import { getSettings } from '@/lib/content';
import { getDictionary, localePath, resolveLocale, type LocaleParams } from '@/lib/i18n';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(props);
  return pageMetadata(locale, '/contact', { title: getDictionary(locale).nav.contact });
}

export default async function ContactPage(props: LocaleParams) {
  const locale = await resolveLocale(props);
  const t = getDictionary(locale);
  const s = await getSettings(locale);
  const hasManagement = Boolean(s.managementAgency || s.managementName || s.managementEmail || s.managementPhone);

  return (
    <>
      <PageIntro eyebrow={t.contact.eyebrow} title={t.contact.title} />
      <Section className="pt-0 md:pt-0" innerClassName="grid gap-16 md:grid-cols-[5fr_6fr] md:gap-20">
        <div className="space-y-8">
          {hasManagement && (
            // Engraved business card: double hairline frame, centred small caps.
            <address className="border border-champagne p-1.5 not-italic">
              <div className="border border-champagne/60 px-6 py-10 text-center md:px-10 md:py-14">
                <Eyebrow className="text-accent">{t.contact.management}</Eyebrow>
                {s.managementAgency && <p className="mt-6 font-display text-3xl leading-tight">{s.managementAgency}</p>}
                {s.managementName && <p className="mt-3 text-ink-soft">{s.managementName}</p>}
                <span aria-hidden className="mx-auto mt-8 block h-px w-10 bg-champagne" />
                <div className="mt-8 space-y-2 text-[0.9375rem]">
                  {s.managementEmail && (
                    <p>
                      <a href={`mailto:${s.managementEmail}`} className="link-draw">
                        {s.managementEmail}
                      </a>
                    </p>
                  )}
                  {s.managementPhone && (
                    <p>
                      <a href={`tel:${s.managementPhone.replace(/[^\d+]/g, '')}`} className="link-draw tabular-nums">
                        {s.managementPhone}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </address>
          )}
        </div>

        <div>
          <h2 className="font-display text-3xl">{t.contact.formTitle}</h2>
          <p className="mt-3 text-muted">{t.contact.formHint}</p>
          <div className="mt-8">
            <ContactForm t={t.contact} privacyHref={localePath(locale, '/privacy')} />
          </div>
        </div>
      </Section>
    </>
  );
}
