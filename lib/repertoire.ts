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
  addToRepertoire: boolean;
};

const CATEGORY_BY_TYPE: Record<PerformanceType, RepertoireCategory> = {
  opera: 'opera',
  concert: 'concert',
};

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/**
 * Work name without subtitles, so "Jekyll & Hyde – The Musical" and
 * "Die Teufel von Loudun (The Devils of Loudun)" match their short titles.
 */
const workKey = (work: string) => normalize(work.replace(/\(.*?\)/g, ' ').split(/\s[–—-]\s/)[0]);

/** Surname only: the CV writes "Mozart", the schedule "Wolfgang Amadeus Mozart". */
const composerKey = (composer: string) => normalize(composer).split(' ').pop() ?? '';

/** Role words without connectors: "Nina / Schrätzel" equals "Nina and Schrätzel". */
const roleWords = (role: string) => new Set(normalize(role).split(' ').filter((w) => w && w !== 'and' && w !== 'und'));

const sameWords = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every((w) => b.has(w));
const within = (a: Set<string>, b: Set<string>) => a.size > 0 && [...a].every((w) => b.has(w));

/** Same work + composer + role words = one repertoire entry (case, accents, word order ignored). */
const repertoireKey = (work: string, composer: string, role: string) =>
  [workKey(work), composerKey(composer), [...roleWords(role)].sort().join(' ')].join('|');

/**
 * Builds the public repertoire from the hand-made entries plus every role in
 * the schedule, so a role is entered once (in the schedule) and listed once.
 * Each entry is just composer, work and role (client request: no venues or dates).
 *
 * - Schedule entries with a role (and "add to repertoire" ticked) become entries.
 * - Several performances of the same role collapse into one entry.
 * - A role counts as performed once any of its dates is before `today`;
 *   with only future dates it is "in preparation".
 * - A matching manual entry (same work and composer; same role words, or one
 *   role naming a subset of the other, e.g. "Sister Constance" / "Constance")
 *   keeps its own wording and recording, and it is performed if either the
 *   manual status or a past performance says so.
 */
export function mergeRepertoire(manual: RepertoireItem[], scheduled: ScheduledRole[], today: string): RepertoireItem[] {
  const groups = new Map<string, ScheduledRole[]>();
  for (const p of scheduled) {
    if (!p.addToRepertoire || !p.role.trim()) continue;
    const key = repertoireKey(p.work || p.title, p.composer, p.role);
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }

  const result = manual.map((item) => ({ ...item }));

  // Prefer a manual entry with exactly the same role words, then one whose role
  // words contain (or are contained in) the scheduled role's.
  const findManual = (p: ScheduledRole) => {
    const work = workKey(p.work || p.title);
    const composer = composerKey(p.composer);
    const words = roleWords(p.role);
    const candidates = result.filter(
      (m) => !m.slug.startsWith('schedule-') && workKey(m.work) === work && composerKey(m.composer) === composer,
    );
    return (
      candidates.find((m) => sameWords(roleWords(m.role), words)) ??
      candidates.find((m) => within(roleWords(m.role), words) || within(words, roleWords(m.role)))
    );
  };

  for (const performances of groups.values()) {
    const sorted = [...performances].sort((a, b) => b.date.localeCompare(a.date));
    const performed = sorted.some((p) => p.date < today);
    const latest = sorted[0];
    const existing = findManual(latest);

    if (existing) {
      existing.inPreparation = existing.inPreparation && !performed;
      existing.fromSchedule = true;
    } else {
      result.push({
        slug: `schedule-${latest.slug}`,
        work: (latest.work || latest.title).trim(),
        composer: latest.composer.trim(),
        role: latest.role.trim(),
        category: CATEGORY_BY_TYPE[latest.type],
        inPreparation: !performed,
        recording: null,
        recordingUrl: null,
        fromSchedule: true,
      });
    }
  }

  return result;
}
