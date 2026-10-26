import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Site admin — Anna Avdalyan',
  robots: { index: false, follow: false },
};

// Root layout for the admin: deliberately bare, no site chrome or fonts.
export default function KeystaticLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
