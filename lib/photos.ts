/**
 * Finds a gallery photo for a production or role by reading the gallery
 * captions, which editors already write as "Role - Work, Venue"
 * (e.g. "Mabel - The Pirates of Penzance, Schleswig-Holsteinisches Landestheater").
 * No extra admin field is needed: a matching caption is the link.
 */

export type CaptionedPhoto = { caption: string; category: string };

const STOP_WORDS = /\b(und|and|et|e|the|der|die|das|la|le|il|lo)\b/g;

/** Lowercase, no accents, no punctuation, no articles/conjunctions, no "(subtitle)". */
export function normalizeTitle(value: string): string {
  return value
    .replace(/\([^)]*\)/g, ' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(STOP_WORDS, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** "Role - Work, Venue" → { role, work } (normalized). Captions without a dash are treated as "Work, Venue". */
export function parseCaption(caption: string): { role: string; work: string } {
  const parts = caption.split(/\s+[-–—]\s+/);
  if (parts.length < 2) return { role: '', work: normalizeTitle(caption.split(',')[0] ?? '') };
  return { role: normalizeTitle(parts[0]), work: normalizeTitle(parts.slice(1).join(' ').split(',')[0] ?? '') };
}

const sameWork = (a: string, b: string) =>
  a.length >= 3 && b.length >= 3 && (a === b || a.startsWith(`${b} `) || b.startsWith(`${a} `));

/**
 * The best photo for a production/role: a caption naming the same work wins
 * (stage photos before portraits); otherwise an exact role name match.
 */
export function findPhoto<T extends CaptionedPhoto>(
  photos: T[],
  query: { works: (string | null | undefined)[]; role?: string | null },
): T | null {
  const works = query.works.filter(Boolean).map((w) => normalizeTitle(w as string));
  const role = query.role ? normalizeTitle(query.role) : '';
  const captioned = photos
    .filter((p) => p.caption.trim())
    .sort((a, b) => Number(b.category === 'stage') - Number(a.category === 'stage'));

  const parsed = captioned.map((p) => ({ photo: p, ...parseCaption(p.caption) }));
  const byWork = parsed.find((p) => works.some((w) => sameWork(w, p.work)) && (!role || !p.role || p.role === role));
  if (byWork) return byWork.photo;
  const byWorkAnyRole = parsed.find((p) => works.some((w) => sameWork(w, p.work)));
  if (byWorkAnyRole) return byWorkAnyRole.photo;
  const byRole = role.length >= 3 ? parsed.find((p) => p.role === role) : undefined;
  return byRole?.photo ?? null;
}
