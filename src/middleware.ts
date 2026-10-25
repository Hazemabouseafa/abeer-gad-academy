import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let API, uploads, downloads and static files pass untouched
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/downloads') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Admin route protection: check for admin session cookie in production (excluding the login page)
  const isAdminRoute =
    /\/(ar|en)\/admin(\/.*)?$/.test(pathname) &&
    !pathname.includes('/admin/login');
  if (isAdminRoute) {
    const adminSession = request.cookies.get('abeer_admin_session')?.value;
    // In production, require admin token; redirect to login if missing
    if (!adminSession && process.env.NODE_ENV === 'production') {
      const locale = pathname.split('/')[1] || 'en';
      return NextResponse.redirect(
        new URL(`/${locale}/admin/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all request paths except api, uploads, downloads, _next, static files
  matcher: ['/((?!api|uploads|downloads|_next|_vercel|.*\\..*).*)', '/([\\w-]+)?/users/(.+)'],
};
