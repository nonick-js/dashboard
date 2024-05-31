import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth(async (req) => {
  const isAuthenticated = !!req.auth;

  if (req.nextUrl.pathname.startsWith('/login')) {
    if (isAuthenticated) return NextResponse.redirect(new URL('/', req.url));
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) from += req.nextUrl.search;
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url));
  }
});

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|manifest).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
