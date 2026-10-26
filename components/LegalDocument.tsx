import { DocumentRenderer } from '@keystatic/core/renderer';
import type { RichDocument } from '@/lib/content';
import { PageIntro } from './PageIntro';
import { Section } from './ui';

/** Imprint / privacy page body: editable rich text from the "Imprint & privacy" singleton. */
export function LegalDocument({ title, eyebrow, document, empty }: { title: string; eyebrow: string; document: RichDocument | null; empty: string }) {
  return (
    <>
      <PageIntro eyebrow={eyebrow} title={title} />
      <Section className="pt-0 md:pt-0">
        <div className="rich-text max-w-[42rem] text-[1.0625rem] leading-[1.75] text-ink-soft">
          {document ? <DocumentRenderer document={document} /> : <p className="text-muted">{empty}</p>}
        </div>
      </Section>
    </>
  );
}
