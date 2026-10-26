import type { Metadata } from 'next';
import { PageIntro } from '@/components/PageIntro';
import { RepertoireIndex } from '@/components/RepertoireIndex';
import { Section } from '@/components/ui';
import { getRepertoire } from '@/lib/content';
import { getDictionary, resolveLocale, type LocaleParams } from '@/lib/i18n';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(props);
  return pageMetadata(locale, '/repertoire', { title: getDictionary(locale).nav.repertoire });
}

export default async function RepertoirePage(props: LocaleParams) {
  const locale = await resolveLocale(props);
  const t = getDictionary(locale);
  const items = await getRepertoire();

  return (
    <>
      <PageIntro eyebrow={t.repertoire.eyebrow} title={t.repertoire.title} />
      <Section className="pt-0 md:pt-0">
        {items.length > 0 ? (
          <RepertoireIndex items={items} labels={t.repertoire} />
        ) : (
          <p className="font-display text-2xl text-muted">{t.repertoire.empty}</p>
        )}
      </Section>
    </>
  );
}
