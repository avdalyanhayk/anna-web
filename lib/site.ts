export const SITE_URL = 'https://annaavdalyan.com';
export const ARTIST_NAME = 'Anna Avdalyan';

export const navItems = [
  { key: 'about', path: '/about' },
  { key: 'schedule', path: '/schedule' },
  { key: 'repertoire', path: '/repertoire' },
  { key: 'reviews', path: '/reviews' },
  { key: 'gallery', path: '/gallery' },
  { key: 'contact', path: '/contact' },
] as const;

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
