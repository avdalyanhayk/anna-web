import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { PageIntro } from '@/components/PageIntro';
import { Section } from '@/components/ui';
import { getDictionary, localePath, resolveLocale, type LocaleParams } from '@/lib/i18n';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(props);
  return pageMetadata(locale, '/contact', { title: getDictionary(locale).nav.contact });
}

/** The contact form is the only way to reach Anna: no email or management details are shown. */
export default async function ContactPage(props: LocaleParams) {
  const locale = await resolveLocale(props);
  const t = getDictionary(locale);

  return (
    <>
      <PageIntro eyebrow={t.contact.eyebrow} title={t.contact.title} lede={t.contact.formHint} />
      <Section className="pt-0 md:pt-0">
        <div className="max-w-[760px]">
          <h2 className="font-display text-3xl">{t.contact.formTitle}</h2>
          <div className="mt-8">
            <ContactForm t={t.contact} privacyHref={localePath(locale, '/privacy')} />
          </div>
        </div>
      </Section>
    </>
  );
}
