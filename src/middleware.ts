import { NextResponse, type NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const PROTECTED_PATHS = ['/dashboard', '/editor', '/templates', '/settings'];

/**
 * Optimistic redirect based on the presence of the session cookie only —
 * no DB lookup at the edge. Real session validation happens server-side in
 * API routes (`withAuth`), so a forged cookie gets no data.
 *
 * Redirecting signed-in users away from /login is done by the auth pages
 * with a real session check; doing it here on a stale cookie would loop.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasSession = Boolean(getSessionCookie(request));

    if (!hasSession && PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.search = '';
        url.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes authenticate themselves)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
