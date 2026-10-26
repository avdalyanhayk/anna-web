import type { MetadataRoute } from 'next';
import { localePath, locales } from '@/lib/i18n';
import { absoluteUrl, navItems } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', ...navItems.map((item) => item.path), '/imprint', '/privacy'];
  return paths.map((path) => ({
    url: absoluteUrl(localePath('en', path)),
    changeFrequency: path === '/schedule' || path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(localePath(l, path))])),
    },
  }));
}
