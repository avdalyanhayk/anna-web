import { NextResponse, type NextRequest } from 'next/server';

// English is served at the root (/schedule) and German under /de (/de/schedule).
// Internally every page lives under app/(site)/[locale], so root paths are
// rewritten to /en/… and the redundant /en/… form redirects to the clean URL.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || '/';
    return NextResponse.redirect(url, 308);
  }

  if (pathname === '/de' || pathname.startsWith('/de/')) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|keystatic|_next|.*\\..*).*)'],
};
