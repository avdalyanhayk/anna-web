import type { Metadata } from 'next';
import { PageIntro } from '@/components/PageIntro';
import { PhotoGallery } from '@/components/PhotoGallery';
import { VideoFilmstrip } from '@/components/VideoFilmstrip';
import { DisplayHeading, Section } from '@/components/ui';
import { getPhotos, getVideos } from '@/lib/content';
import { getDictionary, resolveLocale, type LocaleParams } from '@/lib/i18n';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(props);
  return pageMetadata(locale, '/gallery', { title: getDictionary(locale).nav.gallery });
}

export default async function GalleryPage(props: LocaleParams) {
  const locale = await resolveLocale(props);
  const t = getDictionary(locale);
  const [videos, photos] = await Promise.all([getVideos(), getPhotos()]);

  return (
    <>
      <PageIntro eyebrow={t.gallery.eyebrow} title={t.gallery.title} />
      <nav aria-label={t.gallery.title} className="mx-auto -mt-4 mb-12 flex max-w-[1200px] gap-8 px-4 sm:px-6 md:px-10">
        <a href="#videos" className="link-draw eyebrow text-ink">
          {t.gallery.videos}
        </a>
        <a href="#photos" className="link-draw eyebrow text-ink">
          {t.gallery.photos}
        </a>
      </nav>

      <Section id="videos" variant="dark" aria-labelledby="videos-title" className="scroll-mt-16">
        <DisplayHeading id="videos-title" size="md" className="mb-12">
          {t.gallery.videos}
        </DisplayHeading>
        {videos.length > 0 ? (
          <VideoFilmstrip videos={videos} labels={{ playVideo: t.gallery.playVideo, moreVideos: t.gallery.moreVideos }} />
        ) : (
          <p className="font-display text-2xl text-paper/60 italic">{t.gallery.noVideos}</p>
        )}
      </Section>

      <Section id="photos" aria-labelledby="photos-title" className="scroll-mt-16">
        <DisplayHeading id="photos-title" size="md" className="mb-12">
          {t.gallery.photos}
        </DisplayHeading>
        {photos.length > 0 ? (
          <PhotoGallery photos={photos} openLabel={t.gallery.openPhoto} />
        ) : (
          <p className="font-display text-2xl text-muted italic">{t.gallery.noPhotos}</p>
        )}
      </Section>
    </>
  );
}
