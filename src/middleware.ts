import { auth } from '@/lib/auth';

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== '/login') {
    const newUrl = new URL('/login', req.nextUrl.origin);
    newUrl.searchParams.set('callbackUrl', req.nextUrl.toString());
    return Response.redirect(newUrl);
  }

  if (req.auth && req.nextUrl.pathname === '/login') {
    const newUrl = new URL('/', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
