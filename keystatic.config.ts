import { collection, config, fields, singleton } from '@keystatic/core';

// Content lives in this repository. Locally Keystatic writes straight to disk;
// in production it commits to GitHub, which triggers a Vercel redeploy.
const storage =
  process.env.NODE_ENV === 'production'
    ? ({ kind: 'github', repo: 'avdalyanhayk/anna-web' } as const)
    : ({ kind: 'local' } as const);

const germanHint = 'Optional. Leave empty and the German site shows the English text.';

const richText = (label: string, description: string) =>
  fields.document({
    label,
    description,
    formatting: {
      inlineMarks: { bold: true, italic: true },
      listTypes: true,
      headingLevels: [2, 3],
      blockTypes: { blockquote: true },
      softBreaks: true,
    },
    links: true,
    dividers: true,
  });

export default config({
  storage,
  ui: {
    brand: { name: 'Anna Avdalyan — Site admin' },
    navigation: {
      Pages: ['home', 'about'],
      Performances: ['schedule', 'repertoire', 'reviews'],
      Media: ['gallery', 'videos'],
      Settings: ['settings'],
    },
  },
  singletons: {
    home: singleton({
      label: 'Home page',
      path: 'content/home',
      format: { data: 'json' },
      schema: {
        heroImage: fields.image({
          label: 'Hero portrait',
          description:
            'The large photo at the top of the home page. A tall (portrait) photo works best, at least 1600px high.',
          directory: 'public/images/home',
          publicPath: '/images/home/',
        }),
        headline: fields.text({
          label: 'Headline',
          description: 'A short line shown under your name, e.g. "A voice of luminous warmth".',
        }),
        subheadline: fields.text({
          label: 'Sub-headline',
          description: 'One more short line, e.g. "Opera · Concert · Recital".',
        }),
        intro: fields.text({
          label: 'Introduction',
          description: 'Two or three sentences introducing you, shown below the hero.',
          multiline: true,
        }),
        featuredVideoUrl: fields.url({
          label: 'Featured video (YouTube link)',
          description: 'Optional. Paste any YouTube link to show it on the home page.',
        }),
        ctaText: fields.text({
          label: 'Button text',
          description: 'Optional. Text of the button at the end of the home page, e.g. "Get in touch".',
        }),
        ctaLink: fields.text({
          label: 'Button link',
          description: 'Where the button goes. A page of this site like /contact, or a full web address.',
        }),
        de: fields.object(
          {
            headline: fields.text({ label: 'Headline (German)' }),
            subheadline: fields.text({ label: 'Sub-headline (German)' }),
            intro: fields.text({ label: 'Introduction (German)', multiline: true }),
            ctaText: fields.text({ label: 'Button text (German)' }),
          },
          { label: 'German version', description: germanHint },
        ),
      },
    }),

    about: singleton({
      label: 'About / Biography',
      path: 'content/about/',
      format: { data: 'json' },
      schema: {
        portrait: fields.image({
          label: 'Portrait',
          description: 'Shown next to your biography.',
          directory: 'public/images/about',
          publicPath: '/images/about/',
        }),
        voiceType: fields.text({
          label: 'Voice type',
          description: 'e.g. Soprano. Also used in the site title.',
          defaultValue: 'Soprano',
        }),
        voiceTypeDe: fields.text({ label: 'Voice type (German)', description: 'e.g. Sopran.', defaultValue: 'Sopran' }),
        bio: richText('Biography', 'Your biography. Use bold, italic and links as you like.'),
        bioDe: richText('Biography (German)', germanHint),
        cvPdf: fields.file({
          label: 'CV (PDF)',
          description: 'Optional. Visitors get a "Download CV" button.',
          directory: 'public/files',
          publicPath: '/files/',
        }),
        pressPhotos: fields.array(
          fields.object({
            image: fields.image({
              label: 'Photo',
              description: 'Use the full-resolution file, journalists download it as is.',
              directory: 'public/images/press',
              publicPath: '/images/press/',
              validation: { isRequired: true },
            }),
            caption: fields.text({ label: 'Caption & photographer', description: 'e.g. "Portrait — © Jane Doe"' }),
          }),
          {
            label: 'Press photos',
            description: 'High-resolution photos journalists can download.',
            itemLabel: (props) => props.fields.caption.value || 'Press photo',
          },
        ),
      },
    }),

    gallery: singleton({
      label: 'Photo gallery',
      path: 'content/gallery',
      format: { data: 'json' },
      schema: {
        photos: fields.array(
          fields.object({
            image: fields.image({
              label: 'Photo',
              description: 'Recommended: about 2000px on the longest side and under 5 MB.',
              directory: 'public/images/gallery',
              publicPath: '/images/gallery/',
              validation: { isRequired: true },
            }),
            caption: fields.text({ label: 'Caption', description: 'e.g. "Violetta — La traviata, Staatsoper"' }),
            credit: fields.text({ label: 'Photo credit', description: 'e.g. "© Jane Doe"' }),
            alt: fields.text({
              label: 'Description for screen readers',
              description: 'Describe what is in the photo, for visitors who cannot see it.',
            }),
          }),
          {
            label: 'Photos',
            description: 'Drag to reorder. The order here is the order on the website.',
            itemLabel: (props) => props.fields.caption.value || 'Photo',
          },
        ),
      },
    }),

    videos: singleton({
      label: 'Videos',
      path: 'content/videos',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({ label: 'Title', validation: { length: { min: 1 } } }),
            youtubeUrl: fields.url({
              label: 'YouTube link',
              description: 'Just paste the link from YouTube (any format works).',
              validation: { isRequired: true },
            }),
            description: fields.text({ label: 'Short description', multiline: true }),
            production: fields.text({ label: 'Production / occasion', description: 'e.g. "Gala concert, Vienna 2025"' }),
          }),
          {
            label: 'Videos',
            description: 'Drag to reorder. The first video is the featured one on the Gallery page.',
            itemLabel: (props) => props.fields.title.value || 'Video',
          },
        ),
      },
    }),

    settings: singleton({
      label: 'Site settings & contact',
      path: 'content/settings',
      format: { data: 'json' },
      schema: {
        siteTitle: fields.text({ label: 'Site title', defaultValue: 'Anna Avdalyan' }),
        seoDescription: fields.text({
          label: 'Search engine description',
          description: 'One or two sentences shown by Google under the site title.',
          multiline: true,
        }),
        seoDescriptionDe: fields.text({ label: 'Search engine description (German)', multiline: true }),
        contactEmail: fields.text({ label: 'Your contact email', description: 'Shown on the Contact page.' }),
        managementName: fields.text({ label: 'Manager name' }),
        managementAgency: fields.text({ label: 'Agency' }),
        managementEmail: fields.text({ label: 'Manager email' }),
        managementPhone: fields.text({ label: 'Manager phone' }),
        instagram: fields.url({ label: 'Instagram link' }),
        facebook: fields.url({ label: 'Facebook link' }),
        youtube: fields.url({ label: 'YouTube channel link' }),
        spotify: fields.url({ label: 'Spotify link' }),
        ogImage: fields.image({
          label: 'Sharing image',
          description: 'Shown when the site is shared on social media or messengers. Landscape, 1200 × 630px.',
          directory: 'public/images/settings',
          publicPath: '/images/settings/',
        }),
      },
    }),
  },

  collections: {
    schedule: collection({
      label: 'Schedule',
      path: 'content/schedule/*',
      format: { data: 'json' },
      slugField: 'title',
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({
          name: { label: 'Production', description: 'e.g. "La traviata" or "New Year Gala"' },
          slug: {
            label: 'File name',
            description:
              'Must be unique. For several dates of one production add the date, e.g. "la-traviata-2027-03-14".',
          },
        }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        time: fields.text({ label: 'Time', description: 'e.g. 19:30' }),
        type: fields.select({
          label: 'Type',
          options: [
            { label: 'Opera', value: 'opera' },
            { label: 'Concert', value: 'concert' },
            { label: 'Recital', value: 'recital' },
          ],
          defaultValue: 'opera',
        }),
        role: fields.text({ label: 'Role', description: 'e.g. Violetta Valéry. Leave empty for concerts.' }),
        composer: fields.text({ label: 'Composer', description: 'e.g. Giuseppe Verdi' }),
        venue: fields.text({ label: 'Venue', description: 'e.g. Wiener Staatsoper' }),
        city: fields.text({ label: 'City' }),
        country: fields.text({ label: 'Country' }),
        ticketsUrl: fields.url({ label: 'Tickets link', description: 'Optional. Adds a "Tickets" button.' }),
        notes: fields.text({ label: 'Notes', description: 'Optional, e.g. "Conductor: …, Director: …"', multiline: true }),
        notesDe: fields.text({ label: 'Notes (German)', description: germanHint, multiline: true }),
      },
    }),

    repertoire: collection({
      label: 'Repertoire',
      path: 'content/repertoire/*',
      format: { data: 'json' },
      slugField: 'work',
      columns: ['work', 'composer'],
      schema: {
        work: fields.slug({ name: { label: 'Work', description: 'e.g. "La bohème" or "Vier letzte Lieder"' } }),
        composer: fields.text({ label: 'Composer', description: 'Full name, e.g. Giacomo Puccini' }),
        role: fields.text({ label: 'Role', description: 'e.g. Mimì. Leave empty for songs or concert works.' }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Opera', value: 'opera' },
            { label: 'Concert / Oratorio', value: 'concert' },
            { label: 'Song / Recital', value: 'song' },
          ],
          defaultValue: 'opera',
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Performed', value: 'performed' },
            { label: 'In preparation', value: 'preparation' },
          ],
          defaultValue: 'performed',
        }),
      },
    }),

    reviews: collection({
      label: 'Press reviews',
      path: 'content/reviews/*',
      format: { data: 'json' },
      slugField: 'source',
      columns: ['source', 'date'],
      schema: {
        source: fields.slug({
          name: { label: 'Publication', description: 'e.g. "Opernwelt" or "The Guardian"' },
          slug: { label: 'File name', description: 'Must be unique, e.g. "opernwelt-2026-traviata".' },
        }),
        quote: fields.text({ label: 'Quote', multiline: true, validation: { length: { min: 1 } } }),
        critic: fields.text({ label: 'Critic', description: 'Name of the writer (optional).' }),
        production: fields.text({ label: 'Production', description: 'e.g. "La traviata, Oper Frankfurt"' }),
        date: fields.date({ label: 'Date of the review' }),
        link: fields.url({ label: 'Link to the article' }),
        featured: fields.checkbox({
          label: 'Show on home page',
          description: 'Featured reviews rotate on the home page.',
          defaultValue: false,
        }),
      },
    }),
  },
});
