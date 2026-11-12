import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DocumentRenderer } from '@keystatic/core/renderer';
import { PageIntro } from '@/components/PageIntro';
import { Section } from '@/components/ui';
import { getImpressum } from '@/lib/content';
import { getDictionary, resolveLocale, type LocaleParams } from '@/lib/i18n';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(props);
  const meta = await pageMetadata(locale, '/impressum', { title: getDictionary(locale).impressum.title });
  return { ...meta, robots: { index: false, follow: true } };
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="py-8">
      <h2 className="eyebrow text-accent">{title}</h2>
      <div className="mt-4 leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

/** Legal notice (German law, § 5 DDG): plain text, edited under "Impressum" in the site admin. */
export default async function ImpressumPage(props: LocaleParams) {
  const locale = await resolveLocale(props);
  const t = getDictionary(locale).impressum;
  const imp = await getImpressum();

  const postal = (
    <address className="not-italic">
      {imp.name}
      {imp.address.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </address>
  );

  return (
    <>
      <PageIntro eyebrow={t.eyebrow} title={t.title} />
      <Section className="pt-0 md:pt-0">
        <div className="max-w-2xl divide-y divide-rule border-y border-rule text-[1.0625rem]">
          <Block title={t.provider}>{postal}</Block>

          {(imp.email || imp.phone) && (
            <Block title={t.contact}>
              {imp.phone && (
                <p>
                  {t.phone}: <a href={`tel:${imp.phone.replace(/[^\d+]/g, '')}`} className="link-draw">{imp.phone}</a>
                </p>
              )}
              {imp.email && (
                <p>
                  {t.email}: <a href={`mailto:${imp.email}`} className="link-draw">{imp.email}</a>
                </p>
              )}
            </Block>
          )}

          <Block title={t.responsible}>{postal}</Block>

          {imp.notes && (
            <div className="rich-text py-8 leading-relaxed text-ink-soft">
              <DocumentRenderer document={imp.notes} />
            </div>
          )}

          {imp.photoCredits.length > 0 && (
            <Block title={t.photoCredits}>
              <p>{imp.photoCredits.join(' · ')}</p>
            </Block>
          )}
        </div>
      </Section>
    </>
  );
}
