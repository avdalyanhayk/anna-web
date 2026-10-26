import type { PerformanceType, RepertoireCategory, RepertoireItem } from './content';

/** The parts of a schedule entry that feed the repertoire. */
export type ScheduledRole = {
  slug: string;
  title: string;
  /** Name of the work when it differs from the production title. */
  work: string;
  composer: string;
  role: string;
  type: PerformanceType;
  date: string;
  venue: string;
  city: string;
  addToRepertoire: boolean;
};

const CATEGORY_BY_TYPE: Record<PerformanceType, RepertoireCategory> = {
  opera: 'opera',
  concert: 'concert',
  recital: 'song',
};

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** Same work + composer + role = same repertoire entry (case and accents ignored). */
export const repertoireKey = (work: string, composer: string, role: string) =>
  [work, composer, role].map(normalize).join('|');

const performanceLabel = (p: ScheduledRole) =>
  [[p.venue, p.city].filter(Boolean).join(', '), p.date.slice(0, 4)].filter(Boolean).join(' ');

/**
 * Builds the public repertoire from the hand-made entries plus every role in
 * the schedule, so a role is entered once (in the schedule) and listed once.
 *
 * - Schedule entries with a role (and "add to repertoire" ticked) become entries.
 * - Several performances of the same role collapse into one entry whose
 *   details list the venues and years, newest first.
 * - A role counts as performed once any of its dates is before `today`;
 *   with only future dates it is "in preparation".
 * - A matching manual entry keeps its own details and recording; the
 *   scheduled performances are appended, and it is performed if either says so.
 */
export function mergeRepertoire(manual: RepertoireItem[], scheduled: ScheduledRole[], today: string): RepertoireItem[] {
  const groups = new Map<string, ScheduledRole[]>();
  for (const p of scheduled) {
    if (!p.addToRepertoire || !p.role.trim()) continue;
    const key = repertoireKey(p.work || p.title, p.composer, p.role);
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }

  const result = new Map<string, RepertoireItem>();
  for (const item of manual) result.set(repertoireKey(item.work, item.composer, item.role), item);

  for (const [key, performances] of groups) {
    const sorted = [...performances].sort((a, b) => b.date.localeCompare(a.date));
    const labels = [...new Set(sorted.map(performanceLabel).filter(Boolean))];
    const performed = sorted.some((p) => p.date < today);
    const latest = sorted[0];
    const existing = result.get(key);

    if (existing) {
      result.set(key, {
        ...existing,
        inPreparation: existing.inPreparation && !performed,
        details: [existing.details, ...labels.filter((l) => !existing.details.includes(l))].filter(Boolean).join(' · '),
        fromSchedule: true,
      });
    } else {
      result.set(key, {
        slug: `schedule-${latest.slug}`,
        work: latest.work || latest.title,
        composer: latest.composer,
        role: latest.role,
        category: CATEGORY_BY_TYPE[latest.type],
        inPreparation: !performed,
        details: labels.join(' · '),
        recording: null,
        recordingUrl: null,
        fromSchedule: true,
      });
    }
  }

  return [...result.values()];
}
