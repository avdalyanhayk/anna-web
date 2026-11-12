import type { RepertoireItem } from '@/lib/content';

/** "Johann Sebastian Bach (1685–1750)" → "Johann Sebastian Bach". */
const cleanComposer = (composer: string) => composer.replace(/\(.*?\)/g, ' ').replace(/\s+/g, ' ').trim();

/** Sort by surname, like a libretto index: "Wolfgang Amadeus Mozart" → "Mozart". */
const surname = (composer: string) => composer.split(' ').pop() ?? composer;

/**
 * Repertoire as a plain index (client request: as simple as possible): grouped
 * alphabetically by composer surname, each line just the work and the role.
 */
export function RepertoireIndex({ items, locale }: { items: RepertoireItem[]; locale: string }) {
  const collator = new Intl.Collator(locale, { sensitivity: 'base' });
  const groups = new Map<string, { composer: string; works: { work: string; role: string; key: string }[] }>();

  for (const item of items) {
    const composer = cleanComposer(item.composer);
    const key = composer.toLocaleLowerCase(locale);
    const group = groups.get(key) ?? { composer, works: [] };
    group.works.push({ work: item.work.trim(), role: item.role.trim(), key: item.slug });
    groups.set(key, group);
  }

  const sorted = [...groups.values()]
    .sort((a, b) => collator.compare(surname(a.composer), surname(b.composer)) || collator.compare(a.composer, b.composer))
    .map((g) => ({
      ...g,
      works: g.works.sort((a, b) => collator.compare(a.work, b.work) || collator.compare(a.role, b.role)),
    }));

  return (
    <dl className="max-w-3xl divide-y divide-rule border-y border-rule">
      {sorted.map(({ composer, works }) => (
        <div key={composer} className="grid gap-3 py-8 md:grid-cols-[14rem_1fr] md:gap-10">
          <dt className="eyebrow pt-1 text-accent">{composer || '—'}</dt>
          <dd>
            <ul className="space-y-2">
              {works.map(({ work, role, key }) => (
                <li key={key} className="text-[1.0625rem] leading-relaxed">
                  <span className="font-display text-lg font-medium">{work}</span>
                  {role && <span className="text-ink-soft"> — {role}</span>}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
