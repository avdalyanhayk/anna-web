'use client';

import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import type { Photo } from '@/lib/content';

export default function PhotoLightbox({
  photos,
  index,
  onClose,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
}) {
  return (
    <Lightbox
      open
      index={index}
      close={onClose}
      plugins={[Captions, Zoom]}
      slides={photos.map((p) => ({ src: p.src, alt: p.alt, title: p.caption, description: p.credit }))}
      captions={{ descriptionTextAlign: 'center' }}
      zoom={{ maxZoomPixelRatio: 2.5, scrollToZoom: true }}
      controller={{ closeOnBackdropClick: true }}
      carousel={{ finite: false, padding: '4%' }}
      animation={{ swipe: 400 }}
    />
  );
}
