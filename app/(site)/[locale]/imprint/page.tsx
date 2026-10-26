import type { Metadata } from 'next';
import { LegalDocument } from '@/components/LegalDocument';
import { getLegal } from '@/lib/content';
import { getDictionary, resolveLocale, type LocaleParams } from '@/lib/i18n';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(props);
  return pageMetadata(locale, '/imprint', { title: getDictionary(locale).legal.imprint });
}

export default async function Page(props: LocaleParams) {
  const locale = await resolveLocale(props);
  const t = getDictionary(locale);
  const legal = await getLegal(locale);
  return <LegalDocument eyebrow={t.common.imprint} title={t.legal.imprint} document={legal.imprint} empty={t.legal.empty} />;
}
